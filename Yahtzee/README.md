# 🎲 Yahtzee / 快艇骰子 / ヨットダイス

純前端、零建置、可離線執行的 Yahtzee 網頁遊戲。  
A no-build, offline-ready Yahtzee web game built with Vanilla HTML/CSS/JavaScript.  
ビルド不要でオフライン実行できる Vanilla HTML/CSS/JavaScript 製 Yahtzee Web ゲームです。

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

**Yahtzee Dice Duel** is a single-player web version of Yahtzee where the player competes against an AI opponent. The game is designed to run directly from `index.html` without a build process, making it suitable for local play, offline demos, and simple static hosting.

| Item | Details |
|---|---|
| Genre | Turn-based dice scoring game |
| Mode | Player vs AI |
| AI Difficulties | Easy, Normal, Hard |
| Rounds | 13 rounds |
| Dice | 5 dice |
| Max Rolls Per Turn | 3 rolls |
| Save System | Browser `localStorage` |
| Languages | Traditional Chinese, English, Japanese |
| Audio | Web Audio generated BGM/SFX |
| UI | Responsive layout for desktop, tablet, and mobile |

#### ✨ Main Features

| Feature | Description |
|---|---|
| 🎲 Complete Yahtzee scoring | Upper section, lower section, upper bonus, Yahtzee bonus |
| 🤖 AI opponent | Three difficulty levels with different hold and scoring behavior |
| 💾 Continue game | Save and restore in-progress matches through `localStorage` |
| 🌐 i18n | Live language switching between Chinese, English, and Japanese |
| 🎨 Themes | Ocean, Sunset, Forest, Grape, and Dark themes |
| 🔊 Audio | Generated BGM/SFX with independent volume and mute controls |
| 📱 RWD | Mobile-safe controls and responsive score/instruction layouts |

<a id="en-rules"></a>

### 📖 How to Play

#### 🎯 Objective

Play 13 rounds against the AI. At the end of the game, the side with the higher total score wins.

#### 🔁 Turn Flow

| Step | Action |
|---:|---|
| 1 | Roll all 5 dice. |
| 2 | Choose dice to hold. |
| 3 | Reroll unheld dice up to 2 more times. |
| 4 | Select one unused score category. |
| 5 | The AI takes its turn. |
| 6 | Repeat until all 13 categories are filled. |

#### 🧮 Upper Section

| Icon | Category | Scoring |
|---:|---|---|
| ⚀ | Ones | Sum of all 1s |
| ⚁ | Twos | Sum of all 2s |
| ⚂ | Threes | Sum of all 3s |
| ⚃ | Fours | Sum of all 4s |
| ⚄ | Fives | Sum of all 5s |
| ⚅ | Sixes | Sum of all 6s |

**Upper Bonus:** If the upper section subtotal reaches **63 or more**, gain **+35 points**.

#### 🃏 Lower Section

| Icon | Category | Requirement | Score |
|---:|---|---|---:|
| 3× | Three of a Kind | At least 3 matching dice | Sum of all dice |
| 4× | Four of a Kind | At least 4 matching dice | Sum of all dice |
| ⌂ | Full House | 3 matching + 2 matching | 25 |
| ↗4 | Small Straight | 4 consecutive numbers | 30 |
| ↗5 | Large Straight | 5 consecutive numbers | 40 |
| ★ | Yahtzee | 5 matching dice | 50 |
| ? | Chance | Any dice | Sum of all dice |

#### ⭐ Yahtzee Bonus

After scoring **50 points** in the Yahtzee category, every later Yahtzee grants an extra **+100 bonus points**.

#### 🤖 AI Difficulty

| Difficulty | Behavior |
|---|---|
| Easy | More random, suitable for learning |
| Normal | Chases visible high scores and upper-section value |
| Hard | Plans for Yahtzee, straights, and upper bonus strategy |

<a id="en-program"></a>

### 🧩 Program Introduction

This project uses plain browser technologies only:

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Modules | Classic `<script>` loading with global `YZ` namespace |
| Storage | `localStorage` |
| Audio | Web Audio API |

#### 🧠 Architecture Summary

