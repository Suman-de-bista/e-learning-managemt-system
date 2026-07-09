from typing import Optional

from app.models.users import EditUserModel, Users
from app.utils.auths import get_password_hash, get_user, validate_email_format
from fastapi import APIRouter, Depends, HTTPException, Path, Query

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("id"),
    sort_order: str = Query("asc"),
    user = Depends(get_user)
):
    return await Users.get_users(page=page, limit=limit, search=search, sort_by=sort_by, sort_order=sort_order)

@router.get("/{user_id}")
async def get_user_by_id(
    user_id: int = Path(),
    user = Depends(get_user)
):
    return await Users.get_user_by_id(user_id)


@router.patch("/{user_id}")
async def update_user(user_id: int, form_data: EditUserModel, user = Depends(get_user)):
    updates = form_data.model_dump(exclude_unset=True, exclude_none=True)
    if not updates:
        raise HTTPException(400, detail="No fields provided to update")
    if "email" in updates and not validate_email_format(updates["email"]):
        raise HTTPException(400, detail="Invalid email format")
    if "password" in updates:
        updates["password"] = get_password_hash(updates["password"])

    updated = await Users.update_user(user_id, EditUserModel(**updates))
    if not updated:
        raise HTTPException(404, detail="User not found")
    return updated


@router.delete("/{user_id}")
async def delete_user(user_id: int, user = Depends(get_user)):
    if user.id == user_id:
        raise HTTPException(403, detail="Cannot delete own account.")
    try:
        await Users.delete_user(user_id)
    except Exception as e:
        raise HTTPException(404, detail=str(e))