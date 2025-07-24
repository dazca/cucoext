@echo off
REM CucoExt Widget Stopper
REM This script stops all running CucoExt processes

echo ========================================
echo     CucoExt Process Stopper
echo ========================================
echo.

echo [INFO] Stopping CucoExt processes...

REM Stop Electron processes
tasklist /FI "IMAGENAME eq electron.exe" 2>NUL | find /I /N "electron.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [INFO] Stopping Electron widget processes...
    taskkill /F /IM electron.exe /T >nul 2>&1
    echo [SUCCESS] Electron processes stopped
) else (
    echo [INFO] No Electron processes found
)

REM Stop Node.js server processes (if running on port 3001)
netstat -ano | findstr :3001 >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [INFO] Stopping HTTP server on port 3001...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    echo [SUCCESS] HTTP server stopped
) else (
    echo [INFO] No HTTP server found on port 3001
)

echo.
echo [SUCCESS] All CucoExt processes stopped
echo [INFO] You can restart using init-dani.azemar+cucoextbat
echo.

timeout /t 3 /nobreak > nul
exit /b 0
