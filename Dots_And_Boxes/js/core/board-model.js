(function (ns) {
  "use strict";

  function createLine(type, row, col) {
    return {
      id: type + "-" + row + "-" + col,
      type: type,
      row: row,
      col: col,
      owner: null
    };
  }

  function createGrid(rows, cols, factory) {
    var grid = [];
    for (var row = 0; row < rows; row += 1) {
      var line = [];
      for (var col = 0; col < cols; col += 1) {
        line.push(factory(row, col));
      }
      grid.push(line);
    }
    return grid;
  }

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function normalizeMove(move) {
    if (!move) {
      return null;
    }
    return {
      type: move.type === "horizontal" ? "h" : move.type === "vertical" ? "v" : move.type,
      row: Number(move.row),
      col: Number(move.col)
    };
  }

  var BoardModel = {
    create: function (rows, cols, options) {
      var currentTurn = options && options.firstPlayer === "ai" ? "ai" : "player";
      return {
        rows: rows,
        cols: cols,
        horizontalLines: createGrid(rows + 1, cols, function (row, col) {
          return createLine("h", row, col);
        }),
        verticalLines: createGrid(rows, cols + 1, function (row, col) {
          return createLine("v", row, col);
        }),
        boxes: createGrid(rows, cols, function () {
          return { owner: null };
        }),
        currentTurn: currentTurn,
        scores: { player: 0, ai: 0 },
        moveHistory: [],
        status: "playing",
        difficulty: options && options.difficulty ? options.difficulty : "normal",
        startedAt: options && options.startedAt ? options.startedAt : Date.now()
      };
    },

    hydrate: function (data) {
      if (!data || !data.rows || !data.cols) {
        return null;
      }
      var model = clone(data);
      model.horizontalLines.forEach(function (row, rowIndex) {
        row.forEach(function (line, colIndex) {
          line.type = "h";
          line.row = rowIndex;
          line.col = colIndex;
          line.id = line.id || "h-" + rowIndex + "-" + colIndex;
        });
      });
      model.verticalLines.forEach(function (row, rowIndex) {
        row.forEach(function (line, colIndex) {
          line.type = "v";
          line.row = rowIndex;
          line.col = colIndex;
          line.id = line.id || "v-" + rowIndex + "-" + colIndex;
        });
      });
      return model;
    },

    clone: clone,
    normalizeMove: normalizeMove,

    getLine: function (model, move) {
      var normalized = normalizeMove(move);
      if (!normalized) {
        return null;
      }
      if (normalized.type === "h" && model.horizontalLines[normalized.row]) {
        return model.horizontalLines[normalized.row][normalized.col] || null;
      }
      if (normalized.type === "v" && model.verticalLines[normalized.row]) {
        return model.verticalLines[normalized.row][normalized.col] || null;
      }
      return null;
    },

    setLine: function (model, move, owner) {
      var line = this.getLine(model, move);
      if (line) {
        line.owner = owner;
      }
      return line;
    },

    getAdjacentBoxes: function (model, move) {
      var normalized = normalizeMove(move);
      var boxes = [];
      if (!normalized) {
        return boxes;
      }
      if (normalized.type === "h") {
        if (normalized.row > 0) {
          boxes.push({ row: normalized.row - 1, col: normalized.col });
        }
        if (normalized.row < model.rows) {
          boxes.push({ row: normalized.row, col: normalized.col });
        }
      }
      if (normalized.type === "v") {
        if (normalized.col > 0) {
          boxes.push({ row: normalized.row, col: normalized.col - 1 });
        }
        if (normalized.col < model.cols) {
          boxes.push({ row: normalized.row, col: normalized.col });
        }
      }
      return boxes.filter(function (box) {
        return box.row >= 0 && box.row < model.rows && box.col >= 0 && box.col < model.cols;
      });
    },

    countBoxSides: function (model, row, col) {
      var count = 0;
      if (model.horizontalLines[row][col].owner) {
        count += 1;
      }
      if (model.horizontalLines[row + 1][col].owner) {
        count += 1;
      }
      if (model.verticalLines[row][col].owner) {
        count += 1;
      }
      if (model.verticalLines[row][col + 1].owner) {
        count += 1;
      }
      return count;
    },

    getOpenSides: function (model, row, col) {
      var moves = [
        { type: "h", row: row, col: col },
        { type: "h", row: row + 1, col: col },
        { type: "v", row: row, col: col },
        { type: "v", row: row, col: col + 1 }
      ];
      return moves.filter(function (move) {
        var line = BoardModel.getLine(model, move);
        return line && !line.owner;
      });
    },

    getLegalMoves: function (model) {
      var moves = [];
      model.horizontalLines.forEach(function (row) {
        row.forEach(function (line) {
          if (!line.owner) {
            moves.push({ type: "h", row: line.row, col: line.col });
          }
        });
      });
      model.verticalLines.forEach(function (row) {
        row.forEach(function (line) {
          if (!line.owner) {
            moves.push({ type: "v", row: line.row, col: line.col });
          }
        });
      });
      return moves;
    },

    boxesRemaining: function (model) {
      var remaining = 0;
      model.boxes.forEach(function (row) {
        row.forEach(function (box) {
          if (!box.owner) {
            remaining += 1;
          }
        });
      });
      return remaining;
    },

    isComplete: function (model) {
      return this.boxesRemaining(model) === 0;
    }
  };

  ns.BoardModel = BoardModel;
})(window.DAB = window.DAB || {});
