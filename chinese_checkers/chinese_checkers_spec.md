# 中國跳棋 — 純前端完整規格書

**版本：** 1.0.0  
**文件類型：** 前端技術規格書  
**目標平台：** 桌面瀏覽器 / 行動裝置瀏覽器（無需伺服器、無需 build）  
**入口：** 雙擊 `index.html` 即可直接在瀏覽器開啟遊玩

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [檔案結構](#2-檔案結構)
3. [技術棧與限制](#3-技術棧與限制)
4. [遊戲模式](#4-遊戲模式)
5. [棋盤規格](#5-棋盤規格)
6. [玩家與 AI 設定](#6-玩家與-ai-設定)
7. [仇恨值系統](#7-仇恨值系統)
8. [移動規則引擎](#8-移動規則引擎)
9. [AI 演算法](#9-ai-演算法)
10. [UI / UX 規格](#10-ui--ux-規格)
11. [音樂與音效系統](#11-音樂與音效系統)
12. [行動裝置適配](#12-行動裝置適配)
13. [設定系統](#13-設定系統)
14. [勝負判定](#14-勝負判定)
15. [畫面流程](#15-畫面流程)
16. [程式碼架構](#16-程式碼架構)
17. [資源清單](#17-資源清單)
18. [完整 HTML 範本骨架](#18-完整-html-範本骨架)

---

## 1. 專案概覽

### 1.1 專案目標

製作一款完全離線、無需任何後端或建置工具的中國跳棋遊戲，玩家可直接在本機開啟 `index.html` 遊玩。支援 1 名真人玩家對抗最多 3 個 AI，共提供兩種遊戲模式。

### 1.2 核心特色

| 特色 | 說明 |
|------|------|
| 零依賴部署 | 單一 `index.html` 內嵌所有 CSS、JS、SVG；音效以 Web Audio API 程式生成 |
| 兩種遊戲模式 | 「跳家模式」與「吃棋模式」，開局前選擇 |
| 1 vs AI | 1 名真人 + 1～3 名 AI，共 2～4 人對局 |
| 仇恨值系統 | 大混戰下影響 AI 攻擊目標優先順序 |
| 行動裝置友善 | 觸控支援、大字體、響應式棋盤 |
| 音樂 + 音效 | 背景音樂與操作音效均以 Web Audio API 即時合成，無需外部音檔 |

---

## 2. 檔案結構

```
project-root/
└── index.html          ← 唯一入口，所有程式碼內嵌於此
```

> **重要限制：** 所有 CSS、JavaScript、音效合成邏輯全部內嵌於 `index.html` 的 `<style>` 與 `<script>` 標籤內。不得依賴任何本機讀取限制會觸發的外部資源（如 `file://` 協定下的 ES Module import 或 fetch）。

---

## 3. 技術棧與限制

### 3.1 使用技術

| 層級 | 技術 |
|------|------|
| 標記 | HTML5 |
| 樣式 | CSS3（Flexbox、Grid、CSS 自訂屬性、媒體查詢） |
| 繪圖 | HTML5 Canvas 2D API |
| 邏輯 | 原生 ES6+ JavaScript（無框架） |
| 音效 | Web Audio API（程式合成，不依賴外部音檔） |
| 字型 | Google Fonts CDN（`Noto Sans TC`）；離線備用：`system-ui, sans-serif` |

### 3.2 瀏覽器相容性目標

- Chrome 90+
- Safari 14+（iOS / macOS）
- Firefox 88+
- Edge 90+

### 3.3 禁用項目

- 不使用任何 npm 套件或 CDN JS 框架（React、Vue 等）
- 不使用 ES Module（`type="module"`）——`file://` 協定下有 CORS 限制
- 不使用 `fetch()` 或 `XMLHttpRequest` 讀取本機資源
- 不使用 `localStorage`（離線模式可選）

---

## 4. 遊戲模式

### 4.1 模式一：跳家模式（Homecoming）

**目標：** 將自己所有棋子從起始三角區移動到對面的目標三角區，先完成者獲勝。

**規則摘要：**

- 棋子可向任意方向移動一格至空格
- 棋子可跳越相鄰棋子（任何顏色）至對面空格，且可連續跳躍
- 跳躍不吃子，跳越的棋子保持原位
- 最先將所有棋子填滿目標區的玩家獲勝

**仇恨值觸發情境：** 長期霸佔他人目標區、大幅領先時仇恨值上升

### 4.2 模式二：吃棋模式（Capture）

**目標：** 吃光對手的所有棋子，最後剩下棋子者獲勝；多人局中最後存活者勝。

**規則摘要：**

- 棋子可向任意方向移動一格至空格
- 跳越對方棋子時，**強制吃子**（被跳越的棋子移除）
- 跳越己方棋子時，不吃子（純跳躍）
- 支援連續跳躍；連跳過程中每跳過一顆對方棋子就吃一顆
- 某顏色棋子全部被吃光，該玩家淘汰
- 最後存活玩家獲勝

**仇恨值觸發情境：** 每次吃子會大幅提升仇恨值；棋子數量多時仇恨值偏高

---

## 5. 棋盤規格

### 5.1 棋盤形狀

標準六芒星（Star of David）型中國跳棋棋盤，共 **121 個節點**，排列於六芒星網格上。

```
六芒星各頂點三角區（10 格）分配：
  ▲ 藍（2 號位）
◤   ◥
綠    黃
◣   ◢
  ▼ 紅（1 號位 / 真人）
  
4 人局時啟用：上下左右四個三角區
2 人局：對角兩個三角區
```

### 5.2 座標系統

使用 **軸向座標（Axial Coordinates）**：`(q, r)`

- 所有合法節點預先計算並存入 `Set<string>`（格式：`"q,r"`）
- 每個節點記錄：`{ q, r, piece: null | { color, playerId } }`

### 5.3 Canvas 繪圖參數

| 參數 | 桌面 | 行動 |
|------|------|------|
| Canvas 尺寸 | `min(window.innerWidth * 0.7, 600)` px | `window.innerWidth * 0.96` px |
| 節點半徑（空格） | 10 px | 8 px |
| 棋子半徑 | 13 px | 11 px |
| 選取高亮環寬 | 3 px | 2.5 px |
| 可移動提示環 | 虛線圓，半徑 14 px | 虛線圓，半徑 12 px |

### 5.4 各顏色起始區定義（軸向座標）

```javascript
const START_ZONES = {
  red:    [ /* 下方三角 10 格 */ ],
  blue:   [ /* 上方三角 10 格 */ ],
  green:  [ /* 左下三角 10 格 */ ],
  yellow: [ /* 右上三角 10 格 */ ],
};

const TARGET_ZONES = {
  red:    START_ZONES.blue,
  blue:   START_ZONES.red,
  green:  START_ZONES.yellow,
  yellow: START_ZONES.green,
};
```

---

## 6. 玩家與 AI 設定

### 6.1 玩家配置

| 玩家數 | 人類 | AI |
|--------|------|----|
| 2 人局 | 1 | 1 |
| 3 人局 | 1 | 2 |
| 4 人局 | 1 | 3 |

### 6.2 AI 難度等級

| 難度 | 搜尋深度 | 思考延遲 | 說明 |
|------|----------|----------|------|
| 簡單 | 1 | 800 ms | 貪婪最短路徑 |
| 普通 | 2 | 600 ms | 含簡單對手阻擋 |
| 困難 | 3 | 400 ms | Minimax + 仇恨值加權 |

### 6.3 玩家顏色對照

| 位置 | 顏色 | 預設名稱 |
|------|------|----------|
| 1（人類） | 🔴 紅 | 玩家 |
| 2 | 🔵 藍 | AI 甲 |
| 3 | 🟢 綠 | AI 乙 |
| 4 | 🟡 黃 | AI 丙 |

---

## 7. 仇恨值系統

仇恨值（Aggro）僅在 **3～4 人局**中啟用，影響 AI 的攻擊目標選擇。

### 7.1 仇恨值資料結構

```javascript
const aggro = {
  red:    0,  // 真人玩家
  blue:   0,
  green:  0,
  yellow: 0,
};
// 範圍：0 ~ 100（整數）
```

### 7.2 仇恨值增減規則

#### 跳家模式

| 事件 | 仇恨變化 |
|------|----------|
| 棋子進入目標區 1 格 | `+3` |
| 佔據對手目標區格子 | `+5`（每格每回合） |
| 全部棋子超過半數在目標區 | `+10`（持續） |
| 落後超過 5 格差距 | `-2`（同情值下降） |

#### 吃棋模式

| 事件 | 仇恨變化 |
|------|----------|
| 吃掉他人棋子 1 顆 | `+8` |
| 連跳吃子（每多一顆） | `+5` |
| 棋子數量比他人多 3 顆以上 | `+6`（持續） |
| 被吃棋子 | `-3` |

### 7.3 AI 目標選擇邏輯

```
AI 攻擊目標優先順序：
  1. 仇恨值最高的玩家（>= 閾值 30）
  2. 距離勝利最近的玩家
  3. 目前回合移動評分最高的目標
  
攻擊傾向計算：
  targetScore = aggro[target] * 0.6 + winProximity[target] * 0.4
```

### 7.4 仇恨值 UI 顯示

- 每位玩家名稱旁顯示仇恨條（彩色進度條，0～100）
- 仇恨值 >= 70 時，條變紅色並閃爍
- 仇恨值 >= 30 時顯示小火焰圖示（純 CSS/Unicode）
- 2 人局不顯示仇恨值 UI

---

## 8. 移動規則引擎

### 8.1 合法移動計算函式

```javascript
/**
 * 取得指定棋子的所有合法目標格
 * @param {string} pos       - 起始格 "q,r"
 * @param {Board}  board     - 當前棋盤狀態
 * @param {string} mode      - 'homecoming' | 'capture'
 * @param {boolean} chainOnly - 連跳模式（只允許繼續跳）
 * @returns {string[]}       - 合法目標格陣列
 */
function getLegalMoves(pos, board, mode, chainOnly) { ... }
```

### 8.2 鄰格方向（六芒星軸向）

```javascript
const HEX_DIRECTIONS = [
  [+1, 0], [-1, 0],
  [0, +1], [0, -1],
  [+1, -1], [-1, +1],
];
```

### 8.3 跳躍判定流程

```
對每個方向 (dq, dr)：
  鄰格 mid = (q+dq, r+dr)
  落點 land = (q+2*dq, r+2*dr)
  
  if mid 有棋子 AND land 是合法格 AND land 為空：
    if mode === 'capture' AND mid 是敵方棋子：
      → 記錄為「吃子跳」
    else：
      → 記錄為「普通跳」
    → 加入合法移動，並遞迴計算連跳（已訪問格除外）
```

### 8.4 連跳規則

- 連跳在同一回合內完成，玩家可選擇中途停止（吃棋模式：若有吃子路徑則**強制**繼續）
- 最大連跳深度：`10`（防止無窮迴圈）
- 跳過的己方棋子不吃，不計入連跳結束條件

---

## 9. AI 演算法

### 9.1 評估函式（跳家模式）

```javascript
function evaluateHomecoming(board, playerId) {
  let score = 0;
  const pieces = getPieces(board, playerId);
  
  pieces.forEach(pos => {
    // 到目標區中心的距離（越小越好）
    score -= hexDistance(pos, TARGET_CENTER[playerId]);
    // 棋子已在目標區加分
    if (TARGET_ZONES[playerId].includes(pos)) score += 20;
  });
  
  // 仇恨值懲罰（AI 傾向攻擊仇恨值高者）
  score -= aggro[playerId] * 0.5;
  
  return score;
}
```

### 9.2 評估函式（吃棋模式）

```javascript
function evaluateCapture(board, playerId) {
  const myCount   = getPieces(board, playerId).length;
  const maxEnemy  = Math.max(...opponents.map(id => getPieces(board, id).length));
  
  let score = myCount * 10 - maxEnemy * 5;
  score += aggro[highestAggroOpponent] * 0.8; // 優先攻擊仇恨高者
  
  return score;
}
```

### 9.3 Minimax（困難難度）

```javascript
function minimax(board, depth, maximizing, playerId, alpha, beta) {
  if (depth === 0 || isGameOver(board)) {
    return evaluate(board, playerId);
  }
  // Alpha-Beta 剪枝標準實作
  // 每層只展開前 N 個最佳候選移動（beam = 8）
}
```

### 9.4 AI 回合執行流程

```
1. 計算所有棋子的合法移動（最多展開 beam=8 個候選）
2. 根據難度選擇搜尋深度
3. 考量仇恨值，調整目標優先順序
4. 選出最高分移動
5. 加入 setTimeout 模擬「思考」延遲
6. 執行移動 → 更新棋盤 → 更新仇恨值 → 切換回合
```

---

## 10. UI / UX 規格

### 10.1 畫面列表

| 畫面 ID | 名稱 | 說明 |
|---------|------|------|
| `#screen-title` | 主畫面 | 遊戲標題、開始按鈕、設定按鈕 |
| `#screen-setup` | 遊戲設定 | 模式選擇、玩家數、AI 難度 |
| `#screen-game` | 遊戲畫面 | 棋盤、玩家資訊列、操作提示 |
| `#screen-result` | 結果畫面 | 勝利動畫、統計、再玩按鈕 |
| `#screen-settings` | 設定面板 | 音量、字體大小、深色模式 |

### 10.2 字體規格

```css
/* 全域字體 */
body {
  font-family: 'Noto Sans TC', system-ui, sans-serif;
  font-size: 18px;           /* 基礎字體（大於一般 16px） */
  line-height: 1.7;
}

/* 主畫面標題 */
#screen-title h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* 按鈕文字 */
.btn {
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  padding: 0.75em 2em;
  min-height: 52px;          /* 觸控友善最小高度 */
}

/* 玩家資訊列 */
.player-info {
  font-size: clamp(0.95rem, 3vw, 1.15rem);
}

/* 操作提示 */
#hint-bar {
  font-size: clamp(1rem, 3.5vw, 1.2rem);
}

/* 設定面板標籤 */
.settings-label {
  font-size: clamp(1rem, 3.5vw, 1.25rem);
}
```

### 10.3 色彩系統

```css
:root {
  --color-bg:          #F5F0E8;
  --color-surface:     #FFFFFF;
  --color-border:      rgba(0,0,0,0.12);
  --color-primary:     #4A3728;
  --color-accent:      #C0874F;

  --color-red:         #D85A30;
  --color-blue:        #378ADD;
  --color-green:       #3B9E4F;
  --color-yellow:      #D4A017;

  --color-aggro-low:   #5B9E6F;
  --color-aggro-mid:   #E0A030;
  --color-aggro-high:  #D84040;

  --radius-btn:        12px;
  --radius-card:       16px;
  --shadow-card:       0 2px 12px rgba(0,0,0,0.10);
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      #1A1612;
    --color-surface: #2A2420;
    --color-primary: #E8DDD0;
    --color-accent:  #D4A060;
  }
}
```

### 10.4 主畫面設計規格

```
┌──────────────────────────────────┐
│                                  │
│    🎯  中國跳棋                   │  ← h1，超大字
│    Chinese Checkers               │  ← 副標，灰色
│                                  │
│  ┌────────────────────────────┐  │
│  │       🎮  開始遊戲          │  │  ← 主按鈕，大
│  └────────────────────────────┘  │
│                                  │
│  ┌──────────┐  ┌──────────────┐  │
│  │  ⚙️ 設定  │  │  📖 規則說明 │  │  ← 次要按鈕
│  └──────────┘  └──────────────┘  │
│                                  │
│  🔊 ─────────●────  音量 70%    │  ← 快速音量
└──────────────────────────────────┘
```

### 10.5 遊戲畫面佈局

```
┌──────────────────────────────────┐
│ [回主選單]   中國跳棋  [設定] [?] │  ← 頂部導航列
├──────────────────────────────────┤
│ ❤️ 玩家  ████░░ 仇恨:45  棋:10  │  ← 玩家資訊列
│ 🤖 AI甲  ██████ 仇恨:72🔥 棋:8  │
│ ...                              │
├──────────────────────────────────┤
│                                  │
│         ╔══════════╗             │
│         ║  棋  盤  ║             │  ← Canvas（佔最大空間）
│         ╚══════════╝             │
│                                  │
├──────────────────────────────────┤
│  💬 點選棋子，再點目標格移動      │  ← 操作提示列
│  [放棄連跳]                      │  ← 連跳時顯示
└──────────────────────────────────┘
```

---

## 11. 音樂與音效系統

所有音效與背景音樂使用 **Web Audio API** 即時合成，不依賴外部音檔。

### 11.1 AudioContext 初始化

```javascript
let audioCtx = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
```

> 注意：必須在使用者互動（點擊/觸控）後才能啟動 AudioContext，以符合瀏覽器政策。

### 11.2 背景音樂（程式生成）

使用**多層疊加**的低頻振盪器合成東方風格背景音：

```javascript
function playBGM() {
  ensureAudioCtx();
  
  // 五聲音階基礎音序：C D E G A
  const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00];
  
  // 層 1：主旋律（三角波，低音量）
  // 層 2：持續和弦底音（正弦波）
  // 層 3：隨機裝飾音（短脈衝）
  
  // 使用 GainNode 控制整體音量
  bgmGain = audioCtx.createGain();
  bgmGain.gain.value = settings.musicVolume * 0.3;
  bgmGain.connect(audioCtx.destination);
  
  scheduleMelody(); // 使用 audioCtx.currentTime 排程音符
}
```

### 11.3 音效列表

| 事件 | 音效類型 | 頻率 | 時長 |
|------|----------|------|------|
| 選取棋子 | 短促正弦 | 880 Hz | 80 ms |
| 移動棋子 | 木質叩擊（褐色噪聲 + 低通） | — | 120 ms |
| 跳越棋子 | 上升音調 | 440 → 660 Hz | 200 ms |
| 吃子 | 撞擊聲（帶 envelope） | 200 Hz + 衰減 | 300 ms |
| 連跳（每跳） | 遞進上升音 | +50 Hz 每跳 | 150 ms |
| 回合結束 | 輕鐘聲 | 1047 Hz | 400 ms |
| 勝利 | 上升琶音 | 五聲音階上行 | 1200 ms |
| 落敗 | 下降悲鳴 | 440 → 220 Hz | 800 ms |
| 按鈕點擊 | 輕觸音 | 660 Hz | 60 ms |
| 仇恨值超過 70 | 低沉警示音 | 110 Hz pulse | 500 ms |

### 11.4 音效合成範例（移動棋子）

```javascript
function sfxMove() {
  ensureAudioCtx();
  
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.12, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  
  // 褐色噪聲
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  
  const source = audioCtx.createBufferSource();
  source.buffer = buf;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(settings.sfxVolume * 0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
  
  source.connect(filter).connect(gain).connect(audioCtx.destination);
  source.start();
}
```

### 11.5 音量控制

```javascript
const settings = {
  musicVolume: 0.7,   // 0.0 ~ 1.0
  sfxVolume:   0.8,   // 0.0 ~ 1.0
  musicMuted:  false,
  sfxMuted:    false,
};
```

---

## 12. 行動裝置適配

### 12.1 Viewport 設定

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

### 12.2 Canvas 觸控事件

```javascript
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top)  * scaleY;
  handleClick(x, y);
}, { passive: false });
```

### 12.3 響應式 Canvas 縮放

```javascript
function resizeCanvas() {
  const isMobile = window.innerWidth < 600;
  const size = isMobile
    ? Math.floor(window.innerWidth * 0.96)
    : Math.min(Math.floor(window.innerWidth * 0.65), 580);
  
  canvas.width  = size;
  canvas.height = size;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';
  
  recalcCellPositions(size);
  draw();
}

window.addEventListener('resize', debounce(resizeCanvas, 150));
```

### 12.4 行動裝置最小點擊區域

- 棋子點擊半徑：`max(節點半徑 * 2, 24px)`（確保觸控準確）
- 所有 UI 按鈕最小高度：`52px`
- 底部提示列固定高度：`64px`，避免被系統手勢條遮擋

### 12.5 Safe Area 支援

```css
#hint-bar {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}

#top-nav {
  padding-top: max(8px, env(safe-area-inset-top));
}
```

### 12.6 防止誤觸縮放

```css
body {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
```

---

## 13. 設定系統

### 13.1 設定項目

| 項目 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| 背景音樂音量 | slider 0–100 | 70 | 控制 BGM GainNode |
| 音效音量 | slider 0–100 | 80 | 控制 SFX gain |
| 靜音 BGM | toggle | false | — |
| 靜音音效 | toggle | false | — |
| 字體大小 | select S/M/L/XL | L | 調整 `font-size` 根元素 |
| 深色模式 | toggle | 系統值 | 覆蓋 `prefers-color-scheme` |
| AI 思考動畫 | toggle | true | 顯示/隱藏 AI 思考指示 |
| 顯示仇恨值 | toggle | true | 3–4 人局有效 |
| 棋子動畫 | toggle | true | 移動滑動動畫 |

### 13.2 字體大小等級

```javascript
const FONT_SCALES = {
  S:  '15px',
  M:  '17px',
  L:  '19px',   // 預設
  XL: '22px',
};

function applyFontSize(level) {
  document.documentElement.style.fontSize = FONT_SCALES[level];
}
```

### 13.3 設定持久化

使用 `localStorage` 儲存設定（離線模式下可用）：

```javascript
function saveSettings() {
  try {
    localStorage.setItem('cc_settings', JSON.stringify(settings));
  } catch(e) { /* 忽略私密模式限制 */ }
}

function loadSettings() {
  try {
    const s = localStorage.getItem('cc_settings');
    if (s) Object.assign(settings, JSON.parse(s));
  } catch(e) {}
}
```

---

## 14. 勝負判定

### 14.1 跳家模式

```javascript
function checkWinHomecoming(board, playerId) {
  const target = TARGET_ZONES[playerId];
  return target.every(pos => board[pos]?.piece?.playerId === playerId);
}
```

判定時機：每次移動後立即檢查當前玩家。

### 14.2 吃棋模式

```javascript
function checkEliminatedCapture(board, playerId) {
  return getPieces(board, playerId).length === 0;
}

function checkWinCapture(board) {
  const alive = PLAYERS.filter(p => getPieces(board, p).length > 0);
  return alive.length === 1 ? alive[0] : null;
}
```

判定時機：每次吃子後檢查被吃方是否淘汰。

### 14.3 勝利動畫

```
1. 播放勝利音效（琶音）
2. Canvas 上顯示彩色棋子爆炸粒子效果（純 Canvas 繪製）
3. 0.8 秒後淡入結果畫面
4. 顯示：勝者顏色、回合數、吃子/到達數統計
```

---

## 15. 畫面流程

```
[主畫面]
   │
   ├──[設定]──> [設定面板] ──> 返回
   │
   └──[開始遊戲]──> [遊戲設定畫面]
                         │
                    選擇：模式 / 玩家數 / AI難度
                         │
                    [開始] ──> [遊戲畫面]
                                   │
                         回合輪流進行
                         （人類輸入 / AI 自動）
                                   │
                              [勝負觸發]
                                   │
                             [結果畫面]
                                   │
                     ┌─────────────┴─────────┐
                  [再玩一局]              [回主選單]
                  （保留設定）
```

---

## 16. 程式碼架構

### 16.1 模組劃分（單一 JS 區塊內）

```javascript
// ─── 常數與設定 ───────────────────────
const BOARD_NODES = [ ... ];
const START_ZONES = { ... };
const TARGET_ZONES = { ... };

// ─── 遊戲狀態 ─────────────────────────
let gameState = {
  mode: null,          // 'homecoming' | 'capture'
  turn: 0,             // 當前回合玩家索引
  round: 0,            // 總回合數
  board: {},           // pos -> piece
  players: [],         // 玩家物件陣列
  aggro: {},           // 仇恨值
  selected: null,      // 已選棋子位置
  chainCell: null,     // 連跳中的當前位置
  phase: 'idle',       // 'idle' | 'selected' | 'chaining' | 'ai-thinking'
  gameOver: false,
};

// ─── 棋盤邏輯 ─────────────────────────
function getLegalMoves(pos, chainOnly) { ... }
function applyMove(from, to) { ... }
function undoMove(snapshot) { ... }

// ─── 仇恨值系統 ───────────────────────
function updateAggro(event, data) { ... }
function getAggroTarget(aiPlayerId) { ... }

// ─── AI 引擎 ──────────────────────────
function aiTakeTurn(playerId) { ... }
function evaluate(board, playerId) { ... }
function minimax(board, depth, alpha, beta, maximizing) { ... }

// ─── 音效系統 ─────────────────────────
const sfx = { move: sfxMove, eat: sfxEat, jump: sfxJump, win: sfxWin, ... };
function playBGM() { ... }
function stopBGM() { ... }

// ─── Canvas 繪圖 ──────────────────────
function draw() { ... }
function drawBoard() { ... }
function drawPieces() { ... }
function drawHighlights() { ... }
function drawAggroUI() { ... }

// ─── 輸入處理 ─────────────────────────
function handleClick(x, y) { ... }
function getClickedNode(x, y) { ... }

// ─── 畫面管理 ─────────────────────────
function showScreen(id) { ... }
function updateHintBar(msg) { ... }
function showResultScreen(winner) { ... }

// ─── 設定系統 ─────────────────────────
function applySettings() { ... }
function saveSettings() { ... }
function loadSettings() { ... }

// ─── 初始化 ───────────────────────────
function init() { loadSettings(); showScreen('title'); }
window.addEventListener('DOMContentLoaded', init);
```

### 16.2 遊戲主迴圈（回合制，事件驅動）

```
無持續性 requestAnimationFrame 主迴圈。
狀態變更由以下事件觸發：
  - 使用者點擊 / 觸控 Canvas
  - AI setTimeout 回呼
  - 動畫完成回呼

每次狀態變更後呼叫 draw() 重繪。
```

---

## 17. 資源清單

### 17.1 外部依賴（CDN，可選）

```html
<!-- Google Fonts - 若無法連線自動降級至系統字體 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
```

> 離線模式：`font-family` fallback 為 `system-ui, -apple-system, 'Microsoft JhengHei', sans-serif`，繁體中文顯示正常。

### 17.2 無圖片資源

所有圖示（棋子高光、箭頭、仇恨火焰）均以：
- Canvas 2D API 繪製
- Unicode 字元顯示（🔥 ⭐ ✓ ✗）
- 純 CSS 幾何形狀

---

## 18. 完整 HTML 範本骨架

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>中國跳棋</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    /* === 重置 & 全域 === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { /* CSS 自訂屬性（見 10.3） */ }
    body { font-family: 'Noto Sans TC', system-ui, sans-serif; font-size: 19px;
           background: var(--color-bg); color: var(--color-primary);
           touch-action: manipulation; user-select: none; min-height: 100dvh; }
    
    /* === 畫面容器 === */
    .screen { display: none; min-height: 100dvh; flex-direction: column; }
    .screen.active { display: flex; }
    
    /* === 主畫面 === */
    #screen-title { align-items: center; justify-content: center; gap: 2rem; text-align: center; padding: 2rem; }
    
    /* === 遊戲畫面 === */
    #screen-game { align-items: stretch; }
    #game-board-wrap { flex: 1; display: flex; align-items: center; justify-content: center; }
    #hint-bar { padding: 1rem; text-align: center; background: var(--color-surface); 
                padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
    
    /* === 按鈕 === */
    .btn { font-family: inherit; font-size: clamp(1.1rem, 4vw, 1.4rem);
           padding: 0.75em 2em; border-radius: 12px; border: 1.5px solid var(--color-border);
           background: var(--color-surface); color: var(--color-primary); cursor: pointer;
           min-height: 52px; transition: transform 0.1s, background 0.15s; }
    .btn:active { transform: scale(0.97); }
    .btn-primary { background: var(--color-accent); color: white; border-color: transparent; }
    
    /* === 仇恨條 === */
    .aggro-bar { height: 8px; border-radius: 4px; background: var(--color-border);
                 overflow: hidden; min-width: 80px; }
    .aggro-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    
    /* === 其他樣式略（依規格實作） === */
  </style>
</head>
<body>

  <!-- ① 主畫面 -->
  <div id="screen-title" class="screen active">
    <h1>中國跳棋</h1>
    <p style="color: var(--color-accent);">Chinese Checkers</p>
    <button class="btn btn-primary" onclick="showScreen('setup')">🎮 開始遊戲</button>
    <div style="display:flex; gap:1rem;">
      <button class="btn" onclick="showScreen('settings')">⚙️ 設定</button>
      <button class="btn" onclick="showRules()">📖 規則</button>
    </div>
    <div style="display:flex; align-items:center; gap:0.75rem; margin-top:1rem;">
      <span>🔊</span>
      <input type="range" id="quick-vol" min="0" max="100" value="70" oninput="quickVolume(this.value)">
    </div>
  </div>

  <!-- ② 遊戲設定畫面 -->
  <div id="screen-setup" class="screen">
    <!-- 模式選擇、玩家數、AI難度 -->
  </div>

  <!-- ③ 遊戲畫面 -->
  <div id="screen-game" class="screen">
    <nav id="top-nav"><!-- 返回、標題、設定按鈕 --></nav>
    <div id="players-bar"><!-- 玩家資訊 + 仇恨條 --></div>
    <div id="game-board-wrap">
      <canvas id="board"></canvas>
    </div>
    <div id="hint-bar">
      <span id="hint-text">點選棋子，再點目標格移動</span>
      <button id="btn-end-chain" class="btn" style="display:none" onclick="endChain()">結束連跳</button>
    </div>
  </div>

  <!-- ④ 結果畫面 -->
  <div id="screen-result" class="screen">
    <!-- 勝者資訊、統計、按鈕 -->
  </div>

  <!-- ⑤ 設定面板（overlay） -->
  <div id="screen-settings" class="screen">
    <!-- 各設定項目 -->
  </div>

  <script>
    // === 所有 JavaScript 內嵌於此 ===
    // 依第 16 節架構實作
    
    function init() {
      loadSettings();
      applySettings();
      showScreen('title');
    }
    
    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>
```

---

## 附錄 A：仇恨值視覺狀態對照

| 仇恨值範圍 | 進度條顏色 | 圖示 | AI 攻擊傾向 |
|------------|-----------|------|------------|
| 0 – 29 | 綠色 | — | 低 |
| 30 – 69 | 橙色 | 🔥 | 中 |
| 70 – 100 | 紅色（閃爍） | 🔥🔥 | 高（優先目標） |

---

## 附錄 B：測試清單

- [ ] `index.html` 在本機 `file://` 協定下可正常開啟
- [ ] 主畫面字體在手機上顯示 >= 19px
- [ ] 觸控點選棋子準確率 > 95%（真機測試）
- [ ] 2 / 3 / 4 人局皆可正常開始與結束
- [ ] 跳家模式勝利判定正確
- [ ] 吃棋模式淘汰判定正確
- [ ] AI 連跳不卡死（深度限制生效）
- [ ] 仇恨值 UI 僅在 3–4 人局顯示
- [ ] 音效在 iOS Safari 使用者互動後正常播放
- [ ] 橫屏模式版面不破版
- [ ] 深色模式自動切換正確

---

*文件結束 | 版本 1.0.0*
