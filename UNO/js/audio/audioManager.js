(function () {
  const AudioManager = {
    audioCtx: null,
    bgmGain: null,
    sfxGain: null,
    currentBGM: [],

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
      if (this.bgmGain) this.bgmGain.gain.value = Helpers.clamp(next.bgmVolume, 0, 1) * 0.08;
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
      if (!ctx || this.currentBGM.length) return;
      [130.81, 196].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(this.bgmGain);
        osc.start();
        this.currentBGM.push(osc);
      });
    },

    stopBGM() {
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
