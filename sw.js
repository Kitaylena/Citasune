importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();

// has to match the prefix the controller is created with in proxybrowser.js.
// we can't read it off the config here, since the whole point is handling the
// case where the config isn't loaded yet.
const PREFIX = "/scramjet/";
const CONFIG_WAIT = 5000;
const CONFIG_POLL = 50;

const DB_NAME = "$scramjet";
const DB_VERSION = 1;
const DB_STORES = [
  "config",
  "cookies",
  "redirectTrackers",
  "referrerPolicies",
  "publicSuffixList",
];
const DB_TIMEOUT = 3000;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

function request(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
    // blocked means another connection is still open, not that we failed. we
    // bail and let the next startup retry rather than hanging on it.
    req.onblocked = () => rej(new Error("blocked"));
  });
}

function openDB() {
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    for (const name of DB_STORES) {
      if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
    }
  };
  return request(req);
}

// scramjet opens $scramjet at version 1 everywhere, but only the *controller*
// passes an upgrade callback that creates the object stores. so whoever opens it
// first without one creates the database empty — and since the version never
// changes, the controller's own open then skips upgradeneeded and its
// db.put("config", ...) throws NotFoundError. init() rejects, the config is
// never written or posted here, and every proxied request falls through to the
// static origin and 404s.
//
// we are usually that first opener: ScramjetServiceWorker's constructor reads
// cookies out of the database as soon as it's built, and the worker starts
// before any page has called init(). creating the stores before we construct it
// makes the empty database impossible. one that's already been poisoned has to
// be dropped and rebuilt — object stores can't be added without a version bump,
// and the bundle's hardcoded version 1 rules that out.
async function ensureDB() {
  const db = await openDB();
  const missing = DB_STORES.filter((s) => !db.objectStoreNames.contains(s));
  db.close();
  if (!missing.length) return;
  await request(indexedDB.deleteDatabase(DB_NAME));
  (await openDB()).close();
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((res) => setTimeout(res, ms)),
  ]);
}

// the constructor also starts listening for the controller's loadConfig message,
// so it's built here rather than lazily on the first request. a message that
// lands before then is no loss: init() writes the same config to the database
// first, and loadConfig() reads it back.
const ready = withTimeout(ensureDB(), DB_TIMEOUT)
  .catch(() => {})
  .then(() => new ScramjetServiceWorker());

// loadConfig() is the only thing that publishes the config into scramjet's own
// module state, and the url codec, the rewriter and the wasm loader all read
// that state rather than the worker's scramjet.config field. the controller also
// posts the config here as a message, and the worker's handler for it assigns
// scramjet.config directly — which is worse than useless, because loadConfig()
// returns at its first line when that field is already set. so a worker that got
// the message looks configured from the outside while the rewriter still sees
// nothing: route() reads scramjet.config.prefix and passes, then fetch() reads
// the unpublished module config and throws on .prefix, which rejects
// respondWith() and shows the user a network error instead of a page.
//
// clearing the field before each attempt forces the indexeddb read that does
// publish it. the controller writes the config to the database before it posts
// the message, so by the time the message could have landed the database already
// has it, and ignoring the copy the message left behind costs nothing.
//
// loadConfig() also throws outright if the object stores don't exist, and leaves
// the config unset if they exist but the controller hasn't written it yet.
let configured = false;

async function tryLoadConfig(scramjet) {
  if (configured) return true;
  const messaged = scramjet.config;
  scramjet.config = undefined;
  try {
    await scramjet.loadConfig();
  } catch (e) {}
  if (!scramjet.config) {
    scramjet.config = messaged;
    return false;
  }
  configured = true;
  return true;
}

// a proxied navigation that arrives mid-init is worth waiting on rather than
// failing, since the controller is usually only milliseconds behind us.
async function waitForConfig(scramjet) {
  const deadline = Date.now() + CONFIG_WAIT;
  while (Date.now() < deadline) {
    await new Promise((res) => setTimeout(res, CONFIG_POLL));
    if (await tryLoadConfig(scramjet)) return true;
  }
  return false;
}

async function handleRequest(event) {
  const scramjet = await ready;
  let ok = await tryLoadConfig(scramjet);
  if (!ok && event.request.url.startsWith(location.origin + PREFIX)) {
    ok = await waitForConfig(scramjet);
  }
  if (ok) {
    // fetch() rejects rather than throwing, so it has to be awaited inside the
    // try for the fallback below to catch anything at all.
    try {
      if (scramjet.route(event)) return await scramjet.fetch(event);
    } catch (e) {}
  }
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
