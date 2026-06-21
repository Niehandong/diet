from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4

from app.core.database import get_db
from app.models.health_record import HealthRecord, DietRecord
from app.schemas.health_record import HealthRecordCreate, HealthRecordResponse
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/record", response_model=HealthRecordResponse)
def create_health_record(
    record: HealthRecordCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    db_record = HealthRecord(
        id=str(uuid4()),
        user_id=current_user.id,
        weight=record.weight,
        blood_pressure_systolic=record.blood_pressure_systolic,
        blood_pressure_diastolic=record.blood_pressure_diastolic,
        sleep_hours=record.sleep_hours,
        energy_level=record.energy_level,
        mood_level=record.mood_level,
        exercise_minutes=record.exercise_minutes,
        notes=record.notes
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/records", response_model=List[HealthRecordResponse])
def get_health_records(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.record_date.desc()).all()

@router.post("/diet")
def record_diet(
    recipe_id: str,
    meal_type: str,
    quantity: float = 1.0,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    diet_record = DietRecord(
        id=str(uuid4()),
        user_id=current_user.id,
        recipe_id=recipe_id,
        meal_type=meal_type,
        quantity=quantity
    )
    db.add(diet_record)
    db.commit()
    db.refresh(diet_record)
    return {"message": "Diet record created successfully"}

@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    records = db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).all()
    
    if not records:
        return {"message": "No health records found"}
    
    avg_weight = sum(r.weight for r in records if r.weight) / len([r for r in records if r.weight])
    avg_sleep = sum(r.sleep_hours for r in records if r.sleep_hours) / len([r for r in records if r.sleep_hours])
    avg_energy = sum(r.energy_level for r in records if r.energy_level) / len([r for r in records if r.energy_level])
    
    return {
        "total_records": len(records),
        "average_weight": round(avg_weight, 1),
        "average_sleep": round(avg_sleep, 1),
        "average_energy": round(avg_energy, 1)
    }