| System | Responsibility |
|---|---|
| `YZ.Constants` | Global constants, score categories, themes, languages |
| `YZ.Dice` | Dice rolling, rerolling, counting, and display helpers |
| `YZ.Scoring` | Yahtzee scoring rules and total calculation |
| `YZ.State` | Current game state and serialization |
| `YZ.Game` | Turn flow, player actions, AI turns, game result |
| `YZ.AI.*` | Easy, Normal, and Hard AI strategies |
| `YZ.Audio` | Generated BGM/SFX and volume control |
| `YZ.Save` | Save/load game state and preferences |
| `YZ.I18n` | Language switching and text lookup |
| `YZ.*UI` | Screen rendering and interaction binding |

#### 🔄 Screen Flow

```text
Main Menu
  ├─ Start Game → Difficulty Select → Game
  ├─ Continue Game → Game
  ├─ Instructions
  └─ Settings

Game
  ├─ Player Turn
  ├─ AI Turn
  ├─ Auto Save
  └─ Result Modal
```

#### 💾 Save Data

| Key | Purpose |
|---|---|
| `yz.save.game` | Current match progress |
| `yz.pref.lang` | Current language |
| `yz.pref.theme` | Selected theme |
| `yz.pref.vol.bgm` | BGM volume |
| `yz.pref.vol.sfx` | SFX volume |
| `yz.pref.mute` | Master mute |
| `yz.pref.difficulty` | Default difficulty |
| `yz.pref.fontScale` | Text size |

<a id="en-structure"></a>

### 🗂️ Code Structure

```text
Yahtzee/
├── index.html
├── README.md
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── variables.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── dice.css
│   │   ├── modal.css
│   │   ├── scorecard.css
│   │   ├── slider.css
│   │   └── toggle.css
│   ├── layout/
│   │   ├── app.css
│   │   ├── game.css
│   │   ├── instructions.css
│   │   ├── main-menu.css
│   │   └── settings.css
│   ├── responsive/
│   │   └── responsive.css
│   └── themes/
│       ├── theme-dark.css
│       ├── theme-forest.css
│       ├── theme-grape.css
│       ├── theme-ocean.css
│       └── theme-sunset.css
├── js/
│   ├── ai/
│   ├── audio/
│   ├── core/
│   ├── i18n/
│   ├── storage/
│   ├── ui/
│   └── main.js
└── assets/
    ├── audio/
    ├── fonts/
    └── images/
```

| Folder | Role |
|---|---|
| `css/base/` | Reset, global variables, typography |
| `css/components/` | Reusable UI pieces |
| `css/layout/` | Screen-level layout |
| `css/themes/` | Theme color variables |
| `css/responsive/` | Mobile/tablet/desktop adjustments |
| `js/core/` | Game rules and state |
| `js/ai/` | AI strategies |
| `js/ui/` | Rendering and DOM events |
| `js/audio/` | BGM/SFX manager |
| `js/i18n/` | Language tables and translation logic |
| `js/storage/` | Save and preference management |

---

<a id="ja-intro"></a>

## 🇯🇵 日本語

### 🎮 ゲーム紹介

**ヨットダイス**は、プレイヤーが AI と対戦する Yahtzee 系のダイスゲームです。`index.html` をブラウザで直接開くだけで遊べるように作られており、ビルド、Node.js、開発サーバーは不要です。

| 項目 | 内容 |
|---|---|
| ジャンル | ターン制ダイス得点ゲーム |
| モード | プレイヤー vs AI |
| AI 難易度 | かんたん、ふつう、むずかしい |
| ラウンド数 | 13 ラウンド |
| ダイス数 | 5 個 |
| 1 ターンの最大ロール数 | 3 回 |
| 保存方式 | ブラウザの `localStorage` |
| 対応言語 | 繁体字中国語、英語、日本語 |
| 音声 | Web Audio による BGM/SFX |
| 画面 | PC、タブレット、スマートフォン対応 |

#### ✨ 主な機能

