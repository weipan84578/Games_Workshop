(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var AudioContextClass = global.AudioContext || global.webkitAudioContext;
  var context = null;
  var musicGain = null;
  var sfxGain = null;
  var musicLimiter = null;
  var sfxLimiter = null;
  var scene = "menu";
  var sceneTimer = null;
  var trackToken = 0;
  var musicSources = [];
  var muted = false;
  var bgmVolume = 0.9;
  var sfxVolume = 1;
  var unlocked = false;
  var patterns = {
    menu_piano_1: [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
    menu_piano_2: [392, 493.88, 587.33, 493.88, 349.23, 440, 523.25, 440],
    battle_piano_1: [261.63, 293.66, 329.63, 392, 329.63, 293.66, 261.63, 196],
    battle_piano_2: [329.63, 392, 440, 523.25, 440, 392, 329.63, 293.66],
    battle_piano_3: [220, 261.63, 329.63, 392, 440, 392, 329.63, 261.63],
    victory_piano: [392, 440, 493.88, 523.25, 659.25, 783.99, 1046.5],
    defeat_piano: [392, 349.23, 329.63, 293.66, 261.63, 220]
  };

  function ensureContext() {
    if (context || !AudioContextClass) {
      return Boolean(context);
    }
    try {
      context = new AudioContextClass();
      musicGain = context.createGain();
      sfxGain = context.createGain();
      musicLimiter = context.createDynamicsCompressor();
      sfxLimiter = context.createDynamicsCompressor();
      [musicLimiter, sfxLimiter].forEach(function (limiter) {
        limiter.threshold.value = -7;
        limiter.knee.value = 0;
        limiter.ratio.value = 20;
        limiter.attack.value = 0.003;
        limiter.release.value = 0.25;
      });
      musicGain.connect(musicLimiter);
      musicLimiter.connect(context.destination);
      sfxGain.connect(sfxLimiter);
      sfxLimiter.connect(context.destination);
      applyGain();
      return true;
    } catch (error) {
      context = null;
      return false;
    }
  }

  function applyGain() {
    if (!context) {
      return;
    }
    var now = context.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    sfxGain.gain.cancelScheduledValues(now);
    musicGain.gain.setTargetAtTime(muted ? 0 : bgmVolume, now, 0.04);
    sfxGain.gain.setTargetAtTime(muted ? 0 : sfxVolume, now, 0.02);
  }

  function removeMusicSource(source) {
    musicSources = musicSources.filter(function (item) { return item !== source; });
  }

  function playTone(frequency, duration, destination, start, type, volume, isMusic) {
    if (!context || muted) {
      return;
    }
    var oscillator = context.createOscillator();
    var envelope = context.createGain();
    oscillator.type = type || "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(.0002, volume || .05), start + .018);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(destination);
    if (isMusic) {
      var source = { oscillator: oscillator, envelope: envelope };
      musicSources.push(source);
      oscillator.onended = function () {
        removeMusicSource(source);
      };
    }
    oscillator.start(start);
    oscillator.stop(start + duration + .03);
  }

  function scheduleTrack() {
    if (!context || !unlocked || muted) {
      return;
    }
    var definition = global.AUDIO_CONFIG.scenes[scene] || global.AUDIO_CONFIG.scenes.menu;
    var trackId = app.utils.randomItem(definition.tracks);
    var notes = patterns[trackId] || patterns.menu_piano_1;
    var beat = 60 / definition.tempo;
    var start = context.currentTime + .06;
    notes.forEach(function (frequency, index) {
      var noteStart = start + index * beat;
      playTone(frequency, beat * .82, musicGain, noteStart, "triangle", .065, true);
      if (index % 2 === 0) {
        playTone(frequency / 2, beat * .7, musicGain, noteStart, "sine", .018, true);
      }
    });
    var duration = notes.length * beat;
    var token = trackToken;
    sceneTimer = global.setTimeout(function () {
      if (token === trackToken) {
        scheduleTrack();
      }
    }, Math.max(500, (duration - .06) * 1000));
  }

  function stopTrack() {
    trackToken += 1;
    if (sceneTimer) {
      global.clearTimeout(sceneTimer);
      sceneTimer = null;
    }
    if (context) {
      var now = context.currentTime;
      musicSources.slice().forEach(function (source) {
        try {
          source.envelope.gain.cancelScheduledValues(now);
          source.envelope.gain.setTargetAtTime(.0001, now, .025);
          source.oscillator.stop(now + .1);
        } catch (error) {
          /* A note may already have completed naturally. */
        }
      });
      musicSources = [];
    }
  }

  function unlock() {
    if (!ensureContext()) {
      return false;
    }
    unlocked = true;
    if (context.state === "suspended") {
      context.resume();
    }
    stopTrack();
    scheduleTrack();
    return true;
  }

  function setScene(nextScene) {
    scene = nextScene || "menu";
    if (unlocked) {
      stopTrack();
      scheduleTrack();
    }
  }

  function setBgmVolume(value) {
    bgmVolume = app.utils.clamp(Number(value) > 1.5 ? Number(value) / 100 : Number(value), 0, 1.5);
    applyGain();
  }

  function setSfxVolume(value) {
    sfxVolume = app.utils.clamp(Number(value) > 1.5 ? Number(value) / 100 : Number(value), 0, 1.5);
    applyGain();
  }

  function setMuted(value) {
    muted = Boolean(value);
    applyGain();
    if (!muted && unlocked) {
      stopTrack();
      scheduleTrack();
    }
  }

  function playSfx(name) {
    if (!unlocked || !ensureContext() || muted || !global.AUDIO_CONFIG.sfx[name]) {
      return;
    }
    var now = context.currentTime + .01;
    var recipes = {
      click: [[880, .08, "sine", .07]],
      summon: [[320, .08, "triangle", .08], [640, .16, "sine", .045]],
      hit: [[180, .055, "square", .035], [420, .045, "triangle", .025]],
      victory: [[523.25, .13, "triangle", .08], [659.25, .13, "triangle", .08], [783.99, .25, "sine", .075]],
      defeat: [[392, .15, "sine", .055], [293.66, .28, "triangle", .05]],
      star: [[880, .08, "sine", .06], [1174.66, .18, "sine", .06]],
      upgrade: [[523.25, .08, "triangle", .06], [783.99, .16, "sine", .06]],
      boss: [[146.83, .16, "sawtooth", .065], [220, .2, "triangle", .07], [293.66, .24, "sine", .06]]
    };
    (recipes[name] || recipes.click).forEach(function (recipe, index) {
      playTone(recipe[0], recipe[1], sfxGain, now + index * .08, recipe[2], recipe[3]);
    });
  }

  function init() {
    var settings = app.SaveManager.getSettings();
    bgmVolume = Number(settings.bgmVolume) / 100;
    sfxVolume = Number(settings.sfxVolume) / 100;
    muted = Boolean(settings.muted);
  }

  app.AudioManager = {
    init: init, unlock: unlock, setScene: setScene, playSfx: playSfx,
    setBgmVolume: setBgmVolume, setSfxVolume: setSfxVolume, setMuted: setMuted,
    getState: function () { return { scene: scene, bgmVolume: bgmVolume, sfxVolume: sfxVolume, muted: muted, available: Boolean(AudioContextClass) }; }
  };
})(window);
