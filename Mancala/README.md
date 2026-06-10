# Mancala / 播棋 / マンカラ

Pure frontend Mancala game using the Kalah rule set. The project runs directly from `index.html` without a build step.

純前端 Mancala 播棋遊戲，採用 Kalah 規則，可直接開啟 `index.html` 遊玩，無需建置流程。

Kalah ルールを採用した純粋なフロントエンド版 Mancala です。ビルド不要で `index.html` から直接遊べます。

---

## Quick Destination Map / 快速導覽 / クイックナビ

| Language | Overview | Program Organization | Detailed Breakdown | Game Rules | How to Play |
|---|---:|---:|---:|---:|---:|
| English | [Overview](#en-overview) | [Organization](#en-program-organization) | [Breakdown](#en-program-breakdown) | [Rules](#en-game-rules) | [Play](#en-how-to-play) |
| 中文 | [專案概覽](#zh-overview) | [程式分類邏輯](#zh-program-organization) | [程式詳細分解](#zh-program-breakdown) | [遊戲規則](#zh-game-rules) | [遊玩方式](#zh-how-to-play) |
| 日本語 | [概要](#ja-overview) | [構成方針](#ja-program-organization) | [詳細分解](#ja-program-breakdown) | [ルール](#ja-game-rules) | [遊び方](#ja-how-to-play) |

## Project Paths / 專案路徑 / プロジェクト構成

| Path | Purpose |
|---|---|
| `index.html` | Single-page app shell, screens, controls, and script/style loading order. |
| `css/` | Base styles, layout, components, themes, and animations. |
| `js/core/` | Game state, validation, and Kalah rule engine. |
| `js/ai/` | Easy, normal, and hard AI strategies. |
| `js/audio/` | Web Audio API sound effects and generated background music. |
| `js/storage/` | `localStorage` save game and settings persistence. |
| `js/ui/` | Rendering, screen switching, animation hooks, toasts, themes, and i18n. |
| `assets/` | Static assets and font notes. |

---

<a id="en-overview"></a>

# English

## Overview

| Item | Description |
|---|---|
| Game | Mancala using the Kalah variant. |
| Mode | Human player versus AI. |
| AI levels | Easy, Normal, Hard. |
| Platform | Browser, pure frontend SPA. |
| Entry point | Open `index.html`. |
| Build step | None. |
| Save data | Uses `localStorage` for game progress and settings. |
| Languages | Traditional Chinese, English, Japanese. |

## Quick Start

| Step | Action |
|---:|---|
| 1 | Open `index.html` in a modern browser. |
| 2 | Choose **Start Game**. |
| 3 | Select an AI difficulty. |
| 4 | Pick one of your non-empty pits on the bottom row. |
| 5 | Use **Settings** to switch language, theme, audio, difficulty defaults, or initial stones. |

<a id="en-program-organization"></a>

## Program Organization

| Layer | Folder / File | Responsibility | Depends On | Avoids |
|---|---|---|---|---|
| App shell | `index.html` | Declares screens, controls, board containers, modal root, toast root. | CSS and JS files. | Game calculations. |
| Base styles | `css/base/` | Reset, variables, typography. | CSS custom properties. | Component-specific logic. |
| Layout styles | `css/layout/` | Screen layout, app shell, responsive rules. | Theme variables. | Game state. |
| Component styles | `css/components/` | Board, buttons, HUD, modal, menu, settings, toast. | Theme variables and DOM classes. | JS logic. |
| Theme styles | `css/themes/` | Six visual themes selected by `data-theme`. | `ThemeManager`. | Layout changes. |
| Animation styles | `css/animations/` | Screen, pit, capture, toast, result animations. | UI classes toggled by JS. | Rule decisions. |
| Core logic | `js/core/` | Board state, legal move checks, sowing, capture, extra turn, game over. | Plain arrays and state objects. | DOM, audio, storage. |
| AI logic | `js/ai/` | Chooses moves for three difficulties. | Core engine previews and validators. | DOM mutation. |
| Audio | `js/audio/` | Programmatic SFX and simple background music. | Web Audio API. | Rule mutation. |
| Storage | `js/storage/` | Saves and loads game/settings data. | `localStorage`. | UI rendering. |
| UI | `js/ui/` | Board rendering, screen switching, theme, toast, animations, translations. | DOM and app state. | Rule calculations. |
| App coordinator | `js/main.js` | Wires modules, handles user actions, AI turns, saves, and rendering. | All modules. | Low-level Kalah math. |

<a id="en-program-breakdown"></a>

## Program Breakdown

### Core JavaScript

| File | Main Object | What It Does | Key Notes |
|---|---|---|---|
| `js/core/GameState.js` | `Mancala.GameState` | Holds board, current turn, timer, move count, winner, difficulty, pause state. | Has `toJSON()`, `clone()`, and `fromSave()`. |
| `js/core/MoveValidator.js` | `Mancala.MoveValidator` | Defines pit ownership, legal moves, stores, opposite pits, and side totals. | Uses indices `0-5` for player pits, `6` player store, `7-12` AI pits, `13` AI store. |
| `js/core/GameEngine.js` | `Mancala.GameEngine` | Applies Kalah moves: sowing, skipping opponent store, capture, extra turn, game over collection. | Pure rule engine; does not touch DOM or audio. |

### AI JavaScript

| File | Difficulty | Strategy | Behavior |
|---|---|---|---|
| `js/ai/AIEasy.js` | Easy | Random legal move. | Good for learning rules. |
| `js/ai/AINormal.js` | Normal | Greedy scoring. | Prefers extra turns, captures, store gains, and safer moves. |
| `js/ai/AIHard.js` | Hard | Minimax with alpha-beta pruning. | Looks ahead several plies and evaluates store difference, pit difference, extra turns, and capture potential. |
| `js/ai/AIController.js` | All | Strategy router. | Selects the correct AI class and provides thinking delays. |

### UI JavaScript

| File | Main Object | What It Does | Dynamic Output |
|---|---|---|---|
| `js/ui/BoardRenderer.js` | `Mancala.BoardRenderer` | Creates pit and store DOM nodes from the current state. | Pit labels, stone counts, clickability, ARIA labels. |
| `js/ui/AnimationManager.js` | `Mancala.AnimationManager` | Adds temporary animation classes and plays move SFX. | Sowing pulse, capture highlight, extra-turn sound. |
| `js/ui/ScreenManager.js` | `Mancala.ScreenManager` | Switches active screens. | Dispatches `mancala:screenChange`. |
| `js/ui/ThemeManager.js` | `Mancala.ThemeManager` | Applies `data-theme` to the document root. | Dispatches `mancala:themeChange`. |
| `js/ui/ToastManager.js` | `Mancala.ToastManager` | Shows short status messages. | Auto-removing toast elements. |
| `js/ui/I18n.js` | `Mancala.I18n` | Holds Traditional Chinese, English, and Japanese dictionaries. | Static screen text, dynamic modal text, ARIA labels, toasts, status lines. |

### Supporting Systems

| File | System | Responsibility |
|---|---|---|
| `js/audio/SoundEffects.js` | Audio data | Defines generated SFX patterns. |
| `js/audio/MusicPlayer.js` | Music data | Defines generated background music note sequences. |
| `js/audio/AudioEngine.js` | Audio runtime | Initializes Web Audio, plays SFX, starts/stops music, applies volume/mute settings. |
| `js/storage/SaveManager.js` | Persistence | Reads/writes `mancala_save` and `mancala_settings`. |
| `js/main.js` | App flow | Starts games, continues saves, opens modals, handles player moves, schedules AI, updates HUD, saves state. |

### Data Flow

| Stage | Source | Module | Result |
|---:|---|---|---|
| 1 | User clicks a pit | `main.js` | Requests a move. |
| 2 | Current state and pit index | `MoveValidator` | Confirms the move is legal. |
| 3 | Legal move | `GameEngine` | Produces updated board, capture, extra turn, or game over. |
| 4 | Move result | `BoardRenderer` and `AnimationManager` | Updates board and plays move feedback. |
| 5 | Updated state | `SaveManager` | Saves progress unless the game ended. |
| 6 | AI turn | `AIController` | Chooses a move and repeats the same pipeline. |

### Storage Keys

| Key | Data | When Updated |
|---|---|---|
| `mancala_save` | Board, turn, difficulty, timer, move count, initial stones. | After each completed move and when returning to menu. |
| `mancala_settings` | Theme, language, audio volumes, mute flags, timer visibility, default difficulty, initial stones. | When settings are saved or audio toggles are changed. |

<a id="en-game-rules"></a>

## Game Rules

| Rule | Details |
|---|---|
| Board | 14 slots: 12 small pits and 2 stores. |
| Player side | Bottom 6 pits, indices `0-5`; store index `6`. |
| AI side | Top 6 pits, indices `7-12`; store index `13`. |
| Starting stones | Configurable, default is 4 per small pit. |
| Move | Pick all stones from one non-empty pit on your side, then sow counter-clockwise. |
| Opponent store | Always skipped during sowing. |
| Extra turn | If the last stone lands in your own store, you move again. |
| Capture | If the last stone lands in your empty pit and the opposite pit has stones, both pits are captured into your store. |
| Game over | When either side's 6 pits are all empty. |
| Final collection | Remaining stones on the non-empty side are moved into that side's store. |
| Winner | The side with more stones in the store wins. Equal totals produce a draw. |

<a id="en-how-to-play"></a>

## How to Play

| Screen / Control | What To Do |
|---|---|
| Main menu | Start a new game, continue a saved game, open rules, or open settings. |
| Difficulty modal | Choose Easy, Normal, or Hard AI. |
| Game board | Click a highlighted bottom pit to move. Disabled pits cannot be selected. |
| HUD | Shows AI difficulty, timer, AI store score, and player store score. |
| Status line | Shows whose turn it is, pause state, AI thinking, or game over. |
| SFX button | Toggle sound effects. |
| Music button | Toggle generated background music. |
| Pause button | Pause or resume the current game. |
| Main menu button | Saves progress and returns to the main menu after confirmation. |
| Settings | Change language, theme, audio, timer visibility, default difficulty, and initial stones. |
| Game over screen | Shows winner, final scores, duration, and total move count. |

---

<a id="zh-overview"></a>

# 中文

## 專案概覽

| 項目 | 說明 |
|---|---|
| 遊戲 | Mancala 播棋，採用 Kalah 規則變體。 |
| 模式 | 玩家對 AI。 |
| AI 難度 | 簡單、普通、困難。 |
| 平台 | 瀏覽器純前端單頁應用。 |
| 入口 | 開啟 `index.html`。 |
| 建置 | 不需要 npm、Node 或打包流程。 |
| 存檔 | 使用 `localStorage` 保存遊戲進度與設定。 |
| 語系 | 繁體中文、英文、日文。 |

## 快速開始

| 步驟 | 操作 |
|---:|---|
| 1 | 用現代瀏覽器開啟 `index.html`。 |
| 2 | 點擊「開始遊戲」。 |
| 3 | 選擇 AI 難度。 |
| 4 | 點擊下方玩家側的非空小坑。 |
| 5 | 到「設定」切換語言、主題、音量、預設難度或每坑初始棋子數。 |

<a id="zh-program-organization"></a>

## 程式分類邏輯

| 層級 | 資料夾 / 檔案 | 負責內容 | 依賴 | 不負責 |
|---|---|---|---|---|
| App 外殼 | `index.html` | 宣告畫面、按鈕、棋盤容器、Modal、Toast、載入順序。 | CSS / JS 檔案。 | 遊戲規則計算。 |
| 基礎樣式 | `css/base/` | Reset、CSS 變數、字體設定。 | CSS custom properties。 | 元件細節。 |
| 版面樣式 | `css/layout/` | App 容器、畫面切換、RWD。 | 主題變數。 | 遊戲狀態。 |
| 元件樣式 | `css/components/` | 棋盤、按鈕、HUD、Modal、選單、設定、Toast。 | DOM class 與主題變數。 | JS 邏輯。 |
| 主題樣式 | `css/themes/` | 六套主題配色。 | `ThemeManager` 設定的 `data-theme`。 | 版面結構。 |
| 動畫樣式 | `css/animations/` | 畫面切換、棋坑回饋、吃子、Toast、勝利動畫。 | JS 加上的暫時 class。 | 規則判斷。 |
| 核心邏輯 | `js/core/` | 棋盤狀態、合法走法、播種、吃子、再走一次、結束。 | 純資料。 | DOM、音效、存檔。 |
| AI 邏輯 | `js/ai/` | 三種 AI 難度的走法選擇。 | Core 的預覽與驗證。 | DOM 更新。 |
| 音訊 | `js/audio/` | Web Audio 音效與背景音樂。 | Web Audio API。 | 遊戲規則改動。 |
| 存檔 | `js/storage/` | 遊戲進度與設定持久化。 | `localStorage`。 | UI 渲染。 |
| UI 管理 | `js/ui/` | 棋盤渲染、畫面切換、主題、Toast、動畫、語系。 | DOM 與目前遊戲狀態。 | Kalah 規則計算。 |
| App 協調 | `js/main.js` | 串接所有模組，處理玩家操作、AI 回合、彈窗、HUD、存檔。 | 所有模組。 | 低階規則細節。 |

<a id="zh-program-breakdown"></a>

## 程式詳細分解

### 核心 JavaScript

| 檔案 | 主要物件 | 功能 | 重點 |
|---|---|---|---|
| `js/core/GameState.js` | `Mancala.GameState` | 保存棋盤、目前回合、計時、回合數、勝負、難度、暫停狀態。 | 提供 `toJSON()`、`clone()`、`fromSave()`。 |
| `js/core/MoveValidator.js` | `Mancala.MoveValidator` | 定義坑位歸屬、合法走法、大倉、對面坑、雙方小坑總數。 | 玩家小坑 `0-5`，玩家大倉 `6`，AI 小坑 `7-12`，AI 大倉 `13`。 |
| `js/core/GameEngine.js` | `Mancala.GameEngine` | 執行 Kalah 走法：播種、跳過對手大倉、吃子、再走一次、結束收子。 | 純規則引擎，不碰 DOM 或音效。 |

### AI JavaScript

| 檔案 | 難度 | 策略 | 行為 |
|---|---|---|---|
| `js/ai/AIEasy.js` | 簡單 | 隨機合法走法。 | 適合熟悉規則。 |
| `js/ai/AINormal.js` | 普通 | 貪婪評分。 | 優先再走一次、吃子、進大倉、降低被吃風險。 |
| `js/ai/AIHard.js` | 困難 | Minimax + Alpha-Beta 剪枝。 | 依大倉差、小坑差、再走一次機會、吃子潛力評估多步後果。 |
| `js/ai/AIController.js` | 全部 | AI 策略分派器。 | 根據難度建立對應 AI，並提供思考延遲。 |

### UI JavaScript

| 檔案 | 主要物件 | 功能 | 動態輸出 |
|---|---|---|---|
| `js/ui/BoardRenderer.js` | `Mancala.BoardRenderer` | 依照 GameState 建立棋坑與大倉 DOM。 | 坑位標籤、棋子數、可點擊狀態、ARIA。 |
| `js/ui/AnimationManager.js` | `Mancala.AnimationManager` | 加上暫時動畫 class 並播放走法音效。 | 播種脈衝、吃子高亮、再走一次音效。 |
| `js/ui/ScreenManager.js` | `Mancala.ScreenManager` | 切換目前顯示畫面。 | 發送 `mancala:screenChange`。 |
| `js/ui/ThemeManager.js` | `Mancala.ThemeManager` | 設定文件根節點的 `data-theme`。 | 發送 `mancala:themeChange`。 |
| `js/ui/ToastManager.js` | `Mancala.ToastManager` | 顯示短訊息提示。 | 自動消失的 Toast。 |
| `js/ui/I18n.js` | `Mancala.I18n` | 管理繁中、英文、日文字典。 | 靜態文字、動態彈窗、ARIA、Toast、狀態列。 |

### 支援系統

| 檔案 | 系統 | 職責 |
|---|---|---|
| `js/audio/SoundEffects.js` | 音效資料 | 定義程式化音效 pattern。 |
| `js/audio/MusicPlayer.js` | 音樂資料 | 定義背景音樂音符序列。 |
| `js/audio/AudioEngine.js` | 音訊執行 | 初始化 Web Audio、播放音效、播放/停止音樂、套用音量/靜音。 |
| `js/storage/SaveManager.js` | 持久化 | 讀寫 `mancala_save` 與 `mancala_settings`。 |
| `js/main.js` | App 流程 | 開局、續局、彈窗、玩家走法、AI 排程、HUD、存檔。 |

### 流程資料流

| 階段 | 來源 | 模組 | 結果 |
|---:|---|---|---|
| 1 | 玩家點擊棋坑 | `main.js` | 送出走法請求。 |
| 2 | 目前狀態與坑位 | `MoveValidator` | 確認是否合法。 |
| 3 | 合法走法 | `GameEngine` | 回傳新棋盤、吃子、再走一次或結束資訊。 |
| 4 | 走法結果 | `BoardRenderer` / `AnimationManager` | 更新棋盤並播放視覺與音效回饋。 |
| 5 | 新狀態 | `SaveManager` | 若尚未結束則自動存檔。 |
| 6 | AI 回合 | `AIController` | 選擇 AI 走法並重複同一流程。 |

### 儲存 Key

| Key | 內容 | 更新時機 |
|---|---|---|
| `mancala_save` | 棋盤、回合、難度、時間、回合數、初始棋子數。 | 每步完成後、返回主選單時。 |
| `mancala_settings` | 主題、語言、音量、靜音、計時器顯示、預設難度、初始棋子數。 | 儲存設定或切換音訊時。 |

<a id="zh-game-rules"></a>

## 遊戲規則

| 規則 | 說明 |
|---|---|
| 棋盤 | 共 14 格：12 個小坑與 2 個大倉。 |
| 玩家側 | 下方 6 個小坑，索引 `0-5`；玩家大倉索引 `6`。 |
| AI 側 | 上方 6 個小坑，索引 `7-12`；AI 大倉索引 `13`。 |
| 初始棋子 | 可在設定調整，預設每個小坑 4 顆。 |
| 走法 | 選擇自己側邊非空小坑，取出全部棋子後逆時針逐格播下。 |
| 對手大倉 | 播種時永遠跳過對手大倉。 |
| 再走一次 | 最後一顆落在自己的大倉時，可再走一次。 |
| 吃子 | 最後一顆落在自己的空坑，且對面坑有棋子時，將自己該坑與對面坑棋子收入自己的大倉。 |
| 結束 | 任一方 6 個小坑全部為空時結束。 |
| 收子 | 未空的一方剩餘棋子全部收入該方大倉。 |
| 勝負 | 大倉棋子多者獲勝；相同則平手。 |

<a id="zh-how-to-play"></a>

## 遊戲遊玩方式

| 畫面 / 控制 | 操作方式 |
|---|---|
| 主選單 | 開始新局、繼續存檔、查看說明、開啟設定。 |
| 難度彈窗 | 選擇簡單、普通、困難 AI。 |
| 遊戲棋盤 | 點擊下方高亮的小坑落子；不可點擊的坑會 disabled。 |
| HUD | 顯示 AI 難度、時間、AI 大倉分數、玩家大倉分數。 |
| 狀態列 | 顯示目前回合、暫停、AI 思考中或遊戲結束。 |
| 音效按鈕 | 開關音效。 |
| 音樂按鈕 | 開關背景音樂。 |
| 暫停按鈕 | 暫停或繼續目前遊戲。 |
| 主選單按鈕 | 確認後自動存檔並返回主選單。 |
| 設定 | 可改語言、主題、音量、計時器、預設難度、初始棋子數。 |
| 結算畫面 | 顯示勝負、雙方分數、遊戲時長與總回合數。 |

---

<a id="ja-overview"></a>

# 日本語

## 概要

| 項目 | 説明 |
|---|---|
| ゲーム | Kalah ルールの Mancala。 |
| モード | プレイヤー対 AI。 |
| AI 難易度 | かんたん、ふつう、むずかしい。 |
| プラットフォーム | ブラウザで動く純粋なフロントエンド SPA。 |
| 起動方法 | `index.html` を開く。 |
| ビルド | 不要。 |
| 保存 | `localStorage` に進行状況と設定を保存。 |
| 言語 | 繁體中文、English、日本語。 |

## クイックスタート

| 手順 | 操作 |
|---:|---|
| 1 | モダンブラウザで `index.html` を開きます。 |
| 2 | 「ゲーム開始」を選びます。 |
| 3 | AI 難易度を選びます。 |
| 4 | 下側にある自分の空でないピットを選びます。 |
| 5 | 「設定」から言語、テーマ、音量、既定難易度、初期石数を変更できます。 |

<a id="ja-program-organization"></a>

## 構成方針

| レイヤー | フォルダ / ファイル | 役割 | 依存 | 扱わないもの |
|---|---|---|---|---|
| アプリ外枠 | `index.html` | 画面、ボタン、盤面コンテナ、Modal、Toast、読み込み順を定義。 | CSS / JS。 | ルール計算。 |
| 基本 CSS | `css/base/` | Reset、変数、タイポグラフィ。 | CSS custom properties。 | コンポーネント固有表現。 |
| レイアウト CSS | `css/layout/` | 画面構成、アプリ枠、レスポンシブ対応。 | テーマ変数。 | ゲーム状態。 |
| コンポーネント CSS | `css/components/` | 盤面、ボタン、HUD、Modal、メニュー、設定、Toast。 | DOM class とテーマ変数。 | JS ロジック。 |
| テーマ CSS | `css/themes/` | 6 種類のテーマ配色。 | `ThemeManager` の `data-theme`。 | レイアウト変更。 |
| アニメーション CSS | `css/animations/` | 画面遷移、ピット反応、獲得、Toast、勝利演出。 | JS が付ける一時 class。 | ルール判断。 |
| コア | `js/core/` | 状態、合法手、種まき、獲得、追加手番、終了判定。 | 純粋なデータ。 | DOM、音声、保存。 |
| AI | `js/ai/` | 3 つの難易度ごとの手選択。 | Core のプレビューと検証。 | DOM 更新。 |
| 音声 | `js/audio/` | Web Audio の効果音と BGM。 | Web Audio API。 | ルール変更。 |
| 保存 | `js/storage/` | ゲーム進行と設定の永続化。 | `localStorage`。 | UI 描画。 |
| UI | `js/ui/` | 盤面描画、画面切替、テーマ、Toast、アニメーション、多言語。 | DOM と現在状態。 | Kalah 計算。 |
| アプリ統括 | `js/main.js` | 各モジュール接続、操作処理、AI 手番、Modal、HUD、保存。 | 全モジュール。 | 低レベルなルール計算。 |

<a id="ja-program-breakdown"></a>

## 詳細分解

### Core JavaScript

| ファイル | 主なオブジェクト | 内容 | 補足 |
|---|---|---|---|
| `js/core/GameState.js` | `Mancala.GameState` | 盤面、手番、タイマー、手数、勝敗、難易度、一時停止を保持。 | `toJSON()`、`clone()`、`fromSave()` を持つ。 |
| `js/core/MoveValidator.js` | `Mancala.MoveValidator` | ピット所有者、合法手、ストア、向かいのピット、各側の石数を扱う。 | プレイヤー `0-5`、プレイヤーストア `6`、AI `7-12`、AI ストア `13`。 |
| `js/core/GameEngine.js` | `Mancala.GameEngine` | 種まき、相手ストアのスキップ、獲得、追加手番、終了時の回収を実行。 | DOM や音声に触れない純粋なルールエンジン。 |

### AI JavaScript

| ファイル | 難易度 | 戦略 | 動作 |
|---|---|---|---|
| `js/ai/AIEasy.js` | かんたん | 合法手からランダム選択。 | ルール確認向け。 |
| `js/ai/AINormal.js` | ふつう | 貪欲スコアリング。 | 追加手番、獲得、ストア加点、安全性を優先。 |
| `js/ai/AIHard.js` | むずかしい | Minimax + Alpha-Beta 枝刈り。 | ストア差、ピット差、追加手番、獲得可能性を評価。 |
| `js/ai/AIController.js` | 全難易度 | 戦略の切替。 | 難易度に応じて AI クラスを選び、思考時間も返す。 |

### UI JavaScript

| ファイル | 主なオブジェクト | 内容 | 出力 |
|---|---|---|---|
| `js/ui/BoardRenderer.js` | `Mancala.BoardRenderer` | GameState からピットとストアの DOM を生成。 | ラベル、石数、クリック可否、ARIA。 |
| `js/ui/AnimationManager.js` | `Mancala.AnimationManager` | 一時的なアニメーション class を付け、効果音を再生。 | 種まき反応、獲得ハイライト、追加手番音。 |
| `js/ui/ScreenManager.js` | `Mancala.ScreenManager` | 表示画面を切り替える。 | `mancala:screenChange` を送出。 |
| `js/ui/ThemeManager.js` | `Mancala.ThemeManager` | ルートに `data-theme` を設定。 | `mancala:themeChange` を送出。 |
| `js/ui/ToastManager.js` | `Mancala.ToastManager` | 短い通知を表示。 | 自動で消える Toast。 |
| `js/ui/I18n.js` | `Mancala.I18n` | 繁体字中国語、英語、日本語の辞書を管理。 | 静的文言、動的 Modal、ARIA、Toast、状態表示。 |

### 補助システム

| ファイル | システム | 役割 |
|---|---|---|
| `js/audio/SoundEffects.js` | 効果音データ | 生成音のパターンを定義。 |
| `js/audio/MusicPlayer.js` | BGM データ | BGM の音列を定義。 |
| `js/audio/AudioEngine.js` | 音声実行 | Web Audio 初期化、効果音再生、BGM 再生/停止、音量/ミュート反映。 |
| `js/storage/SaveManager.js` | 永続化 | `mancala_save` と `mancala_settings` を読み書き。 |
| `js/main.js` | アプリフロー | 新規開始、続きから、Modal、プレイヤー手番、AI 予約、HUD、保存。 |

### データフロー

| 段階 | 入力元 | モジュール | 結果 |
|---:|---|---|---|
| 1 | プレイヤーがピットをクリック | `main.js` | 手の要求を作る。 |
| 2 | 現在状態とピット番号 | `MoveValidator` | 合法手か判定。 |
| 3 | 合法手 | `GameEngine` | 新しい盤面、獲得、追加手番、終了情報を返す。 |
| 4 | 手の結果 | `BoardRenderer` / `AnimationManager` | 盤面更新とフィードバック再生。 |
| 5 | 更新済み状態 | `SaveManager` | 終了していなければ自動保存。 |
| 6 | AI 手番 | `AIController` | AI の手を選び、同じ流れを繰り返す。 |

### 保存 Key

| Key | 内容 | 更新タイミング |
|---|---|---|
| `mancala_save` | 盤面、手番、難易度、時間、手数、初期石数。 | 各手の完了後、メニューに戻る時。 |
| `mancala_settings` | テーマ、言語、音量、ミュート、タイマー表示、既定難易度、初期石数。 | 設定保存時、音声切替時。 |

<a id="ja-game-rules"></a>

## ルール

| ルール | 説明 |
|---|---|
| 盤面 | 14 マス：12 個の小ピットと 2 個のストア。 |
| プレイヤー側 | 下側 6 ピット、インデックス `0-5`；ストアは `6`。 |
| AI 側 | 上側 6 ピット、インデックス `7-12`；ストアは `13`。 |
| 初期石数 | 設定で変更可能。既定は各ピット 4 個。 |
| 手番 | 自分側の空でないピットを選び、すべての石を反時計回りに 1 個ずつまく。 |
| 相手ストア | 種まき時に必ず飛ばす。 |
| 追加手番 | 最後の石が自分のストアに入ると、もう一度手番。 |
| 獲得 | 最後の石が自分の空ピットに入り、向かいのピットに石がある場合、両方を自分のストアへ入れる。 |
| 終了 | どちらか一方の 6 ピットがすべて空になると終了。 |
| 最終回収 | 残った石はその側のストアへ入る。 |
| 勝敗 | ストアの石が多い方が勝利。同数なら引き分け。 |

<a id="ja-how-to-play"></a>

## 遊び方

| 画面 / 操作 | 説明 |
|---|---|
| メインメニュー | 新規開始、続きから、遊び方、設定を選ぶ。 |
| 難易度 Modal | かんたん、ふつう、むずかしい AI を選ぶ。 |
| 盤面 | 下側でハイライトされたピットをクリック。選べないピットは disabled。 |
| HUD | AI 難易度、時間、AI ストア得点、プレイヤーストア得点を表示。 |
| 状態表示 | 現在の手番、一時停止、AI 思考中、ゲーム終了を表示。 |
| 効果音ボタン | 効果音のオン/オフ。 |
| 音楽ボタン | BGM のオン/オフ。 |
| 一時停止ボタン | ゲームを一時停止または再開。 |
| メニューボタン | 確認後、自動保存してメインメニューに戻る。 |
| 設定 | 言語、テーマ、音量、タイマー、既定難易度、初期石数を変更。 |
| 結果画面 | 勝敗、最終得点、プレイ時間、合計手数を表示。 |
