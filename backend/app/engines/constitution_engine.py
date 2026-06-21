from typing import Dict, List, Optional
from uuid import uuid4
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.constitution import ConstitutionAssessment
from app.schemas.constitution import ConstitutionQuestion, ConstitutionAssessmentRequest

CONSTITUTION_TYPES = [
    "BALANCED", "QI_DEFICIENCY", "YANG_DEFICIENCY", "YIN_DEFICIENCY",
    "PHLEGM_DAMP", "DAMP_HEAT", "BLOOD_STASIS", "QI_STAGNATION", "SPECIAL_CONSTITUTION"
]

CONSTITUTION_QUESTIONS = [
    ConstitutionQuestion(
        id="q1",
        question="你容易感到疲劳乏力吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"QI_DEFICIENCY": 3, "BALANCED": 0, "YANG_DEFICIENCY": 2}
    ),
    ConstitutionQuestion(
        id="q2",
        question="你畏寒怕冷吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"YANG_DEFICIENCY": 3, "BALANCED": 0, "YIN_DEFICIENCY": -1}
    ),
    ConstitutionQuestion(
        id="q3",
        question="你容易口干咽燥吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"YIN_DEFICIENCY": 3, "BALANCED": 0, "YANG_DEFICIENCY": -1}
    ),
    ConstitutionQuestion(
        id="q4",
        question="你体型偏胖、腹部肥满松软吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"PHLEGM_DAMP": 3, "BALANCED": 0, "DAMP_HEAT": 2}
    ),
    ConstitutionQuestion(
        id="q5",
        question="你容易生痤疮、口苦口臭吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"DAMP_HEAT": 3, "BALANCED": 0, "YIN_DEFICIENCY": 2}
    ),
    ConstitutionQuestion(
        id="q6",
        question="你皮肤容易出现瘀斑吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"BLOOD_STASIS": 3, "BALANCED": 0, "QI_STAGNATION": 2}
    ),
    ConstitutionQuestion(
        id="q7",
        question="你容易情绪低落、抑郁吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"QI_STAGNATION": 3, "BALANCED": 0, "YIN_DEFICIENCY": 2}
    ),
    ConstitutionQuestion(
        id="q8",
        question="你容易过敏吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"SPECIAL_CONSTITUTION": 3, "BALANCED": 0, "QI_DEFICIENCY": 2}
    ),
    ConstitutionQuestion(
        id="q9",
        question="你精力充沛、不易疲劳吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"BALANCED": 3, "QI_DEFICIENCY": -1, "YANG_DEFICIENCY": -1}
    ),
    ConstitutionQuestion(
        id="q10",
        question="你面色红润、精神饱满吗？",
        options=["从不", "偶尔", "经常", "总是"],
        scores={"BALANCED": 3, "BLOOD_STASIS": -1, "YIN_DEFICIENCY": -1}
    )
]

def get_constitution_questions():
    return CONSTITUTION_QUESTIONS

def calculate_constitution(answers: Dict[str, int]) -> Dict[str, float]:
    scores = {ctype: 0.0 for ctype in CONSTITUTION_TYPES}
    
    for q in CONSTITUTION_QUESTIONS:
        answer = answers.get(q.id, 1)
        for ctype, score in q.scores.items():
            scores[ctype] += score * (answer / 3.0)
    
    total = sum(scores.values())
    if total > 0:
        scores = {k: v / total for k, v in scores.items()}
    
    return scores

def get_primary_constitution(scores: Dict[str, float]) -> str:
    return max(scores, key=scores.get)

def create_assessment(
    db: Session,
    user_id: str,
    answers: Dict[str, int]
) -> ConstitutionAssessment:
    scores = calculate_constitution(answers)
    primary_type = get_primary_constitution(scores)
    
    assessment = ConstitutionAssessment(
        id=str(uuid4()),
        user_id=user_id,
        primary_type=primary_type,
        type_scores=scores,
        assessment_date=datetime.now()
    )
    
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

def get_user_assessments(db: Session, user_id: str) -> List[ConstitutionAssessment]:
    return db.query(ConstitutionAssessment).filter(
        ConstitutionAssessment.user_id == user_id
    ).order_by(ConstitutionAssessment.assessment_date.desc()).all()

def get_current_assessment(db: Session, user_id: str) -> Optional[ConstitutionAssessment]:
    return db.query(ConstitutionAssessment).filter(
        ConstitutionAssessment.user_id == user_id
    ).order_by(ConstitutionAssessment.assessment_date.desc()).first()