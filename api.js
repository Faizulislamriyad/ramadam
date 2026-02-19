// api.js
const BASE_URL = 'https://api.aladhan.com/v1';

// Fetch ONLY timings for a specific date (returns timings object)
async function fetchTimings(lat, lon, date = null) {
    let url = `${BASE_URL}/timings?latitude=${lat}&longitude=${lon}&method=${calculationMethod}`;
    if (date) {
        url += `&date=${date}`; // date format: DD-MM-YYYY
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
            return data.data.timings; // only the timings object
        } else {
            throw new Error('API error');
        }
    } catch (error) {
        console.error('Failed to fetch timings:', error);
        return null;
    }
}

// Fetch FULL data for a specific date (includes timings + gregorian date)
async function fetchFullTimings(lat, lon, date = null) {
    let url = `${BASE_URL}/timings?latitude=${lat}&longitude=${lon}&method=${calculationMethod}`;
    if (date) {
        url += `&date=${date}`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
            return data.data; // full data object
        } else {
            throw new Error('API error');
        }
    } catch (error) {
        console.error('Failed to fetch full timings:', error);
        return null;
    }
}

// Fetch calendar for a Gregorian month
async function fetchGregorianMonthCalendar(lat, lon, year, month) {
    // month should be 1-12
    const url = `${BASE_URL}/calendar?latitude=${lat}&longitude=${lon}&method=${calculationMethod}&month=${month}&year=${year}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
            return data.data; // array of daily timings
        } else {
            throw new Error('API error');
        }
    } catch (error) {
        console.error('Failed to fetch Gregorian calendar:', error);
        return null;
    }
}