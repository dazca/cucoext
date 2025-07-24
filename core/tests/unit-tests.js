// Unit tests for work time tracker core functionality
const WorkTimeTracker = require('../work-time-tracker');

class TestRunner {
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

    assertEqual(actual, expected, message) {
        this.assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
    }

    assertNotNull(value, message) {
        this.assert(value !== null && value !== undefined, message);
    }

    async run() {
        console.log('🧪 Running Work Time Tracker Unit Tests\n');

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

        console.log(`📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// Create test instance
const runner = new TestRunner();

// Test: Constructor and configuration
runner.test('Constructor initializes correctly', () => {
    const tracker = new WorkTimeTracker();
    
    runner.assertEqual(tracker.requiredPresenceMinutes, 8.5 * 60, 'Default presence minutes');
    runner.assertEqual(tracker.totalWorkdayMinutes, 9 * 60, 'Default workday minutes');
    runner.assertEqual(tracker.baseUrl, 'https://cuco360.cucorent.com', 'Default base URL');

    const customTracker = new WorkTimeTracker({
        requiredPresenceMinutes: 8 * 60,
        totalWorkdayMinutes: 8.5 * 60,
        baseUrl: 'https://custom.url'
    });

    runner.assertEqual(customTracker.requiredPresenceMinutes, 8 * 60, 'Custom presence minutes');
    runner.assertEqual(customTracker.totalWorkdayMinutes, 8.5 * 60, 'Custom workday minutes');
    runner.assertEqual(customTracker.baseUrl, 'https://custom.url', 'Custom base URL');
});

// Test: Time parsing functions
runner.test('Time parsing functions work correctly', () => {
    const tracker = new WorkTimeTracker();

    // parseTimeToMinutes tests
    runner.assertEqual(tracker.parseTimeToMinutes('09:30'), 570, 'Parse 09:30 to minutes');
    runner.assertEqual(tracker.parseTimeToMinutes('00:00'), 0, 'Parse 00:00 to minutes');
    runner.assertEqual(tracker.parseTimeToMinutes('23:59'), 1439, 'Parse 23:59 to minutes');
    runner.assertEqual(tracker.parseTimeToMinutes('--:--'), 0, 'Parse --:-- to minutes');
    runner.assertEqual(tracker.parseTimeToMinutes('0'), 0, 'Parse "0" to minutes');
    runner.assertEqual(tracker.parseTimeToMinutes(null), 0, 'Parse null to minutes');

    // formatMinutesToTime tests
    runner.assertEqual(tracker.formatMinutesToTime(570), '09:30', 'Format 570 minutes to time');
    runner.assertEqual(tracker.formatMinutesToTime(0), '00:00', 'Format 0 minutes to time');
    runner.assertEqual(tracker.formatMinutesToTime(1439), '23:59', 'Format 1439 minutes to time');
    runner.assertEqual(tracker.formatMinutesToTime(-30), '-00:30', 'Format negative minutes to time');
});

// Test: Timestamp parsing
runner.test('Timestamp parsing works correctly', () => {
    const tracker = new WorkTimeTracker();

    // Test normal entry/exit pattern
    const detailStr1 = '09:18:45 E 000 | 12:30:00 S 000 | 13:15:30 E 000 | 18:00:15 S 000 |';
    const result1 = tracker.parseTimestamps(detailStr1);
    
    runner.assertEqual(result1.entries.length, 2, 'Parse two entries');
    runner.assertEqual(result1.exits.length, 2, 'Parse two exits');
    runner.assertEqual(result1.entries[0], '09:18', 'First entry time');
    runner.assertEqual(result1.entries[1], '13:15', 'Second entry time');
    runner.assertEqual(result1.exits[0], '12:30', 'First exit time');
    runner.assertEqual(result1.exits[1], '18:00', 'Second exit time');

    // Test single entry (still working)
    const detailStr2 = '09:18:45 E 000 |';
    const result2 = tracker.parseTimestamps(detailStr2);
    
    runner.assertEqual(result2.entries.length, 1, 'Parse single entry');
    runner.assertEqual(result2.exits.length, 0, 'No exits when still working');
    runner.assertEqual(result2.entries[0], '09:18', 'Single entry time');

    // Test empty string
    const result3 = tracker.parseTimestamps('');
    runner.assertEqual(result3.entries.length, 0, 'Empty string returns no entries');
    runner.assertEqual(result3.exits.length, 0, 'Empty string returns no exits');
});

// Test: Date range generation
runner.test('Date range generation works correctly', () => {
    const tracker = new WorkTimeTracker();
    const dateRange = tracker.getTodayDateRange();
    
    const today = new Date();
    const expectedDate = today.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    
    const expectedRange = `${expectedDate} 00:00 - ${expectedDate} 23:59`;
    runner.assertEqual(dateRange, expectedRange, 'Generate correct date range for today');
});

// Test: Work time calculation
runner.test('Work time calculation works correctly', () => {
    const tracker = new WorkTimeTracker();

    // Test with no data
    const result1 = tracker.calculateRemainingTime(null);
    runner.assertEqual(result1.workStatus, 'not_working', 'No data returns not_working status');
    runner.assertEqual(result1.entryTime, '--:--', 'No data returns no entry time');

    // Test with work data (still working)
    const workData = {
        date: '24/07/2025',
        presence: '0',
        entries: ['09:18'],
        exits: [],
        rawDetail: '09:18:45 E 000 |'
    };

    // Mock current time to 14:00 (5 hours after entry)
    const originalDate = Date;
    global.Date = class extends originalDate {
        constructor() {
            super();
            return new originalDate('2025-07-24T14:00:00');
        }
        static now() {
            return new originalDate('2025-07-24T14:00:00').getTime();
        }
        getHours() { return 14; }
        getMinutes() { return 0; }
    };

    const result2 = tracker.calculateRemainingTime(workData);
    runner.assertEqual(result2.entryTime, '09:18', 'Correct entry time');
    runner.assertEqual(result2.workStatus, 'working', 'Working status when still in office');
    runner.assert(result2.totalPresence > 0, 'Calculated presence time');

    // Restore original Date
    global.Date = originalDate;

    // Test completed work day
    const completedWorkData = {
        date: '24/07/2025',
        presence: '08:30',
        entries: ['09:00'],
        exits: ['18:30'],
        rawDetail: '09:00:00 E 000 | 18:30:00 S 000 |'
    };

    const result3 = tracker.calculateRemainingTime(completedWorkData);
    runner.assertEqual(result3.workStatus, 'can_leave', 'Can leave when requirements met');
});

// Test: HTML parsing fallback
runner.test('HTML parsing fallback works correctly', () => {
    const tracker = new WorkTimeTracker();
    
    const sampleHTML = `
        <tr>
            <td class="column1">24/07/2025</td>
            <td>819</td>
            <td>990</td>
            <td class="column3">SPAIN BARCELONA</td>
            <td class="column4">R&amp;D - SYSTEMS</td>
            <td class="column6">08:30</td>
            <td class="column6">0</td>
            <td class="column6">08:30</td>
            <td class="column6 ">0</td>
            <td class="column6">Marcajes incompletos 08:30 | </td>
            <td class="column5">09:18:45 E 000 |</td>
        </tr>
    `;

    const result = tracker.parseWorkTimeFromHTMLRegex(sampleHTML, '24/07/2025');
    
    runner.assertNotNull(result, 'HTML regex parsing returns result');
    runner.assertEqual(result.date, '24/07/2025', 'Correct date parsed');
    runner.assertEqual(result.entries.length, 1, 'Entry parsed from HTML');
    runner.assertEqual(result.entries[0], '09:18', 'Correct entry time from HTML');
});

// Run the tests
if (require.main === module) {
    runner.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = runner;
