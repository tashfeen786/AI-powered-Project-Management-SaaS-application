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
        "redis": "unknown",
        "aiosqlite": "unknown"
    }
    
    try:
        import aiosqlite
        status["aiosqlite"] = "installed"
    except ImportError:
        status["aiosqlite"] = "missing"
    
    # Check Database
    try:
        await db.execute(text("SELECT 1"))
        status["database"] = "ok"
    except Exception as e:
        logger.error("Healthcheck: Database failed", error=str(e))
        status["database"] = f"unhealthy: {str(e)}"
        status["status"] = "degraded"
        
    # Check Redis
    from app.core.config import settings
    redis_url = settings.REDIS_URL
    try:
        r = redis.from_url(redis_url)
        await r.ping()
        await r.close()
        status["redis"] = "ok"
    except Exception as e:
        logger.error("Healthcheck: Redis failed", error=str(e))
        status["redis"] = f"unavailable: {str(e)}"
        # status["status"] = "degraded" # Do not degrade overall health if Redis is down locally
        
    if status["status"] == "degraded":
        from fastapi import Response
        return Response(content=str(status), status_code=503)
        
    return status
