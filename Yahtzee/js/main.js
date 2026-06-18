window.YZ = window.YZ || {};

document.addEventListener("DOMContentLoaded", function () {
  YZ.Audio.init();
  YZ.Settings.load();
  YZ.I18n.init();

  document.addEventListener("pointerdown", function unlockAudio() {
    YZ.Audio.unlock();
    document.removeEventListener("pointerdown", unlockAudio);
  });

  YZ.Game.subscribe(function () {
    if (YZ.ScreenManager && YZ.ScreenManager.getCurrent() === "game") {
      YZ.GameUI.render();
    }
    if (YZ.ScreenManager && YZ.ScreenManager.getCurrent() === "menu") {
      YZ.MainMenu.render();
    }
  });

  YZ.ScreenManager.init();
});
