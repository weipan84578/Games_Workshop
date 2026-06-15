/* render-tokens.js — 依 state 繪製/更新棋子 DOM,套用玩家顏色與疊放偏移。 */
(function (L) {
  'use strict';

  var RT = L.ui.renderTokens = L.ui.renderTokens || {};

  RT.draw = function () {
    var layer = document.getElementById('token-layer');
    if (!layer || !L.state.game) return;
    layer.innerHTML = '';

    var tokens = L.state.game.tokens;
    // 計算疊放:依顯示座標分組
    var positions = tokens.map(function (tk) { return L.engine.board.tokenPos(tk); });
    var groups = {};
    for (var i = 0; i < tokens.length; i++) {
      var p = positions[i];
      var key = Math.round(p.x * 300) + ',' + Math.round(p.y * 300);
      (groups[key] = groups[key] || []).push(i);
    }

    for (var k in groups) {
      var idxs = groups[k];
      var n = idxs.length;
      for (var j = 0; j < n; j++) {
        var ti = idxs[j];
        var tk = tokens[ti];
        var pos = positions[ti];
        var off = stackOffset(j, n);
        var el = makeTokenEl(tk);
        el.style.left = (pos.x * 100) + '%';
        el.style.top = (pos.y * 100) + '%';
        el.style.transform = 'translate(calc(-50% + ' + off.dx + 'px), calc(-50% + ' + off.dy + 'px))';
        layer.appendChild(el);
      }
    }
  };

  function stackOffset(j, n) {
    if (n <= 1) return { dx: 0, dy: 0 };
    var r = 7;
    var ang = (Math.PI * 2 * j) / n - Math.PI / 2;
    return { dx: Math.cos(ang) * r, dy: Math.sin(ang) * r };
  }

  function makeTokenEl(tk) {
    var el = document.createElement('div');
    el.className = 'token player-' + (tk.owner + 1);
    el.id = 'token-' + tk.id;
    el.setAttribute('data-token', tk.id);
    el.setAttribute('data-owner', tk.owner);
    if (tk.finished) el.classList.add('token-finished');
    el.innerHTML = '<span class="token-dot"></span>';
    return el;
  }

  RT.highlightMovable = function (moves) {
    RT.clearHighlights();
    for (var i = 0; i < moves.length; i++) {
      var el = document.getElementById('token-' + moves[i].tokenId);
      if (el) el.classList.add('movable');
    }
  };

  RT.clearHighlights = function () {
    var els = document.querySelectorAll('.token.movable');
    for (var i = 0; i < els.length; i++) els[i].classList.remove('movable');
  };
})(window.Ludo);
