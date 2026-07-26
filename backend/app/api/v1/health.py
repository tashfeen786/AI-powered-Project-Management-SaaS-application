from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
import os
import structlog
import redis.asyncio as redis

logger = structlog.get_logger()
router = APIRouter()

@router.get("", tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Comprehensive health check for orchestration (Docker/K8s).
    """
    status = {
        "status": "ok",
        "database": "unknown",
        "redis": "unknown"
    }
    
    # Check Database
    try:
        await db.execute(text("SELECT 1"))
        status["database"] = "ok"
    except Exception as e:
        logger.error("Healthcheck: Database failed", error=str(e))
        status["database"] = "unhealthy"
        status["status"] = "degraded"
        
    # Check Redis
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    try:
        r = redis.from_url(redis_url)
        await r.ping()
        await r.close()
        status["redis"] = "ok"
    except Exception as e:
        logger.error("Healthcheck: Redis failed", error=str(e))
        status["redis"] = "unhealthy"
        status["status"] = "degraded"
        
    if status["status"] == "degraded":
        from fastapi import Response
        return Response(content=str(status), status_code=503)
        
    return status
