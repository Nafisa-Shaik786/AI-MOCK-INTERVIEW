from pydantic import BaseModel
from typing import Dict

class Question(BaseModel):
    question: str

class CompareRequest(BaseModel):
    question: str
    expected_answer: str
    user_answer: str

class CompareResponse(BaseModel):
    domain_scores: Dict[str, int]
    feedback: str