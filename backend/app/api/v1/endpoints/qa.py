from fastapi import APIRouter, Depends
from datetime import date
from pydantic import BaseModel

from app.ai.qa_engine import get_qa_engine
from app.engines.solar_term_engine import get_current_solar_term

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: QuestionRequest):
    current_date = date.today().strftime("%Y-%m-%d")
    current_term = get_current_solar_term()["name"]
    
    qa_engine = get_qa_engine()
    response = qa_engine.ask(request.question, current_date, current_term)
    
    return {"question": request.question, "answer": response}