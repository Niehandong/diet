from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.engines.recipe_engine import (
    get_all_recipes,
    get_recipe_by_id,
    search_recipes,
    recommend_recipes
)
from app.engines.constitution_engine import get_current_assessment
from app.engines.solar_term_engine import get_current_solar_term
from app.schemas.recipe import RecipeResponse
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/", response_model=List[RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return get_all_recipes(db)

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.get("/search/{keyword}", response_model=List[RecipeResponse])
def search(keyword: str, db: Session = Depends(get_db)):
    return search_recipes(db, keyword)

@router.get("/recommend", response_model=List[RecipeResponse])
def recommend(
    taste_preferences: Optional[str] = Query(None),
    max_difficulty: int = Query(5, ge=1, le=5),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    taste_list = taste_preferences.split(",") if taste_preferences else []

    assessment = get_current_assessment(db, current_user.id)
    constitution_type = assessment.primary_type if assessment else None

    current_term = get_current_solar_term()
    solar_term_name = current_term["name"]

    return recommend_recipes(
        db,
        constitution_type=constitution_type,
        solar_term=solar_term_name,
        taste_preferences=taste_list,
        max_difficulty=max_difficulty
    )