(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var settings = null;
  var onChange = null;
  var onClear = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function setSegmentValue(container, value) {
    var buttons = container.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i += 1) {
      var active = buttons[i].getAttribute("data-value") === value;
      buttons[i].classList.toggle("is-active", active);
      buttons[i].setAttribute("aria-checked", active ? "true" : "false");
    }
  }

  function emit() {
    if (onChange) {
      onChange(Object.assign({}, settings));
    }
  }

  function hydrate(nextSettings) {
    settings = Object.assign({}, nextSettings);
    byId("setting-language").value = settings.language;
    byId("setting-music").checked = settings.musicEnabled;
    byId("setting-sfx").checked = settings.sfxEnabled;
    byId("setting-volume").value = String(Math.round(settings.volume * 100));
    setSegmentValue(byId("setting-difficulty"), settings.difficulty);
    setSegmentValue(byId("setting-theme"), settings.theme);
  }

  function init(initialSettings, changeHandler, clearHandler) {
    settings = Object.assign({}, initialSettings);
    onChange = changeHandler;
    onClear = clearHandler;

    byId("setting-language").addEventListener("change", function (event) {
      settings.language = event.target.value;
      emit();
    });
    byId("setting-music").addEventListener("change", function (event) {
      settings.musicEnabled = event.target.checked;
      emit();
    });
    byId("setting-sfx").addEventListener("change", function (event) {
      settings.sfxEnabled = event.target.checked;
      emit();
    });
    byId("setting-volume").addEventListener("input", function (event) {
      settings.volume = Number(event.target.value) / 100;
      emit();
    });
    byId("setting-difficulty").addEventListener("click", function (event) {
      if (event.target.matches("button[data-value]")) {
        settings.difficulty = event.target.getAttribute("data-value");
        setSegmentValue(event.currentTarget, settings.difficulty);
        emit();
      }
    });
    byId("setting-theme").addEventListener("click", function (event) {
      if (event.target.matches("button[data-value]")) {
        settings.theme = event.target.getAttribute("data-value");
        setSegmentValue(event.currentTarget, settings.theme);
        emit();
      }
    });
    byId("btn-clear-save").addEventListener("click", function () {
      if (onClear) {
        onClear();
      }
    });

    hydrate(settings);
  }

  NMM.SettingsController = {
    init: init,
    hydrate: hydrate
  };
})(window);
