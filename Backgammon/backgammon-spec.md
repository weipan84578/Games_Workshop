# 🎲 Backgammon（雙陸棋）遊戲完整規格書

> **版本：** v1.0.0　｜　**語系：** 繁體中文 / English / 日本語　｜　**平台：** 純前端靜態網頁

---

## 📋 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [遊戲規則與邏輯](#4-遊戲規則與邏輯)
5. [畫面設計規範](#5-畫面設計規範)
6. [RWD 響應式設計](#6-rwd-響應式設計)
7. [多國語系（i18n）](#7-多國語系i18n)
8. [音效與 BGM](#8-音效與-bgm)
9. [各功能頁面規格](#9-各功能頁面規格)
10. [AI 對手系統](#10-ai-對手系統)
11. [棋子與骰子規格](#11-棋子與骰子規格)
12. [設定系統](#12-設定系統)
13. [存檔與讀取](#13-存檔與讀取)
14. [配色主題系統](#14-配色主題系統)
15. [說明頁面規格](#15-說明頁面規格)
16. [效能與相容性](#16-效能與相容性)
17. [開發流程與注意事項](#17-開發流程與注意事項)

---

## 1. 專案概述

### 1.1 專案目標

製作一款完整的雙陸棋（Backgammon）純前端網頁遊戲，不需要任何後端伺服器或建置工具，直接雙擊 `index.html` 即可遊玩。

### 1.2 核心需求摘要

| 項目 | 規格 |
|------|------|
| 平台 | 純前端靜態 HTML / CSS / JavaScript |
| 啟動方式 | 直接開啟 `index.html`，無需 build / server |
| 響應式設計 | ✅ 支援手機、平板、桌機 |
| 語系 | 繁體中文、English、日本語 |
| 對戰模式 | 玩家 vs AI（簡單 / 普通 / 困難） |
| 音樂風格 | 鋼琴輕快 BGM（音量 ×5 倍） |
| 音效風格 | 高音輕脆音效 |
| 字體 | 大字體、高對比、明確清晰 |

### 1.3 技術限制

- **不使用**任何需要 Node.js 或伺服器的技術
- **不使用**需要 build 流程的框架（如 Vue CLI、React CRA）
- 所有音效使用 **Web Audio API** 程序化生成或 Base64 嵌入
- 所有圖像使用 **SVG 或 Canvas** 繪製，無需外部圖片資源
- 可使用 CDN 引入的純 JS 函式庫（如 Howler.js）

---

## 2. 技術架構

### 2.1 技術選型

```
純原生 HTML5 / CSS3 / ES6+ JavaScript
├── 音效：Web Audio API（程序化生成）或 Tone.js（CDN）
├── 畫面：Canvas API + SVG
├── 存檔：localStorage
├── 動畫：CSS Animations + requestAnimationFrame
└── 圖示：SVG Inline Icons（自製）
```

### 2.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Mobile Safari | iOS 13+ |
| Chrome Mobile | Android 8+ |

### 2.3 檔案引入順序（index.html）

```html
<!-- CSS 引入順序 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/main.css">
<link rel="stylesheet" href="css/layout/responsive.css">
<link rel="stylesheet" href="css/components/board.css">
<link rel="stylesheet" href="css/components/pieces.css">
<link rel="stylesheet" href="css/components/dice.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/screens/menu.css">
<link rel="stylesheet" href="css/screens/game.css">
<link rel="stylesheet" href="css/screens/settings.css">
<link rel="stylesheet" href="css/screens/help.css">
<link rel="stylesheet" href="css/themes/theme-classic.css">
<link rel="stylesheet" href="css/themes/theme-ocean.css">
<link rel="stylesheet" href="css/themes/theme-forest.css">
<link rel="stylesheet" href="css/themes/theme-sunset.css">
<link rel="stylesheet" href="css/themes/theme-night.css">
<link rel="stylesheet" href="css/animations/transitions.css">
<link rel="stylesheet" href="css/animations/dice-roll.css">
<link rel="stylesheet" href="css/animations/piece-move.css">

<!-- JavaScript 引入順序 -->
<script src="js/lib/audio-engine.js"></script>
<script src="js/core/constants.js"></script>
<script src="js/core/i18n.js"></script>
<script src="js/core/state.js"></script>
<script src="js/core/storage.js"></script>
<script src="js/game/rules.js"></script>
<script src="js/game/board.js"></script>
<script src="js/game/dice.js"></script>
<script src="js/game/pieces.js"></script>
<script src="js/game/ai-easy.js"></script>
<script src="js/game/ai-normal.js"></script>
<script src="js/game/ai-hard.js"></script>
<script src="js/game/ai-manager.js"></script>
<script src="js/render/canvas-board.js"></script>
<script src="js/render/canvas-pieces.js"></script>
<script src="js/render/canvas-dice.js"></script>
<script src="js/render/animations.js"></script>
<script src="js/ui/menu.js"></script>
<script src="js/ui/game-ui.js"></script>
<script src="js/ui/settings-ui.js"></script>
<script src="js/ui/help-ui.js"></script>
<script src="js/ui/modal.js"></script>
<script src="js/ui/theme.js"></script>
<script src="js/main.js"></script>
```

---

## 3. 資料夾結構

```
backgammon/
│
├── index.html                    # 主入口，所有頁面由 JS 切換顯示
│
├── css/
│   ├── base/
│   │   ├── reset.css             # CSS Reset，清除瀏覽器預設樣式
│   │   ├── variables.css         # CSS 自訂變數（顏色、字體、間距）
│   │   └── typography.css        # 全域字體設定（大字體優先）
│   │
│   ├── layout/
│   │   ├── main.css              # 整體版面佈局
│   │   └── responsive.css        # RWD 斷點與行動裝置適配
│   │
│   ├── components/
│   │   ├── board.css             # 棋盤樣式
│   │   ├── pieces.css            # 棋子樣式
│   │   ├── dice.css              # 骰子樣式與動畫
│   │   ├── buttons.css           # 按鈕元件樣式
│   │   └── modal.css             # 彈窗元件樣式
│   │
│   ├── screens/
│   │   ├── menu.css              # 主選單畫面
│   │   ├── game.css              # 遊戲畫面
│   │   ├── settings.css          # 設定畫面
│   │   └── help.css              # 說明畫面
│   │
│   ├── themes/
│   │   ├── theme-classic.css     # 主題：古典棕木
│   │   ├── theme-ocean.css       # 主題：海洋藍
│   │   ├── theme-forest.css      # 主題：森林綠
│   │   ├── theme-sunset.css      # 主題：夕陽橘
│   │   └── theme-night.css       # 主題：深夜黑
│   │
│   └── animations/
│       ├── transitions.css        # 頁面過場動畫
│       ├── dice-roll.css          # 骰子滾動動畫
│       └── piece-move.css         # 棋子移動動畫
│
├── js/
│   ├── lib/
│   │   └── audio-engine.js        # Web Audio API 封裝（BGM + 音效）
│   │
│   ├── core/
│   │   ├── constants.js           # 全域常數定義
│   │   ├── i18n.js                # 多國語系管理
│   │   ├── state.js               # 全域狀態管理（GameState 物件）
│   │   └── storage.js             # localStorage 讀寫封裝
│   │
│   ├── game/
│   │   ├── rules.js               # 雙陸棋規則引擎（合法移動判斷）
│   │   ├── board.js               # 棋盤資料模型（24 點位陣列）
│   │   ├── dice.js                # 骰子邏輯（擲骰、點數管理）
│   │   ├── pieces.js              # 棋子邏輯（移動、吃子、回收）
│   │   ├── ai-easy.js             # AI 簡單難度（隨機策略）
│   │   ├── ai-normal.js           # AI 普通難度（貪婪策略）
│   │   ├── ai-hard.js             # AI 困難難度（Minimax + 評估函數）
│   │   └── ai-manager.js          # AI 管理器（依難度派發）
│   │
│   ├── render/
│   │   ├── canvas-board.js        # Canvas 棋盤繪製
│   │   ├── canvas-pieces.js       # Canvas 棋子繪製
│   │   ├── canvas-dice.js         # Canvas 骰子繪製
│   │   └── animations.js          # 動畫管理（requestAnimationFrame）
│   │
│   ├── ui/
│   │   ├── menu.js                # 主選單 UI 控制
│   │   ├── game-ui.js             # 遊戲畫面 UI 控制
│   │   ├── settings-ui.js         # 設定畫面 UI 控制
│   │   ├── help-ui.js             # 說明畫面 UI 控制
│   │   ├── modal.js               # 彈窗管理（勝負、確認等）
│   │   └── theme.js               # 主題切換控制
│   │
│   └── main.js                    # 程式進入點，初始化所有模組
│
├── locales/
│   ├── zh-TW.json                 # 繁體中文語系包
│   ├── en.json                    # 英文語系包
│   └── ja.json                    # 日文語系包
│
└── assets/
    └── fonts/
        └── NotoSansTC-Bold.woff2  # （可選）中文粗體字型
```

---

## 4. 遊戲規則與邏輯

### 4.1 基本概念

```
雙陸棋棋盤結構：
┌────────────────────────────────────────────┐
│ 13  14  15  16  17  18 ┃BAR┃ 19  20  21  22  23  24 │  ← 玩家起始區
│  ○   ○       ●       ○ ┃   ┃  ●           ○           │
│                        ┃   ┃                           │
│ 12  11  10   9   8   7 ┃BAR┃  6   5   4   3   2   1  │  ← AI 起始區
│  ●   ●       ○       ● ┃   ┃  ○           ●           │
└────────────────────────────────────────────┘
  ↑ 玩家 HOME BOARD (1-6)        AI HOME BOARD (19-24) ↑
```

### 4.2 棋盤初始配置

| 位置（Point） | 玩家（白色●）數量 | AI（黑色○）數量 |
|:---:|:---:|:---:|
| 1 | 2 | 0 |
| 6 | 0 | 5 |
| 8 | 0 | 3 |
| 12 | 5 | 0 |
| 13 | 0 | 5 |
| 17 | 3 | 0 |
| 19 | 5 | 0 |
| 24 | 0 | 2 |

### 4.3 棋子資料結構

```javascript
// board.js 中的棋盤陣列
const board = {
  points: Array(26).fill(null).map(() => ({ count: 0, color: null })),
  // index 0  = AI 的 bar（被打出的 AI 棋子）
  // index 1~24 = 棋盤 24 個點位
  // index 25 = 玩家的 bar（被打出的玩家棋子）
  
  bar: { player: 0, ai: 0 },      // 各方被打出的棋子數
  home: { player: 0, ai: 0 },     // 各方已收回的棋子數（熊入）
  
  totalPieces: 15,                 // 每方總棋子數
};
```

### 4.4 遊戲流程

```
遊戲開始
    │
    ▼
擲骰決定先手（兩方各擲一顆，大的先走）
    │
    ▼
┌─────────────────────┐
│     輪到當前玩家     │
│  擲骰（2顆）         │
│  若 double → 4步    │
└─────────────────────┘
    │
    ▼
判斷是否有合法移動
    ├── 有 → 玩家/AI 選擇移動
    └── 無 → 跳過回合
    │
    ▼
移動棋子（依規則）
    │
    ├── 落點只有對方1顆 → 打出（送入 BAR）
    ├── 落點有對方2顆+ → 非法，不可移動
    └── 落點空或同色 → 正常落點
    │
    ▼
判斷是否可以開始「熊入」（Bear Off）
    │
    ▼
所有棋子回到本方 Home Board 後可熊入
    │
    ▼
先將 15 顆棋子全部熊入者獲勝
    │
    ▼
計算勝利類型：
    ├── 普通勝（Normal Win）：對方已有棋子熊入
    ├── Gammon（豪奪）：對方0顆熊入
    └── Backgammon（絕殺）：對方0顆熊入且有棋在BAR或對方Home Board
```

### 4.5 遊戲規則引擎（rules.js）

#### 4.5.1 主要函數介面

```javascript
// rules.js 核心介面

/**
 * 取得指定棋子的所有合法移動目標
 * @param {Object} boardState - 當前棋盤狀態
 * @param {number} fromPoint - 起始點位（1-24, 0=bar）
 * @param {string} playerColor - 'white' | 'black'
 * @param {number[]} remainingDice - 剩餘可用骰子點數陣列
 * @returns {number[]} - 合法目標點位陣列
 */
function getLegalMoves(boardState, fromPoint, playerColor, remainingDice) {}

/**
 * 驗證一個移動是否合法
 * @param {Object} boardState - 棋盤狀態
 * @param {number} from - 起始點位
 * @param {number} to - 目標點位
 * @param {string} playerColor - 棋子顏色
 * @param {number} dieValue - 使用的骰子點數
 * @returns {boolean}
 */
function isLegalMove(boardState, from, to, playerColor, dieValue) {}

/**
 * 執行移動並返回新狀態
 * @param {Object} boardState - 棋盤狀態
 * @param {number} from - 起始點位
 * @param {number} to - 目標點位
 * @param {string} playerColor - 棋子顏色
 * @param {number} dieValue - 使用骰子點數
 * @returns {Object} - 新的棋盤狀態
 */
function applyMove(boardState, from, to, playerColor, dieValue) {}

/**
 * 判斷是否可以熊入
 * @param {Object} boardState - 棋盤狀態
 * @param {string} playerColor - 棋子顏色
 * @returns {boolean}
 */
function canBearOff(boardState, playerColor) {}

/**
 * 判斷遊戲是否結束及勝利類型
 * @param {Object} boardState - 棋盤狀態
 * @returns {{ isOver: boolean, winner: string|null, type: string|null }}
 */
function checkGameOver(boardState) {}

/**
 * 判斷當前玩家是否有任何合法移動
 * @param {Object} boardState - 棋盤狀態
 * @param {string} playerColor - 棋子顏色
 * @param {number[]} dice - 骰子點數陣列
 * @returns {boolean}
 */
function hasAnyLegalMove(boardState, playerColor, dice) {}
```

#### 4.5.2 方向定義

```javascript
// constants.js
const DIRECTION = {
  PLAYER: -1,   // 玩家棋子：從 24 往 1 移動（降序）
  AI: 1,        // AI 棋子：從 1 往 24 移動（升序）
};

const HOME_BOARD = {
  PLAYER: [1, 2, 3, 4, 5, 6],    // 玩家本方 Home Board
  AI: [19, 20, 21, 22, 23, 24],   // AI 本方 Home Board
};

const BEAR_OFF_POINT = {
  PLAYER: 0,   // 玩家熊入目標（點位 0）
  AI: 25,      // AI 熊入目標（點位 25）
};
```

### 4.6 骰子規則細節

- **普通點數（1~6）**：移動對應步數
- **對子（Double）**：獲得 4 次移動機會（而非 2 次）
- **開局對子特殊規則**：若開局雙方擲出相同點數，需重新擲骰
- **強制最大使用**：若骰子只能使用一個，必須使用較大的那個
- **無法使用**：若兩個骰子都無法使用，跳過回合（顯示提示）

---

## 5. 畫面設計規範

### 5.1 字體規格

```css
/* variables.css */
:root {
  /* 字體系列 */
  --font-primary: 'Noto Sans TC', 'Microsoft JhengHei', 'Hiragino Kaku Gothic ProN', sans-serif;
  --font-display: 'Georgia', 'Times New Roman', serif; /* 標題裝飾字 */
  
  /* 字體大小（基礎：16px，全部放大） */
  --font-xs:   1.0rem;   /* 16px - 最小說明文字 */
  --font-sm:   1.125rem; /* 18px - 輔助文字 */
  --font-base: 1.25rem;  /* 20px - 正文 */
  --font-md:   1.5rem;   /* 24px - 按鈕、標籤 */
  --font-lg:   1.875rem; /* 30px - 副標題 */
  --font-xl:   2.25rem;  /* 36px - 標題 */
  --font-2xl:  3rem;     /* 48px - 主標題 */
  --font-3xl:  4rem;     /* 64px - Logo 文字 */
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-bold:   700;
  --font-weight-black:  900;
  
  /* 行高 */
  --line-height-tight:  1.2;
  --line-height-normal: 1.6;
  --line-height-loose:  2.0;
}
```

### 5.2 間距系統

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
  --space-20: 80px;
}
```

### 5.3 圓角與陰影

```css
:root {
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-full: 9999px;
  
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.15);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.20);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.25);
  --shadow-xl:  0 16px 64px rgba(0,0,0,0.30);
  
  /* 棋子立體陰影 */
  --shadow-piece: inset 0 3px 6px rgba(255,255,255,0.4),
                  inset 0 -3px 6px rgba(0,0,0,0.3),
                  0 4px 12px rgba(0,0,0,0.4);
  
  /* 骰子陰影 */
  --shadow-dice: 4px 4px 10px rgba(0,0,0,0.4),
                 inset 0 0 5px rgba(255,255,255,0.1);
}
```

---

## 6. RWD 響應式設計

### 6.1 斷點定義

```css
/* responsive.css */

/* Mobile First 設計策略 */

/* 小螢幕手機 */
/* base styles: 320px ~ 479px */

/* 一般手機（橫向以下） */
@media (min-width: 480px) { ... }

/* 大型手機 / 小型平板（直向） */
@media (min-width: 600px) { ... }

/* 平板（直向） */
@media (min-width: 768px) { ... }

/* 平板（橫向）/ 小型桌機 */
@media (min-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1280px) { ... }

/* 大型桌機 */
@media (min-width: 1440px) { ... }
```

### 6.2 棋盤尺寸自適應

```
裝置            棋盤寬度    棋盤高度    棋子尺寸    字體縮放
────────────    ──────────  ──────────  ──────────  ──────
小手機（320px） 100vw       auto        18px        0.85x
手機（480px）   100vw       auto        22px        0.90x
大手機（600px） 100vw       auto        26px        0.95x
平板直（768px） 90vw        auto        30px        1.00x
平板橫（1024px）80vw        auto        34px        1.05x
桌機（1280px+） 900px 固定  auto        38px        1.10x
```

### 6.3 行動裝置操作按鈕佈局

**重要原則：行動裝置的操作按鈕不可遮擋棋盤**

```
手機直向佈局：
┌─────────────────────┐
│   [狀態列/回合資訊]   │  ← 頂部：玩家狀態、骰子結果
│   ─────────────────  │
│                      │
│       棋 盤          │  ← 中央：Canvas 棋盤（佔最大空間）
│     （可捲動）        │
│                      │
│   ─────────────────  │
│  [擲骰] [結束回合]   │  ← 底部：固定操作按鈕區域
│  [設定] [說明]       │      不遮擋棋盤
└─────────────────────┘

手機橫向佈局：
┌────────────────────────────────┐
│ [狀態] │        棋 盤         │ [按鈕] │
│        │                      │ [擲骰] │
│        │   （Canvas 棋盤）     │ [結束] │
│        │                      │        │
└────────────────────────────────┘
  左側欄   中央棋盤（最大化）      右側欄
```

### 6.4 行動裝置 CSS 規則

```css
/* responsive.css - 手機直向 */
@media (max-width: 767px) and (orientation: portrait) {
  .game-layout {
    display: flex;
    flex-direction: column;
    height: 100dvh; /* dynamic viewport height */
    overflow: hidden;
  }
  
  .game-status-bar {
    flex-shrink: 0;
    height: 60px;
    padding: var(--space-2) var(--space-4);
  }
  
  .game-board-container {
    flex: 1;
    min-height: 0; /* 允許收縮 */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .game-controls {
    flex-shrink: 0;
    height: 80px;         /* 固定高度 */
    padding: var(--space-3) var(--space-4);
    background: var(--color-panel-bg);
    border-top: 2px solid var(--color-border);
    display: flex;
    gap: var(--space-3);
    align-items: center;
    justify-content: center;
    /* 永遠不遮擋棋盤 */
    position: relative;
    z-index: 10;
  }
  
  .game-canvas {
    max-width: 100%;
    max-height: calc(100dvh - 60px - 80px - 4px);
    width: auto;
    height: auto;
  }
}

/* 手機橫向 */
@media (max-width: 900px) and (orientation: landscape) {
  .game-layout {
    display: flex;
    flex-direction: row;
    height: 100dvh;
  }
  
  .game-sidebar-left {
    width: 100px;
    flex-shrink: 0;
  }
  
  .game-board-container {
    flex: 1;
  }
  
  .game-sidebar-right {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
  }
  
  .game-canvas {
    max-height: 100dvh;
    max-width: 100%;
  }
}
```

---

## 7. 多國語系（i18n）

### 7.1 語系管理器（i18n.js）

```javascript
// i18n.js
const I18n = {
  currentLocale: 'zh-TW',  // 預設繁體中文
  
  supportedLocales: {
    'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
    'en':    { name: 'English',  flag: '🇺🇸' },
    'ja':    { name: '日本語',   flag: '🇯🇵' },
  },
  
  strings: {},
  
  async load(locale) {
    const response = await fetch(`locales/${locale}.json`);
    this.strings = await response.json();
    this.currentLocale = locale;
    this.applyAll();
  },
  
  t(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.strings) ?? key;
  },
  
  applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
  }
};
```

### 7.2 語系鍵值結構（zh-TW.json 示例）

```json
{
  "menu": {
    "title": "雙陸棋",
    "subtitle": "Backgammon",
    "start_game": "🎮 開始遊戲",
    "continue_game": "▶️ 繼續遊戲",
    "instructions": "📖 說明",
    "settings": "⚙️ 設定"
  },
  "game": {
    "your_turn": "你的回合",
    "ai_turn": "AI 回合",
    "roll_dice": "🎲 擲骰",
    "end_turn": "✅ 結束回合",
    "pieces_in_bar": "在 BAR 上的棋子",
    "bear_off": "熊入",
    "double": "對子！獲得 4 次移動",
    "no_moves": "沒有合法移動，跳過回合",
    "waiting_ai": "AI 思考中...",
    "undo": "↩️ 悔棋"
  },
  "result": {
    "win": "🎉 恭喜獲勝！",
    "lose": "😢 AI 獲勝",
    "gammon": "💥 豪奪！（Gammon）",
    "backgammon": "🔥 絕殺！（Backgammon）",
    "play_again": "再玩一次",
    "back_to_menu": "回主選單"
  },
  "settings": {
    "title": "⚙️ 設定",
    "language": "🌐 語言",
    "theme": "🎨 配色主題",
    "bgm_volume": "🎵 BGM 音量",
    "sfx_volume": "🔊 音效音量",
    "difficulty": "🤖 AI 難度",
    "easy": "😊 簡單",
    "normal": "😐 普通",
    "hard": "😈 困難",
    "animation_speed": "⚡ 動畫速度",
    "slow": "慢",
    "normal_speed": "普通",
    "fast": "快",
    "save": "💾 儲存設定",
    "reset": "🔄 重設預設值"
  },
  "help": {
    "title": "📖 遊戲說明",
    "tabs": {
      "overview": "概覽",
      "movement": "移動規則",
      "bar": "BAR 規則",
      "bear_off": "熊入規則",
      "winning": "勝利條件"
    }
  },
  "themes": {
    "classic": "🪵 古典棕木",
    "ocean": "🌊 海洋藍",
    "forest": "🌲 森林綠",
    "sunset": "🌅 夕陽橘",
    "night": "🌙 深夜黑"
  },
  "common": {
    "ok": "確定",
    "cancel": "取消",
    "back": "⬅️ 返回",
    "close": "✕ 關閉",
    "confirm": "確認",
    "yes": "是",
    "no": "否"
  }
}
```

### 7.3 HTML 使用方式

```html
<!-- 使用 data-i18n 屬性自動套用翻譯 -->
<button class="btn-primary" data-i18n="menu.start_game">🎮 開始遊戲</button>
<h1 class="menu-title" data-i18n="menu.title">雙陸棋</h1>
```

---

## 8. 音效與 BGM

### 8.1 音效設計原則

- **BGM**：使用 Web Audio API 程序化生成輕快鋼琴音樂（C 大調，Allegretto 節奏）
- **音效**：高音輕脆音（C6 以上，短促打擊音色）
- **BGM 音量**：預設播放時放大為原本的 **5 倍（gain = 5.0）**
- **所有音效使用 Web Audio API**，無需外部音頻檔案

### 8.2 音效分類

| 音效名稱 | 觸發時機 | 音調建議 | 時長 |
|----------|----------|----------|------|
| `dice_roll` | 骰子滾動中 | 連續顫音 C6 | 600ms |
| `dice_land` | 骰子停止 | 輕脆打擊 G6 | 100ms |
| `piece_move` | 棋子移動 | 輕點木聲 A5 | 80ms |
| `piece_hit` | 打出對方棋子 | 清脆碰撞 E6 | 150ms |
| `bear_off` | 棋子熊入 | 上升音調 C6→G6 | 200ms |
| `turn_start` | 輪到玩家 | 提示音 F5 | 100ms |
| `win` | 獲勝 | 歡樂和弦 C+E+G 大調 | 1200ms |
| `lose` | 失敗 | 下降音調 G4→C4 | 800ms |
| `no_moves` | 無合法移動 | 低沉提示音 A3 | 200ms |
| `btn_click` | 按鈕點擊 | 輕脆 E6 | 60ms |
| `double` | 擲出對子 | 雙音效 C6+E6 | 300ms |

### 8.3 音效引擎（audio-engine.js）

```javascript
// audio-engine.js
const AudioEngine = {
  context: null,
  masterGain: null,
  bgmGain: null,
  sfxGain: null,
  bgmOscillators: [],
  isBgmPlaying: false,
  
  init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    
    // 主音量控制
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    
    // BGM 增益（×5 倍）
    this.bgmGain = this.context.createGain();
    this.bgmGain.gain.value = 5.0; // ← BGM 放大 5 倍
    this.bgmGain.connect(this.masterGain);
    
    // 音效增益
    this.sfxGain = this.context.createGain();
    this.sfxGain.gain.value = 1.0;
    this.sfxGain.connect(this.masterGain);
  },
  
  // 設定 BGM 音量（0.0 ~ 1.0，實際乘以 5）
  setBgmVolume(value) {
    this.bgmGain.gain.value = value * 5.0;
  },
  
  // 設定音效音量（0.0 ~ 1.0）
  setSfxVolume(value) {
    this.sfxGain.gain.value = value;
  },
  
  // 播放單一音符（用於音效）
  playNote(frequency, duration, type = 'sine', gain = 0.5) {
    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    gainNode.gain.setValueAtTime(gain, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.context.currentTime + duration);
  },
  
  // 播放音效（依名稱）
  playSfx(name) {
    const sfxMap = {
      dice_roll:  () => this._playDiceRoll(),
      dice_land:  () => this.playNote(1568, 0.1, 'triangle', 0.6),  // G6
      piece_move: () => this.playNote(880, 0.08, 'triangle', 0.4),  // A5
      piece_hit:  () => this.playNote(1319, 0.15, 'square', 0.3),   // E6
      bear_off:   () => this._playBearOff(),
      turn_start: () => this.playNote(698, 0.1, 'sine', 0.4),       // F5
      win:        () => this._playWin(),
      lose:       () => this._playLose(),
      no_moves:   () => this.playNote(220, 0.2, 'sine', 0.3),       // A3
      btn_click:  () => this.playNote(1319, 0.06, 'triangle', 0.3), // E6
      double:     () => this._playDouble(),
    };
    
    if (sfxMap[name]) sfxMap[name]();
  },
  
  // 開始播放 BGM（輕快鋼琴曲）
  startBgm() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this._schedulePianoMelody();
  },
  
  stopBgm() {
    this.bgmOscillators.forEach(o => { try { o.stop(); } catch(e) {} });
    this.bgmOscillators = [];
    this.isBgmPlaying = false;
  },
  
  // 程序化生成輕快鋼琴旋律
  _schedulePianoMelody() {
    // C 大調音符頻率
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
    };
    
    // 輕快旋律序列（BPM = 140）
    const melody = [
      ['C5', 0.3], ['E5', 0.3], ['G5', 0.3], ['E5', 0.3],
      ['D5', 0.3], ['F4', 0.3], ['A4', 0.3], ['F4', 0.3],
      ['C5', 0.6], ['G4', 0.6],
      ['E5', 0.3], ['D5', 0.3], ['C5', 0.6],
    ];
    
    let time = this.context.currentTime;
    const loop = () => {
      if (!this.isBgmPlaying) return;
      melody.forEach(([note, dur]) => {
        const osc = this.context.createOscillator();
        const g = this.context.createGain();
        osc.type = 'triangle';
        osc.frequency.value = notes[note];
        g.gain.setValueAtTime(0.3, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.9);
        osc.connect(g);
        g.connect(this.bgmGain);
        osc.start(time);
        osc.stop(time + dur);
        this.bgmOscillators.push(osc);
        time += dur;
      });
      // 循環播放
      const totalDuration = melody.reduce((sum, [, d]) => sum + d, 0);
      setTimeout(loop, totalDuration * 1000 - 100);
    };
    loop();
  },
};
```

---

## 9. 各功能頁面規格

### 9.1 主選單畫面（menu.html structure）

```
主選單畫面佈局：
┌─────────────────────────────────────────┐
│            語系選擇 [ZH|EN|JA]           │  ← 右上角，圓形旗幟按鈕
├─────────────────────────────────────────┤
│                                          │
│    🎲  雙陸棋 / Backgammon / バックギャモン │  ← 大標題（font-3xl）+ 動態骰子圖示
│                                          │
│   ┌─────────────────────────────────┐   │
│   │     🎮  開始遊戲                 │   │  ← 主按鈕（大型，顯眼）
│   └─────────────────────────────────┘   │
│                                          │
│   ┌─────────────────────────────────┐   │
│   │     ▶️  繼續遊戲                 │   │  ← 若無存檔則灰色顯示
│   └─────────────────────────────────┘   │
│                                          │
│   ┌─────────────────────────────────┐   │
│   │     📖  說明                    │   │
│   └─────────────────────────────────┘   │
│                                          │
│   ┌─────────────────────────────────┐   │
│   │     ⚙️  設定                    │   │
│   └─────────────────────────────────┘   │
│                                          │
│                版本 v1.0.0              │  ← 頁尾版本號
└─────────────────────────────────────────┘
```

#### 主選單 CSS 規格

```css
/* menu.css */
.menu-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-bg-gradient);
  padding: var(--space-8);
  gap: var(--space-5);
}

.menu-title {
  font-size: var(--font-3xl);
  font-weight: var(--font-weight-black);
  color: var(--color-title);
  text-shadow: 0 4px 12px rgba(0,0,0,0.3);
  text-align: center;
  letter-spacing: 0.05em;
}

.menu-subtitle {
  font-size: var(--font-lg);
  color: var(--color-subtitle);
  text-align: center;
  opacity: 0.85;
}

.menu-btn {
  width: 100%;
  max-width: 420px;
  padding: var(--space-5) var(--space-8);
  font-size: var(--font-md);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  letter-spacing: 0.05em;
}

.menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.menu-btn:active {
  transform: translateY(0);
}

.menu-btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-md);
}

.menu-btn-secondary {
  background: var(--color-secondary);
  color: var(--color-on-secondary);
}

.menu-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}
```

### 9.2 難度選擇畫面（開始遊戲後顯示）

```
難度選擇彈窗：
┌─────────────────────────────┐
│   🤖 選擇 AI 難度            │
├─────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │  😊 簡單              │   │  ← 綠色按鈕
│  │  AI 隨機選擇，適合初學 │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  😐 普通              │   │  ← 黃色按鈕
│  │  AI 貪婪策略，有挑戰  │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  😈 困難              │   │  ← 紅色按鈕
│  │  AI 深度計算，強力對手 │   │
│  └──────────────────────┘   │
│                              │
│  [ ⬅️ 返回 ]                │
└─────────────────────────────┘
```

### 9.3 遊戲畫面佈局

```
桌機遊戲畫面：
┌────────────────────────────────────────────────────────┐
│ [🏠 主選單]         🎲 雙陸棋         [⚙️] [🔊]        │  ← 頂部導覽列（60px）
├────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐   ┌──────────────────────────┐   ┌──────┐│
│  │ AI 資訊  │   │                          │   │ 資訊 ││
│  │ ○ x 15  │   │                          │   │      ││
│  │ BAR: 0  │   │       棋盤（Canvas）       │   │ 骰子 ││
│  │         │   │                          │   │  🎲  ││
│  │ [骰子結果]│   │                          │   │  ⚄   ││
│  │ ⚃ ⚅    │   │                          │   │      ││
│  │         │   │                          │   │      ││
│  │ 玩家資訊  │   │                          │   │      ││
│  │ ● x 15  │   │                          │   │      ││
│  │ BAR: 0  │   │                          │   │      ││
│  └──────────┘   └──────────────────────────┘   └──────┘│
│                                                          │
│              [🎲 擲骰]  [↩️ 悔棋]  [✅ 結束回合]          │  ← 底部操作區
└────────────────────────────────────────────────────────┘
```

---

## 10. AI 對手系統

### 10.1 AI 架構概覽

```
ai-manager.js
    │
    ├── difficulty === 'easy'   → ai-easy.js
    ├── difficulty === 'normal' → ai-normal.js
    └── difficulty === 'hard'   → ai-hard.js
