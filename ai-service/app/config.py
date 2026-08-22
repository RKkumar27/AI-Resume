import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Resume Microservice"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENV: str = os.getenv("ENV", "development")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000"
    ]

settings = Settings()
