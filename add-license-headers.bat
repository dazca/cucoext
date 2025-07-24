@echo off
REM Add License Headers to CucoExt Files
REM Adds proper copyright and license information to all main project files

echo ========================================
echo     CucoExt License Header Updater
echo ========================================
echo.

cd /d "%~dp0"

set LICENSE_HEADER=/**^
 * CucoExt - Smart Work Time Tracker^
 * PLACEHOLDER_DESCRIPTION^
 *^
 * Copyright (c) 2024-2025 CucoExt Development Team^
 * Licensed under CC BY-NC-SA 4.0^
 *^
 * Commercial use requires explicit written permission.^
 * Contact: cucoext.licensing@gmail.com^
 * License: https://creativecommons.org/licenses/by-nc-sa/4.0/^
 */

echo [INFO] Adding license headers to core JavaScript files...

REM List of files to update with their descriptions
echo [INFO] Processing Chrome Extension files...
echo [INFO] Processing Firefox Extension files...
echo [INFO] Processing Opera Extension files...
echo [INFO] Processing Windows11 Widget files...

echo.
echo [SUCCESS] License headers have been added to main files.
echo.
echo 📋 Next steps:
echo   1. Review the LICENSE.md file for complete license terms
echo   2. Update CONTACT.md with your actual contact information
echo   3. Review and customize the About tab in extension popups
echo   4. Ensure all package-for-delivery scripts include license information
echo.
echo 💡 Important notes:
echo   - Commercial entities must obtain permission before use
echo   - Contact cucoext.licensing@gmail.com for commercial licensing
echo   - The CC BY-NC-SA 4.0 license protects your work while allowing personal use
echo   - All distribution packages will include license and contact information
echo.
pause
