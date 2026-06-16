# Water Sort Puzzle

> Static Web Water Sort Puzzle. No build step is required. Open `index.html` directly or serve the folder with any static HTTP server.

<a id="top"></a>

## Quick Navigation

| Language | Fast links |
|---|---|
| English | [Overview](#en-overview) / [How to Play](#en-how-to-play) / [Program Guide](#en-program-guide) / [File Categories](#en-file-categories) |
| Japanese / 日本語 | [概要](#ja-overview) / [遊び方](#ja-how-to-play) / [プログラム紹介](#ja-program-guide) / [ファイル分類](#ja-file-categories) |
| Chinese / 繁體中文 | [遊戲介紹](#zh-overview) / [遊戲玩法](#zh-how-to-play) / [程式介紹](#zh-program-guide) / [程式分類](#zh-file-categories) |

## Project Snapshot

| Item | Detail |
|---|---|
| Game | Water Sort Puzzle |
| Type | Static HTML / CSS / JavaScript game |
| Primary entry | `index.html` loads `js/standalone.js` |
| Direct open | Supported through `file://` |
| Optional preview server | `python -m http.server 5500` |
| Languages in game | English, Japanese, Traditional Chinese |
| Save system | `localStorage` |
| Audio | Web Audio API generated BGM and SFX |
| Effects | Pour animation, cork seal, splash, confetti, victory fanfare |

## Run

### Option 1: Direct Open

Open this file in a browser:

```text
index.html
```

The shipped entry uses `js/standalone.js`, so it works without a bundler, build tool, or HTTP server.

### Option 2: Local Static Server

```powershell
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/
```

---

<a id="en-overview"></a>

# English - Overview

Water Sort Puzzle is a logic puzzle game about sorting liquid colors into tubes. Each tube can hold four layers. The player wins when every non-empty tube is either empty or fully filled with one color.

## Feature Summary

| Mark | Feature | Detail |
|---|---|---|
| 🎮 | Playable puzzle | Select one tube, then select another tube to pour. |
| 🌐 | Multi-language UI | English, Japanese, and Traditional Chinese are available in Settings. |
| 📏 | Correct pour logic | Only valid Water Sort moves are accepted. |
| 🔒 | Cork seal | A cork is shown only when a tube is full and all four layers are the same color. |
| 💧 | Realistic pour feel | The source tube tilts, liquid follows a curved stream, and the target tube splashes. |
| 🔊 | Sound effects | Select, pour, invalid move, undo, hint, fail, and victory sounds are generated with Web Audio API. |
| 🎵 | Music | Menu and game screens use generated loop melodies. |
| 💾 | Local save | Progress, stars, current game, language, theme, timer, audio, and volume settings are saved locally. |

## Difficulty Table

| Difficulty | Level count | Color count | Notes |
|---|---:|---:|---|
| Easy | 30 | 4-5 | Good for learning basic flow. |
| Normal | 40 | 6-8 | More tubes and more planning. |
| Hard | 50 | 9-12 | Includes stricter scoring and timer pressure. |

[Back to top](#top)

---

<a id="en-how-to-play"></a>

# English - How to Play

## Objective

| Goal | Explanation |
|---|---|
| Complete tubes | A completed tube must contain exactly four layers of the same color. |
| Use empty tubes | Empty tubes are legal and are usually needed as temporary buffers. |
| Preserve solved tubes | Once a tube is solved and corked, keep it intact. |

## Basic Controls

| Step | Action | Result |
|---:|---|---|
| 1 | Click or tap a source tube. | The selected tube lifts up. |
| 2 | Click or tap a target tube. | If the move is legal, liquid pours into the target. |
| 3 | Click the same selected tube again. | The selection is cancelled. |

## Legal Pour Rules

| Situation | Allowed? | Why |
|---|:---:|---|
| Source tube is empty | No | There is no liquid to pour. |
| Target tube is empty | Yes | Empty tubes can receive any top color. |
| Target top color matches source top color | Yes | Same colors can be stacked. |
| Target top color is different | No | Different colors cannot be mixed by a pour. |
| Target tube is full | No | The target has no free slot. |
| Source tube is completed and corked | No | Completed tubes should stay solved. |

## Amount Poured

Only the connected top layers of the same color move.

```text
Source tube top stack: Red / Red / Blue / Yellow
Target tube:           Red with 1 empty slot
Moved amount:          1 Red layer
Reason:                The target has only 1 free slot.
```

## Tools

| Tool | Use |
|---|---|
| Undo | Restores previous states, up to 30 moves. |
| Hint | Searches ahead and highlights a suggested source and target. |
| Restart | Resets the current level. |
| Settings | Changes language, theme, timer display, vibration, music, effects, and volume. |

## Scoring

| Factor | Better score means |
|---|---|
| Moves | Fewer moves. |
| Time | Faster clear. |
| Hint usage | Fewer hints. |
| Undo usage | Fewer undo actions. |
| Hard mode timer | Better remaining time. |

[Back to top](#top)

---

<a id="en-program-guide"></a>

# English - Program Guide

The project keeps both a direct-open standalone implementation and modular ES Module files.

| Implementation | Purpose |
|---|---|
| `js/standalone.js` | Main runtime used by `index.html`. Designed to work when opened directly from disk. |
| `js/main.js` and module folders | Modular version kept for maintainability and future server-based usage. |

## Main Runtime Flow

| Stage | What happens |
|---|---|
| Load settings | Reads `wsp_settings` from `localStorage`; defaults are used if no setting exists. |
| Apply theme/language | Sets `data-theme` and the document language. |
| Route screen | Hash route chooses Home, Levels, Game, Instructions, or Settings. |
| Render UI | Screen functions build the visible interface. |
| Play | Game state changes through pour, undo, hint, restart, win, or fail actions. |
| Save | Current state and progress are written to `localStorage`. |

## Important Systems

| System | Main files | Responsibility |
|---|---|---|
| Game rules | `js/core/PourLogic.js`, `js/core/GameEngine.js` | Valid moves, state transitions, restart, undo. |
| Hint search | `js/core/HintEngine.js` | BFS-style search for a useful next move. |
| Win and stars | `js/core/WinChecker.js` | Completion detection and star rating. |
| Levels | `js/data/levels-*.js`, `js/data/level-factory.js` | Level definitions and generated level sets. |
| UI rendering | `js/ui/TubeRenderer.js`, `js/standalone.js` | Tubes, corks, screens, multilingual text. |
| Animation | `js/ui/AnimationManager.js`, `css/components/tube.css` | Tilt, curved pour stream, splash, highlights. |
| Audio | `js/audio/*.js`, audio section in `js/standalone.js` | Generated BGM and SFX. |
| Storage | `js/storage/*.js`, storage section in `js/standalone.js` | Progress and settings persistence. |

[Back to top](#top)

---

<a id="en-file-categories"></a>

# English - File Categories

| Folder or file | Category | Description |
|---|---|---|
| `index.html` | Entry | Loads CSS and `js/standalone.js`. |
| `README.md` | Documentation | This multilingual guide. |
| `water-sort-puzzle-spec.md` | Specification | Original project specification. |
| `css/base/` | CSS base | Reset, typography, variables. |
| `css/layout/` | Layout | App shell and common screen layout. |
| `css/components/` | Components | Buttons, tubes, modal, HUD, settings, confetti. |
| `css/screens/` | Screen styles | Home, game, instructions, level select. |
| `css/themes/` | Themes | Ocean, Forest, Sunset, Midnight palettes. |
| `css/responsive/` | RWD | Mobile, tablet, and desktop adjustments. |
| `js/standalone.js` | Direct runtime | Main no-server playable implementation. |
| `js/core/` | Core logic | Pour rules, undo, hints, win checks. |
| `js/data/` | Game data | Color palette and Easy/Normal/Hard levels. |
| `js/screens/` | Screen modules | ES Module screen implementation. |
| `js/ui/` | UI helpers | Rendering, animation, modal, confetti, theme. |
| `js/audio/` | Audio | BGM and SFX controllers. |
| `js/storage/` | Persistence | Save and settings managers. |
| `js/router/` | Routing | Hash-based route handling. |

[Back to top](#top)

---

<a id="ja-overview"></a>

# Japanese / 日本語 - 概要

Water Sort Puzzle は、色のついた液体を試験管ごとに整理するロジックパズルです。各試験管は 4 層まで入ります。空でない試験管が、すべて 1 色 4 層になったらクリアです。

## 主な機能

| Mark | 機能 | 説明 |
|---|---|---|
| 🎮 | パズル操作 | 元の試験管を選び、注ぎ先を選びます。 |
| 🌐 | 多言語 UI | 英語、日本語、繁體中文に対応します。 |
| 📏 | 注水ルール | Water Sort Puzzle の基本ルールに従って判定します。 |
| 🔒 | 木栓 | 満杯かつ 4 層すべて同じ色のときだけ栓が付きます。 |
| 💧 | 注水アニメ | 試験管が傾き、弧を描く水流と水しぶきが表示されます。 |
| 🔊 | 効果音 | 選択、注水、無効操作、Undo、ヒント、勝利音があります。 |
| 💾 | 保存 | 進行状況、星評価、設定を localStorage に保存します。 |

## 難易度

| 難易度 | レベル数 | 色数 | 特徴 |
|---|---:|---:|---|
| Easy | 30 | 4-5 | 基本を学びやすい。 |
| Normal | 40 | 6-8 | より多くの計画が必要です。 |
| Hard | 50 | 9-12 | タイマーと評価条件が厳しくなります。 |

[Back to top](#top)

---

<a id="ja-how-to-play"></a>

# Japanese / 日本語 - 遊び方

## 目的

| 目的 | ルール |
|---|---|
| レベルクリア | 空でない試験管を、同じ色 4 層でそろえます。 |
| 空の試験管 | 一時置き場として使えます。 |
| 木栓 | 満杯かつ 4 層すべて同色のときだけ表示されます。 |

## 基本操作

| 手順 | 操作 | 結果 |
|---:|---|---|
| 1 | 元の試験管をクリックまたはタップ。 | 選択された試験管が少し上がります。 |
| 2 | 注ぎ先の試験管をクリックまたはタップ。 | 有効な手なら液体が注がれます。 |
| 3 | 同じ試験管をもう一度選ぶ。 | 選択を解除します。 |

## 注水ルール

| 状況 | 可能? | 理由 |
|---|:---:|---|
| 元の試験管が空 | No | 注ぐ液体がありません。 |
| 注ぎ先が空 | Yes | 空には任意の上色を注げます。 |
| 上色が同じ | Yes | 同じ色は重ねられます。 |
| 上色が違う | No | 違う色の上には注げません。 |
| 注ぎ先が満杯 | No | 空きがありません。 |
| 完成して栓が付いた試験管 | No | 完成済みの試験管は崩しません。 |

## 補助機能

| 機能 | 説明 |
|---|---|
| Undo | 最大 30 手まで戻せます。 |
| Hint | 先読みして、おすすめの元試験管と注ぎ先を強調します。 |
| Restart | 現在のレベルを最初からやり直します。 |
| Settings | 言語、テーマ、タイマー、音量などを変更できます。 |

[Back to top](#top)

---

<a id="ja-program-guide"></a>

# Japanese / 日本語 - プログラム紹介

このプロジェクトには、直接開くための `standalone` 版と、保守用の ES Module 版があります。

| 種類 | 用途 |
|---|---|
| `js/standalone.js` | `index.html` が読み込む実行用ファイル。`file://` で起動できます。 |
| ES Module files | 機能ごとに分割した保守用実装です。 |

| システム | ファイル | 役割 |
|---|---|---|
| コア | `js/core/*.js` | 注水判定、状態管理、Undo、Hint、勝利判定。 |
| データ | `js/data/*.js` | 色パレットとレベルデータ。 |
| UI | `js/ui/*.js` | 試験管描画、アニメーション、紙吹雪。 |
| 音 | `js/audio/*.js` | BGM と効果音。 |
| 保存 | `js/storage/*.js` | 進行状況と設定の保存。 |

[Back to top](#top)

---

<a id="ja-file-categories"></a>

# Japanese / 日本語 - ファイル分類

| フォルダ | 分類 | 内容 |
|---|---|---|
| `css/base/` | CSS 基礎 | Reset、文字、変数。 |
| `css/layout/` | レイアウト | App 全体と画面構造。 |
| `css/components/` | UI 部品 | ボタン、試験管、モーダル、HUD、設定。 |
| `css/screens/` | 画面別 CSS | Home、Game、Instructions、Level Select。 |
| `css/themes/` | テーマ | Ocean、Forest、Sunset、Midnight。 |
| `js/core/` | ロジック | ルールと状態処理。 |
| `js/ui/` | UI 補助 | 描画と演出。 |
| `js/audio/` | 音 | BGM と SFX。 |
| `js/storage/` | 保存 | セーブと設定管理。 |

[Back to top](#top)

---

<a id="zh-overview"></a>

# Chinese / 繁體中文 - 遊戲介紹

Water Sort Puzzle 是一款倒水排色逻輯遊戲。玩家需要把不同顏色的液體整理到各自的試管中。每支完成的試管必須剛好四層同色。

## 功能特色

| 標記 | 功能 | 說明 |
|---|---|---|
| 🎮 | 可遊玩關卡 | 點來源試管，再點目標試管倒水。 |
| 🌐 | 多國語系 | 支援英文、日文、繁體中文。 |
| 📏 | 正確倒水規則 | 依照 Water Sort Puzzle 規則判定合法移動。 |
| 🔒 | 木塞封口 | 只有滿管且四層同色才會蓋木塞。 |
| 💧 | 倒水動畫 | 試管傾斜、弧形水流、落點水花。 |
| 🔊 | 音效與音樂 | 背景音樂、倒水音效、錯誤音、勝利音效。 |
| 💾 | 本機存檔 | 進度、星等、設定保存在 localStorage。 |

## 難度

| 難度 | 關卡數 | 顏色數 | 說明 |
|---|---:|---:|---|
| Easy | 30 | 4-5 | 適合熟悉基本規則。 |
| Normal | 40 | 6-8 | 需要更多規劃。 |
| Hard | 50 | 9-12 | 有更高難度與時間壓力。 |

[Back to top](#top)

---

<a id="zh-how-to-play"></a>

# Chinese / 繁體中文 - 遊戲玩法

## 目標

| 目標 | 規則 |
|---|---|
| 通關 | 每支非空試管都必須剛好四層同色。 |
| 空試管 | 可以保留，也是解題的暫存空間。 |
| 木塞 | 只有滿管且四層都是同色才會蓋上木塞。 |

## 基本操作

| 步驟 | 操作 | 結果 |
|---:|---|---|
| 1 | 點擊來源試管 | 試管會往上抬起，表示已選取。 |
| 2 | 點擊目標試管 | 如果合法，液體會倒入目標試管。 |
| 3 | 再點同一支試管 | 取消選取。 |

## 倒水規則

| 情況 | 是否可倒 | 說明 |
|---|:---:|---|
| 來源試管是空的 | No | 沒有液體可倒。 |
| 目標試管是空的 | Yes | 空試管可以接任何頂端顏色。 |
| 目標頂端與來源頂端同色 | Yes | 同色可以堆疊。 |
| 目標頂端不同色 | No | 不同色不能直接倒在一起。 |
| 目標試管已滿 | No | 沒有空間。 |
| 已完成且封口的試管 | No | 完成的試管不應再被打散。 |

## 補助功能

| 功能 | 說明 |
|---|---|
| Undo | 最多復原 30 步。 |
| Hint | 往後搜尋，提示建議的來源與目標試管。 |
| Restart | 重開目前關卡。 |
| Settings | 調整語言、主題、計時、震動、音樂、音效與音量。 |

[Back to top](#top)

---

<a id="zh-program-guide"></a>

# Chinese / 繁體中文 - 程式介紹

這個專案有兩條 JavaScript 路線：

| 路線 | 用途 |
|---|---|
| `js/standalone.js` | `index.html` 實際載入的版本，可直接雙擊 HTML 執行。 |
| ES Module files | 模組化架構，方便維護、閱讀與後續擴充。 |

| 系統 | 檔案 | 職責 |
|---|---|---|
| 入口 | `index.html`, `js/standalone.js`, `js/main.js` | 啟動遊戲。 |
| 核心規則 | `js/core/*.js` | 倒水判定、遊戲狀態、Undo、提示、勝利判定。 |
| 關卡資料 | `js/data/*.js` | 色盤、Easy/Normal/Hard 關卡。 |
| UI | `js/ui/*.js` | 試管渲染、倒水動畫、彩帶、Modal、主題。 |
| 音訊 | `js/audio/*.js` | 背景音樂與音效。 |
| 儲存 | `js/storage/*.js` | localStorage 進度與設定。 |

[Back to top](#top)

---

<a id="zh-file-categories"></a>

# Chinese / 繁體中文 - 程式分類

| 資料夾 | 分類 | 內容 |
|---|---|---|
| `css/base/` | CSS 基礎 | Reset、字體、變數。 |
| `css/layout/` | 版面 | App 外框與畫面共用布局。 |
| `css/components/` | 元件 | 按鈕、試管、Modal、HUD、設定、彩帶。 |
| `css/screens/` | 畫面樣式 | 首頁、遊戲、說明、關卡選擇。 |
| `css/themes/` | 主題 | Ocean、Forest、Sunset、Midnight。 |
| `css/responsive/` | RWD | 手機、平板、桌面。 |
| `js/core/` | 遊戲逻輯 | 規則與狀態處理。 |
| `js/data/` | 資料 | 關卡與色盤。 |
| `js/ui/` | UI 輔助 | 渲染與動畫效果。 |
| `js/audio/` | 音訊 | BGM 與 SFX。 |
| `js/storage/` | 儲存 | 存檔與設定管理。 |

[Back to top](#top)
