#!/usr/bin/env pwsh
# CucoExt PowerShell Launcher
# Cross-platform launcher for CucoExt widget system

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('widget', 'server', 'both', 'install', 'stop', 'status')]
    [string]$Mode = 'widget',
    
    [Parameter(Mandatory=$false)]
    [switch]$Silent
)

# Set location to script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

if (-not $Silent) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "     CucoExt PowerShell Launcher" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

# Check Node.js installation
try {
    $NodeVersion = node --version 2>$null
    if (-not $Silent) {
        Write-Host "[SUCCESS] Node.js detected: $NodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "[INFO] Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check dependencies
if (-not (Test-Path "node_modules")) {
    if (-not $Silent) {
        Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    }
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    if (-not $Silent) {
        Write-Host "[SUCCESS] Dependencies installed" -ForegroundColor Green
    }
}

switch ($Mode) {
    'widget' {
        if (-not $Silent) {
            Write-Host "[INFO] Starting Taskbar Widget..." -ForegroundColor Yellow
            Write-Host "[INFO] Widget will appear in system tray" -ForegroundColor Cyan
        }
        
        Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized
        
        if (-not $Silent) {
            Write-Host "[SUCCESS] Widget started successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Instructions:" -ForegroundColor Cyan
            Write-Host "- Look for the colored circle icon in your system tray"
            Write-Host "- Left-click to show/hide status window"
            Write-Host "- Right-click for context menu"
            Write-Host ""
        }
    }
    
    'server' {
        if (-not $Silent) {
            Write-Host "[INFO] Starting HTTP Server..." -ForegroundColor Yellow
            Write-Host "[INFO] Server will be available at http://localhost:3001" -ForegroundColor Cyan
            Write-Host "[INFO] Press Ctrl+C to stop the server" -ForegroundColor Yellow
        }
        
        npm run server
    }
    
    'both' {
        if (-not $Silent) {
            Write-Host "[INFO] Starting Complete System..." -ForegroundColor Yellow
        }
        
        # Start server in background
        Start-Process -FilePath "npm" -ArgumentList "run", "server" -WindowStyle Minimized
        Start-Sleep -Seconds 2
        
        # Start widget
        Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized
        
        if (-not $Silent) {
            Write-Host "[SUCCESS] Both components started!" -ForegroundColor Green
        }
    }
    
    'install' {
        if (-not $Silent) {
            Write-Host "[INFO] Installing Widget Permanently..." -ForegroundColor Yellow
        }
        
        # Create desktop shortcut
        $WshShell = New-Object -comObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\CucoExt Widget.lnk")
        $Shortcut.TargetPath = "$ScriptDir\init-dani.azemar+cucoextbat"
        $Shortcut.WorkingDirectory = $ScriptDir
        $Shortcut.Description = "CucoExt Work Time Tracker Widget"
        $Shortcut.Save()
        
        if (-not $Silent) {
            Write-Host "[SUCCESS] Desktop shortcut created" -ForegroundColor Green
            Write-Host "[INFO] You can also pin the widget to taskbar for easy access" -ForegroundColor Cyan
        }
    }
    
    'stop' {
        if (-not $Silent) {
            Write-Host "[INFO] Stopping CucoExt processes..." -ForegroundColor Yellow
        }
        
        # Stop Electron processes
        Get-Process -Name "electron" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        # Stop Node processes on port 3001
        $ServerProcesses = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
        foreach ($proc in $ServerProcesses) {
            Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        
        if (-not $Silent) {
            Write-Host "[SUCCESS] All processes stopped" -ForegroundColor Green
        }
    }
    
    'status' {
        Write-Host "CucoExt Widget Status:" -ForegroundColor Cyan
        
        # Check if Electron is running
        $ElectronProcs = Get-Process -Name "electron" -ErrorAction SilentlyContinue
        if ($ElectronProcs) {
            Write-Host "✅ Taskbar Widget: Running" -ForegroundColor Green
        } else {
            Write-Host "❌ Taskbar Widget: Not running" -ForegroundColor Red
        }
        
        # Check if server is running
        $ServerProcs = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
        if ($ServerProcs) {
            Write-Host "✅ HTTP Server: Running on port 3001" -ForegroundColor Green
        } else {
            Write-Host "❌ HTTP Server: Not running" -ForegroundColor Red
        }
    }
}

if (-not $Silent) {
    Write-Host ""
    Write-Host "[INFO] CucoExt operation complete!" -ForegroundColor Cyan
}
