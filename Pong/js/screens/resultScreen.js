(function () {
  const ResultScreen = {
    show(result) {
      ResultScreen.hide();
      const win = result.winner === "player";
      const overlay = document.createElement("div");
      overlay.className = "modal-backdrop";
      overlay.id = "resultOverlay";
      overlay.innerHTML = `
        <section class="panel" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <h2 class="result-title ${win ? "is-win" : "is-lose"}" id="result-title">${win ? "YOU WIN!" : "GAME OVER"}</h2>
          <p class="result-score">玩家 ${result.playerScore} - AI ${result.aiScore}</p>
          <div class="grid-2">
            ${Pong.DOM.button("再來一局", { action: "again" })}
            ${Pong.DOM.button("主選單", { action: "menu" })}
          </div>
        </section>
      `;
      Pong.DOM.app().appendChild(overlay);
      Pong.DOM.bindClicks(overlay, {
        again: () => Pong.Game.startNew(result.difficulty),
        menu: () => Pong.Game.returnToMenu(false)
      });
    },

    hide() {
      const overlay = Pong.DOM.qs("#resultOverlay");
      if (overlay) {
        overlay.remove();
      }
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.ResultScreen = ResultScreen;
})();
