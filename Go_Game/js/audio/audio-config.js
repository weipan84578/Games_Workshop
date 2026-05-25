window.GoGame = window.GoGame || {};

GoGame.AudioConfig = {
  tones: {
    "stone-place-black": [180, 0.055, "sine"],
    "stone-place-white": [260, 0.055, "triangle"],
    "stone-capture-1": [95, 0.12, "sawtooth"],
    "stone-capture-many": [80, 0.18, "square"],
    "btn-click": [520, 0.04, "square"],
    "btn-hover": [760, 0.025, "sine"],
    "game-start": [330, 0.12, "triangle"],
    "game-over": [210, 0.22, "sine"],
    "win-fanfare": [660, 0.16, "triangle"],
    "lose-sound": [140, 0.2, "sine"],
    "pass-turn": [420, 0.08, "sine"],
    undo: [300, 0.08, "triangle"],
    "timer-tick": [880, 0.025, "square"],
    "ko-warning": [120, 0.12, "sawtooth"],
    "theme-change": [580, 0.08, "triangle"],
  },
  bgm: {
    menu: {
      tempo: 86,
      wave: "triangle",
      bass: "sine",
      notes: [392, 440, 523, 494, 440, 392, 330, 349, 392, 440, 392, 330],
      bassNotes: [98, 110, 131, 123],
    },
    game: {
      tempo: 72,
      wave: "sine",
      bass: "triangle",
      notes: [294, 330, 392, 440, 392, 330, 294, 247, 294, 349, 392, 330],
      bassNotes: [73, 82, 98, 110],
    },
    result: {
      tempo: 92,
      wave: "triangle",
      bass: "sine",
      notes: [523, 659, 784, 659, 587, 523, 440, 523, 587, 659, 587, 523],
      bassNotes: [131, 165, 196, 165],
    },
  },
};
