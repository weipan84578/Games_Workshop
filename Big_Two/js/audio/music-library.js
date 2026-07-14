(function (global) {
  "use strict";

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var AudioNS = BigTwo.Audio = BigTwo.Audio || {};

  function addNote(target, beat, midi, duration, velocity) {
    target.push({
      beat: beat,
      midi: midi,
      duration: duration,
      velocity: velocity
    });
  }

  function buildTrack(definition) {
    var notes = [];
    var chordCount = definition.chords.length;
    var melodyLength = definition.melody.length;

    for (var bar = 0; bar < definition.bars; bar += 1) {
      var barBeat = bar * 4;
      var chord = definition.chords[bar % chordCount];
      var variation = definition.variations[bar % definition.variations.length];

      addNote(notes, barBeat, chord[0] - 12, 1.55, 0.28);
      addNote(notes, barBeat + 2, chord[0] - 5, 1.45, 0.24);

      for (var c = 0; c < chord.length; c += 1) {
        addNote(notes, barBeat + 0.03 + c * 0.035, chord[c], 1.75, 0.2);
        addNote(notes, barBeat + 2.03 + c * 0.035, chord[c], 1.65, 0.17);
      }

      for (var step = 0; step < 8; step += 1) {
        var melodyIndex = (bar * 5 + step) % melodyLength;
        var pitch = definition.melody[melodyIndex] + variation;
        var duration = step % 4 === 3 ? 0.82 : 0.38;
        var emphasis = step === 0 || step === 4 ? 0.4 : 0.31;
        addNote(notes, barBeat + step * 0.5, pitch, duration, emphasis);
      }
    }

    notes.sort(function (a, b) {
      return a.beat - b.beat || a.midi - b.midi;
    });

    var durationBeats = definition.bars * 4;
    return Object.freeze({
      id: definition.id,
      title: definition.title,
      bpm: definition.bpm,
      bars: definition.bars,
      durationBeats: durationBeats,
      durationSeconds: durationBeats * 60 / definition.bpm,
      notes: Object.freeze(notes)
    });
  }

  var tracks = [
    buildTrack({
      id: "track1",
      title: "Sunlit Steps",
      bpm: 112,
      bars: 28,
      chords: [[60, 64, 67], [57, 60, 64], [65, 69, 72], [67, 71, 74]],
      melody: [72, 74, 76, 79, 76, 74, 72, 67, 69, 72, 74, 76, 74, 72, 69, 67],
      variations: [0, 0, 12, 0, 2, 0, -1]
    }),
    buildTrack({
      id: "track2",
      title: "Clover Picnic",
      bpm: 104,
      bars: 24,
      chords: [[62, 66, 69], [59, 62, 66], [67, 71, 74], [69, 73, 76]],
      melody: [74, 76, 78, 81, 78, 76, 73, 69, 71, 73, 76, 78, 81, 78, 76, 73],
      variations: [0, -2, 0, 12, 0, 2]
    }),
    buildTrack({
      id: "track3",
      title: "Sakura Breeze",
      bpm: 120,
      bars: 32,
      chords: [[57, 60, 64], [65, 69, 72], [60, 64, 67], [67, 71, 74]],
      melody: [76, 79, 81, 84, 81, 79, 76, 72, 74, 76, 79, 81, 79, 76, 74, 72],
      variations: [0, 0, -5, 0, 12, 0, 2, 0]
    }),
    buildTrack({
      id: "track4",
      title: "Moonlight Carousel",
      bpm: 98,
      bars: 28,
      chords: [[55, 59, 62], [64, 67, 71], [60, 64, 67], [62, 66, 69]],
      melody: [71, 74, 79, 78, 74, 71, 69, 67, 69, 71, 74, 76, 74, 71, 69, 66],
      variations: [0, 12, 0, -2, 0, 5, 0]
    })
  ];

  var byId = Object.create(null);
  tracks.forEach(function (track) {
    byId[track.id] = track;
  });

  var library = {
    tracks: Object.freeze(tracks.slice()),
    ids: Object.freeze(tracks.map(function (track) { return track.id; })),

    getTrack: function (id) {
      return byId[id] || null;
    },

    getNextTrackId: function (currentId) {
      var ids = this.ids;
      var index = ids.indexOf(currentId);
      return ids[(index + 1 + ids.length) % ids.length];
    }
  };

  AudioNS.MusicLibrary = Object.freeze(library);
}(window));
