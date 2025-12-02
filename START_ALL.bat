@echo off
echo ========================================
echo Starting Talky - Full Application
echo ========================================
echo.
echo Starting Backend Server...
start "Talky Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "Talky Frontend" cmd /k "cd frontend && python serve.py"
echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo You can close this window
pause
