@echo off
echo ============================================
echo  VERCEL DEPLOYMENT - QUICK START
echo ============================================
echo.
echo Step 1: Install Vercel CLI
echo -------------------------------------------
call npm install -g vercel
echo.
echo Step 2: Login to Vercel
echo -------------------------------------------
call vercel login
echo.
echo Step 3: Deploy to Vercel
echo -------------------------------------------
cd /d "d:\PROJECTS !\chat bot"
call vercel
echo.
echo ============================================
echo  DEPLOYMENT INITIATED!
echo ============================================
echo.
echo Next steps:
echo 1. Follow the Vercel prompts
echo 2. Add GEMINI_API_KEY environment variable in Vercel dashboard
echo 3. Run: vercel --prod
echo.
echo Full guide: VERCEL_DEPLOYMENT.md
echo ============================================
pause
