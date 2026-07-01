(function (ns) {
  "use strict";

  function key(row, col) {
    return row + "," + col;
  }

  function parseKey(value) {
    var parts = value.split(",");
    return { row: Number(parts[0]), col: Number(parts[1]) };
  }

  function getNeighborThroughOpenSide(model, box, move) {
    if (move.type === "h") {
      if (move.row === box.row && box.row > 0) {
        return { row: box.row - 1, col: box.col };
      }
      if (move.row === box.row + 1 && box.row + 1 < model.rows) {
        return { row: box.row + 1, col: box.col };
      }
    }
    if (move.type === "v") {
      if (move.col === box.col && box.col > 0) {
        return { row: box.row, col: box.col - 1 };
      }
      if (move.col === box.col + 1 && box.col + 1 < model.cols) {
        return { row: box.row, col: box.col + 1 };
      }
    }
    return null;
  }

  ns.ChainAnalyzer = {
    getChains: function (model) {
      var remaining = {};
      model.boxes.forEach(function (row, rowIndex) {
        row.forEach(function (box, colIndex) {
          if (!box.owner) {
            remaining[key(rowIndex, colIndex)] = true;
          }
        });
      });

      var visited = {};
      var chains = [];
      Object.keys(remaining).forEach(function (startKey) {
        if (visited[startKey]) {
          return;
        }
        var queue = [parseKey(startKey)];
        var cells = [];
        visited[startKey] = true;
        while (queue.length) {
          var current = queue.shift();
          cells.push(current);
          ns.BoardModel.getOpenSides(model, current.row, current.col).forEach(function (side) {
            var neighbor = getNeighborThroughOpenSide(model, current, side);
            if (!neighbor) {
              return;
            }
            var neighborKey = key(neighbor.row, neighbor.col);
            if (remaining[neighborKey] && !visited[neighborKey]) {
              visited[neighborKey] = true;
              queue.push(neighbor);
            }
          });
        }
        chains.push({
          cells: cells,
          length: cells.length,
          openEnds: cells.reduce(function (total, cell) {
            return total + ns.BoardModel.getOpenSides(model, cell.row, cell.col).length;
          }, 0)
        });
      });
      return chains.sort(function (a, b) {
        return a.length - b.length;
      });
    },

    analyzeAfterMove: function (model, move) {
      var copy = ns.BoardModel.clone(model);
      ns.BoardModel.setLine(copy, move, "probe");
      ns.BoardModel.getAdjacentBoxes(copy, move).forEach(function (box) {
        if (!copy.boxes[box.row][box.col].owner && ns.BoardModel.countBoxSides(copy, box.row, box.col) === 4) {
          copy.boxes[box.row][box.col].owner = "probe";
        }
      });
      var chains = this.getChains(copy);
      return {
        chains: chains,
        shortChains: chains.filter(function (chain) {
          return chain.length <= 2;
        }).length,
        longestChain: chains.reduce(function (max, chain) {
          return Math.max(max, chain.length);
        }, 0)
      };
    }
  };
})(window.DAB = window.DAB || {});
