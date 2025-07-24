// Test script to verify messaging between content script and background
// Run this in the browser console on the Cuco360 page

console.log('🧪 Testing message passing...');

// Test 1: Check if chrome.runtime is available
console.log('🔧 Chrome runtime available:', !!chrome?.runtime);
console.log('🔧 Extension ID:', chrome?.runtime?.id);

// Test 2: Send a test message
if (chrome?.runtime?.sendMessage) {
    chrome.runtime.sendMessage({
        action: 'contentScriptReady',
        test: true,
        url: window.location.href
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ Message failed:', chrome.runtime.lastError.message);
        } else {
            console.log('✅ Message successful:', response);
        }
    });
} else {
    console.error('❌ Chrome runtime sendMessage not available');
}

// Test 3: Try to send credentialsExtracted message with dummy data
setTimeout(() => {
    console.log('🧪 Testing credentialsExtracted message...');
    
    chrome.runtime.sendMessage({
        action: 'credentialsExtracted',
        result: {
            success: true,
            credentials: {
                token: 'test-token-123',
                cookies: 'test-cookies',
                clientCode: 'test-client',
                extractedAt: new Date().toISOString(),
                extractedFrom: window.location.href
            },
            tested: false,
            message: 'Test credentials'
        }
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ credentialsExtracted message failed:', chrome.runtime.lastError.message);
        } else {
            console.log('✅ credentialsExtracted message successful:', response);
        }
    });
}, 2000);
