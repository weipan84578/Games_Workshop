# ♟️ Nine Men's Morris — The Mill Game

<div align="center">

**🌐 Language / 言語 / 語言**

[🇺🇸 English](#english) ｜ [🇯🇵 日本語](#japanese) ｜ [🇹🇼 繁體中文](#chinese)

---

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6B35?style=flat-square&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![No Build Required](https://img.shields.io/badge/No_Build-Required-00C853?style=flat-square)](.)
[![Multilingual](https://img.shields.io/badge/Languages-EN_|_JA_|_ZH-9C27B0?style=flat-square)](.)

</div>

---

<a id="english"></a>

# 🇺🇸 English

## 📋 Table of Contents

- [🎮 Game Introduction](#en-game-intro)
- [🚀 Quick Start](#en-quick-start)
- [📖 How to Play](#en-how-to-play)
  - [The Board](#en-board)
  - [Phase 1 · Placing](#en-placing)
  - [Phase 2 · Moving](#en-moving)
  - [Phase 3 · Flying](#en-flying)
  - [Forming a Mill](#en-mill)
  - [Removing a Piece](#en-removal)
  - [Win Conditions](#en-win)
- [⚙️ Game Settings](#en-settings)
- [🏗️ Project Architecture](#en-architecture)
  - [File Structure](#en-file-structure)
  - [JavaScript Modules](#en-js-modules)
  - [CSS Architecture](#en-css-structure)
- [🤖 AI System](#en-ai)
- [🎵 Audio System](#en-audio)
- [🌐 i18n System](#en-i18n)
- [💾 Save & Replay System](#en-save)
- [📱 Responsive Design](#en-rwd)

---

<a id="en-game-intro"></a>

## 🎮 Game Introduction

**Nine Men's Morris** (also known as *Mill*, *Nine Man Morris*, or *九子棋*) is one of the oldest strategy board games in history, dating back over 3,000 years. This is a **pure frontend web implementation** — no installation, no server, no build step required. Just open `index.html` in any modern browser and play!

### ✨ Features at a Glance

| Feature | Description |
|---------|-------------|
| 🎯 **Game Mode** | Player vs AI (Easy / Normal / Hard) |
| 🎨 **Themes** | 5 visual themes (Classic · Ocean · Sunset · Forest · Night) |
| 🌐 **Languages** | English · Japanese · Traditional Chinese |
| 🎵 **Audio** | Synthesized BGM & SFX via Web Audio API — zero audio files! |
| 💾 **Auto-Save** | Game state saved after every move via `localStorage` |
| 📼 **Replay** | Save and replay finished games step-by-step |
| ↶ **Undo** | Undo player turns at any time |
| 📱 **Responsive** | Full RWD for desktop, tablet, and mobile |
| ♿ **Accessibility** | ARIA labels, high-contrast themes, shape-coded pieces |

---

<a id="en-quick-start"></a>

## 🚀 Quick Start

```
1. Download or clone this repository
2. Double-click  index.html  — that's it!
```

> ✅ **No npm · No webpack · No local server needed.**
> Supports Chrome, Edge, Firefox, Safari (latest 2 major versions).
> Also supports iOS Safari and Android Chrome.

---

<a id="en-how-to-play"></a>

## 📖 How to Play

<a id="en-board"></a>

### 🎯 The Board

The board consists of **3 concentric squares** connected by lines at their midpoints, creating **24 intersection points (positions)**.

```
 A ─────────── B ─────────── C
 │             │             │
 │  D ──────── E ──────── F  │
 │  │          │          │  │
 │  │  G ───── H ───── I  │  │
 │  │  │                │  │  │
 J  K  L                M  N  O
 │  │  │                │  │  │
 │  │  P ───── Q ───── R  │  │
 │  │          │          │  │
 │  S ──────── T ──────── U  │
 │             │             │
 V ─────────── W ─────────── X
```

| Element | Count | Description |
|---------|-------|-------------|
| 🔴 **Positions** | 24 | Intersections where pieces can be placed |
| 🟡 **Mill lines** | 16 | 12 on square edges + 4 connecting midpoints across all 3 squares |
| ↔️ **Adjacency edges** | 24 | Legal paths for moving pieces |

---

<a id="en-placing"></a>

### 📍 Phase 1 · Placing Phase

| Step | Action |
|------|--------|
| 1️⃣ | Each player starts with **9 pieces** in hand |
| 2️⃣ | Players **alternate** placing 1 piece per turn onto any empty position |
| 3️⃣ | Continue until **all 18 pieces** are placed on the board |
| 4️⃣ | If placing completes a Mill → immediately remove one opponent piece |

---

<a id="en-moving"></a>

### ➡️ Phase 2 · Moving Phase

| Step | Action |
|------|--------|
| 1️⃣ | Players alternate selecting one of their own pieces |
| 2️⃣ | Move the selected piece to an **adjacent empty position** along a legal line |
| 3️⃣ | Diagonal moves or jumping over pieces are **not allowed** |
| 4️⃣ | If the move completes a Mill → immediately remove one opponent piece |

---

<a id="en-flying"></a>

### 🦅 Phase 3 · Flying Phase

> Triggered when a player's total piece count drops to exactly **3**

| Step | Action |
|------|--------|
| 1️⃣ | A player with only 3 pieces may move any piece to **any empty position** |
| 2️⃣ | Adjacency restrictions are lifted — pieces can "fly" anywhere |
| 3️⃣ | The opponent (if still > 3 pieces) continues moving normally |

---

<a id="en-mill"></a>

### ⭐ Forming a Mill

A **Mill** is formed when **3 pieces of the same color** align on one of the 16 predefined lines.

```
✅ Valid Mill:   ● ─── ● ─── ●   (three same-color in a row on a legal line)
❌ Not a Mill:   ● ─── ● ─── ○   (mixed colors)
❌ Not a Mill:   ● ─── ○ ─── ●   (interrupted by opponent or empty)
```

> 💡 **Swinging Mill**: You may move a piece OUT of a Mill and back IN again on a later turn. Each time the Mill is completed, you may remove one opponent piece.

> 💡 **Double Mill**: If one move simultaneously forms two Mills, you still only remove **1** opponent piece (standard international rules).

---

<a id="en-removal"></a>

### ❌ Removing a Piece

When you form a Mill, remove **one opponent piece** following this priority order:

| Priority | Rule |
|----------|------|
| 🥇 **First** | **Must** remove a piece that is **NOT** part of any Mill |
| 🥈 **Second** | Only if ALL opponent pieces are in Mills may you remove any piece freely |

> 🔒 Pieces protected by an active Mill are visually **locked** in the UI to prevent accidental selection.

---

<a id="en-win"></a>

### 🏆 Win Conditions

| Condition | Result |
|-----------|--------|
| Opponent is reduced to **≤ 2 pieces** | You **WIN** 🎉 |
| Opponent has **no legal moves** (Moving Phase, > 3 pieces) | You **WIN** 🎉 |
| You are reduced to **≤ 2 pieces** | AI **WINS** |
| You have **no legal moves** (Moving Phase) | AI **WINS** |

---

<a id="en-settings"></a>

## ⚙️ Game Settings

| Setting | Options | Description |
|---------|---------|-------------|
| 🌐 **Language** | EN / JA / ZH | Switch interface language |
| 🎯 **Difficulty** | Easy / Normal / Hard | AI search depth and error rate |
| 🎨 **Theme** | Classic / Ocean / Sunset / Forest / Night | Board & UI color scheme |
| 🎵 **BGM** | On / Off | Background music toggle |
| 🔊 **SFX** | On / Off | Sound effects toggle |
| 🔉 **Volume** | 0–100% | Master volume for both BGM and SFX |

### 🎨 Theme Descriptions

| Theme | Palette | Mood |
|-------|---------|------|
| 🟤 **Classic** | Warm wood tones | Traditional, warm |
| 🔵 **Ocean** | Blue-green gradients | Cool, calm |
| 🟠 **Sunset** | Orange-red warmth | Energetic, vivid |
| 🟢 **Forest** | Deep greens | Natural, earthy |
| ⚫ **Night** | Dark blue-grey | Low-light, sleek |

---

<a id="en-architecture"></a>

## 🏗️ Project Architecture

<a id="en-file-structure"></a>

### 📁 File Structure

```
The_Mill_Game/
│
├── 📄 index.html                   # Single entry point — no inline business logic
│
├── 🎨 css/
│   ├── base/
│   │   ├── reset.css               # Global reset & box-sizing
│   │   ├── variables.css           # CSS custom properties (colors, spacing, z-index)
│   │   └── typography.css          # Font scale, weight & line-height system
│   │
│   ├── layout/
│   │   ├── app-shell.css           # Outer container & SPA view switching
│   │   ├── responsive.css          # RWD breakpoints (360 / 600 / 1024px)
│   │   └── safe-area.css           # Mobile notch & safe-area insets
│   │
│   ├── components/
│   │   ├── buttons.css             # Primary / secondary / icon button styles
│   │   ├── modal.css               # Confirmation dialog overlay
│   │   ├── toast.css               # Lightweight notification toasts
│   │   ├── board.css               # SVG board lines, pieces, highlights
│   │   ├── hud.css                 # In-game HUD (turn indicator, piece counts)
│   │   └── switch.css              # iOS-style toggle switch component
│   │
│   ├── views/
│   │   ├── main-menu.css           # Main menu page styles
│   │   ├── game.css                # Game screen layout
│   │   ├── howto.css               # How-to / tutorial page styles
│   │   ├── replays.css             # Replay list page styles
│   │   └── settings.css            # Settings page styles
│   │
│   └── themes/
│       ├── theme-classic.css       # 🟤 Classic wooden board (default)
│       ├── theme-ocean.css         # 🔵 Ocean blue-green
│       ├── theme-sunset.css        # 🟠 Warm sunset orange
│       ├── theme-forest.css        # 🟢 Forest green
│       └── theme-night.css         # ⚫ Night dark mode
│
├── ⚙️ js/
│   ├── core/                       # Game logic — pure functions, zero DOM dependency
│   │   ├── constants.js
│   │   ├── game-state.js
│   │   ├── rules-engine.js
│   │   └── move-validator.js
│   │
│   ├── ai/                         # AI strategies (Easy / Normal / Hard)
│   │   ├── ai-easy.js
│   │   ├── ai-normal.js
│   │   ├── ai-hard.js
│   │   ├── ai-evaluator.js
│   │   └── ai-dispatcher.js
│   │
│   ├── audio/                      # Web Audio API synthesizer (zero audio files)
│   │   ├── audio-engine.js
│   │   ├── sfx-synth.js
│   │   └── bgm-synth.js
│   │
│   ├── i18n/                       # Internationalization
│   │   ├── lang-en.js
│   │   ├── lang-ja.js
│   │   ├── lang-zh.js
│   │   └── i18n-manager.js
│   │
│   ├── ui/                         # DOM controllers & renderers
│   │   ├── router.js
│   │   ├── board-renderer.js
│   │   ├── hud-controller.js
│   │   ├── modal-controller.js
│   │   ├── settings-controller.js
│   │   ├── howto-controller.js
│   │   ├── replay-controller.js
│   │   └── theme-manager.js
│   │
│   ├── storage/
│   │   └── save-manager.js
│   │
│   └── main.js                     # App entry point & event binding
│
└── 🖼️ assets/
    └── icons/
        └── icons.js                # Inline SVG icon set (zero external dependency)
```

---

<a id="en-js-modules"></a>

### ⚙️ JavaScript Modules

All modules share a single global namespace `window.NMM` to avoid ES Module CORS issues when opening via the `file://` protocol.

**Script loading order (required):**

```
constants → game-state → rules-engine → move-validator
  → ai-evaluator → ai-easy → ai-normal → ai-hard → ai-dispatcher
    → audio-engine → sfx-synth → bgm-synth
      → lang-zh → lang-en → lang-ja → i18n-manager
        → icons → router → board-renderer → hud-controller
          → modal-controller → theme-manager → settings-controller
            → howto-controller → replay-controller → save-manager
              → main
```

#### 🔩 `js/core/` — Game Engine

| File | Responsibility | Key Export |
|------|---------------|------------|
| `constants.js` | Board coordinates, 24-point adjacency map, 16 mill line definitions | `NMM.Constants` |
| `game-state.js` | Game state object and all mutation helper functions | `NMM.GameState` |
| `rules-engine.js` | Mill detection, legal move generation, win/lose checking | `NMM.Rules` |
| `move-validator.js` | Per-phase move validation for the UI layer | `NMM.MoveValidator` |

**Key functions in `rules-engine.js`:**

| Function | Description |
|----------|-------------|
| `getMillsFor(board, actor)` | Returns all active mills for a given player |
| `isMillAt(board, index, actor)` | Checks if a position is part of any mill |
| `getLegalDestinations(state, actor, from)` | Returns all legal target positions for a piece |
| `getBaseActions(state, actor)` | Returns all executable base actions for current player |
| `getLegalTurnActions(state, actor)` | Returns full action list including removal choices |
| `applyTurnAction(state, action, actor, opts)` | Executes a move and updates the game state |
| `removePending(state, index)` | Completes a pending removal after a mill is formed |
| `checkGameOver(state)` | Evaluates win/lose/draw conditions |

#### 🤖 `js/ai/` — AI Engine

| File | Difficulty | Algorithm |
|------|-----------|-----------|
| `ai-easy.js` | 🐣 Easy | Random selection + basic safety filter |
| `ai-normal.js` | ⚔️ Normal | Minimax search, depth 2–3 |
| `ai-hard.js` | 🔥 Hard | Minimax + Alpha-Beta pruning, depth 5–7 |
| `ai-evaluator.js` | — | Shared board evaluation heuristics |
| `ai-dispatcher.js` | — | Routes to correct AI module, controls think delay |

#### 🎵 `js/audio/` — Audio Engine

| File | Responsibility |
|------|---------------|
| `audio-engine.js` | `AudioContext` init, master GainNode, 5× BGM boost in-game |
| `sfx-synth.js` | Real-time SFX synthesis: place, move, mill, remove, win, lose, click |
| `bgm-synth.js` | Piano-style looping BGM generated via oscillator scheduling |

#### 🌐 `js/i18n/` — Internationalization

| File | Responsibility |
|------|---------------|
| `lang-en.js` | English string table → `window.LANG_EN` |
| `lang-ja.js` | Japanese string table → `window.LANG_JA` |
| `lang-zh.js` | Traditional Chinese string table → `window.LANG_ZH` |
| `i18n-manager.js` | Language switching, DOM text injection via `data-i18n`, persistence |

#### 🖥️ `js/ui/` — UI Controllers

| File | Responsibility |
|------|---------------|
| `router.js` | SPA-style view switching — no page reload |
| `board-renderer.js` | SVG board & piece rendering, highlight, drop animations |
| `hud-controller.js` | Turn status text, piece count display, removal-pending state |
| `modal-controller.js` | Confirmation dialog open/close and content assembly |
| `settings-controller.js` | Settings page interactions (theme, language, volume, difficulty) |
| `howto-controller.js` | How-to page tab navigation |
| `replay-controller.js` | Replay playback controls (play / pause / step / jump) |
| `theme-manager.js` | CSS theme class switching on `<body>` |

#### 💾 `js/storage/`

| File | Responsibility |
|------|---------------|
| `save-manager.js` | `localStorage` read/write: game state, user settings, replay data (max 10) |

---

<a id="en-css-structure"></a>

### 🎨 CSS Architecture

CSS loading order is strict — later files override earlier ones:

```
reset  →  variables  →  typography
  →  layout (app-shell, safe-area, responsive)
    →  components (buttons, modal, toast, board, hud, switch)
      →  views (main-menu, game, howto, replays, settings)
        →  themes (classic, ocean, sunset, forest, night)
```

**Theme switching:** Each theme file **only overrides CSS custom properties** (`--color-*`, `--board-*`, etc.). No component CSS changes are needed when switching themes — simply toggling the `theme-*` class on `<body>` updates the entire UI.

```css
/* Example: theme-classic.css */
.theme-classic {
  --color-bg-primary:    #f5e6c8;
  --color-text-primary:  #3a2a1a;
  --color-accent:        #b8682f;
  --color-board-bg:      #d9bf8c;
  --color-board-line:    #5a4226;
  --color-piece-player:  #fffaf0;
  --color-piece-ai:      #2b2118;
  --color-mill-glow:     #ffd700;
  /* ... and more */
}
```

---

<a id="en-ai"></a>

## 🤖 AI System

| Difficulty | Algorithm | Think Delay | Character |
|------------|-----------|-------------|-----------|
| 🐣 **Easy** | Random + safety check | ~300 ms | Makes mistakes, good for beginners |
| ⚔️ **Normal** | Minimax (depth 2–3) | ~600 ms | Sound strategy, occasional errors |
| 🔥 **Hard** | Minimax + Alpha-Beta pruning (depth 5–7) | ~900 ms | Strong play, counters swinging mills |

### Board Evaluation Heuristics (Normal & Hard)

| Factor | Description |
|--------|-------------|
| ⭐ Mill count | Number of active mills formed |
| 🔢 Piece count | Total pieces remaining on board vs opponent |
| 🎯 Potential threats | Count of 2-in-a-row formations (one away from a mill) |
| 🚀 Mobility | Number of legal moves available |
| 🛡️ Blocking power | Effectiveness at cutting off opponent's potential mills |

---

<a id="en-audio"></a>

## 🎵 Audio System

**Zero audio files** — all sound is synthesized in real-time using the **Web Audio API** (`OscillatorNode` + `GainNode` + ADSR envelopes).

| Sound Event | Design |
|-------------|--------|
| 🎹 **BGM** | Piano arpeggios, ~110 BPM, 8–16 bar loop, smooth looping |
| 🔵 **Place piece** | High-pitched "ding" (~1400 Hz, 80 ms decay) |
| ➡️ **Move piece** | Short tone with gentle slide |
| ⭐ **Mill formed** | Three-note ascending arpeggio (C6 → E6 → G6) |
| ❌ **Remove piece** | Bright "clang" + micro white-noise burst |
| 🎉 **Win** | Ascending arpeggio + layered bell tones |
| 😔 **Lose** | Gentle descending scale, not harsh |
| 👆 **Button click** | Ultra-short high "tick", low volume |
| 🔀 **Toggle / switch** | Soft mechanical "click" feel |

**Volume routing (4-layer GainNode chain):**

```
Oscillator
  → Scene multiplier GainNode  (×5 during game match)
    → Type GainNode             (individual BGM / SFX level)
      → Master GainNode         (user-set total volume)
        → AudioContext.destination
```

> 🔊 BGM is automatically boosted **5×** when the player enters a game match, then returns to normal on the main menu.

---

<a id="en-i18n"></a>

## 🌐 Internationalization (i18n)

Language packs are plain JS objects loaded via `<script>` tags — **not** `fetch()` — ensuring full compatibility under the `file://` protocol.

```js
// lang-en.js (simplified example)
var LANG_EN = {
  menu_start:        "New Game",
  menu_continue:     "Continue",
  difficulty_easy:   "Easy",
  difficulty_normal: "Normal",
  difficulty_hard:   "Hard",
  phase_placing:     "Placing Phase",
  phase_moving:      "Moving Phase",
  phase_flying:      "Flying Phase",
  // ... 60+ keys total
};
```

DOM elements use a `data-i18n` attribute and are automatically updated on language switch:

```html
<span data-i18n="menu_start">New Game</span>
```

**Supported languages:**

| Code | Language | Global Variable |
|------|----------|-----------------|
| `en` | English | `LANG_EN` |
| `ja` | 日本語 (Japanese) | `LANG_JA` |
| `zh` | 繁體中文 (Traditional Chinese) | `LANG_ZH` |

To switch: **Settings → Language**. Preference is persisted in `localStorage`.

---

<a id="en-save"></a>

## 💾 Save & Replay System

| Feature | localStorage Key | Description |
|---------|-----------------|-------------|
| 🎮 **Current game** | `nmm_game` | Full state auto-saved after every single move |
| ⚙️ **Settings** | `nmm_settings` | Theme, language, difficulty, audio toggles & volume |
| 📼 **Replays** | `nmm_replays` | Up to 10 saved replays; oldest is overwritten when full |

**Replay controls:**

| Button | Function |
|--------|----------|
| `|‹` | Jump to game opening |
| `‹` | Step back one move |
| ▶ / ⏸ | Auto-play / pause (900 ms per step) |
| `›` | Step forward one move |
| `›|` | Jump to game end |

---

<a id="en-rwd"></a>

## 📱 Responsive Design (RWD)

| Device | Breakpoint | Board Layout |
|--------|-----------|--------------|
| 📱 Extra-small phone | < 360 px | Full-width board, HUD shrinks to 44 px |
| 📱 Phone portrait | 360–599 px | Board centered & maximized, player info above/below |
| 📱 Phone landscape / tablet | 600–1023 px | Board slightly smaller, player cards side-by-side |
| 🖥️ Desktop | ≥ 1024 px | 3-column layout (Player card | Board | Move log) |
| 📱 Short landscape (height < 480 px) | any width | Left-right split layout, ultra-thin HUD strip |

**Board auto-scaling formula (JS computed):**

```
usable = min(
  window.innerWidth  − (horizontal safe margins × 2),
  window.innerHeight − HUD height − info bar height − (vertical safe margins × 2)
)
board size = usable  (locked to aspect-ratio: 1 / 1)
```

This recalculates on `window.resize` and `orientationchange`, ensuring the board is **always fully visible** and **never covered** by any button or HUD element.

---

---

<a id="japanese"></a>

# 🇯🇵 日本語

## 📋 目次

- [🎮 ゲーム紹介](#ja-game-intro)
- [🚀 クイックスタート](#ja-quick-start)
- [📖 遊び方](#ja-how-to-play)
  - [ボードの構造](#ja-board)
  - [第1フェーズ · 配置](#ja-placing)
  - [第2フェーズ · 移動](#ja-moving)
  - [第3フェーズ · フライング](#ja-flying)
  - [ミルの形成](#ja-mill)
  - [石の除去](#ja-removal)
  - [勝利条件](#ja-win)
- [⚙️ ゲーム設定](#ja-settings)
- [🏗️ プロジェクト構成](#ja-architecture)
  - [ファイル構造](#ja-file-structure)
  - [JavaScriptモジュール](#ja-js-modules)
  - [CSSアーキテクチャ](#ja-css-structure)
- [🤖 AIシステム](#ja-ai)
- [🎵 オーディオシステム](#ja-audio)
- [🌐 多言語対応（i18n）](#ja-i18n)
- [💾 セーブ・リプレイシステム](#ja-save)
- [📱 レスポンシブデザイン](#ja-rwd)

---

<a id="ja-game-intro"></a>

## 🎮 ゲーム紹介

**ナイン・メンズ・モリス**（Nine Men's Morris、ミルゲーム、九子棋とも呼ばれる）は、3,000年以上の歴史を持つ古典的な戦略ボードゲームです。

このプロジェクトは**完全フロントエンド実装**です。インストール不要、サーバー不要、ビルド不要。`index.html` をブラウザで開くだけでプレイできます！

### ✨ 主な特徴

| 機能 | 説明 |
|------|------|
| 🎯 **ゲームモード** | プレイヤー vs AI（簡単 / 普通 / 難しい） |
| 🎨 **テーマ** | 5種類のビジュアルテーマ（クラシック · 海 · 夕日 · 森 · 夜） |
| 🌐 **言語** | 英語 · 日本語 · 繁体字中国語 |
| 🎵 **オーディオ** | Web Audio APIによるリアルタイム合成 — 音声ファイル不要！ |
| 💾 **自動セーブ** | 1手ごとに `localStorage` へ自動保存 |
| 📼 **リプレイ** | 対局を保存してステップごとに再生 |
| ↶ **やり直し** | いつでもプレイヤーの手を1手戻せる |
| 📱 **レスポンシブ** | デスクトップ · タブレット · スマホ完全対応 |
| ♿ **アクセシビリティ** | ARIAラベル、高コントラストテーマ、形状で区別できる駒 |

---

<a id="ja-quick-start"></a>

## 🚀 クイックスタート

```
1. このリポジトリをダウンロードまたはクローン
2. index.html  をダブルクリック — それだけ！
```

> ✅ **npm も webpack もローカルサーバーも不要。**
> Chrome、Edge、Firefox、Safari（最新2メジャーバージョン）に対応。
> iOS Safari・Android Chrome でも動作します。

---

<a id="ja-how-to-play"></a>

## 📖 遊び方

<a id="ja-board"></a>

### 🎯 ボードの構造

ナイン・メンズ・モリスのボードは **3つの同心正方形** で構成され、各辺の中点を線で繋いだ **24の交差点（ポジション）** があります。

```
 外側 ●────────────●────────────●
      │            │            │
 中間 │   ●─────────●─────────●   │
      │   │         │         │   │
 内側 │   │    ●────●────●    │   │
      │   │    │         │    │   │
      ●───●────●         ●────●───●
      │   │    │         │    │   │
      │   │    ●────●────●    │   │
      │   │         │         │   │
      │   ●─────────●─────────●   │
      │            │            │
      ●────────────●────────────●
```

| 要素 | 数 | 説明 |
|------|-----|------|
| 🔴 **交差点（ポジション）** | 24 | 石を置ける場所 |
| 🟡 **ミルライン** | 16 | 各辺12本 ＋ 中点を繋ぐ4本 |
| ↔️ **隣接エッジ** | 24 | 石が移動できる合法ルート |

---

<a id="ja-placing"></a>

### 📍 第1フェーズ · 配置フェーズ

| ステップ | アクション |
|---------|-----------|
| 1️⃣ | 各プレイヤーは **9個の石** を持ってゲームを開始 |
| 2️⃣ | **交互に** 1手ずつ空いているポジションに石を置く |
| 3️⃣ | **全18個の石** がボードに置かれるまで続ける |
| 4️⃣ | 置いた石がミルを完成させた場合 → 即座に相手の石を1個除去 |

---

<a id="ja-moving"></a>

### ➡️ 第2フェーズ · 移動フェーズ

| ステップ | アクション |
|---------|-----------|
| 1️⃣ | 交互に自分の石を1個選ぶ |
| 2️⃣ | 選んだ石を合法ラインに沿って **隣接する空きポジション** へ移動 |
| 3️⃣ | 斜め移動・石の飛び越えは **禁止** |
| 4️⃣ | 移動後にミルが完成した場合 → 即座に相手の石を1個除去 |

---

<a id="ja-flying"></a>

### 🦅 第3フェーズ · フライングフェーズ

> プレイヤーの石がちょうど **3個** になると発動

| ステップ | アクション |
|---------|-----------|
| 1️⃣ | 石が3個のプレイヤーは **任意の空きポジション** へ移動可能 |
| 2️⃣ | 隣接制限なし — ボード上のどこへでも「飛べる」 |
| 3️⃣ | 相手が4個以上の場合は通常の移動ルールが適用される |

---

<a id="ja-mill"></a>

### ⭐ ミルの形成

**ミル**とは、同色の石が **3個** 一列に並ぶことです（16本の定義済みラインのいずれか）。

```
✅ ミル成立:   ● ─── ● ─── ●   （同色3個が一直線）
❌ ミル不成立: ● ─── ● ─── ○   （色が混在）
❌ ミル不成立: ● ─── ○ ─── ●   （途中に相手の石または空白）
```

> 💡 **スウィンギングミル**：ミルから石を移動させ、後のターンで同じミルを再形成することも有効です。ミルを完成させるたびに1個除去できます。

> 💡 **ダブルミル**：1手で2つのミルが同時に完成しても、除去できるのは **1個** のみです（国際標準ルール）。

---

<a id="ja-removal"></a>

### ❌ 石の除去

ミルを形成したら、以下の優先順位で相手の石を **1個** 除去します：

| 優先度 | ルール |
|--------|--------|
| 🥇 **第1優先** | ミルに含まれていない石を **優先的に** 除去する |
| 🥈 **第2優先** | 相手の石が全てミル内の場合のみ、任意の石を除去可 |

> 🔒 ミルに守られた石はUIで **ロック** 表示され、誤操作を防止します。

---

<a id="ja-win"></a>

### 🏆 勝利条件

| 条件 | 結果 |
|------|------|
| 相手の石が **2個以下** に減った | あなたの **勝利** 🎉 |
| 相手が移動フェーズで **合法的な手を持てない**（3個超） | あなたの **勝利** 🎉 |
| あなたの石が **2個以下** に減った | AIの **勝利** |
| あなたが移動フェーズで **合法的な手を持てない** | AIの **勝利** |

---

<a id="ja-settings"></a>

## ⚙️ ゲーム設定

| 設定 | 選択肢 | 説明 |
|------|--------|------|
| 🌐 **言語** | EN / JA / ZH | インターフェース言語の切替 |
| 🎯 **難易度** | 簡単 / 普通 / 難しい | AIの探索深度と失敗率 |
| 🎨 **テーマ** | クラシック / 海 / 夕日 / 森 / 夜 | ボード＆UI配色スキーム |
| 🎵 **BGM** | ON / OFF | バックグラウンドミュージック |
| 🔊 **効果音** | ON / OFF | ゲームサウンドエフェクト |
| 🔉 **音量** | 0–100% | BGM＆SFXのマスター音量 |

### 🎨 テーマ説明

| テーマ | パレット | 雰囲気 |
|-------|---------|-------|
| 🟤 **クラシック** | ウォームウッドトーン | 伝統的、温かみ |
| 🔵 **海** | ブルー・グリーングラデーション | 涼しい、落ち着き |
| 🟠 **夕日** | オレンジ・レッドウォームトーン | 活気、鮮やか |
| 🟢 **森** | ディープグリーン | 自然、アーシー |
| ⚫ **夜** | ダークブルーグレー | 暗所、スリーク |

---

<a id="ja-architecture"></a>

## 🏗️ プロジェクト構成

<a id="ja-file-structure"></a>

### 📁 ファイル構造

```
The_Mill_Game/
│
├── 📄 index.html                   # 唯一のエントリーポイント（インラインロジックなし）
│
├── 🎨 css/
│   ├── base/
│   │   ├── reset.css               # グローバルリセット＆ボックスサイジング
│   │   ├── variables.css           # CSSカスタムプロパティ（色・間隔・z-index）
│   │   └── typography.css          # フォントスケール・字重・行間システム
│   │
│   ├── layout/
│   │   ├── app-shell.css           # 外部コンテナ＆SPAビュー切替
│   │   ├── responsive.css          # RWDブレークポイント（360/600/1024px）
│   │   └── safe-area.css           # モバイルノッチ＆セーフエリアインセット
│   │
│   ├── components/
│   │   ├── buttons.css             # プライマリ/セカンダリ/アイコンボタン
│   │   ├── modal.css               # 確認ダイアログオーバーレイ
│   │   ├── toast.css               # 軽量通知トースト
│   │   ├── board.css               # SVGボードライン・駒・ハイライト
│   │   ├── hud.css                 # ゲーム内HUD（ターン表示、駒数）
│   │   └── switch.css              # iOSスタイルトグルスイッチ
│   │
│   ├── views/
│   │   ├── main-menu.css           # メインメニューページスタイル
│   │   ├── game.css                # ゲーム画面レイアウト
│   │   ├── howto.css               # 遊び方ページスタイル
│   │   ├── replays.css             # リプレイリストページスタイル
│   │   └── settings.css            # 設定ページスタイル
│   │
│   └── themes/
│       ├── theme-classic.css       # 🟤 クラシック木製ボード（デフォルト）
│       ├── theme-ocean.css         # 🔵 海のブルーグリーン
│       ├── theme-sunset.css        # 🟠 ウォームサンセットオレンジ
│       ├── theme-forest.css        # 🟢 フォレストグリーン
│       └── theme-night.css         # ⚫ ナイトダークモード
│
├── ⚙️ js/
│   ├── core/                       # ゲームロジック（純粋関数、DOM非依存）
│   │   ├── constants.js            # ボード座標・隣接マップ・16ミルライン定義
│   │   ├── game-state.js           # ゲーム状態オブジェクト＆変更ヘルパー
│   │   ├── rules-engine.js         # ミル判定・合法手生成・勝負判定
│   │   └── move-validator.js       # UIレイヤー向けフェーズ別検証
│   │
│   ├── ai/                         # AIアルゴリズム（簡単/普通/難しい）
│   │   ├── ai-easy.js              # ランダム＋基本安全チェック
│   │   ├── ai-normal.js            # Minimax深度2-3
│   │   ├── ai-hard.js              # Minimax＋Alpha-Beta深度5-7
│   │   ├── ai-evaluator.js         # 共有ヒューリスティック評価関数
│   │   └── ai-dispatcher.js        # 難易度別ルーティング・遅延制御
│   │
│   ├── audio/                      # Web Audio APIシンセサイザー（音声ファイル不要）
│   │   ├── audio-engine.js         # AudioContext初期化・マスターゲイン・5倍ブースト
│   │   ├── sfx-synth.js            # リアルタイムSFX合成
│   │   └── bgm-synth.js            # ピアノBGMリアルタイム生成・ループ
│   │
│   ├── i18n/                       # 多言語対応
│   │   ├── lang-en.js              # 英語文字列テーブル → LANG_EN
│   │   ├── lang-ja.js              # 日本語文字列テーブル → LANG_JA
│   │   ├── lang-zh.js              # 繁体字中国語文字列テーブル → LANG_ZH
│   │   └── i18n-manager.js         # 言語切替・DOMテキスト注入・永続化
│   │
│   ├── ui/                         # UIコントローラー＆レンダラー
│   │   ├── router.js               # SPAビュー切替（ページリロードなし）
│   │   ├── board-renderer.js       # SVGボード・駒レンダリング・アニメーション
│   │   ├── hud-controller.js       # ターン状態・駒数・除去待ち状態表示
│   │   ├── modal-controller.js     # 確認ダイアログの開閉と内容組立
│   │   ├── settings-controller.js  # 設定ページインタラクション
│   │   ├── howto-controller.js     # 遊び方ページタブナビゲーション
│   │   ├── replay-controller.js    # リプレイ再生コントロール
│   │   └── theme-manager.js        # CSSテーマクラス切替
│   │
│   ├── storage/
│   │   └── save-manager.js         # localStorageの読み書き管理
│   │
│   └── main.js                     # アプリエントリーポイント＆イベントバインディング
│
└── 🖼️ assets/
    └── icons/
        └── icons.js                # インラインSVGアイコンセット（外部依存なし）
```

---

<a id="ja-js-modules"></a>

### ⚙️ JavaScriptモジュール

全モジュールは `window.NMM` グローバル名前空間を共有します（`file://` プロトコル下でのCORSエラーを回避するため、ES Moduleの `import/export` は使用しません）。

**スクリプト読み込み順序（重要）：**

```
constants → game-state → rules-engine → move-validator
  → ai-evaluator → ai-easy → ai-normal → ai-hard → ai-dispatcher
    → audio-engine → sfx-synth → bgm-synth
      → lang-zh → lang-en → lang-ja → i18n-manager
        → icons → router → board-renderer → hud-controller
          → modal-controller → theme-manager → settings-controller
            → howto-controller → replay-controller → save-manager
              → main
```

#### 🔩 `js/core/` — ゲームエンジン

| ファイル | 役割 | キーエクスポート |
|---------|------|--------------|
| `constants.js` | ボード座標・24点隣接マップ・16ミルライン定義 | `NMM.Constants` |
| `game-state.js` | ゲーム状態オブジェクトと全変更ヘルパー関数 | `NMM.GameState` |
| `rules-engine.js` | ミル判定・合法手生成・勝負チェック | `NMM.Rules` |
| `move-validator.js` | UIレイヤー向けフェーズ別移動検証 | `NMM.MoveValidator` |

**`rules-engine.js` の主要関数：**

| 関数 | 説明 |
|------|------|
| `getMillsFor(board, actor)` | 指定プレイヤーの現在アクティブなミルを全て返す |
| `isMillAt(board, index, actor)` | 指定ポジションがミルの一部かどうかを判定 |
| `getLegalDestinations(state, actor, from)` | 指定の石の全合法移動先を返す |
| `getBaseActions(state, actor)` | 現在プレイヤーの全実行可能基本アクションを返す |
| `getLegalTurnActions(state, actor)` | 除去選択肢を含む完全な合法アクションリストを返す |
| `applyTurnAction(state, action, actor, opts)` | 1手を実行してゲーム状態を更新 |
| `removePending(state, index)` | ミル形成後の保留中除去アクションを完了 |
| `checkGameOver(state)` | 勝ち/負け/引き分け条件を評価 |

#### 🤖 `js/ai/` — AIエンジン

| ファイル | 難易度 | アルゴリズム |
|---------|--------|-----------|
| `ai-easy.js` | 🐣 簡単 | ランダム選択 ＋ 基本安全フィルター |
| `ai-normal.js` | ⚔️ 普通 | Minimaxサーチ、深度2-3 |
| `ai-hard.js` | 🔥 難しい | Minimax ＋ Alpha-Beta枝刈り、深度5-7 |
| `ai-evaluator.js` | — | 共有盤面評価ヒューリスティクス |
| `ai-dispatcher.js` | — | 正しいAIモジュールへのルーティング・遅延制御 |

#### 🎵 `js/audio/` — オーディオエンジン

| ファイル | 役割 |
|---------|------|
| `audio-engine.js` | `AudioContext`初期化・マスターGainNode・対局中5倍BGMブースト |
| `sfx-synth.js` | SFXリアルタイム合成：配置・移動・ミル・除去・勝利・敗北・クリック |
| `bgm-synth.js` | オシレーターでスケジューリングされたピアノBGMループ生成 |

#### 🌐 `js/i18n/` — 多言語対応

| ファイル | 役割 |
|---------|------|
| `lang-en.js` | 英語文字列テーブル → `window.LANG_EN` |
| `lang-ja.js` | 日本語文字列テーブル → `window.LANG_JA` |
| `lang-zh.js` | 繁体字中国語文字列テーブル → `window.LANG_ZH` |
| `i18n-manager.js` | 言語切替・`data-i18n` によるDOMテキスト自動注入・永続化 |

#### 🖥️ `js/ui/` — UIコントローラー

| ファイル | 役割 |
|---------|------|
| `router.js` | SPAスタイルのビュー切替（ページリロードなし） |
| `board-renderer.js` | SVGボード＆駒レンダリング・ハイライト・落下アニメーション |
| `hud-controller.js` | ターン状態テキスト・駒数表示・除去待ち状態 |
| `modal-controller.js` | 確認ダイアログの開閉と内容組立 |
| `settings-controller.js` | 設定ページのインタラクション（テーマ・言語・音量・難易度） |
| `howto-controller.js` | 遊び方ページのタブナビゲーション |
| `replay-controller.js` | リプレイ再生コントロール（再生/一時停止/ステップ/ジャンプ） |
| `theme-manager.js` | `<body>` のCSSテーマクラス切替 |

#### 💾 `js/storage/`

| ファイル | 役割 |
|---------|------|
| `save-manager.js` | `localStorage` の読み書き：ゲーム状態・ユーザー設定・リプレイデータ（最大10件） |

---

<a id="ja-css-structure"></a>

### 🎨 CSSアーキテクチャ

CSS読み込み順序は厳密で意味があります — 後のファイルが前のファイルを上書きします：

```
reset  →  variables  →  typography
  →  layout（app-shell、safe-area、responsive）
    →  components（buttons、modal、toast、board、hud、switch）
      →  views（main-menu、game、howto、replays、settings）
        →  themes（classic、ocean、sunset、forest、night）
```

**テーマ切替の仕組み：** 各テーマファイルは **CSSカスタムプロパティのみをオーバーライド**します。テーマ切替時にコンポーネントCSSの変更は不要 — `<body>` の `theme-*` クラスを切り替えるだけでUI全体が更新されます。

```css
/* 例: theme-classic.css */
.theme-classic {
  --color-bg-primary:    #f5e6c8;
  --color-text-primary:  #3a2a1a;
  --color-accent:        #b8682f;
  --color-board-bg:      #d9bf8c;
  --color-board-line:    #5a4226;
  --color-piece-player:  #fffaf0;
  --color-piece-ai:      #2b2118;
  --color-mill-glow:     #ffd700;
  /* ... その他のプロパティ */
}
```

---

<a id="ja-ai"></a>

## 🤖 AIシステム

| 難易度 | アルゴリズム | 思考遅延 | 特性 |
|--------|-----------|---------|------|
| 🐣 **簡単** | ランダム ＋ 安全チェック | ~300 ms | ミスをする・初心者向け |
| ⚔️ **普通** | Minimax（深度2-3） | ~600 ms | 基本的な戦略・時々ミス |
| 🔥 **難しい** | Minimax ＋ Alpha-Beta枝刈り（深度5-7） | ~900 ms | 強力・スウィンギングミル対策済み |

### 盤面評価ヒューリスティクス（普通・難しい）

| 評価要素 | 説明 |
|---------|------|
| ⭐ ミル数 | 現在アクティブなミルの数 |
| 🔢 駒数 | ボード上の自分と相手の駒の比較 |
| 🎯 潜在的脅威 | 2個が揃っている（ミルまで1手）の数 |
| 🚀 機動力 | 実行可能な合法手の数 |
| 🛡️ ブロッキング力 | 相手の潜在的ミルを阻止する有効性 |

---

<a id="ja-audio"></a>

## 🎵 オーディオシステム

**音声ファイルなし** — 全ての音は **Web Audio API** を使用してリアルタイムで合成されます（`OscillatorNode` ＋ `GainNode` ＋ ADSRエンベロープ）。

| サウンドイベント | 設計 |
|--------------|------|
| 🎹 **BGM** | ピアノアルペジオ、約110 BPM、8-16小節ループ |
| 🔵 **石の配置** | 高音「ディン」（~1400 Hz、80 ms減衰） |
| ➡️ **石の移動** | 短いトーンスライド |
| ⭐ **ミル形成** | 上行3音アルペジオ（C6 → E6 → G6） |
| ❌ **石の除去** | 明るい「クラン」＋微量ホワイトノイズ |
| 🎉 **勝利** | 上行アルペジオ ＋ ベル音のレイヤー |
| 😔 **敗北** | 穏やかな下行スケール |
| 👆 **ボタンクリック** | 超短い高音「ティック」、低音量 |
| 🔀 **トグル切替** | ソフトな機械的「クリック」感 |

**音量ルーティング（4層GainNodeチェーン）：**

```
Oscillator
  → シーン乗算器 GainNode  （対局中 ×5）
    → タイプ別 GainNode     （BGM / SFX 個別レベル）
      → マスター GainNode   （ユーザー設定の総音量）
        → AudioContext.destination
```

> 🔊 ゲームマッチ開始時にBGMが自動的に **5倍** にブーストされ、メインメニューでは通常に戻ります。

---

<a id="ja-i18n"></a>

## 🌐 多言語対応（i18n）

言語パックは `fetch()` を使用せず `<script>` タグでロードされるプレーンJSオブジェクトです — `file://` プロトコル下での完全な互換性を確保します。

```js
// lang-ja.js（簡略例）
var LANG_JA = {
  menu_start:        "新しいゲーム",
  menu_continue:     "続きから",
  difficulty_easy:   "簡単",
  difficulty_normal: "普通",
  difficulty_hard:   "難しい",
  phase_placing:     "配置フェーズ",
  phase_moving:      "移動フェーズ",
  phase_flying:      "フライングフェーズ",
  // ... 60以上のキー
};
```

DOM要素は `data-i18n` 属性を使用し、言語切替時に自動更新されます：

```html
<span data-i18n="menu_start">新しいゲーム</span>
```

**対応言語：**

| コード | 言語 | グローバル変数 |
|-------|------|-------------|
| `en` | English | `LANG_EN` |
| `ja` | 日本語 (Japanese) | `LANG_JA` |
| `zh` | 繁體中文 (Traditional Chinese) | `LANG_ZH` |

切替方法：**設定 → 言語**。設定は `localStorage` に保存されます。

---

<a id="ja-save"></a>

## 💾 セーブ・リプレイシステム

| 機能 | localStorageキー | 説明 |
|------|----------------|------|
| 🎮 **現在のゲーム** | `nmm_game` | 1手ごとに完全な状態を自動保存 |
| ⚙️ **設定** | `nmm_settings` | テーマ・言語・難易度・オーディオ設定 |
| 📼 **リプレイ** | `nmm_replays` | 最大10件保存・満杯時は最古を上書き |

**リプレイコントロール：**

| ボタン | 機能 |
|-------|------|
| `\|‹` | 開局にジャンプ |
| `‹` | 1手前に戻る |
| ▶ / ⏸ | 自動再生 / 一時停止（1手ごとに900 ms） |
| `›` | 1手進む |
| `›\|` | 対局終了にジャンプ |

---

<a id="ja-rwd"></a>

## 📱 レスポンシブデザイン

| デバイス | ブレークポイント | ボードレイアウト |
|---------|------------|--------------|
| 📱 超小型スマホ | < 360 px | 全幅ボード、HUD縮小44px |
| 📱 スマホ縦向き | 360–599 px | ボード中央最大化、プレイヤー情報を上下配置 |
| 📱 スマホ横向き/タブレット | 600–1023 px | ボード若干縮小、プレイヤーカード左右並び |
| 🖥️ デスクトップ | ≥ 1024 px | 3カラムレイアウト（プレイヤーカード \| ボード \| 手順ログ） |
| 📱 低いランドスケープ（高さ < 480 px） | 任意の幅 | 左右分割レイアウト、超薄HUDストリップ |

**ボード自動スケーリング式（JS計算）：**

```
usable = min(
  window.innerWidth  − (水平セーフマージン × 2),
  window.innerHeight − HUD高さ − 情報バー高さ − (垂直セーフマージン × 2)
)
ボードサイズ = usable  (aspect-ratio: 1 / 1 に固定)
```

`window.resize` と `orientationchange` イベント時に再計算され、どのデバイスでもボードは **常に完全に表示** され、ボタンやHUDに **決して隠れません**。

---

---

<a id="chinese"></a>

# 🇹🇼 繁體中文

## 📋 目錄

- [🎮 遊戲介紹](#zh-game-intro)
- [🚀 快速開始](#zh-quick-start)
- [📖 遊戲玩法](#zh-how-to-play)
  - [棋盤介紹](#zh-board)
  - [第一階段 · 擺子](#zh-placing)
  - [第二階段 · 移動](#zh-moving)
  - [第三階段 · 飛行](#zh-flying)
  - [形成三連線（Mill）](#zh-mill)
  - [吃子規則](#zh-removal)
  - [勝負判定](#zh-win)
- [⚙️ 遊戲設定](#zh-settings)
- [🏗️ 程式架構](#zh-architecture)
  - [檔案結構](#zh-file-structure)
  - [JavaScript 模組](#zh-js-modules)
  - [CSS 架構](#zh-css-structure)
- [🤖 AI 系統](#zh-ai)
- [🎵 音效系統](#zh-audio)
- [🌐 多國語系（i18n）](#zh-i18n)
- [💾 存檔與複盤系統](#zh-save)
- [📱 RWD 響應式設計](#zh-rwd)

---

<a id="zh-game-intro"></a>

## 🎮 遊戲介紹

**九子棋**（Nine Men's Morris，又稱磨坊棋 / Mill Game）是一款有超過 3,000 年歷史的古典策略棋盤遊戲，起源可追溯至埃及古文明。

本專案為**純前端網頁實作**。免安裝、免伺服器、免 Build。直接用瀏覽器開啟 `index.html` 即可遊玩！

### ✨ 功能特色一覽

| 功能 | 說明 |
|------|------|
| 🎯 **遊戲模式** | 玩家 vs AI（簡單 / 普通 / 困難） |
| 🎨 **視覺主題** | 5 套配色（經典木紋 · 海洋藍 · 夕陽橘 · 森林綠 · 夜間深色） |
| 🌐 **語言** | 繁體中文 · 英文 · 日文 |
| 🎵 **音效** | Web Audio API 即時合成 BGM ＆ SFX — 無需任何音訊檔案！ |
| 💾 **自動存檔** | 每一手棋後自動儲存至 `localStorage` |
| 📼 **複盤** | 儲存對局並逐步重播 |
| ↶ **悔棋** | 可隨時回溯玩家的上一手 |
| 📱 **響應式** | 電腦 · 平板 · 手機全面適配 |
| ♿ **無障礙** | ARIA 標記、高對比主題、形狀區分棋子 |

---

<a id="zh-quick-start"></a>

## 🚀 快速開始

```
1. 下載或 Clone 此專案
2. 雙擊  index.html  — 完成！
```

> ✅ **無需 npm · 無需 webpack · 無需任何本地伺服器。**
> 支援 Chrome、Edge、Firefox、Safari（最新兩個大版本）。
> 支援 iOS Safari 與 Android Chrome。

---

<a id="zh-how-to-play"></a>

## 📖 遊戲玩法

<a id="zh-board"></a>

### 🎯 棋盤介紹

九子棋棋盤由 **3 個同心正方形** 組成，每個正方形的四邊中點與相鄰正方形以直線相連，共形成 **24 個交叉點（point）**。

```
 ●────────────●────────────●   ← 外環
 │            │            │
 │   ●─────────●─────────●   │  ← 中環
 │   │         │         │   │
 │   │    ●────●────●    │   │  ← 內環
 │   │    │         │    │   │
 ●───●────●         ●────●───●  ← 中間橫線
 │   │    │         │    │   │
 │   │    ●────●────●    │   │
 │   │         │         │   │
 │   ●─────────●─────────●   │
 │            │            │
 ●────────────●────────────●
```

| 要素 | 數量 | 說明 |
|------|------|------|
| 🔴 **交叉點** | 24 個 | 棋子可放置的位置 |
| 🟡 **三連線** | 16 條 | 各邊 12 條 ＋ 貫穿三環中點的 4 條 |
| ↔️ **相鄰邊** | 24 條 | 移動時可走的合法路徑 |

---

<a id="zh-placing"></a>

### 📍 第一階段 · 擺子階段（Placing Phase）

| 步驟 | 說明 |
|------|------|
| 1️⃣ | 雙方各持 **9 顆棋子**，從手中開始擺放 |
| 2️⃣ | **輪流**將 1 顆棋子放置於任意空位 |
| 3️⃣ | 持續至 **18 顆棋子全部下完** 為止 |
| 4️⃣ | 放子後若形成三連線 → 立即從對方棋子中移除 1 顆 |

---

<a id="zh-moving"></a>

### ➡️ 第二階段 · 移動階段（Moving Phase）

| 步驟 | 說明 |
|------|------|
| 1️⃣ | 輪流選擇己方一顆棋子 |
| 2️⃣ | 沿合法連線移動到 **直接相鄰的空位** |
| 3️⃣ | **不可斜走**、**不可跳過其他棋子** |
| 4️⃣ | 移動後若形成三連線 → 立即移除對方 1 顆棋子 |

---

<a id="zh-flying"></a>

### 🦅 第三階段 · 飛行階段（Flying Phase）

> 當某方棋子被吃到剩下恰好 **3 顆** 時觸發

| 步驟 | 說明 |
|------|------|
| 1️⃣ | 剩 3 顆的那方可將任一棋子移到 **棋盤上任意空位** |
| 2️⃣ | 不受相鄰限制，俗稱「飛子」 |
| 3️⃣ | 對方若仍有 4 顆以上，仍依一般移動規則行動 |

---

<a id="zh-mill"></a>

### ⭐ 形成三連線（Mill）

**三連線（Mill / 磨坊）** 是指同色 **3 顆棋子** 在棋盤上 16 條預定義連線之一中排成一排。

```
✅ 成立三連線:   ● ─── ● ─── ●   （同色三子成一線）
❌ 不成立:       ● ─── ● ─── ○   （顏色不同）
❌ 不成立:       ● ─── ○ ─── ●   （中間有空格或異色棋子）
```

> 💡 **搖擺磨坊（Swinging Mill）**：允許將棋子移出三連線後再移回，重新形成同一條三連線。每次完成都可再吃一顆對方棋子（國際標準規則允許此行為）。

> 💡 **雙磨坊（Double Mill）**：一次移動同時形成兩條三連線，仍只能吃 **1 顆** 對方棋子（國際標準規則）。

---

<a id="zh-removal"></a>

### ❌ 吃子規則（Removal）

形成三連線後，依以下優先順序移除對方 **1 顆** 棋子：

| 優先順序 | 規則 |
|---------|------|
| 🥇 **第一優先** | **必須** 移除對方「未處於任何三連線中」的棋子 |
| 🥈 **第二優先** | 若對方所有棋子都在三連線中，才可移除三連線內的棋子 |

> 🔒 受三連線保護的棋子在 UI 上會以「鎖定」樣式標示，防止誤觸。

---

<a id="zh-win"></a>

### 🏆 勝負判定

| 觸發條件 | 結果 |
|---------|------|
| 對方棋子數量被吃到 **≤ 2 顆** | 你 **獲勝** 🎉 |
| 對方在移動階段（棋子 > 3 顆）**無任何合法走法** | 你 **獲勝** 🎉 |
| 你的棋子數量被吃到 **≤ 2 顆** | AI **獲勝** |
| 你在移動階段**無任何合法走法** | AI **獲勝** |

---

<a id="zh-settings"></a>

## ⚙️ 遊戲設定

| 設定項目 | 選項 | 說明 |
|---------|------|------|
| 🌐 **語言** | EN / JA / ZH | 切換介面文字語言 |
| 🎯 **難度** | 簡單 / 普通 / 困難 | 影響 AI 搜尋深度與失誤率 |
| 🎨 **主題** | 經典 / 海洋 / 夕陽 / 森林 / 夜間 | 棋盤與介面配色方案 |
| 🎵 **背景音樂** | 開 / 關 | 即時合成鋼琴 BGM |
| 🔊 **音效** | 開 / 關 | 落子、吃子、勝負等音效 |
| 🔉 **音量** | 0–100% | 同時控制音樂與音效 |

### 🎨 主題說明

| 主題 | 色調 | 風格 |
|------|------|------|
| 🟤 **經典木紋** | 暖棕木質色 | 傳統、溫暖 |
| 🔵 **海洋藍** | 藍綠漸層 | 清涼、沉穩 |
| 🟠 **夕陽橘** | 橘紅暖色 | 活力、鮮豔 |
| 🟢 **森林綠** | 深綠系 | 自然、大地感 |
| ⚫ **夜間深色** | 深藍灰暗色 | 低光、簡約 |

---

<a id="zh-architecture"></a>

## 🏗️ 程式架構

<a id="zh-file-structure"></a>

### 📁 檔案結構

```
The_Mill_Game/
│
├── 📄 index.html                   # 唯一進入點，只負責引入 CSS/JS，不寫商業邏輯
│
├── 🎨 css/
│   ├── base/
│   │   ├── reset.css               # 全域 reset、box-sizing 基礎
│   │   ├── variables.css           # CSS 自訂屬性（顏色主題、間距、z-index）
│   │   └── typography.css          # 字體階層、字重、行高系統
│   │
│   ├── layout/
│   │   ├── app-shell.css           # 外層容器與畫面切換排版
│   │   ├── responsive.css          # RWD 斷點（360 / 600 / 1024px）
│   │   └── safe-area.css           # 行動裝置安全區域 / 瀏海區處理
│   │
│   ├── components/
│   │   ├── buttons.css             # 主按鈕、次按鈕、圖示按鈕樣式
│   │   ├── modal.css               # 彈窗對話框樣式
│   │   ├── toast.css               # 輕提示通知樣式
│   │   ├── board.css               # SVG 棋盤線條、棋子、高亮樣式
│   │   ├── hud.css                 # 遊戲 HUD（回合提示、棋子數量）
│   │   └── switch.css              # iOS 風格開關元件
│   │
│   ├── views/
│   │   ├── main-menu.css           # 主畫面專屬樣式
│   │   ├── game.css                # 遊戲對局畫面排版
│   │   ├── howto.css               # 說明頁樣式
│   │   ├── replays.css             # 複盤列表頁樣式
│   │   └── settings.css            # 設定頁樣式
│   │
│   └── themes/
│       ├── theme-classic.css       # 🟤 經典木紋棋盤（預設）
│       ├── theme-ocean.css         # 🔵 海洋藍綠
│       ├── theme-sunset.css        # 🟠 夕陽暖橘
│       ├── theme-forest.css        # 🟢 森林綠
│       └── theme-night.css         # ⚫ 夜間深色（暗色模式）
│
├── ⚙️ js/
│   ├── core/                       # 核心遊戲邏輯（純函式，無 DOM 依賴）
│   │   ├── constants.js            # 棋盤 24 點位座標、相鄰關係、16 條三連線定義
│   │   ├── game-state.js           # 遊戲狀態物件與所有狀態變更函式
│   │   ├── rules-engine.js         # 三連線判斷、合法走法生成、勝負檢查
│   │   └── move-validator.js       # 各階段走法驗證（擺子/移動/飛行/吃子）
│   │
│   ├── ai/                         # AI 策略（簡單/普通/困難）
│   │   ├── ai-easy.js              # 隨機走法 ＋ 基礎安全檢查
│   │   ├── ai-normal.js            # Minimax 搜尋（深度 2–3）
│   │   ├── ai-hard.js              # Minimax ＋ Alpha-Beta 修剪（深度 5–7）
│   │   ├── ai-evaluator.js         # 普通/困難 共用的盤面評估函式
│   │   └── ai-dispatcher.js        # 依難度分派 AI、控制思考延遲時間
│   │
│   ├── audio/                      # Web Audio API 即時合成（零音訊檔案）
│   │   ├── audio-engine.js         # AudioContext 初始化、主音量、對局 5 倍增益
│   │   ├── sfx-synth.js            # 即時合成音效：落子、移動、三連線、吃子、勝敗、按鈕
│   │   └── bgm-synth.js            # 即時生成鋼琴風格 BGM，迴圈播放
│   │
│   ├── i18n/                       # 多國語系管理
│   │   ├── lang-zh.js              # 繁體中文字串表 → LANG_ZH
│   │   ├── lang-en.js              # 英文字串表 → LANG_EN
│   │   ├── lang-ja.js              # 日文字串表 → LANG_JA
│   │   └── i18n-manager.js         # 語言切換、DOM 文字自動注入、語言偏好持久化
│   │
│   ├── ui/                         # DOM 控制器與渲染器
│   │   ├── router.js               # SPA 式畫面切換（不換頁、不重新載入）
│   │   ├── board-renderer.js       # SVG 棋盤與棋子渲染、高亮、動畫效果
│   │   ├── hud-controller.js       # 回合提示文字、棋子數量、吃子待確認狀態
│   │   ├── modal-controller.js     # 彈窗開關與內容組裝
│   │   ├── settings-controller.js  # 設定頁互動邏輯（主題、語言、音量、難度）
│   │   ├── howto-controller.js     # 說明頁分頁導覽邏輯
│   │   ├── replay-controller.js    # 複盤播放控制（播放/暫停/上一步/下一步）
│   │   └── theme-manager.js        # CSS 主題 class 切換
│   │
│   ├── storage/
│   │   └── save-manager.js         # localStorage 讀寫：遊戲存檔、使用者設定、複盤資料（最多 10 份）
│   │
│   └── main.js                     # 應用程式進入點與事件綁定
│
└── 🖼️ assets/
    └── icons/
        └── icons.js                # 以 JS 字串內嵌的 SVG 圖示集（零外部依賴）
```

---

<a id="zh-js-modules"></a>

### ⚙️ JavaScript 模組說明

所有模組共用 `window.NMM` 全域命名空間，確保在 `file://` 協定下不會出現 CORS 問題（不使用 `import/export` ES Module 語法）。

**腳本載入順序（重要）：**

```
constants → game-state → rules-engine → move-validator
  → ai-evaluator → ai-easy → ai-normal → ai-hard → ai-dispatcher
    → audio-engine → sfx-synth → bgm-synth
      → lang-zh → lang-en → lang-ja → i18n-manager
        → icons → router → board-renderer → hud-controller
          → modal-controller → theme-manager → settings-controller
            → howto-controller → replay-controller → save-manager
              → main
```

#### 🔩 `js/core/` — 遊戲引擎

| 檔案 | 職責 | 關鍵輸出 |
|------|------|---------|
| `constants.js` | 棋盤 24 點位座標、相鄰關係圖、16 條三連線定義 | `NMM.Constants` |
| `game-state.js` | 遊戲狀態物件與所有狀態變更函式 | `NMM.GameState` |
| `rules-engine.js` | 三連線判斷、合法走法生成、勝負檢查 | `NMM.Rules` |
| `move-validator.js` | 各階段（擺子/移動/飛行/吃子）走法驗證 | `NMM.MoveValidator` |

**`rules-engine.js` 主要函式：**

| 函式 | 說明 |
|------|------|
| `getMillsFor(board, actor)` | 取得指定玩家當前所有有效三連線 |
| `isMillAt(board, index, actor)` | 判斷某位置是否構成三連線 |
| `getLegalDestinations(state, actor, from)` | 取得指定棋子的所有合法目標位置 |
| `getBaseActions(state, actor)` | 取得當前玩家所有可執行的基本動作 |
| `getLegalTurnActions(state, actor)` | 取得完整合法動作列表（含吃子選項） |
| `applyTurnAction(state, action, actor, opts)` | 執行一手棋並更新遊戲狀態 |
| `removePending(state, index)` | 執行三連線後的待處理吃子動作 |
| `checkGameOver(state)` | 檢查勝/負/和棋條件並設定結果 |

#### 🤖 `js/ai/` — AI 引擎

| 檔案 | 難度 | 演算法 |
|------|------|--------|
| `ai-easy.js` | 🐣 簡單 | 隨機選擇 ＋ 基礎安全過濾 |
| `ai-normal.js` | ⚔️ 普通 | Minimax 搜尋，深度 2–3 |
| `ai-hard.js` | 🔥 困難 | Minimax ＋ Alpha-Beta 修剪，深度 5–7 |
| `ai-evaluator.js` | — | 普通/困難共用盤面評估啟發式函式 |
| `ai-dispatcher.js` | — | 依難度路由至正確 AI 模組，控制思考延遲 |

#### 🎵 `js/audio/` — 音效引擎

| 檔案 | 職責 |
|------|------|
| `audio-engine.js` | `AudioContext` 初始化、主音量 GainNode、對局中 BGM 5 倍增益 |
| `sfx-synth.js` | 即時合成音效：落子、移動、三連線、吃子、勝利、失敗、按鈕點擊 |
| `bgm-synth.js` | 透過 Oscillator 排程生成鋼琴 BGM，迴圈播放 |

#### 🌐 `js/i18n/` — 多國語系

| 檔案 | 職責 |
|------|------|
| `lang-zh.js` | 繁體中文字串表 → `window.LANG_ZH` |
| `lang-en.js` | 英文字串表 → `window.LANG_EN` |
| `lang-ja.js` | 日文字串表 → `window.LANG_JA` |
| `i18n-manager.js` | 語言切換、`data-i18n` DOM 文字自動注入、語言偏好持久化 |

#### 🖥️ `js/ui/` — UI 控制器

| 檔案 | 職責 |
|------|------|
| `router.js` | SPA 式畫面切換 — 不換頁、不重新載入 |
| `board-renderer.js` | SVG 棋盤與棋子渲染、高亮、落子動畫效果 |
| `hud-controller.js` | 回合提示文字、棋子數量顯示、吃子待確認狀態 |
| `modal-controller.js` | 確認彈窗的開關與內容組裝 |
| `settings-controller.js` | 設定頁互動邏輯（主題、語言、音量、難度） |
| `howto-controller.js` | 說明頁分頁導覽邏輯 |
| `replay-controller.js` | 複盤播放控制（播放/暫停/逐步/跳轉） |
| `theme-manager.js` | 在 `<body>` 上切換 CSS 主題 class |

#### 💾 `js/storage/`

| 檔案 | 職責 |
|------|------|
| `save-manager.js` | `localStorage` 讀寫：遊戲狀態、使用者設定、複盤資料（最多 10 份） |

---

<a id="zh-css-structure"></a>

### 🎨 CSS 架構說明

CSS 的載入順序有嚴格規定，後面的檔案可覆蓋前面的設定：

```
reset（重置）
  → variables（CSS 變數定義）
    → typography（字體系統）
      → layout（版型：app-shell、safe-area、responsive）
        → components（元件：buttons、modal、toast、board、hud、switch）
          → views（各畫面：main-menu、game、howto、replays、settings）
            → themes（主題配色：僅覆蓋 CSS 變數即可整站換色）
```

**主題切換機制：** 每套主題僅覆蓋 CSS 自訂屬性（`--color-*` 等），元件樣式本身不需修改，只需在 `<body>` 切換 `theme-*` class 即可整站同步換色。

```css
/* 範例：theme-classic.css */
.theme-classic {
  --color-bg-primary:      #f5e6c8;  /* 主背景 */
  --color-text-primary:    #3a2a1a;  /* 主文字 */
  --color-accent:          #b8682f;  /* 強調色（按鈕、高亮） */
  --color-board-bg:        #d9bf8c;  /* 棋盤底色 */
  --color-board-line:      #5a4226;  /* 棋盤線條 */
  --color-piece-player:    #fffaf0;  /* 玩家棋子主色 */
  --color-piece-ai:        #2b2118;  /* AI 棋子主色 */
  --color-mill-glow:       #ffd700;  /* 三連線金色光暈 */
  /* ... 更多屬性 */
}
```

---

<a id="zh-ai"></a>

## 🤖 AI 系統

| 難度 | 演算法 | 思考延遲 | 特性 |
|------|--------|---------|------|
| 🐣 **簡單** | 隨機 ＋ 安全檢查 | ~300 ms | 會犯錯、適合新手入門 |
| ⚔️ **普通** | Minimax（深度 2–3） | ~600 ms | 有策略性、偶爾失誤 |
| 🔥 **困難** | Minimax ＋ Alpha-Beta 修剪（深度 5–7） | ~900 ms | 強力走法、會對抗搖擺磨坊戰術 |

### 盤面評估啟發式函式（普通 & 困難）

| 評估項目 | 說明 |
|---------|------|
| ⭐ 三連線數量 | 目前已形成的磨坊數量 |
| 🔢 盤面棋子數 | 雙方棋子總數的對比 |
| 🎯 潛在威脅 | 兩子成線（距離三連線只差一步）的數量 |
| 🚀 行動力 | 可執行的合法走法數量 |
| 🛡️ 阻擋能力 | 封鎖對方潛在三連線的有效程度 |

---

<a id="zh-audio"></a>

## 🎵 音效系統

**零音訊檔案** — 所有聲音皆透過 **Web Audio API** 即時合成（使用 `OscillatorNode` ＋ `GainNode` ＋ ADSR Envelope 技術）。

| 音效事件 | 音效設計 |
|---------|---------|
| 🎹 **BGM** | 鋼琴琶音風格，約 110 BPM，8–16 小節平滑迴圈 |
| 🔵 **落子** | 高音域（~1400 Hz）短促「叮」聲，80 ms 衰減 |
| ➡️ **移動** | 短促音調滑音 |
| ⭐ **三連線** | 上行三音琶音（C6 → E6 → G6），清亮愉快 |
| ❌ **吃子** | 清脆「噹」聲 ＋ 極短白噪音點綴 |
| 🎉 **勝利** | 上行琶音 ＋ 鈴聲疊加 |
| 😔 **失敗** | 下行音階，輕柔不刺耳 |
| 👆 **按鈕點擊** | 極短高音「滴」，避免聽覺疲勞 |
| 🔀 **開關切換** | 細微高音「咔」聲，模擬實體開關觸感 |

**音量架構（四層串接 GainNode）：**

```
Oscillator（音源）
  → 場景倍率 GainNode  （對局中 ×5 倍）
    → 類型音量 GainNode  （BGM / SFX 個別調整）
      → 主音量 GainNode   （使用者設定的總音量）
        → AudioContext.destination（最終輸出）
```

> 🔊 BGM 在進入遊戲對局時自動提升至 **5 倍**，回到主畫面後恢復正常音量。

---

<a id="zh-i18n"></a>

## 🌐 多國語系（i18n）

語言包以純 JS 物件方式載入（透過 `<script>` 標籤），確保在 `file://` 協定下也能正常運作（不使用 `fetch` 或 `XHR`）。

```js
// lang-zh.js 範例（簡化）
var LANG_ZH = {
  menu_start:        "新遊戲",
  menu_continue:     "繼續遊戲",
  difficulty_easy:   "簡單",
  difficulty_normal: "普通",
  difficulty_hard:   "困難",
  phase_placing:     "擺子階段",
  phase_moving:      "移動階段",
  phase_flying:      "飛行階段",
  // ... 共 60+ 個 key
};
```

DOM 元素透過 `data-i18n` 屬性標記，語言切換時自動更新：

```html
<span data-i18n="menu_start">新遊戲</span>
```

**支援語言：**

| 語言代碼 | 語言 | 全域變數 |
|---------|------|---------|
| `zh` | 繁體中文 | `LANG_ZH` |
| `en` | English | `LANG_EN` |
| `ja` | 日本語 | `LANG_JA` |

切換語言：**設定 → 語言**，偏好設定自動儲存至 `localStorage`。

---

<a id="zh-save"></a>

## 💾 存檔與複盤系統

| 功能 | localStorage Key | 說明 |
|------|-----------------|------|
| 🎮 **遊戲存檔** | `nmm_game` | 每一手棋後自動儲存完整狀態 |
| ⚙️ **使用者設定** | `nmm_settings` | 主題、語言、難度、音效偏好 |
| 📼 **複盤資料** | `nmm_replays` | 最多 10 份，超過時自動覆蓋最舊的 |

**複盤控制按鈕：**

| 按鈕 | 功能 |
|------|------|
| `\|‹` | 回到開局（第 0 步） |
| `‹` | 上一步 |
| ▶ / ⏸ | 自動播放 / 暫停（每步間隔 900 ms） |
| `›` | 下一步 |
| `›\|` | 跳到結局（最後一步） |

---

<a id="zh-rwd"></a>

## 📱 RWD 響應式設計

| 裝置類型 | 斷點 | 棋盤佈局 |
|---------|------|---------|
| 📱 超小手機 | < 360 px | 棋盤滿版顯示，HUD 高度縮減至 44 px |
| 📱 一般手機（直向） | 360–599 px | 棋盤置中最大化，資訊列分別在上下方 |
| 📱 手機橫向 / 平板 | 600–1023 px | 棋盤略縮、玩家 / AI 資訊卡左右並排 |
| 🖥️ 桌面 | ≥ 1024 px | 完整三欄佈局（玩家卡 \| 棋盤 \| 走法紀錄） |
| 📱 矮螢幕橫向 | 高度 < 480 px（不限寬度） | 強制改為左右分欄，HUD 縮為極窄條 |

**棋盤自適應縮放公式（JS 計算）：**

```
可用邊長 = min(
  視窗寬度 − 左右安全邊距 × 2,
  視窗高度 − 頂部 HUD 高度 − 底部資訊區高度 − 上下安全邊距 × 2
)
棋盤尺寸 = 可用邊長（保持 aspect-ratio: 1 / 1 正方形）
```

此計算於 `window.resize` 與 `orientationchange` 事件時重新觸發，確保手機旋轉或視窗縮放時棋盤即時適配，永遠**完整可見**、絕不被任何按鈕或 HUD **遮擋**。

---

<div align="center">

---

Made with ❤️ · Pure HTML / CSS / Vanilla JS · Zero dependencies · Zero build step

</div>
