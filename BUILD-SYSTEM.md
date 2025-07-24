# CucoExt Build & Installation System

This document describes the PowerShell-based build and installation system for the CucoExt project.

## Overview

The CucoExt project consists of multiple modules:
- **Chrome Extension**: Browser extension for Google Chrome
- **Firefox Extension**: Browser extension for Mozilla Firefox  
- **Opera Extension**: Browser extension for Opera
- **Taskbar Widget**: Windows native taskbar widget
- **Core Scripts**: Essential functionality shared by all modules

## Quick Start

### 1. Initial Setup (Recommended)
```powershell
# Interactive setup wizard
.\Setup.ps1

# Or unattended installation (installs everything)
.\Setup.ps1 -Unattended
```

### 2. Install Dependencies Only
```powershell
# Install dependencies for all modules
.\Install-Dependencies.ps1

# Install dependencies for specific module
.\Install-Dependencies.ps1 -Module taskbar-widget

# Include development dependencies
.\Install-Dependencies.ps1 -DevDependencies
```

### 3. Build Packages
```powershell
# Build all modules
.\Build-All.ps1

# Build specific module
.\Build-All.ps1 -Module chrome-extension

# Clean build (removes previous builds)
.\Build-All.ps1 -Clean
```

## Scripts Description

### Setup.ps1 (Main Installer)
Interactive setup wizard that guides you through the installation process.

**Features:**
- System requirements check
- Module selection (all, required only, or custom)
- Automatic dependency installation
- Post-installation instructions
- Logging to `setup.log`

**Usage:**
```powershell
.\Setup.ps1 [-Unattended] [-DevMode] [-Help]
```

**Parameters:**
- `-Unattended`: Install all modules without user interaction
- `-DevMode`: Include development dependencies
- `-Help`: Show usage information

### Install-Dependencies.ps1
Installs NPM dependencies for project modules.

**Features:**
- Automatic Node.js/NPM detection
- Module-specific dependency management
- Production vs development dependencies
- Force reinstall option
- Detailed module status reporting

**Usage:**
```powershell
.\Install-Dependencies.ps1 [-Module <module>] [-Force] [-DevDependencies] [-Verbose]
```

**Parameters:**
- `-Module`: Specific module to install (default: all)
- `-Force`: Force reinstall of dependencies
- `-DevDependencies`: Include development dependencies
- `-Verbose`: Enable verbose output

### Build-All.ps1
Creates distribution packages for all modules.

**Features:**
- Builds Web Extensions (Chrome, Firefox, Opera)
- Builds Electron applications (Taskbar Widget)
- Handles Node.js modules (Core Scripts)
- Dependency resolution and build order
- Clean build support
- Package size reporting

**Usage:**
```powershell
.\Build-All.ps1 [-Module <module>] [-Clean] [-Verbose]
```

**Parameters:**
- `-Module`: Specific module to build (default: all)
- `-Clean`: Clean build directories before building
- `-Verbose`: Enable verbose output

## Module Types

### Web Extensions
**Modules:** chrome-extension, firefox-extension, opera-extension

**Build Process:**
1. Copy required files (manifest.json, scripts, assets)
2. Create ZIP package for distribution
3. No NPM dependencies required

**Installation:**
- Load unpacked extension in browser developer mode
- Follow browser-specific instructions

### Electron Applications  
**Modules:** taskbar-widget

**Build Process:**
1. Install NPM dependencies
2. Copy application files excluding development files
3. Create ZIP package with all dependencies

**Installation:**
- Extract package
- Run with `npm start` or use provided batch files

### Node.js Modules
**Modules:** core

**Build Process:**
1. Package entire module directory
2. Include all scripts and configuration files

**Installation:**
- Extract to project directory
- Install dependencies with `npm install`

## Directory Structure

```
cucoext/
├── Setup.ps1                 # Main setup wizard
├── Install-Dependencies.ps1  # Dependency installer
├── Build-All.ps1            # Build system
├── setup.log                # Installation log
├── build/                   # Temporary build files
├── packages/                # Built packages output
├── chrome-extension/        # Chrome extension source
├── firefox-extension/       # Firefox extension source
├── opera-extension/         # Opera extension source
├── taskbar-widget/          # Taskbar widget source
└── core/                    # Core functionality
```

## Prerequisites

### Required
- **Windows 10/11**: For taskbar widget support
- **PowerShell 5.0+**: For running scripts
- **Node.js 16+**: For JavaScript modules
- **NPM 8+**: For dependency management

### Optional
- **Git**: For version control
- **Visual Studio Code**: For development

## Common Tasks

### First-Time Setup
```powershell
# 1. Run interactive setup
.\Setup.ps1

# 2. Build packages for distribution
.\Build-All.ps1

# 3. Install browser extensions manually
# (follow instructions shown after setup)
```

### Development Workflow
```powershell
# Install with development dependencies
.\Install-Dependencies.ps1 -DevDependencies

# Clean build after changes
.\Build-All.ps1 -Clean

# Test specific module
.\Install-Dependencies.ps1 -Module taskbar-widget
.\Build-All.ps1 -Module taskbar-widget
```

### Troubleshooting
```powershell
# Check module status
.\Install-Dependencies.ps1 -Module all

# Force reinstall problematic module
.\Install-Dependencies.ps1 -Module taskbar-widget -Force

# View detailed logs
Get-Content setup.log | Select-Object -Last 50
```

## Output

### Successful Installation
- All modules properly configured
- Dependencies installed
- Packages built in `packages/` directory
- Instructions for browser extension installation

### Generated Packages
- `cucoext-chrome-v{version}.zip`
- `cucoext-firefox-v{version}.zip`
- `cucoext-opera-v{version}.zip`
- `cucoext-widget-v{version}.zip`
- `cucoext-core-v{version}.zip`

## Support

For issues with the build system:
1. Check `setup.log` for detailed error messages
2. Ensure all prerequisites are installed
3. Try running individual scripts with `-Verbose` flag
4. Review module-specific documentation in each folder

## Development Notes

### Adding New Modules
1. Add module definition to `$Modules` hashtable in each script
2. Implement module-specific build logic if needed
3. Update module selection in `Setup.ps1`
4. Test with different installation scenarios

### Script Maintenance
- All scripts use consistent logging format
- Error handling includes user-friendly messages
- Each script can run independently
- Parameters are validated before execution
