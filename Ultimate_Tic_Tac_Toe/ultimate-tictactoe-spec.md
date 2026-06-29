# 🎮 Ultimate Tic-Tac-Toe（終極井字棋）完整規格書

> **版本**：v1.0.0 　**建立日期**：2026-06-29　**目標平台**：純前端 HTML/CSS/JS（無需建置或伺服器）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [遊戲規則說明](#2-遊戲規則說明)
3. [技術架構與資料夾結構](#3-技術架構與資料夾結構)
4. [頁面與畫面規格](#4-頁面與畫面規格)
5. [遊戲邏輯規格](#5-遊戲邏輯規格)
6. [AI 對戰規格](#6-ai-對戰規格)
7. [RWD 響應式設計規格](#7-rwd-響應式設計規格)
8. [音效與 BGM 規格](#8-音效與-bgm-規格)
9. [多國語系（i18n）規格](#9-多國語系i18n規格)
10. [UI/UX 設計規格](#10-uiux-設計規格)
11. [設定頁面規格](#11-設定頁面規格)
12. [說明頁面規格](#12-說明頁面規格)
13. [資料儲存（LocalStorage）規格](#13-資料儲存localstorage規格)
14. [效能與相容性規格](#14-效能與相容性規格)
15. [錯誤處理規格](#15-錯誤處理規格)
16. [開發優先順序與里程碑](#16-開發優先順序與里程碑)

---

## 1. 專案概覽

### 1.1 專案目標

打造一款畫面精美、操作流暢、可在任何裝置直接開啟 `index.html` 遊玩的 **Ultimate Tic-Tac-Toe（終極井字棋）** 單人對戰 AI 遊戲。

### 1.2 核心需求摘要

| 分類 | 需求 |
|------|------|
| 🖥️ 技術 | 純前端，無需 build 或 server |
| 📱 RWD | 桌機、平板、手機全裝置支援 |
| 🎨 視覺 | 擬真配色、大字體、豐富色彩 |
| 🔊 音效 | 鋼琴 BGM + 高音輕脆音效，音量 5 倍 |
| 🌐 語系 | 繁體中文、英文、日文 |
| 🤖 AI | 簡單 / 普通 / 困難三級 |
| 💾 儲存 | LocalStorage 保存設定與進度 |

### 1.3 遊戲模式

```
目前版本：VS AI（對戰人工智慧）
  ├── 簡單（Easy）   — 隨機下棋
  ├── 普通（Normal） — 有基本策略
  └── 困難（Hard）   — Minimax + Alpha-Beta 剪枝
```

---

## 2. 遊戲規則說明

### 2.1 棋盤結構

```
Ultimate Tic-Tac-Toe 棋盤由 9 個「小棋盤」排成 3×3 的「大棋盤」

┌─────────────┬─────────────┬─────────────┐
│  小棋盤 [0,0] │ 小棋盤 [0,1] │ 小棋盤 [0,2] │
│  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │
│  ├─┼─┼─┤    │  ├─┼─┼─┤    │  ├─┼─┼─┤    │
│  └─┴─┴─┘    │  └─┴─┴─┘    │  └─┴─┴─┘    │
├─────────────┼─────────────┼─────────────┤
│  小棋盤 [1,0] │ 小棋盤 [1,1] │ 小棋盤 [1,2] │
│  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │
│  ├─┼─┼─┤    │  ├─┼─┼─┤    │  ├─┼─┼─┤    │
│  └─┴─┴─┘    │  └─┴─┴─┘    │  └─┴─┴─┘    │
├─────────────┼─────────────┼─────────────┤
│  小棋盤 [2,0] │ 小棋盤 [2,1] │ 小棋盤 [2,2] │
│  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │  ┌─┬─┬─┐    │
│  ├─┼─┼─┤    │  ├─┼─┼─┤    │  ├─┼─┼─┤    │
│  └─┴─┴─┘    │  └─┴─┴─┘    │  └─┴─┴─┘    │
└─────────────┴─────────────┴─────────────┘

每個小棋盤有 9 格（座標 [row, col]，各為 0~2）
整體棋盤共 81 格
```

### 2.2 遊戲流程

```
遊戲開始
  │
  ▼
玩家（X）可以在任意小棋盤的任意格落子（第一步）
  │
  ▼
玩家落子於小棋盤 [br, bc] 的格子 [cr, cc]
  │
  ▼
下一步必須在大棋盤 [cr, cc] 的小棋盤中落子
  │
  ├─── 若目標小棋盤已結束（有人贏或和局）
  │         └─ 可在任意未結束的小棋盤落子
  │
  ▼
小棋盤內連成三子 → 該小棋盤由該玩家佔領
  │
  ▼
大棋盤內連成三個已佔領的小棋盤 → 遊戲結束，該玩家獲勝
  │
  ▼
若所有小棋盤皆已結束但無人在大棋盤連線 → 大和局
```

### 2.3 勝利條件

**小棋盤勝利**（任一玩家在小棋盤內連成三子）：
```
連線方向（共 8 種）：
  橫：row 0 / row 1 / row 2
  縱：col 0 / col 1 / col 2
  斜：左上→右下 / 右上→左下
```

**大棋盤勝利**（任一玩家在大棋盤中佔領三個小棋盤）：
```
同上，8 種連線方式
```

**平局條件**：
- 所有小棋盤皆已完成（贏或和）
- 大棋盤無人連線三格

### 2.4 落子規則細節

| 情境 | 規則 |
|------|------|
| 目標小棋盤未結束 | 必須在目標小棋盤落子 |
| 目標小棋盤已結束 | 可在**任意未結束的小棋盤**落子 |
| 格子已被佔用 | 不可落子 |
| 小棋盤已被佔領 | 整個小棋盤視為無效區域（覆蓋勝者符號） |

---

## 3. 技術架構與資料夾結構

### 3.1 完整資料夾結構

```
ultimate-tictactoe/
│
├── index.html                    # 主入口（所有頁面容器）
│
├── css/
│   ├── base/
│   │   ├── reset.css             # CSS Reset & 基礎設定
│   │   ├── variables.css         # CSS 變數（顏色、字體、動畫）
│   │   └── typography.css        # 字體大小、行高、字重設定
│   │
│   ├── layout/
│   │   ├── grid.css              # 大棋盤、小棋盤佈局
│   │   └── responsive.css        # RWD 媒體查詢（手機/平板/桌機）
│   │
│   ├── components/
│   │   ├── board.css             # 棋盤樣式（大、小棋盤、格子）
│   │   ├── buttons.css           # 按鈕元件樣式
│   │   ├── modal.css             # 彈出視窗樣式
│   │   ├── menu.css              # 主選單樣式
│   │   ├── settings.css          # 設定頁面樣式
│   │   ├── help.css              # 說明頁面樣式
│   │   ├── hud.css               # 遊戲中 HUD（分數、狀態列）
│   │   └── animations.css        # 動畫與過渡效果
│   │
│   └── themes/
│       ├── theme-classic.css     # 經典主題（木紋）
│       ├── theme-neon.css        # 霓虹主題
│       ├── theme-ocean.css       # 海洋主題
│       └── theme-sakura.css      # 櫻花主題
│
├── js/
│   ├── core/
│   │   ├── game.js               # 遊戲核心邏輯（狀態機）
│   │   ├── board.js              # 棋盤資料結構與運算
│   │   ├── rules.js              # 規則驗證（合法落子、勝負判斷）
│   │   └── state.js              # 全域狀態管理
│   │
│   ├── ai/
│   │   ├── ai-easy.js            # 簡單 AI（隨機策略）
│   │   ├── ai-normal.js          # 普通 AI（基本啟發式）
│   │   ├── ai-hard.js            # 困難 AI（Minimax + Alpha-Beta）
│   │   └── ai-evaluator.js       # AI 評分函數（共用）
│   │
│   ├── ui/
│   │   ├── renderer.js           # DOM 渲染引擎
│   │   ├── animations.js         # 動畫控制器
│   │   ├── hud.js                # 遊戲內 HUD 更新
│   │   └── modal.js              # 彈窗管理器
│   │
│   ├── audio/
│   │   ├── audio-manager.js      # 音效/BGM 管理器
│   │   ├── bgm-generator.js      # Web Audio API 鋼琴音樂生成器
│   │   └── sfx-generator.js      # Web Audio API 音效生成器
│   │
│   ├── i18n/
│   │   ├── i18n.js               # 語系切換核心
│   │   ├── zh-TW.js              # 繁體中文語系檔
│   │   ├── en.js                 # 英文語系檔
│   │   └── ja.js                 # 日文語系檔
│   │
│   ├── storage/
│   │   └── storage.js            # LocalStorage 封裝層
│   │
│   └── main.js                   # 主入口（初始化、頁面路由）
│
├── assets/
│   ├── icons/
│   │   ├── favicon.ico
│   │   └── *.svg                 # SVG 圖示（設定、說明、音效等）
│   └── fonts/                    # （可選）自訂字體
│
└── README.md                     # 開發說明
```

### 3.2 模組載入順序（index.html 引入順序）

```html
<!-- CSS 載入順序 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/grid.css">
<link rel="stylesheet" href="css/layout/responsive.css">
<link rel="stylesheet" href="css/components/board.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/menu.css">
<link rel="stylesheet" href="css/components/settings.css">
<link rel="stylesheet" href="css/components/help.css">
<link rel="stylesheet" href="css/components/hud.css">
<link rel="stylesheet" href="css/components/animations.css">
<link rel="stylesheet" href="css/themes/theme-classic.css">  <!-- 預設主題 -->

<!-- JS 載入順序（body 底部） -->
<script src="js/core/state.js"></script>
<script src="js/core/board.js"></script>
<script src="js/core/rules.js"></script>
<script src="js/core/game.js"></script>
<script src="js/ai/ai-evaluator.js"></script>
<script src="js/ai/ai-easy.js"></script>
<script src="js/ai/ai-normal.js"></script>
<script src="js/ai/ai-hard.js"></script>
<script src="js/i18n/zh-TW.js"></script>
<script src="js/i18n/en.js"></script>
<script src="js/i18n/ja.js"></script>
<script src="js/i18n/i18n.js"></script>
<script src="js/storage/storage.js"></script>
<script src="js/audio/bgm-generator.js"></script>
<script src="js/audio/sfx-generator.js"></script>
<script src="js/audio/audio-manager.js"></script>
<script src="js/ui/animations.js"></script>
<script src="js/ui/modal.js"></script>
<script src="js/ui/hud.js"></script>
<script src="js/ui/renderer.js"></script>
<script src="js/main.js"></script>
```

### 3.3 技術限制

- **不得使用任何 npm 套件或打包工具**（Webpack、Vite、Rollup 等）
- **不得引用外部 CDN**（須完全離線可用）
- **不得使用 ES Module import/export**（需透過全域變數共享）
- 使用 **Web Audio API** 生成音效與 BGM（不依賴外部音訊檔）
- 使用 **LocalStorage** 儲存所有持久化資料

---

## 4. 頁面與畫面規格

### 4.1 頁面架構（單頁應用）

```
index.html 包含以下「場景容器」（透過 display:none/flex 切換）

#scene-home        主選單
#scene-game        遊戲畫面
#scene-help        說明頁面
#scene-settings    設定頁面
#scene-result      遊戲結果頁面
```

### 4.2 主選單（#scene-home）

#### 4.2.1 視覺設計

```
┌──────────────────────────────────────┐
│                                      │
│   🎮  終極井字棋                      │  ← 大標題，具動態發光效果
│   Ultimate Tic-Tac-Toe               │  ← 英文副標，小字
│                                      │
│   ┌────────────────────────────┐     │
│   │      ▶  開始遊戲           │     │  ← 主要按鈕（最大、最顯眼）
│   └────────────────────────────┘     │
│                                      │
│   ┌────────────────────────────┐     │
│   │      ⏩  繼續遊戲          │     │  ← 灰色（無存檔時禁用）
│   └────────────────────────────┘     │
│                                      │
│   ┌──────────┐  ┌──────────┐        │
│   │  📖 說明 │  │  ⚙️ 設定 │        │
│   └──────────┘  └──────────┘        │
│                                      │
│   🌐 語言：繁中 ｜ EN ｜ 日本語       │  ← 底部語系快速切換
│                                      │
└──────────────────────────────────────┘
```

#### 4.2.2 功能細節

| 按鈕 | 行為 |
|------|------|
| 開始遊戲 | 跳出「難度選擇」彈窗（Easy / Normal / Hard），確認後進入遊戲 |
| 繼續遊戲 | 讀取 LocalStorage 存檔並進入遊戲（無存檔時禁用且顯示灰色） |
| 說明 | 切換到說明場景 |
| 設定 | 切換到設定場景 |
| 語言切換 | 即時切換所有文字，並存入 LocalStorage |

#### 4.2.3 難度選擇彈窗

```
┌────────────────────────────────┐
│   選擇 AI 難度                  │
│                                │
│   😊 簡單   ─ 隨機AI            │
│   😐 普通   ─ 策略AI            │
│   😈 困難   ─ 強力AI            │
│                                │
│        [ 確認 ]  [ 取消 ]       │
└────────────────────────────────┘
```

### 4.3 遊戲畫面（#scene-game）

#### 4.3.1 桌機版佈局

```
┌─────────────────────────────────────────────────────┐
│  ← 返回   終極井字棋   🔊  ⚙️                        │  ← 頂部導覽列
├─────────────────────────────────────────────────────┤
│                                                      │
│  👤 玩家（X）        🤖 AI（O）                       │  ← 狀態列
│  回合：玩家            難度：困難                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│         ┌───────────────────────────────┐            │
│         │                               │            │
│         │   大棋盤（9個小棋盤）           │            │
│         │   每個小棋盤有 3×3 格          │            │
│         │   有效區域高亮顯示             │            │
│         │                               │            │
│         └───────────────────────────────┘            │
│                                                      │
├─────────────────────────────────────────────────────┤
│  [ 重新開始 ]                   [ 悔棋 ]              │  ← 底部操作列
└─────────────────────────────────────────────────────┘
```

#### 4.3.2 手機版佈局（直向）

```
┌──────────────────────┐
│  ←  終極井字棋  🔊⚙️  │  ← 緊湊頂部列
├──────────────────────┤
│ 👤X 🔁玩家回合  🤖O  │  ← 單行狀態列
├──────────────────────┤
│                      │
│   ┌──────────────┐   │
│   │              │   │
│   │   遊戲棋盤   │   │  ← 佔最大面積
│   │              │   │
│   └──────────────┘   │
│                      │
├──────────────────────┤
│  [重新開始]  [悔棋]   │  ← 底部固定列（不擋棋盤）
└──────────────────────┘
```

#### 4.3.3 棋盤視覺狀態

| 狀態 | 視覺表現 |
|------|---------|
| 有效落子區域（當前必須下的小棋盤） | 亮色邊框＋輕微發光動畫 |
| 無效小棋盤（已結束） | 半透明遮罩＋已贏玩家大符號覆蓋 |
| 可選小棋盤（目標已結束時） | 虛線邊框＋淡金色 |
| 已落子（X） | 玩家顏色，粗體，動畫放大進入 |
| 已落子（O） | AI 顏色，粗體，動畫放大進入 |
| Hover（可點擊） | 半透明預覽符號 |
| 小棋盤勝利 | 大符號疊加＋勝利線條動畫 |
| 大棋盤勝利 | 全盤慶祝動畫 |

### 4.4 遊戲結果頁面（#scene-result）

```
┌──────────────────────────────┐
│                              │
│   🎉  玩家獲勝！              │  ← 或 😈 AI 獲勝！ / 🤝 平局！
│                              │
│   回合數：24 步              │
│   用時：3:45                 │
│                              │
│   [ 再玩一次 ]               │
│   [ 返回主選單 ]              │
│                              │
└──────────────────────────────┘
```

---

## 5. 遊戲邏輯規格

### 5.1 遊戲狀態結構

```javascript
// 全域遊戲狀態（state.js）
const GameState = {
  // 棋盤資料：二維陣列，外層是大棋盤座標，內層是小棋盤格子
  // boards[br][bc][cr][cc] = null | 'X' | 'O'
  boards: Array(3).fill(null).map(() =>
    Array(3).fill(null).map(() =>
      Array(3).fill(null).map(() =>
        Array(3).fill(null)
      )
    )
  ),

  // 小棋盤結果：megaBoard[br][bc] = null | 'X' | 'O' | 'draw'
  megaBoard: Array(3).fill(null).map(() => Array(3).fill(null)),

  // 當前回合
  currentPlayer: 'X',           // 'X'（玩家）| 'O'（AI）

  // 下一步必須落子的小棋盤（null 表示可選任意）
  nextBoard: null,               // { br, bc } | null

  // 遊戲階段
  phase: 'idle',                 // 'idle' | 'playing' | 'ended'

  // 勝者
  winner: null,                  // null | 'X' | 'O' | 'draw'

  // 難度
  difficulty: 'normal',          // 'easy' | 'normal' | 'hard'

  // 步驟歷史（悔棋用）
  history: [],

  // 計時
  startTime: null,
  moveCount: 0,
};
```

### 5.2 核心函式介面

```javascript
// board.js
BoardUtils.getValidMoves(state)           // 回傳所有合法落子位置
BoardUtils.applyMove(state, br, bc, cr, cc) // 套用落子，回傳新狀態
BoardUtils.checkSmallWinner(board)        // 檢查小棋盤勝者
BoardUtils.checkMegaWinner(megaBoard)     // 檢查大棋盤勝者
BoardUtils.isBoardFull(board)             // 檢查小棋盤是否已滿（和局）

// rules.js
Rules.isValidMove(state, br, bc, cr, cc) // 驗證落子合法性
Rules.getNextBoard(cr, cc)               // 計算下一個目標小棋盤
Rules.isBoardPlayable(state, br, bc)     // 小棋盤是否可落子

// game.js
Game.start(difficulty)                   // 開始遊戲
Game.makeMove(br, bc, cr, cc)            // 玩家落子
Game.undo()                              // 悔棋
Game.restart()                           // 重新開始
Game.saveProgress()                      // 存檔
Game.loadProgress()                      // 讀取存檔
```

### 5.3 勝負判斷演算法

```javascript
// rules.js 內的勝利連線檢查
const WIN_LINES = [
  [[0,0],[0,1],[0,2]], // 橫列 0
  [[1,0],[1,1],[1,2]], // 橫列 1
  [[2,0],[2,1],[2,2]], // 橫列 2
  [[0,0],[1,0],[2,0]], // 縱行 0
  [[0,1],[1,1],[2,1]], // 縱行 1
  [[0,2],[1,2],[2,2]], // 縱行 2
  [[0,0],[1,1],[2,2]], // 正斜
  [[0,2],[1,1],[2,0]], // 反斜
];

function checkWinner(board) {
  // board[r][c] = null | 'X' | 'O'
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const val = board[a[0]][a[1]];
    if (val &&
        val === board[b[0]][b[1]] &&
        val === board[c[0]][c[1]]) {
      return { winner: val, line };
    }
  }
  return null;
}
```

### 5.4 悔棋規格

- 僅限悔一步（玩家的上一手）
- 悔棋後 AI 的上一手也一同回復
- 每局最多悔棋 3 次
- 悔棋次數顯示於 HUD

---

## 6. AI 對戰規格

### 6.1 簡單 AI（Easy）

```
策略：完全隨機
步驟：
  1. 取得所有合法落子位置
  2. 隨機選取一個落子
  3. 延遲 300~700ms（模擬思考）後執行
```

### 6.2 普通 AI（Normal）

```
策略：規則式啟發法（優先順序由高至低）
步驟：
  1. 若能在小棋盤連線獲勝 → 立即落子
  2. 若玩家下一步能在小棋盤連線獲勝 → 阻擋
  3. 若能佔領能在大棋盤連線的小棋盤 → 優先
  4. 若能避免送玩家去有利小棋盤 → 避開
  5. 否則隨機選
  延遲：500~1000ms
```

### 6.3 困難 AI（Hard）

```
策略：Minimax 演算法 + Alpha-Beta 剪枝

參數：
  搜尋深度：最大 5 層（可根據效能動態調整）
  時間限制：單步不超過 1500ms

評分函數（ai-evaluator.js）：
  大棋盤連線潛力    ×10
  小棋盤已佔領數量  ×5
  中心小棋盤控制    +3
  角落小棋盤控制    +2
  傳送對手到有利位置懲罰  -4
  己方小棋盤中心格控制  +1

Minimax 架構：
  function minimax(state, depth, alpha, beta, isMaximizing):
    if depth == 0 or game over:
      return evaluate(state)
    
    if isMaximizing (AI):
      maxVal = -Infinity
      for each valid move:
        val = minimax(nextState, depth-1, alpha, beta, false)
        maxVal = max(maxVal, val)
        alpha = max(alpha, val)
        if beta <= alpha: break  // Alpha-Beta 剪枝
      return maxVal
    
    else (Player):
      minVal = +Infinity
      for each valid move:
        val = minimax(nextState, depth-1, alpha, beta, true)
        minVal = min(minVal, val)
        beta = min(beta, val)
        if beta <= alpha: break
      return minVal
  
  延遲：800~1500ms（假裝思考）
```

### 6.4 AI 回應時間規格

| 難度 | 最短延遲 | 最長延遲 | 備注 |
|------|---------|---------|------|
| 簡單 | 300ms | 700ms | 隨機延遲 |
| 普通 | 500ms | 1000ms | 隨機延遲 |
| 困難 | 800ms | 1500ms | 計算完成後若時間不足則補齊最短延遲 |

> AI 思考時，棋盤顯示「AI 思考中...」動畫，禁止玩家點擊。

---

## 7. RWD 響應式設計規格

### 7.1 斷點定義

```css
/* css/layout/responsive.css */
/* 手機（直向）*/
@media (max-width: 480px) { ... }

/* 手機（橫向）/ 小平板 */
@media (min-width: 481px) and (max-width: 768px) { ... }

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1025px) { ... }
```

### 7.2 棋盤尺寸計算規則

```
棋盤尺寸 = min(視窗寬度 × 0.92, 視窗高度 × 0.60, 600px)

手機直向：棋盤最大 = 視窗寬度 - 16px（左右各 8px margin）
手機橫向：棋盤最大 = 視窗高度 × 0.75
平板：棋盤最大 = min(視窗寬度 × 0.65, 500px)
桌機：棋盤固定 = 550px
```

### 7.3 手機版關鍵佈局規則

```
1. 頂部導覽列高度：固定 48px（手機）/ 56px（桌機）
2. 狀態列高度：固定 40px（手機）/ 52px（桌機）
3. 底部操作列高度：固定 56px（手機）/ 60px（桌機）
4. 棋盤區域 = 視窗高度 - 頂部列 - 狀態列 - 底部列 - 安全邊距

❌ 禁止：底部操作按鈕疊加在棋盤上方
❌ 禁止：導覽列遮擋棋盤格子
✅ 必須：棋盤始終完整可見，不需捲動
✅ 必須：所有按鈕最小觸控目標 44×44px
```

### 7.4 字體 RWD 規格

```css
/* 基礎字體大小 */
:root {
  --font-size-xs: clamp(12px, 3vw, 14px);
  --font-size-sm: clamp(14px, 3.5vw, 16px);
  --font-size-md: clamp(16px, 4vw, 18px);    /* 內文基礎 */
  --font-size-lg: clamp(18px, 4.5vw, 22px);  /* 按鈕、標籤 */
  --font-size-xl: clamp(22px, 6vw, 28px);    /* 副標題 */
  --font-size-2xl: clamp(28px, 8vw, 40px);   /* 主標題 */
  --font-size-board: clamp(20px, 8vw, 36px); /* 棋盤 X/O 符號 */
}
```

### 7.5 手機橫向特殊處理

```
手機橫向（高度 < 480px）：
  - 頂部列縮為 36px
  - 狀態列與頂部列合併（高度 36px）
  - 棋盤左側固定，右側顯示分數與按鈕
  - 底部按鈕移至右側垂直排列
```

---

## 8. 音效與 BGM 規格

### 8.1 技術方案

使用 **Web Audio API** 程序化生成所有聲音，無需外部音訊檔案。

```javascript
// audio-manager.js 架構
const AudioManager = {
  context: null,           // AudioContext
  masterGain: null,        // 主音量節點
  bgmGain: null,           // BGM 音量節點（×5 基礎）
  sfxGain: null,           // 音效音量節點
  isBgmPlaying: false,
  bgmVolume: 1.0,          // 用戶設定（0~1）
  sfxVolume: 1.0,          // 用戶設定（0~1）

  init(), play(), pause(), resume(),
  playBgm(), stopBgm(),
  playSfx(name),
};
```

### 8.2 BGM 規格（鋼琴輕快音樂）

```
風格：輕快、愉悅的鋼琴曲
BPM：120
音階：C 大調
結構：A-B-A-B 循環（每段 16 小節）

實現方式（Web Audio API）：
  - 使用 OscillatorNode（sine 波）模擬鋼琴音色
  - 搭配 GainNode 做 ADSR（起音短、衰減快、延音低、釋音短）
  - 加入 ConvolverNode 模擬輕微殘響
  - 音符序列硬編碼於 bgm-generator.js

音量規格：
  BGM GainNode.gain.value = 設定音量 × 5.0
  （用戶設定 0.2 → 實際輸出 1.0，上限為 5.0）
```

### 8.3 音效清單

| 音效 ID | 觸發時機 | 音色描述 |
|---------|---------|---------|
| `sfx-place` | 玩家成功落子 | 輕脆高音敲擊（C6，50ms）|
| `sfx-ai-place` | AI 落子 | 略低一度敲擊（A5，50ms）|
| `sfx-small-win` | 佔領小棋盤 | 三音上升音階（C6-E6-G6，150ms）|
| `sfx-small-draw` | 小棋盤和局 | 短促低音（C5，80ms）|
| `sfx-win` | 玩家獲勝 | 歡快五音音階（C6-E6-G6-C7，400ms）|
| `sfx-lose` | 玩家落敗 | 下降三音（G5-E5-C5，400ms）|
| `sfx-draw` | 大和局 | 中性雙音（C5-G5，200ms）|
| `sfx-invalid` | 點擊無效格子 | 極短低沉音（Buzz，30ms）|
| `sfx-btn-click` | 按鈕點擊 | 極短高音 tap（C7，20ms）|
| `sfx-undo` | 悔棋 | 倒退音效（G5-C5，120ms）|

### 8.4 音量設定規格

```
音量設定（設定頁面）：
  BGM 音量：滑桿 0~100%（內部乘以 5，最大輸出 500%）
  音效音量：滑桿 0~100%
  整體靜音：切換按鈕（快速關閉所有聲音）
```

> ⚠️ **注意**：BGM 音量 5 倍效果需使用 DynamicsCompressorNode 防止爆音失真。

---

## 9. 多國語系（i18n）規格

### 9.1 語系結構

```javascript
// js/i18n/zh-TW.js
const LANG_ZH_TW = {
  // 通用
  'app.title': '終極井字棋',
  'app.subtitle': 'Ultimate Tic-Tac-Toe',

  // 主選單
  'menu.start': '開始遊戲',
  'menu.continue': '繼續遊戲',
  'menu.help': '說明',
  'menu.settings': '設定',

  // 難度選擇
  'difficulty.title': '選擇 AI 難度',
  'difficulty.easy': '😊 簡單',
  'difficulty.normal': '😐 普通',
  'difficulty.hard': '😈 困難',
  'difficulty.easy.desc': '隨機 AI，適合入門',
  'difficulty.normal.desc': '策略 AI，適合練習',
  'difficulty.hard.desc': '強力 AI，接受挑戰！',

  // 遊戲 HUD
  'game.player': '玩家（X）',
  'game.ai': 'AI（O）',
  'game.turn.player': '你的回合',
  'game.turn.ai': 'AI 思考中...',
  'game.difficulty': '難度',
  'game.moves': '步數',
  'game.undo': '悔棋',
  'game.restart': '重新開始',
  'game.undo.remaining': '悔棋剩 {n} 次',

  // 遊戲結果
  'result.win': '🎉 你贏了！',
  'result.lose': '😈 AI 贏了！',
  'result.draw': '🤝 平局！',
  'result.moves': '共 {n} 步',
  'result.time': '用時 {t}',
  'result.play-again': '再玩一次',
  'result.menu': '返回主選單',

  // 設定
  'settings.title': '設定',
  'settings.language': '語言',
  'settings.theme': '主題',
  'settings.bgm-volume': 'BGM 音量',
  'settings.sfx-volume': '音效音量',
  'settings.mute': '靜音',
  'settings.reset': '重置設定',

  // 說明
  'help.title': '遊戲說明',
  'help.back': '返回',

  // 確認對話框
  'confirm.restart': '確定要重新開始嗎？',
  'confirm.menu': '確定要返回主選單？（進度將自動儲存）',
  'confirm.yes': '確認',
  'confirm.no': '取消',
};
```

### 9.2 語系切換機制

```javascript
// i18n.js
const I18n = {
  currentLang: 'zh-TW',
  langs: { 'zh-TW': LANG_ZH_TW, 'en': LANG_EN, 'ja': LANG_JA },

  t(key, params = {}) {
    let str = this.langs[this.currentLang][key] || key;
    // 替換參數 {n}, {t} 等
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  },

  setLang(lang) {
    this.currentLang = lang;
    Storage.set('language', lang);
    this.applyToDOM();  // 更新所有 data-i18n 元素
  },

  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  }
};
```

### 9.3 三語對照表（關鍵詞）

| Key | 繁體中文 | English | 日本語 |
|-----|---------|---------|--------|
| menu.start | 開始遊戲 | Start Game | ゲーム開始 |
| menu.continue | 繼續遊戲 | Continue | 続ける |
| menu.help | 說明 | Help | ヘルプ |
| menu.settings | 設定 | Settings | 設定 |
| difficulty.easy | 😊 簡單 | 😊 Easy | 😊 かんたん |
| difficulty.normal | 😐 普通 | 😐 Normal | 😐 ふつう |
| difficulty.hard | 😈 困難 | 😈 Hard | 😈 むずかしい |
| game.turn.player | 你的回合 | Your Turn | あなたの番 |
| game.turn.ai | AI 思考中... | AI Thinking... | AI思考中... |
| result.win | 🎉 你贏了！ | 🎉 You Win! | 🎉 あなたの勝ち！ |
| result.lose | 😈 AI 贏了！ | 😈 AI Wins! | 😈 AIの勝ち！ |
| result.draw | 🤝 平局！ | 🤝 Draw! | 🤝 引き分け！ |

---

## 10. UI/UX 設計規格

### 10.1 主題系統

#### 主題一：經典木紋（Classic）— 預設

```css
:root[data-theme="classic"] {
  --color-bg-primary: #2C1810;       /* 深咖啡木紋背景 */
  --color-bg-secondary: #3D2314;
  --color-board-bg: #8B5E3C;         /* 木紋棋盤 */
  --color-board-line: #5C3A1E;       /* 棋盤線 */
  --color-board-active: #D4A76A;     /* 活躍小棋盤邊框 */
  --color-board-inactive: #5C3A1E;
  --color-player-x: #E8344A;         /* 玩家 X：紅色 */
  --color-player-o: #1B8CCC;         /* AI O：藍色 */
  --color-text-primary: #F5E6D3;     /* 米白文字 */
  --color-text-secondary: #C4A882;
  --color-btn-primary: #D4A76A;
  --color-btn-text: #2C1810;
  --color-accent: #FFD700;           /* 金色強調 */
  --color-win-highlight: #FFD700;
}
```

#### 主題二：霓虹（Neon）

```css
:root[data-theme="neon"] {
  --color-bg-primary: #0A0A1A;
  --color-bg-secondary: #0F0F2A;
  --color-board-bg: #111133;
  --color-board-line: #2244AA;
  --color-board-active: #00FFFF;     /* 青色發光 */
  --color-player-x: #FF00FF;         /* 品紅色 */
  --color-player-o: #00FF88;         /* 霓虹綠 */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #8888CC;
  --color-btn-primary: #4400FF;
  --color-accent: #FFFF00;
  --color-win-highlight: #00FFFF;
}
```

#### 主題三：海洋（Ocean）

```css
:root[data-theme="ocean"] {
  --color-bg-primary: #0B2447;
  --color-bg-secondary: #19376D;
  --color-board-bg: #1B4F8A;
  --color-board-line: #2563EB;
  --color-board-active: #38BDF8;
  --color-player-x: #F97316;         /* 珊瑚橙 */
  --color-player-o: #FFFFFF;
  --color-text-primary: #E0F2FE;
  --color-text-secondary: #7DD3FC;
  --color-btn-primary: #0EA5E9;
  --color-accent: #FCD34D;
  --color-win-highlight: #FCD34D;
}
```

#### 主題四：櫻花（Sakura）

```css
:root[data-theme="sakura"] {
  --color-bg-primary: #FFF0F5;
  --color-bg-secondary: #FFE4EE;
  --color-board-bg: #FFFFFF;
  --color-board-line: #F9A8C9;
  --color-board-active: #EC4899;
  --color-player-x: #BE185D;
  --color-player-o: #7C3AED;
  --color-text-primary: #831843;
  --color-text-secondary: #DB2777;
  --color-btn-primary: #EC4899;
  --color-btn-text: #FFFFFF;
  --color-accent: #A855F7;
  --color-win-highlight: #7C3AED;
}
```

### 10.2 字體規格

```css
/* css/base/typography.css */
:root {
  --font-family-primary: 'Noto Sans TC', 'Hiragino Kaku Gothic ProN',
                         'Meiryo', 'Microsoft JhengHei', sans-serif;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* 字體大小（使用 clamp 確保 RWD）*/
  --font-size-body: clamp(16px, 4vw, 18px);
  --font-size-label: clamp(14px, 3.5vw, 16px);
  --font-size-button: clamp(17px, 4.5vw, 20px);
  --font-size-heading: clamp(22px, 6vw, 30px);
  --font-size-title: clamp(30px, 8vw, 48px);
  --font-size-board-symbol: clamp(22px, 7vw, 38px);  /* X / O 棋子 */
  --font-size-board-winner: clamp(48px, 15vw, 80px); /* 小棋盤勝利覆蓋 */
}
```

> **字體原則**：所有可見文字最小 14px，按鈕文字最小 17px，棋盤符號最小 22px。絕對禁止使用 12px 以下字體。

### 10.3 動畫規格

```css
/* css/components/animations.css */

/* 落子動畫 */
@keyframes piece-drop {
  0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
  70%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* 小棋盤勝利動畫 */
@keyframes board-win-flash {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; box-shadow: 0 0 20px var(--color-win-highlight); }
}

/* 勝利連線動畫 */
@keyframes win-line-draw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}

/* 大棋盤獲勝慶祝 */
@keyframes confetti-fall {
  from { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  to   { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

/* 活躍棋盤呼吸光暈 */
@keyframes active-glow {
  0%, 100% { box-shadow: 0 0 8px var(--color-board-active); }
  50%       { box-shadow: 0 0 20px var(--color-board-active),
                          0 0 40px var(--color-board-active); }
}

/* Hover 預覽 */
.cell:hover .piece-preview {
  opacity: 0.35;
  transform: scale(0.85);
}
```

### 10.4 按鈕設計規範

```css
/* css/components/buttons.css */

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  min-height: 52px;              /* 最小觸控高度 */
  min-width: 140px;
  padding: 12px 28px;

  font-size: var(--font-size-button);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.05em;

  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

/* 主要按鈕 */
.btn-primary {
  background: var(--color-btn-primary);
  color: var(--color-btn-text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* 禁用狀態 */
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
}
```

---

## 11. 設定頁面規格

### 11.1 設定畫面佈局

```
┌─────────────────────────────────┐
│  ←  設定                         │  ← 頂部列（返回按鈕＋標題）
├─────────────────────────────────┤
│                                 │
│  🌐  語言                        │  ─── 分組標題
│  ┌──────────────────────────┐   │
│  │  繁中  │  EN  │  日本語  │   │  ← 三個並排按鈕（選中有底線）
│  └──────────────────────────┘   │
│                                 │
│  🎨  主題                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │木紋│ │霓虹│ │海洋│ │櫻花│   │  ← 色塊預覽 + 名稱
│  └────┘ └────┘ └────┘ └────┘   │
│                                 │
│  🔊  聲音                        │
│  BGM 音量                        │
│  ████████░░  80%                 │  ← 自訂滑桿（漂亮設計）
│  音效音量                        │
│  ██████████  100%                │
│  [🔇 靜音切換]                   │
│                                 │
│  ─────────────────────────      │
│  [重置所有設定]                   │  ← 次要危險按鈕（紅色輪廓）
│                                 │
└─────────────────────────────────┘
```

### 11.2 設定項目規格

| 設定項 | 類型 | 預設值 | 儲存 Key |
|--------|------|-------|---------|
| 語言 | 三選一按鈕 | `zh-TW` | `lang` |
| 主題 | 四選一色塊 | `classic` | `theme` |
| BGM 音量 | 滑桿 0~100 | `80` | `bgm_volume` |
| 音效音量 | 滑桿 0~100 | `100` | `sfx_volume` |
| 靜音 | 切換開關 | `false` | `muted` |

### 11.3 滑桿設計規格

```css
/* 自訂滑桿（input[type=range]）*/
.volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    var(--color-btn-primary) var(--value-pct),
    var(--color-board-inactive) var(--value-pct)
  );
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-btn-primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
}
```

---

## 12. 說明頁面規格

### 12.1 說明頁結構

```
說明頁使用 手風琴式（Accordion）展開收合設計
每個區塊有醒目圖示、清楚標題

┌─────────────────────────────────┐
│  ←  遊戲說明                     │
├─────────────────────────────────┤
│                                 │
│  ▼  🎯 遊戲目標                  │  ← 展開中
│  ┌─────────────────────────┐    │
│  │ 在「大棋盤」中           │    │
│  │ 連成三個「小棋盤」       │    │
│  │ 即可獲勝！               │    │
│  └─────────────────────────┘    │
│                                 │
│  ▶  🗺️ 棋盤介紹                 │  ← 收合中
│  ▶  📋 遊戲規則                 │
│  ▶  🚦 落子規則                 │
│  ▶  🏆 勝利條件                 │
│  ▶  💡 策略提示                 │
│  ▶  🤖 AI 難度說明              │
│                                 │
└─────────────────────────────────┘
```

### 12.2 各說明區塊內容

#### 🎯 遊戲目標

```
圖示：大棋盤示意圖（SVG 繪製，顯示 X 連三小棋盤）
文字：在 3×3 的「大棋盤」中，率先佔領連成一線的三個「小棋盤」即獲勝。
```

#### 🗺️ 棋盤介紹

```
圖示：標示外層（大棋盤）和內層（小棋盤）的示意圖
內容：
  • 🔲 大棋盤：由 9 個小棋盤組成的 3×3 格局
  • ⬛ 小棋盤：每個小棋盤內有 3×3 = 9 個格子
  • 🔢 共 81 個格子可供落子
```

#### 📋 遊戲規則（步驟圖）

```
步驟 1 → 步驟 2 → 步驟 3 → 步驟 4
  ↓          ↓          ↓          ↓
玩家先手   落子決定   對手在指   重複直到
在任意處   下一盤    定盤下子   有人獲勝
```

#### 🚦 落子規則

```
情境A（常規）：
  你落子在小棋盤的 [列, 行] 位置
  對手的下一步必須在大棋盤的 [列, 行] 號小棋盤中落子

  圖示：箭頭顯示「落子位置 → 對手被送往的小棋盤」

情境B（特殊）：
  若被指定的小棋盤已完成（有人贏或和局）
  對手可在任何未完成的小棋盤中自由落子

  圖示：閃爍顯示所有可用小棋盤
```

#### 🏆 勝利條件

```
小棋盤勝利：在小棋盤中連成三子（橫、縱、斜，共8種）
大棋盤勝利：在大棋盤中佔領三個小棋盤（橫、縱、斜，共8種）
平局：所有小棋盤結束但無人連線

圖示：8 種勝利方向的視覺化圖示
```

#### 💡 策略提示

```
💎 佔領中央：中央小棋盤（1,1）能與最多方向連線
🔄 控制走向：盡量把對手送往不利位置
🚫 避免和局：讓小棋盤和局會讓對手得到自由選擇權
⚡ 連環佈局：同時佈置多個潛在連線方向
```

#### 🤖 AI 難度說明

```
😊 簡單：AI 隨機落子，適合剛接觸的新手。
😐 普通：AI 會優先連線並阻止玩家，具備基本策略。
😈 困難：AI 使用進階演算法深度計算，極具挑戰性！
```

---

## 13. 資料儲存（LocalStorage）規格

### 13.1 儲存結構

```javascript
// storage.js

const STORAGE_KEYS = {
  // 設定
  SETTINGS: 'utttt_settings',    // { lang, theme, bgm_volume, sfx_volume, muted }

  // 遊戲存檔
  SAVE: 'utttt_save',            // GameState 快照（JSON）

  // 統計
  STATS: 'utttt_stats',          // { wins, losses, draws, totalGames, bestMoves }
};

const StorageManager = {
  saveSettings(settings) { ... },
  loadSettings() { ... },
  saveGame(state) { ... },
  loadGame() { ... },
  clearSave() { ... },
  saveStats(stats) { ... },
  loadStats() { ... },
  clearAll() { ... },
};
```

### 13.2 遊戲存檔格式

```json
{
  "version": "1.0",
  "savedAt": 1719619200000,
  "difficulty": "hard",
  "boards": "[ ...81格資料... ]",
  "megaBoard": "[ ...9格資料... ]",
  "currentPlayer": "X",
  "nextBoard": { "br": 1, "bc": 2 },
  "moveCount": 14,
  "startTime": 1719619100000,
  "history": "[ ...步驟記錄... ]"
}
```

### 13.3 儲存時機

| 操作 | 儲存行為 |
|------|---------|
| 每次落子後 | 自動儲存遊戲進度 |
| 修改設定 | 即時儲存設定 |
| 遊戲結束 | 清除遊戲存檔，更新統計 |
| 重新開始 | 清除遊戲存檔 |
| 返回主選單 | 保留遊戲存檔 |

---

## 14. 效能與相容性規格

### 14.1 瀏覽器相容性

| 瀏覽器 | 最低版本 | 備注 |
|--------|---------|------|
| Chrome | 80+ | 主要測試目標 |
| Firefox | 75+ | |
| Safari | 13+ | iOS Safari 重點測試 |
| Edge | 80+ | |
| Samsung Internet | 12+ | Android 常見瀏覽器 |

### 14.2 效能目標

```
首次載入（含所有 JS/CSS）：< 500ms
棋盤渲染（初始）：< 100ms
AI 計算（Hard，超時前）：< 1500ms
動畫幀率：穩定 60 FPS
記憶體使用：< 50MB
```

### 14.3 AI Web Worker（可選優化）

```
困難 AI 的 Minimax 計算可能阻塞 UI，
若需要優化，可將 ai-hard.js 的計算移至 Web Worker：

// ai-worker.js
self.onmessage = function(e) {
  const { state, depth } = e.data;
  const bestMove = minimax(state, depth, ...);
  self.postMessage({ bestMove });
};
```

### 14.4 無障礙（Accessibility）基礎規範

```
✅ 所有按鈕有 aria-label
✅ 棋盤格子有 aria-label 描述位置與狀態
✅ 顏色不作為唯一區分方式（搭配形狀/符號）
✅ 焦點樣式清晰可見（focus outline）
✅ 遊戲狀態變化有 aria-live 區域通知
```

---

## 15. 錯誤處理規格

### 15.1 LocalStorage 失效

```javascript
// storage.js
try {
  localStorage.setItem('test', '1');
  localStorage.removeItem('test');
  // 正常使用 LocalStorage
} catch(e) {
  // 降級：使用記憶體儲存（頁面關閉後資料消失）
  console.warn('LocalStorage 不可用，使用記憶體模式');
}
```

### 15.2 Web Audio API 不支援

```javascript
// audio-manager.js
if (!window.AudioContext && !window.webkitAudioContext) {
  console.warn('Web Audio API 不支援，停用聲音功能');
  // 隱藏音量設定，靜音模式運行
}
```

### 15.3 存檔格式錯誤

```javascript
// storage.js
loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVE);
    if (!raw) return null;
    const save = JSON.parse(raw);
    if (save.version !== '1.0') throw new Error('版本不符');
    return save;
  } catch(e) {
    console.error('存檔讀取失敗，清除存檔', e);
    this.clearSave();
    return null;
  }
}
```

### 15.4 AI 超時保護

```javascript
// ai-hard.js
const AI_TIMEOUT = 2000; // 2 秒強制中斷
let startTime;

function minimax(state, depth, alpha, beta, isMax) {
  if (Date.now() - startTime > AI_TIMEOUT) {
    throw new Error('AI_TIMEOUT');
  }
  // ...正常計算...
}

// 若超時，回退到普通 AI 策略
```

---

## 16. 開發優先順序與里程碑

### 里程碑一：核心功能（MVP）

```
□ 資料夾結構建立
□ CSS 變數與重置
□ 棋盤 DOM 結構與渲染
□ 遊戲核心邏輯（board.js / rules.js / game.js）
□ 玩家互動（點擊落子）
□ 勝負判斷
□ 簡易 HUD
□ 主選單基本結構
```

### 里程碑二：AI 與完整遊戲流程

```
□ 簡單 AI
□ 普通 AI
□ 困難 AI（Minimax）
□ 難度選擇彈窗
□ 遊戲結果頁面
□ 悔棋功能
□ 重新開始
□ LocalStorage 存檔/讀檔
```

### 里程碑三：視覺與音效

```
□ 四種主題完整實現
□ 落子動畫
□ 勝利動畫（含彩帶效果）
□ Web Audio BGM 生成
□ 音效清單完整實現
□ 音量 5 倍設定
□ 棋盤活躍發光動畫
```

### 里程碑四：RWD 與多語系

```
□ 手機版完整 RWD（直向）
□ 手機版橫向佈局
□ 平板版佈局
□ i18n 系統實現
□ 繁體中文 / English / 日本語 語系檔
□ 語系即時切換
```

### 里程碑五：設定、說明與收尾

```
□ 設定頁面完整功能
□ 說明頁面（手風琴、圖示豐富）
□ 所有主題切換
□ 效能優化
□ 跨瀏覽器測試
□ 無障礙基礎調整
□ README 撰寫
```

---

## 附錄 A：CSS 變數完整清單

```css
/* css/base/variables.css */
:root {
  /* === 顏色（由主題覆蓋）=== */
  --color-bg-primary: #2C1810;
  --color-bg-secondary: #3D2314;
  --color-board-bg: #8B5E3C;
  --color-board-line: #5C3A1E;
  --color-board-active: #D4A76A;
  --color-board-inactive: #5C3A1E;
  --color-board-free: #8B7355;
  --color-player-x: #E8344A;
  --color-player-o: #1B8CCC;
  --color-text-primary: #F5E6D3;
  --color-text-secondary: #C4A882;
  --color-text-disabled: #7A6655;
  --color-btn-primary: #D4A76A;
  --color-btn-secondary: #5C3A1E;
  --color-btn-text: #2C1810;
  --color-btn-danger: #E8344A;
  --color-accent: #FFD700;
  --color-win-highlight: #FFD700;
  --color-overlay: rgba(0, 0, 0, 0.6);

  /* === 尺寸 === */
  --board-size: 550px;
  --cell-size: calc(var(--board-size) / 9);
  --border-width: 2px;
  --border-radius-sm: 6px;
  --border-radius-md: 12px;
  --border-radius-lg: 20px;

  /* === 間距 === */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;

  /* === 動畫 === */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --animation-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-index 層級 === */
  --z-board: 1;
  --z-hud: 10;
  --z-modal: 100;
  --z-toast: 200;
}
```

---

## 附錄 B：index.html 骨架

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="classic">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,
        maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title data-i18n="app.title">終極井字棋</title>

  <!-- CSS 載入 -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">
  <link rel="stylesheet" href="css/layout/grid.css">
  <link rel="stylesheet" href="css/layout/responsive.css">
  <link rel="stylesheet" href="css/components/board.css">
  <link rel="stylesheet" href="css/components/buttons.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/menu.css">
  <link rel="stylesheet" href="css/components/settings.css">
  <link rel="stylesheet" href="css/components/help.css">
  <link rel="stylesheet" href="css/components/hud.css">
  <link rel="stylesheet" href="css/components/animations.css">
  <link rel="stylesheet" href="css/themes/theme-classic.css" id="theme-stylesheet">
</head>
<body>

  <!-- 主選單 -->
  <div id="scene-home" class="scene active">
    <div class="home-container">
      <div class="home-title">
        <h1 data-i18n="app.title">終極井字棋</h1>
        <p data-i18n="app.subtitle">Ultimate Tic-Tac-Toe</p>
      </div>
      <nav class="home-nav">
        <button id="btn-start" class="btn btn-primary" data-i18n="menu.start">
          ▶ 開始遊戲
        </button>
        <button id="btn-continue" class="btn btn-secondary" data-i18n="menu.continue" disabled>
          ⏩ 繼續遊戲
        </button>
        <div class="home-secondary-btns">
          <button id="btn-help" class="btn btn-icon" data-i18n="menu.help">📖 說明</button>
          <button id="btn-settings" class="btn btn-icon" data-i18n="menu.settings">⚙️ 設定</button>
        </div>
      </nav>
      <div class="lang-switcher">
        <button class="lang-btn active" data-lang="zh-TW">繁中</button>
        <button class="lang-btn" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="ja">日本語</button>
      </div>
    </div>
  </div>

  <!-- 遊戲畫面 -->
  <div id="scene-game" class="scene">
    <header class="game-header">
      <button id="btn-back" class="btn-icon-sm">←</button>
      <span data-i18n="app.title">終極井字棋</span>
      <div class="header-actions">
        <button id="btn-mute" class="btn-icon-sm">🔊</button>
        <button id="btn-settings-ingame" class="btn-icon-sm">⚙️</button>
      </div>
    </header>
    <div class="game-hud" id="game-hud">
      <!-- 由 hud.js 動態生成 -->
    </div>
    <main class="game-board-container">
      <div id="mega-board" class="mega-board">
        <!-- 由 renderer.js 動態生成 9 個 .mini-board -->
      </div>
    </main>
    <footer class="game-footer">
      <button id="btn-restart" class="btn btn-secondary" data-i18n="game.restart">重新開始</button>
      <button id="btn-undo" class="btn btn-secondary" data-i18n="game.undo">悔棋</button>
    </footer>
  </div>

  <!-- 說明頁 -->
  <div id="scene-help" class="scene">
    <!-- 由 help.js 或靜態 HTML 組成 -->
  </div>

  <!-- 設定頁 -->
  <div id="scene-settings" class="scene">
    <!-- 設定表單 -->
  </div>

  <!-- 結果頁 -->
  <div id="scene-result" class="scene">
    <!-- 勝負結果 -->
  </div>

  <!-- 彈窗容器 -->
  <div id="modal-overlay" class="modal-overlay hidden">
    <div id="modal-content" class="modal-content">
      <!-- 由 modal.js 動態填充 -->
    </div>
  </div>

  <!-- JavaScript 載入 -->
  <script src="js/core/state.js"></script>
  <script src="js/core/board.js"></script>
  <script src="js/core/rules.js"></script>
  <script src="js/core/game.js"></script>
  <script src="js/ai/ai-evaluator.js"></script>
  <script src="js/ai/ai-easy.js"></script>
  <script src="js/ai/ai-normal.js"></script>
  <script src="js/ai/ai-hard.js"></script>
  <script src="js/i18n/zh-TW.js"></script>
  <script src="js/i18n/en.js"></script>
  <script src="js/i18n/ja.js"></script>
  <script src="js/i18n/i18n.js"></script>
  <script src="js/storage/storage.js"></script>
  <script src="js/audio/bgm-generator.js"></script>
  <script src="js/audio/sfx-generator.js"></script>
  <script src="js/audio/audio-manager.js"></script>
  <script src="js/ui/animations.js"></script>
  <script src="js/ui/modal.js"></script>
  <script src="js/ui/hud.js"></script>
  <script src="js/ui/renderer.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

---

*本規格書版本 v1.0.0，如需新增遊戲模式（雙人對戰、線上對戰）或擴充功能，請以此文件為基礎進行版本迭代。*
