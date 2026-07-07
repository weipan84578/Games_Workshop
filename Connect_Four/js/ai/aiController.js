(function initAiController(global) {
  const CF = global.CF || (global.CF = {});
  const { DIFFICULTIES, PLAYER_ONE, PLAYER_TWO } = CF.constants;

  async function chooseMove(board, difficultyId, aiPiece, opponentPiece) {
    const difficulty = DIFFICULTIES[difficultyId] || DIFFICULTIES.normal;
    await CF.helpers.delay(difficultyId === "easy" ? 260 : 420);

    if (difficultyId === "easy") {
      return CF.easyRandom.chooseEasy(board, aiPiece, opponentPiece);
    }

    const depth = getResponsiveDepth(difficultyId, difficulty.depth);
    return CF.minimax.chooseMinimax(board, depth, difficulty.timeLimitMs, aiPiece, opponentPiece);
  }

  function getResponsiveDepth(difficultyId, configuredDepth) {
    const isSmallDevice = global.matchMedia && global.matchMedia("(max-width: 640px)").matches;
    if (difficultyId === "expert" && isSmallDevice) return Math.max(6, configuredDepth - 1);
    if (difficultyId === "hard" && isSmallDevice) return Math.max(4, configuredDepth - 1);
    return configuredDepth;
  }

  CF.aiController = { chooseMove, getResponsiveDepth, AI_PIECE: PLAYER_TWO, HUMAN_PIECE: PLAYER_ONE };
})(window);
