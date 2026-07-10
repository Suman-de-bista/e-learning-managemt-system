# E-Learning Management System

A full-stack e-learning platform for managing courses, instructors, and students, with JWT/cookie-based authentication and refresh-token rotation.

- **Backend**: FastAPI + PostgreSQL (asyncpg)
- **Frontend**: Next.js (App Router) + React 19 + Tailwind CSS

## Live Demo

- Frontend: `https://e-learning-managemt-system.vercel.app/`
- Backend API docs (Swagger UI): `https://elearning-backend-05nb.onrender.com/docs`

> These placeholders should be replaced once the app is deployed following the [Deployment](#deployment) section below.

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
│   ├── migrate.py        # Migration runner
│   └── render.yaml       # Render Blueprint for deployment
└── frontend/
    ├── app/               # Next.js routes (dashboard, register, ...)
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
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. Used server-side by `next.config.ts` (rewrites) and `proxy.ts`; the browser never calls this URL directly (see note below) | `http://localhost:8000` |

## Deployment

The demo is deployed with the **frontend on Vercel** and the **backend + database on Render**. Both are deployed manually from their dashboards.

### 1. Backend on Render

1. Push this repo to GitHub (if not already).
2. In the [Render dashboard](https://dashboard.render.com), choose **New > Blueprint** and point it at this repo. Render will read `backend/render.yaml` and provision:
   - a free PostgreSQL database (`elearning-db`)
   - a web service (`elearning-backend`) that runs `uv sync`, then on every boot runs `python migrate.py` (idempotent) before starting `uvicorn`
   - Alternatively, create the two resources manually: a Postgres instance, and a Python web service rooted at `backend/` with build command `pip install uv && uv sync --frozen` and start command `uv run uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Set the remaining env vars on the web service (`SECRET_KEY` is auto-generated by the blueprint; review `ALGORITHM`, token TTLs, etc. as needed).
4. **Important**: leave `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none` — the frontend and backend live on different domains, so cookies must be marked secure and cross-site or the browser will silently reject them and login will appear broken.
5. Once deployed, note the backend's public URL (e.g. `https://elearning-backend.onrender.com`).

### 2. Frontend on Vercel

1. In the [Vercel dashboard](https://vercel.com/new), import this repo.
2. Set the project's **root directory** to `frontend`.
3. Add environment variable `NEXT_PUBLIC_API_URL` = the Render backend URL from step 1.5 above.
4. Deploy. Note the resulting frontend URL (e.g. `https://your-app.vercel.app`).

### 3. Connect the two

1. Back in Render, update the backend's `ALLOWED_ORIGINS` env var to include the Vercel frontend URL (comma-separated if you need to keep `http://localhost:3000` too), then redeploy.
2. Verify login works end-to-end on the deployed frontend URL — check the browser's dev tools to confirm `access_token`/`refresh_token` cookies are being set.
3. Update the [Live Demo](#live-demo) links at the top of this README with the real URLs.

### Note: cross-domain cookies

Since the frontend (Vercel) and backend (Render) are on different domains, cookies set directly by the backend are treated by the browser as **third-party cookies** and get silently dropped even with `Secure; SameSite=None` set correctly — Chrome, Safari, and Firefox all block or partition third-party cookies by default.

To work around this, `next.config.ts` defines a rewrite (`/api/backend/:path* → NEXT_PUBLIC_API_URL/:path*`), and all browser-side API calls (`lib/apis/*.ts`) go through `/api/backend` instead of calling the Render URL directly. Next.js's server forwards the request/response (including `Set-Cookie`) transparently, so from the browser's perspective the cookie comes from the same site it's on (first-party) and is stored normally. Server-side code (`proxy.ts`) is unaffected and continues to call the backend URL directly, since that's a server-to-server call with no browser cookie jar involved.
