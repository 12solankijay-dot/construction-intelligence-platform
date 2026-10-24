from fastapi import APIRouter
from ..schemas.dashboard import DashboardOverviewResponse
from ..services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Executive Intelligence Dashboard"])

@router.get("/overview", response_model=DashboardOverviewResponse)
async def get_dashboard_overview():
    """
    Unified Executive Intelligence Snapshot aggregating Safety, Structural Health, Budget, and Schedule.
    """
    return DashboardService.get_executive_overview()
