@echo off
echo ========================================
echo Starting SECURE Backend Server
echo ========================================
echo.

cd secure-backend

echo Installing dependencies...
call npm install

echo.
echo Starting server...
call npm start

pause
