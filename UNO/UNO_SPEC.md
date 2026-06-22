# 🃏 UNO 遊戲規格書（完整版）

> **版本**：v1.0.0　**日期**：2026-06-22　**類型**：純前端單頁應用

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [響應式設計（RWD）規範](#4-響應式設計rwd規範)
5. [多國語系（i18n）](#5-多國語系i18n)
6. [視覺設計系統](#6-視覺設計系統)
7. [牌面設計規範](#7-牌面設計規範)
8. [音效與音樂系統](#8-音效與音樂系統)
9. [畫面與功能規格](#9-畫面與功能規格)
10. [遊戲邏輯規格](#10-遊戲邏輯規格)
11. [AI 對手系統](#11-ai-對手系統)
12. [說明頁面規格](#12-說明頁面規格)
13. [設定頁面規格](#13-設定頁面規格)
14. [存檔與繼續遊戲](#14-存檔與繼續遊戲)
15. [動畫與特效](#15-動畫與特效)
16. [無障礙與效能](#16-無障礙與效能)
17. [錯誤處理](#17-錯誤處理)

---

## 1. 專案概述

### 1.1 目標

製作一款可直接在瀏覽器開啟（雙擊 `index.html`）、無需任何建置流程或伺服器的 UNO 紙牌遊戲，支援玩家對戰 AI，並具備完整的視覺、音效與多語言體驗。

### 1.2 核心限制

| 項目 | 規格 |
|------|------|
| 執行方式 | 雙擊 `index.html` 即可開啟，無需 build、無需 server |
| 語言 | 純 HTML5 + CSS3 + Vanilla JavaScript（ES6+） |
| 依賴 | 僅允許本地引入的靜態資源（字型、音效、圖示），禁止使用需要 npm 的框架 |
| 外部 CDN | 允許引入 Google Fonts（字型用），其餘所有資源須本地化 |
| 儲存 | 使用 `localStorage` 進行存檔、設定保存 |

### 1.3 遊戲模式

- **玩家 vs AI**（本版本唯一模式）
- AI 難度：簡單（Easy）/ 普通（Normal）/ 困難（Hard）

---

## 2. 技術架構

### 2.1 模組化設計原則

所有 CSS 按功能分類為多個檔案，JavaScript 按模組分類，`index.html` 以 `<link>` 和 `<script>` 標籤引入，不使用 `import/export`（保持 file:// 協議相容性）。

### 2.2 JavaScript 載入順序

```html
<!-- 工具函式（最優先）-->
<script src="js/utils/helpers.js"></script>
<script src="js/utils/storage.js"></script>
<script src="js/utils/i18n.js"></script>

<!-- 核心設定 -->
<script src="js/config/constants.js"></script>
<script src="js/config/themes.js"></script>

<!-- 音效系統 -->
<script src="js/audio/audioManager.js"></script>
<script src="js/audio/sfx.js"></script>

<!-- 遊戲核心 -->
<script src="js/game/deck.js"></script>
<script src="js/game/card.js"></script>
<script src="js/game/player.js"></script>
<script src="js/game/rules.js"></script>
<script src="js/game/ai.js"></script>
<script src="js/game/gameState.js"></script>

<!-- UI 元件 -->
<script src="js/ui/cardRenderer.js"></script>
<script src="js/ui/handRenderer.js"></script>
<script src="js/ui/tableRenderer.js"></script>
<script src="js/ui/animationController.js"></script>
<script src="js/ui/modal.js"></script>
<script src="js/ui/toast.js"></script>

<!-- 畫面控制器 -->
<script src="js/screens/mainMenu.js"></script>
<script src="js/screens/gameScreen.js"></script>
<script src="js/screens/helpScreen.js"></script>
<script src="js/screens/settingsScreen.js"></script>

<!-- 入口點（最後載入）-->
<script src="js/app.js"></script>
```

### 2.3 CSS 載入順序

```html
<!-- 重置與基礎變數 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/base/animations.css">

<!-- 元件 -->
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/cards.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/toast.css">
<link rel="stylesheet" href="css/components/slider.css">
<link rel="stylesheet" href="css/components/toggle.css">

<!-- 畫面 -->
<link rel="stylesheet" href="css/screens/mainMenu.css">
<link rel="stylesheet" href="css/screens/game.css">
<link rel="stylesheet" href="css/screens/help.css">
<link rel="stylesheet" href="css/screens/settings.css">

<!-- RWD（最後載入，覆蓋前述樣式）-->
<link rel="stylesheet" href="css/responsive/tablet.css">
<link rel="stylesheet" href="css/responsive/mobile.css">
<link rel="stylesheet" href="css/responsive/landscape.css">
```

---

## 3. 資料夾結構

```
uno-game/
│
├── index.html                    # 主入口，引入所有資源
│
├── css/
│   ├── base/
│   │   ├── reset.css             # CSS Reset / Normalize
│   │   ├── variables.css         # CSS 自定義屬性（顏色、字型、間距等）
│   │   ├── typography.css        # 全域字體規格
│   │   └── animations.css        # 全域動畫 keyframes
│   │
│   ├── components/
│   │   ├── buttons.css           # 按鈕元件（所有按鈕樣式）
│   │   ├── cards.css             # 牌面 SVG 樣式
│   │   ├── modal.css             # 彈出視窗
│   │   ├── toast.css             # 提示訊息
│   │   ├── slider.css            # 音量滑桿
│   │   └── toggle.css            # 開關元件
│   │
│   ├── screens/
│   │   ├── mainMenu.css          # 主選單畫面
│   │   ├── game.css              # 遊戲畫面（桌面、手牌、控制列）
│   │   ├── help.css              # 說明畫面
│   │   └── settings.css          # 設定畫面
│   │
│   └── responsive/
│       ├── tablet.css            # 平板斷點（768px–1024px）
│       ├── mobile.css            # 手機斷點（< 768px）
│       └── landscape.css         # 橫向手機特殊處理
│
├── js/
│   ├── utils/
│   │   ├── helpers.js            # 通用工具函式（shuffle、clamp、debounce 等）
│   │   ├── storage.js            # localStorage 封裝（存檔、讀檔、清除）
│   │   └── i18n.js               # 多語言系統核心
│   │
│   ├── config/
│   │   ├── constants.js          # 遊戲常數（牌種、顏色、規則參數）
│   │   ├── themes.js             # 配色主題定義
│   │   └── locales/
│   │       ├── zh-TW.js          # 繁體中文語系
│   │       ├── zh-CN.js          # 簡體中文語系
│   │       ├── en.js             # 英文語系
│   │       └── ja.js             # 日文語系
│   │
│   ├── audio/
│   │   ├── audioManager.js       # 音效總管（Web Audio API 封裝）
│   │   └── sfx.js                # 音效事件對應表
│   │
│   ├── game/
│   │   ├── deck.js               # 牌組生成、洗牌、抽牌
│   │   ├── card.js               # 牌的資料結構與方法
│   │   ├── player.js             # 玩家物件（手牌管理）
│   │   ├── rules.js              # 遊戲規則判斷
│   │   ├── ai.js                 # AI 決策引擎
│   │   └── gameState.js          # 遊戲狀態機（主邏輯）
│   │
│   ├── ui/
│   │   ├── cardRenderer.js       # 生成牌面 SVG DOM 元素
│   │   ├── handRenderer.js       # 手牌排列與互動
│   │   ├── tableRenderer.js      # 桌面（棄牌堆、牌組、方向指示）
│   │   ├── animationController.js# 動畫序列控制
│   │   ├── modal.js              # 彈窗管理
│   │   └── toast.js              # Toast 訊息
│   │
│   ├── screens/
│   │   ├── mainMenu.js           # 主選單邏輯
│   │   ├── gameScreen.js         # 遊戲畫面邏輯
│   │   ├── helpScreen.js         # 說明頁邏輯
│   │   └── settingsScreen.js     # 設定頁邏輯
│   │
│   └── app.js                    # 程式入口，路由管理、畫面切換
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── menu_theme.mp3    # 主選單 BGM
│   │   │   ├── game_chill.mp3    # 遊戲中 BGM（輕鬆）
│   │   │   ├── game_intense.mp3  # 遊戲中 BGM（緊張，剩少牌時）
│   │   │   └── victory.mp3       # 勝利音樂
│   │   │
│   │   └── sfx/
│   │       ├── card_deal.mp3     # 發牌音效
│   │       ├── card_play.mp3     # 出牌音效
│   │       ├── card_draw.mp3     # 抽牌音效
│   │       ├── card_shuffle.mp3  # 洗牌音效
│   │       ├── card_flip.mp3     # 翻牌音效
│   │       ├── uno_call.mp3      # 喊 UNO 音效
│   │       ├── wild_select.mp3   # 選顏色音效
│   │       ├── skip_turn.mp3     # 跳過音效
│   │       ├── reverse.mp3       # 反轉音效
│   │       ├── draw_two.mp3      # +2 音效
│   │       ├── draw_four.mp3     # +4 音效
│   │       ├── win.mp3           # 贏牌音效
│   │       ├── lose.mp3          # 輸牌音效
│   │       ├── button_click.mp3  # 按鈕點擊音效
│   │       ├── button_hover.mp3  # 按鈕懸停音效
│   │       ├── screen_transition.mp3 # 畫面切換音效
│   │       ├── timer_tick.mp3    # 倒數音效
│   │       ├── countdown_end.mp3 # 倒數結束音效
│   │       ├── ai_think.mp3      # AI 思考音效
│   │       └── error.mp3         # 錯誤提示音效
│   │
│   ├── fonts/
│   │   └── （Google Fonts 線上引入，本地備援字型放此）
│   │
│   └── icons/
│       ├── ui/                   # UI 圖示（SVG）
│       │   ├── settings.svg
│       │   ├── help.svg
│       │   ├── back.svg
│       │   ├── volume.svg
│       │   ├── mute.svg
│       │   ├── music.svg
│       │   └── language.svg
│       └── card-symbols/         # 牌面符號 SVG
│           ├── skip.svg
│           ├── reverse.svg
│           ├── draw-two.svg
│           ├── wild.svg
│           └── wild-draw-four.svg
│
└── README.md                     # 說明文件
```

---

## 4. 響應式設計（RWD）規範

### 4.1 斷點定義

```css
/* css/base/variables.css 中定義 */
:root {
  --bp-mobile:  480px;   /* 手機直向 */
  --bp-tablet:  768px;   /* 平板 / 大手機橫向 */
  --bp-desktop: 1024px;  /* 桌面 */
  --bp-wide:    1440px;  /* 寬螢幕 */
}
```

| 裝置類型 | 寬度範圍 | 佈局描述 |
|----------|----------|----------|
| 手機直向 | < 480px | 單欄、垂直堆疊，牌堆置中，手牌水平捲動 |
| 手機橫向 | 480–767px（landscape）| 手牌列固定於底部，桌面區緊湊 |
| 平板 | 768px–1023px | 兩欄式，AI 區上方，玩家手牌下方 |
| 桌面 | ≥ 1024px | 完整三欄佈局，側邊顯示對手 |

### 4.2 行動裝置遊戲畫面佈局

```
┌────────────────────────┐   ← 頂部 Header（AI 手牌數量、方向指示）
│  AI 手牌數: 5  ↻  ←   │
├────────────────────────┤
│                        │
│     ┌──────┐           │   ← 中央桌面區（固定高度，不被手牌遮蓋）
│     │ 牌組  │  棄牌堆  │
│     └──────┘           │
│                        │
├────────────────────────┤   ← 分隔線
│  ← 手牌水平捲動 →     │   ← 手牌區（固定高度 160px）
│  [🟥][🔵][🟡][🟢][🃏] │
├────────────────────────┤   ← 操作列（固定底部，不可覆蓋牌）
│ [抽牌] [UNO!] [說明]   │   ← 高度 60px，半透明背景
└────────────────────────┘
```

**關鍵原則**：
- 操作按鍵（底部列）固定高度 60px，使用 `position: fixed; bottom: 0`
- 手牌區距離底部至少 70px（避免被操作列遮擋）
- 桌面區的計算高度 = `100dvh - header高度 - 手牌區高度 - 操作列高度`
- 使用 `100dvh`（動態視口高度）避免手機瀏覽器位址列問題

### 4.3 手牌區設計（行動版）

```css
/* css/responsive/mobile.css */
.player-hand {
  position: fixed;
  bottom: 60px;           /* 操作列高度 */
  left: 0;
  right: 0;
  height: 160px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: -20px;             /* 手牌重疊效果 */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.player-hand .card {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 80px;
  height: 120px;
}
```

### 4.4 觸控互動規範

- 所有可點擊元素最小觸控區域：**44×44px**（Apple HIG 標準）
- 手牌支援**滑動捲動**（touch-action: pan-x）
- 按鈕點擊加入 **300ms 防抖動**防止雙擊
- 手牌選取後顯示**上移 20px 動畫**確認選取

---

## 5. 多國語系（i18n）

### 5.1 支援語系

| 代碼 | 語言 | 字型設定 |
|------|------|----------|
| `zh-TW` | 繁體中文 | Noto Sans TC |
| `zh-CN` | 簡體中文 | Noto Sans SC |
| `en` | English | Nunito |
| `ja` | 日本語 | Noto Sans JP |

### 5.2 語系切換機制

```javascript
// js/utils/i18n.js
const I18n = {
  currentLang: 'zh-TW',
  translations: {},           // 由 locales/*.js 注入

  init(lang) {
    this.currentLang = lang || localStorage.getItem('uno_lang') || 'zh-TW';
    this.applyToDOM();
    this.applyFont();
  },

  t(key) {
    // 支援巢狀 key，如 'menu.startGame'
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations[this.currentLang])
           || key;
  },

  applyToDOM() {
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
  },

  applyFont() {
    // 根據語系切換 CSS class（影響字體）
    document.documentElement.className = `lang-${this.currentLang}`;
  }
};
```

### 5.3 翻譯 Key 結構（範例）

```javascript
// js/config/locales/zh-TW.js
window.LOCALE_ZH_TW = {
  menu: {
    title:         'UNO',
    startGame:     '開始遊戲',
    continueGame:  '繼續遊戲',
    help:          '遊戲說明',
    settings:      '設定',
  },
  settings: {
    title:         '設定',
    language:      '語言',
    bgmVolume:     '背景音樂音量',
    sfxVolume:     '音效音量',
    theme:         '配色主題',
    difficulty:    'AI 難度',
    easy:          '簡單',
    normal:        '普通',
    hard:          '困難',
    back:          '返回',
  },
  game: {
    yourTurn:      '你的回合',
    aiTurn:        'AI 思考中…',
    drawCard:      '抽一張牌',
    unoButton:     'UNO！',
    chooseColor:   '選擇顏色',
    red:           '紅色',
    blue:          '藍色',
    green:         '綠色',
    yellow:        '黃色',
    skipNotice:    '跳過 {player} 的回合！',
    drawNotice:    '{player} 抽了 {count} 張牌',
    reverseNotice: '方向反轉！',
    unoCallout:    '{player} 喊了 UNO！',
    winMessage:    '🎉 你贏了！',
    loseMessage:   '😢 AI 獲勝！',
    score:         '得分：{score}',
    round:         '第 {round} 局',
  },
  help: {
    title:         '遊戲說明',
    // ... 詳見說明頁面規格
  },
  errors: {
    invalidPlay:   '這張牌不能出！',
    mustCallUno:   '手牌剩一張時必須喊 UNO！',
  }
};
```

---

## 6. 視覺設計系統

### 6.1 字體設定

**所有畫面文字使用大字體，確保行動裝置可讀性。**

```css
/* css/base/variables.css */
:root {
  /* 字型大小比例 */
  --font-size-xs:   14px;   /* 最小標註文字 */
  --font-size-sm:   16px;   /* 小字（說明文字）*/
  --font-size-base: 18px;   /* 基礎內文 */
  --font-size-md:   22px;   /* 一般標題 */
  --font-size-lg:   28px;   /* 中型標題 */
  --font-size-xl:   36px;   /* 大型標題 */
  --font-size-2xl:  48px;   /* 超大標題（主選單）*/
  --font-size-3xl:  64px;   /* UNO LOGO */

  /* 牌面數字專用 */
  --font-size-card-num: 32px;   /* 桌面 */
  --font-size-card-num-mobile: 24px; /* 行動版 */

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* 行高 */
  --line-height-tight: 1.2;
  --line-height-base:  1.5;
  --line-height-loose: 1.8;
}
```

**字體對應（按語系）**：

```css
/* css/base/typography.css */
.lang-zh-TW { font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif; }
.lang-zh-CN { font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif; }
.lang-en    { font-family: 'Nunito', 'Arial Rounded MT Bold', sans-serif; }
.lang-ja    { font-family: 'Noto Sans JP', 'Yu Gothic', sans-serif; }

h1, h2, h3, .btn { font-weight: var(--font-weight-bold); }
.card-number      { font-weight: var(--font-weight-black); }
body              { font-size: var(--font-size-base); }
```

### 6.2 配色主題

提供 **6 種配色主題**，使用者可在設定中切換，透過切換 `data-theme` 屬性實現：

#### 主題一：經典 UNO（預設）
```css
[data-theme="classic"] {
  --bg-primary:    #1a1a2e;  /* 深藍紫背景 */
  --bg-secondary:  #16213e;  /* 次要背景 */
  --bg-card-table: #0f3460;  /* 桌面背景 */
  --accent-red:    #e94560;  /* UNO 紅 */
  --accent-gold:   #f5a623;  /* 金黃強調 */
  --text-primary:  #ffffff;
  --text-secondary:#b0b8c1;
  --border-color:  #ffffff30;
}
```

#### 主題二：夜晚霓虹（Neon Night）
```css
[data-theme="neon"] {
  --bg-primary:    #0d0d0d;
  --bg-secondary:  #1a1a1a;
  --bg-card-table: #111111;
  --accent-red:    #ff0055;
  --accent-gold:   #00ffcc;
  --text-primary:  #ffffff;
  --text-secondary:#aaaaaa;
  --border-color:  #00ffcc40;
  --glow-color:    0 0 20px #00ffcc80;
}
```

#### 主題三：夏日陽光（Summer）
```css
[data-theme="summer"] {
  --bg-primary:    #fff3cd;
  --bg-secondary:  #ffe0a3;
  --bg-card-table: #ffd470;
  --accent-red:    #d63031;
  --accent-gold:   #e17055;
  --text-primary:  #2d3436;
  --text-secondary:#636e72;
  --border-color:  #2d343630;
}
```

#### 主題四：森林綠（Forest）
```css
[data-theme="forest"] {
  --bg-primary:    #1e3a2f;
  --bg-secondary:  #2d5a45;
  --bg-card-table: #1a4731;
  --accent-red:    #e74c3c;
  --accent-gold:   #f39c12;
  --text-primary:  #ecf0f1;
  --text-secondary:#95a5a6;
  --border-color:  #ecf0f130;
}
```

#### 主題五：深海（Deep Sea）
```css
[data-theme="ocean"] {
  --bg-primary:    #0a192f;
  --bg-secondary:  #112240;
  --bg-card-table: #0d2137;
  --accent-red:    #64ffda;
  --accent-gold:   #ccd6f6;
  --text-primary:  #ccd6f6;
  --text-secondary:#8892b0;
  --border-color:  #64ffda30;
}
```

#### 主題六：糖果（Candy）
```css
[data-theme="candy"] {
  --bg-primary:    #ff9a9e;
  --bg-secondary:  #fecfef;
  --bg-card-table: #ffd1dc;
  --accent-red:    #c0392b;
  --accent-gold:   #8e44ad;
  --text-primary:  #2c3e50;
  --text-secondary:#7f8c8d;
  --border-color:  #2c3e5030;
}
```

### 6.3 間距系統

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### 6.4 圓角與陰影

```css
:root {
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-card: 16px;   /* 牌面圓角 */

  --shadow-sm:  0 2px 8px rgba(0,0,0,0.15);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.25);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.35);
  --shadow-card: 0 4px 12px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
}
```

---

## 7. 牌面設計規範

### 7.1 標準 UNO 牌組構成

| 類型 | 張數 | 說明 |
|------|------|------|
| 數字牌 0 | 4 張 | 每色 1 張（紅、藍、綠、黃） |
| 數字牌 1–9 | 72 張 | 每色各 2 張 × 9 數字 = 72 |
| Skip（跳過） | 8 張 | 每色 2 張 |
| Reverse（反轉） | 8 張 | 每色 2 張 |
| Draw Two（+2） | 8 張 | 每色 2 張 |
| Wild（萬用） | 4 張 | 無色 |
| Wild Draw Four（+4） | 4 張 | 無色 |
| **合計** | **108 張** | |

### 7.2 牌面視覺設計（SVG 生成）

每張牌以 JavaScript 動態生成 SVG，**完全模擬真實 UNO 牌**：

#### 7.2.1 牌的基本結構

```
┌──────────────────────┐
│ [小數字]             │  ← 左上角數字/符號
│                      │
│    ╔══════════╗      │
│    ║          ║      │  ← 中央橢圓（旋轉45°）
│    ║  大數字  ║      │     顏色略深/略淺的對比橢圓
│    ║  /符號   ║      │
│    ╚══════════╝      │
│             [小數字] │  ← 右下角（倒置）
└──────────────────────┘
```

#### 7.2.2 牌的尺寸規格

| 版本 | 寬 | 高 | 比例 |
|------|----|----|------|
| 桌面標準 | 100px | 150px | 2:3 |
| 平板 | 80px | 120px | 2:3 |
| 手機手牌 | 70px | 105px | 2:3 |
| 手機縮圖（AI牌背） | 40px | 60px | 2:3 |

#### 7.2.3 各色數字牌 SVG 範本

```javascript
// js/ui/cardRenderer.js
function renderNumberCard(color, number) {
  const colors = {
    red:    { bg: '#e74c3c', oval: '#c0392b', text: '#ffffff' },
    blue:   { bg: '#2980b9', oval: '#1a5276', text: '#ffffff' },
    green:  { bg: '#27ae60', oval: '#1e8449', text: '#ffffff' },
    yellow: { bg: '#f39c12', oval: '#d68910', text: '#ffffff' },
  };
  const c = colors[color];
  return `
  <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <!-- 牌面底色 -->
    <rect width="100" height="150" rx="16" fill="${c.bg}"/>

    <!-- 白色邊框 -->
    <rect x="4" y="4" width="92" height="142" rx="13"
          fill="none" stroke="white" stroke-width="3"/>

    <!-- 中央橢圓（旋轉，模擬真實牌的設計） -->
    <ellipse cx="50" cy="75" rx="35" ry="52"
             fill="${c.oval}" transform="rotate(-30 50 75)"/>

    <!-- 中央大數字 -->
    <text x="50" y="88"
          text-anchor="middle" dominant-baseline="middle"
          font-size="52" font-weight="900" fill="white"
          font-family="'Nunito', sans-serif"
          paint-order="stroke"
          stroke="${c.oval}" stroke-width="3">
      ${number}
    </text>

    <!-- 左上角小數字 -->
    <text x="10" y="22"
          font-size="18" font-weight="900" fill="white"
          font-family="'Nunito', sans-serif">
      ${number}
    </text>

    <!-- 右下角倒置小數字 -->
    <text x="90" y="135"
          text-anchor="middle" dominant-baseline="auto"
          font-size="18" font-weight="900" fill="white"
          font-family="'Nunito', sans-serif"
          transform="rotate(180 90 135)">
      ${number}
    </text>
  </svg>`;
}
```

#### 7.2.4 功能牌符號設計

**Skip（跳過）**：使用「⊘」符號 + 「SKIP」文字
**Reverse（反轉）**：使用雙向箭頭符號「⇄」 
**Draw Two（+2）**：兩張牌的堆疊圖示 + 「+2」
**Wild（萬用）**：四色圓餅圖（紅藍綠黃各 1/4 扇形）
**Wild Draw Four（+4）**：四色圓餅圖 + 四張牌堆疊 + 「+4」

#### 7.2.5 牌背設計

```
牌背 = 黑色圓角矩形 + 紅色橢圓 + 白色「UNO」文字（斜體+粗體）
白色邊框，模擬真實 UNO 牌背
```

### 7.3 牌的互動狀態

| 狀態 | 視覺效果 |
|------|----------|
| 預設 | 標準尺寸，`box-shadow: var(--shadow-card)` |
| 懸停（可出） | 上移 -12px，加亮光暈，cursor: pointer |
| 選取中 | 上移 -20px，金色邊框 `3px solid var(--accent-gold)` |
| 不可出（本回合）| 亮度降低 60%（`filter: brightness(0.6)`），cursor: not-allowed |
| 動畫飛出 | CSS transition + translate 動畫至棄牌堆 |

---

## 8. 音效與音樂系統

### 8.1 系統架構

```javascript
// js/audio/audioManager.js
const AudioManager = {
  bgmGain: null,       // BGM 增益節點
  sfxGain: null,       // SFX 增益節點
  currentBGM: null,    // 當前播放的 BGM AudioBufferSourceNode
  audioCtx: null,      // AudioContext 實例
  buffers: {},         // 預載的音訊緩衝區快取
  BGM_MULTIPLIER: 5,   // BGM 音量倍率（原始 × 5）

  async init() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmGain = this.audioCtx.createGain();
    this.sfxGain = this.audioCtx.createGain();
    this.bgmGain.connect(this.audioCtx.destination);
    this.sfxGain.connect(this.audioCtx.destination);
    await this.preloadAll();
  },

  async preloadAll() {
    const allAudio = [...BGM_LIST, ...SFX_LIST];
    for (const { key, path } of allAudio) {
      const res  = await fetch(path);
      const buf  = await res.arrayBuffer();
      this.buffers[key] = await this.audioCtx.decodeAudioData(buf);
    }
  },

  playBGM(key, { loop = true, crossfade = true } = {}) {
    // 若同一首 BGM 已在播放，不重新開始
    if (this.currentBGMKey === key) return;

    const fadeOutDuration = crossfade ? 1.0 : 0;
    // 淡出舊 BGM
    if (this.currentBGM) {
      const oldNode = this.currentBGM;
      this.bgmGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + fadeOutDuration);
      setTimeout(() => oldNode.stop(), fadeOutDuration * 1000);
    }

    // 淡入新 BGM（基礎音量 × BGM_MULTIPLIER）
    const userVolume = parseFloat(localStorage.getItem('uno_bgm_vol') ?? '0.5');
    const targetGain = Math.min(userVolume * this.BGM_MULTIPLIER, 1.0);
    this.bgmGain.gain.setValueAtTime(0, this.audioCtx.currentTime + fadeOutDuration);
    this.bgmGain.gain.linearRampToValueAtTime(targetGain, this.audioCtx.currentTime + fadeOutDuration + 1.0);

    const src = this.audioCtx.createBufferSource();
    src.buffer  = this.buffers[key];
    src.loop    = loop;
    src.connect(this.bgmGain);
    src.start(this.audioCtx.currentTime + fadeOutDuration);

    this.currentBGM    = src;
    this.currentBGMKey = key;
  },

  stopBGM(fade = true) {
    if (!this.currentBGM) return;
    if (fade) {
      this.bgmGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1.0);
      setTimeout(() => { this.currentBGM?.stop(); this.currentBGM = null; }, 1000);
    } else {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
    this.currentBGMKey = null;
  },

  playSFX(key) {
    if (!this.buffers[key]) return;
    const userSfxVol = parseFloat(localStorage.getItem('uno_sfx_vol') ?? '0.7');
    const gain = this.audioCtx.createGain();
    gain.gain.value = userSfxVol;
    gain.connect(this.sfxGain);

    const src = this.audioCtx.createBufferSource();
    src.buffer = this.buffers[key];
    src.connect(gain);
    src.start();
  },

  setBGMVolume(val) {
    // val = 0.0 ~ 1.0（使用者設定值），實際輸出 × BGM_MULTIPLIER
    const actual = Math.min(val * this.BGM_MULTIPLIER, 1.0);
    this.bgmGain.gain.setTargetAtTime(actual, this.audioCtx.currentTime, 0.1);
    localStorage.setItem('uno_bgm_vol', val);
  },

  setSFXVolume(val) {
    this.sfxGain.gain.setTargetAtTime(val, this.audioCtx.currentTime, 0.1);
    localStorage.setItem('uno_sfx_vol', val);
  },

  resumeContext() {
    // iOS / Chrome 需要使用者互動後才能播放
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
};
```

### 8.2 BGM 播放策略

| 畫面 | BGM 檔案 | 切換策略 |
|------|----------|----------|
| 主選單 | `menu_theme.mp3` | 進入主選單時播放，循環 |
| 說明頁 | **持續主選單 BGM** | 不中斷，繼續播放 |
| 設定頁 | **持續主選單 BGM** | 不中斷，繼續播放 |
| 遊戲（手牌 > 3 張）| `game_chill.mp3` | 交叉淡入（1秒），循環 |
| 遊戲（手牌 ≤ 3 張）| `game_intense.mp3` | 交叉淡入（0.5秒），循環 |
| 勝利畫面 | `victory.mp3` | 停止遊戲 BGM，播放一次 |
| 失敗畫面 | `victory.mp3` | 悲傷版（可同一檔不同segment） |

> **BGM 音量放大 5 倍**：所有 BGM 的 GainNode 輸出值為 `userSetting × 5`，上限 clamp 至 1.0，確保沉浸感。

### 8.3 音效事件對應表

```javascript
// js/audio/sfx.js
const SFX_EVENTS = {
  // 牌操作
  CARD_DEAL:      'card_deal',       // 遊戲開始發牌
  CARD_PLAY:      'card_play',       // 出一張普通牌
  CARD_DRAW:      'card_draw',       // 抽牌
  CARD_SHUFFLE:   'card_shuffle',    // 洗牌（牌組重置時）
  CARD_FLIP:      'card_flip',       // 翻開第一張牌
  CARD_SELECT:    'card_select',     // 選取手牌（懸停/點擊）

  // 特殊牌效果
  SKIP:           'skip_turn',       // 跳過
  REVERSE:        'reverse',         // 反轉
  DRAW_TWO:       'draw_two',        // +2
  WILD:           'wild_select',     // 萬用牌選色
  DRAW_FOUR:      'draw_four',       // +4

  // 遊戲事件
  UNO_CALL:       'uno_call',        // 玩家喊 UNO
  UNO_AI_CALL:    'uno_call',        // AI 喊 UNO（同音效）
  PLAYER_WIN:     'win',             // 玩家獲勝
  PLAYER_LOSE:    'lose',            // AI 獲勝
  AI_THINK:       'ai_think',        // AI 思考中（短音效循環）

  // UI 互動
  BTN_CLICK:      'button_click',    // 所有按鈕點擊
  BTN_HOVER:      'button_hover',    // 按鈕懸停（桌面）
  SCREEN_CHANGE:  'screen_transition',// 畫面切換
  ERROR:          'error',           // 非法出牌提示

  // 倒數計時（若啟用）
  TIMER_TICK:     'timer_tick',
  TIMER_END:      'countdown_end',
};
```

---

## 9. 畫面與功能規格

### 9.1 主選單畫面

#### 版面結構

```
┌────────────────────────────────────────┐
│                                        │
│   🎴  U  N  O                          │  ← LOGO（大字，帶動畫）
│      ── 多人紙牌遊戲 ──                │  ← 副標（i18n）
│                                        │
│   ┌──────────────────────────────┐     │
│   │    🎮  開始遊戲              │     │  ← 主按鈕
│   └──────────────────────────────┘     │
│   ┌──────────────────────────────┐     │
│   │    ▶  繼續遊戲               │     │  ← 有存檔時啟用
│   └──────────────────────────────┘     │
│   ┌──────────────────────────────┐     │
│   │    ❓  遊戲說明              │     │
│   └──────────────────────────────┘     │
│   ┌──────────────────────────────┐     │
│   │    ⚙  設定                   │     │
│   └──────────────────────────────┘     │
│                                        │
│   [ 🌐 語言 ] [ EN ][ 中 ][ 日 ]      │  ← 快速語系切換
└────────────────────────────────────────┘
```

#### 視覺規格

- 背景：全螢幕漸層（主題色），含浮動牌面粒子動畫
- UNO LOGO：彩色（紅黃藍綠各字母一色），`font-size: var(--font-size-3xl)`，帶脈動發光動畫
- 按鈕：全寬（桌面最大 400px），高度 64px，圓角 `var(--radius-xl)`，圖示 + 文字，hover 時位移 -4px
- 「繼續遊戲」：無存檔時顯示但為 `disabled` 狀態（灰色 + 半透明）
- 背景有漂浮的 UNO 牌（隨機色、隨機角度、緩慢漂移動畫）

#### 開始遊戲流程

點擊「開始遊戲」→ 開啟**難度選擇彈窗**：

```
╔══════════════════════════════╗
║   選擇 AI 難度               ║
║                              ║
║   [ 😊 簡單  ]              ║
║   [ 🧐 普通  ]              ║
║   [ 😈 困難  ]              ║
║                              ║
║              [ 取消 ]        ║
╚══════════════════════════════╝
```

選擇後 → 淡出主選單 → 發牌動畫 → 進入遊戲

### 9.2 遊戲畫面

#### 桌面版佈局

```
┌──────────────────────────────────────────────────────┐
│  [← 返回]   回合: 3   方向: → 順時針   [⚙]          │  ← Header
├──────────────────────────────────────────────────────┤
│                                                      │
│   [AI手牌背面: 7張]    AI難度: 普通    [AI頭像]      │  ← AI區
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│         [牌組: 剩78張]    [棄牌堆: 最新牌]           │  ← 桌面中央
│              ↑ 點擊抽牌        ↑ 目前花色            │
│                                                      │
│              ← 順時針 / 逆時針 方向指示器 →           │
│                                                      │
├──────────────────────────────────────────────────────┤
│   你的手牌（7張）                                    │  ← 玩家手牌
│   [🟥5] [🔵3] [🟡Skip] [🟢7] [🔵2] [🃏] [🃏+4]    │
├──────────────────────────────────────────────────────┤
│   [📤 抽牌]        [🗣 UNO！]        [❓ 說明]       │  ← 操作列
└──────────────────────────────────────────────────────┘
```

#### 遊戲畫面元件規格

**① AI 區域**
- 顯示 AI 頭像（圓形，帶色彩邊框）
- 顯示「AI 手牌」背面縮圖（每張 40×60px，重疊排列）
- 顯示手牌數量 Badge
- AI 思考時顯示「🤔 思考中…」+ 三個跳動點動畫
- AI 手牌數 ≤ 2 時，顯示「⚠ UNO！」警示

**② 桌面區（中央）**
- 牌組（Draw Pile）：點擊可抽牌，顯示剩餘張數
- 棄牌堆（Discard Pile）：顯示最頂部的牌，出牌動畫飛至此處
- 遊戲方向指示：順時針（→）/ 逆時針（←）動態圖示
- 若棄牌堆為萬用牌，顯示**目前有效顏色**色塊標示

**③ 玩家手牌區**
- 水平排列，可出的牌高亮顯示（不可出的牌降低亮度）
- 超過 7 張時自動縮窄間距
- 超過 12 張時進入捲動模式
- 牌片被選取時上移並加金色邊框，再次點擊確認出牌
- 行動版手牌固定於底部（`position: fixed`）

**④ 操作列**
- **抽牌按鈕**：從牌組抽一張（強制抽牌時自動執行）
- **UNO！按鈕**：手牌剩 2 張時啟用（出牌後剩 1 張時需喊 UNO）
- **說明按鈕**：快速查閱規則（彈窗形式）

**⑤ 顏色選擇彈窗**（萬用牌專用）

```
╔══════════════════════════════╗
║   選擇顏色                   ║
║                              ║
║   ┌────┐ ┌────┐             ║
║   │ 🔴 │ │ 🔵 │             ║
║   │ 紅 │ │ 藍 │             ║
║   └────┘ └────┘             ║
║   ┌────┐ ┌────┐             ║
║   │ 🟢 │ │ 🟡 │             ║
║   │ 綠 │ │ 黃 │             ║
║   └────┘ └────┘             ║
╚══════════════════════════════╝
```

### 9.3 勝負畫面（Modal 彈窗）

```
╔══════════════════════════════════╗
║                                  ║
║      🎉 恭喜你贏了！              ║  ← 或 😢 AI 獲勝！
║                                  ║
║   本局得分：  +120 分            ║
║   用時：      3 分 42 秒         ║
║   出牌次數：  18 次              ║
║                                  ║
║   ┌──────────┐  ┌──────────┐    ║
║   │  再玩一局 │  │  主選單  │    ║
║   └──────────┘  └──────────┘    ║
╚══════════════════════════════════╝
```

- 勝利：紙花動畫（彩色碎紙）+ 勝利音效
- 失敗：螢幕輕微震動 + 失敗音效

---

## 10. 遊戲邏輯規格

### 10.1 牌組初始化

```javascript
// js/game/deck.js
function createDeck() {
  const colors  = ['red', 'blue', 'green', 'yellow'];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const actions = ['skip', 'reverse', 'draw_two'];
  const wilds   = ['wild', 'wild_draw_four'];
  let deck = [];

  for (const color of colors) {
    // 0 號牌每色 1 張
    deck.push({ type: 'number', color, value: 0, id: `${color}_0` });

    // 1–9 每色各 2 張
    for (const num of numbers.slice(1)) {
      deck.push({ type: 'number', color, value: num, id: `${color}_${num}_a` });
      deck.push({ type: 'number', color, value: num, id: `${color}_${num}_b` });
    }

    // 功能牌每色各 2 張
    for (const action of actions) {
      deck.push({ type: 'action', color, value: action, id: `${color}_${action}_a` });
      deck.push({ type: 'action', color, value: action, id: `${color}_${action}_b` });
    }
  }

  // 萬用牌各 4 張
  for (const wild of wilds) {
    for (let i = 0; i < 4; i++) {
      deck.push({ type: 'wild', color: null, value: wild, id: `${wild}_${i}` });
    }
  }

  return shuffle(deck); // Fisher-Yates 洗牌
}
```

### 10.2 遊戲狀態機

```javascript
// js/game/gameState.js
const GameState = {
  // 狀態欄位
  deck:           [],      // 剩餘牌組
  discardPile:    [],      // 棄牌堆
  playerHand:     [],      // 玩家手牌
  aiHand:         [],      // AI 手牌
  currentColor:   null,    // 目前有效顏色
  currentPlayer:  'player',// 'player' | 'ai'
  direction:      1,       // 1 = 順時針, -1 = 逆時針
  drawCount:      0,       // 累積抽牌數（+2/+4 堆疊時）
  isStackable:    false,   // 是否啟用 +2/+4 堆疊規則
  round:          1,
  playerScore:    0,
  gamePhase:      'idle',  // 'idle' | 'dealing' | 'playing' | 'choosing_color' | 'ended'

  // 核心方法
  init(difficulty)      { /* 初始化並發牌 */ },
  startTurn()           { /* 切換回合 */ },
  playCard(card)        { /* 出牌並觸發效果 */ },
  drawCard(player, n)   { /* 抽 n 張牌 */ },
  applyCardEffect(card) { /* 執行特殊牌效果 */ },
  checkWin()            { /* 判斷勝負 */ },
  checkUnoViolation()   { /* 手牌 ≤ 1 未喊 UNO 時懲罰 */ },
  reshuffleDeck()       { /* 洗牌堆重置 */ },
  saveState()           { /* 儲存至 localStorage */ },
  loadState()           { /* 從 localStorage 讀取 */ },
};
```

### 10.3 出牌合法性判斷

```javascript
// js/game/rules.js
function isCardPlayable(card, topCard, currentColor) {
  // 萬用牌永遠可出
  if (card.type === 'wild') return true;

  // 顏色相同
  if (card.color === currentColor) return true;

  // 數字/符號相同
  if (card.value === topCard.value) return true;

  return false;
}
```

### 10.4 特殊牌效果

| 牌種 | 效果 |
|------|------|
| Skip | 下一位玩家跳過本回合 |
| Reverse | 出牌方向反轉（2人遊戲等同 Skip）|
| Draw Two | 下一位玩家抽 2 張牌並跳過回合 |
| Wild | 出牌者選擇新的有效顏色 |
| Wild Draw Four | 出牌者選擇顏色 + 下一位抽 4 張並跳過（只能在沒有合法牌時出） |

### 10.5 得分計算

| 牌種 | 點數 |
|------|------|
| 數字牌 0–9 | 牌面數字 |
| Skip、Reverse、Draw Two | 20 分 |
| Wild、Wild Draw Four | 50 分 |

**計算方式**：玩家贏時，得分 = AI 手牌中所有剩餘牌的點數總和。

### 10.6 UNO 規則

- 手牌剩 1 張時需喊 UNO（點擊 UNO 按鈕）
- 若手牌剩 1 張但**未在對方出牌前喊 UNO**，被對方指出則罰抽 2 張牌
- AI 有機率「忘記」喊 UNO（依難度調整概率）

---

## 11. AI 對手系統

### 11.1 難度設計

```javascript
// js/game/ai.js
const AI_CONFIG = {
  easy: {
    thinkDelay:       [600, 1200],   // ms 範圍，隨機選
    useWildOptimally: false,         // 萬用牌不會策略性保留
    trackPlayerCards: false,         // 不追蹤玩家手牌
    unoCallChance:    0.70,          // 70% 機率喊 UNO
    bluffChance:      0.00,          // 不嘗試 +4 虛張聲勢
    preferColors:     false,         // 不偏好特定顏色
  },
  normal: {
    thinkDelay:       [800, 1500],
    useWildOptimally: true,          // 萬用牌保留到需要時
    trackPlayerCards: false,
    unoCallChance:    0.90,
    bluffChance:      0.10,
    preferColors:     true,          // 偏好讓玩家抽牌的顏色
  },
  hard: {
    thinkDelay:       [1000, 2000],  // 較長延遲，模擬思考
    useWildOptimally: true,
    trackPlayerCards: true,          // 追蹤玩家已出的牌
    unoCallChance:    1.00,          // 必喊 UNO
    bluffChance:      0.30,          // 策略性使用 +4
    preferColors:     true,
    avoidHelpPlayer:  true,          // 避免出對玩家有利的牌
  },
};
```

### 11.2 AI 決策流程

```
AI 回合開始
    ↓
[等待 thinkDelay ms]
    ↓
取得手牌中所有合法牌
    ↓
[無合法牌] → 抽一張牌 → [抽到合法牌] → 出牌 → 結束
              ↓
           [仍無法出] → 結束回合（Pass）
    ↓
[有合法牌]
    ↓
優先順序評分（依難度）：
  1. +4 Wild（若啟用 bluff）
  2. +2 Draw Two（攻擊性）
  3. Skip（干擾）
  4. Reverse（依情況）
  5. Wild（依剩餘手牌最多的顏色）
  6. 數字牌（出最高點數的牌，減少自身風險）
    ↓
選出最高分的合法牌
    ↓
若為萬用牌 → 選擇手牌最多的顏色
    ↓
出牌，觸發音效與動畫
    ↓
檢查是否勝利
    ↓
若手牌剩 1 張 → 依 unoCallChance 機率喊 UNO
```

---

## 12. 說明頁面規格

### 12.1 版面結構

說明頁使用**分段卡片**設計，以大型圖示（Emoji + SVG）配合文字，確保閱讀舒適。

```
┌──────────────────────────────────────┐
│  ← 返回                遊戲說明     │  ← 頂部 Header
├──────────────────────────────────────┤
│                                      │
│  ┌────────┐  目錄快捷鍵：           │
│  │ 📖 目錄 │  • 基本規則            │
│  │        │  • 牌的種類            │
│  └────────┘  • 特殊牌效果          │
│               • 勝利條件           │
│               • UNO 規則           │
│                                      │
├──────────────────────────────────────┤
│  🎯 基本規則                         │
│  ─────────────────────────────────   │
│  • 每位玩家起始獲得 7 張牌           │
│  • 輪流出牌，需與頂牌顏色或數字相同  │
│  • 無法出牌時需從牌組抽一張牌        │
│                                      │
├──────────────────────────────────────┤
│  🃏 牌的種類                         │
│  ─────────────────────────────────   │
│   [紅0] [藍3] [綠7] [黃9]           │  ← 實際渲染的牌縮圖
│   數字牌：0–9，四色各一套            │
│                                      │
│   [⊘Skip] [⇄Rev] [+2] [🌈Wild] [+4] │  ← 功能牌縮圖
│   特殊牌：Skip / Reverse / +2 / Wild │
│                                      │
├──────────────────────────────────────┤
│  ✨ 特殊牌效果詳解                   │
│  ─────────────────────────────────   │
│  ⊘ Skip   跳過下一位玩家的回合      │
│  ⇄ Reverse 反轉出牌方向             │
│  +2        下一位玩家抽 2 張牌       │
│  🌈 Wild   選擇任意顏色繼續          │
│  🌈+4     選色 + 下一位抽 4 張牌    │
│                                      │
├──────────────────────────────────────┤
│  🏆 勝利條件                         │
│  ─────────────────────────────────   │
│  手牌最先出完的玩家獲勝！            │
│  得分 = 對手剩餘手牌點數總和         │
│                                      │
├──────────────────────────────────────┤
│  🗣 UNO 規則                          │
│  ─────────────────────────────────   │
│  ⚠ 手牌剩最後 1 張時，必須喊 UNO！  │
│  如未喊 UNO 且被對方發現，罰抽 2 張  │
│                                      │
└──────────────────────────────────────┘
```

### 12.2 說明頁視覺規格

- 每個章節用白色/淺色卡片區塊，圓角 `var(--radius-md)`
- 章節標題：`font-size: var(--font-size-lg)`，帶 Emoji 圖示
- 牌種展示：直接渲染實際的 SVG 牌縮圖（width: 60px）
- 目錄區：點擊快速跳轉至該章節（`scrollIntoView`）
- 說明頁 **BGM 不中斷**（繼續播放主選單音樂）

---

## 13. 設定頁面規格

### 13.1 版面結構（乾淨簡潔）

```
┌──────────────────────────────────────┐
│  ← 返回                    設定     │
├──────────────────────────────────────┤
│                                      │
│  🌐 語言                             │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  中文 │ │  EN  │ │  日語 │       │  ← 語系切換按鈕（Tag 樣式）
│  └──────┘ └──────┘ └──────┘        │
│                                      │
│  🎵 背景音樂音量                      │
│  🔇 ─────────●──────────── 🔊       │  ← 自訂滑桿，顯示百分比
│                     60%              │
│                                      │
│  🔔 音效音量                          │
│  🔇 ──────────────●──────── 🔊      │
│                        80%           │
│                                      │
│  🎨 配色主題                          │
│  ┌─────────┐ ┌─────────┐            │
│  │ 🌑 經典  │ │ 💡 霓虹  │           │  ← 主題選擇方塊（色票預覽）
│  └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐            │
│  │ ☀ 夏日  │ │ 🌲 森林  │           │
│  └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐            │
│  │ 🌊 深海  │ │ 🍭 糖果  │           │
│  └─────────┘ └─────────┘            │
│                                      │
│  🤖 AI 難度                           │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ 😊 簡單 │ │ 🧐 普通 │ │ 😈 困難 │  │  ← Tag 樣式，選中有底色
│  └────────┘ └────────┘ └────────┘   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🗑  清除存檔                 │    │  ← 危險操作，紅色按鈕
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

### 13.2 設定元件規格

**滑桿（Slider）規格**：
```css
/* css/components/slider.css */
.volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) var(--progress), var(--bg-secondary) var(--progress));
  outline: none;
  cursor: pointer;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-gold);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.1s ease;
}
.volume-slider::-webkit-slider-thumb:active {
  transform: scale(1.2);
}
```

**主題選擇卡**：
- 每張卡片顯示 4 色色塊（該主題的 4 種代表色）
- 選中狀態：金色邊框 + 右上角 ✓ 標記
- 切換主題即時生效（修改 `document.documentElement.dataset.theme`）

**所有設定即時儲存至 `localStorage`**。

---

## 14. 存檔與繼續遊戲

### 14.1 存檔結構

```javascript
// js/utils/storage.js
const SAVE_KEY = 'uno_save';

const defaultSave = {
  // 遊戲狀態
  deck:         [],
  discardPile:  [],
  playerHand:   [],
  aiHand:       [],
  currentColor: null,
  currentPlayer:'player',
  direction:    1,
  round:        1,
  playerScore:  0,
  difficulty:   'normal',

  // 設定
  settings: {
    lang:       'zh-TW',
    theme:      'classic',
    bgmVolume:  0.5,
    sfxVolume:  0.7,
    difficulty: 'normal',
  },

  // 中繼資料
  savedAt:      null,       // ISO 時間戳
  version:      '1.0.0',   // 版本號，用於存檔相容性檢查
};
```

### 14.2 存檔時機

- 每次出牌後自動儲存
- 每次抽牌後自動儲存
- 離開遊戲畫面前詢問是否儲存（若有進行中的遊戲）

### 14.3 繼續遊戲流程

1. 主選單「繼續遊戲」按鈕：僅當 `localStorage` 有有效存檔時啟用
2. 點擊後讀取存檔，恢復完整遊戲狀態
3. 顯示恢復動畫（牌面依序出現）

---

## 15. 動畫與特效

### 15.1 全域動畫參數

```css
/* css/base/animations.css */
:root {
  --anim-fast:   150ms;
  --anim-normal: 300ms;
  --anim-slow:   500ms;
  --anim-slower: 800ms;
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 15.2 動畫清單

| 動畫名稱 | 觸發時機 | 說明 |
|----------|----------|------|
| `dealCard` | 遊戲開始發牌 | 牌從中央飛至玩家/AI 手中 |
| `playCard` | 玩家出牌 | 牌從手牌飛至棄牌堆，帶旋轉 |
| `drawCard` | 抽牌 | 牌從牌組飛入手牌 |
| `cardHover` | 懸停手牌 | 牌上移 -12px，加光暈 |
| `cardSelect` | 點擊手牌 | 牌上移 -20px，金色邊框 |
| `unoCallout` | 喊 UNO | 大字 UNO！從螢幕中央浮現後消散 |
| `colorSelect` | 萬用牌選色 | 四色圓形展開彈窗 |
| `reverseEffect`| 反轉牌 | 方向指示器旋轉動畫 |
| `skipEffect` | 跳過牌 | 被跳過的玩家圖示閃爍 |
| `drawEffect` | +2 / +4 | 牌組跳動，多張牌飛至對方 |
| `winCelebrate` | 獲勝 | 彩色紙花爆炸效果（CSS particles）|
| `screenFade` | 畫面切換 | 淡出→淡入（350ms）|
| `menuFloat` | 主選單背景 | 牌面緩慢漂浮動畫（無限循環）|
| `aiThink` | AI 思考 | 頭像旁三個跳動點 |
| `handShake` | 錯誤操作 | 手牌區水平震動 |

### 15.3 遵守 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 16. 無障礙與效能

### 16.1 無障礙規範

- 所有互動元素含 `aria-label`（尤其是 icon-only 按鈕）
- 顏色選擇按鈕增加文字標籤（不只依賴顏色）
- 鍵盤可完整操作（Tab 鍵導航 + Enter/Space 觸發）
- Focus 樣式明顯（`outline: 3px solid var(--accent-gold)`）

### 16.2 效能規範

- 所有 SVG 牌面在遊戲開始時**一次性生成**並快取至 `cardPool`，避免重複建立 DOM
- 音效在初始化時**預載全部**至 `AudioBuffer`，遊戲中直接讀取快取
- 使用 `requestAnimationFrame` 執行動畫，避免 `setInterval` 卡頓
- 圖片/音效資源使用延遲載入（非必要的不在首次載入時讀取）
- 背景浮動牌動畫：最多同時 8 張，超出後回收 DOM 節點

### 16.3 iOS / 行動裝置相容

- 音訊使用者互動解鎖：第一次觸摸畫面後呼叫 `audioCtx.resume()`
- 防止雙指縮放（`viewport` meta 設定 `user-scalable=no`）
- 防止長按選取文字（`user-select: none` 在遊戲畫面）
- 防止橡皮筋捲動（`overscroll-behavior: none` 在 `body`）
- 使用 `100dvh` 而非 `100vh`

---

## 17. 錯誤處理

| 情境 | 處理方式 |
|------|----------|
| 出不合法的牌 | 顯示 Toast 錯誤訊息 + 手牌震動動畫 + error 音效 |
| 牌組抽空 | 自動洗牌堆（保留頂牌），顯示洗牌動畫與音效 |
| 音訊無法播放 | 靜音模式繼續遊戲，不顯示錯誤 |
| localStorage 不可用 | 設定保存於記憶體，存檔功能停用，顯示一次性提示 |
| 存檔版本不符 | 清除存檔並提示「存檔版本不相容，已重置」|
| 連線中斷（CDN 字型）| 字型回退到系統字型，功能不受影響 |

---

## 附錄 A：`index.html` 骨架

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="classic">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>UNO 牌遊戲</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Noto+Sans+TC:wght@400;700;900&family=Noto+Sans+SC:wght@400;700;900&family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">

  <!-- CSS -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">
  <link rel="stylesheet" href="css/base/animations.css">
  <link rel="stylesheet" href="css/components/buttons.css">
  <link rel="stylesheet" href="css/components/cards.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/toast.css">
  <link rel="stylesheet" href="css/components/slider.css">
  <link rel="stylesheet" href="css/components/toggle.css">
  <link rel="stylesheet" href="css/screens/mainMenu.css">
  <link rel="stylesheet" href="css/screens/game.css">
  <link rel="stylesheet" href="css/screens/help.css">
  <link rel="stylesheet" href="css/screens/settings.css">
  <link rel="stylesheet" href="css/responsive/tablet.css">
  <link rel="stylesheet" href="css/responsive/mobile.css">
  <link rel="stylesheet" href="css/responsive/landscape.css">
</head>
<body>
  <!-- 畫面容器 -->
  <div id="app">
    <!-- 各畫面由 JS 動態插入 / 顯示 -->
    <div id="screen-main-menu"  class="screen" style="display:none;"></div>
    <div id="screen-game"       class="screen" style="display:none;"></div>
    <div id="screen-help"       class="screen" style="display:none;"></div>
    <div id="screen-settings"   class="screen" style="display:none;"></div>
  </div>

  <!-- Toast 通知 -->
  <div id="toast-container" aria-live="polite"></div>

  <!-- 全域 Modal -->
  <div id="modal-overlay" class="modal-overlay" style="display:none;">
    <div id="modal-content" class="modal-content"></div>
  </div>

  <!-- JavaScript（依序引入）-->
  <script src="js/utils/helpers.js"></script>
  <script src="js/utils/storage.js"></script>
  <script src="js/utils/i18n.js"></script>
  <script src="js/config/constants.js"></script>
  <script src="js/config/themes.js"></script>
  <script src="js/config/locales/zh-TW.js"></script>
  <script src="js/config/locales/zh-CN.js"></script>
  <script src="js/config/locales/en.js"></script>
  <script src="js/config/locales/ja.js"></script>
  <script src="js/audio/audioManager.js"></script>
  <script src="js/audio/sfx.js"></script>
  <script src="js/game/deck.js"></script>
  <script src="js/game/card.js"></script>
  <script src="js/game/player.js"></script>
  <script src="js/game/rules.js"></script>
  <script src="js/game/ai.js"></script>
  <script src="js/game/gameState.js"></script>
  <script src="js/ui/cardRenderer.js"></script>
  <script src="js/ui/handRenderer.js"></script>
  <script src="js/ui/tableRenderer.js"></script>
  <script src="js/ui/animationController.js"></script>
  <script src="js/ui/modal.js"></script>
  <script src="js/ui/toast.js"></script>
  <script src="js/screens/mainMenu.js"></script>
  <script src="js/screens/gameScreen.js"></script>
  <script src="js/screens/helpScreen.js"></script>
  <script src="js/screens/settingsScreen.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 附錄 B：開發優先順序建議

| 階段 | 內容 |
|------|------|
| P0 | CSS 變數系統 + 字體 + Reset + 基本版面 |
| P1 | 牌面 SVG 渲染（全 108 張） |
| P2 | 遊戲邏輯核心（deck / rules / gameState） |
| P3 | 主選單 + 遊戲畫面（桌面版） |
| P4 | AI 邏輯（三難度） |
| P5 | 音效系統 + BGM |
| P6 | 動畫系統 |
| P7 | RWD（平板 + 手機） |
| P8 | 說明頁 + 設定頁 |
| P9 | i18n（三語系） |
| P10 | 存檔系統 + 繼續遊戲 |
| P11 | 6 種主題 + 細節打磨 |

---

*本規格書涵蓋 UNO 遊戲所有功能面向，作為前端實作的完整依據。*
