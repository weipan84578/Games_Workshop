# Slapjack — 心臓病カードゲーム / 心臟病紙牌遊戲

> **Language / 言語 / 語言：**
> [English](#-english) | [日本語](#-日本語) | [中文](#-中文)

---

# 🇬🇧 English

## Table of Contents
- [Game Overview](#game-overview)
- [How to Play](#how-to-play)
- [Slap Conditions](#slap-conditions)
- [Settings](#settings)
- [Controls](#controls)
- [Code Architecture](#code-architecture)
- [Tech Stack](#tech-stack)

---

## Game Overview

**Slapjack** is a fast-paced card game inspired by the Taiwanese classic *Heart Attack* (心臟病), a variant of Egyptian Ratscrew. Players take turns flipping cards onto a central pile. When a matching condition appears on the pile, the first player to slap wins all the cards. The last player with cards in hand wins.

| Detail | Value |
|--------|-------|
| Players | 1 human + 1–3 AI |
| Deck | Standard 52-card deck (no Jokers) |
| Platform | Browser (single HTML file) |
| Difficulty | Easy / Normal / Hard |

---

## How to Play

1. Cards are shuffled and dealt evenly to all players face-down.
2. Players take turns flipping one card face-up onto the central pile.
3. When a **slap condition** appears, race to slap the pile.
4. The first player to slap a valid pile wins all its cards (added to the bottom of their hand).
5. A wrong slap costs you 1 card as a penalty (added to the pile).
6. A player with no cards is eliminated.
7. The last player remaining wins.

---

## Slap Conditions

| Condition | Description | Default |
|-----------|-------------|---------|
| **Doubles** | Top two cards share the same rank (e.g. 7♠ on 7♥) | ON |
| **Sandwich** | 1st and 3rd cards share the same rank, sandwiching one in between | ON |
| **Consecutive** | Top 3 cards form a run (e.g. 5, 6, 7) | OFF |
| **Twos** | A 2 appears on top of the pile | OFF |

---

## Settings

| Setting | Options | Default |
|---------|---------|---------|
| AI Count | 1 / 2 / 3 | 2 |
| AI Difficulty | Easy / Normal / Hard | Normal |
| BGM Volume | 0 – 100% | 45% |
| SFX Volume | 0 – 100% | 80% |
| Slap Area | Button / Center Pile | Button |
| Consecutive Rule | On / Off | Off |
| Twos Rule | On / Off | Off |
| Animation Speed | Slow / Normal / Fast | Normal |

Settings are saved automatically using `localStorage`.

---

## Controls

| Action | Input |
|--------|-------|
| Flip a card | Click **FLIP** button, or press `Space` |
| Slap the pile | Click **SLAP** button, or press `Enter` |
| Slap via pile | Click the center pile (if enabled in settings) |
| Pause / Resume | Click `Ⅱ` button |
| Mute / Unmute | Click `♪` button |
| Return to menu | Click `⌂` button |

---

## Code Architecture

The entire game is contained in a single `index.html` file with no external dependencies.

### File Structure

```
Slapjack/
├── index.html    ← All HTML + CSS + JavaScript in one file
└── README.md
```

### JavaScript Modules (within `<script>`)

| Section | Description |
|---------|-------------|
| `DEFAULT_SETTINGS` | Default configuration constants |
| `AudioEngine` class | Web Audio API synthesizer for BGM and SFX |
| `dom` object | Cached DOM element references |
| `game` object | Central game state |
| `createDeck()` | Builds a shuffled 52-card deck |
| `createPlayers()` | Initializes human + AI player objects |
| `dealDeck()` | Distributes cards round-robin to all players |
| `startGame()` | Resets state and begins a new game |
| `playTurn()` | Executes one card flip (human or AI) |
| `slap()` | Handles a slap attempt from any player |
| `checkSlapConditions()` | Validates whether the pile can currently be slapped |
| `scheduleAiSlaps()` | Queues AI slap timers based on difficulty |
| `maybeScheduleAiTurn()` | Queues AI flip if it's the AI's turn |
| `eliminateEmptyPlayers()` | Marks players with no cards as eliminated |
| `finishIfNeeded()` | Ends the game when ≤1 active player remains |
| `render()` | Updates all DOM elements to reflect game state |
| `renderPlayers()` | Renders player badges and card counts |
| `renderPile()` | Renders the top 3 cards of the central pile |
| `renderControls()` | Enables/disables buttons based on game phase |
| `pauseToggle()` | Pauses or resumes the game |
| `endGame()` | Triggers game-over screen and audio |
| `showToast()` | Displays a temporary message overlay |

### CSS Architecture

| Section | Description |
|---------|-------------|
| `:root` variables | Color palette and responsive font scale (`clamp`) |
| `.screen` system | Full-screen panels toggled via `.is-active` class |
| `.card` / `.card--back` | Playing card visual with corners and center suit |
| `.pile-hit-area` | Central slap zone with success/fail animations |
| `.player-badge` | Player info card with active/eliminated states |
| `@keyframes` | `dealCard` flip-in, `slapSuccess` bounce, `slapFail` red flash |
| `@media (max-width: 767px)` | Mobile layout overrides |

### AI Difficulty Parameters

| Difficulty | Slap Reaction Time | Flip Delay | Mistake Rate |
|------------|--------------------|------------|--------------|
| Easy | 800 – 1500 ms | 600 – 1200 ms | 15% |
| Normal | 400 – 900 ms | 300 – 700 ms | 5% |
| Hard | 150 – 450 ms | 150 – 400 ms | 1% |

### Audio Engine

All sounds are generated programmatically using the **Web Audio API** — no external audio files.

| Sound | Method |
|-------|--------|
| Button click | Triangle + sine oscillator burst |
| Card flip | Low triangle wave with decay |
| Slap success | Square wave impact + triangle overtone |
| Slap fail | Sawtooth wave with fast decay |
| Win fanfare | Rising triangle chord sequence |
| Lose jingle | Descending sine tone sequence |
| BGM | Looping multi-oscillator drone with pulse rhythm |

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure and screen layout |
| CSS3 | Styling, animations, responsive design |
| Vanilla JavaScript | Game logic and state management |
| Web Audio API | Synthesized sound effects and background music |
| `localStorage` | Settings persistence |

**Browser Support:**

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---

---

# 🇯🇵 日本語

## 目次
- [ゲーム概要](#ゲーム概要)
- [遊び方](#遊び方)
- [スラップ条件](#スラップ条件)
- [設定](#設定)
- [操作方法](#操作方法)
- [コードアーキテクチャ](#コードアーキテクチャ)
- [技術スタック](#技術スタック)

---

## ゲーム概要

**Slapjack**（スラップジャック）は、台湾の伝統カードゲーム「心臓病」（Egyptian Ratscrew の亜種）をブラウザで楽しめるゲームです。プレイヤーは交互に中央の山札へカードをめくり、一致条件が発生した瞬間、最速でスラップ（叩く）したプレイヤーがすべてのカードを獲得します。最後までカードを持ち続けたプレイヤーの勝利です。

| 項目 | 内容 |
|------|------|
| プレイヤー | 人間 1 名 + AI 1〜3 名 |
| デッキ | 標準 52 枚（ジョーカーなし） |
| プラットフォーム | ブラウザ（単一 HTML ファイル） |
| 難易度 | 簡単 / 普通 / 難しい |

---

## 遊び方

1. カードをシャッフルし、全プレイヤーへ均等に配る（表向き以外で保持）。
2. 順番にカードを 1 枚ずつ中央の山札へ表向きに出す。
3. **スラップ条件**が成立したら、山札をすばやく叩く。
4. 最初に叩いたプレイヤーが山札のカードをすべて獲得（手札の一番下へ追加）。
5. 条件が成立していないときに叩いた場合はペナルティとして手札から 1 枚が山札へ追加される。
6. 手札がなくなったプレイヤーは失格。
7. 最後に残ったプレイヤーが勝者。

---

## スラップ条件

| 条件名 | 説明 | 初期状態 |
|--------|------|----------|
| **ダブル** | 山札の上 2 枚のランクが同じ（例：7♠ の上に 7♥） | ON |
| **サンドイッチ** | 1 枚目と 3 枚目のランクが同じ（間に別のカードが 1 枚） | ON |
| **連番** | 上 3 枚が連続した数字（例：5・6・7） | OFF |
| **2 のルール** | 山札のトップに 2 が出た場合 | OFF |

---

## 設定

| 設定項目 | 選択肢 | 初期値 |
|----------|--------|--------|
| AI 人数 | 1 / 2 / 3 | 2 |
| AI 難易度 | 簡単 / 普通 / 難しい | 普通 |
| BGM 音量 | 0 〜 100% | 45% |
| SE 音量 | 0 〜 100% | 80% |
| スラップ領域 | ボタン / 中央山札エリア | ボタン |
| 連番ルール | ON / OFF | OFF |
| 2 ルール | ON / OFF | OFF |
| アニメ速度 | 遅い / 普通 / 速い | 普通 |

設定は `localStorage` に自動保存されます。

---

## 操作方法

| アクション | 入力 |
|------------|------|
| カードを出す | **翻牌**ボタンをクリック、または `Space` キー |
| 山札を叩く | **拍牌**ボタンをクリック、または `Enter` キー |
| 山札エリアで叩く | 中央エリアをクリック（設定で有効化時） |
| 一時停止 / 再開 | `Ⅱ` ボタン |
| ミュート切替 | `♪` ボタン |
| メインメニューへ | `⌂` ボタン |

---

## コードアーキテクチャ

すべてのゲームコードは外部依存ゼロの **単一 `index.html` ファイル**に収められています。

### ファイル構成

```
Slapjack/
├── index.html    ← HTML・CSS・JavaScript をすべて内包
└── README.md
```

### JavaScript モジュール構成

| セクション | 役割 |
|------------|------|
| `DEFAULT_SETTINGS` | 設定のデフォルト定数 |
| `AudioEngine` クラス | Web Audio API によるBGM・SE 合成エンジン |
| `dom` オブジェクト | DOM 要素のキャッシュ参照 |
| `game` オブジェクト | ゲーム中央状態管理 |
| `createDeck()` | 52 枚のデッキを生成・シャッフル |
| `createPlayers()` | 人間・AI プレイヤーオブジェクトの初期化 |
| `dealDeck()` | ラウンドロビン方式でカードを配布 |
| `startGame()` | 状態リセットとゲーム開始 |
| `playTurn()` | 1 枚のカードをめくる処理 |
| `slap()` | スラップ判定処理 |
| `checkSlapConditions()` | 山札のスラップ可否を判定 |
| `scheduleAiSlaps()` | 難易度に基づく AI スラップタイマー設定 |
| `maybeScheduleAiTurn()` | AI のターン時にカード出しをスケジュール |
| `eliminateEmptyPlayers()` | 手札 0 枚のプレイヤーを失格処理 |
| `finishIfNeeded()` | 残りプレイヤー 1 名以下でゲーム終了 |
| `render()` | すべての DOM を現在の状態へ更新 |
| `renderPlayers()` | プレイヤーバッジと手札枚数の描画 |
| `renderPile()` | 山札の上位 3 枚を描画 |
| `renderControls()` | ゲームフェーズに応じたボタンの有効/無効化 |
| `pauseToggle()` | 一時停止・再開の切替 |
| `endGame()` | ゲーム終了処理とオーディオ再生 |
| `showToast()` | 一時的なメッセージオーバーレイ表示 |

### CSS アーキテクチャ

| セクション | 役割 |
|------------|------|
| `:root` 変数 | カラーパレットとレスポンシブフォントスケール（`clamp`） |
| `.screen` システム | `.is-active` クラスで切り替えるフルスクリーンパネル |
| `.card` / `.card--back` | 四角・中央花色つきのトランプビジュアル |
| `.pile-hit-area` | 成功・失敗アニメーションつきの中央スラップゾーン |
| `.player-badge` | アクティブ・失格状態つきのプレイヤー情報カード |
| `@keyframes` | `dealCard`（めくりアニメ）・`slapSuccess`（バウンス）・`slapFail`（赤フラッシュ） |
| `@media (max-width: 767px)` | モバイル向けレイアウト上書き |

### AI 難易度パラメータ

| 難易度 | スラップ反応時間 | カード出し遅延 | 誤スラップ率 |
|--------|----------------|----------------|-------------|
| 簡単 | 800 〜 1500 ms | 600 〜 1200 ms | 15% |
| 普通 | 400 〜 900 ms | 300 〜 700 ms | 5% |
| 難しい | 150 〜 450 ms | 150 〜 400 ms | 1% |

### オーディオエンジン

すべての音はプログラムで合成されており、**外部音声ファイルは一切不要**です。

| サウンド | 生成方式 |
|----------|----------|
| ボタン音 | Triangle + Sine 発振バースト |
| カードめくり音 | 低周波 Triangle + 減衰 |
| スラップ成功音 | Square 波インパクト + Triangle オーバートーン |
| スラップ失敗音 | Sawtooth 波の急速減衰 |
| 勝利ファンファーレ | 上昇 Triangle コード列 |
| 敗北 BGM | 下降 Sine トーン列 |
| BGM | 複数 Oscillator のドローン + パルスリズム |

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| HTML5 | 構造・画面レイアウト |
| CSS3 | スタイル・アニメーション・レスポンシブデザイン |
| Vanilla JavaScript | ゲームロジック・状態管理 |
| Web Audio API | 効果音・BGM のリアルタイム合成 |
| `localStorage` | 設定の永続化 |

**ブラウザ対応：**

| ブラウザ | 最低バージョン |
|----------|--------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---

---

# 🇹🇼 中文

## 目錄
- [遊戲介紹](#遊戲介紹)
- [遊玩方式](#遊玩方式)
- [拍牌條件](#拍牌條件)
- [遊戲設定](#遊戲設定)
- [操作說明](#操作說明)
- [程式架構](#程式架構)
- [技術棧](#技術棧)

---

## 遊戲介紹

**Slapjack（心臟病）** 是一款以台灣傳統紙牌遊戲為藍本的快節奏瀏覽器遊戲，屬於 Egyptian Ratscrew 的變體玩法。玩家輪流將手牌翻出至中央牌堆，一旦觸發配對條件，最快拍牌的玩家即可收走整疊牌。手中最後仍持有牌的玩家獲勝。

| 項目 | 內容 |
|------|------|
| 玩家人數 | 1 名人類玩家 + 1～3 名 AI |
| 牌組 | 標準 52 張（不含鬼牌） |
| 平台 | 瀏覽器（單一 HTML 檔案） |
| 難度選擇 | 簡單 / 普通 / 困難 |

---

## 遊玩方式

1. 洗牌後依人數平均發牌給所有玩家（牌面朝下）。
2. 玩家依序將手牌翻出一張至中央牌堆（牌面朝上）。
3. 當觸發**拍牌條件**時，最快拍中央牌堆的玩家獲勝。
4. 拍對者收走牌堆全部牌，加入自己手牌底部。
5. 拍錯者罰出 1 張手牌到牌堆。
6. 手牌用盡的玩家遭到淘汰。
7. 最後留下牌的玩家獲得最終勝利。

---

## 拍牌條件

| 條件名稱 | 觸發說明 | 預設狀態 |
|----------|----------|----------|
| **同點數** | 牌堆頂端兩張點數相同（如 7♠ 疊上 7♥） | 開啟 |
| **三明治** | 第 1 張與第 3 張點數相同，中間夾一張不同牌 | 開啟 |
| **連號** | 頂端三張牌為連續數字（如 5、6、7） | 關閉 |
| **2 可拍** | 頂端出現 2 即可拍牌 | 關閉 |

---

## 遊戲設定

| 設定項目 | 選項 | 預設值 |
|----------|------|--------|
| AI 人數 | 1 / 2 / 3 | 2 |
| AI 難度 | 簡單 / 普通 / 困難 | 普通 |
| 背景音量 | 0 〜 100% | 45% |
| 音效音量 | 0 〜 100% | 80% |
| 拍牌區域 | 按鈕 / 中央牌堆 | 按鈕 |
| 連號規則 | 開啟 / 關閉 | 關閉 |
| 2 可拍規則 | 開啟 / 關閉 | 關閉 |
| 動畫速度 | 慢 / 普通 / 快 | 普通 |

設定自動以 `localStorage` 持久儲存。

---

## 操作說明

| 動作 | 操作方式 |
|------|----------|
| 翻出手牌 | 點擊**翻牌**按鈕，或按 `Space` 鍵 |
| 拍中央牌堆 | 點擊**拍牌**按鈕，或按 `Enter` 鍵 |
| 點擊牌堆拍牌 | 點擊中央牌堆區域（需於設定中啟用） |
| 暫停 / 繼續 | 點擊 `Ⅱ` 按鈕 |
| 靜音切換 | 點擊 `♪` 按鈕 |
| 回主選單 | 點擊 `⌂` 按鈕 |

---

## 程式架構

整個遊戲封裝在**單一 `index.html`** 檔案中，無任何外部依賴。

### 檔案結構

```
Slapjack/
├── index.html    ← HTML、CSS、JavaScript 全部內嵌於此
└── README.md
```

### JavaScript 模組說明

| 區塊 | 功能說明 |
|------|----------|
| `DEFAULT_SETTINGS` | 所有設定項目的預設常數 |
| `AudioEngine` 類別 | 以 Web Audio API 合成 BGM 與音效的引擎 |
| `dom` 物件 | 快取所有 DOM 元素參照，避免重複查詢 |
| `game` 物件 | 遊戲的中央狀態物件（牌堆、玩家、回合等） |
| `createDeck()` | 建立並洗好的 52 張標準牌組 |
| `createPlayers()` | 初始化人類與 AI 玩家物件 |
| `dealDeck()` | 以輪流方式將牌均分給所有玩家 |
| `startGame()` | 重置狀態並開始新局 |
| `playTurn()` | 執行一次翻牌動作（人類或 AI） |
| `slap()` | 處理任一玩家的拍牌嘗試 |
| `checkSlapConditions()` | 驗證當前牌堆是否可被拍 |
| `scheduleAiSlaps()` | 依難度為 AI 設定拍牌計時器 |
| `maybeScheduleAiTurn()` | 若輪到 AI，安排自動翻牌計時 |
| `eliminateEmptyPlayers()` | 將手牌歸零的玩家標記為淘汰 |
| `finishIfNeeded()` | 當剩餘玩家 ≤ 1 時結束遊戲 |
| `render()` | 更新所有 DOM 以反映目前遊戲狀態 |
| `renderPlayers()` | 渲染玩家名牌與手牌數量 |
| `renderPile()` | 渲染中央牌堆頂端的 3 張牌 |
| `renderControls()` | 依遊戲階段啟用/停用按鈕 |
| `pauseToggle()` | 切換暫停與繼續狀態 |
| `endGame()` | 觸發結束畫面並播放對應音效 |
| `showToast()` | 顯示短暫的訊息提示覆蓋層 |

### CSS 架構說明

| 區塊 | 說明 |
|------|------|
| `:root` 變數 | 色彩系統與響應式字體縮放（`clamp`） |
| `.screen` 系統 | 透過 `.is-active` 切換的全螢幕畫面面板 |
| `.card` / `.card--back` | 含四角點數與中央花色的撲克牌視覺 |
| `.pile-hit-area` | 中央拍牌區，含成功/失敗動畫 |
| `.player-badge` | 玩家資訊卡，支援當前/淘汰狀態顯示 |
| `@keyframes` | `dealCard`（翻牌）、`slapSuccess`（彈跳）、`slapFail`（紅光閃爍） |
| `@media (max-width: 767px)` | 行動裝置版面覆寫 |

### AI 難度參數對照表

| 難度 | 拍牌反應時間 | 翻牌延遲時間 | 誤拍機率 |
|------|------------|------------|---------|
| 簡單 | 800 〜 1500 ms | 600 〜 1200 ms | 15% |
| 普通 | 400 〜 900 ms | 300 〜 700 ms | 5% |
| 困難 | 150 〜 450 ms | 150 〜 400 ms | 1% |

### 音效引擎

所有聲音均以**程式合成**方式即時生成，完全不依賴任何外部音效檔案。

| 音效類型 | 合成方式 |
|----------|----------|
| 按鈕點擊音 | Triangle + Sine 振盪短脈衝 |
| 翻牌音 | 低頻 Triangle 波加指數衰減 |
| 拍牌成功音 | Square 波衝擊 + Triangle 泛音 |
| 拍牌失敗音 | Sawtooth 波快速衰減 |
| 勝利音效 | 上揚 Triangle 和弦序列 |
| 失敗音效 | 下行 Sine 音調序列 |
| 背景音樂 | 多個 Oscillator 組合的持續低音 + 脈衝節拍 |

---

## 技術棧

| 技術 | 用途 |
|------|------|
| HTML5 | 結構與畫面佈局 |
| CSS3 | 樣式、動畫與響應式設計 |
| Vanilla JavaScript | 遊戲邏輯與狀態管理 |
| Web Audio API | 音效與背景音樂即時合成 |
| `localStorage` | 設定持久化儲存 |

**瀏覽器支援：**

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |
