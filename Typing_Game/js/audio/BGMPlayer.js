const PATTERNS = {
  menu: [220, 277, 330, 415],
  game: [196, 247, 294, 370],
  result: [262, 330, 392, 523],
  tutorial: [174, 220, 262, 330],
  settings: [147, 196, 247, 294],
};

export class BGMPlayer {
  constructor(getContext, getVolume) {
    this.getContext = getContext;
    this.getVolume = getVolume;
    this.intervalId = null;
    this.step = 0;
    this.pattern = PATTERNS.menu;
  }

  start(screenName = "menu", difficulty = "normal") {
    this.stop();
    const key = screenName === "game" ? "game" : screenName;
    this.pattern = PATTERNS[key] ?? PATTERNS.menu;
    if (difficulty === "hell") this.pattern = [110, 165, 220, 311, 392];
    if (difficulty === "hard") this.pattern = [146, 220, 293, 440];
    this.intervalId = window.setInterval(() => this.playStep(), screenName === "game" ? 480 : 760);
    this.playStep();
  }

  playStep() {
    const volume = this.getVolume();
    if (volume <= 0) return;
    const context = this.getContext();
    if (!context) return;
    const frequency = this.pattern[this.step % this.pattern.length];
    this.step += 1;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.04, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.36);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.38);
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
