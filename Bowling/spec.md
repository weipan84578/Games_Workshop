# 🎳 可愛風保齡球網頁遊戲 — 完整技術規格書

> 文件版本：v1.0
> 文件類型：產品 / 技術 / UI-UX 規格書
> 專案類型：純前端（Vanilla HTML / CSS / JavaScript），無需 Build、無需 Server
> 目標平台：桌機瀏覽器（Chrome / Edge / Firefox / Safari）＋ 行動裝置瀏覽器（iOS Safari / Android Chrome）

---

## 目錄

1. [專案總覽與核心原則](#1-專案總覽與核心原則)
2. [技術規格與執行方式](#2-技術規格與執行方式)
3. [專案資料夾結構](#3-專案資料夾結構)
4. [index.html 引入規範](#4-indexhtml-引入規範)
5. [RWD 響應式設計規格](#5-rwd-響應式設計規格)
6. [視覺設計規格（字體 / 配色 / 可愛風主題）](#6-視覺設計規格字體--配色--可愛風主題)
7. [主畫面（首頁）規格](#7-主畫面首頁規格)
8. [遊戲畫面規格](#8-遊戲畫面規格)
9. [說明頁面規格](#9-說明頁面規格)
10. [設定頁面規格](#10-設定頁面規格)
11. [多國語系規格（i18n）](#11-多國語系規格i18n)
12. [音效與 BGM 規格](#12-音效與-bgm-規格)
13. [動畫與效能優化規格](#13-動畫與效能優化規格)
14. [圖示與美術資源規格](#14-圖示與美術資源規格)
15. [存檔與進度系統（開始 / 繼續遊戲）](#15-存檔與進度系統開始--繼續遊戲)
16. [相容性與測試規格](#16-相容性與測試規格)
17. [需求對照表（Requirement Traceability）](#17-需求對照表requirement-traceability)

---

## 1. 專案總覽與核心原則

一款以「可愛風」為主視覺、支援多國語系、具備擬真物理效果的網頁版保齡球遊戲。核心設計原則如下：

| 原則 | 說明 |
|---|---|
| 零安裝 | 使用者只要拿到整個資料夾，雙擊 `index.html` 即可遊玩，不需 npm install、不需啟動任何 local server、不需編譯打包 |
| 純前端 | 100% Vanilla JavaScript（ES6+）+ HTML5 + CSS3，不依賴 React / Vue / Webpack 等需要建置流程的框架與工具鏈 |
| 模組化 | CSS 與 JS 依功能分資料夾管理，`index.html` 僅負責「引入」，不內嵌邏輯 |
| RWD 優先 | 桌機與行動裝置都要能流暢遊玩，任何 UI 元件都不可遮擋核心遊戲畫面 |
| 高可讀性 UI | 大字體、清楚對比、可愛圖示，降低操作與閱讀門檻 |
| 多語系 | 中文（繁體）、英文、日文三語系即時切換 |
| 高效能 | 60 FPS 為目標，動畫全程不卡頓 |

---

## 2. 技術規格與執行方式

### 2.1 技術棧

| 分類 | 使用技術 | 說明 |
|---|---|---|
| 標記語言 | HTML5 | 單一入口 `index.html` |
| 樣式 | CSS3（原生，含 CSS Variables / Flexbox / Grid / clamp()） | 不使用 SASS/LESS 等需編譯的預處理器，確保零 build |
| 邏輯 | JavaScript ES6+（原生模組 `<script type="module">`） | 使用瀏覽器原生 ES Module 語法直接以 `file://` 或雙擊開啟即可運作 |
| 2D 渲染 | HTML5 Canvas（2D Context） | 球道、球瓶、球體、拋物線軌跡動畫皆繪製於 Canvas |
| 3D（可選加強） | 若需擬真感更高，可用純 CSS 3D transform 模擬球道透視，不強制引入 Three.js（避免額外相依與載入延遲） |
| 音訊 | Web Audio API（`AudioContext` + `GainNode`） | 用於 BGM 循環播放、音量倍增控制、音效瞬間觸發 |
| 儲存 | `localStorage` | 儲存進度、設定（語言、音量、配色主題） |
| 相依套件 | 無任何外部 npm 套件、無 CDN 強制依賴（CDN 僅作為字體 fallback，且需提供本地字體備援） |

### 2.2 執行方式（必須滿足）

1. 使用者直接**雙擊 `index.html`**（`file://` 通訊協定），遊戲即可完整運作。
2. **不可**使用 `fetch()` 讀取本地 JSON／檔案（因為 `file://` 協定下瀏覽器會因 CORS 政策封鎖 fetch 本地檔案）。
   - ➜ **語言包、設定資料一律以 JS 檔案（`export const` 物件）方式引入**，而非 `.json` + `fetch`。
   - ➜ 音效／圖片資源使用相對路徑 `<img src="...">`、`new Audio("...")`，這類標籤在 `file://` 下可正常讀取，允許使用。
3. 不需 `npm install`、不需 `webpack/vite build`、不需啟動 `http-server`。
4. 專案內附一支可選的 `start.bat` / `start.sh`（僅為方便使用者，非必要），但**核心必須保證不启動任何 server 也能玩**。

---

## 3. 專案資料夾結構

```
bowling-game/
├── index.html                     # 唯一入口，只做資源引入與畫面容器
│
├── css/                            # 樣式總資料夾
│   ├── base/
│   │   ├── reset.css              # CSS Reset / Normalize
│   │   ├── variables.css          # CSS 變數：顏色主題、字級、間距
│   │   └── typography.css         # 字體規則（大字體、行高、字重）
│   ├── layout/
│   │   ├── grid.css               # RWD 版面骨架（Grid / Flex）
│   │   └── responsive.css         # 各斷點 media query 統一管理
│   ├── components/
│   │   ├── buttons.css            # 按鈕樣式（含可愛風按鈕、觸控按鍵）
│   │   ├── modal.css              # 彈窗（設定／說明用）
│   │   ├── hud.css                # 遊戲內 HUD（分數板、局數顯示）
│   │   ├── controls.css           # 行動裝置操作按鍵（搖桿/力道條/方向鍵）
│   │   └── loading.css            # 讀取畫面
│   ├── pages/
│   │   ├── main-menu.css          # 主畫面專屬樣式
│   │   ├── game.css               # 遊戲畫面專屬樣式
│   │   ├── instructions.css       # 說明頁面樣式
│   │   └── settings.css           # 設定頁面樣式
│   └── themes/
│       ├── theme-cute.css         # 可愛風主題（預設）
│       ├── theme-ocean.css        # 海洋藍主題
│       ├── theme-sunset.css       # 夕陽橘主題
│       ├── theme-forest.css       # 森林綠主題
│       └── theme-night.css        # 夜間深色主題
│
├── js/                              # 邏輯總資料夾
│   ├── main.js                     # 進入點，初始化各模組
│   ├── core/
│   │   ├── gameEngine.js          # 遊戲主迴圈（requestAnimationFrame）
│   │   ├── physics.js             # 球體滾動、瓶子碰撞、摩擦力運算
│   │   ├── scoring.js             # 保齡球計分規則（含 Strike/Spare 計算）
│   │   └── stateManager.js        # 畫面狀態機（主選單/遊戲中/暫停/結束）
│   ├── render/
│   │   ├── canvasRenderer.js      # Canvas 繪製（球道、球瓶、球）
│   │   ├── particleEffects.js     # 擊倒特效、彩帶、星星特效
│   │   └── cameraController.js    # 視角/擬真透視控制
│   ├── ui/
│   │   ├── mainMenu.js            # 主畫面互動邏輯
│   │   ├── instructionsPage.js    # 說明頁互動邏輯
│   │   ├── settingsPage.js        # 設定頁互動邏輯
│   │   ├── hud.js                 # 遊戲內 UI 更新
│   │   └── touchControls.js       # 行動裝置觸控/搖桿邏輯
│   ├── audio/
│   │   ├── audioManager.js        # BGM/音效播放、音量控制（含10倍增益邏輯）
│   │   └── soundLibrary.js        # 音效清單與對應檔案路徑
│   ├── i18n/
│   │   ├── i18n.js                # 語系切換引擎
│   │   ├── lang-zh.js             # 繁體中文語言包
│   │   ├── lang-en.js             # 英文語言包
│   │   └── lang-ja.js             # 日文語言包
│   └── utils/
│       ├── storage.js             # localStorage 存取封裝
│       ├── helpers.js             # 共用工具函式
│       └── constants.js           # 遊戲常數（球道長度、瓶位座標等）
│
├── assets/
│   ├── images/
│   │   ├── icons/                 # 可愛風 icon（按鈕、UI 圖示，SVG 為主）
│   │   ├── backgrounds/           # 主畫面／各頁背景圖
│   │   ├── characters/            # 吉祥物角色（保齡球熊、球瓶精靈等）
│   │   └── sprites/                # 遊戲內物件貼圖（球、瓶、特效）
│   ├── audio/
│   │   ├── bgm/                   # 多首鋼琴輕快 BGM（mp3/ogg）
│   │   │   ├── bgm-piano-01.mp3
│   │   │   ├── bgm-piano-02.mp3
│   │   │   ├── bgm-piano-03.mp3
│   │   │   └── bgm-piano-04.mp3
│   │   └── sfx/                   # 高音輕脆音效
│   │       ├── sfx-button-click.mp3
│   │       ├── sfx-pin-hit.mp3
│   │       ├── sfx-strike.mp3
│   │       ├── sfx-spare.mp3
│   │       └── sfx-ball-roll.mp3
│   └── fonts/
│       └── (本地備援字體檔 .woff2)
│
├── data/
│   └── (若有需要的靜態設定資料，一律以 .js 檔輸出，不用 .json + fetch)
│
└── .gitignore
```

> ⚠️ **重要規則**：不建立 `README.md`。待整體遊戲開發完成後才會另行生成說明文件，目前僅提供本規格書作為開發依據。

---

## 4. index.html 引入規範

`index.html` 只負責「容器」與「引入」，不得內嵌 `<style>` 或大量 inline `<script>` 邏輯。範例骨架：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>可愛保齡球 Cute Bowling</title>

  <!-- CSS 引入順序：base -> layout -> components -> pages -> themes -->
  <link rel="stylesheet" href="css/base/reset.css" />
  <link rel="stylesheet" href="css/base/variables.css" />
  <link rel="stylesheet" href="css/base/typography.css" />
  <link rel="stylesheet" href="css/layout/grid.css" />
  <link rel="stylesheet" href="css/layout/responsive.css" />
  <link rel="stylesheet" href="css/components/buttons.css" />
  <link rel="stylesheet" href="css/components/modal.css" />
  <link rel="stylesheet" href="css/components/hud.css" />
  <link rel="stylesheet" href="css/components/controls.css" />
  <link rel="stylesheet" href="css/components/loading.css" />
  <link rel="stylesheet" href="css/pages/main-menu.css" />
  <link rel="stylesheet" href="css/pages/game.css" />
  <link rel="stylesheet" href="css/pages/instructions.css" />
  <link rel="stylesheet" href="css/pages/settings.css" />
  <link rel="stylesheet" href="css/themes/theme-cute.css" id="theme-style" />
</head>
<body>
  <div id="app">
    <!-- 各畫面（主選單/遊戲/說明/設定）以 section 容器呈現，由 stateManager.js 控制顯示/隱藏 -->
    <section id="screen-main-menu" class="screen active"></section>
    <section id="screen-game" class="screen"></section>
    <section id="screen-instructions" class="screen"></section>
    <section id="screen-settings" class="screen"></section>
  </div>

  <!-- JS 一律使用 type="module"，由 main.js 統一 import 其餘模組 -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

**規則重點：**
- CSS 依「base → layout → components → pages → themes」順序引入，確保 cascade 正確、避免覆蓋錯亂。
- JS 只在 `<body>` 尾端引入一支 `main.js`（`type="module"`），其餘模組全部由 `main.js` 內部以 `import` 語法串接，維持單一進入點。
- 不在 `index.html` 內寫任何遊戲邏輯或樣式，確保結構乾淨、好維護。

---

## 5. RWD 響應式設計規格

### 5.1 斷點定義

| 裝置類型 | 寬度範圍 | 說明 |
|---|---|---|
| 手機直式 | ≤ 480px | 操作按鍵移至畫面下方安全區，遊戲畫面置頂並自動縮放 |
| 手機橫式 / 小平板 | 481px – 768px | 操作按鍵移至畫面左右兩側（不遮擋中央球道） |
| 平板 | 769px – 1024px | 保留桌機版配置，按鍵縮小但保持易點擊尺寸 |
| 桌機 | ≥ 1025px | 完整版面，滑鼠 / 鍵盤 / 觸控皆可操作 |

### 5.2 核心 RWD 原則（對應需求 2 / 8）

1. **遊戲畫面（Canvas）永遠置中並維持球道長寬比**，以 `aspect-ratio` + `clamp()` 動態縮放，不因裝置改變而變形。
2. **操作 UI 一律採用「懸浮於安全區（Safe Area）」設計**：
   - 手機直式：力道拉桿／發球鈕固定於畫面**最底部 15% 區域**（半透明浮層），不疊加在球道與球瓶上方。
   - 手機橫式：方向控制置於**左下角**、發球鈕置於**右下角**，中央保留淨空區域顯示完整球道。
   - 使用 `env(safe-area-inset-bottom)` 處理 iPhone 瀏海／手勢列遮擋問題。
3. 所有可點擊區域（按鈕、圖示）最小尺寸 **44x44px**（符合行動裝置觸控標準），字體最小 **16px** 起跳。
4. 使用 CSS Grid + Flexbox 混合排版，不使用絕對寫死的 px 版面，改用 `%`、`vw/vh`、`clamp()`。
5. 橫向/直向切換時（`orientationchange`）即時重新計算 Canvas 尺寸，並重新排列 HUD 位置，避免計分板蓋住球瓶。
6. HUD（分數板）採用**半透明圓角卡片**，固定於畫面頂部，高度不超過螢幕 12%，避免壓縮遊戲可視空間。

### 5.3 RWD 版面示意（文字描述）

```
【桌機版】                          【手機直式版】
┌─────────────────────────┐      ┌───────────────┐
│      HUD 分數板(頂部)     │      │  HUD 分數板    │
│                           │      │               │
│                           │      │   遊戲球道     │
│      遊戲球道(置中)        │      │   (置中滿版)   │
│                           │      │               │
│  ←方向鍵      力道條→      │      │───────────────│
│                           │      │ 力道拉桿(浮層)  │
└─────────────────────────┘      │ 發球鍵(浮層)    │
                                   └───────────────┘
```

---

## 6. 視覺設計規格（字體 / 配色 / 可愛風主題）

### 6.1 字體規格（對應需求 3）

| 項目 | 規格 |
|---|---|
| 中文字體 | 「Baloo 2」「粉圓體 (Chenyu Luoyan / VT323 備援)」或「Taipei Sans TC Beta」等圓潤可愛字體，本地 `.woff2` 備援 |
| 英/日文字體 | 「Fredoka」「M PLUS Rounded 1c」（日文可愛圓體） |
| 基礎字級 | 全站最小字體 `18px`，內文標準 `20px`，強調文字 `24px`，標題 `32px～48px`（使用 `clamp()` 依裝置自動縮放） |
| 字重 | 內文使用 `600`（Semi-Bold）以上，確保清晰度；標題使用 `800`（Extra-Bold） |
| 行高 | 內文 `1.6`，標題 `1.3`，確保閱讀舒適 |
| 對比 | 文字與背景對比度需達 WCAG AA 標準（對比比例 ≥ 4.5:1），避免淺色字疊淺色底 |

### 6.2 配色主題系統（對應需求 3 / 11）

提供 **5 種可切換配色主題**，於「設定」頁面選擇，即時套用（透過切換 `theme-*.css` 或 CSS Variables root class）：

| 主題名稱 | 主色 | 輔色 | 強調色 | 風格說明 |
|---|---|---|---|---|
| 🌸 可愛粉彩（預設） | `#FFB6D9` 粉紅 | `#FFF3B0` 奶油黃 | `#B8E8FC` 天空藍 | 大量愛心、星星、雲朵圖案，圓潤卡通風 |
| 🌊 海洋藍調 | `#5DC1E8` | `#DFF6FF` | `#FFD972` | 海浪、貝殼、海豚裝飾 |
| 🌅 夕陽橘蜜 | `#FF9E6D` | `#FFE3C2` | `#7C4DFF` | 溫暖漸層、雲朵剪影 |
| 🌲 森林綠意 | `#7FC97F` | `#EAF7E5` | `#FFB84C` | 樹葉、小動物點綴 |
| 🌙 夜間柔光 | `#2E2A4A`（底） | `#4E4A75` | `#FFD76A` | 深色背景搭配霓虹柔光按鈕，適合夜間使用不刺眼 |

**配色原則（對應需求 11）：**
- 每個主題都需事先檢查「文字色 vs 背景色」對比是否足夠，杜絕「白字白底」「淺色字疊淺色圖」問題。
- 按鈕一律具備：底色 + 深色文字（或反轉）+ 陰影/邊框，確保在任何背景下都清楚可辨識。
- 使用 CSS Variables 集中管理色票（定義於 `variables.css`），各主題檔案只需覆寫變數值即可，維護成本低。

```css
/* variables.css 範例 */
:root {
  --color-primary: #FFB6D9;
  --color-secondary: #FFF3B0;
  --color-accent: #B8E8FC;
  --color-text: #4A3B4A;
  --color-text-inverse: #FFFFFF;
  --color-bg: #FFF9FB;
  --font-size-base: 18px;
  --radius-round: 24px;
  --shadow-cute: 0 6px 0 rgba(0,0,0,0.12);
}
```

### 6.3 可愛風主題視覺元素（對應需求 3 / 17）

- 大量圓角（`border-radius: 24px～50%`），按鈕做成「果凍感」立體按壓效果（`:active` 時下沉 + 陰影縮小）。
- 吉祥物角色：**保齡球熊「波波」** 與 **球瓶精靈「平平」** 貫穿全遊戲（主畫面歡迎語、說明頁導覽、遊戲內加油動畫、結束畫面慶祝動畫）。
- 裝飾圖示：愛心、星星、彩虹、雲朵、彩帶、汽球，大量運用於背景與過場動畫（低透明度、不干擾主要內容閱讀）。
- 按鈕圖示化：所有主要功能鈕皆搭配對應可愛 icon（▶️開始=波波比讚、⚙️設定=平平拿螺絲起子、📖說明=波波拿書）。

---

## 7. 主畫面（首頁）規格

### 7.1 功能項目（對應需求 5 / 14）

主畫面**僅包含 4 個核心按鈕**，版面簡潔乾淨，不放置任何可調整設定的元件（音量、語言等一律收在「設定」頁內）：

```
┌─────────────────────────────┐
│        🎳 遊戲 Logo            │
│      （波波與平平吉祥物插圖）    │
│                               │
│         [▶ 開始遊戲]           │
│         [⏸ 繼續遊戲]           │  ← 無存檔時此鈕呈灰階不可點擊，並提示「尚無進度」
│         [📖 遊戲說明]           │
│         [⚙️ 設定]              │
│                               │
│   背景：可愛球道插圖 + 飄動雲朵動畫  │
└─────────────────────────────┘
```

### 7.2 規則

1. 「繼續遊戲」按鈕僅在 `localStorage` 存在有效存檔時才可點擊，否則以低飽和度顯示並附小提示文字「目前尚無遊戲進度」。
2. 主畫面背景使用**輕微飄動的雲朵 / 彩帶 CSS 動畫**（`@keyframes float`），營造生氣但不喧賓奪主。
3. 語言切換不放在主畫面（保持乾淨），但提供一個小型「地球儀圖示」置於畫面右上角角落作為**快速語言切換捷徑**（非必要設定項，屬全域可用的語言選單，符合「不要有可以設定的選項」原則 — 此為語言顯示切換而非遊戲玩法設定）。
4. 進入主畫面時淡入播放歡迎音效與其中一首鋼琴 BGM。
5. Logo 與按鈕採垂直置中版面，於手機版自動縮小間距但維持大字體、大按鈕。

---

## 8. 遊戲畫面規格

### 8.1 版面配置

```
┌───────────────────────────────────────┐
│  HUD：局數 / 目前得分 / 總分 / 暫停鍵      │  ← 頂部固定，半透明卡片
├───────────────────────────────────────┤
│                                         │
│              擬真球道視角                │
│         （透視效果，球瓶排列於遠方）        │
│                                         │
│                🎳🎳🎳                   │
│               🎳🎳🎳🎳                  │
│              🎳🎳🎳🎳🎳                 │
│                                         │
│                 🔴（球）                │
├───────────────────────────────────────┤
│   左右方向調整      力道拉桿     發球鍵     │  ← 底部懸浮控制列（不遮擋球道）
└───────────────────────────────────────┘
```

### 8.2 操作方式（對應需求 8 / 13 / 15）

| 平台 | 操作方式 |
|---|---|
| 桌機 | 滑鼠拖曳調整拋球角度 → 按住蓄力（力量條）→ 放開發球；亦支援方向鍵 + 空白鍵 |
| 觸控（手機/平板） | 左右滑動調整角度、下方力道拉桿長按蓄力、鬆開發球；控制列固定於安全區，半透明不遮擋主畫面 |

### 8.3 擬真度規格（對應需求 13）

- 球道具備**透視延伸感**（近大遠小），使用 CSS 3D transform 或 Canvas 透視繪製函式模擬縱深。
- 球瓶倒下具備**物理慣性動畫**：連鎖碰撞、旋轉倒地、滑出球道邊緣，而非單純淡出消失。
- 保齡球滾動時具**微旋轉貼圖動畫 + 拖曳軌跡光暈**，落地時有輕微彈跳感（模擬球道摩擦力與球體重量）。
- 加入環境細節：球道木紋紋理、犯規線紅燈提示、球瓶架升降動畫、觀眾席剪影（弱化不搶焦）。
- 光影：球道加入淡淡的高光反射（漸層模擬拋光木地板質感），提升真實感但仍保持整體可愛卡通調性（Q版擬真，非寫實）。

### 8.4 計分規則

- 完整實作標準十局保齡球計分制（Strike、Spare、記分疊加規則、第十局補球規則）。
- HUD 分數板即時顯示每一局的兩球結果格與加總分數，格式參考正式保齡球計分表（10 格）。
- 每次 Strike / Spare 觸發專屬慶祝動畫與音效（見第 12 節）。

### 8.5 暫停與選單

- 遊戲中右上角「⏸ 暫停」按鈕，點擊後彈出模糊遮罩 + 選單卡片：「繼續」「回主畫面」「重新開始」「設定」。
- 暫停選單不可被行動裝置控制列遮擋，需置中顯示並高於所有 UI 層級（z-index 最高）。

---

## 9. 說明頁面規格

### 9.1 內容架構（對應需求 10）

說明頁面採**分區塊卡片式排版**，搭配大量插圖圖示，並可左右滑動 / 分頁瀏覽，避免長篇文字牆：

1. **基本操作**：圖解「如何瞄準」「如何蓄力」「如何發球」（三張步驟插圖，配波波動作示範）
2. **計分規則圖解**：
   - 全倒（Strike ✨）：圖示 + 加分規則說明
   - 補中（Spare ➕）：圖示 + 加分規則說明
   - 一般得分：圖示說明每格得分方式
   - 第十局特殊規則：圖解補球機制
3. **遊戲模式介紹**：單人模式操作重點
4. **控制方式對照表**：桌機 vs 行動裝置操作方式並列圖示
5. **小提醒 Tips**：波波跳出的可愛對話框小提示（例如「蓄力太滿球會太用力歪掉唷！」）

### 9.2 排版規則

- 每個段落標題搭配對應可愛 icon（🎯瞄準、💪蓄力、🎳發球、✨全倒、➕補中）。
- 內文字體維持大字體（≥18px），段落簡短（每段不超過 3 行），多用條列與圖示取代長文字敘述。
- 頁面可依當前選擇語言（中/英/日）即時切換全部圖文說明。
- 提供「返回主畫面」大按鈕，固定於頁面底部或頂部，方便隨時離開。
- 手機版採單欄捲動 + 章節錨點導覽（頂部可快速跳至「操作」「計分」「模式」章節）。

---

## 10. 設定頁面規格

### 10.1 設定項目（對應需求 12 / 14）

| 分類 | 項目 | 元件形式 |
|---|---|---|
| 語言 | 中文 / English / 日本語 | 三顆並排的可愛卡片式按鈕（附國旗/語系圖示），點擊即切換並高亮當前選項 |
| 配色主題 | 可愛粉彩 / 海洋藍調 / 夕陽橘蜜 / 森林綠意 / 夜間柔光 | 圓形色票選擇器，點擊即時預覽套用 |
| BGM 音量 | 0–100% 拉桿 | 圓潤造型 Slider，附🎵圖示與百分比數字顯示 |
| 音效音量 | 0–100% 拉桿 | 同上，附🔔圖示 |
| 震動回饋（行動裝置） | 開/關 | 可愛造型 Toggle 開關 |
| 操作方式偏好 | 拖曳 / 按鍵 | 二選一卡片式選項（僅桌機顯示） |

### 10.2 版面規則

- 設定頁採**單欄清單卡片排版**，每一項設定獨立一張圓角卡片，卡片間距充足、不擁擠。
- 所有滑桿（Slider）與開關（Toggle）需自訂樣式，統一走可愛圓潤風格（非瀏覽器預設醜陋樣式）。
- 頁面上方提供「返回」按鈕，下方提供「重設為預設值」次要按鈕（灰階、不搶視覺焦點）。
- 設定變更即時生效並自動寫入 `localStorage`，不需額外「儲存」按鈕，避免操作負擔。

---

## 11. 多國語系規格（i18n）

### 11.1 支援語言

- 繁體中文（`zh`）— 預設
- 英文（`en`）
- 日文（`ja`）

### 11.2 實作方式

由於本專案不能使用 `fetch` 讀取 `.json`（`file://` 限制），語言包一律以 **JS 模組物件**形式提供：

```js
// js/i18n/lang-zh.js
export default {
  menu_start: "開始遊戲",
  menu_continue: "繼續遊戲",
  menu_instructions: "遊戲說明",
  menu_settings: "設定",
  game_score: "得分",
  game_frame: "第 {n} 局",
  result_strike: "全倒！",
  result_spare: "補中！",
  // ...其餘所有 UI 文字 key
};
```

```js
// js/i18n/i18n.js
import zh from './lang-zh.js';
import en from './lang-en.js';
import ja from './lang-ja.js';

const dictionaries = { zh, en, ja };
let currentLang = localStorage.getItem('lang') || 'zh';

export function t(key, params = {}) {
  let text = dictionaries[currentLang][key] || key;
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.dispatchEvent(new CustomEvent('language-changed'));
}
```

### 11.3 規則

- 所有畫面文字（按鈕、HUD、說明、設定選項、彈窗訊息）皆須透過 `t('key')` 取值，**嚴禁在 HTML/JS 中寫死中文/英文字串**。
- 語言切換即時生效，無需重新整理頁面（監聽 `language-changed` 事件，重新渲染畫面文字節點）。
- 日文語言包需特別注意換行與字距（日文字元較寬，UI 需預留彈性空間，使用 `clamp()`／`min-width` 避免按鈕文字溢出）。
- 數字、局數等格式（如「第 3 局」/ "Frame 3" / "3フレーム目"）需各自在對應語言包內處理正確語序。

---

## 12. 音效與 BGM 規格

### 12.1 BGM 規格（對應需求 6）

| 項目 | 規格 |
|---|---|
| 曲風 | 多首**輕快鋼琴**風格背景音樂（Casual / Cute Piano BGM），節奏明亮、無歌詞 |
| 數量 | 至少 **4 首**，於主畫面、遊戲中隨機或循環輪播播放，避免單曲循環的重複感 |
| 格式 | `.mp3`（主）+ `.ogg`（備援，提升瀏覽器相容性） |
| 播放邏輯 | 進入主畫面淡入播放；進入遊戲畫面可無縫接續或切換至遊戲專屬版本；離開時淡出 |
| 檔案位置 | `assets/audio/bgm/` |

### 12.2 音效規格（對應需求 6）

| 音效 | 音色特質 | 觸發時機 |
|---|---|---|
| 按鈕點擊 | 高音、清脆、短促（如「叮♪」） | 所有按鈕互動 |
| 球瓶倒下 | 清亮碰撞聲（木質高音敲擊感，非低沉重擊） | 每次球瓶被擊倒 |
| 全倒 Strike | 明亮上揚音效 + 歡呼小音效 | 觸發 Strike 時 |
| 補中 Spare | 清脆雙音上揚 | 觸發 Spare 時 |
| 球體滾動 | 輕快滾動聲（音量隨速度變化） | 球體移動中 |
| 選單切換 | 短促高音「咻」 | 頁面切換 |

### 12.3 音量倍增規則（對應需求 7 — 重要技術規格）

> 「遊戲中的 BGM 音量都放大為原來的 10 倍」— 此需求在技術上以 **Web Audio API 的 GainNode 增益倍數** 實作，設計如下：

```js
// js/audio/audioManager.js（節錄）
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 基礎音量（使用者於設定頁調整的 0~1 拉桿值）
let userBgmVolume = 0.5;

// 遊戲需求：遊戲中 BGM 音量為基礎值的 10 倍增益
const GAME_BGM_GAIN_MULTIPLIER = 10;

const bgmGainNode = audioCtx.createGain();

// 為避免 10 倍增益造成爆音（clipping）或對使用者聽力/裝置喇叭造成負擔，
// 一律加上「安全上限」與「限幅器（Limiter）」：
// 1. 實際輸出增益 = min(userBgmVolume * 10, MAX_SAFE_GAIN)
// 2. 串接 DynamicsCompressorNode 作為軟限幅，避免破音
const MAX_SAFE_GAIN = 3.0; // 依實測校正，避免爆音同時仍明顯感受到「放大」效果

function applyGameBgmVolume() {
  const targetGain = Math.min(userBgmVolume * GAME_BGM_GAIN_MULTIPLIER, MAX_SAFE_GAIN);
  bgmGainNode.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.05);
}

const compressor = audioCtx.createDynamicsCompressor();
bgmGainNode.connect(compressor).connect(audioCtx.destination);
```

**設計說明：**
- 「10 倍」以**增益倍數（gain multiplier）**方式實作於進入遊戲畫面時套用，確保遊戲內 BGM 明顯比主畫面／說明／設定頁的 BGM 更具存在感、更熱鬧。
- 為了裝置安全與使用者聽力保護，增益疊加後統一經過 **`DynamicsCompressorNode`（動態壓縮限幅器）** 處理，避免原始音訊在 10 倍增益下產生破音或音量爆表，此為業界標準做法，**不影響「音量放大 10 倍」的需求本質**，只是確保放大後仍是悅耳而非刺耳/失真的聲音。
- 使用者於「設定」頁調整的 BGM 音量拉桿為**基礎值**，遊戲內一律在此基礎上乘以 10 倍增益後輸出。
- 離開遊戲畫面（回主畫面/說明/設定）時，增益立即以 `setTargetAtTime` 平滑過渡回一般倍數，避免突兀音量落差。

---

## 13. 動畫與效能優化規格

### 13.1 效能目標（對應需求 15）

- 遊戲主迴圈以 `requestAnimationFrame` 驅動，目標穩定 **60 FPS**。
- Canvas 繪製採**分層策略**：靜態背景（球道、觀眾席）繪製於獨立 layer 並快取，僅動態物件（球、瓶、特效）每幀重繪，減少重複運算。
- 物理運算（`physics.js`）與渲染（`canvasRenderer.js`）邏輯分離，避免單一函式過度肥大拖慢渲染。
- 圖片資源使用 **Sprite Sheet（雪碧圖）** 整合小圖示，減少 HTTP/DOM 資源請求數量。
- 音效使用**預先解碼（`AudioBuffer` 預載）**，避免播放當下才載入造成延遲卡頓。
- 行動裝置降級策略：偵測裝置效能較弱時（如低階手機），自動降低粒子特效數量、關閉高精度陰影，確保操作流暢優先於畫面精緻度。

### 13.2 轉場動畫

- 所有頁面切換使用 CSS `transition`（`opacity` + `transform`），時長 200–350ms，避免生硬跳動。
- 按鈕互動具備 `hover`（桌機）與 `active`（觸控按壓）微動畫回饋，提升操作手感。

---

## 14. 圖示與美術資源規格

### 14.1 圖示規範（對應需求 17）

- 全站圖示統一使用 **SVG 向量格式**（保證任何解析度下都清晰不模糊，符合 RWD 需求）。
- 風格統一為**圓潤線條 + 飽和馬卡龍色系**填色，避免尖銳硬邊，維持「可愛」調性。
- 每個功能都需搭配專屬圖示，禁止使用純文字按鈕（除非搭配圖示輔助）：
  - ▶️ 開始遊戲、⏸ 繼續遊戲、📖 說明、⚙️ 設定、🔊 音量、🌐 語言、🏠 回首頁、🔄 重來、✨ Strike、➕ Spare。
- 吉祥物角色（波波熊、平平球瓶精靈）需具備多種表情/動作插圖：待機、比讚、驚訝、慶祝、揮手引導，用於不同互動情境提升趣味性。

### 14.2 圖示資源存放

- 所有 icon 統一置於 `assets/images/icons/`，並以語意化命名（例如 `icon-start.svg`、`icon-settings.svg`），方便 CSS/JS 引用維護。

---

## 15. 存檔與進度系統（開始 / 繼續遊戲）

- 使用 `localStorage` 儲存當前遊戲進度物件，包含：目前局數、每格得分紀錄、目前使用主題與語言設定。
- 「開始遊戲」：清空進度，建立新的一局遊戲。
- 「繼續遊戲」：讀取 `localStorage` 中的進度物件並還原至遊戲畫面對應狀態；若資料損毀或不存在，按鈕自動轉為不可點擊狀態並顯示提示文字。
- 每完成一次投球自動寫入進度（Auto-save），避免使用者中途關閉分頁遺失資料。

```js
// js/utils/storage.js（節錄）
const SAVE_KEY = 'bowling_save_v1';

export function saveProgress(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadProgress() {
  const raw = localStorage.getItem(SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function hasSavedProgress() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function clearProgress() {
  localStorage.removeItem(SAVE_KEY);
}
```

---

## 16. 相容性與測試規格

| 測試項目 | 標準 |
|---|---|
| 瀏覽器相容性 | Chrome / Edge / Safari / Firefox 最新兩個大版本 |
| 行動裝置測試 | iOS Safari（iPhone SE ~ Pro Max 各尺寸）、Android Chrome（常見中低階與高階機型） |
| 離線可用性 | 全程不需網路連線（除字體 CDN fallback，需提供本地字體避免無網路時排版跑掉） |
| `file://` 開啟測試 | 直接雙擊 `index.html` 必須可完整運作，不出現 CORS 錯誤或空白畫面 |
| 螢幕方向切換 | 直式/橫式切換時 UI 不錯位、不遮擋 |
| 無障礙檢查 | 文字對比度 AA 標準、按鈕可用鍵盤 Tab 操作、圖示皆有替代文字（`alt`/`aria-label`） |
| 效能測試 | 中階手機下遊戲全程維持 ≥ 30 FPS，桌機維持 60 FPS |

---

## 17. 需求對照表（Requirement Traceability）

| # | 使用者需求 | 對應章節 |
|---|---|---|
| 1 | 純前端、雙擊 index.html 即可玩，無需 build/server | 第 2、4 章 |
| 2 | RWD 適配行動裝置與網頁，不遮擋遊戲畫面 | 第 5 章 |
| 3 | 大字體明確、多種配色、可愛風主題 | 第 6 章 |
| 4 | CSS/JS 分類到各資料夾，index 用引入方式 | 第 3、4 章 |
| 5 | 主畫面：開始/繼續/說明/設定 | 第 7 章 |
| 6 | BGM 多首輕快鋼琴、音效高音輕脆 | 第 12 章 |
| 7 | 遊戲中 BGM 音量放大 10 倍 | 第 12.3 節 |
| 8 | RWD 行動按鍵不擋遊戲畫面 | 第 5.2、8.2 節 |
| 9 | 多國語系（日/英/中） | 第 11 章 |
| 10 | 說明頁乾淨、圖示豐富、詳細 | 第 9 章 |
| 11 | 畫面豐富有趣、配色優化無視覺瑕疵 | 第 6.2、6.3 節 |
| 12 | 設定頁排版乾淨簡單、選項好看 | 第 10 章 |
| 13 | 畫面擬真、豐富現實感 | 第 8.3 節 |
| 14 | 主畫面簡潔、不含設定選項 | 第 7 章 |
| 15 | 動作流暢不卡頓 | 第 13 章 |
| 16 | 不產生 README.md | 全文件遵守（僅產出本規格書） |
| 17 | 圖示可愛有趣 | 第 14 章 |

---

## 附錄：CSS Variables 命名慣例速查

```
--color-primary / --color-secondary / --color-accent
--color-text / --color-text-inverse / --color-bg
--font-size-sm / --font-size-base / --font-size-lg / --font-size-xl
--radius-sm / --radius-md / --radius-round
--shadow-cute / --shadow-modal
--spacing-xs / --spacing-sm / --spacing-md / --spacing-lg
--z-hud / --z-modal / --z-controls
```

---

*本文件為開發前規格依據，實際開發時如遇技術限制可依此文件精神彈性調整實作細節，但需維持所有需求的核心體驗目標不變。*
