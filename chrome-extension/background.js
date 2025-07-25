/**
 * Background Service Worker for CucoExt
 * Handles continuous monitoring and badge updates
 */

// Import core integration
importScripts('debug-utils.js');
importScripts('core-integration.js');

class BackgroundService {
    constructor() {
        this.core = new CoreIntegration();
        this.updateInterval = 60000; // 1 minute for UI updates
        this.entryCheckInterval = 600000; // 10 minutes for entry registry checks
        this.intervalId = null;
        this.lastStatus = null;
        
        this.initialize();
    }

    async initialize() {
        console.log('CucoExt Background Service starting...');
        
        // Initialize debug utils
        await debugUtils.refresh();
        
        // Load settings first
        await this.core.loadSettings();
        
        // Start monitoring when extension loads
        this.startMonitoring();
        
        // Listen for alarm events
        chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));
        
        // Create periodic alarms
        chrome.alarms.create('statusUpdate', { periodInMinutes: 0.5 }); // Real-time UI updates every 30 seconds
        chrome.alarms.create('entryRegistryCheck', { periodInMinutes: 10 }); // Entry registry checks
        
        // Handle extension icon clicks
        chrome.action.onClicked.addListener(this.handleIconClick.bind(this));
        
        // Listen for messages from popup/content scripts
        // Note: Main message handling is done by external listener below
        
        // Listen for notification clicks
        chrome.notifications.onClicked.addListener(this.handleNotificationClick.bind(this));
        chrome.notifications.onButtonClicked.addListener(this.handleNotificationButtonClick.bind(this));
        
        console.log('Background service initialized');
    }

    async handleAlarm(alarm) {
        if (alarm.name === 'statusUpdate') {
            // Real-time status updates for UI (semaphore, presence time)
            await this.updateStatus();
        } else if (alarm.name === 'entryRegistryCheck') {
            // Check for entry registry updates every 10 minutes
            await this.checkEntryRegistry();
        }
    }

    async startMonitoring() {
        console.log('Starting status monitoring...');
        await this.updateStatus();
    }

    async stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        chrome.alarms.clear('statusUpdate');
        chrome.alarms.clear('entryRegistryCheck');
        console.log('Monitoring stopped');
    }

    async checkEntryRegistry() {
        try {
            console.log('🔍 Checking entry registry for updates...');
            
            // Force a fresh data fetch to check for new entries
            const status = await this.core.getWorkStatus(true); // true = force refresh
            
            // If we got new data, update immediately
            if (status && status.status !== 'ERROR') {
                console.log('📊 Entry registry check completed, updating status');
                this.lastStatus = status;
                await this.updateBadge(status);
                await this.updateBadgeColor(status.color);
                
                // Store updated status
                await chrome.storage.local.set({ 
                    lastStatus: status,
                    lastUpdate: new Date().toISOString(),
                    lastEntryCheck: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error checking entry registry:', error);
        }
    }

    async updateStatus() {
        try {
            debugUtils.log('🔧 DEBUG: Starting status update...');
            const status = await this.core.getWorkStatus();
            debugUtils.log('🔧 DEBUG: Got status from core:', status);
            
            this.lastStatus = status;
            
            // Check for work completion notification
            this.checkWorkCompletionNotification(status);
            
            // Update badge
            await this.updateBadge(status);
            
            // Update badge color based on status
            await this.updateBadgeColor(status.color);
            
            // Store status for popup
            await chrome.storage.local.set({ 
                lastStatus: status,
                lastUpdate: new Date().toISOString()
            });
            
            debugUtils.log('🔧 DEBUG: Status update completed. Status:', status.status, 'Message:', status.message);
            
        } catch (error) {
            debugUtils.error('🔧 DEBUG: Error updating status:', error);
            
            // Show error on badge
            await chrome.action.setBadgeText({ text: '!' });
            await chrome.action.setBadgeBackgroundColor({ color: '#ff0000' });
            
            await chrome.storage.local.set({ 
                lastStatus: {
                    status: 'ERROR',
                    color: 'red',
                    message: error.message,
                    workingMinutes: 0
                },
                lastUpdate: new Date().toISOString()
            });
        }
    }

    async updateBadge(status) {
        let badgeText = '';
        
        switch (status.status) {
            case 'WORKING':
                // Show remaining time in hours
                if (status.remainingMinutes > 60) {
                    badgeText = Math.ceil(status.remainingMinutes / 60) + 'h';
                } else if (status.remainingMinutes > 0) {
                    badgeText = status.remainingMinutes + 'm';
                } else {
                    badgeText = '✓';
                }
                break;
                
            case 'OUT_OF_OFFICE':
                badgeText = 'OUT';
                break;
                
            case 'CAN_LEAVE':
                badgeText = '✓';
                break;
                
            case 'WORK_SHIFT_ENDED':
                badgeText = '✓';
                break;
                
            case 'TIME_TO_LEAVE':
                badgeText = '!!!';
                break;
                
            case 'NOT_WORKING':
                badgeText = '';
                break;
                
            case 'CREDENTIALS_EXPIRED':
                badgeText = 'EXP';
                break;
                
            case 'ERROR':
                badgeText = '!';
                break;
                
            default:
                badgeText = '?';
        }
        
        await chrome.action.setBadgeText({ text: badgeText });
    }

    async updateBadgeColor(colorCode) {
        let backgroundColor;
        
        switch (colorCode) {
            case 'blue':
                backgroundColor = '#0066cc';
                break;
            case 'yellow':
                backgroundColor = '#ffcc00';
                break;
            case 'green':
                backgroundColor = '#00cc66';
                break;
            case 'white-blinking':
                // For blinking, we'll use white and handle blinking in updateStatus
                backgroundColor = '#ffffff';
                break;
            case 'red':
                backgroundColor = '#cc0000';
                break;
            case 'gray':
            default:
                backgroundColor = '#666666';
        }
        
        await chrome.action.setBadgeBackgroundColor({ color: backgroundColor });
        
        // Handle blinking for white status
        if (colorCode === 'white-blinking') {
            this.startBlinking();
        } else {
            this.stopBlinking();
        }
    }

    startBlinking() {
        if (this.blinkInterval) return; // Already blinking
        
        let isWhite = true;
        this.blinkInterval = setInterval(async () => {
            const color = isWhite ? '#ffffff' : '#cccccc';
            await chrome.action.setBadgeBackgroundColor({ color });
            isWhite = !isWhite;
        }, 1000);
    }

    stopBlinking() {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }

    async checkWorkCompletionNotification(status) {
        // Only notify when work is completed
        if (status.status === 'CAN_LEAVE' || status.status === 'TIME_TO_LEAVE') {
            const storage = await chrome.storage.local.get(['lastNotificationStatus', 'notificationsEnabled']);
            
            // Check if notifications are enabled (default true)
            if (storage.notificationsEnabled === false) {
                return;
            }
            
            // Only notify once per completion (don't spam)
            if (storage.lastNotificationStatus !== status.status) {
                let notificationTitle, notificationMessage, icon;
                
                if (status.status === 'TIME_TO_LEAVE') {
                    notificationTitle = 'Time to Leave!';
                    notificationMessage = 'You just completed your working hours. You can leave now!\n\nHave you filled your TimeSheet yet?';
                    icon = 'white';
                } else if (status.status === 'CAN_LEAVE') {
                    notificationTitle = 'Work Complete!';
                    notificationMessage = (status.message || 'Your working requirements are fulfilled. You can leave whenever you want.') + '\n\nHave you filled your TimeSheet yet?';
                    icon = 'green';
                }
                
                // Create notification
                try {
                    const notificationId = `work-complete-${Date.now()}`;
                    
                    // Use a minimal transparent 1x1 PNG as iconUrl (required by Chrome)
                    const transparentIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
                    
                    await chrome.notifications.create(notificationId, {
                        type: 'basic',
                        iconUrl: transparentIcon,
                        title: notificationTitle,
                        message: notificationMessage,
                        priority: 2,
                        buttons: status.status === 'CAN_LEAVE' || status.status === 'TIME_TO_LEAVE' ? [
                            { title: 'Open TimeSheet' }
                        ] : undefined
                    });
                    
                    // Store that we've notified for this status
                    await chrome.storage.local.set({ lastNotificationStatus: status.status });
                    
                } catch (error) {
                    console.error('Error creating notification:', error);
                }
            }
        } else {
            // Reset notification status when not in completion state
            await chrome.storage.local.remove(['lastNotificationStatus']);
        }
    }

    async handleIconClick(tab) {
        // Open popup when icon is clicked
        // This is handled automatically by the popup, but we can add analytics here
        console.log('Extension icon clicked');
    }

    async handleNotificationClick(notificationId) {
        console.log('Notification clicked:', notificationId);
        
        // Handle different notification types based on ID
        if (notificationId.startsWith('install-')) {
            // Install notification - start credential extraction
            await this.startCredentialExtraction();
        } else if (notificationId.startsWith('work-complete-')) {
            // Work completion notification - open timesheet
            await this.openTimeSheet();
        } else {
            // Default behavior for other notifications
            await this.openTimeSheet();
        }
        
        // Clear the notification
        chrome.notifications.clear(notificationId);
    }

    async handleNotificationButtonClick(notificationId, buttonIndex) {
        if (buttonIndex === 0) { // "Open TimeSheet" button
            await this.openTimeSheet();
        }
        // Clear the notification
        chrome.notifications.clear(notificationId);
    }

    async openTimeSheet() {
        const timesheetUrl = 'https://wigos-timesheet.winsysgroup.com/';
        
        try {
            await chrome.tabs.create({ url: timesheetUrl });
            console.log('TimeSheet opened in new tab');
        } catch (error) {
            console.error('Error opening timesheet:', error);
        }
    }

    async startCredentialExtraction() {
        console.log('Starting credential extraction process...');
        
        try {
            // Open Cuco360 in a new tab with the credential extractor
            const cucoUrl = 'https://cuco360.cucorent.com/';
            const tab = await chrome.tabs.create({ url: cucoUrl });
            
            // Wait a bit for the tab to load, then inject the credential extractor
            setTimeout(async () => {
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['credential-extractor.js']
                    });
                    console.log('Credential extractor injected successfully');
                } catch (error) {
                    console.error('Error injecting credential extractor:', error);
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error starting credential extraction:', error);
        }
    }

    // Fetch marcajes data for the popup
    async fetchMarcajesData(credentials) {
        console.log('🔧 DEBUG: Fetching marcajes data with credentials');
        
        if (!credentials || !credentials.token) {
            throw new Error('No valid credentials provided');
        }

        try {
            // Use the core integration's work time tracker to fetch data
            const workStatus = await this.core.getWorkStatus();
            
            if (!workStatus.success) {
                throw new Error(workStatus.error || 'Failed to fetch work status');
            }

            // Extract marcajes information from the work status
            const marcajesData = {
                date: new Date().toISOString().split('T')[0],
                entries: workStatus.data.entries || [],
                exits: workStatus.data.exits || [],
                presence: workStatus.data.presence || '00:00',
                status: workStatus.data.status,
                fetchedAt: new Date().toISOString(),
                rawData: workStatus.data.details || null
            };

            console.log('🔧 DEBUG: Marcajes data fetched successfully:', {
                entries: marcajesData.entries.length,
                exits: marcajesData.exits.length,
                presence: marcajesData.presence
            });

            return marcajesData;

        } catch (error) {
            console.error('Error fetching marcajes data:', error);
            throw error;
        }
    }
}

// Initialize background service
const backgroundService = new BackgroundService();

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    (async () => {
        try {
            switch (message.action) {
                case 'getWorkStatus':
                    const status = await backgroundService.core.getWorkStatus();
                    sendResponse({ success: true, data: status });
                    break;
                    
                case 'setCredentials':
                    console.log('🔧 DEBUG: Set credentials requested with:', {
                        hasToken: !!message.token,
                        hasCookies: !!message.cookies,
                        clientCode: message.clientCode
                    });
                    
                    const credResult = await backgroundService.core.setCredentials(
                        message.token, 
                        message.cookies, 
                        message.clientCode
                    );
                    
                    console.log('🔧 DEBUG: Credentials set result:', credResult);
                    
                    // Force immediate status update after setting credentials
                    console.log('🔧 DEBUG: Forcing status update after credential set');
                    await backgroundService.updateStatus();
                    
                    sendResponse({ success: credResult });
                    break;
                    
                case 'clearCredentials':
                    const clearResult = await backgroundService.core.clearCredentials();
                    await backgroundService.updateStatus();
                    sendResponse({ success: clearResult });
                    break;
                    
                case 'setWorkingHours':
                    const hoursResult = await backgroundService.core.setWorkingHours(message.setName);
                    await backgroundService.updateStatus();
                    sendResponse({ success: hoursResult });
                    break;
                    
                case 'forceUpdate':
                    console.log('🔧 DEBUG: Force update requested');
                    await backgroundService.updateStatus();
                    const newStatus = await chrome.storage.local.get(['lastStatus']);
                    console.log('🔧 DEBUG: Returning status to popup:', newStatus.lastStatus);
                    sendResponse({ success: true, data: newStatus.lastStatus });
                    break;
                    
                case 'fetchMarcajes':
                    console.log('🔧 DEBUG: Fetch marcajes requested');
                    try {
                        const marcajesData = await backgroundService.fetchMarcajesData(message.credentials);
                        sendResponse({ success: true, data: marcajesData });
                    } catch (error) {
                        console.error('Error fetching marcajes:', error);
                        sendResponse({ success: false, error: error.message });
                    }
                    break;
                    
                case 'credentialsExtracted':
                    console.log('🔧 DEBUG: Credentials extracted message received:', message.result);
                    
                    // If credentials were successfully extracted, save them and update status
                    if (message.result.success && message.result.credentials) {
                        try {
                            console.log('🔧 DEBUG: Attempting to save extracted credentials:', {
                                hasToken: !!message.result.credentials.token,
                                hasCookies: !!message.result.credentials.cookies,
                                clientCode: message.result.credentials.clientCode
                            });
                            
                            // CRITICAL: Save credentials directly to chrome.storage from background script
                            await chrome.storage.local.set({
                                credentials: {
                                    token: message.result.credentials.token,
                                    cookies: message.result.credentials.cookies,
                                    clientCode: message.result.credentials.clientCode,
                                    extractedAt: message.result.credentials.extractedAt || new Date().toISOString(),
                                    extractedFrom: message.result.credentials.extractedFrom
                                }
                            });
                            
                            console.log('🔧 DEBUG: Credentials saved directly to storage by background script');
                            
                            // Verify storage immediately
                            const verification = await chrome.storage.local.get(['credentials']);
                            console.log('🔧 DEBUG: Storage verification:', {
                                hasCredentials: !!verification.credentials,
                                credentialsKeys: verification.credentials ? Object.keys(verification.credentials) : []
                            });
                            
                            // Now update the core integration with the saved credentials
                            backgroundService.core.credentials = verification.credentials;
                            
                            console.log('🔧 DEBUG: Core credentials updated, now updating status...');
                            
                            // Force an immediate status update
                            await backgroundService.updateStatus();
                            
                            console.log('🔧 DEBUG: Status update completed after credential extraction');
                            
                        } catch (error) {
                            console.error('🔧 DEBUG: Error saving extracted credentials:', error);
                        }
                    } else {
                        console.log('🔧 DEBUG: Credentials extraction failed or no credentials in result:', message.result);
                    }
                    
                    sendResponse({ success: true });
                    break;
                    
                case 'contentScriptReady':
                    console.log('🔧 DEBUG: Content script ready:', message);
                    sendResponse({ 
                        background: 'ready', 
                        timestamp: new Date().toISOString(),
                        extensionId: chrome.runtime.id
                    });
                    break;
                    
                case 'getLastStatus':
                    console.log('🔧 DEBUG: Get last status requested');
                    const lastStatus = await chrome.storage.local.get(['lastStatus']);
                    sendResponse({ success: true, data: lastStatus.lastStatus });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    })();
    
    return true; // Keep message channel open for async response
});

// Handle extension lifecycle
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension startup');
});

chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        // Show welcome notification with proper ID
        const transparentIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        chrome.notifications.create('install-welcome', {
            type: 'basic',
            iconUrl: transparentIcon,
            title: 'CucoExt Installed',
            message: 'Click here to automatically extract your Cuco360 credentials and start tracking work time.'
        });
    }
});

// Cleanup on extension shutdown
chrome.runtime.onSuspend.addListener(() => {
    backgroundService.stopBlinking();
    console.log('Extension suspended');
});
