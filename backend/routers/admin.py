import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from datetime import timedelta
from backend import schemas, models
from backend.database import SessionLocal, engine
from backend.utils.authentication import (
    authenticate_admin,
    create_access_token,
    get_current_admin,
    oauth2_scheme_admin,  # For potential future use
)

# Load environment variables from .env
load_dotenv()

# Set token expiration duration (default: 30 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Create database tables based on SQLAlchemy models (if not already created)
models.Base.metadata.create_all(bind=engine)

# Define API router for admin endpoints
router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    """
    Dependency that provides a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
async def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...)
):
    # Authenticate admin and generate a JWT access token
    admin_user = authenticate_admin(username, password)
    if not admin_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin_user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/company", response_model=schemas.Company)
def create_company(
    company: schemas.CompanyCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    # Ensure the company doesn't already exist
    existing_company = (
        db.query(models.Company).filter(models.Company.name == company.name).first()
    )
    if existing_company:
        raise HTTPException(
            status_code=400, detail="Company with this name already exists"
        )
    new_company = models.Company(name=company.name)
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company
