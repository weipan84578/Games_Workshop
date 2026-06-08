(function () {
  "use strict";
  window.BML_LEVELS = window.BML_LEVELS || [];
  window.BML_LEVELS.push(
    {
      stage: 21,
      name: "煉獄入口",
      density: 0.6,
      timeLimit: 90,
      enemies: ["ovape", "ovape", "minvo", "minvo", "doll"],
      powerups: ["time", "shield", "fire"],
      pattern: "ring"
    },
    {
      stage: 22,
      name: "無盡壓力",
      density: 0.6,
      timeLimit: 90,
      enemies: ["ovape", "ovape", "kondoria", "kondoria", "minvo"],
      powerups: ["bomb", "time", "life"],
      spawnEvery: { seconds: 20, type: "balloom" }
    },
    {
      stage: 23,
      name: "混沌地帶",
      density: 0.6,
      timeLimit: 90,
      enemies: ["balloom", "oneal", "doll", "minvo", "kondoria", "ovape"],
      powerups: ["bomb", "fire", "speed", "shield", "pierce"]
    },
    {
      stage: 24,
      name: "最後的守門人",
      density: 0.6,
      timeLimit: 90,
      enemies: ["ovape", "ovape", "ovape", "kondoria", "kondoria", "minvo", "minvo"],
      powerups: ["bomb", "fire", "speed", "shield", "time", "pierce", "life", "remote"],
      pattern: "ring"
    },
    {
      stage: 25,
      name: "終極 Boss 決戰",
      density: 0.3,
      timeLimit: 120,
      enemies: ["boss"],
      powerups: ["bomb", "fire", "shield", "time"],
      pattern: "boss"
    }
  );
}());
