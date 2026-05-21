# 黑白棋（Othello / Reversi）純前端完整規格書

> **版本**：v1.0.0  
> **目標平台**：桌面瀏覽器 ＆ 行動裝置（iOS Safari / Android Chrome）  
> **技術限制**：純 HTML + CSS + JavaScript，無需 Build、無需 Server，點擊 `index.html` 即可執行

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [檔案結構](#3-檔案結構)
4. [畫面規格](#4-畫面規格)
5. [遊戲規則與邏輯](#5-遊戲規則與邏輯)
6. [AI 演算法規格](#6-ai-演算法規格)
7. [音效與音樂規格](#7-音效與音樂規格)
8. [響應式設計規格](#8-響應式設計規格)
9. [字體與視覺設計規格](#9-字體與視覺設計規格)
10. [動畫與互動規格](#10-動畫與互動規格)
11. [設定系統規格](#11-設定系統規格)
12. [資料持久化](#12-資料持久化)
13. [各畫面詳細規格](#13-各畫面詳細規格)
14. [錯誤處理與邊界條件](#14-錯誤處理與邊界條件)
15. [效能規格](#15-效能規格)
16. [開發注意事項](#16-開發注意事項)

---

## 1. 專案概述

### 1.1 基本資訊

| 項目 | 說明 |
|------|------|
| 遊戲名稱 | 黑白棋（Othello / Reversi） |
| 遊戲模式 | 單人 vs AI |
| 語言 | 繁體中文（主介面），可擴充多語言 |
| 最低瀏覽器 | Chrome 90+、Firefox 88+、Safari 14+、Edge 90+ |

### 1.2 核心目標

- ✅ 無伺服器，單一 `index.html` 可執行
- ✅ 行動裝置全觸控支援
- ✅ 主畫面與設定字體放大，老少皆宜
- ✅ 附帶背景音樂 + 音效（Web Audio API 合成，無需外部音樂檔）
- ✅ AI 三難度：新手 / 一般 / 困難

---

## 2. 技術架構

### 2.1 技術選型

```
index.html
├── 內嵌 <style>        ← 所有 CSS（含響應式）
├── 內嵌 <script>       ← 所有 JS 邏輯
│   ├── GameEngine      ← 棋盤邏輯、合法走法、翻棋
│   ├── AIEngine        ← Minimax + Alpha-Beta + 評估函數
│   ├── AudioEngine     ← Web Audio API 合成音效與音樂
│   ├── UIManager       ← 畫面切換、DOM 操作
│   ├── AnimationEngine ← 棋子翻轉動畫、提示動畫
│   └── StorageManager  ← localStorage 存檔
└── 所有資源內嵌         ← 無外部依賴（字體用 Google Fonts CDN）
```

### 2.2 模組職責

| 模組 | 職責 |
|------|------|
| `GameEngine` | 棋盤狀態管理、合法走法計算、翻棋執行、勝負判定 |
| `AIEngine` | Minimax 搜尋、Alpha-Beta 剪枝、局面評估、難度控制 |
| `AudioEngine` | 背景音樂迴圈、落子音效、翻棋音效、勝利/失敗音效 |
| `UIManager` | 畫面路由（主畫面→遊戲→設定→結果）、DOM 更新 |
| `AnimationEngine` | CSS/JS 動畫管理、棋子翻轉 3D 效果 |
| `StorageManager` | 設定存取、局面自動存檔、成績紀錄 |

---

## 3. 檔案結構

```
othello/
└── index.html          ← 全部內容在此單一檔案
```

> **重要**：所有 CSS、JavaScript、SVG 圖示、音效合成代碼均內嵌於 `index.html`。  
> Google Fonts 透過 `<link>` 從 CDN 載入（需網路連線），若離線則 fallback 至系統字體。

---

## 4. 畫面規格

### 4.1 畫面總覽（路由）

```
[主畫面 / Home]
    │
    ├──[開始遊戲] ──→ [難度選擇] ──→ [遊戲中 / Game]
    │                                      │
    │                                      ├──[暫停選單]
    │                                      │     ├── 繼續
    │                                      │     ├── 重新開始
    │                                      │     └── 返回主畫面
    │                                      │
    │                                      └──[遊戲結算 / Result]
    │                                             ├── 再玩一次
    │                                             └── 返回主畫面
    │
    ├──[設定 / Settings]
    │     ├── 音樂開關
    │     ├── 音效開關
    │     ├── 音量調整
    │     ├── AI 落子速度
    │     └── 玩家顏色選擇（黑/白）
    │
    └──[排行榜 / Records]（可選，MVP 後加入）
```

### 4.2 Z-index 層級

| 層級 | 數值 | 用途 |
|------|------|------|
| 背景 | 0 | 棋盤背景 |
| 棋盤格線 | 10 | SVG 格線 |
| 棋子 | 20 | 棋子元素 |
| 提示標記 | 25 | 合法走法提示點 |
| 遊戲 HUD | 30 | 計分、回合顯示 |
| 暫停選單遮罩 | 50 | 半透明遮罩 |
| 暫停選單 | 60 | 選單卡片 |
| Modal / 結算 | 70 | 結算畫面 |
| Toast 通知 | 90 | 短暫提示訊息 |

---

## 5. 遊戲規則與邏輯

### 5.1 棋盤初始化

- 棋盤：8×8 格
- 初始配置（行列從 0 開始）：
  - `[3][3]` = 白，`[3][4]` = 黑
  - `[4][3]` = 黑，`[4][4]` = 白
- 黑棋先行

### 5.2 資料結構

```javascript
// 棋盤狀態：二維陣列
// 0 = 空, 1 = 黑棋, 2 = 白棋
let board = Array(8).fill(null).map(() => Array(8).fill(0));

// 玩家常數
const BLACK = 1;
const WHITE = 2;
const EMPTY = 0;

// 方向向量（8個方向）
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];
```

### 5.3 合法走法判斷

```
函數 isValidMove(board, row, col, player):
  1. 該格必須為空
  2. 對每個方向 dir:
     a. 從 (row+dir.r, col+dir.c) 開始
     b. 若相鄰格是對手棋子，繼續延伸
     c. 若延伸後遇到己方棋子，此方向有效 → 整體合法
  3. 任一方向合法 → 此格合法
```

### 5.4 翻棋邏輯

```
函數 executeMove(board, row, col, player):
  1. 在 (row, col) 放置 player 棋子
  2. 對每個方向 dir:
     a. 找出該方向需翻轉的棋子列表
     b. 將列表中所有棋子翻為 player 色
  3. 返回翻轉的棋子位置列表（供動畫使用）
```

### 5.5 回合管理

```
回合切換流程:
  1. 執行走法
  2. 切換 currentPlayer
  3. 計算新 currentPlayer 的合法走法
  4. 若無合法走法:
     a. 切換回對手
     b. 計算對手合法走法
     c. 若對手也無合法走法 → 遊戲結束
     d. 否則顯示「對手無法行動，跳過」Toast
  5. 若有合法走法 → 繼續
```

### 5.6 勝負判定

```
遊戲結束條件:
  - 棋盤已滿（64格皆非空）
  - 雙方皆無合法走法

計分:
  - 黑棋數量 vs 白棋數量
  - 多者勝，相等為平局
```

---

## 6. AI 演算法規格

### 6.1 演算法選型

**Minimax + Alpha-Beta 剪枝**，結合加權位置評估表。

### 6.2 難度對照

| 難度 | 搜尋深度 | 隨機因子 | AI 思考延遲 |
|------|---------|---------|------------|
| 新手 | 1 | 60% 機率選次優解 | 500ms |
| 一般 | 4 | 無 | 800ms |
| 困難 | 6 | 無，含終局求解 | 1000ms |

### 6.3 局面評估函數

```javascript
function evaluateBoard(board, player) {
  let score = 0;

  // 1. 位置權重分（最重要）
  score += positionScore(board, player);

  // 2. 行動力（合法走法數量差）
  score += mobilityScore(board, player) * 10;

  // 3. 穩定子（無法被翻轉的棋子）
  score += stabilityScore(board, player) * 25;

  // 4. 棋子數量差（終局才重要）
  if (isEndgame(board)) {
    score += pieceCountScore(board, player) * 100;
  }

  return score;
}
```

### 6.4 位置權重表（8×8）

```javascript
const POSITION_WEIGHTS = [
  [120, -20,  20,   5,   5,  20, -20, 120],
  [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [ 20,  -5,  15,   3,   3,  15,  -5,  20],
  [  5,  -5,   3,   3,   3,   3,  -5,   5],
  [  5,  -5,   3,   3,   3,   3,  -5,   5],
  [ 20,  -5,  15,   3,   3,  15,  -5,  20],
  [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [120, -20,  20,   5,   5,  20, -20, 120],
];
```

> 角落 120 分，角落相鄰格 -20/-40（因容易讓對方搶角）

### 6.5 Minimax + Alpha-Beta 虛擬碼

```
function minimax(board, depth, alpha, beta, maximizing, aiPlayer):
  if depth == 0 or gameOver(board):
    return evaluate(board, aiPlayer)

  moves = getLegalMoves(board, maximizing ? aiPlayer : opponent(aiPlayer))

  if moves is empty:
    // 跳過回合
    return minimax(board, depth-1, alpha, beta, !maximizing, aiPlayer)

  if maximizing:
    value = -Infinity
    for move in moves:
      newBoard = applyMove(board, move, aiPlayer)
      value = max(value, minimax(newBoard, depth-1, alpha, beta, false, aiPlayer))
      alpha = max(alpha, value)
      if alpha >= beta: break  // Beta 剪枝
    return value
  else:
    value = +Infinity
    for move in moves:
      newBoard = applyMove(board, move, opponent(aiPlayer))
      value = min(value, minimax(newBoard, depth-1, alpha, beta, true, aiPlayer))
      beta = min(beta, value)
      if alpha >= beta: break  // Alpha 剪枝
    return value
```

### 6.6 AI 行動流程

```
1. 顯示 AI 思考動畫（spinner / 棋子閃爍）
2. 使用 setTimeout 延遲（依難度設定）
3. Web Worker（可選）或主執行緒運行 minimax
4. 找出最高分的合法走法
5. 執行走法，觸發動畫
6. 切換回玩家回合
```

> ⚠️ 困難模式深度 6 在棋盤接近尾聲時可能需要 Web Worker 避免阻塞 UI。  
> MVP 階段可用 `setTimeout(fn, 0)` 分批計算或限制最大計算時間 1.5 秒。

---

## 7. 音效與音樂規格

### 7.1 技術方案

全部使用 **Web Audio API** 程式化合成，不依賴任何外部音訊檔案。

```javascript
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
```

> ⚠️ 瀏覽器政策：AudioContext 必須在使用者互動後才能啟動（點擊任意按鈕後初始化）

### 7.2 背景音樂

**風格**：日式枯山水 Lo-Fi 風格，簡約、有禪意

**實作方式**：

```
音樂迴圈結構（每 8 小節為一循環，約 16 秒）:
  - 樂器1: 正弦波琶音（Sine Arpeggio）
    音符序列: [C4, E4, G4, A4, G4, E4] 輪播
    音符時值: 0.5 秒/顆
    Attack: 0.05s, Decay: 0.1s, Sustain: 0.6, Release: 0.3s

  - 樂器2: 低頻 Sub Bass（Triangle Wave）
    根音: C3, 每 2 拍一次
    Attack: 0.1s, Release: 0.5s

  - 樂器3: 打擊（BufferSource + 白噪音濾波）
    節拍: 1 3 拍（2/4 拍感）
    高通濾波 >800Hz → 模擬輕敲木魚聲

  - Reverb: ConvolverNode（人工生成 impulse response）
    Wet/Dry: 0.3

  - 主音量: GainNode，預設 0.4
```

### 7.3 音效清單

| 音效 ID | 觸發時機 | 合成方式 | 參數 |
|---------|---------|---------|------|
| `sfx_place` | 玩家落子 | 正弦波短促音 | 頻率 440Hz→220Hz，時長 0.12s |
| `sfx_flip` | 棋子翻轉（每顆） | 三角波 glide | 600Hz→300Hz，時長 0.08s |
| `sfx_flip_combo` | 多顆翻轉完成 | 和弦上升音 | C-E-G 快速琶音 |
| `sfx_ai_place` | AI 落子 | 正弦波短促音 | 頻率 330Hz→165Hz，時長 0.12s |
| `sfx_skip` | 跳過回合 | 下滑音效 | 400Hz→200Hz，時長 0.25s |
| `sfx_win` | 玩家勝利 | 大三和弦上升 | C4-E4-G4-C5，每音 0.15s |
| `sfx_lose` | 玩家失敗 | 小三和弦下降 | C4-Eb4-G3，每音 0.2s |
| `sfx_draw` | 平局 | 全音音階 | C4-D4-E4，平穩 |
| `sfx_button` | 按鈕點擊 | 短促正弦 | 800Hz，時長 0.05s |
| `sfx_invalid` | 非法走法 | 低頻短音 | 150Hz，時長 0.1s |

### 7.4 音量管理

```javascript
// 音量架構
MasterGain (0.0 ~ 1.0)
  ├── MusicGain (0.0 ~ 1.0)  ← 背景音樂
  └── SFXGain   (0.0 ~ 1.0)  ← 所有音效
```

---

## 8. 響應式設計規格

### 8.1 斷點設計

| 裝置類型 | 寬度範圍 | 棋盤尺寸 | 說明 |
|---------|---------|---------|------|
| 手機直向 | 320px ~ 480px | `min(calc(100vw - 32px), 340px)` | 全寬減 padding |
| 手機橫向 | 481px ~ 667px | `min(calc(100vh - 140px), 380px)` | 依高度計算 |
| 平板 | 668px ~ 1024px | `min(480px, calc(100vw - 200px))` | 側邊有資訊欄 |
| 桌面 | 1025px+ | `520px` | 固定尺寸，側欄資訊 |

### 8.2 棋盤格子大小計算

```css
.cell {
  /* 棋盤容器 / 8 列 */
  width: calc(var(--board-size) / 8);
  height: calc(var(--board-size) / 8);
}
```

```javascript
// JS 動態設定
function updateBoardSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let size;

  if (vw <= 480) {
    size = Math.min(vw - 32, 340);
  } else if (vw <= 667) {
    size = Math.min(vh - 140, 380);
  } else if (vw <= 1024) {
    size = Math.min(480, vw - 200);
  } else {
    size = 520;
  }

  document.documentElement.style.setProperty('--board-size', `${size}px`);
}
window.addEventListener('resize', updateBoardSize);
window.addEventListener('orientationchange', updateBoardSize);
```

### 8.3 觸控優化

- 每個棋盤格子最小觸控目標：**44×44px**（Apple HIG 規範）
- 使用 `touch-action: manipulation` 禁止雙擊縮放
- 使用 `user-select: none` 防止選字
- 手機版：底部留安全距離（`env(safe-area-inset-bottom)`）

```css
body {
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.game-board {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 8.4 手機版 Layout

```
┌─────────────────────────┐
│  [← 返回]    黑白棋  [⚙]  │  ← Header（高度 56px）
├─────────────────────────┤
│  ⚫ 玩家  24  vs  AI  18 ⚪│  ← 計分欄（高度 64px）
│     [你的回合 ●]          │  ← 狀態列（高度 48px）
├─────────────────────────┤
│                          │
│    ┌──────────────┐      │
│    │              │      │
│    │   棋 盤      │      │  ← 棋盤（盡量大）
│    │   8 × 8      │      │
│    │              │      │
│    └──────────────┘      │
│                          │
├─────────────────────────┤
│  [暫停]          [提示]   │  ← 底部操作欄（高度 60px）
└─────────────────────────┘
```

---

## 9. 字體與視覺設計規格

### 9.1 字體選用

```css
/* 載入 Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Zen+Old+Mincho:wght@400;700&display=swap');

:root {
  --font-display: 'Zen Old Mincho', 'Noto Serif TC', serif;  /* 標題、遊戲名 */
  --font-body:    'Noto Serif TC', serif;                    /* 內文、UI 元素 */
  --font-number:  'Georgia', 'Noto Serif TC', serif;         /* 數字計分 */
}
```

### 9.2 字體大小規格（放大設計）

| 元素 | 桌面字體大小 | 手機字體大小 | 備註 |
|------|------------|------------|------|
| 遊戲主標題 | `3.5rem` (56px) | `2.5rem` (40px) | 主畫面大標 |
| 副標題 / 難度名 | `1.8rem` (29px) | `1.5rem` (24px) | |
| 計分數字 | `2.5rem` (40px) | `2rem` (32px) | 突顯分數 |
| 計分標籤（玩家/AI） | `1.2rem` (19px) | `1rem` (16px) | |
| 回合狀態文字 | `1.4rem` (22px) | `1.2rem` (19px) | 「你的回合」 |
| 按鈕文字（主要） | `1.4rem` (22px) | `1.3rem` (21px) | 開始/確認 |
| 按鈕文字（次要） | `1.1rem` (18px) | `1rem` (16px) | 設定項目 |
| 設定標籤 | `1.3rem` (21px) | `1.2rem` (19px) | 設定畫面標籤 |
| 設定選項值 | `1.1rem` (18px) | `1rem` (16px) | |
| Toast 通知 | `1.1rem` (18px) | `1rem` (16px) | |
| 結算標題 | `2.8rem` (45px) | `2.2rem` (35px) | 勝/負/平局 |
| 結算分數 | `2rem` (32px) | `1.6rem` (26px) | |

### 9.3 色彩主題（深色禪意主題）

```css
:root {
  /* 主色系：深色和風 */
  --color-bg-primary:    #1a1714;  /* 深墨色背景 */
  --color-bg-secondary:  #241f1a;  /* 次要背景 */
  --color-bg-card:       #2d2620;  /* 卡片背景 */
  --color-bg-board:      #2d5a27;  /* 棋盤底色（深綠） */
  --color-board-line:    #1e3d1a;  /* 棋盤線條 */
  --color-board-border:  #8b6914;  /* 棋盤外框（金色） */

  /* 棋子 */
  --color-piece-black:   #0d0d0d;  /* 黑棋 */
  --color-piece-black-shine: #3a3a3a;
  --color-piece-white:   #f0ede8;  /* 白棋 */
  --color-piece-white-shine: #ffffff;

  /* 文字 */
  --color-text-primary:  #e8e0d5;  /* 主要文字（米白） */
  --color-text-secondary:#a09585;  /* 次要文字 */
  --color-text-accent:   #d4a843;  /* 強調文字（金色） */

  /* 按鈕 */
  --color-btn-primary:   #d4a843;  /* 主要按鈕（金色） */
  --color-btn-primary-text: #1a1714;
  --color-btn-secondary: #3d342c;  /* 次要按鈕 */
  --color-btn-secondary-text: #e8e0d5;
  --color-btn-danger:    #8b3a3a;  /* 危險操作 */

  /* 提示點 */
  --color-hint:          rgba(212, 168, 67, 0.35);  /* 合法走法提示 */
  --color-hint-border:   rgba(212, 168, 67, 0.6);

  /* 狀態色 */
  --color-black-player:  #5ba3f5;  /* 黑棋玩家指示（藍） */
  --color-white-player:  #f5a623;  /* 白棋玩家指示（橘） */
  --color-win:           #4caf82;  /* 勝利綠 */
  --color-lose:          #e05c5c;  /* 失敗紅 */

  /* 圓角 */
  --radius-sm:   8px;
  --radius-md:   16px;
  --radius-lg:   24px;
  --radius-xl:   32px;
  --radius-full: 9999px;
}
```

### 9.4 棋子視覺效果

```css
/* 3D 立體感棋子 */
.piece {
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow:
    inset 0 -3px 6px rgba(0,0,0,0.4),
    0 4px 8px rgba(0,0,0,0.6);
}

.piece.black {
  background: radial-gradient(
    circle at 35% 35%,
    var(--color-piece-black-shine),
    var(--color-piece-black) 60%
  );
}

.piece.white {
  background: radial-gradient(
    circle at 35% 35%,
    var(--color-piece-white-shine),
    var(--color-piece-white) 60%
  );
}
```

---

## 10. 動畫與互動規格

### 10.1 棋子翻轉動畫

使用 CSS 3D Transform 模擬真實棋子翻轉：

```css
@keyframes flipToBlack {
  0%   { transform: rotateY(0deg);    background: /* white */; }
  49%  { transform: rotateY(90deg);   background: /* white */; }
  50%  { transform: rotateY(90deg);   background: /* black */; }
  100% { transform: rotateY(180deg);  background: /* black */; }
}

@keyframes flipToWhite {
  0%   { transform: rotateY(0deg);    background: /* black */; }
  49%  { transform: rotateY(90deg);   background: /* black */; }
  50%  { transform: rotateY(90deg);   background: /* white */; }
  100% { transform: rotateY(180deg);  background: /* white */; }
}
```

翻轉時間：`0.35s ease-in-out`  
多顆翻轉時，每顆延遲 `0.05s`（瀑布效果）

### 10.2 落子動畫

```css
@keyframes piecePlace {
  0%   { transform: scale(0) translateY(-10px); opacity: 0; }
  60%  { transform: scale(1.15) translateY(0); opacity: 1; }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
/* 時長: 0.3s */
```

### 10.3 提示點動畫

```css
@keyframes hintPulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50%       { transform: scale(1.1); opacity: 0.9; }
}
/* 時長: 1.5s infinite */
```

### 10.4 畫面切換動畫

```css
/* 畫面進入 */
@keyframes screenFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.screen.active {
  animation: screenFadeIn 0.35s ease-out forwards;
}
```

### 10.5 計分數字更新動畫

分數變化時，數字彈跳效果：
```css
@keyframes scoreUpdate {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.4); color: var(--color-text-accent); }
  100% { transform: scale(1); }
}
/* 時長: 0.4s */
```

### 10.6 AI 思考動畫

```
三顆棋子（黑色小圓點）依序跳動
顯示「AI 思考中...」文字
動畫: 每顆間隔 0.2s 上下彈跳
```

### 10.7 Toast 通知

```
- 出現: 從底部滑入（translateY 100% → 0），時長 0.3s
- 停留: 2秒
- 消失: 淡出，時長 0.3s
- 位置: 畫面底部，距底 80px + safe-area
```

---

## 11. 設定系統規格

### 11.1 設定項目

| 設定項 | 預設值 | 類型 | 說明 |
|--------|--------|------|------|
| `musicEnabled` | `true` | boolean | 背景音樂開關 |
| `sfxEnabled` | `true` | boolean | 音效開關 |
| `masterVolume` | `0.7` | 0.0~1.0 | 主音量（slider） |
| `musicVolume` | `0.4` | 0.0~1.0 | 音樂音量 |
| `sfxVolume` | `0.8` | 0.0~1.0 | 音效音量 |
| `aiSpeed` | `'normal'` | enum | AI 落子速度：`fast/normal/slow` |
| `playerColor` | `'black'` | enum | 玩家棋色：`black/white` |
| `showHints` | `true` | boolean | 顯示合法走法提示 |
| `difficulty` | `'normal'` | enum | AI 難度（從難度選擇畫面設定） |

### 11.2 設定畫面 UI 元素大小

```
設定畫面容器：最大寬度 480px，置中
每個設定列高度：64px（手機）/ 72px（桌面）
標籤字體：1.3rem（桌面）/ 1.2rem（手機）
Toggle Switch 尺寸：寬 56px，高 32px，手把 28px
Slider 高度：6px，手把直徑 24px（確保好滑動）
```

---

## 12. 資料持久化

### 12.1 localStorage 結構

```javascript
// Key: 'othello_settings'
{
  musicEnabled: true,
  sfxEnabled: true,
  masterVolume: 0.7,
  musicVolume: 0.4,
  sfxVolume: 0.8,
  aiSpeed: 'normal',
  showHints: true
}

// Key: 'othello_game_state'（自動存檔）
{
  board: [[...], ...],    // 8x8 棋盤狀態
  currentPlayer: 1,       // 1=黑, 2=白
  playerColor: 'black',
  difficulty: 'normal',
  blackCount: 26,
  whiteCount: 22,
  moveHistory: [...],     // 可選，供悔棋功能
  savedAt: 1700000000000
}

// Key: 'othello_records'
{
  wins: 12,
  losses: 8,
  draws: 2,
  totalGames: 22,
  winStreak: 3,
  bestStreak: 5
}
```

### 12.2 存檔時機

- **設定變更**：即時存檔
- **遊戲中**：每次落子後自動存檔
- **遊戲結束**：更新 records，清除 game_state
- **返回主畫面**：若遊戲進行中，保留 game_state，主畫面顯示「繼續上次遊戲」按鈕

---

## 13. 各畫面詳細規格

### 13.1 主畫面（Home Screen）

```
┌────────────────────────────┐
│                            │
│      ◉ 黑 白 棋            │  ← 裝飾棋子 + 主標題（3.5rem）
│  Othello / Reversi         │  ← 英文副標（1rem, 淡色）
│                            │
│   ┌──────────────────┐     │
│   │   ▶  開始遊戲    │     │  ← 主要按鈕（1.4rem, 金色）
│   └──────────────────┘     │
│                            │
│   ┌──────────────────┐     │
│   │   ↺  繼續遊戲    │     │  ← 僅當有存檔時顯示
│   └──────────────────┘     │
│                            │
│   ┌──────────────────┐     │
│   │   ⚙  設    定    │     │  ← 次要按鈕
│   └──────────────────┘     │
│                            │
│   ┌──────────────────┐     │
│   │   📊  成績紀錄   │     │
│   └──────────────────┘     │
│                            │
│  版本 v1.0.0   🎵 ♪ 音樂  │  ← 底部（音樂快速開關）
└────────────────────────────┘
```

**裝飾**：背景有緩慢旋轉的半透明棋盤紋路，金色粒子飄落效果（10~15顆，CSS animation）

### 13.2 難度選擇畫面

```
┌────────────────────────────┐
│  [←]    選擇難度           │
├────────────────────────────┤
│                            │
│  請選擇 AI 難度：           │
│                            │
│  ┌──────────────────────┐  │
│  │  🌱  新    手         │  │  ← 1.5rem 字
│  │  AI 會犯錯，適合入門  │  │  ← 0.9rem 說明
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  ⚔️   一    般         │  │
│  │  均衡策略，有挑戰性   │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  🔥  困    難         │  │
│  │  完整 Minimax，很強   │  │
│  └──────────────────────┘  │
│                            │
│  玩家棋色：  ⚫ 黑  |  ⚪ 白 │
│                            │
└────────────────────────────┘
```

### 13.3 遊戲中畫面（Game Screen）

**桌面版 Layout（側欄）：**

```
┌──────────┬─────────────────────┬──────────┐
│  ⚫ 玩家  │                     │  AI ⚪   │
│  計: 26  │    ┌──────────┐     │  計: 18  │
│          │    │          │     │          │
│  [你的   │    │  棋  盤  │     │  [AI     │
│   回合]  │    │  8 × 8   │     │  等待中] │
│          │    │          │     │          │
│          │    └──────────┘     │          │
│  [暫停]  │                     │  [提示]  │
└──────────┴─────────────────────┴──────────┘
```

**手機版 Layout（參見 8.4）**

### 13.4 暫停選單

```
半透明遮罩覆蓋遊戲畫面

┌────────────────────┐
│      ⏸ 暫停         │  ← 2rem
├────────────────────┤
│  ▶  繼    續        │  ← 1.4rem
│  ↺  重新開始        │
│  ⚙  設    定        │
│  🏠  返回主畫面     │
└────────────────────┘
```

### 13.5 遊戲結算畫面

```
┌────────────────────────────┐
│                            │
│         🏆 勝  利 !         │  ← 2.8rem，動畫進場
│  (或：  😢 失  敗      )   │
│  (或：  🤝 平  局      )   │
│                            │
│    ⚫ 你    vs   AI ⚪      │
│    ─────────────────        │
│       32    :    32        │  ← 2.5rem 數字
│                            │
│   本次勝率：56%             │
│   翻轉總數：42 顆           │
│                            │
│  ┌──────────────────────┐  │
│  │   ↺  再玩一次         │  │  ← 金色按鈕
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │   🏠  返回主畫面     │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

---

## 14. 錯誤處理與邊界條件

| 情境 | 處理方式 |
|------|---------|
| 點擊非法格子 | 播放 `sfx_invalid`，格子短暫紅色閃爍（0.3s） |
| AI 計算超時（>2s） | 強制選擇第一個合法走法，確保不卡死 |
| 雙方皆無合法走法 | 立即結束，進入結算畫面 |
| localStorage 不可用 | 靜默降級，不存檔，遊戲仍可進行 |
| AudioContext 被阻擋 | 在第一次使用者互動時 resume()，否則靜音運行 |
| 橫向/直向切換 | 重算棋盤尺寸，保持狀態不丟失 |
| 單方無法行動 | 顯示 Toast「黑棋/白棋無法行動，跳過」 |

---

## 15. 效能規格

| 指標 | 目標 |
|------|------|
| 初始載入時間 | < 2 秒（含 Google Fonts） |
| 棋盤渲染 | < 16ms/幀（60fps） |
| AI 回應時間（新手） | 500ms ± 50ms |
| AI 回應時間（一般） | 800ms ~ 1500ms |
| AI 回應時間（困難） | 1000ms ~ 2500ms |
| 記憶體使用 | < 50MB |
| 棋子動畫 FPS | ≥ 60fps（CSS transform） |

### 效能優化要點

1. **棋盤 DOM**：遊戲開始時一次性建立 64 個 `<div>`，之後只修改 className，不重建 DOM
2. **AI 計算**：使用迭代加深（Iterative Deepening）避免超時
3. **動畫**：全部使用 `transform` 和 `opacity`，觸發 GPU 合成，避免 layout reflow
4. **音效**：預先建立 AudioNode 池，重複使用，不每次 new

---

## 16. 開發注意事項

### 16.1 HTML 結構概要

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#1a1714">
  <title>黑白棋</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
  <style>/* 所有 CSS */</style>
</head>
<body>
  <div id="app">
    <div id="screen-home"    class="screen"><!-- 主畫面 --></div>
    <div id="screen-difficulty" class="screen"><!-- 難度選擇 --></div>
    <div id="screen-game"    class="screen"><!-- 遊戲中 --></div>
    <div id="screen-settings" class="screen"><!-- 設定 --></div>
    <div id="screen-records" class="screen"><!-- 成績 --></div>
    <div id="screen-result"  class="screen"><!-- 結算 --></div>
    <div id="pause-overlay"  class="overlay hidden"><!-- 暫停 --></div>
    <div id="toast"          class="toast hidden"></div>
  </div>
  <script>/* 所有 JS */</script>
</body>
</html>
```

### 16.2 Class 命名規範（BEM-like）

```
.screen                    → 畫面容器
.screen--active            → 當前顯示的畫面
.board                     → 棋盤
.board__cell               → 棋盤格子
.board__cell--valid        → 合法走法格子
.piece                     → 棋子
.piece--black / .piece--white
.piece--placing            → 放置動畫
.piece--flipping           → 翻轉動畫
.hint-dot                  → 提示點
.btn                       → 基礎按鈕
.btn--primary / .btn--secondary / .btn--danger
.score-panel               → 計分區
.status-bar                → 回合狀態列
```

### 16.3 JS 初始化順序

```javascript
document.addEventListener('DOMContentLoaded', () => {
  StorageManager.init();      // 1. 載入設定
  UIManager.init();           // 2. 建立 DOM 事件
  AudioEngine.init();         // 3. 準備音效（不啟動）
  GameEngine.init();          // 4. 初始化棋盤邏輯
  UIManager.showScreen('home'); // 5. 顯示主畫面
});

// 第一次使用者互動後啟動音訊
document.addEventListener('click', () => {
  AudioEngine.resume();
}, { once: true });
```

### 16.4 測試清單

- [ ] 新手/一般/困難難度皆可完整對局
- [ ] 黑棋/白棋切換正常
- [ ] 雙方皆無法行動時正確結束
- [ ] 跳過回合 Toast 正常顯示
- [ ] 音樂/音效開關正常
- [ ] 存檔/讀檔正常（繼續遊戲）
- [ ] iPhone Safari 直向遊玩
- [ ] iPhone Safari 橫向遊玩
- [ ] Android Chrome 遊玩
- [ ] 棋子翻轉動畫流暢
- [ ] 設定字體夠大，老人可讀
- [ ] 無障礙：按鈕有 aria-label

---

*規格書版本 v1.0.0 — 完整單人 vs AI 黑白棋純前端實作規格*
