(function (ns) {
  "use strict";

  ns.TouchInput = {
    attach: function (game) {
      var canvas = game.canvas;
      var handleTouch = ns.Helpers.throttle(function (event) {
        if (event.cancelable) {
          event.preventDefault();
        }
        game.setPointerTarget(ns.Helpers.pointerToCanvas(event, canvas), "touch");
      }, 8);

      canvas.addEventListener("touchstart", handleTouch, { passive: false });
      canvas.addEventListener("touchmove", handleTouch, { passive: false });
      canvas.addEventListener("touchend", function () {
        game.clearPointerSource("touch");
      }, { passive: false });
    }
  };
})(window.AirHockey = window.AirHockey || {});
