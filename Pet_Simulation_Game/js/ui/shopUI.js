(function (PSG) {
  'use strict';

  var d = PSG.utils.dom;
  var activeTab = 'shop';
  var activeCategory = 'equipment';
  var activeStage = 1;

  function render(root, data) {
    var save = PSG.core.gameState.get();
    if (!save) return PSG.core.scenes.go('menu');
    activeTab = (data && data.tab) || activeTab;
    activeCategory = (data && data.category) || activeCategory;
    activeStage = Number((data && data.stage) || activeStage);
    var t = PSG.i18n.t;
    var candyFestival = PSG.economy.candy.isCandyFestival(save);

    root.innerHTML =
      '<section class="scene shop-scene">' +
      PSG.ui.common.sceneHeader(
        '🛍',
        t('shop.title'),
        'home',
        '<span class="topbar__pill">🪙 ' + PSG.utils.formatter.number(save.player.coins) + '</span>'
      ) +
      '<div class="shop-toolbar" role="tablist">' +
      tabButton('shop', t('shop.items')) +
      tabButton('inventory', t('shop.inventory')) +
      '</div>' +
      '<div id="shop-content">' +
      (activeTab === 'shop' ? shopHtml(save, candyFestival) : inventoryHtml(save)) +
      '</div>' +
      '</section>';

    bindNavigation(root);
    bindPurchases(root, save, candyFestival);
    bindEquipment(root, save);
  }

  function tabButton(tab, label) {
    return (
      '<button class="tab-button ' +
      (activeTab === tab ? 'is-active' : '') +
      '" type="button" role="tab" aria-selected="' +
      (activeTab === tab) +
      '" data-tab="' +
      tab +
      '">' +
      label +
      '</button>'
    );
  }

  function bindNavigation(root) {
    d.all('[data-tab]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        activeTab = button.dataset.tab;
        render(root, { tab: activeTab });
      });
    });
    d.all('[data-shop-category]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.dataset.shopCategory;
        render(root, { category: activeCategory });
      });
    });
    d.all('[data-shop-stage]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        activeStage = Number(button.dataset.shopStage);
        render(root, { stage: activeStage });
      });
    });
  }

  function bindPurchases(root, save, candyFestival) {
    d.all('[data-buy-equipment],[data-buy-consumable],[data-buy-candy]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.dataset.buyEquipment || button.dataset.buyConsumable || button.dataset.buyCandy;
        var item = PSG.data.equipmentById[id] || PSG.data.consumableById[id] || PSG.data.abilityCandyById[id];
        openPurchaseDialog(root, save, item, candyFestival);
      });
    });
  }

  function openPurchaseDialog(root, save, item, candyFestival) {
    var t = PSG.i18n.t;
    var price = item.category === 'candy' ? PSG.economy.candy.priceFor(save, item, candyFestival) : item.price;
    var detail =
      item.category === 'candy'
        ? candyPreview(save, item, candyFestival)
        : '<strong>' + PSG.ui.common.itemEffect(item) + '</strong>';
    PSG.ui.common.modal({
      title: t('shop.buy'),
      body:
        '<p>' +
        t('shop.confirm', { price: PSG.utils.formatter.number(price), item: PSG.ui.common.itemName(item) }) +
        '</p><div class="card card--soft purchase-preview">' +
        detail +
        '</div>',
      actions:
        PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') +
        PSG.ui.common.button(t('common.confirm'), 'shop-confirm'),
      onOpen: function (dialog) {
        d.one('[data-action="shop-confirm"]', dialog).addEventListener('click', function () {
          var result = purchase(save, item, candyFestival);
          if (!result.ok) return;
          PSG.audio.manager.sfx(item.category === 'candy' ? 'level' : 'coin');
          PSG.ui.common.closeModal();
          if (item.category === 'candy')
            PSG.ui.common.toast(t('shop.candyApplied', { stat: t('stat.' + item.stat), value: item.gain }), 'success');
          render(root, { tab: activeTab, category: activeCategory, stage: activeStage });
        });
      }
    });
  }

  function purchase(save, item, candyFestival) {
    if (item.category === 'candy') return PSG.economy.shop.purchaseCandy(save, item.id, candyFestival);
    if (item.templateKey) return PSG.economy.shop.purchaseEquipment(save, item.id);
    return PSG.economy.shop.purchaseConsumable(save, item.id);
  }

  function bindEquipment(root, save) {
    d.all('[data-equip]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        PSG.economy.equipment.equip(save, button.dataset.equip);
        PSG.audio.manager.sfx('equip');
        render(root, { tab: 'inventory' });
      });
    });
    d.all('[data-unequip]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        PSG.economy.equipment.unequip(save, button.dataset.unequip);
        PSG.audio.manager.sfx('equip');
        render(root, { tab: 'inventory' });
      });
    });
  }

  function shopHtml(save, candyFestival) {
    var t = PSG.i18n.t;
    var categories = [
      { id: 'equipment', icon: '🛡', title: t('shop.category.equipment'), detail: t('shop.category.equipmentDesc') },
      { id: 'consumable', icon: '⚗', title: t('shop.category.consumable'), detail: t('shop.category.consumableDesc') },
      { id: 'candy', icon: '🍬', title: t('shop.category.candy'), detail: t('shop.category.candyDesc') }
    ];
    var categoryNav =
      '<div class="shop-category-grid">' +
      categories
        .map(function (category) {
          return (
            '<button type="button" class="shop-category-card ' +
            (activeCategory === category.id ? 'is-active' : '') +
            '" data-shop-category="' +
            category.id +
            '" aria-pressed="' +
            (activeCategory === category.id) +
            '"><span class="shop-category-card__icon">' +
            category.icon +
            '</span><span><strong>' +
            category.title +
            '</strong><small>' +
            category.detail +
            '</small></span></button>'
          );
        })
        .join('') +
      '</div>';
    var body = activeCategory === 'candy' ? candyShopHtml(save, candyFestival) : stagedShopHtml(save, activeCategory);
    return categoryNav + body;
  }

  function stagedShopHtml(save, category) {
    var t = PSG.i18n.t;
    var stage = PSG.data.equipmentStages[activeStage - 1] || PSG.data.equipmentStages[0];
    var unlocked = PSG.economy.equipment.isStageUnlocked(stage.id, save.player.bestRank);
    var items = (category === 'equipment' ? PSG.data.equipment : PSG.data.consumables).filter(function (item) {
      return item.stage === stage.id;
    });
    var stageNav =
      '<nav class="shop-stage-nav" aria-label="' +
      d.escape(t('shop.stageFilter')) +
      '">' +
      PSG.data.equipmentStages
        .map(function (entry) {
          var isUnlocked = PSG.economy.equipment.isStageUnlocked(entry.id, save.player.bestRank);
          return (
            '<button type="button" class="shop-stage-button stage-tone-' +
            entry.id +
            ' ' +
            (entry.id === stage.id ? 'is-active' : '') +
            '" data-shop-stage="' +
            entry.id +
            '" aria-pressed="' +
            (entry.id === stage.id) +
            '"><span class="shop-stage-button__roman">' +
            roman(entry.id) +
            '</span><span>' +
            t('stage.' + entry.key).replace(/^\S+\s*/, '') +
            '</span><small>' +
            (isUnlocked ? '✓ ' + t('shop.unlocked') : '🔒 #' + entry.threshold) +
            '</small></button>'
          );
        })
        .join('') +
      '</nav>';
    var banner =
      '<header class="stage-banner stage-tone-' +
      stage.id +
      '"><div><span class="eyebrow">' +
      t('shop.stageLabel', { stage: roman(stage.id) }) +
      '</span><h3>' +
      t('stage.' + stage.key) +
      '</h3><p>' +
      (unlocked ? t('shop.stageReady') : t('shop.unlock', { rank: stage.threshold })) +
      '</p></div><span class="stage-banner__seal">' +
      (unlocked ? '✓' : '🔒') +
      '</span></header>';
    return (
      stageNav +
      banner +
      '<div class="choice-grid shop-item-grid">' +
      items
        .map(function (item) {
          return standardItemCard(save, item, unlocked);
        })
        .join('') +
      '</div>'
    );
  }

  function standardItemCard(save, item, unlocked) {
    var t = PSG.i18n.t;
    var owned = Boolean(item.templateKey && save.economy.ownedEquipment.indexOf(item.id) >= 0);
    var count = item.templateKey ? (owned ? 1 : 0) : save.economy.consumables[item.id] || 0;
    var disabled = !unlocked || owned || save.player.coins < item.price || (!item.templateKey && count >= 99);
    var reason = !unlocked
      ? t('shop.unlock', { rank: PSG.data.equipmentStages[item.stage - 1].threshold })
      : owned
        ? t('common.owned')
        : save.player.coins < item.price
          ? t('shop.notEnough')
          : count >= 99
            ? t('shop.full')
            : '';
    var preview = item.templateKey ? '<span class="tag tag--success">' + equipmentPreview(save, item) + '</span>' : '';
    return (
      '<article class="card shop-card stage-accent-' +
      item.stage +
      '"><div class="card__header">' +
      PSG.ui.common.itemIcon(item) +
      '<span class="tag">×' +
      count +
      '</span></div><div><span class="eyebrow">' +
      (item.templateKey ? t('slot.' + item.slot) : t('shop.category.consumable')) +
      '</span><h3>' +
      PSG.ui.common.itemName(item) +
      '</h3></div><p>' +
      PSG.ui.common.itemEffect(item) +
      '</p>' +
      preview +
      '<div class="shop-card__footer"><strong class="shop-price">🪙 ' +
      PSG.utils.formatter.number(item.price) +
      '</strong><button class="button" type="button" ' +
      (item.templateKey ? 'data-buy-equipment' : 'data-buy-consumable') +
      '="' +
      item.id +
      '" ' +
      (disabled ? 'disabled title="' + d.escape(reason) + '"' : '') +
      '>' +
      (owned ? t('common.owned') : t('shop.buy')) +
      '</button></div></article>'
    );
  }

  function candyShopHtml(save, candyFestival) {
    var t = PSG.i18n.t;
    var festivalBanner = candyFestival
      ? '<aside class="candy-festival-shop-banner" role="status"><strong>🍬 ' +
        t('shop.candyFestival') +
        '</strong><span>' +
        t('shop.candyFestivalDesc') +
        '</span></aside>'
      : '';
    return (
      '<section class="candy-shop">' +
      festivalBanner +
      '<header class="candy-shop__hero"><div><span class="eyebrow">🍬 ' +
      t('shop.category.candy') +
      '</span><h3>' +
      t('shop.candyTitle') +
      '</h3><p>' +
      t('shop.candyPricing') +
      '</p></div><div class="candy-jar" aria-hidden="true"><span>●</span><span>◆</span><span>♥</span></div></header><div class="choice-grid shop-item-grid">' +
      PSG.data.abilityCandies
        .map(function (item) {
          var price = PSG.economy.candy.priceFor(save, item, candyFestival);
          var current = PSG.economy.candy.intrinsicValue(save, item);
          var boost = PSG.economy.candy.boostFor(save, item.stat);
          var disabled = save.player.coins < price;
          return (
            '<article class="card shop-card candy-card" style="--candy-accent:' +
            item.accent +
            '"><div class="card__header">' +
            PSG.ui.common.itemIcon(item) +
            '<span class="tag tag--success">+' +
            item.gain +
            '</span></div><div><span class="eyebrow">' +
            t('shop.permanentBoost') +
            '</span><h3>' +
            PSG.ui.common.itemName(item) +
            '</h3></div><div class="candy-stat-row"><span>' +
            t('shop.candyCurrent') +
            '</span><strong>' +
            current +
            ' → ' +
            (current + item.gain) +
            '</strong></div><div class="candy-stat-row"><span>' +
            t('shop.candyTotal') +
            '</span><strong>+' +
            boost +
            '</strong></div><p class="muted">' +
            PSG.ui.common.itemEffect(item) +
            '</p><div class="shop-card__footer"><strong class="shop-price">🪙 ' +
            PSG.utils.formatter.number(price) +
            '</strong><button class="button" type="button" data-buy-candy="' +
            item.id +
            '" ' +
            (disabled ? 'disabled title="' + d.escape(t('shop.notEnough')) + '"' : '') +
            '>' +
            t('shop.buyAndUse') +
            '</button></div></article>'
          );
        })
        .join('') +
      '</div></section>'
    );
  }

  function candyPreview(save, item, candyFestival) {
    var t = PSG.i18n.t;
    var current = PSG.economy.candy.intrinsicValue(save, item);
    var nextSave = JSON.parse(JSON.stringify(save));
    nextSave.pet.candyBoosts[item.stat] = (nextSave.pet.candyBoosts[item.stat] || 0) + item.gain;
    var nextPrice = PSG.economy.candy.priceFor(nextSave, item, candyFestival);
    return (
      '<div class="purchase-preview__candy">' +
      PSG.ui.common.itemIcon(item) +
      '<div><strong>' +
      t('shop.candyGrowth', { stat: t('stat.' + item.stat), before: current, after: current + item.gain }) +
      '</strong><p class="muted">' +
      t('shop.candyNext', { price: PSG.utils.formatter.number(nextPrice) }) +
      '</p></div></div>'
    );
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
    var slots = ['armor', 'accessory', 'emblem']
      .map(function (slot) {
        var id = save.economy.equipped[slot];
        var item = PSG.data.equipmentById[id];
        return (
          '<article class="card slot-card"><span class="eyebrow">' +
          t('slot.' + slot) +
          '</span>' +
          (item ? PSG.ui.common.itemIcon(item) : '') +
          '<h3>' +
          (item ? PSG.ui.common.itemName(item) : t('common.none')) +
          '</h3>' +
          (item
            ? '<p>' +
              PSG.ui.common.itemEffect(item) +
              '</p><button class="button button--ghost button--small" data-unequip="' +
              slot +
              '">' +
              t('shop.unequip') +
              '</button>'
            : '') +
          '</article>'
        );
      })
      .join('');
    var candyBoosts = PSG.data.abilityCandies
      .map(function (item) {
        return (
          '<span class="candy-bonus-chip" style="--candy-accent:' +
          item.accent +
          '">' +
          item.icon +
          ' ' +
          t('stat.' + item.stat) +
          ' <strong>+' +
          PSG.economy.candy.boostFor(save, item.stat) +
          '</strong></span>'
        );
      })
      .join('');
    var gear =
      save.economy.ownedEquipment
        .map(function (id) {
          var item = PSG.data.equipmentById[id];
          var equipped = save.economy.equipped[item.slot] === id;
          return (
            '<article class="card shop-card"><div class="card__header">' +
            PSG.ui.common.itemIcon(item) +
            '<span class="tag">' +
            t('slot.' + item.slot) +
            '</span></div><h3>' +
            PSG.ui.common.itemName(item) +
            '</h3><p>' +
            PSG.ui.common.itemEffect(item) +
            '</p><button class="button button--wide" data-equip="' +
            id +
            '" ' +
            (equipped ? 'disabled' : '') +
            '>' +
            (equipped ? t('common.equipped') : t('shop.equip')) +
            '</button></article>'
          );
        })
        .join('') || '<div class="empty-state">' + t('shop.items') + ' → ' + t('shop.buy') + '</div>';
    var consumables = PSG.data.consumables
      .filter(function (item) {
        return (save.economy.consumables[item.id] || 0) > 0;
      })
      .map(function (item) {
        return (
          '<article class="card"><div class="card__header">' +
          PSG.ui.common.itemIcon(item) +
          '<strong>' +
          PSG.ui.common.itemName(item) +
          '</strong><span class="tag">×' +
          save.economy.consumables[item.id] +
          '</span></div><p>' +
          PSG.ui.common.itemEffect(item) +
          '</p></article>'
        );
      })
      .join('');
    return (
      '<div class="equipment-slots">' +
      slots +
      '</div><section class="card candy-bonus-summary"><div><span class="eyebrow">🍬 ' +
      t('shop.category.candy') +
      '</span><h3>' +
      t('shop.candyBonusSummary') +
      '</h3></div><div class="candy-bonus-list">' +
      candyBoosts +
      '</div></section><h3 class="inventory-heading">' +
      t('common.owned') +
      '</h3><div class="choice-grid">' +
      gear +
      consumables +
      '</div>'
    );
  }

  function roman(value) {
    return ['I', 'II', 'III', 'IV', 'V', 'VI'][value - 1];
  }

  PSG.ui.shop = { render: render };
})(window.PSG);
