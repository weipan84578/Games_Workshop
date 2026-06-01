# 🧩 Crossword 填字遊戲 — 規格書

> **版本**：v1.0.0  
> **最後更新**：2026-06-01  
> **技術棧**：純前端 HTML5 / CSS3 / Vanilla JavaScript（無需 build 或 server）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [資料夾結構](#2-資料夾結構)
3. [技術規範](#3-技術規範)
4. [畫面設計規範](#4-畫面設計規範)
5. [功能規格](#5-功能規格)
6. [音樂與音效系統](#6-音樂與音效系統)
7. [RWD 響應式設計](#7-rwd-響應式設計)
8. [設定系統](#8-設定系統)
9. [存檔與繼續遊戲](#9-存檔與繼續遊戲)
10. [遊戲核心邏輯](#10-遊戲核心邏輯)
11. [資料格式](#11-資料格式)
12. [開發里程碑](#12-開發里程碑)

---

## 1. 專案概述

### 1.1 目標

開發一款可直接在瀏覽器開啟、無需任何後端或建置流程的純前端 Crossword 填字遊戲，支援行動裝置與桌機，提供豐富的音效、動畫與多彩配色主題。

### 1.2 核心原則

| 原則 | 說明 |
|------|------|
| **零依賴啟動** | 雙擊 `index.html` 即可遊玩，無需 npm、build、server |
| **響應式優先** | Mobile-first，從 320px 到 4K 皆可正常操作 |
| **大字體易讀** | 全站最小字體 16px，題目文字 20px 以上 |
| **多彩主題** | 提供 6 套以上配色主題，可於設定中切換 |
| **沉浸式聲音** | 背景音樂 + 多種音效，畫面切換時音樂無縫延續 |

---

## 2. 資料夾結構

```
crossword/
│
├── index.html                  # 主入口，所有 CSS/JS 以 <link>/<script> 引入
│
├── assets/
│   ├── audio/
│   │   ├── bgm/                # 背景音樂（.mp3 / .ogg 雙格式備援）
│   │   │   ├── main_theme.mp3
│   │   │   ├── main_theme.ogg
│   │   │   ├── gameplay.mp3
│   │   │   ├── gameplay.ogg
│   │   │   ├── victory.mp3
│   │   │   ├── victory.ogg
│   │   │   └── relaxed.mp3
│   │   └── sfx/                # 音效
│   │       ├── click.mp3
│   │       ├── type_correct.mp3
│   │       ├── type_wrong.mp3
│   │       ├── word_complete.mp3
│   │       ├── puzzle_clear.mp3
│   │       ├── hint_use.mp3
│   │       ├── cell_select.mp3
│   │       ├── direction_toggle.mp3
│   │       ├── menu_open.mp3
│   │       ├── menu_close.mp3
│   │       └── countdown.mp3
│   │
│   ├── fonts/                  # 自訂字型（本地或 Google Fonts CDN）
│   │   └── README.md           # 說明字型授權來源
│   │
│   └── images/
│       ├── icons/              # SVG icon 集合
│       ├── backgrounds/        # 主題背景圖
│       └── logo.svg
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS reset / normalize
│   │   ├── variables.css       # CSS 自定義變數（色票、字型、間距）
│   │   └── typography.css      # 全域字體設定
│   │
│   ├── themes/
│   │   ├── theme-ocean.css     # 海洋藍主題
│   │   ├── theme-forest.css    # 森林綠主題
│   │   ├── theme-sunset.css    # 夕陽橘主題
│   │   ├── theme-candy.css     # 糖果粉主題
│   │   ├── theme-midnight.css  # 午夜深色主題
│   │   └── theme-gold.css      # 復古金主題
│   │
│   ├── layout/
│   │   ├── grid.css            # 填字格版面
│   │   └── responsive.css      # RWD 斷點與 Media Query
│   │
│   ├── components/
│   │   ├── buttons.css
│   │   ├── modal.css
│   │   ├── clue-panel.css      # 提示列表面板
│   │   ├── keyboard.css        # 虛擬鍵盤（手機用）
│   │   ├── timer.css
│   │   ├── progress.css        # 進度條
│   │   └── notification.css    # Toast 提示
│   │
│   └── screens/
│       ├── main-menu.css       # 主選單畫面
│       ├── game.css            # 遊戲畫面
│       ├── settings.css        # 設定畫面
│       ├── instructions.css    # 說明畫面
│       └── victory.css         # 勝利畫面
│
├── js/
│   ├── core/
│   │   ├── app.js              # 應用程式入口、畫面路由管理
│   │   ├── state.js            # 全域狀態管理（單例模式）
│   │   └── eventBus.js         # 自定義事件匯流排
│   │
│   ├── engine/
│   │   ├── puzzle.js           # 填字謎題資料處理
│   │   ├── grid.js             # 格子渲染與互動邏輯
│   │   ├── solver.js           # 答案驗證
│   │   └── generator.js        # （選用）謎題自動生成
│   │
│   ├── audio/
│   │   ├── audioManager.js     # 音效引擎核心（音量控制、淡入淡出）
│   │   ├── bgmController.js    # 背景音樂切換與持續播放控制
│   │   └── sfxPool.js          # 音效物件池（防止重疊截斷）
│   │
│   ├── ui/
│   │   ├── screenManager.js    # 畫面切換動畫管理
│   │   ├── keyboard.js         # 虛擬鍵盤元件
│   │   ├── cluePanel.js        # 提示面板
│   │   ├── timer.js            # 計時器元件
│   │   ├── modal.js            # 彈窗元件
│   │   └── notification.js     # Toast 通知
│   │
│   ├── data/
│   │   ├── puzzles/
│   │   │   ├── easy.js         # 簡單難度謎題資料
│   │   │   ├── medium.js       # 中等難度謎題資料
│   │   │   └── hard.js         # 困難難度謎題資料
│   │   └── themes.js           # 主題色票配置資料
│   │
│   └── utils/
│       ├── storage.js          # localStorage 封裝（存檔/讀檔）
│       ├── device.js           # 裝置偵測（touch / pointer）
│       └── helpers.js          # 通用工具函式
│
└── data/
    └── puzzles.json            # 謎題 JSON 資料庫（備用靜態載入）
```

---

## 3. 技術規範

### 3.1 啟動方式

```
crossword/
└── index.html  ← 直接雙擊開啟，無需 npm / build / server
```

- 所有資源使用**相對路徑**引用
- 不使用任何需要 Node.js 或 bundler 的框架
- 音效使用 Web Audio API + `<audio>` 元素雙重降級保護
- 字體優先使用系統字體堆疊，進階主題可用 Google Fonts CDN（離線降級）

### 3.2 index.html 引入結構

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="ocean">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Crossword 填字遊戲</title>

  <!-- Base Styles -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">

  <!-- Themes -->
  <link rel="stylesheet" href="css/themes/theme-ocean.css">
  <link rel="stylesheet" href="css/themes/theme-forest.css">
  <!-- ...其他主題... -->

  <!-- Layout -->
  <link rel="stylesheet" href="css/layout/grid.css">
  <link rel="stylesheet" href="css/layout/responsive.css">

  <!-- Components -->
  <link rel="stylesheet" href="css/components/buttons.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/clue-panel.css">
  <link rel="stylesheet" href="css/components/keyboard.css">
  <link rel="stylesheet" href="css/components/timer.css">
  <link rel="stylesheet" href="css/components/notification.css">

  <!-- Screens -->
  <link rel="stylesheet" href="css/screens/main-menu.css">
  <link rel="stylesheet" href="css/screens/game.css">
  <link rel="stylesheet" href="css/screens/settings.css">
  <link rel="stylesheet" href="css/screens/instructions.css">
  <link rel="stylesheet" href="css/screens/victory.css">
</head>
<body>
  <!-- 畫面容器 -->
  <div id="app">
    <div id="screen-main-menu" class="screen active"></div>
    <div id="screen-game" class="screen"></div>
    <div id="screen-settings" class="screen"></div>
    <div id="screen-instructions" class="screen"></div>
    <div id="screen-victory" class="screen"></div>
  </div>

  <!-- 共用元件 -->
  <div id="modal-container"></div>
  <div id="notification-container"></div>

  <!-- Core Scripts（模組載入順序） -->
  <script src="js/utils/helpers.js"></script>
  <script src="js/utils/storage.js"></script>
  <script src="js/utils/device.js"></script>
  <script src="js/core/eventBus.js"></script>
  <script src="js/core/state.js"></script>
  <script src="js/audio/audioManager.js"></script>
  <script src="js/audio/bgmController.js"></script>
  <script src="js/audio/sfxPool.js"></script>
  <script src="js/engine/puzzle.js"></script>
  <script src="js/engine/grid.js"></script>
  <script src="js/engine/solver.js"></script>
  <script src="js/ui/screenManager.js"></script>
  <script src="js/ui/keyboard.js"></script>
  <script src="js/ui/cluePanel.js"></script>
  <script src="js/ui/timer.js"></script>
  <script src="js/ui/modal.js"></script>
  <script src="js/ui/notification.js"></script>
  <script src="js/data/themes.js"></script>
  <script src="js/data/puzzles/easy.js"></script>
  <script src="js/data/puzzles/medium.js"></script>
  <script src="js/data/puzzles/hard.js"></script>

  <!-- App Entry Point（最後載入） -->
  <script src="js/core/app.js"></script>
</body>
</html>
```

---

## 4. 畫面設計規範

### 4.1 字體規範

| 元素 | 最小字體大小 | 備註 |
|------|------------|------|
| 全域 body | 18px | |
| 按鈕文字 | 20px | `font-weight: 700` |
| 格子內填入字母 | 22px ~ 28px（依格數縮放） | |
| 題目編號 | 11px | 格子左上角 |
| 提示文字 | 20px | |
| 標題 H1 | 48px | |
| 彈窗標題 | 28px | |
| 說明內文 | 18px | |

### 4.2 配色主題（6 套）

每套主題需定義以下 CSS 變數：

```css
:root {
  --color-bg-primary:       /* 主背景 */
  --color-bg-secondary:     /* 次背景（卡片/面板） */
  --color-bg-cell:          /* 格子預設背景 */
  --color-bg-cell-active:   /* 選中格子 */
  --color-bg-cell-word:     /* 選中單字同行高亮 */
  --color-bg-cell-correct:  /* 答對格子 */
  --color-bg-cell-wrong:    /* 答錯格子 */
  --color-bg-cell-hint:     /* 提示揭示格子 */
  --color-text-primary:     /* 主要文字 */
  --color-text-secondary:   /* 次要文字 */
  --color-text-cell:        /* 格子文字 */
  --color-accent:           /* 強調色（按鈕、選取） */
  --color-accent-hover:     /* 強調色 Hover */
  --color-border:           /* 格線顏色 */
  --color-shadow:           /* 陰影 */
}
```

#### 主題列表

| 主題 ID | 名稱 | 主色調 | 風格 |
|---------|------|--------|------|
| `ocean` | 🌊 海洋藍 | `#0077B6` | 清爽、明亮 |
| `forest` | 🌿 森林綠 | `#2D6A4F` | 自然、沉穩 |
| `sunset` | 🌅 夕陽橘 | `#F4845F` | 溫暖、活潑 |
| `candy` | 🍬 糖果粉 | `#FF6B9D` | 可愛、輕快 |
| `midnight` | 🌙 午夜黑 | `#1A1A2E` | 深色、專注 |
| `gold` | ✨ 復古金 | `#C9A84C` | 典雅、懷舊 |

---

## 5. 功能規格

### 5.1 主選單畫面

```
┌─────────────────────────────────────┐
│          🧩 CROSSWORD               │
│           填 字 遊 戲               │
│                                     │
│   ┌──────────────────────────┐      │
│   │     🎮  開始遊戲          │      │
│   └──────────────────────────┘      │
│   ┌──────────────────────────┐      │
│   │     ▶️  繼續遊戲          │      │  ← 無存檔時 灰色禁用
│   └──────────────────────────┘      │
│   ┌──────────────────────────┐      │
│   │     📖  遊戲說明          │      │
│   └──────────────────────────┘      │
│   ┌──────────────────────────┐      │
│   │     ⚙️  設定              │      │
│   └──────────────────────────┘      │
│                          v1.0.0     │
└─────────────────────────────────────┘
```

**互動行為：**
- 進入主選單播放 `main_theme` BGM
- 每個按鈕 hover / tap 時播放 `click` 音效
- 無存檔時「繼續遊戲」按鈕顯示為半透明並 disabled
- 點擊「開始遊戲」→ 進入難度選擇彈窗

### 5.2 難度選擇彈窗

| 難度 | 格數 | 單字數量 | 提示數 |
|------|------|---------|--------|
| 簡單 | 10×10 | 12 ～ 15 | 5 |
| 中等 | 13×13 | 18 ～ 22 | 3 |
| 困難 | 15×15 | 25 ～ 30 | 1 |

### 5.3 遊戲畫面

```
┌────────────────────────────────────────────┐
│  [←返回]   ⏱️ 00:00   💡 提示x3   [✓驗證] │  ← 頂部工具列
├────────────────────────────────────────────┤
│                                            │
│   ┌──────────────┐   ┌──────────────────┐  │
│   │              │   │  橫向提示         │  │
│   │  填字格盤     │   │  ①  ...          │  │
│   │  (可縮放)     │   │  ②  ...          │  │
│   │              │   │──────────────────│  │
│   └──────────────┘   │  縱向提示         │  │
│                      │  ①  ...          │  │
│                      └──────────────────┘  │
├────────────────────────────────────────────┤
│  [虛擬鍵盤 — 僅手機顯示]                   │  ← 底部（touch 裝置）
└────────────────────────────────────────────┘
```

**格子狀態：**

| 狀態 | 視覺效果 |
|------|---------|
| 預設空白 | `--color-bg-cell` |
| 選中（單格） | `--color-bg-cell-active` + 外框光暈動畫 |
| 選中（同單字） | `--color-bg-cell-word` 淡色高亮 |
| 填入字母 | 字母居中，字體加粗 |
| 驗證正確 | `--color-bg-cell-correct` + ✓ 動畫 |
| 驗證錯誤 | `--color-bg-cell-wrong` + 抖動動畫 |
| 黑格（barrier） | 純黑，不可點擊 |
| 提示揭示 | `--color-bg-cell-hint` + 淡入動畫 |

**鍵盤操作：**

| 操作 | 行為 |
|------|------|
| 字母鍵 | 填入當前格，自動移至下一格 |
| Backspace | 清除當前格，退回上一格 |
| Enter | 切換橫向 / 縱向方向 |
| 方向鍵 ↑↓←→ | 移動選取格 |
| Tab | 跳至下一個單字起始格 |
| Shift+Tab | 跳至上一個單字起始格 |

### 5.4 說明畫面

分頁式說明，含：
1. **基本玩法** — 圖解填字規則
2. **操作方式** — 鍵盤 & 觸控操作說明
3. **功能介紹** — 提示、驗證、計時器
4. **主題切換** — 配色主題說明

### 5.5 設定畫面

| 設定項目 | 類型 | 選項 |
|---------|------|------|
| 配色主題 | 單選（色塊預覽） | 6 套主題 |
| 背景音樂音量 | 滑桿 0 ～ 100 | 預設 70 |
| 音效音量 | 滑桿 0 ～ 100 | 預設 80 |
| 顯示計時器 | 開關 | 預設 ON |
| 顯示錯誤提示 | 開關 | 預設 ON（填錯即標紅） |
| 字體大小 | 三段切換 | 標準 / 大 / 特大 |
| 語言 | 單選 | 繁中 / English |

---

## 6. 音樂與音效系統

### 6.1 背景音樂（BGM）列表

| 檔案 | 使用場景 | 特性 |
|------|---------|------|
| `main_theme` | 主選單、說明、設定 | 輕快，可無限循環 |
| `gameplay` | 遊戲中（預設） | 集中感，節奏穩定 |
| `relaxed` | 遊戲中（另一首可切換） | 輕柔舒緩 |
| `victory` | 勝利畫面 | 歡快，播放一次後回到 main_theme |

### 6.2 BGM 切換規則

```
主選單 ────────────────────────────── main_theme（循環）
   │
   ├── 點擊「說明」  ──────────────── main_theme（繼續，不中斷）
   ├── 點擊「設定」  ──────────────── main_theme（繼續，不中斷）
   └── 點擊「開始遊戲」────────────── 淡出 main_theme → 淡入 gameplay
         │
         ├── 遊戲中切換為 relaxed ─── 淡出 gameplay → 淡入 relaxed
         └── 完成謎題 ───────────────淡出 gameplay → 播放 victory
                                          → victory 結束 → 淡入 main_theme
```

**重點規則：**
- 切換至子畫面（說明/設定）時 BGM **不中斷**，繼續播放
- 所有 BGM 切換使用 **淡入淡出（crossfade，約 1 秒）**，避免突兀切換
- `bgmController.js` 管理所有 BGM 狀態，其他模組透過 `eventBus` 觸發切換

### 6.3 音效（SFX）列表

| 音效檔 | 觸發時機 |
|--------|---------|
| `click` | 所有按鈕點擊 / tap |
| `cell_select` | 點擊格子選取 |
| `direction_toggle` | 切換橫向 / 縱向（Enter 鍵） |
| `type_correct` | 填入字母（即時驗證模式：正確） |
| `type_wrong` | 填入字母（即時驗證模式：錯誤） |
| `word_complete` | 完成一個完整單字 |
| `puzzle_clear` | 整個謎題完成 |
| `hint_use` | 使用提示功能 |
| `menu_open` | 開啟任何彈窗 |
| `menu_close` | 關閉任何彈窗 |
| `countdown` | 計時器最後 10 秒倒數（若有時限模式） |

### 6.4 音效引擎實作要點（`audioManager.js`）

```javascript
// 核心介面（偽代碼）
const AudioManager = {
  // 初始化 Web Audio API Context（需用戶互動後呼叫）
  init(),

  // BGM 控制
  playBGM(trackName, options = { fadeIn: true, loop: true }),
  stopBGM(options = { fadeOut: true }),
  crossfadeBGM(newTrackName, duration = 1000),
  setBGMVolume(0~1),

  // SFX 控制（音效池，防止同一音效重疊截斷）
  playSFX(sfxName),
  setSFXVolume(0~1),

  // 全域靜音
  mute(),
  unmute(),
};
```

**音效池（`sfxPool.js`）：** 每個常用音效預先建立 3 ～ 5 個 `Audio` 物件池，避免快速觸發時音效被截斷。

---

## 7. RWD 響應式設計

### 7.1 斷點定義

```css
/* css/layout/responsive.css */
/* Mobile First */

/* xs: < 480px */
/* sm: 480px ~ 767px */
/* md: 768px ~ 1023px */
/* lg: 1024px ~ 1279px */
/* xl: ≥ 1280px */
```

### 7.2 各斷點版型

#### 手機（< 768px）
- 格盤與提示列表**垂直堆疊**
- 格盤佔滿螢幕寬度（留 8px padding）
- 顯示**虛擬鍵盤**（A-Z + Backspace + Enter）
- 提示列表以 Tab 切換（橫向 / 縱向）
- 工具列縮短，僅顯示圖示

#### 平板（768px ～ 1023px）
- 格盤置左，提示列表置右（比例約 60:40）
- 虛擬鍵盤保留（觸控裝置偵測）
- 字體略放大

#### 桌機（≥ 1024px）
- 三欄版型：縱向提示 | 格盤 | 橫向提示
- 隱藏虛擬鍵盤
- 格盤最大寬度 600px，置中顯示

### 7.3 格子大小縮放策略

```javascript
// 根據謎題大小與可用空間動態計算格子大小
function calcCellSize(puzzleSize, containerWidth) {
  const minCell = 32;   // px
  const maxCell = 60;   // px
  const calculated = Math.floor(containerWidth / puzzleSize);
  return Math.min(maxCell, Math.max(minCell, calculated));
}
```

### 7.4 觸控優化

- 所有可點擊元素最小尺寸 **44×44px**（符合 Apple HIG）
- 格子支援 `touch-action: manipulation` 防止雙擊縮放
- 虛擬鍵盤按鍵支援長按刪除
- 禁止文字選取（格盤區域 `user-select: none`）

---

## 8. 設定系統

### 8.1 設定資料結構（`localStorage`）

```javascript
// Key: "crossword_settings"
{
  theme: "ocean",          // 主題 ID
  bgmVolume: 0.7,          // 背景音樂音量 0~1
  sfxVolume: 0.8,          // 音效音量 0~1
  showTimer: true,         // 顯示計時器
  showErrors: true,        // 即時顯示錯誤
  fontSize: "normal",      // "normal" | "large" | "xlarge"
  language: "zh-TW"        // "zh-TW" | "en"
}
```

### 8.2 主題切換實作

```javascript
// 切換主題只需更換 data-theme 屬性
document.documentElement.setAttribute('data-theme', themeId);
// CSS 透過 [data-theme="ocean"] 選擇器套用對應變數
```

---

## 9. 存檔與繼續遊戲

### 9.1 存檔時機

- 每次填入字母後自動存檔
- 離開遊戲畫面前自動存檔
- 無需手動儲存

### 9.2 存檔資料結構

```javascript
// Key: "crossword_save"
{
  puzzleId: "medium_003",        // 謎題識別碼
  difficulty: "medium",
  grid: [                         // 當前格子狀態二維陣列
    [{ letter: "A", revealed: false }, ...]
  ],
  hintsRemaining: 2,
  elapsedSeconds: 342,
  savedAt: "2026-06-01T12:00:00Z"
}
```

### 9.3 繼續遊戲流程

1. 讀取存檔 → 顯示存檔摘要（謎題難度、已用時間、完成度 %）
2. 玩家確認繼續
3. 載入存檔狀態，恢復格子填寫進度與計時器
4. BGM 從 `gameplay` 重新播放

---

## 10. 遊戲核心邏輯

### 10.1 謎題資料流

```
puzzles/*.js
    │  定義謎題陣列
    ↓
puzzle.js
    │  解析謎題，建立內部資料模型
    ↓
grid.js
    │  根據資料渲染 HTML 格盤
    │  綁定點擊 / 鍵盤事件
    ↓
solver.js
    │  驗證填入字母是否正確
    │  判斷是否完成整個謎題
    ↓
state.js
    │  更新全域狀態
    ↓
storage.js
    └  自動儲存至 localStorage
```

### 10.2 勝利條件

1. 所有非黑格均已填入字母
2. 所有字母與答案完全吻合
3. 觸發勝利動畫 + 播放 `puzzle_clear` 音效 + 切換 `victory` BGM
4. 顯示完成統計（用時、提示使用次數、錯誤次數）

### 10.3 提示系統

- 點擊「提示」→ 隨機揭示當前選中單字的一個未填格子
- 揭示後格子標記為 `revealed`，顯示特殊顏色 `--color-bg-cell-hint`
- `revealed` 格子不可修改
- 每場遊戲提示次數有限（依難度）

---

## 11. 資料格式

### 11.1 謎題物件格式

```javascript
// js/data/puzzles/medium.js
const MEDIUM_PUZZLES = [
  {
    id: "medium_001",
    title: "動物世界",
    size: { rows: 13, cols: 13 },
    grid: [
      // 0 = 黑格, 字母 = 答案
      [0, 0, "C", "A", "T", 0, 0, 0, 0, 0, 0, 0, 0],
      // ...
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 2, answer: "CAT", clue: "常見的家庭寵物，會喵喵叫" },
        // ...
      ],
      down: [
        { number: 1, row: 0, col: 2, answer: "CROW", clue: "全身黑色的鳥類" },
        // ...
      ]
    }
  }
];
```

---

## 12. 開發里程碑

| 階段 | 項目 | 優先級 |
|------|------|--------|
| **P0 — 核心可玩** | 資料夾結構 + index.html 引入骨架 | 必須 |
| | 主選單四個功能按鈕 | 必須 |
| | 基礎填字格盤渲染（10×10） | 必須 |
| | 鍵盤輸入 + 格子選取 | 必須 |
| | 答案驗證 + 勝利判斷 | 必須 |
| **P1 — 完整體驗** | 6 套配色主題 | 高 |
| | BGM + SFX 音效系統 | 高 |
| | 虛擬鍵盤（手機） | 高 |
| | localStorage 存讀檔 | 高 |
| | 計時器 | 高 |
| **P2 — 品質提升** | RWD 三段版型微調 | 中 |
| | 提示功能 | 中 |
| | 說明畫面（圖解） | 中 |
| | 勝利動畫 | 中 |
| **P3 — 加值功能** | 多難度謎題庫（各 5 ～ 10 題） | 低 |
| | 時限模式（倒數計時） | 低 |
| | 成績排行榜（localStorage） | 低 |
| | 自訂謎題匯入（JSON） | 低 |

---

> 📌 **開發提示：** 實作時建議依照 `js/` 子資料夾順序由底層往上開發：`utils` → `core` → `audio` → `engine` → `ui`，最後接 `app.js` 串接所有模組。每個模組對外暴露單一命名空間物件（如 `const AudioManager = { ... }`），避免全域污染。
