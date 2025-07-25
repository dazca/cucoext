/**
 * Core Integration for Chrome Extension
 * Provides access to all core functionality from the extension environment
 */

class CoreIntegration {
    constructor() {
        this.baseUrl = 'https://cuco360.cucorent.com';
        this.credentials = null;
        
        // Initialize debug utils
        this.debug = {
            log: (...args) => {
                // Try to get debug setting from storage synchronously if possible
                chrome.storage.local.get(['debugLogsEnabled']).then(result => {
                    if (result.debugLogsEnabled) {
                        console.log(...args);
                    }
                }).catch(() => {
                    // Default to no logging if can't access storage
                });
            },
            error: (...args) => console.error(...args), // Always show errors
            warn: (...args) => {
                chrome.storage.local.get(['debugLogsEnabled']).then(result => {
                    if (result.debugLogsEnabled) {
                        console.warn(...args);
                    }
                }).catch(() => {});
            }
        };
        this.workingHoursConfig = {
            'common': {
                name: 'Common Schedule',
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
                schedule: {
                    monday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
                    tuesday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
                    wednesday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
                    thursday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 },
                    friday: { workMinutes: 6.5 * 60, eatingMinutes: 30, totalPresence: 7 * 60 }
                }
            }
        };
        this.loadSettings();
    }

    /**
     * Load settings from extension storage
     */
    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['credentials', 'workingHoursSet', 'autoDetectIntensive']);
            
            this.debug.log('📥 Loading settings from storage:', {
                hasCredentials: !!result.credentials,
                credentialsKeys: result.credentials ? Object.keys(result.credentials) : [],
                workingHoursSet: result.workingHoursSet,
                autoDetectIntensive: result.autoDetectIntensive
            });
            
            // CRITICAL: Set credentials directly from storage
            this.credentials = result.credentials || null;
            this.workingHoursSet = result.workingHoursSet || 'common';
            this.autoDetectIntensive = result.autoDetectIntensive !== false; // default true
            
            if (this.credentials) {
                this.debug.log('✅ Credentials loaded successfully:', {
                    hasToken: !!this.credentials.token,
                    hasCookies: !!this.credentials.cookies,
                    clientCode: this.credentials.clientCode,
                    extractedAt: this.credentials.extractedAt
                });
            } else {
                console.log('⚠️ No credentials found in storage');
            }
            
            return this.credentials;
            
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            return null;
        }
    }

    /**
     * Save settings to extension storage
     */
    async saveSettings() {
        try {
            await chrome.storage.local.set({
                credentials: this.credentials,
                workingHoursSet: this.workingHoursSet,
                autoDetectIntensive: this.autoDetectIntensive
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Get current day name
     */
    getCurrentDay(date = new Date()) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }

    /**
     * Check if current month is August
     */
    isIntensiveMonth(date = new Date()) {
        return date.getMonth() === 7; // August is month 7 (0-indexed)
    }

    /**
     * Get appropriate working hours set for current date
     */
    getCurrentWorkingHoursSet(date = new Date()) {
        let setName = this.workingHoursSet;
        
        if (this.autoDetectIntensive && this.isIntensiveMonth(date)) {
            setName = 'intensive';
        }
        
        return this.workingHoursConfig[setName];
    }

    /**
     * Get working hours for specific day
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
     * Parse time string to minutes
     */
    parseTimeToMinutes(timeStr) {
        if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
        const parts = timeStr.split(':').map(Number);
        const hours = parts[0] || 0;
        const minutes = parts[1] || 0;
        return hours * 60 + minutes;
    }

    /**
     * Format minutes to HH:MM
     */
    formatMinutesToTime(minutes) {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes < 0 ? '-' : '';
        const finalHours = hours % 24;
        return `${sign}${finalHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Get today's date range for API
     */
    getTodayDateRange() {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        return `${dateStr} - ${dateStr}`;
    }

    /**
     * Parse timestamps from detail column
     */
    parseTimestamps(detailStr) {
        if (!detailStr) return { entries: [], exits: [] };
        
        const entries = [];
        const exits = [];
        
        const timestamps = detailStr.split('|').map(t => t.trim()).filter(t => t);
        
        for (const timestamp of timestamps) {
            const match = timestamp.match(/(\d{2}:\d{2}:\d{2})\s+([ES])/);
            if (match) {
                const time = match[1].substring(0, 5); // Remove seconds, keep HH:MM
                const type = match[2];
                
                if (type === 'E') {
                    entries.push(time);
                } else if (type === 'S') {
                    exits.push(time);
                }
            }
        }
        
        return { entries, exits };
    }

    /**
     * Parse work time from HTML using regex
     */
    parseWorkTimeFromHTML(htmlContent) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

        const todayRowRegex = new RegExp(
            `<td class="column1">${todayStr.replace(/\//g, '\\/')}</td>[\\s\\S]*?<\\/tr>`,
            'i'
        );
        
        const match = htmlContent.match(todayRowRegex);
        if (!match) return null;

        const rowHTML = match[0];
        
        // Extract detail timestamps (column5)
        const detailMatch = rowHTML.match(/<td class="column5">\s*([^<]*(?:<[^>]*>[^<]*)*)\s*<\/td>/);
        const detailCell = detailMatch ? detailMatch[1].replace(/<[^>]*>/g, '').trim() : '';

        const timestamps = this.parseTimestamps(detailCell);

        return {
            date: todayStr,
            entries: timestamps.entries,
            exits: timestamps.exits,
            rawDetail: detailCell
        };
    }

    /**
     * Fetch work time data from API
     */
    async fetchWorkTimeData() {
        if (!this.credentials) {
            console.error('🔴 No credentials object available');
            throw new Error('No valid credentials available');
        }
        
        if (!this.credentials.token) {
            console.error('🔴 No token in credentials:', this.credentials);
            throw new Error('No valid credentials available');
        }
        
        if (!this.credentials.cookies) {
            console.error('🔴 No cookies in credentials:', this.credentials);
            throw new Error('No valid credentials available');
        }
        
        this.debug.log('📡 Fetching work time data with credentials:', {
            hasToken: !!this.credentials.token,
            tokenLength: this.credentials.token ? this.credentials.token.length : 0,
            hasCookies: !!this.credentials.cookies,
            cookiesLength: this.credentials.cookies ? this.credentials.cookies.length : 0,
            clientCode: this.credentials.clientCode
        });

        const dateRange = this.getTodayDateRange();
        
        const requestBody = new URLSearchParams({
            '_token': this.credentials.token,
            'cod_cliente': this.credentials.clientCode || '947',
            'rango': dateRange,
            'order': 'nom_empleado',
            'type': 'empleado',
            'document': 'pantalla',
            'orientation': 'v'
        });

        const response = await fetch(`${this.baseUrl}/face2face/f2ffilter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
                'Origin': this.baseUrl,
                'Referer': `${this.baseUrl}/face2face`,
                'Cookie': this.credentials.cookies
            },
            body: requestBody.toString()
        });

        if (response.status === 419) {
            throw new Error('CREDENTIALS_EXPIRED');
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const htmlContent = await response.text();
        return this.parseWorkTimeFromHTML(htmlContent);
    }

    /**
     * Calculate current working minutes
     */
    async getCurrentWorkingMinutes() {
        try {
            const workData = await this.fetchWorkTimeData();
            
            if (!workData || !workData.entries || workData.entries.length === 0) {
                return 0;
            }

            const firstEntry = workData.entries[0];
            const entryMinutes = this.parseTimeToMinutes(firstEntry);
            
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            // If person has exited, use last exit time instead of current time
            let workingMinutes;
            if (workData.exits.length > 0 && workData.entries.length === workData.exits.length) {
                const lastExit = workData.exits[workData.exits.length - 1];
                const exitMinutes = this.parseTimeToMinutes(lastExit);
                workingMinutes = exitMinutes - entryMinutes;
            } else {
                workingMinutes = currentMinutes - entryMinutes;
            }

            return Math.max(0, workingMinutes);
        } catch (error) {
            if (error.message === 'CREDENTIALS_EXPIRED') {
                throw error;
            }
            console.error('Error getting working minutes:', error);
            return 0;
        }
    }

    /**
     * Calculate current presence minutes (time actually inside the office, excluding breaks)
     */
    async getCurrentPresenceMinutes() {
        try {
            const workData = await this.fetchWorkTimeData();
            
            if (!workData || !workData.entries || workData.entries.length === 0) {
                return 0;
            }

            let totalPresenceMinutes = 0;
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // Calculate presence time by summing all entry-exit periods
            for (let i = 0; i < workData.entries.length; i++) {
                const entryTime = this.parseTimeToMinutes(workData.entries[i]);
                let exitTime;

                if (i < workData.exits.length) {
                    // There's a corresponding exit
                    exitTime = this.parseTimeToMinutes(workData.exits[i]);
                } else {
                    // No exit yet, person is still inside - use current time
                    exitTime = currentMinutes;
                }

                // Add this presence period
                totalPresenceMinutes += Math.max(0, exitTime - entryTime);
            }

            return totalPresenceMinutes;
        } catch (error) {
            if (error.message === 'CREDENTIALS_EXPIRED') {
                throw error;
            }
            console.error('Error getting presence minutes:', error);
            return 0;
        }
    }

    /**
     * Calculate current working seconds for real-time display
     */
    async getCurrentWorkingSeconds() {
        try {
            const workData = await this.fetchWorkTimeData();
            
            if (!workData || !workData.entries || workData.entries.length === 0) {
                return 0;
            }

            const firstEntry = workData.entries[0];
            const entryMinutes = this.parseTimeToMinutes(firstEntry);
            const entrySeconds = entryMinutes * 60; // Convert to seconds
            
            const now = new Date();
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            
            // If person has exited, use last exit time instead of current time
            let workingSeconds;
            if (workData.exits.length > 0 && workData.entries.length === workData.exits.length) {
                const lastExit = workData.exits[workData.exits.length - 1];
                const exitMinutes = this.parseTimeToMinutes(lastExit);
                const exitSeconds = exitMinutes * 60;
                workingSeconds = exitSeconds - entrySeconds;
            } else {
                workingSeconds = currentSeconds - entrySeconds;
            }

            return Math.max(0, workingSeconds);
        } catch (error) {
            if (error.message === 'CREDENTIALS_EXPIRED') {
                throw error;
            }
            console.error('Error calculating working seconds:', error);
            return 0;
        }
    }

    /**
     * Calculate theoretical exit time
     */
    calculateTheoreticalExit(entryTime, date = new Date()) {
        const dayHours = this.getDayWorkingHours(date);
        const entryMinutes = this.parseTimeToMinutes(entryTime);
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
     * Get comprehensive work status
     */
    async getWorkStatus(forceRefresh = false) {
        try {
            // Check if debug mode with custom marcajes is active
            const storage = await chrome.storage.local.get(['customMarcajesEnabled', 'customMarcajesData', 'bypassCredentialsEnabled']);
            const customMarcajesEnabled = storage.customMarcajesEnabled;
            const customMarcajesData = storage.customMarcajesData;
            const bypassCredentialsEnabled = storage.bypassCredentialsEnabled;
            
            if (customMarcajesEnabled && customMarcajesData) {
                // Use debug data to calculate status
                return await this.getDebugWorkStatus(customMarcajesData);
            }
            
            // Reload credentials from storage if forced or if not loaded
            if (forceRefresh || !this.credentials) {
                await this.loadSettings();
            }
            
            // If credentials are bypassed in debug mode, return mock status
            if (bypassCredentialsEnabled) {
                return {
                    status: 'NOT_WORKING',
                    workingMinutes: 0,
                    workingSeconds: 0,
                    presenceMinutes: 0,
                    remainingMinutes: 0,
                    theoreticalExit: 'N/A',
                    message: '🐛 Debug mode - Credentials bypassed',
                    color: 'gray'
                };
            }
            
            const workData = await this.fetchWorkTimeData();
            
            if (!workData || !workData.entries || workData.entries.length === 0) {
                return {
                    status: 'NOT_WORKING',
                    workingMinutes: 0,
                    message: 'No entry time detected',
                    color: 'gray'
                };
            }

            const currentMinutes = await this.getCurrentWorkingMinutes();
            const currentSeconds = await this.getCurrentWorkingSeconds();
            const presenceMinutes = await this.getCurrentPresenceMinutes();
            const firstEntry = workData.entries[0];
            const theoreticalExit = this.calculateTheoreticalExit(firstEntry);
            
            const now = new Date();
            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
            const remainingMinutes = Math.max(0, this.parseTimeToMinutes(theoreticalExit.exitTime) - currentTimeMinutes);
            
            // Determine status based on working state and completion
            let status, color, message;
            
            if (workData.exits.length > 0 && workData.entries.length === workData.exits.length) {
                // Currently out of office
                if (remainingMinutes === 0) {
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = 'Can leave - requirements completed';
                } else {
                    status = 'OUT_OF_OFFICE';
                    color = 'yellow';
                    message = `Out of office - ${this.formatMinutesToTime(remainingMinutes)} remaining`;
                }
            } else {
                // Currently working
                if (remainingMinutes === 0) {
                    status = 'TIME_TO_LEAVE';
                    color = 'white-blinking';
                    message = 'Exactly time to leave!';
                } else if (remainingMinutes <= 5) {
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = `Can leave in ${remainingMinutes} minutes`;
                } else {
                    status = 'WORKING';
                    color = 'blue';
                    message = `Working - ${this.formatMinutesToTime(remainingMinutes)} remaining`;
                }
            }

            return {
                status,
                color,
                message,
                workingMinutes: currentMinutes,
                workingSeconds: currentSeconds,
                presenceMinutes: presenceMinutes,
                remainingMinutes,
                theoreticalExit: theoreticalExit.exitTime,
                workData,
                progress: Math.round((currentMinutes / theoreticalExit.totalPresenceMinutes) * 100)
            };
            
        } catch (error) {
            if (error.message === 'CREDENTIALS_EXPIRED') {
                return {
                    status: 'CREDENTIALS_EXPIRED',
                    color: 'red',
                    message: 'Credentials expired - click to refresh',
                    workingMinutes: 0
                };
            }
            
            return {
                status: 'ERROR',
                color: 'red',
                message: `Error: ${error.message}`,
                workingMinutes: 0
            };
        }
    }

    /**
     * Set working hours schedule
     */
    async setWorkingHours(setName) {
        if (!this.workingHoursConfig[setName]) {
            throw new Error(`Unknown working hours set: ${setName}`);
        }
        
        this.workingHoursSet = setName;
        await this.saveSettings();
        return true;
    }

    /**
     * Clear stored credentials
     */
    async clearCredentials() {
        this.credentials = null;
        await chrome.storage.local.remove(['credentials']);
        return true;
    }

    /**
     * Set credentials manually
     */
    async setCredentials(token, cookies, clientCode = '947') {
        this.credentials = {
            token,
            cookies,
            clientCode,
            extractedAt: new Date().toISOString()
        };
        
        // Save to storage immediately
        await chrome.storage.local.set({
            credentials: this.credentials
        });
        
        console.log('🔧 DEBUG: Credentials saved directly to storage');
        
        // Verify storage by reading back
        const verification = await chrome.storage.local.get(['credentials']);
        console.log('🔧 DEBUG: Storage verification - credentials exist:', !!verification.credentials);
        
        // Also save to the main settings
        await this.saveSettings();
        
        console.log('✅ Credentials saved to storage:', {
            hasToken: !!this.credentials.token,
            hasCookies: !!this.credentials.cookies,
            clientCode: this.credentials.clientCode
        });
        
        return true;
    }

    /**
     * Get available working hours sets
     */
    getAvailableWorkingHoursSets() {
        return Object.keys(this.workingHoursConfig).map(key => ({
            id: key,
            name: this.workingHoursConfig[key].name,
            current: key === this.workingHoursSet
        }));
    }

    /**
     * Calculate work status from debug marcajes data
     */
    async getDebugWorkStatus(customMarcajesData) {
        try {
            // Parse debug data using the same function as popup
            const debugData = this.convertCustomMarcajesToJSON(customMarcajesData);
            
            if (!debugData || !debugData.entries || debugData.entries.length === 0) {
                return {
                    status: 'NOT_WORKING',
                    workingMinutes: debugData.workingMinutes || 0,
                    workingSeconds: (debugData.workingMinutes || 0) * 60,
                    presenceMinutes: debugData.presenceMinutes || 0,
                    remainingMinutes: 0,
                    theoreticalExit: 'N/A',
                    message: '🐛 Debug mode - No entry detected',
                    color: 'gray'
                };
            }

            const workingMinutes = debugData.workingMinutes || 0;
            const presenceMinutes = debugData.presenceMinutes || 0;
            const workingSeconds = workingMinutes * 60;
            
            // Get expected working minutes for today
            const today = new Date();
            const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
            const expectedMinutes = this.workingHoursConfig[this.workingHoursSet]?.schedule[dayName]?.workMinutes || 480; // Default 8 hours
            
            const remainingMinutes = Math.max(0, expectedMinutes - workingMinutes);
            
            // Determine status based on working state and completion
            let status, color, message;
            
            if (debugData.exits.length > 0 && debugData.entries.length === debugData.exits.length) {
                // Currently out of office
                if (remainingMinutes === 0) {
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = '🐛 Debug mode - Can leave (requirements completed)';
                } else {
                    status = 'OUT_OF_OFFICE';
                    color = 'yellow';
                    message = `🐛 Debug mode - Out of office (${this.formatMinutesToTime(remainingMinutes)} remaining)`;
                }
            } else {
                // Currently working
                if (remainingMinutes === 0) {
                    status = 'TIME_TO_LEAVE';
                    color = 'white-blinking';
                    message = '🐛 Debug mode - Time to leave!';
                } else if (remainingMinutes <= 5) {
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = `🐛 Debug mode - Can leave in ${remainingMinutes} minutes`;
                } else {
                    status = 'WORKING';
                    color = 'blue';
                    message = `🐛 Debug mode - Working (${this.formatMinutesToTime(remainingMinutes)} remaining)`;
                }
            }

            return {
                status,
                workingMinutes,
                workingSeconds,
                presenceMinutes,
                remainingMinutes,
                theoreticalExit: 'Debug Mode',
                message,
                color
            };

        } catch (error) {
            return {
                status: 'ERROR',
                workingMinutes: 0,
                workingSeconds: 0,
                presenceMinutes: 0,
                remainingMinutes: 0,
                theoreticalExit: 'N/A',
                message: '🐛 Debug mode error: ' + error.message,
                color: 'red'
            };
        }
    }

    /**
     * Convert custom marcajes data to JSON format (similar to popup function)
     */
    convertCustomMarcajesToJSON(customMarcajesData) {
        if (!customMarcajesData || customMarcajesData.trim() === '') {
            throw new Error('No custom marcajes data provided');
        }

        // Try to parse as JSON first
        try {
            return JSON.parse(customMarcajesData);
        } catch (e) {
            // If JSON parsing fails, try timestamp format parsing
        }

        // Parse timestamp format: "09:20:08 E 000 | 09:29:03 S 000 | ..."
        const entries = [];
        const exits = [];
        
        const timestampRegex = /(\d{2}:\d{2}:\d{2})\s+([ES])\s+\d{3}/g;
        let match;
        
        while ((match = timestampRegex.exec(customMarcajesData)) !== null) {
            const [, time, type] = match;
            
            if (type === 'E') {
                entries.push(time);
            } else if (type === 'S') {
                exits.push(time);
            }
        }

        if (entries.length === 0) {
            throw new Error('No valid timestamps found in custom marcajes data');
        }

        // Calculate working and presence minutes
        let workingMinutes = 0;
        let presenceMinutes = 0;

        // Simple calculation: if we have entries and exits, calculate the difference
        if (entries.length > 0) {
            const firstEntry = this.parseTimeToMinutes(entries[0]);
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            if (exits.length > 0 && entries.length === exits.length) {
                // All periods completed
                for (let i = 0; i < entries.length; i++) {
                    const entryMinutes = this.parseTimeToMinutes(entries[i]);
                    const exitMinutes = this.parseTimeToMinutes(exits[i]);
                    workingMinutes += exitMinutes - entryMinutes;
                }
                presenceMinutes = workingMinutes;
            } else {
                // Currently working
                presenceMinutes = currentMinutes - firstEntry;
                workingMinutes = presenceMinutes; // Simplified - no break time calculation
            }
        }

        return {
            entries,
            exits,
            workingMinutes: Math.max(0, Math.round(workingMinutes)),
            presenceMinutes: Math.max(0, Math.round(presenceMinutes))
        };
    }
}

// Make available globally for extension scripts
if (typeof window !== 'undefined') {
    window.CoreIntegration = CoreIntegration;
}
