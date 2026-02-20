// sw.js - Ramadan Times PWA Service Worker
const CACHE_VERSION = 'v2.0'; // আপডেটের সময় এই ভার্সন বাড়ান
const CACHE_NAME = `ramadan-times-${CACHE_VERSION}`;

// যে ফাইলগুলো ক্যাশে করতে হবে
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
  '/pwa.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ইনস্টল ইভেন্ট
self.addEventListener('install', event => {
  console.log(`Service Worker ${CACHE_VERSION} installing...`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All files cached!');
        return self.skipWaiting();
      })
  );
});

// অ্যাক্টিভেট ইভেন্ট - পুরনো ক্যাশে ক্লিনআপ
self.addEventListener('activate', event => {
  console.log(`Service Worker ${CACHE_VERSION} activating...`);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('New version now controlling');
      return self.clients.claim();
    })
  );
});

// ফেচ ইভেন্ট - ক্যাশে থেকে সার্ভ
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(networkResponse => {
          const url = new URL(event.request.url);
          if (url.origin === self.location.origin) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
  );
});