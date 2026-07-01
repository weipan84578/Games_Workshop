(function (ns) {
  "use strict";

  var lastOutcome = null;
  var lastMessageIndex = -1;

  function pickResultMessage(outcome, fallbackKey) {
    var messages = ns.I18n.t("game.resultMessages." + outcome);
    if (!Array.isArray(messages) || messages.length === 0) {
      return ns.I18n.t(fallbackKey);
    }
    var index = Math.floor(Math.random() * messages.length);
    if (messages.length > 1 && outcome === lastOutcome && index === lastMessageIndex) {
      index = (index + 1) % messages.length;
    }
    lastOutcome = outcome;
    lastMessageIndex = index;
    return messages[index];
  }

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
      var outcome = player > ai ? "win" : player < ai ? "lose" : "draw";
      var icon = player > ai ? "🏆" : player < ai ? "◆" : "◇";
      var sfx = player > ai ? "victory" : player < ai ? "defeat" : "draw";
      var modal = document.getElementById("result-modal");
      modal.dataset.dismissible = "false";
      document.getElementById("result-icon").textContent = icon;
      document.getElementById("result-title").textContent = ns.I18n.t(titleKey);
      document.getElementById("result-message").textContent = pickResultMessage(outcome, titleKey);
      document.getElementById("result-player-score").textContent = player;
      document.getElementById("result-ai-score").textContent = ai;
      ns.AudioManager.playSfx(sfx);
      ns.openModal("result-modal");
    }
  };
})(window.DAB = window.DAB || {});
