const CACHE_NAME = 'jadero-site-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './base.html',
  './gallery.html',
  './knowledge.html',
  './style.css',
  './script.js',
  './base.js',
  './gallery.js',
  './knowledge.js',
  './config.json',
  './lib/marked/marked.min.js',
  './lib/katex/katex.min.js',
  './lib/katex/katex.min.css',
  './lib/katex/contrib/auto-render.min.js',
  './assets/repos.svg',
  './assets/people.svg',
  './assets/commit.svg',
  './assets/star.svg',
  './assets/fork.svg',
  './assets/email.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse || Response.error());
    })
  );
});