| 機能 | 内容 |
|---|---|
| 🎲 完整な得点計算 | 上段、下段、上段ボーナス、Yahtzee ボーナス |
| 🤖 AI 対戦 | 3 種類の難易度で異なる判断 |
| 💾 続きから遊ぶ | `localStorage` に進行状況を保存 |
| 🌐 多言語 | 中国語、英語、日本語を即時切り替え |
| 🎨 テーマ | Ocean、Sunset、Forest、Grape、Dark |
| 🔊 音声 | BGM/SFX、音量調整、ミュート |
| 📱 RWD | モバイルでも操作しやすいレイアウト |

<a id="ja-rules"></a>

### 📖 遊び方

#### 🎯 目的

13 ラウンド終了時に、合計点が AI より高ければ勝利です。

#### 🔁 ターンの流れ

| 手順 | 操作 |
|---:|---|
| 1 | 5 個のダイスを振る |
| 2 | 残したいダイスをキープする |
| 3 | キープしていないダイスを最大 2 回まで振り直す |
| 4 | 未使用の得点カテゴリを 1 つ選ぶ |
| 5 | AI がターンを行う |
| 6 | 13 カテゴリがすべて埋まるまで続ける |

#### 🧮 上段

| アイコン | カテゴリ | 得点方法 |
|---:|---|---|
| ⚀ | エース | 1 の合計 |
| ⚁ | ツー | 2 の合計 |
| ⚂ | スリー | 3 の合計 |
| ⚃ | フォー | 4 の合計 |
| ⚄ | ファイブ | 5 の合計 |
| ⚅ | シックス | 6 の合計 |

**上段ボーナス:** 上段合計が **63 点以上**なら **+35 点**。

#### 🃏 下段

| アイコン | カテゴリ | 条件 | 得点 |
|---:|---|---|---:|
| 3× | スリーカード | 同じ目 3 個以上 | 全ダイス合計 |
| 4× | フォーカード | 同じ目 4 個以上 | 全ダイス合計 |
| ⌂ | フルハウス | 3 個 + 2 個 | 25 |
| ↗4 | 小ストレート | 4 連続 | 30 |
| ↗5 | 大ストレート | 5 連続 | 40 |
| ★ | ヨット | 同じ目 5 個 | 50 |
| ? | チャンス | 条件なし | 全ダイス合計 |

#### ⭐ Yahtzee ボーナス

Yahtzee 欄で **50 点**を取った後、再び Yahtzee を出すたびに **+100 点**が追加されます。

#### 🤖 AI 難易度

| 難易度 | 挙動 |
|---|---|
| かんたん | ランダム性が高く、練習向け |
| ふつう | 高得点と上段を意識 |
| むずかしい | Yahtzee、ストレート、上段ボーナスを計画 |

<a id="ja-program"></a>

### 🧩 プログラム紹介

このプロジェクトは、ブラウザ標準技術だけで構成されています。

| レイヤー | 技術 |
|---|---|
| HTML | HTML5 |
| CSS | CSS3 |
| JavaScript | Vanilla JavaScript |
| モジュール方式 | classic `<script>` + グローバル `YZ` 名前空間 |
| 保存 | `localStorage` |
| 音声 | Web Audio API |

#### 🧠 アーキテクチャ

| システム | 役割 |
|---|---|
| `YZ.Constants` | 定数、得点カテゴリ、テーマ、言語 |
| `YZ.Dice` | ダイスのロール、振り直し、集計 |
| `YZ.Scoring` | 得点ルールと合計点 |
| `YZ.State` | ゲーム状態の保持と復元 |
| `YZ.Game` | ターン進行、勝敗判定 |
| `YZ.AI.*` | AI 戦略 |
| `YZ.Audio` | BGM/SFX、音量制御 |
| `YZ.Save` | 保存と設定 |
| `YZ.I18n` | 多言語切り替え |
| `YZ.*UI` | 画面描画と操作イベント |

#### 🔄 画面遷移

```text
メインメニュー
  ├─ ゲーム開始 → 難易度選択 → ゲーム
  ├─ 続きから → ゲーム
  ├─ 遊び方
  └─ 設定

ゲーム
  ├─ プレイヤーの番
  ├─ AI の番
  ├─ 自動保存
  └─ 結果ダイアログ
```

<a id="ja-structure"></a>

