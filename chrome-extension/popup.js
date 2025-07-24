/**
 * CucoExt - Smart Work Time Tracker
 * Popup script for Chrome Extension
 * Handles UI interactions and status display
 * 
 * Copyright (c) 2024-2025 CucoExt Development Team
 * Licensed under CC BY-NC-SA 4.0
 * 
 * Commercial use requires explicit written permission.
 * Contact: dani.azemar+cucoextlicensing@gmail.com
 * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
 */

// DOM elements
let elements = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadCachedSession();
    loadInitialState();
    setupEventListeners();
});

function initializeElements() {
    elements = {
        semaphore: document.getElementById('semaphore'),
        statusMessage: document.getElementById('statusMessage'),
        statusDetails: document.getElementById('statusDetails'),
        workingTime: document.getElementById('workingTime'),
        workingTimeValue: document.getElementById('workingTimeValue'),
        presenceTimeValue: document.getElementById('presenceTimeValue'),
        remainingTimeValue: document.getElementById('remainingTimeValue'),
        theoreticalExitValue: document.getElementById('theoreticalExitValue'),
        progressFill: document.getElementById('progressFill'),
        lastUpdate: document.getElementById('lastUpdate'),
        timesheetReminder: document.getElementById('timesheetReminder'),
        tokenInput: document.getElementById('tokenInput'),
        cookiesInput: document.getElementById('cookiesInput'),
        clientCodeInput: document.getElementById('clientCodeInput'),
        workingHoursSelect: document.getElementById('workingHoursSelect'),
        autoDetectIntensive: document.getElementById('autoDetectIntensive'),
        notificationsEnabled: document.getElementById('notificationsEnabled'),
        debugLogsEnabled: document.getElementById('debugLogsEnabled'),
        credentialsMessage: document.getElementById('credentialsMessage'),
        configMessage: document.getElementById('configMessage'),
        refreshText: document.getElementById('refreshText'),
        refreshLoading: document.getElementById('refreshLoading'),
        // Marcajes tab elements
        marcajesStatus: document.getElementById('marcajesStatus'),
        marcajesBadge: document.getElementById('marcajesBadge'),
        marcajesContainer: document.getElementById('marcajesContainer'),
        marcajesList: document.getElementById('marcajesList'),
        marcajesEntries: document.getElementById('marcajesEntries'),
        marcajesStats: document.getElementById('marcajesStats'),
        marcajesProblems: document.getElementById('marcajesProblems'),
        problemsList: document.getElementById('problemsList')
    };
}

async function loadInitialState() {
    try {
        // Load stored status
        const storage = await chrome.storage.local.get(['lastStatus', 'lastUpdate', 'credentials', 'workingHoursSet', 'autoDetectIntensive', 'notificationsEnabled', 'debugLogsEnabled']);
        
        if (storage.lastStatus) {
            updateStatusDisplay(storage.lastStatus);
        }
        
        if (storage.lastUpdate) {
            updateLastUpdateTime(storage.lastUpdate);
        }
        
        // Load configuration values
        if (storage.workingHoursSet) {
            elements.workingHoursSelect.value = storage.workingHoursSet;
        }
        
        if (storage.autoDetectIntensive !== undefined) {
            elements.autoDetectIntensive.checked = storage.autoDetectIntensive;
        } else {
            elements.autoDetectIntensive.checked = true; // default enabled
        }
        
        if (storage.notificationsEnabled !== undefined) {
            elements.notificationsEnabled.checked = storage.notificationsEnabled;
        } else {
            elements.notificationsEnabled.checked = true; // default enabled
        }
        
        if (storage.debugLogsEnabled !== undefined) {
            elements.debugLogsEnabled.checked = storage.debugLogsEnabled;
        } else {
            elements.debugLogsEnabled.checked = false; // default disabled
        }
        
        // Show if credentials are configured
        if (storage.credentials) {
            showMessage(elements.credentialsMessage, 'Credentials configured', 'success');
        } else {
            showMessage(elements.credentialsMessage, 'No credentials configured', 'error');
        }
        
    } catch (error) {
        console.error('Error loading initial state:', error);
    }
    
    // Start auto-refresh for real-time updates while popup is open
    startAutoRefresh();
}

