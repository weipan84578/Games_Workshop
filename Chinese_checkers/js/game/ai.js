function aiTakeTurn(playerId) {
  if (!game || game.gameOver || currentPlayer() !== playerId) return;
  const chain = [];
  let move = chooseAiMove(playerId, game.board, false);
  if (!move) {
    finishTurn();
    return;
  }
  doMove(move, playerId);
  chain.push(move);
  let guard = 0;
  while (move.jump && guard++ < 10) {
    const jumps = getLegalMoves(move.to, game.board, game.mode, true, playerId);
    if (!jumps.length || Math.random() < .18) break;
    move = chooseBestFrom(jumps, playerId, game.board, 1);
    doMove(move, playerId);
    chain.push(move);
  }
  hint(PLAYER_META[playerId].label + " 移動了 " + chain.length + " 步。");
  finishTurn();
}

function chooseAiMove(playerId, board, chainOnly) {
  const d = DIFFICULTY[game.difficulty];
  const moves = allMoves(board, playerId, game.mode).filter(m => !chainOnly || m.jump);
  if (!moves.length) return null;
  if (Math.random() < d.random) return shuffle(moves)[0];
  return chooseBestFrom(moves, playerId, board, d.depth);
}

function chooseBestFrom(moves, playerId, board, depth) {
  const scored = moves.map(m => ({ move: m, score: scoreMove(m, playerId, board) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, DIFFICULTY[game.difficulty].beam);
  if (depth <= 1) return scored[0].move;
  let best = scored[0];
  scored.forEach(item => {
    const next = cloneBoard(board);
    const piece = next[item.move.from].piece;
    next[item.move.from].piece = null;
    next[item.move.to].piece = piece;
    if (item.move.capture) next[item.move.capture].piece = null;
    const replyPenalty = game.players.filter(p => p !== playerId)
      .reduce((sum, p) => sum + Math.max(0, ...allMoves(next, p, game.mode).map(m => scoreMove(m, p, next))) * .18, 0);
    item.score += evaluate(next, playerId) - replyPenalty;
    if (item.score > best.score) best = item;
  });
  return best.move;
}

function scoreMove(move, playerId, board) {
  const target = targetCenter(playerId);
  const before = hexDistance(move.from, target);
  const after = hexDistance(move.to, target);
  let score = (before - after) * 10;
  if (move.jump) score += 6;
  if (move.capture) score += 28;
  if (targetZone(playerId).includes(move.to)) score += 16;
  if (game.players.length >= 3) {
    const prey = aggroTarget(playerId);
    const preyPieces = getPieces(board, prey);
    if (preyPieces.length) {
      const nearestBefore = Math.min(...preyPieces.map(p => hexDistance(move.from, p)));
      const nearestAfter = Math.min(...preyPieces.map(p => hexDistance(move.to, p)));
      score += (nearestBefore - nearestAfter) * (game.aggro[prey] >= 30 ? 4 : 1.5);
      if (move.capture && board[move.capture].piece && board[move.capture].piece.playerId === prey) score += 18;
    }
  }
  return score + Math.random() * 2;
}

function aggroTarget(playerId) {
  return game.players.filter(p => p !== playerId).sort((a, b) => {
    const sa = (game.aggro[a] || 0) * .6 + winProximity(a) * .4;
    const sb = (game.aggro[b] || 0) * .6 + winProximity(b) * .4;
    return sb - sa;
  })[0];
}

function winProximity(playerId) {
  if (game.mode === "capture") return 100 - getPieces(game.board, playerId).length * 7;
  const target = targetCenter(playerId);
  const pieces = getPieces(game.board, playerId);
  const maxDist = 16 * pieces.length || 1;
  const dist = pieces.reduce((sum, p) => sum + hexDistance(p, target), 0);
  return clamp(100 - dist / maxDist * 100, 0, 100);
}

function evaluate(board, playerId) {
  if (game.mode === "capture") {
    const my = getPieces(board, playerId).length;
    const enemies = game.players.filter(p => p !== playerId).map(p => getPieces(board, p).length);
    return my * 15 - Math.max(...enemies, 0) * 7 - (game.aggro[playerId] || 0) * .35;
  }
  const target = targetCenter(playerId);
  return getPieces(board, playerId).reduce((score, pos) => {
    score -= hexDistance(pos, target) * 4;
    if (targetZone(playerId).includes(pos)) score += 22;
    return score;
  }, -(game.aggro[playerId] || 0) * .3);
}
