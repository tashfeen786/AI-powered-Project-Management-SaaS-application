import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Optional

# Resolve .env from backend/ or project root
_backend_dir = Path(__file__).resolve().parent.parent.parent  # backend/
_env_file = _backend_dir / ".env"
if not _env_file.exists():
    _env_file = _backend_dir.parent / ".env"  # project root

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Project Management SaaS"
    API_V1_STR: str = "/api/v1"
    
    # Security
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: list[str] = ["*"] # Override in prod: ["https://myapp.com"]
    
    # Database (Supabase PostgreSQL via asyncpg)
    DATABASE_URL: str

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str]) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql://", 1)
            if v.startswith("postgresql://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    # Redis (local)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Keys — Groq is the sole LLM provider. OpenAI is not used.
    GROQ_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(_env_file),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
