import base64
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, Header
from ..schemas.safety import SafetyInspectionRequest, SafetyInspectionResponse
from ..services.safety_service import SafetyService

router = APIRouter(prefix="/safety", tags=["Site Safety Monitoring"])

@router.post("/inspect", response_model=SafetyInspectionResponse)
async def inspect_safety(
    request: SafetyInspectionRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    Multimodal AI Construction Site Safety Inspection (JSON with optional base64 image).
    Evaluates PPE compliance (helmets, vests, harnesses) and detects site hazards.
    """
    return SafetyService.analyze_site_safety(request, api_key_override=x_gemini_api_key)

@router.post("/upload-inspect", response_model=SafetyInspectionResponse)
async def upload_and_inspect_safety(
    file: UploadFile = File(...),
    site_name: str = Form("Metro Sky Tower Project"),
    zone: str = Form("Zone 4 - Scaffolding & Superstructure"),
    inspector_name: str = Form("Safety Officer John Doe"),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    Multimodal AI Site Safety Inspection via Multipart Image Upload.
    """
    contents = await file.read()
    b64_encoded = base64.b64encode(contents).decode("utf-8")
    mime = file.content_type or "image/jpeg"
    data_uri = f"data:{mime};base64,{b64_encoded}"

    req = SafetyInspectionRequest(
        site_name=site_name,
        zone=zone,
        inspector_name=inspector_name,
        image_base64=data_uri
    )
    return SafetyService.analyze_site_safety(req, api_key_override=x_gemini_api_key)
