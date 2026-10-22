// Privacy shield: prevent iboss from capturing our own input via its capture-phase
// document listeners, and mark our inputs so they fall outside its selectors.
// The extension listens on `document` in the capture phase for submit/click
// (matching input[type=url|text|search]) and for keydown Enter (any input/textarea);
// a window-capture listener calling stopPropagation() blocks both because the
// capture path goes window -> document -> target.
(function () {
  "use strict";

  var PRIVATE_ATTR = "data-private";

  function isPrivate(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.hasAttribute(PRIVATE_ATTR)) return true;
    // our site fields may be wrapped in forms
    if (el.form && el.form.hasAttribute(PRIVATE_ATTR)) return true;
    return false;
  }

  function getValue(el) {
    if (!el) return "";
    if (typeof el.value === "string") return el.value;
    if (typeof el.textContent === "string") return el.textContent;
    return "";
  }

  // Enter on our private inputs: block the extension's capture listener and
  // hand control to the site's own handler via a CustomEvent.
  window.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var target = e.target;
    if (!isPrivate(target)) {
      // composedPath can help in some cases, but e.target is usually fine
      var path = typeof e.composedPath === "function" ? e.composedPath() : [];
      for (var i = 0; i < path.length; i++) {
        if (isPrivate(path[i])) { target = path[i]; break; }
      }
    }
    if (!isPrivate(target)) return;

    // Prevent default to stop form submission in general, and stop propagation
    // so the extension's document-capture listener never sees this event.
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

    var value = getValue(target).trim();
    try {
      target.dispatchEvent(new CustomEvent("citasune:submit", {
        bubbles: true,
        cancelable: true,
        detail: { value: value }
      }));
    } catch (err) {}
  }, true);

  // Click/submit on our private inputs/forms: stop propagation in capture so
  // the extension's C() handler (which falls back to document.querySelector for
  // input[type=text]) cannot find/submit our values.
  function shield(e) {
    var target = e.target;
    if (!target || target.nodeType !== 1) return;
    if (isPrivate(target) || (target.form && target.form.hasAttribute(PRIVATE_ATTR))) {
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    }
  }

  window.addEventListener("click", shield, true);
  window.addEventListener("submit", shield, true);
})();
