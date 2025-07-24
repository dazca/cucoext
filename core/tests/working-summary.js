#!/usr/bin/env node
/**
 * Working Hours System Summary
 * Comprehensive overview of your working hours status
 */

const TheoreticalExitCalculator = require('./theoretical-exit');
const getCurrentWorkingMinutes = require('./simple-minutes-test');
const getCurrentPresenceMinutes = require('./simple-presence-test');
const getDetalleMarcajes = require('./detalle-marcajes-test');

async function generateWorkingSummary() {
    console.log('🕐 WORKING HOURS SUMMARY');
    console.log('='.repeat(50));
    
    try {
        // Get current working minutes
        console.log('📊 Current Status:');
        const currentMinutes = await getCurrentWorkingMinutes();
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        console.log(`   Working time today: ${hours}h ${mins}min (${currentMinutes} minutes)`);
        
        // Get current presence minutes
        const presenceMinutes = await getCurrentPresenceMinutes();
        const presenceHours = Math.floor(presenceMinutes / 60);
        const presenceMins = presenceMinutes % 60;
        console.log(`   Presence time today: ${presenceHours}h ${presenceMins}min (${presenceMinutes} minutes)`);
        
        // Get marcajes detail
        const marcajes = await getDetalleMarcajes();
        console.log(`   Marcajes: ${marcajes}`);
        
        // Get theoretical exit
        const calculator = new TheoreticalExitCalculator();
        const exitInfo = await calculator.getTodayTheoreticalExit();
        
        if (!exitInfo.error) {
            console.log('\n🎯 Theoretical Exit:');
            console.log(`   Entry: ${exitInfo.entryTime}`);
            console.log(`   Theoretical exit: ${exitInfo.exitTime}`);
            console.log(`   Working set: ${exitInfo.setName}`);
            console.log(`   Required presence: ${Math.floor(exitInfo.totalPresenceMinutes / 60)}h ${exitInfo.totalPresenceMinutes % 60}min`);
            console.log(`   Current time: ${exitInfo.currentTime}`);
            
            if (exitInfo.remainingMinutes > 0) {
                const remHours = Math.floor(exitInfo.remainingMinutes / 60);
                const remMins = exitInfo.remainingMinutes % 60;
                console.log(`   ⏰ Time remaining: ${remHours}h ${remMins}min`);
            } else {
                console.log(`   ✅ You can leave now! (overtime: ${Math.abs(exitInfo.remainingMinutes)} minutes)`);
            }
        } else {
            console.log('\n❌ Theoretical Exit:');
            console.log(`   ${exitInfo.error}`);
        }
        
        // Calculate progress
        if (!exitInfo.error && currentMinutes > 0) {
            const progressPercent = Math.round((currentMinutes / exitInfo.totalPresenceMinutes) * 100);
            const progressBar = '█'.repeat(Math.floor(progressPercent / 5)) + '░'.repeat(20 - Math.floor(progressPercent / 5));
            console.log('\n📈 Progress:');
            console.log(`   [${progressBar}] ${progressPercent}%`);
        }
        
        console.log('\n' + '='.repeat(50));
        
    } catch (error) {
        console.log('❌ Error generating summary:', error.message);
    }
}

// Export for module use
module.exports = generateWorkingSummary;

// Run as CLI if called directly
if (require.main === module) {
    generateWorkingSummary().then(() => process.exit(0));
}
