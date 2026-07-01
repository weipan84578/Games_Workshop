(function (ns) {
  "use strict";

  ns.HowToPlayUI = {
    init: function () {
      document.getElementById("how-start-button").addEventListener("click", function () {
        ns.Router.show("menu");
        window.setTimeout(function () {
          ns.MainMenuUI.openStartModal();
        }, 80);
      });
    }
  };
})(window.DAB = window.DAB || {});
