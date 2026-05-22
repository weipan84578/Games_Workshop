# Shogi Web Game

Languages:

- [English](#english)
- [中文](#中文)
- [日本語](#日本語)

---

## English

### 1. Overview

This is a no-build browser Shogi game. It is written with HTML, CSS, and vanilla JavaScript. It does not require npm, a backend server, a bundler, or CDN assets.

### 2. Run

Open `index.html` directly in a browser.

Recommended browsers:

| Browser | Version |
| --- | --- |
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

### 3. Feature Map

| Feature | Implementation |
| --- | --- |
| Player vs AI | Player side is configurable; AI always uses the opposite side. |
| Difficulty | Selected before starting a game. |
| AI thinking time | Beginner 2s, Easy 4s, Medium 4-7s, Hard 5-10s. |
| Legal moves | Generated and filtered in `js/main.js`. |
| Promotion / drops | Implemented in the rule engine inside `js/main.js`. |
| Check / checkmate | `isInCheck`, legal move filtering, and terminal checks. |
| Save / continue | Uses `localStorage`. |
| Audio | Generated with Web Audio API, no audio files. |
| Responsive layout | CSS media queries in `css/mobile.css`. |

### 4. File Structure

| Path | Purpose |
| --- | --- |
| `index.html` | App shell, screens, board container, hand panels, settings, modals. |
| `css/reset.css` | Browser reset. |
| `css/variables.css` | Theme colors, fonts, shared CSS variables. |
| `css/layout.css` | Page layout, menu, game screen, side panels. |
| `css/board.css` | Board grid, square states, legal hints, coordinates. |
| `css/pieces.css` | Piece shape, size, promoted color, hand piece badges. |
| `css/ui.css` | Buttons, forms, modals, AI thinking overlay. |
| `css/animations.css` | Screen, piece, spinner, and check animations. |
| `css/mobile.css` | Mobile and tablet layout. |
| `js/main.js` | Full runtime implementation: state, rules, AI, UI, storage, audio. |
| `js/game/*` | Reserved module structure from the spec. Runtime code is currently in `js/main.js`. |
| `js/ai/*` | Reserved AI module files. |
| `js/ui/*` | Reserved UI module files. |
| `js/audio/*` | Reserved audio module files. |
| `js/utils/*` | Reserved utility module files. |
| `shogi_spec.md` | Original product and implementation specification. |

### 5. Code Map

| Area | Main Functions / Data |
| --- | --- |
| Settings | `DEFAULT_SETTINGS`, `normalizeSettings`, `loadSettingsForm`, `readSettingsForm` |
| Game state | `createInitialState`, `applyMove`, `undoStack`, `saveGame`, `continueGame` |
| Move rules | `generateLegalMoves`, `generatePseudoMoves`, `directionsFor`, `addDropMoves` |
| Check logic | `isInCheck`, `isSquareAttacked`, `findKing` |
| AI | `findBestMove`, `minimax`, `evaluate`, `sortMoves`, `randomLegalMove` |
| Rendering | `renderBoard`, `renderHands`, `renderKifu`, `renderStatus` |
| Screens / modals | `showScreen`, `modal`, `confirmDialog`, `promotionDialog` |
| Audio | `createAudioManager`, `startMenuMusic`, `startGameMusic`, `play` |

### 6. Current Architecture Note

The folder structure follows the spec, but the executable no-build version keeps the full runtime in `js/main.js`. This avoids ES module file-loading issues when opening `index.html` directly from the filesystem.

---

## 中文

### 1. 概覽

這是一款免建置的瀏覽器將棋遊戲，使用 HTML、CSS、Vanilla JavaScript 撰寫。不需要 npm、不需要後端伺服器、不需要打包工具，也不依賴 CDN 資源。

### 2. 執行方式

直接用瀏覽器開啟 `index.html`。

建議瀏覽器：

| 瀏覽器 | 版本 |
| --- | --- |
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

### 3. 功能對照

| 功能 | 實作方式 |
| --- | --- |
| 玩家 vs AI | 玩家可設定先後手，AI 自動使用相反陣營。 |
| 難度 | 開始遊戲前選擇。 |
| AI 思考時間 | 入門 2 秒、初級 4 秒、中級 4-7 秒、高級 5-10 秒。 |
| 合法手 | 在 `js/main.js` 產生並過濾。 |
| 升變 / 打入 | 在 `js/main.js` 的規則引擎中處理。 |
| 王手 / 詰將 | 透過 `isInCheck`、合法手過濾與終局判定處理。 |
| 儲存 / 繼續 | 使用 `localStorage`。 |
| 音效 / BGM | 使用 Web Audio API 程式生成，不使用音訊檔。 |
| RWD | 由 `css/mobile.css` 的 media query 處理。 |

### 4. 檔案結構

| 路徑 | 用途 |
| --- | --- |
| `index.html` | 應用殼層、畫面、棋盤容器、持駒區、設定、彈窗。 |
| `css/reset.css` | 瀏覽器樣式重置。 |
| `css/variables.css` | 主題色、字體、共用 CSS 變數。 |
| `css/layout.css` | 頁面版型、主選單、遊戲畫面、側欄。 |
| `css/board.css` | 棋盤格線、格子狀態、合法手提示、座標。 |
| `css/pieces.css` | 棋子形狀、尺寸、升變色、持駒數量標示。 |
| `css/ui.css` | 按鈕、表單、彈窗、AI 思考遮罩。 |
| `css/animations.css` | 畫面、棋子、旋轉、王手警示動畫。 |
| `css/mobile.css` | 手機與平板版面。 |
| `js/main.js` | 完整執行邏輯：狀態、規則、AI、UI、儲存、音訊。 |
| `js/game/*` | 依規格保留的遊戲模組結構；目前執行邏輯集中在 `js/main.js`。 |
| `js/ai/*` | 保留的 AI 模組檔案。 |
| `js/ui/*` | 保留的 UI 模組檔案。 |
| `js/audio/*` | 保留的音訊模組檔案。 |
| `js/utils/*` | 保留的工具模組檔案。 |
| `shogi_spec.md` | 原始產品與實作規格。 |

### 5. 程式對照

| 區域 | 主要函式 / 資料 |
| --- | --- |
| 設定 | `DEFAULT_SETTINGS`、`normalizeSettings`、`loadSettingsForm`、`readSettingsForm` |
| 棋局狀態 | `createInitialState`、`applyMove`、`undoStack`、`saveGame`、`continueGame` |
| 走法規則 | `generateLegalMoves`、`generatePseudoMoves`、`directionsFor`、`addDropMoves` |
| 王手判斷 | `isInCheck`、`isSquareAttacked`、`findKing` |
| AI | `findBestMove`、`minimax`、`evaluate`、`sortMoves`、`randomLegalMove` |
| 畫面渲染 | `renderBoard`、`renderHands`、`renderKifu`、`renderStatus` |
| 畫面 / 彈窗 | `showScreen`、`modal`、`confirmDialog`、`promotionDialog` |
| 音訊 | `createAudioManager`、`startMenuMusic`、`startGameMusic`、`play` |

### 6. 架構說明

資料夾結構依照規格書保留，但目前可執行版本將完整 runtime 放在 `js/main.js`。這樣做是為了確保使用者直接從檔案系統開啟 `index.html` 時，不會遇到 ES module 跨檔載入限制。

---

## 日本語

### 1. 概要

これはビルド不要のブラウザー将棋ゲームです。HTML、CSS、Vanilla JavaScript で実装されています。npm、バックエンドサーバー、バンドラー、CDN は不要です。

### 2. 実行方法

ブラウザーで `index.html` を直接開きます。

推奨ブラウザー：

| ブラウザー | バージョン |
| --- | --- |
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

### 3. 機能対応

| 機能 | 実装 |
| --- | --- |
| プレイヤー vs AI | プレイヤーは先後を設定できます。AI は反対側を担当します。 |
| 難易度 | ゲーム開始前に選択します。 |
| AI 思考時間 | 入門 2 秒、初級 4 秒、中級 4-7 秒、高級 5-10 秒。 |
| 合法手 | `js/main.js` で生成してフィルタリングします。 |
| 成り / 打ち込み | `js/main.js` 内のルールエンジンで処理します。 |
| 王手 / 詰み | `isInCheck`、合法手フィルター、終局判定で処理します。 |
| 保存 / 続きから | `localStorage` を使います。 |
| 効果音 / BGM | Web Audio API で生成します。音声ファイルは使いません。 |
| レスポンシブ対応 | `css/mobile.css` の media query で処理します。 |

### 4. ファイル構成

| パス | 役割 |
| --- | --- |
| `index.html` | アプリの外枠、画面、盤面、持ち駒、設定、モーダル。 |
| `css/reset.css` | ブラウザー標準スタイルのリセット。 |
| `css/variables.css` | テーマ色、フォント、共通 CSS 変数。 |
| `css/layout.css` | ページレイアウト、メニュー、ゲーム画面、サイドパネル。 |
| `css/board.css` | 盤面、マス状態、合法手表示、座標。 |
| `css/pieces.css` | 駒の形、サイズ、成駒色、持ち駒バッジ。 |
| `css/ui.css` | ボタン、フォーム、モーダル、AI 思考中オーバーレイ。 |
| `css/animations.css` | 画面、駒、スピナー、王手警告のアニメーション。 |
| `css/mobile.css` | スマートフォンとタブレット用レイアウト。 |
| `js/main.js` | 実行ロジック全体：状態、ルール、AI、UI、保存、音声。 |
| `js/game/*` | 仕様書に合わせて残したゲームモジュール構造。現在の実行コードは `js/main.js`。 |
| `js/ai/*` | 予約済み AI モジュール。 |
| `js/ui/*` | 予約済み UI モジュール。 |
| `js/audio/*` | 予約済み音声モジュール。 |
| `js/utils/*` | 予約済みユーティリティモジュール。 |
| `shogi_spec.md` | 元の製品仕様と実装仕様。 |

### 5. コード対応

| 領域 | 主な関数 / データ |
| --- | --- |
| 設定 | `DEFAULT_SETTINGS`、`normalizeSettings`、`loadSettingsForm`、`readSettingsForm` |
| 対局状態 | `createInitialState`、`applyMove`、`undoStack`、`saveGame`、`continueGame` |
| 手のルール | `generateLegalMoves`、`generatePseudoMoves`、`directionsFor`、`addDropMoves` |
| 王手判定 | `isInCheck`、`isSquareAttacked`、`findKing` |
| AI | `findBestMove`、`minimax`、`evaluate`、`sortMoves`、`randomLegalMove` |
| 描画 | `renderBoard`、`renderHands`、`renderKifu`、`renderStatus` |
| 画面 / モーダル | `showScreen`、`modal`、`confirmDialog`、`promotionDialog` |
| 音声 | `createAudioManager`、`startMenuMusic`、`startGameMusic`、`play` |

### 6. アーキテクチャメモ

フォルダー構成は仕様書に合わせていますが、現在の実行版では runtime 全体を `js/main.js` にまとめています。これは、ファイルシステムから `index.html` を直接開いたときに ES module の読み込み制限を避けるためです。
