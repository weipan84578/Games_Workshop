# 🃏 心臟病遊戲 — 純前端完整規格書

> **版本：** v1.0.0
> **最後更新：** 2026-05-07
> **平台：** 純前端（HTML + CSS + JavaScript）
> **模式：** 單人 vs AI（1～3 名 AI）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [遊戲規則](#2-遊戲規則)
3. [技術架構](#3-技術架構)
4. [畫面規格](#4-畫面規格)
5. [撲克牌視覺規格](#5-撲克牌視覺規格)
6. [音樂與音效規格](#6-音樂與音效規格)
7. [AI 行為設計](#7-ai-行為設計)
8. [設定系統](#8-設定系統)
9. [行動裝置適配](#9-行動裝置適配)
10. [資料結構與狀態管理](#10-資料結構與狀態管理)
11. [動畫規格](#11-動畫規格)
12. [錯誤處理與邊界情況](#12-錯誤處理與邊界情況)
13. [檔案結構](#13-檔案結構)

---

## 1. 專案概述

### 1.1 遊戲簡介

**心臟病（Egyptian Ratscrew / Slap Jack 變體）** 是一款台灣傳統快節奏紙牌遊戲。玩家輪流出牌，當牌堆頂端出現「配對」條件時，最快拍桌的玩家可贏得整疊牌。手中牌最多者為勝利者（或最後留有牌的人勝利）。

### 1.2 核心功能清單

| 功能 | 說明 |
|------|------|
| 單人 vs AI | 玩家對戰 1～3 名 AI |
| 真實撲克牌樣式 | 標準花色符號＋點數，小圖案設計 |
| 音樂系統 | 背景音樂（可切換）+ 音效 |
| 行動裝置支援 | 觸控操作，響應式版面 |
| 大字體 UI | 主畫面與設定畫面使用大型字體 |
| 設定頁面 | AI 數量、音量、音效、難度 |

---

## 2. 遊戲規則

### 2.1 基本規則

1. 使用標準 52 張牌（不含鬼牌）。
2. 洗牌後依玩家人數平均發牌（牌面朝下，各自持有）。
3. 由玩家（人類）先出第一張牌，置於桌面中央牌堆，牌面朝上。
4. 依順序（玩家 → AI 1 → AI 2 → AI 3）輪流出牌。
5. 每次只出一張牌，疊在牌堆頂端。

### 2.2 拍桌觸發條件

當下列任一條件成立時，可拍桌：

| 條件名稱 | 觸發說明 |
|----------|----------|
| 同點數 | 牌堆最頂端兩張點數相同（如：7 ♠ 疊上 7 ♥） |
| 三明治 | 頂端第一張與第三張點數相同，中間夾一張不同牌 |
| 連號 | 頂端三張牌為連續數字（如：5、6、7） |
| 大老二 | 頂端出現 2，可拍桌（選配規則，可在設定關閉） |

> **預設開啟：** 同點數、三明治
> **預設關閉：** 連號、大老二（可在設定中啟用）

### 2.3 拍桌流程

- **人類玩家：** 點擊「拍桌」按鈕（或點擊中央牌堆區域）。
- **AI 玩家：** 根據難度有不同的反應時間（詳見 AI 設計章節）。
- **最快拍桌者** 贏得牌堆所有牌，加入自己手牌堆底部。
- **誤拍（條件未成立時拍桌）：** 罰款 2 張牌給牌堆（從手牌取出）。

### 2.4 勝負條件

- **勝利：** 手中牌數最多者，或最後唯一有牌的人。
- **淘汰：** 手中無牌且無法贏得牌堆時，該玩家退出遊戲。
- **遊戲結束：** 牌堆被某一玩家全數贏走，或僅剩一名玩家有牌。

---

## 3. 技術架構

### 3.1 技術選型

```
純前端，無框架，無後端
├── HTML5          — 結構
├── CSS3           — 樣式、動畫、RWD
├── Vanilla JS     — 遊戲邏輯、狀態管理
└── Web Audio API  — 音樂與音效合成/播放
```

### 3.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

### 3.3 單一 HTML 檔案原則

所有資源（CSS、JS、SVG、音效）內嵌於單一 `index.html`，方便部署與分享。

---

## 4. 畫面規格

### 4.1 畫面流程

```
開始畫面（主選單）
    │
    ├──→ 設定畫面
    │        └──→ 返回主選單
    │
    ├──→ 遊戲說明畫面
    │        └──→ 返回主選單
    │
    └──→ 遊戲畫面
             ├──→ 遊戲中暫停選單
             │        ├──→ 繼續遊戲
             │        ├──→ 設定
             │        └──→ 返回主選單
             └──→ 遊戲結束畫面
                      ├──→ 再玩一次
                      └──→ 返回主選單
```

---

### 4.2 開始畫面（主選單）

**佈局：** 垂直置中，全螢幕背景（深綠色撲克桌布紋理）

| 元素 | 規格 |
|------|------|
| 遊戲標題 | 「❤️ 心臟病」，字體 `64px`（桌面），`48px`（行動） |
| 副標題 | 「Classic Card Game」，字體 `24px`（灰色） |
| 開始遊戲按鈕 | 寬 `280px`，高 `70px`，字體 `28px`，圓角 `12px`，主色（紅色） |
| 設定按鈕 | 寬 `280px`，高 `60px`，字體 `24px`，次要色 |
| 遊戲說明按鈕 | 寬 `280px`，高 `60px`，字體 `24px`，次要色 |
| 按鈕間距 | `20px` |

**字體規範：**

```css
/* 主選單專用字體大小 */
--font-title: clamp(40px, 8vw, 64px);
--font-subtitle: clamp(18px, 3vw, 24px);
--font-btn-primary: clamp(22px, 4vw, 28px);
--font-btn-secondary: clamp(18px, 3.5vw, 24px);
--font-ui-label: clamp(16px, 2.5vw, 20px);
```

---

### 4.3 設定畫面

**字體：** 所有標籤 `22px`，選項值 `20px`

| 設定項目 | 類型 | 選項/範圍 |
|----------|------|-----------|
| AI 玩家數量 | 數字選擇器（1-3） | 1 / 2 / 3 |
| AI 難度 | 下拉選單 | 簡單 / 普通 / 困難 |
| 背景音樂音量 | 滑桿 | 0% ～ 100% |
| 音效音量 | 滑桿 | 0% ～ 100% |
| 拍桌區域 | 切換 | 按鈕 / 整個中央區域 |
| 特殊規則：連號 | 開關 | 開 / 關 |
| 特殊規則：大老二 | 開關 | 開 / 關 |
| 動畫速度 | 下拉選單 | 慢 / 普通 / 快 |

**設定儲存：** 使用 `localStorage` 持久化保存。

---

### 4.4 遊戲畫面佈局

#### 桌面版（≥ 768px）

```
┌─────────────────────────────────────────────┐
│  [暫停] [音樂] [音效]           [回合數] [計時]│
├─────────────────────────────────────────────┤
│                                             │
│   [AI 2 手牌數] 💀         [AI 3 手牌數] 💀  │
│                                             │
│        [AI 1 區域]  [AI 1 手牌背面排列]       │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │                                         ││
│  │         🃏 中央牌堆（點擊拍桌）          ││
│  │         牌堆：37 張                     ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
│                                             │
│        [你的手牌背面排列]                    │
│   手牌：13 張    [出牌] [拍桌❤️]             │
└─────────────────────────────────────────────┘
```

#### 行動版（< 768px）

```
┌──────────────────────────┐
│ [暫停] [♫]   回合 5 [♪]  │
├──────────────────────────┤
│  AI-1 🎴×12  AI-2 🎴×13  │
│                          │
│  AI-3 🎴×14              │
│                          │
│ ┌──────────────────────┐ │
│ │                      │ │
│ │   🃏 中央牌堆         │ │
│ │      37 張            │ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│  你的手牌：13 張          │
│  [── 出  牌 ──] [❤️拍桌] │
└──────────────────────────┘
```

---

### 4.5 玩家區域元件規格

| 元件 | 桌面尺寸 | 行動尺寸 |
|------|----------|----------|
| 玩家名稱標籤 | `20px` | `18px` |
| 手牌數量顯示 | `24px` bold | `20px` bold |
| 手牌背面堆疊 | 最多顯示 5 張疊加視覺 | 最多顯示 3 張 |
| 出牌按鈕 | `200px × 60px`, `24px` | 全寬 `× 56px`, `22px` |
| 拍桌按鈕 | `200px × 60px`, `24px` | 全寬 `× 56px`, `22px` |

---

### 4.6 遊戲結束畫面

| 元素 | 規格 |
|------|------|
| 結果標題 | 「🎉 你贏了！」或「😢 你輸了！」，`48px` |
| 排名列表 | 各玩家最終手牌數，`22px` |
| 再玩一次按鈕 | `260px × 65px`，`26px` |
| 返回主選單按鈕 | `260px × 55px`，`22px` |

---

## 5. 撲克牌視覺規格

### 5.1 設計原則

- **真實撲克牌樣式：** 白色底，圓角，紅/黑花色，四角顯示點數與花色。
- **花色圖案小型化：** 中央花色圖案使用 SVG，縮小為標準撲克牌的 60%。
- **資料完全內嵌：** 花色 SVG 直接以 inline SVG 或 Unicode 呈現，無外部資源依賴。

### 5.2 牌面尺寸

| 裝置 | 寬 | 高 | 圓角 |
|------|----|----|------|
| 桌面（中央牌堆） | `100px` | `140px` | `8px` |
| 桌面（手牌預覽） | `60px` | `84px` | `6px` |
| 行動（中央牌堆） | `80px` | `112px` | `6px` |
| 行動（手牌預覽） | `44px` | `62px` | `5px` |

### 5.3 花色色彩規範

| 花色 | Unicode 符號 | 顏色代碼 |
|------|-------------|---------|
| 黑桃 ♠ | `♠` U+2660 | `#1a1a1a` |
| 紅心 ♥ | `♥` U+2665 | `#cc0000` |
| 方塊 ♦ | `♦` U+2666 | `#cc0000` |
| 梅花 ♣ | `♣` U+2663 | `#1a1a1a` |

### 5.4 牌面 HTML 結構

```html
<div class="card card--red" data-rank="A" data-suit="♥">
  <!-- 左上角 -->
  <div class="card__corner card__corner--top-left">
    <span class="card__rank">A</span>
    <span class="card__suit">♥</span>
  </div>

  <!-- 中央花色（小圖案） -->
  <div class="card__center">
    <span class="card__suit-center">♥</span>
  </div>

  <!-- 右下角（旋轉180度） -->
  <div class="card__corner card__corner--bottom-right">
    <span class="card__rank">A</span>
    <span class="card__suit">♥</span>
  </div>
</div>
```

### 5.5 牌面 CSS 規範

```css
.card {
  width: 100px;
  height: 140px;
  border-radius: 8px;
  background: #ffffff;
  border: 1.5px solid #d0d0d0;
  box-shadow: 2px 3px 8px rgba(0,0,0,0.25);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.card--red { color: #cc0000; }
.card--black { color: #1a1a1a; }

.card__corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.card__corner--top-left {
  top: 5px;
  left: 6px;
}

.card__corner--bottom-right {
  bottom: 5px;
  right: 6px;
  transform: rotate(180deg);
}

.card__rank {
  font-size: 14px;     /* 角落點數：小 */
  font-weight: bold;
  font-family: 'Georgia', serif;
}

.card__suit {
  font-size: 11px;     /* 角落花色：更小 */
  line-height: 1;
}

/* 中央花色圖案：刻意縮小 */
.card__suit-center {
  font-size: 28px;     /* 中央花色：比傳統撲克牌小 */
  opacity: 0.85;
}
```

### 5.6 牌背設計

```css
.card--back {
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%);
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 2px,
      transparent 2px,
      transparent 8px
    );
  border: 2px solid #3949ab;
}
```

### 5.7 點數對應中央花色佈局

| 點數 | 中央花色數量 | 佈局說明 |
|------|------------|---------|
| A | 1 | 正中央一個大花色 |
| 2 | 2 | 上下各一 |
| 3 | 3 | 上、中、下各一 |
| 4 | 4 | 四角各一 |
| 5 | 5 | 四角＋正中 |
| 6 | 6 | 左右各三行 |
| 7 | 7 | 6 的基礎＋上中一個 |
| 8 | 8 | 左右各四行 |
| 9 | 9 | 左右各四行＋中間一個 |
| 10 | 10 | 左右各五行 |
| J / Q / K | 1 | 中央一個特殊人物花色符號（簡化版） |

> **人物牌（JQK）：** 使用 Unicode 符號 + 花色組合簡化呈現，不需完整人物圖像。
> 例如：J♠ → 中央顯示「J」大字＋黑桃花色符號。

---

## 6. 音樂與音效規格

### 6.1 音效事件清單

| 事件 | 音效描述 | 時長（ms） |
|------|---------|-----------|
| 出牌 | 卡牌滑動聲（輕柔紙張聲） | 200 |
| 拍桌成功 | 清脆「啪」聲 + 短促勝利音 | 400 |
| 拍桌失敗（誤拍） | 低沉「嗡」聲 | 300 |
| 贏得牌堆 | 牌張收集滑動聲 | 500 |
| AI 出牌 | 輕微卡牌聲（與玩家出牌同音但更輕） | 150 |
| 遊戲勝利 | 歡呼/樂器上揚音效 | 2000 |
| 遊戲失敗 | 低沉結束音效 | 1500 |
| 按鈕點擊 | 輕觸回饋音（高頻短促） | 80 |
| 玩家被淘汰 | 輕微失落音效 | 800 |
| 洗牌 | 紙牌洗牌聲 | 600 |

### 6.2 背景音樂

| 曲目 | 場合 | 特性 |
|------|------|------|
| BGM-1（主題曲） | 主選單 | 輕鬆活潑，帶有輕盈鋼琴聲 |
| BGM-2（遊戲中） | 遊戲進行 | 節奏感適中，帶有緊張感 |
| BGM-3（高潮） | 牌堆超過 20 張時自動切換 | 快節奏，增加緊張氛圍 |
| BGM-4（勝利） | 遊戲結束（贏） | 歡快短曲，循環播放至離開 |
| BGM-5（失敗） | 遊戲結束（輸） | 略帶落寞，不過度沉重 |

### 6.3 Web Audio API 實作方式

```javascript
// 音效使用 Web Audio API 程式生成（無需外部音檔）
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.bgmGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);
  }

  // 出牌音效：使用 BufferSource + 白雜訊模擬紙張聲
  playSfx(type) {
    switch (type) {
      case 'deal': this._playDealSound(); break;
      case 'slap_success': this._playSlapSuccess(); break;
      case 'slap_fail': this._playSlapFail(); break;
      // ...
    }
  }

  // 背景音樂：使用 OscillatorNode 組合生成簡單旋律
  playBgm(track) { /* ... */ }

  setBgmVolume(v) { this.bgmGain.gain.value = v; }
  setSfxVolume(v) { this.sfxGain.gain.value = v; }
}
```

### 6.4 音效生成技術細節

| 音效 | 生成方式 |
|------|---------|
| 紙牌滑動 | 白雜訊 × 指數衰減（10-200ms） |
| 拍桌成功 | 低頻正弦波衝擊 + 高頻短音 |
| 誤拍 | 低頻方波 + 快速衰減 |
| 按鈕音 | 高頻正弦波，極短（80ms） |
| 背景音樂 | 多個 OscillatorNode 組合，使用 TriangleWave + SineWave |

---

## 7. AI 行為設計

### 7.1 AI 玩家設定

每局遊戲可設定 1 至 3 名 AI，名稱與頭像如下：

| 編號 | 名稱 | 頭像 Emoji |
|------|------|-----------|
| AI-1 | 小明 | 🤖 |
| AI-2 | 小花 | 🐱 |
| AI-3 | 老王 | 🦊 |

### 7.2 AI 難度設計

#### 簡單（Easy）

| 參數 | 數值 |
|------|------|
| 拍桌反應時間 | 800ms ～ 1500ms（隨機） |
| 誤拍機率 | 15%（條件未成立時仍有機率拍） |
| 出牌延遲 | 600ms ～ 1200ms |

#### 普通（Normal）

| 參數 | 數值 |
|------|------|
| 拍桌反應時間 | 400ms ～ 900ms（隨機） |
| 誤拍機率 | 5% |
| 出牌延遲 | 300ms ～ 700ms |

#### 困難（Hard）

| 參數 | 數值 |
|------|------|
| 拍桌反應時間 | 150ms ～ 450ms（隨機） |
| 誤拍機率 | 1% |
| 出牌延遲 | 150ms ～ 400ms |

### 7.3 AI 決策流程

```
每次有新牌出到牌堆後：
  1. AI 偵測牌堆頂端是否符合拍桌條件
  2. 若符合條件：
     a. 依難度隨機延遲後執行拍桌
     b. 難度越高，延遲越短
  3. 若不符合條件：
     a. 依誤拍機率決定是否誤拍
  4. 輪到 AI 出牌時：
     a. 依難度設定延遲後自動出牌
```

### 7.4 多 AI 競爭機制

- 多名 AI 同時計算拍桌時機，**最先到達延遲時間的 AI 勝出**。
- 玩家拍桌與 AI 拍桌同時發生時，以 **玩家優先**（給予玩家公平優勢）。

---

## 8. 設定系統

### 8.1 設定項目與預設值

```javascript
const DEFAULT_SETTINGS = {
  aiCount: 2,                  // AI 玩家數量（1-3）
  aiDifficulty: 'normal',      // 'easy' | 'normal' | 'hard'
  bgmVolume: 0.7,              // 背景音樂音量（0-1）
  sfxVolume: 0.8,              // 音效音量（0-1）
  tapArea: 'button',           // 'button' | 'center' 拍桌區域
  ruleConsecutive: false,      // 連號規則
  ruleTwos: false,             // 大老二規則
  animationSpeed: 'normal'     // 'slow' | 'normal' | 'fast'
};
```

### 8.2 設定持久化

```javascript
// 讀取設定
function loadSettings() {
  const saved = localStorage.getItem('heartAttack_settings');
  return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
}

// 儲存設定
function saveSettings(settings) {
  localStorage.setItem('heartAttack_settings', JSON.stringify(settings));
}
```

### 8.3 設定 UI 字體規範

```css
/* 設定畫面專用字體 */
.settings-label   { font-size: 22px; font-weight: 600; }
.settings-value   { font-size: 20px; }
.settings-title   { font-size: 32px; font-weight: bold; }
.settings-section { font-size: 18px; color: #888; letter-spacing: 0.05em; }
```

---

## 9. 行動裝置適配

### 9.1 Breakpoints

```css
/* 行動裝置 */
@media (max-width: 767px) { ... }

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* 桌面 */
@media (min-width: 1024px) { ... }
```

### 9.2 觸控操作規範

| 操作 | 行動裝置實作 |
|------|------------|
| 出牌 | 點擊「出牌」按鈕（大型，全寬） |
| 拍桌 | 點擊「❤️ 拍桌」按鈕 或 點擊中央牌堆（依設定） |
| 開啟設定 | 點擊右上角設定齒輪圖標 |
| 暫停 | 點擊左上角暫停圖標 |

**最小點擊目標尺寸（依 WCAG 2.1 AA 標準）：**
- 所有可互動元件：至少 `44px × 44px`
- 主要按鈕（出牌、拍桌）：至少 `全寬 × 56px`

### 9.3 防誤觸設計

- 拍桌按鈕與出牌按鈕之間間距至少 `16px`。
- 拍桌後設置 `200ms` 冷卻期，防止重複點擊。
- 若設定為「整個中央區域拍桌」，中央牌堆設置 `300ms` 防抖。

### 9.4 視口設定

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 9.5 行動裝置遊戲區域高度計算

```css
/* 處理行動裝置瀏覽器底部工具列 */
.game-wrapper {
  height: 100vh;
  height: 100dvh; /* Dynamic Viewport Height（現代行動瀏覽器） */
}
```

---

## 10. 資料結構與狀態管理

### 10.1 牌堆資料結構

```javascript
// 單張牌
const card = {
  suit: '♥',          // '♠' | '♥' | '♦' | '♣'
  rank: 'A',          // 'A'|'2'|'3'|...|'10'|'J'|'Q'|'K'
  value: 1,           // 數值（A=1, 2-10=面值, J=11, Q=12, K=13）
  color: 'red'        // 'red' | 'black'
};

// 一副完整牌組
function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  return suits.flatMap(suit =>
    ranks.map((rank, i) => ({
      suit,
      rank,
      value: i + 1,
      color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
    }))
  );
}
```

### 10.2 玩家資料結構

```javascript
const player = {
  id: 'human',             // 'human' | 'ai-1' | 'ai-2' | 'ai-3'
  name: '玩家',
  type: 'human',           // 'human' | 'ai'
  hand: [],                // 手牌陣列（Card[]）
  isEliminated: false,
  slapCooldown: false,     // 防誤觸冷卻狀態
  avatar: '🧑'
};
```

### 10.3 遊戲狀態

```javascript
const gameState = {
  phase: 'idle',           // 'idle' | 'playing' | 'paused' | 'ended'
  pile: [],                // 中央牌堆（Card[]）
  players: [],             // Player[]
  currentTurn: 0,          // 當前出牌玩家 index
  turnCount: 0,            // 總回合數
  settings: {},            // 當前設定
  winner: null,            // 勝者 Player | null
  slapCooldown: false      // 全局拍桌冷卻
};
```

### 10.4 拍桌條件判斷函式

```javascript
function checkSlapConditions(pile, settings) {
  if (pile.length < 2) return false;

  const top = pile[pile.length - 1];
  const second = pile[pile.length - 2];

  // 同點數
  if (top.value === second.value) return true;

  // 三明治（需至少 3 張）
  if (pile.length >= 3) {
    const third = pile[pile.length - 3];
    if (top.value === third.value) return true;
  }

  // 連號（選配）
  if (settings.ruleConsecutive && pile.length >= 3) {
    const third = pile[pile.length - 3];
    const sorted = [top.value, second.value, third.value].sort((a, b) => a - b);
    if (sorted[2] - sorted[1] === 1 && sorted[1] - sorted[0] === 1) return true;
  }

  // 大老二（選配）
  if (settings.ruleTwos && top.value === 2) return true;

  return false;
}
```

---

## 11. 動畫規格

### 11.1 出牌動畫

| 參數 | 數值 |
|------|------|
| 動畫類型 | CSS `transform` slide-in |
| 方向 | 從玩家手牌區域飛向中央牌堆 |
| 時長（普通） | 300ms |
| 時長（快速） | 150ms |
| 時長（慢速） | 500ms |
| 緩動函式 | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

```css
@keyframes dealCard {
  from {
    transform: translateY(80px) scale(0.8);
    opacity: 0.6;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.card--dealing {
  animation: dealCard 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

### 11.2 拍桌動畫

```css
/* 成功拍桌：牌堆震動 + 閃光 */
@keyframes slapSuccess {
  0%   { transform: scale(1); }
  20%  { transform: scale(1.15) rotate(-2deg); }
  40%  { transform: scale(1.1) rotate(2deg); }
  60%  { transform: scale(1.05) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* 失敗拍桌：紅色閃爍 */
@keyframes slapFail {
  0%, 100% { background-color: transparent; }
  50%       { background-color: rgba(220, 0, 0, 0.3); }
}
```

### 11.3 贏得牌堆動畫

- 牌堆中的牌依序「飛向」勝者的手牌區域。
- 時長：每張 `50ms`，交錯 `20ms`。
- 使用 `requestAnimationFrame` 實作流暢動畫。

### 11.4 UI 過場動畫

| 場景 | 動畫 | 時長 |
|------|------|------|
| 畫面切換 | fade in/out | 300ms |
| 設定面板開關 | slide up/down | 250ms |
| 遊戲結束畫面 | 由中心放大淡入 | 400ms |

---

## 12. 錯誤處理與邊界情況

### 12.1 邊界情況處理

| 情況 | 處理方式 |
|------|---------|
| 玩家手牌用盡 | 標記為淘汰，從出牌順序移除 |
| 只剩一名玩家 | 立即結束遊戲，該玩家勝利 |
| 牌堆為空時拍桌 | 忽略操作（按鈕 disabled 狀態） |
| AI 出牌時 UI 誤拍 | 不影響 AI 出牌流程，玩家操作有效 |
| Audio Context 未解鎖 | 在用戶第一次點擊時解鎖（移動裝置限制） |

### 12.2 Web Audio API 解鎖

```javascript
// 行動裝置需要用戶互動後才能播放音效
document.addEventListener('click', function unlockAudio() {
  if (audioEngine.ctx.state === 'suspended') {
    audioEngine.ctx.resume();
  }
  document.removeEventListener('click', unlockAudio);
}, { once: true });
```

### 12.3 LocalStorage 容錯

```javascript
function safeLocalStorage(action, key, value) {
  try {
    if (action === 'get') return localStorage.getItem(key);
    if (action === 'set') localStorage.setItem(key, value);
  } catch (e) {
    // Private mode 或 storage 已滿時靜默失敗
    console.warn('localStorage unavailable:', e);
    return null;
  }
}
```

---

## 13. 檔案結構

```
heartattack/
├── index.html           ← 單一檔案，包含所有 HTML/CSS/JS
└── README.md            ← （選配）部署說明
```

### 13.1 index.html 內部結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>❤️ 心臟病</title>
  <style>
    /* === CSS 區塊 === */
    /* 1. CSS Reset & 全域變數 */
    /* 2. 主選單樣式 */
    /* 3. 設定畫面樣式 */
    /* 4. 遊戲畫面樣式 */
    /* 5. 撲克牌元件樣式 */
    /* 6. 動畫定義 */
    /* 7. 行動裝置 Media Queries */
  </style>
</head>
<body>

  <!-- === HTML 區塊 === -->
  <!-- 1. 主選單畫面 -->
  <!-- 2. 設定畫面 -->
  <!-- 3. 遊戲說明畫面 -->
  <!-- 4. 遊戲主畫面 -->
  <!-- 5. 暫停選單（Overlay） -->
  <!-- 6. 遊戲結束畫面（Overlay） -->

  <script>
    /* === JavaScript 區塊 === */
    // 1. 常數與設定
    // 2. AudioEngine 類別
    // 3. Card / Deck 工具函式
    // 4. GameState 管理
    // 5. AI 邏輯
    // 6. 拍桌條件判斷
    // 7. UI 渲染函式
    // 8. 動畫控制器
    // 9. 事件處理（點擊、觸控）
    // 10. 初始化 & 主程式入口
  </script>

</body>
</html>
```

---

## 附錄 A：色彩系統

```css
:root {
  /* 主色調 */
  --color-primary: #c62828;      /* 心臟病紅 */
  --color-primary-dark: #8e0000;
  --color-secondary: #1b5e20;    /* 撲克桌綠 */
  --color-secondary-dark: #003300;

  /* 背景 */
  --color-bg-table: #2e7d32;     /* 桌面綠色 */
  --color-bg-ui: #1a1a2e;        /* UI 面板深藍黑 */
  --color-bg-card: #ffffff;      /* 牌面白色 */

  /* 文字 */
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-card-red: #cc0000;
  --color-text-card-black: #1a1a1a;

  /* 功能色 */
  --color-success: #43a047;
  --color-danger: #e53935;
  --color-warning: #fb8c00;
  --color-info: #1e88e5;
}
```

---

## 附錄 B：字體縮放系統

```css
:root {
  /* clamp(最小值, 視口響應值, 最大值) */
  --font-display:   clamp(40px, 8vw,   64px);   /* 遊戲標題 */
  --font-heading:   clamp(26px, 5vw,   40px);   /* 頁面標題 */
  --font-btn-lg:    clamp(22px, 4vw,   28px);   /* 主要按鈕 */
  --font-btn-sm:    clamp(18px, 3.5vw, 24px);   /* 次要按鈕 */
  --font-setting:   clamp(20px, 3.5vw, 24px);   /* 設定標籤 */
  --font-body:      clamp(16px, 2.5vw, 20px);   /* 一般說明 */
  --font-card-rank: clamp(12px, 2vw,   16px);   /* 牌角點數 */
  --font-card-suit-corner: clamp(10px, 1.8vw, 13px);   /* 牌角花色 */
  --font-card-suit-center: clamp(22px, 4vw,   32px);   /* 中央花色（刻意小） */
}
```

---

*規格書結束 — 版本 v1.0.0*
