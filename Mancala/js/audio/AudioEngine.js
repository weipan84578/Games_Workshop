(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AudioEngine(settings) {
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isInitialized = false;
    this.settings = settings || {};
    this.musicTimer = null;
    this.musicNoteIndex = 0;
    this.currentTrack = null;
    this.pendingTrack = null;
  }

  AudioEngine.prototype.init = function() {
    if (this.isInitialized) {
      if (this.context && this.context.state === "suspended") {
        this.context.resume();
      }
      return;
    }

    var AudioContext = global.AudioContext || global.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    this.isInitialized = true;
    this.applySettings(this.settings);

    if (this.pendingTrack) {
      this.startMusic(this.pendingTrack);
      this.pendingTrack = null;
    }
  };

  AudioEngine.prototype.applySettings = function(settings) {
    this.settings = settings || this.settings || {};
    if (!this.isInitialized) {
      return;
    }
    var now = this.context.currentTime;
    this.musicGain.gain.setTargetAtTime(this.settings.isMusicMuted ? 0 : this.settings.musicVolume, now, 0.04);
    this.sfxGain.gain.setTargetAtTime(this.settings.isSfxMuted ? 0 : this.settings.sfxVolume, now, 0.04);
  };

  AudioEngine.prototype.play = function(soundId) {
    if (this.settings.isSfxMuted) {
      return;
    }
    this.init();
    if (!this.isInitialized) {
      return;
    }
    var pattern = Mancala.SoundEffects[soundId];
    if (!pattern) {
      return;
    }
    for (var i = 0; i < pattern.length; i += 1) {
      this.playTone(pattern[i]);
    }
  };

  AudioEngine.prototype.playTone = function(note) {
    var start = this.context.currentTime + (note.offset || 0);
    var duration = note.duration || 0.1;
    var osc = this.context.createOscillator();
    var gain = this.context.createGain();
    osc.type = note.type || "sine";
    osc.frequency.setValueAtTime(note.freq, start);
    if (note.end) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, note.end), start + duration);
    }
    gain.gain.setValueAtTime(note.gain || 0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  AudioEngine.prototype.switchMusic = function(trackId) {
    this.currentTrack = trackId || null;
    if (!this.isInitialized) {
      this.pendingTrack = trackId || null;
      return;
    }
    this.stopMusic();
    if (trackId && !this.settings.isMusicMuted) {
      this.startMusic(trackId);
    }
  };

  AudioEngine.prototype.startMusic = function(trackId) {
    var track = Mancala.MusicTracks[trackId];
    if (!track) {
      return;
    }
    var self = this;
    this.currentTrack = trackId;
    this.musicNoteIndex = 0;
    var beatMs = Math.max(180, Math.floor(60000 / track.bpm));

    this.musicTimer = global.setInterval(function() {
      if (!self.isInitialized || self.settings.isMusicMuted) {
        return;
      }
      var note = track.notes[self.musicNoteIndex % track.notes.length];
      self.playMusicNote(note, track);
      self.musicNoteIndex += 1;
    }, beatMs);
  };

  AudioEngine.prototype.playMusicNote = function(freq, track) {
    var start = this.context.currentTime;
    var duration = 0.28;
    var osc = this.context.createOscillator();
    var gain = this.context.createGain();
    osc.type = track.type || "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(track.gain || 0.05, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  AudioEngine.prototype.stopMusic = function() {
    if (this.musicTimer) {
      global.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  };

  Mancala.AudioEngine = AudioEngine;
})(window);
