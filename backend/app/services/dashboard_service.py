from datetime import datetime
from ..schemas.dashboard import DashboardOverviewResponse

class DashboardService:
    @classmethod
    def get_executive_overview(cls) -> DashboardOverviewResponse:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        recent_inspections = [
            {"id": "SAFE-8F12A", "module": "Site Safety PPE", "zone": "Zone 4 Scaffolding", "status": "Action Required", "score": 72, "time": "10 mins ago"},
            {"id": "DEFECT-4B29C", "module": "Defect / Crack Vision", "zone": "Floor 3 Transfer Girder", "status": "Severe Shear Crack (1.65mm)", "score": 62, "time": "45 mins ago"},
            {"id": "VAL-99A10", "module": "Cost Estimator BOQ", "zone": "Commercial Phase 1", "status": "Capex $7.6M Est.", "score": 94, "time": "2 hours ago"},
            {"id": "WX-33D81", "module": "Weather Risk Advisor", "zone": "Site Wide", "status": "Caution: Afternoon Gusts", "score": 85, "time": "3 hours ago"},
        ]

        recent_blockers = [
            {"id": "BLK-901", "issue": "RMC batching transit delay due to expressway gridlock", "impact": "1 day", "severity": "MEDIUM"},
            {"id": "BLK-902", "issue": "Tower crane hydraulic seal inspection required", "impact": "4 hours", "severity": "HIGH"},
        ]

        critical_milestones = [
            {"milestone": "Floor 4 Slab Cast & Monolithic Pour", "target": "2026-10-25", "status": "On Track", "progress": 85},
            {"milestone": "Curtain Wall Glazing Delivery - Phase 2", "target": "2026-11-04", "status": "Pending", "progress": 20},
            {"milestone": "Substation Power Energization", "target": "2026-11-18", "status": "Scheduled", "progress": 0},
        ]

        bullets = [
            "Overall Project Health Index stands at 82% with active works progressing across 6 operational zones.",
            "Site Safety Compliance is rated at 72% due to elevated harness non-compliance in Sector B scaffolding.",
            "Structural Crack Detection flagged a 1.65 mm shear crack on Floor 3 Transfer Girder; temporary shoring is initiated.",
            "Weather intelligence advises executing mass slab concreting prior to 12:00 PM before wind gusts exceed 34 km/h.",
            "Total on-site workforce stands at 79 personnel with optimal productivity reported."
        ]

        return DashboardOverviewResponse(
            timestamp=now_str,
            project_name="Metro Sky Tower - Multimodal Construction Intelligence",
            overall_health_score=82,
            safety_compliance_score=72,
            structural_integrity_score=78,
            schedule_adherence_pct=88,
            budget_adherence_pct=94,
            active_safety_violations=3,
            open_structural_defects=2,
            weather_workability_status="CAUTION_AFTERNOON_WINDS",
            total_workers_on_site=79,
            recent_inspections=recent_inspections,
            recent_blockers=recent_blockers,
            critical_milestones=critical_milestones,
            executive_summary_bullets=bullets
        )
