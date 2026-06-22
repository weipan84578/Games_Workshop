(function () {
  const AudioManager = {
    audioCtx: null,
    bgmGain: null,
    sfxGain: null,
    currentBGM: [],
    bgmTimers: [],
    bgmLooping: false,

    init() {
      if (this.audioCtx) return this.audioCtx;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.audioCtx = new AudioContextClass();
      this.bgmGain = this.audioCtx.createGain();
      this.sfxGain = this.audioCtx.createGain();
      this.bgmGain.connect(this.audioCtx.destination);
      this.sfxGain.connect(this.audioCtx.destination);
      this.setVolumes(UnoStorage.getSettings());
      return this.audioCtx;
    },

    resume() {
      const ctx = this.init();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
    },

    setVolumes(settings) {
      const next = settings || UnoStorage.getSettings();
      if (this.bgmGain) this.bgmGain.gain.value = Helpers.clamp(next.bgmVolume, 0, 1) * 0.22;
      if (this.sfxGain) this.sfxGain.gain.value = Helpers.clamp(next.sfxVolume, 0, 1) * 0.35;
    },

    playTone(freq, duration, type, gain) {
      const ctx = this.init();
      if (!ctx || !this.sfxGain) return;
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      toneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      toneGain.gain.exponentialRampToValueAtTime(gain || 0.18, ctx.currentTime + 0.018);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(toneGain);
      toneGain.connect(this.sfxGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.02);
    },

    playSfx(name) {
      const patterns = {
        button: [[420, 0.08, "triangle", 0.12]],
        click: [[960, 0.04, "square", 0.2], [1440, 0.055, "triangle", 0.14]],
        hover: [[320, 0.05, "sine", 0.06]],
        card_deal: [[260, 0.06, "square", 0.08], [390, 0.08, "triangle", 0.08]],
        card_play: [[520, 0.08, "triangle", 0.14], [720, 0.11, "sine", 0.1]],
        card_draw: [[180, 0.12, "sawtooth", 0.1]],
        uno_call: [[660, 0.1, "triangle", 0.18], [880, 0.14, "triangle", 0.14]],
        wild_select: [[420, 0.08, "sine", 0.12], [620, 0.08, "sine", 0.12], [820, 0.1, "sine", 0.12]],
        skip_turn: [[160, 0.12, "square", 0.1]],
        reverse: [[360, 0.07, "triangle", 0.12], [260, 0.09, "triangle", 0.12]],
        draw_two: [[210, 0.08, "sawtooth", 0.12], [210, 0.08, "sawtooth", 0.12]],
        draw_four: [[190, 0.08, "sawtooth", 0.12], [230, 0.08, "sawtooth", 0.12], [270, 0.08, "sawtooth", 0.12]],
        win: [[523, 0.1, "triangle", 0.12], [659, 0.12, "triangle", 0.14], [784, 0.18, "triangle", 0.16]],
        lose: [[280, 0.14, "sine", 0.12], [190, 0.2, "sine", 0.12]],
        error: [[110, 0.12, "square", 0.12]],
        ai_think: [[300, 0.06, "sine", 0.05]],
      };
      const sequence = patterns[name] || patterns.button;
      sequence.forEach((tone, index) => {
        window.setTimeout(() => this.playTone(tone[0], tone[1], tone[2], tone[3]), index * 75);
      });
    },

    startBGM() {
      const ctx = this.init();
      if (!ctx || this.bgmLooping) return;
      this.bgmLooping = true;
      this.schedulePianoLoop();
    },

    schedulePianoLoop() {
      if (!this.bgmLooping || !this.audioCtx) return;
      const ctx = this.audioCtx;
      const bpm = 132;
      const beat = 60 / bpm;
      const start = ctx.currentTime + 0.08;
      const melody = [
        523.25, 659.25, 783.99, 659.25,
        587.33, 698.46, 880, 698.46,
        493.88, 622.25, 783.99, 622.25,
        523.25, 659.25, 783.99, 1046.5,
      ];
      const chords = [
        [261.63, 329.63, 392],
        [293.66, 349.23, 440],
        [246.94, 311.13, 392],
        [261.63, 329.63, 392],
      ];

      melody.forEach((freq, index) => {
        this.playPianoNote(freq, start + index * beat * 0.5, beat * 0.42, 0.12);
      });
      chords.forEach((chord, index) => {
        chord.forEach((freq) => {
          this.playPianoNote(freq, start + index * beat * 2, beat * 1.45, 0.055);
        });
      });

      const timer = window.setTimeout(() => this.schedulePianoLoop(), Math.ceil(beat * 8 * 1000));
      this.bgmTimers.push(timer);
    },

    playPianoNote(freq, startTime, duration, gain) {
      const ctx = this.audioCtx;
      if (!ctx || !this.bgmGain) return;
      const filter = ctx.createBiquadFilter();
      const noteGain = ctx.createGain();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3600, startTime);
      filter.frequency.exponentialRampToValueAtTime(900, startTime + duration);
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(gain, startTime + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      filter.connect(noteGain);
      noteGain.connect(this.bgmGain);

      [1, 2.01].forEach((ratio, index) => {
        const osc = ctx.createOscillator();
        osc.type = index === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq * ratio, startTime);
        osc.detune.setValueAtTime(index === 0 ? 0 : -6, startTime);
        osc.connect(filter);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.04);
        this.currentBGM.push(osc);
        osc.onended = () => {
          const indexInBgm = this.currentBGM.indexOf(osc);
          if (indexInBgm >= 0) this.currentBGM.splice(indexInBgm, 1);
        };
      });
    },

    stopBGM() {
      this.bgmLooping = false;
      this.bgmTimers.forEach((timer) => window.clearTimeout(timer));
      this.bgmTimers = [];
      this.currentBGM.forEach((osc) => {
        try {
          osc.stop();
        } catch (error) {
          console.warn("Unable to stop oscillator", error);
        }
      });
      this.currentBGM = [];
    },
  };

  window.AudioManager = AudioManager;
})();
