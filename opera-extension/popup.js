/**
 * CucoExt - Smart Work Time Tracker
 * Popup script for Opera Extension
 * Handles UI interactions and status display
 * 
 * Copyright (c) 2024-2025 CucoExt Development Team
 * Licensed under CC BY-NC-SA 4.0
 * 
 * Commercial use requires explicit written permission.
 * Contact: dani.azemar+cucoextlicensing@gmail.com
 * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
 */

// Translations object - native texts for each language (same as Chrome)
const translations = {
    en: {
        title: "CucoExt", subtitle: "Smart Work Time Tracker",
        loading: "Loading...", checkingStatus: "Checking work status...",
        statusRefreshed: "Status refreshed successfully", lastUpdate: "Last updated", never: "Never",
        status: "Status", marcajes: "Marcajes", credentials: "Credentials",
        workingTime: "Working Time", presenceTime: "Presence Time", 
        remaining: "Remaining", theoreticalExit: "Expected Exit",
        canLeave: "You can leave work", timeToLeave: "Time to leave",
        keepWorking: "Continue working", notStarted: "Work not started",
        noEntryTimeDetected: "No entry time detected", noAdditionalDetails: "No additional details",
        canLeaveRequirementsCompleted: "Can leave - requirements completed",
        exactlyTimeToLeave: "Exactly time to leave!",
        credentialsExpiredClickRefresh: "Credentials expired - click to refresh",
        refreshStatus: "Refresh Status", openTimesheet: "Open Timesheet",
        autoExtractCredentials: "Auto-Extract Credentials", testCurrentPage: "Test Current Page",
        saveCredentials: "Save Credentials", clearCredentials: "Clear Credentials",
        saveConfiguration: "Save Configuration", languageLabel: "Interface Language", 
        autoBrowserLanguage: "Auto (Browser Language)", english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Working Hours Schedule", scheduleType: "Schedule Type",
        commonSchedule: "Common Schedule (8.5h + 6h Friday)",
        standardSchedule: "Standard Schedule (8h daily)",
        intensiveSchedule: "Intensive Schedule (6.5h daily)",
        autoDetectIntensive: "Auto-detect August intensive schedule",
        enableNotifications: "Enable work completion notifications",
        enableDebugLogs: "Enable debug console logs",
        credentialsConfigured: "Credentials configured",
        noCredentialsConfigured: "No credentials configured",
        configurationSaved: "Configuration saved successfully",
        errorPrefix: "Error", timesheetReminder: "Timesheet Reminder",
        workHoursComplete: "Your work hours are complete! Don't forget to fill your timesheet."
    },
    ca: {
        title: "CucoExt", subtitle: "Control Intel·ligent de Jornada",
        loading: "Carregant...", checkingStatus: "Comprovant estat de la jornada...",
        statusRefreshed: "Estat actualitzat correctament", lastUpdate: "Última actualització", never: "Mai",
        status: "Estat", marcajes: "Marcatges", credentials: "Credencials",
        workingTime: "Temps de Treball", presenceTime: "Temps de Presència",
        remaining: "Restant", theoreticalExit: "Sortida Prevista",
        canLeave: "Pots marxar de la feina", timeToLeave: "És hora de marxar",
        keepWorking: "Continua treballant", notStarted: "Jornada no iniciada",
        noEntryTimeDetected: "No s'ha detectat hora d'entrada", noAdditionalDetails: "Sense detalls addicionals",
        canLeaveRequirementsCompleted: "Pots marxar - requisits completats",
        exactlyTimeToLeave: "És exactament l'hora de marxar!",
        credentialsExpiredClickRefresh: "Credencials caducades - clica per actualitzar",
        refreshStatus: "Actualitzar Estat", openTimesheet: "Obrir Full d'Hores",
        autoExtractCredentials: "Extreure Credencials Automàticament", testCurrentPage: "Provar Pàgina Actual",
        saveCredentials: "Desar Credencials", clearCredentials: "Esborrar Credencials",
        saveConfiguration: "Desar Configuració", languageLabel: "Idioma de la Interfície", 
        autoBrowserLanguage: "Automàtic (Idioma del Navegador)", english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Horari de Treball", scheduleType: "Tipus d'Horari",
        commonSchedule: "Horari Comú (8,5h + 6h divendres)",
        standardSchedule: "Horari Estàndard (8h diàries)",
        intensiveSchedule: "Horari Intensiu (6,5h diàries)",
        autoDetectIntensive: "Horari intensiu d'agost automàtic",
        enableNotifications: "Notificacions de fi de jornada",
        enableDebugLogs: "Activar registres de depuració a la consola",
        credentialsConfigured: "Credencials configurades",
        noCredentialsConfigured: "No hi ha credencials configurades",
        configurationSaved: "Configuració desada correctament",
        errorPrefix: "Error", timesheetReminder: "Recordatori de Full d'Hores",
        workHoursComplete: "Les teves hores de treball estan completes! No oblidis omplir el teu full d'hores."
    },
    es: {
        title: "CucoExt", subtitle: "Control Inteligente de Jornada",
        loading: "Cargando...", checkingStatus: "Comprobando estado de la jornada...",
        statusRefreshed: "Estado actualizado correctamente", lastUpdate: "Última actualización", never: "Nunca",
        status: "Estado", marcajes: "Marcajes", credentials: "Credenciales",
        workingTime: "Tiempo de Trabajo", presenceTime: "Tiempo de Presencia",
        remaining: "Restante", theoreticalExit: "Salida Prevista",
        canLeave: "Puedes marcharte del trabajo", timeToLeave: "Es hora de marcharse",
        keepWorking: "Continúa trabajando", notStarted: "Jornada no iniciada",
        noEntryTimeDetected: "No se ha detectado hora de entrada", noAdditionalDetails: "Sin detalles adicionales",
        canLeaveRequirementsCompleted: "Puedes marcharte - requisitos completados",
        exactlyTimeToLeave: "¡Es exactamente la hora de marcharse!",
        credentialsExpiredClickRefresh: "Credenciales caducadas - clica para actualizar",
        refreshStatus: "Actualizar Estado", openTimesheet: "Abrir Hoja de Horas",
        autoExtractCredentials: "Extraer Credenciales Automáticamente", testCurrentPage: "Probar Página Actual",
        saveCredentials: "Guardar Credenciales", clearCredentials: "Borrar Credenciales",
        saveConfiguration: "Guardar Configuración", languageLabel: "Idioma de la Interfaz", 
        autoBrowserLanguage: "Automático (Idioma del Navegador)", english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Horario de Trabajo", scheduleType: "Tipo de Horario",
        commonSchedule: "Horario Común (8,5h + 6h viernes)",
        standardSchedule: "Horario Estándar (8h diarias)",
        intensiveSchedule: "Horario Intensivo (6,5h diarias)",
        autoDetectIntensive: "Detectar automáticamente el horario intensivo de agosto",
        enableNotifications: "Activar notificaciones de finalización de jornada",
        enableDebugLogs: "Activar registros de depuración en la consola",
        credentialsConfigured: "Credenciales configuradas",
        noCredentialsConfigured: "No hay credenciales configuradas",
        configurationSaved: "Configuración guardada correctamente",
        errorPrefix: "Error", timesheetReminder: "Recordatorio de Hoja de Horas",
        workHoursComplete: "¡Tus horas de trabajo están completas! No olvides rellenar tu hoja de horas."
    }
};

