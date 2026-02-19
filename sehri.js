// sehri.js
document.addEventListener('DOMContentLoaded', async () => {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading">লোকেশন শনাক্ত করা হচ্ছে...</div>';

    try {
        const { lat, lon } = await getLocation();
        main.innerHTML = '<div class="loading">রমজান ক্যালেন্ডার আনাচে...</div>';

        // Generate 30 Ramadan dates based on official start
        const ramadanDates = generateRamadanDates();

        // Group dates by year-month to minimize API calls
        const monthsMap = new Map();
        ramadanDates.forEach(date => {
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!monthsMap.has(key)) monthsMap.set(key, []);
            monthsMap.get(key).push(date);
        });

        // Fetch calendar data for each month
        let calendarData = [];
        for (let [key, dates] of monthsMap.entries()) {
            const [year, month] = key.split('-').map(Number);
            const monthData = await fetchGregorianMonthCalendar(lat, lon, year, month);
            
            if (!monthData) {
                main.innerHTML = '<div class="error">ক্যালেন্ডার ডেটা পাওয়া যায়নি।</div>';
                return;
            }

            // Match each date with its timings
            dates.forEach(date => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const gregStr = `${day}-${month}-${year}`;

                const dayData = monthData.find(d => d.date.gregorian.date === gregStr);
                if (dayData) {
                    calendarData.push({
                        date: gregStr,
                        ramadanDay: calendarData.length + 1,
                        timings: dayData.timings
                    });
                }
            });
        }

        // Sort by date
        calendarData.sort((a, b) => {
            const [d1, m1, y1] = a.date.split('-').map(Number);
            const [d2, m2, y2] = b.date.split('-').map(Number);
            return new Date(y1, m1-1, d1) - new Date(y2, m2-1, d2);
        });

        // Get today's date for highlighting
        const today = new Date();
        const todayStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;

        // Build table HTML
        let tableHtml = `
            <div class="month-table">
                <table>
                    <thead>
                        <tr>
                            <th>রমজান তারিখ</th>
                            <th>ইংরেজি তারিখ</th>
                            <th>সেহরির সময় (ফজর)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        calendarData.forEach(item => {
            const sehriTime = item.timings.Fajr.slice(0, 5);
            const sehri12h = format12Hour(sehriTime);
            const isToday = (item.date === todayStr) ? 'class="today"' : '';

            tableHtml += `
                <tr ${isToday}>
                    <td>${item.ramadanDay} রমজান</td>
                    <td>${item.date}</td>
                    <td>${sehri12h}</td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table></div>`;
        main.innerHTML = tableHtml;

    } catch (error) {
        main.innerHTML = '<div class="error">কোথাও সমস্যা হয়েছে। পৃষ্ঠা রিফ্রেশ করুন।</div>';
        console.error(error);
    }
});