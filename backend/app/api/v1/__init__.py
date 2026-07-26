from .auth import router as auth_router
from .organizations import router as organizations_router
from .projects import router as projects_router
from .requirements import router as requirements_router
from .planning import router as planning_router
from .tasks import router as tasks_router
from .documents import router as documents_router
from .activity import router as activity_router
from .team import router as team_router
from .analytics import router as analytics_router
from .settings import router as settings_router
from .copilot import router as copilot_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(organizations_router, prefix="/organizations", tags=["Organizations"])
api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_router.include_router(requirements_router, prefix="/projects", tags=["Requirements"]) # specific paths are configured in router
api_router.include_router(planning_router, prefix="/projects", tags=["Planning"])
api_router.include_router(tasks_router, prefix="", tags=["Tasks"])
api_router.include_router(documents_router, prefix="", tags=["Documents"])
api_router.include_router(activity_router, prefix="/projects", tags=["Activity"])
api_router.include_router(team_router, prefix="/team", tags=["Team"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(settings_router, prefix="/settings", tags=["Settings"])
api_router.include_router(copilot_router, prefix="/copilot", tags=["Copilot"])
