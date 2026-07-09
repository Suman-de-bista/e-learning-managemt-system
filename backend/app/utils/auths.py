import hashlib
import re
import secrets
from app.models.users import RefreshTokens, UserModel, Users
from fastapi import BackgroundTasks, Depends, HTTPException, Request, Response, status
import uuid  # For generating session tokens
from passlib.context import CryptContext
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY","")
ALGORITHM = os.getenv("ALGORITHM","HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

bearer_security = HTTPBearer(auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def validate_email_format(email: str) -> bool:
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

def create_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def create_refresh_token(user_id: int) -> str:
    token = secrets.token_urlsafe(64)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    await RefreshTokens.add_token(user_id, hash_refresh_token(token), expires_at)
    return token


async def rotate_refresh_token(token: str):
    token_hash = hash_refresh_token(token)
    record = await RefreshTokens.get_valid_token(token_hash)
    if record is None:
        raise Exception("Invalid or expired refresh token")
    await RefreshTokens.revoke_token(token_hash)
    user = await Users.get_user_by_id(record["user_id"])
    if user is None:
        raise Exception("User not found")
    new_refresh_token = await create_refresh_token(user.id)
    return user, new_refresh_token


async def revoke_refresh_token(token: str):
    await RefreshTokens.revoke_token(hash_refresh_token(token))


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )


async def get_user(request: Request, response: Response, auth_token: HTTPAuthorizationCredentials = Depends(bearer_security)) -> UserModel:
    token = None

    if auth_token is not None:
        token = auth_token.credentials

    if token is None and "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    if token is None:
        return await _refresh_and_get_user(request, response)

    try:
        data = decode_token(token)
        if data is not None and "email" in data:
            user = await Users.get_user_by_email(data["email"])
            if user is None:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid Token",
                )
            return user
    except HTTPException:
        raise
    except Exception:
        return await _refresh_and_get_user(request, response)


async def _refresh_and_get_user(request: Request, response: Response) -> UserModel:
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token is None:
        raise HTTPException(status_code=403, detail="Not authenticated")

    try:
        user, new_refresh_token = await rotate_refresh_token(refresh_token)
    except Exception:
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token", path="/")
        raise HTTPException(status_code=401, detail="Invalid token")

    access_token = create_token({"id": user.id, "email": user.email, "name": user.name})
    set_auth_cookies(response, access_token, new_refresh_token)
    return user

    