### 🗂️ プログラム構成

| 分類 | 内容 |
|---|---|
| `css/base/` | リセット、変数、文字設定 |
| `css/components/` | ボタン、ダイス、スコアカードなど |
| `css/layout/` | 各画面のレイアウト |
| `css/themes/` | テーマカラー |
| `css/responsive/` | RWD 調整 |
| `js/core/` | ルール、状態、ゲーム進行 |
| `js/ai/` | AI 難易度別ロジック |
| `js/ui/` | DOM 描画とイベント |
| `js/audio/` | 音声管理 |
| `js/i18n/` | 言語データと翻訳処理 |
| `js/storage/` | セーブと設定保存 |

---

<a id="zh-intro"></a>

## 🇹🇼 繁體中文

### 🎮 遊戲介紹

**快艇骰子**是一款玩家對戰 AI 的 Yahtzee 網頁遊戲。專案採用純前端架構，可以直接開啟 `index.html` 遊玩，不需要 Node.js、不需要 build、不需要開發伺服器，也能離線執行。

| 項目 | 說明 |
|---|---|
| 類型 | 回合制骰子計分遊戲 |
| 模式 | 玩家 vs AI |
| AI 難度 | 簡單、普通、困難 |
| 回合數 | 13 回合 |
| 骰子數 | 5 顆 |
| 每回合最多擲骰 | 3 次 |
| 儲存方式 | 瀏覽器 `localStorage` |
| 支援語言 | 繁體中文、英文、日文 |
| 音效 | Web Audio 產生 BGM/SFX |
| 介面 | 支援桌面、平板、手機 RWD |

#### ✨ 主要特色

| 特色 | 說明 |
|---|---|
| 🎲 完整 Yahtzee 規則 | 上段、下段、上段獎勵、快艇額外獎勵 |
| 🤖 AI 對戰 | 三種 AI 難度，各有不同策略 |
| 💾 繼續遊戲 | 使用 `localStorage` 保存進度 |
| 🌐 多國語系 | 中文、英文、日文即時切換 |
| 🎨 主題切換 | Ocean、Sunset、Forest、Grape、Dark |
| 🔊 音訊系統 | BGM/SFX、音量控制、靜音 |
| 📱 響應式設計 | 手機版操作列與說明頁皆針對小螢幕調整 |

<a id="zh-rules"></a>

### 📖 遊戲玩法

#### 🎯 遊戲目標

玩家與 AI 各自完成 13 個計分項目。遊戲結束時，總分較高者獲勝。

#### 🔁 回合流程

| 步驟 | 操作 |
|---:|---|
| 1 | 第一次擲出 5 顆骰子 |
| 2 | 點選想保留的骰子 |
| 3 | 最多再重擲未保留骰子 2 次 |
| 4 | 選擇一個尚未填寫的計分項目 |
| 5 | AI 進行它的回合 |
| 6 | 重複直到 13 個項目都填完 |

#### 🧮 上段計分

| 圖示 | 項目 | 計分方式 |
|---:|---|---|
| ⚀ | 一點 | 所有 1 的總和 |
| ⚁ | 二點 | 所有 2 的總和 |
| ⚂ | 三點 | 所有 3 的總和 |
| ⚃ | 四點 | 所有 4 的總和 |
| ⚄ | 五點 | 所有 5 的總和 |
| ⚅ | 六點 | 所有 6 的總和 |

**上段獎勵:** 上段六項合計達 **63 分以上**，額外加 **35 分**。

#### 🃏 下段計分

| 圖示 | 項目 | 條件 | 分數 |
|---:|---|---|---:|
| 3× | 三條 | 至少 3 顆相同 | 五顆總和 |
| 4× | 四條 | 至少 4 顆相同 | 五顆總和 |
| ⌂ | 葫蘆 | 3 顆相同 + 2 顆相同 | 25 |
| ↗4 | 小順 | 4 顆連續 | 30 |
| ↗5 | 大順 | 5 顆連續 | 40 |
| ★ | 快艇 | 5 顆全相同 | 50 |
| ? | 機會 | 無條件 | 五顆總和 |

#### ⭐ 快艇獎勵

