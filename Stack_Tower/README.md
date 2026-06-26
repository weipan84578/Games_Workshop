<div align="center">

# 🏗️ Stack Tower · 堆疊高塔 · スタックタワー

**A pure front-end, zero-dependency block-stacking arcade game.**
**純前端、零依賴的堆疊積木街機遊戲。**
**純フロントエンド・依存ゼロの積み上げアーケードゲーム。**

![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas%202D-E34F26?logo=html5&logoColor=white)
![Web Audio](https://img.shields.io/badge/Web%20Audio-API-563D7C)
![No Build](https://img.shields.io/badge/Build-None-43D9AD)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20JA%20%7C%20ZH--TW-6C63FF)

🌐 **Language / 語言 / 言語** &nbsp;·&nbsp; [English](#-english) &nbsp;|&nbsp; [日本語](#-日本語) &nbsp;|&nbsp; [繁體中文](#-繁體中文)

</div>

---

> 🎮 **Play it now / 立即遊玩 / 今すぐプレイ** — Double-click `index.html`. No server, no build, no install.
> 雙擊 `index.html` 即可開始，無需伺服器、無需編譯、無需安裝。

---

<br />

# 🇬🇧 English

## 📑 Table of Contents

| Section | Jump |
|---|---|
| 🎯 Game Overview | [Go →](#-game-overview) |
| 🕹️ How to Play | [Go →](#️-how-to-play) |
| ⭐ Scoring & Combos | [Go →](#-scoring--combos) |
| 🚀 Getting Started | [Go →](#-getting-started) |
| 🧱 Tech Stack | [Go →](#-tech-stack) |
| 🗂️ Project Structure | [Go →](#️-project-structure) |
| 🧠 Code Walkthrough | [Go →](#-code-walkthrough) |
| ⚙️ Game Mechanics | [Go →](#️-game-mechanics-internals) |
| 🌍 Internationalization | [Go →](#-internationalization-i18n) |
| 💾 Data & Storage | [Go →](#-data--storage) |
| 🔌 Browser Support | [Go →](#-browser-support) |

### 🎯 Game Overview

**Stack Tower** is a classic block-stacking game. A block slides back and forth above the tower — tap, click, or press **Space** to drop it. Any part that overhangs the block below is **sliced off and falls away**, so the tower gets narrower with every imperfect drop. Land a block **perfectly** and you keep your full width (and earn bonus points). Miss the stack entirely and it's **Game Over**.

| | |
|---|---|
| 🎲 **Genre** | Endless-mode casual / arcade |
| 🧩 **Goal** | Stack the tallest tower possible |
| ⏱️ **Session** | No time limit — play until you misalign |
| 📈 **Difficulty** | Block speed ramps up the higher you climb |
| 🏆 **Persistence** | Local Top-10 leaderboard + best score |

### 🕹️ How to Play

| Platform | Action | Input |
|---|---|---|
| 💻 **Desktop** | Drop block | `Space` · `Enter` · or **click** the canvas |
| 📱 **Mobile** | Drop block | **Tap** the screen or the **Place** button |
| 🔇 **Any** | Mute | `M` key or the mute icon |
| ⏸️ **Any** | Pause / back | `Escape` or the back button |

**The loop in 4 steps:**

```
1. ◀──🟦──▶   A block slides left↔right above the tower
2.    👆       You drop it (tap / click / Space)
3.  ✂️🟦       Overhang is sliced off and falls away
4.  🧱🧱       The remainder locks in → next block, a little faster
```

### ⭐ Scoring & Combos

| Result | Condition | Points |
|---|---|---|
| 🥈 Normal placement | Overlaps the base | **+10** |
| 🥇 Precise placement | Overlap ratio **> 90%** | **+15** |
| ✨ Perfect placement | Misalignment **< 2px** | **+25** + combo |
| 🔥 Combo (3+ perfects) | Multiplier `1 + (combo − 2) × 0.5` | Score ×N |

> 💡 **Pro tips:** Watch the block's rhythm before dropping · A run of perfects keeps the tower wide *and* multiplies your score · A wide base is forgiving early, but speed is the real enemy up high. The first few floors are *tutorial floors* with a generous perfect window to help you warm up.

### 🚀 Getting Started

This is a **100% static** site — no Node, no bundler, no dependencies.

```bash
# Option 1 — just open it
Double-click index.html

# Option 2 — serve locally (recommended for consistent audio autoplay)
python -m http.server 8000        # then visit http://localhost:8000
# or
npx serve .
```

> ⚠️ Audio (Web Audio API) initializes on the **first user interaction** — this is a browser policy, not a bug.

### 🧱 Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| 🎨 Rendering | **HTML5 Canvas 2D** | Native, framework-free |
| 📜 Language | **Vanilla JavaScript (ES6+)** | Zero JS framework dependencies |
| 💅 Styling | **CSS3 Custom Properties** | Modular, variable-driven theming |
| 🔊 Audio | **Web Audio API** | BGM & SFX synthesized at runtime |
| 💾 Storage | **LocalStorage** | Scores, settings, save state |
| 🔤 Fonts | **Google Fonts (CDN)** | Noto Sans TC / JP, with system fallback |

**Design principles:** static front-end · zero npm dependencies · zero build step · modular CSS + JS organized by folder · everything loaded via `<link>` / `<script defer>` in `index.html`.

### 🗂️ Project Structure

```
Stack_Tower/
├── index.html                 # 🚪 Entry point — loads all CSS & JS
├── stack-tower-spec.md        # 📋 Full design specification
│
├── css/
│   ├── base/                  # 🎨 Foundations
│   │   ├── reset.css          #    CSS reset / normalize
│   │   ├── variables.css      #    Color, font & spacing tokens
│   │   └── typography.css     #    Global font setup (per-language)
│   ├── layout/
│   │   ├── app.css            #    App container layout
│   │   └── responsive.css     #    Media queries / RWD rules
│   ├── components/            # 🧩 Reusable UI pieces
│   │   ├── button.css  modal.css  slider.css
│   │   ├── toggle.css  scoreboard.css  toast.css
│   └── screens/              # 🖼️ Per-screen styling
│       ├── main-menu.css  game.css  instructions.css
│       ├── settings.css   leaderboard.css
│
└── js/
    ├── core/                 # 🎮 Game engine
    │   ├── game.js           #    Main loop & state machine
    │   ├── block.js          #    Block object (move, slice, draw)
    │   ├── tower.js          #    Tower stack + camera control
    │   ├── physics.js        #    Collision, slicing & scoring math
    │   └── renderer.js       #    Canvas renderer (scene, parallax, FX)
    ├── audio/
    │   ├── bgm.js            #    Background music synthesis
    │   └── sfx.js            #    Sound-effect synthesis
    ├── ui/                   # 🖥️ Screen controllers
    │   ├── screens.js        #    Screen-switching manager
    │   ├── main-menu.js  hud.js  instructions.js
    │   ├── settings.js   leaderboard.js
    ├── i18n/                 # 🌍 Localization
    │   ├── i18n.js           #    Language-switch core
    │   ├── zh-TW.js  ja.js  en.js
    └── utils/               # 🔧 Helpers
        ├── storage.js        #    LocalStorage wrapper
        ├── color.js          #    Dynamic gradient/color tools
        └── helpers.js        #    Generic utilities
```

### 🧠 Code Walkthrough

The codebase is split into four responsibility zones. Scripts load in dependency order (utils → i18n → audio → core → ui).

| Category | File | Responsibility |
|---|---|---|
| **🎮 Core** | `core/game.js` | Orchestrates the `requestAnimationFrame` loop, holds the state machine (`idle → playing → game over`), tracks score/floors/combo, persists & restores saves. |
| | `core/block.js` | A single block: position, width, speed, direction, color, and its 3D draw routine. |
| | `core/tower.js` | The stack of placed blocks + smooth camera that pans up as you climb. |
| | `core/physics.js` | Pure math: overlap/slice calculation (`calculateCut`) and scoring (`calculateScore`). No side effects. |
| | `core/renderer.js` | Draws the night-city background, parallax, blocks, fragments and on-screen FX. |
| **🔊 Audio** | `audio/bgm.js` / `audio/sfx.js` | Synthesize music & effects via Web Audio API — no audio files shipped. |
| **🖥️ UI** | `ui/screens.js` | Mounts/swaps screens into `#app`. |
| | `ui/main-menu.js`, `hud.js`, `instructions.js`, `settings.js`, `leaderboard.js` | One controller per screen, rendering markup and wiring events. |
| **🌍 i18n** | `i18n/i18n.js` + `en/ja/zh-TW.js` | Key→string lookup with live DOM re-translation on language change. |
| **🔧 Utils** | `utils/storage.js`, `color.js`, `helpers.js` | LocalStorage wrapper, color math, and shared helpers (`clamp`, etc.). |

**Data flow at a glance:**

```
 index.html ──loads──▶ utils ▶ i18n ▶ audio ▶ core ▶ ui
                                                  │
   user input ──▶ game.js (state machine) ──▶ physics.js (slice + score)
                       │                              │
                       ├──▶ tower.js (stack + camera) │
                       ├──▶ renderer.js (draw frame) ◀┘
                       ├──▶ sfx.js / bgm.js (sound)
                       └──▶ storage.js (save + leaderboard)
```

### ⚙️ Game Mechanics (internals)

**Slice logic** (`physics.calculateCut`) — keeps only the overlap, slices the rest:

```
current block:  [========]
base below:           [=========]
overlap (kept):       [===]
sliced (falls):  [====]    [==]
```

**Tunable parameters (actual values in code):**

| Parameter | Value | Where |
|---|---|---|
| Foundation width | `max(132px, canvas × 0.62)` | `game.js` |
| Block speed | `clamp(4 + floors × 0.35, 4, 14)` px/frame | `game.js` |
| Perfect threshold | `< 2px` (`12px` on tutorial floors) | `game.js` / `physics.js` |
| Precise threshold | overlap ratio `> 0.9` | `physics.js` |
| Combo multiplier | `1 + (combo − 2) × 0.5` for combo ≥ 3 | `physics.js` |
| Camera follow | smooth `lerp` as tower grows | `tower.js` |

**State machine:**

```
IDLE → MENU ──Start──▶ PLAYING ──misalign──▶ GAME OVER
              └Continue─▶ (restore save)        ├─▶ Play again
PLAYING ──Esc──▶ PAUSED ──▶ Resume / Quit       └─▶ Menu / Leaderboard
```

### 🌍 Internationalization (i18n)

| Code | Language | Font |
|---|---|---|
| `zh-TW` | 繁體中文 (default) | Noto Sans TC |
| `ja` | 日本語 | Noto Sans JP |
| `en` | English | Noto Sans |

Switching language updates every `[data-i18n]` element live, sets `document.documentElement.lang`, and persists the choice to LocalStorage.

### 💾 Data & Storage

All keys are namespaced with the `stack_` prefix.

| Key | Type | Purpose |
|---|---|---|
| `stack_leaderboard` | JSON Array | Top-10 records `{ score, floors, date }` |
| `stack_settings` | JSON Object | `{ bgmVolume, sfxVolume, lang }` |
| `stack_save` | JSON Object | In-progress game (enables **Continue**) |
| `stack_best` | Number | Personal best score |

> Writes fail **silently** if storage is full — gameplay never breaks.

### 🔌 Browser Support

| Browser | Min Version | Canvas | Web Audio | LocalStorage |
|---|---|:---:|:---:|:---:|
| Chrome / Edge | 90+ | ✅ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ✅ | ✅ |
| Safari (incl. iOS) | 14+ | ✅ | ✅¹ | ✅ |
| Android Chrome | 90+ | ✅ | ✅ | ✅ |

¹ Audio requires a first user interaction (browser autoplay policy).

<div align="right"><a href="#️-stack-tower--堆疊高塔--スタックタワー">⬆ Back to top</a></div>

<br />

# 🇯🇵 日本語

## 📑 目次

| セクション | 移動 |
|---|---|
| 🎯 ゲーム概要 | [移動 →](#-ゲーム概要) |
| 🕹️ 遊び方 | [移動 →](#️-遊び方) |
| ⭐ スコアとコンボ | [移動 →](#-スコアとコンボ) |
| 🚀 はじめに | [移動 →](#-はじめに) |
| 🧱 技術スタック | [移動 →](#-技術スタック) |
| 🗂️ ディレクトリ構成 | [移動 →](#️-ディレクトリ構成) |
| 🧠 コード解説 | [移動 →](#-コード解説) |
| ⚙️ ゲーム内部仕様 | [移動 →](#️-ゲーム内部仕様) |
| 🌍 多言語対応 | [移動 →](#-多言語対応-i18n) |
| 💾 データ保存 | [移動 →](#-データ保存) |

### 🎯 ゲーム概要

**Stack Tower**（スタックタワー）は王道の積み上げゲームです。タワーの上を左右に動くブロックを、**タップ／クリック／スペースキー**で落とします。下のブロックからはみ出した部分は**切り落とされて落下**するため、ズレるほどタワーは細くなります。**パーフェクト**に置けば横幅を保ったまま、ボーナス点も獲得。完全に外すと**ゲームオーバー**です。

| | |
|---|---|
| 🎲 **ジャンル** | エンドレス・カジュアル／アーケード |
| 🧩 **目的** | できるだけ高くタワーを積む |
| ⏱️ **時間制限** | なし — ズレるまで続行 |
| 📈 **難易度** | 高く積むほどブロックが加速 |
| 🏆 **記録** | ローカルのトップ10ランキング＋ベストスコア |

### 🕹️ 遊び方

| 環境 | 操作 | 入力 |
|---|---|---|
| 💻 **PC** | ブロックを落とす | `Space`・`Enter`・キャンバスを**クリック** |
| 📱 **モバイル** | ブロックを落とす | 画面か**配置**ボタンを**タップ** |
| 🔇 **共通** | ミュート | `M` キー／ミュートアイコン |
| ⏸️ **共通** | 一時停止／戻る | `Escape`／戻るボタン |

**4ステップの流れ：**

```
1. ◀──🟦──▶   ブロックがタワー上を左右に移動
2.    👆       落とす（タップ／クリック／スペース）
3.  ✂️🟦       はみ出しを切り落として落下
4.  🧱🧱       残りが確定 → 次のブロックは少し速く
```

### ⭐ スコアとコンボ

| 結果 | 条件 | 得点 |
|---|---|---|
| 🥈 通常配置 | 土台に重なる | **+10** |
| 🥇 高精度配置 | 重なり率 **90%超** | **+15** |
| ✨ パーフェクト | ズレ **2px未満** | **+25** + コンボ |
| 🔥 コンボ（3回以上） | 倍率 `1 + (combo − 2) × 0.5` | スコア ×N |

> 💡 **コツ：** ブロックのリズムを見極めてから落とす · パーフェクトを連続させると幅を保ちつつスコアが倍増 · 序盤の数フロアは判定が甘い「チュートリアルフロア」なので慣らしに最適。

### 🚀 はじめに

**完全な静的サイト**です。Node もバンドラーも依存パッケージも不要。

```bash
# 方法1 — そのまま開く
index.html をダブルクリック

# 方法2 — ローカルサーバー（音声の自動再生が安定）
python -m http.server 8000        # http://localhost:8000 を開く
# または
npx serve .
```

> ⚠️ 音声（Web Audio API）は**最初の操作時**に初期化されます。これはブラウザの仕様です。

### 🧱 技術スタック

| レイヤー | 技術 | 備考 |
|---|---|---|
| 🎨 描画 | **HTML5 Canvas 2D** | フレームワーク不要 |
| 📜 言語 | **Vanilla JavaScript (ES6+)** | JSフレームワーク依存ゼロ |
| 💅 スタイル | **CSS3 カスタムプロパティ** | 変数ベースのモジュール設計 |
| 🔊 音声 | **Web Audio API** | BGM・効果音を実行時に合成 |
| 💾 保存 | **LocalStorage** | スコア・設定・セーブ |
| 🔤 フォント | **Google Fonts (CDN)** | Noto Sans TC / JP（システムフォールバックあり） |

### 🗂️ ディレクトリ構成

> 構成は英語版の [Project Structure](#️-project-structure) と共通です。要点：

| フォルダ | 役割 |
|---|---|
| `css/base` | リセット・変数・タイポグラフィの基盤 |
| `css/layout` | 全体レイアウトとレスポンシブ |
| `css/components` | ボタン・モーダル・スライダー等の部品 |
| `css/screens` | 各画面専用スタイル |
| `js/core` | ゲームエンジン（ループ・物理・描画） |
| `js/audio` | BGM・効果音の合成 |
| `js/ui` | 画面ごとのコントローラー |
| `js/i18n` | 多言語対応 |
| `js/utils` | 保存・色・汎用ヘルパー |

### 🧠 コード解説

| 区分 | ファイル | 責務 |
|---|---|---|
| **🎮 コア** | `core/game.js` | `requestAnimationFrame` ループ、状態機械、スコア／フロア／コンボ管理、セーブ復元 |
| | `core/block.js` | 1ブロックの位置・幅・速度・色と立体描画 |
| | `core/tower.js` | 配置済みブロックの積み重ねと追従カメラ |
| | `core/physics.js` | 重なり計算と得点計算（副作用なしの純粋関数） |
| | `core/renderer.js` | 夜景背景・視差・ブロック・破片・演出の描画 |
| **🔊 音声** | `audio/bgm.js` / `sfx.js` | Web Audio API による合成（音声ファイル不要） |
| **🖥️ UI** | `ui/screens.js` ほか | 画面の切替と各画面の制御 |
| **🌍 i18n** | `i18n/*.js` | キー→文字列変換と言語切替時の即時再翻訳 |
| **🔧 ユーティリティ** | `utils/*.js` | LocalStorage ラッパー・色計算・共通関数 |

### ⚙️ ゲーム内部仕様

**切り落としロジック**（`physics.calculateCut`）— 重なった部分だけを残します：

```
現在のブロック:  [========]
下の土台:             [=========]
重なり（保持）:       [===]
切断（落下）:    [====]    [==]
```

**主なパラメータ（コード実値）：**

| パラメータ | 値 |
|---|---|
| 土台の幅 | `max(132px, canvas × 0.62)` |
| ブロック速度 | `clamp(4 + floors × 0.35, 4, 14)` px/frame |
| パーフェクト判定 | `2px未満`（チュートリアルは `12px`） |
| 高精度判定 | 重なり率 `0.9超` |
| コンボ倍率 | コンボ3以上で `1 + (combo − 2) × 0.5` |

### 🌍 多言語対応 (i18n)

| コード | 言語 | フォント |
|---|---|---|
| `zh-TW` | 繁体字中国語（既定） | Noto Sans TC |
| `ja` | 日本語 | Noto Sans JP |
| `en` | 英語 | Noto Sans |

言語切替は全ての `[data-i18n]` 要素を即時更新し、設定を LocalStorage に保存します。

### 💾 データ保存

全キーは `stack_` 接頭辞付きです。

| キー | 型 | 用途 |
|---|---|---|
| `stack_leaderboard` | JSON配列 | トップ10記録 `{ score, floors, date }` |
| `stack_settings` | JSONオブジェクト | `{ bgmVolume, sfxVolume, lang }` |
| `stack_save` | JSONオブジェクト | 進行中のゲーム（**続ける**用） |
| `stack_best` | 数値 | 自己ベスト |

<div align="right"><a href="#️-stack-tower--堆疊高塔--スタックタワー">⬆ トップへ戻る</a></div>

<br />

# 🇹🇼 繁體中文

## 📑 目錄

| 章節 | 前往 |
|---|---|
| 🎯 遊戲介紹 | [前往 →](#-遊戲介紹) |
| 🕹️ 遊戲玩法 | [前往 →](#️-遊戲玩法) |
| ⭐ 計分與連擊 | [前往 →](#-計分與連擊) |
| 🚀 快速開始 | [前往 →](#-快速開始) |
| 🧱 技術架構 | [前往 →](#-技術架構) |
| 🗂️ 專案結構 | [前往 →](#️-專案結構) |
| 🧠 程式介紹與分類 | [前往 →](#-程式介紹與分類) |
| ⚙️ 遊戲核心機制 | [前往 →](#️-遊戲核心機制) |
| 🌍 多國語系 | [前往 →](#-多國語系-i18n) |
| 💾 資料儲存 | [前往 →](#-資料儲存) |
| 🔌 瀏覽器支援 | [前往 →](#-瀏覽器支援) |

### 🎯 遊戲介紹

**Stack Tower（堆疊高塔）** 是一款經典堆疊積木遊戲。一塊方塊會在塔頂左右移動，玩家透過 **點擊、滑鼠或按空白鍵** 將它放下。任何超出下方方塊的部分都會被 **切除並掉落**，所以每次沒對準，塔就會越來越窄。若 **完美對齊**，方塊保留完整寬度並獲得額外分數；若完全錯位則 **遊戲結束**。

| | |
|---|---|
| 🎲 **類型** | 無盡模式休閒／街機 |
| 🧩 **目標** | 盡可能堆出最高的塔 |
| ⏱️ **時間** | 無時間限制 — 直到方塊錯位 |
| 📈 **難度** | 越高越快，速度逐層遞增 |
| 🏆 **紀錄** | 本機前 10 名排行榜＋最高分 |

### 🕹️ 遊戲玩法

| 平台 | 動作 | 操作方式 |
|---|---|---|
| 💻 **電腦** | 放下方塊 | `空白鍵`、`Enter`、或 **點擊畫面** |
| 📱 **手機** | 放下方塊 | **點擊螢幕** 或 **放置** 按鈕 |
| 🔇 **通用** | 靜音 | `M` 鍵／靜音圖示 |
| ⏸️ **通用** | 暫停／返回 | `Escape`／返回按鈕 |

**四步驟流程：**

```
1. ◀──🟦──▶   方塊在塔頂左右移動
2.    👆       放下方塊（點擊／滑鼠／空白鍵）
3.  ✂️🟦       超出部分被切除並掉落
4.  🧱🧱       剩餘部分鎖定 → 下一塊速度更快
```

### ⭐ 計分與連擊

| 結果 | 條件 | 分數 |
|---|---|---|
| 🥈 一般放置 | 與下方重疊 | **+10** |
| 🥇 精準放置 | 重疊比例 **大於 90%** | **+15** |
| ✨ 完美放置 | 誤差 **小於 2px** | **+25** + 連擊 |
| 🔥 連擊（連續 3 次以上完美） | 倍率 `1 + (連擊數 − 2) × 0.5` | 分數 ×N |

> 💡 **技巧：** 先抓準方塊移動的節奏再放下 · 連續完美能同時維持寬度與倍增分數 · 開頭幾層是「教學層」，完美判定較寬鬆，適合暖身。

### 🚀 快速開始

本專案為 **100% 靜態網站**，不需要 Node、打包工具或任何依賴。

```bash
# 方法一 — 直接開啟
雙擊 index.html

# 方法二 — 本機伺服器（音效自動播放較穩定）
python -m http.server 8000        # 開啟 http://localhost:8000
# 或
npx serve .
```

> ⚠️ 音效（Web Audio API）會在 **第一次互動** 後才初始化，這是瀏覽器政策而非錯誤。

### 🧱 技術架構

| 層級 | 技術 | 說明 |
|---|---|---|
| 🎨 渲染 | **HTML5 Canvas 2D** | 原生、免框架 |
| 📜 語言 | **Vanilla JavaScript（ES6+）** | 零 JS 框架依賴 |
| 💅 樣式 | **CSS3 自訂屬性** | 變數驅動的模組化設計 |
| 🔊 音效 | **Web Audio API** | BGM 與音效即時合成 |
| 💾 儲存 | **LocalStorage** | 分數、設定、存檔 |
| 🔤 字體 | **Google Fonts（CDN）** | Noto Sans TC / JP，含系統備援 |

**設計原則：** 純靜態前端 · 零 npm 依賴 · 零 build 流程 · 依資料夾分類的模組化 CSS + JS · 全部資源由 `index.html` 以 `<link>` / `<script defer>` 引入。

### 🗂️ 專案結構

```
Stack_Tower/
├── index.html                 # 🚪 入口 — 載入所有 CSS 與 JS
├── stack-tower-spec.md        # 📋 完整設計規格書
│
├── css/
│   ├── base/                  # 🎨 基礎
│   │   ├── reset.css          #    CSS 重置／正規化
│   │   ├── variables.css      #    色彩、字體、間距變數
│   │   └── typography.css     #    全域字體（依語言）
│   ├── layout/
│   │   ├── app.css            #    App 容器佈局
│   │   └── responsive.css     #    媒體查詢／RWD
│   ├── components/            # 🧩 可重用 UI 元件
│   │   ├── button.css  modal.css  slider.css
│   │   ├── toggle.css  scoreboard.css  toast.css
│   └── screens/              # 🖼️ 各畫面樣式
│       ├── main-menu.css  game.css  instructions.css
│       ├── settings.css   leaderboard.css
│
└── js/
    ├── core/                 # 🎮 遊戲引擎
    │   ├── game.js           #    主迴圈與狀態機
    │   ├── block.js          #    方塊物件（移動、切割、繪製）
    │   ├── tower.js          #    高塔堆疊＋相機控制
    │   ├── physics.js        #    碰撞、切割與計分運算
    │   └── renderer.js       #    Canvas 渲染（場景、視差、特效）
    ├── audio/
    │   ├── bgm.js            #    背景音樂合成
    │   └── sfx.js            #    音效合成
    ├── ui/                   # 🖥️ 各畫面控制器
    │   ├── screens.js        #    畫面切換管理
    │   ├── main-menu.js  hud.js  instructions.js
    │   ├── settings.js   leaderboard.js
    ├── i18n/                 # 🌍 多國語系
    │   ├── i18n.js           #    語系切換核心
    │   ├── zh-TW.js  ja.js  en.js
    └── utils/               # 🔧 工具
        ├── storage.js        #    LocalStorage 封裝
        ├── color.js          #    動態漸層／色彩工具
        └── helpers.js        #    通用工具函式
```

### 🧠 程式介紹與分類

程式碼依四大職責區塊分類，並依相依順序載入（utils → i18n → audio → core → ui）。

| 分類 | 檔案 | 職責 |
|---|---|---|
| **🎮 核心 Core** | `core/game.js` | 主導 `requestAnimationFrame` 迴圈、狀態機（`idle → playing → game over`）、管理分數／層數／連擊、存檔與還原。 |
| | `core/block.js` | 單一方塊：位置、寬度、速度、方向、顏色及立體繪製。 |
| | `core/tower.js` | 已放置方塊的堆疊，以及隨高度平滑上移的相機。 |
| | `core/physics.js` | 純運算：重疊／切割（`calculateCut`）與計分（`calculateScore`），無副作用。 |
| | `core/renderer.js` | 繪製夜景背景、視差、方塊、碎片與畫面特效。 |
| **🔊 音效 Audio** | `audio/bgm.js`／`sfx.js` | 以 Web Audio API 即時合成音樂與音效，不附帶音檔。 |
| **🖥️ 介面 UI** | `ui/screens.js` | 將各畫面掛載／切換進 `#app`。 |
| | `ui/main-menu.js`、`hud.js`、`instructions.js`、`settings.js`、`leaderboard.js` | 每個畫面一個控制器，負責渲染與事件綁定。 |
| **🌍 語系 i18n** | `i18n/i18n.js` + `en/ja/zh-TW.js` | 鍵值查表，切換語言時即時重新翻譯 DOM。 |
| **🔧 工具 Utils** | `utils/storage.js`、`color.js`、`helpers.js` | LocalStorage 封裝、色彩運算、共用函式（如 `clamp`）。 |

**資料流概覽：**

```
 index.html ──載入──▶ utils ▶ i18n ▶ audio ▶ core ▶ ui
                                                  │
   玩家輸入 ──▶ game.js（狀態機）──▶ physics.js（切割＋計分）
                    │                          │
                    ├──▶ tower.js（堆疊＋相機） │
                    ├──▶ renderer.js（繪製畫面）◀┘
                    ├──▶ sfx.js / bgm.js（聲音）
                    └──▶ storage.js（存檔＋排行榜）
```

### ⚙️ 遊戲核心機制

**切割邏輯**（`physics.calculateCut`）— 只保留重疊部分，其餘切除：

```
當前方塊：  [========]
下方基座：        [=========]
重疊（保留）：    [===]
切除（掉落）： [====]    [==]
```

**可調參數（程式實際值）：**

| 參數 | 值 | 位置 |
|---|---|---|
| 基座寬度 | `max(132px, canvas × 0.62)` | `game.js` |
| 方塊速度 | `clamp(4 + 層數 × 0.35, 4, 14)` px/frame | `game.js` |
| 完美判定 | `小於 2px`（教學層為 `12px`） | `game.js`／`physics.js` |
| 精準判定 | 重疊比例 `大於 0.9` | `physics.js` |
| 連擊倍率 | 連擊 ≥ 3 時 `1 + (連擊 − 2) × 0.5` | `physics.js` |
| 相機跟隨 | 隨塔成長平滑 `lerp` | `tower.js` |

**狀態機：**

```
IDLE → 主選單 ──開始──▶ 遊戲中 ──錯位──▶ 遊戲結束
              └繼續──▶（還原存檔）        ├─▶ 再玩一次
遊戲中 ──Esc──▶ 暫停 ──▶ 繼續／放棄        └─▶ 主選單／排行榜
```

### 🌍 多國語系 (i18n)

| 代碼 | 語言 | 字體 |
|---|---|---|
| `zh-TW` | 繁體中文（預設） | Noto Sans TC |
| `ja` | 日本語 | Noto Sans JP |
| `en` | English | Noto Sans |

切換語言會即時更新所有 `[data-i18n]` 元素、設定 `document.documentElement.lang`，並把選擇存入 LocalStorage。

### 💾 資料儲存

所有鍵值皆以 `stack_` 前綴命名。

| 鍵值 | 類型 | 用途 |
|---|---|---|
| `stack_leaderboard` | JSON 陣列 | 前 10 名紀錄 `{ score, floors, date }` |
| `stack_settings` | JSON 物件 | `{ bgmVolume, sfxVolume, lang }` |
| `stack_save` | JSON 物件 | 進行中的遊戲（供 **繼續遊戲**） |
| `stack_best` | 數字 | 個人最高分 |

> 當儲存空間不足時，寫入會 **靜默失敗**，遊戲不會中斷。

### 🔌 瀏覽器支援

| 瀏覽器 | 最低版本 | Canvas | Web Audio | LocalStorage |
|---|---|:---:|:---:|:---:|
| Chrome / Edge | 90+ | ✅ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ✅ | ✅ |
| Safari（含 iOS） | 14+ | ✅ | ✅¹ | ✅ |
| Android Chrome | 90+ | ✅ | ✅ | ✅ |

¹ 音效需在第一次使用者互動後才能播放（瀏覽器自動播放政策）。

<div align="right"><a href="#️-stack-tower--堆疊高塔--スタックタワー">⬆ 回到頂端</a></div>

---

<div align="center">

📋 想了解完整設計細節？請參考 [`stack-tower-spec.md`](stack-tower-spec.md)
*For the full design specification, see [`stack-tower-spec.md`](stack-tower-spec.md).*

**Stack Tower** · Built with Vanilla JS + HTML5 Canvas · No build, no dependencies 🏗️

</div>
