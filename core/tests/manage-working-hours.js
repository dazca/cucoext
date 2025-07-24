#!/usr/bin/env node
/**
 * Working Hours Management Script
 * Manage working hours configurations and user preferences
 */

const { WorkingHoursManager, WORKING_HOURS_SETS, USER_PREFERENCES } = require('../resources/working-hours-config');
const fs = require('fs');
const path = require('path');

class WorkingHoursAdmin {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'resources', 'user-working-hours.json');
        this.manager = new WorkingHoursManager();
        this.loadUserConfig();
    }

    /**
     * Load user configuration from file
     */
    loadUserConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                this.manager.updateUserConfig(config);
                return config;
            }
        } catch (error) {
            console.log('⚠️  Error loading user config:', error.message);
        }
        return null;
    }

    /**
     * Save user configuration to file
     */
    saveUserConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.manager.userConfig, null, 2));
            console.log('✅ User configuration saved');
            return true;
        } catch (error) {
            console.log('❌ Error saving user config:', error.message);
            return false;
        }
    }

    /**
     * Display all available working hours sets
     */
    showWorkingHoursSets() {
        console.log('\n📋 AVAILABLE WORKING HOURS SETS\n');
        
        Object.keys(WORKING_HOURS_SETS).forEach(key => {
            const set = WORKING_HOURS_SETS[key];
            console.log(`🔸 ${key.toUpperCase()}: ${set.name}`);
            console.log(`   ${set.description}`);
            
            // Show schedule for each day
            Object.keys(set.schedule).forEach(day => {
                const daySchedule = set.schedule[day];
                const workHours = Math.floor(daySchedule.workMinutes / 60);
                const workMins = daySchedule.workMinutes % 60;
                const totalHours = Math.floor(daySchedule.totalPresence / 60);
                const totalMins = daySchedule.totalPresence % 60;
                
                console.log(`   ${day.charAt(0).toUpperCase() + day.slice(1)}: ${workHours}h${workMins > 0 ? ` ${workMins}min` : ''} work + ${daySchedule.eatingMinutes}min eating = ${totalHours}h${totalMins > 0 ? ` ${totalMins}min` : ''} presence`);
            });
            console.log('');
        });
    }

    /**
     * Show current user configuration
     */
    showCurrentConfig() {
        console.log('\n⚙️  CURRENT USER CONFIGURATION\n');
        console.log(`Working Hours Set: ${this.manager.userConfig.workingHoursSet}`);
        console.log(`Auto-detect Intensive: ${this.manager.userConfig.autoDetectIntensive ? 'Yes' : 'No'}`);
        console.log(`Timezone: ${this.manager.userConfig.timezone}`);
        
        // Show what would be used today
        const today = new Date();
        const todayHours = this.manager.getDayWorkingHours(today);
        console.log(`\nToday (${todayHours.day}): ${todayHours.setName}`);
        console.log(`Work: ${Math.floor(todayHours.workMinutes / 60)}h ${todayHours.workMinutes % 60}min + Eating: ${todayHours.eatingMinutes}min = Total: ${Math.floor(todayHours.totalPresence / 60)}h ${todayHours.totalPresence % 60}min`);
    }

    /**
     * Set working hours configuration
     */
    setWorkingHours(setName) {
        if (!WORKING_HOURS_SETS[setName]) {
            console.log(`❌ Unknown working hours set: ${setName}`);
            console.log('Available sets:', Object.keys(WORKING_HOURS_SETS).join(', '));
            return false;
        }
        
        this.manager.updateUserConfig({ workingHoursSet: setName });
        console.log(`✅ Working hours set changed to: ${setName} (${WORKING_HOURS_SETS[setName].name})`);
        return this.saveUserConfig();
    }

    /**
     * Toggle auto-detect intensive
     */
    toggleAutoDetectIntensive() {
        const newValue = !this.manager.userConfig.autoDetectIntensive;
        this.manager.updateUserConfig({ autoDetectIntensive: newValue });
        console.log(`✅ Auto-detect intensive ${newValue ? 'enabled' : 'disabled'}`);
        return this.saveUserConfig();
    }

    /**
     * Preview working hours for a specific month
     */
    previewMonth(year, month) {
        console.log(`\n📅 WORKING HOURS PREVIEW FOR ${year}-${month.toString().padStart(2, '0')}\n`);
        
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= Math.min(daysInMonth, 7); day++) {
            const date = new Date(year, month - 1, day);
            const dayName = date.toLocaleDateString('en', { weekday: 'long' });
            
            try {
                const dayHours = this.manager.getDayWorkingHours(date);
                const workTime = `${Math.floor(dayHours.workMinutes / 60)}h${dayHours.workMinutes % 60 > 0 ? ` ${dayHours.workMinutes % 60}min` : ''}`;
                const totalTime = `${Math.floor(dayHours.totalPresence / 60)}h${dayHours.totalPresence % 60 > 0 ? ` ${dayHours.totalPresence % 60}min` : ''}`;
                
                console.log(`${day.toString().padStart(2, ' ')} ${dayName.padEnd(9)} | ${dayHours.setName.padEnd(25)} | Work: ${workTime.padEnd(6)} | Total: ${totalTime}`);
            } catch (error) {
                console.log(`${day.toString().padStart(2, ' ')} ${dayName.padEnd(9)} | Weekend/Holiday`);
            }
        }
        
        if (daysInMonth > 7) {
            console.log('   ... (showing first 7 days only)');
        }
    }
}

/**
 * Command line interface
 */
function main() {
    const args = process.argv.slice(2);
    const admin = new WorkingHoursAdmin();

    if (args.length === 0 || args[0] === 'show') {
        admin.showCurrentConfig();
        
    } else if (args[0] === 'list') {
        admin.showWorkingHoursSets();
        
    } else if (args[0] === 'set' && args[1]) {
        admin.setWorkingHours(args[1]);
        
    } else if (args[0] === 'toggle-auto') {
        admin.toggleAutoDetectIntensive();
        
    } else if (args[0] === 'preview' && args[1] && args[2]) {
        const year = parseInt(args[1]);
        const month = parseInt(args[2]);
        admin.previewMonth(year, month);
        
    } else {
        console.log('Working Hours Management');
        console.log('');
        console.log('Usage:');
        console.log('  node manage-working-hours.js [show]              # Show current configuration');
        console.log('  node manage-working-hours.js list                # List all working hours sets');
        console.log('  node manage-working-hours.js set <setname>       # Set working hours (common/standard/intensive)');
        console.log('  node manage-working-hours.js toggle-auto         # Toggle auto-detect intensive in August');
        console.log('  node manage-working-hours.js preview <year> <month>  # Preview month working hours');
        console.log('');
        console.log('Examples:');
        console.log('  node manage-working-hours.js set standard');
        console.log('  node manage-working-hours.js preview 2025 8');
    }
}

// Export for module use
module.exports = WorkingHoursAdmin;

// Run as CLI if called directly
if (require.main === module) {
    main();
}
