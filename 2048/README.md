# 2048 Web Game / 2048 Web ゲーム / 2048 網頁遊戲

> **English:** A browser-based 2048 game with configurable board size, target tile, undo, themes, sound effects, BGM, local save data, and leaderboard.
>
> **日本語:** 盤面サイズ、目標タイル、Undo、テーマ、効果音、BGM、ローカル保存、ランキングに対応したブラウザ版 2048 です。
>
> **中文:** 支援棋盤尺寸、目標方塊、復原、主題、音效、BGM、本地存檔與排行榜的瀏覽器版 2048。

---

## Quick Navigation / クイックナビ / 快速導覽

| Section | English | 日本語 | 中文 |
|---|---|---|---|
| Project Snapshot | Project overview and technical summary | プロジェクト概要と技術要約 | 專案概覽與技術摘要 |
| Game Introduction | Gameplay, goal, features, controls, local data | 遊び方、目標、機能、操作、保存データ | 遊戲玩法、目標、功能、操作、本地資料 |
| Program Analysis | File structure, module responsibility, runtime flow | ファイル構成、モジュール責務、実行フロー | 檔案結構、模組職責、執行流程 |
| Run Project | How to launch the game | ゲームの起動方法 | 遊戲執行方式 |

---

## Project Snapshot / プロジェクト概要 / 專案快照

| Item | English | 日本語 | 中文 |
|---|---|---|---|
| Game Type | Single-player number puzzle | 1 人用数字パズル | 單人數字益智遊戲 |
| Platform | Web browser | Web ブラウザ | Web 瀏覽器 |
| Architecture | Static SPA controlled by JavaScript | JavaScript 制御の静的 SPA | JavaScript 控制的靜態 SPA |
| Core Tech | HTML5, CSS3, Vanilla JavaScript | HTML5、CSS3、Vanilla JavaScript | HTML5、CSS3、Vanilla JavaScript |
| Audio | Procedural Web Audio API | Web Audio API による生成音 | Web Audio API 程序化音效 |
| Storage | Browser `localStorage` | ブラウザの `localStorage` | 瀏覽器 `localStorage` |
| Build Step | No build step required | ビルド手順は不要 | 不需要建置步驟 |
| Entry File | Open `index.html` directly | `index.html` を直接開く | 直接開啟 `index.html` |

| Note | English | 日本語 | 中文 |
|---|---|---|---|
| Specification Scope | `2048_spec.md` describes a broader product target, including Vite, IndexedDB, and external audio assets. The current project is implemented as a no-build static browser game. | `2048_spec.md` には Vite、IndexedDB、外部音声素材などを含む広い製品仕様が書かれています。現在の実装はビルド不要の静的ブラウザゲームです。 | `2048_spec.md` 描述較完整的產品規格，包含 Vite、IndexedDB、外部音訊素材等目標。目前實作為免建置的靜態瀏覽器遊戲。 |

---

## Game Introduction / ゲーム紹介 / 遊戲介紹

| Topic | English | 日本語 | 中文 |
|---|---|---|---|
| Overview | This is a feature-rich browser version of 2048. Move tiles in four directions, merge matching numbers, and reach the target tile. | これは高機能なブラウザ版 2048 です。4 方向にタイルを動かし、同じ数字を合成して目標タイルを目指します。 | 這是一款完整功能的瀏覽器版 2048。玩家向四個方向移動方塊，合併相同數字並挑戰目標方塊。 |
| Default Goal | The default target tile is `2048`. | 標準の目標タイルは `2048` です。 | 預設目標方塊為 `2048`。 |
| Custom Goal | The goal can be changed to `512`, `1024`, `2048`, `4096`, or `8192`. | 目標は `512`、`1024`、`2048`、`4096`、`8192` に変更できます。 | 可在設定中改為 `512`、`1024`、`2048`、`4096` 或 `8192`。 |
| Main Challenge | Plan movement order, keep space available, and combine tiles efficiently before the board fills. | 移動順を考え、空きマスを確保しながら、盤面が埋まる前に効率よく合成します。 | 玩家需要規劃移動順序、保留空格，並在棋盤填滿前有效合併方塊。 |
| End Condition | The game ends when the board has no empty cells and no legal merge remains. | 空きマスがなく、合成できる隣接タイルもない場合にゲーム終了です。 | 當棋盤沒有空格且沒有任何可合併方塊時，遊戲結束。 |

### Main Features / 主な機能 / 核心特色

