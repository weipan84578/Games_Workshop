(function (PSG) {
  'use strict';
  function applySettings() {
    var settings = PSG.core.settings;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.motion = settings.motion;
    document.documentElement.style.setProperty('--text-scale', settings.textScale);
    PSG.i18n.set(settings.language || PSG.i18n.detect());
    if (PSG.audio.manager) PSG.audio.manager.apply();
  }
  function start() {
    try {
      PSG.core.settings = PSG.storage.save.loadSettings();
      // Persist the detected language once so later theme/audio changes cannot accidentally re-detect it.
      if (!PSG.core.settings.language) PSG.core.settings.language = PSG.i18n.detect();
      applySettings();
      PSG.storage.save.saveSettings(PSG.core.settings);
      // Save slots are selected from the main menu; do not silently reopen slot 1.
      PSG.core.gameState.set(null, 1);
      PSG.core.events.on('language:changed', function () {
        if (PSG.core.scenes.current()) PSG.core.scenes.rerender();
      });
      document.addEventListener('pointerdown', function () {
        PSG.audio.manager.unlock();
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') PSG.audio.manager.unlock();
      });
      document.addEventListener('click', function (event) {
        if (event.target.closest('button:not([disabled])')) PSG.audio.manager.sfx('click');
      });
      PSG.core.scenes.go('menu');
      if (PSG.storage.save.lastError)
        window.setTimeout(function () {
          PSG.ui.common.modal({ title: PSG.i18n.t('error.title'), body: '<p>' + PSG.i18n.t('error.load') + '</p>' });
        }, 120);
    } catch (error) {
      console.error(error);
      document.getElementById('scene-root').innerHTML =
        '<section class="boot-card card"><h1>⚠</h1><h2>Unable to start</h2><p>' +
        PSG.utils.dom.escape(error.message) +
        '</p><p>Please keep every project file in the same folder and reload index.html.</p></section>';
    }
  }
  PSG.core.applySettings = applySettings;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window.PSG);
