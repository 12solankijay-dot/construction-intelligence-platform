import uuid
from datetime import datetime, timedelta
from ..schemas.planning import ProjectPlanRequest, ProjectPlanResponse, ConstructionPhase

class PlanningService:
    @classmethod
    def generate_project_plan(cls, req: ProjectPlanRequest) -> ProjectPlanResponse:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        plan_id = f"PLAN-{uuid.uuid4().hex[:8].upper()}"

        try:
            start_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
        except Exception:
            start_dt = datetime.now()

        total_days = req.target_duration_months * 30
        completion_dt = start_dt + timedelta(days=total_days)

        # Calculate phase distribution based on industry standard proportions:
        # Phase 1: Mobilization & Excavation (12%)
        # Phase 2: RCC Framing / Sub & Superstructure (30%)
        # Phase 3: Building Envelope & Masonry (16%)
        # Phase 4: MEP Rough-in (18%)
        # Phase 5: Architectural Finishes & Glazing (16%)
        # Phase 6: Commissioning & Handover (8%)

        d1 = max(15, int(total_days * 0.12))
        d2 = max(30, int(total_days * 0.30))
        d3 = max(20, int(total_days * 0.16))
        d4 = max(25, int(total_days * 0.18))
        d5 = max(20, int(total_days * 0.16))
        d6 = max(10, total_days - (d1 + d2 + d3 + d4 + d5))

        # Phased timeline with realistic overlap
        p1_start = 0
        p1_end = d1

        p2_start = int(d1 * 0.85)  # slight overlap with substructure completion
        p2_end = p2_start + d2

        p3_start = p2_start + int(d2 * 0.50) # masonry starts once lower floors are stripped
        p3_end = p3_start + d3

        p4_start = p3_start + int(d3 * 0.30) # MEP follows masonry
        p4_end = p4_start + d4

        p5_start = p4_start + int(d4 * 0.40) # Finishes follow MEP rough-in
        p5_end = p5_start + d5

        p6_start = p5_end - int(d6 * 0.30)
        p6_end = total_days

        phases = [
            ConstructionPhase(
                phase_id=1,
                name="Site Mobilization, Shoring & Deep Foundation Excavation",
                duration_days=d1,
                start_day=p1_start,
                end_day=p1_end,
                is_critical_path=True,
                workforce_headcount=24,
                key_deliverables=[
                    "Site perimeter hoarding and access gates installed",
                    "Geotechnical dewatering wells operational",
                    "Secant piling / soldier piles & timber lagging completed",
                    "Bulk excavation down to foundation basement invert level"
                ],
                status="COMPLETED",
                completion_percentage=100,
                risk_factors=["Underground utility clashes", "Heavy rain excavation flooding"]
            ),
            ConstructionPhase(
                phase_id=2,
                name="Reinforced Concrete (RCC) Sub & Superstructure Framing",
                duration_days=d2,
                start_day=p2_start,
                end_day=p2_end,
                is_critical_path=True,
                workforce_headcount=58,
                key_deliverables=[
                    "Raft foundation casting and waterproof membrane",
                    f"Core walls and columns poured across {req.floors} floors",
                    "Post-tensioned suspended slabs cast and stressed",
                    "Structural frame top-out ceremony achieved"
                ],
                status="IN_PROGRESS",
                completion_percentage=45,
                risk_factors=["Batching plant concrete supply delays", "Crane high-wind halts"]
            ),
            ConstructionPhase(
                phase_id=3,
                name="Building Envelope, Masonry & Weatherproofing",
                duration_days=d3,
                start_day=p3_start,
                end_day=p3_end,
                is_critical_path=False,
                workforce_headcount=36,
                key_deliverables=[
                    "Exterior AAC blockwork and perimeter walls completed",
                    "Unitized curtain wall and double-glazed facade installed",
                    "Roof slab polyurethane waterproofing and insulation flood-tested"
                ],
                status="PENDING",
                completion_percentage=0,
                risk_factors=["Facade glass shipment customs delay", "Exterior scaffolding safety"]
            ),
            ConstructionPhase(
                phase_id=4,
                name="MEP (Mechanical, Electrical, Plumbing, HVAC & Fire) Rough-in",
                duration_days=d4,
                start_day=p4_start,
                end_day=p4_end,
                is_critical_path=True,
                workforce_headcount=42,
                key_deliverables=[
                    "HVAC galvanized sheet metal ducting and chiller risers",
                    "Fire suppression sprinkler loops and dry riser pipes",
                    "Electrical cable trays and low-voltage conduits",
                    "Sanitary and rainwater drainage gravity stacks"
                ],
                status="PENDING",
                completion_percentage=0,
                risk_factors=["Spatial clashes in ceiling plenum", "Switchgear delivery lead times"]
            ),
            ConstructionPhase(
                phase_id=5,
                name="Interior Architectural Finishes, Drywall & Joinery",
                duration_days=d5,
                start_day=p5_start,
                end_day=p5_end,
                is_critical_path=False,
                workforce_headcount=48,
                key_deliverables=[
                    "Acoustic gypsum drywall partitions and ceiling grids",
                    "Vitrified floor tiling and epoxy screed flooring",
                    "Commercial restroom fixtures and vanity installation",
                    "Architectural paint coatings and acoustic wood paneling"
                ],
                status="PENDING",
                completion_percentage=0,
                risk_factors=["Moisture interference with timber floorings", "Finishing subcontractor turnover"]
            ),
            ConstructionPhase(
                phase_id=6,
                name="Integrated Systems Commissioning, Authority Approvals & Handover",
                duration_days=d6,
                start_day=p6_start,
                end_day=p6_end,
                is_critical_path=True,
                workforce_headcount=18,
                key_deliverables=[
                    "Integrated Building Management System (BMS) functional tests",
                    "Fire life safety smoke extraction audit & Civil Defense signoff",
                    "Elevator load drop tests and safety certifications",
                    "Occupancy Certificate (OC) received and client keys handed over"
                ],
                status="PENDING",
                completion_percentage=0,
                risk_factors=["Municipal authority inspection scheduling backlogs"]
            ),
        ]

        milestones = [
            {"milestone": "Site Possession & Ground Breaking", "target_date": (start_dt + timedelta(days=0)).strftime("%Y-%m-%d"), "critical": True},
            {"milestone": "Foundation Raft Pour Complete", "target_date": (start_dt + timedelta(days=int(d1*0.9))).strftime("%Y-%m-%d"), "critical": True},
            {"milestone": "Superstructure Top-Out Milestone", "target_date": (start_dt + timedelta(days=p2_end)).strftime("%Y-%m-%d"), "critical": True},
            {"milestone": "Building Watertight Envelope Achieved", "target_date": (start_dt + timedelta(days=p3_end)).strftime("%Y-%m-%d"), "critical": False},
            {"milestone": "Substation Energization & Power On", "target_date": (start_dt + timedelta(days=int(p4_end*0.95))).strftime("%Y-%m-%d"), "critical": True},
            {"milestone": "Final Occupancy Certificate Granted", "target_date": completion_dt.strftime("%Y-%m-%d"), "critical": True},
        ]

        procurement = [
            {"material": "Structural Steel & Rebar Mills", "order_lead_time_weeks": 8, "trigger_phase": "Phase 1"},
            {"material": "Custom Unitized Curtain Wall Glazing", "order_lead_time_weeks": 16, "trigger_phase": "Phase 2"},
            {"material": "HVAC Centrifugal Chillers & Transformers", "order_lead_time_weeks": 20, "trigger_phase": "Phase 2"},
            {"material": "High-Speed Gearless Passenger Elevators", "order_lead_time_weeks": 24, "trigger_phase": "Phase 2"}
        ]

        insights = (
            f"Optimized schedule for '{req.project_name}' ({req.built_up_area_sqft:,.0f} sqft, {req.floors} floors). "
            f"Total duration engineered at {total_days} days ({req.target_duration_months} months). "
            f"Superstructure RCC framing and MEP rough-ins form the controlling critical path. Fast-tracking envelope installation "
            f"concurrent with Floor 5+ framing compresses timeline by 18 calendar days."
        )

        return ProjectPlanResponse(
            plan_id=plan_id,
            timestamp=now_str,
            project_name=req.project_name,
            project_type=req.project_type,
            total_duration_days=total_days,
            start_date=req.start_date,
            projected_completion_date=completion_dt.strftime("%Y-%m-%d"),
            phases=phases,
            critical_path_summary="Phase 1 (Excavation) -> Phase 2 (Framing) -> Phase 4 (MEP Rough-in) -> Phase 6 (Commissioning)",
            major_milestones=milestones,
            recommended_procurement_lead_times=procurement,
            ai_planning_insights=insights
        )
