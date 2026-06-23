(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function applySequence(board, sequence, color) {
    return sequence.reduce((current, move) => BG.Rules.applyMove(current, move.from, move.to, color, move.die), board);
  }

  function bestPlayerResponseScore(board) {
    const diceSamples = [[6, 6, 6, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 1, 1, 1]];
    let total = 0;
    diceSamples.forEach((dice) => {
      const sequences = BG.Rules.getLegalTurnSequences(board, BG.COLOR.PLAYER, dice).filter((sequence) => sequence.length > 0);
      if (!sequences.length) {
        total += BG.AiNormal.evaluateBoard(board);
        return;
      }
      let worstForAi = Infinity;
      sequences.slice(0, 80).forEach((sequence) => {
        const next = applySequence(board, sequence, BG.COLOR.PLAYER);
        worstForAi = Math.min(worstForAi, BG.AiNormal.evaluateBoard(next));
      });
      total += worstForAi;
    });
    return total / diceSamples.length;
  }

  BG.AiHard = {
    MAX_SEQUENCE_SCAN: 140,

    computeMoves(boardState, dice) {
      const sequences = BG.Rules.getLegalTurnSequences(boardState, BG.COLOR.AI, dice).filter((sequence) => sequence.length > 0);
      if (!sequences.length) return [];
      let best = sequences[0];
      let bestScore = -Infinity;
      sequences.slice(0, this.MAX_SEQUENCE_SCAN).forEach((sequence) => {
        const next = applySequence(boardState, sequence, BG.COLOR.AI);
        const immediate = BG.AiNormal.evaluateBoard(next);
        const response = bestPlayerResponseScore(next);
        const score = immediate * 0.72 + response * 0.28 + sequence.length * 4;
        if (score > bestScore) {
          bestScore = score;
          best = sequence;
        }
      });
      return best;
    },
  };
})(window);
