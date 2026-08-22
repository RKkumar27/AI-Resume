# AI Resume Analyzer + Job Matching Platform

An enterprise-grade, AI-powered career platform designed to help candidates analyze resumes against ATS standards, compare profiles to job descriptions, highlight skill gaps, generate tailored learning roadmaps, practice with AI mock interviews, and track job applications.

---

## Architecture Overview

```text
                         ┌──────────────────┐
                         │  React Frontend  │ (Port 5173)
                         └────────┬─────────┘
                                  │
                                  ▼
                       ┌────────────────────┐
                       │ Node.js + Express  │ (Port 5000)
                       │ Main API / BLogic  │
                       └─────────┬──────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
             MongoDB          FastAPI           AWS S3
             Database        AI Service       (Production Storage)
                            (Port 8000)
```

- **Frontend**: React + Vite + Vanilla CSS Design System + React Router DOM
- **Main Backend**: Node.js + Express.js + Mongoose
- **AI Microservice**: Python + FastAPI + Pydantic
- **Database**: MongoDB

---

## Phase 1 Status: Foundation Setup Complete

- [x] Project architecture directory layout
- [x] Unified `.gitignore` and `.env.example`
- [x] Frontend design system (variables, components, responsive layout)
- [x] Landing Page, Login Page, Register Page, and Dashboard Page placeholders
- [x] Mock dashboard data isolated in `frontend/src/mock/dashboardMockData.js`
- [x] Express backend with `/api/health` endpoint
- [x] FastAPI microservice with `/health` endpoint & `/docs` Swagger UI
- [x] Docker CLI sanity verification

---

## Running the Services Locally

### 1. Main Backend (Node/Express)
```bash
cd backend
npm install
npm run dev
# Health check: http://localhost:5000/api/health
```

### 2. AI Service (Python FastAPI)
```bash
cd ai-service
# Create and activate virtual environment (optional but recommended)
python -m venv .venv
# On Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
# Health check: http://localhost:8000/health
# Swagger Docs: http://localhost:8000/docs
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Application URL: http://localhost:5173
```
