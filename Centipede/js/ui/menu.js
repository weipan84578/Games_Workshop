(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.UI = Game.UI || {};

  class Menu {
    constructor(app) {
      this.app = app;
      this.el = document.getElementById("menuScreen");
      this.buttons = Array.from(this.el.querySelectorAll(".menu-button"));
      this.saveStatus = document.getElementById("saveStatus");
      this.selected = 0;
      this.buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
          this.selected = index;
          this.activateSelected();
        });
        button.addEventListener("pointerenter", () => {
          this.selected = index;
          this.refreshSelection(false);
        });
      });
    }

    show() {
      this.refreshSaveState();
      this.el.classList.add("is-active");
      this.app.state.set("MENU");
      Game.Music.play(this.app.audio, "menu_theme", this.app.level);
    }

    hide() {
      this.el.classList.remove("is-active");
    }

    refreshSaveState() {
      const save = Game.Storage.loadSave();
      const continueBtn = this.buttons.find((button) => button.dataset.action === "continue");
      continueBtn.disabled = !save;
      if (save) {
        const date = new Date(save.timestamp || Date.now());
        this.saveStatus.textContent = this.app.t("menu.saveFound", {
          level: save.level,
          score: Game.Helpers.formatScore(save.score),
          date: date.toLocaleString(Game.I18n.getLocale())
        });
      } else {
        this.saveStatus.textContent = this.app.t("menu.noSave");
      }
    }

    move(delta) {
      const enabled = this.buttons.filter((button) => !button.disabled);
      const current = enabled.indexOf(this.buttons[this.selected]);
      const next = (current + delta + enabled.length) % enabled.length;
      this.selected = this.buttons.indexOf(enabled[next]);
      this.refreshSelection(true);
    }

    refreshSelection(playSound) {
      this.buttons.forEach((button, index) => {
        button.classList.toggle("is-selected", index === this.selected);
      });
      if (playSound) {
        this.app.playSfx("ui_move");
      }
    }

    activateSelected() {
      const button = this.buttons[this.selected];
      if (!button || button.disabled) {
        this.app.playSfx("ui_error");
        return;
      }
      this.app.unlockAudio();
      this.app.playSfx("ui_confirm");
      const action = button.dataset.action;
      if (action === "new") {
        this.app.startNewGame();
      } else if (action === "continue") {
        this.app.continueGame();
      } else if (action === "help") {
        this.app.showHelp();
      } else if (action === "settings") {
        this.app.settingsPanel.show();
      }
    }
  }

  Game.UI.Menu = Menu;
})(window);
