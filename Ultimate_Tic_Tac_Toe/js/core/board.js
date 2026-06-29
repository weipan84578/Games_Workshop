(function () {
  "use strict";

  var LINES = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  function isInRange(value) {
    return Number.isInteger(value) && value >= 0 && value <= 2;
  }

  function getSmallBoard(state, br, bc) {
    return state.boards[br][bc];
  }

  function isBoardFull(board) {
    for (var r = 0; r < 3; r += 1) {
      for (var c = 0; c < 3; c += 1) {
        if (!board[r][c]) return false;
      }
    }
    return true;
  }

  function checkWinnerGrid(grid) {
    for (var i = 0; i < LINES.length; i += 1) {
      var line = LINES[i];
      var first = grid[line[0][0]][line[0][1]];
      if (!first || first === "draw") continue;
      if (grid[line[1][0]][line[1][1]] === first && grid[line[2][0]][line[2][1]] === first) {
        return {
          winner: first,
          lineIndex: i,
          cells: line
        };
      }
    }
    return null;
  }

  function checkSmallWinner(board) {
    return checkWinnerGrid(board);
  }

  function checkMegaWinner(megaBoard) {
    return checkWinnerGrid(megaBoard);
  }

  function isMegaFull(megaBoard) {
    for (var br = 0; br < 3; br += 1) {
      for (var bc = 0; bc < 3; bc += 1) {
        if (!megaBoard[br][bc]) return false;
      }
    }
    return true;
  }

  function getPlayableBoards(state) {
    if (window.Rules && state.nextBoard && window.Rules.isBoardPlayable(state, state.nextBoard.br, state.nextBoard.bc)) {
      return [state.nextBoard];
    }

    var boards = [];
    for (var br = 0; br < 3; br += 1) {
      for (var bc = 0; bc < 3; bc += 1) {
        if (!window.Rules || window.Rules.isBoardPlayable(state, br, bc)) {
          boards.push({ br: br, bc: bc });
        }
      }
    }
    return boards;
  }

  function getValidMoves(state) {
    if (!state || state.phase !== "playing") return [];
    var moves = [];
    getPlayableBoards(state).forEach(function (boardPos) {
      var board = state.boards[boardPos.br][boardPos.bc];
      for (var cr = 0; cr < 3; cr += 1) {
        for (var cc = 0; cc < 3; cc += 1) {
          if (!board[cr][cc]) {
            moves.push({ br: boardPos.br, bc: boardPos.bc, cr: cr, cc: cc });
          }
        }
      }
    });
    return moves;
  }

  function applyMove(state, br, bc, cr, cc, options) {
    var next = options && options.mutable ? state : window.GameState.clone(state);
    var player = options && options.player ? options.player : next.currentPlayer;
    var smallInfo;
    var megaInfo;

    next.boards[br][bc][cr][cc] = player;
    next.moveCount += 1;
    next.lastMove = { br: br, bc: bc, cr: cr, cc: cc, player: player };

    if (!next.megaBoard[br][bc]) {
      smallInfo = checkSmallWinner(next.boards[br][bc]);
      if (smallInfo) {
        next.megaBoard[br][bc] = smallInfo.winner;
        next.smallWinLines[br][bc] = smallInfo.lineIndex;
      } else if (isBoardFull(next.boards[br][bc])) {
        next.megaBoard[br][bc] = "draw";
      }
    }

    megaInfo = checkMegaWinner(next.megaBoard);
    if (megaInfo) {
      next.phase = "ended";
      next.winner = megaInfo.winner;
      next.megaWinLine = megaInfo.lineIndex;
      next.nextBoard = null;
      next.completedAt = Date.now();
      return next;
    }

    if (isMegaFull(next.megaBoard)) {
      next.phase = "ended";
      next.winner = "draw";
      next.nextBoard = null;
      next.completedAt = Date.now();
      return next;
    }

    if (window.Rules && window.Rules.isBoardPlayable(next, cr, cc)) {
      next.nextBoard = { br: cr, bc: cc };
    } else {
      next.nextBoard = null;
    }
    next.currentPlayer = player === "X" ? "O" : "X";
    return next;
  }

  function summarizeMega(megaBoard) {
    var counts = { X: 0, O: 0, draw: 0, open: 0 };
    for (var br = 0; br < 3; br += 1) {
      for (var bc = 0; bc < 3; bc += 1) {
        counts[megaBoard[br][bc] || "open"] += 1;
      }
    }
    return counts;
  }

  window.BoardUtils = {
    LINES: LINES,
    isInRange: isInRange,
    getSmallBoard: getSmallBoard,
    isBoardFull: isBoardFull,
    checkSmallWinner: checkSmallWinner,
    checkMegaWinner: checkMegaWinner,
    isMegaFull: isMegaFull,
    getPlayableBoards: getPlayableBoards,
    getValidMoves: getValidMoves,
    applyMove: applyMove,
    summarizeMega: summarizeMega
  };
})();
