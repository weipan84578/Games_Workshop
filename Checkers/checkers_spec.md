# 🎯 跳棋遊戲 前端完整規格書

> **版本**：v1.0.0　|　**更新日期**：2026-05-04　|　**模式**：單人 vs AI

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [畫面結構與路由](#3-畫面結構與路由)
4. [UI / UX 設計規範](#4-ui--ux-設計規範)
5. [主畫面規格](#5-主畫面規格)
6. [設定畫面規格](#6-設定畫面規格)
7. [遊戲畫面規格](#7-遊戲畫面規格)
8. [遊戲結束畫面規格](#8-遊戲結束畫面規格)
9. [跳棋遊戲邏輯規格](#9-跳棋遊戲邏輯規格)
10. [AI 演算法規格](#10-ai-演算法規格)
11. [音樂與音效系統](#11-音樂與音效系統)
12. [行動裝置適配規格](#12-行動裝置適配規格)
13. [動畫與過場效果](#13-動畫與過場效果)
14. [資料儲存規格](#14-資料儲存規格)
15. [無障礙規格](#15-無障礙規格)
16. [效能規格](#16-效能規格)
17. [檔案結構](#17-檔案結構)

---

## 1. 專案概覽

### 1.1 專案描述

一款純前端、無需後端伺服器的跳棋（Checkers / 國際跳棋）遊戲。玩家以人機對戰模式與 AI 對弈，支援桌機與行動裝置，包含背景音樂與互動音效。

### 1.2 核心目標

| 目標 | 說明 |
|------|------|
| **零依賴部署** | 純 HTML + CSS + JavaScript，可直接開啟 `index.html` 執行 |
| **行動裝置優先** | 觸控操作流暢，字體與按鈕在手機上清晰可點擊 |
| **完整音訊體驗** | 背景音樂 + 棋子移動、吃子、勝負等音效 |
| **智能 AI 對手** | 使用 Minimax + Alpha-Beta 剪枝演算法，提供多難度選擇 |
| **無需安裝** | 不依賴任何外部框架或函式庫，完全離線可用 |

### 1.3 支援平台

- **桌機瀏覽器**：Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- **行動裝置**：iOS Safari 14+、Android Chrome 90+
- **螢幕尺寸**：320px ～ 2560px 全響應式

---

## 2. 技術架構

### 2.1 技術棧

```
純前端架構（Vanilla Stack）
├── HTML5          — 語意化結構
├── CSS3           — 自訂屬性、Grid、Flexbox、動畫
├── JavaScript ES6+ — 模組化邏輯（無框架）
└── Web Audio API  — 即時合成音效與背景音樂
```

### 2.2 模組分層

```
┌─────────────────────────────────────┐
│           UI Layer (View)           │
│  index.html + styles.css            │
├─────────────────────────────────────┤
│         Controller Layer            │
│  app.js — 畫面切換、事件協調         │
├──────────────────┬──────────────────┤
│   Game Logic     │   Audio Engine   │
│   game.js        │   audio.js       │
├──────────────────┼──────────────────┤
│   AI Engine      │   Storage        │
│   ai.js          │   storage.js     │
└──────────────────┴──────────────────┘
```

### 2.3 狀態管理

全域狀態以純物件管理，存放於 `window.GameState`：

```javascript
GameState = {
  screen: 'menu' | 'settings' | 'game' | 'gameover',
  board: Array[8][8],          // 棋盤二維陣列
  currentTurn: 'player' | 'ai',
  selectedPiece: { row, col } | null,
  validMoves: Array<Move>,
  capturedByPlayer: Number,
  capturedByAI: Number,
  gameOver: Boolean,
  winner: 'player' | 'ai' | 'draw' | null,
  settings: {
    difficulty: 'easy' | 'medium' | 'hard',
    playerColor: 'red' | 'black',
    musicVolume: 0~1,
    sfxVolume: 0~1,
    musicEnabled: Boolean,
    sfxEnabled: Boolean,
    theme: 'classic' | 'wood' | 'neon'
  }
}
```

---

## 3. 畫面結構與路由

### 3.1 畫面流程圖

```
              ┌───────────────┐
              │   主畫面       │  ← 啟動預設畫面
              │   (Menu)      │
              └──────┬────────┘
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌──────────┐ ┌────────┐ ┌────────────┐
    │ 開始遊戲  │ │  設定   │ │ 歷史戰績   │
    └────┬─────┘ └────────┘ └────────────┘
         │（若設定未完成，先跳設定）
         ▼
    ┌──────────┐
    │ 遊戲畫面  │
    │  (Game)  │
    └────┬─────┘
         │（遊戲結束）
         ▼
    ┌──────────────┐
    │ 遊戲結束畫面  │
    │ (Game Over)  │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    ▼             ▼
  再玩一次      回主畫面
```

### 3.2 畫面切換方式

所有畫面切換使用 CSS `opacity` + `transform` 淡入淡出過場（300ms ease），不使用頁面跳轉，為單頁應用（SPA）架構。每個畫面為 `<section id="screen-*">` 元素，透過 `.active` class 控制顯示。

---

## 4. UI / UX 設計規範

### 4.1 色彩系統（CSS 自訂屬性）

```css
:root {
  /* 主題色 — Classic（預設） */
  --color-bg-primary:     #1a0e00;   /* 深棕黑背景 */
  --color-bg-secondary:   #2d1b00;   /* 卡片背景 */
  --color-bg-board-dark:  #8B4513;   /* 棋盤深格 */
  --color-bg-board-light: #F4DEB3;   /* 棋盤淺格 */
  --color-accent:         #D4A017;   /* 金色強調 */
  --color-accent-hover:   #F0C040;   /* 金色懸停 */
  --color-piece-player:   #CC2200;   /* 玩家棋子（紅） */
  --color-piece-ai:       #1A1A1A;   /* AI 棋子（黑） */
  --color-piece-king:     #FFD700;   /* 王冠色 */
  --color-text-primary:   #F5E6C8;   /* 主要文字 */
  --color-text-secondary: #A89070;   /* 次要文字 */
  --color-highlight:      rgba(255, 215, 0, 0.6); /* 選中高亮 */
  --color-valid-move:     rgba(100, 220, 100, 0.5); /* 可移動位置 */
  --color-danger:         rgba(255, 60, 60, 0.8);  /* 警示色 */

  /* 主題色 — Wood */
  /* 主題色 — Neon（可透過設定切換） */
}
```

### 4.2 字體規範

```css
/* 引入字體（Google Fonts CDN 或本地備援） */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Noto+Sans+TC:wght@400;700&display=swap');

:root {
  --font-display: 'Cinzel', serif;         /* 標題、遊戲名稱 */
  --font-body:    'Noto Sans TC', sans-serif; /* 正文、按鈕 */

  /* 字體大小 — 桌機（base: 18px） */
  --text-game-title: clamp(2.8rem, 6vw, 5rem);  /* 主標題 */
  --text-h1:         clamp(1.8rem, 3vw, 2.6rem);
  --text-h2:         clamp(1.4rem, 2.5vw, 2rem);
  --text-btn-lg:     clamp(1.2rem, 2vw, 1.6rem);  /* 大按鈕 */
  --text-btn-md:     clamp(1rem, 1.8vw, 1.3rem);  /* 中按鈕 */
  --text-body:       clamp(0.95rem, 1.5vw, 1.1rem);
  --text-score:      clamp(1.5rem, 2.5vw, 2rem);  /* 分數顯示 */
  --text-label:      clamp(0.85rem, 1.2vw, 1rem);
}
```

> **原則**：所有字體大小使用 `clamp()` 實現自適應縮放，確保行動裝置上不低於可讀下限，桌機上不過大。

### 4.3 間距與佈局

```css
:root {
  --space-xs:  0.4rem;
  --space-sm:  0.8rem;
  --space-md:  1.2rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-xxl: 5rem;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  --shadow-card: 0 8px 32px rgba(0,0,0,0.6);
  --shadow-btn:  0 4px 16px rgba(212,160,23,0.4);
  --transition:  all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.4 按鈕規格

所有可點擊按鈕需滿足：

| 屬性 | 桌機 | 行動裝置 |
|------|------|----------|
| 最小高度 | 52px | 60px |
| 最小寬度 | 180px | 100% 或 200px |
| 字體大小 | `var(--text-btn-md)` | `var(--text-btn-lg)` |
| 觸控目標 | ≥ 44px | ≥ 56px |
| 點擊回饋 | scale(0.97) | scale(0.95) + 觸覺震動 |

---

## 5. 主畫面規格

### 5.1 佈局結構

```
┌────────────────────────────────────────┐
│  [🔊 音效開關]              [⚙️ 設定]   │  ← 頂部工具列
├────────────────────────────────────────┤
│                                        │
│         ✦ 跳  棋 ✦                    │  ← 遊戲標題（Cinzel字體）
│       CHECKERS MASTER                  │  ← 英文副標（小）
│                                        │
│     [棋盤動態裝飾圖 / 棋子動畫]          │  ← 視覺焦點（CSS動畫棋盤）
│                                        │
│        ┌─────────────────┐             │
│        │   ▶  開始遊戲    │             │  ← 主CTA按鈕（金色）
│        └─────────────────┘             │
│        ┌─────────────────┐             │
│        │   ⚙  遊戲設定    │             │
│        └─────────────────┘             │
│        ┌─────────────────┐             │
│        │   📊 歷史戰績    │             │
│        └─────────────────┘             │
│                                        │
│    玩家勝場：12  ｜ AI勝場：8           │  ← 累積統計
│                                        │
└────────────────────────────────────────┘
```

### 5.2 標題動畫

- 進場：文字由下方 `translateY(30px)` + `opacity:0` 淡入，持續 800ms，`easing: ease-out`
- 標題字「跳棋」帶有金色光澤流動動畫（CSS `background-clip: text` + keyframe）
- 裝飾棋盤縮圖以 CSS Grid 繪製，棋子有輕微浮動動畫（`float` keyframe，±4px，3s 循環）

### 5.3 按鈕互動

- **開始遊戲**：金色背景，點擊時播放「翻棋」音效，若未設定難度則自動跳至設定畫面
- **遊戲設定**：次要樣式（外框按鈕），切換至設定畫面
- **歷史戰績**：彈出 Modal 顯示 localStorage 中的勝負統計

---

## 6. 設定畫面規格

### 6.1 佈局結構

```
┌────────────────────────────────────────┐
│  ←  返回主畫面                          │
├────────────────────────────────────────┤
│              遊戲設定                   │
├────────────────────────────────────────┤
│  難度選擇                               │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │  簡單  │  │  普通  │  │  困難  │        │  ← 三選一 pill 按鈕
│  └──────┘  └──────┘  └──────┘          │
│                                        │
│  棋子顏色                               │
│  ┌────────┐         ┌────────┐         │
│  │ 🔴 紅色  │         │ ⚫ 黑色 │         │  ← 二選一
│  └────────┘         └────────┘         │
│                                        │
│  棋盤主題                               │
│  ┌──────────┐  ┌────────┐  ┌──────┐   │
│  │ 🟫 經典木紋 │  │ 🌲 深林  │  │ 💡 霓虹 │  │
│  └──────────┘  └────────┘  └──────┘   │
│                                        │
│  🎵 背景音樂                            │
│  [開/關 Toggle]  ────────●──── 音量    │
│                                        │
│  🔔 音效                               │
│  [開/關 Toggle]  ──────●────── 音量    │
│                                        │
│      ┌──────────────────────┐          │
│      │      確認並開始遊戲    │          │
│      └──────────────────────┘          │
└────────────────────────────────────────┘
```

### 6.2 難度說明

| 難度 | AI 深度 | 時間限制 | 說明 |
|------|---------|---------|------|
| 簡單 | Minimax 深度 2 | 300ms | 隨機加入 15% 錯誤決策 |
| 普通 | Minimax 深度 4 | 800ms | 標準 Alpha-Beta 剪枝 |
| 困難 | Minimax 深度 6 | 1500ms | 完整評估函數 + 開局庫 |

### 6.3 音量控制器

- 使用原生 `<input type="range">` 並以 CSS 完整自訂樣式
- 拖動時即時預覽音量（播放測試音效）
- 儲存至 `localStorage`，下次開啟自動套用

---

## 7. 遊戲畫面規格

### 7.1 桌機佈局（≥ 768px）

```
┌──────────────────────────────────────────────────────┐
│  ←返回   跳棋                   ⏸暫停   🔊          │  ← 頂部 Header
├──────────────┬───────────────────────┬───────────────┤
│              │                       │               │
│   AI 資訊    │      棋  盤           │  玩家 資訊    │
│  ──────────  │    (8×8 Grid)         │  ──────────   │
│  🤖 電腦    │                       │  👤 玩家     │
│  ⚫ 棋子     │   ┌──┬──┬──┬──┐      │  🔴 棋子     │
│  吃子數: 3   │   ├──┼──┼──┼──┤      │  吃子數: 2   │
│             │   └──┴──┴──┴──┘      │               │
│  [思考中...]│                       │  [你的回合]   │
│             │                       │               │
└──────────────┴───────────────────────┴───────────────┘
│              操作提示 / 狀態訊息                       │
└──────────────────────────────────────────────────────┘
```

### 7.2 行動裝置佈局（< 768px）

```
┌──────────────────────────┐
│ ←  跳棋           🔊 ⏸  │  ← 精簡 Header
├────────────┬─────────────┤
│ 🤖 電腦    │  👤 玩家    │  ← 資訊列（橫排）
│ ⚫ x 3    │  🔴 x 2    │
├────────────┴─────────────┤
│                          │
│      棋  盤              │
│   (佔最大寬度，正方形)    │
│                          │
├──────────────────────────┤
│    [你的回合！選擇棋子]    │  ← 操作提示
└──────────────────────────┘
```

### 7.3 棋盤規格

#### 尺寸

- **桌機**：`min(60vh, 560px)` 正方形，置中
- **行動裝置**：`min(96vw, 96vh - 200px)` 正方形，佔滿可用空間
- 每格尺寸 = 棋盤寬度 ÷ 8，自動計算

#### 棋盤座標

- 行（Row）：0 = 頂部（AI方），7 = 底部（玩家方）
- 列（Col）：0 = 左，7 = 右
- 可用格子（深色格）：`(row + col) % 2 === 1`

#### 棋格 HTML 結構

```html
<div class="board">
  <div class="cell dark" data-row="0" data-col="1">
    <div class="piece ai-piece" data-piece-id="ai-1"></div>
  </div>
  <div class="cell light" data-row="0" data-col="0"></div>
  <!-- ... 64 格 -->
</div>
```

#### 棋格狀態 CSS Classes

| Class | 說明 |
|-------|------|
| `.cell.dark` | 深色可用格 |
| `.cell.light` | 淺色不可用格 |
| `.cell.selected` | 已選中（金框） |
| `.cell.valid-move` | 可移動目標（綠點） |
| `.cell.capture-move` | 可吃子目標（紅框閃爍） |
| `.cell.last-move` | 上一步移動記錄（淡藍框） |

#### 棋子 CSS Classes

| Class | 說明 |
|-------|------|
| `.piece.player-piece` | 玩家棋子 |
| `.piece.ai-piece` | AI 棋子 |
| `.piece.king` | 王棋（加冠標記）|
| `.piece.selected` | 被選中（放大 + 光圈） |
| `.piece.captured` | 被吃（縮小消失動畫） |
| `.piece.moving` | 移動中（滑動動畫） |

### 7.4 棋子外觀規格

```css
.piece {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  margin: auto;
  position: relative;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  /* 立體效果 */
  box-shadow:
    inset -3px -3px 6px rgba(0,0,0,0.4),
    inset 2px 2px 4px rgba(255,255,255,0.2),
    0 4px 8px rgba(0,0,0,0.5);
}

.piece.player-piece {
  background: radial-gradient(circle at 35% 35%, #ff6b4a, #cc2200);
}

.piece.ai-piece {
  background: radial-gradient(circle at 35% 35%, #555, #111);
}

.piece.king::after {
  content: '♛';
  position: absolute;
  font-size: 55%;
  color: #FFD700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}
```

### 7.5 暫停選單

按下 ⏸ 或手機返回鍵後彈出 Modal：

```
┌─────────────────────┐
│       遊戲暫停       │
│                     │
│  [ ▶  繼續遊戲 ]    │
│  [ ↺  重新開始 ]    │
│  [ ⚙  設定     ]    │
│  [ ✕  離開遊戲 ]    │
└─────────────────────┘
```

---

## 8. 遊戲結束畫面規格

### 8.1 佈局

```
┌────────────────────────────────┐
│   🎉  你獲勝了！ / 🤖 電腦獲勝   │  ← 大標題 + 動畫
│   (或 🤝 平局)                 │
│                                │
│   ──── 本局統計 ────            │
│   回合數：   24                 │
│   吃子數：   6                  │
│   遊戲時間：03:42               │
│   剩餘棋子：  5                 │
│                                │
│  ┌──────────────────────┐      │
│  │     ↺  再玩一次       │      │
│  └──────────────────────┘      │
│  ┌──────────────────────┐      │
│  │     🏠  回主畫面      │      │
│  └──────────────────────┘      │
└────────────────────────────────┘
```

### 8.2 勝利動畫

- **玩家獲勝**：金色粒子從上方飄落（CSS `@keyframes` 粒子動畫，30 個元素），標題有閃爍光暈
- **AI 獲勝**：紅色警示光暈閃爍，標題顯示悲傷圖示，動畫較柔和
- **平局**：中性紫色漸層背景，握手圖示旋轉進場

---

## 9. 跳棋遊戲邏輯規格

### 9.1 棋盤初始化

```
行 0（AI方）:  _ B _ B _ B _ B
行 1（AI方）:  B _ B _ B _ B _
行 2（AI方）:  _ B _ B _ B _ B
行 3（空）  :  _ _ _ _ _ _ _ _
行 4（空）  :  _ _ _ _ _ _ _ _
行 5（玩家）:  R _ R _ R _ R _
行 6（玩家）:  _ R _ R _ R _ R
行 7（玩家）:  R _ R _ R _ R _

B = AI黑棋（預設），R = 玩家紅棋
```

### 9.2 棋子資料結構

```javascript
// 棋格值定義
const EMPTY   = 0;
const PLAYER  = 1;   // 玩家普通棋
const AI      = 2;   // AI 普通棋
const PLAYER_KING = 3;  // 玩家王棋
const AI_KING     = 4;  // AI 王棋

// 棋盤為 8×8 二維陣列
// board[row][col] = 上述常數之一
```

### 9.3 移動規則

#### 普通棋移動

| 條件 | 規則 |
|------|------|
| 玩家方向 | 只能向上（row 減小）移動 |
| AI 方向 | 只能向下（row 增大）移動 |
| 普通移動 | 斜向移動 1 格至空格 |
| 跳躍吃子 | 跳過對方棋子，落在其後方空格 |
| 連續跳躍 | 吃子後若仍可跳躍，必須繼續（強制連跳） |

#### 王棋規則

| 條件 | 規則 |
|------|------|
| 升王條件 | 玩家棋子到達第 0 行，AI 棋子到達第 7 行 |
| 王棋移動 | 可向四個斜角方向自由移動 |
| 王棋吃子 | 可向四個斜角方向跳躍吃子 |
| 升王後 | 升王當回合結束，不可繼續連跳 |

#### 強制吃子規則

若有可吃子的移動存在，玩家**必須**選擇吃子移動，不可進行普通移動。

### 9.4 勝負判定

| 條件 | 結果 |
|------|------|
| 對手棋子全部被吃 | 己方獲勝 |
| 對手無法進行任何合法移動 | 己方獲勝 |
| 40 回合無吃子動作 | 平局 |

### 9.5 合法移動計算函數介面

```javascript
/**
 * 取得指定棋子的所有合法移動
 * @param {number[][]} board - 當前棋盤
 * @param {number} row - 棋子行
 * @param {number} col - 棋子列
 * @returns {Move[]} - 合法移動陣列
 */
function getValidMoves(board, row, col) { ... }

/**
 * @typedef {Object} Move
 * @property {number} fromRow
 * @property {number} fromCol
 * @property {number} toRow
 * @property {number} toCol
 * @property {Array<{row, col}>} captured - 被吃棋子座標陣列（連跳可多個）
 */
```

---

## 10. AI 演算法規格

### 10.1 演算法：Minimax + Alpha-Beta 剪枝

```javascript
/**
 * Minimax 演算法核心
 * @param {number[][]} board  - 棋盤狀態
 * @param {number}     depth  - 搜尋深度
 * @param {number}     alpha  - Alpha 值
 * @param {number}     beta   - Beta 值
 * @param {boolean}    isMaximizing - 是否為最大化層（AI 回合）
 * @returns {number} 評估分數
 */
function minimax(board, depth, alpha, beta, isMaximizing) { ... }

/**
 * 取得 AI 最佳移動
 * @param {number[][]} board
 * @param {number}     difficulty  - 搜尋深度（2/4/6）
 * @returns {Move}
 */
function getBestMove(board, difficulty) { ... }
```

### 10.2 棋盤評估函數

```javascript
function evaluateBoard(board) {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];

      if (piece === AI)         score += 5;    // AI 普通棋
      if (piece === AI_KING)    score += 10;   // AI 王棋（價值較高）
      if (piece === PLAYER)     score -= 5;    // 玩家普通棋
      if (piece === PLAYER_KING) score -= 10;  // 玩家王棋

      // 位置加成：AI 棋子越靠近玩家底線越好
      if (piece === AI)         score += (7 - row) * 0.3;
      // 中央控制加成
      if ((piece === AI || piece === AI_KING) &&
          col >= 2 && col <= 5) score += 0.5;
      // 後排防守加成（保護 AI 棋子）
      if (piece === AI && row === 0) score += 1;
    }
  }

  return score;
}
```

### 10.3 簡單難度隨機化

```javascript
// 簡單難度：15% 機率選擇非最佳移動
function getEasyMove(board) {
  if (Math.random() < 0.15) {
    const allMoves = getAllMoves(board, AI);
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }
  return getBestMove(board, 2);
}
```

### 10.4 AI 思考時間模擬

為提升真實感，AI 移動前加入延遲：

| 難度 | 思考動畫顯示時間 |
|------|----------------|
| 簡單 | 500 ～ 800ms（隨機） |
| 普通 | 800 ～ 1200ms（隨機）|
| 困難 | 1200 ～ 2000ms（隨機）|

思考期間顯示「🤔 電腦思考中...」動態文字（三個點輪流閃爍）。

---

## 11. 音樂與音效系統

### 11.1 技術方案

使用 **Web Audio API** 以程式碼即時合成所有音效，完全不依賴外部音訊檔案，確保離線可用。

```javascript
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicGain = this.ctx.createGain();
    this.sfxGain   = this.ctx.createGain();
    this.musicGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);
  }
}
```

### 11.2 背景音樂

使用 Web Audio API 合成環境音樂（簡易程序音樂）：

| 屬性 | 規格 |
|------|------|
| 風格 | 低沉、沉穩的木質感節拍（模擬古箏 + 低頻鼓） |
| 產生方式 | OscillatorNode（方波/三角波）+ BiquadFilterNode 塑形 |
| 迴圈 | 16 小節自動循環 |
| 淡入 | 畫面切換時 1s 淡入 |
| 淡出 | 遊戲結束時 2s 淡出，再切換至勝利/失敗音樂 |

**音樂主題曲調（簡易音階程序生成）**：
- 主調：A 小調（A, C, D, E, G）
- 節奏：4/4 拍，BPM 72（舒緩）
- 使用 `AudioContext.currentTime` 精確排程音符

### 11.3 音效列表

| 音效名稱 | 觸發時機 | 合成方式 |
|---------|---------|---------|
| `sfx_move` | 棋子普通移動 | 短促木頭碰撞聲（白噪音 + 低通濾波，30ms） |
| `sfx_capture` | 棋子吃子 | 清脆撞擊聲（正弦波 440Hz→220Hz，下滑，80ms） |
| `sfx_king` | 棋子升王 | 上揚音效（正弦波 440→660→880Hz，階梯式，300ms） |
| `sfx_select` | 選擇棋子 | 輕柔點選聲（正弦波 880Hz，衰減，40ms） |
| `sfx_invalid` | 無效操作 | 短暫低頻嗡嗡聲（方波 120Hz，50ms） |
| `sfx_win` | 玩家獲勝 | 勝利旋律（上揚五聲音階，600ms） |
| `sfx_lose` | AI 獲勝 | 悲傷下滑音效（下滑半音，400ms） |
| `sfx_draw` | 平局 | 中性短旋律 |
| `sfx_button` | 按鈕點擊 | 極短促清脆點擊（正弦波 660Hz，20ms） |
| `sfx_ai_think` | AI 思考 | 極輕微週期性低頻脈衝（每 400ms，選配） |

### 11.4 音效合成範例

```javascript
// sfx_move：棋子移動聲
function playSfxMove() {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  source.connect(filter);
  filter.connect(sfxGain);
  source.start();
}
```

### 11.5 行動裝置 AudioContext 解鎖

iOS/Android 要求使用者互動才能啟動 AudioContext：

```javascript
// 在第一個使用者手勢（touchstart 或 click）時解鎖
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

function unlockAudio() {
  if (audioEngine.ctx.state === 'suspended') {
    audioEngine.ctx.resume();
  }
}
```

---

## 12. 行動裝置適配規格

### 12.1 響應式斷點

```css
/* 手機（直向） */
@media (max-width: 480px) { ... }

/* 手機（橫向）/ 小平板 */
@media (max-width: 768px) { ... }

/* 平板 */
@media (max-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1025px) { ... }
```

### 12.2 觸控互動規格

| 規格項目 | 說明 |
|---------|------|
| 觸控目標 | 所有可點元素最小 44×44px（建議 56px） |
| 棋格大小 | 自動計算確保手指可準確點擊（最小 44px/格） |
| 防誤觸 | 棋子選中後需明確點擊目標格才移動，不支援拖曳 |
| 觸覺反饋 | `navigator.vibrate(30)` 於棋子移動、吃子時震動 |
| 雙指縮放 | 禁用（`touch-action: none` on board） |
| 滾動衝突 | 棋盤區域防止頁面捲動 |

```css
/* 防止觸控滾動影響棋盤 */
.board {
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
```

### 12.3 視口設定

```html
<meta name="viewport"
  content="width=device-width, initial-scale=1.0,
           maximum-scale=1.0, user-scalable=no">
```

### 12.4 安全區域適配（iPhone 瀏海 / 底部手勢區）

```css
body {
  padding-top:    env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left:   env(safe-area-inset-left);
  padding-right:  env(safe-area-inset-right);
}
```

### 12.5 PWA 支援（選配）

```html
<!-- manifest.json -->
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#1a0e00">

<!-- iOS 安裝設定 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

---

## 13. 動畫與過場效果

### 13.1 棋子移動動畫

```css
/* 棋子滑動移動（JS 動態設定目標位置） */
.piece.moving {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 棋子選中光環 */
.piece.selected {
  transform: scale(1.15);
  box-shadow:
    0 0 0 3px #FFD700,
    0 0 15px rgba(255, 215, 0, 0.8);
  animation: selected-pulse 1s ease-in-out infinite;
}

@keyframes selected-pulse {
  0%, 100% { box-shadow: 0 0 0 3px #FFD700, 0 0 15px rgba(255,215,0,0.8); }
  50%       { box-shadow: 0 0 0 5px #FFD700, 0 0 25px rgba(255,215,0,0.5); }
}
```

### 13.2 吃子消失動畫

```css
@keyframes piece-captured {
  0%   { transform: scale(1);   opacity: 1; }
  30%  { transform: scale(1.3); opacity: 0.8; }
  100% { transform: scale(0);   opacity: 0; }
}

.piece.captured {
  animation: piece-captured 0.4s ease-in forwards;
  pointer-events: none;
}
```

### 13.3 升王特效

```css
@keyframes king-crown {
  0%   { transform: scale(1) rotate(0deg);   filter: brightness(1); }
  50%  { transform: scale(1.4) rotate(15deg); filter: brightness(2) drop-shadow(0 0 8px gold); }
  100% { transform: scale(1) rotate(0deg);   filter: brightness(1); }
}

.piece.promoting {
  animation: king-crown 0.6s ease-in-out;
}
```

### 13.4 可移動位置指示

```css
/* 綠色圓點指示可落點 */
.cell.valid-move::after {
  content: '';
  position: absolute;
  width: 35%;
  height: 35%;
  border-radius: 50%;
  background: rgba(100, 220, 100, 0.7);
  box-shadow: 0 0 8px rgba(100, 220, 100, 0.9);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: valid-pulse 1.2s ease-in-out infinite;
}

@keyframes valid-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
  50%       { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}
```

---

## 14. 資料儲存規格

### 14.1 localStorage 結構

```javascript
// Key: 'checkers_settings'
{
  "difficulty": "medium",
  "playerColor": "red",
  "theme": "classic",
  "musicVolume": 0.6,
  "sfxVolume": 0.8,
  "musicEnabled": true,
  "sfxEnabled": true
}

// Key: 'checkers_stats'
{
  "playerWins": 12,
  "aiWins": 8,
  "draws": 2,
  "totalGames": 22,
  "longestWinStreak": 4,
  "currentStreak": 2,
  "lastPlayed": "2026-05-04T10:30:00Z"
}
```

### 14.2 儲存時機

| 事件 | 儲存動作 |
|------|---------|
| 修改設定 | 立即儲存 `checkers_settings` |
| 遊戲結束 | 更新 `checkers_stats` |
| 頁面載入 | 讀取並套用設定 |

---

## 15. 無障礙規格

### 15.1 鍵盤操作支援

| 按鍵 | 功能 |
|------|------|
| `Tab` | 在棋格間移動焦點 |
| `Enter` / `Space` | 選擇棋子 / 確認移動 |
| `Escape` | 取消選擇 / 開啟暫停選單 |
| `Arrow Keys` | 在棋格間移動（四方向） |

### 15.2 ARIA 標記

```html
<div class="board" role="grid" aria-label="跳棋棋盤">
  <div class="cell dark" role="gridcell"
       aria-label="第1行第2列，AI黑棋"
       aria-selected="false" tabindex="0">
  </div>
</div>

<!-- 狀態播報 -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  你的回合。已選擇第6行第3列的紅棋。
</div>
```

### 15.3 色彩對比

所有文字與背景之對比度符合 WCAG 2.1 AA 標準（≥ 4.5:1）。

---

## 16. 效能規格

| 指標 | 目標值 |
|------|--------|
| 首次載入時間（FCP） | < 1.5s（3G） |
| 棋子移動動畫 | 60fps（CSS transform only） |
| AI 計算（普通難度） | < 1s（主執行緒） |
| AI 計算（困難難度） | 使用 Web Worker 避免 UI 卡頓 |
| 記憶體使用 | < 50MB |
| 檔案總大小 | < 200KB（無外部資源時） |

### 16.1 Web Worker（困難難度）

```javascript
// ai.worker.js — 在背景執行 Minimax 計算
self.onmessage = function(e) {
  const { board, depth } = e.data;
  const bestMove = getBestMove(board, depth);
  self.postMessage(bestMove);
};

// 主執行緒
const worker = new Worker('ai.worker.js');
worker.postMessage({ board, depth: 6 });
worker.onmessage = (e) => applyAIMove(e.data);
```

---

## 17. 檔案結構

```
checkers/
├── index.html          # 主頁面，所有畫面的 HTML 結構
├── styles.css          # 全域樣式、主題、動畫
├── app.js              # 主控制器，畫面切換、事件綁定
├── game.js             # 遊戲邏輯（棋盤、規則、移動計算）
├── ai.js               # AI 演算法（Minimax、評估函數）
├── ai.worker.js        # Web Worker，困難難度 AI 計算
├── audio.js            # Web Audio API 音效引擎
├── storage.js          # localStorage 讀寫封裝
├── manifest.json       # PWA Manifest（選配）
└── README.md           # 部署說明
```

### 17.1 各檔案職責

| 檔案 | 主要職責 |
|------|---------|
| `index.html` | 定義 `#screen-menu`、`#screen-settings`、`#screen-game`、`#screen-gameover` 四個畫面結構 |
| `styles.css` | CSS 變數系統、棋盤樣式、動畫、響應式規則 |
| `app.js` | 初始化、畫面切換、事件委派、遊戲流程協調 |
| `game.js` | `GameEngine` 類別：棋盤狀態、合法移動計算、吃子、升王、勝負判定 |
| `ai.js` | `AIEngine` 類別：Minimax、Alpha-Beta、評估函數 |
| `audio.js` | `AudioEngine` 類別：WebAudio 初始化、背景音樂生成、所有音效合成函數 |
| `storage.js` | `Storage` 類別：設定讀寫、戰績更新 |

---

*本規格書涵蓋跳棋純前端遊戲的完整實作細節。開發時請依序實作：遊戲邏輯 → AI 演算法 → UI 渲染 → 音效系統 → 行動裝置適配。*
