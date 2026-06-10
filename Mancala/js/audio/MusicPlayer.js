(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  Mancala.MusicTracks = {
    music_menu: {
      bpm: 80,
      type: "sine",
      gain: 0.09,
      notes: [261.63, 329.63, 392, 523.25, 392, 329.63]
    },
    music_game_normal: {
      bpm: 100,
      type: "triangle",
      gain: 0.075,
      notes: [293.66, 349.23, 440, 523.25, 440, 349.23, 329.63, 392]
    },
    music_game_intense: {
      bpm: 130,
      type: "square",
      gain: 0.05,
      notes: [220, 261.63, 311.13, 392, 311.13, 261.63, 233.08, 293.66]
    }
  };
})(window);
