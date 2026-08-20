(function (PSG) {
  'use strict';

  var BGM_CHANNEL_COUNT = 2;
  var BGM_FADE_MS = 600;
  var BGM_FADE_INTERVAL_MS = 40;
  var MAX_QUEUED_SFX = 8;

  var context = null;
  var master = null;
  var bgmGain = null;
  var sfxGain = null;
  var compressor = null;
  var channels = [];
  var activeIndex = 0;
  var currentTrack = null;
  var unlocked = false;
  var directMode = false;
  var unlockPromise = null;
  var pendingSfx = [];

  function settings() {
    return PSG.core.settings || PSG.storage.save.settingsDefaults();
  }

  function clampVolume(value, fallback) {
    var number = Number(value);
    if (!isFinite(number)) return fallback;
    return Math.max(0, Math.min(1, number));
  }

  function pauseChannel(channel) {
    if (!channel) return;
    if (channel.fadeTimer) {
      window.clearInterval(channel.fadeTimer);
      channel.fadeTimer = null;
    }
    try { channel.audio.pause(); } catch (error) {}
  }

  function stopChannels() {
    channels.forEach(pauseChannel);
    channels = [];
    activeIndex = 0;
  }

  function clearAudioGraph() {
    context = null;
    master = null;
    bgmGain = null;
    sfxGain = null;
    compressor = null;
  }

  function createDirectChannels() {
    if (directMode && channels.length === BGM_CHANNEL_COUNT) return true;

    stopChannels();
    clearAudioGraph();
    directMode = true;
    try {
      for (var index = 0; index < BGM_CHANNEL_COUNT; index += 1) {
        var audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;
        channels.push({ audio: audio, gain: null, pending: false, fadeTimer: null });
      }
      apply();
      return true;
    } catch (error) {
      stopChannels();
      directMode = false;
      return false;
    }
  }

  function createWebAudioChannels(AudioContextClass) {
    stopChannels();
    clearAudioGraph();
    directMode = false;
    context = new AudioContextClass();
    master = context.createGain();
    bgmGain = context.createGain();
    sfxGain = context.createGain();
    compressor = context.createDynamicsCompressor();

    // BGM pre-gain is always followed by peak compression before the master output.
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    bgmGain.connect(compressor);
    compressor.connect(master);
    sfxGain.connect(master);
    master.connect(context.destination);

    for (var index = 0; index < BGM_CHANNEL_COUNT; index += 1) {
      var audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      var gain = context.createGain();
      gain.gain.value = 0;
      context.createMediaElementSource(audio).connect(gain).connect(bgmGain);
      channels.push({ audio: audio, gain: gain, pending: false, fadeTimer: null });
    }
    apply();
  }

  function ensure() {
    if (context || (directMode && channels.length)) return true;

    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    // The game is designed to open directly from file://, where plain media elements
    // are more reliable than a MediaElementSource graph in some browsers.
    if ((window.location && window.location.protocol === 'file:') || !AudioContextClass) return createDirectChannels();

    try {
      createWebAudioChannels(AudioContextClass);
      return true;
    } catch (error) {
      stopChannels();
      clearAudioGraph();
      return createDirectChannels();
    }
  }

  function switchToDirect() {
    if (directMode && channels.length) return true;
    return createDirectChannels();
  }

  function startPendingAudio() {
    if (currentTrack) play(currentTrack);
    flushPendingSfx();
  }

  function fallbackAfterUnlockFailure() {
    if (!switchToDirect()) {
      unlocked = false;
      return false;
    }
    unlocked = true;
    startPendingAudio();
    return true;
  }

  function unlock() {
    if (!ensure()) return Promise.resolve(false);

    // Start media synchronously while the pointer/keyboard gesture is still active.
    unlocked = true;
    startPendingAudio();
    if (unlockPromise) return unlockPromise;
    if (!context || !context.resume) return Promise.resolve(true);

    var resumeResult;
    try {
      resumeResult = context.resume();
    } catch (error) {
      return Promise.resolve(fallbackAfterUnlockFailure());
    }

    unlockPromise = Promise.resolve(resumeResult).then(function () {
      startPendingAudio();
      return true;
    }, fallbackAfterUnlockFailure).then(function (result) {
      unlockPromise = null;
      return result;
    }, function () {
      unlockPromise = null;
      return false;
    });
    return unlockPromise;
  }

  function apply() {
    if (!context && !directMode) return;
    var set = settings();
    var muted = set.muted ? 0 : 1;
    if (directMode) {
      var directVolume = clampVolume(set.masterVolume, 0.5) * clampVolume(set.bgmVolume, 0.3) * muted;
      channels.forEach(function (channel) { channel.audio.volume = directVolume; });
      return;
    }
    master.gain.setTargetAtTime(clampVolume(set.masterVolume, 0.5) * muted, context.currentTime, 0.02);
    bgmGain.gain.setTargetAtTime(clampVolume(set.bgmVolume, 0.3) * 10, context.currentTime, 0.02);
    sfxGain.gain.setTargetAtTime(clampVolume(set.sfxVolume, 0.65), context.currentTime, 0.02);
  }

  function directBgmVolume() {
    var set = settings();
    return set.muted ? 0 : clampVolume(set.masterVolume, 0.5) * clampVolume(set.bgmVolume, 0.3);
  }

  function directSfxVolume() {
    var set = settings();
    return set.muted ? 0 : clampVolume(set.masterVolume, 0.5) * clampVolume(set.sfxVolume, 0.65);
  }

  function fadeDirect(channel, target) {
    if (channel.fadeTimer) window.clearInterval(channel.fadeTimer);
    var start = clampVolume(channel.audio.volume, 0);
    var started = Date.now();
    if (start === target) return;

    channel.fadeTimer = window.setInterval(function () {
      var progress = Math.min(1, (Date.now() - started) / BGM_FADE_MS);
      channel.audio.volume = start + (target - start) * progress;
      if (progress >= 1) {
        window.clearInterval(channel.fadeTimer);
        channel.fadeTimer = null;
      }
    }, BGM_FADE_INTERVAL_MS);
  }

  function tryPlay(audio, onFailure, onSuccess) {
    try {
      var result = audio.play();
      if (result && typeof result.then === 'function') {
        result.then(function () { if (onSuccess) onSuccess(); }, function () { if (onFailure) onFailure(); });
      } else if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (error) {
      if (onFailure) onFailure();
      return false;
    }
  }

  function clearMediaSource(audio) {
    try { audio.removeAttribute('src'); } catch (error) {}
    try { audio.load(); } catch (error) {}
  }

  function isTrackActive(channel, track) {
    return channel && channel.audio.dataset.track === track && (!channel.audio.paused || channel.pending);
  }

  function play(track) {
    currentTrack = track;
    if (!unlocked || !ensure() || !PSG.audio.bgmTracks[track]) return;
    if (directMode) return playDirect(track);
    return playWeb(track);
  }

  function playDirect(track) {
    var active = channels[activeIndex];
    if (isTrackActive(active, track)) return;

    var nextIndex = activeIndex === 0 ? 1 : 0;
    var next = channels[nextIndex];
    if (!next || isTrackActive(next, track)) return;

    next.audio.src = PSG.audio.bgmTracks[track];
    next.audio.dataset.track = track;
    next.audio.volume = 0;
    try { next.audio.load(); } catch (error) {}
    try { next.audio.currentTime = 0; } catch (error) {}
    next.pending = true;
    tryPlay(next.audio, function () {
      next.pending = false;
      pauseChannel(next);
      clearMediaSource(next.audio);
    }, function () {
      next.pending = false;
    });
    fadeDirect(next, directBgmVolume());

    if (active) {
      fadeDirect(active, 0);
      window.setTimeout(function () {
        if (active !== channels[activeIndex]) active.audio.pause();
      }, BGM_FADE_MS + 100);
    }
    activeIndex = nextIndex;
  }

  function playWeb(track) {
    var active = channels[activeIndex];
    if (isTrackActive(active, track)) return;

    var nextIndex = activeIndex === 0 ? 1 : 0;
    var next = channels[nextIndex];
    if (!next || isTrackActive(next, track)) return;

    next.audio.src = PSG.audio.bgmTracks[track];
    next.audio.dataset.track = track;
    try { next.audio.load(); } catch (error) {}
    try { next.audio.currentTime = 0; } catch (error) {}

    var now = context.currentTime;
    var fadeSeconds = BGM_FADE_MS / 1000;
    next.gain.gain.cancelScheduledValues(now);
    next.gain.gain.setValueAtTime(0, now);
    next.gain.gain.linearRampToValueAtTime(1, now + fadeSeconds);
    if (active) {
      active.gain.gain.cancelScheduledValues(now);
      active.gain.gain.setValueAtTime(active.gain.gain.value, now);
      active.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
      window.setTimeout(function () {
        if (active !== channels[activeIndex]) active.audio.pause();
      }, BGM_FADE_MS + 100);
    }
    activeIndex = nextIndex;
    next.pending = true;
    tryPlay(next.audio, function () {
      next.pending = false;
      if (switchToDirect() && currentTrack) playDirect(currentTrack);
    }, function () {
      next.pending = false;
    });
  }

  function playDirectSfx(name) {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = PSG.audio.sfxTracks[name];
    audio.volume = directSfxVolume();
    audio.addEventListener('ended', function () { clearMediaSource(audio); }, { once: true });
    tryPlay(audio, function () { clearMediaSource(audio); });
  }

  function playWebSfx(name) {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = PSG.audio.sfxTracks[name];
    var source;
    var released = false;

    function release() {
      if (released) return;
      released = true;
      try { source.disconnect(); } catch (error) {}
      clearMediaSource(audio);
    }

    try {
      source = context.createMediaElementSource(audio);
      source.connect(sfxGain);
      audio.addEventListener('ended', release, { once: true });
      tryPlay(audio, function () {
        release();
        if (switchToDirect()) {
          if (currentTrack) playDirect(currentTrack);
          playDirectSfx(name);
        }
      });
    } catch (error) {
      release();
      if (switchToDirect()) {
        if (currentTrack) playDirect(currentTrack);
        playDirectSfx(name);
      }
    }
  }

  function sfx(name) {
    if (!PSG.audio.sfxTracks[name] || settings().muted || !ensure()) return;
    if (!unlocked) {
      if (pendingSfx.length < MAX_QUEUED_SFX) pendingSfx.push(name);
      return;
    }
    if (directMode) return playDirectSfx(name);
    playWebSfx(name);
  }

  function flushPendingSfx() {
    if (!unlocked || !pendingSfx.length) return;
    var queued = pendingSfx.slice();
    pendingSfx.length = 0;
    queued.forEach(function (name) { sfx(name); });
  }

  PSG.audio.manager = {
    unlock: unlock,
    play: play,
    sfx: sfx,
    apply: apply,
    isUnlocked: function () { return unlocked; }
  };
})(window.PSG);
