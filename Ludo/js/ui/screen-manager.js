/* screen-manager.js — 畫面切換(顯示/隱藏 section,不重載),並同步 BGM。 */
(function (L) {
  'use strict';

  var GAME_SCREEN = 'screen-game';
  var current = null;

  function bgmFor(id) {
    return id === GAME_SCREEN ? 'bgm_game' : 'bgm_menu';
  }

  L.ui.screen = {
    show: function (id, silent) {
      if (id === current) return;
      var screens = document.querySelectorAll('.screen');
      for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
      if (!silent) L.audio.playSfx('sfx_screen_transition');
      L.audio.playBgm(bgmFor(id), { fade: 500 });
      current = id;
      window.scrollTo(0, 0);
      // 顯示遊戲畫面後重算棋盤尺寸(隱藏時量不到)
      if (id === GAME_SCREEN && L.input.mobileControls) {
        requestAnimationFrame(function () { L.input.mobileControls.resize(); });
      }
    },
    current: function () { return current; }
  };

  // ---- 結算彈窗 ----
  L.ui.showResult = function (winnerOwner) {
    var layer = document.getElementById('modal-layer');
    var human = L.state.game.humanColor;
    var win = winnerOwner === human;
    var cfg = L.config;
    var colorName = cfg.COLOR_NAMES[cfg.COLORS[winnerOwner]];

    layer.innerHTML =
      '<div class="modal-backdrop">' +
      '  <div class="modal result-modal player-' + (winnerOwner + 1) + '">' +
      '    <div class="result-emoji">' + (win ? '🏆' : '🤖') + '</div>' +
      '    <h2 class="result-title">' + (win ? '你贏了!' : colorName + '方獲勝') + '</h2>' +
      '    <p class="result-sub">' + (win ? '恭喜把 4 顆棋子全部送進終點!' : '再接再厲,下次一定行!') + '</p>' +
      '    <div class="modal-actions">' +
      '      <button class="btn btn-primary" id="result-again">再玩一局</button>' +
      '      <button class="btn btn-secondary" id="result-menu">回主選單</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
    layer.classList.add('show');

    document.getElementById('result-again').onclick = function () {
      L.audio.playSfx('sfx_button_click');
      L.ui.closeModal();
      L.ui.menu.startNewGameSameSettings();
    };
    document.getElementById('result-menu').onclick = function () {
      L.audio.playSfx('sfx_button_click');
      L.ui.closeModal();
      L.ui.screen.show('screen-menu');
      L.ui.menu.refreshContinue();
    };
  };

  L.ui.closeModal = function () {
    var layer = document.getElementById('modal-layer');
    layer.classList.remove('show');
    layer.innerHTML = '';
  };
})(window.Ludo);
