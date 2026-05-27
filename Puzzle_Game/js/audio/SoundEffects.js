export class SoundEffects {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.snapStreak = 0;
    this.snapReset = null;
  }

  play(name) {
    switch (name) {
      case "click":
        this.audio.playTone({ frequency: 720, endFrequency: 920, duration: 0.055, type: "triangle", gain: 0.1 });
        this.audio.playTone({ frequency: 1440, duration: 0.035, type: "sine", gain: 0.035, delay: 0.025, pan: 0.25 });
        break;
      case "start":
        [392, 523, 659, 784].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.12, type: "triangle", gain: 0.09, delay: index * 0.055 });
        });
        break;
      case "pickup":
        this.audio.playTone({ frequency: 280, endFrequency: 430, duration: 0.13, type: "sine", gain: 0.09, pan: -0.14 });
        this.audio.playNoise({ duration: 0.055, gain: 0.035, filterType: "highpass", frequency: 1900, pan: 0.15 });
        break;
      case "drop":
        this.audio.playTone({ frequency: 210, endFrequency: 130, duration: 0.13, type: "triangle", gain: 0.085 });
        this.audio.playNoise({ duration: 0.075, gain: 0.05, filterType: "lowpass", frequency: 620 });
        break;
      case "snap":
        this.audio.playTone({ frequency: 520, duration: 0.075, type: "triangle", gain: 0.12, pan: -0.12 });
        this.audio.playTone({ frequency: 780, duration: 0.105, type: "sine", gain: 0.08, delay: 0.045, pan: 0.12 });
        this.audio.playTone({ frequency: 1175, duration: 0.075, type: "sine", gain: 0.045, delay: 0.095 });
        this.trackCombo();
        break;
      case "combo":
        [660, 880, 990, 1320].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.12, type: "sine", gain: 0.085, delay: index * 0.055, pan: (index - 1.5) / 4 });
        });
        break;
      case "shuffle":
        this.audio.playNoise({ duration: 0.22, gain: 0.075, filterType: "bandpass", frequency: 850, pan: -0.18 });
        this.audio.playNoise({ duration: 0.18, gain: 0.055, delay: 0.1, filterType: "highpass", frequency: 2200, pan: 0.18 });
        this.audio.playTone({ frequency: 260, endFrequency: 520, duration: 0.18, type: "sawtooth", gain: 0.035, delay: 0.04 });
        break;
      case "hint":
        this.audio.playTone({ frequency: 880, duration: 0.12, type: "sine", gain: 0.085 });
        this.audio.playTone({ frequency: 660, duration: 0.12, type: "sine", gain: 0.075, delay: 0.08 });
        this.audio.playTone({ frequency: 990, duration: 0.16, type: "triangle", gain: 0.06, delay: 0.16 });
        break;
      case "pause":
        this.audio.playTone({ frequency: 440, endFrequency: 220, duration: 0.18, type: "triangle", gain: 0.075 });
        break;
      case "resume":
        this.audio.playTone({ frequency: 220, endFrequency: 440, duration: 0.18, type: "triangle", gain: 0.075 });
        break;
      case "victory":
        [523, 659, 784, 1046, 1318].forEach((frequency, index) => {
          this.audio.playTone({ frequency, duration: 0.22, type: "triangle", gain: 0.12, delay: index * 0.12, pan: (index - 2) / 4 });
        });
        this.audio.playNoise({ duration: 0.28, gain: 0.045, delay: 0.18, filterType: "bandpass", frequency: 2400 });
        break;
      case "error":
        this.audio.playTone({ frequency: 190, endFrequency: 110, duration: 0.2, type: "sawtooth", gain: 0.075 });
        this.audio.playTone({ frequency: 160, endFrequency: 90, duration: 0.2, type: "square", gain: 0.045, delay: 0.055 });
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
