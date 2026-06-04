# BoxMaster Sokoban Puzzle

BoxMaster is a browser-based Sokoban puzzle game built with HTML5 Canvas, CSS, and vanilla JavaScript. This README is written in English, Japanese, and Traditional Chinese.

## Language Navigation

| Language | Section |
|---|---|
| English | [English Guide](#english-guide) |
| 日本語 | [日本語ガイド](#日本語ガイド) |
| 繁體中文 | [繁體中文指南](#繁體中文指南) |

## Project Snapshot

| Item | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Game name | BoxMaster | BoxMaster | BoxMaster |
| Genre | Sokoban puzzle | 倉庫番パズル | 推箱子解謎 |
| Runtime | Static web app | 静的 Web アプリ | 靜態網頁遊戲 |
| Main tech | HTML5 Canvas, CSS3, ES2022 JavaScript | HTML5 Canvas, CSS3, ES2022 JavaScript | HTML5 Canvas、CSS3、ES2022 JavaScript |
| Dependencies | None | なし | 無 |
| Levels | 60 generated levels | 自動生成 60 ステージ | 60 個生成式關卡 |
| Difficulty | Easy, Medium, Hard | Easy, Medium, Hard | 簡單、中級、困難 |
| Storage | LocalStorage | LocalStorage | LocalStorage |
| Offline support | Service Worker cache | Service Worker キャッシュ | Service Worker 快取 |

## English Guide

### Game Introduction

BoxMaster is a compact Sokoban game where the player pushes crates onto target tiles. Every level is solved by planning the push order, avoiding blocked corners, and completing the puzzle with as few steps as possible.

| Topic | Description |
|---|---|
| Objective | Push every crate onto a target tile. |
| Core rule | Crates can only be pushed, never pulled. |
| Win condition | All crates are standing on target tiles. |
| Score | Level stars are based on step count compared with the par value. |
| Target platform | Desktop, tablet, and mobile browsers. |

### Feature Highlights

| Feature | Description |
|---|---|
| 60 levels | `easy`, `medium`, and `hard`, with 20 levels each. |
| Runtime level generation | Levels are generated in `main.js` from difficulty rules and validated layout helpers. |
| Canvas rendering | The board, walls, crates, targets, and player are drawn directly on `<canvas>`. |
| Undo and reset | Each valid move is saved to a history stack for undo support. |
| Timer and step counter | The HUD shows elapsed time and step count during play. |
| Star rating | 3 stars for steps within par, 2 stars for steps within 1.5x par, 1 star for any clear. |
| Keyboard and swipe input | Supports arrow keys, WASD, shortcuts, and mobile swipe gestures. |
| Web Audio | Music and sound effects are synthesized with the Web Audio API. |
| Settings | Music volume, SFX volume, music style, cell size, dark mode, haptics, and timer display. |
| PWA basics | `manifest.json` and `sw.js` provide app metadata and offline asset caching. |

### Quick Start

| Method | Steps |
|---|---|
| Direct open | Open `index.html` in a browser. Core gameplay works without a build step. |
| Static server | Serve this folder with any static server, then open the local URL. This is recommended for Service Worker testing. |
| Deployment | Upload the files to GitHub Pages, Vercel, Netlify, or any static host. |

Example static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Controls

| Input | Action |
|---|---|
| Arrow keys | Move player |
| `W` `A` `S` `D` | Move player |
| Swipe on board | Move player on touch devices |
| `Z` or `Ctrl+Z` | Undo |
| `R` | Reset current level |
| `Esc` | Pause |
| `H` | Show hint |
| `M` | Toggle music volume between mute and default |

### Game Flow

| Screen | Purpose | Related code |
|---|---|---|
| Menu | Start game, open settings, open help | `index.html`, `App.handleAction()` |
| Level Select | Switch difficulty and choose a level | `App.renderLevels()`, `App.startLevel()` |
| Game | Canvas board, HUD, undo, reset, pause, hint | `Game`, `Renderer`, `App.tryMove()` |
| Settings | Update runtime preferences | `App.bindSettings()`, `App.persistSettings()` |
| Help | Show control and scoring notes | Static markup in `index.html` |
| Modal | Pause and clear result actions | `App.openModal()`, `App.closeModal()` |
| Toast | Short hint/status message | `App.toast()` |

### Program Classification

The current implementation is intentionally simple: most runtime logic lives in `main.js`, while markup, style, manifest, and cache logic are separated into their own files.

| File | Category | Responsibility |
|---|---|---|
| `index.html` | UI structure | Defines all screens, buttons, canvas, settings controls, modal, and toast container. |
| `style.css` | Visual system | Defines responsive layout, themes, HUD, buttons, level grid, settings panel, modal, and mobile rules. |
| `main.js` | Game application | Contains configuration, level generation, game state, renderer, audio, storage, input handling, and app orchestration. |
| `manifest.json` | PWA metadata | Defines app name, start URL, display mode, orientation, and theme colors. |
| `sw.js` | Offline cache | Caches core static assets and serves cached responses when available. |
| `sokoban_puzzle_game_spec.md` | Design document | A fuller project specification and future-facing design reference. Some proposed folders are not used by the current runtime. |

### `main.js` Internal Map

| Layer | Code | Responsibility |
|---|---|---|
| Configuration | `STORAGE_KEYS`, `DEFAULT_SETTINGS`, `DIFFICULTIES`, `DIRS`, `LEVEL_NAMES`, `LEVEL_RULES` | Central constants for storage, settings, movement directions, difficulty labels, level names, and generation rules. |
| Level building | `buildLevels()`, `generateSolvableGrid()`, `generateScrambledGrid()`, `generateHardGrid()` | Creates the 60 playable levels at runtime. |
| Level helpers | `createScrambledBaseGrid()`, `chooseScrambledTargets()`, `reverseScrambleOnce()`, `chooseLanes()`, `addDecorativeWalls()` | Builds layouts, places targets, scrambles crate positions, and adds walls while keeping puzzles playable. |
| Grid validation | `canReach()`, `findNearestFloor()`, `isOpenFloor()`, `isBoxSafeFloor()`, `ensureTargetCapacity()`, `normalizeGrid()` | Checks reachable floor tiles, safe crate positions, target capacity, and normalized map width. |
| Utility helpers | `samePos()`, `posKey()`, `countTiles()`, `roundRect()`, `loadJson()`, `saveJson()` | Shared helpers for coordinates, drawing, counting, and LocalStorage access. |
| Audio | `class AudioEngine` | Initializes Web Audio, controls music/SFX volume, plays synthesized sound effects, and loops background music. |
| Game state | `class Game` | Loads a level, tracks player/crates/history/steps/time/status, validates moves, supports undo, pause/resume, and win checks. |
| Rendering | `class Renderer` | Resizes the canvas and draws floor, walls, targets, crates, and player according to the current game state. |
| Application | `class App` | Connects DOM events, screens, settings, storage, input, HUD updates, win modal, timer, haptics, Service Worker, and render loop. |

### Data and Persistence

| Data | Storage key | Description |
|---|---|---|
| Settings | `boxmaster_settings` | Music/SFX volume, music style, cell size, theme, haptics, timer display, and other preferences. |
| Progress | `boxmaster_progress` | Cleared levels and best star count per difficulty. |
| Records | `boxmaster_records` | Best step count and best clear time for each level ID. |

### Level Symbols

| Symbol | Meaning |
|---|---|
| `#` | Wall |
| Space | Floor |
| `@` | Player |
| `$` | Crate |
| `.` | Target |
| `*` | Crate on target |
| `+` | Player on target |

### Extension Notes

| Goal | Where to change |
|---|---|
| Add more levels | Update `DIFFICULTIES`, `LEVEL_NAMES`, `LEVEL_RULES`, and generation functions in `main.js`. |
| Add a music style | Add a style option in `index.html`, then add note data in `AudioEngine.startMusic()`. |
| Add a setting | Add the control in `index.html`, style it in `style.css`, and bind/persist it in `App.bindSettings()`. |
| Change visuals | Update canvas drawing methods in `Renderer` and theme variables in `style.css`. |
| Change controls | Update `App.onKey()` or `App.bindSwipe()`. |
| Change offline assets | Update the `ASSETS` list in `sw.js`. |

## 日本語ガイド

### ゲーム紹介

BoxMaster は、箱を目標マスまで押して運ぶ倉庫番パズルです。箱は押すことしかできないため、押す順番、通路の確保、行き止まりを避ける判断が重要になります。

| 項目 | 内容 |
|---|---|
| 目的 | すべての箱を目標マスへ移動する。 |
| 基本ルール | 箱は押せるが、引くことはできない。 |
| クリア条件 | すべての箱が目標マス上にある。 |
| 評価 | 基準歩数 `par` と実際の歩数を比較して星数を決める。 |
| 対応環境 | デスクトップ、タブレット、スマートフォンのブラウザ。 |

### 主な機能

| 機能 | 説明 |
|---|---|
| 60 ステージ | `easy`、`medium`、`hard` が各 20 ステージ。 |
| 実行時ステージ生成 | 難易度ルールに基づいて `main.js` 内でステージを生成する。 |
| Canvas 描画 | 盤面、壁、箱、目標、プレイヤーを `<canvas>` に直接描画する。 |
| Undo と Reset | 有効な移動を履歴に保存し、1 手戻しを可能にする。 |
| タイマーと歩数 | プレイ中の HUD に経過時間と歩数を表示する。 |
| 星評価 | `par` 以内で 3 星、`par * 1.5` 以内で 2 星、クリアで 1 星。 |
| キーボードとスワイプ | 方向キー、WASD、ショートカット、モバイルスワイプに対応。 |
| Web Audio | BGM と効果音を Web Audio API で合成する。 |
| 設定 | 音量、音楽スタイル、マスサイズ、ダークモード、触覚フィードバック、タイマー表示を変更できる。 |
| PWA 基礎対応 | `manifest.json` と `sw.js` でアプリ情報とオフラインキャッシュを提供する。 |

### 起動方法

| 方法 | 手順 |
|---|---|
| 直接開く | `index.html` をブラウザで開く。ビルドは不要。 |
| 静的サーバー | 任意の静的サーバーでこのフォルダを配信する。Service Worker の確認に推奨。 |
| デプロイ | GitHub Pages、Vercel、Netlify などの静的ホスティングに配置する。 |

静的サーバーの例:

```bash
python -m http.server 8000
```

開く URL:

```text
http://localhost:8000
```

### 操作方法

| 入力 | 動作 |
|---|---|
| 方向キー | プレイヤー移動 |
| `W` `A` `S` `D` | プレイヤー移動 |
| 盤面でスワイプ | タッチ端末で移動 |
| `Z` または `Ctrl+Z` | 1 手戻す |
| `R` | 現在のステージをリセット |
| `Esc` | 一時停止 |
| `H` | ヒント表示 |
| `M` | 音楽音量をミュートと標準値で切り替え |

### 画面構成

| 画面 | 役割 | 関連コード |
|---|---|---|
| メニュー | ゲーム開始、設定、ヘルプへの入口 | `index.html`, `App.handleAction()` |
| ステージ選択 | 難易度を切り替え、ステージを選ぶ | `App.renderLevels()`, `App.startLevel()` |
| ゲーム | Canvas 盤面、HUD、Undo、Reset、Pause、Hint | `Game`, `Renderer`, `App.tryMove()` |
| 設定 | プレイ中の設定を変更 | `App.bindSettings()`, `App.persistSettings()` |
| ヘルプ | 操作と評価条件を表示 | `index.html` の静的マークアップ |
| モーダル | 一時停止とクリア後の操作 | `App.openModal()`, `App.closeModal()` |
| トースト | 短いヒントや状態メッセージ | `App.toast()` |

### プログラム分類

現在の実装はシンプルな静的 Web アプリです。実行時の主要ロジックは `main.js` に集約され、HTML、CSS、PWA 情報、キャッシュ処理は別ファイルになっています。

| ファイル | 分類 | 役割 |
|---|---|---|
| `index.html` | UI 構造 | 各画面、ボタン、Canvas、設定フォーム、モーダル、トースト領域を定義する。 |
| `style.css` | 見た目 | レスポンシブレイアウト、テーマ、HUD、ボタン、ステージ一覧、設定画面、モーダルを定義する。 |
| `main.js` | ゲーム本体 | 設定、ステージ生成、ゲーム状態、描画、音声、保存、入力、画面制御を担当する。 |
| `manifest.json` | PWA メタデータ | アプリ名、開始 URL、表示モード、画面向き、テーマカラーを定義する。 |
| `sw.js` | オフラインキャッシュ | 主要な静的ファイルをキャッシュし、利用可能ならキャッシュから返す。 |
| `sokoban_puzzle_game_spec.md` | 設計書 | 詳細仕様と将来拡張向けの設計参考資料。現在の実装では未使用の構成案も含まれる。 |

### `main.js` 内部構成

| レイヤー | コード | 役割 |
|---|---|---|
| 設定値 | `STORAGE_KEYS`, `DEFAULT_SETTINGS`, `DIFFICULTIES`, `DIRS`, `LEVEL_NAMES`, `LEVEL_RULES` | 保存キー、初期設定、移動方向、難易度、ステージ名、生成ルールを管理する。 |
| ステージ生成 | `buildLevels()`, `generateSolvableGrid()`, `generateScrambledGrid()`, `generateHardGrid()` | 60 ステージを実行時に生成する。 |
| 生成補助 | `createScrambledBaseGrid()`, `chooseScrambledTargets()`, `reverseScrambleOnce()`, `chooseLanes()`, `addDecorativeWalls()` | 盤面、目標、箱の配置、壁の追加を行う。 |
| 盤面検証 | `canReach()`, `findNearestFloor()`, `isOpenFloor()`, `isBoxSafeFloor()`, `ensureTargetCapacity()`, `normalizeGrid()` | 到達可能性、安全な箱配置、目標数、マップ幅を確認する。 |
| 共通補助 | `samePos()`, `posKey()`, `countTiles()`, `roundRect()`, `loadJson()`, `saveJson()` | 座標、描画、数え上げ、LocalStorage 読み書きを補助する。 |
| 音声 | `class AudioEngine` | Web Audio の初期化、音量制御、効果音、BGM ループを担当する。 |
| ゲーム状態 | `class Game` | ステージ読み込み、プレイヤー、箱、履歴、歩数、時間、状態、移動判定、Undo、勝利判定を管理する。 |
| 描画 | `class Renderer` | Canvas サイズ調整と床、壁、目標、箱、プレイヤーの描画を担当する。 |
| アプリ制御 | `class App` | DOM イベント、画面遷移、設定、保存、入力、HUD、勝利モーダル、タイマー、触覚、Service Worker、描画ループを統合する。 |

### データ保存

| データ | 保存キー | 内容 |
|---|---|---|
| 設定 | `boxmaster_settings` | 音量、音楽スタイル、マスサイズ、テーマ、触覚、タイマー表示など。 |
| 進行状況 | `boxmaster_progress` | 難易度ごとのクリア済みステージと最高星数。 |
| 記録 | `boxmaster_records` | 各ステージ ID ごとの最少歩数と最短時間。 |

### ステージ記号

| 記号 | 意味 |
|---|---|
| `#` | 壁 |
| 空白 | 床 |
| `@` | プレイヤー |
| `$` | 箱 |
| `.` | 目標 |
| `*` | 目標上の箱 |
| `+` | 目標上のプレイヤー |

### 拡張ポイント

| 目的 | 変更箇所 |
|---|---|
| ステージを増やす | `main.js` の `DIFFICULTIES`、`LEVEL_NAMES`、`LEVEL_RULES`、生成関数を調整する。 |
| 音楽スタイルを追加 | `index.html` の選択肢を追加し、`AudioEngine.startMusic()` に音階データを追加する。 |
| 設定を追加 | `index.html` に UI を追加し、`style.css` で整え、`App.bindSettings()` で保存処理を追加する。 |
| 見た目を変える | `Renderer` の描画メソッドと `style.css` のテーマ変数を更新する。 |
| 操作を変える | `App.onKey()` または `App.bindSwipe()` を更新する。 |
| オフライン対象を変える | `sw.js` の `ASSETS` 配列を更新する。 |

## 繁體中文指南

### 遊戲介紹

BoxMaster 是一款純前端推箱子解謎遊戲。玩家需要把所有箱子推到標記點上，但箱子只能推不能拉，因此每一步都需要考慮路線、推箱順序與是否會造成死局。

| 項目 | 說明 |
|---|---|
| 目標 | 將每個箱子推到目標格。 |
| 核心規則 | 箱子只能推，不能拉。 |
| 通關條件 | 所有箱子都位於目標格上。 |
| 評分方式 | 依照步數與該關標準步數 `par` 比較決定星數。 |
| 支援裝置 | 桌機、平板、手機瀏覽器。 |

### 功能特色

| 功能 | 說明 |
|---|---|
| 60 個關卡 | `easy`、`medium`、`hard` 三種難度，各 20 關。 |
| 生成式關卡 | 依照難度規則在 `main.js` 內即時產生關卡。 |
| Canvas 繪圖 | 棋盤、牆壁、箱子、目標點、玩家都由 `<canvas>` 手繪。 |
| 復原與重來 | 每次有效移動都會保存狀態，可回復上一手。 |
| 計時與步數 | 遊戲 HUD 顯示通關時間與目前步數。 |
| 星等評分 | 步數小於等於 `par` 得 3 星，小於等於 `par * 1.5` 得 2 星，通關即得 1 星。 |
| 鍵盤與滑動操作 | 支援方向鍵、WASD、快捷鍵與手機滑動。 |
| Web Audio 音訊 | 背景音樂與音效由 Web Audio API 即時合成。 |
| 設定系統 | 可調整音樂、音效、音樂風格、棋格大小、深色模式、觸覺回饋與計時顯示。 |
| PWA 基礎支援 | `manifest.json` 與 `sw.js` 提供應用程式資訊與離線快取。 |

### 快速開始

| 方式 | 步驟 |
|---|---|
| 直接開啟 | 用瀏覽器開啟 `index.html`，不需要建置流程。 |
| 靜態伺服器 | 用任意靜態伺服器啟動此資料夾，較適合測試 Service Worker。 |
| 部署 | 可直接放到 GitHub Pages、Vercel、Netlify 或任何靜態主機。 |

靜態伺服器範例:

```bash
python -m http.server 8000
```

開啟網址:

```text
http://localhost:8000
```

### 操作方式

| 輸入 | 動作 |
|---|---|
| 方向鍵 | 移動玩家 |
| `W` `A` `S` `D` | 移動玩家 |
| 在棋盤上滑動 | 觸控裝置移動玩家 |
| `Z` 或 `Ctrl+Z` | 復原上一手 |
| `R` | 重置目前關卡 |
| `Esc` | 暫停 |
| `H` | 顯示提示 |
| `M` | 在靜音與預設音樂音量間切換 |

### 畫面流程

| 畫面 | 用途 | 相關程式 |
|---|---|---|
| 主選單 | 開始遊戲、進入設定、查看說明 | `index.html`, `App.handleAction()` |
| 關卡選擇 | 切換難度並選擇關卡 | `App.renderLevels()`, `App.startLevel()` |
| 遊戲畫面 | Canvas 棋盤、HUD、復原、重來、暫停、提示 | `Game`, `Renderer`, `App.tryMove()` |
| 設定畫面 | 修改遊戲偏好設定 | `App.bindSettings()`, `App.persistSettings()` |
| 說明畫面 | 顯示操作與評分規則 | `index.html` 靜態內容 |
| 彈窗 | 暫停與通關後操作 | `App.openModal()`, `App.closeModal()` |
| 提示訊息 | 顯示短提示或狀態訊息 | `App.toast()` |

### 程式分類

目前專案是簡潔的靜態前端遊戲。主要執行邏輯集中在 `main.js`，介面結構、樣式、PWA 資訊與快取邏輯分別放在獨立檔案。

| 檔案 | 分類 | 角色 |
|---|---|---|
| `index.html` | UI 結構 | 定義所有畫面、按鈕、Canvas、設定控制項、彈窗與 toast 容器。 |
| `style.css` | 視覺樣式 | 定義 RWD 版面、主題、HUD、按鈕、關卡格、設定面板、彈窗與行動裝置樣式。 |
| `main.js` | 遊戲主程式 | 包含設定、關卡生成、遊戲狀態、Canvas 繪圖、音訊、資料儲存、輸入與畫面控制。 |
| `manifest.json` | PWA 資訊 | 定義應用名稱、啟動路徑、顯示模式、方向與主題色。 |
| `sw.js` | 離線快取 | 快取核心靜態資源，能在可用時回傳快取內容。 |
| `sokoban_puzzle_game_spec.md` | 規格文件 | 詳細設計書與未來擴充參考。其中部分拆分架構是規劃稿，不是目前實際檔案結構。 |

### `main.js` 內部分類

| 分層 | 程式碼 | 負責內容 |
|---|---|---|
| 設定與常數 | `STORAGE_KEYS`, `DEFAULT_SETTINGS`, `DIFFICULTIES`, `DIRS`, `LEVEL_NAMES`, `LEVEL_RULES` | 管理儲存鍵、預設設定、移動方向、難度標籤、關卡名稱與生成規則。 |
| 關卡建立 | `buildLevels()`, `generateSolvableGrid()`, `generateScrambledGrid()`, `generateHardGrid()` | 執行時產生 60 個可遊玩關卡。 |
| 關卡輔助 | `createScrambledBaseGrid()`, `chooseScrambledTargets()`, `reverseScrambleOnce()`, `chooseLanes()`, `addDecorativeWalls()` | 建立地圖、挑選目標點、反向打亂箱子位置、加入牆壁裝飾。 |
| 棋盤驗證 | `canReach()`, `findNearestFloor()`, `isOpenFloor()`, `isBoxSafeFloor()`, `ensureTargetCapacity()`, `normalizeGrid()` | 檢查可達區域、安全箱位、目標數量與地圖寬度一致性。 |
| 共用工具 | `samePos()`, `posKey()`, `countTiles()`, `roundRect()`, `loadJson()`, `saveJson()` | 處理座標、繪圖輔助、計數與 LocalStorage 讀寫。 |
| 音訊系統 | `class AudioEngine` | 初始化 Web Audio、調整音量、播放合成音效與背景音樂。 |
| 遊戲狀態 | `class Game` | 載入關卡、追蹤玩家與箱子、保存歷史、計算步數與時間、處理移動、復原、暫停與勝利判定。 |
| 畫面渲染 | `class Renderer` | 調整 Canvas 尺寸，繪製地板、牆壁、目標、箱子與玩家。 |
| 應用控制 | `class App` | 串接 DOM 事件、畫面切換、設定保存、輸入、HUD、通關彈窗、計時器、震動、Service Worker 與動畫循環。 |

### 資料保存

| 資料 | 儲存鍵 | 內容 |
|---|---|---|
| 設定 | `boxmaster_settings` | 音量、音樂風格、棋格大小、主題、觸覺、計時顯示等偏好。 |
| 進度 | `boxmaster_progress` | 各難度已通關關卡與最高星等。 |
| 紀錄 | `boxmaster_records` | 各關卡 ID 的最佳步數與最佳時間。 |

### 關卡符號

| 符號 | 意義 |
|---|---|
| `#` | 牆壁 |
| 空白 | 地板 |
| `@` | 玩家 |
| `$` | 箱子 |
| `.` | 目標格 |
| `*` | 在目標格上的箱子 |
| `+` | 站在目標格上的玩家 |

### 擴充建議

| 目標 | 修改位置 |
|---|---|
| 增加關卡 | 調整 `main.js` 的 `DIFFICULTIES`、`LEVEL_NAMES`、`LEVEL_RULES` 與生成函式。 |
| 增加音樂風格 | 在 `index.html` 增加選項，並在 `AudioEngine.startMusic()` 新增音階資料。 |
| 增加設定項目 | 在 `index.html` 增加控制項，在 `style.css` 補樣式，在 `App.bindSettings()` 加入保存邏輯。 |
| 調整視覺 | 修改 `Renderer` 繪圖方法與 `style.css` 主題變數。 |
| 調整操作 | 修改 `App.onKey()` 或 `App.bindSwipe()`。 |
| 調整離線快取 | 修改 `sw.js` 的 `ASSETS` 清單。 |
