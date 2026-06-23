# 🎲 Backgammon ・ 雙陸棋 ・ バックギャモン

> A complete, dependency-free Backgammon game that runs entirely in the browser.
> 一款完整、零依賴、純前端的雙陸棋網頁遊戲。
> 依存ライブラリ不要、ブラウザだけで動く本格バックギャモン。

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-1.0.0-2d8cff">
  <img alt="stack" src="https://img.shields.io/badge/stack-Vanilla%20JS-f7df1e">
  <img alt="build" src="https://img.shields.io/badge/build-none%20needed-2ecc71">
  <img alt="i18n" src="https://img.shields.io/badge/i18n-EN%20%2F%20%E4%B8%AD%20%2F%20%E6%97%A5-9b59b6">
</p>

<p align="center">
  <strong>🌐 Language / 語言 / 言語</strong><br>
  <a href="#-english">🇬🇧 English</a> ・
  <a href="#-繁體中文">🇹🇼 繁體中文</a> ・
  <a href="#-日本語">🇯🇵 日本語</a>
</p>

---

<a id="-english"></a>

## 🇬🇧 English

### 📑 Table of Contents
| # | Section | # | Section |
|---|---------|---|---------|
| 1 | [✨ Introduction](#-introduction) | 5 | [🎮 How to Play](#-how-to-play) |
| 2 | [🚀 Quick Start](#-quick-start) | 6 | [🤖 AI Opponent](#-ai-opponent) |
| 3 | [📋 Features](#-features) | 7 | [🧩 Code Architecture](#-code-architecture) |
| 4 | [🎯 Rules of Backgammon](#-rules-of-backgammon) | 8 | [🗂️ File Reference](#️-file-reference) |

### ✨ Introduction

**Backgammon** is one of the oldest board games in the world — a race between two players to move all 15 of their checkers around a 24-point board and bear them off first. This project is a faithful, single-player implementation where **you (white) play against an AI (black)**.

It is built as a **100% static front-end app**: no backend, no bundler, no `npm install`. Just open `index.html` and play. Everything — game logic, Canvas rendering, AI, audio, save/load, and three languages — runs in plain browser JavaScript.

| Item | Detail |
|------|--------|
| 🎲 Genre | Classic 2-player Backgammon (Human vs AI) |
| 🛠️ Tech | Vanilla HTML / CSS / JavaScript (ES5-friendly IIFE modules) |
| 📦 Dependencies | **None** — no frameworks, no build step |
| 🖥️ Rendering | HTML5 Canvas (board, checkers, dice) |
| 🌐 Languages | English / 繁體中文 / 日本語 |
| 🎨 Themes | 5 color themes |
| 🤖 AI | 3 difficulty levels |
| 💾 Saving | Auto-saved to `localStorage` |
| 📱 Responsive | Desktop, tablet & mobile |

### 🚀 Quick Start

```bash
# 1. Clone or download this folder
git clone <repo-url>
cd Backgammon

# 2. Just open the file — no build, no server required
#    Double-click index.html, or:
start index.html          # Windows
open index.html           # macOS
```

> 💡 **Optional:** for the cleanest experience (and to avoid any browser file-path quirks) you can serve it locally:
> ```bash
> python -m http.server 8000      # then visit http://localhost:8000
> ```

### 📋 Features

| 🎯 Feature | Description |
|-----------|-------------|
| ♟️ **Full ruleset** | Bar/re-entry, hitting & blots, blocked points, forced moves, bearing off, doubles (4 moves) |
| 🤖 **3 AI levels** | Easy / Normal / Hard (lookahead) |
| 🎨 **5 themes** | Classic, Ocean, Forest, Sunset, Night |
| 🌐 **3 languages** | Switch live from menu, settings, or in-game |
| 🔊 **Audio** | Web Audio engine with separate BGM & SFX volume |
| 💾 **Save/Continue** | Game state persists in `localStorage`; "Continue" resumes |
| ↩️ **Undo** | Take back moves within the current turn |
| ⚡ **Animations** | Dice rolls & checker movement with adjustable speed |
| 📱 **Responsive** | Adapts layout for phones, tablets, and desktops |
| ♿ **Accessible** | ARIA roles, live regions, keyboard-friendly buttons |

### 🎮 How to Play

The board has **24 points (triangles)**, a **bar** in the middle, and a **home/bear-off** tray for each side.

| Step | Action | Where |
|------|--------|-------|
| 1️⃣ | Press **Roll Dice** 🎲 | The two dice decide how many points you may move |
| 2️⃣ | **Click a checker**, then click a highlighted target point | Legal targets are highlighted automatically |
| 3️⃣ | Use **both dice** (or all four on a double) | Each die = one move |
| 4️⃣ | **Hit** an opponent blot (single checker) to send it to the bar | They must re-enter before doing anything else |
| 5️⃣ | Once all 15 checkers reach your home board, press **Bear Off** 🏠 | Remove them from the board |
| 6️⃣ | **First to bear off all 15 checkers wins!** 🏆 | — |

**On-screen controls**

| Button | Function |
|--------|----------|
| 🎲 Roll Dice | Roll for your turn |
| 🏠 Bear Off | Remove a checker from your home board |
| ↩️ Undo | Undo the last move this turn |
| ✅ End Turn | Finish your turn / pass to the AI |
| ⚙ / ♪ | Quick settings / mute toggle |

### 🎯 Rules of Backgammon

<details>
<summary><strong>Click to expand the full rules</strong></summary>

- **Setup:** Each player starts with 15 checkers in the standard backgammon arrangement (2-5-3-5).
- **Goal:** Move all your checkers into your *home board*, then *bear them off*. First to bear off all 15 wins.
- **Movement:** Move clockwise/anticlockwise (each color moves toward its own home). Each die is a separate move; you may move one checker twice or two checkers once.
- **Doubles:** Rolling the same number on both dice lets you make **four** moves of that value.
- **Blots & hitting:** A point with a single checker is a *blot*. Landing on an opponent's blot sends it to the **bar**.
- **The bar:** A checker on the bar must **re-enter** in the opponent's home board before any other move is allowed.
- **Blocked points:** You cannot land on a point occupied by **2+ enemy checkers**.
- **Bearing off:** Only allowed once **all** your checkers are in your home board.
- **Forced moves:** If only some dice can be played legally, you must play as many as possible.

</details>

### 🤖 AI Opponent

The AI plays the black checkers. Choose its strength in **Settings → AI Difficulty**.

| Level | File | Behaviour |
|-------|------|-----------|
| 🟢 **Easy** | `ai-easy.js` | Picks a legal move sequence essentially at random — great for learning. |
| 🟡 **Normal** | `ai-normal.js` | Scores each resulting board with a heuristic (pip count, hits, blots, made points) and picks the best. |
| 🔴 **Hard** | `ai-hard.js` | Adds a **look-ahead**: simulates the opponent's likely replies across sample dice rolls and minimises your best response — a lightweight expectimax. |

All three share the move generator in `rules.js` (`getLegalTurnSequences`) and are routed through `ai-manager.js`.

### 🧩 Code Architecture

The app uses a simple, framework-free pattern: every file is an **IIFE** that attaches to a single global namespace `window.Backgammon` (aliased `BG`). Scripts load in dependency order from `index.html`. Responsibilities are split into clear layers:

```
┌─────────────────────────────────────────────────────────┐
│  index.html  →  loads all CSS + JS, defines screen markup │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   core/      │   │   game/      │   │   render/    │
│ state, i18n, │   │ rules, board,│   │ canvas board │
│ storage,     │──▶│ dice, pieces,│──▶│ pieces, dice,│
│ constants    │   │ AI (3 lvls)  │   │ animations   │
└──────────────┘   └──────────────┘   └──────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           ▼
                  ┌──────────────────┐      ┌──────────────┐
                  │      ui/         │      │    lib/      │
                  │ menu, game-ui,   │◀────▶│ audio-engine │
                  │ settings, help,  │      └──────────────┘
                  │ modal, theme     │
                  └──────────────────┘
                           ▼
                       main.js  (bootstraps everything)
```

**Layer responsibilities**

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| 🧠 Core | `js/core/` | Game state, constants, i18n loader, `localStorage` persistence |
| ♟️ Game | `js/game/` | Pure rules engine, board model, dice, checkers, AI |
| 🎨 Render | `js/render/` | All Canvas drawing & animations |
| 🖱️ UI | `js/ui/` | Screens, controls, settings, help, modals, theming |
| 🔊 Lib | `js/lib/` | Web Audio sound engine |
| 🚀 Entry | `js/main.js` | DOM bootstrap & screen routing |
| 💅 Styles | `css/` | 22 modular CSS files (base / layout / components / screens / themes / animations) |
| 🌐 Locales | `locales/` | `en.json`, `ja.json`, `zh-TW.json` translation strings |

### 🗂️ File Reference

<details>
<summary><strong>Full project tree & per-file notes</strong></summary>

```
Backgammon/
├── index.html              # Single entry page; markup for all screens
├── backgammon-spec.md      # Full design specification (zh-TW)
│
├── css/                    # 22 modular stylesheets
│   ├── base/               # reset, typography, CSS variables
│   ├── layout/             # main layout + responsive rules
│   ├── components/         # board, pieces, dice, buttons, modal
│   ├── screens/            # menu, game, settings, help
│   ├── themes/             # classic / ocean / forest / sunset / night
│   └── animations/         # dice-roll, piece-move, transitions
│
├── js/
│   ├── core/
│   │   ├── constants.js    # Colors, directions, home/bar points, helpers
│   │   ├── state.js        # Game state factory, opening roll, turns
│   │   ├── i18n.js         # Locale loading & string interpolation
│   │   └── storage.js      # Settings + save-game in localStorage
│   ├── game/
│   │   ├── rules.js        # ★ Rules engine: legal moves, hits, bear-off
│   │   ├── board.js        # Initial board setup & board helpers
│   │   ├── dice.js         # Dice rolling & die consumption
│   │   ├── pieces.js       # Checker move application
│   │   ├── ai-easy.js      # Random legal move AI
│   │   ├── ai-normal.js    # Heuristic board evaluation AI
│   │   ├── ai-hard.js      # Look-ahead (expectimax-lite) AI
│   │   └── ai-manager.js   # Routes to the chosen difficulty
│   ├── render/
│   │   ├── canvas-board.js  # Draws board, points, bar, trays
│   │   ├── canvas-pieces.js # Draws checkers
│   │   ├── canvas-dice.js   # Draws dice
│   │   └── animations.js    # Movement & dice animations
│   ├── ui/
│   │   ├── menu.js          # Main menu + Continue button
│   │   ├── game-ui.js       # ★ In-game interaction & control wiring
│   │   ├── settings-ui.js   # Settings screen
│   │   ├── help-ui.js       # Help/instructions tabs
│   │   ├── modal.js         # Reusable dialog
│   │   └── theme.js         # Theme switching
│   ├── lib/
│   │   └── audio-engine.js  # Web Audio BGM & SFX
│   └── main.js              # App bootstrap & screen router
│
└── locales/
    ├── en.json
    ├── ja.json
    └── zh-TW.json
```

</details>

---

<a id="-繁體中文"></a>

## 🇹🇼 繁體中文

### 📑 目錄
| # | 章節 | # | 章節 |
|---|------|---|------|
| 1 | [✨ 遊戲介紹](#-遊戲介紹) | 5 | [🎮 遊戲玩法](#-遊戲玩法) |
| 2 | [🚀 快速開始](#-快速開始) | 6 | [🤖 AI 對手](#-ai-對手) |
| 3 | [📋 功能特色](#-功能特色) | 7 | [🧩 程式架構](#-程式架構) |
| 4 | [🎯 雙陸棋規則](#-雙陸棋規則) | 8 | [🗂️ 檔案說明](#️-檔案說明) |

### ✨ 遊戲介紹

**雙陸棋（Backgammon）** 是世界上最古老的棋盤遊戲之一——兩位玩家在 24 個點的棋盤上競速，看誰能率先把自己的 15 顆棋子繞行整個棋盤並全部「移出（bear off）」。本專案是忠實還原的單人版本，由**你（白棋）對戰電腦 AI（黑棋）**。

它是一個 **100% 純前端靜態網頁**：沒有後端、沒有打包工具、不需要 `npm install`。只要打開 `index.html` 就能玩。所有功能——遊戲邏輯、Canvas 繪圖、AI、音效、存讀檔、三國語言——全部以原生瀏覽器 JavaScript 執行。

| 項目 | 內容 |
|------|------|
| 🎲 類型 | 經典雙人雙陸棋（人類 vs AI） |
| 🛠️ 技術 | 原生 HTML / CSS / JavaScript（IIFE 模組） |
| 📦 相依套件 | **無**——不用框架、不用建置 |
| 🖥️ 繪圖 | HTML5 Canvas（棋盤、棋子、骰子） |
| 🌐 語言 | English / 繁體中文 / 日本語 |
| 🎨 主題 | 5 種配色主題 |
| 🤖 AI | 3 種難度 |
| 💾 存檔 | 自動存入 `localStorage` |
| 📱 響應式 | 桌機、平板、手機皆適用 |

### 🚀 快速開始

```bash
# 1. 下載或 clone 此資料夾
git clone <repo-url>
cd Backgammon

# 2. 直接開檔案——免建置、免架伺服器
#    雙擊 index.html，或：
start index.html          # Windows
open index.html           # macOS
```

> 💡 **選用：** 若想避免瀏覽器讀取本機檔案路徑的限制，可改用本機伺服器：
> ```bash
> python -m http.server 8000      # 然後開啟 http://localhost:8000
> ```

### 📋 功能特色

| 🎯 功能 | 說明 |
|--------|------|
| ♟️ **完整規則** | 吃子上 BAR、重新進場、阻擋點、強制走步、移出、雙骰（走 4 步） |
| 🤖 **3 種 AI** | 簡單 / 普通 / 困難（含預判） |
| 🎨 **5 種主題** | 古典、海洋、森林、夕陽、深夜 |
| 🌐 **3 國語言** | 可在選單、設定、遊戲中即時切換 |
| 🔊 **音效系統** | Web Audio 引擎，BGM 與音效音量分開調整 |
| 💾 **存檔／繼續** | 進度保存在 `localStorage`，可按「繼續遊戲」接續 |
| ↩️ **悔棋** | 在本回合內收回走步 |
| ⚡ **動畫** | 骰子與棋子動畫，速度可調 |
| 📱 **響應式** | 自動適應手機、平板、桌機版面 |
| ♿ **無障礙** | ARIA 角色、即時提示區、鍵盤友善按鈕 |

### 🎮 遊戲玩法

棋盤有 **24 個點（三角形）**、中間的 **BAR（隔欄）**，以及兩邊各自的 **HOME／移出區**。

| 步驟 | 動作 | 說明 |
|------|------|------|
| 1️⃣ | 按 **擲骰** 🎲 | 兩顆骰子決定本回合可移動的步數 |
| 2️⃣ | **點選棋子**，再點亮起的目標點 | 系統會自動標示合法目標 |
| 3️⃣ | 用掉**兩顆骰子**（雙骰則為四步） | 每顆骰子＝一步 |
| 4️⃣ | **吃掉**對手的單子（blot），將其送上 BAR | 對方必須先重新進場才能行動 |
| 5️⃣ | 當 15 顆棋子全進入自家 HOME，按 **移出** 🏠 | 將棋子移出棋盤 |
| 6️⃣ | **最先把 15 顆全部移出者獲勝！** 🏆 | — |

**畫面控制按鈕**

| 按鈕 | 功能 |
|------|------|
| 🎲 擲骰 | 擲出本回合骰子 |
| 🏠 移出 | 將一顆棋子移出自家 HOME |
| ↩️ 悔棋 | 收回本回合上一步 |
| ✅ 結束回合 | 結束回合／交給 AI |
| ⚙ / ♪ | 快速設定／靜音切換 |

### 🎯 雙陸棋規則

<details>
<summary><strong>點此展開完整規則</strong></summary>

- **開局：** 每位玩家以標準排列開局 15 顆棋子（2-5-3-5）。
- **目標：** 把所有棋子移入自家 *HOME 區*，再全部 *移出*。最先移出 15 顆者勝。
- **移動：** 各色朝自己的家移動。每顆骰子為獨立一步，可同一顆棋走兩步，或兩顆棋各走一步。
- **雙骰：** 兩顆點數相同時，可走該點數 **四步**。
- **單子與吃子：** 只有一顆棋的點稱為 *blot*；落在對方 blot 上即把它送上 **BAR**。
- **BAR：** 在 BAR 上的棋子必須先在對方家區 **重新進場**，才能進行其他走步。
- **阻擋點：** 不能落在對方有 **2 顆以上**棋子的點。
- **移出：** 只有當**所有**棋子都進入自家 HOME 後才能移出。
- **強制走步：** 若只能合法走部分骰子，必須盡可能走最多步。

</details>

### 🤖 AI 對手

AI 操控黑棋，可在 **設定 → AI 難度** 中調整強度。

| 難度 | 檔案 | 行為 |
|------|------|------|
| 🟢 **簡單** | `ai-easy.js` | 幾乎隨機選擇合法走步序列——適合新手練習。 |
| 🟡 **普通** | `ai-normal.js` | 以啟發式評分（pip 數、吃子、blot、成點）評估每個結果並選最佳。 |
| 🔴 **困難** | `ai-hard.js` | 加入**預判**：模擬多種骰點下對手的可能回應，最小化你的最佳反擊——輕量版 expectimax。 |

三者共用 `rules.js` 的走步產生器（`getLegalTurnSequences`），並透過 `ai-manager.js` 分派。

### 🧩 程式架構

本專案採用簡潔、無框架的寫法：每個檔案都是一個 **IIFE**，掛載到單一全域命名空間 `window.Backgammon`（別名 `BG`）。`index.html` 依相依順序載入腳本，各層職責清楚分離：

```
┌─────────────────────────────────────────────────────────┐
│  index.html  →  載入所有 CSS + JS，定義各畫面結構          │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   core/      │   │   game/      │   │   render/    │
│ 狀態、i18n、 │   │ 規則、棋盤、  │   │ Canvas 棋盤、│
│ 存檔、常數    │──▶│ 骰子、棋子、  │──▶│ 棋子、骰子、 │
│              │   │ AI（3 難度） │   │ 動畫         │
└──────────────┘   └──────────────┘   └──────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           ▼
                  ┌──────────────────┐      ┌──────────────┐
                  │      ui/         │      │    lib/      │
                  │ 選單、遊戲介面、 │◀────▶│ 音效引擎     │
                  │ 設定、說明、     │      └──────────────┘
                  │ 對話框、主題     │
                  └──────────────────┘
                           ▼
                       main.js  （啟動整個程式）
```

**各層職責**

| 分層 | 資料夾 | 職責 |
|------|--------|------|
| 🧠 核心 Core | `js/core/` | 遊戲狀態、常數、i18n 載入、`localStorage` 存取 |
| ♟️ 遊戲 Game | `js/game/` | 純規則引擎、棋盤模型、骰子、棋子、AI |
| 🎨 繪圖 Render | `js/render/` | 所有 Canvas 繪製與動畫 |
| 🖱️ 介面 UI | `js/ui/` | 各畫面、控制、設定、說明、對話框、主題 |
| 🔊 函式庫 Lib | `js/lib/` | Web Audio 音效引擎 |
| 🚀 進入點 Entry | `js/main.js` | DOM 啟動與畫面切換 |
| 💅 樣式 Styles | `css/` | 22 個模組化 CSS（base／layout／components／screens／themes／animations） |
| 🌐 語系 Locales | `locales/` | `en.json`、`ja.json`、`zh-TW.json` 翻譯字串 |

### 🗂️ 檔案說明

<details>
<summary><strong>完整專案結構與各檔案說明</strong></summary>

```
Backgammon/
├── index.html              # 唯一進入頁；所有畫面的結構
├── backgammon-spec.md      # 完整設計規格書（繁中）
│
├── css/                    # 22 個模組化樣式表
│   ├── base/               # reset、字體、CSS 變數
│   ├── layout/             # 主版面 + 響應式
│   ├── components/         # 棋盤、棋子、骰子、按鈕、對話框
│   ├── screens/            # 選單、遊戲、設定、說明
│   ├── themes/             # 古典／海洋／森林／夕陽／深夜
│   └── animations/         # 擲骰、棋子移動、轉場
│
├── js/
│   ├── core/
│   │   ├── constants.js    # 顏色、方向、HOME/BAR 點位、輔助函式
│   │   ├── state.js        # 遊戲狀態工廠、開局擲骰、回合
│   │   ├── i18n.js         # 語系載入與字串內插
│   │   └── storage.js      # 設定 + 存檔於 localStorage
│   ├── game/
│   │   ├── rules.js        # ★ 規則引擎：合法走步、吃子、移出
│   │   ├── board.js        # 初始棋盤與棋盤輔助
│   │   ├── dice.js         # 擲骰與骰點消耗
│   │   ├── pieces.js       # 套用棋子移動
│   │   ├── ai-easy.js      # 隨機合法走步 AI
│   │   ├── ai-normal.js    # 啟發式評分 AI
│   │   ├── ai-hard.js      # 預判（輕量 expectimax）AI
│   │   └── ai-manager.js   # 依難度分派
│   ├── render/
│   │   ├── canvas-board.js  # 繪製棋盤、點、BAR、托盤
│   │   ├── canvas-pieces.js # 繪製棋子
│   │   ├── canvas-dice.js   # 繪製骰子
│   │   └── animations.js    # 移動與骰子動畫
│   ├── ui/
│   │   ├── menu.js          # 主選單 + 繼續遊戲
│   │   ├── game-ui.js       # ★ 遊戲內互動與控制接線
│   │   ├── settings-ui.js   # 設定畫面
│   │   ├── help-ui.js       # 說明分頁
│   │   ├── modal.js         # 可重用對話框
│   │   └── theme.js         # 主題切換
│   ├── lib/
│   │   └── audio-engine.js  # Web Audio BGM 與音效
│   └── main.js              # 程式啟動與畫面路由
│
└── locales/
    ├── en.json
    ├── ja.json
    └── zh-TW.json
```

</details>

---

<a id="-日本語"></a>

## 🇯🇵 日本語

### 📑 目次
| # | セクション | # | セクション |
|---|-----------|---|-----------|
| 1 | [✨ ゲーム紹介](#-ゲーム紹介) | 5 | [🎮 遊び方](#-遊び方) |
| 2 | [🚀 クイックスタート](#-クイックスタート) | 6 | [🤖 AI 対戦相手](#-ai-対戦相手) |
| 3 | [📋 特徴](#-特徴) | 7 | [🧩 コード構成](#-コード構成) |
| 4 | [🎯 バックギャモンのルール](#-バックギャモンのルール) | 8 | [🗂️ ファイル一覧](#️-ファイル一覧) |

### ✨ ゲーム紹介

**バックギャモン（Backgammon）** は世界最古のボードゲームの一つ。2 人のプレイヤーが 24 ポイントの盤上で 15 個のコマを動かし、誰が先に全部を「ベアオフ（盤外へ）」できるかを競うレースゲームです。本プロジェクトは忠実に再現したシングルプレイ版で、**あなた（白）が AI（黒）と対戦**します。

これは **100% 静的なフロントエンド Web アプリ**です。バックエンドもバンドラーも不要で、`npm install` もいりません。`index.html` を開くだけで遊べます。ゲームロジック、Canvas 描画、AI、サウンド、セーブ／ロード、3 言語対応——すべてがブラウザの素の JavaScript で動作します。

| 項目 | 内容 |
|------|------|
| 🎲 ジャンル | クラシックな 2 人制バックギャモン（人間 vs AI） |
| 🛠️ 技術 | 素の HTML / CSS / JavaScript（IIFE モジュール） |
| 📦 依存関係 | **なし**——フレームワーク・ビルド不要 |
| 🖥️ 描画 | HTML5 Canvas（盤・コマ・サイコロ） |
| 🌐 言語 | English / 繁體中文 / 日本語 |
| 🎨 テーマ | 5 種類のカラーテーマ |
| 🤖 AI | 3 段階の難易度 |
| 💾 セーブ | `localStorage` に自動保存 |
| 📱 レスポンシブ | PC・タブレット・スマホ対応 |

### 🚀 クイックスタート

```bash
# 1. このフォルダをクローンまたはダウンロード
git clone <repo-url>
cd Backgammon

# 2. ファイルを開くだけ——ビルドもサーバーも不要
#    index.html をダブルクリック、または：
start index.html          # Windows
open index.html           # macOS
```

> 💡 **任意：** ブラウザのローカルファイル制限を避けたい場合は、ローカルサーバーで配信できます：
> ```bash
> python -m http.server 8000      # その後 http://localhost:8000 を開く
> ```

### 📋 特徴

| 🎯 機能 | 説明 |
|--------|------|
| ♟️ **完全なルール** | バー入り・再エントリー・ブロックポイント・強制ムーブ・ベアオフ・ゾロ目（4 手） |
| 🤖 **3 段階 AI** | やさしい / ふつう / むずかしい（先読み） |
| 🎨 **5 テーマ** | クラシック・オーシャン・フォレスト・サンセット・ナイト |
| 🌐 **3 言語** | メニュー・設定・ゲーム中にリアルタイム切替 |
| 🔊 **サウンド** | Web Audio エンジン、BGM と効果音の音量を個別調整 |
| 💾 **セーブ／続き** | 進行状況を `localStorage` に保存、「続きから」で再開 |
| ↩️ **待った（Undo）** | 同じ手番内なら手を戻せる |
| ⚡ **アニメーション** | サイコロとコマの動き、速度調整可能 |
| 📱 **レスポンシブ** | スマホ・タブレット・PC のレイアウトに自動対応 |
| ♿ **アクセシビリティ** | ARIA ロール・ライブリージョン・キーボード対応ボタン |

### 🎮 遊び方

盤面には **24 のポイント（三角形）**、中央の **バー**、そして両陣営の **ホーム／ベアオフ** トレイがあります。

| 手順 | 操作 | 説明 |
|------|------|------|
| 1️⃣ | **サイコロを振る** 🎲 を押す | 2 つのサイコロで動かせるポイント数が決まる |
| 2️⃣ | **コマをクリック**し、ハイライトされた移動先をクリック | 合法な移動先は自動でハイライト |
| 3️⃣ | **両方のサイコロ**を使う（ゾロ目なら 4 手） | サイコロ 1 個＝1 手 |
| 4️⃣ | 相手のブロット（1 個のコマ）を**ヒット**してバーへ送る | 相手は再エントリーするまで他の手を打てない |
| 5️⃣ | 15 個すべてが自陣ホームに入ったら **ベアオフ** 🏠 を押す | コマを盤外へ |
| 6️⃣ | **先に 15 個すべてをベアオフした方が勝ち！** 🏆 | — |

**画面の操作ボタン**

| ボタン | 機能 |
|--------|------|
| 🎲 サイコロを振る | 手番のサイコロを振る |
| 🏠 ベアオフ | 自陣ホームからコマを 1 個取り出す |
| ↩️ 待った | この手番の直前の手を戻す |
| ✅ 手番終了 | 手番を終えて AI に渡す |
| ⚙ / ♪ | クイック設定／ミュート切替 |

### 🎯 バックギャモンのルール

<details>
<summary><strong>クリックして全ルールを表示</strong></summary>

- **配置：** 各プレイヤーは標準配置（2-5-3-5）で 15 個のコマを置いてスタート。
- **目的：** すべてのコマを自陣 *ホームボード* に集め、*ベアオフ* する。先に 15 個出した方が勝ち。
- **移動：** 各色は自分のホーム方向へ進む。サイコロ 1 個ごとに 1 手。同じコマを 2 回、または別々のコマを 1 回ずつ動かせる。
- **ゾロ目：** 2 つのサイコロが同じ目なら、その目で **4 手**動かせる。
- **ブロットとヒット：** コマが 1 個だけのポイントは *ブロット*。相手のブロットに着地するとそのコマを **バー** へ送る。
- **バー：** バー上のコマは、まず相手のホームボードへ **再エントリー** しないと他の手を打てない。
- **ブロックポイント：** 相手のコマが **2 個以上**あるポイントには着地できない。
- **ベアオフ：** **すべて**のコマが自陣ホームに入って初めて可能。
- **強制ムーブ：** 一部のサイコロしか合法に使えない場合、可能な限り多く使わなければならない。

</details>

### 🤖 AI 対戦相手

AI は黒のコマを操作します。強さは **設定 → AI 難易度** で選べます。

| 難易度 | ファイル | 挙動 |
|--------|---------|------|
| 🟢 **やさしい** | `ai-easy.js` | ほぼランダムに合法手を選択——練習に最適。 |
| 🟡 **ふつう** | `ai-normal.js` | 各局面をヒューリスティック（ピップ数・ヒット・ブロット・メイクポイント）で採点し最善を選ぶ。 |
| 🔴 **むずかしい** | `ai-hard.js` | **先読み**を追加：複数のサイコロ目で相手の応手を想定し、あなたの最善手を最小化する軽量 expectimax。 |

3 つとも `rules.js` の手生成器（`getLegalTurnSequences`）を共有し、`ai-manager.js` から振り分けられます。

### 🧩 コード構成

本プロジェクトはシンプルでフレームワーク不要の方式を採用：各ファイルは単一のグローバル名前空間 `window.Backgammon`（別名 `BG`）に登録する **IIFE** です。`index.html` が依存順にスクリプトを読み込み、責務はレイヤーごとに明確に分離されています。

```
┌─────────────────────────────────────────────────────────┐
│  index.html  →  全 CSS + JS を読み込み、各画面の構造を定義 │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   core/      │   │   game/      │   │   render/    │
│ 状態・i18n・ │   │ ルール・盤・ │   │ Canvas 盤・  │
│ セーブ・定数 │──▶│ サイコロ・   │──▶│ コマ・       │
│              │   │ コマ・AI     │   │ サイコロ・動画│
└──────────────┘   └──────────────┘   └──────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           ▼
                  ┌──────────────────┐      ┌──────────────┐
                  │      ui/         │      │    lib/      │
                  │ メニュー・ゲーム │◀────▶│ サウンド     │
                  │ 設定・ヘルプ・   │      │ エンジン     │
                  │ モーダル・テーマ │      └──────────────┘
                  └──────────────────┘
                           ▼
                       main.js  （全体を起動）
```

**レイヤーの責務**

| レイヤー | フォルダ | 責務 |
|---------|---------|------|
| 🧠 コア Core | `js/core/` | ゲーム状態・定数・i18n 読み込み・`localStorage` 永続化 |
| ♟️ ゲーム Game | `js/game/` | 純粋なルールエンジン・盤モデル・サイコロ・コマ・AI |
| 🎨 描画 Render | `js/render/` | すべての Canvas 描画とアニメーション |
| 🖱️ UI | `js/ui/` | 各画面・操作・設定・ヘルプ・モーダル・テーマ |
| 🔊 ライブラリ Lib | `js/lib/` | Web Audio サウンドエンジン |
| 🚀 エントリ Entry | `js/main.js` | DOM 起動と画面ルーティング |
| 💅 スタイル Styles | `css/` | 22 個のモジュール CSS（base／layout／components／screens／themes／animations） |
| 🌐 ロケール Locales | `locales/` | `en.json`・`ja.json`・`zh-TW.json` 翻訳文字列 |

### 🗂️ ファイル一覧

<details>
<summary><strong>プロジェクト構成と各ファイルの説明</strong></summary>

```
Backgammon/
├── index.html              # 唯一のエントリーページ；全画面のマークアップ
├── backgammon-spec.md      # 完全な設計仕様書（繁体字中国語）
│
├── css/                    # 22 個のモジュール式スタイルシート
│   ├── base/               # reset・タイポグラフィ・CSS 変数
│   ├── layout/             # メインレイアウト + レスポンシブ
│   ├── components/         # 盤・コマ・サイコロ・ボタン・モーダル
│   ├── screens/            # メニュー・ゲーム・設定・ヘルプ
│   ├── themes/             # クラシック／オーシャン／フォレスト／サンセット／ナイト
│   └── animations/         # サイコロ・コマ移動・トランジション
│
├── js/
│   ├── core/
│   │   ├── constants.js    # 色・方向・ホーム/バー位置・補助関数
│   │   ├── state.js        # ゲーム状態の生成・開始ロール・手番
│   │   ├── i18n.js         # ロケール読み込みと文字列補間
│   │   └── storage.js      # 設定 + セーブを localStorage に保存
│   ├── game/
│   │   ├── rules.js        # ★ ルールエンジン：合法手・ヒット・ベアオフ
│   │   ├── board.js        # 初期盤と盤ヘルパー
│   │   ├── dice.js         # サイコロを振る・目の消費
│   │   ├── pieces.js       # コマ移動の適用
│   │   ├── ai-easy.js      # ランダム合法手 AI
│   │   ├── ai-normal.js    # ヒューリスティック評価 AI
│   │   ├── ai-hard.js      # 先読み（軽量 expectimax）AI
│   │   └── ai-manager.js   # 難易度ごとに振り分け
│   ├── render/
│   │   ├── canvas-board.js  # 盤・ポイント・バー・トレイを描画
│   │   ├── canvas-pieces.js # コマを描画
│   │   ├── canvas-dice.js   # サイコロを描画
│   │   └── animations.js    # 移動とサイコロのアニメーション
│   ├── ui/
│   │   ├── menu.js          # メインメニュー + 続きから
│   │   ├── game-ui.js       # ★ ゲーム内の操作と制御の配線
│   │   ├── settings-ui.js   # 設定画面
│   │   ├── help-ui.js       # ヘルプ／説明タブ
│   │   ├── modal.js         # 再利用可能なダイアログ
│   │   └── theme.js         # テーマ切替
│   ├── lib/
│   │   └── audio-engine.js  # Web Audio の BGM と効果音
│   └── main.js              # アプリ起動と画面ルーター
│
└── locales/
    ├── en.json
    ├── ja.json
    └── zh-TW.json
```

</details>

---

<p align="center">
  🎲 <strong>Enjoy the game! ・ 祝你遊戲愉快！ ・ お楽しみください！</strong> 🎲<br>
  <sub>Version 1.0.0 — Pure front-end · No build · No dependencies</sub>
</p>
