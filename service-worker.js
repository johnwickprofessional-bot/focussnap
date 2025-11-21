const CACHE_NAME = 'focussnap-v1';

self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
