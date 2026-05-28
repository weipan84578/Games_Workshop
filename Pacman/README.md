# Pac-Man Web

Vanilla HTML/CSS/JavaScript Pac-Man game built for direct browser play.

## Language / 言語 / 語言

- [English](#english)
- [日本語](#日本語)
- [中文](#中文)

---

## English

### Quick Map

| Goal | Where to Look |
| --- | --- |
| Play the game | Open `index.html` in a browser |
| Main gameplay logic | `js/main.js` |
| Maze layout | `MAZE_TEMPLATE` in `js/main.js` |
| Difficulty tuning | `getDifficulty()` in `js/main.js` |
| Pac-Man and ghost movement | `moveEntity()`, `updatePacman()`, `updateGhosts()` in `js/main.js` |
| Ghost AI targets | `chooseGhostDirection()`, `getGhostTarget()` in `js/main.js` |
| Scoring and collisions | `consumeCurrentTile()`, `checkCollisions()`, `addScore()` in `js/main.js` |
| Themes and colors | `css/base/variables.css` |
| Responsive layout | `css/layout/responsive.css` |
| Main screen layout | `index.html` |

### Overview

This is a browser-based Pac-Man game implemented without a build step. It uses HTML5 Canvas for rendering, CSS for the arcade UI, Web Audio API for generated sound effects/music, and `localStorage` for settings, saves, and high scores.

The game can run through `file://`, so a local web server is optional.

### How to Run

Open:

```text
index.html
```

Recommended browsers:

- Chrome / Edge
- Firefox
- Safari

No package install, bundler, compiler, or dev server is required.

### Controls

| Action | Keyboard | Mobile |
| --- | --- | --- |
| Move | Arrow keys or WASD | On-screen direction pad |
| Swipe movement | Not applicable | Swipe on the game canvas |
| Pause / Resume | `ESC` or `P` | Pause button in header |
| Start from menu | `Enter` | Tap Start |

### Game Features

- Classic Pac-Man-style maze gameplay.
- 28 x 31 tile Canvas board.
- Dots and power pellets.
- Four ghosts with different targeting behavior:
  - Blinky: direct chase.
  - Pinky: targets ahead of Pac-Man.
  - Inky: uses Pac-Man and Blinky to calculate a projected target.
  - Clyde: chases at distance, scatters when close.
- Ghost modes:
  - `SCATTER`
  - `CHASE`
  - `FRIGHTENED`
  - `EATEN`
- Sequential ghost release at game start and after player respawn.
- Power pellet frightened state.
- Ghost combo scoring.
- Extra life every 10,000 points.
- Level progression when all dots are cleared.
- Pause menu with save-and-quit.
- Game over result screen.
- Mobile controls and swipe support.
- Generated sound effects and simple BGM through Web Audio API.
- Theme selector with six themes.
- Persistent settings, save data, and high score through `localStorage`.

### Difficulty

Difficulty is configured in `getDifficulty()`:

| Difficulty | Lives | Pac-Man Speed | Ghost Speed |
| --- | ---: | ---: | ---: |
| Easy | 5 | 6.2 | 4.8 |
| Normal | 3 | 6.5 | 5.7 |
| Hard | 3 | 6.4 | 6.5 |

Easy mode only slows ghosts and gives more lives. Ghost release timing is shared with the other modes.

### Save Data

The game uses these `localStorage` keys:

| Key | Purpose |
| --- | --- |
| `pacman_settings` | Theme, volume, difficulty, BGM, vibration |
| `pacman_highscore` | Best score |
| `pacman_save` | Current score, level, lives, maze state, timestamp |

### Project Structure

```text
Pacman/
├── index.html
├── README.md
├── pacman-spec.md
├── css/
│   ├── animations/
│   │   ├── effects.css
│   │   ├── ghost.css
│   │   └── transitions.css
│   ├── base/
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── variables.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── hud.css
│   │   ├── mobile-controls.css
│   │   ├── modal.css
│   │   └── theme-switcher.css
│   ├── layout/
│   │   ├── grid.css
│   │   └── responsive.css
│   └── screens/
│       ├── game.css
│       ├── game-over.css
│       ├── instructions.css
│       ├── main-menu.css
│       └── settings.css
├── js/
│   └── main.js
└── assets/
    ├── audio/
    ├── fonts/
    └── sprites/
```

### Code Notes

- `index.html` contains all screens:
  - Main menu
  - Instructions
  - Settings
  - Game screen
  - Pause overlay
  - Game over screen
- `js/main.js` is a single IIFE script, intentionally not an ES module, so it can run from `file://`.
- Rendering is done through Canvas 2D.
- Audio is generated at runtime with Web Audio API; external audio files are not required.
- CSS is split by purpose: base, layout, screens, components, and animations.

### Verification

Run a JavaScript syntax check:

```bash
node --check js/main.js
```

---

## 日本語

### クイックマップ

| 目的 | 確認場所 |
| --- | --- |
| ゲームを起動する | ブラウザで `index.html` を開く |
| メインのゲーム処理 | `js/main.js` |
| 迷路データ | `js/main.js` の `MAZE_TEMPLATE` |
| 難易度調整 | `js/main.js` の `getDifficulty()` |
| Pac-Man とゴーストの移動 | `js/main.js` の `moveEntity()`、`updatePacman()`、`updateGhosts()` |
| ゴースト AI | `js/main.js` の `chooseGhostDirection()`、`getGhostTarget()` |
| スコアと衝突判定 | `consumeCurrentTile()`、`checkCollisions()`、`addScore()` |
| テーマと色 | `css/base/variables.css` |
| レスポンシブ対応 | `css/layout/responsive.css` |
| 画面構造 | `index.html` |

### 概要

これはブラウザで動作する Web 版 Pac-Man です。ビルド工程なしで、HTML5 Canvas、CSS、Vanilla JavaScript だけで実装されています。

描画は Canvas 2D、効果音と BGM は Web Audio API、設定・セーブデータ・ハイスコアは `localStorage` を使用します。

`file://` で直接開いて遊べます。

### 起動方法

次のファイルをブラウザで開きます。

```text
index.html
```

推奨ブラウザ:

- Chrome / Edge
- Firefox
- Safari

パッケージインストール、バンドラー、コンパイラー、開発サーバーは不要です。

### 操作方法

| 操作 | キーボード | モバイル |
| --- | --- | --- |
| 移動 | 矢印キー または WASD | 画面下の方向ボタン |
| スワイプ移動 | なし | Canvas 上でスワイプ |
| 一時停止 / 再開 | `ESC` または `P` | ヘッダーの一時停止ボタン |
| メニューから開始 | `Enter` | 開始ボタンをタップ |

### ゲーム機能

- クラシックな Pac-Man 風迷路ゲーム。
- 28 x 31 タイルの Canvas ボード。
- 通常ドットとパワーペレット。
- 4 種類のゴースト AI:
  - Blinky: Pac-Man を直接追跡。
  - Pinky: Pac-Man の進行方向の先を狙う。
  - Inky: Pac-Man と Blinky の位置から投影ターゲットを計算。
  - Clyde: 遠い時は追跡、近い時は散開。
- ゴーストモード:
  - `SCATTER`
  - `CHASE`
  - `FRIGHTENED`
  - `EATEN`
- ゲーム開始時とミス後のリスポーン時にゴーストが順番に出撃。
- パワーペレットによる frightened 状態。
- ゴースト連続撃破スコア。
- 10,000 点ごとに残機追加。
- ドット全消しで次のレベルへ進行。
- 一時停止メニューとセーブして終了。
- ゲームオーバー結果画面。
- モバイル方向ボタンとスワイプ操作。
- Web Audio API による生成効果音と簡易 BGM。
- 6 種類のテーマ切り替え。
- `localStorage` による設定、セーブ、ハイスコア保存。

### 難易度

難易度は `getDifficulty()` で管理されています。

| 難易度 | 残機 | Pac-Man 速度 | ゴースト速度 |
| --- | ---: | ---: | ---: |
| Easy | 5 | 6.2 | 4.8 |
| Normal | 3 | 6.5 | 5.7 |
| Hard | 3 | 6.4 | 6.5 |

Easy はゴースト速度を遅くし、残機を増やします。ゴーストの出撃タイミングは他の難易度と共通です。

### セーブデータ

使用する `localStorage` キー:

| キー | 用途 |
| --- | --- |
| `pacman_settings` | テーマ、音量、難易度、BGM、振動 |
| `pacman_highscore` | ハイスコア |
| `pacman_save` | スコア、レベル、残機、迷路状態、タイムスタンプ |

### プロジェクト構成

```text
Pacman/
├── index.html
├── README.md
├── pacman-spec.md
├── css/
│   ├── animations/
│   ├── base/
│   ├── components/
│   ├── layout/
│   └── screens/
├── js/
│   └── main.js
└── assets/
    ├── audio/
    ├── fonts/
    └── sprites/
```

### 実装メモ

- `index.html` にはメニュー、説明、設定、ゲーム、ポーズ、ゲームオーバー画面が含まれています。
- `js/main.js` は単一の IIFE スクリプトです。`file://` で動くように ES module は使っていません。
- Canvas 2D でゲームを描画します。
- 音声は Web Audio API で生成するため、外部音声ファイルは必須ではありません。
- CSS は base、layout、screens、components、animations に分割されています。

### 検証

JavaScript の構文チェック:

```bash
node --check js/main.js
```

---

## 中文

### 快速索引

| 目標 | 查看位置 |
| --- | --- |
| 開始遊戲 | 用瀏覽器開啟 `index.html` |
| 主要遊戲邏輯 | `js/main.js` |
| 迷宮配置 | `js/main.js` 裡的 `MAZE_TEMPLATE` |
| 難度調整 | `js/main.js` 裡的 `getDifficulty()` |
| Pac-Man 與鬼魂移動 | `moveEntity()`、`updatePacman()`、`updateGhosts()` |
| 鬼魂 AI 目標 | `chooseGhostDirection()`、`getGhostTarget()` |
| 分數與碰撞 | `consumeCurrentTile()`、`checkCollisions()`、`addScore()` |
| 主題與色彩 | `css/base/variables.css` |
| RWD 版面 | `css/layout/responsive.css` |
| 畫面 DOM 結構 | `index.html` |

### 專案概述

這是一款可直接在瀏覽器執行的 Web 版 Pac-Man。專案使用 HTML5 Canvas、CSS 與 Vanilla JavaScript，不需要任何建置流程。

遊戲畫面使用 Canvas 2D 繪製，音效與簡易 BGM 使用 Web Audio API 生成，設定、存檔與最高分使用 `localStorage` 保存。

此專案可直接透過 `file://` 開啟，不一定需要本機伺服器。

### 執行方式

用瀏覽器開啟：

```text
index.html
```

建議瀏覽器：

- Chrome / Edge
- Firefox
- Safari

不需要安裝套件，不需要 bundler，不需要 compiler，也不需要 dev server。

### 操作方式

| 操作 | 鍵盤 | 行動裝置 |
| --- | --- | --- |
| 移動 | 方向鍵或 WASD | 畫面下方方向鍵 |
| 滑動移動 | 無 | 在 Canvas 上滑動 |
| 暫停 / 繼續 | `ESC` 或 `P` | 頁首暫停按鈕 |
| 主選單開始 | `Enter` | 點擊開始遊戲 |

### 遊戲內容

- 經典 Pac-Man 風格迷宮玩法。
- 28 x 31 格 Canvas 棋盤。
- 一般豆子與能量豆。
- 4 種鬼魂 AI:
  - Blinky: 直接追 Pac-Man。
  - Pinky: 瞄準 Pac-Man 前方。
  - Inky: 根據 Pac-Man 與 Blinky 位置計算投射目標。
  - Clyde: 距離遠時追擊，太近時散開。
- 鬼魂狀態:
  - `SCATTER`
  - `CHASE`
  - `FRIGHTENED`
  - `EATEN`
- 遊戲開始與死亡重生後，鬼魂會依序出擊。
- 吃能量豆後鬼魂進入 frightened 狀態。
- 連續吃鬼魂有倍率分數。
- 每 10,000 分增加一條命。
- 吃完所有豆子進入下一關。
- 暫停選單支援存檔返回。
- Game Over 結算畫面。
- 支援手機方向鍵與滑動操作。
- 使用 Web Audio API 生成音效與簡易 BGM。
- 6 組主題色可切換。
- 使用 `localStorage` 保存設定、存檔與最高分。

### 難度設定

難度設定集中在 `getDifficulty()`。

| 難度 | 生命 | Pac-Man 速度 | 鬼魂速度 |
| --- | ---: | ---: | ---: |
| 輕鬆 | 5 | 6.2 | 4.8 |
| 標準 | 3 | 6.5 | 5.7 |
| 困難 | 3 | 6.4 | 6.5 |

輕鬆模式只降低鬼魂速度並增加生命數。鬼魂出擊延遲與其他難度相同。

### 存檔資料

使用的 `localStorage` key:

| Key | 用途 |
| --- | --- |
| `pacman_settings` | 主題、音量、難度、BGM、震動 |
| `pacman_highscore` | 最高分 |
| `pacman_save` | 分數、關卡、生命、迷宮狀態、時間戳 |

### 專案結構

```text
Pacman/
├── index.html
├── README.md
├── pacman-spec.md
├── css/
│   ├── animations/
│   ├── base/
│   ├── components/
│   ├── layout/
│   └── screens/
├── js/
│   └── main.js
└── assets/
    ├── audio/
    ├── fonts/
    └── sprites/
```

### 程式說明

- `index.html` 包含主選單、說明、設定、遊戲畫面、暫停視窗與 Game Over 畫面。
- `js/main.js` 使用單一 IIFE，不使用 ES module，確保 `file://` 可以直接執行。
- 遊戲畫面由 Canvas 2D 繪製。
- 音效使用 Web Audio API 即時生成，不依賴外部音檔。
- CSS 依用途拆分為 base、layout、screens、components、animations。

### 檢查方式

JavaScript 語法檢查：

```bash
node --check js/main.js
```
