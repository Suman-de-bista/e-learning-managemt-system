from app.models.users import EditUserModel, Users
from app.utils.auths import get_password_hash, get_user, validate_email_format
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
async def get_users(user = Depends(get_user)):
    return await Users.get_users()


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
