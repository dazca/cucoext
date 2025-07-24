@echo off
REM Firefox Extension Delivery Package Creator
REM Creates XPI file and distribution package for Firefox Add-ons

echo ========================================
echo     Firefox Extension Package Creator
echo ========================================
echo.

cd /d "%~dp0"

set PACKAGE_NAME=cucoext-firefox-extension
set VERSION_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%
set DELIVERY_DIR=delivery_package

echo [INFO] Creating Firefox Extension delivery package...
echo [INFO] Package: %PACKAGE_NAME%
echo [INFO] Date: %VERSION_DATE%
echo.

REM Check if 7-Zip is available
where 7z >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] 7-Zip not found in PATH. XPI creation will be skipped.
    echo [INFO] Install 7-Zip or use manual zip creation.
    set CREATE_XPI=0
) else (
    set CREATE_XPI=1
)

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

REM Update manifest version
echo [INFO] Updating manifest version...
powershell -Command "(Get-Content '%DELIVERY_DIR%\extension\manifest.json') -replace '\"version\": \"[^\"]*\"', '\"version\": \"%VERSION_DATE%\"' | Set-Content '%DELIVERY_DIR%\extension\manifest.json'"

REM Create XPI file for Firefox
if %CREATE_XPI%==1 (
    echo [INFO] Creating XPI file for Firefox...
    cd "%DELIVERY_DIR%\extension"
    7z a -tzip "../%PACKAGE_NAME%-%VERSION_DATE%.xpi" *
    cd "..\\.."
    echo [SUCCESS] XPI file created: %DELIVERY_DIR%\%PACKAGE_NAME%-%VERSION_DATE%.xpi
) else (
    echo [INFO] Creating manual XPI instructions...
)

echo [INFO] Creating installation documentation...

REM Create installation guide
(
echo # CucoExt Firefox Extension - Installation Guide
echo.
echo ## Installation Methods
echo.
echo ### Method 1: Firefox Add-ons Store ^(Recommended^)
echo 1. Open Firefox
echo 2. Go to Firefox Add-ons store
echo 3. Search for "CucoExt Work Time Tracker"
echo 4. Click "Add to Firefox"
echo 5. Click "Add" to confirm installation
echo.
echo ### Method 2: XPI File Installation
echo 1. Open Firefox
echo 2. Press `Ctrl+Shift+A` to open Add-ons Manager
echo 3. Click the gear icon and select "Install Add-on From File..."
echo 4. Select the `.xpi` file from this package
echo 5. Click "Add" when prompted
echo.
echo ### Method 3: Temporary Development Installation
echo 1. Open Firefox and go to `about:debugging`
echo 2. Click "This Firefox" in the left sidebar
echo 3. Click "Load Temporary Add-on..."
echo 4. Navigate to the `extension` folder
echo 5. Select `manifest.json`
echo 6. Extension loads temporarily ^(until Firefox restart^)
echo.
echo ## Manual XPI Creation ^(if needed^)
echo.
echo If the XPI file is not included:
echo 1. Navigate to the `extension` folder
echo 2. Select all files and folders
echo 3. Create a ZIP archive
echo 4. Rename the `.zip` file to `.xpi`
echo 5. Install using Method 2 above
echo.
echo ## First-Time Setup
echo.
echo 1. **Click the CucoExt icon** in Firefox toolbar
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
echo ## Firefox-Specific Features
echo.
echo - 🦊 **Manifest V2 compatibility** for Firefox
echo - 🦊 **Background page** ^(not service worker^)
echo - 🦊 **browser.* API** namespace support
echo - 🦊 **Firefox 91+** compatibility
echo.
echo ## Status Colors
echo.
echo - 🔵 **Blue**: Currently working - shows remaining time
echo - 🟡 **Yellow**: Out of office - shows "OUT" status
echo - 🟢 **Green**: Can leave now - shows "✓" completion
echo - ⚪ **White**: Loading or no data available
echo - 🔴 **Red**: Error, credentials expired, or overtime
echo.
echo ## Troubleshooting
echo.
echo **Extension not loading:**
echo - Check Firefox version ^(requires 91+^)
echo - Check `about:debugging` for error messages
echo - Verify manifest.json syntax
echo.
echo **Credentials expired:**
echo - Badge shows "EXP" with red background
echo - Re-extract credentials via "Credentials" tab
echo - Ensure logged into cuco360.cucorent.com
echo.
echo **No data showing:**
echo - Verify login to cuco360.cucorent.com
echo - Enable debug logs in Config tab
echo - Check browser console for errors
echo.
echo ## Support
echo.
echo **Version**: %VERSION_DATE%
echo **Platform**: Firefox Extension ^(Manifest V2^)
echo **Compatibility**: Firefox 91+
echo **APIs**: WebExtensions with browser.* namespace
) > "%DELIVERY_DIR%\INSTALLATION_GUIDE.md"

