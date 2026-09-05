@echo off
echo Starting React Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
call npm run dev
