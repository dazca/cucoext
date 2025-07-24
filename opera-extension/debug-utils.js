/**
 * Debug utility for CucoExt Chrome Extension
 * Controls console logging based on user settings
 */

class DebugUtils {
    constructor() {
        this.debugEnabled = false;
        this.loadDebugSetting();
    }

    async loadDebugSetting() {
        try {
            const result = await chrome.storage.local.get(['debugLogsEnabled']);
            this.debugEnabled = result.debugLogsEnabled || false;
        } catch (error) {
            // If we can't load settings, default to false (no debug)
            this.debugEnabled = false;
        }
    }

    // Conditional console.log
    log(...args) {
        if (this.debugEnabled) {
            console.log(...args);
        }
    }

    // Conditional console.error (always shown for errors)
    error(...args) {
        console.error(...args);
    }

    // Conditional console.warn
    warn(...args) {
        if (this.debugEnabled) {
            console.warn(...args);
        }
    }

    // Force refresh debug setting
    async refresh() {
        await this.loadDebugSetting();
    }

    // Check if debug is enabled
    isEnabled() {
        return this.debugEnabled;
    }
}

// Create global debug instance
const debugUtils = new DebugUtils();

// Make available globally
if (typeof window !== 'undefined') {
    window.debugUtils = debugUtils;
}
