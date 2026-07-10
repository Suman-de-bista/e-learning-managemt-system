from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS
from database import close_db, connect_db
from app.routes.auths import router as auths_router
from app.routes.users import router as users_router
from app.routes.instructors import router as instructors_router
from app.routes.courses import router as courses_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def Lifespan(app:FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="E-Learning Management System",
    description="An API for managing e-learning courses, users, and content.",
    lifespan=Lifespan
    )

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],              
)


app.include_router(auths_router)
app.include_router(users_router)
app.include_router(instructors_router)
app.include_router(courses_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}