function startAutoRefresh() {
    // Refresh status every 10 seconds while popup is open for real-time seconds display
    const autoRefreshInterval = setInterval(async () => {
        try {
            const response = await sendMessage({ action: 'forceUpdate' });
            if (response.success) {
                updateStatusDisplay(response.data);
                updateLastUpdateTime(new Date().toISOString());
            }
        } catch (error) {
            console.log('Auto-refresh error:', error);
        }
    }, 10000); // 10 seconds for real-time updates
    
    // Clear interval when popup is closed
    window.addEventListener('beforeunload', () => {
        clearInterval(autoRefreshInterval);
    });
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            if (tabName) showTab(tabName);
        });
    });

    // Status tab buttons
    const refreshBtn = document.getElementById('refreshStatus-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshStatus);
    }

    const timesheetBtn = document.getElementById('openTimeSheet-btn');
    if (timesheetBtn) {
        timesheetBtn.addEventListener('click', openTimeSheet);
    }

    // Credentials tab buttons
    const extractBtn = document.getElementById('extractCredentials-btn');
    if (extractBtn) {
        extractBtn.addEventListener('click', extractCredentials);
    }

    const testExtractionBtn = document.getElementById('testExtraction-btn');
    if (testExtractionBtn) {
        testExtractionBtn.addEventListener('click', testCurrentPageExtraction);
    }

    const saveCredBtn = document.getElementById('saveCredentials-btn');
    if (saveCredBtn) {
        saveCredBtn.addEventListener('click', saveCredentials);
    }

    const clearCredBtn = document.getElementById('clearCredentials-btn');
    if (clearCredBtn) {
        clearCredBtn.addEventListener('click', clearCredentials);
    }

    // Config tab buttons
    const saveConfigBtn = document.getElementById('saveConfiguration-btn');
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', saveConfiguration);
    }

    // Marcajes tab buttons
    const refreshMarcajesBtn = document.getElementById('refreshMarcajes-btn');
    if (refreshMarcajesBtn) {
        refreshMarcajesBtn.addEventListener('click', refreshMarcajes);
    }

    const exportMarcajesBtn = document.getElementById('exportMarcajes-btn');
    if (exportMarcajesBtn) {
        exportMarcajesBtn.addEventListener('click', exportMarcajes);
    }

    const fixProblemsBtn = document.getElementById('fixProblems-btn');
    if (fixProblemsBtn) {
        fixProblemsBtn.addEventListener('click', fixMarcajesProblems);
    }

    // About tab button
    const aboutBtn = document.getElementById('aboutTab-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => showTab('about'));
    }

    // Marcajes tab button
    const marcajesBtn = document.getElementById('marcajesTab-btn');
    if (marcajesBtn) {
        marcajesBtn.addEventListener('click', () => showTab('marcajes'));
    }
}

// Tab management
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) selectedTab.classList.add('active');
    
    const selectedContent = document.getElementById(tabName + 'Tab');
    if (selectedContent) selectedContent.classList.add('active');
}

