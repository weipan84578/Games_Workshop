(function bootstrap(root) {
  "use strict";

  function $(selector) {
    return root.document.querySelector(selector);
  }

  root.document.addEventListener("DOMContentLoaded", function ready() {
    var storage = root.BBQ.StorageManager;
    var i18n = root.BBQ.i18n;
    var audio = new root.BBQ.AudioManager();
    var settings = storage.getSettings();
    audio.applySettings(settings);
    i18n.setLanguage(settings.language);

    var modalLayer = $("#modalLayer");
    var gameScreen = $("#gameScreen");
    var mainMenuScreen = $("#mainMenu");

    var game = new root.BBQ.GameCore({
      canvas: $("#gameCanvas"),
      screen: gameScreen,
      storage: storage,
      i18n: i18n,
      audio: audio,
      onExitToMenu: function onExitToMenu() {
        mainMenu.show();
      },
      elements: {
        menuButton: $("#menuButton"),
        scoreValue: $("#scoreValue"),
        timeValue: $("#timeValue"),
        comboValue: $("#comboValue"),
        orderText: $("#orderText"),
        orderProgress: $("#orderProgress"),
        selectedText: $("#selectedText"),
        messageText: $("#messageText"),
        foodButtons: Array.from(root.document.querySelectorAll("[data-food]")),
        flipButton: $("#flipButton"),
        serveButton: $("#serveButton"),
        discardButton: $("#discardButton"),
        pauseButton: $("#pauseButton")
      }
    });

    var toast = $("#toast");
    var toastTimer = null;
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function hideToast() {
        toast.classList.remove("visible");
      }, 1800);
    }

    var settingsPanel = new root.BBQ.SettingsPanel({
      layer: modalLayer,
      element: $("#settingsModal"),
      storage: storage,
      i18n: i18n,
      audio: audio,
      onResetData: function resetNotice() {
        mainMenu.refresh();
        showToast(i18n.t("status_reset"));
      }
    });

    var instructionsPanel = new root.BBQ.InstructionsPanel({
      layer: modalLayer,
      element: $("#instructionsModal"),
      audio: audio
    });

    var mainMenu = new root.BBQ.MainMenu({
      screen: mainMenuScreen,
      storage: storage,
      audio: audio,
      startButton: $("#startButton"),
      continueButton: $("#continueButton"),
      helpButton: $("#helpButton"),
      settingsButton: $("#settingsButton"),
      callbacks: {
        onStart: function startGame() {
          mainMenu.hide();
          game.newGame();
        },
        onContinue: function continueGame() {
          if (!game.loadGame()) {
            showToast(i18n.t("status_no_save"));
            mainMenu.refresh();
            return;
          }
          mainMenu.hide();
        },
        onHelp: function openHelp() {
          instructionsPanel.open();
        },
        onSettings: function openSettings() {
          settingsPanel.open();
        }
      }
    });

    settingsPanel.bind();
    instructionsPanel.bind();
    mainMenu.bind();
    settingsPanel.apply(settings);

    function removeAudioUnlockListeners() {
      root.document.removeEventListener("pointerdown", requestAudioUnlock, true);
      root.document.removeEventListener("click", requestAudioUnlock, true);
      root.document.removeEventListener("touchend", requestAudioUnlock, true);
      root.document.removeEventListener("keydown", requestAudioUnlock, true);
    }

    function requestAudioUnlock() {
      audio.requestStart(game.state === "playing" ? "game" : "menu").then(function stopRetrying(success) {
        if (success) {
          removeAudioUnlockListeners();
        }
      });
    }

    root.document.addEventListener("pointerdown", requestAudioUnlock, true);
    root.document.addEventListener("click", requestAudioUnlock, true);
    root.document.addEventListener("touchend", requestAudioUnlock, true);
    root.document.addEventListener("keydown", requestAudioUnlock, true);

    root.document.addEventListener("keydown", function closeModal(event) {
      if (event.key === "Escape" && !modalLayer.hidden) {
        Array.from(modalLayer.querySelectorAll(".modal-panel")).forEach(function hide(panel) {
          panel.hidden = true;
        });
        modalLayer.hidden = true;
      }
    });

    audio.setScene("menu");
  });
})(typeof window !== "undefined" ? window : globalThis);
