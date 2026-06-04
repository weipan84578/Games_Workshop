# Chinese Checkers｜チャイニーズチェッカー｜中國跳棋

> A fully browser-based Chinese Checkers game — no server, no dependencies, just open `index.html`.

---

## Language · 言語 · 語言

| [🇺🇸 English](#-english) | [🇯🇵 日本語](#-日本語) | [🇹🇼 繁體中文](#-繁體中文) |
|:---:|:---:|:---:|

---

## 🇺🇸 English

### Table of Contents
- [Overview](#overview)
- [Game Modes](#game-modes)
- [How to Play](#how-to-play)
- [Code Architecture](#code-architecture)
- [Module Reference](#module-reference)
- [Technologies](#technologies)
- [AI System](#ai-system)
- [Audio System](#audio-system)
- [Quick Start](#quick-start)

---

### Overview

A polished, zero-dependency Chinese Checkers game that runs entirely in the browser. Supports two distinct rule sets, 1–4 players (human + AI), multiple difficulty levels, a dynamic aggression system for multi-player games, synthesized audio, dark mode, and full mobile/touch support.

---

### Game Modes

| Mode | Goal | Capture? | Players |
|------|------|----------|---------|
| **Homecoming** (回家模式) | Move all 10 pieces to the opposite triangle | No — jumping over pieces is a relay, not a capture | 2–3 |
| **Capture** (吃子模式) | Eliminate all opponent pieces by jumping over them | Yes — jumping over an enemy removes it from the board | 2–4 |

---

### How to Play

#### Setup
1. Open `index.html` in any modern browser.
2. Click **Start** on the title screen.
3. Select **Mode**, **Number of Players**, and **Difficulty**, then click **Start Game**.

#### Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Select a piece | Click the piece | Tap the piece |
| Move / jump | Click a highlighted cell | Tap a highlighted cell |
| End chain jump early | Click **結束連跳** button | Tap **結束連跳** button |

#### Highlight Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green glow | Legal single-step move |
| 🔴 Red glow | Capture jump (Capture Mode) |
| ✨ White glow | Currently selected piece |

#### Aggression System (3–4 players)

| Indicator | Threshold | Meaning |
|-----------|-----------|---------|
| Progress bar | 0–100 | Current hatred level toward a player |
| 🔥 icon | ≥ 30 | AI is actively targeting this player |
| !! flash | ≥ 70 | AI is highly focused on this player |

---

### Code Architecture

```
chinese_checkers/
├── index.html                  Entry point
├── css/
│   └── app.css                 All styles (layout, dark mode, animations)
└── js/
    ├── config/
    │   └── constants.js        Game constants, hex directions, player metadata
    ├── state/
    │   └── state.js            Global game state & user settings
    ├── utils/
    │   └── hex.js              Hexagonal grid math
    ├── board/
    │   └── board.js            Board generation & zone definitions
    ├── game/
    │   ├── rules.js            Move validation, turn logic, win conditions
    │   └── ai.js               AI decision-making (heuristics + minimax)
    ├── ui/
    │   ├── canvas.js           Canvas 2D rendering
    │   ├── screens.js          Screen management & settings persistence
    │   └── title-art.js        Animated title screen hexagons
    ├── audio/
    │   └── audio.js            Web Audio API synthesis
    └── main.js                 Initialization & event binding
```

---

### Module Reference

| File | Responsibility | Key Exports |
|------|---------------|-------------|
| `constants.js` | Hex grid directions, player colors, zone names | `HEX_DIRS`, `PLAYERS`, `ZONES` |
| `state.js` | Single source of truth for all runtime state | `game`, `settings` |
| `hex.js` | Coordinate math (axial ↔ pixel, distances) | `key()`, `hexDistance()`, `starContains()` |
| `board.js` | 121-node hex star generation, zone allocation | `generateBoard()`, `makeBoard()`, `newGame()` |
| `rules.js` | Legal move generation, move execution, win check | `getLegalMoves()`, `applyMove()`, `checkGameOver()` |
| `ai.js` | Move scoring, minimax lookahead, aggro targeting | `aiTakeTurn()`, `chooseAiMove()`, `evaluate()` |
| `canvas.js` | Full board render pipeline | `draw()`, `resizeCanvas()`, `clickedNode()` |
| `screens.js` | DOM screen switching, player UI, localStorage | `showScreen()`, `updatePlayers()`, `loadSettings()` |
| `title-art.js` | Animated hex rings on title screen | `drawTitleArt()` |
| `audio.js` | Synthesized music & SFX | `sfx()`, `ensureMusic()` |
| `main.js` | Bootstrap: `init()` wires everything together | `init()`, `initEvents()` |

---

### Technologies

| Layer | Technology | Notes |
|-------|-----------|-------|
| Markup | HTML5 | Semantic structure, no frameworks |
| Styling | CSS3 | CSS variables, Grid, Flexbox, dark mode |
| Logic | Vanilla ES6+ JS | No bundler, no transpiler |
| Graphics | Canvas 2D API | 121 hexagonal cells, gradient pieces |
| Audio | Web Audio API | All sound synthesized at runtime |
| Fonts | Google Fonts (Noto Sans TC) | + system fallback stack |
| Persistence | localStorage | Volume, dark mode, font size |
| Deployment | Static file | Works from `file://` — no server needed |

---

### AI System

The AI operates in three difficulty tiers, all sharing the same evaluation pipeline:

| Difficulty | Search Depth | Chain Jump Bail | Description |
|------------|-------------|-----------------|-------------|
| Easy (簡單) | 1 | High (≈40%) | Picks the first good move; often leaves chains unfinished |
| Normal (普通) | 1 | Medium (≈18%) | Consistent heuristic play |
| Hard (困難) | 2 (minimax) | Low (≈5%) | Looks one full opponent turn ahead |

**Scoring factors per move:**

| Factor | Weight | Notes |
|--------|--------|-------|
| Distance to target | ×10 | Primary objective in Homecoming mode |
| Jump bonus | +6 | Rewards mobility |
| Capture bonus | +28 | Rewards aggression in Capture mode |
| Aggression modifier | ±variable | Biases target selection toward hated opponents |

**Aggression system** (3–4 players only):
- Each capture or being captured increases hatred toward the attacker.
- Piece-count imbalance also generates passive hatred.
- Decays by 2 per full round.
- `aggroTarget()` blends 60% hatred weight + 40% win-proximity weight to choose focus target.

---

### Audio System

All audio is synthesized at runtime using the Web Audio API — no audio files bundled.

| Sound | Trigger | Synthesis Method |
|-------|---------|-----------------|
| Background music | Game screen | Pentatonic scale (C D E G A), random arpeggios |
| Tap | Piece selected | Short sine burst |
| Move | Piece placed | Brownian noise (lowpass filtered) |
| Jump | Piece jumps | Rising frequency sweep |
| Capture | Piece removed | Low attack + noise layer |
| Win | Victory | Major chord arpeggio |
| Lose | Defeat | Descending minor scale |

---

### Quick Start

```
1. Clone or download this repository
2. Open  chinese_checkers/index.html  in Chrome, Firefox, Safari, or Edge
3. No installation, no npm, no server required
```

**Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 🇯🇵 日本語

### 目次
- [概要](#概要)
- [ゲームモード](#ゲームモード)
- [遊び方](#遊び方)
- [コード構成](#コード構成)
- [モジュール一覧](#モジュール一覧)
- [使用技術](#使用技術)
- [AIシステム](#aiシステム)
- [オーディオシステム](#オーディオシステム)
- [クイックスタート](#クイックスタート)

---

### 概要

サーバー不要・外部ライブラリ不要のブラウザ完結型チャイニーズチェッカーです。2種類のルール、1〜4人プレイ（人間＋AI）、複数の難易度、多人数戦での動的な「怒り（アグロ）」システム、リアルタイム音声合成、ダークモード、スマートフォン対応を備えています。

---

### ゲームモード

| モード | 目標 | 駒の取り合い | プレイ人数 |
|--------|------|------------|-----------|
| **帰還モード** (回家模式) | 自分の10個の駒を全て反対側の三角形エリアへ移動させる | なし — ジャンプは中継のみ | 2〜3人 |
| **撃破モード** (吃子模式) | 相手の駒を飛び越えて全滅させる | あり — 敵駒を飛び越えると盤上から除去 | 2〜4人 |

---

### 遊び方

#### セットアップ
1. `index.html` をブラウザで開く。
2. タイトル画面で **スタート** をクリック。
3. **モード**・**人数**・**難易度** を選んで **ゲーム開始** をクリック。

#### 操作方法

| 操作 | PC | スマートフォン |
|------|-----|--------------|
| 駒を選択 | 駒をクリック | 駒をタップ |
| 移動・ジャンプ | ハイライトされたマスをクリック | ハイライトされたマスをタップ |
| 連続ジャンプを終了 | **結束連跳** ボタンをクリック | **結束連跳** ボタンをタップ |

#### ハイライトの意味

| 色 | 意味 |
|----|------|
| 🟢 緑のグロー | 通常の1マス移動が可能 |
| 🔴 赤のグロー | 撃破ジャンプが可能（撃破モード） |
| ✨ 白のグロー | 現在選択中の駒 |

#### アグロシステム（3〜4人戦）

| 表示 | 閾値 | 意味 |
|------|------|------|
| プログレスバー | 0〜100 | 特定プレイヤーへの憎しみ度 |
| 🔥 アイコン | ≥ 30 | AIがそのプレイヤーを積極的に狙っている |
| !! 点滅 | ≥ 70 | AIがそのプレイヤーを強く集中攻撃している |

---

### コード構成

```
chinese_checkers/
├── index.html                  エントリーポイント
├── css/
│   └── app.css                 スタイル全般（レイアウト・ダークモード・アニメーション）
└── js/
    ├── config/
    │   └── constants.js        ゲーム定数・六角方向・プレイヤーメタデータ
    ├── state/
    │   └── state.js            グローバルゲーム状態・ユーザー設定
    ├── utils/
    │   └── hex.js              六角グリッド座標計算
    ├── board/
    │   └── board.js            盤面生成・ゾーン定義
    ├── game/
    │   ├── rules.js            合法手生成・ターン管理・勝利判定
    │   └── ai.js               AI（ヒューリスティック＋ミニマックス）
    ├── ui/
    │   ├── canvas.js           Canvas 2D 描画
    │   ├── screens.js          画面切り替え・設定の永続化
    │   └── title-art.js        タイトル画面の六角アニメーション
    ├── audio/
    │   └── audio.js            Web Audio API 音声合成
    └── main.js                 初期化・イベントバインディング
```

---

### モジュール一覧

| ファイル | 役割 | 主なエクスポート |
|---------|------|----------------|
| `constants.js` | 六角方向ベクトル・プレイヤー色・ゾーン名 | `HEX_DIRS`, `PLAYERS`, `ZONES` |
| `state.js` | 全ランタイム状態の唯一の情報源 | `game`, `settings` |
| `hex.js` | 座標変換（軸座標↔ピクセル）・距離計算 | `key()`, `hexDistance()`, `starContains()` |
| `board.js` | 121ノード六角星生成・ゾーン割り当て | `generateBoard()`, `makeBoard()`, `newGame()` |
| `rules.js` | 合法手生成・駒移動実行・勝利チェック | `getLegalMoves()`, `applyMove()`, `checkGameOver()` |
| `ai.js` | 手のスコアリング・ミニマックス・アグロ計算 | `aiTakeTurn()`, `chooseAiMove()`, `evaluate()` |
| `canvas.js` | 盤面全体の描画パイプライン | `draw()`, `resizeCanvas()`, `clickedNode()` |
| `screens.js` | DOM画面切り替え・プレイヤーUI・localStorage | `showScreen()`, `updatePlayers()`, `loadSettings()` |
| `title-art.js` | タイトル画面の六角リングアニメーション | `drawTitleArt()` |
| `audio.js` | BGM・効果音の合成 | `sfx()`, `ensureMusic()` |
| `main.js` | ブートストラップ（`init()` で全体を接続） | `init()`, `initEvents()` |

---

### 使用技術

| 層 | 技術 | 備考 |
|----|------|------|
| マークアップ | HTML5 | フレームワーク不使用 |
| スタイリング | CSS3 | CSS変数・Grid・Flexbox・ダークモード |
| ロジック | バニラ ES6+ JS | バンドラー・トランスパイラー不使用 |
| グラフィック | Canvas 2D API | 121個の六角セル・グラデーション駒 |
| オーディオ | Web Audio API | 全音声をランタイムで合成 |
| フォント | Google Fonts (Noto Sans TC) | + システムフォールバック |
| 永続化 | localStorage | 音量・ダークモード・フォントサイズ |
| 配布 | 静的ファイル | `file://` から直接動作・サーバー不要 |

---

### AIシステム

AIは3段階の難易度で動作し、共通の評価パイプラインを使用します。

| 難易度 | 探索深度 | 連続ジャンプ打ち切り率 | 説明 |
|--------|---------|---------------------|------|
| 簡単 (Easy) | 1 | 高（約40%） | 最初に見つかった良い手を選ぶ |
| 普通 (Normal) | 1 | 中（約18%） | 安定したヒューリスティックプレイ |
| 困難 (Hard) | 2（ミニマックス） | 低（約5%） | 相手の次ターンまで先読みする |

**手のスコアリング要素：**

| 要素 | 重み | 備考 |
|------|------|------|
| 目標地点への距離 | ×10 | 帰還モードの主目標 |
| ジャンプボーナス | +6 | 機動力を評価 |
| 撃破ボーナス | +28 | 撃破モードの攻撃性を評価 |
| アグロ補正 | ±可変 | 憎しみの高い相手を優先 |

---

### オーディオシステム

全ての音声はWeb Audio APIでリアルタイム合成されます。音声ファイルは含まれていません。

| 音声 | 発生タイミング | 合成手法 |
|------|--------------|---------|
| BGM | ゲーム画面 | ペンタトニックスケール（C D E G A）ランダムアルペジオ |
| タップ音 | 駒選択 | 短いサイン波 |
| 移動音 | 駒配置 | ブラウンノイズ（ローパスフィルタ） |
| ジャンプ音 | 駒ジャンプ | 上昇周波数スウィープ |
| 撃破音 | 駒除去 | 低音アタック＋ノイズレイヤー |
| 勝利音 | 勝利 | メジャーコードアルペジオ |
| 敗北音 | 敗北 | 下降マイナースケール |

---

### クイックスタート

```
1. リポジトリをクローンまたはダウンロード
2. chinese_checkers/index.html を Chrome・Firefox・Safari・Edge で開く
3. インストール不要・npm 不要・サーバー不要
```

**動作確認済みブラウザ:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 🇹🇼 繁體中文

### 目錄
- [專案概述](#專案概述)
- [遊戲模式](#遊戲模式)
- [遊玩方式](#遊玩方式)
- [程式架構](#程式架構)
- [模組說明](#模組說明)
- [使用技術](#使用技術-1)
- [AI 系統](#ai-系統)
- [音效系統](#音效系統)
- [快速開始](#快速開始)

---

### 專案概述

一款完全在瀏覽器中運行的中國跳棋遊戲，無需伺服器、無需任何外部函式庫，直接開啟 `index.html` 即可遊玩。提供兩種規則模式、1–4 位玩家（人類 + AI）、多段難易度、多人模式下的動態仇恨（Aggro）系統、即時合成音效、深色模式，以及完整的行動裝置與觸控支援。

---

### 遊戲模式

| 模式 | 目標 | 是否吃子 | 人數 |
|------|------|---------|------|
| **回家模式** | 將己方所有 10 個棋子全數移至對角三角形區域 | 否 — 跳躍為中繼，不移除棋子 | 2–3 人 |
| **吃子模式** | 跳過對手棋子以消滅所有對手 | 是 — 跳過敵方棋子即從棋盤移除 | 2–4 人 |

---

### 遊玩方式

#### 遊戲設定
1. 以瀏覽器開啟 `index.html`。
2. 在標題畫面點選**開始遊戲**。
3. 選擇**模式**、**玩家人數**、**難易度**，再點選**開始**。

#### 操作方式

| 動作 | 電腦 | 行動裝置 |
|------|------|---------|
| 選取棋子 | 點擊棋子 | 點觸棋子 |
| 移動 / 跳躍 | 點擊高亮格子 | 點觸高亮格子 |
| 提前結束連跳 | 點擊**結束連跳**按鈕 | 點觸**結束連跳**按鈕 |

#### 高亮顏色說明

| 顏色 | 意義 |
|------|------|
| 🟢 綠色光暈 | 可執行的單步移動 |
| 🔴 紅色光暈 | 可執行的吃子跳躍（吃子模式） |
| ✨ 白色光暈 | 目前已選取的棋子 |

#### 仇恨（Aggro）系統（3–4 人局）

| 顯示 | 閾值 | 意義 |
|------|------|------|
| 進度條 | 0–100 | 對特定玩家的當前仇恨值 |
| 🔥 圖示 | ≥ 30 | AI 正在積極鎖定此玩家 |
| !! 閃爍 | ≥ 70 | AI 高度集中攻擊此玩家 |

---

### 程式架構

```
chinese_checkers/
├── index.html                  程式進入點
├── css/
│   └── app.css                 全部樣式（排版、深色模式、動畫效果）
└── js/
    ├── config/
    │   └── constants.js        遊戲常數、六角方向向量、玩家元資料
    ├── state/
    │   └── state.js            全域遊戲狀態與使用者設定
    ├── utils/
    │   └── hex.js              六角格座標數學計算
    ├── board/
    │   └── board.js            棋盤生成與區域定義
    ├── game/
    │   ├── rules.js            合法移動計算、回合管理、勝負判定
    │   └── ai.js               AI 決策（啟發式 + 最小最大搜尋）
    ├── ui/
    │   ├── canvas.js           Canvas 2D 渲染
    │   ├── screens.js          畫面切換、玩家 UI、設定持久化
    │   └── title-art.js        標題畫面六角動畫
    ├── audio/
    │   └── audio.js            Web Audio API 音效合成
    └── main.js                 初始化與事件綁定
```

---

### 模組說明

| 檔案 | 職責 | 主要匯出 |
|------|------|---------|
| `constants.js` | 六角方向向量、玩家顏色、區域名稱 | `HEX_DIRS`, `PLAYERS`, `ZONES` |
| `state.js` | 所有執行時期狀態的唯一資料來源 | `game`, `settings` |
| `hex.js` | 座標轉換（軸座標 ↔ 像素）、距離計算 | `key()`, `hexDistance()`, `starContains()` |
| `board.js` | 121 節點六角星生成、區域分配 | `generateBoard()`, `makeBoard()`, `newGame()` |
| `rules.js` | 合法移動生成、棋子移動執行、勝利檢查 | `getLegalMoves()`, `applyMove()`, `checkGameOver()` |
| `ai.js` | 移動評分、最小最大搜尋、仇恨目標計算 | `aiTakeTurn()`, `chooseAiMove()`, `evaluate()` |
| `canvas.js` | 完整棋盤渲染流水線 | `draw()`, `resizeCanvas()`, `clickedNode()` |
| `screens.js` | DOM 畫面切換、玩家 UI、localStorage | `showScreen()`, `updatePlayers()`, `loadSettings()` |
| `title-art.js` | 標題畫面六角環動畫 | `drawTitleArt()` |
| `audio.js` | 背景音樂與音效合成 | `sfx()`, `ensureMusic()` |
| `main.js` | 啟動程序（`init()` 整合所有模組） | `init()`, `initEvents()` |

---

### 使用技術

| 層級 | 技術 | 說明 |
|------|------|------|
| 標記語言 | HTML5 | 語意結構，無框架 |
| 樣式 | CSS3 | CSS 變數、Grid、Flexbox、深色模式 |
| 邏輯 | 原生 ES6+ JS | 無打包工具、無轉譯器 |
| 圖形 | Canvas 2D API | 121 個六角格、漸層棋子效果 |
| 音效 | Web Audio API | 全部音效於執行時期即時合成 |
| 字型 | Google Fonts (Noto Sans TC) | + 系統備援字型堆疊 |
| 持久化 | localStorage | 音量、深色模式、字型大小 |
| 部署 | 靜態檔案 | 可直接從 `file://` 執行，無需伺服器 |

---

### AI 系統

AI 在三個難易度等級下運作，共用相同的評估流水線。

| 難易度 | 搜尋深度 | 連跳中止率 | 說明 |
|--------|---------|-----------|------|
| 簡單 | 1 | 高（約 40%） | 選取第一個找到的好移動，常提前結束連跳 |
| 普通 | 1 | 中（約 18%） | 穩定的啟發式運算 |
| 困難 | 2（最小最大） | 低（約 5%） | 向前預看一個完整回合 |

**移動評分要素：**

| 要素 | 權重 | 說明 |
|------|------|------|
| 至目標區距離 | ×10 | 回家模式的主要目標 |
| 跳躍加成 | +6 | 獎勵機動性 |
| 吃子加成 | +28 | 獎勵吃子模式中的攻擊性 |
| 仇恨修正 | ±可變 | 偏向攻擊仇恨值高的對手 |

**仇恨系統**（僅限 3–4 人局）：
- 每次吃子或被吃子，都會對該玩家增加仇恨值。
- 棋子數量差距也會產生被動仇恨。
- 每完整回合衰減 2 點。
- `aggroTarget()` 以 60% 仇恨權重 + 40% 勝利接近度決定鎖定目標。

---

### 音效系統

所有音效皆透過 Web Audio API 於執行時期即時合成，專案中不包含任何音效檔案。

| 音效 | 觸發時機 | 合成方式 |
|------|---------|---------|
| 背景音樂 | 遊戲畫面 | 五聲音階（C D E G A）隨機琶音 |
| 點擊音 | 選取棋子 | 短暫弦波 |
| 移動音 | 棋子落下 | 布朗噪音（低通濾波） |
| 跳躍音 | 棋子跳躍 | 上升頻率掃描 |
| 吃子音 | 棋子移除 | 低頻起音 + 噪音層 |
| 勝利音 | 獲勝 | 大調和弦琶音 |
| 失敗音 | 落敗 | 下行小調音階 |

---

### 快速開始

```
1. 複製或下載此儲存庫
2. 以 Chrome、Firefox、Safari 或 Edge 開啟 chinese_checkers/index.html
3. 無需安裝、無需 npm、無需伺服器
```

**支援瀏覽器：** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
