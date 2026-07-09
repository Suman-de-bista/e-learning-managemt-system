from typing import Optional

from app.models.users import EditUserModel, Users
from app.utils.auths import get_user
from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.models.courses import AddCourseModel, EditCourseModel, Courses

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/{instructor_id}")
async def get_courses_by_instructor_id(
    instructor_id: int = Path(),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("id"),
    sort_order: str = Query("asc"),
    user = Depends(get_user)
):
    return await Courses.get_courses_by_instructor_id(instructor_id,page=page,limit=limit,search=search,sort_by=sort_by,sort_order=sort_order)


@router.get("/course/{course_id}")
async def get_course(
    course_id: int = Path(),
    user = Depends(get_user)
):
    return await Courses.get_course_by_id(course_id)


@router.post("/")
async def add_course(form_data: AddCourseModel, user = Depends(get_user)):
    try:
        return await Courses.add_new_course(form_data)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))


@router.patch("/{course_id}")
async def update_course(course_id: int, form_data: EditCourseModel, user = Depends(get_user)):
    updates = form_data.model_dump(exclude_unset=True, exclude_none=True)
    if not updates:
        raise HTTPException(400, detail="No fields provided to update")
    updated = await Courses.update_course(course_id, EditCourseModel(**updates))
    if not updated:
        raise HTTPException(404, detail="User not found")
    return updated


@router.delete("/{course_id}")
async def delete_user(course_id: int, user = Depends(get_user)):
    try:
        await Courses.delete_course(course_id)
    except Exception as e:
        raise HTTPException(404, detail=str(e))