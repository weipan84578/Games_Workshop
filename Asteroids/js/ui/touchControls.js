(function () {
  "use strict";

  Game.TouchControls = {
    init: function () {
      document.querySelectorAll("[data-touch]").forEach(function (button) {
        var action = button.getAttribute("data-touch");

        button.addEventListener("pointerdown", function (event) {
          event.preventDefault();
          button.setPointerCapture(event.pointerId);
          button.classList.add("active");
          Game.Input.setTouch(action, true, event.pointerId);
        });

        function release(event) {
          event.preventDefault();
          button.classList.remove("active");
          Game.Input.releaseTouchPointer(event.pointerId);
        }

        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", function (event) {
          button.classList.remove("active");
          Game.Input.releaseTouchPointer(event.pointerId);
        });
      });
    }
  };
}());
