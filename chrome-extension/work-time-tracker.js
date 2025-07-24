// Core data fetching module for work time tracking
// Works independently without browser extensions

class WorkTimeTracker {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || 'https://cuco360.cucorent.com';
        this.requiredPresenceMinutes = config.requiredPresenceMinutes || 8.5 * 60;
        this.totalWorkdayMinutes = config.totalWorkdayMinutes || 9 * 60;
        this.credentials = config.credentials || {};
    }

    // Parse time strings (HH:MM format)
    parseTimeToMinutes(timeStr) {
        if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Format minutes to HH:MM
    formatMinutesToTime(minutes) {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes < 0 ? '-' : '';
        return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    // Parse timestamps from detail column
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

    // Get today's date range for API request
    getTodayDateRange() {
        const today = new Date();
        const todayStr = today.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        
        return `${todayStr} 00:00 - ${todayStr} 23:59`;
    }

    // Fetch work time data from API
    async fetchWorkTimeData(credentials) {
        const dateRange = this.getTodayDateRange();
        
        const requestBody = new URLSearchParams({
            '_token': credentials.token,
            'cod_cliente': credentials.clientCode || '',
            'rango': dateRange,
            'order': 'nom_empleado',
            'type': 'empleado',
            'document': 'pantalla',
            'orientation': 'v'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': '*/*',
            'Origin': this.baseUrl,
            'Referer': `${this.baseUrl}/face2face`
        };

        if (credentials.cookies) {
            headers['Cookie'] = credentials.cookies;
        }

        try {
            const response = await fetch(`${this.baseUrl}/face2face/f2ffilter`, {
                method: 'POST',
                headers: headers,
                body: requestBody
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const htmlContent = await response.text();
            return this.parseWorkTimeFromHTML(htmlContent);
        } catch (error) {
            console.error('Error fetching work time data:', error);
            throw error;
        }
    }

    // Parse work time data from HTML response
    parseWorkTimeFromHTML(htmlContent) {
        const today = new Date();
        const todayStr = today.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });

        // Create a temporary DOM parser for Node.js or browser
        let doc;
        if (typeof document !== 'undefined') {
            // Browser environment
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            doc = tempDiv;
        } else if (typeof require !== 'undefined') {
            // Node.js environment
            const { JSDOM } = require('jsdom');
            const dom = new JSDOM(htmlContent);
            doc = dom.window.document;
        } else {
            // Fallback: regex parsing
            return this.parseWorkTimeFromHTMLRegex(htmlContent, todayStr);
        }

        const rows = doc.querySelectorAll('tr');
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 11) {
                const dateCell = cells[0]?.textContent?.trim();
                if (dateCell === todayStr) {
                    const presenceTime = cells[6]?.textContent?.trim();
                    const detailCell = cells[10]?.textContent?.trim();
                    
                    const timestamps = this.parseTimestamps(detailCell);
                    
                    return {
                        date: dateCell,
                        presence: presenceTime,
                        entries: timestamps.entries,
                        exits: timestamps.exits,
                        rawDetail: detailCell
                    };
                }
            }
        }

        return null;
    }

    // Fallback regex parsing for environments without DOM
    parseWorkTimeFromHTMLRegex(htmlContent, todayStr) {
        const todayRowRegex = new RegExp(
            `<td class="column1">${todayStr.replace(/\//g, '\\/')}</td>[\\s\\S]*?<\\/tr>`,
            'i'
        );
        
        const match = htmlContent.match(todayRowRegex);
        if (!match) return null;

        const rowHTML = match[0];
        
        // Extract presence time (column 7)
        const presenceMatch = rowHTML.match(/<td class="column6">([^<]*)<\/td>/g);
        const presenceTime = presenceMatch && presenceMatch[2] ? 
            presenceMatch[2].replace(/<[^>]*>/g, '').trim() : '0';

        // Extract detail timestamps (column 11)
        const detailMatch = rowHTML.match(/<td class="column5">\s*([^<]*(?:<[^>]*>[^<]*)*)\s*<\/td>/);
        const detailCell = detailMatch ? detailMatch[1].replace(/<[^>]*>/g, '').trim() : '';

        const timestamps = this.parseTimestamps(detailCell);

        return {
            date: todayStr,
            presence: presenceTime,
            entries: timestamps.entries,
            exits: timestamps.exits,
            rawDetail: detailCell
        };
    }

    // Calculate remaining work time
    calculateRemainingTime(data) {
        if (!data || !data.entries || data.entries.length === 0) {
            return {
                remainingPresence: this.requiredPresenceMinutes,
                remainingFromEntry: this.totalWorkdayMinutes,
                canLeaveAt: '--:--',
                status: 'No entry time found for today',
                totalPresence: 0,
                entryTime: '--:--',
                exitTime: '--:--',
                workStatus: 'not_working' // not_working, working, can_leave
            };
        }

        const firstEntry = data.entries[0];
        const lastExit = data.exits.length > 0 ? data.exits[data.exits.length - 1] : null;

        // Calculate current presence time
        let currentPresenceMinutes = 0;
        if (data.presence && data.presence !== '0') {
            currentPresenceMinutes = this.parseTimeToMinutes(data.presence);
        } else {
            // Calculate based on entries and exits
            const currentTime = new Date();
            const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
            
            for (let i = 0; i < data.entries.length; i++) {
                const entryMinutes = this.parseTimeToMinutes(data.entries[i]);
                const exitMinutes = i < data.exits.length ? 
                    this.parseTimeToMinutes(data.exits[i]) : currentMinutes;
                
                if (exitMinutes > entryMinutes) {
                    currentPresenceMinutes += (exitMinutes - entryMinutes);
                }
            }
        }

        // Calculate remaining times
        const remainingPresence = Math.max(0, this.requiredPresenceMinutes - currentPresenceMinutes);
        
        const entryMinutes = this.parseTimeToMinutes(firstEntry);
        const currentTime = new Date();
        const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const timeFromEntry = currentTimeMinutes - entryMinutes;
        const remainingFromEntry = Math.max(0, this.totalWorkdayMinutes - timeFromEntry);

        // Calculate when you can leave
        let canLeaveMinutes;
        if (remainingPresence <= 0 && remainingFromEntry <= 0) {
            canLeaveMinutes = currentTimeMinutes;
        } else {
            const leaveByPresence = currentTimeMinutes + remainingPresence;
            const leaveByEntry = entryMinutes + this.totalWorkdayMinutes;
            canLeaveMinutes = Math.max(leaveByPresence, leaveByEntry);
        }

        // Handle overflow to next day
        if (canLeaveMinutes >= 24 * 60) {
            canLeaveMinutes = canLeaveMinutes % (24 * 60);
        }

        const canLeaveHours = Math.floor(canLeaveMinutes / 60);
        const canLeaveMins = canLeaveMinutes % 60;
        const canLeaveAt = `${canLeaveHours.toString().padStart(2, '0')}:${canLeaveMins.toString().padStart(2, '0')}`;

        // Determine work status
        let workStatus = 'working';
        let status = 'Working';
        
        if (remainingPresence <= 0 && remainingFromEntry <= 0) {
            status = 'Can leave now! ✅';
            workStatus = 'can_leave';
        } else if (lastExit && data.entries.length === data.exits.length) {
            status = 'Currently out of office';
            workStatus = 'out_of_office';
        }

        // Check if exactly 9h from entry
        const exactNineHours = timeFromEntry >= this.totalWorkdayMinutes && 
                              timeFromEntry < this.totalWorkdayMinutes + 5; // 5 minute window

        return {
            remainingPresence,
            remainingFromEntry,
            canLeaveAt,
            status,
            totalPresence: currentPresenceMinutes,
            entryTime: firstEntry,
            exitTime: lastExit || '--:--',
            workStatus,
            exactNineHours
        };
    }

    // Main method to get current work status
    async getWorkStatus(credentials) {
        try {
            const workData = await this.fetchWorkTimeData(credentials);
            if (workData) {
                return this.calculateRemainingTime(workData);
            }
            return null;
        } catch (error) {
            console.error('Error getting work status:', error);
            throw error;
        }
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkTimeTracker;
} else if (typeof window !== 'undefined') {
    window.WorkTimeTracker = WorkTimeTracker;
}
