# 🎲 Nim（尼姆 / 搶數字）遊戲 — 完整技術規格書

> 文件版本：v1.0　｜　文件類型：產品 / 技術規格書（非 README，非程式碼）
> 適用範圍：純前端網頁遊戲，可直接以瀏覽器開啟 `index.html` 執行，無需任何建置（build）或伺服器（server）

---

## 📋 需求對照總表

在深入細節之前，先建立需求 ↔ 規格章節 的對照表，確保「各方面都顧及到」：

| # | 使用者需求 | 對應章節 |
|---|---|---|
| 1 | 純前端、雙擊 index.html 即可玩，無需 build/server | 第 3 章、第 4 章 |
| 2 | RWD 順暢、不遮擋遊戲畫面 | 第 5 章 |
| 3 | 大字體、多色配色、可愛風主題 | 第 6 章 |
| 4 | CSS / JS 分類資料夾、index 用引入方式 | 第 4 章 |
| 5 | 主畫面：開始 / 繼續 / 說明 / 設定 | 第 7 章 |
| 6 | BGM 多首輕快鋼琴曲、音效清脆高音 | 第 11 章 |
| 7 | 遊戲中 BGM 音量放大 10 倍 | 第 11.5 章 |
| 8 | RWD 行動按鍵不擋畫面 | 第 5.4 章 |
| 9 | 多國語系（中/英/日） | 第 12 章 |
| 10 | 說明頁面豐富圖示、詳細易讀 | 第 9 章 |
| 11 | 畫面豐富有趣、配色優化無視覺問題 | 第 6 章、第 15 章 |
| 12 | 設定頁排版乾淨、按鍵/音量選項好看 | 第 10 章 |
| 13 | 畫面擬真、有現實感 | 第 14 章 |
| 14 | 主畫面簡潔、不放設定選項 | 第 7.1 章 |
| 15 | 動作流暢不卡頓 | 第 13 章 |
| 16 | 不產生 README.md | 本文件即為證明，實作階段另行生成 |
| 17 | 圖示可愛有趣 | 第 14 章 |
| 18 | VS AI，用演算法調整難度 | 第 8.3 章 |

---

## 1. 專案總覽

### 1.1 專案名稱
**Nim 尼姆・搶數字**（暫定英文代號：`nim-game`）

### 1.2 專案定位
一款可在桌面瀏覽器與行動裝置瀏覽器上流暢遊玩的單機益智策略遊戲，玩家與 AI 對戰，主題為經典數學遊戲「Nim」（又稱搶數字、拈遊戲）。整體美術走**可愛療癒風**，並提供多種配色主題與三種語言介面。

### 1.3 核心遊戲玩法
- 場上有數堆（pile）物品（可自訂堆數與每堆數量）。
- 玩家與 AI 輪流，每回合須從**任一堆**中拿走**至少 1 個、最多整堆**的物品。
- 依照設定的勝負規則（標準版 / 搶輸版），最終決定勝負。
- AI 難度由**演算法**（Nim 定理 / XOR 必勝策略）控制，而非隨機亂數堆疊難度。

### 1.4 目標裝置與環境
| 項目 | 規格 |
|---|---|
| 執行方式 | 本機雙擊 `index.html`（`file://` 協定）直接開啟，**不需要** `npm install`、`npm run build`、`live-server` 等任何指令 |
| 支援瀏覽器 | Chrome、Edge、Safari、Firefox（近 2 年版本） |
| 支援裝置 | 桌機／筆電（滑鼠鍵盤）、平板（觸控）、手機（觸控，直/橫向） |
| 網路需求 | 完全離線可執行（字體、音檔、圖示全部本地化存放，不依賴外部 CDN） |

### 1.5 非目標（Out of Scope）
- 不含多人連線對戰、不含後端資料庫、不含帳號系統。
- 不在此規格書中產生 README.md（依需求 16，README 將於「遊戲完成」後另行產生）。

---

## 2. 遊戲規則定義（Game Rules Specification）

### 2.1 基本規則
1. 初始盤面由**設定值**決定堆數與每堆數量，內建 3 種預設 + 1 種自訂：

   | 預設模式 | 堆數與數量 |
   |---|---|
   | 經典模式（Classic） | 3 堆：3 / 4 / 5 |
   | 標準模式（Standard） | 4 堆：1 / 3 / 5 / 7 |
   | 進階模式（Advanced） | 5 堆：2 / 4 / 6 / 8 / 10 |
   | 自訂模式（Custom） | 堆數 2～6 堆，每堆 1～20 個，於設定頁調整 |

2. 玩家輪流行動，每回合：
   - 選擇**一堆**（且僅能一堆）。
   - 從該堆拿走 **1 個以上、不超過該堆剩餘數量** 的物品。
   - 不可跳過回合（必須至少拿 1 個）。
3. 當所有堆的物品數量皆為 0 時，遊戲結束，依照勝負規則判定贏家。

### 2.2 勝負規則（可於設定切換）
| 規則名稱 | 說明 |
|---|---|
| **標準版 Normal Play**（拿到最後贏） | 拿走最後一個物品的玩家 **獲勝** |
| **搶輸版 Misère Play**（拿到最後輸，預設） | 拿走最後一個物品的玩家 **落敗**（符合中文「搶數字」語感，設為預設值） |

> 📌 設定頁需清楚以圖示 + 文字說明兩種規則差異（見第 10 章）。

### 2.3 先後手決定
設定頁提供三種選項：
- 玩家先手
- AI 先手
- 隨機決定（每局重新擲骰決定）

### 2.4 回合流程（狀態機）
```
[遊戲開始] → [判斷先手] → [當前玩家回合開始]
   → 若為玩家：等待點擊「堆」→ 等待點擊/拖曳選擇拿取數量 → 點擊「確認」
   → 若為 AI：延遲 0.8~1.5 秒（模擬思考動畫）→ AI 依難度演算法計算行動 → 播放拿取動畫
→ [檢查盤面是否全為 0]
   → 是：進入 [結算畫面]（依勝負規則判斷贏家 → 播放勝/敗動畫與音效）
   → 否：切換玩家 → 回到 [當前玩家回合開始]
```

