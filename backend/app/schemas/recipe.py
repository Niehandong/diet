from pydantic import BaseModel
from typing import List, Dict

class RecipeResponse(BaseModel):
    id: str
    name: str
    description: str
    ingredients: List[Dict[str, str]]
    steps: List[str]
    suitable_constitutions: List[str]
    suitable_terms: List[str]
    five_elements: List[str]
    difficulty: int
    taste_tags: List[str]
    calories: int
    image_url: str

    class Config:
        from_attributes = True

class RecipeRecommendationRequest(BaseModel):
    taste_preferences: List[str] = []
    allergens: List[str] = []
    max_difficulty: int = 5