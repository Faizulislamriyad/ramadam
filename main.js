// main.js
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading">লোকেশন শনাক্ত করা হচ্ছে...</div>';

    try {
        const { lat, lon } = await getLocation();
        await loadTodayPage(lat, lon);
    } catch (error) {
        main.innerHTML = '<div class="error">কোথাও সমস্যা হয়েছে। পৃষ্ঠা রিফ্রেশ করুন।</div>';
        console.error(error);
    }
});

async function loadTodayPage(lat, lon) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading">টাইম আনাচে...</div>';

    const timings = await fetchTimings(lat, lon);
    if (!timings) {
        main.innerHTML = '<div class="error">টাইম পাওয়া যায়নি। পরে আবার চেষ্টা করুন।</div>';
        return;
    }

    // Get current Ramadan day
    const ramadanDay = getCurrentRamadanDay();

    const sehriTime24 = timings.Fajr;
    const iftarTime24 = timings.Maghrib;
    const sehriTime12 = format12Hour(sehriTime24);
    const iftarTime12 = format12Hour(iftarTime24);

    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('bn-BD', options);

    // Show Ramadan day only if within Ramadan
    const ramadanDisplay = ramadanDay > 0 
        ? `<div class="ramadan-day">রমজান ${ramadanDay}</div>` 
        : '<div class="ramadan-day">রমজানের সময় নয়</div>';

    main.innerHTML = `
        <div class="today-card">
            <h1>আজকের সময়সূচি</h1>
            <div class="location-info">${dateStr}</div>
            ${ramadanDisplay}
            <div class="time-block">
                <div class="time-item">
                    <div class="label">সেহরির শেষ সময়</div>
                    <div class="value">${sehriTime12}</div>
                </div>
                <div class="time-item">
                    <div class="label">ইফতারের সময়</div>
                    <div class="value">${iftarTime12}</div>
                </div>
            </div>
            <div class="countdown" id="countdown"></div>
            <button class="change-location-btn" id="changeLocationBtn">শহর পরিবর্তন করুন</button>
        </div>
    `;

    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown(sehriTime24, iftarTime24);
    countdownInterval = setInterval(() => updateCountdown(sehriTime24, iftarTime24), 1000);

    document.getElementById('changeLocationBtn').addEventListener('click', manualCitySelect);
}

function updateCountdown(sehri, iftar) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [sehriH, sehriM] = sehri.split(':').map(Number);
    const [iftarH, iftarM] = iftar.split(':').map(Number);

    const sehriMinutes = sehriH * 60 + sehriM;
    const iftarMinutes = iftarH * 60 + iftarM;

    let targetMinutes;
    let label;

    if (currentTime < sehriMinutes) {
        targetMinutes = sehriMinutes;
        label = 'সেহরি শুরু হতে';
    } else if (currentTime < iftarMinutes) {
        targetMinutes = iftarMinutes;
        label = 'ইফতার হতে';
    } else {
        targetMinutes = sehriMinutes + 24 * 60;
        label = 'আগামী সেহরি';
    }

    let diffMinutes = targetMinutes - currentTime;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const seconds = 59 - now.getSeconds();

    document.getElementById('countdown').innerText =
        `${label} : ${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;
}

async function manualCitySelect() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const coords = await showCitySelector();
    localStorage.setItem('userLat', coords.lat);
    localStorage.setItem('userLon', coords.lon);
    await loadTodayPage(coords.lat, coords.lon);
}