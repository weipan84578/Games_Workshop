window.VP = window.VP || {};

VP.MainMenu = (function () {
  function updateContinueState() {
    var continueButton = VP.dom.$("#continue-game-btn");
    var hint = VP.dom.$("#save-hint");
    var save = VP.SaveManager.load();
    if (!continueButton || !hint) {
      return;
    }
    continueButton.disabled = !save;
    if (save) {
      hint.textContent = VP.i18n.t("menu.saveReady", { time: VP.TimeUtils.formatClock(save.lastSavedAt) });
    } else {
      hint.textContent = VP.i18n.t("menu.noSave");
    }
  }

  function startGame() {
    if (VP.SaveManager.hasSave()) {
      VP.App.confirm({
        title: VP.i18n.t("menu.confirmNewTitle"),
        message: VP.i18n.t("menu.confirmNew"),
        onConfirm: function () {
          VP.App.startNewGame();
        }
      });
      return;
    }
    VP.App.startNewGame();
  }

  function init() {
    VP.dom.on(VP.dom.$("#start-game-btn"), "click", startGame);
    VP.dom.on(VP.dom.$("#continue-game-btn"), "click", function () {
      VP.App.continueGame();
    });
    VP.EventBus.on("save:updated", updateContinueState);
    VP.EventBus.on("i18n:changed", updateContinueState);
    updateContinueState();
  }

  return {
    init: init,
    updateContinueState: updateContinueState
  };
})();
