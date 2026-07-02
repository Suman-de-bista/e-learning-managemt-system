from pydantic import BaseModel,ConfigDict
from asyncpg import Connection

class AuthModel(BaseModel):
    id: int
    name: str
    email: str
    password: str

    model_config = ConfigDict(from_attributes=True,extra="forbid")

class SignupModel(BaseModel):
    name: str
    email: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str

class AuthTable:
    async def add_new_user(self,conn: Connection,email:str,name:str,password_hash:str):
        row = await conn.fetchrow(
            """INSERT INTO users (email, name, password)
               VALUES ($1, $2, $3)
               RETURNING id, name, email""",
            email, name, password_hash,
        )
        return AuthModel.model_validate(**row)
    

    async def get_users(self,conn: Connection):
        rows = await conn.fetch(
            """SELECT * FROM users"""
        )
        return [AuthModel.model_validate(**row) for row in rows]
    

    async def get_user_by_email(self, conn:Connection,email:str):
        row = await conn.fetchrow(
            """SELECT * FROM users WHERE email = $1""",
            email,
        )
        return AuthModel.model_validate(**row) if row else None