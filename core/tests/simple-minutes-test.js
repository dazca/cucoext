#!/usr/bin/env node
// Simple test that returns current working minutes in plain text
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

async function getCurrentWorkingMinutes() {
    try {
        // Load credentials, fallback to default if none found
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            // Use default credentials from WorkTimeTracker
            const tracker = new WorkTimeTracker();
            credentials = tracker.credentials;
        }

        // Get work data
        const tracker = new WorkTimeTracker();
        const workData = await tracker.fetchWorkTimeData(credentials);
        
        if (!workData || !workData.entries || workData.entries.length === 0) {
            return '0';
        }

        // Calculate current working minutes
        const firstEntry = workData.entries[0];
        const entryMinutes = tracker.parseTimeToMinutes(firstEntry);
        
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        // If person has exited, use last exit time instead of current time
        let workingMinutes;
        if (workData.exits.length > 0 && workData.entries.length === workData.exits.length) {
            const lastExit = workData.exits[workData.exits.length - 1];
            const exitMinutes = tracker.parseTimeToMinutes(lastExit);
            workingMinutes = exitMinutes - entryMinutes;
        } else {
            workingMinutes = currentMinutes - entryMinutes;
        }

        return Math.max(0, workingMinutes).toString();
        
    } catch (error) {
        // If 419 error (expired tokens) and we haven't retried too much, try automation
        if (error.message.includes('419') && retryAttempts < MAX_RETRIES) {
            retryAttempts++;
            console.log(`⚠️  Credentials expired (attempt ${retryAttempts}/${MAX_RETRIES}). Trying automation...`);
            
            const automationSuccess = await runAutomationIfNeeded();
            if (automationSuccess) {
                console.log('🔄 Retrying with fresh credentials...');
                return await getCurrentWorkingMinutes();
            }
        }
        
        return 'Error: ' + error.message;
    }
}

// Run and output result
if (require.main === module) {
    getCurrentWorkingMinutes().then(result => {
        console.log(result);
        process.exit(0);
    });
}

module.exports = getCurrentWorkingMinutes;
