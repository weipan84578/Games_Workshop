# 五子棋（Gomoku）純前端遊戲規格書

**版本：** 1.0.0  
**日期：** 2026-05-20  
**模式：** 單人 vs AI（演算法）  
**部署：** 純靜態，點擊 `index.html` 即可遊玩，無需任何 server 或 build 流程

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [檔案結構](#3-檔案結構)
4. [畫面設計規格](#4-畫面設計規格)
5. [遊戲規則](#5-遊戲規則)
6. [AI 演算法規格](#6-ai-演算法規格)
7. [音樂與音效規格](#7-音樂與音效規格)
8. [設定系統](#8-設定系統)
9. [響應式設計（行動裝置）](#9-響應式設計行動裝置)
10. [遊戲流程狀態機](#10-遊戲流程狀態機)
11. [資料結構定義](#11-資料結構定義)
12. [模組介面規格](#12-模組介面規格)
13. [錯誤處理](#13-錯誤處理)
14. [可擴充性備注](#14-可擴充性備注)

---

## 1. 專案概覽

### 1.1 目標

打造一款可在任何現代瀏覽器直接開啟、無需安裝或執行 server 的五子棋單機遊戲。玩家以黑棋對抗 AI 白棋，支援桌機與行動裝置觸控操作。

### 1.2 核心功能

- 標準 15×15 棋盤五子棋對局
- 單人 vs AI（三種難度：簡單 / 普通 / 困難）
- 背景音樂 + 落子音效 + 勝負音效
- 全局設定（難度、音量、主題色）
- 響應式 UI，支援手機直式/橫式操作
- 主畫面字體與按鈕均放大，確保行動裝置易讀易點

### 1.3 限制條件

| 項目 | 規格 |
|------|------|
| 執行環境 | 瀏覽器（Chrome / Firefox / Safari / Edge 最新版） |
| 相依套件 | 無任何外部 npm 套件，僅使用原生 Web API |
| 音效來源 | Web Audio API 程式生成（無需外部音檔） |
| 背景音樂 | Web Audio API 合成（可選用 Base64 內嵌 .ogg/.mp3） |
| 儲存 | `localStorage`（設定持久化） |
| 網路需求 | 完全離線可用 |

---

## 2. 技術架構

### 2.1 技術選型

```
純原生 HTML5 + CSS3 + Vanilla JavaScript (ES2020+)
Canvas API  → 棋盤繪製
Web Audio API → 音樂與音效合成
localStorage  → 設定儲存
```

### 2.2 架構模式

採用**模組化單檔**（All-in-one `index.html`）架構，以 `<script type="module">` 分隔邏輯層：

```
┌─────────────────────────────────────┐
│             index.html              │
│  ┌────────┐  ┌───────┐  ┌────────┐ │
│  │  View  │  │ Game  │  │  AI    │ │
│  │ (DOM/  │←→│ Logic │←→│ Engine │ │
│  │ Canvas)│  │       │  │        │ │
│  └────────┘  └───────┘  └────────┘ │
│         ↕              ↕           │
│  ┌──────────┐  ┌──────────────┐    │
│  │  Audio   │  │  Settings    │    │
│  │  Manager │  │  Manager     │    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
```

### 2.3 執行流程

```
index.html 載入
    │
    ├─ SettingsManager.init()   → 讀取 localStorage
    ├─ AudioManager.init()      → 初始化 Web Audio Context
    ├─ UI.showMainMenu()        → 渲染主畫面
    │
    └─ [使用者按「開始遊戲」]
           │
           ├─ GameLogic.init()  → 重置棋盤狀態
           ├─ BoardView.render() → Canvas 繪製棋盤
           └─ GameLoop.start()  → 進入對局狀態機
```

---

## 3. 檔案結構

```
gomoku/
├── index.html          ← 唯一入口，含所有 HTML / CSS / JS
└── (無其他必要檔案)
```

> **補充說明：** 所有音效由 Web Audio API 程式合成，所有圖形由 Canvas 繪製，故無需任何外部資源檔案。若日後需要自訂背景音樂，可將 MP3/OGG 以 Base64 字串內嵌於 JS 常數中。

---

## 4. 畫面設計規格

### 4.1 畫面列表

| 畫面 ID | 名稱 | 說明 |
|---------|------|------|
| `SCREEN_MAIN` | 主畫面 | 標題、開始遊戲、設定按鈕 |
| `SCREEN_GAME` | 對局畫面 | 棋盤、資訊列、暫停按鈕 |
| `SCREEN_SETTINGS` | 設定畫面 | 難度、音量、主題色選項 |
| `SCREEN_RESULT` | 結果畫面 | 勝負顯示、再來一局、回主畫面 |
| `SCREEN_PAUSE` | 暫停彈窗 | 繼續、重新開始、設定、離開 |

---

### 4.2 主畫面（SCREEN_MAIN）

#### 視覺元素

```
┌─────────────────────────────┐
│                             │
│        ♟ 五 子 棋 ♟         │  ← 標題，字體 ≥ 48px（桌機），≥ 36px（手機）
│                             │
│      [  開 始 遊 戲  ]       │  ← 主按鈕，字體 ≥ 24px，高度 ≥ 60px
│                             │
│      [    設    定    ]      │  ← 次按鈕，字體 ≥ 20px，高度 ≥ 54px
│                             │
│   版本 1.0  |  ♪ 音樂開啟   │  ← 底部狀態列
└─────────────────────────────┘
```

#### 樣式規格

| 元素 | 桌機字體 | 手機字體 | 最小點擊高度 |
|------|---------|---------|------------|
| 遊戲標題 | 56px | 40px | — |
| 副標題 | 20px | 16px | — |
| 主要按鈕 | 26px | 22px | 60px |
| 次要按鈕 | 22px | 18px | 54px |
| 底部文字 | 14px | 13px | — |

#### 動畫

- 標題進場：`fadeInDown` 0.6s ease-out
- 按鈕進場：`fadeInUp` 0.8s ease-out（有 0.2s delay）
- 按鈕 hover/active：`scale(1.05)` + 陰影加深，`transition: 0.15s`

---

### 4.3 對局畫面（SCREEN_GAME）

#### 佈局

```
┌──────────────────────────────────────┐
│ ◀  黑棋（你）        白棋（AI）  ⏸  │  ← 頂部資訊列，字體 ≥ 18px
│    ●●●●●●●●●         ○○○○○○○○○       │
├──────────────────────────────────────┤
│                                      │
│         [ Canvas 棋盤區域 ]           │  ← 正方形，自動適應視窗寬度
│                                      │
├──────────────────────────────────────┤
│  輪到：黑棋        [悔棋]  [投降]    │  ← 底部操作列，字體 ≥ 18px
└──────────────────────────────────────┘
```

#### Canvas 棋盤規格

| 項目 | 規格 |
|------|------|
| 格線數 | 15×15（共 225 個交叉點） |
| 棋盤尺寸 | `min(viewport_width - 32px, viewport_height - 160px, 600px)` |
| 格線間距 | `棋盤尺寸 / 14`（邊緣留半格） |
| 背景色 | `#DEB887`（木色）/ 深色主題 `#5C3A1A` |
| 格線色 | `#8B6914` |
| 星位（天元+花點） | 5×5, 5×10, 5×15... 等 9 個，半徑 3px |
| 黑棋 | 漸層深灰→黑，半徑 `格距 × 0.44` |
| 白棋 | 漸層白→淺灰，半徑 `格距 × 0.44`，灰色邊框 |
| 最後落子標記 | 紅色小方點，疊加於棋子中心 |
| 座標標示 | A-O（橫）、1-15（縱），字體 `max(10px, 格距×0.35)` |

#### 棋盤繪製演算法

```javascript
function drawBoard(ctx, size, theme) {
  const padding = size / 14;          // 半格邊距
  const cellSize = (size - padding * 2) / 14;

  // 1. 填充背景
  ctx.fillStyle = theme.boardColor;
  ctx.fillRect(0, 0, size, size);

  // 2. 繪製格線（15條橫 + 15條縱）
  for (let i = 0; i < 15; i++) {
    const x = padding + i * cellSize;
    const y = padding + i * cellSize;
    // 橫線
    drawLine(ctx, padding, y, padding + 14 * cellSize, y);
    // 縱線
    drawLine(ctx, x, padding, x, padding + 14 * cellSize);
  }

  // 3. 繪製星位（天元 7,7；花點 3,3 / 3,11 / 11,3 / 11,11 等）
  const starPoints = [[3,3],[3,11],[7,7],[11,3],[11,11],[3,7],[7,3],[7,11],[11,7]];
  starPoints.forEach(([r,c]) => drawDot(ctx, padding + c*cellSize, padding + r*cellSize, 3));
}
```

---

### 4.4 設定畫面（SCREEN_SETTINGS）

```
┌────────────────────────────┐
│  ⚙  遊 戲 設 定             │
├────────────────────────────┤
│  AI 難度                   │
│  [簡單]  [普通✓]  [困難]   │  ← Toggle button group
├────────────────────────────┤
│  背景音樂音量              │
│  🔈 ────●──────── 🔊      │  ← Range slider，字體 ≥ 16px
├────────────────────────────┤
│  音效音量                  │
│  🔈 ──────────●── 🔊      │
├────────────────────────────┤
│  介面主題                  │
│  [☀ 淺色]  [🌙 深色]       │
├────────────────────────────┤
│       [ 確認儲存 ]          │  ← 字體 ≥ 20px，高度 ≥ 56px
└────────────────────────────┘
```

---

### 4.5 結果畫面（SCREEN_RESULT）

```
┌────────────────────────────┐
│                            │
│      🏆  你 獲 勝 了！      │  ← 字體 ≥ 40px，勝利動畫
│   （或：AI 獲勝，再接再厲） │
│                            │
│   對局統計                 │
│   ─────────────────        │
│   總手數：  42 手          │
│   落子時間：3 分 21 秒      │
│                            │
│   [ 再 來 一 局 ]           │  ← 字體 ≥ 22px
│   [ 回 主 畫 面 ]           │
│                            │
└────────────────────────────┘
```

---

### 4.6 色彩系統

#### 淺色主題（預設）

| 變數名稱 | 色碼 | 用途 |
|---------|------|------|
| `--bg-primary` | `#F5F0E8` | 頁面背景 |
| `--bg-card` | `#FFFFFF` | 卡片背景 |
| `--accent` | `#8B4513` | 主要強調色 |
| `--btn-primary` | `#6B3410` | 主按鈕背景 |
| `--btn-primary-text` | `#FFFFFF` | 主按鈕文字 |
| `--text-primary` | `#2C1810` | 主要文字 |
| `--text-secondary` | `#6B4423` | 次要文字 |
| `--board-color` | `#DEB887` | 棋盤背景 |
| `--board-line` | `#8B6914` | 棋盤格線 |

#### 深色主題

| 變數名稱 | 色碼 | 用途 |
|---------|------|------|
| `--bg-primary` | `#1A1008` | 頁面背景 |
| `--bg-card` | `#2A1A0C` | 卡片背景 |
| `--accent` | `#D4863A` | 主要強調色 |
| `--btn-primary` | `#D4863A` | 主按鈕背景 |
| `--btn-primary-text` | `#1A1008` | 主按鈕文字 |
| `--text-primary` | `#F0E0C0` | 主要文字 |
| `--text-secondary` | `#B8956A` | 次要文字 |
| `--board-color` | `#5C3A1A` | 棋盤背景 |
| `--board-line` | `#7A5225` | 棋盤格線 |

---

## 5. 遊戲規則

### 5.1 標準規則

- 棋盤：15×15 交叉點
- 黑棋先手（玩家）
- 雙方輪流於空白交叉點落子
- **勝利條件：** 任一方在橫、縱、斜（45°或135°）方向連成不被中斷的 **5顆（或以上）** 同色棋子
- 本版本採用**自由五**規則（長連亦算勝）
- 棋盤落滿（225顆）無人勝出則平局

### 5.2 勝負檢查演算法

```javascript
/**
 * 檢查指定位置落子後是否形成五連
 * @param {number[][]} board - 15×15 棋盤（0=空, 1=黑, 2=白）
 * @param {number} row - 落子行
 * @param {number} col - 落子列
 * @param {number} player - 玩家（1 or 2）
 * @returns {boolean}
 */
function checkWin(board, row, col, player) {
  const directions = [
    [0, 1],   // 橫
    [1, 0],   // 縱
    [1, 1],   // 右斜
    [1, -1],  // 左斜
  ];

  return directions.some(([dr, dc]) => {
    let count = 1;
    // 正向延伸
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15 || board[r][c] !== player) break;
      count++;
    }
    // 反向延伸
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15 || board[r][c] !== player) break;
      count++;
    }
    return count >= 5;
  });
}
```

### 5.3 悔棋規則

- 每局悔棋次數上限：**3次**（困難模式不可悔棋）
- 每次悔棋撤回最近一手玩家棋子與最近一手 AI 棋子（共撤回兩步）
- 若玩家第一手即申請悔棋，不消耗次數

---

## 6. AI 演算法規格

### 6.1 整體架構

AI 採用 **Minimax + Alpha-Beta 剪枝 + 啟發式評估函數** 實作。

```
AI 決策流程：
  收到落子請求
      │
      ├─ [簡單模式] → RandomAI：隨機選空格（帶簡單阻擋）
      ├─ [普通模式] → MinimaxAI（depth=2, Alpha-Beta）
      └─ [困難模式] → MinimaxAI（depth=4, Alpha-Beta + 候選點剪枝）
```

### 6.2 評估函數（Heuristic）

#### 6.2.1 棋型分類與分數

| 棋型名稱 | 定義 | 分數（進攻） | 分數（防守） |
|---------|------|------------|------------|
| 五連 | `OOOOO` | 100,000 | 100,000 |
| 活四 | `_OOOO_` | 10,000 | 8,000 |
| 衝四 | `XOOOO_` 或 `_OOOO X` | 1,000 | 800 |
| 活三 | `_OOO_` | 1,000 | 800 |
| 眠三 | `XOOO_` 或 `_OOO X` | 100 | 80 |
| 活二 | `_OO_` | 100 | 80 |
| 眠二 | `XOO_` | 10 | 8 |

> `O`=己方棋子, `_`=空格, `X`=對方棋子或邊界

#### 6.2.2 評分計算

```javascript
function evaluateBoard(board, aiPlayer) {
  const humanPlayer = aiPlayer === 1 ? 2 : 1;
  let score = 0;

  // 所有行、列、斜線方向掃描
  const lines = getAllLines(board); // 取得所有長度≥5的連續格序列

  lines.forEach(line => {
    score += evaluateLine(line, aiPlayer)   * 1.0;  // 進攻
    score -= evaluateLine(line, humanPlayer) * 0.9;  // 防守權重略低
  });

  // 中心位置加分（距中心越近越好）
  score += centerBonus(board, aiPlayer);

  return score;
}
```

#### 6.2.3 候選落子點篩選

困難模式下，僅考慮**現有棋子周圍 2 格範圍**內的空格作為候選點，大幅減少搜尋節點數：

```javascript
function getCandidates(board) {
  const candidates = new Set();
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (board[r][c] !== 0) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15 && board[nr][nc] === 0) {
              candidates.add(nr * 15 + nc);
            }
          }
        }
      }
    }
  }
  return [...candidates].map(key => ({ r: Math.floor(key / 15), c: key % 15 }));
}
```

### 6.3 Minimax + Alpha-Beta

```javascript
function minimax(board, depth, alpha, beta, isMaximizing, aiPlayer) {
  // 終止條件
  if (depth === 0 || isTerminal(board)) {
    return evaluateBoard(board, aiPlayer);
  }

  const candidates = getCandidates(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const { r, c } of candidates) {
      board[r][c] = aiPlayer;
      const score = minimax(board, depth - 1, alpha, beta, false, aiPlayer);
      board[r][c] = 0;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha 剪枝
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    const humanPlayer = aiPlayer === 1 ? 2 : 1;
    for (const { r, c } of candidates) {
      board[r][c] = humanPlayer;
      const score = minimax(board, depth - 1, alpha, beta, true, aiPlayer);
      board[r][c] = 0;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Beta 剪枝
    }
    return minScore;
  }
}
```

### 6.4 AI 決策入口

```javascript
async function getAIMove(board, difficulty) {
  // 讓 UI 先渲染「AI 思考中...」
  await sleep(difficulty === 'hard' ? 300 : 150);

  if (difficulty === 'easy') return randomMove(board);

  const depth = difficulty === 'normal' ? 2 : 4;
  let bestMove = null;
  let bestScore = -Infinity;

  for (const { r, c } of getCandidates(board)) {
    board[r][c] = AI_PLAYER;
    const score = minimax(board, depth - 1, -Infinity, Infinity, false, AI_PLAYER);
    board[r][c] = 0;
    if (score > bestScore) { bestScore = score; bestMove = { r, c }; }
  }

  return bestMove ?? fallbackCenter(board);
}
```

### 6.5 各難度行為差異

| 項目 | 簡單 | 普通 | 困難 |
|------|------|------|------|
| 演算法 | 隨機 + 簡單阻擋 | Minimax depth=2 | Minimax depth=4 |
| Alpha-Beta | 否 | 是 | 是 |
| 候選點篩選 | 否 | 是（2格） | 是（2格） |
| 悔棋 | 允許（3次） | 允許（3次） | 不允許 |
| AI 思考延遲 | 300ms | 500ms | 800ms（模擬思考感） |

---

## 7. 音樂與音效規格

### 7.1 架構

全部聲音由 **Web Audio API** 程式合成，無需外部音檔。

```javascript
class AudioManager {
  constructor() {
    this.ctx = null;           // AudioContext（需用戶互動後建立）
    this.bgmGain = null;       // 背景音樂音量節點
    this.sfxGain = null;       // 音效音量節點
    this.bgmOscillators = [];  // 背景音樂振盪器群
    this.isBgmPlaying = false;
  }

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.bgmGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);
  }
}
```

### 7.2 背景音樂合成

採用**和弦琶音循環**模擬禪風音樂：

```javascript
/**
 * 播放背景音樂：Am - F - C - G 和弦循環
 * 每個音符使用正弦波 + 輕微泛音，ADSR 包絡
 */
function startBGM(audioManager) {
  const { ctx, bgmGain } = audioManager;

  // 音符序列（Hz），Am 調式琶音
  const notes = [
    220.0,  // A3
    261.6,  // C4
    329.6,  // E4
    349.2,  // F4
    261.6,  // C4
    392.0,  // G4
    440.0,  // A4
    329.6,  // E4
  ];

  let noteIndex = 0;
  const noteDuration = 0.8; // 秒

  function scheduleNote(time) {
    const freq = notes[noteIndex % notes.length];
    noteIndex++;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(bgmGain);

    osc.type = 'sine';
    osc.frequency.value = freq;

    // ADSR 包絡
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.15, time + 0.05);  // Attack
    gainNode.gain.linearRampToValueAtTime(0.10, time + 0.2);   // Decay
    gainNode.gain.setValueAtTime(0.10, time + noteDuration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, time + noteDuration); // Release

    osc.start(time);
    osc.stop(time + noteDuration);
  }

  // 預排 8 個音符，循環
  function loop() {
    const startTime = ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      scheduleNote(startTime + i * noteDuration);
    }
    audioManager.bgmTimer = setTimeout(loop, 8 * noteDuration * 1000 - 100);
  }

  loop();
}
```

### 7.3 音效定義

| 音效 ID | 觸發事件 | 合成方式 | 參數 |
|---------|---------|---------|------|
| `sfx_place_black` | 玩家落子 | 短促正弦波 | 頻率 600Hz，時長 80ms，decay |
| `sfx_place_white` | AI 落子 | 短促正弦波 | 頻率 500Hz，時長 80ms，decay |
| `sfx_win` | 玩家獲勝 | 上升和弦 | C4→E4→G4→C5 琶音，各 150ms |
| `sfx_lose` | AI 獲勝 | 下降音型 | C4→B3→A3→G3 琶音，各 150ms |
| `sfx_draw` | 平局 | 中性和弦 | 持續 Am 和弦 400ms |
| `sfx_click` | 按鈕點擊 | 短促噪聲+濾波 | 時長 50ms |
| `sfx_invalid` | 非法落子 | 低頻噪聲 | 頻率 200Hz，時長 100ms |
| `sfx_undo` | 悔棋 | 反向音效 | 頻率 400Hz→300Hz，時長 120ms |

#### 落子音效實作範例

```javascript
function playSFX_place(audioManager, isBlack) {
  const { ctx, sfxGain } = audioManager;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(sfxGain);

  osc.type = 'sine';
  osc.frequency.value = isBlack ? 600 : 500;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.start(now);
  osc.stop(now + 0.08);
}
```

### 7.4 音訊初始化限制處理

瀏覽器要求 AudioContext 必須在用戶互動後建立：

```javascript
// 主畫面「開始遊戲」按鈕點擊時呼叫
document.getElementById('btn-start').addEventListener('click', () => {
  if (!audioManager.ctx) {
    audioManager.init();     // 首次互動時初始化
    startBGM(audioManager);
  }
  showScreen('SCREEN_GAME');
});
```

---

## 8. 設定系統

### 8.1 設定欄位

```javascript
const DEFAULT_SETTINGS = {
  difficulty: 'normal',   // 'easy' | 'normal' | 'hard'
  bgmVolume: 0.5,         // 0.0 ~ 1.0
  sfxVolume: 0.8,         // 0.0 ~ 1.0
  theme: 'light',         // 'light' | 'dark'
};
```

### 8.2 localStorage 鍵值

| 鍵值 | 說明 |
|------|------|
| `gomoku_settings` | JSON 序列化的設定物件 |
| `gomoku_stats` | 累計勝負場數（可選） |

### 8.3 設定管理器

```javascript
class SettingsManager {
  static KEY = 'gomoku_settings';

  static load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static save(settings) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('設定儲存失敗（可能為隱私模式）:', e);
    }
  }

  static apply(settings, audioManager) {
    // 套用音量
    audioManager.bgmGain.gain.value = settings.bgmVolume;
    audioManager.sfxGain.gain.value = settings.sfxVolume;
    // 套用主題
    document.documentElement.setAttribute('data-theme', settings.theme);
  }
}
```

---

## 9. 響應式設計（行動裝置）

### 9.1 斷點定義

| 裝置 | 斷點 | 說明 |
|------|------|------|
| 桌機 | `≥ 768px` | 完整版面 |
| 平板 | `480px ~ 767px` | 縮小字體，棋盤縮小 |
| 手機直式 | `< 480px` | 單欄佈局，大按鈕 |

### 9.2 CSS 響應式策略

```css
/* 全局字體底線 */
:root {
  font-size: 18px; /* 比預設 16px 大，改善行動閱讀 */
}

/* 棋盤尺寸自動計算 */
#game-canvas {
  width: min(calc(100vw - 32px), calc(100vh - 160px), 600px);
  height: min(calc(100vw - 32px), calc(100vh - 160px), 600px);
  touch-action: none; /* 防止滑動干擾 */
}

/* 手機字體調整 */
@media (max-width: 480px) {
  .title { font-size: 36px; }
  .btn-primary { font-size: 22px; min-height: 60px; padding: 14px 28px; }
  .btn-secondary { font-size: 18px; min-height: 54px; }
  .info-bar { font-size: 16px; }
}

/* 平板調整 */
@media (min-width: 481px) and (max-width: 767px) {
  .title { font-size: 44px; }
  .btn-primary { font-size: 24px; min-height: 58px; }
}

/* 桌機 */
@media (min-width: 768px) {
  .title { font-size: 56px; }
  .btn-primary { font-size: 26px; min-height: 64px; }
}
```

### 9.3 觸控事件處理

棋盤落子同時支援滑鼠點擊與觸控：

```javascript
function bindBoardEvents(canvas, onMove) {
  // 將座標轉換為棋盤格點
  function getGridPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    // 找最近的交叉點
    const padding = canvas.width / 14;
    const cellSize = (canvas.width - padding * 2) / 14;
    const col = Math.round((x - padding) / cellSize);
    const row = Math.round((y - padding) / cellSize);
    if (col >= 0 && col < 15 && row >= 0 && row < 15) return { row, col };
    return null;
  }

  canvas.addEventListener('click', (e) => {
    const pos = getGridPos(e.clientX, e.clientY);
    if (pos) onMove(pos);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const pos = getGridPos(touch.clientX, touch.clientY);
    if (pos) onMove(pos);
  }, { passive: false });
}
```

### 9.4 手機體驗優化

- 禁用頁面縮放：`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
- 禁止長按選取文字：`user-select: none`
- 底部安全區域適配：`padding-bottom: env(safe-area-inset-bottom)`
- 落子後提供視覺回饋（0.1s 縮放動畫）增強觸控感

---

## 10. 遊戲流程狀態機

```
┌─────────────┐
│  MAIN_MENU  │ ←───────────────────────────────┐
└──────┬──────┘                                  │
       │ 按「開始遊戲」                           │ 按「回主畫面」
       ▼                                         │
┌─────────────┐   按「⏸」   ┌────────────┐       │
│   PLAYING   │ ──────────► │   PAUSED   │       │
│  （玩家輪）  │ ◄────────── │            │       │
└──────┬──────┘  按「繼續」  └─────┬──────┘       │
       │                          │ 按「重新開始」  │
       │ 玩家落子                  ▼               │
       ▼                   ┌─────────────┐        │
┌─────────────┐            │ GAME_RESET  │        │
│  AI_THINKING│            └─────────────┘        │
└──────┬──────┘                                   │
       │ AI 落子完成                              │
       ▼                                         │
┌─────────────┐                                  │
│  CHECK_WIN  │                                  │
└──────┬──────┘                                  │
       │                                         │
       ├── 有人獲勝 / 平局 ──►┌─────────────┐    │
       │                     │   RESULT    │ ───┘
       └── 繼續對局 ──────────┤（勝/負/平） │
                              └─────────────┘
```

### 10.1 狀態轉換表

| 當前狀態 | 事件 | 下一狀態 | 動作 |
|---------|------|---------|------|
| `MAIN_MENU` | 按開始 | `PLAYING` | 初始化棋盤、播放 BGM |
| `MAIN_MENU` | 按設定 | `SETTINGS` | 顯示設定畫面 |
| `PLAYING` | 玩家落子 | `AI_THINKING` | 驗證合法性、繪製棋子、播放音效 |
| `PLAYING` | 按暫停 | `PAUSED` | 顯示暫停彈窗 |
| `AI_THINKING` | AI 計算完成 | `CHECK_WIN` | 繪製 AI 棋子、播放音效 |
| `CHECK_WIN` | 有人勝出 | `RESULT` | 播放勝負音效、顯示結果畫面 |
| `CHECK_WIN` | 棋盤未滿 | `PLAYING` | 更新輪次顯示 |
| `CHECK_WIN` | 棋盤滿 | `RESULT` | 平局處理 |
| `RESULT` | 按再來一局 | `PLAYING` | 重置棋盤 |
| `RESULT` | 按回主畫面 | `MAIN_MENU` | 停止 BGM、清除棋盤 |
| `PAUSED` | 按繼續 | `PLAYING` | 隱藏彈窗 |
| `PAUSED` | 按重新開始 | `PLAYING` | 重置棋盤 |
| `PAUSED` | 按離開 | `MAIN_MENU` | 停止 BGM |

---

## 11. 資料結構定義

### 11.1 棋盤狀態

```javascript
/**
 * @type {number[][]} - 15×15 二維陣列
 * 值：0=空格, 1=黑棋(玩家), 2=白棋(AI)
 */
const board = Array.from({ length: 15 }, () => new Array(15).fill(0));
```

### 11.2 遊戲狀態物件

```javascript
const gameState = {
  board: [],              // number[][]
  currentPlayer: 1,       // 1=黑(玩家), 2=白(AI)
  status: 'PLAYING',      // GameStatus enum
  moveHistory: [],        // Array<{ row, col, player }>
  undoCount: 3,           // 剩餘悔棋次數
  startTime: Date.now(),  // 對局開始時間戳
  moveCount: 0,           // 總手數
  winner: null,           // null | 1 | 2 | 'draw'
};
```

### 11.3 設定物件

```javascript
/**
 * @typedef {Object} Settings
 * @property {'easy'|'normal'|'hard'} difficulty
 * @property {number} bgmVolume - 0.0 ~ 1.0
 * @property {number} sfxVolume - 0.0 ~ 1.0
 * @property {'light'|'dark'} theme
 */
```

### 11.4 落子記錄

```javascript
/**
 * @typedef {Object} MoveRecord
 * @property {number} row    - 0 ~ 14
 * @property {number} col    - 0 ~ 14
 * @property {number} player - 1 或 2
 * @property {number} time   - performance.now() 時間戳
 */
```

---

## 12. 模組介面規格

### 12.1 GameLogic

```javascript
const GameLogic = {
  init(settings),                          // 初始化新局
  placeStone(row, col),                    // 玩家落子，回傳 { success, winner }
  undoLastMove(),                          // 悔棋，回傳是否成功
  getCurrentState(),                       // 回傳 gameState 快照
  getElapsedTime(),                        // 回傳對局秒數
};
```

### 12.2 AIEngine

```javascript
const AIEngine = {
  async getMove(board, difficulty),        // 回傳 Promise<{ row, col }>
  evaluate(board, player),                 // 回傳評估分數（供測試用）
  getCandidates(board),                    // 回傳候選落子點陣列
};
```

### 12.3 BoardView

```javascript
const BoardView = {
  init(canvasElement),                     // 綁定 Canvas
  render(board, lastMove, theme),          // 完整重繪棋盤
  animateStone(row, col, player, cb),      // 落子動畫，完成後呼叫 cb
  highlightWin(winCells),                  // 標記獲勝連線（閃爍動畫）
  showThinking(row, col),                  // 顯示 AI 思考游標
};
```

### 12.4 AudioManager

```javascript
const AudioManager = {
  init(),                                  // 建立 AudioContext
  startBGM(),                              // 開始背景音樂
  stopBGM(),                               // 停止背景音樂
  play(sfxId),                             // 播放指定音效
  setBGMVolume(value),                     // 設定 BGM 音量 0~1
  setSFXVolume(value),                     // 設定音效音量 0~1
};
```

### 12.5 UI（畫面管理）

```javascript
const UI = {
  showScreen(screenId),                    // 切換畫面
  updateInfoBar(gameState),                // 更新頂部資訊列
  showResultScreen(winner, stats),         // 顯示結果畫面
  showToast(message, duration),            // 顯示短暫提示（如「非法落子」）
  setUndoCount(count),                     // 更新悔棋次數顯示
};
```

---

## 13. 錯誤處理

| 情境 | 處理方式 |
|------|---------|
| 點擊已有棋子的格 | 播放 `sfx_invalid`，顯示 Toast「此格已有棋子」|
| 點擊棋盤邊界外 | 忽略，不作任何回應 |
| AI 計算超時（>5s） | 強制 fallback 至最近未佔用中心格，並 console.warn |
| localStorage 不可用 | 靜默使用記憶體中的預設設定 |
| AudioContext 被 suspend | 監聽 visibilitychange，重新 resume |
| 頁面返回前景 | 自動恢復 BGM 播放 |

---

## 14. 可擴充性備注

下列功能本版本不實作，但設計上已預留擴充空間：

| 功能 | 預留方式 |
|------|---------|
| 雙人對戰 | `currentPlayer` 切換邏輯獨立，只需停用 AI 呼叫 |
| 線上對戰 | 落子透過 `GameLogic.placeStone()` 統一介面，可替換為 WebSocket 呼叫 |
| 棋局存檔 | `moveHistory` 已記錄完整落子序列，序列化後可存 localStorage |
| 複盤回放 | 讀取 `moveHistory`，依序呼叫 `BoardView.animateStone()` |
| 自訂棋盤大小 | Canvas 繪製使用 `cellSize` 變數，只需修改常數 `BOARD_SIZE` |
| 自訂背景音樂 | 替換 `startBGM()` 中的音符陣列，或接入 Base64 音檔 |
| 禁手規則（黑棋） | 在 `placeStone()` 前加入禁手檢查函數 |

---

*本規格書版本 1.0.0，依此規格實作的 `index.html` 應可在不依賴任何外部工具的情況下，於所有現代瀏覽器直接開啟並遊玩。*
