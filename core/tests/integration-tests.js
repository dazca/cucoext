// Integration tests for work time tracker
const WorkTimeTracker = require('../work-time-tracker');
const CredentialManager = require('../credential-manager');

class IntegrationTestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    assert(condition, message) {
        if (condition) {
            console.log(`  ✅ ${message}`);
            this.passed++;
        } else {
            console.log(`  ❌ ${message}`);
            this.failed++;
        }
    }

    async run() {
        console.log('🔗 Running Integration Tests\n');

        for (const test of this.tests) {
            console.log(`📋 ${test.name}`);
            try {
                await test.testFn();
            } catch (error) {
                console.log(`  ❌ Test failed with error: ${error.message}`);
                this.failed++;
            }
            console.log('');
        }

        console.log(`📊 Integration Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new IntegrationTestRunner();

// Test: Credential management
runner.test('Credential management works', async () => {
    // Try local config first, then test config, then create minimal test config
    let configPath = './config-local.json';
    if (!require('fs').existsSync(configPath)) {
        configPath = './test-config.json';
        if (!require('fs').existsSync(configPath)) {
            // Create minimal test config
            const testConfig = {
                token: 'test-token',
                cookies: 'test-cookies',
                clientCode: 'test-client'
            };
            require('fs').writeFileSync(configPath, JSON.stringify(testConfig, null, 2));
        }
    }
    const credManager = new CredentialManager(configPath);

    // Test saving and loading credentials
    const testCredentials = {
        token: 'test-token-123',
        cookies: 'XSRF-TOKEN=test; cuco360_session=test',
        clientCode: 'test-client-123'
    };

    const saved = credManager.saveCredentials(testCredentials);
    runner.assert(saved, 'Credentials saved successfully');

    const loaded = credManager.loadCredentials();
    runner.assert(loaded !== null, 'Credentials loaded successfully');
    runner.assert(loaded.token === testCredentials.token, 'Token matches');
    runner.assert(loaded.cookies === testCredentials.cookies, 'Cookies match');

    // Test validation
    const isValid = credManager.validateCredentials(loaded);
    runner.assert(isValid, 'Credentials validation passes');

    // Test invalid credentials
    const invalidCreds = { token: 'short' };
    const isInvalid = credManager.validateCredentials(invalidCreds);
    runner.assert(!isInvalid, 'Invalid credentials rejected');

    // Cleanup
    credManager.clearCredentials();
});

// Test: API request formation (without actual API call)
runner.test('API request formation works', () => {
    const tracker = new WorkTimeTracker();
    
    // Test date range
    const dateRange = tracker.getTodayDateRange();
    runner.assert(dateRange.includes('00:00'), 'Date range includes start time');
    runner.assert(dateRange.includes('23:59'), 'Date range includes end time');
    
    console.log(`  ℹ️  Today's date range: ${dateRange}`);
});

// Test: End-to-end workflow (with mock data)
runner.test('End-to-end workflow with mock data', async () => {
    const tracker = new WorkTimeTracker();

    // Mock HTML response (today's date)
    const today = new Date().toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });

    const mockHTML = `
        <tr>
            <td class="column1">${today}</td>
            <td>819</td>
            <td>990</td>
            <td class="column3">SPAIN BARCELONA</td>
            <td class="column4">R&amp;D - SYSTEMS</td>
            <td class="column6">08:30</td>
            <td class="column6">05:30</td>
            <td class="column6">08:30</td>
            <td class="column6">0</td>
            <td class="column6"></td>
            <td class="column5">09:00:00 E 000 | 12:30:00 S 000 | 13:30:00 E 000 | 18:00:00 S 000 |</td>
        </tr>
    `;

    // Test HTML parsing
    const workData = tracker.parseWorkTimeFromHTMLRegex(mockHTML, today);
    runner.assert(workData !== null, 'Work data parsed from HTML');
    runner.assert(workData.entries.length === 2, 'Two entries parsed');
    runner.assert(workData.exits.length === 2, 'Two exits parsed');

    // Test time calculation
    const timeData = tracker.calculateRemainingTime(workData);
    runner.assert(timeData !== null, 'Time calculation completed');
    runner.assert(timeData.entryTime === '09:00', 'Correct entry time');
    runner.assert(timeData.exitTime === '18:00', 'Correct exit time');
    runner.assert(timeData.workStatus === 'can_leave', 'Correct work status for completed day');

    console.log(`  ℹ️  Entry: ${timeData.entryTime}, Exit: ${timeData.exitTime}, Status: ${timeData.workStatus}`);
});

// Test: Error handling
runner.test('Error handling works correctly', async () => {
    const tracker = new WorkTimeTracker();

    // Test with invalid credentials
    const invalidCredentials = {
        token: '',
        cookies: '',
        clientCode: 'test-client-code'
    };

    try {
        await tracker.fetchWorkTimeData(invalidCredentials);
        runner.assert(false, 'Should throw error with invalid credentials');
    } catch (error) {
        runner.assert(true, 'Throws error with invalid credentials');
        console.log(`  ℹ️  Expected error: ${error.message}`);
    }

    // Test with null data
    const result = tracker.calculateRemainingTime(null);
    runner.assert(result.workStatus === 'not_working', 'Handles null data gracefully');
});

// Test: Time calculations edge cases
runner.test('Time calculation edge cases', () => {
    const tracker = new WorkTimeTracker();

    // Test exactly 9 hours
    const exactData = {
        entries: ['09:00'],
        exits: ['18:00'],
        presence: '08:30'
    };

    // Mock time to exactly 18:00
    const originalDate = Date;
    global.Date = class extends originalDate {
        constructor() {
            super();
            return new originalDate('2025-07-24T18:00:00');
        }
        getHours() { return 18; }
        getMinutes() { return 0; }
    };

    const result = tracker.calculateRemainingTime(exactData);
    runner.assert(result.exactNineHours || result.workStatus === 'can_leave', 'Detects 9-hour completion');

    // Restore Date
    global.Date = originalDate;

    // Test multiple entries/exits
    const multipleData = {
        entries: ['09:00', '14:00', '16:00'],
        exits: ['12:00', '15:00'],
        presence: '0'
    };

    const result2 = tracker.calculateRemainingTime(multipleData);
    runner.assert(result2.entryTime === '09:00', 'Uses first entry for calculations');
    runner.assert(result2.totalPresence > 0, 'Calculates presence from multiple periods');
});

// Run the tests
if (require.main === module) {
    runner.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = runner;
