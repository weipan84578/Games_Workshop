(function () {
  "use strict";

  var DEFAULT_SETTINGS = {
    lang: "zh-TW",
    theme: "classic",
    bgm_volume: 80,
    sfx_volume: 100,
    muted: false
  };

  function createBoards() {
    return Array.from({ length: 3 }, function () {
      return Array.from({ length: 3 }, function () {
        return Array.from({ length: 3 }, function () {
          return Array.from({ length: 3 }, function () { return null; });
        });
      });
    });
  }

  function createMegaBoard() {
    return Array.from({ length: 3 }, function () {
      return Array.from({ length: 3 }, function () { return null; });
    });
  }

  function createLineBoard() {
    return Array.from({ length: 3 }, function () {
      return Array.from({ length: 3 }, function () { return null; });
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function create(difficulty) {
    return {
      version: "1.0",
      boards: createBoards(),
      megaBoard: createMegaBoard(),
      smallWinLines: createLineBoard(),
      megaWinLine: null,
      currentPlayer: "X",
      nextBoard: null,
      phase: "playing",
      winner: null,
      difficulty: difficulty || "normal",
      history: [],
      startTime: Date.now(),
      moveCount: 0,
      lastMove: null,
      aiThinking: false,
      completedAt: null,
      statsRecorded: false
    };
  }

  function snapshot(state) {
    var copy = clone(state);
    copy.history = [];
    copy.aiThinking = false;
    return copy;
  }

  function toSave(state) {
    var save = snapshot(state);
    save.savedAt = Date.now();
    save.history = (state.history || []).map(function (entry) {
      return snapshot(entry);
    });
    return save;
  }

  function fromSave(save) {
    if (!save || save.version !== "1.0" || !Array.isArray(save.boards) || !Array.isArray(save.megaBoard)) {
      throw new Error("Invalid save data");
    }

    var state = create(save.difficulty || "normal");
    Object.keys(state).forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(save, key)) {
        state[key] = clone(save[key]);
      }
    });
    state.phase = state.phase === "ended" ? "ended" : "playing";
    state.history = Array.isArray(save.history) ? clone(save.history) : [];
    state.aiThinking = false;
    return state;
  }

  window.AppDefaults = {
    settings: DEFAULT_SETTINGS
  };

  window.GameState = {
    create: create,
    clone: clone,
    snapshot: snapshot,
    toSave: toSave,
    fromSave: fromSave,
    createBoards: createBoards,
    createMegaBoard: createMegaBoard
  };
})();
