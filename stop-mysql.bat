@echo off
echo Stopping MySQL Server...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin.exe" -u root shutdown
if %ERRORLEVEL% equ 0 (
    echo MySQL Server stopped successfully!
) else (
    echo Failed to stop MySQL Server or it was not running.
)
