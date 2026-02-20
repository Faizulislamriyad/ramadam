const CACHE_NAME = 'ramadan-times-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sehri.html',
  '/iftar.html',
  '/style.css',
  '/config.js',
  '/location.js',
  '/api.js',
  '/shared-utils.js',
  '/main.js',
  '/sehri.js',
  '/iftar.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});