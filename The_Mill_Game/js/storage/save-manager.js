(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var GS = NMM.GameState;
  var C = NMM.Constants;
  var SAVE_KEY = "nmm_save_game";
  var SETTINGS_KEY = "nmm_settings";
  var FIRST_KEY = "nmm_first_launch";
  var REPLAY_KEY = "nmm_replays";
  var MAX_REPLAYS = 3;

  function safeGet(key) {
    try {
      return global.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      global.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      global.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function defaultSettings() {
    return {
      language: NMM.I18n ? NMM.I18n.detectLanguage() : "zh",
      theme: "classic",
      difficulty: "normal",
      musicEnabled: true,
      sfxEnabled: true,
      volume: 0.55
    };
  }

  function loadSettings() {
    var settings = defaultSettings();
    var raw = safeGet(SETTINGS_KEY);
    if (!raw) {
      return settings;
    }
    try {
      var parsed = JSON.parse(raw);
      settings.language = C.LANGUAGES.indexOf(parsed.language) >= 0 ? parsed.language : settings.language;
      settings.theme = C.THEMES.indexOf(parsed.theme) >= 0 ? parsed.theme : settings.theme;
      settings.difficulty = C.DIFFICULTIES.indexOf(parsed.difficulty) >= 0 ? parsed.difficulty : settings.difficulty;
      settings.musicEnabled = typeof parsed.musicEnabled === "boolean" ? parsed.musicEnabled : settings.musicEnabled;
      settings.sfxEnabled = typeof parsed.sfxEnabled === "boolean" ? parsed.sfxEnabled : settings.sfxEnabled;
      settings.volume = Math.max(0, Math.min(1, Number(parsed.volume)));
      if (!Number.isFinite(settings.volume)) {
        settings.volume = 0.55;
      }
    } catch (error) {
      safeRemove(SETTINGS_KEY);
    }
    return settings;
  }

  function saveSettings(settings) {
    return safeSet(SETTINGS_KEY, JSON.stringify(settings));
  }

  function saveGame(state) {
    if (!state || state.gameOver) {
      clearGame();
      return true;
    }
    state.timestamp = Date.now();
    return safeSet(SAVE_KEY, JSON.stringify(state));
  }

  function loadGame() {
    var raw = safeGet(SAVE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return GS.normalize(JSON.parse(raw));
    } catch (error) {
      safeRemove(SAVE_KEY);
      return null;
    }
  }

  function hasGame() {
    var state = loadGame();
    return Boolean(state && !state.gameOver);
  }

  function clearGame() {
    return safeRemove(SAVE_KEY);
  }

  function normalizeReplay(raw) {
    var replay;
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.history)) {
      return null;
    }
    replay = {
      id: String(raw.id || raw.savedAt || Date.now()),
      version: raw.version || C.VERSION,
      savedAt: Number(raw.savedAt || Date.now()),
      endedAt: Number(raw.endedAt || raw.savedAt || Date.now()),
      difficulty: C.DIFFICULTIES.indexOf(raw.difficulty) >= 0 ? raw.difficulty : "normal",
      winner: raw.winner || null,
      moveCount: Number(raw.moveCount || raw.history.length),
      history: raw.history.slice(),
      finalBoard: Array.isArray(raw.finalBoard) ? raw.finalBoard.slice(0, 24) : []
    };
    return replay.history.length ? replay : null;
  }

  function loadReplays() {
    var raw = safeGet(REPLAY_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw).map(normalizeReplay).filter(Boolean).sort(function (a, b) {
        return b.savedAt - a.savedAt;
      }).slice(0, MAX_REPLAYS);
    } catch (error) {
      safeRemove(REPLAY_KEY);
      return [];
    }
  }

  function saveReplays(replays) {
    return safeSet(REPLAY_KEY, JSON.stringify(replays.slice(0, MAX_REPLAYS)));
  }

  function simplifyHistory(history) {
    return history.map(function (entry, index) {
      return {
        index: Number(entry.index || index + 1),
        type: entry.type,
        by: entry.by,
        from: typeof entry.from === "number" ? entry.from : null,
        to: typeof entry.to === "number" ? entry.to : null,
        formedMill: Boolean(entry.formedMill),
        removed: typeof entry.removed === "number" ? entry.removed : null,
        timestamp: Number(entry.timestamp || Date.now())
      };
    });
  }

  function addReplay(state) {
    var now = Date.now();
    var existing = loadReplays().sort(function (a, b) {
      return a.savedAt - b.savedAt;
    });
    var history;
    var replay;
    var overwritten = null;

    if (!state || !state.gameOver || !Array.isArray(state.history) || !state.history.length) {
      return null;
    }

    history = simplifyHistory(state.history);
    replay = {
      id: String(now),
      version: C.VERSION,
      savedAt: now,
      endedAt: now,
      difficulty: state.difficulty || "normal",
      winner: state.winner || null,
      moveCount: history.length,
      history: history,
      finalBoard: state.board.slice()
    };

    existing.push(replay);
    while (existing.length > MAX_REPLAYS) {
      overwritten = existing.shift();
    }
    saveReplays(existing.sort(function (a, b) {
      return b.savedAt - a.savedAt;
    }));
    return { replay: replay, overwritten: overwritten };
  }

  function deleteReplay(id) {
    var replays = loadReplays();
    var remaining = replays.filter(function (replay) {
      return replay.id !== id;
    });
    saveReplays(remaining);
    return remaining.length !== replays.length;
  }

  function markLaunched() {
    safeSet(FIRST_KEY, "false");
  }

  NMM.SaveManager = {
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    saveGame: saveGame,
    loadGame: loadGame,
    hasGame: hasGame,
    clearGame: clearGame,
    loadReplays: loadReplays,
    addReplay: addReplay,
    deleteReplay: deleteReplay,
    markLaunched: markLaunched
  };
})(window);
