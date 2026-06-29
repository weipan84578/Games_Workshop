(function () {
  "use strict";

  var state = window.GameState.create("normal");
  var listeners = [];
  var aiTimer = null;

  function emit(eventName) {
    listeners.forEach(function (listener) {
      listener(state, eventName);
    });
  }

  function setState(nextState, eventName) {
    state = nextState;
    emit(eventName || "change");
  }

  function getState() {
    return state;
  }

  function onChange(listener) {
    listeners.push(listener);
  }

  function pushHistory(baseState) {
    var history = (baseState.history || []).slice();
    history.push(window.GameState.snapshot(baseState));
    if (history.length > 80) history.shift();
    return history;
  }

  function recordStatsIfNeeded(nextState) {
    if (nextState.phase !== "ended" || nextState.statsRecorded) return nextState;
    var stats = window.StorageManager.loadStats();
    stats.totalGames += 1;
    if (nextState.winner === "X") {
      stats.wins += 1;
      if (!stats.bestMoves || nextState.moveCount < stats.bestMoves) stats.bestMoves = nextState.moveCount;
    } else if (nextState.winner === "O") {
      stats.losses += 1;
    } else {
      stats.draws += 1;
    }
    window.StorageManager.saveStats(stats);
    window.StorageManager.clearSave();
    nextState.statsRecorded = true;
    return nextState;
  }

  function persistOrFinish(nextState) {
    if (nextState.phase === "ended") {
      recordStatsIfNeeded(nextState);
      if (nextState.winner === "draw") window.AudioManager.play("draw");
      else window.AudioManager.play("win");
    } else {
      window.StorageManager.saveGame(nextState);
    }
  }

  function applyGameMove(move, player) {
    var history = pushHistory(state);
    var nextState = window.BoardUtils.applyMove(state, move.br, move.bc, move.cr, move.cc, { player: player });
    nextState.history = history;
    nextState.aiThinking = false;
    persistOrFinish(nextState);
    setState(nextState, "move");
  }

  function chooseAiMove(aiState) {
    if (aiState.difficulty === "hard") return window.AIHard.getMove(aiState);
    if (aiState.difficulty === "normal") return window.AINormal.getMove(aiState);
    return window.AIEasy.getMove(aiState);
  }

  function scheduleAiTurn() {
    if (aiTimer) window.clearTimeout(aiTimer);
    if (state.phase !== "playing" || state.currentPlayer !== "O") return;

    state.aiThinking = true;
    emit("ai-thinking");
    aiTimer = window.setTimeout(function () {
      var move;
      if (state.phase !== "playing" || state.currentPlayer !== "O") return;
      try {
        move = chooseAiMove(window.GameState.snapshot(state));
      } catch (error) {
        console.warn("Hard AI fallback:", error);
        move = window.AINormal.getMove(window.GameState.snapshot(state));
      }

      state.aiThinking = false;
      if (!move || !window.Rules.isValidMove(state, move.br, move.bc, move.cr, move.cc)) {
        move = window.AIEasy.getMove(state);
      }
      if (move) {
        window.AudioManager.play("moveO");
        applyGameMove(move, "O");
      }
    }, 360);
  }

  function start(difficulty) {
    if (aiTimer) window.clearTimeout(aiTimer);
    var nextState = window.GameState.create(difficulty || "normal");
    window.StorageManager.clearSave();
    window.AudioManager.startBgm();
    setState(nextState, "start");
    window.StorageManager.saveGame(nextState);
  }

  function makeMove(br, bc, cr, cc) {
    if (state.aiThinking || state.currentPlayer !== "X") return false;
    if (!window.Rules.isValidMove(state, br, bc, cr, cc)) {
      window.AudioManager.play("invalid");
      return false;
    }

    window.AudioManager.play("moveX");
    applyGameMove({ br: br, bc: bc, cr: cr, cc: cc }, "X");
    if (state.phase === "playing" && state.currentPlayer === "O") {
      scheduleAiTurn();
    }
    return true;
  }

  function undo() {
    if (state.aiThinking || !state.history || !state.history.length) return false;
    var history = state.history.slice();
    var target = null;

    while (history.length) {
      target = history.pop();
      if (target.currentPlayer === "X" && target.phase === "playing") break;
    }

    if (!target) return false;
    target = window.GameState.clone(target);
    target.history = history;
    target.aiThinking = false;
    window.StorageManager.saveGame(target);
    window.AudioManager.play("click");
    setState(target, "undo");
    return true;
  }

  function restart() {
    start(state.difficulty || "normal");
  }

  function saveProgress() {
    if (state.phase === "playing") window.StorageManager.saveGame(state);
  }

  function loadProgress() {
    var save = window.StorageManager.loadGame();
    if (!save) return false;
    var loaded = window.GameState.fromSave(save);
    setState(loaded, "load");
    window.AudioManager.startBgm();
    if (loaded.currentPlayer === "O") scheduleAiTurn();
    return true;
  }

  function getElapsedSeconds() {
    if (!state.startTime) return 0;
    var end = state.completedAt || Date.now();
    return Math.max(0, Math.floor((end - state.startTime) / 1000));
  }

  window.Game = {
    getState: getState,
    onChange: onChange,
    start: start,
    makeMove: makeMove,
    undo: undo,
    restart: restart,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    scheduleAiTurn: scheduleAiTurn,
    getElapsedSeconds: getElapsedSeconds
  };
})();
