(function () {
  if (!("serviceWorker" in navigator)) { location.href = "/index.html"; return; }
  if (typeof $scramjetLoadController === "undefined") return;
  if (typeof BareMux === "undefined") return;

  // panic key also has to be caught inside the proxied iframes, since their
  // keydown events never reach this page. (main.js handles this page itself.)
  function onPanicKey(e) {
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    var key = null;
    try { key = localStorage.getItem("gnPanicKey"); } catch (er) {}
    if (key && e.key && e.key.toLowerCase() === key.toLowerCase()) {
      var url = "https://www.google.com";
      try { url = localStorage.getItem("gnPanicUrl") || url; } catch (er) {}
      (window.top || window).location.href = url;
    }
  }

  var TRANSPORT = "/libcurl/index.js";
  var FALLBACK_WISP = "wss://us-east.wisp.q13x.com";
  var NEWTAB = "/pages/newtab.html";
  var DEFAULT_SEARCH = "https://duckduckgo.com/?q=%s";

  // proxywarm.js holds the configured wisp server (settings value, else the
  // default from main.js). we connect straight to it — no probing or racing, so
  // the only socket that ever opens is the one the user actually chose.
  var warm = window.CitaWisp;

  function wispUrl() {
    return (warm && warm.server()) || FALLBACK_WISP;
  }

  var loaded = $scramjetLoadController();
  var scramjet = new loaded.ScramjetController({
    prefix: "/scramjet/",
    files: {
      all: "/scram/scramjet.all.js",
      sync: "/scram/scramjet.sync.js",
      wasm: "/scram/scramjet.wasm.wasm",
    },
  });

  var conn = new BareMux.BareMuxConnection("/baremux/worker.js");

  function useWisp(url) {
    return conn.setTransport(TRANSPORT, [{ websocket: url }]);
  }

  // the transport isn't held here — it lives in the bare-mux SharedWorker, and
  // the browser tears that down whenever it likes: it dies with its last port,
  // and chrome reclaims it on its own besides. whatever replaces it starts empty,
  // so the service worker's next request fails with "there are no bare clients"
  // and keeps failing until someone sets a transport again. bare-mux broadcasts
  // refreshPort from every worker startup for exactly this, but only its
  // service-worker half listens, and all that half does is re-acquire a port. the
  // page that owns the transport is the only thing that can put it back.
  var bus = null;
  try {
    bus = new BroadcastChannel("bare-mux");
    bus.onmessage = function (e) {
      if (e.data && e.data.type === "refreshPort") wispLive();
    };
  } catch (e) {}

  // a restart can also land mid-navigation, or on a worker we never heard start,
  // so a navigation re-checks rather than trusting the setup it did once. asking
  // costs one round trip and answers "is a transport there now" — a resolved
  // setTransport() only ever answered "was one there once". overlapping callers
  // share the check so a restart can't fan out into a transport per navigation.
  var live = null;

  function withTimeout(p, ms) {
    return Promise.race([
      p,
      new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); }),
    ]);
  }

  // after a SharedWorker restart our port is dead: getTransport() can hang and
  // setTransport() can post into the void. a fresh connection re-acquires a live
  // port to the current worker, so recreate it whenever the old one misbehaves.
  function freshConn() {
    try { conn = new BareMux.BareMuxConnection("/baremux/worker.js"); } catch (e) {}
  }

  function wispLive() {
    if (live) return live;
    live = (async function () {
      try {
        if (await withTimeout(conn.getTransport(), 1500)) return;
      } catch (e) { freshConn(); }
      try {
        await useWisp(wispUrl());
      } catch (e) {
        freshConn();
        try { await useWisp(wispUrl()); } catch (e2) {}
      }
    })();
    var clear = function () { live = null; };
    live.then(clear, clear);
    return live;
  }

  var RELOAD_FLAG = "gnSwReload";

  function reloadTried() {
    try { return sessionStorage.getItem(RELOAD_FLAG) === "1"; } catch (e) { return false; }
  }

  function markReload(on) {
    try {
      if (on) sessionStorage.setItem(RELOAD_FLAG, "1");
      else sessionStorage.removeItem(RELOAD_FLAG);
    } catch (e) {}
  }

  // every proxied request has to go through the service worker, so a page that
  // is registered but not *controlled* sends the scramjet url straight to the
  // static origin and gets a 404. serviceWorker.ready does not imply controlled
  // on a first visit, so wait for the controller, and if it still hasn't claimed
  // us, reload once — a fresh navigation is always controlled. the
  // sessionStorage flag keeps a broken worker from looping us forever.
  var swReady = (async function () {
    await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    if (!navigator.serviceWorker.controller) {
      await new Promise(function (res) {
        var done = false;
        function fin() { if (!done) { done = true; res(); } }
        navigator.serviceWorker.addEventListener("controllerchange", fin, { once: true });
        if (navigator.serviceWorker.controller) fin();
        setTimeout(fin, 3000);
      });
    }

    if (navigator.serviceWorker.controller) {
      markReload(false);
      return;
    }

    if (reloadTried()) return;
    markReload(true);
    location.reload();
    // the reload isn't instant; nothing downstream should treat setup as done
    await new Promise(function () {});
  })();

  // init() writes the config to indexeddb and posts it to the service worker,
  // and the worker can't route a single proxied request until that lands. it
  // also needs a controller to exist or its postMessage is dropped — so this has
  // to run after swReady, and it has to be awaited.
  //
  // it throws on a database an older version of the site left without object
  // stores (see the long note in sw.js). the worker repairs that during its own
  // startup, so retrying picks the repair up on this load instead of leaving the
  // user with a tab that 404s until they clear site data.
  async function init() {
    for (var i = 0; ; i++) {
      try { return await scramjet.init(); }
      catch (e) {
        if (i >= 4) throw e;
        await new Promise(function (res) { setTimeout(res, 250); });
      }
    }
  }

  var sjReady = swReady.then(init);

  // needs neither the service worker nor scramjet, so it runs alongside them
  var wispReady = useWisp(wispUrl());

  var ready = Promise.all([sjReady, wispReady]);
  var isReady = false, failed = false;
  var elStatus = document.getElementById("sj-status");

  ready.then(function () { settle(true); }, function () { settle(false); });

  function settle(ok) {
    isReady = ok;
    failed = !ok;
    showStatus(false);
  }

  function showStatus(on) {
    if (elStatus) elStatus.classList.toggle("on", !!on);
  }

  // nothing may hit the network before scramjet's client is up, so navigations
  // queue rather than erroring out. typing is never blocked. if setup failed
  // outright we run the navigation anyway, so the user sees the real error
  // instead of a page that silently ignores them.
  function whenReady(fn) {
    var run = function () { wispLive().then(fn, fn); };
    if (isReady || failed) { run(); return; }
    showStatus(true);
    ready.then(run, run);
  }

  function searchTemplate() {
    try { return localStorage.getItem("gnSearch") || DEFAULT_SEARCH; } catch (e) { return DEFAULT_SEARCH; }
  }

  function toUrl(q) {
    q = q.trim();
    try { return new URL(q).toString(); } catch (e) {}
    if (/^[^\s.]+\.[^\s]+$/.test(q)) {
      try {
        var u = new URL("https://" + q);
        if (u.hostname.includes(".")) return u.toString();
      } catch (e) {}
    }
    return searchTemplate().replace("%s", encodeURIComponent(q));
  }

  var elTabs = document.getElementById("sj-tabs");
  var elViews = document.getElementById("sj-views");
  var elAddr = document.getElementById("sj-addrinput");
  var addBtn = document.getElementById("sj-newtab");
  var tabs = [], activeId = null, seq = 0;

  function goHome() { location.href = "/index.html"; }

  function withActive(fn) {
    var t = tabs.find(function (x) { return x.id === activeId; });
    if (t) fn(t);
  }

  function onMessage(e) {
    if (e.origin !== location.origin) return;
    var d = e.data;
    if (!d || d.type !== "sj:navigate" || !d.value) return;
    var url = toUrl(d.value);
    var t = tabs.find(function (x) { return x.iframe.contentWindow === e.source; });
    if (t) {
      activateTab(t.id);
      t.isNew = false;
      t.url = url;
      elAddr.value = url;
      whenReady(function () { t.frame.go(url); });
    } else {
      navigate(url);
    }
  }

  function newTab(url) {
    var id = ++seq;
    var isNew = !url || url === NEWTAB || url === "about:blank";
    var frame = scramjet.createFrame();
    var iframe = frame.frame;
    elViews.appendChild(iframe);

    var tabEl = document.createElement("div");
    tabEl.className = "sj-tab";
    var favicon = document.createElement("img");
    favicon.alt = "";
    favicon.style.display = "none";
    var titleEl = document.createElement("span");
    titleEl.className = "sj-t";
    titleEl.textContent = "New Tab";
    var xEl = document.createElement("span");
    xEl.className = "sj-x";
    xEl.textContent = "✕";
    tabEl.append(favicon, titleEl, xEl);
    elTabs.insertBefore(tabEl, addBtn);

    var tab = { id: id, frame: frame, iframe: iframe, tabEl: tabEl, favicon: favicon, titleEl: titleEl, url: isNew ? "" : url, isNew: isNew, history: [], hpos: -1, navigatingHistory: false };
    tabs.push(tab);

    tabEl.addEventListener("click", function (e) {
      if (e.target === xEl) return;
      activateTab(id);
    });
    xEl.addEventListener("click", function (e) {
      e.stopPropagation();
      closeTab(id);
    });

    frame.addEventListener("urlchange", function (ev) {
      if (ev && ev.url) {
        tab.isNew = false;
        tab.url = ev.url;
        if (id === activeId) elAddr.value = ev.url;
        recordHistory(tab, ev.url);
      }
      updateMeta(tab);
    });
    iframe.addEventListener("load", function () {
      updateMeta(tab);
      try { tab.iframe.contentDocument.addEventListener("keydown", onPanicKey); } catch (e) {}
    });

    activateTab(id);
    if (isNew) iframe.src = NEWTAB;
    else whenReady(function () { frame.go(url); });
    return tab;
  }

  function activateTab(id) {
    activeId = id;
    tabs.forEach(function (t) {
      var on = t.id === id;
      t.iframe.classList.toggle("active", on);
      t.tabEl.classList.toggle("active", on);
    });
    var t = tabs.find(function (x) { return x.id === id; });
    if (t) elAddr.value = t.isNew ? "" : t.url;
  }

  function closeTab(id) {
    var i = tabs.findIndex(function (x) { return x.id === id; });
    if (i < 0) return;
    var t = tabs.splice(i, 1)[0];
    t.iframe.remove();
    t.tabEl.remove();
    if (!tabs.length) { goHome(); return; }
    if (activeId === id) activateTab(tabs[Math.max(0, i - 1)].id);
  }

  function navigate(url) {
    var t = tabs.find(function (x) { return x.id === activeId; });
    if (!t) { newTab(url); return; }
    t.isNew = false;
    t.url = url;
    elAddr.value = url;
    whenReady(function () { t.frame.go(url); });
  }

  // per-tab history so back/forward walk the proxied site, not the joint
  // session history (which could otherwise navigate this page instead).
  function recordHistory(tab, url) {
    if (tab.navigatingHistory) { tab.navigatingHistory = false; return; }
    if (tab.history[tab.hpos] === url) return;
    tab.history = tab.history.slice(0, tab.hpos + 1);
    tab.history.push(url);
    tab.hpos = tab.history.length - 1;
  }

  function back() {
    withActive(function (t) {
      if (t.hpos <= 0) return;
      t.hpos--;
      t.navigatingHistory = true;
      t.isNew = false;
      t.url = t.history[t.hpos];
      elAddr.value = t.url;
      whenReady(function () { t.frame.go(t.url); });
    });
  }

  function forward() {
    withActive(function (t) {
      if (t.hpos >= t.history.length - 1) return;
      t.hpos++;
      t.navigatingHistory = true;
      t.isNew = false;
      t.url = t.history[t.hpos];
      elAddr.value = t.url;
      whenReady(function () { t.frame.go(t.url); });
    });
  }

  function updateMeta(tab) {
    var title = "", icon = "", host = "";
    try { host = new URL(tab.url).hostname; } catch (e) {}
    try {
      var doc = tab.iframe.contentDocument;
      if (doc) {
        title = doc.title || "";
        var link = doc.querySelector("link[rel~='icon'],link[rel='shortcut icon']");
        if (link && link.href) icon = link.href;
      }
    } catch (e) {}
    if (!title) title = tab.isNew ? "New Tab" : host || "New Tab";
    if (!icon && host && !tab.isNew)
      icon = "https://www.google.com/s2/favicons?sz=32&domain=" + host;

    tab.title = title;
    tab.titleEl.textContent = title;
    tab.tabEl.title = title;
    if (icon) {
      tab.favicon.src = icon;
      tab.favicon.style.display = "";
    } else {
      tab.favicon.style.display = "none";
    }
  }

  document.getElementById("sj-back").addEventListener("click", back);
  document.getElementById("sj-fwd").addEventListener("click", forward);
  document.getElementById("sj-reload").addEventListener("click", function () {
    withActive(function (t) { whenReady(function () { t.frame.reload(); }); });
  });
  document.getElementById("sj-home").addEventListener("click", goHome);
  addBtn.addEventListener("click", function () { newTab(NEWTAB); });
  document.getElementById("sj-addr").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = elAddr.value.trim();
    if (v) navigate(toUrl(v));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.activeElement !== elAddr) goHome();
  });
  window.addEventListener("message", onMessage);

  // main.js calls this when the wisp server is changed in settings, so the new
  // one takes effect without a reload.
  window.__setWisp = function (url) {
    if (!url) return;
    useWisp(url).then(null, function () {});
  };

  // the chrome and the local new tab page don't need the tunnel, so they go up
  // immediately; only the navigation itself waits.
  var q = new URLSearchParams(location.search).get("q");
  newTab(q ? toUrl(q) : NEWTAB);
})();
