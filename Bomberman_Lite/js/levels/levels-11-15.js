(function () {
  "use strict";
  window.BML_LEVELS = window.BML_LEVELS || [];
  window.BML_LEVELS.push(
    {
      stage: 11,
      name: "速度狂魔",
      density: 0.5,
      timeLimit: 150,
      enemies: ["minvo", "doll", "doll"],
      powerups: ["speed", "shield"]
    },
    {
      stage: 12,
      name: "四面埋伏",
      density: 0.5,
      timeLimit: 150,
      enemies: ["minvo", "minvo", "oneal", "oneal"],
      powerups: ["bomb", "fire", "time"]
    },
    {
      stage: 13,
      name: "道具大豐收",
      density: 0.52,
      timeLimit: 150,
      enemies: ["minvo", "minvo", "doll", "doll"],
      powerups: ["bomb", "fire", "speed", "shield", "time", "pierce", "life", "remote"]
    },
    {
      stage: 14,
      name: "穿牆預告",
      density: 0.5,
      timeLimit: 150,
      enemies: ["minvo", "minvo", "minvo", "doll"],
      powerups: ["fire", "speed"],
      pattern: "cross"
    },
    {
      stage: 15,
      name: "中途大挑戰",
      density: 0.54,
      timeLimit: 150,
      enemies: ["minvo", "minvo", "doll", "doll", "oneal", "oneal"],
      powerups: ["bomb", "fire", "shield", "time"],
      spawnEvery: { seconds: 30, type: "minvo" }
    }
  );
}());
