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

// Translations object - native texts for each language
const translations = {
    en: {
        // Header and basic info
        title: "CucoExt",
        subtitle: "Smart Work Time Tracker",
        
        // Status messages
        loading: "Loading...",
        checkingStatus: "Checking work status...",
        statusRefreshed: "Status refreshed successfully",
        lastUpdate: "Last updated",
        never: "Never",
        
        // Tab names
        status: "Status",
        marcajes: "Marcajes",
        credentials: "Credentials",
        
        // Time labels
        workingTime: "Working Time",
        presenceTime: "Presence Time", 
        remaining: "Remaining",
        theoreticalExit: "Expected Exit",
        
        // Status messages
        canLeave: "Can leave now",
        timeToLeave: "Time to leave",
        prepareToLeave: "Prepare to leave",
        keepWorking: "Working...",
        notStarted: "Work not started",
        outOfOffice: "Out of office",
        workShiftEnded: "Work shift ended",
        
        // Status detail messages
        noEntryTimeDetected: "No entry time detected",
        noAdditionalDetails: "No additional details",
        canLeaveRequirementsCompleted: "Can leave - requirements completed",
        exactlyTimeToLeave: "Exactly time to leave!",
        credentialsExpiredClickRefresh: "Credentials expired - click to refresh",
        
        // Buttons
        refreshStatus: "Refresh Status",
        openTimesheet: "Open Timesheet",
        autoExtractCredentials: "Auto-Extract Credentials",
        testCurrentPage: "Test Current Page",
        saveCredentials: "Save Credentials",
        clearCredentials: "Clear Credentials",
        saveConfiguration: "Save Configuration",
        refreshMarcajes: "Refresh Records",
        export: "Export",
        fixProblems: "Fix Issues",
        
        // Credential section
        automatedExtraction: "Automated Extraction",
        autoExtractDescription: "Click to open Cuco360 and automatically extract credentials.",
        manualCredentials: "Manual Credentials",
        csrfToken: "CSRF Token",
        tokenPlaceholder: "Enter token from browser",
        cookies: "Cookies",
        cookiesPlaceholder: "Enter cookies string",
        clientCode: "Company Code",
        clientCodePlaceholder: "Your company's client code",
        
        // Configuration section
        languageLabel: "Interface Language",
        autoBrowserLanguage: "Auto (Browser Language)",
        english: "English",
        catalan: "Català",
        spanish: "Español",
        
        workingHoursSchedule: "Working Hours Schedule",
        scheduleType: "Schedule Type",
        commonSchedule: "Common Schedule (8.5h + 6h Friday)",
        standardSchedule: "Standard Schedule (8h daily)",
        intensiveSchedule: "Intensive Schedule (6.5h daily)",
        autoDetectIntensive: "Auto-detect August intensive schedule",
        enableNotifications: "Enable work completion notifications",
        enableDebugLogs: "Enable debug console logs",
        
        // Debug section
        debugSection: "Debug Settings",
        enableCustomMarcajes: "Enable custom debug marcajes",
        bypassCredentialsEnabled: "Bypass credential validation",
        customMarcajesLabel: "Custom Marcajes Data (JSON or Timestamp Format)",
        customMarcajesPlaceholder: "⚠️ Debug mode will disable real data fetching from Cuco360\n\nSupported formats:\n• Timestamp format: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• JSON format: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entry, S = Exit. Use 'Load Sample Data' for an example.",
        debugModeActive: "Debug mode active",
        debugWarning: "Debug mode will disable real data fetching from Cuco360",
        loadSampleData: "Load Sample Data",
        
        // Marcajes section
        entriesAndExits: "Entries and Exits",
        refreshMarcajesInfo: "Click \"Refresh Records\" to load today's entries and exits",
        todaysMarcajes: "Today's Records",
        entries: "Entries",
        exits: "Exits",
        presenceTimeLabel: "Presence time",
        offlineMode: "Offline Mode",
        
        // Problems section
        problematicEntries: "Problematic Entries",
        doubleEntriesDetected: "Double entries or exits detected. Please review and fix:",
        
        // Export section
        exportMarcajes: "Export Records",
        chooseFormat: "Choose export format:",
        includeLabels: "Include labels",
        includeProblems: "Include problems",
        
        // Messages
        credentialsConfigured: "Credentials configured",
        noCredentialsConfigured: "No credentials configured",
        configurationSaved: "Configuration saved successfully",
        problemsFixed: "Problems fixed! The corrected data has been saved.",
        fixProblemsConfirm: "This will automatically fix double entries/exits based on 5-minute rule. Continue?",
        usingCachedData: "Using cached data",
        errorPrefix: "Error",
        noCredentialsAvailable: "No credentials available. Please extract credentials first.",
        failedToFetch: "Failed to fetch records data",
        
        // About section
        aboutCucoExt: "About CucoExt",
        version: "Version 2.0.0 - Chrome Extension",
        features: "Features",
        featuresList: [
            "Real-time work time tracking",
            "Spanish working hours support", 
            "Automated credential management",
            "Presence time calculation",
            "Multiple schedule support",
            "Background monitoring",
            "Visual status indicators"
        ],
        license: "License",
        licenseInfo: "CC BY-NC-SA 4.0 - Creative Commons",
        personalUseAllowed: "Personal use allowed",
        commercialUseRequiresPermission: "Commercial use requires permission",
        support: "Support",
        supportInfo: "For issues or commercial licensing:",
        technicalDetails: "Technical Details",
        platform: "Platform",
        platformInfo: "Chrome Extension (Manifest V3)",
        target: "Target",
        targetInfo: "cuco360.cucorent.com",
        storage: "Storage",
        storageInfo: "Chrome Local Storage",
        permissions: "Permissions",
        permissionsInfo: "activeTab, storage, alarms, notifications",
        
        // Timesheet reminder
        timesheetReminder: "Timesheet Reminder",
        workHoursComplete: "Your work hours are complete! Don't forget to fill your timesheet."
    },
    
    ca: {
        // Header and basic info
        title: "CucoExt",
        subtitle: "Control Intel·ligent de Jornada",
        
        // Status messages
        loading: "Carregant...",
        checkingStatus: "Comprovant estat de la jornada...",
        statusRefreshed: "Estat actualitzat correctament",
        lastUpdate: "Última actualització",
        never: "Mai",
        
        // Tab names
        status: "Estat",
        marcajes: "Marcatges",
        credentials: "Credencials",
        
        // Time labels
        workingTime: "Temps de Treball",
        presenceTime: "Temps de Presència",
        remaining: "Restant",
        theoreticalExit: "Sortida Prevista",
        
        // Status messages
        canLeave: "Pots marxar de la feina",
        timeToLeave: "És hora de marxar",
        prepareToLeave: "Prepara't per marxar",
        keepWorking: "Continua treballant",
        notStarted: "Jornada no iniciada",
        outOfOffice: "Fora de l'oficina",
        workShiftEnded: "Jornada finalitzada",
        
        // Status detail messages
        noEntryTimeDetected: "No s'ha detectat hora d'entrada",
        noAdditionalDetails: "Sense detalls addicionals",
        canLeaveRequirementsCompleted: "Pots marxar - requisits completats",
        exactlyTimeToLeave: "És exactament l'hora de marxar!",
        credentialsExpiredClickRefresh: "Credencials caducades - clica per actualitzar",
        
        // Buttons
        refreshStatus: "Actualitzar Estat",
        openTimesheet: "Obrir Full d'Hores",
        autoExtractCredentials: "Extreure Credencials Automàticament",
        testCurrentPage: "Provar Pàgina Actual",
        saveCredentials: "Desar Credencials",
        clearCredentials: "Esborrar Credencials",
        saveConfiguration: "Desar Configuració",
        refreshMarcajes: "Actualitzar Marcatges",
        export: "Exportar",
        fixProblems: "Corregir Problemes",
        
        // Credential section
        automatedExtraction: "Extracció Automàtica",
        autoExtractDescription: "Fes clic per obrir Cuco360 i extreure les credencials automàticament.",
        manualCredentials: "Credencials Manuals",
        csrfToken: "Token CSRF",
        tokenPlaceholder: "Introdueix el token del navegador",
        cookies: "Galetes",
        cookiesPlaceholder: "Introdueix la cadena de galetes",
        clientCode: "Codi d'Empresa",
        clientCodePlaceholder: "Codi dins l'empresa",
        
        // Configuration section
        languageLabel: "Idioma de la Interfície",
        autoBrowserLanguage: "Automàtic (Idioma del Navegador)",
        english: "English",
        catalan: "Català",
        spanish: "Español",
        
        workingHoursSchedule: "Horari de Treball",
        scheduleType: "Tipus d'Horari",
        commonSchedule: "Horari Comú (8,5h + 6h divendres)",
        standardSchedule: "Horari Estàndard (8h diàries)",
        intensiveSchedule: "Horari Intensiu (6,5h diàries)",
        autoDetectIntensive: "Horari intensiu d'agost automàtic",
        enableNotifications: "Notificacions de fi de jornada",
        enableDebugLogs: "Activar registres de depuració a la consola",
        
        // Debug section
        debugSection: "Configuració de Depuració",
        enableCustomMarcajes: "Activar marcatges personalitzats per depurar",
        bypassCredentialsEnabled: "Ometre validació de credencials en mode depuració",
        customMarcajesLabel: "Dades de Marcatges Personalitzats (JSON o Format Timestamp)",
        customMarcajesPlaceholder: "⚠️ El mode de depuració desactivarà la descàrrega de dades reals de Cuco360\n\nFormats suportats:\n• Format timestamp: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• Format JSON: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entrada, S = Sortida. Utilitza 'Carregar Dades d'Exemple' per veure un exemple.",
        debugModeActive: "Mode de depuració actiu",
        debugWarning: "El mode de depuració desactivarà la descàrrega de dades reals de Cuco360",
        loadSampleData: "Carregar Dades d'Exemple",
        
        // Marcajes section
        entriesAndExits: "Entrades i Sortides",
        refreshMarcajesInfo: "Fes clic a \"Actualitzar Marcatges\" per carregar les entrades i sortides d'avui",
        todaysMarcajes: "Marcatges d'Avui",
        entries: "Entrades",
        exits: "Sortides",
        presenceTimeLabel: "Temps de presència",
        offlineMode: "Mode Fora de Línia",
        
        // Problems section
        problematicEntries: "Entrades Problemàtiques",
        doubleEntriesDetected: "S'han detectat entrades o sortides dobles. Si us plau, revisa i corregeix:",
        
        // Export section
        exportMarcajes: "Exportar Marcatges",
        chooseFormat: "Tria el format d'exportació:",
        includeLabels: "Incloure etiquetes",
        includeProblems: "Incloure problemes",
        
        // Messages
        credentialsConfigured: "Credencials configurades",
        noCredentialsConfigured: "No hi ha credencials configurades",
        configurationSaved: "Configuració desada correctament",
        problemsFixed: "Problemes corregits! Les dades corregides s'han desat.",
        fixProblemsConfirm: "Això corregirà automàticament les entrades/sortides dobles basant-se en la regla dels 5 minuts. Continuar?",
        usingCachedData: "Utilitzant dades emmagatzemades",
        errorPrefix: "Error",
        noCredentialsAvailable: "No hi ha credencials disponibles. Si us plau, extreu les credencials primer.",
        failedToFetch: "Error en obtenir les dades de marcatges",
        
        // About section
        aboutCucoExt: "Sobre CucoExt",
        version: "Versió 2.0.0 - Extensió de Chrome",
        features: "Funcionalitats",
        featuresList: [
            "Seguiment de temps de treball en temps real",
            "Suport per horaris laborals espanyols",
            "Gestió automàtica de credencials",
            "Càlcul del temps de presència",
            "Suport per múltiples horaris",
            "Monitorització en segon pla",
            "Indicadors visuals d'estat"
        ],
        license: "Llicència",
        licenseInfo: "CC BY-NC-SA 4.0 - Creative Commons",
        personalUseAllowed: "Ús personal permès",
        commercialUseRequiresPermission: "L'ús comercial requereix permís",
        support: "Suport",
        supportInfo: "Per a problemes o llicències comercials:",
        technicalDetails: "Detalls Tècnics",
        platform: "Plataforma",
        platformInfo: "Extensió de Chrome (Manifest V3)",
        target: "Objectiu",
        targetInfo: "cuco360.cucorent.com",
        storage: "Emmagatzematge",
        storageInfo: "Emmagatzematge Local de Chrome",
        permissions: "Permisos",
        permissionsInfo: "activeTab, storage, alarms, notifications",
        
        // Timesheet reminder
        timesheetReminder: "Recordatori de Full d'Hores",
        workHoursComplete: "Les teves hores de treball estan completes! No oblidis omplir el teu full d'hores."
    },
    
    es: {
        // Header and basic info
        title: "CucoExt",
        subtitle: "Control Inteligente de Jornada",
        
        // Status messages
        loading: "Cargando...",
        checkingStatus: "Comprobando estado de la jornada...",
        statusRefreshed: "Estado actualizado correctamente",
        lastUpdate: "Última actualización",
        never: "Nunca",
        
        // Tab names
        status: "Estado",
        marcajes: "Marcajes",
        credentials: "Credenciales",
        
        // Time labels
        workingTime: "Tiempo de Trabajo",
        presenceTime: "Tiempo de Presencia",
        remaining: "Restante",
        theoreticalExit: "Salida Prevista",
        
        // Status messages
        canLeave: "Puedes marcharte del trabajo",
        timeToLeave: "Es hora de marcharse",
        prepareToLeave: "Prepárate para marcharte",
        keepWorking: "Continúa trabajando",
        notStarted: "Jornada no iniciada",
        outOfOffice: "Fuera de la oficina",
        workShiftEnded: "Jornada finalizada",
        
        // Status detail messages
        noEntryTimeDetected: "No se ha detectado hora de entrada",
        noAdditionalDetails: "Sin detalles adicionales",
        canLeaveRequirementsCompleted: "Puedes marcharte - requisitos completados",
        exactlyTimeToLeave: "¡Es exactamente la hora de marcharse!",
        credentialsExpiredClickRefresh: "Credenciales caducadas - clica para actualizar",
        
        // Buttons
        refreshStatus: "Actualizar Estado",
        openTimesheet: "Abrir Hoja de Horas",
        autoExtractCredentials: "Extraer Credenciales Automáticamente",
        testCurrentPage: "Probar Página Actual",
        saveCredentials: "Guardar Credenciales",
        clearCredentials: "Borrar Credenciales",
        saveConfiguration: "Guardar Configuración",
        refreshMarcajes: "Actualizar Marcajes",
        export: "Exportar",
        fixProblems: "Corregir Problemas",
        
        // Credential section
        automatedExtraction: "Extracción Automática",
        autoExtractDescription: "Haz clic para abrir Cuco360 y extraer las credenciales automáticamente.",
        manualCredentials: "Credenciales Manuales",
        csrfToken: "Token CSRF",
        tokenPlaceholder: "Introduce el token del navegador",
        cookies: "Cookies",
        cookiesPlaceholder: "Introduce la cadena de cookies",
        clientCode: "Código de Empresa",
        clientCodePlaceholder: "El código de tu empresa",
        
        // Configuration section
        languageLabel: "Idioma de la Interfaz",
        autoBrowserLanguage: "Automático (Idioma del Navegador)",
        english: "English",
        catalan: "Català",
        spanish: "Español",
        
        workingHoursSchedule: "Horario de Trabajo",
        scheduleType: "Tipo de Horario",
        commonSchedule: "Horario Común (8,5h + 6h viernes)",
        standardSchedule: "Horario Estándar (8h diarias)",
        intensiveSchedule: "Horario Intensivo (6,5h diarias)",
        autoDetectIntensive: "Detectar automáticamente el horario intensivo de agosto",
        enableNotifications: "Activar notificaciones de finalización de jornada",
        enableDebugLogs: "Activar registros de depuración en la consola",
        
        // Debug section
        debugSection: "Configuración de Depuración",
        enableCustomMarcajes: "Activar marcajes personalizados de depuración",
        bypassCredentialsEnabled: "Omitir validación de credenciales en modo depuración",
        customMarcajesLabel: "Datos de Marcajes Personalizados (JSON o Formato Timestamp)",
        customMarcajesPlaceholder: "⚠️ El modo de depuración desactivará la descarga de datos reales de Cuco360\n\nFormatos soportados:\n• Formato timestamp: HH:MM:SS E 000 | HH:MM:SS S 000 | ...\n• Formato JSON: {\"entries\": [\"09:20\", \"13:40\"], \"exits\": [\"12:30\", \"17:15\"]}\n\nE = Entrada, S = Salida. Usa 'Cargar Datos de Ejemplo' para ver un ejemplo.",
        debugModeActive: "Modo de depuración activo",
        debugWarning: "El modo de depuración desactivará la descarga de datos reales de Cuco360",
        loadSampleData: "Cargar Datos de Ejemplo",
        
        // Marcajes section
        entriesAndExits: "Entradas y Salidas",
        refreshMarcajesInfo: "Haz clic en \"Actualizar Marcajes\" para cargar las entradas y salidas de hoy",
        todaysMarcajes: "Marcajes de Hoy",
        entries: "Entradas",
        exits: "Salidas",
        presenceTimeLabel: "Tiempo de presencia",
        offlineMode: "Modo Sin Conexión",
        
        // Problems section
        problematicEntries: "Entradas Problemáticas",
        doubleEntriesDetected: "Se han detectado entradas o salidas dobles. Por favor, revisa y corrige:",
        
        // Export section
        exportMarcajes: "Exportar Marcajes",
        chooseFormat: "Elige el formato de exportación:",
        includeLabels: "Incluir etiquetas",
        includeProblems: "Incluir problemas",
        
        // Messages
        credentialsConfigured: "Credenciales configuradas",
        noCredentialsConfigured: "No hay credenciales configuradas",
        configurationSaved: "Configuración guardada correctamente",
        problemsFixed: "¡Problemas corregidos! Los datos corregidos se han guardado.",
        fixProblemsConfirm: "Esto corregirá automáticamente las entradas/salidas dobles basándose en la regla de los 5 minutos. ¿Continuar?",
        usingCachedData: "Usando datos almacenados",
        errorPrefix: "Error",
        noCredentialsAvailable: "No hay credenciales disponibles. Por favor, extrae las credenciales primero.",
        failedToFetch: "Error al obtener los datos de marcajes",
        
        // About section
        aboutCucoExt: "Acerca de CucoExt",
        version: "Versión 2.0.0 - Extensión de Chrome",
        features: "Características",
        featuresList: [
            "Seguimiento de tiempo de trabajo en tiempo real",
            "Soporte para horarios laborales españoles",
            "Gestión automática de credenciales",
            "Cálculo del tiempo de presencia",
            "Soporte para múltiples horarios",
            "Monitorización en segundo plano",
            "Indicadores visuales de estado"
        ],
        license: "Licencia",
        licenseInfo: "CC BY-NC-SA 4.0 - Creative Commons",
        personalUseAllowed: "Uso personal permitido",
        commercialUseRequiresPermission: "El uso comercial requiere permiso",
        support: "Soporte",
        supportInfo: "Para problemas o licencias comerciales:",
        technicalDetails: "Detalles Técnicos",
        platform: "Plataforma",
        platformInfo: "Extensió de Chrome (Manifest V3)",
        target: "Objectiu",
        targetInfo: "cuco360.cucorent.com",
        storage: "Almacenamiento",
        storageInfo: "Almacenamiento Local de Chrome",
        permissions: "Permisos",
        permissionsInfo: "activeTab, storage, alarms, notifications",
        
        // Timesheet reminder
        timesheetReminder: "Recordatorio de Hoja de Horas",
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
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            break;
        }
    }
    
    // Fallback to English if key not found
    if (value === undefined) {
        value = translations.en;
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                break;
            }
        }
    }
    
    return value || key;
}

