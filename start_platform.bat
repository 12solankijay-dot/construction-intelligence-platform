@echo off
TITLE AI-Powered Multimodal Construction Intelligence Platform
echo ==============================================================================
echo   AI-POWERED MULTIMODAL CONSTRUCTION INTELLIGENCE PLATFORM
echo   FastAPI Backend + React.js Frontend + Multimodal AI Decision Support
echo ==============================================================================

SET PATH=C:\Users\jay\nodejs;C:\Users\jay\anaconda3;C:\Users\jay\anaconda3\Scripts;%PATH%

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Construction Intelligence Backend" cmd /k "cd /d %~dp0backend && C:\Users\jay\anaconda3\python.exe run_backend.py"

timeout /t 2 /nobreak > nul

echo [2/2] Starting React.js Frontend on http://localhost:5173 ...
start "Construction Intelligence Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers initiated!
echo - Frontend Dashboard: http://localhost:5173
echo - Swagger API Documentation: http://localhost:8000/docs
echo ==============================================================================
pause
