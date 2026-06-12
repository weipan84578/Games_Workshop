(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.UI = Game.UI || {};

  class Modal {
    constructor(app) {
      this.app = app;
      this.el = document.getElementById("modal");
      this.title = document.getElementById("modalTitle");
      this.body = document.getElementById("modalBody");
      this.actions = document.getElementById("modalActions");
      document.getElementById("modalClose").addEventListener("click", () => this.close());
    }

    show(title, body, actions) {
      this.title.textContent = title;
      this.body.innerHTML = body;
      this.actions.innerHTML = "";
      (actions || [{ label: "關閉", action: () => this.close() }]).forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "modal-button";
        button.textContent = item.label;
        button.addEventListener("click", () => {
          this.app.playSfx("ui_confirm");
          item.action();
        });
        this.actions.appendChild(button);
      });
      this.el.hidden = false;
    }

    close() {
      this.el.hidden = true;
      if (this.app.state.is("PLAYING")) {
        this.app.canvas.focus({ preventScroll: true });
      }
    }

    isOpen() {
      return !this.el.hidden;
    }
  }

  Game.UI.Modal = Modal;
})(window);
