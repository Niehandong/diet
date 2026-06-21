from sqlalchemy import Column, String, Date, ARRAY
from app.core.database import Base

class SolarTerm(Base):
    __tablename__ = "solar_terms"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True)
    name_en = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    climate = Column(String)
    common_diseases = Column(ARRAY(String))
    recommended_foods = Column(ARRAY(String))
    forbidden_foods = Column(ARRAY(String))
    exercises = Column(ARRAY(String))