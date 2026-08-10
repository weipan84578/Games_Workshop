(function (global) {
  "use strict";
  var CCC = global.CCC;
  var context = null;
  var bgmGain = null;
  var sfxGain = null;
  var currentTrack = null;
  var scheduler = null;
  var nextNoteAt = 0;
  var noteIndex = 0;
  var activeSounds = 0;
  var warned = false;

  function audioContext() {
    var Constructor = global.AudioContext || global.webkitAudioContext;
    if (!Constructor) { return null; }
    return new Constructor();
  }

  function volumeGain(percent) {
    if (percent <= 0) { return 0; }
    return Math.pow(percent / 100, 1.65) * 0.72;
  }

  function updateVolumes() {
    if (!context) { return; }
    var pref = CCC.state.preferences;
    var muted = pref.muted;
    bgmGain.gain.setTargetAtTime(muted ? 0 : volumeGain(pref.bgmVolume) * .32, context.currentTime, .025);
    sfxGain.gain.setTargetAtTime(muted ? 0 : volumeGain(pref.sfxVolume), context.currentTime, .02);
  }

  function pianoTone(frequency, start, duration, destination, gain) {
    if (!context || !frequency) { return; }
    var oscillator = context.createOscillator();
    var overtone = context.createOscillator();
    var voiceGain = context.createGain();
    oscillator.type = "triangle";
    overtone.type = "sine";
    oscillator.frequency.value = frequency;
    overtone.frequency.value = frequency * 2.01;
    voiceGain.gain.setValueAtTime(.0001, start);
    voiceGain.gain.exponentialRampToValueAtTime(Math.max(.001, gain), start + .014);
    voiceGain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(voiceGain);
    overtone.connect(voiceGain);
    voiceGain.connect(destination);
    oscillator.start(start);
    overtone.start(start);
    oscillator.stop(start + duration + .02);
    overtone.stop(start + duration + .02);
  }

  function scheduleMusic() {
    if (!context || !currentTrack || context.state !== "running") { return; }
    var track = CCC.audioData.tracks[currentTrack];
    var beat = 60 / track.tempo;
    while (nextNoteAt < context.currentTime + 1.1) {
      var melodyName = track.melody[noteIndex % track.melody.length];
      pianoTone(CCC.audioData.noteFrequencies[melodyName], nextNoteAt, beat * .82, bgmGain, .12);
      if (noteIndex % 2 === 0) {
        var bassName = track.bass[(noteIndex / 2) % track.bass.length];
        pianoTone(CCC.audioData.noteFrequencies[bassName], nextNoteAt, beat * 1.65, bgmGain, .075);
      }
      nextNoteAt += beat / 2;
      noteIndex += 1;
    }
  }

  function startScheduler() {
    if (scheduler) { clearInterval(scheduler); }
    scheduler = setInterval(scheduleMusic, 350);
    scheduleMusic();
  }

  CCC.audio = {
    initFromGesture: function () {
      try {
        if (!context) {
          context = audioContext();
          if (!context) { throw new Error("AudioContext unavailable"); }
          bgmGain = context.createGain();
          sfxGain = context.createGain();
          bgmGain.connect(context.destination);
          sfxGain.connect(context.destination);
          updateVolumes();
        }
        if (context.state === "suspended") { context.resume().catch(function () {}); }
        this.setTrack(currentTrack || "morning");
        return true;
      } catch (_) {
        if (!warned) { warned = true; CCC.events.emit("audioerror"); }
        return false;
      }
    },
    setTrack: function (trackId) {
      if (!CCC.audioData.tracks[trackId]) { return; }
      if (!context) { currentTrack = trackId; return; }
      if (currentTrack === trackId && scheduler) { return; }
      currentTrack = trackId;
      noteIndex = 0;
      nextNoteAt = context.currentTime + .8;
      bgmGain.gain.cancelScheduledValues(context.currentTime);
      bgmGain.gain.setValueAtTime(bgmGain.gain.value, context.currentTime);
      bgmGain.gain.linearRampToValueAtTime(0.0001, context.currentTime + .35);
      setTimeout(function () { updateVolumes(); startScheduler(); }, 380);
    },
    play: function (id) {
      if (!context || context.state !== "running" || activeSounds >= CCC.config.maxSounds) { return; }
      var sound = CCC.audioData.sfx[id];
      if (!sound) { return; }
      activeSounds += 1;
      var start = context.currentTime;
      sound.notes.forEach(function (frequency, index) {
        var oscillator = context.createOscillator();
        var gain = context.createGain();
        var at = start + index * sound.duration * .68;
        oscillator.type = sound.type;
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(.0001, at);
        gain.gain.exponentialRampToValueAtTime(sound.gain, at + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, at + sound.duration);
        oscillator.connect(gain);
        gain.connect(sfxGain);
        oscillator.start(at);
        oscillator.stop(at + sound.duration + .015);
      });
      setTimeout(function () { activeSounds = Math.max(0, activeSounds - 1); }, Math.ceil(sound.duration * sound.notes.length * 1000 + 100));
    },
    updateVolumes: updateVolumes,
    suspend: function () { if (context && context.state === "running") { context.suspend().catch(function () {}); } },
    resume: function () { if (context && context.state === "suspended") { context.resume().then(scheduleMusic).catch(function () {}); } },
    stop: function () {
      if (scheduler) { clearInterval(scheduler); scheduler = null; }
      currentTrack = null;
      if (bgmGain && context) { bgmGain.gain.setTargetAtTime(0, context.currentTime, .04); }
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
