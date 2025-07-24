@echo off
REM Windows11 Widget Delivery Package Creator
REM Creates installer and distribution package for Windows11 Widget

echo ========================================
echo    Windows11 Widget Package Creator
echo ========================================
echo.

cd /d "%~dp0"

set PACKAGE_NAME=cucoext-windows11-widget
set VERSION_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%
set DELIVERY_DIR=delivery_package

echo [INFO] Creating Windows11 Widget delivery package...
echo [INFO] Package: %PACKAGE_NAME%
echo [INFO] Date: %VERSION_DATE%
echo.

REM Check for PowerShell
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PowerShell not found. Required for package creation.
    pause
    exit /b 1
)

REM Create delivery directory
if exist "%DELIVERY_DIR%" (
    echo [INFO] Cleaning existing delivery directory...
    rmdir /s /q "%DELIVERY_DIR%"
)
mkdir "%DELIVERY_DIR%"
mkdir "%DELIVERY_DIR%\widget"
mkdir "%DELIVERY_DIR%\installer"

echo [INFO] Copying widget files...

REM Copy all widget files
copy "server.js" "%DELIVERY_DIR%\widget\"
copy "widget.html" "%DELIVERY_DIR%\widget\"
copy "widget.css" "%DELIVERY_DIR%\widget\"
copy "widget.js" "%DELIVERY_DIR%\widget\"
copy "package.json" "%DELIVERY_DIR%\widget\"
copy "manage-working-hours.js" "%DELIVERY_DIR%\widget\"

REM Copy icons if they exist
if exist "icons" (
    xcopy "icons" "%DELIVERY_DIR%\widget\icons\" /E /I
)

REM Copy node_modules if they exist (for standalone deployment)
if exist "node_modules" (
    echo [INFO] Copying Node.js dependencies...
    xcopy "node_modules" "%DELIVERY_DIR%\widget\node_modules\" /E /I /Q
)

echo [INFO] Creating installation files...

