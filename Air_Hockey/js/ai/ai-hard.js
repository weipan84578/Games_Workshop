(function (ns) {
  "use strict";

  ns.AI = ns.AI || {};

  function predictXWithWallBounce(x, vx, seconds) {
    var table = ns.Constants.TABLE;
    var nextX = x + vx * seconds;
    var min = table.PUCK_RADIUS;
    var max = table.WIDTH - table.PUCK_RADIUS;
    while (nextX < min || nextX > max) {
      if (nextX < min) {
        nextX = min + (min - nextX);
      }
      if (nextX > max) {
        nextX = max - (nextX - max);
      }
    }
    return nextX;
  }

  ns.AI.hard = {
    create: function () {
      return {
        timer: 0,
        target: { x: ns.Constants.TABLE.WIDTH / 2, y: ns.Constants.TABLE.AI_START_Y },
        decide: function (state, dt) {
          var config = ns.Constants.DIFFICULTY.hard;
          this.timer -= dt;
          if (this.timer <= 0) {
            this.timer = config.reactionDelay;
            var predictedX = predictXWithWallBounce(state.puck.x, state.puck.vx, config.predictionTime);
            var puckComingUp = state.puck.vy < -40;
            var attackY = puckComingUp ? state.puck.y - 115 : ns.Constants.TABLE.AI_START_Y + 35;
            if (Math.random() < config.mistakeRate) {
              predictedX += ns.Helpers.randomBetween(-35, 35);
            }
            this.target = {
              x: predictedX,
              y: ns.Helpers.lerp(ns.Constants.TABLE.AI_START_Y, attackY, config.attackBias)
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
