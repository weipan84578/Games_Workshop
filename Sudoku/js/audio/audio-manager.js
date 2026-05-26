(function (global) {
  "use strict";

  function trackForState(state) {
    if (!state) {
      return "home";
    }
    const suffix = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
    return `game${suffix}`;
  }

  function playForScreen(screen) {
    if (screen === "settings") {
      global.BGMController.play("settings");
      return;
    }
    if (screen === "game") {
      global.BGMController.play(trackForState(global.GameState.getState()));
      return;
    }
    global.BGMController.play("home");
  }

  global.AudioManager = {
    init() {
      const settings = global.SettingsState.get();
      global.BGMController.configure(settings);
      global.SFXController.configure(settings);

      document.addEventListener("pointerdown", () => {
        global.BGMController.unlock();
        global.SFXController.unlock();
        playForScreen(global.ScreenManager.getActiveScreen());
      }, { once: true });

      document.addEventListener("sudoku:settingsChange", (event) => {
        global.BGMController.configure(event.detail.settings);
        global.SFXController.configure(event.detail.settings);
        playForScreen(global.ScreenManager.getActiveScreen());
      });

      document.addEventListener("sudoku:screenChange", (event) => {
        global.SFXController.play("click");
        playForScreen(event.detail.to);
      });

      document.addEventListener("sudoku:gameStart", () => playForScreen("game"));
      document.addEventListener("sudoku:gameLoad", () => playForScreen("game"));
      document.addEventListener("sudoku:cellSelected", () => global.SFXController.play("select"));
      document.addEventListener("sudoku:numberInput", (event) => global.SFXController.play(event.detail.isError ? "error" : "input"));
      document.addEventListener("sudoku:cellErased", () => global.SFXController.play("erase"));
      document.addEventListener("sudoku:hintUsed", () => global.SFXController.play("hint"));
      document.addEventListener("sudoku:undoPerformed", () => global.SFXController.play("undo"));
      document.addEventListener("sudoku:gameComplete", () => global.SFXController.play("victory"));
      document.addEventListener("sudoku:gameOver", () => global.SFXController.play("gameOver"));
    },
  };
})(window);
