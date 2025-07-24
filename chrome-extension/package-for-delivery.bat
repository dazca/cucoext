@echo off
REM Chrome Extension Delivery Package Creator
REM Creates a distribution-ready package for Chrome Web Store

echo ========================================
echo     Chrome Extension Package Creator
echo ========================================
echo.

cd /d "%~dp0"

set PACKAGE_NAME=cucoext-chrome-extension
set VERSION_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%
set DELIVERY_DIR=delivery_package

echo [INFO] Creating Chrome Extension delivery package...
echo [INFO] Package: %PACKAGE_NAME%
echo [INFO] Date: %VERSION_DATE%
echo.

REM Create delivery directory
if exist "%DELIVERY_DIR%" (
    echo [INFO] Cleaning existing delivery directory...
    rmdir /s /q "%DELIVERY_DIR%"
)
mkdir "%DELIVERY_DIR%"
mkdir "%DELIVERY_DIR%\extension"

echo [INFO] Copying extension files...

REM Copy core extension files
copy "manifest.json" "%DELIVERY_DIR%\extension\"
copy "background.js" "%DELIVERY_DIR%\extension\"
copy "content.js" "%DELIVERY_DIR%\extension\"
copy "popup.html" "%DELIVERY_DIR%\extension\"
copy "popup.js" "%DELIVERY_DIR%\extension\"
copy "core-integration.js" "%DELIVERY_DIR%\extension\"
copy "credential-extractor.js" "%DELIVERY_DIR%\extension\"
copy "debug-utils.js" "%DELIVERY_DIR%\extension\"
copy "styles.css" "%DELIVERY_DIR%\extension\"

REM Copy icons directory
xcopy "icons" "%DELIVERY_DIR%\extension\icons\" /E /I

REM Copy license and contact files
copy "..\LICENSE.md" "%DELIVERY_DIR%\"
copy "..\CONTACT.md" "%DELIVERY_DIR%\"

echo [INFO] Creating installation documentation...

REM Create installation guide
(
echo # CucoExt Chrome Extension - Installation Guide
echo.
echo **Copyright (c) 2024-2025 CucoExt Development Team**
echo **Licensed under CC BY-NC-SA 4.0**
echo **Commercial use requires written permission: dani.azemar+cucoextlicensing@gmail.com**
echo.
echo ## ⚠️ IMPORTANT LICENSE NOTICE
echo.
echo This extension is licensed under Creative Commons BY-NC-SA 4.0:
echo - ✅ **Personal use** is allowed and encouraged
echo - ✅ **Modification and sharing** with attribution permitted
echo - ❌ **Commercial use by companies** requires explicit written permission
echo - ❌ **Paid promotion or business integration** without authorization prohibited
echo.
echo **Companies must contact dani.azemar+cucoextlicensing@gmail.com before business use.**
echo.
echo ## Quick Installation
echo.
echo ### Method 1: Chrome Web Store ^(Recommended^)
echo 1. Go to Chrome Web Store
echo 2. Search for "CucoExt Work Time Tracker"
echo 3. Click "Add to Chrome"
echo 4. Click "Add Extension" to confirm
echo.
echo ### Method 2: Developer Mode ^(For testing^)
echo 1. Open Chrome and go to `chrome://extensions/`
echo 2. Enable "Developer mode" in the top-right corner
echo 3. Click "Load unpacked"
echo 4. Select the `extension` folder from this package
echo 5. The extension will appear in your browser toolbar
echo.
echo ## First-Time Setup
echo.
echo 1. **Click the CucoExt icon** in your browser toolbar
echo 2. **Go to "Credentials" tab** and click "Auto-Extract Credentials"
echo 3. **Login to cuco360.cucorent.com** in the opened tab
echo 4. **Return to extension popup** - credentials will be automatically detected
echo 5. **Configure working hours** in the "Config" tab if needed
echo.
echo ## Features
echo.
echo - ✅ **Real-time work time tracking** with Spanish regulations
echo - ✅ **Automated credential management** 
echo - ✅ **Background monitoring** every minute
echo - ✅ **Browser badge notifications** with color coding
echo - ✅ **Work completion alerts**
echo - ✅ **Multiple schedule support** ^(Common/Standard/Intensive^)
echo - ✅ **August intensive auto-detection** ^(enabled by default^)
echo - ✅ **Presence time calculation** ^(actual office time excluding breaks^)
echo.
echo ## Status Colors
echo.
echo - 🔵 **Blue**: Currently working - shows remaining time
echo - 🟡 **Yellow**: Out of office - shows "OUT" status
echo - 🟢 **Green**: Can leave now - shows "✓" completion
echo - ⚪ **White**: Loading or no data available  
echo - 🔴 **Red**: Error, credentials expired, or overtime
echo.
echo ## Support
echo.
echo For issues or questions:
echo - Check extension popup for error messages
echo - Enable "Debug console logs" in Config tab for troubleshooting
echo - Ensure you're logged into cuco360.cucorent.com
echo.
echo **Version**: %VERSION_DATE%
echo **Platform**: Chrome Extension ^(Manifest V3^)
echo **Compatibility**: Chrome 88+
) > "%DELIVERY_DIR%\INSTALLATION_GUIDE.md"

