#!/usr/bin/env node
// Debug the actual HTML table structure
const CredentialManager = require('../credential-manager');
const https = require('https');

async function debugTableStructure() {
    try {
        // Load credentials
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();

        // Get HTML
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
        console.log('HTML length:', html.length);
        
        // Find all table elements
        const tableMatches = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
        console.log(`Found ${tableMatches ? tableMatches.length : 0} tables`);
        
        if (tableMatches) {
            tableMatches.forEach((table, index) => {
                console.log(`\n=== TABLE ${index + 1} ===`);
                
                // Find TR elements in this table
                const trMatches = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
                console.log(`  Rows: ${trMatches ? trMatches.length : 0}`);
                
                if (trMatches) {
                    trMatches.forEach((row, rowIndex) => {
                        const tdMatches = row.match(/<td[^>]*>[\s\S]*?<\/td>/gi);
                        const thMatches = row.match(/<th[^>]*>[\s\S]*?<\/th>/gi);
                        
                        if (tdMatches) {
                            console.log(`  Row ${rowIndex}: ${tdMatches.length} TD cells`);
                            // Show first few cells content
                            const firstCells = tdMatches.slice(0, 3).map(cell => 
                                cell.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 30)
                            );
                            console.log(`    Content: [${firstCells.join('"] ["')}"]`);
                            
                            // Check if this row contains today's date
                            if (row.includes('24/07/2025')) {
                                console.log('    *** THIS ROW CONTAINS TODAY\'S DATE ***');
                                // Show all cells for this row
                                tdMatches.forEach((cell, cellIndex) => {
                                    const content = cell.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                                    console.log(`      Cell ${cellIndex}: "${content}"`);
                                });
                            }
                        } else if (thMatches) {
                            console.log(`  Row ${rowIndex}: ${thMatches.length} TH cells (header)`);
                        } else {
                            console.log(`  Row ${rowIndex}: No TD/TH cells found`);
                        }
                    });
                }
            });
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

debugTableStructure();
