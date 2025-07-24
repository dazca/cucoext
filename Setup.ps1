# CucoExt Main Setup Script
# Interactive installer for the CucoExt project

param(
    [switch]$Unattended = $false,
    [switch]$DevMode = $false,
    [switch]$Help = $false
)

# Project configuration
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogFile = Join-Path $ProjectRoot "setup.log"

# Available modules
$AvailableModules = @{
    "chrome-extension" = @{
        Name = "Chrome Extension"
        Description = "CucoExt extension for Google Chrome browser"
        Required = $false
        InstallTime = "Quick"
        Size = "~50KB"
    }
    "firefox-extension" = @{
        Name = "Firefox Extension" 
        Description = "CucoExt extension for Mozilla Firefox browser"
        Required = $false
        InstallTime = "Quick"
        Size = "~50KB"
    }
    "opera-extension" = @{
        Name = "Opera Extension"
        Description = "CucoExt extension for Opera browser"
        Required = $false
        InstallTime = "Quick" 
        Size = "~50KB"
    }
    "taskbar-widget" = @{
        Name = "Windows Taskbar Widget"
        Description = "Native Windows taskbar widget with real-time status"
        Required = $false
        InstallTime = "Medium"
        Size = "~5MB"
    }
    "core" = @{
        Name = "Core Scripts"
        Description = "Essential core functionality (required for all modules)"
        Required = $true
        InstallTime = "Quick"
        Size = "~100KB"
    }
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO", [switch]$NoConsole)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Write to log file
    Add-Content -Path $LogFile -Value $logEntry -ErrorAction SilentlyContinue
    
    # Write to console unless suppressed
    if (-not $NoConsole) {
        $color = switch($Level) {
            "ERROR" { "Red" }
            "WARN"  { "Yellow" }
            "SUCCESS" { "Green" }
            "INFO" { "White" }
            "SKIP" { "Cyan" }
            default { "Gray" }
        }
        Write-Host $logEntry -ForegroundColor $color
    }
}

function Show-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                    CucoExt Setup Wizard                   ║" -ForegroundColor Cyan  
    Write-Host "  ║                                                           ║" -ForegroundColor Cyan
    Write-Host "  ║         Time Tracking Extension Suite Installer          ║" -ForegroundColor Cyan
    Write-Host "  ╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Welcome to the CucoExt installation wizard!" -ForegroundColor White
    Write-Host "  This will help you set up the time tracking extensions and widgets." -ForegroundColor Gray
    Write-Host ""
}

