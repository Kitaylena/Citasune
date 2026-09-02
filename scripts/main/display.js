const zonesURL = "https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json";
const extraZonesURL = "/scripts/jsons/extragames.json";
const coverURL = "https://cdn.jsdelivr.net/gh/freebuisness/covers@main/";
const htmlURL = "https://cdn.jsdelivr.net/gh/freebuisness/html@main/";
// ai generated to filter out stupid breads advertisements sob
let currentHtml = "";

function zoneURL(u) {
  return (u + "").replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
}

function siteURL(p) {
  p = String(p);
  if (/^https?:/i.test(p)) return p;
  return new URL(p.replace(/^\.?\//, ""), document.baseURI).href;
}

function backToGames() {
  window.location.href = siteURL("pages/g.html");
}

const firebaseConfig = {
  apiKey: "AIzaSyBHmkPkVZ6S06XC2lpYE7ZYhIp2FJW54FA",
  authDomain: "idka-f7ad4.firebaseapp.com",
  databaseURL: "https://idka-f7ad4-default-rtdb.firebaseio.com",
  projectId: "idka-f7ad4",
  storageBucket: "idka-f7ad4.firebasestorage.app",
  messagingSenderId: "499430715576",
  appId: "1:499430715576:web:ddad665f368a0f3b55c44d",
};
const PLAYCOUNTS_NODE = "citasuneplaycounts";

function recordPlay(id) {
  if (typeof firebase === "undefined") return;
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  firebase
    .database()
    .ref(PLAYCOUNTS_NODE + "/" + id)
    .transaction((count) => (count || 0) + 1)
    .then((result) => {
      const count = result.snapshot.val();
      const el = document.getElementById("zonePlaycount");
      if (el && count != null) {
        el.textContent =
          Number(count).toLocaleString() +
          (Number(count) === 1 ? " play" : " plays");
      }
    })
    .catch(() => {});
}

const BASE_TAG_RE = /<base\b[^>]*>/i;
const BASE_HREF_RE = /<base\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s">]+))[^>]*>/i;

function zoneBaseFor(url, html) {
  const folder = url.substring(0, url.lastIndexOf("/") + 1);
  let root;
  try { root = new URL(folder, document.baseURI).href; } catch (e) { root = folder; }
  const m = html.match(BASE_HREF_RE);
  const declared = m ? (m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]) : "";
  if (!declared) return root;
  try { return new URL(declared, root).href; } catch (e) { return root; }
}

const INJECTED_SCRIPT_RE = /^.*<script>\(function\([\w$]+,[\w$]+\)\{const [\w$]+=[\w$]+.*$/gm;

function stripInjectedScripts(html) {
  return html.replace(INJECTED_SCRIPT_RE, "");
}
// rest of this is just from games.js really
function injectZoneBase(html, url) {
  const tag = '<base href="' + zoneBaseFor(url, html) + '">';
  if (BASE_TAG_RE.test(html)) return html.replace(BASE_TAG_RE, tag);
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + tag);
  if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, (m) => m + tag);
  return tag + html;
}

function showLoading() {
  const loader = document.getElementById("zoneLoading");
  if (loader) loader.style.display = "flex";
}

function hideLoading() {
  const loader = document.getElementById("zoneLoading");
  if (loader) loader.style.display = "none";
}

function showStageMessage(text, withBack) {
  hideLoading();
  const frame = document.getElementById("zoneFrame");
  if (frame) frame.style.display = "none";
  let msg = document.getElementById("zoneMessage");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "zoneMessage";
    document.getElementById("zonestage").appendChild(msg);
  }
  msg.innerHTML =
    "<p>" + text + "</p>" +
    (withBack ? '<button class="buttonforzone" onclick="backToGames()">back to games</button>' : "");
}

function writeToFrame(html) {
  const frame = document.getElementById("zoneFrame");
  frame.style.display = "";
  frame.contentDocument.open();
  frame.contentDocument.write(html);
  frame.contentDocument.close();
}

function fullscreenZone() {
  const frame = document.getElementById("zoneFrame");
  if (!frame) return;
  if (frame.requestFullscreen) frame.requestFullscreen();
  else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
}

