(function () {
  var box = document.getElementById("inputbox");
  if (!box) return;
  box.disabled = false;
  box.placeholder = "Search the web..";
  // installing the service worker and handshaking with a wisp server takes a
  // moment, so start it the instant someone looks like they're about to search
  // rather than making them wait for it on the proxy page. (proxywarm.js also
  // wires this to the proxy buttons, and warm() is a no-op after the first call.)
  box.addEventListener("focus", function () {
    if (window.CitaWisp) window.CitaWisp.warm();
  }, { once: true });
  box.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var q = box.value.trim();
    if (!q) return;
    var a = document.createElement("a");
    a.href = "pages/proxy.html?q=" + encodeURIComponent(q);
    location.href = a.href;
  });
})();
