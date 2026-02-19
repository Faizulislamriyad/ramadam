// shared-utils.js
// Common utility functions used across all pages

// Format time from 24h to 12h AM/PM
function format12Hour(time24) {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    let hour12 = hour % 12;
    hour12 = hour12 === 0 ? 12 : hour12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Get current Ramadan day number (1-30) or 0 if outside Ramadan
function getCurrentRamadanDay() {
    const startDate = new Date(OFFICIAL_RAMADAN_START + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays >= 1 && diffDays <= 30) {
        return diffDays;
    }
    return 0; // outside Ramadan
}

// Generate array of 30 Ramadan dates based on official start
function generateRamadanDates() {
    const startDate = new Date(OFFICIAL_RAMADAN_START + 'T00:00:00');
    
    const ramadanDates = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        ramadanDates.push(date);
    }
    return ramadanDates;
}