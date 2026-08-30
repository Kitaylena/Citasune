// wisp server selection + warm-up. loaded on the homepage and the proxy page.
//
// the expensive parts of opening the proxy (installing the service worker,
// fetching the scramjet bundle, and handshaking with a wisp server) don't need
// the proxy page to be open, so we start them as soon as the user looks like
// they're heading there. nothing here runs on its own — a visitor who only came
// for the games never touches a wisp host.
(function () {
  var CANDIDATES = [
    "wss://us-east.wisp.q13x.com",
    "wss://glseries.net/wisp/",
    "wss://wisp.rhw.one/wisp/",
    "wss://anura.pro/",
    "wss://fern.best/wisp/",
    "wss://eu-central.wisp.q13x.com/",
    "wss://se-asia.wisp.q13x.com",
	"wss://lichology.com",
	"wss://nebulaproxy.io",
	"wss://mages.io",
	"wss://truf.the-nest.at",
	"wss://motor-cycle-part.org",
	"wss://invisiproxy.com",
	"wss://thoughts.forwardersoft.com",
	"wss://definitelyscience.com",
	"wss://area.forwardersoft.com",
	"wss://english.algebra.teacher.vocabulary.homework.forwardersoft.com",
	"wss://wisp.terbiumon.top"
  ];

  // assets the proxy page needs, warmed into the http cache ahead of time.
  var ASSETS = [
    "/scram/scramjet.all.js",
    "/scram/scramjet.sync.js",
    "/scram/scramjet.wasm.wasm",
    "/baremux/index.js",
    "/baremux/worker.js",
    "/libcurl/index.js",
  ];

  var PROBE_TIMEOUT = 2500;
  var CACHE_KEY = "gnWispPick";
  var CACHE_TTL = 30 * 60 * 1000;
  var supported =
    location.protocol !== "file:" && "serviceWorker" in navigator;

  function get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function readCache() {
    try {
      var raw = get(CACHE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || !v.url) return null;
      if (Date.now() - v.ts > CACHE_TTL) return null;
      // the cache is keyed on the server chosen in settings, so changing it
      // there takes effect immediately instead of after the ttl.
      if ((v.saved || "") !== (get("gnWisp") || "")) return null;
      return v.url;
    } catch (e) { return null; }
  }

  function writeCache(url) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        url: url,
        saved: get("gnWisp") || "",
        ts: Date.now(),
      }));
    } catch (e) {}
  }

  function invalidate() {
    try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
    picked = null;
  }

  // a websocket that reaches onopen proves the host is reachable and speaking
  // wss, which is all we need to start. much cheaper than tunnelling a real
  // request through it — proxybrowser.js does that afterwards, in the
  // background, to confirm the tunnel actually works.
  function probe(url, ms) {
    return new Promise(function (resolve) {
      var ws, done = false, timer;
      function fin(ok) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { if (ws) ws.close(); } catch (e) {}
        resolve(ok ? url : null);
      }
      timer = setTimeout(function () { fin(false); }, ms);
      try { ws = new WebSocket(url); } catch (e) { fin(false); return; }
      ws.onopen = function () { fin(true); };
      ws.onerror = function () { fin(false); };
      ws.onclose = function () { fin(false); };
    });
  }

  // all candidates at once, settling on whichever answers first. resolves null
  // only once every one of them has failed.
  function race(urls) {
    var results = urls.map(function (u) { return probe(u, PROBE_TIMEOUT); });
    reachable = Promise.all(results).then(function (r) {
      return r.filter(Boolean);
    });
    return new Promise(function (resolve) {
      var left = results.length;
      if (!left) { resolve(null); return; }
      var settled = false;
      results.forEach(function (p) {
        p.then(function (url) {
          if (url && !settled) { settled = true; resolve(url); return; }
          if (--left === 0 && !settled) { settled = true; resolve(null); }
        });
      });
    });
  }

  var picked = null;
  var reachable = Promise.resolve([]);

  // resolves the wisp url to use. memoized, so the warm-up and the proxy page
  // share one result instead of probing twice.
  function pick() {
    if (picked) return picked;
    picked = (async function () {
      var cached = readCache();
      if (cached) return cached;

      // an explicitly chosen server wins whenever it's reachable, so probe it
      // on its own before falling back to the list.
      var saved = get("gnWisp");
      if (saved && CANDIDATES.indexOf(saved) === -1) {
        if (await probe(saved, PROBE_TIMEOUT)) {
          writeCache(saved);
          return saved;
        }
      }

      var order = CANDIDATES.slice();
      if (saved) {
        order = [saved].concat(order.filter(function (u) { return u !== saved; }));
      }
      var winner = await race(order);
      if (winner) writeCache(winner);
      return winner || order[0];
    })();
    return picked;
  }

  // reachable candidates other than `exclude`, for failover. a cached pick
  // short-circuits the race, so there may be no probe results to reuse — in
  // that case probe the rest of the list now.
  async function others(exclude) {
    var list = await reachable;
    list = list.filter(function (u) { return u !== exclude; });
    if (list.length) return list;
    var rest = CANDIDATES.filter(function (u) { return u !== exclude; });
    var probes = await Promise.all(rest.map(function (u) {
      return probe(u, PROBE_TIMEOUT);
    }));
    return probes.filter(Boolean);
  }

  function hint(rel, href, as) {
    var l = document.createElement("link");
    l.rel = rel;
    l.href = href;
    if (as) l.as = as;
    document.head.appendChild(l);
  }

  var warmed = false;

  function warm() {
    if (warmed || !supported) return;
    warmed = true;

    // the one-time install cost lands here instead of on the proxy page.
    try { navigator.serviceWorker.register("/sw.js"); } catch (e) {}

    pick().then(function (url) {
      try { hint("preconnect", new URL(url).origin.replace(/^ws/, "http")); } catch (e) {}
    });

    // prefetch rather than preload: these are for the *next* navigation, and
    // preload would warn about being unused on this one.
    ASSETS.forEach(function (a) { hint("prefetch", a); });
  }

  window.CitaWisp = {
    CANDIDATES: CANDIDATES,
    pick: pick,
    probe: probe,
    others: others,
    invalidate: invalidate,
    warm: warm,
  };

  // the proxy page starts everything itself, so it doesn't need the triggers.
  if (/\/proxy\.html$/.test(location.pathname)) return;

  function trigger(el) {
    if (!el) return;
    el.addEventListener("pointerenter", warm, { once: true });
    el.addEventListener("focus", warm, { once: true });
  }

  function wire() {
    trigger(document.getElementById("inputbox"));
    // index.html reuses id="proxybutton" on both the topbar and hero row, so
    // getElementById would only ever see the first one.
    var buttons = document.querySelectorAll('[aria-label="Proxy"]');
    for (var i = 0; i < buttons.length; i++) trigger(buttons[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
