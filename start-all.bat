@echo off
echo ==========================================
echo Starting Student Management Fullstack App
echo ==========================================

echo 1. Starting MySQL Server...
call "%~dp0start-mysql.bat"

echo 2. Starting Spring Boot Backend...
start "Spring Boot Backend" cmd /c "%~dp0start-backend.bat"

echo 3. Starting React Frontend...
start "React Frontend" cmd /c "%~dp0start-frontend.bat"

echo.
echo All services launched!
echo - Backend API:  http://localhost:8080
echo - Frontend App: http://localhost:5173
echo ==========================================
