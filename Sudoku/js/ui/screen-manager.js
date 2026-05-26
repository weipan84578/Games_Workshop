(function (global) {
  "use strict";

  const screens = ["home", "game", "instructions", "settings"];
  let activeScreen = "home";
  let selectedDifficulty = "easy";

  function screenElement(name) {
    return document.getElementById(`${name}-screen`);
  }

  function emitScreenChange(from, to) {
    document.dispatchEvent(new CustomEvent("sudoku:screenChange", {
      detail: { from, to },
    }));
  }

  function show(name) {
    if (!screens.includes(name)) {
      return;
    }

    const previous = activeScreen;
    screens.forEach((screen) => {
      screenElement(screen).classList.toggle("is-active", screen === name);
    });
    activeScreen = name;
    updateHome();
    emitScreenChange(previous, name);
  }

  function setLoading(active) {
    const loading = document.getElementById("game-loading");
    if (loading) {
      loading.hidden = !active;
    }
  }

  function setSelectedDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    document.querySelectorAll("[data-difficulty]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.difficulty === difficulty);
    });
  }

  function updateHome() {
    const continueButton = document.getElementById("continue-game-btn");
    if (continueButton) {
      continueButton.disabled = !global.GameState.hasSave();
    }
  }

  function startNewGame(difficulty) {
    if (difficulty) {
      setSelectedDifficulty(difficulty);
    }
    show("game");
    setLoading(true);
    window.setTimeout(() => {
      global.GameState.newGame(selectedDifficulty);
      setLoading(false);
      updateHome();
    }, 30);
  }

  function continueGame() {
    const loaded = global.GameState.loadSaved();
    if (!loaded) {
      global.ToastManager.show("找不到可繼續的存檔。", "danger");
      updateHome();
      return;
    }
    show("game");
  }

  function syncSettingsControls() {
    const settings = global.SettingsState.get();
    document.getElementById("theme-select").value = settings.theme;
    document.getElementById("bgm-volume").value = settings.bgmVolume;
    document.getElementById("sfx-volume").value = settings.sfxVolume;
    document.getElementById("bgm-enabled").checked = settings.bgmEnabled;
    document.getElementById("sfx-enabled").checked = settings.sfxEnabled;
    document.getElementById("error-limit").value = String(settings.errorLimit);
    document.getElementById("show-timer").checked = settings.showTimer;
    document.getElementById("auto-highlight").checked = settings.autoHighlight;
    document.getElementById("validate-on-input").checked = settings.validateOnInput;
  }

  function bindSettingsControls() {
    const map = [
      ["theme-select", "theme", "value"],
      ["bgm-volume", "bgmVolume", "number"],
      ["sfx-volume", "sfxVolume", "number"],
      ["bgm-enabled", "bgmEnabled", "checked"],
      ["sfx-enabled", "sfxEnabled", "checked"],
      ["error-limit", "errorLimit", "value"],
      ["show-timer", "showTimer", "checked"],
      ["auto-highlight", "autoHighlight", "checked"],
      ["validate-on-input", "validateOnInput", "checked"],
    ];

    map.forEach(([id, key, mode]) => {
      const control = document.getElementById(id);
      control.addEventListener("input", () => {
        const value = mode === "checked"
          ? control.checked
          : mode === "number"
            ? Number(control.value)
            : control.value;
        global.SettingsState.set(key, value);
      });
    });

    document.getElementById("reset-settings-btn").addEventListener("click", () => {
      global.SettingsState.reset();
      syncSettingsControls();
      global.ToastManager.show("設定已還原。", "accent");
    });

    document.getElementById("clear-save-btn").addEventListener("click", () => {
      global.GameState.clearSave();
      updateHome();
      global.ToastManager.show("存檔已清除。", "accent");
    });
  }

  function bindNavigation() {
    document.querySelectorAll("[data-screen-target]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.screenTarget === "home") {
          global.GameState.save();
        }
        show(button.dataset.screenTarget);
      });
    });

    document.querySelectorAll("[data-difficulty]").forEach((button) => {
      button.addEventListener("click", () => setSelectedDifficulty(button.dataset.difficulty));
    });

    document.getElementById("new-game-btn").addEventListener("click", () => startNewGame());
    document.getElementById("continue-game-btn").addEventListener("click", continueGame);
    document.getElementById("back-home-btn").addEventListener("click", () => {
      global.GameState.save();
      show("home");
    });
  }

  global.ScreenManager = {
    init() {
      bindNavigation();
      bindSettingsControls();
      syncSettingsControls();
      setSelectedDifficulty(selectedDifficulty);
      updateHome();
      show("home");
    },
    show,
    startNewGame,
    continueGame,
    updateHome,
    getActiveScreen() {
      return activeScreen;
    },
    getSelectedDifficulty() {
      return selectedDifficulty;
    },
  };
})(window);
