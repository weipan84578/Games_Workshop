(function () {
  const renderers = {
    mainMenu: () => Pong.MainMenu.render(),
    gameScreen: (data) => Pong.GameScreen.render(data),
    settingsScreen: (data) => Pong.SettingsScreen.render(data),
    helpScreen: () => Pong.HelpScreen.render()
  };

  const ScreenManager = {
    show(name, data) {
      const renderer = renderers[name];
      if (!renderer) {
        return;
      }

      Pong.GameState.screen = name;
      renderer(data || {});
      const screen = Pong.DOM.qs(".screen", Pong.DOM.app());
      if (screen) {
        screen.classList.add("screen-enter");
      }
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.ScreenManager = ScreenManager;
})();
