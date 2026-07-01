(function (ns) {
  "use strict";

  function localizedThemeName(theme) {
    return theme.name[ns.appSettings.language] || theme.name["zh-TW"];
  }

  function renderThemes() {
    var grid = document.getElementById("theme-grid");
    grid.innerHTML = "";
    ns.Themes.forEach(function (theme) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "theme-option";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(theme.key === ns.appSettings.theme));
      button.dataset.theme = theme.key;
      var swatch = document.createElement("span");
      swatch.className = "theme-swatch";
      swatch.style.background = theme.swatch;
      swatch.setAttribute("aria-hidden", "true");
      button.appendChild(swatch);
      button.appendChild(document.createTextNode(localizedThemeName(theme)));
      button.addEventListener("click", function () {
        ns.appSettings.theme = theme.key;
        ns.ThemeSwitcher.apply(theme.key);
        ns.SaveManager.saveSettings(ns.appSettings);
        renderThemes();
      });
      grid.appendChild(button);
    });
  }

  function updateVolumeOutputs() {
    document.getElementById("bgm-volume-output").textContent = Math.round(ns.appSettings.bgmVolume * 100) + "%";
    document.getElementById("sfx-volume-output").textContent = Math.round(ns.appSettings.sfxVolume * 100) + "%";
  }

  ns.SettingsUI = {
    init: function () {
      var languageSelect = document.getElementById("language-select");
      var bgmVolume = document.getElementById("bgm-volume");
      var sfxVolume = document.getElementById("sfx-volume");
      var vibrationToggle = document.getElementById("vibration-toggle");
      languageSelect.addEventListener("change", function () {
        ns.appSettings.language = languageSelect.value;
        ns.I18n.applyLanguage(ns.appSettings.language);
        ns.SaveManager.saveSettings(ns.appSettings);
        renderThemes();
      });
      bgmVolume.addEventListener("input", function () {
        ns.appSettings.bgmVolume = Number(bgmVolume.value) / 100;
        ns.AudioManager.setBgmVolume(ns.appSettings.bgmVolume);
        ns.SaveManager.saveSettings(ns.appSettings);
        updateVolumeOutputs();
      });
      sfxVolume.addEventListener("input", function () {
        ns.appSettings.sfxVolume = Number(sfxVolume.value) / 100;
        ns.AudioManager.setSfxVolume(ns.appSettings.sfxVolume);
        ns.AudioManager.playSfx("buttonTap");
        ns.SaveManager.saveSettings(ns.appSettings);
        updateVolumeOutputs();
      });
      vibrationToggle.addEventListener("change", function () {
        ns.appSettings.vibration = vibrationToggle.checked;
        ns.SaveManager.saveSettings(ns.appSettings);
      });
      document.getElementById("clear-save-button").addEventListener("click", function () {
        ns.openModal("confirm-clear-modal");
      });
      document.getElementById("confirm-clear-button").addEventListener("click", function () {
        ns.SaveManager.clearGame();
        ns.closeModal("confirm-clear-modal");
        ns.MainMenuUI.refresh();
      });
      ns.events.on("languagechange", renderThemes);
      this.sync();
    },

    sync: function () {
      document.getElementById("language-select").value = ns.appSettings.language;
      document.getElementById("bgm-volume").value = Math.round(ns.appSettings.bgmVolume * 100);
      document.getElementById("sfx-volume").value = Math.round(ns.appSettings.sfxVolume * 100);
      document.getElementById("vibration-toggle").checked = Boolean(ns.appSettings.vibration);
      updateVolumeOutputs();
      renderThemes();
    }
  };
})(window.DAB = window.DAB || {});
