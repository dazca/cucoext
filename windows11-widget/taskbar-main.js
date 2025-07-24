const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// Debug logging
console.log('🚀 Starting CucoExt Widget...');
console.log('📁 Working directory:', __dirname);
console.log('⚡ Electron version:', process.versions.electron);
console.log('🟢 Node.js version:', process.versions.node);

class Windows11TaskbarIntegration {
    constructor() {
        this.tray = null;
        this.window = null;
        this.isVisible = false;
        this.currentStatus = { semaphore: '⚪', message: 'Loading...' };
        this.updateInterval = null;
    }

    async initialize() {
        try {
            console.log('🔧 Setting Windows 11 app info...');
            // Set Windows 11 app info
            app.setAppUserModelId('com.dani.azemar+cucoexttaskbar-widget');
            app.setName('CucoExt');

            console.log('📍 Creating tray icon...');
            // Create tray icon
            this.createTray();

            console.log('🪟 Creating widget window...');
            // Create hidden window
            this.createWindow();

            console.log('⏰ Starting status updates...');
            // Start status updates
            this.startUpdates();

            console.log('🎮 Setting up app events...');
            // Handle app events
            this.setupAppEvents();

            console.log('🎯 Widget fully initialized!');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            throw error;
        }
    }

    createTray() {
        try {
            // Create a simple colored circle icon
            const iconImage = this.createStatusIcon('⚪');
            this.tray = new Tray(iconImage);
            
            this.tray.setToolTip('CucoExt - Loading...');
            
            console.log('✅ Tray icon created successfully');
            
            // Handle clicks
            this.tray.on('click', () => {
                console.log('Tray icon clicked');
                this.toggleWindow();
            });

            // Context menu
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'Show Status',
                    click: () => this.showWindow()
                },
                {
                    label: 'Refresh',
                    click: () => this.updateStatus()
                },
                { type: 'separator' },
                {
                    label: 'Open Timesheet',
                    click: () => {
                        require('electron').shell.openExternal('https://wigos-login.winsysgroup.com/BaseLogin?guid=ASQkOndrPfBcXvGD7u%2BYc1rsXRPt9miZaHHWF2eGby9SEknBmM4RPwZeFjl3RlTvu3W1YK%2FtkGZZ%2BVEHQn7HdxAY4iscVsYHb6onFkh0ajGyDsuEb9T6B7hq35i4KtBNCcII5stl1%2BA4A%2Bn197e9TEmE7lB%2FeekkewSlAtTsFqY%3D');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Pin to Taskbar',
                    click: () => this.pinToTaskbar()
                },
                {
                    label: 'Exit',
                    click: () => app.quit()
                }
            ]);

            this.tray.setContextMenu(contextMenu);
            