### 2.5 合法性檢查（防呆）
- 若玩家嘗試拿取數量為 0 或超過該堆剩餘量，**確認鍵應為 disabled 狀態**並顯示提示文字（多語系）。
- 遊戲進行中不可切換語言/主題造成盤面重繪錯誤（切換時需保留當前盤面狀態，僅重繪視覺層）。

---

## 3. 技術架構總覽（純前端 / 零建置）

### 3.1 技術選型
| 項目 | 選型 | 原因 |
|---|---|---|
| 標記語言 | 純 HTML5 | 不需框架，最大化「雙擊即玩」相容性 |
| 樣式 | 純 CSS3（自訂屬性 / Flexbox / Grid） | 不使用 Sass/Less 等需要編譯的語言 |
| 腳本 | 純 Vanilla JavaScript（ES2017+ 語法，**不使用 ES Module `import/export`**） | 見 3.2 關鍵限制 |
| 音訊 | Web Audio API（`AudioContext` + `GainNode`） | 支援音量倍率放大（需求 7）與音效即時播放 |
| 儲存 | `localStorage` | 儲存「繼續遊戲」存檔與使用者設定，無需後端 |
| 圖示 | 內嵌 SVG / PNG 靜態圖檔 | 離線可用，無需字型圖示庫 CDN |

### 3.2 ⚠️ 關鍵技術限制：禁止使用 ES Module `import/export`
由於本專案要求**直接以 `file://` 協定雙擊開啟**，多數瀏覽器（Chrome / Edge）基於 CORS 安全機制，會**封鎖** `<script type="module">` 從 `file://` 讀取模組的行為（會出現 `Cross origin requests are only supported for HTTP.` 錯誤）。

**規格要求：**
- 所有 JS 檔案一律使用**傳統 `<script src="...">`** 標籤引入（非 `type="module"`）。
- 每個 JS 檔案以 **IIFE（立即執行函式）** 包裝，並掛載到單一全域命名空間物件 `window.NimGame`，避免污染全域變數並維持模組化：

```javascript
// js/core/game-engine.js
(function (NimGame) {
  'use strict';

  NimGame.GameEngine = {
    init(config) { /* ... */ },
    takeFromPile(pileIndex, amount) { /* ... */ },
    isGameOver() { /* ... */ }
  };

}(window.NimGame = window.NimGame || {}));
```
- `index.html` 中依照**相依順序**逐一以 `<script>` 引入（工具函式 → 核心邏輯 → UI 控制 → 進入點 `main.js`），確保載入順序正確。

### 3.3 index.html 引入方式範例（僅示意，實作階段依此擴充）
```html
<!-- CSS：依 base → layout → themes → components → animations 順序引入 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/grid.css">
<link rel="stylesheet" href="css/layout/rwd.css">
<link rel="stylesheet" href="css/themes/theme-cute.css" id="theme-stylesheet">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/menu.css">
<link rel="stylesheet" href="css/components/board.css">
<link rel="stylesheet" href="css/components/hud.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/settings.css">
<link rel="stylesheet" href="css/components/instructions.css">
<link rel="stylesheet" href="css/components/decorations.css">
<link rel="stylesheet" href="css/animations/animations.css">

<!-- JS：工具 → 核心 → UI → 進入點，全部放在 </body> 前 -->
<script src="js/utils/dom-utils.js"></script>
<script src="js/utils/storage-utils.js"></script>
<script src="js/i18n/locales/zh-TW.js"></script>
<script src="js/i18n/locales/en.js"></script>
<script src="js/i18n/locales/ja.js"></script>
<script src="js/i18n/i18n-manager.js"></script>
<script src="js/audio/audio-config.js"></script>
<script src="js/audio/audio-manager.js"></script>
<script src="js/core/rules.js"></script>
<script src="js/core/game-engine.js"></script>
<script src="js/core/ai-engine.js"></script>
<script src="js/core/state-manager.js"></script>
<script src="js/ui/animation-controller.js"></script>
<script src="js/ui/modal-controller.js"></script>
<script src="js/ui/board-renderer.js"></script>
<script src="js/ui/menu-controller.js"></script>
<script src="js/ui/settings-controller.js"></script>
<script src="js/ui/instructions-controller.js"></script>
<script src="js/main.js"></script>
```

---

## 4. 專案資料夾結構（CSS / JS 詳細分類）

