/* pointer.js — 統一 click / touch 事件:導覽、擲骰、選棋、設定。 */
(function (L) {
  'use strict';

  var P = L.input;

  P.init = function () {
    document.addEventListener('click', onClick, false);
    // 桌面懸停音效
    document.addEventListener('pointerover', function (e) {
      if (matchesEl(e.target, '.btn, .dice.enabled, [data-action]')) {
        if (e.pointerType === 'mouse') L.audio.playSfx('sfx_button_hover');
      }
    });
    bindSliders();
    // 鍵盤:空白鍵擲骰
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && L.ui.screen.current() === 'screen-game') {
        e.preventDefault();
        L.engine.turn.requestRoll();
      }
    });
  };

  function onClick(e) {
    // 棋子點擊
    var tokenEl = closest(e.target, '.token.movable');
    if (tokenEl) {
      L.engine.turn.selectToken(parseInt(tokenEl.getAttribute('data-token'), 10));
      return;
    }

    var el = closest(e.target, '[data-action], [data-ai], [data-diff], [data-color], [data-theme-name], [data-lang]');
    if (!el) return;

    // 模式選擇
    if (el.hasAttribute('data-ai')) { L.audio.playSfx('sfx_button_click'); L.ui.menu.selectAi(parseInt(el.getAttribute('data-ai'), 10)); return; }
    if (el.hasAttribute('data-diff')) { L.audio.playSfx('sfx_button_click'); L.ui.menu.selectDiff(el.getAttribute('data-diff')); return; }
    if (el.hasAttribute('data-color')) { L.audio.playSfx('sfx_button_click'); L.ui.menu.selectColor(parseInt(el.getAttribute('data-color'), 10)); return; }
    if (el.hasAttribute('data-theme-name')) { L.audio.playSfx('sfx_button_click'); L.ui.settings.applyTheme(el.getAttribute('data-theme-name')); return; }
    if (el.hasAttribute('data-lang')) { L.audio.playSfx('sfx_button_click'); L.ui.settings.setLanguage(el.getAttribute('data-lang')); return; }

    var action = el.getAttribute('data-action');
    if (!action) return;
    if (el.classList.contains('btn-disabled')) { L.audio.playSfx('sfx_illegal'); return; }
    handleAction(action, el);
  }

  function handleAction(action, el) {
    var M = L.ui.menu;
    switch (action) {
      case 'nav-start': click(); M.goStart(); break;
      case 'nav-continue': M.continueGame(); break;
      case 'nav-instructions': click(); M.goInstructions(); break;
      case 'nav-settings': click(); M.goSettings(); break;
      case 'nav-menu': click(); M.goMenu(); break;
      case 'mode-start': click(); M.startGame(); break;
      case 'roll': L.engine.turn.requestRoll(); break;
      case 'mute': L.ui.settings.toggleMute(); break;
      case 'game-quit': confirmQuit(); break;
      default: break;
    }
  }

  function click() { L.audio.playSfx('sfx_button_click'); }

  function confirmQuit() {
    if (L.engine.turn.isBusy()) {
      L.audio.playSfx('sfx_illegal');
      return;
    }
    L.audio.playSfx('sfx_button_click');
    var layer = document.getElementById('modal-layer');
    layer.innerHTML =
      '<div class="modal-backdrop"><div class="modal">' +
      '<h2 class="modal-title">' + L.i18n.t('quitTitle') + '</h2>' +
      '<p class="modal-text">' + L.i18n.t('quitText') + '</p>' +
      '<div class="modal-actions">' +
      '<button class="btn btn-primary" id="q-yes">' + L.i18n.t('quitYes') + '</button>' +
      '<button class="btn btn-secondary" id="q-no">' + L.i18n.t('quitNo') + '</button>' +
      '</div></div></div>';
    layer.classList.add('show');
    document.getElementById('q-yes').onclick = function () {
      click(); L.storage.saveGame(); L.ui.closeModal(); L.ui.menu.goMenu();
    };
    document.getElementById('q-no').onclick = function () { click(); L.ui.closeModal(); };
  }

  function bindSliders() {
    bind('set-bgm', function (v) { L.ui.settings.setBgmVolume(v / 100); });
    bind('set-sfx', function (v) { L.ui.settings.setSfxVolume(v / 100); });
    var anim = document.getElementById('set-anim');
    if (anim) anim.addEventListener('input', function () { L.ui.settings.setAnimSpeed(anim.value); });
  }
  function bind(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { fn(parseInt(el.value, 10)); });
  }

  // helpers
  function closest(node, sel) {
    while (node && node.nodeType === 1) {
      if (matchesEl(node, sel)) return node;
      node = node.parentNode;
    }
    return null;
  }
  function matchesEl(node, sel) {
    if (!node || node.nodeType !== 1) return false;
    var m = node.matches || node.msMatchesSelector || node.webkitMatchesSelector;
    return m ? m.call(node, sel) : false;
  }
})(window.Ludo);
