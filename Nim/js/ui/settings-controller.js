(function (NimGame) {
  'use strict';

  var appRef;
  var customPilesHost;
  var pileCountInput;

  var THEMES = ['cute', 'candy', 'ocean', 'forest', 'sunset', 'night'];
  var DIFFICULTIES = ['easy', 'normal', 'hard', 'master'];
  var RULES = ['normal', 'misere'];
  var SETUPS = ['classic', 'standard', 'advanced', 'custom'];
  var FIRST_TURNS = ['player', 'ai', 'random'];
  var SKINS = ['stone', 'candy', 'star', 'shell'];

  function init(app) {
    appRef = app;
    customPilesHost = NimGame.dom.$('#custom-piles');
    pileCountInput = NimGame.dom.$('#pile-count');

    NimGame.dom.on(NimGame.dom.$('#settings-save-back'), 'click', function () {
      NimGame.AudioManager.playSfx('click');
      appRef.showScreen('menu');
    });
    NimGame.dom.on(NimGame.dom.$('#reset-progress'), 'click', function () {
      NimGame.ModalController.confirm({
        title: NimGame.t('settings.resetConfirmTitle'),
        body: NimGame.t('settings.resetConfirmBody'),
        onConfirm: function () {
          NimGame.StateManager.clearSave();
          NimGame.MenuController.refresh();
        }
      });
    });

    wireRange('#bgm-volume', 'bgmVolume', '#bgm-volume-label');
    wireRange('#sfx-volume', 'sfxVolume', '#sfx-volume-label');
    wireToggle('#bgm-enabled', 'bgmEnabled');
    wireToggle('#sfx-enabled', 'sfxEnabled');
    wireToggle('#reduce-motion', 'reduceMotion');
    wireSegmented('#difficulty-options', 'difficulty');
    wireSegmented('#rule-options', 'rule');
    wireSegmented('#setup-options', 'setup');
    wireSegmented('#first-turn-options', 'firstTurn');
    wireSegmented('#skin-options', 'objectSkin');
    wireThemeButtons();

    NimGame.dom.on(pileCountInput, 'input', function () {
      var count = NimGame.dom.clamp(parseInt(pileCountInput.value, 10) || 2, 2, 6);
      var settings = NimGame.StateManager.getState().settings;
      var piles = settings.customPiles.slice(0, count);
      while (piles.length < count) {
        piles.push(3);
      }
      NimGame.StateManager.updateSettings({ customPiles: piles, setup: 'custom' });
      render();
    });

    document.addEventListener('nim:language-change', render);
    document.addEventListener('nim:settings-change', function () {
      render();
      if (appRef && appRef.renderGame) {
        appRef.renderGame();
      }
    });
  }

  function wireRange(selector, settingKey, labelSelector) {
    var range = NimGame.dom.$(selector);
    var label = NimGame.dom.$(labelSelector);
    NimGame.dom.on(range, 'input', function () {
      var value = NimGame.dom.clamp(Number(range.value) / 100, 0, 1);
      label.textContent = Math.round(value * 100) + '%';
      var patch = {};
      patch[settingKey] = value;
      NimGame.StateManager.updateSettings(patch);
    });
    NimGame.dom.on(range, 'change', function () {
      NimGame.AudioManager.playSfx(settingKey === 'sfxVolume' ? 'select' : 'click');
    });
  }

  function wireToggle(selector, settingKey) {
    var input = NimGame.dom.$(selector);
    NimGame.dom.on(input, 'change', function () {
      var patch = {};
      patch[settingKey] = input.checked;
      NimGame.StateManager.updateSettings(patch);
      NimGame.AudioManager.playSfx('click');
    });
  }

  function wireSegmented(selector, settingKey) {
    NimGame.dom.on(NimGame.dom.$(selector), 'click', function (event) {
      var button = event.target.closest('[data-value]');
      if (!button) {
        return;
      }
      var patch = {};
      patch[settingKey] = button.dataset.value;
      NimGame.StateManager.updateSettings(patch);
      NimGame.AudioManager.playSfx('select');
      render();
    });
  }

  function wireThemeButtons() {
    NimGame.dom.on(NimGame.dom.$('#theme-options'), 'click', function (event) {
      var button = event.target.closest('[data-theme]');
      if (!button) {
        return;
      }
      NimGame.StateManager.updateSettings({ theme: button.dataset.theme });
      NimGame.AudioManager.playSfx('select');
      render();
    });
  }

  function optionButton(value, labelKey) {
    return '<button type="button" class="segmented-btn" data-value="' + value + '">' + NimGame.t(labelKey) + '</button>';
  }

  function renderThemeOptions(settings) {
    var host = NimGame.dom.$('#theme-options');
    host.innerHTML = THEMES.map(function (theme) {
      return '<button type="button" class="theme-swatch swatch-' + theme + '" data-theme="' + theme + '">' +
        '<span class="swatch-preview"></span><span>' + NimGame.t('theme.' + theme) + '</span></button>';
    }).join('');
    NimGame.dom.$$('[data-theme]', host).forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.theme === settings.theme);
    });
  }

  function renderSegment(id, values, prefix, currentValue) {
    var host = NimGame.dom.$(id);
    host.innerHTML = values.map(function (value) {
      return optionButton(value, prefix + value);
    }).join('');
    NimGame.dom.$$('[data-value]', host).forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.value === currentValue);
    });
  }

  function renderCustomPiles(settings) {
    var isCustom = settings.setup === 'custom';
    NimGame.dom.$('#custom-piles-panel').hidden = !isCustom;
    pileCountInput.value = settings.customPiles.length;
    customPilesHost.innerHTML = '';
    settings.customPiles.forEach(function (count, index) {
      var field = NimGame.dom.create('label', 'pile-number-field');
      var label = NimGame.dom.create('span', '', {
        text: NimGame.t('game.pileLabel', { index: index + 1 })
      });
      var input = NimGame.dom.create('input', '', {
        type: 'number',
        min: '1',
        max: '20',
        value: count
      });
      NimGame.dom.on(input, 'input', function () {
        var piles = NimGame.StateManager.getState().settings.customPiles.slice();
        piles[index] = NimGame.dom.clamp(parseInt(input.value, 10) || 1, 1, 20);
        NimGame.StateManager.updateSettings({ customPiles: piles, setup: 'custom' });
      });
      field.appendChild(label);
      field.appendChild(input);
      customPilesHost.appendChild(field);
    });
  }

  function render() {
    if (!customPilesHost) {
      return;
    }
    var settings = NimGame.StateManager.getState().settings;
    NimGame.dom.$('#bgm-volume').value = Math.round(settings.bgmVolume * 100);
    NimGame.dom.$('#sfx-volume').value = Math.round(settings.sfxVolume * 100);
    NimGame.dom.$('#bgm-volume-label').textContent = Math.round(settings.bgmVolume * 100) + '%';
    NimGame.dom.$('#sfx-volume-label').textContent = Math.round(settings.sfxVolume * 100) + '%';
    NimGame.dom.$('#bgm-enabled').checked = settings.bgmEnabled;
    NimGame.dom.$('#sfx-enabled').checked = settings.sfxEnabled;
    NimGame.dom.$('#reduce-motion').checked = settings.reduceMotion;
    renderThemeOptions(settings);
    renderSegment('#difficulty-options', DIFFICULTIES, 'game.difficulty.', settings.difficulty);
    renderSegment('#rule-options', RULES, 'game.rule.', settings.rule);
    renderSegment('#setup-options', SETUPS, 'game.setup.', settings.setup);
    renderSegment('#first-turn-options', FIRST_TURNS, 'game.first.', settings.firstTurn);
    renderSegment('#skin-options', SKINS, 'skin.', settings.objectSkin);
    renderCustomPiles(settings);
    NimGame.i18n.apply(NimGame.dom.$('#screen-settings'));
  }

  NimGame.SettingsController = {
    init: init,
    render: render
  };
}(window.NimGame = window.NimGame || {}));
