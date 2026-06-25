(function () {
  window.EAE = window.EAE || {};

  class ScreenManager {
    constructor() {
      this.current = "home";
      this.screens = {
        home: document.getElementById("screen-home"),
        game: document.getElementById("screen-game"),
        help: document.getElementById("screen-help"),
        settings: document.getElementById("screen-settings")
      };
    }

    show(name) {
      Object.entries(this.screens).forEach(([key, screen]) => {
        if (screen) screen.classList.toggle("active", key === name);
      });
      this.current = name;
    }

    showModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    hideModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    hideAllModals() {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      });
    }
  }

  window.EAE.ScreenManager = ScreenManager;
})();
