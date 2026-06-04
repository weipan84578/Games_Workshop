# BRICKSTORM

> A modern Breakout/Arkanoid arcade game — 50 stages, synthesized music, zero dependencies.

---

## Language / 言語 / 語言

| [English](#english) | [日本語](#japanese) | [中文](#chinese) |
|:-------------------:|:-------------------:|:----------------:|

---

<a name="english"></a>

## English

### Table of Contents

| # | Section |
|---|---------|
| 1 | [Game Overview](#en-overview) |
| 2 | [How to Play](#en-howtoplay) |
| 3 | [Controls](#en-controls) |
| 4 | [Brick Types](#en-bricks) |
| 5 | [Power-Up System](#en-powerups) |
| 6 | [Level Progression](#en-levels) |
| 7 | [Music System](#en-music) |
| 8 | [Settings & Save](#en-settings) |
| 9 | [File Structure](#en-files) |
| 10 | [Module Reference](#en-modules) |
| 11 | [Tech Specs](#en-tech) |

---

<a name="en-overview"></a>

### 1. Game Overview

**BRICKSTORM** is a browser-based Breakout/Arkanoid-style game built with pure front-end technologies. Open the single HTML file and play instantly — no installation, no server, no external assets.

| Feature | Detail |
|---------|--------|
| Stages | 50 unique levels |
| Platform | Desktop, tablet, mobile |
| Dependencies | Zero (Google Fonts only, gracefully degraded) |
| Audio | 100% synthesized via Web Audio API |
| Rendering | HTML5 Canvas |
| Save | localStorage (auto-save) |

---

<a name="en-howtoplay"></a>

### 2. How to Play

1. Open `breakout_game.html` in any modern browser.
2. Choose a stage from the level select screen.
3. Move the paddle to keep the ball in play.
4. Destroy all breakable bricks to clear the stage.
5. Collect power-up capsules that fall from broken bricks.
6. You start with **3 lives** — the ball falling off the bottom costs one life.
7. Combo streaks multiply your score; finishing quickly earns a time bonus.

**Win condition** — destroy every breakable brick (METAL bricks are indestructible walls).  
**Lose condition** — all lives depleted.

---

<a name="en-controls"></a>

### 3. Controls

#### Keyboard

| Key | In-Game | In-Menu |
|-----|---------|---------|
| `←` / `A` | Move paddle left | Navigate left |
| `→` / `D` | Move paddle right | Navigate right |
| `Space` | Launch ball / Fire laser / Release sticky | Confirm |
| `ESC` / `P` | Pause | Back |
| `Enter` | — | Confirm |
| `M` | Mute / Unmute | — |
| `+` / `-` | Volume up / down | — |
| `F` | Toggle fullscreen | Toggle fullscreen |

#### Mouse / Touch

| Action | Result |
|--------|--------|
| Move cursor / finger | Paddle follows horizontally |
| Click / Tap | Launch ball; fire laser; release sticky ball |

---

<a name="en-bricks"></a>

### 4. Brick Types

| Code | Name | Hits | Score | Behaviour |
|------|------|:----:|:-----:|-----------|
| `NORMAL_1` | Standard | 1 | 10 | Breaks in one hit |
| `NORMAL_2` | Hard | 2 | 20 | Darkens on first hit |
| `NORMAL_3` | Armored | 3 | 40 | Shows cracks each hit |
| `STONE` | Stone | 5 | 100 | Crystal shatter effect |
| `METAL` | Metal | ∞ | 0 | Indestructible wall |
| `BOMB` | Bomb | 1 | 50 | Explodes — destroys 8 neighbors |
| `POWER` | Power | 1 | 20 | Always drops a power-up |
| `RAINBOW` | Rainbow | 1 | 50 | Random effect on break |
| `GHOST` | Ghost | 1 | 20 | Moves horizontally |
| `LASER` | Laser | 1 | 25 | Fires a laser downward on break |
| `PORTAL` | Portal | 1 | 30 | Ball teleports to paired brick |
| `SHIELD` | Shield | 1 | 15 | Protects bricks below it |
| `SCORE_2X` | Double | 1 | 30 | Doubles score in its zone |

---

<a name="en-powerups"></a>

### 5. Power-Up System

Power-ups fall from destroyed bricks at ~8–22 % drop rate (Power bricks: 100 %).

| Icon | Code | Name | Effect | Duration |
|------|------|------|--------|----------|
| ↔️ | `EXPAND` | Wide Paddle | Paddle ×1.8 | 15 s |
| ↕️ | `SHRINK` | Narrow Paddle | Paddle ×0.6 | 10 s |
| ×3 | `MULTI` | Multi-Ball | Adds 2 extra balls | Until lost |
| 🐢 | `SLOW` | Slow Ball | Speed ×0.7 | 8 s |
| ⚡ | `FAST` | Fast Ball | Speed ×1.4 | 6 s |
| 🔫 | `LASER` | Laser Cannon | Paddle fires lasers | 12 s |
| 🛡️ | `SHIELD` | Bottom Shield | One-time floor shield | 1 use |
| 💣 | `BOMB` | Bomb | Clears nearby bricks instantly | Instant |
| 👻 | `GHOST_BALL` | Ghost Ball | Ball passes through bricks | 5 s |
| ❤️ | `EXTRA_LIFE` | Extra Life | +1 life (max 5) | Instant |
| 🔒 | `STICKY` | Sticky Pad | Ball sticks; Space to release | 10 s |
| ×2 | `SCORE_2X` | Double Score | All scores ×2 | 10 s |
| 🔥 | `FIREBALL` | Fireball | Ball destroys soft bricks on contact | 6 s |

---

<a name="en-levels"></a>

### 6. Level Progression

50 stages divided into 10 themed chapters, each introducing new mechanics.

| Stages | Chapter | Music Theme | New Mechanic |
|:------:|---------|-------------|--------------|
| 1–5 | Dawn | DAWN (120 BPM) | Basics, bottom shield tutorial |
| 6–10 | Neon City | NEON CITY (128 BPM) | Hard bricks, Ghost, Laser, Portal bricks |
| 11–15 | Deep Space | DEEP SPACE (95 BPM) | Armored bricks, Stone bricks, Black-hole gravity |
| 16–20 | Storm | STORM (140 BPM) | Rotating layout, brick drift, Chain explosions |
| 21–25 | Crystal | CRYSTAL (110 BPM) | Downward-drifting bricks, Rotating brick groups |
| 26–30 | Void | VOID (105 BPM) | Blinking bricks, Dark matter (invisible) bricks |
| 31–35 | Prism | PRISM (118 BPM) | Rainbow bricks, Mirror world, Brick rebirth |
| 36–40 | Nova | NOVA (132 BPM) | Moving galaxy groups, Pulsating bricks |
| 41–45 | Core | CORE (150 BPM) | High-density Stone, forced multi-ball stage |
| 46–50 | Infinity | INFINITY (160 BPM) | All mechanics combined, 100-hit BOSS brick |

**Star Rating**

| Stars | Condition |
|:-----:|-----------|
| ⭐ | Clear the stage |
| ⭐⭐ | Reach 60 % of target score |
| ⭐⭐⭐ | Reach 100 % of target score (with time bonus) |

---

<a name="en-music"></a>

### 7. Music System

All audio is synthesized in real-time using the Web Audio API — no audio files are loaded.

**Signal Chain**

```
MusicEngine / AudioEngine
    └── musicGain / sfxGain
            └── masterGain
                    └── DynamicsCompressor
                            └── AudioContext.destination
```

**Music Layers (per theme)**

| Layer | Role | Oscillator Type |
|-------|------|-----------------|
| Bass Line | Low-end groove | Sawtooth / Square |
| Chord Pad | Harmony | Sine ×3 |
| Melody | Main hook | Square / Triangle |
| Arpeggio | Texture | Sine ×2 |
| Drums | Beat (kick / snare / hi-hat) | Synthesized noise |
| Ambient | Atmosphere | Sine + Low-pass filter |

**Sound Effects (18 events)**

| Event | Synthesis |
|-------|-----------|
| Paddle hit | Sine, 200 Hz → 400 Hz, 80 ms |
| Brick hit | Square wave, 800 Hz, 50 ms |
| Brick destroy | Sawtooth + noise, pitch slide, 120 ms |
| Power-up get | Sine chord C+E+G, 300 ms |
| Ball lost | Low slide + noise, 600 ms |
| Level win | Rising arpeggio C4→E4→G4→C5, 1200 ms |
| Explosion | Low-freq boom + white noise, 500 ms |

---

<a name="en-settings"></a>

### 8. Settings & Save

**Settings**

| Setting | Type | Default |
|---------|------|---------|
| Music Volume | Slider 0–100 | 70 |
| SFX Volume | Slider 0–100 | 80 |
| Ball Speed | Slow / Normal / Fast | Normal |
| Difficulty | Easy / Normal / Hard | Normal |
| Particles | On / Off | On |
| Screen Shake | On / Off | On |
| Language | zh-TW / EN | zh-TW |
| Control Mode | Auto / Keyboard / Touch | Auto |

**Difficulty Score Multiplier** — Easy ×0.7 · Normal ×1.0 · Hard ×1.5

**Save System**

- Storage: `localStorage` key `brickstorm-save-v1`
- Auto-saves after every stage clear and setting change
- Tracks: unlocked levels · per-level star rating · high score · leaderboard (top 20) · play stats

---

<a name="en-files"></a>

### 9. File Structure

```
breakout_game.html      ← Single deployable file
css/
  base.css              ← CSS variables, reset, typography
  layout.css            ← Screen sections, flex/grid skeletons
  components.css        ← Buttons, sliders, HUD, overlay cards
  responsive.css        ← Breakpoints for tablet & mobile
js/
  config.js             ← Global constants & default save schema
  main.js               ← Entry point, game loop, global wiring
  game.js               ← Core game logic (Game class)
  renderer.js           ← Canvas draw calls (Renderer class)
  input-handler.js      ← Keyboard / mouse / touch (InputHandler)
  level-manager.js      ← Level data & brick layout builder
  power-up-system.js    ← Power-up spawn, apply, sync
  audio-engine.js       ← SFX synthesis (AudioEngine)
  music-engine.js       ← Background music synthesis (MusicEngine)
  particle-pool.js      ← Object-pool particle system
  ui-manager.js         ← Screen transitions, HUD, overlays
  save-system.js        ← localStorage read/write (SaveSystem)
breakout_game_spec.md   ← Full design specification (Chinese)
```

---

<a name="en-modules"></a>

### 10. Module Reference

| Module | Class | Responsibilities |
|--------|-------|-----------------|
| `config.js` | — | Canvas size constants, brick type definitions, power-up list, default save schema |
| `main.js` | — | Instantiates all singletons, starts `requestAnimationFrame` loop, wires DOM events |
| `game.js` | `Game` | Game state machine, physics update, collision detection, scoring, win/lose logic |
| `renderer.js` | `Renderer` | All Canvas draw calls: background, bricks, paddle, balls, particles, HUD |
| `input-handler.js` | `InputHandler` | Unified keyboard, mouse, and touch input; translates to paddle position |
| `level-manager.js` | `LevelManager` | Stores all 50 level layouts; builds typed brick arrays with pixel coordinates |
| `power-up-system.js` | `PowerUpSystem` | Spawns falling capsules, tracks active effects, expires timed effects each frame |
| `audio-engine.js` | `AudioEngine` | Creates Web Audio context, synthesizes all 18+ SFX on demand |
| `music-engine.js` | `MusicEngine` | Synthesizes layered background music; switches themes by level chapter |
| `particle-pool.js` | `ParticlePool` | Object pool (500 slots) for burst particles; prevents GC spikes |
| `ui-manager.js` | `UIManager` | Shows/hides screen sections, renders settings rows, level grid, leaderboard |
| `save-system.js` | `SaveSystem` | Reads/writes JSON to localStorage; merges schema versions |

---

<a name="en-tech"></a>

### 11. Tech Specs

| Item | Spec |
|------|------|
| Language | Vanilla JavaScript (ES6+) |
| Rendering | HTML5 Canvas 2D |
| Audio | Web Audio API |
| Storage | localStorage |
| Fonts | Google Fonts (Orbitron, Exo 2, Share Tech Mono) |
| Canvas size | 800 × 600 px (desktop) |
| Target FPS | 60 fps desktop / 30 fps mobile |
| Load time | < 500 ms (single file) |
| Memory | < 100 MB |
| Physics | AABB collision + sub-step at high speed |
| Mobile | Touch tracking, haptic feedback, orientation hint |

---

---

<a name="japanese"></a>

## 日本語

### 目次

| # | セクション |
|---|-----------|
| 1 | [ゲーム概要](#ja-overview) |
| 2 | [遊び方](#ja-howtoplay) |
| 3 | [操作方法](#ja-controls) |
| 4 | [ブロックの種類](#ja-bricks) |
| 5 | [パワーアップシステム](#ja-powerups) |
| 6 | [ステージ構成](#ja-levels) |
| 7 | [音楽システム](#ja-music) |
| 8 | [設定・セーブ](#ja-settings) |
| 9 | [ファイル構成](#ja-files) |
| 10 | [モジュール詳細](#ja-modules) |
| 11 | [技術仕様](#ja-tech) |

---

<a name="ja-overview"></a>

### 1. ゲーム概要

**BRICKSTORM** はブラウザで動くブレイクアウト／アルカノイド系ゲームです。単一の HTML ファイルを開くだけで即プレイ可能。インストール不要・サーバー不要・外部アセット不要。

| 項目 | 内容 |
|------|------|
| ステージ数 | 50 |
| 対応端末 | デスクトップ・タブレット・スマートフォン |
| 外部依存 | なし（Google Fonts のみ、フォールバックあり） |
| 音声 | Web Audio API によるリアルタイム合成 |
| 描画 | HTML5 Canvas |
| セーブ | localStorage（自動保存） |

---

<a name="ja-howtoplay"></a>

### 2. 遊び方

1. `breakout_game.html` をブラウザで開く。
2. ステージセレクト画面からステージを選択。
3. パドルを動かしてボールをフィールド内に保持する。
4. 全ての破壊可能なブロックを消去してステージクリア。
5. 壊れたブロックから落下するパワーアップカプセルを取得。
6. 初期ライフ **3**。ボールが底に落ちるとライフが 1 減る。
7. コンボを繋ぐとスコア倍率上昇、速くクリアするとタイムボーナス取得。

**クリア条件** — 全ての破壊可能ブロックを消去（METAL ブロックは除く）  
**失敗条件** — ライフが 0 になる

---

<a name="ja-controls"></a>

### 3. 操作方法

#### キーボード

| キー | ゲーム中 | メニュー中 |
|------|---------|-----------|
| `←` / `A` | パドル左移動 | 左選択 |
| `→` / `D` | パドル右移動 | 右選択 |
| `Space` | ボール発射 / レーザー発射 / 粘着解除 | 決定 |
| `ESC` / `P` | ポーズ | 戻る |
| `Enter` | — | 決定 |
| `M` | ミュート切替 | — |
| `+` / `-` | 音量調整 | — |
| `F` | フルスクリーン切替 | フルスクリーン切替 |

#### マウス / タッチ

| 操作 | 結果 |
|------|------|
| カーソル / 指を動かす | パドルが水平追従 |
| クリック / タップ | ボール発射・レーザー発射・粘着解除 |

---

<a name="ja-bricks"></a>

### 4. ブロックの種類

| コード | 名前 | 耐久 | スコア | 特徴 |
|--------|------|:----:|:------:|------|
| `NORMAL_1` | 通常 | 1 | 10 | 1 撃で破壊 |
| `NORMAL_2` | 硬化 | 2 | 20 | 1 撃で暗くなる、2 撃で破壊 |
| `NORMAL_3` | 装甲 | 3 | 40 | 撃つたびにひびが入る |
| `STONE` | 石 | 5 | 100 | 石の質感、水晶砕けエフェクト |
| `METAL` | 金属 | ∞ | 0 | 破壊不能の壁 |
| `BOMB` | 爆弾 | 1 | 50 | 破壊時に周囲 8 ブロックを爆破 |
| `POWER` | パワー | 1 | 20 | 必ずパワーアップを落とす |
| `RAINBOW` | レインボー | 1 | 50 | 破壊時にランダム効果 |
| `GHOST` | ゴースト | 1 | 20 | 水平に移動する |
| `LASER` | レーザー | 1 | 25 | 破壊時に下方向へレーザー発射 |
| `PORTAL` | ポータル | 1 | 30 | 対になったブロックへボールをワープ |
| `SHIELD` | シールド | 1 | 15 | 下のブロックを保護する |
| `SCORE_2X` | ダブル | 1 | 30 | その周辺のスコアを 2 倍にする |

---

<a name="ja-powerups"></a>

### 5. パワーアップシステム

ブロック破壊時に約 8～22 % の確率でカプセルが落下（Power ブロックは 100 %）。

| アイコン | コード | 名前 | 効果 | 持続 |
|---------|--------|------|------|------|
| ↔️ | `EXPAND` | ワイドパドル | パドル幅 ×1.8 | 15 秒 |
| ↕️ | `SHRINK` | ナローパドル | パドル幅 ×0.6 | 10 秒 |
| ×3 | `MULTI` | マルチボール | ボールを 2 個追加 | 失球まで |
| 🐢 | `SLOW` | スローボール | 速度 ×0.7 | 8 秒 |
| ⚡ | `FAST` | ファストボール | 速度 ×1.4 | 6 秒 |
| 🔫 | `LASER` | レーザーキャノン | パドルからレーザー発射 | 12 秒 |
| 🛡️ | `SHIELD` | ボトムシールド | 底に 1 回限りのシールド | 1 回 |
| 💣 | `BOMB` | ボム | 周囲のブロックを即時消去 | 即時 |
| 👻 | `GHOST_BALL` | ゴーストボール | ボールがブロックを貫通 | 5 秒 |
| ❤️ | `EXTRA_LIFE` | エクストラライフ | ライフ +1（最大 5） | 即時 |
| 🔒 | `STICKY` | スティッキーパッド | ボールが粘着、Space で解放 | 10 秒 |
| ×2 | `SCORE_2X` | ダブルスコア | 全スコア ×2 | 10 秒 |
| 🔥 | `FIREBALL` | ファイヤーボール | ボールが軟らかいブロックを貫通破壊 | 6 秒 |

---

<a name="ja-levels"></a>

### 6. ステージ構成

全 50 ステージを 10 章に分類。各章ごとに新要素が導入される。

| ステージ | チャプター | 音楽テーマ | 新要素 |
|:--------:|-----------|-----------|--------|
| 1–5 | Dawn | DAWN (120 BPM) | 基本操作・ボトムシールド |
| 6–10 | Neon City | NEON CITY (128 BPM) | 硬化ブロック・ゴースト・レーザー・ポータル |
| 11–15 | Deep Space | DEEP SPACE (95 BPM) | 装甲ブロック・石ブロック・ブラックホール引力 |
| 16–20 | Storm | STORM (140 BPM) | 回転レイアウト・ブロック下降・連鎖爆発 |
| 21–25 | Crystal | CRYSTAL (110 BPM) | 花びら落下・回転ブロック群 |
| 26–30 | Void | VOID (105 BPM) | 点滅ブロック・暗黒物質（不可視ブロック） |
| 31–35 | Prism | PRISM (118 BPM) | レインボーブロック・鏡像世界・ブロック再生 |
| 36–40 | Nova | NOVA (132 BPM) | 移動する銀河グループ・脈動ブロック |
| 41–45 | Core | CORE (150 BPM) | 高密度石ブロック・強制マルチボールステージ |
| 46–50 | Infinity | INFINITY (160 BPM) | 全メカニクス同時・100 撃 BOSS ブロック |

**スター評価**

| 星 | 条件 |
|:--:|------|
| ⭐ | ステージクリア |
| ⭐⭐ | 目標スコアの 60 % 達成 |
| ⭐⭐⭐ | 目標スコア達成（タイムボーナス込み） |

---

<a name="ja-music"></a>

### 7. 音楽システム

音声ファイルは一切使用せず、Web Audio API によるリアルタイム合成。

**信号経路**

```
MusicEngine / AudioEngine
    └── musicGain / sfxGain
            └── masterGain
                    └── DynamicsCompressor
                            └── AudioContext.destination
```

**音楽レイヤー（チャプターごと）**

| レイヤー | 役割 | 波形 |
|---------|------|------|
| Bass Line | 低音グルーヴ | Sawtooth / Square |
| Chord Pad | ハーモニー | Sine ×3 |
| Melody | メインメロディ | Square / Triangle |
| Arpeggio | テクスチャ | Sine ×2 |
| Drums | ビート（キック・スネア・ハイハット） | ノイズ合成 |
| Ambient | アトモスフィア | Sine + ローパスフィルタ |

**効果音（18 イベント）**

| イベント | 合成内容 |
|---------|---------|
| パドルヒット | Sine 200 Hz → 400 Hz, 80 ms |
| ブロックヒット | 方形波 800 Hz, 50 ms |
| ブロック破壊 | Sawtooth + ノイズ + ピッチ下降, 120 ms |
| パワーアップ取得 | Sine 和音 C+E+G, 300 ms |
| 失球 | 低音下降 + ノイズ, 600 ms |
| ステージクリア | 上昇アルペジオ C4→E4→G4→C5, 1200 ms |
| 爆発 | 低周波バースト + ホワイトノイズ, 500 ms |

---

<a name="ja-settings"></a>

### 8. 設定・セーブ

**設定項目**

| 設定 | 種類 | デフォルト |
|------|------|-----------|
| 音楽音量 | スライダー 0–100 | 70 |
| 効果音音量 | スライダー 0–100 | 80 |
| ボール速度 | 遅い / 普通 / 速い | 普通 |
| 難易度 | 簡単 / 普通 / 難しい | 普通 |
| パーティクル | オン / オフ | オン |
| 画面シェイク | オン / オフ | オン |
| 言語 | zh-TW / EN | zh-TW |
| 操作モード | 自動 / キーボード / タッチ | 自動 |

**難易度スコア倍率** — 簡単 ×0.7 · 普通 ×1.0 · 難しい ×1.5

**セーブシステム**

- 保存先: `localStorage` キー `brickstorm-save-v1`
- ステージクリア後・設定変更後に自動保存
- 記録内容: 解放済みステージ · 各ステージ星数 · ハイスコア · リーダーボード（上位 20） · プレイ統計

---

<a name="ja-files"></a>

### 9. ファイル構成

```
breakout_game.html      ← デプロイ用単一ファイル
css/
  base.css              ← CSS 変数・リセット・タイポグラフィ
  layout.css            ← 画面区分・フレックス/グリッド骨格
  components.css        ← ボタン・スライダー・HUD・オーバーレイ
  responsive.css        ← タブレット・モバイル用ブレークポイント
js/
  config.js             ← グローバル定数・デフォルトセーブスキーマ
  main.js               ← エントリポイント・ゲームループ・グローバル配線
  game.js               ← コアゲームロジック（Game クラス）
  renderer.js           ← Canvas 描画コール（Renderer クラス）
  input-handler.js      ← キーボード / マウス / タッチ（InputHandler）
  level-manager.js      ← レベルデータ・ブロック配列ビルダー
  power-up-system.js    ← パワーアップ生成・適用・期限管理
  audio-engine.js       ← 効果音合成（AudioEngine）
  music-engine.js       ← BGM 合成（MusicEngine）
  particle-pool.js      ← オブジェクトプールパーティクルシステム
  ui-manager.js         ← 画面遷移・HUD・オーバーレイ管理
  save-system.js        ← localStorage 読み書き（SaveSystem）
breakout_game_spec.md   ← 完全設計仕様書（中文）
```

---

<a name="ja-modules"></a>

### 10. モジュール詳細

| モジュール | クラス | 役割 |
|-----------|-------|------|
| `config.js` | — | Canvas サイズ定数・ブロック定義・パワーアップリスト・デフォルトセーブスキーマ |
| `main.js` | — | シングルトン生成、`requestAnimationFrame` ループ開始、DOM イベント配線 |
| `game.js` | `Game` | ゲーム状態機械・物理更新・衝突判定・スコア計算・勝敗処理 |
| `renderer.js` | `Renderer` | Canvas 描画全般（背景・ブロック・パドル・ボール・パーティクル・HUD） |
| `input-handler.js` | `InputHandler` | キーボード・マウス・タッチを統合してパドル座標に変換 |
| `level-manager.js` | `LevelManager` | 全 50 ステージのレイアウトを保持し、ピクセル座標付きブロック配列を生成 |
| `power-up-system.js` | `PowerUpSystem` | カプセル落下生成・効果適用・フレームごとの期限切れ処理 |
| `audio-engine.js` | `AudioEngine` | Web Audio コンテキスト生成、18+ 種の効果音をオンデマンド合成 |
| `music-engine.js` | `MusicEngine` | レイヤード BGM をリアルタイム合成、チャプターごとにテーマ切替 |
| `particle-pool.js` | `ParticlePool` | 500 スロットのオブジェクトプールでパーティクル管理（GC 削減） |
| `ui-manager.js` | `UIManager` | 画面表示切替・設定行レンダリング・ステージグリッド・リーダーボード |
| `save-system.js` | `SaveSystem` | localStorage への JSON 読み書き・スキーマバージョン統合 |

---

<a name="ja-tech"></a>

### 11. 技術仕様

| 項目 | 仕様 |
|------|------|
| 言語 | Vanilla JavaScript (ES6+) |
| 描画 | HTML5 Canvas 2D |
| 音声 | Web Audio API |
| ストレージ | localStorage |
| フォント | Google Fonts (Orbitron, Exo 2, Share Tech Mono) |
| Canvas サイズ | 800 × 600 px（デスクトップ） |
| 目標 FPS | 60 fps デスクトップ / 30 fps モバイル |
| 読み込み時間 | < 500 ms（単一ファイル） |
| メモリ使用量 | < 100 MB |
| 物理演算 | AABB 衝突 + 高速時サブステップ |
| モバイル | タッチ追従・触覚フィードバック・向き案内 |

---

---

<a name="chinese"></a>

## 中文

### 目錄

| # | 章節 |
|---|------|
| 1 | [遊戲概覽](#zh-overview) |
| 2 | [遊玩方式](#zh-howtoplay) |
| 3 | [操作方式](#zh-controls) |
| 4 | [磚塊種類](#zh-bricks) |
| 5 | [道具系統](#zh-powerups) |
| 6 | [關卡架構](#zh-levels) |
| 7 | [音樂系統](#zh-music) |
| 8 | [設定與存檔](#zh-settings) |
| 9 | [檔案結構](#zh-files) |
| 10 | [模組詳細說明](#zh-modules) |
| 11 | [技術規格](#zh-tech) |

---

<a name="zh-overview"></a>

### 1. 遊戲概覽

**BRICKSTORM** 是一款純前端製作的打磚塊（Breakout／Arkanoid）風格遊戲。直接開啟單一 HTML 檔案即可在瀏覽器中遊玩，無需安裝、無需伺服器、無外部資源依賴。

| 項目 | 內容 |
|------|------|
| 關卡數量 | 50 關 |
| 支援平台 | 桌機、平板、手機 |
| 外部依賴 | 無（僅 Google Fonts，可降級使用系統字體） |
| 音效音樂 | 全部使用 Web Audio API 即時合成 |
| 畫面渲染 | HTML5 Canvas |
| 存檔機制 | localStorage（自動存檔） |

---

<a name="zh-howtoplay"></a>

### 2. 遊玩方式

1. 用瀏覽器開啟 `breakout_game.html`。
2. 在關卡選擇畫面選擇想玩的關卡。
3. 移動擋板，讓球保持在場地內。
4. 消滅所有可摧毀的磚塊即可過關。
5. 撿取磚塊碎裂後掉落的道具膠囊。
6. 預設 **3 條命**，球落底扣一命。
7. 持續連擊提升分數倍率；速度過關可獲得時間獎勵分。

**過關條件** — 消滅所有可摧毀磚塊（METAL 磚除外）  
**失敗條件** — 生命歸零

---

<a name="zh-controls"></a>

### 3. 操作方式

#### 鍵盤

| 按鍵 | 遊戲中 | 選單中 |
|------|--------|--------|
| `←` / `A` | 擋板左移 | 左移選項 |
| `→` / `D` | 擋板右移 | 右移選項 |
| `Space` | 發球 / 發射雷射 / 釋放黏板 | 確認 |
| `ESC` / `P` | 暫停 | 返回 |
| `Enter` | — | 確認 |
| `M` | 靜音 / 解除靜音 | — |
| `+` / `-` | 音量增減 | — |
| `F` | 全螢幕切換 | 全螢幕切換 |

#### 滑鼠 / 觸控

| 動作 | 結果 |
|------|------|
| 移動游標 / 手指 | 擋板水平跟隨 |
| 點擊 / 輕觸 | 發球、發射雷射、釋放黏板 |

---

<a name="zh-bricks"></a>

### 4. 磚塊種類

| 代碼 | 名稱 | 耐久 | 分數 | 特性 |
|------|------|:----:|:----:|------|
| `NORMAL_1` | 普通磚 | 1 | 10 | 一擊即碎 |
| `NORMAL_2` | 硬磚 | 2 | 20 | 第一擊變暗，第二擊碎 |
| `NORMAL_3` | 重裝磚 | 3 | 40 | 每擊顯示裂縫 |
| `STONE` | 石磚 | 5 | 100 | 石紋材質，水晶碎裂動畫 |
| `METAL` | 金屬磚 | ∞ | 0 | 不可摧毀，作為牆壁 |
| `BOMB` | 爆炸磚 | 1 | 50 | 擊碎後爆炸，連帶摧毀周圍 8 格 |
| `POWER` | 道具磚 | 1 | 20 | 必定掉落道具 |
| `RAINBOW` | 彩虹磚 | 1 | 50 | 擊碎後觸發隨機效果 |
| `GHOST` | 幽靈磚 | 1 | 20 | 在場上水平移動 |
| `LASER` | 雷射磚 | 1 | 25 | 擊碎後向下發射雷射 |
| `PORTAL` | 傳送磚 | 1 | 30 | 球穿越後從對應傳送門出現 |
| `SHIELD` | 護盾磚 | 1 | 15 | 保護其下方的磚塊 |
| `SCORE_2X` | 雙分磚 | 1 | 30 | 使區域分數加倍 |

---

<a name="zh-powerups"></a>

### 5. 道具系統

磚塊被摧毀時約有 8～22 % 機率掉落道具（道具磚為 100 %）。

| 圖示 | 代碼 | 名稱 | 效果 | 持續時間 |
|------|------|------|------|----------|
| ↔️ | `EXPAND` | 超寬擋板 | 擋板寬度 ×1.8 | 15 秒 |
| ↕️ | `SHRINK` | 縮小擋板 | 擋板寬度 ×0.6 | 10 秒 |
| ×3 | `MULTI` | 三球 | 新增 2 顆額外球 | 直到失球 |
| 🐢 | `SLOW` | 緩速 | 球速 ×0.7 | 8 秒 |
| ⚡ | `FAST` | 加速 | 球速 ×1.4 | 6 秒 |
| 🔫 | `LASER` | 雷射砲 | 擋板可發射雷射 | 12 秒 |
| 🛡️ | `SHIELD` | 底部護盾 | 底部出現一次性護盾接球 | 一次 |
| 💣 | `BOMB` | 炸彈 | 立即清除附近磚塊 | 即時 |
| 👻 | `GHOST_BALL` | 幽靈球 | 球可穿透磚塊 | 5 秒 |
| ❤️ | `EXTRA_LIFE` | 加命 | 生命 +1（上限 5） | 即時 |
| 🔒 | `STICKY` | 黏板 | 球碰擋板後黏住，按 Space 釋放 | 10 秒 |
| ×2 | `SCORE_2X` | 雙倍分數 | 所有得分 ×2 | 10 秒 |
| 🔥 | `FIREBALL` | 火球 | 球可穿透並摧毀軟質磚塊 | 6 秒 |

---

<a name="zh-levels"></a>

### 6. 關卡架構

全 50 關分為 10 大章節，每章引入新機制。

| 關卡 | 章節名 | 音樂主題 | 新機制 |
|:----:|--------|---------|--------|
| 1–5 | 黎明 | DAWN（120 BPM） | 基礎玩法、底部護盾教學 |
| 6–10 | 霓虹城 | NEON CITY（128 BPM） | 硬磚、幽靈磚、雷射磚、傳送磚 |
| 11–15 | 深空 | DEEP SPACE（95 BPM） | 重裝磚、石磚、黑洞引力 |
| 16–20 | 暴風 | STORM（140 BPM） | 旋轉佈局、磚塊下漂、連鎖爆炸 |
| 21–25 | 水晶 | CRYSTAL（110 BPM） | 花瓣下漂、旋轉磚塊群 |
| 26–30 | 虛空 | VOID（105 BPM） | 閃爍磚塊、暗黑物質（不可見磚） |
| 31–35 | 稜鏡 | PRISM（118 BPM） | 彩虹磚、鏡像世界、磚塊重生 |
| 36–40 | 新星 | NOVA（132 BPM） | 移動星系磚塊群、脈衝磚塊 |
| 41–45 | 核心 | CORE（150 BPM） | 高密度石磚、強制三球關卡 |
| 46–50 | 無限 | INFINITY（160 BPM） | 全機制同時啟動、100 擊 BOSS 磚 |

**星等評定**

| 星等 | 條件 |
|:----:|------|
| ⭐ | 完成關卡 |
| ⭐⭐ | 達到目標分數 60 % |
| ⭐⭐⭐ | 達到目標分數（含時間加成） |

---

<a name="zh-music"></a>

### 7. 音樂系統

所有音訊均透過 Web Audio API 即時合成，不載入任何音訊檔案。

**訊號路由**

```
MusicEngine / AudioEngine
    └── musicGain / sfxGain
            └── masterGain
                    └── DynamicsCompressor（動態壓縮）
                            └── AudioContext.destination
```

**音樂層次（每個章節主題）**

| 層次 | 功能 | 波形 |
|------|------|------|
| Bass Line（低音線） | 低音律動 | Sawtooth / Square |
| Chord Pad（和弦墊音） | 和聲 | Sine ×3 |
| Melody（主旋律） | 主要旋律 | Square / Triangle |
| Arpeggio（琶音） | 音色紋理 | Sine ×2 |
| Drums（節拍） | 大鼓 / 小鼓 / 踩鈸 | 合成噪音 |
| Ambient（氛圍音） | 環境氣氛 | Sine + 低通濾波器 |

**音效清單（18 種觸發事件）**

| 觸發事件 | 合成方式 |
|---------|---------|
| 球擊中擋板 | Sine，200 Hz → 400 Hz，80 ms |
| 球擊中磚塊 | 方波，800 Hz，50 ms |
| 磚塊被摧毀 | 鋸齒波 + 噪音 + 下滑音調，120 ms |
| 獲得道具 | Sine 和弦 C+E+G，明亮，300 ms |
| 失球 | 低音下滑 + 噪音，600 ms |
| 關卡完成 | 上升琶音 C4→E4→G4→C5，1200 ms |
| 爆炸磚引爆 | 低頻轟炸 + 白噪音，500 ms |

---

<a name="zh-settings"></a>

### 8. 設定與存檔

**設定項目**

| 設定 | 類型 | 預設值 |
|------|------|--------|
| 音樂音量 | 滑桿 0–100 | 70 |
| 音效音量 | 滑桿 0–100 | 80 |
| 球速倍率 | 慢 / 普通 / 快 | 普通 |
| 難度 | 簡單 / 普通 / 困難 | 普通 |
| 粒子效果 | 開 / 關 | 開 |
| 螢幕震動 | 開 / 關 | 開 |
| 語言 | zh-TW / EN | zh-TW |
| 控制方式 | 自動 / 鍵盤 / 觸控 | 自動 |

**難度分數倍率** — 簡單 ×0.7 · 普通 ×1.0 · 困難 ×1.5

**存檔系統**

- 儲存位置：`localStorage` 鍵值 `brickstorm-save-v1`
- 每關結束後與設定變更後自動存檔
- 儲存內容：已解鎖關卡 · 各關星等 · 最高分 · 排行榜（前 20 名） · 遊玩統計

---

<a name="zh-files"></a>

### 9. 檔案結構

```
breakout_game.html      ← 唯一發布檔案
css/
  base.css              ← CSS 變數、重置樣式、字體排版
  layout.css            ← 畫面區塊、flex/grid 骨架
  components.css        ← 按鈕、滑桿、HUD、覆蓋層卡片
  responsive.css        ← 平板與手機的響應式斷點
js/
  config.js             ← 全域常數與預設存檔結構
  main.js               ← 進入點、遊戲迴圈、全域配線
  game.js               ← 核心遊戲邏輯（Game 類別）
  renderer.js           ← Canvas 繪製指令（Renderer 類別）
  input-handler.js      ← 鍵盤 / 滑鼠 / 觸控（InputHandler）
  level-manager.js      ← 關卡資料與磚塊陣列產生器
  power-up-system.js    ← 道具生成、套用、到期同步
  audio-engine.js       ← 音效合成（AudioEngine）
  music-engine.js       ← 背景音樂合成（MusicEngine）
  particle-pool.js      ← 物件池粒子系統
  ui-manager.js         ← 畫面切換、HUD、覆蓋層管理
  save-system.js        ← localStorage 讀寫（SaveSystem）
breakout_game_spec.md   ← 完整設計規格書（中文）
```

---

<a name="zh-modules"></a>

### 10. 模組詳細說明

| 模組 | 類別 | 職責 |
|------|------|------|
| `config.js` | — | Canvas 尺寸常數、磚塊類型定義、道具清單、預設存檔結構 |
| `main.js` | — | 建立所有單例、啟動 `requestAnimationFrame` 迴圈、配接 DOM 事件 |
| `game.js` | `Game` | 遊戲狀態機、物理更新、碰撞偵測、分數計算、勝敗判斷 |
| `renderer.js` | `Renderer` | 全部 Canvas 繪製：背景、磚塊、擋板、球、粒子、HUD |
| `input-handler.js` | `InputHandler` | 整合鍵盤、滑鼠、觸控輸入，轉換為擋板 X 座標 |
| `level-manager.js` | `LevelManager` | 儲存全 50 關佈局，依像素座標產生帶類型的磚塊陣列 |
| `power-up-system.js` | `PowerUpSystem` | 生成下落膠囊、套用效果、每幀清除到期道具 |
| `audio-engine.js` | `AudioEngine` | 建立 Web Audio 環境，依需求即時合成 18+ 種音效 |
| `music-engine.js` | `MusicEngine` | 即時合成多層背景音樂，依章節切換主題 |
| `particle-pool.js` | `ParticlePool` | 500 個槽位的物件池管理爆炸粒子，避免 GC 停頓 |
| `ui-manager.js` | `UIManager` | 顯示切換畫面、渲染設定欄位、關卡格、排行榜 |
| `save-system.js` | `SaveSystem` | 讀寫 localStorage JSON、合併新舊存檔結構版本 |

---

<a name="zh-tech"></a>

### 11. 技術規格

| 項目 | 規格 |
|------|------|
| 語言 | Vanilla JavaScript (ES6+) |
| 渲染 | HTML5 Canvas 2D |
| 音訊 | Web Audio API |
| 儲存 | localStorage |
| 字體 | Google Fonts（Orbitron, Exo 2, Share Tech Mono） |
| Canvas 尺寸 | 800 × 600 px（桌機） |
| 目標幀率 | 60 fps 桌機 / 30 fps 低端手機 |
| 載入時間 | < 500 ms（單一檔案） |
| 記憶體使用 | < 100 MB |
| 物理引擎 | AABB 碰撞 + 高速時子步驟補正 |
| 行動裝置 | 觸控跟隨、觸覺震動回饋、螢幕方向提示 |
