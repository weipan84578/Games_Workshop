window.VP = window.VP || {};

VP.PetModel = (function () {
  var STAGES = [
    { id: "egg", level: 1 },
    { id: "baby", level: 2 },
    { id: "child", level: 4 },
    { id: "adult", level: 7 }
  ];

  function getStage(level) {
    var stage = STAGES[0].id;
    STAGES.forEach(function (item) {
      if (level >= item.level) {
        stage = item.id;
      }
    });
    return stage;
  }

  function getMoodState(stats, isSleeping) {
    if (isSleeping) {
      return "sleeping";
    }
    if (!stats || stats.health < 30) {
      return "sick";
    }
    if (stats.mood < 30 || stats.hunger < 25 || stats.clean < 25) {
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
    getStage: getStage,
    getMoodState: getMoodState,
    lowStatCount: lowStatCount,
    statAverage: statAverage
  };
})();
