(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  Game.Sfx = {
    play(engine, id) {
      if (!engine) {
        return;
      }
      const detune = Game.Helpers.rand(-20, 20);
      const table = {
        shoot() {
          engine.tone(880, 0.08, "square", 0.13, { to: 1320, detune });
        },
        hit_segment() {
          engine.noise(0.06, 0.11, 900);
          engine.tone(220, 0.05, "triangle", 0.08, { to: 120, detune });
        },
        hit_head() {
          engine.noise(0.12, 0.16, 1300);
          engine.tone(520, 0.13, "sawtooth", 0.13, { to: 180, detune });
        },
        hit_mushroom() {
          engine.tone(180, 0.05, "sine", 0.08, { to: 130, detune });
        },
        mushroom_destroy() {
          engine.noise(0.12, 0.13, 500);
          engine.tone(120, 0.09, "square", 0.08, { to: 70, detune });
        },
        spider_kill() {
          engine.tone(360, 0.08, "square", 0.12, { to: 720, detune });
          engine.noise(0.1, 0.1, 1500, { delay: 0.04 });
        },
        flea_kill() {
          engine.tone(260, 0.16, "square", 0.12, { to: 900, detune });
        },
        scorpion_kill() {
          engine.tone(130, 0.2, "sawtooth", 0.13, { to: 520, detune });
          engine.noise(0.08, 0.08, 2400);
        },
        player_death() {
          engine.noise(0.42, 0.18, 650);
          engine.tone(500, 0.58, "triangle", 0.12, { to: 55, detune });
        },
        extra_life() {
          [523, 659, 784, 1046].forEach((note, i) => {
            engine.tone(note, 0.1, "square", 0.09, { delay: i * 0.07, detune });
          });
        },
        level_clear() {
          [330, 392, 494, 660, 880].forEach((note, i) => {
            engine.tone(note, 0.12, "triangle", 0.1, { delay: i * 0.08, detune });
          });
        },
        poison_dive() {
          engine.tone(720, 0.18, "sawtooth", 0.1, { to: 95, detune });
          engine.noise(0.16, 0.09, 300);
        },
        ui_move() {
          engine.tone(640, 0.03, "triangle", 0.045, { detune });
        },
        ui_confirm() {
          engine.tone(760, 0.06, "triangle", 0.07, { to: 1020, detune });
        },
        ui_error() {
          engine.tone(120, 0.12, "square", 0.08, { to: 90, detune });
        }
      };
      if (table[id]) {
        table[id]();
      }
    }
  };
})(window);
