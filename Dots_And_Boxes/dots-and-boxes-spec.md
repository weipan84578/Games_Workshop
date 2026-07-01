# Dots and Boxes（點格棋）遊戲開發規格書

版本：v1.0
文件類型：純前端網頁遊戲 - 完整技術與體驗規格書
目標對象：前端工程師 / UI設計師 / 音效設計師

---

## 目錄

1. 專案總覽
2. 技術規範與限制
3. 資料夾與檔案結構
4. index.html 引入規範
5. 主畫面（首頁）規格
6. 遊戲核心規則與資料模型
7. AI 對戰邏輯（簡單／普通／困難）
8. 遊戲畫面（對局中）規格
9. RWD 響應式設計規格
10. 視覺風格與配色系統
11. 字體規範
12. 音效與 BGM 規格
13. 多國語系（i18n）規格
14. 設定頁面規格
15. 說明頁面規格
16. 存檔與繼續遊戲機制
17. 動畫與互動回饋
18. 無障礙與例外處理
19. 驗收測試清單

---

## 1. 專案總覽

### 1.1 產品描述

「點格棋」是一款經典雙人連線遊戲的單機版本，玩家可與 AI 對戰。本專案為**純前端、零建置（zero-build）**網頁遊戲，任何人下載整包資料夾後，**直接雙擊 `index.html` 即可在瀏覽器中開啟並完整遊玩**，不需要 Node.js、npm、webpack、任何 CLI 指令或本地伺服器（如 `live-server`、`http-server`）。

### 1.2 核心玩法

- 棋盤由「點」構成的格線組成（例如 5×5 點 = 4×4 格子）。
- 玩家與 AI 輪流在任兩個相鄰的點之間畫一條線（橫線或直線）。
- 當某條線的繪製，使某個 1×1 的格子四邊都被畫滿時，該格子歸屬於畫下最後一筆的一方，該方獲得 1 分，並且**可以再下一手**（額外回合）。
- 所有格子被畫滿後遊戲結束，得分較高者獲勝。

### 1.3 對戰模式（本階段範圍）

僅實作「玩家 VS AI」單一模式，AI 分為三種難度：

| 難度 | 代號 | 特性簡述 |
|---|---|---|
| 簡單 Easy | `easy` | 大多隨機落子，僅避免「完全不看盤」的明顯低級失誤 |
| 普通 Normal | `normal` | 會主動吃格、避免送格給玩家，但不做深度鏈路計算 |
| 困難 Hard | `hard` | 具備鏈路（chain）分析與雙重交叉（double-cross）策略，接近最佳解 |

> 本階段不實作玩家對玩家（本機雙人 / 連線對戰），介面應保留未來擴充空間，但不得出現該按鈕，以免使用者誤觸。

### 1.4 非功能性需求總覽

- 全程可離線執行（不依賴 CDN、不依賴外部 API）。
- 首次載入後所有資源皆需可從本地檔案系統讀取。
- 高對比、大字體、清楚圖示，鎖定「所有年齡層都能看懂」為目標。
- 支援手機、平板、桌機三種尺寸的完整良好體驗（RWD）。

---

## 2. 技術規範與限制

### 2.1 技術堆疊

| 項目 | 技術 | 說明 |
|---|---|---|
| 標記語言 | HTML5 | 單一 `index.html` 作為入口 |
| 樣式 | 原生 CSS3（分檔案，不使用 Sass/Less 等需要編譯的語言） | 使用 CSS 變數（Custom Properties）管理主題色彩 |
| 邏輯 | 原生 JavaScript（ES6+ Module 或傳統 `<script>` 皆可，**禁止**使用需要打包工具的語法） | 模組化拆分，見第 3 章 |
| 儲存 | `localStorage` | 用於設定、存檔、語系、音量偏好 |
| 音訊 | `HTMLAudioElement` / `Web Audio API`（原生瀏覽器 API） | 不依賴第三方函式庫 |
| 圖形 | SVG（棋盤線條、圖示）+ CSS（UI 特效） | 向量圖形確保 RWD 縮放不失真 |
| 字型 | 系統字型堆疊 或 本地內嵌字型檔（`.woff2`，若使用需放在 `assets/fonts/` 並以 `@font-face` 本地引入，禁止使用 Google Fonts 線上連結） | |

### 2.2 嚴格限制事項

1. **禁止**任何 `import xxx from 'npm-package'` 形式的第三方套件（React、Vue、jQuery、Bootstrap 等一律不用）。
2. **禁止**使用需編譯的語言（TypeScript、Sass、JSX 等）作為最終交付檔案，若開發過程使用，最終需編譯輸出純 JS/CSS。
3. **禁止**在 `index.html` 中使用 `type="module"` 搭配跨檔案 `import` 時，若瀏覽器以 `file://` 協定開啟會被 CORS 阻擋 —— 因此**一律採用傳統 `<script src="...">` 依序引入**的方式（非 ES Module），確保雙擊開啟 `file://index.html` 也能正常運作。
4. 所有 `<script>` 標籤放在 `</body>` 結束前，並依「工具函式 → 資料層 → 邏輯層 → UI層 → 入口檔」的順序載入，避免變數未定義。
5. 不使用外部 CDN（含字型、圖示庫、音樂庫），所有資源皆需内含於專案資料夾內，確保無網路環境也能執行。

### 2.3 瀏覽器支援

- Chrome / Edge / Safari / Firefox 最近兩個大版本。
- iOS Safari、Android Chrome（行動裝置為主要測試對象之一）。

---

## 3. 資料夾與檔案結構

