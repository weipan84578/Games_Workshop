# Checkers Master

Browser checkers game documentation in **English**, **日本語**, and **繁體中文**.

| Section | English | 日本語 | 繁體中文 |
|---|---|---|---|
| [Project Snapshot](#project-snapshot--プロジェクト概要--專案快覽) | Basic project facts | 基本情報 | 專案基本資訊 |
| [Game Introduction](#game-introduction--ゲーム紹介--遊戲介紹) | What the game is | ゲーム内容 | 遊戲內容 |
| [Quick Start](#quick-start--クイックスタート--快速開始) | How to run | 起動方法 | 如何執行 |
| [Rules And Controls](#rules-and-controls--ルールと操作--規則與操作) | Rules and inputs | ルールと操作 | 玩法與操作 |
| [Feature Matrix](#feature-matrix--機能一覧--功能總覽) | Main features | 主な機能 | 主要功能 |
| [Program Structure](#program-structure--プログラム構成--程式分類) | File responsibilities | ファイル別責務 | 檔案分工 |
| [Data And Flow](#data-and-flow--データと処理フロー--資料與流程) | Runtime model | 実行時モデル | 執行資料模型 |

---

## Project Snapshot / プロジェクト概要 / 專案快覽

| Item | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Name | Checkers Master | Checkers Master | Checkers Master |
| Game type | Browser-based checkers | ブラウザ用チェッカー | 瀏覽器西洋跳棋 |
| Play mode | Human player vs AI | プレイヤー対 AI | 玩家對戰 AI |
| Stack | HTML5, CSS3, JavaScript ES6+ | HTML5、CSS3、JavaScript ES6+ | HTML5、CSS3、JavaScript ES6+ |
| Dependencies | No package install required | パッケージのインストール不要 | 不需要安裝套件 |
| Entry point | `index.html` | `index.html` | `index.html` |
| Persistence | `localStorage` for settings and statistics | 設定と戦績を `localStorage` に保存 | 使用 `localStorage` 保存設定與戰績 |
| Audio | Generated with Web Audio API | Web Audio API で生成 | 使用 Web Audio API 產生 |
| PWA metadata | `manifest.json` provides standalone app metadata | `manifest.json` にスタンドアロン用情報を定義 | `manifest.json` 提供獨立 App 顯示資訊 |

---

## Game Introduction / ゲーム紹介 / 遊戲介紹

| Language | Description |
|---|---|
| English | **Checkers Master** is a lightweight web checkers game. It runs directly in the browser, lets the player battle an AI opponent, and includes rule handling for forced captures, chained captures, king promotion, game-over checks, themes, sound, and match statistics. |
| 日本語 | **Checkers Master** は、ブラウザだけで遊べる軽量なチェッカーゲームです。プレイヤーは AI と対戦でき、強制ジャンプ、連続ジャンプ、キング昇格、勝敗判定、テーマ、サウンド、戦績保存に対応しています。 |
| 繁體中文 | **Checkers Master** 是一款可直接在瀏覽器執行的輕量西洋跳棋遊戲。玩家可以與 AI 對戰，遊戲支援強制吃子、連續吃子、升王、勝負判定、主題切換、音效與戰績保存。 |

---

## Quick Start / クイックスタート / 快速開始

| Step | English | 日本語 | 繁體中文 |
|---:|---|---|---|
| 1 | Open `index.html` in a modern browser. | 最新のブラウザで `index.html` を開きます。 | 使用現代瀏覽器開啟 `index.html`。 |
| 2 | Click **Start Game** to play immediately. | **Start Game** を押すとすぐに開始できます。 | 點選 **Start Game** 即可開始遊戲。 |
| 3 | Open settings to choose difficulty, player color, theme, music, and sound effects. | 設定画面で難易度、駒の色、テーマ、BGM、効果音を変更できます。 | 進入設定可調整難度、玩家棋色、主題、背景音樂與音效。 |
| 4 | No build step, server, or dependency installation is required. | ビルド、サーバー、依存関係のインストールは不要です。 | 不需要建置流程、伺服器或套件安裝。 |

---

## Rules And Controls / ルールと操作 / 規則與操作

### Rules / ルール / 規則

| Rule | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Board | Uses a standard 8x8 checkers board. Pieces move on dark squares. | 標準の 8x8 盤を使用し、駒は濃いマス上を移動します。 | 使用標準 8x8 棋盤，棋子在深色格上移動。 |
| Turn order | The player starts first, then the AI responds. | プレイヤーが先手で、その後 AI が応手します。 | 玩家先手，之後由 AI 回合應手。 |
| Normal move | Regular pieces move diagonally forward by one square. | 通常の駒は斜め前方に 1 マス移動します。 | 一般棋子每次向前斜走一格。 |
| Capture | If a capture is available, capture moves are forced. | ジャンプ可能な場合は、ジャンプが必須です。 | 若可吃子，必須選擇吃子。 |
| Chain capture | Multiple captures can be chained in one move. | 連続ジャンプが可能です。 | 可在同一步中連續吃子。 |
| King | A piece becomes a king when it reaches the opponent's back row. Kings move diagonally in both directions. | 相手側の最終段に到達するとキングになります。キングは前後どちらにも斜め移動できます。 | 棋子抵達對方底線後升王，王可向前與向後斜向移動。 |
| Game over | The game ends when one side has no pieces, no legal moves, or the no-capture counter reaches the draw limit. | どちらかの駒がなくなる、合法手がなくなる、または無捕獲の手数が引き分け上限に達すると終了します。 | 任一方無棋、無合法走法，或無吃子步數達到和局限制時結束。 |

### Controls / 操作 / 操作方式

| Input | English | 日本語 | 繁體中文 |
|---|---|---|---|
| Mouse / Touch | Select a piece, then choose a highlighted destination. | 駒を選択し、ハイライトされた移動先を選びます。 | 點選棋子後，再點選標示出的可移動位置。 |
| Keyboard arrows | Move focus across board squares. | 方向キーで盤上のフォーカスを移動します。 | 使用方向鍵移動棋盤焦點。 |
| Enter / Space | Activate the focused square. | フォーカス中のマスを選択します。 | 選取目前焦點所在格子。 |
| Escape | Clear selection or open the pause dialog during a game. | 選択解除、または対局中に一時停止画面を開きます。 | 取消目前選取，或在遊戲中開啟暫停視窗。 |

---

## Feature Matrix / 機能一覧 / 功能總覽

| Feature | English | 日本語 | 繁體中文 |
|---|---|---|---|
| AI difficulty | Easy depth 2 with some randomness, Medium depth 4, Hard depth 6. | Easy は深さ 2 で少しランダム、Medium は深さ 4、Hard は深さ 6。 | 簡單難度深度 2 且帶少量隨機，中等深度 4，困難深度 6。 |
| AI algorithm | Minimax search with alpha-beta pruning and capture-first move ordering. | Minimax 探索、Alpha-Beta 枝刈り、捕獲手優先の並び替えを使用。 | 使用 Minimax 搜尋、Alpha-Beta 剪枝，並優先排序吃子步。 |
| Board feedback | Shows selected pieces, legal destinations, capture moves, and last move. | 選択中の駒、合法手、捕獲手、直前の手を表示します。 | 顯示選取棋子、合法落點、吃子步與上一手位置。 |
| Themes | Classic, Wood, and Neon themes are controlled by CSS variables. | Classic、Wood、Neon のテーマを CSS 変数で切り替えます。 | 提供 Classic、Wood、Neon 三種主題，透過 CSS 變數控制。 |
| Audio | Music and sound effects are generated in code through Web Audio API. | BGM と効果音は Web Audio API でコード生成されます。 | 背景音樂與音效皆由 Web Audio API 即時產生。 |
| Settings | Difficulty, player color, theme, music, and SFX volumes are configurable. | 難易度、駒の色、テーマ、BGM、効果音音量を設定できます。 | 可設定難度、玩家棋色、主題、音樂與音效音量。 |
| Statistics | Saves wins, losses, draws, total games, and longest win streak. | 勝利、敗北、引き分け、総対局数、最長連勝を保存します。 | 保存玩家勝場、AI 勝場、和局、總場次與最長連勝。 |
| Responsive UI | Layout adapts for desktop and mobile screens. | デスクトップとモバイルの両方に対応します。 | 介面支援桌機與手機版面。 |
| Accessibility | Uses grid roles, keyboard navigation, ARIA labels, and live status messages. | grid ロール、キーボード操作、ARIA ラベル、ライブ通知に対応します。 | 支援 grid 角色、鍵盤操作、ARIA 標籤與即時狀態訊息。 |

---

## Program Structure / プログラム構成 / 程式分類

| File | Category | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| `index.html` | UI shell | Defines the menu, settings screen, game screen, game-over screen, modal container, and script loading order. | メニュー、設定、対局、終了画面、モーダル、スクリプト読み込み順を定義します。 | 定義主選單、設定頁、遊戲頁、結束頁、Modal 容器與腳本載入順序。 |
| `styles.css` | Visual layer | Handles themes, board layout, pieces, buttons, modals, animations, and responsive breakpoints. | テーマ、盤面、駒、ボタン、モーダル、アニメーション、レスポンシブ設定を担当します。 | 負責主題、棋盤、棋子、按鈕、彈窗、動畫與響應式版面。 |
| `app.js` | Application controller | Connects UI events to the game engine, renders the board, manages screens, schedules AI turns, updates HUD text, and opens modals. | UI イベントとゲームエンジンを接続し、盤面描画、画面切替、AI 手番、HUD 更新、モーダル表示を管理します。 | 串接 UI 與遊戲引擎，負責棋盤渲染、畫面切換、AI 回合排程、HUD 更新與 Modal。 |
| `game.js` | Rule engine | Stores board constants, initializes pieces, generates legal moves, enforces captures, applies moves, promotes kings, counts pieces, and detects game over. | 盤面定数、初期配置、合法手生成、強制ジャンプ、手の適用、キング昇格、駒数計算、終了判定を担当します。 | 管理棋盤常數、初始配置、合法步產生、強制吃子、套用走法、升王、棋子統計與勝負判定。 |
| `ai.js` | AI engine | Chooses AI moves using minimax, alpha-beta pruning, move ordering, and board evaluation. | Minimax、Alpha-Beta 枝刈り、手の並び替え、盤面評価で AI の手を選びます。 | 使用 Minimax、Alpha-Beta 剪枝、步法排序與盤面評估選擇 AI 走法。 |
| `audio.js` | Audio engine | Unlocks the audio context, generates music, plays move/capture/king/win/lose/draw sounds, and applies volume settings. | AudioContext を有効化し、BGM、移動、捕獲、キング、勝敗、引き分け音を生成し、音量設定を反映します。 | 解鎖 AudioContext，產生背景音、移動、吃子、升王、勝敗與和局音效，並套用音量設定。 |
| `storage.js` | Persistence | Reads and writes settings and statistics through `localStorage`. | `localStorage` で設定と戦績を読み書きします。 | 透過 `localStorage` 讀寫設定與戰績。 |
| `ai.worker.js` | Worker placeholder | Reserved for future off-thread AI search. The current app runs AI directly in `ai.js`. | 将来 AI 探索を別スレッド化するための予約ファイルです。現在は `ai.js` で直接実行します。 | 預留給未來將 AI 搜尋移到背景執行緒使用；目前 AI 直接由 `ai.js` 執行。 |
| `manifest.json` | App metadata | Provides name, start URL, display mode, background color, and theme color. | アプリ名、開始 URL、表示モード、背景色、テーマ色を提供します。 | 提供 App 名稱、啟動 URL、顯示模式、背景色與主題色。 |
| `checkers_spec.md` | Specification | Design and implementation specification for the game. | ゲーム設計と実装仕様のドキュメントです。 | 遊戲設計與實作規格文件。 |
| `README.md` | Documentation | Project overview and file guide. | プロジェクト概要とファイル案内です。 | 專案介紹與檔案導覽。 |

### Architecture Layers / アーキテクチャ層 / 架構分層

| Layer | Files | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| View | `index.html`, `styles.css` | Presents screens, board, controls, visual states, and responsive layout. | 画面、盤面、操作部品、視覚状態、レスポンシブ表示を提供します。 | 呈現畫面、棋盤、控制元件、視覺狀態與響應式版面。 |
| Controller | `app.js` | Coordinates user input, game state, rendering, AI timing, audio calls, and dialogs. | 入力、状態、描画、AI タイミング、音声、ダイアログを統合管理します。 | 協調使用者輸入、遊戲狀態、渲染、AI 時機、音效與對話框。 |
| Domain logic | `game.js` | Owns checkers rules and match progression. | チェッカーのルールと対局進行を管理します。 | 掌管西洋跳棋規則與對局推進。 |
| AI | `ai.js`, `ai.worker.js` | Calculates AI decisions and leaves room for future worker execution. | AI の着手計算を行い、将来の Worker 化に備えます。 | 計算 AI 走法，並預留未來背景執行緒架構。 |
| Platform services | `audio.js`, `storage.js`, `manifest.json` | Handles browser audio, persistence, and app metadata. | ブラウザ音声、保存、アプリ情報を扱います。 | 處理瀏覽器音訊、資料保存與 App 中繼資料。 |

---

## Data And Flow / データと処理フロー / 資料與流程

### Runtime State / 実行時状態 / 執行狀態

| Object | English | 日本語 | 繁體中文 |
|---|---|---|---|
| `GameState.settings` | Current difficulty, color, theme, and audio settings. | 現在の難易度、色、テーマ、音声設定。 | 目前的難度、棋色、主題與音訊設定。 |
| `GameState.game` | The `GameEngine` instance that owns the board and match status. | 盤面と対局状態を保持する `GameEngine` インスタンス。 | 保存棋盤與對局狀態的 `GameEngine` 實例。 |
| `GameState.ai` | The `AIEngine` instance used to select AI moves. | AI の手を選ぶ `AIEngine` インスタンス。 | 用來選擇 AI 走法的 `AIEngine` 實例。 |
| `GameState.audio` | The `AudioEngine` instance for music and sound effects. | BGM と効果音を扱う `AudioEngine` インスタンス。 | 控制背景音樂與音效的 `AudioEngine` 實例。 |
| `GameState.selected` | The currently selected board square. | 現在選択中のマス。 | 目前選取的棋盤格。 |
| `GameState.validMoves` | Legal destinations for the selected piece. | 選択中の駒の合法手。 | 目前棋子的合法落點。 |
| `GameState.thinking` | Whether the AI is currently calculating or waiting to move. | AI が思考中または待機中かどうか。 | AI 是否正在思考或等待走棋。 |

### Board Values / 盤面値 / 棋盤數值

| Value | English | 日本語 | 繁體中文 |
|---:|---|---|---|
| `0` | Empty square | 空のマス | 空格 |
| `1` | Player piece | プレイヤーの通常駒 | 玩家一般棋 |
| `2` | AI piece | AI の通常駒 | AI 一般棋 |
| `3` | Player king | プレイヤーのキング | 玩家王棋 |
| `4` | AI king | AI のキング | AI 王棋 |

### Move Flow / 手番フロー / 走棋流程

| Step | English | 日本語 | 繁體中文 |
|---:|---|---|---|
| 1 | Player selects a piece on the board. | プレイヤーが盤上の駒を選択します。 | 玩家在棋盤上選取棋子。 |
| 2 | `game.js` returns legal moves. Captures are prioritized when available. | `game.js` が合法手を返します。ジャンプ可能なら捕獲手を優先します。 | `game.js` 回傳合法走法，若可吃子則優先吃子。 |
| 3 | `app.js` highlights legal destinations and waits for the player choice. | `app.js` が合法手をハイライトし、入力を待ちます。 | `app.js` 標示合法落點並等待玩家選擇。 |
| 4 | `GameEngine.applyMove()` updates the board, captures, promotion, turn, and game-over status. | `GameEngine.applyMove()` が盤面、捕獲、昇格、手番、終了状態を更新します。 | `GameEngine.applyMove()` 更新棋盤、吃子、升王、回合與結束狀態。 |
| 5 | If the game continues, `AIEngine.getMove()` calculates the AI response. | 対局が続く場合、`AIEngine.getMove()` が AI の応手を計算します。 | 若遊戲尚未結束，`AIEngine.getMove()` 計算 AI 回應走法。 |
| 6 | The board is rendered again and statistics are recorded when the match ends. | 盤面を再描画し、終了時には戦績を保存します。 | 重新渲染棋盤，並在遊戲結束時保存戰績。 |

---

## Settings Reference / 設定リファレンス / 設定參考

| Setting | Values | English | 日本語 | 繁體中文 |
|---|---|---|---|---|
| Difficulty | `easy`, `medium`, `hard` | Changes AI search depth and thinking delay. | AI の探索深さと思考待ち時間を変更します。 | 調整 AI 搜尋深度與思考等待時間。 |
| Player color | `red`, `black` | Changes visual ownership colors. | プレイヤー駒の表示色を変更します。 | 改變玩家棋子的顯示顏色。 |
| Theme | `classic`, `wood`, `neon` | Changes board and page colors through CSS variables. | CSS 変数で盤面とページ色を変更します。 | 透過 CSS 變數切換棋盤與頁面配色。 |
| Music | enabled, volume `0` to `1` | Controls generated background music. | 生成 BGM を制御します。 | 控制即時產生的背景音樂。 |
| SFX | enabled, volume `0` to `1` | Controls move, capture, select, button, and result sounds. | 移動、捕獲、選択、ボタン、結果音を制御します。 | 控制移動、吃子、選取、按鈕與結果音效。 |

---

## Notes / 補足 / 補充

| English | 日本語 | 繁體中文 |
|---|---|---|
| This project is intentionally built with vanilla browser technologies, so it is easy to inspect, modify, and run without tooling. | このプロジェクトは素のブラウザ技術で作られているため、ツールなしで確認、変更、実行しやすい構成です。 | 本專案刻意使用原生瀏覽器技術製作，因此不需工具即可檢查、修改與執行。 |
| `ai.worker.js` is a placeholder. It is useful if hard-mode AI search is later moved off the main UI thread. | `ai.worker.js` はプレースホルダーです。将来 Hard 難易度の AI 探索を UI スレッド外に移す場合に利用できます。 | `ai.worker.js` 目前是預留檔案，未來若要把困難 AI 搜尋移出主 UI 執行緒時可使用。 |
| `manifest.json` includes app metadata, but icons are not configured yet. | `manifest.json` にはアプリ情報がありますが、アイコンはまだ設定されていません。 | `manifest.json` 已提供 App 資訊，但尚未設定 icons。 |
