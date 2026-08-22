from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import re

from app.config import settings
from app.schemas import (
    ResumeAnalysisRequest, ResumeAnalysisResponse,
    JobMatchRequest, JobMatchResponse,
    SkillGapRequest, SkillGapResponse, SkillItem,
    InterviewGenRequest, InterviewGenResponse,
    EvaluateAnswerRequest, EvaluateAnswerResponse
)
from app.services.nlp_parser import extract_and_normalize_skills
from app.services.ml_engine import calculate_ats_score, analyze_job_match

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Dedicated Python FastAPI Microservice for AI Resume Analysis, ML Job Matching, and NLP processing.",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": settings.ENV
    }

@app.post("/api/analyze-resume", response_model=ResumeAnalysisResponse, tags=["AI Processing"])
async def analyze_resume(payload: ResumeAnalysisRequest):
    print(f"[FastAPI Telemetry]: Analyzing resume text length: {len(payload.resume_text or '')}")
    result = calculate_ats_score(payload.resume_text)
    return ResumeAnalysisResponse(
        ats_score=result["ats_score"],
        skills_score=result["skills_score"],
        experience_score=result["experience_score"],
        keywords_score=result["keywords_score"],
        formatting_score=result["formatting_score"],
        extracted_skills=result["extracted_skills"],
        recommendations=result["recommendations"],
        model_version="v1.2.0"
    )

@app.post("/api/match-job", response_model=JobMatchResponse, tags=["AI Processing"])
async def match_job(payload: JobMatchRequest):
    score, tfidf_sim, skill_sim, matched, missing, recs = analyze_job_match(
        payload.resume_text, payload.job_description
    )
    return JobMatchResponse(
        match_score=score,
        semantic_similarity=skill_sim,
        tfidf_similarity=tfidf_sim,
        matched_skills=matched,
        missing_skills=missing,
        recommendations=recs,
        model_version="v1.2.0"
    )

@app.post("/api/extract-skills", tags=["NLP Processing"])
async def extract_skills(payload: dict):
    text = payload.get("text", "")
    skills = extract_and_normalize_skills(text)
    return {"skills": skills, "count": len(skills)}

@app.post("/api/skill-gap", response_model=SkillGapResponse, tags=["AI Processing"])
async def skill_gap(payload: SkillGapRequest):
    role = payload.target_role or "Senior Backend Engineer"
    resume_skills = set(payload.user_skills or [])

    role_dataset = {
        "Senior Backend Engineer": ["Docker", "Kubernetes", "PostgreSQL", "Redis", "Kafka"],
        "Java Enterprise Architect": ["Java", "Spring Boot", "MySQL", "Docker", "Kubernetes"],
        "Full Stack Developer": ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
        "DevOps Cloud Engineer": ["Terraform", "AWS", "Docker", "Kubernetes", "Linux", "CI/CD"]
    }

    target_reqs = role_dataset.get(role, ["Docker", "Kubernetes", "PostgreSQL", "Redis"])
    missing = [req for req in target_reqs if req not in resume_skills]

    missing_items = []
    for idx, item in enumerate(missing):
        prio = "Must Learn" if idx == 0 else "Recommended" if idx < 3 else "Optional"
        missing_items.append(SkillItem(name=item, category="Core Technical", priority=prio))

    if not missing_items:
        missing_items.append(SkillItem(name="Advanced System Architecture", category="Architecture", priority="Recommended"))

    weeks = [
        {"week": 1, "topic": f"{missing_items[0].name} Fundamentals & Architecture", "hours": 12},
        {"week": 2, "topic": f"{missing_items[min(1, len(missing_items)-1)].name} Advanced Configuration", "hours": 8},
        {"week": 3, "topic": "Microservices Integration & Performance Tuning", "hours": 10},
        {"week": 4, "topic": "Production Load Testing & Observability", "hours": 14}
    ]

    return SkillGapResponse(
        target_role=role,
        missing_skills=missing_items,
        roadmap_weeks=weeks
    )

