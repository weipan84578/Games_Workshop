(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var notes = { click: 523.25, hover: 659.25, fire: 196, gate: 440, multiplier: 659.25, critical: 880, hit: 246.94, explosion: 110, shield: 392, victory: 783.99, defeat: 185, unlock: 987.77, coin: 1046.5, skill: 349.23 };
    var Sfx = cg.Sfx = {};
    Sfx.play = function (name, intensity) {
        var audio = cg.Audio;
        if (!audio || !audio.state.ready || root.GameState.settings.mute || !root.GameState.settings.sfxEnabled) return;
        var base = notes[name] || notes.click;
        var amount = cg.Utils.clamp(Number(intensity) || 1, .35, 2);
        var duration = name === "explosion" ? .2 : name === "fire" ? .13 : .1;
        var wave = name === "explosion" ? "sawtooth" : name === "fire" ? "square" : "triangle";
        audio.playTone(base, duration, .045 * amount, wave);
        if (name === "multiplier" || name === "victory" || name === "unlock") audio.playTone(base * 1.25, duration * .8, .035 * amount, "sine");
        if (name === "critical") audio.playTone(base * 1.5, .11, .04, "sine");
    };
}(window));
