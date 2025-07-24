/**
 * Working Hours Configuration
 * Defines different working hour sets for the company
 */

const WORKING_HOURS_SETS = {
    'common': {
        name: 'Common Schedule',
        description: '8h30min work + 30min eating Mon-Thu, 6h Fri',
        schedule: {
            monday: { workMinutes: 8.5 * 60, eatingMinutes: 30, totalPresence: 9 * 60 },
            tuesday: { workMinutes: 8.5 * 60, eatingMinutes: 30, totalPresence: 9 * 60 },
            wednesday: { workMinutes: 8.5 * 60, eatingMinutes: 30, totalPresence: 9 * 60 },
            thursday: { workMinutes: 8.5 * 60, eatingMinutes: 30, totalPresence: 9 * 60 },
            friday: { workMinutes: 6 * 60, eatingMinutes: 0, totalPresence: 6 * 60 }
        }
    },
    'standard': {
        name: 'Standard Schedule',
        description: '8h work + 30min eating Mon-Fri',
        schedule: {
            monday: { workMinutes: 8 * 60, eatingMinutes: 30, totalPresence: 8.5 * 60 },
            tuesday: { workMinutes: 8 * 60, eatingMinutes: 30, totalPresence: 8.5 * 60 },
            wednesday: { workMinutes: 8 * 60, eatingMinutes: 30, totalPresence: 8.5 * 60 },
            thursday: { workMinutes: 8 * 60, eatingMinutes: 30, totalPresence: 8.5 * 60 },
            friday: { workMinutes: 8 * 60, eatingMinutes: 30, totalPresence: 8.5 * 60 }
        }
    },
    'intensive': {
        name: 'Intensive Schedule (August)',
        description: '6h30min work + 30min eating Mon-Fri',
        schedule: {
            monday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
            tuesday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
            wednesday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
            thursday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
            friday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 }
        }
    }
};

/**
 * User Preferences Configuration
 * Default working hours set for different users
 */
const USER_PREFERENCES = {
    default: {
        workingHoursSet: 'common',
        autoDetectIntensive: true, // Automatically use intensive in August
        timezone: 'Europe/Madrid'
    }
};

/**
 * Working Hours Manager Class
 */
class WorkingHoursManager {
    constructor(userConfig = {}) {
        this.userConfig = { ...USER_PREFERENCES.default, ...userConfig };
    }

    /**
     * Get the current day name in lowercase
     */
    getCurrentDay(date = new Date()) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }

    /**
     * Check if current month is August (intensive schedule)
     */
    isIntensiveMonth(date = new Date()) {
        return date.getMonth() === 7; // August is month 7 (0-indexed)
    }

    /**
     * Get the appropriate working hours set for the current date
     */
    getCurrentWorkingHoursSet(date = new Date()) {
        let setName = this.userConfig.workingHoursSet;
        
        // Auto-detect intensive schedule in August
        if (this.userConfig.autoDetectIntensive && this.isIntensiveMonth(date)) {
            setName = 'intensive';
        }
        
        return WORKING_HOURS_SETS[setName];
    }

    /**
     * Get working hours for a specific day
     */
    getDayWorkingHours(date = new Date()) {
        const day = this.getCurrentDay(date);
        const workingSet = this.getCurrentWorkingHoursSet(date);
        
        if (!workingSet.schedule[day]) {
            throw new Error(`No working hours defined for ${day}`);
        }
        
        return {
            day,
            setName: workingSet.name,
            ...workingSet.schedule[day]
        };
    }

    /**
     * Calculate theoretical exit time given entry time
     */
    calculateTheoreticalExit(entryTime, date = new Date()) {
        const dayHours = this.getDayWorkingHours(date);
        
        // Parse entry time (HH:MM or HH:MM:SS)
        const entryMinutes = this.parseTimeToMinutes(entryTime);
        
        // Calculate exit time based on total presence required
        const exitMinutes = entryMinutes + dayHours.totalPresence;
        
        return {
            exitTime: this.formatMinutesToTime(exitMinutes),
            entryTime: entryTime,
            totalPresenceMinutes: dayHours.totalPresence,
            workMinutes: dayHours.workMinutes,
            eatingMinutes: dayHours.eatingMinutes,
            day: dayHours.day,
            setName: dayHours.setName
        };
    }

    /**
     * Parse time string to minutes since midnight
     */
    parseTimeToMinutes(timeStr) {
        if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
        const parts = timeStr.split(':').map(Number);
        const hours = parts[0] || 0;
        const minutes = parts[1] || 0;
        return hours * 60 + minutes;
    }

    /**
     * Format minutes since midnight to HH:MM
     */
    formatMinutesToTime(minutes) {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes < 0 ? '-' : '';
        
        // Handle day overflow
        const finalHours = hours % 24;
        
        return `${sign}${finalHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Get all available working hours sets
     */
    getAvailableWorkingHoursSets() {
        return Object.keys(WORKING_HOURS_SETS).map(key => ({
            id: key,
            name: WORKING_HOURS_SETS[key].name,
            description: WORKING_HOURS_SETS[key].description
        }));
    }

    /**
     * Update user preferences
     */
    updateUserConfig(newConfig) {
        this.userConfig = { ...this.userConfig, ...newConfig };
    }
}

module.exports = {
    WorkingHoursManager,
    WORKING_HOURS_SETS,
    USER_PREFERENCES
};
