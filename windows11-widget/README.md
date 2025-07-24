# CucoExt Windows 11 Widget

A comprehensive Windows 11 widget system for tracking work hours from the Spanish time tracking webpage "cuco360.cucorent.com".

## Quick Start

### Option 1: Interactive Setup (Recommended)
```cmd
init-dani.azemar+cucoextbat
```

### Option 2: Direct Widget Launch
```cmd
start-widget.bat
```

### Option 3: PowerShell (Advanced)
```powershell
.\Start-dani.azemar+cucoextps1 -Mode widget
```

## Available Components

### 1. Taskbar Widget (Electron)
- **File**: `taskbar-main.js`
- **Start**: `start-widget.bat` or `npm start`
- **Features**:
  - System tray integration
  - Real-time status updates (every 30 seconds)
  - Colored semaphore indicators
  - Context menu with options
  - Auto-positioning near tray

### 2. HTTP Server
- **File**: `server.js`
- **Start**: `start-server.bat` or `npm run server`
- **URL**: `http://localhost:3001`
- **Features**:
  - RESTful API for work status
  - Web-based widget interface
  - JSON data endpoints
  - CORS enabled for browser access

### 3. Widget Status Colors
- 🔵 **Blue**: Working time remaining
- 🟢 **Green**: You can leave now!
- � **Red**: Error or overtime
- ⚪ **White**: Loading/No data
- 📊 **Progress Bar** - Visual daily progress indicator
- 🔄 **Auto-refresh** - Updates every 30 seconds
- 🎨 **Fluent Design** - Windows 11 native styling

## Widget Sizes

The widget supports multiple sizes in Windows 11:
- **Small**: Semaphore + working time only
- **Medium**: Full status with progress bar
- **Large**: Detailed view with all information

## Integration with Core Scripts

To connect with your existing core scripts, you have two options:

### Option A: HTTP Endpoint (Recommended)

Create a simple HTTP server that serves your core data:

```javascript
// In core/ directory, create server.js
const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/status') {
        exec('node tests/working-summary.js', (error, stdout) => {
            if (error) {
                res.end(JSON.stringify({ error: error.message }));
                return;
            }
            
            // Parse your script output and return JSON
            res.end(JSON.stringify({
                status: stdout.trim(),
                timestamp: new Date().toISOString()
            }));
        });
    }
});

server.listen(3001, () => {
    console.log('CucoExt API server running on http://localhost:3001');
});
```

Then update the widget to fetch from `http://localhost:3001/status`.

### Option B: File Watching

The widget can watch for file changes in your core output:

```javascript
// Widget monitors core/output/status.json for changes
const statusFile = 'C:/Workspace/cucoext/core/output/status.json';
```

## Troubleshooting

### Widget Not Appearing in Widgets Panel

1. **Check PWA installation**:
   - Open Edge → Apps → Manage apps
   - Verify "CucoExt Work Tracker" is listed

2. **Verify manifest.json**:
   - Must be served over HTTP/HTTPS (not file://)
   - Check browser console for manifest errors

3. **Windows 11 Requirements**:
   - Ensure Windows 11 22H2 or later
   - Widgets feature must be enabled in Windows

### Widget Shows "Error" Status

1. **Check core scripts**:
   ```powershell
   cd ../core
   node tests/simple-minutes-test.js
   node tests/working-summary.js
   ```

2. **Verify network access**:
   - Widget must be able to reach core HTTP endpoint
   - Check Windows Firewall settings

### Widget Not Updating

1. **Check service worker**:
   - Open Edge DevTools → Application → Service Workers
   - Clear cache and reload

2. **Verify auto-refresh**:
   - Widget updates every 30 seconds automatically
   - Manual refresh with 🔄 button

## Development

### File Structure
```
windows11-widget/
├── manifest.json          # PWA manifest with widget definition
├── widget.html           # Main widget interface
├── widget-data.json      # Current widget data
├── sw.js                 # Service worker for PWA
├── icons/               # PWA icons for different sizes
└── README.md           # This file
```

### Testing
1. Serve locally: `python -m http.server 8080`
2. Open in Edge: `http://localhost:8080/widget.html`
3. Test widget functionality before installing

### Customization
- **Colors**: Edit CSS gradient in `widget.html`
- **Update interval**: Modify `30000` milliseconds in JavaScript
- **Size**: Adjust container dimensions for different widget sizes
- **Data source**: Update `getWorkStatus()` function to connect to your core

## Windows 11 Widget API

This widget uses:
- **PWA Manifest** with `widgets` specification
- **Adaptive Cards** for native Windows integration  
- **WebView2** for rendering in widgets panel
- **Service Worker** for offline functionality

The widget will appear alongside Microsoft's weather, news, and other native widgets!
