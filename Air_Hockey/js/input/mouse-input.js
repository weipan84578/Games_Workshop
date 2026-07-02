(function (ns) {
  "use strict";

  ns.MouseInput = {
    attach: function (game) {
      var canvas = game.canvas;
      canvas.addEventListener("mousemove", ns.Helpers.throttle(function (event) {
        game.setPointerTarget(ns.Helpers.pointerToCanvas(event, canvas), "mouse");
      }, 8));
      canvas.addEventListener("mouseleave", function () {
        game.clearPointerSource("mouse");
      });
    }
  };
})(window.AirHockey = window.AirHockey || {});
