(function () {
  window.EAE = window.EAE || {};

  class HomeUI {
    constructor(options) {
      this.screenManager = options.screenManager;
      this.saveManager = options.saveManager;
      this.sfx = options.sfx;
      this.onStart = options.onStart;
      this.onContinue = options.onContinue;
      this.onHelp = options.onHelp;
      this.onSettings = options.onSettings;
      this.onLocale = options.onLocale;
      this.continueButton = document.getElementById("btn-continue");
    }

    init() {
      document.getElementById("btn-start").addEventListener("click", () => {
        this._click();
        this.screenManager.showModal("modal-difficulty");
      });
      this.continueButton.addEventListener("click", () => {
        this._click();
        if (!this.continueButton.disabled) this.onContinue();
      });
      document.getElementById("btn-help").addEventListener("click", () => {
        this._click();
        this.onHelp();
      });
      document.getElementById("btn-settings").addEventListener("click", () => {
        this._click();
        this.onSettings();
      });
      document.querySelectorAll(".difficulty-option").forEach((button) => {
        button.addEventListener("click", () => {
          this._click();
          this.screenManager.hideModal("modal-difficulty");
          this.onStart(button.dataset.difficulty);
        });
      });
      document.querySelectorAll(".locale-bar .locale-btn").forEach((button) => {
        button.addEventListener("click", () => {
          this._click();
          this.onLocale(button.dataset.locale);
        });
      });
      document.addEventListener("keydown", (event) => this._handleShortcut(event));
      this.updateContinue();
    }

    updateContinue() {
      if (!this.continueButton) return;
      this.continueButton.disabled = !this.saveManager.hasSave();
    }

    _handleShortcut(event) {
      if (this.screenManager.current !== "home") return;
      if (document.querySelector(".modal.is-open")) return;
      const key = event.key.toLowerCase();
      if (event.key === "Enter") document.getElementById("btn-start").click();
      if (key === "c" && !this.continueButton.disabled) this.continueButton.click();
      if (key === "h") document.getElementById("btn-help").click();
      if (key === "s") document.getElementById("btn-settings").click();
    }

    _click() {
      if (this.sfx) this.sfx.playClick();
    }
  }

  window.EAE.HomeUI = HomeUI;
})();
