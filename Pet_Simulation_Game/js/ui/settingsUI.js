(function (PSG) {
  'use strict';
  var d = PSG.utils.dom;
  function render(root) {
    var t = PSG.i18n.t,
      settings = PSG.core.settings,
      save = PSG.core.gameState.get(),
      back = save ? 'home' : 'menu';
    root.innerHTML =
      '<section class="scene">' +
      PSG.ui.common.sceneHeader('⚙', t('settings.title'), back) +
      '<div class="settings-grid"><section class="card setting-group"><span class="eyebrow">A / 文 / あ</span><h3>' +
      t('settings.language') +
      '</h3><div class="segmented"><button class="tab-button ' +
      (settings.language === 'zh-Hant' || !settings.language ? 'is-active' : '') +
      '" data-language="zh-Hant">繁體中文</button><button class="tab-button ' +
      (settings.language === 'en' ? 'is-active' : '') +
      '" data-language="en">English</button><button class="tab-button ' +
      (settings.language === 'ja' ? 'is-active' : '') +
      '" data-language="ja">日本語</button></div></section><section class="card setting-group"><span class="eyebrow">✦</span><h3>' +
      t('settings.appearance') +
      '</h3><div class="segmented">' +
      ['candy', 'ocean', 'forest', 'sunset', 'night']
        .map(function (theme) {
          return (
            '<button class="tab-button ' +
            (settings.theme === theme ? 'is-active' : '') +
            '" data-theme-choice="' +
            theme +
            '">' +
            t('theme.' + theme) +
            '</button>'
          );
        })
        .join('') +
      '</div></section><section class="card setting-group"><span class="eyebrow">Aa</span><h3>' +
      t('settings.text') +
      '</h3><div class="segmented">' +
      [1, 1.15, 1.3]
        .map(function (scale) {
          return (
            '<button class="tab-button ' +
            (Number(settings.textScale) === scale ? 'is-active' : '') +
            '" data-text-scale="' +
            scale +
            '">' +
            Math.round(scale * 100) +
            '%</button>'
          );
        })
        .join('') +
      '</div></section><section class="card setting-group"><span class="eyebrow">♪</span><h3>' +
      t('settings.audio') +
      '</h3>' +
      range('masterVolume', t('settings.master'), settings.masterVolume, '🔊') +
      range('bgmVolume', t('settings.bgm'), settings.bgmVolume, '🎹') +
      range('sfxVolume', t('settings.sfx'), settings.sfxVolume, '✨') +
      '<label class="tag"><input type="checkbox" data-setting="muted" ' +
      (settings.muted ? 'checked' : '') +
      '> ' +
      t('settings.mute') +
      '</label></section><section class="card setting-group"><span class="eyebrow">◌</span><h3>' +
      t('settings.animation') +
      '</h3><div class="segmented">' +
      ['standard', 'fast', 'reduced']
        .map(function (motion) {
          return (
            '<button class="tab-button ' +
            (settings.motion === motion ? 'is-active' : '') +
            '" data-motion-choice="' +
            motion +
            '">' +
            t('settings.motion.' + motion) +
            '</button>'
          );
        })
        .join('') +
      '</div></section><section class="card setting-group"><span class="eyebrow">💾</span><h3>' +
      t('settings.save') +
      '</h3>' +
      (save
        ? '<p>' +
          t('menu.saveSummary', {
            petName: d.escape(save.pet.name),
            level: save.pet.level,
            rank: PSG.ranking.matchmaking.playerRank(save)
          }) +
          '</p><p class="muted">' +
          t('menu.lastSave', { time: PSG.utils.formatter.dateTime(save.updatedAt) }) +
          '</p><button class="button button--danger" type="button" data-action="delete-save">' +
          t('settings.delete') +
          '</button>'
        : '<p class="muted">' + t('menu.noSave') + '</p>') +
      '</section></div></section>';
    d.all('[data-language]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        settings.language = button.dataset.language;
        persist(true);
      });
    });
    d.all('[data-theme-choice]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        settings.theme = button.dataset.themeChoice;
        persist(true);
      });
    });
    d.all('[data-text-scale]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        settings.textScale = Number(button.dataset.textScale);
        persist(true);
      });
    });
    d.all('[data-motion-choice]', root).forEach(function (button) {
      button.addEventListener('click', function () {
        settings.motion = button.dataset.motionChoice;
        persist(true);
      });
    });
    d.all('[data-setting][type="range"]', root).forEach(function (input) {
      input.addEventListener('input', function () {
        settings[input.dataset.setting] = Number(input.value);
        input.nextElementSibling.textContent = Math.round(input.value * 100) + '%';
        persist(false);
      });
    });
    var mute = d.one('[data-setting="muted"]', root);
    if (mute)
      mute.addEventListener('change', function () {
        settings.muted = mute.checked;
        persist(false);
      });
    var remove = d.one('[data-action="delete-save"]', root);
    if (remove)
      remove.addEventListener('click', function () {
        PSG.ui.common.modal({
          title: t('settings.delete'),
          body: '<p>' + t('settings.deleteFirst') + '</p>',
          actions:
            PSG.ui.common.button(t('common.cancel'), 'modal-close', 'ghost') +
            PSG.ui.common.button(t('common.next'), 'delete-second', 'danger'),
          onOpen: function (dialog) {
            d.one('[data-action="delete-second"]', dialog).addEventListener('click', function () {
              PSG.ui.common.modal({
                required: true,
                title: t('settings.delete'),
                body: '<p><strong>' + t('settings.deleteFinal', { petName: d.escape(save.pet.name) }) + '</strong></p>',
                actions:
                  PSG.ui.common.button(t('common.cancel'), 'delete-abort', 'ghost') +
                  PSG.ui.common.button(t('common.confirm'), 'delete-final', 'danger'),
                onOpen: function (second) {
                  d.one('[data-action="delete-abort"]', second).addEventListener('click', PSG.ui.common.closeModal);
                  d.one('[data-action="delete-final"]', second).addEventListener('click', function () {
                    PSG.storage.save.remove();
                    PSG.core.gameState.set(null);
                    PSG.ui.common.closeModal();
                    PSG.ui.common.toast(t('settings.deleted'));
                    PSG.core.scenes.go('menu');
                  });
                }
              });
            });
          }
        });
      });
    function persist(rerender) {
      var previousLanguage = PSG.i18n.current;
      PSG.storage.save.saveSettings(settings);
      PSG.core.applySettings();
      PSG.audio.manager.apply();
      // Language changes trigger a scene refresh through the event bus; other previews refresh here.
      if (rerender && previousLanguage === settings.language && PSG.core.scenes.current() === 'settings') render(root);
    }
  }
  function range(key, label, value, icon) {
    return (
      '<div class="range-row"><label for="setting-' +
      key +
      '">' +
      icon +
      ' ' +
      label +
      '</label><input id="setting-' +
      key +
      '" type="range" min="0" max="1" step="0.01" value="' +
      value +
      '" data-setting="' +
      key +
      '"><output>' +
      Math.round(value * 100) +
      '%</output></div>'
    );
  }
  PSG.ui.settings = { render: render };
})(window.PSG);
