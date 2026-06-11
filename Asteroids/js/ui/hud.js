(function () {
  "use strict";

  var els = {};

  Game.Hud = {
    init: function () {
      els.score = document.getElementById("hud-score");
      els.highscore = document.getElementById("hud-highscore");
      els.level = document.getElementById("hud-level");
      els.lives = document.getElementById("hud-lives");
      els.powerups = document.getElementById("hud-powerups");
    },

    update: function (app) {
      if (!els.score || !app.scoreManager) return;
      els.score.textContent = Game.Utils.formatScore(app.scoreManager.score);
      els.highscore.textContent = Game.Utils.formatScore(app.scoreManager.highscore);
      els.level.textContent = String(app.level).padStart(2, "0");
      els.lives.textContent = String(app.lives);

      var chips = [];
      if (app.ship) {
        Object.keys(Game.Constants.POWERUPS.TYPES).forEach(function (type) {
          var until = type === "shield" ? app.ship.shieldUntil : app.ship.powerups[type];
          if (until && until > app.time) {
            chips.push('<span class="power-chip">' + Game.I18n.t("power." + type) + " " + Math.ceil(until - app.time) + "s</span>");
          }
        });
      }
      els.powerups.innerHTML = chips.join("");
    }
  };
}());