```

### 10.2 簡單 AI（ai-easy.js）

**策略：隨機選擇合法移動**

```javascript
// ai-easy.js
const AiEasy = {
  /**
   * 計算 AI 移動方案
   * @param {Object} boardState - 當前棋盤狀態
   * @param {number[]} dice - 骰子點數
   * @returns {Array<{from, to, die}>} - 移動序列
   */
  computeMoves(boardState, dice) {
    const moves = [];
    let remainingDice = [...dice];
    let currentBoard = { ...boardState };
    
    while (remainingDice.length > 0) {
      const allLegal = this._getAllLegalMoves(currentBoard, remainingDice, 'black');
      if (allLegal.length === 0) break;
      
      // 隨機選擇一個合法移動
      const randomMove = allLegal[Math.floor(Math.random() * allLegal.length)];
      moves.push(randomMove);
      
      currentBoard = Rules.applyMove(currentBoard, randomMove.from, randomMove.to, 'black', randomMove.die);
      remainingDice.splice(remainingDice.indexOf(randomMove.die), 1);
    }
    
    return moves;
  },
  
  _getAllLegalMoves(board, dice, color) {
    const legal = [];
    const uniqueDice = [...new Set(dice)];
    
    for (const die of uniqueDice) {
      // 從 BAR 出發（若有棋子在 BAR）
      if (board.bar.ai > 0) {
        const target = die; // AI 從 BAR 進入對方 Home Board
        if (Rules.isLegalMove(board, 0, target, color, die)) {
          legal.push({ from: 0, to: target, die });
        }
        continue; // BAR 有棋子時必須先處理
      }
      
      // 一般移動
      for (let point = 1; point <= 24; point++) {
        if (board.points[point].color !== 'black' || board.points[point].count === 0) continue;
        const targets = Rules.getLegalMoves(board, point, color, [die]);
        targets.forEach(to => legal.push({ from: point, to, die }));
      }
    }
    
    return legal;
  }
};
```

### 10.3 普通 AI（ai-normal.js）

**策略：貪婪啟發式（Greedy Heuristic）**

評分因子：
- ✅ 打出對方棋子：+15 分
- ✅ 建立安全點（≥2 顆）：+8 分
- ✅ 前進（移往 Home Board 方向）：+3 分/點
- ✅ 熊入棋子：+20 分
- ❌ 獨子暴露（單獨棋子）：-10 分
- ❌ 棋子被困 BAR：-12 分

### 10.4 困難 AI（ai-hard.js）

**策略：Minimax + Alpha-Beta 剪枝 + 評估函數**

```javascript
// ai-hard.js
const AiHard = {
  MAX_DEPTH: 3,         // 搜尋深度
  THINK_DELAY: 1200,    // 思考延遲（ms），讓玩家感覺 AI 在思考
  
  computeMoves(boardState, dice) {
    // Minimax 搜尋
    const result = this._minimax(boardState, dice, this.MAX_DEPTH, -Infinity, Infinity, true);
    return result.moves;
  },
  
  // 盤面評估函數（越高對 AI 越有利）
  _evaluate(boardState) {
    let score = 0;
    
    // 棋子前進進度
    for (let i = 1; i <= 24; i++) {
      const pt = boardState.points[i];
      if (pt.color === 'black') score += (i) * pt.count * 2;
      if (pt.color === 'white') score -= (25 - i) * pt.count * 2;
    }
    
    // BAR 懲罰
    score -= boardState.bar.ai * 20;
    score += boardState.bar.player * 20;
    
    // 熊入獎勵
    score += boardState.home.ai * 30;
    score -= boardState.home.player * 30;
    
    // 安全點獎勵
    for (let i = 1; i <= 24; i++) {
      const pt = boardState.points[i];
      if (pt.color === 'black' && pt.count >= 2) score += 5;
      if (pt.color === 'white' && pt.count >= 2) score -= 5;
    }
    
    // 暴露棋子懲罰
    for (let i = 1; i <= 24; i++) {
      const pt = boardState.points[i];
      if (pt.color === 'black' && pt.count === 1) score -= 8;
      if (pt.color === 'white' && pt.count === 1) score += 8;
    }
    
    return score;
  },
};
```

### 10.5 AI 移動動畫

AI 移動時需有視覺反饋：
1. 🔴 **高亮顯示**來源點位（0.3 秒）
2. 🟡 **顯示移動路徑**（虛線動畫，0.2 秒）
3. 🟢 **棋子滑動**至目標（0.4 秒 ease-out）
4. 若打出玩家棋子：額外震動動畫（0.2 秒）

---

## 11. 棋子與骰子規格

### 11.1 棋子視覺規格（Canvas 繪製）

```
棋子正面視圖（圓形，真實雙陸棋棋子）：

     ╭──────────────╮
    ╱   亮部高光      ╲
   │   ╭──────────╮   │  ← 外環陰影（深色邊框）
   │  ╱   主色區    ╲  │
   │ │   ╭──────╮   │ │  ← 中心光暈
   │ │  ╱  反光  ╲  │ │
   │ │  │   ⊙    │  │ │  ← 棋子圖案（○ 或 ● 的細節）
   │ │  ╲        ╱  │ │
   │ │   ╰──────╯   │ │
   │  ╲            ╱  │
   │   ╰──────────╯   │
    ╲   暗部陰影       ╱
     ╰──────────────╯
