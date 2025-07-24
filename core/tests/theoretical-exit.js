#!/usr/bin/env node
/**
 * Theoretical Exit Time Calculator
 * Calculates when you should exit based on entry time and working hours configuration
 */

const { WorkingHoursManager } = require('../resources/working-hours-config');
const { getCurrentWorkingMinutes } = require('./simple-minutes-test');

class TheoreticalExitCalculator {
    constructor(userConfig = {}) {
        this.workingHoursManager = new WorkingHoursManager(userConfig);
    }

    /**
     * Calculate theoretical exit time based on entry time
     */
    calculateExitTime(entryTime, date = new Date()) {
        try {
            const result = this.workingHoursManager.calculateTheoreticalExit(entryTime, date);
            
            // Add additional useful information
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const exitMinutes = this.workingHoursManager.parseTimeToMinutes(result.exitTime);
            const remainingMinutes = Math.max(0, exitMinutes - currentMinutes);
            
            return {
                ...result,
                currentTime: this.workingHoursManager.formatMinutesToTime(currentMinutes),
                remainingMinutes,
                remainingTime: this.workingHoursManager.formatMinutesToTime(remainingMinutes),
                isWorkday: result.totalPresenceMinutes > 0
            };
        } catch (error) {
            throw new Error(`Failed to calculate exit time: ${error.message}`);
        }
    }

    /**
     * Get theoretical exit time for today using current entry from system
     */
    async getTodayTheoreticalExit() {
        try {
            // Get today's entry time from the work tracking system
            const WorkTimeTracker = require('../work-time-tracker');
            const CredentialManager = require('../credential-manager');
            
            const credManager = new CredentialManager();
            let credentials = credManager.loadCredentials();
            
            if (!credentials) {
                const tracker = new WorkTimeTracker();
                credentials = tracker.credentials;
            }

            const tracker = new WorkTimeTracker();
            const workData = await tracker.fetchWorkTimeData(credentials);
            
            if (!workData || !workData.entries || workData.entries.length === 0) {
                return {
                    error: 'No entry time found for today',
                    suggestion: 'Please clock in first to calculate theoretical exit time'
                };
            }

            const firstEntry = workData.entries[0];
            return this.calculateExitTime(firstEntry);
            
        } catch (error) {
            return {
                error: `Failed to get today's data: ${error.message}`
            };
        }
    }

    /**
     * Calculate exit time with manual entry time input
     */
    calculateManualExitTime(entryTime, workingHoursSet = null, date = new Date()) {
        if (workingHoursSet) {
            this.workingHoursManager.updateUserConfig({ workingHoursSet });
        }
        
        return this.calculateExitTime(entryTime, date);
    }
}

/**
 * Command line interface
 */
async function main() {
    const args = process.argv.slice(2);
    const calculator = new TheoreticalExitCalculator();

    try {
        if (args.length === 0) {
            // No arguments - use today's actual entry time
            console.log('🔍 Getting today\'s entry time from system...');
            const result = await calculator.getTodayTheoreticalExit();
            
            if (result.error) {
                console.log('❌', result.error);
                if (result.suggestion) {
                    console.log('💡', result.suggestion);
                }
                return;
            }
            
            console.log('✅ Theoretical exit calculation for today:');
            console.log(`   Entry time: ${result.entryTime}`);
            console.log(`   Exit time: ${result.exitTime}`);
            console.log(`   Working set: ${result.setName}`);
            console.log(`   Day: ${result.day}`);
            console.log(`   Total presence: ${Math.floor(result.totalPresenceMinutes / 60)}h ${result.totalPresenceMinutes % 60}min`);
            console.log(`   Work time: ${Math.floor(result.workMinutes / 60)}h ${result.workMinutes % 60}min`);
            console.log(`   Eating time: ${result.eatingMinutes}min`);
            console.log(`   Current time: ${result.currentTime}`);
            console.log(`   Remaining: ${result.remainingTime} (${result.remainingMinutes} minutes)`);
            
        } else if (args.length === 1) {
            // One argument - manual entry time for today
            const entryTime = args[0];
            const result = calculator.calculateExitTime(entryTime);
            
            console.log('✅ Theoretical exit calculation:');
            console.log(`   Entry time: ${result.entryTime}`);
            console.log(`   Exit time: ${result.exitTime}`);
            console.log(`   Working set: ${result.setName}`);
            console.log(`   Total presence: ${Math.floor(result.totalPresenceMinutes / 60)}h ${result.totalPresenceMinutes % 60}min`);
            console.log(`   Remaining: ${result.remainingTime}`);
            
        } else if (args.length === 2) {
            // Two arguments - entry time and working hours set
            const entryTime = args[0];
            const workingHoursSet = args[1];
            const result = calculator.calculateManualExitTime(entryTime, workingHoursSet);
            
            console.log('✅ Theoretical exit calculation:');
            console.log(`   Entry time: ${result.entryTime}`);
            console.log(`   Exit time: ${result.exitTime}`);
            console.log(`   Working set: ${result.setName}`);
            console.log(`   Total presence: ${Math.floor(result.totalPresenceMinutes / 60)}h ${result.totalPresenceMinutes % 60}min`);
            console.log(`   Remaining: ${result.remainingTime}`);
            
        } else {
            console.log('Usage:');
            console.log('  node theoretical-exit.js                    # Use today\'s actual entry time');
            console.log('  node theoretical-exit.js 09:00              # Manual entry time');
            console.log('  node theoretical-exit.js 09:00 standard     # Manual entry + working set');
            console.log('');
            console.log('Available working sets: common, standard, intensive');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// Export for testing and module use
module.exports = TheoreticalExitCalculator;

// Run as CLI if called directly
if (require.main === module) {
    main();
}
