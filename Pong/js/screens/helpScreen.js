(function () {
  const HelpScreen = {
    render() {
      const t = Pong.I18n.t;
      const app = Pong.DOM.setApp(`
        <main class="screen screen-scroll help-screen">
          <div class="screen-inner">
            <h1 class="subtitle">${t("help.title")}</h1>
            <section class="content-panel help-grid body-copy">
              <div class="help-section">
                <h3>${t("help.controlsTitle")}</h3>
                <p>${t("help.controlsBody")}</p>
              </div>
              <div class="help-section">
                <h3>${t("help.rulesTitle")}</h3>
                <p>${t("help.rulesBody")}</p>
              </div>
              <div class="help-section">
                <h3>${t("help.difficultyTitle")}</h3>
                <p>${t("help.difficultyBody")}</p>
              </div>
              <div class="help-section">
                <h3>${t("help.shortcutsTitle")}</h3>
                <p>${t("help.shortcutsBody")}</p>
              </div>
              <div class="grid-2">
                ${Pong.DOM.button(t("help.back"), { action: "back" })}
                ${Pong.DOM.button(t("help.start"), { action: "start" })}
              </div>
            </section>
          </div>
        </main>
      `);

      Pong.Audio.playMusic("menu_theme");
      Pong.DOM.bindClicks(app, {
        back: () => {
          Pong.Audio.playSfx("menu_close");
          Pong.ScreenManager.show("mainMenu");
        },
        start: () => {
          Pong.ScreenManager.show("mainMenu");
          Pong.MainMenu.openDifficulty();
        }
      });
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.HelpScreen = HelpScreen;
})();
