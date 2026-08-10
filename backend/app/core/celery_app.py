import os
from celery import Celery
import structlog

logger = structlog.get_logger()

from app.core.config import settings

# If REDIS_URL is not provided, fall back to memory transport (only for dev, totally unsuitable for prod)
# But we will use redis by default as requested.
redis_url = settings.REDIS_URL

celery_app = Celery(
    "ai_pm_celery",
    broker=redis_url,
    backend=redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # TODO: Kubernetes Workers configuration
    # TODO: Dead Letter Queue (DLQ) routing
    # TODO: Horizontal Scaling parameters
)

@celery_app.task
def verify_connection():
    logger.info("Celery connection verified!")
    return True
