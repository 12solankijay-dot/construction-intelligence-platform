from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class ActivityWeatherRisk(BaseModel):
    activity_name: str
    status: str = Field(..., description="GO, CAUTION, STOP")
    risk_score: int = Field(..., ge=0, le=100)
    risk_summary: str
    recommended_mitigation: str

class DayForecast(BaseModel):
    day: str
    temp_high_c: float
    temp_low_c: float
    rain_probability_pct: int
    wind_gust_kmh: float
    overall_workability: str = Field(..., description="EXCELLENT, FAVORABLE, RESTRICTED, SEVERELY_IMPEDED")
    best_activities: List[str]
    restricted_activities: List[str]

class WeatherAdvisoryRequest(BaseModel):
    city_or_coordinates: str = Field(default="San Francisco, CA")
    planned_activities: List[str] = Field(default=[
        "CONCRETE_POUR", "CRANE_LIFTING", "EXCAVATION", "EXTERNAL_GLAZING", "ROOFING_HOT_TAR"
    ])

class WeatherAdvisoryResponse(BaseModel):
    advisory_id: str
    location: str
    current_metrics: dict
    activity_risks: List[ActivityWeatherRisk]
    concrete_curing_index: dict
    crane_wind_advisory: dict
    five_day_forecast: List[DayForecast]
    ai_meteorological_advisory: str