// DOM elements
let elements = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔧 DEBUG: DOMContentLoaded fired');
    
    // Initialize UI elements
    initializeElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial state
    await loadInitialState();
    
    // Update form elements based on current language
    updateFormElements();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Test if debug section toggle works
    console.log('🔧 DEBUG: Debug section title element:', document.getElementById('debugSectionTitle'));
    console.log('🔧 DEBUG: Debug collapsible content element:', document.getElementById('debugCollapsibleContent'));
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
        
        // Set language select value if element exists
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
    
    // Update initial status messages
    if (elements.statusMessage) elements.statusMessage.textContent = t('loading');
    if (elements.statusDetails) elements.statusDetails.textContent = t('checkingStatus');
    
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
    if (openTimesheetBtn) {
        openTimesheetBtn.innerHTML = '🕒 ' + t('openTimesheet');
    }
    
    const extractCredBtn = document.getElementById('extractCredentials-btn');
    if (extractCredBtn) {
        extractCredBtn.innerHTML = '🚀 ' + t('autoExtractCredentials');
    }
    
    const testExtractionBtn = document.getElementById('testExtraction-btn');
    if (testExtractionBtn) {
        testExtractionBtn.innerHTML = '🧪 ' + t('testCurrentPage');
    }
    
    const saveCredBtn = document.getElementById('saveCredentials-btn');
    if (saveCredBtn) saveCredBtn.textContent = t('saveCredentials');
    
    const clearCredBtn = document.getElementById('clearCredentials-btn');
    if (clearCredBtn) clearCredBtn.textContent = t('clearCredentials');
    
    const saveConfigBtn = document.getElementById('saveConfiguration-btn');
    if (saveConfigBtn) saveConfigBtn.textContent = t('saveConfiguration');
    
    const refreshMarcajesBtn = document.getElementById('refreshMarcajes-btn');
    if (refreshMarcajesBtn) {
        refreshMarcajesBtn.innerHTML = '🔄 ' + t('refreshMarcajes');
    }
    
    const exportMarcajesBtn = document.getElementById('exportMarcajes-btn');
    if (exportMarcajesBtn) {
        exportMarcajesBtn.innerHTML = '📁 ' + t('export');
    }
    
    const fixProblemsBtn = document.getElementById('fixProblems-btn');
    if (fixProblemsBtn) {
        fixProblemsBtn.innerHTML = '🔧 ' + t('fixProblems');
    }
    
    // Update section titles
    updateSectionTitles();
    
    // Update form labels and placeholders
    updateFormElements();
    
    // Update About section
    updateAboutSection();
    
    // Update any existing messages
    updateExistingMessages();
}

