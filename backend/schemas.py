# backend/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Literal

# Company Schemas
class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    company_id: int
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    company_id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

# Performance Rating Schemas
class PerformanceRatingBase(BaseModel):
    category: Literal["Technical Skills", "Communication", "Leadership", "Initiative"]
    rating: int

class PerformanceRatingCreate(PerformanceRatingBase):
    pass

class PerformanceRating(PerformanceRatingBase):
    id: int
    updated_at: datetime

    class Config:
        orm_mode = True

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    title: str
    email: EmailStr
    manager_id: Optional[int] = None  # Optional manager field

class EmployeeCreate(EmployeeBase):
    performance_ratings: List[PerformanceRatingCreate]  # Required performance ratings

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    email: Optional[EmailStr] = None
    manager_id: Optional[int] = None

class Employee(EmployeeBase):
    id: int
    company_id: int
    created_at: datetime
    updated_at: datetime
    performance_ratings: List[PerformanceRating] = []

    class Config:
        orm_mode = True
