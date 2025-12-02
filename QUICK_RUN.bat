@echo off
REM Quick run - just starts backend and opens frontend
cd /d "d:\PROJECTS !\chat bot\backend"
start "Backend - Port 8080" cmd /k "cd /d \"d:\PROJECTS !\\chat bot\\backend\" && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080"
timeout /t 2 /nobreak > nul
start "" "d:\PROJECTS !\\chat bot\\frontend\\index.html"
exit
