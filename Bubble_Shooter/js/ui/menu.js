(function (BS) {
  BS.UI.Menu = {
    init: function () {
      this.btnNew = document.getElementById("btn-new-game");
      this.btnContinue = document.getElementById("btn-continue");
      this.btnInstructions = document.getElementById("btn-instructions");
      this.btnSettings = document.getElementById("btn-settings");
      this.highScore = document.getElementById("menu-high-score");

      this.btnNew.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.newGame();
      });

      this.btnContinue.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.App.continueGame();
      });

      this.btnInstructions.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.UI.Screens.show("instructions");
      });

      this.btnSettings.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.UI.Screens.show("settings");
      });

      this.refresh();
    },

    refresh: function () {
      if (this.highScore) {
        this.highScore.textContent = BS.Utils.formatScore(BS.Storage.getHighScore());
      }
      if (this.btnContinue) {
        this.btnContinue.disabled = !BS.Storage.hasSavedGame();
      }
    }
  };
})(window.BubbleShooter);
