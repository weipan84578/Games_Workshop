/* settings.js — 設定:主題、音量、靜音、動畫速度;即時生效並存檔。 */
(function (L) {
  'use strict';

  var SET = L.ui.settings = L.ui.settings || {};

  SET.applyTheme = function (name) {
    var link = document.getElementById('theme-stylesheet');
    if (link) link.setAttribute('href', 'css/themes/' + name + '.css');
    document.documentElement.setAttribute('data-theme', name);
    L.state.settings.theme = name;
    L.storage.saveSettings();
    refreshUI();
  };

  SET.setBgmVolume = function (v) {
    L.state.settings.bgmVolume = v; L.audio.setBgmVolume(v); L.storage.saveSettings();
  };
  SET.setSfxVolume = function (v) {
    L.state.settings.sfxVolume = v; L.audio.setSfxVolume(v); L.storage.saveSettings();
    L.audio.playSfx('sfx_button_click');
  };
  SET.toggleMute = function () {
    var m = !L.state.settings.muted;
    L.state.settings.muted = m; L.audio.setMuted(m); L.storage.saveSettings();
    refreshUI();
  };
  SET.setAnimSpeed = function (v) {
    L.state.settings.animSpeed = parseInt(v, 10); L.storage.saveSettings(); refreshUI();
  };
  SET.setLanguage = function (lang) {
    L.i18n.setLanguage(lang);
  };

  SET.refreshUI = refreshUI;
  function refreshUI() {
    var s = L.state.settings;
    var bgm = document.getElementById('set-bgm'); if (bgm) bgm.value = Math.round(s.bgmVolume * 100);
    var sfx = document.getElementById('set-sfx'); if (sfx) sfx.value = Math.round(s.sfxVolume * 100);
    var mute = document.getElementById('set-mute');
    if (mute) { mute.textContent = s.muted ? ('🔇 ' + L.i18n.t('muted')) : ('🔊 ' + L.i18n.t('soundOn')); mute.classList.toggle('muted', s.muted); }
    var anim = document.getElementById('set-anim'); if (anim) anim.value = String(s.animSpeed);
    var animLabel = document.getElementById('set-anim-label');
    if (animLabel) animLabel.textContent = [L.i18n.t('animOff'), L.i18n.t('animNormal'), L.i18n.t('animFast')][s.animSpeed] || L.i18n.t('animNormal');
    refreshThemeButtons();
    refreshLanguageButtons();
    refreshThemeLabels();
  }

  function refreshThemeButtons() {
    var s = L.state.settings;
    var els = document.querySelectorAll('[data-theme-name]');
    for (var i = 0; i < els.length; i++)
      els[i].classList.toggle('selected', els[i].getAttribute('data-theme-name') === s.theme);
  }

  function refreshLanguageButtons() {
    var s = L.state.settings;
    var els = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < els.length; i++)
      els[i].classList.toggle('selected', els[i].getAttribute('data-lang') === s.language);
  }

  function refreshThemeLabels() {
    var labels = document.querySelectorAll('[data-theme-label]');
    var names = {
      classic: L.i18n.t('themeClassic'),
      ocean: L.i18n.t('themeOcean'),
      sunset: L.i18n.t('themeSunset'),
      forest: L.i18n.t('themeForest'),
      night: L.i18n.t('themeNight'),
      'high-contrast': L.i18n.t('themeHighContrast')
    };
    for (var i = 0; i < labels.length; i++) {
      var key = labels[i].getAttribute('data-theme-label');
      labels[i].textContent = names[key] || key;
    }
  }
})(window.Ludo);
