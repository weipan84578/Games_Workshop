(function (BS) {
  function makeRow(cols) {
    var row = [];
    for (var col = 0; col < cols; col += 1) {
      row.push(null);
    }
    return row;
  }

  BS.Game.Grid = function (config) {
    this.cols = config.cols;
    this.maxRows = config.maxRows;
    this.cells = [];
    this.reset();
  };

  BS.Game.Grid.prototype.reset = function () {
    this.cells = [];
    for (var row = 0; row < this.maxRows; row += 1) {
      this.cells.push(makeRow(this.cols));
    }
  };

  BS.Game.Grid.prototype.fillInitial = function (rows, colorCount) {
    this.reset();
    for (var row = 0; row < rows; row += 1) {
      for (var col = 0; col < this.cols; col += 1) {
        this.cells[row][col] = BS.Utils.randomInt(0, colorCount - 1);
      }
    }
  };

  BS.Game.Grid.prototype.isValidCell = function (row, col) {
    return row >= 0 && row < this.maxRows && col >= 0 && col < this.cols;
  };

  BS.Game.Grid.prototype.get = function (row, col) {
    if (!this.isValidCell(row, col)) {
      return null;
    }
    return this.cells[row][col];
  };

  BS.Game.Grid.prototype.set = function (row, col, color) {
    if (this.isValidCell(row, col)) {
      this.cells[row][col] = color;
    }
  };

  BS.Game.Grid.prototype.clear = function (row, col) {
    if (this.isValidCell(row, col)) {
      this.cells[row][col] = null;
    }
  };

  BS.Game.Grid.prototype.getCellCenter = function (row, col, metrics) {
    var offset = row % 2 ? metrics.radius : 0;
    return {
      x: metrics.startX + metrics.radius + offset + col * metrics.diameter,
      y: metrics.top + metrics.radius + row * metrics.rowGap
    };
  };

  BS.Game.Grid.prototype.eachBubble = function (metrics, callback) {
    for (var row = 0; row < this.maxRows; row += 1) {
      for (var col = 0; col < this.cols; col += 1) {
        var color = this.cells[row][col];
        if (color !== null && color !== undefined) {
          var center = this.getCellCenter(row, col, metrics);
          callback({
            row: row,
            col: col,
            color: color,
            x: center.x,
            y: center.y
          });
        }
      }
    }
  };

  BS.Game.Grid.prototype.getNeighbors = function (row, col) {
    var shifted = row % 2 === 1;
    var deltas = shifted
      ? [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]]
      : [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]];
    var neighbors = [];

    for (var i = 0; i < deltas.length; i += 1) {
      var nextRow = row + deltas[i][0];
      var nextCol = col + deltas[i][1];
      if (this.isValidCell(nextRow, nextCol)) {
        neighbors.push({ row: nextRow, col: nextCol });
      }
    }

    return neighbors;
  };

  BS.Game.Grid.prototype.findClosestEmptyNeighbor = function (row, col, x, y, metrics) {
    var neighbors = this.getNeighbors(row, col);
    var best = null;
    var bestDistance = Infinity;

    for (var i = 0; i < neighbors.length; i += 1) {
      var cell = neighbors[i];
      if (this.get(cell.row, cell.col) === null) {
        var center = this.getCellCenter(cell.row, cell.col, metrics);
        var distance = BS.Utils.distance(x, y, center.x, center.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = cell;
        }
      }
    }

    return best;
  };

  BS.Game.Grid.prototype.findClosestEmptyInRow = function (row, x, metrics) {
    var best = null;
    var bestDistance = Infinity;

    for (var col = 0; col < this.cols; col += 1) {
      if (this.get(row, col) === null) {
        var center = this.getCellCenter(row, col, metrics);
        var distance = Math.abs(x - center.x);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = { row: row, col: col };
        }
      }
    }

    return best;
  };

  BS.Game.Grid.prototype.findNearestEmpty = function (x, y, metrics) {
    var best = null;
    var bestDistance = Infinity;

    for (var row = 0; row < this.maxRows; row += 1) {
      for (var col = 0; col < this.cols; col += 1) {
        if (this.get(row, col) === null) {
          var center = this.getCellCenter(row, col, metrics);
          var distance = BS.Utils.distance(x, y, center.x, center.y);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = { row: row, col: col };
          }
        }
      }
    }

    return best;
  };

  BS.Game.Grid.prototype.attachBubble = function (bubble, hit, metrics) {
    var target = null;

    if (hit && hit.type === "ceiling") {
      target = this.findClosestEmptyInRow(0, bubble.x, metrics);
    } else if (hit && hit.cell) {
      target = this.findClosestEmptyNeighbor(hit.cell.row, hit.cell.col, bubble.x, bubble.y, metrics);
    }

    if (!target) {
      target = this.findNearestEmpty(bubble.x, bubble.y, metrics);
    }

    if (!target) {
      return null;
    }

    this.set(target.row, target.col, bubble.color);
    return target;
  };

  BS.Game.Grid.prototype.removeCells = function (cells) {
    for (var i = 0; i < cells.length; i += 1) {
      this.clear(cells[i].row, cells[i].col);
    }
  };

  BS.Game.Grid.prototype.countBubbles = function () {
    var count = 0;
    for (var row = 0; row < this.maxRows; row += 1) {
      for (var col = 0; col < this.cols; col += 1) {
        if (this.get(row, col) !== null) {
          count += 1;
        }
      }
    }
    return count;
  };

  BS.Game.Grid.prototype.isEmpty = function () {
    return this.countBubbles() === 0;
  };

  BS.Game.Grid.prototype.getLowestRow = function () {
    for (var row = this.maxRows - 1; row >= 0; row -= 1) {
      for (var col = 0; col < this.cols; col += 1) {
        if (this.get(row, col) !== null) {
          return row;
        }
      }
    }
    return -1;
  };

  BS.Game.Grid.prototype.hasReachedDanger = function () {
    return this.getLowestRow() >= this.maxRows - 1;
  };

  BS.Game.Grid.prototype.addPressureRow = function (colorCount) {
    var lost = this.getLowestRow() >= this.maxRows - 1;

    for (var row = this.maxRows - 1; row > 0; row -= 1) {
      this.cells[row] = this.cells[row - 1].slice();
    }

    this.cells[0] = makeRow(this.cols);
    for (var col = 0; col < this.cols; col += 1) {
      this.cells[0][col] = BS.Utils.randomInt(0, colorCount - 1);
    }

    return lost;
  };

  BS.Game.Grid.prototype.getActiveColors = function () {
    var seen = {};
    var colors = [];

    for (var row = 0; row < this.maxRows; row += 1) {
      for (var col = 0; col < this.cols; col += 1) {
        var color = this.get(row, col);
        if (color !== null && !seen[color]) {
          seen[color] = true;
          colors.push(color);
        }
      }
    }

    return colors;
  };

  BS.Game.Grid.prototype.serialize = function () {
    return {
      cols: this.cols,
      maxRows: this.maxRows,
      cells: BS.Utils.deepClone(this.cells)
    };
  };

  BS.Game.Grid.prototype.deserialize = function (data) {
    this.cols = data.cols || this.cols;
    this.maxRows = data.maxRows || this.maxRows;
    this.cells = [];
    for (var row = 0; row < this.maxRows; row += 1) {
      var source = data.cells && data.cells[row] ? data.cells[row] : [];
      var next = makeRow(this.cols);
      for (var col = 0; col < this.cols; col += 1) {
        next[col] = source[col] === undefined ? null : source[col];
      }
      this.cells.push(next);
    }
  };
})(window.BubbleShooter);
