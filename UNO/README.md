# 🃏 UNO

純前端、零建置、可離線執行的 UNO 紙牌網頁遊戲。
A no-build, offline-ready UNO card web game built with Vanilla HTML/CSS/JavaScript.
ビルド不要でオフライン実行できる Vanilla HTML/CSS/JavaScript 製 UNO カードゲームです。

---

## 🌐 Quick Navigation / 快速導覽 / クイックナビ

| Language | Game Intro | How to Play | Program Intro | Code Structure |
|---|---:|---:|---:|---:|
| 🇺🇸 English | [Intro](#en-intro) | [Rules](#en-rules) | [Program](#en-program) | [Structure](#en-structure) |
| 🇯🇵 日本語 | [紹介](#ja-intro) | [遊び方](#ja-rules) | [プログラム](#ja-program) | [構成](#ja-structure) |
| 🇹🇼 繁體中文 | [介紹](#zh-intro) | [玩法](#zh-rules) | [程式介紹](#zh-program) | [程式分類](#zh-structure) |

### ⚡ Run Immediately / 立即執行 / すぐに実行

| Step | Action |
|---:|---|
| 1 | Open `index.html` directly in a browser. |
| 2 | No Node.js, build command, package install, or dev server is required. |
| 3 | Settings and game progress are saved in `localStorage`. |

---

<a id="en-intro"></a>

## 🇺🇸 English

### 🎮 Game Introduction

**UNO** is a single-player web version of the classic UNO card game where the player competes head-to-head against one AI opponent. The entire game runs directly from `index.html` with no build step, making it ideal for local play, offline demos, and simple static hosting.

| Item | Details |
|---|---|
| Genre | Turn-based card matching game |
| Mode | Player vs AI (1v1) |
| AI Difficulties | Easy, Normal, Hard |
| Deck Size | 108 cards |
| Starting Hand | 7 cards per player |
| Save System | Browser `localStorage` |
| In-Game Languages | Traditional Chinese, Simplified Chinese, English, Japanese |
| Audio | Web Audio API generated BGM/SFX (no external audio files needed) |
| UI | Responsive layout for desktop, tablet, and mobile |
| Themes | 6 switchable color themes |

#### ✨ Main Features

| Feature | Description |
|---|---|
| 🃏 Full 108-card deck | Numbers 0–9, Skip, Reverse, Draw Two, Wild, Wild Draw Four — all rendered as dynamic SVG cards |
| 🤖 AI opponent | Three difficulty tiers with distinct think delay, color preference, and UNO-call behavior |
| 🗣 UNO calling | Players and AI must call UNO at 1 card remaining, with realistic AI "forgetfulness" by difficulty |
| 💾 Continue game | Save and restore an in-progress match through `localStorage` |
| 🌐 i18n | Live language switching between 4 languages with no page reload |
| 🎨 Themes | Classic, Neon Night, Summer, Forest, Deep Sea, Candy |
| 🔊 Audio | Procedurally generated BGM/SFX with independent volume sliders |
| 📱 RWD | Mobile-safe fixed hand/action bar, tablet two-column layout, desktop full layout |
| ♿ Accessibility | `aria-label`s, keyboard navigation, visible focus rings, `prefers-reduced-motion` support |

<a id="en-rules"></a>

### 📖 How to Play

#### 🎯 Objective

Be the first to empty your hand. When you win, you score points equal to the total value of all cards left in the AI's hand.

#### 🔁 Turn Flow

| Step | Action |
|---:|---|
| 1 | Check the top card of the discard pile and the current active color. |
| 2 | Play a card that matches the color or value/symbol of the top card (Wild cards are always playable). |
| 3 | If no playable card exists, draw one card from the deck; play it if possible. |
| 4 | Resolve any special card effect (Skip / Reverse / Draw Two / Wild / Wild Draw Four). |
| 5 | If your hand reaches exactly 1 card, click **UNO!** before the opponent's next move. |
| 6 | The AI takes its turn following the same rules. |
| 7 | Repeat until one side empties their hand. |

#### 🃏 Card Composition (108 cards)

| Type | Count | Notes |
|---|---:|---|
| Number 0 | 4 | One per color |
| Number 1–9 | 72 | Two per color, per number |
| Skip | 8 | Two per color |
| Reverse | 8 | Two per color |
| Draw Two | 8 | Two per color |
| Wild | 4 | Colorless |
| Wild Draw Four | 4 | Colorless |

#### ✨ Special Card Effects

| Card | Effect |
|---|---|
| ⊘ Skip | The opponent loses their next turn |
| ⇄ Reverse | Reverses turn direction (functions as Skip in 1v1) |
| +2 Draw Two | Opponent draws 2 cards and is skipped |
| 🌈 Wild | Player chooses the next active color |
| 🌈 +4 Wild Draw Four | Player chooses color; opponent draws 4 cards and is skipped |

#### 🧮 Scoring (on win)

| Card Type | Points |
|---|---:|
| Number 0–9 | Face value |
| Skip / Reverse / Draw Two | 20 |
| Wild / Wild Draw Four | 50 |

#### 🗣 UNO Rule

⚠️ When your hand reaches exactly 1 card, you must call **UNO!**. Forgetting to call it before the opponent's next play is treated as a rule violation in the spec (penalty draw). The AI also follows a difficulty-based chance of remembering to call UNO.

#### 🤖 AI Difficulty

| Difficulty | Think Delay | Behavior |
|---|---|---|
| 😊 Easy | 0.6–1.2s | Plays a random legal card; rarely uses Wild strategically; calls UNO ~70% of the time |
| 🧐 Normal | 0.8–1.5s | Scores and ranks legal cards, prefers colors it holds more of; calls UNO ~90% of the time |
| 😈 Hard | 1.0–2.0s | Prioritizes offensive cards when the player is low on cards, avoids wasting Wilds early; always calls UNO |

<a id="en-program"></a>

### 🧩 Program Introduction

This project uses plain browser technologies only — no framework, no bundler, no package manager.

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties / `data-theme` attribute switching) |
| Logic | Vanilla JavaScript (ES6+) |
| Modules | Classic `<script>` loading order with global `window` namespaces (keeps `file://` compatible) |
| Storage | `localStorage` |
| Audio | Web Audio API (oscillator-based synthesized BGM/SFX) |
| Cards | Dynamically generated inline SVG per card, cached after first render |

#### 🧠 Architecture Summary

| Namespace / File | Responsibility |
|---|---|
| `UNO_CONSTANTS` | Colors, card types, difficulties, theme color metadata |
| `Themes` | Applies/saves the active `data-theme` color theme |
| `Helpers` | Generic utilities — shuffle, clamp, random, DOM helpers, pub/sub events |
| `UnoStorage` | `localStorage` wrapper for settings and save data |
| `I18n` | Language state, key lookup (`t()`), DOM text binding via `data-i18n` |
| `AudioManager` / `SFX` | Web Audio context, gain nodes, synthesized tone patterns per game event |
| `Deck` (`js/game/deck.js`) | Builds and shuffles the 108-card deck, draw/reshuffle logic |
| `Card` (`js/game/card.js`) | Card data helpers |
| `Player` (`js/game/player.js`) | Hand management |
| `Rules` | Legal-play checks, card scoring, special-case Wild Draw Four restriction |
| `AI` | Difficulty configs, card scoring/selection, color choice, UNO-call chance |
| `GameState` | Central state machine — turns, direction, draw stacking, win check, save/load |
| `CardRenderer` | Generates the SVG markup for every card face and back |
| `HandRenderer` / `TableRenderer` | Renders player hand and table (deck/discard/direction indicator) |
| `AnimationController` | Sequences deal/play/draw animations |
| `Modal` / `Toast` | Shared popup dialog and notification UI |
| `MainMenu` / `GameScreen` / `HelpScreen` / `SettingsScreen` | Per-screen render + event binding logic |
| `App` (`js/app.js`) | Entry point — screen routing, audio unlock, global click sounds, state subscriptions |

#### 🔄 Screen Flow

```text
Main Menu
  ├─ Start Game → Choose Difficulty → Game
  ├─ Continue Game (enabled only if a save exists) → Game
  ├─ Help
  └─ Settings

Game
  ├─ Player Turn → Play / Draw / Call UNO
  ├─ AI Turn → Think delay → Play / Draw
  ├─ Special Effect Resolution (Skip / Reverse / Draw / Color Choice)
  ├─ Auto Save (after every play/draw)
  └─ Win/Lose Result Modal → Play Again / Main Menu
```

#### 💾 Save Data

| Key | Purpose |
|---|---|
| `uno_save_v1` | Current match state (deck, hands, discard pile, direction, color, score) |
| `uno_settings_v1` | Language, theme, BGM/SFX volume, default AI difficulty |

<a id="en-structure"></a>

### 🗂️ Code Structure

```text
UNO/
├── index.html                  # Single entry point — open directly to play
├── README.md
├── UNO_SPEC.md                  # Full design/spec document (Chinese)
├── css/
│   ├── base/                    # reset, CSS variables, typography, global animation keyframes
│   ├── components/               # buttons, cards, modal, toast, slider, toggle
│   ├── screens/                  # mainMenu, game, help, settings layout styles
│   └── responsive/               # tablet, mobile, landscape breakpoint overrides
├── js/
│   ├── utils/                   # helpers, storage, i18n core
│   ├── config/                   # constants, themes, locales/ (zh-TW, zh-CN, en, ja)
│   ├── audio/                    # audioManager, sfx event map
│   ├── game/                     # deck, card, player, rules, ai, gameState
│   ├── ui/                       # cardRenderer, handRenderer, tableRenderer, animationController, modal, toast
│   ├── screens/                  # mainMenu, gameScreen, helpScreen, settingsScreen
│   └── app.js                    # entry point, routing
└── assets/                       # reserved for future static media (fonts/icons)
```

| Folder | Role |
|---|---|
| `css/base/` | Reset, design tokens (`--space-*`, `--font-size-*`, `--radius-*`), typography per language, global keyframes |
| `css/components/` | Reusable UI pieces shared across screens |
| `css/screens/` | Per-screen layout rules |
| `css/responsive/` | Breakpoint overrides for tablet/mobile/landscape, loaded last to take priority |
| `js/utils/` | Framework-agnostic helpers, `localStorage` wrapper, i18n engine |
| `js/config/` | Constants, theme metadata, and the 4 language tables |
| `js/audio/` | Audio context management and synthesized sound event mapping |
| `js/game/` | Pure game logic — deck building, rules, AI, the game state machine |
| `js/ui/` | DOM rendering and animation for cards, hand, table, modal, toast |
| `js/screens/` | Screen-level render + event-binding controllers |

---

<a id="ja-intro"></a>

## 🇯🇵 日本語

### 🎮 ゲーム紹介

**UNO** は、プレイヤーが AI と 1 対 1 で対戦するブラウザ版 UNO カードゲームです。`index.html` を直接ブラウザで開くだけで遊べるように作られており、ビルド、Node.js、開発サーバーは一切不要です。

| 項目 | 内容 |
|---|---|
| ジャンル | ターン制カードマッチングゲーム |
| モード | プレイヤー vs AI（1対1） |
| AI 難易度 | かんたん、ふつう、むずかしい |
| デッキ枚数 | 108 枚 |
| 初期手札 | 各プレイヤー 7 枚 |
| 保存方式 | ブラウザの `localStorage` |
| 対応言語 | 繁体字中国語、簡体字中国語、英語、日本語 |
| 音声 | Web Audio API による生成 BGM/SFX（外部音声ファイル不要） |
| 画面 | PC、タブレット、スマートフォン対応 |
| テーマ | 6 種類の配色テーマ |

#### ✨ 主な機能

| 機能 | 内容 |
|---|---|
| 🃏 完全な 108 枚デッキ | 数字 0–9、スキップ、リバース、ドロー2、ワイルド、ワイルドドロー4 を動的 SVG で描画 |
| 🤖 AI 対戦 | 3 段階の難易度で思考時間・色の好み・UNO 宣言の挙動が異なる |
| 🗣 UNO 宣言 | 手札が 1 枚になったら宣言が必要。AI も難易度に応じて宣言を「忘れる」ことがある |
| 💾 続きから遊ぶ | `localStorage` に進行状況を保存・復元 |
| 🌐 多言語 | 4 言語をリロードなしで即時切り替え |
| 🎨 テーマ | クラシック、ネオンナイト、サマー、フォレスト、ディープシー、キャンディ |
| 🔊 音声 | 生成された BGM/SFX、音量を個別調整可能 |
| 📱 RWD | モバイルでは手札・操作バーを固定表示、タブレットは2カラム、PCはフルレイアウト |
| ♿ アクセシビリティ | `aria-label`、キーボード操作、フォーカス表示、`prefers-reduced-motion` 対応 |

<a id="ja-rules"></a>

### 📖 遊び方

#### 🎯 目的

自分の手札を先に空にすれば勝利です。勝利すると、AI の残り手札の合計点数がスコアになります。

#### 🔁 ターンの流れ

| 手順 | 操作 |
|---:|---|
| 1 | 捨て札の一番上のカードと現在の有効な色を確認する |
| 2 | 色または数字/symbol が一致するカードを出す（ワイルドは常に出せる） |
| 3 | 出せるカードがない場合は山札から 1 枚引き、出せるなら出す |
| 4 | 特殊効果（スキップ／リバース／ドロー2／ワイルド／ワイルドドロー4）を処理する |
| 5 | 手札が 1 枚になったら、相手の次の手番前に **UNO!** を宣言する |
| 6 | AI が同じルールで手番を行う |
| 7 | どちらかの手札が 0 枚になるまで繰り返す |

#### 🃏 カード構成（108 枚）

| 種類 | 枚数 | 備考 |
|---|---:|---|
| 数字 0 | 4 | 各色 1 枚 |
| 数字 1–9 | 72 | 各色・各数字 2 枚 |
| スキップ | 8 | 各色 2 枚 |
| リバース | 8 | 各色 2 枚 |
| ドロー2 | 8 | 各色 2 枚 |
| ワイルド | 4 | 無色 |
| ワイルドドロー4 | 4 | 無色 |

#### ✨ 特殊カード効果

| カード | 効果 |
|---|---|
| ⊘ スキップ | 相手の手番をスキップ |
| ⇄ リバース | 進行方向を反転（1対1ではスキップと同じ） |
| +2 ドロー2 | 相手が 2 枚引いてスキップ |
| 🌈 ワイルド | 出した側が次の色を選択 |
| 🌈 +4 ワイルドドロー4 | 色を選択 + 相手が 4 枚引いてスキップ |

#### 🧮 得点計算（勝利時）

| カード種類 | 点数 |
|---|---:|
| 数字 0–9 | カードの数字 |
| スキップ／リバース／ドロー2 | 20 |
| ワイルド／ワイルドドロー4 | 50 |

#### 🗣 UNO ルール

⚠️ 手札が 1 枚になったら **UNO!** を宣言する必要があります。相手の手番前に宣言を忘れると違反となり、ペナルティ（追加ドロー）の対象になります。AI も難易度に応じた確率で宣言を行います。

#### 🤖 AI 難易度

| 難易度 | 思考時間 | 挙動 |
|---|---|---|
| 😊 かんたん | 0.6〜1.2秒 | 出せるカードからランダムに選択。ワイルドの戦略的使用は少ない。UNO宣言確率 約70% |
| 🧐 ふつう | 0.8〜1.5秒 | カードを評価してスコアの高いものを選択、保有枚数の多い色を優先。UNO宣言確率 約90% |
| 😈 むずかしい | 1.0〜2.0秒 | プレイヤーの手札が少ない時に攻撃的なカードを優先、ワイルドを温存。UNO宣言確率 100% |

<a id="ja-program"></a>

### 🧩 プログラム紹介

このプロジェクトは、ブラウザ標準技術だけで構成されています。フレームワークやバンドラー、パッケージマネージャーは使用していません。

| レイヤー | 技術 |
|---|---|
| HTML | HTML5 |
| CSS | CSS3（カスタムプロパティ、`data-theme` 属性による切り替え） |
| JavaScript | Vanilla JavaScript（ES6+） |
| モジュール方式 | classic `<script>` の読み込み順 + グローバル `window` 名前空間（`file://` 互換のため） |
| 保存 | `localStorage` |
| 音声 | Web Audio API（オシレーターによる合成 BGM/SFX） |
| カード描画 | 1枚ごとに動的生成される SVG、初回描画後はキャッシュ |

#### 🧠 アーキテクチャ

| 名前空間 / ファイル | 役割 |
|---|---|
| `UNO_CONSTANTS` | 色、カード種別、難易度、テーマカラー定義 |
| `Themes` | `data-theme` の適用と保存 |
| `Helpers` | shuffle、clamp、random、DOM操作、イベントの汎用ユーティリティ |
| `UnoStorage` | 設定とセーブデータの `localStorage` ラッパー |
| `I18n` | 言語状態、キー検索（`t()`）、`data-i18n` への文字反映 |
| `AudioManager` / `SFX` | Web Audio コンテキスト、ゲインノード、イベント別の合成音 |
| `Deck`（`js/game/deck.js`） | 108枚デッキの生成・シャッフル・ドロー・再シャッフル |
| `Card`（`js/game/card.js`） | カードデータの補助関数 |
| `Player`（`js/game/player.js`） | 手札管理 |
| `Rules` | 出せるかどうかの判定、得点計算、ワイルドドロー4 の制限処理 |
| `AI` | 難易度設定、カード評価・選択、色選択、UNO宣言確率 |
| `GameState` | 中心となる状態管理 — ターン、方向、ドロー累積、勝敗判定、保存/読込 |
| `CardRenderer` | 各カードの表面・裏面 SVG を生成 |
| `HandRenderer` / `TableRenderer` | 手札と卓上（山札／捨て札／方向表示）の描画 |
| `AnimationController` | 配布／プレイ／ドローのアニメーション制御 |
| `Modal` / `Toast` | 共通のポップアップと通知 UI |
| `MainMenu` / `GameScreen` / `HelpScreen` / `SettingsScreen` | 各画面の描画とイベント処理 |
| `App`（`js/app.js`） | エントリーポイント — 画面ルーティング、音声アンロック、状態購読 |

#### 🔄 画面遷移

```text
メインメニュー
  ├─ ゲーム開始 → 難易度選択 → ゲーム
  ├─ 続きから（セーブがある場合のみ有効） → ゲーム
  ├─ 遊び方
  └─ 設定

ゲーム
  ├─ プレイヤーの番 → プレイ / ドロー / UNO宣言
  ├─ AI の番 → 思考時間 → プレイ / ドロー
  ├─ 特殊効果処理（スキップ／リバース／ドロー／色選択）
  ├─ 自動保存（プレイ／ドロー毎）
  └─ 勝敗結果ダイアログ → もう一度 / メインメニュー
```

#### 💾 セーブデータ

| キー | 用途 |
|---|---|
| `uno_save_v1` | 現在の対局状態（デッキ、手札、捨て札、方向、色、得点） |
| `uno_settings_v1` | 言語、テーマ、BGM/SFX 音量、デフォルトAI難易度 |

<a id="ja-structure"></a>

### 🗂️ プログラム構成

| フォルダ | 内容 |
|---|---|
| `css/base/` | リセット、デザイントークン、言語別タイポグラフィ、共通アニメーション |
| `css/components/` | 画面間で共有するUIパーツ |
| `css/screens/` | 各画面のレイアウト |
| `css/responsive/` | タブレット／モバイル／横向きのブレークポイント調整（最後に読み込み） |
| `js/utils/` | 汎用ユーティリティ、`localStorage` ラッパー、i18n エンジン |
| `js/config/` | 定数、テーマ定義、4言語の翻訳テーブル |
| `js/audio/` | 音声コンテキスト管理と合成音イベントマッピング |
| `js/game/` | デッキ生成、ルール、AI、ゲーム状態管理などの純粋なゲームロジック |
| `js/ui/` | カード、手札、卓上、モーダル、トーストの描画とアニメーション |
| `js/screens/` | 画面ごとの描画とイベントバインディング |

---

<a id="zh-intro"></a>

## 🇹🇼 繁體中文

### 🎮 遊戲介紹

**UNO** 是一款玩家對戰 AI 的經典 UNO 紙牌網頁遊戲。專案採用純前端架構，可以直接開啟 `index.html` 遊玩，不需要 Node.js、不需要 build、不需要開發伺服器，也能離線執行。

| 項目 | 說明 |
|---|---|
| 類型 | 回合制配對紙牌遊戲 |
| 模式 | 玩家 vs AI（單挑） |
| AI 難度 | 簡單、普通、困難 |
| 牌組張數 | 108 張 |
| 起始手牌 | 每位玩家 7 張 |
| 儲存方式 | 瀏覽器 `localStorage` |
| 支援語言 | 繁體中文、簡體中文、英文、日文 |
| 音效 | Web Audio API 動態生成 BGM/SFX（無需外部音檔） |
| 介面 | 支援桌面、平板、手機 RWD |
| 主題 | 6 種可切換配色主題 |

#### ✨ 主要特色

| 特色 | 說明 |
|---|---|
| 🃏 完整 108 張牌組 | 數字 0–9、Skip、Reverse、Draw Two、Wild、Wild Draw Four，全部以動態 SVG 渲染 |
| 🤖 AI 對戰 | 三種難度，思考延遲、顏色偏好、喊 UNO 機率皆不同 |
| 🗣 UNO 規則 | 手牌剩 1 張時須喊 UNO，AI 也依難度有機率「忘記」喊 |
| 💾 繼續遊戲 | 使用 `localStorage` 保存與還原進行中的牌局 |
| 🌐 多國語系 | 4 種語言即時切換，無需重新載入頁面 |
| 🎨 主題切換 | 經典、夜晚霓虹、夏日陽光、森林綠、深海、糖果 |
| 🔊 音訊系統 | 程式即時生成的 BGM/SFX，音量可獨立調整 |
| 📱 響應式設計 | 手機固定底部手牌與操作列、平板雙欄、桌面完整版面 |
| ♿ 無障礙 | `aria-label`、鍵盤操作、明顯 focus 樣式、支援 `prefers-reduced-motion` |

<a id="zh-rules"></a>

### 📖 遊戲玩法

#### 🎯 遊戲目標

率先出完手牌的一方獲勝。獲勝時，得分為對手剩餘手牌的點數總和。

#### 🔁 回合流程

| 步驟 | 操作 |
|---:|---|
| 1 | 查看棄牌堆最上方的牌，以及目前有效顏色 |
| 2 | 出一張顏色或數字/符號相符的牌（萬用牌永遠可出） |
| 3 | 若無合法牌可出，從牌組抽一張，能出則出 |
| 4 | 觸發並結算特殊牌效果（Skip／Reverse／+2／Wild／+4） |
| 5 | 若手牌恰好剩 1 張，須在對方出牌前點擊 **UNO！** |
| 6 | AI 依相同規則進行回合 |
| 7 | 重複直到一方手牌出完 |

#### 🃏 牌組構成（108 張）

| 類型 | 張數 | 說明 |
|---|---:|---|
| 數字 0 | 4 | 每色 1 張 |
| 數字 1–9 | 72 | 每色每數字 2 張 |
| Skip（跳過） | 8 | 每色 2 張 |
| Reverse（反轉） | 8 | 每色 2 張 |
| Draw Two（+2） | 8 | 每色 2 張 |
| Wild（萬用） | 4 | 無色 |
| Wild Draw Four（+4） | 4 | 無色 |

#### ✨ 特殊牌效果

| 牌種 | 效果 |
|---|---|
| ⊘ Skip | 對方跳過下一回合 |
| ⇄ Reverse | 反轉出牌方向（雙人對戰時等同 Skip） |
| +2 Draw Two | 對方抽 2 張牌並跳過回合 |
| 🌈 Wild | 出牌者選擇接下來的有效顏色 |
| 🌈 +4 Wild Draw Four | 選色 + 對方抽 4 張並跳過回合 |

#### 🧮 得分計算（獲勝時）

| 牌種 | 點數 |
|---|---:|
| 數字 0–9 | 牌面數字 |
| Skip／Reverse／Draw Two | 20 分 |
| Wild／Wild Draw Four | 50 分 |

#### 🗣 UNO 規則

⚠️ 手牌剩 1 張時必須喊 **UNO！**。若在對方出牌前未喊，視為違規（依規則設計需罰抽牌）。AI 也會依難度有不同機率喊 UNO。

#### 🤖 AI 難度

| 難度 | 思考延遲 | 行為 |
|---|---|---|
| 😊 簡單 | 0.6–1.2 秒 | 從合法牌中隨機選擇，較少策略性保留萬用牌，喊 UNO 機率約 70% |
| 🧐 普通 | 0.8–1.5 秒 | 為每張合法牌評分後選最高分，偏好保留手牌較多的顏色，喊 UNO 機率約 90% |
| 😈 困難 | 1.0–2.0 秒 | 在玩家手牌少時優先出攻擊性牌，避免過早消耗萬用牌，必喊 UNO |

<a id="zh-program"></a>

### 🧩 程式介紹

本專案完全使用瀏覽器原生技術，不依賴框架、打包工具或套件管理器。

| 層級 | 技術 |
|---|---|
| 標記 | HTML5 |
| 樣式 | CSS3（自訂屬性 + `data-theme` 屬性切換） |
| 邏輯 | Vanilla JavaScript（ES6+） |
| 載入方式 | classic `<script>` 依序載入 + 全域 `window` 命名空間（維持 `file://` 相容性） |
| 儲存 | `localStorage` |
| 音訊 | Web Audio API（以振盪器即時合成 BGM/SFX） |
| 牌面渲染 | 每張牌動態生成 inline SVG，首次渲染後快取 |

#### 🧠 架構概念

| 命名空間／檔案 | 負責內容 |
|---|---|
| `UNO_CONSTANTS` | 顏色、牌種、難度、主題色彩定義 |
| `Themes` | 套用與保存目前的 `data-theme` 主題 |
| `Helpers` | shuffle、clamp、random、DOM 操作、事件發布訂閱等通用工具 |
| `UnoStorage` | 設定與存檔的 `localStorage` 封裝 |
| `I18n` | 語系狀態、文字查找（`t()`）、透過 `data-i18n` 套用到 DOM |
| `AudioManager` / `SFX` | Web Audio context、增益節點、依事件合成對應音效 |
| `Deck`（`js/game/deck.js`） | 建立並洗牌 108 張牌組、抽牌與重新洗牌邏輯 |
| `Card`（`js/game/card.js`） | 牌的資料輔助函式 |
| `Player`（`js/game/player.js`） | 手牌管理 |
| `Rules` | 出牌合法性判斷、得分計算、Wild Draw Four 特殊限制 |
| `AI` | 難度設定、牌評分/選擇、選色邏輯、喊 UNO 機率 |
| `GameState` | 核心狀態機 — 回合、方向、累積抽牌、勝負判斷、存讀檔 |
| `CardRenderer` | 生成每張牌正面/背面的 SVG |
| `HandRenderer` / `TableRenderer` | 渲染玩家手牌與桌面（牌組/棄牌堆/方向指示） |
| `AnimationController` | 控制發牌/出牌/抽牌動畫序列 |
| `Modal` / `Toast` | 共用彈窗與提示訊息 UI |
| `MainMenu` / `GameScreen` / `HelpScreen` / `SettingsScreen` | 各畫面的渲染與事件綁定邏輯 |
| `App`（`js/app.js`） | 程式入口 — 畫面路由、音訊解鎖、全域點擊音效、狀態訂閱 |

#### 🔄 畫面流程

```text
主選單
  ├─ 開始遊戲 → 選擇難度 → 遊戲畫面
  ├─ 繼續遊戲（僅有存檔時可用） → 遊戲畫面
  ├─ 遊戲說明
  └─ 設定

遊戲畫面
  ├─ 玩家回合 → 出牌 / 抽牌 / 喊 UNO
  ├─ AI 回合 → 思考延遲 → 出牌 / 抽牌
  ├─ 特殊效果結算（跳過／反轉／抽牌／選色）
  ├─ 自動存檔（每次出牌/抽牌後）
  └─ 勝負結果彈窗 → 再玩一局 / 主選單
```

#### 💾 儲存資料

| Key | 用途 |
|---|---|
| `uno_save_v1` | 目前牌局狀態（牌組、手牌、棄牌堆、方向、顏色、分數） |
| `uno_settings_v1` | 語言、主題、BGM/SFX 音量、預設 AI 難度 |

<a id="zh-structure"></a>

### 🗂️ 程式分類

```text
UNO/
├── index.html                  # 唯一入口，直接開啟即可遊玩
├── README.md                   # 專案說明（本檔案）
├── UNO_SPEC.md                  # 完整設計規格書
├── css/
│   ├── base/                    # reset、CSS 變數、字體設定、全域動畫關鍵幀
│   ├── components/               # 按鈕、牌面、彈窗、提示訊息、滑桿、開關
│   ├── screens/                  # 主選單、遊戲、說明、設定畫面樣式
│   └── responsive/               # 平板、手機、橫向手機斷點覆寫
├── js/
│   ├── utils/                   # helpers、storage、i18n 核心
│   ├── config/                   # constants、themes、locales/（zh-TW、zh-CN、en、ja）
│   ├── audio/                    # audioManager、音效事件對應表
│   ├── game/                     # deck、card、player、rules、ai、gameState
│   ├── ui/                       # cardRenderer、handRenderer、tableRenderer、animationController、modal、toast
│   ├── screens/                  # mainMenu、gameScreen、helpScreen、settingsScreen
│   └── app.js                    # 程式入口、畫面路由
└── assets/                       # 預留靜態素材資料夾（字型/圖示）
```

| 資料夾 | 說明 |
|---|---|
| `css/base/` | Reset、設計變數（`--space-*`、`--font-size-*`、`--radius-*`）、各語系字體、全域動畫 |
| `css/components/` | 跨畫面共用的 UI 元件樣式 |
| `css/screens/` | 各畫面專屬版面樣式 |
| `css/responsive/` | 平板/手機/橫向斷點覆寫，最後載入以確保優先權 |
| `js/utils/` | 與框架無關的工具函式、`localStorage` 封裝、i18n 引擎 |
| `js/config/` | 常數、主題色彩定義、4 種語系翻譯表 |
| `js/audio/` | 音訊 context 管理與合成音效事件對應 |
| `js/game/` | 純遊戲邏輯 — 牌組建立、規則判斷、AI、遊戲狀態機 |
| `js/ui/` | 牌面、手牌、桌面、彈窗、提示訊息的渲染與動畫 |
| `js/screens/` | 各畫面層級的渲染與事件綁定控制器 |

---

## ✅ Compatibility Notes / 相容性補充 / 互換性メモ

| Topic | Note |
|---|---|
| Direct file opening | Designed for direct `index.html` opening via `file://`. |
| ES Modules | Not used, to avoid `file://` CORS issues — all scripts use classic loading + global namespaces. |
| Audio files | BGM/SFX are synthesized with the Web Audio API, so the game works fully even with no external audio assets present. |
| Save data | Stored per-browser-profile only, under `uno_save_v1` / `uno_settings_v1`. |
| Mobile | Responsive layout with a fixed bottom hand/action bar and `100dvh`-aware sizing. |
