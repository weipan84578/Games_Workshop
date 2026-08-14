(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var tracks = {
        menu: [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
        battleA: [196, 246.94, 293.66, 246.94, 220, 277.18, 329.63, 277.18],
        battleB: [220, 277.18, 329.63, 392, 329.63, 277.18, 246.94, 293.66],
        battleC: [164.81, 196, 246.94, 293.66, 246.94, 220, 277.18, 329.63],
        victory: [392, 493.88, 587.33, 783.99, 659.25, 783.99, 987.77, 1174.66],
        defeat: [293.66, 277.18, 246.94, 220, 196, 174.61, 164.81, 146.83],
        relax: [329.63, 392, 493.88, 392, 349.23, 440, 523.25, 440]
    };
    var Bgm = cg.Bgm = {};
    var previousBattle = "";
    Bgm.start = function (name) {
        var audio = cg.Audio;
        if (!audio || !audio.state.ready) return;
        var selected = name === "battle" ? Bgm.pickBattle() : name;
        var sequence = tracks[selected] || tracks.menu;
        var index = 0;
        var beat = selected === "victory" ? 270 : selected === "defeat" ? 360 : 390;
        function schedule() {
            if (!audio.state.ready || audio.state.currentTrack !== name) return;
            var note = sequence[index % sequence.length];
            var octave = index % 4 === 3 ? .5 : 1;
            audio.playBgmNote(note * octave, selected === "victory" ? .3 : .34, selected === "victory" ? .055 : .038, "triangle");
            if (index % 4 === 0) audio.playBgmNote(note / 2, .62, .018, "sine");
            index += 1;
            audio.state.bgmTimer = setTimeout(schedule, beat);
        }
        schedule();
    };
    Bgm.pickBattle = function () {
        var choices = ["battleA", "battleB", "battleC"];
        var selected = choices[Math.floor(Math.random() * choices.length)];
        if (selected === previousBattle) selected = choices[(choices.indexOf(selected) + 1) % choices.length];
        previousBattle = selected;
        return selected;
    };
}(window));
