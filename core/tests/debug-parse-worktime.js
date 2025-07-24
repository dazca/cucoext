#!/usr/bin/env node
// Debug the parseWorkTimeFromHTML function specifically
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');

async function debugParseWorkTime() {
    try {
        // Load credentials
        const credManager = new CredentialManager();
        let credentials = credManager.loadCredentials();
        
        if (!credentials) {
            const tracker = new WorkTimeTracker();
            credentials = tracker.credentials;
        }

        console.log('🔍 Fetching HTML data...');
        const tracker = new WorkTimeTracker();
        
        // Manually make the request to get HTML
        const dateRange = tracker.getTodayDateRange();
        const requestBody = new URLSearchParams({
            '_token': credentials.token,
            'cod_cliente': credentials.clientCode || '',
            'rango': dateRange,
            'order': 'nom_empleado',
            'type': 'empleado',
            'document': 'pantalla',
            'orientation': 'v'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': '*/*',
            'Origin': tracker.baseUrl,
            'Referer': `${tracker.baseUrl}/face2face`
        };

        if (credentials.cookies) {
            headers['Cookie'] = credentials.cookies;
        }

        const response = await fetch(`${tracker.baseUrl}/face2face/f2ffilter`, {
            method: 'POST',
            headers: headers,
            body: requestBody.toString()
        });

        if (!response.ok) {
            console.log('❌ HTTP error:', response.status);
            return;
        }

        const htmlContent = await response.text();
        console.log('✅ HTML received, length:', htmlContent.length);

        // Now test the parsing
        console.log('🔍 Testing parseWorkTimeFromHTML...');
        const today = new Date();
        const todayStr = today.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        console.log('   Looking for date:', todayStr);

        // Test with jsdom
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM(htmlContent);
        const doc = dom.window.document;

        const rows = doc.querySelectorAll('tr');
        console.log(`   Found ${rows.length} table rows`);

        let foundTodayRow = false;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            
            if (cells.length >= 11) {
                const dateCell = cells[0]?.textContent?.trim();
                console.log(`   Row ${i}: Date="${dateCell}", Cells=${cells.length}`);
                
                if (dateCell === todayStr) {
                    foundTodayRow = true;
                    console.log('   ✅ Found today\'s row!');
                    console.log('   Cell contents:');
                    for (let j = 0; j < Math.min(cells.length, 11); j++) {
                        const content = cells[j]?.textContent?.trim();
                        console.log(`     [${j}]: "${content}"`);
                    }
                    
                    const detailCell = cells[10]?.textContent?.trim();
                    console.log(`   Detail cell (10): "${detailCell}"`);
                    
                    const timestamps = tracker.parseTimestamps(detailCell);
                    console.log('   Parsed timestamps:', timestamps);
                    break;
                }
            }
        }

        if (!foundTodayRow) {
            console.log('❌ Today\'s row not found');
            console.log('   Available dates in first cells:');
            for (let i = 0; i < Math.min(rows.length, 10); i++) {
                const row = rows[i];
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    const dateCell = cells[0]?.textContent?.trim();
                    console.log(`     Row ${i}: "${dateCell}"`);
                }
            }
        }

        // Also test the actual function
        console.log('🔍 Testing actual parseWorkTimeFromHTML function...');
        const result = tracker.parseWorkTimeFromHTML(htmlContent);
        console.log('   Function result:', result);

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

debugParseWorkTime();
