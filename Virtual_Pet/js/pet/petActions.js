window.VP = window.VP || {};

VP.PetActions = (function () {
  var ACTIONS = {
    feed: {
      stat: { hunger: 30, mood: 4 },
      exp: 12,
      sfx: "feed",
      animation: "feed"
    },
    play: {
      stat: { mood: 25, energy: -10, clean: -5, hunger: -5 },
      exp: 16,
      sfx: "play",
      animation: "play"
    },
    clean: {
      stat: { clean: 40, mood: 5 },
      exp: 12,
      sfx: "clean",
      animation: "clean"
    },
    sleep: {
      stat: { energy: 50, mood: 3 },
      exp: 10,
      sfx: "sleep",
      animation: "sleep",
      sleepMs: 7000
    },
    pet: {
      stat: { mood: 10 },
      exp: 8,
      sfx: "pet-stroke",
      animation: "pet"
    }
  };

  function list() {
    return Object.keys(ACTIONS);
  }

  function get(id) {
    return ACTIONS[id];
  }

  function apply(id, state) {
    var action = ACTIONS[id];
    if (!action || !state) {
      return null;
    }

    Object.keys(action.stat).forEach(function (key) {
      state.stats[key] = VP.dom.clamp(state.stats[key] + action.stat[key], 0, 100);
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
    return action;
  }

  return {
    list: list,
    get: get,
    apply: apply
  };
})();
