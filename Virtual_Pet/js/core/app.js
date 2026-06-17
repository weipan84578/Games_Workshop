window.VP = window.VP || {};

VP.App = (function () {
  var settings = null;
  var modalResolve = null;

  function applyTheme(theme) {
    var safeTheme = ["candy", "ocean", "forest", "night", "sunset"].indexOf(theme) >= 0 ? theme : "candy";
    var link = VP.dom.$("#theme-style");
    document.documentElement.setAttribute("data-theme", safeTheme);
    if (link) {
      link.setAttribute("href", "css/themes/theme-" + safeTheme + ".css");
    }
  }

  function applyVisualSettings(nextSettings) {
    applyTheme(nextSettings.theme);
    document.documentElement.setAttribute("data-reduced-motion", nextSettings.reducedMotion ? "true" : "false");
    document.documentElement.style.setProperty("--text-scale", String((nextSettings.textScale || 100) / 100));
  }

  function applySettings(nextSettings, options) {
    settings = Object.assign({}, settings || {}, nextSettings || {});
    applyVisualSettings(settings);
    VP.AudioManager.syncSettings(settings);
    VP.SaveManager.persistSettings(settings);
    VP.GameState.updateSettings(settings);
    if (VP.i18n.getLang() !== settings.lang) {
      VP.i18n.setLang(settings.lang);
    }
    if (!options || !options.quiet) {
      VP.App.toast(VP.i18n.t("settings.saved"));
    }
    VP.EventBus.emit("settings:changed", settings);
  }

  function toast(message) {
    var region = VP.dom.$("#toast-region");
    if (!region || !message) {
      return;
    }
    var item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(function () {
      item.classList.add("is-leaving");
      window.setTimeout(function () {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 210);
    }, 2600);
  }

  function closeModal(result) {
    var backdrop = VP.dom.$("#modal-backdrop");
    if (backdrop) {
      backdrop.hidden = true;
    }
    if (modalResolve) {
      modalResolve(result);
      modalResolve = null;
    }
  }

  function confirm(options) {
    options = options || {};
    var backdrop = VP.dom.$("#modal-backdrop");
    VP.dom.$("#modal-title").textContent = options.title || VP.i18n.t("common.confirm");
    VP.dom.$("#modal-message").textContent = options.message || "";
    if (backdrop) {
      backdrop.hidden = false;
    }

    modalResolve = function (ok) {
      if (ok && typeof options.onConfirm === "function") {
        options.onConfirm();
      }
      if (!ok && typeof options.onCancel === "function") {
        options.onCancel();
      }
    };
  }

  function startNewGame() {
    VP.AudioManager.unlock().then(function () {
      VP.GameState.newGame(settings);
      VP.SceneManager.show("game-screen");
      VP.App.toast(VP.i18n.t("speech.ready"));
    });
  }

  function continueGame() {
    var save = VP.SaveManager.load();
    if (!save) {
      VP.AudioManager.playSfx("error");
      toast(VP.i18n.t("menu.noSave"));
      return;
    }
    VP.AudioManager.unlock().then(function () {
      settings = Object.assign({}, settings, save);
      applyVisualSettings(settings);
      VP.AudioManager.syncSettings(settings);
      VP.i18n.setLang(settings.lang);
      VP.GameState.loadGame(save, settings);
      VP.SceneManager.show("game-screen");
    });
  }

  function wireModal() {
    VP.dom.on(VP.dom.$("#modal-cancel"), "click", function () {
      VP.AudioManager.playSfx("click");
      closeModal(false);
    });
    VP.dom.on(VP.dom.$("#modal-confirm"), "click", function () {
      VP.AudioManager.playSfx("confirm");
      closeModal(true);
    });
    VP.dom.on(VP.dom.$("#modal-backdrop"), "click", function (event) {
      if (event.target.id === "modal-backdrop") {
        closeModal(false);
      }
    });
  }

  function wireAudioGestures() {
    document.addEventListener("pointerdown", function () {
      VP.AudioManager.unlock();
    }, { once: true });

    document.addEventListener("click", function (event) {
      if (event.target.closest("button")) {
        VP.AudioManager.playSfx("click");
      }
    });

    document.addEventListener("mouseenter", function (event) {
      if (event.target && event.target.closest && event.target.closest("button")) {
        VP.AudioManager.playSfx("hover");
      }
    }, true);
  }

  function init() {
    settings = VP.SaveManager.loadSettings();
    applyVisualSettings(settings);
    VP.i18n.init(settings.lang);
    VP.AudioManager.syncSettings(settings);

    wireModal();
    wireAudioGestures();
    VP.SceneManager.init();
    VP.MainMenu.init();
    VP.GameScreen.init();
    VP.InstructionsPanel.init();
    VP.SettingsPanel.init(settings);

    VP.EventBus.on("i18n:changed", function () {
      VP.InstructionsPanel.render();
      VP.MainMenu.updateContinueState();
    });

    VP.SceneManager.show("main-menu");
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    applySettings: applySettings,
    startNewGame: startNewGame,
    continueGame: continueGame,
    confirm: confirm,
    toast: toast
  };
})();
