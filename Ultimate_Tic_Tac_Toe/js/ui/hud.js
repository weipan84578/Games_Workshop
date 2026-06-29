(function () {
  "use strict";

  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins + ":" + String(secs).padStart(2, "0");
  }

  function difficultyLabel(value) {
    return window.I18n.t("difficulty." + value);
  }

  function render(state) {
    var hud = document.getElementById("game-hud");
    if (!hud) return;
    var target = state.nextBoard ?
      window.I18n.t("game.boardCoord", { row: state.nextBoard.br + 1, col: state.nextBoard.bc + 1 }) :
      window.I18n.t("game.anyBoard");
    var playerSymbol = state.playerSymbol || "X";
    var aiSymbol = state.aiSymbol || "O";
    var status = state.aiThinking ? window.I18n.t("game.aiThinking") :
      state.currentPlayer === playerSymbol ? window.I18n.t("game.playerTurn") : window.I18n.t("game.aiTurn");

    hud.innerHTML = [
      '<div class="hud-card' + (state.currentPlayer === playerSymbol && !state.aiThinking ? " active" : "") + '">',
      '<span class="hud-label">' + window.I18n.t("game.player") + '</span>',
      '<span class="hud-value"><span class="piece ' + playerSymbol.toLowerCase() + '">' + playerSymbol + '</span></span>',
      '</div>',
      '<div class="hud-card hud-status active">',
      '<span class="hud-label">' + window.I18n.t("game.turn") + '</span>',
      '<span class="hud-value">' + status + ' · ' + window.I18n.t("game.moveCount") + ' ' + state.moveCount + ' · ' + formatTime(window.Game.getElapsedSeconds()) + '</span>',
      '</div>',
      '<div class="hud-card' + (state.currentPlayer === aiSymbol || state.aiThinking ? " active" : "") + '">',
      '<span class="hud-label">' + window.I18n.t("game.ai") + ' · ' + difficultyLabel(state.difficulty) + '</span>',
      '<span class="hud-value"><span class="piece ' + aiSymbol.toLowerCase() + '">' + aiSymbol + '</span> · ' + window.I18n.t("game.target") + ': ' + target + '</span>',
      '</div>'
    ].join("");
  }

  window.HUD = {
    render: render,
    formatTime: formatTime
  };
})();
