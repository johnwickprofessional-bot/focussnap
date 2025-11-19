const CACHE_NAME = "focussnap-cache-v1";
const ASSETS = [
  "/focussnap/",
  "/focussnap/index.html",
  "/focussnap/manifest.json",
  "/focussnap/service-worker.js",
  "/focussnap/app.css",
  "/focussnap/icons/icon-192.png",
  "/focussnap/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Network-first for navigation and manifests, cache-first for assets
  const req = e.request;
  const url = new URL(req.url);

  // Only handle requests from our origin to avoid CORS
  if (url.origin !== self.location.origin) return;

  // For navigation (HTML), try network then cache fallback
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(req).catch(() => caches.match("/focussnap/"))
    );
    return;
  }

  // For other assets -> cache first
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      // cache new requests (but ignore POST, opaque, etc.)
      if (resp && resp.status === 200 && req.method === "GET") {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return resp;
    }).catch(() => {
      // final fallback: if it's an image, serve icon-192
      if (req.destination === "image") {
        return caches.match("/focussnap/icons/icon-192.png");
      }
    }))
  );
});
