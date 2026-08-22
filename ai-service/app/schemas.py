from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Raw text extracted from resume")
    filename: Optional[str] = "resume.pdf"
    target_role: Optional[str] = "Software Engineer"

class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    skills_score: int
    experience_score: int
    keywords_score: int
    formatting_score: int
    extracted_skills: List[str]
    recommendations: List[str]
    model_version: str = "v1.2.0"
    methodology: str = "Transformer Semantic Embeddings + TF-IDF Baseline"

class JobMatchRequest(BaseModel):
    resume_text: str
    job_title: str
    job_description: str

class JobMatchResponse(BaseModel):
    match_score: int
    semantic_similarity: float
    tfidf_similarity: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    model_version: str = "v1.2.0"

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class SkillItem(BaseModel):
    name: str
    category: str
    priority: str  # Must Learn | Recommended | Optional

class SkillGapResponse(BaseModel):
    target_role: str
    missing_skills: List[SkillItem]
    roadmap_weeks: List[dict]

class InterviewGenRequest(BaseModel):
    target_role: str
    category: Optional[str] = "Technical System Design"

class InterviewGenResponse(BaseModel):
    question: str
    category: str
    tips: List[str]

class EvaluateAnswerRequest(BaseModel):
    question: str
    user_answer: str

class EvaluateAnswerResponse(BaseModel):
    score: int
    clarity_score: int
    technical_accuracy: int
    feedback: str
    strengths: List[str]
    improvements: List[str]
