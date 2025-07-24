#!/usr/bin/env node
// Debug the actual HTML response
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');
const https = require('https');

async function debugHTMLResponse() {
    try {
        console.log('🔍 Debug: Loading credentials...');
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            console.log('   No config credentials found');
            return;
        }

        console.log('🔍 Debug: Making POST request to /face2face/f2ffilter...');
        
        // Get today's date range like WorkTimeTracker does
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
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
                    resolve({ statusCode: res.statusCode, body: data, headers: res.headers });
                });
            });
            req.on('error', reject);
            req.write(requestBody.toString());
            req.end();
        });

        console.log(`🔍 Response status: ${response.statusCode}`);
        console.log(`🔍 Response headers:`, Object.keys(response.headers));
        
        if (response.statusCode === 419) {
            console.log('❌ Token expired (419), would trigger automation retry');
            return;
        }
        
        if (response.statusCode !== 200) {
            console.log('❌ Unexpected status code');
            console.log('   Body preview:', response.body.substring(0, 500));
            return;
        }

        console.log('🔍 HTML body length:', response.body.length);
        
        // Look for key elements
        const hasTable = response.body.includes('<table');
        const hasRegistro = response.body.includes('registro');
        const hasJornada = response.body.includes('jornada');
        const hasToday = response.body.includes(new Date().toISOString().split('T')[0]);
        
        console.log('🔍 HTML analysis:');
        console.log(`   Contains <table>: ${hasTable}`);
        console.log(`   Contains 'registro': ${hasRegistro}`);
        console.log(`   Contains 'jornada': ${hasJornada}`);
        console.log(`   Contains today's date: ${hasToday}`);
        
        // Show a snippet around tables
        const tableMatch = response.body.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
        if (tableMatch) {
            console.log(`🔍 Found ${tableMatch.length} table(s)`);
            console.log('   First table preview:');
            console.log('  ', tableMatch[0].substring(0, 800) + '...');
        } else {
            console.log('❌ No tables found in HTML');
            // Show general content preview
            console.log('   Body preview:');
            console.log('  ', response.body.substring(0, 1000) + '...');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

debugHTMLResponse();
