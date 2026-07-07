(function initRenderMenu(global) {
  const CF = global.CF || (global.CF = {});
  const { THEMES, LANGUAGES, DIFFICULTIES } = CF.constants;

  function icon(name) {
    return `<img class="icon-img" src="assets/icons/${name}" alt="">`;
  }

  function renderLogo() {
    return `<span class="logo-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>`;
  }

  function renderMainMenu(hasSave) {
    const t = CF.i18n.t;
    return `
      <main class="screen menu-screen" data-screen="menu">
        <section class="menu-panel">
          <div class="menu-title">
            ${renderLogo()}
            <h1>${t("app.title")}</h1>
            <p class="muted">${t("app.subtitle")}</p>
          </div>
          <div class="menu-actions">
            <button class="button" type="button" data-action="start-flow">${icon("icon-play.svg")}${t("menu.start")}</button>
            <button class="button secondary" type="button" data-action="continue" ${hasSave ? "" : "disabled"}>${icon("icon-continue.svg")}${t("menu.continue")}</button>
            <button class="button secondary" type="button" data-action="howto">${icon("icon-howto.svg")}${t("menu.howto")}</button>
            <button class="button secondary" type="button" data-action="settings">${icon("icon-settings.svg")}${t("menu.settings")}</button>
          </div>
          ${hasSave ? "" : `<p class="muted">${t("menu.noSave")}</p>`}
        </section>
      </main>
    `;
  }

  function renderSetup(setup) {
    const t = CF.i18n.t;
    const difficultyButtons = Object.entries(DIFFICULTIES).map(([id, item]) => `
      <button class="button choice-button" type="button" data-action="select-difficulty" data-difficulty="${id}" aria-pressed="${setup.difficulty === id}">
        ${icon(`icon-ai-${id}.svg`)}
        <span><strong>${t(item.key)}</strong><br><small>${t(item.descKey)}</small></span>
      </button>
    `).join("");

    return `
      <main class="screen" data-screen="setup">
        <section class="setup-panel">
          <div class="top-bar">
            <h1>${t("setup.title")}</h1>
            <button class="button ghost" type="button" data-action="menu">${t("common.back")}</button>
          </div>
          <h2>${t("setup.mode")}</h2>
          <div class="segmented">
            <button class="button choice-button" type="button" data-action="select-mode" data-mode="ai" aria-pressed="${setup.mode === "ai"}">${t("setup.modeAi")}</button>
            <button class="button choice-button" type="button" data-action="select-mode" data-mode="human" aria-pressed="${setup.mode === "human"}">${t("setup.modeHuman")}</button>
          </div>
          <h2>${t("setup.difficulty")}</h2>
          <div class="segmented">${difficultyButtons}</div>
          <button class="button" type="button" data-action="start-game">${icon("icon-play.svg")}${t("setup.start")}</button>
        </section>
      </main>
    `;
  }

  function renderHowTo() {
    const t = CF.i18n.t;
    const mini = (marks) => {
      const cells = Array.from({ length: 16 }, (_, index) => `<span class="mini-cell ${marks.includes(index) ? "mark" : ""}"></span>`).join("");
      return `<div class="mini-board" aria-hidden="true">${cells}</div>`;
    };

    return `
      <main class="screen" data-screen="howto">
        <section class="content-panel">
          <div class="top-bar">
            <h1>${t("howto.title")}</h1>
            <button class="button ghost" type="button" data-action="menu">${t("common.back")}</button>
          </div>
          <div class="howto-grid">
            <article class="howto-card">
              <h2>${t("howto.goalTitle")}</h2>
              <p>${t("howto.goalBody")}</p>
              <div class="diagram-row">${mini([12,13,14,15])}${mini([0,4,8,12])}${mini([0,5,10,15])}${mini([3,6,9,12])}</div>
            </article>
            <article class="howto-card"><h2>${t("howto.controlsTitle")}</h2><p>${t("howto.controlsBody")}</p></article>
            <article class="howto-card"><h2>${t("howto.aiTitle")}</h2><p>${t("howto.aiBody")}</p></article>
            <article class="howto-card"><h2>${t("howto.interfaceTitle")}</h2><p>${t("howto.interfaceBody")}</p></article>
            <article class="howto-card"><h2>${t("howto.faqTitle")}</h2><p>${t("howto.faqBody")}</p></article>
          </div>
        </section>
      </main>
    `;
  }

  function renderSettings(settings) {
    const t = CF.i18n.t;
    const languageButtons = LANGUAGES.map((language) => `
      <button class="button choice-button" type="button" data-action="set-language" data-language="${language.id}" aria-pressed="${settings.language === language.id}">
        ${t(language.key)}
      </button>
    `).join("");

    const themeButtons = THEMES.map((theme) => `
      <button class="theme-option" type="button" data-action="set-theme" data-theme="${theme.id}" aria-pressed="${settings.theme === theme.id}">
        <strong>${t(theme.key)}</strong>
        <span class="swatches">${theme.swatches.map((color) => `<span style="background:${color}"></span>`).join("")}</span>
      </button>
    `).join("");

    const difficultyButtons = Object.entries(DIFFICULTIES).map(([id, item]) => `
      <button class="button choice-button" type="button" data-action="set-default-difficulty" data-difficulty="${id}" aria-pressed="${settings.aiDifficulty === id}">
        ${icon(`icon-ai-${id}.svg`)}${t(item.key)}
      </button>
    `).join("");

    const toggle = (key, label, inverted) => {
      const enabled = inverted ? !settings[key] : Boolean(settings[key]);
      return `
      <button class="button secondary toggle" type="button" data-action="toggle-setting" data-setting="${key}" aria-pressed="${enabled}">
        <span>${label}</span><strong>${enabled ? t("common.on") : t("common.off")}</strong>
      </button>
    `;
    };

    return `
      <main class="screen" data-screen="settings">
        <section class="content-panel">
          <div class="top-bar">
            <h1>${t("settings.title")}</h1>
            <button class="button ghost" type="button" data-action="menu">${t("common.back")}</button>
          </div>
          <div class="settings-list">
            <div class="setting-row"><h2>${t("settings.language")}</h2><div class="setting-control segmented">${languageButtons}</div></div>
            <div class="setting-row"><h2>${t("settings.theme")}</h2><div class="theme-grid">${themeButtons}</div></div>
            <div class="setting-row"><h2>${t("settings.bgm")}</h2><div class="setting-control"><input class="range-control" type="range" min="0" max="2" step="0.05" value="${settings.bgmVolume}" data-action="range-setting" data-setting="bgmVolume"><strong>${CF.helpers.formatPercent(settings.bgmVolume)}</strong>${toggle("bgmMuted", t("game.music"), true)}</div></div>
            <div class="setting-row"><h2>${t("settings.sfx")}</h2><div class="setting-control"><input class="range-control" type="range" min="0" max="1" step="0.05" value="${settings.sfxVolume}" data-action="range-setting" data-setting="sfxVolume"><strong>${CF.helpers.formatPercent(settings.sfxVolume)}</strong>${toggle("sfxMuted", t("game.sound"), true)}</div></div>
            <div class="setting-row"><h2>${t("settings.bgmBoost")}</h2><div class="setting-control"><input class="range-control" type="range" min="0.7" max="2" step="0.05" value="${settings.bgmBoost}" data-action="range-setting" data-setting="bgmBoost"><strong>${settings.bgmBoost.toFixed(2)}x</strong><span class="muted">${t("settings.volumeWarn")}</span></div></div>
            <div class="setting-row"><h2>${t("settings.defaultDifficulty")}</h2><div class="setting-control segmented">${difficultyButtons}</div></div>
            <div class="setting-row"><h2>${t("settings.randomBgm")}</h2><div class="setting-control">${toggle("randomBgm", t("settings.randomBgm"))}</div></div>
            <div class="setting-row"><h2>${t("settings.vibration")}</h2><div class="setting-control">${toggle("vibration", t("settings.vibration"))}</div></div>
            <div class="setting-row"><h2>${t("settings.animations")}</h2><div class="setting-control">${toggle("animations", t("settings.animations"))}</div></div>
          </div>
          <button class="button danger" type="button" data-action="reset-settings">${t("settings.reset")}</button>
        </section>
      </main>
    `;
  }

  CF.renderMenu = { renderMainMenu, renderSetup, renderHowTo, renderSettings };
})(window);
