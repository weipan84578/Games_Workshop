(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    var Audio = cg.Audio = {};
    var state = { context: null, master: null, bgmInput: null, bgmCompressor: null, sfx: null, ready: false, currentTrack: null, activeSfx: 0, bgmPaused: false, bgmTimer: null };

    Audio.state = state;
    Audio.init = function () {
        if (state.ready) {
            if (state.context && state.context.state === "suspended") state.context.resume();
            return true;
        }
        var Context = root.AudioContext || root.webkitAudioContext;
        if (!Context) return false;
        try {
            state.context = new Context();
            state.master = state.context.createGain();
            state.bgmInput = state.context.createGain();
            state.bgmCompressor = state.context.createDynamicsCompressor();
            state.sfx = state.context.createGain();
            state.bgmCompressor.threshold.value = -18;
            state.bgmCompressor.knee.value = 18;
            state.bgmCompressor.ratio.value = 12;
            state.bgmCompressor.attack.value = .004;
            state.bgmCompressor.release.value = .22;
            state.bgmInput.connect(state.bgmCompressor);
            state.bgmCompressor.connect(state.master);
            state.sfx.connect(state.master);
            state.master.connect(state.context.destination);
            state.ready = true;
            Audio.applySettings(root.GameState.settings);
            if (state.context.state === "suspended") state.context.resume();
            return true;
        } catch (error) {
            console.warn("Audio initialization unavailable", error);
            state.ready = false;
            return false;
        }
    };
    Audio.ensure = function () { return Audio.init(); };
    Audio.applySettings = function (settings) {
        if (!state.ready || !settings) return;
        var now = state.context.currentTime;
        var muted = settings.mute ? 0 : 1;
        var master = settings.masterVolume * muted;
        var bgm = settings.bgmEnabled ? settings.bgmVolume * 10 * muted : 0;
        var sfx = settings.sfxEnabled ? settings.sfxVolume * muted : 0;
        state.master.gain.setTargetAtTime(cg.Utils.clamp(master, 0, 1), now, .025);
        state.bgmInput.gain.setTargetAtTime(cg.Utils.clamp(bgm, 0, 10), now, .06);
        state.sfx.gain.setTargetAtTime(cg.Utils.clamp(sfx, 0, 1), now, .025);
    };
    Audio.effectiveBgmGain = function () { return (root.GameState.settings.bgmVolume || 0) * 10; };
    Audio.setPaused = function (paused) {
        state.bgmPaused = paused;
        if (!state.ready) return;
        state.bgmInput.gain.setTargetAtTime(paused ? 0.06 : cg.Utils.clamp(root.GameState.settings.bgmVolume * 10, 0, 10), state.context.currentTime, .1);
    };
    Audio.startBgm = function (track) {
        if (!Audio.ensure()) return;
        if (state.currentTrack === track && state.bgmTimer) return;
        Audio.stopBgm();
        state.currentTrack = track;
        if (cg.Bgm && cg.Bgm.start) cg.Bgm.start(track);
    };
    Audio.stopBgm = function () {
        if (state.bgmTimer) { clearTimeout(state.bgmTimer); state.bgmTimer = null; }
        state.currentTrack = null;
    };
    Audio.playBgmNote = function (frequency, duration, velocity, wave) {
        if (!state.ready || state.bgmPaused || !root.GameState.settings.bgmEnabled || root.GameState.settings.mute) return;
        Audio.playTone(frequency, duration, velocity || .035, wave || "sine", state.bgmInput, true);
    };
    Audio.playTone = function (frequency, duration, volume, wave, destination, isBgm) {
        if (!state.ready || (!isBgm && state.activeSfx >= cg.Constants.MAX_SIMULTANEOUS_SFX)) return;
        var ctx = state.context;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var start = ctx.currentTime + .005;
        var finish = start + Math.max(.04, duration || .1);
        var target = destination || state.sfx;
        var pitch = isBgm ? 1 : cg.Utils.rand(.95, 1.05);
        osc.type = wave || "triangle";
        osc.frequency.setValueAtTime(frequency * pitch, start);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume || .03), start + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, finish);
        osc.connect(gain);
        gain.connect(target);
        if (!isBgm) state.activeSfx += 1;
        osc.start(start);
        osc.stop(finish + .03);
        osc.addEventListener("ended", function () { if (!isBgm) state.activeSfx = Math.max(0, state.activeSfx - 1); osc.disconnect(); gain.disconnect(); });
    };
    Audio.playSfx = function (name, intensity) { if (cg.Sfx && cg.Sfx.play) cg.Sfx.play(name, intensity); };
    Audio.startForScreen = function (screen) {
        var track = screen === "MAIN_MENU" ? "menu" : screen === "RESULT_WIN" ? "victory" : screen === "RESULT_LOSE" ? "defeat" : screen === "HELP" || screen === "SETTINGS" ? "relax" : "battle";
        Audio.startBgm(track);
    };
}(window));
