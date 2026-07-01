# 🎮 Dots and Boxes ／ 點格棋 ／ ドット・アンド・ボックス

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Build](https://img.shields.io/badge/Zero--Build-✓-brightgreen?style=flat-square)](#)
[![Offline](https://img.shields.io/badge/Offline-Ready-blue?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

**A pure front-end, zero-build Dots and Boxes web game · 純前端零建置點格棋遊戲 · 純フロントエンド・ゼロビルドのドット&ボックス**

> 🚀 Just double-click `index.html` and play instantly — no Node.js, no npm, no server needed.

</div>

---

## 🌐 Language Navigation ／ 語言導覽 ／ 言語ナビゲーション

| 🇬🇧 English | 🇹🇼 繁體中文 | 🇯🇵 日本語 |
|:---:|:---:|:---:|
| [▶ Go to English Section](#-english) | [▶ 前往中文區塊](#-繁體中文) | [▶ 日本語セクションへ](#-日本語) |

---

---

# 🇬🇧 English

## 📑 Table of Contents

- [🎯 Game Introduction](#-game-introduction)
- [▶️ How to Launch](#️-how-to-launch)
- [🕹️ Gameplay Guide](#️-gameplay-guide)
  - [Basic Rules](#basic-rules)
  - [Scoring](#scoring)
  - [Board Sizes](#board-sizes)
  - [AI Difficulty](#ai-difficulty)
  - [Game Modes](#game-modes)
- [✨ Features](#-features)
- [🗂️ Code Architecture](#️-code-architecture)
  - [Directory Structure](#directory-structure)
  - [CSS Classification](#css-classification)
  - [JavaScript Classification](#javascript-classification)
- [🎨 Themes](#-themes)
- [🔊 Audio System](#-audio-system)
- [🌐 Internationalization (i18n)](#-internationalization-i18n)
- [📱 Responsive Design](#-responsive-design)

---

## 🎯 Game Introduction

**Dots and Boxes** is a classic two-player pencil-and-paper strategy game, reimagined as a modern single-page web app. This project is a fully offline, zero-dependency implementation where you challenge an AI opponent at three difficulty levels.

| 🏷️ Feature | 📋 Detail |
|---|---|
| 🎮 Game Type | Turn-based strategy / Board game |
| 👥 Players | 1 Player vs AI |
| 🖥️ Platform | Any modern browser (Chrome, Edge, Safari, Firefox) |
| 📦 Dependencies | **Zero** — no npm, no build tools |
| 🌐 Offline | Fully playable without internet |
| 📱 Responsive | Mobile, Tablet, and Desktop |

---

## ▶️ How to Launch

```
1. Download or clone this repository
2. Open the folder in File Explorer
3. Double-click  index.html
4. The game opens instantly in your browser ✅
```

> ⚠️ **No installation required.** No Node.js, no npm install, no `live-server`. Just open the file directly.

---

## 🕹️ Gameplay Guide

### Basic Rules

```
🔵 Dots are arranged in a grid.
        ●───────●───────●
        │               │
        │               │
        ●       ●       ●
        │               │
        │               │
        ●───────●───────●

1. Players take turns drawing ONE line between two adjacent dots.
2. Lines can be horizontal or vertical only.
3. A line that was already drawn cannot be redrawn.
```

### Scoring

```
📦 When a player draws the FOURTH side of a 1×1 box:

    ●───────●
    │  YOU  │   ← You drew the last (4th) line → You claim this box!
    ●───────●

✅ The box is marked with YOUR color / symbol.
✅ You earn +1 point.
✅ You get a BONUS TURN — draw another line immediately!
```

### Board Sizes

| Size | Boxes | Recommended For | Approx. Duration |
|:---:|:---:|:---:|:---:|
| 3 × 3 | 9 | Quick match / Beginners | ⚡ 2–3 min |
| 4 × 4 | 16 | Standard (Recommended) | 🕐 5–10 min |
| 5 × 5 | 25 | Advanced players | 🕑 10–20 min |
| 6 × 6 | 36 | Expert / Long match | 🕒 20–30 min |

### AI Difficulty

| Level | Icon | Behavior | Strategy |
|:---:|:---:|---|---|
| Easy | 😊 | Mostly random moves, occasionally grabs open boxes | No chain avoidance |
| Normal | 🧐 | Always grabs available boxes; avoids obvious giveaways | Greedy, no deep analysis |
| Hard | 😤 | Full chain analysis + Double-cross strategy | Near-optimal play |

**Hard AI Strategy Details:**
- 🔗 **Chain Analysis** — identifies chains and loops in the remaining board
- ♟️ **Double-Cross** — deliberately leaves 2 boxes in a long chain to force the opponent to open the next chain
- 🧮 **Long-chain control** — sacrifices short chains to retain long chains for big scoring runs

### Game Modes

```
Main Menu
    │
    ├── ▶ New Game ──→ Select Board Size ──→ Select Difficulty ──→ Select First Player ──→ 🎮 Start!
    │
    ├── ↺ Continue  ──→ Restores your saved game (only shown if a save exists)
    │
    ├── ? How to Play ──→ Illustrated rule guide
    │
    └── ⚙ Settings  ──→ Theme / Volume / Language / Vibration / Clear Save
```

---

## ✨ Features

| 🌟 Feature | 📝 Description |
|---|---|
| 🤖 3-Level AI | Easy / Normal / Hard with distinct strategies |
| 🎨 6 Visual Themes | Classic / Candy / Ocean / Forest / Night / Sakura |
| 🌐 3 Languages | 繁體中文 / English / 日本語 |
| 🔊 Full Audio | BGM + 7 sound effects with independent volume control |
| 💾 Auto Save | Game state saved to `localStorage`; resume anytime |
| 📱 RWD | Fully responsive across phone, tablet, and desktop |
| ♿ Accessibility | ARIA labels, large fonts, high-contrast colors |
| ⚡ Zero Build | No frameworks, no npm, no bundler — just open and play |

---

## 🗂️ Code Architecture

### Directory Structure

```
dots-and-boxes/
│
├── 📄 index.html                    # Single entry point — double-click to launch
│
├── 🎨 css/
│   ├── base/                        # Foundation layer
│   │   ├── reset.css                # CSS Reset / Normalize
│   │   ├── variables.css            # Design tokens (colors, spacing, radius)
│   │   ├── typography.css           # Font stack, sizes, weights
│   │   └── animations.css           # Shared keyframe animations
│   │
│   ├── layout/                      # Layout layer
│   │   ├── header.css               # Top bar (back button, title, settings)
│   │   ├── responsive.css           # Breakpoints & RWD media queries
│   │   └── safe-area.css            # iPhone notch / gesture bar handling
│   │
│   ├── pages/                       # Page-specific styles
│   │   ├── main-menu.css            # Home screen
│   │   ├── game-board.css           # Game board during play
│   │   ├── settings.css             # Settings page
│   │   ├── how-to-play.css          # Instructions page
│   │   └── result-modal.css         # End-game result modal
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── buttons.css              # Button variants + touch feedback
│   │   ├── modal.css                # Modal dialogs
│   │   ├── toggle-switch.css        # Toggle on/off switch
│   │   ├── slider.css               # Volume slider
│   │   ├── dropdown.css             # Language / theme dropdowns
│   │   └── loading.css              # AI "thinking" loading animation
│   │
│   └── themes/                      # Visual theme overrides
│       ├── theme-classic.css        # Warm wood / board-game classic
│       ├── theme-candy.css          # Pastel candy colors
│       ├── theme-ocean.css          # Blue-green ocean gradient
│       ├── theme-forest.css         # Deep green forest tones
│       ├── theme-night.css          # Dark mode / neon night
│       └── theme-sakura.css         # Soft pink sakura
│
├── ⚙️ js/
│   ├── utils/                       # Layer 1: Utilities
│   ├── data/                        # Layer 2: Data / Constants
│   ├── core/                        # Layer 3: Game Logic
│   ├── ai/                          # Layer 4: AI Engine
│   ├── audio/                       # Layer 5: Audio System
│   ├── i18n/                        # Layer 6: Localization
│   ├── ui/                          # Layer 7: UI Controllers
│   └── main.js                      # Layer 8: Entry Point
│
└── 📄 README.md
```

---

### CSS Classification

The CSS follows a **5-layer architecture** — each layer has a clear responsibility and build order:

```
Base → Layout → Components → Pages → Themes
```

| Layer | Folder | Purpose |
|:---:|---|---|
| 1️⃣ Base | `css/base/` | Global resets, CSS variables (design tokens), typography rules, and shared animations |
| 2️⃣ Layout | `css/layout/` | Header bar, breakpoints (RWD), and device safe-area insets |
| 3️⃣ Components | `css/components/` | Self-contained reusable UI elements (buttons, modals, sliders, toggles) |
| 4️⃣ Pages | `css/pages/` | Full-page layout and styling for each screen of the app |
| 5️⃣ Themes | `css/themes/` | Color overrides applied via `body[data-theme="..."]` attribute |

---

### JavaScript Classification

The JavaScript follows an **8-layer architecture** loaded in strict dependency order:

```
Utils → Data → Core → AI → Audio → i18n → UI → main.js
```

| Layer | Folder / File | Files | Responsibility |
|:---:|---|:---:|---|
| 1️⃣ Utils | `js/utils/` | 4 | DOM helpers, localStorage wrapper, coordinate math, event emitter |
| 2️⃣ Data | `js/data/` | 5 | Game constants, i18n dictionaries (zh-TW / en-US / ja-JP), theme metadata |
| 3️⃣ Core | `js/core/` | 4 | Board data model, game engine (move/score/turn), rules validator, save manager |
| 4️⃣ AI | `js/ai/` | 5 | AI controller, easy/normal/hard logic modules, chain analyzer algorithm |
| 5️⃣ Audio | `js/audio/` | 2 | Audio manager (BGM + SFX with Web Audio API gain), sound file map |
| 6️⃣ i18n | `js/i18n/` | 1 | Language switching engine, DOM text replacement, `lang` attribute sync |
| 7️⃣ UI | `js/ui/` | 8 | Router, board SVG renderer, menu/game/settings/result UI controllers, theme switcher |
| 8️⃣ Entry | `js/main.js` | 1 | App bootstrap — initializes all modules in correct order |

**Key JavaScript Files:**

| File | Role |
|---|---|
| `js/core/board-model.js` | Defines the board state: dots, horizontal lines, vertical lines, boxes, scores, turn, status |
| `js/core/game-engine.js` | Processes each move: validates → marks line → checks box completion → switches turn |
| `js/ai/chain-analyzer.js` | Identifies chains and loops in the board graph for Hard AI strategy |
| `js/ui/board-renderer.js` | Renders the entire board as interactive SVG; handles hover preview and click events |
| `js/audio/audio-manager.js` | Dual-track audio (BGM × 5 gain + SFX); fade in/out on page transitions |
| `js/i18n/i18n-manager.js` | Scans all `[data-i18n]` DOM nodes and replaces text on language switch |

---

## 🎨 Themes

| Theme | Code | Style |
|:---:|:---:|---|
| 🪵 Classic Wood | `classic` | Warm beige board, dark brown lines, amber accents — default |
| 🍬 Candy Pop | `candy` | Purple-pink gradient, macaron palette, vibrant accents |
| 🌊 Ocean Blue | `ocean` | Blue-green gradient, white lines, coral orange accent |
| 🌲 Forest Green | `forest` | Deep/light greens, wood-grain grid, sunshine yellow accent |
| 🌙 Night Dark | `night` | Deep blue-purple bg, cyan lines, neon pink accent (eye-friendly) |
| 🌸 Sakura Pink | `sakura` | Soft pink bg, white lines, cherry-blossom red accent |

Switch themes instantly from **Settings → Theme Color** — no page reload required.

---

## 🔊 Audio System

| Event | File | Description |
|---|---|---|
| Draw a line | `line-draw.mp3` | Short crisp "ding" |
| Complete a box | `box-complete.mp3` | Bright rising double chime |
| Button tap | `button-tap.mp3` | Light "tap" click |
| Turn switch | `turn-switch.mp3` | Gentle "ding-dong" |
| Victory 🏆 | `victory.mp3` | Bright ascending melody (2–3 sec) |
| Defeat 😞 | `defeat.mp3` | Soft, non-harsh short motif |
| Draw 🤝 | `draw.mp3` | Neutral, playful short phrase |

**BGM is boosted ×5 during gameplay** via `Web Audio API GainNode`, with a `DynamicsCompressorNode` limiter to prevent clipping.

---

## 🌐 Internationalization (i18n)

| Language | Code | File |
|:---:|:---:|---|
| 🇹🇼 Traditional Chinese | `zh-TW` | `js/data/i18n/zh-TW.js` |
| 🇬🇧 English | `en-US` | `js/data/i18n/en-US.js` |
| 🇯🇵 Japanese | `ja-JP` | `js/data/i18n/ja-JP.js` |

All UI text elements are tagged with `data-i18n="key.name"` in HTML. The `i18n-manager.js` engine scans and replaces them instantly on language change — no page reload needed.

---

## 📱 Responsive Design

| Breakpoint | Width | Target |
|:---:|:---:|---|
| Small | ≤ 480px | Phone portrait |
| Medium | 481–768px | Phone landscape / Small tablet |
| Large | 769–1024px | Tablet / Small laptop |
| XLarge | ≥ 1025px | Desktop / Large screen |

The game board SVG scales proportionally using `viewBox` + `aspect-ratio: 1/1`, always filling the available space without distortion or scroll.

---
---

# 🇹🇼 繁體中文

## 📑 目錄

- [🎯 遊戲介紹](#-遊戲介紹)
- [▶️ 開啟方式](#️-開啟方式)
- [🕹️ 遊戲玩法說明](#️-遊戲玩法說明)
  - [基本規則](#基本規則)
  - [如何得分](#如何得分)
  - [棋盤大小選擇](#棋盤大小選擇)
  - [AI 難度](#ai-難度)
  - [遊戲流程](#遊戲流程)
- [✨ 功能特色](#-功能特色)
- [🗂️ 程式架構](#️-程式架構)
  - [資料夾結構](#資料夾結構)
  - [CSS 分類說明](#css-分類說明)
  - [JavaScript 分類說明](#javascript-分類說明)
- [🎨 視覺主題](#-視覺主題)
- [🔊 音效系統](#-音效系統)
- [🌐 多國語系](#-多國語系)
- [📱 響應式設計](#-響應式設計)

---

## 🎯 遊戲介紹

**點格棋（Dots and Boxes）** 是一款源自 19 世紀的經典紙筆策略遊戲。本專案將其實作為一款**純前端、零建置、完全離線**的網頁遊戲，玩家可對抗三種難度的 AI。

| 🏷️ 項目 | 📋 詳情 |
|---|---|
| 🎮 遊戲類型 | 回合制策略 / 棋盤遊戲 |
| 👥 對戰模式 | 玩家 vs AI |
| 🖥️ 平台 | 任何現代瀏覽器（Chrome、Edge、Safari、Firefox） |
| 📦 相依套件 | **零依賴** — 不需 npm、不需打包工具 |
| 🌐 離線支援 | 完全可在無網路環境下遊玩 |
| 📱 響應式 | 支援手機、平板、桌機 |

---

## ▶️ 開啟方式

```
1. 下載或 Clone 此專案
2. 在檔案總管中開啟資料夾
3. 雙擊  index.html
4. 遊戲立即在瀏覽器中啟動 ✅
```

> ⚠️ **不需安裝任何軟體。** 不需要 Node.js、不需要執行 npm install、不需要 `live-server`。直接用瀏覽器開啟檔案即可。

---

## 🕹️ 遊戲玩法說明

### 基本規則

```
🔵 棋盤由橫直排列的「點」構成格線。
        ●───────●───────●
        │               │
        │               │
        ●       ●       ●
        │               │
        │               │
        ●───────●───────●

1. 玩家與 AI 輪流在任兩個相鄰的點之間畫一條線（橫或直）。
2. 每回合只能畫一條線。
3. 已畫過的線不可重複畫。
```

### 如何得分

```
📦 當某人畫下一個格子的「第四條邊」時：

    ●───────●
    │  你的  │   ← 你畫下第四條邊 → 這個格子歸你！
    ●───────●

✅ 格子顯示你的顏色／符號。
✅ 得分 +1。
✅ 獲得額外回合 —— 可以立即再畫一條線！
```

### 棋盤大小選擇

| 尺寸 | 格子數 | 適合對象 | 預估時長 |
|:---:|:---:|:---:|:---:|
| 3 × 3 | 9 格 | 快速對戰 / 新手 | ⚡ 2–3 分鐘 |
| 4 × 4 | 16 格 | 標準局（推薦） | 🕐 5–10 分鐘 |
| 5 × 5 | 25 格 | 進階玩家 | 🕑 10–20 分鐘 |
| 6 × 6 | 36 格 | 高手 / 長局挑戰 | 🕒 20–30 分鐘 |

### AI 難度

| 難度 | 圖示 | 行為說明 | 策略特性 |
|:---:|:---:|---|---|
| 簡單 Easy | 😊 | 多為隨機落子，偶爾抓住吃格機會 | 不做任何鏈路迴避 |
| 普通 Normal | 🧐 | 優先吃格、避免明顯送格 | 貪心策略，無深度分析 |
| 困難 Hard | 😤 | 完整鏈路分析 + 雙重交叉策略 | 接近最佳解 |

**困難 AI 策略詳解：**
- 🔗 **鏈路分析（Chain Analysis）** — 將棋盤剩餘格子分析為鏈（chain）與迴圈（loop）結構
- ♟️ **雙重交叉（Double-Cross）** — 吃長鏈時故意留下最後兩格，強迫對手吃格後仍需開啟下一條鏈
- 🧮 **長鏈控制** — 優先犧牲短鏈，保留長鏈讓自己後續連吃

### 遊戲流程

```
主選單
  │
  ├── ▶ 開始遊戲 ──→ 選棋盤大小 ──→ 選 AI 難度 ──→ 選先後手 ──→ 🎮 開始對戰！
  │
  ├── ↺ 繼續遊戲 ──→ 還原上次未完成的對局（有存檔時才顯示）
  │
  ├── ? 遊戲說明 ──→ 圖文並茂的規則說明頁
  │
  └── ⚙ 設定    ──→ 主題 / 音量 / 語言 / 震動 / 清除存檔
```

---

## ✨ 功能特色

| 🌟 功能 | 📝 說明 |
|---|---|
| 🤖 三種 AI 難度 | 簡單 / 普通 / 困難，各有獨特策略 |
| 🎨 六套視覺主題 | 經典木質 / 糖果 / 海洋 / 森林 / 夜間 / 櫻花 |
| 🌐 三種語言 | 繁體中文 / English / 日本語 |
| 🔊 完整音效 | BGM + 7 種音效，BGM / 音效音量獨立調整 |
| 💾 自動存檔 | 對局狀態存入 `localStorage`，隨時繼續 |
| 📱 響應式設計 | 手機 / 平板 / 桌機全尺寸適配 |
| ♿ 無障礙支援 | ARIA 標籤、大字體、高對比配色 |
| ⚡ 零建置 | 無框架、無 npm、無打包工具 |

---

## 🗂️ 程式架構

### 資料夾結構

```
dots-and-boxes/
│
├── 📄 index.html                    # 唯一入口，雙擊即開
│
├── 🎨 css/
│   ├── base/                        # 基礎層
│   │   ├── reset.css                # CSS Reset / Normalize
│   │   ├── variables.css            # 設計變數（顏色、間距、圓角）
│   │   ├── typography.css           # 字型堆疊、字級、字重
│   │   └── animations.css           # 共用關鍵影格動畫
│   │
│   ├── layout/                      # 版面層
│   │   ├── header.css               # 頂部列（返回鍵、標題、設定）
│   │   ├── responsive.css           # 斷點 & 響應式媒體查詢
│   │   └── safe-area.css            # iPhone 瀏海 / 手勢列安全區域
│   │
│   ├── pages/                       # 頁面樣式層
│   │   ├── main-menu.css            # 主選單頁
│   │   ├── game-board.css           # 遊戲對局頁
│   │   ├── settings.css             # 設定頁
│   │   ├── how-to-play.css          # 說明頁
│   │   └── result-modal.css         # 對局結果彈窗
│   │
│   ├── components/                  # 元件層
│   │   ├── buttons.css              # 按鈕變體 + 觸控回饋
│   │   ├── modal.css                # 通用彈窗
│   │   ├── toggle-switch.css        # 開關元件
│   │   ├── slider.css               # 音量滑桿
│   │   ├── dropdown.css             # 語言 / 主題下拉選單
│   │   └── loading.css              # AI 思考中動畫
│   │
│   └── themes/                      # 主題層
│       ├── theme-classic.css        # 經典木質
│       ├── theme-candy.css          # 糖果繽紛
│       ├── theme-ocean.css          # 海洋藍
│       ├── theme-forest.css         # 森林綠
│       ├── theme-night.css          # 夜間深色
│       └── theme-sakura.css         # 櫻花粉
│
├── ⚙️ js/
│   ├── utils/                       # 第 1 層：工具函式
│   ├── data/                        # 第 2 層：資料與常數
│   ├── core/                        # 第 3 層：核心邏輯
│   ├── ai/                          # 第 4 層：AI 引擎
│   ├── audio/                       # 第 5 層：音效系統
│   ├── i18n/                        # 第 6 層：語系管理
│   ├── ui/                          # 第 7 層：UI 控制器
│   └── main.js                      # 第 8 層：應用程式入口
│
└── 📄 README.md
```

---

### CSS 分類說明

CSS 採用 **五層架構**，各層職責單一，載入順序由上至下：

```
基礎 Base → 版面 Layout → 元件 Components → 頁面 Pages → 主題 Themes
```

| 層級 | 資料夾 | 職責說明 |
|:---:|---|---|
| 1️⃣ 基礎 Base | `css/base/` | 全站 Reset、CSS 設計變數（顏色、間距、圓角）、字型規範、共用動畫關鍵影格 |
| 2️⃣ 版面 Layout | `css/layout/` | 頂部列結構、響應式斷點媒體查詢、行動裝置安全區域 |
| 3️⃣ 元件 Components | `css/components/` | 可重用的 UI 元件（按鈕、彈窗、滑桿、開關、下拉、讀取動畫） |
| 4️⃣ 頁面 Pages | `css/pages/` | 各功能頁面的完整版面與樣式 |
| 5️⃣ 主題 Themes | `css/themes/` | 透過 `body[data-theme="..."]` 屬性切換的配色覆寫 |

---

### JavaScript 分類說明

JavaScript 採用 **八層架構**，依嚴格相依順序在 `index.html` 末尾以 `<script src>` 依序載入：

```
工具 Utils → 資料 Data → 核心 Core → AI → 音效 Audio → 語系 i18n → UI → main.js
```

| 層級 | 資料夾 / 檔案 | 檔案數 | 職責說明 |
|:---:|---|:---:|---|
| 1️⃣ 工具 Utils | `js/utils/` | 4 | DOM 操作輔助、localStorage 封裝、座標數學、事件廣播器 |
| 2️⃣ 資料 Data | `js/data/` | 5 | 遊戲常數、i18n 語系字典（zh-TW / en-US / ja-JP）、主題元資料 |
| 3️⃣ 核心 Core | `js/core/` | 4 | 棋盤資料模型、遊戲主邏輯（落子/計分/換回合）、規則驗證器、存檔管理員 |
| 4️⃣ AI | `js/ai/` | 5 | AI 總控制器、簡單/普通/困難各難度模組、鏈路分析演算法 |
| 5️⃣ 音效 Audio | `js/audio/` | 2 | 音效管理員（BGM + SFX，Web Audio API 增益控制）、音效對應表 |
| 6️⃣ 語系 i18n | `js/i18n/` | 1 | 語系切換引擎、DOM 文字節點替換、`lang` 屬性同步更新 |
| 7️⃣ UI | `js/ui/` | 8 | 路由器、棋盤 SVG 渲染器、主選單/對局/設定/結果各頁面互動邏輯、主題切換器 |
| 8️⃣ 入口 | `js/main.js` | 1 | 應用程式啟動點，按順序初始化所有模組 |

**重要檔案說明：**

| 檔案 | 功能 |
|---|---|
| `js/core/board-model.js` | 定義棋盤狀態：點陣列、水平線、垂直線、格子、分數、當前回合、遊戲狀態 |
| `js/core/game-engine.js` | 處理每次落子：驗證 → 標記線條 → 判斷格子完成 → 切換回合 |
| `js/ai/chain-analyzer.js` | 以圖論分析棋盤鏈路與迴圈，供困難 AI 使用 |
| `js/ui/board-renderer.js` | 以 SVG 動態繪製棋盤，處理滑鼠懸停預覽與點擊事件 |
| `js/audio/audio-manager.js` | 雙軌音效（BGM × 5 增益 + 音效）；頁面切換時淡入淡出 |
| `js/i18n/i18n-manager.js` | 掃描所有 `[data-i18n]` DOM 節點，語言切換時即時替換文字 |

---

## 🎨 視覺主題

| 主題 | 代號 | 風格描述 |
|:---:|:---:|---|
| 🪵 經典木質 | `classic` | 米白棋盤、深棕格線、暖橘強調色，仿實體桌遊質感（預設） |
| 🍬 糖果繽紛 | `candy` | 粉紫漸層背景、馬卡龍色系格線、繽紛強調色 |
| 🌊 海洋藍 | `ocean` | 藍綠漸層、白色格線、珊瑚橘強調色 |
| 🌲 森林綠 | `forest` | 深淺綠背景、木紋格線、陽光黃強調色 |
| 🌙 夜間深色 | `night` | 深藍紫背景、亮青格線、霓虹粉強調色（適合夜間護眼） |
| 🌸 櫻花粉 | `sakura` | 淡粉背景、白色格線、櫻花紅強調色 |

從 **設定 → 主題色彩** 即時切換，無需重新整理頁面。

---

## 🔊 音效系統

| 觸發事件 | 檔案 | 音色描述 |
|---|---|---|
| 畫下一條線 | `line-draw.mp3` | 極短促「叮」聲 |
| 完成一個格子 | `box-complete.mp3` | 上揚清亮「叮鈴」雙音 |
| 按鍵點擊 | `button-tap.mp3` | 輕巧「噠」聲 |
| 回合切換 | `turn-switch.mp3` | 溫和「叮咚」提示音 |
| 勝利 🏆 | `victory.mp3` | 明亮上揚音階，2–3 秒 |
| 落敗 😞 | `defeat.mp3` | 溫和低落短旋律 |
| 平手 🤝 | `draw.mp3` | 中性俏皮短旋律 |

**對局中 BGM 音量透過 Web Audio API GainNode 放大 ×5**，並串接 `DynamicsCompressorNode` 防止爆音失真。

---

## 🌐 多國語系

| 語言 | 代號 | 語系檔案 |
|:---:|:---:|---|
| 🇹🇼 繁體中文 | `zh-TW` | `js/data/i18n/zh-TW.js` |
| 🇬🇧 英文 | `en-US` | `js/data/i18n/en-US.js` |
| 🇯🇵 日文 | `ja-JP` | `js/data/i18n/ja-JP.js` |

所有 UI 文字在 HTML 中以 `data-i18n="key.name"` 標記，切換語言時 `i18n-manager.js` 即時替換全站文字，無需重新整理。

---

## 📱 響應式設計

| 斷點名稱 | 寬度範圍 | 主要裝置 |
|:---:|:---:|---|
| Small | ≤ 480px | 手機直立 |
| Medium | 481–768px | 手機橫向 / 小型平板 |
| Large | 769–1024px | 平板 / 小筆電 |
| XLarge | ≥ 1025px | 桌機 / 大螢幕 |

棋盤 SVG 透過 `viewBox` + `aspect-ratio: 1/1` 等比縮放，始終置中顯示，不需捲動、不被裁切。

---
---

# 🇯🇵 日本語

## 📑 目次

- [🎯 ゲームの紹介](#-ゲームの紹介)
- [▶️ 起動方法](#️-起動方法)
- [🕹️ ゲームプレイガイド](#️-ゲームプレイガイド)
  - [基本ルール](#基本ルール)
  - [得点方法](#得点方法)
  - [ボードサイズ](#ボードサイズ)
  - [AI難易度](#ai難易度)
  - [ゲームの流れ](#ゲームの流れ)
- [✨ 主な機能](#-主な機能)
- [🗂️ コードアーキテクチャ](#️-コードアーキテクチャ)
  - [ディレクトリ構造](#ディレクトリ構造)
  - [CSSの分類](#cssの分類)
  - [JavaScriptの分類](#javascriptの分類)
- [🎨 ビジュアルテーマ](#-ビジュアルテーマ)
- [🔊 オーディオシステム](#-オーディオシステム)
- [🌐 多言語対応（i18n）](#-多言語対応i18n)
- [📱 レスポンシブデザイン](#-レスポンシブデザイン)

---

## 🎯 ゲームの紹介

**ドット・アンド・ボックス（Dots and Boxes）** は19世紀に生まれた古典的な紙とペンの戦略ゲームです。このプロジェクトは**純粋なフロントエンド、ゼロビルド、完全オフライン**のWebゲームとして実装されており、プレイヤーは3段階の難易度のAIと対戦できます。

| 🏷️ 項目 | 📋 詳細 |
|---|---|
| 🎮 ゲームタイプ | ターン制ストラテジー / ボードゲーム |
| 👥 対戦モード | プレイヤー vs AI |
| 🖥️ プラットフォーム | 最新のブラウザ（Chrome、Edge、Safari、Firefox） |
| 📦 依存関係 | **ゼロ** — npm不要、ビルドツール不要 |
| 🌐 オフライン | インターネットなしで完全プレイ可能 |
| 📱 レスポンシブ | スマートフォン・タブレット・デスクトップ対応 |

---

## ▶️ 起動方法

```
1. このリポジトリをダウンロードまたはクローン
2. フォルダをエクスプローラーで開く
3. index.html をダブルクリック
4. ブラウザでゲームがすぐに起動 ✅
```

> ⚠️ **インストール不要。** Node.js、npm install、`live-server` は一切不要です。ファイルを直接ブラウザで開くだけでOK。

---

## 🕹️ ゲームプレイガイド

### 基本ルール

```
🔵 ドットがグリッド状に並んでいます。
        ●───────●───────●
        │               │
        │               │
        ●       ●       ●
        │               │
        │               │
        ●───────●───────●

1. プレイヤーとAIが交互に隣接する2点の間に線を1本引きます。
2. 線は水平または垂直のみです。
3. すでに引かれた線は再び引けません。
```

### 得点方法

```
📦 1×1のマスの「4辺目」を引いたとき：

    ●───────●
    │  あなた│   ← あなたが4辺目を引いた → このマスはあなたのもの！
    ●───────●

✅ マスにあなたの色／シンボルが表示されます。
✅ +1点を獲得。
✅ ボーナスターン — もう1本線を引けます！
```

### ボードサイズ

| サイズ | マス数 | 推奨対象 | 所要時間目安 |
|:---:|:---:|:---:|:---:|
| 3 × 3 | 9マス | 短時間 / 初心者 | ⚡ 2～3分 |
| 4 × 4 | 16マス | 標準（推奨） | 🕐 5～10分 |
| 5 × 5 | 25マス | 上級者 | 🕑 10～20分 |
| 6 × 6 | 36マス | エキスパート / 長期戦 | 🕒 20～30分 |

### AI難易度

| 難易度 | アイコン | 行動説明 | 戦略 |
|:---:|:---:|---|---|
| 簡単 Easy | 😊 | ほぼランダムな手、稀にマスを取りにいく | チェーン回避なし |
| 普通 Normal | 🧐 | 取れるマスを優先、明らかなギフトを避ける | 貪欲法、深い分析なし |
| 難しい Hard | 😤 | 完全なチェーン分析 + ダブルクロス戦略 | 最適解に近い |

**難しいAIの戦略詳細：**
- 🔗 **チェーン分析** — 残りのボードをチェーンとループの構造として分析
- ♟️ **ダブルクロス** — 長いチェーンの最後の2マスをあえて残し、相手に次のチェーンを開かせる
- 🧮 **長チェーン制御** — 短いチェーンを犠牲にして長いチェーンを温存し、大量連続得点を狙う

### ゲームの流れ

```
メインメニュー
  │
  ├── ▶ 新しいゲーム ──→ ボードサイズ選択 ──→ AI難易度選択 ──→ 先手選択 ──→ 🎮 対戦開始！
  │
  ├── ↺ 続きから   ──→ 保存済みゲームを復元（セーブデータがある場合のみ表示）
  │
  ├── ? 遊び方     ──→ 図解付きルール説明ページ
  │
  └── ⚙ 設定      ──→ テーマ / 音量 / 言語 / バイブレーション / セーブ削除
```

---

## ✨ 主な機能

| 🌟 機能 | 📝 説明 |
|---|---|
| 🤖 3段階のAI難易度 | 簡単 / 普通 / 難しい — それぞれ固有の戦略 |
| 🎨 6種類のビジュアルテーマ | クラシック / キャンディ / オーシャン / フォレスト / ナイト / さくら |
| 🌐 3言語対応 | 繁體中文 / English / 日本語 |
| 🔊 完全な音響システム | BGM + 7種の効果音、BGM/SEのボリューム独立調整 |
| 💾 自動セーブ | ゲーム状態を `localStorage` に保存、いつでも再開可能 |
| 📱 レスポンシブデザイン | スマートフォン・タブレット・デスクトップ全対応 |
| ♿ アクセシビリティ | ARIAラベル、大きなフォント、高コントラスト配色 |
| ⚡ ゼロビルド | フレームワーク不要、npm不要、バンドラー不要 |

---

## 🗂️ コードアーキテクチャ

### ディレクトリ構造

```
dots-and-boxes/
│
├── 📄 index.html                    # 唯一のエントリポイント — ダブルクリックで起動
│
├── 🎨 css/
│   ├── base/                        # 基盤レイヤー
│   │   ├── reset.css                # CSS Reset / Normalize
│   │   ├── variables.css            # デザイントークン（色、余白、角丸）
│   │   ├── typography.css           # フォントスタック、サイズ、太さ
│   │   └── animations.css           # 共通キーフレームアニメーション
│   │
│   ├── layout/                      # レイアウトレイヤー
│   │   ├── header.css               # トップバー（戻るボタン、タイトル、設定）
│   │   ├── responsive.css           # ブレークポイント & RWDメディアクエリ
│   │   └── safe-area.css            # iPhoneノッチ / ジェスチャーバーセーフエリア
│   │
│   ├── pages/                       # ページ別スタイル
│   │   ├── main-menu.css            # ホーム画面
│   │   ├── game-board.css           # ゲームボード
│   │   ├── settings.css             # 設定ページ
│   │   ├── how-to-play.css          # 説明ページ
│   │   └── result-modal.css         # 結果モーダル
│   │
│   ├── components/                  # 再利用可能UIコンポーネント
│   │   ├── buttons.css              # ボタンバリエーション + タッチフィードバック
│   │   ├── modal.css                # モーダルダイアログ
│   │   ├── toggle-switch.css        # トグルスイッチ
│   │   ├── slider.css               # 音量スライダー
│   │   ├── dropdown.css             # 言語 / テーマドロップダウン
│   │   └── loading.css              # AI「思考中」ローディングアニメーション
│   │
│   └── themes/                      # ビジュアルテーマ上書き
│       ├── theme-classic.css        # クラシックウッド
│       ├── theme-candy.css          # キャンディポップ
│       ├── theme-ocean.css          # オーシャンブルー
│       ├── theme-forest.css         # フォレストグリーン
│       ├── theme-night.css          # ナイトダーク
│       └── theme-sakura.css         # さくらピンク
│
├── ⚙️ js/
│   ├── utils/                       # レイヤー1: ユーティリティ
│   ├── data/                        # レイヤー2: データ / 定数
│   ├── core/                        # レイヤー3: ゲームロジック
│   ├── ai/                          # レイヤー4: AIエンジン
│   ├── audio/                       # レイヤー5: オーディオシステム
│   ├── i18n/                        # レイヤー6: ローカライゼーション
│   ├── ui/                          # レイヤー7: UIコントローラー
│   └── main.js                      # レイヤー8: エントリポイント
│
└── 📄 README.md
```

---

### CSSの分類

CSSは**5層アーキテクチャ**に従い、各層は単一の責任を持ち、上から下の順に読み込まれます：

```
Base → Layout → Components → Pages → Themes
```

| レイヤー | フォルダ | 役割 |
|:---:|---|---|
| 1️⃣ Base | `css/base/` | グローバルリセット、CSSデザイントークン（色・余白・角丸）、タイポグラフィ、共通アニメーション |
| 2️⃣ Layout | `css/layout/` | ヘッダー構造、レスポンシブブレークポイント、モバイルセーフエリア |
| 3️⃣ Components | `css/components/` | 再利用可能UIコンポーネント（ボタン、モーダル、スライダー、トグル） |
| 4️⃣ Pages | `css/pages/` | 各機能ページの完全なレイアウトとスタイル |
| 5️⃣ Themes | `css/themes/` | `body[data-theme="..."]` 属性で切り替えるカラーオーバーライド |

---

### JavaScriptの分類

JavaScriptは**8層アーキテクチャ**に従い、`index.html` の末尾に `<script src>` で依存順に読み込まれます：

```
Utils → Data → Core → AI → Audio → i18n → UI → main.js
```

| レイヤー | フォルダ / ファイル | ファイル数 | 役割 |
|:---:|---|:---:|---|
| 1️⃣ Utils | `js/utils/` | 4 | DOM操作ヘルパー、localStorageラッパー、座標計算、イベントエミッター |
| 2️⃣ Data | `js/data/` | 5 | ゲーム定数、i18n辞書（zh-TW / en-US / ja-JP）、テーマメタデータ |
| 3️⃣ Core | `js/core/` | 4 | ボードデータモデル、ゲームエンジン（着手/得点/ターン交代）、ルールバリデーター、セーブマネージャー |
| 4️⃣ AI | `js/ai/` | 5 | AIコントローラー、簡単/普通/難しい各難易度モジュール、チェーン解析アルゴリズム |
| 5️⃣ Audio | `js/audio/` | 2 | オーディオマネージャー（BGM×5ゲイン + SE、Web Audio API）、サウンドマップ |
| 6️⃣ i18n | `js/i18n/` | 1 | 言語切り替えエンジン、DOMテキスト置換、`lang` 属性同期 |
| 7️⃣ UI | `js/ui/` | 8 | ルーター、ボードSVGレンダラー、メニュー/ゲーム/設定/結果UIコントローラー、テーマスイッチャー |
| 8️⃣ Entry | `js/main.js` | 1 | アプリのブートストラップ — 全モジュールを正しい順序で初期化 |

**重要なJavaScriptファイル：**

| ファイル | 役割 |
|---|---|
| `js/core/board-model.js` | ボード状態を定義：ドット、水平線、垂直線、マス、得点、現在のターン、ゲームステータス |
| `js/core/game-engine.js` | 各着手を処理：バリデーション → 線のマーク → マス完成チェック → ターン交代 |
| `js/ai/chain-analyzer.js` | グラフ理論でボードのチェーンとループを解析（Hard AI用） |
| `js/ui/board-renderer.js` | ボード全体をSVGとして動的描画、ホバープレビューとクリックイベントを処理 |
| `js/audio/audio-manager.js` | デュアルトラック音響（BGM×5ゲイン + SE）、ページ遷移時フェードイン/アウト |
| `js/i18n/i18n-manager.js` | 全 `[data-i18n]` DOMノードをスキャンし、言語切り替え時にテキストを即時置換 |

---

## 🎨 ビジュアルテーマ

| テーマ | コード | スタイル説明 |
|:---:|:---:|---|
| 🪵 クラシックウッド | `classic` | ウォームベージュボード、ダークブラウンライン、アンバーアクセント（デフォルト） |
| 🍬 キャンディポップ | `candy` | パープルピンクグラデーション、マカロンパレット、鮮やかなアクセント |
| 🌊 オーシャンブルー | `ocean` | ブルーグリーングラデーション、白ライン、コーラルオレンジアクセント |
| 🌲 フォレストグリーン | `forest` | 深淡グリーン背景、ウッドグレインライン、サンシャインイエローアクセント |
| 🌙 ナイトダーク | `night` | ディープブルーパープル背景、シアンライン、ネオンピンクアクセント（夜間推奨） |
| 🌸 さくらピンク | `sakura` | ソフトピンク背景、白ライン、チェリーブロッサムレッドアクセント |

**設定 → テーマカラー** からページリロードなしで即時切り替え可能。

---

## 🔊 オーディオシステム

| イベント | ファイル | 音色説明 |
|---|---|---|
| 線を引く | `line-draw.mp3` | 短い清涼感のある「チン」 |
| マス完成 | `box-complete.mp3` | 上昇する明るい「チリン」ダブルチャイム |
| ボタンタップ | `button-tap.mp3` | 軽い「タップ」音 |
| ターン交代 | `turn-switch.mp3` | 穏やかな「ピンポン」 |
| 勝利 🏆 | `victory.mp3` | 明るい上昇メロディー（2～3秒） |
| 敗北 😞 | `defeat.mp3` | 穏やかで耳障りでない短いモチーフ |
| 引き分け 🤝 | `draw.mp3` | ニュートラルで遊び心のある短いフレーズ |

**ゲームプレイ中のBGMはWeb Audio API GainNodeで×5増幅**され、`DynamicsCompressorNode`リミッターでクリッピングを防止します。

---

## 🌐 多言語対応（i18n）

| 言語 | コード | 辞書ファイル |
|:---:|:---:|---|
| 🇹🇼 繁体字中国語 | `zh-TW` | `js/data/i18n/zh-TW.js` |
| 🇬🇧 英語 | `en-US` | `js/data/i18n/en-US.js` |
| 🇯🇵 日本語 | `ja-JP` | `js/data/i18n/ja-JP.js` |

全UIテキストはHTMLで `data-i18n="key.name"` とタグ付けされています。`i18n-manager.js` エンジンが言語切り替え時にページリロードなしで全テキストを即時置換します。

---

## 📱 レスポンシブデザイン

| ブレークポイント | 幅 | 対象デバイス |
|:---:|:---:|---|
| Small | ≤ 480px | スマートフォン縦向き |
| Medium | 481–768px | スマートフォン横向き / 小型タブレット |
| Large | 769–1024px | タブレット / 小型ノートPC |
| XLarge | ≥ 1025px | デスクトップ / 大型スクリーン |

ゲームボードSVGは `viewBox` + `aspect-ratio: 1/1` で比例スケーリングされ、歪みやスクロールなしに常に中央に表示されます。

---

<div align="center">

---

Made with ❤️ · 用心製作 · 心を込めて作られました

</div>
