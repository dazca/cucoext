@echo off
REM CucoExt Quick Start Guide
REM This file provides a simple overview of available launch options

echo ==========================================
echo      CucoExt Quick Start Guide
echo ==========================================
echo.
echo Available Launch Options:
echo.
echo 1. INTERACTIVE SETUP (Recommended for new users)
echo    File: init-cucoext.bat
echo    Usage: Double-click this file
echo    Features: Menu-driven setup with explanations
echo.
echo 2. DIRECT WIDGET LAUNCH (Quick start)
echo    File: start-widget.bat  
echo    Usage: Double-click this file
echo    Features: Immediately starts taskbar widget
echo.
echo 3. HTTP SERVER (Web access)
echo    File: start-server.bat
echo    Usage: Double-click this file
echo    Features: Web widget at http://localhost:3001
echo.
echo 4. POWERSHELL LAUNCHER (Advanced users)
echo    File: Start-CucoExt.ps1
echo    Usage: powershell -File Start-CucoExt.ps1 -Mode widget
echo    Features: Command-line control with parameters
echo.
echo 5. STOP ALL PROCESSES
echo    File: stop-cucoext.bat
echo    Usage: Double-click this file
echo    Features: Safely stops all CucoExt processes
echo.
echo Widget Location:
echo - Look for colored circle icon in system tray (bottom-right)
echo - Near the clock and Windows notification icons
echo - Left-click to show/hide, right-click for menu
echo.
echo Status Colors:
echo - Blue: Working time remaining
echo - Green: You can leave now!
echo - Red: Error or overtime  
echo - White: Loading...
echo.

set /p choice="Press Enter to open interactive setup, or close this window: "
call init-cucoext.bat
