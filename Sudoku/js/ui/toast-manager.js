(function (global) {
  "use strict";

  let region = null;

  function show(message, type, duration) {
    if (!region) {
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type ? `is-${type}` : ""}`.trim();
    toast.textContent = message;
    region.appendChild(toast);

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      window.setTimeout(() => toast.remove(), 180);
    }, duration || 2300);
  }

  global.ToastManager = {
    init() {
      region = document.getElementById("toast-region");
    },
    show,
  };
})(window);
