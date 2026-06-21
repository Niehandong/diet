from fastapi import APIRouter, Depends
from datetime import date

from app.ai.qa_engine import get_qa_engine
from app.engines.solar_term_engine import get_current_solar_term

router = APIRouter()

@router.post("/ask")
def ask_question(question: str):
    current_date = date.today().strftime("%Y-%m-%d")
    current_term = get_current_solar_term()["name"]
    
    qa_engine = get_qa_engine()
    response = qa_engine.ask(question, current_date, current_term)
    
    return {"question": question, "answer": response}