REM Create Firefox Add-ons submission guide
(
echo # Firefox Add-ons Submission Guide
echo.
echo ## Files for Add-ons Store Upload
echo.
echo 1. **XPI File**: Use the generated `.xpi` file ^(or create manually^)
echo 2. **Source Code**: Provide the entire `extension` folder as ZIP
echo 3. **Screenshots**: Provide high-quality screenshots
echo.
echo ## Add-ons Store Listing Information
echo.
echo **Name**: CucoExt - Smart Work Time Tracker for Firefox
echo.
echo **Summary**:
echo Spanish work time tracker for cuco360.cucorent.com with automated credentials, real-time monitoring, and presence time calculation.
echo.
echo **Description**: ^(Detailed^)
echo CucoExt transforms work time tracking for Spanish companies using cuco360.cucorent.com. 
echo Features include automated credential management, real-time work time monitoring, 
echo Spanish working hours compliance, and intelligent August intensive schedule detection.
echo.
echo **Category**: Productivity
echo.
echo **Tags**: productivity, time tracking, work hours, spanish, cuco360, presence tracker
echo.
echo **Permissions Explanation**:
echo - `storage`: Store user credentials and settings securely
echo - `activeTab`: Extract credentials from cuco360 login pages
echo - `alarms`: Enable background time tracking updates
echo - `notifications`: Show work completion desktop alerts
echo - `webRequest`: Monitor cuco360 API calls for data extraction
echo - `host permissions`: Access cuco360.cucorent.com for work data
echo.
echo ## Review Process Notes
echo.
echo - **Source Code Review**: Firefox reviews all source code
echo - **Security**: All credentials stored locally, no external servers
echo - **Privacy**: No user data transmitted outside of cuco360 domain
echo - **Testing**: Provide test credentials if possible
echo.
echo ## Pre-submission Checklist
echo.
echo - [ ] Test XPI installation on fresh Firefox profile
echo - [ ] Verify all features work correctly
echo - [ ] Check permissions are minimal and justified
echo - [ ] Ensure code is clean and well-commented
echo - [ ] Test error handling scenarios
echo - [ ] Validate presence time calculations
echo - [ ] Check notifications work properly
) > "%DELIVERY_DIR%\ADDON_STORE_GUIDE.md"

REM Create XPI creation script
(
echo @echo off
echo REM Manual XPI Creation Script
echo echo Creating XPI file for Firefox...
echo cd extension
echo powershell Compress-Archive -Path * -DestinationPath "../%PACKAGE_NAME%-%VERSION_DATE%.zip"
echo cd ..
echo ren "%PACKAGE_NAME%-%VERSION_DATE%.zip" "%PACKAGE_NAME%-%VERSION_DATE%.xpi"
echo echo XPI file created: %PACKAGE_NAME%-%VERSION_DATE%.xpi
echo pause
) > "%DELIVERY_DIR%\create-xpi.bat"

REM Create package info
(
echo Package: %PACKAGE_NAME%
echo Version: %VERSION_DATE%
echo Platform: Firefox Extension
echo Manifest: V2
echo Created: %date% %time%
echo.
echo Contents:
echo - extension/               ^(All extension files^)
echo - %PACKAGE_NAME%-%VERSION_DATE%.xpi  ^(Firefox installation file^)
echo - INSTALLATION_GUIDE.md    ^(User installation instructions^)
echo - ADDON_STORE_GUIDE.md     ^(Developer submission guide^)
echo - create-xpi.bat           ^(Manual XPI creation^)
echo - PACKAGE_INFO.txt         ^(This file^)
echo.
echo Installation:
echo 1. Use XPI file for direct installation
echo 2. Use extension folder for development testing
echo 3. Follow INSTALLATION_GUIDE.md for user instructions
) > "%DELIVERY_DIR%\PACKAGE_INFO.txt"

echo [SUCCESS] Firefox Extension package created successfully!
echo.
echo 📦 Package location: %DELIVERY_DIR%\
if %CREATE_XPI%==1 (
    echo 📄 XPI file: %DELIVERY_DIR%\%PACKAGE_NAME%-%VERSION_DATE%.xpi
) else (
    echo 📄 XPI creation: Use %DELIVERY_DIR%\create-xpi.bat
)
echo 📋 Installation guide: %DELIVERY_DIR%\INSTALLATION_GUIDE.md
echo 🦊 Add-ons guide: %DELIVERY_DIR%\ADDON_STORE_GUIDE.md
echo.
echo 💡 Next steps:
echo   1. Test XPI installation in Firefox
echo   2. Review installation guide
echo   3. Create screenshots for Add-ons store
echo   4. Submit to Firefox Add-ons if desired
echo.
pause
