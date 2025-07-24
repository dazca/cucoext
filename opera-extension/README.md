# CucoExt - Opera Extension

## Overview
Smart Opera extension for tracking work time on cuco360.cucorent.com with automated credential management and Spanish working hours support.

## 🔵🟡🟢⚪🔴 Semaphore System
- **🔵 Blue**: Currently working - shows remaining time on badge
- **🟡 Yellow**: Out of office - shows "OUT" on badge  
- **🟢 Green**: Can leave now - shows "✓" on badge
- **⚪ White (Blinking)**: Exactly time to leave - shows "!!!" on badge with blinking animation
- **🔴 Red**: Problems/credentials expired - shows "!" or "EXP" on badge

## Features

### Core vs Chrome Extension
- **Core Modules**: The `/core` directory contains Node.js modules for server-side automation and testing
- **Chrome Extension**: This directory contains browser-compatible code that replicates core functionality for client-side use in Opera browser
- **No Direct Import**: Opera extensions can't directly import Node.js modules, so core functionality is reimplemented here

### Independent Functionality
- ✅ **Background monitoring** every minute
- ✅ **Real-time badge updates** with color coding
- ✅ **Credential management** via popup interface
- ✅ **Working hours configuration** (3 Spanish schedules)
- ✅ **Work completion notifications** with desktop alerts
- ✅ **Automatic August intensive** schedule detection

## Installation

1. Open Opera and go to `opera://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this `opera-extension` folder
4. The extension icon will appear in your toolbar

## Configuration

### 1. Credentials Setup
- Click the extension icon → **Credentials** tab
- Enter your CSRF token and cookies from the browser
- Client code is auto-detected from the page or can be manually configured

### 2. Working Hours
- **Credentials** tab → **Config** tab
- Choose your schedule:
  - **Common**: 8.5h Mon-Thu + 6h Fri
  - **Standard**: 8h daily
  - **Intensive**: 6.5h daily (August)
- Enable auto-detection for August intensive schedule

### 3. Notifications & Settings
- **Desktop Notifications**: Enable/disable work completion notifications  
- **Debug Logging**: Enable/disable detailed console logging for troubleshooting
- **Auto-refresh Interval**: Configure how often status updates (default: 1 minute)
- **Badge Display**: Customize what appears on the extension icon

## Usage

1. **Real-time Monitoring**: Background service checks status every minute automatically
2. **Badge Notifications**: Extension icon shows current status and remaining time
3. **Popup Interface**: Click icon for detailed status, configuration, and manual controls
4. **Desktop Alerts**: Automatic notifications when work requirements are met
5. **Manual Refresh**: Force update status via popup interface when needed

## Browser Compatibility

### Opera Support
- **Minimum Version**: Opera 76+ (Chromium-based)
- **Manifest**: V3 (same as Chrome)
- **APIs Used**: `chrome.storage`, `chrome.notifications`, `chrome.alarms`, `chrome.action`
- **Permissions**: Access to cuco360.cucorent.com domain
- **Background**: Service Worker (same as Chrome)

## Differences from Core

| Feature | Core (Node.js) | Opera Extension |
|---------|----------------|------------------|
| Environment | Server/CLI | Browser |
| Dependencies | Node modules | Self-contained |
| Automation | Full browser automation | API-only |
| Credentials | File-based storage | Opera storage |
| Updates | Manual execution | Automatic background |
| Notifications | Console/file | Desktop notifications |

## Technical Notes

- **Browser Storage**: Uses Opera's local storage (Chrome API compatible) for credentials and settings
- **Background Service**: Service worker provides continuous monitoring
- **No External Dependencies**: All functionality self-contained in browser
- **API Communication**: Direct fetch calls to cuco360 API
- **Spanish Working Hours**: Built-in support for Spanish labor regulations

## Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled in `opera://extensions/`
- Check for error messages in the extensions page
- Verify manifest.json syntax and required permissions

### Credentials Issues
- Badge shows "EXP" with red background when credentials expire
- Go to Auto-Extract Credentials tab to refresh tokens
- Ensure you're logged into cuco360.cucorent.com in the same browser
- Clear browser cache if extraction fails repeatedly

### No Data or Incorrect Status
- Check you're logged into cuco360.cucorent.com in Opera
- Verify credentials are correctly extracted (not expired)
- Enable debug logs in Config tab to see detailed errors
- Refresh status manually via popup interface
- Check network connectivity to cuco360 servers

### Notifications Not Working
- Check Opera notification permissions in browser settings
- Ensure "Desktop Notifications" is enabled in extension Config
- Notifications only appear once per completion state change
- Test notifications with manual trigger in popup

## Development

### File Structure
```
opera-extension/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for monitoring
├── popup.html/js/css      # User interface and styling
├── core-integration.js    # Main logic (adapted from core)
├── auto-extract.js        # Credential extraction functionality
├── icons/                 # Extension icons for different sizes
└── README.md             # This file
```

The extension replicates core functionality for browser use:
- `core-integration.js`: Main logic (similar to core/work-time-tracker.js)
- `background.js`: Service worker for monitoring
- `popup.html/js`: User interface
- `manifest.json`: Extension configuration

For advanced automation and testing, use the `/core` Node.js modules instead.

## Opera-Specific Notes

- **Browser Compatibility**: Opera 88+ (Chromium-based)
- **API Namespace**: Uses `chrome.*` APIs (Opera supports Chrome extension APIs)
- **Manifest Version**: V3 (same as Chrome)
- **Installation**: Load unpacked via `opera://extensions/`
- **Store Submission**: Package as .zip for Opera Add-ons store
- **Full Compatibility**: Identical functionality to Chrome version
