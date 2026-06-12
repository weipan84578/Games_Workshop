(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Level = {
    create(level) {
      const cfg = Game.Config;
      const speed = Math.min(cfg.CENTIPEDE_MAX_SPEED, cfg.CENTIPEDE_BASE_SPEED + (level - 1) * 0.5);
      return {
        level,
        speed,
        mainLength: Math.max(5, 13 - level),
        extraHeads: Math.max(0, level - 1),
        mushroomCount: Game.Helpers.randInt(cfg.INITIAL_MUSHROOM_MIN, cfg.INITIAL_MUSHROOM_MAX)
      };
    }
  };
})(window);
