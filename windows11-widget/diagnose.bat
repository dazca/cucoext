@echo off
echo ========================================
echo    CucoExt Widget Diagnostic Tool
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Checking environment...
echo Working directory: %CD%
echo.

echo [INFO] Checking Node.js...
node --version
if errorlevel 1 (
    echo [ERROR] Node.js not found
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js is available
)
echo.

echo [INFO] Checking NPM...
npm --version
if errorlevel 1 (
    echo [ERROR] NPM not found
    pause
    exit /b 1
) else (
    echo [SUCCESS] NPM is available
)
echo.

echo [INFO] Checking Electron installation...
if exist "node_modules\electron" (
    echo [SUCCESS] Electron found in node_modules
) else (
    echo [WARNING] Electron not found locally, checking global...
)

npx electron --version
if errorlevel 1 (
    echo [ERROR] Electron not accessible via npx
    echo [INFO] Installing Electron locally...
    npm install electron
    if errorlevel 1 (
        echo [ERROR] Failed to install Electron
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Electron is accessible
)
echo.

echo [INFO] Checking required files...
if exist "taskbar-main.js" (
    echo [SUCCESS] taskbar-main.js found
) else (
    echo [ERROR] taskbar-main.js missing
)

if exist "taskbar-popup.html" (
    echo [SUCCESS] taskbar-popup.html found
) else (
    echo [WARNING] taskbar-popup.html missing (will create fallback)
)

if exist "package.json" (
    echo [SUCCESS] package.json found
) else (
    echo [ERROR] package.json missing
)
echo.

echo [INFO] Testing Electron with simple command...
echo const { app } = require('electron'); app.whenReady().then(() => { console.log('Electron works!'); app.quit(); }); > test-electron.js

node_modules\.bin\electron test-electron.js
if errorlevel 1 (
    echo [ERROR] Electron test failed
    echo [INFO] Trying with npx...
    npx electron test-electron.js
    if errorlevel 1 (
        echo [ERROR] Both methods failed
        pause
        exit /b 1
    )
)

del test-electron.js
echo [SUCCESS] Electron test passed
echo.

echo [INFO] Diagnostic complete. Try running the widget now.
pause
