from contextlib import asynccontextmanager

import asyncpg

from config import DATABASE_MAX_SIZE, DATABASE_MIN_SIZE, DATABASE_URL

pool: asyncpg.Pool | None = None


async def connect_db():
    global pool
    pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=DATABASE_MIN_SIZE,
        max_size=DATABASE_MAX_SIZE,
    )


async def close_db():
    await pool.close()


@asynccontextmanager
async def get_db():
    try:
        async with pool.acquire() as conn:
            yield conn
    except Exception:
        raise
