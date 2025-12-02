@echo off
title Talky - Auto Startup
color 0A
echo ========================================
echo    TALKY - Automatic Project Startup
echo ========================================
echo.
echo [1/2] Starting Backend Server...
echo.

REM Start backend in a new window with correct directory
start "Talky Backend - Port 8080" cmd /k "cd /d \"d:\PROJECTS !\\chat bot\\backend\" && echo Starting backend on port 8080... && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080"

echo ✓ Backend starting on http://localhost:8080
echo.
echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul
echo.
echo [2/2] Opening Frontend...
echo.

REM Open the frontend in default browser
start "" "d:\PROJECTS !\\chat bot\\frontend\\index.html"

echo ✓ Frontend opened in browser
echo.
echo ========================================
echo    TALKY IS NOW RUNNING!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: Open in your browser
echo.
echo Press any key to stop all servers...
pause > nul

echo.
echo Shutting down...
taskkill /F /FI "WINDOWTITLE eq Talky Backend - Port 8080*" 2>nul
echo Done!
