@echo off
echo Starting MySQL Server...
start "" /B "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\my.ini"
ping -n 3 127.0.0.1 >nul
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin.exe" -u root ping
if %ERRORLEVEL% equ 0 (
    echo MySQL Server started successfully!
) else (
    echo MySQL Server might still be initializing or failed to start.
)
