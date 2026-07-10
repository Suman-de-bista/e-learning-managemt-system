from app.utils.auths import (
    create_refresh_token,
    create_token,
    get_password_hash,
    get_user,
    revoke_refresh_token,
    rotate_refresh_token,
    set_auth_cookies,
    validate_email_format,
    verify_password,
)
from fastapi import APIRouter, HTTPException, Depends, Request
from passlib.context import CryptContext
from fastapi import Response

from app.models.users import Users, LoginModel, SignupModel

router = APIRouter(prefix="/auths", tags=["Auths"])
pwd_context = CryptContext(schemes=["bcrypt"])


@router.post("/signup")
async def signup(form_data: SignupModel):
    try:
        if not validate_email_format(form_data.email):
            raise HTTPException(400, detail="Invalid email format")
        if not await Users.get_user_by_email(form_data.email):
            password_hash = get_password_hash(form_data.password)
            user = await Users.add_new_user(form_data.email, form_data.name, password_hash=password_hash)
            if user:
                return user
        raise HTTPException(400, detail="Email Already Exists")
    except ValueError as e:
        raise HTTPException(400, detail=str(e))




@router.post("/login")
async def login(response:Response,form_data: LoginModel):
    try:
        if not validate_email_format(form_data.email):
            raise HTTPException(401, detail="Invalid email format")
        user = await Users.get_auth_by_email(form_data.email)
        if not user:
            raise HTTPException(401, detail="Email does not exist")
        if not verify_password(form_data.password, user.password):
            raise HTTPException(401, detail="Incorrect password")
        payload = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        access_token = create_token(payload)
        refresh_token = await create_refresh_token(user.id)
        set_auth_cookies(response, access_token, refresh_token)
        return user

    except Exception as e:
        raise HTTPException(401, detail=str(e))


@router.get("/me")
async def get_current_user(user = Depends(get_user)):
    return user


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, detail="Missing refresh token")
    try:
        user, new_refresh_token = await rotate_refresh_token(token)
    except Exception as e:
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token", path="/")
        raise HTTPException(401, detail=str(e))

    payload = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
    }
    access_token = create_token(payload)
    set_auth_cookies(response, access_token, new_refresh_token)
    return user


@router.post("/logout")
async def logout(request: Request, response:Response):
    token = request.cookies.get("refresh_token")
    if token:
        await revoke_refresh_token(token)
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}