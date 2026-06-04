# Gomoku | 五子棋 | 五目並べ

Vanilla JavaScript Gomoku game with a 15 x 15 canvas board, human-vs-AI play, undo, pause, theme settings, Web Audio sound, and local records.

## Language Index

| Language | Section |
|---|---|
| English | [English README](#english-readme) |
| 日本語 | [日本語 README](#日本語-readme) |
| 繁體中文 | [繁體中文 README](#繁體中文-readme) |

## Quick Overview

| Item | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Game type | Gomoku, human vs AI | 五目並べ、人間 vs AI | 五子棋，玩家對 AI |
| Board | 15 x 15 intersections | 15 x 15 の交点 | 15 x 15 棋盤交點 |
| First move | Human plays black first | プレイヤーが黒石で先手 | 玩家黑子先行 |
| Win rule | Connect five stones in a row | 5 つ連続で勝利 | 任一方向連成五子即勝 |
| Frontend | HTML5, CSS3, Vanilla JS | HTML5、CSS3、Vanilla JS | HTML5、CSS3、原生 JavaScript |
| Rendering | Canvas API | Canvas API | Canvas API |
| Sound | Web Audio API | Web Audio API | Web Audio API |
| Storage | localStorage | localStorage | localStorage |

---

# English README

## Game Introduction

This project is a browser-based Gomoku game. The player uses black stones and moves first, while the AI uses white stones. A player wins by placing five stones in a continuous line horizontally, vertically, or diagonally.

| Category | Description |
|---|---|
| Main goal | Create a readable, responsive, and playable Gomoku experience in a single static web project. |
| Player mode | Human player vs AI opponent. |
| Game flow | Main menu, game board, settings, pause dialog, and result screen. |
| Deployment style | Static website. Open `index.html` directly or serve the folder with any static server. |

## Main Features

| Feature | Detail |
|---|---|
| 15 x 15 board | Canvas-rendered board with coordinates A-O and 1-15. |
| Human vs AI | Human plays black. AI plays white. |
| AI difficulty | Easy, Normal, and Hard. |
| Undo | Up to 3 undo actions per game. When undoing after the AI move, both the AI move and the previous human move are removed. |
| Pause system | Pause, resume, restart, or return to the main menu. |
| Result screen | Shows game time, move count, and win/loss/draw record. |
| Theme setting | Light and dark themes through CSS variables. |
| Audio | Procedural background music and sound effects using Web Audio API. |
| Persistence | Settings and records are saved in `localStorage`. |
| Input support | Mouse click and touch input are both supported. |

## How To Run

| Method | Command or Action | Notes |
|---|---|---|
| Direct open | Open `index.html` in a browser | Works because the project has no build step. |
| Static server | `python -m http.server` | Optional, useful for local testing. |
| Browser support | Chrome, Edge, Firefox, Safari | Requires Canvas and Web Audio support for the full experience. |

## Project Structure

| Path | Type | Responsibility |
|---|---|---|
| `index.html` | HTML entry | Defines all screens, buttons, sliders, canvas, modal, and toast targets. |
| `css/styles.css` | Stylesheet | Handles layout, themes, responsive rules, buttons, board frame, modal, animations, and visual tokens. |
| `js/main.js` | Game script | Contains settings, statistics, audio, game state, board rendering, AI, UI updates, and event binding. |
| `Gomoku_spec.md` | Specification | Design and implementation reference document for the project. |
| `README.md` | Documentation | Multilingual game and code guide. |

## Program Classification

| Module / Area | File | Main Responsibility | Important APIs / Concepts |
|---|---|---|---|
| Screen markup | `index.html` | Provides semantic sections for main menu, game, settings, result, pause modal, and toast. | DOM IDs, buttons, range inputs, canvas |
| Layout and theme | `css/styles.css` | Defines responsive UI, CSS variables, light/dark theme, board container, controls, and animations. | CSS custom properties, media queries, transitions |
| Constants and defaults | `js/main.js` | Defines board size, player IDs, default settings, and default stats. | `BOARD_SIZE`, `HUMAN`, `AI`, `DEFAULT_SETTINGS` |
| `SettingsManager` | `js/main.js` | Loads, saves, and applies difficulty, theme, BGM volume, and SFX volume. | `localStorage`, CSS theme attribute |
| `StatsManager` | `js/main.js` | Loads, saves, and updates win/loss/draw records. | `localStorage` |
| `AudioManager` | `js/main.js` | Creates procedural BGM and sound effects. | `AudioContext`, oscillator nodes, gain nodes |
| `GameLogic` | `js/main.js` | Owns board state, move history, turn status, undo count, timer, winner, and win cells. | 2D board array, state machine |
| `BoardView` | `js/main.js` | Renders board lines, star points, coordinates, stones, last move marker, and win highlight. | Canvas API, device pixel ratio |
| `AIEngine` | `js/main.js` | Chooses AI moves by tactical checks, candidate search, minimax, and evaluation scoring. | Minimax, alpha-beta pruning, heuristic scoring |
| `UI` | `js/main.js` | Switches screens, updates status text, shows toast messages, and displays result data. | DOM manipulation |
| Helper functions | `js/main.js` | Implements win detection, board scanning, line evaluation, fallback moves, and formatting. | `checkWin`, `terminalWinner`, `evaluateLine`, `formatTime` |
| Event binding | `js/main.js` | Connects buttons, canvas click/touch, sliders, settings controls, and visibility resume behavior. | `addEventListener` |

## Game State Model

| State Field | Meaning |
|---|---|
| `board` | 15 x 15 matrix. `0` means empty, `1` means human, `2` means AI. |
| `status` | Current game status, such as `PLAYING`, `AI_THINKING`, `PAUSED`, or `RESULT`. |
| `currentPlayer` | Current active player. The human player is restored after undo. |
| `moveHistory` | Ordered move records with row, column, player, and time. |
| `undoCount` | Remaining undo count. Default is 3. |
| `startTime` | Timestamp for timer calculation. |
| `elapsedBeforePause` | Time accumulated before pause. |
| `winner` | Human, AI, or draw result. |
| `winCells` | The five cells used to draw the winning line. |
| `lastMove` | Last placed stone, used for the red marker. |

## AI Logic

| Step | Behavior |
|---|---|
| 1. Tactical check | AI first searches for an immediate winning move, then searches for a move that blocks the human's immediate win. |
| 2. Candidate generation | Only empty cells within a small radius around existing stones are considered. This keeps AI calculation practical. |
| 3. Difficulty handling | Easy uses weighted random choice. Normal uses minimax depth 2. Hard uses minimax depth 4. |
| 4. Scoring | Scores attack value, defense value, open ends, five-in-a-row threats, and center control. |
| 5. Alpha-beta pruning | Reduces minimax search branches for faster decision making. |
| 6. Timeout fallback | If AI thinking exceeds the timeout, the game falls back to a center-oriented move. |

## UI Screens

| Screen | HTML ID | Purpose |
|---|---|---|
| Main menu | `screen-main` | Start the game or open settings. |
| Game | `screen-game` | Shows players, turn badge, canvas board, move statistics, undo, and pause. |
| Settings | `screen-settings` | Adjust AI difficulty, BGM volume, SFX volume, and theme. |
| Result | `screen-result` | Shows winner, time, moves, and saved record. |
| Pause modal | `pause-modal` | Resume, restart, or return to main menu. |
| Toast | `toast` | Displays short feedback for invalid moves or setting changes. |

---

# 日本語 README

## ゲーム紹介

このプロジェクトはブラウザで遊べる五目並べです。プレイヤーは黒石で先手、AI は白石で後手です。縦、横、斜めのいずれかで 5 つの石を連続して並べると勝利します。

| 分類 | 内容 |
|---|---|
| 目的 | 読みやすく、レスポンシブで、すぐ遊べる静的 Web 五目並べを作ること。 |
| 対戦形式 | プレイヤー vs AI。 |
| 画面構成 | メインメニュー、対局画面、設定画面、一時停止ダイアログ、結果画面。 |
| 実行形式 | 静的サイト。`index.html` を直接開くか、任意の静的サーバーで配信できます。 |

## 主な機能

| 機能 | 詳細 |
|---|---|
| 15 x 15 盤 | Canvas で描画され、A-O と 1-15 の座標を表示します。 |
| 人間 vs AI | プレイヤーは黒石、AI は白石です。 |
| AI 難易度 | Easy、Normal、Hard を選択できます。 |
| 待った | 1 局につき最大 3 回。AI の手の直後は AI の手と直前のプレイヤーの手を戻します。 |
| 一時停止 | 再開、再スタート、メインメニューへ戻る操作に対応します。 |
| 結果画面 | 対局時間、総手数、勝敗記録を表示します。 |
| テーマ | CSS 変数によるライトテーマとダークテーマ。 |
| 音声 | Web Audio API で BGM と効果音を生成します。 |
| 保存 | 設定と戦績を `localStorage` に保存します。 |
| 入力 | マウスクリックとタッチ操作に対応します。 |

## 実行方法

| 方法 | 操作 / コマンド | 補足 |
|---|---|---|
| 直接開く | ブラウザで `index.html` を開く | ビルド不要です。 |
| 静的サーバー | `python -m http.server` | ローカル確認用に任意で使えます。 |
| 対応ブラウザ | Chrome、Edge、Firefox、Safari | Canvas と Web Audio が使える環境を推奨します。 |

## プロジェクト構成

| パス | 種類 | 役割 |
|---|---|---|
| `index.html` | HTML エントリ | 画面、ボタン、スライダー、Canvas、モーダル、トーストの DOM を定義します。 |
| `css/styles.css` | スタイル | レイアウト、テーマ、レスポンシブ対応、ボタン、盤面枠、モーダル、アニメーションを担当します。 |
| `js/main.js` | ゲーム処理 | 設定、戦績、音声、ゲーム状態、盤面描画、AI、UI 更新、イベント登録をまとめています。 |
| `Gomoku_spec.md` | 仕様書 | プロジェクトの設計と実装方針の参考資料です。 |
| `README.md` | ドキュメント | 多言語のゲーム説明とコード分類です。 |

## プログラム分類

| モジュール / 領域 | ファイル | 主な責務 | 重要な API / 概念 |
|---|---|---|---|
| 画面マークアップ | `index.html` | メニュー、対局、設定、結果、一時停止、トーストの構造を定義します。 | DOM ID、button、range input、canvas |
| レイアウトとテーマ | `css/styles.css` | レスポンシブ UI、CSS 変数、ライト / ダークテーマ、盤面、操作部品、アニメーションを管理します。 | CSS custom properties、media queries、transitions |
| 定数と初期値 | `js/main.js` | 盤面サイズ、プレイヤー ID、初期設定、初期戦績を定義します。 | `BOARD_SIZE`, `HUMAN`, `AI`, `DEFAULT_SETTINGS` |
| `SettingsManager` | `js/main.js` | 難易度、テーマ、BGM 音量、効果音音量の読み込み、保存、反映を行います。 | `localStorage`, theme attribute |
| `StatsManager` | `js/main.js` | 勝ち、負け、引き分けの記録を読み込み、保存、更新します。 | `localStorage` |
| `AudioManager` | `js/main.js` | BGM と効果音をプログラムで生成します。 | `AudioContext`, oscillator, gain |
| `GameLogic` | `js/main.js` | 盤面、手順履歴、状態、待った回数、タイマー、勝者、勝利ラインを管理します。 | 2D board array, state machine |
| `BoardView` | `js/main.js` | 盤線、星、座標、石、最終手マーカー、勝利ラインを描画します。 | Canvas API, device pixel ratio |
| `AIEngine` | `js/main.js` | 戦術確認、候補手生成、minimax、評価関数で AI の手を決定します。 | Minimax, alpha-beta pruning, heuristic scoring |
| `UI` | `js/main.js` | 画面切り替え、状態表示、トースト、結果表示を行います。 | DOM manipulation |
| ヘルパー関数 | `js/main.js` | 勝利判定、盤面走査、ライン評価、代替手、時間表示を処理します。 | `checkWin`, `terminalWinner`, `evaluateLine`, `formatTime` |
| イベント登録 | `js/main.js` | ボタン、Canvas、タッチ、スライダー、設定 UI、表示復帰を接続します。 | `addEventListener` |

## ゲーム状態モデル

| フィールド | 意味 |
|---|---|
| `board` | 15 x 15 の配列。`0` は空、`1` はプレイヤー、`2` は AI です。 |
| `status` | `PLAYING`、`AI_THINKING`、`PAUSED`、`RESULT` などの現在状態です。 |
| `currentPlayer` | 現在の手番です。待った後はプレイヤーに戻します。 |
| `moveHistory` | 行、列、プレイヤー、時刻を含む手順履歴です。 |
| `undoCount` | 残りの待った回数です。初期値は 3 です。 |
| `startTime` | タイマー計算用の開始時刻です。 |
| `elapsedBeforePause` | 一時停止前までに経過した時間です。 |
| `winner` | プレイヤー、AI、または引き分けを表します。 |
| `winCells` | 勝利ラインを描画する 5 つのセルです。 |
| `lastMove` | 最終手マーカーのための直近の手です。 |

## AI ロジック

| 手順 | 内容 |
|---|---|
| 1. 戦術確認 | AI はまず即勝ちの手を探し、次にプレイヤーの即勝ちを防ぐ手を探します。 |
| 2. 候補手生成 | 既存の石の近くにある空きマスだけを候補にして、計算量を抑えます。 |
| 3. 難易度 | Easy は重み付きランダム、Normal は深さ 2 の minimax、Hard は深さ 4 の minimax を使います。 |
| 4. 評価 | 攻撃、守備、開放端、五連の脅威、中央制圧をスコア化します。 |
| 5. 枝刈り | alpha-beta pruning で探索量を減らします。 |
| 6. タイムアウト対策 | AI の計算が長すぎる場合は中央寄りの代替手を返します。 |

## UI 画面

| 画面 | HTML ID | 目的 |
|---|---|---|
| メインメニュー | `screen-main` | 対局開始または設定画面を開きます。 |
| 対局画面 | `screen-game` | プレイヤー情報、手番、盤面、手数、待った、一時停止を表示します。 |
| 設定画面 | `screen-settings` | AI 難易度、BGM、効果音、テーマを調整します。 |
| 結果画面 | `screen-result` | 勝者、時間、手数、保存済み戦績を表示します。 |
| 一時停止 | `pause-modal` | 再開、再スタート、メインメニューへ戻る操作を提供します。 |
| トースト | `toast` | 不正な手や設定保存などの短い通知を表示します。 |

---

# 繁體中文 README

## 遊戲介紹

這是一個瀏覽器版五子棋專案。玩家使用黑子並先手，AI 使用白子後手。只要在橫向、直向或任一斜向連成五顆同色棋子，即可獲勝。

| 分類 | 說明 |
|---|---|
| 專案目標 | 建立一個不需建置、可直接遊玩、版面清楚且支援響應式的五子棋網頁遊戲。 |
| 對戰模式 | 玩家 vs AI。 |
| 畫面流程 | 主選單、棋局畫面、設定畫面、暫停視窗、結果畫面。 |
| 執行方式 | 靜態網站。可直接開啟 `index.html`，也可用任意靜態伺服器啟動。 |

## 主要功能

| 功能 | 詳細說明 |
|---|---|
| 15 x 15 棋盤 | 使用 Canvas 繪製棋盤，並顯示 A-O 與 1-15 座標。 |
| 玩家對 AI | 玩家為黑子，AI 為白子。 |
| AI 難度 | 支援 Easy、Normal、Hard 三種難度。 |
| 悔棋 | 每局最多 3 次。若剛下完 AI 手，悔棋會同時移除 AI 手與上一手玩家棋。 |
| 暫停系統 | 可暫停、繼續、重新開始或回到主選單。 |
| 結果畫面 | 顯示對局時間、總步數與勝敗和紀錄。 |
| 主題設定 | 透過 CSS 變數支援亮色與暗色主題。 |
| 音效與音樂 | 使用 Web Audio API 產生背景音樂與操作音效。 |
| 資料保存 | 設定與戰績會儲存在 `localStorage`。 |
| 操作支援 | 支援滑鼠點擊與觸控操作。 |

## 如何執行

| 方法 | 操作 / 指令 | 備註 |
|---|---|---|
| 直接開啟 | 用瀏覽器開啟 `index.html` | 專案沒有建置流程。 |
| 靜態伺服器 | `python -m http.server` | 可選，用於本機測試。 |
| 建議瀏覽器 | Chrome、Edge、Firefox、Safari | 建議使用支援 Canvas 與 Web Audio 的瀏覽器。 |

## 專案結構

| 路徑 | 類型 | 負責內容 |
|---|---|---|
| `index.html` | HTML 入口 | 定義所有畫面、按鈕、滑桿、Canvas、暫停視窗與 toast 容器。 |
| `css/styles.css` | 樣式表 | 控制版面、主題、響應式、按鈕、棋盤容器、彈窗、動畫與視覺變數。 |
| `js/main.js` | 遊戲主程式 | 包含設定、戰績、音效、遊戲狀態、棋盤繪製、AI、UI 更新與事件綁定。 |
| `Gomoku_spec.md` | 規格文件 | 專案設計與實作方向的參考文件。 |
| `README.md` | 說明文件 | 三語版遊戲介紹與程式分類說明。 |

## 程式分類詳細介紹

| 模組 / 區域 | 檔案 | 主要職責 | 重要 API / 概念 |
|---|---|---|---|
| 畫面結構 | `index.html` | 建立主選單、棋局、設定、結果、暫停視窗與 toast 的 DOM 結構。 | DOM ID、button、range input、canvas |
| 版面與主題 | `css/styles.css` | 定義響應式版面、CSS 變數、亮暗主題、棋盤外框、控制列與動畫。 | CSS custom properties、media queries、transitions |
| 常數與預設值 | `js/main.js` | 定義棋盤尺寸、玩家編號、預設設定與預設戰績。 | `BOARD_SIZE`, `HUMAN`, `AI`, `DEFAULT_SETTINGS` |
| `SettingsManager` | `js/main.js` | 讀取、儲存與套用 AI 難度、主題、背景音量、音效音量。 | `localStorage`, theme attribute |
| `StatsManager` | `js/main.js` | 讀取、儲存與更新勝、敗、和紀錄。 | `localStorage` |
| `AudioManager` | `js/main.js` | 透過程式產生背景音樂與操作音效。 | `AudioContext`, oscillator, gain |
| `GameLogic` | `js/main.js` | 管理棋盤狀態、落子紀錄、目前狀態、悔棋次數、計時、勝者與勝利線。 | 2D board array, state machine |
| `BoardView` | `js/main.js` | 繪製棋盤線、星位、座標、棋子、最後一步標記與勝利連線。 | Canvas API, device pixel ratio |
| `AIEngine` | `js/main.js` | 透過戰術判斷、候選點、minimax 與評分函式決定 AI 下法。 | Minimax, alpha-beta pruning, heuristic scoring |
| `UI` | `js/main.js` | 切換畫面、更新狀態文字、顯示 toast、呈現結果資料。 | DOM manipulation |
| 輔助函式 | `js/main.js` | 處理勝利判定、棋盤掃描、線段評分、備用落點與時間格式化。 | `checkWin`, `terminalWinner`, `evaluateLine`, `formatTime` |
| 事件綁定 | `js/main.js` | 連接按鈕、Canvas 點擊 / 觸控、滑桿、設定分段按鈕與音訊恢復。 | `addEventListener` |

## 遊戲狀態模型

| 欄位 | 說明 |
|---|---|
| `board` | 15 x 15 二維陣列。`0` 代表空格，`1` 代表玩家，`2` 代表 AI。 |
| `status` | 目前狀態，例如 `PLAYING`、`AI_THINKING`、`PAUSED`、`RESULT`。 |
| `currentPlayer` | 目前行動方。悔棋後會回到玩家回合。 |
| `moveHistory` | 依序保存每一步的列、欄、玩家與時間。 |
| `undoCount` | 剩餘悔棋次數，預設為 3。 |
| `startTime` | 計算對局時間用的起始時間。 |
| `elapsedBeforePause` | 暫停前已累積的時間。 |
| `winner` | 玩家、AI 或平手結果。 |
| `winCells` | 用來繪製勝利連線的五個格點。 |
| `lastMove` | 最近一步，用來繪製紅色提示標記。 |

## AI 邏輯

| 步驟 | 行為說明 |
|---|---|
| 1. 戰術檢查 | AI 會先找自己是否能立即獲勝，再找是否需要阻擋玩家立即獲勝。 |
| 2. 候選點生成 | 只評估既有棋子附近的空格，避免全棋盤暴力搜尋。 |
| 3. 難度差異 | Easy 使用加權隨機；Normal 使用深度 2 minimax；Hard 使用深度 4 minimax。 |
| 4. 評分方式 | 綜合攻擊、防守、開放端、五連威脅與中央控制權計算分數。 |
| 5. Alpha-beta 剪枝 | 在 minimax 搜尋中減少不必要分支，加快 AI 決策。 |
| 6. 逾時備援 | 若 AI 思考超過限制，會回傳偏向中央的備用落點。 |

## UI 畫面分類

| 畫面 | HTML ID | 用途 |
|---|---|---|
| 主選單 | `screen-main` | 開始遊戲或進入設定。 |
| 棋局畫面 | `screen-game` | 顯示玩家資訊、回合、棋盤、步數、悔棋與暫停。 |
| 設定畫面 | `screen-settings` | 調整 AI 難度、背景音量、音效音量與主題。 |
| 結果畫面 | `screen-result` | 顯示勝者、時間、步數與保存的戰績。 |
| 暫停視窗 | `pause-modal` | 提供繼續、重新開始或回主選單。 |
| Toast | `toast` | 顯示非法落子、設定儲存等短訊息。 |

## 開發備註

| 項目 | 說明 |
|---|---|
| 無框架 | 專案使用原生 HTML、CSS、JavaScript，沒有 npm 依賴。 |
| 無建置流程 | 修改後可直接重新整理瀏覽器查看結果。 |
| 模組形式 | 目前以單一 `main.js` 中的物件模組切分責任，易於在小型專案中維護。 |
| 可擴充方向 | 可拆分 ES modules、加入雙人模式、加入禁手規則、增加開局庫或更完整測試。 |
