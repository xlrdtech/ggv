const CACHE = 'ggv-v1';
const SHELL = ['./index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Network-only for API calls (different origin)
  if (url.origin !== self.location.origin) return;
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
