(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var themes = [
    ["cute", "#ef6fa9", "#ffd35d", "#82bfe9"], ["ocean", "#269fc1", "#f3c95d", "#72c9c5"], ["sunset", "#e96f44", "#f8ca63", "#bb7ad5"], ["forest", "#4b9a70", "#e9c75d", "#b98d62"], ["galaxy", "#7568ca", "#f3d274", "#9a80c9"], ["dark", "#8ee7c1", "#ffe38a", "#8d99ae"]
  ];

  function percent(value) { return Math.round(Number(value) * 100) + "%"; }

  app.SettingsUI = {
    changeTheme: function (theme) {
      document.documentElement.dataset.theme = theme;
      app.GameEngine.updateSettings({ theme: theme });
      app.AudioManager.playSfx("click");
      this.render();
    },
    changeLanguage: function (language) {
      app.I18n.setLanguage(language);
      app.GameEngine.updateSettings({ language: language });
      this.render();
    },
    changeRange: function (key, value) {
      var numeric = Number(value);
      var patch = {};
      patch[key] = numeric;
      app.GameEngine.updateSettings(patch);
      app.AudioManager.applySettings(app.GameEngine.getSettings());
      if (key === "sfx") app.AudioManager.playSfx("click");
      this.renderRangeValue(key, numeric);
    },
    renderRangeValue: function (key, value) {
      var element = document.getElementById("settings-" + key + "-value");
      if (element) element.textContent = percent(value);
      var warning = document.getElementById("settings-bgm-warning");
      if (warning) warning.textContent = Number(value) > 3 ? app.I18n.t("game.tooLoud") : "";
    },
    toggleMute: function () {
      var next = !app.GameEngine.getSettings().muted;
      app.GameEngine.updateSettings({ muted: next });
      app.AudioManager.applySettings(app.GameEngine.getSettings());
      this.render();
    },
    setBattleSpeed: function (speed) {
      app.GameEngine.updateSettings({ battleSpeed: Number(speed) });
      this.render();
    },
    setTargetStrategy: function (strategy) {
      app.GameEngine.updateSettings({ targetStrategy: strategy });
      this.render();
    },
    render: function () {
      var container = document.getElementById("settings-content");
      if (!container) return;
      var settings = app.GameEngine.getSettings();
      var themeCards = themes.map(function (theme) {
        return '<button type="button" class="theme-swatch ' + (settings.theme === theme[0] ? "is-active" : "") + '" data-action="change-theme" data-theme="' + theme[0] + '"><span class="theme-dots"><i class="theme-dot" style="background:' + theme[1] + '"></i><i class="theme-dot" style="background:' + theme[2] + '"></i><i class="theme-dot" style="background:' + theme[3] + '"></i></span><strong>' + app.I18n.t("settings.themes." + theme[0]) + '</strong>' + (settings.theme === theme[0] ? '<span class="theme-check">✓</span>' : "") + '</button>';
      }).join("");
      var languageCards = app.I18n.supported.map(function (language) {
        var icon = language === "zh-TW" ? "🇹🇼" : language === "en" ? "🇺🇸" : "🇯🇵";
        return '<button type="button" class="language-card ' + (settings.language === language ? "is-active" : "") + '" data-action="set-language" data-language="' + language + '"><span>' + icon + '</span><strong>' + app.I18n.t("settings.languages." + language) + '</strong></button>';
      }).join("");
      var muteLabel = settings.muted ? app.I18n.t("settings.muted") : app.I18n.t("settings.soundOn");
      container.innerHTML = '<section class="settings-group settings-group-wide"><div class="settings-group-heading"><span>🎨</span><h2>' + app.I18n.t("settings.appearance") + '</h2></div><p class="muted small-copy">' + app.I18n.t("settings.themeLabel") + '</p><div class="theme-grid" style="margin-top:12px">' + themeCards + '</div></section>' +
        '<section class="settings-group"><div class="settings-group-heading"><span>🔤</span><h2>' + app.I18n.t("settings.language") + '</h2></div><p class="muted small-copy">' + app.I18n.t("settings.languageLabel") + '</p><div class="language-grid" style="margin-top:12px">' + languageCards + '</div></section>' +
        '<section class="settings-group"><div class="settings-group-heading"><span>🔊</span><h2>' + app.I18n.t("settings.audio") + '</h2></div><div class="settings-row"><label class="settings-label" for="bgm-range">🎵 ' + app.I18n.t("settings.bgm") + '</label><input id="bgm-range" class="range-control" type="range" min="0" max="10" step="0.1" value="' + settings.bgm + '" data-setting="bgm"><output id="settings-bgm-value" class="settings-value">' + percent(settings.bgm) + '</output><span id="settings-bgm-warning" class="warning-copy" style="grid-column:1/-1">' + (settings.bgm > 3 ? app.I18n.t("game.tooLoud") : "") + '</span></div><div class="settings-row"><label class="settings-label" for="sfx-range">🔔 ' + app.I18n.t("settings.sfx") + '</label><input id="sfx-range" class="range-control" type="range" min="0" max="3" step="0.05" value="' + settings.sfx + '" data-setting="sfx"><output id="settings-sfx-value" class="settings-value">' + percent(settings.sfx) + '</output></div><div class="settings-row"><span class="settings-label">🔇 ' + app.I18n.t("settings.mute") + '</span><span class="toggle-wrap"><button type="button" class="toggle-button ' + (settings.muted ? "is-on" : "") + '" data-action="toggle-mute" aria-pressed="' + settings.muted + '" aria-label="' + muteLabel + '"></button><span class="toggle-label">' + muteLabel + '</span></span></div></section>' +
        '<section class="settings-group"><div class="settings-group-heading"><span>🕹️</span><h2>' + app.I18n.t("settings.gameplay") + '</h2></div><div class="settings-row"><span class="settings-label">⏱️ ' + app.I18n.t("settings.battleSpeed") + '</span><span class="segmented-control"><button type="button" class="ghost-button ' + (settings.battleSpeed === 1 ? "is-active" : "") + '" data-action="change-speed" data-speed="1">1x</button><button type="button" class="ghost-button ' + (settings.battleSpeed === 2 ? "is-active" : "") + '" data-action="change-speed" data-speed="2">2x</button></span></div><div class="settings-row"><label class="settings-label" for="target-select">🎯 ' + app.I18n.t("settings.targetStrategy") + '</label><select id="target-select" class="select-control" data-setting="targetStrategy"><option value="nearest" ' + (settings.targetStrategy === "nearest" ? "selected" : "") + '>' + app.I18n.t("settings.nearest") + '</option><option value="lowest" ' + (settings.targetStrategy === "lowest" ? "selected" : "") + '>' + app.I18n.t("settings.lowest") + '</option></select><span></span></div></section>' +
        '<section class="settings-group settings-group-wide"><div class="settings-group-heading"><span>🗑️</span><h2>' + app.I18n.t("settings.data") + '</h2></div><p class="muted small-copy">' + app.I18n.t("settings.deleteCopy") + '</p><button type="button" class="primary-button danger-button" style="margin-top:14px" data-action="delete-save">🗑️ ' + app.I18n.t("settings.deleteSave") + '</button></section>';
    }
  };
}(window));
