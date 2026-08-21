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
    d.all('[data-buy-equipment],[data-buy-consumable],[data-buy-candy],[data-buy-experience]', root).forEach(
      function (button) {
        button.addEventListener('click', function () {
          if (button.dataset.buyExperience) return openExperienceDialog(root, save, candyFestival);
          var id = button.dataset.buyEquipment || button.dataset.buyConsumable || button.dataset.buyCandy;
          var item = PSG.data.equipmentById[id] || PSG.data.consumableById[id] || PSG.data.abilityCandyById[id];
          openPurchaseDialog(root, save, item, candyFestival);
        });
      }
    );
  }

  function openExperienceDialog(root, save, candyFestival) {
    var t = PSG.i18n.t;
    var maxQuantity = Math.min(PSG.economy.experience.maxQuantity, PSG.economy.experience.maxQuantityFor(save));
    var initialPlan = maxQuantity ? PSG.economy.experience.preview(save, 1, candyFestival) : null;
    var initialSummary = initialPlan
      ? t('shop.experienceConfirm', {
          price: PSG.utils.formatter.number(initialPlan.price),
          quantity: initialPlan.quantity,
          xp: PSG.utils.formatter.number(initialPlan.xp)
        })
      : t('shop.experienceMaxLevel');
    PSG.ui.common.modal({
      title: t('shop.category.experience'),
      body:
        '<p data-experience-confirmation>' +
        initialSummary +
        '</p>' +
        (maxQuantity
          ? '<div class="experience-purchase-quantity"><label for="experience-quantity"><strong>' +
            t('shop.quantity') +
            '</strong></label><input class="text-input" id="experience-quantity" type="number" inputmode="numeric" min="1" max="' +
            maxQuantity +
            '" step="1" value="1"><p class="muted">' +
            t('shop.experienceQuantityHint', { max: maxQuantity }) +
            '</p></div>'
          : '') +
        '<div class="card card--soft purchase-preview" data-experience-preview>' +
        experiencePreview(initialPlan) +
        '</div>',
      actions:
        PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') +
        PSG.ui.common.button(
          t('common.confirm'),
          'experience-confirm',
          null,
          initialPlan && initialPlan.price <= save.player.coins ? '' : 'disabled'
        ),
      onOpen: function (dialog) {
        var quantityInput = d.one('#experience-quantity', dialog);
        var confirmation = d.one('[data-experience-confirmation]', dialog);
        var preview = d.one('[data-experience-preview]', dialog);
        var confirmButton = d.one('[data-action="experience-confirm"]', dialog);
        function refreshExperienceDialog() {
          if (!quantityInput) return;
          var quantity = Math.min(maxQuantity, Math.max(1, Math.floor(Number(quantityInput.value) || 1)));
          quantityInput.value = quantity;
          var plan = PSG.economy.experience.preview(save, quantity, candyFestival);
          if (!plan.ok) {
            confirmation.textContent = t('shop.experienceMaxLevel');
            preview.innerHTML = experiencePreview(null);
            confirmButton.disabled = true;
            return;
          }
          confirmation.textContent = t('shop.experienceConfirm', {
            price: PSG.utils.formatter.number(plan.price),
            quantity: plan.quantity,
            xp: PSG.utils.formatter.number(plan.xp)
          });
          preview.innerHTML = experiencePreview(plan);
          confirmButton.disabled = plan.price > save.player.coins;
        }
        if (quantityInput) {
          quantityInput.addEventListener('input', refreshExperienceDialog);
          refreshExperienceDialog();
        }
        confirmButton.addEventListener('click', function () {
          var quantity = quantityInput ? PSG.economy.experience.quantityFor(quantityInput.value) : 0;
          var result = PSG.economy.shop.purchaseExperience(save, candyFestival, quantity);
          if (!result.ok) {
            var reason = result.reason === 'coins' ? t('shop.notEnough') : t('shop.experienceMaxLevel');
            PSG.ui.common.toast(reason, 'warning');
            return;
          }
          PSG.audio.manager.sfx('xp');
          PSG.ui.common.closeModal();
          PSG.ui.common.toast(
            t(result.levels ? 'shop.experiencePurchasedLevel' : 'shop.experiencePurchased', {
              quantity: result.quantity,
              xp: result.xp,
              levels: result.levels,
              level: result.afterLevel
            }),
            'success'
          );
          render(root, { tab: activeTab, category: 'experience', stage: activeStage });
        });
      }
    });
  }

  function openPurchaseDialog(root, save, item, candyFestival) {
    var t = PSG.i18n.t;
    var isCandy = item.category === 'candy';
    var quantity = 1;
    var price = isCandy ? PSG.economy.candy.totalPriceFor(save, item, quantity, candyFestival) : item.price;
    var detail = isCandy
      ? candyPreview(save, item, candyFestival, quantity)
      : '<strong>' + PSG.ui.common.itemEffect(item) + '</strong>';
    PSG.ui.common.modal({
      title: t('shop.buy'),
      body:
        '<p data-purchase-confirmation>' +
        t(isCandy ? 'shop.confirmQuantity' : 'shop.confirm', {
          price: PSG.utils.formatter.number(price),
          item: PSG.ui.common.itemName(item),
          quantity: quantity
        }) +
        '</p>' +
        (isCandy
          ? '<div class="candy-purchase-quantity"><label for="candy-quantity"><strong>' +
            t('shop.quantity') +
            '</strong></label><input class="text-input" id="candy-quantity" type="number" inputmode="numeric" min="1" max="' +
            PSG.economy.candy.maxQuantity +
            '" step="1" value="1"><p class="muted">' +
            t('shop.quantityHint', { max: PSG.economy.candy.maxQuantity }) +
            '</p></div>'
          : '') +
        '<div class="card card--soft purchase-preview"' +
        (isCandy ? ' data-candy-preview' : '') +
        '>' +
        detail +
        '</div>',
      actions:
        PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') +
        PSG.ui.common.button(t('common.confirm'), 'shop-confirm'),
      onOpen: function (dialog) {
        var quantityInput = isCandy ? d.one('#candy-quantity', dialog) : null;
        var confirmation = isCandy ? d.one('[data-purchase-confirmation]', dialog) : null;
        var preview = isCandy ? d.one('[data-candy-preview]', dialog) : null;
        var confirmButton = d.one('[data-action="shop-confirm"]', dialog);
        function refreshCandyDialog() {
          var nextQuantity = Math.min(
            PSG.economy.candy.maxQuantity,
            Math.max(1, Math.floor(Number(quantityInput.value) || 1))
          );
          quantityInput.value = nextQuantity;
          var totalPrice = PSG.economy.candy.totalPriceFor(save, item, nextQuantity, candyFestival);
          confirmation.textContent = t('shop.confirmQuantity', {
            price: PSG.utils.formatter.number(totalPrice),
            item: PSG.ui.common.itemName(item),
            quantity: nextQuantity
          });
          preview.innerHTML = candyPreview(save, item, candyFestival, nextQuantity);
          confirmButton.disabled = totalPrice > save.player.coins;
        }
        if (isCandy) {
          quantityInput.addEventListener('input', refreshCandyDialog);
          refreshCandyDialog();
        }
        confirmButton.addEventListener('click', function () {
          var quantity = isCandy ? PSG.economy.candy.quantityFor(quantityInput.value) : 1;
          var result = purchase(save, item, candyFestival, quantity);
          if (!result.ok) {
            PSG.ui.common.toast(result.reason === 'coins' ? t('shop.notEnough') : t('shop.invalidQuantity'), 'warning');
            return;
          }
          PSG.audio.manager.sfx(item.category === 'candy' ? 'level' : 'coin');
          PSG.ui.common.closeModal();
          if (item.category === 'candy')
            PSG.ui.common.toast(
              t(result.quantity > 1 ? 'shop.candyBatchApplied' : 'shop.candyApplied', {
                stat: t('stat.' + item.stat),
                value: result.gain,
                quantity: result.quantity
              }),
              'success'
            );
          render(root, { tab: activeTab, category: activeCategory, stage: activeStage });
        });
      }
    });
  }

  function purchase(save, item, candyFestival, quantity) {
    if (item.category === 'candy') return PSG.economy.shop.purchaseCandy(save, item.id, candyFestival, quantity);
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
      { id: 'candy', icon: '🍬', title: t('shop.category.candy'), detail: t('shop.category.candyDesc') },
      { id: 'experience', icon: '✨', title: t('shop.category.experience'), detail: t('shop.category.experienceDesc') }
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
    var body =
      activeCategory === 'candy'
        ? candyShopHtml(save, candyFestival)
        : activeCategory === 'experience'
          ? experienceShopHtml(save, candyFestival)
          : stagedShopHtml(save, activeCategory);
    return categoryNav + body;
  }

  function experienceShopHtml(save, candyFestival) {
    var t = PSG.i18n.t;
    var nextXp =
      save.pet.level >= PSG.constants.MAX_LEVEL
        ? t('common.max')
        : PSG.utils.formatter.number(PSG.pet.progression.xpToNext(save.pet.level));
    var currentXp = PSG.utils.formatter.number(save.pet.xp);
    var price = PSG.economy.experience.priceFor(save, candyFestival);
    var maxQuantity = Math.min(PSG.economy.experience.maxQuantity, PSG.economy.experience.maxQuantityFor(save));
    var disabled = !maxQuantity || save.player.coins < price;
    var reason = !maxQuantity ? t('shop.experienceMaxLevel') : save.player.coins < price ? t('shop.notEnough') : '';
    var festivalBanner = candyFestival
      ? '<aside class="candy-festival-shop-banner" role="status"><strong>🍬 ' +
        t('shop.candyFestival') +
        '</strong><span>' +
        t('shop.experienceFestivalDesc') +
        '</span></aside>'
      : '';
    return (
      '<section class="experience-shop">' +
      festivalBanner +
      '<header class="card experience-shop__hero"><div><span class="eyebrow">✨ ' +
      t('shop.category.experience') +
      '</span><h3>' +
      t('shop.experienceTitle') +
      '</h3><p>' +
      t('shop.experienceDescription', { xp: PSG.utils.formatter.number(PSG.economy.experience.xpPerPurchase) }) +
      '</p></div><span class="experience-shop__icon" aria-hidden="true">✦</span></header>' +
      '<div class="card experience-shop__status"><div class="experience-shop__stats"><div><span class="eyebrow">' +
      t('shop.experienceLevel', { level: save.pet.level }) +
      '</span><strong>' +
      t('shop.experienceCurrent', { xp: currentXp, next: nextXp }) +
      '</strong></div><div><span class="eyebrow">' +
      t('shop.experiencePrice', {
        xp: PSG.utils.formatter.number(PSG.economy.experience.xpPerPurchase),
        price: PSG.utils.formatter.number(price)
      }) +
      '</span><strong>' +
      t('shop.experienceMaxPurchase', { max: maxQuantity }) +
      '</strong></div></div></div>' +
      '<article class="card shop-card experience-card"><div class="card__header"><span class="experience-card__icon" aria-hidden="true">✨</span><span class="tag tag--success">+' +
      PSG.utils.formatter.number(PSG.economy.experience.xpPerPurchase) +
      ' XP</span></div><div><span class="eyebrow">' +
      t('shop.experienceType') +
      '</span><h3>' +
      t('shop.experienceTitle') +
      '</h3></div><p>' +
      t('shop.experienceDescription', { xp: PSG.utils.formatter.number(PSG.economy.experience.xpPerPurchase) }) +
      '</p><div class="shop-card__footer"><strong class="shop-price">🪙 ' +
      PSG.utils.formatter.number(price) +
      '</strong><button class="button" type="button" data-buy-experience="experience" ' +
      (disabled ? 'disabled title="' + d.escape(reason) + '"' : '') +
      '>' +
      t('shop.buy') +
      '</button></div></article></section>'
    );
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

  function experiencePreview(plan) {
    var t = PSG.i18n.t;
    if (!plan) return '<p class="muted">' + t('shop.experienceMaxLevel') + '</p>';
    var beforeNext =
      plan.beforeLevel >= PSG.constants.MAX_LEVEL
        ? t('common.max')
        : PSG.utils.formatter.number(PSG.pet.progression.xpToNext(plan.beforeLevel));
    var afterNext =
      plan.afterLevel >= PSG.constants.MAX_LEVEL ? t('common.max') : PSG.utils.formatter.number(plan.nextXp);
    return (
      '<div class="experience-preview"><p>' +
      t('shop.experienceBefore', {
        level: plan.beforeLevel,
        xp: PSG.utils.formatter.number(plan.beforeXp),
        next: beforeNext
      }) +
      '</p><p>' +
      t('shop.experienceGain', { xp: PSG.utils.formatter.number(plan.xp) }) +
      '</p><p><strong>' +
      t('shop.experienceAfter', {
        level: plan.afterLevel,
        xp: PSG.utils.formatter.number(plan.afterXp),
        next: afterNext
      }) +
      '</strong></p><p class="muted">' +
      (plan.levels
        ? t('shop.experienceLevelUp', { levels: plan.levels, level: plan.afterLevel })
        : t('shop.experienceNoLevel')) +
      '</p><p class="muted">' +
      t('shop.experienceTotalPrice', { price: PSG.utils.formatter.number(plan.price) }) +
      '</p></div>'
    );
  }

  function candyPreview(save, item, candyFestival, quantity) {
    var t = PSG.i18n.t;
    var totalGain = item.gain * quantity;
    var current = PSG.economy.candy.intrinsicValue(save, item);
    var nextSave = JSON.parse(JSON.stringify(save));
    nextSave.pet.candyBoosts[item.stat] = (nextSave.pet.candyBoosts[item.stat] || 0) + totalGain;
    var nextPrice = PSG.economy.candy.priceFor(nextSave, item, candyFestival);
    var totalPrice = PSG.economy.candy.totalPriceFor(save, item, quantity, candyFestival);
    return (
      '<div class="purchase-preview__candy">' +
      PSG.ui.common.itemIcon(item) +
      '<div><strong>' +
      t('shop.candyGrowth', { stat: t('stat.' + item.stat), before: current, after: current + totalGain }) +
      '</strong><p class="muted">' +
      t('shop.candyTotalPrice', { price: PSG.utils.formatter.number(totalPrice) }) +
      '</p><p class="muted">' +
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
