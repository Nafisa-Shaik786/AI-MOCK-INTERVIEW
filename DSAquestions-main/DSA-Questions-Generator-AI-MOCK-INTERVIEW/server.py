from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import random

app = FastAPI()

# Load the questions database from pickle file
try:
    with open('questions_db.pkl', 'rb') as f:
        questions_db = pickle.load(f)
except (FileNotFoundError, pickle.UnpicklingError) as e:
    questions_db = {"easy": [], "medium": [], "hard": []}
    print(f"Error loading questions_db.pkl: {e}")

# Request body schema
class DifficultyRequest(BaseModel):
    difficulty: str

# Endpoint to get DSA questions
@app.post("/generate-questions/")
def generate_questions(request: DifficultyRequest):
    difficulty = request.difficulty.lower()
    if difficulty not in questions_db:
        return {"error": "Invalid difficulty level. Choose from: easy, medium, or hard."}
    
    num_questions = min(2, len(questions_db[difficulty]))
    questions = random.sample(questions_db[difficulty], num_questions)
    
    # ✅ RETURNING THE RESULT
    return {"difficulty": difficulty, "questions": questions}