@app.post("/api/generate-interview", response_model=InterviewGenResponse, tags=["AI Processing"])
async def generate_interview(payload: InterviewGenRequest):
    category = payload.category or "Technical System Design"
    
    questions = {
        "Technical System Design": {
            "question": "How would you design a high-throughput distributed rate limiter handling 100,000 requests per second across multi-region Kubernetes clusters?",
            "tips": ["Discuss Token Bucket / Sliding Window Log algorithms", "Explain Redis in-memory storage and distributed locks", "Mention HTTP 429 Retry-After headers"]
        },
        "Backend Architecture": {
            "question": "Explain how you would resolve database connection pool exhaustion in a high-traffic Node.js or Python microservice architecture.",
            "tips": ["Discuss connection pooling (pgBouncer / HikariCP)", "Mention asynchronous non-blocking I/O", "Explain read replicas and caching layers"]
        },
        "Algorithms & Data Structures": {
            "question": "How do you detect and handle circular dependencies in a large-scale module import graph?",
            "tips": ["Explain Topological Sort using Kahn's Algorithm", "Discuss Depth First Search (DFS) with node state coloring", "Mention cycle detection in directed graphs"]
        },
        "Behavioral Leadership": {
            "question": "Describe a scenario where a critical production outage occurred due to an unhandled edge case. How did you lead technical root-cause resolution?",
            "tips": ["Use STAR method (Situation, Task, Action, Result)", "Focus on blameless post-mortems and monitoring alerts", "Highlight preventive CI/CD testing measures"]
        }
    }

    selected = questions.get(category, questions["Technical System Design"])
    return InterviewGenResponse(
        question=selected["question"],
        category=category,
        tips=selected["tips"]
    )

@app.post("/api/evaluate-answer", response_model=EvaluateAnswerResponse, tags=["AI Processing"])
async def evaluate_answer(payload: EvaluateAnswerRequest):
    ans = (payload.user_answer or "").lower()
    word_count = len(re.findall(r'\w+', ans))

    if word_count < 10:
        return EvaluateAnswerResponse(
            score=45,
            clarity_score=50,
            technical_accuracy=40,
            feedback="Response is too brief. Provide a structured answer explaining core architecture, algorithms, and tradeoffs.",
            strengths=["Submitted response"],
            improvements=["Elaborate on specific technical algorithms", "Discuss database caching and horizontal scalability"]
        )

    # Dynamic Scoring based on technical keywords found in answer
    tech_keywords = re.findall(r'\b(redis|sliding window|token bucket|postgres|kafka|microservices|sharding|caching|load balancer|docker|kubernetes|replication|async)\b', ans)
    keyword_bonus = min(30, len(set(tech_keywords)) * 8)

    clarity = min(96, max(55, 60 + int(word_count * 0.4)))
    accuracy = min(98, max(50, 55 + keyword_bonus))
    score = int(round(clarity * 0.4 + accuracy * 0.6))

    strengths = []
    if tech_keywords:
        strengths.append(f"Identified core technical concepts: {', '.join(set(tech_keywords)[:3])}")
    strengths.append(f"Good response detail ({word_count} words)")

    improvements = []
    if "redis" not in ans and "caching" not in ans:
        improvements.append("Mention distributed in-memory caching (e.g. Redis) for low latency")
    if "header" not in ans and "status" not in ans:
        improvements.append("Discuss standard HTTP response codes and retry headers")

    return EvaluateAnswerResponse(
        score=score,
        clarity_score=clarity,
        technical_accuracy=accuracy,
        feedback=f"Good technical explanation! Your answer scored {score}% based on clarity and keyword accuracy.",
        strengths=strengths,
        improvements=improvements or ["Elaborate on fallback mechanisms for edge-case failures"]
    )

@app.post("/api/improve-resume", tags=["AI Processing"])
async def improve_resume(payload: dict):
    original = payload.get("original_text", "Worked on web app using React.")
    suggestion = "Engineered a responsive React-based web application with reusable component architecture, optimizing API response rendering and improving page load speeds by 35%."
    return {
        "original_text": original,
        "improved_suggestion": suggestion,
        "impact_metrics_added": ["35% load speed optimization", "reusable component architecture"],
        "model_version": "v1.2.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
