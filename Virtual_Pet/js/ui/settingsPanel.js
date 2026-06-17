window.VP = window.VP || {};

VP.SettingsPanel = (function () {
  var settings = null;

  function updateLabels() {
    var bgm = VP.dom.$("#bgm-volume-label");
    var sfx = VP.dom.$("#sfx-volume-label");
    var text = VP.dom.$("#text-scale-label");
    if (bgm) {
      bgm.textContent = Math.round(settings.bgmVolume * 100) + "%";
    }
    if (sfx) {
      sfx.textContent = Math.round(settings.sfxVolume * 100) + "%";
    }
    if (text) {
      text.textContent = Math.round(settings.textScale) + "%";
    }
  }

  function syncControls(nextSettings) {
    settings = Object.assign({}, settings || {}, nextSettings || {});
    var form = VP.dom.$("#settings-form");
    if (!form) {
      return;
    }
    if (form.elements.lang) {
      form.elements.lang.value = settings.lang;
    }
    if (form.elements.theme) {
      form.elements.theme.value = settings.theme;
    }
    form.elements.bgmVolume.value = Math.round(settings.bgmVolume * 100);
    form.elements.sfxVolume.value = Math.round(settings.sfxVolume * 100);
    form.elements.reducedMotion.checked = Boolean(settings.reducedMotion);
    form.elements.textScale.value = Math.round(settings.textScale);
    updateLabels();
  }

  function collect(form) {
    return {
      lang: form.elements.lang.value,
      theme: form.elements.theme.value,
      bgmVolume: Number(form.elements.bgmVolume.value) / 100,
      sfxVolume: Number(form.elements.sfxVolume.value) / 100,
      reducedMotion: form.elements.reducedMotion.checked,
      textScale: Number(form.elements.textScale.value)
    };
  }

  function applyFromForm(form, sfxId) {
    var next = collect(form);
    settings = next;
    updateLabels();
    VP.App.applySettings(next);
    VP.AudioManager.playSfx(sfxId || "click");
  }

  function init(initialSettings) {
    var form = VP.dom.$("#settings-form");
    settings = Object.assign({}, initialSettings || {});
    syncControls(settings);

    if (form) {
      form.addEventListener("change", function (event) {
        if (event.target.type === "range") {
          return;
        }
        var name = event.target.name;
        var sfxId = "click";
        if (name === "lang") {
          sfxId = "lang-switch";
        }
        if (name === "theme") {
          sfxId = "theme-switch";
        }
        applyFromForm(form, sfxId);
      });

      form.addEventListener("input", function (event) {
        if (event.target.type === "range") {
          settings = collect(form);
          updateLabels();
          if (event.target.name === "bgmVolume") {
            VP.AudioManager.setBgmVolume(settings.bgmVolume);
          }
          if (event.target.name === "sfxVolume") {
            VP.AudioManager.setSfxVolume(settings.sfxVolume);
          }
          if (event.target.name === "textScale") {
            VP.App.applySettings(settings, { quiet: true });
          }
        }
      });

      form.addEventListener("change", function (event) {
        if (event.target.type === "range") {
          applyFromForm(form, "click");
        }
      });
    }

    VP.dom.on(VP.dom.$("#reset-save-btn"), "click", function () {
      VP.App.confirm({
        title: VP.i18n.t("settings.resetTitle"),
        message: VP.i18n.t("settings.resetConfirm"),
        onConfirm: function () {
          VP.SaveManager.clear();
          VP.GameState.clear();
          VP.MainMenu.updateContinueState();
          VP.App.toast(VP.i18n.t("settings.resetDone"));
          VP.AudioManager.playSfx("confirm");
          VP.SceneManager.show("main-menu");
        }
      });
    });

    VP.EventBus.on("settings:changed", syncControls);
    VP.EventBus.on("i18n:changed", function () {
      syncControls(settings);
    });
  }

  return {
    init: init,
    syncControls: syncControls
  };
})();
