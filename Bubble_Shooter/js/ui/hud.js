(function (BS) {
  BS.UI.HUD = {
    init: function () {
      this.score = document.getElementById("hud-score");
      this.highScore = document.getElementById("hud-high-score");
      this.nextBubble = document.getElementById("hud-next-bubble");
      this.btnPause = document.getElementById("btn-pause");
      this.resultKicker = document.getElementById("result-kicker");
      this.resultTitle = document.getElementById("result-title");
      this.resultScore = document.getElementById("result-score");

      this.btnPause.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.pauseGame();
      });

      document.getElementById("btn-resume").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.resumeGame();
      });

      document.getElementById("btn-pause-restart").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.newGame();
      });

      document.getElementById("btn-pause-menu").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.backToMenu(true);
      });

      document.getElementById("btn-result-restart").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.newGame();
      });

      document.getElementById("btn-result-menu").addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.backToMenu(false);
      });
    },

    update: function (state) {
      if (!state) {
        return;
      }

      this.score.textContent = BS.Utils.formatScore(state.score);
      this.highScore.textContent = BS.Utils.formatScore(BS.Storage.getHighScore());
      this.nextBubble.style.backgroundColor = BS.Game.getBubbleColor(state.shooter.nextColor);
    },

    showResult: function (state) {
      var won = state.result === "win";
      this.resultKicker.textContent = won ? "Victory" : "Game Over";
      this.resultTitle.textContent = won ? "過關" : "遊戲結束";
      this.resultScore.textContent = BS.Utils.formatScore(state.score);
    }
  };
})(window.BubbleShooter);
