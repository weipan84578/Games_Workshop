# 🎰 Roulette（輪盤）遊戲規格書

**版本：** 1.0.0  
**最後更新：** 2026-06-24  
**類型：** 純前端單頁應用（SPA）  
**目標平台：** 桌面瀏覽器 + 行動裝置（RWD）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [設計規範](#4-設計規範)
5. [多國語系（i18n）](#5-多國語系i18n)
6. [畫面規格](#6-畫面規格)
7. [遊戲規則與邏輯](#7-遊戲規則與邏輯)
8. [AI 對手系統](#8-ai-對手系統)
9. [音效與 BGM 規格](#9-音效與-bgm-規格)
10. [RWD 響應式設計](#10-rwd-響應式設計)
11. [動畫與視覺效果](#11-動畫與視覺效果)
12. [狀態管理與存檔](#12-狀態管理與存檔)
13. [設定系統](#13-設定系統)
14. [說明頁面規格](#14-說明頁面規格)
15. [錯誤處理](#15-錯誤處理)
16. [效能規範](#16-效能規範)
17. [瀏覽器相容性](#17-瀏覽器相容性)

---

## 1. 專案概覽

### 1.1 遊戲簡介

本遊戲為標準歐式/美式輪盤（Roulette）模擬，採純前端技術實作，無需任何後端伺服器。玩家可與 AI 對手進行對戰，並可選擇三種難度。

### 1.2 核心功能列表

| 功能             | 說明                                          | 優先級 |
|------------------|-----------------------------------------------|--------|
| 主選單           | 開始遊戲、繼續遊戲、說明、設定                | 🔴 必要 |
| 輪盤旋轉         | 物理擬真旋轉動畫、鋼球滾動效果               | 🔴 必要 |
| 下注系統         | 多種下注類型，賠率計算                        | 🔴 必要 |
| AI 對手          | 簡單 / 普通 / 困難三種難度                    | 🔴 必要 |
| 多國語系         | 繁體中文 / 英文 / 日文                        | 🔴 必要 |
| BGM & 音效       | 鋼琴輕快 BGM + 高音輕脆音效                   | 🔴 必要 |
| 設定頁面         | 語言、音量、難度、顏色主題                    | 🔴 必要 |
| 說明頁面         | 圖文並茂的遊戲教學                            | 🔴 必要 |
| 存檔/讀檔        | localStorage 自動存檔                         | 🟡 重要 |
| RWD              | 桌面 / 平板 / 手機三段響應                    | 🔴 必要 |

### 1.3 技術限制

- **零依賴原則**：不使用任何 npm 套件，所有功能自行實作
- **離線可用**：不得發出任何網路請求（圖片、字型除外，可使用 CDN 但需 fallback）
- **一鍵啟動**：直接雙擊 `index.html` 即可開始遊戲
- **無 Build 流程**：不使用 TypeScript 編譯、Webpack、Vite 等建置工具

---

## 2. 技術架構

### 2.1 技術棧

```
前端語言：HTML5 + CSS3 + Vanilla JavaScript (ES6+)
圖形渲染：Canvas API（輪盤旋轉）+ SVG（下注桌面板）
音效系統：Web Audio API（音效合成）+ Howler.js（CDN 引入，BGM 播放）
字型：Google Fonts CDN（Noto Sans TC / Noto Serif JP / Orbitron）+ 本地 fallback
存檔：localStorage（JSON 序列化）
```

### 2.2 模組設計原則

- **單一職責**：每個 JS 模組僅負責一個功能域
- **事件驅動**：模組間透過 CustomEvent 通訊，避免直接耦合
- **狀態集中**：所有遊戲狀態集中在 `GameState` 物件管理
- **無全域污染**：所有模組使用 IIFE 或 ES Module 封裝

### 2.3 ES Module 引入方式

```html
<!-- index.html -->
<script type="module" src="./js/main.js"></script>
```

```javascript
// js/main.js
import { GameState }    from './core/GameState.js';
import { RouletteWheel } from './game/RouletteWheel.js';
import { BettingBoard }  from './game/BettingBoard.js';
import { AIPlayer }      from './game/AIPlayer.js';
import { AudioManager }  from './audio/AudioManager.js';
import { i18n }          from './i18n/i18n.js';
import { UIManager }     from './ui/UIManager.js';
import { ScreenRouter }  from './ui/ScreenRouter.js';
import { SaveManager }   from './core/SaveManager.js';
import { SettingsManager } from './core/SettingsManager.js';
```

---

## 3. 資料夾結構

```
roulette/
│
├── index.html                   # 進入點，所有畫面容器
│
├── css/                         # 樣式資料夾
│   ├── base/
│   │   ├── reset.css            # CSS Reset / Normalize
│   │   ├── variables.css        # CSS 自訂屬性（色盤、字型、間距）
│   │   └── typography.css       # 全域字型設定
│   ├── layout/
│   │   ├── grid.css             # 佈局系統
│   │   └── responsive.css       # RWD breakpoints
│   ├── components/
│   │   ├── button.css           # 按鈕元件
│   │   ├── modal.css            # 彈窗元件
│   │   ├── chip.css             # 籌碼元件
│   │   ├── slider.css           # 滑桿元件（音量）
│   │   ├── badge.css            # 標章元件
│   │   └── toast.css            # 提示訊息元件
│   ├── screens/
│   │   ├── main-menu.css        # 主選單畫面
│   │   ├── game.css             # 遊戲主畫面
│   │   ├── settings.css         # 設定畫面
│   │   └── help.css             # 說明畫面
│   ├── themes/
│   │   ├── theme-classic.css    # 經典綠色主題
│   │   ├── theme-royal.css      # 皇家藍金主題
│   │   ├── theme-neon.css       # 霓虹賽博朋克主題
│   │   ├── theme-rose.css       # 玫瑰金主題
│   │   └── theme-midnight.css   # 深夜紫黑主題
│   └── animations/
│       ├── wheel.css            # 輪盤動畫
│       ├── chip.css             # 籌碼動畫
│       └── transitions.css      # 畫面切換過渡
│
├── js/                          # JavaScript 資料夾
│   ├── main.js                  # 主進入點，初始化所有模組
│   ├── core/
│   │   ├── GameState.js         # 遊戲狀態管理（中央 Store）
│   │   ├── SaveManager.js       # localStorage 存讀檔
│   │   ├── SettingsManager.js   # 設定讀寫管理
│   │   └── EventBus.js          # 全域事件匯流排
│   ├── game/
│   │   ├── RouletteWheel.js     # 輪盤 Canvas 渲染與物理
│   │   ├── BettingBoard.js      # 下注桌面板（SVG）
│   │   ├── BettingLogic.js      # 下注規則、賠率計算
│   │   ├── Ball.js              # 鋼球物理動畫
│   │   ├── AIPlayer.js          # AI 下注策略
│   │   └── PayoutCalculator.js  # 派彩計算
│   ├── ui/
│   │   ├── UIManager.js         # DOM 操作統一入口
│   │   ├── ScreenRouter.js      # 畫面切換路由
│   │   ├── ChipSelector.js      # 籌碼選擇 UI
│   │   ├── ScoreBoard.js        # 計分板 UI
│   │   ├── AnimationController.js # 動畫排程控制
│   │   └── ToastNotification.js # 提示訊息顯示
│   ├── audio/
│   │   ├── AudioManager.js      # 音效管理主控
│   │   ├── BGMPlayer.js         # BGM 播放控制
│   │   ├── SFXPlayer.js         # 音效播放控制
│   │   └── AudioSynthesizer.js  # Web Audio API 合成音效
│   └── i18n/
│       ├── i18n.js              # 多語系核心
│       ├── lang/
│       │   ├── zh-TW.js         # 繁體中文
│       │   ├── en.js            # 英文
│       │   └── ja.js            # 日文
│
├── assets/                      # 靜態資源
│   ├── audio/
│   │   ├── bgm/
│   │   │   └── piano-light.mp3  # 鋼琴輕快 BGM（Base64 內嵌或外部）
│   │   └── sfx/
│   │       ├── chip-place.mp3   # 下注音效
│   │       ├── ball-roll.mp3    # 鋼球滾動
│   │       ├── wheel-spin.mp3   # 輪盤旋轉
│   │       ├── ball-drop.mp3    # 鋼球落下
│   │       ├── win.mp3          # 獲勝音效
│   │       ├── lose.mp3         # 失敗音效
│   │       ├── button-click.mp3 # 按鈕點擊
│   │       └── chip-collect.mp3 # 籌碼收回
│   ├── images/
│   │   ├── felt-texture.png     # 賭桌毛氈紋理
│   │   ├── wood-border.png      # 木質邊框
│   │   └── icons/
│   │       ├── sound-on.svg
│   │       ├── sound-off.svg
│   │       ├── settings.svg
│   │       ├── help.svg
│   │       └── back.svg
│   └── fonts/
│       └── (optional local fallback fonts)
│
└── docs/
    └── README.md                # 開發說明文件
```

---

## 4. 設計規範

### 4.1 色彩系統（CSS 自訂屬性）

#### 主題一：經典賭場（Classic Green）
```css
:root[data-theme="classic"] {
  --color-table-felt:     #1a5c2e;   /* 賭桌毛氈深綠 */
  --color-table-border:   #8B6914;   /* 木質邊框金色 */
  --color-wheel-base:     #1a1a1a;   /* 輪盤底色 */
  --color-wheel-accent:   #C0A000;   /* 輪盤金色裝飾 */
  --color-number-red:     #C0392B;   /* 紅色數字 */
  --color-number-black:   #1a1a1a;   /* 黑色數字 */
  --color-number-green:   #27ae60;   /* 零（0）綠色 */
  --color-ui-primary:     #D4AF37;   /* 主要 UI 金色 */
  --color-ui-secondary:   #2E7D32;   /* 次要 UI 綠色 */
  --color-text-primary:   #F5E6C8;   /* 主要文字奶油色 */
  --color-text-secondary: #B0A080;   /* 次要文字米色 */
  --color-bg-overlay:     rgba(0,0,0,0.85); /* 覆蓋層 */
  --color-chip-gold:      #FFD700;
  --color-chip-silver:    #C0C0C0;
  --color-chip-copper:    #B87333;
}
```

#### 主題二：皇家藍金（Royal Blue）
```css
:root[data-theme="royal"] {
  --color-table-felt:     #0D2B5E;
  --color-table-border:   #C9A84C;
  --color-wheel-base:     #0A1628;
  --color-wheel-accent:   #E8C547;
  --color-number-red:     #E74C3C;
  --color-number-black:   #1C2833;
  --color-number-green:   #1ABC9C;
  --color-ui-primary:     #E8C547;
  --color-ui-secondary:   #2471A3;
  --color-text-primary:   #EAF2FF;
  --color-text-secondary: #85A8CC;
  --color-bg-overlay:     rgba(10,20,50,0.90);
}
```

#### 主題三：霓虹賽博（Neon Cyber）
```css
:root[data-theme="neon"] {
  --color-table-felt:     #0A0A12;
  --color-table-border:   #FF00FF;
  --color-wheel-base:     #050510;
  --color-wheel-accent:   #00FFFF;
  --color-number-red:     #FF1744;
  --color-number-black:   #212121;
  --color-number-green:   #00E676;
  --color-ui-primary:     #FF00FF;
  --color-ui-secondary:   #00FFFF;
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #B388FF;
  --color-bg-overlay:     rgba(0,0,10,0.92);
}
```

#### 主題四：玫瑰金（Rose Gold）
```css
:root[data-theme="rose"] {
  --color-table-felt:     #3D1A24;
  --color-table-border:   #E8A598;
  --color-wheel-base:     #2A0D14;
  --color-wheel-accent:   #E8A598;
  --color-number-red:     #FF4081;
  --color-number-black:   #2C1810;
  --color-number-green:   #A5D6A7;
  --color-ui-primary:     #E8A598;
  --color-ui-secondary:   #C2185B;
  --color-text-primary:   #FDE8E8;
  --color-text-secondary: #D4A0A0;
  --color-bg-overlay:     rgba(40,10,20,0.90);
}
```

#### 主題五：深夜紫黑（Midnight Purple）
```css
:root[data-theme="midnight"] {
  --color-table-felt:     #1A0A2E;
  --color-table-border:   #9C27B0;
  --color-wheel-base:     #0D0018;
  --color-wheel-accent:   #CE93D8;
  --color-number-red:     #F44336;
  --color-number-black:   #1A1A2E;
  --color-number-green:   #69F0AE;
  --color-ui-primary:     #CE93D8;
  --color-ui-secondary:   #7B1FA2;
  --color-text-primary:   #EDE7F6;
  --color-text-secondary: #B39DDB;
  --color-bg-overlay:     rgba(15,0,30,0.92);
}
```

### 4.2 字型系統

```css
:root {
  /* 字型家族 */
  --font-display:  'Orbitron', 'Impact', sans-serif;  /* 數字、分數顯示 */
  --font-ui:       'Noto Sans TC', 'Noto Sans JP', 'Segoe UI', sans-serif; /* UI 文字 */
  --font-serif:    'Noto Serif TC', 'Noto Serif JP', 'Georgia', serif; /* 說明文字 */

  /* 字型大小（大字體策略）*/
  --text-xs:    1rem;       /* 16px - 最小字體 */
  --text-sm:    1.125rem;   /* 18px */
  --text-base:  1.25rem;    /* 20px - 正文基準 */
  --text-lg:    1.5rem;     /* 24px */
  --text-xl:    1.875rem;   /* 30px */
  --text-2xl:   2.25rem;    /* 36px */
  --text-3xl:   3rem;       /* 48px */
  --text-4xl:   3.75rem;    /* 60px - 標題 */
  --text-hero:  5rem;       /* 80px - 主畫面大標 */

  /* 字重 */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-bold:   700;
  --weight-black:  900;

  /* 行高 */
  --leading-tight:  1.25;
  --leading-normal: 1.6;
  --leading-loose:  1.85;

  /* 字距 */
  --tracking-wide:  0.08em;
  --tracking-wider: 0.15em;
}
```

### 4.3 間距系統

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
}
```

### 4.4 輪盤視覺規範（擬真風格）

輪盤（Roulette Wheel）應達到以下擬真程度：

| 元素             | 設計要求                                               |
|------------------|-------------------------------------------------------|
| 輪盤外框          | 木紋漸層 + 金屬邊框光澤，多層圓環感                    |
| 格槽隔板          | 金屬反光效果，使用 Canvas 繪製高光                    |
| 數字區塊          | 紅/黑/綠三色，數字清晰可見，帶圓弧透視感              |
| 鋼球              | 白色球體，帶高光反射效果，物理彈跳感                  |
| 旋轉內盤          | 與外輪反方向旋轉，速度差呈現真實感                    |
| 輪盤底座          | 木質圓台底座，投影陰影                                |
| 中心裝飾          | 花瓣形金屬旋轉裝飾（菱形重複紋路）                   |

---

## 5. 多國語系（i18n）

### 5.1 語系切換架構

```javascript
// js/i18n/i18n.js
const i18n = {
  currentLang: 'zh-TW',
  supportedLangs: ['zh-TW', 'en', 'ja'],
  translations: {},

  async loadLang(lang) { /* 動態載入語系檔 */ },
  t(key, params = {}) { /* 取得翻譯字串，支援插值 */ },
  setLang(lang) { /* 切換語系，更新所有 DOM */ },
};
```

### 5.2 語系鍵值表（重要條目）

| Key                      | 繁體中文           | English              | 日本語               |
|--------------------------|--------------------|----------------------|----------------------|
| `menu.start`             | 開始遊戲           | Start Game           | ゲームスタート        |
| `menu.continue`          | 繼續遊戲           | Continue             | 続ける               |
| `menu.help`              | 說明               | Help                 | 説明                 |
| `menu.settings`          | 設定               | Settings             | 設定                 |
| `game.spin`              | 轉動               | Spin                 | スピン               |
| `game.bet`               | 下注               | Place Bet            | ベット               |
| `game.clear`             | 清除               | Clear                | クリア               |
| `game.balance`           | 籌碼餘額           | Balance              | 残高                 |
| `game.result.win`        | 🎉 你贏了！         | 🎉 You Win!           | 🎉 あなたの勝ちです！  |
| `game.result.lose`       | 😔 很遺憾...        | 😔 You Lose...        | 😔 残念です...        |
| `difficulty.easy`        | 簡單               | Easy                 | 簡単                 |
| `difficulty.normal`      | 普通               | Normal               | 普通                 |
| `difficulty.hard`        | 困難               | Hard                 | 難しい               |
| `settings.language`      | 語言               | Language             | 言語                 |
| `settings.bgm`           | 背景音樂           | Background Music     | BGM                  |
| `settings.sfx`           | 音效               | Sound Effects        | 効果音               |
| `settings.theme`         | 主題顏色           | Color Theme          | テーマカラー          |
| `help.title`             | 遊戲說明           | How to Play          | 遊び方               |
| `ai.thinking`            | AI 思考中...       | AI Thinking...       | AI考慮中...           |

### 5.3 語系 HTML 屬性

```html
<!-- 使用 data-i18n 屬性標記需翻譯的元素 -->
<button data-i18n="menu.start">開始遊戲</button>
<span data-i18n="game.balance" data-i18n-param='{"amount":"$1000"}'>
  籌碼餘額：$1000
</span>
```

---

## 6. 畫面規格

### 6.1 主選單畫面（Main Menu）

#### 佈局結構

```
┌─────────────────────────────────────┐
│  🌍 語系選擇 (右上)   🎵音量控制    │
│                                     │
│         [輪盤Logo動畫]              │
│                                     │
│    ✨ ROULETTE  輪盤遊戲 ✨         │
│         (主標題，大字體)            │
│                                     │
│      ┌─────────────────┐           │
│      │  🎮  開始遊戲   │           │
│      ├─────────────────┤           │
│      │  ▶️  繼續遊戲   │           │
│      ├─────────────────┤           │
│      │  📖  說    明   │           │
│      ├─────────────────┤           │
│      │  ⚙️  設    定   │           │
│      └─────────────────┘           │
│                                     │
│    難度：[簡單] [普通] [困難]       │
│                                     │
│         v1.0.0  ©2026              │
└─────────────────────────────────────┘
```

#### 按鈕規格

```css
.btn-menu {
  width: min(400px, 85vw);
  padding: var(--space-5) var(--space-8);
  font-size: var(--text-xl);      /* 30px */
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-wide);
  border-radius: 8px;
  border: 2px solid var(--color-ui-primary);
  background: linear-gradient(
    135deg,
    rgba(var(--color-ui-primary-rgb), 0.15),
    rgba(var(--color-ui-primary-rgb), 0.05)
  );
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.btn-menu:hover {
  background: var(--color-ui-primary);
  color: var(--color-bg-overlay);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(var(--color-ui-primary-rgb), 0.4);
}
```

#### 難度選擇器

```
[簡單 🟢]  [普通 🟡]  [困難 🔴]
```

- 選中狀態：發光邊框 + 縮放 1.05
- 顏色：簡單=綠色、普通=金色、困難=紅色

#### 主選單背景

- 背景：深色漸層（從當前主題色衍生）
- 裝飾：旋轉輪盤 Logo（縮小版，半透明，緩慢旋轉）
- 粒子效果：金色亮片緩慢飄落（10-15顆）
- 底部：賭桌毛氈紋理疊加

---

### 6.2 遊戲主畫面（Game Screen）

#### 桌面版佈局（≥ 1024px）

```
┌──────────────────────────────────────────────────────┐
│  [← 返回]  ROULETTE         [⚙️] [🔊] [💾存檔]      │
├──────────────┬───────────────────────────────────────┤
│              │  ┌──────────────────────────────────┐ │
│   🤖 AI 面板  │  │        下 注 桌 面 板            │ │
│  ──────────  │  │   (SVG 繪製，含所有下注區域)     │ │
│  餘額: $XXX  │  │                                  │ │
│  已下: $XXX  │  │  ┌──┬──┬──┬──┬──┬──┬──┐        │ │
│              │  │  │ 0│ 1│ 2│ 3│ 4│ 5│ 6│...     │ │
│  AI 思考中.. │  │  ├──┼──┼──┼──┼──┼──┼──┤        │ │
│  ▓▓▓▓░░░░  │  │  │  │  │  │  │  │  │  │        │ │
│              │  │  └──┴──┴──┴──┴──┴──┴──┘        │ │
│ [輪盤畫布]   │  │  [1st12][2nd12][3rd12]          │ │
│  (Canvas)   │  │  [1-18][Even][Red|Blk][Odd][19-36]│ │
│  W: 380px   │  └──────────────────────────────────┘ │
│             │                                        │
│             │  ┌─籌碼選擇────────────────────────┐  │
│             │  │ [$5][$10][$25][$50][$100][$500] │  │
│             │  └────────────────────────────────┘  │
│             │                                        │
│             │  [清除下注]        [💫 轉 動!]         │
├─────────────┴──────────────────────────────────────┤
│  📊 歷史記錄：  🔴12  ⚫7  🔴34  ⚫11  🟢0  ...    │
└──────────────────────────────────────────────────────┘
```

#### 行動版佈局（< 768px）

```
┌────────────────────────┐
│ [←] ROULETTE  [⚙️][🔊]│
├────────────────────────┤
│                        │
│   [輪盤 Canvas]        │
│   (置中，最大 320px)   │
│                        │
├────────────────────────┤
│  玩家 $XXX │ AI $XXX  │
├────────────────────────┤
│                        │
│   [下注桌面板 SVG]     │
│   (水平可捲動)         │
│                        │
├────────────────────────┤
│ 籌碼：[$5][$25][$100] │
├────────────────────────┤
│  [清除]    [🎰 轉動]   │
└────────────────────────┘
│  底部固定操作列，       │
│  不遮擋輪盤            │
```

**行動版關鍵規則：**
- 底部操作列（籌碼+按鈕）固定在畫面底部，但輪盤與下注桌面板可滾動
- 操作列高度控制在 `80px` 以內
- 輪盤在操作列以上，永不被遮蓋

---

### 6.3 設定畫面（Settings）

```
┌────────────────────────────────┐
│  ⚙️ 設 定                [✕]  │
├────────────────────────────────┤
│                                │
│  🌍 語言 / Language / 言語     │
│  ┌──────────────────────────┐ │
│  │  🇹🇼 繁體中文  ◉         │ │
│  │  🇺🇸 English   ○         │ │
│  │  🇯🇵 日本語    ○         │ │
│  └──────────────────────────┘ │
│                                │
│  🎵 背景音樂                   │
│  ┌──────────────────────────┐ │
│  │  🔈────●──────────  65%  │ │
│  └──────────────────────────┘ │
│                                │
│  🔔 音效                       │
│  ┌──────────────────────────┐ │
│  │  🔈──────────●────  80%  │ │
│  └──────────────────────────┘ │
│                                │
│  🎨 顏色主題                   │
│  ┌──●──┬──○──┬──○──┬──○──┐  │
│  │經典  │皇家 │霓虹 │玫瑰 │  │
│  └─────┴─────┴─────┴─────┘  │
│        ┌──○──┐              │
│        │深夜  │              │
│        └─────┘              │
│                                │
│  🤖 AI 難度                    │
│  [🟢 簡單] [🟡 普通] [🔴 困難] │
│                                │
│  ────────────────────────────  │
│         [💾 儲存設定]           │
└────────────────────────────────┘
```

#### 設定元件規格

**滑桿（Slider）：**
```css
.settings-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--color-ui-secondary);
  outline: none;
}

.settings-slider::-webkit-slider-thumb {
  width: 28px;
  height: 28px;         /* 大拇指，行動裝置易操作 */
  border-radius: 50%;
  background: var(--color-ui-primary);
  box-shadow: 0 0 8px rgba(var(--color-ui-primary-rgb), 0.6);
  cursor: pointer;
}
```

**主題色卡：**
- 每個色卡：圓角矩形 `80px × 56px`
- 顯示主題預覽色（毛氈色 + 金屬邊框色）
- 選中狀態：發光框 + 勾選圖示

---

### 6.4 說明畫面（Help）

```
┌────────────────────────────────────┐
│  📖 遊戲說明               [✕]    │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 🎯 目標   │ 🎰 輪盤 │ 🃏 下注 │  │  ← Tab 導覽
│  └──────────────────────────────┘  │
│                                    │
│  ╔══════════════════════════════╗  │
│  ║  🎯 遊戲目標                ║  │
│  ╠══════════════════════════════╣  │
│  ║                              ║  │
│  ║  [輪盤示意圖 SVG]           ║  │
│  ║                              ║  │
│  ║  預測鋼球停落的位置，        ║  │
│  ║  下注並獲得相應獎勵！        ║  │
│  ╚══════════════════════════════╝  │
│                                    │
│  ┌─下注類型───────────────────────┐ │
│  │ 🔴 單一數字   賠率 35:1       │ │
│  │ ⬛ 紅/黑      賠率  1:1       │ │
│  │ 🔢 奇/偶      賠率  1:1       │ │
│  │ 📊 1-18/19-36 賠率  1:1       │ │
│  │ 📦 打 (Dozen) 賠率  2:1       │ │
│  │ 🔗 直列 (Col) 賠率  2:1       │ │
│  │ 2️⃣  兩數分注  賠率 17:1       │ │
│  │ 4️⃣  角注      賠率  8:1       │ │
│  └────────────────────────────────┘ │
│                                    │
│              [ ◀ ] [ ▶ ]           │
└────────────────────────────────────┘
```

---

## 7. 遊戲規則與邏輯

### 7.1 輪盤類型

**預設：歐式輪盤（European Roulette）**
- 數字：0 ~ 36，共 37 格
- 無雙零（00），降低莊家優勢（約 2.7%）

**可選：美式輪盤（American Roulette）**
- 數字：0 ~ 36 + 00，共 38 格
- 莊家優勢提高（約 5.26%）

### 7.2 數字排列（歐式）

```javascript
const WHEEL_ORDER_EUROPEAN = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
  13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
  20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
```

### 7.3 數字顏色對照

```javascript
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
];
// 0 = 綠色
// 其餘 = 黑色
```

### 7.4 下注類型與賠率

| 下注類型         | 英文名               | 覆蓋數字數 | 賠率     | 說明                        |
|------------------|----------------------|------------|----------|-----------------------------|
| 直注             | Straight Up          | 1          | 35:1     | 單一數字                    |
| 分注             | Split                | 2          | 17:1     | 相鄰兩數字                  |
| 街注             | Street               | 3          | 11:1     | 一行三個數字                |
| 角注             | Corner / Square      | 4          | 8:1      | 四個相鄰數字                |
| 五注             | Five / Basket        | 5          | 6:1      | 0,00,1,2,3（美式限定）      |
| 線注             | Six Line / Double St | 6          | 5:1      | 兩行六個數字                |
| 打               | Dozen                | 12         | 2:1      | 1-12, 13-24, 25-36          |
| 直列             | Column               | 12         | 2:1      | 縱向12個數字                |
| 低/高            | Low / High           | 18         | 1:1      | 1-18 / 19-36                |
| 奇/偶            | Odd / Even           | 18         | 1:1      | 奇數 / 偶數                 |
| 紅/黑            | Red / Black          | 18         | 1:1      | 紅色 / 黑色                 |

### 7.5 籌碼面額

```javascript
const CHIP_VALUES = [5, 10, 25, 50, 100, 500, 1000];
```

- 桌面版：顯示全部 7 種
- 行動版：預設顯示 5 種，可滑動切換

### 7.6 遊戲流程

```
1. 玩家選擇籌碼面額
2. 玩家點擊下注桌面板下注（可多次）
3. AI 根據難度策略下注（自動執行）
4. 玩家點擊「轉動」
5. 輪盤旋轉動畫（約 5-8 秒）
6. 鋼球落定，顯示結果數字
7. 計算所有下注的輸贏
8. 派彩/扣款，更新雙方餘額
9. 顯示本輪結果（Toast + 動畫）
10. 記錄至歷史列表
11. 玩家可繼續下一輪或退出
```

### 7.7 遊戲結束條件

- 玩家籌碼歸零 → 顯示「遊戲結束」畫面
- AI 籌碼歸零 → 顯示「恭喜獲勝！」畫面
- 任一方可在輪間選擇「離開」

### 7.8 初始籌碼設定

| 難度 | 玩家起始籌碼 | AI 起始籌碼 | 目標籌碼   |
|------|--------------|-------------|------------|
| 簡單 | $5,000       | $2,000      | $10,000    |
| 普通 | $3,000       | $3,000      | $8,000     |
| 困難 | $2,000       | $5,000      | $6,000     |

---

## 8. AI 對手系統

### 8.1 設計原則

AI 的核心設計目標是讓玩家感受到「真實對手」的存在感，而非純粹隨機。

### 8.2 難度系統

#### 🟢 簡單（Easy）

```javascript
const EasyAI = {
  betRatio: 0.05,        // 每輪下注最多5%的餘額
  chipDiversity: 1,       // 僅押1種類型
  patternRecognition: 0,  // 不分析歷史
  bluffRate: 0,           // 不虛張聲勢
  strategy: 'random',     // 完全隨機選擇下注類型和位置

  decideBet(gameState) {
    const betAmount = Math.floor(gameState.aiBalance * this.betRatio);
    const betType = randomPick(['red', 'black', 'odd', 'even', 'low', 'high']);
    return [{ type: betType, amount: betAmount }];
  }
};
```

**特徵：**
- 每輪只下一種外注（紅/黑/奇/偶等 1:1 賠率）
- 下注金額保守（餘額 3-5%）
- 思考時間：0.5-1 秒（顯示偽裝延遲）
- 不考慮玩家的策略

#### 🟡 普通（Normal）

```javascript
const NormalAI = {
  betRatio: 0.08,         // 每輪下注最多8%的餘額
  chipDiversity: 3,        // 可押2-3種類型
  patternRecognition: 0.3, // 30%機率參考最近5輪
  bluffRate: 0.1,          // 10%機率模仿玩家下注
  strategy: 'mixed',       // 混合外注與打注

  decideBet(gameState) {
    const bets = [];
    // 主注：外注
    bets.push(this.makeOuterBet(gameState));
    // 副注：偶爾加打注
    if (Math.random() < 0.4) bets.push(this.makeDozenBet(gameState));
    // 偶爾跟注玩家
    if (Math.random() < this.bluffRate) bets.push(this.mirrorPlayerBet(gameState));
    return bets;
  }
};
```

**特徵：**
- 混合外注 + 打注 / 列注
- 偶爾分析最近5輪結果做熱/冷號判斷
- 下注金額中等（餘額 5-8%）
- 偶爾跟隨玩家的下注類型

#### 🔴 困難（Hard）

```javascript
const HardAI = {
  betRatio: 0.12,          // 每輪下注最多12%的餘額
  chipDiversity: 5,         // 最多5種類型同時下注
  patternRecognition: 0.7,  // 70%機率分析近10輪
  bluffRate: 0.25,          // 25%機率假裝放棄（實際跟注）
  martingaleProb: 0.3,      // 30%機率使用倍投策略
  strategy: 'adaptive',     // 自適應策略

  decideBet(gameState) {
    // 分析玩家下注模式
    const playerPattern = this.analyzePlayerBets(gameState.betHistory);
    // 計算熱/冷號
    const hotNumbers = this.getHotNumbers(gameState.resultHistory);
    // 決策：反制玩家 or 跟熱號 or 馬丁格爾
    return this.adaptiveDecision(playerPattern, hotNumbers, gameState);
  },

  analyzePlayerBets(history) {
    // 統計玩家偏好的下注類型
    // 返回高頻下注類型，AI 可選擇跟注或反制
  }
};
```

**特徵：**
- 分析玩家的下注歷史，學習偏好
- 使用倍投策略（Martingale）對抗連輸
- 分散下注降低風險（多種類型同時下注）
- 假裝不下注但偷偷押注（UI 顯示延遲）
- 思考時間：1.5-3 秒（展示計算感）

### 8.3 AI 面板 UI

```
┌─────────────────────┐
│  🤖 AI 對手         │
│  難度：[困難 🔴]    │
│  ─────────────────  │
│  餘額：$3,420       │
│  本輪下注：$280      │
│                     │
│  ⏳ 思考中... ████░ │
│                     │
│  下注區域：[隱藏]    │
│  （結算後顯示）      │
└─────────────────────┘
```

- AI 的下注在輪盤旋轉前不顯示（增加懸念）
- 輪盤停止後才揭曉 AI 的押注位置（動畫效果）

---

## 9. 音效與 BGM 規格

### 9.1 BGM 規格

| 項目     | 規格                                        |
|----------|---------------------------------------------|
| 風格     | 鋼琴輕快（upbeat piano jazz / lounge）      |
| 節奏     | 中快板，約 120-140 BPM                      |
| 情緒     | 愉悅、輕鬆、帶期待感                        |
| 格式     | MP3（主）/ OGG（備用）                      |
| 音量     | 遊戲內音量為原始音量的 **5倍**（使用增益節點） |
| 循環     | 無縫循環播放                                |
| 淡入淡出 | 畫面切換時 0.5s 淡出，0.5s 淡入             |

#### BGM 音量放大實作（Web Audio API）

```javascript
// AudioManager.js
class BGMPlayer {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
    // 遊戲內 BGM 音量 × 5
    this.setGameVolume(userSettings.bgmVolume);
  }

  setGameVolume(normalizedVolume) {
    // normalizedVolume: 0.0 ~ 1.0（使用者設定值）
    // 乘以 5 倍增益
    const gainValue = normalizedVolume * 5.0;
    this.gainNode.gain.setTargetAtTime(gainValue, this.audioCtx.currentTime, 0.05);
  }
}
```

### 9.2 音效規格

| 事件           | 音效描述                        | 時長   | 音調   |
|----------------|--------------------------------|--------|--------|
| 按鈕點擊       | 高音輕脆「叮」                 | 50ms   | C6     |
| 籌碼放置       | 硬幣輕敲桌面「嗒」             | 80ms   | E5     |
| 輪盤開始旋轉   | 機械啟動「嗡嗡聲」漸強         | 500ms  | F2~F4  |
| 輪盤持續旋轉   | 平穩旋轉「呼呼聲」             | 循環   | G2     |
| 鋼球滾動       | 高頻彈跳滾動聲                 | 循環   | A4~A5  |
| 鋼球落入格槽   | 清脆「咔嗒」                   | 150ms  | B5     |
| 贏注           | 上揚音階「叮叮叮」             | 600ms  | C5-E5-G5-C6 |
| 失注           | 低沉短促「嗡」                 | 300ms  | G3     |
| 清除下注       | 輕掃聲                         | 200ms  | D4     |
| 籌碼收回       | 多個硬幣堆疊聲                 | 400ms  | 隨機G4~G5 |

#### 音效合成（Web Audio API，無需外部檔案）

```javascript
// AudioSynthesizer.js
class AudioSynthesizer {
  // 高音輕脆點擊音（預設音效）
  static playClick(audioCtx) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);       // 高音C6
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  // 贏注歡樂音效
  static playWin(audioCtx) {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0, audioCtx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.12);
      osc.stop(audioCtx.currentTime + i * 0.12 + 0.2);
    });
  }
}
```

### 9.3 音量設定結構

```javascript
const AudioSettings = {
  bgmVolume: 0.6,        // 0.0 ~ 1.0（乘5後實際為 3.0 gain）
  sfxVolume: 0.8,        // 0.0 ~ 1.0
  bgmEnabled: true,
  sfxEnabled: true,
};
```

---

## 10. RWD 響應式設計

### 10.1 Breakpoints

```css
/* mobile-first 策略 */
/* 手機：預設（< 480px）*/
/* 大手機 / 小平板：480px ~ 767px */
@media (min-width: 480px) { /* ... */ }
/* 平板：768px ~ 1023px */
@media (min-width: 768px) { /* ... */ }
/* 桌面：1024px ~ 1439px */
@media (min-width: 1024px) { /* ... */ }
/* 大螢幕：≥ 1440px */
@media (min-width: 1440px) { /* ... */ }
```

### 10.2 各斷點佈局策略

#### 手機（< 480px）

```
垂直堆疊佈局：
- 輪盤置頂，最大寬度 100vw - 32px
- 輪盤高度：min(45vw, 240px) × 2（含保留空間）
- 下注板水平可滾動
- 底部 fixed 操作列：height 72px，含籌碼+轉動按鈕
- 主內容 padding-bottom: 80px（避免被底部列遮擋）
```

#### 平板（768px ~ 1023px）

```
上下分割佈局：
- 上半部：輪盤（50%）
- 下半部：下注板（50%，可滾動）
- 側欄收折，用抽屜覆蓋顯示 AI 資訊
- 操作列整合至下注板底部
```

#### 桌面（≥ 1024px）

```
三欄佈局：
- 左欄（240px）：AI 面板 + 輪盤
- 中欄（flex-grow）：下注桌面板
- 下方：籌碼選擇 + 操作按鈕
```

### 10.3 操作列不遮擋規則

```css
/* 遊戲主內容區域 */
.game-content {
  /* 底部預留操作列高度 + 安全距離 */
  padding-bottom: calc(var(--action-bar-height) + env(safe-area-inset-bottom));
}

/* 固定底部操作列 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--action-bar-height, 72px);
  /* 加入 iOS 安全區域 */
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(var(--color-bg-rgb), 0.92);
  border-top: 1px solid var(--color-ui-primary);
}

/* 行動裝置變數覆蓋 */
@media (max-width: 767px) {
  :root {
    --action-bar-height: 72px;
  }
}
```

### 10.4 觸控優化

```css
/* 最小觸控目標：44px × 44px（Apple HIG 建議） */
.btn, .chip, .bet-cell {
  min-height: 44px;
  min-width: 44px;
}

/* 行動裝置下注格放大 */
@media (max-width: 767px) {
  .bet-cell {
    min-height: 48px;
    font-size: var(--text-base);
  }
}

/* 禁止雙擊縮放 */
* { touch-action: manipulation; }
```

---

## 11. 動畫與視覺效果

### 11.1 輪盤旋轉動畫（Canvas）

```javascript
class RouletteWheel {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.outerAngle = 0;       // 外框角度（靜止）
    this.innerAngle = 0;       // 內盤角度（旋轉）
    this.ballAngle = 0;        // 鋼球角度
    this.ballRadius = 0;       // 鋼球距中心半徑
    this.spinning = false;
    this.spinVelocity = 0;
    this.deceleration = 0.995; // 旋轉減速係數
  }

  spin() {
    // 初始角速度：8~12 rad/s（模擬真實旋轉力道）
    this.spinVelocity = 8 + Math.random() * 4;
    this.ballRadius = this.wheelRadius * 0.88; // 鋼球初始在外圈
    this.spinning = true;
    this.animate();
  }

  animate() {
    if (!this.spinning) return;

    // 更新內盤（與鋼球反向旋轉）
    this.innerAngle += this.spinVelocity / 60;

    // 鋼球物理：
    // 1. 鋼球順著外圈旋轉（高速）
    // 2. 旋轉減速，鋼球半徑縮小（向心力降低）
    // 3. 進入格槽跳動
    this.spinVelocity *= this.deceleration;
    this.ballAngle -= this.spinVelocity * 1.5 / 60; // 反向旋轉

    if (this.spinVelocity < 2) {
      // 鋼球開始向中心下落
      this.ballRadius = lerp(this.ballRadius, this.wheelRadius * 0.65, 0.03);
    }

    if (this.spinVelocity < 0.05) {
      this.spinning = false;
      this.onSpinEnd(this.calculateResult());
    }

    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
```

### 11.2 粒子效果（獲勝時）

```javascript
// 獲勝時：金色粒子爆炸
function triggerWinParticles(x, y) {
  const particles = Array.from({ length: 40 }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 10 - 5,
    size: Math.random() * 8 + 4,
    color: ['#FFD700', '#FFA500', '#FF6B6B', '#4CAF50'][Math.floor(Math.random() * 4)],
    life: 1.0,
    decay: 0.02 + Math.random() * 0.03
  }));
  animateParticles(particles);
}
```

### 11.3 畫面切換動畫

```css
/* 畫面進入 */
.screen {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}

.screen.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* 覆蓋層淡入淡出 */
.screen-overlay {
  transition: opacity 0.25s ease;
}
```

### 11.4 籌碼飛行動畫

當玩家下注時，籌碼從選擇區飛至下注格：

```javascript
function animateChipFly(fromEl, toEl, value) {
  const chip = createChipElement(value);
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  chip.style.cssText = `
    position: fixed;
    left: ${fromRect.left}px;
    top: ${fromRect.top}px;
    width: ${fromRect.width}px;
    height: ${fromRect.height}px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 9999;
  `;

  document.body.appendChild(chip);
  requestAnimationFrame(() => {
    chip.style.left = `${toRect.left}px`;
    chip.style.top = `${toRect.top}px`;
  });

  setTimeout(() => chip.remove(), 380);
}
```

### 11.5 數字揭曉動畫

```javascript
// 輪盤停止後，聚光燈打在結果格上
function revealResult(number, color) {
  // 1. 輪盤中央顯示大數字（縮放動畫）
  // 2. 下注板對應格子發光 + 脈衝
  // 3. 贏的下注格：金色光效
  // 4. 計算文字從上方飛入（+$XXX 或 -$XXX）
}
```

---

## 12. 狀態管理與存檔

### 12.1 GameState 結構

```javascript
const GameState = {
  // 遊戲基本資訊
  gameId: null,           // 存檔 ID
  difficulty: 'normal',   // 難度
  round: 1,               // 當前輪數

  // 玩家狀態
  player: {
    balance: 3000,        // 當前籌碼
    totalBet: 0,          // 本輪總下注
    bets: [],             // 本輪下注列表 [{type, cells, amount}]
    winHistory: [],       // 輸贏歷史
  },

  // AI 狀態
  ai: {
    balance: 3000,
    totalBet: 0,
    bets: [],
    strategy: null,       // 當前採用的策略
    thinkingDuration: 0,  // 模擬思考時間（ms）
  },

  // 輪盤狀態
  wheel: {
    type: 'european',     // 輪盤類型
    lastResults: [],      // 最近 20 輪結果
    currentResult: null,  // 本輪結果
    isSpinning: false,
  },

  // 設定快照（遊戲中不變）
  settings: { /* ... */ }
};
```

### 12.2 存檔資料（localStorage）

```javascript
// Key: 'roulette_save_v1'
const SaveData = {
  version: '1.0.0',
  savedAt: '2026-06-24T10:00:00Z',
  settings: {
    language: 'zh-TW',
    bgmVolume: 0.6,
    sfxVolume: 0.8,
    theme: 'classic',
    difficulty: 'normal',
    wheelType: 'european',
  },
  game: {
    // GameState 的序列化版本
    difficulty: 'normal',
    round: 5,
    player: { balance: 4200, winHistory: [200, -100, 350, -50, 0] },
    ai: { balance: 2800 },
    wheel: { lastResults: [7, 14, 32, 0, 21, 3, 17] }
  }
};
```

### 12.3 存檔觸發時機

- 每輪結束後自動存檔
- 使用者主動按「儲存」
- 離開遊戲畫面前自動儲存

---

## 13. 設定系統

### 13.1 設定項目完整列表

```javascript
const DEFAULT_SETTINGS = {
  // 語系
  language: 'zh-TW',           // 'zh-TW' | 'en' | 'ja'

  // 音效
  bgmVolume: 0.6,              // 0.0 ~ 1.0
  sfxVolume: 0.8,
  bgmEnabled: true,
  sfxEnabled: true,

  // 視覺
  theme: 'classic',            // 'classic' | 'royal' | 'neon' | 'rose' | 'midnight'
  animationSpeed: 'normal',    // 'slow' | 'normal' | 'fast'
  showHistory: true,

  // 遊戲
  difficulty: 'normal',        // 'easy' | 'normal' | 'hard'
  wheelType: 'european',       // 'european' | 'american'
  startingBalance: 3000,
};
```

### 13.2 設定按鈕設計規範

```css
/* 難度選擇按鈕 */
.difficulty-btn {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);     /* 24px */
  font-weight: var(--weight-bold);
  border-radius: 12px;
  border: 2px solid transparent;
  min-width: 100px;
  min-height: 52px;               /* 易觸控 */
  transition: all 0.2s ease;
  cursor: pointer;
}

.difficulty-btn[data-value="easy"].active {
  background: #2E7D32;
  border-color: #A5D6A7;
  box-shadow: 0 0 16px rgba(76, 175, 80, 0.4);
}

.difficulty-btn[data-value="normal"].active {
  background: #F57F17;
  border-color: #FFE082;
  box-shadow: 0 0 16px rgba(255, 179, 0, 0.4);
}

.difficulty-btn[data-value="hard"].active {
  background: #B71C1C;
  border-color: #EF9A9A;
  box-shadow: 0 0 16px rgba(244, 67, 54, 0.4);
}
```

---

## 14. 說明頁面規格

### 14.1 說明頁面分頁結構

```
Tab 1: 🎯 遊戲目標
Tab 2: 🎰 輪盤介紹
Tab 3: 🃏 下注類型
Tab 4: 💰 賠率計算
Tab 5: 🤖 AI 對手
Tab 6: ⌨️ 操作說明
```

### 14.2 各頁內容規格

#### Tab 1：遊戲目標
```
圖示：🎯 大型 SVG 輪盤示意圖
內容：
• 遊戲目的（2-3 句）
• 玩家 vs AI 的對戰目標
• 勝利條件
```

#### Tab 2：輪盤介紹
```
圖示：互動式輪盤圖，滑鼠懸停顯示數字顏色說明
內容：
• 歐式 vs 美式輪盤差異
• 數字顏色說明（表格）
• 格槽排列順序
```

#### Tab 3：下注類型（關鍵頁，需大量圖示）
```
每種下注類型：
┌─────────────────────────────────┐
│  [圖示圖 SVG]  直注（Straight） │
│  覆蓋：1個數字                  │
│  賠率：🏆 35:1                  │
│  範例：下注$10 → 贏$350         │
└─────────────────────────────────┘
```

#### Tab 4：賠率計算
```
互動式計算器：
  選擇下注類型 → 輸入金額 → 顯示可能獲利

  [分注 ▼]  下注金額：[$____]
  ▸ 贏得：$XXX（本金 + 獎金）
  ▸ 勝率：5.4%
```

### 14.3 說明頁面視覺要求

- 圖示：每個下注類型使用 SVG 示意圖（棋盤格標示覆蓋區域）
- 顏色：使用當前主題色，確保對比度達 AA 標準
- 字體大小：最小 `var(--text-base)` = 20px
- 間距：各區塊保持 `var(--space-6)` 以上
- 圖示大小：說明圖示最小 32px × 32px

---

## 15. 錯誤處理

### 15.1 錯誤情境與處理

| 情境                      | 處理方式                                         |
|---------------------------|--------------------------------------------------|
| AudioContext 未支援       | 靜默降級，隱藏音量控制，顯示提示                |
| localStorage 不可用       | 遊戲仍可進行，提示「存檔功能不可用」            |
| Canvas 不支援            | 顯示靜態輪盤圖片替代方案                        |
| 字型載入失敗              | 使用系統字型 fallback，功能不受影響             |
| 玩家籌碼不足以下注        | 顯示 Toast 提示「籌碼不足」，阻止下注           |
| 旋轉中嘗試操作            | 所有下注按鈕 `pointer-events: none`，視覺鎖定   |

### 15.2 Toast 通知規格

```javascript
// 顯示時間：成功 2s，錯誤 3s，警告 2.5s
const ToastTypes = {
  success: { icon: '✅', duration: 2000, color: '#4CAF50' },
  error:   { icon: '❌', duration: 3000, color: '#F44336' },
  warning: { icon: '⚠️', duration: 2500, color: '#FF9800' },
  info:    { icon: 'ℹ️', duration: 2000, color: '#2196F3' },
};
```

---

## 16. 效能規範

### 16.1 Canvas 效能

- 輪盤 Canvas 解析度：`devicePixelRatio * 400px`（支援 Retina）
- 動畫使用 `requestAnimationFrame`，目標 60fps
- 不旋轉時停止動畫循環
- Canvas 分層：靜態背景層（單次繪製）+ 動態鋼球層（每幀更新）

### 16.2 DOM 效能

- 下注格使用事件委派（Event Delegation），不為每格綁定事件
- 歷史記錄最多顯示 30 筆，超過則移除最舊的 DOM 節點
- 籌碼動畫使用 CSS Transform（GPU 加速），不改變 Layout 屬性

### 16.3 記憶體管理

```javascript
// 遊戲結束或切換畫面時清理
function cleanup() {
  cancelAnimationFrame(animationFrameId);
  audioCtx?.close();
  removeAllEventListeners();
}
```

---

## 17. 瀏覽器相容性

### 17.1 支援瀏覽器

| 瀏覽器          | 最低版本 | 說明                                   |
|-----------------|----------|----------------------------------------|
| Chrome / Edge   | 88+      | 完整支援                               |
| Firefox         | 85+      | 完整支援                               |
| Safari          | 14+      | 需注意 AudioContext 需使用者互動才啟動 |
| iOS Safari      | 14.5+    | 需注意 `env(safe-area-inset-bottom)`   |
| Android Chrome  | 88+      | 完整支援                               |

### 17.2 Safari 特殊處理

```javascript
// Safari 需要使用者互動後才能啟動 AudioContext
document.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });
```

### 17.3 Progressive Enhancement

1. **基礎層**：HTML 結構正確顯示
2. **增強層**：CSS 主題與動畫
3. **完整層**：Canvas 輪盤 + Web Audio API

---

## 附錄 A：下注桌面板數字排列（SVG 座標參考）

```
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│    │ 3  │ 6  │ 9  │ 12 │ 15 │ 18 │ 21 │ 24 │ 27 │ 30 │ 33 │ 36 │ ← 上行（紅）
│ 0  ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
│    │ 2  │ 5  │ 8  │ 11 │ 14 │ 17 │ 20 │ 23 │ 26 │ 29 │ 32 │ 35 │ ← 中行（黑）
│    ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
│    │ 1  │ 4  │ 7  │ 10 │ 13 │ 16 │ 19 │ 22 │ 25 │ 28 │ 31 │ 34 │ ← 下行（紅）
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
     │   1st Dozen   │   2nd Dozen   │   3rd Dozen   │
     └───────────────┴───────────────┴───────────────┘
