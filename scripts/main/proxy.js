(function () {
  var box = document.getElementById("inputbox");
  if (!box) return;
  box.disabled = false;
  box.placeholder = "Search the web..";
  box.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var q = box.value.trim();
    if (!q) return;
    var a = document.createElement("a");
    a.href = "pages/proxy.html?q=" + encodeURIComponent(q);
    location.href = a.href;
  });
})();
