(function () {
  function init() {
    EventBus.on("settings:changed", (settings) => {
      AudioManager.setBGMVolume(settings.bgmVolume);
      AudioManager.setSFXVolume(settings.sfxVolume);
    });

    EventBus.on("screen:changed", ({ screen }) => {
      if (screen === "game") {
        AudioManager.crossfadeBGM("gameplay");
      } else if (screen === "victory") {
        AudioManager.crossfadeBGM("victory");
      } else {
        AudioManager.crossfadeBGM("main_theme");
      }
    });

    EventBus.on("puzzle:clear", () => {
      AudioManager.playSFX("puzzle_clear");
      AudioManager.crossfadeBGM("victory");
    });
  }

  window.BgmController = {
    init,
  };
})();
