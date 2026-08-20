(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;
  function render(root) {
    var save = PSG.core.gameState.get(); if (!save) return PSG.core.scenes.go('menu');
    var t = PSG.i18n.t, icons = { park:'🌳', forest:'🌲', river:'🌊' };
    root.innerHTML = '<section class="scene">' + PSG.ui.common.sceneHeader('🧭', t('outing.title'), 'home') + PSG.ui.common.topbar(save) + '<div class="card card--soft" style="margin-bottom:1rem"><h3>' + t('outing.choose') + '</h3></div><div class="choice-grid">' + PSG.data.outingLocations.map(function (id) { return '<article class="card location-card"><div class="event-art event-art--' + id + '" style="min-height:190px;font-size:5rem">' + icons[id] + '</div><span class="eyebrow">' + t('location.' + id + '.desc') + '</span><h3>' + t('location.' + id) + '</h3><button class="button button--wide" data-location="' + id + '" type="button">' + t('outing.go') + '</button></article>'; }).join('') + '</div></section>';
    d.all('[data-location]', root).forEach(function (button) { button.addEventListener('click', function () { var result = PSG.pet.outing.perform(save, button.dataset.location); if (!result.ok) return PSG.ui.common.toast(PSG.ui.common.actionReason(save, 'outing'), 'error'); showEvent(root, save, result); }); });
  }
  function showEvent(root, save, result) {
    var t = PSG.i18n.t, event = result.event, icons = { park:'🌳', forest:'🌲', river:'🌊' }, rewardText = '';
    if (result.reward.type === 'coins') rewardText = t('outing.reward.coins', { value: result.reward.value });
    if (result.reward.type === 'affection') rewardText = t('outing.reward.affection', { value: result.reward.value });
    if (result.reward.type === 'xp') rewardText = t('outing.reward.xp', { value: result.reward.value });
    if (result.reward.type === 'consumable') rewardText = t('outing.reward.consumable', { item: PSG.ui.common.itemName(PSG.data.consumableById[result.reward.itemId]) });
    root.innerHTML = '<section class="scene">' + PSG.ui.common.sceneHeader('🧭', t('location.' + event.location), null) + '<div class="event-scene"><div class="event-art event-art--' + event.location + '"><span>' + icons[event.location] + PSG.data.species[save.pet.speciesId].icon + '</span></div><article class="card card--raised" style="display:grid;align-content:center;gap:1rem"><span class="eyebrow">' + t('location.' + event.location) + '</span><h1>' + t('event.' + event.id) + '</h1><p>' + t('event.story') + '</p><div class="card card--soft"><strong>✦ ' + rewardText + '</strong><div class="muted">+' + result.xp.gained + ' XP</div></div><button class="button" type="button" data-action="outing-finish">' + t('common.confirm') + '</button></article></div></section>';
    PSG.audio.manager.sfx('bond');
    d.one('[data-action="outing-finish"]', root).addEventListener('click', function () { if (save.day.actionPoints === 0) { PSG.pet.daily.nextDay(save); PSG.ui.common.toast(t('day.summary', { day: save.day.number })); } PSG.core.scenes.go('home'); });
  }
  PSG.ui.outing = { render: render };
})(window.PSG);
