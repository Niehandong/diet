from pydantic import BaseModel
from typing import List

class FiveElementFoodResponse(BaseModel):
    id: str
    name: str
    element: str
    organ: str
    color: str
    properties: str
    benefits: str

    class Config:
        from_attributes = True

class FiveElementAnalysisResponse(BaseModel):
    user_id: str
    element_scores: dict[str, float]
    recommendations: List[str]