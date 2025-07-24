@echo off
REM Opera Extension Delivery Package Creator
REM Creates CRX file and distribution package for Opera Add-ons

echo ========================================
echo     Opera Extension Package Creator
echo ========================================
echo.

cd /d "%~dp0"

set PACKAGE_NAME=cucoext-opera-extension
set VERSION_DATE=%date:~10,4%-%date:~4,2%-%date:~7,2%
set DELIVERY_DIR=delivery_package

echo [INFO] Creating Opera Extension delivery package...
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

REM Update manifest version
echo [INFO] Updating manifest version...
powershell -Command "(Get-Content '%DELIVERY_DIR%\extension\manifest.json') -replace '\"version\": \"[^\"]*\"', '\"version\": \"%VERSION_DATE%\"' | Set-Content '%DELIVERY_DIR%\extension\manifest.json'"

echo [INFO] Creating installation documentation...

REM Create installation guide
(
echo # CucoExt Opera Extension - Installation Guide
echo.
echo ## Installation Methods
echo.
echo ### Method 1: Opera Add-ons Store ^(Recommended^)
echo 1. Open Opera browser
echo 2. Go to Opera Add-ons store
echo 3. Search for "CucoExt Work Time Tracker"
echo 4. Click "Add to Opera"
echo 5. Click "Install" to confirm
echo.
echo ### Method 2: Developer Mode Installation
echo 1. Open Opera and go to `opera://extensions/`
echo 2. Enable "Developer mode" in the top-right corner
echo 3. Click "Load unpacked" button
echo 4. Select the `extension` folder from this package
echo 5. Extension loads immediately
echo.
echo ### Method 3: CRX File Installation ^(Advanced^)
echo 1. Create CRX file using `create-crx.bat` script
echo 2. Open Opera and go to `opera://extensions/`
echo 3. Enable "Developer mode"
echo 4. Drag and drop the CRX file onto the extensions page
echo 5. Click "Add Extension" when prompted
echo.
echo ## CRX File Creation
echo.
echo Opera requires CRX files to be properly signed. For development:
echo 1. Use the `create-crx.bat` script provided
echo 2. This creates an unsigned CRX for testing
echo 3. Production CRX files need proper Opera signing
echo.
echo ## First-Time Setup
echo.
echo 1. **Click the CucoExt icon** in Opera toolbar
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
echo ## Opera-Specific Features
echo.
echo - 🎭 **Manifest V3 compatibility** for Opera
echo - 🎭 **Service worker background** processing
echo - 🎭 **chrome.* API** namespace support
echo - 🎭 **Opera 76+** compatibility
echo - 🎭 **Built-in workspaces** integration
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
echo - Check Opera version ^(requires 76+^)
echo - Verify Developer mode is enabled
echo - Check `opera://extensions/` for error messages
echo.
echo **Credentials expired:**
echo - Badge shows "EXP" with red background
echo - Re-extract credentials via "Credentials" tab
echo - Ensure logged into cuco360.cucorent.com
echo.
echo **No data showing:**
echo - Verify login to cuco360.cucorent.com
echo - Enable debug logs in Config tab
echo - Check Opera developer tools console
echo.
echo **CRX installation failed:**
echo - Use Developer mode installation instead
echo - Check if CRX is properly formatted
echo - Try creating new CRX with provided script
echo.
echo ## Support
echo.
echo **Version**: %VERSION_DATE%
echo **Platform**: Opera Extension ^(Manifest V3^)
echo **Compatibility**: Opera 76+
echo **APIs**: Chrome Extensions API with Opera enhancements
) > "%DELIVERY_DIR%\INSTALLATION_GUIDE.md"

REM Create Opera Add-ons submission guide
(
echo # Opera Add-ons Submission Guide
echo.
echo ## Files for Add-ons Store Upload
echo.
echo 1. **Extension Package**: ZIP file containing the entire `extension` folder
echo 2. **Source Code**: Same ZIP file ^(Opera reviews source^)
echo 3. **Screenshots**: High-quality screenshots of the extension
echo 4. **Icon**: 128x128 high-quality icon file
echo.
echo ## Add-ons Store Listing Information
echo.
echo **Name**: CucoExt - Smart Work Time Tracker for Opera
echo.
echo **Summary**:
echo Spanish work time tracker for cuco360.cucorent.com with automated credentials, real-time monitoring, and presence time calculation optimized for Opera.
echo.
echo **Description**: ^(Detailed^)
echo CucoExt brings professional work time tracking to Opera users working with cuco360.cucorent.com. 
echo Features automated credential management, real-time work monitoring, Spanish working hours compliance, 
echo and intelligent August intensive schedule detection. Perfect for Opera's productivity-focused workflow.
echo.
echo **Category**: Productivity
echo **Subcategory**: Time Management
echo.
echo **Tags**: productivity, time tracking, work hours, spanish, cuco360, presence tracker, opera
echo.
echo **Permissions Explanation**:
echo - `storage`: Store user credentials and settings securely in Opera
echo - `activeTab`: Extract credentials from cuco360 login pages
echo - `alarms`: Enable background time tracking with Opera's power efficiency
echo - `notifications`: Show work completion desktop alerts in Opera
echo - `webRequest`: Monitor cuco360 API calls for data extraction
echo - `host permissions`: Access cuco360.cucorent.com for work data
echo.
echo ## Opera-Specific Considerations
echo.
echo - **Performance**: Optimized for Opera's battery saving features
echo - **Security**: Leverages Opera's enhanced security model
echo - **Workspaces**: Compatible with Opera's workspace feature
echo - **VPN Integration**: Works with Opera's built-in VPN
echo - **Ad Blocker**: Compatible with Opera's native ad blocker
echo.
echo ## Review Process
echo.
echo - **Automated Testing**: Opera runs automated compatibility tests
echo - **Manual Review**: Team reviews code and functionality
echo - **Security Scan**: Enhanced security analysis for Opera users
echo - **Performance Check**: Verification of Opera-specific optimizations
echo.
echo ## Pre-submission Checklist
echo.
echo - [ ] Test installation on fresh Opera profile
echo - [ ] Verify compatibility with Opera Workspaces
echo - [ ] Test with Opera VPN enabled/disabled
echo - [ ] Check performance with Opera's battery saver
echo - [ ] Validate presence time calculations
echo - [ ] Test notification integration with Opera
echo - [ ] Verify badge updates work correctly
echo - [ ] Check error handling scenarios
echo - [ ] Test with Opera's ad blocker active
echo.
echo ## Submission Steps
echo.
echo 1. **Create Account**: Register at Opera Developer Console
echo 2. **Prepare Package**: ZIP the extension folder
echo 3. **Upload Extension**: Submit ZIP file
echo 4. **Add Metadata**: Fill in title, description, screenshots
echo 5. **Set Pricing**: Free extension
echo 6. **Submit Review**: Submit for Opera team review
echo 7. **Monitor Status**: Track review progress
echo.
echo ## Post-Approval Steps
echo.
echo 1. **Monitor Reviews**: Respond to user feedback
echo 2. **Update Regularly**: Keep extension current
echo 3. **Track Analytics**: Monitor usage statistics
echo 4. **Maintain Support**: Address user issues promptly
) > "%DELIVERY_DIR%\OPERA_STORE_GUIDE.md"

