@echo off
setlocal enabledelayedexpansion
title DevLog Hub - Auto-Evolution & Push
color 0A

echo ========================================================
echo        🌿 DevLog Hub - Auto-Evolution Engine 🌿
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Triggering Project Evolution & Unlocking Concept...
python "%~dp0engine\pulse_engine.py" --run

:: Read the cached smart commit message if available
set DEFAULT_MSG=chore(pulse): daily contribution update
if exist "%~dp0data\.last_commit_msg" (
    set /p DEFAULT_MSG=<"%~dp0data\.last_commit_msg"
)

echo.
echo [2/3] Commit Message:
echo   Suggested: !DEFAULT_MSG!
echo.
set /p USER_MSG="Press ENTER to use suggested, or type custom message: "

if "!USER_MSG!"=="" (
    set COMMIT_MSG=!DEFAULT_MSG!
) else (
    set COMMIT_MSG=!USER_MSG!
)

echo.
echo Committing changes...
git add .
git commit -m "!COMMIT_MSG!"

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

if errorlevel 1 (
    echo.
    echo ========================================================
    echo ⚠️  Push failed or remote issue!
    echo    Please check your network connection or repository permissions.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  🎉 SUCCESS! Project Evolved & Pushed to GitHub! 🌿
    echo  XP, Streak, and Knowledge Vault updated on GitHub!
    echo ========================================================
)

echo.
pause
