(function registerOrderSystem(app) {
  "use strict";

  app.OrderSystem = {
    getLevel(levelId) {
      const levels = app.Config.levels;
      return levels.find((level) => level.id === Number(levelId)) || levels[0];
    },

    getNextLevel(levelId) {
      const levels = app.Config.levels;
      const index = levels.findIndex((level) => level.id === Number(levelId));
      return levels[index + 1] || levels[0];
    },

    createGameState(levelId, progress = {}) {
      const level = this.getLevel(levelId);
      return {
        level,
        score: Number(progress.score || 0),
        completed: Number(progress.completed || 0),
        stars: Number(progress.stars || 0),
        timeLeft: Number(progress.timeLeft || level.seconds),
        lastTick: 0,
        isComplete: false
      };
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
