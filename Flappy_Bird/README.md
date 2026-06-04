# Flappy Bird

An HTML5 Canvas web game built with pure frontend technologies.

HTML5 Canvas と Vanilla JavaScript で作られた Web 版 Flappy Bird です。

使用 HTML5 Canvas、CSS3 與 Vanilla JavaScript 製作的網頁版 Flappy Bird 遊戲。

---

## Quick Navigation / クイックナビ / 快速導覽

| Section | English | 日本語 | 繁體中文 |
|---|---|---|---|
| [Game Introduction](#1-game-introduction--ゲーム紹介--遊戲介紹) | Game concept and goal | ゲーム内容と目的 | 遊戲概念與目標 |
| [How to Play](#2-how-to-play--操作方法--操作方式) | Controls and rules | 操作方法とルール | 操作方式與規則 |
| [Features](#3-features--機能--特色功能) | Main gameplay features | 主な機能 | 主要功能 |
| [Project Structure](#4-project-structure--構成--專案結構) | File overview | ファイル構成 | 檔案結構 |
| [Program Classification](#5-program-classification--プログラム分類--程式分類) | Code module details | コード分類詳細 | 程式分類詳細 |
| [Runtime Flow](#6-runtime-flow--実行フロー--執行流程) | Game lifecycle | 実行の流れ | 遊戲執行流程 |
| [Data and Parameters](#7-game-data-and-parameters--ゲームデータと設定--遊戲資料與參數) | Settings, scores, tuning values | 設定・スコア・調整値 | 設定、分數與參數 |
| [Run and Development](#8-run-and-development--実行と開発--執行與開發) | How to open and edit | 起動と開発方法 | 如何執行與開發 |

---

## 1. Game Introduction / ゲーム紹介 / 遊戲介紹

| Item | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Game type | Side-scrolling arcade survival game | 横スクロール型アーケードゲーム | 橫向卷軸生存類休閒遊戲 |
| Goal | Keep the bird flying and pass through pipes to score points. | 鳥を飛ばし続け、土管の間を通過してスコアを獲得します。 | 控制小鳥持續飛行，穿越水管間隙來取得分數。 |
| Failure condition | The game ends when the bird hits a pipe, the ceiling, or the ground. | 鳥が土管、上端、地面に当たるとゲーム終了です。 | 撞到水管、畫面上緣或地面時遊戲結束。 |
| Visual style | Bright sky, cartoon bird, moving clouds, green pipes, and animated ground. | 明るい空、カートゥーン風の鳥、流れる雲、緑の土管、動く地面。 | 明亮天空、卡通小鳥、移動雲朵、綠色水管與動態地面。 |
| Technical style | Single-page frontend game with no build step. | ビルド不要の単一ページ Frontend ゲーム。 | 不需要建置流程的單頁前端遊戲。 |

---

## 2. How to Play / 操作方法 / 操作方式

| Action | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Start | Click the start button on the main menu. | メインメニューのスタートボタンを押します。 | 點擊主選單的開始按鈕。 |
| Flap / Jump | Press `Space`, press `ArrowUp`, or tap/click the canvas. | `Space`、`ArrowUp`、または Canvas のタップ/クリックで羽ばたきます。 | 按 `Space`、`ArrowUp`，或點擊/觸控 Canvas 讓小鳥上升。 |
| Pause | Press `P`, press `Esc`, or click the pause button. | `P`、`Esc`、または一時停止ボタンで停止します。 | 按 `P`、`Esc`，或點擊暫停按鈕。 |
| Resume | Jump while paused, or click the pause button again. | 一時停止中にジャンプ操作、またはボタンを再度押して再開します。 | 暫停中再次跳躍，或再按一次暫停按鈕即可繼續。 |
| Score | Gain `+1` after fully passing each pipe pair. | 土管のペアを完全に通過すると `+1` 点です。 | 完整穿越一組水管後獲得 `+1` 分。 |
| Restart | Use the restart button on the game over screen. | ゲームオーバー画面のリスタートボタンを使います。 | 在 Game Over 畫面點擊重玩按鈕。 |

---

## 3. Features / 機能 / 特色功能

| Category | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Canvas gameplay | Real-time bird physics, pipe spawning, scrolling background, collision checks. | リアルタイム物理、土管生成、背景スクロール、衝突判定。 | 即時小鳥物理、水管生成、背景捲動與碰撞偵測。 |
| Difficulty | `easy`, `normal`, and `hard` change pipe gap, speed, gravity, and spawn interval. | `easy`、`normal`、`hard` により間隔、速度、重力、生成間隔が変化します。 | `easy`、`normal`、`hard` 會調整水管間距、速度、重力與生成頻率。 |
| Customization | Bird color palette, dark mode, SFX volume, BGM volume, vibration toggle. | 鳥の色、ダークモード、効果音音量、BGM 音量、バイブレーションを設定可能。 | 可調整小鳥顏色、深色模式、音效音量、背景音樂音量與震動。 |
| Audio | Uses Web Audio API for generated BGM and sound effects. | Web Audio API で BGM と効果音を生成します。 | 使用 Web Audio API 產生背景音樂與遊戲音效。 |
| Leaderboard | Saves top scores and best score in browser `localStorage`. | 上位スコアと最高点をブラウザの `localStorage` に保存します。 | 使用瀏覽器 `localStorage` 儲存排行榜與最高分。 |
| Feedback | Screen shake, flash, sound, high-score notice, optional vibration. | 画面揺れ、フラッシュ、音、高得点通知、任意の振動。 | 撞擊震動、白色閃光、音效、最高分提示與可選震動回饋。 |
| Responsive layout | Keeps a 2:3 game ratio and supports desktop/mobile screens. | 2:3 のゲーム比率を維持し、PC とモバイルに対応します。 | 維持 2:3 遊戲比例，支援桌面與手機畫面。 |

---

## 4. Project Structure / 構成 / 專案結構

| File | English | 日本語 | 繁體中文 |
|---|---|---|---|
| `index.html` | Main game file. Contains HTML, CSS, Canvas, and JavaScript. | メインゲームファイル。HTML、CSS、Canvas、JavaScript を含みます。 | 主要遊戲檔案，包含 HTML、CSS、Canvas 與 JavaScript。 |
| `flappy_bird_spec.md` | Original design/specification reference. | 元の設計仕様メモ。 | 原始遊戲設計與規格參考文件。 |
| `README.md` | Project documentation. | プロジェクト説明書。 | 專案說明文件。 |

This project is intentionally simple: the playable game is implemented in one HTML file and can run directly in a browser.

このプロジェクトはシンプルな構成です。プレイ可能なゲームは 1 つの HTML ファイルで実装されています。

此專案刻意保持簡單，完整可遊玩的遊戲都集中在單一 HTML 檔案中。

---

## 5. Program Classification / プログラム分類 / 程式分類

### 5.1 Top-Level HTML Classification / HTML 全体分類 / HTML 整體分類

| Area | Main content | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| `<head>` | Metadata, viewport, theme color, fonts, title | Browser setup and page metadata. | ブラウザ設定とページメタ情報。 | 瀏覽器設定、頁面資訊與字體載入。 |
| `<style>` | CSS variables, layout, UI screens, buttons, animations, responsive rules | Visual design and screen layout. | 見た目と画面レイアウトを管理。 | 控制整體視覺、畫面排版與動畫。 |
| `<canvas id="gameCanvas">` | 400 x 600 drawing surface | Main rendering surface for gameplay. | ゲーム描画の中心となる Canvas。 | 遊戲主畫面繪製區域。 |
| UI sections | Loading, menu, settings, leaderboard, HUD, game over | HTML overlay screens shown by scene state. | 状態に応じて表示される UI オーバーレイ。 | 依照遊戲狀態切換顯示的 UI 畫面。 |
| `<script>` | IIFE, constants, classes, event binding, game loop | Core game logic and runtime control. | ゲームロジックと実行制御。 | 核心遊戲邏輯與執行流程。 |

### 5.2 CSS Classification / CSS 分類 / CSS 分類

| CSS group | English | 日本語 | 繁體中文 |
|---|---|---|---|
| `:root` variables | Defines shared colors for sky, ground, pipes, buttons, overlays, and score text. | 空、地面、土管、ボタン、オーバーレイ、スコア文字の共通色を定義。 | 定義天空、地面、水管、按鈕、遮罩與分數文字等共用色彩。 |
| `body.dark` | Switches the page into dark mode by overriding CSS variables. | CSS 変数を上書きしてダークモードへ切り替え。 | 透過覆寫 CSS 變數切換深色模式。 |
| `.game-container` and `#gameCanvas` | Centers the game and keeps the canvas responsive. | ゲームを中央配置し、Canvas をレスポンシブ化。 | 置中遊戲畫面並維持 Canvas 響應式尺寸。 |
| `.screen` and `.screen.active` | Controls visible overlay screens. | 表示中のオーバーレイ画面を制御。 | 控制目前顯示的覆蓋式畫面。 |
| `.panel` | Shared dialog/card style for menu, settings, leaderboard, and game over. | メニュー、設定、ランキング、ゲームオーバー用の共通パネル。 | 主選單、設定、排行榜與結束畫面的共用面板樣式。 |
| `.btn`, `.icon-btn`, `.toggle`, `.seg`, `.swatch` | Button, icon, toggle, segmented control, and color swatch styles. | ボタン、アイコン、トグル、セグメント、色選択 UI。 | 按鈕、圖示按鈕、切換鈕、難度分段控制與色票樣式。 |
| `.hud-score` and `.pause-btn` | In-game score and pause UI. | プレイ中のスコアと一時停止 UI。 | 遊戲中分數與暫停按鈕 UI。 |
| `@keyframes` | Floating bird, button pulse, fade-in, shake, and flash effects. | 鳥の浮遊、ボタン点滅、フェード、揺れ、フラッシュ演出。 | 小鳥浮動、按鈕脈動、淡入、震動與閃光動畫。 |
| `@media` | Reduces spacing and button size on short screens. | 高さの低い画面で余白とボタンサイズを調整。 | 在較矮螢幕上縮小間距與按鈕尺寸。 |

### 5.3 JavaScript Constants / JavaScript 定数 / JavaScript 常數

| Name | English | 日本語 | 繁體中文 |
|---|---|---|---|
| `canvas`, `ctx` | Canvas element and 2D rendering context. | Canvas 要素と 2D 描画コンテキスト。 | Canvas 元素與 2D 繪圖內容。 |
| `screens` | References to all UI screens for scene switching. | 画面切り替え用 UI 参照。 | 所有 UI 畫面的 DOM 參照，用於場景切換。 |
| `birdPalettes` | Bird body, wing, and beak color sets. | 鳥の体、羽、くちばしの色セット。 | 小鳥身體、翅膀與鳥嘴的配色組。 |
| `difficultyMap` | Difficulty tuning values for gap, speed, gravity, and pipe spawn interval. | 難易度ごとの間隔、速度、重力、土管生成間隔。 | 各難度對應的間距、速度、重力與水管生成週期。 |

### 5.4 JavaScript Classes / JavaScript クラス / JavaScript 類別

| Class | Responsibility | English detail | 日本語詳細 | 繁體中文詳細 |
|---|---|---|---|---|
| `StorageManager` | Data persistence | Reads/writes settings, score list, and best score through `localStorage`. | `localStorage` を使い、設定・スコア一覧・最高点を保存/取得します。 | 透過 `localStorage` 儲存與讀取設定、排行榜與最高分。 |
| `AudioEngine` | Audio system | Creates BGM and SFX with Web Audio API, including flap, score, milestone, hit, die, high score, button, and swoosh sounds. | Web Audio API で BGM と効果音を生成します。羽ばたき、得点、節目、衝突、ゲームオーバー、高得点、ボタン音などに対応。 | 使用 Web Audio API 產生 BGM 與音效，包含跳躍、得分、里程碑、撞擊、死亡、最高分、按鈕與切換音。 |
| `SceneManager` | Screen switching | Shows selected UI screens and hides the rest. | 指定された画面だけを表示し、他を非表示にします。 | 顯示指定畫面並隱藏其他畫面。 |
| `GameEngine` | Core gameplay | Handles game state, physics, pipe spawning, scoring, collision detection, rendering, pause/resume, and game over. | ゲーム状態、物理、土管生成、得点、衝突判定、描画、一時停止、ゲーム終了を管理。 | 管理遊戲狀態、物理、水管生成、計分、碰撞、繪製、暫停與結束流程。 |

### 5.5 Main Functions / 主要関数 / 主要函式

| Function | English | 日本語 | 繁體中文 |
|---|---|---|---|
| `getCss(name)` | Reads CSS variable values for Canvas drawing. | Canvas 描画用に CSS 変数を取得します。 | 讀取 CSS 變數，供 Canvas 繪圖使用。 |
| `resizeCanvas()` | Calculates responsive display size and refreshes rendering. | 画面サイズに合わせて表示サイズを計算し、描画を更新します。 | 依照視窗大小計算顯示尺寸並重新繪製。 |
| `renderMenuData()` | Updates best score on the main menu. | メニュー上の最高点を更新します。 | 更新主選單顯示的最高分。 |
| `renderScores()` | Renders the stored leaderboard list. | 保存されたランキングを描画します。 | 顯示已儲存的排行榜資料。 |
| `applySettings()` | Applies saved settings to UI, audio, theme, and game rendering. | 保存設定を UI、音量、テーマ、描画へ反映します。 | 將設定套用到 UI、音量、主題與遊戲畫面。 |
| `updateSetting(key, value)` | Saves one setting and reapplies all settings. | 1 つの設定を保存し、全設定を再適用します。 | 更新單一設定後重新套用全部設定。 |
| `bindUI()` | Connects buttons, sliders, keyboard, pointer, and touch events. | ボタン、スライダー、キーボード、ポインター、タッチイベントを接続します。 | 綁定按鈕、滑桿、鍵盤、點擊與觸控事件。 |
| `gameLoop(timestamp)` | Runs the frame loop with `requestAnimationFrame`. | `requestAnimationFrame` で毎フレーム更新します。 | 使用 `requestAnimationFrame` 執行遊戲主循環。 |
| `fakeLoading()` | Displays a short loading progress before the menu. | メニュー前に短いローディング表示を行います。 | 在進入主選單前顯示載入進度。 |

---

## 6. Runtime Flow / 実行フロー / 執行流程

| Step | English | 日本語 | 繁體中文 |
|---|---|---|---|
| 1 | Browser loads `index.html`, CSS, fonts, Canvas, and UI sections. | ブラウザが `index.html`、CSS、フォント、Canvas、UI を読み込みます。 | 瀏覽器載入 `index.html`、CSS、字體、Canvas 與 UI 區塊。 |
| 2 | JavaScript creates `StorageManager`, `AudioEngine`, `SceneManager`, and `GameEngine`. | JavaScript が各 Manager と `GameEngine` を生成します。 | JavaScript 建立資料、音效、場景與遊戲引擎。 |
| 3 | UI events are bound and saved settings are applied. | UI イベントを登録し、保存済み設定を反映します。 | 綁定 UI 事件並套用已儲存設定。 |
| 4 | Loading screen runs, then switches to the main menu. | ローディング後、メインメニューへ切り替わります。 | 顯示載入畫面後切換到主選單。 |
| 5 | Starting the game resets score, pipes, timers, and bird position. | 開始時にスコア、土管、タイマー、鳥位置をリセットします。 | 開始遊戲時重設分數、水管、計時器與小鳥位置。 |
| 6 | Each frame updates physics, pipes, background, score, collision, and drawing. | 毎フレームで物理、土管、背景、得点、衝突、描画を更新します。 | 每幀更新物理、水管、背景、分數、碰撞與畫面繪製。 |
| 7 | On collision, the game saves score, plays feedback, and shows game over. | 衝突時にスコア保存、演出再生、ゲームオーバー表示を行います。 | 發生碰撞後儲存分數、播放回饋並顯示 Game Over。 |

---

## 7. Game Data and Parameters / ゲームデータと設定 / 遊戲資料與參數

### 7.1 Difficulty Parameters / 難易度パラメータ / 難度參數

| Difficulty | Pipe gap | Base speed | Gravity | Spawn interval | English | 日本語 | 繁體中文 |
|---|---:|---:|---:|---:|---|---|---|
| `easy` | `160` | `2` | `0.28` | `118` | Wider gaps and slower movement. | 広い間隔で低速。 | 水管間距較寬、速度較慢。 |
| `normal` | `130` | `3` | `0.35` | `104` | Balanced default mode. | 標準的なバランス。 | 預設平衡難度。 |
| `hard` | `100` | `4` | `0.42` | `90` | Narrow gaps, faster speed, stronger gravity. | 狭い間隔、高速、強めの重力。 | 間距較窄、速度較快、重力較強。 |

The game also adds a speed bonus every 10 points.

スコアが 10 点増えるごとに速度ボーナスが加算されます。

遊戲每增加 10 分會額外提高速度。

### 7.2 Stored Data / 保存データ / 儲存資料

| Key | Stored value | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| `flappybird_settings` | Object | SFX volume, BGM volume, bird color, difficulty, dark mode, vibration. | 効果音音量、BGM 音量、鳥の色、難易度、ダークモード、振動。 | 音效音量、背景音樂音量、小鳥顏色、難度、深色模式與震動。 |
| `flappybird_scores` | Array | Top score list, sorted from high to low, up to 10 records. | 高い順に並んだ最大 10 件のスコア。 | 由高到低排序的排行榜，最多 10 筆。 |
| `flappybird_best` | Number | Best score shortcut value. | 最高点の値。 | 最高分數值。 |

### 7.3 Bird Color Palettes / 鳥カラーパレット / 小鳥配色

| Palette | Main color | Wing color | Beak/accent | English | 日本語 | 繁體中文 |
|---|---|---|---|---|---|---|
| `yellow` | `#FFD700` | `#FFF8DC` | `#FF8C00` | Classic default bird. | 標準の黄色い鳥。 | 經典預設黃色小鳥。 |
| `red` | `#FF4444` | `#FFE0E0` | `#CC0000` | Red variation. | 赤色バリエーション。 | 紅色版本。 |
| `blue` | `#4488FF` | `#E0EEFF` | `#0044CC` | Blue variation. | 青色バリエーション。 | 藍色版本。 |
| `green` | `#44CC44` | `#E0FFE0` | `#006600` | Green variation. | 緑色バリエーション。 | 綠色版本。 |
| `purple` | `#AA44FF` | `#EEE0FF` | `#660099` | Purple variation. | 紫色バリエーション。 | 紫色版本。 |

---

## 8. Run and Development / 実行と開発 / 執行與開發

| Topic | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Requirement | A modern browser that supports HTML5 Canvas, Web Audio API, and `localStorage`. | HTML5 Canvas、Web Audio API、`localStorage` に対応したブラウザ。 | 支援 HTML5 Canvas、Web Audio API 與 `localStorage` 的現代瀏覽器。 |
| Run locally | Open `index.html` directly in a browser. No install step is required. | `index.html` をブラウザで直接開きます。インストール不要です。 | 直接用瀏覽器開啟 `index.html`，不需要安裝套件。 |
| Build step | None. This is a pure frontend single-file project. | ありません。純粋なフロントエンド単一ファイル構成です。 | 無建置流程，是純前端單檔專案。 |
| Main edit target | Most game behavior is inside the `<script>` section of `index.html`. | 主な挙動は `index.html` の `<script>` 内にあります。 | 大部分遊戲行為都在 `index.html` 的 `<script>` 區塊。 |
| Main style target | Visual design is inside the `<style>` section of `index.html`. | 見た目は `index.html` の `<style>` 内にあります。 | 視覺樣式都在 `index.html` 的 `<style>` 區塊。 |

---

## 9. Customization Guide / カスタマイズ / 客製化方向

| Goal | Where to edit | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| Change bird colors | `birdPalettes` | Add or edit palette arrays. | パレット配列を追加・編集します。 | 新增或修改小鳥配色陣列。 |
| Change difficulty | `difficultyMap` | Tune gap, speed, gravity, or spawn interval. | 間隔、速度、重力、生成間隔を調整します。 | 調整水管間距、速度、重力或生成週期。 |
| Change sound | `AudioEngine.playSFX()` and `AudioEngine.playBGM()` | Modify generated tones and note patterns. | 生成音と音階パターンを変更します。 | 修改音效頻率、波形與背景音旋律。 |
| Change visuals | Canvas draw methods in `GameEngine` | Edit `drawBackground`, `drawPipes`, `drawGround`, or `drawBird`. | `drawBackground`、`drawPipes`、`drawGround`、`drawBird` を編集します。 | 修改背景、水管、地面或小鳥的 Canvas 繪製邏輯。 |
| Change UI text/layout | HTML sections and CSS classes | Edit overlay sections and shared UI classes. | オーバーレイ HTML と共通 UI クラスを編集します。 | 修改 HTML 覆蓋畫面與共用 CSS 樣式。 |
| Change saved data behavior | `StorageManager` | Adjust keys, defaults, ranking size, or reset logic. | キー、初期値、ランキング件数、リセット処理を変更します。 | 調整儲存 key、預設值、排行榜數量或清除邏輯。 |

---

## 10. Browser Notes / ブラウザ注意点 / 瀏覽器注意事項

| Topic | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Audio start | Some browsers only allow audio after the first user interaction. | 一部ブラウザでは、最初のユーザー操作後にのみ音が再生されます。 | 部分瀏覽器只允許在第一次使用者互動後播放音效。 |
| Saved data | Scores and settings are stored per browser and per domain/path. | スコアと設定はブラウザおよびドメイン/パスごとに保存されます。 | 分數與設定會依瀏覽器及網域/路徑分開儲存。 |
| Mobile input | Touch movement is prevented to reduce accidental page scrolling. | 誤スクロールを防ぐため、タッチ移動を抑制しています。 | 已阻止觸控滑動以減少手機上誤捲動。 |
