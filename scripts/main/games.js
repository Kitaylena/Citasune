// stripped from GN math ngl
// help with SOME ai because im too lazy to move everything over from my other project, most the code is the same from here i think
const gamesContainer = document.getElementById("games");
const featuredContainer = document.getElementById("featured");
const featuredHeading = document.getElementById("featuredheading");
const allHeading = document.getElementById("allheading");
const trendingContainer = document.getElementById("trending");
const trendingHeading = document.getElementById("trendingheading");
const gameSearch = document.getElementById("inputbox");

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
let hasTrending = false;
let gnDb = null;

function getDb() {
  if (gnDb) return gnDb;
  if (typeof firebase === "undefined") return null;
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  gnDb = firebase.database();
  return gnDb;
}

function recordPlay(id) {
  const db = getDb();
  if (!db) return;
  db.ref(PLAYCOUNTS_NODE + "/" + id)
    .transaction((count) => (count || 0) + 1)
    .catch(() => {});
}

const zonesURL = "https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json";
const extraZonesURL = "/scripts/jsons/extragames.json";
const coverURL = "https://cdn.jsdelivr.net/gh/freebuisness/covers@main/";
const htmlURL = "https://cdn.jsdelivr.net/gh/freebuisness/html@main/";

let zones = [];
let hasFeatured = false;

function zoneURL(u) {
  return (u + "").replace("{COVER_URL}", coverURL).replace("{HTML_URL}", htmlURL);
}

function siteURL(p) {
  p = String(p);
  if (/^https?:/i.test(p)) return p;
  return new URL(p.replace(/^\.?\//, ""), document.baseURI).href;
}

async function listZones() {
  if (!gamesContainer) return;
  try {
    const response = await fetch(zonesURL + "?t=" + Date.now());
    const json = await response.json();
    let extra = [];
    try {
      const extraRes = await fetch(siteURL(extraZonesURL) + "?t=" + Date.now());
      extra = await extraRes.json();
    } catch (e) {
      console.error("failed to load extra games", e);
    }
    const merged = json.concat(extra);
    const hiddenIds = ["-1", "253", "429", "469", "596", "87", "113","710", "750", "751"];
    zones = merged.filter((zone) => !hiddenIds.includes(zone.id + ""));
    displayTrending();
    displayFeatured(zones.filter((zone) => zone.featured === true));
    displayZones(zones.filter((zone) => zone.featured !== true));
  } catch (error) {
    console.error(error);
    gamesContainer.innerHTML = "Error loading games: " + error;
  }
}

function openZone(file) {
  if ((file.url + "").startsWith("http")) {
    recordPlay(file.id);
    window.open(file.url, "_blank");
  } else {
    window.location.href = siteURL("pages/display.html?g=" + file.id);
  }
}

function makeCard(file) {
  const card = document.createElement("div");
  card.className = "gamecard";
  card.onclick = () => openZone(file);

  const img = document.createElement("img");
  img.src = siteURL(zoneURL(file.cover));
  img.alt = file.name;
  img.loading = "lazy";
  card.appendChild(img);

  const title = document.createElement("h3");
  title.textContent = file.name;
  card.appendChild(title);

  return card;
}

function displayTrending() {
  if (!trendingContainer) return;
  const db = getDb();
  if (!db) return;
  db.ref(PLAYCOUNTS_NODE)
    .orderByValue()
    .limitToLast(7)
    .once("value")
    .then((snapshot) => {
      const val = snapshot.val();
      const entries = val
        ? Object.entries(val).sort((a, b) => b[1] - a[1])
        : [];

      trendingContainer.innerHTML = "";
      entries.forEach(([id]) => {
        const file = zones.find((z) => z.id + "" === id + "");
        if (file) trendingContainer.appendChild(makeCard(file));
      });
      hasTrending = trendingContainer.children.length > 0;
      const searching = gameSearch && gameSearch.value.length > 0;
      trendingContainer.style.display = hasTrending && !searching ? "" : "none";
      if (trendingHeading)
        trendingHeading.style.display = hasTrending && !searching ? "" : "none";
    })
    .catch(() => {});
}

function displayZones(list) {
  gamesContainer.innerHTML = "";
  list.forEach((file) => gamesContainer.appendChild(makeCard(file)));
  if (allHeading) allHeading.textContent = "all games (" + list.length + ")";
  if (gamesContainer.innerHTML === "") {
    gamesContainer.innerHTML = "no games found.";
  }
}

function displayFeatured(list) {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = "";
  list.forEach((file) => featuredContainer.appendChild(makeCard(file)));
  hasFeatured = list.length > 0;
  featuredContainer.style.display = hasFeatured ? "" : "none";
  if (featuredHeading) {
    featuredHeading.textContent = "featured (" + list.length + ")";
    featuredHeading.style.display = hasFeatured ? "" : "none";
  }
}

function filterZones() {
  const query = gameSearch.value.toLowerCase();
  if (query.length === 0) {
    displayZones(zones.filter((zone) => zone.featured !== true));
  } else {
    displayZones(zones.filter((zone) => zone.name.toLowerCase().includes(query)));
  }
  const show = query.length === 0 && hasFeatured;
  if (featuredContainer) featuredContainer.style.display = show ? "" : "none";
  if (featuredHeading) featuredHeading.style.display = show ? "" : "none";

  const showTrend = query.length === 0 && hasTrending;
  if (trendingContainer) trendingContainer.style.display = showTrend ? "" : "none";
  if (trendingHeading) trendingHeading.style.display = showTrend ? "" : "none";
}

if (gameSearch) {
  gameSearch.addEventListener("input", filterZones);
}

listZones();