REM Create Node.js installer script
(
echo @echo off
echo REM CucoExt Windows11 Widget Installer
echo.
echo echo ==========================================
echo echo     CucoExt Windows11 Widget Installer
echo echo ==========================================
echo echo.
echo.
echo cd /d "%%~dp0"
echo set WIDGET_DIR=%%CD%%\widget
echo set SERVICE_NAME=CucoExtWidget
echo.
echo echo [INFO] Installing CucoExt Windows11 Widget...
echo echo [INFO] Widget Directory: %%WIDGET_DIR%%
echo echo.
echo.
echo REM Check if Node.js is installed
echo where node ^>nul 2^>nul
echo if %%errorlevel%% neq 0 ^(
echo     echo [ERROR] Node.js not found. Please install Node.js first.
echo     echo [INFO] Download from: https://nodejs.org/
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo [INFO] Node.js found. Checking version...
echo node --version
echo.
echo REM Check if npm is available
echo where npm ^>nul 2^>nul
echo if %%errorlevel%% neq 0 ^(
echo     echo [ERROR] npm not found. Please reinstall Node.js with npm.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo [INFO] Installing widget dependencies...
echo cd "%%WIDGET_DIR%%"
echo.
echo REM Install dependencies if package.json exists and no node_modules
echo if exist "package.json" ^(
echo     if not exist "node_modules" ^(
echo         echo [INFO] Installing Node.js packages...
echo         npm install
echo         if %%errorlevel%% neq 0 ^(
echo             echo [ERROR] Failed to install dependencies
echo             pause
echo             exit /b 1
echo         ^)
echo     ^) else ^(
echo         echo [INFO] Dependencies already installed
echo     ^)
echo ^) else ^(
echo     echo [WARNING] package.json not found
echo ^)
echo.
echo echo [INFO] Testing widget startup...
echo timeout /t 2 /nobreak ^>nul
echo.
echo REM Test if widget starts correctly
echo echo [INFO] Starting widget test...
echo start /b node server.js
echo timeout /t 5 /nobreak ^>nul
echo.
echo REM Check if port is in use ^(widget started^)
echo powershell -Command "try { $test = New-Object Net.Sockets.TcpClient('localhost', 3000); $test.Close(); exit 0 } catch { exit 1 }"
echo if %%errorlevel%% equ 0 ^(
echo     echo [SUCCESS] Widget started successfully on port 3000
echo     taskkill /f /im node.exe ^>nul 2^>nul
echo ^) else ^(
echo     echo [INFO] Testing alternative port 3001...
echo     powershell -Command "try { $test = New-Object Net.Sockets.TcpClient('localhost', 3001); $test.Close(); exit 0 } catch { exit 1 }"
echo     if %%errorlevel%% equ 0 ^(
echo         echo [SUCCESS] Widget started successfully on port 3001
echo         taskkill /f /im node.exe ^>nul 2^>nul
echo     ^) else ^(
echo         echo [WARNING] Widget may not have started correctly
echo     ^)
echo ^)
echo.
echo cd /d "%%~dp0"
echo.
echo echo [SUCCESS] CucoExt Widget installation completed!
echo echo.
echo echo 💡 Next steps:
echo echo   1. Run start-widget.bat to start the widget
echo echo   2. Open widget.html in browser to use widget
echo echo   3. Configure working hours in widget settings
echo echo   4. Use auto-start-setup.bat for automatic startup
echo echo.
echo pause
) > "%DELIVERY_DIR%\installer\install.bat"

REM Create widget startup script
(
echo @echo off
echo REM CucoExt Widget Startup Script
echo.
echo cd /d "%%~dp0\..\widget"
echo.
echo echo Starting CucoExt Windows11 Widget...
echo echo.
echo echo Widget will be available at:
echo echo   http://localhost:3000/widget.html
echo echo   ^(or http://localhost:3001/widget.html if port 3000 is busy^)
echo echo.
echo echo Press Ctrl+C to stop the widget
echo echo.
echo.
echo node server.js
) > "%DELIVERY_DIR%\start-widget.bat"

REM Create auto-start setup script
(
echo @echo off
echo REM Auto-Start Setup for CucoExt Widget
echo.
echo echo ========================================
echo echo     CucoExt Auto-Start Setup
echo echo ========================================
echo echo.
echo.
echo cd /d "%%~dp0"
echo set WIDGET_DIR=%%CD%%\widget
echo set STARTUP_DIR=%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\Startup
echo set SHORTCUT_NAME=CucoExt Widget.lnk
echo.
echo echo [INFO] Setting up auto-start for CucoExt Widget...
echo echo [INFO] Widget Directory: %%WIDGET_DIR%%
echo echo [INFO] Startup Directory: %%STARTUP_DIR%%
echo echo.
echo.
echo REM Create startup script in widget directory
echo ^(
echo echo @echo off
echo echo cd /d "%%WIDGET_DIR%%"
echo echo start /min node server.js
echo ^) ^> "%%WIDGET_DIR%%\start-widget-auto.bat"
echo.
echo REM Create shortcut using PowerShell
echo powershell -Command ^"^
echo $WshShell = New-Object -comObject WScript.Shell; ^
echo $Shortcut = $WshShell.CreateShortcut('%%STARTUP_DIR%%\%%SHORTCUT_NAME%%'); ^
echo $Shortcut.TargetPath = '%%WIDGET_DIR%%\start-widget-auto.bat'; ^
echo $Shortcut.WorkingDirectory = '%%WIDGET_DIR%%'; ^
echo $Shortcut.WindowStyle = 7; ^
echo $Shortcut.Save()^"
echo.
echo if %%errorlevel%% equ 0 ^(
echo     echo [SUCCESS] Auto-start configured successfully!
echo     echo [INFO] Widget will start automatically when Windows boots
echo     echo [INFO] Shortcut created: %%STARTUP_DIR%%\%%SHORTCUT_NAME%%
echo ^) else ^(
echo     echo [ERROR] Failed to create auto-start shortcut
echo     echo [INFO] You can manually copy start-widget.bat to startup folder
echo ^)
echo.
echo echo.
echo echo 💡 Manual auto-start setup:
echo echo   1. Copy start-widget.bat to: %%STARTUP_DIR%%
echo echo   2. Rename to: CucoExt Widget.bat
echo echo   3. Widget will start with Windows
echo echo.
echo pause
) > "%DELIVERY_DIR%\auto-start-setup.bat"

echo [INFO] Creating installation documentation...

REM Create installation guide
(
echo # CucoExt Windows11 Widget - Installation Guide
echo.
echo ## System Requirements
echo.
echo - **Windows 10/11** ^(64-bit recommended^)
echo - **Node.js 16+** ^(LTS version recommended^)
echo - **4 GB RAM** minimum
echo - **50 MB disk space** for widget files
echo - **Internet connection** for cuco360.cucorent.com access
echo.
echo ## Installation Methods
echo.
echo ### Method 1: Automated Installation ^(Recommended^)
echo.
echo 1. **Extract the package** to desired location ^(e.g., `C:\CucoExt\`^)
echo 2. **Right-click** on `installer\install.bat`
echo 3. **Select "Run as administrator"** ^(recommended^)
echo 4. **Follow the installation prompts**
echo 5. **Installation completes automatically**
echo.
echo ### Method 2: Manual Installation
echo.
echo 1. **Install Node.js** from https://nodejs.org/ ^(if not installed^)
echo 2. **Extract package** to desired location
echo 3. **Open Command Prompt** in the `widget` folder
echo 4. **Run**: `npm install` ^(if dependencies needed^)
echo 5. **Test**: `node server.js`
echo 6. **Verify**: Open http://localhost:3000/widget.html
echo.
echo ## First-Time Setup
echo.
echo ### Step 1: Start the Widget
echo 1. **Run** `start-widget.bat` from the package folder
echo 2. **Widget starts** and shows port information
echo 3. **Keep terminal open** ^(minimizing is fine^)
echo.
echo ### Step 2: Open Widget Interface
echo 1. **Open browser** and go to `http://localhost:3000/widget.html`
echo 2. **Widget loads** with default configuration
echo 3. **Click settings gear** to configure working hours
echo.
echo ### Step 3: Configure Working Hours
echo 1. **Open Settings Panel** ^(gear icon^)
echo 2. **Select Schedule Type**:
echo    - **Common**: Standard Spanish schedule
echo    - **Standard**: Traditional 8-hour schedule  
echo    - **Intensive**: Summer intensive schedule
echo 3. **Enable "Auto-detect August intensive"** ^(recommended^)
echo 4. **Save configuration**
echo.
echo ### Step 4: Extract Credentials
echo 1. **Login to cuco360.cucorent.com** in any browser tab
echo 2. **Widget automatically detects** login and extracts credentials
echo 3. **Status updates** to show current work information
echo.
echo ## Auto-Start Configuration
echo.
echo ### Enable Auto-Start
echo 1. **Run** `auto-start-setup.bat` as administrator
echo 2. **Shortcut created** in Windows Startup folder
echo 3. **Widget starts automatically** when Windows boots
echo 4. **Runs minimized** in background
echo.
echo ### Disable Auto-Start
echo 1. **Go to**: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
echo 2. **Delete**: `CucoExt Widget.lnk`
echo 3. **Auto-start disabled**
echo.
echo ## Features
echo.
echo - ✅ **Real-time work time tracking** with Spanish regulations
echo - ✅ **Presence time calculation** ^(actual office time excluding breaks^)
echo - ✅ **Multiple schedule support** ^(Common/Standard/Intensive^)
echo - ✅ **August intensive auto-detection** ^(enabled by default^)
echo - ✅ **Working hours configuration** via settings panel
echo - ✅ **Automatic credential extraction** from browser sessions
echo - ✅ **Port conflict resolution** ^(automatically tries alternative ports^)
echo - ✅ **Windows startup integration** ^(optional^)
echo - ✅ **Minimizable server console** for background operation
echo.
echo ## Widget Interface
echo.
echo ### Time Display
echo - **Working Time**: Total time from first entry ^(includes breaks^)
echo - **Presence Time**: Actual office time ^(excludes breaks^)
echo - **Remaining Time**: Time left to complete work day
echo.
echo ### Status Indicators
echo - 🟢 **Green**: Can leave now - work day complete
echo - 🔵 **Blue**: Currently working - shows remaining time
echo - 🟡 **Yellow**: Out of office - shows "OUT" status
echo - 🔴 **Red**: Error, credentials expired, or overtime
echo.
echo ### Settings Panel
echo - **Schedule Type**: Choose work schedule pattern
echo - **Auto-detect August**: Automatically switch to intensive in August
echo - **Working Hours**: Configure start/end times and requirements
echo - **Debug Mode**: Enable detailed logging for troubleshooting
echo.
echo ## Troubleshooting
echo.
echo ### Widget Won't Start
echo - **Check Node.js**: Ensure Node.js 16+ is installed
echo - **Check Port**: Another application may be using port 3000
echo - **Check Permissions**: Run as administrator if needed
echo - **Check Dependencies**: Run `npm install` in widget folder
echo.
echo ### No Data Showing
echo - **Login Required**: Ensure logged into cuco360.cucorent.com
echo - **Credentials Expired**: Re-login to cuco360 website
echo - **Network Issues**: Check internet connection
echo - **Debug Mode**: Enable in settings for detailed logs
echo.
echo ### Port Already in Use
echo - **Automatic Detection**: Widget tries port 3001 automatically
echo - **Manual Port**: Edit server.js to change default port
echo - **Kill Process**: Use Task Manager to close conflicting apps
echo.
echo ### Auto-Start Not Working
echo - **Check Shortcut**: Verify shortcut exists in Startup folder
echo - **Run as Admin**: Some Windows configurations require admin rights
echo - **Path Issues**: Ensure widget path doesn't contain special characters
echo.
echo ## Support Information
echo.
echo **Version**: %VERSION_DATE%
echo **Platform**: Windows 10/11 Widget
echo **Technology**: Node.js HTTP Server
echo **Browser**: Any modern browser ^(Chrome, Firefox, Edge, Opera^)
echo **Dependencies**: Node.js runtime and npm packages
echo.
echo ## File Structure
echo.
echo ```
echo CucoExt-Windows11-Widget/
echo ├── widget/
echo │   ├── server.js              ^(Main server file^)
echo │   ├── widget.html            ^(Widget interface^)
echo │   ├── widget.css             ^(Widget styles^)
echo │   ├── widget.js              ^(Widget logic^)
echo │   ├── package.json           ^(Node.js dependencies^)
echo │   └── manage-working-hours.js ^(Working hours management^)
echo ├── installer/
echo │   └── install.bat            ^(Automated installer^)
echo ├── start-widget.bat           ^(Manual startup script^)
echo ├── auto-start-setup.bat       ^(Auto-start configuration^)
echo └── INSTALLATION_GUIDE.md      ^(This guide^)
echo ```
) > "%DELIVERY_DIR%\INSTALLATION_GUIDE.md"

REM Create deployment guide
(
echo # Windows11 Widget Deployment Guide
echo.
echo ## Package Distribution
echo.
echo ### ZIP Distribution
echo 1. **Compress entire delivery_package** folder
echo 2. **Name**: `CucoExt-Windows11-Widget-v%VERSION_DATE%.zip`
echo 3. **Distribute** via email, network share, or download
echo.
echo ### Network Deployment
echo 1. **Copy to network share**: `\\server\software\CucoExt\`
echo 2. **Create batch file** for network installation
echo 3. **Users run**: Network install script
echo.
echo ### Enterprise Deployment
echo 1. **Group Policy**: Deploy via software installation policy
echo 2. **System Center**: Use SCCM for automated deployment
echo 3. **PowerShell DSC**: Configure desired state deployment
echo.
echo ## Installation Verification
echo.
echo ### Post-Install Checks
echo 1. **Widget Starts**: Verify server.js launches successfully
echo 2. **Port Binding**: Confirm HTTP server binds to port 3000/3001
echo 3. **Web Interface**: Check http://localhost:3000/widget.html loads
echo 4. **Settings Panel**: Verify configuration options work
echo 5. **Auto-Start**: Test Windows startup integration if enabled
echo.
echo ### Health Monitoring
echo 1. **Process Monitor**: Check if node.exe process is running
echo 2. **Port Monitor**: Verify HTTP port is listening
echo 3. **Log Files**: Check console output for errors
echo 4. **Browser Access**: Confirm widget interface is accessible
echo.
echo ## System Integration
echo.
echo ### Windows Services ^(Advanced^)
echo.
echo To run as Windows Service:
echo 1. **Install PM2**: `npm install -g pm2`
echo 2. **Install PM2 Service**: `pm2-service-install`
echo 3. **Start Service**: `pm2 start server.js --name CucoExt`
echo 4. **Save Config**: `pm2 save`
echo 5. **Service Auto-Start**: Configured automatically
echo.
echo ### Firewall Configuration
echo.
echo If Windows Firewall blocks the widget:
echo 1. **Allow Node.js**: Add exception for node.exe
echo 2. **Allow Port**: Add exception for port 3000/3001
echo 3. **Local Access**: Ensure localhost access is permitted
echo.
echo ### Performance Optimization
echo.
echo 1. **CPU Usage**: Node.js process should use minimal CPU
echo 2. **Memory Usage**: Typical usage under 50MB RAM
echo 3. **Network**: Only outbound connections to cuco360.cucorent.com
echo 4. **Disk I/O**: Minimal disk access after startup
echo.
echo ## Security Considerations
echo.
echo ### Local Security
echo 1. **Localhost Only**: Widget only binds to localhost interface
echo 2. **No External Access**: Not accessible from network
echo 3. **Credential Storage**: Stored locally in widget memory only
echo 4. **No Persistence**: Credentials not saved to disk
echo.
echo ### Network Security
echo 1. **HTTPS Only**: All cuco360 communication over HTTPS
echo 2. **Certificate Validation**: Node.js validates SSL certificates
echo 3. **No Proxy**: Direct connection to cuco360.cucorent.com
echo 4. **Data Privacy**: No data sent to external servers
echo.
echo ## Maintenance
echo.
echo ### Updates
echo 1. **Stop Widget**: Close running widget instance
echo 2. **Backup Settings**: Note working hours configuration
echo 3. **Replace Files**: Copy new widget files over existing
echo 4. **Restart Widget**: Start updated widget instance
echo 5. **Verify**: Test all functionality works correctly
echo.
echo ### Backup
echo 1. **Widget Files**: Backup entire widget folder
echo 2. **Settings**: Note working hours configuration
echo 3. **Startup Config**: Backup auto-start shortcut if used
echo.
echo ### Uninstallation
echo 1. **Stop Widget**: Close running widget process
echo 2. **Remove Auto-Start**: Delete startup shortcut if configured
echo 3. **Delete Files**: Remove widget installation folder
echo 4. **Cleanup**: Remove any remaining temporary files
echo.
echo ## Support
echo.
echo **Deployment Version**: %VERSION_DATE%
echo **Target Platform**: Windows 10/11
echo **Node.js Version**: 16+ LTS
echo **Browser Compatibility**: Chrome, Firefox, Edge, Opera
echo **Installation Method**: Batch script with Node.js runtime
) > "%DELIVERY_DIR%\DEPLOYMENT_GUIDE.md"

REM Create package info
(
echo Package: %PACKAGE_NAME%
echo Version: %VERSION_DATE%
echo Platform: Windows 10/11 Widget
echo Technology: Node.js HTTP Server
echo Created: %date% %time%
echo.
echo Contents:
echo - widget/                ^(Widget server and interface files^)
echo - installer/install.bat  ^(Automated installation script^)
echo - start-widget.bat       ^(Manual widget startup^)
echo - auto-start-setup.bat   ^(Windows auto-start configuration^)
echo - INSTALLATION_GUIDE.md  ^(User installation instructions^)
echo - DEPLOYMENT_GUIDE.md    ^(IT deployment instructions^)
echo - PACKAGE_INFO.txt       ^(This file^)
echo.
echo System Requirements:
echo - Windows 10/11 ^(64-bit recommended^)
echo - Node.js 16+ ^(LTS version^)
echo - 4 GB RAM minimum
echo - 50 MB disk space
echo - Internet connection for cuco360 access
echo.
echo Installation:
echo 1. Extract package to desired location
echo 2. Run installer\install.bat as administrator
echo 3. Run start-widget.bat to start widget
echo 4. Open http://localhost:3000/widget.html
echo 5. Configure working hours in settings
echo.
echo Auto-Start:
echo 1. Run auto-start-setup.bat as administrator
echo 2. Widget starts automatically with Windows
echo 3. Runs minimized in background
echo.
echo Features:
echo - Real-time work time tracking
echo - Presence time calculation
echo - Working hours configuration
echo - August intensive auto-detection
echo - Port conflict resolution
echo - Windows startup integration
) > "%DELIVERY_DIR%\PACKAGE_INFO.txt"

echo [SUCCESS] Windows11 Widget package created successfully!
echo.
echo 📦 Package location: %DELIVERY_DIR%\
echo 🪟 Installation guide: %DELIVERY_DIR%\INSTALLATION_GUIDE.md
echo 🚀 Deployment guide: %DELIVERY_DIR%\DEPLOYMENT_GUIDE.md
echo ⚙️ Automated installer: %DELIVERY_DIR%\installer\install.bat
echo 🔄 Auto-start setup: %DELIVERY_DIR%\auto-start-setup.bat
echo.
echo 💡 Next steps:
echo   1. Test automated installation on clean Windows system
echo   2. Verify widget functionality with test credentials
echo   3. Test auto-start configuration
echo   4. Create distribution ZIP file
echo   5. Document deployment for IT teams
echo.
pause
