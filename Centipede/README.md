# 🐛 CENTIPEDE — 蜈蚣射擊

> **Classic Arcade Revival · クラシックアーケード復刻 · 經典街機復刻**
>
> Pure HTML5 + CSS3 + Vanilla JS — No build tools, no server, just double-click `index.html` and play!

---

## 🌐 Language · 語言選択 · 語言

| | Jump to / ジャンプ / 快速跳轉 |
|---|---|
| 🇺🇸 English | [▶ Go to English Section](#-english) |
| 🇯🇵 日本語 | [▶ 日本語セクションへ](#-日本語) |
| 🇹🇼 繁體中文 | [▶ 前往中文區塊](#-繁體中文) |

---

<br>

# 🇺🇸 English

## Table of Contents
- [Game Introduction](#-game-introduction)
- [How to Play](#-how-to-play)
- [Controls](#-controls)
- [Enemies & Scoring](#-enemies--scoring)
- [Program Structure](#-program-structure)
- [File Reference](#-file-reference)

---

## 🎮 Game Introduction

**Centipede** is a faithful web recreation of the legendary 1980 Atari arcade game. Guide your shooter through a mushroom-filled field, blasting a relentless centipede as it winds its way down toward you!

| Feature | Description |
|---------|-------------|
| 🚀 Zero Setup | Double-click `index.html` — runs directly in any modern browser |
| 📱 Fully Responsive | Smooth on desktop, tablet, and mobile (portrait & landscape) |
| 🎨 5 Color Themes | Neon · Retro · Ocean · Sunset · High Contrast |
| 🔊 14+ Sound Effects | All synthesized via Web Audio API — works 100% offline |
| 🎵 3 Background Tracks | Chiptune sequencer — music never cuts out between screens |
| 💾 Auto Save | Progress saved to localStorage — continue anytime |
| ♿ Accessible | WCAG AA contrast · keyboard navigation · screen reader support |

### 🖥️ Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge | 100+ |
| Firefox | 100+ |
| Safari (macOS / iOS) | 15+ |
| Android Chrome | 100+ |

---

## 🕹️ How to Play

The game is played on a **30×36 grid**. Mushrooms scatter the field, and the centipede snakes down from the top. Destroy every segment before it reaches you!

### Field Overview

```
┌─────────────────────────────────┐
│  🐛🐛🐛🐛🐛  ← Centipede enters here
│  🍄   🍄  🍄  ← Mushrooms block/redirect
│  🍄 🍄   🍄
│  ─────────────  ← Player Zone starts
│       🚀        ← Your shooter
└─────────────────────────────────┘
```

### Centipede Behavior

| Situation | What Happens |
|-----------|-------------|
| Hits a mushroom or wall | Descends one row, reverses direction |
| Head hits a **poisoned** mushroom | Dives straight down into player zone! |
| Body segment destroyed | Splits into two centipedes — the next segment becomes a new head |
| Reaches player zone | Bounces back and forth; reinforcement heads appear periodically |

### Level Difficulty

| Level | Centipede | Speed |
|-------|-----------|-------|
| 1 | 1 head + 11 body (12 total) | 6 grids/s |
| 2 | 11 body + 1 solo head | 6.5 grids/s |
| 3 | 10 body + 2 solo heads | 7 grids/s |
| n | (13−n) body + (n−1) heads | 6 + (n−1)×0.5, max 14 |

---

## 🎯 Controls

### Desktop

| Action | Keys |
|--------|------|
| Move | `↑` `↓` `←` `→` or `W` `A` `S` `D` |
| Shoot | `Space` or `Enter` |
| Pause | `Esc` |
| Aim + Fire (mouse) | Move mouse inside game area, click to shoot |

### Mobile

| Control | Function |
|---------|----------|
| Virtual Joystick | 8-directional movement (floating, tap anywhere) |
| Fire Button | Hold for rapid fire (still limited to 1 bullet at a time) |
| Pause Button | Corner button in control bar |

> **No overlap!** Controls sit in a dedicated bar **outside** the canvas — the battlefield is never blocked.

---

## 👾 Enemies & Scoring

| Enemy | Behavior | Score |
|-------|----------|-------|
| 🐛 Centipede Head | Leads the chain downward | **100 pts** |
| 🐛 Centipede Body | Follows the head; splits on hit | **10 pts** |
| 🕷️ Spider | Zigzags in player zone; eats mushrooms | **300 / 600 / 900** (by distance) |
| 🪲 Flea | Falls straight down; plants mushrooms | **200 pts** |
| 🦂 Scorpion | Crosses screen horizontally; poisons mushrooms | **1000 pts** |
| 🍄 Mushroom | 4 HP obstacle; gives +1 pt when destroyed | **1 pt** |

### Bonus Lives

| Points | Reward |
|--------|--------|
| Every 12,000 pts | +1 Life (max 6) |

---

## 📁 Program Structure

The project is organized by **responsibility**, not by feature. Every CSS and JS file has exactly one job.

```
Centipede/
├── index.html              ← Entry point — double-click to play
├── css/
│   ├── base/               ← Foundation: reset, variables, typography
│   ├── layout/             ← Skeleton: layout grid, RWD breakpoints
│   ├── components/         ← UI widgets: menu, HUD, modals, controls
│   └── themes/             ← 5 color themes (CSS variable overrides)
└── js/
    ├── core/               ← Engine: main, game loop, state machine, config
    ├── entities/           ← Game objects: centipede, shooter, bullet, etc.
    ├── systems/            ← Logic engines: collision, scoring, levels, particles
    ├── audio/              ← Sound: Web Audio engine, SFX, music sequencer
    ├── input/              ← Input handlers: keyboard, mouse, touch
    ├── ui/                 ← Interface: menu, HUD, modals, settings
    └── utils/              ← Helpers: storage, i18n, utility functions
```

---

## 📄 File Reference

### `css/` — Stylesheets

| Layer | File | Role |
|-------|------|------|
| **base** | `reset.css` | CSS reset / normalize |
| **base** | `variables.css` | CSS custom properties (colors, spacing, font sizes) |
| **base** | `typography.css` | Font stack, sizes, weights, line heights |
| **layout** | `layout.css` | App skeleton: game shell, HUD bar, touch controls |
| **layout** | `responsive.css` | All `@media` breakpoints — desktop / tablet / mobile |
| **components** | `menu.css` | Main menu panel and button styles |
| **components** | `hud.css` | In-game score / lives / level bar |
| **components** | `modal.css` | Dialog popup base styles |
| **components** | `controls.css` | Virtual joystick and fire button |
| **components** | `settings.css` | Sliders, toggles, theme picker |
| **themes** | `theme-neon.css` | 🟢 Neon green on deep black (default) |
| **themes** | `theme-retro.css` | 🟡 Amber CRT phosphor |
| **themes** | `theme-ocean.css` | 🔵 Blue-cyan oceanic |
| **themes** | `theme-sunset.css` | 🟠 Warm orange-pink dusk |
| **themes** | `theme-mono.css` | ⬛ High-contrast black & white (accessible) |

### `js/` — Scripts

#### Core

| File | Role |
|------|------|
| `core/main.js` | Bootstrap: wires all modules together, starts the game |
| `core/gameLoop.js` | `requestAnimationFrame` loop with fixed timestep + interpolated render |
| `core/stateMachine.js` | State manager: MENU → PLAYING → PAUSED → GAMEOVER |
| `core/config.js` | Global constants: grid size, speeds, scoring, spawn timings |

#### Entities

| File | Role |
|------|------|
| `entities/centipede.js` | Chain movement, splitting, head AI, poison dive |
| `entities/shooter.js` | Player movement, shooting, death animation |
| `entities/bullet.js` | Single-bullet constraint, flight, hit detection |
| `entities/mushroom.js` | 4-stage HP, poison state, repair logic |
| `entities/spider.js` | Zigzag movement in player zone, mushroom eating |
| `entities/flea.js` | Vertical drop, mushroom planting, 2-hit kill |
| `entities/scorpion.js` | Horizontal crossing, mushroom poisoning |

#### Systems

| File | Role |
|------|------|
| `systems/collision.js` | Grid-based + AABB hybrid collision detection |
| `systems/spawner.js` | Enemy spawn scheduling by level and elapsed time |
| `systems/score.js` | Score tracking, high score, extra-life milestones |
| `systems/level.js` | Level progression and difficulty curve |
| `systems/particles.js` | Explosion and hit particle effects |

#### Audio

| File | Role |
|------|------|
| `audio/audioEngine.js` | Single `AudioContext`, gain routing, auto-unlock, suspend on tab hide |
| `audio/sfx.js` | 14+ synthesized sound effects (oscillators, noise buffers) |
| `audio/music.js` | Chiptune sequencer: 3 tracks, seamless cross-scene continuation |

#### Input

| File | Role |
|------|------|
| `input/keyboard.js` | Arrow keys, WASD, Space/Enter, Esc |
| `input/mouse.js` | Mouse tracking for shooter aim + click-to-fire |
| `input/touch.js` | Floating virtual joystick + fire button; multi-touch via `touch.identifier` |

#### UI

| File | Role |
|------|------|
| `ui/menu.js` | Main menu logic: new game, continue, help, settings |
| `ui/hud.js` | Live score/lives/level DOM updates |
| `ui/modal.js` | Generic dialog open/close system |
| `ui/settings.js` | Settings read/write, theme switching, volume control |

#### Utils

| File | Role |
|------|------|
| `utils/storage.js` | `localStorage` wrapper with schema validation and fallback |
| `utils/helpers.js` | `clamp`, `random`, grid-to-pixel conversion |
| `utils/i18n.js` | Internationalisation: 繁中 · English · 日本語 |

---

[⬆ Back to top](#-centipede--蜈蚣射擊)

---

<br>

# 🇯🇵 日本語

## 目次
- [ゲーム紹介](#-ゲーム紹介)
- [ゲームプレイ](#-ゲームプレイ)
- [操作方法](#-操作方法)
- [敵とスコア](#-敵とスコア)
- [プログラム構成](#-プログラム構成)
- [ファイル一覧](#-ファイル一覧)

---

## 🎮 ゲーム紹介

**Centipede（ムカデ射撃）** は、1980年のAtariアーケードゲームを忠実にWebで再現した作品です。キノコが散らばったフィールドで砲台を操作し、上から降りてくるムカデを撃ち倒しましょう！

| 特徴 | 内容 |
|------|------|
| 🚀 セットアップ不要 | `index.html` をダブルクリックするだけ！ |
| 📱 フル対応 RWD | デスクトップ・タブレット・スマホ（縦横両向き）に対応 |
| 🎨 5種カラーテーマ | ネオン・レトロ・オーシャン・サンセット・高コントラスト |
| 🔊 14種以上の効果音 | Web Audio APIでプログラム合成 — 完全オフライン対応 |
| 🎵 3曲のBGM | チップチューンシーケンサー — 画面切替でも途切れない |
| 💾 自動セーブ | localStorage に自動保存、いつでも再開可能 |

### 🖥️ 対応ブラウザ

| ブラウザ | 最低バージョン |
|---------|--------------|
| Chrome / Edge | 100以上 |
| Firefox | 100以上 |
| Safari (macOS / iOS) | 15以上 |
| Android Chrome | 100以上 |

---

## 🕹️ ゲームプレイ

フィールドは **30×36グリッド**。キノコが障害物として散らばり、ムカデが上から蛇行しながら降りてきます。全節を倒せばステージクリア！

### フィールド概要

```
┌─────────────────────────────────┐
│  🐛🐛🐛🐛🐛  ← ムカデがここから出現
│  🍄   🍄  🍄  ← キノコが進路を変える
│  🍄 🍄   🍄
│  ─────────────  ← プレイヤーゾーン開始
│       🚀        ← 操作する砲台
└─────────────────────────────────┘
```

### ムカデの動作

| 状況 | 挙動 |
|------|------|
| キノコ・壁に当たる | 1行下がり向きを反転 |
| 頭が **毒キノコ** に触れる | プレイヤーゾーンへ急降下！ |
| 胴体が撃たれる | そこで分裂し、次の節が新たな頭になる |
| プレイヤーゾーンに到達 | 往復移動開始、援軍の頭が定期的に出現 |

### レベル難易度

| レベル | ムカデ構成 | 速度 |
|--------|-----------|------|
| 1 | 頭1＋胴11（計12節） | 6グリッド/秒 |
| 2 | 胴11＋独立頭1 | 6.5グリッド/秒 |
| 3 | 胴10＋独立頭2 | 7グリッド/秒 |
| n | (13−n)胴＋(n−1)独立頭 | 6＋(n−1)×0.5、最大14 |

---

## 🎯 操作方法

### デスクトップ

| 操作 | キー |
|------|------|
| 移動 | `↑` `↓` `←` `→` または `W` `A` `S` `D` |
| 発射 | `Space` または `Enter` |
| 一時停止 | `Esc` |
| マウス照準＋発射 | ゲームエリア内でマウスを動かし、クリックで発射 |

### モバイル

| 操作 | 機能 |
|------|------|
| 仮想スティック | 8方向移動（浮動式、どこでも押して使える） |
| 発射ボタン | 長押しで連射（同時1発制限あり） |
| 一時停止ボタン | コントロールバーの隅に配置 |

> **ゲーム画面は常に丸見え！** 操作UIはキャンバス**外**の専用エリアに配置。フィールドに重なりません。

---

## 👾 敵とスコア

| 敵 | 行動 | スコア |
|----|------|--------|
| 🐛 ムカデ頭 | 先頭として蛇行 | **100点** |
| 🐛 ムカデ胴 | 頭に追従、被弾で分裂 | **10点** |
| 🕷️ クモ | プレイヤーゾーンをジグザグ移動、キノコを食べる | **300 / 600 / 900**（距離による） |
| 🪲 ノミ | 垂直落下しながらキノコを植える | **200点** |
| 🦂 サソリ | 横断しながらキノコを毒化する | **1000点** |
| 🍄 キノコ | 耐久4の障害物（破壊で+1点） | **1点** |

### ボーナスライフ

| ポイント | 報酬 |
|---------|------|
| 12,000点ごと | ライフ+1（最大6） |

---

## 📁 プログラム構成

プロジェクトは **役割別** に整理されています。CSSもJSも1ファイル＝1責務。

```
Centipede/
├── index.html              ← エントリーポイント（ダブルクリックで起動）
├── css/
│   ├── base/               ← 基盤：リセット・変数・タイポグラフィ
│   ├── layout/             ← 骨格：レイアウト・RWD ブレークポイント
│   ├── components/         ← UIパーツ：メニュー・HUD・モーダル・操作
│   └── themes/             ← 5種カラーテーマ（CSS変数オーバーライド）
└── js/
    ├── core/               ← エンジン：初期化・ゲームループ・状態機械・設定
    ├── entities/           ← ゲームオブジェクト：ムカデ・砲台・弾・キノコ等
    ├── systems/            ← ロジック：衝突・スコア・レベル・パーティクル
    ├── audio/              ← サウンド：Audioエンジン・効果音・BGMシーケンサー
    ├── input/              ← 入力：キーボード・マウス・タッチ
    ├── ui/                 ← UI：メニュー・HUD・モーダル・設定
    └── utils/              ← ユーティリティ：ストレージ・i18n・汎用関数
```

---

## 📄 ファイル一覧

### `css/` スタイルシート

| レイヤー | ファイル | 役割 |
|---------|---------|------|
| **base** | `reset.css` | CSSリセット |
| **base** | `variables.css` | CSS変数（色・余白・フォントサイズ） |
| **base** | `typography.css` | フォントスタック・サイズ・行高 |
| **layout** | `layout.css` | アプリ骨格：ゲームシェル・HUDバー・タッチUI |
| **layout** | `responsive.css` | 全 `@media` ブレークポイント集約 |
| **components** | `menu.css` | メインメニューパネル・ボタンスタイル |
| **components** | `hud.css` | ゲーム中スコア・ライフ・レベルバー |
| **components** | `modal.css` | ダイアログ基本スタイル |
| **components** | `controls.css` | 仮想スティック・発射ボタン |
| **components** | `settings.css` | スライダー・トグル・テーマ選択 |
| **themes** | `theme-neon.css` | 🟢 ネオングリーン（デフォルト） |
| **themes** | `theme-retro.css` | 🟡 琥珀色CRT |
| **themes** | `theme-ocean.css` | 🔵 ブルーシアン |
| **themes** | `theme-sunset.css` | 🟠 夕陽オレンジ |
| **themes** | `theme-mono.css` | ⬛ 高コントラスト白黒 |

### `js/` スクリプト

#### コア

| ファイル | 役割 |
|---------|------|
| `core/main.js` | 全モジュールを組み立てて起動 |
| `core/gameLoop.js` | 固定タイムステップ＋補間レンダリングのメインループ |
| `core/stateMachine.js` | MENU→PLAYING→PAUSED→GAMEOVER 状態管理 |
| `core/config.js` | グリッドサイズ・速度・スコア等の全グローバル定数 |

#### エンティティ

| ファイル | 役割 |
|---------|------|
| `entities/centipede.js` | 連鎖移動・分裂・頭AI・毒急降下 |
| `entities/shooter.js` | プレイヤー移動・発射・死亡アニメ |
| `entities/bullet.js` | 1発制限・飛行・命中判定 |
| `entities/mushroom.js` | 4段階HP・毒化状態・修復ロジック |
| `entities/spider.js` | プレイヤーゾーンのジグザグ・キノコ食べ |
| `entities/flea.js` | 垂直落下・キノコ植え・2発撃破 |
| `entities/scorpion.js` | 横断移動・キノコ毒化 |

#### システム

| ファイル | 役割 |
|---------|------|
| `systems/collision.js` | グリッド＋AABBハイブリッド衝突判定 |
| `systems/spawner.js` | レベル・時間に応じた敵スポーンスケジューリング |
| `systems/score.js` | スコア管理・ハイスコア・ライフ追加マイルストーン |
| `systems/level.js` | レベル進行・難易度カーブ |
| `systems/particles.js` | 爆発・命中パーティクルエフェクト |

#### オーディオ

| ファイル | 役割 |
|---------|------|
| `audio/audioEngine.js` | AudioContext管理・ゲイン経路・自動解除・タブ非表示時停止 |
| `audio/sfx.js` | 14種以上の合成効果音（オシレーター・ノイズバッファ） |
| `audio/music.js` | チップチューンシーケンサー：3曲、シーン間シームレス再生 |

#### 入力

| ファイル | 役割 |
|---------|------|
| `input/keyboard.js` | 矢印キー・WASD・Space/Enter・Esc |
| `input/mouse.js` | マウストラッキングによる照準＋クリック発射 |
| `input/touch.js` | 浮動仮想スティック＋発射ボタン、`touch.identifier` でマルチタッチ分流 |

#### UI

| ファイル | 役割 |
|---------|------|
| `ui/menu.js` | メインメニューロジック |
| `ui/hud.js` | スコア・ライフ・レベルのリアルタイムDOM更新 |
| `ui/modal.js` | 汎用ダイアログ開閉システム |
| `ui/settings.js` | 設定読み書き・テーマ切替・音量制御 |

#### ユーティリティ

| ファイル | 役割 |
|---------|------|
| `utils/storage.js` | スキーマ検証付きlocalStorageラッパー |
| `utils/helpers.js` | `clamp`・`random`・グリッド⇔ピクセル変換 |
| `utils/i18n.js` | 繁中・English・日本語 多言語対応 |

---

[⬆ トップへ戻る](#-centipede--蜈蚣射擊)

---

<br>

# 🇹🇼 繁體中文

## 目錄
- [遊戲介紹](#-遊戲介紹)
- [遊戲玩法](#-遊戲玩法)
- [操作方式](#-操作方式)
- [敵人與得分](#-敵人與得分)
- [程式分類](#-程式分類)
- [程式介紹](#-程式介紹)

---

## 🎮 遊戲介紹

**Centipede（蜈蚣射擊）** 是 1980 年代 Atari 街機經典的忠實網頁復刻版！在佈滿蘑菇的戰場中操控砲台，射擊從頂部蜿蜒而下的蜈蚣，在牠抵達底部之前將其全數消滅！

| 特色 | 說明 |
|------|------|
| 🚀 零安裝 | 雙擊 `index.html` 即玩，無需伺服器、無需建置工具 |
| 📱 全裝置支援 | 桌機、平板、手機（直向/橫向）皆順暢 |
| 🎨 5 種配色主題 | 霓虹 · 復古 · 海洋 · 夕陽 · 高對比 |
| 🔊 14 種以上音效 | Web Audio API 程式合成，完全離線可用 |
| 🎵 3 首背景音樂 | Chiptune 音序器，切換畫面音樂不中斷 |
| 💾 自動存檔 | 自動寫入 localStorage，隨時繼續遊戲 |
| ♿ 無障礙設計 | WCAG AA 色彩對比 · 鍵盤操作 · 螢幕閱讀器支援 |

### 🖥️ 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome / Edge | 100 以上 |
| Firefox | 100 以上 |
| Safari（macOS / iOS） | 15 以上 |
| Android Chrome | 100 以上 |

---

## 🕹️ 遊戲玩法

遊戲場地為 **30×36 格子制**。蘑菇隨機散布在場地上，蜈蚣從頂部蜿蜒而下。消滅所有蜈蚣節才能過關！

### 場地示意

```
┌─────────────────────────────────┐
│  🐛🐛🐛🐛🐛  ← 蜈蚣從頂部進入
│  🍄   🍄  🍄  ← 蘑菇阻擋並讓蜈蚣轉向
│  🍄 🍄   🍄
│  ─────────────  ← 玩家活動區起始
│       🚀        ← 你操控的砲台
└─────────────────────────────────┘
```

### 蜈蚣行為規則

| 情況 | 結果 |
|------|------|
| 碰到蘑菇或牆壁 | 下移一列並反向 |
| 頭節碰到**毒蘑菇** | 立刻俯衝至玩家區！ |
| 身節被擊中 | 在該點分裂，後段第一節升為新頭 |
| 進入玩家活動區 | 在區內來回移動，定期追加援軍頭 |

### 關卡難度曲線

| 關卡 | 蜈蚣構成 | 速度 |
|------|----------|------|
| 第 1 關 | 1 頭 + 11 身（共 12 節） | 6 格/秒 |
| 第 2 關 | 11 身 + 獨立頭 ×1 | 6.5 格/秒 |
| 第 3 關 | 10 身 + 獨立頭 ×2 | 7 格/秒 |
| 第 n 關 | (13−n) 身 + 獨立頭 ×(n−1) | 6+(n−1)×0.5，上限 14 |

---

## 🎯 操作方式

### 桌機

| 動作 | 按鍵 |
|------|------|
| 移動 | `↑` `↓` `←` `→` 或 `W` `A` `S` `D` |
| 射擊 | `Space` 或 `Enter` |
| 暫停 | `Esc` |
| 滑鼠瞄準＋射擊 | 在遊戲區內移動滑鼠，點擊射擊 |

### 行動裝置

| 控制 | 功能 |
|------|------|
| 虛擬搖桿 | 8 方向移動（浮動式，在搖桿區任意按下即生成） |
| 射擊鍵 | 按住連射（仍受單發限制）；可在設定中切換左右位置 |
| 暫停鍵 | 位於控制列角落 |

> **視野絕不被遮擋！** 操作控制列置於畫布**外**的獨立區塊，戰場完整呈現。

---

## 👾 敵人與得分

| 敵人 | 行為 | 得分 |
|------|------|------|
| 🐛 蜈蚣頭節 | 帶領整條蜈蚣蜿蜒前進 | **100 分** |
| 🐛 蜈蚣身節 | 跟隨頭節；被擊中時分裂 | **10 分** |
| 🕷️ 蜘蛛 | 在玩家活動區之字形移動，會吃蘑菇 | **300 / 600 / 900**（依命中距離） |
| 🪲 跳蚤 | 垂直落下，沿途播種蘑菇；2 發擊殺 | **200 分** |
| 🦂 蠍子 | 水平橫越場地，讓途經蘑菇變毒 | **1000 分** |
| 🍄 蘑菇 | 4 血量障礙物（摧毀得 1 分） | **1 分** |

### 獎勵生命

| 分數條件 | 獎勵 |
|---------|------|
| 每達 12,000 分 | +1 條生命（上限 6 條） |

> 玩家死亡後，場上毒蘑菇恢復、半毀蘑菇修復，每修復一顆給予少量分數。

---

## 📁 程式分類

整個專案依**職責**分類，CSS 與 JS 各有其明確責任，`index.html` 僅負責引入組裝。

```
Centipede/
├── index.html              ← 唯一入口，雙擊即玩
├── css/
│   ├── base/               ← 基礎層：重置、CSS 變數、字體規則
│   ├── layout/             ← 版面骨架：整體佈局、RWD 斷點
│   ├── components/         ← UI 元件：選單、HUD、彈窗、虛擬按鍵
│   └── themes/             ← 5 種配色主題（CSS 變數覆蓋）
└── js/
    ├── core/               ← 核心引擎：初始化、遊戲迴圈、狀態機、設定常數
    ├── entities/           ← 遊戲實體：蜈蚣、砲台、子彈、蘑菇等
    ├── systems/            ← 邏輯系統：碰撞、計分、關卡、粒子特效
    ├── audio/              ← 音訊：引擎管理、音效合成、音樂音序器
    ├── input/              ← 輸入處理：鍵盤、滑鼠、觸控
    ├── ui/                 ← 介面邏輯：選單、HUD 更新、彈窗、設定
    └── utils/              ← 工具函式：存檔封裝、多語言、通用函數
```

### 載入順序（依賴關係）

```
utils → config → systems → entities → audio → input → ui → core(main)
```

每個 JS 檔以 **IIFE** 包裹，公開介面掛載至 `window.Game` 全域命名空間（如 `Game.Audio`、`Game.Entities.Centipede`），避免全域污染。

---

## 📄 程式介紹

### `css/` — 樣式表

| 層級 | 檔案 | 說明 |
|------|------|------|
| **base** | `reset.css` | CSS 重置與標準化 |
| **base** | `variables.css` | 全站 CSS 自訂屬性（配色、字級、間距） |
| **base** | `typography.css` | 字體堆疊、字級比例、行高、字重規則 |
| **layout** | `layout.css` | 應用程式骨架：遊戲殼層、HUD 列、觸控控制區 |
| **layout** | `responsive.css` | 集中管理所有 `@media` 斷點（Desktop / Tablet / Mobile） |
| **components** | `menu.css` | 主選單面板與按鈕樣式 |
| **components** | `hud.css` | 遊戲中分數 / 生命 / 關卡顯示列 |
| **components** | `modal.css` | 彈窗共用基礎樣式 |
| **components** | `controls.css` | 虛擬搖桿與射擊鍵 |
| **components** | `settings.css` | 設定滑桿、開關、主題色票選擇器 |
| **themes** | `theme-neon.css` | 🟢 霓虹主題（預設）— 深底螢光綠紫 |
| **themes** | `theme-retro.css` | 🟡 復古主題 — 黑底琥珀 CRT 情懷 |
| **themes** | `theme-ocean.css` | 🔵 海洋主題 — 深藍清爽藍青色系 |
| **themes** | `theme-sunset.css` | 🟠 夕陽主題 — 橘粉紫暖色系 |
| **themes** | `theme-mono.css` | ⬛ 高對比主題 — 純黑白，無障礙友善 |

### `js/` — 腳本

#### 核心（core）

| 檔案 | 說明 |
|------|------|
| `core/main.js` | 進入點：初始化並組裝所有模組，啟動遊戲 |
| `core/gameLoop.js` | `requestAnimationFrame` 主迴圈，固定時間步長＋插值渲染 |
| `core/stateMachine.js` | 遊戲狀態機：MENU → PLAYING → PAUSED → GAMEOVER |
| `core/config.js` | 全域常數：格子尺寸、速度、計分表、生成時機 |

#### 遊戲實體（entities）

| 檔案 | 說明 |
|------|------|
| `entities/centipede.js` | 鏈式移動、分裂邏輯、頭節 AI、毒蘑菇俯衝 |
| `entities/shooter.js` | 玩家移動、射擊冷卻、死亡爆炸動畫 |
| `entities/bullet.js` | 單發限制、垂直飛行、命中判定 |
| `entities/mushroom.js` | 4 階段血量、毒化狀態、死亡後修復邏輯 |
| `entities/spider.js` | 玩家活動區之字形移動、接觸蘑菇即吃掉 |
| `entities/flea.js` | 垂直落下、沿途隨機播種蘑菇、2 發擊殺（中 1 發加速） |
| `entities/scorpion.js` | 水平橫越場地、途經蘑菇全數毒化 |

#### 邏輯系統（systems）

| 檔案 | 說明 |
|------|------|
| `systems/collision.js` | 格子制＋AABB 混合碰撞偵測 |
| `systems/spawner.js` | 依關卡與時間排程敵人生成 |
| `systems/score.js` | 分數追蹤、最高分更新、額外生命里程碑 |
| `systems/level.js` | 關卡進程管理、難度曲線計算 |
| `systems/particles.js` | 爆炸與命中粒子特效系統 |

#### 音訊（audio）

| 檔案 | 說明 |
|------|------|
| `audio/audioEngine.js` | 單一 AudioContext 管理，增益路由，首次互動自動解鎖，頁面隱藏時暫停 |
| `audio/sfx.js` | 14 種以上程式合成音效（振盪器、噪音緩衝）含節流與隨機 detune |
| `audio/music.js` | Chiptune 音序器：3 首背景音樂，跨畫面無縫續播，淡入淡出切換 |

#### 輸入（input）

| 檔案 | 說明 |
|------|------|
| `input/keyboard.js` | 方向鍵、WASD、Space/Enter 射擊、Esc 暫停 |
| `input/mouse.js` | 滑鼠在遊戲區內移動牽引砲台，點擊射擊 |
| `input/touch.js` | 浮動式虛擬搖桿＋射擊鍵，以 `touch.identifier` 分流多點觸控 |

#### 介面（ui）

| 檔案 | 說明 |
|------|------|
| `ui/menu.js` | 主選單邏輯：開始新遊戲、繼續遊戲、說明、設定 |
| `ui/hud.js` | 分數、生命、關卡的即時 DOM 更新 |
| `ui/modal.js` | 彈窗（說明 / 暫停 / 遊戲結束）開關共用邏輯 |
| `ui/settings.js` | 設定讀寫、主題即時切換、音量控制、多語言切換 |

#### 工具（utils）

| 檔案 | 說明 |
|------|------|
| `utils/storage.js` | localStorage 封裝：schema 驗證、損毀靜默重置、隱私模式降級 |
| `utils/helpers.js` | `clamp`、`random`、格子座標 ↔ 像素座標轉換等通用函式 |
| `utils/i18n.js` | 多語言系統：繁體中文 · English · 日本語，支援 DOM 自動翻譯 |

### 音效清單

| # | ID | 觸發時機 | 合成概述 |
|---|----|----------|----------|
| 1 | `shoot` | 玩家射擊 | 短促方波下滑音 |
| 2 | `hit_segment` | 命中蜈蚣身節 | 噪音爆＋短三角波 |
| 3 | `hit_head` | 命中蜈蚣頭節 | 雙音上揚琶音（較華麗） |
| 4 | `hit_mushroom` | 命中蘑菇（未毀） | 低沉短「咚」 |
| 5 | `mushroom_destroy` | 蘑菇摧毀 | 碎裂噪音衰減 |
| 6 | `spider_kill` | 擊殺蜘蛛 | 三連上行音＋噪音尾 |
| 7 | `flea_kill` | 擊殺跳蚤 | 高頻啾聲下落 |
| 8 | `scorpion_kill` | 擊殺蠍子 | 金屬感 FM 鈴聲 |
| 9 | `player_death` | 玩家死亡 | 長下滑爆炸（白噪音＋鋸齒波） |
| 10 | `extra_life` | 獲得額外生命 | 上行大調琶音（1-up 風格） |
| 11 | `level_clear` | 過關 | 四音勝利短句 |
| 12 | `poison_dive` | 蜈蚣觸毒俯衝 | 急促警報雙音交替 |
| 13 | `ui_move` | 選單焦點移動 | 極短「嗶」 |
| 14 | `ui_confirm` | 按鈕確認 | 雙音上揚「叮咚」 |
| 15 | `ui_error` | 無效操作 | 低音「噗」（下行） |

### 配色主題規格

| 主題 | 風格 | 背景色 | 主強調色 |
|------|------|--------|---------|
| 🟢 霓虹 Neon（預設） | 深底螢光 | `#0a0a14` | `#39ff14` |
| 🟡 復古 Retro | 黑底琥珀 | `#101000` | `#ffb000` |
| 🔵 海洋 Ocean | 深藍清爽 | `#06283d` | `#47b5ff` |
| 🟠 夕陽 Sunset | 暖色系 | `#2b1224` | `#ff7849` |
| ⬛ 高對比 Mono | 無障礙 | `#000000` | `#ffffff` |

---

[⬆ 回到頂部](#-centipede--蜈蚣射擊)
