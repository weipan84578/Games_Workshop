(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;
  function render(root) {
    var t = PSG.i18n.t,
      save = PSG.core.gameState.get(),
      back = save ? 'home' : 'menu';
    var sections = [
      {
        id: 'quick',
        icon: '🚀',
        body: t('help.quick.body'),
        points: [t('help.point.ap'), t('help.point.loop'), t('help.point.duelCost')]
      },
      {
        id: 'pets',
        icon: '🐾',
        body: t('onboard.chooseHint'),
        points: [
          t('species.eagle') + ' — ' + t('species.eagle.role'),
          t('species.lion') + ' — ' + t('species.lion.role'),
          t('species.crocodile') + ' — ' + t('species.crocodile.role')
        ]
      },
      {
        id: 'stats',
        icon: '📊',
        body: t('help.stats.body'),
        points: ['HP · ATK · DEF', 'MOB · SPA · SPD · SPE', t('help.point.mastery')]
      },
      {
        id: 'daily',
        icon: '☀',
        body: t('help.quick.body'),
        points: [
          t('home.training') + ' 1 AP / 20 ⚡',
          t('home.play') + ' 1 AP / 10 ⚡',
          t('home.outing') + ' 1 AP / 15 ⚡',
          t('home.ranking') + ' 2 AP / 30 ⚡'
        ]
      },
      {
        id: 'training',
        icon: '🎯',
        body: t('training.strengthHelp'),
        points: [
          t('training.strength'),
          t('training.endurance'),
          t('training.agility'),
          t('training.gold') + ' ≥85 · ' + t('training.silver') + ' ≥60 · ' + t('training.bronze') + ' <60'
        ]
      },
      {
        id: 'battle',
        icon: '⚔',
        body: t('help.battle.body'),
        points: [t('help.point.damage'), t('help.point.crit'), t('help.point.rounds'), t('battle.auto')]
      },
      {
        id: 'ranking',
        icon: '🏆',
        body: t('help.ranking.body'),
        points: [t('help.point.ranking'), t('help.point.candidates'), t('help.point.swap')]
      },
      {
        id: 'shop',
        icon: '🛡',
        body: t('shop.title'),
        points: [t('help.point.slots'), t('help.point.gear'), t('help.point.items'), t('help.point.candy')]
      },
      {
        id: 'save',
        icon: '💾',
        body: t('help.save.body'),
        points: [
          t('menu.saveSlots'),
          t('menu.saveAndMenu'),
          t('help.point.autoSave'),
          t('help.point.offline'),
          t('help.point.settings')
        ]
      },
      {
        id: 'faq',
        icon: '?',
        body: t('help.save.body'),
        points: [t('help.point.noDeath'), t('help.point.noRankLoss'), t('help.point.max')]
      }
    ];
    root.innerHTML =
      '<section class="scene">' +
      PSG.ui.common.sceneHeader('❓', t('help.title'), back) +
      '<div class="help-layout"><nav class="help-nav card" aria-label="' +
      t('help.title') +
      '">' +
      sections
        .map(function (section, index) {
          return (
            '<a class="tab-button ' +
            (index === 0 ? 'is-active' : '') +
            '" href="#help-' +
            section.id +
            '">' +
            section.icon +
            ' ' +
            t('help.' + section.id) +
            '</a>'
          );
        })
        .join('') +
      '</nav><div class="help-content">' +
      sections
        .map(function (section) {
          return (
            '<article class="card help-section" id="help-' +
            section.id +
            '"><div class="card__header"><span style="font-size:2rem">' +
            section.icon +
            '</span><span class="eyebrow">Beast Bond Arena</span></div><h2>' +
            t('help.' + section.id) +
            '</h2><p>' +
            section.body +
            '</p><ul>' +
            section.points
              .map(function (point) {
                return '<li>' + point + '</li>';
              })
              .join('') +
            '</ul></article>'
          );
        })
        .join('') +
      (save
        ? '<button class="button" type="button" data-action="replay-tutorial">' + t('help.replayTutorial') + '</button>'
        : '') +
      '</div></div></section>';
    var replay = d.one('[data-action="replay-tutorial"]', root);
    if (replay)
      replay.addEventListener('click', function () {
        PSG.ui.onboarding.tutorial(save, 1);
      });
  }
  PSG.ui.instructions = { render: render };
})(window.PSG);
