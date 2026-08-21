(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;

  function slotCard(entry) {
    var t = PSG.i18n.t;
    var save = entry.save;
    var content;
    if (entry.error) {
      content = '<strong>' + t('menu.slotDamaged') + '</strong><p class="muted">' + t('menu.replaceHint') + '</p>';
    } else if (save) {
      content =
        '<strong>' +
        t('menu.saveSummary', {
          petName: d.escape(save.pet.name),
          level: save.pet.level,
          rank: PSG.ranking.matchmaking.playerRank(save)
        }) +
        '</strong><p class="muted">' +
        t('menu.lastSave', { time: PSG.utils.formatter.dateTime(save.updatedAt) }) +
        '</p>';
    } else {
      content = '<strong>' + t('menu.emptySlot') + '</strong><p class="muted">' + t('menu.saveSlotsHint') + '</p>';
    }
    return (
      '<article class="card save-slot ' +
      (!save ? 'save-slot--empty' : '') +
      '" data-slot="' +
      entry.slot +
      '"><div class="save-slot__copy"><span class="eyebrow">' +
      t('menu.slot', { slot: entry.slot }) +
      '</span>' +
      content +
      '</div><div class="save-slot__actions">' +
      (save
        ? '<button class="button button--secondary" type="button" data-slot-continue="' +
          entry.slot +
          '">' +
          t('menu.continue') +
          '</button>'
        : '') +
      '<button class="button ' +
      (save ? 'button--ghost' : '') +
      '" type="button" data-slot-start="' +
      entry.slot +
      '">' +
      (save || entry.error ? t('menu.replace') : t('menu.startInSlot')) +
      '</button></div></article>'
    );
  }

  function render(root) {
    var t = PSG.i18n.t;
    var slots = PSG.storage.save.list();
    root.innerHTML =
      '<section class="scene menu-scene"><div class="brand-lockup"><img class="brand-lockup__mark" src="assets/images/ui/logo-mark.svg" width="86" height="86" alt=""><span class="eyebrow">Beast Bond Arena</span><h1>' +
      t('app.title') +
      '</h1><p>' +
      t('app.subtitle') +
      '</p><div class="menu-actions"><button class="button button--ghost" type="button" data-scene="instructions">❓ ' +
      t('menu.help') +
      '</button><button class="button button--ghost" type="button" data-scene="settings">⚙ ' +
      t('menu.settings') +
      '</button></div><span class="muted">' +
      t('app.version', { version: PSG.version }) +
      '</span></div><section class="save-slots" aria-labelledby="save-slots-title"><div class="save-slots__header"><div><span class="eyebrow">SAVE SELECT</span><h2 id="save-slots-title">' +
      t('menu.saveSlots') +
      '</h2><p class="muted">' +
      t('menu.saveSlotsHint') +
      '</p></div></div>' +
      slots.map(slotCard).join('') +
      '</section><div class="hero-trio" aria-label="' +
      t('onboard.chooseTitle') +
      '">' +
      Object.keys(PSG.data.species)
        .map(function (id) {
          var species = PSG.data.species[id];
          return (
            '<figure class="hero-trio__frame"><img src="' +
            species.image +
            '" alt="' +
            t(species.nameKey) +
            '"></figure>'
          );
        })
        .join('') +
      '</div></section>';

    d.all('[data-slot-continue]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        loadSlot(Number(button.dataset.slotContinue));
      });
    });
    d.all('[data-slot-start]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        var slot = Number(button.dataset.slotStart);
        startSlot(slot, slots[slot - 1]);
      });
    });
  }

  function loadSlot(slot) {
    var t = PSG.i18n.t;
    var save = PSG.storage.save.read(slot);
    if (!save) return PSG.ui.common.toast(t('menu.slotLoadError'), 'error');
    PSG.core.gameState.set(save, slot);
    PSG.audio.manager.unlock();
    PSG.audio.manager.sfx('confirm');
    PSG.core.scenes.go('home');
  }

  function startSlot(slot, entry) {
    var t = PSG.i18n.t;
    PSG.audio.manager.unlock();
    PSG.audio.manager.sfx('confirm');
    if (!entry.save && !entry.error) return openOnboarding(slot);
    var prompt = entry.error ? t('menu.replaceHint') : t('menu.replacePrompt', { slot: slot });
    PSG.ui.common.modal({
      title: t('menu.replace'),
      body: '<p>' + prompt + '</p>',
      actions:
        PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') +
        PSG.ui.common.button(t('common.confirm'), 'slot-replace-confirm', 'danger'),
      onOpen: function (dialog) {
        d.one('[data-action="slot-replace-confirm"]', dialog).addEventListener('click', function () {
          PSG.ui.common.closeModal();
          openOnboarding(slot);
        });
      }
    });
  }

  function openOnboarding(slot) {
    if (PSG.ui.onboarding && PSG.ui.onboarding.reset) PSG.ui.onboarding.reset(slot);
    PSG.core.scenes.go('onboarding', { slot: slot });
  }

  PSG.ui.menu = { render: render };
})(window.PSG);
