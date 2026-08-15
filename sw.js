const CACHE_NAME = 'jadero-site-v3';

self.addEventListener('install', () => self.skipWaiting());

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

  // Cache-first only for fonts: they are content-addressed and never change
  if (url.pathname.startsWith('/lib/katex/fonts/')) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((r) => {
          if (r.status === 200) caches.open(CACHE_NAME).then((c) => c.put(request, r.clone()));
          return r;
        })
      )
    );
    return;
  }

  // Network-first for everything else: always serve fresh, fall back to cache when offline
  event.respondWith(
    fetch(request)
      .then((r) => {
        if (r.status === 200) caches.open(CACHE_NAME).then((c) => c.put(request, r.clone()));
        return r;
      })
      .catch(() => caches.match(request).then((c) => c || Response.error()))
  );
});
