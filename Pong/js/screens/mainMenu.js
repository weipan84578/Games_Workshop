(function () {
  const MainMenu = {
    render() {
      const settings = Pong.GameState.settings || Pong.Storage.loadSettings();
      const hasSave = Pong.Storage.hasSave();
      const t = Pong.I18n.t;
      const app = Pong.DOM.setApp(`
        <main class="screen main-menu">
          <div class="center-stack">
            <h1 class="title">PONG</h1>
            <p class="main-subtitle">${t("app.subtitle")}</p>
            <div class="button-stack" role="group" aria-label="${t("aria.mainMenu")}">
              ${Pong.DOM.button(t("menu.start"), { action: "openDifficulty" })}
              ${Pong.DOM.button(t("menu.continueGame"), { action: "continueGame", disabled: !hasSave })}
              ${Pong.DOM.button(t("menu.help"), { action: "help" })}
              ${Pong.DOM.button(t("menu.settings"), { action: "settings" })}
            </div>
            <div class="theme-dots" aria-label="${t("aria.themeSwitch")}">
              ${Pong.DOM.themeDots(settings.theme)}
            </div>
          </div>
        </main>
      `);

      Pong.Audio.playMusic("menu_theme");
      Pong.DOM.bindClicks(app, {
        openDifficulty: MainMenu.openDifficulty,
        continueGame: () => Pong.Game.continueSaved(),
        help: () => {
          Pong.Audio.playSfx("menu_open");
          Pong.ScreenManager.show("helpScreen");
        },
        settings: () => {
          Pong.Audio.playSfx("menu_open");
          Pong.ScreenManager.show("settingsScreen");
        }
      });

      Pong.DOM.qsa("[data-theme-id]", app).forEach((button) => {
        button.addEventListener("click", () => {
          const theme = button.getAttribute("data-theme-id");
          Pong.Storage.saveSettings(Object.assign({}, Pong.GameState.settings, { theme }));
          Pong.Effects.scoreFlash();
          MainMenu.render();
        });
      });
    },

    openDifficulty() {
      const app = Pong.DOM.app();
      const t = Pong.I18n.t;
      const modal = document.createElement("div");
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <section class="panel" role="dialog" aria-modal="true" aria-labelledby="difficulty-title">
          <h2 class="panel-title" id="difficulty-title">${t("menu.difficultyTitle")}</h2>
          <div class="difficulty-grid">
            ${Pong.DOM.button(t("difficulty.easy"), { action: "easy" })}
            ${Pong.DOM.button(t("difficulty.normal"), { action: "normal" })}
            ${Pong.DOM.button(t("difficulty.hard"), { action: "hard" })}
          </div>
          <div class="button-stack" style="margin:24px auto 0;">
            ${Pong.DOM.button(t("menu.cancel"), { action: "cancel" })}
          </div>
        </section>
      `;
      app.appendChild(modal);
      Pong.Audio.playSfx("menu_open");

      Pong.DOM.bindClicks(modal, {
        easy: () => Pong.Game.startNew("easy"),
        normal: () => Pong.Game.startNew("normal"),
        hard: () => Pong.Game.startNew("hard"),
        cancel: () => {
          Pong.Audio.playSfx("menu_close");
          modal.remove();
        }
      });
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.MainMenu = MainMenu;
})();
