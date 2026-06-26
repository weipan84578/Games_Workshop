# 🏗️ Stack Tower（堆疊高塔）— 完整遊戲規格書

> **版本**：v1.0.0 ｜ **最後更新**：2025 ｜ **類型**：純前端無盡模式休閒遊戲

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [目錄結構](#3-目錄結構)
4. [響應式設計（RWD）](#4-響應式設計rwd)
5. [多國語系（i18n）](#5-多國語系i18n)
6. [視覺設計規範](#6-視覺設計規範)
7. [音效與音樂規範](#7-音效與音樂規範)
8. [頁面規格](#8-頁面規格)
9. [遊戲核心邏輯](#9-遊戲核心邏輯)
10. [資料儲存規範](#10-資料儲存規範)
11. [效能規範](#11-效能規範)
12. [無障礙規範](#12-無障礙規範)
13. [錯誤處理](#13-錯誤處理)
14. [測試規範](#14-測試規範)

---

## 1. 專案概述

### 1.1 遊戲簡介

Stack Tower 是一款經典的堆疊積木遊戲，玩家須精準點擊或按空白鍵，讓移動中的方塊對齊下方的基座，堆疊出最高的塔。方塊每次未對齊的部分會被切除，塔越堆越窄，直到方塊完全錯位後遊戲結束。

### 1.2 目標平台

| 平台 | 支援方式 |
|------|----------|
| 桌面瀏覽器 | Chrome 90+、Firefox 88+、Safari 14+、Edge 90+ |
| 行動裝置 | iOS Safari 14+、Android Chrome 90+ |
| 啟動方式 | 直接雙擊 `index.html`，無須 build 或 server |

### 1.3 遊戲模式

目前版本僅提供 **無盡模式（Endless Mode）**：
- 遊戲無時間限制
- 方塊越堆越多，移動速度逐漸加快
- 遊戲結束後記錄最高分至排行榜

---

## 2. 技術架構

### 2.1 技術選型

| 類別 | 技術 | 說明 |
|------|------|------|
| 渲染引擎 | HTML5 Canvas 2D API | 無需框架，原生高效 |
| 語言 | Vanilla JavaScript（ES6+） | 無任何外部 JS 框架依賴 |
| 樣式 | CSS3（Custom Properties） | 模組化 CSS 變數設計 |
| 音效 | Web Audio API | 純前端動態生成音效 |
| 儲存 | LocalStorage | 儲存分數、設定、排行榜 |
| 字體 | Google Fonts（CDN） | Noto Sans TC / JP / KR |

### 2.2 設計原則

- 純靜態前端，無後端依賴
- 零 npm 依賴，零 build 流程
- 所有資源可離線運作（字體除外，可 fallback）
- 模組化 CSS + JS，分資料夾管理
- `index.html` 透過 `<link>` 和 `<script>` 引入所有資源

---

## 3. 目錄結構

```
stack-tower/
│
├── index.html                  # 主入口，僅負責引入資源
│
├── assets/
│   ├── fonts/                  # 本地字體備份（選用）
│   └── images/
│       ├── icons/              # UI 圖示（SVG）
│       └── backgrounds/        # 背景圖片
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（色彩、字體、間距）
│   │   └── typography.css      # 全域字體設定
│   │
│   ├── layout/
│   │   ├── app.css             # 整體 App 容器佈局
│   │   └── responsive.css      # 媒體查詢 / RWD 規則
│   │
│   ├── components/
│   │   ├── button.css          # 按鈕元件
│   │   ├── modal.css           # 彈窗元件
│   │   ├── slider.css          # 音量滑桿元件
│   │   ├── toggle.css          # 開關元件
│   │   ├── scoreboard.css      # 排行榜元件
│   │   └── toast.css           # 通知提示元件
│   │
│   └── screens/
│       ├── main-menu.css       # 主選單畫面
│       ├── game.css            # 遊戲畫面（Canvas 容器、HUD）
│       ├── instructions.css    # 說明頁面
│       ├── settings.css        # 設定頁面
│       └── leaderboard.css     # 排行榜頁面
│
├── js/
│   ├── core/
│   │   ├── game.js             # 遊戲主迴圈、狀態機
│   │   ├── block.js            # 方塊物件（移動、切割、渲染）
│   │   ├── tower.js            # 高塔物件（堆疊、相機控制）
│   │   ├── physics.js          # 碰撞、切割邏輯
│   │   └── renderer.js         # Canvas 渲染器（畫面、視差、特效）
│   │
│   ├── audio/
│   │   ├── bgm.js              # BGM 生成（Web Audio API 鋼琴音）
│   │   └── sfx.js              # 音效生成（堆疊、失敗、完美）
│   │
│   ├── ui/
│   │   ├── screens.js          # 畫面切換管理器
│   │   ├── main-menu.js        # 主選單 UI 邏輯
│   │   ├── hud.js              # 遊戲中 HUD（分數、層數）
│   │   ├── instructions.js     # 說明頁 UI
│   │   ├── settings.js         # 設定頁 UI
│   │   └── leaderboard.js      # 排行榜 UI
│   │
│   ├── i18n/
│   │   ├── i18n.js             # 語系切換核心
│   │   ├── zh-TW.js            # 繁體中文
│   │   ├── ja.js               # 日文
│   │   └── en.js               # 英文
│   │
│   └── utils/
│       ├── storage.js          # LocalStorage 封裝
│       ├── color.js            # 色彩工具（動態漸層）
│       └── helpers.js          # 通用工具函式
│
└── README.md                   # 專案說明
```

### 3.1 index.html 引入順序

```html
<!-- CSS 引入順序 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/app.css">
<link rel="stylesheet" href="css/layout/responsive.css">
<link rel="stylesheet" href="css/components/button.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/slider.css">
<link rel="stylesheet" href="css/components/toggle.css">
<link rel="stylesheet" href="css/components/scoreboard.css">
<link rel="stylesheet" href="css/components/toast.css">
<link rel="stylesheet" href="css/screens/main-menu.css">
<link rel="stylesheet" href="css/screens/game.css">
<link rel="stylesheet" href="css/screens/instructions.css">
<link rel="stylesheet" href="css/screens/settings.css">
<link rel="stylesheet" href="css/screens/leaderboard.css">

<!-- JS 引入順序（defer） -->
<script defer src="js/utils/helpers.js"></script>
<script defer src="js/utils/storage.js"></script>
<script defer src="js/utils/color.js"></script>
<script defer src="js/i18n/zh-TW.js"></script>
<script defer src="js/i18n/ja.js"></script>
<script defer src="js/i18n/en.js"></script>
<script defer src="js/i18n/i18n.js"></script>
<script defer src="js/audio/sfx.js"></script>
<script defer src="js/audio/bgm.js"></script>
<script defer src="js/core/block.js"></script>
<script defer src="js/core/physics.js"></script>
<script defer src="js/core/renderer.js"></script>
<script defer src="js/core/tower.js"></script>
<script defer src="js/core/game.js"></script>
<script defer src="js/ui/screens.js"></script>
<script defer src="js/ui/hud.js"></script>
<script defer src="js/ui/main-menu.js"></script>
<script defer src="js/ui/instructions.js"></script>
<script defer src="js/ui/settings.js"></script>
<script defer src="js/ui/leaderboard.js"></script>
```

---

## 4. 響應式設計（RWD）

### 4.1 斷點定義

```css
/* 手機直向 */
@media (max-width: 480px) { }

/* 手機橫向 / 小平板 */
@media (min-width: 481px) and (max-width: 768px) { }

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) { }

/* 桌面 */
@media (min-width: 1025px) { }
```

### 4.2 Canvas 尺寸自適應

| 裝置 | Canvas 寬 | Canvas 高 |
|------|-----------|-----------|
| 手機直向（≤480px） | 視窗寬度 × 100% | 視窗高度 × 72%（留底部操作空間） |
| 手機橫向（≤768px） | 視窗寬度 × 60% | 視窗高度 × 100% |
| 平板（≤1024px） | 視窗寬度 × 75% | 視窗高度 × 85% |
| 桌面（>1024px） | min(480px, 視窗寬 × 60%) | min(720px, 視窗高 × 90%) |

Canvas 尺寸在 `window.resize` 事件時重新計算並重繪畫面。

### 4.3 行動裝置操作區規範

**重要：操作按鈕不得遮擋 Canvas 遊戲畫面**

- 行動裝置採用底部固定列（Bottom Action Bar）佈局
- 底部列高度固定 72px（含 safe area padding）
- Canvas 區域高度 = 視窗高度 - 頂部HUD高度(56px) - 底部列高度(72px) - safe-area
- 底部列使用 `position: fixed; bottom: 0;`，不疊加在 Canvas 上
- 手機橫向模式：操作按鈕移至畫面右側欄（寬 72px），Canvas 縮至左側

**手機直向佈局示意**：
```
┌─────────────────────────┐
│    Score: 12   HUD      │  <- HUD (56px)
├─────────────────────────┤
│                         │
│      CANVAS 遊戲畫面    │  <- 遊戲區域（不被任何元素遮擋）
│                         │
├─────────────────────────┤
│      [ PLACE BLOCK ]    │  <- 底部操作列 (72px)
└─────────────────────────┘
```

**手機橫向佈局示意**：
```
┌───────────────────────┬──┐
│                       │  │
│    CANVAS 遊戲畫面    │▶ │  <- 右側欄 (72px)
│                       │  │
└───────────────────────┴──┘
```

### 4.4 觸控事件規範

- 行動裝置：監聽 `touchstart` 觸發放塊
- 桌面裝置：監聽 `click` 及 `keydown (Space / Enter)` 觸發放塊
- 按鈕最小觸控面積：48px × 48px（WCAG 規範）
- 防止 double-tap 縮放：`touch-action: manipulation`

---

## 5. 多國語系（i18n）

### 5.1 支援語言

| 語言代碼 | 語言 | 字體 |
|---------|------|------|
| `zh-TW` | 繁體中文（預設） | Noto Sans TC |
| `ja` | 日文 | Noto Sans JP |
| `en` | 英文 | Noto Sans |

### 5.2 語系切換機制

```javascript
// js/i18n/i18n.js
const I18n = {
  currentLang: 'zh-TW',
  translations: { 'zh-TW': ZH_TW, 'ja': JA, 'en': EN },

  t(key) {
    return this.translations[this.currentLang][key] ?? key;
  },

  setLang(lang) {
    this.currentLang = lang;
    Storage.set('lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
  }
};
```

### 5.3 語系鍵值對照表

| Key | 繁體中文 | 日文 | 英文 |
|-----|---------|------|------|
| `menu.start` | 開始遊戲 | ゲームスタート | Start Game |
| `menu.continue` | 繼續遊戲 | 続ける | Continue |
| `menu.instructions` | 說明 | 説明 | How to Play |
| `menu.settings` | 設定 | 設定 | Settings |
| `game.score` | 分數 | スコア | Score |
| `game.level` | 層數 | 階層 | Floor |
| `game.perfect` | 完美！ | パーフェクト！ | Perfect! |
| `game.gameover` | 遊戲結束 | ゲームオーバー | Game Over |
| `settings.bgm` | 背景音樂 | BGM | BGM |
| `settings.sfx` | 音效 | 効果音 | Sound FX |
| `settings.lang` | 語言 | 言語 | Language |
| `leaderboard.title` | 排行榜 | ランキング | Leaderboard |
| `leaderboard.rank` | 名次 | 順位 | Rank |
| `leaderboard.score` | 分數 | スコア | Score |

---

## 6. 視覺設計規範

### 6.1 整體風格

- **擬真風格（Skeuomorphic + 3D 視覺）**：方塊有光影、立體感、反光
- Canvas 背景：城市夜景漸層（天空由深藍漸層至深紫），遠景有建築輪廓
- 方塊採用彩虹漸層配色，每層顏色根據 HSL 色相輪自動推進
- 整體視覺豐富、有深度，但色彩不雜亂

### 6.2 色彩系統

```css
/* css/base/variables.css */
:root {
  /* 主色調 */
  --color-primary:       #6C63FF;   /* 紫 - 主要互動色 */
  --color-primary-dark:  #4B44CC;   /* 深紫 - Hover */
  --color-accent:        #FF6584;   /* 粉紅 - 強調色 */
  --color-success:       #43D9AD;   /* 翠綠 - 完美放置 */
  --color-warning:       #FFD166;   /* 金黃 - 警示 */
  --color-danger:        #FF4D4F;   /* 紅 - 失敗/遊戲結束 */

  /* 背景 */
  --color-bg-sky-top:    #0D1B2A;   /* 深夜藍 */
  --color-bg-sky-mid:    #1B2A4A;   /* 午夜藍 */
  --color-bg-sky-bottom: #2D1B4E;   /* 深紫 */
  --color-bg-overlay:    rgba(0,0,0,0.55);

  /* UI 介面 */
  --color-ui-bg:         rgba(15, 20, 40, 0.92);
  --color-ui-card:       rgba(255, 255, 255, 0.07);
  --color-ui-border:     rgba(255, 255, 255, 0.15);
  --color-ui-text:       #F0F4FF;
  --color-ui-text-muted: #8899BB;
  --color-ui-text-dim:   #556080;

  /* 方塊漸層（起始色相，每層 +15 度） */
  --block-hue-start: 200;
  --block-saturation: 75%;
  --block-lightness: 60%;

  /* 陰影 */
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:   0 8px 24px rgba(0,0,0,0.5);
  --shadow-lg:   0 16px 48px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 20px rgba(108,99,255,0.4);
}
```

### 6.3 字體規範

```css
/* css/base/typography.css */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&family=Noto+Sans+JP:wght@400;700;900&family=Noto+Sans:wght@400;700;900&display=swap');

:root {
  --font-zh: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  --font-ja: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
  --font-en: 'Noto Sans', 'Segoe UI', Arial, sans-serif;

  /* 字體大小（比一般網站大 20-30%） */
  --text-xs:   14px;
  --text-sm:   16px;
  --text-base: 20px;   /* 基準字體（一般內文） */
  --text-md:   24px;
  --text-lg:   32px;
  --text-xl:   42px;
  --text-2xl:  56px;   /* 遊戲分數大字 */
  --text-3xl:  72px;   /* 主標題 */

  --font-normal: 400;
  --font-bold:   700;
  --font-black:  900;

  --line-height-tight:  1.2;
  --line-height-normal: 1.6;
}

:lang(zh-TW) { font-family: var(--font-zh); }
:lang(ja)    { font-family: var(--font-ja); }
:lang(en)    { font-family: var(--font-en); }
```

### 6.4 方塊立體視覺渲染

每個方塊呈現立體感，使用三個面繪製：

```
  頂面（最亮，亮度 +30%）
  ┌──────────────────┐
  │                  │
  │    正面（主色）   │
  │                  │
  └──────────────────┘
  底部陰影邊（最暗）
  右側面（亮度 -20%）
```

| 面向 | 顏色公式 | 說明 |
|------|---------|------|
| 頂面 | `hsl(hue, 75%, 80%)` | 光源打亮面 |
| 正面 | `hsl(hue, 75%, 60%)` | 主色面 |
| 右側 | `hsl(hue, 75%, 45%)` | 側面陰影 |
| 底陰影 | `rgba(0,0,0,0.3)` | 投影，模糊半徑 8px |

高分時增加方塊光暈：`shadowBlur: 12px, shadowColor: blockColor`

### 6.5 背景視差效果

- 背景城市輪廓以 0.3 倍速滾動（視差）
- 前景星點以 0.1 倍速移動，營造空間深度感
- 城市燈光使用小圓點隨機閃爍

---

## 7. 音效與音樂規範

### 7.1 BGM 規範

**風格**：輕快鋼琴曲（Upbeat Piano），使用 Web Audio API 動態合成

**音量設定**：
- 基礎 BGM 增益乘以 5（`Math.min(userVolume * 5, 1.0)`）
- 使用者可透過設定調整 0–100% 音量（再乘以 5 倍作為基礎）

**鋼琴音色合成**：
- 攻擊時間（attack）：5ms
- 衰減時間（decay）：0.8s
- 音色：BufferSource + ConvolverNode 模擬共鳴箱

**樂曲結構**（循環播放）：
- C 大調，4/4 拍，BPM 120
- 主旋律：C4, E4, G4, C5, B4, G4, E4, C4（8小節循環）
- 伴奏：左手低音 C3, G3 交替八分音符

### 7.2 音效規範

**風格**：高音輕脆（Crystal / Xylophone 風格）

| 音效名稱 | 觸發時機 | 音頻特性 |
|---------|---------|---------|
| `sfx_place` | 方塊成功放置 | 正弦波 440Hz→880Hz，時長 120ms |
| `sfx_perfect` | 完美對齊（誤差 < 2px） | 和弦 440+554+659Hz，時長 300ms，帶 reverb |
| `sfx_cut` | 方塊被切割 | 頻率下掃 800Hz→400Hz，時長 80ms |
| `sfx_gameover` | 遊戲結束 | 三音下降 G4→E4→C4，每音 200ms |
| `sfx_click` | 按鈕點擊 | 短促高頻 600Hz，時長 60ms |
| `sfx_combo` | 連續完美 3+ 次 | 上升琶音 C5,E5,G5,C6，每音 80ms |

### 7.3 音頻初始化策略

```javascript
// 第一次使用者互動後初始化 AudioContext
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

function initAudio() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  BGM.init(audioCtx);
  SFX.init(audioCtx);
  BGM.play();
}
```

---

## 8. 頁面規格

### 8.1 主畫面

**設計原則**：簡潔乾淨、視覺吸引力強、快速進入遊戲

**佈局結構**：
- 全螢幕動態背景（城市夜景動畫、粒子飄散）
- 中央主標題：「STACK TOWER / 堆疊高塔」（大字體、白色發光效果）
- 四個主要按鈕垂直排列，保持足夠間距
- 底部顯示個人最高分 + 語言快速切換

**主畫面按鈕規格**：

| 按鈕 | 圖示 | 顯示條件 | 動作 |
|------|------|---------|------|
| 開始遊戲 | 🎮 | 永遠顯示 | 重新開始，清除暫存 |
| 繼續遊戲 | ⏯️ | 有暫存進度時顯示 | 從 LocalStorage 恢復 |
| 說明 | 📖 | 永遠顯示 | 切換至說明頁 |
| 設定 | ⚙️ | 永遠顯示 | 切換至設定頁 |

**按鈕互動動畫**：
- Hover：上移 3px + 陰影加深（shadow-glow）
- Active：下壓 1px + 稍微縮小 scale(0.97)
- 按鈕間距：16px
- 最小寬度：240px（桌面）/ 視窗寬 80%（手機）

**主畫面背景動畫**：
- 低速飄動的星點粒子（10–20顆）
- 背景塔預覽動畫（透明度 20% 的示範方塊緩慢疊加）
- 主標題週期發光脈動特效

---

### 8.2 遊戲畫面

**HUD 頂部列**（56px 高，不遮擋 Canvas）：

| 元素 | 位置 | 字體 | 說明 |
|------|------|------|------|
| 返回按鈕 🔙 | 左側 | — | 返回主選單，彈出確認 |
| 分數 | 中央 | text-md 加粗 | 即時更新，有放大動畫 |
| 層數 | 中央偏右 | text-sm | 當前高度層數 |
| 靜音 🔇 | 右側 | — | 快速靜音切換 |

**遊戲中浮出提示**：
- 完美放置：「✨ 完美！」文字從方塊中央飛出，漸漸上升消失（1.2s 動畫）
- 連續完美 3 次：「🔥 Combo × 3！」全畫面輕微閃光
- 分數增加動畫：分數數字放大後縮回（0.3s）

**遊戲結束彈窗（Modal）**：
- 最終分數（大字體）
- 達到層數
- 最高紀錄（若破紀錄顯示皇冠 👑 動畫）
- 三個按鈕：再玩一次 / 排行榜 / 主選單

---

### 8.3 說明頁面

**設計原則**：圖示豐富、條理清晰、易於閱讀

**頁面章節**：

**🎯 遊戲目標**：大字體 + 插圖說明核心概念

**🕹️ 操作方式**：
```
┌───────────────┬──────────────────┐
│  💻 電腦      │  📱 手機         │
│  按空白鍵     │  點擊螢幕        │
│  或點擊畫面   │  或點擊按鈕      │
└───────────────┴──────────────────┘
```

**📐 方塊機制**：動態 CSS 圖解（方塊移動 → 點擊 → 切割 → 堆疊流程）

**⭐ 計分規則**：
```
🥈 一般放置      +10 分
🥇 精準放置      +15 分
✨ 完美放置      +25 分 + 連擊計數
🔥 連續完美 × N  分數倍增
```

**💡 技巧提示**：3–5 條技巧，每條有對應圖示

**❓ 常見問題**：可折疊 FAQ 列表

**說明頁圖示規範**：
- 所有圖示使用 Unicode Emoji（無需外部依賴）
- 每個段落標題前有圖示
- 重要資訊使用彩色方框突出顯示（`background: var(--color-ui-card)`）
- 操作示意圖使用 CSS 繪製的動態示意框

---

### 8.4 設定頁面

**設計原則**：排版乾淨簡單、控制項大而易點擊

**頁面結構**：

```
⚙️ 設定
─────────────────────────────────────
🎵 背景音樂
   [━━━━━━━●────────] 60%

🔊 音效
   [━━━━━━━━━●──────] 75%

─────────────────────────────────────
🌐 語言 / Language / 言語
   [ 繁中 ]  [ English ]  [ 日本語 ]

─────────────────────────────────────
🏆  [ 查看排行榜 → ]

🗑️  [ 清除所有紀錄 ]   （需二次確認）

─────────────────────────────────────
       [ ← 返回 ]
```

**音量滑桿規格**：
- 軌道高度：8px，圓角：4px
- 已選部分：`--color-primary` 漸層
- 滑塊（thumb）：直徑 28px，白色，有陰影
- 觸控放大至 44px（透明 padding 擴大點擊區域）
- 數值即時顯示於滑桿右方

**語言切換按鈕**：
- 三個按鈕等寬排列，間距 12px
- 選中狀態：`background: var(--color-primary)`，文字白色
- 未選中：`background: var(--color-ui-card)`，文字灰色
- 按鈕高度：48px，字體：text-base

**重置按鈕防誤觸機制**：
1. 點擊「清除所有紀錄」→ 按鈕變紅並顯示「確定？再按確認」
2. 2秒內未再按 → 取消，按鈕恢復正常
3. 2秒內再按 → 執行清除，顯示 Toast「已重置 ✓」

---

### 8.5 排行榜頁面

**設計原則**：清晰、強烈的成就感視覺獎勵

**頁面結構**：

| 名次 | 圖示 | 分數 | 達到層數 | 背景 |
|------|------|------|---------|------|
| 🥇 1 | 👑 | 087 | 28 層 | 金色漸層 |
| 🥈 2 | 🥈 | 064 | 21 層 | 銀色漸層 |
| 🥉 3 | 🥉 | 051 | 17 層 | 銅色漸層 |
| ⭐ 4–10 | ⭐ | ... | ... | 一般深色 |

**排行榜規格**：
- 儲存前 10 名（LocalStorage key: `stack_leaderboard`）
- 資料格式：`[{ score: 87, floors: 28, date: '2025-06-15' }]`
- 若排行榜為空：顯示「還沒有紀錄，去挑戰看看吧！🎮」
- 每次遊戲結束自動插入並排序
- 底部按鈕：清除紀錄 / 返回主選單

---

## 9. 遊戲核心邏輯

### 9.1 方塊系統

```javascript
// js/core/block.js
class Block {
  constructor(config) {
    this.x         = config.x;
    this.y         = config.y;
    this.width     = config.width;   // 隨每次切割縮小
    this.height    = 30;             // 固定高度
    this.speed     = config.speed;   // 水平移動速度（px/frame）
    this.direction = 1;              // 1=向右, -1=向左
    this.color     = config.color;   // HSL 色彩
    this.isPlaced  = false;
  }
}
```

**方塊初始設定**：

| 屬性 | 值 | 說明 |
|------|-----|------|
| 初始寬度 | Canvas 寬 × 60% | 第一個方塊寬度 |
| 初始速度 | 3 px/frame | 開始時的速度 |
| 每層速度增量 | +0.2 px/frame | 難度遞進 |
| 速度上限 | 12 px/frame | 防止太快無法操作 |
| 起始位置 | 左/右交替出現 | 增加變化性 |

### 9.2 切割邏輯（js/core/physics.js）

```
當前方塊：  [========]
下方基座：         [=========]
重疊部分：         [===]            ← 保留
切除部分：  [====]        [==]      ← 掉落消失
```

```javascript
function calculateCut(currentBlock, baseBlock) {
  const overlapLeft  = Math.max(currentBlock.x, baseBlock.x);
  const overlapRight = Math.min(
    currentBlock.x + currentBlock.width,
    baseBlock.x + baseBlock.width
  );
  const overlapWidth = overlapRight - overlapLeft;

  if (overlapWidth <= 0) return { type: 'miss' };

  const isPerfect = Math.abs(currentBlock.x - baseBlock.x) < 2;

  return {
    type: isPerfect ? 'perfect' : 'cut',
    newX: overlapLeft,
    newWidth: isPerfect ? baseBlock.width : overlapWidth,
    cutLeft:  { x: currentBlock.x,  width: overlapLeft - currentBlock.x },
    cutRight: { x: overlapRight,    width: (currentBlock.x + currentBlock.width) - overlapRight }
  };
}
```

### 9.3 相機控制（js/core/tower.js）

- 每放置一層，相機 Y 軸平滑上移（`lerp` 插值，係數 0.08）
- 視角始終保持讓玩家看到當前方塊下方 2–3 層
- 切除的方塊碎片執行自由落體動畫後消失（加速度 0.5 px/frame²，透明度淡出）

### 9.4 計分系統

```javascript
function calculateScore(overlapWidth, baseWidth, isPerfect, comboCount) {
  const ratio = overlapWidth / baseWidth;

  let baseScore;
  if (isPerfect)        baseScore = 25;
  else if (ratio > 0.9) baseScore = 15;
  else                  baseScore = 10;

  const comboMultiplier = comboCount >= 3
    ? 1 + (comboCount - 2) * 0.5
    : 1;

  return Math.round(baseScore * comboMultiplier);
}
```

**Combo 規則**：
- 連續 2 次完美：Combo 開始
- 每多 1 次：分數倍率 +0.5
- 非完美放置：Combo 重置為 0

### 9.5 遊戲狀態機

```
IDLE（初始）
  └─▶ MENU（主選單）
        ├─ 開始遊戲 ─▶ PLAYING（遊戲進行中）
        └─ 繼續遊戲 ─▶ PLAYING（從暫存恢復）

PLAYING
  ├─ 放置方塊 ─▶ PLACING_ANIMATION（150ms）─▶ PLAYING
  ├─ 完全錯位 ─▶ GAME_OVER
  └─ 按返回   ─▶ PAUSED

PAUSED
  ├─ 繼續 ─▶ PLAYING
  └─ 放棄 ─▶ MENU

GAME_OVER
  ├─ 再玩一次 ─▶ PLAYING
  ├─ 主選單   ─▶ MENU
  └─ 排行榜   ─▶ LEADERBOARD
```

### 9.6 遊戲主迴圈（js/core/game.js）

```javascript
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);  // 更新物理、位移
  render();           // 繪製 Canvas

  if (gameState === 'PLAYING') {
    requestAnimationFrame(gameLoop);
  }
}

// 啟動
requestAnimationFrame(gameLoop);
```

---

## 10. 資料儲存規範

### 10.1 LocalStorage 鍵值定義

| Key | 類型 | 說明 | 範例值 |
|-----|------|------|--------|
| `stack_leaderboard` | JSON Array | 排行榜前10名 | `[{score:87,floors:28,date:"2025-06-15"}]` |
| `stack_settings` | JSON Object | 使用者設定 | `{bgmVolume:60,sfxVolume:75,lang:"zh-TW"}` |
| `stack_save` | JSON Object | 目前遊戲進度 | `{score:42,floors:12,towerState:{...}}` |
| `stack_best` | Number | 個人最高分 | `87` |

### 10.2 儲存封裝（js/utils/storage.js）

```javascript
const Storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`stack_${key}`);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`stack_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false; // 儲存空間不足時靜默失敗
    }
  },
  remove(key) {
    localStorage.removeItem(`stack_${key}`);
  },
  clear() {
    ['leaderboard', 'settings', 'save', 'best'].forEach(k => this.remove(k));
  }
};
```

---

## 11. 效能規範

### 11.1 Canvas 渲染優化

- 使用離屏 Canvas（雙緩衝）渲染靜態背景，避免每幀重繪
- 背景星點在初始化時預渲染至離屏 Canvas，每幀只 `drawImage`
- 目標：穩定 60 FPS（桌面）/ 30+ FPS（手機）

### 11.2 動畫效能

- 所有 UI 動畫使用 CSS `transform` + `opacity`（觸發 GPU 加速）
- 禁止在遊戲主迴圈中操作 DOM
- 使用 `will-change: transform` 標記動畫元素

### 11.3 記憶體管理

- 掉落方塊碎片：最多同時存在 5 個，超過自動移除最舊的
- 粒子特效池：預先建立 20 個粒子物件，重複使用（Object Pool Pattern）

---

## 12. 無障礙規範

### 12.1 鍵盤操作

| 按鍵 | 動作 |
|------|------|
| Space | 放置方塊 / 確認 |
| Enter | 確認 / 進入遊戲 |
| Escape | 暫停 / 返回 |
| Tab | 焦點切換 |
| M | 靜音切換 |

### 12.2 視覺無障礙

- 所有文字與背景對比度 ≥ 4.5:1（WCAG AA 標準）
- 重要資訊不只依賴顏色區分，同時使用形狀/圖示/文字
- 動畫可透過設定關閉（`prefers-reduced-motion` 媒體查詢）

### 12.3 語義化 HTML

- 使用正確的 ARIA 角色：`role="dialog"`（彈窗）、`aria-label`（按鈕）
- 遊戲分數透過 `aria-live="polite"` 自動播報給螢幕閱讀器

---

## 13. 錯誤處理

### 13.1 音頻錯誤 Fallback

```javascript
if (audioCtx.state === 'suspended') {
  audioCtx.resume().catch(() => {
    console.warn('音頻無法啟動，靜音模式運行');
    gameSettings.bgmEnabled = false;
  });
}
```

### 13.2 LocalStorage 滿載

- `storage.set` 失敗時靜默處理（遊戲仍可繼續）
- 顯示 Toast 提示：「儲存空間不足，進度可能無法保存」

### 13.3 Canvas 不支援

```javascript
if (!canvas.getContext) {
  document.getElementById('app').innerHTML =
    '<p>您的瀏覽器不支援 Canvas，請使用 Chrome、Firefox 或 Safari。</p>';
}
```

### 13.4 字體載入失敗

- Google Fonts 載入失敗時自動 fallback 至系統字體（已定義在 font-family 串）

---

## 14. 測試規範

### 14.1 功能測試清單

**主選單**
- [ ] 首次進入不顯示「繼續遊戲」
- [ ] 遊戲中途關閉後再開，顯示「繼續遊戲」
- [ ] 語言切換後所有文字正確翻譯（包含 Canvas 上的文字）
- [ ] 最高分正確顯示於主選單底部

**遊戲邏輯**
- [ ] 方塊完全錯位觸發 Game Over
- [ ] 完美放置（誤差 < 2px）觸發完美特效和加分
- [ ] 方塊速度隨層數遞增，且不超過上限 12 px/frame
- [ ] 切割後方塊寬度正確縮小
- [ ] Combo 系統正確計算倍率

**RWD 測試**
- [ ] iPhone SE（375px）：Canvas 不被遮擋，底部按鈕可點擊
- [ ] iPhone 14 Pro（393px）：Safe area 正確處理
- [ ] iPad（768px）：佈局正確，觸控靈敏
- [ ] 1080p 桌面：Canvas 居中，UI 比例正確
- [ ] 手機橫向：Canvas 佔左側，操作在右側欄

**音效測試**
- [ ] BGM 在首次互動後自動播放
- [ ] 完美放置有特殊音效（與一般放置不同）
- [ ] 靜音後所有聲音停止
- [ ] 音量滑桿即時生效
- [ ] BGM 音量確認為一般值的 5 倍效果

**排行榜測試**
- [ ] 新高分自動插入正確排名位置
- [ ] 最多只保留 10 筆紀錄
- [ ] 清除後排行榜空白並顯示提示訊息

### 14.2 瀏覽器相容性

| 瀏覽器 | 版本 | Canvas | Web Audio | LocalStorage |
|--------|------|--------|-----------|--------------|
| Chrome | 90+ | ✅ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ✅ | ✅ |
| Safari | 14+ | ✅ | ✅（需互動） | ✅ |
| Edge | 90+ | ✅ | ✅ | ✅ |
| iOS Safari | 14+ | ✅ | ✅（需互動） | ✅ |
| Android Chrome | 90+ | ✅ | ✅ | ✅ |

---

## 附錄 A：動態配色主題

方塊顏色與背景色調根據玩家得分動態演變：

| 分數區間 | 天空色調 | 方塊色系 | 氛圍 |
|---------|---------|---------|------|
| 0 – 50 | 深夜藍紫 | 藍→青 | 清晨前夕 |
| 51 – 150 | 深夜 + 晨曦 | 青→綠 | 黎明 |
| 151 – 300 | 晨橙 | 綠→黃 | 日出 |
| 301 – 500 | 蔚藍晴空 | 黃→橙 | 正午 |
| 501+ | 燦爛金色 | 橙→紅→粉 | 黃金時刻 |

---

## 附錄 B：檔案大小目標

| 資源類型 | 目標大小 |
|---------|---------|
| index.html | < 5 KB |
| 所有 CSS 合計 | < 40 KB |
| 所有 JS 合計 | < 120 KB |
| 圖片資源（SVG） | < 20 KB |
| **總計（不含字體）** | **< 185 KB** |

字體由 Google Fonts CDN 提供，本地 fallback 為系統字體。

---

*Stack Tower v1.0.0 完整規格書｜文件結束*
