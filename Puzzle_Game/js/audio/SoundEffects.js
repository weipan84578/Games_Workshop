export class SoundEffects {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.snapStreak = 0;
    this.snapReset = null;
  }

  play(name) {
    switch (name) {
      case "click":
        this.audio.playTone({ frequency: 620, duration: 0.06, type: "triangle", gain: 0.09 });
        break;
      case "pickup":
        this.audio.playTone({ frequency: 330, duration: 0.1, type: "sine", gain: 0.08 });
        break;
      case "drop":
        this.audio.playTone({ frequency: 180, duration: 0.11, type: "triangle", gain: 0.08 });
        break;
      case "snap":
        this.audio.playTone({ frequency: 520, duration: 0.08, type: "triangle", gain: 0.1 });
        this.audio.playTone({ frequency: 780, duration: 0.1, type: "sine", gain: 0.07, delay: 0.05 });
        this.trackCombo();
        break;
      case "combo":
        [660, 880, 1100].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.11, type: "sine", gain: 0.08, delay: index * 0.06 });
        });
        break;
      case "shuffle":
        this.audio.playNoise({ duration: 0.2, gain: 0.08 });
        break;
      case "hint":
        this.audio.playTone({ frequency: 880, duration: 0.12, type: "sine", gain: 0.08 });
        this.audio.playTone({ frequency: 660, duration: 0.12, type: "sine", gain: 0.07, delay: 0.08 });
        break;
      case "victory":
        [523, 659, 784, 1046].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.22, type: "triangle", gain: 0.1, delay: index * 0.13 });
        });
        break;
      case "error":
        this.audio.playTone({ frequency: 180, duration: 0.18, type: "sawtooth", gain: 0.06 });
        break;
      default:
        this.play("click");
    }
  }

  trackCombo() {
    this.snapStreak += 1;
    clearTimeout(this.snapReset);
    this.snapReset = window.setTimeout(() => {
      this.snapStreak = 0;
    }, 1800);

    if (this.snapStreak > 0 && this.snapStreak % 3 === 0) {
      this.play("combo");
    }
  }
}
