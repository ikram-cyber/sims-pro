const CACHE_NAME = 'sims-pro-v3'; // Versi baru membuang memori lama
const urlsToCache = ['./index.html', './manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting(); // Paksa kemas kini serta-merta
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Buang fail lama
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Strategi: Ambil dari Network dulu (jika online), jika gagal baru guna Cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