```
dots-and-boxes/
│
├── index.html                      # 唯一入口檔案，直接雙擊開啟
│
├── css/
│   ├── base/
│   │   ├── reset.css               # CSS Reset / Normalize
│   │   ├── variables.css           # 顏色、字體大小、間距、圓角等 CSS 變數（含多套配色主題）
│   │   ├── typography.css          # 全站字體規範（大字體、字重、行高）
│   │   └── animations.css          # 共用關鍵影格動畫（fade, pop, shake, bounce...）
│   │
│   ├── layout/
│   │   ├── header.css              # 各頁共用頂部列（返回鍵、標題、設定捷徑）
│   │   ├── responsive.css          # 各斷點媒體查詢（RWD 核心）
│   │   └── safe-area.css           # 行動裝置瀏海/底部手勢列安全區域處理
│   │
│   ├── pages/
│   │   ├── main-menu.css           # 主畫面樣式
│   │   ├── game-board.css          # 遊戲棋盤樣式
│   │   ├── settings.css            # 設定頁樣式
│   │   ├── how-to-play.css         # 說明頁樣式
│   │   └── result-modal.css        # 對局結束彈窗樣式
│   │
│   ├── components/
│   │   ├── buttons.css             # 按鈕元件（含觸控回饋樣式）
│   │   ├── modal.css               # 通用彈窗元件
│   │   ├── toggle-switch.css       # 設定頁開關元件
│   │   ├── slider.css              # 音量調整滑桿樣式
│   │   ├── dropdown.css            # 語言 / 主題下拉選單
│   │   └── loading.css             # 讀取畫面／過場動畫
│   │
│   └── themes/
│       ├── theme-classic.css       # 經典木質棋盤主題
│       ├── theme-candy.css         # 糖果繽紛主題
│       ├── theme-ocean.css         # 海洋藍主題
│       ├── theme-forest.css        # 森林綠主題
│       ├── theme-night.css         # 夜間深色主題
│       └── theme-sakura.css        # 櫻花粉主題
│
├── js/
│   ├── utils/
│   │   ├── dom-utils.js            # DOM 操作輔助函式
│   │   ├── storage-utils.js        # localStorage 存取封裝
│   │   ├── math-utils.js           # 座標／格線運算輔助
│   │   └── event-emitter.js        # 簡易事件廣播（元件間溝通用）
│   │
│   ├── data/
│   │   ├── constants.js            # 遊戲常數（棋盤尺寸選項、難度設定值...）
│   │   ├── i18n/
│   │   │   ├── zh-TW.js            # 繁體中文語系字典
│   │   │   ├── en-US.js            # 英文語系字典
│   │   │   └── ja-JP.js            # 日文語系字典
│   │   └── themes.js               # 主題色票中繼資料（給 JS 動態切換用）
│   │
│   ├── core/
│   │   ├── board-model.js          # 棋盤資料結構（點、線、格子狀態）
│   │   ├── game-engine.js          # 遊戲主邏輯（落子、判格、計分、回合切換）
│   │   ├── rules-validator.js      # 合法步驟驗證
│   │   └── save-manager.js         # 存檔／讀檔（含「繼續遊戲」機制）
│   │
│   ├── ai/
│   │   ├── ai-controller.js        # AI 出手總入口（依難度分派）
│   │   ├── ai-easy.js              # 簡單難度邏輯
│   │   ├── ai-normal.js            # 普通難度邏輯
│   │   ├── ai-hard.js              # 困難難度邏輯（含 chain 分析）
│   │   └── chain-analyzer.js       # 鏈路／迴圈分析共用演算法
│   │
│   ├── audio/
│   │   ├── audio-manager.js        # 音訊系統核心（BGM／音效播放、音量控制、5倍增益處理）
│   │   └── sound-map.js            # 音效檔案對應表
│   │
│   ├── i18n/
│   │   └── i18n-manager.js         # 語系切換引擎、文字置換
│   │
│   ├── ui/
│   │   ├── router.js               # 簡易畫面路由（首頁／遊戲／設定／說明 頁面切換）
│   │   ├── main-menu-ui.js         # 主畫面互動邏輯
│   │   ├── board-renderer.js       # 棋盤 SVG 繪製與更新
│   │   ├── game-ui.js              # 遊戲中 HUD（分數、回合提示、難度標示）
│   │   ├── settings-ui.js          # 設定頁互動邏輯
│   │   ├── how-to-play-ui.js       # 說明頁互動邏輯
│   │   ├── result-modal-ui.js      # 結算彈窗邏輯
│   │   └── theme-switcher.js       # 主題即時套用邏輯
│   │
│   └── main.js                     # 應用程式入口，初始化所有模組
│
├── assets/
│   ├── images/
│   │   ├── icons/                  # SVG 圖示（設定齒輪、音符、返回箭頭、勝利獎盃等）
│   │   ├── illustrations/          # 主畫面／說明頁插畫（SVG 或 PNG）
│   │   ├── backgrounds/            # 各主題背景圖／材質圖（木紋、紙張、夜空等）
│   │   └── avatars/                # 玩家／AI 對戰頭像圖示
│   │
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── main-menu-theme.mp3     # 主畫面鋼琴輕快 BGM
│   │   │   ├── gameplay-theme-1.mp3    # 對局中 BGM 曲目一
│   │   │   └── gameplay-theme-2.mp3    # 對局中 BGM 曲目二（可切換／隨機播放）
│   │   └── sfx/
│   │       ├── line-draw.mp3           # 畫線音效（清脆短音）
│   │       ├── box-complete.mp3        # completar 格子音效（高音清亮）
│   │       ├── button-tap.mp3          # 按鍵點擊音效
│   │       ├── turn-switch.mp3         # 回合切換提示音
│   │       ├── victory.mp3             # 勝利音效
│   │       ├── defeat.mp3              # 落敗音效
│   │       └── draw.mp3                # 平手音效
│   │
│   └── fonts/
│       └── (本地字型檔，若不使用系統字型堆疊則放置於此，.woff2 格式)
│
└── README.md                        # 專案說明（如何開啟、資料夾導覽）
```

> **分類原則**：CSS 依「基礎 base → 版面 layout → 頁面 pages → 元件 components → 主題 themes」五層分類；JavaScript 依「工具 utils → 資料 data → 核心邏輯 core → AI ai → 音訊 audio → 語系 i18n → UI ui → 入口 main.js」八層分類，確保單一檔案職責單一、易於維護與除錯。

---

## 4. index.html 引入規範

### 4.1 `<head>` 引入順序（CSS）

```html
<!-- Base -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/base/animations.css">

<!-- Layout -->
<link rel="stylesheet" href="css/layout/header.css">
<link rel="stylesheet" href="css/layout/safe-area.css">
<link rel="stylesheet" href="css/layout/responsive.css">

<!-- Components -->
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/toggle-switch.css">
<link rel="stylesheet" href="css/components/slider.css">
<link rel="stylesheet" href="css/components/dropdown.css">
<link rel="stylesheet" href="css/components/loading.css">

<!-- Pages -->
<link rel="stylesheet" href="css/pages/main-menu.css">
<link rel="stylesheet" href="css/pages/game-board.css">
<link rel="stylesheet" href="css/pages/settings.css">
<link rel="stylesheet" href="css/pages/how-to-play.css">
<link rel="stylesheet" href="css/pages/result-modal.css">

<!-- Themes（全部載入，透過 CSS 變數 + body[data-theme] 切換，不用動態插拔 <link>） -->
<link rel="stylesheet" href="css/themes/theme-classic.css">
<link rel="stylesheet" href="css/themes/theme-candy.css">
<link rel="stylesheet" href="css/themes/theme-ocean.css">
<link rel="stylesheet" href="css/themes/theme-forest.css">
<link rel="stylesheet" href="css/themes/theme-night.css">
<link rel="stylesheet" href="css/themes/theme-sakura.css">
```

