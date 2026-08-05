import { DEFAULT_SETTINGS, LANGUAGES, THEMES } from "../utils/constants.js";
import { loadSettings, normalizeSettings, saveSettings } from "../utils/storage.js";
import { formatPercent, announce } from "../utils/helpers.js";

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.body.dataset.theme = theme;
  const themeStyle = document.querySelector("#theme-style");
  if (themeStyle) themeStyle.href = `css/themes/theme-${theme}.css`;
}

export function createSettingsPage({ section, i18n, storage, audio, onBack } = {}) {
  let settings = loadSettings(storage);

  function persist() {
    settings = normalizeSettings(settings);
    saveSettings(settings, storage);
    audio?.setBgmVolume(settings.bgmVolume);
    audio?.setSfxVolume(settings.sfxVolume);
    applyTheme(settings.theme);
    announce(i18n.t("settings_saved"));
  }

  function render() {
    const t = i18n.t;
    settings = normalizeSettings({ ...settings, language: i18n.getLanguage() });
    section.innerHTML = `
      <div class="screen-shell page-shell">
        <header class="page-header">
          <div class="page-header__title">
            <img src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" />
            <h1 id="settings-screen-title" data-i18n="settings_title"></h1>
          </div>
          <button class="cute-button cute-button--soft" id="settings-back" type="button">
            <img class="button-icon" src="assets/images/icons/icon-back.svg" alt="" aria-hidden="true" />
            <span data-i18n="back"></span>
          </button>
        </header>
        <main class="settings-list">
          <section class="setting-card" aria-labelledby="language-setting-title">
            <h2 class="setting-card__heading" id="language-setting-title"><img src="assets/images/icons/icon-language.svg" alt="" aria-hidden="true" /><span data-i18n="language"></span></h2>
            <div class="choice-grid" id="language-choices">
              ${LANGUAGES.map((language) => `<button class="choice-card${settings.language === language ? " is-selected" : ""}" type="button" data-language="${language}"><span data-i18n="lang_${language}"></span></button>`).join("")}
            </div>
          </section>
          <section class="setting-card" aria-labelledby="theme-setting-title">
            <h2 class="setting-card__heading" id="theme-setting-title"><img src="assets/images/icons/icon-theme.svg" alt="" aria-hidden="true" /><span data-i18n="theme"></span></h2>
            <div class="choice-grid choice-grid--themes" id="theme-choices">
              ${THEMES.map((theme) => `<button class="choice-card${settings.theme === theme ? " is-selected" : ""}" type="button" data-theme-choice="${theme}" data-i18n-aria-label="theme_${theme}"><span class="theme-swatch theme-swatch--${theme}" aria-hidden="true"></span><span data-i18n="theme_${theme}"></span></button>`).join("")}
            </div>
          </section>
          <section class="setting-card" aria-labelledby="volume-setting-title">
            <h2 class="setting-card__heading" id="volume-setting-title"><img src="assets/images/icons/icon-volume.svg" alt="" aria-hidden="true" /><span data-i18n="bgm_volume"></span></h2>
            <label class="setting-label" for="bgm-volume"><span data-i18n="bgm_volume"></span><output id="bgm-volume-value">${formatPercent(settings.bgmVolume)}</output></label>
            <input id="bgm-volume" type="range" min="0" max="100" step="1" value="${Math.round(settings.bgmVolume * 100)}" />
            <label class="setting-label" for="sfx-volume"><span data-i18n="sfx_volume"></span><output id="sfx-volume-value">${formatPercent(settings.sfxVolume)}</output></label>
            <input id="sfx-volume" type="range" min="0" max="100" step="1" value="${Math.round(settings.sfxVolume * 100)}" />
          </section>
          <section class="setting-card" aria-labelledby="vibration-setting-title">
            <div class="toggle-row">
              <h2 class="setting-card__heading" id="vibration-setting-title"><img src="assets/images/icons/icon-vibration.svg" alt="" aria-hidden="true" /><span data-i18n="vibration"></span></h2>
              <label class="toggle" for="vibration-toggle">
                <input id="vibration-toggle" type="checkbox" ${settings.vibration ? "checked" : ""} />
                <span class="toggle__track" aria-hidden="true"></span>
                <span class="sr-only" id="vibration-state"></span>
              </label>
            </div>
          </section>
          <section class="setting-card desktop-only" aria-labelledby="control-setting-title">
            <h2 class="setting-card__heading" id="control-setting-title"><img src="assets/images/icons/icon-controls.svg" alt="" aria-hidden="true" /><span data-i18n="control_preference"></span></h2>
            <div class="choice-grid">
              <button class="choice-card${settings.controlPreference === "drag" ? " is-selected" : ""}" type="button" data-control="drag" data-i18n="drag"></button>
              <button class="choice-card${settings.controlPreference === "buttons" ? " is-selected" : ""}" type="button" data-control="buttons" data-i18n="buttons"></button>
            </div>
          </section>
        </main>
        <div class="setting-actions">
          <p class="text-small" data-i18n="settings_saved"></p>
          <button class="cute-button cute-button--soft" id="settings-reset" type="button">
            <img class="button-icon" src="assets/images/icons/icon-reset.svg" alt="" aria-hidden="true" />
            <span data-i18n="reset_defaults"></span>
          </button>
        </div>
      </div>`;

    i18n.applyTranslations(section);
    const vibrationState = section.querySelector("#vibration-state");
    vibrationState.textContent = settings.vibration ? t("enabled") : t("disabled");

    section.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
      settings.language = button.dataset.language;
      i18n.setLanguage(settings.language);
      persist();
    }));
    section.querySelectorAll("[data-theme-choice]").forEach((button) => button.addEventListener("click", () => {
      settings.theme = button.dataset.themeChoice;
      persist();
      render();
    }));
    section.querySelector("#bgm-volume").addEventListener("input", (event) => {
      settings.bgmVolume = Number(event.target.value) / 100;
      section.querySelector("#bgm-volume-value").textContent = formatPercent(settings.bgmVolume);
      persist();
    });
    section.querySelector("#sfx-volume").addEventListener("input", (event) => {
      settings.sfxVolume = Number(event.target.value) / 100;
      section.querySelector("#sfx-volume-value").textContent = formatPercent(settings.sfxVolume);
      persist();
    });
    section.querySelector("#vibration-toggle").addEventListener("change", (event) => {
      settings.vibration = event.target.checked;
      vibrationState.textContent = settings.vibration ? t("enabled") : t("disabled");
      persist();
    });
    section.querySelectorAll("[data-control]").forEach((button) => button.addEventListener("click", () => {
      settings.controlPreference = button.dataset.control;
      persist();
      render();
    }));
    section.querySelector("#settings-reset").addEventListener("click", () => {
      const confirmed = typeof window === "undefined" || window.confirm(t("confirm_reset"));
      if (!confirmed) return;
      settings = { ...DEFAULT_SETTINGS };
      i18n.setLanguage(settings.language);
      persist();
      render();
    });
    section.querySelector("#settings-back").addEventListener("click", () => {
      audio?.playSfx("button");
      onBack?.();
    });
    applyTheme(settings.theme);
  }

  return {
    mount() {
      settings = loadSettings(storage);
      render();
    },
    refresh: render,
    getSettings: () => ({ ...settings }),
  };
}
