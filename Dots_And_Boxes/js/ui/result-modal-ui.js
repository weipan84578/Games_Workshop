(function (ns) {
  "use strict";

  ns.ResultModalUI = {
    init: function () {
      document.getElementById("play-again-button").addEventListener("click", function () {
        ns.closeModal("result-modal");
        ns.GameUI.playAgain();
      });
      document.getElementById("result-menu-button").addEventListener("click", function () {
        ns.closeModal("result-modal");
        ns.MainMenuUI.refresh();
        ns.Router.show("menu");
      });
    },

    show: function (model) {
      var player = model.scores.player;
      var ai = model.scores.ai;
      var titleKey = player > ai ? "game.win" : player < ai ? "game.lose" : "game.draw";
      var icon = player > ai ? "🏆" : player < ai ? "◆" : "◇";
      var sfx = player > ai ? "victory" : player < ai ? "defeat" : "draw";
      document.getElementById("result-icon").textContent = icon;
      document.getElementById("result-title").textContent = ns.I18n.t(titleKey);
      document.getElementById("result-message").textContent = ns.I18n.t(titleKey);
      document.getElementById("result-player-score").textContent = player;
      document.getElementById("result-ai-score").textContent = ai;
      ns.AudioManager.playSfx(sfx);
      ns.openModal("result-modal");
    }
  };
})(window.DAB = window.DAB || {});