### 4.2 `<body>` 結尾引入順序（JavaScript）

```html
<!-- Utils -->
<script src="js/utils/dom-utils.js"></script>
<script src="js/utils/storage-utils.js"></script>
<script src="js/utils/math-utils.js"></script>
<script src="js/utils/event-emitter.js"></script>

<!-- Data -->
<script src="js/data/constants.js"></script>
<script src="js/data/i18n/zh-TW.js"></script>
<script src="js/data/i18n/en-US.js"></script>
<script src="js/data/i18n/ja-JP.js"></script>
<script src="js/data/themes.js"></script>

<!-- Core -->
<script src="js/core/board-model.js"></script>
<script src="js/core/rules-validator.js"></script>
<script src="js/core/game-engine.js"></script>
<script src="js/core/save-manager.js"></script>

<!-- AI -->
<script src="js/ai/chain-analyzer.js"></script>
<script src="js/ai/ai-easy.js"></script>
<script src="js/ai/ai-normal.js"></script>
<script src="js/ai/ai-hard.js"></script>
<script src="js/ai/ai-controller.js"></script>

<!-- Audio -->
<script src="js/audio/sound-map.js"></script>
<script src="js/audio/audio-manager.js"></script>

<!-- i18n -->
<script src="js/i18n/i18n-manager.js"></script>

<!-- UI -->
<script src="js/ui/router.js"></script>
<script src="js/ui/theme-switcher.js"></script>
<script src="js/ui/board-renderer.js"></script>
<script src="js/ui/main-menu-ui.js"></script>
<script src="js/ui/game-ui.js"></script>
<script src="js/ui/settings-ui.js"></script>
<script src="js/ui/how-to-play-ui.js"></script>
<script src="js/ui/result-modal-ui.js"></script>

<!-- Entry -->
<script src="js/main.js"></script>
```

> 所有 JS 檔案皆使用**傳統瀏覽器全域變數／命名空間物件**（例如 `window.DAB = window.DAB || {}`）方式互相溝通，避免 `import/export` 在 `file://` 開啟時發生 CORS 錯誤。

### 4.3 `<head>` 必要 meta 標籤

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#2b2438">
<title>點格棋 Dots and Boxes</title>
```

- `viewport-fit=cover` 搭配 `safe-area.css` 的 `env(safe-area-inset-*)`，確保 iPhone 瀏海機型正常顯示。
- `user-scalable=no` 避免遊戲操作時誤觸縮放，但需確保頁面本身文字已夠大（見第 11 章），不犧牲可讀性。

---

## 5. 主畫面（首頁）規格

### 5.1 版面配置原則（對應需求 #5、#14：簡潔乾淨、不要過多設定）

主畫面採**極簡垂直置中版面**，僅包含：

```
┌─────────────────────────────┐
│                               │
│         [遊戲 LOGO / 標題]     │  ← 動態插畫或 SVG 字樣，附輕微浮動動畫
│                               │
│        ┌───────────────┐     │
│        │   ▶ 開始遊戲   │     │  ← 主要 CTA，最大最醒目
│        └───────────────┘     │
│        ┌───────────────┐     │
│        │   ⏸ 繼續遊戲   │     │  ← 僅在偵測到有存檔時顯示，否則整列隱藏（不佔位、不顯示灰階殘影）
│        └───────────────┘     │
│        ┌───────────────┐     │
│        │   📖 遊戲說明   │     │
│        └───────────────┘     │
│        ┌───────────────┐     │
│        │   ⚙ 設定       │     │
│        └───────────────┘     │
│                               │
│   [語言切換小圖示]  [音效開關小圖示]  │  ← 右上角或左上角，體積小、不搶主視覺
└─────────────────────────────┘
```

### 5.2 元件規則

| 元件 | 規則 |
|---|---|
| 開始遊戲 | 點擊後 → 彈出「選擇棋盤大小」與「選擇 AI 難度」的**輕量選單（非跳頁）**，確認後直接進入遊戲頁 |
| 繼續遊戲 | 僅當 `localStorage` 存在未完成對局時顯示；點擊後直接還原棋盤狀態並進入遊戲頁 |
| 遊戲說明 | 導向說明頁（見第 15 章） |
| 設定 | 導向設定頁（見第 14 章） |
| 語言切換 | 小型地球圖示 + 目前語言縮寫（如「中」/「EN」/「日」），點擊彈出語言選單，即點即生效，不需重新整理頁面 |
| 音效開關 | 小型喇叭圖示，單擊可靜音/取消靜音（僅影響音效或全域，依設計取捨，建議影響「全域主開關」） |

### 5.3 主畫面背景與氛圍（對應需求 #11、#13：豐富有趣、擬真）

- 背景使用淡雅材質紋理（依主題：木紋紙張／夜空星點／糖果雲朵等），並帶有極輕微的視差或呼吸感動畫（如背景光暈緩慢飄移），**動畫幅度需克制**，不可造成暈眩感或搶走按鈕焦點。
- Logo 區塊可用簡單的點格棋盤裝飾圖案作背景浮水印，強化主題辨識度。
- 按鈕懸停／觸控時要有明確放大、陰影加深、色彩變亮等回饋（見 17 章動畫規格）。

### 5.4 開始遊戲彈窗內容

```
選擇棋盤大小：  [3×3] [4×4]（預設） [5×5] [6×6]
選擇 AI 難度：  [簡單] [普通]（預設） [困難]
選擇先手：      [我先手]（預設） [AI 先手]
              ┌─────────┐
              │  開始對戰 │
              └─────────┘
