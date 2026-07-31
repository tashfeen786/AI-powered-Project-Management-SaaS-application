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
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE conversations ADD COLUMN agent_id VARCHAR(50) DEFAULT 'copilot'"))
        except Exception:
            pass
            
        try:
            # Create any missing tables (like mentions, reactions, task_watchers)
            await conn.run_sync(Base.metadata.create_all)
        except Exception as e:
            logger.error("Failed to auto-migrate tables", error=str(e))
    yield

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
