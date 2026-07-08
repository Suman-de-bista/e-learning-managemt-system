from typing import Optional

from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict

from database import get_db


class CoursesModel(BaseModel):
    id: int
    instructor_id: int
    title: str
    level: str
    duration_hours: int

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class AddCourseModel(BaseModel):
    instructor_id: int
    title: str
    level: str
    duration_hours: int


class EditCourseModel(BaseModel):
    title: Optional[str] = None
    level: Optional[str] = None
    duration_hours: Optional[int] = None


class CoursesTable:
    async def add_new_course(self, form_data: AddCourseModel):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """INSERT INTO courses (instructor_id, title, level, duration_hours)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id, instructor_id, title, level, duration_hours""",
                form_data.instructor_id,
                form_data.title,
                form_data.level,
                form_data.duration_hours
            )
            return CoursesModel.model_validate(dict(row))

    async def get_courses(self, page: int, limit: int):
        offset = (page - 1) * limit
        async with get_db() as conn:
            rows = await conn.fetch(
                """SELECT id, instructor_id, title, level, duration_hours FROM courses
                   ORDER BY id
                   LIMIT $1 OFFSET $2""",
                limit,
                offset,
            )
            total = await conn.fetchval("""SELECT COUNT(*) FROM courses""")
            return {
                "items": [CoursesModel.model_validate(dict(row)) for row in rows],
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit if total else 0,
            }


    async def get_course_by_id(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, instructor_id, title, level, duration_hours FROM courses WHERE id = $1""",
                id,
            )
            return CoursesModel.model_validate(dict(row)) if row else None

    async def update_course(self, id: int, data: EditCourseModel):
        updates = data.model_dump(exclude_unset=True, exclude_none=True)
        if not updates:
            return await self.get_course_by_id(id)

        columns = list(updates.keys())
        set_clause = ", ".join(f"{col} = ${i + 1}" for i, col in enumerate(columns))
        values = [updates[col] for col in columns]

        async with get_db() as conn:
            row = await conn.fetchrow(
                f"""UPDATE courses SET {set_clause}, updated_at = now()
                    WHERE id = ${len(columns) + 1}
                    RETURNING id, instructor_id, title, level, duration_hours""",
                *values,
                id,
            )
            return CoursesModel.model_validate(dict(row)) if row else None
    
    async def delete_course(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                "DELETE FROM courses WHERE id = $1 RETURNING id",
                id
                )
            if not row:
                raise HTTPException(status_code=404, detail="Course not found")

            return {"message": "Course deleted successfully"}


Courses = CoursesTable()
