window.VP = window.VP || {};

VP.PetActions = (function () {
  var ACTIONS = {
    warm: {
      stages: ["egg"],
      stat: { energy: 18, mood: 8, health: 2 },
      exp: 30,
      sfx: "hatch",
      animation: "warm"
    },
    feed: {
      stages: ["juvenile", "mature", "prime", "elder"],
      stat: { hunger: 30, mood: 4 },
      exp: 12,
      sfx: "feed",
      animation: "feed"
    },
    play: {
      stages: ["juvenile", "mature", "prime", "elder"],
      stat: { mood: 25, energy: -10, clean: -5, hunger: -5 },
      exp: 16,
      sfx: "play",
      animation: "play"
    },
    clean: {
      stages: ["juvenile", "mature", "prime", "elder"],
      stat: { clean: 40, mood: 5 },
      exp: 12,
      sfx: "clean",
      animation: "clean"
    },
    sleep: {
      stages: ["juvenile", "mature", "prime", "elder"],
      stat: { energy: 50, mood: 3 },
      exp: 10,
      sfx: "sleep",
      animation: "sleep",
      sleepMs: 7000
    },
    pet: {
      stages: ["egg", "juvenile", "mature", "prime", "elder"],
      stat: { mood: 10, health: 1 },
      exp: 8,
      eggExp: 18,
      sfx: "pet-stroke",
      animation: "pet"
    },
    train: {
      stages: ["mature", "prime", "elder"],
      stat: { mood: 12, energy: -16, hunger: -8, health: 3 },
      exp: 22,
      sfx: "levelup",
      animation: "play"
    }
  };

  function list() {
    return Object.keys(ACTIONS);
  }

  function get(id) {
    return ACTIONS[id];
  }

  function isAvailable(id, stage) {
    var action = ACTIONS[id];
    return !!action && action.stages.indexOf(stage) >= 0;
  }

  function availableForStage(stage) {
    return list().filter(function (id) {
      return isAvailable(id, stage);
    });
  }

  function scaleStatDelta(key, delta, profile) {
    if (delta > 0) {
      if (key === "energy") {
        return delta * profile.energyGain;
      }
      return delta * profile.careGain;
    }
    if (delta < 0 && key === "energy") {
      return delta * profile.energyCost;
    }
    return delta;
  }

  function apply(id, state) {
    var action = ACTIONS[id];
    if (!action || !state || !isAvailable(id, state.stage) || state.isDead) {
      return null;
    }

    var profile = VP.PetModel.getStageProfile(state.stage);
    Object.keys(action.stat).forEach(function (key) {
      var delta = scaleStatDelta(key, action.stat[key], profile);
      state.stats[key] = VP.dom.clamp(state.stats[key] + delta, 0, 100);
    });

    if (action.sleepMs) {
      state.isSleeping = true;
      state.sleepingUntil = Date.now() + action.sleepMs;
    } else {
      state.isSleeping = false;
      state.sleepingUntil = 0;
    }

    state.totalCare += 1;
    state.lastAction = id;
    return Object.assign({}, action, {
      expAward: Math.max(1, Math.round((state.stage === "egg" && action.eggExp ? action.eggExp : action.exp) * profile.growth))
    });
  }

  return {
    list: list,
    get: get,
    isAvailable: isAvailable,
    availableForStage: availableForStage,
    apply: apply
  };
})();
