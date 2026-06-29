(function () {
  "use strict";

  var LINE_WEIGHTS = [3, 3, 3, 3, 5, 3, 6, 6];

  function opponent(player) {
    return player === "X" ? "O" : "X";
  }

  function scoreLine(values, player) {
    var other = opponent(player);
    var mine = 0;
    var theirs = 0;
    var empty = 0;

    values.forEach(function (value) {
      if (value === player) mine += 1;
      else if (value === other) theirs += 1;
      else if (!value) empty += 1;
    });

    if (mine && theirs) return 0;
    if (mine === 3) return 1000;
    if (theirs === 3) return -1000;
    if (mine === 2 && empty === 1) return 42;
    if (mine === 1 && empty === 2) return 8;
    if (theirs === 2 && empty === 1) return -48;
    if (theirs === 1 && empty === 2) return -7;
    return 0;
  }

  function scoreGrid(grid, player, treatDrawAsBlocked) {
    var score = 0;
    window.BoardUtils.LINES.forEach(function (line, index) {
      var values = line.map(function (cell) {
        var value = grid[cell[0]][cell[1]];
        return value === "draw" && treatDrawAsBlocked ? "blocked" : value;
      });
      score += scoreLine(values, player) * LINE_WEIGHTS[index];
    });
    return score;
  }

  function scoreSmallBoard(board, player) {
    var score = scoreGrid(board, player, false);
    if (board[1][1] === player) score += 8;
    if (board[1][1] === opponent(player)) score -= 8;
    [[0, 0], [0, 2], [2, 0], [2, 2]].forEach(function (cell) {
      if (board[cell[0]][cell[1]] === player) score += 3;
      if (board[cell[0]][cell[1]] === opponent(player)) score -= 3;
    });
    return score;
  }

  function scoreState(state, player) {
    if (state.winner === player) return 100000 - state.moveCount;
    if (state.winner === opponent(player)) return -100000 + state.moveCount;
    if (state.winner === "draw") return 0;

    var score = scoreGrid(state.megaBoard, player, true) * 12;
    for (var br = 0; br < 3; br += 1) {
      for (var bc = 0; bc < 3; bc += 1) {
        if (state.megaBoard[br][bc] === player) score += br === 1 && bc === 1 ? 420 : 250;
        else if (state.megaBoard[br][bc] === opponent(player)) score -= br === 1 && bc === 1 ? 430 : 260;
        else if (!state.megaBoard[br][bc]) score += scoreSmallBoard(state.boards[br][bc], player);
      }
    }
    return score;
  }

  function scoreMove(state, move, player) {
    var next = window.BoardUtils.applyMove(state, move.br, move.bc, move.cr, move.cc, { player: player });
    var score = scoreState(next, player);
    if (move.cr === 1 && move.cc === 1) score -= 8;
    if (move.br === 1 && move.bc === 1) score += 12;
    return score;
  }

  window.AIEvaluator = {
    opponent: opponent,
    scoreLine: scoreLine,
    scoreSmallBoard: scoreSmallBoard,
    scoreState: scoreState,
    scoreMove: scoreMove
  };
})();