如果快艇格已拿到 **50 分**，之後每次再擲出快艇，都會額外加 **100 分**。

#### 🤖 AI 難度

| 難度 | 行為 |
|---|---|
| 簡單 | 較隨機，適合熟悉規則 |
| 普通 | 會追求明顯高分與上段價值 |
| 困難 | 會規劃快艇、順子與上段獎勵 |

<a id="zh-program"></a>

### 🧩 程式介紹

本專案完全使用瀏覽器原生技術，不依賴框架或打包工具。

| 層級 | 技術 |
|---|---|
| 標記 | HTML5 |
| 樣式 | CSS3 |
| 邏輯 | Vanilla JavaScript |
| 載入方式 | classic `<script>` + 全域 `YZ` 命名空間 |
| 儲存 | `localStorage` |
| 音訊 | Web Audio API |

#### 🧠 架構概念

| 系統 | 負責內容 |
|---|---|
| `YZ.Constants` | 常數、計分項、主題、語系 |
| `YZ.Dice` | 擲骰、重擲、骰面統計 |
| `YZ.Scoring` | Yahtzee 計分規則與總分 |
| `YZ.State` | 遊戲狀態、序列化與還原 |
| `YZ.Game` | 玩家回合、AI 回合、結算 |
| `YZ.AI.*` | 三種 AI 策略 |
| `YZ.Audio` | BGM/SFX、音量與靜音 |
| `YZ.Save` | 存檔與設定保存 |
| `YZ.I18n` | 語系切換與文字取得 |
| `YZ.*UI` | 畫面渲染與事件綁定 |

#### 🔄 畫面流程

```text
主選單
  ├─ 開始遊戲 → 選擇難度 → 遊戲畫面
  ├─ 繼續遊戲 → 遊戲畫面
  ├─ 遊戲說明
  └─ 設定

遊戲畫面
  ├─ 玩家回合
  ├─ AI 回合
  ├─ 自動存檔
  └─ 結果彈窗
```

#### 💾 儲存資料

| Key | 用途 |
|---|---|
| `yz.save.game` | 目前牌局進度 |
| `yz.pref.lang` | 語言 |
| `yz.pref.theme` | 主題 |
| `yz.pref.vol.bgm` | BGM 音量 |
| `yz.pref.vol.sfx` | SFX 音量 |
| `yz.pref.mute` | 總靜音 |
| `yz.pref.difficulty` | 預設難度 |
| `yz.pref.fontScale` | 字體大小 |

<a id="zh-structure"></a>

### 🗂️ 程式分類

```text
Yahtzee/
├── index.html                  # 唯一入口，直接開啟即可遊玩
├── README.md                   # 專案說明
├── css/                        # 樣式
├── js/                         # 遊戲邏輯
└── assets/                     # 預留素材資料夾
```

| 資料夾 | 說明 |
|---|---|
| `css/base/` | reset、全域變數、字體設定 |
| `css/components/` | 按鈕、骰子、計分表、彈窗、滑桿、開關 |
| `css/layout/` | 主選單、遊戲畫面、說明頁、設定頁 |
| `css/themes/` | 五套主題色彩 |
| `css/responsive/` | 手機、平板、桌面響應式調整 |
| `js/core/` | 核心規則、骰子、計分、狀態、遊戲流程 |
| `js/ai/` | AI 共用邏輯與三種難度 |
| `js/ui/` | 畫面渲染與使用者互動 |
| `js/audio/` | 音訊管理與音效設定 |
| `js/i18n/` | 中文、英文、日文語系表 |
| `js/storage/` | localStorage 存讀檔 |
| `assets/` | 音訊、圖片、字型等素材預留位置 |

---

## ✅ Compatibility Notes / 相容性補充 / 互換性メモ

| Topic | Note |
|---|---|
| Direct file opening | Designed for direct `index.html` opening. |
| ES Modules | Not used, to avoid `file://` CORS issues. |
| Audio files | BGM/SFX are generated with Web Audio, so the game works even without external audio files. |
| Save data | Stored in the current browser profile only. |
| Mobile | Uses responsive layout and safe-area-friendly controls. |
