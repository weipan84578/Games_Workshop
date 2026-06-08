(function () {
  "use strict";

  const root = window.BML || (window.BML = {});
  const H = root.Helpers;

  class HUD {
    constructor(host) {
      this.host = host;
      this.host.innerHTML = `
        <div class="hud">
          <div class="hud-group">
            <span class="hud-pill" data-lives></span>
            <span class="hud-pill" data-bombs></span>
            <span class="hud-pill" data-fire></span>
          </div>
          <div class="hud-group hud-center">
            <span class="hud-timer" data-time></span>
          </div>
          <div class="hud-group right">
            <span class="hud-pill" data-stage></span>
            <span class="hud-pill" data-score></span>
          </div>
        </div>
      `;
    }

    update(game) {
      if (!game.player) return;
      this.host.querySelector("[data-lives]").textContent = "♥ x " + game.player.lives;
      this.host.querySelector("[data-bombs]").textContent = "B x " + game.player.bombsMax;
      this.host.querySelector("[data-fire]").textContent = "F x " + game.player.fireRange;
      this.host.querySelector("[data-time]").textContent = game.timeLimit ? H.formatTime(game.timeLeft) : "--:--";
      this.host.querySelector("[data-stage]").textContent = "Stage " + game.stage + "/25";
      this.host.querySelector("[data-score]").textContent = H.formatScore(game.score);
    }
  }

  root.HUD = HUD;
}());