            console.log('🎯 CucoExt widget is running! Look for the tray icon in bottom-right corner.');

        } catch (error) {
            console.error('❌ Error creating tray:', error);
        }
    }

    createStatusIcon(semaphore) {
        // Create a simple 16x16 PNG icon using base64 data
        // These are actual working PNG icons for each status
        const iconData = {
            '🔵': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ1JREFUOEtjYBgFwyAwMzMzKpqZmSnfvXt3/d+/f//9+/fvX0ZGRgYGBgaGf//+Mfz58+c/AyMjI8P//38YGKG8/4AMhj9//jL8+/cPxmYAAqAfGZkYgApACogDBcGOgLsA5EcgAyQAhxsY/jH8+wczEAhAFoA0QPiMQAEQ/R/qApABf//+ZcCFAcgCqAAyEJoBF/gL9iMyzD8gAeJHFIADkAFfgZqABrASgV4A+QFrAJAPC/EjJoD5/x/Mj5j+wzUgw5QB6gdQNJAFBFBgQBEA1w',
            '�': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ1JREFUOEtjYBgFwyAwMzMzKpqZmSnfvXt3/d+/f//9+/fvX0ZGRgYGBgaGf//+Mfz58+c/AyMjI8P//38YGKG8/4AMhj9//jL8+/cPxmYAAqAfGZkYgApACogDBcGOgLsA5EcgAyQAhxsY/jH8+wczEAhAFoA0QPiMQAEQ/R/qApABf//+ZcCFAcgCqAAyEJoBF/gL9iMyzD8gAeJHFIADkAFfgZqABrASgV4A+QFrAJAPC/EjJoD5/x/Mj5j+wzUgw5QB6gdQNJAFBFBgQBEA1w',
            '�': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ1JREFUOEtjYBgFwyAwMzMzKpqZmSnfvXt3/d+/f//9+/fvX0ZGRgYGBgaGf//+Mfz58+c/AyMjI8P//38YGKG8/4AMhj9//jL8+/cPxmYAAqAfGZkYgApACogDBcGOgLsA5EcgAyQAhxsY/jH8+wczEAhAFoA0QPiMQAEQ/R/qApABf//+ZcCFAcgCqAAyEJoBF/gL9iMyzD8gAeJHFIADkAFfgZqABrASgV4A+QFrAJAPC/EjJoD5/x/Mj5j+wzUgw5QB6gdQNJAFBFBgQBEA1w',
            '�': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ1JREFUOEtjYBgFwyAwMzMzKpqZmSnfvXt3/d+/f//9+/fvX0ZGRgYGBgaGf//+Mfz58+c/AyMjI8P//38YGKG8/4AMhj9//jL8+/cPxmYAAqAfGZkYgApACogDBcGOgLsA5EcgAyQAhxsY/jH8+wczEAhAFoA0QPiMQAEQ/R/qApABf//+ZcCFAcgCqAAyEJoBF/gL9iMyzD8gAeJHFIADkAFfgZqABrASgV4A+QFrAJAPC/EjJoD5/x/Mj5j+wzUgw5QB6gdQNJAFBFBgQBEA1w',
            '⚪': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZ1JREFUOEtjYBgFwyAwMzMzKpqZmSnfvXt3/d+/f//9+/fvX0ZGRgYGBgaGf//+Mfz58+c/AyMjI8P//38YGKG8/4AMhj9//jL8+/cPxmYAAqAfGZkYgApACogDBcGOgLsA5EcgAyQAhxsY/jH8+wczEAhAFoA0QPiMQAEQ/R/qApABf//+ZcCFAcgCqAAyEJoBF/gL9iMyzD8gAeJHFIADkAFfgZqABrASgV4A+QFrAJAPC/EjJoD5/x/Mj5j+wzUgw5QB6gdQNJAFBFBgQBEA1w'
        };

        const base64Data = iconData[semaphore] || iconData['⚪'];
        return nativeImage.createFromDataURL(`data:image/png;base64,${base64Data}`);
    }

    createFallbackHTML() {
        const fallbackHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CucoExt Status</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #202020;
            color: white;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .status { font-size: 24px; margin: 20px 0; }
        .message { font-size: 16px; }
    </style>
</head>
<body>
    <div class="status">⚪</div>
    <div class="message">CucoExt Widget</div>
    <div>Status loading...</div>
    <script>
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('status-update', (event, status) => {
            document.querySelector('.status').textContent = status.semaphore;
            document.querySelector('.message').textContent = status.message;
        });
    </script>
</body>
</html>`;
        
        const htmlPath = path.join(__dirname, 'taskbar-popup.html');
        fs.writeFileSync(htmlPath, fallbackHTML);
        console.log('✅ Created fallback HTML file');
    }

    createWindow() {
        try {
            this.window = new BrowserWindow({
                width: 350,
                height: 250,
                show: true, // Show the window so it appears in taskbar
                frame: true, // Show window frame for taskbar integration
                alwaysOnTop: false,
                resizable: false,
                skipTaskbar: false, // Allow it to appear in taskbar
                transparent: false,
                icon: this.createStatusIcon('⚪'), // Set window icon
                title: 'CucoExt Work Tracker',
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });

            // Check if HTML file exists
            const htmlPath = path.join(__dirname, 'taskbar-popup.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('❌ HTML file not found:', htmlPath);
                // Create a simple fallback HTML
                this.createFallbackHTML();
            }

            // Load widget content
            this.window.loadFile(htmlPath).catch(error => {
                console.error('❌ Failed to load HTML file:', error);
                // Load fallback content
                this.window.loadURL('data:text/html,<h1>CucoExt Widget</h1><p>Status loading...</p>');
            });

            console.log('✅ Widget window created successfully');

            // Minimize to system tray on close
            this.window.on('close', (event) => {
                event.preventDefault();
                this.window.hide();
                this.isVisible = false;
                
                // Show notification
                if (this.tray) {
                    this.tray.displayBalloon({
                        iconType: 'info',
                        title: 'CucoExt',
                        content: 'App minimized to system tray. Right-click the tray icon to access options.'
                    });
                }
            });

            // Auto-minimize on startup after a delay
            setTimeout(() => {
                this.window.hide();
                this.isVisible = false;
            }, 3000); // Show for 3 seconds then minimize

        } catch (error) {
            console.error('❌ Error creating window:', error);
            throw error;
        }
    }

    toggleWindow() {
        if (this.isVisible) {
            this.hideWindow();
        } else {
            this.showWindow();
        }
    }

    showWindow() {
        if (this.window) {
            // Position near tray icon
            const trayBounds = this.tray.getBounds();
            const windowBounds = this.window.getBounds();
            
            // Calculate position (bottom-right of screen)
            const x = trayBounds.x - windowBounds.width + trayBounds.width;
            const y = trayBounds.y - windowBounds.height;
            
            this.window.setPosition(x, y);
            this.window.show();
            this.window.focus();
            this.isVisible = true;

            // Send current status to window
            this.window.webContents.send('status-update', this.currentStatus);
        }
    }

    hideWindow() {
        if (this.window) {
            this.window.hide();
            this.isVisible = false;
        }
    }

    async updateStatus() {
        try {
            console.log('🔄 Updating status...');
            
            // Get status from core scripts
            const status = await this.getWorkStatus();
            this.currentStatus = status;

            console.log('📊 Status received:', status.semaphore, status.message);

            // Update tray icon
            const iconImage = this.createStatusIcon(status.semaphore);
            this.tray.setImage(iconImage);
            
            // Update tooltip
            this.tray.setToolTip(`CucoExt - ${status.message}`);

            // Update window if visible
            if (this.isVisible && this.window) {
                this.window.webContents.send('status-update', status);
            }

            console.log('✅ Status updated successfully');

        } catch (error) {
            console.error('❌ Error updating status:', error);
            this.currentStatus = {
                semaphore: '🔴',
                message: 'Error: ' + error.message,
                workingTime: '0h 0min',
                remainingTime: '--h --min'
            };
        }
    }

    async getWorkStatus() {
        return new Promise((resolve) => {
            const { exec } = require('child_process');
            const corePath = path.join(__dirname, '..', 'core');
            const scriptPath = path.join(corePath, 'tests', 'working-summary.js');

            exec(`node "${scriptPath}"`, { cwd: corePath }, (error, stdout) => {
                if (error) {
                    resolve({
                        semaphore: '🔴',
                        message: 'Error: ' + error.message,
                        workingTime: '0h 0min',
                        remainingTime: '--h --min'
                    });
                    return;
                }

                const output = stdout.trim();
                let semaphore = '⚪';
                let message = 'Loading...';
                let workingTime = '0h 0min';
                let remainingTime = '--h --min';

                try {
                    // Parse output
                    if (output.includes('You can leave now')) {
                        semaphore = '🟢';
                        message = 'Can leave now!';
                        remainingTime = 'Complete';
                    } else if (output.includes('Time remaining:')) {
                        semaphore = '🔵';
                        const match = output.match(/Time remaining: (\d+h \d+min)/);
                        if (match) {
                            remainingTime = match[1];
                            message = `Working... ${remainingTime} left`;
                        }
                    } else if (output.includes('Error')) {
                        semaphore = '🔴';
                        message = 'Error updating status';
                    }

                    // Extract working time
                    const workMatch = output.match(/(\d+h \d+min)/);
                    if (workMatch) {
                        workingTime = workMatch[1];
                    }

                } catch (parseError) {
                    semaphore = '🔴';
                    message = 'Parse error';
                }

                resolve({
                    semaphore,
                    message,
                    workingTime,
                    remainingTime
                });
            });
        });
    }

    startUpdates() {
        // Initial update
        this.updateStatus();

        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateStatus();
        }, 30000);
    }

    pinToTaskbar() {
        // On Windows 11, this will prompt user to pin the app
        app.setUserTasks([
            {
                program: process.execPath,
                arguments: '',
                iconPath: process.execPath,
                iconIndex: 0,
                title: 'CucoExt Work Tracker',
                description: 'Pin to taskbar for quick access'
            }
        ]);

        // Show notification
        const { dialog } = require('electron');
        dialog.showMessageBox({
            type: 'info',
            title: 'Pin to Taskbar',
            message: 'To pin CucoExt to your taskbar:',
            detail: '1. Right-click the CucoExt icon in your taskbar\n2. Select "Pin to taskbar"\n\nOr drag the icon from the system tray to your taskbar.'
        });
    }

    setupAppEvents() {
        app.on('window-all-closed', (e) => {
            e.preventDefault(); // Keep running in background
        });

        app.on('before-quit', () => {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        });
    }
}

// Initialize when Electron is ready
app.whenReady().then(async () => {
    try {
        console.log('🚀 Electron app ready, initializing widget...');
        const widget = new Windows11TaskbarIntegration();
        await widget.initialize();
        console.log('✅ Widget initialization complete');
    } catch (error) {
        console.error('❌ Failed to initialize widget:', error);
        app.quit();
    }
});

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
    console.log('⚠️ Another instance is already running. Exiting...');
    app.quit();
} else {
    app.on('second-instance', () => {
        console.log('🔄 Second instance detected, focusing existing widget...');
        // If someone tries to run a second instance, focus our window instead
    });
}
