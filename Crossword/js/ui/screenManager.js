(function () {
  const screens = {
    "main-menu": "screen-main-menu",
    game: "screen-game",
    settings: "screen-settings",
    instructions: "screen-instructions",
    victory: "screen-victory",
  };

  function setContent(screen, html) {
    const element = document.getElementById(screens[screen]);
    if (element) {
      element.innerHTML = html;
    }
  }

  function show(screen) {
    Object.entries(screens).forEach(([name, id]) => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle("active", name === screen);
      }
    });
    AppState.setScreen(screen);
  }

  window.ScreenManager = {
    setContent,
    show,
  };
})();
