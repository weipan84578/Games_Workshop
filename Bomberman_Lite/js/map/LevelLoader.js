(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  function levels() {
    return window.BML_LEVELS || [];
  }

  const LevelLoader = {
    get(stage) {
      const found = levels().find((level) => level.stage === stage);
      if (found) return found;
      return {
        stage,
        name: "未知關卡",
        density: 0.4,
        timeLimit: stage >= 6 ? 180 : 0,
        enemies: ["balloom"],
        powerups: ["bomb", "fire"]
      };
    },

    create(stage) {
      const config = this.get(stage);
      const map = root.TileMap.generate(config);
      return { config, map };
    }
  };

  root.LevelLoader = LevelLoader;
}());
