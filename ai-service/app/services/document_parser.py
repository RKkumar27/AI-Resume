import re
from typing import Dict, List
from app.services.nlp_parser import extract_and_normalize_skills

def parse_resume_document(text: str, filename: str = "resume.pdf") -> Dict:
    """
    Parses document text, extracts contact info (email, phone), section structures,
    and identifies technical competencies.
    """
    # Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ""

    # Extract Phone Number
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ""

    # Extract Technical Skills
    skills = extract_and_normalize_skills(text)

    # Detect Sections
    has_experience = bool(re.search(r'\b(experience|employment|work history)\b', text, re.IGNORECASE))
    has_education = bool(re.search(r'\b(education|university|degree|college)\b', text, re.IGNORECASE))
    has_projects = bool(re.search(r'\b(projects|portfolio)\b', text, re.IGNORECASE))

    return {
        "filename": filename,
        "email": email,
        "phone": phone,
        "skills": skills,
        "sections_detected": {
            "experience": has_experience,
            "education": has_education,
            "projects": has_projects
        }
    }
