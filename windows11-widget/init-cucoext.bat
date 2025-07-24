@echo off
REM CucoExt Complete Initialization Script
REM This script sets up and starts all CucoExt widget components

echo ========================================
echo     CucoExt Complete Setup
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Initializing CucoExt Windows 11 Widget System...
echo.

REM Check Node.js installation
node --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo [INFO] Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [SUCCESS] Node.js detected: 
node --version

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed
) else (
    echo [SUCCESS] Dependencies already installed
)

echo.
echo Available startup options:
echo.
echo 1. Start Taskbar Widget (Recommended)
echo    - Runs in system tray with real-time updates
echo    - Native Windows integration
echo    - Auto-updates every 30 seconds
echo.
echo 2. Start HTTP Server
echo    - Web-based widget at http://localhost:3001
echo    - For browser access or testing
echo.
echo 3. Start Both (Complete System)
echo    - Taskbar widget + HTTP server
echo    - Maximum compatibility
echo.
echo 4. Install Widget Permanently
echo    - Set up auto-start and taskbar pinning
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo [INFO] Starting Taskbar Widget...
    call start-widget.bat
    goto :end
)

if "%choice%"=="2" (
    echo [INFO] Starting HTTP Server...
    call start-server.bat
    goto :end
)

if "%choice%"=="3" (
    echo [INFO] Starting Complete System...
    echo [INFO] Launching HTTP Server in background...
    start /min cmd /c "start-server.bat"
    timeout /t 2 /nobreak > nul
    echo [INFO] Launching Taskbar Widget...
    call start-widget.bat
    goto :end
)

if "%choice%"=="4" (
    echo [INFO] Installing Widget Permanently...
    call install-widget.bat
    goto :end
)

echo [ERROR] Invalid choice. Please run the script again.
pause

:end
echo.
echo [INFO] CucoExt initialization complete!
exit /b 0
