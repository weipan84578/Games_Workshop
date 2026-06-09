(function () {
  const PauseMenu = {
    show() {
      PauseMenu.hide();
      const overlay = document.createElement("div");
      const t = Pong.I18n.t;
      overlay.className = "modal-backdrop";
      overlay.id = "pauseOverlay";
      overlay.innerHTML = `
        <section class="panel" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <h2 class="panel-title" id="pause-title">${t("pause.title")}</h2>
          <div class="button-stack" style="margin-inline:auto;">
            ${Pong.DOM.button(t("pause.resume"), { action: "resume" })}
            ${Pong.DOM.button(t("pause.restart"), { action: "restart" })}
            ${Pong.DOM.button(t("pause.menu"), { action: "menu" })}
          </div>
        </section>
      `;
      Pong.DOM.app().appendChild(overlay);
      Pong.DOM.bindClicks(overlay, {
        resume: () => Pong.Game.resume(),
        restart: () => Pong.Game.restart(),
        menu: () => Pong.Game.returnToMenu(true)
      });
    },

    hide() {
      const overlay = Pong.DOM.qs("#pauseOverlay");
      if (overlay) {
        overlay.remove();
      }
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.PauseMenu = PauseMenu;
})();