```

- 此彈窗字體、按鈕比照全站大字體規範。
- 各棋盤大小需標示「格數 × 格數」與粗略難度／時長提示文字（例如「4×4（約 5-10 分鐘，新手推薦）」）。

---

## 6. 遊戲核心規則與資料模型

### 6.1 資料結構設計（`board-model.js`）

```js
// 以 4x4 格子（5x5 點）為例
BoardModel = {
  rows: 4,              // 格子列數
  cols: 4,              // 格子欄數
  horizontalLines: [],  // 二維陣列 [row][col] -> { owner: null | 'player' | 'ai', id }
                         // 尺寸：(rows+1) x cols
  verticalLines: [],    // 二維陣列 [row][col] -> { owner: null | 'player' | 'ai', id }
                         // 尺寸：rows x (cols+1)
  boxes: [],             // 二維陣列 [row][col] -> { owner: null | 'player' | 'ai' }
  currentTurn: 'player', // 'player' | 'ai'
  scores: { player: 0, ai: 0 },
  moveHistory: [],       // 用於復盤／Undo（若未來需要）
  status: 'playing'      // 'playing' | 'finished'
}
```

### 6.2 落子與判格流程

1. 使用者／AI 選擇一條未被畫的邊（水平或垂直線）。
2. `rules-validator.js` 驗證：該線是否存在、是否已被畫過、是否輪到該方。
3. `game-engine.js` 標記該線 `owner`。
4. 檢查與該線相鄰的 1～2 個格子是否「四邊已滿」：
   - 若滿：該格 `owner` = 目前落子方，得分 +1，**同一方繼續下一手**（不切換 `currentTurn`）。
   - 若都未滿：切換 `currentTurn`。
5. 檢查是否所有格子皆已歸屬 → 若是，`status = 'finished'`，觸發結算流程。
6. 每次落子後觸發：
   - 畫線音效（`line-draw.mp3`）
   - 若完成格子，額外播放 `box-complete.mp3`，並在該格子做「填色 + 彈跳」動畫，格內顯示該方小圖示（如玩家頭像縮圖或簡單符號）。
   - 若切換回合，觸發 `turn-switch.mp3` 與 HUD 提示動畫。

### 6.3 結算規則

- `scores.player > scores.ai` → 玩家勝利
- `scores.player < scores.ai` → AI 勝利
- 相等 → 平手（僅在總格數為偶數時可能發生）

---

## 7. AI 對戰邏輯（簡單／普通／困難）

### 7.1 共用概念：安全步 vs 危險步

- **安全步（Safe Move）**：畫下後，不會使任何格子變成「三邊已滿」（即不會送格子給對方）。
- **危險步（Sacrifice Move）**：畫下後會使至少一個格子變成三邊已滿，對方下一手可直接吃格。
- **可得分步（Scoring Move）**：畫下後可直接完成一個或多個格子。

### 7.2 簡單難度（`ai-easy.js`）

- 邏輯優先序：
  1. 有 70% 機率：純隨機選擇任一條合法的線。
  2. 有 30% 機率：優先選擇「可得分步」（若存在），模擬新手偶爾抓到吃格機會。
- **不做**任何危險步迴避，容易誤送格子給玩家，形成「簡單好贏」的體驗。
- 每步之間加入 400～800ms 的隨機思考延遲（並顯示「AI 思考中...」動畫），避免 AI 反應過快顯得不自然。

### 7.3 普通難度（`ai-normal.js`）

- 邏輯優先序：
  1. 若存在「可得分步」→ 執行（優先吃格）。
  2. 若不存在可得分步 → 從所有「安全步」中隨機挑選一條。
  3. 若沒有安全步（所有步都會送格子）→ 挑選「送出格子數最少」的危險步（貪心最小化損失，但不做鏈路長度分析）。
- 思考延遲 500～1000ms。

### 7.4 困難難度（`ai-hard.js` + `chain-analyzer.js`）

採用點格棋經典 AI 策略：**鏈路分析（Chain Rule）+ 雙重交叉策略（Double-Cross Strategy）**。

1. **可得分步優先**：若有可吃格的步，先計算是否應該「全部吃完」或「留雙格（double-cross）」。
2. **鏈路辨識**：將棋盤剩餘未完成格子分析為數個「鏈（chain）」與「迴圈（loop）」結構。
3. **長鏈控制策略**：
   - 當面臨必須讓出一條鏈時，優先讓出最短的鏈，保留長鏈給自己後續整條吃下。
   - 在吃一條長鏈（≥3 格）時，**保留最後兩格不吃（留雙）**，改為畫出「雙重交叉」線，強迫對手吃下這兩格後，仍必須開啟下一條鏈，使 AI 掌握主動權。
4. 若無鏈路可分析的初期階段（棋盤大部分空白），採用「安全步」中，**盡量避免形成長度為 1～2 的短鏈**（因短鏈易攻），策略性地引導鏈路長度分布對自己有利。
5. 思考延遲 600～1200ms（可加入「AI 深度思考中」的旋轉圖示動畫，強化擬真感，對應需求 #13）。

> 困難難度目標為「一般玩家難以輕易獲勝，但非 100% 完美解」，避免變成不可能戰勝的挫折感。

### 7.5 AI 難度呈現於 UI

- 對局中 HUD 顯示目前難度徽章（例如「困難 🔥」），並在 AI 圖示旁加上對應表情（簡單＝微笑新手圖示／普通＝專注圖示／困難＝銳利眼神圖示），強化擬真與趣味性。

---

## 8. 遊戲畫面（對局中）規格

### 8.1 版面區塊

```
┌───────────────────────────────────┐
│ [← 返回]     點格棋      [⚙ 設定]   │  ← 頂部列，固定高度，永不遮擋棋盤
├───────────────────────────────────┤
│  👤 你  比分: 3        AI 困難 比分: 2  🤖 │  ← 分數列，含頭像、目前回合高亮外框
├───────────────────────────────────┤
│                                     │
│                                     │
│         [SVG 棋盤主體區域]           │  ← 佔用剩餘所有空間，保持置中、等比縮放
│                                     │
│                                     │
├───────────────────────────────────┤
│      （行動裝置限定）暫停 / 音效切換    │  ← 見 9.4 行動版按鍵規則
└───────────────────────────────────┘
```

### 8.2 棋盤互動規則

- 桌機：滑鼠移到可畫的邊上時，該邊以淡色高亮預覽線顯示；點擊確認畫線。
- 行動裝置：手指觸碰邊線區域（**觸控熱區需比視覺線寬更大，建議至少 44×44px**，避免誤觸）；觸碰後立即畫線並播放音效，不需二次確認（維持遊戲節奏）。
- 已畫的線與已完成的格子皆不可再互動。
- 非玩家回合（AI 思考中）：棋盤呈現「輕微變暗遮罩 + 遊標樣式改為 not-allowed」，避免玩家誤觸打斷。

### 8.3 分數列與回合提示

- 目前輪到誰，該方頭像／名稱要有明顯外框光暈或跳動提示動畫。
- 若某方剛完成格子並取得額外回合，顯示短暫的「+1 分！再下一手！」浮動文字提示（toast），2 秒後自動淡出。

### 8.4 結算彈窗（對應需求 #13 擬真、#11 豐富有趣）

對局結束時彈出置中 Modal：

```
┌───────────────────────────┐
│        🏆 你獲勝了！         │
│                             │
│     你: 10      AI: 6       │
│                             │
│   [彩帶/星星裝飾動畫背景]      │
│                             │
│  [再來一局]   [返回主畫面]   │
└───────────────────────────┘
```

- 勝利／落敗／平手 分別採用不同插畫、不同音效（`victory.mp3` / `defeat.mp3` / `draw.mp3`）與不同文案語氣（鼓勵性文字，尤其落敗時文案需正向，例如「差一點就贏了！再試一次？」）。

---

## 9. RWD 響應式設計規格

### 9.1 斷點定義（於 `responsive.css` 統一管理）

| 名稱 | 寬度範圍 | 主要對象 |
|---|---|---|
| `--bp-small` | ≤ 480px | 手機直立 |
| `--bp-medium` | 481px – 768px | 手機橫向／小型平板 |
| `--bp-large` | 769px – 1024px | 平板／小筆電 |
| `--bp-xlarge` | ≥ 1025px | 桌機／大螢幕 |

### 9.2 棋盤縮放原則（對應需求 #2）

- 棋盤 SVG 使用 `viewBox` 定義內部座標系統，外層容器以 `max-width: min(90vw, 90vh, 700px)` 搭配 `aspect-ratio: 1 / 1` 讓棋盤**永遠等比例縮放並置中**，不因螢幕比例被拉伸變形。
- 棋盤區域需扣除頂部列、分數列、（行動版）底部按鍵列的實際高度後，動態計算可用空間，確保**永遠完整可見、不需捲動、不被裁切**。
- 使用 `resize` 與 `orientationchange` 事件監聽，即時重新計算棋盤尺寸（尤其手機旋轉方向時）。

### 9.3 版面在各斷點的調整

- **手機直立**：頂部列與分數列高度收窄、字體略縮（但仍維持大字體下限，見 11.2）；棋盤置中最大化。
- **手機橫向**：頂部列可收合為更窄的單行（例如把「設定」圖示與比分整合在同一行），釋放垂直空間給棋盤。
- **平板／桌機**：可在棋盤兩側保留裝飾性留白或簡易資訊卡（如目前難度、對局時長），不影響棋盤本體大小。

### 9.4 行動裝置按鍵不遮擋畫面規則（對應需求 #2、#8，重點需求）

1. **不使用浮動於棋盤正上方的懸浮按鈕（FAB）**。所有操作按鍵一律置於畫面**最上方或最下方的固定列**，並確保該固定列有實體高度（非絕對定位覆蓋於棋盤上），棋盤區域的可用高度計算需扣除這些固定列。
2. 若使用 `position: fixed` 的底部工具列，需搭配 `padding-bottom: env(safe-area-inset-bottom)`，避免被 iPhone 手勢列擋住，同時遊戲主容器需加上等高的 `padding-bottom`，讓棋盤不被工具列蓋住。
3. 行動版底部列僅放置最必要按鍵：「⏸ 暫停」「🔊 靜音切換」，其餘（設定細項、回主畫面）收在暫停彈窗內，避免按鍵過多擠壓棋盤空間。
4. 任何彈窗（結算、暫停選單）彈出時需有半透明遮罩並鎖定背景捲動（`overflow: hidden` on body），避免使用者滑動時誤觸棋盤下方內容。
5. 橫向棋盤過寬導致左右留白過多時，可將分數列改為左右貼齊棋盤兩側直式排列（而非固定頂部一整條），提升橫向空間利用率，此為建議的進階優化項目。

---

## 10. 視覺風格與配色系統

### 10.1 主題清單（對應需求 #3：多樣色彩可選）

於 `css/base/variables.css` 定義共用變數命名規則，各主題於 `css/themes/*.css` 中覆寫對應數值，並透過 `<body data-theme="classic">` 等屬性切換：

| 主題代號 | 主題名稱 | 風格描述 |
|---|---|---|
| `classic` | 經典木質（預設） | 米白棋盤 + 深棕格線 + 暖橘強調色，仿實體桌遊質感 |
| `candy` | 糖果繽紛 | 粉紫漸層背景、馬卡龍色系格線、繽紛強調色 |
| `ocean` | 海洋藍 | 藍綠漸層、白色格線、珊瑚橘強調色 |
| `forest` | 森林綠 | 深淺綠背景、木紋格線、陽光黃強調色 |
| `night` | 夜間深色 | 深藍紫背景、亮青格線、霓虹粉強調色（適合夜間護眼） |
| `sakura` | 櫻花粉 | 淡粉背景、白色格線、櫻花紅強調色 |

### 10.2 CSS 變數命名規範（節錄）

```css
:root {
  --color-bg-primary: ...;
  --color-bg-secondary: ...;
  --color-surface: ...;          /* 卡片、按鈕底色 */
  --color-text-primary: ...;
  --color-text-secondary: ...;
  --color-accent: ...;           /* 主要強調色（CTA按鈕） */
  --color-accent-hover: ...;
  --color-player: ...;           /* 玩家專屬色（線條、頭像框） */
  --color-ai: ...;               /* AI 專屬色 */
  --color-success: ...;
  --color-danger: ...;
  --color-line-empty: ...;       /* 未畫線的淡色格線 */
  --color-line-hover: ...;       /* 滑鼠懸停預覽線 */
  --shadow-elevation-1: ...;
  --shadow-elevation-2: ...;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
}
```

### 10.3 對比與可視性規範（對應需求 #11：不要有看不見的情況）

1. 所有文字與背景對比度需符合 **WCAG AA 標準（一般文字 ≥ 4.5:1，大字體 ≥ 3:1）**，於每個主題上線前需逐一以對比檢測工具驗證。
2. 「玩家色」與「AI 色」在同一主題內**必須有明顯區隔**（例如色相差 ≥ 90 度，或一冷一暖對比），避免色弱使用者混淆，並額外搭配**不同的線條樣式或圖示形狀**做為色彩以外的第二辨識依據（例如玩家線條為實線＋圓點端點，AI 線條為實線＋方形端點）。
3. 深色主題（`night`）需特別確認格線在深色背景上仍清晰可辨，不可出現「格線幾乎融入背景」的情況。
4. 已畫線 vs 未畫線 vs 懸停預覽線，三種狀態的顏色差異需一眼可辨。
5. 按鈕文字禁止使用低對比灰階疊灰階（例如深灰底配中灰字），一律使用主題定義的高對比配色。

---

## 11. 字體規範

### 11.1 字型選擇

- 中文：優先使用系統字型堆疊，確保清晰易讀：
  `font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;`
- 日文：`"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif;`
- 英文／數字：`"Noto Sans", -apple-system, "Segoe UI", Roboto, sans-serif;`
- 統一於 `typography.css` 依 `<html lang="...">` 屬性套用對應字型堆疊（切換語系時同步更新 `lang` 屬性與字型）。

