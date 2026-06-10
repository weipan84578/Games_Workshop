(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AnimationManager(audioEngine) {
    this.audio = audioEngine;
    this.reducedMotion = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  AnimationManager.prototype.animateMove = function(result) {
    var self = this;
    if (!result || !result.valid || this.reducedMotion || !result.path.length) {
      return Promise.resolve();
    }

    var source = document.querySelector('[data-board-index="' + result.pitIndex + '"]');
    if (source) {
      source.classList.add("pit--lifting");
      global.setTimeout(function() {
        source.classList.remove("pit--lifting");
      }, 180);
    }

    return new Promise(function(resolve) {
      var i = 0;
      function step() {
        if (i >= result.path.length) {
          finishSpecialEffects(result, self.audio);
          resolve();
          return;
        }

        var index = result.path[i];
        var node = document.querySelector('[data-board-index="' + index + '"]');
        if (node) {
          node.classList.add("pit--receiving");
          global.setTimeout(function() {
            node.classList.remove("pit--receiving");
          }, 155);
        }

        self.audio.play(i === result.path.length - 1 ? "sfx_stone_drop_last" : "sfx_stone_drop");
        i += 1;
        global.setTimeout(step, 82);
      }
      step();
    });
  };

  function finishSpecialEffects(result, audio) {
    if (result.capture) {
      var capturePit = document.querySelector('[data-board-index="' + result.capture.pit + '"]');
      var oppositePit = document.querySelector('[data-board-index="' + result.capture.oppositePit + '"]');
      [capturePit, oppositePit].forEach(function(node) {
        if (!node) {
          return;
        }
        node.classList.add("pit--capture");
        global.setTimeout(function() {
          node.classList.remove("pit--capture");
        }, 360);
      });
      audio.play("sfx_capture");
    } else if (result.extraTurn) {
      audio.play("sfx_extra_turn");
    } else if (result.lastIndex === 6 || result.lastIndex === 13) {
      audio.play("sfx_store_score");
    }
  }

  Mancala.AnimationManager = AnimationManager;
})(window);
