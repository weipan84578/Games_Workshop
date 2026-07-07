const app = document.getElementById("app");
const CF = window.CF;

let screen = "menu";
let settings = CF.settingsManager.getSettings();
let setup = { mode: "ai", difficulty: settings.aiDifficulty };
let currentGame = null;
let aiThinking = false;
let aiToken = 0;
let resultShownFor = null;

function refreshSettings() {
  settings = CF.settingsManager.getSettings();
  CF.audioManager.applySettings(settings);
}

function render() {
  refreshSettings();

  if (screen === "menu") {
    CF.audioManager.setMode("menu");
    app.innerHTML = CF.renderMenu.renderMainMenu(CF.gameState.hasSave());
  } else if (screen === "setup") {
    CF.audioManager.setMode("menu");
    app.innerHTML = CF.renderMenu.renderSetup(setup);
  } else if (screen === "howto") {
    CF.audioManager.setMode("menu");
    app.innerHTML = CF.renderMenu.renderHowTo();
  } else if (screen === "settings") {
    CF.audioManager.setMode("menu");
    app.innerHTML = CF.renderMenu.renderSettings(settings);
  } else if (screen === "game" && currentGame) {
    CF.audioManager.setMode("game");
    app.innerHTML = CF.renderBoard.renderGameScreen(currentGame, settings, aiThinking);
    maybeShowResult();
  }
}

function goTo(nextScreen) {
  screen = nextScreen;
  render();
}

function startGame() {
  resultShownFor = null;
  CF.gameState.clearSave();
  currentGame = CF.gameState.createGame({ mode: setup.mode, difficulty: setup.difficulty });
  screen = "game";
  CF.audioManager.playSfx("click");
  render();
}

function continueGame() {
  const saved = CF.gameState.loadGame();
  if (!saved) {
    CF.toast.show(CF.i18n.t("toast.noSave"));
    return;
  }
  resultShownFor = null;
  currentGame = saved;
  screen = "game";
  render();
  maybeScheduleAi();
}

function handleDrop(column) {
  if (!currentGame || aiThinking || currentGame.status !== "playing") return;
  if (currentGame.mode === "ai" && currentGame.currentPlayer === CF.constants.PLAYER_TWO) return;

  const result = CF.gameState.applyMove(currentGame, column);
  if (!result.ok) {
    CF.audioManager.playSfx("error");
    CF.toast.show(CF.i18n.t("toast.columnFull"));
    return;
  }

  CF.audioManager.playSfx("drop");
  if (settings.vibration && navigator.vibrate) navigator.vibrate(22);
  render();

  if (currentGame.status === "playing") {
    CF.toast.show(CF.i18n.t("toast.saved"));
    maybeScheduleAi();
  }
}

function maybeScheduleAi() {
  if (!currentGame || currentGame.mode !== "ai" || currentGame.status !== "playing") return;
  if (currentGame.currentPlayer !== CF.constants.PLAYER_TWO) return;

  aiThinking = true;
  const token = ++aiToken;
  render();

  CF.aiController.chooseMove(
    CF.board.cloneBoard(currentGame.board),
    currentGame.difficulty,
    CF.constants.PLAYER_TWO,
    CF.constants.PLAYER_ONE
  ).then((column) => {
    if (token !== aiToken || !currentGame || currentGame.status !== "playing") return;
    aiThinking = false;
    if (column === null || column === undefined) {
      render();
      return;
    }
    const result = CF.gameState.applyMove(currentGame, column);
    if (result.ok) {
      CF.audioManager.playSfx("drop");
      if (settings.vibration && navigator.vibrate) navigator.vibrate(16);
    }
    render();
  }).catch(() => {
    aiThinking = false;
    render();
  });
}

function undoMove() {
  if (!currentGame || aiThinking) return;
  const result = CF.history.undo(currentGame);
  if (!result.ok) {
    CF.audioManager.playSfx("error");
    CF.toast.show(CF.i18n.t("toast.undoUnavailable"));
    return;
  }
  currentGame = result.game;
  resultShownFor = null;
  CF.gameState.persistGame(currentGame);
  CF.audioManager.playSfx("toggle");
  render();
}

function restartGame() {
  if (!currentGame) return;
  const options = { mode: currentGame.mode, difficulty: currentGame.difficulty };
  resultShownFor = null;
  CF.gameState.clearSave();
  currentGame = CF.gameState.createGame(options);
  aiThinking = false;
  aiToken += 1;
  CF.audioManager.playSfx("toggle");
  render();
}

