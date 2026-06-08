(function () {
  "use strict";
  window.BML_LEVELS = window.BML_LEVELS || [];
  window.BML_LEVELS.push(
    {
      stage: 1,
      name: "歡迎來到炸彈世界",
      density: 0.35,
      timeLimit: 0,
      enemies: ["balloom"],
      powerups: ["bomb"],
      pattern: "open"
    },
    {
      stage: 2,
      name: "初試身手",
      density: 0.38,
      timeLimit: 0,
      enemies: ["balloom", "balloom"],
      powerups: ["fire"]
    },
    {
      stage: 3,
      name: "追逐開始",
      density: 0.4,
      timeLimit: 0,
      enemies: ["balloom", "balloom", "oneal"],
      powerups: ["speed", "bomb"]
    },
    {
      stage: 4,
      name: "多線作戰",
      density: 0.42,
      timeLimit: 0,
      enemies: ["oneal", "oneal", "balloom"],
      powerups: ["shield"]
    },
    {
      stage: 5,
      name: "第一道試煉",
      density: 0.46,
      timeLimit: 0,
      enemies: ["oneal", "oneal", "oneal"],
      powerups: ["fire", "fire", "speed"]
    }
  );
}());
