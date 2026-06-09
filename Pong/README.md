# Pong

<div align="center">

[English](#english) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](#japanese) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](#traditional-chinese)

</div>

---

## <a id="english"></a>English

<div align="right"><a href="#english">EN</a> | <a href="#japanese">JA</a> | <a href="#traditional-chinese">ZH</a></div>

**Contents**
- [Game Introduction](#en-intro)
- [How to Play](#en-play)
- [Code Structure](#en-code)

---

### <a id="en-intro"></a>Game Introduction

A modern take on the classic Pong arcade game, built entirely in the browser with no build tools and no external dependencies. Just open `index.html` and play.

#### Overview

| Item | Detail |
|------|--------|
| Type | Single-page browser game (Player vs AI) |
| Technology | Pure HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| Rendering | HTML5 Canvas API |
| Audio | Web Audio API — all sounds synthesized at runtime |
| Storage | `localStorage` — saves settings and game progress |
| Dependencies | **None** — works fully offline |
| Target FPS | 60 fps via `requestAnimationFrame` |

#### Key Features

| Feature | Description |
|---------|-------------|
| Zero-setup | Open `index.html` directly — no server, no build step |
| Three AI difficulties | Easy, Normal, Hard — each with distinct speed, reaction time, and prediction accuracy |
| Eight color themes | Neon, Classic, Ocean, Fire, Forest, Candy, Ice, Galaxy — switchable in real time |
| 16 sound effects | All synthesized via Web Audio API; no audio files required |
| 6 background tracks | Separate BGM for each difficulty and result screen |
| Responsive layout | Adapts to desktop, tablet, and mobile; canvas scales to fit any screen size |
| Three languages | Traditional Chinese, English, Japanese — switchable from Settings |
| Auto-save | Progress is saved on every score change and when leaving mid-game |
| Customizable settings | Target score (5 / 7 / 11 / 15), ball speed (Slow / Normal / Fast), volumes, FPS display, vibration |

#### Color Themes

| Theme ID | Name | Primary | Secondary | Background | Style |
|----------|------|---------|-----------|------------|-------|
| `neon` | Neon | `#00FFAA` | `#FF00FF` | `#0A0A1A` | Cyberpunk glow |
| `classic` | Classic | `#FFFFFF` | `#FFFFFF` | `#000000` | Original Atari look |
| `ocean` | Ocean | `#00BFFF` | `#7FFFD4` | `#001428` | Deep-sea blue |
| `fire` | Fire | `#FF6B00` | `#FFD700` | `#1A0500` | Lava heat |
| `forest` | Forest | `#00E676` | `#69F0AE` | `#0A1F0A` | Natural green |
| `candy` | Candy | `#FF4081` | `#E040FB` | `#FFF0F5` | Pastel macaron |
| `ice` | Ice | `#B0E0FF` | `#FFFFFF` | `#0D1B2A` | Arctic blue |
| `galaxy` | Galaxy | `#C77DFF` | `#E0AAFF` | `#03001C` | Deep-space purple |

#### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| iOS Safari | 13+ |
| Android Chrome | 80+ |

---

### <a id="en-play"></a>How to Play

#### Quick Start

1. Open `index.html` in any modern browser.
2. Press **Start Game** from the main menu.
3. Select a difficulty (Easy / Normal / Hard).
4. A 3-second countdown begins — then the match starts.
5. First player to reach the target score wins.

#### Controls

| Platform | Action | Control |
|----------|--------|---------|
| Keyboard | Move paddle up | `↑` or `W` |
| Keyboard | Move paddle down | `↓` or `S` |
| Keyboard | Pause / Resume | `Esc` |
| Keyboard | Mute / Unmute | `M` |
| Keyboard | Restart (in-game) | `R` |
| Mobile | Move paddle up | Swipe up on the **left half** of the canvas |
| Mobile | Move paddle down | Swipe down on the **left half** of the canvas |
| Mobile | Pause | Tap the pause button (top-right) |
| Mobile (small) | Move paddle | Touch the on-screen arrow buttons |

> The player always controls the **left paddle**. The AI controls the **right paddle**.

#### Game Rules

| Rule | Detail |
|------|--------|
| Win condition | First to reach the target score (default: 7 points) |
| Ball serve | After each point, the ball launches from center toward the scoring side |
| Wall bounce | Top and bottom walls reflect the ball |
| Angle control | Hit the ball near the paddle's edge to increase the bounce angle (max 45°) |
| Speed increase | Ball gains +0.3 speed units on every paddle hit |
| Maximum speed | Ball is capped at 15 units/frame to prevent tunneling |
| Match point | A warning sound plays when either side is one point from winning |

#### AI Difficulty Comparison

| Property | Easy | Normal | Hard |
|----------|------|--------|------|
| Move speed | 3.5 units/frame | 5.5 units/frame | 8.0 units/frame |
| Prediction error | ±60 px | ±25 px | ±5 px |
| Reaction delay | 200 ms | 100 ms | 16 ms |
| Tracking rate | 50% | 75% | 98% |
| Bounce prediction | No | Partial | Yes (multi-bounce) |
| Intentional miss rate | — | — | ~5% |

#### Settings

| Setting | Options | Default |
|---------|---------|---------|
| Target score | 5 / 7 / 11 / 15 | 7 |
| Ball speed | Slow / Normal / Fast | Normal |
| Music volume | 0 – 100% | 60% |
| SFX volume | 0 – 100% | 80% |
| Color theme | 8 themes | Neon |
| Show FPS | On / Off | Off |
| Vibration (mobile) | On / Off | On |
| Language | English / Japanese / Traditional Chinese | Traditional Chinese |

#### Save System

| Event | Action |
|-------|--------|
| Every point scored | Auto-save |
| Pause → Main Menu | Auto-save |
| Browser tab hidden | Auto-save + pause |
| Match ends | Save cleared |
| Continue Game | Restores score, ball position, and both paddles |

---

### <a id="en-code"></a>Code Structure

#### Directory Overview

```
pong/
├── index.html          Entry point — HTML skeleton and script loading order
├── css/                All styles (9 files)
└── js/
    ├── core/           Game loop and global state (3 files)
    ├── entities/       Game objects — ball, paddles, AI (4 files)
    ├── systems/        Cross-cutting services — audio, input, storage, etc. (5 files)
    ├── screens/        UI screen modules (7 files)
    └── utils/          Pure helpers — math, DOM, constants, i18n (4 files)
```

#### CSS Files

| File | Purpose |
|------|---------|
| `reset.css` | CSS reset / normalize |
| `variables.css` | Global CSS custom properties (colors, spacing, fonts) |
| `typography.css` | Font imports, sizes, line-height scale |
| `layout.css` | Page structure — Flexbox / Grid |
| `components.css` | Reusable UI components (buttons, panels, modals) |
| `screens.css` | Per-screen styles (main menu, game, results, etc.) |
| `themes.css` | `data-theme` attribute overrides for 8 color themes |
| `animations.css` | Keyframe and transition animations |
| `responsive.css` | Media queries for 5 breakpoints |

#### Responsive Breakpoints

| Name | Width Range | Target Device |
|------|-------------|---------------|
| `mobile-sm` | < 480 px | Small phones |
| `mobile` | 480–767 px | Standard phones |
| `tablet` | 768–1023 px | Tablets |
| `desktop` | 1024–1439 px | Desktops |
| `desktop-lg` | ≥ 1440 px | Large monitors |

#### JavaScript — `js/core/`

| File | Class / Object | Responsibility |
|------|---------------|----------------|
| `game.js` | `Pong.Game` | Main game loop (`requestAnimationFrame`), state transitions, score handling, pause/resume/restart, save triggers |
| `canvas.js` | `Pong.Canvas` | Canvas initialization, resize handling (16:9 scaling), field drawing, color helpers |
| `state.js` | `Pong.GameState` | Single global state object — canvas dimensions, game flags, current settings, active entities |

#### JavaScript — `js/entities/`

| File | Class | Responsibility |
|------|-------|----------------|
| `ball.js` | `Pong.Ball` | Physics update, wall/paddle collision, bounce angle calculation, speed ramping, draw |
| `paddle.js` | `Pong.Paddle` | Base class — position, clamping, AABB rect, draw |
| `player.js` | `Pong.Player` | Extends `Paddle` — reads keyboard and touch input each frame |
| `ai.js` | `Pong.AI` | Extends `Paddle` — ball prediction with per-difficulty error, reaction delay, idle return-to-center |

#### JavaScript — `js/systems/`

| File | Object | Responsibility |
|------|--------|----------------|
| `audio.js` | `Pong.Audio` | Web Audio API synthesis — 16 SFX + 6 BGM tracks, fade in/out, volume control, mute toggle |
| `input.js` | `Pong.Input` | Unified keyboard, touch, and pointer event handling; provides per-frame movement state |
| `score.js` | `Pong.Score` | Score tracking, win condition check, match-point detection, DOM score display update |
| `effects.js` | `Pong.Effects` | Particle emitter, score flash, screen shake, vibration (`navigator.vibrate`) |
| `storage.js` | `Pong.Storage` | `localStorage` wrapper — load/save settings and game state with versioning |

#### JavaScript — `js/screens/`

| File | Object | Responsibility |
|------|--------|----------------|
| `screenManager.js` | `Pong.ScreenManager` | Fade-in/out transitions, shows/hides screen modules by name |
| `mainMenu.js` | `Pong.MainMenu` | Title, start / continue / help / settings buttons, difficulty modal, theme switcher dots |
| `gameScreen.js` | `Pong.GameScreen` | DOM overlay for score display, countdown, FPS counter, pause and mute buttons |
| `pauseMenu.js` | `Pong.PauseMenu` | Semi-transparent pause overlay — resume, restart, main menu |
| `resultScreen.js` | `Pong.ResultScreen` | Win/lose screen with final score, play-again and main-menu buttons |
| `settingsScreen.js` | `Pong.SettingsScreen` | Tabbed settings UI (Game / Audio / Visual) with live preview; saves on change |
| `helpScreen.js` | `Pong.HelpScreen` | Scrollable help — controls, rules, difficulty descriptions, keyboard shortcuts |

#### JavaScript — `js/utils/`

| File | Object | Responsibility |
|------|--------|----------------|
| `constants.js` | `CONSTANTS` | All magic numbers — ball physics, AI config, theme list, language list, localStorage keys |
| `i18n.js` | `Pong.I18n` | Translation lookup (`t(key)`), language switching, `<html lang>` update |
| `math.js` | `Pong.Math` | Vector helpers, AABB-circle collision, ball trajectory prediction, `clamp`, `randomRange` |
| `dom.js` | `Pong.Dom` | `createElement` shorthand, class toggles, event delegation helpers |

#### Script Loading Order

The files must be loaded in this order (all via plain `<script>` tags):

```
constants.js → i18n.js → math.js → dom.js
  → state.js → canvas.js
  → storage.js → audio.js → input.js → score.js → effects.js
  → ball.js → paddle.js → player.js → ai.js
  → screenManager.js → mainMenu.js → gameScreen.js
    → pauseMenu.js → resultScreen.js → settingsScreen.js → helpScreen.js
  → game.js   ← initializes everything on DOMContentLoaded
```

---

---

## <a id="japanese"></a>日本語

<div align="right"><a href="#english">EN</a> | <a href="#japanese">JA</a> | <a href="#traditional-chinese">ZH</a></div>

**目次**
- [ゲーム紹介](#ja-intro)
- [遊び方](#ja-play)
- [コード分類](#ja-code)

---

### <a id="ja-intro"></a>ゲーム紹介

クラシックなPongアーケードゲームをモダンなブラウザ向けにリメイクした作品です。ビルドツール不要・外部依存ゼロで、`index.html` を開くだけですぐにプレイできます。

#### 概要

| 項目 | 内容 |
|------|------|
| ジャンル | ブラウザ単体ゲーム（プレイヤー vs AI） |
| 技術 | 純粋な HTML5 / CSS3 / Vanilla JavaScript（ES6+） |
| 描画 | HTML5 Canvas API |
| サウンド | Web Audio API — 全音源をランタイムで合成 |
| 保存 | `localStorage` — 設定とゲーム進行を保存 |
| 依存関係 | **なし** — オフラインで完全動作 |
| 目標FPS | `requestAnimationFrame` で 60 fps |

#### 主な特徴

| 機能 | 説明 |
|------|------|
| セットアップ不要 | `index.html` を直接開くだけでプレイ可能 |
| AI難易度3種類 | かんたん・ふつう・むずかしい — 速度・反応時間・予測精度がそれぞれ異なる |
| 8種類のカラーテーマ | ネオン・クラシック・オーシャン・ファイア・フォレスト・キャンディ・アイス・ギャラクシー — リアルタイム切替可能 |
| 効果音16種 | Web Audio APIで合成済み。音声ファイル不要 |
| BGM6曲 | 難易度別・結果画面別に異なるBGMを収録 |
| レスポンシブ対応 | デスクトップ・タブレット・モバイルに対応。Canvasは画面サイズに自動スケーリング |
| 3言語対応 | 繁體中文・English・日本語 — 設定から切替可能 |
| オートセーブ | 得点ごと・離脱時に自動保存 |
| カスタマイズ設定 | 目標スコア・ボール速度・音量・FPS表示・振動フィードバックを変更可能 |

#### カラーテーマ一覧

| テーマID | 名称 | メインカラー | サブカラー | 背景色 | スタイル |
|---------|------|------------|----------|--------|---------|
| `neon` | ネオン | `#00FFAA` | `#FF00FF` | `#0A0A1A` | サイバーパンク発光 |
| `classic` | クラシック | `#FFFFFF` | `#FFFFFF` | `#000000` | オリジナルAtari風 |
| `ocean` | オーシャン | `#00BFFF` | `#7FFFD4` | `#001428` | 深海ブルー |
| `fire` | ファイア | `#FF6B00` | `#FFD700` | `#1A0500` | 溶岩の熱 |
| `forest` | フォレスト | `#00E676` | `#69F0AE` | `#0A1F0A` | 自然の緑 |
| `candy` | キャンディ | `#FF4081` | `#E040FB` | `#FFF0F5` | パステルマカロン |
| `ice` | アイス | `#B0E0FF` | `#FFFFFF` | `#0D1B2A` | 北極の青 |
| `galaxy` | ギャラクシー | `#C77DFF` | `#E0AAFF` | `#03001C` | 深宇宙パープル |

#### 対応ブラウザ

| ブラウザ | 最低バージョン |
|---------|-------------|
| Chrome / Edge | 80以上 |
| Firefox | 75以上 |
| Safari | 13以上 |
| iOS Safari | 13以上 |
| Android Chrome | 80以上 |

---

### <a id="ja-play"></a>遊び方

#### クイックスタート

1. `index.html` をブラウザで開く
2. メインメニューの **ゲーム開始** を押す
3. 難易度（かんたん / ふつう / むずかしい）を選択
4. 3秒カウントダウン後に試合開始
5. 先に目標スコアへ到達した側が勝利

#### 操作方法

| プラットフォーム | 操作 | キー / 動作 |
|--------------|------|------------|
| キーボード | パドルを上に動かす | `↑` または `W` |
| キーボード | パドルを下に動かす | `↓` または `S` |
| キーボード | 一時停止 / 再開 | `Esc` |
| キーボード | ミュート切替 | `M` |
| キーボード | リスタート（試合中） | `R` |
| モバイル | パドルを上に動かす | Canvasの **左半分** を上にスワイプ |
| モバイル | パドルを下に動かす | Canvasの **左半分** を下にスワイプ |
| モバイル | 一時停止 | 右上の一時停止ボタンをタップ |
| モバイル（小画面） | パドル操作 | 画面左側の仮想方向ボタン |

> プレイヤーは常に **左側のパドル** を操作します。AIは **右側のパドル** を担当します。

#### ゲームルール

| ルール | 詳細 |
|--------|------|
| 勝利条件 | 先に目標スコアへ到達（デフォルト：7点） |
| サーブ | 得点後、ボールはコート中央から得点側に向けて発射 |
| 壁の反射 | 上下の壁でボールが反射 |
| 角度制御 | パドルの端で打つほど反射角が大きくなる（最大45°） |
| スピードアップ | パドルに当たるたびにボールが +0.3 加速 |
| 最高速度 | 貫通防止のため最大15ユニット/フレームに制限 |
| マッチポイント | どちらかが残り1点の状態になると警告音が鳴る |

#### AI難易度比較

| 項目 | かんたん | ふつう | むずかしい |
|------|---------|--------|-----------|
| 移動速度 | 3.5 units/frame | 5.5 units/frame | 8.0 units/frame |
| 予測誤差範囲 | ±60 px | ±25 px | ±5 px |
| 反応遅延 | 200 ms | 100 ms | 16 ms |
| 追跡率 | 50% | 75% | 98% |
| 反射後の位置予測 | なし | 一部あり | あり（複数反射対応） |
| 意図的ミス率 | — | — | 約5% |

#### 設定一覧

| 設定項目 | 選択肢 | デフォルト |
|---------|--------|---------|
| 目標スコア | 5 / 7 / 11 / 15 | 7 |
| ボール速度 | 遅い / 標準 / 速い | 標準 |
| BGM音量 | 0 – 100% | 60% |
| 効果音音量 | 0 – 100% | 80% |
| カラーテーマ | 8種類 | ネオン |
| FPS表示 | オン / オフ | オフ |
| 振動フィードバック（モバイル） | オン / オフ | オン |
| 言語 | English / 日本語 / 繁體中文 | 繁體中文 |

#### セーブシステム

| タイミング | 動作 |
|-----------|------|
| 得点ごと | オートセーブ |
| 一時停止 → メインメニュー | オートセーブ |
| ブラウザタブ非表示 | オートセーブ + 一時停止 |
| 試合終了 | セーブデータ削除 |
| 続きから | スコア・ボール位置・両パドル位置を復元 |

---

### <a id="ja-code"></a>コード分類

#### ディレクトリ構成

```
pong/
├── index.html          エントリーポイント — HTML骨格とスクリプト読み込み順
├── css/                スタイル全般（9ファイル）
└── js/
    ├── core/           ゲームループとグローバル状態（3ファイル）
    ├── entities/       ゲームオブジェクト — ボール・パドル・AI（4ファイル）
    ├── systems/        横断サービス — 音声・入力・保存など（5ファイル）
    ├── screens/        画面UIモジュール（7ファイル）
    └── utils/          純粋なヘルパー — 数学・DOM・定数・i18n（4ファイル）
```

#### CSSファイル一覧

| ファイル | 役割 |
|---------|------|
| `reset.css` | CSSリセット / ノーマライズ |
| `variables.css` | グローバルCSS変数（色・余白・フォント） |
| `typography.css` | フォントインポート・サイズ・行高スケール |
| `layout.css` | ページ構造 — Flexbox / Grid |
| `components.css` | 再利用UIコンポーネント（ボタン・パネル・モーダル） |
| `screens.css` | 各画面固有スタイル |
| `themes.css` | `data-theme` 属性で切り替わる8テーマの色上書き |
| `animations.css` | キーフレームとトランジションアニメーション |
| `responsive.css` | 5ブレークポイントのメディアクエリ |

#### レスポンシブブレークポイント

| 名称 | 幅の範囲 | 対象デバイス |
|------|---------|------------|
| `mobile-sm` | 480 px 未満 | 小型スマートフォン |
| `mobile` | 480–767 px | 標準スマートフォン |
| `tablet` | 768–1023 px | タブレット |
| `desktop` | 1024–1439 px | デスクトップ |
| `desktop-lg` | 1440 px 以上 | 大型モニター |

#### JavaScript — `js/core/`

| ファイル | クラス / オブジェクト | 担当 |
|---------|------------------|------|
| `game.js` | `Pong.Game` | メインループ（`requestAnimationFrame`）、画面遷移、得点処理、一時停止/再開/リスタート、セーブトリガー |
| `canvas.js` | `Pong.Canvas` | Canvas初期化・リサイズ（16:9スケーリング）・フィールド描画・カラーヘルパー |
| `state.js` | `Pong.GameState` | グローバル状態オブジェクト — Canvas寸法・ゲームフラグ・現在の設定・アクティブエンティティ |

#### JavaScript — `js/entities/`

| ファイル | クラス | 担当 |
|---------|-------|------|
| `ball.js` | `Pong.Ball` | 物理更新・壁/パドル衝突・反射角計算・速度増加・描画 |
| `paddle.js` | `Pong.Paddle` | 基底クラス — 位置・クランプ・AABB矩形・描画 |
| `player.js` | `Pong.Player` | `Paddle`継承 — フレームごとにキーボード・タッチ入力を読み取る |
| `ai.js` | `Pong.AI` | `Paddle`継承 — 難易度別誤差を持つボール予測・反応遅延・アイドル時中央復帰 |

#### JavaScript — `js/systems/`

| ファイル | オブジェクト | 担当 |
|---------|-----------|------|
| `audio.js` | `Pong.Audio` | Web Audio API合成 — 16効果音 + 6BGMトラック・フェードイン/アウト・音量制御・ミュート |
| `input.js` | `Pong.Input` | キーボード・タッチ・ポインターイベントの統一管理。フレームごとの移動状態を提供 |
| `score.js` | `Pong.Score` | スコア追跡・勝利条件チェック・マッチポイント検出・DOM更新 |
| `effects.js` | `Pong.Effects` | パーティクルエミッター・スコアフラッシュ・画面シェイク・振動（`navigator.vibrate`） |
| `storage.js` | `Pong.Storage` | `localStorage`ラッパー — バージョン管理付きの設定・ゲーム状態の読み書き |

#### JavaScript — `js/screens/`

| ファイル | オブジェクト | 担当 |
|---------|-----------|------|
| `screenManager.js` | `Pong.ScreenManager` | フェードイン/アウト遷移・画面モジュールの表示/非表示管理 |
| `mainMenu.js` | `Pong.MainMenu` | タイトル・スタート/続きから/ヘルプ/設定ボタン・難易度モーダル・テーマ切替ドット |
| `gameScreen.js` | `Pong.GameScreen` | スコア表示・カウントダウン・FPSカウンター・一時停止/ミュートボタンのDOMオーバーレイ |
| `pauseMenu.js` | `Pong.PauseMenu` | 半透明一時停止オーバーレイ — 再開・リスタート・メインメニュー |
| `resultScreen.js` | `Pong.ResultScreen` | 勝利/敗北画面 — 最終スコア・もう一度・メインメニューボタン |
| `settingsScreen.js` | `Pong.SettingsScreen` | タブ式設定UI（ゲーム / サウンド / 表示）。変更時にリアルタイムプレビュー・即時保存 |
| `helpScreen.js` | `Pong.HelpScreen` | スクロール可能なヘルプ — 操作方法・ルール・難易度説明・ショートカット |

#### JavaScript — `js/utils/`

| ファイル | オブジェクト | 担当 |
|---------|-----------|------|
| `constants.js` | `CONSTANTS` | 全定数 — ボール物理・AI設定・テーマ一覧・言語一覧・localStorageキー |
| `i18n.js` | `Pong.I18n` | 翻訳参照（`t(key)`）・言語切替・`<html lang>` 更新 |
| `math.js` | `Pong.Math` | ベクトル演算・AABB-円衝突・ボール軌跡予測・`clamp`・`randomRange` |
| `dom.js` | `Pong.Dom` | `createElement`短縮記法・クラストグル・イベント委譲ヘルパー |

---

---

## <a id="traditional-chinese"></a>繁體中文

<div align="right"><a href="#english">EN</a> | <a href="#japanese">JA</a> | <a href="#traditional-chinese">ZH</a></div>

**目錄**
- [遊戲介紹](#zh-intro)
- [遊玩方式](#zh-play)
- [程式分類](#zh-code)

---

### <a id="zh-intro"></a>遊戲介紹

以經典 Pong 街機遊戲為基礎打造的現代化瀏覽器遊戲。無需任何建構工具或外部依賴，直接開啟 `index.html` 即可遊玩。

#### 基本概覽

| 項目 | 內容 |
|------|------|
| 類型 | 純前端單頁遊戲（玩家 vs AI） |
| 技術棧 | 純 HTML5 / CSS3 / Vanilla JavaScript（ES6+） |
| 渲染引擎 | HTML5 Canvas API |
| 音效系統 | Web Audio API — 所有音效於執行期動態合成 |
| 儲存機制 | `localStorage` — 儲存設定與遊戲進度 |
| 外部依賴 | **無** — 完整支援離線遊玩 |
| 目標效能 | `requestAnimationFrame` 維持 60 FPS |

#### 主要特色

| 特色 | 說明 |
|------|------|
| 零設定啟動 | 直接開啟 `index.html`，無需伺服器或建構流程 |
| 三種 AI 難度 | 簡單、普通、困難——各自有不同的速度、反應時間與預測精準度 |
| 八種配色主題 | 霓虹、經典、海洋、火焰、森林、糖果、冰川、星河——可即時切換 |
| 16 種音效 | 全部透過 Web Audio API 合成，無需音訊檔案 |
| 6 首背景音樂 | 各難度與結算畫面各有專屬 BGM |
| 響應式佈局 | 支援桌機、平板、手機；Canvas 自動縮放以適應任何螢幕尺寸 |
| 三語支援 | 繁體中文、英文、日文——可於設定中切換 |
| 自動存檔 | 每次得分與離開遊戲時自動儲存進度 |
| 豐富自訂設定 | 目標分數、球速、音量、FPS 顯示、震動回饋 |

#### 配色主題一覽

| 主題 ID | 名稱 | 主色 | 副色 | 背景色 | 風格 |
|--------|------|------|------|--------|------|
| `neon` | 霓虹 | `#00FFAA` | `#FF00FF` | `#0A0A1A` | 賽博朋克夜光 |
| `classic` | 經典 | `#FFFFFF` | `#FFFFFF` | `#000000` | 原版 Atari 復古 |
| `ocean` | 海洋 | `#00BFFF` | `#7FFFD4` | `#001428` | 深海藍調 |
| `fire` | 火焰 | `#FF6B00` | `#FFD700` | `#1A0500` | 熔岩烈焰 |
| `forest` | 森林 | `#00E676` | `#69F0AE` | `#0A1F0A` | 自然翠綠 |
| `candy` | 糖果 | `#FF4081` | `#E040FB` | `#FFF0F5` | 粉嫩馬卡龍 |
| `ice` | 冰川 | `#B0E0FF` | `#FFFFFF` | `#0D1B2A` | 極地冰藍 |
| `galaxy` | 星河 | `#C77DFF` | `#E0AAFF` | `#03001C` | 深紫宇宙 |

#### 支援瀏覽器

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome / Edge | 80 以上 |
| Firefox | 75 以上 |
| Safari | 13 以上 |
| iOS Safari | 13 以上 |
| Android Chrome | 80 以上 |

---

### <a id="zh-play"></a>遊玩方式

#### 快速開始

1. 以任意現代瀏覽器開啟 `index.html`
2. 主選單按下 **開始遊戲**
3. 選擇難度（簡單 / 普通 / 困難）
4. 3 秒倒數後對局正式開始
5. 先達到目標分數者獲勝

#### 操控說明

| 平台 | 動作 | 操控方式 |
|------|------|---------|
| 鍵盤 | 球拍上移 | `↑` 或 `W` |
| 鍵盤 | 球拍下移 | `↓` 或 `S` |
| 鍵盤 | 暫停 / 繼續 | `Esc` |
| 鍵盤 | 靜音切換 | `M` |
| 鍵盤 | 重新開始（遊戲中） | `R` |
| 行動裝置 | 球拍上移 | 在 Canvas **左半部** 向上滑動 |
| 行動裝置 | 球拍下移 | 在 Canvas **左半部** 向下滑動 |
| 行動裝置 | 暫停 | 點擊右上角暫停按鈕 |
| 行動裝置（小螢幕） | 球拍操控 | 點按畫面左側虛擬方向鍵 |

> 玩家始終操控**左側球拍**，AI 操控**右側球拍**。

#### 遊戲規則

| 規則 | 說明 |
|------|------|
| 勝利條件 | 率先達到目標分數（預設 7 分） |
| 發球 | 每次得分後，球從場地中央朝得分方發出 |
| 牆壁反彈 | 上下邊界使球反彈 |
| 角度控制 | 以球拍邊緣擊球可增大反彈角度（最大 45°） |
| 速度增幅 | 每次擊球後球速增加 +0.3 單位/幀 |
| 最高速度 | 球速上限為 15 單位/幀，防止穿透 |
| 賽末點提示 | 任一方距勝利只差 1 分時，播放警示音效 |

#### AI 難度比較

| 項目 | 簡單 | 普通 | 困難 |
|------|------|------|------|
| 移動速度 | 3.5 單位/幀 | 5.5 單位/幀 | 8.0 單位/幀 |
| 預測誤差範圍 | ±60 px | ±25 px | ±5 px |
| 反應延遲 | 200 ms | 100 ms | 16 ms |
| 追蹤頻率 | 50% | 75% | 98% |
| 反彈落點預測 | 無 | 部分 | 有（多次反彈預測） |
| 刻意失誤率 | — | — | 約 5% |

#### 設定項目

| 設定 | 選項 | 預設值 |
|------|------|--------|
| 目標分數 | 5 / 7 / 11 / 15 | 7 |
| 球速 | 慢 / 正常 / 快 | 正常 |
| 背景音樂音量 | 0 – 100% | 60% |
| 音效音量 | 0 – 100% | 80% |
| 配色主題 | 8 種主題 | 霓虹 |
| 顯示 FPS | 開 / 關 | 關 |
| 震動回饋（行動裝置） | 開 / 關 | 開 |
| 語言 | 繁體中文 / English / 日本語 | 繁體中文 |

#### 存檔系統

| 觸發時機 | 行為 |
|---------|------|
| 每次得分 | 自動存檔 |
| 暫停後返回主選單 | 自動存檔 |
| 瀏覽器分頁切換至背景 | 自動存檔 + 暫停 |
| 對局結束 | 清除存檔 |
| 繼續遊戲 | 還原分數、球位置、雙方球拍位置 |

#### 畫面流程

```
主選單
  ├── 開始遊戲 → 難度選擇 → 遊戲進行中
  ├── 繼續遊戲 → 遊戲進行中（讀取存檔）
  ├── 說明     → 說明畫面
  └── 設定     → 設定畫面

遊戲進行中
  ├── ESC / 暫停鈕 → 暫停選單
  │     ├── 繼續遊戲 → 遊戲進行中
  │     ├── 重新開始 → 遊戲進行中
  │     └── 主選單   → 主選單
  └── 達到目標分數 → 結算畫面
        ├── 再來一局 → 遊戲進行中
        └── 主選單   → 主選單
```

---

### <a id="zh-code"></a>程式分類

#### 目錄結構

```
pong/
├── index.html          入口點 — HTML 骨架與腳本載入順序
├── css/                所有樣式（9 個檔案）
└── js/
    ├── core/           遊戲迴圈與全域狀態（3 個檔案）
    ├── entities/       遊戲物件——球、球拍、AI（4 個檔案）
    ├── systems/        橫切服務——音效、輸入、儲存等（5 個檔案）
    ├── screens/        UI 畫面模組（7 個檔案）
    └── utils/          純工具函式——數學、DOM、常數、i18n（4 個檔案）
```

#### CSS 檔案說明

| 檔案 | 用途 |
|------|------|
| `reset.css` | CSS Reset / Normalize |
| `variables.css` | 全域 CSS 自訂屬性（顏色、間距、字體） |
| `typography.css` | 字體載入、字級、行高規範 |
| `layout.css` | 頁面佈局 — Flexbox / Grid 結構 |
| `components.css` | 可重用 UI 元件（按鈕、面板、對話框） |
| `screens.css` | 各畫面專屬樣式 |
| `themes.css` | `data-theme` 屬性切換的 8 種主題色彩覆蓋 |
| `animations.css` | CSS 關鍵影格與過場動畫 |
| `responsive.css` | 5 個斷點的 Media Query |

#### 響應式斷點

| 名稱 | 寬度範圍 | 代表裝置 |
|------|---------|---------|
| `mobile-sm` | 小於 480 px | 小螢幕手機 |
| `mobile` | 480–767 px | 標準手機 |
| `tablet` | 768–1023 px | 平板 |
| `desktop` | 1024–1439 px | 桌機 |
| `desktop-lg` | 大於等於 1440 px | 大螢幕顯示器 |

#### JavaScript — `js/core/`

| 檔案 | 類別 / 物件 | 職責 |
|------|-----------|------|
| `game.js` | `Pong.Game` | 主遊戲迴圈（`requestAnimationFrame`）、畫面轉換、得分處理、暫停/繼續/重新開始、存檔觸發 |
| `canvas.js` | `Pong.Canvas` | Canvas 初始化、縮放處理（16:9）、場地繪製、顏色工具函式 |
| `state.js` | `Pong.GameState` | 全域狀態物件——Canvas 尺寸、遊戲旗標、當前設定、活躍實體 |

#### JavaScript — `js/entities/`

| 檔案 | 類別 | 職責 |
|------|------|------|
| `ball.js` | `Pong.Ball` | 物理更新、牆壁/球拍碰撞、反彈角度計算、速度遞增、繪製 |
| `paddle.js` | `Pong.Paddle` | 基礎類別——位置、邊界限制、AABB 矩形、繪製 |
| `player.js` | `Pong.Player` | 繼承 `Paddle`——每幀讀取鍵盤與觸控輸入 |
| `ai.js` | `Pong.AI` | 繼承 `Paddle`——依難度設定誤差範圍的落點預測、反應延遲、閒置時回中央 |

#### JavaScript — `js/systems/`

| 檔案 | 物件 | 職責 |
|------|------|------|
| `audio.js` | `Pong.Audio` | Web Audio API 合成——16 種音效 + 6 首 BGM、淡入/淡出、音量控制、靜音切換 |
| `input.js` | `Pong.Input` | 統一管理鍵盤、觸控、指標事件；提供每幀移動狀態 |
| `score.js` | `Pong.Score` | 分數追蹤、勝負判斷、賽末點偵測、DOM 分數更新 |
| `effects.js` | `Pong.Effects` | 粒子發射器、分數閃光、畫面震動、震動回饋（`navigator.vibrate`） |
| `storage.js` | `Pong.Storage` | `localStorage` 封裝——含版本管理的設定與遊戲狀態讀寫 |

#### JavaScript — `js/screens/`

| 檔案 | 物件 | 職責 |
|------|------|------|
| `screenManager.js` | `Pong.ScreenManager` | 淡入/淡出過場動畫、按名稱管理畫面模組的顯示/隱藏 |
| `mainMenu.js` | `Pong.MainMenu` | 標題、開始/繼續/說明/設定按鈕、難度選擇 Modal、主題切換指示點 |
| `gameScreen.js` | `Pong.GameScreen` | 分數顯示、倒數計時、FPS 計數器、暫停/靜音按鈕的 DOM 覆蓋層 |
| `pauseMenu.js` | `Pong.PauseMenu` | 半透明暫停遮罩——繼續遊戲、重新開始、主選單 |
| `resultScreen.js` | `Pong.ResultScreen` | 勝負結算畫面——最終比分、再來一局、主選單按鈕 |
| `settingsScreen.js` | `Pong.SettingsScreen` | 分頁式設定 UI（遊戲設定 / 音效設定 / 視覺設定），變更即時生效並儲存 |
| `helpScreen.js` | `Pong.HelpScreen` | 可捲動說明頁——操控方式、規則、難度說明、快捷鍵 |

#### JavaScript — `js/utils/`

| 檔案 | 物件 | 職責 |
|------|------|------|
| `constants.js` | `CONSTANTS` | 所有常數——球體物理、AI 設定、主題清單、語言清單、localStorage 鍵名 |
| `i18n.js` | `Pong.I18n` | 翻譯查找（`t(key)`）、語言切換、更新 `<html lang>` 屬性 |
| `math.js` | `Pong.Math` | 向量計算、AABB-圓形碰撞偵測、球體軌跡預測、`clamp`、`randomRange` |
| `dom.js` | `Pong.Dom` | `createElement` 簡寫、class 切換、事件委派輔助函式 |

#### 腳本載入順序

所有檔案均透過普通 `<script>` 標籤依序載入：

```
constants.js → i18n.js → math.js → dom.js
  → state.js → canvas.js
  → storage.js → audio.js → input.js → score.js → effects.js
  → ball.js → paddle.js → player.js → ai.js
  → screenManager.js → mainMenu.js → gameScreen.js
    → pauseMenu.js → resultScreen.js → settingsScreen.js → helpScreen.js
  → game.js   ← DOMContentLoaded 時初始化整個遊戲
```

#### 音效系統詳細列表

**背景音樂（BGM）**

| 編號 | 名稱 | 場景 | 是否循環 |
|------|------|------|---------|
| BGM-01 | `menu_theme` | 主選單、設定、說明 | 是 |
| BGM-02 | `game_easy` | 簡單難度對局 | 是 |
| BGM-03 | `game_normal` | 普通難度對局 | 是 |
| BGM-04 | `game_hard` | 困難難度對局 | 是 |
| BGM-05 | `result_win` | 勝利結算 | 否（單次） |
| BGM-06 | `result_lose` | 失敗結算 | 否（單次） |

**音效（SFX）**

| 編號 | 名稱 | 觸發時機 |
|------|------|---------|
| SFX-01 | `paddle_hit` | 球擊中玩家球拍 |
| SFX-02 | `ai_hit` | 球擊中 AI 球拍 |
| SFX-03 | `wall_bounce` | 球碰上下牆壁 |
| SFX-04 | `player_score` | 玩家得分 |
| SFX-05 | `ai_score` | AI 得分 |
| SFX-06 | `game_start` | 倒數結束，遊戲開始 |
| SFX-07 | `game_win` | 玩家勝利 |
| SFX-08 | `game_lose` | 玩家落敗 |
| SFX-09 | `button_hover` | 滑鼠懸停按鈕 |
| SFX-10 | `button_click` | 點擊按鈕 |
| SFX-11 | `menu_open` | 開啟說明 / 設定 |
| SFX-12 | `menu_close` | 關閉說明 / 設定 |
| SFX-13 | `countdown` | 3、2、1 倒數每拍 |
| SFX-14 | `hard_speed_up` | 困難模式球大幅加速 |
| SFX-15 | `match_point` | 任一方達到賽末點 |
| SFX-16 | `paddle_edge_hit` | 球擊中球拍邊緣 |
