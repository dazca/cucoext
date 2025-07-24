@echo off
title Install CucoExt to Windows 11 Taskbar
echo.
echo ==========================================
echo   CucoExt Windows 11 Taskbar Installer
echo ==========================================
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

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies ready
echo.

echo 🚀 Starting CucoExt Taskbar Widget...
echo.
echo 📋 INSTALLATION INSTRUCTIONS:
echo =============================
echo.
echo 1. The widget will appear in your system tray (bottom-right)
echo 2. Look for a colored circle icon 🔵🟢🟡🔴⚪
echo 3. Click the icon to see your work status
echo 4. Right-click for options including "Pin to Taskbar"
echo.
echo 📌 TO PIN TO TASKBAR:
echo ====================
echo.
echo Method 1 (Recommended):
echo   • Right-click the tray icon
echo   • Select "Pin to Taskbar"
echo   • Follow the Windows prompts
echo.
echo Method 2 (Manual):
echo   • Right-click the CucoExt icon in your taskbar
echo   • Select "Pin to taskbar"
echo.
echo Method 3 (Drag):
echo   • Drag the tray icon to your taskbar
echo.
echo ⏹️  Press Ctrl+C to stop the widget
echo.

REM Start the taskbar widget
echo Starting widget...
npx electron taskbar-main.js
