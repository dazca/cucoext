#!/usr/bin/env node
/**
 * Test suite for theoretical exit calculator
 * Tests all working hours sets and different scenarios
 */

const TheoreticalExitCalculator = require('./theoretical-exit');
const { WORKING_HOURS_SETS } = require('../resources/working-hours-config');

class TheoreticalExitTester {
    constructor() {
        this.calculator = new TheoreticalExitCalculator();
        this.testResults = [];
    }

    /**
     * Run a single test case
     */
    runTest(testName, testFunction) {
        try {
            console.log(`\n🧪 Testing: ${testName}`);
            const result = testFunction();
            console.log('✅ PASSED');
            this.testResults.push({ name: testName, status: 'PASSED', result });
            return result;
        } catch (error) {
            console.log('❌ FAILED:', error.message);
            this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
            return null;
        }
    }

    /**
     * Test all working hours sets with a standard entry time
     */
    testAllWorkingSets() {
        console.log('\n=== TESTING ALL WORKING HOURS SETS ===');
        
        const entryTime = '09:00';
        const testDays = [
            { name: 'Monday', date: new Date(2025, 6, 21) },    // July 21, 2025 (Monday)
            { name: 'Friday', date: new Date(2025, 6, 25) },    // July 25, 2025 (Friday)
        ];

        Object.keys(WORKING_HOURS_SETS).forEach(setKey => {
            const workingSet = WORKING_HOURS_SETS[setKey];
            
            testDays.forEach(({ name: dayName, date }) => {
                this.runTest(`${workingSet.name} - ${dayName}`, () => {
                    const result = this.calculator.calculateManualExitTime(entryTime, setKey, date);
                    
                    console.log(`   Entry: ${result.entryTime} → Exit: ${result.exitTime}`);
                    console.log(`   Presence: ${Math.floor(result.totalPresenceMinutes / 60)}h ${result.totalPresenceMinutes % 60}min`);
                    console.log(`   Work: ${Math.floor(result.workMinutes / 60)}h ${result.workMinutes % 60}min + Eating: ${result.eatingMinutes}min`);
                    
                    // Validate the calculation
                    const entryMinutes = this.calculator.workingHoursManager.parseTimeToMinutes(result.entryTime);
                    const exitMinutes = this.calculator.workingHoursManager.parseTimeToMinutes(result.exitTime);
                    const calculatedPresence = exitMinutes - entryMinutes;
                    
                    if (Math.abs(calculatedPresence - result.totalPresenceMinutes) > 1) {
                        throw new Error(`Presence calculation mismatch: expected ${result.totalPresenceMinutes}, got ${calculatedPresence}`);
                    }
                    
                    return result;
                });
            });
        });
    }

    /**
     * Test edge cases and special scenarios
     */
    testEdgeCases() {
        console.log('\n=== TESTING EDGE CASES ===');

        // Test early morning entry
        this.runTest('Early morning entry (06:30)', () => {
            const result = this.calculator.calculateManualExitTime('06:30', 'common');
            console.log(`   06:30 → ${result.exitTime} (${result.setName})`);
            return result;
        });

        // Test late morning entry
        this.runTest('Late morning entry (10:30)', () => {
            const result = this.calculator.calculateManualExitTime('10:30', 'standard');
            console.log(`   10:30 → ${result.exitTime} (${result.setName})`);
            return result;
        });

        // Test August intensive schedule (auto-detection)
        this.runTest('August intensive auto-detection', () => {
            const augustDate = new Date(2025, 7, 15); // August 15, 2025
            const result = this.calculator.calculateExitTime('09:00', augustDate);
            console.log(`   August: 09:00 → ${result.exitTime} (${result.setName})`);
            
            if (!result.setName.includes('Intensive')) {
                throw new Error('August should auto-detect intensive schedule');
            }
            
            return result;
        });

        // Test Friday in common schedule (should be 6h only)
        this.runTest('Friday common schedule (6h only)', () => {
            const friday = new Date(2025, 6, 25); // July 25, 2025 (Friday)
            const result = this.calculator.calculateManualExitTime('09:00', 'common', friday);
            console.log(`   Friday Common: 09:00 → ${result.exitTime} (${result.workMinutes/60}h work)`);
            
            if (result.workMinutes !== 6 * 60) {
                throw new Error(`Friday should be 6h work, got ${result.workMinutes/60}h`);
            }
            
            return result;
        });
    }

    /**
     * Test real-world scenarios
     */
    testRealWorldScenarios() {
        console.log('\n=== TESTING REAL-WORLD SCENARIOS ===');

        const scenarios = [
            { name: 'Typical morning start', entry: '08:30', set: 'common' },
            { name: 'Late start', entry: '10:00', set: 'common' },
            { name: 'Very early start', entry: '07:00', set: 'standard' },
            { name: 'Standard 9-to-5 equivalent', entry: '09:00', set: 'standard' },
            { name: 'Summer intensive', entry: '08:00', set: 'intensive' }
        ];

        scenarios.forEach(({ name, entry, set }) => {
            this.runTest(name, () => {
                const result = this.calculator.calculateManualExitTime(entry, set);
                console.log(`   ${entry} → ${result.exitTime} (${result.setName})`);
                console.log(`   Total presence: ${Math.floor(result.totalPresenceMinutes / 60)}h ${result.totalPresenceMinutes % 60}min`);
                return result;
            });
        });
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🚀 Starting Theoretical Exit Calculator Test Suite\n');
        
        this.testAllWorkingSets();
        this.testEdgeCases();
        this.testRealWorldScenarios();
        
        // Summary
        const passed = this.testResults.filter(r => r.status === 'PASSED').length;
        const failed = this.testResults.filter(r => r.status === 'FAILED').length;
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📊 Total: ${this.testResults.length}`);
        
        if (failed > 0) {
            console.log('\n❌ Failed tests:');
            this.testResults
                .filter(r => r.status === 'FAILED')
                .forEach(test => console.log(`   - ${test.name}: ${test.error}`));
        }
        
        return failed === 0;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new TheoreticalExitTester();
    const allPassed = tester.runAllTests();
    process.exit(allPassed ? 0 : 1);
}

module.exports = TheoreticalExitTester;
