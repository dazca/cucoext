#!/usr/bin/env node
// Debug script to examine the "Detalle marcajes" column
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');
const https = require('https');

async function debugDetalleMarcajes() {
    try {
        console.log('🔍 Debug: Loading credentials...');
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            console.log('   No config credentials found, using defaults');
            const tracker = new WorkTimeTracker();
            credentials = tracker.credentials;
        }

        console.log('🔍 Debug: Making POST request to /face2face/f2ffilter...');
        
        // Get today's date range like WorkTimeTracker does
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const dateRange = `${dateStr} - ${dateStr}`;
        
        console.log(`   Date range: ${dateRange}`);
        
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

        if (response.statusCode !== 200) {
            console.log('❌ Unexpected status code:', response.statusCode);
            return;
        }

        console.log('🔍 HTML response received, parsing...');
        
        // Look for table rows and headers
        const html = response.body;
        
        // Find table headers to understand structure
        const headerMatches = html.match(/<th[^>]*>(.*?)<\/th>/gi);
        if (headerMatches) {
            console.log('🔍 Table headers found:');
            headerMatches.forEach((header, index) => {
                const cleanHeader = header.replace(/<[^>]*>/g, '').trim();
                if (cleanHeader) {
                    console.log(`   ${index}: ${cleanHeader}`);
                }
            });
        }
        
        // Look for "Detalle" specifically
        const detalleMatch = html.match(/detalle\s+marcajes/i);
        if (detalleMatch) {
            console.log('✅ Found "Detalle marcajes" in HTML');
        } else {
            console.log('❌ "Detalle marcajes" not found, looking for similar terms...');
            const similarTerms = html.match(/(detalle|marcaje|marcajes|entry|exit|entrada|salida)/gi);
            if (similarTerms) {
                console.log('   Similar terms found:', [...new Set(similarTerms)]);
            }
        }
        
        // Look for table rows with data
        const rowMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
        if (rowMatches) {
            console.log(`🔍 Found ${rowMatches.length} table rows`);
            
            // Look for rows that might contain time data
            let timeDataRows = 0;
            rowMatches.forEach((row, index) => {
                // Look for time patterns (HH:MM:SS or HH:MM)
                const timePattern = /\d{2}:\d{2}(:\d{2})?/g;
                const timeMatches = row.match(timePattern);
                if (timeMatches && timeMatches.length > 0) {
                    timeDataRows++;
                    const cleanRow = row.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                    console.log(`   Row ${index} with times: ${timeMatches.join(', ')}`);
                    console.log(`   Content: ${cleanRow.substring(0, 200)}...`);
                }
            });
            
            console.log(`🔍 Rows with time data: ${timeDataRows}`);
        }
        
        // Look for today's date specifically
        const todayPatterns = [
            dateStr, // YYYY-MM-DD
            today.toLocaleDateString('es-ES'), // Spanish format
            today.getDate().toString().padStart(2, '0'), // Just day
        ];
        
        let todayFound = false;
        todayPatterns.forEach(pattern => {
            if (html.includes(pattern)) {
                console.log(`✅ Found today's date pattern: ${pattern}`);
                todayFound = true;
            }
        });
        
        if (!todayFound) {
            console.log('❌ Today\'s date not found in any expected format');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

debugDetalleMarcajes();
