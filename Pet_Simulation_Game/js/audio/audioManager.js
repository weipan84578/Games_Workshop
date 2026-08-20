(function (PSG) {
  'use strict';

  var context = null, master = null, bgmGain = null, sfxGain = null, compressor = null;
  var channels = [], activeIndex = 0, currentTrack = null, unlocked = false;
  function settings() { return PSG.core.settings || PSG.storage.save.settingsDefaults(); }
  function ensure() {
    if (context) return true;
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    context = new AudioContextClass();
    master = context.createGain(); bgmGain = context.createGain(); sfxGain = context.createGain(); compressor = context.createDynamicsCompressor();
    // Required safety chain: 10× BGM pre-gain is always followed by peak compression before master output.
    compressor.threshold.value = -18; compressor.knee.value = 12; compressor.ratio.value = 12; compressor.attack.value = 0.003; compressor.release.value = 0.25;
    bgmGain.connect(compressor); compressor.connect(master); sfxGain.connect(master); master.connect(context.destination);
    for (var i = 0; i < 2; i += 1) {
      var audio = new Audio(); audio.loop = true; audio.preload = 'none';
      var gain = context.createGain(); gain.gain.value = 0;
      context.createMediaElementSource(audio).connect(gain).connect(bgmGain);
      channels.push({ audio: audio, gain: gain });
    }
    apply(); return true;
  }
  function unlock() {
    if (!ensure()) return Promise.resolve(false);
    unlocked = true;
    return context.resume().then(function () { if (currentTrack) play(currentTrack); return true; });
  }
  function apply() {
    if (!context) return;
    var set = settings();
    var muted = set.muted ? 0 : 1;
    master.gain.setTargetAtTime(set.masterVolume * muted, context.currentTime, 0.02);
    bgmGain.gain.setTargetAtTime(set.bgmVolume * 10, context.currentTime, 0.02);
    sfxGain.gain.setTargetAtTime(set.sfxVolume, context.currentTime, 0.02);
  }
  function play(track) {
    currentTrack = track;
    if (!unlocked || !ensure() || !PSG.audio.bgmTracks[track]) return;
    // Alternating two media channels allows a local-file-safe 600 ms crossfade without fetch/decode.
    var nextIndex = activeIndex === 0 ? 1 : 0, next = channels[nextIndex], old = channels[activeIndex];
    if (next.audio.dataset.track === track && !next.audio.paused) return;
    next.audio.src = PSG.audio.bgmTracks[track]; next.audio.dataset.track = track; next.audio.currentTime = 0;
    next.audio.play().catch(function () {});
    var now = context.currentTime, fade = 0.6;
    next.gain.gain.cancelScheduledValues(now); next.gain.gain.setValueAtTime(0, now); next.gain.gain.linearRampToValueAtTime(1, now + fade);
    old.gain.gain.cancelScheduledValues(now); old.gain.gain.setValueAtTime(old.gain.gain.value, now); old.gain.gain.linearRampToValueAtTime(0, now + fade);
    window.setTimeout(function () { if (old !== channels[activeIndex]) old.audio.pause(); }, 700);
    activeIndex = nextIndex;
  }
  function sfx(name) {
    if (!unlocked || !ensure() || !PSG.audio.sfxTracks[name] || settings().muted) return;
    var audio = new Audio(PSG.audio.sfxTracks[name]);
    try {
      var source = context.createMediaElementSource(audio); source.connect(sfxGain);
      // Release each one-shot node after playback; repeated clicks must not retain an unbounded graph.
      audio.addEventListener('ended', function () { source.disconnect(); audio.removeAttribute('src'); audio.load(); }, { once: true });
      audio.play().catch(function () { source.disconnect(); });
    } catch (error) {}
  }
  PSG.audio.manager = { unlock: unlock, play: play, sfx: sfx, apply: apply, isUnlocked: function () { return unlocked; } };
})(window.PSG);
