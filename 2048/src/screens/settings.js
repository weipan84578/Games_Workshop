const SettingsScreen = (() => {
  function init() {
    const s = SettingsStore.getAll();

    const el = (id) => document.getElementById(id);
    const bind = (id, key, transform) => {
      const input = el(id);
      input.value = s[key];
      input.addEventListener('change', () => {
        const val = transform ? transform(input.value) : input.value;
        SettingsStore.set(key, val);
        onSettingChange(key);
      });
    };
    const bindCheck = (id, key) => {
      const input = el(id);
      input.checked = s[key];
      input.addEventListener('change', () => {
        SettingsStore.set(key, input.checked);
        onSettingChange(key);
      });
    };
    const bindRange = (id, displayId, key, transform) => {
      const input = el(id);
      const display = el(displayId);
      input.value = s[key];
      display.textContent = s[key];
      input.addEventListener('input', () => {
        display.textContent = input.value;
        const val = transform ? transform(input.value) : parseInt(input.value, 10);
        SettingsStore.set(key, val);
        onSettingChange(key);
      });
    };

    bind('set-size', 'size', v => parseInt(v, 10));
    bind('set-goal', 'goal', v => parseInt(v, 10));
    bind('set-undo', 'undoLimit', v => parseInt(v, 10));
    bindCheck('set-continue', 'continueAfterWin');
    bindCheck('set-timer', 'showTimer');
    bind('set-anim', 'animSpeed');
    bind('set-theme', 'theme');
    bindRange('set-radius', 'radius-val', 'radius');
    bindCheck('set-grid', 'showGrid');
    bindCheck('set-contrast', 'highContrast');
    bindRange('set-vol-master', 'vol-master-val', 'volMaster');
    bindRange('set-vol-sfx', 'vol-sfx-val', 'volSfx');
    bindRange('set-vol-bgm', 'vol-bgm-val', 'volBgm');
    bind('set-bgm-track', 'bgmTrack');

    el('btn-settings-back').onclick = () => {
      AudioEngine.buttonClick();
      App.showScreen('home');
      HomeScreen.refresh();
    };

    el('btn-reset-settings').onclick = () => {
      App.confirm('確定要恢復所有預設設定嗎？', () => {
        SettingsStore.reset();
        init();
        Renderer.applyTheme();
        AudioEngine.applyVolumes();
      });
    };
  }

  function onSettingChange(key) {
    if (['theme', 'radius', 'showGrid', 'highContrast', 'animSpeed'].includes(key)) {
      Renderer.applyTheme();
    }
    if (['volMaster', 'volSfx', 'volBgm'].includes(key)) {
      AudioEngine.applyVolumes();
    }
    if (key === 'bgmTrack') {
      AudioEngine.stopBgm();
      AudioEngine.startBgm();
    }
    if (key === 'showTimer') {
      document.getElementById('timer-box').style.display =
        SettingsStore.get('showTimer') ? '' : 'none';
    }
  }

  return { init };
})();
