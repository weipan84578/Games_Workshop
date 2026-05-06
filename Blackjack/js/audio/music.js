export class Music {
  constructor(synth) {
    this.synth = synth;
    this.timer = null;
    this.step = 0;
    this.notes = [65.41, 82.41, 98, 123.47, 110, 98, 82.41, 73.42];
  }

  start() {
    if (this.timer || !this.synth.context) return;
    this.timer = window.setInterval(() => {
      const note = this.notes[this.step % this.notes.length];
      this.synth.tone(note, 0.18, "sine", this.synth.music);
      if (this.step % 4 === 0) this.synth.tone(note * 3, 0.12, "triangle", this.synth.music);
      this.step += 1;
    }, 667);
  }

  stop() {
    window.clearInterval(this.timer);
    this.timer = null;
  }
}
