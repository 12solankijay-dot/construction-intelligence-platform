import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "online"

    health = client.get("/api/v1/health")
    assert health.status_code == 200
    assert len(health.json()["active_modules"]) == 8

def test_dashboard_overview():
    resp = client.get("/api/v1/dashboard/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_health_score" in data
    assert "safety_compliance_score" in data
    assert data["overall_health_score"] > 0
    assert len(data["recent_inspections"]) > 0

def test_safety_inspection_json():
    payload = {
        "site_name": "Skyline Tower A",
        "zone": "Level 14 Core Wall",
        "inspector_name": "Test Officer"
    }
    resp = client.post("/api/v1/safety/inspect", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_safety_score" in data
    assert len(data["ppe_compliance"]) > 0
    assert len(data["hazards_detected"]) > 0
    assert len(data["osha_citations"]) > 0

def test_safety_upload_inspect():
    fake_img = io.BytesIO(b"fake-image-bytes-for-safety-test")
    resp = client.post(
        "/api/v1/safety/upload-inspect",
        files={"file": ("site.jpg", fake_img, "image/jpeg")},
        data={"site_name": "Test Site", "zone": "Zone 1"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["inspection_id"].startswith("SAFE-")

def test_crack_analysis():
    payload = {
        "component_type": "BEAM",
        "structural_age_years": 4,
        "environmental_exposure": "EXTERIOR_HUMID"
    }
    resp = client.post("/api/v1/crack/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["crack_type"] == "STRUCTURAL_SHEAR"
    assert data["estimated_width_mm"] > 0
    assert len(data["recommended_remediation"]) > 0

def test_valuation_estimate():
    payload = {
        "project_type": "COMMERCIAL",
        "total_built_up_area_sqft": 50000.0,
        "floors_count": 6,
        "construction_quality": "PREMIUM",
        "location_tier": "TIER_1_METRO",
        "soil_foundation_type": "NORMAL"
    }
    resp = client.post("/api/v1/valuation/estimate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_estimated_construction_cost"] > 0
    assert data["cost_per_sqft"] > 0
    assert data["boq"]["civil_structural"] > 0
    assert len(data["boq"]["civil_materials"]) == 4

def test_planning_generate():
    payload = {
        "project_name": "Test Logistics Park",
        "project_type": "INDUSTRIAL",
        "built_up_area_sqft": 60000.0,
        "floors": 3,
        "target_duration_months": 12,
        "start_date": "2026-11-01"
    }
    resp = client.post("/api/v1/planning/generate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["phases"]) == 6
    assert data["total_duration_days"] == 360
    assert len(data["major_milestones"]) > 0

def test_daily_log_submit():
    payload = {
        "date": "2026-10-24",
        "site_name": "Skyline Logistics",
        "supervisor_name": "Frank Castle",
        "weather_condition": "Clear, 24C",
        "workforce": {
            "engineers": 4,
            "supervisors": 5,
            "skilled_labor": 35,
            "unskilled_labor": 40
        },
        "active_zones": ["Ground Slab Pour"],
        "equipment_deployed": [{"equipment": "Excavator", "hours": 6, "status": "Operational"}],
        "field_notes": "Completed gravel bedding. Concrete transit on schedule. Rain delayed afternoon plaster."
    }
    resp = client.post("/api/v1/daily-log/submit", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_manpower"] == 84
    assert data["productivity_index"] == "OPTIMAL"
    assert len(data["detected_blockers"]) > 0

def test_weather_advisory():
    payload = {
        "city_or_coordinates": "Chicago, IL",
        "planned_activities": ["CONCRETE_POUR", "CRANE_LIFTING"]
    }
    resp = client.post("/api/v1/weather/advisory", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["activity_risks"]) > 0
    assert len(data["five_day_forecast"]) == 5

def test_knowledge_query():
    payload = {
        "query": "What are OSHA regulations for scaffolding guardrails?",
        "category": "OSHA_SAFETY"
    }
    resp = client.post("/api/v1/knowledge/query", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "detailed_answer" in data
    assert len(data["cited_clauses_and_standards"]) > 0
    assert len(data["site_compliance_checklist"]) > 0
