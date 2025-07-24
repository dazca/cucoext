# CucoExt Unified Build System
# Main build script for all modules in the project
# This is the unified build system - use this instead of individual build scripts

param(
    [string]$Module = "all",
    [switch]$Clean = $false,
    [switch]$Verbose = $false
)

# Project configuration
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BuildDir = Join-Path $ProjectRoot "build"
$PackagesDir = Join-Path $ProjectRoot "packages"

# Module definitions
$Modules = @{
    "chrome-extension" = @{
        Name = "CucoExt Chrome Extension"
        Path = "chrome-extension"
        Type = "WebExtension"
        OutputName = "cucoext-chrome-v{version}.zip"
        Dependencies = @("core")
    }
    "firefox-extension" = @{
        Name = "CucoExt Firefox Extension" 
        Path = "firefox-extension"
        Type = "WebExtension"
        OutputName = "cucoext-firefox-v{version}.zip"
        Dependencies = @("core")
    }
    "opera-extension" = @{
        Name = "CucoExt Opera Extension"
        Path = "opera-extension" 
        Type = "WebExtension"
        OutputName = "cucoext-opera-v{version}.zip"
        Dependencies = @("core")
    }
    "taskbar-widget" = @{
        Name = "CucoExt Taskbar Widget"
        Path = "taskbar-widget"
        Type = "ElectronApp"
        OutputName = "cucoext-widget-v{version}.zip"
        Dependencies = @("core")
    }
    "core" = @{
        Name = "CucoExt Core Scripts"
        Path = "core"
        Type = "NodeModule"
        OutputName = "cucoext-core-v{version}.zip"
        Dependencies = @()
    }
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch($Level) {
        "ERROR" { "Red" }
        "WARN"  { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Get-Version {
    param([string]$ModulePath)
    
    $packageJsonPath = Join-Path $ModulePath "package.json"
    $manifestPath = Join-Path $ModulePath "manifest.json"
    
    if (Test-Path $packageJsonPath) {
        $package = Get-Content $packageJsonPath | ConvertFrom-Json
        return $package.version
    }
    elseif (Test-Path $manifestPath) {
        $manifest = Get-Content $manifestPath | ConvertFrom-Json
        return $manifest.version
    }
    else {
        return "1.0.0"
    }
}

function Build-WebExtension {
    param([hashtable]$ModuleConfig, [string]$Version)
    
    $modulePath = Join-Path $ProjectRoot $ModuleConfig.Path
    $outputName = $ModuleConfig.OutputName -replace "{version}", $Version
    $outputPath = Join-Path $PackagesDir $outputName
    
    Write-Log "Building Web Extension: $($ModuleConfig.Name)" "INFO"
    
    # Files to include in web extension
    $includeFiles = @(
        "manifest.json",
        "background.js", 
        "content.js",
        "popup.html",
        "popup.js", 
        "popup.css",
        "icons/*",
        "lib/*",
        "*.md"
    )
    
    # Create temporary build directory
    $tempDir = Join-Path $BuildDir "temp_$($ModuleConfig.Path)"
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    New-Item $tempDir -ItemType Directory -Force | Out-Null
    
    # Copy files
    foreach ($pattern in $includeFiles) {
        $sourcePath = Join-Path $modulePath $pattern
        $files = Get-ChildItem $sourcePath -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($modulePath.Length + 1)
            $destPath = Join-Path $tempDir $relativePath
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) { New-Item $destDir -ItemType Directory -Force | Out-Null }
            Copy-Item $file.FullName $destPath -Force
        }
    }
    
    # Create zip package
    Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -Force
    Remove-Item $tempDir -Recurse -Force
    
    Write-Log "Created package: $outputName" "SUCCESS"
    return $outputPath
}

function Build-ElectronApp {
    param([hashtable]$ModuleConfig, [string]$Version)
    
    $modulePath = Join-Path $ProjectRoot $ModuleConfig.Path
    $outputName = $ModuleConfig.OutputName -replace "{version}", $Version
    $outputPath = Join-Path $PackagesDir $outputName
    
    Write-Log "Building Electron App: $($ModuleConfig.Name)" "INFO"
    
    # Install dependencies if needed
    Push-Location $modulePath
    try {
        if (Test-Path "package.json") {
            Write-Log "Installing NPM dependencies..." "INFO"
            & npm install --production 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Log "NPM install failed, continuing without dependencies..." "WARN"
            }
        }
        
        # Files to exclude from packaging
        $excludePatterns = @(
            "node_modules\.bin\*",
            "*.log",
            "dist\*",
            ".git\*"
        )
        
        # Create package excluding development files
        $tempDir = Join-Path $BuildDir "temp_$($ModuleConfig.Path)"
        if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
        New-Item $tempDir -ItemType Directory -Force | Out-Null
        
        # Copy all files except excluded patterns
        robocopy $modulePath $tempDir /E /XD node_modules\.bin dist .git /XF *.log | Out-Null
        
        # Create zip package
        Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -Force
        Remove-Item $tempDir -Recurse -Force
        
        Write-Log "Created package: $outputName" "SUCCESS"
    }
    finally {
        Pop-Location
    }
    
    return $outputPath
}

