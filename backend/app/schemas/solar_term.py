from pydantic import BaseModel
from datetime import date
from typing import List

class SolarTermResponse(BaseModel):
    id: str
    name: str
    name_en: str
    start_date: date
    end_date: date
    climate: str
    common_diseases: List[str]
    recommended_foods: List[str]
    forbidden_foods: List[str]
    exercises: List[str]

    class Config:
        from_attributes = True