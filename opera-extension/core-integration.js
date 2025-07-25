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
            'cod_cliente': this.credentials.clientCode || '',
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
     * Calculate current presence minutes (actual time in office, excluding breaks)
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

            // Process each entry-exit cycle
            for (let i = 0; i < workData.entries.length; i++) {
                const entryMinutes = this.parseTimeToMinutes(workData.entries[i]);
                
                let exitMinutes;
                if (i < workData.exits.length) {
                    // Use actual exit time
                    exitMinutes = this.parseTimeToMinutes(workData.exits[i]);
                } else {
                    // Person is currently inside, use current time
                    exitMinutes = currentMinutes;
                }
                
                // Add this period to total presence time
                const periodMinutes = exitMinutes - entryMinutes;
                if (periodMinutes > 0) {
                    totalPresenceMinutes += periodMinutes;
                }
            }

            return Math.max(0, totalPresenceMinutes);
        } catch (error) {
            if (error.message === 'CREDENTIALS_EXPIRED') {
                throw error;
            }
            console.error('Error calculating presence minutes:', error);
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
                presenceMinutes,
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
    async setCredentials(token, cookies, clientCode = null) {
        // If no client code provided, try to extract from current credentials
        if (!clientCode) {
            clientCode = this.credentials?.clientCode;
        }
        
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
            console.log('🔧 DEBUG: getDebugWorkStatus called with data:', customMarcajesData);
            
            // Parse debug data using the same function as popup
            const debugData = this.convertCustomMarcajesToJSON(customMarcajesData);
            console.log('🔧 DEBUG: Parsed debug data:', debugData);
            
            if (!debugData || !debugData.entries || debugData.entries.length === 0) {
                console.log('🔧 DEBUG: No entries found, returning NOT_WORKING');
                return {
                    status: 'NOT_WORKING',
                    workingMinutes: debugData.workingMinutes || 0,
                    workingSeconds: (debugData.workingMinutes || 0) * 60,
                    presenceMinutes: debugData.presenceMinutes || 0,
                    remainingMinutes: 0,
                    theoreticalExit: 'N/A',
                    message: '🐛 Debug mode<br>No entry detected',
                    color: 'gray'
                };
            }

            const workingMinutes = debugData.workingMinutes || 0;
            const presenceMinutes = debugData.presenceMinutes || 0;
            const workingSeconds = workingMinutes * 60;
            
            console.log('🔧 DEBUG: Working time calculations:', {
                workingMinutes,
                presenceMinutes,
                workingSeconds
            });
            
            // Get expected working minutes for today
            const today = new Date();
            const dayWorkingHours = this.getDayWorkingHours(today);
            const expectedMinutes = dayWorkingHours.workMinutes;
            
            console.log('🔧 DEBUG: Working hours configuration:', {
                today: today.toDateString(),
                dayName: dayWorkingHours.day,
                setName: dayWorkingHours.setName,
                expectedMinutes: expectedMinutes,
                workingHoursSet: this.workingHoursSet
            });
            
            const remainingMinutes = Math.max(0, expectedMinutes - presenceMinutes);
            
            console.log('🔧 DEBUG: Remaining calculation:', {
                expectedMinutes,
                presenceMinutes,
                workingMinutes,
                remainingMinutes
            });
            
            // Determine status based on working state and completion
            let status, color, message;
            
            // Check if currently in office: more entries than exits means currently working
            const currentlyInOffice = debugData.entries.length > debugData.exits.length;
            
            // Check if theoretical exit time has passed
            let theoreticalExitPassed = false;
            if (debugData.entries.length > 0) {
                const firstEntry = debugData.entries[0];
                const theoreticalExitCalc = this.calculateTheoreticalExit(firstEntry);
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const theoreticalExitMinutes = this.parseTimeToMinutes(theoreticalExitCalc.exitTime);
                theoreticalExitPassed = currentMinutes > theoreticalExitMinutes;
            }
            
            // Check for user override (semaphore clicked to skip "Time to leave")
            const storage = await chrome.storage.local.get(['timeToLeaveOverride', 'overrideDate', 'timeToLeaveFirstShown', 'firstShownDate']);
            const todayStr = new Date().toDateString();
            const hasOverride = storage.timeToLeaveOverride && storage.overrideDate === todayStr;
            
            // Check if 5 minutes have passed since first "Time to leave" notification
            let autoTransitionToCanLeave = false;
            if (storage.timeToLeaveFirstShown && storage.firstShownDate === todayStr) {
                const now = new Date();
                const firstShownTime = new Date(storage.timeToLeaveFirstShown);
                const minutesElapsed = (now - firstShownTime) / (1000 * 60);
                autoTransitionToCanLeave = minutesElapsed >= 5;
            }
            
            console.log('🔧 DEBUG: Status determination:', {
                entriesCount: debugData.entries.length,
                exitsCount: debugData.exits.length,
                currentlyInOffice,
                remainingMinutes,
                theoreticalExitPassed,
                hasOverride,
                autoTransitionToCanLeave,
                firstShownTime: storage.timeToLeaveFirstShown
            });
            
            if (theoreticalExitPassed && !currentlyInOffice) {
                // Work shift ended (theoretical exit passed and not in office)
                status = 'WORK_SHIFT_ENDED';
                color = 'green';
                message = `🐛 Debug mode<br>Work shift ended`;
                console.log('🔧 DEBUG: Work shift ended status:', { status, color, message });
            } else if (currentlyInOffice) {
                // Currently working - check for overtime and adjust thresholds
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                let overtimeMinutes = 0;
                
                // Calculate overtime if presence requirement is met
                if (remainingMinutes <= 0) {
                    overtimeMinutes = Math.abs(remainingMinutes);
                }
                
                if (remainingMinutes <= -5) {
                    // More than 5 minutes overtime - can leave now
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = `🐛 Debug mode<br>Can leave now (${overtimeMinutes}min overtime)`;
                } else if (remainingMinutes <= 0 && !hasOverride && !autoTransitionToCanLeave) {
                    // 0-5 minutes overtime - time to leave (blinking), unless overridden or auto-transitioned
                    status = 'TIME_TO_LEAVE';
                    color = 'white-blinking';
                    message = `🐛 Debug mode<br>Time to leave!`;
                    
                    // Record first time "Time to leave" appears today
                    if (!storage.timeToLeaveFirstShown || storage.firstShownDate !== todayStr) {
                        await chrome.storage.local.set({
                            timeToLeaveFirstShown: new Date().toISOString(),
                            firstShownDate: todayStr
                        });
                        console.log('🔧 DEBUG: First "Time to leave" notification recorded');
                    }
                } else if ((remainingMinutes <= 0 && hasOverride) || autoTransitionToCanLeave) {
                    // Override active or 5 minutes elapsed - show can leave instead of time to leave
                    status = 'CAN_LEAVE';
                    color = 'green';
                    const reason = hasOverride ? 'confirmed' : '5min elapsed';
                    message = `🐛 Debug mode<br>Can leave now (${reason})`;
                } else if (remainingMinutes <= 5) {
                    // 5 minutes or less remaining - prepare to leave (green)
                    status = 'PREPARE_TO_LEAVE';
                    color = 'green';
                    message = `🐛 Debug mode<br>Prepare to leave (${remainingMinutes}min remaining)`;
                } else {
                    // More than 2 minutes remaining - working
                    status = 'WORKING';
                    color = 'blue';
                    message = `🐛 Debug mode<br>Working (${this.formatMinutesToTime(remainingMinutes)} remaining)`;
                }
                console.log('🔧 DEBUG: Currently in office status:', { status, color, message, overtimeMinutes });
            } else {
                // Currently out of office (equal entries and exits)
                if (remainingMinutes === 0) {
                    status = 'CAN_LEAVE';
                    color = 'green';
                    message = `🐛 Debug mode<br>Can leave (requirements completed)`;
                } else {
                    status = 'OUT_OF_OFFICE';
                    color = 'yellow';
                    message = `🐛 Debug mode<br>Out of office (${this.formatMinutesToTime(remainingMinutes)} remaining)`;
                }
                console.log('🔧 DEBUG: Currently out of office status:', { status, color, message });
            }

            // Calculate theoretical exit time based on first entry
            let theoreticalExit = 'N/A';
            if (debugData.entries.length > 0) {
                const firstEntry = debugData.entries[0];
                const theoreticalExitCalc = this.calculateTheoreticalExit(firstEntry);
                theoreticalExit = theoreticalExitCalc.exitTime;
                console.log('🔧 DEBUG: Theoretical exit calculation:', {
                    firstEntry,
                    theoreticalExit,
                    calculation: theoreticalExitCalc
                });
            }

            const finalResult = {
                status,
                workingMinutes,
                workingSeconds,
                presenceMinutes,
                remainingMinutes,
                theoreticalExit,
                message,
                color
            };
            
            console.log('🔧 DEBUG: Final debug work status result:', finalResult);
            return finalResult;

        } catch (error) {
            console.error('🔧 DEBUG: Error in getDebugWorkStatus:', error);
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
     * Convert custom marcajes data to JSON format with robust consecutive E/S handling
     */
    convertCustomMarcajesToJSON(customMarcajesData) {
        if (!customMarcajesData || customMarcajesData.trim() === '') {
            throw new Error('No custom marcajes data provided');
        }

        console.log('🔧 DEBUG: convertCustomMarcajesToJSON called with:', customMarcajesData.substring(0, 100) + '...');

        // Try to parse as JSON first
        try {
            const jsonResult = JSON.parse(customMarcajesData);
            console.log('🔧 DEBUG: Successfully parsed as JSON:', jsonResult);
            return jsonResult;
        } catch (e) {
            console.log('🔧 DEBUG: Not JSON, parsing as timestamp format');
            // If JSON parsing fails, try timestamp format parsing
        }

        // Parse timestamp format with consecutive E/S collapsing: "09:20:08 E 000 | 09:29:03 S 000 | ..."
        const timestamps = customMarcajesData.split('|').map(t => t.trim()).filter(t => t);
        const timeEntries = [];
        
        console.log('🔧 DEBUG: Split timestamps:', timestamps);
        
        // First pass: extract all timestamps chronologically
        for (const timestamp of timestamps) {
            const match = timestamp.match(/(\d{2}:\d{2}:\d{2})\s+([ES])/);
            if (match) {
                const time = match[1].substring(0, 5); // Remove seconds, keep HH:MM
                const type = match[2];
                
                timeEntries.push({
                    time: time,
                    type: type,
                    timeInMinutes: this.parseTimeToMinutes(time)
                });
            }
        }
        
        console.log('🔧 DEBUG: Extracted time entries:', timeEntries);
        
        if (timeEntries.length === 0) {
            throw new Error('No valid timestamps found in custom marcajes data');
        }
        
        // Sort by time to ensure chronological order
        timeEntries.sort((a, b) => a.timeInMinutes - b.timeInMinutes);
        
        console.log('🔧 DEBUG: Sorted time entries:', timeEntries);
        
        // Second pass: collapse only truly consecutive entries/exits (same type in a row)
        const finalEntries = [];
        const finalExits = [];
        
        let lastType = null;
        
        for (const entry of timeEntries) {
            if (entry.type === 'E') {
                if (lastType !== 'E') {
                    // Not consecutive, add this entry
                    finalEntries.push(entry.time);
                } else {
                    // Consecutive entry, replace the last one with this later time
                    finalEntries[finalEntries.length - 1] = entry.time;
                }
                lastType = 'E';
            } else if (entry.type === 'S') {
                if (lastType !== 'S') {
                    // Not consecutive, add this exit
                    finalExits.push(entry.time);
                } else {
                    // Consecutive exit, replace the last one with this later time
                    finalExits[finalExits.length - 1] = entry.time;
                }
                lastType = 'S';
            }
        }

        console.log('🔧 DEBUG: Final collapsed entries:', finalEntries);
        console.log('🔧 DEBUG: Final collapsed exits:', finalExits);

        // Calculate working and presence minutes
        let workingMinutes = 0;
        let presenceMinutes = 0;

        console.log('🔧 DEBUG: Starting working time calculation...');

        // Simple calculation: if we have entries and exits, calculate the difference
        if (finalEntries.length > 0) {
            const firstEntry = this.parseTimeToMinutes(finalEntries[0]);
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            console.log('🔧 DEBUG: Time calculation context:', {
                firstEntry: finalEntries[0],
                firstEntryMinutes: firstEntry,
                currentTime: `${now.getHours()}:${now.getMinutes()}`,
                currentMinutes: currentMinutes,
                entriesCount: finalEntries.length,
                exitsCount: finalExits.length
            });
            
            // Working Time = Total time from first entry to current time (or last exit if finished)
            const firstEntryMinutes = this.parseTimeToMinutes(finalEntries[0]);
            
            if (finalExits.length > 0 && finalEntries.length === finalExits.length) {
                // All periods completed
                console.log('🔧 DEBUG: All periods completed, calculating times...');
                
                // Working Time = from first entry to last exit (total timespan)
                const lastExitMinutes = this.parseTimeToMinutes(finalExits[finalExits.length - 1]);
                workingMinutes = lastExitMinutes - firstEntryMinutes;
                console.log(`🔧 DEBUG: Working time (total timespan): ${finalEntries[0]} to ${finalExits[finalExits.length - 1]} = ${workingMinutes} minutes`);
                
                // Presence Time = sum of actual working periods (excluding breaks)
                for (let i = 0; i < finalEntries.length; i++) {
                    const entryMinutes = this.parseTimeToMinutes(finalEntries[i]);
                    const exitMinutes = this.parseTimeToMinutes(finalExits[i]);
                    const periodMinutes = exitMinutes - entryMinutes;
                    presenceMinutes += periodMinutes;
                    console.log(`🔧 DEBUG: Presence period ${i + 1}: ${finalEntries[i]} to ${finalExits[i]} = ${periodMinutes} minutes`);
                }
            } else {
                // Currently working
                console.log('🔧 DEBUG: Currently working, calculating times...');
                
                // Working Time = from first entry to current time (total timespan)
                workingMinutes = currentMinutes - firstEntryMinutes;
                console.log(`🔧 DEBUG: Working time (total timespan): ${finalEntries[0]} to current time = ${workingMinutes} minutes`);
                
                // Presence Time = sum of completed periods + current working period
                const completedPairs = Math.min(finalEntries.length, finalExits.length);
                for (let i = 0; i < completedPairs; i++) {
                    const entryMinutes = this.parseTimeToMinutes(finalEntries[i]);
                    const exitMinutes = this.parseTimeToMinutes(finalExits[i]);
                    const periodMinutes = exitMinutes - entryMinutes;
                    presenceMinutes += periodMinutes;
                    console.log(`🔧 DEBUG: Completed presence period ${i + 1}: ${finalEntries[i]} to ${finalExits[i]} = ${periodMinutes} minutes`);
                }
                
                // Add current working period if still in office
                if (finalEntries.length > finalExits.length) {
                    const lastEntryMinutes = this.parseTimeToMinutes(finalEntries[finalEntries.length - 1]);
                    const currentPeriodMinutes = currentMinutes - lastEntryMinutes;
                    presenceMinutes += currentPeriodMinutes;
                    console.log(`🔧 DEBUG: Current presence period: ${finalEntries[finalEntries.length - 1]} to current time = ${currentPeriodMinutes} minutes`);
                }
            }
        }

        console.log('🔧 DEBUG: Final working time calculation:', {
            workingMinutes: Math.max(0, Math.round(workingMinutes)),
            presenceMinutes: Math.max(0, Math.round(presenceMinutes))
        });

        console.log('🔧 DEBUG: Core parsed timestamps - Final entries:', finalEntries.length, 'Final exits:', finalExits.length);

        const result = {
            entries: finalEntries,
            exits: finalExits,
            workingMinutes: Math.max(0, Math.round(workingMinutes)),
            presenceMinutes: Math.max(0, Math.round(presenceMinutes))
        };
        
        console.log('🔧 DEBUG: convertCustomMarcajesToJSON final result:', result);
        return result;
    }
}

// Make available globally for extension scripts
if (typeof window !== 'undefined') {
    window.CoreIntegration = CoreIntegration;
}
