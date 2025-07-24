#!/usr/bin/env node
// Script to extract "Detalle marcajes" column for today
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');
const https = require('https');

async function getDetalleMarcajesForToday() {
    try {
        // Load credentials
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            const tracker = new WorkTimeTracker();
            credentials = tracker.credentials;
        }

        // Get today's date range
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

        if (response.statusCode !== 200) {
            return `Error: HTTP ${response.statusCode}`;
        }

        const html = response.body;
        
        // Find the row with today's data
        const todayDate = today.getDate().toString().padStart(2, '0');
        const todayMonthYear = `${todayDate}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Look for table rows containing today's date
        const rowMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
        if (!rowMatches) {
            return 'No table rows found';
        }

        for (const row of rowMatches) {
            if (row.includes(todayMonthYear)) {
                // Extract table cells
                const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
                if (cellMatches && cellMatches.length >= 11) {
                    // The "Detalle marcajes" should be the 11th column (index 10)
                    const detalleMarcajesCell = cellMatches[10];
                    
                    // Clean up HTML tags and decode entities
                    let detalleMarcajes = detalleMarcajesCell
                        .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
                        .replace(/&amp;/g, '&')   // Decode &amp;
                        .replace(/&lt;/g, '<')    // Decode &lt;
                        .replace(/&gt;/g, '>')    // Decode &gt;
                        .replace(/&quot;/g, '"')  // Decode &quot;
                        .replace(/\s+/g, ' ')     // Normalize whitespace
                        .trim();
                    
                    return detalleMarcajes || 'No marcajes data found';
                }
            }
        }
        
        return 'No data found for today';
        
    } catch (error) {
        return 'Error: ' + error.message;
    }
}

// Run and output result
if (require.main === module) {
    getDetalleMarcajesForToday().then(result => {
        console.log(result);
        process.exit(0);
    });
}

module.exports = getDetalleMarcajesForToday;
