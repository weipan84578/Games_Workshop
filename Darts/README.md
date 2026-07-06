<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Offline-Ready-2ea44f?style=for-the-badge" alt="Offline Ready" />
</p>

<h1 align="center">🎯 Darts — Web Darts Game</h1>

<p align="center">
  <b>A fully offline, zero-install, responsive web darts game.</b><br/>
  Double-click <code>index.html</code> to play — no server, no bundler, no npm required.
</p>

---

## 🌐 Language / 言語 / 語言

| 🇬🇧 [English](#-english) | 🇯🇵 [日本語](#-日本語) | 🇹🇼 [繁體中文](#-繁體中文) |
|:---:|:---:|:---:|

---

<!-- ═══════════════════════════════════════════════════ -->
<!-- ██████████  E N G L I S H  ██████████ -->
<!-- ═══════════════════════════════════════════════════ -->

# 🇬🇧 English

## 📑 Table of Contents

| Section | Description |
|:---|:---|
| [✨ Features](#-features) | Key highlights at a glance |
| [🚀 Quick Start](#-quick-start) | How to launch the game |
| [🎮 Game Introduction](#-game-introduction) | What is this game? |
| [🕹️ How to Play](#️-how-to-play) | Controls & throwing mechanics |
| [📏 Game Modes & Rules](#-game-modes--rules) | 501 / 301 / 701 / Cricket / Around the Clock |
| [🎨 Themes & Customization](#-themes--customization) | Visual themes & language settings |
| [🔊 Audio System](#-audio-system) | BGM & sound effects |
| [💾 Save System](#-save-system) | Auto-save & continue |
| [🏗️ Project Architecture](#️-project-architecture) | Folder structure overview |
| [📁 File Taxonomy](#-file-taxonomy) | Detailed file descriptions |
| [🛠️ Tech Stack](#️-tech-stack) | Technologies used |
| [📱 Responsive Design](#-responsive-design) | Multi-device support |
| [♿ Accessibility](#-accessibility) | A11y features |
| [🔍 Verification](#-verification) | How to verify the build |

---

### ✨ Features

| Feature | Description |
|:---|:---|
| 🎯 **5 Game Modes** | 501, 301, 701, Cricket, Around the Clock |
| 🤖 **AI Opponents** | 1–3 AI players with Easy / Normal / Hard difficulty |
| 🎨 **4 Visual Themes** | Classic Board, Neon Arcade, Sakura, Dark Steel |
| 🌐 **3 Languages** | English, Japanese, Traditional Chinese |
| 🔊 **Synthesized Audio** | Web Audio API BGM & SFX — no external audio files needed |
| 📱 **Fully Responsive** | Desktop, tablet, and mobile support |
| 💾 **Auto-Save** | Game progress saved to `localStorage` automatically |
| 🔌 **100% Offline** | No server, no CDN, no install — just open `index.html` |
| ♿ **Accessible** | Keyboard navigation, WCAG contrast, semantic HTML |

---

### 🚀 Quick Start

```
1.  Clone or download this repository
2.  Double-click  index.html
3.  Play! 🎯
```

> **Requirements:** Any modern browser (Chrome, Edge, Firefox, Safari).
> No Node.js, npm, server, or build tools needed.

---

### 🎮 Game Introduction

**Darts** is a classic pub-style darts game recreated entirely in the browser. It features a **realistic SVG dartboard** with accurate scoring zones (Single, Double, Triple, Outer Bull, Bullseye) and smooth throw animations with arc-based flight paths.

The game supports **local multiplayer** (1 human + up to 3 AI opponents) across five official dart game modes. All UI text supports instant language switching between English, Japanese, and Traditional Chinese.

---

### 🕹️ How to Play

#### 🖱️ Desktop (Mouse)

| Step | Action |
|:---:|:---|
| **1** | 🎯 Move your mouse over the dartboard to aim |
| **2** | 🖱️ Press & hold the left mouse button to charge power |
| **3** | 💨 Release to throw — the dart flies along an arc to the target |

#### 📱 Mobile (Touch)

| Step | Action |
|:---:|:---|
| **1** | 👆 Tap & hold on the dartboard to aim |
| **2** | ⬇️ Slide your finger down to charge power |
| **3** | 💨 Release to throw |

#### ⌨️ Keyboard

| Key | Action |
|:---|:---|
| `Arrow Keys` | Move aiming reticle |
| `Space` / `Enter` | Throw dart |

#### 🎯 Dartboard Zones

```
    ┌─────────────────────────┐
    │      Miss (0 pts)       │  ← Outside the board
    │  ┌───────────────────┐  │
    │  │  Double Ring (×2)  │  │  ← Outermost scoring ring
    │  │  ┌─────────────┐  │  │
    │  │  │  Single      │  │  │  ← Large single-score area
    │  │  │  ┌─────────┐ │  │  │
    │  │  │  │Triple(×3)│ │  │  │  ← Thin inner ring
    │  │  │  │ ┌─────┐  │ │  │  │
    │  │  │  │ │Single│  │ │  │  │  ← Inner single area
    │  │  │  │ │ ┌──┐ │  │ │  │  │
    │  │  │  │ │ │25│ │  │ │  │  │  ← Outer Bull (25 pts)
    │  │  │  │ │ │50│ │  │ │  │  │  ← Bullseye (50 pts)
    │  │  │  │ │ └──┘ │  │ │  │  │
    └──┴──┴──┴─┴──────┴──┴─┴──┘
```

---

### 📏 Game Modes & Rules

#### 🔢 501 / 301 (Double Out)

| Item | Detail |
|:---|:---|
| **Starting Score** | 501 or 301 |
| **Each Round** | 3 darts per player |
| **Objective** | Reduce score to exactly **0** |
| **Win Condition** | Final dart must land on a **Double** or **Bullseye** |
| **Bust Rule** | If score goes below 0, equals 1, or reaches 0 without a double → round score is voided |

#### 🔢 701 (Exact Zero)

| Item | Detail |
|:---|:---|
| **Starting Score** | 701 |
| **Win Condition** | Reduce to exactly **0** (no Double Out required) |

#### 🏏 Cricket

| Item | Detail |
|:---|:---|
| **Target Numbers** | 15, 16, 17, 18, 19, 20, Bullseye |
| **Opening** | Hit a number 3 times to "open" it |
| **Scoring** | Extra hits on your open numbers score points (if opponent hasn't closed it) |
| **Win Condition** | All numbers opened + highest score |

#### 🔄 Around the Clock

| Item | Detail |
|:---|:---|
| **Objective** | Hit numbers 1 → 2 → 3 → … → 20 → Bullseye in order |
| **Best For** | Solo practice & aim training |

#### 👥 Player Setup

| Setting | Options |
|:---|:---|
| AI Players | 1, 2, or 3 |
| AI Difficulty | 🟢 Easy · 🟡 Normal · 🔴 Hard |

---

### 🎨 Themes & Customization

| Theme | Preview Colors | Style |
|:---|:---|:---|
| 🪵 **Classic Board** | Deep wood brown + wine red + gold | Traditional pub atmosphere |
| 💜 **Neon Arcade** | Dark purple + neon blue/pink | Cyberpunk gaming vibe |
| 🌸 **Sakura** | Cream white + pink + soft green | Japanese pastel aesthetic |
| 🌙 **Dark Steel** | Dark slate blue + muted orange | Night-friendly eye comfort |

> Change themes anytime via **Settings → Theme**.

---

### 🔊 Audio System

The game uses **Web Audio API** to synthesize all sounds in real-time — no audio files needed.

| Sound | Trigger | Style |
|:---|:---|:---|
| 🎹 BGM (Menu) | Main menu screen | Light piano melody |
| 🎹 BGM (Game) | During gameplay | Gentle rhythmic accompaniment |
| 🎹 BGM (Result) | Match results screen | Uplifting piano variation |
| 🔔 Click | UI button press | Short high "ding" |
| 💨 Throw | Dart released | Soft "whoosh" |
| 🎯 Hit | Dart lands on board | Crisp wooden "knock" |
| ⭐ Bullseye | Hit the center | Bright "chime" + sparkle |
| ❌ Bust | Score overflow | Descending tone |
| 🏆 Win | Match victory | Rising piano arpeggio |

> Adjust volumes separately for **BGM** and **SFX** in Settings.

---

### 💾 Save System

| Feature | Description |
|:---|:---|
| 🔄 **Auto-Save** | Game state saved after every throw |
| ▶️ **Continue** | Resume from where you left off via the main menu |
| 🗑️ **Clear Save** | Delete saved data from Settings |
| 📦 **Storage** | Uses browser `localStorage` — no cloud required |

---

### 🏗️ Project Architecture

```
Darts/
│
├── 📄 index.html              ← Single entry point (double-click to play)
│
├── 📁 css/                    ← Stylesheets (modular by purpose)
│   ├── 📁 base/               ← Reset, variables, typography
│   ├── 📁 layout/             ← Grid system, responsive breakpoints
│   ├── 📁 components/         ← Buttons, modals, panels, sliders, toasts
│   ├── 📁 pages/              ← Per-screen styles (menu, game, settings…)
│   └── 📁 themes/             ← 4 color theme files
│
├── 📁 js/                     ← JavaScript (modular by domain)
│   ├── 📄 main.js             ← App entry point & orchestrator
│   ├── 📁 core/               ← Storage manager
│   ├── 📁 i18n/               ← Translations & language apply
│   ├── 📁 audio/              ← Web Audio synthesizer
│   └── 📁 game/               ← Board renderer & scoring engine
│
├── 📁 assets/                 ← Static resources
│   └── 📁 data/i18n/          ← Language packs (zh-TW, en-US, ja-JP)
│
└── 📁 tasks/                  ← Dev task notes
```

---

### 📁 File Taxonomy

#### 📂 CSS Files

| Category | File | Purpose |
|:---|:---|:---|
| **Base** | `reset.css` | Browser style normalization |
| **Base** | `variables.css` | CSS custom properties (colors, spacing, sizes) |
| **Base** | `typography.css` | Font families, sizes, line heights |
| **Layout** | `grid.css` | Flexbox/Grid layout skeleton |
| **Layout** | `responsive.css` | Media query breakpoints |
| **Component** | `buttons.css` | Button variants (primary, secondary, ghost, danger) |
| **Component** | `modal.css` | Popup dialog styling |
| **Component** | `panel.css` | Card/panel containers |
| **Component** | `slider.css` | Volume slider styling |
| **Component** | `toast.css` | Notification toast messages |
| **Page** | `main-menu.css` | Main menu layout & animations |
| **Page** | `gameplay.css` | Game screen layout (board + sidebar) |
| **Page** | `settings.css` | Settings screen layout |
| **Page** | `instructions.css` | Instructions screen layout |
| **Page** | `result.css` | Match result screen |
| **Theme** | `theme-classic.css` | 🪵 Classic pub color scheme |
| **Theme** | `theme-neon.css` | 💜 Neon arcade color scheme |
| **Theme** | `theme-sakura.css` | 🌸 Sakura pastel color scheme |
| **Theme** | `theme-dark.css` | 🌙 Dark steel color scheme |

#### 📂 JavaScript Files

| Category | File | Purpose |
|:---|:---|:---|
| **Entry** | `main.js` | App initialization, scene management, game loop, AI logic, input handling |
| **Core** | `storageManager.js` | `localStorage` read/write for settings & game saves |
| **i18n** | `translations.js` | All translation strings for zh-TW, en-US, ja-JP |
| **i18n** | `i18nApply.js` | DOM text replacement via `data-i18n` attributes |
| **Audio** | `audioManager.js` | Web Audio API synthesizer (BGM patterns, SFX tones, gain/compressor) |
| **Game** | `dartboardRenderer.js` | SVG dartboard rendering (wedge geometry, hit zones, dart markers) |
| **Game** | `scoringEngine.js` | Scoring logic for all 5 modes (bust, double-out, cricket marks, etc.) |

---

### 🛠️ Tech Stack

| Technology | Usage |
|:---|:---|
| **HTML5** | Semantic structure, `data-i18n` attributes |
| **CSS3** | Custom properties, Flexbox, Grid, `clamp()`, media queries |
| **Vanilla JS (ES6+)** | No frameworks — pure JavaScript with IIFE modules |
| **SVG** | Dartboard rendering with computed wedge paths |
| **Web Audio API** | Real-time audio synthesis (oscillators, gain nodes, compressor) |
| **localStorage** | Persistent settings & game state |

---

### 📱 Responsive Design

| Device | Width | Layout |
|:---|:---|:---|
| 📱 Phone (Portrait) | ≤ 480px | Single column, board centered, controls at bottom |
| 📱 Phone (Landscape) | 481–768px | Board + info side by side |
| 📱 Tablet | 769–1024px | Enlarged board with fixed sidebar |
| 🖥️ Desktop | ≥ 1025px | Full 3-column layout (players / board / scores) |

---

### ♿ Accessibility

- ✅ Keyboard navigable (Tab + Enter)
- ✅ ARIA labels on all interactive elements
- ✅ WCAG AA contrast ratios
- ✅ Minimum 44×44px touch targets
- ✅ Screen reader friendly with `aria-live` regions
- ✅ Audio can be fully disabled without affecting gameplay

---

### 🔍 Verification

```powershell
# Syntax check all JS files
node --check .\js\core\storageManager.js
node --check .\js\i18n\translations.js
node --check .\js\i18n\i18nApply.js
node --check .\js\audio\audioManager.js
node --check .\js\game\scoringEngine.js
node --check .\js\game\dartboardRenderer.js
node --check .\js\main.js
```

**Manual browser checks:**
1. Open `index.html` by double-clicking
2. Start a game in each mode, test all scoring zones
3. Verify bust/double-out rules work correctly
4. Confirm AI throws automatically with arc animation
5. Switch languages & themes in Settings
6. Close and reopen — verify save/continue works
7. Test on both desktop and mobile widths

---

<!-- ═══════════════════════════════════════════════════ -->
<!-- ██████████  日 本 語  ██████████ -->
<!-- ═══════════════════════════════════════════════════ -->

# 🇯🇵 日本語

## 📑 目次

| セクション | 説明 |
|:---|:---|
| [✨ 特徴](#-特徴) | 主な機能一覧 |
| [🚀 クイックスタート](#-クイックスタート) | ゲームの起動方法 |
| [🎮 ゲーム紹介](#-ゲーム紹介) | このゲームについて |
| [🕹️ 遊び方](#️-遊び方) | 操作方法と投げ方 |
| [📏 ゲームモードとルール](#-ゲームモードとルール) | 501 / 301 / 701 / Cricket / Around the Clock |
| [🎨 テーマとカスタマイズ](#-テーマとカスタマイズ) | ビジュアルテーマと言語設定 |
| [🔊 オーディオシステム](#-オーディオシステム) | BGM・効果音 |
| [💾 セーブシステム](#-セーブシステム) | 自動保存と続きから |
| [🏗️ プロジェクト構成](#️-プロジェクト構成) | フォルダ構造の概要 |
| [📁 ファイル分類](#-ファイル分類) | 各ファイルの詳細説明 |
| [🛠️ 技術スタック](#️-技術スタック) | 使用技術 |
| [📱 レスポンシブデザイン](#-レスポンシブデザイン) | マルチデバイス対応 |
| [♿ アクセシビリティ](#-アクセシビリティ) | バリアフリー機能 |

---

### ✨ 特徴

| 機能 | 説明 |
|:---|:---|
| 🎯 **5つのゲームモード** | 501、301、701、Cricket、Around the Clock |
| 🤖 **AIオポーネント** | 1〜3体のAI（イージー / ノーマル / ハード） |
| 🎨 **4つのビジュアルテーマ** | クラシックボード、ネオンアーケード、桜、ダークスチール |
| 🌐 **3言語対応** | 英語・日本語・繁体字中国語 |
| 🔊 **合成オーディオ** | Web Audio APIによるBGM・SE — 外部音声ファイル不要 |
| 📱 **完全レスポンシブ** | デスクトップ・タブレット・モバイル対応 |
| 💾 **自動セーブ** | ゲーム進行は`localStorage`に自動保存 |
| 🔌 **完全オフライン** | サーバー不要、CDN不要 — `index.html`を開くだけ |
| ♿ **アクセシブル** | キーボード操作、WCAGコントラスト、セマンティックHTML |

---

### 🚀 クイックスタート

```
1.  リポジトリをクローンまたはダウンロード
2.  index.html をダブルクリック
3.  プレイ開始！ 🎯
```

> **必要なもの：** モダンブラウザ（Chrome、Edge、Firefox、Safari）のみ。
> Node.js、npm、サーバー、ビルドツールは一切不要です。

---

### 🎮 ゲーム紹介

**Darts** は、ブラウザ上で完全に再現されたクラシックなパブスタイルのダーツゲームです。**リアルなSVGダーツボード**を搭載し、正確なスコアリングゾーン（シングル、ダブル、トリプル、アウターブル、ブルズアイ）と、弧を描く滑らかな投擲アニメーションを特徴としています。

**ローカルマルチプレイ**（人間1人 + 最大3体のAI対戦相手）を5つの公式ダーツモードでサポート。全UIテキストは英語・日本語・繁体字中国語の即時切り替えに対応しています。

---

### 🕹️ 遊び方

#### 🖱️ デスクトップ（マウス操作）

| ステップ | 操作 |
|:---:|:---|
| **1** | 🎯 ダーツボード上でマウスを動かして照準を合わせる |
| **2** | 🖱️ 左ボタンを押し続けてパワーをチャージ |
| **3** | 💨 ボタンを離して投げる — ダーツが弧を描いてターゲットに飛ぶ |

#### 📱 モバイル（タッチ操作）

| ステップ | 操作 |
|:---:|:---|
| **1** | 👆 ダーツボードをタップ＆ホールドで照準 |
| **2** | ⬇️ 指を下にスライドしてパワーチャージ |
| **3** | 💨 指を離して投げる |

#### ⌨️ キーボード操作

| キー | 操作 |
|:---|:---|
| `矢印キー` | 照準の移動 |
| `Space` / `Enter` | ダーツを投げる |

#### 🎯 ダーツボード構成

```
    ┌─────────────────────────┐
    │     ミス (0点)          │  ← ボード外
    │  ┌───────────────────┐  │
    │  │ ダブルリング (×2)  │  │  ← 最外周のスコアリング
    │  │  ┌─────────────┐  │  │
    │  │  │  シングル    │  │  │  ← 大きなシングルエリア
    │  │  │  ┌─────────┐ │  │  │
    │  │  │  │トリプル×3│ │  │  │  ← 内側の細いリング
    │  │  │  │ ┌─────┐  │ │  │  │
    │  │  │  │ │ 25点│  │ │  │  │  ← アウターブル
    │  │  │  │ │ 50点│  │ │  │  │  ← ブルズアイ
    │  │  │  │ │ └──┘ │  │ │  │  │
    └──┴──┴──┴─┴──────┴──┴─┴──┘
```

---

### 📏 ゲームモードとルール

#### 🔢 501 / 301（ダブルアウト）

| 項目 | 詳細 |
|:---|:---|
| **初期スコア** | 501 または 301 |
| **各ラウンド** | プレイヤーごとに3本 |
| **目標** | スコアを正確に **0** にする |
| **勝利条件** | 最後のダーツは **ダブル** または **ブルズアイ** に当てる必要あり |
| **バスト** | スコアが0未満、1になる、またはダブルなしで0 → そのラウンドのスコアは無効 |

#### 🔢 701（ゼロアウト）

| 項目 | 詳細 |
|:---|:---|
| **初期スコア** | 701 |
| **勝利条件** | 正確に **0** にする（ダブルアウト不要） |

#### 🏏 Cricket（クリケット）

| 項目 | 詳細 |
|:---|:---|
| **対象ナンバー** | 15、16、17、18、19、20、ブルズアイ |
| **オープン** | 同じ数字に3回当てると「オープン」 |
| **得点** | オープン済みの数字への追加ヒットでスコア加算（相手がクローズしていない場合） |
| **勝利条件** | 全ナンバーをオープン ＋ 最高スコア |

#### 🔄 Around the Clock（アラウンド・ザ・クロック）

| 項目 | 詳細 |
|:---|:---|
| **目標** | 1 → 2 → 3 → … → 20 → ブルズアイの順に当てる |
| **おすすめ** | ソロ練習・エイム向上に最適 |

---

### 🎨 テーマとカスタマイズ

| テーマ | カラー | スタイル |
|:---|:---|:---|
| 🪵 **クラシックボード** | 深い木目調ブラウン + ワインレッド + ゴールド | 伝統的なパブの雰囲気 |
| 💜 **ネオンアーケード** | ダークパープル + ネオンブルー/ピンク | サイバーパンク風ゲーミング |
| 🌸 **桜** | クリームホワイト + ピンク + ソフトグリーン | 日本風パステルカラー |
| 🌙 **ダークスチール** | ダークスレートブルー + ミュートオレンジ | 夜間プレイに優しい目への配慮 |

> **設定 → テーマ** からいつでも変更可能。

---

### 🔊 オーディオシステム

**Web Audio API** を使用してすべての音をリアルタイムに合成 — 外部音声ファイルは不要です。

| サウンド | トリガー | スタイル |
|:---|:---|:---|
| 🎹 BGM（メニュー） | メインメニュー画面 | 軽快なピアノメロディ |
| 🎹 BGM（ゲーム） | ゲームプレイ中 | 穏やかなリズミカルな伴奏 |
| 🎹 BGM（リザルト） | 試合結果画面 | 明るいピアノアレンジ |
| 🔔 クリック | UIボタン押下 | 短い高音「ティン」 |
| 💨 投げる | ダーツ発射 | 柔らかい「シュッ」 |
| 🎯 ヒット | ダーツ着弾 | パリッとした木質「コッ」 |
| ⭐ ブルズアイ | 中心に命中 | 明るい「チリーン」+ 輝きエフェクト |
| ❌ バスト | スコアオーバー | 下降音 |
| 🏆 勝利 | 試合勝利 | 上昇するピアノアルペジオ |

---

### 💾 セーブシステム

| 機能 | 説明 |
|:---|:---|
| 🔄 **自動セーブ** | 毎投後にゲーム状態を保存 |
| ▶️ **続きから** | メインメニューの「続ける」ボタンで再開 |
| 🗑️ **セーブ削除** | 設定画面から保存データを削除可能 |
| 📦 **ストレージ** | ブラウザの `localStorage` を使用 — クラウド不要 |

---

### 🏗️ プロジェクト構成

```
Darts/
│
├── 📄 index.html              ← 唯一のエントリーポイント
│
├── 📁 css/                    ← スタイルシート（目的別にモジュール化）
│   ├── 📁 base/               ← リセット、変数、タイポグラフィ
│   ├── 📁 layout/             ← グリッドシステム、レスポンシブ
│   ├── 📁 components/         ← ボタン、モーダル、パネル等
│   ├── 📁 pages/              ← 画面別スタイル
│   └── 📁 themes/             ← 4つのカラーテーマ
│
├── 📁 js/                     ← JavaScript（ドメイン別）
│   ├── 📄 main.js             ← アプリのエントリーポイント
│   ├── 📁 core/               ← ストレージ管理
│   ├── 📁 i18n/               ← 翻訳と言語適用
│   ├── 📁 audio/              ← Web Audioシンセサイザー
│   └── 📁 game/               ← ボード描画・スコアリングエンジン
│
├── 📁 assets/                 ← 静的リソース
│   └── 📁 data/i18n/          ← 言語パック
│
└── 📁 tasks/                  ← 開発タスクノート
```

---

### 📁 ファイル分類

#### 📂 CSSファイル

| カテゴリ | ファイル | 目的 |
|:---|:---|:---|
| **ベース** | `reset.css` | ブラウザスタイルの正規化 |
| **ベース** | `variables.css` | CSSカスタムプロパティ（色、間隔、サイズ） |
| **ベース** | `typography.css` | フォントファミリー、サイズ、行高 |
| **レイアウト** | `grid.css` | Flexbox/Gridレイアウト骨格 |
| **レイアウト** | `responsive.css` | メディアクエリのブレークポイント |
| **コンポーネント** | `buttons.css` | ボタンバリエーション（primary, secondary, ghost, danger） |
| **コンポーネント** | `modal.css` | ポップアップダイアログ |
| **コンポーネント** | `panel.css` | カード/パネルコンテナ |
| **コンポーネント** | `slider.css` | 音量スライダー |
| **コンポーネント** | `toast.css` | 通知トーストメッセージ |
| **ページ** | `main-menu.css` | メインメニューのレイアウトとアニメーション |
| **ページ** | `gameplay.css` | ゲーム画面レイアウト |
| **ページ** | `settings.css` | 設定画面レイアウト |
| **ページ** | `instructions.css` | 説明画面レイアウト |
| **ページ** | `result.css` | 試合結果画面 |
| **テーマ** | `theme-classic.css` | 🪵 クラシックパブの配色 |
| **テーマ** | `theme-neon.css` | 💜 ネオンアーケードの配色 |
| **テーマ** | `theme-sakura.css` | 🌸 桜パステルの配色 |
| **テーマ** | `theme-dark.css` | 🌙 ダークスチールの配色 |

#### 📂 JavaScriptファイル

| カテゴリ | ファイル | 目的 |
|:---|:---|:---|
| **エントリー** | `main.js` | アプリ初期化、シーン管理、ゲームループ、AI、入力処理 |
| **コア** | `storageManager.js` | `localStorage`の設定・セーブデータ管理 |
| **i18n** | `translations.js` | 全翻訳文字列（zh-TW、en-US、ja-JP） |
| **i18n** | `i18nApply.js` | `data-i18n`属性によるDOM テキスト置換 |
| **オーディオ** | `audioManager.js` | Web Audio APIシンセサイザー（BGM、SFX、ゲイン制御） |
| **ゲーム** | `dartboardRenderer.js` | SVGダーツボード描画（ウェッジ幾何学、ヒットゾーン） |
| **ゲーム** | `scoringEngine.js` | 全5モードのスコアリングロジック |

---

### 🛠️ 技術スタック

| 技術 | 用途 |
|:---|:---|
| **HTML5** | セマンティック構造、`data-i18n`属性 |
| **CSS3** | カスタムプロパティ、Flexbox、Grid、`clamp()` |
| **Vanilla JS (ES6+)** | フレームワーク不使用 — 純粋なJavaScript + IIFEモジュール |
| **SVG** | ウェッジパス計算によるダーツボード描画 |
| **Web Audio API** | リアルタイム音声合成（オシレーター、ゲインノード、コンプレッサー） |
| **localStorage** | 設定とゲーム状態の永続化 |

---

### 📱 レスポンシブデザイン

| デバイス | 幅 | レイアウト |
|:---|:---|:---|
| 📱 スマホ（縦向き） | ≤ 480px | 1カラム、ボード中央、コントロール下部 |
| 📱 スマホ（横向き） | 481–768px | ボード＋情報を左右配置 |
| 📱 タブレット | 769–1024px | 拡大ボード＋固定サイドバー |
| 🖥️ デスクトップ | ≥ 1025px | 3カラムフルレイアウト |

---

### ♿ アクセシビリティ

- ✅ キーボードで操作可能（Tab + Enter）
- ✅ 全インタラクティブ要素にARIAラベル付与
- ✅ WCAG AAコントラスト比準拠
- ✅ 最小44×44pxタッチターゲット
- ✅ `aria-live`リージョンでスクリーンリーダー対応
- ✅ 音声を完全にオフにしてもゲームプレイに影響なし

---

<!-- ═══════════════════════════════════════════════════ -->
<!-- ██████████  繁 體 中 文  ██████████ -->
<!-- ═══════════════════════════════════════════════════ -->

# 🇹🇼 繁體中文

## 📑 目錄

| 章節 | 說明 |
|:---|:---|
| [✨ 功能特色](#-功能特色) | 主要功能一覽 |
| [🚀 快速開始](#-快速開始) | 如何啟動遊戲 |
| [🎮 遊戲介紹](#-遊戲介紹) | 這是什麼遊戲？ |
| [🕹️ 遊戲玩法](#️-遊戲玩法) | 操作方式與投擲機制 |
| [📏 遊戲模式與規則](#-遊戲模式與規則) | 501 / 301 / 701 / Cricket / Around the Clock |
| [🎨 主題與自訂](#-主題與自訂) | 視覺主題與語言設定 |
| [🔊 音效系統](#-音效系統) | BGM 與音效 |
| [💾 存檔系統](#-存檔系統) | 自動存檔與繼續遊戲 |
| [🏗️ 專案架構](#️-專案架構) | 資料夾結構總覽 |
| [📁 檔案分類](#-檔案分類) | 各檔案詳細說明 |
| [🛠️ 技術棧](#️-技術棧) | 使用的技術 |
| [📱 響應式設計](#-響應式設計) | 多裝置支援 |
| [♿ 無障礙設計](#-無障礙設計) | 無障礙功能 |

---

### ✨ 功能特色

| 功能 | 說明 |
|:---|:---|
| 🎯 **5 種遊戲模式** | 501、301、701、Cricket、Around the Clock |
| 🤖 **AI 對手** | 1–3 個 AI 玩家，可選簡單 / 普通 / 困難 |
| 🎨 **4 種視覺主題** | 經典木紋、霓虹電競、櫻花、深色鋼鐵 |
| 🌐 **3 種語言** | 英文、日文、繁體中文 |
| 🔊 **合成音效** | 使用 Web Audio API 即時合成 BGM 與音效 — 無需外部音檔 |
| 📱 **完全響應式** | 支援桌機、平板、手機 |
| 💾 **自動存檔** | 遊戲進度自動存入 `localStorage` |
| 🔌 **100% 離線** | 不需伺服器、不需 CDN、不需安裝 — 直接開啟 `index.html` |
| ♿ **無障礙支援** | 鍵盤操作、WCAG 對比度、語意化 HTML |

---

### 🚀 快速開始

```
1.  複製或下載此專案
2.  雙擊  index.html
3.  開始遊戲！ 🎯
```

> **需求：** 任何現代瀏覽器（Chrome、Edge、Firefox、Safari）。
> 不需要 Node.js、npm、伺服器或建置工具。

---

### 🎮 遊戲介紹

**Darts** 是一款在瀏覽器中完整重現的經典酒吧風格飛鏢遊戲。採用**擬真 SVG 飛鏢靶**，具備精確的計分區域（Single、Double、Triple、Outer Bull、Bullseye），並有流暢的弧形飛行投擲動畫。

遊戲支援**本機多人對戰**（1 位人類玩家 + 最多 3 個 AI 對手），提供五種正式飛鏢玩法。所有 UI 文字支援英文、日文、繁體中文三語即時切換。

---

### 🕹️ 遊戲玩法

#### 🖱️ 桌機操作（滑鼠）

| 步驟 | 操作 |
|:---:|:---|
| **1** | 🎯 在飛鏢靶上移動滑鼠進行瞄準 |
| **2** | 🖱️ 按住滑鼠左鍵蓄力 |
| **3** | 💨 放開即投擲 — 飛鏢沿弧線飛向目標 |

#### 📱 手機操作（觸控）

| 步驟 | 操作 |
|:---:|:---|
| **1** | 👆 在飛鏢靶上觸碰並按住進行瞄準 |
| **2** | ⬇️ 手指向下滑動蓄力 |
| **3** | 💨 放開手指即投擲 |

#### ⌨️ 鍵盤操作

| 按鍵 | 操作 |
|:---|:---|
| `方向鍵` | 移動瞄準準心 |
| `Space` / `Enter` | 投擲飛鏢 |

#### 🎯 飛鏢靶面構成

```
    ┌─────────────────────────┐
    │      脫靶 (0 分)         │  ← 靶面外
    │  ┌───────────────────┐  │
    │  │  雙倍環 (×2)       │  │  ← 最外圈計分環
    │  │  ┌─────────────┐  │  │
    │  │  │  單倍區      │  │  │  ← 大面積單倍計分區
    │  │  │  ┌─────────┐ │  │  │
    │  │  │  │三倍環 ×3│ │  │  │  ← 內圈細環
    │  │  │  │ ┌─────┐  │ │  │  │
    │  │  │  │ │ 25分│  │ │  │  │  ← 外靶心
    │  │  │  │ │ 50分│  │ │  │  │  ← 紅心（Bullseye）
    │  │  │  │ │ └──┘ │  │ │  │  │
    └──┴──┴──┴─┴──────┴──┴─┴──┘
```

---

### 📏 遊戲模式與規則

#### 🔢 501 / 301（雙倍結束）

| 項目 | 說明 |
|:---|:---|
| **起始分數** | 501 或 301 |
| **每回合** | 每位玩家投 3 鏢 |
| **目標** | 將分數精確減至 **0** |
| **勝利條件** | 最後一鏢必須命中 **雙倍環** 或 **紅心 Bullseye** |
| **爆分（Bust）** | 分數低於 0、等於 1、或未以雙倍歸零 → 該回合分數作廢 |

#### 🔢 701（精準歸零）

| 項目 | 說明 |
|:---|:---|
| **起始分數** | 701 |
| **勝利條件** | 精確歸 **0** 即可（不需要雙倍結束） |

#### 🏏 Cricket（板球飛鏢）

| 項目 | 說明 |
|:---|:---|
| **目標數字** | 15、16、17、18、19、20、Bullseye |
| **開啟** | 命中同一數字 3 次即「開啟」 |
| **計分** | 開啟後額外命中可計分（對手尚未關閉該數字時） |
| **勝利條件** | 全部數字開啟 ＋ 最高分 |

#### 🔄 Around the Clock（繞圈模式）

| 項目 | 說明 |
|:---|:---|
| **目標** | 依序命中 1 → 2 → 3 → … → 20 → Bullseye |
| **適合** | 單人練習、瞄準訓練 |

---

### 🎨 主題與自訂

| 主題 | 配色 | 風格 |
|:---|:---|:---|
| 🪵 **經典木紋** | 深木紋棕 + 酒紅 + 金色點綴 | 傳統酒吧飛鏢場景 |
| 💜 **霓虹電競** | 深紫黑 + 螢光藍/粉 | 賽博龐克電競風 |
| 🌸 **櫻花** | 米白 + 粉藕色 + 淺綠 | 日系柔和清新 |
| 🌙 **深色鋼鐵** | 深灰藍 + 低飽和橘 | 夜間護眼模式 |

> 隨時可在**設定 → 主題**中切換。

---

### 🔊 音效系統

遊戲使用 **Web Audio API** 即時合成所有音效 — 不需載入外部音檔。

| 音效 | 觸發時機 | 風格 |
|:---|:---|:---|
| 🎹 BGM（選單） | 主選單畫面 | 輕快鋼琴旋律 |
| 🎹 BGM（遊戲） | 遊戲進行中 | 輕柔節奏伴奏 |
| 🎹 BGM（結果） | 對局結果畫面 | 明亮鋼琴變奏 |
| 🔔 點擊 | UI 按鈕按下 | 短促高音「叮」 |
| 💨 投擲 | 飛鏢出手 | 輕柔「咻」聲 |
| 🎯 命中 | 飛鏢著靶 | 清脆木質「叩」聲 |
| ⭐ 紅心 | 命中靶心 | 明亮「叮鈴」+ 閃光 |
| ❌ 爆分 | 分數溢出 | 下降音階 |
| 🏆 勝利 | 對局獲勝 | 上揚鋼琴琶音 |

---

### 💾 存檔系統

| 功能 | 說明 |
|:---|:---|
| 🔄 **自動存檔** | 每次投擲後自動儲存遊戲狀態 |
| ▶️ **繼續遊戲** | 從主選單的「繼續遊戲」按鈕恢復進度 |
| 🗑️ **清除存檔** | 可在設定頁面中刪除存檔資料 |
| 📦 **儲存方式** | 使用瀏覽器 `localStorage` — 不需雲端 |

---

### 🏗️ 專案架構

```
Darts/
│
├── 📄 index.html              ← 唯一進入點（雙擊即可遊玩）
│
├── 📁 css/                    ← 樣式表（依功能模組化）
│   ├── 📁 base/               ← 重置、變數、字體排版
│   ├── 📁 layout/             ← 格線系統、響應式斷點
│   ├── 📁 components/         ← 按鈕、彈窗、面板、滑桿、提示
│   ├── 📁 pages/              ← 各畫面專屬樣式
│   └── 📁 themes/             ← 4 組色彩主題
│
├── 📁 js/                     ← JavaScript（依功能領域分類）
│   ├── 📄 main.js             ← 應用程式進入點與總控
│   ├── 📁 core/               ← 儲存管理
│   ├── 📁 i18n/               ← 翻譯與語言套用
│   ├── 📁 audio/              ← Web Audio 合成器
│   └── 📁 game/               ← 靶面繪製與計分引擎
│
├── 📁 assets/                 ← 靜態資源
│   └── 📁 data/i18n/          ← 語言包（zh-TW、en-US、ja-JP）
│
└── 📁 tasks/                  ← 開發任務筆記
```

---

### 📁 檔案分類

#### 📂 CSS 檔案

| 分類 | 檔案 | 用途 |
|:---|:---|:---|
| **基礎** | `reset.css` | 瀏覽器樣式正規化 |
| **基礎** | `variables.css` | CSS 自訂屬性（顏色、間距、尺寸） |
| **基礎** | `typography.css` | 字體家族、字級、行高 |
| **佈局** | `grid.css` | Flexbox / Grid 骨架 |
| **佈局** | `responsive.css` | 各斷點媒體查詢 |
| **元件** | `buttons.css` | 按鈕變體（主要、次要、幽靈、危險） |
| **元件** | `modal.css` | 彈出對話框樣式 |
| **元件** | `panel.css` | 卡片 / 面板容器 |
| **元件** | `slider.css` | 音量滑桿樣式 |
| **元件** | `toast.css` | 通知提示訊息 |
| **頁面** | `main-menu.css` | 主選單佈局與動畫 |
| **頁面** | `gameplay.css` | 遊戲畫面佈局（靶面 + 側欄） |
| **頁面** | `settings.css` | 設定畫面佈局 |
| **頁面** | `instructions.css` | 說明畫面佈局 |
| **頁面** | `result.css` | 對局結果畫面 |
| **主題** | `theme-classic.css` | 🪵 經典酒吧配色 |
| **主題** | `theme-neon.css` | 💜 霓虹電競配色 |
| **主題** | `theme-sakura.css` | 🌸 櫻花粉彩配色 |
| **主題** | `theme-dark.css` | 🌙 深色鋼鐵配色 |

#### 📂 JavaScript 檔案

| 分類 | 檔案 | 用途 |
|:---|:---|:---|
| **進入點** | `main.js` | 應用程式初始化、場景管理、遊戲迴圈、AI 邏輯、輸入處理 |
| **核心** | `storageManager.js` | `localStorage` 設定與存檔讀寫 |
| **i18n** | `translations.js` | 全部翻譯字串（zh-TW、en-US、ja-JP） |
| **i18n** | `i18nApply.js` | 透過 `data-i18n` 屬性替換 DOM 文字 |
| **音效** | `audioManager.js` | Web Audio API 合成器（BGM 樂句、SFX 音調、增益 / 壓縮器） |
| **遊戲** | `dartboardRenderer.js` | SVG 飛鏢靶繪製（扇形幾何、命中區域、飛鏢標記） |
| **遊戲** | `scoringEngine.js` | 全 5 種模式的計分邏輯（爆分、雙倍結束、Cricket 記號等） |

---

### 🛠️ 技術棧

| 技術 | 用途 |
|:---|:---|
| **HTML5** | 語意化結構、`data-i18n` 屬性 |
| **CSS3** | 自訂屬性、Flexbox、Grid、`clamp()`、媒體查詢 |
| **Vanilla JS (ES6+)** | 不依賴框架 — 純 JavaScript + IIFE 模組 |
| **SVG** | 扇形路徑計算繪製飛鏢靶 |
| **Web Audio API** | 即時音效合成（振盪器、增益節點、動態壓縮器） |
| **localStorage** | 設定與遊戲狀態持久化 |

---

### 📱 響應式設計

| 裝置 | 寬度 | 佈局 |
|:---|:---|:---|
| 📱 手機（直向） | ≤ 480px | 單欄、靶面置中、控制項在底部 |
| 📱 手機（橫向） | 481–768px | 靶面與資訊左右並排 |
| 📱 平板 | 769–1024px | 放大靶面 + 固定側欄 |
| 🖥️ 桌機 | ≥ 1025px | 三欄完整佈局 |

---

### ♿ 無障礙設計

- ✅ 支援鍵盤操作（Tab + Enter）
- ✅ 所有互動元素皆附 ARIA 標籤
- ✅ 符合 WCAG AA 對比度規範
- ✅ 最小觸控目標 44×44px
- ✅ 以 `aria-live` 區域支援螢幕閱讀器
- ✅ 音效可完全關閉，不影響遊戲進行

---

<p align="center">
  <sub>Made with ❤️ — Just open <code>index.html</code> and play!</sub>
</p>
