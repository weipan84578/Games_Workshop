(function (PSG) {
  'use strict';

  var d = PSG.utils.dom;

  function render(root) {
    var save = PSG.core.gameState.get();
    if (!save) return PSG.core.scenes.go('menu');
    var t = PSG.i18n.t;
    var plan = PSG.battle.boss.preview(save);
    if (!plan.ok) {
      PSG.ui.common.toast(t('boss.locked'), 'warning');
      return PSG.core.scenes.go('ranking');
    }
    var canFight = PSG.pet.daily.can(save, 'bossBattle');
    var reason = canFight.ok ? '' : PSG.ui.common.actionReason(save, 'bossBattle');
    var cards = PSG.battle.boss
      .speciesIds()
      .map(function (speciesId) {
        var challenge = PSG.battle.boss.create(save, speciesId);
        var opponent = challenge.opponent;
        var species = PSG.data.species[speciesId];
        return (
          '<article class="card boss-card"><div class="boss-card__header"><img class="boss-card__portrait" src="' +
          species.image +
          '" alt="' +
          d.escape(t(species.nameKey)) +
          '"><div><span class="eyebrow">' +
          t('boss.stage', { stage: plan.stage }) +
          '</span><h3>' +
          d.escape(opponent.name) +
          '</h3><span class="boss-card__species">' +
          species.icon +
          ' ' +
          t(species.nameKey) +
          '</span></div></div><div class="boss-card__stats"><span>' +
          t('boss.bossLevel', { level: opponent.level }) +
          '</span><strong>' +
          t('boss.stats', { bp: PSG.utils.formatter.number(opponent.bp) }) +
          '</strong></div><button class="button button--wide" type="button" data-boss-species="' +
          speciesId +
          '" ' +
          (!canFight.ok ? 'disabled title="' + d.escape(reason) + '"' : '') +
          '>' +
          t('boss.challenge') +
          '</button></article>'
        );
      })
      .join('');
    var mirrorCard =
      '<article class="card boss-card boss-card--mirror"><div class="boss-card__header"><div class="boss-card__mirror-icon" aria-hidden="true">🪞</div><div><span class="eyebrow">' +
      t('boss.mirror.name') +
      '</span><h3>' +
      t('boss.mirror.name') +
      '</h3><span class="boss-card__species">' +
      t('boss.mirror.hiddenOpponent') +
      '</span></div></div><p class="muted">' +
      t('boss.mirror.description') +
      '</p><p class="muted">' +
      t('boss.mirror.range') +
      '</p><p class="muted">' +
      t('boss.mirror.cost') +
      '</p><button class="button button--wide" type="button" data-mirror-boss="true">' +
      t('boss.mirror.challenge') +
      '</button></article>';

    root.innerHTML =
      '<section class="scene boss-scene">' +
      PSG.ui.common.sceneHeader('🚪', t('boss.title'), 'ranking') +
      PSG.ui.common.topbar(save) +
      '<section class="card boss-intro"><div><span class="eyebrow">' +
      t('boss.stage', { stage: plan.stage }) +
      '</span><h2>' +
      t('boss.select') +
      '</h2><p>' +
      t('boss.description') +
      '</p><p class="muted">' +
      t('boss.growth') +
      '</p></div><div class="boss-intro__door" aria-hidden="true">🚪</div></section>' +
      '<p class="muted boss-cost">' +
      t('boss.cost') +
      (!canFight.ok ? ' ' + d.escape(reason) : '') +
      '</p><div class="choice-grid boss-choice-grid">' +
      cards +
      mirrorCard +
      '</div></section>';

    d.all('[data-boss-species]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        var challenge = PSG.battle.boss.create(save, button.dataset.bossSpecies);
        if (!challenge.ok) {
          PSG.ui.common.toast(t('boss.locked'), 'warning');
          return;
        }
        if (!canFight.ok) {
          PSG.ui.common.toast(reason, 'warning');
          return;
        }
        PSG.core.scenes.go('battle', { opponent: challenge.opponent, bossChallenge: challenge });
      });
    });
    var mirrorButton = d.one('[data-mirror-boss]', root);
    if (mirrorButton)
      mirrorButton.addEventListener('click', function () {
        var challenge = PSG.battle.boss.createMirror(save);
        if (!challenge.ok) {
          PSG.ui.common.toast(t('boss.locked'), 'warning');
          return;
        }
        PSG.core.scenes.go('battle', { opponent: challenge.opponent, bossChallenge: challenge });
      });
  }

  PSG.ui.boss = { render: render };
})(window.PSG);
