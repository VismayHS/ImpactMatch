@echo off
echo ========================================
echo  Starting ImpactMatch Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Cleaning up existing servers...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server (Port 5173)...
start "Backend Server" cmd /k "cd /d %~dp0impactmatch && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo  Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5173
echo Frontend: http://localhost:3000
echo.
echo NOTE: Both servers are running in separate windows.
echo       DO NOT close those windows!
echo.
echo Press any key to exit this script...
pause >nul
