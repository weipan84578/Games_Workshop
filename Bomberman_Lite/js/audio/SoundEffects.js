(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  function tone(engine, freq, duration, options) {
    engine.tone(freq, duration, options || {});
  }

  function burst(engine, duration, options) {
    engine.noise(duration, options || {});
  }

  function arpeggio(engine, notes, duration, gap, options) {
    notes.forEach((note, index) => {
      setTimeout(() => tone(engine, note, duration, options), index * gap);
    });
  }

  const registry = {
    sfx_bomb_place(engine) {
      tone(engine, 90, 0.08, { type: "square", gain: 0.18 });
      tone(engine, 170, 0.05, { type: "triangle", gain: 0.08 });
    },
    sfx_bomb_tick(engine) {
      arpeggio(engine, [560, 560, 640, 640], 0.035, 70, { type: "square", gain: 0.06 });
    },
    sfx_explosion(engine) {
      burst(engine, 0.35, { gain: 0.25, lowpass: 900 });
      tone(engine, 70, 0.32, { type: "sawtooth", gain: 0.16 });
    },
    sfx_explosion_chain(engine) {
      burst(engine, 0.45, { gain: 0.28, lowpass: 1200 });
      arpeggio(engine, [120, 90, 60], 0.12, 70, { type: "sawtooth", gain: 0.14 });
    },
    sfx_player_walk(engine) {
      tone(engine, 160, 0.025, { type: "triangle", gain: 0.025 });
    },
    sfx_player_die(engine) {
      arpeggio(engine, [330, 247, 196, 130], 0.18, 120, { type: "square", gain: 0.12 });
      burst(engine, 0.25, { gain: 0.12, lowpass: 500 });
    },
    sfx_enemy_die(engine) {
      arpeggio(engine, [700, 960, 1280], 0.07, 55, { type: "triangle", gain: 0.1 });
    },
    sfx_powerup_pickup(engine) {
      arpeggio(engine, [440, 660, 880, 1320], 0.08, 65, { type: "square", gain: 0.1 });
    },
    sfx_brick_destroy(engine) {
      burst(engine, 0.16, { gain: 0.16, lowpass: 1500 });
    },
    sfx_stage_clear(engine) {
      arpeggio(engine, [523, 659, 784, 1046, 1318], 0.13, 95, { type: "square", gain: 0.12 });
    },
    sfx_stage_start(engine) {
      arpeggio(engine, [262, 330, 392, 523], 0.12, 95, { type: "square", gain: 0.1 });
    },
    sfx_game_over(engine) {
      arpeggio(engine, [392, 330, 262, 196, 130], 0.18, 145, { type: "sawtooth", gain: 0.12 });
    },
    sfx_ui_click(engine) {
      tone(engine, 880, 0.035, { type: "square", gain: 0.06 });
    },
    sfx_ui_start(engine) {
      arpeggio(engine, [392, 523, 659, 784], 0.12, 80, { type: "square", gain: 0.11 });
    },
    sfx_ui_resume(engine) {
      arpeggio(engine, [330, 392, 494], 0.08, 70, { type: "triangle", gain: 0.09 });
    },
    sfx_boss_appear(engine) {
      tone(engine, 55, 0.8, { type: "sawtooth", gain: 0.16 });
      burst(engine, 0.5, { gain: 0.14, lowpass: 320 });
    }
  };

  root.SoundEffects = {
    play(name, engine) {
      if (!registry[name]) return;
      registry[name](engine);
    }
  };
}());
