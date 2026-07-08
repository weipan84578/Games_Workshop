<div align="center">

# 🎲 Nim 尼姆・搶數字

**A cute & strategic single-player Nim game against AI**

かわいい＆戦略的なAI対戦ニムゲーム ｜ 可愛風格的單人 AI 對戰尼姆遊戲

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6384?style=for-the-badge)](#)
[![Offline](https://img.shields.io/badge/Offline_Ready-4CAF50?style=for-the-badge)](#)

</div>

---

## 🌐 Language / 言語 / 語言

| Language | Section |
|:--------:|:-------:|
| 🇬🇧 [English](#-english) | Jump to English |
| 🇯🇵 [日本語](#-日本語) | 日本語セクションへ |
| 🇹🇼 [繁體中文](#-繁體中文) | 跳至中文區段 |

---

<br>

# 🇬🇧 English

## 📑 Table of Contents

- [About the Game](#-about-the-game)
- [Quick Start](#-quick-start)
- [How to Play](#-how-to-play)
  - [Basic Rules](#-basic-rules)
  - [Win Conditions](#-win-conditions)
  - [Controls](#-controls)
  - [AI Difficulty](#-ai-difficulty)
  - [Pile Presets](#-pile-presets)
- [Features Overview](#-features-overview)
- [Program Architecture](#-program-architecture)
  - [Tech Stack](#-tech-stack)
  - [Folder Structure](#-folder-structure)
  - [Module Classification](#-module-classification)
  - [Key Design Decisions](#-key-design-decisions)
- [Themes & Skins](#-themes--skins)
- [Internationalization](#-internationalization)
- [FAQ](#-faq-en)

---

## 🎮 About the Game

**Nim** (also known as "搶數字" in Chinese) is a classic mathematical strategy game. This project is a **zero-build, offline-ready** web game where you play against an AI opponent powered by the **Nim-Sum (XOR) algorithm**.

> 🎯 **Goal:** Outsmart the AI by strategically removing objects from piles!

### ✨ Highlights

| Feature | Description |
|:-------:|:------------|
| 🧠 | **Smart AI** — 4 difficulty levels using Nim-Sum theorem |
| 🎨 | **6 Themes** — Cute, Candy, Ocean, Forest, Sunset, Night |
| 🌐 | **3 Languages** — 中文, English, 日本語 |
| 🔊 | **Synthesized Audio** — BGM & SFX via Web Audio API |
| 📱 | **Responsive** — Desktop, tablet, and mobile ready |
| 💾 | **Auto-Save** — Continue your game anytime |
| 🔌 | **Zero Install** — Just double-click `index.html` |

---

## 🚀 Quick Start

```
1. Download or clone this repository
2. Open  index.html  in any modern browser
3. That's it! No server, no npm, no build step needed.
```

> 💡 Works with `file://` protocol — just double-click the file!

**Supported browsers:** Chrome, Edge, Safari, Firefox (last 2 years)

---

## 🕹️ How to Play

### 📜 Basic Rules

```
┌─────────────────────────────────────────────┐
│  The board has several piles of objects.     │
│  Players take turns with the AI.            │
│                                             │
│  On each turn you MUST:                     │
│    ✅ Choose exactly ONE pile               │
│    ✅ Remove at least 1 object from it      │
│    ✅ You may take up to the entire pile     │
│    ❌ You CANNOT skip your turn             │
│    ❌ You CANNOT take from multiple piles   │
│                                             │
│  The game ends when ALL piles are empty.    │
└─────────────────────────────────────────────┘
```

### 🏆 Win Conditions

There are **two rule modes** — selectable in Settings:

| Mode | Rule | Who Wins? |
|:----:|:-----|:----------|
| 🟢 **Normal Play** | Take the last object to **WIN** | The player who picks the last piece wins |
| 🔴 **Misère Play** *(default)* | Take the last object to **LOSE** | The player who picks the last piece loses |

> ⚠️ **Tip:** Misère mode (搶輸版) reverses the endgame strategy — be careful not to be forced into taking the last object!

### 🎯 Controls

| Step | Action | Description |
|:----:|:------:|:------------|
| **①** | 👆 **Tap a pile** | Select a pile — it will glow with a highlight effect |
| **②** | **＋ / −** | Adjust the number of objects you want to take |
| **③** | ✅ **Confirm** | Press the "Take" button to execute your move |

> On mobile, controls are anchored to the bottom of the screen and **never** overlap the game board.

### 🤖 AI Difficulty

The AI uses the **Nim-Sum (XOR) strategy** — a mathematically proven optimal algorithm:

| Level | Icon | Strategy | Description |
|:-----:|:----:|:---------|:------------|
| **Easy** | 🐣 | 100% random | Never uses Nim-Sum. Great for beginners. |
| **Normal** | 🐰 | 70% optimal | Usually plays well, but makes occasional mistakes. |
| **Hard** | 🐯 | 95% optimal | Very strong. Rarely makes errors. |
| **Master** | 🐉 | 100% optimal | Perfect play. If it has a winning position, it **will** win. |

<details>
<summary>💡 <b>How does the Nim-Sum algorithm work?</b></summary>

<br>

The AI calculates the **XOR** of all pile sizes:

```
Nim-Sum = pile₁ XOR pile₂ XOR pile₃ ...

• If Nim-Sum ≠ 0 → there exists a winning move
• If Nim-Sum = 0 → current player is in a losing position
```

For **Misère mode**, the endgame strategy flips when all piles have ≤ 1 object remaining.

</details>

### 📦 Pile Presets

| Preset | Piles | Configuration |
|:------:|:-----:|:-------------|
| 🏛️ Classic | 3 | 3 / 4 / 5 |
| 📐 Standard | 4 | 1 / 3 / 5 / 7 |
| 🧩 Advanced | 5 | 2 / 4 / 6 / 8 / 10 |
| ✏️ Custom | 2–6 | 1–20 per pile (configurable) |

---

## ✨ Features Overview

| Category | Features |
|:---------|:---------|
| 🎮 **Gameplay** | Normal / Misère rules, 4 presets + custom piles, player / AI / random first turn |
| 🤖 **AI** | 4 difficulty levels, Nim-Sum XOR algorithm, Misère endgame handling |
| 🎨 **Themes** | 6 color themes with instant preview in settings |
| 🍬 **Skins** | 4 object skins: Stone, Candy, Star, Shell |
| 🔊 **Audio** | Synthesized BGM & SFX via Web Audio API, independent volume controls |
| 🌐 **i18n** | 中文 / English / 日本語 with one-click switching |
| 💾 **Save** | Auto-save progress to localStorage, continue anytime |
| 📱 **RWD** | 5 responsive breakpoints for all devices |
| ♿ **Accessibility** | WCAG AA contrast, 44×44px touch targets, reduce-motion toggle |
| 📖 **Instructions** | Tabbed in-game guide with rules, controls, AI info, and FAQ |

---

## 🏗️ Program Architecture

### 🛠️ Tech Stack

| Technology | Purpose | Why |
|:-----------|:--------|:----|
| **HTML5** | Page structure | Zero build — double-click to play |
| **CSS3** | Styling & themes | Custom properties, Flexbox, Grid, `dvh`/`svh` units |
| **Vanilla JS** | Game logic & UI | IIFE modules on `window.NimGame`, no ES modules (CORS-safe for `file://`) |
| **Web Audio API** | Sound system | `GainNode` for 10× in-game volume boost + `DynamicsCompressorNode` limiter |
| **localStorage** | Persistence | Save game state & user settings |
| **SVG** | Graphics | Inline mascot & object skins |

> ⚠️ **No ES Modules:** All scripts use traditional `<script>` tags with IIFE patterns to ensure compatibility with `file://` protocol (no CORS errors).

### 📁 Folder Structure

```
Nim/
├── 📄 index.html                    ← Entry point (double-click to play)
├── 📄 nim-game-specification.md     ← Technical specification
│
├── 📂 css/                          ← Stylesheets
│   ├── 📂 base/                     ← Foundation styles
│   │   ├── reset.css                   CSS reset / normalize
│   │   ├── variables.css               Global CSS custom properties
│   │   └── typography.css              Font families & sizing
│   ├── 📂 layout/                   ← Layout system
│   │   ├── grid.css                    App shell layout (header/main/footer)
│   │   └── rwd.css                     Responsive breakpoints & media queries
│   ├── 📂 themes/                   ← 6 switchable color themes
│   │   ├── theme-cute.css              🌸 Cute Pastel (default)
│   │   ├── theme-candy.css             🍬 Candy Pop
│   │   ├── theme-ocean.css             🌊 Ocean Blue
│   │   ├── theme-forest.css            🌳 Forest Green
│   │   ├── theme-sunset.css            🌇 Sunset Warm
│   │   └── theme-night.css             🌙 Night Dark
│   ├── 📂 components/               ← UI component styles
│   │   ├── board.css                   Game board & pile objects
│   │   ├── buttons.css                 Primary / secondary / icon buttons
│   │   ├── decorations.css             Floating shapes & theme decorations
│   │   ├── hud.css                     In-game HUD (turn, rules, difficulty)
│   │   ├── instructions.css            Instructions page tabs & panels
│   │   ├── menu.css                    Main menu layout
│   │   ├── modal.css                   Result & confirmation dialogs
│   │   └── settings.css                Settings page controls
│   └── 📂 animations/               ← Keyframe animations
│       └── animations.css              Shared @keyframes definitions
│
├── 📂 js/                           ← JavaScript modules
│   ├── 📄 main.js                   ← App entry point & screen routing
│   ├── 📂 core/                     ← Game logic layer
│   │   ├── ai-engine.js                AI: Nim-Sum algorithm & difficulty
│   │   ├── game-engine.js              Core: turn flow & legality checks
│   │   ├── rules.js                    Win condition definitions
│   │   └── state-manager.js            Save / load game state
│   ├── 📂 ui/                       ← UI controller layer
│   │   ├── animation-controller.js     Animation scheduling & effects
│   │   ├── board-renderer.js           Board rendering & pile interaction
│   │   ├── instructions-controller.js  Instructions page tab switching
│   │   ├── menu-controller.js          Main menu interaction
│   │   ├── modal-controller.js         Modal dialogs (result, confirm)
│   │   └── settings-controller.js      Settings page controls
│   ├── 📂 audio/                    ← Audio system
│   │   ├── audio-config.js             Note sequences & volume constants
│   │   └── audio-manager.js            Web Audio playback & gain control
│   ├── 📂 i18n/                     ← Internationalization
│   │   ├── i18n-manager.js             Language switching & t(key) function
│   │   └── 📂 locales/
│   │       ├── zh-TW.js                繁體中文 dictionary
│   │       ├── en.js                   English dictionary
│   │       └── ja.js                   日本語 dictionary
│   └── 📂 utils/                    ← Utility helpers
│       ├── dom-utils.js                DOM query & manipulation helpers
│       └── storage-utils.js            localStorage read / write wrapper
│
├── 📂 assets/                       ← Static resources
│   └── 📂 images/
│       └── 📂 mascot/               ← Mascot SVG (Nim-chan)
│
└── 📂 tasks/                        ← Development notes
    ├── todo.md                         Build log & verification records
    └── lessons.md                      Post-mortem lessons learned
```

### 🧩 Module Classification

All modules register on the `window.NimGame` global namespace via IIFE:

#### 🔵 Core Layer (`js/core/`)

| Module | Namespace | Responsibility |
|:-------|:----------|:---------------|
| `rules.js` | `NimGame.Rules` | Define Normal / Misère win conditions |
| `game-engine.js` | `NimGame.GameEngine` | Turn management, legality validation, pile manipulation |
| `ai-engine.js` | `NimGame.AIEngine` | Nim-Sum (XOR) calculation, difficulty-based move selection |
| `state-manager.js` | `NimGame.StateManager` | Save / load game & settings to localStorage |

#### 🟢 UI Layer (`js/ui/`)

| Module | Namespace | Responsibility |
|:-------|:----------|:---------------|
| `menu-controller.js` | `NimGame.MenuController` | Main menu buttons & continue-game logic |
| `board-renderer.js` | `NimGame.BoardRenderer` | Render pile objects, handle selection & amount |
| `settings-controller.js` | `NimGame.SettingsController` | Theme / difficulty / rule / skin / audio controls |
| `instructions-controller.js` | `NimGame.InstructionsController` | Tabbed instructions page |
| `modal-controller.js` | `NimGame.ModalController` | Reusable modal dialogs |
| `animation-controller.js` | `NimGame.AnimationController` | CSS animation scheduling |

#### 🟡 Audio Layer (`js/audio/`)

| Module | Namespace | Responsibility |
|:-------|:----------|:---------------|
| `audio-config.js` | `NimGame.AudioConfig` | BGM note sequences, SFX frequencies, volume multiplier (10×) |
| `audio-manager.js` | `NimGame.AudioManager` | Web Audio playback, GainNode control, DynamicsCompressor limiter |

#### 🟣 i18n Layer (`js/i18n/`)

| Module | Namespace | Responsibility |
|:-------|:----------|:---------------|
| `i18n-manager.js` | `NimGame.I18n` | `t(key)` translation function, DOM `data-i18n` scanning |
| `locales/*.js` | `NimGame.locales['xx']` | Flat key-value translation dictionaries |

#### ⚪ Utils Layer (`js/utils/`)

| Module | Namespace | Responsibility |
|:-------|:----------|:---------------|
| `dom-utils.js` | `NimGame.DOM` | `$(selector)`, `$$()`, class toggle helpers |
| `storage-utils.js` | `NimGame.Storage` | Safe JSON read/write to localStorage |

### 🔑 Key Design Decisions

| Decision | Rationale |
|:---------|:----------|
| **No ES Modules** | `file://` protocol blocks `import/export` due to browser CORS policy |
| **IIFE + global namespace** | Modular code without build tools; all modules attach to `window.NimGame` |
| **Web Audio API (not `<audio>`)** | Enables `GainNode` values > 1.0 for 10× in-game volume boost |
| **DynamicsCompressorNode** | Prevents clipping/distortion at high gain levels |
| **CSS Custom Properties** | Theme switching by swapping `data-theme` attribute — no reload needed |
| **`dvh` / `svh` units** | Prevents mobile browser address bar from overlapping game content |
| **localStorage** | Persists game state and settings without a backend |

---

## 🎨 Themes & Skins

### Color Themes

| Theme | File | Color Palette |
|:------|:-----|:-------------|
| 🌸 **Cute Pastel** | `theme-cute.css` | Pink, lavender, cream — hearts & stars |
| 🍬 **Candy Pop** | `theme-candy.css` | Macaron multi-color mix |
| 🌊 **Ocean Blue** | `theme-ocean.css` | Blue, teal, coral |
| 🌳 **Forest Green** | `theme-forest.css` | Green, brown, cream |
| 🌇 **Sunset Warm** | `theme-sunset.css` | Orange, magenta, gold |
| 🌙 **Night Dark** | `theme-night.css` | Dark blue, purple, neon accents |

### Object Skins

| Skin | CSS Class | Visual |
|:-----|:----------|:-------|
| 🪨 Stone | `object-stone` | Round pebble |
| 🍬 Candy | `object-candy` | Wrapped candy |
| ⭐ Star | `object-star` | Golden star |
| 🐚 Shell | `object-shell` | Sea shell |

---

## 🌐 Internationalization

Language switching is available from the **top-right dropdown** on any screen.

| Code | Language | Dictionary File |
|:----:|:---------|:---------------|
| `zh-TW` | 繁體中文 | `js/i18n/locales/zh-TW.js` |
| `en` | English | `js/i18n/locales/en.js` |
| `ja` | 日本語 | `js/i18n/locales/ja.js` |

- Language preference is saved to `localStorage`
- Falls back to browser language detection, then defaults to `zh-TW`
- All UI elements use `data-i18n` attributes for automatic text replacement

---

## ❓ FAQ {#faq-en}

<details>
<summary><b>Can I skip my turn?</b></summary>
No. Every turn you must take at least 1 object from one pile.
</details>

<details>
<summary><b>How do I continue a previous game?</b></summary>
The game auto-saves. Click "Continue" on the main menu to resume.
</details>

<details>
<summary><b>Does it work offline?</b></summary>
Yes! All assets are local — no internet connection needed.
</details>

<details>
<summary><b>Do I need to install anything?</b></summary>
No. Just open <code>index.html</code> in a modern browser.
</details>

<details>
<summary><b>Can I beat the Master AI?</b></summary>
Only if you go first AND the initial Nim-Sum ≠ 0. The Master AI plays perfectly — if it has a winning position, it will always win.
</details>

---

<br>
<br>

---

# 🇯🇵 日本語

## 📑 目次

- [ゲーム紹介](#-ゲーム紹介)
- [クイックスタート](#-クイックスタート)
- [遊び方](#-遊び方)
  - [基本ルール](#-基本ルール)
  - [勝敗条件](#-勝敗条件)
  - [操作方法](#-操作方法)
  - [AI難易度](#-ai難易度)
  - [山のプリセット](#-山のプリセット)
- [機能一覧](#-機能一覧)
- [プログラム構成](#-プログラム構成)
  - [技術スタック](#-技術スタック)
  - [フォルダ構成](#-フォルダ構成)
  - [モジュール分類](#-モジュール分類)
  - [設計方針](#-設計方針)
- [テーマ＆スキン](#-テーマスキン)
- [多言語対応](#-多言語対応)
- [よくある質問](#-よくある質問)

---

## 🎮 ゲーム紹介

**Nim（ニム）** は古典的な数学戦略ゲームです。本プロジェクトは**ビルド不要・オフライン対応**のウェブゲームで、**Nim-Sum（XOR）アルゴリズム**を搭載したAIと対戦できます。

> 🎯 **目標：** 戦略的にオブジェクトを取り除いてAIを打ち負かそう！

### ✨ 特徴

| 機能 | 説明 |
|:----:|:-----|
| 🧠 | **賢いAI** — Nim-Sum定理による4段階の難易度 |
| 🎨 | **6テーマ** — キュート、キャンディ、オーシャン、フォレスト、サンセット、ナイト |
| 🌐 | **3言語** — 中文、English、日本語 |
| 🔊 | **合成オーディオ** — Web Audio APIによるBGMと効果音 |
| 📱 | **レスポンシブ** — PC・タブレット・スマホ対応 |
| 💾 | **オートセーブ** — いつでも続きから遊べる |
| 🔌 | **インストール不要** — `index.html`をダブルクリックするだけ |

---

## 🚀 クイックスタート

```
1. リポジトリをダウンロードまたはクローン
2. index.html をブラウザで開く
3. 以上！サーバーもnpmもビルドも不要です。
```

> 💡 `file://` プロトコルで動作 — ファイルをダブルクリックするだけ！

**対応ブラウザ：** Chrome、Edge、Safari、Firefox（過去2年のバージョン）

---

## 🕹️ 遊び方

### 📜 基本ルール

```
┌──────────────────────────────────────────┐
│  盤面にはいくつかの「山」があります。      │
│  プレイヤーとAIが交互に行動します。        │
│                                          │
│  毎ターン必ず：                            │
│    ✅ 1つの山だけを選ぶ                    │
│    ✅ その山から1個以上取る                 │
│    ✅ 山全体を取ることも可能                │
│    ❌ パスはできません                      │
│    ❌ 複数の山から同時には取れません         │
│                                          │
│  全ての山が空になったらゲーム終了。          │
└──────────────────────────────────────────┘
```

### 🏆 勝敗条件

設定で切り替え可能な**2つのルールモード**：

| モード | ルール | 勝者は？ |
|:------:|:-------|:---------|
| 🟢 **通常版** | 最後の1個を取ったら**勝ち** | 最後のピースを取った人が勝利 |
| 🔴 **ミゼール版** *(デフォルト)* | 最後の1個を取ったら**負け** | 最後のピースを取った人が敗北 |

> ⚠️ **ヒント：** ミゼールモード（搶輸版）では終盤戦略が逆転します — 最後の1個を取らされないよう注意！

### 🎯 操作方法

| ステップ | 操作 | 説明 |
|:--------:|:----:|:-----|
| **①** | 👆 **山をタップ** | 山を選択 — 選択時にハイライト表示 |
| **②** | **＋ / −** | 取る数量を調整 |
| **③** | ✅ **確定** | 「取る」ボタンを押して実行 |

### 🤖 AI難易度

AIは**Nim-Sum（XOR）戦略**を使用 — 数学的に証明された最適アルゴリズム：

| レベル | アイコン | 戦略 | 説明 |
|:------:|:--------:|:-----|:-----|
| **初心者** | 🐣 | 100%ランダム | Nim-Sumを使わない。初心者向け。 |
| **普通** | 🐰 | 70%最適手 | 大体良い手を打つが、たまにミスする。 |
| **困難** | 🐯 | 95%最適手 | 非常に強い。ミスは稀。 |
| **達人** | 🐉 | 100%最適手 | 完璧なプレイ。有利な局面では**必ず**勝つ。 |

### 📦 山のプリセット

| プリセット | 山数 | 構成 |
|:----------:|:----:|:-----|
| 🏛️ クラシック | 3 | 3 / 4 / 5 |
| 📐 スタンダード | 4 | 1 / 3 / 5 / 7 |
| 🧩 アドバンスト | 5 | 2 / 4 / 6 / 8 / 10 |
| ✏️ カスタム | 2–6 | 各山1–20個（自由設定） |

---

## ✨ 機能一覧

| カテゴリ | 機能 |
|:---------|:-----|
| 🎮 **ゲームプレイ** | 通常 / ミゼールルール、4プリセット＋カスタム、先手後手選択 |
| 🤖 **AI** | 4段階の難易度、Nim-Sum XORアルゴリズム、ミゼール終盤対応 |
| 🎨 **テーマ** | 6色テーマ、設定でリアルタイムプレビュー |
| 🍬 **スキン** | 4種類：石、キャンディ、星、貝殻 |
| 🔊 **オーディオ** | Web Audio APIによる合成BGM・効果音、独立音量制御 |
| 🌐 **多言語** | 中文 / English / 日本語 ワンクリック切替 |
| 💾 **セーブ** | localStorageへ自動保存、いつでも再開 |
| 📱 **RWD** | 5段階レスポンシブブレークポイント |
| ♿ **アクセシビリティ** | WCAG AAコントラスト、44×44pxタッチ、モーション削減 |

---

## 🏗️ プログラム構成

### 🛠️ 技術スタック

| 技術 | 用途 | 理由 |
|:-----|:-----|:-----|
| **HTML5** | ページ構造 | ビルド不要 — ダブルクリックで起動 |
| **CSS3** | スタイリング＆テーマ | カスタムプロパティ、Flexbox、Grid、`dvh`/`svh`単位 |
| **Vanilla JS** | ゲームロジック＆UI | `window.NimGame`上のIIFEモジュール（ESモジュール非使用） |
| **Web Audio API** | サウンドシステム | `GainNode`による10倍増幅 + `DynamicsCompressorNode`リミッター |
| **localStorage** | データ永続化 | ゲーム状態＆設定の保存 |

### 📁 フォルダ構成

```
Nim/
├── 📄 index.html                    ← エントリーポイント
├── 📂 css/                          ← スタイルシート
│   ├── 📂 base/                        基盤スタイル（リセット、変数、タイポグラフィ）
│   ├── 📂 layout/                      レイアウト（グリッド、レスポンシブ）
│   ├── 📂 themes/                      6つの切替可能カラーテーマ
│   ├── 📂 components/                  UIコンポーネントスタイル
│   └── 📂 animations/                 キーフレームアニメーション
├── 📂 js/                           ← JavaScriptモジュール
│   ├── 📄 main.js                      アプリ初期化＆画面遷移
│   ├── 📂 core/                        ゲームロジック層
│   ├── 📂 ui/                          UIコントローラー層
│   ├── 📂 audio/                       オーディオシステム
│   ├── 📂 i18n/                        国際化
│   └── 📂 utils/                       ユーティリティヘルパー
├── 📂 assets/                       ← 静的リソース
└── 📂 tasks/                        ← 開発メモ
```

### 🧩 モジュール分類

| 層 | モジュール | 名前空間 | 責務 |
|:--:|:----------|:---------|:-----|
| 🔵 **Core** | `rules.js` | `NimGame.Rules` | 勝敗条件定義 |
| 🔵 | `game-engine.js` | `NimGame.GameEngine` | ターン管理・合法手チェック |
| 🔵 | `ai-engine.js` | `NimGame.AIEngine` | Nim-Sum計算・難易度制御 |
| 🔵 | `state-manager.js` | `NimGame.StateManager` | セーブ・ロード |
| 🟢 **UI** | `board-renderer.js` | `NimGame.BoardRenderer` | 盤面描画・選択操作 |
| 🟢 | `settings-controller.js` | `NimGame.SettingsController` | 設定画面制御 |
| 🟢 | `modal-controller.js` | `NimGame.ModalController` | モーダルダイアログ |
| 🟢 | `menu-controller.js` | `NimGame.MenuController` | メインメニュー |
| 🟡 **Audio** | `audio-manager.js` | `NimGame.AudioManager` | 音声再生・音量制御 |
| 🟣 **i18n** | `i18n-manager.js` | `NimGame.I18n` | 言語切替・翻訳関数 |
| ⚪ **Utils** | `dom-utils.js` | `NimGame.DOM` | DOMヘルパー |
| ⚪ | `storage-utils.js` | `NimGame.Storage` | localStorage操作 |

### 🔑 設計方針

| 方針 | 理由 |
|:-----|:-----|
| **ESモジュール非使用** | `file://`プロトコルではブラウザのCORSポリシーにより`import/export`がブロックされるため |
| **IIFE＋グローバル名前空間** | ビルドツールなしでモジュール化を実現 |
| **Web Audio API** | `<audio>`タグでは音量1.0が上限だが、`GainNode`は1.0を超えた増幅が可能 |
| **CSSカスタムプロパティ** | `data-theme`属性の切替でテーマ変更 — リロード不要 |

---

## 🎨 テーマ＆スキン

| テーマ | ファイル | カラーパレット |
|:-------|:---------|:-------------|
| 🌸 **キュートパステル** | `theme-cute.css` | ピンク、ラベンダー、クリーム |
| 🍬 **キャンディポップ** | `theme-candy.css` | マカロンカラーミックス |
| 🌊 **オーシャンブルー** | `theme-ocean.css` | ブルー、ティール、コーラル |
| 🌳 **フォレストグリーン** | `theme-forest.css` | グリーン、ブラウン、クリーム |
| 🌇 **サンセットウォーム** | `theme-sunset.css` | オレンジ、マゼンタ、ゴールド |
| 🌙 **ナイトダーク** | `theme-night.css` | ダークブルー、パープル、ネオン |

---

## 🌐 多言語対応

| コード | 言語 | ファイル |
|:------:|:-----|:--------|
| `zh-TW` | 繁體中文 | `js/i18n/locales/zh-TW.js` |
| `en` | English | `js/i18n/locales/en.js` |
| `ja` | 日本語 | `js/i18n/locales/ja.js` |

- 画面右上のドロップダウンからいつでも切替可能
- 言語設定は`localStorage`に保存
- ブラウザ言語を自動検出、デフォルトは`zh-TW`

---

## ❓ よくある質問

<details>
<summary><b>ターンをパスできますか？</b></summary>
いいえ。毎ターン1つの山から最低1個は取る必要があります。
</details>

<details>
<summary><b>前回の続きから遊べますか？</b></summary>
はい。ゲームは自動保存されます。メインメニューの「続きから」をクリックしてください。
</details>

<details>
<summary><b>オフラインで遊べますか？</b></summary>
はい！すべてのリソースはローカルに保存されています。
</details>

<details>
<summary><b>達人AIに勝てますか？</b></summary>
先手かつ初期Nim-Sum ≠ 0 の場合のみ可能です。達人AIは完璧にプレイするため、有利な局面では必ず勝ちます。
</details>

---

<br>
<br>

---

# 🇹🇼 繁體中文

## 📑 目錄

- [遊戲介紹](#-遊戲介紹)
- [快速開始](#-快速開始)
- [遊戲玩法](#-遊戲玩法)
  - [基本規則](#-基本規則)
  - [勝負規則](#-勝負規則)
  - [操作方式](#-操作方式)
  - [AI 難度](#-ai-難度)
  - [堆疊配置](#-堆疊配置)
- [功能總覽](#-功能總覽)
- [程式架構](#-程式架構)
  - [技術選型](#-技術選型)
  - [資料夾結構](#-資料夾結構)
  - [模組分類](#-模組分類)
  - [重要設計決策](#-重要設計決策)
- [主題與外觀](#-主題與外觀)
- [多國語系](#-多國語系)
- [常見問題](#-常見問題)

---

## 🎮 遊戲介紹

**Nim（尼姆 / 搶數字）** 是經典的數學策略遊戲。本專案是一款**零建置、完全離線**的網頁遊戲，玩家與搭載 **Nim-Sum（XOR）演算法** 的 AI 進行對戰。

> 🎯 **目標：** 運用策略從堆疊中拿取物件，智勝 AI！

### ✨ 特色亮點

| 功能 | 說明 |
|:----:|:-----|
| 🧠 | **智慧 AI** — 基於 Nim-Sum 定理的 4 級難度 |
| 🎨 | **6 種主題** — 可愛粉彩、糖果繽紛、海洋藍、森林綠、夕陽暖橘、夜間深色 |
| 🌐 | **3 種語言** — 中文、English、日本語 |
| 🔊 | **合成音效** — 透過 Web Audio API 生成 BGM 與音效 |
| 📱 | **響應式設計** — 桌機、平板、手機皆可遊玩 |
| 💾 | **自動存檔** — 隨時繼續上次進度 |
| 🔌 | **免安裝** — 雙擊 `index.html` 即可開玩 |

---

## 🚀 快速開始

```
1. 下載或複製（clone）本專案
2. 用瀏覽器開啟  index.html
3. 完成！不需要伺服器、不需要 npm、不需要任何建置步驟。
```

> 💡 支援 `file://` 協定 — 直接雙擊檔案就能玩！

**支援瀏覽器：** Chrome、Edge、Safari、Firefox（近 2 年版本）

---

## 🕹️ 遊戲玩法

### 📜 基本規則

```
┌──────────────────────────────────────────┐
│  場上有數堆物件（石頭/糖果/星星/貝殼）。   │
│  玩家與 AI 輪流行動。                      │
│                                          │
│  每回合你必須：                            │
│    ✅ 選擇「一堆」（且僅能一堆）            │
│    ✅ 從該堆拿走至少 1 個物件               │
│    ✅ 可以一次拿走整堆                      │
│    ❌ 不能跳過回合                          │
│    ❌ 不能同時從多堆拿取                    │
│                                          │
│  所有堆的物品數量皆為 0 時，遊戲結束。      │
└──────────────────────────────────────────┘
```

### 🏆 勝負規則

可在設定頁切換的**兩種規則模式**：

| 模式 | 規則 | 誰贏？ |
|:----:|:-----|:-------|
| 🟢 **標準版（Normal）** | 拿到最後一個就**獲勝** | 拿走最後一個物件的玩家勝利 |
| 🔴 **搶輸版（Misère）** *(預設)* | 拿到最後一個就**落敗** | 拿走最後一個物件的玩家輸掉 |

> ⚠️ **提示：** 搶輸版的終局策略與標準版完全相反 — 小心不要被迫拿走最後一個物件！

### 🎯 操作方式

| 步驟 | 操作 | 說明 |
|:----:|:----:|:-----|
| **①** | 👆 **點擊堆疊** | 選擇一堆 — 會顯示發光選取效果 |
| **②** | **＋ / −** | 調整要拿取的數量 |
| **③** | ✅ **拿走** | 按下「拿走」按鈕執行動作 |

> 📱 手機版的操作按鈕固定在畫面底部，**不會**遮擋遊戲棋盤。

### 🤖 AI 難度

AI 使用 **Nim-Sum（XOR）策略** — 數學上已證明的最佳演算法：

| 等級 | 圖示 | 策略 | 說明 |
|:----:|:----:|:-----|:-----|
| **新手** | 🐣 | 100% 隨機 | 完全不使用 Nim-Sum。適合熟悉規則。 |
| **普通** | 🐰 | 70% 最佳解 | 通常會下好棋，但偶爾失誤。 |
| **困難** | 🐯 | 95% 最佳解 | 非常強。極少失誤。 |
| **大師** | 🐉 | 100% 最佳解 | 完美策略。若局面有利，AI **必勝**。 |

<details>
<summary>💡 <b>Nim-Sum 演算法是什麼？</b></summary>

<br>

AI 計算所有堆疊數量的 **XOR（互斥或）**：

```
Nim-Sum = 第一堆 XOR 第二堆 XOR 第三堆 ...

• 若 Nim-Sum ≠ 0 → 存在必勝手
• 若 Nim-Sum = 0 → 當前行動方處於劣勢
```

在**搶輸版**中，當所有堆的剩餘數量皆 ≤ 1 時，終局策略會翻轉。

</details>

### 📦 堆疊配置

| 預設模式 | 堆數 | 配置 |
|:--------:|:----:|:-----|
| 🏛️ 經典 | 3 | 3 / 4 / 5 |
| 📐 標準 | 4 | 1 / 3 / 5 / 7 |
| 🧩 進階 | 5 | 2 / 4 / 6 / 8 / 10 |
| ✏️ 自訂 | 2–6 | 每堆 1–20 個（自由設定） |

---

## ✨ 功能總覽

| 分類 | 功能 |
|:-----|:-----|
| 🎮 **遊戲玩法** | 標準 / 搶輸規則、4 種預設 + 自訂堆疊、先後手選擇 |
| 🤖 **AI 系統** | 4 級難度、Nim-Sum XOR 演算法、搶輸版終局處理 |
| 🎨 **主題** | 6 種色彩主題、設定頁即時預覽 |
| 🍬 **外觀** | 4 種物件造型：石頭、糖果、星星、貝殼 |
| 🔊 **音訊** | Web Audio API 合成 BGM 與音效、獨立音量控制 |
| 🌐 **語系** | 中文 / English / 日本語 一鍵切換 |
| 💾 **存檔** | 自動存入 localStorage、隨時繼續 |
| 📱 **RWD** | 5 組響應式斷點、支援各種裝置 |
| ♿ **無障礙** | WCAG AA 對比度、44×44px 觸控目標、減少動態效果開關 |
| 📖 **說明** | 遊戲內分頁式教學：規則、操作、AI 說明、FAQ |

---

## 🏗️ 程式架構

### 🛠️ 技術選型

| 技術 | 用途 | 原因 |
|:-----|:-----|:-----|
| **HTML5** | 頁面結構 | 零建置 — 雙擊即可遊玩 |
| **CSS3** | 樣式與主題 | 自訂屬性、Flexbox、Grid、`dvh`/`svh` 單位 |
| **Vanilla JS** | 遊戲邏輯與 UI | `window.NimGame` 上的 IIFE 模組，不使用 ES Module（避免 CORS 問題） |
| **Web Audio API** | 音訊系統 | `GainNode` 支援遊戲中 10 倍音量增幅 + `DynamicsCompressorNode` 限制器防爆音 |
| **localStorage** | 資料持久化 | 儲存遊戲狀態與使用者設定 |
| **SVG** | 圖形資源 | 內嵌吉祥物與物件外觀 |

### 📁 資料夾結構

```
Nim/
├── 📄 index.html                    ← 進入點（雙擊即玩）
├── 📄 nim-game-specification.md     ← 技術規格書
│
├── 📂 css/                          ← 樣式表
│   ├── 📂 base/                     ← 基礎樣式
│   │   ├── reset.css                   CSS 重設
│   │   ├── variables.css               全域 CSS 變數（色彩、字體、間距）
│   │   └── typography.css              字體家族與大小規範
│   ├── 📂 layout/                   ← 版面系統
│   │   ├── grid.css                    應用框架版面（header/main/footer）
│   │   └── rwd.css                     響應式斷點與媒體查詢
│   ├── 📂 themes/                   ← 6 種可切換色彩主題
│   │   ├── theme-cute.css              🌸 可愛粉彩（預設）
│   │   ├── theme-candy.css             🍬 糖果繽紛
│   │   ├── theme-ocean.css             🌊 海洋藍
│   │   ├── theme-forest.css            🌳 森林綠
│   │   ├── theme-sunset.css            🌇 夕陽暖橘
│   │   └── theme-night.css             🌙 夜間深色
│   ├── 📂 components/               ← UI 元件樣式
│   │   ├── board.css                   遊戲棋盤與堆疊物件
│   │   ├── buttons.css                 主要 / 次要 / 圖示按鈕
│   │   ├── decorations.css             飄浮裝飾元素
│   │   ├── hud.css                     遊戲中狀態面板
│   │   ├── instructions.css            說明頁分頁面板
│   │   ├── menu.css                    主選單版面
│   │   ├── modal.css                   結算與確認彈窗
│   │   └── settings.css                設定頁控制元件
│   └── 📂 animations/               ← 關鍵影格動畫
│       └── animations.css              共用 @keyframes 定義
│
├── 📂 js/                           ← JavaScript 模組
│   ├── 📄 main.js                   ← 應用進入點與畫面路由
│   ├── 📂 core/                     ← 遊戲邏輯層
│   │   ├── ai-engine.js                AI：Nim-Sum 演算法與難度控制
│   │   ├── game-engine.js              核心：回合流程與合法性檢查
│   │   ├── rules.js                    勝負規則定義
│   │   └── state-manager.js            存檔 / 讀檔管理
│   ├── 📂 ui/                       ← UI 控制層
│   │   ├── animation-controller.js     動畫排程與效果
│   │   ├── board-renderer.js           棋盤渲染與堆疊互動
│   │   ├── instructions-controller.js  說明頁分頁切換
│   │   ├── menu-controller.js          主選單互動
│   │   ├── modal-controller.js         通用彈窗控制器
│   │   └── settings-controller.js      設定頁控制器
│   ├── 📂 audio/                    ← 音訊系統
│   │   ├── audio-config.js             音符序列、音效頻率、音量倍率（10×）
│   │   └── audio-manager.js            Web Audio 播放、GainNode 控制、壓縮器防護
│   ├── 📂 i18n/                     ← 國際化
│   │   ├── i18n-manager.js             語言切換邏輯、t(key) 翻譯函式
│   │   └── 📂 locales/
│   │       ├── zh-TW.js                繁體中文字典
│   │       ├── en.js                   英文字典
│   │       └── ja.js                   日本語字典
│   └── 📂 utils/                    ← 工具函式
│       ├── dom-utils.js                DOM 查詢與操作輔助
│       └── storage-utils.js            localStorage 安全讀寫封裝
│
├── 📂 assets/                       ← 靜態資源
│   └── 📂 images/
│       └── 📂 mascot/               ← 吉祥物 SVG（尼姆醬）
│
└── 📂 tasks/                        ← 開發筆記
    ├── todo.md                         建置紀錄與驗證記錄
    └── lessons.md                      事後檢討與經驗教訓
```

### 🧩 模組分類

所有模組透過 IIFE 註冊至 `window.NimGame` 全域命名空間：

| 分層 | 模組 | 命名空間 | 職責 |
|:----:|:-----|:---------|:-----|
| 🔵 **Core** | `rules.js` | `NimGame.Rules` | 勝負規則定義（標準版 / 搶輸版） |
| 🔵 | `game-engine.js` | `NimGame.GameEngine` | 回合管理、合法性驗證、堆疊操作 |
| 🔵 | `ai-engine.js` | `NimGame.AIEngine` | Nim-Sum（XOR）計算、依難度選擇走法 |
| 🔵 | `state-manager.js` | `NimGame.StateManager` | 遊戲狀態存檔 / 讀檔至 localStorage |
| 🟢 **UI** | `board-renderer.js` | `NimGame.BoardRenderer` | 棋盤物件渲染、選取與數量互動 |
| 🟢 | `settings-controller.js` | `NimGame.SettingsController` | 主題 / 難度 / 規則 / 外觀 / 音量控制 |
| 🟢 | `modal-controller.js` | `NimGame.ModalController` | 通用可重複使用的彈窗 |
| 🟢 | `menu-controller.js` | `NimGame.MenuController` | 主選單按鈕與繼續遊戲邏輯 |
| 🟢 | `animation-controller.js` | `NimGame.AnimationController` | CSS 動畫排程 |
| 🟢 | `instructions-controller.js` | `NimGame.InstructionsController` | 說明頁分頁控制 |
| 🟡 **Audio** | `audio-config.js` | `NimGame.AudioConfig` | BGM 音符序列、音效頻率常數 |
| 🟡 | `audio-manager.js` | `NimGame.AudioManager` | Web Audio 播放引擎、音量增幅控制 |
| 🟣 **i18n** | `i18n-manager.js` | `NimGame.I18n` | 語言切換、DOM 掃描、`t(key)` 翻譯 |
| 🟣 | `locales/*.js` | `NimGame.locales['xx']` | 扁平化 key-value 翻譯字典 |
| ⚪ **Utils** | `dom-utils.js` | `NimGame.DOM` | `$()`、`$$()`、class 切換輔助 |
| ⚪ | `storage-utils.js` | `NimGame.Storage` | JSON 安全讀寫 localStorage |

### 🔑 重要設計決策

| 決策 | 原因 |
|:-----|:-----|
| **不使用 ES Module** | `file://` 協定下，瀏覽器 CORS 機制會封鎖 `import/export` |
| **IIFE + 全域命名空間** | 不需要建置工具即可實現模組化；所有模組掛載至 `window.NimGame` |
| **使用 Web Audio API（非 `<audio>`）** | `<audio>` 標籤的 `volume` 上限為 1.0；`GainNode` 可設定超過 1.0 以實現 10 倍增幅 |
| **DynamicsCompressorNode** | 防止高增益下的削波失真（爆音），保護使用者聽力 |
| **CSS 自訂屬性** | 透過切換 `data-theme` 屬性即可換色彩主題 — 免重新載入 |
| **`dvh` / `svh` 單位** | 避免行動瀏覽器網址列造成版面遮擋 |
| **localStorage** | 無需後端即可持久化遊戲狀態與設定 |

---

## 🎨 主題與外觀

### 色彩主題

| 主題 | 檔案 | 色彩意象 |
|:-----|:-----|:---------|
| 🌸 **可愛粉彩** *(預設)* | `theme-cute.css` | 粉紅、薰衣草紫、奶油黃 |
| 🍬 **糖果繽紛** | `theme-candy.css` | 馬卡龍色系多彩 |
| 🌊 **海洋藍** | `theme-ocean.css` | 藍、青綠、珊瑚橘 |
| 🌳 **森林綠** | `theme-forest.css` | 綠、棕、米白 |
| 🌇 **夕陽暖橘** | `theme-sunset.css` | 橘、紫紅、金黃 |
| 🌙 **夜間深色** | `theme-night.css` | 深藍、紫黑、螢光點綴 |

### 物件外觀

| 外觀 | CSS Class | 造型 |
|:-----|:----------|:-----|
| 🪨 石頭 | `object-stone` | 圓潤鵝卵石 |
| 🍬 糖果 | `object-candy` | 包裝糖果 |
| ⭐ 星星 | `object-star` | 金色星星 |
| 🐚 貝殼 | `object-shell` | 海洋貝殼 |

---

## 🌐 多國語系

可在**任何畫面的右上角**下拉選單切換語言：

| 代碼 | 語言 | 字典檔 |
|:----:|:-----|:-------|
| `zh-TW` | 繁體中文 | `js/i18n/locales/zh-TW.js` |
| `en` | English | `js/i18n/locales/en.js` |
| `ja` | 日本語 | `js/i18n/locales/ja.js` |

- 語言偏好自動存入 `localStorage`
- 自動偵測瀏覽器語言，偵測不到時預設為 `zh-TW`
- 所有 UI 元素使用 `data-i18n` 屬性進行自動文字替換

---

## ❓ 常見問題

<details>
<summary><b>可以跳過回合嗎？</b></summary>
不行。每回合都必須從一堆拿走至少 1 個物件。
</details>

<details>
<summary><b>怎麼繼續上次進度？</b></summary>
遊戲會自動存檔。在主選單點擊「繼續遊戲」即可載入上次進度。
</details>

<details>
<summary><b>離線可以玩嗎？</b></summary>
可以！所有資源都在本機，完全不需要網路連線。
</details>

<details>
<summary><b>需要安裝什麼嗎？</b></summary>
不需要。只要用瀏覽器開啟 <code>index.html</code> 即可。
</details>

<details>
<summary><b>有可能打贏大師級 AI 嗎？</b></summary>
只有在你先手且初始 Nim-Sum ≠ 0 的情況下才有可能。大師級 AI 使用完美策略 — 若局面對它有利，它必定獲勝。
</details>

---

<div align="center">

### 📄 License

This project is part of the **Games Workshop** collection.

---

Made with ❤️ and a lot of XOR operations

</div>
