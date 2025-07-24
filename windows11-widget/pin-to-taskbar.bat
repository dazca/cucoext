@echo off
title CucoExt - Pin to Taskbar
echo.
echo ========================================
echo   CucoExt Windows 11 Taskbar Setup
echo ========================================
echo.

REM Kill any existing instances
taskkill /f /im electron.exe >nul 2>&1

echo Starting CucoExt Widget...
echo.

REM Start the widget
start /min npx electron taskbar-main.js

echo.
echo ✅ CucoExt is now running!
echo.
echo 📍 PINNING TO TASKBAR:
echo =====================
echo.
echo 1. Look for the CucoExt window in your taskbar
echo 2. Right-click it and select "Pin to taskbar"
echo 3. The icon will stay pinned even after closing
echo.
echo 🎯 ALTERNATIVE - System Tray:
echo ============================
echo.
echo Look in the bottom-right corner (notification area)
echo for a colored circle icon 🔵
echo.
echo ⚡ The widget will show:
echo   🔵 Blue   = Working (time remaining)
echo   🟢 Green  = Can leave now
echo   🟡 Yellow = Out of office
echo   🔴 Red    = Error
echo   ⚪ White  = Loading
echo.
echo 💡 Click the icon to see detailed status
echo 💡 Right-click for options menu
echo.
echo ⏹️ To stop: Close this window or press Ctrl+C
echo.

REM Wait for user input
pause
