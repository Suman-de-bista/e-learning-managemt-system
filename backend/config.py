from os import getenv

from dotenv import load_dotenv

load_dotenv()


DATABASE_URL: str = getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/elearning_db",
)

DATABASE_MIN_SIZE: int = int(getenv("DATABASE_MIN_SIZE", "2"))
DATABASE_MAX_SIZE: int = int(getenv("DATABASE_MAX_SIZE", "5"))

SECRET_KEY: str = getenv("SECRET_KEY", "")
ALGORITHM: str = getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS: int = int(getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

REFRESH_TOKEN_COOKIE_NAME: str = getenv("REFRESH_TOKEN_COOKIE_NAME", "refresh_token")
COOKIE_SECURE: bool = getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE: str = getenv("COOKIE_SAMESITE", "lax")
