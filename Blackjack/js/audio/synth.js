export class Synth {
  constructor() {
    this.context = null;
    this.master = null;
    this.sfx = null;
    this.music = null;
  }

  async init(settings) {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.sfx = this.context.createGain();
      this.music = this.context.createGain();
      this.sfx.connect(this.master);
      this.music.connect(this.master);
      this.master.connect(this.context.destination);
    }
    await this.context.resume();
    this.setVolumes(settings);
  }

  setVolumes(settings) {
    if (!this.context) return;
    this.master.gain.value = 1;
    this.sfx.gain.value = Number(settings.sfxVolume ?? 0.6);
    this.music.gain.value = Number(settings.musicVolume ?? 0.8) * 0.28;
  }

  play(type) {
    if (!this.context) return;
    const map = {
      deal: [420, 0.08, "triangle"],
      chip: [260, 0.16, "square"],
      win: [660, 0.5, "sine"],
      lose: [160, 0.35, "sawtooth"],
      blackjack: [880, 0.8, "triangle"],
      button: [520, 0.06, "sine"]
    };
    const [freq, duration, wave] = map[type] || map.button;
    this.tone(freq, duration, wave, this.sfx);
    if (type === "blackjack") {
      window.setTimeout(() => this.tone(1320, 0.35, "triangle", this.sfx), 120);
    }
  }

  tone(freq, duration, wave, output) {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}
