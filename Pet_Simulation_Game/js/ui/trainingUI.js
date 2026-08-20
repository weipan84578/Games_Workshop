(function (PSG) {
  'use strict';

  var d = PSG.utils.dom;
  var activeCleanup = null;
  function masteryProgress(save, key) {
    var value = save.pet.mastery[key];
    return value.level >= 20 ? 1 : value.xp / PSG.pet.progression.masteryXpToNext(value.level);
  }
  function render(root) {
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
    var save = PSG.core.gameState.get(); if (!save) return PSG.core.scenes.go('menu');
    var t = PSG.i18n.t;
    root.innerHTML = '<section class="scene">' + PSG.ui.common.sceneHeader('🎯', t('training.title'), 'home') + PSG.ui.common.topbar(save) + '<div class="card card--soft" style="margin-bottom:1rem"><h3>' + t('training.choose') + '</h3><p class="muted">' + t('training.strengthHelp') + ' · ' + t('training.enduranceHelp') + ' · ' + t('training.agilityHelp') + '</p></div><div class="choice-grid">' + PSG.constants.STAT_KEYS.map(function (key) { var mastery = save.pet.mastery[key], template = PSG.training.manager.templateFor(key), max = mastery.level >= 20 ? 1 : PSG.pet.progression.masteryXpToNext(mastery.level), xp = mastery.level >= 20 ? 1 : mastery.xp; return '<article class="card training-card"><div class="card__header"><span class="training-card__stat">' + statIcon(key) + ' ' + t('stat.' + key) + '</span><span class="tag">' + t('stat.mastery') + ' ' + (mastery.level >= 20 ? t('common.max') : mastery.level) + '</span></div>' + d.bar(t('stat.mastery'), xp, max, '✦', 'primary') + '<p class="muted">' + t('training.' + template) + '</p><button class="button button--wide" type="button" data-train="' + key + '">' + t('training.start') + '</button></article>'; }).join('') + '</div></section>';
    d.all('[data-train]', root).forEach(function (button) { button.addEventListener('click', function () { activeCleanup = startGame(root, button.dataset.train); }); });
    return function () { if (activeCleanup) { activeCleanup(); activeCleanup = null; } };
  }
  function statIcon(key) { return { hp:'♥',attack:'⚔',defense:'🛡',mobility:'🪽',spAttack:'✦',spDefense:'◇',speed:'➤' }[key]; }

  function startGame(root, stat) {
    var save = PSG.core.gameState.get(), t = PSG.i18n.t, template = PSG.training.manager.templateFor(stat);
    var scores = [], running = true, raf = 0, countdownTimer = 0, started = performance.now(), pausedAt = 0;
    var resumeGame = function () {}, extraCleanup = function () {};
    var rng = new PSG.utils.RNG(PSG.utils.seedFrom(save.ranking.rankingSeed, save.day.number, stat, save.stats.trainingGolds));
    root.innerHTML = '<section class="scene">' + PSG.ui.common.sceneHeader('🎯', t('training.' + template), 'training') + '<div class="minigame"><span class="eyebrow">' + t('stat.' + stat) + '</span><h2>' + t('training.' + template) + '</h2><p class="muted">' + t('training.' + template + 'Help') + '</p><div id="game-status" class="number">0 / ' + (template === 'agility' ? '15s' : template === 'strength' ? 5 : 4) + '</div><div id="game-area"></div><div id="score-preview" class="tag">' + t('training.score', { score: 0 }) + '</div></div></section>';
    var area = d.one('#game-area', root), status = d.one('#game-status', root), preview = d.one('#score-preview', root);
    function average() { return scores.length ? Math.round(scores.reduce(function (sum, value) { return sum + value; }, 0) / scores.length) : 0; }
    function updatePreview() { preview.textContent = t('training.score', { score: average() }); }
    function finish(scoreOverride) {
      if (!running) return; running = false; cancelAnimationFrame(raf); clearInterval(countdownTimer); extraCleanup(); window.removeEventListener('blur', pause); window.removeEventListener('focus', resume);
      var finalScore = scoreOverride == null ? average() : scoreOverride;
      var result = PSG.training.manager.settle(save, stat, finalScore);
      PSG.audio.manager.sfx(result.grade === 'gold' ? 'gold' : 'confirm');
      PSG.ui.common.modal({ required: true, eyebrow: t('training.score', { score: result.score }), title: t('training.' + result.grade), body: '<div class="event-art" style="min-height:170px;font-size:5rem">' + (result.grade === 'gold' ? '🥇' : result.grade === 'silver' ? '🥈' : '🥉') + '</div><p style="margin-top:1rem">' + t('training.result', { xp: result.xp.gained, mastery: result.mastery.gained }) + '</p><p class="muted">' + t('common.bp', { bp: result.bp }) + '</p>', actions: PSG.ui.common.button(t('common.confirm'), 'training-close'), onOpen: function (dialog) { d.one('[data-action="training-close"]', dialog).addEventListener('click', function () { PSG.ui.common.closeModal(); if (save.day.actionPoints === 0) { PSG.pet.daily.nextDay(save); PSG.ui.common.toast(t('day.summary', { day: save.day.number })); } PSG.core.scenes.go('home'); }); } });
    }
    // The mini-games pause their own clock on blur so a background tab never turns into an unfair miss.
    function pause() { if (!running || pausedAt) return; pausedAt = performance.now(); cancelAnimationFrame(raf); PSG.ui.common.toast(t('training.paused')); }
    function resume() { if (!running || !pausedAt) return; var lost = performance.now() - pausedAt; started += lost; pausedAt = 0; var count = 3; status.textContent = count; countdownTimer = window.setInterval(function () { count -= 1; status.textContent = count || 'GO!'; if (!count) { clearInterval(countdownTimer); resumeGame(lost); } }, 700); }
    window.addEventListener('blur', pause); window.addEventListener('focus', resume);

    if (template === 'strength') {
      area.innerHTML = '<div class="game-meter"><span class="game-meter__marker"></span></div><button class="button" id="game-button" type="button">' + t('training.hit') + '</button>';
      var marker = d.one('.game-meter__marker', area), hit = d.one('#game-button', area), lastPhase = 0;
      function strengthLoop(now) { if (!running || pausedAt) return; var cycle = PSG.core.settings.motion === 'reduced' ? 2000 : 1400; var elapsed = ((now || performance.now()) - started) / cycle; lastPhase = (Math.sin(elapsed * Math.PI * 2 - Math.PI / 2) + 1) / 2; marker.style.left = 'calc(' + (lastPhase * 100) + '% - 7px)'; raf = requestAnimationFrame(strengthLoop); }
      resumeGame = function () { strengthLoop(); };
      hit.addEventListener('click', function () { if (!running || pausedAt) return; scores.push(PSG.training.strength.scoreAt(lastPhase)); PSG.audio.manager.sfx('hit'); status.textContent = scores.length + ' / 5'; updatePreview(); if (scores.length >= 5) finish(); });
      strengthLoop();
    } else if (template === 'endurance') {
      area.innerHTML = '<div class="game-meter"><span class="game-meter__marker"></span></div><button class="button" id="game-button" type="button">' + t('training.hold') + '</button>';
      var chargeMarker = d.one('.game-meter__marker', area), hold = d.one('#game-button', area), holdStart = 0;
      function chargeLoop() { if (!holdStart || !running || pausedAt) return; var duration = PSG.core.settings.motion === 'reduced' ? 2200 : 1600; var phase = Math.min(1, (performance.now() - holdStart) / duration); chargeMarker.style.left = 'calc(' + (phase * 100) + '% - 7px)'; raf = requestAnimationFrame(chargeLoop); }
      function beginHold(event) { if (event) event.preventDefault(); if (!running || holdStart) return; holdStart = performance.now(); chargeLoop(); }
      function endHold(event) { if (event) event.preventDefault(); if (!running || !holdStart || pausedAt) return; var duration = PSG.core.settings.motion === 'reduced' ? 2200 : 1600; var phase = Math.min(1, (performance.now() - holdStart) / duration); holdStart = 0; cancelAnimationFrame(raf); chargeMarker.style.left = '0'; scores.push(PSG.training.endurance.scoreAt(phase)); PSG.audio.manager.sfx('hit'); status.textContent = scores.length + ' / 4'; updatePreview(); if (scores.length >= 4) finish(); }
      hold.addEventListener('pointerdown', beginHold); window.addEventListener('pointerup', endHold, { passive: false }); hold.addEventListener('keydown', function (event) { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) beginHold(event); }); hold.addEventListener('keyup', function (event) { if (event.key === ' ' || event.key === 'Enter') endHold(event); });
      resumeGame = function (lost) { if (holdStart) { holdStart += lost; chargeLoop(); } };
      extraCleanup = function () { window.removeEventListener('pointerup', endHold); };
    } else {
      area.innerHTML = '<div class="agility-field"><button class="button agility-target" type="button">' + t('training.target') + '</button></div>';
      var field = d.one('.agility-field', area), target = d.one('.agility-target', area), hits = 0, misses = 0;
      function moveTarget() { target.style.left = Math.round(rng.next() * 82 + 4) + '%'; target.style.top = Math.round(rng.next() * 70 + 8) + '%'; target.focus({ preventScroll: true }); }
      target.addEventListener('click', function () { hits += 1; PSG.audio.manager.sfx('hit'); moveTarget(); if (hits >= 10) finish(PSG.training.agility.score(hits, misses)); });
      field.addEventListener('click', function (event) { if (event.target === field) { misses += 1; PSG.audio.manager.sfx('miss'); } });
      function agilityLoop(now) { if (!running || pausedAt) return; var remaining = Math.max(0, 15 - (((now || performance.now()) - started) / 1000)); status.textContent = remaining.toFixed(1) + 's'; preview.textContent = t('training.score', { score: PSG.training.agility.score(hits, misses) }); if (remaining <= 0) finish(PSG.training.agility.score(hits, misses)); else raf = requestAnimationFrame(agilityLoop); }
      resumeGame = function () { agilityLoop(); }; moveTarget(); agilityLoop();
    }
    return function () { running = false; cancelAnimationFrame(raf); clearInterval(countdownTimer); extraCleanup(); window.removeEventListener('blur', pause); window.removeEventListener('focus', resume); };
  }
  PSG.ui.training = { render: render };
})(window.PSG);
