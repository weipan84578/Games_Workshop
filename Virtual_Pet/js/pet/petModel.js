window.VP = window.VP || {};

VP.PetModel = (function () {
  var STAGES = [
    {
      id: "egg",
      level: 1,
      scale: 0.72,
      decay: { hunger: 0.2, mood: 0.45, clean: 0.25, energy: 0.1 },
      careGain: 0.8,
      energyCost: 0.1,
      energyGain: 0.5,
      growth: 1.25,
      passiveHealthLoss: 0
    },
    {
      id: "juvenile",
      level: 2,
      scale: 0.84,
      decay: { hunger: 1.2, mood: 0.75, clean: 0.75, energy: 0.25 },
      careGain: 1.15,
      energyCost: 0.35,
      energyGain: 1.35,
      growth: 1.18,
      passiveHealthLoss: 0
    },
    {
      id: "mature",
      level: 4,
      scale: 0.98,
      decay: { hunger: 1, mood: 1, clean: 1, energy: 0.75 },
      careGain: 1,
      energyCost: 0.85,
      energyGain: 1,
      growth: 1,
      passiveHealthLoss: 0
    },
    {
      id: "prime",
      level: 7,
      scale: 1.1,
      decay: { hunger: 1.2, mood: 0.95, clean: 1.05, energy: 1 },
      careGain: 0.95,
      energyCost: 1,
      energyGain: 0.95,
      growth: 0.9,
      passiveHealthLoss: 0
    },
    {
      id: "elder",
      level: 10,
      scale: 0.95,
      decay: { hunger: 0.9, mood: 1.2, clean: 1.15, energy: 2.35 },
      careGain: 0.75,
      energyCost: 1.75,
      energyGain: 0.72,
      growth: 0.4,
      passiveHealthLoss: 0.004
    }
  ];

  function listStages() {
    return STAGES.slice();
  }

  function getStage(level) {
    var stage = STAGES[0].id;
    STAGES.forEach(function (item) {
      if (level >= item.level) {
        stage = item.id;
      }
    });
    return stage;
  }

  function getStageProfile(stageId) {
    return STAGES.filter(function (item) {
      return item.id === stageId;
    })[0] || STAGES[0];
  }

  function getMoodState(stats, isSleeping, isDead) {
    if (isDead) {
      return "dead";
    }
    if (isSleeping) {
      return "sleeping";
    }
    if (!stats || stats.health < 30) {
      return "sick";
    }
    if (stats.mood < 30 || stats.hunger < 25 || stats.clean < 25 || stats.energy < 18) {
      return "sad";
    }
    if (stats.mood > 70 && stats.health > 60) {
      return "happy";
    }
    return "normal";
  }

  function lowStatCount(stats) {
    return ["hunger", "mood", "clean", "energy"].filter(function (key) {
      return stats[key] < 30;
    }).length;
  }

  function statAverage(stats) {
    return (stats.hunger + stats.mood + stats.clean + stats.energy) / 4;
  }

  return {
    listStages: listStages,
    getStage: getStage,
    getStageProfile: getStageProfile,
    getMoodState: getMoodState,
    lowStatCount: lowStatCount,
    statAverage: statAverage
  };
})();
