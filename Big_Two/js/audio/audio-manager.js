(function (global) {
  "use strict";

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var AudioNS = BigTwo.Audio = BigTwo.Audio || {};
  var MASTER_CEILING = Math.pow(10, -1 / 20);
  var CROSSFADE_SECONDS = 0.65;

  function clamp(value, minimum, maximum) {
    var number = Number(value);
    if (!Number.isFinite(number)) {
      number = minimum;
    }
    return Math.min(maximum, Math.max(minimum, number));
  }

  function volumeToGain(value) {
    return clamp(value, 0, 100) / 100;
  }

  function midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function safeConnect(source, destination) {
    if (source && destination && typeof source.connect === "function") {
      source.connect(destination);
    }
    return destination;
  }

  function safeDisconnect(node) {
    if (node && typeof node.disconnect === "function") {
      try {
        node.disconnect();
      } catch (error) {
        // Disconnect is best-effort across browser and fake node implementations.
      }
    }
  }

  function setDirectValue(parameter, value) {
    if (parameter) {
      parameter.value = value;
    }
  }

  function setParamAt(parameter, value, time) {
    if (!parameter) {
      return;
    }
    if (typeof parameter.setValueAtTime === "function") {
      parameter.setValueAtTime(value, time);
    } else {
      parameter.value = value;
    }
  }

  function rampParam(parameter, value, context, seconds) {
    if (!parameter) {
      return;
    }
    var now = context && Number.isFinite(context.currentTime) ? context.currentTime : 0;
    var current = Number.isFinite(parameter.value) ? parameter.value : value;
    if (typeof parameter.cancelScheduledValues === "function") {
      parameter.cancelScheduledValues(now);
    }
    setParamAt(parameter, current, now);
    if (seconds > 0 && typeof parameter.linearRampToValueAtTime === "function") {
      parameter.linearRampToValueAtTime(value, now + seconds);
    } else {
      setParamAt(parameter, value, now);
    }
  }

  function stopSource(source, when) {
    if (source && typeof source.stop === "function") {
      try {
        source.stop(when);
      } catch (error) {
        // An already-stopped oscillator is harmless.
      }
    }
  }

  function AudioManager(options) {
    options = options || {};

    var NativeAudioContext = global.AudioContext || global.webkitAudioContext;
    this._contextFactory = options.audioContextFactory || (NativeAudioContext ? function () {
      return new NativeAudioContext();
    } : null);
    this._providedContext = options.context || null;
    this._document = options.document || global.document || null;
    this._onWarning = typeof options.onWarning === "function" ? options.onWarning : null;

    this.context = null;
    this.available = Boolean(this._providedContext || this._contextFactory);
    this.unlocked = false;
    this.disabledReason = this.available ? null : "unsupported";
    this.musicEnabled = true;
    this.musicVolume = 40;
    this.sfxEnabled = true;
    this.sfxVolume = 70;
    this.musicTrack = "auto";

    this.musicVolumeGain = null;
    this.musicGain = null;
    this.musicGainNode = null;
    this.boostGain = null;
    this.boostGainNode = null;
    this.compressor = null;
    this.compressorNode = null;
    this.masterGain = null;
    this.masterGainNode = null;
    this.sfxGain = null;
    this.sfxGainNode = null;

    this._graphReady = false;
    this._unlockPromise = null;
    this._musicRequested = true;
    this._activeTracks = [];
    this._rotationTimer = null;
    this._currentTrackId = null;
    this._lastTrackId = null;
    this._activeSfxTotal = 0;
    this._activeSfxByName = Object.create(null);
    this._lastSfxAt = Object.create(null);
    this._sfxCleanupTimers = new Set();
    this._warningShown = false;
    this._wasPlayingBeforeHidden = false;
    this._gestureTarget = null;
    this._boundGesture = null;
    this._boundVisibility = null;
  }

  AudioManager.volumeToGain = volumeToGain;
  AudioManager.MASTER_CEILING = MASTER_CEILING;
  AudioManager.CROSSFADE_SECONDS = CROSSFADE_SECONDS;

  AudioManager.prototype.init = function (settings, gestureTarget) {
    this.setSettings(settings || {});
    this.bindUserGesture(gestureTarget || this._document);
    this._bindVisibility();
    return this;
  };

  AudioManager.prototype.setSettings = function (settings) {
    settings = settings || {};
    if (Object.prototype.hasOwnProperty.call(settings, "musicVolume")) {
      this.setMusicVolume(settings.musicVolume);
    } else if (Object.prototype.hasOwnProperty.call(settings, "bgmVolume")) {
      this.setMusicVolume(settings.bgmVolume);
    }
    if (Object.prototype.hasOwnProperty.call(settings, "sfxVolume")) {
      this.setSfxVolume(settings.sfxVolume);
    } else if (Object.prototype.hasOwnProperty.call(settings, "soundVolume")) {
      this.setSfxVolume(settings.soundVolume);
    }
    if (Object.prototype.hasOwnProperty.call(settings, "musicTrack")) {
      this.setTrack(settings.musicTrack);
    } else if (Object.prototype.hasOwnProperty.call(settings, "bgmTrack")) {
      this.setTrack(settings.bgmTrack);
    }
    if (Object.prototype.hasOwnProperty.call(settings, "musicEnabled")) {
      this.setMusicEnabled(settings.musicEnabled);
    } else if (Object.prototype.hasOwnProperty.call(settings, "bgmEnabled")) {
      this.setMusicEnabled(settings.bgmEnabled);
    }
    if (Object.prototype.hasOwnProperty.call(settings, "sfxEnabled")) {
      this.setSfxEnabled(settings.sfxEnabled);
    } else if (Object.prototype.hasOwnProperty.call(settings, "soundEnabled")) {
      this.setSfxEnabled(settings.soundEnabled);
    }
    return this;
  };

  AudioManager.prototype.bindUserGesture = function (target) {
    if (!target || typeof target.addEventListener !== "function" || this._boundGesture) {
      return this;
    }
    var manager = this;
    this._gestureTarget = target;
    this._boundGesture = function (event) {
      if (event && event.type === "keydown" && (event.repeat || event.ctrlKey || event.metaKey || event.altKey)) {
        return;
      }
      manager.unlock();
      manager._unbindUserGesture();
    };
    target.addEventListener("pointerdown", this._boundGesture, { passive: true, capture: true });
    target.addEventListener("keydown", this._boundGesture, { capture: true });
    return this;
  };

  AudioManager.prototype._unbindUserGesture = function () {
    if (!this._gestureTarget || !this._boundGesture) {
      return;
    }
    this._gestureTarget.removeEventListener("pointerdown", this._boundGesture, true);
    this._gestureTarget.removeEventListener("keydown", this._boundGesture, true);
    this._gestureTarget = null;
    this._boundGesture = null;
  };

  AudioManager.prototype._bindVisibility = function () {
    if (!this._document || this._boundVisibility || typeof this._document.addEventListener !== "function") {
      return;
    }
    var manager = this;
    this._boundVisibility = function () {
      manager._handleVisibilityChange();
    };
    this._document.addEventListener("visibilitychange", this._boundVisibility);
  };

  AudioManager.prototype._handleVisibilityChange = function () {
    if (!this.context || !this._document) {
      return;
    }
    if (this._document.hidden) {
      this._wasPlayingBeforeHidden = this._musicRequested && this.musicEnabled && this._activeTracks.length > 0;
      this._clearMusic(0.08);
      if (typeof this.context.suspend === "function") {
        try {
          this.context.suspend();
        } catch (error) {
          // Suspending is an optional power-saving step.
        }
      }
      return;
    }

    var manager = this;
    var resumeResult = typeof this.context.resume === "function" ? this.context.resume() : null;
    Promise.resolve(resumeResult).then(function () {
      if (manager._wasPlayingBeforeHidden && manager.musicEnabled) {
        manager._musicRequested = true;
        manager.startMusic();
      }
      manager._wasPlayingBeforeHidden = false;
    }).catch(function () {
      manager._degrade("resume-failed");
    });
  };

  AudioManager.prototype.unlock = function () {
    var manager = this;
    if (!this.available) {
      return Promise.resolve(false);
    }
    if (this.unlocked && this.context && this.context.state !== "closed") {
      if (this._musicRequested && this.musicEnabled && this._activeTracks.length === 0) {
        this.startMusic();
      }
      return Promise.resolve(true);
    }
    if (this._unlockPromise) {
      return this._unlockPromise;
    }

    try {
      this.context = this.context || this._providedContext || this._contextFactory();
      this._buildGraph();
    } catch (error) {
      this._degrade("context-failed", error);
      return Promise.resolve(false);
    }

    var resumeResult;
    try {
      resumeResult = typeof this.context.resume === "function" ? this.context.resume() : null;
    } catch (error) {
      this._degrade("resume-failed", error);
      return Promise.resolve(false);
    }

    this._unlockPromise = Promise.resolve(resumeResult).then(function () {
      manager.unlocked = manager.context && manager.context.state !== "closed";
      manager._unlockPromise = null;
      if (!manager.unlocked) {
        manager._degrade("context-closed");
        return false;
      }
      manager._emitChange("unlocked");
      if (manager._musicRequested && manager.musicEnabled) {
        manager._showVolumeWarningOnce();
        manager.startMusic();
      }
      return true;
    }).catch(function (error) {
      manager._unlockPromise = null;
      manager._degrade("resume-failed", error);
      return false;
    });

    return this._unlockPromise;
  };

  AudioManager.prototype.resume = function () {
    return this.unlock();
  };

  AudioManager.prototype._buildGraph = function () {
    if (this._graphReady) {
      return;
    }
    var context = this.context;
    if (!context || typeof context.createGain !== "function" || !context.destination) {
      throw new Error("Web Audio graph is unavailable");
    }

    this.musicVolumeGain = context.createGain();
    this.musicGain = this.musicVolumeGain;
    this.musicGainNode = this.musicVolumeGain;
    this.boostGain = context.createGain();
    this.boostGainNode = this.boostGain;
    this.compressor = typeof context.createDynamicsCompressor === "function" ? context.createDynamicsCompressor() : context.createGain();
    this.compressorNode = this.compressor;
    this.masterGain = context.createGain();
    this.masterGainNode = this.masterGain;
    this.sfxGain = context.createGain();
    this.sfxGainNode = this.sfxGain;

    setDirectValue(this.musicVolumeGain.gain, this.musicEnabled ? volumeToGain(this.musicVolume) : 0);
    setDirectValue(this.boostGain.gain, 10.0);
    setDirectValue(this.masterGain.gain, MASTER_CEILING);
    setDirectValue(this.sfxGain.gain, this.sfxEnabled ? volumeToGain(this.sfxVolume) : 0);

    if (this.compressor.threshold) { setDirectValue(this.compressor.threshold, -20); }
    if (this.compressor.knee) { setDirectValue(this.compressor.knee, 8); }
    if (this.compressor.ratio) { setDirectValue(this.compressor.ratio, 20); }
    if (this.compressor.attack) { setDirectValue(this.compressor.attack, 0.002); }
    if (this.compressor.release) { setDirectValue(this.compressor.release, 0.18); }

    // Required BGM order: source -> volume -> fixed 10x boost -> compressor -> safe master -> destination.
    safeConnect(this.musicVolumeGain, this.boostGain);
    safeConnect(this.boostGain, this.compressor);
    safeConnect(this.compressor, this.masterGain);
    safeConnect(this.sfxGain, this.masterGain);
    safeConnect(this.masterGain, context.destination);
    this._graphReady = true;
  };

  AudioManager.prototype.setMusicVolume = function (value) {
    var previous = this.musicVolume;
    this.musicVolume = clamp(value, 0, 100);
    if (this.musicVolumeGain && this.context) {
      rampParam(this.musicVolumeGain.gain, this.musicEnabled ? volumeToGain(this.musicVolume) : 0, this.context, 0.04);
    }
    if (this.musicEnabled && (this.musicVolume - previous >= 25)) {
      this._showVolumeWarningOnce();
    }
    return this.musicVolume;
  };

  AudioManager.prototype.setBgmVolume = AudioManager.prototype.setMusicVolume;

  AudioManager.prototype.setSfxVolume = function (value) {
    this.sfxVolume = clamp(value, 0, 100);
    if (this.sfxGain && this.context) {
      rampParam(this.sfxGain.gain, this.sfxEnabled ? volumeToGain(this.sfxVolume) : 0, this.context, 0.035);
    }
    return this.sfxVolume;
  };

  AudioManager.prototype.setSoundVolume = AudioManager.prototype.setSfxVolume;

  AudioManager.prototype.setMusicEnabled = function (enabled) {
    var wasEnabled = this.musicEnabled;
    this.musicEnabled = Boolean(enabled);
    this._musicRequested = this.musicEnabled;
    if (this.musicVolumeGain && this.context) {
      rampParam(this.musicVolumeGain.gain, this.musicEnabled ? volumeToGain(this.musicVolume) : 0, this.context, 0.05);
    }
    if (!this.musicEnabled) {
      this.stopMusic();
    } else if (this.unlocked) {
      if (!wasEnabled) {
        this._showVolumeWarningOnce();
      }
      this.startMusic();
    }
    return this.musicEnabled;
  };

  AudioManager.prototype.setBgmEnabled = AudioManager.prototype.setMusicEnabled;
  AudioManager.prototype.setMusicMuted = function (muted) {
    return this.setMusicEnabled(!muted);
  };

  AudioManager.prototype.setSfxEnabled = function (enabled) {
    this.sfxEnabled = Boolean(enabled);
    if (this.sfxGain && this.context) {
      rampParam(this.sfxGain.gain, this.sfxEnabled ? volumeToGain(this.sfxVolume) : 0, this.context, 0.035);
    }
    return this.sfxEnabled;
  };

  AudioManager.prototype.setSoundEnabled = AudioManager.prototype.setSfxEnabled;
  AudioManager.prototype.setSfxMuted = function (muted) {
    return this.setSfxEnabled(!muted);
  };

  AudioManager.prototype.setTrack = function (trackId) {
    var normalized = trackId || "auto";
    if (["auto", "track1", "track2", "track3", "track4"].indexOf(normalized) === -1) {
      normalized = "auto";
    }
    var changed = normalized !== this.musicTrack;
    this.musicTrack = normalized;
    if (changed && this.unlocked && this.musicEnabled && this._musicRequested) {
      var nextId = normalized === "auto" ? this._chooseNextTrackId() : normalized;
      this._beginTrack(nextId);
    }
    return this.musicTrack;
  };

  AudioManager.prototype.setMusicTrack = AudioManager.prototype.setTrack;

  AudioManager.prototype._musicLibrary = function () {
    return AudioNS.MusicLibrary || null;
  };

  AudioManager.prototype._chooseNextTrackId = function () {
    var library = this._musicLibrary();
    if (!library || !library.ids || library.ids.length === 0) {
      return null;
    }
    if (!this._currentTrackId) {
      return library.ids[0];
    }
    var nextId = library.getNextTrackId(this._currentTrackId);
    if (nextId === this._currentTrackId && library.ids.length > 1) {
      nextId = library.ids[(library.ids.indexOf(nextId) + 1) % library.ids.length];
    }
    return nextId;
  };

  AudioManager.prototype.startMusic = function (trackId) {
    this._musicRequested = true;
    if (trackId) {
      this.musicTrack = trackId;
    }
    if (!this.musicEnabled || !this.available) {
      return false;
    }
    if (!this.unlocked || !this.context) {
      return false;
    }
    if (this.context.state === "suspended" && typeof this.context.resume === "function") {
      var manager = this;
      Promise.resolve(this.context.resume()).then(function () {
        if (manager._musicRequested && manager.musicEnabled && manager._activeTracks.length === 0) {
          manager.startMusic(trackId);
        }
      }).catch(function () {
        manager._degrade("resume-failed");
      });
      return true;
    }
    if (this._activeTracks.length > 0 && !trackId) {
      return true;
    }
    var selectedId = trackId || (this.musicTrack === "auto" ? this._chooseNextTrackId() : this.musicTrack);
    return this._beginTrack(selectedId);
  };

  AudioManager.prototype.playMusic = AudioManager.prototype.startMusic;

  AudioManager.prototype._beginTrack = function (trackId) {
    var library = this._musicLibrary();
    var track = library && library.getTrack(trackId);
    if (!track || !this.context || typeof this.context.createOscillator !== "function") {
      return false;
    }

    var context = this.context;
    var startAt = context.currentTime + 0.045;
    var active = this._createTrackGraph(track, startAt);
    if (!active) {
      return false;
    }

    var previousTracks = this._activeTracks.slice();
    this._activeTracks.push(active);
    this._lastTrackId = this._currentTrackId;
    this._currentTrackId = track.id;

    previousTracks.forEach(function (previous) {
      this._fadeOutTrack(previous, CROSSFADE_SECONDS);
    }, this);

    if (this._rotationTimer) {
      global.clearTimeout(this._rotationTimer);
    }
    var manager = this;
    var delayMs = Math.max(1000, (track.durationSeconds - CROSSFADE_SECONDS) * 1000);
    this._rotationTimer = global.setTimeout(function () {
      manager._rotationTimer = null;
      if (!manager._musicRequested || !manager.musicEnabled || !manager.unlocked) {
        return;
      }
      var nextId = manager.musicTrack === "auto" ? manager._chooseNextTrackId() : manager.musicTrack;
      manager._beginTrack(nextId);
    }, delayMs);
    return true;
  };

  AudioManager.prototype._createTrackGraph = function (track, startAt) {
    var context = this.context;
    var bus = context.createGain();
    var active = {
      id: track.id,
      bus: bus,
      sources: new Set(),
      nodes: [],
      cleanupTimer: null
    };

    setParamAt(bus.gain, 0.0001, context.currentTime);
    if (typeof bus.gain.exponentialRampToValueAtTime === "function") {
      bus.gain.exponentialRampToValueAtTime(1, startAt + CROSSFADE_SECONDS);
    } else {
      rampParam(bus.gain, 1, context, CROSSFADE_SECONDS);
    }
    safeConnect(bus, this.musicVolumeGain);

    var reverbInput = null;
    if (typeof context.createConvolver === "function" && typeof context.createBuffer === "function") {
      try {
        var convolver = context.createConvolver();
        convolver.buffer = this._createImpulseResponse();
        var wetGain = context.createGain();
        setDirectValue(wetGain.gain, 0.16);
        safeConnect(convolver, wetGain);
        safeConnect(wetGain, bus);
        reverbInput = convolver;
        active.nodes.push(convolver, wetGain);
      } catch (error) {
        reverbInput = null;
      }
    }

    var secondsPerBeat = 60 / track.bpm;
    for (var i = 0; i < track.notes.length; i += 1) {
      var note = track.notes[i];
      this._schedulePianoNote(active, note, startAt + note.beat * secondsPerBeat, note.duration * secondsPerBeat, bus, reverbInput);
    }
    return active;
  };

  AudioManager.prototype._createImpulseResponse = function () {
    var context = this.context;
    var sampleRate = context.sampleRate || 44100;
    var length = Math.floor(sampleRate * 1.35);
    var impulse = context.createBuffer(2, length, sampleRate);
    var seed = 2463534242;
    for (var channel = 0; channel < 2; channel += 1) {
      var data = impulse.getChannelData(channel);
      for (var i = 0; i < length; i += 1) {
        seed = (1664525 * seed + 1013904223) >>> 0;
        var noise = (seed / 4294967296) * 2 - 1;
        data[i] = noise * Math.pow(1 - i / length, 2.8) * 0.48;
      }
    }
    return impulse;
  };

  AudioManager.prototype._schedulePianoNote = function (active, note, startAt, duration, bus, reverbInput) {
    var context = this.context;
    var oscillator = context.createOscillator();
    var partial = context.createOscillator();
    var envelope = context.createGain();
    var partialGain = context.createGain();
    var filter = typeof context.createBiquadFilter === "function" ? context.createBiquadFilter() : null;
    var output = filter || bus;
    var releaseAt = startAt + Math.max(0.08, duration) + 0.58;
    var velocity = clamp(note.velocity, 0.04, 0.55);

    oscillator.type = "triangle";
    partial.type = "sine";
    setDirectValue(oscillator.frequency, midiToFrequency(note.midi));
    setDirectValue(partial.frequency, midiToFrequency(note.midi + 12));
    setDirectValue(partialGain.gain, 0.17);

    setParamAt(envelope.gain, 0.0001, startAt);
    if (typeof envelope.gain.exponentialRampToValueAtTime === "function") {
      envelope.gain.exponentialRampToValueAtTime(velocity, startAt + 0.012);
      envelope.gain.exponentialRampToValueAtTime(Math.max(0.025, velocity * 0.34), startAt + 0.13);
      envelope.gain.exponentialRampToValueAtTime(0.0001, releaseAt);
    } else {
      setParamAt(envelope.gain, velocity, startAt + 0.012);
      setParamAt(envelope.gain, 0.0001, releaseAt);
    }

    safeConnect(oscillator, envelope);
    safeConnect(partial, partialGain);
    safeConnect(partialGain, envelope);
    if (filter) {
      filter.type = "lowpass";
      setDirectValue(filter.frequency, 2500 + note.velocity * 2600);
      if (filter.Q) { setDirectValue(filter.Q, 0.7); }
      safeConnect(envelope, filter);
      safeConnect(filter, bus);
      if (reverbInput) {
        safeConnect(filter, reverbInput);
      }
      active.nodes.push(filter);
    } else {
      safeConnect(envelope, bus);
    }

    active.sources.add(oscillator);
    active.sources.add(partial);
    active.nodes.push(envelope, partialGain);

    var finish = function (source) {
      active.sources.delete(source);
      safeDisconnect(source);
    };
    oscillator.onended = function () { finish(oscillator); };
    partial.onended = function () { finish(partial); };
    oscillator.start(startAt);
    partial.start(startAt);
    oscillator.stop(releaseAt + 0.03);
    partial.stop(releaseAt + 0.03);
  };

  AudioManager.prototype._fadeOutTrack = function (active, seconds) {
    if (!active || active.cleanupTimer) {
      return;
    }
    rampParam(active.bus.gain, 0.0001, this.context, seconds);
    var manager = this;
    active.cleanupTimer = global.setTimeout(function () {
      manager._cleanupTrack(active);
    }, Math.max(0, seconds * 1000 + 80));
  };

  AudioManager.prototype._cleanupTrack = function (active) {
    if (!active) {
      return;
    }
    if (active.cleanupTimer) {
      global.clearTimeout(active.cleanupTimer);
      active.cleanupTimer = null;
    }
    active.sources.forEach(function (source) {
      stopSource(source, 0);
      safeDisconnect(source);
    });
    active.sources.clear();
    active.nodes.forEach(safeDisconnect);
    safeDisconnect(active.bus);
    var index = this._activeTracks.indexOf(active);
    if (index !== -1) {
      this._activeTracks.splice(index, 1);
    }
  };

  AudioManager.prototype._clearMusic = function (fadeSeconds) {
    if (this._rotationTimer) {
      global.clearTimeout(this._rotationTimer);
      this._rotationTimer = null;
    }
    var seconds = Number.isFinite(fadeSeconds) ? Math.max(0, fadeSeconds) : 0;
    this._activeTracks.slice().forEach(function (active) {
      if (seconds > 0) {
        this._fadeOutTrack(active, seconds);
      } else {
        this._cleanupTrack(active);
      }
    }, this);
  };

  AudioManager.prototype.stopMusic = function (fadeSeconds) {
    this._musicRequested = false;
    this._clearMusic(Number.isFinite(fadeSeconds) ? fadeSeconds : 0.18);
    return true;
  };

  AudioManager.prototype.nextTrack = function () {
    if (!this.unlocked || !this.musicEnabled) {
      return false;
    }
    var nextId = this._chooseNextTrackId();
    return this._beginTrack(nextId);
  };

  AudioManager.prototype.playSfx = function (name) {
    var library = AudioNS.SfxLibrary;
    var definition = library && library.get(name);
    var canonicalName = library && library.canonicalName(name);
    if (!definition || !this.unlocked || !this.context || !this.sfxEnabled || this.sfxVolume <= 0) {
      return false;
    }
    if (typeof this.context.createOscillator !== "function") {
      return false;
    }

    var now = this.context.currentTime;
    var lastAt = this._lastSfxAt[canonicalName];
    var activeForName = this._activeSfxByName[canonicalName] || 0;
    if ((Number.isFinite(lastAt) && now - lastAt < definition.minInterval) || activeForName >= definition.maxConcurrent || this._activeSfxTotal >= 8) {
      return false;
    }

    this._lastSfxAt[canonicalName] = now;
    this._activeSfxByName[canonicalName] = activeForName + 1;
    this._activeSfxTotal += 1;

    var manager = this;
    var remaining = definition.notes.length;
    var completed = false;
    var nodes = [];
    var sources = [];
    var latestEnd = 0;

    function finish() {
      if (completed) {
        return;
      }
      completed = true;
      manager._activeSfxByName[canonicalName] = Math.max(0, (manager._activeSfxByName[canonicalName] || 1) - 1);
      manager._activeSfxTotal = Math.max(0, manager._activeSfxTotal - 1);
      sources.forEach(safeDisconnect);
      nodes.forEach(safeDisconnect);
    }

    definition.notes.forEach(function (note) {
      var oscillator = manager.context.createOscillator();
      var envelope = manager.context.createGain();
      var filter = typeof manager.context.createBiquadFilter === "function" ? manager.context.createBiquadFilter() : null;
      var startAt = now + note.offset;
      var endAt = startAt + note.duration;
      latestEnd = Math.max(latestEnd, note.offset + note.duration);

      oscillator.type = note.type || "sine";
      setParamAt(oscillator.frequency, midiToFrequency(note.midi), startAt);
      if (Number.isFinite(note.endMidi)) {
        if (typeof oscillator.frequency.exponentialRampToValueAtTime === "function") {
          oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note.endMidi), endAt);
        } else {
          setParamAt(oscillator.frequency, midiToFrequency(note.endMidi), endAt);
        }
      }

      setParamAt(envelope.gain, 0.0001, startAt);
      if (typeof envelope.gain.exponentialRampToValueAtTime === "function") {
        envelope.gain.exponentialRampToValueAtTime(note.gain, startAt + Math.min(0.012, note.duration * 0.25));
        envelope.gain.exponentialRampToValueAtTime(0.0001, endAt);
      } else {
        setParamAt(envelope.gain, note.gain, startAt);
        setParamAt(envelope.gain, 0.0001, endAt);
      }

      safeConnect(oscillator, envelope);
      if (filter) {
        filter.type = "lowpass";
        setDirectValue(filter.frequency, definition.filter || 2400);
        if (filter.Q) { setDirectValue(filter.Q, 0.6); }
        safeConnect(envelope, filter);
        safeConnect(filter, manager.sfxGain);
        nodes.push(filter);
      } else {
        safeConnect(envelope, manager.sfxGain);
      }
      sources.push(oscillator);
      nodes.push(envelope);
      oscillator.onended = function () {
        remaining -= 1;
        if (remaining === 0) {
          finish();
        }
      };
      oscillator.start(startAt);
      oscillator.stop(endAt + 0.015);
    });

    var cleanupTimer = global.setTimeout(function () {
      manager._sfxCleanupTimers.delete(cleanupTimer);
      finish();
    }, (latestEnd + 0.12) * 1000);
    this._sfxCleanupTimers.add(cleanupTimer);
    return true;
  };

  AudioManager.prototype.playSound = AudioManager.prototype.playSfx;
  AudioManager.prototype.playEffect = AudioManager.prototype.playSfx;

  AudioManager.prototype._showVolumeWarningOnce = function () {
    if (this._warningShown || !this.musicEnabled || this.musicVolume <= 0) {
      return;
    }
    this._warningShown = true;
    if (this._onWarning) {
      this._onWarning({ type: "volume-warning", key: "audio.volumeWarning" });
    }
    if (this._document && typeof this._document.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      this._document.dispatchEvent(new global.CustomEvent("bigtwo:audio-warning", {
        detail: { key: "audio.volumeWarning" }
      }));
    }
  };

  AudioManager.prototype._emitChange = function (reason) {
    if (this._document && typeof this._document.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      this._document.dispatchEvent(new global.CustomEvent("bigtwo:audio-change", {
        detail: { available: this.available, unlocked: this.unlocked, reason: reason || null }
      }));
    }
  };

  AudioManager.prototype._degrade = function (reason, error) {
    this.available = false;
    this.unlocked = false;
    this.disabledReason = reason || "unavailable";
    this._clearMusic(0);
    this._emitChange(reason);
    if (error && global.console && typeof global.console.info === "function") {
      global.console.info("BigTwo audio disabled:", reason);
    }
  };

  AudioManager.prototype.destroy = function () {
    this._unbindUserGesture();
    if (this._document && this._boundVisibility) {
      this._document.removeEventListener("visibilitychange", this._boundVisibility);
    }
    this._boundVisibility = null;
    this._clearMusic(0);
    this._sfxCleanupTimers.forEach(function (timer) {
      global.clearTimeout(timer);
    });
    this._sfxCleanupTimers.clear();
    if (this.context && typeof this.context.close === "function" && this.context.state !== "closed") {
      try {
        this.context.close();
      } catch (error) {
        // Closing during page teardown is best-effort.
      }
    }
    this.context = null;
    this.unlocked = false;
    this._graphReady = false;
  };

  AudioNS.AudioManager = AudioManager;
  AudioNS.volumeToGain = volumeToGain;
  AudioNS.manager = AudioNS.manager || new AudioManager();

  AudioNS.init = function (settings, gestureTarget) { return AudioNS.manager.init(settings, gestureTarget); };
  AudioNS.unlock = function () { return AudioNS.manager.unlock(); };
  AudioNS.resume = AudioNS.unlock;
  AudioNS.setSettings = function (settings) { return AudioNS.manager.setSettings(settings); };
  AudioNS.setMusicEnabled = function (enabled) { return AudioNS.manager.setMusicEnabled(enabled); };
  AudioNS.setBgmEnabled = AudioNS.setMusicEnabled;
  AudioNS.setMusicVolume = function (value) { return AudioNS.manager.setMusicVolume(value); };
  AudioNS.setBgmVolume = AudioNS.setMusicVolume;
  AudioNS.setSfxEnabled = function (enabled) { return AudioNS.manager.setSfxEnabled(enabled); };
  AudioNS.setSoundEnabled = AudioNS.setSfxEnabled;
  AudioNS.setSfxVolume = function (value) { return AudioNS.manager.setSfxVolume(value); };
  AudioNS.setSoundVolume = AudioNS.setSfxVolume;
  AudioNS.setTrack = function (trackId) { return AudioNS.manager.setTrack(trackId); };
  AudioNS.startMusic = function (trackId) { return AudioNS.manager.startMusic(trackId); };
  AudioNS.stopMusic = function (fadeSeconds) { return AudioNS.manager.stopMusic(fadeSeconds); };
  AudioNS.playSfx = function (name) { return AudioNS.manager.playSfx(name); };
  AudioNS.playSound = AudioNS.playSfx;
  AudioNS.play = function (name) {
    return name ? AudioNS.manager.playSfx(name) : AudioNS.manager.startMusic();
  };
}(window));
