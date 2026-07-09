# 中國暗棋 前端完整規格書

> **版本**：v1.0.0　｜　**目標平台**：桌機 / 平板 / 手機　｜　**技術棧**：純 HTML + CSS + JavaScript（無需任何建置工具或伺服器）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [檔案結構](#2-檔案結構)
3. [遊戲規則規格](#3-遊戲規則規格)
4. [介面設計規格](#4-介面設計規格)
5. [音效與音樂規格](#5-音效與音樂規格)
6. [AI 演算法規格](#6-ai-演算法規格)
7. [遊戲狀態管理](#7-遊戲狀態管理)
8. [元件規格](#8-元件規格)
9. [動畫與互動規格](#9-動畫與互動規格)
10. [響應式設計規格](#10-響應式設計規格)
11. [設定系統規格](#11-設定系統規格)
12. [程式碼架構規格](#12-程式碼架構規格)
13. [測試驗收標準](#13-測試驗收標準)

---

## 1. 專案概覽

### 1.1 目標

建立一款可直接點擊 `index.html` 執行的中國暗棋單機遊戲，玩家對戰 AI，支援桌機與行動裝置，含完整音樂、音效與設定介面。

### 1.2 技術約束

| 項目 | 規格 |
|------|------|
| 語言 | HTML5 + CSS3 + Vanilla JavaScript (ES6+) |
| 依賴 | **零外部依賴**，無需 npm / node / build |
| 音效產生 | Web Audio API（程式合成，無需音訊檔案） |
| 字型 | Google Fonts CDN（可離線 fallback） |
| 儲存 | localStorage（儲存設定與最佳記錄） |
| 入口 | 雙擊 `index.html` 即可遊玩 |

### 1.3 支援瀏覽器

- Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- iOS Safari 14+、Android Chrome 90+

---

## 2. 檔案結構

```
chinese-dark-chess/
├── index.html          # 唯一入口，包含全部邏輯與樣式
└── README.md           # （選配）簡易說明
```

> **架構決策**：所有 CSS、JavaScript、SVG 圖形均內嵌於單一 `index.html`，確保離線可用且零配置開啟。

---

## 3. 遊戲規則規格

### 3.1 棋盤

- 4 列 × 8 行，共 **32 格**
- 每格有且僅有一枚棋子（初始全部蓋臉朝下）

### 3.2 棋子種類與數量

| 棋子 | 中文 | 紅方數量 | 黑方數量 | 強度等級 |
|------|------|---------|---------|---------|
| 將/帥 | 將（黑）/ 帥（紅） | 1 | 1 | 6 |
| 車 | 車 | 2 | 2 | 5 |
| 馬 | 馬 | 2 | 2 | 4 |
| 炮 | 炮 | 2 | 2 | 3（特殊） |
| 相/象 | 相（紅）/ 象（黑） | 2 | 2 | 2 |
| 士/仕 | 仕（紅）/ 士（黑） | 2 | 2 | 1 |
| 兵/卒 | 兵（紅）/ 卒（黑） | 5 | 5 | 0 |

**合計**：每方 16 枚，共 32 枚。

### 3.3 翻牌規則

- 玩家點擊任意蓋臉棋子，該棋子翻開（**不算移動**）
- 第一個翻開的棋子決定玩家陣營（紅或黑）
- AI 自動取得另一方陣營

### 3.4 移動規則

- 翻開的棋子每回合可向上下左右相鄰格移動一格
- 不可斜移、不可跳格（炮例外）
- 目標格：
  - **空格**：合法移動
  - **己方棋子**：非法，不可覆蓋
  - **對方棋子**：若可吃則吃，否則非法

### 3.5 吃子規則（強弱關係）

```
帥/將 > 車 > 馬 > 炮（一般吃） > 相/象 > 仕/士 > 兵/卒 > 帥/將（循環）
```

- **強度高** 可吃 **強度低** 或同等
- **兵/卒** 可吃 **帥/將**（特殊循環規則）
- **帥/將** 無法吃 **兵/卒**
- **蓋臉棋子** 不可被吃，不可被移動至其上

#### 炮的特殊吃子規則

- 炮**移動**：同一般棋子，一格一格
- 炮**吃子**：必須「隔一枚棋子（砲架，紅黑皆可）」才能吃到對面的棋子
  - 炮與目標之間 **恰好一枚** 任意棋子（翻開或未翻開均可作為砲架）
  - 炮吃子時強弱規則照常適用
  - 炮不可直接移至炮架位置進行吃子（必須水平或垂直直線）

### 3.6 勝負判定

| 條件 | 結果 |
|------|------|
| 對方棋子全部被吃光 | 己方勝 |
| 己方棋子全部被吃光 | 對方勝 |
| 某方無法行動（被困死） | 該方負 |
| （選配）雙方各翻開後超過 60 步無吃子 | 平局 |

---

## 4. 介面設計規格

### 4.1 視覺主題

- **風格**：古典水墨 × 現代扁平，深棕/金色調
- **主色票**：

| 變數名 | 色碼 | 用途 |
|--------|------|------|
| `--bg-main` | `#1a0f0a` | 主背景 |
| `--bg-board` | `#8B4513` | 棋盤底色 |
| `--bg-cell` | `#D2A679` | 格子底色 |
| `--color-red` | `#DC143C` | 紅方棋子 |
| `--color-black` | `#1C1C1C` | 黑方棋子 |
| `--color-gold` | `#FFD700` | 強調、選取框 |
| `--color-hidden` | `#5C3D1E` | 蓋臉棋子背面 |
| `--text-main` | `#F5E6D3` | 主要文字 |

### 4.2 字體規格

```css
/* 主標題 */
font-family: 'Noto Serif TC', 'STSong', serif;
font-size: clamp(2rem, 6vw, 4rem);

/* 棋子文字 */
font-family: 'Noto Serif TC', 'STSong', serif;
font-size: clamp(1.4rem, 4vw, 2.2rem);
font-weight: 700;

/* UI 按鈕文字 */
font-family: 'Noto Serif TC', serif;
font-size: clamp(1rem, 2.5vw, 1.4rem);

/* 狀態提示文字 */
font-size: clamp(1rem, 3vw, 1.3rem);
```

> 字體載入：`<link>` 引入 Google Fonts `Noto+Serif+TC:wght@400;700`，fallback 為 `'STSong', 'SimSun', serif`

### 4.3 畫面佈局（主遊戲畫面）

```
┌─────────────────────────────────┐
│  [🎵] [⚙] 中國暗棋              │  ← 頂部導覽列（高度 60px）
├─────────────────────────────────┤
│  回合：紅方　剩餘：紅16 黑16    │  ← 狀態列（高度 52px）
├─────────────────────────────────┤
│                                 │
│   ┌──────────────────────────┐  │
│   │  8×4 棋盤格              │  │  ← 棋盤區（正方格，置中）
│   │  （含棋子）              │  │
│   └──────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  [新局] [悔棋] [投降] [提和]    │  ← 操作按鈕列（高度 64px）
└─────────────────────────────────┘
```

### 4.4 棋子視覺規格

#### 蓋臉（未翻開）棋子

```
┌────────┐
│ ╔════╗ │  深棕色底
│ ║ 棋 ║ │  金色邊框
│ ╚════╝ │  中央顯示「棋」字樣
└────────┘
```

#### 翻開棋子

```
┌────────┐
│ ╔════╗ │  圓角方形
│ ║ 車 ║ │  紅/黑色字
│ ╚════╝ │  細邊框
└────────┘
```

#### 棋子狀態樣式

| 狀態 | 視覺效果 |
|------|---------|
| 預設 | 標準顯示 |
| Hover | 輕微放大 scale(1.05) + 金色發光 |
| 選中 | 金色 4px 框 + 跳動動畫 |
| 可移動目標 | 綠色圓點提示（選配，可在設定關閉） |
| 被吃 | 縮小消失動畫 |
| 翻開 | 翻轉 3D 動畫 |

---

## 5. 音效與音樂規格

> **實作方式**：全部使用 **Web Audio API** 程式合成，無需任何外部音訊檔案。

### 5.1 背景音樂

使用 Web Audio API 合成古風五聲音階（宮商角徵羽）循環旋律：

```javascript
// 五聲音階頻率（C 調）
const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C

// 實作要點
- OscillatorNode（類型：sine / triangle 混合）
- 音量包絡：緩慢淡入淡出（attack 0.5s, release 1s）
- BiquadFilterNode 低通濾波（模擬古琴音色）
- 旋律序列：隨機從五聲音階抽取，配合節拍循環
- 整體音量：-12dB（背景感）
- 無縫循環
```

### 5.2 音效列表

| 事件 | 音效描述 | Web Audio 合成方式 |
|------|---------|------------------|
| 翻牌 | 紙張翻動聲 | White noise + HPF + 短 envelope |
| 移動棋子 | 木頭輕敲聲 | Sine 220Hz + 快速 decay（50ms）|
| 吃子（一般） | 清脆碰撞聲 | Triangle 440Hz + 碰撞 noise blend |
| 炮吃子 | 砲擊爆裂聲 | Sawtooth + distortion + 短 reverb |
| 勝利 | 歡快五聲音階上行 | 依序播放 C-E-G-C 琶音 |
| 失敗 | 低沉下行音 | 依序播放 G-E-C 琶音 |
| 按鈕點擊 | 輕柔 tick | Sine 800Hz, 20ms |
| 非法操作 | 低音提示 | Sine 200Hz, 100ms + slight distort |
| 輪到玩家 | 提示音 | 兩聲短促高音 |
| AI 思考中 | 無音（或極輕環境音） | - |

### 5.3 音效控制

```javascript
// AudioContext 管理
- 首次用戶互動後初始化 AudioContext（瀏覽器政策）
- MasterGainNode 控制總音量
- BGM GainNode 獨立控制
- SFX GainNode 獨立控制
- 所有節點連接至 MasterGainNode → destination
```

---

## 6. AI 演算法規格

### 6.1 難度等級

| 等級 | 搜索深度 | 思考延遲 | 隨機性 |
|------|---------|---------|--------|
| 簡單 | 1 層 | 800ms | 30% 隨機選擇 |
| 普通 | 2 層 | 600ms | 10% 隨機選擇 |
| 困難 | 3 層 | 400ms | 0% 隨機 |

> 預設難度：**普通**

### 6.2 演算法：Minimax + Alpha-Beta 剪枝

```
function minimax(state, depth, alpha, beta, isMaximizing):
  if depth == 0 or gameOver(state):
    return evaluate(state)
  
  if isMaximizing:
    maxEval = -∞
    for each move in getLegalMoves(state, AI):
      eval = minimax(apply(move), depth-1, alpha, beta, false)
      maxEval = max(maxEval, eval)
      alpha = max(alpha, eval)
      if beta <= alpha: break  // 剪枝
    return maxEval
  else:
    minEval = +∞
    for each move in getLegalMoves(state, Player):
      eval = minimax(apply(move), depth-1, alpha, beta, true)
      minEval = min(minEval, eval)
      beta = min(beta, eval)
      if beta <= alpha: break  // 剪枝
    return minEval
```

### 6.3 局面評估函數

```javascript
function evaluate(state):
  score = 0
  
  // 1. 棋子價值評估
  score += materialScore(state)
  
  // 2. 機動性評估（可移動格數）
  score += mobilityScore(state) * 0.1
  
  // 3. 威脅評估（下一步可吃子）
  score += threatScore(state) * 0.3
  
  // 4. 位置評估（棋子在棋盤的位置加成）
  score += positionalScore(state) * 0.1
  
  return score
```

#### 棋子基礎分值

| 棋子 | 分值 |
|------|------|
| 帥/將 | 10000（遊戲結束判定） |
| 車 | 500 |
| 馬 | 300 |
| 炮 | 350 |
| 相/象 | 200 |
| 仕/士 | 150 |
| 兵/卒 | 100 |

### 6.4 翻牌策略

- **未知棋子翻牌評估**：以棋子期望值（所有未翻開棋子平均分值）計算
- 若翻牌可立即形成吃子機會，優先翻牌
- 否則根據位置評估選擇翻牌位置

### 6.5 AI 行動流程

```
1. 等待思考延遲（模擬思考感）
2. 收集所有合法動作（翻牌 + 移動/吃子）
3. 對每個動作執行 minimax 評估
4. 選擇最高分動作（含難度隨機性）
5. 執行動作並播放音效
6. 切換回玩家回合
```

---

## 7. 遊戲狀態管理

### 7.1 核心狀態物件

```javascript
const GameState = {
  // 棋盤
  board: Array(32),          // 索引 0-31，row-major order
  
  // 每格棋子
  // piece: { type, color, revealed } | null
  
  // 遊戲進行狀態
  phase: 'menu' | 'playing' | 'gameover',
  
  // 陣營
  playerColor: 'red' | 'black' | null,  // 第一翻決定
  aiColor: 'red' | 'black' | null,
  
  // 回合
  currentTurn: 'player' | 'ai',
  turnCount: 0,
  
  // 選取
  selectedCell: null | number,           // 格子索引
  
  // 記分
  capturedByPlayer: [],
  capturedByAI: [],
  
  // 無吃子計數（和棋判定）
  noCaptureTurns: 0,
  
  // 歷史（悔棋用）
  history: [],                           // 最多存 3 步
  
  // 設定
  settings: {
    difficulty: 'normal',
    bgmVolume: 0.5,
    sfxVolume: 0.8,
    showHints: true,
    animSpeed: 'normal'
  }
}
```

### 7.2 棋盤座標系統

```
格子索引（0-31），row-major：

  col: 0   1   2   3   4   5   6   7
row 0: [ 0] [ 1] [ 2] [ 3] [ 4] [ 5] [ 6] [ 7]
row 1: [ 8] [ 9] [10] [11] [12] [13] [14] [15]
row 2: [16] [17] [18] [19] [20] [21] [22] [23]
row 3: [24] [25] [26] [27] [28] [29] [30] [31]

座標轉換：
  index → (row, col) = (Math.floor(index/8), index%8)
  (row, col) → index = row*8 + col

相鄰格（上下左右）：
  上: index - 8（若 row > 0）
  下: index + 8（若 row < 3）
  左: index - 1（若 col > 0）
  右: index + 1（若 col < 7）
```

### 7.3 初始化流程

```
1. 建立 32 枚棋子（紅16 + 黑16）
2. 使用 Fisher-Yates shuffle 隨機排列
3. 全部設為 revealed: false
4. 填入 board 陣列
5. playerColor = null（待第一翻決定）
```

### 7.4 悔棋機制

- 最多可悔 **2 步**（玩家自身的 2 回合）
- 每次玩家行動前，將完整 state 深拷貝存入 history
- 悔棋時彈出最後一筆 history，還原狀態
- AI 的回合自動包含在玩家回合的同一個 history 快照內

---

## 8. 元件規格

### 8.1 主選單畫面（`#screen-menu`）

```
元件：
- 標題「中國暗棋」（大字，含水墨裝飾）
- 副標題「Dark Chess」（英文小字）
- [開始遊戲] 按鈕
- [設定] 按鈕
- [遊戲說明] 按鈕
- 版本號（右下角小字）

動畫：
- 進場：標題由上淡入，按鈕由下依序淡入（stagger 100ms）
- 背景：緩慢流動的水墨紋理（CSS animation）
```

### 8.2 設定畫面（`#screen-settings`）

```
元件：
- 標題「設定」
- 難度選擇：[簡單] [普通] [困難]（三選一）
- 背景音樂音量：滑桿（0-100）
- 音效音量：滑桿（0-100）
- 顯示提示：開關（toggle）
- 動畫速度：[慢] [正常] [快]
- [儲存並返回] 按鈕

字體大小：所有標籤 1.2rem+，滑桿觸控區域 44px+
```

### 8.3 說明畫面（`#screen-help`）

```
分頁式說明：
- Tab 1：基本操作（翻牌、移動）
- Tab 2：棋子強弱關係（可視化表格）
- Tab 3：炮的特殊規則（圖示說明）
- Tab 4：勝負規則

每頁有圖示輔助，文字 1.1rem+
```

### 8.4 遊戲畫面（`#screen-game`）

子元件：

#### 8.4.1 頂部列（`#top-bar`）
```
[🎵 靜音切換] [遊戲標題] [⚙ 設定]
高度：56px（行動：48px）
字體：1.1rem+
```

#### 8.4.2 狀態列（`#status-bar`）
```
[回合指示器] [玩家棋子數] [AI棋子數]

回合指示器：
- 「輪到你了」（玩家回合，金色亮起）
- 「AI 思考中...」（AI 回合，灰色＋旋轉點點動畫）

棋子數顯示：
- 「紅方：12」/ 「黑方：10」
- 數字隨棋子被吃更新
```

#### 8.4.3 棋盤（`#board`）
```
CSS Grid：8 columns × 4 rows
格子大小：min(calc((100vw - 32px) / 8), 80px)（行動優先）
棋盤邊框：木紋質感（CSS gradient 模擬）
格線：2px solid rgba(0,0,0,0.3)
格子點擊區域：整個格子（非僅棋子）
```

#### 8.4.4 棋子（`.piece`）
```
HTML 結構：
<div class="cell" data-index="N">
  <div class="piece [red|black|hidden] [selected|hint]" data-piece-id="X">
    <span class="piece-text">車</span>
  </div>
</div>

尺寸：格子的 85%
圓角：6px
陰影：0 2px 6px rgba(0,0,0,0.4)
```

#### 8.4.5 操作按鈕列（`#action-bar`）
```
[🔄 新局] [↩ 悔棋] [🏳 投降] [🤝 提和]

按鈕規格：
- 高度：52px（行動：56px）
- 字體：1.1rem
- 觸控安全邊距：8px 間隔
- 禁用狀態（灰色）：悔棋無歷史時、非玩家回合時
```

### 8.5 遊戲結束覆蓋層（`#overlay-gameover`）

```
半透明黑色遮罩
中央卡片：
- 結果大字「勝利！」/「敗北...」/「平局」
- 本局統計（回合數、吃子數）
- [再來一局] [回主選單] 按鈕

動畫：從中心縮放進場
```

---

## 9. 動畫與互動規格

### 9.1 翻牌動畫

```css
.piece.flip-animation {
  animation: flipCard 0.4s ease-in-out;
}

@keyframes flipCard {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(90deg); opacity: 0.3; }
  100% { transform: rotateY(0deg); opacity: 1; }
}
```

### 9.2 移動動畫

```javascript
// 棋子移動時：
// 1. 計算起點與終點的螢幕座標差值
// 2. 使用 CSS transform translate 動畫
// 3. 動畫結束後更新 DOM 位置

duration: 正常 250ms，快速 120ms，慢速 400ms
easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### 9.3 吃子動畫

```css
.piece.captured {
  animation: captureAnim 0.3s ease-out forwards;
}

@keyframes captureAnim {
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.3); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
}
```

### 9.4 選取動畫

```css
.piece.selected {
  animation: selectedPulse 0.8s ease-in-out infinite;
  border: 3px solid var(--color-gold);
  box-shadow: 0 0 12px var(--color-gold);
}

@keyframes selectedPulse {
  0%, 100% { box-shadow: 0 0 8px var(--color-gold); }
  50%      { box-shadow: 0 0 20px var(--color-gold); }
}
```

### 9.5 提示點動畫

```css
.cell.hint-dot::after {
  content: '';
  width: 12px; height: 12px;
  background: rgba(0, 200, 100, 0.7);
  border-radius: 50%;
  animation: hintPulse 1s ease-in-out infinite;
}
```

### 9.6 AI 思考動畫

```css
/* 狀態列 AI 思考提示 */
.thinking-dots span {
  animation: dotBounce 1.2s infinite;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
```

---

## 10. 響應式設計規格

### 10.1 斷點

| 名稱 | 寬度 | 主要調整 |
|------|------|---------|
| Mobile S | < 375px | 棋子字縮小，按鈕高度增加 |
| Mobile | 375-768px | 標準行動佈局 |
| Tablet | 768-1024px | 棋盤居中，最大寬600px |
| Desktop | > 1024px | 棋盤最大寬640px，含側邊資訊 |

### 10.2 棋盤尺寸計算

```javascript
// 行動優先棋盤尺寸
const boardWidth = Math.min(window.innerWidth - 16, 640);
const cellSize = Math.floor(boardWidth / 8);
const boardHeight = cellSize * 4;

// 棋子字體大小
const pieceFontSize = Math.max(cellSize * 0.5, 14);
```

### 10.3 觸控優化

```css
/* 最小觸控目標 44×44px */
.cell {
  min-width: 44px;
  min-height: 44px;
}

/* 取消 tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 防止雙擊縮放 */
button, .cell {
  touch-action: manipulation;
}
```

### 10.4 安全區域（iPhone 瀏海 / 底部手勢列）

```css
#top-bar {
  padding-top: env(safe-area-inset-top);
}

#action-bar {
  padding-bottom: max(env(safe-area-inset-bottom), 8px);
}
```

---

## 11. 設定系統規格

### 11.1 localStorage 鍵值

| 鍵 | 型別 | 預設值 | 說明 |
|----|------|--------|------|
| `dchess_difficulty` | string | `'normal'` | AI 難度 |
| `dchess_bgm_vol` | number | `0.5` | 背景音樂音量 0-1 |
| `dchess_sfx_vol` | number | `0.8` | 音效音量 0-1 |
| `dchess_show_hints` | boolean | `true` | 顯示移動提示 |
| `dchess_anim_speed` | string | `'normal'` | 動畫速度 |
| `dchess_best_score` | object | `{}` | 最快勝利回合數（各難度） |

### 11.2 設定讀取

```javascript
function loadSettings() {
  return {
    difficulty: localStorage.getItem('dchess_difficulty') || 'normal',
    bgmVolume: parseFloat(localStorage.getItem('dchess_bgm_vol')) || 0.5,
    sfxVolume: parseFloat(localStorage.getItem('dchess_sfx_vol')) || 0.8,
    showHints: localStorage.getItem('dchess_show_hints') !== 'false',
    animSpeed: localStorage.getItem('dchess_anim_speed') || 'normal'
  };
}
```

---

## 12. 程式碼架構規格

### 12.1 模組劃分（單檔內組織）

```javascript
// ========== 常數定義 ==========
const PIECES = { ... }
const PIECE_VALUES = { ... }

// ========== 音效引擎 ==========
const AudioEngine = {
  init(), playBGM(), stopBGM(), playSFX(type), setVolume()
}

// ========== 棋盤邏輯 ==========
const BoardLogic = {
  init(), flip(idx), move(from, to), capture(from, to),
  getLegalMoves(idx), canCapture(attacker, target),
  isGameOver(), getCannonAttacks(idx)
}

// ========== AI 引擎 ==========
const AIEngine = {
  minimax(state, depth, alpha, beta, maximizing),
  evaluate(state),
  getBestMove(state),
  makeMove(state)
}

// ========== 遊戲控制器 ==========
const GameController = {
  state: GameState,
  startGame(), handleCellClick(idx),
  handlePlayerMove(from, to), triggerAI(),
  undoMove(), surrender(), proposeDraw(),
  checkGameOver()
}

// ========== UI 控制器 ==========
const UIController = {
  renderBoard(), renderPiece(piece, cell),
  showScreen(name), updateStatusBar(),
  showGameOver(result), animateFlip(idx),
  animateMove(from, to), animateCapture(idx),
  highlightSelected(idx), showHints(moves)
}

// ========== 設定控制器 ==========
const SettingsController = {
  load(), save(), apply(), bindUI()
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  SettingsController.load();
  AudioEngine.init();
  UIController.showScreen('menu');
});
```

### 12.2 事件流程圖

```
用戶點擊格子
    │
    ▼
GameController.handleCellClick(idx)
    │
    ├─ [格子是未翻開棋子] ──→ BoardLogic.flip(idx)
    │                              │
    │                              ▼
    │                        播放翻牌音效
    │                        若是第一翻 → 決定陣營
    │                        更新UI → 切換AI回合
    │
    ├─ [格子是己方棋子] ──→ 選取 / 取消選取
    │                     顯示移動提示
    │
    └─ [已選取棋子 + 點擊目標格]
           │
           ├─ [合法移動] ──→ BoardLogic.move()
           │                 播放移動音效
           │                 更新UI → 切換AI回合
           │
           ├─ [合法吃子] ──→ BoardLogic.capture()
           │                 播放吃子音效
           │                 動畫 → 更新UI → 切換AI回合
           │
           └─ [非法] ──→ 播放錯誤音效，清除選取
```

---

## 13. 測試驗收標準

### 13.1 功能測試

- [ ] 雙擊 `index.html` 可在瀏覽器直接開啟，不需任何伺服器
- [ ] 所有 32 枚棋子正確初始化並隨機分佈
- [ ] 第一翻正確決定玩家陣營
- [ ] 翻牌、移動、吃子規則全部正確實作
- [ ] 炮的吃子規則（需炮架）正確實作
- [ ] 兵/卒吃帥/將的循環規則正確
- [ ] AI 在各難度下能正確行動
- [ ] 悔棋最多 2 次，正確還原狀態
- [ ] 勝負判定正確觸發遊戲結束畫面
- [ ] 設定正確儲存至 localStorage

### 13.2 響應式測試

- [ ] iPhone SE（375×667）：棋盤完整顯示，可操作
- [ ] iPhone 15 Pro（393×852）：正常顯示
- [ ] iPad（768×1024）：棋盤居中，適當大小
- [ ] 桌機 1920×1080：棋盤不過大，佈局舒適
- [ ] 橫向（Landscape）：棋盤與按鈕可同時顯示

### 13.3 音效測試

- [ ] 首次點擊後 BGM 正確播放
- [ ] 靜音切換有效
- [ ] 各事件音效正確觸發
- [ ] 設定頁調整音量即時生效

### 13.4 效能標準

- [ ] 首屏載入 < 2 秒（含 Google Fonts CDN）
- [ ] AI 在普通難度回應時間 < 1 秒
- [ ] 動畫流暢，無明顯掉幀（60fps 目標）
- [ ] 行動裝置不發生過熱或明顯耗電（AI 計算需在 250ms 內完成）

### 13.5 字體可讀性

- [ ] 棋子文字在最小格子尺寸（375px 螢幕）仍清晰可辨
- [ ] 按鈕文字不小於 16px（行動裝置）
- [ ] 狀態列資訊在各尺寸下均可讀

---

## 附錄 A：棋子強弱速查表

```
強  帥/將 (10000)
    ↓ 可吃 ↓
    車    (500)
    ↓
    馬    (300)
    ↓
    炮    (350)  ←─ 需炮架才能吃子
    ↓
    相/象 (200)
    ↓
    仕/士 (150)
    ↓
弱  兵/卒 (100)
    ↓
    帥/將       ← 循環（兵可吃帥）
```

---

## 附錄 B：炮吃子範例

```
情境一（合法）：炮 _ 砲架 _ 目標
  [炮][ ][ 任意棋子 ][ 目標棋子 ]
   ↑                     ↑
   炮從這裡 ─────────── 吃這裡（隔一枚砲架）

情境二（合法）：炮與目標不相鄰，中間有且只有一枚棋子
  [炮][砲架][目標]  ✓
  [炮][  ][目標]   ✗（中間無砲架）
  [炮][架][架][目標] ✗（中間超過一枚）

情境三：炮移動（不吃子）
  炮可移動至空格（同一般棋子，不需砲架）
```

---

*本規格書版本 v1.0.0 | 最後更新：2026-05-13*
