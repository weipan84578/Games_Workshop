(function (PSG) {
  'use strict';

  var d = PSG.utils.dom;

  function arenaName(arena) {
    return PSG.i18n.t('boss.arena.' + arena.id);
  }

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
    var arenaLabel = arenaName(plan.arena);
    var safeSpecies = PSG.data.species[plan.arena.safeSpeciesId];
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
      '<section class="card boss-arena-banner"><div><span class="eyebrow">' +
      t('boss.nextArena', { arena: arenaLabel }) +
      '</span><h3>' +
      arenaLabel +
      '</h3><p>' +
      t('boss.arenaRule', { arena: arenaLabel, species: t(safeSpecies.nameKey) }) +
      '</p></div><span class="boss-arena-banner__icon" aria-hidden="true">' +
      (plan.arena.id === 'grassland' ? '🌾' : plan.arena.id === 'swamp' ? '🌿' : '☁️') +
      '</span></section>' +
      '<p class="muted boss-cost">' +
      t('boss.cost') +
      (!canFight.ok ? ' ' + d.escape(reason) : '') +
      '</p><div class="choice-grid boss-choice-grid">' +
      cards +
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
  }

  PSG.ui.boss = { render: render };
})(window.PSG);
