資產資料夾說明
================

本專案的音效與背景音樂全部以 Web Audio API 即時合成
(見 js/audio/audio-manager.js 與 js/audio/sound-list.js),
因此 audio/bgm 與 audio/sfx 不需要實際 .mp3 檔即可運作。

若想改用真實音檔,可:
  1. 將檔案放入 assets/audio/bgm/ 與 assets/audio/sfx/
  2. 改寫 audio-manager.js,以 HTML5 Audio 物件載入對應鍵值。

images/、fonts/ 為可選資產;目前棋盤、棋子、骰子均以純 CSS 繪製,
字體採系統字優先,皆不需外部檔案。
