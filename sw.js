// ============================================================================
// BarCraft Service Worker for Offline PWA Support
// ============================================================================

const CACHE_NAME = 'barcraft-cache-v3.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './minimal/',
  './minimal/index.html',
  './atelier/',
  './atelier/index.html',
  './manifest.json',
  './css/styles.css',
  './css/atelier.css',
  './js/app.js',
  './js/app_v3.js',
  './js/glass_viz.js',
  './js/db.js',
  './js/inventory.js',
  './js/matching.js',
  './js/scaler.js',
  './js/timers.js',
  './js/quiz.js',
  './icons/cocktail.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Network-first with cache fallback for fresh updates and seamless offline support
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            if (event.request.url.includes('/atelier')) {
              return caches.match('./atelier/index.html');
            }
            if (event.request.url.includes('/minimal')) {
              return caches.match('./minimal/index.html');
            }
            return caches.match('./index.html');
          }
        });
      })
  );
});
