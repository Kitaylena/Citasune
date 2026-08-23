// main page
const now = new Date();
const time = now.toLocaleTimeString();

const randomtext = document.getElementById("randomtext");
const list = [
  "hellooo",
  "its literally " + time + " what are u doing rn",
  "All Hail To Benjamin Netanyahu!",
  "kids be doing ANYTHING but their work",
  "i recently got into touhou, now i know bad apple is a touhou song",
  "me when i see verity Bro 😂",
  "july 30th was gubby day do not forget this",
  "https://autoshot.onrender.com",
  "🟨🟦🟥",
  "kita ikuyo is my goatt",
  "go watch bocchi the rock its really good",
  "the vocaloid community is just killing itself every day with how their behavior is",
  "visit settings to customize your experience",
  "preview 1280",
  "yo tiktok ai cast verse is so welcoming ❤❤",
  "polyester man",
  "my favorite color is purple",
  "yo check out mace mayhem on roblox",
  "yo why the hell is ironmouse is fortnite",
  "suggest more lines for this list on the dc server",
  "lucky larp",
  "how to larp like a pro",
];

if (randomtext) {
  randomtext.innerHTML = list[Math.floor(Math.random() * list.length)];
}

const randomcharacter = document.getElementById("randomcharacterimage");
const listforcharacters = [
  //"/assets/otherstuff/kita.png",
  "/assets/otherstuff/ryo.png",
 // "/assets/otherstuff/bocchi.png",
  //"/assets/otherstuff/nijika.png"
];

if (randomcharacter) {
  randomcharacter.src = listforcharacters[Math.floor(Math.random() * listforcharacters.length)];
}

//main title still, just dmca popup or whatever
// AI ASSISTED AS I WAS VERY LAZY SORRY GUYS

document.addEventListener("DOMContentLoaded", () => {
  const dmcabutton = document.getElementById("dmcabutton");
  const creditsbutton = document.getElementById("creditsbutton");

  if (dmcabutton) {
    dmcabutton.addEventListener("click", () => {
      createpopup(`
        <h2 style="margin-bottom: 10px;">DMCA Notice</h2>
        <p style="margin-bottom: 15px;">This website may contain copyrighted material. If you believe that your copyrighted work has been used in a way that constitutes copyright infringement, please contact us at <a href='mailto:dmca@example.com'>dmca@example.com</a> and start your email header with !DMCA.</p>
        <p style="margin-bottom: 10px;">NOTE: EMAILING IS SLOWER AND MIGHT TAKE WEEKS.</p>
        <p style="margin-bottom: 10px;">Recommended option is to join our discord server and go in general channel and ping @Kitaylena and you will get a instant response.</p>
      `);
    });
  }

  if (creditsbutton) {
    creditsbutton.addEventListener("click", () => {
      createpopup(`
        <h2 style="margin-bottom: 10px;">Credits</h2>
        <p style="margin-bottom: 25px;">Citasune was created by <a href='https://github.com/Kitaylena'>Kitaylena</a>.</p>
        <p style="margin-bottom: 10px;">Any webport credits will be within next to the title when you play a game.</p>
        <p style="margin-bottom: 10px;">This repo contains all web-ports along with credits. <a href='https://github.com/gays-studio/web-port-list' target='_blank'>https://github.com/gays-studio/web-port-list</a></p>
      `);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 40;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height + canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.4 + 0.1;
      this.speedX = Math.random() * 0.2 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
});
// proxy
const proxyinputtextbox = document.getElementById("inputbox");
if (proxyinputtextbox) {
  proxyinputtextbox.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        createpopup(`
          <h2 style="margin-bottom: 10px;">Proxy Disabled</h2>
          <p style="margin-bottom: 15px;">this isn't finished yet as i haven't had the time to work on it, sorry! this feature will come eventually in the future.</p>
        `);
      }
  });
}


// this is to check if its a file instead, will disable proxy however games will be active still
const islocal = window.location.protocol === "file:";
if (islocal) {
  const proxyinput = document.getElementById("inputbox");
  
  if (proxyinput) {
    proxyinput.disabled = true;
    proxyinput.placeholder = "Proxy disabled due to being a local file.";
  }
}

// helper functions

