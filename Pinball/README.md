# 霓虹彈珠台 / Neon Pinball / ネオンピンボール

<div align="center">

**静的 HTML5 Canvas ピンボールゲーム / Static HTML5 Canvas Pinball Game / 靜態網頁彈珠台**

</div>

---

## Language / 言語 / 語言

> Jump to your preferred language:
>
> - [English](#english)
> - [日本語](#日本語)
> - [繁體中文](#繁體中文)

---

<br>

# English

## Table of Contents

- [Overview](#overview)
- [How to Play](#how-to-play)
  - [Controls](#controls)
  - [Launch the Ball](#launch-the-ball)
  - [Pause & Menu](#pause--menu)
- [Game Rules](#game-rules)
  - [Objective](#objective)
  - [Ball & Ball Save](#ball--ball-save)
  - [Scoring](#scoring)
  - [Combo & Multiplier](#combo--multiplier)
  - [Jackpot & Multiball](#jackpot--multiball)
  - [Extra Ball](#extra-ball)
  - [Difficulty](#difficulty)
- [Themes](#themes)
- [Program Structure](#program-structure)
  - [Directory Layout](#directory-layout)
  - [JavaScript Modules](#javascript-modules)
  - [CSS Modules](#css-modules)

---

## Overview

**Neon Pinball** is a fully self-contained, no-build, no-server browser pinball game built with vanilla JavaScript and the HTML5 Canvas API. Drop the folder on any static host or simply open `index.html` in a modern browser — no installation required.

| Property | Value |
|---|---|
| Canvas size | 540 × 960 px |
| Starting balls | 3 |
| Physics rate | 120 Hz fixed timestep |
| Audio | Web Audio API (programmatic synth) |
| Storage | `localStorage` (high score, settings, save state) |

---

## How to Play

### Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Left flipper | `A` or `←` | Touch **Left** button |
| Right flipper | `D` or `→` | Touch **Right** button |
| Charge plunger | Hold `Space`, `↓`, or `S` | Hold **Launch** button |
| Fire | Release `Space` / `↓` / `S` | Release **Launch** button |
| Pause / Resume | `Esc` or on-screen **Ⅱ** button | Same |
| Back to menu | On-screen **⌂** button | Same |

### Launch the Ball

1. The ball starts locked in the **shooter lane** on the right side of the board.
2. **Hold** the launch key to charge the plunger — the longer you hold, the more power.
3. **Release** to fire. A full charge launches the ball all the way to the top of the shooter lane, where it passes through the gate and enters the main playfield.
4. If you release too early and the ball lacks enough speed to clear the gate, it rolls back to the rest position without costing a ball.

### Pause & Menu

- Press **Esc** (or the **Ⅱ** button) at any time during play to pause. While paused, flipper and plunger inputs are ignored.
- The pause overlay offers **Resume**, **Save & Exit**, and **Restart**.
- Selecting **Save & Exit** or tapping **⌂** during play writes the current score, ball count, combo, multiplier, jackpot progress, and extra-ball status to `localStorage` so you can continue later via the **Continue** button on the main menu.

---

## Game Rules

### Objective

Score as many points as possible before all balls drain. Rack up combos, clear target banks, and trigger the jackpot to unlock multiball mode.

### Ball & Ball Save

- Each game starts with **3 balls**.
- After launching, a **ball save** window of **7.5 seconds** is active. If the ball drains during this window, it is returned to the shooter for free.
- Once the ball is on the main playfield, draining it counts as a lost ball.
- If multiple balls are on the playfield (multiball mode), losing one ball does not cost a reserve ball — only the last ball draining triggers the count-down.
- When the last reserve ball drains, the game ends.

### Scoring

| Event | Base Points |
|---|---|
| Bumper hit | 100 |
| Target hit | 250 |
| Rollover (lane) | 350 |
| Ramp | 500 |
| Full bank clear | 900 |
| Jackpot | 5,000 |

> All base values are multiplied by the current **score multiplier** before being added to the total.

### Combo & Multiplier

- A **combo** counter tracks consecutive scoring events. Any two scoring events within a **2,400 ms** window extend the combo.
- The multiplier advances by 1 for every 5 combo hits, capping at **×5**.
- Draining a ball resets both the combo and the multiplier to their default values (0 and ×1).
- Clearing an entire target bank (left or right) immediately raises the multiplier by 1, regardless of the current combo.

### Jackpot & Multiball

- A **JACKPOT** progress bar (7 segments) fills as you hit scoring objects:
  - Bumper: +0.25 segments
  - Rollover: +0.5 segments
  - Target / Ramp: +1 segment
- When the bar reaches 7, the **Jackpot** fires (5,000 × multiplier points) and the bar resets.
- If fewer than 3 balls are currently on the playfield at jackpot time, **2 additional balls** are added to trigger **Multiball** mode.

### Extra Ball

- Reaching a cumulative score of **35,000 points** awards **+1 extra ball** (once per game).

### Difficulty

| Level | Flipper size |
|---|---|
| Easy | 100 % (default length 96 px) |
| Normal | 90 % (length ≈ 86 px) |
| Hard | 85 % (length ≈ 82 px) |

Gravity, friction, restitution, and flipper force are identical across all difficulties — only the flipper length changes.

---

## Themes

Six built-in color themes can be selected from the **Settings** screen. Themes are applied as a `data-theme` attribute on `<body>` and use CSS custom properties.

| Theme | Primary | Secondary | Accent |
|---|---|---|---|
| **Neon** (default) | `#ff2d95` | `#00e5ff` | `#faff00` |
| **Classic** | `#e63946` | `#ffb703` | `#fefae0` |
| **Ocean** | `#00b4d8` | `#caf0f8` | `#48cae4` |
| **Forest** | `#2d6a4f` | `#d8f3dc` | `#fca311` |
| **Sunset** | `#ff006e` | `#ffbe0b` | `#3a86ff` |
| **Mono** | `#ffffff` | `#999999` | `#ffd60a` |

---

## Program Structure

### Directory Layout

```
Pinball/
├── index.html              # Entry point, HTML structure
├── css/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # Global CSS custom properties & tokens
│   ├── base.css            # Body, typography baseline
│   ├── layout.css          # App shell & screen layout
│   ├── components.css      # Shared UI components (buttons, cards…)
│   ├── screen-menu.css     # Main menu screen styles
│   ├── screen-game.css     # Game screen & HUD styles
│   ├── screen-help.css     # Help / instructions screen
│   ├── screen-settings.css # Settings screen styles
│   ├── themes.css          # Color theme overrides
│   └── responsive.css      # Responsive & mobile breakpoints
└── js/
    ├── config.js           # Global constants (CONFIG object)
    ├── utils.js            # Pure utility helpers
    ├── main.js             # Boot sequence & Game class
    ├── core/
    │   ├── game-loop.js    # Fixed-timestep game loop
    │   ├── physics.js      # Physics math primitives
    │   ├── collision.js    # Collision detection algorithms
    │   └── renderer.js     # Canvas 2D rendering + attract mode
    ├── entities/
    │   ├── ball.js         # Ball state & movement
    │   ├── flipper.js      # Flipper physics & collision
    │   ├── bumper.js       # Bumper collision & pulse
    │   ├── target.js       # Drop target & rollover logic
    │   ├── plunger.js      # Plunger charge/release
    │   └── wall.js         # Static wall segment
    ├── ui/
    │   ├── screen-manager.js  # Screen transition controller
    │   ├── menu.js            # Main menu logic
    │   ├── hud.js             # In-game HUD updater
    │   ├── settings.js        # Settings panel logic
    │   └── input.js           # Keyboard & touch input
    └── audio/
        ├── audio-manager.js   # Web Audio context, BGM sequencer
        └── sound-effects.js   # Procedural SFX library
```

### JavaScript Modules

All modules attach to the single global namespace `window.Pinball` using IIFEs — no module bundler is required.

---

#### `js/config.js` — Global Configuration

Defines `window.Pinball.CONFIG`, the single source of truth for all game constants.

| Namespace | Key constants |
|---|---|
| `CONFIG.BOARD` | `width=540`, `height=960`, `ballRadius=12`, `maxSpeed=1450`, `drainY=988`, `shooterX=491` |
| `CONFIG.SCORE` | `bumper=100`, `target=250`, `ramp=500`, `rollover=350`, `jackpot=5000`, `extraBallAt=35000` |
| `CONFIG.GAME` | `startingBalls=3`, `comboWindowMs=2400`, `messageMs=1700` |
| `CONFIG.DIFFICULTY` | `easy / normal / hard` — each holds `gravity`, `friction`, `restitution`, `flipperForce`, `ballSaveMs`, `flipperScale` |
| `CONFIG.DEFAULT_SETTINGS` | `theme="neon"`, `bgmVolume=0.45`, `sfxVolume=0.8`, `muted=false`, `difficulty="normal"` |
| `CONFIG.STORAGE` | `localStorage` key strings for high score, settings, and saved game |

---

#### `js/utils.js` — Utility Functions

Pure, side-effect-free helpers exposed as `window.Pinball.Utils`.

| Function | Description |
|---|---|
| `clamp(value, min, max)` | Clamps a number to [min, max] |
| `lerp(a, b, t)` | Linear interpolation |
| `distance(ax, ay, bx, by)` | Euclidean distance |
| `normalize(x, y)` | Returns `{x, y, length}` unit vector |
| `dot(ax, ay, bx, by)` | 2D dot product |
| `formatScore(score)` | Formats integer as locale string (e.g. `12,345`) |
| `loadJSON / saveJSON` | `localStorage` JSON helpers with try/catch |
| `loadNumber / saveNumber` | `localStorage` number helpers |
| `clearStorage(keys[])` | Removes given `localStorage` keys |
| `getCssColor(name, fallback)` | Reads a CSS custom property from `<body>` |
| `vibrate(pattern)` | Calls `navigator.vibrate` if available |

---

#### `js/main.js` — Boot & Game Controller

Contains the `Game` class (the central game controller) and the `boot()` function that wires everything together.

**`Game` class — key responsibilities:**

| Method | Responsibility |
|---|---|
| `resetTable()` | Re-creates all entities and resets all state for a new game |
| `newGame()` | Clears save, resets table, spawns ball, starts loop |
| `continueGame()` | Loads save from `localStorage`, restores state, starts loop |
| `update(dt)` | Per-step: advances plunger, flippers, bumpers, targets, balls; checks drains |
| `updateBall(ball, dt)` | Runs physics, shooter-lane routing, wall/bumper/target/flipper/ramp collisions |
| `checkRamp(ball)` | Detects ball entering left/right ramp zones and applies velocity boost |
| `checkTargetBanks()` | Awards multiplier when all targets in a bank are knocked down |
| `addScore(base, label, sfx)` | Applies multiplier, updates combo, plays SFX, checks extra-ball threshold |
| `drainBall(index)` | Handles ball save, multiball continuation, ball count decrement, game over |
| `awardJackpot()` | Awards 5 000 pts and triggers multiball if < 3 balls on field |
| `pause() / resume()` | Freezes/resumes game state; saves progress on pause |
| `saveGame()` | Persists score/balls/combo/multiplier/jackpot progress to `localStorage` |
| `render()` | Delegates to `Renderer.render()` |

---

#### `js/core/game-loop.js` — Fixed-Timestep Loop

Implements a **semi-fixed timestep** loop using `requestAnimationFrame`.

- Fixed update step: **1/120 s** (120 Hz)
- Maximum frame delta clamped to **80 ms** to prevent spiral of death on tab-blur
- Accumulator drains in fixed steps; remaining alpha is passed to `render()` for interpolation

```
tick(time)
  delta = clamp(time - lastTime, 0, 80ms)
  accumulator += delta
  while accumulator >= step:
      update(step)          ← deterministic physics
      accumulator -= step
  render(accumulator / step) ← visual interpolation
```

---

#### `js/core/physics.js` — Physics Primitives

Low-level math exposed as `window.Pinball.Physics`.

| Function | Description |
|---|---|
| `limitSpeed(body, max)` | Scales velocity vector down if speed exceeds `max` |
| `reflectVelocity(body, nx, ny, restitution)` | Reflects velocity about surface normal with restitution coefficient |
| `applyImpulse(body, nx, ny, force)` | Adds an impulse along a direction |
| `closestPointOnSegment(px,py, ax,ay, bx,by)` | Returns nearest point on line segment AB to point P |
| `anglePoint(x, y, length, angle)` | Returns the tip of a ray from (x,y) at `angle` for `length` units |

---

#### `js/core/collision.js` — Collision Detection

Four algorithms covering all entity shapes.

| Function | Shape pair | Used by |
|---|---|---|
| `collideCircleSegment(ball, segment, e)` | Circle ↔ line segment | Walls |
| `collideCircleCapsule(ball, x1,y1, x2,y2, r, e)` | Circle ↔ capsule | Flippers |
| `collideCircleCircle(ball, circle, e, impulse)` | Circle ↔ circle | Bumpers |
| `collideCircleRect(ball, rect, e, impulse)` | Circle ↔ AABB | Targets |

Each function: resolves overlap (pushes ball out), reflects velocity with restitution, and optionally applies an extra repulsion impulse. Returns a hit descriptor `{nx, ny, overlap}` or `null`.

---

#### `js/core/renderer.js` — Canvas Renderer

Draws the entire game each frame using the 2D Canvas API. Theme colors are re-read from CSS custom properties every frame (`refreshTheme()`), ensuring instant live theme switching.

| Method | What it draws |
|---|---|
| `drawPlayfield()` | Gradient background, decorative scan-lines, shooter lane, ball-save indicator |
| `drawWalls()` | All wall segments (rail = dim white, rubber = glowing cyan, gate = glowing green) |
| `drawRamps()` | Arc-shaped ramp paths; pulses on activation |
| `drawBumpers()` | Circular bumpers with glow pulse and letter labels |
| `drawTargets()` | Rounded-rect targets; dim when knocked down, lit when recently hit |
| `drawFlippers()` | Capsule-shaped flippers; accent color + stronger glow when active |
| `drawPlunger()` | Plunger rod and platform; rises with charge level |
| `drawBalls()` | Radial-gradient ball with trailing ghost trail |
| `drawLamps()` | JACKPOT letter lamps (J-A-C-K-P-O-T) lit proportionally to progress |
| `drawBoardText()` | Board title; "GAME OVER" overlay on end state |
| `drawAttract(canvas)` | Static attract-mode preview drawn on the menu screen canvas |

---

#### `js/entities/ball.js` — Ball

| Property / Method | Description |
|---|---|
| `x, y, vx, vy` | Position and velocity |
| `r` | Radius (default 12 px) |
| `inShooter` | True while locked in shooter; physics skips gravity |
| `fromShooter` | True while traveling through shooter lane after launch |
| `trail[]` | Ring buffer of last 12 positions for motion-blur trail |
| `update(dt, physics)` | Applies gravity, friction, speed limit, Euler integration, updates trail |
| `launch(power)` | Converts 0–1 power to initial velocity and sets `fromShooter = true` |
| `setShooterRest()` | Returns ball to shooter rest position and clears trail |

---

#### `js/entities/flipper.js` — Flipper

| Property / Method | Description |
|---|---|
| `side` | `"left"` or `"right"` |
| `pivotX, pivotY` | Rotation center in board coordinates |
| `length, width` | Scaled by `flipperScale` from difficulty settings |
| `restAngle / activeAngle` | Angles in radians for down/up positions |
| `angularVelocity` | Computed each frame; used to impart angular momentum to the ball |
| `update(dt)` | Exponential approach to target angle; computes `angularVelocity` |
| `tip()` | Returns tip position via `anglePoint` |
| `collide(ball, physics)` | Capsule collision; applies `flipperForce` upward lift + lateral push + angular kick |

---

#### `js/entities/bumper.js` — Bumper

Circular pop bumpers that repel the ball and score on contact.

| Property | Value |
|---|---|
| Label | `A`, `B`, or `C` |
| Radius | 34 – 38 px |
| Impulse | 420 px/s |
| Cooldown | 70 ms between activations |
| `pulse` | Drives glow animation, decays at 4.8× per second |

---

#### `js/entities/target.js` — Target

Two types of targets:

| Type | Behavior |
|---|---|
| `"target"` (drop target) | Knocked flat (`down=true`) on hit; resets when its bank is cleared |
| `"rollover"` (lane sensor) | Scores and lights on contact but does not stay down |

Targets also carry a `lit` flag that drives a yellow highlight glow, and a `pulse` value for the hit flash animation.

---

#### `js/entities/plunger.js` — Plunger

Manages the spring-launch mechanism.

| Method | Description |
|---|---|
| `start()` | Begins charging (`charge` increases at 0.75/s, max 1.0) |
| `release()` | Stops charging, returns current power (min 0.18), resets charge |
| `update(dt)` | Advances or decays charge; manages cooldown (220 ms) between shots |

---

#### `js/entities/wall.js` — Wall

A static line-segment obstacle defined by `(x1, y1) → (x2, y2)` and a `kind` tag (`"rail"`, `"rubber"`, `"gate"`). The kind tag controls rendering style (opacity, glow color) and is passed through to collision for visual feedback.

---

#### `js/ui/screen-manager.js` — Screen Manager

Controls which of the four screens (`menu`, `game`, `help`, `settings`) is visible by toggling the `is-active` CSS class. Fires `onChange` callbacks and switches the BGM track when the active screen changes.

---

#### `js/ui/menu.js` — Main Menu

Binds **Start**, **Continue**, **Help**, and **Settings** buttons and refreshes the high-score display and **Continue** button availability based on `localStorage` state.

---

#### `js/ui/hud.js` — HUD

Reads game state each frame and writes score, ball count, multiplier, and combo values to the four `<strong>` elements in the HUD panel. Also updates the floating message overlay.

---

#### `js/ui/settings.js` — Settings Panel

| Setting | Type | Persisted |
|---|---|---|
| Theme | Radio (6 color swatches) | Yes — `localStorage` |
| BGM volume | Range 0–100 | Yes |
| SFX volume | Range 0–100 | Yes |
| Mute | Checkbox | Yes |
| Difficulty | Segmented (Easy / Normal / Hard) | Yes |
| Clear records | Button | Removes high score + saved game |

Changes are applied and persisted immediately; the game re-creates its flippers and re-configures the audio manager on every settings change.

---

#### `js/ui/input.js` — Input Controller

Maps keyboard and touch events to game actions.

- **Keyboard:** `keydown` / `keyup` on `window`; duplicate-key guard via `this.keys{}`.
- **Touch:** `pointerdown` / `pointerup` / `pointercancel` / `pointerleave` on each button element. Each touch event calls `AudioManager.unlock()` to satisfy browser autoplay policies.

---

#### `js/audio/audio-manager.js` — Audio Manager

Manages a single `AudioContext` plus two `GainNode` buses (BGM and SFX).

**BGM Sequencer** — step sequencer driven by `setInterval`:

| Track | Wave types | Tempo |
|---|---|---|
| `menu` | triangle melody, sine bass | 165 ms/step |
| `game` | square melody, sawtooth bass | 145 ms/step |

Each step plays a melody note, a bass note, and chord tones (every 4 steps). The `AudioContext` is created lazily on the first user interaction to satisfy browser autoplay policies.

---

#### `js/audio/sound-effects.js` — Sound Effects Library

All SFX are synthesized in real time using the Web Audio API — no audio files are needed.

| Key | Sound |
|---|---|
| `launch` | Sawtooth sweep upward + noise burst |
| `flipper` | Short square click + noise snap |
| `bumper` | Dual-tone sine chime |
| `wall` | Soft triangle tap |
| `target` | Two-tone sine ping |
| `score` | Short triangle blip |
| `combo` | Dual sine, pitch scales with combo level |
| `jackpot` | 5-note ascending triangle fanfare |
| `extraBall` | 4-note ascending sine arpeggio |
| `multiball` | 5-note ascending sawtooth ramp |
| `drain` | Sawtooth pitch-fall |
| `gameOver` | 4-note descending triangle |
| `newHighScore` | 6-note ascending fanfare |
| `ramp` | Sine sweep from low to high |
| `uiClick` | Short square blip |
| `screenChange` | Triangle sweep |

---

### CSS Modules

| File | Responsibility |
|---|---|
| `reset.css` | Box-model reset and sensible browser defaults |
| `variables.css` | All CSS custom properties: font stack, sizes, radii, colors (`--c-*`) |
| `base.css` | Body font, color, touch-action, text-rendering |
| `layout.css` | `.app-shell` full-viewport container; `.screen` show/hide transitions |
| `components.css` | `.button`, `.icon-button`, `.range-row`, `.toggle-row`, `.segmented`, `.theme-swatch` |
| `screen-menu.css` | Menu two-column layout, brand panel, score strip, attract canvas |
| `screen-game.css` | Game layout: HUD sidebar, board wrapper, touch control bar |
| `screen-help.css` | Help info-card grid |
| `screen-settings.css` | Settings form, fieldset groupings |
| `themes.css` | `[data-theme="classic|ocean|forest|sunset|mono"]` color overrides |
| `responsive.css` | Mobile breakpoints: stacks columns, enlarges touch targets |

---

<br>
<br>

---

# 日本語

## 目次

- [ゲーム概要](#ゲーム概要)
- [遊び方](#遊び方)
  - [操作方法](#操作方法)
  - [ボールの発射](#ボールの発射)
  - [一時停止とメニュー](#一時停止とメニュー)
- [ゲームルール](#ゲームルール)
  - [目的](#目的)
  - [ボールとボールセーブ](#ボールとボールセーブ)
  - [得点表](#得点表)
  - [コンボと倍率](#コンボと倍率)
  - [ジャックポットとマルチボール](#ジャックポットとマルチボール)
  - [追加ボール](#追加ボール)
  - [難易度](#難易度)
- [テーマ](#テーマ)
- [プログラム構成](#プログラム構成)
  - [ディレクトリ構成](#ディレクトリ構成)
  - [JavaScript モジュール詳細](#javascript-モジュール詳細)
  - [CSS モジュール詳細](#css-モジュール詳細)

---

## ゲーム概要

**ネオンピンボール**は、Vanilla JavaScript と HTML5 Canvas API のみで構築された完全スタンドアロンのブラウザピンボールゲームです。ビルドツールやサーバーは不要で、`index.html` をモダンブラウザで開くだけで動作します。

| 項目 | 値 |
|---|---|
| キャンバスサイズ | 540 × 960 px |
| 開始ボール数 | 3 |
| 物理演算レート | 120 Hz 固定タイムステップ |
| オーディオ | Web Audio API（プログラム合成） |
| データ保存 | `localStorage`（ハイスコア・設定・セーブデータ） |

---

## 遊び方

### 操作方法

| アクション | キーボード | モバイル |
|---|---|---|
| 左フリッパー | `A` または `←` | **左**ボタンをタッチ |
| 右フリッパー | `D` または `→` | **右**ボタンをタッチ |
| プランジャー蓄力 | `Space`・`↓`・`S` を長押し | **発射**ボタンを長押し |
| 発射 | `Space` / `↓` / `S` を離す | **発射**ボタンを離す |
| 一時停止 / 再開 | `Esc` または画面上の **Ⅱ** | 同上 |
| メニューへ戻る | 画面上の **⌂** | 同上 |

### ボールの発射

1. ゲーム開始時、ボールはボード右側の**シューターレーン**に固定されています。
2. 発射キーを**長押し**してプランジャーをチャージします。長押しするほど発射力が上がります。
3. キーを**離す**と発射。十分なチャージでボールはシューターレーン上部のゲートを通過してメインフィールドへ入ります。
4. チャージが不十分でゲートを越えられなかった場合、ボールは自動的に発射台に戻ります（ボールは消費されません）。

### 一時停止とメニュー

- プレイ中いつでも **Esc**（または **Ⅱ** ボタン）で一時停止できます。一時停止中はフリッパーと発射操作が無効になります。
- 一時停止オーバーレイには **再開**・**保存して終了**・**リスタート** の 3 つのボタンがあります。
- **保存して終了** または **⌂** を選ぶと、現在のスコア・ボール数・コンボ・倍率・ジャックポット進行度・追加ボール取得状況が `localStorage` に保存され、メインメニューの **続ける** ボタンから再開できます。

---

## ゲームルール

### 目的

すべてのボールがなくなるまでできるだけ高いスコアを稼いでください。コンボを繋ぎ、ターゲットバンクをクリアし、ジャックポットを発動してマルチボールモードを解放するのが高得点への近道です。

### ボールとボールセーブ

- 各ゲームは **3 ボール** から始まります。
- 発射後 **7.5 秒間** は **ボールセーブ** が有効です。この間にボールがドレインした場合、ボールは無料で発射台に戻ります。
- ボールがメインフィールドに入った後にドレインすると、ボールが 1 つ消費されます。
- マルチボール中は複数のボールが同時にフィールドにあります。1 つドレインしても、フィールドにボールが残っている限りは予備ボールは減りません。
- 最後の予備ボールがドレインするとゲームオーバーになります。

### 得点表

| イベント | 基本点数 |
|---|---|
| バンパーヒット | 100 点 |
| ターゲットヒット | 250 点 |
| ローラーオーバー（レーン） | 350 点 |
| ランプ | 500 点 |
| バンク全クリア | 900 点 |
| ジャックポット | 5,000 点 |

> すべての基本点数は加算前に現在の**スコア倍率**が掛けられます。

### コンボと倍率

- **コンボ**カウンターは連続得点イベントを追跡します。**2,400 ms** 以内の連続スコアリングでコンボが延長されます。
- コンボ 5 回ごとに倍率が 1 上昇し、最大 **×5** まで上がります。
- ボールをドレインするとコンボと倍率は初期値（0 と ×1）にリセットされます。
- ターゲットバンク（左または右）をすべて倒すと、コンボに関係なく倍率が即座に 1 上昇します。

### ジャックポットとマルチボール

- **JACKPOT** プログレスバー（7 セグメント）は得点オブジェクトへの命中で増加します：
  - バンパー：+0.25 セグメント
  - ローラーオーバー：+0.5 セグメント
  - ターゲット / ランプ：+1 セグメント
- バーが 7 に達すると**ジャックポット**が発動（5,000 × 倍率 点）してバーがリセットされます。
- ジャックポット発動時にフィールドのボールが 3 未満の場合、**2 個のボールが追加**されて**マルチボール**モードが始まります。

### 追加ボール

- 累計スコアが **35,000 点** に達すると **+1 ボール** が追加されます（1 ゲームにつき 1 回限り）。

### 難易度

| レベル | フリッパーの長さ |
|---|---|
| 簡単 | 100 %（デフォルト 96 px） |
| 普通 | 90 %（約 86 px） |
| 困難 | 85 %（約 82 px） |

重力・摩擦・反発係数・フリッパー力は全難易度で同一です。変わるのはフリッパーの長さだけです。

---

## テーマ

**設定**画面から 6 種類の組み込みカラーテーマを選択できます。テーマは `<body>` の `data-theme` 属性を変更し、CSS カスタムプロパティを上書きします。

| テーマ | プライマリ | セカンダリ | アクセント |
|---|---|---|---|
| **ネオン**（デフォルト） | `#ff2d95` | `#00e5ff` | `#faff00` |
| **クラシック** | `#e63946` | `#ffb703` | `#fefae0` |
| **オーシャン** | `#00b4d8` | `#caf0f8` | `#48cae4` |
| **フォレスト** | `#2d6a4f` | `#d8f3dc` | `#fca311` |
| **サンセット** | `#ff006e` | `#ffbe0b` | `#3a86ff` |
| **モノクロ** | `#ffffff` | `#999999` | `#ffd60a` |

---

## プログラム構成

### ディレクトリ構成

```
Pinball/
├── index.html              # エントリポイント・HTML 構造
├── css/
│   ├── reset.css           # CSS リセット
│   ├── variables.css       # グローバル CSS カスタムプロパティ
│   ├── base.css            # ボディ・タイポグラフィ基本スタイル
│   ├── layout.css          # アプリシェル・画面レイアウト
│   ├── components.css      # 共有 UI コンポーネント
│   ├── screen-menu.css     # メインメニュー画面スタイル
│   ├── screen-game.css     # ゲーム画面・HUD スタイル
│   ├── screen-help.css     # ヘルプ画面スタイル
│   ├── screen-settings.css # 設定画面スタイル
│   ├── themes.css          # カラーテーマ上書き
│   └── responsive.css      # レスポンシブ・モバイル対応
└── js/
    ├── config.js           # グローバル定数（CONFIG オブジェクト）
    ├── utils.js            # ユーティリティ関数群
    ├── main.js             # 起動処理・Game クラス
    ├── core/
    │   ├── game-loop.js    # 固定タイムステップゲームループ
    │   ├── physics.js      # 物理演算プリミティブ
    │   ├── collision.js    # 衝突検出アルゴリズム
    │   └── renderer.js     # Canvas 2D レンダラー・アトラクトモード
    ├── entities/
    │   ├── ball.js         # ボール状態と移動
    │   ├── flipper.js      # フリッパー物理・衝突
    │   ├── bumper.js       # バンパー衝突・パルス
    │   ├── target.js       # ドロップターゲット・ローラーオーバー
    │   ├── plunger.js      # プランジャーのチャージ・リリース
    │   └── wall.js         # 静的ウォールセグメント
    ├── ui/
    │   ├── screen-manager.js  # 画面遷移コントローラー
    │   ├── menu.js            # メインメニューロジック
    │   ├── hud.js             # ゲーム内 HUD 更新
    │   ├── settings.js        # 設定パネルロジック
    │   └── input.js           # キーボード・タッチ入力
    └── audio/
        ├── audio-manager.js   # Web Audio コンテキスト・BGM シーケンサー
        └── sound-effects.js   # プロシージャル SFX ライブラリ
```

### JavaScript モジュール詳細

すべてのモジュールは IIFE を使って `window.Pinball` 名前空間に登録されます。モジュールバンドラーは不要です。

---

#### `js/config.js` — グローバル設定

`window.Pinball.CONFIG` にゲーム全体の定数を集約します。

| 名前空間 | 主要定数 |
|---|---|
| `CONFIG.BOARD` | `width=540`, `height=960`, `ballRadius=12`, `maxSpeed=1450`, `drainY=988` |
| `CONFIG.SCORE` | `bumper=100`, `target=250`, `ramp=500`, `rollover=350`, `jackpot=5000`, `extraBallAt=35000` |
| `CONFIG.GAME` | `startingBalls=3`, `comboWindowMs=2400`, `messageMs=1700` |
| `CONFIG.DIFFICULTY` | `easy/normal/hard` — 各難易度の物理パラメータとフリッパースケール |
| `CONFIG.DEFAULT_SETTINGS` | デフォルトテーマ・音量・難易度 |
| `CONFIG.STORAGE` | `localStorage` キー文字列 |

---

#### `js/utils.js` — ユーティリティ関数

副作用のない純粋な汎用ヘルパー群（`window.Pinball.Utils`）。

| 関数 | 説明 |
|---|---|
| `clamp(v, min, max)` | 数値を [min, max] に制限 |
| `lerp(a, b, t)` | 線形補間 |
| `distance(ax,ay,bx,by)` | ユークリッド距離 |
| `normalize(x, y)` | 単位ベクトル `{x, y, length}` を返す |
| `dot(ax,ay,bx,by)` | 2D 内積 |
| `formatScore(score)` | スコアをロケール文字列にフォーマット |
| `loadJSON / saveJSON` | `localStorage` JSON 入出力（例外ガード付き） |
| `loadNumber / saveNumber` | `localStorage` 数値入出力 |
| `clearStorage(keys[])` | 指定キーを `localStorage` から削除 |
| `getCssColor(name, fallback)` | `<body>` から CSS カスタムプロパティを読み取る |
| `vibrate(pattern)` | `navigator.vibrate` 呼び出し（対応時のみ） |

---

#### `js/main.js` — 起動処理・Game クラス

**`Game` クラスの主要メソッド：**

| メソッド | 役割 |
|---|---|
| `resetTable()` | 全エンティティを再生成し、ゲーム状態を初期化 |
| `newGame()` | セーブデータを消去し、テーブルをリセット、ゲームループを開始 |
| `continueGame()` | `localStorage` からセーブデータを復元してゲームを再開 |
| `update(dt)` | 毎ステップ：プランジャー・フリッパー・バンパー・ターゲット・ボールを更新、ドレイン判定 |
| `updateBall(ball, dt)` | 物理演算・シューターレーン処理・各衝突判定 |
| `checkRamp(ball)` | 左右ランプゾーンの検出と速度ブースト付与 |
| `checkTargetBanks()` | バンク全クリア時の倍率加算処理 |
| `addScore(base, label, sfx)` | 倍率適用・コンボ更新・SFX 再生・追加ボール閾値チェック |
| `drainBall(index)` | ボールセーブ・マルチボール継続・ボール数減算・ゲームオーバー処理 |
| `awardJackpot()` | 5,000 点付与とマルチボールトリガー |
| `pause() / resume()` | ゲーム状態の凍結・再開（一時停止時に自動セーブ） |
| `saveGame()` | スコア等の状態を `localStorage` に保存 |

---

#### `js/core/game-loop.js` — ゲームループ

`requestAnimationFrame` を使用した**半固定タイムステップ**ループ。

- 固定更新ステップ：**1/120 秒**（120 Hz）
- フレームデルタ上限：**80 ms**（タブ非表示時のスパイラル防止）
- アキュムレーターが余った分（alpha）はレンダラーに渡して補間可能

---

#### `js/core/physics.js` — 物理演算プリミティブ

| 関数 | 説明 |
|---|---|
| `limitSpeed(body, max)` | 速度ベクトルを最大値に制限 |
| `reflectVelocity(body, nx, ny, e)` | 法線ベクトルで速度を反射（反発係数付き） |
| `applyImpulse(body, nx, ny, force)` | 方向に沿ったインパルス付与 |
| `closestPointOnSegment(...)` | 線分上の最近接点を返す |
| `anglePoint(x, y, length, angle)` | 角度と長さから先端座標を計算 |

---

#### `js/core/collision.js` — 衝突検出

| 関数 | 形状ペア | 使用箇所 |
|---|---|---|
| `collideCircleSegment` | 円 ↔ 線分 | ウォール |
| `collideCircleCapsule` | 円 ↔ カプセル | フリッパー |
| `collideCircleCircle` | 円 ↔ 円 | バンパー |
| `collideCircleRect` | 円 ↔ AABB | ターゲット |

各関数はオーバーラップ解消・速度反射・オプションの反発インパルスを処理し、ヒット記述子 `{nx, ny, overlap}` または `null` を返します。

---

#### `js/core/renderer.js` — Canvas レンダラー

毎フレーム Canvas 2D API でゲーム全体を描画します。テーマカラーは毎フレーム CSS カスタムプロパティから再読み込みされ、リアルタイムのテーマ切替を実現します。

| メソッド | 描画内容 |
|---|---|
| `drawPlayfield()` | グラデーション背景・スキャンライン・シューターレーン・ボールセーブインジケーター |
| `drawWalls()` | ウォールセグメント（レール＝淡白、ラバー＝シアングロー、ゲート＝グリーングロー） |
| `drawRamps()` | 弧形ランプ（アクティベート時にパルス） |
| `drawBumpers()` | グローパルス付き円形バンパー（A/B/C ラベル） |
| `drawTargets()` | 角丸矩形ターゲット（倒れると暗く、ヒット時に点灯） |
| `drawFlippers()` | カプセル形フリッパー（アクティブ時はアクセントカラーに強グロー） |
| `drawPlunger()` | チャージ量に応じて上昇するプランジャーロッド |
| `drawBalls()` | ラジアルグラデーション球体＋モーションブラートレイル |
| `drawLamps()` | J-A-C-K-P-O-T ジャックポット進行度ランプ |
| `drawBoardText()` | ボードタイトル・ゲームオーバーオーバーレイ |
| `drawAttract(canvas)` | メニュー画面のアトラクトモードプレビュー |

---

#### `js/entities/ball.js` — ボール

| プロパティ / メソッド | 説明 |
|---|---|
| `x, y, vx, vy` | 位置と速度 |
| `r` | 半径（デフォルト 12 px） |
| `inShooter` | 発射台固定中は `true`、物理演算で重力をスキップ |
| `fromShooter` | 発射後シューターレーン走行中は `true` |
| `trail[]` | モーションブラー用の最大 12 点位置リング |
| `update(dt, physics)` | 重力・摩擦・速度制限・オイラー積分・トレイル更新 |
| `launch(power)` | 0〜1 のパワーを初速度に変換し `fromShooter=true` に設定 |
| `setShooterRest()` | ボールを発射台位置に戻す |

---

#### `js/entities/flipper.js` — フリッパー

| プロパティ / メソッド | 説明 |
|---|---|
| `side` | `"left"` または `"right"` |
| `pivotX, pivotY` | 回転中心座標 |
| `length, width` | 難易度設定の `flipperScale` でスケーリング |
| `restAngle / activeAngle` | 休止・アクティブ時の角度（ラジアン） |
| `angularVelocity` | 毎フレーム計算、ボールへの角運動量伝達に使用 |
| `update(dt)` | 目標角度への指数的接近と角速度計算 |
| `tip()` | `anglePoint` で先端座標を計算 |
| `collide(ball, physics)` | カプセル衝突・上向きリフト・横方向プッシュ・角運動量キックを適用 |

---

#### `js/entities/bumper.js` — バンパー

ボールを弾き返す円形ポップバンパー。

| プロパティ | 値 |
|---|---|
| ラベル | `A`, `B`, `C` |
| 半径 | 34〜38 px |
| インパルス | 420 px/s |
| クールダウン | ヒット後 70 ms |
| `pulse` | グローアニメーション用（4.8 倍/s で減衰） |

---

#### `js/entities/target.js` — ターゲット

| タイプ | 動作 |
|---|---|
| `"target"`（ドロップターゲット） | ヒット時に倒れる（`down=true`）、バンク全クリアでリセット |
| `"rollover"`（レーンセンサー） | ヒットで得点・点灯するが倒れない |

---

#### `js/entities/plunger.js` — プランジャー

| メソッド | 説明 |
|---|---|
| `start()` | チャージ開始（0.75/s で増加、最大 1.0） |
| `release()` | チャージ停止、現在のパワーを返す（最小 0.18）、リセット |
| `update(dt)` | チャージの増減とクールダウン（220 ms）管理 |

---

#### `js/entities/wall.js` — ウォール

`(x1, y1) → (x2, y2)` の静的ライン。`kind` タグ（`"rail"`, `"rubber"`, `"gate"`）で描画スタイルを制御します。

---

#### `js/ui/screen-manager.js` — 画面マネージャー

4 つの画面（menu / game / help / settings）の表示切替を管理し、`is-active` クラスのトグル、`onChange` コールバック呼び出し、BGM トラック切替を担います。

---

#### `js/ui/input.js` — 入力コントローラー

- **キーボード：** `window` の `keydown` / `keyup`。重複キー入力ガード（`this.keys{}`）付き。
- **タッチ：** 各ボタン要素に `pointerdown` / `pointerup` / `pointercancel` / `pointerleave`。タッチイベントごとに `AudioManager.unlock()` を呼びブラウザの自動再生制限に対応。

---

#### `js/audio/audio-manager.js` — オーディオマネージャー

単一の `AudioContext` と BGM / SFX の 2 つの `GainNode` バスを管理します。

**BGM シーケンサー：** `setInterval` 駆動のステップシーケンサー

| トラック | 波形 | テンポ |
|---|---|---|
| `menu` | トライアングルメロディ・サインベース | 165 ms/ステップ |
| `game` | スクエアメロディ・ノコギリ波ベース | 145 ms/ステップ |

`AudioContext` は最初のユーザー操作時に遅延生成され、ブラウザの自動再生制限に対応します。

---

#### `js/audio/sound-effects.js` — SFX ライブラリ

すべての SFX は Web Audio API でリアルタイム合成されます（音声ファイル不要）。

| キー | サウンド内容 |
|---|---|
| `launch` | のこぎり波の上昇スイープ＋ノイズバースト |
| `flipper` | 短いスクエアクリック＋ノイズスナップ |
| `bumper` | デュアルトーンのサインチャイム |
| `wall` | ソフトなトライアングルタップ |
| `target` | 2 音サインピン |
| `combo` | コンボレベルで音程が上昇するデュアルサイン |
| `jackpot` | 5 音上昇トライアングルファンファーレ |
| `extraBall` | 4 音上昇サインアルペジオ |
| `multiball` | 5 音上昇のこぎり波ランプ |
| `drain` | のこぎり波の音程降下 |
| `gameOver` | 4 音下降トライアングル |
| `newHighScore` | 6 音上昇ファンファーレ |
| `ramp` | サインスイープ（低→高） |

---

### CSS モジュール詳細

| ファイル | 役割 |
|---|---|
| `reset.css` | ボックスモデルリセット |
| `variables.css` | フォント・サイズ・色（`--c-*`）のカスタムプロパティ |
| `base.css` | ボディフォント・カラー・タッチアクション |
| `layout.css` | `.app-shell` 全画面コンテナ・画面表示アニメーション |
| `components.css` | ボタン・スライダー・トグル・セグメント・カラースウォッチ |
| `screen-menu.css` | メニュー 2 カラムレイアウト・ブランドパネル・スコアストリップ |
| `screen-game.css` | ゲームレイアウト（HUD サイドバー・ボードラッパー・タッチコントロール） |
| `screen-help.css` | ヘルプ情報カードグリッド |
| `screen-settings.css` | 設定フォーム・フィールドセットグループ |
| `themes.css` | テーマ別カラー上書き |
| `responsive.css` | モバイル対応ブレークポイント |

---

<br>
<br>

---

# 繁體中文

## 目錄

- [遊戲概述](#遊戲概述)
- [遊玩方式](#遊玩方式)
  - [操作說明](#操作說明)
  - [發射彈珠](#發射彈珠)
  - [暫停與選單](#暫停與選單)
- [遊戲規則](#遊戲規則)
  - [遊戲目標](#遊戲目標)
  - [球數與保球機制](#球數與保球機制)
  - [得分表](#得分表)
  - [連擊與倍率](#連擊與倍率)
  - [大獎與多球模式](#大獎與多球模式)
  - [追加球](#追加球)
  - [難度設定](#難度設定)
- [視覺主題](#視覺主題)
- [程式架構](#程式架構)
  - [目錄結構](#目錄結構)
  - [JavaScript 模組詳解](#javascript-模組詳解)
  - [CSS 模組詳解](#css-模組詳解)

---

## 遊戲概述

**霓虹彈珠台**是以原生 JavaScript 及 HTML5 Canvas API 打造的完全獨立瀏覽器彈珠台。無需建構工具或伺服器，只需用現代瀏覽器開啟 `index.html` 即可遊玩。

| 項目 | 數值 |
|---|---|
| 畫布尺寸 | 540 × 960 px |
| 起始球數 | 3 顆 |
| 物理更新頻率 | 120 Hz 固定時間步 |
| 音訊引擎 | Web Audio API（程式合成） |
| 資料儲存 | `localStorage`（最高分、設定、存檔） |

---

## 遊玩方式

### 操作說明

| 動作 | 鍵盤 | 手機觸控 |
|---|---|---|
| 左彈板 | `A` 或 `←` | 觸碰**左**按鈕 |
| 右彈板 | `D` 或 `→` | 觸碰**右**按鈕 |
| 蓄力發射 | 長按 `Space`、`↓` 或 `S` | 長按**發射**按鈕 |
| 射出 | 放開 `Space` / `↓` / `S` | 放開**發射**按鈕 |
| 暫停 / 繼續 | `Esc` 或畫面 **Ⅱ** 按鈕 | 同左 |
| 返回主選單 | 畫面 **⌂** 按鈕 | 同左 |

### 發射彈珠

1. 遊戲開始時，彈珠固定在盤面右側的**發射道**。
2. **長按**發射鍵蓄力，按越久發射力越強。
3. **放開**後射出。蓄力充足時，彈珠會沿發射道衝到頂端，通過閘門進入主場地。
4. 若蓄力不足、彈珠無法通過閘門，會自動滾回發射台，**不扣球數**，可重新蓄力。

### 暫停與選單

- 遊戲中隨時按 **Esc**（或畫面 **Ⅱ** 鍵）暫停。暫停期間彈板與發射操作無效。
- 暫停面板提供**繼續**、**保存離開**及**重開**三個選項。
- 選擇**保存離開**或按 **⌂** 離開遊戲時，目前分數、球數、連擊、倍率、大獎進度及追加球狀態會存入 `localStorage`，下次可從主選單**繼續**讀檔。

---

## 遊戲規則

### 遊戲目標

在球全數耗盡前累積最高分數。串連連擊、清空靶排，並觸發大獎解鎖多球模式是衝高分的關鍵。

### 球數與保球機制

- 每局從 **3 顆球** 開始。
- 發射後 **7.5 秒**內有**保球期**。若球在此期間落底，會免費回到發射台，不扣球數。
- 彈珠進入主場地後落底，才算失球。
- 多球模式中，場上若有多顆球，失去其中一顆不扣備用球數；直到場上最後一顆球落底才進行球數扣除。
- 備用球全部耗盡即遊戲結束。

### 得分表

| 事件 | 基本得分 |
|---|---|
| 彈柱命中 | 100 分 |
| 目標命中 | 250 分 |
| 通道滾過 | 350 分 |
| 坡道 | 500 分 |
| 整排靶全清 | 900 分 |
| 大獎 | 5,000 分 |

> 所有基本得分在加入總分前都會乘以當前的**倍率**。

### 連擊與倍率

- **連擊**計數器追蹤連續得分事件。在 **2,400 ms** 內持續得分，連擊數便會累積。
- 每累積 5 次連擊，倍率上升 1，最高達 **×5**。
- 失球時，連擊與倍率同時重置為初始值（0 與 ×1）。
- 清空任一排靶（左排或右排）時，不論當前連擊，倍率立即 +1。

### 大獎與多球模式

- **JACKPOT** 進度條共 7 格，依命中對象各自填充：
  - 彈柱：+0.25 格
  - 通道滾過：+0.5 格
  - 目標 / 坡道：+1 格
- 進度達 7 時觸發**大獎**（5,000 × 倍率 分），進度歸零。
- 觸發大獎時，若場上球數少於 3 顆，會額外加入 **2 顆球**，啟動**多球模式**。

### 追加球

- 累計得分達 **35,000 分** 時獲得 **+1 顆追加球**（每局觸發一次）。

### 難度設定

| 難度 | 彈板長度 |
|---|---|
| 簡單 | 100 %（預設 96 px） |
| 普通 | 90 %（約 86 px） |
| 困難 | 85 %（約 82 px） |

重力、摩擦、反彈係數與彈板力道在各難度完全相同，差異只在彈板長短。

---

## 視覺主題

在**設定**畫面可選擇 6 種內建配色主題。主題透過 `<body>` 的 `data-theme` 屬性切換，以 CSS 自訂屬性覆寫色彩。

| 主題 | 主色 | 輔色 | 強調色 |
|---|---|---|---|
| **霓虹**（預設） | `#ff2d95` | `#00e5ff` | `#faff00` |
| **經典** | `#e63946` | `#ffb703` | `#fefae0` |
| **海洋** | `#00b4d8` | `#caf0f8` | `#48cae4` |
| **森林** | `#2d6a4f` | `#d8f3dc` | `#fca311` |
| **夕陽** | `#ff006e` | `#ffbe0b` | `#3a86ff` |
| **單色** | `#ffffff` | `#999999` | `#ffd60a` |

---

## 程式架構

### 目錄結構

```
Pinball/
├── index.html              # 進入點，HTML 結構
├── css/
│   ├── reset.css           # CSS 重置
│   ├── variables.css       # 全域 CSS 自訂屬性與設計令牌
│   ├── base.css            # 主體、字型基礎樣式
│   ├── layout.css          # 應用外殼與畫面佈局
│   ├── components.css      # 共用 UI 元件（按鈕、卡片等）
│   ├── screen-menu.css     # 主選單畫面樣式
│   ├── screen-game.css     # 遊戲畫面與 HUD 樣式
│   ├── screen-help.css     # 說明畫面樣式
│   ├── screen-settings.css # 設定畫面樣式
│   ├── themes.css          # 色彩主題覆寫
│   └── responsive.css      # 響應式與行動裝置斷點
└── js/
    ├── config.js           # 全域常數（CONFIG 物件）
    ├── utils.js            # 純工具函式
    ├── main.js             # 啟動流程與 Game 類別
    ├── core/
    │   ├── game-loop.js    # 固定時間步遊戲迴圈
    │   ├── physics.js      # 物理運算基礎函式
    │   ├── collision.js    # 碰撞偵測演算法
    │   └── renderer.js     # Canvas 2D 渲染器 + 吸引模式
    ├── entities/
    │   ├── ball.js         # 彈珠狀態與移動
    │   ├── flipper.js      # 彈板物理與碰撞
    │   ├── bumper.js       # 彈柱碰撞與光脈衝
    │   ├── target.js       # 倒靶與通道邏輯
    │   ├── plunger.js      # 發射器蓄力與釋放
    │   └── wall.js         # 靜態牆壁線段
    ├── ui/
    │   ├── screen-manager.js  # 畫面切換控制器
    │   ├── menu.js            # 主選單邏輯
    │   ├── hud.js             # 遊戲內 HUD 更新
    │   ├── settings.js        # 設定面板邏輯
    │   └── input.js           # 鍵盤與觸控輸入
    └── audio/
        ├── audio-manager.js   # Web Audio 環境與 BGM 音序器
        └── sound-effects.js   # 程序化音效庫
```

### JavaScript 模組詳解

所有模組以 IIFE 形式掛載至 `window.Pinball` 命名空間，無需打包工具。

---

#### `js/config.js` — 全域設定

定義 `window.Pinball.CONFIG`，集中管理所有遊戲常數。

| 命名空間 | 主要常數 |
|---|---|
| `CONFIG.BOARD` | `width=540`、`height=960`、`ballRadius=12`、`maxSpeed=1450`、`drainY=988`、`shooterX=491` |
| `CONFIG.SCORE` | `bumper=100`、`target=250`、`ramp=500`、`rollover=350`、`jackpot=5000`、`extraBallAt=35000` |
| `CONFIG.GAME` | `startingBalls=3`、`comboWindowMs=2400`、`messageMs=1700` |
| `CONFIG.DIFFICULTY` | `easy / normal / hard` — 各含重力、摩擦、反彈、彈板力、保球時間、彈板比例 |
| `CONFIG.DEFAULT_SETTINGS` | 預設主題、音量、難度 |
| `CONFIG.STORAGE` | `localStorage` 鍵名字串 |

---

#### `js/utils.js` — 工具函式

無副作用的純函式工具集（`window.Pinball.Utils`）。

| 函式 | 說明 |
|---|---|
| `clamp(v, min, max)` | 將數值限制在 [min, max] 範圍內 |
| `lerp(a, b, t)` | 線性插值 |
| `distance(ax,ay,bx,by)` | 歐幾里得距離 |
| `normalize(x, y)` | 回傳單位向量 `{x, y, length}` |
| `dot(ax,ay,bx,by)` | 2D 內積 |
| `formatScore(score)` | 分數格式化為本地化字串（如 `12,345`） |
| `loadJSON / saveJSON` | `localStorage` JSON 讀寫（含例外保護） |
| `loadNumber / saveNumber` | `localStorage` 數值讀寫 |
| `clearStorage(keys[])` | 刪除指定 `localStorage` 鍵 |
| `getCssColor(name, fallback)` | 從 `<body>` 讀取 CSS 自訂屬性 |
| `vibrate(pattern)` | 呼叫 `navigator.vibrate`（若裝置支援） |

---

#### `js/main.js` — 啟動與 Game 類別

包含 `Game` 類別（核心遊戲控制器）與 `boot()` 函式（負責串接所有模組）。

**`Game` 類別主要方法：**

| 方法 | 職責 |
|---|---|
| `resetTable()` | 重新建立所有實體，初始化遊戲狀態 |
| `newGame()` | 清除存檔、重置桌面、生成彈珠、啟動迴圈 |
| `continueGame()` | 從 `localStorage` 讀取存檔並還原狀態後繼續遊戲 |
| `update(dt)` | 每步：更新發射器、彈板、彈柱、目標、彈珠，檢查落底 |
| `updateBall(ball, dt)` | 執行物理、發射道路由、各碰撞檢測 |
| `checkRamp(ball)` | 偵測彈珠是否進入左右坡道並給予速度加成 |
| `checkTargetBanks()` | 靶排全清時加算倍率 |
| `addScore(base, label, sfx)` | 套用倍率、更新連擊、播放音效、檢查追加球閾值 |
| `drainBall(index)` | 處理保球機制、多球延續、球數扣除與遊戲結束 |
| `awardJackpot()` | 給予 5,000 分並在球數不足時觸發多球 |
| `pause() / resume()` | 凍結 / 恢復遊戲（暫停時自動存檔） |
| `saveGame()` | 將分數等狀態序列化至 `localStorage` |
| `render()` | 委派至 `Renderer.render()` |

---

#### `js/core/game-loop.js` — 遊戲迴圈

採用 `requestAnimationFrame` 的**半固定時間步**迴圈。

- 固定更新步距：**1/120 秒**（120 Hz）
- 最大幀差上限：**80 ms**（防止分頁切換後的爆炸更新）
- 剩餘 alpha 值傳入渲染器做視覺插值

```
tick(time)
  delta = clamp(time - lastTime, 0, 80ms)
  accumulator += delta
  while accumulator >= step:
      update(step)          ← 確定性物理
      accumulator -= step
  render(accumulator / step) ← 視覺插值
```

---

#### `js/core/physics.js` — 物理基礎函式

| 函式 | 說明 |
|---|---|
| `limitSpeed(body, max)` | 速度向量超過上限時等比縮放 |
| `reflectVelocity(body, nx, ny, e)` | 依法線向量反射速度（含反彈係數） |
| `applyImpulse(body, nx, ny, force)` | 沿方向施加衝量 |
| `closestPointOnSegment(...)` | 計算線段上距指定點最近的點 |
| `anglePoint(x, y, length, angle)` | 依角度與長度計算尖端座標 |

---

#### `js/core/collision.js` — 碰撞偵測

| 函式 | 形狀對 | 使用對象 |
|---|---|---|
| `collideCircleSegment` | 圓 ↔ 線段 | 牆壁 |
| `collideCircleCapsule` | 圓 ↔ 膠囊體 | 彈板 |
| `collideCircleCircle` | 圓 ↔ 圓 | 彈柱 |
| `collideCircleRect` | 圓 ↔ AABB | 目標 |

每個函式均處理重疊分離、速度反射及可選的額外排斥衝量，並回傳命中描述 `{nx, ny, overlap}` 或 `null`。

---

#### `js/core/renderer.js` — Canvas 渲染器

每幀使用 Canvas 2D API 繪製整個遊戲畫面。顏色每幀從 CSS 自訂屬性重新讀取（`refreshTheme()`），實現即時主題切換。

| 方法 | 繪製內容 |
|---|---|
| `drawPlayfield()` | 漸層背景、掃描線裝飾、發射道、保球期指示條 |
| `drawWalls()` | 牆壁線段（軌道=淡白、橡膠=青色光暈、閘門=綠色光暈） |
| `drawRamps()` | 弧形坡道（觸發時光脈衝） |
| `drawBumpers()` | 帶光脈衝動畫的圓形彈柱（A/B/C 標籤） |
| `drawTargets()` | 圓角矩形目標（倒下時暗淡，命中後發光） |
| `drawFlippers()` | 膠囊形彈板（啟動時強調色加強光暈） |
| `drawPlunger()` | 依蓄力量上升的發射器桿 |
| `drawBalls()` | 徑向漸層彈珠＋動態殘影軌跡 |
| `drawLamps()` | JACKPOT 字母燈（依進度點亮） |
| `drawBoardText()` | 盤面標題；遊戲結束時顯示覆蓋文字 |
| `drawAttract(canvas)` | 在主選單畫布繪製靜態吸引模式預覽 |

---

#### `js/entities/ball.js` — 彈珠

| 屬性 / 方法 | 說明 |
|---|---|
| `x, y, vx, vy` | 位置與速度 |
| `r` | 半徑（預設 12 px） |
| `inShooter` | 固定於發射台時為 `true`，物理略過重力 |
| `fromShooter` | 發射後在發射道行進時為 `true` |
| `trail[]` | 最多 12 個歷史座標的環形緩衝，用於殘影效果 |
| `update(dt, physics)` | 套用重力、摩擦、速度上限、Euler 積分、更新殘影 |
| `launch(power)` | 將 0–1 蓄力轉換為初速，並設 `fromShooter=true` |
| `setShooterRest()` | 將彈珠歸位至發射台並清除殘影 |

---

#### `js/entities/flipper.js` — 彈板

| 屬性 / 方法 | 說明 |
|---|---|
| `side` | `"left"` 或 `"right"` |
| `pivotX, pivotY` | 旋轉軸心座標 |
| `length, width` | 依難度設定的 `flipperScale` 縮放 |
| `restAngle / activeAngle` | 靜止 / 啟動時的弧度角 |
| `angularVelocity` | 每幀計算，用於傳遞角動量至彈珠 |
| `update(dt)` | 指數趨近目標角度並計算角速度 |
| `tip()` | 透過 `anglePoint` 計算彈板前端座標 |
| `collide(ball, physics)` | 膠囊體碰撞；施加向上升力、側向推力與角動量踢擊 |

---

#### `js/entities/bumper.js` — 彈柱

圓形彈射柱，命中時彈開彈珠並計分。

| 屬性 | 數值 |
|---|---|
| 標籤 | `A`、`B`、`C` |
| 半徑 | 34–38 px |
| 衝量 | 420 px/s |
| 冷卻時間 | 命中後 70 ms |
| `pulse` | 光暈動畫值（以 4.8 倍/秒衰減） |

---

#### `js/entities/target.js` — 目標

兩種目標類型：

| 類型 | 行為 |
|---|---|
| `"target"`（倒靶） | 命中後倒下（`down=true`），全排清除後重置 |
| `"rollover"`（通道感應器） | 滾過即得分並點亮，但不倒下 |

---

#### `js/entities/plunger.js` — 發射器

| 方法 | 說明 |
|---|---|
| `start()` | 開始蓄力（以 0.75/s 增加至最大值 1.0） |
| `release()` | 停止蓄力，回傳當前力道（最小 0.18）並歸零 |
| `update(dt)` | 管理蓄力增減及冷卻時間（220 ms） |

---

#### `js/entities/wall.js` — 牆壁

由 `(x1, y1) → (x2, y2)` 定義的靜態線段。`kind` 標籤（`"rail"`、`"rubber"`、`"gate"`）控制渲染樣式（不透明度與光暈顏色）。

---

#### `js/ui/screen-manager.js` — 畫面管理器

管理四個畫面（menu / game / help / settings）的顯示切換，透過切換 `is-active` 類別、觸發 `onChange` 回呼，並在切換時更換 BGM 音軌。

---

#### `js/ui/input.js` — 輸入控制器

- **鍵盤：** 監聽 `window` 的 `keydown` / `keyup`；以 `this.keys{}` 防止重複觸發。
- **觸控：** 對各按鈕元素綁定 `pointerdown` / `pointerup` / `pointercancel` / `pointerleave`。每次觸控事件呼叫 `AudioManager.unlock()` 以符合瀏覽器自動播放限制。

---

#### `js/audio/audio-manager.js` — 音訊管理器

管理單一 `AudioContext` 與 BGM / SFX 兩條 `GainNode` 匯流排。

**BGM 音序器：** 由 `setInterval` 驅動的步進音序器

| 音軌 | 波形 | 速度 |
|---|---|---|
| `menu` | 三角波旋律、正弦波低音 | 165 ms/步 |
| `game` | 方波旋律、鋸齒波低音 | 145 ms/步 |

`AudioContext` 在首次使用者互動時延遲建立，符合瀏覽器的自動播放政策。

---

#### `js/audio/sound-effects.js` — 音效庫

所有音效均以 Web Audio API 即時合成，無需任何音訊檔案。

| 鍵值 | 音效內容 |
|---|---|
| `launch` | 鋸齒波上掃頻＋短暫噪音 |
| `flipper` | 短促方波點擊＋噪音嘎嗒聲 |
| `bumper` | 雙音正弦鐘聲 |
| `wall` | 柔和三角波輕擊 |
| `target` | 雙音正弦 Ping |
| `score` | 短促三角波嗶聲 |
| `combo` | 雙正弦音，音高隨連擊等級上升 |
| `jackpot` | 5 音上行三角波號角 |
| `extraBall` | 4 音上行正弦琶音 |
| `multiball` | 5 音上行鋸齒波坡道音 |
| `drain` | 鋸齒波音高下墜 |
| `gameOver` | 4 音下行三角波 |
| `newHighScore` | 6 音上行號角 |
| `ramp` | 正弦掃頻（低→高） |
| `uiClick` | 短促方波點擊 |
| `screenChange` | 三角波掃頻 |

---

### CSS 模組詳解

| 檔案 | 職責 |
|---|---|
| `reset.css` | 盒模型重置與合理的瀏覽器預設值 |
| `variables.css` | 所有 CSS 自訂屬性：字型、尺寸、圓角、色彩（`--c-*`） |
| `base.css` | 主體字型、顏色、觸控行為 |
| `layout.css` | `.app-shell` 全視窗容器；`.screen` 顯示 / 隱藏動畫 |
| `components.css` | `.button`、`.icon-button`、`.range-row`、`.toggle-row`、`.segmented`、`.theme-swatch` |
| `screen-menu.css` | 選單雙欄佈局、品牌面板、分數顯示、吸引模式畫布 |
| `screen-game.css` | 遊戲佈局（HUD 側欄、盤面包裝器、觸控控制列） |
| `screen-help.css` | 說明資訊卡片格線 |
| `screen-settings.css` | 設定表單與 fieldset 分組 |
| `themes.css` | 各主題色彩覆寫 |
| `responsive.css` | 行動裝置斷點：欄位堆疊、觸控目標放大 |

---

<div align="center">

[Back to top / ページトップへ / 回到頂部](#霓虹彈珠台--neon-pinball--ネオンピンボール)

</div>