```
nim-game/
├── index.html
│
├── css/
│   ├── base/
│   │   ├── reset.css              # CSS Reset / Normalize
│   │   ├── variables.css          # 全域 CSS 變數（顏色 token、字體大小、間距）
│   │   └── typography.css         # 字體家族、大字體規範、多語系字體 fallback
│   │
│   ├── layout/
│   │   ├── grid.css               # 版面骨架（header/main/footer 區域）
│   │   └── rwd.css                # 響應式斷點與媒體查詢
│   │
│   ├── themes/
│   │   ├── theme-cute.css         # 可愛主題（大量可愛圖案，預設主題）
│   │   ├── theme-candy.css        # 糖果繽紛主題
│   │   ├── theme-ocean.css        # 海洋藍主題
│   │   ├── theme-forest.css       # 森林綠主題
│   │   ├── theme-sunset.css       # 夕陽暖橘主題
│   │   └── theme-night.css        # 夜間深色主題
│   │
│   ├── components/
│   │   ├── buttons.css            # 按鈕元件（主/次/圖示按鈕）
│   │   ├── menu.css               # 主畫面選單
│   │   ├── board.css              # 遊戲棋盤／堆疊物件
│   │   ├── hud.css                # 遊戲中狀態列（回合、比分、堆數提示）
│   │   ├── modal.css              # 彈窗（結算、確認離開等）
│   │   ├── settings.css           # 設定頁專用樣式
│   │   ├── instructions.css       # 說明頁專用樣式
│   │   └── decorations.css        # 裝飾元素（星星、愛心、腳印飄浮動畫）
│   │
│   └── animations/
│       └── animations.css         # 共用關鍵影格動畫（@keyframes）
│
├── js/
│   ├── main.js                    # 進入點：初始化流程、路由（畫面切換）
│   │
│   ├── core/
│   │   ├── rules.js                # 勝負規則定義（Normal / Misère）
│   │   ├── game-engine.js          # 核心遊戲邏輯（狀態、合法性檢查）
│   │   ├── ai-engine.js            # AI 演算法（Nim-Sum、難度控制）
│   │   └── state-manager.js        # 遊戲狀態存取、存檔／讀檔邏輯
│   │
│   ├── ui/
│   │   ├── menu-controller.js      # 主畫面互動
│   │   ├── board-renderer.js       # 堆疊物件渲染與拿取互動
│   │   ├── settings-controller.js  # 設定頁互動與即時預覽
│   │   ├── instructions-controller.js # 說明頁互動（分頁/手風琴）
│   │   ├── modal-controller.js     # 通用彈窗控制
│   │   └── animation-controller.js # 動畫排程（拿取、勝利、粒子特效）
│   │
│   ├── audio/
│   │   ├── audio-config.js         # 音檔清單、預設音量、倍率設定
│   │   └── audio-manager.js        # Web Audio 播放、音量控制、淡入淡出
│   │
│   ├── i18n/
│   │   ├── i18n-manager.js         # 語系切換邏輯、文字取值函式 t(key)
│   │   └── locales/
│   │       ├── zh-TW.js            # 繁體中文字典
│   │       ├── en.js               # 英文字典
│   │       └── ja.js               # 日文字典
│   │
│   └── utils/
│       ├── dom-utils.js            # DOM 操作輔助函式
│       └── storage-utils.js        # localStorage 存取封裝（含容錯）
│
├── assets/
│   ├── images/
│   │   ├── icons/                  # UI 圖示（設定齒輪、喇叭、返回箭頭…）
│   │   ├── mascot/                 # 可愛吉祥物（多情緒：開心/苦惱/勝利/安慰）
│   │   ├── backgrounds/            # 各主題背景圖／花紋
│   │   └── objects/                # 堆疊物件外觀（石頭/糖果/星星/貝殼skin）
│   │
│   ├── audio/
│   │   ├── bgm/                    # 多首輕快鋼琴 BGM（見 11.1）
│   │   └── sfx/                    # 高音清脆音效（見 11.2）
│   │
│   └── fonts/                      # 本地字型檔（woff2），確保離線可用
│
└── docs/
    └── nim-game-specification.md   # 本規格書（開發參考用，非執行必要檔案）
```

> 📌 分類原則：`base`（不變的基礎）→ `layout`（版面骨架）→ `themes`（可替換的視覺）→ `components`（功能元件）→ `animations`（動效），JS 則依 `core`（邏輯）/`ui`（畫面）/`audio`（聲音）/`i18n`（語言）/`utils`（工具）分層，職責單一、方便未來擴充。

---

## 5. 響應式設計（RWD）規格

### 5.1 斷點定義
| 裝置類型 | 寬度範圍 | 版面策略 |
|---|---|---|
| 手機直向 | ≤ 480px | 單欄堆疊、堆疊物件縮小排列、操作按鈕固定於底部安全區 |
| 手機橫向 / 小平板 | 481px–767px | 左側盤面、右側精簡 HUD，或上下分區 |
| 平板 | 768px–1024px | 盤面置中放大、HUD 與按鈕分離但不重疊 |
| 桌機 | 1025px–1440px | 盤面 + 側邊資訊欄雙欄式 |
| 大螢幕 | > 1440px | 盤面等比放大，兩側留白裝飾 |

### 5.2 版面骨架（三區域固定，避免遮擋）
```
┌─────────────────────────────┐
│           Header            │  ← 回合狀態 / 語言 / 靜音鍵（固定高度，不隨畫面捲動遮住主圖）
├─────────────────────────────┤
│                              │
│         Main（遊戲盤面）      │  ← 佔用剩餘可用高度（使用 svh/dvh 動態視窗單位）
│                              │
├─────────────────────────────┤
│      Footer（操作按鍵區）     │  ← 固定安全區，絕不與 Main 重疊
└─────────────────────────────┘
```

