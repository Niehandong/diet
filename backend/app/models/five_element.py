from sqlalchemy import Column, String
from app.core.database import Base

class FiveElementFood(Base):
    __tablename__ = "five_element_foods"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True)
    element = Column(String)
    organ = Column(String)
    color = Column(String)
    properties = Column(String)
    benefits = Column(String)