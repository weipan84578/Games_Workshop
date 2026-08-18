(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function init(api) {
    var bgm = document.getElementById("bgm-volume");
    var sfx = document.getElementById("sfx-volume");
    var mute = document.getElementById("mute-toggle");
    bgm.addEventListener("input", function () {
      var value = Number(bgm.value);
      document.getElementById("bgm-value").textContent = value + "%";
      app.AudioManager.unlock();
      app.AudioManager.setBgmVolume(value);
      app.SaveManager.saveSettings({ bgmVolume: value });
    });
    sfx.addEventListener("input", function () {
      var value = Number(sfx.value);
      document.getElementById("sfx-value").textContent = value + "%";
      app.AudioManager.unlock();
      app.AudioManager.setSfxVolume(value);
      app.SaveManager.saveSettings({ sfxVolume: value });
      app.AudioManager.playSfx("click");
    });
    mute.addEventListener("click", function () {
      var next = mute.getAttribute("aria-pressed") !== "true";
      app.AudioManager.setMuted(next);
      app.SaveManager.saveSettings({ muted: next });
      refresh();
    });
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        app.AudioManager.playSfx("click");
        app.ThemeSwitcher.setTheme(button.getAttribute("data-theme-choice"));
        refresh();
      });
    });
    document.getElementById("clear-save").addEventListener("click", function () {
      app.AudioManager.playSfx("click");
      api.confirm("confirm_clear_body", function () {
        app.SaveManager.clearSave();
        refresh();
        api.toast("toast_cleared");
      });
    });
    app.events.on("i18n:change", refresh);
    app.events.on("save:settings", refresh);
    refresh();
  }

  function refresh() {
    var settings = app.SaveManager.getSettings();
    var bgm = document.getElementById("bgm-volume");
    var sfx = document.getElementById("sfx-volume");
    var mute = document.getElementById("mute-toggle");
    if (!bgm || !sfx || !mute) {
      return;
    }
    bgm.value = settings.bgmVolume;
    sfx.value = settings.sfxVolume;
    document.getElementById("bgm-value").textContent = settings.bgmVolume + "%";
    document.getElementById("sfx-value").textContent = settings.sfxVolume + "%";
    mute.setAttribute("aria-pressed", String(Boolean(settings.muted)));
    document.getElementById("mute-label").setAttribute("data-i18n", settings.muted ? "settings_sound_off" : "settings_sound_on");
    app.i18n.apply(document);
    app.i18n.updateLanguageButtons();
  }

  app.SettingsScreen = { init: init, refresh: refresh };
})(window);
