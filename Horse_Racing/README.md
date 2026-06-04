# 🏇 Horse Racing — 賽馬王 / 賽馬王ゲーム

> Pure frontend browser game · 純前端瀏覽器遊戲 · 純フロントエンドブラウザゲーム

---

## Language / 語言 / 言語

| | Jump / 跳轉 / ジャンプ |
|---|---|
| English | [→ English](#english) |
| 繁體中文 | [→ 繁體中文](#繁體中文) |
| 日本語 | [→ 日本語](#日本語) |

---

<a id="english"></a>
# English

## Table of Contents

1. [Overview](#en-overview)
2. [Features](#en-features)
3. [How to Play](#en-how-to-play)
4. [Bet Types](#en-bet-types)
5. [Horse Attributes](#en-horse-attributes)
6. [Game Screens](#en-game-screens)
7. [Uncertainty System](#en-uncertainty-system)
8. [Audio System](#en-audio-system)
9. [Settings](#en-settings)
10. [File Structure](#en-file-structure)
11. [Module Reference](#en-module-reference)

---

<a id="en-overview"></a>
## Overview

Horse Racing is a **browser-based horse racing betting simulation** game that runs entirely in the browser with no installation, no backend, and no build tools required.

| Item | Detail |
|---|---|
| Platform | Desktop & Mobile (RWD, min-width 360 px) |
| Tech stack | Pure HTML + CSS + JavaScript |
| Entry point | `horse_racing.html` |
| Persistence | `localStorage` |
| Dependencies | None (no npm, no framework) |

**Game loop:**
```
Home → Betting → Race → Result → Home (repeat)
```

---

<a id="en-features"></a>
## Features

| Feature | Description |
|---|---|
| Dynamic race | Up to 10 horses compete with real-time Canvas animation |
| Multi-factor uncertainty | Weather, track condition, events, mood, jockey grade |
| Programmatic audio | BGM + SFX generated via Web Audio API — no external audio files |
| Knowledge cards | 15 horse racing knowledge cards to inform your strategy |
| Full RWD | Touch-friendly; adapts from 360 px mobile to desktop |
| LocalStorage save | Chips, win/loss record, settings, and last 20 race histories persist |
| Adjustable settings | Race speed, animation quality, difficulty, volume, and starting chips |

---

<a id="en-how-to-play"></a>
## How to Play

1. **Home** — Check your current chips and win/loss record.
2. **Betting** — Review the race conditions (weather, track, distance) and each horse's attributes, then place your bets.
3. **Race** — Watch the live animation. Random events may shift the outcome at any moment.
4. **Result** — See the finishing order and your payout. A knowledge tip is shown after each race.
5. Repeat — Grow your virtual chip stack across multiple races.

> Chips have no real-money value. This game is for entertainment and education only.

---

<a id="en-bet-types"></a>
## Bet Types

| Bet | Description | Min. Payout |
|---|---|---|
| Win | Pick the 1st place finisher | 1.5× |
| Place | Pick a top-3 finisher | 1.2× |
| Quinella | Pick the top 2 in any order | 3× |
| Trifecta | Pick the exact top 3 in order | 15× |

**Bet limits per race:**

| Rule | Value |
|---|---|
| Minimum bet | $100 |
| Maximum bet | 50% of current chips |
| Maximum bets | 6 per race |
| Total cannot exceed | 100% of current chips |

**Odds formula:**
```
Win Odds = Base Odds × Weather Mod × Track Mod × Mood Mod × Gate Mod
```
Odds update dynamically based on how chips are distributed across horses.

---

<a id="en-horse-attributes"></a>
## Horse Attributes

### Base Stats (scale 1–10)

| Attribute | Role |
|---|---|
| Speed | Base running velocity |
| Stamina | Ability to maintain speed in the later stages |
| Burst | Final sprint acceleration |
| Stability | Resistance to negative random events |
| Turf Affinity | Performance bonus on grass tracks |
| Dirt Affinity | Performance bonus on dirt tracks |
| Short-dist fit | Fitness for 1000–1200 m races |
| Mid-dist fit | Fitness for 1400–1800 m races |
| Long-dist fit | Fitness for 2000 m+ races |

### Per-Race Dynamic Attributes

| Attribute | Range | Description |
|---|---|---|
| Mood | 0.70–1.15 | Randomly generated each race; affected by age and recent form |
| Fitness | 0.80–1.10 | Training condition before the race |
| Jockey Grade | A / B / C | A = +8% bonus; C = −5% penalty + higher error rate |
| Weight | kg | Lower weight gives a small speed advantage |
| Strategy | Frontrun / Balanced / Closer | Affects speed distribution across race segments |

### Race Segments

| Segment | Distance | Key Attribute |
|---|---|---|
| Start | 0–20% | Speed + Gate + Mood |
| Mid | 20–70% | Speed × Stamina decay |
| Sprint | 70–100% | Burst + remaining energy |

---

<a id="en-game-screens"></a>
## Game Screens

| Screen ID | Name | How to reach |
|---|---|---|
| `home` | Home | Default / Logo click |
| `guide` | How to play | Menu button |
| `knowledge` | Racing knowledge | Menu button |
| `settings` | Settings | Menu button |
| `betting` | Bet selection | "Start Game" button |
| `race` | Live race | After confirming bets |
| `result` | Results | After race ends |

All screens switch via `display: none / block` — no DOM reload.

---

<a id="en-uncertainty-system"></a>
## Uncertainty System

### Weather (randomised each race)

| Weather | Probability | Speed Mod | Track Effect |
|---|---|---|---|
| Sunny ☀️ | 40% | ×1.00 | Turf +5% |
| Cloudy ⛅ | 30% | ×1.00 | None |
| Light Rain 🌧 | 20% | ×0.97 | Turf −5%, Dirt +10% |
| Heavy Rain ⛈ | 10% | ×0.92 | Turf −15%, Dirt +20% |

### Track Condition (influenced by weather)

| Condition | Stamina Drain Multiplier |
|---|---|
| Firm | ×0.90 |
| Good | ×1.00 |
| Good to Soft | ×1.10 |
| Soft | ×1.25 |
| Heavy | ×1.40 |

### In-Race Random Events

| Event | Trigger Chance | Speed Effect | Duration |
|---|---|---|---|
| Stumble | 4% | −25% | 30 frames |
| Blocked | 6% | −15% | 20 frames |
| Sudden Burst | 5% | +20% | 15 frames |
| Lane Change | 8% | −5% | 10 frames |
| Startled | 3% | −30% | 40 frames |
| Second Wind | 4% | +15% | 25 frames |

Events only trigger between 20–80% of the race distance. High Stability reduces the chance of negative events. Maximum 2 events per horse per race.

---

<a id="en-audio-system"></a>
## Audio System

All sounds are **programmatically synthesised** using the Web Audio API — no external audio files needed.

| Scene | BGM Style |
|---|---|
| Home | Light jazz (oscillator bass + chord loop) |
| Betting | Tense strings with metronome rhythm |
| Race | Rousing march; tempo accelerates in the final stretch |
| Final stretch | Key modulation + BPM +30% in last 10 seconds |
| Result | Short victory / defeat motif |

**Key sound effects:**

| SFX ID | Trigger |
|---|---|
| `sfx_gate_open` | Race start |
| `sfx_hoofbeat` | Continuous during race |
| `sfx_coin_win` | Winning payout |
| `sfx_coin_lose` | Losing payout |
| `sfx_big_win` | Odds ≥5× win |
| `sfx_game_over` | Chips reach zero |
| `sfx_horse_neigh` | Logo click |

---

<a id="en-settings"></a>
## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| BGM Volume | Slider 0–100 | 60 | Background music volume |
| SFX Volume | Slider 0–100 | 80 | Sound effect volume |
| BGM On/Off | Toggle | On | Mute all BGM |
| SFX On/Off | Toggle | On | Mute all SFX |
| Race Speed | Select | Normal | Slow / Normal / Fast |
| Animation Quality | Select | High | Low / Medium / High (affects Canvas FPS) |
| Starting Chips | Select | 10,000 | Amount on chip reset: 5,000 / 10,000 / 50,000 |
| Difficulty | Select | Normal | Easy (more hints) / Normal / Hard (hides some info) |

---

<a id="en-file-structure"></a>
## File Structure

```
Horse_Racing/
├─ horse_racing.html          ← Single entry point
├─ css/
│  ├─ styles.css              ← @import aggregator
│  ├─ base.css                ← CSS custom properties, reset, fonts
│  ├─ layout.css              ← Grid / flex layouts
│  ├─ components.css          ← Buttons, cards, toast, progress bar
│  └─ responsive.css          ← Breakpoint overrides
└─ js/
   ├─ app.js                  ← Bootstrap & event binding
   ├─ core/
   │  ├─ utils.js             ← Shared utilities (rand, clamp, pick…)
   │  ├─ game-state.js        ← LocalStorage persistence
   │  └─ router.js            ← SPA screen routing
   ├─ data/
   │  └─ knowledge.js         ← 15 horse racing knowledge cards
   ├─ systems/
   │  ├─ uncertainty-system.js← Weather & race events
   │  ├─ horse-engine.js      ← Horse generation & scoring
   │  ├─ betting-system.js    ← Odds calculation & settlement
   │  ├─ audio-engine.js      ← Web Audio API engine
   │  └─ race-simulator.js    ← Physics loop (rAF-based)
   ├─ ui/
   │  ├─ renderer.js          ← Canvas rendering
   │  └─ ui.js                ← DOM rendering helpers
   └─ game/
      └─ game.js              ← Game flow orchestration
```

---

<a id="en-module-reference"></a>
## Module Reference

| Module | File | Responsibility |
|---|---|---|
| `Utils` | `core/utils.js` | `money()`, `clamp()`, `rand()`, `pick()`, `shuffle()` |
| `GameState` | `core/game-state.js` | Load/save to `localStorage`, default values |
| `Router` | `core/router.js` | Screen switching, BGM scene changes |
| `Knowledge` | `data/knowledge.js` | Static knowledge card data array |
| `UncertaintySystem` | `systems/uncertainty-system.js` | Weather, track condition, race events |
| `HorseEngine` | `systems/horse-engine.js` | Generate horses, calculate composite score |
| `BettingSystem` | `systems/betting-system.js` | Odds, dynamic adjustment, payout settlement |
| `AudioEngine` | `systems/audio-engine.js` | BGM scenes, SFX synthesis, volume control |
| `RaceSimulator` | `systems/race-simulator.js` | Per-frame physics: speed, energy, rank |
| `Renderer` | `ui/renderer.js` | Canvas lanes, horse icons, finish line |
| `UI` | `ui/ui.js` | All DOM generation (home, betting, race, result) |
| `Game` | `game/game.js` | Race prep, bet confirm, race finish, stats update |

**Script load order** (dependency-safe):
```
utils → game-state → router → knowledge →
uncertainty-system → horse-engine → betting-system →
audio-engine → race-simulator → renderer → ui → game → app
```

---

<br>

---

<a id="繁體中文"></a>
# 繁體中文

## 目錄

1. [專案概覽](#zh-overview)
2. [核心特色](#zh-features)
3. [玩法說明](#zh-how-to-play)
4. [下注方式](#zh-bet-types)
5. [馬匹屬性](#zh-horse-attributes)
6. [遊戲畫面](#zh-game-screens)
7. [不確定性系統](#zh-uncertainty-system)
8. [音效系統](#zh-audio-system)
9. [遊戲設定](#zh-settings)
10. [檔案結構](#zh-file-structure)
11. [模組說明](#zh-module-reference)

---

<a id="zh-overview"></a>
## 專案概覽

賽馬王是一款**純瀏覽器賽馬下注模擬遊戲**，無需安裝、無後端、無任何建置工具，直接開啟 HTML 檔案即可遊玩。

| 項目 | 說明 |
|---|---|
| 目標平台 | 桌面瀏覽器 / 行動裝置（RWD，最小寬度 360 px） |
| 技術棧 | 純 HTML + CSS + JavaScript |
| 入口檔案 | `horse_racing.html` |
| 資料儲存 | `localStorage` |
| 外部依賴 | 無（不需 npm、不需框架） |

**遊戲流程：**
```
主畫面 → 選馬下注 → 比賽直播 → 結果結算 → 主畫面（循環）
```

---

<a id="zh-features"></a>
## 核心特色

| 特色 | 說明 |
|---|---|
| 動態比賽 | 最多 10 匹馬同場，Canvas 即時動畫 |
| 多維不確定性 | 天氣、跑道、隨機事件、馬匹心情、騎師評級 |
| 程式化音效 | BGM + 音效全由 Web Audio API 合成，無需外部音檔 |
| 賽馬知識卡 | 15 張知識卡片，學習後可提升策略判斷力 |
| 完整 RWD | 觸控友善，支援 360 px 手機到桌機 |
| LocalStorage 存檔 | 籌碼、戰績、設定、最近 20 場紀錄自動儲存 |
| 豐富設定 | 比賽速度、動畫品質、難度、音量、初始籌碼均可調整 |

---

<a id="zh-how-to-play"></a>
## 玩法說明

1. **主畫面** — 查看當前籌碼與戰績，確認今日天氣場況。
2. **選馬下注** — 分析賽事條件（天氣、場地、距離）及各馬屬性，加入下注單。
3. **比賽直播** — 觀看即時動畫，隨機事件可能隨時改變局勢。
4. **結果結算** — 確認名次與獲利，並閱讀本場知識小貼士。
5. 循環進行，累積虛擬籌碼。

> 籌碼無真實貨幣價值，本遊戲僅供娛樂與教育用途。

---

<a id="zh-bet-types"></a>
## 下注方式

| 注種 | 說明 | 最低賠率 |
|---|---|---|
| 獨贏（Win） | 押中第 1 名 | 1.5× |
| 位置（Place） | 押中前 3 名 | 1.2× |
| 連贏（Quinella） | 押中前 2 名（不分順序） | 3× |
| 三重彩（Trifecta） | 押中前 3 名（需按順序） | 15× |

**每場下注限制：**

| 規則 | 數值 |
|---|---|
| 單注最低 | $100 |
| 單注最高 | 持有籌碼的 50% |
| 每場最多注數 | 6 注 |
| 合計不得超過 | 持有籌碼 100% |

**賠率公式：**
```
獨贏賠率 = 基礎賠率 × 天氣係數 × 場地係數 × 心情係數 × 閘位係數
```
賠率會依各馬已收到的下注分佈即時浮動調整。

---

<a id="zh-horse-attributes"></a>
## 馬匹屬性

### 基礎屬性（1–10 分）

| 屬性 | 作用 |
|---|---|
| 速度 | 基礎奔跑速度 |
| 耐力 | 後段保速能力 |
| 爆發力 | 最後衝刺加速 |
| 穩定性 | 抵抗負面隨機事件的能力 |
| 草地適應 | 草地場地表現加成 |
| 泥地適應 | 泥地場地表現加成 |
| 短途適性 | 1000–1200 m 距離加成 |
| 中途適性 | 1400–1800 m 距離加成 |
| 長途適性 | 2000 m 以上距離加成 |

### 當場動態屬性

| 屬性 | 範圍 | 說明 |
|---|---|---|
| 心情 | 0.70–1.15 | 每場隨機，受馬齡與近期成績影響 |
| 操練狀態 | 0.80–1.10 | 賽前訓練狀況 |
| 騎師評級 | A / B / C | A 級 +8%；C 級 −5% 且失誤率更高 |
| 負磅 | kg | 輕磅有小幅速度加成 |
| 騎師策略 | 前領 / 均衡 / 後上 | 影響各段速度分配比例 |

### 比賽三段分析

| 段落 | 距離比例 | 主導屬性 |
|---|---|---|
| 起跑段 | 0–20% | 速度 + 閘位 + 心情 |
| 中段 | 20–70% | 速度 × 耐力衰減 |
| 衝刺段 | 70–100% | 爆發力 + 剩餘體力 |

---

<a id="zh-game-screens"></a>
## 遊戲畫面

| 畫面 ID | 名稱 | 進入方式 |
|---|---|---|
| `home` | 主畫面 | 預設頁面 / 點擊 Logo |
| `guide` | 說明 | 選單按鈕 |
| `knowledge` | 賽馬知識 | 選單按鈕 |
| `settings` | 設定 | 選單按鈕 |
| `betting` | 選馬下注 | 「開始遊戲」按鈕 |
| `race` | 比賽直播 | 確認下注後自動進入 |
| `result` | 比賽結果 | 比賽結束後自動進入 |

所有畫面以 `display: none / block` 切換，不重新載入 DOM。

---

<a id="zh-uncertainty-system"></a>
## 不確定性系統

### 天氣（每場隨機）

| 天氣 | 機率 | 速度係數 | 場地影響 |
|---|---|---|---|
| 晴天 ☀️ | 40% | ×1.00 | 草地 +5% |
| 多雲 ⛅ | 30% | ×1.00 | 無 |
| 小雨 🌧 | 20% | ×0.97 | 草地 −5%、泥地 +10% |
| 大雨 ⛈ | 10% | ×0.92 | 草地 −15%、泥地 +20% |

### 跑道狀況（受天氣影響）

| 狀況 | 耐力消耗倍率 |
|---|---|
| 堅硬（Firm） | ×0.90 |
| 良好（Good） | ×1.00 |
| 稍軟（Good to Soft） | ×1.10 |
| 軟地（Soft） | ×1.25 |
| 重地（Heavy） | ×1.40 |

### 比賽中隨機事件

| 事件 | 觸發機率 | 速度影響 | 持續幀數 |
|---|---|---|---|
| 失蹄 | 4% | −25% | 30 幀 |
| 受阻 | 6% | −15% | 20 幀 |
| 意外加速 | 5% | +20% | 15 幀 |
| 換跑道 | 8% | −5% | 10 幀 |
| 受嚇 | 3% | −30% | 40 幀 |
| 第二風 | 4% | +15% | 25 幀 |

事件只在比賽進度 20%–80% 之間觸發；穩定性越高，負面事件機率越低；每匹馬每場最多觸發 2 個事件。

---

<a id="zh-audio-system"></a>
## 音效系統

所有音效均以 **Web Audio API 程式化合成**，無需任何外部音檔，確保單一 HTML 可獨立執行。

| 場景 | BGM 風格 |
|---|---|
| 主畫面 | 輕快爵士（低頻 Bass + 高頻和弦循環） |
| 下注畫面 | 緊張弦樂，帶節拍器節奏 |
| 比賽中 | 激昂進行曲，最後直路節奏加快 |
| 最後直路 | 升調 + BPM 增加 30%（最後 10 秒） |
| 結果畫面 | 勝利 / 失敗短旋律收尾 |

**主要音效：**

| 音效 ID | 觸發時機 |
|---|---|
| `sfx_gate_open` | 比賽開始 |
| `sfx_hoofbeat` | 比賽進行中（持續） |
| `sfx_coin_win` | 獲勝結算 |
| `sfx_coin_lose` | 失敗結算 |
| `sfx_big_win` | 賠率 5× 以上獲勝 |
| `sfx_game_over` | 籌碼歸零 |
| `sfx_horse_neigh` | 點擊 Logo |

---

<a id="zh-settings"></a>
## 遊戲設定

| 設定 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| BGM 音量 | 滑桿 0–100 | 60 | 背景音樂音量 |
| 音效音量 | 滑桿 0–100 | 80 | 各類音效音量 |
| BGM 開關 | 切換 | 開 | 完全靜音 BGM |
| 音效開關 | 切換 | 開 | 完全靜音音效 |
| 比賽速度 | 選項 | 正常 | 慢速 / 正常 / 快速 |
| 動畫品質 | 選項 | 高 | 低 / 中 / 高（影響 Canvas FPS） |
| 初始籌碼 | 選項 | 10,000 | 重置時籌碼量：5,000 / 10,000 / 50,000 |
| 難度 | 選項 | 普通 | 簡單（更多提示）/ 普通 / 困難（隱藏部分資訊）|

---

<a id="zh-file-structure"></a>
## 檔案結構

```
Horse_Racing/
├─ horse_racing.html          ← 單一入口
├─ css/
│  ├─ styles.css              ← @import 總入口
│  ├─ base.css                ← CSS 變數、重置、字型
│  ├─ layout.css              ← Grid / Flex 版面
│  ├─ components.css          ← 按鈕、卡片、Toast、進度條
│  └─ responsive.css          ← 響應式斷點
└─ js/
   ├─ app.js                  ← 啟動與事件綁定
   ├─ core/
   │  ├─ utils.js             ← 共用工具函式
   │  ├─ game-state.js        ← localStorage 持久化
   │  └─ router.js            ← SPA 畫面路由
   ├─ data/
   │  └─ knowledge.js         ← 15 張知識卡資料
   ├─ systems/
   │  ├─ uncertainty-system.js← 天氣與隨機事件
   │  ├─ horse-engine.js      ← 馬匹生成與評分
   │  ├─ betting-system.js    ← 賠率計算與結算
   │  ├─ audio-engine.js      ← Web Audio API 引擎
   │  └─ race-simulator.js    ← 比賽物理迴圈（rAF）
   ├─ ui/
   │  ├─ renderer.js          ← Canvas 跑道渲染
   │  └─ ui.js                ← DOM 渲染函式
   └─ game/
      └─ game.js              ← 遊戲流程統籌
```

---

<a id="zh-module-reference"></a>
## 模組說明

| 模組 | 檔案 | 職責 |
|---|---|---|
| `Utils` | `core/utils.js` | `money()`、`clamp()`、`rand()`、`pick()`、`shuffle()` |
| `GameState` | `core/game-state.js` | 讀寫 `localStorage`，提供預設值 |
| `Router` | `core/router.js` | 畫面切換、BGM 場景切換 |
| `Knowledge` | `data/knowledge.js` | 靜態知識卡資料陣列 |
| `UncertaintySystem` | `systems/uncertainty-system.js` | 天氣、跑道狀況、比賽事件 |
| `HorseEngine` | `systems/horse-engine.js` | 生成馬匹、計算綜合評分 |
| `BettingSystem` | `systems/betting-system.js` | 賠率計算、動態調整、獲利結算 |
| `AudioEngine` | `systems/audio-engine.js` | BGM 場景、音效合成、音量控制 |
| `RaceSimulator` | `systems/race-simulator.js` | 每幀物理計算：速度、體力、排名 |
| `Renderer` | `ui/renderer.js` | Canvas 跑道、馬匹圖示、終點線 |
| `UI` | `ui/ui.js` | 所有 DOM 生成（主畫面、下注、比賽、結果） |
| `Game` | `game/game.js` | 準備賽事、確認下注、結束比賽、更新戰績 |

**Script 載入順序**（依賴安全順序）：
```
utils → game-state → router → knowledge →
uncertainty-system → horse-engine → betting-system →
audio-engine → race-simulator → renderer → ui → game → app
```

---

<br>

---

<a id="日本語"></a>
# 日本語

## 目次

1. [概要](#ja-overview)
2. [主な特徴](#ja-features)
3. [遊び方](#ja-how-to-play)
4. [賭け方の種類](#ja-bet-types)
5. [馬の能力値](#ja-horse-attributes)
6. [ゲーム画面一覧](#ja-game-screens)
7. [不確定要素システム](#ja-uncertainty-system)
8. [オーディオシステム](#ja-audio-system)
9. [設定](#ja-settings)
10. [ファイル構成](#ja-file-structure)
11. [モジュール一覧](#ja-module-reference)

---

<a id="ja-overview"></a>
## 概要

賽馬王（Horse Racing）は、インストール不要・バックエンド不要・ビルドツール不要の**ブラウザ完結型・競馬ベッティングシミュレーションゲーム**です。HTML ファイルを開くだけで遊べます。

| 項目 | 内容 |
|---|---|
| 対応環境 | デスクトップ・スマートフォン（RWD、最小幅 360 px） |
| 技術スタック | 純粋な HTML + CSS + JavaScript |
| エントリーポイント | `horse_racing.html` |
| データ保存 | `localStorage` |
| 外部依存 | なし（npm 不要・フレームワーク不要） |

**ゲームの流れ：**
```
ホーム → ベッティング → レース → 結果 → ホーム（繰り返し）
```

---

<a id="ja-features"></a>
## 主な特徴

| 特徴 | 説明 |
|---|---|
| ダイナミックレース | 最大 10 頭がリアルタイム Canvas アニメーションで競走 |
| 多重不確定要素 | 天候・馬場・ランダムイベント・気分・騎手ランク |
| プログラム生成オーディオ | BGM + 効果音を Web Audio API で合成（外部音声ファイル不要） |
| 競馬知識カード | 15 枚の知識カードで戦略力を磨ける |
| 完全 RWD 対応 | タッチ操作対応、360 px スマホからデスクトップまで |
| LocalStorage セーブ | チップ・戦績・設定・直近 20 レース履歴が自動保存 |
| 豊富な設定 | レース速度・アニメーション品質・難易度・音量・初期チップを調整可能 |

---

<a id="ja-how-to-play"></a>
## 遊び方

1. **ホーム画面** — 所持チップと戦績を確認し、今日の天気・馬場状態をチェック。
2. **ベッティング画面** — レース条件（天気・馬場・距離）と各馬の能力を分析し、賭けを追加。
3. **レース画面** — リアルタイムアニメーションを観戦。ランダムイベントが結果を左右することも。
4. **結果画面** — 着順と払い戻しを確認。レース後の豆知識も表示される。
5. レースを繰り返し、仮想チップを増やしましょう。

> チップに実際の金銭的価値はありません。本ゲームは純粋にエンターテインメントと教育を目的としています。

---

<a id="ja-bet-types"></a>
## 賭け方の種類

| 賭け種 | 説明 | 最低オッズ |
|---|---|---|
| 単勝（Win） | 1着馬を当てる | 1.5× |
| 複勝（Place） | 3着以内の馬を当てる | 1.2× |
| 馬連（Quinella） | 1・2着馬を順不同で当てる | 3× |
| 三連単（Trifecta） | 1・2・3着馬を順番通りに当てる | 15× |

**1レースあたりの賭け制限：**

| ルール | 値 |
|---|---|
| 最小ベット | $100 |
| 最大ベット | 所持チップの 50% |
| 最大賭け数 | 1レース 6 口まで |
| 合計上限 | 所持チップの 100% |

**オッズ計算式：**
```
単勝オッズ = 基本オッズ × 天気補正 × 馬場補正 × 気分補正 × 枠番補正
```
各馬への賭けの分布に応じてオッズはリアルタイムで変動します。

---

<a id="ja-horse-attributes"></a>
## 馬の能力値

### 基礎ステータス（1–10）

| 能力値 | 役割 |
|---|---|
| スピード | 基本走行速度 |
| スタミナ | 後半の速度維持能力 |
| 爆発力 | 最終直線での加速力 |
| 安定性 | 負のランダムイベントへの耐性 |
| 芝適性 | 芝コースでのパフォーマンス加算 |
| ダート適性 | ダートコースでのパフォーマンス加算 |
| 短距離適性 | 1000–1200 m レースへの適性 |
| 中距離適性 | 1400–1800 m レースへの適性 |
| 長距離適性 | 2000 m 以上のレースへの適性 |

### レース当日の動的属性

| 属性 | 範囲 | 説明 |
|---|---|---|
| 気分 | 0.70–1.15 | 毎レースランダム生成、馬齢と近況成績で変動 |
| 調教状態 | 0.80–1.10 | レース前の調教コンディション |
| 騎手ランク | A / B / C | A = +8% ボーナス、C = −5% ペナルティ＋失敗率上昇 |
| 斤量 | kg | 軽い斤量ほど小幅なスピードアップ |
| 作戦 | 逃げ / 差し / 追い込み | 各区間のスピード配分を左右 |

### レース区間と主要属性

| 区間 | 距離比率 | 主要能力値 |
|---|---|---|
| スタート | 0–20% | スピード + 枠番 + 気分 |
| 中盤 | 20–70% | スピード × スタミナ減衰 |
| 最終直線 | 70–100% | 爆発力 + 残りエネルギー |

---

<a id="ja-game-screens"></a>
## ゲーム画面一覧

| 画面 ID | 名称 | 遷移方法 |
|---|---|---|
| `home` | ホーム | デフォルト / ロゴクリック |
| `guide` | 遊び方説明 | メニューボタン |
| `knowledge` | 競馬知識 | メニューボタン |
| `settings` | 設定 | メニューボタン |
| `betting` | 馬選択・賭け | 「ゲーム開始」ボタン |
| `race` | レース中 | ベット確定後に自動遷移 |
| `result` | 結果 | レース終了後に自動遷移 |

全画面は `display: none / block` の切り替えで動作し、DOM の再読み込みは発生しません。

---

<a id="ja-uncertainty-system"></a>
## 不確定要素システム

### 天候（毎レースランダム）

| 天候 | 確率 | 速度補正 | 馬場への影響 |
|---|---|---|---|
| 晴天 ☀️ | 40% | ×1.00 | 芝 +5% |
| 曇り ⛅ | 30% | ×1.00 | なし |
| 小雨 🌧 | 20% | ×0.97 | 芝 −5%、ダート +10% |
| 大雨 ⛈ | 10% | ×0.92 | 芝 −15%、ダート +20% |

### 馬場状態（天候の影響を受ける）

| 状態 | スタミナ消耗倍率 |
|---|---|
| 良（Firm） | ×0.90 |
| 良（Good） | ×1.00 |
| 稍重（Good to Soft） | ×1.10 |
| 重（Soft） | ×1.25 |
| 不良（Heavy） | ×1.40 |

### レース中のランダムイベント

| イベント | 発生確率 | 速度影響 | 持続フレーム |
|---|---|---|---|
| 失蹄 | 4% | −25% | 30 フレーム |
| 進路妨害 | 6% | −15% | 20 フレーム |
| 突然の加速 | 5% | +20% | 15 フレーム |
| コース変更 | 8% | −5% | 10 フレーム |
| 驚き | 3% | −30% | 40 フレーム |
| 二の脚 | 4% | +15% | 25 フレーム |

イベントは進捗 20%–80% の間のみ発生します。安定性が高い馬ほど負のイベントに巻き込まれにくく、1頭につき1レース最大 2 回までです。

---

<a id="ja-audio-system"></a>
## オーディオシステム

すべての音声は **Web Audio API でプログラム合成**されており、外部音声ファイルは一切不要です。

| シーン | BGM スタイル |
|---|---|
| ホーム | 軽快なジャズ（低音 Bass + 和音ループ） |
| ベッティング | 緊張感のある弦楽、メトロノームリズム |
| レース中 | 勇壮な行進曲、最終直線でテンポアップ |
| 最終直線 | 転調 + BPM 30% 増加（ラスト 10 秒） |
| 結果画面 | 短い勝利 / 敗北のメロディー |

**主な効果音：**

| 効果音 ID | 発生タイミング |
|---|---|
| `sfx_gate_open` | レーススタート |
| `sfx_hoofbeat` | レース中（継続） |
| `sfx_coin_win` | 払い戻し（的中時） |
| `sfx_coin_lose` | 払い戻し（外れ時） |
| `sfx_big_win` | オッズ 5× 以上の的中 |
| `sfx_game_over` | チップ残高ゼロ |
| `sfx_horse_neigh` | ロゴクリック |

---

<a id="ja-settings"></a>
## 設定

| 設定項目 | 種別 | デフォルト | 説明 |
|---|---|---|---|
| BGM 音量 | スライダー 0–100 | 60 | BGM の音量 |
| 効果音音量 | スライダー 0–100 | 80 | 効果音の音量 |
| BGM オン/オフ | トグル | オン | BGM を完全ミュート |
| 効果音オン/オフ | トグル | オン | 効果音を完全ミュート |
| レース速度 | 選択 | 普通 | スロー / 普通 / 速い |
| アニメーション品質 | 選択 | 高 | 低 / 中 / 高（Canvas FPS に影響） |
| 初期チップ | 選択 | 10,000 | リセット時の枚数：5,000 / 10,000 / 50,000 |
| 難易度 | 選択 | 普通 | 簡単（ヒント多め）/ 普通 / 難しい（情報を一部非表示）|

---

<a id="ja-file-structure"></a>
## ファイル構成

```
Horse_Racing/
├─ horse_racing.html          ← 単一エントリーポイント
├─ css/
│  ├─ styles.css              ← @import の入口
│  ├─ base.css                ← CSS カスタムプロパティ・リセット・フォント
│  ├─ layout.css              ← Grid / Flex レイアウト
│  ├─ components.css          ← ボタン・カード・Toast・プログレスバー
│  └─ responsive.css          ← レスポンシブ対応のブレークポイント
└─ js/
   ├─ app.js                  ← 起動処理・イベント登録
   ├─ core/
   │  ├─ utils.js             ← 共通ユーティリティ
   │  ├─ game-state.js        ← localStorage 永続化
   │  └─ router.js            ← SPA 画面ルーティング
   ├─ data/
   │  └─ knowledge.js         ← 知識カード 15 枚のデータ
   ├─ systems/
   │  ├─ uncertainty-system.js← 天候・ランダムイベント
   │  ├─ horse-engine.js      ← 馬の生成・総合スコア計算
   │  ├─ betting-system.js    ← オッズ計算・払い戻し
   │  ├─ audio-engine.js      ← Web Audio API エンジン
   │  └─ race-simulator.js    ← レース物理ループ（rAF）
   ├─ ui/
   │  ├─ renderer.js          ← Canvas コース描画
   │  └─ ui.js                ← DOM 生成ヘルパー
   └─ game/
      └─ game.js              ← ゲーム進行オーケストレーション
```

---

<a id="ja-module-reference"></a>
## モジュール一覧

| モジュール | ファイル | 担当内容 |
|---|---|---|
| `Utils` | `core/utils.js` | `money()`・`clamp()`・`rand()`・`pick()`・`shuffle()` |
| `GameState` | `core/game-state.js` | `localStorage` の読み書き・デフォルト値管理 |
| `Router` | `core/router.js` | 画面切り替え・BGM シーン切り替え |
| `Knowledge` | `data/knowledge.js` | 知識カードの静的データ配列 |
| `UncertaintySystem` | `systems/uncertainty-system.js` | 天候・馬場状態・レースイベント |
| `HorseEngine` | `systems/horse-engine.js` | 馬の生成・総合スコア計算 |
| `BettingSystem` | `systems/betting-system.js` | オッズ計算・動的調整・払い戻し計算 |
| `AudioEngine` | `systems/audio-engine.js` | BGM シーン・効果音合成・音量制御 |
| `RaceSimulator` | `systems/race-simulator.js` | フレーム単位の物理計算（速度・体力・順位） |
| `Renderer` | `ui/renderer.js` | Canvas コース・馬アイコン・ゴールライン描画 |
| `UI` | `ui/ui.js` | 全 DOM 生成（ホーム・ベッティング・レース・結果） |
| `Game` | `game/game.js` | レース準備・ベット確定・レース終了・戦績更新 |

**スクリプト読み込み順序**（依存関係を考慮した安全な順序）：
```
utils → game-state → router → knowledge →
uncertainty-system → horse-engine → betting-system →
audio-engine → race-simulator → renderer → ui → game → app
```

---

*Version 1.0.0 — For entertainment and educational purposes only. No real-money gambling involved.*  
*バージョン 1.0.0 — 純粋にエンターテインメントと教育目的。実際の賭け行為は含みません。*  
*版本 1.0.0 — 純教育娛樂用途，不涉及真實賭博行為。*
