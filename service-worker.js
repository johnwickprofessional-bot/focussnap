const CACHE_NAME = "focussnap-v1";
const APP_FILES = [
  "/focussnap/",
  "/focussnap/index.html",
  "/focussnap/manifest.json",
  "/focussnap/service-worker.js",
  "/focussnap/icons/icon-192.png",
  "/focussnap/icons/icon-512.png"
];

// Install: cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/focussnap/index.html")
        )
      );
    })
  );
});
