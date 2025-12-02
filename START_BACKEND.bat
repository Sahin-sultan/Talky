@echo off
title Talky Backend Server - Port 8080
echo ===================================
echo Starting Talky Backend Server
echo Port: 8080
echo ===================================
cd /d "d:\PROJECTS !\chat bot\backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080
pause
