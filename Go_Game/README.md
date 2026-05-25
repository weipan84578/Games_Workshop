# Go Game

> A refined, static Web Go experience built with Canvas, modular JavaScript, Web Audio, local saves, and responsive themes.

---

## English

### Overview

Go Game is a browser-based Go application that runs as a pure static site. It does not require Node.js, a backend service, or a build step. Open `index.html` directly, or serve the folder with any static file server.

The application includes a playable Go board, five AI levels, capture and legality rules, scoring, local save slots, synthesized sound effects, background music, theme switching, and a tutorial screen.

### Highlights

- Pure static Web app: HTML, CSS, and vanilla JavaScript.
- Canvas-rendered Go board with responsive sizing.
- Board sizes: `9x9`, `13x13`, and `19x19`.
- Human vs AI gameplay.
- Five AI levels: Random, Greedy, Heuristic, MCTS, and MCTS + policy-style search.
- Rule handling: occupied points, captures, suicide prevention, pass, undo, and simplified ko repetition.
- Scoring support with territory estimation, captures, stones, and komi.
- Three local save slots using `localStorage`.
- Six visual themes: Classic, Dark, Ocean, Sakura, Bamboo, and Neon.
- Web Audio sound effects and generated background music.
- Tutorial, settings, result, menu, and game screens.

### How To Run

Open the file directly:

```text
index.html
```

Or run a local static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

### Program Structure

```text
Go_Game/
  index.html
  go_game_spec.md
  README.md
  css/
    reset.css
    variables.css
    typography.css
    layout.css
    animations.css
    components/
    themes/
  js/
    main.js
    router.js
    state.js
    config.js
    game/
    ai/
    audio/
    ui/
    utils/
```

### Code Categories

#### Entry And Global Flow

- `index.html`: Static shell, screen containers, stylesheet loading, and script loading order.
- `js/main.js`: Application bootstrap, saved settings restoration, initial route, and first audio unlock.
- `js/router.js`: Screen switching and background music selection for menu, game, settings, tutorial, and result screens.
- `js/state.js`: Central state holder for settings and current game state.
- `js/config.js`: Shared constants such as board sizes, AI limits, save slots, and theme list.

#### Game Logic

- `js/game/board.js`: Board representation based on `Int8Array`, index helpers, cloning, hashing, and neighbor lookup.
- `js/game/rules.js`: Legal move validation, group search, liberty counting, capture resolution, suicide prevention, and ko-style repetition checks.
- `js/game/scoring.js`: Endgame scoring by stones, captures, territory, and komi.
- `js/game/history.js`: Move stack management and undo restoration.

#### AI

- `js/ai/ai-random.js`: Picks any legal move.
- `js/ai/ai-greedy.js`: Prioritizes capture-heavy moves.
- `js/ai/ai-heuristic.js`: Scores moves by captures, liberties, center influence, and nearby stones.
- `js/ai/ai-mcts.js`: Performs limited rollout search with heuristic guidance.
- `js/ai/ai-mcts-nn.js`: Uses the stronger MCTS path as a policy-style advanced AI layer.
- `js/ai/ai-controller.js`: Selects the correct AI engine by difficulty and coordinates AI thinking flow.

#### UI

- `js/ui/board-renderer.js`: Canvas rendering, board coordinates, stones, hover preview, star points, and last-move marker.
- `js/ui/menu-ui.js`: Main menu, game setup, save slot display, and start/load actions.
- `js/ui/game-ui.js`: Game HUD, player moves, AI moves, pass, undo, scoring, save, resignation, and timer.
- `js/ui/settings-ui.js`: Board settings, AI settings, theme selection, display toggles, sound volume, and music volume.
- `js/ui/tutorial-ui.js`: Rule and operation guide.
- `js/ui/modal-ui.js`: Confirmation dialog.
- `js/ui/notification-ui.js`: Toast notifications.
- `js/ui/theme-switcher.js`: Runtime theme switching and persistence.

#### Audio

- `js/audio/audio-config.js`: Sound effect tones and generated BGM note patterns.
- `js/audio/audio-synth.js`: Web Audio oscillator scheduling.
- `js/audio/audio-manager.js`: Sound effect playback, BGM loop control, audio unlock, mute, and volume handling.

