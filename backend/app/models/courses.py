from datetime import datetime
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
    created_at: datetime

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


class CourseResponseModel(BaseModel):
    id: int
    instructor_name: str
    title: str
    level: str
    duration_hours: int
    created_at: datetime


class CoursesTable:
    async def add_new_course(self, form_data: AddCourseModel):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """INSERT INTO courses (instructor_id, title, level, duration_hours)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id, instructor_id, title, level, duration_hours, created_at""",
                form_data.instructor_id,
                form_data.title,
                form_data.level,
                form_data.duration_hours,
            )
            return CoursesModel.model_validate(dict(row))

    async def get_courses_by_instructor_id(
        self,
        instructor_id: int,
        page: int,
        limit: int,
        search: str | None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ):
        SORTABLE_COLUMNS = {"id", "title", "level", "created_at"}
        offset = (page - 1) * limit
        column = sort_by if sort_by in SORTABLE_COLUMNS else "id"
        direction = "DESC" if sort_order.lower() == "desc" else "ASC"
        async with get_db() as conn:
            try:
                if search:
                    search_query = f"%{search}%"
                    rows = await conn.fetch(
                        f"""SELECT c.id, i.name AS instructor_name, c.title, c.level, c.duration_hours, c.created_at FROM courses c
                        INNER JOIN instructors i ON c.instructor_id = i.id
                        WHERE instructor_id = $1
                        AND (c.title ILIKE $2 OR c.level ILIKE $2)
                        ORDER BY c.{column} {direction}
                        LIMIT $3 OFFSET $4""",
                        instructor_id,
                        search_query,
                        limit,
                        offset,
                    )
                    total = await conn.fetchval(
                        """SELECT COUNT(*) FROM courses
                                WHERE instructor_id = $1
                                    AND (title ILIKE $2 OR level ILIKE $2)""",
                        instructor_id,
                        search_query,
                    )
                else:
                    rows = await conn.fetch(
                        f"""SELECT courses.id, instructors.name AS instructor_name, title, level, duration_hours, courses.created_at FROM courses
                        INNER JOIN instructors ON courses.instructor_id = instructors.id
                        WHERE instructor_id = $1
                        ORDER BY courses.{column} {direction}
                        LIMIT $2 OFFSET $3""",
                        instructor_id,
                        limit,
                        offset,
                    )
                    total = await conn.fetchval(
                        """SELECT COUNT(*) FROM courses
                                WHERE instructor_id = $1""",
                        instructor_id,
                    )
                return {
                    "items": [CourseResponseModel.model_validate(dict(row)) for row in rows],
                    "total": total,
                    "page": page,
                    "limit": limit,
                    "total_pages": (total + limit - 1) // limit if total else 0,
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

    async def get_course_by_id(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, instructor_id, title, level, duration_hours, created_at FROM courses WHERE id = $1""",
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
                    RETURNING id, instructor_id, title, level, duration_hours, created_at""",
                *values,
                id,
            )
            return CoursesModel.model_validate(dict(row)) if row else None

    async def delete_course(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow("DELETE FROM courses WHERE id = $1 RETURNING id", id)
            if not row:
                raise HTTPException(status_code=404, detail="Course not found")

            return {"message": "Course deleted successfully"}


Courses = CoursesTable()
