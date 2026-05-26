(function (global) {
  "use strict";

  function isEditableTarget(target) {
    return target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
  }

  function isGameActive() {
    return global.ScreenManager && global.ScreenManager.getActiveScreen() === "game";
  }

  function handleKeydown(event) {
    if (!isGameActive() || isEditableTarget(event.target)) {
      return;
    }

    const key = event.key;
    if (/^[1-9]$/.test(key)) {
      event.preventDefault();
      global.GameState.setNumber(Number(key));
      return;
    }

    if (key === "0" || key === "Backspace" || key === "Delete") {
      event.preventDefault();
      global.GameState.erase();
      return;
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      global.GameState.moveSelection(-1, 0);
    } else if (key === "ArrowDown") {
      event.preventDefault();
      global.GameState.moveSelection(1, 0);
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      global.GameState.moveSelection(0, -1);
    } else if (key === "ArrowRight") {
      event.preventDefault();
      global.GameState.moveSelection(0, 1);
    } else if (key.toLowerCase() === "m") {
      event.preventDefault();
      global.GameState.toggleMemo();
    } else if (key.toLowerCase() === "h") {
      event.preventDefault();
      global.GameState.hint();
    } else if (key.toLowerCase() === "u") {
      event.preventDefault();
      global.GameState.undo();
    } else if (key === "Escape") {
      event.preventDefault();
      global.GameState.pause();
    }
  }

  global.KeyboardHandler = {
    init() {
      document.addEventListener("keydown", handleKeydown);
    },
  };
})(window);
