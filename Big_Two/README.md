<a id="top"></a>

# 🃏 Big Two — Offline Web Card Game

> **App version 5.0.0 · Schema version 1 · Fully offline · No installation or build required**

Play Taiwanese Big Two directly in a modern browser: one human player, three AI opponents, four visual themes, three interface languages, synthesized music and sound effects, autosave, responsive layouts, and keyboard-friendly controls.

## 🧭 Language & quick navigation

| Language | Game overview | How to play | Controls | Program guide | File map |
| --- | --- | --- | --- | --- | --- |
| 🇬🇧 **English** | [Overview](#en-overview) | [Rules](#en-gameplay) | [Controls](#en-controls) | [Architecture](#en-program) | [Classification](#en-classification) |
| 🇯🇵 **日本語** | [概要](#ja-overview) | [遊び方](#ja-gameplay) | [操作](#ja-controls) | [プログラム構成](#ja-program) | [ファイル分類](#ja-classification) |
| 🇹🇼 **繁體中文** | [遊戲介紹](#zh-overview) | [遊戲玩法](#zh-gameplay) | [操作方式](#zh-controls) | [程式介紹](#zh-program) | [程式分類](#zh-classification) |

---

<a id="english"></a>

## 🇬🇧 English

### 🔖 Quick links

[Overview](#en-overview) · [Quick start](#en-quick-start) · [Gameplay](#en-gameplay) · [Controls](#en-controls) · [Features](#en-features) · [Program](#en-program) · [Classification](#en-classification) · [State & storage](#en-storage) · [Tests](#en-tests)

<a id="en-overview"></a>

### 🌟 Game overview

Big Two is a shedding card game in which the goal is to empty your hand before everyone else. This project implements the Taiwanese rule set as a self-contained browser game. You play against three computer opponents named Clover, Dia, and Spade. Every rule decision, AI turn, visual asset, translation, sound, and save operation runs locally on the device.

| Item | Details |
| --- | --- |
| 🎮 Mode | Single-player: 1 human vs. 3 AI opponents |
| 🂠 Deck | Standard 52-card deck, no jokers, 13 cards per player |
| 🧠 AI | Easy, Normal, and Hard |
| 🌐 Languages | Traditional Chinese (`zh-Hant`), English (`en`), Japanese (`ja`) |
| 🎨 Themes | Classic Green Table, Midnight Neon, Sakura Pastel, Cute Animal Party |
| 🎵 Audio | Four locally synthesized BGM tracks and procedural sound effects |
| 💾 Persistence | Autosaved game, settings, statistics, score, and win streaks in `localStorage` |
| 📱 Input | Mouse, touch, and keyboard |
| 🖥️ Layout | Responsive from 320 px phones through tablets, landscape devices, and wide desktop screens |
| 📦 Runtime | Plain HTML, CSS, and JavaScript; no npm, build step, server, API, CDN, or network connection |

The project deliberately does **not** include online multiplayer, accounts, cloud sync, paid items, advertisements, a backend, a database, or a service worker.

<a id="en-quick-start"></a>

### 🚀 Quick start

1. Download or copy the entire project directory without changing its internal paths.
2. Open the root [`index.html`](index.html) by double-clicking it or by using your browser's **Open File** command.
3. Select **Start Game**. The browser may require one click, tap, or keyboard action before audio can begin.

That is all—there is no `npm install`, compilation, development server, environment variable, login, or internet requirement.

> If a browser blocks `localStorage` for `file://` pages, the current round remains playable, but settings and **Continue Game** may not persist after the page is closed.

#### Optional static hosting

The game may also be hosted on any static file service. Upload the repository contents unchanged and use the root `index.html` as the entry point. No route rewrites, server code, database, or API configuration is needed.

<a id="en-gameplay"></a>

### 🎯 How to play

#### Round flow

```text
Shuffle and deal 13 cards to each player
                ↓
The holder of 3♣ makes the opening play
                ↓
Players take turns playing a stronger legal hand or passing
                ↓
Three consecutive passes clear the table; the last player to play leads
                ↓
The first player with no cards wins and the round is scored
```

#### Card strength

| Category | Weakest → strongest |
| --- | --- |
| Rank | `3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2` |
| Suit | Clubs `♣ <` Diamonds `♦ <` Hearts `♥ <` Spades `♠` |

The card key used by the rules engine is `rank × 4 + suit`, so rank is compared first and suit breaks equal ranks.

#### Opening rule

- The player holding the **3 of clubs (3♣)** starts every newly dealt round.
- The first play may be any valid one-, two-, three-, or five-card hand, but it must contain 3♣.
- A lead on an empty table cannot be passed.

#### Legal hand types

| Cards | Hand | Requirement | Comparison |
| ---: | --- | --- | --- |
| 1 | Single | Any card | Rank, then suit |
| 2 | Pair | Two cards of one rank | Rank, then the highest suit in the pair |
| 3 | Triple | Three cards of one rank | Triple rank only |
| 5 | Straight | One of the ten permitted rank sequences | Straight order, then representative-card suit |
| 5 | Flush | Five cards of one suit that are not a straight | Suit first, then descending ranks |
| 5 | Full House | A triple plus a pair | Rank of the triple |
| 5 | Four of a Kind | Four cards of one rank plus any single card | Rank of the four-card group |
| 5 | Straight Flush | Both a straight and a flush | Straight order, then suit |

Four-card plays and every other card count are invalid. A response must use the **same number of cards** as the current table hand. Singles, pairs, and triples therefore respond to the same basic type. Five-card hands may cross types according to this order:

```text
Straight < Flush < Full House < Four of a Kind < Straight Flush
```

A stronger five-card category beats every weaker five-card category. A five-card hand can never beat a single, pair, or triple, and there is no cross-count “bomb” rule.

#### Every legal straight

The ten accepted straights, from strongest to weakest, are:

| Strength | Sequence | Representative card for equal-sequence suit comparison |
| ---: | --- | --- |
| 1 | `2-3-4-5-6` | The `2` |
| 2 | `A-2-3-4-5` | The `2` |
| 3 | `10-J-Q-K-A` | The `A` |
| 4 | `9-10-J-Q-K` | The `K` |
| 5 | `8-9-10-J-Q` | The `Q` |
| 6 | `7-8-9-10-J` | The `J` |
| 7 | `6-7-8-9-10` | The `10` |
| 8 | `5-6-7-8-9` | The `9` |
| 9 | `4-5-6-7-8` | The `8` |
| 10 | `3-4-5-6-7` | The `7` |

Sequences such as `J-Q-K-A-2`, `Q-K-A-2-3`, and `K-A-2-3-4` are not legal.

#### Turns, playing, and PASS

- On your turn, select a legal hand that beats the cards on the table, then choose **Play**.
- When the table contains a hand, you may choose **PASS** even if you have a legal response.
- Passing does not remove you from the entire trick. If another player later plays successfully, you may play again when your next turn arrives.
- Every successful play resets the consecutive-pass counter.
- After the last successful play, three consecutive passes end the trick. The table is cleared and that last player leads the new trick.
- Plays and passes cannot be undone.
- The round ends immediately when any player empties their hand.

#### Round scoring

Each losing player receives a penalty based on the cards left in their hand:

| Cards left | Penalty |
| ---: | ---: |
| 1–7 | 1 point per card |
| 8–10 | 2 points per card |
| 11–12 | 3 points per card |
| 13 | 52 points |

The winner gains the sum of all three penalties, while each loser loses their own penalty. The four score changes always total zero. Cumulative scores may become negative and carry into the next round.

#### AI difficulty

All three AI levels receive only their own hand, public card counts, table cards, and public action history. They do not inspect opponents' hidden hands. If a legal response exists, the AI plays; it passes only when no legal response exists.

| Difficulty | Actual strategy |
| --- | --- |
| 🌱 Easy | Uses weighted randomness over legal moves, favoring weaker moves. When leading, singles and pairs receive extra weight. It is varied and may break combinations. |
| 🌿 Normal | Estimates the minimum number of turns needed to empty the remaining hand, avoids breaking pairs/triples/four-of-a-kind, conserves high control cards, and reacts more strongly when an opponent has only one or two cards. |
| 🌳 Hard | Builds on Normal with visible-play memory, threat-sensitive blocking, singleton and fragmentation penalties, and stronger control-card decisions. Search is bounded to 6,000 nodes and 450 ms, then safely falls back to Normal. |

AI tie-breaking uses an injected reproducible random generator, so the same state, difficulty, and RNG state produce the same decision. The interface adds an approximately 350–700 ms thinking delay when animations are enabled, or 50 ms when they are disabled.

<a id="en-controls"></a>

### 🕹️ Controls and screens

#### Mouse and touch

| Action | How |
| --- | --- |
| Select or deselect | Click or tap a card |
| Play | Select a valid combination, then choose **Play** |
| Pass | Choose **PASS** when the table is not empty |
| Ask for help | Choose **Hint** to select a suggestion generated with Normal AI logic |
| Clear selection | Choose **Clear Selection** |
| Reorder the hand | Toggle **Sort by Rank / Sort by Suit**; sorting changes display order only |
| Scroll a long hand | Horizontally scroll the hand area on narrow screens |
| Leave the table | Choose **Return Home**, then confirm; the stable game is saved first |

The **Play** button is enabled only when the selected cards form a currently legal action. Invalid actions are rejected without modifying the game state.

#### Keyboard

| Key | Action |
| --- | --- |
| `Tab` / `Shift+Tab` | Move among interactive controls |
| `←` / `→` | Move focus through cards in your hand |
| `Space` / `Enter` | Select/deselect the focused card or activate a button |
| `P` | PASS, when passing is legal |
| `H` | Request a hint |
| `Escape` | Close a dialog or clear the current card selection |

Game shortcuts do not intercept input while a text field, select menu, or slider is focused. Range controls retain their native keyboard behavior.

#### Screen guide

| Screen | Purpose |
| --- | --- |
| 🏠 Home | Start a new game, continue a valid save, open the rules, open settings, and view the app version |
| 🃏 Game table | Shows round, cumulative score, difficulty, current turn, player seats, remaining counts, table hand, human hand, and action controls |
| 📖 How to Play | Documents the goal, rank/suit order, hands, straights, passing, scoring, AI, saving, customization, and keyboard controls |
| ⚙️ Settings | Changes difficulty, theme, language, animations, BGM, SFX, volume, track, or resets all local data |
| 🏆 Results | Shows winner, standings, cards left, round score, total score, current streak, next round, and return-home actions |

<a id="en-features"></a>

### ✨ Features and settings

| Group | Options and behavior |
| --- | --- |
| Game | Easy / Normal / Hard AI difficulty |
| Display | Four themes, three languages, and an animation switch |
| BGM | On/off, 0–100% in steps of 5, automatic rotation or one selected track |
| SFX | Independent on/off and 0–100% volume in steps of 5 |
| Data | Reset the active game, cumulative scores, statistics, preferences, and audio-notice state after confirmation |

The four built-in BGM tracks are **Morning Walk**, **Sakura Steps**, **Starlight Parade**, and **Candy Party**. They are generated locally with the Web Audio API; no audio file is downloaded or streamed. Audio remains optional: if Web Audio is unavailable, gameplay continues and audio controls are disabled.

Language detection prefers a saved choice, then checks browser languages for Traditional Chinese, Japanese, or English, and finally falls back to Traditional Chinese. Switching language immediately refreshes visible text, the document title, the root `lang` attribute, and translated accessibility labels.

<a id="en-program"></a>

### 🧩 Program introduction and architecture

#### Technical profile

| Layer | Implementation |
| --- | --- |
| HTML | One runtime entry point with ordered classic `<script defer>` and stylesheet links |
| CSS | Base tokens, reusable components, per-screen layout, theme overrides, and responsive overrides |
| JavaScript | Vanilla JavaScript files wrapped in IIFEs and exposed through one `window.BigTwo` namespace |
| State | Pure-style transitions: `Game.applyAction` validates, deep-clones, and returns a new `GameState` |
| Rules | DOM-independent card, deck, hand classification, comparison, legal-move, and scoring functions |
| Persistence | Versioned `localStorage` records with normalized settings and validated game snapshots |
| Audio | Local Web Audio synthesis with user-gesture unlock, gain stages, compressor, and limiter |
| Testing | Zero-dependency browser test runner opened directly through `file://` |

There is no `package.json`, lockfile, bundler, transpiler, framework, Docker configuration, service worker, runtime module loader, `fetch()` dependency, or remote asset.

#### Script dependency order

The order in [`index.html`](index.html) is part of the architecture and must remain intact:

```text
config
  → utils
  → i18n engine and dictionaries
  → storage
  → audio libraries and manager
  → core rules
  → AI strategies
  → game state/controllers
  → UI controllers/renderers
  → screen builders
  → app.js
```

Runtime modules register themselves under:

```text
window.BigTwo
├─ Config / Utils / I18n
├─ SaveSchema / Storage / Audio
├─ Card / Deck / Rules
├─ AI / Game
├─ UI / Screens
└─ App
```

#### Runtime data flow

```text
DOMContentLoaded
  → BigTwo.App.init()
  → load settings, statistics, and continue-game snapshot
  → initialize locale, theme, audio, router, dialogs, toasts, and animation control
  → register Home / Game / Help / Settings / Results
  → render Home

Human action
  → game-screen
  → App.dispatchHuman()
  → Game.validateAction() + Rules
  → Game.applyAction() returns a cloned next state
  → autosave
  → refresh screen
  → ensureAITurn()

AI action
  → Rules.getLegalMoves()
  → AI.chooseAction(difficulty, injected RNG)
  → the same Game.applyAction() path
```

Human and AI turns share the same validation and state-transition entry point. At round end, `Rules.scoreRound()` updates cumulative scores, statistics are recorded, the finished active save is removed, and the router displays Results.

<a id="en-classification"></a>

### 🗂️ Program classification

#### JavaScript modules

| Category | Responsibility | Key files |
| --- | --- | --- |
| `js/config/` | App/schema versions, ranks, suits, hand strengths, storage keys, defaults, theme metadata | `constants.js`, `themes.js` |
| `js/utils/` | Deep cloning/equality, stable serialization, combinations, seeded RNG, validation and settings normalization | `helpers.js`, `rng.js`, `validation.js` |
| `js/i18n/` | Locale detection, escaping/interpolation, number/date formatting, live language changes, three dictionaries | `i18n.js`, `zh-Hant.js`, `en.js`, `ja.js` |
| `js/storage/` | Safe `localStorage` wrapper, statistics, snapshots, checksum and complete-state validation | `storage.js`, `save-schema.js` |
| `js/audio/` | Web Audio lifecycle, BGM sequencing, SFX definitions, volume and track changes | `audio-manager.js`, `music-library.js`, `sfx-library.js` |
| `js/core/` | Card/deck model, shuffle/deal, hand evaluation, comparison, legal moves, scoring | `card.js`, `deck.js`, `hand-evaluator.js`, `hand-comparator.js`, `legal-moves.js`, `scoring.js` |
| `js/ai/` | Shared planning/scoring plus Easy, Normal, and Hard selection policies | `ai-common.js`, `ai-easy.js`, `ai-normal.js`, `ai-hard.js` |
| `js/game/` | `GameState`, action validation/application, turn queries, controller-level autosave | `game-state.js`, `game-controller.js`, `turn-controller.js`, `save-controller.js` |
| `js/ui/` | Router, card/table rendering, animations, modal dialogs, toast notifications | `router.js`, `card-renderer.js`, `table-renderer.js`, `animation-controller.js`, `dialog-controller.js`, `toast-controller.js` |
| `js/screens/` | DOM construction and interaction for Home, Game, Help, Settings, and Results | `*-screen.js` |
| `js/app.js` | Application bootstrap and orchestration: navigation, AI turns, saving, settings, audio, and results | `app.js` |

#### CSS layers

| Category | Responsibility |
| --- | --- |
| `css/base/` | Reset, design tokens, typography, accessibility, shared animation definitions |
| `css/components/` | Buttons, cards, controls, modal, slider, toast, and player seats |
| `css/screens/` | Home, game, help, settings, and results layouts |
| `css/themes/` | Classic, Midnight, Sakura, and Cute Party color/decoration overrides |
| `css/responsive/` | Desktop (`≥1024`), tablet (`768–1023`), mobile (`≤767`), narrow mobile, and low-height landscape rules |

The CSS cascade loads in this order: **base → components → screens → themes → desktop → tablet → mobile → landscape**. Later theme and responsive rules intentionally refine earlier component styles.

#### Repository map

```text
Big_Two/
├─ index.html                    # Game entry and ordered local dependencies
├─ spec.md                       # Product, rule, UI, and acceptance specification
├─ README.md                     # This trilingual guide
├─ css/
│  ├─ base/                      # Reset, variables, typography, accessibility, animations
│  ├─ components/                # Shared UI components
│  ├─ screens/                   # Screen-specific styles
│  ├─ themes/                    # Four themes
│  └─ responsive/                # Desktop, tablet, mobile, landscape
├─ js/
│  ├─ config/                    # Constants and themes
│  ├─ utils/                     # Helpers, RNG, validation
│  ├─ i18n/                      # Translation engine and dictionaries
│  ├─ storage/                   # Save schema and local storage
│  ├─ audio/                     # BGM/SFX synthesis and manager
│  ├─ core/                      # Deck and complete rule engine
│  ├─ ai/                        # Three AI levels
│  ├─ game/                      # State and turn controllers
│  ├─ ui/                        # Reusable renderers/controllers
│  ├─ screens/                   # Five screen builders
│  └─ app.js                     # Runtime coordinator
├─ tests/
│  ├─ index.html                 # Offline browser test entry
│  ├─ framework/                 # Tiny local test runner
│  ├─ css/                       # Runner styles
│  └─ specs/                     # Nine functional test groups
└─ skills/                       # Optional maintenance guidance; not runtime code
   ├─ big-two-workshop/          # Project maintenance and visual-review workflow
   └─ multilingual-commit/       # English/Japanese/Chinese commit-message workflow
```

The runtime has no external image or audio directory: avatars and decorations are inline SVG/CSS, while music and sound effects are generated programmatically.

#### Important APIs

| API | Purpose |
| --- | --- |
| `BigTwo.Rules.classifyHand(cards)` | Validate and classify a selected hand |
| `BigTwo.Rules.compareHands(candidate, table)` | Compare two compatible hands |
| `BigTwo.Rules.canBeat(candidate, table)` | Safe boolean beat check |
| `BigTwo.Rules.getLegalMoves(hand, table, context)` | Enumerate every legal move once |
| `BigTwo.Rules.scoreRound(players, winnerId)` | Produce zero-sum round score changes |
| `BigTwo.Game.createNewGame(options)` | Shuffle, deal, find the 3♣ holder, and create initial state |
| `BigTwo.Game.validateAction(state, action)` | Validate a play, pass, or next-round request |
| `BigTwo.Game.applyAction(state, action)` | Return the immutable next state or throw `GameActionError` |
| `BigTwo.AI.chooseAction(state, playerId, difficulty, rng)` | Choose a legal AI action |
| `BigTwo.Storage.saveActiveGame(state)` | Validate and write a resumable snapshot |
| `BigTwo.Storage.loadActiveGame()` | Return an `ok`, `empty`, `invalid`, or `unavailable` load result |
| `BigTwo.I18n.t(key, values)` | Translate and safely interpolate UI text |
| `BigTwo.App` | Coordinate screens, player/AI turns, settings, audio, saving, and results |

<a id="en-storage"></a>

### 💾 Game state, actions, and storage

#### Core state

`GameState` stores the four players, current player index, table cards and evaluated hand, last player to play, consecutive passes, opening-card requirement, round number, reproducible RNG state, action history, selected AI difficulty, cumulative scores, and round result.

Supported state-changing actions are:

```js
{ type: 'PLAY_CARDS', playerId, cardIds }
{ type: 'PASS', playerId }
{ type: 'START_NEXT_ROUND' }
```

Illegal actions throw a `GameActionError` with a machine-readable `code`. Because validation occurs before cloning and mutation, the original state and action history remain unchanged.

#### Local records

| Key | Contents |
| --- | --- |
| `bigTwo.settings.v1` | Difficulty, theme, locale, animation, BGM/SFX toggles and volumes, selected track |
| `bigTwo.activeGame.v1` | Versioned in-progress `GameState` snapshot |
| `bigTwo.statistics.v1` | Games played/won/lost, current and best streak, total score, wins by difficulty |
| `bigTwo.audioNoticeSeen.v1` | Whether the one-time volume notice has been shown |

The active snapshot contains `schemaVersion`, ISO 8601 `savedAt`, `appVersion`, the complete `gameState`, and a stable checksum. Loading validates the schema, all four players and seats, all 52 unique cards, card counts, action types and sequence, the 3♣ opening move, three-pass logic, current player, table hand, phase, timestamp, and checksum. A damaged active save is rejected and cleared without deleting settings or statistics.

Stable in-progress state is saved after a new deal, every legal human or AI play/PASS, before returning home, after starting the next round, and when the page becomes hidden. Finished rounds are never offered through **Continue Game**.

<a id="en-accessibility"></a>

### ♿ Accessibility and responsive design

- Semantic `main`, `nav`, `section`, `button`, `table`, and dialog structures.
- A skip-to-content link, visible `:focus-visible` indicators, polite/assertive live regions, and translated accessible names.
- Card labels include rank, suit, and selection state; opponent announcements expose public card counts rather than hidden hands.
- Dialog focus trapping and focus restoration.
- System `prefers-reduced-motion` and forced-colors support.
- 48 px touch-target baseline, safe-area insets, dynamic viewport height, scrollable hands, and bottom action-bar spacing.
- Dedicated desktop, tablet, mobile, narrow-mobile, and short-landscape layouts; browser zoom is not disabled.

<a id="en-tests"></a>

### 🧪 Tests and maintenance

Open [`tests/index.html`](tests/index.html) directly in a browser and use **Run All Tests**. The local runner requires no Node.js, package manager, server, or external library.

| Test group | Coverage |
| --- | --- |
| Deck | 52 unique cards, seeded shuffle, 13-card deal, 3♣ opener |
| Rules | All hand types, ten straights, invalid hands, non-mutation |
| Comparator | Rank/suit tie-breaks, five-card hierarchy, special straights |
| Legal moves | Complete unique move enumeration, opening rule, turns, PASS reset |
| Scoring | All multiplier boundaries, zero-sum totals, round completion |
| AI | Legal actions, reproducibility, hidden-hand isolation, difficulty behavior, fallback |
| Storage | Snapshot round-trip, corruption rejection, key isolation, graceful degradation |
| i18n | Matching keys, fallback, live document updates, safe interpolation |
| Audio | User-gesture unlock, gain pipeline, tracks, mute, SFX limits, fallback |

#### Maintenance rules

- Preserve the classic-script dependency order in `index.html`.
- Keep runtime resources local; do not introduce `fetch()`, dynamic imports, CDNs, or mandatory build/server steps.
- Put all visible UI text in all three language dictionaries.
- Keep rule/state code independent from DOM code and route state changes through `Game.applyAction()`.
- Add theme colors through shared CSS custom properties, then scope exceptional overrides narrowly.
- Treat table-play cards and the human hand as separate visual systems when changing card CSS.
- The optional screenshot helper at `skills/big-two-workshop/scripts/capture-ui.js` requires Node.js 22 and local Chrome, but it is a maintenance tool—not a game or deployment dependency.

[⬆ Back to language navigation](#top)

---

<a id="japanese"></a>

## 🇯🇵 日本語

### 🔖 クイックリンク

[ゲーム概要](#ja-overview) · [すぐに遊ぶ](#ja-quick-start) · [遊び方](#ja-gameplay) · [操作](#ja-controls) · [機能と設定](#ja-features) · [プログラム構成](#ja-program) · [ファイル分類](#ja-classification) · [状態と保存](#ja-storage) · [テスト](#ja-tests)

<a id="ja-overview"></a>

### 🌟 ゲーム概要

Big Two（大老二）は、ほかのプレイヤーより先に手札をすべて出すことを目指すゲームです。本プロジェクトは台湾式ルールを、ブラウザだけで完結するオフラインゲームとして実装しています。人間 1 名が Clover、Dia、Spade の 3 名の AI と対戦し、ルール判定、AI、画面、翻訳、音声、保存はすべて端末内で動作します。

| 項目 | 内容 |
| --- | --- |
| 🎮 モード | 1 人用：人間 1 名 vs. AI 3 名 |
| 🂠 デッキ | ジョーカーなしの標準 52 枚、各プレイヤー 13 枚 |
| 🧠 AI | かんたん・ふつう・むずかしい |
| 🌐 言語 | 繁體中文（`zh-Hant`）、English（`en`）、日本語（`ja`） |
| 🎨 テーマ | リアルグリーン、ミッドナイトネオン、さくらパステル、どうぶつパーティー |
| 🎵 オーディオ | 端末内で合成する BGM 4 曲と効果音 |
| 💾 保存 | `localStorage` に対局、設定、戦績、累積スコア、連勝を自動保存 |
| 📱 操作 | マウス、タッチ、キーボード |
| 🖥️ レイアウト | 幅 320 px のスマートフォンからタブレット、横向き端末、ワイド画面まで対応 |
| 📦 実行環境 | 素の HTML/CSS/JavaScript。npm、ビルド、サーバー、API、CDN、通信は不要 |

オンライン対戦、アカウント、クラウド同期、課金、広告、バックエンド、データベース、Service Worker は含まれていません。

<a id="ja-quick-start"></a>

### 🚀 すぐに遊ぶ

1. プロジェクト一式を、内部のフォルダー構成を変えずに保存します。
2. ルートの [`index.html`](index.html) をダブルクリックするか、ブラウザの **ファイルを開く** から選択します。
3. **ゲーム開始** を選びます。音声はブラウザの制限により、最初のクリック、タップ、または有効なキー操作のあとに開始します。

`npm install`、コンパイル、開発サーバー、環境変数、ログイン、ネット接続は必要ありません。

> ブラウザが `file://` ページの `localStorage` を禁止している場合でも現在のラウンドは遊べますが、ページを閉じたあとの設定保存や **ゲームを続ける** は利用できないことがあります。

#### 任意の静的ホスティング

任意の静的ホスティングにもそのまま配置できます。リポジトリの相対パスを保ってアップロードし、ルートの `index.html` を入口にしてください。ルート書き換え、サーバープログラム、データベース、API 設定は不要です。

<a id="ja-gameplay"></a>

### 🎯 遊び方

#### ラウンドの流れ

```text
シャッフルして 4 人へ 13 枚ずつ配る
              ↓
クラブの 3（3♣）を持つ人が最初に出す
              ↓
順番に、場より強い有効な役を出すかパスする
              ↓
3 人連続でパスすると場をクリアし、最後に出した人がリードする
              ↓
最初に手札をなくした人が勝ち、ラウンド得点を計算する
```

#### カードの強さ

| 分類 | 弱い → 強い |
| --- | --- |
| 数字 | `3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2` |
| スート | クラブ `♣ <` ダイヤ `♦ <` ハート `♥ <` スペード `♠` |

ルールエンジンでは `数字 × 4 + スート` のキーを使うため、まず数字を比較し、同じ数字ならスートで決めます。

#### 開始ルール

- 毎回、新しく配ったラウンドでは **クラブの 3（3♣）** を持つ人が先攻です。
- 最初は 1・2・3・5 枚の有効な役を自由に選べますが、必ず 3♣ を含めます。
- 場が空のリード中はパスできません。

#### 有効な役

| 枚数 | 役 | 条件 | 比較方法 |
| ---: | --- | --- | --- |
| 1 | シングル | 任意の 1 枚 | 数字、次にスート |
| 2 | ペア | 同じ数字 2 枚 | 数字、次にペア内の最強スート |
| 3 | スリーカード | 同じ数字 3 枚 | 3 枚組の数字のみ |
| 5 | ストレート | 許可された 10 種類の連続数字 | ストレート順位、次に代表カードのスート |
| 5 | フラッシュ | 同じスート 5 枚でストレートではないもの | スートを先に比較し、その後に数字を高い順で比較 |
| 5 | フルハウス | スリーカード + ペア | スリーカードの数字 |
| 5 | フォーカード | 同じ数字 4 枚 + 任意の 1 枚 | 4 枚組の数字 |
| 5 | ストレートフラッシュ | ストレートかつフラッシュ | ストレート順位、次にスート |

4 枚やその他の枚数は無効です。場にカードがある場合、返す役は場と**同じ枚数**でなければなりません。1・2・3 枚は同じ基本役同士で比較し、5 枚役だけは次の種類順で上位の役が下位の役に勝ちます。

```text
ストレート < フラッシュ < フルハウス < フォーカード < ストレートフラッシュ
```

5 枚役でシングル、ペア、スリーカードを倒すことはできず、枚数をまたぐ「爆弾」ルールはありません。

#### 有効なストレート一覧

強い順に次の 10 種類です。

| 順位 | 並び | 同じ並びを比較するときの代表カード |
| ---: | --- | --- |
| 1 | `2-3-4-5-6` | `2` |
| 2 | `A-2-3-4-5` | `2` |
| 3 | `10-J-Q-K-A` | `A` |
| 4 | `9-10-J-Q-K` | `K` |
| 5 | `8-9-10-J-Q` | `Q` |
| 6 | `7-8-9-10-J` | `J` |
| 7 | `6-7-8-9-10` | `10` |
| 8 | `5-6-7-8-9` | `9` |
| 9 | `4-5-6-7-8` | `8` |
| 10 | `3-4-5-6-7` | `7` |

`J-Q-K-A-2`、`Q-K-A-2-3`、`K-A-2-3-4` など、上表にない折り返しは無効です。

#### 手番・出す・パス

- 自分の手番では、場より強い有効な役を選んで **出す** を押します。
- 場に役があるときは、出せる役を持っていても **パス** を選べます。
- 一度パスしても、そのトリック全体から脱落するわけではありません。別の人があとでカードを出せば、次の自分の手番で再び出せます。
- 誰かがカードを出すたびに、連続パス数は 0 に戻ります。
- 最後の出札のあと 3 人連続でパスするとトリック終了です。場をクリアし、最後に出した人が新しいトリックをリードします。
- 出札とパスは取り消せません。
- 誰かの手札が 0 枚になった時点で、ラウンドは直ちに終了します。

#### ラウンド得点

敗者は残り枚数に応じて減点されます。

| 残り枚数 | 減点 |
| ---: | ---: |
| 1～7 枚 | 1 枚につき 1 点 |
| 8～10 枚 | 1 枚につき 2 点 |
| 11～12 枚 | 1 枚につき 3 点 |
| 13 枚 | 52 点 |

勝者は 3 人分の減点合計を獲得し、各敗者は自分の分を失います。4 人のラウンド得点変化の合計は常に 0 です。累積スコアはマイナスになることがあり、次のラウンドへ引き継がれます。

#### AI の強さ

どの AI も、自分の手札、公開されている残り枚数、場札、公開行動履歴だけを使い、相手の隠し手札は見ません。有効な返しがあるときはカードを出し、返せないときだけパスします。

| 難易度 | 実際の方針 |
| --- | --- |
| 🌱 かんたん | 有効手を弱い順に重み付き抽選し、弱い手を選びやすくします。リード中はシングルとペアの重みがさらに増えます。変化はありますが、組み合わせを崩すことがあります。 |
| 🌿 ふつう | 出した後の手札を最少何手でなくせるか推定し、ペア・スリーカード・フォーカードの分断を避け、高い制御札を温存します。相手が 1～2 枚なら妨害を強めます。 |
| 🌳 むずかしい | ふつうを基礎に、公開出札の記憶、相手の残り枚数、孤立札、組み合わせ破壊、主導権を評価します。探索は 6,000 ノード・450 ms が上限で、超えた場合は安全に「ふつう」へ戻ります。 |

同点候補は注入された再現可能 RNG で決めるため、同じ状態・難易度・RNG 状態なら同じ判断になります。画面上の思考時間は、アニメーション有効時がおよそ 350～700 ms、無効時が 50 ms です。

<a id="ja-controls"></a>

### 🕹️ 操作と画面

#### マウス・タッチ

| 操作 | 方法 |
| --- | --- |
| 選択／解除 | カードをクリックまたはタップ |
| 出す | 有効な組み合わせを選び、**出す** を押す |
| パス | 場が空でないときに **パス** を押す |
| ヒント | **ヒント** を押すと「ふつう」AI の方針で候補を選択 |
| 選択解除 | **選択解除** を押す |
| 並べ替え | **数字順／スート順**を切り替える。表示順だけが変わる |
| 狭い画面で手札を見る | 手札領域を横方向にスクロール |
| ホームへ戻る | **ホームへ戻る** を押して確認する。先に安定状態を保存 |

選択中のカードが現在のルールで有効な場合だけ **出す** ボタンが有効になります。無効な操作はゲーム状態を変更せずに拒否されます。

#### キーボード

| キー | 動作 |
| --- | --- |
| `Tab` / `Shift+Tab` | 操作可能な要素の間を移動 |
| `←` / `→` | 手札内のフォーカスを移動 |
| `Space` / `Enter` | カードの選択／解除、またはボタン実行 |
| `P` | 可能なときにパス |
| `H` | ヒント |
| `Escape` | ダイアログを閉じる、または選択をすべて解除 |

テキスト入力、セレクト、スライダーにフォーカスがあるときはゲーム用ショートカットを横取りしません。スライダーはブラウザ標準の方向キー操作を利用できます。

#### 画面一覧

| 画面 | 主な機能 |
| --- | --- |
| 🏠 ホーム | 新規ゲーム、保存済みゲームの再開、遊び方、設定、バージョン表示 |
| 🃏 ゲームテーブル | ラウンド、累積スコア、難易度、手番、4 座席、残り枚数、場札、手札、操作ボタン |
| 📖 遊び方 | 目的、強さ、役、ストレート、パス、得点、AI、保存、設定、キーボード操作 |
| ⚙️ 設定 | 難易度、テーマ、言語、アニメーション、BGM、効果音、音量、曲、全データ初期化 |
| 🏆 結果 | 勝者、順位、残り枚数、ラウンド得点、累積スコア、連勝、次ラウンド、ホーム |

<a id="ja-features"></a>

### ✨ 機能と設定

| 分類 | 設定内容 |
| --- | --- |
| ゲーム | かんたん／ふつう／むずかしい |
| 表示 | 4 テーマ、3 言語、アニメーション切り替え |
| BGM | オン／オフ、5 刻みの 0～100%、自動ローテーションまたは曲指定 |
| 効果音 | BGM と独立したオン／オフ、5 刻みの 0～100% |
| データ | 確認後、進行中ゲーム、累積スコア、戦績、設定、音量通知状態を初期化 |

BGM は **朝の散歩**、**さくらステップ**、**星空パレード**、**キャンディーパーティー** の 4 曲です。Web Audio API で端末内生成され、音声ファイルのダウンロードやストリーミングはありません。Web Audio 非対応でもゲームは続行でき、音声設定だけが無効になります。

言語は保存済み設定を最優先し、次にブラウザ言語から繁體中文・日本語・English を検出し、最後は繁體中文へ戻ります。切り替え時は表示文字、ページタイトル、ルートの `lang`、アクセシビリティ用ラベルが即時更新されます。

<a id="ja-program"></a>

### 🧩 プログラム紹介と構成

#### 技術プロファイル

| 層 | 実装 |
| --- | --- |
| HTML | 1 つの実行入口。順序付きの通常 `<script defer>` と CSS を読み込む |
| CSS | 基本トークン、共通部品、画面別、テーマ別、レスポンシブ別に分離 |
| JavaScript | IIFE で包んだ Vanilla JavaScript を 1 つの `window.BigTwo` 名前空間に公開 |
| 状態 | `Game.applyAction` が検証後に deep clone し、新しい `GameState` を返す |
| ルール | DOM に依存しないカード、デッキ、役判定、比較、合法手、得点関数 |
| 保存 | バージョン付き `localStorage`、正規化済み設定、検証済みスナップショット |
| 音声 | ユーザー操作で解放する Web Audio 合成、ゲイン、コンプレッサー、リミッター |
| テスト | `file://` から直接開く、外部依存なしのブラウザテストランナー |

`package.json`、lockfile、バンドラー、トランスパイラー、フレームワーク、Docker、Service Worker、実行時モジュールローダー、`fetch()` 依存、外部アセットはありません。

#### 読み込み順

[`index.html`](index.html) の順序は依存関係そのものなので維持する必要があります。

```text
config
  → utils
  → i18n エンジンと辞書
  → storage
  → audio ライブラリと manager
  → core ルール
  → AI 戦略
  → game 状態／controller
  → UI controller／renderer
  → screen builder
  → app.js
```

各モジュールは次の名前空間へ登録されます。

```text
window.BigTwo
├─ Config / Utils / I18n
├─ SaveSchema / Storage / Audio
├─ Card / Deck / Rules
├─ AI / Game
├─ UI / Screens
└─ App
```

#### 実行時データフロー

```text
DOMContentLoaded
  → BigTwo.App.init()
  → 設定・戦績・再開用スナップショットを読む
  → 言語・テーマ・音声・Router・Dialog・Toast・Animation を初期化
  → Home / Game / Help / Settings / Results を登録
  → Home を描画

人間の操作
  → game-screen
  → App.dispatchHuman()
  → Game.validateAction() + Rules
  → Game.applyAction() が複製した次状態を返す
  → 自動保存 → 再描画 → ensureAITurn()

AI の操作
  → Rules.getLegalMoves()
  → AI.chooseAction(difficulty, injected RNG)
  → 人間と同じ Game.applyAction() を通る
```

人間と AI は同じ検証・状態遷移入口を使います。ラウンド終了時は `Rules.scoreRound()` が累積スコアを更新し、戦績を保存して終了済み active save を削除し、Results へ移動します。

<a id="ja-classification"></a>

### 🗂️ プログラムとファイルの分類

#### JavaScript

| 分類 | 責務 | 主なファイル |
| --- | --- | --- |
| `js/config/` | アプリ／schema バージョン、数字、スート、役強度、保存キー、初期値、テーマ情報 | `constants.js`, `themes.js` |
| `js/utils/` | deep clone/equality、安定 stringify、組み合わせ、seed RNG、検証、設定正規化 | `helpers.js`, `rng.js`, `validation.js` |
| `js/i18n/` | 言語検出、エスケープ／補間、数値／日時形式、即時切替、3 辞書 | `i18n.js`, `zh-Hant.js`, `en.js`, `ja.js` |
| `js/storage/` | 安全な `localStorage`、戦績、スナップショット、checksum、完全状態検証 | `storage.js`, `save-schema.js` |
| `js/audio/` | Web Audio の生存期間、BGM シーケンス、効果音、音量／曲変更 | `audio-manager.js`, `music-library.js`, `sfx-library.js` |
| `js/core/` | Card/Deck、シャッフル／配布、役判定、比較、合法手、得点 | `card.js`, `deck.js`, `hand-evaluator.js`, `hand-comparator.js`, `legal-moves.js`, `scoring.js` |
| `js/ai/` | 共通プランナー／評価と 3 難易度の選択方針 | `ai-common.js`, `ai-easy.js`, `ai-normal.js`, `ai-hard.js` |
| `js/game/` | `GameState`、行動検証／適用、手番照会、controller 自動保存 | `game-state.js`, `game-controller.js`, `turn-controller.js`, `save-controller.js` |
| `js/ui/` | Router、カード／テーブル描画、アニメーション、Dialog、Toast | `router.js`, `card-renderer.js`, `table-renderer.js`, `animation-controller.js`, `dialog-controller.js`, `toast-controller.js` |
| `js/screens/` | Home、Game、Help、Settings、Results の DOM と操作 | `*-screen.js` |
| `js/app.js` | 起動、画面遷移、AI 手番、保存、設定、音声、結果を統括 | `app.js` |

#### CSS

| 分類 | 責務 |
| --- | --- |
| `css/base/` | Reset、デザイントークン、文字、アクセシビリティ、共通アニメーション |
| `css/components/` | ボタン、カード、コントロール、モーダル、スライダー、Toast、座席 |
| `css/screens/` | Home、Game、Help、Settings、Results のレイアウト |
| `css/themes/` | Realistic、Midnight、Sakura、Cute Party の色と装飾 |
| `css/responsive/` | Desktop（`≥1024`）、Tablet（`768–1023`）、Mobile（`≤767`）、狭幅、低い横向き |

CSS は **base → components → screens → themes → desktop → tablet → mobile → landscape** の順で読み込みます。後方のテーマ・レスポンシブ規則が前方の共通部品を意図的に調整します。

#### リポジトリ構成

```text
Big_Two/
├─ index.html                    # ゲーム入口とローカル依存の順序
├─ spec.md                       # 製品・ルール・UI・受入仕様
├─ README.md                     # 本 3 言語ガイド
├─ css/
│  ├─ base/                      # Reset、変数、文字、a11y、animation
│  ├─ components/                # 共通 UI 部品
│  ├─ screens/                   # 画面別スタイル
│  ├─ themes/                    # 4 テーマ
│  └─ responsive/                # Desktop、Tablet、Mobile、Landscape
├─ js/
│  ├─ config/                    # 定数、テーマ
│  ├─ utils/                     # Helper、RNG、validation
│  ├─ i18n/                      # 翻訳エンジン、辞書
│  ├─ storage/                   # Save schema、local storage
│  ├─ audio/                     # BGM/SFX 合成、manager
│  ├─ core/                      # Deck、完全なルールエンジン
│  ├─ ai/                        # 3 難易度
│  ├─ game/                      # 状態、手番 controller
│  ├─ ui/                        # 再利用 renderer/controller
│  ├─ screens/                   # 5 画面 builder
│  └─ app.js                     # 実行時 coordinator
├─ tests/
│  ├─ index.html                 # オフラインテスト入口
│  ├─ framework/                 # 小さなローカル test runner
│  ├─ css/                       # Runner のスタイル
│  └─ specs/                     # 9 分類のテスト
└─ skills/                       # 任意の保守ガイド。ゲーム実行時には不使用
   ├─ big-two-workshop/          # プロジェクト保守・画面確認 workflow
   └─ multilingual-commit/       # 英語・日本語・中国語の commit workflow
```

実行時に外部画像・音声ディレクトリは使いません。アバターと装飾は inline SVG/CSS、BGM と効果音はプログラムで生成します。

#### 主な API

| API | 用途 |
| --- | --- |
| `BigTwo.Rules.classifyHand(cards)` | 選択した役を検証・分類 |
| `BigTwo.Rules.compareHands(candidate, table)` | 互換性のある 2 役を比較 |
| `BigTwo.Rules.canBeat(candidate, table)` | 安全な真偽値の勝敗判定 |
| `BigTwo.Rules.getLegalMoves(hand, table, context)` | 全有効手を重複なしで列挙 |
| `BigTwo.Rules.scoreRound(players, winnerId)` | 合計 0 のラウンド得点を生成 |
| `BigTwo.Game.createNewGame(options)` | シャッフル、配布、3♣ 所持者、初期状態を生成 |
| `BigTwo.Game.validateAction(state, action)` | 出札、パス、次ラウンドを検証 |
| `BigTwo.Game.applyAction(state, action)` | 新状態を返すか `GameActionError` を送出 |
| `BigTwo.AI.chooseAction(state, playerId, difficulty, rng)` | 合法な AI 行動を選択 |
| `BigTwo.Storage.saveActiveGame(state)` | 再開可能な検証済みスナップショットを保存 |
| `BigTwo.Storage.loadActiveGame()` | `ok` / `empty` / `invalid` / `unavailable` の結果を返す |
| `BigTwo.I18n.t(key, values)` | UI 文言を翻訳し安全に補間 |
| `BigTwo.App` | 画面、人間／AI 手番、設定、音声、保存、結果を統括 |

<a id="ja-storage"></a>

### 💾 ゲーム状態・行動・保存

`GameState` は、4 プレイヤー、現在手番、場札と役判定、最後に出した人、連続パス、3♣ 必須状態、ラウンド番号、再現可能 RNG、行動履歴、AI 難易度、累積スコア、ラウンド結果を保持します。

状態を変える行動は次の 3 種類です。

```js
{ type: 'PLAY_CARDS', playerId, cardIds }
{ type: 'PASS', playerId }
{ type: 'START_NEXT_ROUND' }
```

不正な行動は機械判定可能な `code` を持つ `GameActionError` になります。検証は複製・変更より先に行われるため、元の状態と行動履歴は変わりません。

#### ローカル保存キー

| キー | 内容 |
| --- | --- |
| `bigTwo.settings.v1` | 難易度、テーマ、言語、アニメーション、BGM/SFX、音量、曲 |
| `bigTwo.activeGame.v1` | バージョン付き進行中 `GameState` |
| `bigTwo.statistics.v1` | 対局、勝敗、現在／最高連勝、総得点、難易度別勝利 |
| `bigTwo.audioNoticeSeen.v1` | 初回音量通知を表示済みか |

スナップショットには `schemaVersion`、ISO 8601 の `savedAt`、`appVersion`、完全な `gameState`、安定 checksum が入ります。読み込み時は schema、4 人と座席、52 枚の一意性、枚数、行動形式と順番、3♣ の初手、3 回パス、現在手番、場の役、phase、時刻、checksum を検証します。破損した active save は拒否・削除しますが、設定や戦績は残します。

新規配布後、人間／AI の有効な出札・パス後、ホームへ戻る前、次ラウンド開始後、ページが hidden になったときに安定状態を保存します。終了済みラウンドは **ゲームを続ける** の候補になりません。

<a id="ja-accessibility"></a>

### ♿ アクセシビリティとレスポンシブ対応

- 意味のある `main`、`nav`、`section`、`button`、`table`、dialog 構造。
- 本文スキップリンク、明確な `:focus-visible`、polite/assertive live region、翻訳済み accessible name。
- カード名は数字、スート、選択状態を読み上げ、相手は公開残り枚数だけを通知。
- Dialog のフォーカストラップと、閉じた後のフォーカス復元。
- `prefers-reduced-motion` と forced-colors を支援。
- 48 px のタッチ基準、safe-area、dynamic viewport height、横スクロール手札、下部操作領域を考慮。
- Desktop、Tablet、Mobile、狭幅 Mobile、低い Landscape の専用配置。ブラウザズームは無効化しません。

<a id="ja-tests"></a>

### 🧪 テストと保守

ブラウザで [`tests/index.html`](tests/index.html) を直接開き、画面の **「執行全部測試」（すべてのテストを実行）** を押します。Node.js、パッケージマネージャー、サーバー、外部ライブラリは不要です。

| テスト分類 | 対象 |
| --- | --- |
| Deck | 52 枚の一意性、seed shuffle、13 枚配布、3♣ 先攻 |
| Rules | 全役、10 ストレート、無効役、非破壊性 |
| Comparator | 数字／スート、5 枚役順、特殊ストレート |
| Legal moves | 全合法手、初手、手番、パス解除 |
| Scoring | 全倍率境界、ゼロサム、ラウンド終了 |
| AI | 合法性、再現性、隠し手札隔離、難易度、fallback |
| Storage | 往復保存、破損拒否、キー分離、安全な縮退 |
| i18n | 同一キー、fallback、即時更新、安全な補間 |
| Audio | 操作後解放、gain pipeline、曲、mute、SFX 制限、fallback |

#### 保守時の原則

- `index.html` の通常 script 読み込み順を維持します。
- 実行時資源はローカルに保ち、`fetch()`、dynamic import、CDN、必須 build/server を追加しません。
- 表示文言は 3 言語の辞書すべてへ追加します。
- ルール／状態を DOM から分離し、状態変更を `Game.applyAction()` に集約します。
- テーマ色は共通 CSS custom properties から変更し、例外 selector は狭く限定します。
- カード CSS では、場に出たカードと人間の手札を別の表示システムとして扱います。
- `skills/big-two-workshop/scripts/capture-ui.js` は任意の画面確認ツールで、Node.js 22 とローカル Chrome を必要としますが、ゲーム実行・配布には不要です。

[⬆ 言語ナビゲーションへ戻る](#top)

---

<a id="traditional-chinese"></a>

## 🇹🇼 繁體中文

### 🔖 快速導覽

[遊戲介紹](#zh-overview) · [快速開始](#zh-quick-start) · [遊戲玩法](#zh-gameplay) · [操作方式](#zh-controls) · [功能與設定](#zh-features) · [程式介紹](#zh-program) · [程式分類](#zh-classification) · [狀態與存檔](#zh-storage) · [測試](#zh-tests)

<a id="zh-overview"></a>

### 🌟 遊戲介紹

《Big Two／台灣大老二》是一款搶先出完手牌的撲克牌遊戲。本專案將台灣常見規則實作成完全離線的瀏覽器遊戲，由一名真人玩家對戰 Clover、Dia、Spade 三名 AI。規則判定、AI 決策、畫面、翻譯、音樂、音效與存檔都在本機完成。

| 項目 | 內容 |
| --- | --- |
| 🎮 模式 | 單機遊戲：1 名真人對戰 3 名 AI |
| 🂠 牌組 | 標準 52 張撲克牌，不含鬼牌，每人 13 張 |
| 🧠 AI | 簡單、普通、困難 |
| 🌐 語言 | 繁體中文（`zh-Hant`）、English（`en`）、日本語（`ja`） |
| 🎨 主題 | 擬真綠桌、午夜霓虹、櫻花粉彩、可愛動物派對 |
| 🎵 音訊 | 四首本機合成 BGM 與程式化音效 |
| 💾 保存 | 使用 `localStorage` 自動保存牌局、設定、戰績、累積分數與連勝 |
| 📱 操作 | 滑鼠、觸控、鍵盤 |
| 🖥️ 版面 | 從 320 px 手機到平板、橫向裝置與寬螢幕桌面皆可使用 |
| 📦 執行方式 | 純 HTML、CSS、JavaScript；不需 npm、建置、伺服器、API、CDN 或網路 |

本專案不包含線上多人、帳號、雲端同步、付費、廣告、後端、資料庫或 Service Worker。

<a id="zh-quick-start"></a>

### 🚀 快速開始

1. 下載或複製完整專案，保留所有資料夾與相對路徑。
2. 直接雙擊根目錄的 [`index.html`](index.html)，或使用瀏覽器的「開啟檔案」功能選取它。
3. 選擇「開始遊戲」。基於瀏覽器限制，音訊會在第一次點擊、觸控或有效鍵盤操作後才開始。

完成以上步驟即可遊玩，不需要 `npm install`、編譯、開發伺服器、環境變數、登入或網路連線。

> 如果瀏覽器封鎖 `file://` 頁面的 `localStorage`，目前牌局仍可正常完成，但關閉頁面後可能無法保留設定，也無法使用「繼續遊戲」。

#### 選用：靜態網站部署

也可以放到任何靜態網站服務。只需完整上傳專案並保留相對路徑，以根目錄 `index.html` 作為入口；不需要 rewrite、伺服器程式、資料庫或 API 設定。

<a id="zh-gameplay"></a>

### 🎯 遊戲玩法

#### 單局流程

```text
洗牌並發給四名玩家各 13 張
              ↓
持有梅花 3（3♣）的玩家先出
              ↓
依序打出更強的合法牌型，或選擇 PASS
              ↓
三家連續 PASS 後清空桌面，由最後出牌者取得新墩先手
              ↓
最先出完手牌者獲勝，接著計算本局分數
```

#### 牌點與花色強弱

| 分類 | 由小到大 |
| --- | --- |
| 點數 | `3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2` |
| 花色 | 梅花 `♣ <` 方塊 `♦ <` 紅心 `♥ <` 黑桃 `♠` |

規則引擎使用 `點數 × 4 + 花色` 的牌張鍵值，因此先比較點數，點數相同時才以花色決勝。

#### 首手規則

- 每次重新發牌後，由持有 **梅花 3（3♣）** 的玩家先手。
- 第一手可以出任一合法的 1、2、3 或 5 張牌型，但必須包含梅花 3。
- 桌面為空的新墩先手不能 PASS。

#### 合法牌型

| 張數 | 牌型 | 組成條件 | 比較方式 |
| ---: | --- | --- | --- |
| 1 | 單張 | 任一張牌 | 先比點數，再比花色 |
| 2 | 對子 | 兩張相同點數 | 先比點數，再比對子中最大的花色 |
| 3 | 三條 | 三張相同點數 | 只比較三條點數 |
| 5 | 順子 | 十種合法連續點數之一 | 順子順位，再比代表牌花色 |
| 5 | 同花 | 五張同花色，但不是順子 | 先比花色，再由大到小逐張比點數 |
| 5 | 葫蘆 | 一組三條加一組對子 | 比較三條點數 |
| 5 | 鐵支 | 四張相同點數加任一單張 | 比較四張組的點數 |
| 5 | 同花順 | 同時為順子與同花 | 順子順位，再比花色 |

四張牌及其他張數都不合法。桌面有牌時，回應必須與桌面使用**相同張數**；單張、對子、三條只能用相同基本牌型回應。五張牌型可依下列強度跨類型壓牌：

```text
順子 < 同花 < 葫蘆 < 鐵支 < 同花順
```

較強的五張牌型可直接壓過較弱的五張牌型，但五張牌不能壓單張、對子或三條；本規則沒有跨張數的「炸彈」。

#### 全部合法順子

十種順子由強到弱如下：

| 順位 | 組合 | 同組合比花色時的代表牌 |
| ---: | --- | --- |
| 1 | `2-3-4-5-6` | `2` |
| 2 | `A-2-3-4-5` | `2` |
| 3 | `10-J-Q-K-A` | `A` |
| 4 | `9-10-J-Q-K` | `K` |
| 5 | `8-9-10-J-Q` | `Q` |
| 6 | `7-8-9-10-J` | `J` |
| 7 | `6-7-8-9-10` | `10` |
| 8 | `5-6-7-8-9` | `9` |
| 9 | `4-5-6-7-8` | `8` |
| 10 | `3-4-5-6-7` | `7` |

`J-Q-K-A-2`、`Q-K-A-2-3`、`K-A-2-3-4` 等不在表內的跨界組合都不合法。

#### 回合、出牌與 PASS

- 輪到你時，選取能壓過桌面牌組的合法牌型，再按「出牌」。
- 桌面有牌時，即使手中有牌可壓，也可以主動選擇 PASS。
- PASS 不會讓玩家永久退出該墩；如果之後有人成功出牌，先前 PASS 的玩家下一次輪到時仍可再次出牌。
- 任一玩家成功出牌後，連續 PASS 計數會歸零。
- 最後一次成功出牌後，其他三家連續 PASS，該墩結束；桌面清空，由最後出牌者取得新墩先手。
- 出牌與 PASS 都不能復原。
- 任一玩家出完最後一張牌時，本局立即結束。

#### 單局計分

失敗者依剩餘手牌扣分：

| 剩牌數 | 扣分 |
| ---: | ---: |
| 1–7 張 | 每張 1 分 |
| 8–10 張 | 每張 2 分 |
| 11–12 張 | 每張 3 分 |
| 13 張 | 52 分 |

勝者取得三名敗者的扣分總和，每名敗者扣除自己的分數，因此四人本局分數變化總和永遠是 0。累積分數可以是負數，並會保留到下一局。

#### AI 難度

所有 AI 只讀取自己的手牌、公開剩餘牌數、桌面牌與公開行動紀錄，不會查看對手的隱藏手牌。只要有合法回應就會出牌，沒有合法回應時才 PASS。

| 難度 | 實際策略 |
| --- | --- |
| 🌱 簡單 | 對由弱到強排列的合法行動進行加權隨機，較弱牌權重較高；先手時單張與對子再加權。出牌較有變化，但可能拆散組合。 |
| 🌿 普通 | 估算出牌後剩餘手牌最少需要幾手出完，避免拆對子、三條或鐵支，保留高控制牌；對手只剩 1–2 張時會提高攔截強度。 |
| 🌳 困難 | 在普通策略上加入公開出牌記憶、對手剩牌威脅、孤張與組合破壞成本、牌權控制。搜尋上限為 6,000 節點與 450 ms，超限時安全退回普通 AI。 |

同分候選使用可重現的注入式 RNG 決定，因此相同狀態、難度與 RNG 狀態會得到相同決策。畫面層的思考延遲在動畫開啟時約為 350–700 ms，關閉時為 50 ms。

<a id="zh-controls"></a>

### 🕹️ 操作方式與畫面

#### 滑鼠與觸控

| 操作 | 使用方式 |
| --- | --- |
| 選牌／取消 | 點擊或輕觸牌張 |
| 出牌 | 選好合法組合後按「出牌」 |
| PASS | 桌面不為空時按「PASS」 |
| 提示 | 按「提示」，以普通 AI 邏輯選取建議牌組 |
| 取消選牌 | 按「取消選牌」清除目前選取 |
| 排序 | 切換「依點數／依花色」；只改變顯示順序，不影響規則 |
| 窄螢幕瀏覽手牌 | 在手牌區水平捲動 |
| 返回主畫面 | 按「返回主畫面」並確認；系統會先保存穩定牌局 |

只有當選取牌張構成目前可執行的合法行動時，「出牌」按鈕才會啟用。非法操作會被拒絕，而且不會修改遊戲狀態。

#### 鍵盤

| 按鍵 | 功能 |
| --- | --- |
| `Tab` / `Shift+Tab` | 在可操作元件間移動 |
| `←` / `→` | 在自己的手牌間移動焦點 |
| `Space` / `Enter` | 選取／取消牌張，或啟動按鈕 |
| `P` | 合法時 PASS |
| `H` | 取得提示 |
| `Escape` | 關閉對話框，或取消全部選牌 |

當輸入欄位、下拉選單或音量滑桿取得焦點時，遊戲快捷鍵不會攔截輸入；滑桿保留瀏覽器原生方向鍵操作。

#### 畫面功能

| 畫面 | 主要用途 |
| --- | --- |
| 🏠 主畫面 | 開始新遊戲、繼續有效存檔、開啟遊戲說明、設定與查看版號 |
| 🃏 遊戲畫面 | 顯示局數、累積分數、難度、目前回合、四方座位、剩牌、桌面牌、玩家手牌與操作列 |
| 📖 遊戲說明 | 說明目標、牌點／花色、牌型、順子、PASS、計分、AI、存檔、客製化與鍵盤操作 |
| ⚙️ 設定 | 調整難度、主題、語言、動畫、BGM、音效、音量、曲目，或重設所有資料 |
| 🏆 結果畫面 | 顯示冠軍、名次、剩牌、本局分數、累積分數、連勝、再來一局與返回主畫面 |

<a id="zh-features"></a>

### ✨ 功能與設定

| 分類 | 選項與行為 |
| --- | --- |
| 遊戲 | 簡單／普通／困難 AI 難度 |
| 顯示 | 四套主題、三種語言、動畫開關 |
| BGM | 獨立開關、0–100%、每次 5%、自動輪播或指定曲目 |
| 音效 | 與 BGM 分開控制，獨立開關與 0–100% 音量 |
| 資料 | 確認後清除進行中牌局、累積分數、戰績、偏好與音量提示狀態 |

四首內建 BGM 為「晨光散步」、「櫻花跳步」、「星夜遊行」、「糖果派對」。它們以 Web Audio API 在本機產生，不會下載或串流音訊檔。音訊屬於選用功能；瀏覽器不支援 Web Audio 時仍可正常玩牌，只會停用音訊控制。

語言判斷順序為：已保存選項 → 瀏覽器語言中的繁體中文／日文／英文 → 繁體中文備援。切換語言會立即更新可見文字、頁面標題、根節點 `lang` 與翻譯後的無障礙標籤。

<a id="zh-program"></a>

### 🧩 程式介紹與架構

#### 技術概要

| 層級 | 實作方式 |
| --- | --- |
| HTML | 單一執行入口，以固定順序載入傳統 `<script defer>` 與樣式表 |
| CSS | 基礎 token、共用元件、各畫面、主題覆蓋、RWD 覆蓋分層管理 |
| JavaScript | 純 JavaScript，各檔案以 IIFE 包覆並掛在單一 `window.BigTwo` 命名空間 |
| 狀態 | `Game.applyAction` 先驗證、再 deep clone，回傳新的 `GameState` |
| 規則 | 牌張、牌組、牌型、比牌、合法行動與計分均不依賴 DOM |
| 儲存 | 版本化 `localStorage`、正規化設定、完整驗證的牌局快照 |
| 音訊 | 需使用者互動解鎖的 Web Audio 合成、gain、compressor 與 limiter |
| 測試 | 可由 `file://` 直接開啟、零外部依賴的瀏覽器測試工具 |

專案沒有 `package.json`、lockfile、bundler、transpiler、前端框架、Docker、Service Worker、執行期 module loader、`fetch()` 相依或遠端資源。

#### 程式載入順序

[`index.html`](index.html) 內的順序就是相依關係，必須保留：

```text
config
  → utils
  → i18n 引擎與三份字典
  → storage
  → audio 曲庫／音效與 manager
  → core 規則
  → AI 策略
  → game 狀態／controller
  → UI controller／renderer
  → screen builder
  → app.js
```

各模組統一註冊於：

```text
window.BigTwo
├─ Config / Utils / I18n
├─ SaveSchema / Storage / Audio
├─ Card / Deck / Rules
├─ AI / Game
├─ UI / Screens
└─ App
```

#### 執行期資料流

```text
DOMContentLoaded
  → BigTwo.App.init()
  → 讀取設定、戰績與可繼續牌局
  → 初始化語系、主題、音訊、Router、Dialog、Toast、Animation
  → 註冊 Home / Game / Help / Settings / Results
  → 顯示主畫面

真人操作
  → game-screen
  → App.dispatchHuman()
  → Game.validateAction() + Rules
  → Game.applyAction() 回傳複製後的新狀態
  → 自動存檔 → 重新渲染 → ensureAITurn()

AI 操作
  → Rules.getLegalMoves()
  → AI.chooseAction(difficulty, injected RNG)
  → 進入與真人相同的 Game.applyAction()
```

真人與 AI 共用同一個驗證及狀態轉移入口。單局結束時，`Rules.scoreRound()` 更新累積分數，接著保存戰績、清除已完成的 active save，最後由 Router 顯示結果畫面。

<a id="zh-classification"></a>

### 🗂️ 程式分類

#### JavaScript 模組

| 分類 | 職責 | 主要檔案 |
| --- | --- | --- |
| `js/config/` | App／schema 版號、點數、花色、牌型強度、儲存 key、預設值、主題資料 | `constants.js`, `themes.js` |
| `js/utils/` | 深層複製／比較、穩定序列化、組合、seed RNG、驗證與設定正規化 | `helpers.js`, `rng.js`, `validation.js` |
| `js/i18n/` | 語言偵測、安全插值、數字／日期格式、即時切換、三份字典 | `i18n.js`, `zh-Hant.js`, `en.js`, `ja.js` |
| `js/storage/` | 安全包裝 `localStorage`、戰績、快照、checksum 與完整狀態驗證 | `storage.js`, `save-schema.js` |
| `js/audio/` | Web Audio 生命週期、BGM 序列、音效、音量與曲目切換 | `audio-manager.js`, `music-library.js`, `sfx-library.js` |
| `js/core/` | Card／Deck、洗牌發牌、牌型判定、比牌、合法行動、計分 | `card.js`, `deck.js`, `hand-evaluator.js`, `hand-comparator.js`, `legal-moves.js`, `scoring.js` |
| `js/ai/` | 共用規劃／評分與簡單、普通、困難三種策略 | `ai-common.js`, `ai-easy.js`, `ai-normal.js`, `ai-hard.js` |
| `js/game/` | `GameState`、行動驗證／套用、回合查詢、controller 自動保存 | `game-state.js`, `game-controller.js`, `turn-controller.js`, `save-controller.js` |
| `js/ui/` | Router、牌張／牌桌渲染、動畫、Dialog、Toast | `router.js`, `card-renderer.js`, `table-renderer.js`, `animation-controller.js`, `dialog-controller.js`, `toast-controller.js` |
| `js/screens/` | 主畫面、遊戲、說明、設定、結果的 DOM 建立與互動 | `*-screen.js` |
| `js/app.js` | 啟動、導覽、AI 回合、存檔、設定、音訊與結果的應用層協調 | `app.js` |

#### CSS 分層

| 分類 | 職責 |
| --- | --- |
| `css/base/` | Reset、設計 token、字體、無障礙、共用動畫 |
| `css/components/` | 按鈕、牌張、控制項、對話框、滑桿、Toast、玩家座位 |
| `css/screens/` | 主畫面、遊戲、說明、設定、結果的版面 |
| `css/themes/` | 擬真、午夜、櫻花、可愛派對的顏色與裝飾覆蓋 |
| `css/responsive/` | 桌面（`≥1024`）、平板（`768–1023`）、手機（`≤767`）、窄手機、低高度橫向 |

CSS 載入順序為：**base → components → screens → themes → desktop → tablet → mobile → landscape**。後載入的主題與 RWD 規則會有意識地微調前面的共用元件。

#### 專案目錄

```text
Big_Two/
├─ index.html                    # 遊戲入口與本機相依載入順序
├─ spec.md                       # 產品、規則、UI 與驗收規格
├─ README.md                     # 本三語說明文件
├─ css/
│  ├─ base/                      # Reset、變數、字體、無障礙、動畫
│  ├─ components/                # 共用 UI 元件
│  ├─ screens/                   # 各畫面樣式
│  ├─ themes/                    # 四套主題
│  └─ responsive/                # 桌面、平板、手機、橫向
├─ js/
│  ├─ config/                    # 常數與主題
│  ├─ utils/                     # 輔助函式、RNG、驗證
│  ├─ i18n/                      # 翻譯引擎與字典
│  ├─ storage/                   # 存檔 schema 與本機儲存
│  ├─ audio/                     # BGM／音效合成與管理器
│  ├─ core/                      # 牌組與完整規則引擎
│  ├─ ai/                        # 三種 AI 難度
│  ├─ game/                      # 狀態與回合 controller
│  ├─ ui/                        # 可重用 renderer／controller
│  ├─ screens/                   # 五個畫面 builder
│  └─ app.js                     # 執行期協調中心
├─ tests/
│  ├─ index.html                 # 離線瀏覽器測試入口
│  ├─ framework/                 # 小型本機 test runner
│  ├─ css/                       # 測試畫面樣式
│  └─ specs/                     # 九類功能測試
└─ skills/                       # 選用維護指南，不屬於遊戲 runtime
   ├─ big-two-workshop/          # 專案維護與視覺檢查流程
   └─ multilingual-commit/       # 英文、日文、中文 commit 訊息流程
```

Runtime 沒有外部圖片或音訊資料夾；角色與裝飾由 inline SVG／CSS 產生，BGM 與音效則由程式合成。

#### 重要 API

| API | 用途 |
| --- | --- |
| `BigTwo.Rules.classifyHand(cards)` | 驗證並分類選取牌型 |
| `BigTwo.Rules.compareHands(candidate, table)` | 比較兩組相容牌型 |
| `BigTwo.Rules.canBeat(candidate, table)` | 安全回傳是否可壓牌 |
| `BigTwo.Rules.getLegalMoves(hand, table, context)` | 不重複列舉所有合法行動 |
| `BigTwo.Rules.scoreRound(players, winnerId)` | 建立總和為 0 的單局分數變化 |
| `BigTwo.Game.createNewGame(options)` | 洗牌、發牌、找出 3♣ 持有者並建立初始狀態 |
| `BigTwo.Game.validateAction(state, action)` | 驗證出牌、PASS 或下一局要求 |
| `BigTwo.Game.applyAction(state, action)` | 回傳新狀態，或拋出 `GameActionError` |
| `BigTwo.AI.chooseAction(state, playerId, difficulty, rng)` | 選擇合法 AI 行動 |
| `BigTwo.Storage.saveActiveGame(state)` | 驗證並寫入可繼續牌局快照 |
| `BigTwo.Storage.loadActiveGame()` | 回傳 `ok`、`empty`、`invalid` 或 `unavailable` 狀態 |
| `BigTwo.I18n.t(key, values)` | 翻譯並安全插入 UI 文字 |
| `BigTwo.App` | 協調畫面、真人／AI 回合、設定、音訊、存檔與結果 |

<a id="zh-storage"></a>

### 💾 遊戲狀態、行動與存檔

`GameState` 保存四名玩家、目前玩家索引、桌面牌與牌型判定、最後出牌者、連續 PASS、梅花 3 首手需求、局數、可重現 RNG 狀態、行動紀錄、AI 難度、累積分數及單局結果。

改變狀態的 action 只有三種：

```js
{ type: 'PLAY_CARDS', playerId, cardIds }
{ type: 'PASS', playerId }
{ type: 'START_NEXT_ROUND' }
```

非法 action 會拋出含機器可讀 `code` 的 `GameActionError`。因為驗證發生在複製與修改之前，原始 state 與 action history 都不會被更動。

#### 本機儲存 key

| Key | 保存內容 |
| --- | --- |
| `bigTwo.settings.v1` | 難度、主題、語言、動畫、BGM／音效開關與音量、曲目 |
| `bigTwo.activeGame.v1` | 版本化的進行中 `GameState` 快照 |
| `bigTwo.statistics.v1` | 場次、勝敗、目前／最佳連勝、總分、各難度勝場 |
| `bigTwo.audioNoticeSeen.v1` | 是否已顯示一次性音量提醒 |

牌局快照包含 `schemaVersion`、ISO 8601 `savedAt`、`appVersion`、完整 `gameState` 與穩定 checksum。載入時會驗證 schema、四名玩家與座位、52 張牌不重複、牌數、行動格式與順序、梅花 3 首手、三次 PASS 邏輯、目前玩家、桌面牌型、phase、時間欄位與 checksum。損毀的 active save 會被拒絕並清除，但不會刪除設定與戰績。

新局發牌後、每次真人／AI 合法出牌或 PASS 後、返回主畫面前、下一局開始後，以及頁面進入 hidden 狀態時，都會保存穩定的進行中狀態。已完成牌局不會出現在「繼續遊戲」。

<a id="zh-accessibility"></a>

### ♿ 無障礙與 RWD

- 使用語意化 `main`、`nav`、`section`、`button`、`table` 與 dialog 結構。
- 提供跳至主要內容連結、明顯的 `:focus-visible`、polite／assertive live region 與翻譯後的 accessible name。
- 牌張會朗讀點數、花色與選取狀態；對手只公開朗讀名稱與剩餘牌數，不暴露隱藏手牌。
- 對話框限制焦點，關閉後回到原觸發元件。
- 支援系統 `prefers-reduced-motion` 與 forced-colors。
- 以 48 px 觸控目標、safe-area、dynamic viewport height、可捲動手牌及底部操作列預留空間為基礎。
- 分別處理桌面、平板、手機、窄手機與低高度橫向版面，且沒有停用瀏覽器縮放。

<a id="zh-tests"></a>

### 🧪 測試與維護

直接用瀏覽器開啟 [`tests/index.html`](tests/index.html)，再按「執行全部測試」。本機測試工具不需要 Node.js、套件管理器、伺服器或外部函式庫。

| 測試分類 | 涵蓋內容 |
| --- | --- |
| Deck | 52 張唯一牌、seed 洗牌、每人 13 張、3♣ 先手 |
| Rules | 全部牌型、十種順子、非法牌型、不修改輸入 |
| Comparator | 點數／花色決勝、五張強度、特殊順子 |
| Legal moves | 完整合法行動、首手、回合、PASS 重設 |
| Scoring | 所有倍率邊界、零和計分、單局完成 |
| AI | 合法性、可重現性、隱藏手牌隔離、難度行為、fallback |
| Storage | 快照往返、損毀拒絕、key 隔離、安全降級 |
| i18n | 三語 key 一致、fallback、即時更新、安全插值 |
| Audio | 使用者互動解鎖、gain 管線、曲目、靜音、音效限制、fallback |

#### 維護原則

- 保留 `index.html` 傳統 script 的相依載入順序。
- Runtime 資源維持本機化，不加入 `fetch()`、dynamic import、CDN 或必要的 build／server 步驟。
- 所有可見 UI 文字都必須同步加入三份語系字典。
- 規則與狀態程式不依賴 DOM，所有狀態改變統一經過 `Game.applyAction()`。
- 主題顏色優先使用共用 CSS custom properties，例外覆蓋應縮小 selector 範圍。
- 調整牌張 CSS 時，桌上出牌與玩家手牌必須視為兩套獨立的視覺系統。
- `skills/big-two-workshop/scripts/capture-ui.js` 是選用畫面擷取工具，需要 Node.js 22 與本機 Chrome，但不屬於遊戲執行或部署相依。

[⬆ 返回語言導覽](#top)