function Show-SystemInfo {
    Write-Host "System Information:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host "OS: $([System.Environment]::OSVersion.VersionString)" -ForegroundColor Gray
    Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
    Write-Host "Architecture: $($env:PROCESSOR_ARCHITECTURE)" -ForegroundColor Gray
    
    # Check Node.js
    try {
        $nodeVersion = & node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Node.js: Not installed" -ForegroundColor Red
    }
    
    # Check NPM
    try {
        $npmVersion = & npm --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "NPM: v$npmVersion" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "NPM: Not installed" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Show-ModuleSelection {
    Write-Host "Available Modules:" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    Write-Host ""
    
    $moduleIndex = 1
    $moduleKeys = @()
    
    foreach ($moduleKey in $AvailableModules.Keys) {
        $module = $AvailableModules[$moduleKey]
        $moduleKeys += $moduleKey
        
        $status = if ($module.Required) { "[REQUIRED]" } else { "[OPTIONAL]" }
        $statusColor = if ($module.Required) { "Yellow" } else { "Gray" }
        
        Write-Host "  [$moduleIndex] " -NoNewline -ForegroundColor White
        Write-Host "$($module.Name) " -NoNewline -ForegroundColor Cyan
        Write-Host "$status" -ForegroundColor $statusColor
        Write-Host "      $($module.Description)" -ForegroundColor Gray
        Write-Host "      Size: $($module.Size), Install Time: $($module.InstallTime)" -ForegroundColor DarkGray
        Write-Host ""
        
        $moduleIndex++
    }
    
    return $moduleKeys
}

function Get-UserSelection {
    param([array]$ModuleKeys)
    
    if ($Unattended) {
        Write-Log "Unattended mode: Installing all modules" "INFO"
        return $ModuleKeys
    }
    
    Write-Host "Selection Options:" -ForegroundColor Green
    Write-Host "  [A] Install ALL modules (recommended)" -ForegroundColor White
    Write-Host "  [R] Install only REQUIRED modules (core only)" -ForegroundColor White
    Write-Host "  [C] CUSTOM selection" -ForegroundColor White
    Write-Host "  [Q] Quit installation" -ForegroundColor White
    Write-Host ""
    
    do {
        $choice = Read-Host "Enter your choice [A/R/C/Q]"
        $choice = $choice.ToUpper()
        
        switch ($choice) {
            "A" { 
                Write-Log "User selected: Install all modules" "INFO"
                return $ModuleKeys 
            }
            "R" { 
                Write-Log "User selected: Install required modules only" "INFO"
                return @("core")
            }
            "C" {
                Write-Log "User selected: Custom installation" "INFO"
                return Get-CustomSelection $ModuleKeys
            }
            "Q" {
                Write-Log "User chose to quit installation" "INFO"
                Write-Host "Installation cancelled by user." -ForegroundColor Yellow
                exit 0
            }
            default {
                Write-Host "Invalid choice. Please enter A, R, C, or Q." -ForegroundColor Red
            }
        }
    } while ($true)
}

function Get-CustomSelection {
    param([array]$ModuleKeys)
    
    $selectedModules = @()
    
    Write-Host ""
    Write-Host "Custom Module Selection:" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    Write-Host ""
    
    # Always include core (required)
    $selectedModules += "core"
    Write-Host "✓ Core Scripts (required)" -ForegroundColor Green
    
    # Ask for each optional module
    foreach ($moduleKey in $ModuleKeys) {
        if ($moduleKey -eq "core") { continue }  # Skip core, already added
        
        $module = $AvailableModules[$moduleKey]
        Write-Host ""
        Write-Host "Install $($module.Name)?" -ForegroundColor Yellow
        Write-Host "  $($module.Description)" -ForegroundColor Gray
        
        do {
            $install = Read-Host "Install this module? [Y/N]"
            $install = $install.ToUpper()
            
            if ($install -eq "Y" -or $install -eq "YES") {
                $selectedModules += $moduleKey
                Write-Host "✓ $($module.Name) will be installed" -ForegroundColor Green
                break
            }
            elseif ($install -eq "N" -or $install -eq "NO") {
                Write-Host "✗ $($module.Name) will be skipped" -ForegroundColor Gray
                break
            }
            else {
                Write-Host "Please enter Y or N." -ForegroundColor Red
            }
        } while ($true)
    }
    
    Write-Host ""
    Write-Host "Selected modules for installation:" -ForegroundColor Cyan
    foreach ($moduleKey in $selectedModules) {
        $module = $AvailableModules[$moduleKey]
        Write-Host "  ✓ $($module.Name)" -ForegroundColor Green
    }
    
    Write-Host ""
    $confirm = Read-Host "Proceed with installation? [Y/N]"
    if ($confirm.ToUpper() -eq "Y" -or $confirm.ToUpper() -eq "YES") {
        return $selectedModules
    }
    else {
        Write-Host "Installation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

function Install-SelectedModules {
    param([array]$SelectedModules)
    
    Write-Host ""
    Write-Host "Starting Installation..." -ForegroundColor Cyan
    Write-Host "=======================" -ForegroundColor Cyan
    Write-Host ""
    
    $totalModules = $SelectedModules.Count
    $currentModule = 0
    
    foreach ($moduleKey in $SelectedModules) {
        $currentModule++
        $module = $AvailableModules[$moduleKey]
        
        Write-Host ""
        Write-Host "[$currentModule/$totalModules] Installing: $($module.Name)" -ForegroundColor Yellow
        Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
        
        # Install dependencies
        try {
            $installScript = Join-Path $ProjectRoot "Install-Dependencies.ps1"
            if (Test-Path $installScript) {
                Write-Log "Running dependency installer for $moduleKey" "INFO"
                
                # Prepare parameters for splatting
                $installParams = @{
                    Module = $moduleKey
                }
                if ($DevMode) { 
                    $installParams.DevDependencies = $true 
                }
                
                & $installScript @installParams
                
                if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
                    Write-Log "Dependencies installed successfully for $($module.Name)" "SUCCESS"
                } else {
                    Write-Log "Warning: Dependency installation had issues for $($module.Name)" "WARN"
                }
            } else {
                Write-Log "Dependency installer not found, skipping..." "WARN"
            }
        }
        catch {
            Write-Log "Error installing dependencies for $($module.Name): $($_.Exception.Message)" "ERROR"
        }
        
        # Module-specific post-install steps
        switch ($moduleKey) {
            "chrome-extension" {
                Write-Host "  📝 To install the Chrome extension:" -ForegroundColor Cyan
                Write-Host "     1. Open Chrome and go to chrome://extensions/" -ForegroundColor Gray
                Write-Host "     2. Enable 'Developer mode'" -ForegroundColor Gray
                Write-Host "     3. Click 'Load unpacked' and select: chrome-extension folder" -ForegroundColor Gray
            }
            "firefox-extension" {
                Write-Host "  📝 To install the Firefox extension:" -ForegroundColor Cyan
                Write-Host "     1. Open Firefox and go to about:debugging" -ForegroundColor Gray
                Write-Host "     2. Click 'This Firefox' → 'Load Temporary Add-on'" -ForegroundColor Gray
                Write-Host "     3. Select the manifest.json in: firefox-extension folder" -ForegroundColor Gray
            }
            "opera-extension" {
                Write-Host "  📝 To install the Opera extension:" -ForegroundColor Cyan
                Write-Host "     1. Open Opera and go to opera://extensions/" -ForegroundColor Gray
                Write-Host "     2. Enable 'Developer mode'" -ForegroundColor Gray
                Write-Host "     3. Click 'Load unpacked' and select: opera-extension folder" -ForegroundColor Gray
            }
            "taskbar-widget" {
                Write-Host "  📝 To run the taskbar widget:" -ForegroundColor Cyan
                Write-Host "     • Run: taskbar-widget\CucoExt-Widget.bat" -ForegroundColor Gray
                Write-Host "     • Or use PowerShell: taskbar-widget\cucoext-widget.ps1" -ForegroundColor Gray
            }
        }
    }
}

function Show-CompletionSummary {
    param([array]$SelectedModules)
    
    Write-Host ""
    Write-Host "  ╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║                 Installation Complete! 🎉                ║" -ForegroundColor Green
    Write-Host "  ╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Installed Modules:" -ForegroundColor Cyan
    foreach ($moduleKey in $SelectedModules) {
        $module = $AvailableModules[$moduleKey]
        Write-Host "  ✅ $($module.Name)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "----------" -ForegroundColor Cyan
    Write-Host "1. 📊 Visit https://cuco360.cucorent.com and log in" -ForegroundColor White
    Write-Host "2. 🔧 Install browser extensions (see instructions above)" -ForegroundColor White
    Write-Host "3. 🖥️  Run the taskbar widget for real-time status" -ForegroundColor White
    Write-Host "4. ⚙️  Configure your work schedule if needed" -ForegroundColor White
    Write-Host ""
    Write-Host "Quick Start Commands:" -ForegroundColor Cyan
    Write-Host "  • Build all packages:  .\Build-All.ps1" -ForegroundColor Gray
    Write-Host "  • Run taskbar widget:  .\taskbar-widget\CucoExt-Widget.bat" -ForegroundColor Gray
    Write-Host "  • View logs:           Get-Content setup.log" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Need help? Check the README.md or DEVELOPMENT-SUMMARY.md files." -ForegroundColor Yellow
    Write-Host ""
}

function Show-Usage {
    Write-Host ""
    Write-Host "CucoExt Main Setup Script" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\Setup.ps1 [-Unattended] [-DevMode] [-Help]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Green
    Write-Host "  -Unattended    Run installation without user interaction (installs all modules)" -ForegroundColor White
    Write-Host "  -DevMode       Include development dependencies in installation" -ForegroundColor White
    Write-Host "  -Help          Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\Setup.ps1                    # Interactive installation" -ForegroundColor Gray
    Write-Host "  .\Setup.ps1 -Unattended        # Install all modules automatically" -ForegroundColor Gray
    Write-Host "  .\Setup.ps1 -DevMode           # Include development tools" -ForegroundColor Gray
    Write-Host ""
}

# Main execution
if ($Help) {
    Show-Usage
    exit 0
}

try {
    # Initialize log
    "=== CucoExt Setup Started ===" | Out-File $LogFile -Encoding UTF8
    Write-Log "Setup started with parameters: Unattended=$Unattended, DevMode=$DevMode" "INFO" -NoConsole
    
    # Show banner and system info
    Show-Banner
    Show-SystemInfo
    
    # Show available modules and get user selection
    $moduleKeys = Show-ModuleSelection
    $selectedModules = Get-UserSelection $moduleKeys
    
    # Install selected modules
    Install-SelectedModules $selectedModules
    
    # Show completion summary
    Show-CompletionSummary $selectedModules
    
    Write-Log "Setup completed successfully" "SUCCESS"
    
    if (-not $Unattended) {
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}
catch {
    Write-Log "Setup failed: $($_.Exception.Message)" "ERROR"
    Write-Host ""
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "Check the setup.log file for details." -ForegroundColor Yellow
    Write-Host ""
    
    if (-not $Unattended) {
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    exit 1
}
