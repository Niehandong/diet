from sqlalchemy import Column, String, DateTime, Float, Integer
from sqlalchemy.sql import func
from app.core.database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    record_date = Column(DateTime(timezone=True), server_default=func.now())
    weight = Column(Float)
    blood_pressure_systolic = Column(Integer)
    blood_pressure_diastolic = Column(Integer)
    sleep_hours = Column(Float)
    energy_level = Column(Integer)
    mood_level = Column(Integer)
    exercise_minutes = Column(Integer)
    notes = Column(String)

class DietRecord(Base):
    __tablename__ = "diet_records"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    recipe_id = Column(String)
    meal_type = Column(String)
    record_date = Column(DateTime(timezone=True), server_default=func.now())
    quantity = Column(Float)