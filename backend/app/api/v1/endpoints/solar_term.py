from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.engines.solar_term_engine import get_current_solar_term, init_solar_terms
from app.models.solar_term import SolarTerm
from app.schemas.solar_term import SolarTermResponse

router = APIRouter()

@router.get("/current", response_model=SolarTermResponse)
def get_current(db: Session = Depends(get_db)):
    init_solar_terms(db)
    current_term = get_current_solar_term()
    db_term = db.query(SolarTerm).filter(SolarTerm.name == current_term["name"]).first()
    if not db_term:
        raise HTTPException(status_code=404, detail="Solar term not found")
    return db_term

@router.get("/all", response_model=List[SolarTermResponse])
def get_all(db: Session = Depends(get_db)):
    init_solar_terms(db)
    return db.query(SolarTerm).all()

@router.get("/{term_id}", response_model=SolarTermResponse)
def get_by_id(term_id: str, db: Session = Depends(get_db)):
    term = db.query(SolarTerm).filter(SolarTerm.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Solar term not found")
    return term