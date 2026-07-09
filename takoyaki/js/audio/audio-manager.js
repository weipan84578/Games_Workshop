(function registerAudioManager(app) {
  "use strict";

  const BGM_GAIN_MULTIPLIER = 10;
  const noteOffsets = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
  let audioCtx = null;
  let bgmGain = null;
  let sfxGain = null;
  let unlocked = false;
  let activeMode = "menu";
  let activeTimer = null;
  let activeOscillators = [];

  function clampVolume(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      audioCtx = new AudioContextClass();
      bgmGain = audioCtx.createGain();
      sfxGain = audioCtx.createGain();
      bgmGain.connect(audioCtx.destination);
      sfxGain.connect(audioCtx.destination);
      applyVolumes(app.State.get().settings);
    }
    return audioCtx;
  }

  function noteToFrequency(note) {
    const match = /^([A-G]#?)(\d)$/.exec(note);
    if (!match) {
      return 440;
    }
    const [, pitch, octave] = match;
    const midi = (Number(octave) + 1) * 12 + noteOffsets[pitch];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function stopScheduled() {
    window.clearTimeout(activeTimer);
    activeTimer = null;
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (error) {
        return false;
      }
      return true;
    });
    activeOscillators = [];
  }

  function createBellNote(frequency, startTime, duration, destination, baseGain) {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }
    const osc = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    shimmer.type = "sine";
    osc.frequency.setValueAtTime(frequency, startTime);
    shimmer.frequency.setValueAtTime(frequency * 2.01, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(baseGain, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    shimmer.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    shimmer.start(startTime);
    osc.stop(startTime + duration + 0.04);
    shimmer.stop(startTime + duration + 0.04);
    activeOscillators.push(osc, shimmer);
  }

  function scheduleTrack(mode) {
    const ctx = getAudioContext();
    if (!ctx || !unlocked) {
      return;
    }
    stopScheduled();
    const track = app.Playlist.getNext(mode);
    const beat = 60 / track.bpm;
    const start = ctx.currentTime + 0.04;
    track.notes.forEach((note, index) => {
      createBellNote(noteToFrequency(note), start + index * beat, beat * 0.78, bgmGain, 0.026);
      if (index % 2 === 0) {
        createBellNote(noteToFrequency(note) / 2, start + index * beat, beat * 0.9, bgmGain, 0.012);
      }
    });
    const durationMs = Math.ceil((track.notes.length * beat + 0.2) * 1000);
    activeTimer = window.setTimeout(() => {
      const nextMode = mode === "celebration" ? "game" : activeMode;
      scheduleTrack(nextMode);
    }, durationMs);
  }

  function applyVolumes(settings) {
    if (!bgmGain || !sfxGain || !audioCtx) {
      return;
    }
    const at = audioCtx.currentTime;
    bgmGain.gain.cancelScheduledValues(at);
    sfxGain.gain.cancelScheduledValues(at);
    bgmGain.gain.setTargetAtTime(clampVolume(settings.bgmVolume) * BGM_GAIN_MULTIPLIER, at, 0.035);
    sfxGain.gain.setTargetAtTime(clampVolume(settings.sfxVolume), at, 0.025);
  }

  function playTone(frequency, duration, gainAmount, type = "sine") {
    const ctx = getAudioContext();
    if (!ctx || !unlocked) {
      return;
    }
    const start = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainAmount, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(sfxGain);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  const sfxMap = {
    button: () => playTone(740, 0.12, 0.18, "sine"),
    pour: () => {
      playTone(420, 0.18, 0.16, "triangle");
      playTone(620, 0.12, 0.08, "sine");
    },
    sizzle: () => playTone(210, 0.18, 0.08, "sawtooth"),
    flip: () => {
      playTone(880, 0.12, 0.2, "triangle");
      playTone(1320, 0.08, 0.12, "sine");
    },
    plate: () => playTone(540, 0.16, 0.16, "triangle"),
    sauce: () => playTone(660, 0.22, 0.13, "sine"),
    success: () => {
      playTone(784, 0.13, 0.18, "triangle");
      window.setTimeout(() => playTone(1046, 0.16, 0.18, "triangle"), 90);
    },
    fail: () => playTone(250, 0.2, 0.16, "square"),
    star: () => {
      playTone(988, 0.1, 0.16, "sine");
      window.setTimeout(() => playTone(1318, 0.12, 0.12, "sine"), 70);
    }
  };

  app.AudioManager = {
    BGM_GAIN_MULTIPLIER,

    async unlock() {
      const ctx = getAudioContext();
      if (!ctx) {
        return false;
      }
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      unlocked = true;
      applyVolumes(app.State.get().settings);
      scheduleTrack(activeMode);
      return true;
    },

    playBgm(mode) {
      activeMode = mode;
      if (unlocked) {
        scheduleTrack(mode);
      }
    },

    playCelebration() {
      if (unlocked) {
        scheduleTrack("celebration");
      }
    },

    stopBgm() {
      stopScheduled();
    },

    setVolumes(settings) {
      getAudioContext();
      applyVolumes(settings);
    },

    playSfx(name) {
      const sound = sfxMap[name] || sfxMap.button;
      sound();
    },

    preload() {
      getAudioContext();
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
