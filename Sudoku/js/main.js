(function (global) {
  "use strict";

  function updateGameChrome(state) {
    const difficultyLabel = document.getElementById("difficulty-label");
    const errorDisplay = document.getElementById("error-display");
    const undoButton = document.getElementById("undo-btn");
    const hintButton = document.getElementById("hint-btn");
    const eraseButton = document.getElementById("erase-btn");
    const memoButton = document.getElementById("memo-btn");
    const pauseButton = document.getElementById("pause-btn");

    if (!state) {
      difficultyLabel.textContent = "簡單";
      errorDisplay.textContent = "錯誤 0/3";
      [undoButton, hintButton, eraseButton, memoButton, pauseButton].forEach((button) => {
        button.disabled = true;
      });
      return;
    }

    const limit = global.SettingsState.get().errorLimit;
    difficultyLabel.textContent = state.difficultyLabel;
    errorDisplay.textContent = limit === "none"
      ? `錯誤 ${state.errorCount}`
      : `錯誤 ${state.errorCount}/${limit}`;

    const disabled = state.paused || state.completed || state.gameOver;
    undoButton.disabled = disabled || state.undoHistory.length === 0;
    hintButton.disabled = disabled;
    eraseButton.disabled = disabled;
    memoButton.disabled = disabled;
    pauseButton.disabled = state.completed || state.gameOver;
    pauseButton.textContent = state.paused ? "繼續" : "暫停";
    memoButton.classList.toggle("is-active", state.memoMode);
    memoButton.setAttribute("aria-pressed", state.memoMode ? "true" : "false");
  }

  function bindGameButtons() {
    document.getElementById("undo-btn").addEventListener("click", () => {
      if (!global.GameState.undo()) {
        global.ToastManager.show("沒有可復原的步驟。");
      }
    });

    document.getElementById("hint-btn").addEventListener("click", () => {
      if (!global.GameState.hint()) {
        global.ToastManager.show("目前沒有可提示的格子。");
      }
    });

    document.getElementById("erase-btn").addEventListener("click", () => {
      if (!global.GameState.erase()) {
        global.ToastManager.show("目前格子無法清除。");
      }
    });

    document.getElementById("memo-btn").addEventListener("click", () => {
      global.GameState.toggleMemo();
    });

    document.getElementById("pause-btn").addEventListener("click", () => {
      const state = global.GameState.getState();
      if (!state) {
        return;
      }
      if (state.paused) {
        global.GameState.resume();
      } else {
        global.GameState.pause();
      }
    });
  }

  function openPauseModal() {
    if (global.ModalManager.isOpen()) {
      return;
    }
    global.ModalManager.open({
      title: "遊戲暫停",
      body: "計時器已停止。",
      actions: [
        {
          label: "繼續",
          className: "btn btn-primary",
          onClick: () => global.GameState.resume(),
        },
        {
          label: "回首頁",
          className: "btn btn-secondary",
          onClick: () => {
            global.GameState.save();
            global.ScreenManager.show("home");
          },
        },
      ],
    });
  }

  function bindGameEvents() {
    document.addEventListener("sudoku:stateChange", (event) => updateGameChrome(event.detail.state));
    document.addEventListener("sudoku:settingsChange", () => updateGameChrome(global.GameState.getState()));
    document.addEventListener("sudoku:paused", openPauseModal);
    document.addEventListener("sudoku:resumed", () => global.ModalManager.close());

    document.addEventListener("sudoku:gameComplete", (event) => {
      const result = event.detail;
      global.ModalManager.open({
        title: "完成！",
        html: `<p>時間 <strong>${global.TimerUI.format(result.time)}</strong></p>
          <p>錯誤 <strong>${result.errors}</strong>，提示 <strong>${result.hints}</strong></p>
          <p>分數 <strong>${result.score}</strong>，評級 <strong>${result.rank}</strong></p>`,
        actions: [
          {
            label: "再玩一次",
            className: "btn btn-primary",
            onClick: () => global.ScreenManager.startNewGame(global.GameState.getState()?.difficulty || "easy"),
          },
          {
            label: "回首頁",
            className: "btn btn-secondary",
            onClick: () => global.ScreenManager.show("home"),
          },
        ],
      });
    });

    document.addEventListener("sudoku:gameOver", () => {
      global.ModalManager.open({
        title: "遊戲結束",
        body: "錯誤次數已達上限。",
        actions: [
          {
            label: "重新開始",
            className: "btn btn-primary",
            onClick: () => global.ScreenManager.startNewGame(global.GameState.getState()?.difficulty || "easy"),
          },
          {
            label: "回首頁",
            className: "btn btn-secondary",
            onClick: () => global.ScreenManager.show("home"),
          },
        ],
      });
    });
  }

  function init() {
    global.SettingsState.init();
    global.ToastManager.init();
    global.ModalManager.init();
    global.TimerUI.init();
    global.BoardRenderer.init();
    global.NumpadRenderer.init();
    global.ScreenManager.init();
    global.AudioManager.init();
    global.KeyboardHandler.init();
    global.TouchHandler.init();
    global.MouseHandler.init();
    bindGameButtons();
    bindGameEvents();
    updateGameChrome(null);

    window.setInterval(() => global.GameState.tick(), 1000);
    window.addEventListener("beforeunload", () => global.GameState.save());
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
