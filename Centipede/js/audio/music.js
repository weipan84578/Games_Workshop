(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Music = {
    play(engine, id, level) {
      if (engine) {
        engine.startMusic(id, level || 1);
      }
    },

    pause(engine, paused) {
      if (engine) {
        engine.setPaused(paused);
      }
    },

    gameOver(engine) {
      if (engine) {
        engine.playGameOverJingle();
      }
    }
  };
})(window);
