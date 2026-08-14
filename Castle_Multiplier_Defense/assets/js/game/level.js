(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});

  function createLevel(number, weather, gateCount, enemyPace, hpScale) {
    return {
      number: number,
      weather: weather,
      gateCount: gateCount,
      enemyPace: enemyPace,
      hpScale: hpScale || 1,
    };
  }

  var levels = [
    createLevel(1, "clear", 2, 1.08),
    createLevel(2, "cloud", 2, 1.05),
    createLevel(3, "clear", 2, 1),
    createLevel(4, "sunset", 2, 0.97),
    createLevel(5, "cloud", 3, 0.94),
    createLevel(6, "rain", 2, 0.91),
    createLevel(7, "sunset", 3, 0.88),
    createLevel(8, "night", 3, 0.85),
    createLevel(9, "snow", 3, 0.82),
    createLevel(10, "night", 3, 0.79, 1.1),
    createLevel(11, "rain", 3, 0.77, 1.12),
    createLevel(12, "sunset", 3, 0.74, 1.15),
    createLevel(13, "cloud", 3, 0.72, 1.18),
    createLevel(14, "night", 3, 0.7, 1.2),
    createLevel(15, "rain", 3, 0.68, 1.23),
    createLevel(16, "snow", 3, 0.66, 1.26),
    createLevel(17, "sunset", 3, 0.64, 1.3),
    createLevel(18, "night", 3, 0.62, 1.34),
    createLevel(19, "rain", 3, 0.6, 1.38),
    createLevel(20, "night", 3, 0.58, 1.44),
  ];

  cg.Level = {
    get: function (number) {
      var index = Math.max(
        0,
        Math.min(levels.length - 1, (Number(number) || 1) - 1),
      );
      return Object.assign({}, levels[index]);
    },
    count: levels.length,
  };
})(window);