function openInNewTab() {
  if (!currentHtml) return;
  const newWindow = window.open("about:blank", "_blank");
  if (!newWindow) {
    alert("your browser blocked the popup sob, allow popups for this site and try again");
    return;
  }
  newWindow.document.open();
  newWindow.document.write(currentHtml);
  newWindow.document.close();
}

function refreshZone() {
  if (!currentHtml) return;
  showLoading();
  writeToFrame(currentHtml);
}
function createpopup(htmlcontent) {
  if (document.getElementById("popupOverlay")) return;

  const htmlpopup = `
    <div class='popup-overlay' id='popupOverlay'>
      <div class='popup-content'>
        <span class='popup-close' id='popupClose'>&times;</span>
        ${htmlcontent}
      </div>
    </div>
  `;

  const popupContainer = document.createElement("div");
  popupContainer.id = "popupWrapper";
  popupContainer.innerHTML = htmlpopup;
  document.body.appendChild(popupContainer);

  const overlay = document.getElementById("popupOverlay");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add("active");
    });
  });

  const closePopup = () => {
    overlay.classList.remove("active");
    setTimeout(() => {
      popupContainer.remove();
    }, 350);
  };

  document.getElementById("popupClose").addEventListener("click", closePopup);

  overlay.addEventListener("click", (e) => {
    if (e.target.id === "popupOverlay") {
      closePopup();
    }
  });
}
function loadZone(file) {
  if ((file.url + "").startsWith("http")) {
    window.location.href = file.url;
    return;
  }

  showLoading();
  const url = siteURL(zoneURL(file.url));
  fetch(url + "?t=" + Date.now())
    .then((response) => response.text())
    .then((html) => {
      html = stripInjectedScripts(html);
      html = injectZoneBase(html, url);
      currentHtml = html;

      if (/ytgame/i.test(html)) {
        createpopup(`
        <h2 style="margin-bottom: 10px;">hold on!</h2>
        <p style="margin-bottom: 15px;">this is a youtube playables game, so it only works in its own tab. use <strong>open in new tab</strong> at the bottom to play it.</p>
      `);
        showStageMessage(
          "this is a youtube playables game, so it only works in its own tab. use <strong>open in new tab</strong> below.",
          false
        );
        return;
      }

      const frame = document.getElementById("zoneFrame");
      frame.addEventListener("load", hideLoading);
      writeToFrame(html);
      setTimeout(hideLoading, 4000);
    })
    .catch((error) => {
      showStageMessage("failed to load game: " + error, true);
    });
}

function fillInfo(file) {
  const titleEl = document.getElementById("zoneTitle");
  const authorEl = document.getElementById("zoneAuthor");
  if (titleEl) titleEl.textContent = file.name;
  if (authorEl) {
    if (file.author) {
      authorEl.textContent = "by " + file.author;
      if (file.authorLink) authorEl.href = file.authorLink;
      else authorEl.removeAttribute("href");
      authorEl.style.display = "";
    } else {
      authorEl.style.display = "none";
    }
  }
}

async function initDisplay() {
  const id = new URLSearchParams(window.location.search).get("g");
  if (!id) {
    showStageMessage("no game specified.", true);
    return;
  }
  showLoading();
  try {
    const response = await fetch(zonesURL + "?t=" + Date.now());
    let zones = await response.json();
    try {
      const extraRes = await fetch(siteURL(extraZonesURL) + "?t=" + Date.now());
      zones = zones.concat(await extraRes.json());
    } catch (e) {
      console.error("failed to load extra games", e);
    }
    const file = zones.find((zone) => zone.id + "" === id + "");
    if (!file) {
      showStageMessage("game not found.", true);
      return;
    }
    
    var cloak = null;
    try { cloak = localStorage.getItem("gnCloak"); } catch (e) {}
    if (!cloak || cloak === "None") {
      document.title = file.name + " - Citasune";
    }
    recordPlay(file.id);
    fillInfo(file);
    loadZone(file);
  } catch (error) {
    showStageMessage("failed to load games: " + error, true);
  }
}

initDisplay();
