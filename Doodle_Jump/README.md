<a id="top"></a>

# Cloudbound

A zero-build, offline-first sky-hop game built with plain HTML, CSS, JavaScript, Canvas 2D, and Web Audio.

<a id="opening-summary"></a>

## 👋 Opening Summary

### 🇬🇧 English

Cloudbound turns an endless sky-jump loop into a fully local browser game: steer an automatically bouncing character, collect power-ups, survive increasingly varied platforms and hazards, and chase a higher score. Open `index.html` to play without a build step or network connection.

### 🇯🇵 日本語

Cloudbound は、エンドレスな空中ジャンプを完全にローカルで動くブラウザゲームとして楽しめます。自動で跳ねるキャラクターを操作し、パワーアップを集め、多彩になる足場と危険を切り抜けてハイスコアを目指します。ビルドやネットワーク接続は不要で、`index.html` を開けばプレイできます。

### 🇹🇼 繁體中文

Cloudbound 將無盡向上跳躍的核心玩法做成完全在本機運作的瀏覽器遊戲：操作會自動彈跳的角色、收集強化道具、應對越來越多變的平台與危險，並持續挑戰更高分數。無須建置或網路連線，直接開啟 `index.html` 即可遊玩。

[English](#english) · [日本語](#japanese) · [繁體中文](#traditional-chinese)

## 📚 Contents

- [👋 Opening Summary](#opening-summary)
- [🇬🇧 English](#english)
  - [🎮 Game Introduction](#en-game-introduction)
  - [✨ Features](#en-features)
  - [🕹️ Gameplay](#en-gameplay)
  - [🚀 Quick Start](#en-quick-start)
  - [🛠️ Program Overview](#en-program-overview)
  - [📁 Code Organization](#en-code-organization)
  - [💾 Supporting Systems](#en-supporting-systems)
  - [🧪 Testing](#en-testing)
  - [📌 Status and Limitations](#en-status-limitations)
- [🇯🇵 日本語](#japanese)
  - [🎮 ゲーム紹介](#ja-game-introduction)
  - [✨ 特徴](#ja-features)
  - [🕹️ 遊び方](#ja-gameplay)
  - [🚀 クイックスタート](#ja-quick-start)
  - [🛠️ プログラム概要](#ja-program-overview)
  - [📁 コード構成](#ja-code-organization)
  - [💾 サポート機能](#ja-supporting-systems)
  - [🧪 テスト](#ja-testing)
  - [📌 状況と制限](#ja-status-limitations)
- [🇹🇼 繁體中文](#traditional-chinese)
  - [🎮 遊戲介紹](#zh-game-introduction)
  - [✨ 特色](#zh-features)
  - [🕹️ 遊玩方式](#zh-gameplay)
  - [🚀 快速開始](#zh-quick-start)
  - [🛠️ 程式概覽](#zh-program-overview)
  - [📁 程式碼分類](#zh-code-organization)
  - [💾 支援系統](#zh-supporting-systems)
  - [🧪 測試](#zh-testing)
  - [📌 狀態與限制](#zh-status-limitations)
- [🌟 Closing Summary](#closing-summary)

---

<a id="english"></a>

## 🇬🇧 English

<a id="en-game-introduction"></a>

### 🎮 Game Introduction

Cloudbound is an endless vertical platform game inspired by the familiar sky-jumping format. The character bounces automatically; the player steers left or right to land on the next platform, collect items, avoid hazards, and climb as high as possible.

There is no final summit. A run ends when the character falls below the screen or touches an enemy or hazard without protection. The world becomes narrower, windier, more varied, and more dangerous as height increases.

<a id="en-features"></a>

### ✨ Features

- Runs directly from `index.html` with no build step, package manager, server, or downloaded assets.
- Fixed-step physics at 120 updates per second, smooth upward camera tracking, horizontal screen wrapping, and seeded procedural generation.
- Six main platform types, seven collectible types, monsters, flyers, spikes, and black holes.
- Height-scaled generation: special platforms, rare items, enemies, and hazards appear more often as the run advances.
- Keyboard, touch, and optional device-tilt controls, including remappable keys and tilt sensitivity.
- Three complete interface languages: `en-US`, `ja-JP`, and `zh-TW`.
- Four color themes plus high contrast, reduced motion, particle amount, and screen-shake settings.
- Browser-local continue save, automatic checkpoints, remembered player name, and a local top-20 leaderboard.
- Three synthesized BGM tracks, generated sound effects, automatic environment-based music, and independent volume controls.
- Responsive desktop, portrait mobile, and short landscape layouts.

<a id="en-gameplay"></a>

### 🕹️ Gameplay

#### Objective and core loop

1. The character jumps automatically after landing.
2. Hold left or right to line up the next platform.
3. Collect stars and power-ups while avoiding unsafe routes.
4. Keep climbing to increase score, unlock more content, and change the sky from morning to night.
5. After game over, optionally save the result to the local leaderboard and start again.

The player can wrap through the left and right edges of the 420 × 720 logical playfield. Landing is only detected while descending and requires at least 20% of the character width to overlap a platform.

#### Controls

| Action | Default input | Notes |
|---|---|---|
| Move left | `←` or `A` | The primary key can be changed in Settings. |
| Move right | `→` or `D` | The primary key can be changed in Settings. |
| Pause / resume | `Escape` or `P` | Also available from the on-screen Pause button. |
| Touch movement | Hold the left or right button | Buttons can be swapped; they move beside the canvas in short landscape layouts. |
| Tilt movement | Tilt the device | Optional, permission-based, and adjustable from sensitivity 1–5. |

There is no manual jump button. Keyboard, touch, and tilt states are merged, while simultaneous left and right input cancels out.

#### Platforms

| Platform | Behavior |
|---|---|
| Normal | Stable green landing surface. |
| Moving | Travels horizontally around its starting position. |
| Brittle | Breaks shortly after being touched. |
| Spring | Launches the character at 1.45× normal jump velocity. |
| Vanishing | Fades out after landing, then returns. |
| Cloud | Supports one landing and disappears quickly. |

The first six platforms are normal and reachable. Later generation prevents consecutive brittle/cloud platforms, forces variety after a run of normal platforms, and never places a hazard on a brittle or cloud platform.

#### Collectibles and power-ups

| Item | Effect |
|---|---|
| Star | Adds 50 points. |
| Spring shoes | Makes the next three jumps 25% stronger; the item itself adds 25 points. |
| Rocket pack | Flies upward for 2.8 seconds and prevents damage during flight; adds 25 points. |
| Shield | Blocks one hit while active, for up to 8 seconds; adds 25 points. |
| Magnet | Pulls nearby stars and lucky stars toward the player for 6 seconds; adds 25 points. |
| Slow motion | Slows gravity, wind, enemies, and platform behavior for 4 seconds; adds 25 points. |
| Lucky star | Adds 250 points and raises the rare-item roll for 5 seconds. |

The base item chance starts at 24% and continues rising with height. The generator also guarantees that no more than three newly generated main platforms in a row are without an item. Spring shoes, shields, and magnets enter the rare pool from height 60; rockets and slow motion from 350; lucky stars from 900.

#### Enemies and hazards

| Danger | Behavior |
|---|---|
| Monster | Patrols horizontally. Stomp it from above to gain 200 points and bounce; side contact is dangerous. |
| Flyer | Oscillates through the air and must be avoided or blocked. |
| Spike | A red hazardous platform that cannot be landed on safely. |
| Black hole | A large airborne collision hazard. |

Rocket flight ignores damage. A shield consumes itself to block one collision and grants brief invulnerability. Without either protection, contact ends the run. Generated hazards never occupy two adjacent main-path platforms.

#### Progression and scoring

| Source | Score |
|---|---:|
| Each newly reached meter | 1 point |
| New-platform combo landing | 10 / 20 / 30 points, capped at the third combo step |
| Star | 50 points |
| Lucky star | 250 points |
| Other power-up | 25 points |
| Monster stomp | 200 points |
| Every new 500 m milestone | 500 points |

Landing on different platforms builds combo count and best-combo statistics. Falling more than one logical screen below the combo peak breaks the current combo. Milestones are awarded only once per run.

Difficulty rises continuously rather than switching all content on at once. Platforms narrow, gaps widen, wind begins after height 650, special-platform and hazard probabilities grow, rare items become more common, and flyers take a larger share of enemy spawns. Background palettes change at heights 300, 1000, and 2500; automatic BGM follows morning/sky, sunset, and night.

#### Pause, saving, and game over

- Pausing stops the session, pauses BGM, and saves progress.
- Switching away from the browser tab pauses and saves an active run.
- Automatic checkpoints occur at each new 100 m boundary, throttled to at least five seconds between writes.
- Returning home asks for confirmation and saves the active run; Continue restores validated player, world, score, camera, and random-generator state.
- Starting over while a save exists asks before replacing it.
- Game over clears the continue save, displays run statistics, and accepts a 1–12 character nickname for the local top-20 leaderboard.
- The last valid nickname is restored for the next submission.

<a id="en-quick-start"></a>

### 🚀 Quick Start

#### Requirements

- A modern desktop or mobile browser with JavaScript and Canvas 2D enabled.
- Web Audio is optional for gameplay; device orientation support is optional for tilt controls.
- No Node.js, package manager, dependency installation, or network connection is required to play.

#### Launch the game

1. Download or clone this repository.
2. Open the repository root.
3. Open `index.html` in a browser.
4. Select **Start game**. Use a click, touch, or key press to unlock audio when the browser requires it.

The application is designed to run from `file://`. A static local server may also serve the same files, but it is not required.

<a id="en-program-overview"></a>

### 🛠️ Program Overview

Cloudbound uses browser-native technologies only:

- Semantic HTML provides the home, game, help, settings, leaderboard, modal, toast, and live-region structure.
- Layered CSS handles design tokens, components, pages, themes, accessibility, and responsive layouts.
- Plain JavaScript modules attach to the shared `window.DJGame` namespace in the explicit order listed by `index.html`.
- Canvas 2D draws the procedural background, platforms, items, enemies, particles, and player at a 420 × 720 logical resolution.
- Web Audio synthesizes all music and effects at runtime; there are no audio files.
- `requestAnimationFrame` drives rendering while `GameLoop` runs fixed 1/120-second simulation steps with an accumulator and step cap.

The main runtime flow is:

1. `App` loads and sanitizes settings, initializes localization, UI, audio, input, renderer, session, and state machine.
2. `InputManager` combines keyboard, pointer, and optional tilt input.
3. `GameLoop` sends fixed steps to `GameSession`.
4. `GameSession` applies physics, collision, buffs, scoring, difficulty, world generation, cleanup, and game-over rules.
5. `Renderer` and `HudRenderer` draw interpolated world state and update accessible HTML status.
6. The event bus connects gameplay events to audio, particles, shake, announcements, saving, and UI transitions.

Procedural runs are seeded. Saves include the PRNG state, so continuing a valid snapshot preserves deterministic future generation under the same input sequence.

<a id="en-code-organization"></a>

### 📁 Code Organization

| Path | Responsibility |
|---|---|
| `index.html` | Complete application shell and ordered CSS/JavaScript entry point. |
| `css/00-tokens.css`–`css/03-layout.css` | Design variables, reset, base rules, and shared layout. |
| `css/components/` | Buttons, cards, dialogs, forms, HUD, leaderboard, and touch controls. |
| `css/pages/` | Home, game, help, and settings page layouts. |
| `css/themes/` | Four visual themes and high-contrast overrides. |
| `css/utilities/` | Accessibility and responsive media queries. |
| `js/core/` | App composition, constants, event bus, fixed-step loop, and state machine. |
| `js/game/` | Player, physics, collision, platforms, items, enemies, camera, score, state, session, difficulty, and procedural generation. |
| `js/rendering/` | Canvas sizing, backgrounds, sprites, particles, world renderer, and HUD renderer. |
| `js/input/` | Keyboard, pointer/touch, tilt, and combined input state. |
| `js/audio/` | Web Audio context, BGM sequencer, SFX synthesizer, gains, and limiter. |
| `js/data/` | Storage adapter, settings, validated continue save, player name, and leaderboard. |
| `js/i18n/` | Locale engine and the `en-US`, `ja-JP`, and `zh-TW` dictionaries. |
| `js/ui/` | Router, screens, modal, toast, focus handling, and DOM rendering. |
| `js/utils/` | Math, seeded PRNG, validation, and performance monitoring. |
| `tests/framework/` | Promise-aware browser test harness and assertions. |
| `tests/unit/` | Focused gameplay, data, input, audio, rendering, RWD, and utility tests. |
| `tests/integration/` | Save/restore determinism, long updates, and app lifecycle tests. |
| `DOODLE_JUMP_GAME_SPEC.md` | Design and acceptance reference; runtime source remains authoritative. |

<a id="en-supporting-systems"></a>

### 💾 Supporting Systems

| System | Implemented behavior |
|---|---|
| Localization | Browser-language detection on first use, `zh-TW` fallback, complete runtime switching among three locales, localized numbers and dates. |
| Themes | `pastel-sky`, `candy-sunset`, `mint-forest`, and `neon-night`, plus an independent high-contrast toggle. |
| Settings | Master/BGM/SFX volume, mute, automatic or manual BGM track, key mapping, touch swap, tilt and sensitivity, language, theme, reduced motion, particles, and shake. Changes save immediately. |
| Persistence | `djgame.settings.v1`, `djgame.save.v1`, `djgame.leaderboard.v1`, and `djgame.player.v1` in `localStorage`; an in-memory fallback keeps the current page usable when persistent storage fails. |
| Data integrity | Settings are sanitized, save snapshots are deeply validated, arrays are capped, leaderboard entries are validated and deduplicated, and old optional fields receive safe defaults. |
| Audio | Three generated BGM note sequences and ten synthesized SFX types with an eight-voice concurrency cap. A fixed 10× BGM boost passes through user gain and a dynamics limiter; audio waits for browser gesture unlock. |
| Responsive layout | Desktop sidebars above 900 px, touch layout at 900 px and below, compact rules at 720/480 px, and side controls for landscape screens at 520 px height or less. |
| Accessibility | Semantic controls, keyboard focus management, modal focus trapping, ARIA status/live regions, high contrast, system-aware reduced motion, particle controls, and optional screen shake. |
| Performance | Object caps and cleanup, device-pixel-ratio cap of 2, automatic low quality after sustained sub-45 FPS, and recovery after sustained performance above 56 FPS. |
| Privacy | No fetch, external asset, account, telemetry, upload, or cloud-sync path is present; game data remains in the current browser profile. |

<a id="en-testing"></a>

### 🧪 Testing

The repository includes a dependency-free browser test runner with 64 registered tests.

1. Open `tests/test-runner.html` directly in a browser.
2. The complete suite starts automatically.
3. Use the module selector to run one category, or select **全部執行** to rerun everything.

Coverage includes physics, collision, camera smoothing, platform lifecycle, item effects, procedural frequency and safety rules, sessions, scoring, state transitions, input, audio, rendering quality, localization parity, storage validation, autosave, leaderboard behavior, settings, real responsive CSS at three viewport sizes, performance hysteresis, deterministic save/restore, long-run object limits, and asynchronous harness ordering.

The latest local verification completed all **64/64** browser tests in Microsoft Edge from `file://`. The game itself also starts from `index.html` without special file-access flags.

<a id="en-status-limitations"></a>

### 📌 Status and Limitations

- Current game version: `1.2.0`.
- The game is playable and endless; it has a loss condition but no final win screen or authored ending.
- Saves and rankings are local only. Clearing browser data, changing profiles, or using another device does not transfer them.
- If `localStorage` is unavailable, the memory fallback is not preserved after the page closes.
- Audio depends on Web Audio support and a user gesture; the game remains playable if audio cannot start.
- Tilt controls depend on a compatible sensor, secure browser policy, and user permission. Keyboard and touch remain available as fallbacks.
- Browser tests run in the browser; there is no npm script, command-line test package, bundler, service worker, backend, or online leaderboard.

---

<a id="japanese"></a>

## 🇯🇵 日本語

<a id="ja-game-introduction"></a>

### 🎮 ゲーム紹介

Cloudbound は、空へ向かって進み続けるエンドレス型の縦スクロールアクションゲームです。キャラクターは着地すると自動で跳ねるため、プレイヤーは左右の移動だけを調整し、次の足場へ着地しながらアイテムを集め、危険を避けて最高高度を目指します。

最終ゴールはありません。画面下へ落下するか、無防備な状態で敵や危険物に触れるとラン終了です。高度が上がるほど足場は狭くなり、風、特殊な足場、レアアイテム、敵、危険物が段階的に増えていきます。

<a id="ja-features"></a>

### ✨ 特徴

- ビルド、パッケージマネージャー、サーバー、追加アセットなしで `index.html` から直接起動できます。
- 1 秒 120 回の固定ステップ物理、滑らかな上方向カメラ、左右端のループ、シード付き自動生成を実装しています。
- 6 種類のメイン足場、7 種類の収集物、モンスター、飛行敵、トゲ、ブラックホールが登場します。
- 高度連動の生成システムにより、上へ進むほど特殊足場、レアアイテム、敵、危険物の出現率が上がります。
- キーボード、タッチ、任意の端末傾き操作に対応し、キー割り当てと傾き感度を変更できます。
- `en-US`、`ja-JP`、`zh-TW` の 3 言語に完全対応しています。
- 4 種類のカラーテーマに加え、ハイコントラスト、動きを減らす設定、パーティクル量、画面揺れを調整できます。
- ブラウザ内の続きデータ、自動チェックポイント、前回の名前、ローカル上位 20 件のランキングを利用できます。
- 3 曲の合成 BGM、生成効果音、背景環境に合わせた自動選曲、個別音量設定を備えています。
- デスクトップ、縦向きモバイル、高さの短い横向き画面へレスポンシブに対応します。

<a id="ja-gameplay"></a>

### 🕹️ 遊び方

#### 目的と基本ループ

1. キャラクターは足場に着地すると自動でジャンプします。
2. 左右を押し続け、次の足場へ位置を合わせます。
3. 星やパワーアップを集め、安全でない経路を避けます。
4. 高度を伸ばしてスコアを増やし、新しい内容を解放しながら朝から夜へ変化する空を進みます。
5. ゲームオーバー後は結果をローカルランキングへ保存し、再挑戦できます。

420 × 720 の論理プレイ領域では、左右端を通り抜けて反対側へ移動できます。着地判定は下降中だけ行われ、キャラクター幅の 20% 以上が足場と重なる必要があります。

#### 操作

| 操作 | 初期入力 | 補足 |
|---|---|---|
| 左へ移動 | `←` または `A` | メインキーは設定で変更できます。 |
| 右へ移動 | `→` または `D` | メインキーは設定で変更できます。 |
| 一時停止／再開 | `Escape` または `P` | 画面上の一時停止ボタンも利用できます。 |
| タッチ移動 | 左右ボタンを長押し | ボタン位置を交換でき、背の低い横画面では Canvas の両側へ移動します。 |
| 傾き移動 | 端末を左右へ傾ける | 任意機能です。権限が必要で、感度を 1～5 に調整できます。 |

手動ジャンプボタンはありません。キーボード、タッチ、傾きの状態は統合され、左右が同時に入力された場合は互いに打ち消します。

#### 足場

| 足場 | 動作 |
|---|---|
| 通常 | 安定した緑色の足場です。 |
| 移動 | 初期位置を中心に左右へ移動します。 |
| 壊れる | 触れた直後に崩れます。 |
| ばね | 通常の 1.45 倍のジャンプ速度で打ち上げます。 |
| 消える | 着地後にフェードアウトし、その後復帰します。 |
| 雲 | 1 回だけ受け止め、短時間で消えます。 |

最初の 6 個は到達可能な通常足場です。その後は通常足場が続きすぎないよう変化が補われ、壊れる足場と雲足場は連続しません。また、この 2 種類には危険物が重ねて配置されません。

#### 収集物とパワーアップ

| アイテム | 効果 |
|---|---|
| 星 | 50 点を加算します。 |
| ばねシューズ | 次の 3 回のジャンプを 25% 強化し、アイテム取得で 25 点を加算します。 |
| ロケットパック | 2.8 秒間上昇し、飛行中はダメージを防ぎます。取得点は 25 点です。 |
| シールド | 最大 8 秒の有効時間内に攻撃を 1 回防ぎます。取得点は 25 点です。 |
| マグネット | 6 秒間、近くの星とラッキースターを引き寄せます。取得点は 25 点です。 |
| スローモーション | 4 秒間、重力、風、敵、足場の動作を遅くします。取得点は 25 点です。 |
| ラッキースター | 250 点を加算し、5 秒間レアアイテム抽選率を上げます。 |

アイテムの基本出現率は 24% から始まり、高度とともに上昇します。新しいメイン足場が 4 個連続でアイテムなしにならない保護もあります。高さ 60 からばねシューズ、シールド、マグネット、350 からロケットとスローモーション、900 からラッキースターがレア抽選へ加わります。

#### 敵と危険

| 危険 | 動作 |
|---|---|
| モンスター | 左右に巡回します。上から踏むと 200 点を獲得して跳ね返り、横からの接触は危険です。 |
| 飛行敵 | 空中を周期的に移動し、回避または防御が必要です。 |
| トゲ | 安全に着地できない赤い危険足場です。 |
| ブラックホール | 空中に配置される大きな接触型の危険物です。 |

ロケット飛行中はダメージを受けません。シールドは接触を 1 回防いで消費され、短い無敵時間を与えます。どちらもない状態で接触するとラン終了です。自動生成された危険は、隣り合う 2 個のメイン足場へ連続配置されません。

#### 進行とスコア

| 得点源 | 得点 |
|---|---:|
| 初めて到達した高さ 1 m | 1 点 |
| 新しい足場へのコンボ着地 | 10 / 20 / 30 点。3 段階目が上限 |
| 星 | 50 点 |
| ラッキースター | 250 点 |
| その他のパワーアップ | 25 点 |
| モンスターを踏む | 200 点 |
| 新しい 500 m ごとのマイルストーン | 500 点 |

異なる足場へ着地すると現在コンボとベストコンボが増えます。コンボ最高地点から論理画面 1 枚分以上落下すると現在コンボが切れます。マイルストーン報酬はランごとに 1 回だけ加算されます。

難易度は一度に切り替わるのではなく、継続的に上昇します。足場は狭く、間隔は広くなり、高さ 650 から風が発生します。特殊足場と危険の確率、レアアイテム率、敵に占める飛行敵の割合も増加します。背景は高さ 300、1000、2500 で朝、青空、夕暮れ、夜へ変化し、自動 BGM も環境に追従します。

#### 一時停止、保存、ゲームオーバー

- 一時停止するとセッションと BGM が止まり、進行状況が保存されます。
- プレイ中にブラウザタブが非表示になると、自動的に一時停止して保存します。
- 100 m の新しい境界へ到達するたびに自動チェックポイントを作成し、書き込み間隔は最低 5 秒です。
- ホームへ戻る前には確認が表示され、進行を保存します。「続きから」は検証済みのプレイヤー、世界、スコア、カメラ、乱数状態を復元します。
- 保存済みランがある状態で最初から始める場合は、置き換える前に確認します。
- ゲームオーバーになると続きデータは削除され、結果が表示されます。1～12 文字の名前でローカル上位 20 件へ登録できます。
- 前回の有効な名前は次回入力時に復元されます。

<a id="ja-quick-start"></a>

### 🚀 クイックスタート

#### 必要環境

- JavaScript と Canvas 2D が有効な新しいデスクトップまたはモバイルブラウザ。
- Web Audio はゲーム進行には必須ではなく、端末傾き操作には対応センサーが必要です。
- プレイのために Node.js、パッケージマネージャー、依存関係の導入、ネットワーク接続は必要ありません。

#### 起動方法

1. このリポジトリをダウンロードまたはクローンします。
2. リポジトリのルートを開きます。
3. ブラウザで `index.html` を開きます。
4. **ゲーム開始**を選択します。ブラウザが要求する場合は、クリック、タッチ、またはキー入力で音声を有効にします。

アプリケーションは `file://` から直接動作するよう設計されています。同じ静的ファイルをローカルサーバーで配信することもできますが、必須ではありません。

<a id="ja-program-overview"></a>

### 🛠️ プログラム概要

Cloudbound はブラウザ標準技術だけで構成されています。

- セマンティック HTML がホーム、ゲーム、ヘルプ、設定、ランキング、モーダル、トースト、ライブリージョンを構成します。
- 階層化した CSS がデザイントークン、部品、ページ、テーマ、アクセシビリティ、レスポンシブ表示を担当します。
- プレーン JavaScript は `index.html` に記載された順序で読み込まれ、共通の `window.DJGame` 名前空間へ機能を登録します。
- Canvas 2D が 420 × 720 の論理解像度で背景、足場、アイテム、敵、パーティクル、プレイヤーを描画します。
- Web Audio が BGM と効果音を実行時に合成し、音声ファイルは使用しません。
- `requestAnimationFrame` が描画を進め、`GameLoop` がアキュムレーターと更新回数上限を使って 1/120 秒の固定シミュレーションを実行します。

主な実行フローは次のとおりです。

1. `App` が設定を読み込んで検証し、言語、UI、音声、入力、描画、セッション、状態機械を初期化します。
2. `InputManager` がキーボード、ポインター、任意の傾き入力を統合します。
3. `GameLoop` が固定ステップを `GameSession` へ渡します。
4. `GameSession` が物理、衝突、バフ、得点、難易度、世界生成、後片付け、ゲームオーバー規則を処理します。
5. `Renderer` と `HudRenderer` が補間した世界状態とアクセシブルな HTML 情報を更新します。
6. イベントバスがゲームイベントを音声、パーティクル、画面揺れ、読み上げ通知、保存、UI 遷移へ接続します。

自動生成ランにはシードがあります。保存データには PRNG 状態も含まれるため、同じ入力列で再開した場合は、その後の生成も決定的に維持されます。

<a id="ja-code-organization"></a>

### 📁 コード構成

| パス | 責務 |
|---|---|
| `index.html` | アプリ全体の HTML と、順序付き CSS／JavaScript エントリーポイント。 |
| `css/00-tokens.css`～`css/03-layout.css` | デザイン変数、リセット、基本規則、共通レイアウト。 |
| `css/components/` | ボタン、カード、ダイアログ、フォーム、HUD、ランキング、タッチ操作。 |
| `css/pages/` | ホーム、ゲーム、ヘルプ、設定ページのレイアウト。 |
| `css/themes/` | 4 種類のテーマとハイコントラスト上書き。 |
| `css/utilities/` | アクセシビリティとレスポンシブ用メディアクエリ。 |
| `js/core/` | アプリ統合、定数、イベントバス、固定ステップループ、状態機械。 |
| `js/game/` | プレイヤー、物理、衝突、足場、アイテム、敵、カメラ、得点、状態、セッション、難易度、自動生成。 |
| `js/rendering/` | Canvas サイズ、背景、スプライト、パーティクル、世界描画、HUD 描画。 |
| `js/input/` | キーボード、ポインター／タッチ、傾き、統合入力状態。 |
| `js/audio/` | Web Audio、BGM シーケンサー、効果音合成、ゲイン、リミッター。 |
| `js/data/` | ストレージ、設定、検証付き続きデータ、プレイヤー名、ランキング。 |
| `js/i18n/` | 言語エンジンと `en-US`、`ja-JP`、`zh-TW` 辞書。 |
| `js/ui/` | ルーター、各画面、モーダル、トースト、フォーカス管理、DOM 描画。 |
| `js/utils/` | 数学、シード付き PRNG、検証、性能監視。 |
| `tests/framework/` | Promise 対応ブラウザテストハーネスとアサーション。 |
| `tests/unit/` | ゲーム、データ、入力、音声、描画、RWD、ユーティリティの単体テスト。 |
| `tests/integration/` | 保存復元の決定性、長時間更新、アプリライフサイクルのテスト。 |
| `DOODLE_JUMP_GAME_SPEC.md` | 設計・受け入れ条件の参照資料。実際の動作はソースコードを正とします。 |

<a id="ja-supporting-systems"></a>

### 💾 サポート機能

| システム | 実装内容 |
|---|---|
| 多言語 | 初回にブラウザ言語を検出し、`zh-TW` をフォールバックとして 3 言語を即時切り替えます。数値と日付もローカライズします。 |
| テーマ | `pastel-sky`、`candy-sunset`、`mint-forest`、`neon-night` と、独立したハイコントラスト切り替え。 |
| 設定 | マスター／BGM／効果音音量、ミュート、自動／手動 BGM、キー、タッチ交換、傾きと感度、言語、テーマ、動き、パーティクル、画面揺れ。変更は即時保存されます。 |
| 永続化 | `djgame.settings.v1`、`djgame.save.v1`、`djgame.leaderboard.v1`、`djgame.player.v1` を `localStorage` に保存します。失敗時は現在のページを動かすためのメモリ代替を使います。 |
| データ整合性 | 設定の補正、保存スナップショットの深い検証、配列上限、ランキング検証と重複防止、旧オプション項目への安全な初期値を実装しています。 |
| 音声 | 3 種類の BGM 音列と 10 種類の効果音を合成し、同時発音数は最大 8 です。固定 10 倍の BGM ブーストはユーザーゲインとダイナミックリミッターを通り、ブラウザの操作解除を待ちます。 |
| レスポンシブ | 900 px より広い画面ではサイドバー、900 px 以下ではタッチ UI、720／480 px では圧縮表示、高さ 520 px 以下の横画面では左右サイド操作を使います。 |
| アクセシビリティ | セマンティック操作、キーボードフォーカス、モーダル内フォーカストラップ、ARIA ステータス／ライブリージョン、ハイコントラスト、システム連動の動き軽減、パーティクル、画面揺れ設定。 |
| 性能 | オブジェクト上限と削除、DPR 上限 2、45 FPS 未満が続いた時の自動低品質化、56 FPS 超が続いた後の品質復帰。 |
| プライバシー | fetch、外部アセット、アカウント、テレメトリ、アップロード、クラウド同期はなく、データは現在のブラウザプロファイル内に残ります。 |

<a id="ja-testing"></a>

### 🧪 テスト

依存関係不要のブラウザテストランナーに、64 件のテストが登録されています。

1. ブラウザで `tests/test-runner.html` を直接開きます。
2. 全テストが自動的に開始されます。
3. モジュール選択で対象を絞るか、**全部執行**を選んで再実行します。

物理、衝突、カメラ補間、足場ライフサイクル、アイテム効果、自動生成の確率と安全規則、セッション、得点、状態遷移、入力、音声、描画品質、翻訳キー一致、ストレージ検証、自動保存、ランキング、設定、3 画面幅での実 CSS、性能ヒステリシス、保存復元の決定性、長時間のオブジェクト上限、非同期テスト順序を対象としています。

直近のローカル検証では、Microsoft Edge の `file://` 実行でブラウザテスト **64/64** が完了しました。ゲーム本体も特殊なファイルアクセスフラグなしで `index.html` から起動します。

<a id="ja-status-limitations"></a>

### 📌 状況と制限

- 現在のゲームバージョンは `1.2.0` です。
- プレイ可能なエンドレスゲームで、敗北条件はありますが、最終勝利画面や固定エンディングはありません。
- 保存とランキングはローカル限定です。ブラウザデータの削除、別プロファイル、別端末へは引き継がれません。
- `localStorage` が使用できない場合、メモリ代替の内容はページを閉じると失われます。
- 音声には Web Audio とユーザー操作が必要ですが、音声を開始できなくてもゲームは続行できます。
- 傾き操作は対応センサー、ブラウザのセキュリティ方針、ユーザー権限に依存します。キーボードとタッチを代替として利用できます。
- ブラウザ内テストを採用しており、npm スクリプト、CLI テストパッケージ、バンドラー、Service Worker、バックエンド、オンラインランキングはありません。

---

<a id="traditional-chinese"></a>

## 🇹🇼 繁體中文

<a id="zh-game-introduction"></a>

### 🎮 遊戲介紹

Cloudbound 是一款無盡式垂直平台遊戲。角色每次落地都會自動彈跳，玩家只需控制左右方向，對準下一個平台、收集道具、避開危險，並挑戰更高的高度與分數。

遊戲沒有最終頂點。角色掉出畫面下方，或在沒有防護時碰到敵人與危險，就會結束本次旅程。隨高度增加，平台會逐漸縮窄、風力增強，特殊平台、稀有道具、敵人與危險也會更頻繁地出現。

<a id="zh-features"></a>

### ✨ 特色

- 直接開啟 `index.html` 即可遊玩，不需要建置、套件管理器、伺服器或額外下載素材。
- 採用每秒 120 次固定更新的物理系統、平滑上升鏡頭、左右穿越邊界與可重現的種子程序生成。
- 包含 6 種主路徑平台、7 種收集物，以及怪物、飛行敵人、尖刺和黑洞。
- 高度連動生成：越往上，特殊平台、稀有道具、敵人與危險的出現機率越高。
- 支援鍵盤、觸控與選用的裝置傾斜操作，並可自訂按鍵及傾斜靈敏度。
- 完整支援 `en-US`、`ja-JP`、`zh-TW` 三種介面語言。
- 提供 4 套配色主題，以及高對比、減少動態、粒子量和畫面震動設定。
- 具備瀏覽器本機繼續遊戲存檔、自動檢查點、暱稱記憶與本機前 20 名排行榜。
- 內建 3 首程式合成 BGM、即時生成音效、依環境自動切換曲目與獨立音量控制。
- 針對桌面、手機直向與矮螢幕橫向配置提供響應式版面。

<a id="zh-gameplay"></a>

### 🕹️ 遊玩方式

#### 目標與核心循環

1. 角色落在平台後會自動再次跳躍。
2. 按住左或右，讓角色對準下一個平台。
3. 收集星星與強化道具，同時避開不安全的路線。
4. 持續提升高度、累積分數、解鎖更多內容，並看著天空從早晨轉為夜晚。
5. 遊戲結束後，可把結果存入本機排行榜並再次挑戰。

在 420 × 720 的邏輯遊戲區域中，角色可從左右邊界穿越至另一側。只有角色下降時才會判定落地，且必須至少有角色寬度的 20% 與平台重疊。

#### 操作方式

| 動作 | 預設輸入 | 說明 |
|---|---|---|
| 向左移動 | `←` 或 `A` | 主要按鍵可在設定中修改。 |
| 向右移動 | `→` 或 `D` | 主要按鍵可在設定中修改。 |
| 暫停／繼續 | `Escape` 或 `P` | 也可使用遊戲畫面的暫停按鈕。 |
| 觸控移動 | 按住左／右按鈕 | 可交換按鈕位置；矮螢幕橫向時會移至 Canvas 兩側。 |
| 傾斜移動 | 左右傾斜裝置 | 選用功能，需要權限，靈敏度可調整為 1～5。 |

遊戲沒有手動跳躍按鈕。鍵盤、觸控與傾斜狀態會合併處理；同時輸入左右方向時會互相抵銷。

#### 平台種類

| 平台 | 行為 |
|---|---|
| 一般平台 | 穩定的綠色落腳點。 |
| 移動平台 | 以初始位置為中心左右移動。 |
| 破裂平台 | 接觸後很快碎裂。 |
| 彈簧平台 | 以一般跳躍速度的 1.45 倍彈射角色。 |
| 消失平台 | 落地後逐漸淡出，之後重新出現。 |
| 雲朵平台 | 只能承接一次，隨後快速消失。 |

開場前 6 個平台都是可到達的一般平台。後續生成會在一般平台連續過多時強制加入變化；破裂平台與雲朵平台不會連續出現，也不會在這兩種脆弱平台上疊加危險。

#### 收集物與強化道具

| 道具 | 效果 |
|---|---|
| 星星 | 增加 50 分。 |
| 彈簧鞋 | 接下來 3 次跳躍提高 25%，取得時另加 25 分。 |
| 火箭背包 | 持續向上飛行 2.8 秒，飛行期間免疫傷害；取得時加 25 分。 |
| 護盾 | 最多維持 8 秒，期間可抵擋一次傷害；取得時加 25 分。 |
| 磁鐵 | 6 秒內吸引附近的星星與幸運星；取得時加 25 分。 |
| 慢動作 | 4 秒內減慢重力、風、敵人與平台行為；取得時加 25 分。 |
| 幸運星 | 增加 250 分，並在 5 秒內提高稀有道具判定率。 |

道具基礎出現率由 24% 起步，並持續隨高度提升。生成器也保證新主路徑最多只會連續 3 個平台沒有道具。高度 60 起把彈簧鞋、護盾、磁鐵加入稀有池；350 起加入火箭與慢動作；900 起加入幸運星。

#### 敵人與危險

| 危險 | 行為 |
|---|---|
| 怪物 | 左右巡邏。從上方踩中可獲得 200 分並反彈；側面接觸很危險。 |
| 飛行敵人 | 在空中週期性移動，需要閃避或使用防護。 |
| 尖刺 | 無法安全落地的紅色危險平台。 |
| 黑洞 | 出現在空中的大型碰撞危險。 |

火箭飛行期間不會受到傷害。護盾會消耗自身來抵擋一次碰撞，並提供短暫無敵時間；兩者都沒有時，碰撞會直接結束遊戲。程序生成不會在相鄰的兩個主路徑平台上連續安排危險。

#### 進度與計分

| 得分來源 | 分數 |
|---|---:|
| 每個首次到達的新高度 1 m | 1 分 |
| 落在新平台的連擊 | 10 / 20 / 30 分，第 3 階為上限 |
| 星星 | 50 分 |
| 幸運星 | 250 分 |
| 其他強化道具 | 25 分 |
| 踩倒怪物 | 200 分 |
| 每個首次達成的 500 m 里程碑 | 500 分 |

連續落在不同平台會提高目前連擊與最佳連擊。若角色從連擊最高點向下掉落超過一個邏輯畫面，目前連擊就會中斷。每個里程碑在同一場遊戲中只會獎勵一次。

難度不是一次切換，而是持續成長。平台會縮窄、間距會增加，高度 650 起開始出現風力；特殊平台與危險機率、稀有道具比例，以及敵人中的飛行敵人比例都會逐漸上升。背景會在高度 300、1000、2500 時依序變成早晨、天空、夕陽與夜晚，自動 BGM 也會跟著環境切換。

#### 暫停、存檔與遊戲結束

- 暫停會停止遊戲流程、暫停 BGM 並保存進度。
- 遊玩中切換到其他分頁時，遊戲會自動暫停並保存。
- 每跨過新的 100 m 邊界會建立自動檢查點，兩次寫入至少間隔 5 秒。
- 返回首頁前會要求確認並保存目前旅程；「繼續遊戲」會恢復通過驗證的角色、世界、分數、鏡頭與亂數狀態。
- 已有存檔時選擇重新開始，會先確認是否取代現有進度。
- 遊戲結束會清除繼續遊戲存檔、顯示本局統計，並可用 1～12 個字元的暱稱提交至本機前 20 名排行榜。
- 上一次有效暱稱會在下次提交時自動帶入。

<a id="zh-quick-start"></a>

### 🚀 快速開始

#### 執行需求

- 啟用 JavaScript 與 Canvas 2D 的現代桌面或行動瀏覽器。
- Web Audio 並非遊玩必要條件；傾斜操作則需要裝置方向感測器支援。
- 遊玩不需要 Node.js、套件管理器、安裝相依套件或網路連線。

#### 啟動遊戲

1. 下載或複製此儲存庫。
2. 開啟儲存庫根目錄。
3. 使用瀏覽器開啟 `index.html`。
4. 選擇**開始遊戲**。若瀏覽器要求音訊解鎖，請點擊、觸控或按下任一操作鍵。

本應用程式設計為可直接從 `file://` 執行；也可以用本機靜態伺服器提供相同檔案，但不是必要條件。

<a id="zh-program-overview"></a>

### 🛠️ 程式概覽

Cloudbound 完全使用瀏覽器原生技術：

- 語意化 HTML 建立首頁、遊戲、說明、設定、排行榜、確認視窗、通知與即時朗讀區域。
- 分層 CSS 負責設計變數、元件、頁面、主題、無障礙及響應式版面。
- 純 JavaScript 依 `index.html` 明確列出的順序載入，並把模組掛載至共用的 `window.DJGame` 命名空間。
- Canvas 2D 以 420 × 720 邏輯解析度繪製程序背景、平台、道具、敵人、粒子與角色。
- Web Audio 在執行時合成全部音樂與音效，專案沒有音訊檔案。
- `requestAnimationFrame` 驅動畫面；`GameLoop` 透過累加器與步數上限執行每次 1/120 秒的固定模擬。

主要執行流程如下：

1. `App` 載入並清理設定，初始化語系、UI、音訊、輸入、繪圖、遊戲工作階段與狀態機。
2. `InputManager` 合併鍵盤、指標／觸控與選用的傾斜輸入。
3. `GameLoop` 把固定時間步交給 `GameSession`。
4. `GameSession` 處理物理、碰撞、增益效果、計分、難度、世界生成、物件清理與遊戲結束規則。
5. `Renderer` 與 `HudRenderer` 繪製插值後的世界，並更新可供輔助工具讀取的 HTML 狀態。
6. 事件匯流排把遊戲事件連接到音訊、粒子、畫面震動、朗讀公告、存檔與 UI 狀態切換。

程序生成的每一局都有種子。存檔也包含 PRNG 狀態，因此在相同輸入序列下，恢復存檔後仍會維持可重現的後續生成結果。

<a id="zh-code-organization"></a>

### 📁 程式碼分類

| 路徑 | 職責 |
|---|---|
| `index.html` | 完整應用程式外殼，以及有明確順序的 CSS／JavaScript 入口。 |
| `css/00-tokens.css`～`css/03-layout.css` | 設計變數、重設、基礎規則與共用版面。 |
| `css/components/` | 按鈕、卡片、對話框、表單、HUD、排行榜與觸控控制。 |
| `css/pages/` | 首頁、遊戲、說明與設定頁面配置。 |
| `css/themes/` | 4 套視覺主題與高對比覆寫。 |
| `css/utilities/` | 無障礙及響應式媒體查詢。 |
| `js/core/` | 應用程式組裝、常數、事件匯流排、固定步進迴圈與狀態機。 |
| `js/game/` | 角色、物理、碰撞、平台、道具、敵人、鏡頭、計分、狀態、工作階段、難度與程序生成。 |
| `js/rendering/` | Canvas 尺寸、背景、精靈圖形、粒子、世界繪圖與 HUD 繪圖。 |
| `js/input/` | 鍵盤、指標／觸控、傾斜與整合後的輸入狀態。 |
| `js/audio/` | Web Audio、BGM 序列器、音效合成、增益與限制器。 |
| `js/data/` | 儲存介面、設定、驗證式繼續遊戲存檔、玩家名稱與排行榜。 |
| `js/i18n/` | 語系引擎，以及 `en-US`、`ja-JP`、`zh-TW` 字典。 |
| `js/ui/` | 路由、各畫面、確認視窗、通知、焦點管理與 DOM 呈現。 |
| `js/utils/` | 數學、種子 PRNG、驗證與效能監控。 |
| `tests/framework/` | 支援 Promise 的瀏覽器測試框架與斷言。 |
| `tests/unit/` | 玩法、資料、輸入、音訊、繪圖、RWD 與工具單元測試。 |
| `tests/integration/` | 存檔恢復確定性、長時間更新及應用程式生命週期測試。 |
| `DOODLE_JUMP_GAME_SPEC.md` | 設計與驗收條件參考；實際執行行為仍以原始碼為準。 |

<a id="zh-supporting-systems"></a>

### 💾 支援系統

| 系統 | 已實作行為 |
|---|---|
| 多國語系 | 首次啟動偵測瀏覽器語言，以 `zh-TW` 作為後備，支援三語即時切換及在地化數字／日期。 |
| 主題 | `pastel-sky`、`candy-sunset`、`mint-forest`、`neon-night`，另有獨立高對比開關。 |
| 設定 | 主音量／BGM／音效音量、靜音、自動或手動 BGM、按鍵、觸控交換、傾斜與靈敏度、語言、主題、減少動態、粒子及畫面震動；變更會立即保存。 |
| 資料保存 | 使用 `localStorage` 儲存 `djgame.settings.v1`、`djgame.save.v1`、`djgame.leaderboard.v1`、`djgame.player.v1`；持久化失敗時以記憶體後備維持目前頁面可用。 |
| 資料完整性 | 清理設定、深層驗證存檔、限制陣列大小、驗證及去除重複排行榜項目，並為舊版選填欄位補上安全預設。 |
| 音訊 | 合成 3 組 BGM 音符序列與 10 種音效，同時發聲上限為 8。固定 10 倍 BGM 增益會通過使用者音量及動態限制器，並等待瀏覽器手勢解鎖。 |
| 響應式版面 | 900 px 以上顯示桌面側欄；900 px 以下啟用觸控配置；720／480 px 進一步壓縮；橫向且高度不超過 520 px 時使用左右側控制。 |
| 無障礙 | 語意化控制、鍵盤焦點管理、對話框焦點循環、ARIA 狀態／即時朗讀區、高對比、跟隨系統的減少動態、粒子量與畫面震動選項。 |
| 效能 | 物件數量上限與清理、裝置像素比上限 2、持續低於 45 FPS 時自動降級，以及持續高於 56 FPS 後恢復品質。 |
| 隱私 | 沒有 fetch、外部素材、帳號、遙測、上傳或雲端同步；遊戲資料只保留在目前瀏覽器設定檔。 |

<a id="zh-testing"></a>

### 🧪 測試

專案提供不需安裝相依套件的瀏覽器測試頁，共註冊 64 個測試。

1. 直接使用瀏覽器開啟 `tests/test-runner.html`。
2. 完整測試會自動開始執行。
3. 可用模組選單只執行特定分類，或按下**全部執行**重新測試全部項目。

測試涵蓋物理、碰撞、鏡頭平滑、平台生命週期、道具效果、程序生成機率與安全規則、工作階段、計分、狀態切換、輸入、音訊、繪圖品質、語系鍵一致性、儲存驗證、自動存檔、排行榜、設定、三種視窗尺寸的實際 CSS、效能遲滯、存檔恢復確定性、長時間物件上限及非同步測試順序。

最近一次本機驗證使用 Microsoft Edge 直接透過 `file://` 執行，瀏覽器測試結果為 **64/64**。遊戲本體也能在不使用特殊檔案存取旗標的情況下，直接從 `index.html` 啟動。

<a id="zh-status-limitations"></a>

### 📌 狀態與限制

- 目前遊戲版本：`1.2.0`。
- 遊戲目前可完整遊玩且為無盡模式；有失敗條件，但沒有最終勝利畫面或固定結局。
- 存檔與排行榜只存在本機。清除瀏覽器資料、切換設定檔或更換裝置都不會自動轉移。
- 若無法使用 `localStorage`，記憶體後備資料會在頁面關閉後消失。
- 音訊需要 Web Audio 支援與使用者手勢；即使音訊無法啟動，遊戲仍可繼續運作。
- 傾斜操作取決於相容的感測器、瀏覽器安全政策及使用者授權；鍵盤與觸控可作為後備。
- 測試在瀏覽器中執行；專案沒有 npm script、命令列測試套件、打包器、Service Worker、後端或線上排行榜。

---

<a id="closing-summary"></a>

## 🌟 Closing Summary

### 🇬🇧 English

Cloudbound keeps deployment deliberately small while providing a complete game system. Its direct-file runtime, deterministic generation, local persistence, accessibility options, and browser test suite make it immediately playable and approachable to maintain.

### 🇯🇵 日本語

Cloudbound は配布構成を意図的に小さく保ちながら、完全なゲームシステムを備えています。ファイルからの直接実行、決定論的な自動生成、ローカル保存、アクセシビリティ設定、ブラウザテストにより、すぐに遊べて保守にも取り組みやすい構成です。

### 🇹🇼 繁體中文

Cloudbound 在刻意維持精簡部署方式的同時，仍提供完整的遊戲系統。可直接開啟檔案執行、可重現的程序生成、本機資料保存、無障礙選項與瀏覽器測試套件，讓專案既能立即遊玩，也容易繼續維護。

[⬆️ Back to top](#top)
