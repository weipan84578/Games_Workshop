(function (Game) {
  "use strict";
  function risingChance(height, unlockHeight, maximum, distance) {
    if (height <= unlockHeight) return 0;
    var climbed = height - unlockHeight;
    return maximum * (climbed / (climbed + distance));
  }
  function risingFromBase(height, base, maximum, distance) {
    var progress = height / (height + distance);
    return base + (maximum - base) * progress;
  }
  function get(height) {
    height = Math.max(0, Number(height) || 0);
    var stage = height < 60 ? 0 : height < 350 ? 1 : height < 900 ? 2 : 3;
    var progress = Game.Math.clamp(height / 3000, 0, 1);
    var movingChance = risingChance(height, 30, 0.3, 180);
    var springChance = risingChance(height, 50, 0.15, 350);
    var brittleChance = risingChance(height, 90, 0.18, 600);
    var vanishChance = risingChance(height, 140, 0.14, 750);
    var cloudChance = risingChance(height, 230, 0.12, 900);
    var enemyChance = risingChance(height, 50, 0.32, 800);
    var spikeChance = risingChance(height, 130, 0.22, 950);
    var holeChance = risingChance(height, 380, 0.14, 1200);
    return {
      stage: stage,
      platformWidth: Math.round(Game.Math.lerp(122, 76, progress)),
      gapMin: Math.round(Game.Math.lerp(88, 110, progress)),
      gapMax: Math.round(Game.Math.lerp(122, 150, progress)),
      movingChance: movingChance,
      brittleChance: brittleChance,
      springChance: springChance,
      vanishChance: vanishChance,
      cloudChance: cloudChance,
      specialPlatformChance:
        movingChance +
        brittleChance +
        springChance +
        vanishChance +
        cloudChance,
      spikeChance: spikeChance,
      holeChance: holeChance,
      enemyChance: enemyChance,
      hazardChance: enemyChance + spikeChance + holeChance,
      flyerChance: risingChance(height, 350, 0.52, 1300),
      itemChance: risingFromBase(height, 0.24, 0.56, 2600),
      rareItemChance: risingChance(height, 20, 0.65, 420),
      wind: height < 650 ? 0 : Game.Math.clamp((height - 650) / 4500, 0, 0.8),
    };
  }
  Game.Difficulty = Object.freeze({ get: get });
})(window.DJGame);
