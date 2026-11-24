(() => {
  const gamesContainer = document.getElementById("appsthing");
  const allHeading = document.getElementById("allheading");
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

  const appsURL = "/scripts/jsons/apps.json";
  let apps = [];

function siteURL(p) {
    p = String(p);
    if (/^https?:/i.test(p)) return p;
    if (p.startsWith("/")) return new URL(p, location.origin).href;
    return new URL(p.replace(/^\.\//, ""), document.baseURI).href;
  }
  async function listApps() {
    if (!gamesContainer) return;
    try {
      const response = await fetch(siteURL(appsURL) + "?t=" + Date.now());
      apps = await response.json();
      displayApps(apps);
    } catch (error) {
      console.error(error);
      gamesContainer.innerHTML = "Error loading apps: " + error;
    }
  }

function openApp(file) {
    if ((file.url + "").startsWith("http")) {
      window.location.href = siteURL(
        "/pages/proxy.html?q=" + encodeURIComponent(file.url)
      );
    } else {
      window.location.href = siteURL("/pages/display.html?a=" + file.id);
    }
  }

  function makeCard(file) {
    const card = document.createElement("div");
    card.className = "gamecard";
    card.onclick = () => openApp(file);

    const img = document.createElement("img");
    img.src = siteURL(file.cover);
    img.alt = file.name;
    img.loading = "lazy";
    card.appendChild(img);
    img.onerror = function () {
      this.onerror = null;
      this.src = "./assets/imageassets/placeholder.jpg";
      this.className += "placeholder";
    };

    const title = document.createElement("h3");
    title.textContent = file.name;
    card.appendChild(title);

    return card;
  }

  function displayApps(list) {
    gamesContainer.innerHTML = "";
    list.forEach((file) => gamesContainer.appendChild(makeCard(file)));
    if (allHeading) allHeading.textContent = "all apps (" + list.length + ")";
    if (gamesContainer.innerHTML === "") {
      gamesContainer.innerHTML = "no apps found.";
    }
  }

  function filterApps() {
    const query = gameSearch.value.toLowerCase();
    if (query.length === 0) {
      displayApps(apps);
    } else {
      displayApps(apps.filter((app) => app.name.toLowerCase().includes(query)));
    }
  }

  if (gameSearch) {
    gameSearch.addEventListener("input", filterApps);
  }

  listApps();
})();