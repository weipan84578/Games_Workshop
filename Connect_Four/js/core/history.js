(function initHistory(global) {
  const CF = global.CF || (global.CF = {});
  const { PLAYER_ONE, PLAYER_TWO } = CF.constants;

  function rebuildGame(game) {
    const board = CF.board.boardFromMoves(game.moves);
    const currentPlayer = game.moves.length % 2 === 0 ? PLAYER_ONE : PLAYER_TWO;
    return {
      ...game,
      board,
      currentPlayer,
      status: "playing",
      winner: null,
      winningLine: [],
      lastMove: game.moves[game.moves.length - 1] || null,
      updatedAt: Date.now()
    };
  }

  function undo(game) {
    const steps = game.mode === "ai" ? 2 : 1;
    if (!game || !Array.isArray(game.moves) || game.moves.length === 0) {
      return { ok: false, game };
    }
    const removeCount = Math.min(steps, game.moves.length);
    const nextGame = { ...game, moves: game.moves.slice(0, -removeCount) };
    return { ok: true, game: rebuildGame(nextGame) };
  }

  CF.history = { rebuildGame, undo };
})(window);
