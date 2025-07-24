# CucoExt Firefox Extension

Smart Work Time Tracker for Spanish time tracking system (cuco360.cucorent.com) - Firefox version with Manifest V2 compatibility.

## 🔵🟡🟢⚪🔴 Semaphore System
- **🔵 Blue**: Currently working - shows remaining time on badge
- **🟡 Yellow**: Out of office - shows "OUT" on badge  
- **🟢 Green**: Can leave now - shows "✓" on badge
- ⚪ **White**: Loading or no data available
- 🔴 **Red**: Problems/credentials expired - shows "!" or "EXP" on badge

## Features

### Core vs Firefox Extension
- **Core Modules**: The `/core` directory contains Node.js modules for server-side automation and testing
- **Firefox Extension**: This directory contains browser-compatible code that replicates core functionality for client-side use
- **No Direct Import**: Firefox extensions can't directly import Node.js modules, so core functionality is reimplemented here

### Independent Functionality
- ✅ **Real-time Work Time Tracking** with Spanish working hours support
- ✅ **Automated Credential Management** - Extract credentials automatically from browser
- ✅ **Background monitoring** every minute with service worker
- ✅ **Real-time badge updates** with color coding and status text
- ✅ **Credential management** via popup interface
- ✅ **Working hours configuration** (3 Spanish schedules)
- ✅ **Work completion notifications** with desktop alerts
- ✅ **Automatic August intensive** schedule detection
- ✅ **Configurable Debug Logging** - Clean console by default, enable for troubleshooting
- ✅ **Real-time Seconds Display** - HH:MM:SS format with 10-second auto-refresh
- ✅ **Immediate Status Updates** - Refresh after credential extraction

## Installation

### For Firefox (Temporary Development)
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the `firefox-extension` folder
5. Select `manifest.json`
6. The extension will be loaded temporarily

### For Firefox (Permanent Installation)
1. Package the extension:
   ```bash
   cd firefox-extension
   zip -r cucoext-firefox.zip *
   ```
2. Submit to Mozilla Add-ons for permanent installation
3. Or install directly via `about:addons` → Install Add-on From File

## Configuration

### 1. Initial Setup
- Click the extension icon → **Auto-Extract Credentials** tab
- Follow the automated login process on cuco360.cucorent.com
- Credentials will be extracted automatically from your browser session

### 2. Working Hours Configuration
- Go to **Config** tab in the extension popup
- Choose your schedule:
  - **Common**: 8.5h Mon-Thu + 6h Fri (Spanish standard)
  - **Standard**: 8h daily Mon-Fri
  - **Intensive**: 6.5h daily (August summer schedule)
- Enable auto-detection for August intensive schedule

### 3. Notifications & Debug
- **Notifications**: Enable/disable work completion desktop notifications
- **Debug Logs**: Enable/disable detailed console logging for troubleshooting
- **Auto-refresh**: Configure update intervals (default: 1 minute)

## Usage

1. **Real-time Monitoring**: Background service checks status every minute
2. **Badge Notifications**: Extension icon shows current status and remaining time
3. **Popup Interface**: Click icon for detailed status, configuration, and manual controls
4. **Desktop Alerts**: Automatic notifications when work requirements are met
5. **Manual Refresh**: Force update status via popup interface

## Browser Compatibility

### Firefox Support
- **Minimum Version**: Firefox 91+ (Manifest V2)
- **APIs Used**: `webRequest`, `storage`, `notifications`, `alarms`, `tabs`
- **Permissions**: Access to cuco360.cucorent.com domain
- **Background**: Uses background pages (not service workers like Chrome)

### Differences from Chrome Version
| Feature | Chrome Extension | Firefox Extension |
|---------|------------------|-------------------|
| Manifest | V3 | V2 |
| Background | Service Worker | Background Page |
| Storage | chrome.storage | browser.storage |
| Notifications | chrome.notifications | browser.notifications |
| Badge | chrome.action | browser.browserAction |

## Troubleshooting

### Extension Not Loading
- Ensure Firefox Developer Edition or regular Firefox with developer mode
- Check `about:debugging` for error messages
- Verify manifest.json syntax

### Credentials Expired
- Badge shows "EXP" with red background
- Go to Auto-Extract Credentials tab and re-extract
- Ensure you're logged into cuco360.cucorent.com

### No Data Showing
- Check you're logged into cuco360.cucorent.com in the same browser
- Verify credentials are correctly extracted
- Enable debug logs in Config tab to see detailed errors
- Refresh status manually via popup

### Notifications Not Working
- Check Firefox notification permissions in browser settings
- Ensure "Enable work completion notifications" is checked in Config
- Notifications only appear once per completion state change

## Development

### File Structure
```
firefox-extension/
├── manifest.json          # Extension configuration (Manifest V2)
├── background.js          # Background page for monitoring
├── popup.html/js/css      # User interface
├── core-integration.js    # Main logic (similar to core/work-time-tracker.js)
├── icons/                 # Extension icons for different sizes
└── README.md             # This file
```

### Key Differences from Core
- **Environment**: Browser context instead of Node.js
- **Dependencies**: Self-contained, no external npm modules
- **Automation**: API-only communication (no browser automation)
- **Credentials**: Browser storage instead of file-based
- **Updates**: Automatic background monitoring vs manual execution
- **Notifications**: Browser notifications instead of console output

### Adding Features
1. Edit `core-integration.js` for tracking functionality
2. Edit `background.js` for monitoring logic
3. Edit `popup.html/js` for user interface
4. Update `manifest.json` for new permissions if needed
5. Test with temporary extension loading in Firefox

## Support

For advanced automation and testing, use the `/core` Node.js modules.
For browser-specific issues, ensure Firefox compatibility and check developer console for errors.

- Firefox 57+ (Quantum)
- Manifest Version 2 (Firefox WebExtensions API)
- Uses `browser.*` API namespace

## Technical Details

This Firefox version uses:
- `browser.storage.local` for data persistence
- `browser.tabs` for tab management
- `browser.runtime` for messaging
- `browser.alarms` for periodic monitoring
- `browser.notifications` for user alerts

## Debug Mode

Toggle debug logging in Config → "Enable debug console logs" to see detailed operation logs in the browser console.
