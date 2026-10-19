importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(location.origin + CS$h74cYJkK3qzdbn35.prefix)) {
    event.respondWith(sw.fetch(event));
  }
});