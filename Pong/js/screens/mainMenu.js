(function () {
  const MainMenu = {
    render() {
      const settings = Pong.GameState.settings || Pong.Storage.loadSettings();
      const hasSave = Pong.Storage.hasSave();
      const app = Pong.DOM.setApp(`
        <main class="screen main-menu">
          <div class="center-stack">
            <h1 class="title">PONG</h1>
            <p class="main-subtitle">Player vs AI</p>
            <div class="button-stack" role="group" aria-label="主選單">
              ${Pong.DOM.button("開始遊戲", { action: "openDifficulty" })}
              ${Pong.DOM.button("繼續遊戲", { action: "continueGame", disabled: !hasSave })}
              ${Pong.DOM.button("說明", { action: "help" })}
              ${Pong.DOM.button("設定", { action: "settings" })}
            </div>
            <div class="theme-dots" aria-label="主題切換">
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
      const modal = document.createElement("div");
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <section class="panel" role="dialog" aria-modal="true" aria-labelledby="difficulty-title">
          <h2 class="panel-title" id="difficulty-title">選擇難度</h2>
          <div class="difficulty-grid">
            ${Pong.DOM.button("簡單", { action: "easy" })}
            ${Pong.DOM.button("普通", { action: "normal" })}
            ${Pong.DOM.button("困難", { action: "hard" })}
          </div>
          <div class="button-stack" style="margin:24px auto 0;">
            ${Pong.DOM.button("取消", { action: "cancel" })}
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