### 11.2 字級規範（對應需求 #3：大字體、明確）

於 `variables.css` 定義字級尺度，所有頁面禁止使用小於 `--font-size-base` 的內文字：

| 變數 | 桌機大小 | 手機大小 | 用途 |
|---|---|---|---|
| `--font-size-h1` | 40px | 30px | 主標題（LOGO、頁面大標） |
| `--font-size-h2` | 28px | 22px | 區塊標題 |
| `--font-size-h3` | 22px | 18px | 卡片標題 |
| `--font-size-base` | 20px | 17px | 一般內文（提高至一般網站的內文標準之上） |
| `--font-size-button` | 22px | 18px | 按鈕文字，需清楚易點擊辨識 |
| `--font-size-caption` | 16px | 14px | 輔助說明文字（此為字級下限，全站不得低於此值） |

### 11.3 字重與可讀性

- 標題一律使用 `font-weight: 700`（Bold），內文使用 `500`（Medium）而非預設 `400`，強化「明確」的視覺需求。
- 行高（`line-height`）內文一律 ≥ 1.6，標題 ≥ 1.3，避免中日文字擁擠。
- 重要數值（比分、剩餘格數）使用等寬數字樣式（`font-variant-numeric: tabular-nums;`）避免跳動。

---

## 12. 音效與 BGM 規格

