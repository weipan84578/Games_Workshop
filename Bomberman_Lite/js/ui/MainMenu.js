(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  class MainMenu {
    constructor(game) {
      this.game = game;
      this.host = document.getElementById("screen-menu");
    }

    render() {
      const save = root.SaveManager.getGame();
      const scores = root.SaveManager.getScores();
      this.host.innerHTML = `
        <div class="screen-shell">
          <div class="panel menu-card">
            <h1 class="game-title">BOMBERMAN LITE<span>炸彈超人</span></h1>
            <div class="title-rule"></div>
            <div class="menu-actions">
              <button class="btn-primary" data-action="new">▶ 開始遊戲</button>
              <button class="btn-secondary" data-action="continue" ${save ? "" : "disabled title='尚無存檔記錄'"}>↺ 繼續遊戲</button>
              <button class="btn-secondary" data-action="levels">▦ 關卡選擇</button>
              <button class="btn-secondary" data-action="howto">? 說明</button>
              <button class="btn-secondary" data-action="settings">⚙ 設定</button>
            </div>
            <div class="menu-stats">
              <span>Best Score: ${H.formatScore(scores.bestScore)}</span>
              <span>Stage: ${scores.bestStage}/25</span>
              ${save ? `<span>Save: Stage ${save.stage}</span>` : ""}
            </div>
          </div>
        </div>
      `;
      this.bind();
    }

    bind() {
      this.host.querySelector("[data-action='new']").addEventListener("click", () => this.game.requestNewGame());
      const continueButton = this.host.querySelector("[data-action='continue']");
      if (!continueButton.disabled) continueButton.addEventListener("click", () => this.game.continueGame());
      this.host.querySelector("[data-action='levels']").addEventListener("click", () => root.LevelSelect.open(this.game));
      this.host.querySelector("[data-action='howto']").addEventListener("click", () => this.game.modal.howTo());
      this.host.querySelector("[data-action='settings']").addEventListener("click", () => root.Settings.open(this.game));
    }
  }

  root.MainMenu = MainMenu;
}());
