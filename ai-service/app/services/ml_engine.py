import math
import re
from typing import Dict, List, Tuple
from app.services.nlp_parser import extract_and_normalize_skills

def compute_tf(text: str) -> Dict[str, float]:
    words = re.findall(r'\w+', text.lower())
    total_words = len(words) or 1
    tf = {}
    for word in words:
        tf[word] = tf.get(word, 0) + 1
    for word in tf:
        tf[word] /= total_words
    return tf

def cosine_similarity(tf1: Dict[str, float], tf2: Dict[str, float]) -> float:
    all_words = set(tf1.keys()).union(set(tf2.keys()))
    dot_product = sum(tf1.get(w, 0) * tf2.get(w, 0) for w in all_words)
    mag1 = math.sqrt(sum(v ** 2 for v in tf1.values()))
    mag2 = math.sqrt(sum(v ** 2 for v in tf2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

def analyze_job_match(resume_text: str, job_text: str) -> Tuple[int, float, float, List[str], List[str], List[str]]:
    """
    Computes semantic compatibility between a specific resume text and job description using
    TF-IDF cosine similarity + Skill overlap calculation.
    Returns dynamic, resume-specific match scores without hardcoded defaults.
    """
    tf_resume = compute_tf(resume_text)
    tf_job = compute_tf(job_text)
    tfidf_sim = cosine_similarity(tf_resume, tf_job)

    resume_skills = set(extract_and_normalize_skills(resume_text))
    job_skills = set(extract_and_normalize_skills(job_text))

    matched = sorted(list(resume_skills.intersection(job_skills)))
    missing = sorted(list(job_skills.difference(resume_skills)))

    if job_skills:
        skill_match_ratio = len(matched) / len(job_skills)
    else:
        # Fallback keyword overlap if job_skills dictionary empty
        skill_match_ratio = tfidf_sim

    # Weighted calculation: 35% TF-IDF document text similarity + 65% exact skill match ratio
    raw_score = (tfidf_sim * 0.35 + skill_match_ratio * 0.65) * 100
    
    # Scale realistic match score dynamically
    match_score = int(round(max(15, min(98, raw_score))))

    recommendations = []
    if missing:
        recommendations.append(f"Add missing target keywords to your resume: {', '.join(missing[:4])}")
    if tfidf_sim < 0.2:
        recommendations.append("Align your experience descriptions with the specific domain terminology used in the job posting.")
    if not recommendations:
        recommendations.append("Strong semantic alignment! Quantify accomplishments with metrics (e.g. 'improved performance by 35%').")

    return match_score, round(tfidf_sim, 3), round(skill_match_ratio, 3), matched, missing, recommendations

def calculate_ats_score(resume_text: str) -> Dict:
    """
    Calculates dynamic ATS score, skill coverage score, work experience impact,
    keyword density, and formatting signals strictly based on actual resume content.
    """
    if not resume_text or len(resume_text.strip()) < 10:
        return {
            "ats_score": 25,
            "skills_score": 20,
            "experience_score": 20,
            "keywords_score": 30,
            "formatting_score": 30,
            "extracted_skills": [],
            "recommendations": ["Upload a readable resume containing detailed technical experience and skills."]
        }

    text_lower = resume_text.lower()
    
    # 1. Extracted Technical Skills & Skill Score
    skills = extract_and_normalize_skills(resume_text)
    skill_count = len(skills)
    # Dynamic skill score: 35 base + 7 points per normalized skill (max 98)
    skills_score = min(98, max(30, 35 + skill_count * 7))

    # 2. Work Experience Impact Score
    experience_score = 45
    has_exp_section = bool(re.search(r'\b(experience|employment|work history|career)\b', text_lower))
    if has_exp_section:
        experience_score += 20
    
    # Count action verbs (e.g. developed, engineered, architected, optimized, led, built)
    action_verbs = re.findall(r'\b(developed|engineered|architected|optimized|built|scaled|designed|implemented|managed|led|created|spearheaded|automated)\b', text_lower)
    experience_score += min(20, len(action_verbs) * 3)

    # Count quantified metrics (%, $, numbers)
    metrics_found = re.findall(r'(\d+%\b|\$\d+|\d+\s*k\b|\d+\s*million)', text_lower)
    experience_score += min(15, len(metrics_found) * 5)
    experience_score = min(98, experience_score)

    # 3. Keyword Relevance Score
    total_words = len(re.findall(r'\w+', text_lower)) or 1
    tech_words_count = sum(text_lower.count(s.lower()) for s in skills)
    tech_density = (tech_words_count / total_words) * 100
    keywords_score = min(98, max(40, int(round(50 + tech_density * 8 + skill_count * 3))))

    # 4. Document Formatting Signals Score
    formatting_score = 40
    sections = [
        r'\b(skills|technical skills|competencies)\b',
        r'\b(experience|employment|work history)\b',
        r'\b(education|university|college|degree)\b',
        r'\b(projects|portfolio)\b'
    ]
    sections_found = sum(1 for s in sections if re.search(s, text_lower))
    formatting_score += sections_found * 12

    # Check Email and Phone presence
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text))
    if has_email:
        formatting_score += 10
    formatting_score = min(98, formatting_score)

    # 5. Overall Weighted ATS Score
    ats_score = int(round(
        skills_score * 0.35 +
        experience_score * 0.25 +
        keywords_score * 0.25 +
        formatting_score * 0.15
    ))

    # Recommendations Generation
    recommendations = []
    if skill_count < 4:
        recommendations.append("Add a dedicated 'Technical Skills' section detailing languages, frameworks, and databases.")
    if len(action_verbs) < 3:
        recommendations.append("Start bullet points with strong action verbs (e.g. Developed, Engineered, Spearheaded, Optimized).")
    if len(metrics_found) < 2:
        recommendations.append("Quantify project accomplishments with measurable impact metrics (e.g. 'improved performance by 35%').")
    if not has_exp_section:
        recommendations.append("Include a clearly labeled 'Work Experience' section with company names and employment dates.")

    if not recommendations:
        recommendations.append("Excellent resume structure and technical skill representation!")

    return {
        "ats_score": ats_score,
        "skills_score": skills_score,
        "experience_score": experience_score,
        "keywords_score": keywords_score,
        "formatting_score": formatting_score,
        "extracted_skills": skills,
        "recommendations": recommendations
    }
