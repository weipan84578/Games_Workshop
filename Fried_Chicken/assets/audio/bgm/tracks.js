(function (global) {
  "use strict";
  var CCC = global.CCC;
  CCC.audioData = CCC.audioData || {};

  // Original, redistributable note-sequence compositions. Frequencies use equal temperament.
  CCC.audioData.tracks = {
    morning: {
      title: "Morning Apron", tempo: 108,
      melody: ["C5", "E5", "G5", "E5", "D5", "F5", "A5", "G5", "E5", "G5", "C6", "B5", "A5", "G5", "E5", "D5"],
      bass: ["C3", "G3", "A3", "E3", "F3", "C3", "G3", "G3"]
    },
    sizzling: {
      title: "Sizzling Steps", tempo: 124,
      melody: ["E5", "G5", "A5", "G5", "E5", "D5", "C5", "D5", "F5", "A5", "C6", "A5", "G5", "E5", "D5", "G5"],
      bass: ["C3", "C4", "F3", "F4", "A3", "E3", "G3", "G4"]
    },
    golden: {
      title: "Golden Rush", tempo: 142,
      melody: ["G5", "A5", "C6", "E6", "D6", "C6", "A5", "G5", "E5", "G5", "B5", "D6", "C6", "B5", "G5", "A5"],
      bass: ["C3", "G3", "A3", "E3", "F3", "A3", "G3", "B3"]
    }
  };

  CCC.audioData.noteFrequencies = {
    C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, F4: 349.23, G4: 392.00,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51
  };
}(typeof window !== "undefined" ? window : globalThis));
