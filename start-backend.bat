@echo off
echo Starting Spring Boot Backend on http://localhost:8080 ...
cd /d "%~dp0backend"
call .\mvnw.cmd spring-boot:run
