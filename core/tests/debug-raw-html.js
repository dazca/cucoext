#!/usr/bin/env node
// Debug by looking at raw HTML around today's date
const CredentialManager = require('../credential-manager');
const https = require('https');

async function debugRawHTML() {
    try {
        // Load credentials and get HTML (same as before)
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();

        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const dateRange = `${dateStr} - ${dateStr}`;
        
        const requestBody = new URLSearchParams({
            '_token': credentials.token,
            'cod_cliente': credentials.clientCode || '',
            'rango': dateRange,
            'order': 'nom_empleado',
            'type': 'empleado',
            'document': 'pantalla',
            'orientation': 'v'
        });

        const options = {
            hostname: 'cuco360.cucorent.com',
            path: '/face2face/f2ffilter',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': credentials.cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
                'Origin': 'https://cuco360.cucorent.com',
                'Referer': 'https://cuco360.cucorent.com/face2face'
            }
        };

        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({ statusCode: res.statusCode, body: data });
                });
            });
            req.on('error', reject);
            req.write(requestBody.toString());
            req.end();
        });

        const html = response.body;
        
        // Find the position of today's date
        const todayDatePos = html.indexOf('24/07/2025');
        if (todayDatePos === -1) {
            console.log('❌ Today\'s date not found in HTML');
            return;
        }
        
        console.log('✅ Found today\'s date at position:', todayDatePos);
        
        // Show context around the date (500 chars before and after)
        const start = Math.max(0, todayDatePos - 500);
        const end = Math.min(html.length, todayDatePos + 500);
        const context = html.substring(start, end);
        
        console.log('\n=== HTML CONTEXT AROUND TODAY\'S DATE ===');
        console.log(context);
        console.log('\n=== END CONTEXT ===');
        
        // Try to find the row structure
        const beforeDate = html.substring(Math.max(0, todayDatePos - 2000), todayDatePos);
        const afterDate = html.substring(todayDatePos, Math.min(html.length, todayDatePos + 2000));
        
        // Look for div or other container structures
        const beforeDivMatches = beforeDate.match(/<div[^>]*>[^<]*$/);
        const afterDivMatches = afterDate.match(/^[^<]*<\/div>/);
        
        if (beforeDivMatches || afterDivMatches) {
            console.log('\n🔍 Data seems to be in DIV structure, not TABLE');
        }
        
        // Look for the specific pattern we saw in detalle-marcajes
        const marcajesPattern = /09:18:45\s+E\s+000\s+\|/;
        const marcajesMatch = html.match(marcajesPattern);
        if (marcajesMatch) {
            const marcajesPos = html.indexOf(marcajesMatch[0]);
            console.log('\n✅ Found marcajes pattern at position:', marcajesPos);
            
            // Show context around marcajes
            const marcajesStart = Math.max(0, marcajesPos - 300);
            const marcajesEnd = Math.min(html.length, marcajesPos + 300);
            const marcajesContext = html.substring(marcajesStart, marcajesEnd);
            
            console.log('\n=== HTML CONTEXT AROUND MARCAJES ===');
            console.log(marcajesContext);
            console.log('\n=== END MARCAJES CONTEXT ===');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

debugRawHTML();
