/* audio-manager.js — 常駐單例音訊管理器(Web Audio 合成)。
   切換畫面不重建,BGM 跨畫面持續;首次互動才解鎖自動播放(§11)。 */
(function (L) {
  'use strict';

  var A = L.audio;
  var ctx = null, masterGain = null, bgmGain = null, sfxGain = null;
  var unlocked = false;
  var currentBgmKey = null;
  var bgmTimer = null;
  var bgmFadeTimer = null;
  var bgmStep = 0;

  function settings() { return L.state.settings || L.config.defaults; }

  A.init = function () {
    // 互動解鎖掛勾(任一點擊/觸控)
    var unlock = function () { A.unlock(); };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  };

  A.unlock = function () {
    if (unlocked) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctx = new Ctx();
    masterGain = ctx.createGain();
    bgmGain = ctx.createGain();
    sfxGain = ctx.createGain();
    bgmGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(ctx.destination);
    unlocked = true;
    applyVolumes();
    if (currentBgmKey) startBgmLoop(currentBgmKey);
  };

  function applyVolumes() {
    if (!unlocked) return;
    var s = settings();
    masterGain.gain.value = s.muted ? 0 : 1;
    setBgmGain(s.bgmVolume);
    sfxGain.gain.value = s.sfxVolume;
  }

  A.setBgmVolume = function (v) { settings().bgmVolume = v; applyVolumes(); };
  A.setSfxVolume = function (v) { settings().sfxVolume = v; applyVolumes(); };
  A.setMuted = function (m) { settings().muted = m; applyVolumes(); };
  A.refresh = applyVolumes;

  // ---- BGM ----
  A.playBgm = function (key, opts) {
    if (currentBgmKey === key && bgmTimer) return;
    var fade = opts && opts.fade ? Math.max(0, opts.fade) : 0;
    if (!unlocked) {
      currentBgmKey = key;
      bgmStep = 0;
      return;
    }
    if (currentBgmKey && bgmTimer && fade > 0) {
      switchBgmWithFade(key, fade);
      return;
    }
    currentBgmKey = key;
    bgmStep = 0;
    if (fade > 0) {
      setBgmGain(0);
      startBgmLoop(key);
      fadeBgmGain(settings().bgmVolume, fade);
    } else {
      startBgmLoop(key);
      setBgmGain(settings().bgmVolume);
    }
  };

  A.stopBgm = function (opts) {
    var fade = opts && opts.fade ? Math.max(0, opts.fade) : 0;
    if (unlocked && fade > 0 && currentBgmKey) {
      fadeBgmGain(0, fade);
      clearFadeTimer();
      bgmFadeTimer = setTimeout(stopNow, fade);
      return;
    }
    stopNow();
  };

  function stopNow() {
    currentBgmKey = null;
    if (bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
    clearFadeTimer();
  }

  function switchBgmWithFade(key, fade) {
    var half = Math.max(1, Math.floor(fade / 2));
    fadeBgmGain(0, half);
    clearFadeTimer();
    bgmFadeTimer = setTimeout(function () {
      currentBgmKey = key;
      bgmStep = 0;
      setBgmGain(0);
      startBgmLoop(key);
      fadeBgmGain(settings().bgmVolume, fade - half);
      clearFadeTimer();
    }, half);
  }

  function clearFadeTimer() {
    if (bgmFadeTimer) { clearTimeout(bgmFadeTimer); bgmFadeTimer = null; }
  }

  function setBgmGain(value) {
    if (!unlocked) return;
    var t = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(t);
    bgmGain.gain.setValueAtTime(value, t);
  }

  function fadeBgmGain(value, ms) {
    if (!unlocked) return;
    var t = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(t);
    bgmGain.gain.setValueAtTime(bgmGain.gain.value, t);
    if (ms <= 0) bgmGain.gain.setValueAtTime(value, t);
    else bgmGain.gain.linearRampToValueAtTime(value, t + ms / 1000);
  }

  function startBgmLoop(key) {
    if (bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
    var def = A.BGM[key];
    if (!def || !unlocked) return;
    var beat = 60 / def.tempo;
    var root = 220; // A3

    function tick() {
      if (currentBgmKey !== key) return;
      var s = settings();
      if (!s.muted && s.bgmVolume > 0) {
        var semi = def.scale[bgmStep % def.scale.length];
        var freq = root * Math.pow(2, semi / 12);
        bgmNote(freq, beat * 0.9, def.wave);
        // 偶數拍加低音
        if (bgmStep % 2 === 0) bgmNote(freq / 2, beat * 0.8, 'sine', 0.5);
      }
      bgmStep++;
      bgmTimer = setTimeout(tick, beat * 1000);
    }
    tick();
  }

  function bgmNote(freq, dur, wave, mul) {
    if (!unlocked) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var amp = ctx.createGain();
    osc.type = wave || 'sine';
    osc.frequency.value = freq;
    var peak = 0.12 * (mul || 1);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.linearRampToValueAtTime(peak, t + 0.03);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp); amp.connect(bgmGain);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  // ---- SFX ----
  A.playSfx = function (key) {
    if (!unlocked) return;
    var s = settings();
    if (s.muted || s.sfxVolume <= 0) return;
    var def = A.SFX[key];
    if (!def) return;
    var t = ctx.currentTime;
    if (def.kind === 'tone') tone(def.freq, def.dur, def.wave, def.gain, t);
    else if (def.kind === 'noise') noise(def.dur, def.freq, def.gain, t);
    else if (def.kind === 'sweep') sweep(def.from, def.to, def.dur, def.gain, t);
    else if (def.kind === 'chord') {
      for (var i = 0; i < def.freqs.length; i++)
        tone(def.freqs[i], def.dur, 'sine', def.gain, t + i * 0.05);
    }
  };

  function tone(freq, dur, wave, gain, t) {
    var osc = ctx.createOscillator();
    var amp = ctx.createGain();
    osc.type = wave || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp); amp.connect(sfxGain);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function sweep(from, to, dur, gain, t) {
    var osc = ctx.createOscillator();
    var amp = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp); amp.connect(sfxGain);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function noise(dur, filterFreq, gain, t) {
    var len = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = filterFreq || 800;
    var amp = ctx.createGain(); amp.gain.value = gain;
    src.connect(filter); filter.connect(amp); amp.connect(sfxGain);
    src.start(t);
  }
})(window.Ludo);