### 12.1 音樂風格（對應需求 #6）

- **BGM**：以鋼琴為主奏，節奏輕快、明亮大調為主（避免小調沉重感），營造輕鬆益智遊戲氛圍。主畫面與對局中可使用不同曲目，或同一曲目不同編曲強度（對局中版本節奏可稍微加快以維持專注感）。
- **音效（SFX）**：一律採用「高音、清脆、短促」音色設計（例如類似鐘琴 celesta、玻璃敲擊、鈴鐺的音色），長度控制在 0.1～0.4 秒內，避免拖沓影響操作節奏感。

| 事件 | 檔案 | 音色描述 |
|---|---|---|
| 畫下一條線 | `line-draw.mp3` | 極短促「叮」聲 |
| 完成一個格子 | `box-complete.mp3` | 上揚清亮「叮鈴」雙音，帶滿足感 |
| 按鈕點擊 | `button-tap.mp3` | 輕巧「噠」聲 |
| 回合切換 | `turn-switch.mp3` | 溫和「叮咚」提示音 |
| 勝利 | `victory.mp3` | 明亮上揚音階，2-3 秒 |
| 落敗 | `defeat.mp3` | 溫和低落但不刺耳的短旋律，避免過度負面 |
| 平手 | `draw.mp3` | 中性、俏皮的短旋律 |

### 12.2 音量系統與「5 倍音量」規格（對應需求 #7）

> ⚠️ 設計澄清與安全性考量：需求提出「遊戲中的 BGM 音量都放大為原來的 5 倍」，實作上採用以下方式達成「顯著更大聲、更有存在感的 BGM」效果，同時避免因音量過載造成的**音訊爆音失真（clipping）**或對使用者**聽力造成不適／損害**的風險：

1. **基準音量倍增邏輯**：遊戲中（對局畫面）的 BGM 播放增益（gain）以「主畫面 BGM 基準音量」為 1 倍基準，對局中一律套用 **`gameplayBgmGain = baseBgmVolume × 5`** 的倍率計算。
2. **音量上限保護（Limiter）**：由於原生 `<audio>.volume` 屬性僅接受 `0.0 ~ 1.0`，若使用 `Web Audio API` 的 `GainNode` 實作 5 倍增益，**必須**串接 `DynamicsCompressorNode`（動態壓縮器）作為輸出限制器，將最終輸出音量硬性限制在安全音壓範圍內，避免破音／爆音。
3. 使用者可於設定頁自行調整「BGM 基礎音量」滑桿（0～100%），系統會在此基礎值上套用 5 倍相對增益後，再經過限制器輸出，因此使用者仍保有「調小聲」的完整控制權，實務體感為「同樣的滑桿刻度，遊戲中的 BGM 比主畫面明顯更響亮飽滿」。
4. 首次進入遊戲對局時，若偵測到裝置音量或系統音量在高檔位，可選擇性顯示一次性提示：「遊戲音樂已增強播放，建議依環境調整裝置音量」，提升使用體驗與安全性（此為建議項，非強制阻擋操作）。
5. 音效（SFX）音量**不套用 5 倍規則**，維持獨立的音效音量滑桿與正常增益範圍，避免畫線／吃格音效過度刺耳。

### 12.3 音訊系統架構（`audio-manager.js`）

- 統一管理兩條獨立音軌：BGM 軌、SFX 軌，各自有獨立音量狀態，儲存於 `localStorage`。
- 提供 API：`playBgm(track)`、`stopBgm()`、`playSfx(name)`、`setBgmVolume(0~1)`、`setSfxVolume(0~1)`、`muteAll()`、`unmuteAll()`。
- 頁面切換時 BGM 需**淡入淡出（fade in/out, 約 500ms）**過渡，不可有硬切頓挫感。
- 需處理瀏覽器「使用者互動前禁止自動播放」限制：首次點擊任一按鈕（如主畫面「開始遊戲」或任何互動）時才觸發 BGM 播放，並在按鍵事件中 `resume()` AudioContext。

---

## 13. 多國語系（i18n）規格（對應需求 #9）

### 13.1 支援語言

- 繁體中文 `zh-TW`（預設）
- 英文 `en-US`
- 日文 `ja-JP`

### 13.2 語系檔格式（以 `zh-TW.js` 為例）

```js
window.DAB_I18N = window.DAB_I18N || {};
window.DAB_I18N['zh-TW'] = {
  common: {
    start: "開始遊戲",
    continue: "繼續遊戲",
    howToPlay: "遊戲說明",
    settings: "設定",
    back: "返回",
    confirm: "確認",
    cancel: "取消"
  },
  menu: {
    selectBoardSize: "選擇棋盤大小",
    selectDifficulty: "選擇 AI 難度",
    difficultyEasy: "簡單",
    difficultyNormal: "普通",
    difficultyHard: "困難",
    goFirst: "我先手",
    aiFirst: "AI 先手",
    startMatch: "開始對戰"
  },
  game: {
    you: "你",
    ai: "AI",
    yourTurn: "輪到你了",
    aiThinking: "AI 思考中...",
    scoreGained: "+1 分！再下一手！",
    win: "你獲勝了！",
    lose: "AI 獲勝了！再試一次？",
    draw: "平手！勢均力敵！"
  },
  settings: {
    title: "設定",
    language: "語言",
    theme: "主題色彩",
    bgmVolume: "背景音樂音量",
    sfxVolume: "音效音量",
    vibration: "震動回饋",
    resetSave: "清除存檔"
  },
  howToPlay: {
    title: "遊戲說明",
    ruleStepTitles: ["基本規則", "如何得分", "額外回合規則", "獲勝條件"]
  }
};
```

