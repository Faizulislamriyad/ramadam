
const OFFICIAL_RAMADAN_START = "2026-02-19";

// City database (fallback when geolocation denied)
const cities = [
    { name: "ঢাকা", lat: 23.8103, lon: 90.4125 },
    { name: "চট্টগ্রাম", lat: 22.3569, lon: 91.7832 },
    { name: "রাজশাহী", lat: 24.3636, lon: 88.6241 },
    { name: "খুলনা", lat: 22.8456, lon: 89.5403 },
    { name: "বরিশাল", lat: 22.7010, lon: 90.3535 },
    { name: "সিলেট", lat: 24.8949, lon: 91.8687 },
    { name: "রংপুর", lat: 25.7439, lon: 89.2752 },
    { name: "ময়মনসিংহ", lat: 24.7471, lon: 90.4203 }
];

// Calculation method (see https://aladhan.com/calculation-methods)
// 1 = University of Islamic Sciences, Karachi (default for Bangladesh)
const calculationMethod = 1;