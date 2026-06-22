(function () {
  const MainMenu = {
    render(container) {
      const root = container || Helpers.qs("#screen-main-menu");
      const settings = UnoStorage.getSettings();
      const hasSave = UnoStorage.hasSave();
      root.className = "screen main-menu-screen";
      root.innerHTML = `
        <div class="floating-layer" aria-hidden="true">
          ${CardRenderer.renderBack({ className: "floating-card" })}
          ${CardRenderer.renderCard({ type: "number", color: "yellow", value: 7, id: "float_y7" }, { className: "floating-card" })}
          ${CardRenderer.renderCard({ type: "action", color: "blue", value: "reverse", id: "float_br" }, { className: "floating-card" })}
          ${CardRenderer.renderCard({ type: "wild", color: null, value: "wild", id: "float_w" }, { className: "floating-card" })}
        </div>
        <section class="menu-panel">
          <div class="text-center">
            <h1 class="uno-logo" aria-label="UNO"><span>U</span><span>N</span><span>O</span></h1>
            <p class="menu-subtitle">${I18n.t("menu.subtitle")}</p>
          </div>
          <div class="menu-buttons">
            <button class="btn btn-primary btn-menu" type="button" data-action="start">🎮 ${I18n.t("menu.startGame")}</button>
            <button class="btn btn-menu" type="button" data-action="continue" ${hasSave ? "" : "disabled"}>▶ ${I18n.t("menu.continueGame")}</button>
            <button class="btn btn-menu" type="button" data-action="help">? ${I18n.t("menu.help")}</button>
            <button class="btn btn-menu" type="button" data-action="settings">⚙ ${I18n.t("menu.settings")}</button>
          </div>
          <div class="menu-languages" aria-label="${I18n.t("menu.language")}">
            <span class="muted">${I18n.t("menu.language")}</span>
            ${Object.keys(I18n.translations)
              .map((lang) => `<button class="btn btn-tag ${settings.lang === lang ? "is-active" : ""}" type="button" data-lang="${lang}">${I18n.getLanguageName(lang)}</button>`)
              .join("")}
          </div>
        </section>
      `;

      root.onclick = async (event) => {
        const action = event.target.closest("[data-action]")?.dataset.action;
        const lang = event.target.closest("[data-lang]")?.dataset.lang;
        if (lang) {
          I18n.setLang(lang);
          App.renderCurrent();
          return;
        }
        if (!action) return;
        if (action === "start") {
          const difficulty = await Modal.chooseDifficulty(settings.difficulty);
          if (difficulty) App.startNewGame(difficulty);
        }
        if (action === "continue") {
          if (!hasSave) {
            Toast.show(I18n.t("menu.noSave"), "warning");
            return;
          }
          App.continueGame();
        }
        if (action === "help") App.showScreen("help");
        if (action === "settings") App.showScreen("settings");
      };
    },
  };

  window.MainMenu = MainMenu;
})();
