#!/usr/bin/env node
// Verbose version to debug what's happening
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');

async function debugWorkData() {
    try {
        console.log('🔍 Debug: Loading credentials...');
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            console.log('   No config credentials found, using defaults');
            const tracker = new WorkTimeTracker();
            credentials = tracker.credentials;
        } else {
            console.log('   ✅ Loaded credentials from config');
            console.log(`   Token: ${credentials.token.substring(0, 20)}...`);
        }

        console.log('🔍 Debug: Fetching work data...');
        const tracker = new WorkTimeTracker();
        const workData = await tracker.fetchWorkTimeData(credentials);
        
        console.log('🔍 Debug: Work data result:');
        console.log('   ', JSON.stringify(workData, null, 2));
        
        if (!workData || !workData.entries || workData.entries.length === 0) {
            console.log('❌ No work entries found for today');
            console.log('   This could mean:');
            console.log('   - You haven\'t clocked in yet today');
            console.log('   - The date format doesn\'t match');
            console.log('   - The HTML parsing failed');
            return '0';
        }

        console.log('✅ Work entries found:', workData.entries);
        console.log('✅ Work exits found:', workData.exits);

        // Calculate current working minutes
        const firstEntry = workData.entries[0];
        const entryMinutes = tracker.parseTimeToMinutes(firstEntry);
        
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        console.log(`🔍 Entry time: ${firstEntry} (${entryMinutes} minutes)`);
        console.log(`🔍 Current time: ${now.getHours()}:${now.getMinutes()} (${currentMinutes} minutes)`);
        
        // If person has exited, use last exit time instead of current time
        let workingMinutes;
        if (workData.exits.length > 0 && workData.entries.length === workData.exits.length) {
            const lastExit = workData.exits[workData.exits.length - 1];
            const exitMinutes = tracker.parseTimeToMinutes(lastExit);
            workingMinutes = exitMinutes - entryMinutes;
            console.log(`🔍 Using exit time: ${lastExit} (${exitMinutes} minutes)`);
        } else {
            workingMinutes = currentMinutes - entryMinutes;
            console.log('🔍 Still working, using current time');
        }

        console.log(`🔍 Total working minutes: ${workingMinutes}`);
        return Math.max(0, workingMinutes).toString();
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('   Stack:', error.stack);
        return 'Error: ' + error.message;
    }
}

debugWorkData().then(result => {
    console.log(`\n🎯 Final result: ${result}`);
    process.exit(0);
});
