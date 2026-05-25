# 圍棋遊戲 — 前端規格書

> **版本**：v1.0.0　**日期**：2026-05-25　**狀態**：草稿

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [目錄結構](#2-目錄結構)
3. [技術規範](#3-技術規範)
4. [畫面與流程設計](#4-畫面與流程設計)
5. [圍棋規則引擎](#5-圍棋規則引擎)
6. [AI 對手設計](#6-ai-對手設計)
7. [音訊系統](#7-音訊系統)
8. [RWD 響應式設計](#8-rwd-響應式設計)
9. [配色主題系統](#9-配色主題系統)
10. [字體規範](#10-字體規範)
11. [存檔與繼續遊戲](#11-存檔與繼續遊戲)
12. [設定系統](#12-設定系統)
13. [說明畫面](#13-說明畫面)
14. [效能與相容性](#14-效能與相容性)
15. [開發里程碑](#15-開發里程碑)

---

## 1. 專案概覽

### 1.1 目標

打造一款**純前端、零依賴、免 Build**的圍棋遊戲，使用者只需雙擊 `index.html` 即可在瀏覽器中遊玩。支援桌面與行動裝置，提供多種視覺主題、豐富音效，以及從隨機到 MCTS 高階演算法的 AI 對手。

### 1.2 核心要求摘要

| 項目 | 規格 |
|------|------|
| 執行方式 | 直接開啟 `index.html`，無需 Node / Server |
| 外部依賴 | 僅允許透過 CDN 引入（可離線 fallback） |
| 遊戲模式 | 單人 vs AI |
| 棋盤尺寸 | 9×9 / 13×13 / 19×19 |
| AI 難度 | 5 級（隨機 → Greedy → Heuristic → MCTS → MCTS+神經評估） |
| 主題色 | ≥ 6 種可切換配色主題 |
| 音效軌道 | ≥ 10 種不同音效 + 3 首背景音樂 |
| 存檔 | localStorage（最多 3 組存檔槽） |
| 語言 | 繁體中文（預設），英文切換 |

---

## 2. 目錄結構

```
go-game/
├── index.html                  # 唯一入口，引入所有 CSS / JS
│
├── css/
│   ├── reset.css               # CSS Reset
│   ├── variables.css           # CSS 自訂變數（主題色、字體、尺寸）
│   ├── layout.css              # 全域排版、Grid / Flex 骨架
│   ├── typography.css          # 字體大小、行距、標題層級
│   ├── animations.css          # 所有 @keyframes 動畫定義
│   ├── components/
│   │   ├── button.css          # 按鈕元件樣式
│   │   ├── modal.css           # 彈窗 / 對話框
│   │   ├── board.css           # 棋盤格線、棋子、座標標示
│   │   ├── scoreboard.css      # 計分板、倒數計時
│   │   ├── menu.css            # 主選單、選單動畫
│   │   ├── settings.css        # 設定面板
│   │   ├── tutorial.css        # 說明畫面
│   │   └── notification.css    # Toast 通知、提示框
│   └── themes/
│       ├── theme-classic.css   # 主題：經典木紋
│       ├── theme-dark.css      # 主題：暗夜星空
│       ├── theme-ocean.css     # 主題：深海藍
│       ├── theme-sakura.css    # 主題：櫻花粉
│       ├── theme-bamboo.css    # 主題：翠竹綠
│       └── theme-neon.css      # 主題：霓虹賽博
│
├── js/
│   ├── main.js                 # 應用程式入口、畫面路由
│   ├── config.js               # 全域常數設定（棋盤大小、AI參數）
│   ├── state.js                # 全域狀態管理（單一 State 物件）
│   ├── router.js               # 畫面切換控制器
│   │
│   ├── game/
│   │   ├── board.js            # 棋盤資料結構、落子驗證
│   │   ├── rules.js            # 圍棋規則（提子、劫、自殺、虛手）
│   │   ├── scoring.js          # 計分（日本規則 / 中國規則）
│   │   └── history.js          # 棋局歷史、悔棋
│   │
│   ├── ai/
│   │   ├── ai-controller.js    # AI 難度分發器
│   │   ├── ai-random.js        # 難度1：隨機合法落子
│   │   ├── ai-greedy.js        # 難度2：貪婪吃子
│   │   ├── ai-heuristic.js     # 難度3：啟發式評估
│   │   ├── ai-mcts.js          # 難度4：蒙地卡羅樹搜尋
│   │   └── ai-mcts-nn.js       # 難度5：MCTS + 神經網路評估函數
│   │
│   ├── audio/
│   │   ├── audio-manager.js    # 音效 / 音樂載入與播放控制
│   │   ├── audio-synth.js      # Web Audio API 合成音效（無需外部檔案）
│   │   └── audio-config.js     # 音效清單、BGM 清單、音量設定
│   │
│   ├── ui/
│   │   ├── board-renderer.js   # Canvas / SVG 棋盤繪製
│   │   ├── menu-ui.js          # 主選單互動邏輯
│   │   ├── game-ui.js          # 遊戲畫面 HUD（計分、計時、操作按鈕）
│   │   ├── settings-ui.js      # 設定面板邏輯
│   │   ├── tutorial-ui.js      # 說明畫面邏輯
│   │   ├── modal-ui.js         # 通用彈窗
│   │   ├── notification-ui.js  # Toast 通知
│   │   └── theme-switcher.js   # 主題切換邏輯
│   │
│   └── utils/
│       ├── storage.js          # localStorage 存取封裝
│       ├── i18n.js             # 多語言字串管理
│       ├── math-utils.js       # 座標轉換、距離計算
│       └── event-bus.js        # 輕量事件發布訂閱
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── bgm-menu.mp3        # 主選單背景音樂
│   │   │   ├── bgm-game.mp3        # 對局背景音樂
│   │   │   └── bgm-result.mp3      # 結果畫面音樂
│   │   └── sfx/
│   │       ├── stone-place.mp3     # 落子音
│   │       ├── stone-capture.mp3   # 提子音
│   │       ├── btn-click.mp3       # 按鈕點擊
│   │       ├── btn-hover.mp3       # 按鈕懸停
│   │       ├── game-start.mp3      # 開始對局
│   │       ├── game-over.mp3       # 遊戲結束
│   │       ├── win.mp3             # 勝利
│   │       ├── lose.mp3            # 失敗
│   │       ├── pass-turn.mp3       # 虛手
│   │       ├── undo.mp3            # 悔棋
│   │       ├── timer-tick.mp3      # 倒數計時滴答
│   │       └── ko-warning.mp3      # 劫警告
│   │
│   ├── images/
│   │   ├── logo.svg
│   │   ├── icon-*.svg              # UI 圖示
│   │   └── board-texture-*.jpg     # 各主題棋盤紋理
│   │
│   └── fonts/
│       ├── NotoSerifTC-*.woff2     # 思源宋體（繁中）
│       └── Cinzel-*.woff2          # 標題裝飾英文字體
│
├── locales/
│   ├── zh-TW.json              # 繁體中文字串
│   └── en.json                 # 英文字串
│
└── README.md
```

---

## 3. 技術規範

### 3.1 HTML 引入順序（`index.html`）

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="classic">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>圍棋</title>

  <!-- CSS：順序不可更動 -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/typography.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/components/button.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/board.css">
  <link rel="stylesheet" href="css/components/scoreboard.css">
  <link rel="stylesheet" href="css/components/menu.css">
  <link rel="stylesheet" href="css/components/settings.css">
  <link rel="stylesheet" href="css/components/tutorial.css">
  <link rel="stylesheet" href="css/components/notification.css">
  <!-- 主題預設：經典木紋 -->
  <link rel="stylesheet" href="css/themes/theme-classic.css" id="theme-stylesheet">
</head>
<body>
  <!-- 所有畫面容器在此，由 router.js 控制顯示 -->
  <div id="app">
    <div id="screen-menu"   class="screen"></div>
    <div id="screen-game"   class="screen hidden"></div>
    <div id="screen-result" class="screen hidden"></div>
    <div id="screen-tutorial" class="screen hidden"></div>
    <div id="screen-settings" class="screen hidden"></div>
  </div>
  <div id="modal-overlay" class="hidden"></div>
  <div id="toast-container"></div>

  <!-- JS：Config → Utils → 核心 → AI → Audio → UI → Main -->
  <script src="js/config.js"></script>
  <script src="js/utils/event-bus.js"></script>
  <script src="js/utils/storage.js"></script>
  <script src="js/utils/math-utils.js"></script>
  <script src="js/utils/i18n.js"></script>
  <script src="js/state.js"></script>
  <script src="js/game/board.js"></script>
  <script src="js/game/rules.js"></script>
  <script src="js/game/scoring.js"></script>
  <script src="js/game/history.js"></script>
  <script src="js/ai/ai-random.js"></script>
  <script src="js/ai/ai-greedy.js"></script>
  <script src="js/ai/ai-heuristic.js"></script>
  <script src="js/ai/ai-mcts.js"></script>
  <script src="js/ai/ai-mcts-nn.js"></script>
  <script src="js/ai/ai-controller.js"></script>
  <script src="js/audio/audio-config.js"></script>
  <script src="js/audio/audio-synth.js"></script>
  <script src="js/audio/audio-manager.js"></script>
  <script src="js/ui/theme-switcher.js"></script>
  <script src="js/ui/notification-ui.js"></script>
  <script src="js/ui/modal-ui.js"></script>
  <script src="js/ui/board-renderer.js"></script>
  <script src="js/ui/menu-ui.js"></script>
  <script src="js/ui/game-ui.js"></script>
  <script src="js/ui/settings-ui.js"></script>
  <script src="js/ui/tutorial-ui.js"></script>
  <script src="js/router.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### 3.2 模組溝通原則

- 所有模組掛載至 `window.GoGame` 命名空間，避免全域污染
- 模組間溝通使用 `EventBus`（發布 / 訂閱）
- 狀態集中管理於 `state.js`（單一 State 物件），各模組只能透過 `State.set()` / `State.get()` 讀寫

```js
// 範例：落子後通知 UI 刷新
EventBus.emit('board:updated', { x, y, color });
EventBus.on('board:updated', ({ x, y, color }) => BoardRenderer.render());
```

---

## 4. 畫面與流程設計

### 4.1 畫面清單

| 畫面 ID | 名稱 | 說明 |
|---------|------|------|
| `screen-menu` | 主選單 | 遊戲啟動後顯示的第一個畫面 |
| `screen-game` | 對局畫面 | 棋盤、HUD、操作按鈕 |
| `screen-result` | 結果畫面 | 勝負顯示、計分明細 |
| `screen-tutorial` | 說明畫面 | 圍棋規則圖文說明 |
| `screen-settings` | 設定畫面 | 主題、音量、難度、棋盤大小等 |

### 4.2 主選單（`screen-menu`）

```
┌─────────────────────────────────────┐
│           圍  棋                     │  ← 大標題（動態書法筆觸動畫）
│        Go ・ 바둑 ・ Igo              │  ← 副標題
│                                     │
│    ┌─────────────────────────┐      │
│    │       開始遊戲           │      │  → 進入棋局設定彈窗
│    ├─────────────────────────┤      │
│    │       繼續遊戲           │      │  → 讀取存檔（無存檔則灰掉）
│    ├─────────────────────────┤      │
│    │         說  明           │      │  → screen-tutorial
│    ├─────────────────────────┤      │
│    │         設  定           │      │  → screen-settings
│    └─────────────────────────┘      │
│                                     │
│  ♪ ◀ ▶  音樂控制       主題 🎨      │  ← 底部工具列
└─────────────────────────────────────┘
```

**開始遊戲彈窗**選項：
- 棋盤大小：9×9 / 13×13 / 19×19
- AI 難度：初學（1）/ 入門（2）/ 業餘（3）/ 強豪（4）/ 頂尖（5）
- 計時模式：無限制 / 每步 30s / 每步 60s / 讀秒制
- 貼目設定：0 / 5.5 / 6.5 / 7.5（黑棋貼給白棋）
- 計分規則：日本規則 / 中國規則
- 玩家執子：黑棋 / 白棋 / 隨機

### 4.3 對局畫面（`screen-game`）

```
┌──────────────────────────────────────────┐
│ ← 返回  【對局 #3】          ⏸ 暫停     │  ← 頂部列
├──────────────────────────────────────────┤
│  ⬛ 玩家  提子: 3   ⏱ 02:14   🤖 AI 中  │  ← HUD 列
├──────────────────────────────────────────┤
│                                          │
│          [ 棋 盤 Canvas ]                │
│                                          │
│  (座標 A-T 橫軸、1-19 縱軸)              │
│  (最後落子高亮顯示)                       │
│  (AI 思考中顯示動態指示器)                │
│                                          │
├──────────────────────────────────────────┤
│   虛手    悔棋    計分    認負    ⚙ 設定  │  ← 底部操作列
└──────────────────────────────────────────┘
```

- 棋盤使用 **Canvas** 繪製，點擊落子
- 落子動畫：棋子淡入 + 輕微縮放彈跳
- AI 思考期間：棋盤加遮罩 + 旋轉等待圖示 + 「AI 思考中…」文字
- 計時器倒數 < 10 秒時：文字變紅色 + 每秒播放 `timer-tick` 音效

### 4.4 結果畫面（`screen-result`）

- 大字顯示：「勝利！」或「落敗」（含動畫）
- 計分明細：地目、提子數、貼目、最終分數
- 棋局統計：落子數、耗時、AI 難度
- 按鈕：再來一局 / 返回主選單 / 儲存棋譜

---

## 5. 圍棋規則引擎

### 5.1 資料結構

```js
// board.js
// 棋盤以一維 Int8Array 儲存，0=空, 1=黑, 2=白
const board = new Int8Array(size * size);

// 座標轉換
const idx = (x, y) => y * size + x;
const xy  = (i)    => ({ x: i % size, y: Math.floor(i / size) });
```

### 5.2 核心規則（`rules.js`）

| 功能 | 說明 |
|------|------|
| `isLegalMove(board, x, y, color)` | 判斷落子合法性（禁入點 + 劫） |
| `getGroup(board, x, y)` | 找出連通棋群（BFS） |
| `getLiberties(board, group)` | 計算氣 |
| `captureStones(board, x, y, color)` | 落子後提掉無氣對手棋群 |
| `detectKo(boardHistory)` | 與歷史棋盤比對，偵測劫 |
| `isSuicide(board, x, y, color)` | 判斷自殺手（禁止） |

### 5.3 計分（`scoring.js`）

- **日本規則**：地目計算（空點 + 提子）
- **中國規則**：子空皆計（棋子數 + 空點控制）
- 雙方同時虛手 → 進入計分流程
- 死子標記：玩家可點選死子手動標記，雙方確認後計分

### 5.4 歷史記錄（`history.js`）

- 每步以 `{ move: [x,y], color, captures, boardSnapshot }` 存入 stack
- `undo()`：還原前一步，更新劫狀態
- 最大悔棋步數：由設定決定（預設 3 步，可改無限）

---

## 6. AI 對手設計

### 6.1 難度對照

| 等級 | 名稱 | 演算法 | 預估棋力 |
|------|------|--------|---------|
| 1 | 初學 | 純隨機合法落子 | 20kyu |
| 2 | 入門 | Greedy（最大化即時提子數） | 15kyu |
| 3 | 業餘 | Heuristic（眼位、邊界、影響力圖） | 10kyu |
| 4 | 強豪 | MCTS（UCB1，1000 次模擬） | 5kyu |
| 5 | 頂尖 | MCTS + 神經網路評估（輕量 NN） | 1dan+ |

### 6.2 MCTS 演算法（`ai-mcts.js`）

```
MCTS 四步驟（每次 AI 回合執行）：
1. Selection   ── 依 UCB1 公式從根節點選擇子節點
2. Expansion   ── 展開未訪問的合法落子節點
3. Simulation  ── 隨機 rollout 至終局（或深度上限）
4. Backprop    ── 反向傳播勝率至各祖先節點
```

**時間預算**：
- 難度4：最多 2 秒 / 步（或 1000 次模擬，取先到者）
- 難度5：最多 5 秒 / 步（含 NN 評估函數代替隨機 rollout）

### 6.3 輕量神經網路（`ai-mcts-nn.js`）

- 純 JS 實作，**不依賴** TensorFlow.js
- 輸入特徵（共 17 層 19×19）：
  - 己方棋子位置、對手棋子位置、最後落子、劫點、合法落子、各棋群氣數
- 輸出：Policy（各點落子機率）+ Value（局面勝率）
- 預訓練權重以 Base64 JSON 嵌入 `ai-mcts-nn.js`，無需下載

### 6.4 AI 反應時間模擬

- 難度 1-2：隨機延遲 300–800ms，模擬思考感
- 難度 3：500–1200ms
- 難度 4-5：實際 MCTS 計算時間（有 loading 動畫）

---

## 7. 音訊系統

### 7.1 架構說明

- 優先使用 **Web Audio API**（`AudioContext`）合成音效，不依賴外部音訊檔案
- 若 `assets/audio/` 資料夾內有對應 MP3 則優先載入 MP3
- 首次使用者互動後才建立 `AudioContext`（瀏覽器政策）

### 7.2 音效清單

| 音效 ID | 描述 | 合成方法 |
|---------|------|---------|
| `stone-place-black` | 黑棋落子（厚重木聲） | 低頻噪音 + 短衰減 |
| `stone-place-white` | 白棋落子（清脆石聲） | 高頻正弦 + 短衰減 |
| `stone-capture-1` | 提1子 | 短促敲擊 |
| `stone-capture-many` | 提多子 | 連續敲擊序列 |
| `btn-click` | 按鈕點擊 | 短促 tick |
| `btn-hover` | 按鈕懸停 | 極短高頻 pip |
| `game-start` | 開局鑼聲 | 低頻鑼鳴（正弦 + 衰減） |
| `game-over` | 棋局結束 | 長音衰減 |
| `win-fanfare` | 勝利音效 | 上升音階序列 |
| `lose-sound` | 落敗音效 | 下降悲傷音調 |
| `pass-turn` | 虛手 | 空氣感短音 |
| `undo` | 悔棋 | 倒帶感音效 |
| `timer-tick` | 倒數滴答 | 短促 metronome tick |
| `ko-warning` | 劫警告 | 急促雙音 |
| `theme-change` | 主題切換 | 魔法音效 |

### 7.3 背景音樂

| BGM ID | 使用畫面 | 風格描述 |
|--------|---------|---------|
| `bgm-menu` | 主選單、設定、說明 | 悠閒古典古琴風，輕柔循環 |
| `bgm-game` | 對局進行中 | 沉靜冥想感，低強度氛圍 |
| `bgm-result` | 結果畫面 | 短暫收尾，勝負不同版本 |

### 7.4 畫面切換音樂規則

```
主選單 → 說明、設定：bgm-menu 持續播放（不中斷）
主選單 → 開始對局：bgm-menu 淡出（1s）→ bgm-game 淡入（1s）
對局結束：bgm-game 淡出（2s）→ bgm-result 播放一次
結果畫面 → 主選單：bgm-result 淡出 → bgm-menu 淡入
```

### 7.5 音訊管理介面（`audio-manager.js`）

```js
AudioManager.play(sfxId)              // 播放一次性音效
AudioManager.playBGM(bgmId, fade=true) // 播放背景音樂（可淡入）
AudioManager.stopBGM(fade=true)        // 停止背景音樂（可淡出）
AudioManager.setMasterVolume(0~1)      // 主音量
AudioManager.setSFXVolume(0~1)         // 音效音量
AudioManager.setMusicVolume(0~1)       // 音樂音量
AudioManager.toggleMute()             // 全體靜音切換
```

---

## 8. RWD 響應式設計

### 8.1 斷點定義

| 斷點名稱 | 寬度範圍 | 目標裝置 |
|---------|---------|---------|
| `xs` | < 480px | 小型手機（直向） |
| `sm` | 480–767px | 手機（橫向）/ 小平板 |
| `md` | 768–1023px | 平板 |
| `lg` | 1024–1279px | 小型桌面 |
| `xl` | ≥ 1280px | 大型桌面 |

### 8.2 棋盤尺寸自適應

```js
// board-renderer.js 計算邏輯
function calcBoardSize() {
  const maxW = window.innerWidth  * 0.95;
  const maxH = window.innerHeight * 0.70; // 保留 HUD 空間
  const cellSize = Math.floor(Math.min(maxW, maxH) / (boardSize + 1));
  return { cellSize, canvasSize: cellSize * (boardSize + 1) };
}
window.addEventListener('resize', debounce(calcBoardSize, 150));
```

### 8.3 觸控支援

- 棋盤點擊同時監聽 `touchend`（防止行動裝置 300ms 延遲）
- 使用 `touch-action: none` 防止手勢衝突
- 落子偵測容差：±1 個格子間距（方便手指操作）
- 長按棋子：顯示該棋群的氣數（行動裝置 hover 替代）

### 8.4 行動裝置 UI 調整

- `xs` / `sm` 時底部操作列改為可滾動水平列表
- 彈窗最大寬度設為 `min(90vw, 480px)`
- Toast 通知出現於畫面頂端（避免被底部系統手勢擋住）

---

## 9. 配色主題系統

### 9.1 主題切換機制

```html
<!-- 切換主題只需更換此 link 的 href -->
<link rel="stylesheet" href="css/themes/theme-classic.css" id="theme-stylesheet">
```

```js
// theme-switcher.js
function switchTheme(themeName) {
  document.getElementById('theme-stylesheet').href =
    `css/themes/theme-${themeName}.css`;
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('go:theme', themeName);
  AudioManager.play('theme-change');
}
```

### 9.2 六種主題色規格

每個主題定義以下 CSS 變數：

```css
:root {
  --bg-primary     /* 主背景色 */
  --bg-secondary   /* 次要背景（卡片、面板） */
  --bg-board       /* 棋盤底色 */
  --line-color     /* 棋盤格線色 */
  --stone-black    /* 黑棋色 */
  --stone-white    /* 白棋色 */
  --accent-primary /* 強調色（按鈕、選中狀態） */
  --accent-hover   /* 強調色 Hover */
  --text-primary   /* 主要文字色 */
  --text-secondary /* 次要文字色 */
  --text-on-accent /* 強調色上的文字色 */
  --border-color   /* 邊框色 */
  --shadow-color   /* 陰影色 */
}
```

| 主題 | bg-primary | bg-board | accent-primary | 風格 |
|------|-----------|---------|----------------|------|
| classic（木紋） | `#F5DEB3` | `#DEB887` | `#8B4513` | 溫暖日系傳統 |
| dark（暗夜） | `#1A1A2E` | `#16213E` | `#E94560` | 深邃高對比 |
| ocean（深海） | `#0D3B66` | `#0A2A4A` | `#00B4D8` | 清涼藍色系 |
| sakura（櫻花） | `#FFF0F5` | `#FFE4EE` | `#FF69B4` | 柔和粉色系 |
| bamboo（翠竹） | `#1B4332` | `#2D6A4F` | `#74C69D` | 自然綠色系 |
| neon（霓虹） | `#0D0D0D` | `#111111` | `#00FF88` | 賽博龐克感 |

---

## 10. 字體規範

### 10.1 字體載入

```css
/* variables.css */
@font-face {
  font-family: 'NotoSerifTC';
  src: url('../assets/fonts/NotoSerifTC-Regular.woff2') format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'NotoSerifTC';
  src: url('../assets/fonts/NotoSerifTC-Bold.woff2') format('woff2');
  font-weight: 700;
}
/* 無法載入時 fallback */
--font-body:    'NotoSerifTC', 'Noto Serif TC', serif;
--font-display: 'Cinzel', 'NotoSerifTC', serif;
--font-mono:    'Courier New', monospace;
```

### 10.2 字體大小階層

| Token | 大小 | 用途 |
|-------|------|------|
| `--fs-xs` | 14px | 座標標示、版本號 |
| `--fs-sm` | 16px | 說明文字、標籤 |
| `--fs-md` | 20px | 一般內文、按鈕 |
| `--fs-lg` | 26px | 小標題、HUD 數據 |
| `--fs-xl` | 36px | 章節標題、計分 |
| `--fs-2xl` | 52px | 主選單標題 |
| `--fs-3xl` | 72px | 勝負大字 |

> **原則**：全站最小字體為 **14px**（`--fs-xs`），任何說明文字不得低於 **16px**

---

## 11. 存檔與繼續遊戲

### 11.1 存檔格式（localStorage key：`go:save:{slot}`）

```json
{
  "version": "1.0",
  "timestamp": 1716854400000,
  "settings": {
    "boardSize": 19,
    "difficulty": 4,
    "komi": 6.5,
    "rules": "japanese",
    "playerColor": "black",
    "timeMode": "per-move-60"
  },
  "gameState": {
    "board": "base64-encoded-Int8Array",
    "moveNumber": 42,
    "currentTurn": "white",
    "captures": { "black": 3, "white": 1 },
    "koPoint": null,
    "consecutivePasses": 0
  },
  "history": [
    { "move": [3, 3], "color": "black", "captures": [] },
    "..."
  ],
  "elapsedTime": 180
}
```

### 11.2 存檔 UI

- 最多 **3 個存檔槽**
- 每槽顯示：縮圖（Canvas 截圖）、日期時間、棋局進度（第 N 手）、難度
- 選擇存檔槽後可繼續或刪除
- 對局中按「暫停」時自動觸發快速存檔至最近使用槽

---

## 12. 設定系統

### 12.1 設定項目清單

**視覺**
- 主題選擇（6 種，圖示預覽）
- 顯示座標：開 / 關
- 顯示最後落子標示：開 / 關
- 顯示影響力圖：開 / 關（半透明覆蓋層）

**音訊**
- 主音量：0–100 滑桿
- 音效音量：0–100 滑桿
- 背景音樂音量：0–100 滑桿
- 靜音：開關按鈕

**遊戲**
- 預設棋盤大小：9×9 / 13×13 / 19×19
- 預設 AI 難度：1–5
- 預設計時模式
- 預設貼目
- 悔棋次數限制：0 / 3 / 5 / 無限
- 語言：繁體中文 / English

**進階**
- AI 思考時間上限（秒）
- MCTS 模擬次數（難度 4–5）
- 重置所有設定

### 12.2 設定持久化

```js
// storage.js
Storage.saveSettings(settings);  // 寫入 localStorage: go:settings
Storage.loadSettings();           // 讀出設定，若無則返回預設值
```

---

## 13. 說明畫面

### 13.1 章節結構

1. **圍棋簡介** — 歷史、起源、文化意義
2. **基本規則**
   - 棋盤與棋子介紹（互動示意圖）
   - 輪流落子
   - 氣的概念（動態高亮示意）
   - 提子規則（動畫演示）
3. **特殊規則**
   - 劫（Ko）規則 — 動畫說明
   - 禁入點（自殺手）
   - 虛手（Pass）
4. **計分方式**
   - 日本規則
   - 中國規則
5. **遊戲操作說明** — 本程式的操作介面說明
6. **AI 對手介紹** — 各難度說明

### 13.2 互動示意圖

- 使用 Canvas 繪製小型示意棋盤（9×9）
- 說明「提子」時：動畫依序高亮被圍棋子 → 閃爍 → 消失
- 說明「劫」時：動畫循環展示劫的交替提子狀況

---

## 14. 效能與相容性

### 14.1 目標效能

| 指標 | 目標 |
|------|------|
| 首次載入時間（19×19 棋盤）| < 2s（4G 網路）|
| 落子響應時間（排除 AI 計算）| < 50ms |
| AI 回應時間（難度 1-3）| < 1.2s |
| AI 回應時間（難度 4）| < 2.5s |
| AI 回應時間（難度 5）| < 6s |
| Canvas 重繪 FPS | ≥ 60fps |
| 記憶體使用（19×19 + 難度5）| < 150MB |

### 14.2 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

### 14.3 離線支援（選用）

- 可加入 `manifest.json` + `service-worker.js` 使其成為 PWA
- 安裝後可完全離線遊玩

---

## 15. 開發里程碑

| 里程碑 | 項目 | 預估工時 |
|--------|------|---------|
| M1 | 目錄結構建立、HTML 骨架、CSS 變數系統 | 4h |
| M2 | 棋盤 Canvas 繪製、點擊落子 | 6h |
| M3 | 圍棋規則引擎（落子、提子、劫、計分）| 12h |
| M4 | AI 難度 1–3（隨機、Greedy、Heuristic）| 8h |
| M5 | AI 難度 4（MCTS） | 12h |
| M6 | AI 難度 5（MCTS + NN）| 16h |
| M7 | 音訊系統（Web Audio API 合成）| 8h |
| M8 | 主選單、結果畫面、畫面路由 | 6h |
| M9 | 設定系統、存檔系統 | 6h |
| M10 | 說明畫面 | 4h |
| M11 | 6 種主題 CSS | 4h |
| M12 | RWD 調整、觸控優化 | 6h |
| M13 | 動畫、音效細節、整合測試 | 8h |
| **總計** | | **~100h** |

---

## 附錄 A：`config.js` 預設常數

```js
window.GoGame = window.GoGame || {};

GoGame.CONFIG = {
  BOARD_SIZES: [9, 13, 19],
  DEFAULT_BOARD_SIZE: 19,
  DEFAULT_DIFFICULTY: 3,
  DEFAULT_KOMI: 6.5,
  DEFAULT_RULES: 'japanese',       // 'japanese' | 'chinese'
  DEFAULT_TIME_MODE: 'unlimited',  // 'unlimited' | 'per-move-30' | 'per-move-60' | 'byo-yomi'
  MAX_UNDO_STEPS: 3,
  MAX_SAVE_SLOTS: 3,
  AI_MCTS_SIMULATIONS: { 4: 1000, 5: 3000 },
  AI_TIME_LIMIT_MS:    { 4: 2000, 5: 5000 },
  ANIMATION_DURATION_MS: 300,
  TOAST_DURATION_MS: 2500,
  AUDIO_FADE_MS: 1000,
};
```

---

## 附錄 B：EventBus 事件清單

| 事件名稱 | 發送者 | 訂閱者 | 資料 |
|---------|--------|--------|------|
| `game:start` | menu-ui | game-ui, audio | 遊戲設定 |
| `board:move` | game-ui | board, rules, audio | `{x, y, color}` |
| `board:updated` | rules | board-renderer | 完整棋盤狀態 |
| `stone:captured` | rules | audio, game-ui | `{count, color}` |
| `ai:thinking` | ai-controller | game-ui | `{difficulty}` |
| `ai:move-ready` | ai-controller | game-ui | `{x, y}` |
| `game:pass` | game-ui | rules, audio | `{color}` |
| `game:undo` | game-ui | history, audio | — |
| `game:over` | rules | router, audio | `{winner, score}` |
| `audio:play` | * | audio-manager | `{id}` |
| `theme:change` | theme-switcher | all | `{theme}` |
| `settings:updated` | settings-ui | * | 設定物件 |

---

*本規格書為開發基準文件，實作時若有技術調整請同步更新本文件。*
