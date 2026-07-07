(function initGameState(global) {
  const CF = global.CF || (global.CF = {});
  const { PLAYER_ONE, PLAYER_TWO, STORAGE_KEYS } = CF.constants;

  function createGame(options) {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      mode: options.mode,
      difficulty: options.difficulty,
      board: CF.board.createBoard(),
      currentPlayer: PLAYER_ONE,
      status: "playing",
      winner: null,
      winningLine: [],
      moves: [],
      lastMove: null,
      startedAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function getPlayerLabel(game, piece) {
    if (game.mode === "ai" && piece === PLAYER_TWO) return "game.ai";
    return piece === PLAYER_ONE ? "game.player1" : "game.player2";
  }

  function applyMove(game, column) {
    if (!game || game.status !== "playing") {
      return { ok: false, reason: "not-playing", game };
    }

    const piece = game.currentPlayer;
    const move = CF.board.dropPiece(game.board, column, piece);
    if (!move) {
      return { ok: false, reason: "column-full", game };
    }

    game.moves.push(move);
    game.lastMove = move;
    const winningLine = CF.rules.getWinningLine(game.board, move.row, move.column, piece);

    if (winningLine.length) {
      game.status = "finished";
      game.winner = piece;
      game.winningLine = winningLine;
    } else if (CF.rules.isDraw(game.board)) {
      game.status = "finished";
      game.winner = "draw";
      game.winningLine = [];
    } else {
      game.currentPlayer = piece === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }

    game.updatedAt = Date.now();
    persistGame(game);
    return { ok: true, move, game };
  }

  function persistGame(game) {
    if (!game || game.status !== "playing") {
      CF.storage.remove(STORAGE_KEYS.saveGame);
      return;
    }
    CF.storage.write(STORAGE_KEYS.saveGame, {
      id: game.id,
      mode: game.mode,
      difficulty: game.difficulty,
      currentPlayer: game.currentPlayer,
      moves: game.moves,
      startedAt: game.startedAt,
      updatedAt: Date.now()
    });
  }

  function loadGame() {
    const saved = CF.storage.read(STORAGE_KEYS.saveGame, null);
    if (!saved || !Array.isArray(saved.moves)) {
      return null;
    }
    const game = {
      ...saved,
      board: CF.board.boardFromMoves(saved.moves),
      status: "playing",
      winner: null,
      winningLine: [],
      lastMove: saved.moves[saved.moves.length - 1] || null
    };
    const winner = CF.rules.findWinner(game.board);
    if (winner) {
      CF.storage.remove(STORAGE_KEYS.saveGame);
      return null;
    }
    return game;
  }

  function hasSave() {
    return Boolean(loadGame());
  }

  function clearSave() {
    CF.storage.remove(STORAGE_KEYS.saveGame);
  }

  function recordStats(game) {
    if (!game || game.status !== "finished") return;
    const stats = CF.storage.read(STORAGE_KEYS.stats, {});
    const key = game.mode === "ai" ? game.difficulty : "human";
    const current = stats[key] || { wins: 0, losses: 0, draws: 0, games: 0 };
    current.games += 1;
    if (game.winner === "draw") current.draws += 1;
    else if (game.mode === "ai" && game.winner === PLAYER_TWO) current.losses += 1;
    else current.wins += 1;
    stats[key] = current;
    CF.storage.write(STORAGE_KEYS.stats, stats);
  }

  CF.gameState = { createGame, applyMove, persistGame, loadGame, hasSave, clearSave, recordStats, getPlayerLabel };
})(window);
