# Chinese Chess vs AI / AI対戦中国象棋 / AI 對戰中國象棋

A browser-based Xiangqi game built with HTML5, CSS3, and vanilla JavaScript. The player controls the Red side and plays against a Black-side AI with selectable difficulty, legal-move hints, timers, move history, captured-piece panels, responsive layout, and local setting persistence.

HTML5、CSS3、Vanilla JavaScriptで作られたブラウザ向け中国象棋(シャンチー)ゲームです。プレイヤーは赤側を操作し、難易度を選べる黒側AIと対戦します。合法手の表示、対局時計、棋譜、取った駒の表示、レスポンシブUI、設定保存に対応しています。

這是一款使用 HTML5、CSS3、Vanilla JavaScript 製作的瀏覽器版象棋遊戲。玩家操控紅方，與黑方 AI 對弈，支援 AI 難度、合法走法提示、計時、棋譜、吃子顯示、響應式版面與設定保存。

---

## Quick Navigation / クイックナビ / 快速導覽

| Language | Section |
| :-- | :-- |
| English | [English Documentation](#english-documentation) |
| 日本語 | [日本語ドキュメント](#日本語ドキュメント) |
| 繁體中文 | [繁體中文文件](#繁體中文文件) |

## Project Snapshot / プロジェクト概要 / 專案摘要

| Item | English | 日本語 | 繁體中文 |
| :-- | :-- | :-- | :-- |
| Game | Human Red vs AI Black Xiangqi | 赤側プレイヤー vs 黒側AIの中国象棋 | 紅方玩家 vs 黑方 AI 象棋 |
| Runtime | Browser only, no build step required | ブラウザのみ、ビルド不要 | 純瀏覽器執行，不需建置 |
| Stack | HTML5, CSS3, vanilla JavaScript, Canvas, Web Audio API | HTML5、CSS3、Vanilla JS、Canvas、Web Audio API | HTML5、CSS3、原生 JavaScript、Canvas、Web Audio API |
| Server | Optional Node.js static server | 任意のNode.js静的サーバー | 可選 Node.js 靜態伺服器 |
| Data storage | `localStorage` for user settings | `localStorage`で設定を保存 | 使用 `localStorage` 保存設定 |

## Project Structure / 構成 / 專案結構

```text
Chinese_Chess/
|-- index.html             Main HTML shell and game screens
|-- server.mjs             Optional local static server
|-- chinese_chess_spec.md  Original project specification and design notes
|-- css/
|   |-- reset.css          Browser reset
|   |-- main.css           Global variables, buttons, shell layout
|   |-- screens.css        Menu, settings, rules, modal, screen layouts
|   |-- board.css          Board area, side panels, captured pieces, move list
|   `-- responsive.css     Tablet and mobile layout rules
|-- js/
|   |-- pieces.js          Piece model, board constants, initial setup
|   |-- game.js            Xiangqi rules, legal moves, game state
|   |-- board.js           Canvas board renderer and pointer mapping
|   |-- ai.js              AI move search and evaluation
|   |-- audio.js           Web Audio sound effects
|   |-- settings.js        Settings defaults and localStorage helpers
|   `-- main.js            App controller, DOM events, rendering loop
`-- assets/
    |-- images/            Reserved image asset folder
    `-- sounds/            Reserved sound asset folder
```

---

## English Documentation

### Game Introduction

This project is a single-page Xiangqi game designed for direct browser play. It presents a full 10 x 9 Chinese Chess board on an HTML5 Canvas, lets the player move Red pieces by clicking or tapping the board, and then lets the AI respond as the Black side.

The game focuses on a complete local-play experience:

| Area | Description |
| :-- | :-- |
| Match flow | Red player moves first, Black AI responds after a short thinking delay. |
| Rules | Piece movement, palace limits, river rules, horse-leg blocks, elephant-eye blocks, cannon screens, flying-general checks, checkmate, and stalemate are handled in JavaScript. |
| AI | Three difficulty levels use Negamax search with alpha-beta pruning, capture-first move ordering, material values, positional bonuses, mobility, and check pressure. |
| Board UI | Canvas-rendered board with selected-piece highlights, last-move highlights, legal-move markers, and check indication. |
| Game tools | Undo, restart, home navigation, timers, captured-piece lists, and recent move history. |
| Settings | Difficulty, sound effects, volume, legal-move hints, timers, board theme, and piece style are stored locally. |
| Layout | Desktop uses a three-column game layout; tablet and mobile collapse into a stacked layout. |

### AI Difficulty

| Difficulty | Search Depth | Randomness | Delay | Intended Feeling |
| :-- | --: | --: | --: | :-- |
| Easy | 1 | Higher | 360 ms | Fast and imperfect, suitable for first play. |
| Normal | 2 | Low | 460 ms | Balanced response speed and tactical awareness. |
| Hard | 3 | None | 560 ms | Stronger tactical search with stricter move selection. |

### Program Classification

| Category | File | Main Responsibilities | Implementation Details |
| :-- | :-- | :-- | :-- |
| Entry and screen shell | `index.html` | Defines the main menu, difficulty screen, settings screen, rules screen, game screen, result dialog, and script loading order. | Uses semantic sections, a `<canvas>` board, form controls, dialog, and accessibility attributes. |
| Global style system | `css/main.css` | Defines color tokens, font stack, page background, button styles, focus states, and shared shell behavior. | Uses CSS variables and responsive font sizing for the main interface. |
| Screen layouts | `css/screens.css` | Styles menu, panels, difficulty cards, settings rows, rules content, game header, and result modal. | Keeps each major screen as a full-screen view controlled by the `.screen.active` class. |
| Board and side panels | `css/board.css` | Controls the game board layout, Canvas size, AI-thinking badge, player cards, captured pieces, control stack, and move list. | Uses CSS Grid for the desktop board layout and stable aspect ratio for the board. |
| Responsive rules | `css/responsive.css` | Adjusts game layout for tablet and mobile screens. | Collapses the desktop three-column layout into a single column and resizes controls for touch use. |
| Piece model | `js/pieces.js` | Defines board size, sides, piece types, labels, names, `Piece`, initial board creation, cloning, and text helpers. | Provides shared constants and board utilities used by the rules engine, AI, and renderer. |
| Rules engine | `js/game.js` | Owns `GameState`, move history, captures, timers, legal-move generation, move execution, undo, check detection, and end-game state. | Generates pseudo-legal moves, filters moves that leave the general in check, and supports all core Xiangqi movement rules. |
| Canvas renderer | `js/board.js` | Draws the board, river, palaces, pieces, selected piece, legal moves, last move, and check outline. | Converts pointer coordinates into board rows and columns while scaling for `devicePixelRatio`. |
| AI engine | `js/ai.js` | Chooses Black-side moves according to difficulty. | Uses Negamax, alpha-beta pruning, ordered moves, material values, positional bonuses, mobility scores, and check bonuses. |
| Audio system | `js/audio.js` | Plays selection, move, capture, check, win, and loss feedback. | Generates short procedural sound effects with the Web Audio API; audio failures are safely ignored. |
| Settings persistence | `js/settings.js` | Defines default settings, loads settings, saves settings, and resets settings. | Uses the `chinese_chess_settings` `localStorage` key and falls back safely when storage is blocked. |
| App controller | `js/main.js` | Connects UI events, settings, game state, board rendering, AI turns, timers, captured lists, move list, status text, and result modal. | Acts as the runtime coordinator between `GameState`, `BoardView`, `AudioManager`, and DOM controls. |
| Static server | `server.mjs` | Serves project files locally from `127.0.0.1:8000` by default. | Uses Node.js built-in `http`, `fs`, and `path` modules with content-type mapping. |
| Specification | `chinese_chess_spec.md` | Records the original product and implementation plan. | Useful as a design reference, but the actual behavior should be checked against the current source files. |

### Core Runtime Flow

| Step | Flow |
| :-- | :-- |
| 1 | `main.js` creates `GameState`, loads settings, creates `AudioManager`, and creates `BoardView`. |
| 2 | The player starts a game, which resets the board, opens the game screen, starts the timer, and renders the board. |
| 3 | A click or tap on the Canvas is translated by `BoardView` into a board coordinate. |
| 4 | `GameState.legalMovesFor()` returns legal targets for a selected Red piece. |
| 5 | `GameState.move()` commits a move, records notation, updates captures, checks for check/checkmate/stalemate, and changes turn. |
| 6 | `main.js` calls `chooseAiMove()` after a delay when it is Black's turn. |
| 7 | Rendering updates the Canvas board, status text, timers, captured pieces, and move list. |

### Run Locally

| Method | Command or Action | Notes |
| :-- | :-- | :-- |
| Direct browser open | Open `index.html` in a modern browser. | No installation required. |
| Local server | `node server.mjs` | Recommended when browser security policies affect local resources. |
| Custom port | PowerShell: `$env:PORT=9000; node server.mjs`<br>macOS/Linux: `PORT=9000 node server.mjs` | Opens `http://127.0.0.1:9000/`. |

---

## 日本語ドキュメント

### ゲーム紹介

このプロジェクトは、ブラウザだけで遊べる中国象棋(シャンチー)のシングルページゲームです。HTML5 Canvas上に10 x 9の盤面を描画し、プレイヤーが赤側の駒をクリックまたはタップで動かすと、黒側AIが応手を返します。

ローカルで完結する対局体験を中心に作られています。

| 項目 | 内容 |
| :-- | :-- |
| 対局の流れ | 赤側プレイヤーが先手で、黒側AIが短い思考時間の後に着手します。 |
| ルール | 駒の移動、宮の制限、河の制限、馬脚、象眼、砲台、将帥の対面、王手、詰み、ステイルメイトをJavaScriptで処理します。 |
| AI | 3段階の難易度があり、Negamax探索、アルファベータ枝刈り、駒取り優先の手順ソート、駒価値、位置ボーナス、可動性、王手評価を使います。 |
| 盤面UI | Canvasで盤面、選択中の駒、直前の手、合法手、王手表示を描画します。 |
| 対局ツール | 待った、再開、ホームへ戻る、対局時計、取った駒、直近の棋譜を表示します。 |
| 設定 | 難易度、効果音、音量、合法手表示、時計表示、盤面テーマ、駒スタイルを保存できます。 |
| レイアウト | デスクトップでは3カラム、タブレットとモバイルでは縦積みレイアウトになります。 |

### AI難易度

| 難易度 | 探索深さ | ランダム性 | 待機時間 | 体験 |
| :-- | --: | --: | --: | :-- |
| Easy | 1 | 高め | 360 ms | 速く、ミスもある入門向け。 |
| Normal | 2 | 低め | 460 ms | 速度と戦術判断のバランス型。 |
| Hard | 3 | なし | 560 ms | より深く読み、厳密に手を選ぶ上級向け。 |

### プログラム分類

| 分類 | ファイル | 主な役割 | 実装の詳細 |
| :-- | :-- | :-- | :-- |
| エントリーと画面構造 | `index.html` | メインメニュー、難易度、設定、ルール、対局画面、結果ダイアログ、スクリプト読み込み順を定義します。 | セマンティックなsection、`<canvas>`、フォーム、dialog、アクセシビリティ属性を使います。 |
| 共通スタイル | `css/main.css` | 色、フォント、背景、ボタン、フォーカス、共通シェルを管理します。 | CSS変数とレスポンシブな文字サイズで画面全体の見た目を統一します。 |
| 画面レイアウト | `css/screens.css` | メニュー、パネル、難易度カード、設定行、ルール文、ゲームヘッダー、結果モーダルを整えます。 | `.screen.active`で表示中のフルスクリーン画面を切り替えます。 |
| 盤面とサイドパネル | `css/board.css` | 盤面、Canvasサイズ、AI思考中バッジ、プレイヤーカード、取った駒、操作ボタン、棋譜を配置します。 | デスクトップはCSS Grid、盤面は安定したアスペクト比で管理します。 |
| レスポンシブ対応 | `css/responsive.css` | タブレットとモバイル向けに配置を調整します。 | 3カラムを1カラムに変え、タッチ操作しやすいサイズにします。 |
| 駒モデル | `js/pieces.js` | 盤面サイズ、陣営、駒種、表示文字、`Piece`、初期配置、クローン、文字列ヘルパーを定義します。 | ルール、AI、描画で共有する定数と盤面ユーティリティを提供します。 |
| ルールエンジン | `js/game.js` | `GameState`、棋譜、取った駒、時計、合法手生成、着手、待った、王手判定、終局を管理します。 | 仮合法手を作り、自玉が王手になる手を除外して、中国象棋の主要ルールを処理します。 |
| Canvas描画 | `js/board.js` | 盤、河、宮、駒、選択状態、合法手、直前の手、王手枠を描画します。 | `devicePixelRatio`に合わせて描画し、ポインター座標を盤面座標へ変換します。 |
| AIエンジン | `js/ai.js` | 難易度に応じて黒側AIの手を選びます。 | Negamax、アルファベータ枝刈り、手順ソート、駒価値、位置ボーナス、可動性、王手評価を使います。 |
| 音声システム | `js/audio.js` | 選択、移動、駒取り、王手、勝利、敗北の効果音を鳴らします。 | Web Audio APIで短い効果音を生成し、ブラウザ制限による失敗は安全に無視します。 |
| 設定保存 | `js/settings.js` | 初期設定、読み込み、保存、リセットを担当します。 | `chinese_chess_settings`キーで`localStorage`に保存し、利用できない場合も落ちないようにします。 |
| アプリ制御 | `js/main.js` | UIイベント、設定、ゲーム状態、盤面描画、AI手番、時計、取った駒、棋譜、ステータス、結果モーダルを接続します。 | `GameState`、`BoardView`、`AudioManager`、DOM操作をまとめる実行時コントローラーです。 |
| 静的サーバー | `server.mjs` | 既定では`127.0.0.1:8000`でローカル配信します。 | Node.js標準の`http`、`fs`、`path`を使い、拡張子ごとのcontent-typeを返します。 |
| 仕様書 | `chinese_chess_spec.md` | 元の製品仕様と実装計画を記録しています。 | 設計参考資料として有用ですが、現在の動作は実際のソースで確認してください。 |

### 実行時の流れ

| 手順 | 内容 |
| :-- | :-- |
| 1 | `main.js`が`GameState`を作成し、設定を読み込み、`AudioManager`と`BoardView`を作成します。 |
| 2 | ゲーム開始時に盤面をリセットし、対局画面を開き、時計を開始して描画します。 |
| 3 | Canvas上のクリックまたはタップを`BoardView`が盤面座標へ変換します。 |
| 4 | `GameState.legalMovesFor()`が選択した赤駒の合法手を返します。 |
| 5 | `GameState.move()`が着手を確定し、棋譜、取った駒、王手、詰み、ステイルメイト、手番を更新します。 |
| 6 | 黒番になると、`main.js`が短い待機後に`chooseAiMove()`を呼び出します。 |
| 7 | 描画処理がCanvas、ステータス、時計、取った駒、棋譜を更新します。 |

### ローカル実行

| 方法 | コマンドまたは操作 | 補足 |
| :-- | :-- | :-- |
| 直接開く | `index.html`をブラウザで開きます。 | インストール不要です。 |
| ローカルサーバー | `node server.mjs` | ローカルリソースに対するブラウザ制限を避けたい場合に推奨です。 |
| ポート変更 | PowerShell: `$env:PORT=9000; node server.mjs`<br>macOS/Linux: `PORT=9000 node server.mjs` | `http://127.0.0.1:9000/`で開きます。 |

---

## 繁體中文文件

### 遊戲介紹

本專案是一款可直接在瀏覽器遊玩的象棋單頁遊戲。遊戲以 HTML5 Canvas 繪製完整 10 x 9 棋盤，玩家透過滑鼠點擊或觸控操作紅方棋子，黑方則由 AI 自動回應。

整體設計重點是讓玩家不用安裝框架或後端服務，也能取得完整的本機對弈體驗。

| 面向 | 說明 |
| :-- | :-- |
| 對局流程 | 紅方玩家先行，黑方 AI 會在短暫思考延遲後落子。 |
| 規則處理 | 支援棋子走法、九宮限制、過河規則、蹩馬腳、塞象眼、炮架、將帥照面、將軍、將死與無子可走判定。 |
| AI | 三種難度使用 Negamax 搜尋、Alpha-Beta 剪枝、吃子優先排序、棋子價值、位置加分、行動力與將軍壓力評估。 |
| 棋盤 UI | 以 Canvas 繪製棋盤、選取提示、最後一步提示、合法走法提示與將軍標記。 |
| 對局工具 | 支援悔棋、重新開始、返回主畫面、雙方計時、吃子列表與近期棋譜。 |
| 設定 | 可保存難度、音效、音量、合法走法提示、計時器、棋盤主題與棋子樣式。 |
| 響應式版面 | 桌面版使用三欄式對局區，平板與手機改為上下堆疊。 |

### AI 難度

| 難度 | 搜尋深度 | 隨機性 | 延遲 | 遊玩感受 |
| :-- | --: | --: | --: | :-- |
| Easy | 1 | 較高 | 360 ms | 反應快，偶爾犯錯，適合入門。 |
| Normal | 2 | 較低 | 460 ms | 速度與攻防判斷較均衡。 |
| Hard | 3 | 無 | 560 ms | 搜尋更深，落子選擇更嚴格。 |

### 程式分類詳細介紹

| 分類 | 檔案 | 主要職責 | 實作重點 |
| :-- | :-- | :-- | :-- |
| 入口與畫面骨架 | `index.html` | 定義主選單、難度、設定、規則、遊戲畫面、結果對話框與腳本載入順序。 | 使用語意化區塊、`<canvas>`、表單控制項、`dialog` 與無障礙屬性。 |
| 全域樣式系統 | `css/main.css` | 管理色彩變數、字體、背景、按鈕、焦點狀態與共用外層版面。 | 透過 CSS 變數與響應式字級統一整體視覺。 |
| 畫面版面 | `css/screens.css` | 設計主選單、面板、難度卡、設定列、規則內容、遊戲標題列與結果彈窗。 | 使用 `.screen.active` 控制目前顯示的全螢幕區塊。 |
| 棋盤與側欄 | `css/board.css` | 控制棋盤區、Canvas 尺寸、AI 思考提示、玩家資訊卡、吃子列表、控制按鈕與棋譜。 | 桌面使用 CSS Grid，棋盤維持固定比例，降低版面跳動。 |
| 響應式規則 | `css/responsive.css` | 針對平板與手機調整遊戲版面。 | 將三欄式佈局改為單欄，並放大觸控操作區。 |
| 棋子資料模型 | `js/pieces.js` | 定義棋盤大小、陣營、棋子種類、顯示文字、`Piece`、初始棋盤、複製棋盤與文字輔助函式。 | 提供規則引擎、AI 與棋盤繪製共用的常數與資料工具。 |
| 規則引擎 | `js/game.js` | 管理 `GameState`、走棋紀錄、吃子、計時、合法走法、落子、悔棋、將軍判定與終局。 | 先產生偽合法走法，再排除會讓己方將帥被將軍的走法，並涵蓋象棋核心規則。 |
| Canvas 棋盤繪製 | `js/board.js` | 繪製棋盤、河界、九宮、棋子、選取狀態、合法走法、最後一步與將軍外框。 | 依 `devicePixelRatio` 調整解析度，並把滑鼠或觸控座標轉為棋盤座標。 |
| AI 引擎 | `js/ai.js` | 依照難度替黑方選擇落子。 | 使用 Negamax、Alpha-Beta 剪枝、走法排序、棋子價值、位置加分、行動力與將軍評估。 |
| 音效系統 | `js/audio.js` | 播放選取、移動、吃子、將軍、勝利與失敗提示音。 | 使用 Web Audio API 產生短音效；若瀏覽器阻擋音訊，會安全略過。 |
| 設定保存 | `js/settings.js` | 定義預設設定、讀取、保存與重設。 | 使用 `chinese_chess_settings` 作為 `localStorage` key，並處理儲存受限的情境。 |
| 應用程式控制器 | `js/main.js` | 串接 UI 事件、設定、遊戲狀態、棋盤更新、AI 回合、計時、吃子列表、棋譜、狀態文字與結果彈窗。 | 作為 `GameState`、`BoardView`、`AudioManager` 與 DOM 控制項之間的執行核心。 |
| 靜態伺服器 | `server.mjs` | 預設從 `127.0.0.1:8000` 提供本機靜態檔案。 | 使用 Node.js 內建 `http`、`fs`、`path`，並依副檔名設定 content-type。 |
| 規格文件 | `chinese_chess_spec.md` | 保留原始產品規格與實作規劃。 | 可作為設計參考，但目前實際行為仍以現有原始碼為準。 |

### 核心執行流程

| 步驟 | 流程 |
| :-- | :-- |
| 1 | `main.js` 建立 `GameState`，讀取設定，建立 `AudioManager` 與 `BoardView`。 |
| 2 | 玩家開始遊戲後，重設棋盤、切換到遊戲畫面、啟動計時並重新繪製。 |
| 3 | 玩家點擊或觸控 Canvas 時，`BoardView` 會把畫面座標轉為棋盤列與欄。 |
| 4 | `GameState.legalMovesFor()` 回傳紅方選取棋子的合法目標格。 |
| 5 | `GameState.move()` 確認落子，更新棋譜、吃子、將軍、將死、無子可走與回合狀態。 |
| 6 | 輪到黑方時，`main.js` 會延遲呼叫 `chooseAiMove()` 取得 AI 落子。 |
| 7 | 畫面重新渲染 Canvas 棋盤、狀態文字、計時器、吃子列表與棋譜。 |

### 本機啟動方式

| 方式 | 指令或操作 | 備註 |
| :-- | :-- | :-- |
| 直接開啟 | 用瀏覽器開啟 `index.html`。 | 不需要安裝套件。 |
| 本機伺服器 | `node server.mjs` | 若瀏覽器對本機資源有限制，建議使用此方式。 |
| 自訂連接埠 | PowerShell: `$env:PORT=9000; node server.mjs`<br>macOS/Linux: `PORT=9000 node server.mjs` | 開啟 `http://127.0.0.1:9000/`。 |

---

## Notes / 注意 / 備註

| English | 日本語 | 繁體中文 |
| :-- | :-- | :-- |
| No package manager or bundler is required for the current source. | 現在のソースはパッケージマネージャーやバンドラー不要です。 | 目前原始碼不需要套件管理器或打包工具。 |
| `assets/images` and `assets/sounds` are reserved folders. The current audio feedback is generated by `js/audio.js`. | `assets/images`と`assets/sounds`は予約フォルダです。現在の音声フィードバックは`js/audio.js`で生成されます。 | `assets/images` 與 `assets/sounds` 是保留資料夾；目前音效由 `js/audio.js` 產生。 |
| The specification file is helpful for design context, but README descriptions above follow the current source files. | 仕様書は設計背景の確認に便利ですが、上記READMEは現在のソース内容を基準にしています。 | 規格文件可作為設計背景參考，但本 README 的說明以目前原始碼為準。 |
