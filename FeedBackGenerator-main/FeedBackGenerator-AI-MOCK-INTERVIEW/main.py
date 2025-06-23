from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import google.generativeai as genai
import os
import json
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your Gemini API key as an environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")
genai.configure(api_key=GEMINI_API_KEY)

class ScoresInput(BaseModel):
    scores: dict = Field(
        ...,
        example={
            "Python": 55,
            "Data Science": 80,
            "Machine Learning": 45,
            "web development": 30
        }
    )

async def get_resources_and_plan(topic):
    prompt = (
        f"For the topic '{topic}', suggest 2 LinkedIn Learning courses and 2 YouTube videos (with titles and URLs) for a beginner, "
        "in this format:\n"
        "LinkedIn Learning:\n"
        "1. Title - URL\n"
        "2. Title - URL\n"
        "YouTube:\n"
        "1. Title - URL\n"
        "2. Title - URL\n"
        "Study Plan:\n"
        "Week 1: ...\n"
        "Week 2: ...\n"
        "Week 3: ...\n"
        "Week 4: ...\n"
        "Do not return JSON or code blocks, just plain text as above."
    )
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    text = response.text.strip()
    return {"raw_plan": text}

def parse_gemini_response(raw_plan: str):
    """
    Parse Gemini's plain text response into a structured dict.
    """
    result = {
        "linkedin_learning": [],
        "youtube": [],
        "study_plan": {}
    }
    # Extract LinkedIn Learning
    linkedin = re.findall(r"LinkedIn Learning:\s*(1\..*?)(?=YouTube:|$)", raw_plan, re.DOTALL)
    if linkedin:
        result["linkedin_learning"] = [
            line.strip().split(" - ", 1)
            for line in linkedin[0].strip().split("\n") if line.strip().startswith("1.") or line.strip().startswith("2.")
        ]
    # Extract YouTube
    youtube = re.findall(r"YouTube:\s*(1\..*?)(?=Study Plan:|$)", raw_plan, re.DOTALL)
    if youtube:
        result["youtube"] = [
            line.strip().split(" - ", 1)
            for line in youtube[0].strip().split("\n") if line.strip().startswith("1.") or line.strip().startswith("2.")
        ]
    # Extract Study Plan
    plan = re.findall(r"Study Plan:\s*(.*)", raw_plan, re.DOTALL)
    if plan:
        for line in plan[0].strip().split("\n"):
            if line.strip().lower().startswith("week"):
                parts = line.split(":", 1)
                if len(parts) == 2:
                    result["study_plan"][parts[0].strip()] = parts[1].strip()
    return result

@app.post("/analyze_scores/")
async def analyze_scores(input: ScoresInput):
    scores = input.scores
    weak_areas = {topic: score for topic, score in scores.items() if score < 60}
    if not weak_areas:
        return {
            "message": "No weak areas found!",
            "weak_areas": {},
            "detailed_monthly_plan": {}
        }

    detailed_plan = {}
    for topic in weak_areas:
        plan = await get_resources_and_plan(topic)
        structured = parse_gemini_response(plan.get("raw_plan", ""))
        detailed_plan[topic] = {
            "linkedin_learning": [
                {"title": item[0][3:].strip(), "url": item[1].strip()} for item in structured["linkedin_learning"] if len(item) == 2
            ],
            "youtube": [
                {"title": item[0][3:].strip(), "url": item[1].strip()} for item in structured["youtube"] if len(item) == 2
            ],
            "study_plan": structured["study_plan"]
        }

    return {
        "message": "Analysis complete. Here are your weak areas and suggested resources with a structured study plan.",
        "weak_areas": weak_areas,
        "detailed_monthly_plan": detailed_plan
    }