#### Utilities

- `js/utils/event-bus.js`: Lightweight publish/subscribe helper.
- `js/utils/storage.js`: Settings and save-slot persistence through `localStorage`.
- `js/utils/math-utils.js`: Clamp, random choice, and debounce helpers.
- `js/utils/i18n.js`: Coordinate labels, stone labels, and AI difficulty labels.

#### Styling

- `css/reset.css`: Base browser reset.
- `css/variables.css`: Design tokens and default color variables.
- `css/typography.css`: Type scale and text rules.
- `css/layout.css`: Main responsive layout, panels, forms, and route containers.
- `css/animations.css`: Lightweight animation keyframes.
- `css/components/`: Buttons, board frame, menu, modal, scoreboard, settings, tutorial, and toast styles.
- `css/themes/`: Six theme files that override the shared CSS variables.

### Notes

- Audio starts after the first user interaction because browsers block autoplay audio.
- Saves are stored in the current browser through `localStorage`.
- The AI is designed for responsive play inside a static browser app, not for professional-strength analysis.

---

## 日本語

### 概要

Go Game は、ブラウザだけで動作する静的 Web 囲碁アプリです。Node.js、バックエンド、ビルド工程は不要です。`index.html` を直接開くか、任意の静的サーバーでフォルダーを配信できます。

Canvas で描画される碁盤、5 段階の AI、着手判定、石の取り上げ、終局計算、ローカル保存、合成効果音、背景音楽、テーマ切替、チュートリアルを備えています。

### 主な機能

- HTML、CSS、Vanilla JavaScript のみで構成された静的 Web アプリ。
- レスポンシブ対応の Canvas 碁盤。
- `9x9`、`13x13`、`19x19` の碁盤サイズ。
- 人間対 AI の対局。
- 5 段階 AI: Random、Greedy、Heuristic、MCTS、MCTS + policy 風探索。
- 着手済み交点、取り上げ、自殺手禁止、パス、待った、簡易コウ判定に対応。
- 石、地、取り上げ、コミを含む終局計算。
- `localStorage` による 3 つの保存スロット。
- Classic、Dark、Ocean、Sakura、Bamboo、Neon の 6 テーマ。
- Web Audio による効果音と生成 BGM。
- メニュー、対局、設定、チュートリアル、結果画面。

### 実行方法

直接開く場合:

```text
index.html
```

静的サーバーを使う場合:

```bash
python -m http.server 8000
```

その後、以下を開きます。

```text
http://localhost:8000/index.html
```

### プログラム構成

```text
Go_Game/
  index.html
  go_game_spec.md
  README.md
  css/
    reset.css
    variables.css
    typography.css
    layout.css
    animations.css
    components/
    themes/
  js/
    main.js
    router.js
    state.js
    config.js
    game/
    ai/
    audio/
    ui/
    utils/
```

### コード分類

#### 起動と全体制御

- `index.html`: 静的な HTML シェル、画面コンテナ、CSS と JavaScript の読み込み順。
- `js/main.js`: アプリ初期化、保存済み設定の復元、初期画面表示、初回クリックでの音声解除。
- `js/router.js`: 画面遷移と、メニュー・対局・設定・チュートリアル・結果画面の BGM 切替。
- `js/state.js`: 設定と対局状態を保持する中央ステート。
- `js/config.js`: 碁盤サイズ、AI 制限、保存スロット、テーマ一覧などの共通定数。

#### 対局ロジック

- `js/game/board.js`: `Int8Array` による盤面表現、座標変換、複製、ハッシュ化、隣接点取得。
- `js/game/rules.js`: 合法手判定、連探索、呼吸点計算、取り上げ、自殺手防止、簡易コウ判定。
- `js/game/scoring.js`: 石、取り上げ、地、コミによる終局計算。
- `js/game/history.js`: 着手履歴と Undo 復元。

#### AI

