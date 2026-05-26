(function (global) {
  "use strict";

  global.MouseHandler = {
    init() {
      document.addEventListener("click", (event) => {
        if (event.target.closest("button")) {
          global.SFXController.play("click");
        }
      });
    },
  };
})(window);
