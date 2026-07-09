from typing import Optional

from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict

from database import get_db


class InstructorModel(BaseModel):
    id: int
    name: str
    expertise: str
    bio: str

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class AddInstructorModel(BaseModel):
    name: str
    expertise: str
    bio: str


class EditInstructorModel(BaseModel):
    name: Optional[str] = None
    expertise: Optional[str] = None
    bio: Optional[str] = None

class InstructorResponseModel(BaseModel):
    id: int
    name: str
    expertise: str
    bio: str
    courses_count: int


class InstructorTable:
    async def add_new_instructor(self, form_data: AddInstructorModel):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """INSERT INTO instructors (name, expertise, bio)
                   VALUES ($1, $2, $3)
                   RETURNING id, name, expertise, bio""",
                form_data.name,
                form_data.expertise,
                form_data.bio
            )
            return InstructorModel.model_validate(dict(row))

    async def get_instructors(self, page: int, limit: int):
        offset = (page - 1) * limit
        async with get_db() as conn:
            try:
                rows = await conn.fetch(
                    """SELECT i.id, i.name, i.expertise, i.bio, COUNT(c.id) AS courses_count FROM instructors i
                    LEFT JOIN courses c ON c.instructor_id = i.id
                    GROUP BY i.id, i.name, i.expertise, i.bio
                    ORDER BY id
                    LIMIT $1 OFFSET $2""",
                    limit,
                    offset,
                )
                total = await conn.fetchval("""SELECT COUNT(*) FROM instructors""")
                return {
                    "items": [InstructorResponseModel.model_validate(dict(row)) for row in rows],
                    "total": total,
                    "page": page,
                    "limit": limit,
                    "total_pages": (total + limit - 1) // limit if total else 0,
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
    
    async def get_all_instructors(self):
        async with get_db() as conn:
            async with conn.transaction():
                async for row in conn.cursor(
                    """SELECT id, name, expertise, bio FROM instructors ORDER BY id""",
                ):
                    yield InstructorModel.model_validate(dict(row))


    async def get_instructor_by_id(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, name, expertise, bio FROM instructors WHERE id = $1""",
                id,
            )
            return InstructorModel.model_validate(dict(row)) if row else None

    async def update_instructor(self, id: int, data: EditInstructorModel):
        updates = data.model_dump(exclude_unset=True, exclude_none=True)
        if not updates:
            return await self.get_instructor_by_id(id)

        columns = list(updates.keys())
        set_clause = ", ".join(f"{col} = ${i + 1}" for i, col in enumerate(columns))
        values = [updates[col] for col in columns]

        async with get_db() as conn:
            row = await conn.fetchrow(
                f"""UPDATE instructors SET {set_clause}, updated_at = now()
                    WHERE id = ${len(columns) + 1}
                    RETURNING id, name, expertise, bio""",
                *values,
                id,
            )
            return InstructorModel.model_validate(dict(row)) if row else None
    
    async def delete_instructor(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                "DELETE FROM instructors WHERE id = $1 RETURNING id",
                id
                )
            if not row:
                raise HTTPException(status_code=404, detail="Instructor not found")

            return {"message": "Instructor deleted successfully"}
    

    async def add_instructors_from_csv(self, names:list[str], expertises: list[str], bio: list[str]):
        async with get_db() as conn:
            try:
                result = await conn.fetch(
                                """
                                INSERT INTO instructors (name, expertise, bio)
                                SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[])
                                RETURNING id
                                """,
                                names, expertises, bio,
                            )
                return result
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))



Instructors = InstructorTable()
