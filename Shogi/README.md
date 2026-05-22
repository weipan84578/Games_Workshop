# Shogi Web Game / WEB 將棋遊戲 / 将棋Webゲーム

## English

### Overview

This folder contains a no-build, pure frontend Shogi game. It runs directly from `index.html` with HTML, CSS, and vanilla JavaScript. No npm packages, bundlers, servers, or CDN assets are required.

### How To Run

Open `index.html` in a browser. Chrome, Edge, Firefox, and Safari are expected to work.

### Program Structure

- `index.html`: Application shell, screens, controls, board container, hand panels, kifu panel, and modals.
- `css/reset.css`: Minimal reset for consistent browser rendering.
- `css/variables.css`: Theme colors, font stacks, and shared design tokens.
- `css/layout.css`: Main menu, screen layout, desktop game layout, side panels, and scroll behavior.
- `css/board.css`: 9x9 board grid, square states, legal move hints, last move, coordinates, and star points.
- `css/pieces.css`: Shogi piece shape, promoted color, hand pieces, and count badges.
- `css/ui.css`: Buttons, settings form, rules panel, modal, and thinking overlay.
- `css/animations.css`: Fade, spinner, check warning, and piece interaction animations.
- `css/mobile.css`: Responsive layout, mobile board sizing, hand layout, and kifu drawer.
- `js/main.js`: The complete playable implementation. It includes screen routing, state management, legal move generation, drops, promotion, check/checkmate detection, AI, kifu, localStorage, AI thinking time, and Web Audio.
- `js/game/*`, `js/ai/*`, `js/ui/*`, `js/audio/*`, `js/utils/*`: Placeholder files kept to match the spec structure. The current no-build version keeps runtime code in `js/main.js`.
- `shogi_spec.md`: Original implementation specification.

### Main Code Categories

- State: `createInitialState`, `saveGame`, `loadJson`, `undoStack`, and player side settings maintain the game state.
- Rules: `generateLegalMoves`, `generatePseudoMoves`, `directionsFor`, `isInCheck`, and drop validators implement Shogi rules.
- AI: `findBestMove`, `minimax`, `evaluate`, and move sorting implement a bounded alpha-beta search. The AI uses the side opposite the player and waits according to difficulty: Beginner 2s, Easy 4s, Medium 4-7s, Hard 5-10s.
- UI: `renderBoard`, `renderHands`, `renderKifu`, `showScreen`, and modal helpers update the DOM.
- Audio: `createAudioManager` generates menu music, game music, and sound effects with Web Audio API.

## 中文

### 概覽

本資料夾是一款免建置的純前端 WEB 將棋遊戲。直接開啟 `index.html` 即可遊玩，不需要 npm、打包工具、伺服器或 CDN 資源。

### 執行方式

使用瀏覽器開啟 `index.html`。預期可在 Chrome、Edge、Firefox、Safari 執行。

### 程式結構

- `index.html`：應用主殼層、畫面、控制按鈕、棋盤容器、持駒區、棋譜欄與彈窗。
- `css/reset.css`：基礎 reset，降低瀏覽器預設樣式差異。
- `css/variables.css`：主題色、字體與共用設計變數。
- `css/layout.css`：主選單、畫面切換、桌機遊戲版面、側欄與捲動行為。
- `css/board.css`：9x9 棋盤格線、格子狀態、合法手提示、最後一手、座標與星位。
- `css/pieces.css`：棋子五邊形外觀、升變色、持駒棋子與數量角標。
- `css/ui.css`：按鈕、設定表單、規則說明、Modal 與 AI 思考遮罩。
- `css/animations.css`：淡入、旋轉、王手警示與棋子互動動畫。
- `css/mobile.css`：RWD、手機棋盤尺寸、持駒排列與棋譜抽屜。
- `js/main.js`：完整可玩版本。包含畫面切換、狀態管理、合法手、打入、升變、王手/詰將、AI、棋譜、localStorage、AI 思考時間與 Web Audio。
- `js/game/*`、`js/ai/*`、`js/ui/*`、`js/audio/*`、`js/utils/*`：保留規格書要求的模組結構。現階段為了維持雙擊可玩，執行邏輯集中在 `js/main.js`。
- `shogi_spec.md`：原始規格書。

