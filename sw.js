importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

// has to match the prefix the controller is created with in proxybrowser.js.
// we can't read it off the config here, since the whole point is handling the
// case where the config isn't loaded yet.
const PREFIX = "/scramjet/";
const CONFIG_WAIT = 5000;
const CONFIG_POLL = 50;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

// loadConfig() throws outright if the controller hasn't created the object
// stores yet, and leaves scramjet.config undefined if it has but hasn't written
// the config. route() then dereferences this.config.prefix and throws, which
// rejects respondWith() and shows the user a network error instead of a page.
async function tryLoadConfig() {
  try {
    await scramjet.loadConfig();
  } catch (e) {}
  return !!scramjet.config;
}

// a proxied navigation that arrives mid-init is worth waiting on rather than
// failing, since the controller is usually only milliseconds behind us.
async function waitForConfig() {
  const deadline = Date.now() + CONFIG_WAIT;
  while (Date.now() < deadline) {
    await new Promise((res) => setTimeout(res, CONFIG_POLL));
    if (await tryLoadConfig()) return true;
  }
  return false;
}

async function handleRequest(event) {
  let ok = await tryLoadConfig();
  if (!ok && event.request.url.startsWith(location.origin + PREFIX)) {
    ok = await waitForConfig();
  }
  if (ok) {
    try {
      if (scramjet.route(event)) return scramjet.fetch(event);
    } catch (e) {}
  }
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
