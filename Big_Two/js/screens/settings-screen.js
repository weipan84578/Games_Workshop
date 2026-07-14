(function (global) {
  'use strict';
  var BigTwo = global.BigTwo = global.BigTwo || {};
  BigTwo.Screens = BigTwo.Screens || {};

  function t(key, values) { return BigTwo.I18n ? BigTwo.I18n.t(key, values) : key; }

  function heading(level, text, id) {
    var node = global.document.createElement('h' + level);
    node.textContent = text;
    if (id) { node.id = id; }
    return node;
  }

  function backButton(app) {
    var button = global.document.createElement('button');
    button.type = 'button';
    button.className = 'button button--secondary screen-back';
    button.textContent = '← ' + t('common.back');
    button.addEventListener('click', function () { app.navigate('home'); });
    return button;
  }

  function selectControl(id, value, choices, onChange) {
    var select = global.document.createElement('select');
    select.id = id;
    select.className = 'select-control';
    choices.forEach(function (choice) {
      var option = global.document.createElement('option');
      option.value = choice.value;
      option.textContent = t(choice.label);
      option.selected = choice.value === value;
      select.appendChild(option);
    });
    select.addEventListener('change', function () { onChange(select.value); });
    return select;
  }

  function switchControl(id, checked, onChange) {
    var label = global.document.createElement('label');
    var input = global.document.createElement('input');
    var slider = global.document.createElement('span');
    var state = global.document.createElement('span');
    label.className = 'switch-control';
    input.type = 'checkbox';
    input.id = id;
    input.checked = Boolean(checked);
    slider.className = 'switch-control__track';
    slider.setAttribute('aria-hidden', 'true');
    state.className = 'switch-control__state';
    state.textContent = t(checked ? 'common.on' : 'common.off');
    input.addEventListener('change', function () {
      state.textContent = t(input.checked ? 'common.on' : 'common.off');
      onChange(input.checked);
    });
    label.appendChild(input);
    label.appendChild(slider);
    label.appendChild(state);
    return label;
  }

  function rangeControl(id, value, onChange) {
    var wrap = global.document.createElement('div');
    var input = global.document.createElement('input');
    var output = global.document.createElement('output');
    function syncProgress() {
      var min = Number(input.min) || 0;
      var max = Number(input.max) || 100;
      var current = Number(input.value);
      var progress = max === min ? 0 : ((current - min) / (max - min)) * 100;
      input.style.setProperty('--range-progress', Math.max(0, Math.min(100, progress)) + '%');
    }
    wrap.className = 'range-control';
    input.type = 'range';
    input.id = id;
    input.min = '0';
    input.max = '100';
    input.step = '5';
    input.value = String(value);
    syncProgress();
    output.htmlFor = id;
    output.textContent = t('settings.volumeValue', { value: value });
    input.addEventListener('input', function () {
      syncProgress();
      output.textContent = t('settings.volumeValue', { value: input.value });
      onChange(Number(input.value));
    });
    wrap.appendChild(input);
    wrap.appendChild(output);
    return wrap;
  }

  function row(labelKey, id, control, hintKey) {
    var wrap = global.document.createElement('div');
    var label = global.document.createElement('label');
    wrap.className = 'setting-row';
    label.className = 'setting-row__label';
    label.htmlFor = id;
    label.textContent = t(labelKey);
    wrap.appendChild(label);
    wrap.appendChild(control);
    if (hintKey) {
      var hint = global.document.createElement('p');
      hint.className = 'setting-row__hint';
      hint.textContent = t(hintKey);
      wrap.appendChild(hint);
    }
    return wrap;
  }

  function card(titleKey) {
    var section = global.document.createElement('section');
    section.className = 'settings-card';
    section.appendChild(heading(2, t(titleKey)));
    return section;
  }

  BigTwo.Screens.createSettingsScreen = function (app) {
    var saveTimer = null;
    function update(patch, statusNode) {
      var ok = app.updateSettings(patch);
      statusNode.textContent = t(ok === false ? 'settings.saveFailed' : 'common.saved');
      if (saveTimer) { global.clearTimeout(saveTimer); }
      saveTimer = global.setTimeout(function () { statusNode.textContent = ''; }, 1800);
    }
    return {
      render: function (container) {
        var settings = app.getSettings();
        var header = global.document.createElement('header');
        var title = heading(1, t('settings.title'), 'screen-settings-title');
        var grid = global.document.createElement('div');
        var status = global.document.createElement('p');
        var game = card('settings.gameGroup');
        var display = card('settings.displayGroup');
        var audio = card('settings.audioGroup');
        var data = card('settings.dataGroup');
        var reset = global.document.createElement('button');
        var resetHint = global.document.createElement('p');
        var audioAvailable = app.isAudioAvailable();
        var musicSwitch;
        var musicRange;
        var sfxSwitch;
        var sfxRange;
        title.setAttribute('data-screen-heading', '');
        header.className = 'screen-header';
        header.appendChild(backButton(app));
        header.appendChild(title);
        status.className = 'settings-save-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        header.appendChild(status);
        grid.className = 'settings-grid';

        game.appendChild(row('settings.difficulty', 'setting-difficulty', selectControl('setting-difficulty', settings.difficulty, [
          { value: 'easy', label: 'difficulty.easy' },
          { value: 'normal', label: 'difficulty.normal' },
          { value: 'hard', label: 'difficulty.hard' }
        ], function (value) { update({ difficulty: value }, status); })));

        display.appendChild(row('settings.theme', 'setting-theme', selectControl('setting-theme', settings.theme, [
          { value: 'realistic', label: 'theme.realistic' },
          { value: 'midnight', label: 'theme.midnight' },
          { value: 'sakura', label: 'theme.sakura' },
          { value: 'cuteParty', label: 'theme.cuteParty' }
        ], function (value) { update({ theme: value }, status); })));
        display.appendChild(row('settings.language', 'setting-locale', selectControl('setting-locale', settings.locale, [
          { value: 'zh-Hant', label: 'locale.zh-Hant' },
          { value: 'en', label: 'locale.en' },
          { value: 'ja', label: 'locale.ja' }
        ], function (value) { update({ locale: value }, status); })));
        display.appendChild(row('settings.animations', 'setting-animations', switchControl('setting-animations', settings.animationsEnabled, function (value) {
          update({ animationsEnabled: value }, status);
        })));

        musicSwitch = switchControl('setting-music', settings.musicEnabled, function (value) { update({ musicEnabled: value }, status); });
        musicRange = rangeControl('setting-music-volume', settings.musicVolume, function (value) { update({ musicVolume: value }, status); });
        sfxSwitch = switchControl('setting-sfx', settings.sfxEnabled, function (value) { update({ sfxEnabled: value }, status); });
        sfxRange = rangeControl('setting-sfx-volume', settings.sfxVolume, function (value) { update({ sfxVolume: value }, status); });
        audio.appendChild(row('settings.music', 'setting-music', musicSwitch));
        audio.appendChild(row('settings.musicVolume', 'setting-music-volume', musicRange));
        audio.appendChild(row('settings.sfx', 'setting-sfx', sfxSwitch));
        audio.appendChild(row('settings.sfxVolume', 'setting-sfx-volume', sfxRange));
        audio.appendChild(row('settings.track', 'setting-track', selectControl('setting-track', settings.musicTrack, [
          { value: 'auto', label: 'settings.trackAuto' },
          { value: 'track1', label: 'settings.track1' },
          { value: 'track2', label: 'settings.track2' },
          { value: 'track3', label: 'settings.track3' },
          { value: 'track4', label: 'settings.track4' }
        ], function (value) { update({ musicTrack: value }, status); })));
        if (!audioAvailable) {
          audio.classList.add('is-unavailable');
          audio.querySelectorAll('input, select').forEach(function (control) { control.disabled = true; });
          var unavailable = global.document.createElement('p');
          unavailable.className = 'setting-warning';
          unavailable.textContent = t('settings.audioUnavailable');
          audio.appendChild(unavailable);
        }

        reset.type = 'button';
        reset.className = 'button button--danger';
        reset.textContent = t('settings.reset');
        reset.addEventListener('click', function () {
          app.confirmResetData().then(function (didReset) {
            if (didReset) { status.textContent = t('settings.resetDone'); }
          });
        });
        resetHint.className = 'setting-row__hint settings-reset-hint';
        resetHint.textContent = t('settings.resetHint');
        data.appendChild(reset);
        data.appendChild(resetHint);
        grid.appendChild(game);
        grid.appendChild(display);
        grid.appendChild(audio);
        grid.appendChild(data);
        container.appendChild(header);
        container.appendChild(grid);
        container.appendChild(backButton(app));
      },
      onHide: function () {
        if (saveTimer) { global.clearTimeout(saveTimer); saveTimer = null; }
      }
    };
  };
}(window));
