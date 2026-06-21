from sqlalchemy import Column, String, Integer, JSON, ARRAY
from app.core.database import Base

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    ingredients = Column(JSON)
    steps = Column(ARRAY(String))
    suitable_constitutions = Column(ARRAY(String))
    suitable_terms = Column(ARRAY(String))
    five_elements = Column(ARRAY(String))
    difficulty = Column(Integer)
    taste_tags = Column(ARRAY(String))
    calories = Column(Integer)
    image_url = Column(String)