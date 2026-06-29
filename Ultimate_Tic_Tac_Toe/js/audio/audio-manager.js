(function () {
  "use strict";

  var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  var context = null;
  var bgm = null;
  var wantsBgm = false;
  var settings = Object.assign({}, window.AppDefaults.settings);

  function ensureContext() {
    if (!AudioContextCtor) return null;
    if (!context) context = new AudioContextCtor();
    if (context.state === "suspended") context.resume();
    if (!bgm) {
      bgm = window.BgmGenerator.create(context, function () {
        return settings.muted ? 0 : (Number(settings.bgm_volume) || 0) / 100 * 0.24;
      });
    }
    return context;
  }

  function configure(nextSettings) {
    settings = Object.assign({}, settings, nextSettings || {});
    if (settings.muted && bgm) bgm.stop();
  }

  function startBgm() {
    wantsBgm = true;
    if (settings.muted) return;
    ensureContext();
    if (bgm) bgm.start();
  }

  function stopBgm() {
    wantsBgm = false;
    if (bgm) bgm.stop();
  }

  function unlockAudio() {
    ensureContext();
    if (wantsBgm && !settings.muted && bgm) {
      bgm.start();
    }
  }

  function play(name) {
    if (settings.muted) return;
    var ctx = ensureContext();
    if (!ctx) return;
    window.SfxGenerator.play(ctx, name, (Number(settings.sfx_volume) || 0) / 100);
  }

  function toggleMuted() {
    settings.muted = !settings.muted;
    if (settings.muted) stopBgm();
    else startBgm();
    return settings.muted;
  }

  document.addEventListener("pointerdown", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });

  window.AudioManager = {
    configure: configure,
    startBgm: startBgm,
    stopBgm: stopBgm,
    play: play,
    toggleMuted: toggleMuted
  };
})();
