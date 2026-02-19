// location.js
let userLat = null;
let userLon = null;

function getLocation() {
    return new Promise((resolve) => {
        if (localStorage.getItem('userLat') && localStorage.getItem('userLon')) {
            userLat = parseFloat(localStorage.getItem('userLat'));
            userLon = parseFloat(localStorage.getItem('userLon'));
            resolve({ lat: userLat, lon: userLon });
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLat = position.coords.latitude;
                    userLon = position.coords.longitude;
                    localStorage.setItem('userLat', userLat);
                    localStorage.setItem('userLon', userLon);
                    resolve({ lat: userLat, lon: userLon });
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    showCitySelector().then(coords => {
                        userLat = coords.lat;
                        userLon = coords.lon;
                        localStorage.setItem('userLat', userLat);
                        localStorage.setItem('userLon', userLon);
                        resolve({ lat: userLat, lon: userLon });
                    });
                }
            );
        } else {
            showCitySelector().then(coords => resolve(coords));
        }
    });
}

function showCitySelector() {
    return new Promise((resolve) => {
        const main = document.getElementById('main-content');
        const selectorHtml = `
            <div class="city-selector">
                <h2>আপনার শহর নির্বাচন করুন</h2>
                <select id="citySelect">
                    ${cities.map(city => `<option value="${city.lat},${city.lon}">${city.name}</option>`).join('')}
                </select>
                <button id="confirmCity">নিশ্চিত করুন</button>
            </div>
        `;
        main.innerHTML = selectorHtml;
        document.getElementById('confirmCity').addEventListener('click', () => {
            const select = document.getElementById('citySelect');
            const [lat, lon] = select.value.split(',').map(Number);
            resolve({ lat, lon });
        });
    });
}