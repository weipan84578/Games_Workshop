(function () {
  "use strict";

  var state = {
    left: false,
    right: false,
    thrust: false,
    fire: false,
    warp: false
  };

  var pressed = {};
  var touchPointers = {};

  var keyMap = {
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ArrowUp: "thrust",
    KeyW: "thrust",
    Space: "fire",
    KeyJ: "fire",
    ShiftLeft: "warp",
    ShiftRight: "warp",
    KeyK: "warp",
    Escape: "pause",
    KeyP: "pause",
    KeyM: "mute"
  };

  function setAction(action, value) {
    if (!action) return;
    if (action === "pause" || action === "mute") {
      if (value) pressed[action] = true;
      return;
    }
    if (state[action] !== value && value) {
      pressed[action] = true;
    }
    state[action] = value;
  }

  function keyHandler(value) {
    return function (event) {
      var action = keyMap[event.code];
      if (!action) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].indexOf(event.code) !== -1) {
        event.preventDefault();
      }
      if (event.repeat && (action === "pause" || action === "mute")) return;
      setAction(action, value);
    };
  }

  Game.Input = {
    state: state,

    init: function () {
      window.addEventListener("keydown", keyHandler(true));
      window.addEventListener("keyup", keyHandler(false));
      window.addEventListener("blur", function () {
        Object.keys(state).forEach(function (key) {
          state[key] = false;
        });
      });
      window.addEventListener("contextmenu", function (event) {
        if (Game.State && Game.State.is(Game.Constants.STATES.PLAYING)) {
          event.preventDefault();
        }
      });
    },

    setTouch: function (action, active, pointerId) {
      if (pointerId !== undefined) {
        if (active) {
          touchPointers[pointerId] = action;
        } else {
          delete touchPointers[pointerId];
        }
      }
      setAction(action, active);
    },

    releaseTouchPointer: function (pointerId) {
      var action = touchPointers[pointerId];
      if (!action) return;
      delete touchPointers[pointerId];
      setAction(action, false);
    },

    consume: function (action) {
      var value = !!pressed[action];
      pressed[action] = false;
      return value;
    }
  };
}());
