<div align="center">

# 🎲 Eels and Escalators · 鰻魚與電扶梯 · ウナギとエスカレーター

**A SpongeBob-flavored "Snakes & Ladders" board game that runs 100% in your browser.**
**一款比奇堡風格的「蛇與梯子」惡搞桌遊，純前端、零安裝。**
**ビキニボトム風「ヘビとはしご」パロディのボードゲーム。ブラウザだけで動作します。**

`HTML5` · `CSS3` · `Vanilla JS (ES6+)` · `Web Audio API` · `Zero Dependencies` · `v1.0.0`

</div>

---

## 🌐 Language / 言語 / 語言

| 🇺🇸 English | 🇯🇵 日本語 | 🇹🇼 繁體中文 |
|:---:|:---:|:---:|
| [Go to English ↓](#-english) | [日本語へ ↓](#-日本語) | [前往中文 ↓](#-繁體中文) |

> 💡 The game itself ships in all three languages — switch live in-game from **Settings → Language**, no reload needed.

---
---

<a name="-english"></a>

## 🇺🇸 English

### 📑 Table of Contents

- [1. Overview](#en-overview)
- [2. Quick Start](#en-quickstart)
- [3. How to Play](#en-howtoplay)
- [4. Game Rules](#en-rules)
- [5. AI Difficulty](#en-ai)
- [6. Tech Stack & Architecture](#en-tech)
- [7. Code Structure](#en-structure)
- [8. Feature Highlights](#en-features)
- [9. Browser Support](#en-browser)

<a name="en-overview"></a>
### 1. 📖 Overview

**Eels and Escalators** is a single-player (You vs. AI) board game set in the *SpongeBob* universe. Land on an **escalator 🔼** to ride up the board; land on an **eel 🐍** to slide back down. First piece to reach **square 100** wins!

| Item | Detail |
|------|--------|
| 🎮 Genre | Single-player board / strategy (Player vs AI) |
| 🎨 Theme | SpongeBob / Bikini Bottom undersea style |
| ⚙️ Tech | Pure front-end HTML / CSS / JS — zero dependencies, zero build |
| 🚀 Launch | Just double-click `index.html` |
| 🌍 Languages | 繁體中文 · English · 日本語 |
| 📱 Devices | Mobile (iOS/Android) · Tablet · Desktop |

<a name="en-quickstart"></a>
### 2. 🚀 Quick Start

No installation, no build step, no server required.

```bash
# Option A — simplest
Double-click index.html

# Option B — local server (recommended for full audio behavior)
python -m http.server 8000
# then open http://localhost:8000
```

> 🔊 Audio (BGM & SFX) is synthesized live by the **Web Audio API** and only unlocks after your first click/keypress (a browser policy). No audio files are downloaded.

<a name="en-howtoplay"></a>
### 3. 🕹️ How to Play

| Step | Action |
|:---:|--------|
| 1️⃣ | Click **Start Game** and pick a difficulty (😊 Easy / 😐 Normal / 😈 Hard) |
| 2️⃣ | On your turn, press the big **🎲 Roll Dice** button |
| 3️⃣ | Your piece hops forward cell-by-cell (1–6 steps) |
| 4️⃣ | Landed on an escalator? 🔼 Ride **up**. On an eel? 🐍 Slide **down** |
| 5️⃣ | The computer takes its turn automatically |
| 6️⃣ | Reach **square 100 exactly** to win 🎉 |

⌨️ **Keyboard shortcuts (Home):** `Enter` Start · `C` Continue · `H` Help · `S` Settings

<a name="en-rules"></a>
### 4. 📜 Game Rules

**Board:** 10 × 10 = **100 squares**, boustrophedon (snake) layout — start at square 1 (bottom-left), finish at square 100. One six-sided die (1–6), two pieces (You 🧽 vs Computer 🐙).

**🔄 Bounce rule:** If your roll would overshoot 100, you **don't move**. Example: on square 98, rolling a 4 needs only 2 steps → you stay on 98.

<details>
<summary>🐍 <b>Eels (6 total)</b> — land on the head, slide down to the tail</summary>

| Eel | Head (trigger) | Tail (destination) | Length |
|:---:|:---:|:---:|:---:|
| 🐍 E1 | 17 | 7 | Short |
| 🐍 E2 | 54 | 34 | Medium |
| 🐍 E3 | 62 | 19 | Long |
| 🐍 E4 | 64 | 60 | Short |
| 🐍 E5 | 87 | 24 | Extra long |
| 🐍 E6 | 95 | 75 | Medium |

</details>

<details>
<summary>🔼 <b>Escalators (6 total)</b> — land on the entrance, ride up to the exit</summary>

| Escalator | Entrance (trigger) | Exit (destination) | Rise |
|:---:|:---:|:---:|:---:|
| 🔼 L1 | 4 | 14 | Small |
| 🔼 L2 | 9 | 31 | Large |
| 🔼 L3 | 20 | 38 | Medium |
| 🔼 L4 | 28 | 84 | Huge |
| 🔼 L5 | 40 | 59 | Medium |
| 🔼 L6 | 51 | 67 | Small |

</details>

<a name="en-ai"></a>
### 5. 🤖 AI Difficulty

| Difficulty | Strategy | Behavior |
|:---:|---|---|
| 😊 **Easy** | Fully random | Just rolls — easy to beat |
| 😐 **Normal** | Random + light weighting | Sometimes avoids obvious eels |
| 😈 **Hard** | Weighted + look-ahead scoring | Favors escalators, dodges eels |

> The AI never cheats — "Hard" just evaluates each possible roll's landing score (escalator `+100`, eel `−80`, near-escalator `+10`) and picks the luckiest-looking option.

<a name="en-tech"></a>
### 6. 🏗️ Tech Stack & Architecture

| Layer | Choice |
|------|--------|
| Language | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| Audio | Web Audio API — SFX & BGM synthesized in code (no audio files) |
| Graphics | Pure CSS + inline SVG (board, pieces, 3D dice) |
| Storage | `localStorage` (save game, settings, locale, stats) |
| Fonts | Google Fonts CDN (Fredoka One / Nunito / Noto Sans JP) |
| Pattern | IIFE modules sharing a single `window.EAE` namespace |

**Module wiring:** `main.js` waits for `DOMContentLoaded`, instantiates every engine/UI class, injects dependencies, then applies saved settings. Game logic flows: `GameUI → DiceAnimator → GameEngine.applyTurn() → PieceAnimator → BoardRenderer`, with `SaveManager` persisting after each turn.

<a name="en-structure"></a>
### 7. 📂 Code Structure

```
Eels_And_Escalators/
├── index.html              # Entry point — all screens + asset includes
├── assets/
│   └── favicon.svg         # Bubble-themed site icon
│
├── css/
│   ├── base/               # reset · variables (design tokens) · typography
│   ├── components/         # button · modal · dice · board · piece · slider · toggle
│   ├── screens/            # home · game · help · settings
│   └── responsive/         # mobile (≤480) · tablet (481–1024) · desktop (≥1025)
│
└── js/
    ├── core/               # Game logic
    │   ├── game-engine.js   # Turn flow, moves, win/bounce, save hooks
    │   ├── board-data.js    # 100-cell map, eel/escalator data, coordinates
    │   ├── dice.js          # Dice roll logic
    │   └── save-manager.js  # localStorage wrapper (save/settings/stats)
    ├── ai/
    │   └── ai-engine.js     # Easy / Normal / Hard decision logic
    ├── audio/
    │   ├── bgm-engine.js     # Synthesized piano BGM sequence
    │   └── sfx-engine.js     # Dice / step / escalator / eel / win / lose SFX
    ├── i18n/
    │   ├── i18n-manager.js   # Locale switching + DOM updating (data-i18n)
    │   ├── zh-TW.js · en.js · ja.js
    ├── ui/
    │   ├── screen-manager.js # Home / Game / Help / Settings transitions
    │   ├── board-renderer.js # Dynamic SVG board rendering
    │   ├── piece-animator.js # Cell-by-cell piece movement
    │   ├── dice-animator.js  # 3D dice roll animation
    │   ├── home-ui.js · game-ui.js · help-ui.js · settings-ui.js
    └── main.js              # Bootstraps & wires all modules
```

**Folders by responsibility:**

| Folder | Responsibility |
|--------|---------------|
| `js/core` | Pure game logic & persistence (no DOM) |
| `js/ai` | Computer opponent decision-making |
| `js/audio` | Procedural sound & music |
| `js/i18n` | Multi-language strings & live switching |
| `js/ui` | Rendering, animation & screen control |
| `css/base` | Design tokens, resets, typography |
| `css/components` | Reusable visual pieces |
| `css/screens` | Per-screen layout |
| `css/responsive` | Breakpoint overrides |

<a name="en-features"></a>
### 8. ✨ Feature Highlights

- 🎨 **5 color themes** — Ocean / Coral / Tropical / Deep Sea / Sunset (live switch)
- 🌍 **3 languages** with instant in-page switching (no reload)
- 💾 **Auto-save & Continue** — resume exactly where you left off
- 🎵 **Code-synthesized audio** — independent BGM & SFX volume + on/off
- 📱 **Responsive** — CSS-Grid mobile layout never overlaps the board
- ♿ **Accessible** — `aria-label`s, focus-visible, respects `prefers-reduced-motion`
- 🪶 **Tiny & fast** — target < 200 KB total, 60 fps animations

<a name="en-browser"></a>
### 9. 🌐 Browser Support

| Browser | Minimum |
|---------|:---:|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari / Android Chrome | 14+ / 90+ |

[⬆ Back to top](#-language--言語--語言)

---
---

<a name="-日本語"></a>

## 🇯🇵 日本語

### 📑 目次

- [1. 概要](#ja-overview)
- [2. クイックスタート](#ja-quickstart)
- [3. 遊び方](#ja-howtoplay)
- [4. ゲームルール](#ja-rules)
- [5. AI 難易度](#ja-ai)
- [6. 技術構成](#ja-tech)
- [7. コード構成](#ja-structure)
- [8. 主な機能](#ja-features)
- [9. 対応ブラウザ](#ja-browser)

<a name="ja-overview"></a>
### 1. 📖 概要

**ウナギとエスカレーター** は『スポンジボブ』の世界を舞台にした 1 人用（プレイヤー vs AI）ボードゲームです。**エスカレーター 🔼** に止まれば上へワープ、**ウナギ 🐍** に止まれば下へ転落。先に **100 マス目** に到達したコマの勝ち！

| 項目 | 内容 |
|------|------|
| 🎮 ジャンル | 1人用ボード／戦略（プレイヤー vs AI） |
| 🎨 テーマ | スポンジボブ／ビキニボトムの海底風 |
| ⚙️ 技術 | 純フロントエンド HTML / CSS / JS — 依存ゼロ・ビルド不要 |
| 🚀 起動 | `index.html` をダブルクリックするだけ |
| 🌍 言語 | 繁体中文 · English · 日本語 |
| 📱 端末 | スマホ（iOS/Android）· タブレット · PC |

<a name="ja-quickstart"></a>
### 2. 🚀 クイックスタート

インストール・ビルド・サーバーは一切不要です。

```bash
# 方法A — 最も簡単
index.html をダブルクリック

# 方法B — ローカルサーバー（音声を完全に動かすなら推奨）
python -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

> 🔊 BGM・効果音は **Web Audio API** でリアルタイム合成され、最初のクリック／キー入力後に有効化されます（ブラウザの仕様）。音声ファイルのダウンロードはありません。

<a name="ja-howtoplay"></a>
### 3. 🕹️ 遊び方

| 手順 | 操作 |
|:---:|------|
| 1️⃣ | **ゲームスタート** を押し、難易度を選択（😊 簡単 / 😐 普通 / 😈 難しい） |
| 2️⃣ | 自分の番に大きな **🎲 サイコロを振る** ボタンを押す |
| 3️⃣ | コマが 1 マスずつ前進（1〜6 マス） |
| 4️⃣ | エスカレーターなら 🔼 **上昇**、ウナギなら 🐍 **転落** |
| 5️⃣ | コンピューターのターンは自動進行 |
| 6️⃣ | **ちょうど 100 マス目** に到達で勝利 🎉 |

⌨️ **ショートカット（ホーム）:** `Enter` 開始 · `C` 続きから · `H` 遊び方 · `S` 設定

<a name="ja-rules"></a>
### 4. 📜 ゲームルール

**ボード:** 10 × 10 = **100 マス**、蛇行（ブストロフェドン）配置 — 1 マス目（左下）スタート、100 マス目ゴール。6 面サイコロ 1 個（1〜6）、コマ 2 つ（あなた 🧽 vs コンピューター 🐙）。

**🔄 跳ね返りルール:** 100 を超える出目では **移動しません**。例：98 マス目で 4 を出すと 2 歩しか必要ないため → 98 マス目に留まります。

<details>
<summary>🐍 <b>ウナギ（全 6 匹）</b> — 頭に止まると尻尾へ転落</summary>

| ウナギ | 頭（発動マス） | 尻尾（移動先） | 長さ |
|:---:|:---:|:---:|:---:|
| 🐍 E1 | 17 | 7 | 短 |
| 🐍 E2 | 54 | 34 | 中 |
| 🐍 E3 | 62 | 19 | 長 |
| 🐍 E4 | 64 | 60 | 短 |
| 🐍 E5 | 87 | 24 | 超長 |
| 🐍 E6 | 95 | 75 | 中 |

</details>

<details>
<summary>🔼 <b>エスカレーター（全 6 台）</b> — 入口に止まると出口へ上昇</summary>

| エスカレーター | 入口（発動マス） | 出口（移動先） | 上昇幅 |
|:---:|:---:|:---:|:---:|
| 🔼 L1 | 4 | 14 | 小 |
| 🔼 L2 | 9 | 31 | 大 |
| 🔼 L3 | 20 | 38 | 中 |
| 🔼 L4 | 28 | 84 | 特大 |
| 🔼 L5 | 40 | 59 | 中 |
| 🔼 L6 | 51 | 67 | 小 |

</details>

<a name="ja-ai"></a>
### 5. 🤖 AI 難易度

| 難易度 | 戦略 | 挙動 |
|:---:|---|---|
| 😊 **簡単** | 完全ランダム | ただ振るだけ・倒しやすい |
| 😐 **普通** | ランダム＋軽い重み付け | たまに明らかなウナギを回避 |
| 😈 **難しい** | 重み付け＋先読みスコア | エスカレーター優先・ウナギ回避 |

> AI はズルをしません。「難しい」は各出目の着地点をスコア化（エスカレーター `+100`、ウナギ `−80`、エスカレーター近く `+10`）し、最も運が良さそうな手を選ぶだけです。

<a name="ja-tech"></a>
### 6. 🏗️ 技術構成

| レイヤー | 採用技術 |
|------|--------|
| 言語 | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| 音声 | Web Audio API — 効果音・BGM をコードで合成（音声ファイル不要） |
| 描画 | 純 CSS + インライン SVG（盤面・コマ・3D サイコロ） |
| 保存 | `localStorage`（セーブ・設定・言語・統計） |
| フォント | Google Fonts CDN（Fredoka One / Nunito / Noto Sans JP） |
| 設計 | 単一の `window.EAE` 名前空間を共有する IIFE モジュール |

**モジュール連携:** `main.js` が `DOMContentLoaded` を待ち、各エンジン／UI クラスを生成して依存性を注入、保存済み設定を適用します。処理の流れ：`GameUI → DiceAnimator → GameEngine.applyTurn() → PieceAnimator → BoardRenderer`、各ターン後に `SaveManager` が保存します。

<a name="ja-structure"></a>
### 7. 📂 コード構成

```
Eels_And_Escalators/
├── index.html              # エントリーポイント — 全画面＋アセット読み込み
├── assets/
│   └── favicon.svg         # 泡テーマのサイトアイコン
│
├── css/
│   ├── base/               # reset · variables（デザイントークン）· typography
│   ├── components/         # button · modal · dice · board · piece · slider · toggle
│   ├── screens/            # home · game · help · settings
│   └── responsive/         # mobile (≤480) · tablet (481–1024) · desktop (≥1025)
│
└── js/
    ├── core/               # ゲームロジック
    │   ├── game-engine.js   # ターン進行・移動・勝利／跳ね返り・保存
    │   ├── board-data.js    # 100 マスのマップ・ウナギ／エスカレーター・座標
    │   ├── dice.js          # サイコロのロジック
    │   └── save-manager.js  # localStorage ラッパー（セーブ／設定／統計）
    ├── ai/
    │   └── ai-engine.js     # 簡単／普通／難しいの判断ロジック
    ├── audio/
    │   ├── bgm-engine.js     # 合成ピアノ BGM シーケンス
    │   └── sfx-engine.js     # サイコロ／移動／エスカレーター／ウナギ／勝敗の効果音
    ├── i18n/
    │   ├── i18n-manager.js   # 言語切替＋DOM 更新（data-i18n）
    │   ├── zh-TW.js · en.js · ja.js
    ├── ui/
    │   ├── screen-manager.js # ホーム／ゲーム／遊び方／設定の遷移
    │   ├── board-renderer.js # 動的 SVG 盤面描画
    │   ├── piece-animator.js # 1 マスずつのコマ移動
    │   ├── dice-animator.js  # 3D サイコロ回転アニメ
    │   ├── home-ui.js · game-ui.js · help-ui.js · settings-ui.js
    └── main.js              # 全モジュールの初期化・連携
```

**責務別フォルダ:**

| フォルダ | 責務 |
|--------|---------------|
| `js/core` | 純粋なゲームロジックと永続化（DOM 非依存） |
| `js/ai` | コンピューターの意思決定 |
| `js/audio` | 手続き的な効果音・音楽 |
| `js/i18n` | 多言語文字列とライブ切替 |
| `js/ui` | 描画・アニメ・画面制御 |
| `css/base` | デザイントークン・リセット・タイポグラフィ |
| `css/components` | 再利用可能な部品 |
| `css/screens` | 画面ごとのレイアウト |
| `css/responsive` | ブレークポイント上書き |

<a name="ja-features"></a>
### 8. ✨ 主な機能

- 🎨 **5 つのカラーテーマ** — 海洋ブルー／珊瑚オレンジ／トロピカル／深海パープル／夕焼け（即時切替）
- 🌍 **3 言語** をページ内で即時切替（リロード不要）
- 💾 **オートセーブ＆続きから** — 中断地点から再開
- 🎵 **コード合成オーディオ** — BGM・効果音を個別に音量／オン・オフ
- 📱 **レスポンシブ** — CSS Grid のモバイルレイアウトで盤面が隠れない
- ♿ **アクセシブル** — `aria-label`・focus-visible・`prefers-reduced-motion` 対応
- 🪶 **軽量・高速** — 合計 200 KB 未満を目標・60fps アニメ

<a name="ja-browser"></a>
### 9. 🌐 対応ブラウザ

| ブラウザ | 最低バージョン |
|---------|:---:|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari / Android Chrome | 14+ / 90+ |

[⬆ トップへ戻る](#-language--言語--語言)

---
---

<a name="-繁體中文"></a>

## 🇹🇼 繁體中文

### 📑 目錄

- [1. 專案介紹](#zh-overview)
- [2. 快速開始](#zh-quickstart)
- [3. 遊戲玩法](#zh-howtoplay)
- [4. 遊戲規則](#zh-rules)
- [5. AI 難度](#zh-ai)
- [6. 技術架構](#zh-tech)
- [7. 程式分類與結構](#zh-structure)
- [8. 功能亮點](#zh-features)
- [9. 瀏覽器支援](#zh-browser)

<a name="zh-overview"></a>
### 1. 📖 專案介紹

**鰻魚與電扶梯** 是一款以《海綿寶寶》宇宙為背景的單人（玩家 vs AI）桌遊。踩到 **電扶梯 🔼** 就往上傳送，踩到 **鰻魚 🐍** 就往下滑落。最先抵達 **第 100 格** 的棋子獲勝！

| 項目 | 說明 |
|------|------|
| 🎮 類型 | 單人桌遊／策略（玩家 vs AI） |
| 🎨 主題 | 海綿寶寶／比奇堡海底風格 |
| ⚙️ 技術 | 純前端 HTML / CSS / JS — 零依賴、零建置 |
| 🚀 啟動 | 雙擊 `index.html` 即可開玩 |
| 🌍 語系 | 繁體中文 · English · 日本語 |
| 📱 裝置 | 手機（iOS/Android）· 平板 · 桌機 |

<a name="zh-quickstart"></a>
### 2. 🚀 快速開始

無需安裝、無需建置、無需伺服器。

```bash
# 方式 A — 最簡單
雙擊 index.html

# 方式 B — 本機伺服器（建議，音效行為最完整）
python -m http.server 8000
# 接著開啟 http://localhost:8000
```

> 🔊 背景音樂與音效皆由 **Web Audio API** 即時合成，會在你第一次點擊／按鍵後啟用（瀏覽器政策），完全不下載任何音檔。

<a name="zh-howtoplay"></a>
### 3. 🕹️ 遊戲玩法

| 步驟 | 操作 |
|:---:|------|
| 1️⃣ | 點擊 **開始遊戲**，選擇難度（😊 簡單 / 😐 普通 / 😈 困難） |
| 2️⃣ | 輪到你時，按下大大的 **🎲 擲骰子** 按鈕 |
| 3️⃣ | 棋子逐格往前跳（前進 1–6 步） |
| 4️⃣ | 踩到電扶梯 🔼 **往上升**；踩到鰻魚 🐍 **往下滑** |
| 5️⃣ | 電腦回合會自動進行 |
| 6️⃣ | **精確抵達第 100 格** 即獲勝 🎉 |

⌨️ **鍵盤快速鍵（主畫面）：** `Enter` 開始 · `C` 繼續 · `H` 說明 · `S` 設定

<a name="zh-rules"></a>
### 4. 📜 遊戲規則

**棋盤：** 10 × 10 = **100 格**，蛇形走法 — 第 1 格（左下）起點，第 100 格終點。一顆六面骰（1–6），兩顆棋子（你 🧽 vs 電腦 🐙）。

**🔄 反彈規則：** 若骰子點數會超過 100，則 **原地不動**。例如：在第 98 格骰到 4，只需 2 步即達標 → 留在第 98 格。

<details>
<summary>🐍 <b>鰻魚（共 6 條）</b> — 踩到頭部，滑落到尾部</summary>

| 鰻魚 | 頭部（觸發格） | 尾部（傳送目的地） | 長度 |
|:---:|:---:|:---:|:---:|
| 🐍 E1 | 17 | 7 | 短 |
| 🐍 E2 | 54 | 34 | 中 |
| 🐍 E3 | 62 | 19 | 長 |
| 🐍 E4 | 64 | 60 | 短 |
| 🐍 E5 | 87 | 24 | 超長 |
| 🐍 E6 | 95 | 75 | 中 |

</details>

<details>
<summary>🔼 <b>電扶梯（共 6 台）</b> — 踩到入口，搭乘上升到出口</summary>

| 電扶梯 | 入口（觸發格） | 出口（傳送目的地） | 升幅 |
|:---:|:---:|:---:|:---:|
| 🔼 L1 | 4 | 14 | 小 |
| 🔼 L2 | 9 | 31 | 大 |
| 🔼 L3 | 20 | 38 | 中 |
| 🔼 L4 | 28 | 84 | 超大 |
| 🔼 L5 | 40 | 59 | 中 |
| 🔼 L6 | 51 | 67 | 小 |

</details>

<a name="zh-ai"></a>
### 5. 🤖 AI 難度

| 難度 | 策略 | 行為 |
|:---:|---|---|
| 😊 **簡單** | 完全隨機 | 純擲骰、最好欺負 |
| 😐 **普通** | 隨機＋小幅加權 | 偶爾會避開明顯的鰻魚 |
| 😈 **困難** | 加權＋前瞻計分 | 偏好電扶梯、躲避鰻魚 |

> AI 不會作弊。「困難」只是把每個骰值的落點計分（電扶梯 `+100`、鰻魚 `−80`、靠近電扶梯 `+10`），選出看起來最幸運的一手。

<a name="zh-tech"></a>
### 6. 🏗️ 技術架構

| 層級 | 採用技術 |
|------|--------|
| 語言 | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| 音效 | Web Audio API — 音效與 BGM 以程式碼合成（無音檔） |
| 圖形 | 純 CSS + inline SVG（棋盤、棋子、3D 骰子） |
| 儲存 | `localStorage`（存檔、設定、語系、統計） |
| 字型 | Google Fonts CDN（Fredoka One / Nunito / Noto Sans JP） |
| 架構模式 | 共用單一 `window.EAE` 命名空間的 IIFE 模組 |

**模組串接：** `main.js` 等待 `DOMContentLoaded`，建立所有引擎／UI 類別並注入相依性，再套用已儲存設定。流程為：`GameUI → DiceAnimator → GameEngine.applyTurn() → PieceAnimator → BoardRenderer`，每回合後由 `SaveManager` 自動存檔。

<a name="zh-structure"></a>
### 7. 📂 程式分類與結構

```
Eels_And_Escalators/
├── index.html              # 入口點 — 所有畫面＋資源引入
├── assets/
│   └── favicon.svg         # 泡泡主題網站圖示
│
├── css/
│   ├── base/               # reset · variables（設計變數）· typography
│   ├── components/         # button · modal · dice · board · piece · slider · toggle
│   ├── screens/            # home · game · help · settings
│   └── responsive/         # mobile (≤480) · tablet (481–1024) · desktop (≥1025)
│
└── js/
    ├── core/               # 核心遊戲邏輯
    │   ├── game-engine.js   # 回合流程、移動、判勝／反彈、存檔
    │   ├── board-data.js    # 100 格地圖、鰻魚／電扶梯資料、座標
    │   ├── dice.js          # 擲骰邏輯
    │   └── save-manager.js  # localStorage 封裝（存檔／設定／統計）
    ├── ai/
    │   └── ai-engine.js     # 簡單／普通／困難決策邏輯
    ├── audio/
    │   ├── bgm-engine.js     # 合成鋼琴 BGM 序列
    │   └── sfx-engine.js     # 骰子／移動／電扶梯／鰻魚／勝負音效
    ├── i18n/
    │   ├── i18n-manager.js   # 語系切換＋DOM 更新（data-i18n）
    │   ├── zh-TW.js · en.js · ja.js
    ├── ui/
    │   ├── screen-manager.js # 主畫面／遊戲／說明／設定切換
    │   ├── board-renderer.js # 動態 SVG 棋盤渲染
    │   ├── piece-animator.js # 逐格棋子移動動畫
    │   ├── dice-animator.js  # 3D 骰子翻滾動畫
    │   ├── home-ui.js · game-ui.js · help-ui.js · settings-ui.js
    └── main.js              # 初始化並串接所有模組
```

**依責任分類：**

| 資料夾 | 負責內容 |
|--------|---------------|
| `js/core` | 純遊戲邏輯與資料保存（不碰 DOM） |
| `js/ai` | 電腦對手決策 |
| `js/audio` | 程式生成的音效與音樂 |
| `js/i18n` | 多語系字串與即時切換 |
| `js/ui` | 渲染、動畫與畫面控制 |
| `css/base` | 設計變數、重置、字體 |
| `css/components` | 可重用的視覺元件 |
| `css/screens` | 各畫面版型 |
| `css/responsive` | 斷點覆寫樣式 |

<a name="zh-features"></a>
### 8. ✨ 功能亮點

- 🎨 **5 種顏色主題** — 海洋藍／珊瑚橘／熱帶綠／深海紫／日落橘紅（即時切換）
- 🌍 **3 國語系** 頁面內即時切換（無需重載）
- 💾 **自動存檔＋繼續遊戲** — 從離開處無縫接續
- 🎵 **程式合成音效** — BGM 與音效可分別調整音量／開關
- 📱 **響應式設計** — 手機 CSS Grid 版型不會蓋住棋盤
- ♿ **無障礙** — `aria-label`、focus-visible、支援 `prefers-reduced-motion`
- 🪶 **輕巧快速** — 全部資源目標 < 200 KB、60fps 動畫

<a name="zh-browser"></a>
### 9. 🌐 瀏覽器支援

| 瀏覽器 | 最低版本 |
|---------|:---:|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari / Android Chrome | 14+ / 90+ |

[⬆ 回到頂端](#-language--言語--語言)

---

<div align="center">

🧽 *Made with bubbles in Bikini Bottom* · *比奇堡泡泡製造* · *ビキニボトム製* 🐙

完整規格請見 [`Eels-and-Escalators-spec.md`](./Eels-and-Escalators-spec.md) · See the full spec in [`Eels-and-Escalators-spec.md`](./Eels-and-Escalators-spec.md)

`v1.0.0`

</div>
