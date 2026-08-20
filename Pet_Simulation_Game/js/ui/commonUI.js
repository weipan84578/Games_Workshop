(function (PSG) {
  'use strict';

  var lastFocus = null;
  var dialog = null;
  function t(key, values) { return PSG.i18n.t(key, values); }
  function button(label, action, kind, extra) {
    return '<button type="button" class="button ' + (kind ? 'button--' + kind : '') + '" data-action="' + action + '" ' + (extra || '') + '>' + label + '</button>';
  }
  function sceneHeader(icon, title, backScene, right) {
    return '<header class="scene-header"><div class="scene-header__title">' + (backScene ? '<button class="icon-button button--ghost" type="button" data-scene="' + backScene + '" aria-label="' + t('nav.back') + '">←</button>' : '<img src="assets/images/ui/logo-mark.svg" width="52" height="52" alt="">') + '<div><span class="eyebrow">Beast Bond Arena</span><h2>' + PSG.utils.dom.escape(title) + '</h2></div></div><div class="scene-actions">' + (right || '') + '</div></header>';
  }
  function topbar(save) {
    return '<nav class="topbar" aria-label="Game status"><div><strong>' + t('home.day', { day: save.day.number }) + '</strong><div class="muted">' + PSG.utils.dom.escape(save.player.name) + '</div></div><div class="topbar__stats"><span class="topbar__pill">🪙 ' + PSG.utils.formatter.number(save.player.coins) + '</span><span class="topbar__pill">⚡ ' + save.day.actionPoints + ' / 5 AP</span><span class="topbar__pill">🏆 #' + PSG.ranking.matchmaking.playerRank(save) + '</span></div><button class="icon-button button--ghost" type="button" data-scene="settings" aria-label="' + t('menu.settings') + '">⚙</button></nav>';
  }
  function showModal(options) {
    dialog = dialog || document.getElementById('app-dialog');
    lastFocus = document.activeElement;
    document.getElementById('dialog-title').textContent = options.title || '';
    document.getElementById('dialog-eyebrow').textContent = options.eyebrow || '';
    document.getElementById('dialog-body').innerHTML = options.body || '';
    document.getElementById('dialog-actions').innerHTML = options.actions || button(t('common.close'), 'modal-close', 'ghost');
    var closeButton = document.getElementById('dialog-close'); closeButton.setAttribute('aria-label', t('common.close'));
    closeButton.hidden = options.required === true;
    if (!dialog.open) dialog.showModal();
    window.setTimeout(function () { var first = dialog.querySelector('button:not([disabled]),input:not([disabled]),select:not([disabled])'); if (first) first.focus(); }, 0);
    dialog.dataset.required = options.required ? 'true' : 'false';
    if (options.onOpen) options.onOpen(dialog);
  }
  function closeModal() {
    if (dialog && dialog.open) dialog.close();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function toast(message, tone) {
    var node = document.createElement('div'); node.className = 'toast toast--' + (tone || 'info'); node.textContent = message;
    document.getElementById('toast-region').appendChild(node);
    window.setTimeout(function () { node.remove(); }, 3800);
  }
  function actionReason(save, action) {
    var check = PSG.pet.daily.can(save, action);
    if (check.ok) return '';
    if (check.reason === 'ap') return t('home.noAp');
    if (check.reason === 'energy') return t('home.noEnergy', { value: check.required });
    if (check.reason === 'mood') return t('home.noMood');
    return '';
  }
  function itemName(item) {
    if (!item) return t('common.none');
    if (item.category === 'candy') return t('candy.' + item.stat);
    if (item.templateKey) return t('stage.' + item.stageKey) + ' · ' + t('equipment.' + item.templateKey);
    return t('stage.' + PSG.data.equipmentStages[item.stage - 1].key) + ' · ' + t('consumable.' + item.type);
  }
  function itemEffect(item) {
    if (item.category === 'candy') return t('item.effect.candy', { stat: t('stat.' + item.stat), value: item.gain });
    if (item.templateKey) return PSG.economy.equipment.describe(item);
    return t('item.effect.' + item.type, { value: item.value });
  }
  function itemIcon(item) {
    if (!item.image) return '<span class="item-icon item-icon--glyph" aria-hidden="true" style="--item-accent:' + item.accent + '">' + item.icon + '</span>';
    return '<img class="item-icon" src="' + item.image + '" alt="" width="58" height="58">';
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-scene]');
    if (target && !target.disabled) PSG.core.scenes.go(target.dataset.scene);
    if (event.target.closest('[data-action="modal-close"]') || event.target.closest('#dialog-close')) closeModal();
  });
  document.addEventListener('keydown', function (event) {
    if (!dialog || !dialog.open) return;
    if (event.key === 'Escape' && dialog.dataset.required === 'true') event.preventDefault();
    if (event.key !== 'Tab') return;
    var focusable = PSG.utils.dom.all('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])', dialog);
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.getElementById('app-dialog').addEventListener('cancel', function (event) { if (this.dataset.required === 'true') event.preventDefault(); });

  PSG.ui.common = { t: t, button: button, sceneHeader: sceneHeader, topbar: topbar, modal: showModal, closeModal: closeModal, toast: toast, actionReason: actionReason, itemName: itemName, itemEffect: itemEffect, itemIcon: itemIcon };
})(window.PSG);
