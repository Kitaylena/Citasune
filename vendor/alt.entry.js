importScripts('/vendor/alt.bundle.js');
importScripts('/vendor/alt.config.js');
importScripts('/vendor/alt.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(location.origin + CS$h74cYJkK3qzdbn35.prefix)) {
    event.respondWith(sw.fetch(event));
  }
});