- `js/ai/ai-random.js`: 合法手からランダムに選択。
- `js/ai/ai-greedy.js`: 取り上げ数の多い手を優先。
- `js/ai/ai-heuristic.js`: 取り上げ、呼吸点、中央志向、周辺石から手を評価。
- `js/ai/ai-mcts.js`: ヒューリスティック付きの制限付きロールアウト探索。
- `js/ai/ai-mcts-nn.js`: policy 風の強化層として高難度 MCTS を利用。
- `js/ai/ai-controller.js`: 難度に応じた AI 選択と思考フロー管理。

#### UI

- `js/ui/board-renderer.js`: Canvas 碁盤、座標、石、ホバー表示、星、最終手マーカーの描画。
- `js/ui/menu-ui.js`: メニュー、対局設定、保存スロット、開始・読み込み操作。
- `js/ui/game-ui.js`: 対局 HUD、着手、AI 応手、パス、Undo、計算、保存、投了、タイマー。
- `js/ui/settings-ui.js`: 碁盤設定、AI 設定、テーマ、表示補助、効果音音量、音楽音量。
- `js/ui/tutorial-ui.js`: ルールと操作説明。
- `js/ui/modal-ui.js`: 確認ダイアログ。
- `js/ui/notification-ui.js`: トースト通知。
- `js/ui/theme-switcher.js`: 実行時テーマ切替と保存。

#### 音声

- `js/audio/audio-config.js`: 効果音トーンと生成 BGM の音階パターン。
- `js/audio/audio-synth.js`: Web Audio の oscillator スケジューリング。
- `js/audio/audio-manager.js`: 効果音再生、BGM ループ、音声解除、ミュート、音量制御。

#### ユーティリティ

- `js/utils/event-bus.js`: 軽量 publish/subscribe。
- `js/utils/storage.js`: `localStorage` による設定と保存スロット管理。
- `js/utils/math-utils.js`: Clamp、ランダム選択、debounce。
- `js/utils/i18n.js`: 座標、石名、AI 難度名。

#### スタイル

- `css/reset.css`: ブラウザ既定スタイルのリセット。
- `css/variables.css`: デザイントークンと基本カラー変数。
- `css/typography.css`: タイポグラフィ。
- `css/layout.css`: レスポンシブレイアウト、パネル、フォーム、画面配置。
- `css/animations.css`: 軽量アニメーション。
- `css/components/`: ボタン、碁盤、メニュー、モーダル、スコア、設定、チュートリアル、通知。
- `css/themes/`: 共通 CSS 変数を上書きする 6 つのテーマ。

### 補足

- ブラウザの自動再生制限により、音声は最初のユーザー操作後に開始されます。
- 保存データは現在のブラウザの `localStorage` に保存されます。
- AI は静的 Web アプリ内で快適に遊べる応答性を重視しており、プロ向け解析エンジンではありません。

---

## 中文

### 概覽

Go Game 是一款純靜態 Web 圍棋遊戲。它不需要 Node.js、不需要後端服務，也不需要建置流程。你可以直接開啟 `index.html`，也可以用任何靜態伺服器提供這個資料夾。

本專案包含 Canvas 棋盤、五級 AI、合法落子與提子規則、終局計分、本機存檔、合成音效、背景音樂、主題切換與教學頁面。

### 主要特色

- 純 HTML、CSS、Vanilla JavaScript 靜態 Web App。
- 使用 Canvas 繪製棋盤，支援響應式尺寸。
- 支援 `9x9`、`13x13`、`19x19` 棋盤。
- 人類對 AI 對局。
- 五級 AI：Random、Greedy、Heuristic、MCTS、MCTS + policy 風格搜尋。
- 支援已占位檢查、提子、禁自殺、Pass、Undo、簡化劫爭判斷。
- 以棋子、提子、圍地與貼目估算終局分數。
- 使用 `localStorage` 提供三組本機存檔。
- 六套視覺主題：Classic、Dark、Ocean、Sakura、Bamboo、Neon。
- 使用 Web Audio 產生音效與背景音樂。
- 具備主選單、對局、設定、教學、結果畫面。

### 執行方式

直接開啟：

```text
index.html
```

或啟動本機靜態伺服器：

```bash
python -m http.server 8000
```

接著開啟：

```text
http://localhost:8000/index.html
```

### 程式結構

