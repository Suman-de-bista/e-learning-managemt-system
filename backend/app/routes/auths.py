from app.utils.auths import create_token, create_token, get_password_hash, validate_email_format, verify_password
from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

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
                payload = {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name
                }
                token = create_token(payload)
                return {**user.model_dump(), "token": token}
        raise HTTPException(400, detail="Email Already Exists")
    except ValueError as e:
        raise HTTPException(400, detail=str(e))

    


@router.post("/login")
async def login(form_data: LoginModel):
    try:
        if not validate_email_format(form_data.email):
            raise HTTPException(401, detail="Invalid email format")
        user = Users.get_auth_by_email(form_data.email)
        if not user:
            raise HTTPException(401, detail="Email does not exist")
        if not verify_password(form_data.password,user.password):
            raise HTTPException(401, detail="Incorrect password")
        user_details = Users.get_user_by_email(form_data.email)
        token = create_token(user_details)
        return {**user_details.model_dump(), "token": token}
        
    except Exception as e:
        raise HTTPException(401, detail=e.detail) 


