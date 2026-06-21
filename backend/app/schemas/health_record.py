from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HealthRecordCreate(BaseModel):
    weight: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    sleep_hours: Optional[float] = None
    energy_level: Optional[int] = None
    mood_level: Optional[int] = None
    exercise_minutes: Optional[int] = None
    notes: Optional[str] = None

class HealthRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: datetime
    weight: Optional[float]
    blood_pressure_systolic: Optional[int]
    blood_pressure_diastolic: Optional[int]
    sleep_hours: Optional[float]
    energy_level: Optional[int]
    mood_level: Optional[int]
    exercise_minutes: Optional[int]
    notes: Optional[str]

    class Config:
        from_attributes = True