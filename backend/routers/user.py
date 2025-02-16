# backend/routers/user.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

from backend import schemas, models
from backend.utils.authentication import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    oauth2_scheme_user,  # Use if needed
)
from backend.utils.authentication import get_db

router = APIRouter(
    tags=["User"],
    responses={404: {"description": "Not found"}},
)

@router.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Ensure the company exists
    company = db.query(models.Company).filter(models.Company.id == user.company_id).first()
    if not company:
        raise HTTPException(status_code=400, detail="Company does not exist")

    # Ensure the email isn't already registered
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Create the user with a hashed password
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        company_id=user.company_id,
        email=user.email,
        password_hash=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login_for_access_token(
    form_data: schemas.UserLogin, db: Session = Depends(get_db)
):
    # Authenticate user credentials
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Generate JWT access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "company_id": user.company_id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    # Return current authenticated user
    return current_user

@router.get("/companies", response_model=List[schemas.Company])
def get_companies(db: Session = Depends(get_db)):
    # Retrieve all companies
    companies = db.query(models.Company).all()
    return companies
