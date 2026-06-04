# Blackjack 21

A browser-based Blackjack game built with HTML, CSS, JavaScript, and a small Node.js static server.

| Language | Section |
| --- | --- |
| English | [English README](#english-readme) |
| 日本語 | [日本語 README](#日本語-readme) |
| 繁體中文 | [繁體中文 README](#繁體中文-readme) |

---

## English README

### Project Overview

`Blackjack 21` is a casino-table style Blackjack web game. The player bets chips, plays against the dealer, and also watches AI players make decisions with different difficulty settings. The project is designed as a no-build frontend game: open it in a browser or run the included static server.

| Item | Description |
| --- | --- |
| Genre | Card game / Blackjack / 21 points |
| Platform | Browser |
| Main stack | HTML, CSS, JavaScript, Web Audio API, localStorage |
| Runtime helper | Node.js static file server in `server.mjs` |
| Main entry | `index.html` loads `js/app.js` |
| Spec file | `blackjack_spec.md` documents the larger design direction |

### Quick Start

| Step | Command / Action |
| --- | --- |
| 1 | Make sure Node.js is installed |
| 2 | Run `node server.mjs` |
| 3 | Open `http://localhost:8080` in a browser |

You can also open `index.html` directly in a browser for the current standalone build, but the local server is the recommended way to test the project consistently.

### Game Introduction

The goal is to get as close to 21 as possible without going over. The player competes against the dealer, while AI players participate in the same round as additional table seats.

| Gameplay Area | Details |
| --- | --- |
| Betting | Choose chip values before dealing. Minimum bet is `$10`. |
| Player actions | `Hit`, `Stand`, `Double`, and `Surrender`. |
| Dealer rule | Dealer draws until reaching 17 or higher. |
| Blackjack payout | Natural Blackjack pays `3:2`. |
| Bust | A hand over 21 loses immediately. |
| Push | Equal score against the dealer returns the bet. |
| AI players | Configurable from 1 to 3 AI seats. |
| Records | High score, games played, games won, and top 10 leaderboard are stored locally. |

### Main Features

| Feature | Description |
| --- | --- |
| Casino table UI | Felt table background, card seats, chip controls, and settlement modal. |
| Responsive layout | CSS media queries support desktop and mobile layouts. |
| Multi-deck shoe | Settings support 1, 2, 4, or 6 decks. |
| Hand scoring | Aces are handled as 1 or 11 to avoid busting when possible. |
| AI decisions | Easy mode uses simple thresholds; normal and hard modes use Blackjack strategy logic. |
| Hi-Lo count | Running count is updated when cards are drawn and used by harder AI behavior. |
| Audio | Web Audio API generates button, chip, dealing, win, lose, Blackjack, and background music sounds. |
| Local persistence | Settings and score records are saved through `localStorage`. |

### Controls

| Control | Purpose |
| --- | --- |
| Chip buttons `$10`, `$25`, `$50`, `$100`, `$500` | Add chips to the pending bet. |
| `All In` | Bet all remaining player chips. |
| `Clear` | Return the pending bet before the deal. |
| `Deal` | Start the round after a valid bet. |
| `Hit` | Draw one more card. |
| `Stand` | End the player turn. |
| `Double` | Double the bet, draw one card, then stand. |
| `Surrender` | Give up the round on the first two cards and recover half the bet. |
| `Next Round` | Close settlement and prepare the next bet. |

### Game Flow

| Phase | What Happens |
| --- | --- |
| `IDLE` | Game is waiting or player has no chips. |
| `BETTING` | Player selects chips and prepares the wager. |
| `DEALING` | Cards are dealt to player, AI seats, and dealer. |
| `PLAYER_TURN` | Player chooses Hit, Stand, Double, or Surrender. |
| `AI_TURN` | AI seats play according to the selected difficulty. |
| `DEALER_TURN` | Dealer reveals cards and draws by house rule. |
| `SETTLEMENT` | Results, payouts, records, and leaderboard are updated. |

### Program Classification

| Path | Category | Responsibility |
| --- | --- | --- |
| `index.html` | App shell | Defines all screens: home, game table, settings, leaderboard, help, and settlement dialog. It currently loads `js/app.js`. |
| `server.mjs` | Development server | Serves static files from the project folder with basic MIME types and path protection. |
| `blackjack_spec.md` | Design document | Contains the game specification and project design notes. |
| `README.md` | Documentation | Project introduction, usage, features, and file classification. |

### JavaScript Structure

| Path | Role | Details |
| --- | --- | --- |
| `js/app.js` | Current browser entry | Standalone game implementation used by `index.html`. It combines state, rules, rendering, audio, storage, and event binding. |
| `js/main.js` | Modular entry candidate | Imports modular game, UI, audio, and utility files. Useful if the project switches to ES module loading. |
| `js/game/engine.js` | Game orchestration | Manages phases, dealing, betting, player actions, AI turns, dealer turns, settlement, and payouts. |
| `js/game/deck.js` | Deck and card drawing | Creates shuffled decks, draws cards, reshuffles low shoe count, and updates Hi-Lo count. |
| `js/game/hand.js` | Hand logic | Creates hands, calculates card points, handles Ace adjustment, detects Blackjack and busts. |
| `js/game/player.js` | Player model | Creates player objects, resets each round, and tracks active hand state. |
| `js/game/ai.js` | AI strategy | Defines AI profiles and action decisions for easy, normal, and hard modes. |
| `js/ui/renderer.js` | DOM rendering | Updates chips, cards, scores, buttons, AI seats, and settlement modal. |
| `js/ui/screen.js` | Screen switching | Toggles visible screens by `data-nav` navigation state. |
| `js/ui/animator.js` | UI animation support | Reserved for animation helpers and visual transition expansion. |
| `js/audio/synth.js` | Sound effects | Uses Web Audio oscillators and gain nodes to generate SFX. |
| `js/audio/music.js` | Background music | Plays looped note patterns through the shared synth instance. |
| `js/utils/storage.js` | Persistence | Loads and saves settings, score records, and leaderboard data in `localStorage`. |
| `js/utils/random.js` | Utilities | Provides shuffle, pick, and async delay helpers. |

### CSS Structure

| Path | Category | Responsibility |
| --- | --- | --- |
| `css/reset.css` | CSS foundation | Normalizes browser defaults. |
| `css/variables.css` | Design tokens | Stores colors, fonts, spacing-related tokens, radii, shadows, and transition values. |
| `css/layout.css` | Global layout | Controls body background, app shell spacing, screen visibility, and shared labels. |
| `css/components/button.css` | Buttons | Styles primary, secondary, ghost, accent, and large buttons. |
| `css/components/card.css` | Playing cards | Draws card faces, pips, hidden cards, face cards, and deal animation. |
| `css/components/chip.css` | Chips | Styles circular betting chips by value. |
| `css/components/modal.css` | Dialog | Styles settlement modal and modal action area. |
| `css/screens/home.css` | Home screen | Styles title card, home actions, stats, and decorative card elements. |
| `css/screens/game.css` | Game table | Styles top bar, message bar, dealer/player/AI seats, action panel, and responsive table layout. |
| `css/screens/settings.css` | Settings and records | Styles settings form, help page, leaderboard, and shared settings-card screens. |

### Data Stored in Browser

| localStorage Key | Purpose |
| --- | --- |
| `blackjack_settings` | AI count, difficulty, deck count, starting chips, music volume, and SFX volume. |
| `blackjack_records` | High score, games played, games won, and top 10 leaderboard rows. |

### Settings

| Setting | Options |
| --- | --- |
| AI players | `1`, `2`, `3` |
| AI difficulty | `easy`, `normal`, `hard` |
| Deck count | `1`, `2`, `4`, `6` |
| Starting chips | `$500`, `$1,000`, `$2,000` |
| Music volume | Range slider from `0` to `1` |
| SFX volume | Range slider from `0` to `1` |

---

## 日本語 README

### プロジェクト概要

`Blackjack 21` は、カジノテーブル風のブラウザ向けブラックジャックゲームです。プレイヤーはチップを賭け、ディーラーと勝負します。さらに AI プレイヤーも同じテーブルに参加し、難易度に応じた判断で行動します。

| 項目 | 内容 |
| --- | --- |
| ジャンル | カードゲーム / ブラックジャック / 21 点 |
| 対応環境 | ブラウザ |
| 主な技術 | HTML, CSS, JavaScript, Web Audio API, localStorage |
| 実行補助 | `server.mjs` による Node.js 静的ファイルサーバー |
| メイン入口 | `index.html` が `js/app.js` を読み込みます |
| 仕様書 | `blackjack_spec.md` に設計方針があります |

### クイックスタート

| 手順 | コマンド / 操作 |
| --- | --- |
| 1 | Node.js をインストールします |
| 2 | `node server.mjs` を実行します |
| 3 | ブラウザで `http://localhost:8080` を開きます |

現在の構成では `index.html` を直接開くこともできますが、安定した確認にはローカルサーバーの利用を推奨します。

### ゲーム紹介

目標は 21 を超えない範囲で、できるだけ 21 に近い点数を作ることです。プレイヤーはディーラーと勝負し、AI プレイヤーは追加席としてラウンドに参加します。

| ゲーム要素 | 内容 |
| --- | --- |
| ベット | 配牌前にチップを選びます。最低ベットは `$10` です。 |
| プレイヤー操作 | `Hit`, `Stand`, `Double`, `Surrender` に対応しています。 |
| ディーラー規則 | ディーラーは 17 以上になるまでカードを引きます。 |
| ブラックジャック配当 | ナチュラルブラックジャックは `3:2` で支払われます。 |
| バースト | 21 を超えると負けになります。 |
| プッシュ | ディーラーと同点の場合、ベットが戻ります。 |
| AI プレイヤー | 1 から 3 人まで設定できます。 |
| 記録 | ハイスコア、プレイ回数、勝利数、トップ 10 ランキングを保存します。 |

### 主な機能

| 機能 | 説明 |
| --- | --- |
| カジノテーブル UI | フェルト背景、カード席、チップ操作、結果モーダルを備えています。 |
| レスポンシブ対応 | デスクトップとモバイル向けの CSS メディアクエリがあります。 |
| 複数デッキ | 1、2、4、6 デッキを設定できます。 |
| 手札計算 | Ace は状況に応じて 1 または 11 として扱われます。 |
| AI 判断 | Easy は単純な閾値、Normal と Hard はブラックジャック戦略を利用します。 |
| Hi-Lo カウント | カードを引くたびにランニングカウントを更新し、Hard AI の判断にも使います。 |
| オーディオ | Web Audio API でボタン音、チップ音、配牌音、勝敗音、BGM を生成します。 |
| ローカル保存 | 設定とスコア記録は `localStorage` に保存されます。 |

### 操作一覧

| 操作 | 用途 |
| --- | --- |
| チップ `$10`, `$25`, `$50`, `$100`, `$500` | ベット予定額にチップを追加します。 |
| `All In` | 残りチップをすべて賭けます。 |
| `Clear` | 配牌前のベットを取り消します。 |
| `Deal` | 有効なベット後にラウンドを開始します。 |
| `Hit` | カードを 1 枚引きます。 |
| `Stand` | プレイヤーのターンを終了します。 |
| `Double` | ベットを倍にし、1 枚引いてスタンドします。 |
| `Surrender` | 最初の 2 枚の時点で降り、ベットの半分を回収します。 |
| `Next Round` | 結果画面を閉じ、次のベットに進みます。 |

### ゲーム進行

| フェーズ | 内容 |
| --- | --- |
| `IDLE` | 待機中、またはプレイヤーのチップがありません。 |
| `BETTING` | プレイヤーがチップを選んでベットします。 |
| `DEALING` | プレイヤー、AI、ディーラーへカードを配ります。 |
| `PLAYER_TURN` | プレイヤーが Hit、Stand、Double、Surrender を選びます。 |
| `AI_TURN` | AI が難易度に応じて行動します。 |
| `DEALER_TURN` | ディーラーがカードを公開し、規則に従って引きます。 |
| `SETTLEMENT` | 勝敗、配当、記録、ランキングを更新します。 |

### プログラム分類

| パス | 分類 | 役割 |
| --- | --- | --- |
| `index.html` | アプリ本体 | ホーム、ゲーム、設定、ランキング、ヘルプ、結果ダイアログを定義します。現在は `js/app.js` を読み込みます。 |
| `server.mjs` | 開発サーバー | プロジェクト内の静的ファイルを配信し、基本的な MIME type とパス保護を提供します。 |
| `blackjack_spec.md` | 設計資料 | ゲーム仕様と設計メモをまとめています。 |
| `README.md` | ドキュメント | プロジェクト紹介、使い方、機能、ファイル分類を説明します。 |

### JavaScript 構成

| パス | 役割 | 詳細 |
| --- | --- | --- |
| `js/app.js` | 現在のブラウザ入口 | `index.html` から読み込まれる単体版です。状態管理、ルール、描画、音声、保存、イベント処理をまとめています。 |
| `js/main.js` | モジュール入口候補 | ゲーム、UI、音声、ユーティリティの各モジュールを import します。ES Modules 化する場合の入口です。 |
| `js/game/engine.js` | ゲーム進行管理 | フェーズ、配牌、ベット、プレイヤー操作、AI、ディーラー、精算、配当を管理します。 |
| `js/game/deck.js` | デッキ管理 | デッキ作成、シャッフル、ドロー、再シャッフル、Hi-Lo カウント更新を行います。 |
| `js/game/hand.js` | 手札ロジック | 手札生成、点数計算、Ace 補正、ブラックジャック、バースト判定を行います。 |
| `js/game/player.js` | プレイヤーモデル | プレイヤー作成、ラウンド初期化、アクティブハンド状態を扱います。 |
| `js/game/ai.js` | AI 戦略 | AI プロファイルと難易度別の行動判断を定義します。 |
| `js/ui/renderer.js` | DOM 描画 | チップ、カード、点数、ボタン、AI 席、結果モーダルを更新します。 |
| `js/ui/screen.js` | 画面切替 | `data-nav` に基づいて表示画面を切り替えます。 |
| `js/ui/animator.js` | アニメーション補助 | UI アニメーションや演出拡張用の補助領域です。 |
| `js/audio/synth.js` | 効果音 | Web Audio の oscillator と gain node で効果音を生成します。 |
| `js/audio/music.js` | BGM | 共有 synth を通じてループする音階パターンを再生します。 |
| `js/utils/storage.js` | 保存処理 | 設定、スコア記録、ランキングを `localStorage` で読み書きします。 |
| `js/utils/random.js` | 汎用補助 | shuffle、pick、delay を提供します。 |

### CSS 構成

| パス | 分類 | 役割 |
| --- | --- | --- |
| `css/reset.css` | CSS 基盤 | ブラウザ既定スタイルをリセットします。 |
| `css/variables.css` | デザイントークン | 色、フォント、角丸、影、トランジションなどを管理します。 |
| `css/layout.css` | 全体レイアウト | 背景、アプリ余白、画面表示、共通ラベルを定義します。 |
| `css/components/button.css` | ボタン | Primary、Secondary、Ghost、Accent、大型ボタンを定義します。 |
| `css/components/card.css` | トランプ表示 | カード表面、マーク配置、裏向きカード、絵札、配牌アニメーションを描画します。 |
| `css/components/chip.css` | チップ | 金額別の円形チップを定義します。 |
| `css/components/modal.css` | ダイアログ | 結果モーダルとアクション領域を定義します。 |
| `css/screens/home.css` | ホーム画面 | タイトル、ホーム操作、スコア表示、装飾カードを定義します。 |
| `css/screens/game.css` | ゲーム画面 | トップバー、メッセージ、席、操作パネル、レスポンシブ配置を定義します。 |
| `css/screens/settings.css` | 設定と記録 | 設定フォーム、ヘルプ、ランキング、共通カード画面を定義します。 |

### ブラウザ保存データ

| localStorage キー | 用途 |
| --- | --- |
| `blackjack_settings` | AI 人数、難易度、デッキ数、初期チップ、BGM 音量、効果音音量を保存します。 |
| `blackjack_records` | ハイスコア、プレイ回数、勝利数、トップ 10 ランキングを保存します。 |

### 設定項目

| 設定 | 選択肢 |
| --- | --- |
| AI プレイヤー数 | `1`, `2`, `3` |
| AI 難易度 | `easy`, `normal`, `hard` |
| デッキ数 | `1`, `2`, `4`, `6` |
| 初期チップ | `$500`, `$1,000`, `$2,000` |
| BGM 音量 | `0` から `1` のスライダー |
| 効果音音量 | `0` から `1` のスライダー |

---

## 繁體中文 README

### 專案概覽

`Blackjack 21` 是一款瀏覽器版 Blackjack 21 點遊戲。玩家可以下注、與莊家比點數，也能和 AI 玩家同桌遊玩。專案以原生 HTML、CSS、JavaScript 建立，不需要打包工具，並提供一個簡單的 Node.js 靜態伺服器方便本機測試。

| 項目 | 說明 |
| --- | --- |
| 遊戲類型 | 紙牌遊戲 / Blackjack / 21 點 |
| 執行平台 | 瀏覽器 |
| 主要技術 | HTML, CSS, JavaScript, Web Audio API, localStorage |
| 本機伺服器 | `server.mjs` |
| 目前入口 | `index.html` 載入 `js/app.js` |
| 規格文件 | `blackjack_spec.md` |

### 快速開始

| 步驟 | 指令 / 操作 |
| --- | --- |
| 1 | 確認已安裝 Node.js |
| 2 | 執行 `node server.mjs` |
| 3 | 用瀏覽器開啟 `http://localhost:8080` |

目前 `index.html` 也可以直接用瀏覽器開啟，但建議使用本機伺服器測試，行為會比較接近正式網站環境。

### 遊戲介紹

遊戲目標是在不超過 21 點的前提下，讓手牌點數盡量接近 21。玩家先下注，接著與莊家比牌；AI 玩家會作為同桌玩家加入回合，依照設定難度做出不同決策。

| 遊戲項目 | 說明 |
| --- | --- |
| 下注 | 發牌前選擇籌碼下注，最低下注為 `$10`。 |
| 玩家行動 | 支援 `Hit`、`Stand`、`Double`、`Surrender`。 |
| 莊家規則 | 莊家會持續補牌直到 17 點以上。 |
| Blackjack 賠率 | 起手 Blackjack 以 `3:2` 賠付。 |
| 爆牌 | 手牌超過 21 點即爆牌。 |
| 平手 | 與莊家同點時退還下注。 |
| AI 玩家 | 可設定 1 到 3 位 AI 玩家。 |
| 紀錄 | 本機保存最高分、遊玩次數、勝場數與前 10 名排行榜。 |

### 主要功能

| 功能 | 說明 |
| --- | --- |
| 賭桌風格 UI | 具備綠色牌桌背景、玩家座位、籌碼按鈕、結算彈窗。 |
| 響應式版面 | 使用 CSS media query 支援桌機與手機畫面。 |
| 多副牌牌靴 | 可設定 1、2、4、6 副牌。 |
| 手牌計分 | Ace 會依狀況作為 1 或 11 點，降低爆牌機率。 |
| AI 決策 | Easy 使用簡單閾值，Normal / Hard 使用 Blackjack 策略判斷。 |
| Hi-Lo 計數 | 抽牌時更新 running count，Hard AI 可利用計數調整策略。 |
| 音效與音樂 | 使用 Web Audio API 產生按鈕、籌碼、發牌、勝負、Blackjack 與背景音樂。 |
| 本機保存 | 設定與分數紀錄會寫入 `localStorage`。 |

### 操作說明

| 操作 | 用途 |
| --- | --- |
| 籌碼 `$10`, `$25`, `$50`, `$100`, `$500` | 增加本回合預計下注金額。 |
| `All In` | 將玩家剩餘籌碼全部下注。 |
| `Clear` | 發牌前清除目前下注並退回籌碼。 |
| `Deal` | 在下注有效後開始發牌。 |
| `Hit` | 補一張牌。 |
| `Stand` | 停牌並結束玩家回合。 |
| `Double` | 加倍下注，補一張牌後自動停牌。 |
| `Surrender` | 起手兩張牌時投降，取回一半下注。 |
| `Next Round` | 關閉結算視窗並進入下一回合下注。 |

### 遊戲流程

| 階段 | 說明 |
| --- | --- |
| `IDLE` | 等待中，或玩家籌碼已歸零。 |
| `BETTING` | 玩家選擇籌碼並建立下注。 |
| `DEALING` | 發牌給玩家、AI 與莊家。 |
| `PLAYER_TURN` | 玩家選擇 Hit、Stand、Double 或 Surrender。 |
| `AI_TURN` | AI 依難度與策略行動。 |
| `DEALER_TURN` | 莊家公開手牌並依規則補牌。 |
| `SETTLEMENT` | 結算勝負、派彩、紀錄與排行榜。 |

### 程式分類

| 路徑 | 分類 | 職責 |
| --- | --- | --- |
| `index.html` | 應用程式外殼 | 定義首頁、遊戲桌、設定、排行榜、說明與結算 dialog。目前載入 `js/app.js`。 |
| `server.mjs` | 開發伺服器 | 從專案資料夾提供靜態檔案，處理基本 MIME type 與路徑保護。 |
| `blackjack_spec.md` | 規格文件 | 保存遊戲規格與設計方向。 |
| `README.md` | 專案文件 | 說明專案、玩法、功能、啟動方式與程式分類。 |

### JavaScript 結構

| 路徑 | 角色 | 詳細說明 |
| --- | --- | --- |
| `js/app.js` | 目前瀏覽器入口 | `index.html` 實際載入的整合版程式，包含狀態、規則、畫面、音效、儲存與事件綁定。 |
| `js/main.js` | 模組化入口候選 | 匯入 game、ui、audio、utils 模組；若改為 ES Modules 架構可作為入口。 |
| `js/game/engine.js` | 遊戲主流程 | 管理階段、下注、發牌、玩家行動、AI 回合、莊家回合、結算與派彩。 |
| `js/game/deck.js` | 牌組管理 | 建立牌組、洗牌、抽牌、牌靴不足時重洗，並更新 Hi-Lo 計數。 |
| `js/game/hand.js` | 手牌邏輯 | 建立手牌、計算點數、處理 Ace、判斷 Blackjack 與爆牌。 |
| `js/game/player.js` | 玩家資料模型 | 建立玩家物件、重置回合狀態、管理目前手牌。 |
| `js/game/ai.js` | AI 策略 | 定義 AI 角色與不同難度下的行動判斷。 |
| `js/ui/renderer.js` | 畫面渲染 | 更新籌碼、牌面、分數、按鈕狀態、AI 區塊與結算彈窗。 |
| `js/ui/screen.js` | 畫面切換 | 依照 `data-nav` 控制目前顯示的 screen。 |
| `js/ui/animator.js` | 動畫輔助 | 預留給 UI 動畫與視覺轉場擴充。 |
| `js/audio/synth.js` | 音效合成 | 使用 Web Audio oscillator 與 gain node 產生音效。 |
| `js/audio/music.js` | 背景音樂 | 透過共用 synth 播放循環音符模式。 |
| `js/utils/storage.js` | 本機儲存 | 讀寫設定、分數紀錄與排行榜到 `localStorage`。 |
| `js/utils/random.js` | 工具函式 | 提供 shuffle、pick、delay 等通用函式。 |

### CSS 結構

| 路徑 | 分類 | 職責 |
| --- | --- | --- |
| `css/reset.css` | CSS 基礎 | 重置瀏覽器預設樣式。 |
| `css/variables.css` | 設計變數 | 管理顏色、字體、圓角、陰影、動畫時間等 token。 |
| `css/layout.css` | 全域版面 | 控制 body 背景、app shell 間距、screen 顯示與共用標籤樣式。 |
| `css/components/button.css` | 按鈕元件 | 定義主要、次要、ghost、accent、大尺寸按鈕。 |
| `css/components/card.css` | 撲克牌元件 | 繪製牌面、點數排列、背面牌、人物牌與發牌動畫。 |
| `css/components/chip.css` | 籌碼元件 | 依金額定義圓形籌碼外觀。 |
| `css/components/modal.css` | 彈窗元件 | 定義結算 dialog 與操作按鈕區。 |
| `css/screens/home.css` | 首頁 | 定義首頁卡片、主操作、最高分與裝飾牌。 |
| `css/screens/game.css` | 遊戲畫面 | 定義頂部資訊列、訊息列、玩家座位、AI 區塊、操作面板與 RWD 版面。 |
| `css/screens/settings.css` | 設定與紀錄畫面 | 定義設定表單、說明頁、排行榜與共用 settings-card 版型。 |

### 瀏覽器儲存資料

| localStorage Key | 用途 |
| --- | --- |
| `blackjack_settings` | 保存 AI 數量、難度、牌副數、起始籌碼、音樂音量與音效音量。 |
| `blackjack_records` | 保存最高分、遊玩次數、勝場數與前 10 名排行榜。 |

### 設定項目

| 設定 | 選項 |
| --- | --- |
| AI 玩家數 | `1`, `2`, `3` |
| AI 難度 | `easy`, `normal`, `hard` |
| 牌副數 | `1`, `2`, `4`, `6` |
| 起始籌碼 | `$500`, `$1,000`, `$2,000` |
| 音樂音量 | `0` 到 `1` 的滑桿 |
| 音效音量 | `0` 到 `1` 的滑桿 |
