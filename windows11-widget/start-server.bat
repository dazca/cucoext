@echo off
REM CucoExt HTTP Server Launcher
REM This script starts the HTTP server for web-based widget access

echo ========================================
echo     CucoExt HTTP Server
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Starting CucoExt HTTP Server...
echo [INFO] Server will be available at http://localhost:3001
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

REM Start the HTTP server
echo [INFO] Launching server...
echo [INFO] If port 3001 is busy, server will automatically find available port
echo [INFO] Press Ctrl+C to stop the server
echo.

npm run server

echo.
echo [INFO] Server stopped.
echo.
echo [TIP] If you had port conflicts, you can also use:
echo   stop-server.bat  - To manage running processes
echo   set PORT=3010 ^&^& npm run server  - To use specific port
echo.
pause
