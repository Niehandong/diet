from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.engines.constitution_engine import (
    get_constitution_questions,
    create_assessment,
    get_user_assessments,
    get_current_assessment
)
from app.schemas.constitution import (
    ConstitutionQuestion,
    ConstitutionAssessmentRequest,
    ConstitutionAssessmentResponse
)
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/questions", response_model=List[ConstitutionQuestion])
def get_questions():
    return get_constitution_questions()

@router.post("/assess", response_model=ConstitutionAssessmentResponse)
def assess(
    request: ConstitutionAssessmentRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return create_assessment(db, current_user.id, request.answers)

@router.get("/history", response_model=List[ConstitutionAssessmentResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return get_user_assessments(db, current_user.id)

@router.get("/current", response_model=ConstitutionAssessmentResponse)
def get_current(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    assessment = get_current_assessment(db, current_user.id)
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment found")
    return assessment