// Current language and translation functions
let currentLanguage = 'en';

function getBrowserLanguage() {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('ca')) return 'ca';
    return 'en';
}

function t(key) {
    const value = translations[currentLanguage][key];
    return value !== undefined ? value : (translations.en[key] || key);
}

// DOM elements
let elements = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadLanguageSettings();
    loadInitialState();
    setupEventListeners();
});

async function loadLanguageSettings() {
    try {
        const storage = await chrome.storage.local.get(['selectedLanguage']);
        const savedLanguage = storage.selectedLanguage;
        
        if (savedLanguage === 'auto' || !savedLanguage) {
            currentLanguage = getBrowserLanguage();
        } else {
            currentLanguage = savedLanguage;
        }
        
        updateAllUIText();
        
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = savedLanguage || 'auto';
        }
    } catch (error) {
        console.error('Error loading language settings:', error);
        currentLanguage = 'en';
        updateAllUIText();
    }
}

function updateAllUIText() {
    // Update header
    const headerTitle = document.querySelector('.header h1');
    const headerSubtitle = document.querySelector('.header p');
    if (headerTitle) headerTitle.textContent = t('title');
    if (headerSubtitle) headerSubtitle.textContent = t('subtitle');
    
    // Update status messages
    if (elements.statusMessage) elements.statusMessage.textContent = t('loading');
    if (elements.statusDetails) elements.statusDetails.textContent = t('checkingStatus');
    
    // Update tab labels (only text tabs, not icons)
    const statusTabBtn = document.getElementById('statusTab-btn');
    const credentialsTabBtn = document.getElementById('credentialsTab-btn');
    
    if (statusTabBtn) statusTabBtn.textContent = t('status');
    if (credentialsTabBtn) credentialsTabBtn.textContent = t('credentials');
    
    // Update time labels
    const timeLabels = document.querySelectorAll('.time-label');
    timeLabels.forEach((label, index) => {
        switch(index) {
            case 0: label.textContent = t('workingTime') + ':'; break;
            case 1: label.textContent = t('presenceTime') + ':'; break;
            case 2: label.textContent = t('remaining') + ':'; break;
            case 3: label.textContent = t('theoreticalExit') + ':'; break;
        }
    });
    
    // Update buttons
    const refreshText = document.getElementById('refreshText');
    if (refreshText) refreshText.textContent = t('refreshStatus');
    
    const openTimesheetBtn = document.getElementById('openTimeSheet-btn');
    if (openTimesheetBtn) openTimesheetBtn.innerHTML = '🕒 ' + t('openTimesheet');
    
    const extractCredBtn = document.getElementById('extractCredentials-btn');
    if (extractCredBtn) extractCredBtn.innerHTML = '🚀 ' + t('autoExtractCredentials');
    
    const testExtractionBtn = document.getElementById('testExtraction-btn');
    if (testExtractionBtn) testExtractionBtn.innerHTML = '🧪 ' + t('testCurrentPage');
    
    const saveCredBtn = document.getElementById('saveCredentials-btn');
    if (saveCredBtn) saveCredBtn.textContent = t('saveCredentials');
    
    const clearCredBtn = document.getElementById('clearCredentials-btn');
    if (clearCredBtn) clearCredBtn.textContent = t('clearCredentials');
    
    const saveConfigBtn = document.getElementById('saveConfiguration-btn');
    if (saveConfigBtn) saveConfigBtn.textContent = t('saveConfiguration');
    
    // Update form elements
    updateFormElements();
    
    // Update existing messages
    updateExistingMessages();
}