function maybeShowResult() {
  if (!currentGame || currentGame.status !== "finished" || resultShownFor === currentGame.id) return;
  resultShownFor = currentGame.id;
  CF.gameState.recordStats(currentGame);
  CF.gameState.clearSave();

  const isDraw = currentGame.winner === "draw";
  const didLose = currentGame.mode === "ai" && currentGame.winner === CF.constants.PLAYER_TWO;
  const title = isDraw ? CF.i18n.t("result.draw") : didLose ? CF.i18n.t("result.lose") : CF.i18n.t("result.win");
  const detail = isDraw
    ? CF.i18n.t("result.draw")
    : currentGame.mode === "ai" && currentGame.winner === CF.constants.PLAYER_TWO
      ? CF.i18n.t("result.aiWin")
      : CF.i18n.t("result.playerWin", {
        player: CF.i18n.t(CF.gameState.getPlayerLabel(currentGame, currentGame.winner))
      });

  CF.audioManager.playSfx(isDraw ? "draw" : didLose ? "lose" : "win");
  CF.modalController.show({
    title,
    body: `<p>${detail}</p><div class="result-sparkles" aria-hidden="true">✦ ✧ ✦</div>`,
    actions: [
      { label: CF.i18n.t("result.playAgain"), action: "replay" },
      { label: CF.i18n.t("game.home"), action: "menu", className: "secondary" }
    ]
  });
}

function showPauseModal() {
  CF.modalController.show({
    title: CF.i18n.t("pause.title"),
    body: `<p>${CF.i18n.t("howto.interfaceBody")}</p>`,
    actions: [
      { label: CF.i18n.t("pause.resume"), action: "close" },
      { label: CF.i18n.t("menu.howto"), action: "howto", className: "secondary" },
      { label: CF.i18n.t("menu.settings"), action: "settings", className: "secondary" },
      { label: CF.i18n.t("game.home"), action: "menu", className: "danger" }
    ]
  });
}

function updateSetting(patch, rerender = true) {
  settings = CF.settingsManager.updateSettings(patch);
  CF.audioManager.applySettings(settings);
  CF.toast.show(CF.i18n.t("toast.settingsSaved"));
  if (rerender) render();
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;

  CF.audioManager.ensureContext();
  CF.audioManager.startBgm();
  if (!["drop", "range-setting"].includes(action)) CF.audioManager.playSfx("click");

  if (action === "start-flow") goTo("setup");
  if (action === "continue") continueGame();
  if (action === "howto") goTo("howto");
  if (action === "settings") goTo("settings");
  if (action === "menu") {
    aiThinking = false;
    aiToken += 1;
    CF.modalController.hide();
    goTo("menu");
  }
  if (action === "select-mode") {
    setup = { ...setup, mode: target.dataset.mode };
    render();
  }
  if (action === "select-difficulty") {
    setup = { ...setup, difficulty: target.dataset.difficulty };
    render();
  }
  if (action === "start-game") startGame();
  if (action === "drop") handleDrop(Number(target.dataset.column));
  if (action === "undo") undoMove();
  if (action === "restart") restartGame();
  if (action === "pause") showPauseModal();
  if (action === "toggle-bgm") updateSetting({ bgmMuted: !settings.bgmMuted });
  if (action === "toggle-sfx") updateSetting({ sfxMuted: !settings.sfxMuted });
  if (action === "set-language") {
    CF.i18n.setLanguage(target.dataset.language);
    settings = CF.settingsManager.getSettings();
    render();
  }
  if (action === "set-theme") updateSetting({ theme: target.dataset.theme });
  if (action === "set-default-difficulty") updateSetting({ aiDifficulty: target.dataset.difficulty });
  if (action === "toggle-setting") {
    const key = target.dataset.setting;
    updateSetting({ [key]: !settings[key] });
  }
  if (action === "reset-settings") {
    settings = CF.settingsManager.resetSettings();
    CF.i18n.setLanguage(settings.language);
    CF.audioManager.applySettings(settings);
    render();
  }
}

function handleModalAction(target) {
  const action = target.dataset.modalAction;
  if (!action) return;
  CF.audioManager.playSfx("click");
  if (action === "close") CF.modalController.hide();
  if (action === "replay") {
    CF.modalController.hide();
    restartGame();
  }
  if (action === "menu") {
    CF.modalController.hide();
    goTo("menu");
  }
  if (action === "howto") {
    CF.modalController.hide();
    goTo("howto");
  }
  if (action === "settings") {
    CF.modalController.hide();
    goTo("settings");
  }
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button) handleAction(button);
});

app.addEventListener("input", (event) => {
  const control = event.target.closest("[data-action='range-setting']");
  if (!control) return;
  const key = control.dataset.setting;
  const value = Number(control.value);
  settings = CF.settingsManager.updateSettings({ [key]: value });
  CF.audioManager.applySettings(settings);
  render();
});

document.getElementById("modal-root").addEventListener("click", (event) => {
  const button = event.target.closest("[data-modal-action]");
  if (button) handleModalAction(button);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    CF.modalController.hide();
  }
});

CF.responsiveController.init();
render();