function goto(url) {
  if (url == "./proxy.html") {
    alert("Proxy is disabled for the time being..");
    return;
  }
  window.location.href = url;
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

function apps() {
  createpopup(`
    <h2 style="margin-bottom: 10px;">WIP!</h2> 
    <p style="margin-bottom: 15px;">this is in WIP and not yet available, come back soon when a update drops!</p>
  `);
}

function discord() {
  createpopup(`
    <h2 style="margin-bottom: 10px;">Discord</h2>
    <p style="margin-bottom: 15px;">join the discord server for more updates and links! <a href='https://discord.gg/aSKPJhcN7b' target='_blank'>https://discord.gg/aSKPJhcN7b</a></p>
    <p style="margin-bottom: 10px;">suggestions and more can also be submitted there!</p>
    <p style="margin-bottom: 10px;">boosters will also get exclusive links that will work unbl*cked for every blocker!</p>
    `);
}
// settings
const defaultaccent = "0, 243, 255";
const defaultbg= "#0b0c0d";
const defaultfont = "'thenormalfontorsmth', sans-serif";
const themes = [
  { name: "Default", rgb: "0, 243, 255", bg: "#0b0c0d" },
  { name: "Ocean", rgb: "56, 189, 248", bg: "#0a1420" },
  { name: "Forest", rgb: "74, 222, 128", bg: "#0b140f" },
  { name: "Sunset", rgb: "251, 146, 60", bg: "#1a0f0a" },
  { name: "Rose", rgb: "244, 63, 94", bg: "#1a0a0f" },
  { name: "Grape", rgb: "168, 85, 247", bg: "#120a1a" },
  { name: "Gold", rgb: "250, 204, 21", bg: "#14120a" },
  { name: "Crimson", rgb: "239, 68, 68", bg: "#150a0a" },
  { name: "Mint", rgb: "45, 212, 191", bg: "#0a1614" },
  { name: "Mono", rgb: "255, 255, 255", bg: "#0c0c0c" },
];
const fonts = [
  { name: "Default", stack: "'thenormalfontorsmth', sans-serif" },
  { name: "System", stack: "system-ui, sans-serif" },
  { name: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { name: "Monospace", stack: "'Courier New', monospace" },
  { name: "Rounded", stack: "'Comic Sans MS', 'Comic Sans', cursive" },
];

function hexToRgb(hex) {
  hex = (hex + "").replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
}

function applySavedSettings() {
  try {
    const accent = localStorage.getItem("gnAccent");
    if (accent) document.documentElement.style.setProperty("--accent-rgb", accent);
    const bg = localStorage.getItem("gnBg");
    if (bg) document.documentElement.style.setProperty("--bg", bg);
    const font = localStorage.getItem("gnFont");
    if (font) document.documentElement.style.setProperty("--app-font", font);
    if (localStorage.getItem("gnGlass") === "off") {
      document.body.classList.add("no-glass");
    }
  } catch (e) {}
}
function setTheme(rgb, bg) {
  document.documentElement.style.setProperty("--accent-rgb", rgb);
  if (bg) document.documentElement.style.setProperty("--bg", bg);
  try {
    localStorage.setItem("gnAccent", rgb);
    if (bg) localStorage.setItem("gnBg", bg);
  } catch (e) {}
  document.querySelectorAll(".theme-swatch").forEach((s) =>
    s.classList.toggle("active", s.dataset.rgb === rgb)
  );
}
function setAccentHex(hex) {
  const rgb = hexToRgb(hex);
  document.documentElement.style.setProperty("--accent-rgb", rgb);
  try { localStorage.setItem("gnAccent", rgb); } catch (e) {}
  document.querySelectorAll(".theme-swatch").forEach((s) =>
    s.classList.remove("active")
  );
}

function setFont(stack) {
  document.documentElement.style.setProperty("--app-font", stack);
  try { localStorage.setItem("gnFont", stack); } catch (e) {}
}

function setGlass(on) {
  document.body.classList.toggle("no-glass", !on);
  try { localStorage.setItem("gnGlass", on ? "on" : "off"); } catch (e) {}
  const toggle = document.getElementById("glassToggle");
  if (toggle) toggle.classList.toggle("on", on);
}

// open the current site inside an about:blank tab (cloak), then send this tab away
function openInBlank() {
  const url = window.location.href;
  const win = window.open("about:blank", "_blank");
  if (!win) {
    alert("your browser blocked the popup, allow popups for this site and try again");
    return;
  }
  win.document.title = "New Tab";
  const iframe = win.document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:0;left:0;border:none;width:100%;height:100%;margin:0;";
  iframe.src = url;
  win.document.body.style.margin = "0";
  win.document.body.appendChild(iframe);
  // leave the original tab on a harmless page
  window.location.replace("https://www.google.com");
}

function setAutoBlank(on) {
  try { localStorage.setItem("gnAutoBlank", on ? "on" : "off"); } catch (e) {}
  const toggle = document.getElementById("autoBlankToggle");
  if (toggle) toggle.classList.toggle("on", on);
}

function maybeAutoBlank() {
  try {
    if (localStorage.getItem("gnAutoBlank") !== "on") return;
    if (window.self !== window.top) return; // already inside the cloak iframe
    if (sessionStorage.getItem("gnBlanked")) return;
    sessionStorage.setItem("gnBlanked", "1");
    openInBlank();
  } catch (e) {}
}

const cloaks = [
  { name: "None", title: "", icon: "" },
  { name: "Google", title: "Google", icon: "https://www.google.com/favicon.ico" },
  { name: "Classroom", title: "Home", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
  { name: "Google Docs", title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { name: "Google Drive", title: "Home - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { name: "Clever", title: "Clever | Portal", icon: "https://clever.com/favicon.ico" },
  { name: "Canvas", title: "Dashboard", icon: "https://canvas.instructure.com/favicon.ico" },
  { name: "Wikipedia", title: "Wikipedia", icon: "https://www.wikipedia.org/static/favicon/wikipedia.ico" },
];

function setFavicon(href) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href || "/assets/imageassets/CitasuneIcon.png";
}

function applyCloak() {
  try {
    const name = localStorage.getItem("gnCloak");
    if (!name || name === "None") return;
    const c = CLOAKS.find((x) => x.name === name);
    if (!c) return;
    if (c.title) document.title = c.title;
    setFavicon(c.icon);
  } catch (e) {}
}

function setCloak(name) {
  try { localStorage.setItem("gnCloak", name); } catch (e) {}
  const c = CLOAKS.find((x) => x.name === name);
  if (!c || name === "None") {
    document.title = "Citasune";
    setFavicon("");
    return;
  }
  if (c.title) document.title = c.title;
  setFavicon(c.icon);
}

let capturingPanic = false;

function capturePanicKey(btn) {
  capturingPanic = true;
  if (btn) btn.textContent = "press any key...";
}

function setPanicUrl(url) {
  try { localStorage.setItem("gnPanicUrl", url); } catch (e) {}
}

document.addEventListener("keydown", (e) => {
  if (capturingPanic) {
    e.preventDefault();
    capturingPanic = false;
    try { localStorage.setItem("gnPanicKey", e.key); } catch (er) {}
    const btn = document.getElementById("panicKeyBtn");
    if (btn) btn.textContent = "Key: " + (e.key === " " ? "Space" : e.key);
    return;
  }
  const t = e.target;
  if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  let key = null;
  try { key = localStorage.getItem("gnPanicKey"); } catch (er) {}
  if (key && e.key.toLowerCase() === key.toLowerCase()) {
    let url = "https://www.google.com";
    try { url = localStorage.getItem("gnPanicUrl") || url; } catch (er) {}
    (window.top || window).location.href = url;
  }
});

function openSettings() {
  let curAccent = defaultaccent, curFont = defaultfont, glassOn = true;
  let autoBlank = false, curCloak = "None", panicKey = "", panicUrl = "https://www.google.com";
  try {
    curAccent = localStorage.getItem("gnAccent") || defaultaccent;
    curFont = localStorage.getItem("gnFont") || defaultfont;
    glassOn = localStorage.getItem("gnGlass") !== "off";
    autoBlank = localStorage.getItem("gnAutoBlank") === "on";
    curCloak = localStorage.getItem("gnCloak") || "None";
    panicKey = localStorage.getItem("gnPanicKey") || "";
    panicUrl = localStorage.getItem("gnPanicUrl") || panicUrl;
  } catch (e) {}

  const swatches = themes.map((t) =>
    `<button class="theme-swatch${t.rgb === curAccent ? " active" : ""}" data-rgb="${t.rgb}" style="background: rgb(${t.rgb})" title="${t.name}" onclick="setTheme('${t.rgb}', '${t.bg}')"></button>`
  ).join("");

  const fontOpts = fonts.map((f) =>
    `<option value="${f.stack}"${f.stack === curFont ? " selected" : ""}>${f.name}</option>`
  ).join("");

  const cloakOpts = cloaks.map((c) =>
    `<option value="${c.name}"${c.name === curCloak ? " selected" : ""}>${c.name}</option>`
  ).join("");

  const panicLabel = panicKey ? "Key: " + (panicKey === " " ? "Space" : panicKey) : "Set key";

  createpopup(`
    <h2 style="margin-bottom: 1rem;">Settings</h2>
    <h3 style="margin:1.4rem 0 0.4rem;">customization</h3>
    <div class="settings-row">
      <label>liquid glass</label>
      <button id="glassToggle" class="glass-toggle${glassOn ? " on" : ""}" onclick="setGlass(!this.classList.contains('on'))"></button>
    </div>
    <div class="settings-row">
      <label>theme</label>
      <div class="theme-swatches">${swatches}</div>
    </div>
    <div class="settings-row">
      <label>custom color</label>
      <input type="color" class="settings-color" value="#00f3ff" oninput="setAccentHex(this.value)">
    </div>
    <div class="settings-row">
      <label>font</label>
      <select class="settings-select" onchange="setFont(this.value)">${fontOpts}</select>
    </div>

    <h3 style="margin:1.4rem 0 0.4rem;">site</h3>
    <div class="settings-row">
      <label>tab cloak</label>
      <select class="settings-select" onchange="setCloak(this.value)">${cloakOpts}</select>
    </div>
    <div class="settings-row">
      <label>auto open in about:blank</label>
      <button id="autoBlankToggle" class="glass-toggle${autoBlank ? " on" : ""}" onclick="setAutoBlank(!this.classList.contains('on'))"></button>
    </div>
    <div class="settings-row">
      <label>open in about:blank now</label>
      <button class="settings-btn" onclick="openInBlank()">Cloak now</button>
    </div>
    <div class="settings-row">
      <label>panic key</label>
      <button id="panicKeyBtn" class="settings-btn" onclick="capturePanicKey(this)">${panicLabel}</button>
    </div>
    <div class="settings-row">
      <label>panic URL</label>
      <input type="text" class="settings-input" value="${panicUrl}" oninput="setPanicUrl(this.value)" placeholder="https://...">
    </div>
  `);
}

applySavedSettings();
applyCloak();
maybeAutoBlank();