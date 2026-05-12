class AudioController {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.musicTimer = 0;
    this.currentMusic = "menu";
  }

  unlock() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.playMusic("menu");
  }

  setSettings(settings) {
    this.settings = settings;
  }

  volume(kind) {
    if (this.settings.muted) return 0;
    const value = kind === "music" ? this.settings.musicVolume : this.settings.sfxVolume;
    return Math.max(0, Math.min(1, value / 100));
  }

  tone(freq, duration, type = "square", gain = 0.08) {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(gain * this.volume("sfx"), now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  sfx(id) {
    const map = {
      gun: [180, 0.055, "sawtooth", 0.16],
      hit: [95, 0.09, "square", 0.12],
      head: [620, 0.08, "triangle", 0.12],
      hostage: [260, 0.28, "sine", 0.14],
      miss: [120, 0.07, "triangle", 0.08],
      empty: [70, 0.08, "square", 0.09],
      reload: [360, 0.1, "triangle", 0.1],
      attack: [55, 0.18, "sawtooth", 0.15],
      clear: [760, 0.18, "triangle", 0.15],
      over: [85, 0.38, "sawtooth", 0.14],
      combo: [880, 0.12, "sine", 0.13]
    };
    this.tone(...(map[id] || map.hit));
  }

  playMusic(id) {
    this.currentMusic = id;
    if (!this.ctx) return;
    window.clearInterval(this.musicTimer);
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || this.settings.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(id === "menu" ? 110 : 146, now);
      amp.gain.setValueAtTime(0.025 * this.volume("music"), now);
      amp.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(amp).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    }, id === "menu" ? 560 : 390);
  }
}
