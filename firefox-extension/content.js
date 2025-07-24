// Content script to extract work time data from the webpage
(function() {
    'use strict';
    
    // Time calculation constants
    const REQUIRED_PRESENCE_MINUTES = 8.5 * 60; // 8h 30min
    const TOTAL_WORKDAY_MINUTES = 9 * 60; // 9h from entry
    
    // Function to parse time strings (HH:MM format)
    function parseTimeToMinutes(timeStr) {
        if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    // Function to format minutes to HH:MM
    function formatMinutesToTime(minutes) {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes < 0 ? '-' : '';
        return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    
    // Function to parse timestamps from detail column
    function parseTimestamps(detailStr) {
        if (!detailStr) return { entries: [], exits: [] };
        
        const entries = [];
        const exits = [];
        
        // Split by | and parse each timestamp
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
    
    // Function to extract work time data from the HTML response or existing table
    function extractWorkTimeData() {
        const today = new Date();
        const todayStr = today.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }); // Format: DD/MM/YYYY (24/07/2025)
        
        console.log('Looking for today:', todayStr);
        
        // Try to find existing table data first
        const table = document.querySelector('#myFilter');
        let todayData = null;
        
        if (table) {
            const rows = table.querySelectorAll('tr');
            for (const row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 11) {
                    const dateCell = cells[0]?.textContent?.trim();
                    if (dateCell === todayStr) {
                        const presenceTime = cells[6]?.textContent?.trim(); // Column 7: Presence/Total
                        const detailCell = cells[10]?.textContent?.trim(); // Column 11: Detail timestamps
                        
                        const timestamps = parseTimestamps(detailCell);
                        
                        todayData = {
                            date: dateCell,
                            presence: presenceTime,
                            entries: timestamps.entries,
                            exits: timestamps.exits,
                            rawDetail: detailCell
                        };
                        break;
                    }
                }
            }
        }
        
        // If no data found in table, try to parse from page content (if API response is injected)
        if (!todayData) {
            const pageContent = document.body.innerHTML;
            const todayRowMatch = pageContent.match(new RegExp(`<td class="column1">${todayStr.replace(/\//g, '\\/')}</td>[\\s\\S]*?<\\/tr>`));
            
            if (todayRowMatch) {
                const rowHTML = todayRowMatch[0];
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = `<table><tr>${rowHTML}</tr></table>`;
                
                const cells = tempDiv.querySelectorAll('td');
                if (cells.length >= 11) {
                    const presenceTime = cells[6]?.textContent?.trim();
                    const detailCell = cells[10]?.textContent?.trim();
                    
                    const timestamps = parseTimestamps(detailCell);
                    
                    todayData = {
                        date: todayStr,
                        presence: presenceTime,
                        entries: timestamps.entries,
                        exits: timestamps.exits,
                        rawDetail: detailCell
                    };
                }
            }
        }
        
        console.log('Extracted today data:', todayData);
        return todayData;
    }
    
    // Function to calculate remaining time
    function calculateRemainingTime(data) {
        if (!data || !data.entries || data.entries.length === 0) {
            return {
                remainingPresence: REQUIRED_PRESENCE_MINUTES,
                remainingFromEntry: TOTAL_WORKDAY_MINUTES,
                canLeaveAt: '--:--',
                status: 'No entry time found for today',
                totalPresence: 0,
                entryTime: '--:--',
                exitTime: '--:--'
            };
        }
        
        const firstEntry = data.entries[0];
        const lastExit = data.exits.length > 0 ? data.exits[data.exits.length - 1] : null;
        
        // Calculate current presence time
        let currentPresenceMinutes = 0;
        if (data.presence && data.presence !== '0') {
            currentPresenceMinutes = parseTimeToMinutes(data.presence);
        } else {
            // Calculate based on entries and exits
            const currentTime = new Date();
            const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
            
            for (let i = 0; i < data.entries.length; i++) {
                const entryMinutes = parseTimeToMinutes(data.entries[i]);
                const exitMinutes = i < data.exits.length ? parseTimeToMinutes(data.exits[i]) : currentMinutes;
                
                if (exitMinutes > entryMinutes) {
                    currentPresenceMinutes += (exitMinutes - entryMinutes);
                }
            }
        }
        
        // Calculate remaining presence time
        const remainingPresence = Math.max(0, REQUIRED_PRESENCE_MINUTES - currentPresenceMinutes);
        
        // Calculate time from entry
        const entryMinutes = parseTimeToMinutes(firstEntry);
        const currentTime = new Date();
        const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const timeFromEntry = currentTimeMinutes - entryMinutes;
        const remainingFromEntry = Math.max(0, TOTAL_WORKDAY_MINUTES - timeFromEntry);
        
        // Calculate when you can leave
        let canLeaveMinutes;
        if (remainingPresence <= 0 && remainingFromEntry <= 0) {
            canLeaveMinutes = currentTimeMinutes; // Can leave now
        } else {
            // Need to satisfy both conditions
            const leaveByPresence = currentTimeMinutes + remainingPresence;
            const leaveByEntry = entryMinutes + TOTAL_WORKDAY_MINUTES;
            canLeaveMinutes = Math.max(leaveByPresence, leaveByEntry);
        }
        
        // Handle overflow to next day
        if (canLeaveMinutes >= 24 * 60) {
            canLeaveMinutes = canLeaveMinutes % (24 * 60);
        }
        
        const canLeaveHours = Math.floor(canLeaveMinutes / 60);
        const canLeaveMins = canLeaveMinutes % 60;
        const canLeaveAt = `${canLeaveHours.toString().padStart(2, '0')}:${canLeaveMins.toString().padStart(2, '0')}`;
        
        let status = 'Working';
        if (remainingPresence <= 0 && remainingFromEntry <= 0) {
            status = 'Can leave now! ✅';
        } else if (lastExit) {
            status = 'Currently out of office';
        }
        
        return {
            remainingPresence,
            remainingFromEntry,
            canLeaveAt,
            status,
            totalPresence: currentPresenceMinutes,
            entryTime: firstEntry,
            exitTime: lastExit || '--:--'
        };
    }
    
    // Function to create and inject the time tracker widget
    function createTimeTrackerWidget(timeData) {
        // Remove existing widget if present
        const existingWidget = document.getElementById('work-time-tracker');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        const widget = document.createElement('div');
        widget.id = 'work-time-tracker';
        widget.className = 'work-time-tracker';
        
        const { remainingPresence, remainingFromEntry, canLeaveAt, status, totalPresence, entryTime, exitTime } = timeData;
        
        widget.innerHTML = `
            <div class="tracker-header">
                <h4>⏰ Work Time Tracker</h4>
                <button class="tracker-toggle" id="tracker-toggle-btn">−</button>
            </div>
            <div class="tracker-content">
                <div class="tracker-row">
                    <span class="tracker-label">Entry Time:</span>
                    <span class="tracker-value">${entryTime || '--:--'}</span>
                </div>
                <div class="tracker-row">
                    <span class="tracker-label">Last Exit:</span>
                    <span class="tracker-value">${exitTime || '--:--'}</span>
                </div>
                <div class="tracker-row">
                    <span class="tracker-label">Current Presence:</span>
                    <span class="tracker-value">${formatMinutesToTime(totalPresence)}</span>
                </div>
                <div class="tracker-row">
                    <span class="tracker-label">Remaining (8h30 presence):</span>
                    <span class="tracker-value ${remainingPresence > 0 ? 'remaining' : 'completed'}">${formatMinutesToTime(remainingPresence)}</span>
                </div>
                <div class="tracker-row">
                    <span class="tracker-label">Remaining (9h from entry):</span>
                    <span class="tracker-value ${remainingFromEntry > 0 ? 'remaining' : 'completed'}">${formatMinutesToTime(remainingFromEntry)}</span>
                </div>
                <div class="tracker-row highlight">
                    <span class="tracker-label">Can Leave At:</span>
                    <span class="tracker-value">${canLeaveAt}</span>
                </div>
                <div class="tracker-status ${status.includes('now') || status.includes('✅') ? 'can-leave' : ''}">${status}</div>
                <div class="tracker-refresh">
                    <button id="tracker-refresh-btn">🔄 Refresh Data</button>
                </div>
            </div>
        `;
        
        // Insert the widget at the top of the page
        const targetContainer = document.querySelector('.card-body') || document.body;
        targetContainer.insertBefore(widget, targetContainer.firstChild);
        
        // Add event listeners for the widget buttons
        const toggleBtn = widget.querySelector('#tracker-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                widget.classList.toggle('minimized');
            });
        }
        
        const refreshBtn = widget.querySelector('#tracker-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }
    
    // Function to update the tracker
    function updateTracker() {
        const workData = extractWorkTimeData();
        if (workData) {
            const timeData = calculateRemainingTime(workData);
            createTimeTrackerWidget(timeData);
            
            // Store data for popup
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({
                        action: 'updateTimeData',
                        data: timeData
                    }).catch(error => {
                        console.log('Chrome runtime not available:', error);
                    });
                }
            } catch (error) {
                console.log('Chrome runtime error:', error);
            }
        } else {
            console.log('No work data found for today');
        }
    }
    
    // Function to handle messages from popup
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'getTimeData') {
                    const workData = extractWorkTimeData();
                    const timeData = workData ? calculateRemainingTime(workData) : null;
                    sendResponse({ data: timeData });
                }
                return true; // Keep message channel open for async response
            });
        }
    } catch (error) {
        console.log('Chrome runtime listener error:', error);
    }
    
    // Initialize when page loads
    function init() {
        console.log('Work Time Tracker: Initializing...');
        
        // Try to update immediately
        updateTracker();
        
        // Update every minute
        setInterval(updateTracker, 60000);
        
        // Listen for dynamic content changes
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    if (addedNodes.some(node => 
                        node.nodeType === Node.ELEMENT_NODE && 
                        (node.querySelector('#myFilter') || node.id === 'myFilter' || node.innerHTML?.includes('24/07/2025'))
                    )) {
                        shouldUpdate = true;
                    }
                }
            });
            
            if (shouldUpdate) {
                setTimeout(updateTracker, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