function updateFormElements() {
    // Language section
    const languageSectionTitle = document.getElementById('languageSectionTitle');
    if (languageSectionTitle) languageSectionTitle.textContent = t('languageLabel');
    
    const languageLabel = document.getElementById('languageLabel');
    if (languageLabel) languageLabel.textContent = t('languageLabel');
    
    // Working hours section
    const workingHoursTitle = document.getElementById('workingHoursScheduleTitle');
    if (workingHoursTitle) workingHoursTitle.textContent = t('workingHoursSchedule');
    
    const scheduleTypeLabel = document.getElementById('scheduleTypeLabel');
    if (scheduleTypeLabel) scheduleTypeLabel.textContent = t('scheduleType');
    
    // Language select options
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const options = languageSelect.querySelectorAll('option');
        options.forEach(option => {
            switch(option.value) {
                case 'auto': option.textContent = t('autoBrowserLanguage'); break;
                case 'en': option.textContent = t('english'); break;
                case 'ca': option.textContent = t('catalan'); break;
                case 'es': option.textContent = t('spanish'); break;
            }
        });
    }
    
    // Working hours select options
    const workingHoursSelect = document.getElementById('workingHoursSelect');
    if (workingHoursSelect) {
        const options = workingHoursSelect.querySelectorAll('option');
        options.forEach(option => {
            switch(option.value) {
                case 'common': option.textContent = t('commonSchedule'); break;
                case 'standard': option.textContent = t('standardSchedule'); break;
                case 'intensive': option.textContent = t('intensiveSchedule'); break;
            }
        });
    }
    
    // Checkbox labels using the new span IDs
    const autoDetectLabel = document.getElementById('autoDetectIntensiveLabel');
    if (autoDetectLabel) autoDetectLabel.textContent = t('autoDetectIntensive');
    
    const notificationsLabel = document.getElementById('notificationsEnabledLabel');
    if (notificationsLabel) notificationsLabel.textContent = t('enableNotifications');
    
    const debugLabel = document.getElementById('debugLogsEnabledLabel');
    if (debugLabel) debugLabel.textContent = t('enableDebugLogs');
}