| Category | English | 日本語 | 中文 |
|---|---|---|---|
| Game Rules | Supports `3x3`, `4x4`, `5x5`, and `6x6` boards. A new `2` or `4` appears after every valid move. | `3x3`、`4x4`、`5x5`、`6x6` の盤面に対応。有効な移動後に `2` または `4` が生成されます。 | 支援 `3x3`、`4x4`、`5x5`、`6x6` 棋盤；每次有效移動後會生成 `2` 或 `4`。 |
| Score System | Merged tile values are added to the current score immediately. | 合成したタイルの数値が現在スコアへ即時加算されます。 | 合併後的方塊數值會即時加入目前分數。 |
| Best Score | The best score is stored locally and updated when the player breaks the record. | 最高スコアはローカルに保存され、記録更新時に更新されます。 | 最高分會保存於本地端，破紀錄時即時更新。 |
| Undo | Undo can be configured as `0`, `1`, `3`, or near-unlimited steps. | Undo 回数は `0`、`1`、`3`、またはほぼ無制限に設定できます。 | 復原次數可設定為 `0`、`1`、`3` 或近似無限次。 |
| Timer | Timer display can be enabled or disabled in settings. | タイマー表示は設定でオン / オフできます。 | 計時器可在設定中開啟或關閉。 |
| Themes | Classic, dark, ocean, forest, high-contrast, and grid display options are supported. | クラシック、ダーク、オーシャン、フォレスト、高コントラスト、グリッド表示に対応しています。 | 支援經典、深色、海洋、森林、高對比與顯示網格等視覺選項。 |
| Animations | Tile spawn, merge, score float, and victory confetti effects are included. | タイル出現、合成、スコア浮上、勝利時の紙吹雪エフェクトがあります。 | 包含方塊出現、合併、分數浮現與勝利彩帶動畫。 |
| Audio | Slide, merge, new tile, new record, win, game over, button click, undo, and procedural BGM are implemented. | 移動、合成、新規タイル、記録更新、勝利、ゲーム終了、ボタン、Undo、生成 BGM を実装しています。 | 已實作滑動、合併、新方塊、破紀錄、勝利、失敗、按鈕、復原與程序化 BGM。 |
| Leaderboard | Latest 20 records are stored, and the top 10 scores plus local stats are displayed. | 最新 20 件の記録を保存し、上位 10 件とローカル統計を表示します。 | 保存最近 20 局紀錄，並顯示前 10 名與本地統計。 |

### Controls / 操作方法 / 操作方式

| Situation | English | 日本語 | 中文 |
|---|---|---|---|
| Keyboard Move | Use arrow keys or `W` `A` `S` `D`. | 方向キー、または `W` `A` `S` `D` を使用します。 | 使用方向鍵或 `W` `A` `S` `D`。 |
| Touch Move | Swipe on the board. A movement over 30px is treated as a direction. | 盤面上でスワイプします。30px 以上の移動で方向を判定します。 | 在棋盤上滑動，位移超過 30px 會判定方向。 |
| On-screen Move | Click the direction buttons below the board. | 盤面下の方向ボタンをクリックします。 | 點擊棋盤下方的方向按鈕。 |
| Restart | Press `R` or use the restart button. | `R` キー、またはリスタートボタンを使います。 | 按 `R` 或使用重新開始按鈕。 |
| Undo | Press `Z` or use the undo button. | `Z` キー、または Undo ボタンを使います。 | 按 `Z` 或使用復原按鈕。 |
| Pause | Press `P` or use the pause button. | `P` キー、または一時停止ボタンを使います。 | 按 `P` 或使用暫停按鈕。 |
| Mute | Press `M` or use the sound button. | `M` キー、または音量ボタンを使います。 | 按 `M` 或使用音量按鈕。 |

### Local Data / 保存データ / 本地儲存資料

| Key | English | 日本語 | 中文 |
|---|---|---|---|
| `2048_settings` | Stores game settings, visual settings, volume settings, and mute state. | ゲーム設定、表示設定、音量設定、ミュート状態を保存します。 | 儲存遊戲設定、視覺設定、音量設定與靜音狀態。 |
| `2048_save` | Stores the current unfinished game so the player can continue later. | 未終了の現在ゲームを保存し、後で続きから遊べるようにします。 | 儲存尚未結束的目前局面，讓玩家之後可繼續遊戲。 |
| `2048_scores` | Stores the latest 20 game records. | 最新 20 件のゲーム記録を保存します。 | 儲存最近 20 局遊戲紀錄。 |
| `2048_best` | Stores the best score. | 最高スコアを保存します。 | 儲存最高分。 |
| `2048_stats` | Stores total games, total moves, wins, and best score. | 総プレイ数、総手数、勝利数、最高スコアを保存します。 | 儲存總局數、總步數、勝利次數與最佳分數。 |

