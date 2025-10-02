@echo off
echo ========================================
echo KingTube Clone - GitHub Deployment
echo ========================================
echo.
echo This script will help you deploy to GitHub
echo.
echo Step 1: Make sure you have GitHub CLI installed
echo If not, download from: https://cli.github.com/
echo.
echo Step 2: Authenticate with GitHub
gh auth login
echo.
echo Step 3: Push to GitHub
git push -u origin main
echo.
echo ========================================
echo Deployment Complete!
echo Your project will be available at:
echo https://github.com/ɪɴᴠɪꜱɪʙʟᴇɢʜᴏꜱᴛ/Mmsfose
echo ========================================
pause
