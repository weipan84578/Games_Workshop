(function () {
  function isTypingTarget(target) {
    return target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
  }

  const Input = {
    init() {
      window.addEventListener("keydown", Input.onKeyDown);
      window.addEventListener("keyup", Input.onKeyUp);
      window.addEventListener("blur", Input.clearMovement);
    },

    attachCanvas(canvas) {
      canvas.addEventListener("pointerdown", Input.onPointerDown);
      canvas.addEventListener("pointermove", Input.onPointerMove);
      canvas.addEventListener("pointerup", Input.onPointerUp);
      canvas.addEventListener("pointercancel", Input.onPointerUp);
    },

    onKeyDown(event) {
      if (isTypingTarget(event.target)) {
        return;
      }

      const input = Pong.GameState.input;
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        input.up = true;
        event.preventDefault();
      }
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        input.down = true;
        event.preventDefault();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        Pong.Game.togglePause();
      }
      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        Pong.Audio.unlock();
        Pong.Audio.toggleMute();
        Pong.GameScreen.updateMuteButton();
      }
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        if (Pong.GameState.game.active) {
          Pong.Game.restart();
        }
      }
    },

    onKeyUp(event) {
      const input = Pong.GameState.input;
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        input.up = false;
      }
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        input.down = false;
      }
    },

    onPointerDown(event) {
      const state = Pong.GameState;
      const rect = state.canvas.element.getBoundingClientRect();
      if (event.clientX > rect.left + rect.width / 2) {
        return;
      }

      state.input.pointerActive = true;
      state.input.pointerY = event.clientY - rect.top;
      event.preventDefault();
      Pong.Audio.unlock();
    },

    onPointerMove(event) {
      const state = Pong.GameState;
      if (!state.input.pointerActive) {
        return;
      }
      const rect = state.canvas.element.getBoundingClientRect();
      state.input.pointerY = event.clientY - rect.top;
      event.preventDefault();
    },

    onPointerUp() {
      const input = Pong.GameState.input;
      input.pointerActive = false;
      input.pointerY = null;
    },

    setVirtual(direction, active) {
      const input = Pong.GameState.input;
      if (direction === "up") {
        input.virtualUp = active;
      }
      if (direction === "down") {
        input.virtualDown = active;
      }
    },

    clearMovement() {
      const input = Pong.GameState.input;
      input.up = false;
      input.down = false;
      input.virtualUp = false;
      input.virtualDown = false;
      input.pointerActive = false;
      input.pointerY = null;
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Input = Input;
})();
