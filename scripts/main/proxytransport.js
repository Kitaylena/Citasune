// Shared transport preferences. Keep independent of homepage initialization.
(function () {
  "use strict";
function getProxyTransport() {
  try { return localStorage.getItem("gnProxyTransport") === "epoxy" ? "epoxy" : "libcurl"; }
  catch (e) { return "libcurl"; }
}

async function setProxyTransport(value, feedback) {
  if (value !== "libcurl" && value !== "epoxy") return false;
  const status = feedback || document.getElementById("settingsTransportStatus") || document.getElementById("proxyTransportStatus");
  if (status) { status.dataset.state = "busy"; status.textContent = "Saving your connection preference…"; }
  let previous = null, stored = false, phase = "apply";
  try {
    const onProxyPage = !!document.getElementById("sj-transport-menu");
    if (onProxyPage && typeof window.__setProxyTransport !== "function") {
      throw new Error("The proxy is not ready. Reload this page, then try again.");
    }
    phase = "save";
    previous = localStorage.getItem("gnProxyTransport");
    localStorage.setItem("gnProxyTransport", value);
    stored = true;
    phase = "apply";
    if (typeof window.__setProxyTransport === "function") await window.__setProxyTransport(value);
    if (status) { status.dataset.state = "success"; status.textContent = "Connection preference saved. Automatic fallback stays on."; }
    return true;
  } catch (error) {
    if (stored) {
      try {
        if (previous === null) localStorage.removeItem("gnProxyTransport");
        else localStorage.setItem("gnProxyTransport", previous);
      } catch (restoreError) { console.error("[proxy] could not restore preference:", restoreError); }
    }
    console.error("[proxy] transport selection failed:", error);
    if (status) {
      status.dataset.state = "error";
      status.textContent = phase === "save"
        ? "Your browser could not save this preference. Allow site storage and try again."
        : "Connection was not changed. " + error.message;
    }
    return false;
  }
}

  window.CSProxyTransport = { get: getProxyTransport, set: setProxyTransport };
})();
