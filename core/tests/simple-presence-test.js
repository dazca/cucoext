#!/usr/bin/env node
// Simple test that returns current presence minutes in plain text
// Auto-retries with browser automation if credentials fail
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');
const path = require('path');
const { spawn } = require('child_process');

let retryAttempts = 0;
const MAX_RETRIES = 2;

async function runAutomationIfNeeded() {
    console.log('🤖 Launching automated browser to get fresh credentials...');
    
    return new Promise((resolve, reject) => {
        const automationPath = path.join(__dirname, '..', 'automation', 'automated-token-extractor.js');
        const automation = spawn('node', [automationPath], {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..', 'automation')
        });

        let output = '';
        automation.stdout.on('data', (data) => {
            output += data.toString();
            console.log(data.toString().trim());
        });

        automation.stderr.on('data', (data) => {
            console.error(data.toString().trim());
        });

        automation.on('close', (code) => {
            if (code === 0 || output.includes('extraction completed successfully')) {
                console.log('✅ Automation completed successfully');
                resolve(true);
            } else {
                console.log('❌ Automation failed');
                resolve(false);
            }
        });

        automation.on('error', (error) => {
            console.log('❌ Failed to start automation:', error.message);
            resolve(false);
        });
    });
}

async function getCurrentPresenceMinutes() {
    try {
        const credentialManager = new CredentialManager();
        const credentials = await credentialManager.getCredentials();
        
        if (!credentials || !credentials.token) {
            throw new Error('No credentials configured');
        }

        const workTimeTracker = new WorkTimeTracker();
        const workStatus = await workTimeTracker.getWorkStatus(credentials);
        
        if (!workStatus || workStatus.error) {
            throw new Error(workStatus?.message || 'Unknown error getting work status');
        }

        // Calculate presence minutes from work data
        let presenceMinutes = 0;
        if (workStatus.workData && workStatus.workData.entries) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // Process each entry-exit cycle
            for (let i = 0; i < workStatus.workData.entries.length; i++) {
                const entryTime = workStatus.workData.entries[i];
                const entryMinutes = parseTimeToMinutes(entryTime);
                
                let exitMinutes;
                if (i < workStatus.workData.exits.length) {
                    // Use actual exit time
                    const exitTime = workStatus.workData.exits[i];
                    exitMinutes = parseTimeToMinutes(exitTime);
                } else {
                    // Person is currently inside, use current time
                    exitMinutes = currentMinutes;
                }
                
                // Add this period to total presence time
                const periodMinutes = exitMinutes - entryMinutes;
                if (periodMinutes > 0) {
                    presenceMinutes += periodMinutes;
                }
            }
        }

        return Math.max(0, presenceMinutes);

    } catch (error) {
        if (error.message.includes('419') || error.message.includes('expired') || error.message.includes('CSRF')) {
            retryAttempts++;
            if (retryAttempts <= MAX_RETRIES) {
                console.log(`🔄 Credentials expired (attempt ${retryAttempts}/${MAX_RETRIES}). Running automation...`);
                const automationSuccess = await runAutomationIfNeeded();
                
                if (automationSuccess) {
                    console.log('⏳ Waiting 3 seconds for credentials to stabilize...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return getCurrentPresenceMinutes();
                } else {
                    throw new Error('Automation failed to refresh credentials');
                }
            } else {
                throw new Error('Max retries exceeded for credential refresh');
            }
        }
        throw error;
    }
}

function parseTimeToMinutes(timeString) {
    if (!timeString || timeString === '00:00:00') return 0;
    
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    
    return hours * 60 + minutes;
}

if (require.main === module) {
    getCurrentPresenceMinutes()
        .then(minutes => {
            console.log(minutes);
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}

module.exports = getCurrentPresenceMinutes;
