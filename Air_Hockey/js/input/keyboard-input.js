(function (ns) {
  "use strict";

  ns.KeyboardInput = {
    attach: function (game) {
      var keys = {};
      function isControlKey(key) {
        return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "W", "A", "S", "D"].indexOf(key) !== -1;
      }
      window.addEventListener("keydown", function (event) {
        if (!isControlKey(event.key)) {
          return;
        }
        keys[event.key] = true;
        game.setKeyboardState(keys);
        if (event.cancelable) {
          event.preventDefault();
        }
      });
      window.addEventListener("keyup", function (event) {
        if (!isControlKey(event.key)) {
          return;
        }
        keys[event.key] = false;
        game.setKeyboardState(keys);
      });
    }
  };
})(window.AirHockey = window.AirHockey || {});
