#!/usr/bin/env node
// Simple token and cookie helper
const fs = require('fs');
const path = require('path');

function parseAndSaveCookies() {
    console.log('🔧 Cookie and Token Helper');
    console.log('==========================\n');
    
    // Get the input from command line or prompt for it
    const args = process.argv.slice(2);
    
    if (args.length >= 2) {
        // Command line usage: node cookie-helper.js "cookie_header" "token_value"
        const cookieHeader = args[0];
        const tokenValue = args[1];
        const clientCode = args[2] || 'CLIENT_CODE';
        
        saveParsedCredentials(cookieHeader, tokenValue, clientCode);
    } else {
        console.log('Usage:');
        console.log('node cookie-helper.js "FULL_COOKIE_HEADER" "TOKEN_VALUE" [CLIENT_CODE]');
        console.log('');
        console.log('Example:');
        console.log('node cookie-helper.js "XSRF-TOKEN=abc123; cuco360_session=xyz456" "abc123" "YOUR_CLIENT_CODE"');
        console.log('');
        console.log('Or use: node extract-tokens.js for interactive mode');
    }
}

function saveParsedCredentials(cookieHeader, tokenValue, clientCode = 'CLIENT_CODE') {
    try {
        console.log('📋 Parsing credentials...');
        
        // Extract XSRF-TOKEN
        const xsrfMatch = cookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        if (!xsrfMatch) {
            throw new Error('XSRF-TOKEN not found in cookie header');
        }
        
        // Extract session cookie
        const sessionMatch = cookieHeader.match(/cuco360_session=([^;]+)/);
        if (!sessionMatch) {
            console.log('⚠️  cuco360_session not found, using XSRF-TOKEN only');
        }
        
        // Build clean cookie string
        let cleanCookies = `XSRF-TOKEN=${xsrfMatch[1]}`;
        if (sessionMatch) {
            cleanCookies += `; cuco360_session=${sessionMatch[1]}`;
        }
        
        const credentials = {
            token: tokenValue.trim(),
            cookies: cleanCookies,
            clientCode: clientCode
        };
        
        // Validate token matches XSRF-TOKEN
        const decodedXsrf = decodeURIComponent(xsrfMatch[1]);
        if (tokenValue.trim() !== decodedXsrf) {
            console.log('⚠️  Warning: _token does not match XSRF-TOKEN');
            console.log('This may cause CSRF errors. Consider using XSRF-TOKEN value as token.');
        }
        
        // Save credentials
        const configPath = path.join(__dirname, '..', 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(credentials, null, 2));
        
        console.log('✅ Credentials saved successfully!');
        console.log(`📁 Config: ${configPath}`);
        console.log(`🔑 Token: ${credentials.token.substring(0, 30)}...`);
        console.log(`🍪 Cookies: ${credentials.cookies.substring(0, 50)}...`);
        console.log(`🏢 Client: ${credentials.clientCode}`);
        
        return credentials;
        
    } catch (error) {
        console.log('❌ Error parsing credentials:', error.message);
        return null;
    }
}

if (require.main === module) {
    parseAndSaveCookies();
}

module.exports = { saveParsedCredentials };
