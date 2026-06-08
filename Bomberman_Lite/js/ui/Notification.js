(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class Notifier {
    constructor(layer) {
      this.layer = layer;
    }

    show(text, duration) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = text;
      this.layer.appendChild(toast);
      setTimeout(() => toast.remove(), duration || 1600);
    }
  }

  root.Notifier = Notifier;
}());
