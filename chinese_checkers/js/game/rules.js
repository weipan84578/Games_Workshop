function getLegalMoves(pos, board = game.board, mode = game.mode, chainOnly = false, playerId = null) {
  const piece = board[pos] && board[pos].piece;
  const mover = playerId || (piece && piece.playerId);
  if (!mover) return [];
  const origin = parseKey(pos);
  const moves = [];
  if (!chainOnly) {
    HEX_DIRECTIONS.forEach(d => {
      const dest = add(origin, d);
      if (boardSet.has(dest) && board[dest] && !board[dest].piece) {
        moves.push({ from: pos, to: dest, jump: false, capture: null });
      }
    });
  }
  HEX_DIRECTIONS.forEach(d => {
    const mid = add(origin, d);
    const land = add(origin, d, 2);
    if (!boardSet.has(land) || !board[mid] || !board[land]) return;
    const midPiece = board[mid].piece;
    if (!midPiece || board[land].piece) return;
    const isEnemy = midPiece.playerId !== mover;
    moves.push({ from: pos, to: land, jump: true, capture: mode === "capture" && isEnemy ? mid : null });
  });
  return moves;
}

function allMoves(board, playerId, mode) {
  const moves = [];
  getPieces(board, playerId).forEach(pos => moves.push(...getLegalMoves(pos, board, mode, false, playerId)));
  return moves;
}

function applyMove(move, real = true) {
  const board = real ? game.board : cloneBoard(game.board);
  const piece = board[move.from].piece;
  board[move.from].piece = null;
  board[move.to].piece = piece;
  if (move.capture) board[move.capture].piece = null;
  return board;
}

function cloneBoard(board) {
  const out = {};
  Object.keys(board).forEach(pos => {
    out[pos] = { piece: board[pos].piece ? { ...board[pos].piece } : null };
  });
  return out;
}

function handleClick(x, y) {
  if (!game || game.gameOver || !isHumanTurn()) return;
  ensureAudioCtx();
  const pos = clickedNode(x, y);
  if (!pos) return;
  const player = currentPlayer();
  if (game.selected && game.legal.some(m => m.to === pos)) {
    const move = game.legal.find(m => m.to === pos);
    moveHuman(move);
    return;
  }
  if (game.chainCell) {
    hint("必須從目前棋子繼續連跳，或結束連跳。");
    sfx("tap");
    return;
  }
  const piece = game.board[pos].piece;
  if (!piece || piece.playerId !== player) {
    hint("請選擇自己的紅棋。");
    sfx("tap");
    return;
  }
  selectPiece(pos);
}

function selectPiece(pos, chainOnly = false) {
  game.selected = pos;
  game.legal = getLegalMoves(pos, game.board, game.mode, chainOnly);
  game.phase = "selected";
  if (!game.legal.length) hint(chainOnly ? "這顆棋沒有後續跳躍，可結束連跳。" : "這顆棋目前沒有合法步。");
  else hint("選擇亮起的位置移動。");
  sfx("tap");
  draw();
}

function moveHuman(move) {
  doMove(move, "red");
  if (move.jump) {
    const jumps = getLegalMoves(move.to, game.board, game.mode, true);
    if (jumps.length) {
      game.chainCell = move.to;
      game.selected = move.to;
      game.legal = jumps;
      game.phase = "chaining";
      document.getElementById("end-chain-btn").hidden = false;
      hint("可以繼續連跳，或結束連跳。");
      updatePlayers();
      draw();
      return;
    }
  }
  finishTurn();
}

function doMove(move, playerId) {
  applyMove(move, true);
  if (move.capture) {
    game.captures[playerId]++;
    adjustAggro(playerId, 8);
    adjustAggro(game.board[move.to].piece.playerId, 5);
    sfx("capture");
  } else if (move.jump) {
    adjustAggro(playerId, 3);
    sfx("jump");
  } else {
    sfx("move");
  }
  if (targetZone(playerId).includes(move.to)) adjustAggro(playerId, 2);
}

function finishTurn() {
  document.getElementById("end-chain-btn").hidden = true;
  game.selected = null;
  game.legal = [];
  game.chainCell = null;
  game.phase = "idle";
  if (checkGameOver()) return;
  advanceTurn();
  updatePlayers();
  updateHint();
  draw();
  maybeAiTurn();
}

function advanceTurn() {
  let advanced = 0;
  do {
    game.turn = (game.turn + 1) % game.players.length;
    if (game.turn === 0) {
      game.round++;
      decayAggro();
    }
    advanced++;
  } while (
    game.mode === "capture" &&
    advanced <= game.players.length &&
    getPieces(game.board, currentPlayer()).length === 0
  );
}

function endChain() {
  if (!game || !game.chainCell || !isHumanTurn()) return;
  finishTurn();
}

function adjustAggro(playerId, amount) {
  if (!game || !game.aggro[playerId]) game.aggro[playerId] = 0;
  game.aggro[playerId] = clamp(game.aggro[playerId] + amount, 0, 100);
}
function decayAggro() {
  game.players.forEach(p => game.aggro[p] = clamp(game.aggro[p] - 2, 0, 100));
}

function checkGameOver() {
  let winner = null;
  if (game.mode === "homecoming") {
    winner = game.players.find(p => targetZone(p).every(pos => game.board[pos].piece && game.board[pos].piece.playerId === p));
  } else {
    const alive = game.players.filter(p => getPieces(game.board, p).length > 0);
    if (alive.length === 1) winner = alive[0];
  }
  if (!winner) return false;
  game.gameOver = true;
  game.winner = winner;
  updatePlayers();
  draw();
  sfx(winner === "red" ? "win" : "lose");
  setTimeout(() => showResult(winner), 800);
  return true;
}

function maybeAiTurn() {
  if (!game || game.gameOver || currentPlayer() === "red") return;
  game.phase = "ai-thinking";
  updateHint();
  draw();
  const player = currentPlayer();
  const d = DIFFICULTY[game.difficulty];
  aiTimer = setTimeout(() => aiTakeTurn(player), d.delay);
}
