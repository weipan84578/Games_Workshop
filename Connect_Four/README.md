<div align="center">

# 🔴🟡 Connect Four 🟡🔴

### 四目並べ ・ 四子棋

<br>

**A premium zero-build browser Connect Four game with AI, procedural audio, and trilingual support.**

**ビルド不要・プロシージャルオーディオ・多言語対応のプレミアムブラウザ版四目並べ。**

**零建構、程序化音效、三語支援的精緻瀏覽器四子棋遊戲。**

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-8B5CF6?style=for-the-badge&logo=webcomponents.org&logoColor=white)
![Zero Build](https://img.shields.io/badge/Zero_Build-22C55E?style=for-the-badge&logo=checkmarx&logoColor=white)
![Offline First](https://img.shields.io/badge/Offline_First-3B82F6?style=for-the-badge&logo=pwa&logoColor=white)

<br>

[English](#-english) ・ [日本語](#-日本語) ・ [中文](#-中文)

</div>

---

<br>

<!-- ╔══════════════════════════════════════════════════════════════╗ -->
<!-- ║                         ENGLISH                            ║ -->
<!-- ╚══════════════════════════════════════════════════════════════╝ -->

<a id="-english"></a>

# 🇬🇧 English

## 📑 Table of Contents

| Section | Description |
|:---|:---|
| [✨ Features at a Glance](#-features-at-a-glance) | Overview of all features |
| [🎮 Game Introduction](#-game-introduction) | What is Connect Four? |
| [📖 How to Play](#-how-to-play) | Rules, controls, and game flow |
| [🚀 Getting Started](#-getting-started) | How to run the game |
| [🏗️ Architecture Overview](#️-architecture-overview) | System design and data flow |
| [📂 Project Structure](#-project-structure) | Complete file tree |
| [🧩 Module Guide](#-module-guide) | Detailed module documentation |
| [🤖 AI System](#-ai-system-in-depth) | AI algorithms and difficulty levels |
| [🎨 Themes](#-themes-en) | 5 color themes |
| [🔊 Audio System](#-audio-system-en) | Procedural audio engine |
| [🌐 Internationalization](#-internationalization-i18n-en) | Trilingual support |
| [♿ Accessibility](#-accessibility) | Accessibility features |
| [📜 License](#-license) | License information |

---

## ✨ Features at a Glance

| 🎯 Feature | 📝 Description |
|:---:|:---|
| 🆚 **Two Game Modes** | Player vs Player (PvP) & Player vs AI (PvE) |
| 🤖 **4 AI Difficulty Levels** | Easy · Normal · Hard · Expert |
| 🌐 **Trilingual Support** | English · 日本語 · 中文 |
| 🎨 **5 Color Themes** | Classic · Ocean · Candy · Night · Forest |
| 🎵 **Procedural Audio** | Piano BGM + SFX generated via Web Audio API — no audio files! |
| ↩️ **Undo Moves** | 1 step (PvP) or 2 steps (PvE) |
| 💾 **Auto-Save** | Game state persists — resume anytime |
| 📊 **Statistics** | Win/loss/draw stats per difficulty |
| 📱 **Fully Responsive** | Mobile portrait/landscape, tablet, desktop |
| ♿ **Accessible** | ARIA attributes, keyboard nav, reduced motion |
| 📳 **Haptic Feedback** | Optional vibration on mobile |
| 🔌 **Zero Build, Offline** | No npm, no bundler, no server required — just open `index.html` |

---

## 🎮 Game Introduction

**Connect Four** is a classic two-player strategy board game. Players take turns dropping colored pieces into a **6-row × 7-column** vertical grid. The first player to connect **four pieces in a row** — horizontally, vertically, or diagonally — wins!

### What Makes This Version Special?

| 💡 Highlight | Details |
|:---|:---|
| 🧠 **Smart AI** | From casual random moves to Expert-level Minimax (depth 8) with α-β pruning |
| 🎹 **Procedural Piano BGM** | 4 original melodies synthesized in real-time using Web Audio oscillators |
| 🎨 **5 Handcrafted Themes** | Each theme has unique board texture, chip colors, and mood |
| 🏆 **Victory Animations** | HTML/CSS-only artwork — confetti 🎉 for wins, rain 🌧️ for losses |
| 🌍 **Auto-detect Language** | Detects your browser language and applies zh-TW / en / ja automatically |
| 📵 **Fully Offline** | Zero network requests — works on `file://` protocol |

---

## 📖 How to Play

### 🎯 Objective

Connect **four** of your pieces in a row — horizontally ↔️, vertically ↕️, or diagonally ↗️↘️ — before your opponent!

### 📋 Game Rules

```
 ┌──────────────────────────────────────────────┐
 │  1. Players take turns dropping one piece     │
 │  2. Pieces fall to the lowest empty row       │
 │  3. Connect 4 in any direction to win!        │
 │  4. Full board with no winner = Draw          │
 └──────────────────────────────────────────────┘
```

### 🏆 Win Conditions — Visual Guide

```
  Horizontal ───        Vertical │       Diagonal ╲       Diagonal ╱
                                 │
 ┌─┬─┬─┬─┬─┬─┬─┐   ┌─┬─┬─┬─┐   ┌─┬─┬─┬─┐     ┌─┬─┬─┬─┐
 │ │ │ │ │ │ │ │   │ │●│ │ │   │●│ │ │ │     │ │ │ │●│
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │●│●│●│●│ │ │   │ │●│ │ │   │ │●│ │ │     │ │ │●│ │
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │ │ │ │ │ │ │   │ │●│ │ │   │ │ │●│ │     │ │●│ │ │
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │ │ │ │ │ │ │   │ │●│ │ │   │ │ │ │●│     │●│ │ │ │
 └─┴─┴─┴─┴─┴─┴─┘   └─┴─┴─┴─┘   └─┴─┴─┴─┘     └─┴─┴─┴─┘
```

### 🕹️ Controls

| Action | How |
|:---:|:---|
| 🖱️ **Drop a piece** | Click / tap the column's ▼ arrow |
| ↩️ **Undo** | Click the Undo button |
| 🔄 **Restart** | Click the Restart button |
| ⏸️ **Pause** | Click Pause for menu overlay |
| 🎵 **Toggle BGM** | Click the music icon |
| 🔊 **Toggle SFX** | Click the sound icon |
| 🚪 **Quit to Menu** | Pause → Home |

### 🧭 Game Flow

```
┌────────────┐     ┌────────────┐     ┌────────────────┐     ┌────────────┐
│    Main    │────▶│   Setup    │────▶│  Select Mode   │────▶│    Game    │
│    Menu    │     │   Screen   │     │ + Difficulty    │     │   Screen   │
└────────────┘     └────────────┘     └────────────────┘     └────────────┘
  │       │                                                    │   │   │
  │       ▼                                                    │   │   │
  │  ┌──────────┐                                              │   │   │
  │  │ Continue │──────── (load saved game) ───────────────────┘   │   │
  │  └──────────┘                                                  │   │
  │       │                                                        │   │
  ▼       ▼                                                        ▼   ▼
┌──────────────┐                                          ┌──────────────┐
│  How to Play │                                          │    Pause     │
└──────────────┘                                          │    Modal     │
       │                                                  └──────────────┘
       ▼                                                    │    │    │
┌──────────────┐                                            │    │    │
│   Settings   │◀───────────────────────────────────────────┘    │    │
└──────────────┘                                                 │    │
                                                          Resume │    │ Home
                                                            ▲    │    ▼
                                                            └────┘  Main Menu
```

---

## 🚀 Getting Started

### Prerequisites

> 🎉 **No build tools, no npm, no server required!**  
> This is a pure HTML/CSS/JS project that runs directly from the filesystem.

| Requirement | Note |
|:---|:---|
| 🌐 Modern browser | Chrome 66+, Firefox 60+, Safari 14+, Edge 79+ |
| 📁 File access | Just double-click `index.html`! |

### Quick Start

```bash
# Option 1: Just open the file directly!
# Double-click index.html in your file explorer ✅

# Option 2: Clone from repository
git clone https://github.com/your-username/Connect_Four.git
cd Connect_Four
# Then open index.html in your browser

# Option 3: Local server (optional, any will work)
python -m http.server 8080       # Python
npx serve .                       # Node.js
# Then visit http://localhost:8080
```

> 💡 **Tip**: Unlike most JS projects, this uses classic `<script>` tags (not ES modules), so it works perfectly on the `file://` protocol — no server needed!

---

## 🏗️ Architecture Overview

### Design Principles

| Principle | Implementation |
|:---|:---|
| 🔌 **Zero Build** | Classic `<script>` tags in dependency order — no bundler |
| 🌐 **Offline First** | No CDN, no fetch, no network — works on `file://` |
| 🏗️ **Modular Namespace** | All modules attach to global `window.CF` namespace |
| 🎵 **No Binary Assets** | Audio generated at runtime via Web Audio API |
| 🛡️ **Graceful Fallback** | In-memory Map if localStorage unavailable |
| 🔒 **XSS Protection** | All dynamic text escaped via `escapeHtml()` |

### Module Dependency Flow

```
 ┌─────────── Foundation Layer ──────────┐
 │  constants ─▶ storage ─▶ helpers      │
 └──────────────────┬────────────────────┘
                    ▼
 ┌──────── Configuration Layer ──────────┐
 │  settingsManager ─▶ i18n              │
 └──────────────────┬────────────────────┘
                    ▼
 ┌──────── Core Game Engine ─────────────┐
 │  board ─▶ rules ─▶ history ─▶ state   │
 └──────────────────┬────────────────────┘
                    ▼
 ┌───────── AI + UI + Audio ─────────────┐
 │  ┌──────────┐ ┌────────┐ ┌─────────┐  │
 │  │ heuristic│ │ toast  │ │ bgm     │  │
 │  │ easy     │ │ modal  │ │ playlist│  │
 │  │ minimax  │ │ board  │ │ sfx     │  │
 │  │ ai ctrl  │ │ menu   │ │ audio   │  │
 │  │          │ │ resp.  │ │ manager │  │
 │  └──────────┘ └────────┘ └─────────┘  │
 └──────────────────┬────────────────────┘
                    ▼
 ┌──────────── Orchestrator ─────────────┐
 │              main.js                  │
 │  (screen routing, game lifecycle,     │
 │   event delegation, AI scheduling)    │
 └───────────────────────────────────────┘
```

### Script Loading Order

The scripts in `index.html` are loaded in strict dependency order:

```
 1. constants    ──▶  2. storage     ──▶  3. helpers
 4. settings     ──▶  5. i18n
 6. board        ──▶  7. rules       ──▶  8. history     ──▶  9. gameState
10. heuristic    ──▶ 11. easyRandom  ──▶ 12. minimax     ──▶ 13. aiController
14. toast        ──▶ 15. modal       ──▶ 16. responsive  ──▶ 17. renderBoard
18. renderMenu   ──▶ 19. bgmPlaylist ──▶ 20. sfxPlayer   ──▶ 21. audioManager
22. main (entry point)
```

---

## 📂 Project Structure

```
Connect_Four/
│
├── 📄 index.html                      # Entry point — loads all CSS/JS
├── 📄 connect-four-spec.md            # Full project specification (zh-TW)
├── 📄 README.md                       # You are here
│
├── 📁 js/                             # ─── JavaScript Modules ───
│   ├── 📄 main.js                     # 🚀 App entry point & orchestrator
│   │
│   ├── 📁 core/                       # 🧠 Core Game Engine
│   │   ├── 📄 board.js                #    Board creation & piece operations
│   │   ├── 📄 rules.js                #    Win/draw detection (4 directions)
│   │   ├── 📄 history.js              #    Move history & undo
│   │   └── 📄 gameState.js            #    Game state, save/load, stats
│   │
│   ├── 📁 ai/                         # 🤖 AI Engine
│   │   ├── 📄 aiController.js         #    Strategy router + responsive depth
│   │   ├── 📄 easyRandom.js           #    Easy: weighted random + block wins
│   │   ├── 📄 heuristic.js            #    Board evaluation function
│   │   └── 📄 minimax.js              #    Minimax + α-β pruning (time-limited)
│   │
│   ├── 📁 ui/                         # 🖥️ User Interface
│   │   ├── 📄 renderBoard.js          #    Game screen, board grid, chips
│   │   ├── 📄 renderMenu.js           #    Menu, setup, how-to, settings screens
│   │   ├── 📄 modalController.js      #    Modal dialog system
│   │   ├── 📄 responsiveController.js #    Viewport vars & orientation
│   │   └── 📄 toast.js                #    Toast notifications
│   │
│   ├── 📁 audio/                      # 🔊 Procedural Audio
│   │   ├── 📄 audioManager.js         #    Web Audio context, BGM scheduling
│   │   ├── 📄 bgmPlaylist.js          #    4 piano melody definitions
│   │   └── 📄 sfxPlayer.js            #    7 synthesized sound effects
│   │
│   ├── 📁 i18n/                       # 🌐 Internationalization
│   │   ├── 📄 i18n.js                 #    Translation engine (~87 keys × 3 langs)
│   │   ├── 📄 lang-en.json            #    English (reference file)
│   │   ├── 📄 lang-ja.json            #    Japanese (reference file)
│   │   └── 📄 lang-zh-TW.json         #    Traditional Chinese (reference file)
│   │
│   ├── 📁 settings/                   # ⚙️ Settings Management
│   │   └── 📄 settingsManager.js      #    Load/save/apply settings
│   │
│   └── 📁 utils/                      # 🛠️ Utilities
│       ├── 📄 constants.js            #    All constants & defaults
│       ├── 📄 helpers.js              #    deepClone, clamp, delay, etc.
│       └── 📄 storage.js             #    localStorage wrapper + fallback
│
├── 📁 css/                            # ─── Stylesheets ───
│   ├── 📄 animations.css              #    🎬 Keyframes (drop, pulse, shake, etc.)
│   ├── 📁 base/                       #    Reset, CSS variables, typography
│   │   ├── 📄 reset.css
│   │   ├── 📄 variables.css
│   │   └── 📄 typography.css
│   ├── 📁 components/                 #    Board, buttons, modal, etc.
│   │   ├── 📄 board.css
│   │   ├── 📄 button.css
│   │   ├── 📄 icons.css
│   │   ├── 📄 modal.css
│   │   ├── 📄 navbar.css
│   │   └── 📄 toast.css
│   ├── 📁 layout/                     #    Grid system & responsive
│   │   ├── 📄 grid.css
│   │   └── 📄 responsive.css
│   ├── 📁 screens/                    #    Screen-specific styles
│   │   ├── 📄 game.css
│   │   ├── 📄 howtoplay.css
│   │   ├── 📄 main-menu.css
│   │   └── 📄 settings.css
│   └── 📁 themes/                     #    🎨 5 Color themes
│       ├── 📄 theme-classic.css
│       ├── 📄 theme-ocean.css
│       ├── 📄 theme-candy.css
│       ├── 📄 theme-night.css
│       └── 📄 theme-forest.css
│
├── 📁 assets/                         # ─── Static Assets ───
│   ├── 📁 audio/                      #    (empty — audio is procedural!)
│   │   ├── 📁 bgm/
│   │   └── 📁 sfx/
│   ├── 📁 fonts/                      #    (empty — uses system fonts)
│   ├── 📁 icons/                      #    20 SVG UI icons
│   └── 📁 images/                     #    4 SVG backgrounds & textures
│
├── 📁 data/                           # ─── Configuration ───
│   └── 📄 defaultSettings.json        #    Reference defaults
│
└── 📁 tasks/                          # ─── Development Docs ───
    ├── 📄 todo.md                     #    Task tracker (4 tasks completed)
    └── 📄 lessons.md                  #    Development lessons learned
```

---

## 🧩 Module Guide

### 🧠 Core Game Engine — `js/core/`

| Module | Key Exports | Description |
|:---|:---|:---|
| **board.js** | `createBoard()` `cloneBoard()` `getAvailableRow()` `getValidColumns()` `dropPiece()` `boardFromMoves()` | Creates 6×7 grid, handles piece placement, cloning, and board reconstruction from move history |
| **rules.js** | `getWinningLine()` `findWinner()` `isDraw()` | Checks all 4 directions from each cell to detect wins; scans entire board for winner |
| **history.js** | `rebuildGame()` `undo()` | Rebuilds game state from move array; undo removes 1 step (PvP) or 2 steps (PvE) |
| **gameState.js** | `createGame()` `applyMove()` `persistGame()` `loadGame()` `hasSave()` `recordStats()` | Central state manager — creates games, applies moves, auto-saves, tracks statistics |

> 💡 **Design Note**: Games are saved as move arrays (not full board). The board is reconstructed from moves on load — this keeps saves compact and immune to corruption.

### 🤖 AI Engine — `js/ai/`

| Module | Algorithm | Description |
|:---|:---|:---|
| **aiController.js** | Router | Routes to correct AI strategy; adds artificial delay (260ms easy, 420ms others); reduces search depth on small screens |
| **easyRandom.js** | Smart Random | Checks for immediate win → block opponent → center-weighted random |
| **heuristic.js** | Evaluation | Scores 4-cell windows across all directions; center column bonus; used by Minimax |
| **minimax.js** | Minimax α-β | Time-limited recursive search with alpha-beta pruning; immediate win/block shortcuts |

### 🖥️ UI Modules — `js/ui/`

| Module | Screens / Components | Description |
|:---|:---|:---|
| **renderBoard.js** | Game screen | Board grid, column arrows, chip rendering, turn indicator, toolbar (undo/restart/pause/audio) |
| **renderMenu.js** | Menu, Setup, How-to, Settings | Multi-screen rendering with difficulty cards, how-to diagrams, settings controls |
| **modalController.js** | Modal dialogs | Promise-based modal with `data-modal-action` buttons; ARIA dialog attributes |
| **responsiveController.js** | Viewport handling | Sets `--vh` CSS variable, detects portrait/landscape, debounced resize |
| **toast.js** | Toast popup | Auto-dismissing notification with XSS-safe rendering |

### 🔊 Audio Modules — `js/audio/`

| Module | Role | Description |
|:---|:---|:---|
| **audioManager.js** | Central controller | Creates `AudioContext`, manages two `GainNode`s (BGM + SFX), synthesizes piano notes via oscillators, schedules playlist |
| **bgmPlaylist.js** | Track data | 4 piano melodies defined as frequency arrays with BPM |
| **sfxPlayer.js** | SFX synthesis | 7 sound effects (drop, win, lose, draw, click, error, toggle) built from oscillator tone sequences |

### ⚙️ Support Modules

| Module | Path | Description |
|:---|:---|:---|
| **constants.js** | `js/utils/` | Board dimensions (6×7), player IDs, storage keys, 5 themes with color swatches, 3 languages, 4 difficulty configs with depth/time limits, default settings |
| **helpers.js** | `js/utils/` | `deepClone` `clamp` `delay` `sample` `debounce` `escapeHtml` `formatPercent` |
| **storage.js** | `js/utils/` | localStorage wrapper with availability test; falls back to in-memory `Map` |
| **settingsManager.js** | `js/settings/` | Load/save/apply settings; auto-detect language from `navigator.language`; applies theme via `data-theme` attribute |
| **i18n.js** | `js/i18n/` | ~87 translation keys × 3 languages (inline); `t(key, params)` with `{placeholder}` interpolation; falls back to English → raw key |

---

<a id="-ai-system-in-depth"></a>

## 🤖 AI System — In Depth

### Difficulty Comparison

```
  Strength
     ▲
     │
  10 │                                          ┌─────────────┐
     │                                          │   EXPERT    │
   8 │                                          │  Minimax    │
     │                                          │  α-β d=8   │
   6 │                          ┌─────────────┐ └─────────────┘
     │                          │    HARD     │
   4 │                          │  Minimax    │
     │       ┌─────────────┐    │  α-β d=5   │
   2 │       │   NORMAL    │    └─────────────┘
     │       │  Minimax    │
   1 │ ┌───────────┐ d=3  │
     │ │   EASY    │      │
     │ │  Random   │──────┘
     │ └───────────┘
     └──────────────────────────────────────────────▶ Difficulty
```

### Detailed Difficulty Specs

| Level | Algorithm | Search Depth | Time Limit | Mobile Depth | Key Behavior |
|:---:|:---|:---:|:---:|:---:|:---|
| 🟢 **Easy** | Weighted Random | 1 | 220ms | 1 | Win if possible → Block opponent → Center-weighted random |
| 🟡 **Normal** | Minimax + Heuristic | 3 | 650ms | 3 | Moderate lookahead, balanced play |
| 🔴 **Hard** | Minimax + α-β | 5 | 1200ms | 4 | Strong lookahead with pruning |
| ⚫ **Expert** | Minimax + α-β | 8 | 1500ms | 6–7 | Near-optimal play, deep analysis |

> 📱 **Mobile Optimization**: On screens ≤640px, search depth is automatically reduced by 1 for Hard/Expert to prevent UI lag.

### Heuristic Scoring System

The heuristic evaluates every possible 4-cell window across the board:

| Condition | Score | Rationale |
|:---|:---:|:---|
| AI 4-in-a-row (win) | **+100,000** | Absolute priority |
| Opponent 4-in-a-row (loss) | **-100,000** | Must block |
| AI 3-in-a-row + 1 empty | +120 | Strong threat |
| Opponent 3-in-a-row + 1 empty | -150 | Urgent defense (weighted higher) |
| AI 2-in-a-row + 2 empty | +18 | Building position |
| Opponent 2-in-a-row + 2 empty | -16 | Minor concern |
| Center column piece (AI) | +10 | Strategic center control |

### Minimax Algorithm Features

| Feature | Implementation |
|:---|:---|
| 🌳 **Alpha-Beta Pruning** | Prunes branches that can't affect the final decision |
| ⏱️ **Time-Limited Search** | `Date.now() > deadline` check prevents mobile freezing |
| ⚡ **Immediate Shortcuts** | Checks for win/block before starting full search |
| 🎯 **Center-First Ordering** | Evaluates center columns first for better pruning |
| 📏 **Depth-Adjusted Scores** | Prefers faster wins and slower losses |

---

<a id="-themes-en"></a>

## 🎨 Themes

Five handcrafted color themes, each with unique personality:

| Theme | Board | Chip 1 | Chip 2 | Mood |
|:---|:---|:---|:---|:---|
| 🪵 **Classic** | Warm wood brown | 🔵 Navy | 🟡 Yellow | ☀️ Timeless & traditional |
| 🌊 **Ocean** | Sky blue | 🟠 Coral | 🟢 Mint | 💎 Cool & calm |
| 🍬 **Candy** | Pink purple | 🍓 Strawberry | 🩵 Sky | 🎀 Sweet & playful |
| 🌙 **Night** | Dark blue-black | 💜 Purple | 🩵 Cyan | 🌌 Sleek dark mode |
| 🌲 **Forest** | Deep green | 🟤 Russet | 🟡 Buff | 🍃 Natural & earthy |

> Themes are changed via **Settings** and persist automatically via `localStorage`.  
> Theme colors are defined as CSS custom properties in `css/themes/theme-*.css`.

---

<a id="-audio-system-en"></a>

## 🔊 Audio System

### 🎹 Procedural Audio — No Files Required!

All audio is **synthesized at runtime** using the Web Audio API. This means:
- ✅ **Zero audio files** — `assets/audio/` directories are empty!
- ✅ **Tiny project size** — no MP3/WAV/OGG assets to download
- ✅ **Fully offline** — no CDN or network dependency

### BGM — Piano Melodies

| Track | Tempo | Mood |
|:---|:---:|:---|
| 🌅 Morning | 108 BPM | Gentle, awakening |
| ☀️ Sunny | 116 BPM | Bright, cheerful |
| 🎈 Playful | 124 BPM | Upbeat, energetic |
| 🍃 Breeze | 96 BPM | Calm, relaxing |

> Each track is defined as 12 note frequencies. Notes are synthesized using **triangle + sine oscillators** with exponential envelope decay — producing a piano-like timbre.

### SFX — Sound Effects

| Effect | Trigger | Tones |
|:---|:---|:---:|
| 🔽 Drop | Piece placed | 2 |
| 🏆 Win | Game won | 3 ascending |
| 😞 Lose | Game lost | 2 descending |
| 🤝 Draw | Game drawn | 2 same |
| 🖱️ Click | Button press | 1 high |
| ❌ Error | Invalid action | 1 low |
| 🔀 Toggle | Toggle switch | 2 ascending |

### Volume Controls

| Control | Range | Notes |
|:---|:---:|:---|
| 🎵 BGM Volume | 0% – 200% | With safe gain capping (max 1.6) |
| 🔊 SFX Volume | 0% – 100% | Capped at gain 1.0 |
| 📢 BGM Boost | 0.7x – 2.0x | In-game amplification (menu uses 0.72x) |
| 🔇 Mute Toggle | On/Off | One-click mute all |

---

<a id="-internationalization-i18n-en"></a>

## 🌐 Internationalization (i18n)

| Language | Code | Auto-detect | Status |
|:---|:---:|:---:|:---:|
| 🇬🇧 English | `en` | `en-*` browsers | ✅ Complete (~87 keys) |
| 🇯🇵 日本語 | `ja` | `ja-*` browsers | ✅ Complete (~87 keys) |
| 🇹🇼 繁體中文 | `zh-TW` | `zh-*` browsers | ✅ Complete (~87 keys) |

> **Auto-detection**: The app reads `navigator.language` on first launch and sets the matching language. All `zh-*` variants map to `zh-TW`, `ja-*` to `ja`, everything else defaults to `en`.

### Translation Coverage

| Category | Example Keys |
|:---|:---|
| 🏠 Menu | Title, Start, Continue, How to Play, Settings |
| 🎮 Game UI | Player labels, turn indicator, AI thinking |
| 🤖 AI | Difficulty names + descriptions |
| 🎨 Themes | Theme names |
| ⚙️ Settings | All labels, sliders, toggles |
| 📖 How to Play | Goal, controls, tips, FAQ |
| 🏆 Results | Win, lose, draw messages |
| 📳 Toast | Action confirmations |

---

## ♿ Accessibility

| Feature | Implementation |
|:---|:---|
| 🏷️ **ARIA Labels** | `aria-label` on column buttons, `aria-pressed` on toggles |
| 🗣️ **Live Regions** | `aria-live` on toast and status areas |
| 🪟 **Dialog Roles** | `role="dialog"`, `aria-modal="true"` on modals |
| ⌨️ **Keyboard** | Escape to close modals, auto-focus on dialog open |
| 🎞️ **Reduced Motion** | Respects `prefers-reduced-motion` + settings toggle |
| 📳 **Haptic** | Optional `navigator.vibrate` on supported devices |

---

## 📜 License

This project is part of the **Games Workshop** collection.

---

<br>

<!-- ╔══════════════════════════════════════════════════════════════╗ -->
<!-- ║                         日本語                               ║ -->
<!-- ╚══════════════════════════════════════════════════════════════╝ -->

<a id="-日本語"></a>

# 🇯🇵 日本語

## 📑 目次

| セクション | 内容 |
|:---|:---|
| [✨ 機能一覧](#-機能一覧) | 全機能の概要 |
| [🎮 ゲーム紹介](#-ゲーム紹介) | 四目並べとは |
| [📖 遊び方](#-遊び方) | ルール・操作・ゲームフロー |
| [🚀 はじめに](#-はじめに) | ゲームの起動方法 |
| [🏗️ アーキテクチャ概要](#️-アーキテクチャ概要) | システム設計 |
| [📂 プロジェクト構造](#-プロジェクト構造) | ファイル構成 |
| [🧩 モジュールガイド](#-モジュールガイド) | モジュール詳細 |
| [🤖 AIシステム](#-aiシステム) | AI難易度とアルゴリズム |
| [🎨 テーマ](#-テーマ) | 5種類のカラーテーマ |
| [🔊 オーディオシステム](#-オーディオシステム) | プロシージャルオーディオ |
| [🌐 多言語対応](#-多言語対応-i18n) | 3言語サポート |

---

## ✨ 機能一覧

| 🎯 機能 | 📝 説明 |
|:---:|:---|
| 🆚 **2つのゲームモード** | 対人戦（PvP）& AI対戦（PvE） |
| 🤖 **AI難易度4段階** | イージー・ノーマル・ハード・エキスパート |
| 🌐 **3言語対応** | English・日本語・中文 |
| 🎨 **5種類のテーマ** | クラシック・オーシャン・キャンディ・ナイト・フォレスト |
| 🎹 **プロシージャルオーディオ** | Web Audio APIによるピアノBGM＋効果音 — 音声ファイル不要！ |
| ↩️ **手戻し** | PvPは1手、PvEは2手戻し |
| 💾 **オートセーブ** | ゲーム状態が自動保存 — いつでも再開 |
| 📊 **統計データ** | 難易度別の勝敗記録 |
| 📱 **完全レスポンシブ** | モバイル縦/横・タブレット・デスクトップ対応 |
| ♿ **アクセシビリティ** | ARIA属性・キーボード操作・モーション軽減 |
| 📳 **触覚フィードバック** | モバイルでのバイブレーション対応 |
| 🔌 **ゼロビルド・オフライン** | npm不要・バンドラー不要・サーバー不要 — `index.html`を開くだけ |

---

## 🎮 ゲーム紹介

**四目並べ（Connect Four）** は、2人用の戦略ボードゲームの名作です。プレイヤーは交互に**6行×7列**の縦型グリッドにコマを落とします。**横・縦・斜めのいずれかに4つ連続**でコマを並べた方が勝ちです！

### 🌟 このバージョンの特徴

| 💡 ポイント | 詳細 |
|:---|:---|
| 🧠 **高度なAI** | ランダム手からエキスパート級Minimax（深さ8）まで4段階 |
| 🎹 **プロシージャルピアノBGM** | Web Audioオシレーターでリアルタイム合成される4曲のオリジナルメロディ |
| 🎨 **5つのテーマ** | それぞれ固有のボード質感・チップカラー・雰囲気 |
| 🏆 **勝利演出** | HTML/CSSのみのアートワーク — 勝利に🎉紙吹雪、敗北に🌧️雨 |
| 🌍 **言語自動検出** | ブラウザの言語設定からzh-TW / en / jaを自動適用 |
| 📵 **完全オフライン** | ネットワークリクエストゼロ — `file://`プロトコルで動作 |

---

## 📖 遊び方

### 🎯 目的

相手より先に、自分のコマを**横↔️・縦↕️・斜め↗️↘️のいずれかに4つ**連続で並べましょう！

### 📋 ルール

```
 ┌──────────────────────────────────────────────┐
 │  1. プレイヤーは交互に1手ずつコマを落とす     │
 │  2. コマは選んだ列の一番下の空き行に落ちる     │
 │  3. 先に4つ揃えた方の勝ち！                   │
 │  4. 盤面が埋まっても4つ揃わなければ引き分け    │
 └──────────────────────────────────────────────┘
```

### 🕹️ 操作方法

| 操作 | 方法 |
|:---:|:---|
| 🖱️ **コマを落とす** | 列の▼矢印をクリック/タップ |
| ↩️ **手戻し** | 「元に戻す」ボタンをクリック |
| 🔄 **リスタート** | 「再開」ボタンをクリック |
| ⏸️ **一時停止** | 「ポーズ」ボタンでメニューオーバーレイ |
| 🎵 **BGM切替** | 音楽アイコンをクリック |
| 🔊 **効果音切替** | サウンドアイコンをクリック |
| 🚪 **メニューに戻る** | ポーズ → ホーム |

### 🧭 ゲームフロー

```
┌────────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────┐
│  メイン    │────▶│  セットアップ │────▶│  モード選択     │────▶│  ゲーム  │
│  メニュー  │     │  画面        │     │ ＋難易度選択    │     │  画面    │
└────────────┘     └──────────────┘     └────────────────┘     └──────────┘
  │       │                                                      │
  │       ▼                                                      │
  │  ┌────────────┐                                              │
  │  │ コンティ    │──── (セーブデータ読込) ─────────────────────┘
  │  │ ニュー     │
  │  └────────────┘
  │       │
  ▼       ▼
┌──────────────┐                                        ┌──────────────┐
│  遊び方      │                                        │  ポーズ      │
└──────────────┘                                        │  モーダル    │
       │                                                └──────────────┘
       ▼
┌──────────────┐
│    設定      │
└──────────────┘
```

---

## 🚀 はじめに

### 必要な環境

> 🎉 **ビルドツール・npm・サーバー不要！**  
> `index.html`を直接開くだけで動きます。

```bash
# 方法1: ファイルエクスプローラーで index.html をダブルクリック ✅

# 方法2: リポジトリからクローン
git clone https://github.com/your-username/Connect_Four.git
cd Connect_Four
# → index.html をブラウザで開く

# 方法3: ローカルサーバー（オプション）
python -m http.server 8080       # Python
npx serve .                       # Node.js
```

---

## 🏗️ アーキテクチャ概要

| 設計原則 | 実装方法 |
|:---|:---|
| 🔌 **ゼロビルド** | 依存順に並べたclassic `<script>`タグ — バンドラー不要 |
| 🌐 **オフラインファースト** | CDN・fetch・ネットワーク不要 — `file://`で動作 |
| 🏗️ **モジュラー名前空間** | 全モジュールがグローバル`window.CF`名前空間に登録 |
| 🎵 **バイナリアセット不要** | オーディオはWeb Audio APIで実行時生成 |
| 🛡️ **グレースフルフォールバック** | localStorage無効時はインメモリMapに切替 |

---

## 📂 プロジェクト構造

| ディレクトリ | 内容 | ファイル数 |
|:---|:---|:---:|
| `js/core/` | 🧠 ゲームエンジン（盤面・ルール・履歴・状態） | 4 |
| `js/ai/` | 🤖 AIエンジン（4難易度） | 4 |
| `js/ui/` | 🖥️ UI（盤面描画・メニュー・モーダル・トースト） | 5 |
| `js/audio/` | 🔊 プロシージャルオーディオ | 3 |
| `js/i18n/` | 🌐 国際化（3言語） | 4 |
| `js/settings/` | ⚙️ 設定管理 | 1 |
| `js/utils/` | 🛠️ ユーティリティ | 3 |
| `css/` | 🎨 スタイルシート（5テーマ含む） | 16 |
| `assets/icons/` | 🖼️ SVGアイコン | 20 |
| `assets/images/` | 🖼️ SVG背景・テクスチャ | 4 |

---

## 🧩 モジュールガイド

### 🧠 コアモジュール（`js/core/`）

| モジュール | 主要エクスポート | 説明 |
|:---|:---|:---|
| **board.js** | `createBoard()` `dropPiece()` `boardFromMoves()` | 6×7グリッド生成・コマ操作・履歴からの盤面再構築 |
| **rules.js** | `getWinningLine()` `findWinner()` `isDraw()` | 4方向の勝利判定・全盤面スキャン |
| **history.js** | `rebuildGame()` `undo()` | 手の履歴からゲーム状態を再構築・PvP 1手/PvE 2手戻し |
| **gameState.js** | `createGame()` `applyMove()` `persistGame()` `loadGame()` | 中央状態管理・移動適用・自動保存・統計記録 |

### 🤖 AIモジュール（`js/ai/`）

| モジュール | アルゴリズム | 説明 |
|:---|:---|:---|
| **aiController.js** | ルーター | 難易度に応じたAI選択・人工遅延・モバイル探索深度調整 |
| **easyRandom.js** | スマートランダム | 勝利手→阻止手→中央偏重ランダム |
| **heuristic.js** | 評価関数 | 4セルウィンドウのスコア評価・中央列ボーナス |
| **minimax.js** | Minimax α-β | 時間制限付き再帰探索・即時勝利/阻止ショートカット |

### 🖥️ UIモジュール（`js/ui/`）

| モジュール | 役割 | 説明 |
|:---|:---|:---|
| **renderBoard.js** | ゲーム画面 | 盤面グリッド・チップ描画・ツールバー |
| **renderMenu.js** | メニュー系画面 | メインメニュー・セットアップ・遊び方・設定画面 |
| **modalController.js** | ダイアログ | Promise型モーダル・ARIA対応 |
| **responsiveController.js** | ビューポート | `--vh`変数・画面向き検出 |
| **toast.js** | 通知 | XSS対策済みトースト通知 |

---

## 🤖 AIシステム

| レベル | アルゴリズム | 探索深度 | 制限時間 | おすすめ |
|:---:|:---|:---:|:---:|:---|
| 🟢 **イージー** | 偏重ランダム＋勝利/阻止 | 1 | 220ms | 初心者・お子様 |
| 🟡 **ノーマル** | Minimax＋ヒューリスティック | 3 | 650ms | カジュアルプレイヤー |
| 🔴 **ハード** | Minimax＋α-β枝刈り | 5 | 1200ms | 中級者 |
| ⚫ **エキスパート** | Minimax＋α-β枝刈り | 8 | 1500ms | 上級者 |

> 📱 640px以下の画面ではハード/エキスパートの探索深度が自動で1減少します。

---

## 🎨 テーマ

| テーマ | ボード | チップ1 | チップ2 | 雰囲気 |
|:---|:---|:---|:---|:---|
| 🪵 **クラシック** | ウッドブラウン | 🔵 ネイビー | 🟡 イエロー | ☀️ 定番 |
| 🌊 **オーシャン** | スカイブルー | 🟠 コーラル | 🟢 ミント | 💎 癒し |
| 🍬 **キャンディ** | ピンクパープル | 🍓 ストロベリー | 🩵 スカイ | 🎀 ポップ |
| 🌙 **ナイト** | ダークブルー | 💜 パープル | 🩵 シアン | 🌌 モダン |
| 🌲 **フォレスト** | ディープグリーン | 🟤 ラセット | 🟡 バフ | 🍃 ナチュラル |

---

## 🔊 オーディオシステム

### 🎹 プロシージャルオーディオ — ファイル不要！

全オーディオは **Web Audio API でランタイム合成** されます：
- ✅ 音声ファイルゼロ
- ✅ 極小プロジェクトサイズ
- ✅ 完全オフライン

| BGMトラック | テンポ | 雰囲気 |
|:---|:---:|:---|
| 🌅 Morning | 108 BPM | 穏やか |
| ☀️ Sunny | 116 BPM | 明るい |
| 🎈 Playful | 124 BPM | 活発 |
| 🍃 Breeze | 96 BPM | リラックス |

| 効果音 | トリガー |
|:---|:---|
| 🔽 ドロップ | コマ配置時 |
| 🏆 勝利 | 勝利時（上昇3音） |
| 😞 敗北 | 敗北時（下降2音） |
| 🤝 引分 | 引分時（同音2つ） |
| 🖱️ クリック | ボタン押下 |

---

## 🌐 多言語対応 (i18n)

| 言語 | コード | 自動検出 | キー数 | 対応状況 |
|:---|:---:|:---:|:---:|:---:|
| 🇬🇧 英語 | `en` | `en-*`ブラウザ | ~87 | ✅ 完了 |
| 🇯🇵 日本語 | `ja` | `ja-*`ブラウザ | ~87 | ✅ 完了 |
| 🇹🇼 繁體中文 | `zh-TW` | `zh-*`ブラウザ | ~87 | ✅ 完了 |

> 初回起動時に `navigator.language` から自動検出。ページリロードなしで即時切替可能。

---

<br>

<!-- ╔══════════════════════════════════════════════════════════════╗ -->
<!-- ║                         中文                                ║ -->
<!-- ╚══════════════════════════════════════════════════════════════╝ -->

<a id="-中文"></a>

# 🇹🇼 中文

## 📑 目錄

| 章節 | 說明 |
|:---|:---|
| [✨ 功能總覽](#-功能總覽) | 所有功能概覽 |
| [🎮 遊戲介紹](#-遊戲介紹-1) | 什麼是四子棋 |
| [📖 遊戲玩法](#-遊戲玩法) | 規則、操作、遊戲流程 |
| [🚀 快速開始](#-快速開始) | 如何啟動遊戲 |
| [🏗️ 架構總覽](#️-架構總覽) | 系統設計 |
| [📂 專案結構](#-專案結構) | 完整檔案樹 |
| [🧩 模組說明](#-模組說明) | 詳細模組文件 |
| [🤖 AI 系統](#-ai-系統詳解) | AI 演算法與難度等級 |
| [🎨 佈景主題](#-佈景主題) | 5 種色彩主題 |
| [🔊 音效系統](#-音效系統) | 程序化音效引擎 |
| [🌐 多國語言](#-多國語言-i18n) | 三語支援 |
| [♿ 無障礙功能](#-無障礙功能) | 無障礙支援 |

---

## ✨ 功能總覽

| 🎯 功能 | 📝 說明 |
|:---:|:---|
| 🆚 **雙模式對戰** | 玩家對玩家（PvP）& 玩家對電腦（PvE） |
| 🤖 **4 種 AI 難度** | 簡單 · 普通 · 困難 · 專家 |
| 🌐 **三語支援** | English · 日本語 · 中文 |
| 🎨 **5 種佈景主題** | 經典 · 海洋 · 糖果 · 夜色 · 森林 |
| 🎹 **程序化音效** | 透過 Web Audio API 生成鋼琴 BGM + 音效 — 零音檔！ |
| ↩️ **悔棋功能** | PvP 悔 1 步、PvE 悔 2 步 |
| 💾 **自動存檔** | 遊戲狀態持久保存 — 隨時可繼續 |
| 📊 **戰績統計** | 各難度的勝敗紀錄 |
| 📱 **全響應式** | 手機直/橫、平板、桌機完美適配 |
| ♿ **無障礙** | ARIA 屬性、鍵盤導覽、減少動態效果 |
| 📳 **觸覺回饋** | 行動裝置振動支援 |
| 🔌 **零建構・離線** | 不需要 npm、打包器、伺服器 — 打開 `index.html` 就能玩！ |

---

<a id="-遊戲介紹-1"></a>

## 🎮 遊戲介紹

**四子棋（Connect Four）** 是經典的雙人策略棋盤遊戲。玩家輪流將棋子放入 **6 行 × 7 列** 的直立棋盤中，**先將四顆棋子連成一線（橫、直、斜）** 的玩家即獲勝！

### 🌟 本版本特色

| 💡 亮點 | 詳細說明 |
|:---|:---|
| 🧠 **智慧 AI** | 從隨機落子到專家級 Minimax（深度 8）搭配 α-β 剪枝，共 4 種難度 |
| 🎹 **程序化鋼琴 BGM** | 4 首原創旋律透過 Web Audio 振盪器即時合成 |
| 🎨 **5 款精美主題** | 每款主題都有獨特的棋盤紋理、棋子配色和視覺風格 |
| 🏆 **勝利動畫** | 純 HTML/CSS 藝術作品 — 勝利時 🎉 紙花飛舞、失敗時 🌧️ 下雨 |
| 🌍 **語言自動偵測** | 根據瀏覽器語言自動套用 zh-TW / en / ja |
| 📵 **完全離線** | 零網路請求 — 支援 `file://` 協議直接開啟 |

---

## 📖 遊戲玩法

### 🎯 目標

在對手之前，將你的四顆棋子連成一線 — 橫向 ↔️、縱向 ↕️ 或斜向 ↗️↘️！

### 📋 規則

```
 ┌──────────────────────────────────────────────┐
 │  1. 玩家輪流進行，每回合落一顆棋子            │
 │  2. 棋子會落到該列最低的空位                  │
 │  3. 先在任何方向連成四子的玩家獲勝！           │
 │  4. 棋盤填滿無人獲勝 ＝ 平局                  │
 └──────────────────────────────────────────────┘
```

### 🏆 勝利條件 — 圖解

```
   橫向 ───          縱向 │        斜向 ╲         斜向 ╱

 ┌─┬─┬─┬─┬─┬─┬─┐   ┌─┬─┬─┬─┐   ┌─┬─┬─┬─┐     ┌─┬─┬─┬─┐
 │ │ │ │ │ │ │ │   │ │●│ │ │   │●│ │ │ │     │ │ │ │●│
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │●│●│●│●│ │ │   │ │●│ │ │   │ │●│ │ │     │ │ │●│ │
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │ │ │ │ │ │ │   │ │●│ │ │   │ │ │●│ │     │ │●│ │ │
 ├─┼─┼─┼─┼─┼─┼─┤   ├─┼─┼─┼─┤   ├─┼─┼─┼─┤     ├─┼─┼─┼─┤
 │ │ │ │ │ │ │ │   │ │●│ │ │   │ │ │ │●│     │●│ │ │ │
 └─┴─┴─┴─┴─┴─┴─┘   └─┴─┴─┴─┘   └─┴─┴─┴─┘     └─┴─┴─┴─┘
```

### 🕹️ 操作方式

| 操作 | 方法 |
|:---:|:---|
| 🖱️ **落子** | 點擊 / 觸碰欄位上方的 ▼ 箭頭 |
| ↩️ **悔棋** | 點擊「悔棋」按鈕 |
| 🔄 **重新開始** | 點擊「重新開始」按鈕 |
| ⏸️ **暫停** | 點擊「暫停」按鈕開啟選單覆蓋層 |
| 🎵 **BGM 開關** | 點擊音樂圖示 |
| 🔊 **音效開關** | 點擊喇叭圖示 |
| 🚪 **返回主選單** | 暫停 → 首頁 |

### 🧭 遊戲流程

```
┌────────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────┐
│   主選單   │────▶│  遊戲設定    │────▶│   選擇模式     │────▶│   遊戲   │
│            │     │   畫面       │     │ ＋難度選擇     │     │   畫面   │
└────────────┘     └──────────────┘     └────────────────┘     └──────────┘
  │       │                                                      │
  │       ▼                                                      │
  │  ┌────────────┐                                              │
  │  │  繼續遊戲  │──── (載入存檔) ─────────────────────────────┘
  │  └────────────┘
  │       │
  ▼       ▼
┌──────────────┐                                        ┌──────────────┐
│  遊戲教學    │                                        │    暫停      │
└──────────────┘                                        │   彈窗       │
       │                                                └──────────────┘
       ▼
┌──────────────┐
│   遊戲設定   │
└──────────────┘
```

---

## 🚀 快速開始

### 環境需求

> 🎉 **不需要任何建構工具、npm 或伺服器！**  
> 直接打開 `index.html` 就能玩。

| 需求 | 說明 |
|:---|:---|
| 🌐 現代瀏覽器 | Chrome 66+, Firefox 60+, Safari 14+, Edge 79+ |
| 📁 檔案存取 | 直接雙擊 `index.html` 即可！ |

### 快速啟動

```bash
# 方法 1：直接開啟！
# 在檔案總管中雙擊 index.html ✅

# 方法 2：從儲存庫複製
git clone https://github.com/your-username/Connect_Four.git
cd Connect_Four
# 然後用瀏覽器開啟 index.html

# 方法 3：本地伺服器（可選）
python -m http.server 8080       # Python
npx serve .                       # Node.js
```

> 💡 **小提示**：本專案使用傳統 `<script>` 標籤（非 ES Modules），因此可以直接在 `file://` 協議下運行——不需要伺服器！

---

## 🏗️ 架構總覽

### 設計原則

| 原則 | 實作方式 |
|:---|:---|
| 🔌 **零建構** | 依照相依順序排列的 `<script>` 標籤——不需打包器 |
| 🌐 **離線優先** | 不使用 CDN、fetch、網路請求——支援 `file://` |
| 🏗️ **模組化命名空間** | 所有模組掛載到全域 `window.CF` 命名空間 |
| 🎵 **無二進位資源** | 音效透過 Web Audio API 在執行期生成 |
| 🛡️ **優雅降級** | localStorage 不可用時自動切換為記憶體 Map |
| 🔒 **XSS 防護** | 所有動態文字透過 `escapeHtml()` 跳脫處理 |

### 模組相依流程

```
 ┌──────────── 基礎層 ────────────────┐
 │  constants ─▶ storage ─▶ helpers   │
 └────────────────┬───────────────────┘
                  ▼
 ┌──────────── 設定層 ────────────────┐
 │  settingsManager ─▶ i18n          │
 └────────────────┬───────────────────┘
                  ▼
 ┌──────── 核心遊戲引擎 ─────────────┐
 │  board ─▶ rules ─▶ history ─▶ state│
 └────────────────┬───────────────────┘
                  ▼
 ┌────── AI ＋ UI ＋ Audio ──────────┐
 │  ┌────────┐ ┌────────┐ ┌───────┐  │
 │  │ AI引擎 │ │ UI渲染 │ │ 音效  │  │
 │  └────────┘ └────────┘ └───────┘  │
 └────────────────┬───────────────────┘
                  ▼
 ┌──────────── 協調器 ────────────────┐
 │           main.js                  │
 └────────────────────────────────────┘
```

### 腳本載入順序

```
 1. constants    ──▶  2. storage     ──▶  3. helpers
 4. settings     ──▶  5. i18n
 6. board        ──▶  7. rules       ──▶  8. history     ──▶  9. gameState
10. heuristic    ──▶ 11. easyRandom  ──▶ 12. minimax     ──▶ 13. aiController
14. toast        ──▶ 15. modal       ──▶ 16. responsive  ──▶ 17. renderBoard
18. renderMenu   ──▶ 19. bgmPlaylist ──▶ 20. sfxPlayer   ──▶ 21. audioManager
22. main（進入點）
```

---

## 📂 專案結構

| 目錄 | 內容 | 檔案數 |
|:---|:---|:---:|
| `js/core/` | 🧠 遊戲引擎（棋盤・規則・歷史・狀態） | 4 |
| `js/ai/` | 🤖 AI 引擎（4 種難度策略） | 4 |
| `js/ui/` | 🖥️ UI（棋盤渲染・選單・彈窗・通知） | 5 |
| `js/audio/` | 🔊 程序化音效 | 3 |
| `js/i18n/` | 🌐 國際化（3 語言） | 4 |
| `js/settings/` | ⚙️ 設定管理 | 1 |
| `js/utils/` | 🛠️ 工具程式 | 3 |
| `css/` | 🎨 樣式表（含 5 種主題） | 16 |
| `assets/icons/` | 🖼️ SVG 圖示 | 20 |
| `assets/images/` | 🖼️ SVG 背景與紋理 | 4 |

---

## 🧩 模組說明

### 🧠 核心模組（`js/core/`）

| 模組 | 主要匯出 | 說明 |
|:---|:---|:---|
| **board.js** | `createBoard()` `cloneBoard()` `dropPiece()` `boardFromMoves()` | 建立 6×7 棋盤、棋子操作、從走步歷史重建棋盤 |
| **rules.js** | `getWinningLine()` `findWinner()` `isDraw()` | 四方向勝利判定、全盤面掃描 |
| **history.js** | `rebuildGame()` `undo()` | 從走步陣列重建遊戲狀態；PvP 悔 1 步 / PvE 悔 2 步 |
| **gameState.js** | `createGame()` `applyMove()` `persistGame()` `loadGame()` `recordStats()` | 中央狀態管理器——建立遊戲、套用走步、自動存檔、統計記錄 |

> 💡 **設計備註**：存檔只儲存走步陣列（非完整棋盤）。載入時從走步重建棋盤——讓存檔更精簡且不易損壞。

### 🤖 AI 模組（`js/ai/`）

| 模組 | 演算法 | 說明 |
|:---|:---|:---|
| **aiController.js** | 路由器 | 根據難度分派 AI 策略；添加人工延遲；小螢幕自動降低搜尋深度 |
| **easyRandom.js** | 智慧隨機 | 致勝手 → 攔截手 → 中央偏重隨機 |
| **heuristic.js** | 評估函式 | 對所有 4 格窗口進行方向掃描評分；中央欄位加分 |
| **minimax.js** | Minimax α-β | 時間限制遞迴搜尋；即時勝利/攔截捷徑 |

### 🖥️ UI 模組（`js/ui/`）

| 模組 | 職責 | 說明 |
|:---|:---|:---|
| **renderBoard.js** | 遊戲畫面 | 棋盤格線、欄位箭頭、棋子渲染、回合指示、工具列 |
| **renderMenu.js** | 選單系統 | 主選單、遊戲設定、遊戲教學、設定畫面——含難度卡片、圖解說明 |
| **modalController.js** | 彈窗 | Promise 式彈窗搭配 `data-modal-action` 按鈕；ARIA 對話框屬性 |
| **responsiveController.js** | 視窗處理 | 設定 `--vh` CSS 變數、偵測直/橫向、防抖 resize |
| **toast.js** | 通知 | 自動消失的 XSS 安全通知訊息 |

### 🔊 音效模組（`js/audio/`）

| 模組 | 職責 | 說明 |
|:---|:---|:---|
| **audioManager.js** | 中央控制器 | 建立 `AudioContext`、管理 BGM/SFX 兩個 `GainNode`、合成鋼琴音符、排程播放清單 |
| **bgmPlaylist.js** | 曲目資料 | 4 首鋼琴旋律以頻率陣列 + BPM 定義 |
| **sfxPlayer.js** | 音效合成 | 7 種音效（落子、勝利、失敗、平局、點擊、錯誤、切換）由振盪器音調序列構成 |

### ⚙️ 支援模組

| 模組 | 路徑 | 說明 |
|:---|:---|:---|
| **constants.js** | `js/utils/` | 棋盤尺寸(6×7)、玩家ID、儲存鍵、5主題含色票、3語言、4難度含深度/時限、預設設定 |
| **helpers.js** | `js/utils/` | `deepClone` `clamp` `delay` `sample` `debounce` `escapeHtml` `formatPercent` |
| **storage.js** | `js/utils/` | localStorage 封裝含可用性測試；不可用時退回記憶體 `Map` |
| **settingsManager.js** | `js/settings/` | 載入/儲存/套用設定；從 `navigator.language` 自動偵測語言；透過 `data-theme` 屬性套用主題 |
| **i18n.js** | `js/i18n/` | ~87 翻譯鍵 × 3 語言（內嵌）；`t(key, params)` 搭配 `{placeholder}` 插值；回退至英文 → 原始鍵 |

---

<a id="-ai-系統詳解"></a>

## 🤖 AI 系統詳解

### 難度比較

```
  強度
     ▲
     │
  10 │                                          ┌─────────────┐
     │                                          │    專家     │
   8 │                                          │  Minimax   │
     │                                          │  α-β d=8   │
   6 │                          ┌─────────────┐ └─────────────┘
     │                          │    困難     │
   4 │                          │  Minimax   │
     │       ┌─────────────┐    │  α-β d=5   │
   2 │       │    普通     │    └─────────────┘
     │       │  Minimax    │
   1 │ ┌───────────┐ d=3  │
     │ │    簡單   │      │
     │ │  隨機     │──────┘
     │ └───────────┘
     └──────────────────────────────────────────────▶ 難度
```

### 難度詳細規格

| 等級 | 演算法 | 搜尋深度 | 時間限制 | 手機深度 | 關鍵行為 |
|:---:|:---|:---:|:---:|:---:|:---|
| 🟢 **簡單** | 加權隨機 | 1 | 220ms | 1 | 能贏就贏 → 能擋就擋 → 偏好中央的隨機 |
| 🟡 **普通** | Minimax + 啟發式 | 3 | 650ms | 3 | 中等前瞻，均衡下法 |
| 🔴 **困難** | Minimax + α-β | 5 | 1200ms | 4 | 強力前瞻搭配剪枝 |
| ⚫ **專家** | Minimax + α-β | 8 | 1500ms | 6–7 | 接近最佳策略，深度分析 |

> 📱 **行動裝置優化**：螢幕寬度 ≤640px 時，困難/專家的搜尋深度自動減少 1 以避免 UI 延遲。

### 啟發式評分系統

| 條件 | 分數 | 說明 |
|:---|:---:|:---|
| AI 四連線（勝利） | **+100,000** | 最高優先 |
| 對手四連線（失敗） | **-100,000** | 必須攔截 |
| AI 三連 + 1 空 | +120 | 強威脅 |
| 對手三連 + 1 空 | -150 | 緊急防守（權重較高） |
| AI 二連 + 2 空 | +18 | 佈局建設 |
| 對手二連 + 2 空 | -16 | 輕微關注 |
| 中央欄位 AI 棋子 | +10 | 戰略中央控制 |

### Minimax 演算法特性

| 特性 | 實作方式 |
|:---|:---|
| 🌳 **Alpha-Beta 剪枝** | 修剪不影響最終決策的分支 |
| ⏱️ **時間限制搜尋** | `Date.now() > deadline` 檢查防止行動裝置卡頓 |
| ⚡ **即時捷徑** | 在完整搜尋前先檢查是否有致勝/攔截手 |
| 🎯 **中央優先排序** | 優先評估中央欄位以獲得更好的剪枝效果 |
| 📏 **深度調整分數** | 偏好更快的勝利和更慢的失敗 |

---

## 🎨 佈景主題

五款精心打造的色彩主題，各具獨特風格：

| 主題 | 棋盤 | 棋子 1 | 棋子 2 | 風格 |
|:---|:---|:---|:---|:---|
| 🪵 **經典** | 溫暖木紋棕 | 🔵 海軍藍 | 🟡 黃色 | ☀️ 經典不敗 |
| 🌊 **海洋** | 天空藍 | 🟠 珊瑚 | 🟢 薄荷 | 💎 沉穩療癒 |
| 🍬 **糖果** | 粉紫色 | 🍓 草莓 | 🩵 天空 | 🎀 甜美俏皮 |
| 🌙 **夜色** | 深藍黑 | 💜 紫色 | 🩵 青色 | 🌌 時尚暗色 |
| 🌲 **森林** | 深綠色 | 🟤 赭紅 | 🟡 淺黃 | 🍃 自然質樸 |

> 可在**設定畫面**中切換主題，設定透過 `localStorage` 自動持久保存。  
> 主題顏色定義在 `css/themes/theme-*.css` 的 CSS 自訂屬性中。

---

## 🔊 音效系統

### 🎹 程序化音效 — 零音檔！

所有音效皆透過 **Web Audio API 在執行期合成**：
- ✅ **零音訊檔案** — `assets/audio/` 目錄是空的！
- ✅ **極小專案體積** — 不需下載任何 MP3/WAV/OGG
- ✅ **完全離線** — 不依賴 CDN 或網路

### BGM — 鋼琴旋律

| 曲目 | 節奏 | 風格 |
|:---|:---:|:---|
| 🌅 Morning | 108 BPM | 輕柔、清新 |
| ☀️ Sunny | 116 BPM | 明亮、愉悅 |
| 🎈 Playful | 124 BPM | 活潑、有活力 |
| 🍃 Breeze | 96 BPM | 舒適、放鬆 |

> 每首曲目由 12 個音符頻率定義。使用**三角波 + 正弦波振盪器**搭配指數衰減包絡線合成——產生類鋼琴音色。

### 音效 — 遊戲音效

| 音效 | 觸發時機 | 音調數 |
|:---|:---|:---:|
| 🔽 落子 | 放置棋子 | 2 |
| 🏆 勝利 | 贏得比賽 | 3（上升） |
| 😞 失敗 | 輸掉比賽 | 2（下降） |
| 🤝 平局 | 比賽平手 | 2（相同） |
| 🖱️ 點擊 | 按下按鈕 | 1（高音） |
| ❌ 錯誤 | 無效操作 | 1（低音） |
| 🔀 切換 | 開關切換 | 2（上升） |

### 音量控制

| 控制項 | 範圍 | 說明 |
|:---|:---:|:---|
| 🎵 BGM 音量 | 0% – 200% | 帶安全增益上限（最大 1.6） |
| 🔊 音效音量 | 0% – 100% | 上限增益 1.0 |
| 📢 BGM 增幅 | 0.7x – 2.0x | 遊戲中放大（選單使用 0.72x） |
| 🔇 靜音切換 | 開/關 | 一鍵靜音 |

---

<a id="-多國語言-i18n"></a>

## 🌐 多國語言 (i18n)

| 語言 | 代碼 | 自動偵測 | 翻譯鍵數 | 支援狀態 |
|:---|:---:|:---:|:---:|:---:|
| 🇬🇧 英文 | `en` | `en-*` 瀏覽器 | ~87 | ✅ 完成 |
| 🇯🇵 日文 | `ja` | `ja-*` 瀏覽器 | ~87 | ✅ 完成 |
| 🇹🇼 繁體中文 | `zh-TW` | `zh-*` 瀏覽器 | ~87 | ✅ 完成 |

> **自動偵測**：首次啟動時讀取 `navigator.language`，自動套用對應語言。所有 `zh-*` 對應到 `zh-TW`、`ja-*` 對應到 `ja`，其餘預設 `en`。  
> 切換語言**不需要重新載入頁面**——即時生效。

### 翻譯涵蓋範圍

| 分類 | 範例鍵值 |
|:---|:---|
| 🏠 選單 | 標題、開始遊戲、繼續、遊戲教學、設定 |
| 🎮 遊戲 UI | 玩家標籤、回合指示、AI 思考中 |
| 🤖 AI | 難度名稱 + 描述 |
| 🎨 主題 | 主題名稱 |
| ⚙️ 設定 | 所有標籤、滑桿、開關 |
| 📖 遊戲教學 | 目標、操作、提示、FAQ |
| 🏆 結果 | 勝利、失敗、平局訊息 |
| 📳 通知 | 操作確認訊息 |

---

## ♿ 無障礙功能

| 功能 | 實作方式 |
|:---|:---|
| 🏷️ **ARIA 標籤** | 欄位按鈕有 `aria-label`、開關有 `aria-pressed` |
| 🗣️ **即時區域** | 通知和狀態區域使用 `aria-live` |
| 🪟 **對話框角色** | 彈窗使用 `role="dialog"` + `aria-modal="true"` |
| ⌨️ **鍵盤操作** | Esc 關閉彈窗、自動聚焦對話框 |
| 🎞️ **減少動態** | 尊重 `prefers-reduced-motion` + 設定中的動畫開關 |
| 📳 **觸覺回饋** | 支援裝置上使用 `navigator.vibrate` |

---

<div align="center">

<br>

---

**Made with ❤️ as part of the Games Workshop collection.**

🔴🟡🔴🟡🔴🟡🔴

</div>
