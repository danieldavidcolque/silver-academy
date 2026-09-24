const CACHE = 'silver-academy-v4-a1full';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/store.js',
  './js/ui.js',
  './js/router.js',
  './js/app.js',
  './js/views/auth.js',
  './js/views/home.js',
  './js/views/lesson.js',
  './js/views/profile.js',
  './js/views/leaderboard.js',
  './js/views/schedule.js',
  './js/views/subscription.js',
  './js/views/teacher.js',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});
