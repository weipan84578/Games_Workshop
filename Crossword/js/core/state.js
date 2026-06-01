(function () {
  const state = {
    settings: GameStorage.loadSettings(),
    activeScreen: "main-menu",
    difficulty: null,
    puzzle: null,
    model: null,
    userGrid: null,
    selected: null,
    direction: Helpers.DIRECTIONS.ACROSS,
    activeEntryId: null,
    hintsRemaining: 0,
    elapsedSeconds: 0,
    mistakes: 0,
    hintsUsed: 0,
    completed: false,
  };

  function setSettings(patch) {
    state.settings = { ...state.settings, ...patch };
    GameStorage.saveSettings(state.settings);
    document.documentElement.setAttribute("data-theme", state.settings.theme);
    document.documentElement.setAttribute("data-font-size", state.settings.fontSize);
    EventBus.emit("settings:changed", state.settings);
  }

  function setScreen(screen) {
    state.activeScreen = screen;
    EventBus.emit("screen:changed", { screen });
  }

  function resetGameSession() {
    state.difficulty = null;
    state.puzzle = null;
    state.model = null;
    state.userGrid = null;
    state.selected = null;
    state.direction = Helpers.DIRECTIONS.ACROSS;
    state.activeEntryId = null;
    state.hintsRemaining = 0;
    state.elapsedSeconds = 0;
    state.mistakes = 0;
    state.hintsUsed = 0;
    state.completed = false;
  }

  window.AppState = {
    state,
    setSettings,
    setScreen,
    resetGameSession,
  };
})();
