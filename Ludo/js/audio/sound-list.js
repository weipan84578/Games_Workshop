/* sound-list.js — 所有音效/音樂的鍵值清單(§11)。
   本專案以 Web Audio 合成,不依賴外部 mp3,故清單描述合成參數。 */
(function (L) {
  'use strict';

  L.audio.BGM = {
    bgm_menu:  { tempo: 96,  scale: [0, 4, 7, 11, 12, 7, 4, 9], wave: 'triangle' },
    bgm_game:  { tempo: 120, scale: [0, 3, 5, 7, 10, 7, 5, 3], wave: 'sine' }
  };

  // 每個 SFX 的合成配方:type(tone/noise/sweep/chord)、頻率、時長等
  L.audio.SFX = {
    sfx_dice_roll:        { kind: 'noise', dur: 0.18, freq: 900, gain: 0.12 },
    sfx_dice_land:        { kind: 'tone',  dur: 0.12, freq: 320, wave: 'square', gain: 0.18 },
    sfx_token_move:       { kind: 'tone',  dur: 0.08, freq: 520, wave: 'sine',   gain: 0.12 },
    sfx_token_hop:        { kind: 'tone',  dur: 0.05, freq: 660, wave: 'sine',   gain: 0.10 },
    sfx_capture:          { kind: 'sweep', dur: 0.22, from: 600, to: 120, gain: 0.20 },
    sfx_token_home:       { kind: 'chord', dur: 0.30, freqs: [523, 659, 784], gain: 0.16 },
    sfx_button_click:     { kind: 'tone',  dur: 0.06, freq: 440, wave: 'square', gain: 0.14 },
    sfx_button_hover:     { kind: 'tone',  dur: 0.04, freq: 660, wave: 'sine',   gain: 0.06 },
    sfx_screen_transition:{ kind: 'sweep', dur: 0.20, from: 300, to: 720, gain: 0.10 },
    sfx_turn_start:       { kind: 'chord', dur: 0.18, freqs: [392, 523], gain: 0.12 },
    sfx_win:              { kind: 'chord', dur: 0.6,  freqs: [523, 659, 784, 1047], gain: 0.20 },
    sfx_lose:             { kind: 'sweep', dur: 0.5,  from: 440, to: 110, gain: 0.18 },
    sfx_safe_cell:        { kind: 'tone',  dur: 0.10, freq: 880, wave: 'sine',   gain: 0.10 },
    sfx_illegal:          { kind: 'tone',  dur: 0.16, freq: 160, wave: 'sawtooth',gain: 0.16 },
    sfx_unlock_token:     { kind: 'chord', dur: 0.22, freqs: [440, 660], gain: 0.14 },
    sfx_six_bonus:        { kind: 'chord', dur: 0.26, freqs: [659, 880, 1047], gain: 0.16 },
    sfx_select_token:     { kind: 'tone',  dur: 0.05, freq: 700, wave: 'triangle',gain: 0.10 }
  };
})(window.Ludo);
