from contextlib import asynccontextmanager

from backend.app.database import close_db, connect_db
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
    allow_origins=["http://localhost:5173"],   
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],              
)


@app.get("/")
async def root():
    return {"message": "Hello World"}