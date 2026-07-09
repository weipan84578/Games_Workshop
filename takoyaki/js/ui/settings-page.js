(function registerSettingsPage(app) {
  "use strict";

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  function percent(value) {
    return `${Math.round(Number(value) * 100)}%`;
  }

  function currentLanguage(settings) {
    return settings.language === "auto" ? app.I18n.getLanguage() : settings.language;
  }

  function renderRange(id, labelKey, value) {
    return `
      <div class="setting-row">
        <label class="setting-label" for="${id}"><span class="icon" aria-hidden="true">${id === "bgm-volume" ? "🔊" : "✨"}</span><span>${t(labelKey)}</span></label>
        <div class="range-wrap">
          <input id="${id}" type="range" min="0" max="100" step="1" value="${Math.round(value * 100)}" data-range="${id}">
          <output class="range-value" for="${id}" data-output="${id}">${percent(value)}</output>
        </div>
      </div>
    `;
  }

  app.SettingsPage = {
    render() {
      const root = document.getElementById("screen-settings");
      const settings = app.State.get().settings;
      root.innerHTML = `
        <div class="page-frame">
          <header class="page-header">
            <button class="btn btn-quiet icon-btn" type="button" data-settings="back" aria-label="${t("action_back")}">
              <span class="icon" aria-hidden="true">←</span>
            </button>
            <div>
              <h2>${t("settings_title")}</h2>
              <p class="muted">${t("app_kicker")}</p>
            </div>
          </header>
          <section class="panel settings-list">
            <section class="setting-section">
              <h3>${t("settings_audio")}</h3>
              ${renderRange("bgm-volume", "settings_bgm", settings.bgmVolume)}
              ${renderRange("sfx-volume", "settings_sfx", settings.sfxVolume)}
              <div class="button-row data-actions">
                <button class="btn btn-secondary" type="button" data-settings="test"><span class="icon" aria-hidden="true">🔔</span><span>${t("settings_test_sound")}</span></button>
              </div>
            </section>
            <section class="setting-section">
              <h3>${t("settings_theme")}</h3>
              <div class="theme-swatches">
                ${app.Config.themes.map((theme) => `
                  <button class="theme-swatch" type="button" data-theme="${theme.id}" aria-pressed="${settings.theme === theme.id}">
                    <span class="theme-dot" style="background:${theme.color}" aria-hidden="true"></span>
                    <span>${settings.theme === theme.id ? "✓ " : ""}${t(theme.key)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
            <section class="setting-section">
              <h3>${t("settings_language")}</h3>
              <div class="language-options">
                ${app.Config.languages.map((language) => `
                  <button class="btn btn-secondary" type="button" data-language="${language.id}" aria-pressed="${currentLanguage(settings) === language.id}">
                    <span class="icon" aria-hidden="true">${language.flag}</span>
                    <span>${currentLanguage(settings) === language.id ? "✓ " : ""}${t(language.nameKey)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
            <section class="setting-section">
              <h3>${t("settings_data")}</h3>
              <div class="button-row data-actions">
                <button class="btn btn-danger" type="button" data-settings="clear"><span class="icon" aria-hidden="true">🗑</span><span>${t("settings_clear_progress")}</span></button>
                <button class="btn btn-quiet" type="button" data-settings="reset"><span class="icon" aria-hidden="true">↺</span><span>${t("settings_reset_settings")}</span></button>
              </div>
            </section>
          </section>
        </div>
      `;

      root.querySelector("[data-settings='back']").addEventListener("click", () => {
        app.AudioManager.playSfx("button");
        app.ScreenManager.show("main-menu");
        app.MainMenu.render();
      });
      root.querySelector("[data-settings='test']").addEventListener("click", async () => {
        await app.AudioManager.unlock();
        app.AudioManager.playSfx("star");
      });
      root.querySelector("[data-range='bgm-volume']").addEventListener("input", (event) => {
        const value = Number(event.target.value) / 100;
        root.querySelector("[data-output='bgm-volume']").textContent = percent(value);
        app.State.updateSettings({ bgmVolume: value });
        app.AudioManager.setVolumes(app.State.get().settings);
      });
      root.querySelector("[data-range='sfx-volume']").addEventListener("input", (event) => {
        const value = Number(event.target.value) / 100;
        root.querySelector("[data-output='sfx-volume']").textContent = percent(value);
        app.State.updateSettings({ sfxVolume: value });
        app.AudioManager.setVolumes(app.State.get().settings);
        app.AudioManager.playSfx("button");
      });
      root.querySelectorAll("[data-theme]").forEach((button) => {
        button.addEventListener("click", () => {
          app.AudioManager.playSfx("button");
          app.State.updateSettings({ theme: button.dataset.theme });
          app.ApplyTheme(button.dataset.theme);
          app.SettingsPage.render();
        });
      });
      root.querySelectorAll("[data-language]").forEach((button) => {
        button.addEventListener("click", () => {
          app.AudioManager.playSfx("button");
          const language = button.dataset.language;
          app.State.updateSettings({ language });
          app.I18n.setLanguage(language);
          app.SettingsPage.render();
        });
      });
      root.querySelector("[data-settings='clear']").addEventListener("click", async () => {
        app.AudioManager.playSfx("button");
        const ok = await app.ScreenManager.confirm({
          titleKey: "settings_clear_confirm_title",
          bodyKey: "settings_clear_confirm_body",
          confirmKey: "action_confirm",
          cancelKey: "action_cancel",
          danger: true
        });
        if (ok) {
          app.Storage.clearProgress();
          await app.ScreenManager.confirm({
            titleKey: "settings_title",
            bodyKey: "settings_progress_cleared",
            confirmKey: "action_ok",
            cancelKey: null
          });
        }
      });
      root.querySelector("[data-settings='reset']").addEventListener("click", async () => {
        app.AudioManager.playSfx("button");
        const ok = await app.ScreenManager.confirm({
          titleKey: "settings_reset_confirm_title",
          bodyKey: "settings_reset_confirm_body",
          confirmKey: "action_confirm",
          cancelKey: "action_cancel"
        });
        if (ok) {
          app.State.resetSettings();
          app.ApplyTheme(app.State.get().settings.theme);
          app.I18n.init(app.State.get().settings);
          app.AudioManager.setVolumes(app.State.get().settings);
          app.SettingsPage.render();
        }
      });
    }
  };

  app.EventBus.on("i18n:changed", () => {
    if (app.State.get().screen === "settings") {
      app.SettingsPage.render();
    }
  });
})(window.Takoyaki = window.Takoyaki || {});
