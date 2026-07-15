(function (Game) {
  "use strict";
  function Toast(root) {
    this.root = root;
    this.last = Object.create(null);
  }
  Toast.prototype.show = function (message, type) {
    var key = String(message);
    var now = Date.now();
    if (this.last[key] && now - this.last[key] < 2500) return;
    this.last[key] = now;
    var item = document.createElement("div");
    item.className = "toast toast-" + (type || "info");
    item.setAttribute("role", "status");
    item.textContent = message;
    this.root.appendChild(item);
    window.setTimeout(function () {
      item.classList.add("is-leaving");
      window.setTimeout(function () {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, 220);
    }, 3000);
  };
  Game.Toast = Toast;
})(window.DJGame);
