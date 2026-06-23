(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.Pieces = {
    move(game, move) {
      const color = BG.colorForOwner(game.currentPlayer);
      const before = JSON.parse(JSON.stringify(game));
      game.moveHistory.unshift(before);
      game.moveHistory = game.moveHistory.slice(0, 3);
      game.board = BG.Rules.applyMove(game.board, move.from, move.to, color, move.die);
      game.dice = BG.Dice.consume(game.dice, move.die);
      game.selectedPoint = null;
      game.legalTargets = [];
      const result = BG.Rules.checkGameOver(game.board);
      if (result.isOver) {
        game.isOver = true;
        game.phase = "over";
        game.winner = result.winner;
        game.winType = result.type;
      }
      return game;
    },

    undo(game) {
      if (!game.moveHistory.length) return game;
      const previous = game.moveHistory.shift();
      Object.keys(game).forEach((key) => delete game[key]);
      Object.assign(game, previous);
      game.pendingAi = false;
      return game;
    },
  };
})(window);
