from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_analyze_resume():
    payload = {
        "resume_text": "Experienced Python React Developer with Node.js and AWS skills.",
        "filename": "test_resume.pdf"
    }
    response = client.post("/api/analyze-resume", json=payload)
    assert response.status_code == 200
    assert "ats_score" in response.json()
    assert response.json()["ats_score"] > 50

def test_job_matching():
    payload = {
        "resume_text": "Python FastAPI MongoDB React developer",
        "job_title": "Backend Engineer",
        "job_description": "We need a Python FastAPI developer with MongoDB experience."
    }
    response = client.post("/api/match-job", json=payload)
    assert response.status_code == 200
    assert response.json()["match_score"] >= 60
