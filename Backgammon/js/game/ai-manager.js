(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.AiManager = {
    computeMoves(boardState, dice, difficulty) {
      if (difficulty === "easy") return BG.AiEasy.computeMoves(boardState, dice);
      if (difficulty === "hard") return BG.AiHard.computeMoves(boardState, dice);
      return BG.AiNormal.computeMoves(boardState, dice);
    },
  };
})(window);