┌────────┬────────┬────────┬────────┬────────┬────────┐
│  1-18  │  Even  │  Red   │ Black  │  Odd   │ 19-36  │
└────────┴────────┴────────┴────────┴────────┴────────┘
```

---

## 附錄 B：歷史記錄球顏色對照

```javascript
function getResultColor(number) {
  if (number === 0 || number === '00') return 'green';
  if (RED_NUMBERS.includes(number)) return 'red';
  return 'black';
}

// 歷史列表顯示：
// 🔴 數字（紅色格）
// ⚫ 數字（黑色格）
// 🟢 0 / 00（綠色格）
```

---

## 附錄 C：開發優先順序

```
Phase 1（核心）：
  ✓ index.html 基本結構
  ✓ CSS 變數與主題系統
  ✓ 主選單畫面
  ✓ 遊戲畫面佈局（無動畫）
  ✓ 下注桌面板 SVG
  ✓ 基本下注邏輯與派彩

Phase 2（輪盤）：
  ✓ Canvas 輪盤靜態繪製
  ✓ 輪盤旋轉動畫
  ✓ 鋼球物理動畫
  ✓ 結果計算

Phase 3（AI & 音效）：
  ✓ AI 三難度實作
  ✓ Web Audio API 音效
  ✓ BGM 播放（5倍音量）

Phase 4（完整功能）：
  ✓ 多國語系
  ✓ 設定頁面
  ✓ 說明頁面（含圖示）
  ✓ 存檔/讀檔
  ✓ RWD 全斷點測試
  ✓ 五種色彩主題
  ✓ 粒子 & 獲勝動畫

Phase 5（優化）：
  ✓ 效能優化
  ✓ 跨瀏覽器測試
  ✓ 可及性（Accessibility）調整
```

---

*本規格書由 Claude 生成，版本 1.0.0，適用於純前端輪盤遊戲開發專案。*