### 5.3 關鍵 CSS 技術要求
- 使用 `100dvh` / `100svh`（動態視窗高度）取代 `100vh`，避免行動瀏覽器網址列造成版面跳動或遮擋。
- 使用 `env(safe-area-inset-bottom)` 為 iPhone 瀏海/手勢列預留安全間距。
- `viewport` meta 標籤：
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  ```
- 遊戲盤面容器使用 `flex: 1; min-height: 0; overflow: auto;`，確保操作區域不被盤面內容擠出畫面。

### 5.4 行動裝置操作按鍵不遮擋畫面（需求 8）
- 操作按鍵（拿取數量 +/-、確認、取消）一律置於 **Footer 固定區塊**，**不使用** `position: fixed` 覆蓋在盤面正上方。
- 若畫面過窄導致按鍵過多，改以「先點堆 → 彈出底部滑出式數量選擇條（bottom sheet）」，滑出時盤面自動**上移或縮小**而非被蓋住。
- 橫向模式時，操作區改為**右側或左側窄欄**，寬度固定（如 96px~120px），不佔用主盤面中央區域。
- 所有可點擊按鈕最小尺寸 **44×44px**（符合觸控可用性標準），按鈕間距 ≥ 8px 避免誤觸。

### 5.5 效能考量（RWD 圖片與資源）
- 主題背景與吉祥物圖片提供至少 2 種解析度（`@1x`/`@2x`），透過 `srcset` 依裝置像素密度載入，避免手機端載入過大圖檔造成延遲。

---

## 6. 視覺設計規格（字體 / 配色 / 主題）

### 6.1 字體規範（大字體、明確清楚，需求 3）
| 用途 | 字體大小（桌機） | 字體大小（手機） | 字重 |
|---|---|---|---|
| 主標題（LOGO / 頁面標題） | 48px | 32px | 700 |
| 按鈕文字 | 24px | 20px | 700 |
| 內文說明 | 20px | 18px | 500 |
| 輔助小字（版本號等） | 16px | 14px | 400 |

- 全站字體一律使用 CSS 變數集中管理，禁止內文小於 **16px**。
- 字體家族建議（需支援中/英/日三語系顯示，且風格圓潤可愛）：
  - 標題／裝飾：`"Baloo 2"`、`"Varela Round"`（英文圓體）
  - 中文本文：`"Chenyu Luoyan Ti"` 或 `"Taipei Sans TC Beta"` 等圓體中文字（若取得授權困難，退回 `"Noto Sans TC"` 並加粗）
  - 日文本文：`"Zen Maru Gothic"`（圓體日文，可愛感佳）
  - 統一 fallback 順序：`font-family: "Baloo 2", "Zen Maru Gothic", "Taipei Sans TC Beta", "Noto Sans", sans-serif;`
- 字型檔需下載後放置於 `assets/fonts/` 並以 `@font-face` 本地引入，**不依賴外部 Google Fonts CDN**，確保離線可用。

### 6.2 配色系統（CSS 變數 Token）
所有主題共用同一組變數名稱，僅替換數值，方便切換：

```css
/* css/base/variables.css（預設 fallback 值，會被 theme-*.css 覆蓋） */
:root {
  --color-primary: #FF8FAB;
  --color-secondary: #FFD6E8;
  --color-accent: #FFC93C;
  --color-bg: #FFF7FB;
  --color-bg-secondary: #FFFFFF;
  --color-text: #4A4A68;
  --color-text-inverse: #FFFFFF;
  --color-success: #6BCB77;
  --color-danger: #FF6B6B;
  --color-board: #FFE8F0;
  --color-shadow: rgba(0,0,0,0.12);

  --font-size-title: 48px;
  --font-size-button: 24px;
  --font-size-body: 20px;
  --font-size-small: 16px;

  --radius-base: 20px;
  --spacing-unit: 8px;
}
```

### 6.3 六種主題總表（多樣色彩，需求 3）
| 主題檔名 | 主題名稱 | 色彩意象 | 特色 |
|---|---|---|---|
| `theme-cute.css` | 🌸 可愛粉彩（預設） | 粉紅／薰衣草紫／奶油黃 | 背景滿版愛心、星星、雲朵、動物腳印圖樣，按鈕邊框圓潤帶陰影 |
| `theme-candy.css` | 🍬 糖果繽紛 | 馬卡龍色系多彩混搭 | 棋盤物件以糖果造型呈現 |
| `theme-ocean.css` | 🌊 海洋藍 | 藍／青綠／珊瑚橘 | 泡泡裝飾、波浪動畫背景 |
| `theme-forest.css` | 🌳 森林綠 | 綠／棕／米白 | 樹葉飄落裝飾 |
| `theme-sunset.css` | 🌇 夕陽暖橘 | 橘／紫紅／金黃 | 漸層天空背景 |
| `theme-night.css` | 🌙 夜間深色 | 深藍／紫黑／螢光點綴 | 護眼深色模式，星空背景 |

### 6.4 配色優化與可視性規範（需求 11，避免看不見/不好看）
- 所有「文字 vs 背景」對比度須符合 **WCAG AA 標準（對比比例 ≥ 4.5:1）**，即使在最鮮豔主題下也需檢核。
- 禁止「淺色文字疊在淺色背景」或「同色系文字疊在同色系按鈕」等低對比組合；每套主題上線前需以對比檢查工具驗證（記錄於第 16 章）。
- 互動元件（按鈕/可點擊堆疊物）在 `hover`、`active`、`disabled` 三種狀態都要有**明顯視覺差異**（非僅靠顏色，需搭配陰影/縮放/圖示變化，兼顧色弱使用者）。
- 每個主題預覽縮圖顯示於設定頁，使用者可即時預覽並套用（見第 10 章）。

---

## 7. 主畫面規格

### 7.1 主畫面配置（簡潔乾淨，需求 14）
- 主畫面**僅顯示 4 顆大型主要按鈕**，垂直置中排列，不放任何滑桿、開關等設定項目：
  1. 🎮 **開始遊戲**（Start Game）
  2. ▶️ **繼續遊戲**（Continue）— 若無存檔，此按鈕顯示為**灰階不可點擊**狀態並附文字提示「尚無進度」
  3. 📖 **遊戲說明**（How to Play）
  4. ⚙️ **設定**（Settings）
- 背景為主題裝飾動畫（飄浮愛心/星星/泡泡，依當前主題），吉祥物在畫面一角做輕微待機動畫（呼吸、眨眼）。
- LOGO／標題置於畫面上方，附副標題（例如：「和可愛的尼姆一起搶數字吧！」，依語系切換）。
- 主畫面**右上角僅保留語言切換小圖示**（地球圖示 + 目前語言縮寫），因語言切換屬於「全域即時需求」而非遊戲設定項，允許保留在主畫面（不算違反需求14「設定選項」，其餘所有設定一律收納進「設定」頁）。

### 7.2 開始遊戲流程
1. 點擊「開始遊戲」→ 彈出「快速開始」小視窗：選擇「使用目前設定的難度/規則直接開始」或「前往設定調整後開始」。
2. 若使用者已有進行中的存檔，開始新遊戲前彈出確認視窗：「開始新遊戲將覆蓋目前進度，是否繼續？」（是／否）。

### 7.3 繼續遊戲流程
- 讀取 `localStorage` 存檔，還原：目前盤面堆疊數量、輪到誰、已耗時間、目前套用的規則與難度。
- 若存檔資料版本不符（例如規格更新造成資料結構改變），顯示友善提示「進度已失效，即將開始新遊戲」並清除舊資料。

---

## 8. 遊戲畫面規格（含 AI 難度演算法）

### 8.1 畫面元素
| 元素 | 說明 |
|---|---|
| 堆疊物件（Piles） | 以卡通化物件（石頭/糖果/星星，可於設定切換skin）堆疊呈現，數量以視覺清點方式排列（非僅數字），輔以數字角標 |
| HUD 狀態列 | 顯示「目前回合：玩家 / AI」、目前規則（標準版/搶輸版小圖示）、難度等級圖示 |
| 操作區 | 選堆→顯示可調整拿取數量的滑桿或 +/- 按鈕 → 「確定拿取」按鈕 |
| 提示按鈕 | 選用：顯示「提示」功能，依演算法推薦一步（可於設定開關是否允許提示，預設關閉以維持挑戰性） |
| 返回選單鍵 | 左上角，點擊需二次確認「是否儲存目前進度並返回主選單？」 |

### 8.2 互動流程
1. 玩家點擊某一堆 → 該堆物件產生「選取中」光暈動畫。
2. 底部滑出數量選擇器（範圍 1 ~ 該堆剩餘數量），可用 +/- 按鈕或拖曳滑桿選擇。
3. 點擊「確定拿取」→ 播放「拿取音效」+ 物件消失動畫（淡出＋縮小＋輕微彈跳）。
4. 換 AI 回合 → 顯示「思考中…」吉祥物動畫（如摸下巴思考的可愛圖示）0.8~1.5 秒 → AI 執行拿取。
5. 重複至盤面歸零 → 進入結算彈窗（勝利／落敗動畫 + 對應音效 + 可選「再來一局」或「返回主選單」）。

### 8.3 AI 演算法與難度設計（需求 18，核心規格）

Nim 遊戲具有明確的數學最佳策略，稱為 **Nim-Sum（尼姆和）定理**：將所有堆的物品數量做**二進位 XOR（互斥或）運算**，其結果稱為 nim-sum。

**核心定理：**
- 若目前盤面的 nim-sum = 0，代表**當前行動方處於劣勢**（在雙方都採最佳策略下必敗）。
- 若 nim-sum ≠ 0，則**必定存在一步走法**，使得走完之後盤面的 nim-sum 變為 0，此步即為「必勝一手」。

**必勝手尋找演算法（虛擬碼）：**
```
function findOptimalMove(piles):
    nimSum = XOR(piles[0], piles[1], ..., piles[n-1])
    if nimSum == 0:
        return null   // 無必勝手，任意選一步（進入劣勢局面）
    for i in 0..n-1:
        target = piles[i] XOR nimSum
        if target < piles[i]:
            return { pileIndex: i, takeAmount: piles[i] - target }
    return null
