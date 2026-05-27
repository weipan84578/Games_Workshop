const TRACKS = {
  menu: {
    interval: 310,
    wave: "triangle",
    melodyGain: 0.06,
    bassGain: 0.035,
    melody: [392, 494, 587, 659, 587, 494, 440, 523, 659, 784, 659, 523, 494, 440, 392, 0],
    bass: [196, 196, 220, 220, 247, 247, 220, 220],
    chords: [[392, 494, 587], [440, 523, 659], [349, 440, 587], [392, 494, 659]]
  },
  game_easy: {
    interval: 260,
    wave: "sine",
    melodyGain: 0.055,
    bassGain: 0.032,
    melody: [330, 392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392],
    bass: [165, 165, 196, 196, 174, 174, 196, 196],
    chords: [[330, 392, 494], [349, 440, 523], [392, 494, 587], [330, 440, 523]]
  },
  game_hard: {
    interval: 210,
    wave: "square",
    melodyGain: 0.045,
    bassGain: 0.038,
    melody: [220, 330, 392, 440, 392, 330, 294, 330, 247, 370, 440, 494, 440, 370, 330, 294],
    bass: [110, 110, 147, 147, 123, 123, 165, 165],
    chords: [[220, 330, 440], [247, 370, 494], [294, 392, 523], [247, 330, 440]]
  },
  victory: {
    interval: 190,
    wave: "triangle",
    melodyGain: 0.075,
    bassGain: 0.04,
    melody: [523, 659, 784, 1046, 880, 1046, 1175, 1318, 1046, 880, 784, 659, 784, 1046, 1318, 0],
    bass: [262, 262, 330, 330, 392, 392, 330, 330],
    chords: [[523, 659, 784], [587, 740, 880], [659, 784, 1046], [523, 784, 1046]]
  }
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
    this.intervalId = window.setInterval(() => this.tick(), TRACKS[pattern].interval);
    this.tick();
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentPattern = "";
  }

  tick() {
    const track = TRACKS[this.currentPattern];
    if (!track) return;

    const beat = this.step % track.melody.length;
    const phrase = Math.floor(this.step / track.melody.length);
    const melody = track.melody[beat];
    const chord = track.chords[Math.floor(beat / 4) % track.chords.length];
    const pan = ((beat % 8) - 3.5) / 7;

    if (melody) {
      this.audio.playTone({
        frequency: melody,
        duration: track.interval / 1000 * 0.76,
        type: track.wave,
        gain: track.melodyGain,
        destination: "music",
        pan
      });
    }

    if (beat % 4 === 0) {
      const bass = track.bass[(beat / 2) % track.bass.length];
      this.audio.playTone({
        frequency: bass,
        duration: track.interval / 1000 * 1.8,
        type: "sine",
        gain: track.bassGain,
        destination: "music",
        pan: -0.18
      });

      chord.forEach((frequency, index) => {
        this.audio.playTone({
          frequency,
          duration: track.interval / 1000 * 2.4,
          type: "triangle",
          gain: 0.018,
          destination: "music",
          delay: index * 0.018,
          pan: 0.18
        });
      });
    }

    if (this.currentPattern === "game_hard" && beat % 4 === 2) {
      this.audio.playNoise({
        duration: 0.045,
        gain: 0.018,
        destination: "music",
        filterType: "highpass",
        frequency: 2600,
        pan: 0.22
      });
    }

    if (this.currentPattern === "victory" && beat % 8 === 0 && phrase < 4) {
      this.audio.playNoise({
        duration: 0.18,
        gain: 0.025,
        destination: "music",
        filterType: "bandpass",
        frequency: 1800
      });
    }

    this.step += 1;
  }
}
