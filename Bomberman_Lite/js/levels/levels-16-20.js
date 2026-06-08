(function () {
  "use strict";
  window.BML_LEVELS = window.BML_LEVELS || [];
  window.BML_LEVELS.push(
    {
      stage: 16,
      name: "幽靈來了",
      density: 0.55,
      timeLimit: 120,
      enemies: ["kondoria", "minvo", "minvo"],
      powerups: ["pierce", "shield"]
    },
    {
      stage: 17,
      name: "恐懼蔓延",
      density: 0.56,
      timeLimit: 120,
      enemies: ["kondoria", "kondoria", "doll", "doll"],
      powerups: ["bomb", "fire", "speed"]
    },
    {
      stage: 18,
      name: "複合威脅",
      density: 0.56,
      timeLimit: 120,
      enemies: ["kondoria", "minvo", "minvo", "oneal", "oneal"],
      powerups: ["time", "shield", "remote"]
    },
    {
      stage: 19,
      name: "速殺或被殺",
      density: 0.58,
      timeLimit: 120,
      enemies: ["minvo", "minvo", "minvo", "kondoria", "kondoria"],
      powerups: ["speed", "fire", "life"]
    },
    {
      stage: 20,
      name: "高級考驗",
      density: 0.55,
      timeLimit: 120,
      enemies: ["ovape", "kondoria", "minvo", "minvo"],
      powerups: ["bomb", "fire", "pierce", "shield"]
    }
  );
}());
