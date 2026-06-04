# Solitaire

A browser-based Klondike Solitaire game built with HTML, CSS, Vanilla JavaScript, Vite, and Vitest.

ブラウザで遊べるクロンダイク・ソリティアです。HTML、CSS、Vanilla JavaScript、Vite、Vitest で構成されています。

這是一款以 HTML、CSS、Vanilla JavaScript、Vite、Vitest 製作的網頁版 Klondike Solitaire 接龍遊戲。

## Table of Contents

| Section | English | 日本語 | 中文 |
|---|---|---|---|
| [Project Snapshot](#project-snapshot) | What this project is | プロジェクト概要 | 專案概要 |
| [Quick Start](#quick-start) | Install, run, build, test | 導入、実行、ビルド、テスト | 安裝、執行、建置、測試 |
| [Game Introduction](#game-introduction) | Game concept and player goal | ゲーム紹介と目的 | 遊戲介紹與目標 |
| [Gameplay Reference](#gameplay-reference) | Rules, controls, settings, scoring | ルール、操作、設定、スコア | 規則、操作、設定、計分 |
| [Program Classification](#program-classification) | File and module responsibilities | ファイルとモジュール分類 | 程式檔案分類 |
| [Data and Persistence](#data-and-persistence) | State model and localStorage keys | 状態モデルと保存キー | 狀態模型與儲存鍵值 |
| [Testing](#testing) | Current test coverage | 現在のテスト範囲 | 目前測試範圍 |
| [Maintenance Notes](#maintenance-notes) | Practical notes for future edits | 今後の保守メモ | 後續維護注意事項 |

## Project Snapshot

| Item | English | 日本語 | 中文 |
|---|---|---|---|
| Game | Klondike Solitaire | クロンダイク・ソリティア | Klondike 接龍 |
| Platform | Browser web game | ブラウザ向け Web ゲーム | 瀏覽器網頁遊戲 |
| Main stack | HTML5, CSS3, Vanilla JavaScript | HTML5、CSS3、Vanilla JavaScript | HTML5、CSS3、原生 JavaScript |
| Tooling | Vite for development/build, Vitest for unit tests | Vite で開発/ビルド、Vitest で単体テスト | Vite 開發/建置，Vitest 單元測試 |
| Runtime entry | `index.html` loads `src/main.bundle.js` | `index.html` が `src/main.bundle.js` を読み込みます | `index.html` 目前載入 `src/main.bundle.js` |
| Modular source | Core source modules are under `src/` | 主要なソースモジュールは `src/` 配下です | 核心模組位於 `src/` |
| Storage | Browser `localStorage` | ブラウザの `localStorage` | 瀏覽器 `localStorage` |
| Version | `1.0.0` from `package.json` | `package.json` 上は `1.0.0` | `package.json` 版本為 `1.0.0` |

## Quick Start

| Command | English | 日本語 | 中文 |
|---|---|---|---|
| `npm install` | Install dependencies | 依存パッケージをインストール | 安裝相依套件 |
| `npm run dev` | Start the Vite development server | Vite 開発サーバーを起動 | 啟動 Vite 開發伺服器 |
| `npm run build` | Build the production output into `dist/` | 本番用ファイルを `dist/` にビルド | 建置正式版輸出到 `dist/` |
| `npm run preview` | Preview the built output | ビルド済みファイルをプレビュー | 預覽建置結果 |
| `npm test` | Run Vitest once | Vitest を 1 回実行 | 執行一次 Vitest |
| `npm run test:watch` | Run Vitest in watch mode | Vitest を watch モードで実行 | 以監看模式執行 Vitest |
| `npm run serve` | Serve the current folder with `npx serve .` | `npx serve .` で現在のフォルダを配信 | 使用 `npx serve .` 提供目前資料夾 |

## Game Introduction

| Language | Introduction |
|---|---|
| English | Solitaire is a single-player Klondike card game. The player sorts a shuffled 52-card deck into four foundation piles, one suit per pile, from Ace to King. The game supports Draw-1 and Draw-3 modes, optional relaxed rules, scoring, timer, undo, hints, auto-complete, save data, and leaderboards. |
| 日本語 | Solitaire は 1 人用のクロンダイクカードゲームです。シャッフルされた 52 枚のカードを、スートごとに A から K まで 4 つの foundation へ並べることが目的です。Draw-1 / Draw-3、任意の緩和ルール、スコア、タイマー、Undo、ヒント、自動完成、セーブ、ランキングに対応しています。 |
| 中文 | Solitaire 是單人 Klondike 接龍遊戲。玩家需要將洗好的 52 張牌，依照花色從 A 到 K 移到四個 foundation 目標牌堆。本專案支援 Draw-1 / Draw-3、可調整規則、計分、計時、悔棋、提示、自動完成、存檔與排行榜。 |

### Feature Matrix

| Feature | English | 日本語 | 中文 |
|---|---|---|---|
| Draw modes | Draw-1 and Draw-3 | Draw-1 と Draw-3 | 一次抽 1 張與一次抽 3 張 |
| Move input | Click-to-move, double-click to foundation, drag and drop, touch dragging | クリック移動、ダブルクリックで foundation へ移動、ドラッグ、タッチ操作 | 點擊移動、雙擊移到 foundation、拖放、觸控拖曳 |
| Assistance | Hint search, auto-foundation option, auto-complete when safe | ヒント検索、自動 foundation、条件達成後の自動完成 | 提示搜尋、自動移到 foundation、條件達成後自動完成 |
| Game flow | New game, continue saved game, pause, restart, no-move dialog, win dialog | 新規開始、保存データ継続、一時停止、再開、手詰まり通知、勝利画面 | 新遊戲、繼續存檔、暫停、重新開始、無可用移動提示、勝利畫面 |
| Score tracking | Score, elapsed time, move count, stars | スコア、経過時間、手数、星評価 | 分數、時間、步數、星級 |
| Persistence | Save game, settings, and per-mode leaderboard in `localStorage` | セーブ、設定、モード別ランキングを `localStorage` に保存 | 遊戲存檔、設定、不同模式排行榜皆存在 `localStorage` |
| Visual styles | Classic, Dark, Retro themes; four card-back styles | Classic、Dark、Retro テーマ、4 種類のカード裏面 | Classic、Dark、Retro 三種主題與四種牌背 |
| Audio | Web Audio API generated BGM and SFX; no external sound files needed | Web Audio API で BGM / 効果音を生成、外部音声不要 | 使用 Web Audio API 合成背景音樂與音效，不需外部音檔 |
| Responsive layout | CSS variables resize cards and board spacing by viewport | CSS 変数でカードと盤面間隔をレスポンシブ調整 | 使用 CSS 變數依畫面尺寸調整卡牌與版面間距 |

## Gameplay Reference

### Core Rules

| Area | English | 日本語 | 中文 |
|---|---|---|---|
| Deck | Uses a normal 52-card deck: Spades, Hearts, Diamonds, Clubs. | 通常の 52 枚デッキを使用します。スペード、ハート、ダイヤ、クラブです。 | 使用標準 52 張牌：黑桃、紅心、方塊、梅花。 |
| Initial deal | Seven tableau columns receive 1 to 7 cards. Only the top card in each column is face up. The remaining 24 cards become the stock. | 7 列の tableau に 1 枚から 7 枚まで配ります。各列の一番上だけ表向きです。残り 24 枚は stock になります。 | 七個 tableau 牌列分別發 1 到 7 張牌，每列只有最上方為正面，剩下 24 張為 stock。 |
| Goal | Move all cards to four foundations from Ace to King by suit. | すべてのカードをスートごとに A から K まで foundation へ移します。 | 將所有牌依花色從 A 到 K 移到四個 foundation。 |
| Tableau default | Build descending sequences with alternating colors. Empty tableau accepts only King by default. | 標準では色違いで降順に並べます。空の tableau は標準では K のみ受け付けます。 | 預設依紅黑交錯且遞減排列，空 tableau 預設只接受 K。 |
| Foundation | Foundation starts with Ace, then same suit ascending to King. | foundation は A から始まり、同じスートで K まで昇順に積みます。 | Foundation 從 A 開始，同花色依序往上疊到 K。 |
| Stock and waste | Clicking stock draws cards into waste. Draw-3 shows up to three waste cards, but only the top usable card is moved. | stock をクリックすると waste にカードを引きます。Draw-3 では最大 3 枚表示されますが、移動できるのは一番上のカードです。 | 點擊 stock 抽牌到 waste。Draw-3 會顯示最多三張 waste，但只有最上層可移動。 |
| Win condition | The game is won when all four foundations contain 13 cards. | 4 つの foundation がそれぞれ 13 枚になれば勝利です。 | 四個 foundation 都累積 13 張牌即完成遊戲。 |
| No-move check | If no move, no auto-complete, and no allowed recycle remain, the game shows a no-move dialog. | 移動、自動完成、再循環ができない場合、手詰まりダイアログを表示します。 | 若沒有可移動牌、自動完成不可用，且不能再循環牌堆，會顯示無可用移動提示。 |

### Controls

| Control | English | 日本語 | 中文 |
|---|---|---|---|
| Click stock | Draw from stock or recycle waste when allowed. | stock からカードを引く、または許可時に waste を再循環します。 | 從 stock 抽牌，或在允許時將 waste 循環回 stock。 |
| Click card | Select a card or selected sequence, then click a valid destination. | カードまたは連続カードを選択し、有効な移動先をクリックします。 | 選取單張牌或連續牌，再點擊合法目的地。 |
| Double-click card | Try to move the card directly to foundation. | カードを foundation に直接移動できるか試します。 | 嘗試將該牌直接移到 foundation。 |
| Drag and drop | Drag movable cards to highlighted valid piles. | 移動可能なカードを有効な置き場へドラッグします。 | 將可移動的牌拖曳到合法牌堆。 |
| Touch | Touch dragging mirrors mouse dragging. | タッチドラッグはマウスドラッグと同様です。 | 觸控拖曳與滑鼠拖曳邏輯一致。 |
| `Space` | Draw from stock during game screen. | ゲーム画面で stock から引きます。 | 在遊戲畫面從 stock 抽牌。 |
| `Ctrl+Z` / `Cmd+Z` | Undo the previous recorded state. | 直前の記録状態へ戻します。 | 悔棋回到上一個紀錄狀態。 |
| `H` | Show a hint and subtract hint score. | ヒントを表示し、ヒント分のスコアを減算します。 | 顯示提示並扣除提示分數。 |
| `Esc` | Pause game or close non-pause modal. | ゲームを一時停止、または一部モーダルを閉じます。 | 暫停遊戲或關閉非暫停彈窗。 |
| `M` | Toggle mute. | ミュート切り替え。 | 切換靜音。 |

### Settings

| Setting | Default | English | 日本語 | 中文 |
|---|---:|---|---|---|
| `drawMode` | `1` | Draw one or three cards. | 1 枚引き / 3 枚引きを選択します。 | 選擇一次抽 1 張或 3 張。 |
| `unlimitedDraw` | `true` | Allow stock recycling after stock is empty. | stock が空になった後の再循環を許可します。 | 允許 stock 抽完後重新循環。 |
| `foundationMovable` | `true` | Allow moving cards back from foundation to tableau. | foundation から tableau へ戻すことを許可します。 | 允許從 foundation 移回 tableau。 |
| `freeEmpty` | `false` | If enabled, any card may move into an empty tableau. | 有効時、空の tableau に任意のカードを置けます。 | 啟用後任意牌可放入空 tableau。 |
| `stackMode` | `alt-color` | Tableau sequence mode: alternating color, same suit, or rank-only any color. | tableau の積み方を、色違い、同スート、ランクのみから選びます。 | Tableau 疊牌規則可選紅黑交錯、同花色、或只看點數。 |
| `theme` | `classic` | Visual theme: Classic, Dark, Retro. | 表示テーマは Classic、Dark、Retro です。 | 視覺主題為 Classic、Dark、Retro。 |
| `cardBack` | `blue-diamond` | Card back style. | カード裏面デザイン。 | 牌背樣式。 |
| `bgmVolume` | `0.7` | Background music volume. | BGM 音量。 | 背景音樂音量。 |
| `sfxVolume` | `0.8` | Sound effect volume. | 効果音量。 | 音效音量。 |
| `animationSpeed` | `normal` | Animation speed: fast, normal, slow. | アニメーション速度: fast、normal、slow。 | 動畫速度：fast、normal、slow。 |
| `showMoves` | `true` | Show move counter in toolbar. | ツールバーに手数を表示します。 | 在工具列顯示步數。 |
| `autoFoundation` | `false` | Automatically move safe tableau cards to foundation after a move. | 移動後、安全な tableau カードを自動で foundation へ送ります。 | 移動後自動將可移動牌送到 foundation。 |

### Scoring

| Event | Points | English | 日本語 | 中文 |
|---|---:|---|---|---|
| Waste to tableau | `+5` | Rewards useful stock card placement. | stock 由来カードの有効配置を加点します。 | Waste 牌移到 tableau 加分。 |
| Waste to foundation | `+10` | Rewards direct foundation progress. | foundation への直接進行を加点します。 | Waste 牌移到 foundation 加分。 |
| Tableau to foundation | `+10` | Rewards clearing tableau cards into foundations. | tableau から foundation への移動を加点します。 | Tableau 牌移到 foundation 加分。 |
| Flip tableau card | `+5` | Rewards revealing hidden cards. | 裏向きカードを表にした時に加点します。 | 翻開 tableau 隱藏牌加分。 |
| Foundation to tableau | `-15` | Penalizes moving cards backward. | foundation から戻す操作を減点します。 | 從 foundation 移回 tableau 扣分。 |
| Use hint | `-10` | Hint use costs points. | ヒント使用で減点します。 | 使用提示扣分。 |
| Draw-3 recycle | `-20` | Draw-3 stock recycle costs points. | Draw-3 の再循環で減点します。 | Draw-3 循環牌堆扣分。 |
| Time bonus | `floor(700000 / seconds)` | Added on win; score is clamped to zero or above. | 勝利時に加算され、スコアは 0 未満になりません。 | 勝利時計入，分數最低不低於 0。 |

### Star Rating

| Draw mode | 5 stars | 4 stars | 3 stars | 2 stars | 1 star |
|---|---|---|---|---|---|
| Draw-1 | Time `< 180s` and score `> 8000` | Time `< 300s` and score `> 6000` | Time `< 480s` | Time `< 900s` | Otherwise |
| Draw-3 | Time `< 300s` and score `> 6000` | Time `< 480s` and score `> 4000` | Time `< 720s` | Time `< 1200s` | Otherwise |

## Program Classification

### Architecture Overview

| Layer | Files | English | 日本語 | 中文 |
|---|---|---|---|---|
| App shell | `index.html` | Defines screens, toolbar, modals, toast container, drag ghost, and confetti container. | 画面、ツールバー、モーダル、トースト、ドラッグ用 ghost、紙吹雪コンテナを定義します。 | 定義畫面、工具列、彈窗、toast、拖曳 ghost、勝利彩帶容器。 |
| Runtime script | `src/main.bundle.js` | Current script loaded by `index.html`; bundled browser runtime. | `index.html` が現在読み込むブラウザ実行用 bundle です。 | 目前由 `index.html` 載入的瀏覽器執行 bundle。 |
| Modular app source | `src/main.js`, `src/**` | Modular source version for game orchestration and feature logic. | ゲーム制御と機能ロジックのモジュール版ソースです。 | 模組化原始碼，負責遊戲整合與功能邏輯。 |
| Game logic | `src/game/*` | Pure rules, deck, scoring, hint, and auto-complete helpers. | ルール、デッキ、スコア、ヒント、自動完成の補助ロジックです。 | 純遊戲規則、牌組、計分、提示與自動完成邏輯。 |
| State | `src/state/*` | In-memory game, settings, and undo history state. | メモリ上のゲーム、設定、Undo 履歴状態です。 | 記憶體中的遊戲狀態、設定狀態、悔棋歷史。 |
| UI | `src/ui/*` | DOM rendering, screen switching, animation helpers, and interaction utilities. | DOM 描画、画面切替、アニメーション、操作補助です。 | DOM 渲染、畫面切換、動畫與互動輔助。 |
| Storage | `src/storage/*` | Save game and leaderboard persistence through `localStorage`. | `localStorage` によるセーブとランキング保存です。 | 使用 `localStorage` 儲存遊戲與排行榜。 |
| Audio | `src/audio/*` | Web Audio API synthesizer and track/SFX keys. | Web Audio API シンセサイザーと音源キー定義です。 | Web Audio API 合成器與音軌/音效鍵值。 |
| Styling | `style/*` | CSS variables, responsive board, cards, buttons, modals, screens, themes. | CSS 変数、レスポンシブ盤面、カード、ボタン、モーダル、画面、テーマです。 | CSS 變數、響應式牌桌、卡牌、按鈕、彈窗、畫面與主題。 |
| Tests | `tests/*` | Unit tests for deck, rules, and scoring. | デッキ、ルール、スコアの単体テストです。 | 牌組、規則、計分的單元測試。 |

### File-Level Responsibilities

| Path | Category | English | 日本語 | 中文 |
|---|---|---|---|---|
| `index.html` | App shell | Contains all screen markup: menu, game board, settings, leaderboard, and modals. | メニュー、ゲーム盤、設定、ランキング、モーダルの HTML を持ちます。 | 包含主選單、遊戲桌、設定、排行榜、彈窗 HTML。 |
| `package.json` | Tooling | Defines Vite, Vitest, and npm scripts. | Vite、Vitest、npm scripts を定義します。 | 定義 Vite、Vitest 與 npm 指令。 |
| `src/main.bundle.js` | Runtime bundle | Browser bundle currently referenced by `index.html`. | `index.html` から参照される現在の bundle です。 | 目前被 `index.html` 直接引用的瀏覽器 bundle。 |
| `src/main.js` | Main coordinator | Boots the app, binds events, renders board, handles moves, timer, win flow, settings UI, and leaderboard UI. | アプリ起動、イベント登録、盤面描画、移動、タイマー、勝利処理、設定 UI、ランキング UI を統合します。 | 啟動應用、綁定事件、渲染牌桌、處理移動/計時/勝利/設定/排行榜。 |
| `src/router.js` | Navigation | Provides route-to-screen navigation and menu floating-card decoration. | 画面遷移とメニュー背景の浮遊カード演出を提供します。 | 提供畫面路由切換與主選單浮動卡牌效果。 |
| `src/game/deck.js` | Game logic | Creates 52 unique cards, shuffles them, and deals the initial tableau/stock. | 52 枚カード生成、シャッフル、初期 tableau / stock 配布を行います。 | 建立 52 張唯一卡牌、洗牌、發初始牌列與 stock。 |
| `src/game/rules.js` | Game logic | Validates tableau/foundation moves, movable sequences, and whether any move exists. | tableau / foundation 移動、連続カード、手の有無を判定します。 | 判斷 tableau/foundation 移動、可移動連續牌與是否有可用移動。 |
| `src/game/scoring.js` | Game logic | Defines scoring constants, time bonus, zero clamp, and star calculation. | スコア定数、時間ボーナス、0 下限、星評価を定義します。 | 定義計分常數、時間獎勵、最低 0 分、星級計算。 |
| `src/game/solver.js` | Assistance | Finds the next hint by priority: foundation, reveal move, tableau move, waste move, draw. | 優先順位に従い、foundation、裏返し解放、tableau、waste、draw のヒントを探します。 | 依序尋找 foundation、翻開隱藏牌、tableau 移動、waste 移動、抽牌提示。 |
| `src/game/autoComplete.js` | Assistance | Checks if auto-complete is safe and returns the next foundation move. | 自動完成が安全か判定し、次の foundation 移動を返します。 | 判斷是否可自動完成，並回傳下一步 foundation 移動。 |
| `src/state/gameState.js` | State | Holds the current game state and initializes a fresh shuffled game. | 現在のゲーム状態を保持し、新規シャッフルゲームを初期化します。 | 保存目前遊戲狀態並初始化新的洗牌局。 |
| `src/state/settingsState.js` | State | Loads, saves, updates, and resets user settings. | ユーザー設定の読み込み、保存、更新、リセットを行います。 | 載入、儲存、更新、重設玩家設定。 |
| `src/state/historyState.js` | State | Stores up to 100 deep-copied states for undo. | Undo 用に最大 100 件の状態コピーを保持します。 | 保存最多 100 筆深拷貝狀態供悔棋。 |
| `src/ui/cardRenderer.js` | UI rendering | Builds card DOM, face pips, card backs, and empty pile markers. | カード DOM、絵柄、カード裏面、空 pile 表示を生成します。 | 建立卡牌 DOM、牌面點數、牌背、空牌堆標記。 |
| `src/ui/screenManager.js` | UI flow | Shows screens, opens/closes modals, and displays toast messages. | 画面表示、モーダル開閉、トースト表示を管理します。 | 管理畫面切換、彈窗開關、toast 訊息。 |
| `src/ui/animations.js` | UI animation | Provides animation speed multiplier, hint pulse, deal animation, and confetti. | アニメーション倍率、ヒント pulse、配布演出、紙吹雪を提供します。 | 提供動畫速度倍率、提示閃爍、發牌動畫與勝利彩帶。 |
| `src/ui/clickMove.js` | UI utility | Small helper for clickability; main click-move logic is in `src/main.js`. | クリック可能判定の小補助です。主処理は `src/main.js` にあります。 | 點擊可用性輔助；主要點擊移動邏輯在 `src/main.js`。 |
| `src/ui/dragDrop.js` | UI utility | Small helper for drag cursor; main drag/drop logic is in `src/main.js`. | ドラッグカーソル補助です。主処理は `src/main.js` にあります。 | 拖曳游標輔助；主要拖放邏輯在 `src/main.js`。 |
| `src/storage/saveGame.js` | Persistence | Saves, loads, detects, and clears one saved game. | 1 件のセーブデータの保存、読込、検出、削除を行います。 | 儲存、讀取、偵測、清除單一遊戲存檔。 |
| `src/storage/leaderboard.js` | Persistence | Maintains top 20 records per draw mode and sorts by score, time, or date. | draw mode 別に上位 20 件を保持し、スコア、時間、日付で並べ替えます。 | 每種抽牌模式保存前 20 名，可依分數、時間、日期排序。 |
| `src/audio/audioManager.js` | Audio | Generates SFX and looping BGM patterns through Web Audio API. | Web Audio API で効果音とループ BGM を生成します。 | 使用 Web Audio API 產生音效與循環背景音樂。 |
| `src/audio/tracks.js` | Audio | Maps semantic BGM/SFX names to synthesizer pattern keys. | BGM / 効果音名をシンセパターンキーへ対応させます。 | 將 BGM/音效語意名稱對應到合成器 pattern key。 |
| `style/base.css` | CSS foundation | Global reset, CSS variables, font stack, card dimensions, responsive breakpoints. | リセット、CSS 変数、フォント、カード寸法、レスポンシブ設定です。 | 全域重設、CSS 變數、字型、卡牌尺寸、響應式斷點。 |
| `style/layout.css` | CSS layout | Shared screen and toolbar layout. | 共通画面とツールバー配置です。 | 共用畫面與工具列版面。 |
| `style/components.css` | CSS components | Cards, piles, buttons, modals, toggles, sliders, inputs, toasts, confetti. | カード、pile、ボタン、モーダル、切替、スライダー、入力、トースト、紙吹雪です。 | 卡牌、牌堆、按鈕、彈窗、開關、滑桿、輸入框、toast、彩帶。 |
| `style/screens/menu.css` | CSS screen | Main menu background, title, buttons, floating cards. | メニュー背景、タイトル、ボタン、浮遊カードです。 | 主選單背景、標題、按鈕、浮動卡牌。 |
| `style/screens/game.css` | CSS screen | Game board, top row, tableau area, toolbar stats, auto-complete bar. | ゲーム盤、上段、tableau、ツールバー統計、自動完成バーです。 | 遊戲牌桌、上排、tableau 區、工具列數據、自動完成列。 |
| `style/screens/settings.css` | CSS screen | Settings page groups and controls. | 設定画面のグループと操作部品です。 | 設定頁群組與控制元件。 |
| `style/screens/leaderboard.css` | CSS screen | Leaderboard table, filters, empty state, footer. | ランキング表、フィルタ、空状態、フッターです。 | 排行榜表格、篩選器、空狀態、頁尾。 |
| `style/themes/themes.css` | CSS themes | Applies theme variables with `[data-theme]` selectors. | `[data-theme]` セレクタでテーマ変数を適用します。 | 使用 `[data-theme]` 套用主題變數。 |
| `style/themes/classic.css` | CSS theme | Classic green table theme. | クラシックな緑のテーブルテーマです。 | 經典綠色牌桌主題。 |
| `style/themes/dark.css` | CSS theme | Dark blue/black theme. | ダークな青黒テーマです。 | 深色藍黑主題。 |
| `style/themes/retro.css` | CSS theme | Retro arcade-style theme and pixel font adjustments. | レトロアーケード風テーマとピクセルフォント調整です。 | 復古街機風格與像素字型調整。 |
| `tests/deck.test.js` | Test | Verifies deck uniqueness, color assignment, shuffle behavior, and initial deal. | デッキ一意性、色、シャッフル、初期配布を検証します。 | 驗證牌組唯一性、花色顏色、洗牌、初始發牌。 |
| `tests/rules.test.js` | Test | Verifies tableau and foundation move rules. | tableau と foundation の移動ルールを検証します。 | 驗證 tableau 與 foundation 移動規則。 |
| `tests/scoring.test.js` | Test | Verifies scoring constants, clamp, time bonus, and stars. | スコア定数、clamp、時間ボーナス、星評価を検証します。 | 驗證計分常數、最低分數、時間獎勵、星級。 |
| `solitaire_web_spec.md` | Specification | Existing design/spec document for the project. | 既存の設計/仕様ドキュメントです。 | 專案既有設計/規格文件。 |
| `dist/` | Build output | Generated production output; ignored by git. | 生成された本番出力で、git では無視されます。 | 建置輸出資料夾，已由 git 忽略。 |

## Data and Persistence

### Game State Model

| State key | English | 日本語 | 中文 |
|---|---|---|---|
| `stock` | Face-down draw pile. | 裏向きの山札です。 | 面朝下的抽牌堆。 |
| `waste` | Drawn cards waiting to be used. | 引かれたカードの置き場です。 | 已抽出等待使用的牌。 |
| `foundations` | Four suit piles that build Ace to King. | A から K まで積む 4 つのスート pile です。 | 四個依花色從 A 疊到 K 的目標牌堆。 |
| `tableaus` | Seven main play columns. | 7 つのメイン列です。 | 七個主要遊戲牌列。 |
| `score` | Current score after move rewards/penalties. | 加点/減点後の現在スコアです。 | 移動加扣分後的目前分數。 |
| `time` | Elapsed game time in seconds. | 経過時間、秒単位です。 | 遊戲經過秒數。 |
| `moves` | Counted player moves. | プレイヤーの手数です。 | 玩家步數。 |
| `drawMode` | `1` or `3`. | `1` または `3` です。 | `1` 或 `3`。 |
| `isWon` | Win flag. | 勝利済みフラグです。 | 是否已勝利。 |
| `canAutoComplete` | Whether the auto-complete bar should be available. | 自動完成バーを表示できるかを示します。 | 是否可顯示自動完成列。 |
| `recycleCount` | Number of stock recycle cycles. | stock 再循環の回数です。 | stock 循環次數。 |

### localStorage Keys

| Key | English | 日本語 | 中文 |
|---|---|---|---|
| `sol_settings` | Stores user settings. | ユーザー設定を保存します。 | 儲存玩家設定。 |
| `sol_save_game` | Stores the current saved game plus timestamp. | 現在のセーブデータと timestamp を保存します。 | 儲存目前遊戲存檔與 timestamp。 |
| `sol_leaderboard_d1` | Stores Draw-1 leaderboard records. | Draw-1 ランキングを保存します。 | 儲存 Draw-1 排行榜紀錄。 |
| `sol_leaderboard_d3` | Stores Draw-3 leaderboard records. | Draw-3 ランキングを保存します。 | 儲存 Draw-3 排行榜紀錄。 |

## Testing

| Test file | English | 日本語 | 中文 |
|---|---|---|---|
| `tests/deck.test.js` | Deck creation, shuffle immutability, initial deal counts, face-up rules. | デッキ生成、シャッフル非破壊性、初期配布枚数、表向きルール。 | 牌組建立、洗牌不改原牌組、初始發牌張數、正反面規則。 |
| `tests/rules.test.js` | Tableau sequence validation and foundation validation. | tableau の並び判定と foundation 判定。 | Tableau 疊牌驗證與 foundation 驗證。 |
| `tests/scoring.test.js` | Scoring constants, clamp, time bonus, star thresholds. | スコア定数、clamp、時間ボーナス、星評価しきい値。 | 計分常數、最低分、時間獎勵、星級門檻。 |

Run all tests:

```bash
npm test
```

## Maintenance Notes

| Topic | English | 日本語 | 中文 |
|---|---|---|---|
| Active script | `index.html` currently loads `src/main.bundle.js`. If you edit modular files under `src/`, make sure the runtime bundle or HTML entry is kept in sync. | `index.html` は現在 `src/main.bundle.js` を読み込みます。`src/` のモジュールを編集する場合は、runtime bundle または HTML entry を同期してください。 | `index.html` 目前載入 `src/main.bundle.js`。若修改 `src/` 模組，請同步 runtime bundle 或調整 HTML 入口。 |
| Source of truth | Game rules, scoring, deck, and storage behavior are easiest to maintain in the modular files under `src/`. | ルール、スコア、デッキ、保存処理は `src/` のモジュールで保守するのが分かりやすいです。 | 規則、計分、牌組、儲存邏輯建議以 `src/` 模組為主要維護位置。 |
| Interaction modules | `src/ui/clickMove.js` and `src/ui/dragDrop.js` are currently small helpers; main interaction logic lives in `src/main.js`. | `src/ui/clickMove.js` と `src/ui/dragDrop.js` は小補助で、主な操作処理は `src/main.js` にあります。 | `src/ui/clickMove.js` 與 `src/ui/dragDrop.js` 目前是輔助檔，主要互動邏輯在 `src/main.js`。 |
| Ignored folders | `node_modules/`, `dist/`, and `.claude/` are ignored by `.gitignore`. | `node_modules/`、`dist/`、`.claude/` は `.gitignore` で無視されます。 | `node_modules/`、`dist/`、`.claude/` 已列入 `.gitignore`。 |
