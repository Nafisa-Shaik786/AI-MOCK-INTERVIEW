from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_scores/")
async def analyze_scores(request: Request):
    data = await request.json()
    scores = data["scores"]

    weak_areas = {topic: score for topic, score in scores.items() if score < 60}

    with open("resources.json") as f:
        resource_db = json.load(f)

    learning_path = {
        topic: resource_db.get(topic, {"message": "No resource found"}) for topic in weak_areas
    }

    return {
        "weak_areas": weak_areas,
        "learning_path": learning_path,
        "weekly_plan": generate_weekly_plan(list(weak_areas.keys()))
    }

def generate_weekly_plan(topics):
    plan = {}
    per_week = 2
    for i in range(0, len(topics), per_week):
        week = f"Week {i // per_week + 1}"
        plan[week] = topics[i:i+per_week]
    return plan
  