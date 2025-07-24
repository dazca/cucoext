/**
 * CucoExt - Smart Work Time Tracker
 * Windows11 Widget HTTP Server
 * Provides API endpoints for work time tracking
 * 
 * Copyright (c) 2024-2025 CucoExt Development Team
 * Licensed under CC BY-NC-SA 4.0
 * 
 * Commercial use requires explicit written permission.
 * Contact: cucoext.licensing@gmail.com
 * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
 */

const http = require('http');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

class CucoExtAPIServer {
    constructor(port = 3001) {
        this.port = port;
        this.corePath = path.join(__dirname, '..', 'core');
        this.widgetPath = __dirname;
    }

    async getWorkStatus() {
        return new Promise((resolve) => {
            const scriptPath = path.join(this.corePath, 'tests', 'working-summary.js');
            
            exec(`node "${scriptPath}"`, { cwd: this.corePath }, (error, stdout, stderr) => {
                if (error) {
                    console.log('Error executing working-summary:', error.message);
                    resolve({
                        semaphore: '🔴',
                        message: 'Error: ' + error.message,
                        workingTime: '0h 0min',
                        remainingTime: '--h --min',
                        progress: 0,
                        error: true
                    });
                    return;
                }

                const output = stdout.trim();
                let semaphore = '⚪';
                let message = 'Loading...';
                let workingTime = '0h 0min';
                let presenceTime = '0h 0min';
                let remainingTime = '--h --min';
                let progress = 0;

                try {
                    // Extract working minutes
                    const minutesMatch = output.match(/Working time today: \d+h \d+min \((\d+) minutes\)/);
                    const workingMinutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
                    
                    // Extract presence minutes
                    const presenceMatch = output.match(/Presence time today: \d+h \d+min \((\d+) minutes\)/);
                    const presenceMinutes = presenceMatch ? parseInt(presenceMatch[1]) : 0;
                    
                    const hours = Math.floor(workingMinutes / 60);
                    const mins = workingMinutes % 60;
                    workingTime = `${hours}h ${mins}min`;
                    
                    const presHours = Math.floor(presenceMinutes / 60);
                    const presMins = presenceMinutes % 60;
                    presenceTime = `${presHours}h ${presMins}min`;
                    
                    // Calculate remaining time and progress
                    const remaining = Math.max(0, 510 - workingMinutes); // 8.5h = 510min
                    const remHours = Math.floor(remaining / 60);
                    const remMins = remaining % 60;
                    progress = Math.min(100, Math.round((workingMinutes / 510) * 100));
                    
                    if (workingMinutes >= 510) {
                        semaphore = '🟢';
                        message = 'Can leave now!';
                        remainingTime = 'Complete';
                    } else if (output.includes('You can leave now')) {
                        semaphore = '🟢';
                        message = 'Can leave now!';
                        remainingTime = 'Complete';
                    } else if (output.includes('Time remaining:')) {
                        semaphore = '🔵';
                        remainingTime = `${remHours}h ${remMins}min`;
                        message = `Working... ${remainingTime} left`;
                    } else if (output.includes('Error')) {
                        semaphore = '🔴';
                        message = 'Error updating status';
                    } else {
                        semaphore = '🔵';
                        remainingTime = `${remHours}h ${remMins}min`;
                        message = `Working... ${remainingTime} left`;
                    }
                    
                } catch (parseError) {
                    console.log('Error parsing output:', parseError.message);
                    semaphore = '🔴';
                    message = 'Parse error';
                }

                resolve({
                    semaphore,
                    message,
                    workingTime,
                    presenceTime,
                    remainingTime,
                    progress,
                    timestamp: new Date().toISOString(),
                    rawOutput: output
                });
            });
        });
    }

