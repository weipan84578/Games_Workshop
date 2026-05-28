# 🟡 Pac-Man 遊戲規格書

> **版本**：v1.0.0　｜　**最後更新**：2026-05-28　｜　**類型**：純前端靜態遊戲

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術限制與要求](#2-技術限制與要求)
3. [專案目錄結構](#3-專案目錄結構)
4. [RWD 響應式設計規格](#4-rwd-響應式設計規格)
5. [字體與配色規格](#5-字體與配色規格)
6. [畫面與功能規格](#6-畫面與功能規格)
7. [遊戲核心機制](#7-遊戲核心機制)
8. [音樂與音效規格](#8-音樂與音效規格)
9. [CSS 模組規劃](#9-css-模組規劃)
10. [JavaScript 模組規劃](#10-javascript-模組規劃)
11. [資源檔案規劃](#11-資源檔案規劃)
12. [各畫面音樂銜接邏輯](#12-各畫面音樂銜接邏輯)
13. [行動裝置操控規格](#13-行動裝置操控規格)
14. [儲存與狀態規格](#14-儲存與狀態規格)
15. [開發優先順序](#15-開發優先順序)

---

## 1. 專案概述

本專案為瀏覽器原生 Pac-Man（小精靈）遊戲，**零依賴、零建置、單一入口**。玩家直接雙擊 `index.html` 即可在任何現代瀏覽器遊玩，同時支援桌機鍵盤操作與行動裝置觸控/虛擬方向鍵操作。

### 目標玩家體驗

- 📱 行動裝置：全螢幕沉浸，觸控虛擬搖桿，響應流暢
- 🖥️ 桌面瀏覽器：鍵盤方向鍵/WASD 控制，視窗自適應
- 🎮 遊戲感：豐富音效、多樣配色主題、生動動畫

---

## 2. 技術限制與要求

| 項目 | 規格 |
|------|------|
| **語言** | 純 HTML5 + CSS3 + Vanilla JavaScript（ES6+） |
| **建置工具** | 無，不需要任何 bundler / compiler |
| **依賴套件** | 無外部 JavaScript 函式庫 |
| **字型** | Google Fonts CDN（允許，屬靜態資源引入） |
| **音效** | Web Audio API（程式產生）+ 預錄 `.ogg`/`.mp3` 雙格式備援 |
| **儲存** | `localStorage`（存分數、設定、進度） |
| **繪圖** | HTML5 Canvas 2D API |
| **開啟方式** | 直接點擊 `index.html`（`file://` 協議可正常運作） |
| **瀏覽器支援** | Chrome 90+、Firefox 88+、Safari 14+、Edge 90+ |

---

## 3. 專案目錄結構

```
pacman/
├── index.html                  # 唯一入口，引入所有 CSS / JS
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（顏色、字體、間距變數）
│   │   └── typography.css      # 全站字體規則
│   ├── layout/
│   │   ├── grid.css            # 全域排版骨架
│   │   └── responsive.css      # Media Query / RWD 斷點
│   ├── screens/
│   │   ├── main-menu.css       # 主選單畫面
│   │   ├── game.css            # 遊戲畫面（Canvas 容器、HUD）
│   │   ├── settings.css        # 設定畫面
│   │   ├── instructions.css    # 說明畫面
│   │   └── game-over.css       # 遊戲結束畫面
│   ├── components/
│   │   ├── buttons.css         # 按鈕元件
│   │   ├── modal.css           # 彈窗元件
│   │   ├── hud.css             # 遊戲 HUD（分數、生命、關卡）
│   │   ├── mobile-controls.css # 行動裝置虛擬搖桿
│   │   └── theme-switcher.css  # 主題切換器
│   └── animations/
│       ├── transitions.css     # 畫面切換動畫
│       ├── effects.css         # 特效（閃爍、脈動、粒子）
│       └── ghost.css           # 鬼魂動畫（純 CSS 輔助）
│
├── js/
│   ├── core/
│   │   ├── Game.js             # 遊戲主類別（狀態機、主迴圈）
│   │   ├── GameLoop.js         # requestAnimationFrame 迴圈管理
│   │   └── EventBus.js         # 全域事件發布/訂閱系統
│   ├── entities/
│   │   ├── Pacman.js           # Pac-Man 角色類別
│   │   ├── Ghost.js            # 鬼魂基礎類別
│   │   ├── Blinky.js           # 紅鬼 – 追蹤模式
│   │   ├── Pinky.js            # 粉鬼 – 伏擊模式
│   │   ├── Inky.js             # 藍鬼 – 協同模式
│   │   └── Clyde.js            # 橘鬼 – 隨機模式
│   ├── map/
│   │   ├── Maze.js             # 迷宮地圖繪製與碰撞
│   │   ├── MazeData.js         # 地圖資料（多關卡地圖陣列）
│   │   └── Tile.js             # 格子類別（牆、豆、能量豆、通道）
│   ├── systems/
│   │   ├── CollisionSystem.js  # 碰撞偵測系統
│   │   ├── ScoreSystem.js      # 計分系統（連鎖加乘、高分榜）
│   │   ├── AISystem.js         # 鬼魂 AI 統一調度
│   │   └── PowerUpSystem.js    # 能量豆效果管理
│   ├── audio/
│   │   ├── AudioManager.js     # 音效/音樂統一管理（淡入淡出、切換）
│   │   ├── SoundEffects.js     # Web Audio API 音效合成器
│   │   └── MusicPlayer.js      # BGM 播放控制（持續播放邏輯）
│   ├── ui/
│   │   ├── ScreenManager.js    # 畫面切換管理器
│   │   ├── MainMenu.js         # 主選單 UI 邏輯
│   │   ├── GameHUD.js          # 遊戲中 HUD 渲染
│   │   ├── Settings.js         # 設定頁面邏輯
│   │   ├── Instructions.js     # 說明頁面邏輯
│   │   └── ThemeManager.js     # 配色主題切換
│   ├── input/
│   │   ├── KeyboardInput.js    # 鍵盤輸入處理
│   │   └── TouchInput.js       # 觸控/滑動輸入處理
│   ├── storage/
│   │   └── SaveManager.js      # localStorage 讀寫封裝
│   └── main.js                 # 應用程式入口，初始化並組裝所有模組
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── menu-theme.ogg / .mp3
│   │   │   ├── game-theme-1.ogg / .mp3
│   │   │   ├── game-theme-2.ogg / .mp3   # 高關卡加速版本
│   │   │   └── game-over-theme.ogg / .mp3
│   │   └── sfx/
│   │       ├── chomp.ogg / .mp3          # 吃豆音效（循環）
│   │       ├── power-up.ogg / .mp3       # 吃能量豆
│   │       ├── ghost-eat.ogg / .mp3      # 吃鬼音效
│   │       ├── death.ogg / .mp3          # Pac-Man 死亡
│   │       ├── extra-life.ogg / .mp3     # 獲得額外生命
│   │       ├── level-up.ogg / .mp3       # 過關
│   │       ├── intro.ogg / .mp3          # 開場 jingle
│   │       ├── ghost-scared.ogg / .mp3   # 鬼魂逃跑音效
│   │       ├── ghost-return.ogg / .mp3   # 鬼魂返回巢穴
│   │       └── button-click.ogg / .mp3   # UI 按鈕點擊
│   ├── fonts/                            # 備用本地字體（若 CDN 不可用）
│   └── sprites/                          # 備用 Sprite（Canvas 繪製為主）
│
└── README.md
```

---

## 4. RWD 響應式設計規格

### 斷點定義（定義於 `css/layout/responsive.css`）

| 斷點名稱 | 範圍 | 說明 |
|----------|------|------|
| `xs` | `< 480px` | 小型手機 |
| `sm` | `480px – 767px` | 一般手機橫屏 / 大手機 |
| `md` | `768px – 1023px` | 平板 |
| `lg` | `1024px – 1439px` | 桌機 |
| `xl` | `≥ 1440px` | 大螢幕 |

### Canvas 自適應規則

```
遊戲畫布尺寸 = min(可用寬度 × 0.95, 可用高度 × 0.80, 560px)
迷宮格子大小 = Math.floor(畫布尺寸 / 28)   // 28 格寬
```

- 畫布永遠等比縮放，不拉伸變形
- 行動裝置：畫布置頂，下方保留空間給虛擬搖桿（高度約 160px）
- 桌機：畫布置中，左右顯示分數面板
- 切換橫/直屏時自動重新計算並重繪

### HUD 自適應

| 元素 | 手機 | 桌機 |
|------|------|------|
| 分數 | 畫布上方橫排 | 左側面板 |
| 生命數 | 圖示縮小至 24px | 圖示 32px |
| 關卡 | 簡化為數字 | 完整圖示列 |
| 暫停按鈕 | 右上角懸浮 | 鍵盤 ESC |

---

## 5. 字體與配色規格

### 字體規格

```css
/* css/base/variables.css */
--font-display:  'Press Start 2P', monospace;   /* 遊戲標題、分數 */
--font-ui:       'Orbitron', sans-serif;        /* 選單、按鈕、說明 */
--font-body:     'Share Tech Mono', monospace;  /* 一般文字、說明內文 */

--text-xs:    14px;
--text-sm:    16px;
--text-base:  20px;   /* 最小正文大小 */
--text-lg:    24px;
--text-xl:    32px;
--text-2xl:   48px;
--text-3xl:   64px;   /* 大標題 */
```

> **原則**：全站最小字體 `16px`，正文建議 `20px` 以上，確保行動裝置可讀性。

### 配色主題

主題定義於 `css/base/variables.css`，透過 `data-theme` 屬性切換於 `<html>` 標籤。

#### 🟡 Classic（預設，Arcade 黃黑）
```css
[data-theme="classic"] {
  --color-bg:         #000000;
  --color-maze:       #1a1aff;
  --color-dot:        #ffb8ae;
  --color-pacman:     #ffff00;
  --color-blinky:     #ff0000;
  --color-pinky:      #ffb8ff;
  --color-inky:       #00ffff;
  --color-clyde:      #ffb851;
  --color-text:       #ffffff;
  --color-accent:     #ffff00;
  --color-ui-bg:      #000033;
}
```

#### 🌙 Neon Night（霓虹深夜）
```css
[data-theme="neon"] {
  --color-bg:         #0a0014;
  --color-maze:       #7b00d4;
  --color-dot:        #ff00ff;
  --color-pacman:     #00ff9f;
  --color-blinky:     #ff006e;
  --color-pinky:      #ff77ff;
  --color-inky:       #00d4ff;
  --color-clyde:      #ffaa00;
  --color-text:       #e0e0ff;
  --color-accent:     #00ff9f;
  --color-ui-bg:      #120025;
}
```

#### 🌊 Ocean Deep（深海藍綠）
```css
[data-theme="ocean"] {
  --color-bg:         #001428;
  --color-maze:       #005f8e;
  --color-dot:        #7fffd4;
  --color-pacman:     #ffd700;
  --color-blinky:     #ff4d4d;
  --color-pinky:      #ff99cc;
  --color-inky:       #40e0d0;
  --color-clyde:      #ff8c00;
  --color-text:       #cceeff;
  --color-accent:     #00ffe7;
  --color-ui-bg:      #00203f;
}
```

#### 🍬 Candy Pop（糖果粉彩）
```css
[data-theme="candy"] {
  --color-bg:         #1a0033;
  --color-maze:       #cc44aa;
  --color-dot:        #ffeecc;
  --color-pacman:     #ffe44d;
  --color-blinky:     #ff5555;
  --color-pinky:      #ff99dd;
  --color-inky:       #55ddff;
  --color-clyde:      #ffaa33;
  --color-text:       #fff0f8;
  --color-accent:     #ff66cc;
  --color-ui-bg:      #2d0044;
}
```

#### 🌲 Forest Dark（森林暗綠）
```css
[data-theme="forest"] {
  --color-bg:         #0d1a0d;
  --color-maze:       #2d5a27;
  --color-dot:        #a8e6a8;
  --color-pacman:     #f5e642;
  --color-blinky:     #cc3300;
  --color-pinky:      #ff99bb;
  --color-inky:       #55ffcc;
  --color-clyde:      #ff9933;
  --color-text:       #d4f5d4;
  --color-accent:     #66ff66;
  --color-ui-bg:      #0a120a;
}
```

#### ☀️ Retro Light（復古亮色）
```css
[data-theme="retro"] {
  --color-bg:         #f5e6c8;
  --color-maze:       #2255aa;
  --color-dot:        #996633;
  --color-pacman:     #ffcc00;
  --color-blinky:     #cc2200;
  --color-pinky:      #dd44aa;
  --color-inky:       #0088cc;
  --color-clyde:      #ff6600;
  --color-text:       #220033;
  --color-accent:     #cc0066;
  --color-ui-bg:      #e8d4a8;
}
```

---

## 6. 畫面與功能規格

### 畫面狀態機

```
         ┌──────────────┐
         │  LOADING     │  （資源預載 + 進場動畫）
         └──────┬───────┘
                │
         ┌──────▼───────┐
    ┌────│  MAIN MENU   │◄────────────┐
    │    └──────┬───────┘             │
    │           │                     │
    │    ┌──────▼───────┐             │
    │    │  選項分支    │             │
    │    └──┬──┬──┬──┬──┘             │
    │       │  │  │  │                │
    │  開始 │  │繼續│  │說明  │設定   │
    │       ▼  ▼   ▼  ▼               │
    │  ┌──────────────┐               │
    │  │  GAME INTRO  │  (開場 jingle)│
    │  └──────┬───────┘               │
    │         │                       │
    │  ┌──────▼───────┐               │
    │  │   PLAYING    │               │
    │  └──┬─────────┬─┘               │
    │     │         │                 │
    │  ┌──▼──┐  ┌───▼───┐            │
    │  │PAUSE│  │CLEARED│            │
    │  └──┬──┘  └───┬───┘            │
    │     │         │                 │
    │     └────►PLAYING               │
    │               │                 │
    │  ┌────────────▼──┐              │
    └──│  GAME OVER    │──────────────┘
       └───────────────┘
```

### 6.1 主選單（MAIN MENU）

**元素**：
- 大標題「PAC-MAN」（使用 `Press Start 2P` 字體，動態閃爍動畫）
- Pac-Man 走過畫面的動畫（Canvas 或純 CSS）
- 四顆主要按鈕

| 按鈕 | 功能 | 備註 |
|------|------|------|
| **開始遊戲** | 進入新遊戲（重置存檔） | 若有進行中存檔，彈出確認對話框 |
| **繼續遊戲** | 讀取 localStorage 存檔 | 無存檔時呈灰色不可點 |
| **說明** | 跳至說明畫面 | 音樂持續播放 |
| **設定** | 跳至設定畫面 | 音樂持續播放 |

- 右上角顯示最高分
- 右下角顯示版本號

### 6.2 說明畫面（INSTRUCTIONS）

**內容分區**：

1. **基本玩法**：吃掉所有豆子過關，碰到鬼魂失去一條命
2. **能量豆**：吃下後可反攻鬼魂（持續 8 秒）
3. **計分表**：
   - 普通豆：10 分
   - 能量豆：50 分
   - 吃第 1 隻鬼：200 分
   - 吃第 2 隻鬼：400 分
   - 吃第 3 隻鬼：800 分
   - 吃第 4 隻鬼：1600 分
4. **鬼魂介紹**：四色鬼魂行為說明（附小圖示）
5. **操控說明**：鍵盤 + 觸控兩種方式
6. **返回按鈕**

### 6.3 設定畫面（SETTINGS）

| 設定項目 | 類型 | 選項 |
|----------|------|------|
| **音樂音量** | 滑桿 0–100 | 預設 70 |
| **音效音量** | 滑桿 0–100 | 預設 90 |
| **配色主題** | 6 格色票選擇器 | Classic / Neon / Ocean / Candy / Forest / Retro |
| **難度** | 三段按鈕 | 簡單 / 一般 / 困難 |
| **BGM 持續播放** | 開關（Toggle） | 預設開啟 |
| **震動反饋** | 開關（Toggle） | 行動裝置限定，預設開啟 |
| **清除存檔** | 危險按鈕 | 需二次確認 |
| **返回** | 按鈕 | |

### 6.4 遊戲畫面（PLAYING）

**佈局（桌機）**：
```
┌────────────────────────────────────────────────────────┐
│  SCORE: 0000           LEVEL: 1          HIGH: 99990   │
├───────────────┬────────────────┬───────────────────────┤
│               │                │                       │
│  ♥ ♥ ♥        │   [ CANVAS ]   │  NEXT LEVEL PREVIEW   │
│  (生命)       │   28×31 格     │  目標豆數剩餘         │
│               │   迷宮         │                       │
└───────────────┴────────────────┴───────────────────────┘
```

**佈局（手機）**：
```
┌───────────────────────────────┐
│  ♥♥♥  SCORE: 000   LV: 1     │  ← HUD 橫排
├───────────────────────────────┤
│                               │
│        [ CANVAS ]             │  ← 最大化畫布
│        迷宮遊戲區             │
│                               │
├───────────────────────────────┤
│    ↑                          │
│  ← ●  →     ⏸  (暫停鍵)     │  ← 虛擬搖桿
│    ↓                          │
└───────────────────────────────┘
```

### 6.5 暫停選單（PAUSE）

- 半透明遮罩疊加於遊戲畫面上
- 選項：**繼續** / **重新開始** / **返回主選單** / **設定**
- 按 ESC 或點擊暫停鍵觸發

### 6.6 遊戲結束（GAME OVER）

- 大字「GAME OVER」動畫顯示
- 本局分數 / 最高分數（若破紀錄則特效慶祝）
- 統計資訊：吃掉豆數、擊敗鬼魂數、通過關卡數
- 按鈕：**再玩一次** / **主選單**

---

## 7. 遊戲核心機制

### 7.1 地圖

- 標準 28×31 格迷宮（忠實還原原版設計）
- MazeData.js 以二維整數陣列儲存，格子類型：
  - `0`：通道（空白）
  - `1`：牆壁
  - `2`：普通豆（Dot）
  - `3`：能量豆（Power Pellet）
  - `4`：鬼魂之家（Ghost House）
  - `5`：穿越通道（Warp Tunnel）
- 多關卡時可替換地圖陣列，保持格子尺寸動態計算

### 7.2 Pac-Man 移動

- 方向鍵輸入存入「緩衝佇列」（允許提前輸入）
- 在格子中心點允許轉向，碰牆停止
- 移動速度（格/秒）根據關卡增加：
  - 關卡 1–3：7.5 格/秒
  - 關卡 4–8：8.0 格/秒
  - 關卡 9+：8.5 格/秒

### 7.3 鬼魂 AI

| 鬼魂 | 顏色 | 模式 | 目標計算 |
|------|------|------|----------|
| Blinky | 🔴 紅 | 追蹤 | 直接以 Pac-Man 當前格為目標 |
| Pinky | 🩷 粉 | 伏擊 | Pac-Man 前方 4 格為目標 |
| Inky | 🩵 藍 | 協同 | 以 Pinky 目標與 Blinky 位置計算向量 |
| Clyde | 🟠 橘 | 隨機 | 距離近則退到角落，遠則追蹤 |

**鬼魂狀態**：
- `SCATTER`：各自在角落遊走（遊戲開始、切換關卡）
- `CHASE`：依 AI 策略追蹤（每關增長追蹤時間）
- `FRIGHTENED`：吃到能量豆後變藍，可被吃掉（8 秒）
- `EATEN`：被吃掉後只剩眼睛返回鬼巢

### 7.4 碰撞與計分

```
碰撞容許誤差 = 格子大小 × 0.4（像素級碰撞）

吃到豆子   → +10 分，播放 chomp 音效
吃到能量豆 → +50 分，觸發 FRIGHTENED 狀態
連殺鬼魂   → 200 → 400 → 800 → 1600（連鎖翻倍）
吃完全部豆 → 過關，播放 level-up 音效，下一關
碰到鬼魂   → 失去生命，播放 death 動畫與音效
生命歸零   → 遊戲結束
每 10,000 分 → 獲得額外一條命（播放 extra-life 音效）
```

---

## 8. 音樂與音效規格

### 8.1 BGM 清單

| 檔案 | 使用場景 | 備註 |
|------|----------|------|
| `menu-theme` | 主選單、說明、設定 | 輕鬆活潑，無限循環 |
| `game-theme-1` | 第 1–5 關 | 經典街機風，無限循環 |
| `game-theme-2` | 第 6+ 關 | 速度感加強版，無限循環 |
| `game-over-theme` | 遊戲結束畫面 | 播放一次，結束後靜音 |

### 8.2 音效清單（SFX）

| 音效 | 觸發時機 | 實作方式 |
|------|----------|----------|
| `intro` | 每局開始前（Pac-Man 開場 jingle） | 播放完畢再開始遊戲 |
| `chomp` | 每吃一顆豆子 | 短音，快速連發，兩種音調交替 |
| `power-up` | 吃到能量豆 | 上揚音階 |
| `ghost-scared` | 能量豆效果中，鬼魂持續循環音 | 低沉急促循環 |
| `ghost-eat` | 每次吃掉鬼魂 | 電子合成音 |
| `ghost-return` | 鬼魂眼睛返回巢穴 | 特殊音效 |
| `death` | Pac-Man 被抓 | 下降音階，播放死亡動畫期間 |
| `level-up` | 吃完所有豆子過關 | 歡呼音效 + 閃光動畫 |
| `extra-life` | 獲得額外生命 | 上揚 jingle |
| `button-click` | 所有 UI 按鈕點擊 | 短促點擊音 |

### 8.3 Web Audio API 合成（SoundEffects.js）

優先使用 Web Audio API 程式產生音效，確保 `file://` 協議下可用（避免 CORS 問題）。預錄檔案作為備援。

```javascript
// 示意：chomp 音效合成
createChomp(ctx) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.06);
}
```

---

## 9. CSS 模組規劃

### `css/base/variables.css`
- 全部 CSS 自訂屬性（顏色、字體、間距、動畫時長）
- 6 組 `[data-theme]` 配色定義

### `css/base/reset.css`
- Box-sizing、margin/padding 重置
- 防止行動裝置雙擊縮放（`touch-action: manipulation`）
- 隱藏 scrollbar

### `css/base/typography.css`
- Google Fonts `@import`
- `h1–h6`、`p`、`button`、`label` 的全域字體規則
- 確保最小字體 `16px`

### `css/layout/grid.css`
- 全站容器（`.app-container`）Flexbox 結構
- 畫面堆疊容器（`.screen-stack`）
- 遊戲佈局容器（`.game-layout`）

### `css/layout/responsive.css`
- 所有 Media Query 集中於此
- 斷點變數與 Canvas 縮放規則

### `css/screens/`
- 每個畫面獨立 CSS 檔案，只定義該畫面的元素

### `css/components/`
- 可複用元件（按鈕、Modal、HUD、搖桿）獨立管理

### `css/animations/`
- `transitions.css`：畫面進出動畫（fade、slide）
- `effects.css`：閃爍、脈動、震動特效
- `ghost.css`：純 CSS 鬼魂眼睛動畫

---

## 10. JavaScript 模組規劃

### `js/main.js`（入口）

```javascript
import { Game } from './core/Game.js';
import { ScreenManager } from './ui/ScreenManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { SaveManager } from './storage/SaveManager.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { KeyboardInput } from './input/KeyboardInput.js';
import { TouchInput } from './input/TouchInput.js';

window.addEventListener('DOMContentLoaded', () => {
  const app = new Game();
  app.init();
});
```

> **注意**：使用 ES6 模組（`type="module"`），`file://` 協議下部分瀏覽器需注意 CORS，建議提供非模組備援入口或使用 IIFE 打包版。

### `js/core/Game.js`（主狀態機）

- 持有所有子系統參考
- 管理全域遊戲狀態（`LOADING | MENU | PLAYING | PAUSED | GAME_OVER`）
- 提供 `start()`, `pause()`, `resume()`, `gameOver()`, `nextLevel()` 方法

### `js/core/GameLoop.js`

```javascript
// 固定更新頻率 60fps，分離 update / render
tick(timestamp) {
  const delta = timestamp - this.lastTime;
  this.accumulator += delta;
  while (this.accumulator >= FIXED_STEP) {
    this.update(FIXED_STEP);
    this.accumulator -= FIXED_STEP;
  }
  this.render(this.accumulator / FIXED_STEP);
  requestAnimationFrame(this.tick.bind(this));
}
```

### `js/audio/AudioManager.js`

- 統一控制 BGM 與 SFX 音量
- `playBGM(track, fadeIn = true)`：淡入新 BGM
- `stopBGM(fadeOut = true)`：淡出停止
- `crossFade(oldTrack, newTrack)`：無縫切換（切換畫面時使用）
- `playSFX(name)`：播放音效（不影響 BGM）
- 維護「持續播放」狀態：切換 UI 畫面時 BGM 不中斷

### `js/ui/ScreenManager.js`

- 管理畫面 DOM 顯示/隱藏
- `switchTo(screenName)`：觸發 CSS 轉場動畫，通知 AudioManager 更新 BGM
- 確保畫面切換時音樂平滑銜接（見第 12 節）

---

## 11. 資源檔案規劃

### 字體（Google Fonts CDN）

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

### 音效備援策略

1. 優先使用 Web Audio API 合成（`SoundEffects.js`）
2. 若合成失敗，fallback 到 `assets/audio/sfx/*.ogg`
3. 若 `.ogg` 不支援，fallback 到 `.mp3`

```javascript
const audio = new Audio();
const canOgg = audio.canPlayType('audio/ogg') !== '';
const ext = canOgg ? '.ogg' : '.mp3';
```

---

## 12. 各畫面音樂銜接邏輯

```
畫面切換音樂銜接規則（AudioManager.js + ScreenManager.js）

┌─────────────────────────────────────────────────────────┐
│  從       →    到          │  音樂行為                  │
├─────────────────────────────────────────────────────────┤
│  主選單   →    說明        │  menu-theme 持續播放（不中斷）│
│  主選單   →    設定        │  menu-theme 持續播放（不中斷）│
│  說明     →    主選單      │  menu-theme 持續播放（不中斷）│
│  設定     →    主選單      │  menu-theme 持續播放（不中斷）│
│  主選單   →    遊戲開場    │  menu-theme 淡出 → 播放 intro jingle │
│  遊戲開場 →    遊戲進行    │  intro 結束 → 淡入 game-theme-1 │
│  遊戲進行 →    暫停        │  game-theme 暫停（凍結位置）│
│  暫停     →    遊戲進行    │  game-theme 從暫停點繼續   │
│  暫停     →    設定        │  game-theme 繼續播放（不中斷）│
│  遊戲關5+ →    關卡繼續    │  crossFade game-theme-1 → game-theme-2 │
│  遊戲進行 →    遊戲結束    │  game-theme 停止 → 播放 game-over-theme │
│  遊戲結束 →    主選單      │  game-over 淡出 → menu-theme 淡入 │
└─────────────────────────────────────────────────────────┘

設定中「BGM 持續播放」開關 = false 時：
  → 所有畫面切換均淡出 BGM，不自動播放下一首
```

---

## 13. 行動裝置操控規格

### 虛擬搖桿（`TouchInput.js` + `css/components/mobile-controls.css`）

- 十字方向按鈕配置（上下左右四鍵）
- 位於畫面底部，高度 `160px`，寬度 `100%`
- 按鈕尺寸：`min(80px, 18vw)`（觸控友善）
- 中央圓形按鍵保留為暫停鍵（或裝飾性 Pac-Man 圖示）
- `touch-action: none` 防止頁面滑動

### 滑動手勢（備援）

- 在 Canvas 區域滑動可控制方向
- 判斷滑動角度（45° 容許範圍）決定方向
- 滑動距離 > `20px` 才觸發（防誤觸）

### 震動反饋（Vibration API）

```javascript
// Pac-Man 死亡：長震
navigator.vibrate?.([200, 100, 200]);
// 吃到鬼魂：短震
navigator.vibrate?.(50);
// 按鈕點擊：極短震
navigator.vibrate?.(10);
```

### 防止行動裝置預設行為

```javascript
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('contextmenu', e => e.preventDefault());
```

---

## 14. 儲存與狀態規格

### localStorage 結構

```javascript
// 鍵名 prefix: "pacman_"
{
  "pacman_settings": {
    "musicVolume": 70,
    "sfxVolume": 90,
    "theme": "classic",
    "difficulty": "normal",
    "bgmContinuous": true,
    "vibration": true
  },
  "pacman_highscore": 99999,
  "pacman_save": {
    "score": 12340,
    "level": 3,
    "lives": 2,
    "mazeState": [...],   // 二維陣列，記錄已吃豆子
    "timestamp": 1716893245000
  }
}
```

### 繼續遊戲判斷

```javascript
const hasSave = () => {
  const save = SaveManager.load('save');
  return save && save.lives > 0;
};
// 主選單「繼續遊戲」按鈕：hasSave() 為 false 時 disabled
```

---

## 15. 開發優先順序

| 優先級 | 模組 | 說明 |
|--------|------|------|
| P0 | 目錄結構、index.html、CSS 變數、字體 | 骨架建立 |
| P0 | Canvas 迷宮繪製、Pac-Man 移動、鍵盤輸入 | 核心可玩性 |
| P1 | 鬼魂 AI（Blinky 優先）、碰撞偵測、計分 | 遊戲完整性 |
| P1 | 主選單、遊戲結束畫面、ScreenManager | UI 流程 |
| P1 | Web Audio API 基礎音效（chomp、death） | 感官體驗 |
| P2 | 所有四隻鬼魂 AI、能量豆機制 | 原版完整度 |
| P2 | RWD 手機版型、觸控虛擬搖桿 | 行動裝置支援 |
| P2 | 設定畫面、SaveManager、主題切換 | 完整功能 |
| P3 | BGM、音效完整套件、音樂銜接邏輯 | 音樂豐富度 |
| P3 | 說明畫面、多關卡地圖、動畫特效 | 精緻化 |
| P3 | 震動反饋、滑動手勢、高分動畫 | 加分體驗 |

---

> **備註**：本規格書為實作指導文件。開發時若遇瀏覽器 `file://` 協議的 ES Module CORS 限制，建議將所有 JS 合併為單一非模組腳本，或使用 `<script>` 標籤依序引入（無 `type="module"`），以確保「雙擊 index.html 直接遊玩」的核心需求。
