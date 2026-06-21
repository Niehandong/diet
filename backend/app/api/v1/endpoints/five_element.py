from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.engines.five_element_engine import (
    analyze_five_elements,
    get_element_recommendations,
    get_foods_by_element,
    get_all_foods
)
from app.schemas.five_element import FiveElementFoodResponse, FiveElementAnalysisResponse
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import UserResponse
from app.engines.constitution_engine import get_current_assessment

router = APIRouter()

@router.get("/analysis", response_model=FiveElementAnalysisResponse)
def get_analysis(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    assessment = get_current_assessment(db, current_user.id)
    if not assessment:
        element_scores = {"木": 1, "火": 1, "土": 1, "金": 1, "水": 1}
    else:
        element_scores = analyze_five_elements(assessment.primary_type)
    
    recommendations = get_element_recommendations(element_scores)
    
    return {
        "user_id": current_user.id,
        "element_scores": element_scores,
        "recommendations": recommendations
    }

@router.get("/foods", response_model=List[FiveElementFoodResponse])
def get_foods(
    element: str = None,
    db: Session = Depends(get_db)
):
    if element:
        return get_foods_by_element(db, element)
    return get_all_foods(db)