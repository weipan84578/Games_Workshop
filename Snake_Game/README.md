# 🐍 Snake Game

<div align="center">

**[English](#english) | [日本語](#japanese) | [繁體中文](#chinese)**

A classic Snake game built with pure HTML5 + CSS3 + JavaScript — no frameworks required.
Supports keyboard & touch controls, three visual themes, and three game modes.

![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![CSS3](https://img.shields.io/badge/CSS3-Themes-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![No Framework](https://img.shields.io/badge/No%20Framework-vanilla-green)

</div>

---

<a name="english"></a>
# English

## Table of Contents
- [Overview](#en-overview)
- [Game Modes](#en-modes)
- [Controls](#en-controls)
- [Food & Scoring](#en-food)
- [Themes & Settings](#en-themes)
- [File Structure](#en-files)
- [Module Reference](#en-modules)
- [Browser Compatibility](#en-compat)

---

<a name="en-overview"></a>
## Overview

A modern take on the classic Snake arcade game, playable in any modern browser without installation.
The snake starts at length 3 in the center of a 20×20 grid and grows each time it eats food.
Speed increases every 5 foods eaten (floor: 60 ms/tick). Scores are saved locally via `localStorage`.

**Key Features**

| Feature | Details |
|---|---|
| Platform | Desktop & Mobile browsers |
| Renderer | HTML5 Canvas (400×400 px, 20×20 grid) |
| Controls | Keyboard arrows / WASD, swipe gestures |
| Themes | Dark (default), Light, Neon |
| Modes | Classic, Time Attack, Obstacle |
| Persistence | localStorage — scores & settings survive refresh |
| Audio | Web Audio API — procedurally generated tones |

---

<a name="en-modes"></a>
## Game Modes

| Mode | Description | Special Rule |
|---|---|---|
| **Classic** | Survive as long as possible; eat to grow | Difficulty affects initial speed & border behaviour |
| **Time Attack** | Maximise score within 60 seconds | Every 5 foods eaten adds +5 s (cap 90 s) |
| **Obstacle** | Random wall tiles are placed on the map | Every 5 foods eaten spawns 1 more obstacle |

### Difficulty Settings

| Difficulty | Tick Interval | Border |
|---|---|---|
| Easy | 180 ms | Configurable |
| Normal | 150 ms | Configurable |
| Hard | 120 ms | Configurable |

---

<a name="en-controls"></a>
## Controls

### Keyboard

| Key | Action |
|---|---|
| `↑` / `W` | Move Up |
| `↓` / `S` | Move Down |
| `←` / `A` | Move Left |
| `→` / `D` | Move Right |
| `Space` | Pause / Resume |
| `R` | Restart |
| `Esc` | Back to Main Menu |

### Touch (Mobile)

| Gesture | Action |
|---|---|
| Swipe Up | Move Up |
| Swipe Down | Move Down |
| Swipe Left | Move Left |
| Swipe Right | Move Right |

> Reverse 180° input is blocked. A direction queue (max 2) prevents dropped inputs during fast play.

---

<a name="en-food"></a>
## Food & Scoring

| Food | Colour | Spawn Rate | Points | Effect |
|---|---|---|---|---|
| Normal | Red `#e94560` | 70% | +10 | Grow +1 |
| Speed | Yellow `#ffff00` | 15% | +20 | Grow +1 |
| Golden | Gold `#ffd700` | 10% | +50 | Grow +1, expires in 10 s |
| Shrink | Blue `#0000ff` | 5% | +30 | Shrink −2 (min 3) |

### Combo Multiplier

Eating food resets a 3-second combo timer.
Each consecutive eat within that window increases the multiplier by **+0.5× (cap 3×)**.
Points are rounded before adding to the score.

---

<a name="en-themes"></a>
## Themes & Settings

### Visual Themes

| Theme | Background | Snake Head | Food |
|---|---|---|---|
| Dark | `#1a1a2e` | `#00d4aa` | `#e94560` |
| Light | White-based | Green | Red |
| Neon | `#0d0d0d` | `#39ff14` | `#ff00ff` |

### Settings Panel

| Setting | Options |
|---|---|
| Sound Effects | On / Off |
| Grid Lines | On / Off |
| Border Mode | Wall (die on hit) / Wrap (pass through) |
| Theme | Dark / Light / Neon |

---

<a name="en-files"></a>
## File Structure

```
Snake_Game/
├── index.html              # Entry point, all UI screens
├── css/
│   ├── reset.css           # Browser default style reset
│   ├── main.css            # Layout, screens, animations
│   └── themes/
│       ├── dark.css        # Dark theme variables
│       ├── light.css       # Light theme variables
│       └── neon.css        # Neon glow theme variables
└── js/
    ├── main.js             # App entry — wires Game + UI + Audio
    ├── game.js             # Core game loop & state machine
    ├── snake.js            # Snake class — movement, collision, growth
    ├── food.js             # Food class — spawn, typing, expiry
    ├── renderer.js         # Canvas drawing — snake, food, grid, obstacles
    ├── input.js            # Keyboard & touch input handler
    ├── audio.js            # Web Audio API procedural sound system
    ├── ui.js               # DOM/screen management & event wiring
    ├── storage.js          # localStorage read/write helpers
    └── utils.js            # Shared utility functions
```

---

<a name="en-modules"></a>
## Module Reference

### `main.js` — Entry Point
Bootstraps on `window.onload`: creates a `Game` instance, calls `UI.init(game)`, and starts `AudioSystem.init()`.

---

### `game.js` — `class Game`

Central state machine and game loop.

| Method | Description |
|---|---|
| `constructor()` | Creates canvas, instantiates all sub-systems, starts `requestAnimationFrame` loop |
| `start(mode, difficulty)` | Resets state and begins a new session |
| `reset()` | Re-initialises snake, food, score, speed, obstacles |
| `loop(now)` | RAF callback — calls `update()` then `render()` every frame |
| `update(now)` | Advances logic when `elapsed >= tickInterval`; handles Time Attack countdown |
| `tick()` | One game step: move snake → check collisions → handle food eat |
| `handleEat(food)` | Applies food effect, updates combo, triggers speed-up every 5 eats |
| `togglePause()` | Toggles `PLAYING ↔ PAUSED` state |
| `gameOver()` | Saves score, shows Game Over screen |
| `render()` | Delegates to `Renderer` to redraw the canvas |

**State Machine**

```
MENU → PLAYING → PAUSED → PLAYING
                        ↓
                     GAMEOVER → MENU
```

---

### `snake.js` — `class Snake`

Manages the snake body array and movement logic.

| Method | Description |
|---|---|
| `reset(x, y)` | Rebuilds body at (x, y), length 3, direction right |
| `setDirection(dir)` | Queues new direction (blocks 180° reverse, max queue 2) |
| `move()` | Dequeues direction, shifts body array forward |
| `grow(n)` | Increments grow counter; next `n` moves keep the tail |
| `shrink(n)` | Pops tail segments down to minimum length 3 |
| `checkSelfCollision()` | Compares head to all body segments (index 1+) |
| `checkWallCollision(gridSize)` | Returns `true` if head is out of bounds |
| `handleWrapAround(gridSize)` | Wraps head coordinates to opposite edge |
| `getHead()` | Returns `body[0]` |
| `getBody()` | Returns full body array |

---

### `food.js` — `class Food`

Handles food items on the board.

| Method | Description |
|---|---|
| `spawn(excludeList)` | Picks a random type by weighted probability, places on a free cell |
| `remove(id)` | Removes a food item by its unique ID |
| `update()` | Expires golden food after 10 000 ms |
| `reset()` | Clears all items |

Food types are defined as a config object with `type`, `color`, `probability`, `score`, and `effect` fields.

---

### `renderer.js` — `class Renderer`

Pure drawing layer — no game logic.

| Method | Description |
|---|---|
| `clear()` | `clearRect` the entire canvas |
| `drawGrid(show)` | Draws faint grid lines (theme-aware colour) |
| `drawSnake(snake)` | Head in teal with directional eyes; body fades to dark with rounded corners |
| `drawFood(foods)` | Circles in food colour; golden food pulses with `Math.sin` alpha |
| `drawObstacles(obstacles)` | Dark rounded rects; red glow in Neon theme |
| `drawEyes(x, y, dir)` | Two white circles + black pupils, positioned per movement direction |
| `drawRoundedRect(x,y,w,h,r)` | Helper — draws a rounded rectangle path |

---

### `input.js` — `class InputHandler`

Registers keyboard (`keydown`) and touch (`touchstart`/`touchend`) listeners at construction time.
Touch requires a minimum swipe distance of **30 px** before registering a direction change.

---

### `audio.js` — `AudioSystem` (singleton object)

Procedural audio via Web Audio API. Audio context is created lazily on the first user interaction (browser policy).

| Sound Event | Trigger |
|---|---|
| `eat` | Normal food eaten |
| `eat_golden` | Golden food eaten |
| `eat_bonus` | Combo multiplier active |
| `shrink` | Shrink food eaten |
| `speed` | Speed food eaten |
| `move` | Every tick (very quiet) |
| `death` | Snake collides |
| `level_up` | Speed threshold crossed |
| `click` | Any button pressed |
| `pause` / `resume` | Pause toggled |

---

### `storage.js` — `Storage` (singleton object)

Thin wrapper around `localStorage`.

| Method | Description |
|---|---|
| `getSettings()` | Returns saved settings or defaults |
| `saveSettings(s)` | Persists settings object |
| `getBestScore(mode)` | Returns top score for a given mode |
| `saveBestScore(mode, score)` | Updates best if new score is higher; returns `true` on new record |
| `getLeaderboard(mode)` | Returns top-10 array for mode |
| `saveScore(mode, entry)` | Pushes entry, sorts, trims to 10 |

**Storage Schema**

```json
{
  "snake_settings": { "sound": true, "grid": true, "borderMode": "wall", "theme": "dark" },
  "snake_best":     { "classic": 3200, "timeattack": 1850, "obstacle": 2100 },
  "snake_scores":   { "classic": [{ "score": 3200, "date": "2026-06-04" }] }
}
```

---

### `ui.js` — `UI` (singleton object)

Screen routing and DOM event wiring.

| Method | Description |
|---|---|
| `init(game)` | Attaches all button listeners, initialises theme and settings display |
| `showScreen(id)` | Hides all screens, activates the target screen |
| `showPauseOverlay(bool)` | Shows/hides the semi-transparent pause overlay |
| `applyTheme(theme)` | Swaps CSS theme link tag and updates `body` class |
| `showLeaderboard(mode)` | Navigates to leaderboard and renders the correct tab |
| `updateLeaderboardTable(mode)` | Rebuilds leaderboard `<tbody>` from storage |
| `updateScore(score, best)` | Updates HUD score and best-score displays |
| `updateTimer(timeLeft, max)` | Updates timer text and progress bar width |
| `showGameOver(score, level, isNew)` | Shows Game Over screen with stats & new-record banner |

---

### `utils.js` — `Utils` (singleton object)

| Method | Description |
|---|---|
| `randomInt(min, max)` | Returns a random integer in [min, max] |
| `getRandomGridPos(gridSize, excludeList)` | Returns a free grid cell not in `excludeList` |
| `formatTime(seconds)` | Converts seconds to `mm:ss` string |
| `isSamePos(p1, p2)` | Returns `true` if two `{x, y}` objects are equal |

---

<a name="en-compat"></a>
## Browser Compatibility

| Browser | Min Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---
---

<a name="japanese"></a>
# 日本語

## 目次
- [ゲーム概要](#ja-overview)
- [ゲームモード](#ja-modes)
- [操作方法](#ja-controls)
- [フード＆スコア](#ja-food)
- [テーマ＆設定](#ja-themes)
- [ファイル構成](#ja-files)
- [モジュール解説](#ja-modules)
- [ブラウザ対応](#ja-compat)

---

<a name="ja-overview"></a>
## ゲーム概要

HTML5 + CSS3 + JavaScript のみで構築した、フレームワーク不要のクラシックスネークゲームです。
20×20 グリッド（400×400 px）でのプレイをサポートし、キーボードとタッチ操作の両方に対応しています。
スコアや設定は `localStorage` に自動保存されます。

**主な機能**

| 機能 | 詳細 |
|---|---|
| プラットフォーム | PC・モバイルブラウザ |
| 描画エンジン | HTML5 Canvas |
| 操作 | キーボード / スワイプ |
| テーマ | ダーク・ライト・ネオン |
| モード | クラシック・タイムアタック・障害物 |
| データ保存 | localStorage（スコア・設定） |
| 音響 | Web Audio API（手続き的生成音） |

---

<a name="ja-modes"></a>
## ゲームモード

| モード | 説明 | 特殊ルール |
|---|---|---|
| **クラシック** | 衝突するまで生き続けてスコアを稼ぐ | 難易度で初期速度と境界設定が変化 |
| **タイムアタック** | 60秒以内に最高スコアを狙う | 5個食べるごとに残り時間 +5秒（上限90秒） |
| **障害物** | マップ上にランダムな壁が配置される | 5個食べるごとに障害物が1つ追加 |

### 難易度設定

| 難易度 | 初期速度 | 境界 |
|---|---|---|
| かんたん | 180 ms/tick | 設定可能 |
| ふつう | 150 ms/tick | 設定可能 |
| むずかしい | 120 ms/tick | 設定可能 |

---

<a name="ja-controls"></a>
## 操作方法

### キーボード

| キー | 動作 |
|---|---|
| `↑` / `W` | 上移動 |
| `↓` / `S` | 下移動 |
| `←` / `A` | 左移動 |
| `→` / `D` | 右移動 |
| `Space` | 一時停止 / 再開 |
| `R` | リスタート |
| `Esc` | メインメニューへ戻る |

### タッチ（スマートフォン）

| ジェスチャー | 動作 |
|---|---|
| 上スワイプ | 上移動 |
| 下スワイプ | 下移動 |
| 左スワイプ | 左移動 |
| 右スワイプ | 右移動 |

> 180°逆方向への即時転換は無効化されています。方向キューは最大2入力まで保持されます。

---

<a name="ja-food"></a>
## フード＆スコア

| フード | 色 | 出現確率 | 得点 | 効果 |
|---|---|---|---|---|
| 通常 | 赤 `#e94560` | 70% | +10 | 長さ +1 |
| 加速 | 黄 `#ffff00` | 15% | +20 | 長さ +1 |
| ゴールデン | 金 `#ffd700` | 10% | +50 | 長さ +1、10秒で消滅 |
| 収縮 | 青 `#0000ff` | 5% | +30 | 長さ −2（最低3） |

### コンボ倍率

3秒以内に連続して食べると倍率が **+0.5倍ずつ増加（最大3倍）** されます。
倍率はタイマーが切れると1.0に戻ります。

### 速度上昇

5個食べるごとにティック間隔が **10 ms 短縮** されます（最速60 ms）。

---

<a name="ja-themes"></a>
## テーマ＆設定

### ビジュアルテーマ

| テーマ | 背景色 | スネーク頭 | フード |
|---|---|---|---|
| ダーク | `#1a1a2e` | `#00d4aa` | `#e94560` |
| ライト | ホワイト系 | グリーン | レッド |
| ネオン | `#0d0d0d` | `#39ff14` | `#ff00ff` |

### 設定項目

| 設定 | 選択肢 |
|---|---|
| 効果音 | オン / オフ |
| グリッド表示 | オン / オフ |
| 境界モード | 壁（衝突死亡） / ループ（通り抜け） |
| テーマ | ダーク / ライト / ネオン |

---

<a name="ja-files"></a>
## ファイル構成

```
Snake_Game/
├── index.html              # エントリーポイント・全UIスクリーン
├── css/
│   ├── reset.css           # ブラウザデフォルトスタイルのリセット
│   ├── main.css            # レイアウト・スクリーン遷移・アニメーション
│   └── themes/
│       ├── dark.css        # ダークテーマ変数
│       ├── light.css       # ライトテーマ変数
│       └── neon.css        # ネオン発光テーマ変数
└── js/
    ├── main.js             # アプリ起動 — Game / UI / Audio を接続
    ├── game.js             # コアゲームループ＆ステートマシン
    ├── snake.js            # Snakeクラス — 移動・衝突・成長
    ├── food.js             # Foodクラス — スポーン・タイプ・期限切れ
    ├── renderer.js         # Canvas描画 — スネーク・フード・グリッド・障害物
    ├── input.js            # キーボード＆タッチ入力ハンドラ
    ├── audio.js            # Web Audio API 手続き的サウンドシステム
    ├── ui.js               # DOM/スクリーン管理＆イベント配線
    ├── storage.js          # localStorage 読み書きヘルパー
    └── utils.js            # 共通ユーティリティ関数
```

---

<a name="ja-modules"></a>
## モジュール解説

### `game.js` — `class Game`

| メソッド | 内容 |
|---|---|
| `constructor()` | Canvas生成・サブシステム初期化・RAFループ開始 |
| `start(mode, difficulty)` | 状態リセット後に新セッション開始 |
| `reset()` | スネーク・フード・スコア・速度・障害物を初期化 |
| `loop(now)` | RAFコールバック — `update()` → `render()` |
| `update(now)` | 経過時間チェック後 `tick()` 実行、タイムアタックカウントダウン処理 |
| `tick()` | 1ゲームステップ：移動→衝突判定→食物処理 |
| `handleEat(food)` | 食物効果適用・コンボ更新・5個ごとの加速処理 |
| `togglePause()` | `PLAYING ↔ PAUSED` 切り替え |
| `gameOver()` | スコア保存・ゲームオーバー画面表示 |

---

### `snake.js` — `class Snake`

| メソッド | 内容 |
|---|---|
| `reset(x, y)` | 初期位置に長さ3・右向きで再構築 |
| `setDirection(dir)` | 方向キューに追加（180°反転ブロック・最大2件） |
| `move()` | キューから方向を取り出してbody配列を前進 |
| `grow(n)` | growカウンタを加算（n移動後に尾が残る） |
| `shrink(n)` | 尾のセグメントを除去（最低3格を保持） |
| `checkSelfCollision()` | 頭を body[1]以降と比較 |
| `checkWallCollision(gridSize)` | 頭が範囲外なら `true` を返す |
| `handleWrapAround(gridSize)` | 頭座標を反対辺にラップ |

---

### `food.js` — `class Food`

| メソッド | 内容 |
|---|---|
| `spawn(excludeList)` | 重み付き確率でタイプを選択し空きセルに配置 |
| `remove(id)` | 一意IDで食物を削除 |
| `update()` | ゴールデンフードを10秒後に期限切れにする |
| `reset()` | 全アイテムをクリア |

---

### `renderer.js` — `class Renderer`

| メソッド | 内容 |
|---|---|
| `clear()` | Canvasをクリア |
| `drawGrid(show)` | 薄いグリッド線を描画（テーマ対応色） |
| `drawSnake(snake)` | 頭：ティール色＋方向対応の目；体：丸角＋フェードアウト |
| `drawFood(foods)` | フード色の円；ゴールデンは `Math.sin` アルファでパルス |
| `drawObstacles(obstacles)` | 暗い丸角矩形；ネオンテーマでは赤い発光 |

---

### `audio.js` — `AudioSystem`

| サウンド | 発生タイミング |
|---|---|
| `eat` | 通常フードを食べた |
| `eat_golden` | ゴールデンフードを食べた |
| `eat_bonus` | コンボ倍率が有効 |
| `shrink` | 収縮フードを食べた |
| `death` | スネークが衝突した |
| `level_up` | 速度閾値を超えた |
| `click` | ボタン押下 |

---

### `storage.js` — `Storage`

| メソッド | 内容 |
|---|---|
| `getSettings()` | 設定を読み込む（なければデフォルト値） |
| `saveSettings(s)` | 設定を保存 |
| `getBestScore(mode)` | モード別最高スコアを返す |
| `saveBestScore(mode, score)` | 更新時 `true` を返す |
| `getLeaderboard(mode)` | トップ10配列を返す |
| `saveScore(mode, entry)` | エントリー追加・ソート・10件に切り詰め |

---

### `utils.js` — `Utils`

| メソッド | 内容 |
|---|---|
| `randomInt(min, max)` | [min, max] の乱数整数 |
| `getRandomGridPos(gridSize, excludeList)` | 空きグリッドセルを返す |
| `formatTime(seconds)` | 秒を `mm:ss` 文字列に変換 |
| `isSamePos(p1, p2)` | 2つの `{x, y}` が同一か判定 |

---

<a name="ja-compat"></a>
## ブラウザ対応

| ブラウザ | 最低バージョン |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---
---

<a name="chinese"></a>
# 繁體中文

## 目錄
- [遊戲概述](#zh-overview)
- [遊戲模式](#zh-modes)
- [操作方式](#zh-controls)
- [食物與計分](#zh-food)
- [主題與設定](#zh-themes)
- [檔案結構](#zh-files)
- [模組說明](#zh-modules)
- [瀏覽器相容性](#zh-compat)

---

<a name="zh-overview"></a>
## 遊戲概述

以純 HTML5 + CSS3 + JavaScript 構建、不依賴任何第三方框架的經典貪食蛇遊戲。
在任何現代瀏覽器中無需安裝即可遊玩，支援鍵盤與觸控操作，提供三種視覺主題與三種遊戲模式。
分數與設定透過 `localStorage` 自動儲存於本地端。

**主要特色**

| 功能 | 說明 |
|---|---|
| 適用平台 | 桌面瀏覽器 / 行動裝置瀏覽器 |
| 渲染引擎 | HTML5 Canvas（400×400 px，20×20 格） |
| 操作方式 | 方向鍵 / WASD，觸控滑動手勢 |
| 視覺主題 | 深色（預設）、淺色、霓虹 |
| 遊戲模式 | 經典、限時、障礙物 |
| 資料儲存 | localStorage（分數與設定持久保存） |
| 音效系統 | Web Audio API（程式碼生成音調） |

---

<a name="zh-modes"></a>
## 遊戲模式

| 模式 | 說明 | 特殊規則 |
|---|---|---|
| **經典模式** | 存活越久越好，吃食物使蛇增長 | 難度影響初始速度與邊界行為 |
| **限時模式** | 60 秒內累積最高分數 | 每吃 5 顆食物延長 5 秒（上限 90 秒） |
| **障礙物模式** | 地圖上隨機分佈固定障礙物 | 每吃 5 顆食物新增 1 個障礙物 |

### 難度設定

| 難度 | 初始速度 | 邊界 |
|---|---|---|
| 簡單 | 180 ms/tick | 可設定 |
| 普通 | 150 ms/tick | 可設定 |
| 困難 | 120 ms/tick | 可設定 |

---

<a name="zh-controls"></a>
## 操作方式

### 鍵盤控制

| 按鍵 | 功能 |
|---|---|
| `↑` / `W` | 向上移動 |
| `↓` / `S` | 向下移動 |
| `←` / `A` | 向左移動 |
| `→` / `D` | 向右移動 |
| `Space` | 暫停 / 繼續 |
| `R` | 重新開始 |
| `Esc` | 返回主選單 |

### 觸控控制（手機）

| 手勢 | 功能 |
|---|---|
| 向上滑動 | 向上移動 |
| 向下滑動 | 向下移動 |
| 向左滑動 | 向左移動 |
| 向右滑動 | 向右移動 |

> 禁止 180° 反向操作。方向輸入佇列最多保留 2 個，防止快速操作時輸入遺失。

---

<a name="zh-food"></a>
## 食物與計分

| 食物 | 顏色 | 出現機率 | 得分 | 效果 |
|---|---|---|---|---|
| 一般食物 | 紅色 `#e94560` | 70% | +10 | 蛇增長 +1 格 |
| 加速食物 | 黃色 `#ffff00` | 15% | +20 | 蛇增長 +1 格 |
| 黃金食物 | 金色 `#ffd700` | 10% | +50 | 蛇增長 +1 格，10 秒後消失 |
| 縮短食物 | 藍色 `#0000ff` | 5% | +30 | 蛇縮短 −2 格（最短保留 3 格） |

### 連擊倍率

3 秒內連續吃到食物，倍率每次 **+0.5×（最高 3×）**。
計時器歸零後倍率重設為 1.0。得分四捨五入後加入總分。

### 速度提升

每吃 5 顆食物，Tick 間隔縮短 **10 ms**（最低速限 60 ms）。

---

<a name="zh-themes"></a>
## 主題與設定

### 視覺主題

| 主題 | 背景色 | 蛇頭顏色 | 食物顏色 |
|---|---|---|---|
| 深色（預設） | `#1a1a2e` | `#00d4aa` | `#e94560` |
| 淺色 | 白底系列 | 綠色 | 紅色 |
| 霓虹 | `#0d0d0d` | `#39ff14` | `#ff00ff` |

### 設定項目

| 設定 | 選項 |
|---|---|
| 音效 | 開 / 關 |
| 格線顯示 | 開 / 關 |
| 邊界模式 | 撞牆死亡 / 穿越邊界 |
| 主題 | 深色 / 淺色 / 霓虹 |

---

<a name="zh-files"></a>
## 檔案結構

```
Snake_Game/
├── index.html              # 入口頁面，包含所有 UI 畫面的 HTML 結構
├── css/
│   ├── reset.css           # 瀏覽器預設樣式重置
│   ├── main.css            # 佈局、畫面切換、動畫
│   └── themes/
│       ├── dark.css        # 深色主題 CSS 變數
│       ├── light.css       # 淺色主題 CSS 變數
│       └── neon.css        # 霓虹發光主題 CSS 變數
└── js/
    ├── main.js             # 程式入口，連結 Game、UI 與 AudioSystem
    ├── game.js             # 核心遊戲迴圈與狀態機
    ├── snake.js            # Snake 類別：移動、碰撞、增長
    ├── food.js             # Food 類別：生成、分類、過期
    ├── renderer.js         # Canvas 繪製：蛇、食物、格線、障礙物
    ├── input.js            # 鍵盤與觸控輸入處理器
    ├── audio.js            # Web Audio API 程式化音效系統
    ├── ui.js               # DOM/畫面管理與事件綁定
    ├── storage.js          # localStorage 讀寫輔助函數
    └── utils.js            # 共用工具函數
```

---

<a name="zh-modules"></a>
## 模組說明

### `main.js` — 程式入口
`window.onload` 後執行：建立 `Game` 實例，呼叫 `UI.init(game)` 並啟動 `AudioSystem.init()`。

---

### `game.js` — `class Game`

遊戲的核心狀態機與主迴圈。

| 方法 | 說明 |
|---|---|
| `constructor()` | 建立 Canvas、初始化所有子系統、啟動 `requestAnimationFrame` 迴圈 |
| `start(mode, difficulty)` | 重置狀態後開始新遊戲 |
| `reset()` | 重新初始化蛇、食物、分數、速度、障礙物 |
| `loop(now)` | RAF 回呼，每幀呼叫 `update()` → `render()` |
| `update(now)` | 檢查經過時間後執行 `tick()`；處理限時模式倒數 |
| `tick()` | 一個遊戲步驟：移動蛇 → 碰撞判定 → 食物處理 |
| `handleEat(food)` | 套用食物效果、更新連擊、每 5 顆觸發加速 |
| `togglePause()` | 切換 `PLAYING ↔ PAUSED` 狀態 |
| `gameOver()` | 儲存分數、顯示遊戲結束畫面 |
| `render()` | 委派給 `Renderer` 重繪 Canvas |

**狀態流程**

```
MENU → PLAYING → PAUSED → PLAYING
                        ↓
                     GAMEOVER → MENU
```

---

### `snake.js` — `class Snake`

管理蛇的身體陣列與移動邏輯。

| 方法 | 說明 |
|---|---|
| `reset(x, y)` | 在 (x, y) 重建長度 3、向右的蛇 |
| `setDirection(dir)` | 將新方向加入佇列（阻擋 180° 反向、上限 2 個） |
| `move()` | 從佇列取出方向，將 body 陣列向前推進 |
| `grow(n)` | 增加 growing 計數器（後續 n 步保留尾端） |
| `shrink(n)` | 移除尾端格子（最短保留 3 格） |
| `checkSelfCollision()` | 比對頭部與 body[1] 之後的所有節段 |
| `checkWallCollision(gridSize)` | 頭部越界時回傳 `true` |
| `handleWrapAround(gridSize)` | 將頭部座標繞回對側 |
| `getHead()` | 回傳 `body[0]` |
| `getBody()` | 回傳完整身體陣列 |

---

### `food.js` — `class Food`

管理棋盤上的食物物件。

| 方法 | 說明 |
|---|---|
| `spawn(excludeList)` | 以加權機率選擇類型，放置於空閒格子 |
| `remove(id)` | 依唯一 ID 移除食物 |
| `update()` | 黃金食物生成後 10 000 ms 自動過期 |
| `reset()` | 清空所有食物 |

食物類型以設定物件定義，包含 `type`、`color`、`probability`、`score`、`effect` 欄位。

---

### `renderer.js` — `class Renderer`

純繪製層，不含任何遊戲邏輯。

| 方法 | 說明 |
|---|---|
| `clear()` | `clearRect` 清空整個 Canvas |
| `drawGrid(show)` | 繪製淡色格線（依主題調整顏色） |
| `drawSnake(snake)` | 頭部為青綠色並顯示方向眼睛；身體圓角並漸層淡出 |
| `drawFood(foods)` | 以食物顏色繪製圓形；黃金食物以 `Math.sin` 產生脈衝效果 |
| `drawObstacles(obstacles)` | 深色圓角矩形；霓虹主題下顯示紅色發光 |
| `drawEyes(x, y, dir)` | 依移動方向定位的兩個白色圓形＋黑色瞳孔 |
| `drawRoundedRect(x,y,w,h,r)` | 輔助函數，繪製圓角矩形路徑 |

---

### `input.js` — `class InputHandler`

建構時即註冊鍵盤（`keydown`）與觸控（`touchstart` / `touchend`）監聽器。
觸控需至少滑動 **30 px** 才會觸發方向改變。

---

### `audio.js` — `AudioSystem`（單例物件）

透過 Web Audio API 實現程式化音效。
音訊 Context 在第一次使用者互動時延遲建立（符合瀏覽器政策）。

| 音效事件 | 觸發時機 |
|---|---|
| `eat` | 吃到一般食物 |
| `eat_golden` | 吃到黃金食物 |
| `eat_bonus` | 連擊倍率啟動 |
| `shrink` | 吃到縮短食物 |
| `speed` | 吃到加速食物 |
| `move` | 每個 Tick（極低音量） |
| `death` | 蛇發生碰撞 |
| `level_up` | 達到速度門檻 |
| `click` | 按下任何按鈕 |
| `pause` / `resume` | 切換暫停狀態 |

---

### `storage.js` — `Storage`（單例物件）

`localStorage` 的薄層封裝。

| 方法 | 說明 |
|---|---|
| `getSettings()` | 讀取設定（不存在則回傳預設值） |
| `saveSettings(s)` | 儲存設定物件 |
| `getBestScore(mode)` | 回傳指定模式的最高分 |
| `saveBestScore(mode, score)` | 更新最高分；破紀錄時回傳 `true` |
| `getLeaderboard(mode)` | 回傳指定模式的前 10 名陣列 |
| `saveScore(mode, entry)` | 新增記錄、排序、裁切至 10 筆 |

**儲存結構**

```json
{
  "snake_settings": { "sound": true, "grid": true, "borderMode": "wall", "theme": "dark" },
  "snake_best":     { "classic": 3200, "timeattack": 1850, "obstacle": 2100 },
  "snake_scores":   { "classic": [{ "score": 3200, "date": "2026-06-04" }] }
}
```

---

### `ui.js` — `UI`（單例物件）

畫面路由管理與 DOM 事件綁定。

| 方法 | 說明 |
|---|---|
| `init(game)` | 綁定所有按鈕監聽器，初始化主題與設定顯示 |
| `showScreen(id)` | 隱藏所有畫面，啟用目標畫面 |
| `showPauseOverlay(bool)` | 顯示/隱藏半透明暫停遮罩 |
| `applyTheme(theme)` | 替換 CSS theme link 標籤並更新 `body` class |
| `showLeaderboard(mode)` | 導向排行榜並渲染對應分頁 |
| `updateLeaderboardTable(mode)` | 從 Storage 重建排行榜 `<tbody>` |
| `updateScore(score, best)` | 更新 HUD 分數與最高分顯示 |
| `updateTimer(timeLeft, max)` | 更新計時器文字與進度條寬度 |
| `showGameOver(score, level, isNew)` | 顯示遊戲結束畫面及破紀錄橫幅 |

---

### `utils.js` — `Utils`（單例物件）

| 方法 | 說明 |
|---|---|
| `randomInt(min, max)` | 回傳 [min, max] 的隨機整數 |
| `getRandomGridPos(gridSize, excludeList)` | 回傳不在排除清單內的空閒格子座標 |
| `formatTime(seconds)` | 將秒數轉換為 `mm:ss` 字串 |
| `isSamePos(p1, p2)` | 判斷兩個 `{x, y}` 物件座標是否相同 |

---

<a name="zh-compat"></a>
## 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---

<div align="center">

Snake Game v1.0 · HTML5 + CSS3 + JavaScript · No frameworks

</div>
