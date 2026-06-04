# TETRIS — Web Edition

**Language / 言語 / 語言：**
[English](#-english) | [日本語](#-日本語) | [中文](#-中文)

---

<br>

# 🇬🇧 English

## Table of Contents
- [Game Overview](#game-overview)
- [Features](#features)
- [How to Play](#how-to-play)
- [Controls](#controls)
- [Scoring System](#scoring-system)
- [Level & Speed](#level--speed)
- [Settings](#settings)
- [File Structure](#file-structure)
- [Module Reference](#module-reference)
- [Tech Stack](#tech-stack)
- [Browser Compatibility](#browser-compatibility)

---

## Game Overview

A fully-featured, browser-based Tetris game built with **pure HTML5 / CSS3 / JavaScript (ES6+)** — no frameworks, no build step. Open `index.html` and play immediately.

The game follows standard Tetris rules: rotate and stack falling pieces to fill complete horizontal lines. Cleared lines score points, and the game speeds up every 10 lines until Level 20.

---

## Features

| Category | Details |
|---|---|
| **Core Gameplay** | 7-bag randomiser, 7 standard Tetrominoes, Ghost Piece, Hold, 3-piece Next Queue |
| **Rotation** | Super Rotation System (SRS) with full Wall Kick tables for all piece types |
| **Scoring** | Line clears × level, T-Spin bonus (3×), Back-to-Back 1.5×, Combo chain, Soft/Hard Drop points |
| **Levels** | 20 levels — level up every 10 lines cleared |
| **Lock Delay** | 0.5 s with up to 15 move/rotate resets per piece |
| **Audio** | Synthesised BGM + 18 SFX via Web Audio API (no audio files required) |
| **Visual FX** | Clear flash, lock flash, Hard Drop trail, Level Up bounce, Game Over grey-fill animation |
| **Floating Text** | TETRIS! / T-SPIN / COMBO / BACK-TO-BACK labels fly onto screen |
| **Screens** | Main Menu · Game · Pause Modal · Game Over Modal · High Scores · Settings · Help |
| **Storage** | Top-10 leaderboard + all settings persisted in `localStorage` |
| **Responsive** | Three-column desktop layout; single-column mobile layout with virtual D-pad |
| **Accessibility** | Virtual buttons are min 48 × 48 px; auto-pause on tab switch |

---

## How to Play

1. Open `index.html` in any modern browser.
2. Click or press any key — BGM starts on first interaction (browser autoplay policy).
3. Press **▶ Start** on the main menu.
4. Stack Tetrominoes to fill complete rows; full rows disappear and score is awarded.
5. The game ends when a new piece cannot spawn (**Block Out**).

---

## Controls

### Keyboard

| Key | Action |
|---|---|
| `← / A` | Move left |
| `→ / D` | Move right |
| `↓ / S` | Soft Drop (20× speed) |
| `↑ / W / X` | Rotate clockwise |
| `Z / Ctrl` | Rotate counter-clockwise |
| `Space` | Hard Drop (instant) |
| `C / Shift` | Hold piece |
| `P / Esc` | Pause / Resume |
| `R` | Restart (with confirm) |

### DAS / ARR Settings (adjustable in Settings)

| Parameter | Default | Range |
|---|---|---|
| DAS — delay before auto-repeat | 167 ms | 50–300 ms |
| ARR — repeat interval | 33 ms | 0–100 ms |

### Mobile Virtual Buttons

Touch controls appear below the board on small screens. All buttons support DAS/ARR long-press.

| Button | Action |
|---|---|
| ↑ | Rotate CW |
| ← / → | Move left / right |
| ↓ | Soft Drop |
| HOLD | Hold piece |
| DROP | Hard Drop |
| ⏸ | Pause |

---

## Scoring System

### Line Clears

| Lines Cleared | Name | Base Score | Formula |
|---|---|---|---|
| 1 | Single | 100 | 100 × Level |
| 2 | Double | 300 | 300 × Level |
| 3 | Triple | 500 | 500 × Level |
| 4 | **Tetris** | 800 | 800 × Level |

### T-Spin Bonus

| Lines Cleared | Name | Base Score | Formula |
|---|---|---|---|
| 0 | T-Spin | 400 | 400 × Level |
| 1 | T-Spin Single | 800 | 800 × Level |
| 2 | T-Spin Double | 1200 | 1200 × Level |
| 3 | T-Spin Triple | 1600 | 1600 × Level |

### Special Bonuses

| Bonus | Condition | Points |
|---|---|---|
| **Back-to-Back** | Consecutive Tetris or T-Spin (no plain clear in between) | ×1.5 multiplier |
| **Combo** | Each successive clear without a gap | 50 × combo × Level |
| **Soft Drop** | Per cell dropped | +1 pt |
| **Hard Drop** | Per cell dropped | +2 pt |

---

## Level & Speed

Level increases every **10 lines**. Maximum level: **20**.

| Level | Drop Interval | Level | Drop Interval |
|---|---|---|---|
| 1 | 1.000 s | 11 | 0.043 s |
| 2 | 0.793 s | 12 | 0.028 s |
| 3 | 0.618 s | 13 | 0.018 s |
| 4 | 0.473 s | 14 | 0.011 s |
| 5 | 0.355 s | 15 | 0.007 s |
| 6 | 0.262 s | 16–20 | 0.005 s |
| 7 | 0.190 s | | |
| 8 | 0.135 s | | |
| 9 | 0.094 s | | |
| 10 | 0.064 s | | |

> BGM tempo increases at Level 15.

---

## Settings

| Option | Type | Default | Range |
|---|---|---|---|
| BGM Volume | Slider | 60% | 0–100% |
| SFX Volume | Slider | 80% | 0–100% |
| BGM On/Off | Toggle | ON | — |
| SFX On/Off | Toggle | ON | — |
| Ghost Piece | Toggle | ON | — |
| DAS Delay | Slider | 167 ms | 50–300 ms |
| ARR Rate | Slider | 33 ms | 0–100 ms |

---

## File Structure

```
Tetris/
├── index.html          Entry point — all screens and modals
├── css/
│   ├── main.css        Global reset, fonts, layout, colour variables
│   ├── menu.css        Main menu + falling-block background animation
│   ├── game.css        Game layout, side panels, mobile controls, effect overlays
│   └── modal.css       Pause / Game Over / Settings / Help panels
└── js/
    ├── main.js         Bootstrap, screen routing, event wiring
    ├── game.js         Game loop, state machine, gravity, lock delay
    ├── board.js        Grid state, collision, line clear, T-Spin, ghost
    ├── tetromino.js    Piece definitions, SRS wall-kick tables, 7-bag randomiser
    ├── scoring.js      Score calculation, level progression, speed table
    ├── renderer.js     Canvas 2D rendering — board, pieces, ghost, animations
    ├── input.js        Keyboard DAS/ARR handler + mobile touch binding
    ├── audio.js        Web Audio API — synthesised BGM + 18 SFX
    ├── effects.js      DOM overlay effects — floating text, Level Up, board flash
    ├── storage.js      localStorage — high scores (top 10) and settings
    └── ui.js           DOM screen/modal switching + score HUD updates
```

---

## Module Reference

### `main.js` — Bootstrap & Event Wiring
Initialises all modules, wires every button and keyboard shortcut to game/UI actions, starts the menu background animation, and handles the first-interaction audio unlock.

### `game.js` — `class Game`
Central game controller.

| Method | Description |
|---|---|
| `start()` | Initialise state and launch the `requestAnimationFrame` loop |
| `_loop(now)` | Per-frame: process input → gravity → render |
| `_processInput()` | Dequeue actions from `InputHandler` and apply movement / rotation / hold |
| `_updateGravity(dt)` | Apply automatic drop speed; detect ground contact and lock delay |
| `_hardDrop()` | Teleport piece to bottom; award Hard Drop points |
| `_lockPiece()` | Lock piece, run clear animation, update score, spawn next |
| `_holdPiece()` | Swap current piece with hold slot |
| `togglePause()` | Pause / resume; fade BGM volume accordingly |

### `board.js` — `class Board`
Manages the 10 × 22 grid (20 visible + 2 buffer rows).

| Method | Description |
|---|---|
| `isValid(piece)` | Boundary and overlap check |
| `lock(piece)` | Write piece colours onto the grid |
| `clearLines()` | Remove full rows; return their display indices |
| `checkTSpin(piece)` | 3-corner rule T-Spin detection |
| `getGhost(piece)` | Drop-shadow clone at lowest valid Y |
| `tryMove(piece, dx, dy)` | Attempt lateral/downward move |
| `tryRotate(piece, dir)` | SRS rotation with up to 4 wall-kick attempts |

### `tetromino.js` — `class Tetromino` · `class Bag`

| Export | Description |
|---|---|
| `TETROMINOES` | Shape matrices (4 rotations × 4 × 4) + hex colours for all 7 pieces |
| `WALL_KICK_JLSTZ` | Official SRS kick offsets for J, L, S, T, Z |
| `WALL_KICK_I` | Special SRS kick offsets for I-piece |
| `getWallKicks()` | Lookup kick table by piece type and rotation transition |
| `Tetromino` | Piece instance — `getCells()`, `clone()`, `shape` getter |
| `Bag` | 7-bag randomiser — Fisher-Yates shuffle, refills automatically |

### `scoring.js` — `class Scoring`

| Method | Description |
|---|---|
| `addLines(n, isTSpin)` | Calculate and add line-clear points; update combo and B2B flags |
| `addDropBonus(cells, hard)` | Add Soft/Hard Drop bonus |
| `calcLineClear(lines, isTSpin)` | Core formula: base × level × B2B multiplier |
| `getSpeed(level)` | Look up drop interval from `SPEED_TABLE` |
| `getLevelFromLines(lines)` | `floor(lines / 10) + 1`, capped at 20 |

### `renderer.js` — `class Renderer`
All Canvas 2D drawing. Uses a fixed 32 px cell size; preview canvases auto-scale.

| Method | Description |
|---|---|
| `render(board, current, ghost, showGhost)` | Full frame: grid → board cells → animations → ghost → current piece |
| `drawCell(ctx, x, y, color, size, alpha)` | 3D-shaded block with highlight and shadow edges |
| `drawGhostCell(ctx, x, y, color, size)` | Semi-transparent outline-only ghost block |
| `renderPreview(ctx, piece, size, canvasSize)` | Centred piece preview for Hold / Next canvases |
| `startClearAnim(rows, onDone)` | 250 ms white-flash animation on cleared rows |
| `triggerLockFlash(piece)` | 50 ms white flash on piece lock |
| `animateGameOver(onDone)` | Row-by-row grey-fill from bottom (50 ms per row) |

### `input.js` — `class InputHandler`
Implements DAS / ARR for keyboard, and touch + mouse bindings for mobile virtual buttons.

| Method | Description |
|---|---|
| `enable() / disable()` | Attach / detach `keydown` and `keyup` listeners |
| `consume()` | Return and flush the pending action queue |
| `bindMobileButton(el, action)` | Wire a DOM element to an action with DAS/ARR support |

### `audio.js` — `Audio` (IIFE module)
Synthesises all sounds in real-time — no audio files needed.

| Export | Description |
|---|---|
| `Audio.init()` | Create `AudioContext` + gain nodes (called on first user interaction) |
| `Audio.startBGM(fast)` | Start looping melody via `setInterval`; `fast=true` raises tempo |
| `Audio.fadeBGM(vol, ms)` | Smooth volume ramp over `ms` milliseconds |
| `Audio.SFX.*` | 18 SFX methods: `move`, `rotate`, `hardDrop`, `lock`, `clear1–3`, `tetris`, `tspin`, `levelUp`, `gameOver`, etc. |

### `effects.js` — `class Effects`
DOM overlay effects layered above the Canvas.

| Method | Description |
|---|---|
| `showClearText(lines, isTSpin, isbtb, combo)` | Spawn colour-coded floating label(s) |
| `showLevelUp(level)` | Golden "LEVEL UP! N" label with CSS bounce animation |
| `flashBoard(wrapper)` | Toggle `.flash` CSS class to strobe the board border |

### `storage.js` — `Storage` (IIFE module)

| Export | Description |
|---|---|
| `getSettings() / saveSettings(s)` | Read/write settings JSON under key `tetris_settings` |
| `getHighScores() / saveHighScore(entry)` | Read/maintain sorted top-10 list under `tetris_highscores` |
| `clearHighScores()` | Remove leaderboard from `localStorage` |
| `getBestScore()` | Return score of rank-1 entry (0 if empty) |

### `ui.js` — `UI` (IIFE module)

| Export | Description |
|---|---|
| `showScreen(id)` | Toggle `.active` class to switch visible screen |
| `showModal(id) / hideModals()` | Show/hide the pause or game-over overlay |
| `updateScore(score, lines, level, time, combo)` | Refresh all HUD values |
| `showGameOver(stats)` | Save score, check new record, populate and show Game Over modal |
| `renderHighScores()` | Build `<tr>` rows from `Storage.getHighScores()` |
| `loadSettingsUI(s) / readSettingsUI()` | Sync DOM sliders and toggles with settings object |

---

## Tech Stack

| Item | Choice |
|---|---|
| Language | HTML5, CSS3, JavaScript ES6+ |
| Rendering | HTML5 Canvas 2D API |
| Audio | Web Audio API (synthesised — no files) |
| Storage | localStorage |
| Font | Press Start 2P via Google Fonts CDN |
| Dependencies | **None** |

---

## Browser Compatibility

| Browser | Min Version |
|---|---|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |
| iOS Safari | 14+ |
| Android Chrome | 80+ |

Internet Explorer is **not** supported.

---

<br>

# 🇯🇵 日本語

## 目次
- [ゲーム概要](#ゲーム概要)
- [機能一覧](#機能一覧)
- [遊び方](#遊び方)
- [操作方法](#操作方法)
- [スコアシステム](#スコアシステム)
- [レベルとスピード](#レベルとスピード)
- [設定項目](#設定項目)
- [ファイル構成](#ファイル構成)
- [モジュール解説](#モジュール解説)
- [技術スタック](#技術スタック)
- [ブラウザ対応](#ブラウザ対応)

---

## ゲーム概要

**HTML5 / CSS3 / JavaScript (ES6+)** のみで実装したブラウザ専用テトリスです。フレームワーク・ビルドツール不要。`index.html` を開くだけでプレイできます。

標準テトリスルールに準拠し、SRS（Super Rotation System）回転・ウォールキック・ゴーストピース・ホールド・7-bagランダマイザを完全実装しています。

---

## 機能一覧

| カテゴリ | 内容 |
|---|---|
| **コアゲーム** | 7-bagランダマイザ、7種テトリミノ、ゴーストピース、ホールド、ネクスト3個表示 |
| **回転システム** | SRS（全ピース対応ウォールキックテーブル完備） |
| **スコア** | ライン消去×レベル、T-Spinボーナス（3倍）、Back-to-Back（1.5倍）、コンボ、ソフト/ハードドロップ加点 |
| **レベル** | 全20レベル、10ライン消去ごとに1レベルアップ |
| **ロック遅延** | 0.5 秒、移動/回転リセット最大15回 |
| **音響** | Web Audio API による合成BGM + 18種SFX（音声ファイル不要） |
| **エフェクト** | 消去フラッシュ、ロックフラッシュ、ハードドロップ残像、レベルアップアニメ、ゲームオーバーグレー化 |
| **画面** | メインメニュー・ゲーム・ポーズ・ゲームオーバー・ランキング・設定・ヘルプ |
| **データ保存** | `localStorage` にトップ10ランキングと設定を永続化 |
| **レスポンシブ** | デスクトップ3カラム／モバイル1カラム＋仮想Dパッド |

---

## 遊び方

1. `index.html` をブラウザで開く。
2. クリックまたはキー入力で音声を初期化（ブラウザの自動再生ポリシー対応）。
3. メインメニューで **▶ 開始** を押す。
4. テトリミノを積み重ね、横一列を埋めて消去。
5. 新しいピースが出現できなくなると **ゲームオーバー（Block Out）**。

---

## 操作方法

### キーボード

| キー | アクション |
|---|---|
| `← / A` | 左移動 |
| `→ / D` | 右移動 |
| `↓ / S` | ソフトドロップ（20倍速） |
| `↑ / W / X` | 時計回り回転 |
| `Z / Ctrl` | 反時計回り回転 |
| `Space` | ハードドロップ（即落下） |
| `C / Shift` | ホールド |
| `P / Esc` | ポーズ / 再開 |
| `R` | リスタート（確認あり） |

### DAS / ARR（設定で変更可能）

| パラメータ | デフォルト | 範囲 |
|---|---|---|
| DAS — 自動リピート開始までの遅延 | 167 ms | 50–300 ms |
| ARR — リピート間隔 | 33 ms | 0–100 ms |

### モバイル仮想ボタン

| ボタン | アクション |
|---|---|
| ↑ | 時計回り回転 |
| ← / → | 左 / 右移動 |
| ↓ | ソフトドロップ |
| HOLD | ホールド |
| DROP | ハードドロップ |
| ⏸ | ポーズ |

---

## スコアシステム

### ライン消去スコア

| 消去ライン数 | 名称 | 基礎点 | 計算式 |
|---|---|---|---|
| 1 | シングル | 100 | 100 × レベル |
| 2 | ダブル | 300 | 300 × レベル |
| 3 | トリプル | 500 | 500 × レベル |
| 4 | **テトリス** | 800 | 800 × レベル |

### T-Spinボーナス

| 消去ライン数 | 名称 | 基礎点 | 計算式 |
|---|---|---|---|
| 0 | T-Spin | 400 | 400 × レベル |
| 1 | T-Spin Single | 800 | 800 × レベル |
| 2 | T-Spin Double | 1200 | 1200 × レベル |
| 3 | T-Spin Triple | 1600 | 1600 × レベル |

### 特殊ボーナス

| ボーナス | 発動条件 | 点数 |
|---|---|---|
| **Back-to-Back** | テトリスまたはT-Spinを連続達成（通常消去を挟まない） | ×1.5 倍率 |
| **コンボ** | 連続消去ごと | 50 × コンボ数 × レベル |
| **ソフトドロップ** | 1マスごと | +1 pt |
| **ハードドロップ** | 1マスごと | +2 pt |

---

## レベルとスピード

10ライン消去ごとにレベルが上昇。最大 **レベル20**。

| レベル | 落下間隔 | レベル | 落下間隔 |
|---|---|---|---|
| 1 | 1.000 秒 | 11 | 0.043 秒 |
| 2 | 0.793 秒 | 12 | 0.028 秒 |
| 3 | 0.618 秒 | 13 | 0.018 秒 |
| 4 | 0.473 秒 | 14 | 0.011 秒 |
| 5 | 0.355 秒 | 15 | 0.007 秒 |
| 6 | 0.262 秒 | 16–20 | 0.005 秒 |
| 7 | 0.190 秒 | | |
| 8 | 0.135 秒 | | |
| 9 | 0.094 秒 | | |
| 10 | 0.064 秒 | | |

> レベル15以降はBGMのテンポも上昇します。

---

## 設定項目

| 項目 | 種類 | デフォルト | 範囲 |
|---|---|---|---|
| BGM音量 | スライダー | 60% | 0–100% |
| SFX音量 | スライダー | 80% | 0–100% |
| BGM オン/オフ | トグル | ON | — |
| SFX オン/オフ | トグル | ON | — |
| ゴーストピース | トグル | ON | — |
| DAS遅延 | スライダー | 167 ms | 50–300 ms |
| ARR速度 | スライダー | 33 ms | 0–100 ms |

---

## ファイル構成

```
Tetris/
├── index.html          エントリポイント — 全画面・モーダルを含む
├── css/
│   ├── main.css        グローバルリセット・フォント・レイアウト・カラー変数
│   ├── menu.css        メインメニュー・落下ブロック背景アニメーション
│   ├── game.css        ゲームレイアウト・サイドパネル・モバイルコントロール
│   └── modal.css       ポーズ・ゲームオーバー・設定・ヘルプ パネル
└── js/
    ├── main.js         起動・画面ルーティング・イベント配線
    ├── game.js         ゲームループ・状態管理・重力・ロック遅延
    ├── board.js        グリッド状態・衝突・ライン消去・T-Spin・ゴースト
    ├── tetromino.js    ピース定義・SRSウォールキックテーブル・7-bagランダマイザ
    ├── scoring.js      スコア計算・レベル進行・速度テーブル
    ├── renderer.js     Canvas 2D描画（ボード・ピース・ゴースト・アニメ）
    ├── input.js        キーボードDAS/ARRハンドラ・モバイルタッチバインド
    ├── audio.js        Web Audio API — 合成BGM + 18種SFX
    ├── effects.js      DOMオーバーレイエフェクト（フロートテキスト・レベルアップ）
    ├── storage.js      localStorage — ランキング（トップ10）・設定
    └── ui.js           DOM画面切替・スコアHUD更新
```

---

## モジュール解説

### `main.js` — 起動・イベント配線
全モジュールを初期化し、ボタン・キー操作をゲーム/UIアクションに接続。メニュー背景アニメと初回インタラクション時の音声ロック解除を担当。

### `game.js` — `class Game`

| メソッド | 説明 |
|---|---|
| `start()` | 状態初期化とrAFループ開始 |
| `_loop(now)` | 毎フレーム：入力処理→重力→描画 |
| `_processInput()` | `InputHandler`のキューを消費してアクション実行 |
| `_updateGravity(dt)` | 自動落下・着地検出・ロック遅延タイマー |
| `_hardDrop()` | 即座に最下段へ落下・ハードドロップ加点 |
| `_lockPiece()` | ピース固定・消去アニメ・スコア更新・次ピーススポーン |
| `_holdPiece()` | 現在ピースとホールドスロットを交換 |
| `togglePause()` | ポーズ/再開・BGMのフェード処理 |

### `board.js` — `class Board`

| メソッド | 説明 |
|---|---|
| `isValid(piece)` | 境界・重複チェック |
| `lock(piece)` | グリッドにピースの色を書き込む |
| `clearLines()` | 満ライン削除・行インデックス返却 |
| `checkTSpin(piece)` | 3コーナー則によるT-Spin判定 |
| `getGhost(piece)` | 最下点でのゴーストクローン生成 |
| `tryMove(piece, dx, dy)` | 移動試行 |
| `tryRotate(piece, dir)` | SRS回転試行（ウォールキック4点） |

### `tetromino.js`

| エクスポート | 説明 |
|---|---|
| `TETROMINOES` | 7ピースの形状行列（4回転×4×4）＋カラーコード |
| `WALL_KICK_JLSTZ / WALL_KICK_I` | 公式SRSキックオフセットテーブル |
| `Tetromino` | ピースインスタンス（`getCells()`・`clone()`・`shape`ゲッター） |
| `Bag` | 7-bagランダマイザ（Fisher-Yatesシャッフル） |

### `scoring.js` — `class Scoring`

| メソッド | 説明 |
|---|---|
| `addLines(n, isTSpin)` | ライン消去点数を加算・コンボ/B2Bフラグ更新 |
| `addDropBonus(cells, hard)` | ソフト/ハードドロップボーナス加算 |
| `calcLineClear(lines, isTSpin)` | 基礎点×レベル×B2B倍率 |
| `getSpeed(level)` | `SPEED_TABLE`から落下間隔を取得 |

### `renderer.js` — `class Renderer`

| メソッド | 説明 |
|---|---|
| `render(...)` | フルフレーム描画（グリッド→ボード→ゴースト→現在ピース） |
| `drawCell(...)` | ハイライト＋シャドウ付き3Dブロック描画 |
| `startClearAnim(rows, onDone)` | 250 ms 白フラッシュ消去アニメ |
| `triggerLockFlash(piece)` | 50 ms ロック白フラッシュ |
| `animateGameOver(onDone)` | 下から1行ずつグレーに染めるアニメ（50 ms/行） |

### `input.js` — `class InputHandler`

| メソッド | 説明 |
|---|---|
| `enable() / disable()` | キーリスナーの付け外し |
| `consume()` | アクションキューを返却してフラッシュ |
| `bindMobileButton(el, action)` | タッチ/マウスにDAS/ARRを付与してバインド |

### `audio.js` — `Audio`

| エクスポート | 説明 |
|---|---|
| `Audio.init()` | `AudioContext`＋ゲインノード生成（初回インタラクション時） |
| `Audio.startBGM(fast)` | ループメロディ開始（`fast=true`でテンポアップ） |
| `Audio.fadeBGM(vol, ms)` | 指定時間でBGM音量をスムーズに変化 |
| `Audio.SFX.*` | 18種のSFXメソッド群 |

### `effects.js` — `class Effects`

| メソッド | 説明 |
|---|---|
| `showClearText(...)` | 色付きフロートラベル表示 |
| `showLevelUp(level)` | 「LEVEL UP!」ゴールドバウンスアニメ |
| `flashBoard(wrapper)` | ボードフレームストロボ点滅 |

### `storage.js` — `Storage`

| エクスポート | 説明 |
|---|---|
| `getSettings() / saveSettings(s)` | 設定JSONの読み書き |
| `getHighScores() / saveHighScore(entry)` | ランキングの取得・ソート・保存（上位10件） |
| `clearHighScores()` | ランキング削除 |

### `ui.js` — `UI`

| エクスポート | 説明 |
|---|---|
| `showScreen(id)` | `.active` クラスで表示画面を切替 |
| `updateScore(...)` | HUDの各値を更新 |
| `showGameOver(stats)` | スコア保存・新記録確認・モーダル表示 |
| `renderHighScores()` | ランキングテーブルHTML生成 |

---

## 技術スタック

| 項目 | 選択 |
|---|---|
| 言語 | HTML5 / CSS3 / JavaScript ES6+ |
| 描画 | HTML5 Canvas 2D API |
| 音響 | Web Audio API（合成音、ファイル不要） |
| 保存 | localStorage |
| フォント | Press Start 2P（Google Fonts CDN） |
| 依存ライブラリ | **なし** |

---

## ブラウザ対応

| ブラウザ | 最低バージョン |
|---|---|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |
| iOS Safari | 14+ |
| Android Chrome | 80+ |

Internet Explorer は非対応です。

---

<br>

# 🇹🇼 中文

## 目錄
- [遊戲介紹](#遊戲介紹)
- [功能清單](#功能清單)
- [遊玩方式](#遊玩方式)
- [操作說明](#操作說明)
- [計分系統](#計分系統)
- [關卡與速度](#關卡與速度)
- [設定項目](#設定項目)
- [目錄結構](#目錄結構)
- [模組詳細說明](#模組詳細說明)
- [技術架構](#技術架構)
- [瀏覽器相容性](#瀏覽器相容性)

---

## 遊戲介紹

以 **HTML5 / CSS3 / JavaScript (ES6+)** 純原生實作的網頁版俄羅斯方塊，無任何框架或建置工具依賴。直接開啟 `index.html` 即可遊玩。

遵循標準 Tetris 規則，完整實作 SRS（Super Rotation System）旋轉系統、Wall Kick、Ghost Piece、Hold、7-bag 隨機器，並內建 Web Audio API 合成音效，不需任何音訊檔案。

---

## 功能清單

| 類別 | 內容 |
|---|---|
| **核心玩法** | 7-bag 隨機器、7 種方塊、Ghost Piece、Hold、Next 預覽 3 個 |
| **旋轉系統** | SRS 完整 Wall Kick 偏移表（I 形特殊表） |
| **計分** | 消行×關卡、T-Spin 加成（3 倍）、Back-to-Back（1.5 倍）、Combo 連消、軟/硬落加分 |
| **關卡** | 共 20 關，每消 10 行升一關 |
| **鎖定延遲** | 0.5 秒，每顆方塊最多重置 15 次 |
| **音效** | Web Audio API 合成 BGM + 18 種音效（無音訊檔需求） |
| **視覺特效** | 消行閃光、鎖定閃光、Hard Drop 殘影、升關動畫、遊戲結束逐行灰化 |
| **浮動提示** | TETRIS! / T-SPIN / COMBO / BACK-TO-BACK 文字飛入效果 |
| **畫面** | 主選單・遊戲・暫停・遊戲結束・排行榜・設定・操作說明 |
| **資料儲存** | `localStorage` 保存前 10 名排行榜與所有設定 |
| **響應式** | 桌機三欄佈局；手機單欄 + 虛擬方向鍵 |

---

## 遊玩方式

1. 以現代瀏覽器開啟 `index.html`。
2. 點擊或按任意鍵解鎖音訊（瀏覽器自動播放政策限制）。
3. 點擊主選單的 **▶ 開始遊戲**。
4. 旋轉並堆疊方塊，填滿橫列即消除得分。
5. 新方塊無法生成時（**Block Out**）遊戲結束。

---

## 操作說明

### 鍵盤

| 按鍵 | 功能 |
|---|---|
| `← / A` | 向左移動 |
| `→ / D` | 向右移動 |
| `↓ / S` | 軟落（20 倍速） |
| `↑ / W / X` | 順時針旋轉 |
| `Z / Ctrl` | 逆時針旋轉 |
| `Space` | 硬落（立即落底） |
| `C / Shift` | Hold 暫存方塊 |
| `P / Esc` | 暫停 / 繼續 |
| `R` | 重新開始（需確認） |

### DAS / ARR（可在設定調整）

| 參數 | 預設值 | 範圍 |
|---|---|---|
| DAS — 按住後自動重複前的等待時間 | 167 ms | 50–300 ms |
| ARR — 自動重複間隔 | 33 ms | 0–100 ms |

### 行動裝置虛擬按鍵

| 按鈕 | 功能 |
|---|---|
| ↑ | 順時針旋轉 |
| ← / → | 左 / 右移動 |
| ↓ | 軟落 |
| HOLD | 暫存方塊 |
| DROP | 硬落 |
| ⏸ | 暫停 |

---

## 計分系統

### 消行得分

| 消除行數 | 名稱 | 基礎分數 | 計算公式 |
|---|---|---|---|
| 1 | Single | 100 | 100 × 關卡 |
| 2 | Double | 300 | 300 × 關卡 |
| 3 | Triple | 500 | 500 × 關卡 |
| 4 | **Tetris** | 800 | 800 × 關卡 |

### T-Spin 加成

| 消除行數 | 名稱 | 基礎分數 | 計算公式 |
|---|---|---|---|
| 0 | T-Spin | 400 | 400 × 關卡 |
| 1 | T-Spin Single | 800 | 800 × 關卡 |
| 2 | T-Spin Double | 1200 | 1200 × 關卡 |
| 3 | T-Spin Triple | 1600 | 1600 × 關卡 |

### 特殊加成

| 加成 | 觸發條件 | 點數 |
|---|---|---|
| **Back-to-Back** | 連續 Tetris 或 T-Spin（中間不穿插普通消行） | ×1.5 倍率 |
| **Combo 連消** | 每次落下均有消行 | 50 × 連消次數 × 關卡 |
| **軟落** | 每格 | +1 分 |
| **硬落** | 每格 | +2 分 |

---

## 關卡與速度

每消除 **10 行**升一關，最高 **關卡 20**。

| 關卡 | 下落間隔 | 關卡 | 下落間隔 |
|---|---|---|---|
| 1 | 1.000 秒 | 11 | 0.043 秒 |
| 2 | 0.793 秒 | 12 | 0.028 秒 |
| 3 | 0.618 秒 | 13 | 0.018 秒 |
| 4 | 0.473 秒 | 14 | 0.011 秒 |
| 5 | 0.355 秒 | 15 | 0.007 秒 |
| 6 | 0.262 秒 | 16–20 | 0.005 秒 |
| 7 | 0.190 秒 | | |
| 8 | 0.135 秒 | | |
| 9 | 0.094 秒 | | |
| 10 | 0.064 秒 | | |

> 關卡 15 起 BGM 播放速度加快。

---

## 設定項目

| 項目 | 類型 | 預設值 | 範圍 |
|---|---|---|---|
| BGM 音量 | 滑桿 | 60% | 0–100% |
| 音效音量 | 滑桿 | 80% | 0–100% |
| BGM 開關 | 切換 | ON | — |
| 音效開關 | 切換 | ON | — |
| Ghost Piece | 切換 | ON | — |
| DAS 延遲 | 滑桿 | 167 ms | 50–300 ms |
| ARR 速率 | 滑桿 | 33 ms | 0–100 ms |

---

## 目錄結構

```
Tetris/
├── index.html          進入點 — 包含全部畫面與 Modal
├── css/
│   ├── main.css        全域重置、字體、版面配置、顏色變數
│   ├── menu.css        主選單 + 方塊下落背景動畫
│   ├── game.css        遊戲版面、側邊面板、行動裝置控制器、特效覆蓋層
│   └── modal.css       暫停 / 遊戲結束 / 設定 / 說明 面板
└── js/
    ├── main.js         啟動、畫面路由、事件配線
    ├── game.js         遊戲主迴圈、狀態機、重力、鎖定延遲
    ├── board.js        格子狀態、碰撞偵測、消行、T-Spin、Ghost
    ├── tetromino.js    方塊定義、SRS Wall Kick 表、7-bag 隨機器
    ├── scoring.js      計分邏輯、關卡進程、速度表
    ├── renderer.js     Canvas 2D 渲染（盤面、方塊、Ghost、動畫）
    ├── input.js        鍵盤 DAS/ARR 處理器 + 行動裝置觸控綁定
    ├── audio.js        Web Audio API — 合成 BGM + 18 種音效
    ├── effects.js      DOM 覆蓋層特效（浮動文字、升關、邊框閃爍）
    ├── storage.js      localStorage — 排行榜（前 10 名）與設定
    └── ui.js           DOM 畫面切換 + 計分 HUD 更新
```

---

## 模組詳細說明

### `main.js` — 啟動與事件配線
初始化所有模組，將每個按鈕與鍵盤快捷鍵連結至遊戲/UI 行為，啟動主選單背景動畫，並處理首次互動時的音訊解鎖。

### `game.js` — `class Game`
遊戲中樞控制器。

| 方法 | 說明 |
|---|---|
| `start()` | 初始化遊戲狀態並啟動 `requestAnimationFrame` 迴圈 |
| `_loop(now)` | 每幀：處理輸入 → 重力 → 渲染 |
| `_processInput()` | 從 `InputHandler` 消費動作佇列並執行移動/旋轉/暫存 |
| `_updateGravity(dt)` | 自動下落速度、著地偵測與鎖定延遲計時 |
| `_hardDrop()` | 方塊瞬間落底並加計硬落分數 |
| `_lockPiece()` | 鎖定方塊、播放消行動畫、更新分數、生成下一顆 |
| `_holdPiece()` | 交換當前方塊與 Hold 槽 |
| `togglePause()` | 暫停/繼續，並淡入淡出 BGM 音量 |

### `board.js` — `class Board`
管理 10 × 22 格子（20 可見 + 2 緩衝列）。

| 方法 | 說明 |
|---|---|
| `isValid(piece)` | 邊界與重疊檢查 |
| `lock(piece)` | 將方塊顏色寫入格子 |
| `clearLines()` | 清除滿列並回傳列索引陣列 |
| `checkTSpin(piece)` | 三角判定法偵測 T-Spin |
| `getGhost(piece)` | 計算最低有效 Y 位置的 Ghost 克隆 |
| `tryMove(piece, dx, dy)` | 嘗試橫向/向下移動 |
| `tryRotate(piece, dir)` | SRS 旋轉，最多嘗試 4 個 Wall Kick |

### `tetromino.js`

| 匯出 | 說明 |
|---|---|
| `TETROMINOES` | 7 種方塊的形狀矩陣（4 旋轉 × 4 × 4）與顏色碼 |
| `WALL_KICK_JLSTZ` | J/L/S/T/Z 的官方 SRS Kick 偏移表 |
| `WALL_KICK_I` | I 形方塊的特殊 SRS Kick 偏移表 |
| `getWallKicks()` | 依方塊類型與旋轉方向查詢偏移陣列 |
| `Tetromino` | 方塊實例（`getCells()`、`clone()`、`shape` getter） |
| `Bag` | 7-bag 隨機器（Fisher-Yates 洗牌，自動補充） |

### `scoring.js` — `class Scoring`

| 方法 | 說明 |
|---|---|
| `addLines(n, isTSpin)` | 計算並加入消行分數，更新 Combo 與 B2B 旗標 |
| `addDropBonus(cells, hard)` | 加入軟落/硬落獎勵 |
| `calcLineClear(lines, isTSpin)` | 核心公式：基礎分 × 關卡 × B2B 倍率 |
| `getSpeed(level)` | 從 `SPEED_TABLE` 查詢下落間隔 |
| `getLevelFromLines(lines)` | `floor(lines / 10) + 1`，上限 20 |

### `renderer.js` — `class Renderer`
所有 Canvas 2D 繪製，固定 32 px 格子大小，預覽畫布自動縮放。

| 方法 | 說明 |
|---|---|
| `render(board, current, ghost, showGhost)` | 完整幀：格線 → 格子 → 動畫 → Ghost → 當前方塊 |
| `drawCell(ctx, x, y, color, size, alpha)` | 含亮面/暗面的 3D 立體方塊繪製 |
| `drawGhostCell(ctx, x, y, color, size)` | 半透明輪廓 Ghost 方塊 |
| `renderPreview(ctx, piece, size, canvasSize)` | Hold / Next 小畫布的居中預覽 |
| `startClearAnim(rows, onDone)` | 250 ms 白色閃光消行動畫 |
| `triggerLockFlash(piece)` | 50 ms 鎖定白色閃光 |
| `animateGameOver(onDone)` | 由下而上逐行灰化（每行 50 ms） |

### `input.js` — `class InputHandler`

| 方法 | 說明 |
|---|---|
| `enable() / disable()` | 附加/移除 `keydown` / `keyup` 監聽器 |
| `consume()` | 回傳並清空待處理動作佇列 |
| `bindMobileButton(el, action)` | 為 DOM 元素綁定帶 DAS/ARR 的觸控/滑鼠事件 |

### `audio.js` — `Audio`（IIFE 模組）
所有音效皆即時合成，無需任何音訊檔案。

| 匯出 | 說明 |
|---|---|
| `Audio.init()` | 建立 `AudioContext` 與增益節點（首次互動時呼叫） |
| `Audio.startBGM(fast)` | 啟動循環旋律；`fast=true` 提高節拍速度 |
| `Audio.fadeBGM(vol, ms)` | 在指定毫秒內平滑淡入/出 BGM 音量 |
| `Audio.SFX.*` | 18 種音效方法：`move`、`rotate`、`hardDrop`、`lock`、`clear1–3`、`tetris`、`tspin`、`levelUp`、`gameOver` 等 |

### `effects.js` — `class Effects`

| 方法 | 說明 |
|---|---|
| `showClearText(lines, isTSpin, isbtb, combo)` | 生成有色浮動提示文字 |
| `showLevelUp(level)` | 金色「LEVEL UP!」加上 CSS 彈跳動畫 |
| `flashBoard(wrapper)` | 切換 `.flash` class 使遊戲板邊框閃爍 |

### `storage.js` — `Storage`（IIFE 模組）

| 匯出 | 說明 |
|---|---|
| `getSettings() / saveSettings(s)` | 讀寫設定 JSON（`tetris_settings`） |
| `getHighScores() / saveHighScore(entry)` | 讀取/排序/儲存前 10 名（`tetris_highscores`） |
| `clearHighScores()` | 清除排行榜資料 |
| `getBestScore()` | 回傳第 1 名分數（無記錄時為 0） |

### `ui.js` — `UI`（IIFE 模組）

| 匯出 | 說明 |
|---|---|
| `showScreen(id)` | 切換 `.active` class 以顯示指定畫面 |
| `showModal(id) / hideModals()` | 顯示/隱藏暫停或遊戲結束覆蓋層 |
| `updateScore(score, lines, level, time, combo)` | 更新 HUD 所有數值 |
| `showGameOver(stats)` | 儲存分數、檢查新紀錄、填入並顯示遊戲結束 Modal |
| `renderHighScores()` | 從 `Storage` 讀取資料並生成排行榜 `<tr>` 列 |
| `loadSettingsUI(s) / readSettingsUI()` | 同步 DOM 滑桿/切換按鈕與設定物件 |

---

## 技術架構

| 項目 | 選擇 |
|---|---|
| 語言 | HTML5 / CSS3 / JavaScript ES6+ |
| 渲染 | HTML5 Canvas 2D API |
| 音效 | Web Audio API（合成音效，無音訊檔需求） |
| 儲存 | localStorage |
| 字體 | Press Start 2P（Google Fonts CDN） |
| 外部依賴 | **無** |

---

## 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|---|---|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |
| iOS Safari | 14+ |
| Android Chrome | 80+ |

不支援 Internet Explorer。
