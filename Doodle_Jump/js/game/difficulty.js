(function (Game) {
  "use strict";
  function get(height) {
    var stage = height < 300 ? 0 : height < 1000 ? 1 : height < 2500 ? 2 : 3;
    var progress = Game.Math.clamp(height / 2500, 0, 1);
    return {
      stage: stage,
      platformWidth: Math.round(Game.Math.lerp(116, 78, progress)),
      gapMin: Math.round(Game.Math.lerp(82, 105, progress)),
      gapMax: Math.round(Game.Math.lerp(126, 148, progress)),
      movingChance:
        height < 250 ? 0 : Game.Math.clamp(0.12 + height / 5000, 0.12, 0.34),
      brittleChance:
        height < 450 ? 0 : Game.Math.clamp(0.08 + height / 9000, 0.08, 0.2),
      springChance: height < 300 ? 0 : 0.1,
      vanishChance: height < 750 ? 0 : 0.1,
      cloudChance: height < 1000 ? 0 : 0.08,
      spikeChance:
        height < 1000 ? 0 : Game.Math.clamp(0.08 + height / 9000, 0.08, 0.16),
      holeChance:
        height < 1500 ? 0 : Game.Math.clamp(0.04 + height / 12000, 0.04, 0.12),
      enemyChance:
        height < 300 ? 0 : Game.Math.clamp(0.08 + height / 7000, 0.08, 0.18),
      itemChance: 0.25,
      wind: height < 500 ? 0 : Game.Math.clamp((height - 500) / 4000, 0, 0.8),
    };
  }
  Game.Difficulty = Object.freeze({ get: get });
})(window.DJGame);
