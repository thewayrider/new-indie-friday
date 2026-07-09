@echo off
title MISSION CONTROL
echo [0/2] Cleaning up old engines...
taskkill /f /im node.exe >nul 2>&1

:: 1. START SANITY (The Data Vault)
echo [1/2] Starting the Data Vault (Sanity)...
cd /d "C:\Users\kimra\Desktop\Frequency Files\The-Double-Take\the-double-take"
start "SANITY-ENGINE" cmd /k "npm run dev"

timeout /t 5 >nul

:: 2. START REACT (The Website)
echo [2/2] Starting the Trading Terminal (React)...
cd /d "C:\Users\kimra\Desktop\Frequency Files\The-Double-Take\frontend"
start "REACT-ENGINE" cmd /k "npm run dev"

echo.
echo === ALL SYSTEMS ONLINE ===
echo Dashboard: http://localhost:5173
echo Sanity Studio: http://localhost:3333
echo.
pause