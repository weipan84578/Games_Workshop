(function () {
  "use strict";

  Game.HelpUI = {
    init: function () {
      document.querySelectorAll("[data-help-tab]").forEach(function (button) {
        button.addEventListener("click", function () {
          var target = button.getAttribute("data-help-tab");
          Game.Sfx.play("ui");
          document.querySelectorAll("[data-help-tab]").forEach(function (tab) {
            tab.classList.toggle("active", tab === button);
          });
          document.querySelectorAll("[data-help-page]").forEach(function (page) {
            page.classList.toggle("active", page.getAttribute("data-help-page") === target);
          });
        });
      });
    }
  };
}());
