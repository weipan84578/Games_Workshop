# 🐾 Virtual Pet 電子寵物遊戲 — 詳細規格書

| 項目 | 內容 |
|---|---|
| 文件版本 | v1.0 |
| 建立日期 | 2026-06-17 |
| 專案類型 | 純前端網頁遊戲（離線可玩） |
| 目標平台 | 桌機瀏覽器 / 手機瀏覽器（RWD） |
| 支援語言 | 繁體中文 / English / 日本語 |

---

## 目錄

1. [專案總覽](#1-專案總覽)
2. [技術限制與重要注意事項](#2-技術限制與重要注意事項)
3. [專案資料夾結構](#3-專案資料夾結構)
4. [RWD 響應式設計規範](#4-rwd-響應式設計規範)
5. [視覺設計規範（字體／配色）](#5-視覺設計規範字體配色)
6. [主畫面規格](#6-主畫面main-menu規格)
7. [遊戲主畫面規格](#7-遊戲主畫面game-screen規格)
8. [說明頁面規格](#8-說明頁面instructions規格)
9. [設定頁面規格](#9-設定頁面settings規格)
10. [音樂與音效系統規格](#10-音樂與音效系統規格)
11. [多國語系（i18n）規格](#11-多國語系i18n規格)
12. [存檔系統規格](#12-存檔系統規格)
13. [寵物系統設計](#13-寵物系統設計)
14. [動畫與互動回饋規格](#14-動畫與互動回饋規格)
15. [無障礙與效能注意事項](#15-無障礙與效能注意事項)
16. [測試與驗收標準](#16-測試與驗收標準checklist)

---

## 1. 專案總覽

### 1.1 專案目標
打造一款**純前端、零依賴**的電子寵物網頁遊戲。玩家可以餵食、玩耍、清潔、照顧寵物，觀察寵物成長，並透過豐富的音效、音樂與視覺回饋獲得沉浸式體驗。整個遊戲**雙擊 `index.html` 即可開啟**，不需要 npm install、不需要 webpack/vite build、不需要啟動任何 local server。

### 1.2 核心技術原則
- 100% 純 HTML / CSS / JavaScript（Vanilla JS），不使用任何框架（React/Vue 皆不需要，避免需要 build 工具）。
- 不使用 ES Module（`type="module"`）、不使用 `fetch()` 讀取外部 JSON/檔案 —— 原因見第 2 章（file:// 協議限制）。
- 所有資源（圖片、音檔）皆採**相對路徑**引用，確保資料夾整包搬移後仍可運作。
- 所有 JS 採用「全域命名空間模式」（如 `window.VP = window.VP || {}`）來模擬模組化，取代 `import/export`。

### 1.3 技術堆疊
| 類別 | 技術 |
|---|---|
| 結構 | HTML5 |
| 樣式 | CSS3（CSS Variables、Flexbox、Grid、Media Query） |
| 邏輯 | Vanilla JavaScript (ES6+ 語法，但不用 module 語法) |
| 音訊 | Web Audio API（`AudioContext` + `GainNode`） |
| 儲存 | `localStorage` |
| 多語系 | 自製輕量 i18n（JS 物件字典） |
| 圖示 | Emoji 或內嵌 SVG（不依賴外部 icon CDN，避免離線開啟失敗） |

---

## 2. 技術限制與重要注意事項

> ⚠️ 這些是純前端、雙擊開啟（`file://` 協議）情境下**必須遵守**的限制，違反會導致遊戲在瀏覽器（尤其 Chrome）直接開啟時白屏或報錯。

| 限制 | 說明 | 規格要求 |
|---|---|---|
| 不可使用 `fetch()` 讀取本地檔案 | `file://` 協議下 `fetch()` 會被瀏覽器 CORS 政策擋掉 | 語言檔、設定資料皆寫成 `.js` 檔內的 JS 物件，用一般 `<script>` 標籤載入，不用 fetch |
| 不可使用 `<script type="module">` | `file://` 下 ES Module 的 import 同樣會被擋（會丟 CORS 錯誤） | 所有 JS 檔皆用一般 `<script src="...">` 標籤，依賴順序手動排列在 `index.html` 中 |
| 音訊自動播放限制 | 瀏覽器政策禁止頁面載入就自動播放有聲音的媒體 | 第一次「開始遊戲/繼續遊戲」按鈕點擊時，才呼叫 `AudioContext.resume()` 並開始播放 BGM |
| `localStorage` 同源限制 | 若資料夾路徑或開啟方式改變，`localStorage` 視為不同來源，可能讀不到舊存檔 | 文件中需註明：請使用同一個資料夾路徑開啟遊戲，存檔才會延續 |
| 跨瀏覽器音檔格式相容性 | Safari 對某些音訊格式支援度不同 | 每個音效/音樂建議同時提供 `.mp3` 與 `.ogg`，由 `<audio>` 的多個 `<source>` 自動選擇 |

---

## 3. 專案資料夾結構

```
virtual-pet/
├── index.html                  ← 唯一入口，雙擊即可開啟
├── README.md
│
├── css/
│   ├── base/
│   │   ├── reset.css           ← 瀏覽器預設樣式重置
│   │   ├── variables.css       ← 全域 CSS 變數（字級、間距、z-index）
│   │   └── typography.css      ← 全域字體規範
│   │
│   ├── themes/                 ← 多套配色主題（第5章）
│   │   ├── theme-candy.css     ← 糖果粉彩
│   │   ├── theme-ocean.css     ← 海洋藍
│   │   ├── theme-forest.css    ← 森林綠
│   │   ├── theme-night.css     ← 暗夜紫（深色模式）
│   │   └── theme-sunset.css    ← 夕陽橘
│   │
│   ├── layout/
│   │   ├── main-menu.css
│   │   ├── game-screen.css
│   │   ├── instructions.css
│   │   └── settings.css
│   │
│   ├── components/
│   │   ├── buttons.css
│   │   ├── modal.css
│   │   ├── pet-stage.css       ← 寵物顯示舞台
│   │   ├── status-bar.css      ← 飢餓/心情/清潔等狀態條
│   │   └── toast.css           ← 訊息提示框
│   │
│   └── responsive/
│       ├── mobile.css          ← < 576px
│       ├── tablet.css          ← 576px ~ 1024px
│       └── desktop.css         ← > 1024px
│
├── js/
│   ├── core/
│   │   ├── app.js              ← 程式進入點，初始化所有模組
│   │   ├── sceneManager.js     ← 畫面切換（主選單/遊戲/說明/設定）
│   │   ├── gameState.js        ← 遊戲全域狀態物件
│   │   └── saveManager.js      ← localStorage 存讀檔
│   │
│   ├── pet/
│   │   ├── petModel.js         ← 寵物資料結構與屬性運算
│   │   ├── petActions.js       ← 餵食/玩耍/清潔/睡眠等行為邏輯
│   │   └── petAnimation.js     ← 寵物動畫狀態機
│   │
│   ├── audio/
│   │   ├── audioManager.js     ← 核心音訊播放器（含5倍音量邏輯）
│   │   ├── bgmPlaylist.js      ← 各畫面對應 BGM 設定表
│   │   └── sfxLibrary.js       ← 音效清單與對應動作
│   │
│   ├── i18n/
│   │   ├── i18n.js             ← 語言切換核心邏輯
│   │   ├── lang-zh.js          ← 繁體中文字典
│   │   ├── lang-en.js          ← 英文字典
│   │   └── lang-ja.js          ← 日文字典
│   │
│   ├── ui/
│   │   ├── mainMenu.js
│   │   ├── gameScreen.js
│   │   ├── instructionsPanel.js
│   │   └── settingsPanel.js
│   │
│   └── utils/
│       ├── domHelpers.js       ← DOM 操作小工具
│       ├── eventBus.js         ← 簡易事件中心（模組間溝通）
│       └── timeUtils.js        ← 離線時間計算
│
└── assets/
    ├── images/
    │   ├── pets/               ← 各成長階段寵物圖（蛋/幼體/成體/老年 × 表情）
    │   ├── icons/               ← 狀態/按鈕圖示
    │   ├── backgrounds/         ← 各畫面背景
    │   └── ui/                  ← 按鈕、面板裝飾素材
    │
    └── audio/
        ├── bgm/                ← 背景音樂（依畫面/情境分類）
        │   ├── main-menu.mp3 / .ogg
        │   ├── gameplay-happy.mp3 / .ogg
        │   ├── gameplay-normal.mp3 / .ogg
        │   ├── settings.mp3 / .ogg
        │   └── ending.mp3 / .ogg
        │
        └── sfx/                ← 音效（依動作分類，詳見第10章對照表）
            ├── click.mp3
            ├── feed.mp3
            ├── play.mp3
            ├── clean.mp3
            ├── sleep.mp3
            ├── pet-stroke.mp3
            ├── levelup.mp3
            ├── error.mp3
            └── ...
```

### 3.1 `index.html` 引入順序規範
`index.html` 本身只負責 DOM 骨架 + 引入檔案，不寫商業邏輯。CSS 與 JS 皆按**相依順序**手動列出：

```html
<!-- CSS：base → themes → layout → components → responsive -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/themes/theme-candy.css" id="theme-style">
<link rel="stylesheet" href="css/layout/main-menu.css">
<!-- ...其餘 layout/components -->
<link rel="stylesheet" href="css/responsive/tablet.css">
<link rel="stylesheet" href="css/responsive/mobile.css"> <!-- 行動裝置樣式最後載入，覆寫優先權最高 -->

<!-- JS：utils → i18n → audio → pet → core → ui → app（最後初始化） -->
<script src="js/utils/domHelpers.js"></script>
<script src="js/utils/eventBus.js"></script>
<script src="js/utils/timeUtils.js"></script>
<script src="js/i18n/lang-zh.js"></script>
<script src="js/i18n/lang-en.js"></script>
<script src="js/i18n/lang-ja.js"></script>
<script src="js/i18n/i18n.js"></script>
<script src="js/audio/sfxLibrary.js"></script>
<script src="js/audio/bgmPlaylist.js"></script>
<script src="js/audio/audioManager.js"></script>
<script src="js/pet/petModel.js"></script>
<script src="js/pet/petAnimation.js"></script>
<script src="js/pet/petActions.js"></script>
<script src="js/core/gameState.js"></script>
<script src="js/core/saveManager.js"></script>
<script src="js/core/sceneManager.js"></script>
<script src="js/ui/mainMenu.js"></script>
<script src="js/ui/gameScreen.js"></script>
<script src="js/ui/instructionsPanel.js"></script>
<script src="js/ui/settingsPanel.js"></script>
<script src="js/core/app.js"></script> <!-- 最後執行初始化 -->
```

若未來 `index.html` 太大，依本結構拆出對應的 `<template>` 片段檔（例如 `partials/main-menu.html`），但**不可用 `fetch` 載入**，改用**直接內嵌在 `index.html` 中、用 CSS 控制顯示/隱藏**的方式切換畫面（單頁式 SPA 結構）。

---

## 4. RWD 響應式設計規範

### 4.1 Viewport 設定
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### 4.2 Breakpoint 定義
| 裝置類型 | 寬度範圍 | CSS 檔案 |
|---|---|---|
| 手機 Mobile | < 576px | `mobile.css` |
| 平板 Tablet | 576px ~ 1024px | `tablet.css` |
| 桌機 Desktop | > 1024px | `desktop.css` |

### 4.3 排版策略
- 整體版面使用 **Flexbox + Grid** 混合排版，禁止使用絕對寫死的 px 寬高（除非是固定 icon 尺寸）。
- 遊戲主畫面採「**寵物舞台置中、操作區固定於畫面邊緣**」的結構，確保任何尺寸下寵物都是視覺焦點。
- 使用 `clamp()` 讓字體與間距隨視窗寬度微調，減少斷點跳動感：
  ```css
  font-size: clamp(18px, 2.2vw, 26px);
  ```

### 4.4 觸控目標尺寸（避免手機誤觸）
- 所有可點擊按鈕最小尺寸 **48×48px**，按鈕間距至少 8px。
- 重要操作按鈕（餵食、玩耍等）在手機版放大至 **56×56px**。

### 4.5 按鍵不可擋住遊戲畫面（重點需求）
具體作法：
1. **手機版**：操作按鈕列固定在畫面**最底部**，採半透明懸浮列（`position: fixed; bottom: 0;`），高度不超過畫面 18%，且寵物舞台區域使用 `padding-bottom` 預留出按鈕列高度，確保寵物完整顯示不被遮擋。
2. **平板/桌機版**：操作按鈕改放在畫面**左右側邊欄**（側邊收合面板），寵物舞台維持置中最大化顯示。
3. 狀態列（飢餓/心情/清潔等）固定在畫面**頂部**，與底部操作列分離，不重疊。
4. 支援 iPhone safe-area：
   ```css
   padding-bottom: calc(12px + env(safe-area-inset-bottom));
   ```
5. 任何彈出視窗（Modal，如確認重置存檔）皆置中顯示並有半透明遮罩，不採用會遮住寵物的固定側邊小提示。

---

## 5. 視覺設計規範（字體／配色）

### 5.1 字體規範（全部使用大字體、清晰易讀）
| CSS 變數 | 用途 | 桌機 | 平板 | 手機 |
|---|---|---|---|---|
| `--font-size-xl` | 主標題 / 寵物名稱 | 40px | 34px | 28px |
| `--font-size-lg` | 區塊標題 | 28px | 24px | 22px |
| `--font-size-base` | 一般內文 / 按鈕文字 | 22px | 20px | 18px |
| `--font-size-sm` | 輔助說明文字 | 18px | 17px | 16px |

> 規範要求：**全站最小字體不得小於 16px**，按鈕文字不得小於 18px，確保長輩與小孩都能輕鬆閱讀。

字體家族（需同時支援中文、英文、日文顯示，不依賴外部字體 CDN，避免離線無法載入）：
```css
font-family: "Microsoft JhengHei", "PingFang TC", "Hiragino Sans",
             "Yu Gothic", "Segoe UI", sans-serif;
```
標題可搭配一個圓潤可愛的網頁安全字體加粗顯示，內文一律使用上述系統字體堆疊。

### 5.2 多彩配色主題（設定頁可切換）
| 主題名稱 | 主色 | 輔色 | 背景 | 適用情境 |
|---|---|---|---|---|
| 🍬 糖果粉彩 Candy | `#FF8FB1` | `#FFD1DC` | `#FFF6F9` | 預設主題、活潑可愛 |
| 🌊 海洋藍 Ocean | `#2E9FCE` | `#A8E6FF` | `#EAF9FF` | 清爽 |
| 🌲 森林綠 Forest | `#3FA75C` | `#C8F2D4` | `#F2FBF4` | 自然 |
| 🌙 暗夜紫 Night | `#9B7EDE` | `#3A2E5C` | `#1E1733` | 深色模式 / 護眼 |
| 🌅 夕陽橘 Sunset | `#FF8C42` | `#FFD8A8` | `#FFF4E8` | 溫暖 |

實作方式：每個主題對應一個獨立 CSS 檔（如 `theme-ocean.css`），裡面只覆寫 `:root` 的色彩變數，例如：
```css
:root {
  --color-primary: #2E9FCE;
  --color-secondary: #A8E6FF;
  --color-bg: #EAF9FF;
  --color-text: #1A1A1A;
}
```
切換主題時，JS 動態替換 `<link id="theme-style">` 的 `href`，並寫入 `localStorage` 記住玩家偏好。

---

## 6. 主畫面（Main Menu）規格

### 6.1 畫面結構
```
┌─────────────────────────────┐
│         遊戲 Logo / 寵物吉祥物動畫        │
│                               │
│        [ ▶ 開始遊戲 ]          │
│        [ ⏯ 繼續遊戲 ]          │ ← 無存檔時顯示灰階且不可點擊
│        [ 📖 說明 ]              │
│        [ ⚙ 設定 ]               │
│                               │
│   🌐 語言切換（小型圖示，右上角常駐）  │
└─────────────────────────────┘
```

### 6.2 按鈕邏輯
| 按鈕 | 行為 | 條件 |
|---|---|---|
| 開始遊戲 | 清空舊存檔，建立全新寵物（蛋階段），進入命名畫面後進入遊戲主畫面 | 若已有存檔，需先彈出確認視窗：「確定要開始新遊戲嗎？目前進度將被覆蓋」 |
| 繼續遊戲 | 讀取 `localStorage` 存檔，計算離線經過時間，進入遊戲主畫面 | 無存檔時按鈕顯示灰階、不可點擊，並提示 tooltip：「尚無存檔」 |
| 說明 | 切換至說明頁面（第8章） | 永遠可點 |
| 設定 | 切換至設定頁面（第9章） | 永遠可點 |

### 6.3 音效對應
- 滑入按鈕：輕微 hover 音效（`hover.mp3`，音量較低）
- 點擊任一按鈕：`click.mp3`
- 進入主選單畫面：開始播放主選單 BGM（`main-menu.mp3`）

---

## 7. 遊戲主畫面（Game Screen）規格

### 7.1 畫面結構
```
┌───────────────────────────────────┐
│ 🍖飢餓 ███░░  😊心情 ████░  🧼清潔 ██░░░   │ ← 頂部固定狀態列
│                                       │
│              🐣 寵物舞台區                │ ← 置中最大化顯示
│         （依成長階段/心情切換動畫）           │
│                                       │
├───────────────────────────────────┤
│ [🍖餵食] [🎮玩耍] [🧼清潔] [😴睡眠] [✋撫摸]   │ ← 底部固定操作列（手機版）
└───────────────────────────────────┘
```

### 7.2 狀態列屬性
| 屬性 | 範圍 | 衰減速度 | 說明 |
|---|---|---|---|
| 飢餓度 Hunger | 0–100 | 隨時間下降 | 0 時心情、健康同步下降 |
| 心情 Mood | 0–100 | 隨時間緩慢下降 | 由玩耍/撫摸提升 |
| 清潔度 Clean | 0–100 | 隨時間下降 | 由清潔行為提升 |
| 體力 Energy | 0–100 | 活動時消耗 | 由睡眠恢復 |
| 健康 Health | 0–100 | 其他屬性過低會扣健康 | 健康為 0 視為生病，需特別道具/休息恢復 |

### 7.3 互動行為與效果
| 行為 | 圖示 | 數值變化 | 對應動畫 | 對應音效 |
|---|---|---|---|---|
| 餵食 Feed | 🍖 | 飢餓 +30 | 開心吃東西動畫 | `feed.mp3` |
| 玩耍 Play | 🎮 | 心情 +25，體力 -10 | 跳躍/搖擺動畫 | `play.mp3` |
| 清潔 Clean | 🧼 | 清潔 +40 | 泡泡特效動畫 | `clean.mp3` |
| 睡眠 Sleep | 😴 | 體力 +50（需等待計時） | 閉眼呼吸動畫 | `sleep.mp3`（含打呼音效迴圈） |
| 撫摸 Pet | ✋ | 心情 +10 | 瞇眼微笑動畫 | `pet-stroke.mp3` |
| 升級 Level Up | ⭐ | 成長階段提升 | 光芒特效 + 變身動畫 | `levelup.mp3` |
| 生病警示 | ⚠️ | — | 抖動/變色動畫 | `warning.mp3` |

### 7.4 自動存檔
每次互動行為結束、或每 30 秒，自動將遊戲狀態寫入 `localStorage`（詳見第12章）。

---

## 8. 說明頁面（Instructions）規格

### 8.1 設計原則
乾淨、圖示豐富、易閱讀。採用**分類 Tab + 卡片網格**排版，避免大段文字堆疊。

### 8.2 頁籤分類
```
[ 🎮 基本操作 ] [ 📊 狀態說明 ] [ 🌱 成長階段 ] [ 💡 小提醒 ]
```

### 8.3 卡片排版範例（每類別用 2~3 欄 Grid 卡片，圖示在上、簡短文字在下）
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│   🍖     │  │   🎮     │  │   🧼     │
│  餵食    │  │  玩耍    │  │  清潔    │
│ 提升飢餓度 │  │ 提升心情值 │  │ 提升清潔度 │
└──────────┘  └──────────┘  └──────────┘
```
- 每張卡片：大圖示（48px 以上）+ 一行標題（大字體）+ 一行簡述（不超過 15 字）。
- 「狀態說明」頁籤額外附上**色階對照表**（綠/黃/紅三色說明數值高低含義）。
- 「成長階段」頁籤用**橫向時間軸**圖示：🥚 → 🐣 → 🐥 → 🦅，並標示各階段所需條件。
- RWD：手機版卡片改為 1~2 欄，維持大字體與大圖示原則。

---

## 9. 設定頁面（Settings）規格

### 9.1 設定項目
| 項目 | UI 元件 | 說明 |
|---|---|---|
| 語言 | 三個選項按鈕：中文 / English / 日本語 | 即時切換，存入 `localStorage` |
| 視覺主題 | 5 個色塊選項（第5.2節） | 即時切換並預覽 |
| 背景音樂音量 BGM | 滑桿 0–100% | 控制使用者端再額外調整的比例（基於5倍放大後的基準，見第10章） |
| 音效音量 SFX | 滑桿 0–100% | 獨立於 BGM 控制 |
| 靜音總開關 | 開關 Toggle | 一鍵靜音全部聲音 |
| 字體大小 | 小/中/大 三段選項（可選功能） | 加碼放大內文字體 |
| 重置存檔 | 紅色按鈕 | 點擊後彈出二次確認 Modal，避免誤觸 |

### 9.2 音效對應
- 滑桿拖動時：即時試播一段 SFX 範例音，讓玩家聽到調整效果。
- 切換語言/主題：`click.mp3` + 介面文字淡入動畫。

---

## 10. 音樂與音效系統規格

### 10.1 AudioManager 架構設計
使用 **Web Audio API** 而非單純 `<audio>` 標籤，理由是需要精確控制音量倍數與淡入淡出：

```js
// js/audio/audioManager.js（示意）
window.VP = window.VP || {};
VP.AudioManager = (function () {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const bgmGain = ctx.createGain();
  const sfxGain = ctx.createGain();
  const compressor = ctx.createDynamicsCompressor(); // 防止音量過大爆音

  bgmGain.connect(compressor);
  sfxGain.connect(compressor);
  compressor.connect(ctx.destination);

  const BGM_BASE_MULTIPLIER = 5; // ★需求11：BGM 音量放大為原來的 5 倍

  function setBgmVolume(userPercent /* 0~1，使用者滑桿值 */) {
    // 基準音量 × 5 倍，再乘上使用者自訂比例，並夾在安全上限內
    const target = Math.min(userPercent * BGM_BASE_MULTIPLIER, 4); // 上限保護避免破音
    bgmGain.gain.setTargetAtTime(target, ctx.currentTime, 0.1);
  }

  return { ctx, bgmGain, sfxGain, setBgmVolume /* ...其餘播放函式 */ };
})();
```

> ⚠️ **重要技術備註（需求11說明）**：將 BGM 基準音量放大 5 倍，數值上會遠超過正常 0–1 的安全範圍，極易造成破音與使用者聽覺不適。規格上**仍保留** `DynamicsCompressorNode` 進行動態壓縮防爆音，並**保留使用者音量滑桿**作為最終把關（滑桿仍可調到接近 0），確保玩家可依自身需求調整，避免音量過大造成不適。此為效果規格與聽覺安全之間的折衷實作建議，正式上線前建議實機測試耳機/喇叭播放音量。

### 10.2 BGM 清單與播放邏輯
| 畫面 / 情境 | BGM 檔案 | 切換規則 |
|---|---|---|
| 主選單 | `main-menu.mp3` | 進入主選單播放，循環播放 |
| 遊戲中（心情良好） | `gameplay-happy.mp3` | 心情值 > 60 時播放 |
| 遊戲中（普通/低落） | `gameplay-normal.mp3` | 心情值 ≤ 60 時切換 |
| 說明頁面 | （沿用當前畫面的 BGM，不重新播放） | — |
| 設定頁面 | （沿用當前畫面的 BGM，不重新播放） | — |
| 升級/慶祝事件 | `ending.mp3`（短暫插播） | 播放完畢後自動恢復原 BGM |

**畫面切換音樂播放規則（重點需求）**：
1. 切換至「說明」或「設定」頁面時，**不停止、不重新播放**目前的 BGM（視為疊加在原畫面上的子頁面）。
2. 只有切換「主選單 ↔ 遊戲主畫面」這類**場景級**切換時，才會觸發 BGM 淡出（fade out 0.6s）→ 切歌 → 淡入（fade in 0.6s），避免聲音突然中斷的生硬感。
3. 同一首 BGM 不重複觸發播放（避免疊音），用 `currentTrackId` 旗標判斷。

### 10.3 SFX 清單與動作對照表（需求8：每個動作皆有對應音效）
| 動作 | 音效檔 |
|---|---|
| 按鈕點擊（通用） | `click.mp3` |
| 按鈕 hover（桌機） | `hover.mp3` |
| 餵食 | `feed.mp3` |
| 玩耍 | `play.mp3` |
| 清潔 | `clean.mp3` |
| 睡眠開始 / 打呼迴圈 | `sleep-start.mp3` / `sleep-loop.mp3` |
| 撫摸 | `pet-stroke.mp3` |
| 寵物成長/升級 | `levelup.mp3` |
| 寵物生病警示 | `warning.mp3` |
| 寵物孵化（蛋→幼體） | `hatch.mp3` |
| 語言切換 | `lang-switch.mp3` |
| 主題切換 | `theme-switch.mp3` |
| 存檔成功提示 | `save.mp3` |
| 開始新遊戲確認 | `confirm.mp3` |
| 錯誤/不可操作提示 | `error.mp3` |
| 進入主選單 | `menu-open.mp3` |

### 10.4 自動播放政策處理
首次點擊「開始遊戲」或「繼續遊戲」按鈕時，立即執行：
```js
VP.AudioManager.ctx.resume().then(() => {
  VP.AudioManager.playBgm('main-menu');
});
```
確保符合瀏覽器「需使用者互動後才能播放音訊」的政策。

---

## 11. 多國語系（i18n）規格

### 11.1 涵蓋範圍
主選單文字、遊戲內狀態名稱、操作按鈕、說明頁全部內容、設定頁全部內容、提示訊息（Toast/Modal）、寵物對話泡泡，**皆需支援三語**：繁體中文 / English / 日本語。

### 11.2 語言字典結構（範例 `lang-zh.js`）
```js
window.VP = window.VP || {};
VP.LANG_ZH = {
  menu: {
    start: "開始遊戲",
    continue: "繼續遊戲",
    instructions: "說明",
    settings: "設定"
  },
  status: {
    hunger: "飢餓",
    mood: "心情",
    clean: "清潔",
    energy: "體力",
    health: "健康"
  },
  actions: {
    feed: "餵食",
    play: "玩耍",
    clean: "清潔",
    sleep: "睡眠",
    pet: "撫摸"
  },
  messages: {
    noSaveFound: "尚無存檔",
    confirmReset: "確定要重置存檔嗎？此動作無法復原",
    saveSuccess: "存檔成功！"
  }
};
```
`lang-en.js`、`lang-ja.js` 採完全相同的 key 結構，僅替換對應翻譯文字。

### 11.3 切換機制
```js
VP.i18n.setLang('ja'); // 'zh' | 'en' | 'ja'
```
所有需要顯示文字的 DOM 元素加上 `data-i18n="menu.start"` 屬性，`i18n.js` 啟動時掃描全頁並套用對應文字，並寫入 `localStorage('vp_lang')` 記住玩家選擇，下次開啟自動套用。

---

## 12. 存檔系統規格

### 12.1 存檔資料結構（`localStorage` key: `vp_save`）
```json
{
  "version": "1.0",
  "petName": "小可可",
  "stage": "child",
  "stats": { "hunger": 80, "mood": 65, "clean": 90, "energy": 70, "health": 100 },
  "theme": "ocean",
  "lang": "zh",
  "bgmVolume": 0.6,
  "sfxVolume": 0.8,
  "lastSavedAt": 1750000000000
}
```

### 12.2 自動存檔時機
- 每次互動行為（餵食/玩耍/清潔等）結束後立即存檔。
- 每 30 秒定時自動存檔（防止瀏覽器意外關閉造成資料遺失）。
- 切換設定（語言/主題/音量）即時存檔。

### 12.3 離線時間計算
讀取存檔時，比對 `lastSavedAt` 與目前時間差，依離線時長換算各狀態值的衰減（例如離線 1 小時，飢餓度下降固定速率），避免玩家覺得「離開後寵物完全不會變化」。

---

## 13. 寵物系統設計

### 13.1 成長階段
| 階段 | 圖示 | 條件 |
|---|---|---|
| 🥚 蛋 Egg | 初始狀態 | 開始遊戲後第一階段 |
| 🐣 幼體 Baby | 經過固定時間或互動次數達標自動孵化 | 觸發 `hatch.mp3` |
| 🐥 成長期 Child | 累積經驗值達標 | 觸發 `levelup.mp3` |
| 🦅 成體 Adult | 累積經驗值達標 | 最終形態，外觀依心情/健康微調 |

### 13.2 表情/動畫狀態機
寵物動畫依「目前心情區間 + 目前動作」決定播放哪一張/組圖：
```
心情 > 70  → 開心表情組
心情 30~70 → 普通表情組
心情 < 30  → 沮喪表情組
（同時若 health < 30，疊加生病特效圖層）
```

---

## 14. 動畫與互動回饋規格

- 採用 **CSS Sprite Sheet + `steps()` animation** 或簡單的多張圖片輪播（避免引入額外動畫函式庫）。
- 每個互動行為動畫時長建議：0.6s ~ 1.2s，搭配對應音效同步觸發（音效與動畫開始時間誤差需 < 100ms）。
- 數值變化（如飢餓度條增加）需有平滑過渡動畫（CSS `transition: width 0.4s ease-out`），不要瞬間跳動。
- 重要事件（升級、生病）使用全螢幕短暫特效（光芒/閃爍），並暫停操作按鈕 1 秒避免重複觸發。

---

## 15. 無障礙與效能注意事項

- 支援 `prefers-reduced-motion`，偵測到使用者設定減少動態效果時，停用非必要的特效動畫。
- 所有圖示搭配 `alt` 文字或 `aria-label`，按鈕皆可用鍵盤 Tab 操作並有清楚的 focus 樣式。
- 配色對比度需符合 WCAG AA 標準（文字與背景對比度 ≥ 4.5:1），尤其暗夜主題需特別檢查。
- 圖片資源建議統一壓縮、使用 sprite sheet 減少檔案數量，加快本地開啟速度。

---

## 16. 測試與驗收標準（Checklist）

- [ ] 雙擊 `index.html` 即可直接遊玩，無需任何 server / build 指令
- [ ] 手機（< 576px）、平板、桌機三種尺寸下排版皆正常，無跑版、無重疊
- [ ] 全站文字最小字級 ≥ 16px，按鈕文字 ≥ 18px
- [ ] 設定頁可切換至少 5 種配色主題，切換即時生效並記憶
- [ ] CSS / JS 依本文件第3章資料夾結構分類，無單一巨型檔案
- [ ] 主畫面具備「開始遊戲、繼續遊戲、說明、設定」四項功能且邏輯正確（含無存檔時繼續遊戲按鈕disable）
- [ ] 主選單與遊戲中 BGM 不同，但切換「說明/設定」子頁面時 BGM 不中斷、不重播
- [ ] 行動裝置下操作按鈕不遮擋寵物舞台與狀態列
- [ ] 餵食、玩耍、清潔、睡眠、撫摸、升級、生病等每個動作皆有對應音效
- [ ] 語言可在中文 / English / 日本語間切換，所有頁面文字皆完整翻譯，無漏翻
- [ ] 說明頁面採圖示卡片式排版，分類清楚、易讀
- [ ] BGM 音量基準放大為原始的 5 倍，並透過壓縮器防止破音，使用者仍可透過滑桿自行調整最終音量
- [ ] 關閉瀏覽器後重新雙擊開啟，繼續遊戲可正確讀取上次進度

---

*文件結束。如需調整任一章節細節（例如新增寵物種類、新增配色主題、新增語言），請在此文件對應章節擴充規格後再進入實作。*
