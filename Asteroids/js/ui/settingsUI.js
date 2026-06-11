(function () {
  "use strict";

  var form;

  function setForm(settings) {
    if (!form) return;
    form.elements.language.value = settings.language;
    form.elements.theme.value = settings.theme;
    form.elements.musicVolume.value = settings.musicVolume;
    form.elements.sfxVolume.value = settings.sfxVolume;
    form.elements.touchOpacity.value = settings.touchOpacity;
    form.elements.touchLayout.value = settings.touchLayout;
    form.elements.muted.checked = settings.muted;
    form.elements.particles.checked = settings.particles;
    form.elements.screenShake.checked = settings.screenShake;
    form.elements.showFps.checked = settings.showFps;
    document.querySelectorAll(".theme-picks label").forEach(function (label) {
      var input = label.querySelector("input");
      label.classList.toggle("selected", input && input.value === settings.theme);
    });
  }

  function readForm(base) {
    return Object.assign({}, base, {
      theme: form.elements.theme.value,
      language: form.elements.language.value,
      musicVolume: Number(form.elements.musicVolume.value),
      sfxVolume: Number(form.elements.sfxVolume.value),
      touchOpacity: Number(form.elements.touchOpacity.value),
      touchLayout: form.elements.touchLayout.value,
      muted: form.elements.muted.checked,
      particles: form.elements.particles.checked,
      screenShake: form.elements.screenShake.checked,
      showFps: form.elements.showFps.checked
    });
  }

  Game.SettingsUI = {
    init: function (app) {
      form = document.getElementById("settings-form");
      setForm(app.settings);
      form.addEventListener("input", function () {
        app.settings = readForm(app.settings);
        Game.SettingsUI.apply(app.settings);
        Game.Storage.saveSettings(app.settings);
      });
      form.addEventListener("change", function () {
        app.settings = readForm(app.settings);
        Game.SettingsUI.apply(app.settings);
        Game.Storage.saveSettings(app.settings);
      });
      Game.SettingsUI.apply(app.settings);
    },

    apply: function (settings) {
      Game.I18n.setLanguage(settings.language);
      document.body.setAttribute("data-theme", settings.theme);
      document.body.setAttribute("data-touch-layout", settings.touchLayout);
      document.body.style.setProperty("--control-opacity", String(settings.touchOpacity / 100));
      Game.Audio.applySettings(settings);
      setForm(settings);
      if (Game.App && Game.App.refreshLocalizedText) {
        Game.App.refreshLocalizedText();
      }
      if (Game.App && Game.App.resize) {
        requestAnimationFrame(function () {
          Game.App.resize();
        });
      }
    }
  };
}());