- 英文、日文檔案結構完全對應，僅內容翻譯不同，確保 key 名稱一致，避免缺漏。

### 13.3 語系切換引擎（`i18n-manager.js`）

- 所有可視文字元素於 HTML 中以 `data-i18n="menu.start"` 屬性標記，切換語言時遍歷所有 `[data-i18n]` 節點並替換 `textContent`。
- 語言選擇儲存於 `localStorage.language`，下次開啟自動套用。
- 切換語言同步更新 `<html lang="zh-TW">` 屬性（影響字型堆疊，見 11.1）。
- 數字、比分格式維持阿拉伯數字，不做在地化轉換（避免混淆）。
- 日文語系需特別確認按鈕文字长度（日文字串常較長）不會破版，按鈕寬度需採用彈性寬度（`min-width` + `padding`）而非寫死固定寬度。

---

## 14. 設定頁面規格（對應需求 #12）

### 14.1 版面配置

採單欄清單式版面，分組呈現，避免視覺混亂：

```
┌───────────────────────────────┐
│  ← 返回          設定           │
├───────────────────────────────┤
│ 🌐 語言                          │
│   [中文 ▾]                      │  ← 下拉選單
├───────────────────────────────┤
│ 🎨 主題色彩                       │
│   ○ 經典木質  ○ 糖果繽紛  ○ 海洋藍   │  ← 色票圓點 + 名稱，橫向可捲動或自動換行
│   ○ 森林綠   ○ 夜間深色  ○ 櫻花粉   │
├───────────────────────────────┤
│ 🎵 背景音樂音量                    │
│   🔈 ────●───────── 🔊  65%       │  ← 滑桿元件，即時試聽
├───────────────────────────────┤
│ 🔔 音效音量                        │
│   🔈 ──────●─────── 🔊  80%       │
├───────────────────────────────┤
│ 📳 震動回饋（僅行動裝置顯示）           │
│   [開關 Toggle]                   │
├───────────────────────────────┤
│ 🗑 清除存檔進度                     │
│   [清除按鈕]（點擊需二次確認彈窗）      │
└───────────────────────────────┘
```

### 14.2 元件視覺規範

1. **滑桿（Slider）**：軌道使用主題強調色填滿已選範圍，圓形拖曳把手需夠大（直徑 ≥ 28px）方便手指操作，拖曳時即時更新百分比數字與試播一小段對應音效／音樂，提供即時聽覺回饋。
2. **主題色票**：以實際主題代表色的圓形色塊呈現，選中狀態需有明顯外框勾選標記（✓），並且點選後**整個設定頁與背景即時預覽切換該主題**，不需額外「套用」按鈕。
3. **Toggle 開關**：使用圓角膠囊造型，開啟時填滿強調色並將圓點滑至右側，關閉時為灰階置左，需有平滑過渡動畫（約 200ms）。
4. **危險操作**（清除存檔）需以警示色（如紅／橘）標示，並強制跳出二次確認彈窗：「確定要清除目前的對局進度嗎？此動作無法復原。」[取消] [確定清除]。
5. 全部設定變更**即時生效並即時寫入 `localStorage`**，不需要「儲存」按鈕，降低操作負擔。

### 14.3 排版原則

- 各設定分組之間使用清楚的分隔線或卡片間距（`--radius-md` 圓角卡片包裹每個分組），避免整頁看起來像落落長的表單。
- 圖示（emoji 或 SVG icon）統一放置於每個設定項最左側，強化可掃視性。
- 手機版設定頁維持單欄滿版寬度；桌機版可限制最大寬度（如 600px）並置中，避免選項橫向拉得過寬難以閱讀。

---

## 15. 說明頁面規格（對應需求 #10）

### 15.1 內容結構（分段卡片式排版，而非長篇文字牆）

```
1️⃣ 什麼是點格棋？
    - 一句話簡介 + 示意小圖（棋盤縮圖）

2️⃣ 基本規則：如何畫線
    - 圖解：點擊/點觸兩點之間畫出一條線
    - 動態示意圖（可用簡單 CSS 動畫展示畫線瞬間）

3️⃣ 如何得分：完成格子
    - 圖解：四邊都畫滿的格子會被「佔領」並染色
    - 標註「誰畫下最後一筆，格子就歸誰」

4️⃣ 額外回合規則（重點規則，容易誤解）
    - 圖解：完成格子後可以「再下一手」
    - 標示連續吃格的示意圖（一次吃兩格、三格的連鎖範例）

5️⃣ 獲勝條件
    - 圖解：棋盤畫滿後，比較雙方格子數，多者獲勝

6️⃣ AI 難度說明
    - 簡單／普通／困難 各自的行為特色簡述（不透漏演算法細節，僅描述玩家會感受到的體驗差異）

7️⃣ 小技巧提示（Tips）
    - 例如：「避免把棋盤變成只剩三邊的格子，除非你已經沒有安全的選擇」
    - 「留意鏈狀連續格子，一次可能被對手整條吃光」
```

### 15.2 視覺呈現規則

1. 每個段落使用獨立卡片（圓角、輕陰影），標題搭配大型 emoji 或 SVG 插圖圖示，確保「圖多、易讀」。
2. 規則示意圖優先使用**簡化 SVG 小型互動棋盤**（3×3 或 2×2 迷你範例），必要時可加上「▶ 播放示範動畫」按鈕，點擊後自動播放一段 3-5 步的示範畫線／吃格過程並可重播。
3. 文字敘述維持短句、條列式，避免大段落文字（單段文字建議不超過 3 行）。
4. 頁面右側（桌機）或頂部（手機）提供**章節快速跳轉錨點導覽**（1️⃣～7️⃣ 圖示列），點擊直接捲動至該段落，方便使用者快速查找特定規則而不必整頁閱讀。
5. 說明頁支援語系切換，所有圖說文字皆走 i18n 系統。
6. 頁尾提供醒目的 `[我懂了，開始遊戲！]` 按鈕，直接導向棋盤大小／難度選擇彈窗，縮短理解規則到開始遊戲的路徑。

---

## 16. 存檔與繼續遊戲機制

### 16.1 存檔時機

- 每完成一次玩家或 AI 的落子後，即時將目前 `BoardModel` 完整序列化寫入 `localStorage.savedGame`。
- 存檔內容包含：棋盤大小、所有線條狀態、格子歸屬、比分、目前回合、AI 難度、對局開始時間戳。

### 16.2 「繼續遊戲」按鈕顯示邏輯

