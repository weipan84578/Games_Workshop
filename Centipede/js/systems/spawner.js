(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class Spawner {
    constructor(app) {
      this.app = app;
      this.reset();
    }

    reset() {
      this.spiderTimer = Game.Helpers.rand(Game.Config.SPIDER_MIN_TIME, Game.Config.SPIDER_MAX_TIME);
      this.scorpionTimer = Game.Helpers.rand(Game.Config.SCORPION_MIN_TIME, Game.Config.SCORPION_MAX_TIME);
      this.fleaCooldown = 4;
    }

    update(dt) {
      const app = this.app;
      this.spiderTimer -= dt;
      this.scorpionTimer -= dt;
      this.fleaCooldown -= dt;

      if (this.spiderTimer <= 0 && !app.spider) {
        app.spider = new Game.Entities.Spider(app);
        this.spiderTimer = Game.Helpers.rand(Game.Config.SPIDER_MIN_TIME, Game.Config.SPIDER_MAX_TIME);
      }

      if (app.level >= 2 && this.scorpionTimer <= 0) {
        app.scorpions.push(new Game.Entities.Scorpion(app));
        this.scorpionTimer = Game.Helpers.rand(Game.Config.SCORPION_MIN_TIME, Game.Config.SCORPION_MAX_TIME);
      }

      if (this.fleaCooldown <= 0 && app.countPlayerZoneMushrooms() < Game.Config.FLEA_TRIGGER_MUSHROOMS) {
        app.fleas.push(new Game.Entities.Flea(app));
        this.fleaCooldown = Game.Helpers.rand(5, 8);
      }
    }
  }

  Game.Spawner = Spawner;
})(window);
