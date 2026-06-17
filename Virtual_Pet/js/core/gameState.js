window.VP = window.VP || {};

VP.GameState = (function () {
  var MAX_OFFLINE_SECONDS = 12 * 60 * 60;
  var AUTOSAVE_MS = 30000;
  var state = null;
  var tickTimer = 0;
  var lastTickAt = 0;
  var lastAutosaveAt = 0;

  function defaultSettings(settings) {
    settings = settings || {};
    return {
      lang: settings.lang || "zh",
      theme: settings.theme || "candy",
      bgmVolume: settings.bgmVolume === undefined ? 0.6 : Number(settings.bgmVolume),
      sfxVolume: settings.sfxVolume === undefined ? 0.8 : Number(settings.sfxVolume),
      reducedMotion: Boolean(settings.reducedMotion),
      textScale: Number(settings.textScale || 100)
    };
  }

  function createDefault(settings) {
    var now = Date.now();
    return {
      version: "1.0",
      petName: "Mochi",
      stage: "egg",
      level: 1,
      exp: 0,
      bornAt: now,
      totalCare: 0,
      stats: {
        hunger: 78,
        mood: 72,
        clean: 86,
        energy: 74,
        health: 100
      },
      isSleeping: false,
      sleepingUntil: 0,
      lastAction: "",
      activity: [],
      settings: defaultSettings(settings),
      lastSavedAt: now,
      lastUpdatedAt: now
    };
  }

  function hydrate(save, settings) {
    var base = createDefault(settings);
    save = save || {};
    base.petName = save.petName || base.petName;
    base.level = Number(save.level || 1);
    base.exp = Number(save.exp || 0);
    base.stage = save.stage || VP.PetModel.getStage(base.level);
    base.bornAt = Number(save.bornAt || base.bornAt);
    base.totalCare = Number(save.totalCare || 0);
    base.stats = Object.assign(base.stats, save.stats || {});
    base.isSleeping = Boolean(save.isSleeping);
    base.sleepingUntil = Number(save.sleepingUntil || 0);
    base.lastAction = save.lastAction || "";
    base.activity = Array.isArray(save.activity) ? save.activity.slice(0, 5) : [];
    base.lastSavedAt = Number(save.lastSavedAt || Date.now());
    base.lastUpdatedAt = base.lastSavedAt;
    base.settings = defaultSettings(Object.assign({}, save, settings || {}));
    return base;
  }

  function getState() {
    return state;
  }

  function getSettings() {
    return state ? state.settings : defaultSettings();
  }

  function notify(reason) {
    if (!state) {
      return;
    }
    VP.EventBus.emit("state:changed", { state: state, reason: reason || "update" });
  }

  function addLog(messageKey) {
    if (!state) {
      return;
    }
    state.activity.unshift({
      messageKey: messageKey,
      at: Date.now()
    });
    state.activity = state.activity.slice(0, 5);
  }

  function applyHealthDelta(seconds) {
    var avg = VP.PetModel.statAverage(state.stats);
    var lowCount = VP.PetModel.lowStatCount(state.stats);

    if (avg < 35 || lowCount >= 2) {
      state.stats.health = VP.dom.clamp(state.stats.health - seconds * (0.018 + lowCount * 0.006), 0, 100);
    } else if (avg > 72 && state.stats.health < 100) {
      state.stats.health = VP.dom.clamp(state.stats.health + seconds * 0.006, 0, 100);
    }
  }

  function applyDecay(seconds) {
    if (!state || seconds <= 0 || state.stats.health <= 0) {
      return;
    }

    if (state.sleepingUntil && Date.now() >= state.sleepingUntil) {
      state.isSleeping = false;
      state.sleepingUntil = 0;
    }

    var sleepFactor = state.isSleeping ? 0.25 : 1;
    state.stats.hunger = VP.dom.clamp(state.stats.hunger - seconds * 0.012, 0, 100);
    state.stats.mood = VP.dom.clamp(state.stats.mood - seconds * 0.008 * sleepFactor, 0, 100);
    state.stats.clean = VP.dom.clamp(state.stats.clean - seconds * 0.006, 0, 100);
    if (state.isSleeping) {
      state.stats.energy = VP.dom.clamp(state.stats.energy + seconds * 0.09, 0, 100);
    } else {
      state.stats.energy = VP.dom.clamp(state.stats.energy - seconds * 0.005, 0, 100);
    }
    applyHealthDelta(seconds);
    state.lastUpdatedAt = Date.now();
  }

  function applyElapsed(lastSavedAt) {
    var elapsed = Math.min(Math.max((Date.now() - lastSavedAt) / 1000, 0), MAX_OFFLINE_SECONDS);
    applyDecay(elapsed);
  }

  function save(reason) {
    if (!state || !VP.SaveManager) {
      return false;
    }
    state.stage = VP.PetModel.getStage(state.level);
    state.lastSavedAt = Date.now();
    var ok = VP.SaveManager.save(state);
    if (ok && reason) {
      VP.EventBus.emit("game:saved", reason);
    }
    return ok;
  }

  function addExp(amount) {
    var oldStage = state.stage;
    state.exp += amount;
    while (state.exp >= 100) {
      state.exp -= 100;
      state.level += 1;
    }
    state.stage = VP.PetModel.getStage(state.level);
    if (oldStage !== state.stage) {
      addLog("actionMessages.levelup");
      VP.AudioManager.playSfx(state.stage === "baby" ? "hatch" : "levelup");
      VP.PetAnimation.play("levelup", 900);
      VP.EventBus.emit("pet:levelup", state.stage);
      return true;
    }
    return false;
  }

  function performAction(actionId) {
    if (!state || state.stats.health <= 0) {
      VP.AudioManager.playSfx("error");
      return false;
    }
    var action = VP.PetActions.apply(actionId, state);
    if (!action) {
      VP.AudioManager.playSfx("error");
      return false;
    }
    var leveled = addExp(action.exp);
    addLog("actionMessages." + actionId);
    VP.AudioManager.playSfx(action.sfx);
    if (!leveled) {
      VP.PetAnimation.play(action.animation, action.animation === "sleep" ? 1200 : 760);
    }
    save("action");
    notify("action");
    return true;
  }

  function startTicking() {
    window.clearInterval(tickTimer);
    lastTickAt = Date.now();
    lastAutosaveAt = Date.now();
    tickTimer = window.setInterval(function () {
      if (!state) {
        return;
      }
      var now = Date.now();
      applyDecay((now - lastTickAt) / 1000);
      lastTickAt = now;
      if (now - lastAutosaveAt >= AUTOSAVE_MS) {
        save("autosave");
        lastAutosaveAt = now;
      }
      notify("tick");
    }, 1000);
  }

  function newGame(settings) {
    state = createDefault(settings);
    addLog("actionMessages.feed");
    save("new");
    startTicking();
    notify("new");
    return state;
  }

  function loadGame(saveData, settings) {
    state = hydrate(saveData, settings);
    applyElapsed(state.lastSavedAt);
    state.stage = VP.PetModel.getStage(state.level);
    save("load");
    startTicking();
    notify("load");
    return state;
  }

  function updateSettings(partial) {
    if (!state) {
      if (VP.SaveManager) {
        VP.SaveManager.persistSettings(defaultSettings(partial));
      }
      return;
    }
    state.settings = Object.assign({}, state.settings, partial || {});
    if (VP.SaveManager) {
      VP.SaveManager.persistSettings(state.settings);
    }
    save("settings");
    notify("settings");
  }

  function clear() {
    state = null;
    window.clearInterval(tickTimer);
  }

  return {
    newGame: newGame,
    loadGame: loadGame,
    getState: getState,
    getSettings: getSettings,
    performAction: performAction,
    updateSettings: updateSettings,
    save: save,
    clear: clear
  };
})();
