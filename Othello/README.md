# Othello / Reversi — 黒白棋 / 黑白棋

> Pure-frontend Othello with AI opponent, ambient audio, and responsive design.  
> 純フロントエンド実装のオセロ：AI対戦・環境音楽・レスポンシブ対応。  
> 純前端黑白棋：AI 對戰、環境音樂、響應式設計。

---

## Table of Contents / 目次 / 目錄

| | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Game Overview | [→](#-game-overview) | [→](#-ゲーム概要) | [→](#-遊戲概述) |
| How to Play | [→](#-how-to-play) | [→](#-遊び方) | [→](#-遊戲方法) |
| Features | [→](#-features) | [→](#-機能) | [→](#-功能特色) |
| File Structure | [→](#-file-structure) | [→](#-ファイル構成) | [→](#-檔案結構) |
| Code Modules | [→](#-code-modules) | [→](#-コードモジュール) | [→](#-程式模組詳解) |
| AI System | [→](#-ai-system) | [→](#-ai-システム) | [→](#-ai-系統) |
| Audio System | [→](#-audio-system) | [→](#-オーディオシステム) | [→](#-音效系統) |
| Settings | [→](#-settings) | [→](#-設定項目) | [→](#-設定項目) |
| Tech Stack | [→](#-tech-stack) | [→](#-技術スタック) | [→](#-技術架構) |

---

# English

## Game Overview

**Othello / Reversi** is a two-player strategy board game played on an 8×8 grid. In this implementation you play against a computer AI across three difficulty levels. The entire game runs from a single `index.html` file — no build step, no server, no external dependencies beyond a Google Fonts CDN link.

| Item | Detail |
|------|--------|
| Game Mode | Single player vs AI |
| Board | 8 × 8 |
| Difficulties | Easy / Normal / Hard |
| Platform | Any modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) |
| Version | v1.0.0 |

## How to Play

1. Open `index.html` in a browser — no installation required.
2. Press **Start New Game** and select a difficulty and piece colour.
3. Black moves first. Click any highlighted gold dot to place your piece.
4. Any opponent pieces sandwiched between your new piece and an existing piece of yours (horizontally, vertically, or diagonally) are flipped to your colour.
5. If you have no legal move your turn is skipped. The game ends when neither player can move or the board is full.
6. The player with more pieces wins. Equal counts = draw.

> The gold dots on the board mark every legal move for the current player. Corner squares are especially valuable — pieces there can never be flipped.

## Features

| Feature | Description |
|---------|-------------|
| Zero-dependency | Runs directly from `index.html`; all CSS and JS are external files in `assets/` |
| AI opponent | Minimax + Alpha-Beta pruning, three depths (1 / 4 / 6 ply) |
| Synthesised audio | Background Lo-Fi music and 10 sound effects generated entirely via Web Audio API — no audio files needed |
| Responsive | Adapts from 320 px phone portrait to 1080 p desktop; board size calculated dynamically |
| Touch-friendly | 44×44 px minimum tap targets, swipe-safe, safe-area padding for notched phones |
| Auto-save | Game state saved to `localStorage` after every move; resume any time |
| Records | Win / loss / draw totals and best win streak persisted across sessions |
| Dark Zen theme | Deep-ink background, gold accents, 3D piece flip animation |
| Accessible | ARIA labels on board and buttons; live region for toast notifications |

## File Structure

```
Othello/
├── index.html               ← Entry point; loads CSS & JS, declares all screens
├── othello_spec.md          ← Full design specification (Chinese)
└── assets/
    ├── css/
    │   ├── base.css         ← Design tokens, resets, buttons, forms
    │   ├── screens.css      ← Home & difficulty screen layouts
    │   ├── game.css         ← Board, cells, pieces, HUD
    │   ├── overlays-settings.css ← Overlays, settings, records, toast
    │   └── responsive-motion.css ← Keyframe animations & media queries
    ├── js/
    │   ├── constants.js     ← Board constants, directions, position weights
    │   ├── storage.js       ← localStorage: settings, saved game, records
    │   ├── audio.js         ← Web Audio API music & SFX synthesis
    │   ├── game.js          ← Rules, move execution, turn flow, scoring
    │   ├── ai.js            ← Minimax AI with alpha-beta pruning
    │   ├── ui.js            ← DOM rendering, screen routing, settings binding
    │   └── main.js          ← Bootstrap sequence
    └── README.md            ← Asset-level documentation
```

## Code Modules

### CSS Modules

| File | Responsibility |
|------|---------------|
| `base.css` | CSS custom properties (colours, radii, fonts), `box-sizing` reset, global typography, `.btn` variants, form controls, `.switch` toggle, range slider |
| `screens.css` | Home screen hero layout, animated ambient stones, difficulty choice cards, segmented control, `.panel` container |
| `game.css` | 8×8 grid via CSS custom property `--board-size`, cell hover states, `.piece` radial-gradient 3D look, score panels, status bar, thinking indicator |
| `overlays-settings.css` | `.overlay` backdrop blur + fade, modal card, pause / result / rules content, settings row layout, records grid, toast slide-in |
| `responsive-motion.css` | `@keyframes` for `piecePlace`, `flipToBlack`, `flipToWhite`, `hintPulse`, `scoreUpdate`, `screenFadeIn`; media queries for phone portrait/landscape, tablet, desktop |

### JavaScript Modules

| File | Responsibility |
|------|---------------|
| `constants.js` | `EMPTY / BLACK / WHITE` constants, 8-direction vector array, 8×8 `POSITION_WEIGHTS` table (corners = 120, adjacent-to-corner = −40) |
| `storage.js` | `StorageManager` — reads/writes `othello_settings`, `othello_game_state`, `othello_records` in localStorage; graceful no-op when storage is unavailable |
| `audio.js` | `AudioEngine` — `AudioContext` lifecycle, Lo-Fi background music loop (sine arpeggio + triangle bass + filtered noise), 10 synthesised SFX (`sfx_place`, `sfx_flip`, `sfx_win`, `sfx_lose`, etc.), master/music/SFX gain chain |
| `game.js` | `GameEngine` — 8×8 board array, `isValidMove()`, `getFlips()`, `executeMove()`, turn management (skip detection, game-over detection), score counting, auto-save hook |
| `ai.js` | `AIEngine` — `minimax()` with alpha-beta pruning, iterative evaluation using position weight + mobility + stability + piece-count scores, random sub-optimal move at Easy difficulty |
| `ui.js` | `UIManager` — builds 64 board cells, handles click/tap, routes between screens, binds settings controls, updates score display and status bar, calls `AudioEngine` and `AIEngine` at the right moments |
| `main.js` | `DOMContentLoaded` bootstrap: `StorageManager → UIManager → AudioEngine → GameEngine → showScreen('home')` |

## AI System

The AI uses **Minimax search with Alpha-Beta pruning**.

### Difficulty Levels

| Difficulty | Search Depth | Random Factor | AI Delay |
|------------|-------------|---------------|----------|
| Easy | 1 ply | 60% chance of sub-optimal move | 500 ms |
| Normal | 4 ply | None | 800 ms |
| Hard | 6 ply | None; includes endgame solve | 1 000 ms |

### Board Evaluation (weighted sum)

| Component | Weight | Notes |
|-----------|--------|-------|
| Position score | × 1 | Weighted by `POSITION_WEIGHTS` table |
| Mobility score | × 10 | Difference in number of legal moves |
| Stability score | × 25 | Pieces that can never be flipped |
| Piece count | × 100 | Applied only in endgame phase |

### Position Weight Table

```
[120, -20,  20,   5,   5,  20, -20, 120]
[-20, -40,  -5,  -5,  -5,  -5, -40, -20]
[ 20,  -5,  15,   3,   3,  15,  -5,  20]
[  5,  -5,   3,   3,   3,   3,  -5,   5]
[  5,  -5,   3,   3,   3,   3,  -5,   5]
[ 20,  -5,  15,   3,   3,  15,  -5,  20]
[-20, -40,  -5,  -5,  -5,  -5, -40, -20]
[120, -20,  20,   5,   5,  20, -20, 120]
```

Corners score +120; squares adjacent to corners score −40 (giving corners to the opponent is costly).

## Audio System

All audio is synthesised in real-time using the **Web Audio API** — zero audio files are shipped.

### Background Music

Lo-Fi Japanese Zen loop (~16 s cycle, repeating):

| Layer | Waveform | Notes |
|-------|----------|-------|
| Arpeggio melody | Sine | C4-E4-G4-A4-G4-E4, 0.5 s/note, ADSR envelope |
| Sub bass | Triangle | Root C3, every 2 beats |
| Percussion | White noise + high-pass filter | >800 Hz, simulates soft wood block |
| Reverb | ConvolverNode | Generated impulse response, wet/dry 0.3 |

### Sound Effects

| ID | Trigger | Synthesis |
|----|---------|-----------|
| `sfx_place` | Player places piece | Sine 440 Hz → 220 Hz, 0.12 s |
| `sfx_flip` | Each piece flips | Triangle glide 600 Hz → 300 Hz, 0.08 s |
| `sfx_flip_combo` | All flips complete | C-E-G fast arpeggio |
| `sfx_ai_place` | AI places piece | Sine 330 Hz → 165 Hz, 0.12 s |
| `sfx_skip` | Turn skipped | Falling tone 400 Hz → 200 Hz, 0.25 s |
| `sfx_win` | Player wins | Major triad ascent C4-E4-G4-C5 |
| `sfx_lose` | Player loses | Minor triad descent C4-Eb4-G3 |
| `sfx_draw` | Draw | Whole-tone C4-D4-E4 |
| `sfx_button` | Button click | Sine 800 Hz, 0.05 s |
| `sfx_invalid` | Illegal move attempt | Low-frequency thud 150 Hz, 0.1 s |

## Settings

| Key | Default | Type | Description |
|-----|---------|------|-------------|
| `musicEnabled` | `true` | boolean | Background music on/off |
| `sfxEnabled` | `true` | boolean | Sound effects on/off |
| `masterVolume` | `0.7` | 0–1 | Master volume slider |
| `musicVolume` | `0.4` | 0–1 | Music volume slider |
| `sfxVolume` | `0.8` | 0–1 | SFX volume slider |
| `aiSpeed` | `'normal'` | enum | AI move delay: `fast / normal / slow` |
| `showHints` | `true` | boolean | Show legal-move dots |

All settings are persisted to `localStorage` immediately on change.

## Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Single entry point `index.html`, semantic sections |
| CSS3 | Custom properties, Grid/Flexbox, `@keyframes`, `transform`, `backdrop-filter` |
| Vanilla JavaScript (ES2020) | Game logic, AI, UI, audio — no frameworks |
| Web Audio API | All music and SFX synthesis |
| localStorage | Settings, saved game, records |
| Google Fonts CDN | Zen Old Mincho + Noto Serif TC (requires internet; falls back to system serif) |

---

# 日本語

## ゲーム概要

**オセロ / リバーシ**は 8×8 のボードで行う 2 人対戦ストラテジーゲームです。このバージョンでは 3 段階の難易度から選んだ AI と対局します。`index.html` を開くだけで動作し、ビルドもサーバーも不要です。

| 項目 | 内容 |
|------|------|
| ゲームモード | 1 人 vs AI |
| ボード | 8 × 8 |
| 難易度 | 簡単 / 普通 / 難しい |
| 動作環境 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| バージョン | v1.0.0 |

## 遊び方

1. ブラウザで `index.html` を開く（インストール不要）。
2. **開始新ゲーム** を押し、難易度と石の色を選ぶ。
3. 黒石が先手。盤面の金色の点をタップ／クリックして石を置く。
4. 新しい石と既存の同色石に挟まれた相手の石はすべて自分の色に裏返る（水平・垂直・斜め）。
5. 合法手がない場合はパス。どちらも打てなくなるか盤面が埋まったらゲーム終了。
6. 石数が多い方が勝ち。同数は引き分け。

> 盤面上の金色の点が現在置けるマスを示します。角のマスは一度取ると裏返らないため特に重要です。

## 機能

| 機能 | 説明 |
|------|------|
| 依存ゼロ | `index.html` を開くだけで起動。CSS / JS は `assets/` フォルダに分離 |
| AI 対戦 | Minimax + アルファベータ枝刈り、3 段階の探索深度（1 / 4 / 6 手） |
| 合成サウンド | Web Audio API でリアルタイム合成した BGM と 10 種の効果音（音声ファイル不要） |
| レスポンシブ | 320 px スマートフォン縦向きから 1080 p デスクトップまで対応 |
| タッチ最適化 | 最小 44×44 px タップ領域、ノッチ端末向けセーフエリア対応 |
| 自動保存 | 毎着手後に `localStorage` へ保存。ブラウザを閉じても再開可能 |
| 戦績記録 | 勝敗数・引き分け・最高連勝をセッションをまたいで保持 |
| 禅スタイル | 深墨色の背景、金色アクセント、3D 石裏返しアニメーション |
| アクセシビリティ | ボードとボタンに ARIA ラベル、トースト通知は live region |

## ファイル構成

```
Othello/
├── index.html                    ← エントリーポイント
├── othello_spec.md               ← 設計仕様書（繁体字中国語）
└── assets/
    ├── css/
    │   ├── base.css              ← トークン・リセット・ボタン・フォーム
    │   ├── screens.css           ← ホーム・難易度画面レイアウト
    │   ├── game.css              ← 盤面・石・HUD
    │   ├── overlays-settings.css ← オーバーレイ・設定・戦績・トースト
    │   └── responsive-motion.css ← アニメーション・メディアクエリ
    ├── js/
    │   ├── constants.js          ← 定数・方向ベクトル・位置評価テーブル
    │   ├── storage.js            ← localStorage 管理
    │   ├── audio.js              ← BGM・効果音合成
    │   ├── game.js               ← ルール・着手・手番・スコア
    │   ├── ai.js                 ← Minimax AI・アルファベータ
    │   ├── ui.js                 ← DOM 描画・画面遷移・設定バインド
    │   └── main.js               ← 起動シーケンス
    └── README.md                 ← アセット説明
```

## コードモジュール

### CSS モジュール

| ファイル | 役割 |
|---------|------|
| `base.css` | カスタムプロパティ（色・角丸・フォント）、グローバルリセット、`.btn` バリアント、トグルスイッチ、レンジスライダー |
| `screens.css` | ホーム画面ヒーローレイアウト、浮遊石アニメーション、難易度カード、セグメントコントロール |
| `game.css` | `--board-size` による 8×8 グリッド、セルホバー、放射グラデーション 3D 石、スコアパネル、ステータスバー、思考インジケーター |
| `overlays-settings.css` | backdrop-blur オーバーレイ、モーダルカード、設定行レイアウト、戦績グリッド、トーストスライドイン |
| `responsive-motion.css` | `piecePlace` / `flipToBlack` / `flipToWhite` / `hintPulse` / `scoreUpdate` / `screenFadeIn` の `@keyframes`、各ブレークポイントのメディアクエリ |

### JavaScript モジュール

| ファイル | 役割 |
|---------|------|
| `constants.js` | `EMPTY / BLACK / WHITE`、8 方向ベクトル、8×8 `POSITION_WEIGHTS`（角 = 120、角隣 = −40） |
| `storage.js` | `StorageManager` — `othello_settings` / `othello_game_state` / `othello_records` の読み書き。localStorage が使えない場合は静かに降格 |
| `audio.js` | `AudioEngine` — `AudioContext` ライフサイクル管理、Lo-Fi ループ BGM（正弦波アルペジオ + 三角波ベース + フィルタードノイズ）、10 種の効果音、マスター/音楽/SFX ゲインチェーン |
| `game.js` | `GameEngine` — 盤面配列、`isValidMove()`、`getFlips()`、`executeMove()`、パス検出、ゲーム終了判定、スコア集計 |
| `ai.js` | `AIEngine` — アルファベータ枝刈り付き `minimax()`、位置重み + 行動力 + 安定石 + 石数の複合評価、簡単モードでの確率的な次善手選択 |
| `ui.js` | `UIManager` — 64 セル構築、クリック/タップ処理、画面遷移、設定コントロールバインド、スコア表示更新、`AudioEngine` と `AIEngine` の呼び出し制御 |
| `main.js` | `DOMContentLoaded` 起動順序：`StorageManager → UIManager → AudioEngine → GameEngine → showScreen('home')` |

## AI システム

**Minimax 探索 + アルファベータ枝刈り** を採用。

### 難易度

| 難易度 | 探索深度 | ランダム性 | AI 応答遅延 |
|--------|---------|----------|------------|
| 簡単 | 1 手 | 60% で次善手を選択 | 500 ms |
| 普通 | 4 手 | なし | 800 ms |
| 難しい | 6 手 | なし、終盤完全読み | 1 000 ms |

### 盤面評価（加重合計）

| 要素 | 重み | 備考 |
|------|------|------|
| 位置スコア | × 1 | `POSITION_WEIGHTS` テーブル参照 |
| 行動力スコア | × 10 | 合法手数の差 |
| 安定石スコア | × 25 | 裏返せない石の数 |
| 石数差 | × 100 | 終盤フェーズのみ適用 |

## オーディオシステム

すべての音声は **Web Audio API** でリアルタイム合成。音声ファイルは一切不要。

### BGM 構成

Lo-Fi 禅スタイルループ（約 16 秒サイクル）:

| レイヤー | 波形 | 内容 |
|---------|------|------|
| アルペジオ | 正弦波 | C4-E4-G4-A4-G4-E4、0.5 秒/音、ADSR エンベロープ |
| サブベース | 三角波 | ルート音 C3、2 拍ごと |
| パーカッション | ホワイトノイズ + ハイパスフィルター | 800 Hz 以上、木魚風 |
| リバーブ | ConvolverNode | 人工インパルス応答、wet/dry 0.3 |

### 効果音

| ID | トリガー | 合成内容 |
|----|---------|---------|
| `sfx_place` | 自分の着手 | 正弦波 440 → 220 Hz、0.12 s |
| `sfx_flip` | 石 1 個の反転 | 三角波グライド 600 → 300 Hz、0.08 s |
| `sfx_flip_combo` | 反転完了 | C-E-G 高速アルペジオ |
| `sfx_ai_place` | AI の着手 | 正弦波 330 → 165 Hz、0.12 s |
| `sfx_skip` | パス | 下降音 400 → 200 Hz、0.25 s |
| `sfx_win` | 勝利 | 長三和音上昇 C4-E4-G4-C5 |
| `sfx_lose` | 敗北 | 短三和音下降 C4-Eb4-G3 |
| `sfx_draw` | 引き分け | 全音音階 C4-D4-E4 |
| `sfx_button` | ボタン押下 | 正弦波 800 Hz、0.05 s |
| `sfx_invalid` | 違法手 | 低音 150 Hz、0.1 s |

## 設定項目

| キー | 初期値 | 型 | 説明 |
|------|--------|----|------|
| `musicEnabled` | `true` | boolean | BGM オン/オフ |
| `sfxEnabled` | `true` | boolean | 効果音オン/オフ |
| `masterVolume` | `0.7` | 0–1 | マスター音量 |
| `musicVolume` | `0.4` | 0–1 | BGM 音量 |
| `sfxVolume` | `0.8` | 0–1 | 効果音音量 |
| `aiSpeed` | `'normal'` | enum | AI 着手速度: `fast / normal / slow` |
| `showHints` | `true` | boolean | 合法手ドットの表示 |

## 技術スタック

| 技術 | 用途 |
|------|------|
| HTML5 | エントリーポイント `index.html`、セマンティックセクション |
| CSS3 | カスタムプロパティ、Grid/Flexbox、`@keyframes`、`transform`、`backdrop-filter` |
| Vanilla JavaScript (ES2020) | ゲームロジック、AI、UI、オーディオ（フレームワーク不使用） |
| Web Audio API | 全音楽・効果音のリアルタイム合成 |
| localStorage | 設定・保存対局・戦績 |
| Google Fonts CDN | Zen Old Mincho + Noto Serif TC（オフライン時はシステムフォント使用） |

---

# 繁體中文

## 遊戲概述

**黑白棋（Othello / Reversi）** 是一款在 8×8 棋盤上進行的雙人策略遊戲。本版本提供三種難度的 AI 對手。直接開啟 `index.html` 即可遊玩，無需安裝、無需伺服器、無需任何外部依賴。

| 項目 | 說明 |
|------|------|
| 遊戲模式 | 單人 vs AI |
| 棋盤 | 8 × 8 |
| 難度 | 簡單 / 普通 / 困難 |
| 支援瀏覽器 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| 版本 | v1.0.0 |

## 遊戲方法

1. 以瀏覽器開啟 `index.html`，無需安裝任何套件。
2. 點擊「開始新遊戲」，選擇難度與棋色。
3. 黑棋先手。點擊棋盤上的金色提示點落子。
4. 新落子與既有同色棋子之間（水平、垂直或斜線）夾住的對手棋子，全部翻成己方顏色。
5. 若輪到某方時無合法走法，則跳過該回合。雙方皆無合法走法或棋盤下滿時遊戲結束。
6. 棋子數多者勝，相等為平局。

> 棋盤上的金色小點代表目前所有合法落子位置。角落格子特別有價值，因為角落的棋子永遠不會被翻走。

## 功能特色

| 功能 | 說明 |
|------|------|
| 零依賴 | 開啟 `index.html` 即可執行，CSS / JS 分拆存放於 `assets/` |
| AI 對手 | Minimax + Alpha-Beta 剪枝，三種搜尋深度（1 / 4 / 6 層） |
| 合成音效 | 全部使用 Web Audio API 即時合成背景音樂與 10 種音效，不需任何音訊檔案 |
| 響應式設計 | 支援 320 px 手機直向到 1080 p 桌面，棋盤尺寸動態計算 |
| 觸控優化 | 最小 44×44 px 點擊目標，支援瀏海機型安全區域 |
| 自動存檔 | 每次落子後自動儲存至 `localStorage`，隨時可繼續上次對局 |
| 戰績記錄 | 跨瀏覽器會話保存勝/敗/平局次數與最佳連勝紀錄 |
| 深色禪風 | 深墨色背景、金色強調色、CSS 3D 棋子翻轉動畫 |
| 無障礙支援 | 棋盤與按鈕均有 ARIA 標籤，Toast 通知使用 live region |

## 檔案結構

```
Othello/
├── index.html                    ← 入口頁面，載入所有 CSS 與 JS
├── othello_spec.md               ← 完整設計規格書
└── assets/
    ├── css/
    │   ├── base.css              ← 設計變數、重置樣式、按鈕、表單
    │   ├── screens.css           ← 主畫面、難度選擇畫面版面
    │   ├── game.css              ← 棋盤、格子、棋子、計分 HUD
    │   ├── overlays-settings.css ← Overlay、設定、戰績、Toast
    │   └── responsive-motion.css ← 關鍵影格動畫與媒體查詢
    ├── js/
    │   ├── constants.js          ← 常數、方向陣列、位置權重表
    │   ├── storage.js            ← localStorage 存取管理
    │   ├── audio.js              ← 背景音樂與音效合成
    │   ├── game.js               ← 規則、落子、回合流程、計分
    │   ├── ai.js                 ← Minimax AI 與 Alpha-Beta 剪枝
    │   ├── ui.js                 ← DOM 渲染、畫面路由、設定綁定
    │   └── main.js               ← 應用程式啟動序列
    └── README.md                 ← Asset 層級說明文件
```

## 程式模組詳解

### CSS 模組

| 檔案 | 職責 |
|------|------|
| `base.css` | CSS 自訂屬性（顏色、圓角、字體）、全域重置、`.btn` 變體（primary / ghost / danger）、Toggle Switch、Range Slider 樣式 |
| `screens.css` | 主畫面 Hero 版面、浮動棋子裝飾動畫、難度選擇卡片、分段控制元件（Segmented Control）、`.panel` 容器 |
| `game.css` | 以 `--board-size` CSS 變數控制 8×8 Grid、格子懸停狀態、放射狀漸層 3D 棋子、計分面板、狀態列、AI 思考動畫指示器 |
| `overlays-settings.css` | `backdrop-filter` 半透明遮罩、Modal 卡片、暫停 / 結算 / 規則說明內容、設定列版面、戰績方格、Toast 滑入動畫 |
| `responsive-motion.css` | `piecePlace` / `flipToBlack` / `flipToWhite` / `hintPulse` / `scoreUpdate` / `screenFadeIn` 關鍵影格；手機直向 / 手機橫向 / 平板 / 桌面各斷點媒體查詢 |

### JavaScript 模組

| 檔案 | 職責 |
|------|------|
| `constants.js` | `EMPTY / BLACK / WHITE` 常數、8 方向向量陣列、8×8 `POSITION_WEIGHTS`（角落 = 120，角落相鄰格 = −40） |
| `storage.js` | `StorageManager` — 讀寫 `othello_settings` / `othello_game_state` / `othello_records`；localStorage 不可用時靜默降級 |
| `audio.js` | `AudioEngine` — `AudioContext` 生命週期管理、Lo-Fi 循環背景音樂（正弦波琶音 + 三角波低音 + 濾波噪音）、10 種音效合成、主音量 / 音樂 / 音效三層 Gain 鏈 |
| `game.js` | `GameEngine` — 8×8 棋盤陣列、`isValidMove()`、`getFlips()`、`executeMove()`、跳過回合偵測、遊戲結束判定、計分、存檔連動 |
| `ai.js` | `AIEngine` — 帶 Alpha-Beta 剪枝的 `minimax()`、位置權重 + 行動力 + 穩定子 + 棋子數複合評估、簡單難度隨機次優解選擇 |
| `ui.js` | `UIManager` — 建立 64 格棋盤 DOM、點擊 / 觸控事件、畫面路由切換、設定控制元件雙向綁定、計分更新、呼叫 `AudioEngine` 與 `AIEngine` |
| `main.js` | `DOMContentLoaded` 啟動順序：`StorageManager → UIManager → AudioEngine → GameEngine → showScreen('home')` |

## AI 系統

採用 **Minimax 搜尋 + Alpha-Beta 剪枝**，結合加權局面評估函數。

### 難度對照

| 難度 | 搜尋深度 | 隨機因子 | AI 思考延遲 |
|------|---------|---------|------------|
| 簡單 | 1 層 | 60% 機率選次優解 | 500 ms |
| 普通 | 4 層 | 無 | 800 ms |
| 困難 | 6 層 | 無，含終局求解 | 1 000 ms |

### 局面評估函數（加權總分）

| 評估項目 | 權重 | 說明 |
|---------|------|------|
| 位置分 | × 1 | 參照 `POSITION_WEIGHTS` 表 |
| 行動力分 | × 10 | 雙方合法走法數量差 |
| 穩定子分 | × 25 | 無法被翻轉的棋子數量 |
| 棋子數差 | × 100 | 僅於終局階段啟用 |

### 位置權重表

```
[120, -20,  20,   5,   5,  20, -20, 120]
[-20, -40,  -5,  -5,  -5,  -5, -40, -20]
[ 20,  -5,  15,   3,   3,  15,  -5,  20]
[  5,  -5,   3,   3,   3,   3,  -5,   5]
[  5,  -5,   3,   3,   3,   3,  -5,   5]
[ 20,  -5,  15,   3,   3,  15,  -5,  20]
[-20, -40,  -5,  -5,  -5,  -5, -40, -20]
[120, -20,  20,   5,   5,  20, -20, 120]
```

角落 +120 分；角落相鄰格 −40 分（輕易讓對手佔角代價極高）。

## 音效系統

所有音訊均由 **Web Audio API** 即時合成，不附帶任何音訊檔案。

### 背景音樂結構

日式枯山水 Lo-Fi 循環（約 16 秒一周期）：

| 音軌層 | 波形 | 說明 |
|--------|------|------|
| 琶音旋律 | 正弦波 | C4-E4-G4-A4-G4-E4，0.5 秒/音，ADSR 包絡線 |
| 低音 | 三角波 | 根音 C3，每 2 拍一次 |
| 打擊 | 白噪音 + 高通濾波 | 截止頻率 800 Hz，模擬輕敲木魚聲 |
| 殘響 | ConvolverNode | 程式生成脈衝響應，wet/dry = 0.3 |

### 音效清單

| 音效 ID | 觸發時機 | 合成方式 |
|---------|---------|---------|
| `sfx_place` | 玩家落子 | 正弦波 440 Hz → 220 Hz，0.12 s |
| `sfx_flip` | 每顆棋子翻轉 | 三角波 glide 600 Hz → 300 Hz，0.08 s |
| `sfx_flip_combo` | 所有翻轉完成 | C-E-G 快速琶音 |
| `sfx_ai_place` | AI 落子 | 正弦波 330 Hz → 165 Hz，0.12 s |
| `sfx_skip` | 跳過回合 | 下滑音 400 Hz → 200 Hz，0.25 s |
| `sfx_win` | 玩家勝利 | 大三和弦上升 C4-E4-G4-C5 |
| `sfx_lose` | 玩家敗北 | 小三和弦下降 C4-Eb4-G3 |
| `sfx_draw` | 平局 | 全音音階 C4-D4-E4 |
| `sfx_button` | 按鈕點擊 | 正弦波 800 Hz，0.05 s |
| `sfx_invalid` | 非法落子嘗試 | 低頻短音 150 Hz，0.1 s |

## 設定項目

| 鍵名 | 預設值 | 類型 | 說明 |
|------|--------|------|------|
| `musicEnabled` | `true` | boolean | 背景音樂開關 |
| `sfxEnabled` | `true` | boolean | 音效開關 |
| `masterVolume` | `0.7` | 0–1 | 主音量滑桿 |
| `musicVolume` | `0.4` | 0–1 | 音樂音量滑桿 |
| `sfxVolume` | `0.8` | 0–1 | 音效音量滑桿 |
| `aiSpeed` | `'normal'` | enum | AI 落子速度：`fast / normal / slow` |
| `showHints` | `true` | boolean | 顯示合法走法提示點 |

所有設定在變更時立即寫入 `localStorage`。

## 技術架構

| 技術 | 用途 |
|------|------|
| HTML5 | 單一入口 `index.html`，語意化 Section 結構 |
| CSS3 | 自訂屬性、Grid / Flexbox、`@keyframes`、`transform`、`backdrop-filter` |
| Vanilla JavaScript (ES2020) | 遊戲邏輯、AI、UI、音效（無框架） |
| Web Audio API | 所有音樂與音效的即時合成 |
| localStorage | 設定、存檔對局、戰績 |
| Google Fonts CDN | Zen Old Mincho + Noto Serif TC（離線時 fallback 至系統 serif 字體） |

---

*v1.0.0 — Single-player Othello vs AI / 1 人オセロ AI 対戦 / 單人黑白棋 AI 對戰*