---

## Program Analysis / プログラム分析 / 程式分析

### Directory Structure / ディレクトリ構成 / 目錄結構

```text
.
├── 2048_spec.md
├── README.md
├── app.js
├── index.html
├── style.css
└── src/
    ├── audio/
    │   └── engine.js
    ├── core/
    │   └── game.js
    ├── screens/
    │   ├── game.js
    │   ├── home.js
    │   ├── leaderboard.js
    │   └── settings.js
    ├── store/
    │   ├── scores.js
    │   └── settings.js
    ├── ui/
    │   ├── animation.js
    │   └── renderer.js
    └── utils/
        └── input.js
```

| Directory / File | English | 日本語 | 中文 |
|---|---|---|---|
| Root files | Top-level HTML, CSS, app bootstrap, specification, and documentation files. | HTML、CSS、アプリ起動処理、仕様書、ドキュメントなどのトップレベルファイルです。 | 最上層包含 HTML、CSS、應用程式啟動、規格書與文件。 |
| `src/audio/` | Audio engine and generated music logic. | 音声エンジンと生成音楽ロジックを置く場所です。 | 放置音效引擎與程序化音樂邏輯。 |
| `src/core/` | Pure game state and movement logic. | ゲーム状態と移動処理の中核ロジックです。 | 遊戲狀態與移動規則的核心邏輯。 |
| `src/screens/` | Screen-level interaction logic for home, game, settings, and leaderboard pages. | ホーム、ゲーム、設定、ランキング画面の画面単位ロジックです。 | 首頁、遊戲、設定、排行榜等畫面層互動邏輯。 |
| `src/store/` | Data persistence wrappers around `localStorage`. | `localStorage` を扱うデータ保存モジュールです。 | 封裝 `localStorage` 的資料儲存模組。 |
| `src/ui/` | Rendering and animation helpers. | 描画とアニメーション補助モジュールです。 | 渲染與動畫輔助模組。 |
| `src/utils/` | Input handling utilities. | 入力処理用のユーティリティです。 | 輸入處理工具。 |

### Detailed Module Classification / 詳細モジュール分類 / 詳細程式分類

