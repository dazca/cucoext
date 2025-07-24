#!/usr/bin/env node
// Test date format matching
const today = new Date();

console.log('Today date in different formats:');
console.log('ISO:', today.toISOString().split('T')[0]);
console.log('es-ES:', today.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
}));
console.log('Manual DD/MM/YYYY:', `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`);

// Test what we actually found in the HTML
console.log('\nExpected in HTML: 24/07/2025');
