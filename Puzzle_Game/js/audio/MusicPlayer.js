const PATTERNS = {
  menu: [392, 494, 587, 494, 440, 523, 659, 523],
  game_easy: [330, 392, 440, 392, 349, 440, 523, 440],
  game_hard: [220, 330, 392, 440, 392, 330, 294, 330],
  victory: [523, 659, 784, 1046, 784, 659, 523]
};

export class MusicPlayer {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.currentPattern = "";
    this.step = 0;
    this.intervalId = null;
  }

  playFor(screenName, difficulty = null) {
    let pattern = "menu";
    if (screenName === "game") {
      pattern = difficulty?.cols >= 6 ? "game_hard" : "game_easy";
    }
    if (screenName === "victory") pattern = "victory";
    if (this.currentPattern === pattern) return;

    this.stop();
    this.currentPattern = pattern;
    this.step = 0;
    this.intervalId = window.setInterval(() => this.tick(), pattern === "victory" ? 270 : 420);
    this.tick();
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentPattern = "";
  }

  tick() {
    const pattern = PATTERNS[this.currentPattern];
    if (!pattern) return;
    const frequency = pattern[this.step % pattern.length];
    const harmonic = pattern[(this.step + 2) % pattern.length] / 2;
    this.audio.playTone({ frequency, duration: 0.18, type: "sine", gain: 0.035, destination: "music" });
    this.audio.playTone({ frequency: harmonic, duration: 0.24, type: "triangle", gain: 0.02, destination: "music" });
    this.step += 1;
  }
}
