@echo off
REM CucoExt Process Manager
REM This script helps manage running CucoExt server instances

echo ========================================
echo     CucoExt Process Manager
echo ========================================
echo.

echo [INFO] Checking for running CucoExt processes...
echo.

REM Check for Node.js processes with server.js
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /i "server.js"') do (
    echo [FOUND] Node.js process running server.js (PID: %%i)
    set FOUND_PROCESS=1
)

REM Check for processes using port 3001
netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo [FOUND] Process using port 3001:
    netstat -ano | findstr :3001
    echo.
    set FOUND_PORT=1
)

if not defined FOUND_PROCESS if not defined FOUND_PORT (
    echo [INFO] No CucoExt server processes found running.
    echo [INFO] Port 3001 appears to be available.
    echo.
    echo You can safely start the server with:
    echo   start-server.bat
    goto :end
)

echo.
echo [OPTIONS] You can:
echo   1. Press 'k' to kill all Node.js processes (WARNING: affects all Node apps)
echo   2. Press 'p' to kill processes using port 3001
echo   3. Press 's' to start server (will try alternative port if needed)
echo   4. Press 'q' to quit
echo.

choice /c kpsq /m "Choose an option"

if errorlevel 4 goto :end
if errorlevel 3 goto :start
if errorlevel 2 goto :killport
if errorlevel 1 goto :killnode

:killnode
echo.
echo [WARNING] Killing all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Node.js processes terminated.
) else (
    echo [INFO] No Node.js processes were running.
)
goto :start

:killport
echo.
echo [INFO] Finding processes using port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo [INFO] Killing process ID: %%a
    taskkill /f /pid %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] Process %%a terminated.
    ) else (
        echo [WARNING] Could not terminate process %%a
    )
)
goto :start

:start
echo.
echo [INFO] Starting CucoExt server...
echo.
call start-server.bat
goto :end

:end
pause
