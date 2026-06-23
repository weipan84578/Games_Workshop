(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function evaluateBoard(board) {
    let score = 0;
    for (let point = 1; point <= 24; point += 1) {
      const checker = board.points[point];
      if (checker.color === BG.COLOR.AI) {
        score += point * checker.count * 2;
        if (checker.count >= 2) score += 8;
        if (checker.count === 1) score -= 10;
      }
      if (checker.color === BG.COLOR.PLAYER) {
        score -= (25 - point) * checker.count * 2;
        if (checker.count >= 2) score -= 6;
        if (checker.count === 1) score += 8;
      }
    }
    score += board.home.ai * 25;
    score -= board.home.player * 25;
    score -= board.bar.ai * 16;
    score += board.bar.player * 18;
    return score;
  }

  function applySequence(board, sequence, color) {
    return sequence.reduce((current, move) => BG.Rules.applyMove(current, move.from, move.to, color, move.die), board);
  }

  BG.AiNormal = {
    evaluateBoard,

    computeMoves(boardState, dice) {
      const sequences = BG.Rules.getLegalTurnSequences(boardState, BG.COLOR.AI, dice).filter((sequence) => sequence.length > 0);
      if (!sequences.length) return [];
      let best = sequences[0];
      let bestScore = -Infinity;
      sequences.forEach((sequence) => {
        const next = applySequence(boardState, sequence, BG.COLOR.AI);
        let score = evaluateBoard(next);
        sequence.forEach((move) => {
          if (move.to === 25) score += 20;
          const before = boardState.points[move.to];
          if (before && before.color === BG.COLOR.PLAYER && before.count === 1) score += 15;
        });
        if (score > bestScore) {
          bestScore = score;
          best = sequence;
        }
      });
      return best;
    },
  };
})(window);
