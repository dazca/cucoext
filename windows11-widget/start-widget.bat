@echo off
REM CucoExt Windows 11 Widget Launcher
REM This script starts the Electron taskbar widget

echo ========================================
echo     CucoExt Windows 11 Widget
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Starting CucoExt Taskbar Widget...
echo [INFO] Widget will appear in system tray (bottom-right corner)
echo [INFO] Look for the colored circle icon near the clock
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [WARNING] Dependencies not found. Installing...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if Electron is available
npx electron --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Electron not found. Installing...
    npm install electron
    if errorlevel 1 (
        echo [ERROR] Failed to install Electron
        pause
        exit /b 1
    )
)

echo [INFO] Launching widget...
echo [INFO] Widget is starting in background mode
echo [INFO] Check your system tray for the colored circle icon
echo.

REM Start widget in background but keep this window open for feedback
start "CucoExt Widget" /min npx electron taskbar-main.js

echo [SUCCESS] Widget launched successfully!
echo.
echo Instructions:
echo - Look for the colored circle icon in your system tray
echo - Left-click the tray icon to show/hide the status window
echo - Right-click for context menu with options
echo - The widget updates your work status every 30 seconds
echo.
echo Widget Status Colors:
echo - Blue Circle: Working time remaining
echo - Green Circle: You can leave now!
echo - Red Circle: Error or overtime
echo - White Circle: Loading...
echo.
echo [INFO] Widget is now running in the background
echo [INFO] You can close this window safely
echo [INFO] Use stop-cucoext.bat to stop the widget
echo.

timeout /t 10 /nobreak > nul
exit /b 0
