# 🐦 Flappy Bird 純前端完整規格書

> **版本**：v1.0.0　｜　**日期**：2026-05-04　｜　**平台**：Pure Frontend（HTML5 / CSS3 / Vanilla JS）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [目錄結構](#3-目錄結構)
4. [畫面規格](#4-畫面規格)
5. [遊戲機制](#5-遊戲機制)
6. [音樂與音效](#6-音樂與音效)
7. [設定系統](#7-設定系統)
8. [RWD 行動裝置支援](#8-rwd-行動裝置支援)
9. [字體規格](#9-字體規格)
10. [動畫規格](#10-動畫規格)
11. [資料儲存](#11-資料儲存)
12. [程式模組設計](#12-程式模組設計)
13. [效能規範](#13-效能規範)
14. [開發里程碑](#14-開發里程碑)

---

## 1. 專案概述

### 1.1 目標
以純前端技術（零後端依賴）實作完整的 Flappy Bird 遊戲，支援桌機與行動裝置，並提供音樂、音效、設定介面等完整功能。

### 1.2 核心需求摘要

| 項目 | 說明 |
|------|------|
| 技術限制 | 純 HTML5 + CSS3 + Vanilla JS，不依賴任何外部框架 |
| 渲染方式 | HTML5 Canvas 2D API |
| 音效系統 | Web Audio API（程式產生，無需外部音樂檔） |
| 儲存方式 | localStorage |
| 行動支援 | 觸控操作、RWD 自適應、防止頁面滾動 |
| 最低瀏覽器支援 | Chrome 80+、Firefox 75+、Safari 13+、iOS Safari 13+ |

### 1.3 單檔部署
整個遊戲封裝為 **單一 `index.html`** 檔案，無需任何伺服器環境，直接雙擊即可於瀏覽器中執行。

---

## 2. 技術架構

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │  <style> │  │ <canvas> │  │       <script>        │ │
│  │  CSS3    │  │ 遊戲畫布  │  │                       │ │
│  │  動畫    │  │          │  │  ┌─────────────────┐   │ │
│  │  RWD     │  └──────────┘  │  │   GameEngine    │   │ │
│  └──────────┘                │  ├─────────────────┤   │ │
│                              │  │   AudioEngine   │   │ │
│  ┌──────────────────────┐    │  ├─────────────────┤   │ │
│  │   HTML UI Overlay    │    │  │   SceneManager  │   │ │
│  │  - 主選單            │    │  ├─────────────────┤   │ │
│  │  - 設定畫面          │    │  │   InputManager  │   │ │
│  │  - 排行榜            │    │  ├─────────────────┤   │ │
│  │  - 遊戲結束畫面      │    │  │   StorageManager│   │ │
│  └──────────────────────┘    │  └─────────────────┘   │ │
│                              └───────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.1 模組職責

| 模組 | 職責 |
|------|------|
| `GameEngine` | 主遊戲迴圈、物理運算、碰撞偵測 |
| `AudioEngine` | 音樂播放、音效觸發、Web Audio API 管理 |
| `SceneManager` | 畫面切換、UI Overlay 顯示與隱藏 |
| `InputManager` | 鍵盤、滑鼠點擊、觸控事件統一管理 |
| `StorageManager` | 最高分、設定項目的 localStorage 存取 |

---

## 3. 目錄結構

由於採用單檔設計，邏輯目錄結構如下（皆內嵌於 `index.html`）：

```
index.html
  ├── <head>
  │    ├── <meta> viewport, charset, og tags
  │    ├── <title> Flappy Bird
  │    └── <style> ← 全部 CSS
  │
  ├── <body>
  │    ├── #loading-screen        ← 載入畫面
  │    ├── #main-menu             ← 主選單
  │    ├── #settings-screen       ← 設定畫面
  │    ├── #leaderboard-screen    ← 排行榜
  │    ├── #game-ui               ← 遊戲中 HUD
  │    ├── #gameover-screen       ← 遊戲結束
  │    └── <canvas id="gameCanvas">
  │
  └── <script> ← 全部 JS（模組化結構，IIFE 封裝）
```

---

## 4. 畫面規格

### 4.1 畫面列表

| 畫面 ID | 名稱 | 觸發條件 |
|---------|------|---------|
| `#loading-screen` | 載入畫面 | 頁面載入時 |
| `#main-menu` | 主選單 | 載入完成後、遊戲結束返回 |
| `#settings-screen` | 設定畫面 | 點擊設定按鈕 |
| `#leaderboard-screen` | 排行榜 | 點擊排行榜按鈕 |
| `#game-ui` | 遊戲中 HUD | 遊戲進行中 |
| `#gameover-screen` | 遊戲結束 | 玩家碰撞 |

---

### 4.2 載入畫面（`#loading-screen`）

**目的**：初始化 AudioContext、Canvas，提供進場動畫

```
┌────────────────────────────────────┐
│                                    │
│         🐦（飛翔動畫）              │
│                                    │
│        FLAPPY BIRD                 │
│      ████████████░░  85%           │
│       Loading...                   │
│                                    │
└────────────────────────────────────┘
```

**規格**：
- 背景：漸層天空色 `#87CEEB → #4FC3F7`
- 鳥的飛翔動畫：CSS keyframe，上下浮動 ±10px，週期 1s
- 進度條：模擬進度（0% → 100%，約 1.5 秒），完成後自動跳轉主選單
- 字體大小：標題 `56px`，副標 `22px`

---

### 4.3 主選單（`#main-menu`）

**目的**：遊戲入口，提供開始、設定、排行榜入口

```
┌────────────────────────────────────┐
│                          ⚙️  🏆    │  ← 右上角圖示按鈕
│                                    │
│    🐦🐦🐦  （飛翔動畫）             │
│                                    │
│       ╔══════════════════╗         │
│       ║   FLAPPY BIRD    ║         │  ← 主標題
│       ╚══════════════════╝         │
│                                    │
│      ┌──────────────────┐          │
│      │   ▶  開始遊戲    │          │  ← 主按鈕
│      └──────────────────┘          │
│                                    │
│      最高分：  🏅  42              │
│                                    │
└────────────────────────────────────┘
```

**規格**：
- 背景：Canvas 渲染（視差背景：天空、雲、地面持續捲動）
- 主標題字體：`72px`，加描邊陰影效果
- 「開始遊戲」按鈕：`52px`，帶脈衝動畫（scale 1.0→1.05 循環）
- 最高分文字：`36px`
- 右上角⚙️設定、🏆排行榜：`48px` icon 尺寸，觸控區域 `60×60px`
- 鳥飛翔動畫：3 隻鳥以不同速度橫越畫面

---

### 4.4 設定畫面（`#settings-screen`）

```
┌────────────────────────────────────┐
│  ←返回          設定               │
│ ─────────────────────────────────  │
│                                    │
│  🔊 音效音量                       │
│     ●────────────○  70%            │  ← Slider
│                                    │
│  🎵 背景音樂                       │
│     ●────────────○  50%            │  ← Slider
│                                    │
│  🎨 鳥的顏色                       │
│    🟡  🔴  🔵  🟢  🟣             │  ← 顏色選擇
│                                    │
│  ⚡ 難度                           │
│    ○ 簡單  ●一般  ○ 困難           │  ← Radio
│                                    │
│  🌙 暗色模式  ●────○               │  ← Toggle
│                                    │
└────────────────────────────────────┘
```

**規格**：
- 標題字體：`48px`
- 項目標籤：`32px`
- Slider、Radio、Toggle：觸控友善，最小高度 `48px`
- 所有設定即時生效（無需「儲存」按鈕）
- 變更自動寫入 localStorage

---

### 4.5 排行榜（`#leaderboard-screen`）

```
┌────────────────────────────────────┐
│  ←返回         🏆 排行榜           │
│ ─────────────────────────────────  │
│                                    │
│   #1  👑  99                       │
│   #2  🥈  76                       │
│   #3  🥉  55                       │
│   #4       42                      │
│   #5       38                      │
│  ──────────────────────────────    │
│           清除紀錄                 │
│                                    │
└────────────────────────────────────┘
```

**規格**：
- 標題字體：`48px`
- 排名文字：`36px`
- 前三名加 emoji 王冠／獎牌標示
- 最多顯示 10 筆，儲存於 localStorage
- 「清除紀錄」按鈕需二次確認

---

### 4.6 遊戲中 HUD（`#game-ui`）

```
┌────────────────────────────────────┐
│           42              ⏸        │  ← 分數（中央）、暫停鈕（右上）
│                                    │
│  （Canvas 遊戲畫面）               │
│                                    │
└────────────────────────────────────┘
```

**規格**：
- 分數字體：`72px`，白色加黑色描邊，置中
- 暫停按鈕：`60×60px`，半透明背景，右上角

---

### 4.7 遊戲結束畫面（`#gameover-screen`）

```
┌────────────────────────────────────┐
│                                    │
│          GAME OVER                 │  ← 大標題，震動動畫
│                                    │
│    本次分數：  ★  42               │
│    最高紀錄：  🏅  76              │
│                                    │
│   ┌────────────┐ ┌─────────────┐   │
│   │  🔄 再玩   │ │  🏠 主選單  │   │
│   └────────────┘ └─────────────┘   │
│                                    │
│      是否為新紀錄？ 🎉             │  ← 若破紀錄顯示
└────────────────────────────────────┘
```

**規格**：
- 「GAME OVER」字體：`80px`，紅色漸層，帶震動 keyframe
- 分數字體：`48px`
- 按鈕字體：`40px`
- 破紀錄時顯示金色閃爍動畫 + 慶祝音效

---

## 5. 遊戲機制

### 5.1 Canvas 尺寸

| 裝置 | 尺寸 |
|------|------|
| 桌機（預設） | `400 × 600 px`（含 letter-box 縮放） |
| 行動裝置 | 自動縮放填滿螢幕高度，保持 2:3 比例 |

### 5.2 遊戲物件

#### 🐦 玩家（Bird）

| 屬性 | 值 |
|------|-----|
| 尺寸 | `34 × 24 px` |
| 初始位置 | X: Canvas 25%，Y: Canvas 50% |
| 重力加速度 | `0.35 px/frame` |
| 最大下落速度 | `8 px/frame` |
| 跳躍速度 | `-7 px/frame`（向上） |
| 旋轉角度 | 與速度連動，最大 ±30° |
| 動畫幀數 | 3 幀翅膀拍打，每 100ms 切換 |

#### 🟩 水管（Pipe）

| 屬性 | 值 |
|------|-----|
| 寬度 | `52 px` |
| 間距（缺口） | 簡單: `160px`，一般: `130px`，困難: `100px` |
| 生成間隔 | `1.8 秒` |
| 移動速度 | 簡單: `2px/frame`，一般: `3px/frame`，困難: `4px/frame`（每 10 分加速 0.3） |
| 缺口 Y 範圍 | Canvas 20% ～ 80% 隨機 |

#### 🌍 背景

| 層次 | 元素 | 捲動速度 |
|------|------|---------|
| 最遠層 | 天空漸層（靜止） | 0 |
| 中遠層 | 雲朵（3～5 朵） | `0.5 px/frame` |
| 近層 | 地面 | 同水管速度 |

### 5.3 碰撞偵測

- 使用 **AABB（軸對齊邊界框）** 碰撞，加上 **4px 容忍邊距**（讓遊戲感覺公平）
- 觸地（Canvas 底部地面）或觸頂（Canvas 頂部）立即結束
- 碰撞瞬間：畫面紅色閃光 + 音效 + 震動（行動裝置 `navigator.vibrate(200)`）

### 5.4 計分

- 通過一組水管中央 +1 分
- 每 10 分觸發「里程碑」音效
- 分數即時顯示於畫面中央上方

### 5.5 暫停系統

- 點擊暫停鈕或按 `ESC`/`P` 暫停
- 暫停時 Canvas 變暗，顯示半透明遮罩與「繼續」按鈕
- 背景音樂暫停，恢復遊戲時重播

### 5.6 難度系統

| 難度 | 缺口大小 | 水管速度 | 重力 | 加速機制 |
|------|---------|---------|------|---------|
| 簡單 | 160px | 2 px/f | 0.28 | 無 |
| 一般（預設） | 130px | 3 px/f | 0.35 | 每 10 分 +0.3 |
| 困難 | 100px | 4 px/f | 0.42 | 每 5 分 +0.4 |

---

## 6. 音樂與音效

> 全部音效使用 **Web Audio API 程式產生**，無需外部音訊檔案，確保單檔離線執行。

### 6.1 背景音樂（BGM）

使用 `OscillatorNode` + `GainNode` 組合，合成 8-bit 風格旋律。

```javascript
// BGM 合成範例架構
// 使用多個 Oscillator 疊加形成和弦旋律
class BGMSynth {
  // 音符序列（8-bit 風格）
  notes = [523, 587, 659, 698, 784, 880, 988, 1047]; // C5 音階
  // 節拍：BPM 120，每 500ms 切換音符
  // 音色：square wave + 低通濾波
}
```

**規格**：
- 波形：`square`（8-bit 感）
- BPM：120
- 旋律長度：8 小節循環
- 淡入淡出：切換場景時 0.5 秒 fade
- 可獨立調整音量（0～100%）

### 6.2 音效清單

| 音效 ID | 觸發時機 | 合成方式 | 參數 |
|---------|---------|---------|------|
| `sfx_flap` | 玩家跳躍 | 短促 sine burst | 頻率 880Hz，時長 80ms，指數衰減 |
| `sfx_score` | 通過水管 | 上升音階 | 800→1200Hz，時長 120ms |
| `sfx_milestone` | 每 10 分 | 短旋律（3音） | 523→659→784Hz |
| `sfx_hit` | 碰撞水管 | 低頻噪音 burst | noise + 220Hz，時長 300ms |
| `sfx_die` | 觸地死亡 | 下滑音 | 440→110Hz，時長 500ms |
| `sfx_highscore` | 破紀錄 | 勝利旋律（5音） | 快速上升音階 |
| `sfx_button` | 點擊按鈕 | 輕短 pop | 600Hz，時長 50ms |
| `sfx_swoosh` | 畫面切換 | 白噪音掃過 | 時長 200ms |

### 6.3 AudioEngine 架構

```
AudioContext
    ├── MasterGainNode（主音量）
    │    ├── BGMGainNode（音樂音量）
    │    │    └── OscillatorNodes（旋律）
    │    └── SFXGainNode（音效音量）
    │         └── （動態建立的音效 Buffer）
    └── AnalyserNode（可選：頻譜視覺化）
```

### 6.4 iOS 音訊解鎖

iOS Safari 要求使用者手勢後才能啟動 AudioContext：

```javascript
// 第一次觸控事件時解鎖
document.addEventListener('touchstart', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });
```

---

## 7. 設定系統

### 7.1 設定項目

| 設定鍵 | 類型 | 預設值 | 說明 |
|--------|------|-------|------|
| `sfxVolume` | `number` 0～1 | `0.7` | 音效音量 |
| `bgmVolume` | `number` 0～1 | `0.5` | 背景音樂音量 |
| `birdColor` | `string` | `'yellow'` | 鳥的顏色（yellow/red/blue/green/purple） |
| `difficulty` | `string` | `'normal'` | 難度（easy/normal/hard） |
| `darkMode` | `boolean` | `false` | 暗色模式 |
| `vibration` | `boolean` | `true` | 震動回饋（行動裝置） |

### 7.2 設定讀取優先序

```
localStorage 儲存值 → 程式預設值
```

### 7.3 localStorage Schema

```json
{
  "flappybird_settings": {
    "sfxVolume": 0.7,
    "bgmVolume": 0.5,
    "birdColor": "yellow",
    "difficulty": "normal",
    "darkMode": false,
    "vibration": true
  },
  "flappybird_scores": [99, 76, 55, 42, 38],
  "flappybird_best": 99
}
```

---

## 8. RWD 行動裝置支援

### 8.1 Viewport 設定

```html
<meta name="viewport"
  content="width=device-width, initial-scale=1.0,
           maximum-scale=1.0, user-scalable=no">
```

### 8.2 Canvas 自適應縮放

```javascript
// Canvas 保持 2:3 比例，縮放填滿螢幕
function resizeCanvas() {
  const targetRatio = 2 / 3;
  const windowRatio = window.innerWidth / window.innerHeight;

  if (windowRatio < targetRatio) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / targetRatio;
  } else {
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * targetRatio;
  }
  // 套用 CSS transform scale 維持邏輯座標一致
}
window.addEventListener('resize', resizeCanvas);
```

### 8.3 觸控操作

| 操作 | 行動裝置 | 桌機 |
|------|---------|------|
| 跳躍 | 單指點擊 Canvas | 空白鍵 / 滑鼠左鍵 |
| 開始遊戲 | 點擊按鈕 | 點擊按鈕 |
| 暫停 | 點擊暫停鈕 | ESC / P |

### 8.4 防止預設行為

```javascript
// 防止遊戲中頁面捲動、縮放
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('touchstart', e => {
  if (e.target === canvas) e.preventDefault();
}, { passive: false });
```

### 8.5 安全區域（Notch / Dynamic Island）

```css
.game-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 8.6 PWA 支援（可選強化）

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#87CEEB">
```

---

## 9. 字體規格

> 所有字體使用 **Google Fonts CDN** 載入，並提供系統字體回退方案。

### 9.1 字體選用

| 用途 | 字體 | 系統回退 |
|------|------|---------|
| 主標題 | `Fredoka One` | `Impact, fantasy` |
| UI 文字、按鈕 | `Nunito` | `Arial Rounded MT Bold, sans-serif` |
| 分數（HUD） | `Press Start 2P`（像素風） | `monospace` |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&family=Press+Start+2P&display=swap" rel="stylesheet">
```

### 9.2 字體大小規範

| 元素 | 桌機尺寸 | 行動裝置尺寸 | 字體 |
|------|---------|------------|------|
| 遊戲主標題 | `72px` | `clamp(48px, 12vw, 72px)` | Fredoka One |
| 載入標題 | `56px` | `clamp(36px, 10vw, 56px)` | Fredoka One |
| 畫面標題（設定等） | `48px` | `clamp(32px, 8vw, 48px)` | Fredoka One |
| 主要按鈕 | `52px` | `clamp(36px, 9vw, 52px)` | Nunito 900 |
| 次要按鈕 | `40px` | `clamp(28px, 7vw, 40px)` | Nunito 700 |
| HUD 分數 | `72px`（Canvas） | 隨 Canvas 縮放 | Press Start 2P |
| 設定項目標籤 | `32px` | `clamp(24px, 6vw, 32px)` | Nunito 700 |
| 說明文字 | `24px` | `clamp(18px, 4vw, 24px)` | Nunito 400 |
| 最高分顯示 | `36px` | `clamp(26px, 6.5vw, 36px)` | Nunito 700 |

### 9.3 Canvas 文字繪製

Canvas 內文字（HUD 分數）使用 `ctx.font` 設定：

```javascript
// HUD 分數
ctx.font = `bold ${Math.floor(canvasHeight * 0.1)}px 'Press Start 2P'`;
ctx.textAlign = 'center';
ctx.fillStyle = '#FFFFFF';
ctx.strokeStyle = '#000000';
ctx.lineWidth = 4;
ctx.strokeText(score, canvas.width / 2, canvas.height * 0.12);
ctx.fillText(score, canvas.width / 2, canvas.height * 0.12);
```

---

## 10. 動畫規格

### 10.1 UI 動畫

| 動畫 | 元素 | CSS Keyframe | 時長 |
|------|------|-------------|------|
| 鳥飛翔浮動 | 主選單裝飾鳥 | `translateY(-10px ↔ 10px)` | 1s infinite alternate |
| 按鈕脈衝 | 開始遊戲鈕 | `scale(1.0 → 1.05)` | 0.8s infinite alternate |
| 畫面淡入 | 所有 Overlay | `opacity 0 → 1` | 0.3s ease |
| GAME OVER 震動 | #gameover-screen 標題 | `translateX(±5px)` | 0.05s × 6 次 |
| 破紀錄閃爍 | 最高分區塊 | `color gold ↔ orange` | 0.3s × 4 |

### 10.2 Canvas 動畫

| 動畫 | 機制 | 細節 |
|------|------|------|
| 鳥翅膀拍打 | 3 幀 sprite 切換 | 每 100ms，Canvas drawImage |
| 鳥旋轉 | `ctx.rotate()` | 角度 = `velocity * 3°`，限 ±30° |
| 雲朵視差 | 多層速度 | 遠層 0.5x，近層 1x |
| 地面捲動 | tile 重複繪製 | tileOffset = (tileOffset + speed) % tileWidth |
| 碰撞閃光 | 白色全螢幕矩形 | 單幀，alpha 0.8 |

### 10.3 幀率目標

- 目標：`60 FPS`（requestAnimationFrame）
- 使用 `delta time` 補償幀率波動：

```javascript
let lastTime = 0;
function gameLoop(timestamp) {
  const delta = (timestamp - lastTime) / 16.67; // 正規化至 60fps
  lastTime = timestamp;
  update(delta);
  render();
  requestAnimationFrame(gameLoop);
}
```

---

## 11. 資料儲存

### 11.1 StorageManager API

```javascript
class StorageManager {
  save(key, value) { /* JSON.stringify → localStorage */ }
  load(key, defaultValue) { /* JSON.parse ← localStorage */ }
  getSettings() { /* 回傳設定物件 */ }
  saveSettings(settings) { /* 儲存設定 */ }
  addScore(score) { /* 加入分數、排序、截斷至前10名 */ }
  getScores() { /* 回傳 number[] */ }
  getBestScore() { /* 回傳最高分 */ }
  clearScores() { /* 清除所有分數 */ }
}
```

### 11.2 儲存鍵值

| 鍵 | 資料型別 | 說明 |
|----|---------|------|
| `flappybird_settings` | JSON Object | 遊戲設定 |
| `flappybird_scores` | JSON Array\<number\> | 最多 10 筆分數 |
| `flappybird_best` | number | 最高單筆分數 |

---

## 12. 程式模組設計

### 12.1 主要類別結構

```
Game（全域入口）
 ├── SceneManager
 │    ├── showScene(id)
 │    └── hideAll()
 ├── InputManager
 │    ├── onJump(callback)
 │    └── destroy()
 ├── AudioEngine
 │    ├── playBGM()
 │    ├── stopBGM()
 │    ├── playSFX(id)
 │    ├── setBGMVolume(v)
 │    └── setSFXVolume(v)
 ├── StorageManager
 │    └── （見 §11.1）
 └── GameEngine
      ├── start()
      ├── pause() / resume()
      ├── reset()
      ├── update(delta)
      ├── render()
      ├── Bird { x, y, vy, frame, color }
      ├── Pipes[]  { x, gapY, gapSize, passed }
      └── Background { clouds[], groundOffset }
```

### 12.2 遊戲狀態機

```
IDLE
  │  start()
  ▼
PLAYING ──── pause() ──── PAUSED
  │                          │
  │                      resume()
  │◄─────────────────────────┘
  │  collision
  ▼
GAMEOVER
  │  reset()
  ▼
IDLE
```

---

## 13. 效能規範

| 指標 | 目標 |
|------|------|
| 首次載入時間 | < 2 秒（無網路依賴，僅 Google Fonts） |
| 穩定幀率 | 60 FPS（中階手機） |
| 記憶體用量 | < 50 MB |
| 檔案大小 | < 80 KB（單一 index.html） |
| Canvas Repaint | 每幀全清 + 分層繪製，避免 overdraw |
| 物件池 | Pipe 物件使用物件池（最多 10 個），避免頻繁 GC |

---

## 14. 開發里程碑

| 階段 | 內容 | 預估工時 |
|------|------|---------|
| **M1** 骨架 | HTML 結構、CSS 基礎樣式、Canvas 初始化 | 2h |
| **M2** 遊戲核心 | 鳥物理、水管生成、碰撞偵測、計分 | 4h |
| **M3** 美術 | 背景視差、鳥動畫、UI 動畫、字體套用 | 3h |
| **M4** 音效 | Web Audio API BGM + 全部音效合成 | 3h |
| **M5** UI 完整 | 主選單、設定、排行榜、遊戲結束畫面 | 3h |
| **M6** RWD | 行動裝置縮放、觸控、安全區域 | 2h |
| **M7** 儲存 | localStorage 設定、分數系統 | 1h |
| **M8** 測試優化 | 跨裝置測試、效能調校、Bug 修正 | 2h |
| **總計** | | **~20h** |

---

## 附錄 A：色彩系統

```css
:root {
  /* 主色 */
  --sky-top: #87CEEB;
  --sky-bottom: #4FC3F7;
  --ground: #DEB887;
  --ground-dark: #8B6914;
  --pipe-green: #4CAF50;
  --pipe-dark: #388E3C;
  --pipe-light: #81C784;

  /* UI */
  --btn-primary: #FFC107;
  --btn-primary-hover: #FFB300;
  --btn-text: #5D4037;
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --score-text: #FFFFFF;
  --score-shadow: #000000;

  /* 暗色模式覆寫 */
  --sky-top-dark: #1a2a3a;
  --sky-bottom-dark: #0d1b2a;
}
```

## 附錄 B：鳥的顏色對照

| 選項 | 主色 | 腹部色 | 嘴色 |
|------|------|-------|------|
| yellow（預設） | `#FFD700` | `#FFF8DC` | `#FF8C00` |
| red | `#FF4444` | `#FFE0E0` | `#CC0000` |
| blue | `#4488FF` | `#E0EEFF` | `#0044CC` |
| green | `#44CC44` | `#E0FFE0` | `#006600` |
| purple | `#AA44FF` | `#EEE0FF` | `#660099` |

---

*本規格書版本 v1.0.0，如有功能變更請同步更新文件。*
