(function () {
  "use strict";

  var AudioContextCtor = window.AudioContext || window.webkitAudioContext;

  var engine = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    musicScale: 1,
    settings: null
  };

  function ensure() {
    if (!AudioContextCtor) return null;
    if (engine.ctx) return engine.ctx;
    try {
      engine.ctx = new AudioContextCtor();
      engine.masterGain = engine.ctx.createGain();
      engine.musicGain = engine.ctx.createGain();
      engine.sfxGain = engine.ctx.createGain();
      engine.musicGain.connect(engine.masterGain);
      engine.sfxGain.connect(engine.masterGain);
      engine.masterGain.connect(engine.ctx.destination);
      Game.Audio.applySettings(engine.settings || Game.Storage.loadSettings());
    } catch (error) {
      engine.ctx = null;
    }
    return engine.ctx;
  }

  function setGain(gain, value, seconds) {
    if (!gain || !engine.ctx) return;
    var now = engine.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + (seconds || 0.01));
  }

  function destination(kind) {
    return kind === "music" ? engine.musicGain : engine.sfxGain;
  }

  Game.Audio = {
    ensure: ensure,

    resume: function () {
      var ctx = ensure();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
    },

    applySettings: function (settings) {
      engine.settings = Object.assign({}, Game.Storage.defaults, settings || {});
      var ctx = ensure();
      if (!ctx) return;
      var muted = engine.settings.muted;
      setGain(engine.masterGain, muted ? 0 : 1, 0.05);
      setGain(engine.musicGain, engine.settings.musicVolume / 100 * engine.musicScale, 0.08);
      setGain(engine.sfxGain, engine.settings.sfxVolume / 100, 0.08);
    },

    setMusicScale: function (scale, seconds) {
      var ctx = ensure();
      if (!ctx) return;
      engine.musicScale = Game.Utils.clamp(scale, 0, 1);
      var volume = ((engine.settings && engine.settings.musicVolume) || 60) / 100;
      setGain(engine.musicGain, volume * engine.musicScale, seconds || 0.1);
    },

    playTone: function (options) {
      var ctx = ensure();
      if (!ctx) return;
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var duration = options.duration || 0.12;
      var attack = options.attack || 0.004;
      var end = now + duration;
      var level = options.gain || 0.12;
      osc.type = options.type || "sine";
      osc.frequency.setValueAtTime(options.freq || 440, now);
      if (options.toFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.toFreq), end);
      }
      if (options.detune) {
        osc.detune.setValueAtTime(options.detune, now);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain);
      gain.connect(destination(options.music ? "music" : "sfx"));
      osc.start(now);
      osc.stop(end + 0.02);
    },

    playNoise: function (options) {
      var ctx = ensure();
      if (!ctx) return;
      var duration = options.duration || 0.25;
      var sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
      var buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < sampleCount; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }

      var source = ctx.createBufferSource();
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      var now = ctx.currentTime;
      source.buffer = buffer;
      filter.type = options.filterType || "lowpass";
      filter.frequency.setValueAtTime(options.filter || 900, now);
      gain.gain.setValueAtTime(options.gain || 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(destination(options.music ? "music" : "sfx"));
      source.start(now);
      source.stop(now + duration + 0.02);
    },

    playChord: function (freqs, options) {
      options = options || {};
      freqs.forEach(function (freq, index) {
        Game.Audio.playTone(Object.assign({}, options, {
          freq: freq,
          gain: (options.gain || 0.08) / Math.max(1, freqs.length) * (index === 0 ? 1.2 : 1)
        }));
      });
    }
  };

  document.addEventListener("visibilitychange", function () {
    if (!engine.ctx) return;
    if (document.hidden) {
      engine.ctx.suspend();
    } else if (engine.settings && !engine.settings.muted) {
      engine.ctx.resume();
    }
  });
}());
