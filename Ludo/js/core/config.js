/* config.js — 全域常數設定:玩家顏色、起始偏移、安全格、規則、音量預設。 */
(function (L) {
  'use strict';

  L.config = {
    BOARD_GRID: 15,            // 15x15 棋盤
    LOOP_LENGTH: 52,           // 外圈主走道格數
    HOME_COL_LENGTH: 5,        // 終點通道格數(不含中央)
    FINISH_REL: 56,            // 相對終點位置(0..50 主走道、51..55 通道、56 中央)
    TOKENS_PER_PLAYER: 4,

    // 玩家索引 → 顏色鍵(對應規格 player-1..4)
    COLORS: ['red', 'green', 'yellow', 'blue'],
    COLOR_NAMES: { red: '紅', green: '綠', yellow: '黃', blue: '藍' },

    // 各色起始格在主走道(0..51)的絕對索引
    START_OFFSET: { 0: 0, 1: 13, 2: 26, 3: 39 },

    // 安全格(絕對索引):4 個起始格 + 4 個星號格
    SAFE_CELLS: [0, 8, 13, 21, 26, 34, 39, 47],

    // AI 思考延遲(毫秒)範圍
    AI_DELAY_MIN: 400,
    AI_DELAY_MAX: 900,

    // 規則可設定項(§8.8)
    rules: {
      exactFinish: true,      // 進終點需精確點數
      threeSixForfeit: true,  // 連三 6 作廢
      captureBonusRoll: false,// 吃子獎勵額外擲骰
      blockFortress: true     // 兩顆以上同格形成堡壘,不可穿越或停留
    },

    // 設定預設值
    defaults: {
      theme: 'classic',
      language: 'zh-Hant',
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      muted: false,
      animSpeed: 1            // 1=正常, 2=快, 0=關閉動畫
    },

    THEMES: ['classic', 'ocean', 'sunset', 'forest', 'night', 'high-contrast'],
    THEME_NAMES: {
      classic: '經典', ocean: '海洋', sunset: '夕陽',
      forest: '森林', night: '夜間', 'high-contrast': '高對比'
    },
    LANGUAGES: ['zh-Hant', 'en', 'ja'],

    SAVE_KEY: 'ludo_save',
    SETTINGS_KEY: 'ludo_settings',
    VERSION: 'v1.0'
  };
})(window.Ludo);
