// Credential Extractor Content Script for Cuco360
// This script runs on the Cuco360 page to extract credentials

(function() {
    'use strict';
    
    let extractionInProgress = false;
    
    // Initialize debug utils
    let debug = {
        log: (...args) => {
            if (window.debugUtils && window.debugUtils.isEnabled()) {
                console.log(...args);
            }
        },
        error: (...args) => console.error(...args), // Always show errors
        warn: (...args) => {
            if (window.debugUtils && window.debugUtils.isEnabled()) {
                console.warn(...args);
            }
        }
    };
    
    // Wait for debug utils to load
    setTimeout(async () => {
        if (window.debugUtils) {
            await window.debugUtils.refresh();
        }
    }, 1000);
    
    // Function to extract client code from the page
    function extractClientCode() {
        let clientCode = null;
        
        try {
            // Method 1: Try to find it in existing form data or hidden inputs
            const hiddenInputs = document.querySelectorAll('input[name*="cliente"], input[name*="client"], input[name="cod_cliente"]');
            for (const input of hiddenInputs) {
                if (input.value && input.value.trim()) {
                    clientCode = input.value.trim();
                    debug.log('🔍 Found client code in hidden input:', clientCode);
                    break;
                }
            }
            
            // Method 2: Try to extract from URL parameters
            if (!clientCode) {
                const urlParams = new URLSearchParams(window.location.search);
                clientCode = urlParams.get('cod_cliente') || urlParams.get('client_code') || urlParams.get('cliente');
                if (clientCode) {
                    debug.log('🔍 Found client code in URL params:', clientCode);
                }
            }
            
            // Method 3: Try to find it in JavaScript variables or window object
            if (!clientCode && window.Laravel && window.Laravel.clientCode) {
                clientCode = window.Laravel.clientCode;
                debug.log('🔍 Found client code in Laravel object:', clientCode);
            }
            
            // Method 4: Try to find it in any existing form data
            if (!clientCode) {
                const forms = document.querySelectorAll('form');
                for (const form of forms) {
                    const formData = new FormData(form);
                    const codCliente = formData.get('cod_cliente');
                    if (codCliente) {
                        clientCode = codCliente;
                        debug.log('🔍 Found client code in form data:', clientCode);
                        break;
                    }
                }
            }
            
            // Method 5: Try to extract from any data attributes
            if (!clientCode) {
                const elementsWithData = document.querySelectorAll('[data-client], [data-cliente], [data-cod-cliente]');
                for (const el of elementsWithData) {
                    const code = el.dataset.client || el.dataset.cliente || el.dataset.codCliente;
                    if (code) {
                        clientCode = code;
                        debug.log('🔍 Found client code in data attribute:', clientCode);
                        break;
                    }
                }
            }
            
            // Method 6: Try to parse from any script tags or JSON data
            if (!clientCode) {
                const scripts = document.querySelectorAll('script:not([src])');
                for (const script of scripts) {
                    const content = script.textContent;
                    const clientMatch = content.match(/["']?cod_cliente["']?\s*:\s*["']?(\d+)["']?/i) ||
                                      content.match(/["']?client_code["']?\s*:\s*["']?(\d+)["']?/i) ||
                                      content.match(/["']?cliente["']?\s*:\s*["']?(\d+)["']?/i);
                    if (clientMatch && clientMatch[1]) {
                        clientCode = clientMatch[1];
                        debug.log('🔍 Found client code in script content:', clientCode);
                        break;
                    }
                }
            }
            
        } catch (error) {
            debug.warn('⚠️ Error extracting client code:', error.message);
        }
        
        // Fallback to empty if nothing found - require explicit configuration
        if (!clientCode) {
            debug.log('⚠️ No client code detected - manual configuration required');
        }
        
        return clientCode;
    }

    // Function to extract CSRF token and cookies
    function extractCredentials() {
        debug.log('🔍 Extracting credentials from Cuco360...');
        
        try {
            // Extract CSRF token
            let token = null;
            
            // Try meta tag first
            const metaToken = document.querySelector('meta[name="csrf-token"]');
            if (metaToken) {
                token = metaToken.getAttribute('content');
            }
            
            // Try hidden input
            if (!token) {
                const hiddenToken = document.querySelector('input[name="_token"]');
                if (hiddenToken) {
                    token = hiddenToken.value;
                }
            }
            
            // Try from window object
            if (!token && window.Laravel && window.Laravel.csrfToken) {
                token = window.Laravel.csrfToken;
            }
            
            // Get cookies - we'll get them from the extension storage/background
            const cookieString = document.cookie;
            
            if (!token) {
                throw new Error('CSRF token not found');
            }

            const clientCode = extractClientCode();
            if (!clientCode) {
                throw new Error('Client code not found. Please configure it manually in the extension settings.');
            }

            const credentials = {
                token: token,
                cookies: cookieString,
                clientCode: clientCode,
                extractedAt: new Date().toISOString(),
                extractedFrom: window.location.href
            };            debug.log('✅ Credentials extracted successfully:', credentials);
            return credentials;
            
        } catch (error) {
            debug.error('❌ Failed to extract credentials:', error);
            throw error;
        }
    }
    
    // Function to test credentials by making an API call
    async function testCredentials(credentials) {
        debug.log('🧪 Testing extracted credentials...');
        
        try {
            const today = new Date();
            const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            const dateRange = `${todayStr} - ${todayStr}`;
            
            const formData = new URLSearchParams({
                '_token': credentials.token,
                'cod_cliente': credentials.clientCode,
                'rango': dateRange,
                'order': 'nom_empleado',
                'type': 'empleado',
                'document': 'pantalla',
                'orientation': 'v'
            });
            
            const response = await fetch('/face2face/f2ffilter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });
            
            if (response.ok) {
                debug.log('✅ Credentials test successful!');
                return true;
            } else {
                debug.log(`❌ Credentials test failed: ${response.status} ${response.statusText}`);
                return false;
            }
        } catch (error) {
            debug.log('❌ Credentials test error:', error.message);
            return false;
        }
    }
    
    // Function to check if we're logged in and can extract credentials
    function canExtractCredentials() {
        // VERY strict check - we need ALL these conditions:
        const isOnFace2FacePage = window.location.pathname.includes('face2face');
        const hasWorkTimeData = document.querySelector('#myFilter tbody tr, table.table tbody tr:not(:empty), .table-responsive table tbody tr:not(:empty)');
        const hasCSRFToken = document.querySelector('meta[name="csrf-token"]') || document.querySelector('input[name="_token"]');
        
        // Fix: Remove invalid CSS selector, check for submit button differently
        const submitButtons = document.querySelectorAll('#btn_submit, button[type="submit"], input[type="submit"], .btn-primary');
        let hasSubmitButton = false;
        for (const btn of submitButtons) {
            if (btn.textContent.includes('Obtener') || btn.value?.includes('Obtener')) {
                hasSubmitButton = true;
                break;
            }
        }
        
        // Check if data is actually loaded (not just empty table)
        const dataLoaded = hasWorkTimeData && hasWorkTimeData.textContent.trim().length > 10;
        
        // We need ALL conditions to be true
        const fullyReady = isOnFace2FacePage && hasCSRFToken && dataLoaded;
        
        debug.log('🔍 Credential extraction check:', {
            isOnFace2FacePage,
            hasWorkTimeData: !!hasWorkTimeData,
            dataLoaded,
            hasCSRFToken: !!hasCSRFToken,
            hasSubmitButton: hasSubmitButton,
            fullyReady,
            currentURL: window.location.href
        });
        
        return fullyReady;
    }
    
    // Function to check if we're logged in to the dashboard but not yet on face2face
    function isLoggedInButNotOnFace2Face() {
        // Only consider logged in if we're NOT on login page and we have dashboard elements
        const isOnLoginPage = window.location.pathname.includes('login') || 
                             document.querySelector('input[type="password"]') ||
                             document.querySelector('form[action*="login"]');
        
        if (isOnLoginPage) {
            return false;
        }
        
        const isLoggedIn = window.location.pathname.includes('dashboard') ||
                          document.querySelector('[data-bs-target="#modalRegistroJornada"]') ||
                          document.querySelector('.btn-primary[onclick*="registro"]') ||
                          document.title.includes('Dashboard') ||
                          document.querySelector('a[href*="face2face"]') ||
                          document.querySelector('nav, .navbar, .sidebar') ||
                          (!window.location.pathname.includes('login') && document.querySelector('meta[name="csrf-token"]'));
        
        const isOnFace2Face = window.location.pathname.includes('face2face');
        
        const result = isLoggedIn && !isOnFace2Face;
        console.log('🔍 Dashboard check:', { isLoggedIn, isOnFace2Face, result, url: window.location.href });
        
        return result;
    }
    
    // Function to check if we're on login page and can help with login
    function isOnLoginPage() {
        // Be more specific - only consider it a login page if we have BOTH email/password fields AND it's actually the login URL
        const hasLoginUrl = window.location.pathname.includes('login') || window.location.href.includes('login');
        const hasEmailField = document.querySelector('input[type="email"], input[type="text"], #email');
        const hasPasswordField = document.querySelector('input[type="password"], #password');
        const hasLoginForm = document.querySelector('form[action*="login"]');
        
        // Must have login URL OR (both email and password fields)
        const isLoginPage = hasLoginUrl || (hasEmailField && hasPasswordField) || hasLoginForm;
        
        console.log('🔍 Login page check:', {
            hasLoginUrl,
            hasEmailField: !!hasEmailField,
            hasPasswordField: !!hasPasswordField,
            hasLoginForm: !!hasLoginForm,
            isLoginPage,
            currentUrl: window.location.href
        });
        
        return isLoginPage;
    }
    
    // Function to wait for login completion
    async function waitForLogin() {
        console.log('👤 Waiting for user to complete login...');
        showNotification('Please log in to Cuco360. I will detect when you are logged in and guide you through the process.', 'info');
        
        return new Promise((resolve) => {
            let checkInterval;
            let timeout;
            
            const checkLoginStatus = () => {
                console.log('🔍 Checking login status...');
                
                // Check if we're fully ready (on face2face with data)
                if (canExtractCredentials()) {
                    console.log('✅ Fully ready for extraction!');
                    clearInterval(checkInterval);
                    clearTimeout(timeout);
                    showNotification('✅ Ready for extraction!', 'success');
                    resolve(true);
                    return;
                }
                
                // Check if we're logged in but need to navigate to face2face
                if (isLoggedInButNotOnFace2Face()) {
                    console.log('✅ Logged in! Now navigating to face2face...');
                    showNotification('✅ Logged in! Navigating to work time page...', 'success');
                    
                    // Navigate to face2face
                    window.location.href = 'https://cuco360.cucorent.com/face2face';
                    
                    // Continue checking after navigation
                    setTimeout(() => {
                        console.log('🔄 Continuing check after navigation...');
                    }, 3000);
                    return;
                }
                
                // Check if we're still on login page and can help
                if (isOnLoginPage()) {
                    // Check if both username and password are filled
                    const emailInput = document.querySelector('input[type="email"], input[type="text"], #email');
                    const passwordInput = document.querySelector('input[type="password"], #password');
                    const submitButton = document.querySelector('button[type="submit"], input[type="submit"], .btn[onclick*="submit"], form button');
                    
                    if (emailInput && passwordInput && submitButton) {
                        const email = emailInput.value.trim();
                        const password = passwordInput.value.trim();
                        
                        if (email && password) {
                            console.log('✅ Both email and password filled, clicking submit...');
                            showNotification('Credentials detected! Clicking login button...', 'info');
                            
                            // Click the submit button
                            submitButton.click();
                            
                            // Give it some time to process
                            setTimeout(() => {
                                console.log('🔄 Login submitted, continuing to check...');
                            }, 3000);
                        }
                    }
                }
            };
            
            // Check immediately
            checkLoginStatus();
            
            // Check every 3 seconds (increased from 2 to give more time for navigation)
            checkInterval = setInterval(checkLoginStatus, 3000);
            
            // Timeout after 5 minutes
            timeout = setTimeout(() => {
                clearInterval(checkInterval);
                console.log('❌ Login timeout');
                showNotification('❌ Login timeout. Please try again.', 'error');
                resolve(false);
            }, 300000); // 5 minutes
        });
    }
    
    // Function to navigate to face2face page for better extraction
    async function navigateToWorkTimePage() {
        console.log('📋 Navigating to work time page...');
        
        try {
            const currentUrl = window.location.href;
            
            if (!currentUrl.includes('face2face')) {
                console.log('🔗 Not on face2face page, navigating...');
                
                // Direct navigation to face2face page
                window.location.href = 'https://cuco360.cucorent.com/face2face';
                
                // Wait for navigation
                return new Promise(resolve => {
                    const checkNavigation = () => {
                        if (window.location.href.includes('face2face')) {
                            console.log('✅ Successfully navigated to face2face');
                            setTimeout(() => resolve(true), 2000); // Wait for page to load
                        } else {
                            setTimeout(checkNavigation, 1000);
                        }
                    };
                    checkNavigation();
                });
            } else {
                console.log('✅ Already on face2face page');
                return true;
            }
        } catch (error) {
            console.log('❌ Failed to navigate to work time page:', error.message);
            return false;
        }
    }
    
    // Function to click "Obtener informe" and load work data
    async function loadWorkTimeData() {
        console.log('📊 Loading work time data...');
        
        try {
            console.log('🔧 DEBUG: Current URL:', window.location.href);
            console.log('🔧 DEBUG: Page title:', document.title);
            
            // Look for the "Obtener informe" button - fix CSS selector
            let submitButton = document.querySelector('#btn_submit, button[id="btn_submit"], .btn-primary[id*="submit"]');
            
            if (!submitButton) {
                // Try alternative selectors - search by text content
                const buttons = document.querySelectorAll('button.btn-primary, input[type="submit"], button[type="submit"], button, input[type="button"]');
                console.log(`🔧 DEBUG: Found ${buttons.length} buttons to check`);
                
                for (const btn of buttons) {
                    const text = btn.textContent || btn.value || '';
                    console.log(`🔧 DEBUG: Checking button text: "${text}"`);
                    if (text.includes('Obtener') || text.includes('informe') || text.includes('Submit')) {
                        console.log('✅ Found submit button:', text);
                        submitButton = btn;
                        break;
                    }
                }
            }
            
            if (submitButton) {
                console.log('✅ Found "Obtener informe" button, clicking...');
                submitButton.click();
                showNotification('📊 Loading work time data...', 'info');
            } else {
                console.log('⚠️ No submit button found');
                throw new Error('Could not find submit button for work time data');
            }
            
            // Wait for the data to load
            console.log('⏳ Waiting for data to load...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if data loaded successfully
            console.log('🔍 Checking if data loaded...');
            const dataTable = document.querySelector('#myFilter, table.table, .table-responsive table');
            if (dataTable && dataTable.innerHTML.trim()) {
                console.log('✅ Work time data loaded successfully');
                showNotification('✅ Work time data loaded!', 'success');
                return true;
            } else {
                console.log('⚠️ Work time data might not have loaded, but continuing...');
                showNotification('⚠️ Data may not have loaded, but continuing...', 'warning');
                return true; // Continue anyway as credentials might still be extractable
            }
            
        } catch (error) {
            console.log('❌ Error loading work time data:', error.message);
            showNotification(`❌ Failed to load work time data: ${error.message}`, 'error');
            throw error;
        }
    }
    
    // Debug helper function to gather comprehensive information
    function getDebugInfo() {
        const info = {
            url: window.location.href,
            title: document.title,
            readyState: document.readyState,
            timestamp: new Date().toISOString(),
            canExtract: canExtractCredentials(),
            isLoggedIn: isLoggedInButNotOnFace2Face(),
            isOnLoginPage: isOnLoginPage(),
            elements: {
                tables: document.querySelectorAll('table').length,
                buttons: document.querySelectorAll('button').length,
                inputs: document.querySelectorAll('input').length,
                forms: document.querySelectorAll('form').length
            },
            cookies: document.cookie ? 'present' : 'none',
            localStorage: localStorage.length > 0 ? 'present' : 'none'
        };
        
        // Check for specific elements
        info.specificElements = {
            myFilter: !!document.querySelector('#myFilter'),
            btnSubmit: !!document.querySelector('#btn_submit'),
            table: !!document.querySelector('table.table'),
            loginForm: !!document.querySelector('form[action*="login"], form[id*="login"]'),
            emailInput: !!document.querySelector('input[type="email"], input[type="text"], #email'),
            passwordInput: !!document.querySelector('input[type="password"], #password')
        };
        
        return info;
    }
    
    // Main extraction process
    async function performAutomatedExtraction() {
        if (extractionInProgress) {
            console.log('⚠️ Extraction already in progress');
            return;
        }
        
        extractionInProgress = true;
        
        try {
            console.log('🤖 Starting automated credential extraction...');
            console.log('🔧 DEBUG: Initial state:', getDebugInfo());
            
            // First, always wait for login to be complete
            if (!isLoggedInButNotOnFace2Face() && !canExtractCredentials()) {
                console.log('🔐 Waiting for login to complete...');
                showNotification('🔐 Please complete login first...', 'info');
                
                const loginSuccess = await waitForLogin();
                if (!loginSuccess) {
                    console.log('🔧 DEBUG: Login failed state:', getDebugInfo());
                    throw new Error('Login timeout or failed');
                }
                console.log('🔧 DEBUG: After login state:', getDebugInfo());
            }
            
            // Now navigate to face2face if not there already
            if (!window.location.href.includes('face2face')) {
                console.log('🔗 Navigating to face2face page...');
                showNotification('🔗 Navigating to work time page...', 'info');
                await navigateToWorkTimePage();
                console.log('🔧 DEBUG: After navigation state:', getDebugInfo());
            }
            
            // Always try to load/refresh data
            console.log('📊 Loading fresh work time data...');
            showNotification('📊 Loading work time data...', 'info');
            await loadWorkTimeData();
            console.log('🔧 DEBUG: After data load state:', getDebugInfo());
            
            // Wait longer for data to fully load
            console.log('⏳ Waiting for data to fully load...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            
            // Final strict validation
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts && !canExtractCredentials()) {
                console.log(`� Attempt ${attempts + 1}/${maxAttempts}: Checking if ready...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }
            
            if (!canExtractCredentials()) {
                console.log('🔧 DEBUG: Final failed state:', getDebugInfo());
                throw new Error('Data not ready after multiple attempts');
            }
            
            // Extract credentials
            console.log('✅ All conditions met! Extracting credentials...');
            console.log('🔧 DEBUG: Extraction ready state:', getDebugInfo());
            showNotification('🔍 Extracting credentials...', 'info');
            const credentials = extractCredentials();
            
            // Test credentials
            showNotification('🧪 Testing credentials...', 'info');
            const testResult = await testCredentials(credentials);
            
            // Send credentials to extension
            const result = {
                success: true,
                credentials: credentials,
                tested: testResult,
                message: testResult ? 'Credentials extracted and tested successfully!' : 'Credentials extracted but test failed (may still work)'
            };
            
            // Send to background script with enhanced debugging
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    console.log('🔧 DEBUG: Chrome runtime available, preparing to send credentials');
                    console.log('🔧 DEBUG: Extension ID:', chrome.runtime.id);
                    console.log('🔧 DEBUG: Sending credentials to background:', {
                        hasToken: !!result.credentials.token,
                        hasCookies: !!result.credentials.cookies,
                        clientCode: result.credentials.clientCode
                    });
                    
                    const messageData = {
                        action: 'credentialsExtracted',
                        result: result,
                        timestamp: new Date().toISOString(),
                        source: 'credential-extractor'
                    };
                    
                    console.log('🔧 DEBUG: Full message being sent:', messageData);
                    
                    // Try multiple approaches to ensure message delivery
                    let response = null;
                    let success = false;
                    
                    // Method 1: Standard sendMessage with callback
                    try {
                        response = await new Promise((resolve, reject) => {
                            const timeoutId = setTimeout(() => {
                                reject(new Error('Message timeout after 10 seconds'));
                            }, 10000);
                            
                            chrome.runtime.sendMessage(messageData, (response) => {
                                clearTimeout(timeoutId);
                                if (chrome.runtime.lastError) {
                                    console.log('🔧 DEBUG: Runtime error:', chrome.runtime.lastError.message);
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    console.log('🔧 DEBUG: Message sent successfully, response:', response);
                                    resolve(response);
                                }
                            });
                        });
                        success = true;
                        console.log('🔧 DEBUG: Background response to credentialsExtracted:', response);
                    } catch (error) {
                        console.log('🔧 DEBUG: Standard sendMessage failed:', error.message);
                        
                        // Method 2: Try without callback (fire and forget)
                        try {
                            chrome.runtime.sendMessage(messageData);
                            console.log('🔧 DEBUG: Fallback message sent without callback');
                            success = true;
                        } catch (fallbackError) {
                            console.log('🔧 DEBUG: Fallback message also failed:', fallbackError.message);
                        }
                    }
                    
                    if (success) {
                        // Also store credentials directly in content script context for debugging
                        try {
                            const directStorage = {
                                credentials: result.credentials,
                                extractedAt: new Date().toISOString(),
                                method: 'content-script-direct'
                            };
                            console.log('🔧 DEBUG: Attempting direct storage from content script:', directStorage);
                            
                            // This might fail due to permissions, but worth trying
                            await chrome.storage.local.set(directStorage);
                            console.log('🔧 DEBUG: Direct storage from content script succeeded');
                        } catch (storageError) {
                            console.log('🔧 DEBUG: Direct storage from content script failed (expected):', storageError.message);
                        }
                        
                        // Trigger immediate status update after successful extraction
                        setTimeout(() => {
                            console.log('🔄 Triggering immediate status update after credential extraction');
                            try {
                                chrome.runtime.sendMessage({
                                    action: 'forceUpdate',
                                    timestamp: new Date().toISOString()
                                });
                            } catch (updateError) {
                                console.log('🔧 DEBUG: Force update message failed:', updateError.message);
                            }
                        }, 3000);
                    } else {
                        throw new Error('All message sending methods failed');
                    }
                } else {
                    console.log('🔧 DEBUG: Chrome runtime not available');
                    console.log('🔧 DEBUG: chrome object:', typeof chrome);
                    console.log('🔧 DEBUG: chrome.runtime:', typeof chrome?.runtime);
                    console.log('🔧 DEBUG: chrome.runtime.sendMessage:', typeof chrome?.runtime?.sendMessage);
                    throw new Error('Chrome runtime not available');
                }
            } catch (error) {
                console.log('🔧 DEBUG: Complete message sending failure:', error.message);
                console.log('🔧 DEBUG: Error stack:', error.stack);
                
                // Show user notification about the issue
                showNotification(`⚠️ Failed to send credentials to extension: ${error.message}. Credentials were extracted but may not be saved.`, 'error');
            }
            
            console.log('🎉 Automated extraction completed!', result);
            
            // Show success notification on page
            showNotification('🎉 Credentials extracted and saved! Work time tracking is now active. You can close this tab and check the extension popup.', 'success');
            
        } catch (error) {
            console.error('💥 Extraction failed:', error);
            console.log('🔧 DEBUG: Error state:', getDebugInfo());
            
            const result = {
                success: false,
                error: error.message,
                message: `Extraction failed: ${error.message}`,
                stack: error.stack,
                debugInfo: getDebugInfo()
            };
            
            // Send error to background script
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({
                        action: 'credentialsExtracted',
                        result: result
                    });
                } else {
                    console.log('Chrome runtime not available for error reporting');
                }
            } catch (sendError) {
                console.log('🔧 DEBUG: Error sending error message to extension:', sendError.message);
            }
            
            // Show error notification on page
            showNotification(`❌ Extraction failed: ${error.message}`, 'error');
        } finally {
            extractionInProgress = false;
        }
    }
    
    // Function to show notification on the page
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after different timeouts based on type
        const timeout = type === 'success' ? 15000 : type === 'error' ? 10000 : 8000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, timeout);
    }
    
    // Listen for extraction requests from the extension
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 Received message from extension:', request);
            
            if (request.action === 'startExtraction') {
                console.log('📨 Received extraction request from extension');
                performAutomatedExtraction();
                sendResponse({ started: true });
            } else if (request.action === 'testConnection') {
                console.log('📨 Received connection test from extension');
                sendResponse({ 
                    connected: true, 
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    canExtract: canExtractCredentials() 
                });
            }
            return true;
        });
        
        // Test connection on script load
        console.log('🔧 DEBUG: Testing connection to background script...');
        try {
            chrome.runtime.sendMessage({
                action: 'contentScriptReady',
                url: window.location.href,
                timestamp: new Date().toISOString()
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('🔧 DEBUG: Connection test failed:', chrome.runtime.lastError.message);
                } else {
                    console.log('🔧 DEBUG: Connection test successful:', response);
                }
            });
        } catch (error) {
            console.log('🔧 DEBUG: Connection test error:', error.message);
        }
    } else {
        console.log('🔧 DEBUG: Chrome runtime not available for message listener');
    }
    
    // Auto-start extraction if we detect we're in extraction mode
    if (window.location.hash === '#cucoext-extract' || window.location.search.includes('cucoext-extract')) {
        console.log('🔍 Auto-starting extraction based on URL parameter');
        // Wait a bit longer for the page to fully load before starting
        setTimeout(() => {
            console.log('🚀 Starting automated extraction...');
            performAutomatedExtraction();
        }, 3000); // Increased from 2 to 3 seconds
    }
    
    // Also check for extraction trigger after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🔧 DOM loaded, checking for extraction trigger...');
            setTimeout(() => {
                if (window.location.hash === '#cucoext-extract' || window.location.search.includes('cucoext-extract')) {
                    console.log('🚀 Starting extraction after DOM load...');
                    performAutomatedExtraction();
                }
            }, 2000);
        });
    }
    
    // Periodically check if we should start extraction (for navigated pages)
    let extractionCheckInterval = setInterval(() => {
        debug.log('🔧 Periodic extraction check...');
        
        // If we're on face2face page and can extract, do it
        if (window.location.pathname.includes('face2face') && canExtractCredentials() && !extractionInProgress) {
            debug.log('🚀 Auto-starting extraction on face2face page with data ready');
            clearInterval(extractionCheckInterval);
            performAutomatedExtraction();
        }
        
        // Stop checking after 2 minutes
        setTimeout(() => {
            clearInterval(extractionCheckInterval);
            debug.log('🔧 Stopped periodic extraction check');
        }, 120000);
    }, 5000); // Check every 5 seconds
    
    // Make debug function available globally for manual testing
    window.workTimeTrackerDebug = {
        getDebugInfo: getDebugInfo,
        canExtractCredentials: canExtractCredentials,
        isLoggedIn: isLoggedInButNotOnFace2Face,
        isOnLoginPage: isOnLoginPage,
        extractCredentials: extractCredentials,
        performExtraction: performAutomatedExtraction,
        testConnection: () => {
            console.log('🧪 Testing connection...');
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    action: 'contentScriptReady',
                    test: true,
                    url: window.location.href
                }, (response) => {
                    console.log('🔧 Connection response:', response);
                    resolve(response);
                });
            });
        },
        forceExtraction: () => {
            console.log('🚀 Forcing extraction...');
            performAutomatedExtraction();
        }
    };
    
    debug.log('🔧 Work time tracker debug functions available as window.workTimeTrackerDebug');
    
    // Auto-trigger extraction if we're already ready
    if (canExtractCredentials()) {
        debug.log('🚀 Page already ready for extraction!');
        showNotification('🚀 Page ready for extraction!', 'success');
    } else if (window.location.pathname.includes('face2face')) {
        debug.log('📊 On face2face page but data not loaded - offering to load data');
        showNotification('📊 On work time page! Click "Obtener informe" to load data and extract credentials.', 'info');
    } else if (isLoggedInButNotOnFace2Face()) {
        debug.log('📍 Logged in but not on face2face page');
        showNotification('📍 Please navigate to the Registro de Jornada page', 'info');
    } else if (isOnLoginPage()) {
        debug.log('🔐 On login page - please log in first');
        showNotification('🔐 Please log in to continue', 'info');
    } else {
        debug.log('❓ Unknown page state - check debug info');
        debug.log('🔧 DEBUG: Current state:', getDebugInfo());
    }
    
    debug.log('🔧 CucoExt credential extractor ready');
})();
