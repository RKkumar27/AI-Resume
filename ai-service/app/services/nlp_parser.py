import re
from typing import List, Dict

# Comprehensive Skill Dictionary with Normalization Mapping
SKILL_DICTIONARY: Dict[str, str] = {
    # Programming Languages
    "python": "Python",
    "python3": "Python",
    "js": "JavaScript",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "java": "Java",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    ".net": ".NET",
    "dotnet": ".NET",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "php": "PHP",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "sql": "SQL",
    "html": "HTML",
    "css": "CSS",

    # Backend Frameworks
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express.js",
    "expressjs": "Express.js",
    "express.js": "Express.js",
    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "nest": "NestJS",
    "nestjs": "NestJS",

    # Frontend Frameworks & UI
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "vue": "Vue.js",
    "vuejs": "Vue.js",
    "angular": "Angular",
    "next": "Next.js",
    "nextjs": "Next.js",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "redux": "Redux",

    # Databases & Storage
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "my sql": "MySQL",
    "oracle": "Oracle DB",
    "redis": "Redis",
    "elasticsearch": "Elasticsearch",
    "dynamodb": "DynamoDB",
    "cassandra": "Cassandra",
    "sqlite": "SQLite",

    # Cloud, DevOps & Infrastructure
    "docker": "Docker",
    "dockerized": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "GCP",
    "google cloud": "GCP",
    "azure": "Azure",
    "terraform": "Terraform",
    "ansible": "Ansible",
    "linux": "Linux",
    "unix": "Linux",
    "nginx": "Nginx",
    "kafka": "Kafka",
    "apache kafka": "Kafka",
    "rabbitmq": "RabbitMQ",
    "graphql": "GraphQL",
    "rest": "REST APIs",
    "rest api": "REST APIs",
    "restful": "REST APIs",
    "microservices": "Microservices",
    "git": "Git",
    "github": "GitHub",
    "ci/cd": "CI/CD",
    "jenkins": "Jenkins",

    # AI, ML & Data Science
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "nlp": "NLP",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikit-learn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",

    # Architecture & Tools
    "system design": "System Design",
    "agile": "Agile",
    "scrum": "Scrum",
    "jira": "Jira"
}

def extract_and_normalize_skills(text: str) -> List[str]:
    """
    Extracts technical skills from raw resume/job text and normalizes equivalent names.
    Uses regex word-boundary matching to prevent partial string collisions.
    """
    if not text:
        return []

    text_lower = text.lower()
    found_skills = set()

    for raw_keyword, normalized_name in SKILL_DICTIONARY.items():
        # Handle special characters like c++, c#, .net
        escaped_keyword = re.escape(raw_keyword)
        if raw_keyword in ["c++", "c#", ".net"]:
            pattern = r'(?:^|\s|\b)' + escaped_keyword + r'(?:$|\s|\b|,|\.)'
        else:
            pattern = r'\b' + escaped_keyword + r'\b'
            
        if re.search(pattern, text_lower):
            found_skills.add(normalized_name)

    return sorted(list(found_skills))
