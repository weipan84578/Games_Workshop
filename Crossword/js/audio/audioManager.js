(function () {
  const toneMap = {
    click: [320, 0.035],
    cell_select: [420, 0.025],
    direction_toggle: [520, 0.045],
    type_correct: [680, 0.04],
    type_wrong: [170, 0.07],
    word_complete: [760, 0.09],
    puzzle_clear: [880, 0.16],
    hint_use: [590, 0.08],
    menu_open: [460, 0.05],
    menu_close: [270, 0.05],
    countdown: [710, 0.06],
  };

  const sfxCooldown = {
    click: 70,
    cell_select: 55,
    direction_toggle: 90,
    type_correct: 22,
    type_wrong: 55,
    word_complete: 160,
    puzzle_clear: 300,
    hint_use: 140,
    menu_open: 120,
    menu_close: 120,
    countdown: 80,
  };

  const tracks = {
    main_theme: {
      bpm: 96,
      gain: 0.11,
      melodyWave: "triangle",
      bassWave: "sine",
      bass: [196, 196, 220, 247, 262, 247, 220, 196],
      melody: [392, 494, 523, 587, 523, 494, 440, 392, 330, 392, 440, 494, 440, 392, 330, 294],
    },
    gameplay: {
      bpm: 108,
      gain: 0.095,
      melodyWave: "sine",
      bassWave: "sine",
      bass: [147, 147, 165, 196, 185, 185, 165, 147],
      melody: [392, 440, 494, 440, 392, 330, 392, 440, 523, 494, 440, 392, 330, 294, 330, 392],
    },
    relaxed: {
      bpm: 76,
      gain: 0.085,
      melodyWave: "sine",
      bassWave: "sine",
      bass: [131, 165, 196, 165, 147, 185, 220, 185],
      melody: [330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 494, 440, 392, 330, 294, 262],
    },
    victory: {
      bpm: 122,
      gain: 0.12,
      melodyWave: "triangle",
      bassWave: "sine",
      bass: [262, 330, 392, 523, 392, 523, 659, 784],
      melody: [523, 659, 784, 1047, 784, 659, 784, 1047, 1175, 1047, 784, 659, 523, 659, 784, 1047],
    },
  };

  const manager = {
    context: null,
    masterGain: null,
    currentTrack: null,
    currentTrackName: null,
    bgmVolume: 0.7,
    sfxVolume: 0.8,
    muted: false,
    unlocked: false,
    lastSfxAt: new Map(),
    activeSfx: 0,

    init() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        return;
      }
      if (!this.context) {
        this.context = new AudioContext();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = this.muted ? 0 : this.bgmVolume;
        this.masterGain.connect(this.context.destination);
      }
      if (this.context.state === "suspended") {
        this.context.resume().catch(() => {});
      }
      this.unlocked = true;
    },

    playBGM(trackName) {
      this.crossfadeBGM(trackName, 450);
    },

    stopBGM(options = {}) {
      if (!this.currentTrack) {
        return;
      }
      const fadeMs = options.fadeOut === false ? 0 : 350;
      stopTrack(this.currentTrack, fadeMs);
      this.currentTrack = null;
      this.currentTrackName = null;
    },

    crossfadeBGM(newTrackName, duration = 700) {
      if (this.currentTrackName === newTrackName) {
        return;
      }
      this.init();
      if (!this.context || !tracks[newTrackName]) {
        this.currentTrackName = newTrackName;
        return;
      }

      const previous = this.currentTrack;
      const next = createTrack(this.context, tracks[newTrackName]);
      next.output.connect(this.masterGain);
      startTrack(this.context, next);
      fadeParam(this.context, next.output.gain, tracks[newTrackName].gain, duration);

      if (previous) {
        stopTrack(previous, duration);
      }

      this.currentTrack = next;
      this.currentTrackName = newTrackName;
    },

    playSFX(name) {
      this.init();
      if (!this.context || this.muted || this.sfxVolume <= 0 || this.activeSfx >= 8) {
        return;
      }

      const nowMs = performance.now();
      const last = this.lastSfxAt.get(name) || 0;
      if (nowMs - last < (sfxCooldown[name] || 45)) {
        return;
      }
      this.lastSfxAt.set(name, nowMs);

      const [frequency, duration] = toneMap[name] || toneMap.click;
      this.activeSfx += 1;
      playSfxTone(this.context, frequency, duration, this.sfxVolume, name === "type_wrong" ? "square" : "sine", () => {
        this.activeSfx = Math.max(0, this.activeSfx - 1);
      });
    },

    setBGMVolume(value) {
      this.bgmVolume = Helpers.clamp(value, 0, 1);
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.bgmVolume, this.context.currentTime, 0.04);
      }
    },

    setSFXVolume(value) {
      this.sfxVolume = Helpers.clamp(value, 0, 1);
    },

    mute() {
      this.muted = true;
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.context.currentTime, 0.04);
      }
    },

    unmute() {
      this.muted = false;
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(this.bgmVolume, this.context.currentTime, 0.04);
      }
    },
  };

  function createTrack(context, config) {
    const output = context.createGain();
    const melodyOsc = context.createOscillator();
    const bassOsc = context.createOscillator();
    const melodyGain = context.createGain();
    const bassGain = context.createGain();

    output.gain.value = 0.0001;
    melodyOsc.type = config.melodyWave;
    bassOsc.type = config.bassWave;
    melodyGain.gain.value = 0.0001;
    bassGain.gain.value = 0.0001;
    melodyOsc.connect(melodyGain).connect(output);
    bassOsc.connect(bassGain).connect(output);

    return {
      config,
      output,
      melodyOsc,
      bassOsc,
      melodyGain,
      bassGain,
      step: 0,
      timerId: null,
      stopped: false,
    };
  }

  function startTrack(context, track) {
    const now = context.currentTime;
    track.melodyOsc.frequency.value = track.config.melody[0];
    track.bassOsc.frequency.value = track.config.bass[0];
    track.melodyOsc.start(now);
    track.bassOsc.start(now);
    advanceTrack(context, track);
  }

  function advanceTrack(context, track) {
    if (track.stopped) {
      return;
    }

    const config = track.config;
    const beatMs = 60000 / config.bpm;
    const stepMs = beatMs / 2;
    const now = context.currentTime;
    const melodyFrequency = config.melody[track.step % config.melody.length];
    const bassFrequency = config.bass[track.step % config.bass.length];
    const noteEnd = now + (stepMs / 1000) * 0.74;

    track.melodyOsc.frequency.setTargetAtTime(melodyFrequency, now, 0.012);
    pulseGain(context, track.melodyGain.gain, 0.52, now, noteEnd);

    if (track.step % 2 === 0) {
      track.bassOsc.frequency.setTargetAtTime(bassFrequency, now, 0.018);
      pulseGain(context, track.bassGain.gain, 0.24, now, now + (beatMs / 1000) * 0.72);
    }

    track.step += 1;
    track.timerId = window.setTimeout(() => advanceTrack(context, track), stepMs);
  }

  function pulseGain(context, param, peak, start, end) {
    param.cancelScheduledValues(start);
    param.setValueAtTime(0.0001, start);
    param.linearRampToValueAtTime(peak, start + 0.018);
    param.exponentialRampToValueAtTime(0.0001, Math.max(start + 0.04, end));
  }

  function stopTrack(track, fadeMs) {
    if (!track || track.stopped) {
      return;
    }
    track.stopped = true;
    if (track.timerId) {
      window.clearTimeout(track.timerId);
    }

    const context = track.output.context;
    const now = context.currentTime;
    const stopAt = now + Math.max(0.05, fadeMs / 1000 + 0.04);
    if (fadeMs > 0) {
      fadeParam(context, track.output.gain, 0.0001, fadeMs);
    } else {
      track.output.gain.setValueAtTime(0.0001, now);
    }
    try {
      track.melodyOsc.stop(stopAt);
      track.bassOsc.stop(stopAt);
    } catch (error) {
      // Oscillators may already be stopped during very rapid track changes.
    }
    window.setTimeout(() => disconnectTrack(track), Math.max(80, fadeMs + 90));
  }

  function disconnectTrack(track) {
    try {
      track.melodyOsc.disconnect();
      track.bassOsc.disconnect();
      track.melodyGain.disconnect();
      track.bassGain.disconnect();
      track.output.disconnect();
    } catch (error) {
      // Ignore disconnect races.
    }
  }

  function fadeParam(context, param, target, durationMs) {
    const now = context.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(Math.max(0.0001, param.value), now);
    param.linearRampToValueAtTime(Math.max(0.0001, target), now + durationMs / 1000);
  }

  function playSfxTone(context, frequency, duration, volume, wave, onDone) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    const stopAt = now + duration + 0.04;

    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.11), now + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(stopAt);

    window.setTimeout(() => {
      try {
        oscillator.disconnect();
        envelope.disconnect();
      } catch (error) {
        // Ignore disconnect races.
      }
      if (onDone) {
        onDone();
      }
    }, duration * 1000 + 80);
  }

  window.AudioManager = manager;
})();
