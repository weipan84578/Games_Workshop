# 🚀 Asteroids

<div align="center">

**A modern web remake of the 1979 Atari arcade classic — pure HTML5 Canvas + Vanilla JS, zero dependencies.**

[English](#-english) · [日本語](#-日本語) · [繁體中文](#-繁體中文)

`HTML5 Canvas` · `Vanilla JavaScript` · `Web Audio API` · `No Build / No Server`

</div>

---

## 🇬🇧 English

### 📖 Table of Contents

| Section | What's inside |
|---|---|
| [Game Introduction](#-game-introduction) | What this game is and its feature highlights |
| [How to Play](#-how-to-play) | Controls, scoring, power-ups, level rules |
| [Code Introduction](#-code-introduction) | Tech stack, architecture and design decisions |
| [Code Organization](#-code-organization) | Directory layout and module responsibilities |

### 🎮 Game Introduction

A faithful, modernized remake of **Asteroids (Atari, 1979)**. Pilot a lone ship through an ever-denser asteroid field, blast rocks into smaller fragments, dodge UFO fire, and chase the high score.

**Getting started:** just open `index.html` in a browser — no install, no server, no build step.

| Feature | Detail |
|---|---|
| 🌐 Multi-language | Traditional Chinese (default) / English / Japanese, switchable in Settings |
| 🎨 5 color themes | Neon / Retro / Ocean / Sunset / Mono |
| 🔊 Synthesized audio | All BGM & SFX generated live via Web Audio API — zero audio files |
| 📱 Mobile ready | Responsive layout + touch controls (3 layouts, adjustable opacity) |
| 💾 Save & continue | Auto-save on pause / exit; high score persisted in `localStorage` |
| ✨ Game feel | Particle explosions, screen shake, parallax starfield, FPS display |

### 🕹️ How to Play

#### Controls

| Action | Keyboard | Touch |
|---|---|---|
| Turn left / right | `A` `←` / `D` `→` | `L` / `R` buttons |
| Thrust | `W` / `↑` | `TH` button |
| Fire | `Space` / `J` | `FIRE` button |
| Hyperspace warp ⚠️ | `Shift` / `K` | `WP` button |
| Pause / Resume | `Esc` / `P` | `II` HUD button |
| Mute | `M` | `M` HUD button |

> ⚠️ Warp teleports you to a random spot with a **15% self-destruct risk** and a 5-second cooldown. Use it as a last resort!

#### Scoring

| Target | Points | Note |
|---|---:|---|
| Large asteroid | 20 | splits into 2 medium |
| Medium asteroid | 50 | splits into 2 small |
| Small asteroid | 100 | destroyed outright |
| Large UFO | 200 | fires randomly |
| Small UFO | 1,000 | aims at you — dangerous! |
| 🎁 Extra life | — | every 10,000 points |

#### Power-ups (12% drop chance from destroyed asteroids)

| Power-up | Effect | Duration |
|---|---|---:|
| 🛡️ Shield | Absorbs one hit | 10 s |
| 🔱 Triple | Fires three bullets at once | 10 s |
| 🚀 Boost | Raises thrust power | 8 s |
| ⚡ Rapid | Halves fire cooldown | 8 s |

#### Level Progression

| Rule | Formula |
|---|---|
| Asteroid count | `min(3 + level, 11)` |
| Asteroid speed | `×(1 + (level − 1) × 0.06)` |
| UFO spawn delay | shrinks each level (min 8 s) |

### 🧩 Code Introduction

| Aspect | Choice |
|---|---|
| Language | ES5-style Vanilla JavaScript (IIFE modules, `"use strict"`) |
| Rendering | Single `<canvas>` 2D context, DPR-aware (capped at 2×) |
| Game loop | `requestAnimationFrame` with delta-time updates |
| State | Finite State Machine: `MENU → PLAYING ⇄ PAUSED → GAME_OVER` |
| Audio | Web Audio API oscillators/noise — fully procedural, no asset files |
| Persistence | `localStorage` (`asteroids.settings` / `asteroids.highscore` / `asteroids.save`) |
| Theming | CSS custom properties switched via `body[data-theme]` |
| i18n | `data-i18n` attribute scanning + runtime dictionary (`js/data/i18n.js`) |
| Dependencies | **None** — no npm, no framework, no build tools |

Every module attaches itself to a shared `window.Game` namespace (e.g. `Game.Ship`, `Game.Collision`), loaded in dependency order by plain `<script>` tags in `index.html`. The central `Game.App` object in `js/main.js` owns all entity arrays and orchestrates update → collision → draw each frame.

### 🗂️ Code Organization

```
Asteroids/
├── index.html              # Single entry point — all screens, CSS & JS includes
├── css/
│   ├── base/               # reset / CSS variables / typography
│   ├── layout/             # screen switching, responsive breakpoints
│   ├── components/         # buttons, menu, HUD, modal, settings, touch controls
│   └── themes/             # 5 color themes (neon, retro, ocean, sunset, mono)
└── js/
    ├── core/               # engine: constants, game loop, FSM, utils, main app
    ├── data/               # i18n dictionary, level curve, localStorage
    ├── audio/              # Web Audio engine, procedural SFX & music
    ├── systems/            # input, physics, collision, score, spawner
    ├── entities/           # ship, asteroid, bullet, UFO, powerup, particle
    └── ui/                 # HUD, menu, help, settings, touch controls
```

| Layer | Files | Responsibility |
|---|---|---|
| `js/core/` | `main.js`, `gameLoop.js`, `stateManager.js`, `constants.js`, `utils.js` | App bootstrap, rAF loop, FSM, tuning constants, math helpers |
| `js/data/` | `i18n.js`, `levels.js`, `storage.js` | Translations, difficulty curve, save/load |
| `js/audio/` | `audioEngine.js`, `sfx.js`, `music.js` | AudioContext & gain routing, sound effects, adaptive BGM |
| `js/systems/` | `input.js`, `physics.js`, `collision.js`, `score.js`, `spawner.js` | Keyboard state, movement & screen wrap, circle collision, scoring, entity spawning |
| `js/entities/` | `ship.js`, `asteroid.js`, `bullet.js`, `ufo.js`, `powerup.js`, `particle.js` | Each entity's `create / update / draw` lifecycle |
| `js/ui/` | `hud.js`, `menu.js`, `helpUI.js`, `settingsUI.js`, `touchControls.js` | DOM-based UI bound to game state |

---

## 🇯🇵 日本語

### 📖 目次

| セクション | 内容 |
|---|---|
| [ゲーム紹介](#-ゲーム紹介) | このゲームの概要と特徴 |
| [遊び方](#-遊び方) | 操作方法・スコア・パワーアップ・レベル仕様 |
| [プログラム紹介](#-プログラム紹介) | 技術スタックとアーキテクチャ |
| [プログラム構成](#-プログラム構成) | ディレクトリ構造とモジュールの役割 |

### 🎮 ゲーム紹介

**Asteroids（Atari, 1979）** のモダンなWebリメイク版。一隻の宇宙船を操り、小惑星群を撃ち砕き、UFOの攻撃をかわしながらハイスコアを目指します。

**起動方法:** ブラウザで `index.html` を開くだけ。インストール・サーバー・ビルド一切不要。

| 特徴 | 詳細 |
|---|---|
| 🌐 多言語対応 | 繁体字中国語（デフォルト）/ 英語 / 日本語、設定画面で切替可能 |
| 🎨 5種類のテーマ | ネオン / レトロ / オーシャン / サンセット / モノ |
| 🔊 シンセサイズ音声 | BGM・効果音はすべて Web Audio API でリアルタイム生成（音声ファイル不使用） |
| 📱 モバイル対応 | レスポンシブ + タッチ操作（3種のレイアウト、透明度調整可） |
| 💾 セーブ機能 | ポーズ・終了時に自動保存、ハイスコアは `localStorage` に永続化 |
| ✨ 演出 | パーティクル爆発、画面シェイク、視差スターフィールド、FPS表示 |

### 🕹️ 遊び方

#### 操作方法

| アクション | キーボード | タッチ |
|---|---|---|
| 左 / 右回転 | `A` `←` / `D` `→` | `L` / `R` ボタン |
| 推進 | `W` / `↑` | `TH` ボタン |
| 射撃 | `Space` / `J` | `FIRE` ボタン |
| ワープ ⚠️ | `Shift` / `K` | `WP` ボタン |
| ポーズ / 再開 | `Esc` / `P` | HUD の `II` ボタン |
| ミュート | `M` | HUD の `M` ボタン |

> ⚠️ ワープはランダムな位置にテレポートしますが、**15% の確率で自爆**します（クールダウン 5 秒）。最終手段として使いましょう！

#### スコア

| ターゲット | 得点 | 備考 |
|---|---:|---|
| 大型小惑星 | 20 | 中型 2 個に分裂 |
| 中型小惑星 | 50 | 小型 2 個に分裂 |
| 小型小惑星 | 100 | 完全に消滅 |
| 大型UFO | 200 | ランダムに射撃 |
| 小型UFO | 1,000 | プレイヤーを狙い撃ち。危険！ |
| 🎁 残機ボーナス | — | 10,000 点ごとに 1 機追加 |

#### パワーアップ（小惑星破壊時に 12% でドロップ）

| アイテム | 効果 | 持続時間 |
|---|---|---:|
| 🛡️ シールド | 一回分のダメージを吸収 | 10 秒 |
| 🔱 トリプル | 3 発同時発射 | 10 秒 |
| 🚀 ブースト | 推進力アップ | 8 秒 |
| ⚡ ラピッド | 射撃クールダウン半減 | 8 秒 |

#### レベル仕様

| ルール | 計算式 |
|---|---|
| 小惑星の数 | `min(3 + レベル, 11)` |
| 小惑星の速度 | `×(1 + (レベル − 1) × 0.06)` |
| UFO出現間隔 | レベルごとに短縮（最短 8 秒） |

### 🧩 プログラム紹介

| 項目 | 採用技術 |
|---|---|
| 言語 | Vanilla JavaScript（ES5 スタイル、IIFE モジュール、`"use strict"`） |
| 描画 | 単一 `<canvas>` 2D コンテキスト、DPR 対応（最大 2 倍） |
| ゲームループ | `requestAnimationFrame` + デルタタイム更新 |
| 状態管理 | 有限状態機械：`MENU → PLAYING ⇄ PAUSED → GAME_OVER` |
| オーディオ | Web Audio API のオシレーター／ノイズで完全プロシージャル生成 |
| 永続化 | `localStorage`（`asteroids.settings` / `asteroids.highscore` / `asteroids.save`） |
| テーマ | CSS カスタムプロパティを `body[data-theme]` で切替 |
| 多言語 | `data-i18n` 属性スキャン + ランタイム辞書（`js/data/i18n.js`） |
| 依存関係 | **ゼロ** — npm・フレームワーク・ビルドツール不使用 |

各モジュールは共有の `window.Game` 名前空間（例：`Game.Ship`、`Game.Collision`）に登録され、`index.html` の `<script>` タグで依存順にロードされます。`js/main.js` の `Game.App` がすべてのエンティティ配列を保持し、毎フレーム update → 衝突判定 → draw を統括します。

### 🗂️ プログラム構成

```
Asteroids/
├── index.html              # 唯一のエントリーポイント — 全画面・CSS・JS 読み込み
├── css/
│   ├── base/               # リセット / CSS変数 / タイポグラフィ
│   ├── layout/             # 画面切替、レスポンシブブレークポイント
│   ├── components/         # ボタン、メニュー、HUD、モーダル、設定、タッチ操作
│   └── themes/             # 5種のテーマ（neon, retro, ocean, sunset, mono）
└── js/
    ├── core/               # エンジン：定数、ゲームループ、FSM、ユーティリティ
    ├── data/               # 多言語辞書、レベル曲線、localStorage
    ├── audio/              # Web Audio エンジン、効果音・BGM 生成
    ├── systems/            # 入力、物理、衝突、スコア、スポナー
    ├── entities/           # 宇宙船、小惑星、弾、UFO、パワーアップ、パーティクル
    └── ui/                 # HUD、メニュー、ヘルプ、設定、タッチ操作
```

| レイヤー | ファイル | 役割 |
|---|---|---|
| `js/core/` | `main.js`、`gameLoop.js`、`stateManager.js`、`constants.js`、`utils.js` | アプリ起動、rAF ループ、FSM、調整用定数、数学ヘルパー |
| `js/data/` | `i18n.js`、`levels.js`、`storage.js` | 翻訳辞書、難易度曲線、セーブ／ロード |
| `js/audio/` | `audioEngine.js`、`sfx.js`、`music.js` | AudioContext とゲイン制御、効果音、レベル連動 BGM |
| `js/systems/` | `input.js`、`physics.js`、`collision.js`、`score.js`、`spawner.js` | キー入力、移動と画面ラップ、円形衝突判定、スコア計算、生成処理 |
| `js/entities/` | `ship.js`、`asteroid.js`、`bullet.js`、`ufo.js`、`powerup.js`、`particle.js` | 各エンティティの `create / update / draw` ライフサイクル |
| `js/ui/` | `hud.js`、`menu.js`、`helpUI.js`、`settingsUI.js`、`touchControls.js` | ゲーム状態に連動する DOM ベースの UI |

---

## 🇹🇼 繁體中文

### 📖 目錄

| 章節 | 內容 |
|---|---|
| [遊戲介紹](#-遊戲介紹) | 這款遊戲是什麼、特色亮點 |
| [遊戲方式](#-遊戲方式) | 操作、計分、道具、關卡規則 |
| [程式介紹](#-程式介紹) | 技術棧與架構設計 |
| [程式分類方式](#-程式分類方式) | 目錄結構與各模組職責 |

### 🎮 遊戲介紹

經典街機遊戲 **Asteroids（Atari, 1979）** 的現代化網頁重製版。駕駛孤獨的太空船穿梭於越來越密集的小行星帶，將巨石轟成碎片、閃避 UFO 火力，挑戰最高分！

**啟動方式：** 用瀏覽器直接開啟 `index.html` 即可 — 免安裝、免伺服器、免建置。

| 特色 | 說明 |
|---|---|
| 🌐 多語言 | 繁體中文（預設）/ 英文 / 日文，可在設定中切換 |
| 🎨 5 種主題 | 霓虹 / 復古 / 海洋 / 夕陽 / 單色 |
| 🔊 合成音效 | 所有 BGM 與音效由 Web Audio API 即時生成，零音檔 |
| 📱 行動裝置支援 | 響應式版面 + 觸控按鍵（3 種佈局、可調透明度） |
| 💾 存檔續玩 | 暫停 / 離開時自動存檔，最高分保存於 `localStorage` |
| ✨ 遊戲手感 | 粒子爆炸、螢幕震動、視差星空、FPS 顯示 |

### 🕹️ 遊戲方式

#### 操作方式

| 動作 | 鍵盤 | 觸控 |
|---|---|---|
| 左轉 / 右轉 | `A` `←` / `D` `→` | `L` / `R` 按鍵 |
| 推進 | `W` / `↑` | `TH` 按鍵 |
| 射擊 | `Space` / `J` | `FIRE` 按鍵 |
| 超空間跳躍 ⚠️ | `Shift` / `K` | `WP` 按鍵 |
| 暫停 / 繼續 | `Esc` / `P` | HUD 的 `II` 按鈕 |
| 靜音 | `M` | HUD 的 `M` 按鈕 |

> ⚠️ 跳躍會將你傳送到隨機位置，但有 **15% 機率自爆**（冷卻 5 秒），請當作最後保命手段！

#### 計分規則

| 目標 | 分數 | 備註 |
|---|---:|---|
| 大型小行星 | 20 | 碎裂成 2 顆中型 |
| 中型小行星 | 50 | 碎裂成 2 顆小型 |
| 小型小行星 | 100 | 直接消滅 |
| 大型 UFO | 200 | 隨機方向射擊 |
| 小型 UFO | 1,000 | 會瞄準玩家，非常危險！ |
| 🎁 額外生命 | — | 每 10,000 分加一條命 |

#### 道具系統（摧毀小行星時有 12% 機率掉落）

| 道具 | 效果 | 持續時間 |
|---|---|---:|
| 🛡️ 護盾 Shield | 吸收一次碰撞傷害 | 10 秒 |
| 🔱 三向 Triple | 一次發射 3 顆子彈 | 10 秒 |
| 🚀 加速 Boost | 提升推進力 | 8 秒 |
| ⚡ 連射 Rapid | 射擊冷卻減半 | 8 秒 |

#### 關卡規則

| 規則 | 公式 |
|---|---|
| 小行星數量 | `min(3 + 關卡數, 11)` |
| 小行星速度 | `×(1 + (關卡數 − 1) × 0.06)` |
| UFO 出現間隔 | 每關縮短（最短 8 秒） |

### 🧩 程式介紹

| 項目 | 技術選擇 |
|---|---|
| 語言 | Vanilla JavaScript（ES5 風格、IIFE 模組、`"use strict"`） |
| 繪圖 | 單一 `<canvas>` 2D context，支援 DPR（上限 2 倍） |
| 遊戲迴圈 | `requestAnimationFrame` + delta time 更新 |
| 狀態管理 | 有限狀態機：`MENU → PLAYING ⇄ PAUSED → GAME_OVER` |
| 音訊 | Web Audio API 振盪器／噪音，完全程序化生成，無任何音檔 |
| 資料持久化 | `localStorage`（`asteroids.settings` / `asteroids.highscore` / `asteroids.save`） |
| 主題系統 | CSS 自訂屬性，透過 `body[data-theme]` 切換 |
| 多語言 | 掃描 `data-i18n` 屬性 + 執行期字典（`js/data/i18n.js`） |
| 相依套件 | **零依賴** — 不用 npm、不用框架、不用建置工具 |

每個模組都掛載到共用的 `window.Game` 命名空間（如 `Game.Ship`、`Game.Collision`），由 `index.html` 的 `<script>` 標籤依相依順序載入。核心物件 `Game.App`（位於 `js/main.js`）持有所有實體陣列，每幀統籌 update → 碰撞判定 → draw 的流程。

### 🗂️ 程式分類方式

```
Asteroids/
├── index.html              # 唯一進入點 — 所有畫面、CSS 與 JS 引入
├── css/
│   ├── base/               # Reset / CSS 變數 / 字體排版
│   ├── layout/             # 畫面切換、響應式斷點
│   ├── components/         # 按鈕、選單、HUD、彈窗、設定、觸控按鍵
│   └── themes/             # 5 種主題（neon, retro, ocean, sunset, mono）
└── js/
    ├── core/               # 引擎核心：常數、遊戲迴圈、狀態機、工具函式
    ├── data/               # 多語言字典、關卡曲線、localStorage
    ├── audio/              # Web Audio 引擎、程序化音效與音樂
    ├── systems/            # 輸入、物理、碰撞、計分、生成器
    ├── entities/           # 飛船、小行星、子彈、UFO、道具、粒子
    └── ui/                 # HUD、選單、說明、設定、觸控按鍵
```

| 分層 | 檔案 | 職責 |
|---|---|---|
| `js/core/` | `main.js`、`gameLoop.js`、`stateManager.js`、`constants.js`、`utils.js` | 應用程式啟動、rAF 迴圈、狀態機、調校常數、數學工具 |
| `js/data/` | `i18n.js`、`levels.js`、`storage.js` | 翻譯字典、難度曲線、存讀檔 |
| `js/audio/` | `audioEngine.js`、`sfx.js`、`music.js` | AudioContext 與音量路由、音效、隨關卡變化的 BGM |
| `js/systems/` | `input.js`、`physics.js`、`collision.js`、`score.js`、`spawner.js` | 鍵盤狀態、移動與邊界環繞、圓形碰撞、計分、實體生成 |
| `js/entities/` | `ship.js`、`asteroid.js`、`bullet.js`、`ufo.js`、`powerup.js`、`particle.js` | 各實體的 `create / update / draw` 生命週期 |
| `js/ui/` | `hud.js`、`menu.js`、`helpUI.js`、`settingsUI.js`、`touchControls.js` | 與遊戲狀態連動的 DOM 介面 |

---

<div align="center">

Made with 🛸 — pure HTML + CSS + JS

</div>
