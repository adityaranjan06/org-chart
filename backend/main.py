from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables

app = FastAPI()

allowed_origins = [os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.routers import admin, user, employee

# Register routers for admin, user, and employee endpoints
app.include_router(admin.router)
app.include_router(user.router)
app.include_router(employee.router)