REM Create Web Store submission guide
(
echo # Chrome Web Store Submission Guide
echo.
echo ## Files for Web Store Upload
echo.
echo 1. **Zip the extension folder**: Create `cucoext-chrome.zip` containing all files in the `extension` folder
echo 2. **Screenshots**: Provide 1280x800 screenshots of the extension in action
echo 3. **Store listing**: Use description from INSTALLATION_GUIDE.md
echo.
echo ## Web Store Listing Information
echo.
echo **Name**: CucoExt - Smart Work Time Tracker
echo.
echo **Short Description**: 
echo Spanish work time tracker for cuco360.cucorent.com with automated credentials and real-time monitoring.
echo.
echo **Category**: Productivity
echo.
echo **Keywords**: work time, productivity, time tracking, spanish, cuco360, presence tracker
echo.
echo **Permissions Justification**:
echo - `storage`: Store user credentials and configuration
echo - `activeTab`: Extract credentials from cuco360 pages
echo - `alarms`: Background time tracking updates
echo - `notifications`: Work completion alerts
echo - `host_permissions`: Access to cuco360.cucorent.com for API calls
echo.
echo ## Testing Checklist
echo.
echo - [ ] Install extension in fresh Chrome profile
echo - [ ] Test credential extraction on cuco360.cucorent.com
echo - [ ] Verify background monitoring works
echo - [ ] Test all working hour schedules
echo - [ ] Check notifications functionality
echo - [ ] Validate presence time calculations
echo - [ ] Test error handling with expired credentials
) > "%DELIVERY_DIR%\WEB_STORE_GUIDE.md"

REM Create package info
(
echo Package: %PACKAGE_NAME%
echo Version: %VERSION_DATE%
echo Platform: Chrome Extension
echo Manifest: V3
echo Created: %date% %time%
echo.
echo Contents:
echo - extension/          ^(All extension files^)
echo - INSTALLATION_GUIDE.md
echo - WEB_STORE_GUIDE.md
echo - PACKAGE_INFO.txt   ^(This file^)
) > "%DELIVERY_DIR%\PACKAGE_INFO.txt"

echo [SUCCESS] Chrome Extension package created successfully!
echo.
echo 📦 Package location: %DELIVERY_DIR%\
echo 📋 Installation guide: %DELIVERY_DIR%\INSTALLATION_GUIDE.md
echo 🌐 Web Store guide: %DELIVERY_DIR%\WEB_STORE_GUIDE.md
echo.
echo 💡 Next steps:
echo   1. Review the installation guide
echo   2. Test the extension using developer mode
echo   3. Create screenshots for Web Store submission
echo   4. Zip the extension folder for upload
echo.
pause
