# 🎮 Ultimate Tic-Tac-Toe / 終極井字棋 / 究極三目並べ

Standalone browser game built with plain **HTML / CSS / JavaScript**.  
純前端瀏覽器遊戲，直接開啟 `index.html` 即可遊玩。  
HTML / CSS / JavaScript のみで動作する、ブラウザ向けゲームです。

| Item | Value |
|---|---|
| 🚀 Entry | [`index.html`](index.html) |
| 📘 Spec | [`ultimate-tictactoe-spec.md`](ultimate-tictactoe-spec.md) |
| 🧱 Build | Not required / 不需要 / 不要 |
| 🌐 Network | Not required / 離線可用 / オフライン対応 |
| 🎯 Mode | Player vs AI |
| 🧠 AI | Easy / Normal / Hard |
| 💾 Save | LocalStorage |
| 🗣️ Languages | 繁體中文 / English / 日本語 |

---

## ⚡ Quick Navigation / 快速導覽 / クイックナビ

| I want to read... | 繁體中文 | English | 日本語 |
|---|---|---|---|
| 🎮 Game introduction | [遊戲介紹](#zh-game-intro) | [Game Introduction](#en-game-intro) | [ゲーム紹介](#ja-game-intro) |
| 🕹️ How to play | [遊戲玩法](#zh-gameplay) | [How to Play](#en-gameplay) | [遊び方](#ja-gameplay) |
| 🧭 Screen guide | [介面導覽](#zh-screen-guide) | [Screen Guide](#en-screen-guide) | [画面ガイド](#ja-screen-guide) |
| 🧩 Program overview | [程式介紹](#zh-program-overview) | [Program Overview](#en-program-overview) | [プログラム紹介](#ja-program-overview) |
| 🗂️ Program categories | [程式分類](#zh-program-categories) | [Program Categories](#en-program-categories) | [プログラム分類](#ja-program-categories) |
| 💾 Storage data | [儲存資料](#zh-storage) | [Storage Data](#en-storage) | [保存データ](#ja-storage) |

---

<a id="zh"></a>

# 繁體中文

<a id="zh-game-intro"></a>

## 🎮 遊戲介紹

**Ultimate Tic-Tac-Toe（終極井字棋）** 是進階版井字棋。遊戲不是只有一個 3×3 棋盤，而是由 **9 個小棋盤** 組成一個 **3×3 大棋盤**。

玩家與 AI 輪流落子。你在小棋盤中的落子位置，會決定對手下一步必須前往的大棋盤位置。這讓遊戲不只是在單一棋盤搶三連線，也需要控制對手下一步能去哪裡。

### ✨ 主要特色

| 類別 | 內容 |
|---|---|
| 🎯 遊戲模式 | 玩家 vs AI |
| 🧠 AI 難度 | 簡單、普通、困難 |
| ❌⭕ 棋子選擇 | 玩家可選擇使用 X 或 O |
| 🧩 棋盤規則 | 9 個小棋盤組成 1 個大棋盤 |
| 🏆 勝利條件 | 在大棋盤中佔領三個連線小棋盤 |
| 💾 儲存 | LocalStorage 自動保存進度與設定 |
| 🌐 語系 | 繁體中文、英文、日文 |
| 🎨 主題 | Classic、Neon、Ocean、Sakura |
| 🔊 音效 | Web Audio API 產生 BGM 與音效 |
| 📱 版面 | 桌機、平板、手機響應式支援 |

### 🚀 快速開始

1. 用瀏覽器開啟 [`index.html`](index.html)。
2. 點選「開始遊戲」。
3. 選擇 AI 難度。
4. 選擇要使用 `X` 或 `O`。
5. 開始遊玩。

不需要安裝 npm、不需要 build、不需要啟動伺服器。

<a id="zh-gameplay"></a>

## 🕹️ 遊戲玩法

### 🧱 棋盤結構

```text
大棋盤 3×3

┌─────────┬─────────┬─────────┐
│ 小棋盤  │ 小棋盤  │ 小棋盤  │
│  3×3    │  3×3    │  3×3    │
├─────────┼─────────┼─────────┤
│ 小棋盤  │ 小棋盤  │ 小棋盤  │
│  3×3    │  3×3    │  3×3    │
├─────────┼─────────┼─────────┤
│ 小棋盤  │ 小棋盤  │ 小棋盤  │
│  3×3    │  3×3    │  3×3    │
└─────────┴─────────┴─────────┘
```

| 棋盤層級 | 說明 |
|---|---|
| 小棋盤 | 每個小棋盤是 3×3，共 9 格 |
| 大棋盤 | 由 9 個小棋盤排成 3×3 |
| 全部格子 | 9 個小棋盤 × 9 格 = 81 格 |

### 🎯 遊戲目標

你需要在 **大棋盤** 中佔領三個連成一線的小棋盤。

小棋盤的佔領方式與一般井字棋相同：在該小棋盤內先連成三子，就能佔領該小棋盤。

### 🚦 落子規則

| 情境 | 規則 |
|---|---|
| 第一手 | `X` 先手，可在任意小棋盤任意格落子 |
| 一般情況 | 你落在哪個小格，就會指定對手下一步到大棋盤對應位置的小棋盤 |
| 指定棋盤未完成 | 對手必須在指定的小棋盤落子 |
| 指定棋盤已完成 | 對手可在任意未完成的小棋盤落子 |
| 格子已被佔用 | 不可落子 |
| 小棋盤已完成 | 不可再在該小棋盤落子 |

### 📌 指定棋盤範例

如果玩家在某個小棋盤的「右上角」落子，AI 下一步就必須到大棋盤的「右上角小棋盤」落子。

```text
你落子的位置：小棋盤中的 [上排, 右欄]
下一步目標：大棋盤中的 [上排, 右欄] 小棋盤
```

### ❌⭕ 玩家可選棋子

| 選擇 | 先後手 | 說明 |
|---|---|---|
| 使用 X | 玩家先手 | 玩家第一步可自由選擇任意格 |
| 使用 O | AI 先手 | AI 使用 X 開局，玩家接著使用 O |

### 🧠 AI 難度

| 難度 | 行為 |
|---|---|
| 簡單 | 隨機選擇合法落子 |
| 普通 | 會評估攻擊、防守、小棋盤威脅與位置價值 |
| 困難 | 使用深度搜尋與 Alpha-Beta 剪枝，並有超時保護 |

### 🏆 勝利與平局

| 結果 | 條件 |
|---|---|
| 小棋盤勝利 | 在小棋盤內橫、直、斜任一方向連成三子 |
| 大棋盤勝利 | 在大棋盤中佔領三個連線小棋盤 |
| 平局 | 全部小棋盤完成，但大棋盤沒有人連線 |

<a id="zh-screen-guide"></a>

## 🧭 介面導覽

| 畫面 | 功能 |
|---|---|
| 🏠 主畫面 | 開始遊戲、繼續遊戲、進入說明、進入設定 |
| 🎚️ 開始彈窗 | 選擇 AI 難度與玩家棋子 |
| 🧩 遊戲畫面 | 顯示棋盤、目前回合、AI 難度、指定棋盤、步數與時間 |
| 📘 說明頁 | 用手風琴區塊說明規則、策略與 AI |
| ⚙️ 設定頁 | 語言、主題、BGM 音量、音效音量、靜音、重置設定 |
| 🏁 結果頁 | 顯示勝負、步數、用時、再玩一次、返回主選單 |

<a id="zh-program-overview"></a>

## 🧩 程式介紹

這個專案是純前端單頁應用，不使用 npm 套件、不使用打包工具、不使用 CDN，也不使用 ES Module。所有檔案由 `index.html` 依序載入，透過全域物件共享模組。

### 🧭 執行流程

```text
index.html
  ↓ 載入 CSS
  ↓ 載入核心 JS
  ↓ 載入 AI / i18n / storage / audio / ui
  ↓ js/main.js 初始化
  ↓ 顯示主畫面
```

### 🧠 核心狀態

主要遊戲狀態由 [`js/core/state.js`](js/core/state.js) 建立，包含：

| 欄位 | 說明 |
|---|---|
| `boards` | 9 個小棋盤的 3×3 落子資料 |
| `megaBoard` | 大棋盤中每個小棋盤的結果 |
| `currentPlayer` | 目前輪到 `X` 或 `O` |
| `playerSymbol` | 玩家使用的棋子 |
| `aiSymbol` | AI 使用的棋子 |
| `nextBoard` | 下一步被指定的小棋盤 |
| `phase` | `playing` 或 `ended` |
| `winner` | 勝者、平局或尚未結束 |
| `difficulty` | AI 難度 |
| `history` | 悔棋用歷史紀錄 |
| `moveCount` | 步數 |

### 🔁 主要互動流程

```text
玩家點擊格子
  ↓
Rules.isValidMove 驗證是否合法
  ↓
BoardUtils.applyMove 套用落子
  ↓
檢查小棋盤勝負
  ↓
檢查大棋盤勝負
  ↓
更新 UI 與 LocalStorage
  ↓
若輪到 AI，排程 AI 落子
```

<a id="zh-program-categories"></a>

## 🗂️ 程式分類

| 分類 | 檔案 | 責任 |
|---|---|---|
| 🏁 入口 | [`index.html`](index.html) | 場景容器、CSS/JS 載入、主要 DOM 結構 |
| 🎨 基礎樣式 | [`css/base`](css/base) | reset、CSS 變數、字體排版 |
| 📐 版面 | [`css/layout`](css/layout) | 主版面、遊戲版面、RWD |
| 🧱 元件樣式 | [`css/components`](css/components) | 棋盤、按鈕、HUD、彈窗、設定、說明、動畫 |
| 🌈 主題 | [`css/themes`](css/themes) | Classic、Neon、Ocean、Sakura 主題色 |
| 🧠 核心 | [`js/core`](js/core) | 狀態、棋盤運算、規則、遊戲流程 |
| 🤖 AI | [`js/ai`](js/ai) | Easy、Normal、Hard、評分函式 |
| 🖥️ UI | [`js/ui`](js/ui) | 棋盤渲染、HUD、彈窗、動畫 |
| 🔊 音訊 | [`js/audio`](js/audio) | Web Audio BGM 與音效 |
| 🌐 語系 | [`js/i18n`](js/i18n) | 繁中、英文、日文與翻譯核心 |
| 💾 儲存 | [`js/storage`](js/storage) | LocalStorage 封裝 |
| 🖼️ 圖示 | [`assets/icons`](assets/icons) | favicon 與圖示資源 |

### 🧠 AI 檔案分工

| 檔案 | 說明 |
|---|---|
| [`ai-easy.js`](js/ai/ai-easy.js) | 從合法步中隨機選擇 |
| [`ai-normal.js`](js/ai/ai-normal.js) | 使用啟發式分數，優先進攻與防守 |
| [`ai-hard.js`](js/ai/ai-hard.js) | 使用 Minimax 與 Alpha-Beta 剪枝 |
| [`ai-evaluator.js`](js/ai/ai-evaluator.js) | 提供局面、棋盤、落子評分 |

<a id="zh-storage"></a>

## 💾 儲存資料

| LocalStorage Key | 用途 |
|---|---|
| `utttt_settings` | 語言、主題、音量、靜音設定 |
| `utttt_save` | 未完成對局的進度 |
| `utttt_stats` | 勝敗、總局數、最佳步數 |

遊戲會在每次落子後自動保存。遊戲結束後會清除進度存檔並更新統計。

---

<a id="en"></a>

# English

<a id="en-game-intro"></a>

## 🎮 Game Introduction

**Ultimate Tic-Tac-Toe** is an advanced version of classic Tic-Tac-Toe. Instead of one 3×3 board, the game contains **nine small 3×3 boards** arranged into one **mega 3×3 board**.

The key twist is movement control. The cell you choose inside a small board determines which small board your opponent must play in next. Winning therefore requires both local tactics and long-term board control.

### ✨ Features

| Category | Details |
|---|---|
| 🎯 Mode | Player vs AI |
| 🧠 AI | Easy, Normal, Hard |
| ❌⭕ Mark Selection | Player can choose X or O |
| 🧩 Board | 9 small boards inside 1 mega board |
| 🏆 Goal | Claim 3 small boards in a row |
| 💾 Save | LocalStorage progress and settings |
| 🌐 Languages | Traditional Chinese, English, Japanese |
| 🎨 Themes | Classic, Neon, Ocean, Sakura |
| 🔊 Audio | Web Audio API generated BGM and SFX |
| 📱 Responsive | Desktop, tablet, and mobile layouts |

### 🚀 Quick Start

1. Open [`index.html`](index.html) in a browser.
2. Click **Start Game**.
3. Choose AI difficulty.
4. Choose whether to play as `X` or `O`.
5. Play the game.

No npm install, build step, local server, or CDN is required.

<a id="en-gameplay"></a>

## 🕹️ How to Play

### 🧱 Board Structure

```text
Mega board 3×3

┌─────────┬─────────┬─────────┐
│ Small   │ Small   │ Small   │
│ board   │ board   │ board   │
├─────────┼─────────┼─────────┤
│ Small   │ Small   │ Small   │
│ board   │ board   │ board   │
├─────────┼─────────┼─────────┤
│ Small   │ Small   │ Small   │
│ board   │ board   │ board   │
└─────────┴─────────┴─────────┘
```

| Layer | Description |
|---|---|
| Small board | A normal 3×3 Tic-Tac-Toe board |
| Mega board | 9 small boards arranged as 3×3 |
| Total cells | 9 small boards × 9 cells = 81 cells |

### 🎯 Goal

Win three small boards in a row on the mega board.

To claim a small board, make three marks in a row inside that small board, just like classic Tic-Tac-Toe.

### 🚦 Move Rules

| Situation | Rule |
|---|---|
| First move | `X` moves first and may play anywhere |
| Normal move | Your selected cell sends the opponent to the matching small board |
| Target board is open | The opponent must play in that board |
| Target board is complete | The opponent may play in any unfinished board |
| Occupied cell | Cannot be played |
| Completed small board | Cannot be played |

### 📌 Target Board Example

If you play in the top-right cell of a small board, the opponent must play in the top-right small board of the mega board.

```text
Your cell: [top row, right column]
Next target: [top row, right column] small board
```

### ❌⭕ Player Mark Selection

| Selection | Turn Order | Meaning |
|---|---|---|
| Play X | Player first | The player opens the game |
| Play O | AI first | AI plays X first, then the player plays O |

### 🧠 AI Difficulty

| Difficulty | Behavior |
|---|---|
| Easy | Random legal moves |
| Normal | Uses heuristic attack, defense, board pressure, and position value |
| Hard | Uses deeper search with Alpha-Beta pruning and timeout fallback |

### 🏆 Win and Draw

| Result | Condition |
|---|---|
| Small board win | Three in a row inside a small board |
| Mega board win | Three claimed small boards in a row |
| Draw | All small boards are complete and nobody wins the mega board |

<a id="en-screen-guide"></a>

## 🧭 Screen Guide

| Screen | Purpose |
|---|---|
| 🏠 Home | Start game, continue game, open help, open settings |
| 🎚️ Start dialog | Select AI difficulty and player mark |
| 🧩 Game | Board, current turn, AI difficulty, target board, moves, timer |
| 📘 Help | Accordion rule guide, strategy tips, AI explanation |
| ⚙️ Settings | Language, theme, BGM volume, SFX volume, mute, reset |
| 🏁 Result | Winner, moves, time, play again, main menu |

<a id="en-program-overview"></a>

## 🧩 Program Overview

This project is a plain front-end single-page application. It uses no npm packages, no bundler, no CDN, and no ES Module imports. `index.html` loads each script in order, and modules communicate through global objects.

### 🧭 Runtime Flow

```text
index.html
  ↓ load CSS
  ↓ load core JavaScript
  ↓ load AI / i18n / storage / audio / ui
  ↓ initialize js/main.js
  ↓ show home scene
```

### 🧠 Main State

The game state is created in [`js/core/state.js`](js/core/state.js).

| Field | Meaning |
|---|---|
| `boards` | Cell data for all 9 small boards |
| `megaBoard` | Result of each small board |
| `currentPlayer` | Current mark, `X` or `O` |
| `playerSymbol` | Player's selected mark |
| `aiSymbol` | AI's mark |
| `nextBoard` | Required target board for the next move |
| `phase` | `playing` or `ended` |
| `winner` | Winner, draw, or unfinished |
| `difficulty` | AI difficulty |
| `history` | Undo snapshots |
| `moveCount` | Number of moves |

### 🔁 Main Interaction Flow

```text
Player clicks a cell
  ↓
Rules.isValidMove validates the move
  ↓
BoardUtils.applyMove applies the move
  ↓
Check small board result
  ↓
Check mega board result
  ↓
Update UI and LocalStorage
  ↓
If it is AI's turn, schedule AI move
```

<a id="en-program-categories"></a>

## 🗂️ Program Categories

| Category | Files | Responsibility |
|---|---|---|
| 🏁 Entry | [`index.html`](index.html) | Scene containers, CSS/JS loading, main DOM |
| 🎨 Base CSS | [`css/base`](css/base) | Reset, variables, typography |
| 📐 Layout | [`css/layout`](css/layout) | Page layout, game layout, responsive rules |
| 🧱 Components | [`css/components`](css/components) | Board, buttons, HUD, modal, settings, help, animation |
| 🌈 Themes | [`css/themes`](css/themes) | Classic, Neon, Ocean, Sakura colors |
| 🧠 Core | [`js/core`](js/core) | State, board math, rules, game flow |
| 🤖 AI | [`js/ai`](js/ai) | Easy, Normal, Hard, evaluator |
| 🖥️ UI | [`js/ui`](js/ui) | Renderer, HUD, modal, animation |
| 🔊 Audio | [`js/audio`](js/audio) | Web Audio BGM and SFX |
| 🌐 i18n | [`js/i18n`](js/i18n) | Chinese, English, Japanese, translation engine |
| 💾 Storage | [`js/storage`](js/storage) | LocalStorage wrapper |
| 🖼️ Icons | [`assets/icons`](assets/icons) | Favicon and icon assets |

### 🧠 AI File Roles

| File | Role |
|---|---|
| [`ai-easy.js`](js/ai/ai-easy.js) | Random legal move |
| [`ai-normal.js`](js/ai/ai-normal.js) | Heuristic attack and defense |
| [`ai-hard.js`](js/ai/ai-hard.js) | Minimax with Alpha-Beta pruning |
| [`ai-evaluator.js`](js/ai/ai-evaluator.js) | Shared board and move scoring |

<a id="en-storage"></a>

## 💾 Storage Data

| LocalStorage Key | Purpose |
|---|---|
| `utttt_settings` | Language, theme, volume, mute |
| `utttt_save` | Unfinished game progress |
| `utttt_stats` | Wins, losses, draws, best move count |

The game saves after each move. When a game ends, the progress save is cleared and statistics are updated.

---

<a id="ja"></a>

# 日本語

<a id="ja-game-intro"></a>

## 🎮 ゲーム紹介

**Ultimate Tic-Tac-Toe（究極三目並べ）** は、通常の三目並べを発展させたゲームです。盤面は 1 つの 3×3 ではなく、**9 個の小さな 3×3 盤面** が集まった **大きな 3×3 盤面** です。

最大の特徴は、置いたマスが相手の次に置く小盤面を決めることです。そのため、単純に三目を作るだけでなく、相手をどこへ送るかを考える必要があります。

### ✨ 主な特徴

| 分類 | 内容 |
|---|---|
| 🎯 モード | プレイヤー vs AI |
| 🧠 AI 難易度 | かんたん、ふつう、むずかしい |
| ❌⭕ 記号選択 | プレイヤーは X または O を選択可能 |
| 🧩 盤面 | 9 個の小盤面で 1 つの大盤面を構成 |
| 🏆 目標 | 大盤面で小盤面を三つ一直線に取る |
| 💾 保存 | LocalStorage で進行状況と設定を保存 |
| 🌐 言語 | 繁體中文、English、日本語 |
| 🎨 テーマ | Classic、Neon、Ocean、Sakura |
| 🔊 音声 | Web Audio API による BGM と効果音 |
| 📱 レイアウト | PC、タブレット、スマートフォン対応 |

### 🚀 すぐに遊ぶ

1. ブラウザで [`index.html`](index.html) を開きます。
2. **ゲーム開始** を押します。
3. AI の難易度を選びます。
4. 自分が `X` か `O` のどちらで遊ぶか選びます。
5. ゲーム開始です。

npm、ビルド、ローカルサーバー、CDN は不要です。

<a id="ja-gameplay"></a>

## 🕹️ 遊び方

### 🧱 盤面構成

```text
大盤面 3×3

┌─────────┬─────────┬─────────┐
│ 小盤面  │ 小盤面  │ 小盤面  │
│  3×3    │  3×3    │  3×3    │
├─────────┼─────────┼─────────┤
│ 小盤面  │ 小盤面  │ 小盤面  │
│  3×3    │  3×3    │  3×3    │
├─────────┼─────────┼─────────┤
│ 小盤面  │ 小盤面  │ 小盤面  │
│  3×3    │  3×3    │  3×3    │
└─────────┴─────────┴─────────┘
```

| 階層 | 説明 |
|---|---|
| 小盤面 | 通常の 3×3 三目並べ |
| 大盤面 | 小盤面 9 個を 3×3 に配置 |
| 全マス数 | 9 小盤面 × 9 マス = 81 マス |

### 🎯 目的

大盤面で、小盤面を三つ一直線に獲得することが目的です。

小盤面は通常の三目並べと同じく、その小盤面内で三つ並べると獲得できます。

### 🚦 着手ルール

| 状況 | ルール |
|---|---|
| 最初の手 | `X` が先手で、どこにでも置けます |
| 通常 | 置いたマスの位置が、相手の次の小盤面を指定します |
| 指定先が未完了 | 相手は指定された小盤面に置く必要があります |
| 指定先が完了済み | 相手は未完了の任意の小盤面に置けます |
| 置かれているマス | 置けません |
| 完了した小盤面 | 置けません |

### 📌 指定盤面の例

ある小盤面の「右上」に置いた場合、相手は大盤面の「右上の小盤面」に置く必要があります。

```text
自分が置いた位置：[上段, 右列]
次の指定盤面：[上段, 右列] の小盤面
```

### ❌⭕ プレイヤー記号選択

| 選択 | 手番 | 説明 |
|---|---|---|
| X で遊ぶ | プレイヤー先手 | プレイヤーが最初に置きます |
| O で遊ぶ | AI 先手 | AI が X で開始し、その後プレイヤーが O を置きます |

### 🧠 AI 難易度

| 難易度 | 動き |
|---|---|
| かんたん | 合法手からランダムに選びます |
| ふつう | 攻撃、防御、小盤面の脅威、位置価値を評価します |
| むずかしい | 深い探索と Alpha-Beta 枝刈り、タイムアウト時の回避を使います |

### 🏆 勝利と引き分け

| 結果 | 条件 |
|---|---|
| 小盤面勝利 | 小盤面内で縦、横、斜めのいずれかに三つ並べる |
| 大盤面勝利 | 獲得した小盤面を大盤面で三つ並べる |
| 引き分け | 全小盤面が完了し、大盤面で誰も勝っていない |

<a id="ja-screen-guide"></a>

## 🧭 画面ガイド

| 画面 | 機能 |
|---|---|
| 🏠 ホーム | ゲーム開始、続きから、ヘルプ、設定 |
| 🎚️ 開始ダイアログ | AI 難易度とプレイヤー記号を選択 |
| 🧩 ゲーム画面 | 盤面、現在の手番、AI 難易度、指定盤面、手数、時間 |
| 📘 ヘルプ | ルール、戦略、AI 説明 |
| ⚙️ 設定 | 言語、テーマ、BGM 音量、効果音音量、ミュート、リセット |
| 🏁 結果 | 勝敗、手数、時間、もう一度、メインメニュー |

<a id="ja-program-overview"></a>

## 🧩 プログラム紹介

このプロジェクトは純粋なフロントエンドの単一ページアプリです。npm パッケージ、バンドラー、CDN、ES Module import は使っていません。`index.html` が各スクリプトを順番に読み込み、グローバルオブジェクトでモジュール間連携を行います。

### 🧭 実行フロー

```text
index.html
  ↓ CSS を読み込む
  ↓ core JavaScript を読み込む
  ↓ AI / i18n / storage / audio / ui を読み込む
  ↓ js/main.js で初期化
  ↓ ホーム画面を表示
```

### 🧠 メイン状態

ゲーム状態は [`js/core/state.js`](js/core/state.js) で生成されます。

| フィールド | 意味 |
|---|---|
| `boards` | 9 個の小盤面のマス情報 |
| `megaBoard` | 各小盤面の結果 |
| `currentPlayer` | 現在の記号、`X` または `O` |
| `playerSymbol` | プレイヤーが選んだ記号 |
| `aiSymbol` | AI の記号 |
| `nextBoard` | 次に置く必要がある小盤面 |
| `phase` | `playing` または `ended` |
| `winner` | 勝者、引き分け、未終了 |
| `difficulty` | AI 難易度 |
| `history` | 取り消し用スナップショット |
| `moveCount` | 手数 |

### 🔁 主な操作フロー

```text
プレイヤーがマスをクリック
  ↓
Rules.isValidMove で合法手か確認
  ↓
BoardUtils.applyMove で着手を反映
  ↓
小盤面の結果を確認
  ↓
大盤面の結果を確認
  ↓
UI と LocalStorage を更新
  ↓
AI の手番なら AI の着手を実行
```

<a id="ja-program-categories"></a>

## 🗂️ プログラム分類

| 分類 | ファイル | 役割 |
|---|---|---|
| 🏁 入口 | [`index.html`](index.html) | 画面コンテナ、CSS/JS 読み込み、主要 DOM |
| 🎨 基本 CSS | [`css/base`](css/base) | reset、変数、タイポグラフィ |
| 📐 レイアウト | [`css/layout`](css/layout) | ページ配置、ゲーム配置、レスポンシブ |
| 🧱 コンポーネント | [`css/components`](css/components) | 盤面、ボタン、HUD、モーダル、設定、ヘルプ、アニメーション |
| 🌈 テーマ | [`css/themes`](css/themes) | Classic、Neon、Ocean、Sakura の色 |
| 🧠 コア | [`js/core`](js/core) | 状態、盤面計算、ルール、ゲーム進行 |
| 🤖 AI | [`js/ai`](js/ai) | Easy、Normal、Hard、評価関数 |
| 🖥️ UI | [`js/ui`](js/ui) | 描画、HUD、モーダル、アニメーション |
| 🔊 音声 | [`js/audio`](js/audio) | Web Audio BGM と効果音 |
| 🌐 i18n | [`js/i18n`](js/i18n) | 中国語、英語、日本語、翻訳エンジン |
| 💾 保存 | [`js/storage`](js/storage) | LocalStorage ラッパー |
| 🖼️ アイコン | [`assets/icons`](assets/icons) | favicon とアイコン素材 |

### 🧠 AI ファイルの役割

| ファイル | 役割 |
|---|---|
| [`ai-easy.js`](js/ai/ai-easy.js) | 合法手からランダム選択 |
| [`ai-normal.js`](js/ai/ai-normal.js) | ヒューリスティックな攻撃と防御 |
| [`ai-hard.js`](js/ai/ai-hard.js) | Alpha-Beta 枝刈り付き Minimax |
| [`ai-evaluator.js`](js/ai/ai-evaluator.js) | 盤面と手の評価 |

<a id="ja-storage"></a>

## 💾 保存データ

| LocalStorage Key | 用途 |
|---|---|
| `utttt_settings` | 言語、テーマ、音量、ミュート |
| `utttt_save` | 未完了ゲームの進行状況 |
| `utttt_stats` | 勝敗、引き分け、最短勝利手数 |

ゲームは着手ごとに自動保存されます。ゲーム終了時には進行状況の保存を削除し、統計を更新します。
