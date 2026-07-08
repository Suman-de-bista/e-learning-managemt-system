from typing import Optional

from fastapi import HTTPException
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

class EditUserModel(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

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

    async def get_user_by_id(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, name, email FROM users WHERE id = $1""",
                id,
            )
            return UserResponseModel.model_validate(dict(row)) if row else None

    async def update_user(self, id: int, data: EditUserModel):
        updates = data.model_dump(exclude_unset=True, exclude_none=True)
        if not updates:
            return await self.get_user_by_id(id)

        columns = list(updates.keys())
        set_clause = ", ".join(f"{col} = ${i + 1}" for i, col in enumerate(columns))
        values = [updates[col] for col in columns]

        async with get_db() as conn:
            row = await conn.fetchrow(
                f"""UPDATE users SET {set_clause}, updated_at = now()
                    WHERE id = ${len(columns) + 1}
                    RETURNING id, name, email""",
                *values,
                id,
            )
            return UserResponseModel.model_validate(dict(row)) if row else None
    
    async def delete_user(self, id: int):
        async with get_db() as conn:
            row = await conn.fetchrow(
                "DELETE FROM users WHERE id = $1 RETURNING id",
                id
                )
            if not row:
                raise HTTPException(status_code=404, detail="User not found")

            return {"message": "User deleted successfully"}


Users = UserTable()
