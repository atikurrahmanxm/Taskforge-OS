@echo off
setlocal enabledelayedexpansion
title TaskForge OS - Git Push Helper
color 0B

echo ========================================================
echo        ⚡ TaskForge OS - GitHub Push Helper ⚡
echo ========================================================
echo.

cd /d "%~dp0"

echo Current Git Status:
git status -s
echo.

set /p USER_MSG="Enter custom commit message (or press ENTER to push current state): "

if not "%USER_MSG%"=="" (
    git add -A
    git commit -m "%USER_MSG%"
)

echo.
echo Pushing commits to GitHub (origin main)...
git push origin main

if errorlevel 1 (
    echo.
    echo ========================================================
    echo ⚠️  Push failed! Check your connection or permissions.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  🎉 SUCCESS! TaskForge OS commits pushed to GitHub!
    echo ========================================================
)

echo.
pause
