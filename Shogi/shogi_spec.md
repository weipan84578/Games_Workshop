# 將棋（Shogi）純前端遊戲完整規格書

**版本：** 1.0.0
**最後更新：** 2026-05-22
**目標平台：** 桌機 / 行動裝置（RWD）
**技術限制：** 純前端，無需任何 Build 工具或 Server，點擊 `index.html` 即可遊玩

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [檔案結構](#3-檔案結構)
4. [遊戲規則引擎](#4-遊戲規則引擎)
5. [AI 演算法](#5-ai-演算法)
6. [畫面設計規格](#6-畫面設計規格)
7. [UI 元件清單](#7-ui-元件清單)
8. [音樂與音效系統](#8-音樂與音效系統)
9. [行動裝置適配](#9-行動裝置適配)
10. [遊戲狀態管理](#10-遊戲狀態管理)
11. [設定系統](#11-設定系統)
12. [資料流程圖](#12-資料流程圖)
13. [開發里程碑](#13-開發里程碑)

---

## 1. 專案概覽

### 1.1 專案目標

開發一款可在瀏覽器直接執行的將棋遊戲，提供人機對戰（玩家 vs AI）功能。不依賴任何後端服務、打包工具或 CDN 以外的外部資源，確保離線環境下可正常運作（音效除外，音效以 Web Audio API 程式化生成）。

### 1.2 核心功能

| 功能 | 說明 |
|------|------|
| 將棋完整規則 | 包含升變、打入、王手判斷、詰將 |
| 人機對戰 | 玩家執先手（黑方），AI 執後手（白方）|
| AI 難度選擇 | 入門 / 初級 / 中級 / 高級 四段 |
| 音樂系統 | 背景音樂（Web Audio API 合成）|
| 音效系統 | 落子聲、升變聲、王手警告音、勝負音 |
| 行動裝置支援 | 完整 RWD，支援觸控操作 |
| 遊戲紀錄 | 顯示棋譜（KIF 格式簡化版）|
| 悔棋功能 | 最多可悔棋 10 步 |
| 設定頁面 | 難度、音量、字體大小、棋盤主題 |

### 1.3 不在範疇內（Out of Scope）

- 雙人對戰（線上或本機）
- 棋譜匯入／匯出
- 帳號系統、排行榜
- 多語言（本版本僅支援繁體中文）

---

## 2. 技術架構

### 2.1 技術選型

```
純 HTML5 + CSS3 + Vanilla JavaScript（ES2020）
Web Audio API        → 音樂、音效合成
localStorage         → 設定儲存、棋局自動儲存
Canvas API           → 棋盤繪製（可選，依實作選擇 DOM 或 Canvas）
CSS Custom Properties → 主題切換
```

### 2.2 不使用任何外部依賴

- ✅ 不需要 npm / yarn
- ✅ 不需要 webpack / vite / rollup
- ✅ 不需要 React / Vue / Angular
- ✅ 不需要任何 CDN 資源（音效由 Web Audio API 程式化生成）
- ✅ 雙擊 `index.html` 即可啟動

### 2.3 瀏覽器支援

| 瀏覽器 | 最低版本 | 備註 |
|--------|---------|------|
| Chrome | 90+ | 主要測試環境 |
| Firefox | 88+ | 完整支援 |
| Safari | 14+ | iOS 行動端主要瀏覽器 |
| Edge | 90+ | 完整支援 |

---

## 3. 檔案結構

```
shogi/
├── index.html              # 入口檔案，遊戲主殼層
├── css/
│   ├── reset.css           # CSS Reset
│   ├── variables.css       # CSS Custom Properties（顏色、字體、尺寸）
│   ├── layout.css          # 主版型佈局
│   ├── board.css           # 棋盤樣式
│   ├── pieces.css          # 棋子樣式
│   ├── ui.css              # 按鈕、Modal、面板等元件樣式
│   ├── animations.css      # 動畫效果
│   └── mobile.css          # 行動裝置 Media Queries
├── js/
│   ├── main.js             # 進入點，初始化所有模組
│   ├── game/
│   │   ├── constants.js    # 棋子代碼、棋盤常數定義
│   │   ├── board.js        # 棋盤狀態管理
│   │   ├── rules.js        # 將棋規則引擎（合法手生成、王手判斷）
│   │   ├── pieces.js       # 棋子移動規則定義
│   │   └── history.js      # 棋譜記錄、悔棋邏輯
│   ├── ai/
│   │   ├── ai.js           # AI 主控制器
│   │   ├── evaluator.js    # 局面評估函數
│   │   ├── minimax.js      # Minimax + Alpha-Beta 剪枝
│   │   └── movesorter.js   # 手順排序（提升剪枝效率）
│   ├── ui/
│   │   ├── renderer.js     # 棋盤 & 棋子渲染
│   │   ├── input.js        # 滑鼠 & 觸控事件處理
│   │   ├── screens.js      # 畫面切換管理（主選單、遊戲、設定、結算）
│   │   ├── modal.js        # Modal 彈窗（升變選擇、確認對話框）
│   │   └── sidebar.js      # 持駒欄、棋譜欄渲染
│   ├── audio/
│   │   ├── audio.js        # Web Audio API 初始化 & 主控
│   │   ├── music.js        # 背景音樂合成
│   │   └── sfx.js          # 音效合成
│   └── utils/
│       ├── storage.js      # localStorage 讀寫封裝
│       └── helpers.js      # 通用工具函數
└── assets/
    └── fonts/              # （可選）自訂字體，若不使用則 fallback 系統字體
```

---

## 4. 遊戲規則引擎

### 4.1 棋盤定義

```
9×9 格棋盤，座標系統：
  - 行（rank）：1～9，由上至下
  - 列（file）：1～9，由右至左（日本將棋慣例）
  - 表示法：(file, rank)，例如 (7,7) 代表 7七

陣營：
  - SENTE（先手/黑方）：玩家，棋子向上移動（rank 減少）
  - GOTE（後手/白方）：AI，棋子向下移動（rank 增加）
```

### 4.2 棋子種類

| 代碼 | 棋子名稱 | 漢字 | 英文 | 升變後 | 升變代碼 |
|------|---------|------|------|--------|---------|
| `FU` | 步兵 | 歩 | Pawn | 成步 | `TO` |
| `KY` | 香車 | 香 | Lance | 成香 | `NY` |
| `KE` | 桂馬 | 桂 | Knight | 成桂 | `NK` |
| `GI` | 銀將 | 銀 | Silver | 成銀 | `NG` |
| `KI` | 金將 | 金 | Gold | ─ | ─ |
| `KA` | 角行 | 角 | Bishop | 龍馬 | `UM` |
| `HI` | 飛車 | 飛 | Rook | 龍王 | `RY` |
| `OU` | 玉將/王將 | 王/玉 | King | ─ | ─ |
| `TO` | 成步 | と | Promoted Pawn | ─ | ─ |
| `NY` | 成香 | 杏 | Promoted Lance | ─ | ─ |
| `NK` | 成桂 | 今 | Promoted Knight | ─ | ─ |
| `NG` | 成銀 | 全 | Promoted Silver | ─ | ─ |
| `UM` | 龍馬 | 馬 | Horse (Promoted Bishop) | ─ | ─ |
| `RY` | 龍王 | 龍 | Dragon (Promoted Rook) | ─ | ─ |

### 4.3 各棋子移動規則

#### 步兵（FU）
- 向前移動一格（先手向上，後手向下）
- 禁手：不可打入已有步兵的同一列（二步）
- 禁手：不可打入致詰的步兵（打步詰）

#### 香車（KY）
- 向前移動任意格數，不可跨越棋子

#### 桂馬（KE）
- 向前跳躍：前進兩格 ± 左右一格（可跨越棋子）
- 只有兩個落點

#### 銀將（GI）
- 向前三方向、向後左右各一格（共五方向）

#### 金將（KI）
- 前、左、右、後各一格，及前左、前右（共六方向）
- 成步、成香、成桂、成銀的移動規則與金將相同

#### 角行（KA）
- 斜四方向任意格數，不可跨越棋子

#### 飛車（HI）
- 直四方向任意格數，不可跨越棋子

#### 龍馬（UM）
- 角行移動 + 上下左右各一格

#### 龍王（RY）
- 飛車移動 + 斜四方向各一格

#### 玉將（OU）
- 八方向各一格
- 不可移動至被對方棋子攻擊的格子

### 4.4 升變規則

- 升變區（敵陣）：先手為第 1～3 行，後手為第 7～9 行
- 棋子進入、在內部移動、或離開敵陣時可選擇升變
- 強制升變情況：
  - 步兵、香車到達最深處（第 1 行先手 / 第 9 行後手）
  - 桂馬到達最深兩行（第 1～2 行先手 / 第 8～9 行後手）

### 4.5 打入規則

- 從持駒中選取棋子放置到空格
- 所有打入棋子均視為未升變狀態
- 禁止打入後無法移動的位置（步、香：最深行；桂：最深二行）
- 禁止二步（同一列已有己方步兵）
- 禁止打步詰（打入步兵直接造成對方詰將）

### 4.6 勝負判定

- **勝利**：對方玉將陷入詰將（無法解除的王手）
- **負**：自方玉將陷入詰將
- **投了**（認輸）：玩家可主動選擇投了
- **入玉**（特殊規則，本版本暫不實作）

### 4.7 合法手生成演算法

```
function generateLegalMoves(board, player):
  candidateMoves = []

  // 1. 棋盤上棋子的移動
  for each piece on board belonging to player:
    for each possible destination:
      if destination is valid and not blocked:
        candidateMoves.add(move)

  // 2. 持駒打入
  for each piece in player's hand:
    for each empty square on board:
      if drop is legal (no nifu, no pawn drop checkmate, etc.):
        candidateMoves.add(dropMove)

  // 3. 過濾自投王手
  legalMoves = []
  for each move in candidateMoves:
    applyMove(board, move)
    if not isInCheck(board, player):
      legalMoves.add(move)
    undoMove(board, move)

  return legalMoves
```

---

## 5. AI 演算法

### 5.1 演算法概覽

採用 **Minimax 搜尋** 搭配 **Alpha-Beta 剪枝** 優化，並使用靜態局面評估函數（Evaluation Function）。

```
AI 架構
├── Minimax with Alpha-Beta Pruning
├── Move Ordering（手順排序提升剪枝效果）
├── Quiescence Search（靜止搜尋，避免水平線效應）
└── Static Evaluation Function
    ├── 材料值（棋子價值）
    ├── 位置獎勵（Position Bonus）
    ├── 王安全度
    └── 機動性
```

### 5.2 搜尋深度設定

| 難度 | 搜尋深度 | 靜止搜尋深度 | 預計思考時間 |
|------|---------|------------|------------|
| 入門（Beginner） | 1 | 0 | < 0.1 秒 |
| 初級（Easy） | 2 | 2 | < 0.5 秒 |
| 中級（Medium） | 3 | 3 | 1～3 秒 |
| 高級（Hard） | 4 | 4 | 3～10 秒 |

> 高難度時使用 `setTimeout` / `requestAnimationFrame` 避免 UI 凍結，可選用 Web Worker 進一步優化。

### 5.3 棋子基礎價值（Material Value）

| 棋子 | 價值 | 升變後 | 升變後價值 |
|------|------|--------|-----------|
| 步兵（FU） | 100 | と（TO） | 600 |
| 香車（KY） | 300 | 成香（NY） | 600 |
| 桂馬（KE） | 350 | 成桂（NK） | 600 |
| 銀將（GI） | 600 | 成銀（NG） | 650 |
| 金將（KI） | 700 | ─ | ─ |
| 角行（KA） | 1000 | 龍馬（UM） | 1500 |
| 飛車（HI） | 1200 | 龍王（RY） | 1800 |
| 玉將（OU） | 99999 | ─ | ─ |

### 5.4 局面評估函數

```javascript
function evaluate(board, player):
  score = 0

  // 1. 材料值差
  for each piece on board:
    if piece.owner == player:
      score += PIECE_VALUE[piece.type]
    else:
      score -= PIECE_VALUE[piece.type]

  // 2. 持駒加成（持有棋子有附加價值）
  for each piece in player.hand:
    score += HAND_BONUS[piece.type]

  // 3. 位置獎勵（棋子在特定位置有加分）
  score += getPositionBonus(board, player)

  // 4. 王安全度（王周圍的防守棋子數量）
  score += getKingSafety(board, player)

  // 5. 機動性（合法手的數量差異）
  score += getMobility(board, player) * 5

  return score
```

### 5.5 手順排序（Move Ordering）

為提升 Alpha-Beta 剪枝效率，以下優先順序排列候選手：

1. 詰將手（直接獲勝）
2. 吃子手（依被吃棋子價值排序）
3. 升變手
4. 打入手
5. 一般移動（依啟發式評分排序）

### 5.6 Minimax 虛擬碼

```javascript
function minimax(board, depth, alpha, beta, isMaximizing):
  if depth == 0 or isTerminal(board):
    return quiescenceSearch(board, alpha, beta)

  moves = generateLegalMoves(board, currentPlayer)
  sortMoves(moves)  // Move Ordering

  if isMaximizing:
    maxEval = -Infinity
    for each move in moves:
      applyMove(board, move)
      eval = minimax(board, depth-1, alpha, beta, false)
      undoMove(board, move)
      maxEval = max(maxEval, eval)
      alpha = max(alpha, eval)
      if beta <= alpha: break  // Beta Cutoff
    return maxEval
  else:
    minEval = +Infinity
    for each move in moves:
      applyMove(board, move)
      eval = minimax(board, depth-1, alpha, beta, true)
      undoMove(board, move)
      minEval = min(minEval, eval)
      beta = min(beta, eval)
      if beta <= alpha: break  // Alpha Cutoff
    return minEval
```

---

## 6. 畫面設計規格

### 6.1 畫面流程

```
[ 主選單畫面 ]
      │
      ├─── 開始遊戲 ──→ [ 難度選擇畫面 ] ──→ [ 遊戲畫面 ]
      │                                             │
      ├─── 設定 ──→ [ 設定畫面 ]               [ 結算畫面 ]
      │                                             │
      └─── 說明 ──→ [ 規則說明畫面 ]        回主選單 / 再玩一次
```

### 6.2 主選單畫面

**視覺設計：**
- 背景：深色木紋質感（CSS 漸層 + noise 模擬），配合金色裝飾框線
- 遊戲標題「將棋」使用大型漢字字體，字號 ≥ 96px（桌機）/ 64px（手機）
- 字體選用：`Noto Serif CJK TC`（Google Fonts CDN 或 system-ui fallback）
- 副標題「SHOGI」英文小字，字號 18px，間距加大，金色

**按鈕清單：**
- 開始遊戲（主要按鈕，突出顯示）
- 繼續上局（若有儲存棋局，否則灰化）
- 設定
- 規則說明

**按鈕字體大小：** 桌機 22px，手機 20px（最小不低於 18px）

### 6.3 難度選擇畫面

- 4 個難度卡片，顯示難度名稱 + 圖示 + 簡短描述
- 字號：難度名稱 26px，描述文字 16px
- 選取後有動態高亮效果，確認按鈕觸發進入遊戲

### 6.4 遊戲畫面佈局

#### 桌機版（> 768px）

```
┌─────────────────────────────────────────────────────┐
│  [LOGO 小]        將棋         [設定] [音樂] [選單] │  Header (56px)
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│  後手（AI）  │      9×9 棋盤        │    棋譜欄      │
│  持駒區      │   （正方形置中）     │              │
│              │                      │               │
├──────────────┤                      ├───────────────┤
│              │                      │  [悔棋] [投了] │
│  先手（玩家）│                      │               │
│  持駒區      │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

#### 手機版（≤ 768px）

```
┌──────────────────────────┐
│  AI 持駒    [設定][選單] │  Header (48px)
├──────────────────────────┤
│                          │
│        9×9 棋盤           │  （全寬，正方形）
│                          │
├──────────────────────────┤
│  玩家持駒                │
├─────────────┬────────────┤
│  [悔棋]     │  [投了]    │
└─────────────┴────────────┘
  （棋譜欄摺疊為下拉抽屜）
```

### 6.5 棋盤視覺規格

- 棋盤格線：深棕色（`#5C3317`）
- 棋盤底色：木色（`#F4C87B`）
- 星位（9路星）：在 (3,3)、(3,7)、(7,3)、(7,7) 標示小圓點
- 格子大小：桌機 64px × 64px，平板 52px × 52px，手機自適應（`vw` 單位）
- 選中棋子高亮：格子背景 `rgba(100, 200, 100, 0.5)`
- 合法落點提示：格子背景 `rgba(200, 200, 100, 0.4)` + 圓形提示點
- 最後一手標記：格子邊框金色 `2px`

### 6.6 棋子視覺規格

- 形狀：五邊形（上窄下寬），使用 CSS `clip-path` 或 SVG 繪製
- 先手棋子（玩家）：淺木色底 `#FAE0A0`，黑色文字
- 後手棋子（AI）：旋轉 180°（方向朝向自方）
- 升變棋子：文字顏色改為深紅色 `#C0392B`
- 字體大小：桌機 18px（大棋子）/ 12px（小標示），手機自適應
- 棋子字體：`Noto Serif CJK TC`，`font-weight: 700`

**棋子字體大小規格（重要）：**

| 裝置 | 棋子主字 | 棋子副字（升變/持駒數量） |
|------|---------|------------------------|
| 桌機（≥1024px） | 22px | 14px |
| 平板（768～1023px） | 18px | 12px |
| 手機（≤767px） | 最小 14px（動態計算） | 10px |

### 6.7 設定畫面字體規格

設定畫面所有可讀文字不得小於以下標準：

| 元素 | 桌機最小字號 | 手機最小字號 |
|------|------------|------------|
| 區塊標題 | 24px | 20px |
| 選項標籤 | 18px | 16px |
| 說明文字 | 16px | 15px |
| 按鈕文字 | 18px | 16px |
| 輸入欄位 | 18px | 16px |

### 6.8 主色調與主題

**預設主題（和風暗色）：**

```css
--bg-primary:      #1A1208;   /* 深墨褐色背景 */
--bg-secondary:    #2D1F0A;   /* 次要背景 */
--surface:         #3E2B0F;   /* 卡片/面板底色 */
--board-color:     #F4C87B;   /* 棋盤木色 */
--board-line:      #5C3317;   /* 棋盤格線 */
--piece-base:      #FAE0A0;   /* 棋子底色 */
--piece-text:      #1A0A00;   /* 棋子文字 */
--piece-promoted:  #C0392B;   /* 升變棋子文字 */
--accent-gold:     #D4AF37;   /* 金色強調 */
--text-primary:    #F5E6C8;   /* 主要文字 */
--text-secondary:  #A89060;   /* 次要文字 */
--btn-primary:     #8B4513;   /* 主要按鈕底色 */
--btn-hover:       #A0522D;   /* 按鈕懸停 */
--highlight-move:  rgba(100, 200, 100, 0.5);   /* 選中高亮 */
--highlight-legal: rgba(200, 200, 100, 0.4);   /* 合法手提示 */
```

**可選主題（淺色木紋）：**

```css
--bg-primary:   #F0E6D0;
--surface:      #E8D5B0;
--text-primary: #2C1810;
（其餘保持相近木色系）
```

### 6.9 動畫規格

| 動畫 | 持續時間 | 緩動函數 | 說明 |
|------|---------|---------|------|
| 棋子移動 | 200ms | ease-out | 棋子從起點滑至終點 |
| 棋子吃取消失 | 150ms | ease-in | 被吃棋子淡出縮小 |
| 升變特效 | 400ms | ease-in-out | 棋子翻轉 + 顏色變化 |
| 王手警告 | 600ms | 反覆 | 王將格子閃爍（紅色）|
| 持駒入手 | 250ms | bounce | 棋子從棋盤飛入持駒區 |
| 畫面切換 | 300ms | ease | 淡入淡出 |
| 主選單出現 | 500ms stagger | ease-out | 標題及按鈕依序出現 |

---

## 7. UI 元件清單

### 7.1 棋盤元件（`BoardComponent`）

**職責：** 渲染 9×9 棋盤、棋子、高亮提示、座標標示

**屬性：**
- `boardState`：當前棋盤二維陣列
- `selectedSquare`：當前選取格子座標
- `legalMoves`：合法落點清單
- `lastMove`：上一手落點（顯示標記）
- `inCheckSquare`：王手中的王所在格子

**事件：**
- `onSquareClick(file, rank)` → 轉交 Input Controller 處理

### 7.2 持駒欄元件（`HandComponent`）

**職責：** 顯示玩家/AI 的持駒，支援點擊打入

**顯示格式：** 棋子圖示 + 數量角標（數量 > 1 時顯示）

**互動：**
- 玩家持駒可點擊，點擊後進入「打入選取」模式
- 打入模式下棋盤顯示合法打入位置

### 7.3 升變選擇 Modal（`PromotionModal`）

**觸發：** 棋子進入敵陣且符合升變條件（非強制升變情況）

**顯示：**
- 標題：「升變？」（26px 以上）
- 兩個大按鈕：「升變」/ 「不升變」
- 按鈕字號 ≥ 22px，觸控區域 ≥ 48×48px

**行動端優化：** 按鈕佔滿手機寬度，避免誤觸

### 7.4 棋譜欄（`KifuPanel`）

**格式（簡化 KIF）：**
```
第1手  ７六歩
第2手  ３四歩
第3手  ２六歩
...
```

**功能：**
- 自動捲動至最新棋譜
- 手機版可摺疊（預設摺疊）
- 最多顯示最近 50 手，超過可滾動

### 7.5 確認對話框（`ConfirmModal`）

用於投了確認、悔棋確認、回主選單確認等操作

**樣式：** 半透明遮罩 + 居中面板
**按鈕：** ≥ 20px 字號，觸控面積 ≥ 48px

### 7.6 AI 思考指示器（`ThinkingIndicator`）

- 顯示旋轉動畫 + 「AI 思考中…」文字
- 期間禁用玩家所有互動
- 字號 ≥ 18px

### 7.7 計時器元件（選配，設定可關閉）

- 顯示雙方剩餘時間
- 字號 ≥ 24px（確保易讀）
- 時間不足 30 秒時變紅色警示

---

## 8. 音樂與音效系統

> 所有音訊均使用 **Web Audio API** 程式化生成，不依賴任何外部音訊檔案。

### 8.1 背景音樂

**風格：** 和風冥想音樂，以三味線 + 尺八音色為基礎模擬

**實作方式（Web Audio API）：**

```javascript
class MusicGenerator {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.tempo = 60; // BPM
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00]; // 五聲音階（Do Re Mi Sol La）
  }

  // 模擬尺八音色：基音 + 泛音 + 細微顫音
  createHachiTone(frequency, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();

    // 顫音設定
    vibrato.frequency.value = 5;         // 5Hz 顫音
    vibratoGain.gain.value = frequency * 0.01; // 1% 音高顫動

    osc.type = 'triangle'; // 接近管樂音色
    osc.frequency.value = frequency;

    // 包絡線：慢起快衰
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    vibrato.start();
    osc.stop(this.ctx.currentTime + duration);
    vibrato.stop(this.ctx.currentTime + duration);
  }

  // 循環播放隨機五聲音階旋律
  startLoop() { ... }
  stopLoop() { ... }
}
```

**特性：**
- 循環播放，不規律的音符間隔製造即興感
- 加入低頻鼓點節拍（每 4 拍一次，音量極輕）
- 音量可透過設定調整（0～100）

### 8.2 音效清單

| 音效 ID | 觸發時機 | 描述 | 實作方式 |
|---------|---------|------|---------|
| `sfx_drop` | 棋子落子 | 清脆的木質敲擊聲 | 短促 `sawtooth` + 快速衰減 |
| `sfx_capture` | 吃取對方棋子 | 較重的撞擊聲 | 雙重撞擊，略長衰減 |
| `sfx_promote` | 棋子升變 | 明亮的升調音效 | 和絃上行琶音 |
| `sfx_check` | 王手發生 | 緊張的警示聲 | 短促的重音 + 輕微殘響 |
| `sfx_win` | 玩家獲勝 | 勝利音效 | 上行音階 + 鑼聲模擬 |
| `sfx_lose` | 玩家落敗 | 落敗音效 | 下行音程，帶沉重感 |
| `sfx_select` | 選中棋子 | 輕柔點選提示聲 | 極短 `sine` 波 |
| `sfx_invalid` | 無效操作 | 低沉警示 | 短促低頻 `square` |
| `sfx_undo` | 悔棋 | 倒帶感音效 | 音調下行短音 |
| `sfx_menu` | 按鈕點擊 | UI 通用點擊聲 | 短促 `sine` 高頻 |

### 8.3 音訊控制

```javascript
class AudioManager {
  constructor() {
    this.ctx = null;         // AudioContext（首次互動後初始化）
    this.masterGain = null;  // 主音量
    this.musicGain = null;   // 音樂音量
    this.sfxGain = null;     // 音效音量
    this.isMuted = false;
  }

  // 必須在使用者互動（click/touch）後才能初始化
  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    // 建立音量節點鏈：sfxGain / musicGain → masterGain → destination
  }

  setMusicVolume(value) { ... }  // 0.0 ~ 1.0
  setSfxVolume(value) { ... }    // 0.0 ~ 1.0
  mute() { ... }
  unmute() { ... }
  playSfx(id) { ... }
  startMusic() { ... }
  stopMusic() { ... }
}
```

**注意：** 遵守瀏覽器自動播放政策，AudioContext 必須在使用者互動後建立，音樂也在首次點擊後才開始播放。

---

## 9. 行動裝置適配

### 9.1 RWD 斷點

```css
/* 手機直向 */
@media (max-width: 480px) { ... }

/* 手機橫向 / 小平板 */
@media (min-width: 481px) and (max-width: 767px) { ... }

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* 桌機 */
@media (min-width: 1024px) { ... }
```

### 9.2 棋盤尺寸動態計算

```javascript
function calculateBoardSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw <= 480) {
    // 手機直向：棋盤佔滿寬度（留邊距）
    return Math.min(vw - 16, vh * 0.65);
  } else if (vw <= 768) {
    return Math.min(vw - 32, vh * 0.7);
  } else {
    // 桌機：棋盤最大 576px（9 × 64px）
    return Math.min(576, vh - 200);
  }
}
```

### 9.3 觸控互動規範

- **最小觸控目標：** 44×44px（Apple HIG 規範）/ 48×48px（Google Material 規範）
  → 本規格採用 **48×48px** 為基準
- **棋盤格子：** 手機版每格不小於 `floor(boardSize / 9)px`
  → 若螢幕寬 390px，棋盤 374px，每格約 41px（可接受）
- **防誤觸距離：** 棋子中心點判定範圍使用圓形碰撞偵測（半徑 = 格子半寬）

### 9.4 手勢支援

| 手勢 | 功能 |
|------|------|
| 單點格子 | 選取棋子 / 落子 |
| 長按格子 | 顯示棋子移動提示說明 |
| 上滑（棋譜欄邊緣） | 展開棋譜抽屜 |
| 下滑（棋譜抽屜） | 收起棋譜抽屜 |

### 9.5 Viewport Meta 設定

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

> 說明：禁止使用者縮放，避免棋盤操作時意外觸發縮放

### 9.6 手機版特殊處理

- 棋譜欄改為「底部抽屜」式 UI，預設收起
- 設定頁面全屏顯示，字體放大
- AI 思考期間顯示全屏遮罩，避免誤觸
- 升變 Modal 按鈕高度 ≥ 72px（手機需更大的點擊區域）
- 持駒區域在手機版改為橫向排列

---

## 10. 遊戲狀態管理

### 10.1 核心遊戲狀態物件

```javascript
const GameState = {
  // 棋盤（9×9，null 代表空格）
  board: Array(9).fill(null).map(() => Array(9).fill(null)),
  // 格式：{ type: 'FU', owner: 'SENTE', promoted: false }

  // 持駒
  senteHand: { FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0 },
  goteHand:  { FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0 },

  // 目前輪到誰
  currentPlayer: 'SENTE',  // 'SENTE' | 'GOTE'

  // 手數
  moveCount: 1,

  // 遊戲階段
  phase: 'PLAYING',  // 'PLAYING' | 'PROMOTION_DIALOG' | 'GAME_OVER'

  // 選取狀態（UI 層）
  selectedSquare: null,   // { file, rank } | null
  selectedHand: null,     // 棋子類型字串 | null
  legalMoves: [],

  // 王手狀態
  senteInCheck: false,
  goteInCheck: false,

  // 結果
  winner: null,   // 'SENTE' | 'GOTE' | null

  // 棋譜
  history: [],
  // 格式：{ from, to, piece, captured, promoted, drop, kifu }
};
```

### 10.2 狀態操作函數

```javascript
// 執行一手棋
function applyMove(state, move) → newState

// 撤銷一手棋（悔棋）
function undoMove(state) → previousState

// 判斷是否王手
function isInCheck(state, player) → boolean

// 判斷是否詰將
function isCheckmate(state, player) → boolean

// 儲存棋局至 localStorage
function saveGame(state) → void

// 從 localStorage 載入棋局
function loadGame() → GameState | null
```

### 10.3 localStorage 鍵值

| 鍵 | 型別 | 說明 |
|----|------|------|
| `shogi_settings` | JSON | 遊戲設定（難度、音量、主題等）|
| `shogi_save` | JSON | 自動儲存的棋局狀態 |
| `shogi_history` | JSON | 最近 5 局的棋譜記錄 |

---

## 11. 設定系統

### 11.1 設定項目

| 設定名稱 | 型別 | 預設值 | 選項 |
|---------|------|--------|------|
| AI 難度 | enum | `MEDIUM` | 入門 / 初級 / 中級 / 高級 |
| 背景音樂音量 | number | `70` | 0 ～ 100 |
| 音效音量 | number | `80` | 0 ～ 100 |
| 棋盤主題 | enum | `DARK_WOOD` | 暗色木紋 / 淺色木紋 |
| 棋子風格 | enum | `STANDARD` | 標準 / 一字（只顯示一個漢字）|
| 顯示合法手提示 | boolean | `true` | 開 / 關 |
| 顯示座標 | boolean | `true` | 開 / 關 |
| 動畫速度 | enum | `NORMAL` | 快 / 正常 / 慢 |
| 玩家先後手 | enum | `SENTE` | 先手（黑）/ 後手（白）|
| 計時器 | boolean | `false` | 開 / 關 |
| 每方思考時間 | number | `600` | 60 ～ 3600（秒）|

### 11.2 設定 Schema

```javascript
const DEFAULT_SETTINGS = {
  aiDifficulty: 'MEDIUM',
  musicVolume: 70,
  sfxVolume: 80,
  boardTheme: 'DARK_WOOD',
  pieceStyle: 'STANDARD',
  showLegalMoves: true,
  showCoordinates: true,
  animationSpeed: 'NORMAL',
  playerSide: 'SENTE',
  timerEnabled: false,
  timerSeconds: 600,
};
```

---

## 12. 資料流程圖

### 12.1 玩家操作流程

```
玩家點擊格子
      │
      ▼
InputController.handleClick(file, rank)
      │
      ├─ 無選取中棋子 ──→ 格子有玩家棋子？
      │                    ├─ 是 → selectPiece(file, rank) + 計算 legalMoves → 高亮顯示
      │                    └─ 否 → 無動作
      │
      └─ 已選取棋子 ──→ 是合法落點？
                         ├─ 是 → executeMove()
                         │        ├─ 需升變？→ 顯示 PromotionModal
                         │        ├─ 王手？→ 播放 sfx_check + 高亮
                         │        ├─ 詰將？→ 遊戲結束
                         │        └─ 輪到 AI → triggerAI()
                         └─ 否 → 重新選取 or 取消選取
```

### 12.2 AI 操作流程

```
triggerAI()
      │
      ▼
顯示 ThinkingIndicator
      │
      ▼
setTimeout(..., 100ms)  // 讓 UI 先更新
      │
      ▼
ai.getBestMove(gameState, difficulty)
      │
      ▼
Minimax + Alpha-Beta（依深度決定搜尋時間）
      │
      ▼
executeMove(bestMove)
      │
      ├─ 王手？→ 播放 sfx_check + 高亮警示
      ├─ 詰將？→ 遊戲結束
      └─ 輪到玩家 → 隱藏 ThinkingIndicator
```

---

## 13. 開發里程碑

### Phase 1：核心邏輯（無 UI）
- [ ] 棋盤資料結構
- [ ] 所有棋子移動規則實作
- [ ] 合法手生成函數
- [ ] 王手 / 詰將判斷
- [ ] 升變 / 打入規則
- [ ] 基本 AI（深度 1-2，無 alpha-beta）
- [ ] 單元測試（關鍵規則驗證）

### Phase 2：基礎 UI
- [ ] HTML 結構搭建
- [ ] 棋盤渲染（DOM 方式）
- [ ] 棋子渲染（含先後手方向）
- [ ] 點擊選取 + 合法手高亮
- [ ] 移動執行 + 狀態更新
- [ ] 升變選擇 Modal
- [ ] 持駒區渲染

### Phase 3：AI 強化
- [ ] Alpha-Beta 剪枝實作
- [ ] 局面評估函數
- [ ] 手順排序
- [ ] 靜止搜尋
- [ ] 4 段難度切換

### Phase 4：完整 UI 與體驗
- [ ] 主選單畫面
- [ ] 難度選擇畫面
- [ ] 設定畫面
- [ ] 棋譜欄
- [ ] 悔棋功能
- [ ] 結算畫面
- [ ] 動畫效果（棋子移動、升變等）
- [ ] 主題切換

### Phase 5：音訊系統
- [ ] Web Audio API 初始化
- [ ] 所有音效合成
- [ ] 背景音樂合成器
- [ ] 音量控制

### Phase 6：行動裝置優化
- [ ] RWD 完整測試
- [ ] 觸控事件優化
- [ ] 手機版 UI 調整（棋譜抽屜、大按鈕）
- [ ] 各主流手機瀏覽器測試

### Phase 7：收尾
- [ ] localStorage 儲存 / 載入
- [ ] 自動儲存功能
- [ ] 效能優化
- [ ] 跨瀏覽器相容性測試
- [ ] 無障礙（ARIA label 基本支援）

---

*本規格書版本 1.0，後續迭代請更新版本號及最後更新日期。*
