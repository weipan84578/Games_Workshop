# 💣 Minesweeper — Web Edition

> **Language / 言語 / 語言**
> [English](#english) | [日本語](#日本語) | [繁體中文](#繁體中文)

---

<a name="english"></a>
# English

## Overview

A faithful recreation of the classic Minesweeper game built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — open `index.html` in any modern browser and play immediately.

## Features

| Feature | Description |
|---|---|
| 4 Difficulty Levels | Easy, Medium, Expert, and fully customizable |
| Safe First Click | Mines are placed *after* the first click, guaranteeing a safe start |
| Flood Fill | Blank areas expand automatically via BFS algorithm |
| Chord | Hold both mouse buttons on a number to reveal all adjacent unflagged cells |
| Flag / Question Mark | Right-click or long-press to cycle through flag → ? → none |
| Timer | Starts on first click, stops on win or loss, max 999 s |
| Best Times | Personal best per difficulty stored in `localStorage` |
| Match History | Last 50 games saved with result, difficulty, time, and date |
| Dark Mode | Full dark-theme toggle in Settings |
| Sound Effects | Web Audio API tones for click, flag, explosion, and victory |
| Keyboard Navigation | Arrow keys to move, Space / Enter to reveal, `F` to flag |
| Mobile Support | Long-press (500 ms) to flag, two-finger tap to chord |

## Difficulty Settings

| Difficulty | Rows | Columns | Mines |
|---|---|---|---|
| Easy | 9 | 9 | 10 |
| Medium | 16 | 16 | 40 |
| Expert | 16 | 30 | 99 |
| Custom | 5 – 30 | 5 – 50 | 1 – (rows × cols − 1) |

## File Structure

```
Minesweeper/
├── index.html          # Entry point — all screens declared here
├── css/
│   ├── style.css       # Global layout, themes, UI components
│   └── board.css       # Cell states, number colors, animations
└── js/
    ├── game.js         # Core logic — mine placement, reveal, flag, chord, win/lose
    ├── board.js        # DOM controller — renders board, handles input, navigation
    ├── timer.js        # Stopwatch — start / stop / reset, 3-digit display
    ├── storage.js      # localStorage — best times, game history, settings
    └── audio.js        # Web Audio API — programmatic sound effects
```

## Module Reference

### `game.js` — Game Logic

| Class / Symbol | Role |
|---|---|
| `Game` | Central state machine; holds board data, game phase, and flag count |
| `DIFFICULTY_SETTINGS` | Constant map of preset row/col/mine values |
| `CELL_STATES` | Enum: `covered`, `revealed`, `flagged`, `questioned`, `exploded` |
| `Game.init(difficulty, custom)` | Resets board to a clean state for the selected difficulty |
| `Game.revealCell(r, c)` | Triggers mine placement on first call, then reveals or explodes |
| `Game.floodFill(r, c, out)` | BFS expansion of connected blank cells |
| `Game.toggleFlag(r, c)` | Cycles cell through flag → question → covered |
| `Game.chord(r, c)` | One-shot reveal of all neighbors when flag count matches number |
| `Game.checkWin()` | Returns `true` when every non-mine cell is revealed |

### `board.js` — DOM Controller

| Method | Role |
|---|---|
| `Board.init()` | Binds all event listeners; applies saved settings; starts first game |
| `Board.renderBoard()` | Destroys and recreates the cell grid in the DOM |
| `Board.handleReveal(r, c)` | Delegates to `Game.revealCell`, then updates UI and checks end-state |
| `Board.handleFlag(r, c)` | Delegates to `Game.toggleFlag`, updates cell class and mine counter |
| `Board.handleChord(r, c)` | Delegates to `Game.chord`, handles resulting win/loss |
| `Board.showResult(isWin)` | Shows result modal with elapsed time and personal best |
| `Board.handleKeyDown(e)` | Arrow-key focus movement; Space/Enter reveal; F flag |
| `Board.updateHistoryUI()` | Reads storage and renders the leaderboard screen |

### `timer.js` — Stopwatch

| Method | Role |
|---|---|
| `Timer.start()` | Begins 1-second interval, capped at 999 |
| `Timer.stop()` | Clears interval without resetting |
| `Timer.reset()` | Stops and sets seconds back to 0 |
| `Timer.getTime()` | Returns elapsed seconds as a number |

### `storage.js` — Persistence

| Method | Role |
|---|---|
| `Storage.saveBestTime(diff, time)` | Updates best time only if new time is lower |
| `Storage.getBestTimes()` | Returns `{ easy, medium, expert, custom }` object |
| `Storage.saveGameRecord(diff, time, isWin)` | Prepends record to history; keeps last 50 entries |
| `Storage.getHistory()` | Returns array of game records (newest first) |
| `Storage.saveSettings(patch)` | Merges partial settings object into stored settings |
| `Storage.getSettings()` | Returns full settings, filling gaps with defaults |
| `Storage.clearAllData()` | Removes all three localStorage keys |

### `audio.js` — Sound Effects

| Method | Sound |
|---|---|
| `Audio.playClick()` | Soft sine tone (600 Hz) when a cell is revealed |
| `Audio.playFlag()` | Triangle tone (400 Hz) when a flag is placed |
| `Audio.playExplode()` | Double sawtooth burst (100 Hz + 50 Hz) on mine hit |
| `Audio.playWin()` | C – E – G – C arpeggio on victory |

## How to Run

1. Clone or download this repository.
2. Open `index.html` in Chrome, Firefox, Safari, or Edge (version 90+).
3. No build step or server required.

---

<a name="日本語"></a>
# 日本語

## 概要

HTML・CSS・JavaScript のみで実装したクラシックな「マインスイーパー」のWeb版です。フレームワーク不要 — `index.html` をブラウザで開くだけでプレイできます。

## 機能一覧

| 機能 | 説明 |
|---|---|
| 4段階の難易度 | 初級・中級・上級・カスタム |
| 安全な初回クリック | 初回クリック後に地雷を配置し、最初の一手は必ず安全 |
| フラッドフィル | BFSアルゴリズムで空白マスを自動展開 |
| コード操作 | 数字マス上で両ボタン同時押しし、隣接フラグ数が一致すれば周囲を一括開放 |
| フラグ / 疑問符 | 右クリックまたは長押しで「旗 → ? → なし」をサイクル |
| タイマー | 初回クリックで開始、勝敗確定で停止、最大999秒 |
| ベストタイム | 難易度ごとの自己ベストを`localStorage`に保存 |
| 対戦履歴 | 直近50ゲームを結果・難易度・タイム・日時付きで記録 |
| ダークモード | 設定画面でテーマを切り替え |
| サウンドエフェクト | Web Audio APIによるクリック・旗・爆発・勝利音 |
| キーボード操作 | 矢印キーで移動、Space/Enterで開放、`F`でフラグ |
| モバイル対応 | 長押し（500ms）でフラグ、2本指タップでコード操作 |

## 難易度設定

| 難易度 | 行数 | 列数 | 地雷数 |
|---|---|---|---|
| 初級 (Easy) | 9 | 9 | 10 |
| 中級 (Medium) | 16 | 16 | 40 |
| 上級 (Expert) | 16 | 30 | 99 |
| カスタム | 5〜30 | 5〜50 | 1〜(行×列−1) |

## ファイル構成

```
Minesweeper/
├── index.html          # エントリーポイント — 全画面をここで定義
├── css/
│   ├── style.css       # グローバルレイアウト・テーマ・UIコンポーネント
│   └── board.css       # セルの状態・数字の色・アニメーション
└── js/
    ├── game.js         # コアロジック — 地雷配置・開放・フラグ・コード・勝敗
    ├── board.js        # DOMコントローラー — 盤面描画・入力処理・ナビゲーション
    ├── timer.js        # ストップウォッチ — 開始/停止/リセット・3桁表示
    ├── storage.js      # localStorage — ベストタイム・履歴・設定
    └── audio.js        # Web Audio API — プログラム生成サウンド
```

## モジュール詳細

### `game.js` — ゲームロジック

| クラス / シンボル | 役割 |
|---|---|
| `Game` | 中央ステートマシン。盤面データ・ゲームフェーズ・フラグ数を管理 |
| `DIFFICULTY_SETTINGS` | 難易度ごとの行/列/地雷数の定数マップ |
| `CELL_STATES` | 列挙型: `covered`・`revealed`・`flagged`・`questioned`・`exploded` |
| `Game.init(difficulty, custom)` | 選択難易度でボードを初期状態にリセット |
| `Game.revealCell(r, c)` | 初回呼び出し時に地雷を配置し、以降は開放または爆発 |
| `Game.floodFill(r, c, out)` | 連続する空白マスをBFSで展開 |
| `Game.toggleFlag(r, c)` | セルを旗 → 疑問符 → 覆われた状態にサイクル |
| `Game.chord(r, c)` | フラグ数が数字と一致するとき隣接マスを一括開放 |
| `Game.checkWin()` | 地雷以外の全マスが開放されていれば`true`を返す |

### `board.js` — DOMコントローラー

| メソッド | 役割 |
|---|---|
| `Board.init()` | イベントリスナーをバインド、保存済み設定を適用、最初のゲームを開始 |
| `Board.renderBoard()` | セルグリッドをDOMで再構築 |
| `Board.handleReveal(r, c)` | `Game.revealCell`に委譲し、UIと終了状態を更新 |
| `Board.handleFlag(r, c)` | `Game.toggleFlag`に委譲し、セルクラスと地雷カウンターを更新 |
| `Board.handleChord(r, c)` | `Game.chord`に委譲し、勝敗を処理 |
| `Board.showResult(isWin)` | 経過時間と自己ベストを含む結果モーダルを表示 |
| `Board.handleKeyDown(e)` | 矢印キーフォーカス移動、Space/Enter開放、Fフラグ |
| `Board.updateHistoryUI()` | ストレージから読み込み、ランキング画面を描画 |

### `timer.js` — ストップウォッチ

| メソッド | 役割 |
|---|---|
| `Timer.start()` | 1秒インターバルを開始（上限999秒） |
| `Timer.stop()` | リセットせずにインターバルを停止 |
| `Timer.reset()` | 停止して秒数を0に戻す |
| `Timer.getTime()` | 経過秒数を数値で返す |

### `storage.js` — 永続化

| メソッド | 役割 |
|---|---|
| `Storage.saveBestTime(diff, time)` | 新記録の場合のみベストタイムを更新 |
| `Storage.getBestTimes()` | `{ easy, medium, expert, custom }` オブジェクトを返す |
| `Storage.saveGameRecord(diff, time, isWin)` | 履歴の先頭に記録を追加（最大50件） |
| `Storage.getHistory()` | ゲーム記録の配列を返す（新しい順） |
| `Storage.saveSettings(patch)` | 部分的な設定オブジェクトをマージ保存 |
| `Storage.getSettings()` | デフォルトを補完した完全な設定を返す |
| `Storage.clearAllData()` | 3つのlocalStorageキーをすべて削除 |

### `audio.js` — サウンドエフェクト

| メソッド | 音 |
|---|---|
| `Audio.playClick()` | マス開放時のソフトなサイン波（600 Hz） |
| `Audio.playFlag()` | フラグ設置時のトライアングル波（400 Hz） |
| `Audio.playExplode()` | 地雷命中時の二重ノコギリ波バースト（100 Hz + 50 Hz） |
| `Audio.playWin()` | 勝利時のC–E–G–Cアルペジオ |

## 起動方法

1. このリポジトリをクローンまたはダウンロードします。
2. Chrome・Firefox・Safari・Edge（バージョン90以上）で `index.html` を開きます。
3. ビルドやサーバーは不要です。

---

<a name="繁體中文"></a>
# 繁體中文

## 概述

以純 HTML、CSS、JavaScript 打造的經典踩地雷網頁版。無任何框架依賴 — 直接用瀏覽器開啟 `index.html` 即可遊玩。

## 功能列表

| 功能 | 說明 |
|---|---|
| 四種難度 | 初級、中級、高級與完全自訂 |
| 安全首擊 | 首次點擊後才隨機埋雷，開局必定安全 |
| 洪水填充 | 以 BFS 演算法自動展開空白區域 |
| 雙鍵揭示 | 在數字格上同時按住左右鍵，旗標數吻合時一次揭開周圍所有格子 |
| 旗標 / 問號 | 右鍵或長按循環切換「旗 → ? → 無標記」 |
| 計時器 | 首次點擊後開始，勝負確定後停止，最大 999 秒 |
| 最佳成績 | 各難度個人最佳時間儲存於 `localStorage` |
| 對局排行榜 | 儲存最近 50 局，含結果、難度、用時與日期 |
| 深色模式 | 在設定畫面切換深淺主題 |
| 音效 | 以 Web Audio API 合成翻格、插旗、爆炸、勝利四種音效 |
| 鍵盤操作 | 方向鍵移動焦點，Space/Enter 翻開，`F` 插旗 |
| 行動裝置支援 | 長按（500ms）插旗，雙指點擊觸發雙鍵揭示 |

## 難度設定

| 難度 | 列數 | 欄數 | 地雷數 |
|---|---|---|---|
| 初級 (Easy) | 9 | 9 | 10 |
| 中級 (Medium) | 16 | 16 | 40 |
| 高級 (Expert) | 16 | 30 | 99 |
| 自訂 (Custom) | 5〜30 | 5〜50 | 1〜(列×欄−1) |

## 檔案結構

```
Minesweeper/
├── index.html          # 入口 — 所有畫面均在此定義
├── css/
│   ├── style.css       # 全域版面、主題、UI 元件
│   └── board.css       # 格子狀態、數字顏色、動畫
└── js/
    ├── game.js         # 核心邏輯 — 埋雷、翻格、旗標、雙鍵揭示、勝負
    ├── board.js        # DOM 控制器 — 棋盤渲染、輸入處理、畫面導航
    ├── timer.js        # 碼錶 — 啟動/停止/重置、三位數顯示
    ├── storage.js      # localStorage — 最佳成績、對局記錄、設定
    └── audio.js        # Web Audio API — 程式化合成音效
```

## 模組詳細說明

### `game.js` — 遊戲邏輯

| 類別 / 符號 | 職責 |
|---|---|
| `Game` | 中央狀態機，持有棋盤資料、遊戲階段與旗標計數 |
| `DIFFICULTY_SETTINGS` | 各難度列/欄/地雷數的常數對照表 |
| `CELL_STATES` | 列舉值：`covered`、`revealed`、`flagged`、`questioned`、`exploded` |
| `Game.init(difficulty, custom)` | 以選定難度將棋盤重置為初始狀態 |
| `Game.revealCell(r, c)` | 首次呼叫時觸發埋雷，後續翻開格子或引爆 |
| `Game.floodFill(r, c, out)` | BFS 展開相連空白格 |
| `Game.toggleFlag(r, c)` | 將格子循環切換：旗標 → 問號 → 覆蓋 |
| `Game.chord(r, c)` | 旗標數與數字吻合時一次揭開周圍格子 |
| `Game.checkWin()` | 所有非地雷格已翻開時回傳 `true` |

### `board.js` — DOM 控制器

| 方法 | 職責 |
|---|---|
| `Board.init()` | 綁定所有事件監聽器、套用已儲存設定、啟動第一局 |
| `Board.renderBoard()` | 在 DOM 中重新建立格子網格 |
| `Board.handleReveal(r, c)` | 委派給 `Game.revealCell`，再更新 UI 並檢查結束狀態 |
| `Board.handleFlag(r, c)` | 委派給 `Game.toggleFlag`，更新格子樣式類與地雷計數器 |
| `Board.handleChord(r, c)` | 委派給 `Game.chord`，處理後續勝負結果 |
| `Board.showResult(isWin)` | 顯示含用時與個人最佳的結算視窗 |
| `Board.handleKeyDown(e)` | 方向鍵焦點移動、Space/Enter 翻開、F 插旗 |
| `Board.updateHistoryUI()` | 讀取儲存資料，渲染對局排行榜畫面 |

### `timer.js` — 碼錶

| 方法 | 職責 |
|---|---|
| `Timer.start()` | 啟動每秒計數，上限 999 秒 |
| `Timer.stop()` | 停止計數但不重置 |
| `Timer.reset()` | 停止並將秒數歸零 |
| `Timer.getTime()` | 以數字回傳已過秒數 |

### `storage.js` — 資料持久化

| 方法 | 職責 |
|---|---|
| `Storage.saveBestTime(diff, time)` | 僅在新成績更優時更新最佳時間 |
| `Storage.getBestTimes()` | 回傳 `{ easy, medium, expert, custom }` 物件 |
| `Storage.saveGameRecord(diff, time, isWin)` | 在歷史記錄前端插入一筆（最多保留 50 筆） |
| `Storage.getHistory()` | 回傳對局記錄陣列（最新在前） |
| `Storage.saveSettings(patch)` | 合併部分設定物件並寫入儲存 |
| `Storage.getSettings()` | 回傳以預設值補全的完整設定 |
| `Storage.clearAllData()` | 刪除全部三個 localStorage 鍵 |

### `audio.js` — 音效

| 方法 | 音效 |
|---|---|
| `Audio.playClick()` | 翻格時的柔和正弦波（600 Hz） |
| `Audio.playFlag()` | 插旗時的三角波（400 Hz） |
| `Audio.playExplode()` | 踩雷時的雙重鋸齒波爆音（100 Hz + 50 Hz） |
| `Audio.playWin()` | 勝利時的 C–E–G–C 琶音 |

## 如何執行

1. 複製或下載此儲存庫。
2. 以 Chrome、Firefox、Safari 或 Edge（90 版以上）開啟 `index.html`。
3. 無需任何建置步驟或伺服器。

---

*Built with vanilla HTML / CSS / JavaScript — no dependencies.*
