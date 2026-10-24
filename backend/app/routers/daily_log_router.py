from fastapi import APIRouter
from ..schemas.daily_log import DailyLogRequest, DailyLogResponse
from ..services.daily_log_service import DailyLogService

router = APIRouter(prefix="/daily-log", tags=["Daily Site Log & Field Assistant"])

@router.post("/submit", response_model=DailyLogResponse)
async def submit_daily_log(request: DailyLogRequest):
    """
    Process daily supervisor notes, detect blockers, calculate manpower productivity, and synthesize daily site log.
    """
    return DailyLogService.process_daily_log(request)
