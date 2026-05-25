window.GoGame = window.GoGame || {};

GoGame.Router = {
  show(name) {
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.add("hidden"));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.remove("hidden");

    GoGame.State.patch({ screen: name });

    if (name === "menu") {
      GoGame.MenuUI.render();
      GoGame.AudioManager.playBGM("menu");
    }
    if (name === "settings") {
      GoGame.SettingsUI.render();
      GoGame.AudioManager.playBGM("menu");
    }
    if (name === "tutorial") {
      GoGame.TutorialUI.render();
      GoGame.AudioManager.playBGM("menu");
    }
    if (name === "game") {
      GoGame.GameUI.render();
      GoGame.AudioManager.playBGM("game");
    }
    if (name === "result") {
      this.result();
      GoGame.AudioManager.playBGM("result");
    }
  },

  result() {
    const game = GoGame.State.get().game;
    const result = game?.result;
    if (!game || !result) return;

    const winner = GoGame.I18N.stone(result.winner);
    const summary = result.resign
      ? `${winner}勝，對手認輸`
      : `${winner}勝 ${result.margin.toFixed(1)} 目`;

    document.getElementById("screen-result").innerHTML = `
      <div class="screen-title">
        <div>
          <h2>終局</h2>
          <p>${summary}</p>
        </div>
      </div>
      <div class="route-body">
        <div class="score-card panel">
          <div class="score-row"><span>黑棋</span><strong>${result.black?.toFixed ? result.black.toFixed(1) : "-"}</strong></div>
          <div class="score-row"><span>白棋</span><strong>${result.white?.toFixed ? result.white.toFixed(1) : "-"}</strong></div>
          <div class="score-row"><span>總手數</span><strong>${game.moveNumber}</strong></div>
          <div class="score-row"><span>AI</span><strong>${GoGame.I18N.difficulty(game.settings.difficulty)}</strong></div>
          <div class="toolbar">
            <button class="btn btn-primary" data-new>再來一局</button>
            <button class="btn" data-route="menu">主選單</button>
            <button class="btn" data-route="game">返回棋盤</button>
          </div>
        </div>
      </div>`;

    document.querySelector("[data-new]").onclick = () => GoGame.GameUI.newGame();
    document.querySelectorAll("#screen-result [data-route]").forEach((button) => {
      button.onclick = () => GoGame.Router.show(button.dataset.route);
    });
  },
};
