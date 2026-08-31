// warm-up for the proxy page. loaded on the homepage and the proxy page.
//
// opening the proxy costs a service worker install and a ~1MB scramjet bundle
// fetch, neither of which needs the proxy page to be open — so we start both as
// soon as the user looks like they're heading there. nothing runs on its own: a
// visitor who only came for the games never touches a wisp host.
//
// the wisp server is not probed or auto-selected. we connect straight to
// whatever is configured (wispServers in main.js, default us-east) and users
// switch from proxy settings if that one is slow or blocked for them.
(function () {
  var FALLBACK_WISP = "wss://gay.ajswags.xyz/";

  // assets the proxy page needs, warmed into the http cache ahead of time
  var ASSETS = [
    "/scram/scramjet.all.js",
    "/scram/scramjet.sync.js",
    "/scram/scramjet.wasm.wasm",
    "/baremux/index.js",
    "/baremux/worker.js",
    "/libcurl/index.js",
  ];

  var supported = location.protocol !== "file:" && "serviceWorker" in navigator;

  // main.js owns the server list and the default, but it isn't guaranteed to
  // have loaded, so fall back to the same default it uses.
  function server() {
    var saved = null;
    try { saved = localStorage.getItem("gnWisp"); } catch (e) {}
    if (saved) return saved;
    return typeof DEFAULT_WISP === "string" ? DEFAULT_WISP : FALLBACK_WISP;
  }

  function hint(rel, href) {
    var l = document.createElement("link");
    l.rel = rel;
    l.href = href;
    document.head.appendChild(l);
  }

  var warmed = false;

  function warm() {
    if (warmed || !supported) return;
    warmed = true;

    // the one-time install cost lands here instead of on the proxy page
    try { navigator.serviceWorker.register("/sw.js"); } catch (e) {}

    // prefetch rather than preload: these are for the *next* navigation, and
    // preload would warn about being unused on this one.
    ASSETS.forEach(function (a) { hint("prefetch", a); });

    // get the tls handshake with the wisp host out of the way too
    try { hint("preconnect", new URL(server()).origin.replace(/^ws/, "http")); } catch (e) {}
  }

  window.CitaWisp = { server: server, warm: warm };

  // the proxy page starts everything itself, so it doesn't need the triggers
  if (/\/proxy\.html$/.test(location.pathname)) return;

  function trigger(el) {
    if (!el) return;
    el.addEventListener("pointerenter", warm, { once: true });
    el.addEventListener("focus", warm, { once: true });
  }

  function wire() {
    trigger(document.getElementById("inputbox"));
    // index.html reuses id="proxybutton" on both the topbar and the hero row,
    // so getElementById would only ever see the first one.
    var buttons = document.querySelectorAll('[aria-label="Proxy"]');
    for (var i = 0; i < buttons.length; i++) trigger(buttons[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
