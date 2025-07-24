#!/usr/bin/env node
// Manual testing script for work time tracker
const readline = require('readline');
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    console.log('🧪 Manual Testing Script for Work Time Tracker\n');

    try {
        console.log('📋 Step 1: Setting up credentials');
        const credManager = new CredentialManager();
        
        const hasCredentials = credManager.loadCredentials() !== null;
        
        if (!hasCredentials) {
            console.log('⚠️  No credentials found. Setting up new credentials...\n');
            await credManager.getCredentialsInteractive();
        } else {
            console.log('✅ Existing credentials found');
            const useExisting = await ask('Use existing credentials? (y/n): ');
            
            if (useExisting.toLowerCase() !== 'y') {
                await credManager.getCredentialsInteractive();
            }
        }

        const credentials = credManager.loadCredentials();
        if (!credentials) {
            console.log('❌ Failed to set up credentials');
            process.exit(1);
        }

        console.log('\n📋 Step 2: Testing work time data retrieval');
        const tracker = new WorkTimeTracker();

        console.log('⏳ Fetching work time data...');
        
        try {
            const workData = await tracker.fetchWorkTimeData(credentials);
            
            if (workData) {
                console.log('✅ Work data retrieved successfully');
                console.log(`   📅 Date: ${workData.date || 'Today'}`);
                console.log(`   🚪 Entries: ${workData.entries.join(', ') || 'None'}`);
                console.log(`   🚪 Exits: ${workData.exits.join(', ') || 'None'}`);
                console.log(`   ⏰ Presence: ${workData.presence || '0'}`);
            } else {
                console.log('❌ No work data found for today');
                console.log('   This might be normal if you haven\'t clocked in yet');
            }

            console.log('\n📋 Step 3: Testing time calculations');
            
            const timeData = tracker.calculateRemainingTime(workData);
            
            if (timeData) {
                console.log('✅ Time calculations completed');
                console.log(`   🕘 First entry: ${timeData.entryTime || 'N/A'}`);
                console.log(`   🕕 Last exit: ${timeData.exitTime || 'N/A'}`);
                console.log(`   ⏲️  Total presence: ${timeData.totalPresence} minutes`);
                console.log(`   📊 Work status: ${timeData.workStatus}`);
                console.log(`   ⏰ Time until can leave (presence): ${timeData.timeUntilCanLeave || 'Already can leave'}`);
                console.log(`   ⏰ Time until 9h from entry: ${timeData.timeUntil9Hours || 'Already completed'}`);
                
                if (timeData.exactNineHours) {
                    console.log('   🎯 Exactly 9 hours completed!');
                }
            } else {
                console.log('❌ Time calculation failed');
            }

            console.log('\n📋 Step 4: Testing status determination');
            
            const status = tracker.getWorkStatus(timeData);
            console.log(`✅ Current work status: ${status}`);
            
            const statusDescriptions = {
                'working': '🔵 Currently working',
                'out': '🟡 Currently out (lunch/break)',
                'can_leave': '🟢 Can leave (requirements met)',
                'not_working': '⚪ Not working today'
            };
            
            console.log(`   ${statusDescriptions[status] || '❓ Unknown status'}`);

        } catch (apiError) {
            console.log('❌ API request failed');
            console.log(`   Error: ${apiError.message}`);
            
            console.log('\n📋 Testing HTML parsing fallback');
            const testHTML = await ask('Enter HTML content to test parsing (or press Enter to skip): ');
            
            if (testHTML.trim()) {
                const today = new Date().toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                });
                
                const parsedData = tracker.parseWorkTimeFromHTMLRegex(testHTML, today);
                
                if (parsedData) {
                    console.log('✅ HTML parsing successful');
                    console.log(`   📅 Date: ${parsedData.date}`);
                    console.log(`   🚪 Entries: ${parsedData.entries.join(', ')}`);
                    console.log(`   🚪 Exits: ${parsedData.exits.join(', ')}`);
                    console.log(`   ⏰ Presence: ${parsedData.presence}`);
                } else {
                    console.log('❌ HTML parsing failed');
                }
            }
        }

        console.log('\n📋 Step 5: Final validation');
        
        // Test credential validation
        const isValid = credManager.validateCredentials(credentials);
        console.log(`✅ Credential validation: ${isValid ? 'PASS' : 'FAIL'}`);
        
        // Test date range generation
        const dateRange = tracker.getTodayDateRange();
        console.log(`✅ Date range generation: ${dateRange}`);
        
        console.log('\n🎉 Manual testing completed!');
        console.log('\nNext steps:');
        console.log('1. Install Chrome extension from chrome-extension/ folder');
        console.log('2. Install Firefox extension from firefox-extension/ folder');
        console.log('3. Run taskbar app from taskbar-app/ folder');
        
        const runOtherTests = await ask('\nRun unit tests? (y/n): ');
        if (runOtherTests.toLowerCase() === 'y') {
            console.log('\n🔧 Running unit tests...');
            require('./unit-tests');
        }
        
        const runIntegrationTests = await ask('Run integration tests? (y/n): ');
        if (runIntegrationTests.toLowerCase() === 'y') {
            console.log('\n🔗 Running integration tests...');
            const integrationRunner = require('./integration-tests');
            await integrationRunner.run();
        }

    } catch (error) {
        console.log(`❌ Testing failed: ${error.message}`);
        console.log('Stack trace:', error.stack);
    } finally {
        rl.close();
    }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n👋 Testing interrupted by user');
    rl.close();
    process.exit(0);
});

if (require.main === module) {
    main().catch(error => {
        console.error('💥 Unhandled error:', error);
        process.exit(1);
    });
}

module.exports = { main };