### 主要程式分類

- 狀態管理：`createInitialState`、`saveGame`、`loadJson`、`undoStack` 與玩家先後手設定負責棋局資料。
- 規則引擎：`generateLegalMoves`、`generatePseudoMoves`、`directionsFor`、`isInCheck` 與打入驗證負責將棋規則。
- AI：`findBestMove`、`minimax`、`evaluate` 與手順排序負責有限深度 alpha-beta 搜尋。AI 會使用玩家相反陣營，並依難度等待：入門 2 秒、初級 4 秒、中級 4-7 秒、高級 5-10 秒。
- UI：`renderBoard`、`renderHands`、`renderKifu`、`showScreen` 與 Modal helper 負責 DOM 更新。
- 音訊：`createAudioManager` 使用 Web Audio API 產生主選單 BGM、遊戲 BGM 與音效。

## 日本語

### 概要

このフォルダーには、ビルド不要の純粋なフロントエンド将棋ゲームが入っています。`index.html` を直接開くだけで実行できます。npm、バンドラー、サーバー、CDN は不要です。

### 実行方法

ブラウザーで `index.html` を開きます。Chrome、Edge、Firefox、Safari での動作を想定しています。

### プログラム構成

- `index.html`: アプリの外枠、各画面、操作ボタン、盤面、持ち駒、棋譜、モーダル。
- `css/reset.css`: ブラウザー差を減らす最小限のリセット。
- `css/variables.css`: テーマ色、フォント、共通デザイントークン。
- `css/layout.css`: メニュー、画面レイアウト、デスクトップ用ゲーム画面、サイドパネル、スクロール制御。
- `css/board.css`: 9x9 盤、マス状態、合法手表示、直前手、座標、星印。
- `css/pieces.css`: 駒の形、成駒の色、持ち駒、枚数バッジ。
- `css/ui.css`: ボタン、設定フォーム、ルール画面、モーダル、AI思考中表示。
- `css/animations.css`: フェード、スピナー、王手警告、駒のインタラクション。
- `css/mobile.css`: レスポンシブ対応、スマートフォン用盤サイズ、持ち駒配置、棋譜ドロワー。
- `js/main.js`: プレイ可能な本体実装。画面遷移、状態管理、合法手、打ち込み、成り、王手/詰み、AI、棋譜、localStorage、AI思考時間、Web Audio を含みます。
- `js/game/*`、`js/ai/*`、`js/ui/*`、`js/audio/*`、`js/utils/*`: 仕様書に合わせたモジュール構造の予約ファイルです。現在はダブルクリック実行を優先し、実行コードを `js/main.js` に集約しています。
- `shogi_spec.md`: 元の仕様書。

### 主なコード分類

- 状態管理: `createInitialState`、`saveGame`、`loadJson`、`undoStack`、プレイヤーの先後設定が対局状態を保持します。
- ルールエンジン: `generateLegalMoves`、`generatePseudoMoves`、`directionsFor`、`isInCheck`、打ち込み検証が将棋ルールを処理します。
- AI: `findBestMove`、`minimax`、`evaluate`、手順ソートが制限付き alpha-beta 探索を行います。AI はプレイヤーと反対側を担当し、難易度に応じて待ちます。入門 2 秒、初級 4 秒、中級 4-7 秒、高級 5-10 秒です。
- UI: `renderBoard`、`renderHands`、`renderKifu`、`showScreen`、モーダル helper が DOM を更新します。
- 音声: `createAudioManager` が Web Audio API でメニューBGM、ゲームBGM、効果音を生成します。
