(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Toast = (cg.Toast = {});
  var region;
  var items = [];
  var maxItems = 4;

  Toast.init = function () {
    region = document.getElementById("toast-region");
  };

  function refresh() {
    items.forEach(function (item, index) {
      var scale = Math.max(0.88, 1 - index * 0.035);
      item.style.zIndex = String(maxItems - index);
      item.style.transform =
        "translateY(" + index * -12 + "px) scale(" + scale + ")";
      item.classList.toggle("is-behind", index > 0);
    });
  }

  function remove(item) {
    var index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
    if (item._toastTimer) clearTimeout(item._toastTimer);
    item.classList.add("is-leaving");
    setTimeout(function () {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 220);
    refresh();
  }

  Toast.show = function (message, kind) {
    if (!region) Toast.init();
    if (!region) return;

    var item = document.createElement("div");
    var icon = document.createElement("span");
    var text = document.createElement("span");
    item.className = "toast toast--" + (kind || "info");
    icon.className = "toast__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = kind === "danger" ? "!" : kind === "success" ? "✓" : "•";
    text.textContent = message;
    item.appendChild(icon);
    item.appendChild(text);
    region.appendChild(item);
    items.unshift(item);

    while (items.length > maxItems) remove(items[items.length - 1]);
    refresh();
    item._toastTimer = setTimeout(function () {
      remove(item);
    }, 2800);
  };
})(window);