// Status management
async function refreshStatus() {
    console.log('🔧 DEBUG: Popup refresh status called');
    setLoading(true);
    
    try {
        console.log('🔧 DEBUG: Sending forceUpdate message to background');
        const response = await sendMessage({ action: 'forceUpdate' });
        console.log('🔧 DEBUG: Got response from background:', response);
        
        if (response.success) {
            console.log('🔧 DEBUG: Updating status display with:', response.data);
            updateStatusDisplay(response.data);
            updateLastUpdateTime(new Date().toISOString());
            showMessage(elements.credentialsMessage, 'Status refreshed successfully', 'success', 3000);
        } else {
            throw new Error(response.error || 'Failed to refresh status');
        }
    } catch (error) {
        console.error('🔧 DEBUG: Error refreshing status:', error);
        showMessage(elements.credentialsMessage, `Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        elements.refreshText.classList.add('hidden');
        elements.refreshLoading.classList.remove('hidden');
    } else {
        elements.refreshText.classList.remove('hidden');
        elements.refreshLoading.classList.add('hidden');
    }
}

function updateStatusDisplay(status) {
    if (!status) return;
    
    // Update semaphore
    const semaphoreIcons = {
        'WORKING': '🔵',
        'OUT_OF_OFFICE': '🟡',
        'CAN_LEAVE': '🟢',
        'TIME_TO_LEAVE': '⚪',
        'NOT_WORKING': '⚫',
        'CREDENTIALS_EXPIRED': '🔴',
        'ERROR': '🔴'
    };
    
    elements.semaphore.textContent = semaphoreIcons[status.status] || '❓';
    
    // Handle blinking for TIME_TO_LEAVE
    if (status.status === 'TIME_TO_LEAVE') {
        elements.semaphore.classList.add('blinking');
    } else {
        elements.semaphore.classList.remove('blinking');
    }
    
    // Update status message and details
    elements.statusMessage.textContent = getStatusTitle(status.status);
    elements.statusDetails.textContent = status.message || 'No additional details';
    
    // Update working time details
    if (status.workingMinutes > 0 || status.remainingMinutes >= 0) {
        elements.workingTime.style.display = 'block';
        
        // Use seconds format when available for real-time display
        if (status.workingSeconds !== undefined) {
            elements.workingTimeValue.textContent = formatSecondsToTime(status.workingSeconds || 0);
        } else {
            elements.workingTimeValue.textContent = formatMinutesToTime(status.workingMinutes || 0);
        }
        
        // Update presence time (actual time in office)
        elements.presenceTimeValue.textContent = formatMinutesToTime(status.presenceMinutes || 0);
        
        elements.remainingTimeValue.textContent = formatMinutesToTime(status.remainingMinutes || 0);
        elements.theoreticalExitValue.textContent = status.theoreticalExit || '--:--';
        
        // Update progress bar
        const progress = Math.min(100, Math.max(0, status.progress || 0));
        elements.progressFill.style.width = progress + '%';
    } else {
        elements.workingTime.style.display = 'none';
    }
    
    // Show/hide timesheet reminder based on completion status
    if (status.status === 'CAN_LEAVE' || status.status === 'TIME_TO_LEAVE') {
        elements.timesheetReminder.classList.remove('hidden');
    } else {
        elements.timesheetReminder.classList.add('hidden');
    }
}

function getStatusTitle(status) {
    const titles = {
        'WORKING': 'Currently Working',
        'OUT_OF_OFFICE': 'Out of Office',
        'CAN_LEAVE': 'Can Leave Now',
        'TIME_TO_LEAVE': 'Time to Leave!',
        'NOT_WORKING': 'Not Working',
        'CREDENTIALS_EXPIRED': 'Credentials Expired',
        'ERROR': 'Error'
    };
    
    return titles[status] || 'Unknown Status';
}

function formatMinutesToTime(minutes) {
    if (minutes < 0) {
        return '-' + formatMinutesToTime(-minutes);
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function formatSecondsToTime(seconds) {
    if (seconds < 0) {
        return '-' + formatSecondsToTime(-seconds);
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateLastUpdateTime(timestamp) {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    elements.lastUpdate.textContent = `Last updated: ${timeStr}`;
}

// Test extraction on current page
async function testCurrentPageExtraction() {
    try {
        console.log('🧪 Testing extraction on current page...');
        showMessage(elements.credentialsMessage, 'Testing current page...', 'info', 0);
        
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        if (!currentTab) {
            throw new Error('No active tab found');
        }
        
        console.log('🔧 DEBUG: Current tab URL:', currentTab.url);
        
        if (!currentTab.url.includes('cuco360.cucorent.com')) {
            showMessage(elements.credentialsMessage, 
                'Please navigate to Cuco360 page first', 
                'error', 5000);
            return;
        }
        
        // Test connection first
        try {
            const connectionTest = await chrome.tabs.sendMessage(currentTab.id, { 
                action: 'testConnection' 
            });
            console.log('🔧 DEBUG: Connection test result:', connectionTest);
            
            if (connectionTest && connectionTest.connected) {
                showMessage(elements.credentialsMessage, 
                    `✅ Connected to ${currentTab.url}\nCan extract: ${connectionTest.canExtract}`, 
                    'success', 5000);
                
                // If we can extract, offer to start extraction
                if (connectionTest.canExtract) {
                    setTimeout(() => {
                        showMessage(elements.credentialsMessage, 
                            '🚀 Page is ready! Starting extraction...', 
                            'info', 0);
                        
                        // Start actual extraction
                        chrome.tabs.sendMessage(currentTab.id, { action: 'startExtraction' });
                    }, 2000);
                } else {
                    showMessage(elements.credentialsMessage, 
                        '⚠️ Page not ready for extraction. Check if you are logged in and on face2face page with data loaded.', 
                        'warning', 8000);
                }
            } else {
                throw new Error('Connection test failed');
            }
        } catch (error) {
            console.log('🔧 DEBUG: Connection test failed:', error);
            showMessage(elements.credentialsMessage, 
                '❌ Cannot connect to page. Extension may not be injected.', 
                'error', 5000);
        }
        
    } catch (error) {
        console.error('🔧 DEBUG: Test extraction error:', error);
        showMessage(elements.credentialsMessage, 
            `Error: ${error.message}`, 
            'error', 5000);
    }
}

// Credentials management
async function extractCredentials() {
    try {
        showMessage(elements.credentialsMessage, 'Starting automated credential extraction...', 'info', 0);
        
        // First, check if user is already on Cuco360 page
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        if (currentTab && currentTab.url.includes('cuco360.cucorent.com')) {
            console.log('🎯 User is already on Cuco360 page, extracting from current tab');
            showMessage(elements.credentialsMessage, 
                'Detected Cuco360 page! Starting extraction from current page...', 
                'info', 0);
            
            // Send extraction request to current tab
            try {
                const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'startExtraction' });
                console.log('🔧 DEBUG: Extraction started on current tab:', response);
                
                showMessage(elements.credentialsMessage, 
                    'Extraction started on current page. Please wait...', 
                    'info', 0);
                
            } catch (error) {
                console.log('🔧 DEBUG: Failed to start extraction on current tab:', error);
                showMessage(elements.credentialsMessage, 
                    'Could not start extraction on current page. Opening new tab...', 
                    'warning', 3000);
                // Fall back to opening new tab
                await extractFromNewTab();
                return;
            }
        } else {
            console.log('🔗 User not on Cuco360 page, opening new tab');
            showMessage(elements.credentialsMessage, 
                'Opening Cuco360 in new tab for extraction...', 
                'info', 0);
            await extractFromNewTab();
            return;
        }
        
        // Listen for extraction results from current tab
        const handleExtractionResult = (message, sender, sendResponse) => {
            if (message.action === 'credentialsExtracted' && sender.tab.id === currentTab.id) {
                chrome.runtime.onMessage.removeListener(handleExtractionResult);
                
                if (message.result.success) {
                    // Auto-save the extracted credentials
                    saveExtractedCredentials(message.result.credentials);
                } else {
                    showMessage(elements.credentialsMessage, 
                        `Extraction failed: ${message.result.message}`, 
                        'error');
                }
            }
        };
        
        chrome.runtime.onMessage.addListener(handleExtractionResult);
        
        // Set timeout for extraction
        setTimeout(() => {
            chrome.runtime.onMessage.removeListener(handleExtractionResult);
            showMessage(elements.credentialsMessage, 
                'Extraction timeout. Please try again or check if you are logged in.', 
                'error');
        }, 60000); // 1 minute timeout for current tab
        
    } catch (error) {
        console.error('🔧 DEBUG: Error in extractCredentials:', error);
        showMessage(elements.credentialsMessage, `Error: ${error.message}`, 'error');
    }
}

async function extractFromNewTab() {
    // Original new tab extraction logic
    const extractionUrl = 'https://cuco360.cucorent.com/login#cucoext-extract';
    const tab = await chrome.tabs.create({ 
        url: extractionUrl,
        active: true 
    });
    
    showMessage(elements.credentialsMessage, 
        'Cuco360 opened! Please log in and wait for automatic extraction...', 
        'info', 0);
    
    // Listen for extraction results
    const handleExtractionResult = (message, sender, sendResponse) => {
        if (message.action === 'credentialsExtracted' && sender.tab.id === tab.id) {
            chrome.runtime.onMessage.removeListener(handleExtractionResult);
            
            if (message.result.success) {
                // Auto-save the extracted credentials
                saveExtractedCredentials(message.result.credentials);
            } else {
                showMessage(elements.credentialsMessage, 
                    `Extraction failed: ${message.result.message}`, 
                    'error');
            }
        }
    };
    
    chrome.runtime.onMessage.addListener(handleExtractionResult);
    
    // Set timeout for extraction
    setTimeout(() => {
        chrome.runtime.onMessage.removeListener(handleExtractionResult);
        showMessage(elements.credentialsMessage, 
            'Extraction timeout. Please try manual extraction or ensure you are logged in.', 
            'error');
    }, 120000); // 2 minutes timeout for new tab
}

async function saveExtractedCredentials(credentials) {
    try {
        console.log('🔧 DEBUG: Popup saving extracted credentials:', {
            hasToken: !!credentials.token,
            hasCookies: !!credentials.cookies,
            clientCode: credentials.clientCode
        });
        
        const response = await sendMessage({
            action: 'setCredentials',
            token: credentials.token,
            cookies: credentials.cookies,
            clientCode: credentials.clientCode
        });
        
        console.log('🔧 DEBUG: Save credentials response:', response);
        
        if (response.success) {
            // Update UI fields
            elements.tokenInput.value = credentials.token;
            elements.cookiesInput.value = credentials.cookies;
            elements.clientCodeInput.value = credentials.clientCode;
            
            showMessage(elements.credentialsMessage, 
                '✅ Credentials extracted and saved successfully! Refreshing status...', 
                'success');
            
            console.log('🔧 DEBUG: About to refresh status after credential save');
            // Immediately refresh the status to show work time tracking
            await refreshStatus();
            
            // Switch back to Status tab to show the results
            showTab('status');
            
        } else {
            throw new Error(response.error || 'Failed to save extracted credentials');
        }
    } catch (error) {
        console.error('🔧 DEBUG: Error saving extracted credentials:', error);
        showMessage(elements.credentialsMessage, `Error saving credentials: ${error.message}`, 'error');
    }
}

// Helper function to get default client code
function getDefaultClientCode() {
    // Try to get from existing credentials first, otherwise leave empty
    return ''; // No default - user must specify
}

async function saveCredentials() {
    const token = elements.tokenInput.value.trim();
    const cookies = elements.cookiesInput.value.trim();
    const clientCode = elements.clientCodeInput.value.trim() || getDefaultClientCode();
    
    if (!token || !cookies) {
        showMessage(elements.credentialsMessage, 'Please enter both token and cookies', 'error');
        return;
    }
    
    if (!clientCode) {
        showMessage(elements.credentialsMessage, 'Please enter a client code', 'error');
        return;
    }
    
    try {
        console.log('🔧 DEBUG: Popup saving credentials directly to storage');
        
        // Save directly to storage from popup (which has proper permissions)
        await chrome.storage.local.set({
            credentials: {
                token: token,
                cookies: cookies,
                clientCode: clientCode,
                extractedAt: new Date().toISOString(),
                extractedFrom: 'manual-entry'
            }
        });
        
        console.log('🔧 DEBUG: Credentials saved directly to storage');
        
        // Verify storage
        const verification = await chrome.storage.local.get(['credentials']);
        console.log('🔧 DEBUG: Storage verification:', verification);
        
        showMessage(elements.credentialsMessage, 'Credentials saved successfully! Refreshing status...', 'success');
        
        // Immediately refresh the status
        await refreshStatus();
        
        // Switch to Status tab to show results
        showTab('status');
        
        // Clear inputs for security
        elements.tokenInput.value = '';
        elements.cookiesInput.value = '';
        
    } catch (error) {
        console.error('🔧 DEBUG: Error saving credentials:', error);
        showMessage(elements.credentialsMessage, `Error: ${error.message}`, 'error');
    }
}

async function clearCredentials() {
    try {
        const response = await sendMessage({ action: 'clearCredentials' });
        
        if (response.success) {
            showMessage(elements.credentialsMessage, 'Credentials cleared', 'success');
            elements.tokenInput.value = '';
            elements.cookiesInput.value = '';
        } else {
            throw new Error(response.error || 'Failed to clear credentials');
        }
    } catch (error) {
        console.error('Error clearing credentials:', error);
        showMessage(elements.credentialsMessage, `Error: ${error.message}`, 'error');
    }
}

// Configuration management
async function saveConfiguration() {
    const workingHoursSet = elements.workingHoursSelect.value;
    const autoDetectIntensive = elements.autoDetectIntensive.checked;
    const notificationsEnabled = elements.notificationsEnabled.checked;
    const debugLogsEnabled = elements.debugLogsEnabled.checked;
    
    try {
        const response = await sendMessage({
            action: 'setWorkingHours',
            setName: workingHoursSet
        });
        
        if (response.success) {
            // Save auto-detect, notification, and debug settings
            await chrome.storage.local.set({ 
                autoDetectIntensive: autoDetectIntensive,
                notificationsEnabled: notificationsEnabled,
                debugLogsEnabled: debugLogsEnabled
            });
            showMessage(elements.configMessage, 'Configuration saved successfully', 'success');
        } else {
            throw new Error(response.error || 'Failed to save configuration');
        }
    } catch (error) {
        console.error('Error saving configuration:', error);
        showMessage(elements.configMessage, `Error: ${error.message}`, 'error');
    }
}

// Utility functions
function showMessage(element, message, type, duration = 5000) {
    element.innerHTML = `<div class="${type}-message">${message}</div>`;
    
    if (duration > 0) {
        setTimeout(() => {
            element.innerHTML = '';
        }, duration);
    }
}

function sendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response || { success: false, error: 'No response' });
        });
    });
}

// TimeSheet functionality
async function openTimeSheet() {
    const timesheetUrl = 'https://wigos-timesheet.winsysgroup.com/';
    
    try {
        await chrome.tabs.create({ url: timesheetUrl });
        console.log('TimeSheet opened in new tab');
    } catch (error) {
        console.error('Error opening timesheet:', error);
        alert('Error opening timesheet. Please check your browser permissions.');
    }
}

// Global variables for session management
let cachedMarcajes = null;
let lastMarcajesUpdate = null;
let isOfflineMode = false;

// Enhanced session management - preserve data to avoid re-entry
async function loadCachedSession() {
    try {
        const result = await chrome.storage.local.get(['cachedMarcajes', 'lastMarcajesUpdate', 'lastStatus']);
        
        if (result.cachedMarcajes && result.lastMarcajesUpdate) {
            const cacheAge = Date.now() - new Date(result.lastMarcajesUpdate).getTime();
            const cacheValidHours = 8; // Cache valid for 8 hours
            
            if (cacheAge < cacheValidHours * 60 * 60 * 1000) {
                cachedMarcajes = result.cachedMarcajes;
                lastMarcajesUpdate = result.lastMarcajesUpdate;
                isOfflineMode = true;
                
                // Show offline indicator in credentials tab
                showOfflineIndicator();
                
                // Use cached data if available
                if (result.lastStatus) {
                    updateStatusDisplay(result.lastStatus);
                }
                
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error loading cached session:', error);
        return false;
    }
}

// Show offline mode indicator
function showOfflineIndicator() {
    const credentialsTab = document.getElementById('credentialsTab');
    if (credentialsTab && !credentialsTab.querySelector('.credentials-warning')) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'credentials-warning';
        warningDiv.innerHTML = '⚠️ Using cached data. Refresh credentials to get latest information.';
        credentialsTab.insertBefore(warningDiv, credentialsTab.firstChild);
    }
}

// Marcajes functionality
async function refreshMarcajes() {
    const refreshBtn = document.getElementById('refreshMarcajes-btn');
    const originalText = refreshBtn.textContent;
    
    try {
        refreshBtn.textContent = '🔄 Loading...';
        refreshBtn.disabled = true;
        
        // Get credentials
        const storage = await chrome.storage.local.get(['credentials']);
        const credentials = storage.credentials;
        
        if (!credentials || !credentials.token) {
            throw new Error('No credentials available. Please extract credentials first.');
        }
        
        // Fetch fresh marcajes data
        const response = await chrome.runtime.sendMessage({
            action: 'fetchMarcajes',
            credentials: credentials
        });
        
        if (response.success) {
            cachedMarcajes = response.data;
            lastMarcajesUpdate = new Date().toISOString();
            isOfflineMode = false;
            
            // Cache the data
            await chrome.storage.local.set({
                cachedMarcajes: cachedMarcajes,
                lastMarcajesUpdate: lastMarcajesUpdate
            });
            
            // Remove offline indicator
            const warningElement = document.querySelector('.credentials-warning');
            if (warningElement) {
                warningElement.remove();
            }
            
            displayMarcajes(cachedMarcajes);
            updateMarcajesStatus(cachedMarcajes);
        } else {
            throw new Error(response.error || 'Failed to fetch marcajes data');
        }
        
    } catch (error) {
        console.error('Error refreshing marcajes:', error);
        
        // If we have cached data, use it and show warning
        if (cachedMarcajes) {
            displayMarcajes(cachedMarcajes);
            updateMarcajesStatus(cachedMarcajes, true);
            showMessage(elements.marcajesContainer, `Using cached data: ${error.message}`, 'warning');
        } else {
            showMessage(elements.marcajesContainer, `Error: ${error.message}`, 'error');
        }
    } finally {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }
}

// Process marcajes data for double entries/exits
function processMarcajesData(marcajes) {
    if (!marcajes || !marcajes.entries || !marcajes.exits) {
        return { processed: [], problems: [] };
    }
    
    const processed = [];
    const problems = [];
    const allEvents = [];
    
    // Combine entries and exits with timestamps
    marcajes.entries.forEach(time => {
        allEvents.push({ time, type: 'E', original: true });
    });
    
    marcajes.exits.forEach(time => {
        allEvents.push({ time, type: 'S', original: true });
    });
    
    // Sort by time
    allEvents.sort((a, b) => a.time.localeCompare(b.time));
    
    // Check for problematic patterns
    for (let i = 0; i < allEvents.length; i++) {
        const current = allEvents[i];
        const next = allEvents[i + 1];
        
        if (next && current.type === next.type) {
            // Double entry or double exit detected
            const timeDiff = getTimeDifferenceMinutes(current.time, next.time);
            
            if (timeDiff <= 5) {
                // Within 5 minutes - keep the second one
                current.remove = true;
                current.reason = `Double ${current.type} within 5min - keeping latest`;
            } else {
                // More than 5 minutes - mark as problematic
                problems.push({
                    type: 'double_' + current.type.toLowerCase(),
                    entries: [current, next],
                    message: `Double ${current.type === 'E' ? 'entrada' : 'salida'} detected`,
                    timeDiff: timeDiff
                });
            }
        }
        
        if (!current.remove) {
            processed.push(current);
        }
    }
    
    return { processed, problems };
}

// Get time difference in minutes
function getTimeDifferenceMinutes(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    return Math.abs(minutes2 - minutes1);
}

// Display marcajes in the UI
function displayMarcajes(marcajes) {
    if (!marcajes) return;
    
    const { processed, problems } = processMarcajesData(marcajes);
    
    // Show/hide containers
    elements.marcajesContainer.style.display = 'none';
    elements.marcajesList.style.display = 'block';
    
    // Update stats
    const totalEntries = processed.filter(e => e.type === 'E').length;
    const totalExits = processed.filter(e => e.type === 'S').length;
    const presenceTime = calculatePresenceTime(processed);
    
    elements.marcajesStats.innerHTML = `
        <div>Entradas: ${totalEntries} | Salidas: ${totalExits}</div>
        <div>Tiempo presencia: ${presenceTime}</div>
        ${isOfflineMode ? '<div class="offline-indicator">📱 Offline Mode</div>' : ''}
    `;
    
    // Display entries
    elements.marcajesEntries.innerHTML = '';
    processed.forEach((entry, index) => {
        const entryDiv = createMarcajeElement(entry, index);
        elements.marcajesEntries.appendChild(entryDiv);
    });
    
    // Handle problems
    if (problems.length > 0) {
        displayMarcajesProblems(problems);
    } else {
        elements.marcajesProblems.style.display = 'none';
    }
}

// Create marcaje element
function createMarcajeElement(entry, index) {
    const div = document.createElement('div');
    div.className = `marcaje-item ${entry.type === 'E' ? 'entry' : 'exit'}`;
    
    const typeText = entry.type === 'E' ? 'Entrada' : 'Salida';
    const label = getEntryLabel(entry, index);
    
    div.innerHTML = `
        <div class="marcaje-info">
            <span class="marcaje-time">${entry.time}</span>
            <span class="marcaje-type ${entry.type === 'E' ? 'entrada' : 'salida'}">${typeText}</span>
            ${label ? `<span class="marcaje-label">${label}</span>` : ''}
        </div>
        <div class="marcaje-controls">
            <button class="marcaje-btn edit" onclick="editMarcajeLabel(${index})">🏷️</button>
            <button class="marcaje-btn delete" onclick="deleteMarcaje(${index})">❌</button>
        </div>
    `;
    
    return div;
}

// Calculate presence time from processed entries
function calculatePresenceTime(processed) {
    let totalMinutes = 0;
    let currentEntry = null;
    
    for (const event of processed) {
        if (event.type === 'E') {
            currentEntry = event.time;
        } else if (event.type === 'S' && currentEntry) {
            const entryMinutes = timeToMinutes(currentEntry);
            const exitMinutes = timeToMinutes(event.time);
            totalMinutes += exitMinutes - entryMinutes;
            currentEntry = null;
        }
    }
    
    // If still in office (no exit for last entry)
    if (currentEntry) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const entryMinutes = timeToMinutes(currentEntry);
        totalMinutes += currentMinutes - entryMinutes;
    }
    
    return minutesToTimeString(totalMinutes);
}

// Utility functions
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

// Display problems
function displayMarcajesProblems(problems) {
    elements.marcajesProblems.style.display = 'block';
    elements.problemsList.innerHTML = '';
    
    problems.forEach((problem, index) => {
        const problemDiv = document.createElement('div');
        problemDiv.className = 'marcaje-item problematic';
        problemDiv.innerHTML = `
            <div>
                <strong>${problem.message}</strong><br>
                ${problem.entries.map(e => `${e.time} (${e.type})`).join(' → ')}
                <br><small>Time difference: ${problem.timeDiff} minutes</small>
            </div>
            <button class="marcaje-btn" onclick="fixProblem(${index})">Fix</button>
        `;
        elements.problemsList.appendChild(problemDiv);
    });
}

// Update marcajes status indicator
function updateMarcajesStatus(marcajes, hasError = false) {
    if (!elements.marcajesBadge) return;
    
    if (hasError) {
        elements.marcajesBadge.className = 'badge orange';
        elements.marcajesBadge.textContent = '⚠️';
        return;
    }
    
    const { problems } = processMarcajesData(marcajes);
    
    if (problems.length > 0) {
        elements.marcajesBadge.className = 'badge orange';
        elements.marcajesBadge.textContent = '⚠️';
    } else {
        elements.marcajesBadge.className = 'badge green';
        elements.marcajesBadge.textContent = '✓';
    }
}

// Export functionality
function exportMarcajes() {
    if (!cachedMarcajes) {
        alert('No marcajes data to export. Please refresh first.');
        return;
    }
    
    showExportModal();
}

function showExportModal() {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-content">
            <h3>Export Marcajes</h3>
            <p>Choose export format:</p>
            <div class="export-formats">
                <button class="format-btn" data-format="json">JSON</button>
                <button class="format-btn" data-format="csv">CSV</button>
                <button class="format-btn" data-format="xml">XML</button>
            </div>
            <div class="export-options">
                <label><input type="checkbox" id="includeLabels" checked> Include labels</label>
                <label><input type="checkbox" id="includeProblems"> Include problems</label>
            </div>
            <div style="margin-top: 15px;">
                <button class="button button-primary" onclick="doExport()">Export</button>
                <button class="button button-secondary" onclick="closeExportModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Format selection
    modal.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            modal.querySelectorAll('.format-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
}

function closeExportModal() {
    const modal = document.querySelector('.export-modal');
    if (modal) modal.remove();
}

function prepareExportData(includeLabels, includeProblems) {
    const { processed, problems } = processMarcajesData(cachedMarcajes);
    
    const data = {
        date: new Date().toISOString().split('T')[0],
        exportTime: new Date().toISOString(),
        entries: processed.map((entry, index) => ({
            time: entry.time,
            type: entry.type,
            typeDescription: entry.type === 'E' ? 'Entrada' : 'Salida',
            label: includeLabels ? getEntryLabel(entry, index) : null
        }))
    };
    
    if (includeProblems && problems.length > 0) {
        data.problems = problems;
    }
    
    return data;
}

function convertToCSV(data) {
    let csv = 'Time,Type,Description,Label\n';
    data.entries.forEach(entry => {
        csv += `${entry.time},${entry.type},${entry.typeDescription},${entry.label || ''}\n`;
    });
    return csv;
}

function convertToXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<marcajes>\n';
    xml += `  <date>${data.date}</date>\n`;
    xml += `  <exportTime>${data.exportTime}</exportTime>\n`;
    xml += '  <entries>\n';
    data.entries.forEach(entry => {
        xml += '    <entry>\n';
        xml += `      <time>${entry.time}</time>\n`;
        xml += `      <type>${entry.type}</type>\n`;
        xml += `      <description>${entry.typeDescription}</description>\n`;
        if (entry.label) xml += `      <label>${entry.label}</label>\n`;
        xml += '    </entry>\n';
    });
    xml += '  </entries>\n';
    xml += '</marcajes>';
    return xml;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Labeling functionality
function getEntryLabel(entry, index) {
    // Get labels from storage
    const labels = JSON.parse(localStorage.getItem('marcajesLabels') || '{}');
    const key = `${entry.time}_${entry.type}`;
    return labels[key] || null;
}

// Fix problems functionality
function fixMarcajesProblems() {
    if (confirm('This will automatically fix double entries/exits based on 5-minute rule. Continue?')) {
        const { processed } = processMarcajesData(cachedMarcajes);
        
        // Update cached data with fixed version
        const newEntries = processed.filter(e => e.type === 'E').map(e => e.time);
        const newExits = processed.filter(e => e.type === 'S').map(e => e.time);
        
        cachedMarcajes = {
            ...cachedMarcajes,
            entries: newEntries,
            exits: newExits
        };
        
        // Save fixed data
        chrome.storage.local.set({
            cachedMarcajes: cachedMarcajes,
            lastMarcajesUpdate: new Date().toISOString()
        });
        
        displayMarcajes(cachedMarcajes);
        updateMarcajesStatus(cachedMarcajes);
        
        alert('Problems fixed! The corrected data has been saved.');
    }
}

// Global functions for marcajes functionality - need to be accessible from HTML onclick handlers
window.editMarcajeLabel = function(index) {
    const processed = processMarcajesData(cachedMarcajes).processed;
    const entry = processed[index];
    if (!entry) return;
    
    const currentLabel = getEntryLabel(entry, index);
    const newLabel = prompt(`Add label for ${entry.type === 'E' ? 'Entrada' : 'Salida'} at ${entry.time}:`, currentLabel || '');
    
    if (newLabel !== null) {
        const labels = JSON.parse(localStorage.getItem('marcajesLabels') || '{}');
        const key = `${entry.time}_${entry.type}`;
        
        if (newLabel.trim()) {
            labels[key] = newLabel.trim();
        } else {
            delete labels[key];
        }
        
        localStorage.setItem('marcajesLabels', JSON.stringify(labels));
        displayMarcajes(cachedMarcajes); // Refresh display
    }
};

window.deleteMarcaje = function(index) {
    if (confirm('Are you sure you want to delete this marcaje entry?')) {
        // This would require server interaction in a real implementation
        alert('Delete functionality requires server integration');
    }
};

window.fixProblem = function(index) {
    if (confirm('Fix this specific problem?')) {
        alert('Individual problem fixing will be implemented with server integration');
    }
};

window.doExport = function() {
    const modal = document.querySelector('.export-modal');
    const selectedFormat = modal.querySelector('.format-btn.selected');
    const format = selectedFormat ? selectedFormat.dataset.format : 'json';
    
    const includeLabels = modal.querySelector('#includeLabels').checked;
    const includeProblems = modal.querySelector('#includeProblems').checked;
    
    const exportData = prepareExportData(includeLabels, includeProblems);
    
    let content, filename, mimeType;
    
    switch (format) {
        case 'json':
            content = JSON.stringify(exportData, null, 2);
            filename = `marcajes_${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
            break;
        case 'csv':
            content = convertToCSV(exportData);
            filename = `marcajes_${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            break;
        case 'xml':
            content = convertToXML(exportData);
            filename = `marcajes_${new Date().toISOString().split('T')[0]}.xml`;
            mimeType = 'application/xml';
            break;
    }
    
    downloadFile(content, filename, mimeType);
    closeExportModal();
};

window.closeExportModal = function() {
    const modal = document.querySelector('.export-modal');
    if (modal) modal.remove();
};
