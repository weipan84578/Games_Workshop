<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-FF6FA5?style=for-the-badge&logo=github" alt="version"/>
  <img src="https://img.shields.io/badge/Pure_Frontend-HTML%20%2B%20CSS%20%2B%20JS-FFB300?style=for-the-badge&logo=html5" alt="tech"/>
  <img src="https://img.shields.io/badge/No_Build_Required-✓-4CAF6D?style=for-the-badge" alt="no build"/>
  <img src="https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-2196C9?style=for-the-badge&logo=responsive" alt="responsive"/>
</p>

<h1 align="center">🐙 Takoyaki Master 🐙</h1>

<p align="center">
  <strong>章魚燒大師 ｜ たこ焼きマスター ｜ Takoyaki Master</strong>
</p>

<p align="center">
  🎮 A cute Japanese-style takoyaki cooking simulation game<br/>
  🎮 可愛い日系たこ焼き料理シミュレーションゲーム<br/>
  🎮 可愛日系風章魚燒料理模擬小遊戲
</p>

---

## 🌐 Language / 言語 / 語言

> 🔗 Quick jump to your preferred language / お好みの言語にジャンプ / 快速跳到你要的語言

| 🌍 Language | 📖 Link |
|:-----------:|:-------:|
| 🇺🇸 English | [👉 Jump to English](#-english) |
| 🇯🇵 日本語 | [👉 日本語へ](#-日本語) |
| 🇹🇼 繁體中文 | [👉 跳到中文](#-繁體中文) |

---

<a id="-english"></a>

# 🇺🇸 English

## 📑 Table of Contents

- [🎯 Game Introduction](#-game-introduction)
- [🎮 How to Play](#-how-to-play)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Architecture](#️-project-architecture)
- [📂 File Classification](#-file-classification)
- [🎨 Theme System](#-theme-system)
- [🌐 Internationalization (i18n)](#-internationalization-i18n)
- [🔊 Audio System](#-audio-system)
- [📱 Responsive Design](#-responsive-design)
- [⭐ Scoring System](#-scoring-system)
- [🛠️ Tech Stack](#️-tech-stack)

---

### 🎯 Game Introduction

**Takoyaki Master** is a pure frontend casual cooking simulation game. You play as a takoyaki stall owner, experiencing the full takoyaki-making process — from pouring batter to serving the finished product! 🍢

The game features a **cute Japanese festival stall** aesthetic, with simple and intuitive controls suitable for all ages. Play on mobile or desktop — no installation required!

#### ✨ Key Features

| Feature | Description |
|:-------:|:------------|
| 🎨 5 Cute Themes | Pink, Ocean Blue, Sunny Yellow, Matcha Green, Night Purple |
| 🌐 3 Languages | Japanese 🇯🇵 / English 🇺🇸 / Traditional Chinese 🇹🇼 |
| 📱 Responsive | Mobile (portrait & landscape), Tablet, Desktop |
| 🎵 Original BGM | Cheerful piano melodies with Web Audio API |
| 💾 Auto Save | Progress saved to localStorage automatically |
| 🏆 4 Levels | Progressively harder with 6→8→10→12 slots |
| 🎪 No Server Needed | Just double-click `index.html` and play! |
| ♿ Accessible | ARIA labels, keyboard navigable, WCAG AA contrast |

---

### 🎮 How to Play

The complete takoyaki-making process has **7 steps**:

| Step | Icon | Action | Description |
|:----:|:----:|:------:|:------------|
| 1️⃣ | 🥄 | **Pour Batter** | Click on empty slots to pour batter |
| 2️⃣ | 🐙 | **Add Octopus** | Place octopus pieces into the batter |
| 3️⃣ | 🧅 | **Add Toppings** | Add green onion, pickled ginger, or tenkasu |
| 4️⃣ | ⏱️ | **Flip** | Watch for color changes — flip at the right time! |
| 5️⃣ | 🍽️ | **Plate** | Remove cooked takoyaki from the stove |
| 6️⃣ | 🍯 | **Add Sauce** | Drizzle sauce to finish the takoyaki |
| 7️⃣ | ⭐ | **Score** | Earn 1-3 stars based on your performance |

#### 🔄 Takoyaki State Machine

```
🥚 Empty → 🟡 Raw → 🟠 Half-cooked → [Flip!] → 🔶 Flipped
    → 🟤 Cooked → [Plate!] → 🍽️ Plated → [Sauce!] → ✅ Done!

⚠️ Warning: If you don't flip/plate in time → 🔥 Burnt! (-35 pts)
```

#### 📊 Level Progression

| Level | Slots | Target | Time | Topping | Sauce |
|:-----:|:-----:|:------:|:----:|:-------:|:-----:|
| 🏮 Lv.1 | 6 | 6 | 110s | 🧅 Green Onion | 🍯 Classic |
| 🏮 Lv.2 | 8 | 8 | 120s | 🥓 Beni Shoga | 🧂 Mayo |
| 🏮 Lv.3 | 10 | 10 | 135s | ✨ Tenkasu | 🍯 Classic |
| 🏮 Lv.4 | 12 | 12 | 150s | 🌈 Mixed | 🍯 Special |

#### 🗑️ Burnt Takoyaki

If a takoyaki burns, use the **Discard 🗑️** tool to clear the slot and start over!

---

### 🚀 Quick Start

```bash
# No build, no npm, no server required!
# Simply open the file in your browser:

# Option 1: Double-click
index.html

# Option 2: Use a local server (optional, for best experience)
npx serve .
```

> 💡 **Tip**: The game works perfectly by just opening `index.html` directly. No installation needed!

---

### 🏗️ Project Architecture

```
🐙 takoyaki/
│
├── 📄 index.html              ← Single entry point (imports only)
│
├── 🎨 css/                    ← All stylesheets
│   ├── 🧱 base/               ← Reset, variables, typography
│   ├── 📐 layout/             ← Layout skeleton & responsive
│   ├── 🧩 components/         ← Buttons, modals, HUD, icons
│   ├── 🌈 themes/             ← 5 color theme files
│   ├── 📑 pages/              ← Page-specific styles
│   └── 📋 main.css            ← Master import file
│
├── ⚡ js/                     ← All JavaScript modules
│   ├── 🔧 core/               ← Config, state, storage, events
│   ├── 🌐 i18n/               ← Language dictionaries & engine
│   ├── 🔊 audio/              ← Audio manager & playlists
│   ├── 🖥️ ui/                 ← Screen manager, menus, settings
│   ├── 🎮 game/               ← Game loop, slots, scoring
│   └── 🚀 app.js              ← Boot loader
│
├── 📦 assets/                 ← Static assets
│   ├── 🖼️ images/             ← UI, characters, ingredients
│   ├── 🎵 audio/              ← BGM & SFX files
│   └── 🔤 fonts/              ← Local fonts (zh/jp/en)
│
├── 📊 data/                   ← Game data (JSON)
│   ├── 📋 levels.json         ← Level configurations
│   └── 🏆 achievements.json   ← Achievement definitions
│
└── 🧪 tests/                  ← Test files
    └── 🔬 static-tests.mjs    ← Static analysis tests
```

---

### 📂 File Classification

#### 🔧 Core System (`js/core/`)

| File | Size | Description |
|:-----|:----:|:------------|
| ⚙️ `config.js` | 2.8KB | Global constants: themes, tools, slot timings, level data, how-to steps |
| 📡 `event-bus.js` | 571B | Pub/Sub event system — `on()`, `off()`, `emit()` for inter-module communication |
| 💾 `storage.js` | 1.6KB | localStorage wrapper — save/load settings, progress, and feature flags |
| 🗄️ `state.js` | 1.6KB | Centralized state management — screen, settings, game state, tool selection |

#### 🌐 Internationalization (`js/i18n/`)

| File | Size | Description |
|:-----|:----:|:------------|
| 🔄 `i18n-engine.js` | 1.7KB | Language switching engine with `t(key, params)` interpolation & auto-detection |
| 🇹🇼 `lang-zh.js` | 4.6KB | Traditional Chinese string dictionary |
| 🇺🇸 `lang-en.js` | 4.4KB | English string dictionary |
| 🇯🇵 `lang-jp.js` | 5.1KB | Japanese string dictionary |

#### 🔊 Audio (`js/audio/`)

| File | Size | Description |
|:-----|:----:|:------------|
| 🎵 `audio-manager.js` | 6.0KB | Web Audio API manager — BGM with 10x GainNode, synthesized SFX, bell-tone BGM |
| 🎶 `playlist.js` | 1.1KB | BGM track playlists for menu/game/celebration with shuffle-no-repeat logic |

#### 🖥️ UI Layer (`js/ui/`)

| File | Size | Description |
|:-----|:----:|:------------|
| 🔀 `screen-manager.js` | 2.1KB | Screen switching & modal/confirm dialog system |
| 🏠 `main-menu.js` | 3.6KB | Main menu rendering — Start, Continue, How-To, Settings buttons |
| 📖 `howto-page.js` | 3.6KB | Step-by-step tutorial cards with swipe navigation |
| ⚙️ `settings-page.js` | 7.4KB | Settings UI — audio sliders, theme swatches, language selector, data management |
| 📱 `mobile-controls.js` | 2.1KB | Floating mobile tool bar with collapse/expand toggle |

#### 🎮 Game Logic (`js/game/`)

| File | Size | Description |
|:-----|:----:|:------------|
| 🔄 `game-loop.js` | 10.6KB | Main game loop (requestAnimationFrame), HUD, stove rendering, tool application |
| 🟤 `takoyaki-slot.js` | 4.2KB | State machine for each slot: empty→raw→half→flipped→cooked→plated→done/burnt |
| 🥄 `ingredients.js` | 662B | Topping & sauce data definitions with scores |
| 🏅 `scoring.js` | 1.1KB | Score calculation: flip accuracy + cook accuracy + ingredients + sauce bonuses |
| 📋 `order-system.js` | 862B | Level management — get level, get next level, create game state |
| ✨ `animations.js` | 597B | Sparkle burst animation for scoring celebrations |

#### 🎨 CSS Structure (`css/`)

| Category | Files | Purpose |
|:---------|:------|:--------|
| 🧱 **Base** | `reset.css`, `variables.css`, `typography.css` | Browser reset, CSS custom properties, font rules |
| 📐 **Layout** | `layout.css`, `responsive.css` | Flex/Grid skeleton, RWD media queries |
| 🧩 **Components** | `buttons.css`, `modal.css`, `hud.css`, `icons.css`, `mobile-controls.css` | Reusable UI component styles |
| 🌈 **Themes** | 5 theme files | Color schemes with CSS custom property overrides |
| 📑 **Pages** | `main-menu.css`, `game.css`, `howto.css`, `settings.css` | Page-specific styles |

#### 📊 Data Files (`data/`)

| File | Description |
|:-----|:------------|
| 📋 `levels.json` | 4 levels with slot count, target, time limit, topping, and sauce type |
| 🏆 `achievements.json` | 3 achievements: First Plate, Three Stars, No Burn |

---

### 🎨 Theme System

Switch themes in the Settings page — 5 beautiful themes available!

| Theme | Main Color | Accent | Mood |
|:------|:----------:|:------:|:-----|
| 🌸 Cute Pink (Default) | `#FFD6E8` | `#FF6FA5` | Hearts, stars, kawaii stickers |
| 🌊 Ocean Blue | `#CDEFFF` | `#2196C9` | Bubbles, shells, ocean vibes |
| ☀️ Sunny Yellow | `#FFF3C4` | `#FFB300` | Festival lanterns, sunflowers |
| 🍵 Matcha Green | `#DFF3E3` | `#4CAF6D` | Bamboo leaves, traditional motifs |
| 🌙 Night Purple | `#2B2140` | `#B79CFF` | Starry sky, night market glow |

> 💡 Themes are applied by swapping a CSS class on `<body>` (e.g., `theme-cute-pink`). All colors use CSS custom properties (`--color-*`).

---

### 🌐 Internationalization (i18n)

| Language | Flag | Code | Font |
|:---------|:----:|:----:|:-----|
| Japanese | 🇯🇵 | `ja` | Noto Sans JP |
| English | 🇺🇸 | `en` | Fredoka / Baloo 2 |
| Traditional Chinese | 🇹🇼 | `zh-TW` | Noto Sans TC |

- 🔍 Auto-detects browser language on first visit
- ⚡ Instant language switching — no page reload needed
- 📝 All strings managed via dictionary files (`lang-*.js`)
- 🔑 Uses `t(key, params)` function with `{placeholder}` interpolation

---

### 🔊 Audio System

#### 🎵 BGM (Background Music)

- Generated in real-time using **Web Audio API** oscillators (bell-tone piano style)
- **10x volume boost** via `GainNode` for immersive experience
- Shuffle-no-repeat playlist for menu, game, and celebration modes
- First-time volume warning dialog to prevent surprise loud audio

#### 🔔 SFX (Sound Effects)

All synthesized — no external audio files needed!

| Sound | Trigger | Style |
|:------|:--------|:------|
| 🥄 Pour | Pouring batter | Triangle wave, soft |
| 🔥 Sizzle | Batter cooking | Sawtooth wave, low |
| 🔄 Flip | Flipping takoyaki | Triangle + sine, crisp |
| 🍽️ Plate | Plating done | Triangle wave, medium |
| 🍯 Sauce | Adding sauce | Sine wave, smooth |
| 🔘 Button | UI button press | High sine, short |
| ✅ Success | Completing a takoyaki | Rising triangle chime |
| ❌ Fail | Burning / wrong action | Low square wave |
| ⭐ Star | Earning a star | High sine sparkle |

---

### 📱 Responsive Design

| Device | Width | Layout |
|:-------|:-----:|:-------|
| 📱 Phone (Portrait) | ≤ 480px | Single column, stove centered, controls at bottom |
| 📱 Phone (Landscape) | 481–768px | Stove centered with side padding |
| 📋 Tablet | 769–1024px | Phone layout scaled up 20% |
| 🖥️ Desktop | ≥ 1025px | Decorative sidebars, fixed aspect ratio game area |

#### Key Principles

- 🔒 Stove area locked with `aspect-ratio` to prevent distortion
- 👆 Minimum touch target: **44×44px** for all interactive elements
- 📏 Uses `dvh`/`svh` instead of `vh` to avoid mobile browser address bar issues
- 🏠 `env(safe-area-inset-bottom)` for iPhone Home Indicator
- 🔄 Auto-recalculates layout on orientation change
- 📐 Text scales with `clamp()` for fluid typography

---

### ⭐ Scoring System

Each completed takoyaki is scored based on:

| Factor | Max Points | Description |
|:-------|:----------:|:------------|
| 🟤 Base Score | 70 | Just for completing a takoyaki |
| 🐙 Octopus | +30 | Added octopus piece |
| 🧅 Topping | +25 | Added topping ingredient |
| ⏱️ Flip Accuracy | +35 | How timely was your flip? |
| 🔥 Cook Accuracy | +35 | How timely was your plating? |
| 🍯 Sauce | +35 | Applied sauce decoration |
| **Max Per Takoyaki** | **230** | Perfect score per piece |
| 🔥 Burn Penalty | **-35** | Each burnt takoyaki |

#### ⭐ Star Ratings

| Stars | Average Score Per Takoyaki |
|:-----:|:------------------------:|
| ⭐⭐⭐ | ≥ 175 |
| ⭐⭐☆ | ≥ 130 |
| ⭐☆☆ | ≥ 80 |
| ☆☆☆ | < 80 |

---

### 🛠️ Tech Stack

| Category | Technology |
|:---------|:-----------|
| 📄 Markup | HTML5 Semantic Elements |
| 🎨 Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| ⚡ Logic | Vanilla JavaScript (ES6+) |
| 🔊 Audio | Web Audio API (OscillatorNode, GainNode) |
| 💾 Storage | localStorage |
| 🏗️ Build | **None** — Zero build step! |
| 📦 Dependencies | **None** — Zero external dependencies! |

---

---

<a id="-日本語"></a>

# 🇯🇵 日本語

## 📑 目次

- [🎯 ゲーム紹介](#-ゲーム紹介)
- [🎮 遊び方](#-遊び方)
- [🚀 クイックスタート](#-クイックスタート)
- [🏗️ プロジェクト構成](#️-プロジェクト構成)
- [📂 ファイル分類](#-ファイル分類)
- [🎨 テーマシステム](#-テーマシステム)
- [🌐 多言語対応（i18n）](#-多言語対応i18n)
- [🔊 オーディオシステム](#-オーディオシステム)
- [📱 レスポンシブデザイン](#-レスポンシブデザイン)
- [⭐ スコアリングシステム](#-スコアリングシステム)
- [🛠️ 技術スタック](#️-技術スタック)

---

### 🎯 ゲーム紹介

**たこ焼きマスター**は、純粋なフロントエンドのカジュアルクッキングシミュレーションゲームです。プレイヤーはたこ焼き屋台のオーナーとなり、生地を流し込むところから完成品を提供するまでの完全なたこ焼き作り体験を楽しめます！🍢

**かわいい日本のお祭り屋台**をモチーフにしたデザインで、シンプルで直感的な操作はどなたでも楽しめます。モバイルでもデスクトップでも — インストール不要！

#### ✨ 主な特徴

| 特徴 | 説明 |
|:----:|:-----|
| 🎨 5つのかわいいテーマ | ピンク、オーシャンブルー、サニーイエロー、抹茶グリーン、ナイトパープル |
| 🌐 3言語対応 | 日本語 🇯🇵 / 英語 🇺🇸 / 繁体字中国語 🇹🇼 |
| 📱 レスポンシブ | スマートフォン（縦・横）、タブレット、デスクトップ |
| 🎵 オリジナルBGM | Web Audio APIによる軽快なピアノメロディ |
| 💾 自動セーブ | 進捗はlocalStorageに自動保存 |
| 🏆 4つのレベル | 6→8→10→12個の焼き穴で段階的に難しく |
| 🎪 サーバー不要 | `index.html`をダブルクリックするだけ！ |
| ♿ アクセシブル | ARIAラベル、キーボード操作対応、WCAG AAコントラスト |

---

### 🎮 遊び方

たこ焼き作りの完全なプロセスは**7つのステップ**です：

| ステップ | アイコン | アクション | 説明 |
|:--------:|:--------:|:----------:|:-----|
| 1️⃣ | 🥄 | **生地を流す** | 空の焼き穴をクリックして生地を流し入れます |
| 2️⃣ | 🐙 | **タコを入れる** | 生地の中にタコのピースを入れます |
| 3️⃣ | 🧅 | **トッピング** | ネギ、紅ショウガ、天かすを追加 |
| 4️⃣ | ⏱️ | **ひっくり返す** | 色の変化を見て — タイミングよくひっくり返す！ |
| 5️⃣ | 🍽️ | **お皿に盛る** | 焼き上がったたこ焼きを鉄板から取り出す |
| 6️⃣ | 🍯 | **ソースをかける** | ソースをかけてたこ焼きを仕上げる |
| 7️⃣ | ⭐ | **評価** | パフォーマンスに応じて1〜3つ星を獲得 |

#### 🔄 たこ焼き状態遷移図

```
🥚 空 → 🟡 生 → 🟠 半焼け → [ひっくり返す！] → 🔶 反転済み
    → 🟤 焼き上がり → [お皿に！] → 🍽️ 盛り付け → [ソース！] → ✅ 完成！

⚠️ 注意：時間内にひっくり返さない/盛り付けないと → 🔥 焦げ！（-35点）
```

#### 📊 レベル構成

| レベル | 穴数 | 目標 | 時間 | トッピング | ソース |
|:------:|:----:|:----:|:----:|:----------:|:------:|
| 🏮 Lv.1 | 6 | 6 | 110秒 | 🧅 ネギ | 🍯 クラシック |
| 🏮 Lv.2 | 8 | 8 | 120秒 | 🥓 紅ショウガ | 🧂 マヨネーズ |
| 🏮 Lv.3 | 10 | 10 | 135秒 | ✨ 天かす | 🍯 クラシック |
| 🏮 Lv.4 | 12 | 12 | 150秒 | 🌈 ミックス | 🍯 スペシャル |

#### 🗑️ 焦げたたこ焼き

たこ焼きが焦げてしまったら、**捨てる 🗑️** ツールを使って穴をクリアし、やり直しましょう！

---

### 🚀 クイックスタート

```bash
# ビルド不要、npm不要、サーバー不要！
# ブラウザでファイルを開くだけ：

# 方法1：ダブルクリック
index.html

# 方法2：ローカルサーバーを使用（オプション）
npx serve .
```

> 💡 **ヒント**: `index.html`を直接開くだけで完全に動作します。インストール不要！

---

### 🏗️ プロジェクト構成

```
🐙 takoyaki/
│
├── 📄 index.html              ← 唯一のエントリーポイント（インポートのみ）
│
├── 🎨 css/                    ← 全スタイルシート
│   ├── 🧱 base/               ← リセット、変数、タイポグラフィ
│   ├── 📐 layout/             ← レイアウト骨格 & レスポンシブ
│   ├── 🧩 components/         ← ボタン、モーダル、HUD、アイコン
│   ├── 🌈 themes/             ← 5つのカラーテーマ
│   ├── 📑 pages/              ← ページ固有スタイル
│   └── 📋 main.css            ← マスターインポートファイル
│
├── ⚡ js/                     ← 全JavaScriptモジュール
│   ├── 🔧 core/               ← 設定、状態、ストレージ、イベント
│   ├── 🌐 i18n/               ← 言語辞書 & エンジン
│   ├── 🔊 audio/              ← オーディオマネージャー & プレイリスト
│   ├── 🖥️ ui/                 ← スクリーンマネージャー、メニュー、設定
│   ├── 🎮 game/               ← ゲームループ、スロット、スコアリング
│   └── 🚀 app.js              ← ブートローダー
│
├── 📦 assets/                 ← 静的アセット
│   ├── 🖼️ images/             ← UI、キャラクター、食材
│   ├── 🎵 audio/              ← BGM & 効果音ファイル
│   └── 🔤 fonts/              ← ローカルフォント (zh/jp/en)
│
├── 📊 data/                   ← ゲームデータ（JSON）
│   ├── 📋 levels.json         ← レベル設定
│   └── 🏆 achievements.json   ← 実績定義
│
└── 🧪 tests/                  ← テストファイル
    └── 🔬 static-tests.mjs    ← 静的解析テスト
```

---

### 📂 ファイル分類

#### 🔧 コアシステム（`js/core/`）

| ファイル | サイズ | 説明 |
|:---------|:------:|:-----|
| ⚙️ `config.js` | 2.8KB | グローバル定数：テーマ、ツール、タイミング、レベルデータ |
| 📡 `event-bus.js` | 571B | Pub/Subイベントシステム — モジュール間通信用 |
| 💾 `storage.js` | 1.6KB | localStorageラッパー — 設定・進捗・フラグの保存/読込 |
| 🗄️ `state.js` | 1.6KB | 集中状態管理 — 画面、設定、ゲーム状態 |

#### 🎮 ゲームロジック（`js/game/`）

| ファイル | サイズ | 説明 |
|:---------|:------:|:-----|
| 🔄 `game-loop.js` | 10.6KB | メインゲームループ（requestAnimationFrame）、HUD、鉄板レンダリング |
| 🟤 `takoyaki-slot.js` | 4.2KB | 各穴の状態機械：空→生→半焼→反転→焼上→盛付→完成/焦げ |
| 🥄 `ingredients.js` | 662B | トッピング＆ソースデータ定義 |
| 🏅 `scoring.js` | 1.1KB | スコア計算：反転精度 + 焼き精度 + 具材 + ソースボーナス |
| 📋 `order-system.js` | 862B | レベル管理 — レベル取得、次レベル、ゲーム状態作成 |
| ✨ `animations.js` | 597B | スコア獲得時のキラキラアニメーション |

#### 🖥️ UIレイヤー（`js/ui/`）

| ファイル | サイズ | 説明 |
|:---------|:------:|:-----|
| 🔀 `screen-manager.js` | 2.1KB | 画面切替 & モーダル/確認ダイアログ |
| 🏠 `main-menu.js` | 3.6KB | メインメニュー — スタート、続きから、遊び方、設定 |
| 📖 `howto-page.js` | 3.6KB | ステップバイステップのチュートリアルカード |
| ⚙️ `settings-page.js` | 7.4KB | 設定UI — 音量、テーマ、言語、データ管理 |
| 📱 `mobile-controls.js` | 2.1KB | フローティングモバイルツールバー |

---

### 🎨 テーマシステム

設定ページでテーマを切り替え — 5つの美しいテーマが利用可能！

| テーマ | メインカラー | アクセント | 雰囲気 |
|:-------|:----------:|:----------:|:-------|
| 🌸 かわいいピンク（デフォルト） | `#FFD6E8` | `#FF6FA5` | ハート、星、かわいいステッカー |
| 🌊 オーシャンブルー | `#CDEFFF` | `#2196C9` | 泡、貝殻、海の雰囲気 |
| ☀️ サニーイエロー | `#FFF3C4` | `#FFB300` | お祭りの提灯、ひまわり |
| 🍵 抹茶グリーン | `#DFF3E3` | `#4CAF6D` | 竹の葉、和風モチーフ |
| 🌙 ナイトパープル | `#2B2140` | `#B79CFF` | 星空、夜市の灯り |

---

### 🌐 多言語対応（i18n）

| 言語 | フラグ | コード | フォント |
|:-----|:------:|:------:|:---------|
| 日本語 | 🇯🇵 | `ja` | Noto Sans JP |
| 英語 | 🇺🇸 | `en` | Fredoka / Baloo 2 |
| 繁体字中国語 | 🇹🇼 | `zh-TW` | Noto Sans TC |

- 🔍 初回アクセス時にブラウザ言語を自動検出
- ⚡ ページリロード不要の即時言語切替
- 📝 すべての文字列は辞書ファイル（`lang-*.js`）で管理
- 🔑 `t(key, params)` 関数による `{placeholder}` 補間

---

### 🔊 オーディオシステム

#### 🎵 BGM（バックグラウンドミュージック）

- **Web Audio API** オシレーターでリアルタイム生成（ベルトーンピアノ風）
- **10倍音量ブースト** — `GainNode` による没入体験
- メニュー、ゲーム、お祝いモード用のシャッフル・重複なしプレイリスト
- 初回時の音量警告ダイアログ

#### 🔔 SFX（効果音）

すべて合成 — 外部オーディオファイル不要！

| 音 | トリガー | スタイル |
|:---|:---------|:---------|
| 🥄 流し込み | 生地を流す | トライアングル波、やわらかい |
| 🔥 ジュー | 生地が焼ける | ノコギリ波、低音 |
| 🔄 反転 | ひっくり返す | トライアングル+サイン波、クリスプ |
| 🍽️ 盛り付け | お皿に盛る | トライアングル波、ミディアム |
| 🍯 ソース | ソースをかける | サイン波、スムーズ |
| 🔘 ボタン | UIボタン押下 | 高音サイン波、短い |
| ✅ 成功 | たこ焼き完成 | 上昇トライアングルチャイム |
| ❌ 失敗 | 焦げ/誤操作 | 低音スクエア波 |
| ⭐ 星 | 星獲得 | 高音サイン波キラキラ |

---

### 📱 レスポンシブデザイン

| デバイス | 幅 | レイアウト |
|:---------|:--:|:-----------|
| 📱 スマホ（縦） | ≤ 480px | 1カラム、鉄板中央配置、操作ボタン下部 |
| 📱 スマホ（横） | 481–768px | 鉄板中央、左右余白 |
| 📋 タブレット | 769–1024px | スマホ版レイアウトを20%拡大 |
| 🖥️ デスクトップ | ≥ 1025px | 装飾サイドバー、固定アスペクト比ゲームエリア |

---

### ⭐ スコアリングシステム

| 要素 | 最大点数 | 説明 |
|:-----|:--------:|:-----|
| 🟤 基本スコア | 70 | たこ焼き完成の基本点 |
| 🐙 タコ | +30 | タコのピースを追加 |
| 🧅 トッピング | +25 | トッピングを追加 |
| ⏱️ 反転精度 | +35 | タイミングよくひっくり返せたか |
| 🔥 焼き精度 | +35 | タイミングよく盛り付けたか |
| 🍯 ソース | +35 | ソースをかけた |
| **最大（1個あたり）** | **230** | パーフェクトスコア |
| 🔥 焦げペナルティ | **-35** | 焦げ1個につき |

#### ⭐ 星の評価

| 星 | たこ焼き1個あたりの平均スコア |
|:--:|:----------------------------:|
| ⭐⭐⭐ | ≥ 175 |
| ⭐⭐☆ | ≥ 130 |
| ⭐☆☆ | ≥ 80 |
| ☆☆☆ | < 80 |

---

### 🛠️ 技術スタック

| カテゴリ | テクノロジー |
|:---------|:-------------|
| 📄 マークアップ | HTML5 セマンティック要素 |
| 🎨 スタイリング | CSS3（カスタムプロパティ、Grid、Flexbox、アニメーション） |
| ⚡ ロジック | Vanilla JavaScript（ES6+） |
| 🔊 オーディオ | Web Audio API（OscillatorNode、GainNode） |
| 💾 ストレージ | localStorage |
| 🏗️ ビルド | **不要** — ビルドステップゼロ！ |
| 📦 依存関係 | **なし** — 外部依存関係ゼロ！ |

---

---

<a id="-繁體中文"></a>

# 🇹🇼 繁體中文

## 📑 目錄

- [🎯 遊戲介紹](#-遊戲介紹)
- [🎮 遊戲玩法](#-遊戲玩法)
- [🚀 快速開始](#-快速開始)
- [🏗️ 專案架構](#️-專案架構)
- [📂 程式分類](#-程式分類)
- [🎨 主題系統](#-主題系統)
- [🌐 多國語系（i18n）](#-多國語系i18n)
- [🔊 音效系統](#-音效系統)
- [📱 響應式設計](#-響應式設計)
- [⭐ 評分系統](#-評分系統)
- [🛠️ 技術棧](#️-技術棧)

---

### 🎯 遊戲介紹

**章魚燒大師**是一款純前端休閒料理模擬小遊戲。你將扮演章魚燒攤販老闆，體驗從倒麵糊到出餐的完整章魚燒製作流程！🍢

遊戲走**可愛日系祭典攤販**風格，操作簡單直覺，適合大人小孩一起遊玩。手機、電腦都能玩 — 完全不需要安裝！

#### ✨ 核心特色

| 特色 | 說明 |
|:----:|:-----|
| 🎨 5 款可愛主題 | 粉紅色、海洋藍、元氣黃、抹茶綠、夜間紫 |
| 🌐 3 種語言 | 日文 🇯🇵 / 英文 🇺🇸 / 繁體中文 🇹🇼 |
| 📱 完整 RWD | 手機（直式＆橫式）、平板、桌機 |
| 🎵 原創 BGM | Web Audio API 產生的輕快鋼琴旋律 |
| 💾 自動存檔 | 進度自動儲存至 localStorage |
| 🏆 4 個關卡 | 6→8→10→12 個烤孔，難度遞增 |
| 🎪 不需要伺服器 | 雙擊 `index.html` 就能玩！ |
| ♿ 無障礙設計 | ARIA 標籤、鍵盤導航、WCAG AA 對比度 |

---

### 🎮 遊戲玩法

完整的章魚燒製作流程共有 **7 個步驟**：

| 步驟 | 圖示 | 動作 | 說明 |
|:----:|:----:|:----:|:-----|
| 1️⃣ | 🥄 | **倒麵糊** | 點擊空的烤孔，倒入麵糊 |
| 2️⃣ | 🐙 | **放章魚** | 將章魚塊放入麵糊中 |
| 3️⃣ | 🧅 | **加配料** | 添加蔥花、紅薑或天婦花 |
| 4️⃣ | ⏱️ | **翻轉** | 注意顏色變化 — 在對的時機翻面！ |
| 5️⃣ | 🍽️ | **出爐裝盤** | 把烤好的章魚燒從烤盤取出 |
| 6️⃣ | 🍯 | **淋醬** | 淋上醬汁完成章魚燒 |
| 7️⃣ | ⭐ | **評分** | 根據表現獲得 1～3 顆星 |

#### 🔄 章魚燒狀態機

```
🥚 空 → 🟡 生麵糊 → 🟠 半熟 → [翻面！] → 🔶 已翻面
    → 🟤 熟成 → [裝盤！] → 🍽️ 已裝盤 → [淋醬！] → ✅ 完成！

⚠️ 注意：太晚翻面/裝盤 → 🔥 燒焦！（-35 分）
```

#### 📊 關卡設定

| 關卡 | 烤孔數 | 目標 | 時間 | 配料 | 醬料 |
|:----:|:------:|:----:|:----:|:----:|:----:|
| 🏮 第 1 關 | 6 | 6 | 110 秒 | 🧅 蔥花 | 🍯 經典醬 |
| 🏮 第 2 關 | 8 | 8 | 120 秒 | 🥓 紅薑 | 🧂 美乃滋 |
| 🏮 第 3 關 | 10 | 10 | 135 秒 | ✨ 天婦花 | 🍯 經典醬 |
| 🏮 第 4 關 | 12 | 12 | 150 秒 | 🌈 綜合配料 | 🍯 特製醬 |

#### 🗑️ 燒焦的章魚燒

如果章魚燒燒焦了，使用**丟棄 🗑️** 工具清空烤孔，重新開始！

---

### 🚀 快速開始

```bash
# 不需要 build、不需要 npm、不需要 server！
# 直接用瀏覽器打開檔案就好：

# 方法一：雙擊開啟
index.html

# 方法二：使用本地伺服器（選用，體驗更佳）
npx serve .
```

> 💡 **小提示**: 直接打開 `index.html` 就能完美運行，完全不需要安裝任何東西！

---

### 🏗️ 專案架構

```
🐙 takoyaki/
│
├── 📄 index.html              ← 唯一入口（只負責引入資源）
│
├── 🎨 css/                    ← 所有樣式表
│   ├── 🧱 base/               ← 重置、變數、字體規則
│   ├── 📐 layout/             ← 版面骨架 & RWD
│   ├── 🧩 components/         ← 按鈕、彈窗、HUD、圖示
│   ├── 🌈 themes/             ← 5 個顏色主題
│   ├── 📑 pages/              ← 各頁面專屬樣式
│   └── 📋 main.css            ← 統一匯入檔
│
├── ⚡ js/                     ← 所有 JavaScript 模組
│   ├── 🔧 core/               ← 設定、狀態、儲存、事件
│   ├── 🌐 i18n/               ← 語系字典 & 切換引擎
│   ├── 🔊 audio/              ← 音效管理器 & 播放清單
│   ├── 🖥️ ui/                 ← 畫面管理器、選單、設定
│   ├── 🎮 game/               ← 遊戲迴圈、烤孔、評分
│   └── 🚀 app.js              ← 啟動載入器
│
├── 📦 assets/                 ← 靜態資源
│   ├── 🖼️ images/             ← UI、角色、食材
│   ├── 🎵 audio/              ← BGM & 音效檔
│   └── 🔤 fonts/              ← 本地字型 (zh/jp/en)
│
├── 📊 data/                   ← 遊戲資料（JSON）
│   ├── 📋 levels.json         ← 關卡設定
│   └── 🏆 achievements.json   ← 成就定義
│
└── 🧪 tests/                  ← 測試檔案
    └── 🔬 static-tests.mjs    ← 靜態分析測試
```

---

### 📂 程式分類

#### 🔧 核心系統（`js/core/`）

| 檔案 | 大小 | 說明 |
|:-----|:----:|:-----|
| ⚙️ `config.js` | 2.8KB | 全域常數：主題、工具、時序設定、關卡資料、教學步驟 |
| 📡 `event-bus.js` | 571B | 發佈/訂閱事件系統 — `on()`、`off()`、`emit()` 模組間溝通 |
| 💾 `storage.js` | 1.6KB | localStorage 封裝 — 設定/進度/標記的存讀 |
| 🗄️ `state.js` | 1.6KB | 集中式狀態管理 — 畫面、設定、遊戲狀態、工具選擇 |

#### 🌐 多國語系（`js/i18n/`）

| 檔案 | 大小 | 說明 |
|:-----|:----:|:-----|
| 🔄 `i18n-engine.js` | 1.7KB | 語系切換引擎，`t(key, params)` 插值函式 & 自動偵測 |
| 🇹🇼 `lang-zh.js` | 4.6KB | 繁體中文字串字典 |
| 🇺🇸 `lang-en.js` | 4.4KB | 英文字串字典 |
| 🇯🇵 `lang-jp.js` | 5.1KB | 日文字串字典 |

#### 🔊 音效（`js/audio/`）

| 檔案 | 大小 | 說明 |
|:-----|:----:|:-----|
| 🎵 `audio-manager.js` | 6.0KB | Web Audio API 管理器 — BGM 10 倍增益、合成音效、鈴音 BGM |
| 🎶 `playlist.js` | 1.1KB | BGM 播放清單（選單/遊戲/慶祝），隨機不重複邏輯 |

#### 🖥️ UI 層（`js/ui/`）

| 檔案 | 大小 | 說明 |
|:-----|:----:|:-----|
| 🔀 `screen-manager.js` | 2.1KB | 畫面切換 & 彈窗/確認對話框系統 |
| 🏠 `main-menu.js` | 3.6KB | 主選單 — 開始遊戲、繼續遊戲、遊戲說明、設定 |
| 📖 `howto-page.js` | 3.6KB | 步驟式教學卡片，支援滑動瀏覽 |
| ⚙️ `settings-page.js` | 7.4KB | 設定 UI — 音量滑桿、主題色卡、語言選擇、資料管理 |
| 📱 `mobile-controls.js` | 2.1KB | 浮動手機工具列，可收合/展開 |

#### 🎮 遊戲邏輯（`js/game/`）

| 檔案 | 大小 | 說明 |
|:-----|:----:|:-----|
| 🔄 `game-loop.js` | 10.6KB | 主遊戲迴圈（requestAnimationFrame）、HUD、烤盤渲染、工具操作 |
| 🟤 `takoyaki-slot.js` | 4.2KB | 每個烤孔的狀態機：空→生→半熟→翻面→熟成→裝盤→完成/燒焦 |
| 🥄 `ingredients.js` | 662B | 配料 & 醬料資料定義與分數 |
| 🏅 `scoring.js` | 1.1KB | 計分邏輯：翻面精準度 + 烘烤精準度 + 配料 + 醬料加成 |
| 📋 `order-system.js` | 862B | 關卡管理 — 取得關卡、下一關、建立遊戲狀態 |
| ✨ `animations.js` | 597B | 計分時的閃亮星星爆發動畫 |

#### 🎨 CSS 結構（`css/`）

| 類別 | 檔案 | 用途 |
|:-----|:-----|:-----|
| 🧱 **Base** | `reset.css`、`variables.css`、`typography.css` | 瀏覽器重置、CSS 自訂屬性、字體規則 |
| 📐 **Layout** | `layout.css`、`responsive.css` | Flex/Grid 版面骨架、RWD 媒體查詢 |
| 🧩 **Components** | `buttons.css`、`modal.css`、`hud.css`、`icons.css`、`mobile-controls.css` | 可重用 UI 元件樣式 |
| 🌈 **Themes** | 5 個主題檔 | 透過 CSS 自訂屬性覆寫的配色方案 |
| 📑 **Pages** | `main-menu.css`、`game.css`、`howto.css`、`settings.css` | 各頁面專屬樣式 |

#### 📊 資料檔案（`data/`）

| 檔案 | 說明 |
|:-----|:-----|
| 📋 `levels.json` | 4 個關卡：烤孔數、目標數量、時間限制、配料、醬料類型 |
| 🏆 `achievements.json` | 3 個成就：初次裝盤、三星通關、零燒焦 |

---

### 🎨 主題系統

在設定頁面切換主題 — 5 款美麗主題任你選！

| 主題 | 主色 | 強調色 | 風格 |
|:-----|:----:|:------:|:-----|
| 🌸 可愛粉（預設） | `#FFD6E8` | `#FF6FA5` | 愛心、星星、可愛貼紙 |
| 🌊 海洋藍 | `#CDEFFF` | `#2196C9` | 泡泡、貝殼、海洋風情 |
| ☀️ 元氣黃 | `#FFF3C4` | `#FFB300` | 祭典燈籠、太陽花 |
| 🍵 抹茶綠 | `#DFF3E3` | `#4CAF6D` | 竹葉、和風紋樣 |
| 🌙 夜間紫 | `#2B2140` | `#B79CFF` | 星空、夜市燈火 |

> 💡 主題透過切換 `<body>` 上的 CSS class（如 `theme-cute-pink`）來套用，所有顏色使用 CSS 自訂屬性（`--color-*`）。

---

### 🌐 多國語系（i18n）

| 語言 | 旗幟 | 代碼 | 字型 |
|:-----|:----:|:----:|:-----|
| 日文 | 🇯🇵 | `ja` | Noto Sans JP |
| 英文 | 🇺🇸 | `en` | Fredoka / Baloo 2 |
| 繁體中文 | 🇹🇼 | `zh-TW` | Noto Sans TC |

- 🔍 首次造訪時自動偵測瀏覽器語言
- ⚡ 即時切換語言，不需要重新整理頁面
- 📝 所有文字透過字典檔（`lang-*.js`）管理
- 🔑 使用 `t(key, params)` 函式搭配 `{placeholder}` 插值

---

### 🔊 音效系統

#### 🎵 BGM（背景音樂）

- 使用 **Web Audio API** 振盪器即時產生（鈴音鋼琴風格）
- **10 倍音量增益** — 透過 `GainNode` 達到沉浸式體驗
- 選單、遊戲、慶祝模式各有播放清單，隨機不重複播放
- 首次遊玩時的音量警告提示，避免嚇到玩家

#### 🔔 SFX（音效）

全部合成產生 — 不需要外部音效檔！

| 音效 | 觸發時機 | 風格 |
|:-----|:---------|:-----|
| 🥄 倒入 | 倒麵糊時 | 三角波，柔和 |
| 🔥 滋滋聲 | 麵糊烘烤中 | 鋸齒波，低沉 |
| 🔄 翻轉 | 翻面時 | 三角波 + 正弦波，清脆 |
| 🍽️ 裝盤 | 裝盤時 | 三角波，中等 |
| 🍯 淋醬 | 淋醬時 | 正弦波，滑順 |
| 🔘 按鈕 | UI 按鈕點擊 | 高音正弦波，短促 |
| ✅ 成功 | 完成一顆章魚燒 | 上升三角波鈴聲 |
| ❌ 失敗 | 燒焦/操作錯誤 | 低音方波 |
| ⭐ 星星 | 獲得星星 | 高音正弦波閃亮 |

---

### 📱 響應式設計

| 裝置 | 寬度 | 版面策略 |
|:-----|:----:|:---------|
| 📱 手機（直式） | ≤ 480px | 單欄、烤盤置中、操作鈕在底部 |
| 📱 手機（橫式） | 481–768px | 烤盤置中、左右留白 |
| 📋 平板 | 769–1024px | 手機版版面放大 20% |
| 🖥️ 桌機 | ≥ 1025px | 裝飾側邊欄、固定比例遊戲區域 |

#### 核心設計原則

- 🔒 烤盤區域以 `aspect-ratio` 鎖定比例，避免拉伸變形
- 👆 所有互動元素最小點擊區域：**44×44px**
- 📏 使用 `dvh`/`svh` 取代 `vh`，避免手機瀏覽器網址列造成版面跳動
- 🏠 `env(safe-area-inset-bottom)` 避開 iPhone Home Indicator
- 🔄 螢幕旋轉時自動重新計算版面
- 📐 文字使用 `clamp()` 流體排版等比例縮放

---

### ⭐ 評分系統

每個完成的章魚燒根據以下項目計分：

| 項目 | 最高分 | 說明 |
|:-----|:------:|:-----|
| 🟤 基本分 | 70 | 完成一顆章魚燒的基本分 |
| 🐙 章魚 | +30 | 有放章魚塊 |
| 🧅 配料 | +25 | 有加配料 |
| ⏱️ 翻面精準度 | +35 | 翻面的時機有多準？ |
| 🔥 烘烤精準度 | +35 | 裝盤的時機有多準？ |
| 🍯 醬料 | +35 | 有淋醬 |
| **每顆最高** | **230** | 滿分 |
| 🔥 燒焦扣分 | **-35** | 每燒焦一顆 |

#### ⭐ 星等評價

| 星等 | 每顆章魚燒平均分 |
|:----:|:----------------:|
| ⭐⭐⭐ | ≥ 175 |
| ⭐⭐☆ | ≥ 130 |
| ⭐☆☆ | ≥ 80 |
| ☆☆☆ | < 80 |

---

### 🛠️ 技術棧

| 類別 | 技術 |
|:-----|:-----|
| 📄 標記語言 | HTML5 語意化元素 |
| 🎨 樣式 | CSS3（自訂屬性、Grid、Flexbox、動畫） |
| ⚡ 邏輯 | 原生 JavaScript（ES6+） |
| 🔊 音效 | Web Audio API（OscillatorNode、GainNode） |
| 💾 儲存 | localStorage |
| 🏗️ 建置 | **不需要** — 零建置步驟！ |
| 📦 相依套件 | **沒有** — 零外部相依！ |

---

---

<p align="center">
  Made with 🐙❤️ by <strong>Takoyaki Master Team</strong>
</p>

<p align="center">
  <sub>🌸 焼きたてのたこ焼き、いかがですか？ 🌸</sub><br/>
  <sub>🍢 來份熱騰騰的章魚燒吧！ 🍢</sub><br/>
  <sub>🎪 Fresh takoyaki, anyone? 🎪</sub>
</p>
