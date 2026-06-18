window.YZ = window.YZ || {};

YZ.Settings = (function () {
  var defaults = YZ.Constants.DEFAULT_PREFS;
  var prefs = {};

  function load() {
    prefs = {
      lang: YZ.Save.loadPref("lang") || defaults.lang,
      theme: YZ.Save.loadPref("theme") || defaults.theme,
      bgm: valueOrDefault(YZ.Save.loadPref("vol.bgm"), defaults.bgm),
      sfx: valueOrDefault(YZ.Save.loadPref("vol.sfx"), defaults.sfx),
      mute: valueOrDefault(YZ.Save.loadPref("mute"), defaults.mute),
      difficulty: YZ.Save.loadPref("difficulty") || defaults.difficulty,
      fontScale: YZ.Save.loadPref("fontScale") || defaults.fontScale,
      aiSpeed: valueOrDefault(YZ.Save.loadPref("aiSpeed"), defaults.aiSpeed),
      showHints: valueOrDefault(YZ.Save.loadPref("showHints"), defaults.showHints)
    };
    apply();
  }

  function valueOrDefault(value, fallback) {
    return value === null || value === undefined ? fallback : value;
  }

  function apply() {
    YZ.Constants.THEMES.forEach(function (theme) {
      document.body.classList.toggle("theme-" + theme, prefs.theme === theme);
    });
    ["small", "large", "extra"].forEach(function (scale) {
      document.body.classList.toggle("font-scale-" + scale, prefs.fontScale === scale);
    });
    if (YZ.Audio) {
      YZ.Audio.setBgmVolume(prefs.bgm);
      YZ.Audio.setSfxVolume(prefs.sfx);
      YZ.Audio.setMuted(prefs.mute);
    }
  }

  function get(name) {
    return prefs[name] === undefined ? defaults[name] : prefs[name];
  }

  function set(name, value) {
    prefs[name] = value;
    var storageName = name;
    if (name === "bgm") storageName = "vol.bgm";
    if (name === "sfx") storageName = "vol.sfx";
    YZ.Save.savePref(storageName, value);
    apply();
  }

  return {
    load: load,
    apply: apply,
    get: get,
    set: set
  };
})();

