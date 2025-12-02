@echo off
echo ========================================
echo Fixing VS Code Workspace Issue
echo ========================================
echo.
echo This will:
echo 1. Remove old workspace cache
echo 2. Open VS Code in the correct folder
echo.
pause

REM Remove VS Code workspace cache for the old folder
echo Clearing old workspace cache...
rd /s /q "%APPDATA%\Code\User\workspaceStorage" 2>nul

REM Open VS Code in the correct project folder
echo Opening VS Code in the correct folder...
cd /d "d:\PROJECTS !\chat bot"
code .

echo.
echo Done! VS Code should now open in the correct folder.
echo Close this window.
pause
