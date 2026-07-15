(function (Game) {
  "use strict";
  Game.HelpScreen = Object.freeze({
    init: function (root) {
      var top = root.querySelector("[data-back-to-top]");
      if (top)
        top.addEventListener("click", function () {
          root.scrollIntoView({ behavior: "smooth" });
        });
    },
  });
})(window.DJGame);
