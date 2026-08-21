(function (PSG) {
  'use strict';

  var current = null,
    cleanup = null,
    payload = null;
  function go(name, data) {
    if (!PSG.ui[name] || typeof PSG.ui[name].render !== 'function') throw new Error('Unknown scene: ' + name);
    if (cleanup) {
      try {
        cleanup();
      } catch (error) {
        console.warn(error);
      }
      cleanup = null;
    }
    var previous = current;
    current = name;
    payload = data;
    var root = document.getElementById('scene-root');
    var result = PSG.ui[name].render(root, data || {});
    cleanup = typeof result === 'function' ? result : null;
    root.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    PSG.core.events.emit('scene:changed', name);
    var tracks = {
      menu: 'menu',
      onboarding: 'menu',
      home: 'home',
      training: 'training',
      outing: 'outing',
      ranking: 'home',
      shop: 'home',
      instructions: 'menu',
      settings: previous === 'menu' ? 'menu' : 'home',
      battle: 'battle'
    };
    if (PSG.audio.manager) PSG.audio.manager.play(tracks[name] || 'home');
  }
  PSG.core.scenes = {
    go: go,
    rerender: function () {
      if (current) go(current, payload);
    },
    current: function () {
      return current;
    }
  };
})(window.PSG);
