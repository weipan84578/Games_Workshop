(function () {
  "use strict";
  window.BML_LEVELS = window.BML_LEVELS || [];
  window.BML_LEVELS.push(
    {
      stage: 6,
      name: "蜂擁而至",
      density: 0.45,
      timeLimit: 180,
      enemies: ["oneal", "oneal", "balloom", "balloom"],
      powerups: ["bomb", "time"]
    },
    {
      stage: 7,
      name: "聰明的敵人",
      density: 0.45,
      timeLimit: 180,
      enemies: ["doll", "doll", "oneal"],
      powerups: ["remote"]
    },
    {
      stage: 8,
      name: "連鎖反應",
      density: 0.47,
      timeLimit: 180,
      enemies: ["doll", "doll", "oneal", "oneal"],
      powerups: ["fire", "bomb", "remote"],
      pattern: "cross"
    },
    {
      stage: 9,
      name: "迷宮碎形",
      density: 0.52,
      timeLimit: 180,
      enemies: ["doll", "doll", "doll", "balloom", "balloom"],
      powerups: ["fire", "shield"]
    },
    {
      stage: 10,
      name: "第一個里程碑",
      density: 0.48,
      timeLimit: 180,
      enemies: ["doll", "doll", "oneal", "oneal", "balloom", "balloom"],
      powerups: ["bomb", "fire", "speed"],
      pattern: "cross"
    }
  );
}());
