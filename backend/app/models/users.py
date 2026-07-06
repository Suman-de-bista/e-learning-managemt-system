from pydantic import BaseModel, ConfigDict

from database import get_db


class UserModel(BaseModel):
    id: int
    name: str
    email: str
    password: str

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class SignupModel(BaseModel):
    name: str
    email: str
    password: str
    confirmPassword: str


class LoginModel(BaseModel):
    email: str
    password: str

class UserResponseModel(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True, extra="forbid")

class UserTable:
    async def add_new_user(self, email: str, name: str, password_hash: str):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """INSERT INTO users (email, name, password)
                   VALUES ($1, $2, $3)
                   RETURNING id, name, email""",
                email,
                name,
                password_hash,
            )
            return UserResponseModel.model_validate(dict(row))

    async def get_users(self):
        async with get_db() as conn:
            rows = await conn.fetch("""SELECT id, name, email FROM users""")
            return [UserResponseModel.model_validate(dict(row)) for row in rows]

    async def get_auth_by_email(self, email: str):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, name, email, password FROM users WHERE email = $1""",
                email,
            )
            return UserModel.model_validate(dict(row)) if row else None

    async def get_user_by_email(self, email: str):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, name, email FROM users WHERE email = $1""",
                email,
            )
            return UserResponseModel.model_validate(dict(row)) if row else None
        

Users = UserTable()
