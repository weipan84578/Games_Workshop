# Asteroids(小行星)遊戲 — 詳細規格書

> 版本:v1.0
> 文件性質:開發規格書(Software Requirement Specification)
> 平台:純前端網頁遊戲(桌機瀏覽器 + 行動裝置瀏覽器)

---

## 目錄

1. [專案概述](#1-專案概述)
2. [核心技術需求](#2-核心技術需求)
3. [專案資料夾結構](#3-專案資料夾結構)
4. [index.html 引入規範](#4-indexhtml-引入規範)
5. [畫面流程與主選單功能](#5-畫面流程與主選單功能)
6. [遊戲玩法規格](#6-遊戲玩法規格)
7. [UI / 字體 / 配色主題系統](#7-ui--字體--配色主題系統)
8. [RWD 響應式設計規格](#8-rwd-響應式設計規格)
9. [行動裝置操作介面(虛擬按鍵)](#9-行動裝置操作介面虛擬按鍵)
10. [音樂與音效系統](#10-音樂與音效系統)
11. [資料儲存與繼續遊戲](#11-資料儲存與繼續遊戲)
12. [效能與相容性要求](#12-效能與相容性要求)
13. [驗收標準清單](#13-驗收標準清單)

---

## 1. 專案概述

### 1.1 遊戲簡介

復刻經典街機遊戲《Asteroids》:玩家操控一艘太空船,在充滿小行星的太空中生存。
以旋轉、推進、射擊的方式擊碎小行星,大行星會分裂為中行星、中行星分裂為小行星。
隨關卡推進,行星數量與速度增加,並有 UFO 敵機出現。目標為取得最高分數。

### 1.2 設計目標

| 編號 | 目標 | 說明 |
|------|------|------|
| G1 | 零安裝、零建置 | 雙擊 `index.html` 即可遊玩,不需 npm / build / server |
| G2 | 全裝置順暢 | 桌機、平板、手機(直向/橫向)皆可順暢操作 |
| G3 | 清晰易讀 | 全站大字體,UI 明確,提供多種配色主題 |
| G4 | 結構清晰 | CSS / JS 依職責分資料夾,index 以引入方式組合 |
| G5 | 完整選單 | 開始遊戲、繼續遊戲、說明、設定 |
| G6 | 豐富音效 | 背景音樂 + 至少 14 種音效,跨畫面音樂不中斷 |
| G7 | 不擋畫面 | 行動裝置虛擬按鍵不得遮擋遊戲核心視野 |

---

## 2. 核心技術需求

### 2.1 技術選型(強制)

| 項目 | 規格 |
|------|------|
| 語言 | 原生 HTML5 + CSS3 + JavaScript(ES6+) |
| 渲染 | `<canvas>` 2D Context |
| 音訊 | **Web Audio API 程式合成音效**(優先)或內嵌 base64 音訊 |
| 模組化 | 使用 `<script>` 依序引入(**禁用 ES Module `import`**,因 `file://` 協定下會被 CORS 阻擋) |
| 儲存 | `localStorage`(設定、最高分、遊戲進度存檔) |
| 禁止 | 任何外部 CDN、框架(React/Vue)、打包工具(Webpack/Vite)、後端 API |

### 2.2 「直接點擊 index.html 可玩」之強制限制

由於遊戲必須在 `file://` 協定下運作,開發時 **必須遵守**:

1. **禁用 ES Module**:`<script type="module">` 與 `import/export` 在 `file://` 下會觸發 CORS 錯誤。
   → 改用傳統 `<script src>` 依賴順序引入,各檔案以「全域命名空間物件」溝通(例:`window.Game = {}`)。
2. **禁用 `fetch()` / `XMLHttpRequest` 讀取本地檔案**(JSON、關卡資料等)。
   → 所有資料(關卡參數、說明文字)直接寫成 JS 檔(`const LEVELS = [...]`)引入。
3. **音效不可依賴外部音檔請求**:
   → 首選 **Web Audio API 即時合成**(振盪器 + 噪音 + envelope),完全不需音檔。
   → 若需真實音檔,須以 **base64 Data URI** 內嵌於 JS 檔中。
4. 圖示一律使用 **inline SVG 或 Canvas 繪製**,不依賴外部圖檔。

---

## 3. 專案資料夾結構

```
asteroids/
├── index.html                  # 唯一入口,雙擊即玩
│
├── css/                        # ── 樣式分類 ──
│   ├── base/
│   │   ├── reset.css           # CSS Reset / 全域 box-sizing
│   │   ├── variables.css       # CSS 變數:字級、間距、各主題色票
│   │   └── typography.css      # 字體家族、大字級設定
│   ├── layout/
│   │   ├── screens.css         # 各畫面(選單/遊戲/說明/設定)版面
│   │   └── responsive.css      # 所有 @media 斷點規則
│   ├── components/
│   │   ├── buttons.css         # 選單按鈕、圖示按鈕
│   │   ├── menu.css            # 主選單樣式
│   │   ├── hud.css             # 遊戲中 HUD(分數/生命/關卡)
│   │   ├── modal.css           # 暫停視窗、Game Over 視窗
│   │   ├── settings.css        # 設定頁:滑桿、開關、主題選擇器
│   │   └── touch-controls.css  # 行動裝置虛擬按鍵
│   └── themes/
│       ├── theme-neon.css      # 主題 1:霓虹經典(預設)
│       ├── theme-retro.css     # 主題 2:復古琥珀
│       ├── theme-ocean.css     # 主題 3:深海藍
│       ├── theme-sunset.css    # 主題 4:夕陽暖橘
│       └── theme-mono.css      # 主題 5:高對比黑白
│
├── js/                         # ── 程式分類 ──
│   ├── core/
│   │   ├── constants.js        # 全域常數(畫布、物理、分數參數)
│   │   ├── utils.js            # 數學工具(向量、隨機、碰撞、夾角)
│   │   ├── gameLoop.js         # requestAnimationFrame 主迴圈(固定時步)
│   │   └── stateManager.js     # 畫面狀態機(MENU/PLAY/PAUSE/...)
│   ├── entities/
│   │   ├── ship.js             # 玩家太空船
│   │   ├── asteroid.js         # 小行星(大/中/小)
│   │   ├── bullet.js           # 子彈
│   │   ├── ufo.js              # UFO 敵機(大/小)
│   │   ├── particle.js         # 爆炸/推進粒子
│   │   └── powerup.js          # 道具(護盾/三向彈/加速)
│   ├── systems/
│   │   ├── physics.js          # 移動、慣性、螢幕環繞(wrap)
│   │   ├── collision.js        # 圓形碰撞檢測
│   │   ├── spawner.js          # 關卡生成、UFO/道具出現邏輯
│   │   ├── score.js            # 計分、加命、最高分
│   │   └── input.js            # 鍵盤 + 觸控輸入統一抽象層
│   ├── audio/
│   │   ├── audioEngine.js      # AudioContext 管理、音量總線、解鎖
│   │   ├── sfx.js              # 14+ 種合成音效定義
│   │   └── music.js            # 背景音樂產生器 + 跨畫面續播邏輯
│   ├── ui/
│   │   ├── menu.js             # 主選單行為(含「繼續遊戲」啟用判斷)
│   │   ├── hud.js              # HUD 更新
│   │   ├── settingsUI.js       # 設定頁互動(主題切換/音量/控制)
│   │   ├── helpUI.js           # 說明頁(操作教學、計分表)
│   │   └── touchControls.js    # 虛擬按鍵建立、佈局、事件
│   ├── data/
│   │   ├── levels.js           # 各關卡參數表
│   │   └── storage.js          # localStorage 封裝(存檔/設定/高分)
│   └── main.js                 # 進入點:初始化並啟動
│
└── docs/
    └── SPEC.md                 # 本規格書
```

> **規則**:每個 JS 檔對應單一職責;檔案間僅透過全域命名空間(如 `Game.Audio`、`Game.Input`)互相呼叫,避免隱性耦合。

---

## 4. index.html 引入規範

`index.html` 不得包含任何內嵌 CSS / 大段內嵌 JS,僅負責:

1. 語意化骨架(各畫面容器、canvas、虛擬按鍵容器)
2. 依序 `<link>` 所有 CSS
3. 依序 `<script>` 所有 JS(順序 = 依賴順序,`main.js` 最後)

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0,
                 maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Asteroids 小行星</title>

  <!-- base -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">
  <!-- layout -->
  <link rel="stylesheet" href="css/layout/screens.css">
  <!-- components -->
  <link rel="stylesheet" href="css/components/buttons.css">
  <link rel="stylesheet" href="css/components/menu.css">
  <link rel="stylesheet" href="css/components/hud.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/settings.css">
  <link rel="stylesheet" href="css/components/touch-controls.css">
  <!-- themes(全部載入,以 body[data-theme] 切換) -->
  <link rel="stylesheet" href="css/themes/theme-neon.css">
  <link rel="stylesheet" href="css/themes/theme-retro.css">
  <link rel="stylesheet" href="css/themes/theme-ocean.css">
  <link rel="stylesheet" href="css/themes/theme-sunset.css">
  <link rel="stylesheet" href="css/themes/theme-mono.css">
  <!-- responsive 最後載入確保覆寫權 -->
  <link rel="stylesheet" href="css/layout/responsive.css">
</head>
<body data-theme="neon">
  <!-- 畫面容器:#screen-menu / #screen-game / #screen-help / #screen-settings -->
  <!-- #game-canvas / #hud / #touch-controls / #modal-pause / #modal-gameover -->

  <!-- core -->
  <script src="js/core/constants.js"></script>
  <script src="js/core/utils.js"></script>
  <script src="js/data/storage.js"></script>
  <script src="js/data/levels.js"></script>
  <script src="js/core/stateManager.js"></script>
  <!-- audio -->
  <script src="js/audio/audioEngine.js"></script>
  <script src="js/audio/sfx.js"></script>
  <script src="js/audio/music.js"></script>
  <!-- systems -->
  <script src="js/systems/input.js"></script>
  <script src="js/systems/physics.js"></script>
  <script src="js/systems/collision.js"></script>
  <script src="js/systems/score.js"></script>
  <script src="js/systems/spawner.js"></script>
  <!-- entities -->
  <script src="js/entities/particle.js"></script>
  <script src="js/entities/bullet.js"></script>
  <script src="js/entities/asteroid.js"></script>
  <script src="js/entities/ufo.js"></script>
  <script src="js/entities/powerup.js"></script>
  <script src="js/entities/ship.js"></script>
  <!-- ui -->
  <script src="js/ui/hud.js"></script>
  <script src="js/ui/menu.js"></script>
  <script src="js/ui/helpUI.js"></script>
  <script src="js/ui/settingsUI.js"></script>
  <script src="js/ui/touchControls.js"></script>
  <!-- loop & entry -->
  <script src="js/core/gameLoop.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

---

## 5. 畫面流程與主選單功能

### 5.1 狀態機

```
BOOT → MENU ⇄ HELP
        │  ⇄ SETTINGS
        │
        ├─ 開始遊戲 ──→ PLAYING ⇄ PAUSED ──(放棄)──→ MENU
        │                  │
        └─ 繼續遊戲 ───────┘└──(死亡)──→ GAME_OVER → MENU
```

### 5.2 主選單(MENU)

| 按鈕 | 行為 | 啟用條件 |
|------|------|----------|
| **開始遊戲** | 清除舊存檔 → 由第 1 關全新開始 | 永遠啟用 |
| **繼續遊戲** | 讀取 `localStorage` 存檔(關卡/分數/生命)續玩 | 僅在存在有效存檔時啟用;無存檔時呈現半透明禁用態並顯示「無存檔」 |
| **說明** | 進入 HELP 畫面 | 永遠啟用 |
| **設定** | 進入 SETTINGS 畫面 | 永遠啟用 |

附加顯示:遊戲標題(大字 Logo)、歷史最高分、選單背景需有緩慢漂浮的小行星動畫。

### 5.3 說明畫面(HELP)

必含三個分頁(Tab 或區塊):

1. **操作方式**:桌機鍵盤表 + 行動裝置虛擬按鍵圖解(依目前裝置自動優先顯示對應者)。
2. **計分規則**:大行星 20 分、中行星 50 分、小行星 100 分、大 UFO 200 分、小 UFO 1000 分;每 10,000 分加一條命。
3. **道具說明**:護盾、三向彈、極速推進之圖示與效果。

### 5.4 設定畫面(SETTINGS)

| 設定項 | 形式 | 範圍/選項 | 預設 |
|--------|------|-----------|------|
| 配色主題 | 5 個可點選的色票預覽卡 | neon / retro / ocean / sunset / mono | neon |
| 音樂音量 | 滑桿 | 0–100 | 60 |
| 音效音量 | 滑桿 | 0–100 | 80 |
| 靜音總開關 | Toggle | on/off | off |
| 畫面震動(爆炸時) | Toggle | on/off | on |
| 虛擬按鍵位置 | 選項 | 左下推進+右下射擊 / 鏡像對調 | 預設 |
| 虛擬按鍵透明度 | 滑桿 | 20%–80% | 45% |
| 字體大小 | 選項 | 大 / 特大 | 大 |

所有設定即時生效並寫入 `localStorage`,主題切換需有即時預覽。

### 5.5 暫停(PAUSED)

- 觸發:桌機 `Esc`/`P`;行動裝置 HUD 右上角暫停鈕;**頁面失焦(blur)自動暫停**。
- 暫停選單:繼續、重新開始、設定(可中途調音量/主題)、回主選單(回主選單前自動寫入存檔)。

---

## 6. 遊戲玩法規格

### 6.1 太空船

| 屬性 | 數值 |
|------|------|
| 旋轉速度 | 220°/秒 |
| 推進加速度 | 280 px/s² |
| 最大速度 | 420 px/s |
| 摩擦(每秒速度保留) | 0.985^(60·dt) |
| 子彈速度 / 壽命 | 600 px/s / 1.1 秒 |
| 射速上限 | 4 發/秒;畫面同時最多 6 發 |
| 初始生命 | 3 |
| 重生 | 死亡後 1.5 秒於畫面中心重生,3 秒無敵(閃爍) |

### 6.2 小行星

| 尺寸 | 半徑(基準 800px 畫布) | 速度 | 分裂 | 分數 |
|------|------|------|------|------|
| 大 | 48 px | 40–80 px/s | → 2 顆中 | 20 |
| 中 | 26 px | 70–130 px/s | → 2 顆小 | 50 |
| 小 | 14 px | 110–190 px/s | 消滅 | 100 |

- 外型:每顆以 8–12 個隨機抖動頂點之多邊形繪製,並緩慢自轉。
- 生成位置必須距離玩家 ≥ 150 px。

### 6.3 UFO

- 大 UFO:第 2 關起隨機出現,亂射;200 分。
- 小 UFO:第 4 關起出現,瞄準玩家(誤差隨關卡縮小);1000 分。
- 出現間隔 12–25 秒隨機,同時最多 1 台。

### 6.4 道具(每關隨機掉落 0–2 個,漂浮 10 秒)

| 道具 | 效果 | 持續 |
|------|------|------|
| 護盾 | 抵擋 1 次碰撞 | 直到觸發 |
| 三向彈 | 一次射出 3 發扇形 | 10 秒 |
| 極速 | 加速度 +60% | 8 秒 |

### 6.5 關卡與難度(js/data/levels.js)

- 第 N 關初始大行星數 = `min(3 + N, 11)`;行星基礎速度每關 +6%。
- 清空所有行星與 UFO 即過關 → 顯示 2 秒「LEVEL N+1」橫幅(含過關音效)→ 下一關。
- 所有物件(船、行星、子彈、UFO)皆做螢幕環繞(從邊緣穿出由對側進入)。

### 6.6 桌機鍵盤操作

| 鍵 | 動作 |
|----|------|
| ← / A | 左轉 |
| → / D | 右轉 |
| ↑ / W | 推進 |
| Space / J | 射擊 |
| Shift / K | 超空間跳躍(隨機傳送,15% 自爆風險,冷卻 5 秒) |
| Esc / P | 暫停 |
| M | 快速靜音 |

---

## 7. UI / 字體 / 配色主題系統

### 7.1 大字體規範(css/base/typography.css)

全站採用 `clamp()` 流式字級,**下限即已偏大**,確保任何裝置可讀:

| Token | 用途 | 規格 |
|-------|------|------|
| `--fs-title` | 遊戲標題 | `clamp(44px, 9vw, 88px)` |
| `--fs-menu` | 選單按鈕 | `clamp(26px, 5vw, 40px)` |
| `--fs-hud` | 分數/關卡 | `clamp(22px, 4vw, 34px)` |
| `--fs-body` | 說明內文 | `clamp(19px, 3vw, 26px)` |
| `--fs-label` | 設定標籤 | `clamp(18px, 2.8vw, 24px)` |

- 設定頁「特大」模式:所有字級再 ×1.2。
- 字體:`"Orbitron 風格之系統替代", "Noto Sans TC", system-ui, sans-serif`(不可外連 Google Fonts;以 system-ui 堆疊為主,標題可用 letter-spacing + text-shadow 營造科幻感)。
- 行高 ≥ 1.5;按鈕文字與背景對比度 ≥ WCAG AA(4.5:1)。

### 7.2 主題色票(css/base/variables.css + themes/*.css)

每主題定義同一組 CSS 變數,以 `body[data-theme="…"]` 切換:

| 變數 | 用途 |
|------|------|
| `--c-bg` | 太空背景 |
| `--c-fg` | 主要文字 |
| `--c-accent` | 按鈕/船體/重點 |
| `--c-accent-2` | 次要重點(UFO、道具) |
| `--c-danger` | 警告(低生命、Game Over) |
| `--c-glow` | 霓虹光暈 text-shadow / box-shadow 色 |

| 主題 | bg | fg | accent | accent-2 | danger |
|------|----|----|--------|----------|--------|
| neon(預設) | #05060f | #eaf6ff | #00e5ff | #ff2ec4 | #ff3b3b |
| retro | #100c00 | #ffe8b0 | #ffb000 | #7CFC00 | #ff5533 |
| ocean | #021420 | #d9f4ff | #38bdf8 | #34d399 | #fb7185 |
| sunset | #1b0a14 | #ffe9d6 | #ff7a45 | #ffd166 | #ef4444 |
| mono(高對比) | #000000 | #ffffff | #ffffff | #bbbbbb | #ffffff |

Canvas 內繪圖也必須讀取 CSS 變數(`getComputedStyle`)取色,切換主題時遊戲畫面立即同步換色。

---

## 8. RWD 響應式設計規格

### 8.1 斷點(css/layout/responsive.css)

| 斷點 | 範圍 | 佈局 |
|------|------|------|
| Mobile 直向 | ≤ 600px | 選單單欄;Canvas 滿版;虛擬按鍵顯示 |
| Mobile 橫向 | 高度 ≤ 480px | HUD 壓縮為單列;按鍵縮小貼角 |
| Tablet | 601–1024px | 選單置中卡片;虛擬按鍵顯示(可關) |
| Desktop | ≥ 1025px | Canvas 置中最大化;虛擬按鍵隱藏 |

### 8.2 Canvas 縮放策略

- 內部解析度固定邏輯座標(如 960×640),以 `devicePixelRatio` 提升實際像素確保銳利。
- CSS 尺寸 = 視窗可用區最大化、維持比例(letterbox),`resize`/`orientationchange` 即時重算。
- 所有遊戲物理以邏輯座標運算,不因螢幕尺寸改變難度。
- 觸控座標需經 `getBoundingClientRect()` 換算回邏輯座標。

### 8.3 行動端必要處理

- `touch-action: none`(遊戲區)防止捲動/雙擊縮放。
- `env(safe-area-inset-*)` 處理 iPhone 瀏海與底部手勢條。
- 直向時於畫面上方顯示「建議橫向遊玩」提示(可關閉,不強制)。
- 禁止長按選取/右鍵選單(`user-select: none`、`contextmenu` preventDefault)。

---

## 9. 行動裝置操作介面(虛擬按鍵)

### 9.1 「不擋畫面」核心原則

1. **僅佔四角與邊緣**:所有按鍵錨定於左下/右下角落,**畫面中央 70% 區域永遠淨空**。
2. **半透明**:預設透明度 45%(設定可調 20–80%),按下時短暫提升至 90% 給予回饋。
3. **遊戲區不縮水**:按鍵以 `position: fixed` 疊加於 Canvas 之上,不佔版面、不壓縮畫布。
4. **行星生成避讓**:Spawner 不在按鍵覆蓋區正下方 80px 內生成行星(降低被 UI 遮蔽的誤判)。
5. **HUD 靠上**:分數/生命/關卡固定於頂端 safe-area 之下,與底部按鍵分離。

### 9.2 按鍵配置(預設;設定可鏡像)

```
┌─────────────────────────────────────┐
│ 分數 00000   ❤❤❤   LV 3      [⏸] │ ← HUD(頂端)
│                                     │
│                                     │
│            (遊戲畫面淨空區)          │
│                                     │
│                                     │
│  ◄ ►                       🔥  ●   │
│ 旋轉鍵(左下)         推進  射擊(右下)│
└─────────────────────────────────────┘
```

| 控制 | 形式 | 規格 |
|------|------|------|
| 旋轉 | 左下「◄ ►」雙弧形鍵 | 各鍵觸控目標 ≥ 64×64px |
| 推進 | 右下外側圓鍵 🔥 | 直徑 ≥ 72px,長按持續推進 |
| 射擊 | 右下內側圓鍵 ● | 直徑 ≥ 72px,長按連射(受射速上限) |
| 超空間 | 射擊鍵上方小鍵 | 直徑 ≥ 56px,含冷卻環顯示 |
| 暫停 | HUD 右上角 | ≥ 48×48px |

### 9.3 觸控技術要求

- 使用 Pointer Events,**必須支援多點同時觸控**(左手轉向 + 右手推進射擊)。
- `touchstart` 即響應(不可等 `click` 的 300ms 延遲)。
- 手指滑出按鍵範圍視為放開;每鍵獨立追蹤 pointerId。
- 桌機(具鍵盤、無觸控)自動隱藏虛擬按鍵;混合裝置(觸控筆電)首次觸控即顯示。

---

## 10. 音樂與音效系統

### 10.1 架構(js/audio/)

```
AudioContext
 ├── masterGain ──┬── musicGain ── 音樂節點(振盪器序列)
 │                └── sfxGain ──── 各音效節點
 └── 由設定頁滑桿即時控制三個 Gain
```

- **自動播放政策**:`AudioContext` 在使用者**首次點擊/觸碰**(任何選單互動)時 `resume()` 解鎖;解鎖前靜默排隊,不報錯。
- 頁面 `visibilitychange` 隱藏時 `suspend()`,返回時 `resume()`。

### 10.2 音效清單(共 16 種,全部 Web Audio 合成,零音檔)

| # | 音效 | 觸發時機 | 合成概要 |
|---|------|----------|----------|
| 1 | 射擊 | 發射子彈 | 方波 880→220Hz 快速下滑 0.08s |
| 2 | 推進 | 推進鍵按住(循環) | 低通濾波白噪音,持續環播 |
| 3 | 大行星爆炸 | 大行星被擊毀 | 低頻噪音爆 + 60Hz 正弦衰減 0.5s |
| 4 | 中行星爆炸 | 中行星被擊毀 | 中頻噪音爆 0.35s |
| 5 | 小行星爆炸 | 小行星被擊毀 | 高頻短噪音 0.2s |
| 6 | 玩家爆炸 | 太空船被毀 | 長噪音爆 + 下滑鋸齒 0.9s |
| 7 | UFO 出現警報 | UFO 進場(循環) | 雙音交替警笛(550/440Hz) |
| 8 | UFO 射擊 | UFO 開火 | 鋸齒波 660→330Hz 0.1s |
| 9 | UFO 爆炸 | UFO 被擊毀 | 噪音 + 金屬感方波和聲 0.6s |
| 10 | 道具拾取 | 吃到道具 | 上行三連琶音(C–E–G)0.3s |
| 11 | 護盾抵擋 | 護盾擋下碰撞 | 金屬「鏘」:高頻方波 ring 0.25s |
| 12 | 超空間跳躍 | 傳送 | 頻率掃升 200→2000Hz 0.4s |
| 13 | 加一條命 | 每 10,000 分 | 明亮上行四音階 fanfare 0.6s |
| 14 | 過關 | 關卡清空 | 勝利三和弦琶音 0.8s |
| 15 | Game Over | 遊戲結束 | 下行小調音列 1.2s |
| 16 | UI 點擊/懸停 | 按鈕互動(點擊+hover 兩變體) | 短促 tick(2ms 方波)/柔和 blip |
| 17 | 心跳節奏 | 經典「咚…咚…」背景脈動,行星越少越快 | 雙低音交替(55/49Hz) |

> 同類音效需做 ±5% 隨機 pitch 變化,避免重複感;同時發聲上限 12 軌,超過時丟棄最舊。

### 10.3 背景音樂(js/audio/music.js)

| 曲目 | 使用畫面 | 風格 |
|------|----------|------|
| `bgmMenu` | 主選單 / 說明 / 設定 | 緩慢太空氛圍 pad(2 個 detune 鋸齒 + LFO) |
| `bgmGame` | 遊戲中 | 心跳脈動 + 稀疏琶音,張力隨關卡升高(BPM +2/關) |
| `bgmGameOver` | 結算畫面 | 低沉單音 drone |

**跨畫面持續播放規則(強制)**:

1. 同曲目畫面之間切換(選單 ⇄ 說明 ⇄ 設定)**音樂不得中斷、不得重頭播放**——音樂生命週期由 `music.js` 全域管理,與畫面 DOM 無關。
2. 不同曲目切換(選單 → 遊戲)採 **0.8 秒 crossfade**(舊曲 gain 淡出、新曲淡入),禁止爆音與瞬間靜默。
3. 暫停遊戲:`bgmGame` **不停止**,改為音量降至 30% + 低通濾波(悶音效果);恢復時還原。
4. 切換主題、調整音量時音樂不得重啟。
5. 靜音開關僅將 masterGain 設 0,節奏仍在背景推進,取消靜音時無縫銜接。

---

## 11. 資料儲存與繼續遊戲

`localStorage` key 一律加前綴 `asteroids.`:

| Key | 內容 | 寫入時機 |
|-----|------|----------|
| `asteroids.settings` | 主題、各音量、按鍵配置、字級…(JSON) | 設定變更即時 |
| `asteroids.highscore` | 最高分(number) | 破紀錄時 |
| `asteroids.save` | `{level, score, lives, timestamp}` | 每次過關自動存檔;暫停選「回主選單」時存檔 |

- 「繼續遊戲」從**存檔關卡的開頭**重新開始該關(不還原行星即時位置,簡化且公平)。
- Game Over 或按「開始遊戲」時刪除 `asteroids.save`。
- `localStorage` 不可用(隱私模式)時自動降級為記憶體儲存,功能不報錯。

---

## 12. 效能與相容性要求

| 項目 | 要求 |
|------|------|
| 幀率 | 桌機 60 FPS;中階手機 ≥ 50 FPS |
| 遊戲迴圈 | 固定時步(fixed timestep)更新 + 插值渲染,`dt` 上限 50ms 防背景返回暴衝 |
| 物件管理 | 子彈/粒子使用物件池(object pool),禁止每幀 new |
| 粒子上限 | 同畫面 ≤ 300,超出丟棄最舊 |
| 相容瀏覽器 | Chrome / Edge / Firefox / Safari(含 iOS Safari)近兩年版本 |
| 無障礙 | 按鈕含 `aria-label`;mono 主題滿足高對比需求;不依賴純色彩傳達資訊(生命用圖示+數字) |
| 錯誤防護 | 任一音效初始化失敗不得阻斷遊戲(try/catch 包裹音訊層) |

---

## 13. 驗收標準清單

- [ ] **A1** 解壓縮後雙擊 `index.html`(`file://`),遊戲完整可玩,Console 無 CORS / 載入錯誤。
- [ ] **A2** 全程無任何外部網路請求(DevTools Network 驗證)。
- [ ] **A3** 手機直向、橫向、平板、桌機四種環境皆可順暢操作與閱讀。
- [ ] **A4** 所有 UI 文字字級不低於規範下限;5 種主題皆可即時切換且 Canvas 同步換色。
- [ ] **A5** CSS / JS 完全依第 3 節結構分資料夾;`index.html` 無內嵌樣式與遊戲邏輯。
- [ ] **A6** 主選單具備開始遊戲、繼續遊戲(無存檔時禁用)、說明、設定,功能皆正確。
- [ ] **A7** 實裝 ≥ 16 種音效與 3 首背景音樂;選單⇄說明⇄設定切換時音樂連續不重播;選單→遊戲為 crossfade。
- [ ] **A8** 行動裝置虛擬按鍵僅佔角落、半透明、可調透明度與鏡像;畫面中央 70% 區域無任何 UI 遮擋;支援多點觸控。
- [ ] **A9** 暫停、自動失焦暫停、存檔/續玩、最高分記錄皆正常。
- [ ] **A10** 中階手機實測 ≥ 50 FPS,無明顯掉幀與音訊爆音。

---

*規格書完*
