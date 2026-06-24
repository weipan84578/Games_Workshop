(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};

  class AudioManager {
    constructor(settingsManager) {
      this.settingsManager = settingsManager;
      this.audioCtx = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.bgmTimer = null;
      this.bgmStep = 0;
      this.muted = false;
      this.supported = Boolean(window.AudioContext || window.webkitAudioContext);
      document.addEventListener("pointerdown", () => this.ensure(), { once: true });
    }

    ensure() {
      if (!this.supported) return null;
      if (!this.audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new Ctx();
        this.bgmGain = this.audioCtx.createGain();
        this.sfxGain = this.audioCtx.createGain();
        this.bgmGain.connect(this.audioCtx.destination);
        this.sfxGain.connect(this.audioCtx.destination);
        this.applySettings();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      this.startBgm();
      return this.audioCtx;
    }

    applySettings() {
      if (!this.audioCtx) return;
      const { bgmVolume, sfxVolume, bgmEnabled, sfxEnabled } = this.settingsManager.settings;
      const now = this.audioCtx.currentTime;
      const bgmLevel = this.muted || !bgmEnabled ? 0 : bgmVolume * 0.1 * 5;
      const sfxLevel = this.muted || !sfxEnabled ? 0 : sfxVolume;
      this.bgmGain.gain.setTargetAtTime(bgmLevel, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(sfxLevel, now, 0.03);
      if (!bgmEnabled || this.muted) this.stopBgm();
      if (bgmEnabled && !this.muted) this.startBgm();
    }

    setMuted(muted) {
      this.muted = muted;
      this.applySettings();
    }

    startBgm() {
      if (!this.audioCtx || this.bgmTimer || this.muted || !this.settingsManager.settings.bgmEnabled) return;
      const sequence = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
      this.bgmTimer = window.setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state !== "running") return;
        const freq = sequence[this.bgmStep % sequence.length];
        this.playPluck(freq, 0.14, this.bgmGain);
        if (this.bgmStep % 4 === 0) this.playPluck(freq / 2, 0.18, this.bgmGain, "sine");
        this.bgmStep += 1;
      }, 240);
    }

    stopBgm() {
      if (this.bgmTimer) {
        window.clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    playPluck(freq, duration, output, type = "triangle") {
      const ctx = this.audioCtx;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(output);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    }

    tone(freq, duration, type = "sine", volume = 0.3, delay = 0) {
      const ctx = this.ensure();
      if (!ctx || this.muted || !this.settingsManager.settings.sfxEnabled) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.02);
    }

    click() {
      this.tone(1200, 0.08, "sine", 0.25);
    }

    chip() {
      this.tone(659, 0.08, "triangle", 0.22);
      this.tone(880, 0.06, "sine", 0.12, 0.025);
    }

    clear() {
      this.tone(293.66, 0.18, "sawtooth", 0.12);
    }

    spinStart() {
      this.tone(87.31, 0.45, "sawtooth", 0.15);
      this.tone(174.61, 0.35, "triangle", 0.1, 0.08);
    }

    drop() {
      this.tone(987.77, 0.12, "triangle", 0.28);
    }

    win() {
      [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
        this.tone(note, 0.19, "triangle", 0.24, index * 0.12);
      });
    }

    lose() {
      this.tone(196, 0.32, "sawtooth", 0.16);
    }
  }

  Object.assign(R, { AudioManager });
})();
