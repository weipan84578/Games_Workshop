(function (global) {
  "use strict";

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var AudioNS = BigTwo.Audio = BigTwo.Audio || {};

  function freezeDefinition(definition) {
    definition.notes.forEach(Object.freeze);
    Object.freeze(definition.notes);
    return Object.freeze(definition);
  }

  var definitions = {
    select: freezeDefinition({
      minInterval: 0.045,
      maxConcurrent: 2,
      filter: 2600,
      notes: [{ midi: 84, offset: 0, duration: 0.075, gain: 0.18, type: "sine" }]
    }),
    deselect: freezeDefinition({
      minInterval: 0.045,
      maxConcurrent: 2,
      filter: 1900,
      notes: [{ midi: 78, endMidi: 74, offset: 0, duration: 0.09, gain: 0.16, type: "triangle" }]
    }),
    play: freezeDefinition({
      minInterval: 0.1,
      maxConcurrent: 1,
      filter: 3000,
      notes: [
        { midi: 79, offset: 0, duration: 0.09, gain: 0.16, type: "triangle" },
        { midi: 83, offset: 0.065, duration: 0.11, gain: 0.18, type: "triangle" },
        { midi: 86, offset: 0.13, duration: 0.14, gain: 0.19, type: "sine" }
      ]
    }),
    invalid: freezeDefinition({
      minInterval: 0.16,
      maxConcurrent: 1,
      filter: 1500,
      notes: [
        { midi: 67, offset: 0, duration: 0.1, gain: 0.11, type: "sine" },
        { midi: 64, offset: 0.075, duration: 0.13, gain: 0.1, type: "sine" }
      ]
    }),
    pass: freezeDefinition({
      minInterval: 0.12,
      maxConcurrent: 1,
      filter: 2200,
      notes: [{ midi: 81, endMidi: 72, offset: 0, duration: 0.24, gain: 0.14, type: "sine" }]
    }),
    turn: freezeDefinition({
      minInterval: 0.25,
      maxConcurrent: 1,
      filter: 3200,
      notes: [
        { midi: 84, offset: 0, duration: 0.11, gain: 0.15, type: "sine" },
        { midi: 88, offset: 0.11, duration: 0.18, gain: 0.17, type: "sine" }
      ]
    }),
    newTrick: freezeDefinition({
      minInterval: 0.2,
      maxConcurrent: 1,
      filter: 2500,
      notes: [
        { midi: 72, offset: 0, duration: 0.3, gain: 0.12, type: "triangle" },
        { midi: 76, offset: 0.018, duration: 0.3, gain: 0.1, type: "triangle" },
        { midi: 79, offset: 0.036, duration: 0.3, gain: 0.1, type: "triangle" }
      ]
    }),
    victory: freezeDefinition({
      minInterval: 0.8,
      maxConcurrent: 1,
      filter: 3400,
      notes: [
        { midi: 72, offset: 0, duration: 0.3, gain: 0.17, type: "triangle" },
        { midi: 76, offset: 0.11, duration: 0.32, gain: 0.18, type: "triangle" },
        { midi: 79, offset: 0.22, duration: 0.35, gain: 0.19, type: "triangle" },
        { midi: 84, offset: 0.34, duration: 0.55, gain: 0.2, type: "sine" }
      ]
    }),
    defeat: freezeDefinition({
      minInterval: 0.8,
      maxConcurrent: 1,
      filter: 1700,
      notes: [
        { midi: 76, offset: 0, duration: 0.25, gain: 0.11, type: "sine" },
        { midi: 72, offset: 0.15, duration: 0.28, gain: 0.1, type: "sine" },
        { midi: 67, offset: 0.3, duration: 0.42, gain: 0.09, type: "sine" }
      ]
    }),
    button: freezeDefinition({
      minInterval: 0.04,
      maxConcurrent: 2,
      filter: 2800,
      notes: [{ midi: 82, offset: 0, duration: 0.045, gain: 0.1, type: "square" }]
    })
  };

  var aliases = Object.freeze({
    cardSelect: "select",
    selectCard: "select",
    cardDeselect: "deselect",
    deselectCard: "deselect",
    playCards: "play",
    legalPlay: "play",
    error: "invalid",
    illegal: "invalid",
    humanTurn: "turn",
    turnStart: "turn",
    trick: "newTrick",
    newRound: "newTrick",
    win: "victory",
    lose: "defeat",
    click: "button"
  });

  AudioNS.SfxLibrary = Object.freeze({
    definitions: Object.freeze(definitions),
    aliases: aliases,
    get: function (name) {
      var canonicalName = aliases[name] || name;
      return definitions[canonicalName] || null;
    },
    canonicalName: function (name) {
      return aliases[name] || name;
    }
  });
}(window));
