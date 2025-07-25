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

// Translations object - native texts for each language
const translations = {
    en: {
        // Header and basic info
        title: "CucoExt", subtitle: "Smart Work Time Tracker",
        
        // Status messages
        loading: "Loading...", checkingStatus: "Checking work status...",
        statusRefreshed: "Status refreshed successfully", lastUpdate: "Last updated", never: "Never",
        
        // Tab names
        status: "Status", marcajes: "Marcajes", credentials: "Credentials",
        
        // Time labels
        workingTime: "Working Time", presenceTime: "Presence Time", 
        remaining: "Remaining", theoreticalExit: "Expected Exit",
        
        // Status messages
        canLeave: "You can leave work", timeToLeave: "Time to leave",
        keepWorking: "Working...", notStarted: "Work not started",
        workShiftEnded: "Work shift ended",
        
        // Status detail messages
        noEntryTimeDetected: "No entry time detected", noAdditionalDetails: "No additional details",
        canLeaveRequirementsCompleted: "Can leave - requirements completed",
        exactlyTimeToLeave: "Exactly time to leave!",
        credentialsExpiredClickRefresh: "Credentials expired - click to refresh",
        
        // Buttons
        refreshStatus: "Refresh Status", openTimesheet: "Open Timesheet",
        autoExtractCredentials: "Auto-Extract Credentials", testCurrentPage: "Test Current Page",
        saveCredentials: "Save Credentials", clearCredentials: "Clear Credentials",
        saveConfiguration: "Save Configuration", refreshMarcajes: "Refresh Records",
        export: "Export", fixProblems: "Fix Issues",
        
        // Configuration
        languageLabel: "Interface Language", autoBrowserLanguage: "Auto (Browser Language)",
        english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Working Hours Schedule", scheduleType: "Schedule Type",
        commonSchedule: "Common Schedule (8.5h + 6h Friday)",
        standardSchedule: "Standard Schedule (8h daily)",
        intensiveSchedule: "Intensive Schedule (6.5h daily)",
        autoDetectIntensive: "Auto-detect August intensive schedule",
        enableNotifications: "Enable work completion notifications",
        enableDebugLogs: "Enable debug console logs",
        
        // Debug section
        debugSection: "Debug Settings",
        debugLogsEnabled: "Enable debug console logs",
        debugLogsEnabledLabel: "Enable debug console logs",
        enableCustomMarcajes: "Enable custom debug marcajes",
        customMarcajesEnabled: "Enable custom debug marcajes",
        customMarcajesEnabledLabel: "Enable custom debug marcajes",
        bypassCredentialsEnabled: "Bypass credential validation",
        bypassCredentialsEnabledLabel: "Bypass credential validation",
        customMarcajesLabel: "Custom Marcajes Data (JSON or Timestamp Format)",
        customMarcajesPlaceholder: "⚠️ Debug mode will disable real data fetching from Cuco360\n\nSupported formats:\n• Timestamp format: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• JSON format: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entry, S = Exit. Use 'Load Sample Data' for an example.",
        debugModeActive: "Debug mode active",
        debugWarning: "Debug mode will disable real data fetching from Cuco360",
        loadSampleData: "Load Sample Data",
        
        // Messages
        credentialsConfigured: "Credentials configured",
        noCredentialsConfigured: "No credentials configured",
        configurationSaved: "Configuration saved successfully",
        errorPrefix: "Error", timesheetReminder: "Timesheet Reminder",
        workHoursComplete: "Your work hours are complete! Don't forget to fill your timesheet."
    },
    
    ca: {
        // Header and basic info
        title: "CucoExt", subtitle: "Control Intel·ligent de Jornada",
        
        // Status messages
        loading: "Carregant...", checkingStatus: "Comprovant estat de la jornada...",
        statusRefreshed: "Estat actualitzat correctament", lastUpdate: "Última actualització", never: "Mai",
        
        // Tab names
        status: "Estat", marcajes: "Marcatges", credentials: "Credencials",
        
        // Time labels
        workingTime: "Temps Treballant", presenceTime: "Temps de Presència",
        remaining: "Restant", theoreticalExit: "Sortida Prevista",
        
        // Status messages
        canLeave: "Pots marxar de la feina", timeToLeave: "És hora de marxar",
        keepWorking: "Continua treballant", notStarted: "Jornada no iniciada",
        workShiftEnded: "Jornada finalitzada",
        
        // Status detail messages
        noEntryTimeDetected: "No s'ha detectat hora d'entrada", noAdditionalDetails: "Sense detalls addicionals",
        canLeaveRequirementsCompleted: "Pots marxar - requisits completats",
        exactlyTimeToLeave: "És exactament l'hora de marxar!",
        credentialsExpiredClickRefresh: "Credencials caducades - clica per actualitzar",
        
        // Buttons
        refreshStatus: "Actualitzar Estat", openTimesheet: "Obrir Full d'Hores",
        autoExtractCredentials: "Extreure Credencials Automàticament", testCurrentPage: "Provar Pàgina Actual",
        saveCredentials: "Desar Credencials", clearCredentials: "Esborrar Credencials",
        saveConfiguration: "Desar Configuració", refreshMarcajes: "Actualitzar Marcatges",
        export: "Exportar", fixProblems: "Corregir Problemes",
        
        // Configuration
        languageLabel: "Idioma de la Interfície", autoBrowserLanguage: "Automàtic (Idioma del Navegador)",
        english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Horari de Treball", scheduleType: "Tipus d'Horari",
        commonSchedule: "Horari Comú (8,5h + 6h divendres)",
        standardSchedule: "Horari Estàndard (8h diàries)",
        intensiveSchedule: "Horari Intensiu (6,5h diàries)",
        autoDetectIntensive: "Horari intensiu d'agost automàtic",
        enableNotifications: "Notificacions de fi de jornada",
        enableDebugLogs: "Activar registres de depuració a la consola",
        
        // Debug section
        debugSection: "Configuració de Depuració",
        debugLogsEnabled: "Activar registres de depuració a la consola",
        debugLogsEnabledLabel: "Activar registres de depuració a la consola",
        enableCustomMarcajes: "Activar marcatges personalitzats per depurar",
        customMarcajesEnabled: "Activar marcatges personalitzats per depurar",
        customMarcajesEnabledLabel: "Activar marcatges personalitzats per depurar",
        bypassCredentialsEnabled: "Ometre validació de credencials en mode depuració",
        bypassCredentialsEnabledLabel: "Ometre validació de credencials en mode depuració",
        customMarcajesLabel: "Dades de Marcatges Personalitzats (JSON o Format Timestamp)",
        customMarcajesPlaceholder: "⚠️ El mode de depuració desactivarà la descàrrega de dades reals de Cuco360\n\nFormats suportats:\n• Format timestamp: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• Format JSON: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entrada, S = Sortida. Utilitza 'Carregar Dades d'Exemple' per veure un exemple.",
        debugModeActive: "Mode de depuració actiu",
        debugWarning: "El mode de depuració desactivarà la descàrrega de dades reals de Cuco360",
        loadSampleData: "Carregar Dades d'Exemple",
        
        // Messages
        credentialsConfigured: "Credencials configurades",
        noCredentialsConfigured: "No hi ha credencials configurades",
        configurationSaved: "Configuració desada correctament",
        errorPrefix: "Error", timesheetReminder: "Recordatori de Full d'Hores",
        workHoursComplete: "Les teves hores de treball estan completes! No oblidis omplir el teu full d'hores."
    },
    
    es: {
        // Header and basic info
        title: "CucoExt", subtitle: "Control Inteligente de Jornada",
        
        // Status messages
        loading: "Cargando...", checkingStatus: "Comprobando estado de la jornada...",
        statusRefreshed: "Estado actualizado correctamente", lastUpdate: "Última actualización", never: "Nunca",
        
        // Tab names
        status: "Estado", marcajes: "Marcajes", credentials: "Credenciales",
        
        // Time labels
        workingTime: "Tiempo de Trabajo", presenceTime: "Tiempo de Presencia",
        remaining: "Restante", theoreticalExit: "Salida Prevista",
        
        // Status messages
        canLeave: "Puedes marcharte del trabajo", timeToLeave: "Es hora de marcharse",
        keepWorking: "Continúa trabajando", notStarted: "Jornada no iniciada",
        workShiftEnded: "Jornada finalizada",
        
        // Status detail messages
        noEntryTimeDetected: "No se ha detectado hora de entrada", noAdditionalDetails: "Sin detalles adicionales",
        canLeaveRequirementsCompleted: "Puedes marcharte - requisitos completados",
        exactlyTimeToLeave: "¡Es exactamente la hora de marcharse!",
        credentialsExpiredClickRefresh: "Credenciales caducadas - clica para actualizar",
        
        // Buttons
        refreshStatus: "Actualizar Estado", openTimesheet: "Abrir Hoja de Horas",
        autoExtractCredentials: "Extraer Credenciales Automáticamente", testCurrentPage: "Probar Página Actual",
        saveCredentials: "Guardar Credenciales", clearCredentials: "Borrar Credenciales",
        saveConfiguration: "Guardar Configuración", refreshMarcajes: "Actualizar Marcajes",
        export: "Exportar", fixProblems: "Corregir Problemas",
        
        // Configuration
        languageLabel: "Idioma de la Interfaz", autoBrowserLanguage: "Automático (Idioma del Navegador)",
        english: "English", catalan: "Català", spanish: "Español",
        workingHoursSchedule: "Horario de Trabajo", scheduleType: "Tipo de Horario",
        commonSchedule: "Horario Común (8,5h + 6h viernes)",
        standardSchedule: "Horario Estándar (8h diarias)",
        intensiveSchedule: "Horario Intensivo (6,5h diarias)",
        autoDetectIntensive: "Detectar automáticamente el horario intensivo de agosto",
        enableNotifications: "Activar notificaciones de finalización de jornada",
        enableDebugLogs: "Activar registros de depuración en la consola",
        
        // Debug section
        debugSection: "Configuración de Depuración",
        debugLogsEnabled: "Activar registros de depuración en la consola",
        debugLogsEnabledLabel: "Activar registros de depuración en la consola",
        enableCustomMarcajes: "Activar marcajes personalizados de depuración",
        customMarcajesEnabled: "Activar marcajes personalizados de depuración",
        customMarcajesEnabledLabel: "Activar marcajes personalizados de depuración",
        bypassCredentialsEnabled: "Omitir validación de credenciales en modo depuración",
        bypassCredentialsEnabledLabel: "Omitir validación de credenciales en modo depuración",
        customMarcajesLabel: "Datos de Marcajes Personalizados (JSON o Formato Timestamp)",
        customMarcajesPlaceholder: "⚠️ El modo de depuración desactivará la descarga de datos reales de Cuco360\n\nFormatos soportados:\n• Formato timestamp: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• Formato JSON: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entrada, S = Salida. Usa 'Cargar Datos de Ejemplo' para ver un ejemplo.",
        debugModeActive: "Modo de depuración activo",
        debugWarning: "El modo de depuración desactivará la descarga de datos reales de Cuco360",
        loadSampleData: "Cargar Datos de Ejemplo",
        
        // Messages
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
    if (elements.statusDetails) elements.statusDetails.innerHTML = t('checkingStatus');
    
    // Update tab labels
    const statusTabBtn = document.getElementById('statusTab-btn');
    const marcajesTabBtn = document.getElementById('marcajesTab-btn');
    const credentialsTabBtn = document.getElementById('credentialsTab-btn');
    
    if (statusTabBtn) statusTabBtn.textContent = t('status');
    if (marcajesTabBtn) marcajesTabBtn.textContent = t('marcajes');
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
    
    const customMarcajesLabel = document.getElementById('customMarcajesEnabledLabel');
    if (customMarcajesLabel) customMarcajesLabel.textContent = t('enableCustomMarcajes');
    
    const bypassCredentialsLabel = document.getElementById('bypassCredentialsEnabledLabel');
    if (bypassCredentialsLabel) bypassCredentialsLabel.textContent = t('bypassCredentialsEnabled');
    
    // Debug section elements
    const debugSectionTitle = document.getElementById('debugSectionTitle');
    if (debugSectionTitle) debugSectionTitle.textContent = '🐛 ' + t('debugSection');
    
    const customMarcajesDataLabel = document.getElementById('customMarcajesLabel');
    if (customMarcajesDataLabel) customMarcajesDataLabel.textContent = t('customMarcajesLabel');
    
    const customMarcajesInputEl = document.getElementById('customMarcajesInput');
    if (customMarcajesInputEl) customMarcajesInputEl.placeholder = t('customMarcajesPlaceholder');
    
    const saveDebugConfigBtn = document.getElementById('saveDebugConfiguration-btn');
    if (saveDebugConfigBtn) saveDebugConfigBtn.textContent = t('saveConfiguration');
    
    const loadSampleMarcajesBtn = document.getElementById('loadSampleMarcajes-btn');
    if (loadSampleMarcajesBtn) loadSampleMarcajesBtn.textContent = t('loadSampleData');
}

function updateExistingMessages() {
    // Update timesheet reminder
    const timesheetTitle = document.querySelector('#timesheetReminder .section-title');
    if (timesheetTitle) timesheetTitle.textContent = '📋 ' + t('timesheetReminder');
    
    const timesheetText = document.querySelector('#timesheetReminder p');
    if (timesheetText) timesheetText.textContent = t('workHoursComplete');
}

// Debug notification functions
function showDebugNotification() {
    if (elements.debugNotification) {
        elements.debugNotification.classList.remove('hidden');
    }
}

function hideDebugNotification() {
    if (elements.debugNotification) {
        elements.debugNotification.classList.add('hidden');
    }
}

// Debug configuration functions
function updateDebugUIState() {
    const isCustomMarcajesEnabled = elements.customMarcajesEnabled.checked;
    const isDebugSettingsVisible = document.getElementById('showDebugSettings')?.checked || false;
    
    // Show/hide custom marcajes input group
    if (isCustomMarcajesEnabled) {
        elements.customMarcajesGroup.classList.remove('hidden');
        // debugActiveIndicator is now commented out - no longer used for reduced clutter
        // elements.debugActiveIndicator.classList.remove('hidden');
        // debugWarningSection is now inside customMarcajesGroup, so no separate control needed
        // elements.debugWarningSection.classList.remove('hidden');
        // Only show notification if debug settings are visible/enabled
        if (isDebugSettingsVisible) {
            showDebugNotification();
        } else {
            hideDebugNotification();
        }
    } else {
        elements.customMarcajesGroup.classList.add('hidden');
        // debugActiveIndicator is now commented out - no longer used
        // elements.debugActiveIndicator.classList.add('hidden');
        // debugWarningSection is now inside customMarcajesGroup, so no separate control needed
        // elements.debugWarningSection.classList.add('hidden');
        hideDebugNotification();
    }
}

async function saveDebugConfiguration() {
    const debugLogsEnabled = elements.debugLogsEnabled.checked;
    const customMarcajesEnabled = elements.customMarcajesEnabled.checked;
    const bypassCredentialsEnabled = elements.bypassCredentialsEnabled.checked;
    const customMarcajesData = elements.customMarcajesInput.value.trim();
    
    try {
        // Validate custom marcajes data if enabled
        if (customMarcajesEnabled && customMarcajesData) {
            try {
                convertCustomMarcajesToJSON(customMarcajesData);
            } catch (error) {
                throw new Error(`Invalid marcajes data: ${error.message}`);
            }
        }
        
        // Save debug settings
        await chrome.storage.local.set({ 
            debugLogsEnabled: debugLogsEnabled,
            customMarcajesEnabled: customMarcajesEnabled,
            bypassCredentialsEnabled: bypassCredentialsEnabled,
            customMarcajesData: customMarcajesData
        });
        
        // Update UI state
        updateDebugUIState();
        
        showMessage(elements.debugConfigMessage, t('configurationSaved'), 'success');
    } catch (error) {
        console.error('Error saving debug configuration:', error);
        showMessage(elements.debugConfigMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
    }
}

function convertCustomMarcajesToJSON(timestampData) {
    try {
        // First, try to parse it as JSON (backward compatibility)
        const parsed = JSON.parse(timestampData);
        return parsed;
    } catch (e) {
        // If not JSON, parse as timestamp format
        const timestamps = parseCustomMarcajesTimestamps(timestampData);
        
        // Convert to the format expected by the extension
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        return {
            fecha: todayStr,
            entries: timestamps.entries,
            exits: timestamps.exits,
            workingMinutes: 0, // Will be calculated by the backend
            presenceMinutes: 0  // Will be calculated by the backend
        };
    }
}

function parseCustomMarcajesTimestamps(detailStr) {
    if (!detailStr) return { entries: [], exits: [] };
    
    const rawEntries = [];
    const rawExits = [];
    
    // First pass: extract all timestamps chronologically
    const timestamps = detailStr.split('|').map(t => t.trim()).filter(t => t);
    const timeEntries = [];
    
    for (const timestamp of timestamps) {
        const match = timestamp.match(/(\d{2}:\d{2}:\d{2})\s+([ES])/);
        if (match) {
            const timeStr = match[1];
            const type = match[2];
            const timeInMinutes = timeToMinutes(timeStr);
            
            timeEntries.push({
                time: timeStr,
                type: type,
                timeInMinutes: timeInMinutes
            });
        }
    }
    
    // Sort by time to ensure chronological order
    timeEntries.sort((a, b) => a.timeInMinutes - b.timeInMinutes);
    
    // Second pass: collapse only truly consecutive entries/exits (same type in a row)
    const finalEntries = [];
    const finalExits = [];
    
    let lastType = null;
    
    for (const entry of timeEntries) {
        if (entry.type === 'E') {
            if (lastType !== 'E') {
                finalEntries.push(entry.time);
            }
            lastType = 'E';
        } else if (entry.type === 'S') {
            if (lastType !== 'S') {
                finalExits.push(entry.time);
            }
            lastType = 'S';
        }
    }
    
    return { entries: finalEntries, exits: finalExits };
}

function timeToMinutes(timeStr) {
    if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
    const parts = timeStr.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    return hours * 60 + minutes;
}

function loadSampleMarcajes() {
    const sampleTimestampData = "09:20:08 E 000 | 09:29:03 S 000 | 09:43:59 E 000 | 11:13:14 S 000 | 11:15:01 E 000 | 12:04:43 S 000 | 12:06:29 E 000 | 13:11:04 S 000 | 13:13:09 E 000 | 13:37:44 S 000 | 13:40:29 E 000 | 14:15:13 S 000 | 14:17:08 E 000 | 14:30:41 S 000 | 14:30:48 S 000 | 14:32:40 E 000 | 14:33:06 S 000 | 14:36:03 E 000 |";
    elements.customMarcajesInput.value = sampleTimestampData;
}

// Toggle debug settings visibility and temporarily disable debug features
function toggleDebugSettingsVisibility() {
    const checkbox = document.getElementById('showDebugSettings');
    const content = document.getElementById('debugSettingsContent');
    
    if (checkbox && content) {
        // Save the toggle state
        chrome.storage.local.set({ showDebugSettings: checkbox.checked });
        
        if (checkbox.checked) {
            content.style.display = 'block';
            // Re-enable debug features when shown
            enableDebugFeatures();
        } else {
            content.style.display = 'none';
            // Temporarily disable debug features when hidden
            disableDebugFeatures();
        }
        
        // Update debug UI state to show/hide notification badge
        updateDebugUIState();
    }
}

// Temporarily disable debug features without losing configuration
function disableDebugFeatures() {
    // Store current debug state temporarily
    chrome.storage.local.get(['debugLogsEnabled', 'customMarcajesEnabled', 'bypassCredentialsEnabled'], function(result) {
        // Store the current state in a temporary key
        chrome.storage.local.set({
            tempDebugState: {
                debugLogsEnabled: result.debugLogsEnabled || false,
                customMarcajesEnabled: result.customMarcajesEnabled || false,
                bypassCredentialsEnabled: result.bypassCredentialsEnabled || false
            },
            // Temporarily disable all debug features
            debugLogsEnabled: false,
            customMarcajesEnabled: false,
            bypassCredentialsEnabled: false
        });
    });
}

// Re-enable debug features from saved configuration
function enableDebugFeatures() {
    chrome.storage.local.get(['tempDebugState'], function(result) {
        if (result.tempDebugState) {
            // Restore the previous debug state
            chrome.storage.local.set({
                debugLogsEnabled: result.tempDebugState.debugLogsEnabled,
                customMarcajesEnabled: result.tempDebugState.customMarcajesEnabled,
                bypassCredentialsEnabled: result.tempDebugState.bypassCredentialsEnabled
            });
        }
    });
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
        customMarcajesEnabled: document.getElementById('customMarcajesEnabled'),
        bypassCredentialsEnabled: document.getElementById('bypassCredentialsEnabled'),
        customMarcajesInput: document.getElementById('customMarcajesInput'),
        customMarcajesGroup: document.getElementById('customMarcajesGroup'),
        // debugActiveIndicator: document.getElementById('debugActiveIndicator'), // Commented out - disabled for reduced clutter
        // debugWarningSection: document.getElementById('debugWarningSection'), // Removed - warning text moved to placeholder
        configTabBtn: document.getElementById('configTab-btn'),
        debugNotification: document.getElementById('debugNotification'),
        debugConfigMessage: document.getElementById('debugConfigMessage'),
        credentialsMessage: document.getElementById('credentialsMessage'),
        configMessage: document.getElementById('configMessage'),
        refreshText: document.getElementById('refreshText'),
        refreshLoading: document.getElementById('refreshLoading')
    };
}

async function loadInitialState() {
    try {
        // Load stored status
        const storage = await chrome.storage.local.get(['lastStatus', 'lastUpdate', 'credentials', 'workingHoursSet', 'autoDetectIntensive', 'notificationsEnabled', 'debugLogsEnabled', 'customMarcajesEnabled', 'customMarcajesData', 'bypassCredentialsEnabled', 'showDebugSettings']);
        
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
        
        // Load debug configuration
        if (storage.customMarcajesEnabled !== undefined) {
            elements.customMarcajesEnabled.checked = storage.customMarcajesEnabled;
        } else {
            elements.customMarcajesEnabled.checked = false; // default disabled
        }
        
        if (storage.customMarcajesData) {
            elements.customMarcajesInput.value = storage.customMarcajesData;
        }
        
        // Load bypass credentials setting
        if (storage.bypassCredentialsEnabled !== undefined) {
            elements.bypassCredentialsEnabled.checked = storage.bypassCredentialsEnabled;
        } else {
            elements.bypassCredentialsEnabled.checked = false; // default disabled
        }
        
        // Load debug settings visibility toggle
        const showDebugCheckbox = document.getElementById('showDebugSettings');
        if (showDebugCheckbox) {
            if (storage.showDebugSettings !== undefined) {
                showDebugCheckbox.checked = storage.showDebugSettings;
            } else {
                showDebugCheckbox.checked = false; // default hidden
            }
            // Apply the toggle state without triggering disable/enable
            const content = document.getElementById('debugSettingsContent');
            if (content) {
                content.style.display = showDebugCheckbox.checked ? 'block' : 'none';
            }
        }
        
        // Update debug UI state
        updateDebugUIState();
        
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

    // Semaphore click for status override
    const semaphore = document.getElementById('semaphore');
    if (semaphore) {
        semaphore.addEventListener('click', handleSemaphoreClick);
        semaphore.style.cursor = 'pointer';
        semaphore.title = 'Click to override "Time to Leave" status';
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

    // Debug configuration event listeners
    const customMarcajesEnabledCheckbox = document.getElementById('customMarcajesEnabled');
    if (customMarcajesEnabledCheckbox) {
        customMarcajesEnabledCheckbox.addEventListener('change', updateDebugUIState);
    }
    
    const saveDebugConfigBtn = document.getElementById('saveDebugConfiguration-btn');
    if (saveDebugConfigBtn) {
        saveDebugConfigBtn.addEventListener('click', saveDebugConfiguration);
    }
    
    const loadSampleMarcajesBtn = document.getElementById('loadSampleMarcajes-btn');
    if (loadSampleMarcajesBtn) {
        loadSampleMarcajesBtn.addEventListener('click', loadSampleMarcajes);
    }
    
    // Debug section toggle functionality
    const showDebugSettingsCheckbox = document.getElementById('showDebugSettings');
    if (showDebugSettingsCheckbox) {
        showDebugSettingsCheckbox.addEventListener('change', toggleDebugSettingsVisibility);
    }
    
    // Make toggle function globally accessible for inline onclick (backup)
    window.toggleDebugSettingsVisibility = toggleDebugSettingsVisibility;
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

// Check if debug mode is active with custom marcajes data
async function isDebugModeActive() {
    const storage = await chrome.storage.local.get(['customMarcajesEnabled', 'customMarcajesData']);
    return storage.customMarcajesEnabled && storage.customMarcajesData && storage.customMarcajesData.trim() !== '';
}

// Status management
async function refreshStatus() {
    console.log('🔧 DEBUG: Popup refresh status called');
    setLoading(true);
    
    try {
        // Check if debug mode is active
        const debugMode = await isDebugModeActive();
        if (debugMode) {
            // In debug mode, show a message indicating status refresh is disabled
            showMessage(elements.credentialsMessage, '🐛 Debug mode active - Status refresh disabled', 'warning', 3000);
            setLoading(false);
            return;
        }
        
        console.log('🔧 DEBUG: Sending forceUpdate message to background');
        const response = await sendMessage({ action: 'forceUpdate' });
        console.log('🔧 DEBUG: Got response from background:', response);
        
        if (response.success) {
            console.log('🔧 DEBUG: Updating status display with:', response.data);
            updateStatusDisplay(response.data);
            updateLastUpdateTime(new Date().toISOString());
            showMessage(elements.credentialsMessage, t('statusRefreshed'), 'success', 3000);
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

// Handle semaphore click to override "Time to leave" status
async function handleSemaphoreClick() {
    try {
        // Only allow override for TIME_TO_LEAVE status
        const currentStatus = await sendMessage({ action: 'getLastStatus' });
        
        if (currentStatus && currentStatus.data && currentStatus.data.status === 'TIME_TO_LEAVE') {
            // Set override flag for today
            const today = new Date().toDateString();
            await chrome.storage.local.set({
                timeToLeaveOverride: true,
                overrideDate: today
            });
            
            console.log('🔧 DEBUG: Time to leave override activated for today');
            
            // Refresh status to apply override
            await refreshStatus();
            
            // Show brief confirmation
            const semaphore = document.getElementById('semaphore');
            const originalText = semaphore.textContent;
            semaphore.textContent = '✅';
            setTimeout(() => {
                semaphore.textContent = originalText;
            }, 1000);
        }
    } catch (error) {
        console.error('Error handling semaphore click:', error);
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
        'WORK_SHIFT_ENDED': '⚫',
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
    elements.statusDetails.innerHTML = translateStatusMessage(status.message || 'No additional details');
    
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
        'WORK_SHIFT_ENDED': t('workShiftEnded'),
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
        
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
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
            const connectionTest = await browser.tabs.sendMessage(currentTab.id, { 
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
                        browser.tabs.sendMessage(currentTab.id, { action: 'startExtraction' });
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
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        
        if (currentTab && currentTab.url.includes('cuco360.cucorent.com')) {
            console.log('🎯 User is already on Cuco360 page, extracting from current tab');
            showMessage(elements.credentialsMessage, 
                'Detected Cuco360 page! Starting extraction from current page...', 
                'info', 0);
            
            // Send extraction request to current tab
            try {
                const response = await browser.tabs.sendMessage(currentTab.id, { action: 'startExtraction' });
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
                browser.runtime.onMessage.removeListener(handleExtractionResult);
                
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
        
        browser.runtime.onMessage.addListener(handleExtractionResult);
        
        // Set timeout for extraction
        setTimeout(() => {
            browser.runtime.onMessage.removeListener(handleExtractionResult);
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
    const tab = await browser.tabs.create({ 
        url: extractionUrl,
        active: true 
    });
    
    showMessage(elements.credentialsMessage, 
        'Cuco360 opened! Please log in and wait for automatic extraction...', 
        'info', 0);
    
    // Listen for extraction results
    const handleExtractionResult = (message, sender, sendResponse) => {
        if (message.action === 'credentialsExtracted' && sender.tab.id === tab.id) {
            browser.runtime.onMessage.removeListener(handleExtractionResult);
            
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
    
    browser.runtime.onMessage.addListener(handleExtractionResult);
    
    // Set timeout for extraction
    setTimeout(() => {
        browser.runtime.onMessage.removeListener(handleExtractionResult);
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
            showMessage(elements.configMessage, t('configurationSaved'), 'success');
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
        browser.runtime.sendMessage(message, (response) => {
            resolve(response || { success: false, error: 'No response' });
        });
    });
}

// TimeSheet functionality
async function openTimeSheet() {
    const timesheetUrl = 'https://wigos-timesheet.winsysgroup.com/';
    
    try {
        await browser.tabs.create({ url: timesheetUrl });
        console.log('TimeSheet opened in new tab');
    } catch (error) {
        console.error('Error opening timesheet:', error);
        alert('Error opening timesheet. Please check your browser permissions.');
    }
}
