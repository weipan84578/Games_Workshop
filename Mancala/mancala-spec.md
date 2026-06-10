# 🪨 Mancala（播棋）遊戲詳細規格書

**版本：** 1.0.0  
**日期：** 2026-06-10  
**類型：** 純前端單頁遊戲（Pure Frontend SPA）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [專案目錄結構](#3-專案目錄結構)
4. [遊戲規則](#4-遊戲規則)
5. [畫面設計規格](#5-畫面設計規格)
6. [RWD 響應式設計規格](#6-rwd-響應式設計規格)
7. [字體與配色規格](#7-字體與配色規格)
8. [音效與音樂規格](#8-音效與音樂規格)
9. [功能模組規格](#9-功能模組規格)
10. [AI 對手規格](#10-ai-對手規格)
11. [存檔與繼續遊戲](#11-存檔與繼續遊戲)
12. [CSS 架構規格](#12-css-架構規格)
13. [JavaScript 架構規格](#13-javascript-架構規格)
14. [資料結構定義](#14-資料結構定義)
15. [事件系統規格](#15-事件系統規格)
16. [動畫規格](#16-動畫規格)
17. [無障礙設計](#17-無障礙設計)

---

## 1. 專案概述

### 1.1 遊戲簡介

Mancala（播棋）是一種古老的非洲/中東策略棋盤遊戲。本實作採用最廣為流傳的 **Kalah** 規則變體，支援玩家對抗 AI，適合在各種裝置上遊玩。

### 1.2 核心目標

- ✅ 零依賴、零建置步驟，直接點擊 `index.html` 即可遊玩
- ✅ 完美 RWD，支援桌機、平板、手機
- ✅ 豐富的音效與背景音樂體驗
- ✅ 清晰大字體 UI，多主題配色
- ✅ 完整的玩家 vs AI 體驗（三種難度）
- ✅ 遊戲進度自動儲存

### 1.3 支援瀏覽器

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---

## 2. 技術架構

### 2.1 技術選型

```
純 Vanilla HTML5 / CSS3 / JavaScript (ES6+)
├── 無框架依賴
├── 無建置工具
├── 無 npm / node
└── 直接以 <script type="module"> 引入（或傳統 <script> 引入）
```

> **注意：** 由於直接從本地 `file://` 開啟，若使用 `type="module"` 會觸發 CORS 限制。  
> 因此所有 JS 改用 **傳統 `<script>` 標籤**並確保以 `var` 宣告命名空間，或採用 IIFE 模式避免全域污染。  
> 音效使用 **Web Audio API** 動態生成（無需載入外部音效檔），或使用 Base64 嵌入音效資料。

### 2.2 瀏覽器 API 使用

| API | 用途 |
|-----|------|
| `Web Audio API` | 動態生成所有音效（無需外部音效檔） |
| `localStorage` | 遊戲存檔、設定儲存 |
| `CSS Custom Properties` | 動態主題切換 |
| `CSS Grid / Flexbox` | 棋盤與 RWD 佈局 |
| `CSS Animations / Transitions` | 棋子動畫效果 |
| `requestAnimationFrame` | 流暢動畫 |
| `matchMedia` | JS 偵測裝置尺寸 |

---

## 3. 專案目錄結構

```
mancala/
│
├── index.html                    # 入口：引入所有 CSS 與 JS
│
├── css/
│   ├── base/
│   │   ├── reset.css             # CSS Reset / Normalize
│   │   ├── variables.css         # CSS 變數定義（顏色、字體、間距）
│   │   └── typography.css        # 字體大小、行高、字重規範
│   │
│   ├── layout/
│   │   ├── app-layout.css        # 整體頁面佈局（flex 容器）
│   │   ├── screens.css           # 各畫面（screen）的顯示/隱藏切換
│   │   └── responsive.css        # RWD Media Queries（斷點設定）
│   │
│   ├── components/
│   │   ├── board.css             # 棋盤樣式（坑、大倉、棋子）
│   │   ├── buttons.css           # 按鈕元件樣式
│   │   ├── modal.css             # 彈窗/對話框樣式
│   │   ├── menu.css              # 主選單樣式
│   │   ├── settings.css          # 設定畫面樣式
│   │   ├── hud.css               # 遊戲內 HUD（計分、回合、計時）
│   │   └── toast.css             # Toast 通知樣式
│   │
│   ├── themes/
│   │   ├── theme-classic.css     # 主題：經典木質棕
│   │   ├── theme-ocean.css       # 主題：海洋藍
│   │   ├── theme-forest.css      # 主題：森林綠
│   │   ├── theme-sunset.css      # 主題：夕陽橙紅
│   │   ├── theme-night.css       # 主題：暗夜紫黑
│   │   └── theme-candy.css       # 主題：糖果粉彩
│   │
│   └── animations/
│       ├── transitions.css       # 畫面切換過渡動畫
│       ├── stone-move.css        # 棋子移動動畫
│       └── effects.css           # 特效（發光、震動、彈跳）
│
├── js/
│   ├── core/
│   │   ├── GameEngine.js         # 核心遊戲邏輯（棋盤狀態、規則判斷）
│   │   ├── GameState.js          # 遊戲狀態管理（單一資料源）
│   │   └── MoveValidator.js      # 走法合法性驗證
│   │
│   ├── ai/
│   │   ├── AIController.js       # AI 總控（難度分發）
│   │   ├── AIEasy.js             # 簡單 AI（隨機走法）
│   │   ├── AINormal.js           # 普通 AI（貪婪策略 + 規則）
│   │   └── AIHard.js             # 困難 AI（Minimax + Alpha-Beta 剪枝）
│   │
│   ├── audio/
│   │   ├── AudioEngine.js        # Web Audio API 封裝、音效管理器
│   │   ├── SoundEffects.js       # 所有音效的波形參數定義
│   │   └── MusicPlayer.js        # 背景音樂生成與控制
│   │
│   ├── ui/
│   │   ├── ScreenManager.js      # 畫面切換管理
│   │   ├── BoardRenderer.js      # 棋盤 DOM 渲染與更新
│   │   ├── AnimationManager.js   # 動畫排程與執行
│   │   ├── ThemeManager.js       # 主題切換管理
│   │   └── ToastManager.js       # Toast 通知顯示
│   │
│   ├── storage/
│   │   └── SaveManager.js        # localStorage 存讀檔管理
│   │
│   └── main.js                   # 主程式入口（初始化、事件綁定）
│
└── assets/
    └── fonts/
        └── README.md             # 說明使用 Google Fonts CDN（無本地字體檔）
```

---

## 4. 遊戲規則

### 4.1 棋盤配置

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   [AI 大倉]  [AI-6][AI-5][AI-4][AI-3][AI-2][AI-1]      │
│    (Mancala)                                            │
│                                                         │
│              [P1-1][P1-2][P1-3][P1-4][P1-5][P1-6]  [P1 大倉] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- 棋盤有 **14 個格子**：12 個小坑 + 2 個大倉（Mancala/Store）
- 每位玩家控制**自己這側**的 6 個小坑
- 遊戲開始時，每個小坑放 **4 顆棋子**（共 48 顆）
- 大倉一開始為空

### 4.2 座位分配

| 位置 | 玩家 | 大倉索引 | 小坑索引 |
|------|------|---------|---------|
| 下方（南側） | 玩家（Human） | index 6 | index 0–5（左至右） |
| 上方（北側） | AI | index 13 | index 7–12（右至左顯示） |

### 4.3 走法步驟

1. 玩家點擊自己這側**非空**的一個小坑
2. 取出該坑全部棋子
3. 從該坑的**下一格**開始，**逆時針**依序每格放一顆（Counter-clockwise 播種）
4. **跳過對手的大倉**（不放棋子進對手的大倉）
5. 最後一顆棋子落地後，判斷特殊規則：
   - **再走一次**：若最後一顆落入自己的大倉，可再走一步
   - **捕捉**：若最後一顆落入自己這側的**空坑**，且對面坑有棋子，則把自己這顆 + 對面所有棋子，一起放入自己的大倉
6. 換對手行動

### 4.4 遊戲結束條件

- **當某一方**的 6 個小坑全部為空時，遊戲結束
- 另一方將**剩餘的所有棋子**全部移入自己的大倉
- 比較兩方大倉數量，多者獲勝
- 若相等，則平局

### 4.5 合法走法

- 玩家只能選擇**當前回合方**，且**非空**的小坑
- AI 無法在玩家回合行動

---

## 5. 畫面設計規格

### 5.1 畫面列表

| 畫面 ID | 名稱 | 說明 |
|---------|------|------|
| `screen-main-menu` | 主選單 | 遊戲入口，含四個主要按鈕 |
| `screen-game` | 遊戲畫面 | 棋盤 + HUD + 操作按鈕 |
| `screen-instructions` | 說明畫面 | 遊戲規則說明 |
| `screen-settings` | 設定畫面 | 音量、主題、難度等設定 |
| `screen-game-over` | 遊戲結束 | 顯示勝負結果與統計 |

### 5.2 主選單（`screen-main-menu`）

**版面結構：**

```
┌────────────────────────────────────┐
│                                    │
│      🪨  Mancala  播棋              │
│      [副標題：精緻策略棋盤遊戲]      │
│                                    │
│      ┌──────────────────────┐      │
│      │   🎮  開始遊戲        │      │
│      └──────────────────────┘      │
│      ┌──────────────────────┐      │
│      │   ▶  繼續遊戲         │      │  ← 無存檔時為灰色不可點
│      └──────────────────────┘      │
│      ┌──────────────────────┐      │
│      │   📖  遊戲說明        │      │
│      └──────────────────────┘      │
│      ┌──────────────────────┐      │
│      │   ⚙️  設定            │      │
│      └──────────────────────┘      │
│                                    │
│      版本 1.0.0                    │
└────────────────────────────────────┘
```

**行為：**
- 首次進入：「繼續遊戲」按鈕呈**灰色禁用**狀態，`aria-disabled="true"`
- 有存檔時：「繼續遊戲」按鈕亮起，顯示存檔時間戳（`上次遊玩：2025-06-10 14:32`）
- 進入畫面時播放主選單背景音樂（柔和、悠揚）
- 按鈕 hover 時觸發 UI 音效

### 5.3 難度選擇彈窗

點擊「開始遊戲」後，彈出 Modal：

```
┌──────────────────────────────────┐
│         選擇 AI 難度              │
│                                  │
│   ┌─────────┐  難度說明：         │
│   │  🌱 簡單 │  AI 隨機選擇，     │
│   └─────────┘  適合初學者。       │
│                                  │
│   ┌─────────┐  難度說明：         │
│   │  ⚔️ 普通 │  AI 使用基本策略，  │
│   └─────────┘  有一定挑戰性。     │
│                                  │
│   ┌─────────┐  難度說明：         │
│   │  💀 困難 │  AI 深度搜尋最佳走  │
│   └─────────┘  法，高手才能勝出。 │
│                                  │
│              [ 取消 ]             │
└──────────────────────────────────┘
```

### 5.4 遊戲畫面（`screen-game`）

**版面結構（桌機）：**

```
┌────────────────────────────────────────────┐
│  HUD 列：[AI 💀 困難]     [⏱ 00:03:42]     │
│          [AI 倉：18 顆]   [玩家 倉：14 顆] │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────┐  [12][11][10][9][8][7]  ┌──────┐ │
│  │ AI   │                         │ 玩家 │ │
│  │ 大倉 │  [1] [2] [3][4][5][6]   │ 大倉 │ │
│  └──────┘                         └──────┘ │
│                                            │
│  [回合：玩家的回合 ▶ 請選擇一個坑]           │
│                                            │
├────────────────────────────────────────────┤
│  [ 🔇 音效 ]  [ ⏸ 暫停 ]  [ 🏠 選單 ]      │
└────────────────────────────────────────────┘
```

**坑的顯示：**
- 每個坑顯示**棋子數量**（大字體數字）
- 玩家可點擊的坑（非空、輪到玩家）：顯示**高亮邊框 + 游標 pointer**
- 坑內顯示小圓圈代表棋子（棋子數 ≤ 12 時顯示圖案，> 12 只顯示數字）
- AI 的坑：**禁止點擊**（cursor: not-allowed）
- 空坑：**淡化顯示**

**大倉的顯示：**
- 大倉為長條形，顯示棋子總數（超大字體）
- 底部顯示玩家名稱標籤

### 5.5 設定畫面（`screen-settings`）

```
┌─────────────────────────────────────────┐
│  ⚙️ 設定                          [ X ]  │
├─────────────────────────────────────────┤
│                                         │
│  🎵 背景音樂音量                         │
│  [━━━━●━━━━━━━━] 50%                    │
│                                         │
│  🔊 音效音量                             │
│  [━━━━━━━━●━━━━] 70%                    │
│                                         │
│  🎨 遊戲主題                             │
│  [ 經典 ] [ 海洋 ] [ 森林 ]              │
│  [ 夕陽 ] [ 暗夜 ] [ 糖果 ]             │
│                                         │
│  ⏱ 顯示計時器                           │
│  [ ● ON  ]  [ OFF ]                     │
│                                         │
│  🤖 預設 AI 難度                         │
│  [ 簡單 ] [ ● 普通 ] [ 困難 ]           │
│                                         │
│  ♟ 每坑初始棋子數                       │
│  [ 3 ] [ ● 4 ] [ 5 ] [ 6 ]             │
│                                         │
│           [ 儲存設定 ]                   │
└─────────────────────────────────────────┘
```

### 5.6 說明畫面（`screen-instructions`）

- 使用圖文並茂的方式說明遊戲規則
- 包含棋盤示意圖（SVG）
- 分段式說明：棋盤介紹 → 走法 → 特殊規則 → 勝利條件
- 底部有「我了解了，開始遊戲！」按鈕

### 5.7 遊戲結束畫面（`screen-game-over`）

```
┌─────────────────────────────────────────┐
│                                         │
│       🎉  玩家獲勝！                     │
│                                         │
│       玩家大倉：28 顆                    │
│       AI 大倉：20 顆                     │
│                                         │
│       ⏱ 遊戲時長：00:05:43              │
│       🎯 總回合數：32                    │
│                                         │
│   ┌───────────────┐ ┌────────────────┐  │
│   │  🔄 再來一局  │ │  🏠 回主選單   │  │
│   └───────────────┘ └────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 6. RWD 響應式設計規格

### 6.1 斷點定義

| 名稱 | 寬度範圍 | 裝置類型 |
|------|---------|---------|
| `mobile-sm` | ≤ 360px | 小螢幕手機（SE、舊型 Android） |
| `mobile` | 361px – 480px | 標準手機（豎向） |
| `tablet` | 481px – 768px | 大手機/小平板（豎向） |
| `tablet-lg` | 769px – 1024px | 平板（橫向）/ 小筆電 |
| `desktop` | 1025px – 1440px | 桌機/筆電 |
| `desktop-lg` | 1441px+ | 大螢幕桌機 |

### 6.2 棋盤佈局切換

#### 桌機版（≥ 769px）：標準橫向棋盤

```
[AI 大倉 LEFT]  [6個AI的坑橫排]  [玩家大倉 RIGHT]
[AI 大倉 LEFT]  [6個玩家坑橫排] [玩家大倉 RIGHT]
```

使用 CSS Grid：
```css
.board {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr 1fr;
}
```

#### 手機版（≤ 480px）：直向棋盤

```
[AI 大倉（橫條，上方）]
[6個AI的坑 — 2列3欄]
[6個玩家坑 — 2列3欄]
[玩家大倉（橫條，下方）]
```

坑的排列從 3×2 變為更緊湊的佈局，大倉改為**水平條狀**置於棋盤上下方。

#### 平板版（481px – 768px）：同桌機版，但比例縮小

### 6.3 坑的尺寸規範

| 裝置 | 坑的最小尺寸 | 大倉寬度 | 字體大小 |
|------|------------|---------|---------|
| 桌機 | 80×80px | 80px | 28px |
| 平板 | 68×68px | 70px | 24px |
| 手機 | 58×58px | 64px | 20px |
| 小手機 | 50×50px | 58px | 18px |

### 6.4 行動裝置操作按鈕不遮擋棋盤

**問題：** 行動裝置虛擬鍵盤或底部的瀏覽器導覽列可能壓縮遊戲區域。

**解決方案：**
1. 遊戲操作按鈕（音效、暫停、主選單）固定在畫面**最底部** `position: fixed; bottom: 0`，但**棋盤容器**加上 `padding-bottom: 70px` 確保不被遮擋
2. 使用 `env(safe-area-inset-bottom)` 處理 iPhone 底部安全區域：
   ```css
   .game-controls-bar {
     padding-bottom: calc(10px + env(safe-area-inset-bottom));
   }
   ```
3. 棋盤高度使用 `calc(100dvh - 70px - 60px)` 動態計算（`dvh` = dynamic viewport height，處理手機工具列彈出問題）
4. 操作按鈕使用**半透明毛玻璃效果**，避免視覺遮擋感：
   ```css
   .game-controls-bar {
     background: rgba(var(--color-bg-rgb), 0.85);
     backdrop-filter: blur(8px);
   }
   ```

### 6.5 觸控優化

- 所有可互動元素最小觸控大小 **48×48px**（Apple HIG 標準）
- 坑的觸控區域比視覺區域稍大（padding 補足）
- 手機版禁止雙擊縮放：`touch-action: manipulation`
- 觸控時不顯示藍色高亮框：`-webkit-tap-highlight-color: transparent`

---

## 7. 字體與配色規格

### 7.1 字體規範

**引入方式（Google Fonts CDN）：**
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
```

| 用途 | 字體 | 大小 | 字重 |
|------|------|------|------|
| 遊戲標題 | Nunito | 48px（桌機）/ 36px（手機） | 900 |
| 大倉數字 | Nunito | 56px（桌機）/ 40px（手機） | 900 |
| 坑的棋子數 | Nunito | 32px（桌機）/ 24px（手機） | 800 |
| 按鈕文字 | Noto Sans TC | 20px（桌機）/ 18px（手機） | 700 |
| HUD 資訊 | Noto Sans TC | 18px（桌機）/ 16px（手機） | 700 |
| 說明文字 | Noto Sans TC | 18px（桌機）/ 16px（手機） | 500 |
| 輔助說明 | Noto Sans TC | 14px | 400 |

**最小字體規定：** 任何情況下不得小於 13px。

### 7.2 六套主題配色方案

#### 主題 1：經典木質（`theme-classic`）— 預設

```css
:root {
  --color-bg: #2C1A0E;           /* 深棕背景 */
  --color-board: #6B3A1F;        /* 木質棋盤 */
  --color-pit: #8B5E3C;          /* 坑位顏色 */
  --color-pit-hover: #A0724F;    /* 坑位懸停 */
  --color-pit-active: #C4926A;   /* 可點擊坑位 */
  --color-store: #5C2E0A;        /* 大倉顏色 */
  --color-stone: #D4A574;        /* 棋子（米白棕） */
  --color-stone-ai: #4A9ECA;     /* AI 棋子色（藍） */
  --color-text-primary: #FFF5E6; /* 主要文字 */
  --color-text-secondary: #C9A27A; /* 次要文字 */
  --color-accent: #E8B86D;       /* 強調色（金） */
  --color-highlight: #FFD700;    /* 高亮（金黃） */
  --color-btn-primary: #D4821A;  /* 主要按鈕 */
  --color-btn-hover: #F09430;    /* 按鈕懸停 */
  --color-overlay: rgba(0,0,0,0.7);
}
```

#### 主題 2：海洋藍（`theme-ocean`）

```css
:root {
  --color-bg: #0A1628;
  --color-board: #0D2B4E;
  --color-pit: #1A4A7C;
  --color-pit-hover: #2460A0;
  --color-pit-active: #3A80C0;
  --color-store: #0A1E3A;
  --color-stone: #64B8E8;
  --color-stone-ai: #F0A050;
  --color-text-primary: #E8F4FF;
  --color-text-secondary: #88C0E8;
  --color-accent: #00E5FF;
  --color-highlight: #4DD0FF;
  --color-btn-primary: #1E6FB0;
  --color-btn-hover: #2A90D8;
  --color-overlay: rgba(0,10,30,0.8);
}
```

#### 主題 3：森林綠（`theme-forest`）

```css
:root {
  --color-bg: #0F1F0A;
  --color-board: #1E3B10;
  --color-pit: #2D5A1B;
  --color-pit-hover: #3D7825;
  --color-pit-active: #519A30;
  --color-store: #142808;
  --color-stone: #A8D870;
  --color-stone-ai: #E8A030;
  --color-text-primary: #E8FFD8;
  --color-text-secondary: #90C860;
  --color-accent: #7EFF48;
  --color-highlight: #A0FF60;
  --color-btn-primary: #3A8020;
  --color-btn-hover: #50A830;
  --color-overlay: rgba(0,15,0,0.8);
}
```

#### 主題 4：夕陽橙紅（`theme-sunset`）

```css
:root {
  --color-bg: #1A0808;
  --color-board: #3D1010;
  --color-pit: #6B2020;
  --color-pit-hover: #8A3030;
  --color-pit-active: #B04040;
  --color-store: #2A0A0A;
  --color-stone: #FF8C42;
  --color-stone-ai: #60C0FF;
  --color-text-primary: #FFE8D8;
  --color-text-secondary: #FFAA80;
  --color-accent: #FF5F1F;
  --color-highlight: #FF9040;
  --color-btn-primary: #C83020;
  --color-btn-hover: #E84030;
  --color-overlay: rgba(20,0,0,0.8);
}
```

#### 主題 5：暗夜紫黑（`theme-night`）

```css
:root {
  --color-bg: #0A080F;
  --color-board: #160D25;
  --color-pit: #2A1845;
  --color-pit-hover: #3A2560;
  --color-pit-active: #5035A0;
  --color-store: #0D0818;
  --color-stone: #A080FF;
  --color-stone-ai: #FF80A0;
  --color-text-primary: #EEE0FF;
  --color-text-secondary: #9070CC;
  --color-accent: #C080FF;
  --color-highlight: #D0A0FF;
  --color-btn-primary: #5028A0;
  --color-btn-hover: #6835C8;
  --color-overlay: rgba(5,0,15,0.85);
}
```

#### 主題 6：糖果粉彩（`theme-candy`）

```css
:root {
  --color-bg: #FFE8F5;
  --color-board: #FFB8E0;
  --color-pit: #FF80C0;
  --color-pit-hover: #FF60B0;
  --color-pit-active: #FF40A0;
  --color-store: #FFCCE8;
  --color-stone: #FF1493;
  --color-stone-ai: #00CED1;
  --color-text-primary: #3D0030;
  --color-text-secondary: #882060;
  --color-accent: #FF007F;
  --color-highlight: #FF69B4;
  --color-btn-primary: #FF4099;
  --color-btn-hover: #FF1480;
  --color-overlay: rgba(80,0,60,0.7);
}
```

---

## 8. 音效與音樂規格

> **技術說明：** 所有音效使用 **Web Audio API** 程式化生成，完全無需外部音效檔案，確保離線可用且無版權問題。

### 8.1 Web Audio API 音效引擎架構

```javascript
// AudioEngine.js 核心結構
class AudioEngine {
  constructor() {
    this.context = null;       // AudioContext
    this.masterGain = null;    // 主音量節點
    this.musicGain = null;     // 音樂音量節點
    this.sfxGain = null;       // 音效音量節點
    this.musicOscillators = []; // 背景音樂音符序列
    this.isInitialized = false;
    this.musicVolume = 0.5;    // 0.0 – 1.0
    this.sfxVolume = 0.7;
    this.isMusicMuted = false;
    this.isSfxMuted = false;
    this.currentScreen = null; // 追蹤當前畫面（決定音樂）
  }
  
  // 首次使用者互動後才能初始化（瀏覽器政策）
  init() { ... }
  
  // 播放音效
  play(soundId) { ... }
  
  // 切換背景音樂（跨畫面持續播放控制）
  switchMusic(trackId, fadeOut = true) { ... }
}
```

### 8.2 音效列表（最少 14 種）

| 音效 ID | 觸發時機 | 波形描述 |
|---------|---------|---------|
| `sfx_stone_drop` | 棋子放入坑（每顆）| 短促清脆打擊音（高頻 sine 脈衝） |
| `sfx_stone_drop_last` | 最後一顆棋子落地 | 略長的打擊音，有輕微回響 |
| `sfx_store_score` | 棋子落入大倉 | 金屬碰撞感，頻率稍低，帶滿足感 |
| `sfx_capture` | 觸發捕捉 | 連續三聲上揚音調（勝利感） |
| `sfx_extra_turn` | 獲得再走一次 | 魔法光效音（上揚的 sine 掃頻） |
| `sfx_button_hover` | 按鈕懸停 | 極短輕柔 tick 音 |
| `sfx_button_click` | 按鈕點擊 | 稍重的 click 音 |
| `sfx_screen_in` | 畫面進場 | 輕柔的 whoosh 音 |
| `sfx_screen_out` | 畫面離場 | 反向 whoosh 音 |
| `sfx_invalid_move` | 點擊空坑 | 短暫低沉否定音（buzz） |
| `sfx_ai_thinking` | AI 思考中（困難模式）| 微弱脈動電子音 |
| `sfx_game_win` | 玩家勝利 | 三音節上揚勝利曲 |
| `sfx_game_lose` | 玩家失敗 | 下降三音調哀傷音 |
| `sfx_game_draw` | 平局 | 中性雙音調 |
| `sfx_board_reset` | 新局開始棋盤重置 | 輕微震動感音效 |
| `sfx_modal_open` | 彈窗開啟 | 輕柔彈出音 |
| `sfx_modal_close` | 彈窗關閉 | 相反收回音 |

### 8.3 背景音樂列表（3 套）

| 音樂 ID | 使用畫面 | 風格描述 |
|---------|---------|---------|
| `music_menu` | 主選單、說明、設定 | 柔和輕鬆的琶音旋律，BPM 80，C 大調 |
| `music_game_normal` | 遊戲中（簡單/普通） | 輕快悠然的打擊感旋律，BPM 100 |
| `music_game_intense` | 遊戲中（困難模式）| 緊張感強的節奏，BPM 130，小調 |

**跨畫面持續播放規則：**

```
主選單 → 設定：music_menu 繼續（不中斷）
主選單 → 說明：music_menu 繼續（不中斷）
主選單 → 遊戲（簡單/普通）：淡出 music_menu，淡入 music_game_normal（2秒交叉淡化）
主選單 → 遊戲（困難）：淡出 music_menu，淡入 music_game_intense（2秒交叉淡化）
遊戲 → 主選單：淡出遊戲音樂，淡入 music_menu（1.5秒）
遊戲 → 設定（從遊戲中）：遊戲音樂繼續（不中斷）
遊戲結束畫面：遊戲音樂停止，播放結算 Jingle（sfx_game_win/lose/draw），之後無音樂
```

### 8.4 音效程式化生成範例

```javascript
// 棋子落地音效（sfx_stone_drop）
function createStoneDrop(audioCtx, gainNode) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(gainNode);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

// 背景音樂生成（music_menu — 使用音符序列 + 延遲播放）
function createMenuMusic(audioCtx, musicGainNode) {
  const notes = [
    { freq: 261.63, duration: 0.5 }, // C4
    { freq: 329.63, duration: 0.5 }, // E4
    { freq: 392.00, duration: 0.5 }, // G4
    { freq: 523.25, duration: 1.0 }, // C5
    // ...更多音符...
  ];
  // 使用 Web Audio API 排程播放，循環
}
```

---

## 9. 功能模組規格

### 9.1 主選單功能

| 按鈕 | 行為 |
|------|------|
| 開始遊戲 | 開啟難度選擇 Modal |
| 繼續遊戲 | 從 localStorage 讀取存檔，直接進入遊戲畫面 |
| 遊戲說明 | 切換至說明畫面 |
| 設定 | 切換至設定畫面 |

### 9.2 遊戲中功能

| 功能 | 說明 |
|------|------|
| 坑的點擊 | 玩家選擇坑，觸發遊戲邏輯 |
| 暫停/繼續 | 暫停計時器，棋盤禁止點擊，顯示暫停 Overlay |
| 音效開關 | 切換 SFX 靜音（不影響音樂） |
| 音樂開關 | 切換音樂靜音（不影響 SFX） |
| 返回主選單 | 彈出確認 Modal（「遊戲將自動儲存，確定離開？」），確認後儲存並返回 |
| 自動存檔 | 每次走完一步後自動儲存當前局面到 localStorage |
| 悔棋 | 目前版本**不支援**悔棋（可作為未來功能） |

### 9.3 AI 思考顯示

- 困難 AI 思考時（Minimax 計算）：
  - 棋盤禁止點擊
  - 顯示「AI 正在思考...」提示（帶動畫省略號）
  - 觸發 `sfx_ai_thinking` 音效（輕柔，不干擾）
  - 困難 AI 思考時間可能達 200–800ms，需使用 `setTimeout` 或 `Web Worker` 避免 UI 凍結

---

## 10. AI 對手規格

### 10.1 簡單 AI（`AIEasy.js`）

**策略：** 完全隨機，從合法走法中隨機選擇一個。

```javascript
class AIEasy {
  getMove(gameState) {
    const validMoves = this.getValidMoves(gameState);
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }
}
```

**思考延遲：** 固定 300ms（模擬思考）

### 10.2 普通 AI（`AINormal.js`）

**策略：** 基於規則的貪婪策略，優先順序如下：

1. **優先取得再走一次：** 若有走法可使最後一顆落入大倉，選擇之
2. **優先觸發捕捉：** 若有走法可觸發捕捉且捕捉值最大，選擇之
3. **最大化大倉增量：** 選擇能讓最多棋子進大倉的走法
4. **阻止對手得分：** 避免讓對手下一步輕易得分
5. **否則隨機：** 隨機選一個合法走法

**思考延遲：** 300–600ms 隨機（更自然）

### 10.3 困難 AI（`AIHard.js`）

**策略：** Minimax 演算法 + Alpha-Beta 剪枝，搜尋深度 **8 層**（可依效能調整至 6–10）

**評估函數（Heuristic）：**

```javascript
function evaluate(gameState) {
  const playerStore = gameState.board[6];
  const aiStore = gameState.board[13];
  
  // 大倉差值（最重要）
  const storeDiff = (aiStore - playerStore) * 3;
  
  // 小坑總棋子差值
  const playerPitTotal = sum(gameState.board.slice(0, 6));
  const aiPitTotal = sum(gameState.board.slice(7, 13));
  const pitDiff = (aiPitTotal - playerPitTotal) * 1;
  
  // 可再走一次的機會
  const extraTurnBonus = countExtraTurnMoves(gameState) * 4;
  
  // 可捕捉的機會
  const captureBonus = bestCaptureValue(gameState) * 2;
  
  return storeDiff + pitDiff + extraTurnBonus + captureBonus;
}
```

**思考延遲：** 400–1000ms 隨機（搭配 `Web Worker` 計算，UI 不凍結）

> **Web Worker 說明：** 困難 AI 的 Minimax 計算在 `js/ai/AIHardWorker.js` 中執行，主線程透過 `postMessage` / `onmessage` 溝通，避免 UI 卡頓。

### 10.4 AI 走法動畫

AI 走完後，棋子動畫同樣按順序播放（同玩家操作），並在每顆棋子落下時觸發 `sfx_stone_drop`。

---

## 11. 存檔與繼續遊戲

### 11.1 存檔資料結構

```javascript
// localStorage key: "mancala_save"
{
  "version": "1.0.0",
  "timestamp": "2026-06-10T14:32:00.000Z",
  "difficulty": "normal",   // "easy" | "normal" | "hard"
  "board": [4,4,4,4,4,4, 0, 4,4,4,4,4,4, 0],  // 14 格棋盤狀態
  "currentTurn": "player",  // "player" | "ai"
  "playerScore": 12,        // 玩家大倉
  "aiScore": 8,             // AI 大倉
  "gameTime": 183,          // 遊戲時長（秒）
  "moveCount": 24,          // 走了幾步
  "isGameOver": false
}
```

### 11.2 設定儲存結構

```javascript
// localStorage key: "mancala_settings"
{
  "version": "1.0.0",
  "musicVolume": 0.5,
  "sfxVolume": 0.7,
  "isMusicMuted": false,
  "isSfxMuted": false,
  "theme": "classic",       // 六個主題 ID 之一
  "showTimer": true,
  "defaultDifficulty": "normal",
  "initialStones": 4        // 每坑初始棋子數（3–6）
}
```

### 11.3 自動存檔時機

- 每次玩家或 AI 完成一步後儲存
- 遊戲結束時清除存檔（`localStorage.removeItem("mancala_save")`）
- 點擊「再來一局」時清除存檔後開新局

---

## 12. CSS 架構規格

### 12.1 CSS 載入順序（在 `index.html` 中）

```html
<!-- 1. Base -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">

<!-- 2. Layout -->
<link rel="stylesheet" href="css/layout/app-layout.css">
<link rel="stylesheet" href="css/layout/screens.css">
<link rel="stylesheet" href="css/layout/responsive.css">

<!-- 3. Components -->
<link rel="stylesheet" href="css/components/board.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/menu.css">
<link rel="stylesheet" href="css/components/settings.css">
<link rel="stylesheet" href="css/components/hud.css">
<link rel="stylesheet" href="css/components/toast.css">

<!-- 4. Themes（只有一個 theme 的 class 會被 active 啟用） -->
<link rel="stylesheet" href="css/themes/theme-classic.css">
<link rel="stylesheet" href="css/themes/theme-ocean.css">
<link rel="stylesheet" href="css/themes/theme-forest.css">
<link rel="stylesheet" href="css/themes/theme-sunset.css">
<link rel="stylesheet" href="css/themes/theme-night.css">
<link rel="stylesheet" href="css/themes/theme-candy.css">

<!-- 5. Animations -->
<link rel="stylesheet" href="css/animations/transitions.css">
<link rel="stylesheet" href="css/animations/stone-move.css">
<link rel="stylesheet" href="css/animations/effects.css">
```

### 12.2 主題切換機制

所有主題 CSS 都以 `data-theme` attribute 為選擇器：

```css
/* theme-ocean.css */
[data-theme="ocean"] {
  --color-bg: #0A1628;
  --color-board: #0D2B4E;
  /* ... */
}
```

切換主題時：

```javascript
// ThemeManager.js
document.documentElement.setAttribute('data-theme', themeId);
```

### 12.3 命名規範（BEM 風格）

```css
/* Block */
.game-board { }

/* Element */
.game-board__pit { }
.game-board__store { }
.game-board__stone { }

/* Modifier */
.game-board__pit--active { }
.game-board__pit--empty { }
.game-board__pit--player { }
.game-board__pit--ai { }
```

---

## 13. JavaScript 架構規格

### 13.1 JS 載入順序（在 `index.html` 中）

```html
<!-- Core（先載，其他模組依賴） -->
<script src="js/core/GameState.js"></script>
<script src="js/core/MoveValidator.js"></script>
<script src="js/core/GameEngine.js"></script>

<!-- AI -->
<script src="js/ai/AIEasy.js"></script>
<script src="js/ai/AINormal.js"></script>
<script src="js/ai/AIHard.js"></script>
<script src="js/ai/AIController.js"></script>

<!-- Audio -->
<script src="js/audio/SoundEffects.js"></script>
<script src="js/audio/MusicPlayer.js"></script>
<script src="js/audio/AudioEngine.js"></script>

<!-- Storage -->
<script src="js/storage/SaveManager.js"></script>

<!-- UI -->
<script src="js/ui/ThemeManager.js"></script>
<script src="js/ui/ToastManager.js"></script>
<script src="js/ui/AnimationManager.js"></script>
<script src="js/ui/BoardRenderer.js"></script>
<script src="js/ui/ScreenManager.js"></script>

<!-- Entry Point（最後載入） -->
<script src="js/main.js"></script>
```

### 13.2 全域命名空間

所有模組以 IIFE 包裹，並掛載至 `window.Mancala` 命名空間：

```javascript
// 例：GameEngine.js
(function(global) {
  'use strict';
  
  function GameEngine() { ... }
  GameEngine.prototype.makeMove = function(pitIndex) { ... };
  
  global.Mancala = global.Mancala || {};
  global.Mancala.GameEngine = GameEngine;
  
})(window);
```

### 13.3 模組責任分工

| 模組 | 責任 | 不應做的事 |
|------|------|-----------|
| `GameState.js` | 持有棋盤陣列、回合狀態、計時器值 | 不操作 DOM |
| `GameEngine.js` | 計算走法後果、判斷捕捉/再走一次/結束 | 不渲染 DOM、不播音效 |
| `MoveValidator.js` | 驗證一個走法是否合法 | 不修改 state |
| `BoardRenderer.js` | 根據 GameState 更新 DOM | 不修改遊戲邏輯 |
| `AnimationManager.js` | 排程並執行棋子動畫 | 不修改 GameState |
| `AudioEngine.js` | 播放音效/音樂 | 不管遊戲邏輯 |
| `SaveManager.js` | 讀寫 localStorage | 只操作儲存，不涉及 UI |
| `ScreenManager.js` | 切換畫面、管理畫面音樂切換 | 不修改遊戲邏輯 |
| `main.js` | 初始化所有模組、綁定事件 | 最薄的膠水層 |

---

## 14. 資料結構定義

### 14.1 棋盤陣列（14 格）

```
索引：  0    1    2    3    4    5    [6]   7    8    9    10   11   12   [13]
角色：  P1   P2   P3   P4   P5   P6  P-大倉 A1   A2   A3   A4   A5   A6  AI-大倉
```

- 索引 0–5：玩家小坑
- 索引 6：玩家大倉
- 索引 7–12：AI 小坑
- 索引 13：AI 大倉

### 14.2 GameState 物件

```javascript
{
  board: [4,4,4,4,4,4,0,4,4,4,4,4,4,0],  // Number[14]
  currentTurn: 'player',    // 'player' | 'ai'
  isGameOver: false,
  winner: null,             // null | 'player' | 'ai' | 'draw'
  difficulty: 'normal',     // 'easy' | 'normal' | 'hard'
  gameTime: 0,              // 秒
  moveCount: 0,
  isTimerRunning: false,
  isPaused: false,
  lastMoveIndex: null,      // 上一步選擇的坑（動畫用）
  lastMoveStones: null,     // 上一步拿起的棋子數（動畫用）
}
```

---

## 15. 事件系統規格

### 15.1 自定義事件列表

| 事件名 | 觸發時機 | detail |
|--------|---------|--------|
| `mancala:move` | 玩家/AI 完成一步 | `{ pitIndex, stonesCount, extraTurn }` |
| `mancala:capture` | 觸發捕捉 | `{ playerPit, aiPit, capturedCount }` |
| `mancala:extraTurn` | 獲得再走一次 | `{ player }` |
| `mancala:gameOver` | 遊戲結束 | `{ winner, playerScore, aiScore }` |
| `mancala:screenChange` | 畫面切換 | `{ from, to }` |
| `mancala:themeChange` | 主題切換 | `{ theme }` |
| `mancala:settingsSave` | 設定儲存 | `{ settings }` |

### 15.2 事件流程範例（玩家點擊坑 → 動畫 → AI 回應）

```
用戶點擊坑 DOM
  │
  ├─ MoveValidator.isValid() → false → play(sfx_invalid_move) → 結束
  │
  └─ true →
       ├─ GameEngine.makeMove(index)
       │     ├─ 更新 board 陣列
       │     ├─ 判斷捕捉 / 再走一次
       │     └─ dispatch('mancala:move', ...)
       │
       ├─ AnimationManager.animateMove() [async]
       │     └─ 依序在每個坑 +1，播放 sfx_stone_drop
       │
       ├─ BoardRenderer.render()
       │
       ├─ SaveManager.save()
       │
       └─ 若 currentTurn === 'ai'：
             └─ AIController.getMove() [setTimeout/Worker]
                   └─ 同上流程（AI 走法）
```

---

## 16. 動畫規格

### 16.1 棋子移動動畫

**方式：** 不使用 CSS Transition 的位移（位移計算複雜），改為**坑的高亮依序閃爍** + **棋子數字跳動**來模擬移動感：

1. 拿起棋子的坑：數字歸零 + `pit--lifting` 動畫（縮小效果）
2. 依序每個坑：延遲 80ms 後，數字 +1 + `pit--receiving` 動畫（放大跳動）
3. 最後一顆：觸發較明顯的特殊動畫（`pit--last-stone`）
4. 若觸發捕捉：相關坑閃爍紅光，數字一起歸零

### 16.2 畫面切換動畫

- **進場：** `translateY(20px) opacity:0` → `translateY(0) opacity:1`，時長 300ms，easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- **離場：** `opacity:1` → `opacity:0`，時長 200ms
- 不使用同時播放（先離場完成後再進場），避免視覺混亂

### 16.3 勝利動畫

- 大倉顯示「✨ XX 顆」，並有金光閃爍效果（CSS `@keyframes`）
- 勝利一方的大倉背景短暫高亮
- 播放 `sfx_game_win` / `sfx_game_lose` 音效

---

## 17. 無障礙設計

### 17.1 ARIA 標籤

```html
<!-- 棋盤 -->
<div class="game-board" role="grid" aria-label="播棋棋盤">
  
  <!-- 每個坑 -->
  <button 
    class="game-board__pit"
    role="gridcell"
    aria-label="玩家第3坑，現有5顆棋子"
    aria-disabled="false">
    5
  </button>
  
  <!-- 大倉 -->
  <div 
    class="game-board__store"
    role="status"
    aria-label="玩家大倉，共12顆棋子">
    12
  </div>
</div>
```

### 17.2 鍵盤支援

- `Tab` 在可點擊的坑之間移動
- `Enter` / `Space` 確認選擇坑
- `Escape` 關閉 Modal / 暫停遊戲

### 17.3 視覺輔助

- 所有互動元素 focus 時有明顯輪廓（不使用 `outline: none`）
- 高對比模式：可互動的坑有**邊框 + 圖示**標示，不只依賴顏色
- 動畫可關閉：偵測 `prefers-reduced-motion`，若啟用則跳過動畫直接更新

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 附錄：index.html 結構範本

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="classic">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <title>Mancala 播棋</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
  
  <!-- CSS（依上方定義之順序） -->
  <link rel="stylesheet" href="css/base/reset.css">
  <!-- ...（略）... -->
  <link rel="stylesheet" href="css/animations/effects.css">
</head>
<body>
  <div id="app">
    <!-- 各畫面容器 -->
    <div id="screen-main-menu" class="screen screen--active">...</div>
    <div id="screen-game"       class="screen">...</div>
    <div id="screen-instructions" class="screen">...</div>
    <div id="screen-settings"   class="screen">...</div>
    <div id="screen-game-over"  class="screen">...</div>
    
    <!-- Toast 通知層 -->
    <div id="toast-container" aria-live="polite"></div>
    
    <!-- Modal 層 -->
    <div id="modal-overlay" class="modal-overlay hidden">
      <div id="modal-content" class="modal">...</div>
    </div>
  </div>
  
  <!-- JavaScript（依上方定義之順序） -->
  <script src="js/core/GameState.js"></script>
  <!-- ...（略）... -->
  <script src="js/main.js"></script>
</body>
</html>
```

---

*規格書版本 1.0.0 — 如有需求變更，請更新版本號與對應章節。*
