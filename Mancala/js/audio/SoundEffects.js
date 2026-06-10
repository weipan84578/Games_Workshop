(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  Mancala.SoundEffects = {
    sfx_stone_drop: [{ freq: 520, end: 300, duration: 0.08, type: "sine", gain: 0.18 }],
    sfx_stone_drop_last: [{ freq: 680, end: 380, duration: 0.12, type: "triangle", gain: 0.22 }],
    sfx_store_score: [{ freq: 520, duration: 0.08, type: "sine", gain: 0.2 }, { freq: 760, offset: 0.07, duration: 0.12, type: "sine", gain: 0.18 }],
    sfx_capture: [{ freq: 260, end: 80, duration: 0.18, type: "sawtooth", gain: 0.16 }, { freq: 720, offset: 0.05, duration: 0.08, type: "square", gain: 0.1 }],
    sfx_extra_turn: [{ freq: 440, duration: 0.08, type: "sine", gain: 0.18 }, { freq: 660, offset: 0.08, duration: 0.1, type: "sine", gain: 0.18 }, { freq: 880, offset: 0.16, duration: 0.12, type: "sine", gain: 0.16 }],
    sfx_button_hover: [{ freq: 700, duration: 0.035, type: "triangle", gain: 0.06 }],
    sfx_button_click: [{ freq: 420, duration: 0.05, type: "triangle", gain: 0.1 }],
    sfx_screen_in: [{ freq: 260, end: 520, duration: 0.16, type: "sine", gain: 0.12 }],
    sfx_screen_out: [{ freq: 520, end: 260, duration: 0.14, type: "sine", gain: 0.1 }],
    sfx_invalid_move: [{ freq: 130, end: 90, duration: 0.18, type: "square", gain: 0.14 }],
    sfx_ai_thinking: [{ freq: 300, duration: 0.08, type: "triangle", gain: 0.08 }, { freq: 360, offset: 0.1, duration: 0.08, type: "triangle", gain: 0.08 }],
    sfx_game_win: [{ freq: 523.25, duration: 0.18, type: "sine", gain: 0.2 }, { freq: 659.25, offset: 0.16, duration: 0.18, type: "sine", gain: 0.2 }, { freq: 783.99, offset: 0.32, duration: 0.32, type: "sine", gain: 0.18 }],
    sfx_game_lose: [{ freq: 392, duration: 0.2, type: "sine", gain: 0.18 }, { freq: 311.13, offset: 0.18, duration: 0.22, type: "sine", gain: 0.18 }, { freq: 246.94, offset: 0.38, duration: 0.35, type: "sine", gain: 0.16 }],
    sfx_game_draw: [{ freq: 440, duration: 0.16, type: "triangle", gain: 0.16 }, { freq: 440, offset: 0.18, duration: 0.16, type: "triangle", gain: 0.16 }],
    sfx_board_reset: [{ freq: 300, end: 700, duration: 0.26, type: "sine", gain: 0.16 }],
    sfx_modal_open: [{ freq: 380, end: 620, duration: 0.12, type: "sine", gain: 0.12 }],
    sfx_modal_close: [{ freq: 620, end: 380, duration: 0.1, type: "sine", gain: 0.1 }]
  };
})(window);
