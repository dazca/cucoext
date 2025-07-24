@echo off
REM CucoExt Widget - Console Mode
REM This version shows all output for debugging

echo ========================================
echo     CucoExt Widget (Debug Mode)
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Starting widget with console output...
echo [INFO] This window will show all debug messages
echo [INFO] Keep this window open to see widget status
echo.

REM Run Electron with console output visible
npx electron taskbar-main.js

echo.
echo [INFO] Widget stopped. Press any key to close...
pause >nul
