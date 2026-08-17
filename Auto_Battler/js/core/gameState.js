(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var saveKey = app.Storage.SAVE_KEY;

  function defaultSettings() {
    return { theme: "cute", language: app.I18n ? app.I18n.getLanguage() : "zh-TW", bgm: 1, sfx: 1, muted: false, battleSpeed: 1, targetStrategy: "nearest" };
  }

  function blankState() {
    return {
      version: 1,
      round: 1,
      gold: 8,
      health: 100,
      level: 1,
      xp: 0,
      xpToNext: 4,
      board: [null, null, null, null, null, null, null, null],
      bench: [],
      shop: [],
      shopLocked: false,
      streak: 0,
      wins: 0,
      losses: 0,
      bestRound: 0,
      mode: "prepare",
      phaseTime: 30,
      awaitingContinue: false,
      selectedId: null,
      lastResult: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function normalizeUnit(value) {
    if (!value || !value.typeId || !app.UnitData.get(value.typeId)) return null;
    return { instanceId: value.instanceId || app.Helpers.uid("unit"), typeId: value.typeId, star: app.Helpers.clamp(Number(value.star) || 1, 1, 3) };
  }

  function normalizeState(raw) {
    var state = blankState();
    if (!raw || typeof raw !== "object") return state;
    Object.keys(state).forEach(function (key) {
      if (raw[key] !== undefined && key !== "board" && key !== "bench") state[key] = raw[key];
    });
    state.board = Array.isArray(raw.board) ? raw.board.slice(0, 8).map(normalizeUnit) : state.board;
    while (state.board.length < 8) state.board.push(null);
    state.bench = Array.isArray(raw.bench) ? raw.bench.map(normalizeUnit).filter(Boolean).slice(0, 8) : [];
    state.shop = Array.isArray(raw.shop) ? raw.shop.map(function (entry) {
      return entry && app.UnitData.get(entry.typeId) ? { typeId: entry.typeId, offerId: entry.offerId || app.Helpers.uid("offer") } : null;
    }).filter(Boolean).slice(0, 5) : [];
    state.round = Math.max(1, Number(state.round) || 1);
    state.gold = Math.max(0, Math.floor(Number(state.gold) || 0));
    state.health = app.Helpers.clamp(Math.floor(Number(state.health) || 0), 0, 100);
    state.level = app.Helpers.clamp(Math.floor(Number(state.level) || 1), 1, 8);
    state.xp = Math.max(0, Math.floor(Number(state.xp) || 0));
    state.xpToNext = Math.max(4, Math.floor(Number(state.xpToNext) || 4));
    state.mode = state.mode === "gameover" ? "gameover" : "prepare";
    state.phaseTime = app.Helpers.clamp(Math.floor(Number(raw.phaseTime) || 30), 0, 30);
    state.awaitingContinue = state.mode === "prepare" && raw.awaitingContinue === true;
    state.selectedId = null;
    return state;
  }

  var current = null;

  app.GameState = {
    SETTINGS_DEFAULTS: defaultSettings,
    get: function () { return current; },
    createNew: function () {
      current = blankState();
      current.board[4] = app.UnitData.create("mossling", 1);
      current.updatedAt = Date.now();
      return current;
    },
    load: function () {
      var saved = app.Storage.load(saveKey, null);
      if (!saved) return null;
      current = normalizeState(saved);
      return current;
    },
    hasSave: function () {
      return app.Storage.has(saveKey);
    },
    save: function () {
      if (!current) return false;
      current.updatedAt = Date.now();
      var snapshot = app.Helpers.clone(current);
      snapshot.selectedId = null;
      snapshot.mode = current.mode === "battle" ? "prepare" : current.mode;
      snapshot.phaseTime = Math.max(0, Math.floor(Number(current.phaseTime) || 30));
      app.Storage.save(saveKey, snapshot);
      return true;
    },
    clearSave: function () {
      app.Storage.remove(saveKey);
      current = null;
    },
    loadSettings: function () {
      var stored = app.Storage.load(app.Storage.SETTINGS_KEY, {});
      return Object.assign(defaultSettings(), stored || {});
    },
    saveSettings: function (settings) {
      var next = Object.assign(defaultSettings(), settings || {});
      app.Storage.save(app.Storage.SETTINGS_KEY, next);
      return next;
    },
    emit: function (type, detail) {
      document.dispatchEvent(new CustomEvent("autobattler:" + type, { detail: detail || {} }));
    }
  };
}(window));
