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
      const themeButton = (id, label, color) => {
        const active = s.theme === id ? " is-active" : "";
        return `<button type="button" class="${active}" data-theme="${id}"><span class="swatch-dot" style="--swatch:${color}"></span>${label}</button>`;
      };
      const fontButton = (id, label) => `<button type="button" class="${s.fontSize === id ? "is-active" : ""}" data-font="${id}">${label}</button>`;
      const sideButton = (id, label) => `<button type="button" class="${s.controlSide === id ? "is-active" : ""}" data-side="${id}">${label}</button>`;

      this.app.modal.show("設定", `
        <form class="settings-form" id="settingsForm">
          <section class="setting">
            <label for="musicVol">音樂音量 <strong id="musicVolText">${s.musicVol}</strong></label>
            <input id="musicVol" type="range" min="0" max="100" value="${s.musicVol}">
          </section>
          <section class="setting">
            <label for="sfxVol">音效音量 <strong id="sfxVolText">${s.sfxVol}</strong></label>
            <input id="sfxVol" type="range" min="0" max="100" value="${s.sfxVol}">
          </section>
          <section class="setting">
            <legend>色彩主題</legend>
            <div class="swatches">
              ${themeButton("neon", "霓虹", "#39ff14")}
              ${themeButton("retro", "復古", "#ffb000")}
              ${themeButton("ocean", "海洋", "#47b5ff")}
              ${themeButton("sunset", "夕陽", "#ff7849")}
              ${themeButton("mono", "高對比", "#ffffff")}
            </div>
          </section>
          <section class="setting">
            <legend>文字大小</legend>
            <div class="segmented">
              ${fontButton("compact", "緊湊")}
              ${fontButton("normal", "標準")}
              ${fontButton("large", "放大")}
            </div>
          </section>
          <section class="setting">
            <div class="toggle-line">
              <label for="shakeToggle">碰撞震動</label>
              <input id="shakeToggle" type="checkbox" ${s.shake ? "checked" : ""}>
            </div>
          </section>
          <section class="setting">
            <legend>觸控射擊鍵</legend>
            <div class="segmented">
              ${sideButton("right", "右側")}
              ${sideButton("left", "左側")}
            </div>
            <p class="setting__hint">手機橫向時會套用左右配置。</p>
          </section>
        </form>
      `, [{ label: "完成", action: () => this.app.modal.close() }]);

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
