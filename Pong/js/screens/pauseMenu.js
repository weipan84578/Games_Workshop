(function () {
  const PauseMenu = {
    show() {
      PauseMenu.hide();
      const overlay = document.createElement("div");
      overlay.className = "modal-backdrop";
      overlay.id = "pauseOverlay";
      overlay.innerHTML = `
        <section class="panel" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <h2 class="panel-title" id="pause-title">暫停中</h2>
          <div class="button-stack" style="margin-inline:auto;">
            ${Pong.DOM.button("繼續遊戲", { action: "resume" })}
            ${Pong.DOM.button("重新開始", { action: "restart" })}
            ${Pong.DOM.button("主選單", { action: "menu" })}
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
