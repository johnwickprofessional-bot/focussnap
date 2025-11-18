const CACHE_NAME = "focussnap-v1";
const ASSETS = [
  "/focussnap/",
  "/focussnap/index.html",
  "/focussnap/style.css",
  "/focussnap/script.js",
  "/focussnap/manifest.json",
  "/focussnap/icons/icon-192.png",
  "/focussnap/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
