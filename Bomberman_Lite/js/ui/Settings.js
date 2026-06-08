(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  const Settings = {
    open(game) {
      const settings = Object.assign({}, game.settings);
      game.modal.open({
        title: "設定",
        body: `
          <form class="settings-form" data-settings-form>
            <label class="setting-row">
              <span>背景音樂音量</span>
              <input type="range" min="0" max="100" value="${settings.bgmVolume}" name="bgmVolume">
            </label>
            <label class="setting-row">
              <span>音效音量</span>
              <input type="range" min="0" max="100" value="${settings.sfxVolume}" name="sfxVolume">
            </label>
            <div class="setting-row">
              <span>顏色主題</span>
              <div class="theme-picker">
                ${root.THEMES.map((theme) => `<button type="button" class="theme-chip ${settings.theme === theme.id ? "active" : ""}" data-theme-id="${theme.id}">${theme.label}</button>`).join("")}
              </div>
            </div>
            <div class="setting-row">
              <span>控制方式</span>
              <div class="segmented">
                <button type="button" data-controls="arrow" class="${settings.controls === "arrow" ? "active" : ""}">方向鍵</button>
                <button type="button" data-controls="wasd" class="${settings.controls === "wasd" ? "active" : ""}">WASD</button>
              </div>
            </div>
            <label class="setting-row">
              <span>顯示虛擬搖桿</span>
              <input type="checkbox" name="showJoystick" ${settings.showJoystick ? "checked" : ""}>
            </label>
            <label class="setting-row">
              <span>觸控震動回饋</span>
              <input type="checkbox" name="vibration" ${settings.vibration ? "checked" : ""}>
            </label>
          </form>
        `,
        actions: [
          { label: "關閉", className: "btn-secondary", action: () => game.modal.close() },
          {
            label: "儲存設定",
            className: "btn-primary",
            action: () => {
              const form = game.modal.content.querySelector("[data-settings-form]");
              const next = Object.assign({}, settings, {
                bgmVolume: Number(form.elements.bgmVolume.value),
                sfxVolume: Number(form.elements.sfxVolume.value),
                showJoystick: form.elements.showJoystick.checked,
                vibration: form.elements.vibration.checked
              });
              game.applySettings(next);
              game.audio.play("sfx_ui_click");
              game.modal.close();
            }
          }
        ],
        afterOpen: (content) => {
          content.querySelectorAll("[data-theme-id]").forEach((button) => {
            button.addEventListener("click", () => {
              settings.theme = button.dataset.themeId;
              document.documentElement.setAttribute("data-theme", settings.theme);
              content.querySelectorAll("[data-theme-id]").forEach((item) => item.classList.remove("active"));
              button.classList.add("active");
              game.audio.play("sfx_ui_click");
            });
          });
          content.querySelectorAll("[data-controls]").forEach((button) => {
            button.addEventListener("click", () => {
              settings.controls = button.dataset.controls;
              content.querySelectorAll("[data-controls]").forEach((item) => item.classList.remove("active"));
              button.classList.add("active");
            });
          });
        }
      });
    }
  };

  root.Settings = Settings;
}());