function updateSectionTitles() {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const text = title.textContent.toLowerCase();
        if (text.includes('language') || text.includes('idioma')) {
            title.textContent = t('languageLabel');
        } else if (text.includes('working hours') || text.includes('horario')) {
            title.textContent = t('workingHoursSchedule');
        } else if (text.includes('automated') || text.includes('automàtica')) {
            title.textContent = t('automatedExtraction');
        } else if (text.includes('manual') || text.includes('credenciales manual')) {
            title.textContent = t('manualCredentials');
        } else if (text.includes('entradas') || text.includes('entries')) {
            title.textContent = t('entriesAndExits');
        } else if (text.includes('about') || text.includes('sobre')) {
            title.textContent = t('aboutCucoExt');
        }
    });
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
    
    const debugModeActiveText = document.getElementById('debugModeActiveText');
    if (debugModeActiveText) debugModeActiveText.textContent = t('debugModeActive');
    
    const debugWarningText = document.getElementById('debugWarningText');
    if (debugWarningText) debugWarningText.textContent = t('debugWarning');
    
    const saveDebugConfigBtn = document.getElementById('saveDebugConfiguration-btn');
    if (saveDebugConfigBtn) saveDebugConfigBtn.textContent = t('saveConfiguration');
    
    const loadSampleMarcajesBtn = document.getElementById('loadSampleMarcajes-btn');
    if (loadSampleMarcajesBtn) loadSampleMarcajesBtn.textContent = t('loadSampleData');
    
    // Input placeholders
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) tokenInput.placeholder = t('tokenPlaceholder');
    
    const cookiesInput = document.getElementById('cookiesInput');
    if (cookiesInput) cookiesInput.placeholder = t('cookiesPlaceholder');
    
    const clientCodeInput = document.getElementById('clientCodeInput');
    if (clientCodeInput) clientCodeInput.placeholder = t('clientCodePlaceholder');
}

