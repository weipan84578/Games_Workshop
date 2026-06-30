(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;

  function blankBoard() {
    var board = [];
    for (var i = 0; i < 24; i += 1) {
      board.push(null);
    }
    return board;
  }

  function create(difficulty) {
    return {
      version: C.VERSION,
      timestamp: Date.now(),
      difficulty: difficulty || "normal",
      phase: C.PHASES.PLACING,
      currentTurn: C.PLAYERS.PLAYER,
      board: blankBoard(),
      playerPiecesInHand: 9,
      aiPiecesInHand: 9,
      playerPiecesOnBoard: 0,
      aiPiecesOnBoard: 0,
      awaitingRemoval: null,
      history: [],
      undoStack: [],
      movesSinceCapture: 0,
      gameOver: false,
      winner: null,
      lastMove: null
    };
  }

  function clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function opponent(actor) {
    return actor === C.PLAYERS.PLAYER ? C.PLAYERS.AI : C.PLAYERS.PLAYER;
  }

  function handKey(actor) {
    return actor === C.PLAYERS.PLAYER ? "playerPiecesInHand" : "aiPiecesInHand";
  }

  function boardKey(actor) {
    return actor === C.PLAYERS.PLAYER ? "playerPiecesOnBoard" : "aiPiecesOnBoard";
  }

  function getHand(state, actor) {
    return Number(state[handKey(actor)] || 0);
  }

  function setHand(state, actor, value) {
    state[handKey(actor)] = Math.max(0, value);
  }

  function getOnBoard(state, actor) {
    return Number(state[boardKey(actor)] || 0);
  }

  function setOnBoard(state, actor, value) {
    state[boardKey(actor)] = Math.max(0, value);
  }

  function currentPhaseFor(state, actor) {
    if (getHand(state, actor) > 0) {
      return C.PHASES.PLACING;
    }
    if (getOnBoard(state, actor) === 3) {
      return C.PHASES.FLYING;
    }
    return C.PHASES.MOVING;
  }

  function syncPhase(state) {
    if (getHand(state, C.PLAYERS.PLAYER) + getHand(state, C.PLAYERS.AI) > 0) {
      state.phase = C.PHASES.PLACING;
    } else {
      state.phase = C.PHASES.MOVING;
    }
    return state.phase;
  }

  function normalizeBoard(board) {
    var normalized = blankBoard();
    var i;
    if (Array.isArray(board)) {
      for (i = 0; i < 24; i += 1) {
        normalized[i] = board[i] === C.PLAYERS.PLAYER || board[i] === C.PLAYERS.AI ? board[i] : null;
      }
      return normalized;
    }
    if (board && typeof board === "object") {
      for (i = 0; i < 24; i += 1) {
        normalized[i] = board[i] === C.PLAYERS.PLAYER || board[i] === C.PLAYERS.AI ? board[i] : null;
      }
    }
    return normalized;
  }

  function recount(state) {
    var playerCount = 0;
    var aiCount = 0;
    for (var i = 0; i < 24; i += 1) {
      if (state.board[i] === C.PLAYERS.PLAYER) {
        playerCount += 1;
      }
      if (state.board[i] === C.PLAYERS.AI) {
        aiCount += 1;
      }
    }
    state.playerPiecesOnBoard = playerCount;
    state.aiPiecesOnBoard = aiCount;
  }

  function normalize(raw) {
    var state = create(raw && raw.difficulty);
    if (!raw || typeof raw !== "object") {
      return state;
    }
    state.version = raw.version || C.VERSION;
    state.timestamp = Number(raw.timestamp || Date.now());
    state.difficulty = C.DIFFICULTIES.indexOf(raw.difficulty) >= 0 ? raw.difficulty : "normal";
    state.currentTurn = raw.currentTurn === C.PLAYERS.AI ? C.PLAYERS.AI : C.PLAYERS.PLAYER;
    state.board = normalizeBoard(raw.board);
    state.playerPiecesInHand = Math.max(0, Math.min(9, Number(raw.playerPiecesInHand || 0)));
    state.aiPiecesInHand = Math.max(0, Math.min(9, Number(raw.aiPiecesInHand || 0)));
    state.awaitingRemoval = raw.awaitingRemoval && raw.awaitingRemoval.by ? raw.awaitingRemoval : null;
    state.history = Array.isArray(raw.history) ? raw.history.slice(-C.MAX_HISTORY) : [];
    state.undoStack = Array.isArray(raw.undoStack) ? raw.undoStack.slice(-12) : [];
    state.movesSinceCapture = Math.max(0, Number(raw.movesSinceCapture || 0));
    state.gameOver = Boolean(raw.gameOver);
    state.winner = raw.winner || null;
    state.lastMove = raw.lastMove || null;
    recount(state);
    syncPhase(state);
    return state;
  }

  function addHistory(state, entry) {
    var historyEntry = entry || {};
    historyEntry.index = state.history.length + 1;
    historyEntry.timestamp = Date.now();
    state.history.push(historyEntry);
    if (state.history.length > C.MAX_HISTORY) {
      state.history = state.history.slice(-C.MAX_HISTORY);
    }
  }

  function pushUndo(state) {
    if (state.gameOver || state.currentTurn !== C.PLAYERS.PLAYER || state.awaitingRemoval) {
      return;
    }
    var snapshot = clone(state);
    snapshot.undoStack = [];
    state.undoStack = state.undoStack || [];
    state.undoStack.push(snapshot);
    if (state.undoStack.length > 12) {
      state.undoStack.shift();
    }
  }

  function popUndo(state) {
    if (!state.undoStack || !state.undoStack.length) {
      return null;
    }
    return normalize(state.undoStack.pop());
  }

  NMM.GameState = {
    create: create,
    clone: clone,
    normalize: normalize,
    opponent: opponent,
    handKey: handKey,
    boardKey: boardKey,
    getHand: getHand,
    setHand: setHand,
    getOnBoard: getOnBoard,
    setOnBoard: setOnBoard,
    currentPhaseFor: currentPhaseFor,
    syncPhase: syncPhase,
    recount: recount,
    addHistory: addHistory,
    pushUndo: pushUndo,
    popUndo: popUndo
  };
})(window);