function updateExistingMessages() {
    // Update timesheet reminder
    const timesheetTitle = document.querySelector('#timesheetReminder .section-title');
    if (timesheetTitle) timesheetTitle.textContent = '📋 ' + t('timesheetReminder');
    
    const timesheetText = document.querySelector('#timesheetReminder p');
    if (timesheetText) timesheetText.textContent = t('workHoursComplete');
}

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
        refreshLoading: document.getElementById('refreshLoading')
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

    // About tab button
    const aboutBtn = document.getElementById('aboutTab-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => showTab('about'));
    }

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
    
    // Language selection handler
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', async (e) => {
            const selectedLanguage = e.target.value;
            
            // Save language preference
            await chrome.storage.local.set({ selectedLanguage: selectedLanguage });
            
            // Update current language
            if (selectedLanguage === 'auto') {
                currentLanguage = getBrowserLanguage();
            } else {
                currentLanguage = selectedLanguage;
            }
            
            // Update all UI text
            updateAllUIText();
        });
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
    elements.statusDetails.textContent = translateStatusMessage(status.message || 'No additional details');
    
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
    const statusMap = {
        'WORKING': t('keepWorking'),
        'OUT_OF_OFFICE': t('notStarted'),
        'CAN_LEAVE': t('canLeave'),
        'TIME_TO_LEAVE': t('timeToLeave'),
        'NOT_WORKING': t('notStarted'),
        'CREDENTIALS_EXPIRED': t('errorPrefix'),
        'ERROR': t('errorPrefix')
    };
    
    return statusMap[status] || status;
}

function translateStatusMessage(message) {
    // Translate common status messages from core-integration
    const messageMap = {
        'No entry time detected': t('noEntryTimeDetected'),
        'No additional details': t('noAdditionalDetails'),
        'Can leave - requirements completed': t('canLeaveRequirementsCompleted'),
        'Exactly time to leave!': t('exactlyTimeToLeave'),
        'Credentials expired - click to refresh': t('credentialsExpiredClickRefresh')
    };
    
    // Handle dynamic messages with patterns
    if (message.includes('Out of office -') && message.includes('remaining')) {
        const remainingPart = message.split('Out of office - ')[1];
        return `${t('notStarted')} - ${remainingPart}`;
    }
    
    if (message.includes('Working -') && message.includes('remaining')) {
        const remainingPart = message.split('Working - ')[1];
        return `${t('keepWorking')} - ${remainingPart}`;
    }
    
    if (message.includes('Can leave in') && message.includes('minutes')) {
        const minutesPart = message.split('Can leave in ')[1];
        return `${t('canLeave')} en ${minutesPart}`;
    }
    
    // Return translated message if found, otherwise return original
    return messageMap[message] || message;
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
