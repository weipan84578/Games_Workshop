# Chinese Dark Chess / 中国暗棋 / 中國暗棋

Browser-based Chinese Dark Chess game with AI opponent, responsive UI, synthesized sound, and persistent settings.

| Language | Section |
|---|---|
| English | [English](#english) |
| 日本語 | [日本語](#日本語) |
| 繁體中文 | [繁體中文](#繁體中文) |

---

## English

### Game Overview

| Item | Description |
|---|---|
| Game | Chinese Dark Chess, played on a 4 x 8 board with 32 hidden pieces |
| Mode | Single player against AI |
| Platform | Desktop, tablet, and mobile browsers |
| Tech Stack | HTML5, CSS3, Vanilla JavaScript |
| Build Step | None |
| Entry Point | Open `index.html` directly in a browser |

Chinese Dark Chess is a compact tactical board game based on hidden information. Every piece starts face down. The first revealed piece decides the player's side, and the AI automatically plays the opposite side. The player wins by capturing all opposing pieces or by leaving the opponent with no legal action.

### Main Features

| Feature | Details |
|---|---|
| 4 x 8 Board | 32 cells, one piece per cell at the start of each game |
| Hidden Piece Opening | First reveal determines the player color |
| Complete Move Rules | Adjacent movement, capture hierarchy, soldier-king cycle, cannon capture rule |
| AI Opponent | Easy, Normal, and Hard difficulties |
| Undo | Keeps up to 2 previous player snapshots |
| Draw and Surrender | Action buttons for draw and surrender |
| Audio | BGM and sound effects generated with Web Audio API |
| Settings | Difficulty, BGM volume, SFX volume, move hints, animation speed |
| Persistence | Uses `localStorage` for settings and best score |
| Responsive UI | Adapts to desktop, tablet, and mobile layouts |

### How To Run

| Step | Action |
|---|---|
| 1 | Download or clone this project |
| 2 | Open `index.html` in a modern browser |
| 3 | Click `開始遊戲` to start |

No npm, Node.js, bundler, or local server is required. Google Fonts is loaded from CDN when available, with local fallback fonts defined in CSS.

### Rule Quick Reference

| Topic | Rule |
|---|---|
| First Reveal | The first revealed piece becomes the player's side |
| Turn Action | Reveal one hidden piece, move one own revealed piece, or capture an enemy piece |
| Normal Movement | Revealed pieces move one cell up, down, left, or right |
| Normal Capture | A revealed piece captures an adjacent revealed enemy piece if the rank rule allows it |
| Rank Order | King > Guard > Elephant > Rook > Horse > Cannon > Soldier |
| Cycle Rule | Soldier can capture King, but King cannot capture Soldier |
| Cannon | Cannon captures only in the same row or column with exactly one intervening piece |
| Draw | 60 turns without capture triggers a draw |
| Game Over | A side loses when all pieces are captured or no legal action remains |

### Project Files

| File | Role |
|---|---|
| `index.html` | App shell, menu screen, settings screen, help screen, game screen, game over overlay |
| `style.css` | Theme variables, layout, board visuals, pieces, buttons, animations, responsive rules |
| `game.js` | Game state, board logic, AI, UI rendering, settings, audio, event binding |
| `chinese_dark_chess_spec.md` | Full design and implementation specification |
| `README.md` | Project introduction and code map |

### Program Classification

| Area | Code Location | Responsibility |
|---|---|---|
| Constants | `PIECE_DEFS`, `DIFFICULTY`, `STORAGE` in `game.js` | Defines piece data, AI difficulty, and localStorage keys |
| Global State | `state` in `game.js` | Tracks board, phase, colors, turn, captures, history, settings, logs, and mute state |
| Audio Engine | `AudioEngine` | Initializes Web Audio API, controls BGM, SFX, mute, and volume |
| Board Logic | `BoardLogic` | Initializes pieces, flips pieces, moves, captures, validates legal actions, checks game over |
| AI Engine | `AIEngine` | Selects AI actions with minimax, alpha-beta pruning, tactical priority, and evaluation score |
| UI Controller | `UIController` | Switches screens, renders board, displays hints, updates status, shows result overlay |
| Game Controller | `GameController` | Handles player clicks, turn flow, AI trigger, undo, surrender, draw, and new games |
| Settings Controller | `SettingsController` | Binds settings UI, saves settings, and refreshes segmented controls |
| Helpers | Utility functions in `game.js` | Board coordinates, neighbor lookup, cannon path, cloning, HTML escaping, logging |

### Interface Classification

| HTML Section | Purpose |
|---|---|
| `#screen-menu` | Start screen with title and navigation buttons |
| `#screen-settings` | Difficulty, audio, hints, and animation settings |
| `#screen-help` | Rule explanation tabs for movement, rank, cannon, and victory |
| `#screen-game` | Main game board, status bar, action bar, and move log |
| `#overlay-gameover` | Result modal with replay and return buttons |

### Styling Classification

| CSS Area | Purpose |
|---|---|
| `:root` | Color palette, timing values, font stack |
| Layout | Screen, page, panel, menu, and game shell layout |
| Board | 8-column by 4-row grid, board frame, cell sizing |
| Pieces | Hidden, red, black, selected, hover, and hint states |
| Controls | Buttons, segmented controls, sliders, toggles |
| Animation | Menu entrance, thinking dots, hint pulse, selected pulse, flip, capture |
| Responsive | Mobile layout adjustments under 700px and compact tuning under 374px |

### Data And Storage

| Data | Storage |
|---|---|
| Current board and turn state | In-memory `state` object |
| Undo snapshots | `state.history`, capped at 2 snapshots |
| Difficulty | `localStorage.dchess_difficulty` |
| BGM volume | `localStorage.dchess_bgm_vol` |
| SFX volume | `localStorage.dchess_sfx_vol` |
| Hint visibility | `localStorage.dchess_show_hints` |
| Animation speed | `localStorage.dchess_anim_speed` |
| Best score | `localStorage.dchess_best_score` |

---

## 日本語

### ゲーム概要

| 項目 | 内容 |
|---|---|
| ゲーム | 4 x 8 の盤面で遊ぶ中国暗棋 |
| モード | プレイヤー対 AI |
| 対応環境 | デスクトップ、タブレット、モバイルブラウザ |
| 技術 | HTML5、CSS3、Vanilla JavaScript |
| ビルド | 不要 |
| 起動方法 | `index.html` をブラウザで直接開く |

中国暗棋は、裏向きの駒をめくりながら進める情報戦のボードゲームです。最初にめくった駒の色がプレイヤーの陣営になり、AI は反対側を担当します。相手の駒をすべて取るか、相手が合法手を持たない状態にすると勝利です。

### 主な機能

| 機能 | 詳細 |
|---|---|
| 4 x 8 盤面 | 開始時は 32 マスすべてに駒が配置されます |
| 暗棋のめくり | 最初にめくった駒でプレイヤー陣営が決まります |
| ルール実装 | 隣接移動、駒の強弱、兵卒と将帥の循環、炮の特殊捕獲 |
| AI 対戦 | 簡単、普通、困難の 3 段階 |
| 待った | プレイヤー側の履歴を最大 2 回分保持 |
| 和局と投降 | 操作バーから選択可能 |
| 音声 | Web Audio API で BGM と効果音を合成 |
| 設定 | 難易度、BGM、効果音、ヒント、アニメーション速度 |
| 保存 | `localStorage` に設定とベストスコアを保存 |
| レスポンシブ | PC、タブレット、スマートフォンに対応 |

### 実行方法

| 手順 | 操作 |
|---|---|
| 1 | プロジェクトをダウンロードまたは clone する |
| 2 | `index.html` をモダンブラウザで開く |
| 3 | `開始遊戲` をクリックして開始する |

npm、Node.js、バンドラ、ローカルサーバーは不要です。Google Fonts は利用可能な場合のみ CDN から読み込まれ、CSS には代替フォントも指定されています。

### ルール早見表

| 項目 | ルール |
|---|---|
| 最初のめくり | 最初にめくった駒の色がプレイヤー陣営になります |
| ターン操作 | 暗棋を 1 枚めくる、自分の明駒を動かす、敵駒を取る |
| 通常移動 | 明駒は上下左右に 1 マス移動できます |
| 通常捕獲 | 隣接する明駒の敵駒を、強弱ルールに従って取れます |
| 強弱順 | 将/帥 > 士/仕 > 象/相 > 車/俥 > 馬/傌 > 包/炮 > 卒/兵 |
| 循環ルール | 兵卒は将帥を取れますが、将帥は兵卒を取れません |
| 炮 | 同じ行または列で、間にちょうど 1 枚の駒がある場合のみ取れます |
| 和局 | 60 ターン連続で捕獲がない場合は和局になります |
| 終局 | すべての駒を取られる、または合法手がない側が敗北します |

### ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリの骨組み、メニュー、設定、ヘルプ、ゲーム画面、終了モーダル |
| `style.css` | テーマ、レイアウト、盤面、駒、ボタン、アニメーション、レスポンシブ |
| `game.js` | ゲーム状態、盤面ロジック、AI、UI 描画、設定、音声、イベント |
| `chinese_dark_chess_spec.md` | 詳細な設計と実装仕様 |
| `README.md` | プロジェクト紹介とコード分類 |

### プログラム分類

| 分類 | コード位置 | 役割 |
|---|---|---|
| 定数 | `game.js` の `PIECE_DEFS`, `DIFFICULTY`, `STORAGE` | 駒定義、AI 難易度、localStorage キーを定義 |
| グローバル状態 | `state` | 盤面、画面状態、陣営、ターン、捕獲、履歴、設定、ログ、ミュートを管理 |
| 音声エンジン | `AudioEngine` | Web Audio API の初期化、BGM、効果音、音量、ミュートを管理 |
| 盤面ロジック | `BoardLogic` | 初期化、めくり、移動、捕獲、合法手判定、終局判定 |
| AI エンジン | `AIEngine` | minimax、alpha-beta 枝刈り、戦術優先、評価関数で手を選択 |
| UI コントローラ | `UIController` | 画面切替、盤面描画、ヒント表示、ステータス更新、結果表示 |
| ゲーム制御 | `GameController` | クリック処理、ターン進行、AI 起動、待った、投降、和局、新局 |
| 設定制御 | `SettingsController` | 設定 UI のイベント接続、保存、セグメントボタン更新 |
| 補助関数 | `game.js` の utility functions | 座標変換、隣接判定、炮の経路、クローン、HTML エスケープ、ログ |

### 画面分類

| HTML セクション | 目的 |
|---|---|
| `#screen-menu` | タイトルとナビゲーションを持つ開始画面 |
| `#screen-settings` | 難易度、音量、ヒント、アニメーション設定 |
| `#screen-help` | 走法、強弱、炮、勝敗条件の説明タブ |
| `#screen-game` | メイン盤面、状態表示、操作バー、ログ |
| `#overlay-gameover` | 再戦とメニュー復帰を行う結果モーダル |

### スタイル分類

| CSS 領域 | 目的 |
|---|---|
| `:root` | 色、時間、フォントの共通変数 |
| レイアウト | 画面、ページ、パネル、メニュー、ゲーム外枠 |
| 盤面 | 8 列 x 4 行のグリッド、盤面枠、セルサイズ |
| 駒 | 裏向き、赤、黒、選択、ホバー、ヒント状態 |
| 操作部品 | ボタン、セグメント、スライダー、トグル |
| アニメーション | 表示開始、AI 思考、ヒント、選択、めくり、捕獲 |
| レスポンシブ | 700px 以下と 374px 以下の画面調整 |

### データと保存

| データ | 保存場所 |
|---|---|
| 現在の盤面とターン | メモリ上の `state` |
| 待った用履歴 | `state.history`、最大 2 件 |
| 難易度 | `localStorage.dchess_difficulty` |
| BGM 音量 | `localStorage.dchess_bgm_vol` |
| 効果音音量 | `localStorage.dchess_sfx_vol` |
| ヒント表示 | `localStorage.dchess_show_hints` |
| アニメーション速度 | `localStorage.dchess_anim_speed` |
| ベストスコア | `localStorage.dchess_best_score` |

---

## 繁體中文

### 遊戲介紹

| 項目 | 說明 |
|---|---|
| 遊戲 | 中國暗棋，4 x 8 棋盤，共 32 枚暗棋 |
| 模式 | 玩家對戰 AI |
| 平台 | 桌機、平板、手機瀏覽器 |
| 技術 | HTML5、CSS3、Vanilla JavaScript |
| 建置 | 不需要 |
| 入口 | 直接用瀏覽器開啟 `index.html` |

這是一款可直接在瀏覽器執行的中國暗棋單機遊戲。開局所有棋子皆為暗棋，玩家翻開第一枚棋子後即決定自己的陣營，AI 自動操作另一方。遊戲重點在於翻棋資訊、棋子強弱、炮的特殊吃法，以及如何在有限資訊下取得局面優勢。

### 主要功能

| 功能 | 說明 |
|---|---|
| 4 x 8 棋盤 | 開局 32 格皆放置棋子 |
| 第一翻定陣營 | 玩家第一次翻出的棋色就是玩家陣營 |
| 完整走吃規則 | 支援相鄰移動、大小吃子、兵卒吃將帥、炮隔子吃 |
| AI 對手 | 簡單、普通、困難三種難度 |
| 悔棋 | 保留最多 2 筆玩家操作前狀態 |
| 和局與投降 | 操作列提供和局、投降按鈕 |
| 音效 | 使用 Web Audio API 合成背景音與效果音 |
| 設定 | 難度、背景音量、音效音量、提示、動畫速度 |
| 儲存 | 使用 `localStorage` 保存設定與最佳成績 |
| 響應式介面 | 桌機、平板、手機皆可操作 |

### 執行方式

| 步驟 | 操作 |
|---|---|
| 1 | 下載或 clone 此專案 |
| 2 | 使用現代瀏覽器開啟 `index.html` |
| 3 | 點擊 `開始遊戲` 進入對局 |

不需要 npm、Node.js、打包工具或本機伺服器。Google Fonts 會在可連網時載入，CSS 也已設定本機 fallback 字體。

### 規則速查

| 項目 | 規則 |
|---|---|
| 第一翻 | 第一枚翻開的棋決定玩家陣營 |
| 每回合動作 | 翻開一枚暗棋、移動一枚己方明棋、或吃一枚敵方明棋 |
| 一般移動 | 明棋可向上、下、左、右移動一格 |
| 一般吃子 | 依棋子大小吃掉相鄰敵方明棋 |
| 大小順序 | 將/帥 > 士/仕 > 象/相 > 車/俥 > 馬/傌 > 包/炮 > 卒/兵 |
| 循環規則 | 兵卒可以吃將帥，但將帥不能吃兵卒 |
| 炮的吃法 | 炮必須同列或同行，且中間剛好隔一枚任意棋子，才能吃目標 |
| 和局 | 連續 60 回合沒有吃子時判定和局 |
| 勝負 | 任一方棋子全被吃光，或無合法行動，即判負 |

### 專案檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 網頁入口，包含主選單、設定、說明、遊戲畫面、結束視窗 |
| `style.css` | 視覺主題、排版、棋盤、棋子、按鈕、動畫、響應式樣式 |
| `game.js` | 遊戲狀態、棋盤規則、AI、UI 渲染、設定、音效、事件綁定 |
| `chinese_dark_chess_spec.md` | 完整規格書與設計說明 |
| `README.md` | 專案介紹與程式分類 |

### 程式分類詳細介紹

| 分類 | 程式位置 | 負責內容 |
|---|---|---|
| 常數定義 | `game.js` 的 `PIECE_DEFS`, `DIFFICULTY`, `STORAGE` | 定義棋子種類、數量、強度、AI 難度、儲存鍵值 |
| 全域狀態 | `state` | 管理棋盤、畫面階段、玩家陣營、AI 陣營、回合、選取、吃子、歷史、設定、紀錄、靜音 |
| 音效引擎 | `AudioEngine` | 初始化 Web Audio API，播放背景音、移動音、翻棋音、吃子音、勝負音，控制音量與靜音 |
| 棋盤邏輯 | `BoardLogic` | 建立棋子、洗牌、翻棋、移動、吃子、合法走法、炮攻擊、勝負判斷 |
| AI 引擎 | `AIEngine` | 取得所有可行動作，使用 minimax 與 alpha-beta 剪枝評估局面並選擇行動 |
| UI 控制 | `UIController` | 切換畫面、渲染棋盤、顯示可走提示、更新狀態列、顯示結束視窗 |
| 遊戲流程 | `GameController` | 開始新局、處理玩家點擊、執行移動與吃子、切換回合、觸發 AI、悔棋、投降、和局 |
| 設定控制 | `SettingsController` | 綁定設定頁事件、保存設定、更新難度與動畫速度按鈕狀態 |
| 工具函式 | `game.js` 底部輔助函式 | 處理鄰格、同行同列、炮路徑、棋盤複製、HTML escape、操作紀錄、最佳成績 |

### HTML 畫面分類

| 區塊 | 用途 |
|---|---|
| `#screen-menu` | 主選單，提供開始遊戲、設定、遊戲說明 |
| `#screen-settings` | 設定 AI 難度、背景音量、音效音量、提示與動畫速度 |
| `#screen-help` | 以分頁呈現走法、大小、炮、勝負規則 |
| `#screen-game` | 實際遊戲畫面，包含狀態列、棋盤、操作列與紀錄 |
| `#overlay-gameover` | 遊戲結束彈窗，提供再來一局與回主選單 |

### CSS 樣式分類

| 區域 | 用途 |
|---|---|
| `:root` | 定義主色、棋盤色、文字色、動畫時間與字體 |
| Layout | 控制畫面、頁面、面板、主選單與遊戲外框 |
| Board | 建立 8 欄 x 4 列棋盤、格子尺寸與棋盤外框 |
| Piece | 控制暗棋、紅棋、黑棋、選取、hover、提示點等狀態 |
| Controls | 按鈕、分段選單、滑桿、checkbox toggle |
| Animation | 進場、AI 思考點、可走提示、選取閃爍、翻棋、吃子動畫 |
| Responsive | 針對 700px 以下與 374px 以下螢幕調整排版與尺寸 |

### 資料與儲存

| 資料 | 儲存位置 |
|---|---|
| 即時棋盤與回合狀態 | 記憶體中的 `state` |
| 悔棋資料 | `state.history`，最多保留 2 筆 |
| AI 難度 | `localStorage.dchess_difficulty` |
| 背景音量 | `localStorage.dchess_bgm_vol` |
| 音效音量 | `localStorage.dchess_sfx_vol` |
| 是否顯示提示 | `localStorage.dchess_show_hints` |
| 動畫速度 | `localStorage.dchess_anim_speed` |
| 最佳成績 | `localStorage.dchess_best_score` |
