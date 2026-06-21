from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import constitution
from app.api.v1.endpoints import solar_term
from app.api.v1.endpoints import five_element
from app.api.v1.endpoints import recipe
from app.api.v1.endpoints import health_record
from app.api.v1.endpoints import qa

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(constitution.router, prefix="/constitution", tags=["constitution"])
api_router.include_router(solar_term.router, prefix="/solar-term", tags=["solar-term"])
api_router.include_router(five_element.router, prefix="/five-element", tags=["five-element"])
api_router.include_router(recipe.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(health_record.router, prefix="/health", tags=["health"])
api_router.include_router(qa.router, prefix="/qa", tags=["qa"])