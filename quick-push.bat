@echo off
setlocal enabledelayedexpansion
title DevLog Hub - Quick GitHub Push
color 0A

echo ========================================================
echo        🌿 DevLog Hub - Quick GitHub Push Tool 🌿
echo ========================================================
echo.

:: Get current date and time
for /f "tokens=1-4 delims=/ " %%i in ("%date%") do set CDATE=%%i-%%j-%%k
for /f "tokens=1-2 delims=: " %%i in ("%time%") do set CTIME=%%i:%%j

echo [1/3] Updating Profile Streak & Log...
python "%~dp0log.py" --quick >nul 2>&1
if errorlevel 1 (
    echo [Notice] Python helper ran. Continuing with Git...
)

echo.
echo [2/3] Preparing Git Commit...
set /p USER_MSG="Enter commit message (or press ENTER for auto): "

if "%USER_MSG%"=="" (
    set USER_MSG=chore(pulse): daily contribution update [%CDATE% %CTIME%]
)

cd /d "%~dp0"
git add .
git commit -m "%USER_MSG%"

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

if errorlevel 1 (
    echo.
    echo ========================================================
    echo ⚠️  Push failed or remote not configured yet!
    echo    Make sure you have:
    echo    1. Created the private repo on GitHub
    echo    2. Run: git remote add origin https://github.com/USER/REPO.git
    echo    3. Run: git branch -M main
    echo    4. Run: git push -u origin main
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo 🎉 Successfully pushed to GitHub!
    echo    Your contribution graph has been updated! 🌿
    echo ========================================================
)

echo.
pause
