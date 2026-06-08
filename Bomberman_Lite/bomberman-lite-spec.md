# 💣 Bomberman Lite（炸彈超人）遊戲規格書

> **版本**：v1.0.0　｜　**日期**：2026-06-08　｜　**平台**：純前端（無需伺服器）

---

## 目錄

1. [專案總覽](#1-專案總覽)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [RWD 響應式設計](#4-rwd-響應式設計)
5. [配色主題系統](#5-配色主題系統)
6. [字體規範](#6-字體規範)
7. [主畫面功能](#7-主畫面功能)
8. [遊戲核心機制](#8-遊戲核心機制)
9. [音樂與音效系統](#9-音樂與音效系統)
10. [關卡設計（1～25 關）](#10-關卡設計125-關)
11. [UI 元件規範](#11-ui-元件規範)
12. [資料儲存（LocalStorage）](#12-資料儲存localstorage)
13. [效能與最佳化](#13-效能與最佳化)
14. [開發里程碑](#14-開發里程碑)

---

## 1. 專案總覽

### 1.1 目標

製作一款能在瀏覽器中直接執行、無需任何建置流程或後端伺服器的 **Bomberman Lite** 遊戲。玩家只需雙擊 `index.html` 即可遊玩，支援桌面及行動裝置。

### 1.2 核心特色

| 特色 | 說明 |
|------|------|
| 零安裝 | 直接開啟 `index.html`，無需 Node.js / npm / build step |
| 全響應式 | 支援手機、平板、桌機，虛擬搖桿供行動裝置使用 |
| 25 關卡 | 從入門到挑戰，難度線性遞增 |
| 豐富音效 | 16 種音效 + 3 首背景音樂，使用 Web Audio API 合成 |
| 多主題配色 | 6 套顏色主題可即時切換 |
| 存檔系統 | 使用 `localStorage` 儲存進度、設定、最高分 |

---

## 2. 技術架構

### 2.1 技術選型

```
語言：HTML5 + CSS3 + Vanilla JavaScript（ES6+）
音效：Web Audio API（程式合成，無需外部音檔）
儲存：localStorage
字體：Google Fonts CDN（含 fallback）
圖形：Canvas API（遊戲主畫面）+ CSS（UI）
```

> ⚠️ **不使用任何第三方框架（React / Vue / jQuery）**，確保無需建置即可執行。

### 2.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13.1+ |
| Edge | 80+ |
| iOS Safari | 13.4+ |
| Android Chrome | 80+ |

### 2.3 外部依賴（CDN，可離線 fallback）

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;900&display=swap" rel="stylesheet">
```

若 CDN 不可用，fallback 字體為系統等寬字體。

---

## 3. 資料夾結構

```
bomberman-lite/
│
├── index.html                  # 遊戲入口，僅負責引入資源
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（主題色、間距、字體大小）
│   │   └── typography.css      # 字體定義、大小規範
│   │
│   ├── layout/
│   │   ├── responsive.css      # 媒體查詢、斷點設定
│   │   └── grid.css            # 版型格線系統
│   │
│   ├── components/
│   │   ├── buttons.css         # 按鈕樣式（主按鈕、次按鈕、危險按鈕）
│   │   ├── modal.css           # 彈出視窗（說明、設定、暫停）
│   │   ├── hud.css             # 遊戲中 HUD（生命、炸彈、計時器）
│   │   ├── menu.css            # 主選單樣式
│   │   ├── joystick.css        # 行動裝置虛擬搖桿
│   │   └── notification.css    # 通知提示（撿到道具、關卡完成等）
│   │
│   ├── screens/
│   │   ├── main-menu.css       # 主畫面
│   │   ├── game.css            # 遊戲畫面（Canvas 容器）
│   │   ├── level-select.css    # 關卡選擇畫面
│   │   ├── settings.css        # 設定畫面
│   │   └── game-over.css       # 遊戲結束畫面
│   │
│   └── themes/
│       ├── theme-classic.css   # 經典主題（橘紅）
│       ├── theme-neon.css      # 霓虹主題（青紫）
│       ├── theme-forest.css    # 森林主題（綠棕）
│       ├── theme-ocean.css     # 海洋主題（藍白）
│       ├── theme-volcano.css   # 火山主題（紅黑）
│       └── theme-candy.css     # 糖果主題（粉彩）
│
├── js/
│   ├── core/
│   │   ├── Game.js             # 遊戲主控制器（狀態機）
│   │   ├── GameLoop.js         # requestAnimationFrame 遊戲迴圈
│   │   ├── EventBus.js         # 事件匯流排（發佈/訂閱）
│   │   └── StateManager.js     # 畫面狀態管理（menu/game/settings…）
│   │
│   ├── entities/
│   │   ├── Player.js           # 玩家實體（移動、放炸彈、受傷）
│   │   ├── Enemy.js            # 敵人基礎類別
│   │   ├── EnemyAI.js          # 敵人 AI（尋路、行為樹）
│   │   ├── Bomb.js             # 炸彈實體（倒數、爆炸範圍）
│   │   ├── Explosion.js        # 爆炸效果實體
│   │   └── PowerUp.js          # 道具實體
│   │
│   ├── map/
│   │   ├── TileMap.js          # 地圖資料結構（二維陣列）
│   │   ├── TileRenderer.js     # Canvas 繪製地圖格
│   │   ├── CollisionDetector.js # 碰撞偵測
│   │   └── LevelLoader.js      # 載入關卡資料
│   │
│   ├── levels/
│   │   ├── levels-01-05.js     # 第 1～5 關關卡資料
│   │   ├── levels-06-10.js     # 第 6～10 關關卡資料
│   │   ├── levels-11-15.js     # 第 11～15 關關卡資料
│   │   ├── levels-16-20.js     # 第 16～20 關關卡資料
│   │   └── levels-21-25.js     # 第 21～25 關關卡資料
│   │
│   ├── audio/
│   │   ├── AudioEngine.js      # Web Audio API 封裝（Context、Gain、Master）
│   │   ├── SoundEffects.js     # 16 種音效合成函式
│   │   ├── MusicPlayer.js      # 背景音樂播放器（循環、淡入淡出）
│   │   └── AudioAssets.js      # 音效/音樂參數定義
│   │
│   ├── ui/
│   │   ├── MainMenu.js         # 主選單邏輯
│   │   ├── HUD.js              # 遊戲中 UI 更新
│   │   ├── Modal.js            # 彈出視窗控制
│   │   ├── Settings.js         # 設定面板邏輯
│   │   ├── VirtualJoystick.js  # 虛擬搖桿（Touch Events）
│   │   ├── LevelSelect.js      # 關卡選擇
│   │   └── Notification.js     # 浮動通知訊息
│   │
│   ├── input/
│   │   ├── KeyboardInput.js    # 鍵盤輸入處理
│   │   ├── TouchInput.js       # 觸控輸入處理
│   │   └── InputManager.js     # 統一輸入介面（鍵盤 + 觸控）
│   │
│   ├── storage/
│   │   └── SaveManager.js      # localStorage 讀寫（存檔、設定、分數）
│   │
│   └── utils/
│       ├── helpers.js          # 通用工具函式（random、clamp、lerp…）
│       ├── constants.js        # 全域常數（TILE_SIZE、FPS、MAX_BOMBS…）
│       └── animator.js         # CSS / Canvas 動畫輔助
│
└── assets/
    ├── favicon.ico             # 網站圖示
    └── screenshots/            # README 截圖（選用）
```

---

## 4. RWD 響應式設計

### 4.1 斷點定義

```css
/* css/base/variables.css */
:root {
  --bp-mobile:  480px;
  --bp-tablet:  768px;
  --bp-desktop: 1024px;
  --bp-wide:    1440px;
}
```

| 裝置類型 | 寬度範圍 | Canvas 尺寸 | 格子大小 |
|---------|---------|------------|---------|
| 手機（直向） | < 480px | 全寬 × 自動 | 32px |
| 手機（橫向） | 480–767px | 視口高度自適應 | 36px |
| 平板 | 768–1023px | 600×500px | 40px |
| 桌機 | 1024–1439px | 780×620px | 48px |
| 寬螢幕 | ≥ 1440px | 960×720px | 56px |

### 4.2 行動裝置虛擬搖桿

```
┌─────────────────────────────────┐
│  ┌─── Canvas 遊戲畫面 ───────┐  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                  │
│  ╔═════════╗     ╔══╗  ╔══╗    │
│  ║  方向   ║     ║💣║  ║⏸║    │
│  ║ 搖桿盤  ║     ╚══╝  ╚══╝    │
│  ╚═════════╝                    │
└─────────────────────────────────┘
```

- **方向搖桿**：左側圓形觸控區，支援 8 方向
- **放炸彈鈕**：右下角大型按鈕（💣）
- **暫停鈕**：右上角小型按鈕（⏸）
- 按鈕最小觸控面積 **44×44px**（符合 WCAG 2.1 建議）

### 4.3 Canvas 自適應縮放

```javascript
// js/core/Game.js
function resizeCanvas() {
  const container = document.getElementById('game-container');
  const { width, height } = container.getBoundingClientRect();
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = 'top left';
}
window.addEventListener('resize', debounce(resizeCanvas, 150));
```

---

## 5. 配色主題系統

### 5.1 主題清單

| 主題 ID | 主題名稱 | 主色 | 背景色 | 強調色 | 適用情境 |
|--------|--------|------|--------|--------|---------|
| `classic` | 🔥 經典火焰 | `#FF6B35` | `#1A1A2E` | `#FFD700` | 預設 |
| `neon` | ⚡ 霓虹電路 | `#00F5FF` | `#0D0D1A` | `#FF00FF` | 夜間 |
| `forest` | 🌲 森林迷宮 | `#4CAF50` | `#1B2C1B` | `#CDDC39` | 自然 |
| `ocean` | 🌊 深海冒險 | `#29B6F6` | `#0A1628` | `#00E5FF` | 清涼 |
| `volcano` | 🌋 火山地獄 | `#FF1744` | `#0D0000` | `#FF6D00` | 困難關卡 |
| `candy` | 🍭 糖果樂園 | `#E91E63` | `#FFF8E1` | `#9C27B0` | 輕鬆 |

### 5.2 CSS 變數定義範例

```css
/* css/themes/theme-classic.css */
[data-theme="classic"] {
  --color-primary:       #FF6B35;
  --color-primary-dark:  #D4500A;
  --color-primary-light: #FF9A6C;
  --color-bg:            #1A1A2E;
  --color-bg-card:       #16213E;
  --color-bg-surface:    #0F3460;
  --color-accent:        #FFD700;
  --color-accent-glow:   rgba(255, 215, 0, 0.4);
  --color-text:          #FFFFFF;
  --color-text-muted:    #A0A0B8;
  --color-danger:        #FF4444;
  --color-success:       #4CAF50;
  --color-wall-hard:     #5C5C5C;
  --color-wall-soft:     #8B4513;
  --color-floor:         #2C2C3E;
  --color-bomb:          #222222;
  --color-explosion:     #FF6B35;
  --color-player:        #00BCD4;
  --color-enemy:         #F44336;
}
```

### 5.3 主題切換機制

```javascript
// js/ui/Settings.js
function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  SaveManager.set('theme', themeId);
  AudioEngine.play('sfx_ui_click');
}
```

---

## 6. 字體規範

### 6.1 字體選用

| 用途 | 字體 | 備用字體 | 字重 |
|------|------|---------|------|
| 遊戲標題、分數 | `Press Start 2P` | `monospace` | 400 |
| 選單標題 | `Nunito` | `Arial Rounded MT Bold` | 900 |
| 一般文字、說明 | `Nunito` | `Arial` | 700 |

### 6.2 字體大小規範（Mobile First）

```css
/* css/base/typography.css */
:root {
  --fs-title:    clamp(2rem,   6vw, 4rem);    /* 主標題 */
  --fs-subtitle: clamp(1.5rem, 4vw, 2.5rem);  /* 副標題 */
  --fs-heading:  clamp(1.2rem, 3vw, 2rem);    /* 區塊標題 */
  --fs-body:     clamp(1rem,   2.5vw, 1.5rem);/* 內文 */
  --fs-label:    clamp(0.9rem, 2vw, 1.2rem);  /* 標籤 */
  --fs-score:    clamp(1.5rem, 4vw, 3rem);    /* 分數顯示 */
  --fs-hud:      clamp(0.8rem, 2vw, 1.1rem);  /* HUD 數值 */
}
```

> ✅ 所有字體最小不低於 **14px**，HUD 等密集區域不低於 **12px**。

---

## 7. 主畫面功能

### 7.1 畫面佈局

```
╔══════════════════════════════════════╗
║   🔥 BOMBERMAN LITE 炸彈超人 💣      ║  ← 標題（Press Start 2P，動態閃爍）
║   ════════════════════════════════   ║
║                                      ║
║   ┌──────────────────────────────┐   ║
║   │   ▶  開始遊戲 (NEW GAME)    │   ║  ← 主按鈕
║   └──────────────────────────────┘   ║
║   ┌──────────────────────────────┐   ║
║   │   ↺  繼續遊戲 (CONTINUE)    │   ║  ← 若無存檔則灰階 disabled
║   └──────────────────────────────┘   ║
║   ┌──────────────────────────────┐   ║
║   │   📖  說    明 (HOW TO PLAY)│   ║
║   └──────────────────────────────┘   ║
║   ┌──────────────────────────────┐   ║
║   │   ⚙  設    定 (SETTINGS)    │   ║
║   └──────────────────────────────┘   ║
║                                      ║
║   Best Score: 99,999  Stage: 25/25   ║  ← 底部統計（小字）
╚══════════════════════════════════════╝
```

### 7.2 各功能說明

#### 7.2.1 開始遊戲（NEW GAME）

- 點擊後顯示確認對話框（若已有存檔）：「確定要從第 1 關重新開始？」
- 清除舊存檔，從第 1 關開始
- 播放音效：`sfx_ui_start`
- 背景音樂切換為：`bgm_game_easy`（淡入）

#### 7.2.2 繼續遊戲（CONTINUE）

- 從 `localStorage` 讀取最後一次儲存的關卡與狀態
- 若無存檔，按鈕呈現灰色且不可點擊，hover 顯示 tooltip「尚無存檔記錄」
- 播放音效：`sfx_ui_resume`
- 背景音樂依據關卡難度選擇對應 BGM

#### 7.2.3 說明（HOW TO PLAY）

以 Modal 彈出，分頁式說明：

**頁面 1：基本操作**
```
鍵盤：
  ↑ ↓ ← →  /  WASD  移動
  Space / Z      放置炸彈
  Esc / P        暫停遊戲

行動裝置：
  左側搖桿   移動
  💣 按鈕   放置炸彈
  ⏸ 按鈕   暫停遊戲
```

**頁面 2：遊戲規則**
- 使用炸彈炸毀所有敵人才能過關
- 炸彈爆炸會擴散至上下左右（依據炸彈升級等級）
- 軟牆（磚塊）可被炸毀，硬牆（鋼鐵）不可破壞
- 炸毀軟牆有機率出現道具

**頁面 3：道具說明**

| 圖示 | 道具名稱 | 效果 |
|------|---------|------|
| 💣 | 炸彈+1 | 最大可放炸彈數 +1 |
| 🔥 | 火焰升級 | 爆炸範圍 +1 格 |
| 👟 | 加速靴 | 移動速度 +20% |
| 🛡 | 護盾 | 本關免疫一次傷害 |
| ⏱ | 時間+30 | 倒數計時 +30 秒 |
| 💥 | 穿牆炸彈 | 爆炸穿透軟牆 |
| ❤️ | 加命 | 生命 +1（最多 5 條） |
| 🌀 | 遙控炸彈 | 手動引爆炸彈（本關有效） |

**頁面 4：敵人種類**

| 名稱 | 顏色 | 速度 | 智力 | 出現關卡 |
|------|------|------|------|---------|
| Balloom | 紫 | 慢 | 無 | 1+ |
| Oneal | 紅 | 中 | 追蹤玩家 | 3+ |
| Doll | 黃 | 中 | 避開炸彈 | 7+ |
| Minvo | 綠 | 快 | 追蹤+避炸 | 12+ |
| Kondoria | 藍 | 極慢 | 穿牆 | 16+ |
| Ovape | 橘 | 快 | 追蹤+穿牆 | 20+ |
| Boss | 紅金 | 變速 | 全能 AI | 25 |

#### 7.2.4 設定（SETTINGS）

以 Modal 彈出，包含以下選項：

```
┌─────────────────────────────────────┐
│  ⚙  設定                            │
├─────────────────────────────────────┤
│  🎵 背景音樂音量        [========] │ ← Range Slider 0–100
│  🔊 音效音量            [========] │ ← Range Slider 0–100
│                                     │
│  🎨 顏色主題                        │
│  [🔥經典] [⚡霓虹] [🌲森林]         │
│  [🌊海洋] [🌋火山] [🍭糖果]         │
│                                     │
│  🎮 控制方式                        │
│  ○ 方向鍵     ● WASD                │
│                                     │
│  📱 行動裝置                        │
│  ☑ 顯示虛擬搖桿                     │
│  ☑ 觸控震動回饋                     │
│                                     │
│  🌐 語言  [繁中 ▼]                  │
│                                     │
│  [儲存設定]              [關閉]      │
└─────────────────────────────────────┘
```

---

## 8. 遊戲核心機制

### 8.1 地圖格式

地圖以二維陣列表示，每個格子為一個 tile 值：

```javascript
const TILE = {
  FLOOR:    0,  // 空地（可行走）
  WALL:     1,  // 硬牆（不可破壞）
  BRICK:    2,  // 軟牆（可炸毀）
  BOMB:     3,  // 炸彈（動態）
  FLAME:    4,  // 爆炸火焰（動態）
  POWERUP:  5,  // 道具（隱藏在軟牆下）
  EXIT:     6,  // 出口（隱藏在軟牆下）
};
```

標準地圖大小：**15 × 13**（寬 × 高），外圍固定為硬牆。

### 8.2 遊戲狀態機

```
          ┌──────────┐
          │  MENU    │
          └────┬─────┘
               │ NEW / CONTINUE
          ┌────▼─────┐
     ┌───►│ PLAYING  │◄──────┐
     │    └────┬─────┘       │
     │ RESUME  │ ESC/P      RETRY
     │    ┌────▼─────┐       │
     │    │  PAUSED  │       │
     │    └──────────┘       │
     │                       │
     │    ┌──────────┐       │
     └────┤ LEVEL UP │       │
          └──────────┘       │
                             │
          ┌──────────┐       │
          │ GAME OVER├───────┘
          └────┬─────┘
               │ MENU
          ┌────▼─────┐
          │  MENU    │
          └──────────┘
```

### 8.3 物理與碰撞

```javascript
// js/map/CollisionDetector.js

// 格子對齊（Tile Snapping）：玩家移動基於格子，允許半格誤差
const SNAP_TOLERANCE = 0.4; // 格子寬度的 40% 可以穿越

// 碰撞矩形（AABB）
function checkCollision(entityA, entityB) {
  return (
    entityA.x < entityB.x + entityB.w &&
    entityA.x + entityA.w > entityB.x &&
    entityA.y < entityB.y + entityB.h &&
    entityA.y + entityA.h > entityB.y
  );
}
```

### 8.4 炸彈機制

```javascript
// js/entities/Bomb.js
const BOMB_CONFIG = {
  fuseTime:    2500,   // ms，引爆倒數時間
  flameLife:   600,    // ms，火焰持續時間
  baseRange:   1,      // 初始爆炸範圍（格數）
  maxRange:    8,      // 最大爆炸範圍
  maxBombs:    1,      // 初始最大同時炸彈數
  chainDelay:  100,    // ms，連鎖爆炸延遲
};
```

爆炸傳播規則：
1. 從炸彈位置向四方延伸
2. 遇到**硬牆**立即停止
3. 遇到**軟牆**炸毀後停止（可能掉落道具/出口）
4. 遇到**另一顆炸彈**觸發連鎖爆炸
5. 遇到**敵人**造成傷害
6. 遇到**玩家**扣除生命

### 8.5 敵人 AI

```javascript
// js/entities/EnemyAI.js

// AI 行為等級
const AI_LEVEL = {
  RANDOM:        0,  // 隨機移動（Balloom）
  CHASE:         1,  // 追蹤玩家（Oneal）
  AVOID_BOMB:    2,  // 追蹤 + 避開炸彈（Doll）
  SMART:         3,  // 路徑規劃（Minvo）
  PHASE:         4,  // 穿牆（Kondoria）
  SUPER:         5,  // 全能（Boss）
};

// 尋路：使用 BFS（廣度優先搜尋）
function findPath(start, goal, map) { ... }
```

### 8.6 計分系統

```javascript
const SCORE = {
  enemy_basic:    100,
  enemy_medium:   300,
  enemy_fast:     500,
  enemy_smart:    800,
  enemy_phase:   1200,
  enemy_super:   2000,
  boss:         10000,
  time_bonus:      10,  // 每剩餘 1 秒 × 10 分
  powerup_collect: 50,
  clear_stage:    500,
};
```

---

## 9. 音樂與音效系統

### 9.1 架構設計

```javascript
// js/audio/AudioEngine.js
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();  // 主音量
    this.sfxBus    = this.ctx.createGain();   // 音效通道
    this.bgmBus    = this.ctx.createGain();   // 音樂通道
    // sfxBus → masterGain → destination
    // bgmBus → masterGain → destination
  }
}
```

> 📌 Web Audio API 需使用者互動後才能啟動（瀏覽器政策），在第一次點擊時呼叫 `ctx.resume()`。

### 9.2 背景音樂（BGM）

| ID | 名稱 | 風格 | 使用畫面 | 循環 | 淡入/淡出 |
|----|------|------|---------|------|---------|
| `bgm_menu` | 主選單旋律 | 8-bit 輕快 | 主選單 | ✅ | 1.5s |
| `bgm_game_easy` | 冒險前進 | 輕快節奏 | 第 1–10 關 | ✅ | 1.0s |
| `bgm_game_hard` | 緊張對決 | 快節奏緊繃 | 第 11–24 關 | ✅ | 1.0s |
| `bgm_boss` | Boss 戰鬥 | 高壓史詩 | 第 25 關 | ✅ | 0.5s |

**畫面切換音樂規則：**
- 主選單 → 遊戲：BGM 淡出後淡入新曲
- 遊戲中暫停：BGM **繼續播放**（不停止）
- 遊戲 → 主選單：淡出遊戲 BGM，淡入主選單 BGM
- 關卡 1–10 完成後進入 11 關：自動切換 BGM
- 返回主選單：恢復主選單 BGM

```javascript
// js/audio/MusicPlayer.js
async function switchBGM(newTrackId, fadeTime = 1000) {
  await fadeOut(currentTrack, fadeTime / 2);
  currentTrack = newTrackId;
  await fadeIn(currentTrack, fadeTime / 2);
}
```

### 9.3 音效清單（16 種）

| # | ID | 觸發時機 | 合成方式 |
|---|----|---------|---------| 
| 1 | `sfx_bomb_place` | 放置炸彈 | 低頻 click + reverb |
| 2 | `sfx_bomb_tick` | 炸彈倒數滴答聲 | 短脈衝音 × 4次 |
| 3 | `sfx_explosion` | 炸彈爆炸 | 白雜訊 + 低頻爆破 |
| 4 | `sfx_explosion_chain` | 連鎖爆炸 | 多層爆炸疊加 |
| 5 | `sfx_player_walk` | 玩家移動 | 輕微腳步聲 |
| 6 | `sfx_player_die` | 玩家死亡 | 下滑音效 + 爆炸 |
| 7 | `sfx_enemy_die` | 敵人死亡 | 高頻消散音 |
| 8 | `sfx_powerup_pickup` | 撿取道具 | 上升音效 + 閃光音 |
| 9 | `sfx_brick_destroy` | 軟牆被炸 | 碎裂音效 |
| 10 | `sfx_stage_clear` | 關卡通關 | 歡呼 fanfare |
| 11 | `sfx_stage_start` | 關卡開始 | 開場 jingle |
| 12 | `sfx_game_over` | 遊戲結束 | 悲傷下行音階 |
| 13 | `sfx_ui_click` | UI 點擊 | 清脆 click |
| 14 | `sfx_ui_start` | 開始遊戲 | 啟動 jingle |
| 15 | `sfx_ui_resume` | 繼續遊戲 | 恢復音效 |
| 16 | `sfx_boss_appear` | Boss 出現 | 威脅性低頻轟鳴 |

### 9.4 音效合成範例

```javascript
// js/audio/SoundEffects.js（以爆炸音效為例）
function sfx_explosion(ctx, gainBus) {
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

  source.connect(filter);
  filter.connect(gainBus);
  source.start();
}
```

---

## 10. 關卡設計（1～25 關）

### 10.1 難度分級

| 難度段 | 關卡 | 敵人數 | 軟牆比例 | 時間限制 | 特色 |
|-------|------|--------|---------|---------|------|
| 🟢 入門 | 1–5 | 1–3 | 40% | 無限制 | 單一敵人、開放地圖 |
| 🔵 初級 | 6–10 | 3–5 | 45% | 180s | 追蹤型敵人登場 |
| 🟡 中級 | 11–15 | 4–6 | 50% | 150s | 閃避型敵人、多種道具 |
| 🟠 高級 | 16–20 | 5–8 | 55% | 120s | 穿牆敵人、複雜地形 |
| 🔴 地獄 | 21–24 | 6–9 | 60% | 90s | 混合型敵人、陷阱地圖 |
| ☠️ Boss | 25 | Boss×1 | 30% | 120s | Boss 戰、特殊機制 |

### 10.2 逐關設計

#### 第 1 關｜歡迎來到炸彈世界

```
地圖：15×13，軟牆密度 35%
敵人：Balloom × 1（右下角）
道具：炸彈+1（固定位置）
目標：炸掉 1 隻 Balloom
特色：無時間壓力，教學性質，大量空曠空間
```

#### 第 2 關｜初試身手

```
地圖：15×13，軟牆密度 38%
敵人：Balloom × 2
道具：火焰升級 × 1
目標：全滅 2 隻 Balloom
```

#### 第 3 關｜追逐開始

```
地圖：15×13，軟牆密度 40%
敵人：Balloom × 2 + Oneal × 1（初次登場！）
道具：加速靴、炸彈+1
目標：全滅 3 隻敵人
特色：Oneal 開始追蹤玩家，提醒玩家需提防
```

#### 第 4 關｜多線作戰

```
敵人：Oneal × 2 + Balloom × 1
道具：護盾 × 1
特色：敵人分布兩側包夾
```

#### 第 5 關｜第一道試煉

```
敵人：Oneal × 3
道具：火焰升級 × 2、加速靴
時間限制：無
特色：高軟牆密度，需要計畫性放炸彈
出口：隱藏在角落軟牆下
```

#### 第 6 關｜蜂擁而至

```
時間限制：180 秒
敵人：Oneal × 2 + Balloom × 2
道具：炸彈+1、時間+30
特色：時間壓力首次出現
```

#### 第 7 關｜聰明的敵人

```
敵人：Doll × 2 + Oneal × 1（Doll 登場！）
道具：遙控炸彈（首次出現）
特色：Doll 會躲避炸彈，需要利用遙控炸彈
```

#### 第 8 關｜連鎖反應

```
敵人：Doll × 2 + Oneal × 2
地圖：設計有促進連鎖爆炸的布局
特色：鼓勵玩家利用連鎖爆炸一次消滅多個敵人
```

#### 第 9 關｜迷宮碎形

```
敵人：Doll × 3 + Balloom × 2
地圖：高軟牆密度的迷宮型地圖
特色：需要邊開路邊消滅敵人
```

#### 第 10 關｜第一個里程碑

```
時間限制：180 秒
敵人：Doll × 2 + Oneal × 2 + Balloom × 2
地圖：特殊「十字型」走廊設計
特色：關卡完成後播放 fanfare，顯示第 1-10 關成績統計
BGM：過關後切換為 bgm_game_hard
```

#### 第 11 關｜速度狂魔

```
時間限制：150 秒
敵人：Minvo × 1 + Doll × 2（Minvo 登場！）
特色：Minvo 移動速度快，需要快速反應
```

#### 第 12 關｜四面埋伏

```
敵人：Minvo × 2 + Oneal × 2
地圖：中央開放型，敵人從四角出現
特色：需要快速清場
```

#### 第 13 關｜道具大豐收

```
敵人：Minvo × 2 + Doll × 2
道具：大量道具藏在軟牆中（6–8 種）
特色：玩家需要在危機中搶奪道具
```

#### 第 14 關｜穿牆預告

```
敵人：Minvo × 3 + Doll × 1
地圖：通道型設計（窄走廊）
特色：預示下個階段的穿牆敵人
```

#### 第 15 關｜中途大挑戰

```
時間限制：150 秒
敵人：Minvo × 2 + Doll × 2 + Oneal × 2
特色：每隔 30 秒增加一隻 Minvo
```

#### 第 16 關｜幽靈來了

```
時間限制：120 秒
敵人：Kondoria × 1 + Minvo × 2（Kondoria 登場！）
特色：Kondoria 穿牆移動，完全無法用炸彈阻擋其路徑
對策：在空曠地直接引爆炸彈，不能依賴角落躲避
```

#### 第 17 關｜恐懼蔓延

```
敵人：Kondoria × 2 + Doll × 2
地圖：密集軟牆，玩家需要快速開路
```

#### 第 18 關｜複合威脅

```
敵人：Kondoria × 1 + Minvo × 2 + Oneal × 2
特色：多種 AI 行為混合，需要同時應對
```

#### 第 19 關｜速殺或被殺

```
時間限制：120 秒
敵人：Minvo × 3 + Kondoria × 2
特色：高壓時間，需要精準操作
```

#### 第 20 關｜高級考驗

```
時間限制：120 秒
敵人：Ovape × 1 + Kondoria × 1 + Minvo × 2（Ovape 登場！）
特色：Ovape 兼具高速與穿牆，最危險的普通敵人
```

#### 第 21 關｜煉獄入口

```
時間限制：90 秒
敵人：Ovape × 2 + Minvo × 2 + Doll × 1
地圖：複雜迷宮型，出口在地圖深處
```

#### 第 22 關｜無盡壓力

```
時間限制：90 秒
敵人：Ovape × 2 + Kondoria × 2 + Minvo × 1
特色：每 20 秒召喚 1 隻 Balloom（加速版）
```

#### 第 23 關｜混沌地帶

```
時間限制：90 秒
敵人：全種類敵人各 1 隻（除 Boss）共 6 隻
地圖：隨機生成（種子固定）
特色：需要臨機應變
```

#### 第 24 關｜最後的守門人

```
時間限制：90 秒
敵人：Ovape × 3 + Kondoria × 2 + Minvo × 2
地圖：特殊「環形」設計
道具：所有種類道具出現機率提高
特色：通關後自動存檔，準備迎戰 Boss
```

#### 第 25 關｜終極 Boss 決戰 ☠️

```
BGM：bgm_boss（切換時音效 sfx_boss_appear）
時間限制：120 秒
Boss：Daemon（惡魔王）× 1

Boss 屬性：
  - 最大生命：5（需要炸 5 次）
  - 速度：隨生命減少而加快
  - 行為：
    Phase 1（HP 5–4）：隨機移動 + 穿牆
    Phase 2（HP 3–2）：追蹤玩家 + 穿牆 + 每 15 秒召喚 Minvo × 2
    Phase 3（HP 1）  ：全速追蹤 + 穿牆 + 定期衝刺

地圖：寬敞 Boss 房（移除大部分軟牆），四個角落有固定道具箱

勝利條件：Boss HP 歸零
失敗條件：玩家生命歸零 或 時間到

通關演出：
  - 爆炸特效環繞 Boss
  - 「CONGRATULATIONS！」字幕
  - 播放 sfx_stage_clear 加長版
  - 顯示全關卡統計與評分（S/A/B/C）
  - 提示「再玩一次」可挑戰更高分
```

### 10.3 過關評分標準

| 評分 | 條件 |
|------|------|
| S | 無死亡 + 剩餘時間 > 50% + 全收道具 |
| A | 死亡 ≤ 1 + 剩餘時間 > 30% |
| B | 死亡 ≤ 2 + 時間不為 0 |
| C | 通關即可 |

---

## 11. UI 元件規範

### 11.1 按鈕系統

```css
/* css/components/buttons.css */

/* 主按鈕 */
.btn-primary {
  font-family: var(--font-display);
  font-size: var(--fs-body);
  padding: 1em 2em;
  border-radius: 8px;
  background: var(--color-primary);
  color: var(--color-text);
  border: 3px solid var(--color-accent);
  box-shadow: 0 4px 0 var(--color-primary-dark);
  transition: transform 0.1s, box-shadow 0.1s;
  cursor: pointer;
  min-width: 240px;
  text-align: center;
  letter-spacing: 0.05em;
}

.btn-primary:hover  { transform: translateY(-2px); }
.btn-primary:active { transform: translateY(2px); box-shadow: none; }

/* 禁用狀態 */
.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}
```

### 11.2 HUD 佈局

```
╔════════════════════════════════╗
║ ❤️ × 3  💣 × 2  🔥 × 3        ║  ← 玩家狀態（左）
║                    ⏱ 01:45    ║  ← 計時器（右）
║               Stage 12/25     ║  ← 關卡進度（中）
║                  Score 48,200 ║  ← 分數（右下）
╚════════════════════════════════╝
```

### 11.3 通知系統

```javascript
// js/ui/Notification.js
// 撿取道具時顯示浮動通知
showNotification({
  text: '🔥 火焰升級！',
  color: '#FF6B35',
  duration: 1500,
  position: 'top-center',
  animation: 'float-up',
});
```

---

## 12. 資料儲存（LocalStorage）

### 12.1 資料結構

```javascript
// js/storage/SaveManager.js

const SAVE_KEYS = {
  GAME_SAVE:    'bml_save',      // 遊戲進度
  SETTINGS:     'bml_settings',  // 遊戲設定
  HIGH_SCORES:  'bml_scores',    // 高分榜
  ACHIEVEMENTS: 'bml_achiev',    // 成就（選用）
};

// 存檔格式
const gameSave = {
  stage:       12,           // 當前關卡
  lives:       3,            // 剩餘生命
  score:       24800,        // 當前分數
  powerups: {                // 已持有道具等級
    bombCount: 2,
    fireRange: 3,
    speed:     1,
    shield:    false,
    remoteCtrl: false,
  },
  timestamp:   1748390400000 // 儲存時間戳
};

// 設定格式
const settings = {
  bgmVolume:   80,           // 0–100
  sfxVolume:   90,           // 0–100
  theme:       'classic',    // 主題 ID
  controls:    'arrow',      // 'arrow' | 'wasd'
  showJoystick: true,        // 是否顯示虛擬搖桿
  vibration:   true,         // 觸控震動
  language:    'zh-TW',      // 語言
};
```

### 12.2 自動存檔時機

- 每關過關後自動儲存
- 玩家主動暫停時提示儲存
- 關閉視窗前自動存檔（`beforeunload` 事件）

---

## 13. 效能與最佳化

### 13.1 Canvas 渲染最佳化

```javascript
// 只重繪有變動的區域（Dirty Rectangle）
function partialRedraw(changedTiles) {
  changedTiles.forEach(({ x, y }) => {
    ctx.clearRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    drawTile(ctx, x, y);
  });
}

// 使用 OffscreenCanvas 預渲染靜態地圖層
const staticLayer = new OffscreenCanvas(MAP_W, MAP_H);
```

### 13.2 遊戲迴圈

```javascript
// js/core/GameLoop.js
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

function gameLoop(timestamp) {
  const delta = Math.min(timestamp - lastTime, FRAME_TIME * 3); // 限制最大 delta
  lastTime = timestamp;

  update(delta);   // 更新物理、AI
  render();        // 繪製畫面

  requestAnimationFrame(gameLoop);
}
```

### 13.3 行動裝置最佳化

- 禁止預設觸控行為（`touch-action: none` 在 Canvas 上）
- 使用 `passive: false` 的觸控事件監聽器
- 減少 Canvas 解析度（devicePixelRatio 上限為 2）
- 音效在初次觸碰後才初始化 AudioContext

---

## 14. 開發里程碑

| 里程碑 | 工作項目 | 預估時間 |
|--------|---------|---------|
| M1 | 專案結構建立、CSS 系統、主選單 UI | 3 天 |
| M2 | Canvas 渲染、地圖系統、玩家移動 | 4 天 |
| M3 | 炸彈機制、爆炸系統、碰撞偵測 | 3 天 |
| M4 | 敵人 AI（全種類）、計分系統 | 4 天 |
| M5 | 道具系統、25 關卡資料 | 3 天 |
| M6 | Web Audio API 音效合成（16 種） | 3 天 |
| M7 | 背景音樂、BGM 切換系統 | 2 天 |
| M8 | 行動裝置虛擬搖桿、RWD 適配 | 2 天 |
| M9 | 存檔系統、設定、主題切換 | 2 天 |
| M10 | Boss 關卡、通關演出、UI 精修 | 3 天 |
| M11 | 全裝置測試、效能調校、Bug 修復 | 3 天 |
| **總計** | | **約 32 天** |

---

## 附錄：index.html 引入範例

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="classic">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>💣 Bomberman Lite</title>
  <link rel="icon" href="assets/favicon.ico">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;900&display=swap" rel="stylesheet">

  <!-- CSS Base -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">

  <!-- CSS Layout -->
  <link rel="stylesheet" href="css/layout/grid.css">
  <link rel="stylesheet" href="css/layout/responsive.css">

  <!-- CSS Components -->
  <link rel="stylesheet" href="css/components/buttons.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/hud.css">
  <link rel="stylesheet" href="css/components/menu.css">
  <link rel="stylesheet" href="css/components/joystick.css">
  <link rel="stylesheet" href="css/components/notification.css">

  <!-- CSS Screens -->
  <link rel="stylesheet" href="css/screens/main-menu.css">
  <link rel="stylesheet" href="css/screens/game.css">
  <link rel="stylesheet" href="css/screens/level-select.css">
  <link rel="stylesheet" href="css/screens/settings.css">
  <link rel="stylesheet" href="css/screens/game-over.css">

  <!-- CSS Themes (全部載入，由 data-theme 屬性切換) -->
  <link rel="stylesheet" href="css/themes/theme-classic.css">
  <link rel="stylesheet" href="css/themes/theme-neon.css">
  <link rel="stylesheet" href="css/themes/theme-forest.css">
  <link rel="stylesheet" href="css/themes/theme-ocean.css">
  <link rel="stylesheet" href="css/themes/theme-volcano.css">
  <link rel="stylesheet" href="css/themes/theme-candy.css">
</head>
<body>
  <div id="app">
    <!-- 各畫面由 StateManager 控制顯示/隱藏 -->
    <div id="screen-menu"   class="screen"></div>
    <div id="screen-game"   class="screen hidden"></div>
    <div id="screen-settings" class="screen hidden"></div>
    <div id="screen-gameover" class="screen hidden"></div>
    <!-- Modal 層 -->
    <div id="modal-overlay" class="hidden"></div>
    <div id="modal-content" class="hidden"></div>
    <!-- 通知層 -->
    <div id="notification-layer"></div>
  </div>

  <!-- JavaScript（模組化引入，順序不可任意更改） -->
  <!-- Utils & Constants -->
  <script src="js/utils/constants.js"></script>
  <script src="js/utils/helpers.js"></script>
  <script src="js/utils/animator.js"></script>

  <!-- Core -->
  <script src="js/core/EventBus.js"></script>
  <script src="js/storage/SaveManager.js"></script>
  <script src="js/core/StateManager.js"></script>

  <!-- Audio -->
  <script src="js/audio/AudioEngine.js"></script>
  <script src="js/audio/AudioAssets.js"></script>
  <script src="js/audio/SoundEffects.js"></script>
  <script src="js/audio/MusicPlayer.js"></script>

  <!-- Input -->
  <script src="js/input/KeyboardInput.js"></script>
  <script src="js/input/TouchInput.js"></script>
  <script src="js/input/InputManager.js"></script>

  <!-- Map & Levels -->
  <script src="js/map/TileMap.js"></script>
  <script src="js/map/TileRenderer.js"></script>
  <script src="js/map/CollisionDetector.js"></script>
  <script src="js/map/LevelLoader.js"></script>
  <script src="js/levels/levels-01-05.js"></script>
  <script src="js/levels/levels-06-10.js"></script>
  <script src="js/levels/levels-11-15.js"></script>
  <script src="js/levels/levels-16-20.js"></script>
  <script src="js/levels/levels-21-25.js"></script>

  <!-- Entities -->
  <script src="js/entities/PowerUp.js"></script>
  <script src="js/entities/Explosion.js"></script>
  <script src="js/entities/Bomb.js"></script>
  <script src="js/entities/EnemyAI.js"></script>
  <script src="js/entities/Enemy.js"></script>
  <script src="js/entities/Player.js"></script>

  <!-- UI -->
  <script src="js/ui/Notification.js"></script>
  <script src="js/ui/Modal.js"></script>
  <script src="js/ui/HUD.js"></script>
  <script src="js/ui/VirtualJoystick.js"></script>
  <script src="js/ui/Settings.js"></script>
  <script src="js/ui/LevelSelect.js"></script>
  <script src="js/ui/MainMenu.js"></script>

  <!-- Game Core（最後載入） -->
  <script src="js/core/GameLoop.js"></script>
  <script src="js/core/Game.js"></script>
</body>
</html>
```

---

*本規格書由 Bomberman Lite 開發團隊制定，版權所有。如有修改需通知相關開發人員。*
