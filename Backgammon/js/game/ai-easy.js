(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.AiEasy = {
    computeMoves(boardState, dice) {
      const sequences = BG.Rules.getLegalTurnSequences(boardState, BG.COLOR.AI, dice);
      const playable = sequences.filter((sequence) => sequence.length > 0);
      if (!playable.length) return [];
      return playable[Math.floor(Math.random() * playable.length)];
    },
  };
})(window);
