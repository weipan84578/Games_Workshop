(function () {
  const saved = GoGame.Storage.settings();
  GoGame.State.updateSettings({ ...GoGame.State.settings(), ...saved });
  GoGame.ThemeSwitcher.switchTheme(GoGame.State.settings().theme);
  GoGame.MenuUI.render();
  GoGame.Router.show("menu");

  document.addEventListener(
    "pointerdown",
    (event) => {
      GoGame.AudioManager.unlock();
      if (event.target.closest("button")) GoGame.AudioManager.play("btn-click");
    },
    { passive: true }
  );
})();
