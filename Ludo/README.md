<div align="center">

# 🎲 Ludo 飛行棋 · Ludo Board Game · ルドー

**A pure front-end, zero-dependency, zero-build Ludo game — just double-click `index.html`.**

純前端 · 零依賴 · 零建置 · 雙擊 `index.html` 即玩
ピュアフロントエンド · 依存ゼロ · ビルド不要 · `index.html` をダブルクリックするだけ

🌐 **3 languages** · 🎨 **6 themes** · 🤖 **3 AI levels** · 🔊 **19 synthesized sounds** · 💾 **auto-save** · 📱 **responsive**

</div>

---

### 🌏 Languages / 言語 / 語言

| [🇬🇧 **English**](#-english) | [🇯🇵 **日本語**](#-日本語) | [🇹🇼 **繁體中文**](#-繁體中文) |
|:---:|:---:|:---:|

> 💡 This README is trilingual. Click a flag above to jump. The **game itself** can switch language live from the menu / settings (繁中 · English · 日本語).

---

# 🇬🇧 English

### 📑 Table of Contents
- [What is this?](#what-is-this)
- [Quick Start](#-quick-start)
- [Game Introduction](#-game-introduction)
- [How to Play](#-how-to-play-en)
- [Game Rules](#-game-rules)
- [Controls](#-controls)
- [AI Difficulty](#-ai-difficulty)
- [Themes & Languages](#-themes--languages)
- [Project / Code Overview](#-project--code-overview)
- [Folder Structure](#-folder-structure)
- [Configurable Rules](#-configurable-rules)
- [Tech Notes](#-tech-notes)

## What is this?
A complete, playable **Ludo** (飛行棋 / Pachisi-style) board game running entirely in the browser. No server, no build step, no internet — open the file and play against 1–3 AI opponents.

## 🚀 Quick Start
1. Download / clone the project.
2. **Double-click `index.html`** (or drag it into any modern browser).
3. Click anywhere once to unlock audio → pick **Start Game** → choose opponents, difficulty & your color → **Start!**

> No installation, no `npm install`, no local server required. Runs from the `file://` protocol.

## 🎯 Game Introduction
Each player owns **4 tokens** that begin locked in their **yard** (corner base). On your turn you **roll one die** and race a token clockwise around the **52-cell outer loop**, then turn into your private **home lane** and finish in the **center**. Land on a lone opponent to **send it home**; first player to bring **all 4 tokens to the center wins**.

| Element | Description |
|---|---|
| 🟥🟩🟨🟦 Tokens | 4 colors × 4 tokens = 16 total |
| 🏠 Yard | Corner base where tokens start (need a **6** to leave) |
| ➿ Main loop | 52 shared cells, traveled clockwise |
| 🛣️ Home lane | 5 private colored cells leading to the center |
| ⭐ Safe cells | Start cells + star cells — tokens here can't be captured |
| 🏆 Center | Final goal; all 4 tokens here = victory |

## 🎮 How to Play (EN)
1. From the menu choose **Start Game**.
2. Select **opponents (1–3 AI)**, **difficulty**, and **your color**.
3. **Click the dice** (or press **Space**) to roll.
4. **Glowing tokens** are movable — click one to move it. (If only one move is legal, it auto-plays.)
5. Roll a **6** to release a token from the yard and to earn a **bonus roll**.
6. Bring all 4 tokens home before the AI does!

## 📜 Game Rules
| # | Rule | Detail |
|---|---|---|
| 1 | 🎲 **Enter on 6** | A yard token can only move out when you roll a 6. |
| 2 | 🔁 **Bonus roll** | Rolling a 6 grants another roll — but **three 6s in a row forfeits** the turn. |
| 3 | 🎯 **Exact finish** | You must reach the center by an exact count; overshooting means that token can't move. |
| 4 | ⚔️ **Capture** | Landing on a single opponent token sends it back to its yard. |
| 5 | ⭐ **Safe cells** | Start cells & star cells protect tokens from capture. |
| 6 | 🧱 **Fortress** | Two+ same-color tokens on one cell form a fortress — others can't land on or pass through it. |
| 7 | 🏆 **Win** | First to bring all 4 tokens to the center wins. |

## 🕹️ Controls
| Action | Desktop | Mobile |
|---|---|---|
| Roll dice | Click dice / **Spacebar** | Tap dice |
| Move token | Click a glowing token | Tap a glowing token |
| Mute / Menu | Bottom dock buttons | Bottom dock buttons |

> 📱 On mobile the dice and buttons live in a **fixed bottom dock** (a third grid row) so the board is **never covered**, and respect the device safe-area (notch / gesture bar).

## 🤖 AI Difficulty
| Level | Behavior |
|---|---|
| 😊 **Easy** | Picks a random legal move. Great for beginners. |
| 🙂 **Normal** | Heuristic scoring: prioritizes captures, releasing tokens on 6, advancing, safe cells, avoiding danger. |
| 😈 **Hard** | Normal + **threat analysis & capture probability**, endgame prioritization, risk-weighted retreats. |

## 🎨 Themes & Languages
**6 color themes** (live-switchable, saved): 🎨 Classic · 🌊 Ocean · 🌅 Sunset · 🌲 Forest · 🌙 Night · ♿ High-Contrast.
**3 languages** (live-switchable, saved): 繁體中文 · English · 日本語.

## 🧩 Project / Code Overview
- **Single page (SPA):** every screen is a `<section>` toggled by show/hide — the page **never reloads**, so **background music plays continuously** across screens.
- **No ES Modules:** all JS loads via classic `<script src>` and shares one global namespace **`window.Ludo`** — this is what makes `file://` double-click work (modules are blocked by CORS on `file://`).
- **Audio is synthesized** at runtime with the **Web Audio API** — 17 SFX + 2 BGM tracks, no audio files needed.
- **Persistence:** `localStorage` auto-saves every turn (Continue) and stores settings separately.

```
Load order (defined in index.html):
namespace → config → state → engine → AI → audio → UI → input → main
```

## 📁 Folder Structure
```
Ludo/
├── index.html              ← single entry; links every CSS/JS file
├── css/
│   ├── base/        reset · variables · typography
│   ├── themes/      classic · ocean · sunset · forest · night · high-contrast
│   ├── layout/      app-shell · menu · board · hud · modal
│   ├── components/  buttons · dice · tokens · controls
│   └── responsive/  desktop · tablet · mobile
├── js/
│   ├── core/        namespace · config · state · storage · i18n
│   ├── engine/      board · rules · dice · token · turn
│   ├── ai/          ai-easy · ai-normal · ai-hard · ai-manager
│   ├── audio/       sound-list · audio-manager
│   ├── ui/          screen-manager · menu · settings · render-board · render-tokens · hud · animations
│   ├── input/       pointer · mobile-controls
│   └── main.js      ← boot / wiring (loads last)
├── assets/          (audio synthesized; see assets/README.txt)
└── README.md
```

### Module responsibilities
| Layer | File | Responsibility |
|---|---|---|
| **Core** | `namespace.js` | Creates `window.Ludo` and sub-namespaces (loads first) |
| | `config.js` | Constants: board geometry, start offsets, safe cells, rules, defaults |
| | `state.js` | Game state object + new-game setup + helpers |
| | `storage.js` | `localStorage` save/load (game + settings) |
| | `i18n.js` | Trilingual dictionary + DOM translation |
| **Engine** | `board.js` | Board geometry: loop/home/yard coordinates, position math |
| | `rules.js` | Legal moves, captures, safe cells, fortress, finish logic |
| | `dice.js` | Dice roll |
| | `token.js` | Token data model: apply move, send home |
| | `turn.js` | **Turn/phase state machine** — the orchestrator |
| **AI** | `ai-easy/normal/hard.js` | Move-selection strategies per difficulty |
| | `ai-manager.js` | Dispatches to the right AI by difficulty |
| **Audio** | `sound-list.js` | Synthesis recipes for every SFX/BGM key |
| | `audio-manager.js` | Singleton Web Audio manager (BGM, SFX, volume, mute) |
| **UI** | `screen-manager.js` | Show/hide screens, transition SFX, BGM switch, result modal |
| | `menu.js` / `settings.js` | Menu & mode select / theme · volume · language |
| | `render-board.js` / `render-tokens.js` | Draw the grid / draw & stack tokens |
| | `hud.js` / `animations.js` | Player info & dice face / move & roll animations |
| **Input** | `pointer.js` | Unified click/touch: nav, roll, token select, sliders, keyboard |
| | `mobile-controls.js` | Dynamic square board sizing on resize |

## ⚙️ Configurable Rules
Edit `js/core/config.js` → `rules`:

| Key | Default | Meaning |
|---|---|---|
| `exactFinish` | `true` | Require an exact roll to finish |
| `threeSixForfeit` | `true` | Three consecutive 6s void the turn |
| `captureBonusRoll` | `false` | Grant a bonus roll after a capture |
| `blockFortress` | `true` | Same-color fortresses block landing & passing |

## 🔧 Tech Notes
Vanilla **HTML / CSS / JavaScript** (ES5/ES6), **CSS Grid + CSS variables**, **Web Audio API**, `localStorage`. **No frameworks, no CDN, no build tools.** Board, tokens and dice are drawn with **pure CSS**.

> ⚠️ `file://` note: `localStorage` is scoped to the file origin, so moving the file's path may make old saves unreadable — this is expected.

<div align="right"><a href="#-languages--言語--語言">⬆ back to top</a></div>

---

# 🇯🇵 日本語

### 📑 目次
- [これは何?](#これは何)
- [クイックスタート](#-クイックスタート)
- [ゲーム紹介](#-ゲーム紹介)
- [遊び方](#-遊び方-ja)
- [ルール](#-ルール)
- [操作方法](#-操作方法)
- [AI 難易度](#-ai-難易度)
- [テーマと言語](#-テーマと言語)
- [プログラム概要](#-プログラム概要)
- [フォルダ構成](#-フォルダ構成)
- [調整可能なルール](#-調整可能なルール)
- [技術メモ](#-技術メモ)

## これは何?
ブラウザだけで完全に動作する **ルドー(飛行棋)** ボードゲームです。サーバー・ビルド・インターネット不要。ファイルを開いて 1〜3 人の AI と対戦できます。

## 🚀 クイックスタート
1. プロジェクトをダウンロード / クローンします。
2. **`index.html` をダブルクリック**(またはブラウザにドラッグ)。
3. 一度どこかをクリックして音声を有効化 →「**ゲーム開始**」→ 相手の数・難易度・自分の色を選択 →「**開始!**」

> インストール・`npm install`・ローカルサーバーは不要。`file://` で直接動作します。

## 🎯 ゲーム紹介
各プレイヤーは **4 つのコマ** を持ち、最初は四隅の **基地** に閉じ込められています。手番では **サイコロを 1 個振り**、コマを **52 マスの外周** を時計回りに進め、自分専用の **ゴール通路** を通って **中央** へ入れます。相手の単独コマに止まると **基地へ送り返せます**。**4 つすべてを中央へ** 入れたプレイヤーの勝ちです。

| 要素 | 説明 |
|---|---|
| 🟥🟩🟨🟦 コマ | 4 色 × 4 個 = 合計 16 |
| 🏠 基地 | コマの出発点(**6** が必要) |
| ➿ 外周 | 共有の 52 マス、時計回り |
| 🛣️ ゴール通路 | 中央へ続く専用 5 マス |
| ⭐ 安全マス | スタート/星マス — 捕獲されない |
| 🏆 中央 | 最終ゴール。4 つ揃えば勝利 |

## 🎮 遊び方 (JA)
1. メニューで「**ゲーム開始**」を選択。
2. **相手(AI 1〜3)**・**難易度**・**自分の色** を選択。
3. **サイコロをクリック**(または **スペースキー**)で振る。
4. **光っているコマ** が動かせます — クリックして移動。(合法手が 1 つだけなら自動実行)
5. **6** を出すと基地からコマを出せ、**追加ターン** ももらえます。
6. AI より先に 4 つのコマをゴールさせましょう!

## 📜 ルール
| # | ルール | 内容 |
|---|---|---|
| 1 | 🎲 **6 で出発** | 基地のコマは 6 を出した時だけ出せる。 |
| 2 | 🔁 **追加ターン** | 6 でもう一度振れる。ただし **3 回連続の 6 は無効**。 |
| 3 | 🎯 **ぴったりゴール** | 中央へは出目ちょうどで到達。超過すると動かせない。 |
| 4 | ⚔️ **捕獲** | 相手の単独コマに止まると基地へ戻す。 |
| 5 | ⭐ **安全マス** | スタート・星マスでは捕獲されない。 |
| 6 | 🧱 **砦** | 同色 2 つ以上で砦になり、他のコマは止まれず通過もできない。 |
| 7 | 🏆 **勝利** | 4 つのコマを最初に中央へ入れたら勝ち。 |

## 🕹️ 操作方法
| 操作 | PC | モバイル |
|---|---|---|
| サイコロを振る | クリック / **スペース** | タップ |
| コマを動かす | 光るコマをクリック | 光るコマをタップ |
| ミュート / メニュー | 下部ドックのボタン | 下部ドックのボタン |

> 📱 モバイルではサイコロとボタンが **下部固定ドック**(グリッド第 3 段)にあり、盤面は **絶対に隠れません**。ノッチ/ジェスチャーバーのセーフエリアにも対応。

## 🤖 AI 難易度
| 難易度 | 動作 |
|---|---|
| 😊 **かんたん** | 合法手からランダムに選択。初心者向け。 |
| 🙂 **普通** | ヒューリスティック評価:捕獲・6 でのコマ出し・前進・安全マス・危険回避を重視。 |
| 😈 **難しい** | 普通 + **脅威分析と捕獲確率**、終盤優先、リスク重み付けの撤退。 |

## 🎨 テーマと言語
**6 つのテーマ**(即時切替・保存):🎨 クラシック · 🌊 海 · 🌅 夕焼け · 🌲 森 · 🌙 夜 · ♿ 高コントラスト。
**3 言語**(即時切替・保存):繁體中文 · English · 日本語。

## 🧩 プログラム概要
- **シングルページ (SPA):** 各画面は `<section>` の表示/非表示で切替 — ページは **再読み込みされない** ため、**BGM は画面をまたいで途切れません**。
- **ES Module 不使用:** すべての JS は従来の `<script src>` で読み込み、唯一のグローバル名前空間 **`window.Ludo`** を共有 — これが `file://` ダブルクリック動作の鍵(モジュールは `file://` の CORS でブロックされる)。
- **音声は実行時に合成:** **Web Audio API** で 17 種の効果音 + 2 曲の BGM を生成、音声ファイル不要。
- **永続化:** `localStorage` が毎ターン自動保存(続きから)、設定は別キーで保存。

```
読み込み順(index.html で定義):
namespace → config → state → engine → AI → audio → UI → input → main
```

## 📁 フォルダ構成
```
Ludo/
├── index.html              ← 唯一の入口。全 CSS/JS を読み込む
├── css/
│   ├── base/        reset · variables · typography
│   ├── themes/      classic · ocean · sunset · forest · night · high-contrast
│   ├── layout/      app-shell · menu · board · hud · modal
│   ├── components/  buttons · dice · tokens · controls
│   └── responsive/  desktop · tablet · mobile
├── js/
│   ├── core/        namespace · config · state · storage · i18n
│   ├── engine/      board · rules · dice · token · turn
│   ├── ai/          ai-easy · ai-normal · ai-hard · ai-manager
│   ├── audio/       sound-list · audio-manager
│   ├── ui/          screen-manager · menu · settings · render-board · render-tokens · hud · animations
│   ├── input/       pointer · mobile-controls
│   └── main.js      ← 起動 / 配線(最後に読込)
├── assets/          (音声は合成。assets/README.txt 参照)
└── README.md
```

### モジュールの責務
| 層 | ファイル | 責務 |
|---|---|---|
| **Core** | `namespace.js` | `window.Ludo` と各サブ名前空間を作成(最初に読込) |
| | `config.js` | 定数:盤面ジオメトリ・起点・安全マス・ルール・既定値 |
| | `state.js` | ゲーム状態オブジェクト + 新規対局の初期化 + 補助 |
| | `storage.js` | `localStorage` 保存/読込(対局 + 設定) |
| | `i18n.js` | 3 言語辞書 + DOM 翻訳 |
| **Engine** | `board.js` | 盤面ジオメトリ:外周/ゴール/基地の座標、位置計算 |
| | `rules.js` | 合法手・捕獲・安全マス・砦・ゴール判定 |
| | `dice.js` | サイコロ |
| | `token.js` | コマのデータ操作:移動適用・基地送還 |
| | `turn.js` | **ターン/フェーズの状態機械** — 全体の司令塔 |
| **AI** | `ai-easy/normal/hard.js` | 難易度別の手の選択戦略 |
| | `ai-manager.js` | 難易度に応じて AI を振り分け |
| **Audio** | `sound-list.js` | 各効果音/BGM の合成レシピ |
| | `audio-manager.js` | シングルトン Web Audio 管理(BGM・SFX・音量・ミュート) |
| **UI** | `screen-manager.js` | 画面切替・遷移音・BGM 切替・結果モーダル |
| | `menu.js` / `settings.js` | メニュー&モード選択 / テーマ・音量・言語 |
| | `render-board.js` / `render-tokens.js` | 盤面描画 / コマ描画と重なり処理 |
| | `hud.js` / `animations.js` | プレイヤー情報&サイコロ目 / 移動&サイコロ演出 |
| **Input** | `pointer.js` | 統一クリック/タッチ:操作・振る・コマ選択・スライダー・キー |
| | `mobile-controls.js` | リサイズ時に正方形の盤面サイズを動的計算 |

## ⚙️ 調整可能なルール
`js/core/config.js` の `rules` を編集:

| キー | 既定 | 意味 |
|---|---|---|
| `exactFinish` | `true` | ゴールに出目ちょうどを要求 |
| `threeSixForfeit` | `true` | 6 を 3 回連続でターン無効 |
| `captureBonusRoll` | `false` | 捕獲後に追加ターン |
| `blockFortress` | `true` | 同色の砦が着地・通過を阻止 |

## 🔧 技術メモ
素の **HTML / CSS / JavaScript**(ES5/ES6)、**CSS Grid + CSS 変数**、**Web Audio API**、`localStorage`。**フレームワーク・CDN・ビルドツール一切なし。** 盤面・コマ・サイコロは **純 CSS** 描画。

> ⚠️ `file://` 注意:`localStorage` はファイルのオリジン単位のため、ファイルのパスを移動すると古いセーブが読めなくなることがあります(仕様)。

<div align="right"><a href="#-languages--言語--語言">⬆ 上へ戻る</a></div>

---

# 🇹🇼 繁體中文

### 📑 目錄
- [這是什麼?](#這是什麼)
- [快速開始](#-快速開始)
- [遊戲介紹](#-遊戲介紹)
- [遊戲玩法](#-遊戲玩法-tw)
- [遊戲規則](#-遊戲規則)
- [操作方式](#-操作方式)
- [AI 難度](#-ai-難度)
- [主題與語言](#-主題與語言)
- [程式概覽](#-程式概覽)
- [資料夾結構](#-資料夾結構)
- [可調整規則](#-可調整規則)
- [技術說明](#-技術說明)

## 這是什麼?
一款完全在瀏覽器中執行的 **飛行棋(Ludo)** 棋盤遊戲。免伺服器、免建置、免網路 — 開檔即可與 1～3 個 AI 對戰。

## 🚀 快速開始
1. 下載 / clone 專案。
2. **雙擊 `index.html`**(或拖入任一現代瀏覽器)。
3. 點任意處一次以解鎖音效 →「**開始遊戲**」→ 選擇對手數量、難度與你的顏色 →「**開始!**」

> 不需安裝、不需 `npm install`、不需本機伺服器。以 `file://` 協定直接執行。

## 🎯 遊戲介紹
每位玩家擁有 **4 顆棋子**,起初鎖在四角的 **基地**。輪到你時 **擲一顆骰子**,讓棋子沿 **52 格外圈** 順時針前進,再轉入自家專屬的 **終點通道**,最終抵達 **中央**。停在對手單一棋子上可將其 **送回基地**;最先讓 **4 顆全部抵達中央** 者獲勝。

| 元素 | 說明 |
|---|---|
| 🟥🟩🟨🟦 棋子 | 4 色 × 4 顆 = 共 16 顆 |
| 🏠 基地 | 棋子起點(需擲 **6** 才能出來) |
| ➿ 主走道 | 共用 52 格,順時針繞行 |
| 🛣️ 終點通道 | 通往中央的專屬 5 格 |
| ⭐ 安全格 | 起始格 + 星號格 — 棋子不會被吃 |
| 🏆 中央終點 | 最終目標,4 顆到齊即獲勝 |

## 🎮 遊戲玩法 (TW)
1. 主選單選擇「**開始遊戲**」。
2. 選擇 **對手(1～3 個 AI)**、**難度**、**你的顏色**。
3. **點擊骰子**(或按 **空白鍵**)擲骰。
4. **發光的棋子** 即可移動 — 點一下移動它。(若只有一步合法,會自動執行)
5. 擲到 **6** 可從基地放出棋子,並獲得 **額外回合**。
6. 趕在 AI 之前讓 4 顆棋子全部回家!

## 📜 遊戲規則
| # | 規則 | 細節 |
|---|---|---|
| 1 | 🎲 **擲 6 出棋** | 基地的棋子只有擲到 6 才能出來。 |
| 2 | 🔁 **額外回合** | 擲到 6 可再擲一次,但 **連續三次 6 作廢** 本回合。 |
| 3 | 🎯 **精確進終點** | 必須剛好抵達中央;點數超過則該棋不可走。 |
| 4 | ⚔️ **吃子** | 停在對手單一棋子上,將其送回基地。 |
| 5 | ⭐ **安全格** | 起始格與星號格的棋子不會被吃。 |
| 6 | 🧱 **堡壘** | 同色兩顆以上同格形成堡壘,他棋無法停留或穿越。 |
| 7 | 🏆 **勝利** | 最先讓 4 顆棋子全部進入中央者獲勝。 |

## 🕹️ 操作方式
| 操作 | 桌面 | 行動裝置 |
|---|---|---|
| 擲骰子 | 點擊骰子 / **空白鍵** | 點擊骰子 |
| 移動棋子 | 點擊發光棋子 | 點擊發光棋子 |
| 靜音 / 選單 | 底部控制列按鈕 | 底部控制列按鈕 |

> 📱 行動裝置上骰子與按鈕位於 **底部固定控制列**(Grid 第三段),棋盤 **永不被遮擋**,並避開瀏海/手勢條的安全區。

## 🤖 AI 難度
| 難度 | 行為 |
|---|---|
| 😊 **簡單** | 從合法步中隨機挑選。適合新手。 |
| 🙂 **普通** | 啟發式評分:優先吃子、擲 6 放棋、推進、走安全格、規避危險。 |
| 😈 **困難** | 普通 + **威脅分析與吃子機率**、終局優先、風險權衡撤離。 |

## 🎨 主題與語言
**6 套主題**(即時切換、自動記住):🎨 經典 · 🌊 海洋 · 🌅 夕陽 · 🌲 森林 · 🌙 夜間 · ♿ 高對比。
**3 種語言**(即時切換、自動記住):繁體中文 · English · 日本語。

## 🧩 程式概覽
- **單頁應用(SPA):** 每個畫面是一個 `<section>`,以顯示/隱藏切換 — 頁面 **永不重載**,因此 **背景音樂跨畫面持續不斷**。
- **不使用 ES Module:** 所有 JS 以傳統 `<script src>` 載入,共用單一全域命名空間 **`window.Ludo`** — 這是 `file://` 雙擊可運作的關鍵(模組會被 `file://` 的 CORS 擋下)。
- **音訊即時合成:** 以 **Web Audio API** 產生 17 種音效 + 2 首 BGM,無需任何音檔。
- **資料持久化:** `localStorage` 每回合自動存檔(繼續遊戲),設定獨立儲存。

```
載入順序(於 index.html 定義):
命名空間 → 設定 → 狀態 → 引擎 → AI → 音訊 → UI → 輸入 → 啟動
```

## 📁 資料夾結構
```
Ludo/
├── index.html              ← 唯一入口,引入所有 CSS/JS
├── css/
│   ├── base/        reset · variables · typography
│   ├── themes/      classic · ocean · sunset · forest · night · high-contrast
│   ├── layout/      app-shell · menu · board · hud · modal
│   ├── components/  buttons · dice · tokens · controls
│   └── responsive/  desktop · tablet · mobile
├── js/
│   ├── core/        namespace · config · state · storage · i18n
│   ├── engine/      board · rules · dice · token · turn
│   ├── ai/          ai-easy · ai-normal · ai-hard · ai-manager
│   ├── audio/       sound-list · audio-manager
│   ├── ui/          screen-manager · menu · settings · render-board · render-tokens · hud · animations
│   ├── input/       pointer · mobile-controls
│   └── main.js      ← 啟動 / 串接(最後載入)
├── assets/          (音訊為合成,見 assets/README.txt)
└── README.md
```

### 模組職責
| 分層 | 檔案 | 職責 |
|---|---|---|
| **核心** | `namespace.js` | 建立 `window.Ludo` 與各子命名空間(最先載入) |
| | `config.js` | 常數:棋盤幾何、起始偏移、安全格、規則、預設值 |
| | `state.js` | 遊戲狀態物件 + 新對局初始化 + 工具函式 |
| | `storage.js` | `localStorage` 存讀檔(對局 + 設定) |
| | `i18n.js` | 三語字典 + DOM 翻譯套用 |
| **引擎** | `board.js` | 棋盤幾何:外圈/通道/基地座標、位置運算 |
| | `rules.js` | 合法步、吃子、安全格、堡壘、進終點判定 |
| | `dice.js` | 擲骰 |
| | `token.js` | 棋子資料操作:套用移動、送回基地 |
| | `turn.js` | **回合/階段狀態機** — 整體流程的指揮中心 |
| **AI** | `ai-easy/normal/hard.js` | 各難度的選步策略 |
| | `ai-manager.js` | 依難度分派到對應 AI |
| **音訊** | `sound-list.js` | 每個音效/BGM 鍵的合成配方 |
| | `audio-manager.js` | 單例 Web Audio 管理器(BGM、SFX、音量、靜音) |
| **UI** | `screen-manager.js` | 畫面切換、轉場音效、切 BGM、結算彈窗 |
| | `menu.js` / `settings.js` | 主選單&模式選擇 / 主題·音量·語言 |
| | `render-board.js` / `render-tokens.js` | 繪製棋盤 / 繪製棋子與疊放處理 |
| | `hud.js` / `animations.js` | 玩家資訊&骰面 / 移動&擲骰動畫 |
| **輸入** | `pointer.js` | 統一 click/touch:導覽、擲骰、選棋、滑桿、鍵盤 |
| | `mobile-controls.js` | resize 時動態計算正方棋盤尺寸 |

## ⚙️ 可調整規則
編輯 `js/core/config.js` 的 `rules`:

| 鍵 | 預設 | 意義 |
|---|---|---|
| `exactFinish` | `true` | 進終點需精確點數 |
| `threeSixForfeit` | `true` | 連續三次 6 作廢回合 |
| `captureBonusRoll` | `false` | 吃子後給予額外擲骰 |
| `blockFortress` | `true` | 同色堡壘可阻擋停留與穿越 |

## 🔧 技術說明
原生 **HTML / CSS / JavaScript**(ES5/ES6)、**CSS Grid + CSS 變數**、**Web Audio API**、`localStorage`。**無任何框架、CDN 或建置工具。** 棋盤、棋子、骰子皆以 **純 CSS** 繪製。

> ⚠️ `file://` 注意:`localStorage` 以「檔案來源」為範圍,搬移檔案路徑後可能讀不到舊存檔,屬正常現象。

<div align="right"><a href="#-languages--言語--語言">⬆ 回到頂端</a></div>

---

<div align="center">

**🎲 Enjoy the game! · 楽しんでね! · 祝你遊戲愉快!**

Made with vanilla HTML · CSS · JavaScript — no dependencies, no build.

</div>
