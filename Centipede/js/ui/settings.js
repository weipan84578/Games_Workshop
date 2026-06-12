(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.UI = Game.UI || {};

  class SettingsPanel {
    constructor(app) {
      this.app = app;
    }

    show() {
      const s = this.app.settings;
      const t = (key) => this.app.t(key);
      const langButton = (id) => `<button type="button" class="${s.language === id ? "is-active" : ""}" data-language="${id}">${t(`lang.${id}`)}</button>`;
      const themeButton = (id, label, color) => {
        const active = s.theme === id ? " is-active" : "";
        return `<button type="button" class="${active}" data-theme="${id}"><span class="swatch-dot" style="--swatch:${color}"></span>${label}</button>`;
      };
      const fontButton = (id, label) => `<button type="button" class="${s.fontSize === id ? "is-active" : ""}" data-font="${id}">${label}</button>`;
      const sideButton = (id, label) => `<button type="button" class="${s.controlSide === id ? "is-active" : ""}" data-side="${id}">${label}</button>`;

      this.app.modal.show(t("settings.title"), `
        <form class="settings-form" id="settingsForm">
          <section class="setting">
            <legend>${t("settings.language")}</legend>
            <div class="segmented">
              ${langButton("zh-Hant")}
              ${langButton("en")}
              ${langButton("ja")}
            </div>
          </section>
          <section class="setting">
            <label for="musicVol">${t("settings.musicVol")} <strong id="musicVolText">${s.musicVol}</strong></label>
            <input id="musicVol" type="range" min="0" max="100" value="${s.musicVol}">
          </section>
          <section class="setting">
            <label for="sfxVol">${t("settings.sfxVol")} <strong id="sfxVolText">${s.sfxVol}</strong></label>
            <input id="sfxVol" type="range" min="0" max="100" value="${s.sfxVol}">
          </section>
          <section class="setting">
            <legend>${t("settings.theme")}</legend>
            <div class="swatches">
              ${themeButton("neon", t("theme.neon"), "#39ff14")}
              ${themeButton("retro", t("theme.retro"), "#ffb000")}
              ${themeButton("ocean", t("theme.ocean"), "#47b5ff")}
              ${themeButton("sunset", t("theme.sunset"), "#ff7849")}
              ${themeButton("mono", t("theme.mono"), "#ffffff")}
            </div>
          </section>
          <section class="setting">
            <legend>${t("settings.fontSize")}</legend>
            <div class="segmented">
              ${fontButton("compact", t("font.compact"))}
              ${fontButton("normal", t("font.normal"))}
              ${fontButton("large", t("font.large"))}
            </div>
          </section>
          <section class="setting">
            <div class="toggle-line">
              <label for="shakeToggle">${t("settings.shake")}</label>
              <input id="shakeToggle" type="checkbox" ${s.shake ? "checked" : ""}>
            </div>
          </section>
          <section class="setting">
            <legend>${t("settings.touchFire")}</legend>
            <div class="segmented">
              ${sideButton("right", t("side.right"))}
              ${sideButton("left", t("side.left"))}
            </div>
            <p class="setting__hint">${t("settings.touchHint")}</p>
          </section>
        </form>
      `, [{ label: t("action.done"), action: () => this.app.modal.close() }]);

      const body = this.app.modal.body;
      body.querySelector("#musicVol").addEventListener("input", (event) => {
        this.update({ musicVol: Number(event.target.value) });
        body.querySelector("#musicVolText").textContent = event.target.value;
      });
      body.querySelector("#sfxVol").addEventListener("input", (event) => {
        this.update({ sfxVol: Number(event.target.value) });
        body.querySelector("#sfxVolText").textContent = event.target.value;
      });
      body.querySelector("#shakeToggle").addEventListener("change", (event) => {
        this.update({ shake: event.target.checked });
      });
      body.querySelectorAll("[data-language]").forEach((button) => {
        button.addEventListener("click", () => {
          this.update({ language: button.dataset.language });
          this.show();
        });
      });
      body.querySelectorAll("[data-theme]").forEach((button) => {
        button.addEventListener("click", () => {
          this.update({ theme: button.dataset.theme });
          this.show();
        });
      });
      body.querySelectorAll("[data-font]").forEach((button) => {
        button.addEventListener("click", () => {
          this.update({ fontSize: button.dataset.font });
          this.show();
        });
      });
      body.querySelectorAll("[data-side]").forEach((button) => {
        button.addEventListener("click", () => {
          this.update({ controlSide: button.dataset.side });
          this.show();
        });
      });
    }

    update(patch) {
      this.app.updateSettings(Object.assign({}, this.app.settings, patch));
      this.app.playSfx("ui_move");
    }
  }

  Game.UI.SettingsPanel = SettingsPanel;
})(window);
