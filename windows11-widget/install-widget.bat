@echo off
title CucoExt Windows 11 Widget Installer
echo.
echo =========================================
echo   CucoExt Windows 11 Widget Installer
echo =========================================
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Start the widget server
echo 🚀 Starting CucoExt Widget Server...
echo.
echo The server will start at: http://localhost:3001
echo.
echo 📋 INSTALLATION STEPS:
echo =====================
echo.
echo 1. Keep this window open (server must run)
echo 2. Open Microsoft Edge (not Chrome!)
echo 3. Go to: http://localhost:3001/widget.html
echo 4. Click Edge menu (⋯) → Apps → Install this site as an app
echo 5. Check "Pin to taskbar" and "Pin to Start"
echo 6. Click "Install"
echo.
echo 🎯 FOR WIDGETS PANEL:
echo ===================
echo.
echo 7. Press Win+W to open widgets panel
echo 8. Click "+" (Add widgets) in top-right
echo 9. Find "CucoExt Work Tracker" and click "Add widget"
echo.
echo 📌 FOR TASKBAR ICON:
echo ==================
echo.
echo 7. Find "CucoExt Work Tracker" on desktop or Start menu
echo 8. Right-click → "Pin to taskbar"
echo.
echo ⏹️  Press Ctrl+C to stop server when done installing
echo.

REM Launch Edge automatically
timeout /t 3 /nobreak >nul
echo Opening Microsoft Edge...
start msedge http://localhost:3001/widget.html

REM Start the server
node server.js
