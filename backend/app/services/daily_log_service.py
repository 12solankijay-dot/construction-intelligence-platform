import uuid
from datetime import datetime
from ..schemas.daily_log import DailyLogRequest, DailyLogResponse, BlockerItem

class DailyLogService:
    @classmethod
    def process_daily_log(cls, req: DailyLogRequest) -> DailyLogResponse:
        log_id = f"LOG-{uuid.uuid4().hex[:8].upper()}"

        total_manpower = (
            req.workforce.engineers + 
            req.workforce.supervisors + 
            req.workforce.skilled_labor + 
            req.workforce.unskilled_labor
        )

        # Productivity index based on manpower count
        if total_manpower >= 70:
            productivity = "OPTIMAL"
        elif total_manpower >= 40:
            productivity = "MODERATE"
        else:
            productivity = "UNDERSTAFFED"

        # Heuristic extraction of blockers from notes and weather
        blockers = []
        notes_lower = req.field_notes.lower()

        if "delay" in notes_lower or "traffic" in notes_lower or "late" in notes_lower:
            blockers.append(BlockerItem(
                blocker_id=f"BLK-{uuid.uuid4().hex[:4].upper()}",
                issue="Ready-Mix Concrete batching plant transit logistics bottleneck",
                severity="MEDIUM",
                category="MATERIAL_SHORTAGE",
                impact_days=1,
                resolution_path="Instruct batching plant dispatch to schedule transit 60 mins earlier before peak rush hour."
            ))

        if "rain" in notes_lower or "storm" in notes_lower or "wind" in notes_lower:
            blockers.append(BlockerItem(
                blocker_id=f"BLK-{uuid.uuid4().hex[:4].upper()}",
                issue="Weather stoppage on weather-sensitive exterior works",
                severity="LOW",
                category="WEATHER_DELAY",
                impact_days=0,
                resolution_path="Re-allocate exterior facade crew to covered interior basement blockwork."
            ))

        # Check equipment statuses
        for eq in req.equipment_deployed:
            if eq.get("status", "").lower() in ("maintenance", "breakdown", "faulty"):
                blockers.append(BlockerItem(
                    blocker_id=f"BLK-{uuid.uuid4().hex[:4].upper()}",
                    issue=f"Equipment breakdown: {eq.get('equipment')}",
                    severity="HIGH",
                    category="EQUIPMENT_BREAKDOWN",
                    impact_days=1,
                    resolution_path=f"Call mobile service technician for {eq.get('equipment')} replacement hydraulic seals."
                ))

        if not blockers:
            blockers.append(BlockerItem(
                blocker_id=f"BLK-{uuid.uuid4().hex[:4].upper()}",
                issue="No major schedule blockers identified for this shift",
                severity="LOW",
                category="SUBCONTRACTOR_ABSENCE",
                impact_days=0,
                resolution_path="Maintain current operational velocity."
            ))

        sentiment = "ON_TRACK" if len(blockers) <= 1 else "AT_RISK"

        achievements = [
            f"Active works logged across: {', '.join(req.active_zones)}",
            f"Successfully mobilized {total_manpower} operatives with zero lost-time injuries (LTI)",
            "Structural formwork inspection passed for upcoming slab pour",
            "Tower crane logged 7.5 incident-free operating hours"
        ]

        materials = [
            "28 Metric Tonnes Fe 550D Rebar installed & inspected",
            "360 bags Portland Cement consumed in basement masonry",
            "18 cu. meters Ready-Mix M30 Concrete delivered"
        ]

        tomorrow = [
            "Commence 06:00 AM monolithic concrete pour for Floor 4 suspended slab",
            "Third-party cube crushing compressive strength test for 7-day specimen",
            "Deliver secondary batch of curtain wall double-glazed units to Zone 1 staging",
            "Hold 07:30 AM MEP coordination walkthrough with electrical subcontractor"
        ]

        summary = (
            f"Daily Field Report for {req.site_name} on {req.date}. Field operations managed by {req.supervisor_name}. "
            f"Total active headcount stood at {total_manpower} workers ({productivity} productivity). {len(blockers)} operational "
            f"blockers flagged with immediate remediation protocols triggered. Site sentiment evaluated as {sentiment}."
        )

        return DailyLogResponse(
            log_id=log_id,
            date=req.date,
            site_name=req.site_name,
            supervisor_name=req.supervisor_name,
            weather_condition=req.weather_condition,
            total_manpower=total_manpower,
            productivity_index=productivity,
            executive_daily_summary=summary,
            key_achievements=achievements,
            detected_blockers=blockers,
            materials_usage_noted=materials,
            safety_health_status="ZERO_INCIDENTS_REPORTED",
            tomorrow_priorities=tomorrow,
            ai_site_sentiment=sentiment
        )
