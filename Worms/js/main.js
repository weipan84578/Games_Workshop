(function () {
  "use strict";
  function boot() {
    try {
      window.WormsGame.app = new window.WormsGame.App().init();
    } catch (error) {
      console.error("Wormy Boom Squad failed to boot", error);
      var bootScreen = document.getElementById("boot-screen");
      bootScreen.innerHTML =
        '<div class="panel compact"><h1>Wormy Boom Squad</h1><p>The game could not start. Please reopen this file in a current browser.</p></div>';
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
