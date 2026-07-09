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

    SORTABLE_COLUMNS = {"id", "name", "email"}

    async def get_users(
        self,
        page: int,
        limit: int,
        search: str | None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ):
        offset = (page - 1) * limit
        column = sort_by if sort_by in self.SORTABLE_COLUMNS else "id"
        direction = "DESC" if sort_order.lower() == "desc" else "ASC"
        async with get_db() as conn:
            if search:
                search_query = f"%{search}%"
                rows = await conn.fetch(
                    f"""SELECT id, name, email FROM users
                    WHERE name ILIKE $1 OR email ILIKE $1
                    ORDER BY {column} {direction}
                    LIMIT $2 OFFSET $3""",
                    search_query,
                    limit,
                    offset,
                )
                total = await conn.fetchval(
                    """SELECT COUNT(*) FROM users
                    WHERE name ILIKE $1 OR email ILIKE $1""",
                    search_query
                )
            else:
                rows = await conn.fetch(
                    f"""SELECT id, name, email FROM users
                    ORDER BY {column} {direction}
                    LIMIT $1 OFFSET $2""",
                    limit,
                    offset,
                )
                total = await conn.fetchval("""SELECT COUNT(*) FROM users""")
            return {
                "items": [UserResponseModel.model_validate(dict(row)) for row in rows],
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit if total else 0,
            }

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


class RefreshTokenTable:
    async def add_token(self, user_id: int, token_hash: str, expires_at):
        async with get_db() as conn:
            await conn.execute(
                """INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
                   VALUES ($1, $2, $3)""",
                user_id,
                token_hash,
                expires_at,
            )

    async def get_valid_token(self, token_hash: str):
        async with get_db() as conn:
            row = await conn.fetchrow(
                """SELECT id, user_id, token_hash, revoked, expires_at FROM refresh_tokens
                   WHERE token_hash = $1 AND revoked = FALSE AND expires_at > now()""",
                token_hash,
            )
            return dict(row) if row else None

    async def revoke_token(self, token_hash: str):
        async with get_db() as conn:
            await conn.execute(
                """UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1""",
                token_hash,
            )

    async def revoke_all_for_user(self, user_id: int):
        async with get_db() as conn:
            await conn.execute(
                """UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1""",
                user_id,
            )


Users = UserTable()
RefreshTokens = RefreshTokenTable()
