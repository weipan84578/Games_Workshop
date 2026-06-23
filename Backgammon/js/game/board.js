(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  const STARTING_POINTS = [
    { point: 1, color: BG.COLOR.PLAYER, count: 2 },
    { point: 6, color: BG.COLOR.AI, count: 5 },
    { point: 8, color: BG.COLOR.AI, count: 3 },
    { point: 12, color: BG.COLOR.PLAYER, count: 5 },
    { point: 13, color: BG.COLOR.AI, count: 5 },
    { point: 17, color: BG.COLOR.PLAYER, count: 3 },
    { point: 19, color: BG.COLOR.PLAYER, count: 5 },
    { point: 24, color: BG.COLOR.AI, count: 2 },
  ];

  BG.Board = {
    createEmptyBoard() {
      return {
        points: Array.from({ length: 26 }, () => ({ count: 0, color: null })),
        bar: { player: 0, ai: 0 },
        home: { player: 0, ai: 0 },
        totalPieces: 15,
      };
    },

    createInitialBoard() {
      const board = this.createEmptyBoard();
      STARTING_POINTS.forEach(({ point, color, count }) => {
        board.points[point] = { count, color };
      });
      return board;
    },

    clone(board) {
      return JSON.parse(JSON.stringify(board));
    },

    countOnBoard(board, color) {
      return board.points.reduce((sum, point) => sum + (point.color === color ? point.count : 0), 0);
    },

    countTotal(board, color) {
      const owner = BG.ownerForColor(color);
      return this.countOnBoard(board, color) + board.bar[owner] + board.home[owner];
    },
  };
})(window);
