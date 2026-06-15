/* render-board.js — 依棋盤模型繪製格子(CSS Grid),標示安全格、起始格、各色區。 */
(function (L) {
  'use strict';

  var GRID = L.config.BOARD_GRID;

  L.ui.renderBoard = {
    draw: function () {
      var board = document.getElementById('board');
      if (!board) return;
      board.innerHTML = '';

      // 1) 路徑格 (track + homecol)
      var grid = document.createElement('div');
      grid.className = 'board-grid';
      var map = L.engine.board.buildCellMap();

      for (var r = 0; r < GRID; r++) {
        for (var c = 0; c < GRID; c++) {
          var key = r + ',' + c;
          var info = map[key];
          var inYard = isYard(r, c);
          var inCenter = (r >= 6 && r <= 8 && c >= 6 && c <= 8);
          if (!info || inYard) continue; // 基地/空白由裝飾層處理
          if (inCenter && info.type !== 'homecol') continue;

          var cell = document.createElement('div');
          cell.className = 'cell';
          cell.style.gridRow = (r + 1);
          cell.style.gridColumn = (c + 1);

          if (info.type === 'track') {
            cell.classList.add('cell-track');
            if (info.start != null) {
              cell.classList.add('cell-start', 'player-' + (info.start + 1));
            }
            if (info.safe) {
              cell.classList.add('cell-safe');
              if (info.start == null) cell.innerHTML = '<span class="star">★</span>';
            }
          } else if (info.type === 'homecol') {
            cell.classList.add('cell-home', 'player-' + (info.owner + 1));
          }
          grid.appendChild(cell);
        }
      }
      board.appendChild(grid);

      // 2) 四角基地框
      var corners = [
        { p: 0, cls: 'yard-tl' }, { p: 1, cls: 'yard-tr' },
        { p: 2, cls: 'yard-br' }, { p: 3, cls: 'yard-bl' }
      ];
      for (var i = 0; i < corners.length; i++) {
        var y = document.createElement('div');
        y.className = 'yard ' + corners[i].cls + ' player-' + (corners[i].p + 1);
        var inner = document.createElement('div');
        inner.className = 'yard-inner';
        for (var s = 0; s < 4; s++) {
          var slot = document.createElement('div');
          slot.className = 'yard-slot';
          inner.appendChild(slot);
        }
        y.appendChild(inner);
        board.appendChild(y);
      }

      // 3) 中央終點
      var center = document.createElement('div');
      center.className = 'center-home';
      center.innerHTML =
        '<div class="center-tri tri-top player-2"></div>' +
        '<div class="center-tri tri-right player-3"></div>' +
        '<div class="center-tri tri-bottom player-4"></div>' +
        '<div class="center-tri tri-left player-1"></div>' +
        '<div class="center-star">★</div>';
      board.appendChild(center);

      // 4) 棋子層
      var layer = document.createElement('div');
      layer.className = 'token-layer';
      layer.id = 'token-layer';
      board.appendChild(layer);
    }
  };

  function isYard(r, c) {
    if (r <= 5 && c <= 5) return true;
    if (r <= 5 && c >= 9) return true;
    if (r >= 9 && c >= 9) return true;
    if (r >= 9 && c <= 5) return true;
    return false;
  }
})(window.Ludo);