function updateAboutSection() {
    // Update About section content
    const logoSection = document.querySelector('.logo-section h3');
    if (logoSection) logoSection.textContent = '🎯 ' + t('title') + ' - ' + t('subtitle');
    
    const versionElement = document.querySelector('.version');
    if (versionElement) versionElement.textContent = t('version');
    
    const featuresTitle = document.querySelector('.features-list h4');
    if (featuresTitle) featuresTitle.textContent = '✨ ' + t('features');
    
    const featuresList = document.querySelector('.features-list ul');
    if (featuresList) {
        featuresList.innerHTML = '';
        t('featuresList').forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }
    
    const licenseTitle = document.querySelector('.license-section h4');
    if (licenseTitle) licenseTitle.textContent = '📄 ' + t('license');
    
    const licenseText = document.querySelector('.license-text');
    if (licenseText) {
        licenseText.innerHTML = `
            ✅ ${t('personalUseAllowed')}<br>
            ❌ ${t('commercialUseRequiresPermission')}
        `;
    }
    
    const supportTitle = document.querySelector('.support-section h4');
    if (supportTitle) supportTitle.textContent = '📧 ' + t('support');
    
    const technicalTitle = document.querySelector('.technical-info h4');
    if (technicalTitle) technicalTitle.textContent = '🔧 ' + t('technicalDetails');
    
    const techDetails = document.querySelector('.tech-details');
    if (techDetails) {
        techDetails.innerHTML = `
            <p><strong>${t('platform')}:</strong> ${t('platformInfo')}</p>
            <p><strong>${t('target')}:</strong> ${t('targetInfo')}</p>
            <p><strong>${t('storage')}:</strong> ${t('storageInfo')}</p>
            <p><strong>${t('permissions')}:</strong> ${t('permissionsInfo')}</p>
        `;
    }
}

