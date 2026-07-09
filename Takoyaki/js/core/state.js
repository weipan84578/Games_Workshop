(function registerState(app) {
  "use strict";

  const state = {
    screen: "main-menu",
    settings: app.Storage.getSettings(),
    selectedTool: "batter",
    game: null
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  app.State = {
    get() {
      return state;
    },

    setScreen(screen) {
      state.screen = screen;
      document.body.dataset.screen = screen;
      app.EventBus.emit("screen:changed", screen);
    },

    setSelectedTool(toolId) {
      state.selectedTool = toolId;
      app.EventBus.emit("tool:changed", toolId);
    },

    updateSettings(partial) {
      state.settings = { ...state.settings, ...partial };
      app.Storage.saveSettings(state.settings);
      app.EventBus.emit("settings:changed", clone(state.settings));
    },

    resetSettings() {
      app.Storage.resetSettings();
      state.settings = app.Storage.getSettings();
      app.EventBus.emit("settings:changed", clone(state.settings));
    },

    setGame(gameState) {
      state.game = gameState;
      app.EventBus.emit("game:changed", gameState);
    },

    saveGame() {
      if (!state.game) {
        return false;
      }
      return app.Storage.saveProgress({
        levelId: state.game.level.id,
        score: state.game.score,
        stars: state.game.stars,
        completed: state.game.completed,
        timeLeft: Math.max(0, Math.ceil(state.game.timeLeft))
      });
    },

    loadProgress() {
      return app.Storage.getProgress();
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
