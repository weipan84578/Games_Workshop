(function registerPlaylist(app) {
  "use strict";

  const tracks = {
    menu: [
      { id: "menu-welcome", bpm: 118, notes: ["C5", "E5", "G5", "E5", "A5", "G5", "E5", "D5"] },
      { id: "menu-lantern", bpm: 112, notes: ["G4", "B4", "D5", "G5", "E5", "D5", "B4", "G4"] }
    ],
    game: [
      { id: "game-sizzle-a", bpm: 132, notes: ["C5", "E5", "G5", "C6", "G5", "E5", "D5", "G5"] },
      { id: "game-sizzle-b", bpm: 126, notes: ["A4", "C5", "E5", "A5", "G5", "E5", "C5", "D5"] }
    ],
    celebration: [
      { id: "celebration-bells", bpm: 140, notes: ["C5", "E5", "G5", "C6", "E6", "C6", "G5", "C6"] }
    ]
  };

  let lastByMode = {};

  app.Playlist = {
    getNext(mode) {
      const list = tracks[mode] || tracks.menu;
      if (list.length === 1) {
        lastByMode[mode] = list[0].id;
        return list[0];
      }
      const options = list.filter((track) => track.id !== lastByMode[mode]);
      const track = options[Math.floor(Math.random() * options.length)];
      lastByMode[mode] = track.id;
      return track;
    },

    tracks
  };
})(window.Takoyaki = window.Takoyaki || {});
