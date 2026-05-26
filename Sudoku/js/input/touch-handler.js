(function (global) {
  "use strict";

  global.TouchHandler = {
    init() {
      document.addEventListener("touchstart", () => {}, { passive: true });
    },
  };
})(window);
