/* hud.js — 抬頭資訊:目前玩家、各色到家數、骰子點數、狀態提示。 */
(function (L) {
  'use strict';

  var HUD = L.ui.hud = L.ui.hud || {};
  var lastPrompt = null;

  HUD.update = function () {
    var g = L.state.game;
    if (!g) return;
    renderPlayers(g);
    HUD.renderDiceFace(g.dice.value);
  };

  function renderPlayers(g) {
    var wrap = document.getElementById('hud-players');
    if (!wrap) return;
    var cfg = L.config;
    var html = '';
    for (var i = 0; i < g.order.length; i++) {
      var owner = g.order[i];
      var p = L.state.playerById(owner);
      var done = L.state.finishedCount(owner);
      var active = (owner === g.currentPlayer);
      html +=
        '<div class="hud-chip player-' + (owner + 1) + (active ? ' active' : '') + '">' +
        '  <span class="chip-dot"></span>' +
        '  <span class="chip-name">' + L.i18n.colorName(owner) +
              (p.isHuman ? ' (' + L.i18n.t('you') + ')' : '') + '</span>' +
        '  <span class="chip-home">🏠 ' + L.i18n.t('home') + ' ' + done + '/4</span>' +
        '</div>';
    }
    wrap.innerHTML = html;
  }

  HUD.prompt = function (text) {
    lastPrompt = null;
    setPromptText(text);
  };

  HUD.promptKey = function (key, vars) {
    lastPrompt = { key: key, vars: vars || {} };
    setPromptText(L.i18n.t(key, vars));
  };

  HUD.refreshPrompt = function () {
    if (lastPrompt) setPromptText(L.i18n.t(lastPrompt.key, lastPrompt.vars));
  };

  function setPromptText(text) {
    var el = document.getElementById('game-status');
    if (el) el.textContent = text;
  }

  HUD.setRollEnabled = function (enabled) {
    var dice = document.getElementById('dice');
    if (!dice) return;
    dice.classList.toggle('enabled', !!enabled);
    dice.classList.toggle('disabled', !enabled);
    var hint = document.getElementById('roll-hint');
    if (hint) hint.textContent = enabled ? L.i18n.t('clickDice') : '';
  };

  // 0 = 未擲(顯示問號)
  HUD.renderDiceFace = function (value) {
    var dice = document.getElementById('dice');
    if (!dice) return;
    if (!value) { dice.setAttribute('data-face', '0'); dice.innerHTML = '<span class="dice-q">?</span>'; return; }
    dice.setAttribute('data-face', String(value));
    var pips = '';
    for (var i = 0; i < value; i++) pips += '<span class="pip"></span>';
    dice.innerHTML = '<div class="dice-face face-' + value + '">' + pips + '</div>';
  };
})(window.Ludo);
