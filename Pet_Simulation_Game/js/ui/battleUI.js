(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;

  function render(root, data) {
    data = data || {};
    var save = PSG.core.gameState.get();
    if (!save || !data.opponent) return PSG.core.scenes.go('ranking');

    var bossChallenge = data.bossChallenge || null;
    var state = PSG.battle.engine.create(
      save,
      data.opponent,
      data.consumableId,
      null,
      bossChallenge
        ? {
            mode: 'boss',
            arena: bossChallenge.arena,
            maxRounds: PSG.constants.BOSS_BATTLE_ROUNDS,
            bossChallenge: bossChallenge
          }
        : {}
    );
    var started = PSG.battle.engine.start(state);
    if (!started.ok) {
      PSG.ui.common.toast(PSG.ui.common.actionReason(save, bossChallenge ? 'bossBattle' : 'battle'), 'error');
      return PSG.core.scenes.go(bossChallenge ? 'boss' : 'ranking');
    }

    var stopped = false;
    var exiting = false;
    var timer = 0;
    var autoTimer = 0;
    var autoBattle = false;

    function logHtml(log) {
      var t = PSG.i18n.t;
      if (log.type === 'arena') {
        var arenaTarget = log.defender === 'player' ? state.player : state.enemy;
        return (
          '🌪️ ' +
          t('boss.log.arena', {
            target: d.escape(arenaTarget.name),
            arena: t('boss.arena.' + log.arenaId),
            damage: log.damage
          })
        );
      }
      var attacker = log.attacker === 'player' ? state.player : state.enemy;
      var defender = log.defender === 'player' ? state.player : state.enemy;
      if (log.dodged)
        return '&#128583; ' + t('battle.log.dodge', { defender: d.escape(defender.name), attack: t(log.attackKey) });
      return (
        (log.critical ? '&#10024; ' + t('battle.log.crit') + ' ' : '') +
        t('battle.log.hit', { attacker: d.escape(attacker.name), attack: t(log.attackKey), damage: log.hpDamage }) +
        (log.shieldAbsorbed ? ' ' + t('battle.log.shield', { value: log.shieldAbsorbed }) : '')
      );
    }

    function fighterHtml(fighter, species, enemy) {
      var label = enemy ? 'enemy' : '';
      return (
        '<article class="fighter ' +
        label +
        '"><h3>' +
        d.escape(fighter.name) +
        ' · LV ' +
        fighter.level +
        '</h3>' +
        d.bar('HP', fighter.hp, fighter.maxHp, '&#9829;', fighter.hp / fighter.maxHp < 0.3 ? 'danger' : 'primary') +
        d.bar('ENERGY', fighter.energy, 100, '&#9889;', 'energy') +
        (fighter.shield ? '<span class="tag">&#128737; ' + fighter.shield + '</span>' : '') +
        '<img class="fighter__portrait" id="' +
        (enemy ? 'enemy-fighter' : 'player-fighter') +
        '" src="' +
        species.image +
        '" alt="' +
        d.escape(fighter.name) +
        '"></article>'
      );
    }

    function fastEnabled() {
      return PSG.core.settings.battleFast !== false;
    }

    function saveFastSetting(value) {
      PSG.core.settings.battleFast = value;
      PSG.storage.save.saveSettings(PSG.core.settings);
    }

    function paint() {
      var t = PSG.i18n.t;
      var bossBattle = state.mode === 'boss';
      var playerSpecies = PSG.data.species[state.player.speciesId];
      var enemySpecies = PSG.data.species[state.enemy.speciesId];
      root.innerHTML =
        '<section class="scene battle-layout"><header class="scene-header"><div class="scene-header__title"><img src="assets/images/ui/logo-mark.svg" alt=""><div><span class="eyebrow">' +
        t(bossBattle ? 'boss.battleTitle' : 'battle.title') +
        '</span><h2 id="round-label">' +
        t(bossBattle ? 'boss.round' : 'battle.round', {
          round: Math.max(1, state.round + (state.round ? 0 : 1))
        }) +
        '</h2></div></div><div class="scene-actions"><label class="tag"><input id="fast-battle" type="checkbox" ' +
        (fastEnabled() ? 'checked' : '') +
        '> ' +
        t('battle.fast') +
        '</label><label class="tag"><input id="auto-battle" type="checkbox" ' +
        (autoBattle ? 'checked' : '') +
        '> ' +
        t('battle.auto') +
        '</label><button class="button button--small button--ghost" type="button" data-action="battle-exit">&#128190; ' +
        t('menu.saveAndMenu') +
        '</button></div></header><div class="battle-arena">' +
        fighterHtml(state.player, playerSpecies, false) +
        '<div class="versus"><span>' +
        (bossBattle
          ? t('boss.arenaLabel', { arena: t('boss.arena.' + state.arena.id) })
          : t('battle.round', { round: Math.max(1, state.round) })) +
        '</span><strong>VS</strong><span>' +
        state.maxRounds +
        ' MAX</span></div>' +
        fighterHtml(state.enemy, enemySpecies, true) +
        '</div><div class="battle-bottom"><div class="card battle-log" aria-live="polite"><ol reversed>' +
        state.logs
          .slice()
          .reverse()
          .map(function (log) {
            return '<li>' + logHtml(log) + '</li>';
          })
          .join('') +
        '</ol></div><div class="battle-commands"><button class="button" type="button" data-command="normal">&#9876;<span>' +
        t('battle.normal') +
        '</span></button><button class="button button--secondary" type="button" data-command="special" ' +
        (state.player.energy < 100 ? 'disabled' : '') +
        '>&#10024;<span>' +
        t('battle.special') +
        '<small style="display:block">' +
        t('battle.energyNeed', { energy: state.player.energy }) +
        '</small></span></button></div></div></section>';

      var fast = d.one('#fast-battle', root);
      var auto = d.one('#auto-battle', root);
      var exit = d.one('[data-action="battle-exit"]', root);
      fast.addEventListener('change', function () {
        saveFastSetting(fast.checked);
      });
      auto.addEventListener('change', function () {
        autoBattle = auto.checked;
        if (autoBattle) scheduleAuto(0);
      });
      exit.addEventListener('click', exitBattle);
      d.all('[data-command]', root).forEach(function (button) {
        button.addEventListener('click', function () {
          runCommand(button.dataset.command);
        });
      });
      if (autoBattle) scheduleAuto(120);
    }

    function scheduleAuto(delay) {
      clearTimeout(autoTimer);
      autoTimer = 0;
      if (!autoBattle || stopped || state.ended) return;
      autoTimer = window.setTimeout(
        function () {
          autoTimer = 0;
          if (!autoBattle || stopped || state.ended) return;
          runCommand(state.player.energy >= 100 ? 'special' : 'normal');
        },
        delay == null ? 120 : delay
      );
    }

    function runCommand(command) {
      if (stopped || state.ended) return;
      clearTimeout(autoTimer);
      autoTimer = 0;
      stopped = true;
      d.all('[data-command]', root).forEach(function (button) {
        button.disabled = true;
      });
      var outcome = PSG.battle.engine.round(state, command);
      if (!outcome.ok) {
        stopped = false;
        return paint();
      }
      animate(outcome.events, function () {
        stopped = false;
        if (state.ended) finish();
        else {
          paint();
          scheduleAuto(120);
        }
      });
    }

    function animate(events, done) {
      var fast = d.one('#fast-battle', root) && d.one('#fast-battle', root).checked;
      var delay = fast ? 90 : 380;
      var index = 0;
      function next() {
        if (exiting) return;
        if (index >= events.length) return done();
        var event = events[index++];
        var defender = d.one(event.defender === 'player' ? '#player-fighter' : '#enemy-fighter', root);
        if (event.type === 'arena') {
          if (defender)
            defender.animate(
              [
                { transform: 'translateY(0)', filter: 'brightness(1)' },
                { transform: 'translateY(2%)', filter: 'brightness(1.7) saturate(.4)' },
                { transform: 'translateY(0)', filter: 'brightness(1)' }
              ],
              { duration: delay }
            );
          PSG.audio.manager.sfx('hit');
          timer = window.setTimeout(next, delay);
          return;
        }
        var attacker = d.one(event.attacker === 'player' ? '#player-fighter' : '#enemy-fighter', root);
        if (attacker)
          attacker.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(' + (event.attacker === 'player' ? '7%' : '-7%') + ') scale(1.03)' },
              { transform: 'translateX(0)' }
            ],
            { duration: delay, easing: 'ease-out' }
          );
        if (defender && event.dodged)
          defender.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(' + (event.defender === 'player' ? '-8%' : '8%') + ')' },
              { transform: 'translateX(0)' }
            ],
            { duration: delay }
          );
        else if (defender)
          defender.animate(
            [{ filter: 'brightness(1)' }, { filter: 'brightness(1.7) saturate(.4)' }, { filter: 'brightness(1)' }],
            { duration: delay }
          );
        PSG.audio.manager.sfx(
          event.dodged ? 'dodge' : event.critical ? 'critical' : event.action === 'special' ? 'special' : 'attack'
        );
        timer = window.setTimeout(next, delay);
      }
      next();
    }

    function exitBattle() {
      exiting = true;
      stopped = true;
      clearTimeout(timer);
      clearTimeout(autoTimer);
      timer = 0;
      autoTimer = 0;
      var result = PSG.battle.engine.cancel(state);
      if (!result.ok) return;
      var slot = PSG.core.gameState.currentSlot;
      PSG.core.gameState.set(null, slot);
      PSG.core.scenes.go('menu');
      PSG.ui.common.toast(PSG.i18n.t('battle.exitSaved'), 'success');
    }

    function finish() {
      clearTimeout(timer);
      clearTimeout(autoTimer);
      timer = 0;
      autoTimer = 0;
      var result = PSG.battle.engine.settle(state);
      if (!result) return;
      var t = PSG.i18n.t;
      PSG.audio.manager.sfx(result.won ? 'victory' : 'defeat');
      if (result.champion || (result.boss && result.won)) PSG.audio.manager.play('champion');
      var bossBattle = result.boss;
      var rewardHtml = bossBattle
        ? result.won
          ? '<h3 style="margin-top:1rem">' +
            t('boss.rewardStage', { stage: result.stage }) +
            '</h3><p>' +
            t('boss.rewardCoins', { coins: result.coins }) +
            '</p><p>' +
            (result.xp.gained ? t('boss.rewardXp', { xp: result.xp.gained }) : t('boss.rewardMaxXp')) +
            '</p>' +
            (result.candy
              ? '<p class="tag tag--success">' +
                t('boss.rewardCandy', {
                  candy: t('candy.' + result.candy.stat),
                  value: result.candy.gain
                }) +
                '</p>'
              : '<p class="muted">' + t('boss.rewardNone') + '</p>')
          : '<h3 style="margin-top:1rem">' +
            t('battle.defeat') +
            '</h3><p>' +
            t('boss.defeat', { stage: result.stage }) +
            '</p>'
        : '<h3 style="margin-top:1rem">' + t('battle.reward', { xp: result.xp.gained, coins: result.coins }) + '</h3>';
      PSG.ui.common.modal({
        required: true,
        eyebrow:
          state.reason === 'turnLimit'
            ? t(bossBattle ? 'boss.turnLimit' : 'battle.turnLimit')
            : t(bossBattle ? 'boss.battleTitle' : 'battle.title'),
        title: result.won ? t('battle.victory') : t('battle.defeat'),
        body:
          '<div class="event-art" style="min-height:180px;font-size:5rem">' +
          (result.won ? '&#127942; : &#128293;' : '&#128128;') +
          '</div>' +
          rewardHtml +
          (result.rank.changed ? '<p>' + t('battle.rankUp', { rank: result.rank.after }) + '</p>' : '') +
          (result.firstMilestone
            ? '<blockquote class="card card--soft" style="margin-top:1rem">' +
              t('ranking.milestoneDefeat') +
              '</blockquote>'
            : '') +
          (result.champion
            ? '<div class="card card--soft" style="margin-top:1rem"><h3>' +
              t('champion.title') +
              '</h3><p>' +
              t('champion.body', { playerName: d.escape(save.player.name), petName: d.escape(save.pet.name) }) +
              '</p></div>'
            : ''),
        actions: PSG.ui.common.button(t(bossBattle ? 'boss.return' : 'battle.return'), 'battle-finish'),
        onOpen: function (dialog) {
          d.one('[data-action="battle-finish"]', dialog).addEventListener('click', function () {
            PSG.ui.common.closeModal();
            if (!result.boss && save.day.actionPoints === 0) PSG.ui.common.completeDay(save);
            PSG.core.scenes.go(result.boss ? 'boss' : result.champion ? 'home' : 'ranking');
          });
        }
      });
    }

    paint();
    return function () {
      exiting = true;
      stopped = true;
      clearTimeout(timer);
      clearTimeout(autoTimer);
    };
  }

  PSG.ui.battle = { render: render };
})(window.PSG);
