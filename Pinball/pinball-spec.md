# 彈珠台 (Pinball) 遊戲規格書

> 版本：v1.0
> 類型：純前端網頁遊戲（HTML5 + CSS + JavaScript）
> 目標：雙擊 `index.html` 即可遊玩，無需 build、無需任何 server。

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術需求與限制](#2-技術需求與限制)
3. [專案檔案結構](#3-專案檔案結構)
4. [視覺設計規範](#4-視覺設計規範)
5. [畫面與功能規格](#5-畫面與功能規格)
6. [遊戲機制](#6-遊戲機制)
7. [音訊系統規格](#7-音訊系統規格)
8. [響應式設計 (RWD)](#8-響應式設計-rwd)
9. [資料儲存](#9-資料儲存)
10. [開發注意事項與驗收清單](#10-開發注意事項與驗收清單)

---

## 1. 專案概述

本專案為一款經典風格的彈珠台（Pinball）網頁遊戲。玩家透過左右擋板（Flippers）將彈珠彈向各種得分目標（彈跳柱、標靶、坡道等）以累積分數,目標是在球數耗盡前取得最高分。

核心特色：

- **零依賴、零安裝**：所有資源皆為靜態檔案,直接以瀏覽器開啟 `index.html` 即可遊玩。
- **跨裝置**：桌機（鍵盤操作）與行動裝置（觸控操作）皆能流暢遊玩。
- **大字體、高可讀性**：所有 UI 文字採用明確的大字體與高對比配色。
- **多主題配色**：提供數種可即時切換的色彩主題。
- **豐富音訊**：10 種以上音效 + 背景音樂,且切換畫面時音樂能持續播放不中斷。

---

## 2. 技術需求與限制

### 2.1 必要條件

| 項目 | 規格 |
| --- | --- |
| 執行方式 | 直接以 `file://` 協定開啟 `index.html`,不需 build / 不需啟動 server |
| 技術棧 | 原生 HTML5、CSS3、JavaScript（ES5/ES6 語法皆可,但**不使用 ES Module 的 import/export**,原因見下） |
| 繪圖 | HTML5 `<canvas>` 2D Context |
| 音訊 | Web Audio API（程序化生成音效）為主,HTML5 `<audio>` 為輔 |
| 相依套件 | **無**。不使用任何需要 npm / CDN 打包的框架 |
| 瀏覽器支援 | Chrome / Edge / Firefox / Safari 最新兩個版本,含行動版 |

### 2.2 ⚠️ 關鍵技術取捨：為何不能用 ES Module

需求要求「雙擊開啟、不跑 server」,同時又要「index 用引入的方式」。這兩點之間存在一個瀏覽器限制必須先釐清：

> **瀏覽器在 `file://` 協定下,基於 CORS 安全政策會封鎖 ES6 模組（`<script type="module">` 搭配 `import` / `export`）的載入。** 這類寫法一定要透過 HTTP server 才能運作。

因此,為了達成「雙擊就能玩」的目標,本專案的「引入方式」採用**傳統多檔案標籤引入**:

- CSS：在 `<head>` 內以多個 `<link rel="stylesheet">` 引入。
- JS：在 `</body>` 前以多個 `<script src="...">` 依**相依順序**引入,各檔案以全域命名空間或 IIFE 模式組織,避免變數污染。

這樣既能把 CSS / JS 拆分到不同資料夾分類管理,又能保證 `file://` 直接開啟正常運作。

### 2.3 ⚠️ 音訊在 file:// 下的限制與對策

Web Audio API 若使用 `fetch()` + `decodeAudioData()` 載入外部音檔,在 `file://` 下同樣會被 CORS 封鎖。對策如下：

- **音效（SFX）**：全部以 Web Audio API 的 **Oscillator（振盪器）+ 雜訊 + 包絡（envelope）程序化合成**,完全不載入任何音檔 → 不受 CORS 影響,且檔案體積為零。這也是本專案能輕鬆做到 10 多種音效的關鍵。
- **背景音樂（BGM）**：使用 HTML5 `<audio>` 元素（`new Audio()` 或 `<audio>` 標籤）播放本機音檔,此方式在 `file://` 下多數瀏覽器可正常運作。若仍要完全避免音檔,亦可用 Web Audio 程序化生成循環旋律。

---

## 3. 專案檔案結構

```
pinball/
├── index.html                  # 唯一進入點,負責引入所有 CSS / JS
│
├── css/
│   ├── reset.css               # 瀏覽器樣式重置
│   ├── variables.css           # CSS 變數：配色主題、字級、間距（核心）
│   ├── base.css                # 全域基礎樣式（字體、背景、捲動）
│   ├── layout.css              # 版面骨架(畫面容器、置中、堆疊層級)
│   ├── components.css          # 共用元件(按鈕、開關、滑桿、卡片)
│   ├── screen-menu.css         # 主選單畫面樣式
│   ├── screen-game.css         # 遊戲畫面樣式(計分板、HUD、Canvas 容器)
│   ├── screen-help.css         # 說明畫面樣式
│   ├── screen-settings.css     # 設定畫面樣式
│   ├── themes.css              # 各配色主題的覆寫規則
│   └── responsive.css          # RWD 斷點(放在最後,優先權最高)
│
├── js/
│   ├── config.js               # 全域設定常數(物理參數、分數、預設值)
│   ├── utils.js                # 工具函式(亂數、向量、碰撞數學、儲存)
│   │
│   ├── audio/
│   │   ├── audio-manager.js     # 音訊總管：BGM 跨畫面持續、音量、靜音
│   │   └── sound-effects.js     # 各音效的程序化合成定義(10+ 種)
│   │
│   ├── core/
│   │   ├── game-loop.js         # requestAnimationFrame 主迴圈
│   │   ├── physics.js           # 重力、反彈、摩擦力計算
│   │   ├── collision.js         # 圓 vs 線段 / 圓 vs 圓 碰撞偵測
│   │   └── renderer.js          # Canvas 繪圖
│   │
│   ├── entities/
│   │   ├── ball.js              # 彈珠
│   │   ├── flipper.js           # 左右擋板
│   │   ├── bumper.js            # 彈跳柱
│   │   ├── target.js            # 標靶 / 得分區
│   │   ├── plunger.js           # 發射器
│   │   └── wall.js              # 牆面 / 邊界
│   │
│   ├── ui/
│   │   ├── screen-manager.js    # 畫面切換狀態機(選單/遊戲/說明/設定)
│   │   ├── menu.js              # 主選單邏輯(開始/繼續/說明/設定)
│   │   ├── hud.js               # 遊戲中分數、球數、訊息顯示
│   │   ├── settings.js          # 設定面板邏輯(主題、音量、難度)
│   │   └── input.js             # 鍵盤 + 觸控輸入處理
│   │
│   └── main.js                  # 啟動點：初始化各模組、綁定事件(最後引入)
│
├── assets/
│   └── audio/
│       └── bgm/
│           ├── menu-theme.mp3   # 選單背景音樂(可選,亦可程序化生成)
│           └── game-theme.mp3   # 遊戲背景音樂(可選)
│
└── README.md                    # 操作說明與專案介紹
```

> **JS 引入順序原則**：被依賴者先引入。順序為
> `config → utils → audio/* → core/* → entities/* → ui/* → main.js`。
> `main.js` 永遠最後引入,作為啟動入口。

### index.html 引入範例

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>彈珠台 Pinball</title>

  <!-- ===== 引入所有 CSS（順序：重置→變數→基礎→版面→元件→各畫面→主題→RWD）===== -->
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/screen-menu.css" />
  <link rel="stylesheet" href="css/screen-game.css" />
  <link rel="stylesheet" href="css/screen-help.css" />
  <link rel="stylesheet" href="css/screen-settings.css" />
  <link rel="stylesheet" href="css/themes.css" />
  <link rel="stylesheet" href="css/responsive.css" />
</head>
<body data-theme="neon">
  <!-- 各畫面容器（同時存在,以 class 控制顯示/隱藏）-->
  <main id="app">
    <section id="screen-menu"     class="screen is-active"> ... </section>
    <section id="screen-game"     class="screen"> <canvas id="board"></canvas> ... </section>
    <section id="screen-help"     class="screen"> ... </section>
    <section id="screen-settings" class="screen"> ... </section>
  </main>

  <!-- ===== 依相依順序引入所有 JS（不可使用 type="module"）===== -->
  <script src="js/config.js"></script>
  <script src="js/utils.js"></script>

  <script src="js/audio/audio-manager.js"></script>
  <script src="js/audio/sound-effects.js"></script>

  <script src="js/core/game-loop.js"></script>
  <script src="js/core/physics.js"></script>
  <script src="js/core/collision.js"></script>
  <script src="js/core/renderer.js"></script>

  <script src="js/entities/ball.js"></script>
  <script src="js/entities/flipper.js"></script>
  <script src="js/entities/bumper.js"></script>
  <script src="js/entities/target.js"></script>
  <script src="js/entities/plunger.js"></script>
  <script src="js/entities/wall.js"></script>

  <script src="js/ui/screen-manager.js"></script>
  <script src="js/ui/menu.js"></script>
  <script src="js/ui/hud.js"></script>
  <script src="js/ui/settings.js"></script>
  <script src="js/ui/input.js"></script>

  <script src="js/main.js"></script>
</body>
</html>
```

---

## 4. 視覺設計規範

### 4.1 字體規範

所有文字**一律使用大字體並確保高可讀性**。以 CSS 變數集中管理,並以 `clamp()` 兼顧 RWD。

```css
/* variables.css */
:root {
  /* 字體家族：優先使用系統無襯線字體,確保 file:// 下無需載入字檔 */
  --font-ui:    "Segoe UI", "PingFang TC", "Microsoft JhengHei",
                "Noto Sans TC", system-ui, sans-serif;
  --font-score: "Arial Black", Impact, var(--font-ui); /* 計分用粗體字 */

  /* 字級（min, 視窗縮放, max）—— 整體偏大 */
  --fs-display: clamp(2.5rem, 8vw, 5rem);    /* 主標題 / LOGO */
  --fs-h1:      clamp(2rem, 6vw, 3.5rem);    /* 畫面標題 */
  --fs-h2:      clamp(1.5rem, 4.5vw, 2.5rem);
  --fs-button:  clamp(1.25rem, 4vw, 2rem);   /* 按鈕文字 */
  --fs-body:    clamp(1.125rem, 3.5vw, 1.5rem); /* 內文 */
  --fs-score:   clamp(1.75rem, 6vw, 3rem);   /* 計分板數字 */

  /* 字重與間距 */
  --fw-bold: 700;
  --fw-black: 900;
  --lh-tight: 1.2;
  --lh-body: 1.6;
  --ls-wide: 0.05em; /* 字距,提升大字標題可讀性 */
}
```

可讀性規則：

- 內文行高不低於 `1.5`,標題不低於 `1.2`。
- 文字與背景對比度需 ≥ **4.5:1**(達 WCAG AA)。
- 按鈕最小可點擊區域 **48 × 48 px**(行動裝置觸控標準)。
- 重要數值（分數、球數）使用粗體字 `--font-score`。

### 4.2 配色主題系統

提供**多種可即時切換的配色主題**。透過 `<body data-theme="...">` 屬性切換,所有顏色定義為 CSS 變數,主題只需覆寫變數即可全站生效。

**主題清單（至少 5 種）：**

| 主題 key | 名稱 | 風格 |
| --- | --- | --- |
| `neon` | 霓虹夜 | 深底 + 螢光粉/青(預設) |
| `classic` | 經典紅 | 復古機台紅黑配 |
| `ocean` | 海洋藍 | 深藍 + 水藍漸層 |
| `forest` | 森林綠 | 墨綠 + 萊姆綠 |
| `sunset` | 夕陽橘 | 暖紫 + 橙黃 |
| `mono` | 高對比 | 純黑白,輔助色弱/無障礙 |

```css
/* variables.css —— 預設(neon)以 :root 定義 */
:root {
  --c-bg:        #0d0221;
  --c-surface:   #1a0b2e;
  --c-primary:   #ff2d95;
  --c-secondary: #00e5ff;
  --c-accent:    #faff00;
  --c-text:      #ffffff;
  --c-text-dim:  #b8a9d4;
  --c-success:   #00ff9f;
  --c-danger:    #ff3b3b;
}

/* themes.css —— 其餘主題以 data-theme 覆寫 */
[data-theme="classic"] {
  --c-bg: #1a0000; --c-surface: #2b0a0a;
  --c-primary: #e63946; --c-secondary: #ffb703; --c-accent: #fefae0;
  --c-text: #fff5f5; --c-text-dim: #d9a5a5;
}
[data-theme="ocean"] {
  --c-bg: #03045e; --c-surface: #023e8a;
  --c-primary: #00b4d8; --c-secondary: #90e0ef; --c-accent: # caf0f8;
  --c-text: #ffffff; --c-text-dim: #a9d6e5;
}
[data-theme="forest"]  { /* ... */ }
[data-theme="sunset"]  { /* ... */ }
[data-theme="mono"] {
  --c-bg: #000000; --c-surface: #1a1a1a;
  --c-primary: #ffffff; --c-secondary: #ffd60a; --c-accent: #ffffff;
  --c-text: #ffffff; --c-text-dim: #cccccc;
}
```

**切換邏輯**：使用者在「設定」選擇主題 → JS 更新 `document.body.dataset.theme` → 寫入 `localStorage` → 下次開啟自動套用。

> 此外,Canvas 內的遊戲元素(彈珠、擋板、彈跳柱)顏色也應讀取對應主題,可由 JS 讀取 CSS 變數(`getComputedStyle`)後傳入繪圖,維持整體一致。

---

## 5. 畫面與功能規格

採**單頁 + 畫面狀態機**設計。四個畫面容器同時存在於 DOM,由 `screen-manager.js` 以 `.is-active` class 控制顯示,搭配淡入淡出轉場。**畫面切換不重載頁面**,因此背景音樂能無縫持續(見第 7 章)。

```
       ┌──────────────┐
       │   主選單      │◀──────────────┐
       │ (screen-menu)│               │
       └──────────────┘               │
        │   │    │   │                │ 返回
  開始  │   │ 繼續│ 說明│ 設定          │
  ▼     │   ▼    ▼   ▼                │
┌──────────┐  ┌──────┐  ┌──────────┐  │
│  遊戲畫面 │  │ 說明  │  │  設定     │──┘
│(暫停可返回)│  └──────┘  └──────────┘
└──────────┘
```

### 5.1 主選單 (screen-menu)

| 按鈕 | 行為 | 狀態邏輯 |
| --- | --- | --- |
| **開始遊戲** | 重置分數、球數,建立新局,切到遊戲畫面 | 一律可用 |
| **繼續遊戲** | 回到先前暫停的進度繼續 | 僅當存在「暫停中的存檔」時可點擊,否則灰階禁用 |
| **說明** | 切到說明畫面 | 一律可用 |
| **設定** | 切到設定畫面 | 一律可用 |

內容：遊戲 LOGO / 標題(`--fs-display`)、最高分顯示、四個大按鈕(直向排列,行動裝置友善)。

### 5.2 遊戲畫面 (screen-game)

組成：

- **計分板 / HUD**(`hud.js`)：目前分數、最高分、剩餘球數(以圖示或數字)、即時提示訊息(如「JACKPOT!」「TILT!」)。
- **彈珠台 Canvas**：`<canvas id="board">`,維持固定長寬比(建議 **9:16** 直向)並隨容器縮放。
- **暫停按鈕**：點擊後暫停物理運算、彈出暫停選單(繼續 / 重新開始 / 回主選單)。
- **操作提示**:行動裝置顯示「點左/右半邊控制擋板」,桌機顯示「←/→ 或 ↑ 發射」。

暫停時若返回主選單,需保存當前局面狀態,讓「繼續遊戲」可用。

### 5.3 說明畫面 (screen-help)

以大字體、條列方式說明：

- **遊戲目標**：在球數耗盡前取得最高分。
- **操作方式**：
  - 桌機：`←` 左擋板、`→` 右擋板、按住 `↑` 蓄力放開發射、`Esc` 暫停。
  - 行動：點/按住螢幕**左半邊**=左擋板、**右半邊**=右擋板、下方發射區上滑發射。
- **得分元素說明**:彈跳柱、標靶、坡道、連擊(Combo)、大獎(Jackpot)各自分數。
- 底部「返回」按鈕。

### 5.4 設定畫面 (screen-settings)

| 設定項 | 控制元件 | 範圍 / 選項 | 即時生效 |
| --- | --- | --- | --- |
| 配色主題 | 主題色卡選擇器 | 6 種主題(見 4.2) | ✅ 即時換色 |
| 背景音樂音量 | 滑桿 | 0 ~ 100% | ✅ |
| 音效音量 | 滑桿 | 0 ~ 100% | ✅ |
| 靜音總開關 | 開關 | 開 / 關 | ✅ |
| 難度 | 分段選擇 | 簡單 / 普通 / 困難(影響重力、球速、球數) | 下一局生效 |
| 震動回饋 | 開關 | 開 / 關(行動裝置 `navigator.vibrate`) | ✅ |
| 重置最高分 | 按鈕 | 二次確認後清除 | ✅ |

所有設定寫入 `localStorage`,重開自動還原。

---

## 6. 遊戲機制

### 6.1 物理

- 在 `config.js` 集中定義：重力加速度 `GRAVITY`、反彈係數 `RESTITUTION`、摩擦/空氣阻力 `FRICTION`、擋板施力 `FLIPPER_FORCE`、最大球速 `MAX_SPEED`(防止穿牆)。
- 每幀以 `requestAnimationFrame` 更新,並以**固定時間步長(fixed timestep)**累積,確保不同裝置 FPS 下物理一致。
- 碰撞偵測：彈珠(圓)對牆面(線段)、對彈跳柱/擋板(圓或多邊形),計算反射向量。

### 6.2 得分元素與分數(範例,可於 config 調整)

| 元素 | 說明 | 分數 |
| --- | --- | --- |
| 彈跳柱 Bumper | 撞擊後彈開 | 100 |
| 標靶 Target | 命中後熄滅,全滅給獎勵 | 250 |
| 坡道 Ramp | 通過坡道 | 500 |
| 連擊 Combo | 短時間內連續命中倍率提升 | ×1.5 / ×2 ... |
| 大獎 Jackpot | 達成特定條件觸發 | 5000 |
| 額外球 Extra Ball | 達特定分數門檻獲得 | +1 球 |

### 6.3 局面流程

```
開始新局 → 球數 = 預設(依難度) → 發射球
   → 遊玩(碰撞得分)
   → 球掉落到底部排水口 → 球數 -1
        ├─ 球數 > 0 → 重新發射
        └─ 球數 = 0 → 遊戲結束 → 結算分數 / 更新最高分 → 回主選單
```

---

## 7. 音訊系統規格

> **核心目標**:音效種類豐富(10+ 種),且**切換畫面時背景音樂持續播放、不中斷、不重頭開始**。

### 7.1 音效清單（≥ 10 種,全部以 Web Audio 程序化合成）

每個音效以 Oscillator 波形 + 頻率 + 包絡(ADSR)定義,不需任何音檔。

| # | 音效 key | 觸發時機 | 建議音色 |
| --- | --- | --- | --- |
| 1 | `launch` | 發射彈珠 | 上升掃頻(sawtooth,頻率漸高) |
| 2 | `flipper` | 擋板拍擊 | 短促 click(square,極短) |
| 3 | `bumper` | 撞擊彈跳柱 | 圓潤彈跳音(sine,中頻) |
| 4 | `wall` | 撞牆反彈 | 低頻悶響(triangle,短) |
| 5 | `target` | 命中標靶 | 清亮叮(sine,高頻) |
| 6 | `score` | 一般得分 | 短鈴聲(兩音上行) |
| 7 | `combo` | 連擊 | 音階上行(每次連擊音高 +1) |
| 8 | `jackpot` | 觸發大獎 | 華麗琶音(多音快速上行) |
| 9 | `extraBall` | 獲得額外球 | 愉悅雙音 |
| 10 | `multiball` | 多球啟動 | 快速顫音 |
| 11 | `drain` | 球掉落排水口 | 下降掃頻(頻率漸低,失落感) |
| 12 | `gameOver` | 遊戲結束 | 下行小調三音 |
| 13 | `tilt` | 傾斜警告 | 警示蜂鳴(交替兩音) |
| 14 | `uiClick` | 按鈕點擊 | 輕脆 click |
| 15 | `uiHover` | 按鈕聚焦/滑入 | 極輕短音 |
| 16 | `screenChange` | 切換畫面 | 柔和滑音(whoosh) |
| 17 | `newHighScore` | 刷新最高分 | 勝利號角(上行琶音) |
| 18 | `countdown` | 倒數提示 | 規律滴答 |

> 共 **18 種**,超過需求的 10 種,提供充裕的擴充空間。

**程序化音效範例（sound-effects.js）：**

```js
// 以共用 AudioContext（由 audio-manager 提供）合成單發音效
function playTone(ctx, { freq = 440, type = 'sine', duration = 0.15,
                        gain = 0.3, sweepTo = null }) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, now + duration);

  // ADSR 簡化包絡：快速起音 + 線性釋放,避免爆音
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(gain, now + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(env).connect(SFX.masterGain); // 接到音效音量控制節點
  osc.start(now);
  osc.stop(now + duration);
}

// 各音效定義
const SFX_LIBRARY = {
  launch:   ctx => playTone(ctx, { type:'sawtooth', freq:220, sweepTo:880, duration:0.4 }),
  bumper:   ctx => playTone(ctx, { type:'sine',     freq:520, duration:0.12, gain:0.35 }),
  drain:    ctx => playTone(ctx, { type:'sawtooth', freq:440, sweepTo:80,  duration:0.5 }),
  uiClick:  ctx => playTone(ctx, { type:'square',   freq:600, duration:0.06, gain:0.2 }),
  jackpot:  ctx => [0,4,7,12].forEach((s,i) =>           // 琶音
                setTimeout(() => playTone(ctx,
                  { freq: 440 * Math.pow(2, s/12), duration:0.18 }), i*70)),
  // ... 其餘音效比照定義
};
```

### 7.2 背景音樂（BGM）

- 兩首循環曲：`menu-theme`(選單/說明/設定共用)、`game-theme`(遊戲中)。
- 來源二選一：
  - **音檔**:放於 `assets/audio/bgm/`,以 HTML5 `<audio loop>` 播放(`file://` 可用)。
  - **程序化**:以 Web Audio 排程音符循環,完全免音檔。
- 進入遊戲畫面切到 `game-theme`,回到選單/說明/設定切回 `menu-theme`,並以淡入淡出(fade)銜接。

### 7.3 ⭐ 跨畫面音樂持續播放（核心需求）

**問題**:常見錯誤是每次切換畫面都重新 `new Audio()` 或 `play()`,導致音樂從頭開始、瞬間中斷或重疊播放。

**設計原則:**

1. **單一全域 AudioManager 實例**,音樂物件只建立一次,在整個 App 生命週期內存活,**不隨畫面切換而重建**。
2. 切換畫面時,只判斷「目標畫面該用哪首曲子」:
   - 若**與目前正在播放的曲目相同** → **什麼都不做**,讓它繼續播放(關鍵)。
   - 若**不同** → 用淡出舊曲 + 淡入新曲銜接,而非硬切。
3. 選單 / 說明 / 設定三個畫面共用 `menu-theme`,因此在這三者間互相切換時,音樂**完全連續、不會中斷**。
4. 音樂播放進度(`currentTime`)保留,暫停遊戲返回選單再回來,不會重頭播放。

**AudioManager 行為對照表：**

| 從 → 到 | 目標 BGM | 音樂行為 |
| --- | --- | --- |
| 選單 → 設定 | menu-theme | **持續播放,不中斷** |
| 設定 → 說明 | menu-theme | **持續播放,不中斷** |
| 說明 → 選單 | menu-theme | **持續播放,不中斷** |
| 選單 → 遊戲 | game-theme | 淡出 menu、淡入 game |
| 遊戲 → 選單 | menu-theme | 淡出 game、淡入 menu |
| 遊戲(暫停)→ 選單 → 遊戲 | game-theme | 淡出再淡入,**或**保留 game 進度 |

### 7.4 AudioManager 介面設計（audio-manager.js）

```js
const AudioManager = (function () {
  let ctx;                       // 全域唯一 AudioContext
  let currentTrack = null;       // 目前 BGM 的 key,如 'menu' / 'game'
  const tracks = {};             // { menu: <audio>, game: <audio> }
  let bgmVolume = 0.6, sfxVolume = 0.8, muted = false;

  // 瀏覽器自動播放政策：AudioContext 必須在使用者首次互動後才能 resume
  function unlock() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  // 核心：請求播放某 BGM —— 若已是該曲則「不動作」,確保連續播放
  function playBGM(key) {
    if (muted) return;
    if (currentTrack === key) return;          // ★ 同一首 → 維持播放,不中斷
    if (currentTrack) fadeOut(tracks[currentTrack]); // 淡出舊曲
    fadeIn(tracks[key]);                       // 淡入新曲
    currentTrack = key;
  }

  function playSFX(key) {
    if (muted || !ctx) return;
    SFX_LIBRARY[key]?.(ctx);                   // 程序化合成,可重疊播放
  }

  function setBgmVolume(v) { bgmVolume = v; applyVolumes(); }
  function setSfxVolume(v) { sfxVolume = v; }
  function setMuted(m)     { muted = m; applyVolumes(); }

  return { unlock, playBGM, playSFX, setBgmVolume, setSfxVolume, setMuted };
})();
```

**接線方式**:`screen-manager.js` 在切換畫面時呼叫 `AudioManager.playBGM('menu' | 'game')`;各互動點呼叫 `AudioManager.playSFX('...')`。`main.js` 在第一次使用者點擊時呼叫一次 `AudioManager.unlock()`(因應瀏覽器自動播放限制)。

---

## 8. 響應式設計 (RWD)

### 8.1 斷點

```css
/* responsive.css */
/* 行動裝置直向（預設,Mobile First）         < 600px  */
/* 平板 / 大手機橫向                @media (min-width: 600px)  */
/* 桌機                            @media (min-width: 1024px) */
```

### 8.2 版面規則

- **Mobile First**:基準樣式針對手機直向,再用 `min-width` 往上加大。
- 主選單按鈕在手機為**全寬直向堆疊**,桌機可置中限制最大寬度。
- 遊戲 Canvas：維持 **9:16** 比例,以 `aspect-ratio` + `max-height: 100vh` 縮放,確保整台彈珠台在任何螢幕都完整可見、不需捲動。
- 字級全面使用 `clamp()`,小螢幕不過大、大螢幕不過小。

### 8.3 觸控 vs 鍵盤輸入（input.js）

| 裝置 | 左擋板 | 右擋板 | 發射 | 暫停 |
| --- | --- | --- | --- | --- |
| 桌機 | `←` | `→` | 按住 `↑` 放開 | `Esc` |
| 行動 | 觸控螢幕左半邊 | 觸控螢幕右半邊 | 下方發射區上滑 | 暫停按鈕 |

- 觸控使用 `touchstart` / `touchend`,並 `preventDefault()` 避免捲動 / 雙擊縮放。
- `<meta viewport>` 加上 `user-scalable=no`,避免遊玩時誤觸縮放。
- 同時支援多點觸控(左右擋板可同時按)。
- 視窗大小改變(`resize` / 旋轉)時重新計算 Canvas 尺寸與物理座標縮放比例。

### 8.4 行動裝置優化

- 元素尺寸與點擊區 ≥ 48px。
- 可選用 `navigator.vibrate()` 提供碰撞震動回饋(設定可關)。
- 避免使用 `:hover` 作為唯一互動提示(觸控無 hover)。
- 防止長按選取文字:`user-select: none`。

---

## 9. 資料儲存

使用 `localStorage`(`file://` 下可用),集中於 `utils.js` 封裝讀寫。

| key | 內容 | 用途 |
| --- | --- | --- |
| `pinball.highscore` | 數字 | 歷史最高分 |
| `pinball.settings` | JSON | 主題、音量、靜音、難度、震動 |
| `pinball.savedGame` | JSON 或 null | 暫停中的局面(供「繼續遊戲」) |

> 注意:`file://` 下不同檔案路徑可能視為不同 origin,`localStorage` 通常仍可運作但行為依瀏覽器而異;若發現無法儲存,屬瀏覽器安全限制,並非程式錯誤。

---

## 10. 開發注意事項與驗收清單

### 10.1 重要技術提醒

- ❌ **不要**使用 `<script type="module">` 與 `import/export` —— `file://` 下會失效。
- ❌ **不要**用 `fetch()` 載入本機音檔到 Web Audio —— `file://` 下 CORS 失敗。改用程序化合成或 `<audio>` 元素。
- ✅ JS 檔案以全域命名空間 / IIFE 組織,引入順序「被依賴者在前」。
- ✅ 音樂物件只建立一次,切換畫面時相同曲目**維持播放不重建**。
- ✅ 第一次使用者互動時 `resume()` AudioContext(自動播放政策)。
- ✅ 顏色、字級、間距等全部走 CSS 變數,主題切換才能一鍵生效。

### 10.2 驗收清單（對應原始需求）

| # | 需求 | 驗收標準 |
| --- | --- | --- |
| 1 | 純前端、雙擊開啟 | 將整個資料夾複製到任意位置,直接雙擊 `index.html` 即可遊玩,**過程無需任何指令或 server** |
| 2 | RWD 順暢 | 手機(直向)、平板、桌機皆可完整顯示與操作;旋轉/縮放視窗版面不破 |
| 3 | 大字體 + 多配色 | 文字清晰偏大、對比達標;設定中可即時切換 ≥ 5 種主題並記憶 |
| 4 | CSS/JS 分類引入 | 檔案依第 3 章資料夾結構分類;`index.html` 以多個 `<link>` / `<script>` 引入 |
| 5 | 主選單四功能 | 開始 / 繼續(有存檔才可用)/ 說明 / 設定 皆正常運作 |
| 6 | 豐富音訊 + 音樂連續 | ≥ 10 種音效可觸發;選單↔說明↔設定 間切換 BGM **持續不中斷** |

### 10.3 建議開發順序

1. 建立檔案結構 + `index.html` 引入骨架 + 畫面狀態機(`screen-manager`)。
2. 完成四個畫面的 UI 與 CSS 變數 / 主題 / RWD。
3. 實作 `AudioManager`,先驗證跨畫面 BGM 連續播放與音效觸發。
4. 實作 Canvas 物理與彈珠核心玩法(球、擋板、發射、碰撞、得分)。
5. 串接 HUD、計分、球數、遊戲結束流程。
6. 接上設定(主題 / 音量 / 難度 / 震動)與 `localStorage` 存取。
7. 行動裝置觸控、震動、實機測試與調校。

---

*規格書結束。*