YZ.SettingsUI = (function () {
  function t(key) {
    return YZ.I18n.t(key);
  }

  function render() {
    var root = document.getElementById("screen-settings");
    if (!root) return;
    root.innerHTML = [
      '<div class="page-shell settings-shell">',
      '<header class="section-header">',
      '<div><h1>' + YZ.Effects.esc(t("settings.title")) + '</h1><p class="muted">' + YZ.Effects.esc(t("settings.saved")) + "</p></div>",
      '<button class="btn" id="settings-back">← ' + YZ.Effects.esc(t("common.back")) + "</button>",
      "</header>",
      '<div class="settings-grid">',
      audioCard(),
      appearanceCard(),
      languageCard(),
      gameCard(),
      "</div>",
      "</div>"
    ].join("");
    bind(root);
  }

  function audioCard() {
    return [
      '<section class="settings-card">',
      '<h2 class="settings-card__title">🔊 ' + YZ.Effects.esc(t("settings.audio")) + "</h2>",
      '<div class="setting-row"><label class="toggle"><input type="checkbox" id="set-mute" ' + (YZ.Settings.get("mute") ? "checked" : "") + '><span class="toggle__track"></span><span class="toggle__label">' + YZ.Effects.esc(t("settings.mute")) + "</span></label></div>",
      slider("bgm", t("settings.bgm"), YZ.Settings.get("bgm")),
      slider("sfx", t("settings.sfx"), YZ.Settings.get("sfx")),
      "</section>"
    ].join("");
  }

  function appearanceCard() {
    return [
      '<section class="settings-card">',
      '<h2 class="settings-card__title">🎨 ' + YZ.Effects.esc(t("settings.appearance")) + "</h2>",
      '<div class="setting-row"><strong>' + YZ.Effects.esc(t("settings.theme")) + '</strong><div class="swatch-row">',
      YZ.Constants.THEMES.map(function (theme) {
        return '<button class="theme-swatch ' + (YZ.Settings.get("theme") === theme ? "is-active" : "") + '" data-set-theme="' + theme + '" aria-label="' + theme + '"></button>';
      }).join(""),
      "</div></div>",
      segmented("fontScale", [
        ["small", t("settings.small")],
        ["large", t("settings.large")],
        ["extra", t("settings.extra")]
      ], YZ.Settings.get("fontScale")),
      "</section>"
    ].join("");
  }

  function languageCard() {
    return [
      '<section class="settings-card">',
      '<h2 class="settings-card__title">🌐 ' + YZ.Effects.esc(t("settings.lang")) + "</h2>",
      segmented("lang", [
        ["zh", "繁體中文"],
        ["en", "English"],
        ["ja", "日本語"]
      ], YZ.I18n.get()),
      "</section>"
    ].join("");
  }

  function gameCard() {
    return [
      '<section class="settings-card">',
      '<h2 class="settings-card__title">🎮 ' + YZ.Effects.esc(t("settings.game")) + "</h2>",
      segmented("difficulty", YZ.Constants.DIFFICULTIES.map(function (difficulty) {
        return [difficulty, t("difficulty." + difficulty)];
      }), YZ.Settings.get("difficulty")),
      slider("aiSpeed", t("settings.aiSpeed"), YZ.Settings.get("aiSpeed")),
      '<div class="setting-row"><label class="toggle"><input type="checkbox" id="set-hints" ' + (YZ.Settings.get("showHints") ? "checked" : "") + '><span class="toggle__track"></span><span class="toggle__label">' + YZ.Effects.esc(t("settings.showHints")) + "</span></label></div>",
      "</section>"
    ].join("");
  }

  function slider(name, label, value) {
    var percent = Math.round(Number(value) * 100);
    return [
      '<label class="setting-row slider-row">',
      '<span>' + YZ.Effects.esc(label) + "</span>",
      '<input type="range" min="0" max="100" value="' + percent + '" data-slider="' + name + '">',
      '<span class="slider-value" data-slider-value="' + name + '">' + percent + "%</span>",
      "</label>"
    ].join("");
  }

  function segmented(name, items, current) {
    return [
      '<div class="setting-row"><strong>' + YZ.Effects.esc(t(name === "difficulty" ? "settings.defaultDifficulty" : name === "fontScale" ? "settings.fontScale" : "settings.lang")) + '</strong><div class="segmented">',
      items.map(function (item) {
        return '<button class="btn ' + (current === item[0] ? "is-active" : "") + '" data-segment="' + name + '" data-value="' + item[0] + '">' + YZ.Effects.esc(item[1]) + "</button>";
      }).join(""),
      "</div></div>"
    ].join("");
  }

  function bind(root) {
    root.querySelector("#settings-back").addEventListener("click", function () {
      YZ.ScreenManager.show("menu");
    });
    root.querySelector("#set-mute").addEventListener("change", function (event) {
      YZ.Settings.set("mute", event.target.checked);
    });
    root.querySelector("#set-hints").addEventListener("change", function (event) {
      YZ.Settings.set("showHints", event.target.checked);
    });
    root.querySelectorAll("[data-slider]").forEach(function (slider) {
      slider.addEventListener("input", function () {
        var name = slider.getAttribute("data-slider");
        var value = Number(slider.value) / 100;
        YZ.Settings.set(name, value);
        var label = root.querySelector('[data-slider-value="' + name + '"]');
        if (label) label.textContent = slider.value + "%";
      });
    });
    root.querySelectorAll("[data-set-theme]").forEach(function (button) {
      button.addEventListener("click", function () {
        YZ.Settings.set("theme", button.getAttribute("data-set-theme"));
        render();
      });
    });
    root.querySelectorAll("[data-segment]").forEach(function (button) {
      button.addEventListener("click", function () {
        var name = button.getAttribute("data-segment");
        var value = button.getAttribute("data-value");
        YZ.Settings.set(name, value);
        if (name === "lang") YZ.I18n.set(value);
        else render();
      });
    });
  }

  return {
    render: render
  };
})();