```

#### 棋子繪製代碼規格（canvas-pieces.js）

```javascript
// canvas-pieces.js
function drawPiece(ctx, x, y, radius, color, isSelected = false, stackIndex = 0) {
  const isWhite = color === 'white';
  
  // 棋子主色
  const mainColor = isWhite ? '#F5F0E8' : '#2C2416';
  const highlightColor = isWhite ? '#FFFFFF' : '#4A3828';
  const shadowColor = isWhite ? '#C8BEA8' : '#0A0806';
  const rimColor = isWhite ? '#8B7355' : '#1A1008';
  
  // 1. 外環（邊框/Rim）
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  const rimGradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
  rimGradient.addColorStop(0, highlightColor);
  rimGradient.addColorStop(1, rimColor);
  ctx.fillStyle = rimGradient;
  ctx.fill();
  
  // 2. 主體（稍小的圓）
  const innerRadius = radius * 0.88;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
  const bodyGradient = ctx.createRadialGradient(
    x - innerRadius * 0.35, y - innerRadius * 0.35, innerRadius * 0.1,
    x, y, innerRadius
  );
  bodyGradient.addColorStop(0, highlightColor);
  bodyGradient.addColorStop(0.4, mainColor);
  bodyGradient.addColorStop(1, shadowColor);
  ctx.fillStyle = bodyGradient;
  ctx.fill();
  
  // 3. 頂部高光（橢圓形光澤）
  ctx.beginPath();
  ctx.ellipse(x - innerRadius * 0.2, y - innerRadius * 0.3, innerRadius * 0.3, innerRadius * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)';
  ctx.fill();
  
  // 4. 選中效果（金色光暈）
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  // 5. 疊放時顯示數量（3顆以上）
  if (stackIndex >= 3) {
    ctx.fillStyle = isWhite ? '#4A3828' : '#F5F0E8';
    ctx.font = `bold ${radius * 0.8}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stackIndex.toString(), x, y);
  }
}
```

### 11.2 骰子視覺規格（Canvas 繪製）

```
真實骰子正面視圖（圓角正方形，立體感）：

  ┌─────────────────────┐
  │ ╲  上方高光面       │
  │   ╲─────────────────┤
  │   │                 │
  │   │   ● ● ● ●      │  ← 點數（黑色圓點，凹陷感）
  │   │   ● ● ● ●      │
  │   │                 │
  │───┤                 │
  │    ╲  陰影面        │
  └─────────────────────┘

骰子各面點數標準排列（符合真實骰子規範）：
- 1 對 6（相加=7）
- 2 對 5（相加=7）
- 3 對 4（相加=7）
```

#### 骰子繪製代碼規格（canvas-dice.js）

```javascript
// canvas-dice.js
function drawDice(ctx, x, y, size, value, isRolling = false, rotation = 0) {
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  if (isRolling) ctx.rotate(rotation);
  ctx.translate(-size/2, -size/2);
  
  const radius = size * 0.15; // 圓角半徑
  
  // 1. 骰子主體（圓角矩形）
  roundRect(ctx, 0, 0, size, size, radius);
  
  // 立體漸層（象牙白色，有厚度感）
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#FAFAF8');
  bgGrad.addColorStop(0.5, '#F0EEE8');
  bgGrad.addColorStop(1, '#D8D4C8');
  ctx.fillStyle = bgGrad;
  ctx.fill();
  
  // 2. 頂部高光邊
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, size - 2, size - 2, radius - 1);
  ctx.stroke();
  
  // 3. 底部陰影邊
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  roundRect(ctx, 2, 2, size - 2, size - 2, radius);
  ctx.stroke();
  
  // 4. 外框
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.strokeStyle = '#5C4A2A';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  
  // 5. 繪製點數
  if (!isRolling) {
    drawDots(ctx, value, size);
  }
  
  // 6. 整體陰影
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  ctx.restore();
}

// 點數位置對應表（真實骰子標準）
const DOT_POSITIONS = {
  1: [[0.5, 0.5]],
  2: [[0.25, 0.25], [0.75, 0.75]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]],
};

function drawDots(ctx, value, size) {
  const dotRadius = size * 0.08;
  const positions = DOT_POSITIONS[value];
  
  positions.forEach(([px, py]) => {
    const cx = px * size;
    const cy = py * size;
    
    // 凹陷陰影（點數凹入骰子表面的效果）
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 1, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();
    
    // 點數主體（深紅色 / 傳統骰子顏色）
    const dotGrad = ctx.createRadialGradient(cx - dotRadius*0.3, cy - dotRadius*0.3, 0, cx, cy, dotRadius);
    dotGrad.addColorStop(0, '#CC2200');
    dotGrad.addColorStop(1, '#8B0000');
    
    ctx.beginPath();
    ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = dotGrad;
    ctx.fill();
  });
}
```

### 11.3 棋盤繪製規格（canvas-board.js）

```
棋盤結構：
┌──────────────────────────────────────────────────────────┐
│  [13][14][15][16][17][18]  │BAR│  [19][20][21][22][23][24]│
│                             │   │                          │
│   ▽   ▽   ▽   ▽   ▽   ▽  │   │  ▽   ▽   ▽   ▽   ▽   ▽ │
│  (深)(淺)(深)(淺)(深)(淺)  │   │ (淺)(深)(淺)(深)(淺)(深)│
│                             │   │                          │
│                             │   │                          │
│                             │   │                          │
│   △   △   △   △   △   △  │   │  △   △   △   △   △   △ │
│  (淺)(深)(淺)(深)(淺)(深)  │   │ (深)(淺)(深)(淺)(深)(淺)│
│  [12][11][10][ 9][ 8][ 7]  │BAR│  [ 6][ 5][ 4][ 3][ 2][ 1]│
└──────────────────────────────────────────────────────────┘

三角形（Point）：
- 高度：棋盤高度的 40%
- 底邊寬度：棋盤寬度的 1/12（每格一個）
- 上半部（AI 區）：尖端朝下（▽）
- 下半部（玩家區）：尖端朝上（△）
- 顏色：依主題交替深色/淺色
- BAR：中央隔板，寬度為棋盤寬度的 1/12
```

---

## 12. 設定系統

### 12.1 設定頁面佈局

```
設定畫面（乾淨簡單風格）：

┌─────────────────────────────────────┐
│  ⚙️  設定                   [ ← 返回] │  ← 頂部標題列
├─────────────────────────────────────┤
│                                      │
│  ─── 🌐 語言 ───────────────────── │
│                                      │
│    [🇹🇼 繁體中文] [🇺🇸 English] [🇯🇵 日本語] │  ← 語言切換（按鈕組）
│                                      │
│  ─── 🎨 配色主題 ──────────────── │
│                                      │
│  [🪵 古典] [🌊 海洋] [🌲 森林]       │  ← 主題選擇（色塊預覽）
│  [🌅 夕陽] [🌙 深夜]                 │
│                                      │
│  ─── 🎵 音量控制 ──────────────── │
│                                      │
│  🎵 BGM 音量                         │
│  [🔈 ━━━━━━━━━●─── 🔊]  75%         │  ← 滑桿（漂亮樣式）
│                                      │
│  🔊 音效音量                         │
│  [🔈 ━━━━━━━━━━━━● 🔊]  100%        │
│                                      │
│  ─── 🤖 AI 難度 ──────────────── │
│                                      │
│    [😊 簡單] [😐 普通] [😈 困難]      │  ← 三選一按鈕組
│                                      │
│  ─── ⚡ 動畫速度 ─────────────── │
│                                      │
│    [🐢 慢] [⚡ 普通] [🚀 快]          │
│                                      │
│  ┌─────────────────────────────┐    │
│  │        💾 儲存設定           │    │  ← 主要操作按鈕
│  └─────────────────────────────┘    │
│         🔄 重設為預設值              │  ← 次要操作（較小）
│                                      │
└─────────────────────────────────────┘
```

### 12.2 設定 CSS 規格

```css
/* settings.css */

/* 滑桿樣式 */
.volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-slider-track);
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: transform 0.1s;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* 按鈕組 */
.btn-group {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.btn-group-item {
  flex: 1;
  min-width: 100px;
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-base);
  font-weight: var(--font-weight-bold);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-group-item.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-md);
}

/* 主題色塊 */
.theme-picker {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.theme-swatch {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: var(--font-sm);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.theme-swatch.active {
  border-color: var(--color-primary);
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}
```

### 12.3 設定資料結構（storage.js）

```javascript
// 設定的 localStorage key
const SETTINGS_KEY = 'backgammon_settings';
const SAVE_KEY = 'backgammon_save';

const DEFAULT_SETTINGS = {
  language: 'zh-TW',        // 語系
  theme: 'classic',          // 配色主題
  bgmVolume: 0.75,           // BGM 音量（0.0 ~ 1.0，實際乘以 5）
  sfxVolume: 1.0,            // 音效音量
  difficulty: 'normal',      // AI 難度
  animationSpeed: 'normal',  // 動畫速度（slow / normal / fast）
};
```

---

## 13. 存檔與讀取

### 13.1 存檔資料結構

```javascript
// storage.js

const GameSave = {
  version: '1.0.0',
  timestamp: Date.now(),
  settings: { /* 同上設定結構 */ },
  
  gameState: {
    board: { /* 棋盤狀態 */ },
    currentPlayer: 'player',  // 'player' | 'ai'
    dice: [],                  // 當前骰子
    phase: 'roll',            // 'roll' | 'move' | 'bear-off'
    difficulty: 'normal',
    moveHistory: [],           // 悔棋用移動歷史（最多 3 步）
    turn: 1,
  }
};
```

### 13.2 存檔觸發時機

- 每次棋子移動後自動存檔
- 回合結束後存檔
- 開啟設定頁面前存檔

### 13.3 繼續遊戲邏輯

```javascript
// storage.js
function hasSavedGame() {
  const save = localStorage.getItem(SAVE_KEY);
  if (!save) return false;
  const data = JSON.parse(save);
  // 檢查版本相容性與遊戲是否已結束
  return data.version === '1.0.0' && data.gameState && !data.gameState.isOver;
}
```

---

## 14. 配色主題系統

### 14.1 五大主題色彩規格

#### 🪵 古典棕木（Classic）

```css
/* theme-classic.css */
[data-theme="classic"] {
  --color-bg-gradient:     linear-gradient(135deg, #3D2B1F 0%, #5C4033 100%);
  --color-board-dark:      #8B4513;    /* 深棕（三角）*/
  --color-board-light:     #DEB887;    /* 淺棕（三角）*/
  --color-board-surface:   #C8A96E;    /* 棋盤底色 */
  --color-border:          #4A2C1A;
  --color-bar:             #2D1B0E;
  --color-primary:         #8B5E3C;
  --color-on-primary:      #FFF8F0;
  --color-secondary:       #D2691E;
  --color-on-secondary:    #FFF8F0;
  --color-title:           #F5DEB3;
  --color-subtitle:        #DEB887;
  --color-text:            #3D2B1F;
  --color-text-light:      #8B7355;
  --color-surface:         #F5E6D3;
  --color-panel-bg:        #3D2B1F;
  --color-piece-white:     #F5F0E8;
  --color-piece-black:     #2C2416;
  --color-highlight:       #FFD700;    /* 可選點位高亮 */
  --color-slider-track:    #8B5E3C;
}
```

#### 🌊 海洋藍（Ocean）

```css
[data-theme="ocean"] {
  --color-bg-gradient:     linear-gradient(135deg, #0A2342 0%, #1B4F8A 100%);
  --color-board-dark:      #1565C0;
  --color-board-light:     #90CAF9;
  --color-board-surface:   #BBDEFB;
  --color-border:          #0D3B6E;
  --color-bar:             #0A2342;
  --color-primary:         #1976D2;
  --color-on-primary:      #FFFFFF;
  --color-secondary:       #03A9F4;
  --color-on-secondary:    #003366;
  --color-title:           #E3F2FD;
  --color-text:            #0A2342;
  --color-surface:         #E3F2FD;
  --color-panel-bg:        #0A2342;
  --color-piece-white:     #ECEFF1;
  --color-piece-black:     #1A237E;
  --color-highlight:       #00E5FF;
}
```

#### 🌲 森林綠（Forest）

```css
[data-theme="forest"] {
  --color-bg-gradient:     linear-gradient(135deg, #1B3A2D 0%, #2D5A3D 100%);
  --color-board-dark:      #2E7D32;
  --color-board-light:     #A5D6A7;
  --color-board-surface:   #C8E6C9;
  --color-border:          #1B5E20;
  --color-primary:         #388E3C;
  --color-on-primary:      #FFFFFF;
  --color-title:           #E8F5E9;
  --color-text:            #1B3A2D;
  --color-surface:         #E8F5E9;
  --color-panel-bg:        #1B3A2D;
  --color-piece-white:     #F1F8E9;
  --color-piece-black:     #1B3A2D;
  --color-highlight:       #AEEA00;
}
```

#### 🌅 夕陽橘（Sunset）

```css
[data-theme="sunset"] {
  --color-bg-gradient:     linear-gradient(135deg, #4A1942 0%, #C0392B 50%, #E67E22 100%);
  --color-board-dark:      #C0392B;
  --color-board-light:     #F8C291;
  --color-board-surface:   #FDEBD0;
  --color-border:          #7B241C;
  --color-primary:         #E74C3C;
  --color-on-primary:      #FFFFFF;
  --color-title:           #FDEBD0;
  --color-text:            #4A1942;
  --color-surface:         #FDEBD0;
  --color-panel-bg:        #4A1942;
  --color-piece-white:     #FDFEFE;
  --color-piece-black:     #4A1942;
  --color-highlight:       #F1C40F;
}
```

#### 🌙 深夜黑（Night）

```css
[data-theme="night"] {
  --color-bg-gradient:     linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%);
  --color-board-dark:      #2D2D2D;
  --color-board-light:     #4A4A6A;
  --color-board-surface:   #1E1E2E;
  --color-border:          #0D0D0D;
  --color-primary:         #7C4DFF;
  --color-on-primary:      #FFFFFF;
  --color-title:           #E8E8FF;
  --color-text:            #E8E8FF;
  --color-text-light:      #9E9EC0;
  --color-surface:         #2D2D4A;
  --color-panel-bg:        #0D0D1A;
  --color-piece-white:     #E8E8FF;
  --color-piece-black:     #1A1A2E;
  --color-highlight:       #E040FB;
  --color-slider-track:    #7C4DFF;
}
```

---

## 15. 說明頁面規格

### 15.1 說明頁面結構

說明頁面採用**分頁式（Tab）設計**，圖示豐富，易於閱讀：

```
說明頁面：
┌─────────────────────────────────────────────┐
│  📖 遊戲說明                      [ ← 返回] │
├─────────────────────────────────────────────┤
│ [概覽] [移動] [BAR] [熊入] [勝利] [術語]    │  ← 分頁標籤（可水平捲動）
├─────────────────────────────────────────────┤
│                                              │
│  【概覽 Tab】                                │
│                                              │
│  🎯 遊戲目標                                 │
│  ─────────────────────────────              │
│  成為第一個將所有 15 顆棋子從棋盤移出的玩家   │
│                                              │
│  🎲 雙陸棋是什麼？                           │
│  ─────────────────────────────              │
│  [棋盤示意 SVG 圖解]                         │
│                                              │
│  👤 玩家（白棋 ●）   🤖 AI（黑棋 ○）        │
│  移動方向：24 → 1    移動方向：1 → 24       │
│                                              │
│  🎮 基本流程                                 │
│  1️⃣ 擲骰子決定步數                          │
│  2️⃣ 移動對應步數的棋子                       │
│  3️⃣ 先將所有棋子移出者獲勝                   │
│                                              │
└─────────────────────────────────────────────┘
```

### 15.2 說明各分頁內容

#### Tab 1：概覽（Overview）

```
🎯 遊戲目標
🎲 遊戲簡介（含 SVG 棋盤示意圖）
👥 雙方棋子顏色說明
🎮 基本遊戲流程（1→2→3 步驟）
📊 初始棋子佈局圖解
```

#### Tab 2：移動規則（Movement）

```
🎲 擲骰子
  ├── 普通點數說明（含骰子示意圖）
  └── 對子（Double）說明圖解

♟️ 棋子移動
  ├── 移動方向（SVG 箭頭圖解）
  ├── 合法落點（空位 / 同色）
  └── 非法落點（對方 2 顆以上）

⚔️ 打出對方棋子
  └── 對方只有 1 顆時可打出（動畫圖解）
```

#### Tab 3：BAR 規則

```
🚧 什麼是 BAR？
  └── BAR 示意圖（棋盤中央隔板）

😱 被打出時
  └── 棋子移至 BAR 圖解

🔄 從 BAR 重新入場
  ├── 必須先從 BAR 出發的規則
  └── 入場位置計算圖解
```

#### Tab 4：熊入規則（Bear Off）

```
🏠 Home Board 說明
  └── 各方 Home Board 位置圖解

✅ 何時可以熊入？
  └── 所有棋子在 Home Board 內

🎯 如何熊入
  ├── 直接對應（骰子=點位）
  └── 超出時的處理規則（最大點位）
```

#### Tab 5：勝利條件

```
🏆 普通勝（Normal Win）
  └── 對方已有熊入棋子

💥 豪奪（Gammon）× 2 倍分數
  └── 對方 0 顆熊入

🔥 絕殺（Backgammon）× 3 倍分數
  └── 對方 0 顆熊入且有棋在 BAR 或敵方 Home Board
```

#### Tab 6：術語表

```
📚 常用術語（圖示 + 說明 對照表）

┌──────────┬────────────────────────────────┐
│ 🎲 Point  │ 棋盤上的三角形位置（共24個）   │
│ 🚧 Bar    │ 棋盤中央隔板，被打出棋子的位置 │
│ 🏠 Home   │ 各方的起始/終點區域            │
│ ⚰️ Bear   │ 熊入，將棋子移出棋盤           │
│    Off    │                                │
│ 🎰 Double │ 骰子兩顆相同，獲得4次移動     │
│ 🎯 Gammon │ 對方完全沒有熊入棋子時的勝利  │
└──────────┴────────────────────────────────┘
```

---

## 16. 效能與相容性

### 16.1 Canvas 效能優化

```javascript
// canvas-board.js - 效能優化策略

// 1. 離屏 Canvas（Offscreen Canvas）預先繪製靜態棋盤
const offscreenBoard = document.createElement('canvas');
const offCtx = offscreenBoard.getContext('2d');
// 只有棋盤底色和三角形需要更新

// 2. 只在有變化時重繪
let isDirty = true;
function gameLoop() {
  if (isDirty) {
    render();
    isDirty = false;
  }
  requestAnimationFrame(gameLoop);
}

// 3. 避免頻繁觸發 GC
const REUSE_BUFFER = [];
```

### 16.2 行動裝置觸控支援

```javascript
// game-ui.js - 觸控支援
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

function handleTouchStart(e) {
  e.preventDefault();  // 防止頁面滾動
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  handleCanvasClick(x, y);
}
```

### 16.3 記憶體管理

- Web Audio API 的 OscillatorNode 在使用後需停止（`.stop()`）
- Canvas 動畫使用物件池（Object Pool）避免頻繁 GC
- LocalStorage 存檔限制於 500KB 以內

---

## 17. 開發流程與注意事項

### 17.1 開發順序建議

```
Phase 1（基礎）：
  └── HTML 架構 → CSS 變數系統 → 主選單畫面 → 路由切換

Phase 2（遊戲核心）：
  └── 棋盤資料模型 → 規則引擎 → Canvas 棋盤繪製
      → 骰子邏輯 → 棋子繪製 → 基礎互動

Phase 3（AI）：
  └── 簡單 AI → 普通 AI → 困難 AI → AI 動畫

Phase 4（UI 完善）：
  └── 說明頁面 → 設定頁面 → 主題系統 → 多語系

Phase 5（音效）：
  └── 音效引擎 → BGM 生成 → 各事件音效綁定

Phase 6（RWD）：
  └── 手機直向 → 手機橫向 → 平板 → 桌機微調

Phase 7（QA）：
  └── 規則完整性測試 → 各裝置測試 → 效能調校
```

### 17.2 常見陷阱與注意事項

#### 遊戲規則陷阱

```
⚠️ 1. 對子（Double）時必須盡量使用所有 4 次移動
⚠️ 2. BAR 有棋子時，必須先移動 BAR 上的棋子，不能移動其他棋子
⚠️ 3. 熊入時，若對應骰子點數無棋子，可移動最靠近的點位棋子
⚠️ 4. 若骰子只能使用一個，必須使用較大的點數
⚠️ 5. 開局若雙方點數相同，必須重新擲骰
```

#### CSS 注意事項

```
⚠️ 使用 100dvh 而非 100vh（動態視口高度，避免手機網址列問題）
⚠️ 行動裝置按鈕最小觸控面積：44×44px（Apple HIG 規範）
⚠️ 確保任何文字顏色對比比率至少 4.5:1（WCAG AA）
⚠️ 避免使用 position: fixed 元素遮擋棋盤
```

#### JavaScript 注意事項

```
⚠️ Web Audio API 需要使用者互動才能啟動（不能自動播放）
⚠️ localStorage 可能在隱私模式下不可用，需 try-catch 保護
⚠️ Canvas 在 Retina 螢幕需乘以 devicePixelRatio 防止模糊
⚠️ AI 計算若超過 50ms 需使用 Web Worker 或分批處理
```

#### Canvas Retina 處理

```javascript
// canvas-board.js
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

### 17.3 測試清單

#### 遊戲邏輯測試

- [ ] 初始棋子位置正確
- [ ] 骰子點數移動正確
- [ ] 對子（Double）4次移動
- [ ] BAR 棋子優先處理
- [ ] 打出對方棋子（Blot）
- [ ] 無法打出點（Anchor）
- [ ] 熊入條件判斷
- [ ] 熊入超出骰子點數處理
- [ ] 無合法移動時跳過
- [ ] 勝負判斷（普通/Gammon/Backgammon）

#### RWD 測試裝置

- [ ] iPhone SE（375px）直向
- [ ] iPhone 14 Pro（393px）直向
- [ ] iPhone 14 Pro Max（430px）直向
- [ ] iPad（768px）直向
- [ ] iPad Pro（1024px）橫向
- [ ] MacBook Air（1280px）
- [ ] 桌機 1920px

#### 瀏覽器測試

- [ ] Chrome（桌機）
- [ ] Firefox（桌機）
- [ ] Safari（Mac）
- [ ] Safari（iOS）
- [ ] Chrome（Android）

---

## 附錄：快速參考

### 點位編號對照表

```
AI 側（上方）：
  13  14  15  16  17  18  |BAR|  19  20  21  22  23  24

玩家側（下方）：
  12  11  10   9   8   7  |BAR|   6   5   4   3   2   1

棋子起始位置：
  玩家（白棋 ●）：1×2、6×5、8×3、12×5（= 15顆）
  AI  （黑棋 ○）：24×2、19×5、17×3、13×5（= 15顆）
```

### AI 評估函數權重表

| 評分項目 | 簡單 | 普通 | 困難 |
|----------|------|------|------|
| 打出對方棋子 | 忽略 | +15 | +15 |
| 建立安全點 | 忽略 | +8 | +10 |
| 棋子前進距離 | 隨機 | +3 | +4 |
| 熊入棋子 | 隨機 | +20 | +25 |
| 獨子暴露 | 忽略 | -10 | -12 |
| BAR 懲罰 | 忽略 | -12 | -20 |

### localStorage Key 清單

| Key | 用途 |
|-----|------|
| `backgammon_settings` | 用戶設定（語系、主題、音量等）|
| `backgammon_save` | 遊戲存檔（棋盤狀態、骰子等）|

---

*規格書版本 v1.0.0 ｜ 最後更新：2026年6月*