| Path | Type | English | 日本語 | 中文 |
|---|---|---|---|---|
| `index.html` | Page Shell | Defines all screens, overlays, buttons, form controls, and script load order. | 全画面、オーバーレイ、ボタン、フォーム部品、script 読み込み順を定義します。 | 定義所有畫面、覆蓋層、按鈕、表單控制項與 script 載入順序。 |
| `style.css` | Styling | Defines CSS variables, tile colors, themes, board layout, responsive behavior, overlays, and keyframe animations. | CSS 変数、タイル色、テーマ、盤面レイアウト、レスポンシブ、オーバーレイ、キーフレームアニメーションを定義します。 | 定義 CSS 變數、方塊色彩、主題、棋盤排版、響應式、覆蓋層與 keyframe 動畫。 |
| `app.js` | App Controller | Initializes audio, applies settings, prepares rendering, connects input, starts the home screen, and manages the global confirm dialog. | 音声初期化、設定反映、描画準備、入力接続、ホーム画面起動、共通確認ダイアログ管理を行います。 | 初始化音效、套用設定、準備渲染、連接輸入、啟動首頁，並管理全域確認視窗。 |
| `src/core/game.js` | Game Logic | Owns board state, random tile spawning, movement, merge rules, score, move count, win/over checks, undo stack, and serialization. | 盤面状態、ランダムタイル生成、移動、合成ルール、スコア、手数、勝敗判定、Undo スタック、シリアライズを担当します。 | 負責棋盤狀態、隨機方塊生成、移動、合併規則、分數、步數、勝敗判定、復原堆疊與序列化。 |
| `src/screens/home.js` | Screen Logic | Handles home buttons, best score display, continue button state, navigation, and home mute shortcut. | ホーム画面のボタン、最高スコア表示、続きから開始ボタン状態、画面遷移、ミュート操作を処理します。 | 處理首頁按鈕、最高分顯示、繼續遊戲按鈕狀態、畫面切換與首頁靜音快捷。 |
| `src/screens/game.js` | Screen Logic | Starts and resumes games, binds game controls, handles moves, updates HUD, controls timer, pause, win/game-over overlays, save data, and score records. | ゲーム開始/再開、操作バインド、移動処理、HUD 更新、タイマー、一時停止、勝利/終了オーバーレイ、保存、スコア記録を管理します。 | 管理開始/恢復遊戲、綁定控制、處理移動、更新 HUD、計時、暫停、勝利/結束覆蓋層、存檔與分數紀錄。 |
| `src/screens/settings.js` | Screen Logic | Binds setting form values to `SettingsStore` and immediately applies theme, animation, timer, and audio changes. | 設定フォームを `SettingsStore` に接続し、テーマ、アニメーション、タイマー、音声変更を即時反映します。 | 將設定表單綁定到 `SettingsStore`，並即時套用主題、動畫、計時器與音效變更。 |
| `src/screens/leaderboard.js` | Screen Logic | Renders local stats and top 10 score records from `ScoresStore`. | `ScoresStore` からローカル統計と上位 10 件のスコア記録を描画します。 | 從 `ScoresStore` 渲染本地統計與前 10 名分數紀錄。 |
| `src/store/settings.js` | Data Store | Provides default settings and load, save, set, get, reset operations through `localStorage`. | 標準設定を提供し、`localStorage` 経由で読み込み、保存、設定、取得、リセットを行います。 | 提供預設設定，並透過 `localStorage` 執行讀取、保存、設定、取得與重置。 |
| `src/store/scores.js` | Data Store | Manages game records, best score, total stats, and top 10 sorting. | ゲーム記録、最高スコア、総合統計、上位 10 件の並べ替えを管理します。 | 管理遊戲紀錄、最高分、總體統計與前 10 名排序。 |
| `src/audio/engine.js` | Audio | Uses Web Audio API oscillators and gain nodes to generate sound effects and procedural BGM. | Web Audio API の oscillator と gain node を使い、効果音と生成 BGM を作ります。 | 使用 Web Audio API 的 oscillator 與 gain node 生成音效與程序化 BGM。 |
| `src/ui/renderer.js` | UI Renderer | Builds the board grid, positions tile elements, assigns tile values and colors, sizes text, and applies theme classes. | 盤面グリッド生成、タイル配置、値と色の設定、文字サイズ調整、テーマ class 反映を行います。 | 建立棋盤格、定位方塊元素、設定數值與顏色、調整文字尺寸並套用主題 class。 |
| `src/ui/animation.js` | Animation | Maps animation speeds, applies CSS duration variables, creates score float effects, and renders victory confetti. | アニメーション速度を割り当て、CSS duration 変数を反映し、スコア浮上と勝利紙吹雪を生成します。 | 對應動畫速度、套用 CSS duration 變數、產生分數浮現與勝利彩帶效果。 |
| `src/utils/input.js` | Input | Handles arrow keys, WASD, hotkeys, touch swipes, and direction button clicks. | 方向キー、WASD、ホットキー、タッチスワイプ、方向ボタンのクリックを処理します。 | 處理方向鍵、WASD、快捷鍵、觸控滑動與方向按鈕點擊。 |
| `2048_spec.md` | Specification | Documents the broader product specification and future feature targets. | より広い製品仕様と今後の機能目標を記録しています。 | 記錄較完整的產品規格與未來功能目標。 |
| `README.md` | Documentation | Provides this trilingual project guide and program analysis. | この三言語のプロジェクトガイドとプログラム分析を提供します。 | 提供本三語專案說明與程式分析文件。 |

### Runtime Flow / 実行フロー / 執行流程

