#!/usr/bin/env node
// Manual token extraction guide with the browser you already have open
console.log('🔧 Manual Token Extraction Guide');
console.log('');
console.log('Since the automated browser successfully logged you in,');
console.log('you can extract the tokens manually:');
console.log('');
console.log('📋 Steps:');
console.log('1. In the browser window that opened (if still open)');
console.log('2. Press F12 to open Developer Tools');
console.log('3. Go to Network tab');
console.log('4. Refresh the page (F5)');
console.log('5. Click on any request to the site');
console.log('6. Look for Request Headers section');
console.log('7. Copy the entire Cookie header value');
console.log('8. Copy the CSRF token (usually in a form or meta tag)');
console.log('');
console.log('📝 Example Cookie format:');
console.log('XSRF-TOKEN=eyJ...; cuco360_session=eyJ...; other_cookies=value');
console.log('');
console.log('⚡ Quick extraction alternative:');
console.log('Run this in the browser console (F12 → Console tab):');
console.log('');
console.log('document.cookie');
console.log('');
console.log('📤 Then run:');
console.log('node set-token.js [token-value] "[full-cookie-string]"');
console.log('');
console.log('💡 Or try the working PowerShell script with fresh tokens!');
