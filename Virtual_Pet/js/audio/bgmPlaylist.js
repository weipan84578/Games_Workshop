window.VP = window.VP || {};

VP.BGM_PLAYLIST = {
  "main-menu": {
    tempo: 780,
    wave: "triangle",
    gain: 0.014,
    notes: [392, 494, 523, 659, 523, 494, 440, 523]
  },
  "gameplay-happy": {
    tempo: 620,
    wave: "triangle",
    gain: 0.013,
    notes: [523, 659, 784, 659, 880, 784, 659, 587]
  },
  "gameplay-normal": {
    tempo: 860,
    wave: "sine",
    gain: 0.015,
    notes: [330, 392, 440, 392, 349, 392, 330, 294]
  },
  settings: {
    tempo: 900,
    wave: "sine",
    gain: 0.011,
    notes: [392, 440, 494, 440, 392, 330]
  },
  ending: {
    tempo: 1040,
    wave: "triangle",
    gain: 0.015,
    notes: [330, 294, 262, 247, 220]
  }
};
