(function (global) {
  "use strict";

  function FakeParam(value) {
    this.value = typeof value === "number" ? value : 0;
    this.events = [];
  }
  FakeParam.prototype.cancelScheduledValues = function (time) {
    this.events.push({ type: "cancel", time: time });
  };
  FakeParam.prototype.setValueAtTime = function (value, time) {
    this.value = value;
    this.events.push({ type: "set", value: value, time: time });
  };
  FakeParam.prototype.linearRampToValueAtTime = function (value, time) {
    this.value = value;
    this.events.push({ type: "linear", value: value, time: time });
  };
  FakeParam.prototype.exponentialRampToValueAtTime = function (value, time) {
    this.value = value;
    this.events.push({ type: "exponential", value: value, time: time });
  };

  function FakeNode(type) {
    this.typeName = type;
    this.connections = [];
    this.disconnected = false;
  }
  FakeNode.prototype.connect = function (target) {
    this.connections.push(target);
    return target;
  };
  FakeNode.prototype.disconnect = function () {
    this.disconnected = true;
    this.connections.length = 0;
  };

  function FakeGain() {
    FakeNode.call(this, "gain");
    this.gain = new FakeParam(1);
  }
  FakeGain.prototype = Object.create(FakeNode.prototype);
  FakeGain.prototype.constructor = FakeGain;

  function FakeCompressor() {
    FakeNode.call(this, "compressor");
    this.threshold = new FakeParam(0);
    this.knee = new FakeParam(0);
    this.ratio = new FakeParam(1);
    this.attack = new FakeParam(0);
    this.release = new FakeParam(0);
  }
  FakeCompressor.prototype = Object.create(FakeNode.prototype);
  FakeCompressor.prototype.constructor = FakeCompressor;

  function FakeOscillator() {
    FakeNode.call(this, "oscillator");
    this.frequency = new FakeParam(440);
    this.detune = new FakeParam(0);
    this.startedAt = null;
    this.stoppedAt = null;
    this.onended = null;
  }
  FakeOscillator.prototype = Object.create(FakeNode.prototype);
  FakeOscillator.prototype.constructor = FakeOscillator;
  FakeOscillator.prototype.start = function (time) {
    this.startedAt = time;
  };
  FakeOscillator.prototype.stop = function (time) {
    this.stoppedAt = time;
  };

  function FakeFilter() {
    FakeNode.call(this, "filter");
    this.frequency = new FakeParam(350);
    this.Q = new FakeParam(1);
  }
  FakeFilter.prototype = Object.create(FakeNode.prototype);
  FakeFilter.prototype.constructor = FakeFilter;

  function FakeAudioContext() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = "suspended";
    this.destination = new FakeNode("destination");
    this.gains = [];
    this.compressors = [];
    this.oscillators = [];
    this.resumeCalls = 0;
  }
  FakeAudioContext.prototype.createGain = function () {
    var gain = new FakeGain();
    this.gains.push(gain);
    return gain;
  };
  FakeAudioContext.prototype.createDynamicsCompressor = function () {
    var compressor = new FakeCompressor();
    this.compressors.push(compressor);
    return compressor;
  };
  FakeAudioContext.prototype.createOscillator = function () {
    var oscillator = new FakeOscillator();
    this.oscillators.push(oscillator);
    return oscillator;
  };
  FakeAudioContext.prototype.createBiquadFilter = function () {
    return new FakeFilter();
  };
  FakeAudioContext.prototype.resume = function () {
    this.resumeCalls += 1;
    this.state = "running";
    return Promise.resolve();
  };
  FakeAudioContext.prototype.suspend = function () {
    this.state = "suspended";
    return Promise.resolve();
  };
  FakeAudioContext.prototype.close = function () {
    this.state = "closed";
    return Promise.resolve();
  };

  function createQuietManager(context) {
    var manager = new global.BigTwo.Audio.AudioManager({ context: context });
    manager.setMusicEnabled(false);
    return manager;
  }

  describe("Web Audio manager", function () {
    it("does not create or play an AudioContext before a valid user interaction", function () {
      var factoryCalls = 0;
      var manager = new global.BigTwo.Audio.AudioManager({
        audioContextFactory: function () {
          factoryCalls += 1;
          return new FakeAudioContext();
        },
        document: null
      });
      manager.init({ musicEnabled: true });
      assertEqual(factoryCalls, 0);
      assertTrue(!manager.unlocked);
      assertTrue(!manager.startMusic());
      assertEqual(factoryCalls, 0);
      manager.destroy();
    });

    it("uses the required 10x boost, compressor and safe master connection order", async function () {
      var context = new FakeAudioContext();
      var manager = createQuietManager(context);
      assertTrue(await manager.unlock());
      assertEqual(manager.boostGain.gain.value, 10.0);
      assertEqual(manager.musicVolumeGain.connections[0], manager.boostGain);
      assertEqual(manager.boostGain.connections[0], manager.compressor);
      assertEqual(manager.compressor.connections[0], manager.masterGain);
      assertEqual(manager.masterGain.connections[0], context.destination);
      assertTrue(manager.masterGain.gain.value < 1);
      assertTrue(manager.masterGain.gain.value > 0);
      manager.destroy();
    });

    it("maps displayed music volumes 0, 40 and 100 to linear gains", async function () {
      var context = new FakeAudioContext();
      var manager = createQuietManager(context);
      await manager.unlock();
      manager.musicEnabled = true;
      manager.setMusicVolume(0);
      assertEqual(manager.musicVolumeGain.gain.value, 0);
      manager.setMusicVolume(40);
      assertEqual(manager.musicVolumeGain.gain.value, 0.4);
      manager.setMusicVolume(100);
      assertEqual(manager.musicVolumeGain.gain.value, 1);
      manager.destroy();
    });

    it("mutes without overwriting the user's stored volume", async function () {
      var context = new FakeAudioContext();
      var manager = createQuietManager(context);
      await manager.unlock();
      manager.musicEnabled = true;
      manager.setMusicVolume(65);
      manager.setMusicEnabled(false);
      assertEqual(manager.musicVolume, 65);
      assertEqual(manager.musicVolumeGain.gain.value, 0);
      manager.destroy();
    });

    it("provides four distinct original 45–90 second piano sequences", function () {
      var tracks = global.BigTwo.Audio.MusicLibrary.tracks;
      assertEqual(tracks.length, 4);
      tracks.forEach(function (track) {
        assertTrue(track.bpm >= 96 && track.bpm <= 132);
        assertTrue(track.durationSeconds >= 45 && track.durationSeconds <= 90);
        assertTrue(track.notes.length > 100);
      });
      assertTrue(tracks[0].notes[0].midi !== tracks[1].notes[0].midi);
    });

    it("rotates automatic tracks without immediately repeating one", function () {
      var manager = new global.BigTwo.Audio.AudioManager({ context: new FakeAudioContext() });
      var first = manager._chooseNextTrackId();
      manager._currentTrackId = first;
      var second = manager._chooseNextTrackId();
      manager._currentTrackId = second;
      var third = manager._chooseNextTrackId();
      assertTrue(first !== second);
      assertTrue(second !== third);
      manager.destroy();
    });

    it("limits rapid concurrent copies of the same sound effect", async function () {
      var context = new FakeAudioContext();
      var manager = createQuietManager(context);
      await manager.unlock();
      assertTrue(manager.playSfx("select"));
      context.currentTime += 0.05;
      assertTrue(manager.playSfx("select"));
      context.currentTime += 0.05;
      assertTrue(!manager.playSfx("select"));
      manager.destroy();
    });

    it("degrades quietly when AudioContext construction fails", async function () {
      var manager = new global.BigTwo.Audio.AudioManager({
        audioContextFactory: function () { throw new Error("blocked"); },
        document: null
      });
      assertTrue(!await manager.unlock());
      assertTrue(!manager.available);
      assertTrue(!manager.playSfx("button"));
      manager.destroy();
    });
  });
}(window));
