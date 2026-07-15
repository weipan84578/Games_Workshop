(function (Game) {
  "use strict";
  function AudioManager(getSettings, bus, options) {
    this.getSettings = getSettings;
    this.bus = bus;
    this.contextFactory = options && options.contextFactory;
    this.context = null;
    this.masterGain = null;
    this.bgmBoost = null;
    this.bgmUserGain = null;
    this.sfxUserGain = null;
    this.limiter = null;
    this.bgm = null;
    this.sfx = null;
    this.supported = Boolean(
      this.contextFactory || window.AudioContext || window.webkitAudioContext,
    );
    this.unlocked = false;
    this.backgrounded = false;
    this.pendingBgm = false;
    this.resumeAttempt = null;
    this.autoTrack = 0;
  }
  AudioManager.prototype.createContext = function () {
    var Factory =
      this.contextFactory || window.AudioContext || window.webkitAudioContext;
    if (!Factory) return false;
    try {
      this.context = new Factory();
      this.masterGain = this.context.createGain();
      this.bgmBoost = this.context.createGain();
      this.bgmUserGain = this.context.createGain();
      this.sfxUserGain = this.context.createGain();
      this.limiter = this.context.createDynamicsCompressor();
      this.limiter.threshold.value = -1;
      this.limiter.knee.value = 0;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.003;
      this.limiter.release.value = 0.18;
      this.bgmBoost.gain.value = Game.Constants.BGM_BOOST;
      this.bgmBoost.connect(this.bgmUserGain);
      this.bgmUserGain.connect(this.limiter);
      this.sfxUserGain.connect(this.masterGain);
      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.bgm = new Game.BgmPlayer(this.context, this.bgmBoost);
      this.sfx = new Game.SfxPlayer(this.context, this.sfxUserGain);
      this.applySettings();
      return true;
    } catch (error) {
      this.supported = false;
      return false;
    }
  };
  AudioManager.prototype.markUnlocked = function () {
    if (!this.context || this.context.state !== "running") return false;
    if (!this.unlocked && this.bus) this.bus.emit(Game.Events.AUDIO);
    this.unlocked = true;
    return true;
  };
  AudioManager.prototype.startPendingBgm = function () {
    if (
      !this.pendingBgm ||
      this.backgrounded ||
      !this.context ||
      this.context.state !== "running" ||
      !this.bgm
    )
      return false;
    var track = this.getSettings().audio.track;
    this.bgm.start(track === "auto" ? this.autoTrack : track);
    this.pendingBgm = false;
    return true;
  };
  AudioManager.prototype.requestResume = function () {
    var self = this;
    if (!this.context) return false;
    if (this.context.state === "running") {
      this.markUnlocked();
      this.startPendingBgm();
      return true;
    }
    if (!this.context.resume) return false;
    try {
      var attempt = this.context.resume();
      if (!attempt || typeof attempt.then !== "function") {
        this.markUnlocked();
        this.startPendingBgm();
        return true;
      }
      this.resumeAttempt = attempt;
      attempt.then(
        function () {
          if (self.resumeAttempt === attempt) self.resumeAttempt = null;
          self.markUnlocked();
          self.startPendingBgm();
        },
        function () {
          if (self.resumeAttempt === attempt) self.resumeAttempt = null;
        },
      );
      return true;
    } catch (error) {
      this.resumeAttempt = null;
      return false;
    }
  };
  AudioManager.prototype.ensure = function () {
    if (!this.supported) return false;
    if (!this.context && !this.createContext()) return false;
    if (this.context.state === "running") {
      this.markUnlocked();
      this.startPendingBgm();
    } else {
      this.requestResume();
    }
    return true;
  };
  AudioManager.prototype.gainFor = function (value) {
    return Math.pow(Game.Math.clamp(Number(value) || 0, 0, 100) / 100, 2);
  };
  AudioManager.prototype.applySettings = function () {
    if (!this.context) return;
    var settings = this.getSettings().audio;
    var master = settings.muted ? 0 : this.gainFor(settings.master);
    var bgm = this.gainFor(settings.bgm);
    var sfx = this.gainFor(settings.sfx);
    var now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(master, now + 0.05);
    this.bgmUserGain.gain.cancelScheduledValues(now);
    this.bgmUserGain.gain.linearRampToValueAtTime(bgm, now + 0.05);
    this.sfxUserGain.gain.cancelScheduledValues(now);
    this.sfxUserGain.gain.linearRampToValueAtTime(sfx, now + 0.05);
    if (this.bgm)
      this.bgm.setTrack(settings.track === "auto" ? this.autoTrack : settings.track);
  };
  AudioManager.prototype.setSettings = function () {
    if (this.context) this.applySettings();
  };
  AudioManager.prototype.setAutoTrack = function (track) {
    var next = Game.Math.clamp(Math.round(Number(track) || 0), 0, 2);
    if (next === this.autoTrack) return this.autoTrack;
    this.autoTrack = next;
    var settings = this.getSettings();
    if (
      this.bgm &&
      settings &&
      settings.audio &&
      settings.audio.track === "auto"
    )
      this.bgm.setTrack(this.autoTrack);
    return this.autoTrack;
  };
  AudioManager.prototype.startBgm = function () {
    this.pendingBgm = true;
    if (!this.ensure()) {
      this.pendingBgm = false;
      return false;
    }
    this.startPendingBgm();
    return true;
  };
  AudioManager.prototype.pauseBgm = function () {
    this.pendingBgm = false;
    if (this.bgm) this.bgm.pause();
    if (this.context) {
      var now = this.context.currentTime;
      this.bgmUserGain.gain.linearRampToValueAtTime(
        this.gainFor(this.getSettings().audio.bgm) * 0.18,
        now + 0.06,
      );
    }
  };
  AudioManager.prototype.resumeBgm = function () {
    if (!this.ensure()) return false;
    this.applySettings();
    this.bgm.start();
    return true;
  };
  AudioManager.prototype.stop = function () {
    this.pendingBgm = false;
    if (this.bgm) this.bgm.stop();
  };
  AudioManager.prototype.playSfx = function (name) {
    if (!this.ensure()) return false;
    if (this.context.state === "running") {
      this.sfx.play(name);
    } else if (this.resumeAttempt) {
      var self = this;
      this.resumeAttempt.then(
        function () {
          if (self.context.state === "running" && self.sfx) self.sfx.play(name);
        },
        function () {},
      );
    }
    return true;
  };
  AudioManager.prototype.previewBgm = function () {
    this.startBgm();
    window.setTimeout(
      function () {
        if (this.bgm) this.bgm.pause();
      }.bind(this),
      2800,
    );
  };
  AudioManager.prototype.previewSfx = function () {
    this.playSfx("collect");
  };
  AudioManager.prototype.onVisibility = function (hidden) {
    this.backgrounded = hidden;
    if (hidden) this.pauseBgm();
    else if (this.unlocked) this.startBgm();
  };
  Game.AudioManager = AudioManager;
})(window.DJGame);
