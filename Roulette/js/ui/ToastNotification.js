(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};

  class ToastNotification {
    constructor(host) {
      this.host = host;
      this.types = {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
      };
    }

    show(message, type = "info", duration = 2400) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.style.setProperty("--toast-color", this.types[type] || this.types.info);
      toast.textContent = message;
      this.host.appendChild(toast);
      window.setTimeout(() => {
        toast.classList.add("removing");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
      }, duration);
    }
  }

  Object.assign(R, { ToastNotification });
})();