REM Create CRX creation script
(
echo @echo off
echo REM Opera CRX Creation Script
echo echo [INFO] Creating CRX file for Opera...
echo echo [WARNING] This creates an unsigned CRX for development only
echo echo [WARNING] Production CRX requires proper Opera signing
echo echo.
echo.
echo cd extension
echo.
echo REM Create ZIP package first
echo powershell Compress-Archive -Path * -DestinationPath "../%PACKAGE_NAME%-%VERSION_DATE%.zip" -Force
echo cd ..
echo.
echo REM Convert to CRX ^(basic unsigned version^)
echo copy "%PACKAGE_NAME%-%VERSION_DATE%.zip" "%PACKAGE_NAME%-%VERSION_DATE%.crx"
echo.
echo echo [INFO] CRX file created: %PACKAGE_NAME%-%VERSION_DATE%.crx
echo echo [INFO] ZIP package: %PACKAGE_NAME%-%VERSION_DATE%.zip
echo echo.
echo echo [NOTE] For production, submit ZIP to Opera Add-ons store
echo echo [NOTE] CRX is for development testing only
echo echo.
echo pause
) > "%DELIVERY_DIR%\create-crx.bat"

REM Create package creation script
(
echo @echo off
echo REM Opera Package Creation Script
echo echo Creating distribution package for Opera Add-ons...
echo cd extension
echo powershell Compress-Archive -Path * -DestinationPath "../%PACKAGE_NAME%-%VERSION_DATE%-SUBMISSION.zip" -Force
echo cd ..
echo echo [SUCCESS] Submission package created: %PACKAGE_NAME%-%VERSION_DATE%-SUBMISSION.zip
echo echo [INFO] Use this ZIP file for Opera Add-ons store submission
echo pause
) > "%DELIVERY_DIR%\create-submission-package.bat"

REM Create package info
(
echo Package: %PACKAGE_NAME%
echo Version: %VERSION_DATE%
echo Platform: Opera Extension
echo Manifest: V3
echo Created: %date% %time%
echo.
echo Contents:
echo - extension/                    ^(All extension files^)
echo - INSTALLATION_GUIDE.md         ^(User installation instructions^)
echo - OPERA_STORE_GUIDE.md          ^(Developer submission guide^)
echo - create-crx.bat                ^(CRX development file creation^)
echo - create-submission-package.bat ^(Store submission package^)
echo - PACKAGE_INFO.txt              ^(This file^)
echo.
echo Installation Methods:
echo 1. Developer mode: Load extension folder directly
echo 2. CRX file: Create with create-crx.bat for testing
echo 3. Store package: Create with create-submission-package.bat
echo.
echo Submission:
echo 1. Run create-submission-package.bat
echo 2. Upload ZIP to Opera Add-ons store
echo 3. Follow OPERA_STORE_GUIDE.md instructions
) > "%DELIVERY_DIR%\PACKAGE_INFO.txt"

echo [SUCCESS] Opera Extension package created successfully!
echo.
echo 📦 Package location: %DELIVERY_DIR%\
echo 📋 Installation guide: %DELIVERY_DIR%\INSTALLATION_GUIDE.md
echo 🎭 Opera store guide: %DELIVERY_DIR%\OPERA_STORE_GUIDE.md
echo 📄 CRX creation: %DELIVERY_DIR%\create-crx.bat
echo 📦 Submission package: %DELIVERY_DIR%\create-submission-package.bat
echo.
echo 💡 Next steps:
echo   1. Test extension in Opera developer mode
echo   2. Create submission package with provided script
echo   3. Take screenshots for Opera Add-ons store
echo   4. Submit to Opera Add-ons if desired
echo.
pause