```text
Go_Game/
  index.html
  go_game_spec.md
  README.md
  css/
    reset.css
    variables.css
    typography.css
    layout.css
    animations.css
    components/
    themes/
  js/
    main.js
    router.js
    state.js
    config.js
    game/
    ai/
    audio/
    ui/
    utils/
```

### 程式分類

#### 入口與整體流程

- `index.html`：靜態外殼、畫面容器、CSS 與 JavaScript 載入順序。
- `js/main.js`：初始化 App、還原設定、載入初始畫面、第一次互動時解除音訊限制。
- `js/router.js`：管理畫面切換，並依主選單、對局、設定、教學、結果畫面切換 BGM。
- `js/state.js`：集中管理設定與目前對局狀態。
- `js/config.js`：棋盤大小、AI 限制、存檔槽、主題清單等共用常數。

#### 遊戲邏輯

- `js/game/board.js`：以 `Int8Array` 表示棋盤，提供索引轉換、複製、雜湊、鄰點查詢。
- `js/game/rules.js`：合法手判斷、棋塊搜尋、氣數計算、提子、禁自殺、簡化劫爭判斷。
- `js/game/scoring.js`：依棋子、提子、圍地與貼目進行終局計分。
- `js/game/history.js`：管理棋譜堆疊與 Undo 復原。

#### AI

- `js/ai/ai-random.js`：從合法手中隨機選擇。
- `js/ai/ai-greedy.js`：優先選擇提子較多的手。
- `js/ai/ai-heuristic.js`：依提子、氣、中央位置、周邊棋子評估落點。
- `js/ai/ai-mcts.js`：加入啟發式導引的限時 rollout 搜尋。
- `js/ai/ai-mcts-nn.js`：以高難度 MCTS 作為 policy 風格的進階 AI 層。
- `js/ai/ai-controller.js`：依難度選擇 AI 引擎並管理 AI 思考流程。

#### 使用者介面

- `js/ui/board-renderer.js`：Canvas 棋盤、座標、棋子、hover 預覽、星位、最後一手標記。
- `js/ui/menu-ui.js`：主選單、對局設定、存檔槽顯示、開始與讀取。
- `js/ui/game-ui.js`：對局 HUD、玩家落子、AI 落子、Pass、Undo、計分、存檔、認輸、計時器。
- `js/ui/settings-ui.js`：棋盤設定、AI 設定、主題、輔助顯示、音效音量、音樂音量。
- `js/ui/tutorial-ui.js`：規則與操作教學。
- `js/ui/modal-ui.js`：確認視窗。
- `js/ui/notification-ui.js`：Toast 通知。
- `js/ui/theme-switcher.js`：執行期間切換主題並保存設定。

#### 音訊

- `js/audio/audio-config.js`：音效音色與生成式 BGM 音階設定。
- `js/audio/audio-synth.js`：Web Audio oscillator 排程。
- `js/audio/audio-manager.js`：音效播放、BGM 循環、音訊解鎖、靜音與音量控制。

#### 工具

- `js/utils/event-bus.js`：輕量 publish/subscribe 工具。
- `js/utils/storage.js`：透過 `localStorage` 管理設定與存檔槽。
- `js/utils/math-utils.js`：Clamp、隨機選取、debounce。
- `js/utils/i18n.js`：座標標示、棋色名稱、AI 難度名稱。

#### 樣式

- `css/reset.css`：瀏覽器預設樣式重置。
- `css/variables.css`：設計 token 與預設色彩變數。
- `css/typography.css`：字體、字級與文字規則。
- `css/layout.css`：響應式版面、面板、表單、畫面容器。
- `css/animations.css`：輕量動畫。
- `css/components/`：按鈕、棋盤、主選單、Modal、分數、設定、教學、通知樣式。
- `css/themes/`：六套主題，透過覆寫共用 CSS 變數切換風格。

### 補充

- 因瀏覽器自動播放限制，音訊會在第一次使用者互動後才開始。
- 存檔會保存在目前瀏覽器的 `localStorage` 中。
- AI 目標是讓純靜態瀏覽器遊戲保持良好回應速度，不是專業級棋力分析引擎。