function updateExistingMessages() {
    // Update any existing info messages
    const marcajesInfoMessage = document.getElementById('marcajesInfoMessage');
    if (marcajesInfoMessage) {
        marcajesInfoMessage.textContent = t('refreshMarcajesInfo');
    }
    
    // Update marcajes title
    const marcajesTitle = document.getElementById('marcajesTitle');
    if (marcajesTitle) {
        marcajesTitle.textContent = t('todaysMarcajes');
    }
    
    // Update problematic entries
    const problematicEntriesTitle = document.getElementById('problematicEntriesTitle');
    if (problematicEntriesTitle) {
        problematicEntriesTitle.textContent = '⚠️ ' + t('problematicEntries');
    }
    
    const doubleEntriesMessage = document.getElementById('doubleEntriesMessage');
    if (doubleEntriesMessage) {
        doubleEntriesMessage.textContent = t('doubleEntriesDetected');
    }
    
    // Update timesheet reminder
    const timesheetTitle = document.querySelector('#timesheetReminder .section-title');
    if (timesheetTitle) timesheetTitle.textContent = '📋 ' + t('timesheetReminder');
    
    const timesheetText = document.querySelector('#timesheetReminder p');
    if (timesheetText) timesheetText.textContent = t('workHoursComplete');
    
    // Update last update text
    if (elements.lastUpdate && elements.lastUpdate.textContent.includes('Last updated') || 
        elements.lastUpdate.textContent.includes('Última actualización') ||
        elements.lastUpdate.textContent.includes('Última actualització')) {
        const timestamp = elements.lastUpdate.textContent.split(': ')[1] || t('never');
        elements.lastUpdate.textContent = t('lastUpdate') + ': ' + (timestamp === 'Never' || timestamp === 'Mai' || timestamp === 'Nunca' ? t('never') : timestamp);
    }
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
        debugNotification: document.getElementById('debugNotification'),
        debugConfigMessage: document.getElementById('debugConfigMessage'),
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
            showMessage(elements.credentialsMessage, t('credentialsConfigured'), 'success');
        } else {
            showMessage(elements.credentialsMessage, t('noCredentialsConfigured'), 'error');
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

    // Semaphore click to override "Time to leave" status
    const semaphore = document.getElementById('semaphore');
    if (semaphore) {
        semaphore.addEventListener('click', handleSemaphoreClick);
        semaphore.style.cursor = 'pointer';
        semaphore.title = 'Click to confirm you can leave (overrides Time to leave alert)';
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
    
    // Debug section toggle functionality (simplified checkbox approach)
    const showDebugSettingsCheckbox = document.getElementById('showDebugSettings');
    if (showDebugSettingsCheckbox) {
        showDebugSettingsCheckbox.addEventListener('change', toggleDebugSettingsVisibility);
    }
    
    // Make toggle function globally accessible for inline onclick (backup)
    window.toggleDebugSettingsVisibility = toggleDebugSettingsVisibility;
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
            console.log('🔧 DEBUG: Debug settings shown and features enabled');
        } else {
            content.style.display = 'none';
            // Temporarily disable debug features when hidden
            disableDebugFeatures();
            console.log('🔧 DEBUG: Debug settings hidden and features disabled');
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
            }, function() {
                // Remove the temporary state
                chrome.storage.local.remove(['tempDebugState']);
                // Update UI to reflect restored state
                updateDebugUIState();
            });
        }
    });
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
            elements.debugNotification.classList.remove('hidden');
        } else {
            elements.debugNotification.classList.add('hidden');
        }
    } else {
        elements.customMarcajesGroup.classList.add('hidden');
        // debugActiveIndicator is now commented out - no longer used
        // elements.debugActiveIndicator.classList.add('hidden');
        // debugWarningSection is now inside customMarcajesGroup, so no separate control needed
        // elements.debugWarningSection.classList.add('hidden');
        elements.debugNotification.classList.add('hidden');
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
                // Try to convert using our new function which supports both formats
                convertCustomMarcajesToJSON(customMarcajesData);
            } catch (error) {
                throw new Error('Invalid format in custom marcajes data. Use either JSON format or timestamp format (HH:MM:SS E/S 000 | ...)');
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

// Parse timestamps from detail column format with consecutive E/S collapsing
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
            const time = match[1].substring(0, 5); // Remove seconds, keep HH:MM
            const type = match[2];
            
            timeEntries.push({
                time: time,
                type: type,
                timeInMinutes: timeToMinutes(time)
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
    
    console.log('🔧 DEBUG: Parsed timestamps - Raw entries:', rawEntries.length, 'Raw exits:', rawExits.length);
    console.log('🔧 DEBUG: Collapsed timestamps - Final entries:', finalEntries.length, 'Final exits:', finalExits.length);
    console.log('🔧 DEBUG: Final entries:', finalEntries);
    console.log('🔧 DEBUG: Final exits:', finalExits);
    
    return { entries: finalEntries, exits: finalExits };
}

// Helper function to convert time string to minutes
function timeToMinutes(timeStr) {
    if (!timeStr || timeStr === '--:--' || timeStr === '0') return 0;
    const parts = timeStr.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    return hours * 60 + minutes;
}

// Convert timestamp format to JSON format expected by the extension
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
        
        // Calculate working minutes and presence minutes for debug purposes
        let workingMinutes = 0;
        let presenceMinutes = 0;
        
        if (timestamps.entries.length > 0) {
            // Working Time = Total time from first entry to current time (or last exit if finished)
            const firstEntryMinutes = timeToMinutes(timestamps.entries[0]);
            
            if (timestamps.exits.length > 0 && timestamps.entries.length === timestamps.exits.length) {
                // All periods completed
                // Working Time = from first entry to last exit (total timespan)
                const lastExitMinutes = timeToMinutes(timestamps.exits[timestamps.exits.length - 1]);
                workingMinutes = lastExitMinutes - firstEntryMinutes;
                
                // Presence Time = sum of actual working periods (excluding breaks)
                for (let i = 0; i < timestamps.entries.length; i++) {
                    const entryTime = timeToMinutes(timestamps.entries[i]);
                    const exitTime = timeToMinutes(timestamps.exits[i]);
                    const periodTime = Math.max(0, exitTime - entryTime);
                    presenceMinutes += periodTime;
                }
            } else {
                // Currently working
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                
                // Working Time = from first entry to current time (total timespan)
                workingMinutes = currentMinutes - firstEntryMinutes;
                
                // Presence Time = sum of completed periods + current working period
                const completedPairs = Math.min(timestamps.entries.length, timestamps.exits.length);
                for (let i = 0; i < completedPairs; i++) {
                    const entryTime = timeToMinutes(timestamps.entries[i]);
                    const exitTime = timeToMinutes(timestamps.exits[i]);
                    const periodTime = Math.max(0, exitTime - entryTime);
                    presenceMinutes += periodTime;
                }
                
                // Add current working period if still in office
                if (timestamps.entries.length > timestamps.exits.length) {
                    const lastEntryMinutes = timeToMinutes(timestamps.entries[timestamps.entries.length - 1]);
                    const currentPeriodMinutes = Math.max(0, currentMinutes - lastEntryMinutes);
                    presenceMinutes += currentPeriodMinutes;
                }
            }
        }
        
        return {
            date: `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`,
            entries: timestamps.entries,
            exits: timestamps.exits,
            rawDetail: timestampData,
            todayDate: todayStr,
            workingMinutes: workingMinutes,
            presenceMinutes: presenceMinutes
        };
    }
}

