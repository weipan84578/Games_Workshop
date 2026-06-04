# Jungle Chess / ジャングルチェス / 鬥獸棋

Browser-based Jungle Chess game built with HTML, CSS, and Vanilla JavaScript.

HTML、CSS、Vanilla JavaScript で作られたブラウザ版ジャングルチェスです。

使用 HTML、CSS、Vanilla JavaScript 製作的瀏覽器版鬥獸棋遊戲。

---

## Quick Navigation / 目次 / 快速導覽

| Section | 日本語 | 中文 |
|---|---|---|
| [Overview](#overview) | 概要 | 專案概覽 |
| [Quick Start](#quick-start) | 起動方法 | 快速開始 |
| [Game Features](#game-features) | ゲーム機能 | 遊戲特色 |
| [Rules](#rules) | ルール | 遊戲規則 |
| [Project Structure](#project-structure) | 構成 | 專案結構 |
| [Program Classification](#program-classification) | プログラム分類 | 程式分類 |
| [Data Models](#data-models) | データモデル | 資料模型 |
| [Settings](#settings) | 設定 | 遊戲設定 |

---

<a id="overview"></a>

## Overview / 概要 / 專案概覽

| Item | English | 日本語 | 中文 |
|---|---|---|---|
| Game | Jungle Chess, also known as Dou Shou Qi | ジャングルチェス、闘獣棋 | 鬥獸棋 |
| Mode | Human player vs computer AI | プレイヤー対コンピューター AI | 玩家對戰電腦 AI |
| Player Side | Red pieces | 赤い駒 | 紅方 |
| AI Side | Blue pieces | 青い駒 | 藍方 |
| Board | 7 columns x 9 rows | 7 列 x 9 行 | 7 欄 x 9 列 |
| Runtime | Browser only, no build step required | ブラウザのみ、ビルド不要 | 純瀏覽器執行，不需要建置 |
| Main Tech | HTML5, CSS3, Vanilla JavaScript, Canvas, Web Audio API | HTML5、CSS3、Vanilla JavaScript、Canvas、Web Audio API | HTML5、CSS3、原生 JavaScript、Canvas、Web Audio API |

---

<a id="quick-start"></a>

## Quick Start / 起動方法 / 快速開始

| Step | English | 日本語 | 中文 |
|---|---|---|---|
| 1 | Open the project folder. | プロジェクトフォルダーを開きます。 | 開啟專案資料夾。 |
| 2 | Open `index.html` in a modern browser. | `index.html` をモダンブラウザで開きます。 | 使用現代瀏覽器開啟 `index.html`。 |
| 3 | Press Start Game and play as the red side. | Start Game を押して赤側でプレイします。 | 點選開始遊戲，以紅方開始對戰。 |

```text
Jungle_Chess/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── main.js
```

Recommended browsers: Chrome, Edge, Firefox, Safari.

推奨ブラウザ: Chrome、Edge、Firefox、Safari。

建議瀏覽器：Chrome、Edge、Firefox、Safari。

---

<a id="game-features"></a>

## Game Features / ゲーム機能 / 遊戲特色

| Feature | English | 日本語 | 中文 |
|---|---|---|---|
| Single page game | Home, rules, settings, game board, and result screens are handled in one page. | ホーム、ルール、設定、盤面、結果画面を 1 ページで管理します。 | 首頁、規則、設定、棋盤、結果畫面都在單頁內切換。 |
| AI opponent | AI uses move generation, board evaluation, Minimax, and Alpha-Beta pruning. | AI は合法手生成、局面評価、Minimax、Alpha-Beta 枝刈りを使用します。 | AI 使用合法走法生成、局面評分、Minimax 與 Alpha-Beta 剪枝。 |
| Theme maps | Five map themes with different river layouts, colors, icons, and particles. | 5 種マップテーマがあり、川の配置、色、アイコン、粒子演出が変わります。 | 內建 5 種地圖主題，包含不同河流配置、色彩、地形文字與粒子效果。 |
| Responsive board | CSS variables and JavaScript checks keep the 7 x 9 board inside small screens. | CSS 変数と JavaScript の補正で小画面でも盤面を収めます。 | 使用 CSS 變數與 JavaScript 校正，讓 7 x 9 棋盤適應小螢幕。 |
| Audio | Web Audio API generates SFX and simple BGM without external audio files. | Web Audio API で外部音源なしに効果音と簡易 BGM を生成します。 | 透過 Web Audio API 產生音效與簡易背景音樂，不依賴外部音檔。 |
| Local settings | Settings are saved in `localStorage`. | 設定は `localStorage` に保存されます。 | 設定會儲存在 `localStorage`。 |
| Accessibility basics | Board cells use grid roles, labels, focus, and live announcements. | 盤面セルには grid role、ラベル、フォーカス、ライブ通知があります。 | 棋盤格具備 grid role、標籤、焦點與即時狀態通知。 |

---

<a id="rules"></a>

## Rules / ルール / 遊戲規則

### Win Conditions / 勝利条件 / 勝利條件

| English | 日本語 | 中文 |
|---|---|---|
| Enter the opponent's den. | 相手の巣穴に入る。 | 進入對方獸穴。 |
| Capture all opponent pieces. | 相手の駒をすべて取る。 | 吃掉對方所有棋子。 |
| Opponent has no legal move. | 相手に合法手がない。 | 對方無合法走法。 |
| Opponent surrenders. | 相手が投了する。 | 對方投降。 |

### Pieces / 駒 / 棋子

| Rank | English | 日本語 | 中文 | Icon | Key Rule |
|---:|---|---|---|---|---|
| 8 | Elephant | 象 | 象 | 🐘 | Strongest rank, but cannot capture Rat. |
| 7 | Lion | ライオン / 獅 | 獅 | 🦁 | Can jump across river in a straight line if no Rat blocks the river path. |
| 6 | Tiger | トラ / 虎 | 虎 | 🐯 | Can jump across river in a straight line if no Rat blocks the river path. |
| 5 | Leopard | ヒョウ / 豹 | 豹 | 🐆 | Moves one square orthogonally. |
| 4 | Wolf | オオカミ / 狼 | 狼 | 🐺 | Moves one square orthogonally. |
| 3 | Dog | イヌ / 犬 | 狗 | 🐶 | Moves one square orthogonally. |
| 2 | Cat | ネコ / 猫 | 貓 | 🐱 | Moves one square orthogonally. |
| 1 | Rat | ネズミ / 鼠 | 鼠 | 🐭 | Only piece that can enter river; can capture Elephant on land. |

### Movement and Capture / 移動と捕獲 / 移動與吃子

| Rule | English | 日本語 | 中文 |
|---|---|---|---|
| Basic movement | Pieces move up, down, left, or right by one square. | 駒は上下左右に 1 マス移動します。 | 棋子每次可往上下左右移動一格。 |
| Own den | A piece cannot enter its own den. | 自分の巣穴には入れません。 | 棋子不可進入己方獸穴。 |
| River | Only Rat can enter river squares. | 川に入れるのはネズミだけです。 | 只有鼠可以進入河流格。 |
| Lion and Tiger jump | Lion and Tiger can jump over connected river squares. A Rat in the river blocks the jump. | ライオンとトラは連続した川を飛び越えられます。川の中にネズミがいると飛べません。 | 獅與虎可沿直線跳過連續河流；若路徑中有鼠則不能跳。 |
| Normal capture | A piece captures an enemy piece with equal or lower effective rank. | 有効ランクが同じか低い敵駒を取れます。 | 棋子可吃同等級或較低有效等級的敵棋。 |
| Trap | Enemy pieces inside your trap have effective rank 0. | 自分側の罠に入った敵駒の有効ランクは 0 になります。 | 敵方棋子進入己方陷阱時，有效等級降為 0。 |
| Rat vs Elephant | Rat can capture Elephant on land; Elephant cannot capture Rat. | ネズミは陸上で象を取れます。象はネズミを取れません。 | 鼠在陸地可吃象；象不能吃鼠。 |
| River capture limit | A Rat in river cannot capture a land Elephant. | 川の中のネズミは陸上の象を取れません。 | 河中的鼠不能吃陸地上的象。 |

---

## Maps / マップ / 地圖

| ID | English | 日本語 | 中文 | Effect / 効果 / 效果 |
|---|---|---|---|---|
| `classic` | Classic Jungle | 经典ジャングル | 經典叢林 | Standard river layout, leaf-style background particles. |
| `arctic` | Arctic Tundra | 氷原凍土 | 冰原凍土 | Ice-colored board, snow particles, Guqin-style BGM. |
| `desert` | Desert Ruins | 砂漠遺跡 | 沙漠遺跡 | Scattered oasis rivers, sand particles. |
| `volcanic` | Warm River Canyon | 温河峡谷 | 溫河峽谷 | Warm color palette, animated river styling, spark particles. |
| `ink` | Ink Landscape | 水墨山河 | 水墨山河 | Ink-style board colors, Guqin-style BGM. |

Map selection can be random or fixed in the settings screen.

設定画面でランダムまたは固定マップを選択できます。

可在設定畫面選擇隨機地圖或固定地圖。

---

<a id="project-structure"></a>

## Project Structure / 構成 / 專案結構

| Path | English | 日本語 | 中文 |
|---|---|---|---|
| `index.html` | Main HTML shell and all screen containers. | メイン HTML と各画面のコンテナ。 | 主要 HTML 入口與所有畫面容器。 |
| `css/styles.css` | Visual design, responsive layout, board grid, piece styling, animations, map theme classes. | 見た目、レスポンシブ、盤面グリッド、駒スタイル、アニメーション、マップテーマ。 | 視覺樣式、響應式版面、棋盤格線、棋子樣式、動畫與地圖主題。 |
| `js/main.js` | Game rules, state, AI, rendering, settings, audio, particles, and UI events. | ルール、状態、AI、描画、設定、音声、粒子、UI イベント。 | 遊戲規則、狀態、AI、畫面渲染、設定、音效、粒子與 UI 事件。 |
| `Jungle_Chess_spec_v1.0.md` | Original design/specification note. | 初期設計仕様メモ。 | 初版設計規格文件。 |
| `Jungle_Chess_spec_v1.1.md` | Later revision/specification note. | 改訂版仕様メモ。 | 後續修訂規格文件。 |

---

<a id="program-classification"></a>

## Program Classification / プログラム分類 / 程式分類

The current project keeps all JavaScript in `js/main.js`, but the code is logically divided into the following parts.

現在の JavaScript は `js/main.js` に集約されていますが、論理的には以下の分類に分かれています。

目前 JavaScript 集中在 `js/main.js`，但邏輯上可分成以下模組。

| Category | Main Code | English | 日本語 | 中文 |
|---|---|---|---|---|
| Constants | `ROWS`, `COLS`, `RED`, `BLUE`, `PIECE_VALUE`, `DIFFICULTY_DEPTH` | Shared values for board size, players, piece scores, and AI depth. | 盤面サイズ、陣営、駒評価値、AI 深さを定義します。 | 定義棋盤大小、玩家顏色、棋子分數與 AI 搜尋深度。 |
| Piece data | `PIECE_INFO`, `PIECE_META`, `INITIAL_PIECES` | Piece names, icons, ranks, descriptions, and starting positions. | 駒名、アイコン、ランク、説明、初期配置。 | 棋子名稱、圖示、等級、說明與初始位置。 |
| Map data | `MAP_THEMES` | Theme colors, terrain icons, river layouts, particles, and default BGM. | テーマ色、地形表示、川配置、粒子、標準 BGM。 | 地圖配色、地形文字、河流配置、粒子效果與預設 BGM。 |
| Settings storage | `SettingsStore`, `DEFAULT_SETTINGS`, `SETTINGS_KEY` | Loads, drafts, saves, resets, and discards settings through `localStorage`. | `localStorage` を使って設定の読込、編集中、保存、リセット、破棄を行います。 | 使用 `localStorage` 管理設定讀取、草稿、儲存、重設與放棄。 |
| Game state | `createInitialState`, `cloneState`, `applyMoveToState` | Creates the board state and applies moves without directly mutating the original state. | 盤面状態を作成し、手を適用します。 | 建立棋局狀態並套用走法。 |
| Terrain logic | `terrainAt`, `isRiver`, `isOwnDen`, `effectiveRank` | Resolves river, trap, den, and effective piece rank. | 川、罠、巣穴、有効ランクを判定します。 | 判斷河流、陷阱、獸穴與棋子有效等級。 |
| Rule engine | `canCapture`, `jumpTarget`, `getLegalMovesForPiece`, `getAllLegalMoves`, `checkWinner` | Validates movement, captures, jumps, and win conditions. | 移動、捕獲、ジャンプ、勝敗条件を判定します。 | 驗證移動、吃子、跳河與勝負條件。 |
| AI engine | `evaluateBoard`, `orderMoves`, `minimax`, `getBestAIMove` | Scores board positions and chooses AI moves using Minimax with Alpha-Beta pruning. | 局面を評価し、Minimax と Alpha-Beta 枝刈りで AI 手を選びます。 | 評估局面並使用 Minimax 與 Alpha-Beta 剪枝選擇 AI 走法。 |
| Renderer | `renderBoard`, `renderPiece`, `renderStatus`, `updatePieceInfoCard` | Builds board cells, pieces, status panels, highlights, and piece info. | 盤面セル、駒、状態表示、ハイライト、駒情報を描画します。 | 產生棋盤格、棋子、狀態欄、高亮提示與棋子資訊卡。 |
| Map manager | `selectMap`, `applyMapTheme`, `showMapNameToast` | Selects a map, applies CSS variables, starts particles, and shows map toast. | マップ選択、CSS 変数適用、粒子開始、トースト表示を行います。 | 選擇地圖、套用 CSS 變數、啟動粒子並顯示地圖提示。 |
| Audio | `AudioManager` | Generates SFX and BGM using Web Audio API oscillators. | Web Audio API の oscillator で効果音と BGM を生成します。 | 使用 Web Audio API oscillator 產生音效與背景音樂。 |
| Canvas effects | `startParticles`, `playCaptureEffect`, `resizeCanvas` | Draws background particles and capture effects on canvas. | Canvas で背景粒子と捕獲演出を描画します。 | 使用 Canvas 繪製背景粒子與吃子特效。 |
| UI controller | `bindUI`, `showScreen`, `syncSettingsForm`, `renderMapOptions` | Handles clicks, route changes, settings form sync, keyboard shortcuts, and screen switching. | クリック、ルート変更、設定同期、ショートカット、画面切替を処理します。 | 處理點擊、路由切換、設定同步、快捷鍵與畫面切換。 |

---

## Screen Classification / 画面分類 / 畫面分類

| Screen | HTML ID | English | 日本語 | 中文 |
|---|---|---|---|---|
| Home | `screen-home` | Title, start button, rules button, settings button, quick volume controls. | タイトル、開始、ルール、設定、音量クイック操作。 | 標題、開始、規則、設定與快速音量控制。 |
| Settings | `screen-settings` | AI difficulty, volume, map, display options, save/reset. | AI 難易度、音量、マップ、表示設定、保存/リセット。 | AI 難度、音量、地圖、顯示選項、儲存/重設。 |
| Rules | `screen-rules` | Explains win conditions, pieces, ranks, terrain, river, trap, and den. | 勝利条件、駒、ランク、地形、川、罠、巣穴を説明します。 | 說明勝利條件、棋子、等級、地形、河流、陷阱與獸穴。 |
| Game | `screen-game` | Main board, AI panel, player panel, captured pieces, actions. | 盤面、AI パネル、プレイヤーパネル、取られた駒、操作ボタン。 | 主要棋盤、AI 面板、玩家面板、被吃棋子與操作按鈕。 |
| Result | `screen-result` | Shows winner, reason, restart, and home button. | 勝者、理由、再戦、ホームボタンを表示します。 | 顯示勝負結果、原因、再玩一局與回首頁。 |

---

<a id="data-models"></a>

## Data Models / データモデル / 資料模型

| Model | Fields | English | 日本語 | 中文 |
|---|---|---|---|---|
| Piece | `id`, `type`, `rank`, `color`, `col`, `row`, `isAlive`, `emoji`, `chineseName` | Represents one animal piece. | 1 つの動物駒を表します。 | 表示單一動物棋子。 |
| Board State | `cells`, `pieces`, `currentTurn`, `gameStatus`, `winner`, `winReason`, `moveHistory`, `capturedPieces`, `undoCount` | Complete runtime game state. | 実行中のゲーム状態全体。 | 完整的遊戲執行狀態。 |
| Move | `piece`, `fromCol`, `fromRow`, `toCol`, `toRow`, `capturedPiece`, `isJump`, `timestamp` | One movement record. | 1 手分の移動記録。 | 一筆走法紀錄。 |
| Map Theme | `id`, `name`, `icon`, `description`, `riverCells`, `cssVars`, `terrainIcons`, `particleEffect`, `particleConfig`, `defaultBGM` | Theme and terrain configuration. | テーマと地形の設定。 | 地圖主題與地形配置。 |
| Settings | `aiDifficulty`, `sfxVolume`, `bgmVolume`, `showMovableSquares`, `showCoordinates`, `showAIThinkAnimation`, `fixedMapId` | Player preferences saved locally. | ローカル保存されるプレイヤー設定。 | 儲存在本機的玩家偏好設定。 |

---

<a id="settings"></a>

## Settings / 設定 / 遊戲設定

| Setting | Values | English | 日本語 | 中文 |
|---|---|---|---|---|
| AI Difficulty | `easy`, `normal`, `hard`, `expert` | Controls AI search depth. | AI の探索深さを制御します。 | 控制 AI 搜尋深度。 |
| SFX Volume | `0` - `100` | Sound effect volume. | 効果音の音量。 | 音效音量。 |
| BGM Volume | `0` - `100` | Background music volume. | BGM の音量。 | 背景音樂音量。 |
| Map | `random` or map ID | Choose random map or a fixed map. | ランダムまたは固定マップを選びます。 | 選擇隨機地圖或固定地圖。 |
| Movable Squares | `true` / `false` | Show legal move hints. | 合法手のヒントを表示します。 | 顯示可移動格提示。 |
| Coordinates | `true` / `false` | Show board coordinates. | 盤面座標を表示します。 | 顯示棋盤座標。 |
| AI Thinking Animation | `true` / `false` | Show AI thinking animation. | AI 思考中アニメーションを表示します。 | 顯示 AI 思考動畫。 |

---

## AI Difficulty / AI 難易度 / AI 難度

| Difficulty | Search Depth | English | 日本語 | 中文 |
|---|---:|---|---|---|
| `easy` | 1 | Includes a small random move chance. | 少しランダムな手を選ぶ可能性があります。 | 會有少量隨機走法。 |
| `normal` | 2 | Balanced default. | 標準設定です。 | 預設平衡難度。 |
| `hard` | 3 | Searches deeper for stronger play. | より深く探索します。 | 搜尋更深，棋力較強。 |
| `expert` | 4 | Highest current AI depth. | 現在最も高い探索深さです。 | 目前最高 AI 搜尋深度。 |

---

## Development Notes / 開発メモ / 開發筆記

| Topic | English | 日本語 | 中文 |
|---|---|---|---|
| No build step | The game can run directly from `index.html`. | `index.html` から直接実行できます。 | 可直接執行 `index.html`。 |
| No framework | The project uses plain JavaScript and DOM APIs. | フレームワークなしで DOM API を使用しています。 | 使用原生 JavaScript 與 DOM API。 |
| Styling | CSS variables drive board size, color themes, spacing, and responsive behavior. | CSS 変数で盤面サイズ、配色、余白、レスポンシブを管理します。 | 使用 CSS 變數控制棋盤尺寸、配色、間距與響應式行為。 |
| Persistence | Settings are stored in browser `localStorage`. | 設定はブラウザの `localStorage` に保存されます。 | 設定儲存在瀏覽器 `localStorage`。 |
| Audio unlock | Audio starts after the first pointer interaction because browsers restrict autoplay. | ブラウザの自動再生制限により、最初の操作後に音声を初期化します。 | 因瀏覽器自動播放限制，音訊會在第一次互動後初始化。 |

---

## Possible Future Split / 将来の分割案 / 未來可拆分方向

| Future File | English | 日本語 | 中文 |
|---|---|---|---|
| `js/constants.js` | Shared constants and piece metadata. | 共通定数と駒メタデータ。 | 共用常數與棋子資料。 |
| `js/settings.js` | `SettingsStore` and default settings. | `SettingsStore` と標準設定。 | 設定儲存類別與預設設定。 |
| `js/game-engine.js` | Rules, legal moves, capture, win checks. | ルール、合法手、捕獲、勝敗判定。 | 規則、合法走法、吃子與勝負判定。 |
| `js/ai.js` | Evaluation, move ordering, Minimax. | 評価、手の並び替え、Minimax。 | 局面評分、走法排序與 Minimax。 |
| `js/renderer.js` | Board and piece rendering. | 盤面と駒の描画。 | 棋盤與棋子渲染。 |
| `js/audio.js` | SFX and BGM generation. | 効果音と BGM 生成。 | 音效與背景音樂生成。 |
| `js/effects.js` | Canvas particles and capture effects. | Canvas 粒子と捕獲演出。 | Canvas 粒子與吃子特效。 |
| `js/ui.js` | Screen routing, buttons, forms, keyboard input. | 画面遷移、ボタン、フォーム、キーボード入力。 | 畫面路由、按鈕、表單與鍵盤操作。 |

---

## Version / バージョン / 版本

| Item | Value |
|---|---|
| Current project label | v1.1 |
| Runtime | Static browser app |
| Main gameplay | Player red side vs AI blue side |
