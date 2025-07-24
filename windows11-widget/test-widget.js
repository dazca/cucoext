const { app, BrowserWindow, Tray, nativeImage } = require('electron');
const path = require('path');

console.log('🚀 Starting simple test widget...');

app.whenReady().then(() => {
    console.log('✅ Electron app ready');
    
    // Create a simple tray icon
    const iconImage = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAHhJREFUOEtjYBgFAw1MAzgAMkDwh0YGRgYGBgEGhh/oZzD8+cNA8YaBgYGBgYGBYf3///8Z/v//z8DAwMDw////DAz///8Z/v///z8DAwMDw////zMw/P//n+H///8MDAwMDP///2fg+/fvP8P///8Z+P//Z2BgYGAAUAABigBgYGAAADs4TgAAAABJRU5ErkJggg==');
    
    const tray = new Tray(iconImage);
    tray.setToolTip('CucoExt Test');
    
    console.log('✅ Tray icon created successfully');
    console.log('🎯 Widget is running! Look for icon in system tray.');
    
    tray.on('click', () => {
        console.log('Tray icon clicked!');
    });
});

app.on('window-all-closed', (e) => {
    e.preventDefault(); // Keep running
});

console.log('📝 Script loaded, waiting for Electron to be ready...');
