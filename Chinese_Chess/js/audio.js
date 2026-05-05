export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
  }

  update(settings) {
    this.settings = settings;
  }

  play(name) {
    if (!this.settings.sfxEnabled) return;
    try {
      this.context ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const now = this.context.currentTime;
      const freq = {
        select: 520,
        move: 330,
        capture: 180,
        check: 720,
        win: 880,
        lose: 130
      }[name] || 400;
      oscillator.frequency.setValueAtTime(freq, now);
      oscillator.type = name === "capture" ? "square" : "sine";
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.01, this.settings.sfxVolume * 0.14), now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (name === "check" ? 0.42 : 0.16));
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.48);
    } catch {
      // Audio is optional and may be blocked by browser policy.
    }
  }
}
