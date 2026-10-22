(function () {
  var box = document.getElementById("inputbox");
  if (!box) return;
  box.disabled = false;
  box.placeholder = "search the web..";
  box.addEventListener("focus", function () {
    if (window.CitaWisp) window.CitaWisp.warm();
  }, { once: true });
  function go() {
    var q = box.value.trim();
    if (!q) return;
    try { sessionStorage.setItem("gnProxyQuery", q); } catch (e) {}
    location.href = "pages/proxy.html";
  }
  box.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    go();
  }, true);
  box.addEventListener("citasune:submit", function (e) {
    var q = (e.detail && e.detail.value) != null ? e.detail.value : box.value;
    q = String(q).trim();
    if (!q) return;
    try { sessionStorage.setItem("gnProxyQuery", q); } catch (e) {}
    location.href = "pages/proxy.html";
  });
})();
