(function () {
  "use strict";

  var settings = Object.assign({}, window.AppDefaults.settings);
  var currentScene = "scene-home";
  var previousScene = "scene-home";
  var resultScheduled = false;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function applyTheme(theme) {
    var safeTheme = ["classic", "neon", "ocean", "sakura"].indexOf(theme) >= 0 ? theme : "classic";
    document.documentElement.setAttribute("data-theme", safeTheme);
    var stylesheet = byId("theme-stylesheet");
    if (stylesheet) stylesheet.setAttribute("href", "css/themes/theme-" + safeTheme + ".css");
  }

  function saveSettings() {
    window.StorageManager.saveSettings(settings);
    window.AudioManager.configure(settings);
  }

  function setRangeVisual(input) {
    if (!input) return;
    input.style.setProperty("--value-pct", input.value + "%");
  }

  function syncSettingsControls() {
    document.querySelectorAll("[data-setting-lang]").forEach(function (button) {
      var lang = button.getAttribute("data-setting-lang");
      button.classList.toggle("active", lang === settings.lang);
    });
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-theme-choice") === settings.theme);
    });

    var bgm = byId("bgm-volume");
    var sfx = byId("sfx-volume");
    if (bgm) {
      bgm.value = settings.bgm_volume;
      byId("bgm-volume-value").textContent = settings.bgm_volume + "%";
      setRangeVisual(bgm);
    }
    if (sfx) {
      sfx.value = settings.sfx_volume;
      byId("sfx-volume-value").textContent = settings.sfx_volume + "%";
      setRangeVisual(sfx);
    }

    var muteButton = byId("btn-toggle-muted");
    if (muteButton) muteButton.textContent = window.I18n.t(settings.muted ? "settings.muted" : "settings.soundOn");
    var headerMute = byId("btn-mute");
    if (headerMute) headerMute.textContent = settings.muted ? "🔇" : "🔊";
  }

  function refreshStaticText() {
    window.I18n.translate();
    syncSettingsControls();
    updateContinueButton();
  }

  function updateSettings(nextSettings) {
    settings = Object.assign({}, settings, nextSettings);
    applyTheme(settings.theme);
    window.I18n.setLanguage(settings.lang);
    saveSettings();
    refreshStaticText();
    renderGame();
  }

  function showScene(id) {
    document.querySelectorAll(".scene").forEach(function (scene) {
      scene.classList.toggle("active", scene.id === id);
    });
    currentScene = id;
    if (id === "scene-home") updateContinueButton();
    if (id === "scene-game") renderGame();
  }

  function openSettings(fromScene) {
    previousScene = fromScene || currentScene || "scene-home";
    showScene("scene-settings");
  }

  function updateContinueButton() {
    var button = byId("btn-continue");
    if (button) button.disabled = !window.StorageManager.hasSave();
  }

  function renderGame() {
    var state = window.Game.getState();
    window.Renderer.render(state);
    window.HUD.render(state);
  }

  function showResult() {
    var state = window.Game.getState();
    var title = state.winner === state.playerSymbol ? window.I18n.t("result.playerWin") :
      state.winner === state.aiSymbol ? window.I18n.t("result.aiWin") : window.I18n.t("result.draw");
    byId("result-title").textContent = title;
    byId("result-detail").textContent = window.I18n.t("result.detail", {
      moves: state.moveCount,
      time: window.HUD.formatTime(window.Game.getElapsedSeconds())
    });
    if (state.winner === state.playerSymbol) window.Animations.confetti();
    showScene("scene-result");
  }

  function handleGameChange(state) {
    renderGame();
    updateContinueButton();
    if (state.phase === "ended" && !resultScheduled) {
      resultScheduled = true;
      window.setTimeout(function () {
        resultScheduled = false;
        showResult();
      }, 850);
    }
  }

  function startGame(config) {
    var gameConfig = typeof config === "string" ? { difficulty: config, playerSymbol: "X" } :
      (config || { difficulty: "normal", playerSymbol: "X" });
    resultScheduled = false;
    window.Game.start(gameConfig.difficulty, gameConfig.playerSymbol);
    showScene("scene-game");
  }

  function bindNavigation() {
    byId("btn-start").addEventListener("click", function () {
      window.AudioManager.play("click");
      window.Modal.showDifficulty(startGame);
    });
    byId("btn-continue").addEventListener("click", function () {
      if (window.Game.loadProgress()) showScene("scene-game");
    });
    byId("btn-help").addEventListener("click", function () { showScene("scene-help"); });
    byId("btn-settings").addEventListener("click", function () { openSettings("scene-home"); });
    byId("btn-help-back").addEventListener("click", function () { showScene("scene-home"); });
    byId("btn-settings-back").addEventListener("click", function () { showScene(previousScene || "scene-home"); });
    byId("btn-back").addEventListener("click", function () {
      window.Game.saveProgress();
      showScene("scene-home");
    });
    byId("btn-settings-ingame").addEventListener("click", function () { openSettings("scene-game"); });
    byId("btn-play-again").addEventListener("click", function () {
      startGame({
        difficulty: window.Game.getState().difficulty,
        playerSymbol: window.Game.getState().playerSymbol || "X"
      });
    });
    byId("btn-result-home").addEventListener("click", function () {
      showScene("scene-home");
    });
  }

  function bindGameControls() {
    byId("mega-board").addEventListener("click", function (event) {
      var cell = event.target.closest(".cell");
      if (!cell) return;
      window.Game.makeMove(
        Number(cell.dataset.br),
        Number(cell.dataset.bc),
        Number(cell.dataset.cr),
        Number(cell.dataset.cc)
      );
    });
    byId("btn-restart").addEventListener("click", function () {
      window.Modal.confirm(window.I18n.t("game.confirmRestart"), function () {
        window.Game.restart();
      });
    });
    byId("btn-undo").addEventListener("click", function () {
      window.Game.undo();
    });
    byId("btn-mute").addEventListener("click", function () {
      settings.muted = window.AudioManager.toggleMuted();
      saveSettings();
      syncSettingsControls();
    });
  }

  function bindSettings() {
    document.querySelectorAll("[data-setting-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        var lang = button.getAttribute("data-setting-lang");
        updateSettings({ lang: lang });
      });
    });
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateSettings({ theme: button.getAttribute("data-theme-choice") });
      });
    });
    ["bgm", "sfx"].forEach(function (kind) {
      var input = byId(kind + "-volume");
      input.addEventListener("input", function () {
        var key = kind === "bgm" ? "bgm_volume" : "sfx_volume";
        var value = Number(input.value);
        settings[key] = value;
        byId(kind + "-volume-value").textContent = value + "%";
        setRangeVisual(input);
        saveSettings();
      });
    });
    byId("btn-toggle-muted").addEventListener("click", function () {
      settings.muted = !settings.muted;
      saveSettings();
      if (settings.muted) window.AudioManager.stopBgm();
      else window.AudioManager.startBgm();
      syncSettingsControls();
    });
    byId("btn-reset-settings").addEventListener("click", function () {
      settings = Object.assign({}, window.AppDefaults.settings);
      applyTheme(settings.theme);
      window.I18n.setLanguage(settings.lang);
      saveSettings();
      refreshStaticText();
    });
  }

  function bindHelp() {
    document.querySelectorAll(".accordion-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".accordion-item");
        var open = !item.classList.contains("open");
        item.classList.toggle("open", open);
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function init() {
    settings = window.StorageManager.loadSettings();
    window.AudioManager.configure(settings);
    applyTheme(settings.theme);
    window.I18n.setLanguage(settings.lang);
    bindNavigation();
    bindGameControls();
    bindSettings();
    bindHelp();
    window.Game.onChange(handleGameChange);
    refreshStaticText();
    showScene("scene-home");

    window.setInterval(function () {
      if (currentScene === "scene-game" && window.Game.getState().phase === "playing") {
        window.HUD.render(window.Game.getState());
      }
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);

  window.App = {
    showScene: showScene,
    showResult: showResult,
    updateSettings: updateSettings
  };
})();
