import subprocess
import time
from pathlib import Path

import asyncpg
import pytest
from httpx import ASGITransport, AsyncClient

import database

TESTS_DIR = Path(__file__).parent
COMPOSE_FILE = TESTS_DIR / "docker-compose.test.yml"
MIGRATIONS_DIR = TESTS_DIR.parent / "migrations"

TEST_DATABASE_URL = "postgresql://postgres:password@localhost:5433/elearning_test_db"


def _compose(*args: str) -> None:
    subprocess.run(
        ["docker", "compose", "-f", str(COMPOSE_FILE), *args],
        check=True,
        capture_output=True,
    )


def _wait_for_postgres(timeout: float = 30.0) -> None:
    deadline = time.monotonic() + timeout
    result = subprocess.run(
        ["docker", "compose", "-f", str(COMPOSE_FILE), "ps", "-q", "postgres-test"],
        check=True,
        capture_output=True,
        text=True,
    )
    container_id = result.stdout.strip()
    while time.monotonic() < deadline:
        health = subprocess.run(
            ["docker", "inspect", "-f", "{{.State.Health.Status}}", container_id],
            capture_output=True,
            text=True,
        )
        if health.stdout.strip() == "healthy":
            return
        time.sleep(0.5)
    raise TimeoutError("Test database did not become healthy in time")


async def _run_migrations() -> None:
    conn = await asyncpg.connect(TEST_DATABASE_URL)
    try:
        for file in sorted(MIGRATIONS_DIR.glob("*.sql")):
            await conn.execute(file.read_text())
    finally:
        await conn.close()


@pytest.fixture(scope="session", autouse=True)
def test_database():
    _compose("up", "-d", "--wait")
    _wait_for_postgres()
    try:
        yield
    finally:
        _compose("down", "-v")


@pytest.fixture(scope="session", autouse=True)
async def migrated_database(test_database):
    await _run_migrations()


@pytest.fixture(autouse=True)
async def db_pool(migrated_database):
    pool = await asyncpg.create_pool(dsn=TEST_DATABASE_URL, min_size=1, max_size=5)
    database.pool = pool
    try:
        yield pool
    finally:
        await pool.close()
        database.pool = None


@pytest.fixture(autouse=True)
async def clean_tables(db_pool):
    yield
    async with db_pool.acquire() as conn:
        await conn.execute(
            "TRUNCATE TABLE refresh_tokens, courses, instructors, users RESTART IDENTITY CASCADE"
        )


@pytest.fixture
async def client(db_pool):
    from main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="https://test") as ac:
        yield ac


@pytest.fixture
async def create_user(db_pool):
    from app.models.users import Users
    from app.utils.auths import get_password_hash

    async def _create_user(
        name: str = "test",
        email: str = "test@example.com",
        password: str = "Password123!",
    ):
        password_hash = get_password_hash(password)
        user = await Users.add_new_user(email, name, password_hash=password_hash)
        return user, password

    return _create_user


@pytest.fixture
async def create_instructor(db_pool):
    from app.models.instructors import AddInstructorModel, Instructors

    async def _create_instructor(
        name: str = "test",
        expertise: str = "test",
        bio: str = "test",
    ):
        return await Instructors.add_new_instructor(
            AddInstructorModel(name=name, expertise=expertise, bio=bio)
        )

    return _create_instructor


@pytest.fixture
async def create_course(db_pool, create_instructor):
    from app.models.courses import AddCourseModel, Courses

    async def _create_course(
        instructor_id: int | None = None,
        title: str = "test",
        level: str = "test",
        duration_hours: int = 10,
    ):
        if instructor_id is None:
            instructor = await create_instructor()
            instructor_id = instructor.id
        return await Courses.add_new_course(
            AddCourseModel(
                instructor_id=instructor_id,
                title=title,
                level=level,
                duration_hours=duration_hours,
            )
        )

    return _create_course


@pytest.fixture
async def auth_client(client, create_user):
    user, password = await create_user()
    response = await client.post(
        "/auths/login", json={"email": user.email, "password": password}
    )
    assert response.status_code == 200
    return client, user
