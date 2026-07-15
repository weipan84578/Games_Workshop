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
  AudioManager.prototype.ensure = function () {
    if (!this.supported) return false;
    if (!this.context && !this.createContext()) return false;
    if (this.context.state === "suspended" && this.context.resume)
      this.context.resume();
    if (!this.unlocked && this.bus) this.bus.emit(Game.Events.AUDIO);
    this.unlocked = true;
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
  };
  AudioManager.prototype.setSettings = function () {
    if (this.context) this.applySettings();
  };
  AudioManager.prototype.startBgm = function () {
    if (!this.ensure()) return false;
    var track = this.getSettings().audio.track;
    this.bgm.start(track === "auto" ? undefined : track);
    return true;
  };
  AudioManager.prototype.pauseBgm = function () {
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
    if (this.bgm) this.bgm.stop();
  };
  AudioManager.prototype.playSfx = function (name) {
    if (!this.ensure()) return false;
    this.sfx.play(name);
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
    else if (this.unlocked) this.stop();
  };
  Game.AudioManager = AudioManager;
})(window.DJGame);
