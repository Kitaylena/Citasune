(function () {
  "use strict";
  var menu = document.getElementById("sj-transport-menu");
  var opener = document.getElementById("sj-settings");
  var select = document.getElementById("sj-transport-select");
  if (!menu || !opener || !select) return;
  var status = document.getElementById("proxyTransportStatus");
  var activeEl = document.getElementById("sj-transport-active");
  var busy = false;

  function setStatus(state, message) {
    status.dataset.state = state;
    status.textContent = message;
  }

  // Sync the dropdown and the "currently configured" line with the real state.
  function refresh() {
    var api = window.CSProxyTransport;
    var preference = api ? api.get() : "libcurl";
    select.value = preference;
    select.disabled = !api;
    var active = typeof window.__getProxyTransport === "function" ? window.__getProxyTransport() : null;
    activeEl.dataset.state = active ? "ready" : "pending";
    activeEl.textContent = active
      ? "Currently configured: " + (active === "epoxy" ? "Epoxy" : "libcurl") + ". Fallback may change this."
      : "The proxy connection is still starting.";
    if (!api) setStatus("error", "Connection settings could not load. Reload this page to try again.");
  }

  function open() {
    status.textContent = "";
    status.dataset.state = "idle";
    refresh();
    menu.hidden = false;
    opener.setAttribute("aria-expanded", "true");
    select.focus();
  }

  function close(returnFocus) {
    if (menu.hidden || busy) return;
    menu.hidden = true;
    opener.setAttribute("aria-expanded", "false");
    if (returnFocus) opener.focus();
  }

  opener.addEventListener("click", function () {
    if (menu.hidden) open(); else close(true);
  });

  // Click anywhere else on the page to dismiss.
  document.addEventListener("pointerdown", function (event) {
    if (menu.hidden || menu.contains(event.target) || opener.contains(event.target)) return;
    close(false);
  });

  // Clicks inside the proxied iframe never reach this document, but they do
  // move focus there, which blurs this window.
  window.addEventListener("blur", function () {
    setTimeout(function () {
      var el = document.activeElement;
      if (el && el.tagName === "IFRAME") close(false);
    }, 0);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !menu.hidden) {
      event.preventDefault();
      close(true);
    }
  });

  // Picking an option applies it right away, like the dropdowns in the home settings.
  select.addEventListener("change", async function () {
    if (busy) return;
    var api = window.CSProxyTransport;
    if (!api) { refresh(); return; }
    if (typeof window.__setProxyTransport !== "function") {
      refresh();
      setStatus("error", "The proxy is not ready. Reload this page, then try again.");
      return;
    }
    busy = true;
    select.disabled = true;
    try {
      await api.set(select.value, status);
    } catch (failure) {
      setStatus("error", "Could not change the connection. " + failure.message);
    } finally {
      busy = false;
      refresh();
      if (!menu.hidden) select.focus();
    }
  });
})();
