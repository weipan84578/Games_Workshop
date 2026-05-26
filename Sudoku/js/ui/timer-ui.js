(function (global) {
  "use strict";

  let timerNode = null;

  function format(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function render(state) {
    if (!timerNode) {
      return;
    }

    const settings = global.SettingsState.get();
    timerNode.classList.toggle("is-hidden", !settings.showTimer);
    timerNode.textContent = format(state ? state.elapsedSeconds : 0);
  }

  global.TimerUI = {
    init() {
      timerNode = document.getElementById("timer-display");
      document.addEventListener("sudoku:stateChange", (event) => render(event.detail.state));
      document.addEventListener("sudoku:settingsChange", () => render(global.GameState.getState()));
      render(null);
    },
    format,
    render,
  };
})(window);
