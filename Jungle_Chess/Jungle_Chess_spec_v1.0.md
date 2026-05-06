# 🐯 鬥獸棋（Jungle Chess）純前端完整規格書

> 版本：v1.0  
> 日期：2026-05-06  
> 平台：純前端（HTML5 + CSS3 + JavaScript）  
> 模式：單人 vs AI（演算法對弈）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [遊戲規則](#3-遊戲規則)
4. [UI／UX 設計規範](#4-uiux-設計規範)
5. [畫面結構與流程](#5-畫面結構與流程)
6. [主畫面規格](#6-主畫面規格)
7. [設定畫面規格](#7-設定畫面規格)
8. [遊戲棋盤規格](#8-遊戲棋盤規格)
9. [音樂與音效規格](#9-音樂與音效規格)
10. [AI 演算法規格](#10-ai-演算法規格)
11. [行動裝置響應式規格](#11-行動裝置響應式規格)
12. [資料結構定義](#12-資料結構定義)
13. [狀態管理](#13-狀態管理)
14. [動畫與視覺效果](#14-動畫與視覺效果)
15. [無障礙設計](#15-無障礙設計)
16. [測試要點](#16-測試要點)
17. [檔案結構](#17-檔案結構)

---

## 1. 專案概述

### 1.1 產品定義

「鬥獸棋」（又稱叢林棋）為兩人對弈的中式棋類遊戲。本專案實作為：

- **純前端單頁應用（SPA）**，無需後端伺服器
- **單人 vs AI** 模式，AI 使用 Minimax + Alpha-Beta 剪枝演算法
- 支援**桌機、平板、手機**三種裝置
- 內建**背景音樂**與完整**音效回饋**
- 字體設計以**大字體、易讀性**為優先

### 1.2 目標使用者

| 族群 | 特性 |
|------|------|
| 休閒玩家 | 不熟悉鬥獸棋規則，需要提示輔助 |
| 棋類愛好者 | 追求 AI 挑戰性，需要難度選擇 |
| 手機用戶 | 單手操作，點擊精確度需求高 |
| 兒童／家庭 | 視覺元素活潑，字體清晰易讀 |

### 1.3 核心設計原則

1. **字大、清晰**：主要 UI 文字不小於 18px，棋子圖示不小於 36px
2. **一鍵可達**：任何功能最多 3 次點擊可到達
3. **即時回饋**：每個操作有對應音效與視覺動畫
4. **手機優先**：以 375px 寬度為最小基準設計

---

## 2. 技術架構

### 2.1 技術棧

```
├── HTML5              # 語意化結構
├── CSS3               # 動畫、響應式、自訂屬性
│   ├── CSS Variables  # 主題色彩管理
│   ├── CSS Grid       # 棋盤佈局
│   ├── CSS Flexbox    # UI 元件排列
│   └── @keyframes     # 動畫定義
└── Vanilla JavaScript (ES6+)
    ├── 遊戲邏輯引擎
    ├── AI 演算法模組
    ├── 音訊管理模組（Web Audio API）
    └── 狀態管理模組
```

### 2.2 外部資源

| 資源類型 | 來源 | 用途 |
|----------|------|------|
| 字體 | Google Fonts（`Noto Sans TC`、`ZCOOL KuaiLe`） | 中文顯示、標題裝飾 |
| 音樂 | 內嵌 Base64 或 CDN（opengameart.org） | 背景音樂 |
| 音效 | Web Audio API 程式生成 | 移動、吃子、勝利音效 |
| 棋子圖示 | Unicode Emoji 或 SVG inline | 動物圖示顯示 |

### 2.3 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

### 2.4 單檔輸出

整個遊戲打包為 **單一 `index.html`** 檔案，CSS 與 JS 全部 inline，可直接雙擊開啟或部署至任何靜態主機（GitHub Pages、Netlify 等）。

---

## 3. 遊戲規則

### 3.1 棋盤

- 7 欄 × 9 行的格子棋盤
- 棋盤中央有**三條河流**（第 4、5 行，第 2～6 欄），稱為「河」
- 棋盤兩端各有**獸穴**（Den）與**陷阱**（Trap）

```
棋盤座標系（col 0-6, row 0-8）

row 0: [藍方] 陷阱-獸穴-陷阱
row 1: ─────────────────────
row 2: ─────────────────────
row 3: ──[河]────[河]────[河]──
row 4: ──[河]────[河]────[河]──
row 5: ──[河]────[河]────[河]──
row 6: ─────────────────────
row 7: ─────────────────────
row 8: [紅方] 陷阱-獸穴-陷阱
```

### 3.2 特殊格子座標

| 格子類型 | 玩家 | 座標（col, row） |
|----------|------|-----------------|
| 獸穴（Den） | 藍方（AI） | (3, 0) |
| 獸穴（Den） | 紅方（玩家） | (3, 8) |
| 陷阱（Trap） | 藍方 | (2,0), (4,0), (3,1) |
| 陷阱（Trap） | 紅方 | (2,8), (4,8), (3,7) |
| 河流（River） | 共用 | (1-5, 3), (1-5, 4), (1-5, 5)，排除 col 0 與 col 6 |

> **精確河流格**：(col: 1,2,4,5) × (row: 3,4,5) 共 8 格（col 3 中間不是河）  
> 實際鬥獸棋河流：(1,3)(2,3)(1,4)(2,4)(1,5)(2,5)(4,3)(5,3)(4,4)(5,4)(4,5)(5,5)

### 3.3 棋子與等級

| 棋子 | 圖示 | 等級 | 特殊能力 |
|------|------|------|---------|
| 象（Elephant） | 🐘 | 8 | 無（不能吃鼠） |
| 獅（Lion） | 🦁 | 7 | 可跳河 |
| 虎（Tiger） | 🐯 | 6 | 可跳河 |
| 豹（Leopard） | 🐆 | 5 | 無 |
| 狼（Wolf） | 🐺 | 4 | 無 |
| 狗（Dog） | 🐕 | 3 | 無 |
| 貓（Cat） | 🐱 | 2 | 無 |
| 鼠（Rat） | 🐭 | 1 | 可進河、可吃象 |

### 3.4 移動規則

**基本移動：**
- 每回合移動一格（上、下、左、右），不可斜走
- 不能走進自己的獸穴

**跳河（獅、虎專屬）：**
- 獅與虎可從河邊直線跳躍整條河到對岸
- 若跳躍路徑上有「鼠」擋路，則無法跳越
- 跳河後落點必須合法（不能落在河中、不能落在己方棋子上）

**鼠的特殊規則：**
- 鼠是唯一可以進入河流格的棋子
- 鼠在河中時，**不能**吃河外的象（必須出河才能吃象）
- 鼠在河中時，**不能**被河外的任何棋子吃（需同在河中才能互吃）

**陷阱規則：**
- 進入敵方陷阱的棋子，等級視為 0（最弱），任何敵方棋子都能吃
- 己方陷阱對己方棋子無效

**吃子規則：**
- 高等級可吃低等級（等級數字大者為強）
- 等級相同可互吃
- 例外：鼠（等級 1）可吃象（等級 8）
- 例外：任何棋子在敵方陷阱內等級降為 0，可被任何敵方棋子吃

### 3.5 勝利條件

1. **佔領敵方獸穴**：任一棋子走入敵方獸穴，立即獲勝
2. **消滅對方所有棋子**：對方無棋可動，獲勝

---

## 4. UI／UX 設計規範

### 4.1 色彩系統

```css
:root {
  /* 主題色 - 自然叢林風 */
  --color-bg-primary:    #1a2e1a;  /* 深叢林綠 */
  --color-bg-secondary:  #2d4a2d;  /* 中叢林綠 */
  --color-bg-card:       #3d5c3a;  /* 卡片底色 */
  
  /* 棋盤色 */
  --color-board-light:   #c8a96e;  /* 棋盤淺格 */
  --color-board-dark:    #a07840;  /* 棋盤深格 */
  --color-board-river:   #4a90d4;  /* 河流藍 */
  --color-board-trap:    #8b0000;  /* 陷阱紅 */
  --color-board-den:     #ffd700;  /* 獸穴金 */
  
  /* 棋子色 */
  --color-piece-player:  #e84040;  /* 玩家（紅方） */
  --color-piece-ai:      #4040e8;  /* AI（藍方） */
  --color-piece-text:    #ffffff;  /* 棋子文字 */
  
  /* UI 互動色 */
  --color-selected:      #ffff00;  /* 選中高亮 */
  --color-movable:       rgba(255,255,0,0.4); /* 可移動格 */
  --color-danger:        rgba(255,0,0,0.3);   /* 可吃子格 */
  
  /* 文字色 */
  --color-text-primary:  #f0e6d0;  /* 主要文字 */
  --color-text-secondary:#b8a890;  /* 次要文字 */
  --color-text-accent:   #ffd700;  /* 強調金色 */
  
  /* 按鈕色 */
  --color-btn-primary:   #c8860a;  /* 主按鈕 */
  --color-btn-hover:     #e09a10;  /* 主按鈕懸停 */
  --color-btn-secondary: #4a6a3a;  /* 次按鈕 */
}
```

### 4.2 字體規範

```css
/* 標題字體 - 活潑中文裝飾 */
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+TC:wght@400;700;900&display=swap');

:root {
  --font-title:   'ZCOOL KuaiLe', 'Noto Sans TC', sans-serif;
  --font-body:    'Noto Sans TC', sans-serif;
  
  /* 字體大小 - 行動裝置基準 */
  --fs-hero:      clamp(36px, 8vw, 64px);   /* 主標題 */
  --fs-h1:        clamp(28px, 6vw, 48px);   /* 頁面標題 */
  --fs-h2:        clamp(22px, 4vw, 36px);   /* 區段標題 */
  --fs-body-lg:   clamp(18px, 3vw, 24px);   /* 大內文 */
  --fs-body:      clamp(16px, 2.5vw, 20px); /* 內文 */
  --fs-piece:     clamp(28px, 5vw, 40px);   /* 棋子圖示 */
  --fs-btn:       clamp(18px, 3.5vw, 24px); /* 按鈕文字 */
  --fs-small:     clamp(14px, 2vw, 16px);   /* 小字 */
}
```

### 4.3 間距系統

```css
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
  
  /* 棋盤格子大小 */
  --cell-size: clamp(40px, 11vw, 72px);
  --cell-gap:  clamp(2px, 0.5vw, 4px);
  
  /* 圓角 */
  --radius-sm:  8px;
  --radius-md:  16px;
  --radius-lg:  24px;
  --radius-full: 50%;
}
```

### 4.4 互動狀態規範

| 狀態 | 視覺效果 | 音效 |
|------|---------|------|
| 棋子懸停 | scale(1.08)，陰影增強 | 無 |
| 棋子選中 | 金色邊框脈衝動畫，格子高亮 | `select.wav` |
| 可移動格 | 半透明黃色覆蓋 + 點點動畫 | 無 |
| 可吃子格 | 半透明紅色覆蓋 + 閃爍 | 無 |
| 棋子移動 | 滑動動畫 200ms | `move.wav` |
| 吃子 | 爆炸粒子效果 | `capture.wav` |
| 跳河 | 弧線動畫軌跡 | `jump.wav` |
| AI 思考中 | 棋子閃爍 + 思考轉輪 | `thinking.wav`（低頻） |
| 勝利 | 全螢幕慶祝動畫 | `win.wav` |
| 失敗 | 灰暗過場 | `lose.wav` |
| 非法移動 | 紅色震動 | `error.wav` |

---

## 5. 畫面結構與流程

### 5.1 畫面列表

```
┌─────────────────────────────────┐
│          主畫面 (Home)           │  ← 預設進入點
├─────────────────────────────────┤
│         設定畫面 (Settings)      │  ← 從主畫面進入
├─────────────────────────────────┤
│    遊戲棋盤畫面 (Game Board)     │  ← 開始遊戲後
├─────────────────────────────────┤
│      勝負結果畫面 (Result)       │  ← 遊戲結束後
├─────────────────────────────────┤
│       規則說明畫面 (Rules)       │  ← 從主畫面進入
└─────────────────────────────────┘
```

### 5.2 畫面流程圖

```
[啟動] → [主畫面]
             │
    ┌────────┼──────────┬──────────┐
    ↓        ↓          ↓          ↓
[開始遊戲] [設定]    [規則說明] [排行榜]
    │        │          │
    ↓        ↓       [關閉]
[棋盤畫面] [儲存設定]
    │
    ↓（遊戲結束）
[結果畫面]
    │
    ├→ [再來一局] → [棋盤畫面]
    └→ [回主畫面] → [主畫面]
```

### 5.3 SPA 路由

使用 `hash routing` 管理畫面切換，不依賴後端：

```
#home      → 主畫面
#game      → 遊戲棋盤
#settings  → 設定
#rules     → 規則說明
#result    → 結果畫面
```

---

## 6. 主畫面規格

### 6.1 視覺佈局

```
┌─────────────────────────────────────┐
│                                     │
│      🌿  [動態粒子背景效果]  🌿     │
│                                     │
│   ╔═══════════════════════════╗    │
│   ║                           ║    │
│   ║    🐯  鬥  獸  棋  🐯    ║    │  ← 主標題 (--fs-hero)
│   ║      Jungle Chess         ║    │  ← 副標題 (--fs-h2)
│   ║                           ║    │
│   ╚═══════════════════════════╝    │
│                                     │
│      [🎮  開始遊戲]  ← 主按鈕      │  ← 字體 --fs-btn
│                                     │
│      [📖  遊戲規則]                │
│                                     │
│      [⚙️  遊戲設定]               │
│                                     │
│   🔊 音效 [●──────] 🎵 音樂 [●──] │  ← 快速音量控制
│                                     │
│         v1.0 · 單人 vs AI           │  ← 版本資訊小字
└─────────────────────────────────────┘
```

### 6.2 主畫面元件規格

#### 主標題

```
元件名稱：MainTitle
字體：--font-title (ZCOOL KuaiLe)
字體大小：--fs-hero
顏色：--color-text-accent (#ffd700)
效果：
  - 文字陰影：3px 3px 6px rgba(0,0,0,0.5)
  - 入場動畫：從上方滑入 (translateY(-50px) → 0)，持續 0.8s，ease-out
  - 呼吸光暈動畫：每 3s 循環，text-shadow 色澤變化
背景裝飾：棋盤花紋邊框（CSS border-image 或 SVG）
```

#### 主按鈕（開始遊戲）

```
元件名稱：PrimaryButton
寬度：min(320px, 80vw)
高度：clamp(56px, 12vw, 80px)
字體大小：--fs-btn
字體：--font-title
背景：線性漸層 from --color-btn-primary to #e8a020
圓角：--radius-md
效果：
  - 懸停：scale(1.04)，陰影擴大，背景亮化
  - 點擊：scale(0.96)，快速回彈
  - 入場動畫：延遲 0.3s，從下方淡入
音效：點擊時播放 click.wav
```

#### 次要按鈕（規則、設定）

```
元件名稱：SecondaryButton
寬度：同主按鈕
高度：clamp(48px, 10vw, 68px)
字體大小：clamp(16px, 3vw, 22px)
背景：半透明深綠 rgba(45,74,45,0.8)
邊框：1px solid rgba(200,169,110,0.5)
效果：懸停時邊框亮化，輕微 scale(1.02)
```

#### 音量快速控制

```
元件名稱：QuickVolumeControl
位置：主畫面底部
包含：
  - 音效開關（圖示按鈕，🔊/🔇）
  - 音效音量滑桿（range input，0-100）
  - 音樂開關（圖示按鈕，🎵/🔕）
  - 音樂音量滑桿（range input，0-100）
字體：--fs-small
```

### 6.3 主畫面背景效果

```
效果名稱：JungleParticleBackground
實作：Canvas API
粒子數量：30-50 個（依裝置效能調整）
粒子類型：隨機動物圖示 emoji（縮小版），漂浮移動
動畫：緩慢上浮，透明度循環變化 (0.1 ~ 0.4)
效能：使用 requestAnimationFrame，低電量裝置降級為靜態背景
```

---

## 7. 設定畫面規格

### 7.1 設定項目

```
┌─────────────────────────────────────┐
│  ← 返回    ⚙️ 遊戲設定              │
├─────────────────────────────────────┤
│                                     │
│  🤖 AI 難度                         │
│  ○ 簡單（Easy）   — AI 深度 2      │
│  ● 普通（Normal） — AI 深度 4      │
│  ○ 困難（Hard）   — AI 深度 6      │
│  ○ 專家（Expert） — AI 深度 8      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  🎨 棋子風格                         │
│  ● Emoji 圖示      ○ 中文文字       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  🌍 語言                             │
│  ● 繁體中文   ○ 简体中文   ○ EN     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  🔊 音效音量                         │
│  🔕 ──●──────────────── 🔊         │
│      0          50         100      │
│                                     │
│  🎵 背景音樂音量                     │
│  🔕 ────────●────────── 🔊         │
│      0          50         100      │
│                                     │
│  🎵 音樂主題                         │
│  ● 叢林風      ○ 傳統古琴   ○ 無   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  💡 輔助功能                         │
│  [✓] 顯示可移動格                   │
│  [✓] 顯示棋子等級                   │
│  [ ] 顯示座標                       │
│  [✓] AI 思考動畫                    │
│  [ ] 自動翻轉棋盤（玩家在下方）      │
│                                     │
├─────────────────────────────────────┤
│  [💾 儲存設定]      [↩️ 重設預設]   │
└─────────────────────────────────────┘
```

### 7.2 設定資料持久化

- 使用 `localStorage` 儲存所有設定
- Key：`jungleChess_settings`
- 格式：JSON 字串
- 每次變更自動儲存（無需點按儲存按鈕，儲存按鈕為明確確認）

### 7.3 設定預設值

```javascript
const DEFAULT_SETTINGS = {
  aiDifficulty: 'normal',    // 'easy' | 'normal' | 'hard' | 'expert'
  pieceStyle: 'emoji',       // 'emoji' | 'chinese'
  language: 'zh-TW',         // 'zh-TW' | 'zh-CN' | 'en'
  sfxVolume: 70,             // 0-100
  bgmVolume: 50,             // 0-100
  bgmTheme: 'jungle',        // 'jungle' | 'guqin' | 'none'
  showMovableSquares: true,
  showPieceRank: true,
  showCoordinates: false,
  showAIThinkAnimation: true,
  autoFlipBoard: true,
};
```

---

## 8. 遊戲棋盤規格

### 8.1 棋盤佈局

```
┌──────────────────────────────────────┐
│  🔵 AI（藍方）  ⬛⬛⬛⬛⬛⬛⬛⬛    │  ← 被吃棋子區
│  思考中... ⟳                         │  ← AI 狀態列
├──────────────────────────────────────┤
│                                      │
│   [7×9 棋盤格 Grid]                  │
│                                      │
│   每格顯示：                         │
│   - 地形圖示（河/陷阱/獸穴背景）     │
│   - 棋子（emoji + 等級數字）         │
│   - 選中狀態高亮                     │
│   - 可移動點示意                     │
│                                      │
├──────────────────────────────────────┤
│  🔴 你（紅方）  ⬛⬛⬛⬛⬛⬛⬛⬛    │  ← 被吃棋子區
│  你的回合                            │
├──────────────────────────────────────┤
│  [⏸ 暫停]  [↩ 悔棋]  [🏳 認輸]     │
└──────────────────────────────────────┘
```

### 8.2 棋盤格子規格

每個格子（`<div class="cell">`）規格：

| 屬性 | 規格 |
|------|------|
| 大小 | `--cell-size`（clamp 40-72px） |
| 圓角 | 4px |
| 地形背景 | 依地形類型套用色彩 |
| 棋子顯示 | flex 置中，emoji 字體大小 `--fs-piece` |
| 等級標籤 | 右下角小圓圈，字體 10-14px |
| 觸控目標 | 最小 44×44px（依 WCAG 標準） |

### 8.3 地形顯示

| 地形 | 背景色 | 圖示/標記 |
|------|--------|----------|
| 普通格 | 交替淺/深棕色 | 無 |
| 河流 | `--color-board-river` | 波紋 CSS 動畫 |
| 玩家陷阱 | 深紅半透明 | ⚠️ 小圖示 |
| AI 陷阱 | 深藍半透明 | ⚠️ 小圖示 |
| 玩家獸穴 | 金色漸層 | 🏠 圖示 |
| AI 獸穴 | 金色漸層 | 🏠 圖示 |

### 8.4 棋子元件規格

```html
<!-- 棋子 HTML 結構 -->
<div class="piece piece--player" 
     data-type="lion" 
     data-rank="7"
     data-col="0" 
     data-row="7"
     role="button"
     aria-label="獅子，等級7，位於A8">
  <span class="piece__icon">🦁</span>
  <span class="piece__rank">7</span>
</div>
```

```css
/* 棋子樣式 */
.piece {
  width: calc(var(--cell-size) * 0.82);
  height: calc(var(--cell-size) * 0.82);
  border-radius: var(--radius-full);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.piece--player {
  background: radial-gradient(circle, #f05050, #c02020);
  border: 2.5px solid #ff9090;
  box-shadow: 0 3px 10px rgba(200,0,0,0.4);
}

.piece--ai {
  background: radial-gradient(circle, #5070f0, #2030c0);
  border: 2.5px solid #9090ff;
  box-shadow: 0 3px 10px rgba(0,0,200,0.4);
}

.piece__icon {
  font-size: var(--fs-piece);
  line-height: 1;
}

.piece__rank {
  position: absolute;
  bottom: 1px;
  right: 2px;
  font-size: clamp(9px, 1.5vw, 12px);
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

/* 選中狀態 */
.piece--selected {
  animation: selectedPulse 0.8s ease-in-out infinite;
  border-color: var(--color-selected);
}

@keyframes selectedPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(255,255,0,0.6); }
  50%       { box-shadow: 0 0 0 8px rgba(255,255,0,0.2); }
}
```

### 8.5 狀態列規格

```
位置：棋盤上方（AI 狀態）與下方（玩家狀態）
高度：clamp(40px, 8vw, 56px)
顯示內容：
  - 玩家顏色圓點
  - 玩家名稱
  - 回合狀態文字
  - 計時器（可選）
  - 被吃子縮圖列表
```

### 8.6 操作按鈕列

```
位置：棋盤正下方
按鈕列表：
  [⏸ 暫停／繼續]  [↩ 悔棋（限玩家回合）]  [🏳 認輸]

按鈕規格：
  - 最小高度：44px
  - 字體大小：--fs-body-lg
  - 圓角：--radius-sm
  - 間距：--space-md

悔棋邏輯：
  - 撤回玩家上一步 + AI 上一步（共 2 步）
  - 每局最多可悔棋 3 次（設定可調整）
  - 悔棋次數顯示於按鈕旁
```

### 8.7 暫停選單

```
觸發：點擊暫停按鈕
覆蓋層：半透明黑色遮罩
選單項目：
  [▶ 繼續遊戲]
  [🔄 重新開始]
  [⚙ 設定]
  [🏠 返回主選單]
字體大小：--fs-btn
```

---

## 9. 音樂與音效規格

### 9.1 音訊架構

```javascript
// 音訊管理器
class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sfxVolume = 0.7;
    this.bgmVolume = 0.5;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.bgmSource = null;
    this.sfxBuffers = {};
  }
  
  // 延遲初始化（需用戶互動後才能啟動 AudioContext）
  async init() { ... }
  
  // 播放音效
  playSFX(name) { ... }
  
  // 播放背景音樂（循環）
  playBGM(theme) { ... }
  
  // 停止背景音樂
  stopBGM() { ... }
  
  // 音量控制
  setSFXVolume(vol) { ... }
  setBGMVolume(vol) { ... }
}
```

### 9.2 音效清單

所有音效使用 **Web Audio API 程式生成**（無需外部音效檔）：

| 音效 ID | 描述 | 觸發時機 | 波形類型 | 時長 |
|---------|------|---------|---------|------|
| `select` | 選取棋子 | 點擊棋子 | 正弦，短促高頻 | 0.1s |
| `move` | 移動棋子 | 棋子移動 | 鋸齒，中頻 | 0.2s |
| `capture` | 吃子 | 棋子被消滅 | 噪音 + 正弦疊加 | 0.4s |
| `jump` | 跳河 | 獅虎跳河 | 正弦，上升頻率 | 0.5s |
| `error` | 非法移動 | 移動不合規 | 方波，低沉 | 0.2s |
| `ai_move` | AI 移動 | AI 完成一步 | 正弦，稍低 | 0.15s |
| `win` | 勝利 | 玩家獲勝 | 和弦，歡快 | 1.5s |
| `lose` | 失敗 | 玩家失敗 | 單音，下降 | 1.0s |
| `click` | 按鈕點擊 | UI 按鈕 | 短促高頻 | 0.08s |
| `undo` | 悔棋 | 執行悔棋 | 倒放效果 | 0.3s |

#### 音效生成範例（Web Audio API）

```javascript
// 移動音效
function generateMoveSound(audioCtx) {
  const duration = 0.2;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    const freq = 440 + 200 * (1 - t / duration); // 下降頻率
    data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-5 * t);
  }
  return buffer;
}

// 吃子音效（爆炸感）
function generateCaptureSound(audioCtx) {
  const duration = 0.4;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    // 白噪音 + 低頻打擊
    const noise = Math.random() * 2 - 1;
    const hit = Math.sin(2 * Math.PI * 80 * t);
    data[i] = (noise * 0.6 + hit * 0.4) * Math.exp(-8 * t);
  }
  return buffer;
}
```

### 9.3 背景音樂規格

使用 Web Audio API **程式生成和弦序列**（不需外部 BGM 檔案）：

#### 叢林主題（jungle）

```
風格：輕鬆節奏感，帶有異域感
實作：OscillatorNode + 鼓點節拍器
和弦進行：Am - F - C - G（循環）
BPM：85
樂器模擬：
  - 主旋律：鋸齒波 Oscillator（類馬林巴琴）
  - 和弦伴奏：正弦波 Oscillator（類弦樂）
  - 打擊節奏：BufferSource（程式生成）
```

#### 傳統古琴主題（guqin）

```
風格：緩慢、沉穩，中國傳統風
實作：OscillatorNode + 包絡控制
和弦進行：五聲音階（Do Re Mi Sol La）循環
BPM：60
樂器模擬：
  - 主旋律：三角波（類古琴撥弦）
  - 泛音：正弦波，低音量
```

### 9.4 音訊初始化策略

```javascript
// 首次用戶互動後初始化 AudioContext（瀏覽器安全政策）
document.addEventListener('click', function initAudio() {
  audioManager.init();
  document.removeEventListener('click', initAudio);
}, { once: true });
```

---

## 10. AI 演算法規格

### 10.1 演算法概述

採用 **Minimax 演算法 + Alpha-Beta 剪枝 + 靜態局面評估函數**：

```
AI 決策流程：
1. 收集所有合法移動
2. 執行 Minimax 搜索（指定深度）
3. 套用 Alpha-Beta 剪枝減少搜索量
4. 評估葉節點局面分數
5. 回傳最佳移動
6. 在 Web Worker 中執行（避免 UI 卡頓）
```

### 10.2 搜索深度設定

| 難度 | 搜索深度 | 預計思考時間 |
|------|---------|------------|
| 簡單 | 2 | < 50ms |
| 普通 | 4 | < 200ms |
| 困難 | 6 | < 800ms |
| 專家 | 8 | 1-3s |

### 10.3 局面評估函數

```javascript
function evaluateBoard(board, playerColor) {
  let score = 0;
  
  // 1. 棋子價值
  const PIECE_VALUE = { 8:800, 7:700, 6:600, 5:500, 4:400, 3:300, 2:200, 1:150 };
  board.forEach(piece => {
    const val = PIECE_VALUE[piece.rank];
    score += (piece.color === playerColor) ? val : -val;
  });
  
  // 2. 位置價值（越靠近敵方獸穴越高）
  score += positionalBonus(board, playerColor);
  
  // 3. 威脅獸穴加分
  score += denThreatBonus(board, playerColor);
  
  // 4. 陷阱懲罰
  score += trapPenalty(board, playerColor);
  
  // 5. 機動性（可走步數越多越好）
  score += mobilityBonus(board, playerColor);
  
  return score;
}
```

#### 位置加成表（以玩家為紅方，AI 為藍方視角）

```javascript
// AI 棋子距離敵方獸穴越近，加分越多
function positionalBonus(board, aiColor) {
  let bonus = 0;
  board.filter(p => p.color === aiColor).forEach(piece => {
    const distToDen = Math.abs(piece.col - 3) + piece.row; // row 0 是 AI 的對面獸穴
    bonus += (9 - distToDen) * 15; // 最多 135 分
  });
  return bonus;
}
```

### 10.4 移動排序優化

Alpha-Beta 剪枝在好的移動排序下效果最佳，採用以下排序策略：

1. **吃子移動優先**（特別是吃高價值棋子）
2. **靠近對方獸穴的移動**
3. **跳河移動**
4. **普通移動**

### 10.5 Web Worker 整合

```javascript
// ai-worker.js
self.onmessage = function(e) {
  const { board, difficulty, playerColor } = e.data;
  const depth = DIFFICULTY_DEPTH[difficulty];
  const bestMove = minimax(board, depth, -Infinity, Infinity, true, playerColor);
  self.postMessage({ move: bestMove });
};

// 主執行緒
const aiWorker = new Worker('ai-worker.js');
aiWorker.postMessage({ board: currentBoard, difficulty, playerColor: 'blue' });
aiWorker.onmessage = (e) => applyMove(e.data.move);
```

> **注意**：單一 HTML 檔案中，Worker 使用 Blob URL 方式內嵌：
> ```javascript
> const workerCode = `/* AI 程式碼 */`;
> const blob = new Blob([workerCode], { type: 'application/javascript' });
> const worker = new Worker(URL.createObjectURL(blob));
> ```

### 10.6 簡單難度特殊處理

簡單難度加入**隨機性**，讓 AI 偶爾做出次優選擇：

```javascript
if (difficulty === 'easy') {
  // 30% 機率從前 3 個最佳移動中隨機選
  const topMoves = getMoves().slice(0, 3);
  if (Math.random() < 0.3) return topMoves[Math.floor(Math.random() * topMoves.length)];
}
```

---

## 11. 行動裝置響應式規格

### 11.1 斷點設計

```css
/* 手機：< 480px */
@media (max-width: 480px) {
  --cell-size: clamp(40px, 10.5vw, 48px);
  --fs-hero: 36px;
  --fs-btn: 18px;
  
  /* 棋盤全寬 */
  .board-wrapper { width: 100vw; overflow-x: auto; }
}

/* 平板：481px - 768px */
@media (min-width: 481px) and (max-width: 768px) {
  --cell-size: clamp(50px, 10vw, 60px);
  --fs-hero: 48px;
}

/* 桌機：> 769px */
@media (min-width: 769px) {
  --cell-size: 64px;
  --fs-hero: 64px;
}
```

### 11.2 觸控優化

| 優化項目 | 實作方式 |
|---------|---------|
| 最小觸控目標 | 所有可點擊元素 `min-width: 44px; min-height: 44px` |
| 防止縮放 | `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">` |
| 防止長按選取 | `user-select: none; -webkit-tap-highlight-color: transparent` |
| 觸控回饋 | 點擊即時視覺反應，0 延遲 |
| 滾動衝突 | 棋盤區域 `touch-action: none`，其他區域允許滾動 |

### 11.3 橫向（Landscape）模式

```
手機橫向時的特殊佈局：

[AI 狀態] [7×9 棋盤] [玩家狀態]
左側顯示 AI 資訊，棋盤置中，右側顯示玩家資訊
棋盤高度限制為 `95vh`，自動縮小格子大小

實作：
@media (orientation: landscape) and (max-height: 500px) {
  .game-layout { flex-direction: row; }
  --cell-size: clamp(36px, 9vh, 50px);
}
```

### 11.4 PWA 支援（可選）

```html
<!-- 加入 manifest.json 讓使用者可「加入主畫面」 -->
<link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="鬥獸棋">
<meta name="theme-color" content="#1a2e1a">
```

---

## 12. 資料結構定義

### 12.1 棋子（Piece）

```typescript
interface Piece {
  id: string;          // 唯一 ID，例如 'player_lion'
  type: PieceType;     // 'elephant'|'lion'|'tiger'|'leopard'|'wolf'|'dog'|'cat'|'rat'
  rank: number;        // 1-8
  color: 'red' | 'blue'; // red = 玩家, blue = AI
  col: number;         // 0-6
  row: number;         // 0-8
  isAlive: boolean;
  emoji: string;       // 顯示用 emoji
  chineseName: string; // 中文名稱
}
```

### 12.2 棋盤狀態（BoardState）

```typescript
interface BoardState {
  cells: (Piece | null)[][];  // [row][col]，7欄×9行
  currentTurn: 'red' | 'blue';
  gameStatus: 'idle' | 'playing' | 'paused' | 'ended';
  winner: 'red' | 'blue' | null;
  winReason: 'den' | 'annihilate' | 'surrender' | null;
  moveHistory: Move[];
  capturedPieces: { red: Piece[], blue: Piece[] };
  undoCount: number;  // 悔棋次數
}
```

### 12.3 移動（Move）

```typescript
interface Move {
  piece: Piece;
  fromCol: number;
  fromRow: number;
  toCol: number;
  toRow: number;
  capturedPiece: Piece | null;
  isJump: boolean;  // 是否為跳河
  timestamp: number;
}
```

### 12.4 格子地形（CellTerrain）

```typescript
type TerrainType = 'plain' | 'river' | 'trap_red' | 'trap_blue' | 'den_red' | 'den_blue';

interface Cell {
  col: number;
  row: number;
  terrain: TerrainType;
}
```

### 12.5 初始棋子位置

```javascript
const INITIAL_PIECES = [
  // 玩家（紅方）
  { type:'lion',    rank:7, color:'red',  col:6, row:8 },
  { type:'tiger',   rank:6, color:'red',  col:0, row:8 },
  { type:'dog',     rank:3, color:'red',  col:5, row:7 },
  { type:'cat',     rank:2, color:'red',  col:1, row:7 },
  { type:'rat',     rank:1, color:'red',  col:6, row:6 },
  { type:'leopard', rank:5, color:'red',  col:4, row:6 },
  { type:'wolf',    rank:4, color:'red',  col:2, row:6 },
  { type:'elephant',rank:8, color:'red',  col:0, row:6 },
  // AI（藍方）- 鏡像對稱
  { type:'lion',    rank:7, color:'blue', col:0, row:0 },
  { type:'tiger',   rank:6, color:'blue', col:6, row:0 },
  { type:'dog',     rank:3, color:'blue', col:1, row:1 },
  { type:'cat',     rank:2, color:'blue', col:5, row:1 },
  { type:'rat',     rank:1, color:'blue', col:0, row:2 },
  { type:'leopard', rank:5, color:'blue', col:2, row:2 },
  { type:'wolf',    rank:4, color:'blue', col:4, row:2 },
  { type:'elephant',rank:8, color:'blue', col:6, row:2 },
];
```

---

## 13. 狀態管理

### 13.1 狀態機

```
遊戲狀態：
IDLE → PLAYING → (PAUSED | ENDED)
  ↑         |
  └─────────┘ (重新開始)

回合狀態（PLAYING 中）：
PLAYER_TURN → (選棋) → PIECE_SELECTED → (移動) → AI_TURN
                                                    |
                                               AI_THINKING
                                                    |
                                              PLAYER_TURN
```

### 13.2 核心模組

```javascript
// 模組劃分
const GameEngine    = { /* 合法移動計算、勝負判定 */ };
const BoardRenderer = { /* DOM 渲染、動畫 */ };
const AIEngine      = { /* Minimax 決策 */ };
const AudioManager  = { /* 音效、BGM 控制 */ };
const SettingsStore = { /* localStorage 讀寫 */ };
const GameState     = { /* 全局狀態物件 */ };
const UIController  = { /* 畫面切換、UI 互動 */ };
```

---

## 14. 動畫與視覺效果

### 14.1 棋子移動動畫

```css
/* 使用 CSS transition 搭配 JS 動態更新 grid-column/row */
.piece {
  transition: 
    grid-column 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    grid-row    0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform   0.15s ease,
    opacity     0.2s ease;
}

/* 或使用 translate 動畫（性能更佳）*/
.piece--moving {
  animation: movePiece 0.25s ease forwards;
}
```

### 14.2 吃子特效

```javascript
// Canvas 粒子爆炸效果
function playCapturEffect(x, y) {
  const canvas = document.getElementById('effects-canvas');
  // 發射 20-30 個彩色粒子，向四周擴散，逐漸消散
  // 持續時間 0.5s
}
```

### 14.3 勝利動畫

```css
/* 勝利慶典動畫 */
@keyframes victoryBanner {
  0%   { transform: translateY(-100px); opacity: 0; }
  60%  { transform: translateY(10px); opacity: 1; }
  100% { transform: translateY(0); }
}

/* 五彩紙屑撒落（Canvas） */
/* 金色星光閃爍（CSS keyframes） */
```

### 14.4 河流動畫

```css
/* 河流波紋效果 */
.cell--river {
  background: linear-gradient(135deg, #4a90d4, #2a70b4);
  position: relative;
  overflow: hidden;
}

.cell--river::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.1) 10px,
    rgba(255,255,255,0.1) 20px
  );
  animation: riverFlow 2s linear infinite;
}

@keyframes riverFlow {
  from { transform: translateX(0); }
  to   { transform: translateX(20px); }
}
```

### 14.5 AI 思考動畫

```css
/* 思考中的棋子動畫 */
.piece--thinking {
  animation: thinking 1s ease-in-out infinite;
}

@keyframes thinking {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.95); }
}

/* 思考轉圈指示器 */
.thinking-spinner { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

---

## 15. 無障礙設計

### 15.1 鍵盤操作支援

| 按鍵 | 功能 |
|------|------|
| `Tab` / `Shift+Tab` | 在棋子間移動焦點 |
| `Enter` / `Space` | 選取棋子／執行移動 |
| `Escape` | 取消選取／關閉選單 |
| `Arrow Keys` | 移動焦點格（4 方向） |
| `U` | 悔棋（玩家回合） |
| `P` | 暫停／繼續 |

### 15.2 螢幕閱讀器支援

```html
<!-- 棋盤 ARIA 標籤 -->
<div role="grid" aria-label="鬥獸棋棋盤，7欄9行">
  <div role="row" aria-label="第1行">
    <div role="gridcell" aria-label="A1，河流格，空" tabindex="-1">
    </div>
  </div>
</div>

<!-- 狀態播報 -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="game-announcer">
  <!-- 動態更新：「獅子移動到 C4」「你的回合」「你獲勝了！」 -->
</div>
```

### 15.3 對比度要求

- 棋子文字對比度 ≥ 4.5:1（WCAG AA）
- 按鈕文字對比度 ≥ 4.5:1
- 狀態文字對比度 ≥ 3:1（大字體）

---

## 16. 測試要點

### 16.1 遊戲邏輯測試

- [ ] 所有 8 種棋子的移動合法性驗證
- [ ] 鼠進河流 / 出河流邏輯
- [ ] 獅虎跳河（含鼠擋路阻止跳越）
- [ ] 陷阱降等效果
- [ ] 獸穴進入判定（含己方不能入）
- [ ] 吃子規則（含鼠吃象特例）
- [ ] 勝利條件觸發（佔穴、殲滅）
- [ ] 悔棋正確還原狀態

### 16.2 AI 行為測試

- [ ] AI 不走入己方獸穴
- [ ] AI 在所有難度下能正確終局
- [ ] AI 搜索不超過設定深度
- [ ] 簡單難度隨機性行為正確

### 16.3 UI 測試

- [ ] 主畫面在 375px 寬度不水平滾動
- [ ] 棋盤在所有斷點正確顯示
- [ ] 橫向模式棋盤可見
- [ ] 所有按鈕最小 44px
- [ ] 音效在用戶互動後正確播放
- [ ] 設定儲存後重新整理頁面維持

### 16.4 效能指標

| 指標 | 目標 |
|------|------|
| 首次載入 FCP | < 1.5s |
| 棋子移動渲染 | 60fps |
| AI 普通難度回應 | < 500ms |
| 記憶體使用 | < 50MB |

---

## 17. 檔案結構

### 17.1 單一 HTML 輸出結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <!-- meta、viewport、title -->
  <!-- Google Fonts 連結 -->
  <style>
    /* === CSS 變數定義 === */
    /* === 全域樣式 === */
    /* === 主畫面樣式 === */
    /* === 設定畫面樣式 === */
    /* === 棋盤樣式 === */
    /* === 棋子樣式 === */
    /* === 動畫定義 === */
    /* === 響應式樣式 === */
    /* === 無障礙輔助樣式 === */
  </style>
</head>
<body>
  <!-- 粒子背景 Canvas -->
  <canvas id="bg-canvas"></canvas>
  
  <!-- 特效 Canvas -->
  <canvas id="effects-canvas"></canvas>
  
  <!-- 畫面容器 -->
  <div id="app">
    <!-- #home 主畫面 -->
    <section id="screen-home" class="screen active">...</section>
    
    <!-- #settings 設定畫面 -->
    <section id="screen-settings" class="screen">...</section>
    
    <!-- #rules 規則畫面 -->
    <section id="screen-rules" class="screen">...</section>
    
    <!-- #game 遊戲棋盤 -->
    <section id="screen-game" class="screen">...</section>
    
    <!-- #result 結果畫面 -->
    <section id="screen-result" class="screen">...</section>
  </div>
  
  <!-- 螢幕閱讀器播報區 -->
  <div id="game-announcer" aria-live="polite" class="sr-only"></div>
  
  <script>
    /* === 工具函數 === */
    /* === 設定管理（SettingsStore）=== */
    /* === 音訊管理（AudioManager）=== */
    /* === 遊戲引擎（GameEngine）=== */
    /* === AI 引擎（Worker Blob）=== */
    /* === 棋盤渲染（BoardRenderer）=== */
    /* === UI 控制器（UIController）=== */
    /* === 初始化 === */
  </script>
</body>
</html>
```

### 17.2 開發階段多檔結構（可選）

```
jungle-chess/
├── index.html              # 主入口
├── css/
│   ├── variables.css       # CSS 變數
│   ├── base.css            # 全域樣式
│   ├── screens.css         # 各畫面樣式
│   ├── board.css           # 棋盤樣式
│   └── animations.css      # 動畫定義
├── js/
│   ├── main.js             # 初始化
│   ├── settings.js         # 設定管理
│   ├── audio.js            # 音訊管理
│   ├── game-engine.js      # 遊戲邏輯
│   ├── ai-worker.js        # AI Web Worker
│   ├── board-renderer.js   # 棋盤渲染
│   └── ui-controller.js    # UI 控制
└── build.sh                # 打包成單一 index.html 的腳本
```

---

## 附錄 A：多語系字串對照表

| Key | 繁體中文 | 简体中文 | English |
|-----|---------|---------|---------|
| `title` | 鬥獸棋 | 斗兽棋 | Jungle Chess |
| `start_game` | 開始遊戲 | 开始游戏 | Start Game |
| `settings` | 遊戲設定 | 游戏设置 | Settings |
| `rules` | 遊戲規則 | 游戏规则 | Rules |
| `your_turn` | 你的回合 | 你的回合 | Your Turn |
| `ai_thinking` | AI 思考中... | AI 思考中... | AI Thinking... |
| `you_win` | 你獲勝了！🎉 | 你赢了！🎉 | You Win! 🎉 |
| `you_lose` | 你輸了... | 你输了... | You Lose... |
| `undo` | 悔棋 | 悔棋 | Undo |
| `surrender` | 認輸 | 认输 | Surrender |
| `pause` | 暫停 | 暂停 | Pause |
| `resume` | 繼續 | 继续 | Resume |
| `restart` | 重新開始 | 重新开始 | Restart |

---

## 附錄 B：棋子圖示對照表

| 棋子 | Emoji 模式 | 中文模式 | 英文縮寫 |
|------|-----------|---------|---------|
| 象 | 🐘 | 象 | E |
| 獅 | 🦁 | 獅 | L |
| 虎 | 🐯 | 虎 | T |
| 豹 | 🐆 | 豹 | P |
| 狼 | 🐺 | 狼 | W |
| 狗 | 🐕 | 狗 | D |
| 貓 | 🐱 | 貓 | C |
| 鼠 | 🐭 | 鼠 | R |

---

*本規格書版本 v1.0，如有修訂請更新版本號與日期。*