| Step | English | 日本語 | 中文 |
|---|---|---|---|
| 1 | Browser loads `index.html`, CSS, and JavaScript files in order. | ブラウザが `index.html`、CSS、JavaScript を順番に読み込みます。 | 瀏覽器依序載入 `index.html`、CSS 與 JavaScript 檔案。 |
| 2 | `DOMContentLoaded` triggers `App.init()`. | `DOMContentLoaded` により `App.init()` が実行されます。 | `DOMContentLoaded` 觸發 `App.init()`。 |
| 3 | App initializes audio, reads settings, applies theme, initializes input, and shows the home screen. | App は音声を初期化し、設定を読み、テーマを反映し、入力を初期化してホーム画面を表示します。 | App 初始化音效、讀取設定、套用主題、初始化輸入並顯示首頁。 |
| 4 | Player starts a new game or resumes saved data from `2048_save`. | プレイヤーは新規ゲームを開始するか、`2048_save` から保存データを再開します。 | 玩家開始新遊戲，或從 `2048_save` 恢復存檔。 |
| 5 | `Game.move()` calculates movement, merging, scoring, win state, game-over state, and new tile position. | `Game.move()` が移動、合成、スコア、勝利状態、終了状態、新規タイル位置を計算します。 | `Game.move()` 計算移動、合併、分數、勝利狀態、結束狀態與新方塊位置。 |
| 6 | `Renderer.render()` redraws tiles and applies animation classes for new or merged tiles. | `Renderer.render()` がタイルを再描画し、新規タイルや合成タイル用の animation class を付与します。 | `Renderer.render()` 重新渲染方塊，並為新方塊或合併方塊套用動畫 class。 |
| 7 | `GameScreen` updates HUD, plays audio, saves progress, and shows win or game-over overlays when needed. | `GameScreen` が HUD を更新し、音声を再生し、進行状況を保存し、必要に応じて勝利または終了画面を表示します。 | `GameScreen` 更新 HUD、播放音效、保存進度，並在需要時顯示勝利或結束畫面。 |
| 8 | `ScoresStore` records completed games and updates best score and stats. | `ScoresStore` が完了したゲームを記録し、最高スコアと統計を更新します。 | `ScoresStore` 記錄已完成局數，並更新最高分與統計資料。 |

### Data Flow / データフロー / 資料流程

| Flow | English | 日本語 | 中文 |
|---|---|---|---|
| Settings | Settings form changes are saved to `SettingsStore`, then applied to renderer or audio modules. | 設定フォームの変更は `SettingsStore` に保存され、描画または音声モジュールへ反映されます。 | 設定表單變更會保存到 `SettingsStore`，再套用到渲染或音效模組。 |
| Movement | Input events call the active move callback, which calls `Game.move()`. | 入力イベントが現在の移動 callback を呼び、そこから `Game.move()` が実行されます。 | 輸入事件呼叫目前的移動 callback，再執行 `Game.move()`。 |
| Rendering | Game state is passed into `Renderer.render()` to rebuild visible tiles. | ゲーム状態が `Renderer.render()` に渡され、表示タイルが再構築されます。 | 遊戲狀態傳入 `Renderer.render()`，重建可見方塊。 |
| Saving | Active games are serialized by `Game.serialize()` and saved under `2048_save`. | 進行中のゲームは `Game.serialize()` でシリアライズされ、`2048_save` に保存されます。 | 進行中的遊戲透過 `Game.serialize()` 序列化，並存入 `2048_save`。 |
| Records | Finished games are saved by `ScoresStore.saveRecord()`. | 完了したゲームは `ScoresStore.saveRecord()` で保存されます。 | 結束的遊戲透過 `ScoresStore.saveRecord()` 保存。 |

---

## How to Run / 実行方法 / 執行方式

| Step | English | 日本語 | 中文 |
|---|---|---|---|
| 1 | Open the project folder. | プロジェクトフォルダを開きます。 | 開啟專案資料夾。 |
| 2 | Open `index.html` in a browser. | ブラウザで `index.html` を開きます。 | 使用瀏覽器開啟 `index.html`。 |
| 3 | Start a new game from the home screen. | ホーム画面から新規ゲームを開始します。 | 從首頁開始新遊戲。 |
| 4 | No install command, package manager, or build command is required. | インストール、パッケージマネージャ、ビルドコマンドは不要です。 | 不需要安裝指令、套件管理器或建置指令。 |

---

## Browser Support / ブラウザ対応 / 瀏覽器支援

| Browser | English | 日本語 | 中文 |
|---|---|---|---|
| Chrome | Recommended version: 90+ | 推奨バージョン: 90+ | 建議版本：90+ |
| Firefox | Recommended version: 88+ | 推奨バージョン: 88+ | 建議版本：88+ |
| Safari | Recommended version: 14+ | 推奨バージョン: 14+ | 建議版本：14+ |
| Edge | Recommended version: 90+ | 推奨バージョン: 90+ | 建議版本：90+ |
| Samsung Internet | Recommended version: 14+ | 推奨バージョン: 14+ | 建議版本：14+ |
