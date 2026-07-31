from fastapi import APIRouter

from .auth import router as auth_router
from .organizations import router as organizations_router
from .projects import router as projects_router
from .requirements import router as requirements_router
from .sprints import router as sprints_router
from .planning import router as planning_router
from .tasks import router as tasks_router
from .documents import router as documents_router
from .activity import router as activity_router
from .team import router as team_router
from .analytics import router as analytics_router
from .ai import router as ai_router
from .settings import router as settings_router
from .copilot import router as copilot_router
from .task_generation import router as task_generation_router
from .ai_insights import router as ai_insights_router
from .websocket import router as websocket_router
from .jobs import router as jobs_router
from .health import router as health_router
from .collaboration import router as collaboration_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(organizations_router, prefix="/organizations", tags=["Organizations"])
api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_router.include_router(requirements_router, prefix="", tags=["Requirements"]) # specific paths are configured in router
api_router.include_router(sprints_router, prefix="", tags=["Sprints"])
api_router.include_router(planning_router, prefix="", tags=["Planning"])
api_router.include_router(tasks_router, prefix="", tags=["Tasks"])
api_router.include_router(documents_router, prefix="", tags=["Documents"])
api_router.include_router(activity_router, prefix="", tags=["Activity"])
api_router.include_router(team_router, prefix="/team", tags=["Team"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI"])
api_router.include_router(settings_router, prefix="/settings", tags=["Settings"])
api_router.include_router(copilot_router, prefix="/copilot", tags=["Copilot"])
api_router.include_router(task_generation_router, prefix="", tags=["Task Generation"])
api_router.include_router(ai_insights_router, prefix="", tags=["AI Insights"])
api_router.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])
api_router.include_router(jobs_router, prefix="/jobs", tags=["Background Jobs"])
api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(collaboration_router, prefix="/collaboration", tags=["Collaboration"])
