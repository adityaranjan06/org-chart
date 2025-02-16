from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, backref
from datetime import datetime
from backend.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to users belonging to the company
    users = relationship("User", back_populates="company")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Link back to the company
    company = relationship("Company", back_populates="users")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Self-referential relationship for manager/subordinates
    subordinates = relationship(
        "Employee",
        backref=backref('manager', remote_side=[id])
    )
    # Relationship to performance ratings
    performance_ratings = relationship(
        "PerformanceRating", back_populates="employee", cascade="all, delete"
    )

class PerformanceRating(Base):
    __tablename__ = "performance_ratings"
    __table_args__ = (
        # Enforce valid performance categories
        CheckConstraint(
            "category IN ('Technical Skills', 'Communication', 'Leadership', 'Initiative')",
            name='valid_category'
        ),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    category = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Link back to the employee
    employee = relationship("Employee", back_populates="performance_ratings")