function Build-NodeModule {
    param([hashtable]$ModuleConfig, [string]$Version)
    
    $modulePath = Join-Path $ProjectRoot $ModuleConfig.Path
    $outputName = $ModuleConfig.OutputName -replace "{version}", $Version
    $outputPath = Join-Path $PackagesDir $outputName
    
    Write-Log "Building Node Module: $($ModuleConfig.Name)" "INFO"
    
    # Create zip package of the entire module
    Compress-Archive -Path "$modulePath\*" -DestinationPath $outputPath -Force
    
    Write-Log "Created package: $outputName" "SUCCESS"
    return $outputPath
}

function Build-Module {
    param([string]$ModuleName)
    
    if (-not $Modules.ContainsKey($ModuleName)) {
        Write-Log "Module '$ModuleName' not found!" "ERROR"
        return $false
    }
    
    $moduleConfig = $Modules[$ModuleName]
    $modulePath = Join-Path $ProjectRoot $moduleConfig.Path
    
    if (-not (Test-Path $modulePath)) {
        Write-Log "Module path not found: $modulePath" "ERROR"
        return $false
    }
    
    $version = Get-Version $modulePath
    Write-Log "Building $($moduleConfig.Name) v$version" "INFO"
    
    # Build dependencies first
    foreach ($dep in $moduleConfig.Dependencies) {
        Write-Log "Building dependency: $dep" "INFO"
        Build-Module $dep
    }
    
    # Build the module based on type
    switch ($moduleConfig.Type) {
        "WebExtension" { Build-WebExtension $moduleConfig $version }
        "ElectronApp" { Build-ElectronApp $moduleConfig $version }
        "NodeModule" { Build-NodeModule $moduleConfig $version }
        default { 
            Write-Log "Unknown module type: $($moduleConfig.Type)" "ERROR"
            return $false
        }
    }
    
    return $true
}

function Show-Usage {
    Write-Host ""
    Write-Host "CucoExt Build System" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\Build-All.ps1 [-Module <module>] [-Clean] [-Verbose]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Green
    Write-Host "  -Module     Module to build (default: all)" -ForegroundColor White
    Write-Host "              Options: all, chrome-extension, firefox-extension, opera-extension, taskbar-widget, core"
    Write-Host "  -Clean      Clean build directories before building" -ForegroundColor White
    Write-Host "  -Verbose    Enable verbose output" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\Build-All.ps1                           # Build all modules" -ForegroundColor Gray
    Write-Host "  .\Build-All.ps1 -Module chrome-extension  # Build only Chrome extension" -ForegroundColor Gray
    Write-Host "  .\Build-All.ps1 -Clean                    # Clean and build all" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
try {
    Write-Log "Starting CucoExt Build System" "INFO"
    
    # Create build directories
    @($BuildDir, $PackagesDir) | ForEach-Object {
        if (-not (Test-Path $_)) {
            New-Item $_ -ItemType Directory -Force | Out-Null
            Write-Log "Created directory: $_" "INFO"
        }
    }
    
    # Clean if requested
    if ($Clean) {
        Write-Log "Cleaning build directories..." "INFO"
        Remove-Item "$BuildDir\*" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item "$PackagesDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Build modules
    if ($Module -eq "all") {
        Write-Log "Building all modules..." "INFO"
        $success = $true
        foreach ($moduleName in $Modules.Keys) {
            if (-not (Build-Module $moduleName)) {
                $success = $false
            }
        }
        if ($success) {
            Write-Log "All modules built successfully!" "SUCCESS"
        } else {
            Write-Log "Some modules failed to build." "WARN"
        }
    }
    else {
        Build-Module $Module
    }
    
    # Show summary
    Write-Log "Build completed. Packages created in: $PackagesDir" "SUCCESS"
    if (Test-Path $PackagesDir) {
        Write-Log "Available packages:" "INFO"
        Get-ChildItem $PackagesDir -Filter "*.zip" | ForEach-Object {
            $size = [math]::Round($_.Length / 1MB, 2)
            Write-Log "  - $($_.Name) ($size MB)" "INFO"
        }
    }
}
catch {
    Write-Log "Build failed: $($_.Exception.Message)" "ERROR"
    exit 1
}
