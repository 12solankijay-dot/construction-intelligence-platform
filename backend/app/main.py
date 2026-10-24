import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .routers import (
    safety_router,
    crack_router,
    valuation_router,
    planning_router,
    daily_log_router,
    weather_router,
    knowledge_router,
    dashboard_router,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Full-Stack Decision Support System for Construction Planning, Execution, and Monitoring. "
        "Integrates Multimodal AI (Computer Vision for PPE Safety & Structural Crack Assessment), "
        "Real Estate BOQ Valuation, WBS Critical Path Scheduling, Daily Field Assistant, "
        "Weather-Aware Advisory, and OSHA / IBC Building Codes Knowledge Assistant."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev convenience & testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": str(exc),
            "path": request.url.path
        }
    )

# Root Health & Info Check
@app.get("/", tags=["Health & Meta"])
async def root_status():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_PREFIX,
        "multimodal_ai": {
            "gemini_api_key_configured": bool(settings.GEMINI_API_KEY),
            "model": settings.GEMINI_MODEL_NAME,
            "offline_simulation_ready": True
        }
    }

@app.get(f"{settings.API_PREFIX}/health", tags=["Health & Meta"])
async def api_health():
    return {
        "status": "healthy",
        "active_modules": [
            "Site Safety Monitoring (PPE & Hazard Vision)",
            "Structural Crack Detection & Defect Assessment",
            "Real Estate Valuation & Cost Estimation BOQ",
            "Construction Project Planning & WBS Scheduling",
            "Daily Site Log & Field Assistant",
            "Weather-Aware Advisory",
            "Construction Knowledge Assistant (OSHA & IBC)",
            "Executive Dashboard & Analytics"
        ]
    }

# Register Routers
app.include_router(dashboard_router.router, prefix=settings.API_PREFIX)
app.include_router(safety_router.router, prefix=settings.API_PREFIX)
app.include_router(crack_router.router, prefix=settings.API_PREFIX)
app.include_router(valuation_router.router, prefix=settings.API_PREFIX)
app.include_router(planning_router.router, prefix=settings.API_PREFIX)
app.include_router(daily_log_router.router, prefix=settings.API_PREFIX)
app.include_router(weather_router.router, prefix=settings.API_PREFIX)
app.include_router(knowledge_router.router, prefix=settings.API_PREFIX)
