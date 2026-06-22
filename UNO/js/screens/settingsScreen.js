(function () {
  const SettingsScreen = {
    render(container) {
      const root = container || Helpers.qs("#screen-settings");
      const settings = UnoStorage.getSettings();
      root.className = "screen content-screen";
      root.innerHTML = `
        <header class="screen-header">
          <button class="btn btn-icon" type="button" data-action="back" aria-label="${I18n.t("common.back")}">←</button>
          <h1>${I18n.t("settings.title")}</h1>
          <span></span>
        </header>
        <div class="content-wrap settings-grid">
          <section class="settings-section">
            <h2>🌐 ${I18n.t("settings.language")}</h2>
            <div class="segmented-row">
              ${Object.keys(I18n.translations)
                .map((lang) => `<button class="btn btn-tag ${settings.lang === lang ? "is-active" : ""}" type="button" data-lang="${lang}">${I18n.getLanguageName(lang)}</button>`)
                .join("")}
            </div>
          </section>
          <section class="settings-section">
            <h2>🎵 ${I18n.t("settings.bgmVolume")}</h2>
            ${this.sliderHtml("bgmVolume", settings.bgmVolume)}
          </section>
          <section class="settings-section">
            <h2>🔔 ${I18n.t("settings.sfxVolume")}</h2>
            ${this.sliderHtml("sfxVolume", settings.sfxVolume)}
          </section>
          <section class="settings-section">
            <h2>🎨 ${I18n.t("settings.theme")}</h2>
            <div class="theme-grid">
              ${Object.keys(UNO_CONSTANTS.THEME_META)
                .map((theme) => {
                  const meta = Themes.getMeta(theme);
                  return `
                    <button class="theme-tile ${settings.theme === theme ? "is-active" : ""}" type="button" data-theme-choice="${theme}">
                      <span class="theme-swatch" style="--c1:${meta.c1};--c2:${meta.c2};--c3:${meta.c3}"></span>
                      <span>${I18n.t(`themes.${theme}`)}</span>
                    </button>`;
                })
                .join("")}
            </div>
          </section>
          <section class="settings-section">
            <h2>🤖 ${I18n.t("settings.difficulty")}</h2>
            <div class="segmented-row">
              ${UNO_CONSTANTS.DIFFICULTIES.map((difficulty) => `<button class="btn btn-tag ${settings.difficulty === difficulty ? "is-active" : ""}" type="button" data-difficulty="${difficulty}">${I18n.t(`difficulty.${difficulty}`)}</button>`).join("")}
            </div>
          </section>
          <section class="settings-section danger-zone">
            <button class="btn btn-danger btn-full" type="button" data-action="clear-save">🗑 ${I18n.t("settings.clearSave")}</button>
          </section>
        </div>
      `;
      this.syncSliders(root);

      root.oninput = (event) => {
        const slider = event.target.closest("[data-slider]");
        if (!slider) return;
        const key = slider.dataset.slider;
        const value = Number(slider.value) / 100;
        const nextSettings = UnoStorage.saveSettings({ [key]: value });
        slider.style.setProperty("--progress", `${slider.value}%`);
        slider.closest(".setting-slider").querySelector(".slider-value").textContent = `${slider.value}%`;
        AudioManager.setVolumes(nextSettings);
      };

      root.onclick = async (event) => {
        const back = event.target.closest('[data-action="back"]');
        const clear = event.target.closest('[data-action="clear-save"]');
        const lang = event.target.closest("[data-lang]")?.dataset.lang;
        const theme = event.target.closest("[data-theme-choice]")?.dataset.themeChoice;
        const difficulty = event.target.closest("[data-difficulty]")?.dataset.difficulty;

        if (back) {
          SFX.play("button");
          App.showScreen("main-menu");
          return;
        }
        if (lang) {
          SFX.play("button");
          I18n.setLang(lang);
          App.renderCurrent();
          Toast.show(I18n.t("settings.saved"), "success");
          return;
        }
        if (theme) {
          SFX.play("button");
          Themes.set(theme);
          App.renderCurrent();
          Toast.show(I18n.t("settings.saved"), "success");
          return;
        }
        if (difficulty) {
          SFX.play("button");
          UnoStorage.saveSettings({ difficulty });
          App.renderCurrent();
          Toast.show(I18n.t("settings.saved"), "success");
          return;
        }
        if (clear) {
          SFX.play("button");
          const ok = await Modal.confirm(I18n.t("settings.clearSaveConfirm"));
          if (ok) {
            UnoStorage.clearSave();
            Toast.show(I18n.t("settings.saved"), "success");
          }
        }
      };
    },

    sliderHtml(key, value) {
      const percent = Math.round(value * 100);
      return `
        <label class="setting-slider">
          <div class="slider-row">
            <span>🔇</span>
            <input class="volume-slider" type="range" min="0" max="100" value="${percent}" data-slider="${key}" aria-label="${key}" style="--progress:${percent}%">
            <span>🔊</span>
          </div>
          <span class="slider-value">${percent}%</span>
        </label>`;
    },

    syncSliders(root) {
      Helpers.qsa("[data-slider]", root).forEach((slider) => {
        slider.style.setProperty("--progress", `${slider.value}%`);
      });
    },
  };

  window.SettingsScreen = SettingsScreen;
})();
