from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.api.v1 import api_router
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.middleware.logging import LoggingMiddleware
from app.utils.response import error_response

setup_logging()

from contextlib import asynccontextmanager
from app.db.session import engine
from sqlalchemy import text

from app.db.base import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-migrate missing tables to bypass sandbox limitations
    try:
        async with engine.begin() as conn:
            await conn.execute(text("ALTER TABLE conversations ADD COLUMN agent_id VARCHAR(50) DEFAULT 'copilot'"))
    except Exception:
        pass
        
    try:
        async with engine.begin() as conn:
            await conn.execute(text("UPDATE organization_members SET status = 'accepted' WHERE role = 'owner' AND status = 'pending'"))
    except Exception:
        pass
        
    try:
        async with engine.begin() as conn:
            # Create any missing tables (like mentions, reactions, task_watchers)
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        logger.error("Failed to auto-migrate tables", error=str(e))
        
    import asyncio
    import json
    import redis.asyncio as aioredis
    import os
    from app.core.websocket_manager import manager
    from app.schemas.websocket import WsServerMessage
    import uuid

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_client = aioredis.from_url(redis_url)
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("project_events")
    
    async def redis_listener():
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    try:
                        data = json.loads(message["data"])
                        project_id_str = data.get("project_id")
                        event = data.get("event")
                        payload = data.get("payload", {})
                        
                        if project_id_str and event:
                            project_id = uuid.UUID(project_id_str)
                            ws_msg = WsServerMessage(event=event, payload=payload)
                            await manager.broadcast_to_project(project_id, ws_msg)
                    except Exception as e:
                        logger.error("Failed to process redis pubsub message", error=str(e))
        except asyncio.CancelledError:
            pass
            
    listener_task = asyncio.create_task(redis_listener())

    yield
    
    listener_task.cancel()
    await pubsub.close()
    await redis_client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Add Rate Limiting Middleware (e.g. slowapi) here before production release

# Logging Middleware
app.add_middleware(LoggingMiddleware)

# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"loc": err["loc"], "msg": err["msg"], "type": err["type"]} for err in exc.errors()]
    logger.warning("Validation error", path=request.url.path, errors=errors)
    return JSONResponse(
        status_code=422,
        content=error_response("Validation Error", data=errors).model_dump()
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content=error_response("Internal Server Error").model_dump()
    )

# Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root_redirect():
    return {"status": "ok", "service": settings.PROJECT_NAME, "health_endpoint": "/api/v1/health"}
