(function (NimGame) {
  'use strict';

  var context = null;
  var bgmGain = null;
  var sfxGain = null;
  var compressor = null;
  var currentPattern = 'menu';
  var bgmTimer = null;
  var isGameScreen = false;
  var isUnlocked = false;

  function ensureContext() {
    if (context) {
      return context;
    }

    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    context = new AudioContextCtor();
    bgmGain = context.createGain();
    sfxGain = context.createGain();
    compressor = context.createDynamicsCompressor();

    var limiter = NimGame.AudioConfig.limiter;
    compressor.threshold.value = limiter.threshold;
    compressor.knee.value = limiter.knee;
    compressor.ratio.value = limiter.ratio;
    compressor.attack.value = limiter.attack;
    compressor.release.value = limiter.release;

    bgmGain.connect(compressor);
    compressor.connect(context.destination);
    sfxGain.connect(context.destination);
    syncVolumes();
    return context;
  }

  function syncVolumes() {
    var state = NimGame.StateManager ? NimGame.StateManager.getState() : null;
    var settings = state ? state.settings : null;
    if (!settings || !context || !bgmGain || !sfxGain) {
      return;
    }
    var multiplier = isGameScreen ? NimGame.AudioConfig.inGameMultiplier : 1;
    var bgmValue = settings.bgmEnabled ? settings.bgmVolume * multiplier : 0;
    var sfxValue = settings.sfxEnabled ? settings.sfxVolume : 0;
    bgmGain.gain.setTargetAtTime(bgmValue, context.currentTime, 0.08);
    sfxGain.gain.setTargetAtTime(sfxValue, context.currentTime, 0.03);
  }

  function playTone(frequency, duration, when, gain, destination, type) {
    if (!context) {
      return;
    }
    var oscillator = context.createOscillator();
    var envelope = context.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.exponentialRampToValueAtTime(gain || 0.045, when + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  }

  function scheduleBgmTick() {
    if (!context || !bgmGain) {
      return;
    }
    var pattern = NimGame.AudioConfig.bgmPatterns[currentPattern] || NimGame.AudioConfig.bgmPatterns.menu;
    var now = context.currentTime;
    pattern.forEach(function (frequency, index) {
      playTone(frequency, 0.42, now + index * 0.28, 0.025, bgmGain, 'triangle');
      playTone(frequency / 2, 0.55, now + index * 0.28, 0.012, bgmGain, 'sine');
    });
  }

  function startBgm(patternName) {
    currentPattern = patternName || currentPattern;
    if (!isUnlocked) {
      return;
    }
    ensureContext();
    if (!context) {
      return;
    }
    if (context.state === 'suspended') {
      context.resume();
    }
    stopBgm();
    scheduleBgmTick();
    bgmTimer = window.setInterval(scheduleBgmTick, 1680);
  }

  function stopBgm() {
    if (bgmTimer) {
      window.clearInterval(bgmTimer);
      bgmTimer = null;
    }
  }

  function enterGameScreen() {
    isGameScreen = true;
    startBgm(Math.random() < 0.5 ? 'game' : 'gameAlt');
    syncVolumes();
  }

  function leaveGameScreen() {
    isGameScreen = false;
    startBgm('menu');
    syncVolumes();
  }

  function playSfx(name) {
    isUnlocked = true;
    ensureContext();
    if (!context || context.state === 'suspended') {
      return;
    }
    var now = context.currentTime;
    if (name === 'pick') {
      playTone(880, 0.12, now, 0.09, sfxGain, 'triangle');
      playTone(1174.66, 0.1, now + 0.04, 0.05, sfxGain, 'sine');
      return;
    }
    if (name === 'select') {
      playTone(659.25, 0.08, now, 0.08, sfxGain, 'triangle');
      playTone(987.77, 0.12, now + 0.05, 0.045, sfxGain, 'sine');
      return;
    }
    if (name === 'win') {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (frequency, index) {
        playTone(frequency, 0.18, now + index * 0.08, 0.08, sfxGain, 'triangle');
      });
      return;
    }
    if (name === 'lose') {
      [523.25, 440, 349.23].forEach(function (frequency, index) {
        playTone(frequency, 0.22, now + index * 0.1, 0.055, sfxGain, 'sine');
      });
      return;
    }
    playTone(1046.5, 0.08, now, 0.06, sfxGain, 'triangle');
  }

  document.addEventListener('nim:settings-change', syncVolumes);

  function unlockAudio() {
    isUnlocked = true;
    ensureContext();
    if (context && context.state === 'suspended') {
      context.resume();
    }
    startBgm(currentPattern);
  }

  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });

  NimGame.AudioManager = {
    ensureContext: ensureContext,
    startBgm: startBgm,
    stopBgm: stopBgm,
    enterGameScreen: enterGameScreen,
    leaveGameScreen: leaveGameScreen,
    playSfx: playSfx,
    syncVolumes: syncVolumes,
    getDebugState: function () {
      return {
        hasContext: Boolean(context),
        hasBgmGain: Boolean(bgmGain),
        hasSfxGain: Boolean(sfxGain),
        hasCompressor: Boolean(compressor),
        inGameMultiplier: NimGame.AudioConfig.inGameMultiplier
      };
    }
  };
}(window.NimGame = window.NimGame || {}));
