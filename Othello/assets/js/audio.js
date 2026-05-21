// Web Audio API music and sound-effect synthesizer.
const AudioEngine = {
      ctx: null,
      master: null,
      musicGain: null,
      sfxGain: null,
      musicTimer: null,
      step: 0,
      init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.master = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.connect(this.master);
        this.sfxGain.connect(this.master);
        this.master.connect(this.ctx.destination);
        this.applySettings();
      },
      resume() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.applySettings();
        this.startMusic();
      },
      applySettings() {
        if (!this.ctx) return;
        const s = StorageManager.settings;
        this.master.gain.value = Number(s.masterVolume);
        this.musicGain.gain.value = s.musicEnabled ? Number(s.musicVolume) : 0;
        this.sfxGain.gain.value = s.sfxEnabled ? Number(s.sfxVolume) : 0;
        if (s.musicEnabled) this.startMusic(); else this.stopMusic();
      },
      tone(freq, duration, type = 'sine', gain = 0.16, dest = this.sfxGain, when = 0) {
        if (!this.ctx || !dest) return;
        const start = this.ctx.currentTime + when;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(g);
        g.connect(dest);
        osc.start(start);
        osc.stop(start + duration + 0.03);
      },
      glide(from, to, duration, type = 'sine', gain = 0.16) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const start = this.ctx.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(from, start);
        osc.frequency.exponentialRampToValueAtTime(to, start + duration);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(gain, start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + duration + 0.02);
      },
      sfx(id) {
        if (!StorageManager.settings.sfxEnabled) return;
        this.resume();
        const map = {
          place: () => this.glide(440, 220, 0.12),
          ai: () => this.glide(330, 165, 0.12),
          flip: () => this.glide(600, 300, 0.08, 'triangle', 0.1),
          combo: () => [262, 330, 392].forEach((f, i) => this.tone(f, 0.12, 'sine', 0.1, this.sfxGain, i * 0.045)),
          skip: () => this.glide(400, 200, 0.25, 'sawtooth', 0.08),
          win: () => [262, 330, 392, 523].forEach((f, i) => this.tone(f, 0.16, 'sine', 0.12, this.sfxGain, i * 0.08)),
          lose: () => [262, 311, 196].forEach((f, i) => this.tone(f, 0.2, 'triangle', 0.11, this.sfxGain, i * 0.08)),
          draw: () => [262, 294, 330].forEach((f, i) => this.tone(f, 0.12, 'sine', 0.1, this.sfxGain, i * 0.06)),
          button: () => this.tone(800, 0.05, 'sine', 0.07),
          invalid: () => this.tone(150, 0.1, 'sawtooth', 0.09)
        };
        map[id]?.();
      },
      startMusic() {
        if (!this.ctx || this.musicTimer || !StorageManager.settings.musicEnabled) return;
        const notes = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 246.94, 293.66];
        this.musicTimer = setInterval(() => {
          if (!StorageManager.settings.musicEnabled) return;
          const note = notes[this.step % notes.length];
          this.tone(note, 0.42, 'sine', 0.045, this.musicGain);
          if (this.step % 4 === 0) this.tone(130.81, 0.5, 'triangle', 0.035, this.musicGain);
          this.step += 1;
        }, 500);
      },
      stopMusic() {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    };
