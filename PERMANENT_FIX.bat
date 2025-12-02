@echo off
echo ========================================
echo PERMANENT FIX - VS Code Terminal Path
echo ========================================
echo.
echo This will permanently fix the terminal path issue.
echo.
pause

REM Kill all VS Code processes
echo Closing VS Code...
taskkill /F /IM "Code.exe" 2>nul

REM Clear workspace storage
echo Clearing old workspace data...
rd /s /q "%APPDATA%\Code\User\workspaceStorage" 2>nul
timeout /t 1 /nobreak > nul

REM Remove the old folder from recent workspaces
echo Removing old workspace references...
del /q "%APPDATA%\Code\User\globalStorage\storage.json" 2>nul

REM Open VS Code in the CORRECT folder
echo Opening VS Code in the correct folder...
cd /d "d:\PROJECTS !\chat bot"
start "" "code" "d:\PROJECTS !\chat bot"

echo.
echo ========================================
echo DONE! VS Code will now open in:
echo d:\PROJECTS !\chat bot
echo ========================================
echo.
echo Close this window.
timeout /t 3
exit
