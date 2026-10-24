from fastapi import APIRouter
from ..schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse
from ..services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather-Aware Construction Advisory"])

@router.post("/advisory", response_model=WeatherAdvisoryResponse)
async def get_weather_advisory(request: WeatherAdvisoryRequest):
    """
    Get weather-informed risk advisory for concrete pouring, crane operations, excavation, and 5-day workability.
    """
    return WeatherService.get_weather_advisory(request)
