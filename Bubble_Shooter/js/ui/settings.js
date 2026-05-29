(function (BS) {
  function save(settings) {
    BS.Storage.saveSettings(settings);
    document.documentElement.setAttribute("data-theme", settings.theme);
    BS.Audio.setBgmVolume(settings.bgmVolume);
    BS.Audio.setSfxVolume(settings.sfxVolume);
    BS.Audio.mute(settings.muted);
  }

  BS.UI.Settings = {
    init: function () {
      this.settings = BS.Storage.getSettings();
      this.themeOptions = document.getElementById("theme-options");
      this.difficultyOptions = document.getElementById("difficulty-options");
      this.sliderBgm = document.getElementById("slider-bgm");
      this.sliderSfx = document.getElementById("slider-sfx");
      this.valueBgm = document.getElementById("value-bgm");
      this.valueSfx = document.getElementById("value-sfx");
      this.toggleMuted = document.getElementById("toggle-muted");
      this.btnBack = document.getElementById("btn-settings-back");
      this.btnReset = document.getElementById("btn-reset-save");

      this.renderThemes();
      this.renderDifficulties();
      this.syncControls();
      this.bind();
      save(this.settings);
    },

    bind: function () {
      var self = this;
      this.btnBack.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.UI.Screens.show("menu");
        BS.UI.Menu.refresh();
      });

      this.sliderBgm.addEventListener("input", function () {
        self.settings.bgmVolume = Number(self.sliderBgm.value) / 100;
        self.syncLabels();
        save(self.settings);
      });

      this.sliderSfx.addEventListener("input", function () {
        self.settings.sfxVolume = Number(self.sliderSfx.value) / 100;
        self.syncLabels();
        save(self.settings);
      });

      this.toggleMuted.addEventListener("change", function () {
        self.settings.muted = self.toggleMuted.checked;
        save(self.settings);
      });

      this.btnReset.addEventListener("click", function () {
        BS.Audio.playSFX("click");
        BS.Storage.clearGame();
        BS.UI.Menu.refresh();
      });
    },

    renderThemes: function () {
      var self = this;
      this.themeOptions.innerHTML = "";
      BS.Core.Config.themes.forEach(function (theme) {
        var button = document.createElement("button");
        var swatch = document.createElement("span");
        var label = document.createElement("strong");

        button.type = "button";
        button.className = "theme-option";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", theme.name === self.settings.theme ? "true" : "false");
        button.dataset.theme = theme.name;

        swatch.className = "theme-swatch";
        theme.swatch.forEach(function (color) {
          var dot = document.createElement("i");
          dot.style.background = color;
          swatch.appendChild(dot);
        });

        label.textContent = theme.label;
        button.appendChild(swatch);
        button.appendChild(label);
        button.addEventListener("click", function () {
          BS.Audio.playSFX("click");
          self.settings.theme = theme.name;
          save(self.settings);
          self.renderThemes();
        });

        if (theme.name === self.settings.theme) {
          button.classList.add("is-selected");
        }
        self.themeOptions.appendChild(button);
      });
    },

    renderDifficulties: function () {
      var self = this;
      this.difficultyOptions.innerHTML = "";

      BS.Core.Config.difficulties.forEach(function (difficulty) {
        var button = document.createElement("button");
        var label = document.createElement("strong");
        var detail = document.createElement("small");

        button.type = "button";
        button.className = "difficulty-option";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", difficulty.name === self.settings.difficulty ? "true" : "false");
        button.dataset.difficulty = difficulty.name;

        label.textContent = difficulty.label;
        detail.textContent = difficulty.description;
        button.appendChild(label);
        button.appendChild(detail);

        button.addEventListener("click", function () {
          BS.Audio.playSFX("click");
          self.settings.difficulty = difficulty.name;
          save(self.settings);
          self.renderDifficulties();
        });

        if (difficulty.name === self.settings.difficulty) {
          button.classList.add("is-selected");
        }

        self.difficultyOptions.appendChild(button);
      });
    },

    syncControls: function () {
      this.sliderBgm.value = Math.round(this.settings.bgmVolume * 100);
      this.sliderSfx.value = Math.round(this.settings.sfxVolume * 100);
      this.toggleMuted.checked = !!this.settings.muted;
      this.syncLabels();
    },

    syncLabels: function () {
      this.valueBgm.textContent = this.sliderBgm.value + "%";
      this.valueSfx.textContent = this.sliderSfx.value + "%";
    }
  };
})(window.BubbleShooter);
