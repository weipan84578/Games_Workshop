(function (Game) {
  "use strict";
  function get(height) {
    var stage = height < 250 ? 0 : height < 900 ? 1 : height < 2200 ? 2 : 3;
    var progress = Game.Math.clamp(height / 3000, 0, 1);
    return {
      stage: stage,
      platformWidth: Math.round(Game.Math.lerp(122, 76, progress)),
      gapMin: Math.round(Game.Math.lerp(88, 110, progress)),
      gapMax: Math.round(Game.Math.lerp(122, 150, progress)),
      movingChance:
        height < 250
          ? 0
          : Game.Math.clamp(0.08 + (height - 250) / 7500, 0.08, 0.32),
      brittleChance:
        height < 550
          ? 0
          : Game.Math.clamp(0.06 + (height - 550) / 12000, 0.06, 0.18),
      springChance:
        height < 350
          ? 0
          : Game.Math.clamp(0.06 + (height - 350) / 18000, 0.06, 0.13),
      vanishChance:
        height < 850
          ? 0
          : Game.Math.clamp(0.05 + (height - 850) / 18000, 0.05, 0.11),
      cloudChance:
        height < 1200
          ? 0
          : Game.Math.clamp(0.04 + (height - 1200) / 22000, 0.04, 0.09),
      spikeChance:
        height < 1100
          ? 0
          : Game.Math.clamp(0.05 + (height - 1100) / 15000, 0.05, 0.15),
      holeChance:
        height < 1700
          ? 0
          : Game.Math.clamp(0.03 + (height - 1700) / 22000, 0.03, 0.1),
      enemyChance:
        height < 450
          ? 0
          : Game.Math.clamp(0.06 + (height - 450) / 10000, 0.06, 0.17),
      itemChance: Game.Math.clamp(0.16 + height / 18000, 0.16, 0.32),
      rareItemChance:
        height < 250
          ? 0
          : Game.Math.clamp(0.15 + (height - 250) / 9000, 0.15, 0.48),
      wind: height < 650 ? 0 : Game.Math.clamp((height - 650) / 4500, 0, 0.8),
    };
  }
  Game.Difficulty = Object.freeze({ get: get });
})(window.DJGame);
