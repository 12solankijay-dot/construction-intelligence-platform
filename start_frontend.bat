@echo off
TITLE Construction Intelligence Frontend (React Vite)
SET PATH=C:\Users\jay\nodejs;%PATH%
cd /d %~dp0frontend
echo Starting React Frontend on http://localhost:5173 ...
npm run dev
pause