    async serveStaticFile(filePath, res) {
        try {
            const fullPath = path.join(this.widgetPath, filePath);
            
            if (!fs.existsSync(fullPath)) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            const ext = path.extname(fullPath).toLowerCase();
            const contentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.ico': 'image/x-icon'
            };

            const contentType = contentTypes[ext] || 'text/plain';
            const content = fs.readFileSync(fullPath);

            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        } catch (error) {
            res.writeHead(500);
            res.end('Server error: ' + error.message);
        }
    }

    start() {
        const server = http.createServer(async (req, res) => {
            const url = new URL(req.url, `http://localhost:${this.port}`);
            
            console.log(`${new Date().toISOString()} - ${req.method} ${url.pathname}`);

            // CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            try {
                if (url.pathname === '/api/status') {
                    // API endpoint for widget status
                    const status = await this.getWorkStatus();
                    res.setHeader('Content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify(status, null, 2));
                    
                } else if (url.pathname === '/api/refresh') {
                    // Force refresh endpoint
                    const status = await this.getWorkStatus();
                    
                    // Update widget-data.json file
                    const dataPath = path.join(this.widgetPath, 'widget-data.json');
                    fs.writeFileSync(dataPath, JSON.stringify({
                        semaphore: status.semaphore,
                        statusMessage: status.message,
                        workingTime: status.workingTime,
                        remainingTime: status.remainingTime,
                        progressPercent: status.progress,
                        lastUpdate: status.timestamp
                    }, null, 2));
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, status }));
                    
                } else if (url.pathname === '/api/working-hours' && req.method === 'GET') {
                    // Get current working hours settings
                    try {
                        const { exec } = require('child_process');
                        const scriptPath = path.join(this.corePath, 'tests', 'manage-working-hours.js');
                        
                        exec(`node "${scriptPath}" show`, { cwd: this.corePath }, (error, stdout, stderr) => {
                            if (error) {
                                res.writeHead(500);
                                res.end(JSON.stringify({ error: error.message }));
                                return;
                            }
                            
                            const output = stdout.trim();
                            let currentSet = 'common';
                            let autoDetectIntensive = true;
                            
                            if (output.includes('Current working hours set: ')) {
                                const match = output.match(/Current working hours set: (\w+)/);
                                if (match) currentSet = match[1];
                            }
                            
                            if (output.includes('Auto-detect intensive:')) {
                                autoDetectIntensive = output.includes('Auto-detect intensive: true');
                            }
                            
                            res.setHeader('Content-Type', 'application/json');
                            res.writeHead(200);
                            res.end(JSON.stringify({ currentSet, autoDetectIntensive }));
                        });
                    } catch (error) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: error.message }));
                    }
                    
                } else if (url.pathname === '/api/working-hours' && req.method === 'POST') {
                    // Update working hours settings
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            const { schedule, autoDetectIntensive } = data;
                            
                            const { exec } = require('child_process');
                            const scriptPath = path.join(this.corePath, 'tests', 'manage-working-hours.js');
                            
                            let command = `node "${scriptPath}" set ${schedule}`;
                            if (autoDetectIntensive !== undefined) {
                                command += ` --auto-detect-intensive=${autoDetectIntensive}`;
                            }
                            
                            exec(command, { cwd: this.corePath }, (error, stdout, stderr) => {
                                if (error) {
                                    res.writeHead(500);
                                    res.end(JSON.stringify({ error: error.message }));
                                    return;
                                }
                                
                                res.setHeader('Content-Type', 'application/json');
                                res.writeHead(200);
                                res.end(JSON.stringify({ 
                                    success: true, 
                                    message: `Working hours updated to ${schedule}`,
                                    schedule,
                                    autoDetectIntensive
                                }));
                            });
                            
                        } catch (error) {
                            res.writeHead(400);
                            res.end(JSON.stringify({ error: 'Invalid JSON data' }));
                        }
                    });
                    
                } else if (url.pathname === '/' || url.pathname === '/widget.html') {
                    // Serve widget HTML
                    await this.serveStaticFile('widget.html', res);
                    
                } else if (url.pathname === '/manifest.json') {
                    // Serve PWA manifest
                    await this.serveStaticFile('manifest.json', res);
                    
                } else if (url.pathname === '/sw.js') {
                    // Serve service worker
                    await this.serveStaticFile('sw.js', res);
                    
                } else if (url.pathname === '/widget-data.json') {
                    // Serve widget data
                    await this.serveStaticFile('widget-data.json', res);
                    
                } else {
                    // Try to serve as static file
                    const filePath = url.pathname.substring(1); // Remove leading /
                    await this.serveStaticFile(filePath, res);
                }
                
            } catch (error) {
                console.error('Server error:', error.message);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Server error: ' + error.message }));
            }
        });

        server.listen(this.port, () => {
            console.log(`\n🚀 CucoExt Widget Server running on http://localhost:${this.port}`);
            console.log(`📊 Widget URL: http://localhost:${this.port}/widget.html`);
            console.log(`🔌 API Status: http://localhost:${this.port}/api/status`);
            console.log(`🔄 API Refresh: http://localhost:${this.port}/api/refresh`);
            console.log(`\n📋 To install as Windows 11 widget:`);
            console.log(`   1. Open http://localhost:${this.port}/widget.html in Microsoft Edge`);
            console.log(`   2. Click ⋯ menu → Apps → Install this site as an app`);
            console.log(`   3. Press Win+W → Add widgets → Look for "CucoExt Work Tracker"`);
            console.log(`\n⏹️  Press Ctrl+C to stop server\n`);
        });

        // Handle port conflicts
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`\n❌ Port ${this.port} is already in use!`);
                console.log(`\n🔍 Checking if CucoExt server is already running...`);
                
                // Try to connect to existing server
                const http = require('http');
                const req = http.get(`http://localhost:${this.port}/api/status`, (res) => {
                    console.log(`✅ CucoExt server is already running on port ${this.port}`);
                    console.log(`📊 Widget URL: http://localhost:${this.port}/widget.html`);
                    console.log(`\n💡 You can:`);
                    console.log(`   • Use the existing server at http://localhost:${this.port}`);
                    console.log(`   • Stop the existing server and restart this one`);
                    console.log(`   • Use a different port by setting PORT environment variable`);
                    process.exit(0);
                });
                
                req.on('error', (error) => {
                    console.log(`❌ Port ${this.port} is occupied by another service`);
                    console.log(`\n🔧 Trying to find an available port...`);
                    
                    // Try alternative ports
                    this.tryAlternativePort(server, this.port + 1);
                });
                
                req.setTimeout(2000, () => {
                    req.destroy();
                    console.log(`❌ Port ${this.port} is occupied by another service`);
                    console.log(`\n🔧 Trying to find an available port...`);
                    this.tryAlternativePort(server, this.port + 1);
                });
            } else {
                console.error('Server error:', err);
                process.exit(1);
            }
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n\n👋 Shutting down CucoExt Widget Server...');
            server.close(() => {
                console.log('✅ Server stopped gracefully');
                process.exit(0);
            });
        });

        return server;
    }

    tryAlternativePort(server, port) {
        if (port > this.port + 10) {
            console.log(`❌ Could not find an available port after trying ${this.port} to ${port - 1}`);
            console.log(`\n💡 Please:`);
            console.log(`   • Stop other services using these ports`);
            console.log(`   • Or set a specific port: set PORT=3010 && npm run server`);
            process.exit(1);
            return;
        }

        console.log(`🔍 Trying port ${port}...`);
        
        const testServer = require('http').createServer();
        testServer.listen(port, () => {
            testServer.close(() => {
                this.port = port;
                console.log(`✅ Found available port: ${port}`);
                
                // Update server to use new port
                server.listen(port, () => {
                    console.log(`\n🚀 CucoExt Widget Server running on http://localhost:${port}`);
                    console.log(`📊 Widget URL: http://localhost:${port}/widget.html`);
                    console.log(`🔌 API Status: http://localhost:${port}/api/status`);
                    console.log(`🔄 API Refresh: http://localhost:${port}/api/refresh`);
                    console.log(`\n📋 To install as Windows 11 widget:`);
                    console.log(`   1. Open http://localhost:${port}/widget.html in Microsoft Edge`);
                    console.log(`   2. Click ⋯ menu → Apps → Install this site as an app`);
                    console.log(`   3. Press Win+W → Add widgets → Look for "CucoExt Work Tracker"`);
                    console.log(`\n⏹️  Press Ctrl+C to stop server\n`);
                });
            });
        });
        
        testServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                this.tryAlternativePort(server, port + 1);
            } else {
                console.error('Error testing port:', err);
                process.exit(1);
            }
        });
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new CucoExtAPIServer();
    server.start();
}

module.exports = CucoExtAPIServer;
