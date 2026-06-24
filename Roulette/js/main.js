(() => {
  "use strict";
  const { GameApp, renderAppShell } = window.Roulette;

  window.addEventListener("DOMContentLoaded", () => {
    renderAppShell(document.getElementById("app"));
    new GameApp();
  });
})();
