(function (BS) {
  var config = null;
  var currentTrack = null;
  var bgmEl = null;
  var bgmFadeId = 0;
  var sfxTemplates = {};
  var bgmVolume = 0.8;
  var sfxVolume = 0.9;
  var muted = false;
  var bgmMaster = 0.55;

  var audioContext = null;
  var fallbackBgm = null;
  var fallbackGain = null;

  function noop() {}

  function ensureAudioContext() {
    var Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      return null;
    }
    if (!audioContext) {
      audioContext = new Context();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(noop);
    }
    return audioContext;
  }

  function getEffectiveBgmVolume(multiplier) {
    if (muted) {
      return 0;
    }
    return bgmVolume * bgmMaster * (multiplier === undefined ? 1 : multiplier);
  }

  function stopFallbackBgm() {
    if (fallbackBgm) {
      if (fallbackBgm.timeoutId) {
        window.clearTimeout(fallbackBgm.timeoutId);
      }
      fallbackBgm.stopped = true;

      for (var i = 0; i < fallbackBgm.nodes.length; i += 1) {
        try {
          fallbackBgm.nodes[i].stop();
        } catch (error) {
          noop();
        }
      }
    }
    fallbackBgm = null;
    fallbackGain = null;
  }

  function playSoftTone(ctx, frequency, start, duration, gainScale) {
    if (!fallbackBgm || !fallbackGain) {
      return;
    }

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var peak = 0.026 * gainScale;

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.22);
    gain.gain.linearRampToValueAtTime(peak * 0.72, start + duration * 0.45);
    gain.gain.linearRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(fallbackGain);
    osc.start(start);
    osc.stop(start + duration + 0.08);
    fallbackBgm.nodes.push(osc);
  }

  function playFallbackBgm(track) {
    var ctx = ensureAudioContext();
    if (!ctx || muted || !track) {
      return;
    }

    stopFallbackBgm();
    var sequences = {
      menu: [
        [261.63, 329.63, 392.00],
        [293.66, 349.23, 440.00],
        [246.94, 329.63, 392.00],
        [220.00, 293.66, 369.99]
      ],
      game: [
        [220.00, 277.18, 329.63],
        [246.94, 293.66, 369.99],
        [196.00, 261.63, 329.63],
        [174.61, 246.94, 293.66]
      ],
      victory: [
        [261.63, 329.63, 392.00],
        [329.63, 392.00, 493.88],
        [293.66, 369.99, 440.00],
        [349.23, 440.00, 523.25]
      ]
    };
    var sequence = sequences[track] || sequences.menu;
    var gain = ctx.createGain();
    gain.gain.value = getEffectiveBgmVolume();
    gain.connect(ctx.destination);

    fallbackBgm = {
      nodes: [],
      step: 0,
      timeoutId: 0,
      stopped: false
    };
    fallbackGain = gain;

    function scheduleNext() {
      if (!fallbackBgm || fallbackBgm.stopped) {
        return;
      }

      if (ctx.state !== "running") {
        fallbackBgm.timeoutId = window.setTimeout(scheduleNext, 500);
        return;
      }

      var chord = sequence[fallbackBgm.step % sequence.length];
      var start = ctx.currentTime + 0.04;
      var duration = track === "victory" ? 1.35 : 1.65;
      var wait = track === "victory" ? 1300 : 1750;

      for (var i = 0; i < chord.length; i += 1) {
        playSoftTone(ctx, chord[i], start + i * 0.035, duration, 1 / chord.length);
      }

      fallbackBgm.step += 1;
      fallbackBgm.timeoutId = window.setTimeout(scheduleNext, wait);
    }

    scheduleNext();
  }

  function playFallbackSfx(name) {
    var ctx = ensureAudioContext();
    if (!ctx || muted || sfxVolume <= 0) {
      return;
    }

    var patterns = {
      click: [520, 0.06],
      shoot: [420, 0.08],
      bounce: [260, 0.06],
      attach: [330, 0.08],
      pop: [720, 0.09],
      drop: [180, 0.12],
      combo: [880, 0.12],
      win: [1040, 0.18],
      lose: [120, 0.22]
    };
    var pattern = patterns[name] || [440, 0.08];
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var now = ctx.currentTime;

    osc.type = name === "lose" ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(pattern[0], now);
    if (name === "combo" || name === "win") {
      osc.frequency.exponentialRampToValueAtTime(pattern[0] * 1.55, now + pattern[1]);
    } else if (name === "drop" || name === "lose") {
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, pattern[0] * 0.55), now + pattern[1]);
    }
    gain.gain.setValueAtTime(sfxVolume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + pattern[1]);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + pattern[1] + 0.02);
  }

  function applyBgmVolume() {
    if (bgmEl) {
      bgmEl.volume = getEffectiveBgmVolume();
    }
    if (fallbackGain) {
      fallbackGain.gain.value = getEffectiveBgmVolume();
    }
  }

  function makeAudio(src, loop) {
    var audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = !!loop;
    return audio;
  }

  BS.Audio.init = function () {
    config = BS.Core.Config.audio;
    var settings = BS.Storage.getSettings();
    bgmVolume = settings.bgmVolume;
    sfxVolume = settings.sfxVolume;
    muted = settings.muted;

    Object.keys(config.sfx).forEach(function (name) {
      sfxTemplates[name] = makeAudio(config.sfx[name], false);
    });

    var unlock = function () {
      ensureAudioContext();
      if (currentTrack && (!bgmEl || bgmEl.paused || bgmEl.error)) {
        playFallbackBgm(currentTrack);
      }
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  };

  BS.Audio.playBGM = function (track) {
    if (!config) {
      return;
    }
    if (currentTrack === track) {
      applyBgmVolume();
      return;
    }

    currentTrack = track;
    if (bgmFadeId) {
      window.clearInterval(bgmFadeId);
      bgmFadeId = 0;
    }
    stopFallbackBgm();

    var previous = bgmEl;
    if (!track) {
      if (previous) {
        previous.pause();
      }
      bgmEl = null;
      return;
    }

    var next = makeAudio(config.bgm[track], true);
    next.volume = 0;
    bgmEl = next;
    next.addEventListener("error", function () {
      if (currentTrack === track) {
        playFallbackBgm(track);
      }
    }, { once: true });

    var playPromise = next.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        playFallbackBgm(track);
      });
    }

    var step = 0;
    bgmFadeId = window.setInterval(function () {
      step += 1;
      var ratio = Math.min(1, step / 18);
      next.volume = getEffectiveBgmVolume(ratio);

      if (previous) {
        previous.volume = getEffectiveBgmVolume(1 - ratio);
      }

      if (ratio >= 1) {
        window.clearInterval(bgmFadeId);
        bgmFadeId = 0;
        if (previous) {
          previous.pause();
        }
      }
    }, 50);
  };

  BS.Audio.playSFX = function (name) {
    if (muted || sfxVolume <= 0) {
      return;
    }

    var template = sfxTemplates[name];
    if (!template) {
      playFallbackSfx(name);
      return;
    }

    var clone = template.cloneNode(true);
    clone.volume = sfxVolume;
    var playPromise = clone.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        playFallbackSfx(name);
      });
    }
  };

  BS.Audio.setBgmVolume = function (value) {
    bgmVolume = BS.Utils.clamp(value, 0, 1);
    applyBgmVolume();
  };

  BS.Audio.setSfxVolume = function (value) {
    sfxVolume = BS.Utils.clamp(value, 0, 1);
  };

  BS.Audio.mute = function (flag) {
    muted = !!flag;
    applyBgmVolume();
    if (muted) {
      stopFallbackBgm();
    } else if (currentTrack && (!bgmEl || bgmEl.paused || bgmEl.error)) {
      playFallbackBgm(currentTrack);
    }
  };

  BS.Audio.duck = function (flag) {
    var target = getEffectiveBgmVolume(flag ? 0.5 : 1);
    if (bgmEl) {
      bgmEl.volume = target;
    }
    if (fallbackGain) {
      fallbackGain.gain.value = target;
    }
  };
})(window.BubbleShooter);
