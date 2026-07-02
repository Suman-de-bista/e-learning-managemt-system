from os import getenv

from dotenv import load_dotenv

load_dotenv()


DATABASE_URL: str = getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/elearning_db",
)

DATABASE_MIN_SIZE: int = int(getenv("DATABASE_MIN_SIZE", "2"))
DATABASE_MAX_SIZE: int = int(getenv("DATABASE_MAX_SIZE", "5"))
