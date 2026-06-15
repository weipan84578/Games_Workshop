/* menu.js — 主選單與模式選擇行為。 */
(function (L) {
  'use strict';

  var M = L.ui.menu = L.ui.menu || {};

  M.selection = { aiCount: 1, difficulty: 'normal', playerColor: 0 };

  M.init = function () {
    M.selection.difficulty = (L.state.settings && L.state.settings.lastDifficulty) || 'normal';
    M.refreshContinue();
    syncModeUI();
    M.refreshLabels();
    var ver = document.getElementById('version-tag');
    if (ver) ver.textContent = L.config.VERSION;
  };

  // 主選單 → 各畫面
  M.goStart = function () {
    syncModeUI();
    L.ui.screen.show('screen-mode-select');
  };
  M.goInstructions = function () { L.ui.screen.show('screen-instructions'); };
  M.goSettings = function () { L.ui.settings.refreshUI(); L.ui.screen.show('screen-settings'); };
  M.goMenu = function () { M.refreshContinue(); L.ui.screen.show('screen-menu'); };

  M.continueGame = function () {
    if (!L.storage.hasSave()) { L.audio.playSfx('sfx_illegal'); return; }
    var g = L.storage.loadGame();
    if (!g) { L.audio.playSfx('sfx_illegal'); return; }
    L.ui.screen.show('screen-game');
    resumeGame();
  };

  M.refreshContinue = function () {
    var btn = document.getElementById('btn-continue');
    if (!btn) return;
    var has = L.storage.hasSave();
    btn.classList.toggle('btn-disabled', !has);
    btn.setAttribute('aria-disabled', String(!has));
  };

  // ---- 模式選擇 ----
  M.selectAi = function (n) { M.selection.aiCount = n; syncModeUI(); };
  M.selectDiff = function (d) { M.selection.difficulty = d; syncModeUI(); };
  M.selectColor = function (c) { M.selection.playerColor = c; syncModeUI(); };
  M.refreshLabels = function () { syncModeUI(); };

  function syncModeUI() {
    setActive('[data-ai]', 'data-ai', String(M.selection.aiCount));
    setActive('[data-diff]', 'data-diff', M.selection.difficulty);
    setActive('[data-color]', 'data-color', String(M.selection.playerColor));
  }
  function setActive(sel, attr, val) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++)
      els[i].classList.toggle('selected', els[i].getAttribute(attr) === val);
  }

  M.startGame = function () {
    var s = M.selection;
    L.state.settings.lastDifficulty = s.difficulty;
    L.storage.saveSettings();
    L.state.newGame({ aiCount: s.aiCount, difficulty: s.difficulty, playerColor: s.playerColor });
    L.ui.screen.show('screen-game');
    L.engine.turn.start();
  };

  M.startNewGameSameSettings = function () {
    var g = L.state.game;
    L.state.newGame({ aiCount: g.aiCount, difficulty: g.difficulty, playerColor: g.humanColor });
    L.ui.screen.show('screen-game', true);
    L.engine.turn.start();
  };

  function resumeGame() {
    L.engine.turn.resume();
  }
})(window.Ludo);
