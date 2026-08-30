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
  var PRIMARY_WISP = "wss://us-east.wisp.q13x.com";
  var WISP_FALLBACKS = [
    "wss://us-east.wisp.q13x.com",
	"wss://us-east.wisp.q13x.com",
    "wss://glseries.net/wisp/",
    "wss://wisp.rhw.one/wisp/",
    "wss://anura.pro/",
    "wss://fern.best/wisp/",
    "wss://eu-central.wisp.q13x.com/",
	"wss://se-asia.wisp.q13x.com"
  ];
  var WISP = PRIMARY_WISP;
  var NEWTAB = "/pages/newtab.html";
  var DEFAULT_SEARCH = "https://duckduckgo.com/?q=%s";

  var loaded = $scramjetLoadController();
  var scramjet = new loaded.ScramjetController({
    prefix: "/scramjet/",
    files: {
      all: "/scram/scramjet.all.js",
      sync: "/scram/scramjet.sync.js",
      wasm: "/scram/scramjet.wasm.wasm",
    },
  });
  scramjet.init();

  var conn = new BareMux.BareMuxConnection("/baremux/worker.js");

  // set a wisp server, then probe it with a quick request; false if it can't connect
  async function testWisp(url) {
    try { await conn.setTransport(TRANSPORT, [{ websocket: url }]); }
    catch (e) { return false; }
    try {
      var client = new BareMux.BareClient();
      var ctrl = new AbortController();
      var to = setTimeout(function () { ctrl.abort(); }, 5000);
      try {
        await client.fetch("https://example.com/", { method: "HEAD", redirect: "manual", signal: ctrl.signal });
        return true;
      } finally { clearTimeout(to); }
    } catch (e) { return false; }
  }

  // try the saved/cached server first, then fall through the list; first that
  // actually connects wins, and is cached for the rest of the session.
  async function pickTransport() {
    var order = [];
    try { var saved = localStorage.getItem("gnWisp"); if (saved) order.push(saved); } catch (e) {}
    try { var cached = sessionStorage.getItem("gnWispActive"); if (cached) order.push(cached); } catch (e) {}
    for (var i = 0; i < WISP_FALLBACKS.length; i++) order.push(WISP_FALLBACKS[i]);
    var seen = {};
    order = order.filter(function (u) { if (!u || seen[u]) return false; seen[u] = true; return true; });
    for (var j = 0; j < order.length; j++) {
      if (await testWisp(order[j])) {
        WISP = order[j];
        try { sessionStorage.setItem("gnWispActive", WISP); } catch (e) {}
        return;
      }
    }
    WISP = order[0] || PRIMARY_WISP;
    try { await conn.setTransport(TRANSPORT, [{ websocket: WISP }]); } catch (e) {}
  }

  var ready = (async function () {
    await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise(function (res) {
        var done = false;
        function fin() { if (!done) { done = true; res(); } }
        navigator.serviceWorker.addEventListener("controllerchange", fin, { once: true });
        if (navigator.serviceWorker.controller) fin();
        setTimeout(fin, 2000);
      });
    }
    await pickTransport();
  })();

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
      t.frame.go(url);
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
    else frame.go(url);
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
    t.frame.go(url);
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
      t.frame.go(t.url);
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
      t.frame.go(t.url);
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
  document.getElementById("sj-reload").addEventListener("click", function () { withActive(function (t) { t.frame.reload(); }); });
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

  (async function () {
    var q = new URLSearchParams(location.search).get("q");
    try { await ready; } catch (e) {}
    if (q) newTab(toUrl(q));
    else newTab(NEWTAB);
  })();
})();
