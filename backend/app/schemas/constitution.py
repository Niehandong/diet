from pydantic import BaseModel
from datetime import datetime
from typing import Dict

class ConstitutionQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    scores: dict[str, int]

class ConstitutionAssessmentRequest(BaseModel):
    answers: Dict[str, int]

class ConstitutionAssessmentResponse(BaseModel):
    id: str
    user_id: str
    primary_type: str
    type_scores: Dict[str, float]
    assessment_date: datetime