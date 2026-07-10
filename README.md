# E-Learning Management System

A full-stack e-learning platform for managing courses, instructors, and students, with JWT/cookie-based authentication and refresh-token rotation.

- **Backend**: FastAPI + PostgreSQL (asyncpg)
- **Frontend**: Next.js (App Router) + React 19 + Tailwind CSS

## Live Demo

[https://e-learning-managemt-system.vercel.app/](https://e-learning-managemt-system.vercel.app/)

## Tech Stack

**Backend**
- FastAPI
- PostgreSQL via `asyncpg`
- JWT auth (`pyjwt`) with httpOnly cookies and refresh-token rotation
- Password hashing via `passlib`/`bcrypt`
- Plain SQL migrations, applied with a custom migration runner (`migrate.py`)
- `pytest` + `pytest-asyncio` + `httpx` for testing
- Dependency management via [`uv`](https://github.com/astral-sh/uv)

**Frontend**
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS, shadcn/ui components, `react-hook-form` + `zod`
- A Next.js proxy (`proxy.ts`) that guards `/dashboard` routes and silently refreshes the access token using the refresh-token cookie

## Features

- Signup / login / logout with access + refresh token cookies
- Automatic refresh-token rotation and session restoration
- User, instructor, and course management APIs
- Instructor dashboards and course listings in the frontend

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── models/       # Pydantic models + DB access (Users, Courses, Instructors, ...)
│   │   ├── routes/       # FastAPI routers: auths, users, instructors, courses
│   │   └── utils/        # Auth helpers (JWT, password hashing, cookies)
│   ├── migrations/       # Versioned .sql migration files
│   ├── tests/            # Pytest test suite
│   ├── main.py           # FastAPI app entrypoint
│   ├── config.py         # Env-driven configuration
│   ├── database.py       # asyncpg connection pool
│   └── migrate.py        # Migration runner
└── frontend/
    ├── app/               # Next.js routes (dashboard, register, ...)
    │   └── api/backend/   # Route handler that proxies browser API calls to the backend
    ├── components/        # UI components
    ├── lib/               # API clients, types, session context
    └── proxy.ts           # Auth-aware routing/refresh proxy
```

## Getting Started (Local Development)

### Prerequisites
- Python 3.13 and [`uv`](https://docs.astral.sh/uv/getting-started/installation/)
- Node.js 20+
- A running PostgreSQL instance

### Backend

```bash
cd backend
uv sync
cp .env.example .env   # then edit DATABASE_URL, SECRET_KEY, etc.
uv run python migrate.py       # applies all pending SQL migrations
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to the backend URL
npm run dev
```

The app will be available at `http://localhost:3000`.

## Running Tests

```bash
cd backend
uv run pytest
```

## Linting & Formatting

### Backend (Ruff)

```bash
cd backend
uv run ruff check .            # lint
uv run ruff check . --fix      # lint, auto-fixing what it can
uv run ruff format .            # format
uv run ruff format --check .    # check formatting without writing
```

### Frontend (ESLint + Prettier)

```bash
cd frontend
npm run lint            # lint
npm run format           # format (writes changes)
npm run format:check     # check formatting without writing
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://postgres:password@localhost:5432/elearning_db` |
| `DATABASE_MIN_SIZE` / `DATABASE_MAX_SIZE` | Connection pool bounds | `2` / `5` |
| `SECRET_KEY` | JWT signing secret | _(empty — must be set)_ |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `7` |
| `COOKIE_SECURE` | Send cookies only over HTTPS | `false` |
| `COOKIE_SAMESITE` | Cookie `SameSite` policy | `lax` |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. Used server-side by the `/api/backend` route handler and `proxy.ts`; the browser never calls this URL directly | `http://localhost:8000` |

