# 🏒 Air Hockey Web Game

Pure front-end Air Hockey game built with HTML5, modular CSS, and vanilla JavaScript. It runs directly from `index.html` with no package install, no build step, and no server requirement.

> Languages: [English](#english) | [日本語](#japanese) | [繁體中文](#traditional-chinese)

---

<a id="quick-navigation"></a>

## ⚡ Quick Navigation

| Need | English | 日本語 | 繁體中文 |
|---|---:|---:|---:|
| 🎮 Game overview | [Overview](#en-overview) | [概要](#ja-overview) | [遊戲介紹](#zh-overview) |
| 🕹️ How to play | [Gameplay](#en-gameplay) | [遊び方](#ja-gameplay) | [遊戲玩法](#zh-gameplay) |
| 🤖 Difficulty | [Difficulty](#en-difficulty) | [難易度](#ja-difficulty) | [難度說明](#zh-difficulty) |
| ⚙️ Settings | [Settings](#en-settings) | [設定](#ja-settings) | [設定項目](#zh-settings) |
| 🧩 Program guide | [Program Guide](#en-program-guide) | [プログラム紹介](#ja-program-guide) | [程式介紹](#zh-program-guide) |
| 📁 File classification | [File Map](#en-file-map) | [ファイル分類](#ja-file-map) | [程式分類](#zh-file-map) |
| 🚀 Run locally | [Run](#en-run) | [実行方法](#ja-run) | [執行方式](#zh-run) |

---

## 📌 Project Snapshot

| Item | Value |
|---|---|
| 🎯 Game type | Player vs AI air hockey |
| 🌐 Runtime | Static browser app |
| 🧱 Stack | HTML5, CSS3, Canvas 2D, vanilla JavaScript, Web Audio API, localStorage |
| 🚀 Start command | None. Open `index.html` directly. |
| 🌍 Languages | Traditional Chinese, English, Japanese |
| 🎨 Themes | Neon, Classic, Sunset, Ice |
| 🤖 AI levels | Easy, Normal, Hard |
| 💾 Save data | Browser `localStorage` |
| 📦 Dependencies | No npm dependency, no CDN dependency |

---

<a id="english"></a>

# English

<a id="en-overview"></a>

## 🎮 Game Overview

Air Hockey is a fast, arcade-style sports game where the player controls the lower mallet and competes against an AI opponent on the upper side of the table. The goal is simple: strike the puck into the AI goal before the AI scores against you.

This project is designed as a zero-build static web game. The entry point is `index.html`, which loads modular CSS and JavaScript files with regular `<link>` and `<script defer>` tags. The game table, puck, mallets, trails, and effects are rendered with Canvas 2D, while UI screens are normal HTML sections.

### ✨ Main Features

| Feature | Description |
|---|---|
| 🏒 Player vs AI | One-player match against computer-controlled mallet. |
| 🤖 Three AI levels | Easy, Normal, and Hard use different reaction delay, prediction, speed, mistake rate, and puck speed caps. |
| ⚡ Puck acceleration | The puck keeps moving during rallies and gradually accelerates up to a difficulty-specific speed limit. |
| 🧭 Responsive layout | Landscape-first gameplay layout with global orientation prompt on mobile/tablet portrait. |
| 🎨 Theme switching | Neon, Classic, Sunset, and Ice themes are implemented through CSS variables. |
| 🔊 Generated audio | BGM and SFX are generated with Web Audio API, so no binary audio assets are required. |
| 💾 Continue game | Unfinished progress is saved to `localStorage` when paused or before page unload. |
| 🌍 i18n | All major UI screens support Traditional Chinese, English, and Japanese. |

<a id="en-run"></a>

## 🚀 Run Locally

No installation is required.

1. Open the project folder.
2. Double-click `index.html`, or open it from a modern browser.
3. Choose a language on first launch.
4. Select `Start Game`, choose difficulty, and play.

Recommended browsers:

| Browser | Notes |
|---|---|
| Chrome / Edge | Works as a direct static file app. |
| Firefox | Works as a direct static file app. |
| Safari | Works on desktop and iOS Safari, with normal browser audio gesture rules. |

> Browser audio usually starts after the first user interaction. This is expected Web Audio behavior.

<a id="en-gameplay"></a>

## 🕹️ Gameplay

### 🎯 Objective

Control the lower mallet and send the puck into the AI goal at the top of the table. The first side to reach the target score wins.

### 🧑‍💻 Controls

| Device | Control |
|---|---|
| 🖱️ Desktop mouse | Move the cursor over the table. The player mallet follows the pointer inside the player half. |
| ⌨️ Keyboard | Use arrow keys or `WASD` for assisted movement. |
| ☝️ Touch device | Drag on the table. The player mallet follows the touch point. |
| Ⅱ Pause | Pause the current match and save progress. |
| ♪ Music | Toggle mute from the in-game HUD. |

### 🧾 Match Rules

| Rule | Behavior |
|---|---|
| Score | A puck entering the opponent goal gives 1 point. |
| Target score | Configurable as 5, 7, or 10 points. Default is 7. |
| Serve | After each score, a 3-second countdown starts before the next serve. |
| Half restriction | Player mallet stays in the lower half; AI mallet stays in the upper half. |
| Continue | Paused or interrupted games can be resumed from the main menu. |
| Result | Completed matches clear saved progress and show a result modal. |

### 🔁 Game Flow

```text
Main Menu
  -> Start Game
  -> Difficulty Select
  -> Countdown
  -> Playing
  -> Score / Pause / Result
  -> Play Again or Back to Menu
```

<a id="en-difficulty"></a>

## 🤖 Difficulty

The game difficulty changes both AI behavior and puck speed profile.

| Difficulty | AI Behavior | Puck Speed Design |
|---|---|---|
| ☺ Easy | Slower reaction, shorter prediction, higher mistake rate. | Lower minimum speed and low max speed cap. |
| ◐ Normal | Balanced reaction, stronger prediction, fewer mistakes. | Medium minimum speed and medium max speed cap. |
| ◆ Hard | Very fast reaction, wall-bounce prediction, active pressure. | Higher minimum speed and highest max speed cap. |

Current tuning values live in [`js/utils/constants.js`](./js/utils/constants.js).

| Key | Easy | Normal | Hard |
|---|---:|---:|---:|
| Reaction delay | 0.28s | 0.14s | 0.035s |
| AI speed | 430 | 590 | 800 |
| Prediction time | 0.12s | 0.42s | 0.82s |
| Mistake rate | 0.16 | 0.06 | 0.01 |
| Max puck speed | 860 | 1220 | 1700 |

<a id="en-settings"></a>

## ⚙️ Settings

| Group | Options | Stored in |
|---|---|---|
| 🔊 Audio | BGM volume, SFX volume, mute | `airHockey.settings` |
| 🎨 Display | Theme and effects quality | `airHockey.settings` |
| 🌍 Language | Chinese, English, Japanese | `airHockey.settings` |
| 🏁 Target score | 5, 7, or 10 | `airHockey.settings` |
| 🧹 Other | Reset unfinished progress | `airHockey.gameProgress` |

Settings are applied immediately and saved automatically through `localStorage`.

<a id="en-program-guide"></a>

## 🧩 Program Guide

### Architecture

The app uses a shared global namespace:

```js
window.AirHockey
```

Each JavaScript file attaches its module to that namespace. This keeps the project compatible with direct `file://` usage and avoids module loading restrictions in some browsers.

### Runtime Flow

| Step | Module | Responsibility |
|---|---|---|
| 1 | `js/main.js` | Bootstraps settings, theme, i18n, audio, UI, and game modules. |
| 2 | `ScreenManager` | Switches between menu, difficulty, game, how-to, settings, and modals. |
| 3 | `MainMenu` | Handles Start, Continue, How To Play, Settings, and difficulty selection. |
| 4 | `Game` | Owns the game loop, state transitions, scoring flow, pause/resume, and rendering. |
| 5 | `Physics` | Updates puck movement, wall collision, goal detection, and mallet collision. |
| 6 | `AI` | Calculates the AI mallet target for the selected difficulty. |
| 7 | `AudioManager` | Generates BGM and sound effects through Web Audio API. |
| 8 | `SaveManager` | Reads/writes settings and progress through `localStorage`. |

### Game State Model

| State | Meaning |
|---|---|
| `idle` | Game object exists but no match is active. |
| `countdown` | The 3-second serve countdown is running. |
| `playing` | Main gameplay physics and AI updates are active. |
| `scored` | A goal was scored; short delay before next countdown or result. |
| `paused` | Match is paused and progress is saved. |
| `result` | Match is finished and progress is cleared. |

### Rendering

The table is drawn with Canvas 2D. Static table elements are cached in an internal canvas and redrawn only when theme colors change. Dynamic elements such as puck, mallets, particles, trail, and overlay text are rendered every frame.

### Audio

Audio is generated, not loaded from files. `AudioManager` creates oscillators for BGM patterns and SFX tones. Gameplay BGM uses a low base gain multiplied by `GAMEPLAY_BGM_MULTIPLIER` and clamped safely below browser output limits.

<a id="en-file-map"></a>

## 📁 File Map

| Path | Category | Purpose |
|---|---|---|
| `index.html` | Entry / UI shell | Defines screens, modals, HUD, settings, and script order. |
| `css/main.css` | Global CSS | Base variables, body styling, focus, canvas, toast. |
| `css/layout.css` | Layout | App shell, screen transitions, page shell, game table frame, orientation prompt. |
| `css/theme/*.css` | Themes | Neon, Classic, Sunset, and Ice color variables. |
| `css/components/*.css` | Components | Buttons, menu, HUD, modals, settings, touch behavior. |
| `css/responsive/*.css` | RWD | Mobile, tablet, and desktop layout adjustments. |
| `js/main.js` | Bootstrap | Creates and connects managers/controllers. |
| `js/core/*.js` | Game core | Game loop, table, puck, mallet, physics, scoring. |
| `js/ai/*.js` | AI | Difficulty-specific AI decision modules. |
| `js/input/*.js` | Input | Mouse, touch, and keyboard input adapters. |
| `js/audio/*.js` | Audio | Web Audio BGM/SFX generation and SFX map. |
| `js/ui/*.js` | UI controllers | Screen, menu, settings, HUD, and how-to wiring. |
| `js/i18n/*.js` | Localization | Language manager and language dictionaries. |
| `js/storage/*.js` | Persistence | Settings/progress sanitization and localStorage access. |
| `js/utils/*.js` | Utilities | Constants, helpers, and vector math. |
| `data/config.default.json` | Data | Default settings reference. |
| `tasks/*.md` | Project notes | Task tracking, verification records, and lessons. |

---

<a id="japanese"></a>

# 日本語

<a id="ja-overview"></a>

## 🎮 概要

この Air Hockey は、プレイヤーが下側のマレットを操作し、上側の AI と対戦するブラウザ向けスポーツゲームです。パックを相手ゴールへ入れて得点し、先に目標点へ到達した側が勝利します。

このプロジェクトは、ビルド不要の静的 Web ゲームとして作られています。入口は `index.html` で、CSS と JavaScript は通常の `<link>` と `<script defer>` で読み込まれます。ゲーム盤、パック、マレット、軌跡、粒子演出は Canvas 2D で描画され、メニューや設定画面は HTML の画面セクションとして構成されています。

### ✨ 主な機能

| 機能 | 内容 |
|---|---|
| 🏒 プレイヤー vs AI | 1人用の AI 対戦モード。 |
| 🤖 3段階の AI | Easy、Normal、Hard で反応速度、予測、移動速度、ミス率、パック速度上限が変化。 |
| ⚡ パック加速 | ラリー中にパックが止まらず、難易度別の上限まで徐々に加速。 |
| 🧭 レスポンシブ対応 | 横向き優先のゲーム画面。スマホ/タブレット縦向きでは向き変更の案内を表示。 |
| 🎨 テーマ切替 | Neon、Classic、Sunset、Ice の 4 テーマ。 |
| 🔊 生成音声 | Web Audio API で BGM と効果音を生成。音声ファイルは不要。 |
| 💾 続きから再開 | 一時停止またはページ終了時に未完了の進行状況を保存。 |
| 🌍 多言語対応 | 繁體中文、英語、日本語に対応。 |

<a id="ja-run"></a>

## 🚀 実行方法

インストールは不要です。

1. プロジェクトフォルダを開きます。
2. `index.html` をダブルクリックするか、ブラウザから開きます。
3. 初回起動時に言語を選択します。
4. `Start Game` を選び、難易度を選択して開始します。

推奨ブラウザ:

| ブラウザ | 備考 |
|---|---|
| Chrome / Edge | 静的ファイルとして直接実行できます。 |
| Firefox | 静的ファイルとして直接実行できます。 |
| Safari | デスクトップ/iOS で利用できます。音声は通常のブラウザ制限に従います。 |

> ブラウザの仕様により、音声は最初のユーザー操作後に開始されます。

<a id="ja-gameplay"></a>

## 🕹️ 遊び方

### 🎯 目的

下側のマレットを操作し、パックを上側の AI ゴールへ入れます。先に目標点へ到達した側が勝利です。

### 🧑‍💻 操作

| デバイス | 操作 |
|---|---|
| 🖱️ デスクトップのマウス | テーブル上でカーソルを動かすと、プレイヤーマレットが自陣内で追従します。 |
| ⌨️ キーボード | 矢印キーまたは `WASD` で補助操作できます。 |
| ☝️ タッチ端末 | テーブル上をドラッグして操作します。 |
| Ⅱ 一時停止 | 試合を一時停止し、進行状況を保存します。 |
| ♪ 音楽 | ゲーム中 HUD からミュートを切り替えます。 |

### 🧾 ルール

| ルール | 内容 |
|---|---|
| 得点 | パックが相手ゴールに入ると 1 点。 |
| 目標点 | 5、7、10 点から設定可能。初期値は 7 点。 |
| サーブ | 得点後は 3 秒カウントダウンして再開。 |
| 半面制限 | プレイヤーは下半分、AI は上半分から出られません。 |
| 続きから | 一時停止または中断した試合はメニューから再開できます。 |
| 結果 | 試合終了後は保存データを削除し、結果モーダルを表示します。 |

### 🔁 ゲームの流れ

```text
メインメニュー
  -> ゲーム開始
  -> 難易度選択
  -> カウントダウン
  -> プレイ中
  -> 得点 / 一時停止 / 結果
  -> もう一度プレイ または メニューへ戻る
```

<a id="ja-difficulty"></a>

## 🤖 難易度

難易度は AI の行動とパック速度の両方に影響します。

| 難易度 | AI の特徴 | パック速度 |
|---|---|---|
| ☺ Easy | 反応が遅く、予測が短く、ミス率が高い。 | 最低速度と最高速度が低め。 |
| ◐ Normal | 反応、予測、ミス率のバランスが良い。 | 中間の速度上限。 |
| ◆ Hard | 高速反応、壁反射予測、積極的な攻め。 | 最も高い速度上限。 |

調整値は [`js/utils/constants.js`](./js/utils/constants.js) にあります。

| 項目 | Easy | Normal | Hard |
|---|---:|---:|---:|
| 反応遅延 | 0.28s | 0.14s | 0.035s |
| AI 速度 | 430 | 590 | 800 |
| 予測時間 | 0.12s | 0.42s | 0.82s |
| ミス率 | 0.16 | 0.06 | 0.01 |
| パック最高速度 | 860 | 1220 | 1700 |

<a id="ja-settings"></a>

## ⚙️ 設定

| 区分 | 項目 | 保存先 |
|---|---|---|
| 🔊 音声 | BGM 音量、効果音音量、ミュート | `airHockey.settings` |
| 🎨 表示 | テーマ、エフェクト品質 | `airHockey.settings` |
| 🌍 言語 | 中文、English、日本語 | `airHockey.settings` |
| 🏁 勝利点 | 5、7、10 | `airHockey.settings` |
| 🧹 その他 | 未完了の進行状況をリセット | `airHockey.gameProgress` |

設定は変更後すぐに反映され、`localStorage` に自動保存されます。

<a id="ja-program-guide"></a>

## 🧩 プログラム紹介

### アーキテクチャ

アプリは共通のグローバル名前空間を使用します。

```js
window.AirHockey
```

各 JavaScript ファイルは、この名前空間に自分のモジュールを追加します。これにより、`file://` で直接開いた場合でも動作しやすく、ブラウザの ES Module 制限を避けられます。

### 実行フロー

| 順序 | モジュール | 役割 |
|---|---|---|
| 1 | `js/main.js` | 設定、テーマ、i18n、音声、UI、ゲームを初期化。 |
| 2 | `ScreenManager` | メニュー、難易度、ゲーム、説明、設定、モーダルを切替。 |
| 3 | `MainMenu` | 開始、続きから、説明、設定、難易度選択を処理。 |
| 4 | `Game` | ゲームループ、状態遷移、得点、一時停止、描画を管理。 |
| 5 | `Physics` | パック移動、壁反射、ゴール判定、マレット衝突を処理。 |
| 6 | `AI` | 選択した難易度に応じて AI マレットの目標位置を計算。 |
| 7 | `AudioManager` | Web Audio API で BGM と効果音を生成。 |
| 8 | `SaveManager` | `localStorage` で設定と進行状況を保存/読込。 |

### ゲーム状態

| 状態 | 意味 |
|---|---|
| `idle` | 試合が開始されていない状態。 |
| `countdown` | 3 秒のサーブカウントダウン中。 |
| `playing` | 物理演算と AI 更新が動作中。 |
| `scored` | 得点後の短い待機中。 |
| `paused` | 一時停止中。進行状況は保存済み。 |
| `result` | 試合終了。進行状況は削除済み。 |

### 描画

ゲーム盤は Canvas 2D で描画されます。テーブル背景などの静的要素は内部 canvas にキャッシュされ、テーマ色が変わった場合のみ再生成されます。パック、マレット、粒子、軌跡、オーバーレイ文字は毎フレーム描画されます。

### 音声

音声はファイル読込ではなく Web Audio API による生成です。`AudioManager` は oscillator を使って BGM パターンと効果音を鳴らします。ゲーム中 BGM は低い基準ゲインに倍率を掛け、ブラウザの安全な上限内に収めています。

<a id="ja-file-map"></a>

## 📁 ファイル分類

| パス | 分類 | 目的 |
|---|---|---|
| `index.html` | エントリ / UI 骨組み | 画面、モーダル、HUD、設定、script 読込順を定義。 |
| `css/main.css` | グローバル CSS | 基本変数、body、focus、canvas、toast。 |
| `css/layout.css` | レイアウト | アプリ外枠、画面遷移、ゲームテーブル、向き変更案内。 |
| `css/theme/*.css` | テーマ | Neon、Classic、Sunset、Ice の色変数。 |
| `css/components/*.css` | コンポーネント | ボタン、メニュー、HUD、モーダル、設定、タッチ挙動。 |
| `css/responsive/*.css` | RWD | モバイル、タブレット、デスクトップ調整。 |
| `js/main.js` | 起動処理 | 各 manager/controller を作成して接続。 |
| `js/core/*.js` | ゲーム中核 | ループ、テーブル、パック、マレット、物理、得点。 |
| `js/ai/*.js` | AI | 難易度別の判断ロジック。 |
| `js/input/*.js` | 入力 | マウス、タッチ、キーボード入力。 |
| `js/audio/*.js` | 音声 | Web Audio BGM/SFX と効果音マップ。 |
| `js/ui/*.js` | UI 制御 | 画面、メニュー、設定、HUD、説明画面。 |
| `js/i18n/*.js` | 多言語 | 言語 manager と辞書。 |
| `js/storage/*.js` | 永続化 | 設定/進行状況の検証と localStorage 操作。 |
| `js/utils/*.js` | ユーティリティ | 定数、共通関数、2D ベクトル。 |
| `data/config.default.json` | データ | 初期設定の参照。 |
| `tasks/*.md` | 作業記録 | タスク、検証、教訓の記録。 |

---

<a id="traditional-chinese"></a>

# 繁體中文

<a id="zh-overview"></a>

## 🎮 遊戲介紹

Air Hockey 是一款純前端網頁版空氣曲棍球遊戲。玩家控制下方球拍，與上方 AI 對戰，目標是把冰球打進 AI 球門，並在 AI 得分前率先達到勝利分數。

這個專案採用零建置靜態網頁架構。入口是 `index.html`，透過一般 `<link>` 與 `<script defer>` 載入模組化 CSS/JavaScript。球台、冰球、球拍、軌跡與粒子特效由 Canvas 2D 繪製，選單、設定、說明與彈窗則由 HTML 畫面區塊構成。

### ✨ 主要特色

| 功能 | 說明 |
|---|---|
| 🏒 玩家 VS AI | 單人對戰電腦球拍。 |
| 🤖 三種難度 | 簡單、普通、困難分別調整 AI 反應、預測、速度、失誤率與冰球速度上限。 |
| ⚡ 冰球加速 | 對戰中冰球不會停住，會逐漸加速到各難度的上限。 |
| 🧭 RWD | 橫向優先遊戲介面，手機/平板直向時顯示橫向提示。 |
| 🎨 四種主題 | Neon、Classic、Sunset、Ice，透過 CSS 變數切換配色。 |
| 🔊 生成音訊 | 使用 Web Audio API 生成 BGM 與音效，不需要外部音訊檔。 |
| 💾 繼續遊戲 | 暫停或關閉頁面前會保存未完成進度。 |
| 🌍 三語系 | 支援繁體中文、英文、日文。 |

<a id="zh-run"></a>

## 🚀 執行方式

不需要安裝任何套件。

1. 打開專案資料夾。
2. 直接雙擊 `index.html`，或用瀏覽器開啟該檔案。
3. 第一次啟動時選擇語言。
4. 點選「開始遊戲」，選擇難度後開始對戰。

建議瀏覽器：

| 瀏覽器 | 備註 |
|---|---|
| Chrome / Edge | 可直接以靜態檔案方式執行。 |
| Firefox | 可直接以靜態檔案方式執行。 |
| Safari | 桌機與 iOS Safari 可使用，音訊遵循瀏覽器互動限制。 |

> Web Audio 通常需要使用者第一次點擊/觸控後才會開始播放，這是瀏覽器規範。

<a id="zh-gameplay"></a>

## 🕹️ 遊戲玩法

### 🎯 遊戲目標

控制下方球拍，把冰球打進上方 AI 的球門。先達到目標分數的一方獲勝。

### 🧑‍💻 操作方式

| 裝置 | 操作 |
|---|---|
| 🖱️ 桌機滑鼠 | 在球台上移動滑鼠，玩家球拍會在己方半場內跟隨指標。 |
| ⌨️ 鍵盤 | 使用方向鍵或 `WASD` 輔助移動。 |
| ☝️ 觸控裝置 | 在球台上拖曳手指控制球拍。 |
| Ⅱ 暫停遊戲 | 暫停目前對戰並保存進度。 |
| ♪ 音樂設定 | 從遊戲 HUD 快速切換靜音。 |

### 🧾 遊戲規則

| 規則 | 行為 |
|---|---|
| 得分 | 冰球進入對方球門時得 1 分。 |
| 勝利分數 | 可設定 5、7、10 分，預設 7 分。 |
| 重新開球 | 每次得分後倒數 3 秒，再重新發球。 |
| 半場限制 | 玩家球拍限制在下半場，AI 球拍限制在上半場。 |
| 繼續遊戲 | 暫停或中斷的對戰可從主畫面繼續。 |
| 結算 | 對戰完成後清除進度並顯示勝負結果。 |

### 🔁 遊戲流程

```text
主畫面
  -> 開始遊戲
  -> 選擇難度
  -> 3 秒倒數
  -> 遊戲進行中
  -> 得分 / 暫停 / 結算
  -> 再玩一次 或 回主畫面
```

<a id="zh-difficulty"></a>

## 🤖 難度說明

難度會同時影響 AI 行為與冰球速度曲線。

| 難度 | AI 行為 | 冰球速度設計 |
|---|---|---|
| ☺ 簡單 | 反應較慢、預測較短、失誤率較高。 | 最低速度較低，速度上限較低。 |
| ◐ 普通 | 反應與預測較均衡，失誤率較低。 | 中等最低速度與中等速度上限。 |
| ◆ 困難 | 快速反應、預判牆面反彈、主動壓迫。 | 最低速度較高，速度上限最高。 |

目前數值集中在 [`js/utils/constants.js`](./js/utils/constants.js)。

| 參數 | 簡單 | 普通 | 困難 |
|---|---:|---:|---:|
| 反應延遲 | 0.28s | 0.14s | 0.035s |
| AI 速度 | 430 | 590 | 800 |
| 預測時間 | 0.12s | 0.42s | 0.82s |
| 失誤率 | 0.16 | 0.06 | 0.01 |
| 冰球最高速度 | 860 | 1220 | 1700 |

<a id="zh-settings"></a>

## ⚙️ 設定項目

| 分類 | 項目 | 儲存位置 |
|---|---|---|
| 🔊 音訊設定 | BGM 音量、音效音量、靜音 | `airHockey.settings` |
| 🎨 顯示設定 | 主題、特效品質 | `airHockey.settings` |
| 🌍 語言設定 | 中文、English、日本語 | `airHockey.settings` |
| 🏁 勝利分數 | 5、7、10 分 | `airHockey.settings` |
| 🧹 其他 | 清除未完成對戰進度 | `airHockey.gameProgress` |

設定變更會立即生效，並自動寫入 `localStorage`。

<a id="zh-program-guide"></a>

## 🧩 程式介紹

### 架構概念

此專案使用共用全域命名空間：

```js
window.AirHockey
```

每個 JavaScript 檔案會把自己的模組掛到這個 namespace。這樣可以保持直接用 `file://` 開啟時的相容性，也避免部分瀏覽器對 ES Module 本機檔案載入的限制。

### 啟動流程

| 順序 | 模組 | 職責 |
|---|---|---|
| 1 | `js/main.js` | 初始化設定、主題、i18n、音訊、UI 與遊戲模組。 |
| 2 | `ScreenManager` | 切換主畫面、難度、遊戲、說明、設定與彈窗。 |
| 3 | `MainMenu` | 處理開始、繼續、說明、設定與難度選擇。 |
| 4 | `Game` | 管理遊戲主迴圈、狀態、得分流程、暫停/恢復與 Canvas 繪製。 |
| 5 | `Physics` | 處理冰球移動、撞牆、進球判定與球拍碰撞。 |
| 6 | `AI` | 依照難度計算 AI 球拍下一步目標位置。 |
| 7 | `AudioManager` | 用 Web Audio API 生成 BGM 與音效。 |
| 8 | `SaveManager` | 用 `localStorage` 讀寫設定與未完成進度。 |

### 遊戲狀態

| 狀態 | 說明 |
|---|---|
| `idle` | 遊戲物件存在，但尚未開始對戰。 |
| `countdown` | 3 秒開球倒數。 |
| `playing` | 主要物理、玩家輸入、AI 更新都在執行。 |
| `scored` | 得分後的短暫等待。 |
| `paused` | 暫停中，進度已保存。 |
| `result` | 比賽結束，進度已清除。 |

### 畫面繪製

球台使用 Canvas 2D 繪製。靜態球台背景會快取在內部 canvas，只有主題色變更時才重新產生。冰球、球拍、拖尾、粒子與提示文字則每幀重繪，確保移動與碰撞反饋即時。

### 音訊系統

音訊不是載入音檔，而是由 Web Audio API 生成。`AudioManager` 使用 oscillator 產生 BGM 音階與音效。遊戲中 BGM 使用較低基準音量乘上倍率，再限制在瀏覽器安全輸出範圍內，避免破音。

### 儲存資料

| Key | 用途 |
|---|---|
| `airHockey.settings` | 語言、主題、BGM 音量、音效音量、靜音、特效品質、勝利分數。 |
| `airHockey.gameProgress` | 未完成對戰的難度、玩家分數、AI 分數、勝利分數與時間戳。 |
| `airHockey.languageChosen` | 是否已完成首次語言選擇。 |

<a id="zh-file-map"></a>

## 📁 程式分類

| 路徑 | 分類 | 用途 |
|---|---|---|
| `index.html` | 入口 / UI 骨架 | 定義畫面、彈窗、HUD、設定介面與 script 載入順序。 |
| `css/main.css` | 全域 CSS | 基礎變數、body、focus、canvas、toast。 |
| `css/layout.css` | 版面 | App 外框、畫面切換、遊戲球台、橫向提示。 |
| `css/theme/*.css` | 主題 | Neon、Classic、Sunset、Ice 的 CSS 色彩變數。 |
| `css/components/*.css` | 元件 | 按鈕、主選單、HUD、彈窗、設定、觸控行為。 |
| `css/responsive/*.css` | RWD | 手機、平板、桌機斷點調整。 |
| `js/main.js` | 啟動入口 | 建立並串接各 manager/controller。 |
| `js/core/*.js` | 遊戲核心 | 主迴圈、球台、冰球、球拍、物理、計分。 |
| `js/ai/*.js` | AI | 各難度 AI 決策邏輯。 |
| `js/input/*.js` | 輸入 | 滑鼠、觸控、鍵盤輸入轉換。 |
| `js/audio/*.js` | 音訊 | Web Audio BGM/SFX 與音效對應表。 |
| `js/ui/*.js` | UI 控制 | 畫面、主選單、設定、HUD、說明頁行為。 |
| `js/i18n/*.js` | 多語系 | 語言管理與三語字典。 |
| `js/storage/*.js` | 儲存 | 設定/進度資料驗證與 localStorage 存取。 |
| `js/utils/*.js` | 工具 | 常數、共用工具、2D 向量。 |
| `data/config.default.json` | 資料 | 預設設定參考。 |
| `tasks/*.md` | 專案紀錄 | 任務、驗證與修正教訓。 |

---

## ✅ Maintainer Notes

| Topic | Note |
|---|---|
| No build step | Keep the project runnable by opening `index.html` directly. |
| Script order | `index.html` controls dependency order through `script defer` tags. |
| i18n coverage | When adding visible UI text, update `lang-zh.js`, `lang-en.js`, and `lang-ja.js`. |
| Theme colors | Prefer CSS variables in theme files instead of hard-coded colors. |
| Save data | Sanitize any new persisted setting in `save-manager.js`. |
| Verification | At minimum, run `node --check` on JS files and confirm static references exist. |
