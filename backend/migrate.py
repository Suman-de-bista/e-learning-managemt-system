import asyncio
from pathlib import Path

import asyncpg

from backend.config import DATABASE_URL

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"

async def run_migrations():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                filename VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMPTZ DEFAULT now()
            )
        """)

        applied = {r["filename"] for r in await conn.fetch("SELECT filename FROM schema_migrations")}
        print(list(MIGRATIONS_DIR.glob("*.sql")))
        for file in sorted(MIGRATIONS_DIR.glob("*.sql")):
            if file.name in applied:
                continue
            sql = file.read_text()
            async with conn.transaction():
                await conn.execute(sql)
                await conn.execute(
                    "INSERT INTO schema_migrations (filename) VALUES ($1)", file.name
                )
            print(f"Applied {file.name}")

    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run_migrations())