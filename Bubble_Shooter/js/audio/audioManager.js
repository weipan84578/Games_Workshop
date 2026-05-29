(function (BS) {
  var config = null;
  var currentTrack = null;
  var bgmEl = null;
  var bgmFadeId = 0;
  var sfxTemplates = {};
  var bgmVolume = 0.8;
  var sfxVolume = 0.9;
  var muted = false;

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

  function stopFallbackBgm() {
    if (fallbackBgm) {
      for (var i = 0; i < fallbackBgm.length; i += 1) {
        try {
          fallbackBgm[i].stop();
        } catch (error) {
          noop();
        }
      }
    }
    fallbackBgm = null;
    fallbackGain = null;
  }

  function playFallbackBgm(track) {
    var ctx = ensureAudioContext();
    if (!ctx || muted || !track) {
      return;
    }

    stopFallbackBgm();
    var maps = {
      menu: [196, 246.94],
      game: [164.81, 220],
      victory: [261.63, 329.63]
    };
    var tones = maps[track] || maps.menu;
    var gain = ctx.createGain();
    gain.gain.value = bgmVolume * 0.035;
    gain.connect(ctx.destination);

    fallbackBgm = [];
    fallbackGain = gain;

    for (var i = 0; i < tones.length; i += 1) {
      var osc = ctx.createOscillator();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.value = tones[i];
      osc.connect(gain);
      osc.start();
      fallbackBgm.push(osc);
    }
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
    var volume = muted ? 0 : bgmVolume;
    if (bgmEl) {
      bgmEl.volume = volume;
    }
    if (fallbackGain) {
      fallbackGain.gain.value = volume * 0.035;
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
      next.volume = muted ? 0 : bgmVolume * ratio;

      if (previous) {
        previous.volume = muted ? 0 : bgmVolume * (1 - ratio);
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
    } else if (currentTrack && (!bgmEl || bgmEl.paused)) {
      playFallbackBgm(currentTrack);
    }
  };

  BS.Audio.duck = function (flag) {
    var target = muted ? 0 : bgmVolume * (flag ? 0.5 : 1);
    if (bgmEl) {
      bgmEl.volume = target;
    }
    if (fallbackGain) {
      fallbackGain.gain.value = target * 0.035;
    }
  };
})(window.BubbleShooter);
