(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;
  function render(root) {
    var t = PSG.i18n.t, save = PSG.core.gameState.get(), hasSave = Boolean(save);
    var summary = hasSave ? '<div class="save-summary"><strong>' + t('menu.saveSummary', { petName: d.escape(save.pet.name), level: save.pet.level, rank: PSG.ranking.matchmaking.playerRank(save) }) + '</strong><div class="muted">' + t('menu.lastSave', { time: PSG.utils.formatter.dateTime(save.updatedAt) }) + '</div></div>' : '<div class="save-summary muted">' + t('menu.noSave') + '</div>';
    root.innerHTML = '<section class="scene menu-scene"><div class="brand-lockup"><img class="brand-lockup__mark" src="assets/images/ui/logo-mark.svg" width="86" height="86" alt=""><span class="eyebrow">Beast Bond Arena</span><h1>' + t('app.title') + '</h1><p>' + t('app.subtitle') + '</p>' + summary + '<div class="menu-actions"><button class="button button--wide" type="button" data-action="start">✦ ' + t('menu.start') + '</button><button class="button button--secondary" type="button" data-action="continue" ' + (hasSave ? '' : 'disabled title="' + t('menu.noSave') + '"') + '>▶ ' + t('menu.continue') + '</button><button class="button button--ghost" type="button" data-scene="instructions">? ' + t('menu.help') + '</button><button class="button button--ghost" type="button" data-scene="settings">⚙ ' + t('menu.settings') + '</button></div><span class="muted">' + t('app.version', { version: PSG.version }) + '</span></div><div class="hero-trio" aria-label="' + t('onboard.chooseTitle') + '">' + Object.keys(PSG.data.species).map(function (id) { var species = PSG.data.species[id]; return '<figure class="hero-trio__frame"><img src="' + species.image + '" alt="' + t(species.nameKey) + '"></figure>'; }).join('') + '</div></section>';
    var start = d.one('[data-action="start"]', root), cont = d.one('[data-action="continue"]', root);
    start.addEventListener('click', function () {
      PSG.audio.manager.unlock(); PSG.audio.manager.sfx('confirm');
      if (!save) return PSG.core.scenes.go('onboarding');
      PSG.ui.common.modal({ title: t('menu.start'), body: '<p>' + t('menu.overwrite', { petName: d.escape(save.pet.name) }) + '</p>', actions: PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') + PSG.ui.common.button(t('common.confirm'), 'overwrite-confirm', 'danger'), onOpen: function (dialog) { d.one('[data-action="overwrite-confirm"]', dialog).addEventListener('click', function () { PSG.ui.common.closeModal(); PSG.core.scenes.go('onboarding'); }); } });
    });
    if (cont) cont.addEventListener('click', function () { PSG.audio.manager.unlock(); PSG.audio.manager.sfx('confirm'); PSG.core.scenes.go('home'); });
  }
  PSG.ui.menu = { render: render };
})(window.PSG);
