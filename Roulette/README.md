# 🎰 Roulette · 輪盤 · ルーレット

> **Player vs AI roulette, built as a zero-dependency single-page web game.**
> Pure HTML / CSS / vanilla JavaScript — no build step, no backend. Just open `index.html`.

<p align="center">
  <img alt="type" src="https://img.shields.io/badge/type-SPA-blue">
  <img alt="deps" src="https://img.shields.io/badge/dependencies-0-brightgreen">
  <img alt="build" src="https://img.shields.io/badge/build-none-success">
  <img alt="i18n" src="https://img.shields.io/badge/i18n-繁中%20%2F%20EN%20%2F%20日本語-orange">
  <img alt="version" src="https://img.shields.io/badge/version-1.0.0-lightgrey">
</p>

---

## 🌐 Language / 言語 / 語言

| 🇬🇧 English | 🇯🇵 日本語 | 🇹🇼 繁體中文 |
|:---:|:---:|:---:|
| [Jump ↓](#-english) | [移動 ↓](#-日本語) | [前往 ↓](#-繁體中文) |

---

## 🧭 Quick Navigation

| 🚀 Get Started | 🎲 Gameplay | 🛠️ For Developers |
|---|---|---|
| [Quick Start](#-quick-start) | [How to Play](#-how-to-play) | [Architecture](#-architecture--code-tour) |
| [Features](#-features) | [Bet Types & Payouts](#-bet-types--payouts) | [Folder Structure](#-folder-structure) |
| [Controls](#-controls) | [AI Opponent](#-ai-opponent) | [Module Reference](#-module-reference) |

---

<a name="-english"></a>
# 🇬🇧 English

## 🎯 Introduction

**Roulette** is a faithful European / American roulette simulator where you play head-to-head against an **AI opponent**. Place your chips on the felt, spin the wheel, and race the AI to a target balance — across three difficulty levels, five visual themes, three languages, and full local save support.

It is a **pure front-end** application: zero npm packages, zero build tools, and no network requests. Double-click `index.html` and play.

| | |
|---|---|
| 🎰 **Genre** | Casino / Table game (Player vs AI) |
| 🖥️ **Platform** | Desktop & mobile browsers (responsive) |
| 📦 **Stack** | HTML5 · CSS3 · Vanilla JS (ES2020) · Canvas 2D · Web Audio API |
| 🔌 **Dependencies** | **None** |
| 💾 **Save** | Automatic, via `localStorage` |
| 🌍 **Languages** | 繁體中文 · English · 日本語 |

## ✨ Features

| Feature | Description |
|---|---|
| 🎡 **Canvas wheel** | Physically-styled spin animation with rolling steel ball, easing & wobble |
| 🃏 **Full betting table** | SVG felt with inside numbers, columns, dozens, and outside bets |
| 🤖 **AI opponent** | Three difficulty tiers with distinct strategies & "thinking" time |
| 🌍 **3 languages** | Traditional Chinese, English, Japanese — switchable live |
| 🎨 **5 themes** | Classic, Royal, Neon, Rose, Midnight |
| 🔊 **Procedural audio** | BGM + SFX generated live with the Web Audio API (no audio files) |
| 💾 **Auto save / continue** | Game state persisted to `localStorage` after every action |
| 📱 **Responsive (RWD)** | Desktop / tablet / phone layouts |
| 🎆 **Juice** | Flying-chip animation, win particle bursts, toast notifications |
| 📖 **Built-in tutorial** | 6-tab illustrated help with a live payout calculator |

## 🚀 Quick Start

```bash
# 1. Clone or download this folder
# 2. Open the game — pick ONE:

#   a) Simplest: just double-click
index.html

#   b) Or serve it locally (recommended for consistent behavior)
python -m http.server 8000      # then open http://localhost:8000
# or
npx serve .
```

> ✅ No `npm install`, no compilation. Works straight from the file system.

## 🎮 How to Play

The goal is simple: **reach the target balance before the AI does** (and don't go broke).

```
①  Choose chip  →  ②  Click felt to bet  →  ③  SPIN  →  ④  Settle  →  repeat
```

| Step | What you do |
|---|---|
| **1. Start** | Main menu → *Start Game* (or *Continue* to resume a save) |
| **2. Pick a chip** | Choose a denomination from the chip rack ($5 → $1,000) |
| **3. Place bets** | Click a cell on the betting table — each click adds one chip there. Multiple bets allowed |
| **4. Spin** | Press **SPIN**. The AI places its bets, then the wheel spins |
| **5. Settle** | The winning number is highlighted; winnings are paid; round counter advances |
| **6. Win/Lose** | Reach the **target balance** to win — or bankrupt the AI. Drop below $5 and you lose |

**Win / Lose conditions**

| Outcome | Trigger |
|---|---|
| 🏆 You win | Your balance **≥ target**, *or* AI balance drops below `$5` |
| 💀 You lose | Your balance drops below `$5` |

Starting balances and targets depend on difficulty (see [AI Opponent](#-ai-opponent)).

## 🎲 Bet Types & Payouts

Bets are split into **inside bets** (specific numbers) and **outside bets** (broad groups). Payout `X:1` means a winning bet returns your stake **plus** `X×` your stake.

| Bet | Type | Covers | Payout | Win chance (Euro) |
|---|---|---:|:---:|---:|
| 🎯 Straight (single number) | Inside | 1 | **35:1** | 2.70% |
| 🟥 Red / ⬛ Black | Outside | 18 | 1:1 | 48.65% |
| 🔢 Odd / Even | Outside | 18 | 1:1 | 48.65% |
| ⬇️ Low (1–18) / ⬆️ High (19–36) | Outside | 18 | 1:1 | 48.65% |
| 📦 Dozen (1st/2nd/3rd 12) | Outside | 12 | 2:1 | 32.43% |
| 📊 Column (top/middle/bottom) | Outside | 12 | 2:1 | 32.43% |

> ℹ️ The in-game **Help → Payout** tab includes a live calculator and also documents classic ratios (Split 17:1, Street 11:1, Corner 8:1, Six-line 5:1) for reference.

**European vs American wheel**

| | 🇪🇺 European | 🇺🇸 American |
|---|---|---|
| Pockets | 37 (`0`–`36`) | 38 (`0`, `00`, `1`–`36`) |
| House edge | Lower (~2.7%) | Higher (~5.26%) |
| Effect | Better odds on outside bets | One extra green pocket → riskier |

Wheel type is selectable in **Settings**.

## 🤖 AI Opponent

The AI bets on its own each round after a short "thinking" delay, using history-aware strategies. Difficulty changes starting money, target, aggressiveness, and intelligence.

| Difficulty | You start | AI starts | Target | AI bet size | AI behaviour |
|---|---:|---:|---:|---:|---|
| 🟢 **Easy** | $5,000 | $2,000 | $10,000 | ~5% / round | Single random outside bet |
| 🟡 **Normal** | $3,000 | $3,000 | $8,000 | ~8% / round | History-based outside bet + occasional dozen/column |
| 🔴 **Hard** | $2,000 | $5,000 | $6,000 | ~12% / round | Diversified bets, "hot number" tracking, Martingale-style doubling after losses |

**How the AI "thinks":**
- 📈 **History reading** — counts recent reds/odds to bet the opposite (gambler's-fallacy style).
- 🔥 **Hot numbers** (Hard) — tracks the most frequent recent result and bets it straight.
- ♻️ **Martingale** (Hard) — has a chance to double its stake after a losing round.
- ⏱️ **Think time** — a progress bar simulates deliberation (longer on higher difficulty).

## 🎛️ Controls

| Action | How |
|---|---|
| Select chip | Click a chip in the rack |
| Add bet | Click a table cell (keyboard: focus + `Enter` / `Space`) |
| Clear all bets | **Clear** button (refunds your staked chips) |
| Spin | **SPIN** button |
| Mute / unmute | 🔊 quick-mute button (menu & in-game) |
| Save manually | **Save** button (auto-save also runs constantly) |
| Settings / Help | Buttons on the menu and in-game header |

## 🎨 Settings

| Setting | Options |
|---|---|
| 🌐 Language | 繁體中文 · English · 日本語 |
| 🎵 BGM & SFX | On/off toggles + independent volume sliders |
| 🎨 Theme | Classic · Royal · Neon · Rose · Midnight |
| ⚡ Animation speed | Slow · Normal · Fast *(visual only — does not affect odds or payouts)* |
| 🎡 Wheel type | European · American |
| 🎚️ Difficulty | Easy · Normal · Hard |

---

## 🏗️ Architecture & Code Tour

A small, layered, **dependency-free** architecture. Everything is attached to a single global namespace (`window.Roulette`) and wired together by load order in `index.html` — no module bundler.

```
┌─────────────────────────────────────────────────────────┐
│                       index.html                         │
│        (loads scripts in dependency order, in <body>)    │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐   orchestrates everything   ┌──────────────┐
│  main.js     │ ─────────────────────────►  │  GameApp.js  │  ← controller
└──────────────┘                             └──────┬───────┘
                                                    │ uses
   ┌────────────────────────────────────────────────┼──────────────────────────┐
   ▼                ▼                ▼               ▼              ▼            ▼
 Core            Game logic       UI              i18n          Audio       Data
 GameState       RouletteWheel    templates       i18n          AudioMgr    constants
 SaveManager     BettingBoard     ToastNotif      translations
 SettingsMgr     BettingLogic     ParticleCtrl
 utils           AIPlayer         helpDiagrams
```

**Design principles**

- 🧱 **Layered IIFEs** — each file is an IIFE that reads helpers from and writes exports back to `window.Roulette`. No globals leak.
- 🎮 **One controller** — `GameApp` owns the game loop, routing, DOM caching, and event binding. The rest are focused, single-responsibility units.
- 🔢 **Pure logic isolated** — settlement math (`BettingLogic`) and AI decisions (`AIPlayer`) are pure-ish and easy to reason about/test.
- 🎨 **Render from state** — UI is re-rendered from a single `state` object (`createGameState`) after each action.

## 📁 Folder Structure

```
Roulette/
├── index.html              # Entry point — loads all scripts in order
├── roulette-spec.md        # Full design specification (zh-TW)
├── css/
│   ├── app.css             # @imports all stylesheets below
│   ├── base/               # reset.css · variables.css (theme tokens)
│   ├── layout/             # shell.css · responsive.css (RWD)
│   ├── components/         # buttons.css · modal-toast.css
│   └── screens/            # main-menu · game · settings · help
└── js/
    ├── main.js             # Bootstraps the app on DOMContentLoaded
    ├── data/
    │   └── constants.js    # Wheel orders, chip values, difficulty, themes
    ├── core/
    │   ├── utils.js        # DOM, math, color, storage helpers
    │   ├── GameState.js    # Builds the central game-state object
    │   ├── SaveManager.js  # localStorage save / load / hasSave
    │   └── SettingsManager.js
    ├── game/
    │   ├── RouletteWheel.js # Canvas wheel rendering + spin physics
    │   ├── BettingBoard.js  # SVG betting table + bet definitions
    │   ├── BettingLogic.js  # Settlement / payout calculation
    │   └── AIPlayer.js      # AI betting strategy
    ├── i18n/
    │   ├── i18n.js          # Translation engine (t(), setLang, updateDom)
    │   └── translations.js  # zh-TW / en / ja string tables
    ├── audio/
    │   └── AudioManager.js  # Web Audio BGM + SFX (no audio files)
    ├── ui/
    │   ├── templates.js     # App shell / screen HTML
    │   ├── ToastNotification.js
    │   ├── ParticleController.js  # Win confetti bursts
    │   └── helpDiagrams.js  # SVG diagrams for the help screen
    └── app/
        └── GameApp.js       # Main controller / game loop
```

## 📚 Module Reference

Modules grouped by responsibility. (~2,470 lines JS · ~1,484 lines CSS.)

### 🧩 Core

| File | Responsibility |
|---|---|
| `data/constants.js` | Single source of truth: wheel orders (EU/US), red numbers, chip values & colors, default settings, difficulty configs, theme metadata, help tabs |
| `core/utils.js` | Helpers: `$`/`$all` DOM queries, `clamp`, `randomPick`, `formatMoney`, `getResultColor`, `getWheelOrder`, safe `localStorage` wrappers |
| `core/GameState.js` | `createGameState(settings)` → the central state object (round, player, AI, wheel, history) |
| `core/SaveManager.js` | Versioned save/load to `localStorage` (`roulette_save_v1`) |
| `core/SettingsManager.js` | Loads/persists settings, applies theme & language |

### 🎲 Game Logic

| File | Responsibility |
|---|---|
| `game/RouletteWheel.js` | Canvas 2D rendering of the wheel + ball; spin animation with cubic easing, wobble, and ball-radius falloff; resolves the ball to the result pocket |
| `game/BettingBoard.js` | Builds bet definitions per wheel type; renders the SVG felt; handles click/keyboard bet placement; draws chip tokens & highlights winners |
| `game/BettingLogic.js` | `calculateSettlement(bets, result)` — pure payout math; `createBet`, `covers`, `sumBets`, `formatCompact` |
| `game/AIPlayer.js` | `decideBets(state, board)` — difficulty-driven strategy: history reading, hot numbers, Martingale doubling |

### 🖼️ UI & Presentation

| File | Responsibility |
|---|---|
| `ui/templates.js` | HTML for the app shell and all four screens |
| `ui/ToastNotification.js` | Transient toast messages (success/warning/info) |
| `ui/ParticleController.js` | Canvas particle confetti on wins |
| `ui/helpDiagrams.js` | SVG arc/diagram helpers for the tutorial |

### 🌍 i18n & Audio

| File | Responsibility |
|---|---|
| `i18n/i18n.js` | `t(key, params)` lookup with `{param}` interpolation, language switching, `data-i18n` DOM updates; falls back to zh-TW |
| `i18n/translations.js` | String tables for `zh-TW`, `en`, `ja` |
| `audio/AudioManager.js` | Procedural Web Audio: looping BGM sequence + SFX (`click`, `chip`, `spinStart`, `drop`, `win`, `lose`) — all synthesized, no asset files |

### 🎬 App

| File | Responsibility |
|---|---|
| `app/GameApp.js` | The controller. Owns DOM cache, event binding, screen routing, the spin/settle game loop, AI orchestration, rendering, save hooks, and the help tabs (goal/wheel/bets/payout/ai/controls) |

> 📄 For exhaustive details (screen specs, design tokens, RWD breakpoints, performance notes), see **[`roulette-spec.md`](./roulette-spec.md)**.

## 🌐 Browser Support

Modern evergreen browsers with **Canvas 2D**, **Web Audio API**, and **`localStorage`**: Chrome, Edge, Firefox, Safari (desktop & mobile). Audio starts after the first user interaction (browser autoplay policy). If `localStorage` is unavailable, the game still runs — it just can't save.

---
---

<a name="-日本語"></a>
# 🇯🇵 日本語

## 🎯 はじめに

**Roulette（ルーレット）** は、ヨーロピアン／アメリカン式ルーレットを忠実に再現したシミュレーターで、**AI 対戦相手**と一対一で勝負します。フェルトにチップを置き、ホイールを回し、目標残高を AI より先に達成しましょう。難易度 3 段階、テーマ 5 種、対応言語 3 つ、ローカルセーブ完備です。

**完全フロントエンド**製です。npm パッケージ・ビルドツール・ネットワーク通信は一切なし。`index.html` をダブルクリックするだけで遊べます。

| | |
|---|---|
| 🎰 **ジャンル** | カジノ／テーブルゲーム（プレイヤー vs AI） |
| 🖥️ **対応環境** | PC・モバイルブラウザ（レスポンシブ） |
| 📦 **技術** | HTML5 · CSS3 · 素の JS (ES2020) · Canvas 2D · Web Audio API |
| 🔌 **依存** | **なし** |
| 💾 **セーブ** | `localStorage` による自動保存 |
| 🌍 **言語** | 繁体字中国語 · 英語 · 日本語 |

## ✨ 特徴

| 機能 | 説明 |
|---|---|
| 🎡 **Canvas ホイール** | 物理風の回転アニメーション、転がる球、イージングと揺れ |
| 🃏 **完全なベット台** | SVG 製フェルト：番号・コラム・ダズン・外側ベット |
| 🤖 **AI 対戦相手** | 戦略の異なる 3 段階の難易度＋「思考」時間 |
| 🌍 **3 言語** | 繁体字中国語・英語・日本語をリアルタイム切替 |
| 🎨 **5 テーマ** | Classic・Royal・Neon・Rose・Midnight |
| 🔊 **手続き型サウンド** | Web Audio API で生成する BGM・効果音（音声ファイル不要） |
| 💾 **自動セーブ／続きから** | 操作のたびに `localStorage` へ保存 |
| 📱 **レスポンシブ (RWD)** | PC／タブレット／スマホ対応 |
| 🎆 **演出** | 飛ぶチップ、勝利時のパーティクル、トースト通知 |
| 📖 **内蔵チュートリアル** | 6 タブの図解ヘルプ＋配当計算ツール |

## 🚀 クイックスタート

```bash
# 1. このフォルダをクローンまたはダウンロード
# 2. 起動 — どちらか一方:

#   a) 最も簡単: ダブルクリック
index.html

#   b) ローカルサーバーで配信（推奨）
python -m http.server 8000      # http://localhost:8000 を開く
# または
npx serve .
```

> ✅ `npm install` もコンパイルも不要。ファイルから直接動作します。

## 🎮 遊び方

目的はシンプル。**AI より先に目標残高に到達する**（そして破産しない）こと。

```
①  チップ選択  →  ②  台をクリックしてベット  →  ③  SPIN  →  ④  精算  →  繰り返し
```

| 手順 | 操作 |
|---|---|
| **1. 開始** | メインメニュー →「ゲーム開始」（「続きから」でセーブ再開） |
| **2. チップ選択** | チップラック（$5〜$1,000）から額面を選ぶ |
| **3. ベット** | 台のマスをクリック。1 クリックでチップ 1 枚。複数ベット可 |
| **4. スピン** | **SPIN** を押す。AI がベットし、ホイールが回転 |
| **5. 精算** | 当選番号がハイライトされ、配当が支払われ、ラウンドが進む |
| **6. 勝敗** | **目標残高**到達で勝利。AI を破産させても勝ち。$5 未満で敗北 |

**勝敗条件**

| 結果 | 条件 |
|---|---|
| 🏆 勝利 | 残高が**目標以上**、または AI 残高が `$5` 未満 |
| 💀 敗北 | 自分の残高が `$5` 未満 |

開始残高と目標は難易度で変わります（[AI 対戦相手](#-ai-対戦相手)参照）。

## 🎲 ベットの種類と配当

ベットは**インサイド**（特定の番号）と**アウトサイド**（広いグループ）に分かれます。配当 `X:1` は、当選時に賭け金に加えて賭け金の `X 倍` が戻ることを意味します。

| ベット | 種類 | カバー | 配当 | 的中率(欧) |
|---|---|---:|:---:|---:|
| 🎯 ストレート（単一番号） | インサイド | 1 | **35:1** | 2.70% |
| 🟥 赤 / ⬛ 黒 | アウトサイド | 18 | 1:1 | 48.65% |
| 🔢 奇数 / 偶数 | アウトサイド | 18 | 1:1 | 48.65% |
| ⬇️ ロー(1–18) / ⬆️ ハイ(19–36) | アウトサイド | 18 | 1:1 | 48.65% |
| 📦 ダズン（1st/2nd/3rd 12） | アウトサイド | 12 | 2:1 | 32.43% |
| 📊 コラム（上/中/下段） | アウトサイド | 12 | 2:1 | 32.43% |

> ℹ️ ゲーム内 **ヘルプ → 配当** タブには計算ツールがあり、古典的な配当（スプリット 17:1、ストリート 11:1、コーナー 8:1、シックスライン 5:1）も参考表示されます。

**ヨーロピアン式 vs アメリカン式**

| | 🇪🇺 ヨーロピアン | 🇺🇸 アメリカン |
|---|---|---|
| ポケット数 | 37（`0`–`36`） | 38（`0`, `00`, `1`–`36`） |
| ハウスエッジ | 低い（約 2.7%） | 高い（約 5.26%） |
| 影響 | 外側ベットが有利 | 緑が 1 つ増え、リスク増 |

ホイールの種類は**設定**で選べます。

## 🤖 AI 対戦相手

AI は毎ラウンド、短い「思考」時間の後に、履歴を踏まえた戦略で自らベットします。難易度により初期資金・目標・積極性・賢さが変わります。

| 難易度 | 自分の初期 | AI 初期 | 目標 | AI ベット額 | AI の挙動 |
|---|---:|---:|---:|---:|---|
| 🟢 **イージー** | $5,000 | $2,000 | $10,000 | 約 5%/回 | ランダムな外側ベット 1 つ |
| 🟡 **ノーマル** | $3,000 | $3,000 | $8,000 | 約 8%/回 | 履歴ベース外側＋たまにダズン/コラム |
| 🔴 **ハード** | $2,000 | $5,000 | $6,000 | 約 12%/回 | 分散ベット、ホットナンバー追跡、敗北後のマーチンゲール風倍賭け |

**AI の「思考」内容**
- 📈 **履歴読み** — 直近の赤/奇数を数え、逆側に賭ける（ギャンブラーの誤謬風）。
- 🔥 **ホットナンバー**（ハード）— 直近で最頻の番号をストレートで狙う。
- ♻️ **マーチンゲール**（ハード）— 負けた後、一定確率で賭け金を倍に。
- ⏱️ **思考時間** — プログレスバーで熟考を演出（難易度が高いほど長い）。

## 🎛️ 操作

| 操作 | 方法 |
|---|---|
| チップ選択 | ラックのチップをクリック |
| ベット追加 | 台のマスをクリック（キーボード: フォーカス＋`Enter`/`Space`） |
| 全ベット取消 | **クリア**ボタン（賭け金を返却） |
| スピン | **SPIN** ボタン |
| ミュート切替 | 🔊 クイックミュート（メニュー・ゲーム中） |
| 手動セーブ | **セーブ**ボタン（自動保存も常時実行） |
| 設定／ヘルプ | メニューおよびゲーム内ヘッダーのボタン |

## 🎨 設定

| 項目 | 選択肢 |
|---|---|
| 🌐 言語 | 繁体字中国語 · 英語 · 日本語 |
| 🎵 BGM・効果音 | オン/オフ＋個別の音量スライダー |
| 🎨 テーマ | Classic · Royal · Neon · Rose · Midnight |
| ⚡ アニメ速度 | 遅い · 普通 · 速い *(演出のみ。確率・配当に影響なし)* |
| 🎡 ホイール種類 | ヨーロピアン · アメリカン |
| 🎚️ 難易度 | イージー · ノーマル · ハード |

> 🛠️ 技術的な内部構造（アーキテクチャ、フォルダ構成、モジュール一覧）は[英語セクション](#%EF%B8%8F-architecture--code-tour)および **[`roulette-spec.md`](./roulette-spec.md)** を参照してください。

---
---

<a name="-繁體中文"></a>
# 🇹🇼 繁體中文

## 🎯 遊戲介紹

**Roulette（輪盤）** 是一款忠實還原歐式／美式輪盤的模擬遊戲，讓你與 **AI 對手**一對一對戰。在賭桌上放下籌碼、轉動輪盤，搶在 AI 之前達成目標餘額。內含三種難度、五種視覺主題、三種語言，並支援完整的本地存檔。

本作為**純前端**應用：零 npm 套件、零建置工具、零網路請求。直接雙擊 `index.html` 即可遊玩。

| | |
|---|---|
| 🎰 **類型** | 賭場／桌遊（玩家 vs AI） |
| 🖥️ **平台** | 桌面與行動裝置瀏覽器（響應式） |
| 📦 **技術** | HTML5 · CSS3 · 原生 JS (ES2020) · Canvas 2D · Web Audio API |
| 🔌 **依賴** | **無** |
| 💾 **存檔** | 透過 `localStorage` 自動存檔 |
| 🌍 **語言** | 繁體中文 · 英文 · 日文 |

## ✨ 功能特色

| 功能 | 說明 |
|---|---|
| 🎡 **Canvas 輪盤** | 擬真旋轉動畫、滾動鋼球、緩動與晃動效果 |
| 🃏 **完整下注桌** | SVG 賭桌：號碼、行注、打注與外圍注 |
| 🤖 **AI 對手** | 三種難度，各有不同策略與「思考」時間 |
| 🌍 **三種語言** | 繁中、英文、日文即時切換 |
| 🎨 **五種主題** | Classic、Royal、Neon、Rose、Midnight |
| 🔊 **程序化音效** | 以 Web Audio API 即時生成 BGM 與音效（無音檔） |
| 💾 **自動存檔／續玩** | 每次操作後寫入 `localStorage` |
| 📱 **響應式 (RWD)** | 桌面／平板／手機三段佈局 |
| 🎆 **動態演出** | 飛行籌碼、勝利粒子爆發、Toast 提示 |
| 📖 **內建教學** | 六分頁圖文說明＋即時賠率計算器 |

## 🚀 快速開始

```bash
# 1. 複製或下載此資料夾
# 2. 啟動遊戲 — 擇一即可:

#   a) 最簡單: 直接雙擊
index.html

#   b) 或在本地架站（建議，行為較一致）
python -m http.server 8000      # 開啟 http://localhost:8000
# 或
npx serve .
```

> ✅ 無需 `npm install`、無需編譯，直接從檔案系統執行即可。

## 🎮 遊戲玩法

目標很單純：**搶在 AI 之前達成目標餘額**（且別破產）。

```
①  選籌碼  →  ②  點賭桌下注  →  ③  SPIN  →  ④  結算  →  重複
```

| 步驟 | 操作 |
|---|---|
| **1. 開始** | 主選單 →「開始遊戲」（或「繼續遊戲」載入存檔） |
| **2. 選籌碼** | 從籌碼架選擇面額（$5〜$1,000） |
| **3. 下注** | 點擊賭桌格子，每點一下加一枚籌碼。可同時下多注 |
| **4. 旋轉** | 按 **SPIN**。AI 完成下注後，輪盤開始旋轉 |
| **5. 結算** | 中獎號碼高亮、派發彩金、回合數遞增 |
| **6. 勝負** | 達到**目標餘額**即勝；讓 AI 破產也算贏；自身低於 $5 則輸 |

**勝負條件**

| 結果 | 條件 |
|---|---|
| 🏆 獲勝 | 餘額 **≥ 目標**，或 AI 餘額低於 `$5` |
| 💀 落敗 | 自身餘額低於 `$5` |

起始餘額與目標依難度而定（見 [AI 對手](#-ai-對手)）。

## 🎲 下注類型與賠率

下注分為**內圍注**（特定號碼）與**外圍注**（大範圍群組）。賠率 `X:1` 表示中獎時退回本金**外加**本金的 `X 倍`。

| 注別 | 類型 | 涵蓋 | 賠率 | 勝率(歐) |
|---|---|---:|:---:|---:|
| 🎯 單號（直注） | 內圍 | 1 | **35:1** | 2.70% |
| 🟥 紅 / ⬛ 黑 | 外圍 | 18 | 1:1 | 48.65% |
| 🔢 單 / 雙 | 外圍 | 18 | 1:1 | 48.65% |
| ⬇️ 小(1–18) / ⬆️ 大(19–36) | 外圍 | 18 | 1:1 | 48.65% |
| 📦 打注（第 1/2/3 個 12） | 外圍 | 12 | 2:1 | 32.43% |
| 📊 行注（上/中/下行） | 外圍 | 12 | 2:1 | 32.43% |

> ℹ️ 遊戲內 **說明 → 賠率** 分頁提供即時計算器，並列出經典賠率（分注 17:1、街注 11:1、角注 8:1、六線注 5:1）供參考。

**歐式 vs 美式輪盤**

| | 🇪🇺 歐式 | 🇺🇸 美式 |
|---|---|---|
| 號碼格 | 37（`0`–`36`） | 38（`0`、`00`、`1`–`36`） |
| 莊家優勢 | 較低（約 2.7%） | 較高（約 5.26%） |
| 影響 | 外圍注勝率較好 | 多一個綠格，風險較高 |

輪盤類型可於**設定**中選擇。

## 🤖 AI 對手

AI 每回合會在短暫「思考」後，依據歷史策略自行下注。難度會改變起始資金、目標、積極度與聰明程度。

| 難度 | 你的起始 | AI 起始 | 目標 | AI 注額 | AI 行為 |
|---|---:|---:|---:|---:|---|
| 🟢 **簡單** | $5,000 | $2,000 | $10,000 | 約 5%/回 | 單一隨機外圍注 |
| 🟡 **普通** | $3,000 | $3,000 | $8,000 | 約 8%/回 | 依歷史的外圍注＋偶爾打注/行注 |
| 🔴 **困難** | $2,000 | $5,000 | $6,000 | 約 12%/回 | 分散下注、追蹤熱門號碼、敗後類馬丁格爾加倍 |

**AI 如何「思考」**
- 📈 **讀取歷史** — 統計近期紅/單數，反向下注（賭徒謬誤式）。
- 🔥 **熱門號碼**（困難）— 追蹤近期最常出現的號碼並直注。
- ♻️ **馬丁格爾**（困難）— 輸一回合後，有機率將注額加倍。
- ⏱️ **思考時間** — 以進度條模擬思考（難度越高越久）。

## 🎛️ 操作說明

| 操作 | 方式 |
|---|---|
| 選擇籌碼 | 點擊籌碼架上的籌碼 |
| 新增下注 | 點擊賭桌格子（鍵盤：聚焦後按 `Enter`／`Space`） |
| 清除所有注 | **清除**按鈕（退回已下注籌碼） |
| 旋轉 | **SPIN** 按鈕 |
| 靜音切換 | 🔊 快速靜音鈕（選單與遊戲中皆有） |
| 手動存檔 | **儲存**按鈕（同時持續自動存檔） |
| 設定／說明 | 選單與遊戲內標題列的按鈕 |

## 🎨 設定選項

| 設定 | 選項 |
|---|---|
| 🌐 語言 | 繁體中文 · 英文 · 日文 |
| 🎵 BGM 與音效 | 開／關＋獨立音量滑桿 |
| 🎨 主題 | Classic · Royal · Neon · Rose · Midnight |
| ⚡ 動畫速度 | 慢 · 普通 · 快 *(僅影響演出，不改變機率與派彩)* |
| 🎡 輪盤類型 | 歐式 · 美式 |
| 🎚️ 難度 | 簡單 · 普通 · 困難 |

## 🏗️ 程式架構

小巧、分層、**零依賴**。所有模組都掛在單一全域命名空間（`window.Roulette`），並由 `index.html` 的載入順序串接 — 不使用任何打包工具。

```
index.html  →  載入所有腳本（依相依順序）
     │
   main.js   →   GameApp.js（主控制器）
                      │ 使用
   ┌──────────┬───────┼────────┬─────────┬────────┐
  核心        遊戲邏輯  介面      多語系     音效      資料
  GameState   Wheel    templates  i18n      AudioMgr  constants
  SaveManager Board    Toast      translations
  Settings    Logic    Particle
  utils       AIPlayer helpDiagrams
```

**設計原則**
- 🧱 **分層 IIFE** — 每個檔案皆為 IIFE，從 `window.Roulette` 讀取依賴並寫回匯出，不污染全域。
- 🎮 **單一控制器** — `GameApp` 負責遊戲迴圈、路由、DOM 快取與事件綁定；其餘皆為單一職責模組。
- 🔢 **純邏輯獨立** — 結算運算（`BettingLogic`）與 AI 決策（`AIPlayer`）易於理解與測試。
- 🎨 **依狀態渲染** — 每次操作後，UI 皆依單一 `state` 物件重新渲染。

## 📁 資料夾結構

```
Roulette/
├── index.html              # 入口；依序載入所有腳本
├── roulette-spec.md        # 完整設計規格書（繁中）
├── css/
│   ├── app.css             # @import 以下所有樣式
│   ├── base/               # reset.css · variables.css（主題變數）
│   ├── layout/             # shell.css · responsive.css（RWD）
│   ├── components/         # buttons.css · modal-toast.css
│   └── screens/            # main-menu · game · settings · help
└── js/
    ├── main.js             # DOMContentLoaded 時啟動
    ├── data/constants.js   # 輪盤順序、籌碼、難度、主題
    ├── core/               # utils · GameState · SaveManager · SettingsManager
    ├── game/               # RouletteWheel · BettingBoard · BettingLogic · AIPlayer
    ├── i18n/               # i18n（引擎）· translations（zh-TW/en/ja）
    ├── audio/AudioManager.js  # Web Audio BGM 與音效（無音檔）
    ├── ui/                 # templates · ToastNotification · ParticleController · helpDiagrams
    └── app/GameApp.js      # 主控制器／遊戲迴圈
```

## 📚 模組分類

依職責分組（JS 約 2,470 行 · CSS 約 1,484 行）。

### 🧩 核心 Core

| 檔案 | 職責 |
|---|---|
| `data/constants.js` | 單一事實來源：輪盤順序（歐/美）、紅色號碼、籌碼面額與顏色、預設設定、難度設定、主題、說明分頁 |
| `core/utils.js` | 工具：`$`/`$all`、`clamp`、`randomPick`、`formatMoney`、`getResultColor`、`getWheelOrder`、安全的 `localStorage` 包裝 |
| `core/GameState.js` | `createGameState(settings)` 產生中央狀態物件（回合、玩家、AI、輪盤、歷史） |
| `core/SaveManager.js` | 版本化存／讀檔至 `localStorage`（`roulette_save_v1`） |
| `core/SettingsManager.js` | 載入／儲存設定，套用主題與語言 |

### 🎲 遊戲邏輯 Game Logic

| 檔案 | 職責 |
|---|---|
| `game/RouletteWheel.js` | Canvas 2D 繪製輪盤與鋼球；三次方緩動、晃動與球半徑收斂的旋轉動畫；將球定位至結果格 |
| `game/BettingBoard.js` | 依輪盤類型建立注別定義；渲染 SVG 賭桌；處理點擊／鍵盤下注；繪製籌碼與中獎高亮 |
| `game/BettingLogic.js` | `calculateSettlement(bets, result)` 純派彩運算；`createBet`、`covers`、`sumBets`、`formatCompact` |
| `game/AIPlayer.js` | `decideBets(state, board)` 依難度的策略：讀歷史、熱門號碼、馬丁格爾加倍 |

### 🖼️ 介面與呈現 UI

| 檔案 | 職責 |
|---|---|
| `ui/templates.js` | App 外殼與四個畫面的 HTML |
| `ui/ToastNotification.js` | 短暫提示訊息（成功／警告／資訊） |
| `ui/ParticleController.js` | 勝利時的 Canvas 粒子彩帶 |
| `ui/helpDiagrams.js` | 教學用的 SVG 弧線／圖示工具 |

### 🌍 多語系與音效

| 檔案 | 職責 |
|---|---|
| `i18n/i18n.js` | `t(key, params)` 查詢＋`{param}` 插值、語言切換、`data-i18n` DOM 更新；預設回退 zh-TW |
| `i18n/translations.js` | `zh-TW`、`en`、`ja` 字串表 |
| `audio/AudioManager.js` | 程序化 Web Audio：循環 BGM＋音效（`click`、`chip`、`spinStart`、`drop`、`win`、`lose`），全部即時合成、無音檔 |

### 🎬 應用 App

| 檔案 | 職責 |
|---|---|
| `app/GameApp.js` | 主控制器：DOM 快取、事件綁定、畫面路由、旋轉/結算遊戲迴圈、AI 調度、渲染、存檔掛勾，以及說明分頁（目標/輪盤/下注/賠率/AI/操作） |

> 📄 完整細節（畫面規格、設計權杖、RWD 斷點、效能規範）請見 **[`roulette-spec.md`](./roulette-spec.md)**。

## 🌐 瀏覽器支援

支援具備 **Canvas 2D**、**Web Audio API** 與 **`localStorage`** 的現代瀏覽器：Chrome、Edge、Firefox、Safari（桌面與行動）。音效會在使用者首次互動後啟動（瀏覽器自動播放政策）。若 `localStorage` 不可用，遊戲仍可遊玩，只是無法存檔。

---

<p align="center">
  <sub>🎰 Roulette · Player vs AI · Pure front-end, zero dependencies · 繁中 / EN / 日本語</sub>
</p>