- `main.js` 初始化時檢查 `localStorage.savedGame` 是否存在且 `status === 'playing'`。
  - 存在 → 主畫面顯示「繼續遊戲」按鈕。
  - 不存在或對局已結束 → 該按鈕整個隱藏（`display: none`），不佔用版面、不顯示灰色不可點擊的殘影按鈕（呼應主畫面簡潔需求）。
- 對局正常結束（分出勝負）或使用者主動「清除存檔」後，`savedGame` 應被清除。

---

## 17. 動畫與互動回饋

| 情境 | 動畫效果 |
|---|---|
| 按鈕懸停 / 觸控按下 | 縮放 `scale(0.96)` 按下回饋 + 陰影變化，時長 100-150ms |
| 畫線瞬間 | 線條從 0 長度以 `stroke-dashoffset` 動畫方式「畫出」的過程，約 150ms，而非瞬間出現，強化擬真手感（對應需求 #13） |
| 完成格子 | 格子底色由透明淡入至該方色彩，並疊加一個小圖示彈跳進入（`scale` 從 0 到 1，帶 overshoot 彈性曲線） |
| 回合切換 | 分數列中目前回合方頭像有柔和脈動光暈（`box-shadow` 呼吸動畫） |
| 頁面切換 | 淡入淡出 + 輕微位移（200-300ms），避免生硬跳頁 |
| 彈窗開啟 | 由下往上滑入 + 淡入（行動裝置）／由中心縮放淡入（桌機） |
| 勝利結算 | 背景飄落彩帶／星星裝飾動畫（CSS 或輕量 Canvas 皆可），強化慶祝感 |
| AI 思考中 | 圓點跳動或旋轉圖示 loading 動畫，搭配文字「AI 思考中...」 |

> 所有動畫需支援使用者系統設定 `prefers-reduced-motion: reduce` 時自動降級為極簡淡入淡出，避免造成不適（無障礙考量）。

---

## 18. 無障礙與例外處理

### 18.1 無障礙

- 所有互動元件（按鈕、滑桿、下拉選單）需有適當的 `aria-label` 或可視文字標籤，不可僅靠純圖示無文字說明。
- 色彩以外提供第二辨識依據（見 10.3 第 2 點）。
- 觸控熱區最小 44×44px（符合 iOS / Android 官方建議）。
- 支援鍵盤 Tab 操作跳轉主要按鈕（桌機使用情境）。

### 18.2 例外與邊界情況處理

| 情境 | 處理方式 |
|---|---|
| `localStorage` 被瀏覽器封鎖（無痕模式等） | 顯示提示：「目前無法儲存進度，設定將於重新整理後重置」，遊戲仍可正常進行，僅不提供「繼續遊戲」功能 |
| 音訊檔案載入失敗 | 靜默失敗，不阻斷遊戲流程，並將該次音量控制自動視為靜音狀態，於 console 記錄錯誤（不影響玩家體驗） |
| 視窗尺寸極端窄（< 280px）或極端寬高比 | 棋盤仍維持最小可玩尺寸，必要時允許棋盤區域出現內部捲動（最後手段），但預設邏輯應盡量透過縮小非棋盤元素避免走到此步 |
| 使用者於 AI 思考中途切換分頁後返回 | AI 邏輯應為同步運算或短時間內完成，不依賴 `setTimeout` 卡住流程過久；若使用計時器模擬思考延遲，需確保分頁不可見時仍可正常於背景完成運算（可用 `Page Visibility API` 偵測並適度調整） |
| 語系檔缺少某個 key | `i18n-manager.js` 需有 fallback 機制，缺漏 key 時 fallback 至 `zh-TW` 對應文字並於 console 警告，避免畫面出現空白或 `undefined` |

---

## 19. 驗收測試清單

### 19.1 基本可執行性

- [ ] 於全新資料夾（無任何 node_modules／未跑過任何指令）狀態下，直接雙擊 `index.html` 可完整開啟並遊玩，無 console 錯誤。
- [ ] 離線（關閉網路）狀態下，功能與資源皆正常運作。

### 19.2 RWD

- [ ] iPhone SE（375px）、iPhone 15 Pro Max（430px）、iPad（768px/1024px）、桌機（1440px+）皆測試棋盤完整可見不被裁切。
- [ ] 手機直向／橫向切換，棋盤與按鍵不重疊、不遮擋。
- [ ] 行動裝置底部固定按鍵列不遮擋棋盤最下緣格子。

### 19.3 視覺與文字

- [ ] 六種主題配色皆通過對比度檢查，無「看不見」的文字或線條。
- [ ] 全站字體大小皆 ≥ 規範表訂下限，無小字出現。
- [ ] 三種語系切換後版面不破版（特別檢查日文較長字串）。

### 19.4 音訊

- [ ] BGM 為鋼琴輕快風格，音效為高音清脆風格。
- [ ] 對局中 BGM 音量明顯大於主畫面（5 倍增益邏輯生效）且無破音失真。
- [ ] 使用者可獨立調整 BGM／SFX 音量並即時生效、正確持久化。

### 19.5 遊戲邏輯

- [ ] 三種難度 AI 行為特徵符合第 7 章描述（簡單易贏、普通中等、困難需鏈路策略才能取勝）。
- [ ] 完成格子觸發額外回合規則正確運作。
- [ ] 存檔／繼續遊戲於重新整理頁面後正確還原對局狀態。

### 19.6 頁面完整性

- [ ] 主畫面僅四個主要按鈕（開始／繼續／說明／設定），無多餘設定項外露。
- [ ] 說明頁圖文豐富、分段清楚、可快速跳轉章節。
- [ ] 設定頁排版乾淨、滑桿與開關元件操作直覺美觀。

---

## 附錄 A：命名與程式碼風格建議

- JavaScript 變數／函式：`camelCase`；常數：`UPPER_SNAKE_CASE`；CSS class：`kebab-case`（並建議採用 BEM 風格，如 `board__cell--completed`）。
- 每個 JS 模組頂部需有簡短註解說明該檔案職責，避免未來擴充（如新增雙人對戰模式）時難以定位程式碼。
- 所有魔法數字（如棋盤預設大小、AI 思考延遲毫秒數）集中於 `js/data/constants.js`，禁止散落於邏輯檔案中直接寫死。

## 附錄 B：未來可擴充但本階段不實作項目（僅預留架構彈性）

- 本機雙人對戰模式、線上連線對戰模式。
- 對局復盤／步驟回放功能（`moveHistory` 資料結構已預留）。
- 更多棋盤尺寸（如 8×8）與更多主題色彩。
- 成就系統／連勝紀錄。

---

*文件結束*
