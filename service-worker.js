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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache first, then network fallback
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
