import uuid
from datetime import datetime
from ..schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse, ActivityWeatherRisk, DayForecast

class WeatherService:
    @classmethod
    def get_weather_advisory(cls, req: WeatherAdvisoryRequest) -> WeatherAdvisoryResponse:
        advisory_id = f"WX-{uuid.uuid4().hex[:8].upper()}"

        # Current live/simulated meteorological reading for the site location
        metrics = {
            "temperature_c": 27.5,
            "humidity_percent": 68,
            "wind_speed_kmh": 22.0,
            "wind_gust_kmh": 34.0,
            "precipitation_probability_pct": 20,
            "barometric_pressure_hpa": 1014.2,
            "uv_index": 7,
            "condition_description": "Partly Cloudy with Moderate Coastal Breeze"
        }

        risks = [
            ActivityWeatherRisk(
                activity_name="CONCRETE_POUR (Mass Slab Concreting)",
                status="CAUTION",
                risk_score=35,
                risk_summary="Moderate temperature (27.5°C) and 68% humidity require evaporation retarder spray.",
                recommended_mitigation="Add retarder admixture; apply curing compound or wet burlap immediately after floating to prevent plastic shrinkage cracking (ACI 305R)."
            ),
            ActivityWeatherRisk(
                activity_name="CRANE_LIFTING (Tower & Mobile Cranes)",
                status="CAUTION",
                risk_score=45,
                risk_summary="Wind gusts reached 34.0 km/h. Approaching maximum safe threshold of 40 km/h.",
                recommended_mitigation="Halt high-surface-area cladding lifts. Station spotters with calibrated handheld anemometers at jib tip elevation."
            ),
            ActivityWeatherRisk(
                activity_name="EXCAVATION & TRENCHING",
                status="GO",
                risk_score=15,
                risk_summary="Low rain probability (20%). Trench side walls stable with zero standing water.",
                recommended_mitigation="Ensure sump dewatering pump remains in auto standby mode."
            ),
            ActivityWeatherRisk(
                activity_name="EXTERNAL_GLAZING & FACADE",
                status="CAUTION",
                risk_score=40,
                risk_summary="Wind gusts may induce excessive suction cup peel force on glass panels.",
                recommended_mitigation="Utilize dual-circuit vacuum lifters and limit glass hoisting to wind speeds < 25 km/h."
            ),
            ActivityWeatherRisk(
                activity_name="ROOFING_HOT_TAR & WATERPROOFING",
                status="GO",
                risk_score=10,
                risk_summary="Dry substrate conditions ideal for torch-on bituminous membrane adhesion.",
                recommended_mitigation="Maintain fire extinguishers at roof staging point."
            )
        ]

        concrete_curing = {
            "evaporation_rate_kg_m2_hr": 0.45,
            "curing_suitability": "GOOD_WITH_PRECAUTION",
            "threshold_limit_kg_m2_hr": 0.50,
            "recommendation": "Evaporation rate is close to ACI critical limit (0.5 kg/m²/h). Mist water spraying advised."
        }

        crane_advisory = {
            "current_wind_kmh": 22.0,
            "max_gust_kmh": 34.0,
            "crane_status": "RESTRICTED_OPERATIONS",
            "max_safe_limit_kmh": 40.0,
            "advisory": "Operate within 75% rated load capacity; avoid hoisting wide shuttering panels."
        }

        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        forecast = [
            DayForecast(day="Day 1 (Today)", temp_high_c=28.0, temp_low_c=19.0, rain_probability_pct=20, wind_gust_kmh=34.0, overall_workability="FAVORABLE", best_activities=["Interior MEP", "Slab Pouring (Morning)"], restricted_activities=["High-Elevation Glass Lifting"]),
            DayForecast(day="Day 2 (Tomorrow)", temp_high_c=26.5, temp_low_c=18.5, rain_probability_pct=65, wind_gust_kmh=42.0, overall_workability="RESTRICTED", best_activities=["Covered Basements", "Electrical Conduits"], restricted_activities=["Tower Crane Lifting", "External Painting", "Slab Pouring"]),
            DayForecast(day="Day 3", temp_high_c=24.0, temp_low_c=17.0, rain_probability_pct=80, wind_gust_kmh=38.0, overall_workability="SEVERELY_IMPEDED", best_activities=["Safety Training & Housekeeping", "Material Staging"], restricted_activities=["All Outdoor Earthworks", "Crane Operations", "Roofing"]),
            DayForecast(day="Day 4", temp_high_c=27.0, temp_low_c=18.0, rain_probability_pct=30, wind_gust_kmh=24.0, overall_workability="FAVORABLE", best_activities=["Dewatering & Site Drying", "Rebar Binding"], restricted_activities=[]),
            DayForecast(day="Day 5", temp_high_c=29.0, temp_low_c=20.0, rain_probability_pct=10, wind_gust_kmh=18.0, overall_workability="EXCELLENT", best_activities=["Full Outdoor Concreting", "Tower Crane Lifting", "Facade Glazing"], restricted_activities=[])
        ]

        ai_advisory = (
            f"Meteorological Decision Advisory for {req.city_or_coordinates}: Today's weather conditions provide a "
            f"viable morning window for concrete operations before afternoon wind gusts peak at 34 km/h. "
            f"CRITICAL WEATHER WARNING: Day 2 and Day 3 forecast heavy precipitation (65-80%) and 42 km/h winds. "
            f"Schedule monolithic slab pours for today or reschedule to Day 5."
        )

        return WeatherAdvisoryResponse(
            advisory_id=advisory_id,
            location=req.city_or_coordinates,
            current_metrics=metrics,
            activity_risks=risks,
            concrete_curing_index=concrete_curing,
            crane_wind_advisory=crane_advisory,
            five_day_forecast=forecast,
            ai_meteorological_advisory=ai_advisory
        )
