from app.models.users import Users
from app.routes.auths import get_current_user
from app.utils.auths import get_user
from fastapi import APIRouter,Depends

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
async def get_users(user = Depends(get_user)):
    return await Users.get_users()
