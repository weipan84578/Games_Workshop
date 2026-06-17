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

  function createDefault(settings, eggType) {
    var now = Date.now();
    var safeEgg = eggType || "ember";
    return {
      version: "1.1",
      petName: "",
      speciesId: VP.PetCatalog.randomPetId(safeEgg),
      eggType: safeEgg,
      isRevealed: false,
      isDead: false,
      stage: "egg",
      level: 1,
      exp: 0,
      bornAt: now,
      totalCare: 0,
      stats: {
        hunger: 76,
        mood: 68,
        clean: 88,
        energy: 58,
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
    var base = createDefault(settings, save && save.eggType);
    save = save || {};
    base.speciesId = save.speciesId || base.speciesId;
    base.eggType = save.eggType || base.eggType;
    base.isRevealed = Boolean(save.isRevealed || (save.stage && save.stage !== "egg"));
    base.isDead = Boolean(save.isDead);
    base.petName = save.petName || "";
    base.level = Number(save.level || 1);
    base.exp = Number(save.exp || 0);
    base.stage = VP.PetModel.getStage(base.level);
    base.bornAt = Number(save.bornAt || base.bornAt);
    base.totalCare = Number(save.totalCare || 0);
    base.stats = Object.assign(base.stats, save.stats || {});
    base.isSleeping = Boolean(save.isSleeping);
    base.sleepingUntil = Number(save.sleepingUntil || 0);
    base.lastAction = save.lastAction || "";
    base.activity = Array.isArray(save.activity) ? save.activity.slice(0, 6) : [];
    base.lastSavedAt = Number(save.lastSavedAt || Date.now());
    base.lastUpdatedAt = base.lastSavedAt;
    base.settings = defaultSettings(Object.assign({}, save, settings || {}));
    if (base.isRevealed) {
      VP.PetCatalog.markSeen(base.speciesId);
    }
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

  function addLog(messageKey, params) {
    if (!state) {
      return;
    }
    state.activity.unshift({
      messageKey: messageKey,
      params: params || {},
      at: Date.now()
    });
    state.activity = state.activity.slice(0, 6);
  }

  function revealPet() {
    if (!state || state.isRevealed) {
      return;
    }
    state.isRevealed = true;
    state.petName = VP.PetCatalog.getPetName(state.speciesId, state.settings.lang);
    VP.PetCatalog.markSeen(state.speciesId);
    addLog("actionMessages.hatched", { pet: VP.PetCatalog.getPetName(state.speciesId, state.settings.lang) });
    VP.AudioManager.playSfx("hatch");
  }

  function markRaisedIfNeeded() {
    if (!state || state.stage !== "elder") {
      return;
    }
    VP.PetCatalog.markRaised(state.speciesId);
  }

  function checkDeath(reason) {
    if (!state || state.isDead || state.stats.health > 0) {
      return false;
    }
    state.stats.health = 0;
    state.isDead = true;
    state.isSleeping = false;
    state.sleepingUntil = 0;
    addLog("actionMessages.death");
    if (state.isRevealed) {
      VP.PetCatalog.markMemorial(state.speciesId);
    }
    VP.AudioManager.playBgm("ending");
    VP.EventBus.emit("pet:died", reason || "health");
    return true;
  }

  function applyHealthDelta(seconds) {
    var avg = VP.PetModel.statAverage(state.stats);
    var lowCount = VP.PetModel.lowStatCount(state.stats);
    var profile = VP.PetModel.getStageProfile(state.stage);

    if (profile.passiveHealthLoss) {
      state.stats.health = VP.dom.clamp(state.stats.health - seconds * profile.passiveHealthLoss, 0, 100);
    }

    if (avg < 35 || lowCount >= 2) {
      state.stats.health = VP.dom.clamp(state.stats.health - seconds * (0.018 + lowCount * 0.006), 0, 100);
    } else if (avg > 72 && state.stats.health < 100 && state.stage !== "elder") {
      state.stats.health = VP.dom.clamp(state.stats.health + seconds * 0.006, 0, 100);
    }
  }

  function applyDecay(seconds) {
    if (!state || seconds <= 0 || state.stats.health <= 0 || state.isDead) {
      return;
    }

    if (state.sleepingUntil && Date.now() >= state.sleepingUntil) {
      state.isSleeping = false;
      state.sleepingUntil = 0;
    }

    var profile = VP.PetModel.getStageProfile(state.stage);
    var sleepFactor = state.isSleeping ? 0.25 : 1;
    state.stats.hunger = VP.dom.clamp(state.stats.hunger - seconds * 0.012 * profile.decay.hunger, 0, 100);
    state.stats.mood = VP.dom.clamp(state.stats.mood - seconds * 0.008 * profile.decay.mood * sleepFactor, 0, 100);
    state.stats.clean = VP.dom.clamp(state.stats.clean - seconds * 0.006 * profile.decay.clean, 0, 100);
    if (state.isSleeping) {
      state.stats.energy = VP.dom.clamp(state.stats.energy + seconds * 0.09 * profile.energyGain, 0, 100);
    } else {
      state.stats.energy = VP.dom.clamp(state.stats.energy - seconds * 0.005 * profile.decay.energy, 0, 100);
    }
    applyHealthDelta(seconds);
    state.lastUpdatedAt = Date.now();
    checkDeath("decay");
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
      if (oldStage === "egg") {
        revealPet();
      } else {
        addLog("actionMessages.levelup");
        VP.AudioManager.playSfx("levelup");
      }
      if (state.stage === "elder") {
        markRaisedIfNeeded();
        addLog("actionMessages.elder");
      }
      VP.PetAnimation.play("levelup", 900);
      VP.EventBus.emit("pet:levelup", state.stage);
      return true;
    }
    return false;
  }

  function performAction(actionId) {
    if (!state || state.stats.health <= 0 || state.isDead) {
      VP.AudioManager.playSfx("error");
      return false;
    }
    var action = VP.PetActions.apply(actionId, state);
    if (!action) {
      VP.AudioManager.playSfx("error");
      return false;
    }
    var leveled = addExp(action.expAward);
    addLog("actionMessages." + actionId);
    VP.AudioManager.playSfx(action.sfx);
    if (!leveled) {
      VP.PetAnimation.play(action.animation, action.animation === "sleep" ? 1200 : 760);
    }
    checkDeath("action");
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

  function newGame(settings, eggType) {
    state = createDefault(settings, eggType);
    addLog("actionMessages.eggChosen");
    save("new");
    startTicking();
    notify("new");
    return state;
  }

  function loadGame(saveData, settings) {
    state = hydrate(saveData, settings);
    applyElapsed(state.lastSavedAt);
    state.stage = VP.PetModel.getStage(state.level);
    if (state.stage === "elder") {
      markRaisedIfNeeded();
    }
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
    if (state.isRevealed) {
      state.petName = VP.PetCatalog.getPetName(state.speciesId, state.settings.lang);
    }
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
