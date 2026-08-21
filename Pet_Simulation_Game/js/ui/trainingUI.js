(function (PSG) {
  'use strict';

  var d = PSG.utils.dom;
  var activeCleanup = null;

  function render(root) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    var save = PSG.core.gameState.get();
    if (!save) return PSG.core.scenes.go('menu');
    var t = PSG.i18n.t;
    var unavailableReason = PSG.ui.common.actionReason(save, 'training');

    root.innerHTML =
      '<section class="scene">' +
      PSG.ui.common.sceneHeader('🎯', t('training.title'), 'home') +
      PSG.ui.common.topbar(save) +
      '<div class="training-intro card card--soft"><div><span class="eyebrow">✦ TRAINING LAB</span><h3>' +
      t('training.choose') +
      '</h3><p class="muted">' +
      t('training.ready') +
      '</p></div><div class="training-intro__symbols" aria-hidden="true"><span>⚔</span><span>🛡</span><span>➤</span></div></div>' +
      '<div class="choice-grid training-choice-grid">' +
      PSG.constants.STAT_KEYS.map(function (key) {
        return trainingCard(save, key, unavailableReason);
      }).join('') +
      '</div>' +
      '</section>';

    d.all('[data-train]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        activeCleanup = startGame(root, button.dataset.train);
      });
    });
    return function () {
      if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
      }
    };
  }

  function trainingCard(save, key, unavailableReason) {
    var t = PSG.i18n.t;
    var mastery = save.pet.mastery[key];
    var template = PSG.training.manager.templateFor(key);
    var max = mastery.level >= 20 ? 1 : PSG.pet.progression.masteryXpToNext(mastery.level);
    var xp = mastery.level >= 20 ? 1 : mastery.xp;
    return (
      '<article class="card training-card training-card--' +
      template +
      '">' +
      '<div class="training-card__aura" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="card__header"><span class="training-card__stat">' +
      statIcon(key) +
      ' ' +
      t('stat.' + key) +
      '</span><span class="tag">' +
      t('stat.mastery') +
      ' ' +
      (mastery.level >= 20 ? t('common.max') : mastery.level) +
      '</span></div>' +
      d.bar(t('stat.mastery'), xp, max, '✦', 'primary') +
      '<p class="muted">' +
      t('training.' + template) +
      '</p>' +
      '<button class="button button--wide" type="button" data-train="' +
      key +
      '" ' +
      (unavailableReason ? 'disabled title="' + d.escape(unavailableReason) + '"' : '') +
      '>' +
      t('training.start') +
      '</button>' +
      '</article>'
    );
  }

  function statIcon(key) {
    return { hp: '♥', attack: '⚔', defense: '🛡', mobility: '🪽', spAttack: '✦', spDefense: '◇', speed: '➤' }[key];
  }

  function startGame(root, stat) {
    var save = PSG.core.gameState.get();
    var t = PSG.i18n.t;
    var availability = PSG.pet.daily.can(save, 'training');
    if (!availability.ok) {
      PSG.ui.common.toast(PSG.ui.common.actionReason(save, 'training'), 'warning');
      return function () {};
    }
    var template = PSG.training.manager.templateFor(stat);
    var scores = [];
    var streak = 0;
    var running = true;
    var raf = 0;
    var countdownTimer = 0;
    var started = performance.now();
    var pausedAt = 0;
    var effectTimers = [];
    var resumeGame = function () {};
    var extraCleanup = function () {};
    var rng = new PSG.utils.RNG(
      PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, stat, save.stats.trainingGolds)
    );

    root.innerHTML =
      '<section class="scene">' +
      PSG.ui.common.sceneHeader(
        '🎯',
        t('training.' + template),
        'training',
        PSG.ui.common.button(t('menu.saveAndMenu'), 'save-menu', 'ghost')
      ) +
      '<div class="minigame training-game training-game--' +
      template +
      '">' +
      ambientHtml() +
      '<header class="training-game__header"><div><span class="eyebrow">' +
      statIcon(stat) +
      ' ' +
      t('stat.' + stat) +
      '</span><h2>' +
      t('training.' + template) +
      '</h2><p class="muted">' +
      t('training.' + template + 'Help') +
      '</p></div><div class="training-game__emblem" aria-hidden="true">' +
      statIcon(stat) +
      '</div></header>' +
      '<div class="training-game__hud"><div id="game-status" class="number">0 / ' +
      (template === 'agility' ? '15s' : template === 'strength' ? 5 : 4) +
      '</div><div id="score-preview" class="tag">' +
      t('training.score', { score: 0 }) +
      '</div><div id="combo-preview" class="tag training-combo" hidden></div></div>' +
      '<div id="game-area" class="training-game__area"><div class="training-fx-layer" aria-hidden="true"></div></div>' +
      '</div>' +
      '</section>';

    var area = d.one('#game-area', root);
    var status = d.one('#game-status', root);
    var preview = d.one('#score-preview', root);
    var combo = d.one('#combo-preview', root);

    function average() {
      return scores.length
        ? Math.round(
            scores.reduce(function (sum, value) {
              return sum + value;
            }, 0) / scores.length
          )
        : 0;
    }

    function updatePreview(scoreOverride) {
      preview.textContent = t('training.score', { score: scoreOverride == null ? average() : scoreOverride });
    }

    function updateCombo(success) {
      streak = success ? streak + 1 : 0;
      combo.hidden = streak < 2;
      combo.textContent = t('training.combo', { count: streak });
      if (streak >= 2) restartClass(combo, 'is-popping');
    }

    function recordScore(score) {
      scores.push(score);
      updatePreview();
      updateCombo(score >= 60);
      showFeedback(score);
    }

    function showFeedback(score) {
      var feedback = PSG.training.manager.feedbackFor(score);
      var layer = d.one('.training-fx-layer', area);
      var label = document.createElement('strong');
      label.className = 'training-feedback training-feedback--' + feedback.tone;
      label.textContent = t('training.feedback.' + feedback.id) + ' +' + Math.round(score);
      layer.appendChild(label);

      for (var index = 0; index < 10; index += 1) {
        var spark = document.createElement('span');
        spark.className = 'training-burst training-burst--' + feedback.tone;
        spark.style.setProperty('--burst-angle', index * 36 + 'deg');
        spark.style.setProperty('--burst-distance', 42 + (index % 3) * 12 + 'px');
        layer.appendChild(spark);
        rememberTimeout(
          (function (node) {
            return function () {
              node.remove();
            };
          })(spark),
          820
        );
      }
      restartClass(area, 'is-' + feedback.tone);
      rememberTimeout(function () {
        label.remove();
      }, 850);
      rememberTimeout(function () {
        area.classList.remove('is-' + feedback.tone);
      }, 500);
    }

    function rememberTimeout(callback, delay) {
      var timer = window.setTimeout(callback, delay);
      effectTimers.push(timer);
      return timer;
    }

    function clearEffects() {
      effectTimers.forEach(function (timer) {
        window.clearTimeout(timer);
      });
      effectTimers.length = 0;
    }

    function finish(scoreOverride) {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(countdownTimer);
      extraCleanup();
      clearEffects();
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
      var finalScore = scoreOverride == null ? average() : scoreOverride;
      var result = PSG.training.manager.settle(save, stat, finalScore);
      if (!result.ok) {
        PSG.ui.common.toast(PSG.ui.common.actionReason(save, 'training'), 'warning');
        return PSG.core.scenes.go('training');
      }
      PSG.audio.manager.sfx(result.grade === 'gold' ? 'gold' : 'confirm');
      PSG.ui.common.modal({
        required: true,
        eyebrow: t('training.score', { score: result.score }),
        title: t('training.' + result.grade),
        body:
          celebrationHtml(result.grade) +
          '<div class="training-result-copy"><p>' +
          t('training.result', { xp: result.xp.gained, mastery: result.mastery.gained }) +
          '</p><p class="muted">' +
          t('common.bp', { bp: result.bp }) +
          '</p></div>',
        actions: PSG.ui.common.button(t('common.confirm'), 'training-close'),
        onOpen: function (dialog) {
          d.one('[data-action="training-close"]', dialog).addEventListener('click', function () {
            PSG.ui.common.closeModal();
            if (save.day.actionPoints === 0) {
              PSG.ui.common.completeDay(save);
            }
            PSG.core.scenes.go('home');
          });
        }
      });
    }

    // Pause every clock and input loop when the tab loses focus; this avoids free misses.
    function pause() {
      if (!running || pausedAt) return;
      pausedAt = performance.now();
      cancelAnimationFrame(raf);
      area.classList.add('is-paused');
      PSG.ui.common.toast(t('training.paused'));
    }

    function resume() {
      if (!running || !pausedAt) return;
      var lost = performance.now() - pausedAt;
      started += lost;
      pausedAt = 0;
      area.classList.remove('is-paused');
      var count = 3;
      status.textContent = count;
      countdownTimer = window.setInterval(function () {
        count -= 1;
        status.textContent = count || 'GO!';
        if (!count) {
          clearInterval(countdownTimer);
          resumeGame(lost);
        }
      }, 700);
    }

    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);

    if (template === 'strength') setupStrength();
    else if (template === 'endurance') setupEndurance();
    else setupAgility();

    function setupStrength() {
      area.insertAdjacentHTML(
        'afterbegin',
        '<div class="meter-wrap"><div class="game-meter game-meter--rhythm"><span class="game-meter__center-glow"></span><span class="game-meter__marker"></span></div><div class="meter-caption"><span>0</span><strong>100</strong><span>0</span></div></div><button class="button training-action-button" id="game-button" type="button"><span>✦</span>' +
          t('training.hit') +
          '</button>'
      );
      var marker = d.one('.game-meter__marker', area);
      var hit = d.one('#game-button', area);
      var lastPhase = 0;
      function strengthLoop(now) {
        if (!running || pausedAt) return;
        var cycle = PSG.core.settings.motion === 'reduced' ? 2000 : 1400;
        var elapsed = ((now || performance.now()) - started) / cycle;
        lastPhase = (Math.sin(elapsed * Math.PI * 2 - Math.PI / 2) + 1) / 2;
        marker.style.left = 'calc(' + lastPhase * 100 + '% - 7px)';
        raf = requestAnimationFrame(strengthLoop);
      }
      resumeGame = function () {
        strengthLoop();
      };
      hit.addEventListener('click', function () {
        if (!running || pausedAt) return;
        recordScore(PSG.training.strength.scoreAt(lastPhase));
        PSG.audio.manager.sfx('hit');
        status.textContent = scores.length + ' / 5';
        if (scores.length >= 5) finish();
      });
      strengthLoop();
    }

    function setupEndurance() {
      area.insertAdjacentHTML(
        'afterbegin',
        '<div class="meter-wrap"><div class="game-meter game-meter--charge"><span class="game-meter__center-glow"></span><span class="game-meter__marker"></span></div><div class="meter-caption"><span>0</span><strong>72</strong><span>100</span></div></div><button class="button training-action-button" id="game-button" type="button"><span>⬆</span>' +
          t('training.hold') +
          '</button>'
      );
      var chargeMarker = d.one('.game-meter__marker', area);
      var hold = d.one('#game-button', area);
      var holdStart = 0;
      function chargeLoop() {
        if (!holdStart || !running || pausedAt) return;
        var duration = PSG.core.settings.motion === 'reduced' ? 2200 : 1600;
        var phase = Math.min(1, (performance.now() - holdStart) / duration);
        chargeMarker.style.left = 'calc(' + phase * 100 + '% - 7px)';
        raf = requestAnimationFrame(chargeLoop);
      }
      function beginHold(event) {
        if (event) event.preventDefault();
        if (!running || holdStart) return;
        holdStart = performance.now();
        area.classList.add('is-charging');
        chargeLoop();
      }
      function endHold(event) {
        if (event) event.preventDefault();
        if (!running || !holdStart || pausedAt) return;
        var duration = PSG.core.settings.motion === 'reduced' ? 2200 : 1600;
        var phase = Math.min(1, (performance.now() - holdStart) / duration);
        holdStart = 0;
        cancelAnimationFrame(raf);
        area.classList.remove('is-charging');
        chargeMarker.style.left = '0';
        recordScore(PSG.training.endurance.scoreAt(phase));
        PSG.audio.manager.sfx('hit');
        status.textContent = scores.length + ' / 4';
        if (scores.length >= 4) finish();
      }
      hold.addEventListener('pointerdown', beginHold);
      window.addEventListener('pointerup', endHold, { passive: false });
      hold.addEventListener('keydown', function (event) {
        if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) beginHold(event);
      });
      hold.addEventListener('keyup', function (event) {
        if (event.key === ' ' || event.key === 'Enter') endHold(event);
      });
      resumeGame = function (lost) {
        if (holdStart) {
          holdStart += lost;
          chargeLoop();
        }
      };
      extraCleanup = function () {
        window.removeEventListener('pointerup', endHold);
      };
    }

    function setupAgility() {
      area.insertAdjacentHTML(
        'afterbegin',
        '<div class="agility-field"><div class="agility-field__grid" aria-hidden="true"></div><button class="button agility-target" type="button"><span></span>' +
          t('training.target') +
          '</button></div>'
      );
      var field = d.one('.agility-field', area);
      var target = d.one('.agility-target', area);
      var hits = 0;
      var misses = 0;
      function moveTarget() {
        target.style.left = Math.round(rng.next() * 82 + 4) + '%';
        target.style.top = Math.round(rng.next() * 70 + 8) + '%';
        restartClass(target, 'is-warping');
        target.focus({ preventScroll: true });
      }
      target.addEventListener('click', function () {
        hits += 1;
        updateCombo(true);
        showFeedback(100);
        PSG.audio.manager.sfx('hit');
        moveTarget();
        if (hits >= 10) finish(PSG.training.agility.score(hits, misses));
      });
      field.addEventListener('click', function (event) {
        if (event.target === field || event.target.classList.contains('agility-field__grid')) {
          misses += 1;
          updateCombo(false);
          showFeedback(0);
          PSG.audio.manager.sfx('miss');
        }
      });
      function agilityLoop(now) {
        if (!running || pausedAt) return;
        var remaining = Math.max(0, 15 - ((now || performance.now()) - started) / 1000);
        var liveScore = PSG.training.agility.score(hits, misses);
        status.textContent = remaining.toFixed(1) + 's';
        updatePreview(liveScore);
        if (remaining <= 0) finish(liveScore);
        else raf = requestAnimationFrame(agilityLoop);
      }
      resumeGame = function () {
        agilityLoop();
      };
      moveTarget();
      agilityLoop();
    }

    return function () {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(countdownTimer);
      extraCleanup();
      clearEffects();
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
    };
  }

  function restartClass(node, className) {
    node.classList.remove(className);
    void node.offsetWidth;
    node.classList.add(className);
  }

  function ambientHtml() {
    var particles = '';
    for (var index = 0; index < 12; index += 1) {
      particles +=
        '<span style="--particle-left:' +
        ((index * 19 + 7) % 94) +
        '%;--particle-size:' +
        (5 + index * 0.35) +
        'px;--particle-duration:' +
        (4 + index * 0.28) +
        's;--particle-delay:' +
        index * -0.47 +
        's"></span>';
    }
    return '<div class="training-ambient" aria-hidden="true">' + particles + '</div>';
  }

  function celebrationHtml(grade) {
    var medal = grade === 'gold' ? '🥇' : grade === 'silver' ? '🥈' : '🥉';
    var confetti = '';
    for (var index = 0; index < 16; index += 1) {
      confetti +=
        '<span style="--confetti-left:' +
        (4 + index * 6) +
        '%;--confetti-color:hsl(' +
        index * 43 +
        'deg 78% 58%);--confetti-duration:' +
        (1.5 + index * 0.07) +
        's;--confetti-delay:' +
        index * -0.12 +
        's"></span>';
    }
    return (
      '<div class="training-celebration training-celebration--' +
      grade +
      '" aria-hidden="true"><div class="training-celebration__rays"></div><strong>' +
      medal +
      '</strong><div class="training-confetti">' +
      confetti +
      '</div></div>'
    );
  }

  PSG.ui.training = { render: render };
})(window.PSG);
