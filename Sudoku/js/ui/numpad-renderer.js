(function (global) {
  "use strict";

  let pad = null;
  let buttons = [];

  function createButton(value) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = String(value);
    button.textContent = value === "erase" ? "清除" : String(value);
    button.setAttribute("aria-label", value === "erase" ? "清除目前格子" : `輸入 ${value}`);
    button.addEventListener("click", () => {
      if (value === "erase") {
        global.GameState.erase();
      } else {
        global.GameState.setNumber(value);
      }
    });
    return button;
  }

  function render(state) {
    if (!pad) {
      return;
    }

    pad.classList.toggle("is-memo", Boolean(state && state.memoMode));

    const counts = Array(10).fill(0);
    if (state) {
      state.currentValues.forEach((value) => {
        if (value) {
          counts[value] += 1;
        }
      });
    }

    buttons.forEach((button) => {
      const raw = button.dataset.value;
      const value = raw === "erase" ? raw : Number(raw);
      const disabled = !state || state.paused || state.gameOver || state.completed || (value !== "erase" && counts[value] >= 9);
      button.disabled = disabled;
    });
  }

  global.NumpadRenderer = {
    init() {
      pad = document.getElementById("numpad");
      buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, "erase"].map(createButton);
      pad.replaceChildren(...buttons);
      document.addEventListener("sudoku:stateChange", (event) => render(event.detail.state));
      render(null);
    },
    render,
  };
})(window);
