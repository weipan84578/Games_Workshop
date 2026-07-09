(function registerMainMenu(app) {
  "use strict";

  function t(key, params) {
    return app.I18n.t(key, params);
  }

  async function prepareAudioStart() {
    await app.AudioManager.unlock();
    const flags = app.Storage.getFlags();
    if (!flags.volumeWarningShown) {
      await app.ScreenManager.confirm({
        titleKey: "audio_warning_title",
        bodyKey: "audio_warning_body",
        confirmKey: "action_ok",
        cancelKey: null
      });
      app.Storage.setFlag("volumeWarningShown", true);
    }
  }

  app.MainMenu = {
    render() {
      const root = document.getElementById("screen-main-menu");
      const hasProgress = app.Storage.hasProgress();
      root.innerHTML = `
        <div class="main-menu-frame">
          <div class="main-menu-content">
            <span class="sparkle menu-sparkle-a" aria-hidden="true"></span>
            <span class="sparkle menu-sparkle-b" aria-hidden="true"></span>
            <header class="game-logo">
              <div class="logo-mascot" aria-hidden="true"><span class="mascot-mouth"></span></div>
              <h1>${t("app_title")}</h1>
              <p>${t("app_kicker")}</p>
            </header>
            <nav class="menu-actions" aria-label="${t("app_title")}">
              <button class="btn" type="button" data-menu="start"><span class="icon" aria-hidden="true">▶</span><span>${t("menu_start")}</span></button>
              <button class="btn btn-secondary" type="button" data-menu="continue" ${hasProgress ? "" : "disabled"}><span class="icon" aria-hidden="true">⏯</span><span>${t("menu_continue")}</span></button>
              <button class="btn btn-secondary" type="button" data-menu="howto"><span class="icon" aria-hidden="true">📖</span><span>${t("menu_howto")}</span></button>
              <button class="btn btn-secondary" type="button" data-menu="settings"><span class="icon" aria-hidden="true">⚙</span><span>${t("menu_settings")}</span></button>
            </nav>
            <p class="menu-note">${hasProgress ? "" : t("menu_no_save")}</p>
          </div>
        </div>
      `;
      root.querySelector("[data-menu='start']").addEventListener("click", async () => {
        app.AudioManager.playSfx("button");
        await prepareAudioStart();
        if (app.Storage.hasProgress()) {
          const ok = await app.ScreenManager.confirm({
            titleKey: "confirm_new_title",
            bodyKey: "confirm_new_body",
            confirmKey: "action_confirm",
            cancelKey: "action_cancel"
          });
          if (!ok) {
            return;
          }
        }
        app.Storage.clearProgress();
        app.GameLoop.startNew(1);
      });
      root.querySelector("[data-menu='continue']").addEventListener("click", async () => {
        const progress = app.Storage.getProgress();
        if (!progress) {
          return;
        }
        app.AudioManager.playSfx("button");
        await prepareAudioStart();
        app.GameLoop.continueFrom(progress);
      });
      root.querySelector("[data-menu='howto']").addEventListener("click", () => {
        app.AudioManager.playSfx("button");
        app.HowToPage.render();
        app.ScreenManager.show("howto");
      });
      root.querySelector("[data-menu='settings']").addEventListener("click", () => {
        app.AudioManager.playSfx("button");
        app.SettingsPage.render();
        app.ScreenManager.show("settings");
      });
    }
  };

  app.EventBus.on("i18n:changed", () => {
    if (app.State.get().screen === "main-menu") {
      app.MainMenu.render();
    }
  });
})(window.Takoyaki = window.Takoyaki || {});
