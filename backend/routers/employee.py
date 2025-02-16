import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import SessionLocal
from backend.utils.authentication import get_current_user  # Token returns a user object

load_dotenv()  # Load environment variables

# Read required performance categories from .env
REQUIRED_CATEGORIES = set(os.getenv("REQUIRED_PERFORMANCE_CATEGORIES", "").split(","))

router = APIRouter(
    prefix="/employee",
    tags=["Employee"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Employee)
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if employee already exists for the company
    existing_employee = (
        db.query(models.Employee)
        .filter(models.Employee.email == employee.email,
                models.Employee.company_id == current_user.company_id)
        .first()
    )
    if existing_employee:
        raise HTTPException(status_code=400, detail="Employee with this email already exists")
    
    # Validate performance ratings
    if len(employee.performance_ratings) != len(REQUIRED_CATEGORIES):
        raise HTTPException(status_code=400, detail=f"All {len(REQUIRED_CATEGORIES)} performance metrics must be provided")
    
    if {r.category for r in employee.performance_ratings} != REQUIRED_CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid performance metrics categories")
    
    new_employee = models.Employee(
        company_id=current_user.company_id,
        name=employee.name,
        title=employee.title,
        email=employee.email,
        manager_id=employee.manager_id
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    # Add performance ratings for the new employee
    for rating in employee.performance_ratings:
        new_rating = models.PerformanceRating(
            employee_id=new_employee.id,
            category=rating.category,
            rating=rating.rating
        )
        db.add(new_rating)
    db.commit()
    db.refresh(new_employee)
    
    return new_employee

@router.get("/", response_model=List[schemas.Employee])
def read_employees(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Employee).filter(
        models.Employee.company_id == current_user.company_id
    ).all()

@router.get("/{employee_id}", response_model=schemas.Employee)
def read_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id,
        models.Employee.company_id == current_user.company_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(
    employee_id: int,
    employee_update: schemas.EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id,
        models.Employee.company_id == current_user.company_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if employee_update.name is not None:
        db_employee.name = employee_update.name
    if employee_update.title is not None:
        db_employee.title = employee_update.title
    if employee_update.email is not None:
        db_employee.email = employee_update.email
    if employee_update.manager_id is not None:
        db_employee.manager_id = employee_update.manager_id

    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id,
        models.Employee.company_id == current_user.company_id
    ).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"detail": "Employee deleted successfully"}
