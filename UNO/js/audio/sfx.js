(function () {
  window.SFX = {
    play(name) {
      if (window.AudioManager) AudioManager.playSfx(name);
    },

    click() {
      if (window.AudioManager) AudioManager.playSfx("click");
    },
  };
})();
