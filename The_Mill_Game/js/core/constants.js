(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};

  var POSITIONS = [
    { id: 0, x: 8, y: 8, label: "outer-top-left" },
    { id: 1, x: 50, y: 8, label: "outer-top" },
    { id: 2, x: 92, y: 8, label: "outer-top-right" },
    { id: 3, x: 92, y: 50, label: "outer-right" },
    { id: 4, x: 92, y: 92, label: "outer-bottom-right" },
    { id: 5, x: 50, y: 92, label: "outer-bottom" },
    { id: 6, x: 8, y: 92, label: "outer-bottom-left" },
    { id: 7, x: 8, y: 50, label: "outer-left" },
    { id: 8, x: 22, y: 22, label: "middle-top-left" },
    { id: 9, x: 50, y: 22, label: "middle-top" },
    { id: 10, x: 78, y: 22, label: "middle-top-right" },
    { id: 11, x: 78, y: 50, label: "middle-right" },
    { id: 12, x: 78, y: 78, label: "middle-bottom-right" },
    { id: 13, x: 50, y: 78, label: "middle-bottom" },
    { id: 14, x: 22, y: 78, label: "middle-bottom-left" },
    { id: 15, x: 22, y: 50, label: "middle-left" },
    { id: 16, x: 36, y: 36, label: "inner-top-left" },
    { id: 17, x: 50, y: 36, label: "inner-top" },
    { id: 18, x: 64, y: 36, label: "inner-top-right" },
    { id: 19, x: 64, y: 50, label: "inner-right" },
    { id: 20, x: 64, y: 64, label: "inner-bottom-right" },
    { id: 21, x: 50, y: 64, label: "inner-bottom" },
    { id: 22, x: 36, y: 64, label: "inner-bottom-left" },
    { id: 23, x: 36, y: 50, label: "inner-left" }
  ];

  var RINGS = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22, 23]
  ];

  var CONNECTORS = [
    [1, 9], [9, 17],
    [3, 11], [11, 19],
    [5, 13], [13, 21],
    [7, 15], [15, 23]
  ];

  var ADJACENCY = {
    0: [1, 7],
    1: [0, 2, 9],
    2: [1, 3],
    3: [2, 4, 11],
    4: [3, 5],
    5: [4, 6, 13],
    6: [5, 7],
    7: [0, 6, 15],
    8: [9, 15],
    9: [1, 8, 10, 17],
    10: [9, 11],
    11: [3, 10, 12, 19],
    12: [11, 13],
    13: [5, 12, 14, 21],
    14: [13, 15],
    15: [7, 8, 14, 23],
    16: [17, 23],
    17: [9, 16, 18],
    18: [17, 19],
    19: [11, 18, 20],
    20: [19, 21],
    21: [13, 20, 22],
    22: [21, 23],
    23: [15, 16, 22]
  };

  var MILLS = [
    [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
    [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
    [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
    [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23]
  ];

  NMM.Constants = {
    VERSION: "1.0",
    PLAYERS: {
      PLAYER: "player",
      AI: "ai"
    },
    PHASES: {
      PLACING: "placing",
      MOVING: "moving",
      FLYING: "flying"
    },
    POSITIONS: POSITIONS,
    RINGS: RINGS,
    CONNECTORS: CONNECTORS,
    ADJACENCY: ADJACENCY,
    MILLS: MILLS,
    THEMES: ["classic", "ocean", "sunset", "forest", "night"],
    DIFFICULTIES: ["easy", "normal", "hard"],
    LANGUAGES: ["zh", "en", "ja"],
    MAX_HISTORY: 80,
    DRAW_WITHOUT_CAPTURE: 50
  };
})(window);
