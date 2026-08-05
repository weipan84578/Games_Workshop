import { createInitialGameState } from "../utils/constants.js";
import { hasSavedProgress, loadProgress, loadSettings, saveSettings, SAVE_KEY } from "../utils/storage.js";
import { announce } from "../utils/helpers.js";

export function createMainMenu({ section, i18n, storage, audio, onStart, onContinue, onNavigate } = {}) {
  let isMounted = false;

  function render() {
    const t = i18n.t;
    const loadedProgress = loadProgress(storage);
    const hasProgress = hasSavedProgress(storage);
    let hasInvalidProgress = false;
    try {
      hasInvalidProgress = Boolean(storage?.getItem?.(SAVE_KEY)) && loadedProgress === null;
    } catch {
      hasInvalidProgress = false;
    }
    section.innerHTML = `
      <div class="main-menu-shell">
        <div class="quick-language">
          <img src="assets/images/icons/icon-language.svg" alt="" aria-hidden="true" />
          <select id="quick-language" data-i18n-aria-label="quick_language">
            <option value="zh" data-i18n="lang_zh"></option>
            <option value="en" data-i18n="lang_en"></option>
            <option value="ja" data-i18n="lang_ja"></option>
          </select>
        </div>
        <div class="mascot-stage" aria-hidden="true">
          <img class="mascot-bobo" src="assets/images/characters/mascot-bobo.svg" alt="" />
          <img class="mascot-pingping" src="assets/images/characters/mascot-pingping.svg" alt="" />
        </div>
        <div class="menu-content">
          <div class="game-logo">
            <span class="game-logo__eyebrow" data-i18n="logo_eyebrow"></span>
            <h1 id="main-menu-title" class="game-logo__title" data-i18n="logo_title"></h1>
          </div>
          <p class="welcome-copy" data-i18n="welcome"></p>
          <div class="menu-actions">
            <button class="cute-button cute-button--large" id="menu-start" type="button">
              <img class="button-icon" src="assets/images/icons/icon-start.svg" alt="" aria-hidden="true" />
              <span data-i18n="menu_start"></span>
            </button>
            <button class="cute-button cute-button--secondary cute-button--large" id="menu-continue" type="button" ${hasProgress ? "" : "disabled"} ${hasProgress ? "" : "data-i18n-title=\"no_progress\""}>
              <img class="button-icon" src="assets/images/icons/icon-continue.svg" alt="" aria-hidden="true" />
              <span data-i18n="menu_continue"></span>
            </button>
            <p class="continue-hint" id="continue-hint"></p>
            <button class="cute-button cute-button--soft cute-button--large" id="menu-instructions" type="button">
              <img class="button-icon" src="assets/images/icons/icon-instructions.svg" alt="" aria-hidden="true" />
              <span data-i18n="menu_instructions"></span>
            </button>
            <button class="cute-button cute-button--soft cute-button--large" id="menu-settings" type="button">
              <img class="button-icon" src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" />
              <span data-i18n="menu_settings"></span>
            </button>
          </div>
        </div>
      </div>`;

    i18n.applyTranslations(section);
    const languageSelect = section.querySelector("#quick-language");
    languageSelect.value = i18n.getLanguage();
    section.querySelector("#continue-hint").textContent = hasProgress ? "" : t(hasInvalidProgress ? "save_invalid" : "no_progress");

    section.querySelector("#menu-start").addEventListener("click", () => {
      audio?.playSfx("button");
      audio?.playBgm();
      const settings = loadSettings(storage);
      onStart?.(createInitialGameState({ ...settings, language: i18n.getLanguage() }));
    });
    section.querySelector("#menu-continue").addEventListener("click", () => {
      if (!hasProgress) return;
      audio?.playSfx("button");
      onContinue?.(loadProgress(storage));
    });
    section.querySelector("#menu-instructions").addEventListener("click", () => {
      audio?.playSfx("button");
      onNavigate?.("instructions");
    });
    section.querySelector("#menu-settings").addEventListener("click", () => {
      audio?.playSfx("button");
      onNavigate?.("settings", { returnTo: "main-menu" });
    });
    languageSelect.addEventListener("change", (event) => {
      i18n.setLanguage(event.target.value);
      saveSettings({ ...loadSettings(storage), language: event.target.value }, storage);
      announce(t("settings_saved"));
    });
    isMounted = true;
  }

  return {
    mount() {
      render();
      return isMounted;
    },
    refresh: render,
  };
}
