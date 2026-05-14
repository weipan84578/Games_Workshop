function generateBoard() {
  const all = new Set();
  for (let q = -4; q <= 4; q++) {
    for (let r = -8; r <= 8; r++) {
      if (starContains(q, r)) all.add(key(q, r));
    }
  }
  for (let q = -8; q <= 8; q++) {
    for (let r = -8; r <= 8; r++) {
      if (starContains(q, r)) all.add(key(q, r));
    }
  }
  boardNodes = [...all].map(p => ({ pos: p, ...parseKey(p) }));
  boardSet = all;
  zones = {
    top: triangle("top"),
    bottom: triangle("bottom"),
    left: triangle("left"),
    right: triangle("right"),
    upperLeft: triangle("upperLeft"),
    lowerRight: triangle("lowerRight")
  };
}

function makeBoard(players, assignments) {
  const board = {};
  boardNodes.forEach(n => board[n.pos] = { piece: null });
  players.forEach(id => {
    zones[assignments[id].start].forEach(pos => board[pos].piece = { playerId: id, color: PLAYER_META[id].color });
  });
  return board;
}

function activePlayers(count, mode = setup.mode) {
  const safeCount = mode === "homecoming" ? Math.min(count, 3) : count;
  if (safeCount === 2) return ["red", "blue"];
  if (safeCount === 3) return ["red", "blue", "green"];
  return ["red", "blue", "green", "yellow"];
}

function buildAssignments(players, mode) {
  const assignments = {};
  let starts;
  if (mode === "homecoming") {
    starts = shuffle(shuffle(HOME_TRIADS)[0]).slice(0, players.length);
  } else {
    starts = shuffle(ALL_ZONES).slice(0, players.length);
  }
  players.forEach((id, index) => {
    const start = starts[index];
    assignments[id] = {
      start,
      target: mode === "homecoming" ? ZONE_OPPOSITE[start] : null
    };
  });
  return assignments;
}

function targetZone(playerId) {
  if (!game || !game.assignments[playerId] || !game.assignments[playerId].target) return [];
  return zones[game.assignments[playerId].target] || [];
}
function targetCenter(playerId) {
  const cells = targetZone(playerId);
  if (!cells.length) return { q: 0, r: 0 };
  const sum = cells.reduce((acc, p) => {
    const n = parseKey(p);
    acc.q += n.q; acc.r += n.r;
    return acc;
  }, { q: 0, r: 0 });
  return { q: sum.q / cells.length, r: sum.r / cells.length };
}

function newGame() {
  clearTimeout(aiTimer);
  if (setup.mode === "homecoming" && setup.players > 3) setup.players = 3;
  const players = activePlayers(setup.players, setup.mode);
  const assignments = buildAssignments(players, setup.mode);
  game = {
    mode: setup.mode,
    difficulty: setup.difficulty,
    players,
    assignments,
    board: makeBoard(players, assignments),
    turn: 0,
    round: 1,
    selected: null,
    legal: [],
    chainCell: null,
    phase: "idle",
    aggro: Object.fromEntries(players.map(p => [p, 0])),
    captures: Object.fromEntries(players.map(p => [p, 0])),
    gameOver: false,
    winner: null,
    startedAt: Date.now()
  };
  showScreen("game");
  resizeCanvas();
  updatePlayers();
  updateHint();
  draw();
  ensureMusic();
  maybeAiTurn();
}

function currentPlayer() { return game.players[game.turn % game.players.length]; }
function isHumanTurn() { return currentPlayer() === "red" && game.phase !== "ai-thinking"; }
function getPieces(board, playerId) {
  return Object.keys(board).filter(pos => board[pos].piece && board[pos].piece.playerId === playerId);
}
