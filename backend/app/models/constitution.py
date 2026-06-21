from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class ConstitutionAssessment(Base):
    __tablename__ = "constitution_assessments"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    primary_type = Column(String)
    type_scores = Column(JSON)
    assessment_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(String)