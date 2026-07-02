(function (ns) {
  "use strict";

  ns.AI = ns.AI || {};

  ns.AI.easy = {
    create: function () {
      return {
        timer: 0,
        target: { x: ns.Constants.TABLE.WIDTH / 2, y: ns.Constants.TABLE.AI_START_Y },
        decide: function (state, dt) {
          var config = ns.Constants.DIFFICULTY.easy;
          this.timer -= dt;
          if (this.timer <= 0) {
            this.timer = config.reactionDelay;
            var wrongWay = Math.random() < config.mistakeRate;
            this.target = {
              x: wrongWay ? ns.Constants.TABLE.WIDTH - state.puck.x : state.puck.x,
              y: ns.Helpers.lerp(ns.Constants.TABLE.AI_START_Y, state.puck.y, config.attackBias)
            };
          }
          return {
            x: this.target.x,
            y: this.target.y,
            speed: config.speed
          };
        }
      };
    }
  };
})(window.AirHockey = window.AirHockey || {});
