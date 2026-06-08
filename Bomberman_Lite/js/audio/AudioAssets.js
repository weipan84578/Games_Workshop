(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  root.AudioAssets = {
    sfx: [
      "sfx_bomb_place",
      "sfx_bomb_tick",
      "sfx_explosion",
      "sfx_explosion_chain",
      "sfx_player_walk",
      "sfx_player_die",
      "sfx_enemy_die",
      "sfx_powerup_pickup",
      "sfx_brick_destroy",
      "sfx_stage_clear",
      "sfx_stage_start",
      "sfx_game_over",
      "sfx_ui_click",
      "sfx_ui_start",
      "sfx_ui_resume",
      "sfx_boss_appear"
    ],
    bgm: {
      bgm_menu: {
        tempo: 150,
        wave: "square",
        notes: [392, 494, 587, 494, 392, 330, 392, 494, 659, 587, 494, 392]
      },
      bgm_game_easy: {
        tempo: 180,
        wave: "square",
        notes: [330, 392, 440, 392, 330, 294, 330, 392, 523, 440, 392, 330]
      },
      bgm_game_hard: {
        tempo: 215,
        wave: "sawtooth",
        notes: [220, 262, 330, 392, 330, 262, 247, 294, 370, 440, 370, 294]
      },
      bgm_boss: {
        tempo: 128,
        wave: "sawtooth",
        notes: [110, 147, 165, 196, 220, 196, 165, 147, 110, 98, 110, 147]
      }
    }
  };
}());
