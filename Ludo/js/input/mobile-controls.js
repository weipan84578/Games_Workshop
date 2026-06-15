/* mobile-controls.js — 行動端控制列輔助:依視窗動態計算棋盤可用尺寸,
   確保棋盤永遠正方且不被控制列遮擋(§5.2、§5.3、§12.2)。 */
(function (L) {
  'use strict';

  var MC = L.input.mobileControls = {};
  var raf = null;

  MC.init = function () {
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    schedule();
  };

  function schedule() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(resize);
  }

  function resize() {
    raf = null;
    var area = document.querySelector('.board-area');
    var board = document.getElementById('board');
    if (!area || !board) return;
    var rect = area.getBoundingClientRect();
    var size = Math.max(0, Math.min(rect.width, rect.height));
    // 留一點內距避免貼邊
    size = Math.floor(size - 6);
    if (size > 0) {
      board.style.width = size + 'px';
      board.style.height = size + 'px';
    }
  }

  MC.resize = resize;
})(window.Ludo);
