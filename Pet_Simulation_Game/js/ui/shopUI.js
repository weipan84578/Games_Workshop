(function (PSG) {
  'use strict';
  var d = PSG.utils.dom, activeTab = 'shop';
  function render(root, data) {
    var save = PSG.core.gameState.get(); if (!save) return PSG.core.scenes.go('menu');
    activeTab = data && data.tab || activeTab; var t = PSG.i18n.t;
    root.innerHTML = '<section class="scene">' + PSG.ui.common.sceneHeader('🛍', t('shop.title'), 'home', '<span class="topbar__pill">🪙 ' + PSG.utils.formatter.number(save.player.coins) + '</span>') + '<div class="shop-toolbar"><button class="tab-button ' + (activeTab === 'shop' ? 'is-active' : '') + '" data-tab="shop">' + t('shop.items') + '</button><button class="tab-button ' + (activeTab === 'inventory' ? 'is-active' : '') + '" data-tab="inventory">' + t('shop.inventory') + '</button></div><div id="shop-content">' + (activeTab === 'shop' ? shopHtml(save) : inventoryHtml(save)) + '</div></section>';
    d.all('[data-tab]', root).forEach(function (button) { button.addEventListener('click', function () { activeTab = button.dataset.tab; render(root, { tab: activeTab }); }); });
    d.all('[data-buy-equipment],[data-buy-consumable]', root).forEach(function (button) { button.addEventListener('click', function () { var id = button.dataset.buyEquipment || button.dataset.buyConsumable, item = PSG.data.equipmentById[id] || PSG.data.consumableById[id]; PSG.ui.common.modal({ title: t('shop.buy'), body: '<p>' + t('shop.confirm', { price: PSG.utils.formatter.number(item.price), item: PSG.ui.common.itemName(item) }) + '</p><div class="card card--soft"><strong>' + PSG.ui.common.itemEffect(item) + '</strong></div>', actions: PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') + PSG.ui.common.button(t('common.confirm'), 'shop-confirm'), onOpen: function (dialog) { d.one('[data-action="shop-confirm"]', dialog).addEventListener('click', function () { var result = item.templateKey ? PSG.economy.shop.purchaseEquipment(save, id) : PSG.economy.shop.purchaseConsumable(save, id); if (result.ok) { PSG.audio.manager.sfx('coin'); PSG.ui.common.closeModal(); render(root, { tab: activeTab }); } }); } }); }); });
    d.all('[data-equip]', root).forEach(function (button) { button.addEventListener('click', function () { PSG.economy.equipment.equip(save, button.dataset.equip); PSG.audio.manager.sfx('equip'); render(root, { tab: 'inventory' }); }); });
    d.all('[data-unequip]', root).forEach(function (button) { button.addEventListener('click', function () { PSG.economy.equipment.unequip(save, button.dataset.unequip); PSG.audio.manager.sfx('equip'); render(root, { tab: 'inventory' }); }); });
  }
  function shopHtml(save) {
    var t = PSG.i18n.t;
    return PSG.data.equipmentStages.map(function (stage) {
      var unlocked = PSG.economy.equipment.isStageUnlocked(stage.id, save.player.bestRank);
      var equipment = PSG.data.equipment.filter(function (item) { return item.stage === stage.id; });
      var consumables = PSG.data.consumables.filter(function (item) { return item.stage === stage.id; });
      var cards = equipment.concat(consumables).map(function (item) {
        var owned = Boolean(item.templateKey && save.economy.ownedEquipment.indexOf(item.id) >= 0);
        var count = item.templateKey ? (owned ? 1 : 0) : (save.economy.consumables[item.id] || 0);
        var disabled = !unlocked || owned || save.player.coins < item.price || (!item.templateKey && count >= 99);
        var reason = !unlocked ? t('shop.unlock', { rank: stage.threshold }) : owned ? t('common.owned') : save.player.coins < item.price ? t('shop.notEnough') : count >= 99 ? t('shop.full') : '';
        var preview = item.templateKey ? '<span class="tag tag--success">' + equipmentPreview(save, item) + '</span>' : '';
        return '<article class="card shop-card"><div class="card__header">' + PSG.ui.common.itemIcon(item) + '<span class="tag">×' + count + '</span></div><h3>' + PSG.ui.common.itemName(item) + '</h3><p>' + PSG.ui.common.itemEffect(item) + '</p>' + preview + '<span class="muted">' + t('shop.price', { price: PSG.utils.formatter.number(item.price) }) + '</span><button class="button button--wide" type="button" ' + (item.templateKey ? 'data-buy-equipment' : 'data-buy-consumable') + '="' + item.id + '" ' + (disabled ? 'disabled title="' + d.escape(reason) + '"' : '') + '>' + (owned ? t('common.owned') : t('shop.buy')) + '</button></article>';
      }).join('');
      return '<section class="stage-section"><h3>' + t('stage.' + stage.key) + ' ' + (unlocked ? '✓' : '🔒') + '</h3><div class="choice-grid">' + cards + '</div></section>';
    }).join('');
  }

  function equipmentPreview(save, item) {
    var preview = JSON.parse(JSON.stringify(save));
    var before = PSG.pet.stats.battlePower(save);
    preview.economy.equipped[item.slot] = item.id;
    var delta = PSG.pet.stats.battlePower(preview) - before;
    return PSG.i18n.t('shop.preview', { delta: (delta >= 0 ? '+' : '') + delta });
  }
  function inventoryHtml(save) {
    var t = PSG.i18n.t;
    var slots = ['armor','accessory','emblem'].map(function (slot) {
      var id = save.economy.equipped[slot], item = PSG.data.equipmentById[id];
      return '<article class="card slot-card"><span class="eyebrow">' + t('slot.' + slot) + '</span>' + (item ? PSG.ui.common.itemIcon(item) : '') + '<h3>' + (item ? PSG.ui.common.itemName(item) : t('common.none')) + '</h3>' + (item ? '<p>' + PSG.ui.common.itemEffect(item) + '</p><button class="button button--ghost button--small" data-unequip="' + slot + '">' + t('shop.unequip') + '</button>' : '') + '</article>';
    }).join('');
    var gear = save.economy.ownedEquipment.map(function (id) {
      var item = PSG.data.equipmentById[id], equipped = save.economy.equipped[item.slot] === id;
      return '<article class="card shop-card"><div class="card__header">' + PSG.ui.common.itemIcon(item) + '<span class="tag">' + t('slot.' + item.slot) + '</span></div><h3>' + PSG.ui.common.itemName(item) + '</h3><p>' + PSG.ui.common.itemEffect(item) + '</p><button class="button button--wide" data-equip="' + id + '" ' + (equipped ? 'disabled' : '') + '>' + (equipped ? t('common.equipped') : t('shop.equip')) + '</button></article>';
    }).join('') || '<div class="empty-state">' + t('shop.items') + ' → ' + t('shop.buy') + '</div>';
    var consumables = PSG.data.consumables.filter(function (item) { return (save.economy.consumables[item.id] || 0) > 0; }).map(function (item) {
      return '<article class="card"><div class="card__header">' + PSG.ui.common.itemIcon(item) + '<strong>' + PSG.ui.common.itemName(item) + '</strong><span class="tag">×' + save.economy.consumables[item.id] + '</span></div><p>' + PSG.ui.common.itemEffect(item) + '</p></article>';
    }).join('');
    return '<div class="equipment-slots">' + slots + '</div><h3 style="margin-bottom:.75rem">' + t('common.owned') + '</h3><div class="choice-grid">' + gear + consumables + '</div>';
  }
  PSG.ui.shop = { render: render };
})(window.PSG);