function loadSampleMarcajes() {
    // Sample data in the Cuco360 format (timestamp format from detail column)
    // This example shows multiple entries and exits throughout the day, including consecutive exits
    // This demonstrates the robust parsing that handles consecutive E or S timestamps
    const sampleTimestampData = "09:20:08 E 000 | 09:29:03 S 000 | 09:43:59 E 000 | 11:13:14 S 000 | 11:15:01 E 000 | 12:04:43 S 000 | 12:06:29 E 000 | 13:11:04 S 000 | 13:13:09 E 000 | 13:37:44 S 000 | 13:40:29 E 000 | 14:15:13 S 000 | 14:17:08 E 000 | 14:30:41 S 000 | 14:30:48 S 000 | 14:32:40 E 000 | 14:33:06 S 000 | 14:36:03 E 000 |";
    
    elements.customMarcajesInput.value = sampleTimestampData;
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

// Helper function to check if debug mode is active
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
        showMessage(elements.credentialsMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
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

function updateStatusDisplay(status) {
    if (!status) {
        console.log('🔧 DEBUG: updateStatusDisplay called with null/undefined status');
        return;
    }
    
    console.log('🔧 DEBUG: updateStatusDisplay called with status:', status);
    
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
    console.log('🔧 DEBUG: Updated semaphore to:', elements.semaphore.textContent, 'for status:', status.status);
    
    // Handle blinking for TIME_TO_LEAVE
    if (status.status === 'TIME_TO_LEAVE') {
        elements.semaphore.classList.add('blinking');
    } else {
        elements.semaphore.classList.remove('blinking');
    }
    
    // Update status message and details
    const statusTitle = getStatusTitle(status.status);
    const statusMessage = translateStatusMessage(status.message || 'No additional details');
    elements.statusMessage.textContent = statusTitle;
    elements.statusDetails.innerHTML = statusMessage;
    
    console.log('🔧 DEBUG: Updated status display:', {
        statusTitle,
        statusMessage,
        workingMinutes: status.workingMinutes,
        remainingMinutes: status.remainingMinutes,
        theoreticalExit: status.theoreticalExit
    });
    
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
        'PREPARE_TO_LEAVE': t('prepareToLeave'),
        'OUT_OF_OFFICE': t('outOfOffice'),
        'WORK_SHIFT_ENDED': t('workShiftEnded'),
        'CAN_LEAVE': t('canLeave'),
        'TIME_TO_LEAVE': t('timeToLeave'),
        'NOT_WORKING': t('notStarted'),
        'CREDENTIALS_EXPIRED': t('errorPrefix'),
        'ERROR': t('errorPrefix')
    };
    
    const result = statusMap[status] || status;
    console.log('🔧 DEBUG: getStatusTitle mapped', status, 'to', result);
    return result;
}

function translateStatusMessage(message) {
    console.log('🔧 DEBUG: translateStatusMessage called with:', message);
    
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
        const result = `${t('notStarted')} - ${remainingPart}`;
        console.log('🔧 DEBUG: Translated out of office message to:', result);
        return result;
    }
    
    if (message.includes('Working -') && message.includes('remaining')) {
        const remainingPart = message.split('Working - ')[1];
        const result = `${t('keepWorking')} - ${remainingPart}`;
        console.log('🔧 DEBUG: Translated working message to:', result);
        return result;
    }
    
    if (message.includes('Can leave in') && message.includes('minutes')) {
        const minutesPart = message.split('Can leave in ')[1];
        const result = `${t('canLeave')} en ${minutesPart}`;
        console.log('🔧 DEBUG: Translated can leave message to:', result);
        return result;
    }
    
    // Return translated message if found, otherwise return original
    const result = messageMap[message] || message;
    console.log('🔧 DEBUG: Final translated message:', result);
    return result;
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
    if (!timestamp) {
        elements.lastUpdate.textContent = t('lastUpdate') + ': ' + t('never');
        return;
    }
    
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    elements.lastUpdate.textContent = t('lastUpdate') + ': ' + timeStr;
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
            `${t('errorPrefix')}: ${error.message}`, 
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
        showMessage(elements.credentialsMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
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
        showMessage(elements.credentialsMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
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
        showMessage(elements.credentialsMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
    }
}

// Configuration management
async function saveConfiguration() {
    const workingHoursSet = elements.workingHoursSelect.value;
    const autoDetectIntensive = elements.autoDetectIntensive.checked;
    const notificationsEnabled = elements.notificationsEnabled.checked;
    
    try {
        const response = await sendMessage({
            action: 'setWorkingHours',
            setName: workingHoursSet
        });
        
        if (response.success) {
            // Save auto-detect and notification settings
            await chrome.storage.local.set({ 
                autoDetectIntensive: autoDetectIntensive,
                notificationsEnabled: notificationsEnabled
            });
            showMessage(elements.configMessage, t('configurationSaved'), 'success');
        } else {
            throw new Error(response.error || 'Failed to save configuration');
        }
    } catch (error) {
        console.error('Error saving configuration:', error);
        showMessage(elements.configMessage, `${t('errorPrefix')}: ${error.message}`, 'error');
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
    console.log('🔧 DEBUG: Sending message to background:', message);
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            console.log('🔧 DEBUG: Received response from background:', response);
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
        console.error('Error opening TimeSheet:', error);
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
        
        // Check if debug mode with custom marcajes is enabled
        const storage = await chrome.storage.local.get(['credentials', 'customMarcajesEnabled', 'customMarcajesData', 'bypassCredentialsEnabled']);
        const credentials = storage.credentials;
        const customMarcajesEnabled = storage.customMarcajesEnabled;
        const customMarcajesData = storage.customMarcajesData;
        const bypassCredentialsEnabled = storage.bypassCredentialsEnabled;
        
        if (customMarcajesEnabled && customMarcajesData) {
            // Use debug data instead of fetching from Cuco360
            try {
                // Use the new conversion function to handle both JSON and timestamp formats
                const debugData = convertCustomMarcajesToJSON(customMarcajesData);
                cachedMarcajes = debugData;
                lastMarcajesUpdate = new Date().toISOString();
                isOfflineMode = false;
                
                // Cache the debug data
                await chrome.storage.local.set({
                    cachedMarcajes: cachedMarcajes,
                    lastMarcajesUpdate: lastMarcajesUpdate
                });
                
                displayMarcajes(cachedMarcajes);
                updateMarcajesStatus(cachedMarcajes);
                
                // Show debug mode indicator in marcajes
                showDebugModeIndicator();
                return;
                
            } catch (error) {
                throw new Error('Invalid JSON in custom marcajes data: ' + error.message);
            }
        }
        
        // Check credentials only if not bypassing in debug mode
        if (!bypassCredentialsEnabled && (!credentials || !credentials.token)) {
            throw new Error(t('noCredentialsAvailable'));
        }
        
        // Fetch fresh marcajes data from Cuco360
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
            throw new Error(response.error || t('failedToFetch'));
        }
        
    } catch (error) {
        console.error('Error refreshing marcajes:', error);
        
        // If we have cached data, use it and show warning
        if (cachedMarcajes) {
            displayMarcajes(cachedMarcajes);
            updateMarcajesStatus(cachedMarcajes, true);
            showMessage(elements.marcajesContainer, `${t('usingCachedData')}: ${error.message}`, 'warning');
        } else {
            showMessage(elements.marcajesContainer, `${t('errorPrefix')}: ${error.message}`, 'error');
        }
    } finally {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }
}

// Show debug mode indicator in marcajes tab
function showDebugModeIndicator() {
    const marcajesContainer = document.getElementById('marcajesContainer');
    if (marcajesContainer) {
        // Remove existing debug indicator
        const existingIndicator = marcajesContainer.querySelector('.debug-mode-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Add new debug indicator
        const debugIndicator = document.createElement('div');
        debugIndicator.className = 'debug-mode-indicator';
        debugIndicator.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            animation: pulse 2s infinite;
        `;
        debugIndicator.textContent = '🐛 ' + t('debugModeActive') + ' - Using custom marcajes data';
        
        marcajesContainer.insertBefore(debugIndicator, marcajesContainer.firstChild);
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
        <div>${t('entries')}: ${totalEntries} | ${t('exits')}: ${totalExits}</div>
        <div>${t('presenceTimeLabel')}: ${presenceTime}</div>
        ${isOfflineMode ? `<div class="offline-indicator">📱 ${t('offlineMode')}</div>` : ''}
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
    if (confirm(t('fixProblemsConfirm'))) {
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
        
        alert(t('problemsFixed'));
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
