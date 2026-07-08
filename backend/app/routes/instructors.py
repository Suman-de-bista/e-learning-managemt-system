import io

from fastapi.responses import StreamingResponse

from app.models.users import EditUserModel, Users
from app.utils.auths import get_password_hash, get_user, validate_email_format
from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.models.instructors import AddInstructorModel, EditInstructorModel, Instructors
import csv

router = APIRouter(prefix="/instructors", tags=["Instructors"])

async def csv_instructor_generator():
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["id", "name", "expertise", "bio"])
    yield buffer.getvalue()
    buffer.seek(0)
    buffer.truncate(0)

    async for instructor in Instructors.get_all_instructors():
        writer.writerow([instructor.id, instructor.name, instructor.expertise, instructor.bio])
        yield buffer.getvalue()
        buffer.seek(0)
        buffer.truncate(0)
    

@router.get("/")
async def get_instructors(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    user = Depends(get_user)
):
    return await Instructors.get_instructors(page=page,limit=limit)


@router.get("/{instructor_id}")
async def get_instructors(
    instructor_id: int = Path(),
    user = Depends(get_user)
):
    return await Instructors.get_instructor_by_id(instructor_id)


@router.post("/")
async def add_instructor(form_data: AddInstructorModel, user = Depends(get_user)):
    try:
        return await Instructors.add_new_instructor(form_data)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))


@router.patch("/{instructor_id}")
async def update_instructor(instructor_id: int, form_data: EditInstructorModel, user = Depends(get_user)):
    updates = form_data.model_dump(exclude_unset=True, exclude_none=True)
    if not updates:
        raise HTTPException(400, detail="No fields provided to update")
    updated = await Instructors.update_instructor(instructor_id, EditInstructorModel(**updates))
    if not updated:
        raise HTTPException(404, detail="User not found")
    return updated


@router.delete("/{instructor_id}")
async def delete_user(instructor_id: int, user = Depends(get_user)):
    try:
        await Instructors.delete_instructor(instructor_id)
    except Exception as e:
        raise HTTPException(404, detail=str(e))
    

@router.get("/export/csv")
async def export_csv(user=Depends(get_user)):
    return StreamingResponse(
        csv_instructor_generator(),
        media_type="text/csv",
        headers={"content-Disposition": "attachment; filename=instructors.csv"}
    )