```

> ⚠️ 註記：搶輸版（Misère Play）在**終局階段**（當所有堆的剩餘數量皆 ≤ 1 時）策略會與標準版相反，AI 演算法需依照 `rules.js` 當前設定的勝負規則，切換終局判斷邏輯，確保「困難」難度在兩種規則下都真正下出最佳解。

**難度分級表：**
| 難度 | 圖示建議 | 演算法行為 | 說明 |
|---|---|---|---|
| 🐣 新手 Easy | 小雞 | 100% 隨機合法走法 | 完全不使用 nim-sum，適合新手熟悉規則 |
| 🐰 普通 Normal | 兔子 | 70% 機率採用最佳解，30% 隨機走法 | 會下出好棋但偶爾失誤，避免玩家挫折感 |
| 🐯 困難 Hard | 老虎 | 95% 機率採用最佳解 | 高機率完美應對，極少失誤 |
| 🐉 大師 Master | 龍 | 100% 採用 nim-sum 最佳解 | 完美策略：若局面對 AI 有利，AI 必勝 |

- 難度數值（機率）建議集中設定於 `js/core/ai-engine.js` 頂部常數表，方便未來調整平衡性。
- AI 每次行動前先呼叫 `findOptimalMove()`，再依難度機率決定是否採用該最佳解或改用隨機合法走法（`getRandomMove()`），使演算法與難度呈現解耦（同一套核心演算法，僅調整採用機率）。

---

## 9. 說明頁面規格（需求 10）

### 9.1 頁面結構（分頁籤 Tab 呈現，避免大量文字堆疊）
| 分頁 | 內容 |
|---|---|
| 📜 基本規則 | 圖文並茂說明堆疊、拿取規則，搭配 3 張示意插圖（初始盤面→玩家拿取→AI回應） |
| 🏆 勝負規則 | 並排比較「標準版」vs「搶輸版」兩張情境圖，明確標示最後一顆物品拿走者的勝負結果 |
| 🕹️ 操作教學 | 以手指點擊圖示 + 步驟編號（① 點選堆 → ② 選擇數量 → ③ 確認拿取）呈現，行動裝置額外顯示觸控手勢圖示 |
| 🤖 AI 難度說明 | 四個難度以吉祥物插圖呈現（小雞/兔子/老虎/龍），輔以一句話難度描述，不揭露過深數學細節（保持親和） |
| ❓ 常見問題 FAQ | 手風琴（accordion）樣式收合問答，例如「可以跳過回合嗎？」「怎麼繼續上次進度？」 |

### 9.2 視覺與可讀性要求
- 每個規則說明段落**必須搭配至少一個圖示或插圖**，文字段落不超過 3~4 行，避免大段文字牆。
- 使用高對比色的「重點提示框」（如淺黃底 + 圖示）標示關鍵規則，例如「⚠️ 搶輸版：拿到最後一個會輸喔！」。
- 頁面右上角提供「關閉」大按鈕（44×44px 以上），行動裝置下固定於畫面可見範圍。
- 支援上下捲動閱讀，捲動時分頁籤固定於頂部（sticky）方便快速切換。

---

## 10. 設定頁面規格（需求 12）

### 10.1 版面配置（乾淨簡單，分區塊呈現）
```
┌───────────────────────────────┐
│  ⚙️ 設定                 [關閉] │
├───────────────────────────────┤
│ 🌐 語言        [中文 ▾]         │
│ 🎨 主題        [縮圖預覽 x6]     │
│ 🔊 音樂音量    [======●----]    │
│ 🔔 音效音量    [========●--]    │
│ 🎚️ 難度        [新手|普通|困難|大師] │
│ 🎲 遊戲規則    [標準版 / 搶輸版]  │
│ 🧩 堆疊配置    [經典/標準/進階/自訂] │
│ 🍬 物件外觀    [石頭|糖果|星星|貝殼] │
├───────────────────────────────┤
│      [重設進度]   [儲存並返回]   │
└───────────────────────────────┘
```

### 10.2 元件設計要求
- **滑桿（Slider）**：音量調整使用大型圓形拖曳鈕（直徑 ≥ 28px），拖曳時即時顯示數值百分比氣泡與試聽音效（放開手指時播放一次音效供預覽）。
- **主題選擇**：以 6 張縮圖卡片橫向捲動或格狀排列呈現，選中時卡片邊框發光＋打勾圖示，並即時套用於設定頁背景預覽（所見即所得）。
- **難度／規則／堆疊配置**：一律使用**分段按鈕（Segmented Control）**樣式而非下拉選單，觸控更直覺、視覺更精緻。
- **語言選單**：下拉選單需顯示**該語言自身文字**（例如「中文」「English」「日本語」），而非翻譯後文字，方便使用者辨識自己看得懂的語言。
- 所有設定變更**即時生效並自動存檔**（無需額外「儲存」步驟才算數，「儲存並返回」按鈕僅作為返回主選單的引導動作，降低使用者誤解沒存到的疑慮）。
- 「重設進度」按鈕需二次確認彈窗，避免誤觸清除存檔。

---

## 11. 音訊系統規格

### 11.1 BGM（背景音樂）規格（需求 6）
- 提供 **至少 4 首**輕快風格鋼琴演奏曲，存放於 `assets/audio/bgm/`，格式建議 `.mp3`（相容性最佳）+ `.ogg`（備援）。
- 情境對應：
  | 檔名建議 | 使用情境 |
  |---|---|
  | `bgm-menu-01.mp3` | 主畫面／說明／設定頁播放 |
  | `bgm-game-01.mp3` | 遊戲進行中播放（輕快、循環無縫） |
  | `bgm-game-02.mp3` | 遊戲進行中隨機輪替曲目之一 |
  | `bgm-victory.mp3` | 結算畫面獲勝時短暫播放 |
- BGM 需支援**無縫循環（seamless loop）**，避免首尾銜接產生喀噠聲；設定頁可開關「BGM 自動輪播」。

### 11.2 音效（SFX）規格（需求 6：高音輕脆）
| 音效檔名建議 | 觸發時機 | 音色描述 |
|---|---|---|
| `sfx-click.mp3` | 一般按鈕點擊 | 清脆高音「叮」 |
| `sfx-pick-item.mp3` | 拿取物品瞬間 | 清亮高音「噠」，隨拿取數量可疊加輕微音高變化 |
| `sfx-select-pile.mp3` | 選取堆疊 | 短促高音「叮咚」 |
| `sfx-win.mp3` | 玩家獲勝 | 上揚清脆音階（似風鈴／音樂盒） |
| `sfx-lose.mp3` | 玩家落敗 | 柔和不刺耳的下降音階（避免太負面刺激） |
| `sfx-ai-think.mp3`（選用，音量極低） | AI 思考中循環音 | 輕柔滴答聲 |

### 11.3 音量控制架構
- 使用 `AudioContext` + 兩條獨立 `GainNode` 路徑：`bgmGainNode`、`sfxGainNode`，分別對應設定頁兩組音量滑桿（範圍 0~100%，對應 gain 值 0~1）。

### 11.4 🔊 遊戲中 BGM 音量放大 10 倍（需求 7，重要技術規格）
- **需求**：進入「遊戲畫面」（Game Screen）時，BGM 音量需為使用者設定音量的 **10 倍增益**。
- **技術限制與對應方案**：
  - 原生 `<audio>.volume` 屬性數值上限固定為 `1.0`，**無法**超過原音量，因此**不可使用** `<audio>` 標籤直接播放遊戲中 BGM。
  - 規格要求改用 **Web Audio API 的 `GainNode`**，其 `gain.value` **可設定超過 1.0**（無上限），藉此達成「10 倍增益」的效果：
    ```javascript
    // js/audio/audio-manager.js 概念示意
    const bgmGain = audioContext.createGain();
    const baseVolume = userSettings.bgmVolume; // 0 ~ 1，來自設定頁滑桿
    const IN_GAME_MULTIPLIER = 10; // 需求7：遊戲中固定放大10倍

    function enterGameScreen() {
      bgmGain.gain.setTargetAtTime(
        baseVolume * IN_GAME_MULTIPLIER,
        audioContext.currentTime,
        0.05 // 平滑過渡，避免爆音
      );
    }

    function leaveGameScreen() {
      bgmGain.gain.setTargetAtTime(baseVolume, audioContext.currentTime, 0.05);
    }
    ```
  - ⚠️ **必要防護措施**：10 倍增益極容易造成**削波失真（clipping）／爆音**，規格要求**必須**在音訊訊號鏈最末端串接 **`DynamicsCompressorNode`（動態壓縮器 / 限制器）**，防止破音並保護使用者聽力與裝置喇叭：
    ```
    音源(BGM) → GainNode(×10 / 使用者音量) → DynamicsCompressorNode(限制器) → 輸出(destination)
    ```
  - 建議 `DynamicsCompressorNode` 參數：`threshold: -12dB`、`ratio: 20`（近似 Limiter），確保即使 10 倍增益也不會超過數位滿刻度造成刺耳雜音。
  - 此放大效果**僅套用於「遊戲進行中」畫面**；回到主選單／說明／設定頁時，BGM 音量需**平滑過渡回使用者原始設定音量**（過渡時間建議 0.3~0.5 秒淡入淡出，避免忽大忽小的突兀感）。

### 11.5 音效／音樂開關
- 設定頁提供獨立「BGM 開/關」「音效 開/關」總開關，關閉時對應 GainNode 直接設為 0，不影響另一軌播放。

---

## 12. 多國語系規格（i18n，需求 9）

### 12.1 支援語言
| 語系代碼 | 語言 |
|---|---|
| `zh-TW` | 繁體中文（預設） |
| `en` | 英文 |
| `ja` | 日文 |

### 12.2 架構設計
- 語言字典採用**扁平化 key-value 物件**存放於 `js/i18n/locales/*.js`，每個檔案掛載到全域命名空間：
```javascript
// js/i18n/locales/zh-TW.js
(function (NimGame) {
  'use strict';
  NimGame.locales = NimGame.locales || {};
  NimGame.locales['zh-TW'] = {
    'menu.start': '開始遊戲',
    'menu.continue': '繼續遊戲',
    'menu.howToPlay': '遊戲說明',
    'menu.settings': '設定',
    'game.yourTurn': '輪到你了！',
    'game.aiTurn': 'AI 思考中…',
    'game.pileLabel': '第 {index} 堆',
    'result.win': '恭喜獲勝！',
    'result.lose': '再接再厲！',
    'settings.bgmVolume': '音樂音量',
    'settings.sfxVolume': '音效音量'
    // ...（依實作階段擴充完整 key 清單）
  };
}(window.NimGame = window.NimGame || {}));
```
- `i18n-manager.js` 提供全域取值函式 `NimGame.t(key, params)`，支援簡易變數帶入（如 `{index}`）。
- 語言切換時：
  1. 更新 `<html lang="...">` 屬性（利於瀏覽器與無障礙工具辨識）。
  2. 重新掃描所有帶有 `data-i18n="key"` 屬性的 DOM 節點並替換文字內容。
  3. 語言選擇存入 `localStorage`，下次開啟自動套用上次選擇（若無記錄則依 `navigator.language` 自動偵測，偵測不到支援語系則預設 `zh-TW`）。

### 12.3 文案撰寫規範
- 三語系文案需**語意對齊**（非逐字直翻），並考量各語言文字長度差異對按鈕/版面的影響（例如日文常較長，按鈕需設計彈性寬度 `min-width` 而非固定寬度）。
- 所有數字、規則說明需在三語系下**意義一致**（尤其「搶輸版」等規則描述需精確翻譯，避免歧義）。

---

## 13. 動畫與效能規格（需求 15：流暢不卡頓）

### 13.1 效能目標
- 目標畫面更新率：**60 FPS**，行動裝置低階機種至少維持 **30 FPS** 以上不明顯掉幀。

### 13.2 技術要求
- 所有位移／縮放動畫一律使用 CSS `transform` 與 `opacity`（GPU 加速屬性），**禁止**對 `width`/`height`/`top`/`left` 做逐幀動畫（避免觸發 layout reflow）。
- 高頻動畫（如粒子特效、拿取物件飛出）使用 `will-change: transform` 提示瀏覽器提前建立合成層。
- JavaScript 動畫排程一律使用 `requestAnimationFrame`，**禁止**使用 `setInterval` 驅動視覺動畫。
- 音效播放需**預先載入（preload）**常用音效至記憶體（`AudioBuffer`），避免播放當下才讀檔造成延遲卡頓。
- 圖片資源需壓縮並提供適當尺寸（見 5.5），避免手機端因大圖解碼造成掉幀。
- 主執行緒避免長時間同步運算：AI 演算法（nim-sum 計算）本身運算量極小，可直接同步執行不需 Web Worker；但「AI 思考動畫」需以非同步 `setTimeout`/`Promise` 排程，避免阻塞 UI。

### 13.3 轉場設計
- 畫面切換（主選單 ↔ 遊戲 ↔ 說明 ↔ 設定）一律搭配 **200~300ms 的淡入淡出或滑動轉場**，避免畫面「硬切」造成生硬感，但轉場時間不宜過長影響操作效率。

---

## 14. 圖示與美術風格指南（需求 13、17：擬真、可愛有趣）

### 14.1 美術基調
- 整體走「**可愛擬真插畫風**」：物件（石頭/糖果/星星/貝殼）具備**柔和陰影、細膩漸層、輕微紋理**，並非純扁平色塊，營造「摸得到」的實體感（滿足需求13擬真），同時保有圓潤可愛的卡通造型（滿足需求17可愛）。
- 堆疊物件需有**立體堆疊層次感**（下層物件比上層略暗/略小，模擬透視），拿取時上層物件優先消失，符合直覺。

### 14.2 吉祥物設計（Mascot）
- 設計一隻可愛吉祥物角色（建議：圓滾滾的貓咪或兔子造型，暫名「尼姆醬」），至少需備妥以下**表情/動作差分**：
  | 情境 | 表情 |
  |---|---|
  | 主選單待機 | 微笑、輕輕眨眼呼吸動畫 |
  | AI 思考中 | 手托腮苦惱思考 |
  | 玩家獲勝 | 開心跳躍、揮舞彩帶 |
  | 玩家落敗 | 安慰／鼓勵表情（不做過度沮喪表情，避免負面情緒渲染） |
  | 說明頁引導 | 手指向說明內容的指引姿勢 |

### 14.3 圖示規範
- 所有 UI 圖示（設定齒輪、喇叭、返回箭頭、語言地球等）統一線條粗細與圓角弧度，收斂於同一套 icon set 風格，避免混用不同來源的圖示風格造成違和。
- 圖示需提供**淺色主題版**與**深色主題版（夜間模式）**兩種色版，確保在 `theme-night.css` 下圖示依然清晰可見。

### 14.4 裝飾元素
- 背景飄浮裝飾（愛心、星星、泡泡、樹葉，依主題而定）使用**低透明度、緩慢飄動**的 CSS 動畫，作為氛圍點綴，**不可**遮擋任何可互動元件或文字（z-index 需低於所有互動層）。

---

## 15. 無障礙與視覺一致性規範（呼應需求 11）

- **色彩對比**：所有文字/圖示與背景對比需通過 WCAG AA（4.5:1 一般文字／3:1 大字體與圖形元件）。
- **色盲友善**：勝負／規則等關鍵資訊**不可僅靠顏色**區分（例如紅=輸、綠=贏），需搭配圖示（❌/🏆）與文字標籤。
- **觸控目標**：所有可點擊元素最小 44×44px，間距足夠避免誤觸。
- **狀態明確性**：disabled 狀態按鈕需降低飽和度＋游標樣式變更（桌機）＋提示文字，避免使用者誤以為按鈕故障。
- **動態效果可關閉**：設定頁提供「減少動態效果」開關（呼應 `prefers-reduced-motion`），供對動畫敏感的使用者關閉非必要裝飾動畫。

---

## 16. 測試與品質檢查清單（QA Checklist）

實作完成後，需逐項核對以下清單：

**功能面**
- [ ] 雙擊 `index.html` 於 `file://` 協定下可直接運作，無 Console 錯誤（尤其確認無 CORS module 錯誤）
- [ ] 主選單四大按鈕功能正確，且「繼續遊戲」在無存檔時正確顯示不可點擊狀態
- [ ] 標準版／搶輸版兩種勝負規則邏輯皆正確（含終局特殊情況）
- [ ] 四種 AI 難度行為符合機率設計，「大師」難度在 nim-sum ≠ 0 的起始局面下應可穩定獲勝
- [ ] 存檔／讀檔（繼續遊戲）功能正確還原盤面與設定
- [ ] 三語系（中/英/日）文字皆完整無缺漏、無跑版

**視覺與 RWD**
- [ ] 手機直向／橫向、平板、桌機各斷點畫面皆正常，操作按鍵不遮擋盤面
- [ ] 六種主題配色皆通過對比度檢查，無「看不見」或「不協調」情況
- [ ] 大字體規範全站套用一致，無小於 16px 的內文

**音訊**
- [ ] BGM 於遊戲畫面音量確實為設定音量的 10 倍，且無明顯削波失真雜音
- [ ] 音效觸發時機正確、音色清脆不刺耳
- [ ] 音量調整即時生效並正確存檔

**效能**
- [ ] 動畫過程中無明顯掉幀（目標 60fps，低階裝置 ≥ 30fps）
- [ ] 頁面切換轉場流暢，無白屏閃爍

**其他**
- [ ] 專案目錄中**未產生 README.md**（依需求 16）

---

## 17. 資料結構參考（供實作階段使用）

### 17.1 遊戲狀態物件（State Object）
```javascript
{
  piles: [3, 4, 5],              // 目前各堆剩餘數量
  currentTurn: 'player',         // 'player' | 'ai'
  rule: 'misere',                // 'normal' | 'misere'
  difficulty: 'normal',          // 'easy' | 'normal' | 'hard' | 'master'
  theme: 'cute',
  language: 'zh-TW',
  bgmVolume: 0.6,                // 0~1，使用者設定音量（未套用遊戲內10倍前）
  sfxVolume: 0.8,
  objectSkin: 'stone',           // 'stone' | 'candy' | 'star' | 'shell'
  savedAt: 1751932800000         // 存檔時間戳，用於版本/過期判斷
}
```

### 17.2 localStorage Key 命名建議
| Key | 內容 |
|---|---|
| `nimGame.settings` | 使用者偏好設定（語言、主題、音量、難度、規則、外觀） |
| `nimGame.saveData` | 進行中的遊戲存檔（供「繼續遊戲」使用） |
| `nimGame.version` | 存檔資料結構版本號，供未來相容性判斷 |

---

## 18. 檔案命名與版本管理注意事項

- 所有檔名一律使用**小寫 + 連字號（kebab-case）**，避免大小寫混用在不同作業系統（Windows/macOS/Linux）造成路徑相容性問題。
- 圖片／音檔統一放置於對應分類子資料夾，禁止散落於根目錄。
- **本階段僅產出規格書，不產出 README.md**；待遊戲完整實作完成後，另行於專案根目錄產生 `README.md`（說明安裝方式雖為零安裝、操作指南、致謝等），此為後續階段任務，不屬於本規格書範圍。

---

## 19. 附錄：需求逐條實現方式速查

| # | 實現方式摘要 |
|---|---|
| 1 | 純 HTML/CSS/JS + 傳統 `<script>` 標籤（禁用 ES Module），本地字型與音檔，零依賴 |
| 2 | `dvh/svh` 單位 + 三區塊版面骨架 + 5 組斷點媒體查詢 |
| 3 | CSS 變數字體階層（≥16px）+ 六組主題色票，含 `theme-cute.css` 可愛主題 |
| 4 | `css/{base,layout,themes,components,animations}` 與 `js/{core,ui,audio,i18n,utils}` 分層資料夾 |
| 5 | 主選單四按鈕：開始／繼續／說明／設定 |
| 6 | 4+ 首鋼琴 BGM、6 種清脆高音音效 |
| 7 | Web Audio `GainNode` × 10 + `DynamicsCompressorNode` 防爆音 |
| 8 | Footer 固定操作區 + bottom-sheet 數量選擇器，避免遮擋盤面 |
| 9 | `i18n-manager.js` + `zh-TW/en/ja` 三語系字典 |
| 10 | 分頁式說明頁，五大分類、圖文並茂、FAQ 手風琴 |
| 11 | WCAG AA 對比、狀態差異化設計、一致圖示風格 |
| 12 | 分段按鈕、大型拖曳滑桿、即時預覽、即時存檔 |
| 13 | 立體陰影／漸層堆疊物件、吉祥物多表情差分 |
| 14 | 主選單僅 4 按鈕，其餘設定收納於獨立設定頁 |
| 15 | `transform`/`opacity` 動畫、`requestAnimationFrame`、音效預載 |
| 16 | 本文件即規格書，非 README；README 待實作完成後另行產出 |
| 17 | 統一線條風格 icon set + 吉祥物插畫 |
| 18 | Nim-Sum（XOR）定理演算法 + 四級機率式難度控制 |

---

*本規格書為遊戲開發前置文件，實作階段請依此文件建立資料夾結構、元件與邏輯模組，逐步完成後另行產出遊戲本體與對應的 README.md。*
