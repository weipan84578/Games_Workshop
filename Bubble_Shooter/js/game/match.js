(function (BS) {
  function key(row, col) {
    return row + ":" + col;
  }

  function floodSame(grid, startRow, startCol) {
    var color = grid.get(startRow, startCol);
    var queue = [{ row: startRow, col: startCol }];
    var visited = {};
    var group = [];
    visited[key(startRow, startCol)] = true;

    while (queue.length) {
      var cell = queue.shift();
      group.push(cell);
      var neighbors = grid.getNeighbors(cell.row, cell.col);

      for (var i = 0; i < neighbors.length; i += 1) {
        var next = neighbors[i];
        var nextKey = key(next.row, next.col);
        if (!visited[nextKey] && grid.get(next.row, next.col) === color) {
          visited[nextKey] = true;
          queue.push(next);
        }
      }
    }

    return group;
  }

  function findAnchored(grid) {
    var anchored = {};
    var queue = [];

    for (var col = 0; col < grid.cols; col += 1) {
      if (grid.get(0, col) !== null) {
        anchored[key(0, col)] = true;
        queue.push({ row: 0, col: col });
      }
    }

    while (queue.length) {
      var cell = queue.shift();
      var neighbors = grid.getNeighbors(cell.row, cell.col);
      for (var i = 0; i < neighbors.length; i += 1) {
        var next = neighbors[i];
        var nextKey = key(next.row, next.col);
        if (!anchored[nextKey] && grid.get(next.row, next.col) !== null) {
          anchored[nextKey] = true;
          queue.push(next);
        }
      }
    }

    return anchored;
  }

  BS.Game.Match = {
    resolve: function (grid, attachedCell, config) {
      var result = {
        popped: [],
        dropped: [],
        matched: false
      };

      if (!attachedCell || grid.get(attachedCell.row, attachedCell.col) === null) {
        return result;
      }

      var group = floodSame(grid, attachedCell.row, attachedCell.col);
      if (group.length >= config.matchCount) {
        result.popped = group;
        result.matched = true;
        grid.removeCells(group);

        var anchored = findAnchored(grid);
        for (var row = 0; row < grid.maxRows; row += 1) {
          for (var col = 0; col < grid.cols; col += 1) {
            if (grid.get(row, col) !== null && !anchored[key(row, col)]) {
              result.dropped.push({ row: row, col: col });
            }
          }
        }
        grid.removeCells(result.dropped);
      }

      return result;
    }
  };
})(window.BubbleShooter);
