# 🏓 Pong 遊戲規格書

**版本：** 1.0.0  
**建立日期：** 2026-06-09  
**類型：** 純前端單頁遊戲（Player vs AI）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術規格](#2-技術規格)
3. [專案結構](#3-專案結構)
4. [畫面規格](#4-畫面規格)
5. [遊戲機制](#5-遊戲機制)
6. [AI 難度設計](#6-ai-難度設計)
7. [音樂與音效系統](#7-音樂與音效系統)
8. [RWD 響應式設計](#8-rwd-響應式設計)
9. [配色主題系統](#9-配色主題系統)
10. [字體規範](#10-字體規範)
11. [設定系統](#11-設定系統)
12. [存檔與繼續遊戲](#12-存檔與繼續遊戲)
13. [各畫面元素細節](#13-各畫面元素細節)

---

## 1. 專案概述

### 1.1 遊戲簡介

以經典 Pong 乒乓球為基礎打造的現代化瀏覽器遊戲。玩家以方向鍵或觸控滑動操作己方球拍，對抗不同難度的 AI 對手，率先達到目標分數者獲勝。

### 1.2 核心目標

| 目標 | 說明 |
|------|------|
| 零依賴部署 | 直接開啟 `index.html` 即可遊玩，無需任何 build 工具或 server |
| 跨裝置支援 | 桌機、平板、手機均可流暢遊玩 |
| 豐富感官體驗 | 多樣化音效與背景音樂、炫麗配色主題 |
| 清晰易讀 | 大字體、高對比，一目了然 |

---

## 2. 技術規格

### 2.1 核心技術

| 項目 | 規格 |
|------|------|
| 渲染引擎 | HTML5 Canvas API |
| 語言 | 純 HTML5 / CSS3 / Vanilla JavaScript（ES6+） |
| 音效系統 | Web Audio API（合成音效，不依賴外部音檔） |
| 儲存機制 | `localStorage`（存放設定與遊戲進度） |
| 字型載入 | Google Fonts CDN（`@import` in CSS） |
| 外部依賴 | **無**（所有資源皆為本地或 CDN，CDN 不影響離線遊玩能力） |

> **注意：** 所有音效皆使用 Web Audio API 動態合成，不依賴外部音檔，確保離線或直接開啟 `index.html` 時音效完整運作。

### 2.2 瀏覽器支援

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Android Chrome 80+

### 2.3 效能目標

- 遊戲主迴圈維持 **60 FPS**（`requestAnimationFrame`）
- 首次載入時間 **< 1 秒**（無外部資源下載）
- Canvas 尺寸自適應，不超過裝置可視區域

---

## 3. 專案結構

```
pong/
├── index.html                  # 主入口，僅負責 HTML 骨架與資源引入
│
├── css/
│   ├── reset.css               # CSS Reset / Normalize
│   ├── variables.css           # CSS 自訂屬性（顏色、字體、尺寸等全域變數）
│   ├── typography.css          # 字體載入、字體大小、行高規範
│   ├── layout.css              # 頁面佈局、Flexbox/Grid 結構
│   ├── components.css          # 通用 UI 元件（按鈕、面板、彈窗）
│   ├── screens.css             # 各畫面專屬樣式（主選單、遊戲、結算等）
│   ├── themes.css              # 配色主題（data-theme attribute 切換）
│   ├── animations.css          # CSS 動畫與過場效果
│   └── responsive.css          # RWD Media Queries
│
├── js/
│   ├── core/
│   │   ├── game.js             # 遊戲主迴圈、狀態管理、入口點
│   │   ├── canvas.js           # Canvas 初始化、縮放、清除工具
│   │   └── state.js            # 全域遊戲狀態物件（GameState）
│   │
│   ├── entities/
│   │   ├── ball.js             # 球的物理、碰撞、渲染
│   │   ├── paddle.js           # 球拍基礎類別（移動、渲染、碰撞）
│   │   ├── player.js           # 玩家球拍（鍵盤 + 觸控輸入）
│   │   └── ai.js               # AI 球拍（三種難度邏輯）
│   │
│   ├── screens/
│   │   ├── screenManager.js    # 畫面切換管理器（淡入淡出）
│   │   ├── mainMenu.js         # 主選單畫面
│   │   ├── gameScreen.js       # 遊戲進行畫面
│   │   ├── pauseMenu.js        # 暫停選單
│   │   ├── resultScreen.js     # 勝負結算畫面
│   │   ├── settingsScreen.js   # 設定畫面
│   │   └── helpScreen.js       # 說明畫面
│   │
│   ├── systems/
│   │   ├── audio.js            # 音效合成、音樂管理、音量控制
│   │   ├── input.js            # 鍵盤、滑鼠、觸控統一輸入管理
│   │   ├── storage.js          # localStorage 存取封裝
│   │   ├── score.js            # 分數計算、勝負判斷
│   │   └── effects.js          # 粒子特效、閃光、震動效果
│   │
│   └── utils/
│       ├── math.js             # 向量運算、碰撞偵測數學工具
│       ├── dom.js              # DOM 操作輔助函式
│       └── constants.js        # 全域常數（遊戲參數、難度設定值）
│
└── assets/
    └── favicon.ico             # (選用) 網站圖示
```

### 3.1 index.html 引入方式

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="neon">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>🏓 Pong</title>

  <!-- CSS 引入順序 -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/typography.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/screens.css">
  <link rel="stylesheet" href="css/themes.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- 畫面容器由 JS 動態渲染 -->
  <div id="app"></div>

  <!-- JS 引入順序（type="module" 確保 ES6 模組支援） -->
  <script src="js/utils/constants.js"></script>
  <script src="js/utils/math.js"></script>
  <script src="js/utils/dom.js"></script>
  <script src="js/core/state.js"></script>
  <script src="js/core/canvas.js"></script>
  <script src="js/systems/storage.js"></script>
  <script src="js/systems/audio.js"></script>
  <script src="js/systems/input.js"></script>
  <script src="js/systems/score.js"></script>
  <script src="js/systems/effects.js"></script>
  <script src="js/entities/ball.js"></script>
  <script src="js/entities/paddle.js"></script>
  <script src="js/entities/player.js"></script>
  <script src="js/entities/ai.js"></script>
  <script src="js/screens/screenManager.js"></script>
  <script src="js/screens/mainMenu.js"></script>
  <script src="js/screens/gameScreen.js"></script>
  <script src="js/screens/pauseMenu.js"></script>
  <script src="js/screens/resultScreen.js"></script>
  <script src="js/screens/settingsScreen.js"></script>
  <script src="js/screens/helpScreen.js"></script>
  <script src="js/core/game.js"></script>
</body>
</html>
```

---

## 4. 畫面規格

### 4.1 畫面列表與流程

```
┌─────────────────┐
│    主選單        │ ←─ 遊戲啟動時顯示
│  (mainMenu)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
  開始遊戲   繼續遊戲    說明       設定
    │         │        (helpScreen) (settingsScreen)
    │    (讀取存檔)          │          │
    ▼         │          └──────┬───┘
  難度選擇    │                 ▼
  (modal)    │           返回主選單
    │         │
    └────┬────┘
         ▼
    ┌─────────────────┐
    │   遊戲進行中     │
    │  (gameScreen)   │
    └────────┬────────┘
             │ [ESC / 觸控暫停按鈕]
             ▼
    ┌─────────────────┐
    │    暫停選單      │ ── 繼續 ──► 遊戲進行中
    │  (pauseMenu)    │ ── 重新開始 ─► 遊戲進行中
    └────────┬────────┘ ── 主選單 ──► 主選單
             │ (達到勝利分數)
             ▼
    ┌─────────────────┐
    │    結算畫面      │ ── 再來一局 ─► 遊戲進行中
    │ (resultScreen)  │ ── 主選單 ──► 主選單
    └─────────────────┘
```

### 4.2 各畫面尺寸

| 畫面 | 類型 | 說明 |
|------|------|------|
| 主選單 | HTML DOM | 全螢幕覆蓋，CSS Flexbox 垂直置中 |
| 遊戲畫面 | Canvas + DOM overlay | Canvas 負責遊戲渲染，DOM overlay 顯示分數、暫停鈕 |
| 暫停選單 | HTML DOM | 半透明遮罩覆蓋 Canvas |
| 結算畫面 | HTML DOM | 覆蓋 Canvas，帶動畫 |
| 設定畫面 | HTML DOM | 全螢幕或 Modal |
| 說明畫面 | HTML DOM | 全螢幕，可捲動 |

---

## 5. 遊戲機制

### 5.1 基本規則

- 場地：矩形，有上下實體牆壁，左右為得分區
- 目標分數：可設定（預設 7 分），率先達到者獲勝
- 發球：每次得分後，球從場地中央發出，方向隨機偏向得分方

### 5.2 球（Ball）規格

| 屬性 | 預設值 | 說明 |
|------|--------|------|
| 半徑 | `8px`（相對 Canvas） | 隨 Canvas 縮放 |
| 初始速度 | `5 units/frame` | 60fps 基準 |
| 最大速度 | `15 units/frame` | 防止穿透 |
| 速度增幅 | 每次擊球 `+0.3` | 對局緊張感遞增 |
| 反彈角度 | 由擊球位置決定（球拍中央 = 水平，邊緣 = 最大 45°） | 角度控制策略 |

### 5.3 球拍（Paddle）規格

| 屬性 | 玩家 | AI |
|------|------|----|
| 寬度 | `14px` | `14px` |
| 高度 | `80px`（Canvas 高度 15%） | 同左 |
| 移動速度 | `7 units/frame` | 依難度變化 |
| 位置 | 左側，距邊 `20px` | 右側，距邊 `20px` |

### 5.4 碰撞系統

1. **球拍碰撞**：AABB 矩形碰撞偵測，依擊球位置計算反彈角度
2. **上下牆壁**：Y 軸速度取反，觸發牆壁音效
3. **左右穿越**：觸發得分，重置球位置，播放得分音效
4. **角落修正**：球卡角時強制推出，避免無限反彈

### 5.5 分數系統（`score.js`）

```
勝利條件：先達到設定分數（預設 7 分）
分數顯示：兩側各自顯示，大字體置頂
得分動畫：分數跳動 + 閃光特效
```

---

## 6. AI 難度設計

### 6.1 難度對照表

| 難度 | 移動速度 | 預測誤差範圍 | 反應延遲 | 追蹤頻率 |
|------|----------|-------------|----------|----------|
| 簡單 | `3.5` | `±60px` | `200ms` | 50% |
| 普通 | `5.5` | `±25px` | `100ms` | 75% |
| 困難 | `8.0` | `±5px` | `16ms` | 98% |

### 6.2 AI 行為邏輯（`ai.js`）

```
每幀執行：
1. 根據追蹤頻率決定是否更新目標 Y 座標
2. 計算球的預測落點（考慮反彈）
3. 在預測落點加入隨機誤差（難度越高誤差越小）
4. 若球往遠端移動，AI 緩慢回到中央（idle 行為）
5. 移動速度不超過設定上限（難度限制）
```

### 6.3 困難模式特殊行為

- 能預測球反彈後的落點（多次反彈預測）
- 偶爾（5% 機率）刻意失誤，避免完全無法打敗
- 速度上限略低於最大球速，確保玩家有機會得分

---

## 7. 音樂與音效系統

> 所有音效皆使用 **Web Audio API 動態合成**，不依賴外部音頻檔案。

### 7.1 背景音樂列表

| 編號 | 名稱 | 場景 | 風格 | 循環 |
|------|------|------|------|------|
| BGM-01 | `menu_theme` | 主選單、設定、說明 | 輕鬆電子合成 | ✅ |
| BGM-02 | `game_easy` | 簡單難度對局 | 輕快 8-bit | ✅ |
| BGM-03 | `game_normal` | 普通難度對局 | 中等節奏電子 | ✅ |
| BGM-04 | `game_hard` | 困難難度對局 | 緊張高能量 | ✅ |
| BGM-05 | `result_win` | 勝利結算 | 勝利進行曲 | ❌ 一次 |
| BGM-06 | `result_lose` | 失敗結算 | 低沉結束音 | ❌ 一次 |

**音樂切換規則：**

```
主選單 ─── BGM-01 持續播放
    │
    ├── 進入設定 ─── BGM-01 繼續（不中斷）
    ├── 進入說明 ─── BGM-01 繼續（不中斷）
    └── 開始遊戲 ─── 淡出 BGM-01 → 淡入對應難度 BGM
                          │
                          ├── 暫停 ─── BGM 淡出至 30% 音量（不停止）
                          └── 勝負 ─── 淡出對局 BGM → 播放 BGM-05/06
                                           └── 結束後 → 淡入 BGM-01
```

### 7.2 音效列表（SFX）

| 編號 | 名稱 | 觸發時機 | 音色描述 | 合成方式 |
|------|------|----------|----------|----------|
| SFX-01 | `paddle_hit` | 球擊中玩家球拍 | 清脆短促「啪」聲 | Square wave, 短 Attack |
| SFX-02 | `ai_hit` | 球擊中 AI 球拍 | 稍低沉「噗」聲 | Triangle wave |
| SFX-03 | `wall_bounce` | 球碰上下牆壁 | 高頻短「叮」 | Sine wave + 衰減 |
| SFX-04 | `player_score` | 玩家得分 | 上揚三連音 | Arpeggio 合成 |
| SFX-05 | `ai_score` | AI 得分 | 下降兩音 | 低頻下降 |
| SFX-06 | `game_start` | 遊戲開始倒數結束 | 起跑哨聲 | Sawtooth + LFO |
| SFX-07 | `game_win` | 玩家勝利 | 歡呼音效序列 | 和弦上揚 |
| SFX-08 | `game_lose` | 玩家落敗 | 下降失落音 | 低頻掃頻 |
| SFX-09 | `button_hover` | 滑鼠懸停按鈕 | 細微「嗶」 | Short beep |
| SFX-10 | `button_click` | 點擊按鈕 | 中頻「喀」聲 | Click wave |
| SFX-11 | `menu_open` | 開啟說明/設定 | 上滑過場音 | Sweep up |
| SFX-12 | `menu_close` | 關閉說明/設定 | 下滑過場音 | Sweep down |
| SFX-13 | `countdown` | 3、2、1 倒數 | 節拍器「滴」 | Short sine |
| SFX-14 | `hard_speed_up` | 困難模式球加速 | 急促嗡聲 | Noise burst |
| SFX-15 | `match_point` | 任一方達到賽末點 | 警示音 | Pulsing tone |
| SFX-16 | `paddle_edge_hit` | 球擊中球拍邊緣 | 扭曲短音 | Distorted sine |

### 7.3 音量控制

| 類型 | 預設音量 | 可調範圍 |
|------|----------|----------|
| 背景音樂 | 60% | 0% ~ 100% |
| 音效 | 80% | 0% ~ 100% |

- 音量設定存入 `localStorage`，下次開啟保留
- 提供「靜音」快捷切換（鍵盤 `M` 鍵）

---

## 8. RWD 響應式設計

### 8.1 斷點定義（`responsive.css`）

| 名稱 | 寬度範圍 | 代表裝置 |
|------|----------|----------|
| `mobile-sm` | `< 480px` | 小螢幕手機 |
| `mobile` | `480px ~ 767px` | 標準手機 |
| `tablet` | `768px ~ 1023px` | 平板 |
| `desktop` | `1024px ~ 1439px` | 桌機 |
| `desktop-lg` | `≥ 1440px` | 大螢幕 |

### 8.2 Canvas 縮放策略

```javascript
// canvas.js 核心邏輯
function resizeCanvas() {
  const GAME_RATIO = 16 / 9; // 遊戲場地固定比例
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;

  let width, height;

  if (maxW / maxH > GAME_RATIO) {
    // 以高度為基準
    height = maxH * 0.95;
    width  = height * GAME_RATIO;
  } else {
    // 以寬度為基準
    width  = maxW * 0.98;
    height = width / GAME_RATIO;
  }

  canvas.width  = width;
  canvas.height = height;
  canvas.style.width  = width + 'px';
  canvas.style.height = height + 'px';

  // 所有遊戲物件座標按比例重新計算
  GameState.scaleFactor = width / REFERENCE_WIDTH; // REFERENCE_WIDTH = 800
}
```

### 8.3 行動裝置操控

| 操控方式 | 行為 |
|----------|------|
| 觸控上滑（Canvas 左半） | 玩家球拍上移 |
| 觸控下滑（Canvas 左半） | 玩家球拍下移 |
| 觸控 Canvas 右半 | 無操作（AI 區域） |
| 點擊畫面中央暫停按鈕 | 暫停 |
| 觸控方向箭頭 UI 按鈕 | 上下移動（小螢幕替代方案） |

**行動裝置專屬 UI：**
- 畫面左側顯示半透明上下箭頭虛擬按鍵
- 箭頭大小：`60x60px`，高透明度避免遮擋視線
- 暫停按鈕固定於畫面右上角，尺寸 `48x48px`

### 8.4 觸控防誤觸

```css
/* 防止觸控時頁面滾動 */
canvas { touch-action: none; }
body   { overscroll-behavior: none; overflow: hidden; }
```

---

## 9. 配色主題系統

> 在 `<html data-theme="...">` 切換主題，所有顏色使用 CSS 變數。

### 9.1 主題列表

| 主題 ID | 名稱 | 主色 | 副色 | 背景 | 風格 |
|---------|------|------|------|------|------|
| `neon` | 霓虹 | `#00FFAA` | `#FF00FF` | `#0A0A1A` | 賽博朋克夜光 |
| `classic` | 經典 | `#FFFFFF` | `#FFFFFF` | `#000000` | 原版 Atari 復古 |
| `ocean` | 海洋 | `#00BFFF` | `#7FFFD4` | `#001428` | 深海藍調 |
| `fire` | 火焰 | `#FF6B00` | `#FFD700` | `#1A0500` | 熔岩烈焰 |
| `forest` | 森林 | `#00E676` | `#69F0AE` | `#0A1F0A` | 自然翠綠 |
| `candy` | 糖果 | `#FF4081` | `#E040FB` | `#FFF0F5` | 粉嫩馬卡龍 |
| `ice` | 冰川 | `#B0E0FF` | `#FFFFFF` | `#0D1B2A` | 極地冰藍 |
| `galaxy` | 星河 | `#C77DFF` | `#E0AAFF` | `#03001C` | 深紫宇宙 |

### 9.2 CSS 變數結構（`variables.css`）

```css
:root {
  /* 以下由 themes.css 覆蓋 */
  --color-primary:      #00FFAA;
  --color-secondary:    #FF00FF;
  --color-bg:           #0A0A1A;
  --color-bg-panel:     rgba(255,255,255,0.07);
  --color-text:         #FFFFFF;
  --color-text-muted:   rgba(255,255,255,0.55);
  --color-accent:       #FFD700;
  --color-ball:         var(--color-primary);
  --color-paddle-player: var(--color-primary);
  --color-paddle-ai:    var(--color-secondary);
  --color-center-line:  rgba(255,255,255,0.2);
  --glow-primary:       0 0 15px var(--color-primary);
  --glow-secondary:     0 0 15px var(--color-secondary);
}
```

### 9.3 主題切換動畫

- 切換主題時，整個畫面觸發 `transition: background-color 0.4s, color 0.4s`
- Canvas 內容重新繪製以反映新主題色
- 播放 `button_click` 音效 + 短暫閃光特效

---

## 10. 字體規範

### 10.1 字體選用

| 用途 | 字體 | 備用 |
|------|------|------|
| 遊戲標題 | `'Orbitron'`（Google Fonts） | `monospace` |
| 分數顯示 | `'Orbitron'` | `monospace` |
| 按鈕文字 | `'Exo 2'`（Google Fonts） | `sans-serif` |
| 說明內文 | `'Exo 2'` | `sans-serif` |
| 倒數數字 | `'Orbitron'` | `monospace` |

### 10.2 字體大小規範

| 元素 | 桌機 | 平板 | 手機 |
|------|------|------|------|
| 遊戲主標題 | `72px` | `56px` | `40px` |
| 分數顯示 | `64px` | `48px` | `36px` |
| 主選單按鈕 | `28px` | `24px` | `20px` |
| 倒數數字 | `120px` | `96px` | `72px` |
| 說明內文 | `18px` | `17px` | `16px` |
| 設定標籤 | `20px` | `18px` | `16px` |
| 副標題 | `32px` | `26px` | `22px` |

> **最小字體下限：** 任何 UI 文字不得小於 `14px`。

### 10.3 字重規範

| 用途 | 字重 |
|------|------|
| 標題 | `700 / Bold` |
| 分數 | `900 / Black` |
| 按鈕 | `600 / SemiBold` |
| 內文 | `400 / Regular` |
| 標籤 | `500 / Medium` |

---

## 11. 設定系統

### 11.1 設定項目

| 設定 | 類型 | 選項 / 範圍 | 預設 |
|------|------|-------------|------|
| 目標分數 | 選擇 | 5 / 7 / 11 / 15 | 7 |
| 配色主題 | 色票選擇器 | 8 種主題 | `neon` |
| 背景音樂音量 | 滑桿 | 0 ~ 100% | 60% |
| 音效音量 | 滑桿 | 0 ~ 100% | 80% |
| 球速 | 選擇 | 慢 / 正常 / 快 | 正常 |
| 顯示 FPS | 開關 | 開 / 關 | 關 |
| 震動回饋 | 開關（手機） | 開 / 關 | 開 |

### 11.2 設定儲存格式（`localStorage` key: `pong_settings`）

```json
{
  "targetScore": 7,
  "theme": "neon",
  "musicVolume": 0.6,
  "sfxVolume": 0.8,
  "ballSpeed": "normal",
  "showFPS": false,
  "vibration": true
}
```

---

## 12. 存檔與繼續遊戲

### 12.1 自動存檔觸發時機

- 每次得分時自動存檔
- 暫停選單點擊「主選單」時自動存檔
- 瀏覽器頁面失去焦點（`visibilitychange`）時自動存檔

### 12.2 存檔資料格式（`localStorage` key: `pong_save`）

```json
{
  "version": "1.0",
  "timestamp": 1717900000000,
  "difficulty": "normal",
  "playerScore": 3,
  "aiScore": 2,
  "targetScore": 7,
  "ballState": {
    "x": 400, "y": 200, "vx": 4.5, "vy": -3.2
  },
  "paddlePlayer": { "y": 160 },
  "paddleAI":     { "y": 200 }
}
```

### 12.3 繼續遊戲邏輯

- 主選單讀取 `pong_save`，若存在且版本相符則亮起「繼續遊戲」按鈕
- 進入遊戲時顯示 **3 秒倒數** 後才恢復進行
- 勝負結算後自動清除存檔

---

## 13. 各畫面元素細節

### 13.1 主選單（mainMenu.js）

```
┌──────────────────────────────────────┐
│                                      │
│           🏓  PONG                   │  ← 標題，Orbitron 72px，發光效果
│                                      │
│         ┌──────────────┐             │
│         │  🎮 開始遊戲  │             │  ← 點擊 → 難度選擇 Modal
│         ├──────────────┤             │
│         │  ⏩ 繼續遊戲  │             │  ← 無存檔時灰色禁用
│         ├──────────────┤             │
│         │  📖  說   明  │             │  ← 滑入說明畫面
│         ├──────────────┤             │
│         │  ⚙️  設   定  │             │  ← 滑入設定畫面
│         └──────────────┘             │
│                                      │
│  ● ○ ○ ○ ○ ○ ○ ○  [主題切換指示點]  │  ← 快速切換配色
└──────────────────────────────────────┘
```

**難度選擇 Modal：**

```
┌─────────────────────────┐
│      選擇難度            │
│                         │
│  ┌───────┐ ┌───────┐    │
│  │  😊   │ │  😐   │    │
│  │ 簡單  │ │ 普通  │    │
│  └───────┘ └───────┘    │
│       ┌───────┐          │
│       │  😈   │          │
│       │ 困難  │          │
│       └───────┘          │
│                         │
│         [取消]           │
└─────────────────────────┘
```

### 13.2 遊戲進行畫面（gameScreen.js）

```
┌──────────────────────────────────────┐
│  玩家: 3         ║         AI: 2      │  ← DOM overlay，Orbitron 64px
├──────────────────╫───────────────────┤
│ |                ║                 | │  ← Canvas 渲染區域
│ |                ║      ●          | │     中央虛線、球、雙方球拍
│ |                ║                 | │
│ |                ║                 | │
│                  ║                   │
├──────────────────────────────────────┤
│ [⏸]             NORMAL              │  ← 暫停鈕、難度標示
└──────────────────────────────────────┘
```

**行動裝置額外 UI：**
- 左側：半透明 `▲ ▼` 虛擬按鍵
- 右上：`⏸` 暫停按鈕（48x48px）

### 13.3 暫停選單（pauseMenu.js）

```
暗色半透明遮罩 + 居中卡片：
┌──────────────┐
│   ⏸ 暫停中   │
│              │
│ [▶ 繼續遊戲] │
│ [🔄 重新開始] │
│ [🏠 主選單]  │
└──────────────┘
```

### 13.4 結算畫面（resultScreen.js）

```
勝利：
  🎉 大字閃爍動畫「YOU WIN!」
  分數顯示：玩家 7 - AI 4
  [再來一局]  [主選單]

失敗：
  😢「GAME OVER」
  分數顯示：玩家 3 - AI 7
  [再來一局]  [主選單]
```

### 13.5 說明畫面（helpScreen.js）

| 區塊 | 內容 |
|------|------|
| 操控說明 | 鍵盤：`↑ ↓` 或 `W S`；行動：虛擬按鍵或滑動 |
| 遊戲規則 | 率先達到目標分數者獲勝 |
| 難度說明 | 三種難度的 AI 行為差異 |
| 快捷鍵 | `ESC` 暫停、`M` 靜音、`R` 重新開始（遊戲中） |

### 13.6 設定畫面（settingsScreen.js）

- 分為「遊戲設定」「音效設定」「視覺設定」三個分頁（Tab）
- 所有變更即時生效並預覽
- 底部有「重設預設值」按鈕

---

## 附錄 A：常數參考（`constants.js`）

```javascript
const CONSTANTS = {
  // 場地
  REFERENCE_WIDTH:  800,
  REFERENCE_HEIGHT: 450,
  GAME_RATIO: 16 / 9,

  // 球
  BALL_RADIUS:        8,
  BALL_INIT_SPEED:    5,
  BALL_MAX_SPEED:     15,
  BALL_SPEED_INCREMENT: 0.3,

  // 球拍
  PADDLE_WIDTH:       14,
  PADDLE_HEIGHT_RATIO: 0.16,  // 場地高度的 16%
  PADDLE_OFFSET:      20,
  PLAYER_SPEED:       7,

  // AI 難度
  AI: {
    easy:   { speed: 3.5, errorRange: 60, reactionDelay: 200, trackRate: 0.50 },
    normal: { speed: 5.5, errorRange: 25, reactionDelay: 100, trackRate: 0.75 },
    hard:   { speed: 8.0, errorRange: 5,  reactionDelay: 16,  trackRate: 0.98 },
  },

  // 目標分數選項
  TARGET_SCORES: [5, 7, 11, 15],
  DEFAULT_TARGET_SCORE: 7,

  // 音量
  DEFAULT_MUSIC_VOLUME: 0.6,
  DEFAULT_SFX_VOLUME:   0.8,

  // 動畫
  SCREEN_FADE_DURATION:  400,  // ms
  COUNTDOWN_DURATION:   3000,  // ms
  SCORE_FLASH_DURATION:  600,  // ms
};
```

---

## 附錄 B：開發優先順序

| 階段 | 任務 | 優先度 |
|------|------|--------|
| P0 | Canvas 渲染、球物理、球拍移動、計分、勝負判斷 | 必須 |
| P0 | 主選單、遊戲畫面、結算畫面基本 HTML | 必須 |
| P1 | AI 三難度邏輯、RWD 縮放 | 高 |
| P1 | Web Audio 音效系統（至少 8 種） | 高 |
| P2 | 配色主題切換、設定存檔、繼續遊戲 | 中 |
| P2 | 粒子特效、發光效果、過場動畫 | 中 |
| P3 | 行動裝置虛擬按鍵、震動回饋 | 低 |
| P3 | FPS 顯示、額外音效（補齊 16 種） | 低 |

---

*規格書版本 1.0.0 ── 如需修改請更新版本號與日期*
