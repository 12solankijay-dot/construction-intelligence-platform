@echo off
TITLE Construction Intelligence Backend (FastAPI)
SET PATH=C:\Users\jay\anaconda3;C:\Users\jay\anaconda3\Scripts;%PATH%
cd /d %~dp0backend
echo Starting FastAPI Backend on http://localhost:8000 ...
C:\Users\jay\anaconda3\python.exe run_backend.py
pause
