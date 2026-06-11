# 🚀 Asteroids 小行星遊戲 — 完整規格書

> **版本：** v1.0.0  
> **最後更新：** 2026-06-11  
> **技術棧：** 純前端 HTML5 + CSS3 + Vanilla JavaScript（無需任何建置工具或伺服器）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [檔案結構](#2-檔案結構)
3. [技術規格](#3-技術規格)
4. [遊戲設計規格](#4-遊戲設計規格)
5. [畫面與功能規格](#5-畫面與功能規格)
6. [音效系統規格](#6-音效系統規格)
7. [RWD 響應式設計規格](#7-rwd-響應式設計規格)
8. [行動裝置操控規格](#8-行動裝置操控規格)
9. [視覺設計規格](#9-視覺設計規格)
10. [設定系統規格](#10-設定系統規格)
11. [儲存與進度系統](#11-儲存與進度系統)
12. [效能規格](#12-效能規格)
13. [模組說明索引](#13-模組說明索引)

---

## 1. 專案概覽

### 1.1 專案目標

重現經典街機遊戲 Asteroids（1979, Atari），並加入現代化 UI、RWD 支援、豐富音效、多彩配色主題，以及完整的行動裝置觸控操控介面，讓玩家在任何裝置上都能流暢遊玩。

### 1.2 核心原則

| 原則 | 說明 |
|------|------|
| **零依賴** | 不引入任何 npm 套件或框架，純 HTML + CSS + JS |
| **即開即玩** | 雙擊 `index.html` 即可啟動，無需 server 或 build |
| **響應式優先** | 行動裝置與桌機同等體驗，操控不遮擋畫面 |
| **聲音豐富** | 超過 14 種音效，背景音樂跨畫面持續播放 |
| **主題多元** | 5 種色彩主題，大字體清晰易讀 |

### 1.3 支援裝置

- **桌機 / 筆電：** Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- **行動裝置：** iOS Safari 14+、Android Chrome 90+
- **最小螢幕寬度：** 320px

---

## 2. 檔案結構

```
asteroids/
│
├── index.html                  # 主入口，引入所有 CSS/JS
│
├── assets/                     # 靜態資源
│   ├── fonts/                  # 自訂字體（Web Font）
│   │   └── README.md           # 字體來源說明（Google Fonts CDN 引入）
│   │
│   ├── sounds/                 # 音效與音樂
│   │   ├── bgm/                # 背景音樂
│   │   │   ├── menu_bgm.ogg
│   │   │   ├── game_bgm.ogg
│   │   │   └── gameover_bgm.ogg
│   │   └── sfx/                # 音效
│   │       ├── shoot.ogg
│   │       ├── shoot_rapid.ogg
│   │       ├── asteroid_explode_large.ogg
│   │       ├── asteroid_explode_medium.ogg
│   │       ├── asteroid_explode_small.ogg
│   │       ├── ship_thrust.ogg
│   │       ├── ship_explode.ogg
│   │       ├── ship_respawn.ogg
│   │       ├── level_up.ogg
│   │       ├── extra_life.ogg
│   │       ├── powerup_collect.ogg
│   │       ├── shield_activate.ogg
│   │       ├── shield_hit.ogg
│   │       ├── warp.ogg
│   │       └── ui_click.ogg
│   │
│   └── images/                 # 圖示與圖形（SVG 優先）
│       ├── favicon.svg
│       └── icons/
│           ├── ship.svg
│           ├── asteroid.svg
│           └── star.svg
│
├── css/                        # 樣式表（按功能分類）
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（主題、字體、間距）
│   │   └── typography.css      # 全域字體規則
│   │
│   ├── themes/
│   │   ├── theme-neon.css      # 霓虹主題（預設）
│   │   ├── theme-retro.css     # 復古橘主題
│   │   ├── theme-aurora.css    # 極光主題
│   │   ├── theme-crimson.css   # 緋紅主題
│   │   └── theme-glacier.css   # 冰川主題
│   │
│   ├── layout/
│   │   ├── screens.css         # 畫面切換、z-index 層級
│   │   └── responsive.css      # RWD 斷點與媒體查詢
│   │
│   ├── components/
│   │   ├── buttons.css         # 按鈕樣式
│   │   ├── hud.css             # 遊戲抬頭顯示器（HUD）
│   │   ├── modal.css           # 彈出視窗（說明、設定）
│   │   ├── mobile-controls.css # 行動裝置虛擬搖桿與按鈕
│   │   └── notifications.css   # 分數彈出通知、升關提示
│   │
│   └── screens/
│       ├── main-menu.css       # 主選單畫面
│       ├── game.css            # 遊戲畫面
│       ├── pause.css           # 暫停畫面
│       ├── gameover.css        # 結束畫面
│       ├── highscore.css       # 排行榜畫面
│       └── settings.css        # 設定畫面
│
└── js/                         # JavaScript（按功能分類）
    ├── core/
    │   ├── main.js             # 進入點，初始化所有模組
    │   ├── gameLoop.js         # requestAnimationFrame 主迴圈
    │   ├── stateManager.js     # 全域遊戲狀態管理（FSM）
    │   └── eventBus.js         # 事件匯流排（publish/subscribe）
    │
    ├── entities/
    │   ├── ship.js             # 玩家飛船物件與行為
    │   ├── asteroid.js         # 小行星物件與碎裂邏輯
    │   ├── bullet.js           # 子彈物件
    │   ├── particle.js         # 粒子爆炸效果
    │   ├── powerup.js          # 道具物件（護盾、快速射擊等）
    │   └── entityManager.js    # 統一管理所有遊戲物件
    │
    ├── systems/
    │   ├── physics.js          # 物理計算（速度、碰撞、邊界環繞）
    │   ├── collision.js        # 碰撞偵測（圓形 AABB）
    │   ├── renderer.js         # Canvas 繪圖管理
    │   ├── input.js            # 鍵盤輸入管理
    │   ├── touchInput.js       # 觸控輸入管理（行動裝置）
    │   ├── levelManager.js     # 關卡進度、難度縮放
    │   ├── scoreManager.js     # 分數計算、連擊系統
    │   └── starfield.js        # 視差星空背景
    │
    ├── audio/
    │   ├── audioManager.js     # 音效與 BGM 統一管理
    │   ├── sfxPlayer.js        # 音效播放器（Web Audio API）
    │   └── bgmPlayer.js        # 背景音樂播放器（跨畫面持續）
    │
    ├── ui/
    │   ├── screenManager.js    # 畫面切換動畫管理
    │   ├── hud.js              # HUD 更新（生命、分數、關卡）
    │   ├── mainMenu.js         # 主選單互動邏輯
    │   ├── settingsUI.js       # 設定介面邏輯
    │   ├── pauseMenu.js        # 暫停選單邏輯
    │   ├── gameOverScreen.js   # 結束畫面邏輯
    │   ├── highscoreUI.js      # 排行榜介面邏輯
    │   └── mobileControls.js  # 行動裝置按鈕 UI 邏輯
    │
    ├── storage/
    │   ├── saveManager.js      # localStorage 存讀管理
    │   └── settingsStore.js    # 設定持久化
    │
    └── utils/
        ├── math.js             # 數學工具（向量、角度、插值）
        ├── objectPool.js       # 物件池（子彈、粒子複用）
        ├── themeManager.js     # 主題切換管理
        └── constants.js        # 全域常數定義
```

---

## 3. 技術規格

### 3.1 index.html 引入結構

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="neon">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>🚀 ASTEROIDS</title>
  <link rel="icon" href="assets/images/favicon.svg" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;800&display=swap" rel="stylesheet" />

  <!-- Base CSS -->
  <link rel="stylesheet" href="css/base/reset.css" />
  <link rel="stylesheet" href="css/base/variables.css" />
  <link rel="stylesheet" href="css/base/typography.css" />

  <!-- Themes -->
  <link rel="stylesheet" href="css/themes/theme-neon.css" />
  <link rel="stylesheet" href="css/themes/theme-retro.css" />
  <link rel="stylesheet" href="css/themes/theme-aurora.css" />
  <link rel="stylesheet" href="css/themes/theme-crimson.css" />
  <link rel="stylesheet" href="css/themes/theme-glacier.css" />

  <!-- Layout -->
  <link rel="stylesheet" href="css/layout/screens.css" />
  <link rel="stylesheet" href="css/layout/responsive.css" />

  <!-- Components -->
  <link rel="stylesheet" href="css/components/buttons.css" />
  <link rel="stylesheet" href="css/components/hud.css" />
  <link rel="stylesheet" href="css/components/modal.css" />
  <link rel="stylesheet" href="css/components/mobile-controls.css" />
  <link rel="stylesheet" href="css/components/notifications.css" />

  <!-- Screens -->
  <link rel="stylesheet" href="css/screens/main-menu.css" />
  <link rel="stylesheet" href="css/screens/game.css" />
  <link rel="stylesheet" href="css/screens/pause.css" />
  <link rel="stylesheet" href="css/screens/gameover.css" />
  <link rel="stylesheet" href="css/screens/highscore.css" />
  <link rel="stylesheet" href="css/screens/settings.css" />
</head>
<body>
  <!-- 畫面容器 -->
  <div id="app">
    <div id="screen-main-menu" class="screen active">...</div>
    <div id="screen-game" class="screen">...</div>
    <div id="screen-pause" class="screen">...</div>
    <div id="screen-gameover" class="screen">...</div>
    <div id="screen-highscore" class="screen">...</div>
    <div id="screen-settings" class="screen">...</div>
  </div>

  <!-- 音效 Audio Elements（靜音初始化，由 JS 控制）-->
  <audio id="bgm-menu" src="assets/sounds/bgm/menu_bgm.ogg" loop preload="auto"></audio>
  <audio id="bgm-game" src="assets/sounds/bgm/game_bgm.ogg" loop preload="auto"></audio>
  <audio id="bgm-gameover" src="assets/sounds/bgm/gameover_bgm.ogg" preload="auto"></audio>

  <!-- JavaScript Modules（defer 確保 DOM 就緒後執行）-->
  <!-- Utils -->
  <script src="js/utils/constants.js" defer></script>
  <script src="js/utils/math.js" defer></script>
  <script src="js/utils/objectPool.js" defer></script>
  <script src="js/utils/themeManager.js" defer></script>

  <!-- Core -->
  <script src="js/core/eventBus.js" defer></script>
  <script src="js/core/stateManager.js" defer></script>

  <!-- Storage -->
  <script src="js/storage/settingsStore.js" defer></script>
  <script src="js/storage/saveManager.js" defer></script>

  <!-- Audio -->
  <script src="js/audio/sfxPlayer.js" defer></script>
  <script src="js/audio/bgmPlayer.js" defer></script>
  <script src="js/audio/audioManager.js" defer></script>

  <!-- Entities -->
  <script src="js/entities/particle.js" defer></script>
  <script src="js/entities/bullet.js" defer></script>
  <script src="js/entities/powerup.js" defer></script>
  <script src="js/entities/asteroid.js" defer></script>
  <script src="js/entities/ship.js" defer></script>
  <script src="js/entities/entityManager.js" defer></script>

  <!-- Systems -->
  <script src="js/systems/starfield.js" defer></script>
  <script src="js/systems/physics.js" defer></script>
  <script src="js/systems/collision.js" defer></script>
  <script src="js/systems/renderer.js" defer></script>
  <script src="js/systems/input.js" defer></script>
  <script src="js/systems/touchInput.js" defer></script>
  <script src="js/systems/levelManager.js" defer></script>
  <script src="js/systems/scoreManager.js" defer></script>

  <!-- UI -->
  <script src="js/ui/screenManager.js" defer></script>
  <script src="js/ui/hud.js" defer></script>
  <script src="js/ui/mainMenu.js" defer></script>
  <script src="js/ui/settingsUI.js" defer></script>
  <script src="js/ui/pauseMenu.js" defer></script>
  <script src="js/ui/gameOverScreen.js" defer></script>
  <script src="js/ui/highscoreUI.js" defer></script>
  <script src="js/ui/mobileControls.js" defer></script>

  <!-- Core Game Loop（最後載入）-->
  <script src="js/core/gameLoop.js" defer></script>
  <script src="js/core/main.js" defer></script>
</body>
</html>
```

### 3.2 CSS 自訂屬性架構（variables.css）

```css
:root {
  /* === 字體 === */
  --font-display: 'Orbitron', sans-serif;   /* 標題、分數、Logo */
  --font-body:    'Exo 2', sans-serif;       /* 說明文字、UI */

  --font-size-xs:    1rem;      /* 16px 最小字體 */
  --font-size-sm:    1.25rem;   /* 20px */
  --font-size-md:    1.5rem;    /* 24px */
  --font-size-lg:    2rem;      /* 32px */
  --font-size-xl:    2.5rem;    /* 40px */
  --font-size-2xl:   3rem;      /* 48px */
  --font-size-hero:  4.5rem;    /* 72px 遊戲標題 */

  /* === 間距 === */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;

  /* === 動畫 === */
  --transition-fast:   150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow:   600ms ease;
  --transition-screen: 500ms cubic-bezier(0.4, 0, 0.2, 1);

  /* === 圓角 === */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  16px;
  --radius-full: 9999px;

  /* === 遊戲 Canvas === */
  --canvas-max-width:  1200px;
  --canvas-max-height: 800px;
}
```

---

## 4. 遊戲設計規格

### 4.1 核心遊玩規則

| 項目 | 規格 |
|------|------|
| **畫面環繞** | 飛船/子彈/小行星超出邊界時從對面重新出現（Wrap-around） |
| **小行星碎裂** | 大 → 中 × 2 → 小 × 2 → 消失（3 個尺寸） |
| **初始生命** | 3 條（可在設定中調整 2–5） |
| **初始小行星** | 第 1 關 4 個，每關 +1，上限 12 個 |
| **分數加乘** | 連擊系統（3 秒內連殺 × 倍率 1.5x → 2x → 3x） |
| **無敵時間** | 飛船死亡後重生有 3 秒閃爍無敵 |
| **道具系統** | 每摧毀 20 個小行星隨機掉落一個道具 |

### 4.2 分數規則

| 目標 | 基礎分數 |
|------|---------|
| 大型小行星 | 20 分 |
| 中型小行星 | 50 分 |
| 小型小行星 | 100 分 |
| UFO（小型） | 1000 分 |
| UFO（大型） | 200 分 |

> 額外獲得生命：每 10,000 分

### 4.3 飛船物理

```
最大速度:         800 px/s
推進加速度:       400 px/s²
旋轉速度:         240 度/s
摩擦力（衰減）:   0.985（每幀乘算）
子彈速度:         900 px/s
子彈存活時間:     1.5 秒
射擊冷卻時間:     0.18 秒
超空間傳送冷卻:   5 秒（隨機位置，有 10% 自爆風險）
```

### 4.4 道具（Power-up）種類

| 道具名稱 | 圖示顏色 | 效果 | 持續時間 |
|---------|--------|------|---------|
| 護盾 Shield | 藍色 | 吸收一次碰撞傷害 | 10 秒 |
| 快速射擊 Rapid Fire | 黃色 | 射擊冷卻縮短 50% | 8 秒 |
| 三向射擊 Triple Shot | 橘色 | 同時發射 3 顆子彈 | 6 秒 |
| 爆炸子彈 Bomb | 紅色 | 子彈命中時小範圍爆炸 | 5 秒 |
| 時間減速 Slow-Mo | 紫色 | 全場小行星速度 × 0.4 | 5 秒 |

### 4.5 UFO 行為

- **大型 UFO：** 直線移動，隨機角度射擊，每 30 秒一波
- **小型 UFO（關卡 5+）：** 追蹤玩家移動，精準瞄準射擊，每 45 秒一波

---

## 5. 畫面與功能規格

### 5.1 畫面狀態機（FSM）

```
[MAIN_MENU]
    │
    ├──「開始遊戲」──────→ [PLAYING]
    ├──「繼續遊戲」（有存檔）→ [PLAYING]（從儲存狀態恢復）
    ├──「說明」──────────→ [HOW_TO_PLAY]（Modal 疊加）
    ├──「設定」──────────→ [SETTINGS]
    └──「排行榜」────────→ [HIGHSCORE]

[PLAYING]
    │
    ├── ESC / 暫停鍵 ────→ [PAUSED]
    ├── 生命 = 0 ─────────→ [GAME_OVER]
    └── 清除所有行星 ────→ [LEVEL_TRANSITION] → [PLAYING]（下一關）

[PAUSED]
    │
    ├──「繼續」──────────→ [PLAYING]
    ├──「重新開始」───────→ [PLAYING]（重置）
    └──「返回主選單」────→ [MAIN_MENU]

[GAME_OVER]
    │
    ├── 輸入名稱（若破榜）→ [HIGHSCORE]
    └──「返回主選單」────→ [MAIN_MENU]
```

### 5.2 主選單（MAIN_MENU）

**版面：** 全螢幕，星空動態背景 + 視差效果

**元素清單：**

| 元素 | 內容 | 字體大小（桌機） | 字體大小（行動） |
|------|------|--------------|--------------|
| 遊戲標題 Logo | ASTEROIDS | `--font-size-hero` (72px) | 48px |
| 副標題 | 小行星大作戰 | `--font-size-xl` (40px) | 28px |
| 按鈕：開始遊戲 | ▶ 開始遊戲 | `--font-size-lg` (32px) | 24px |
| 按鈕：繼續遊戲 | ⏩ 繼續遊戲 | `--font-size-lg` (32px) | 24px |
| 按鈕：排行榜 | 🏆 排行榜 | `--font-size-md` (24px) | 20px |
| 按鈕：說明 | ❓ 說明 | `--font-size-md` (24px) | 20px |
| 按鈕：設定 | ⚙️ 設定 | `--font-size-md` (24px) | 20px |
| 版本號 | v1.0.0 | `--font-size-xs` (16px) | 16px |

**動態效果：**
- 標題字母逐字淡入（Stagger animation）
- 按鈕懸停時有霓虹光暈（`box-shadow` 動畫）
- 背景有緩慢漂流的小行星輪廓（SVG，低透明度）
- 「繼續遊戲」按鈕：無存檔時呈灰色 disabled 狀態

### 5.3 說明畫面（HOW_TO_PLAY）

以 Modal 疊加形式呈現，可不離開主選單背景。

**內容分頁：**
1. **基本操作** — 鍵盤 / 行動裝置操控圖示對照表
2. **遊戲規則** — 分數、生命、升關說明
3. **道具說明** — 各道具圖示與效果
4. **快捷鍵** — 完整鍵盤快捷鍵列表

**字體規格：** 所有說明文字 ≥ `--font-size-md`（24px）

### 5.4 遊戲畫面（PLAYING）

**版面結構：**

```
┌─────────────────────────────────────────────────┐
│  HUD Top Bar                                     │
│  ♥♥♥  SCORE: 000000  HI: 000000  LEVEL: 03      │
├─────────────────────────────────────────────────┤
│                                                  │
│           GAME CANVAS (Canvas 2D API)            │
│                                                  │
│                  遊戲主畫布                       │
│                                                  │
├─────────────────────────────────────────────────┤
│  [行動裝置限定] 虛擬按鍵區（固定在畫面底部）         │
│  ↺ 左旋   ↑ 推進   ↻ 右旋  │ 🔥 射擊  🌀 跳躍  │
└─────────────────────────────────────────────────┘
```

**HUD 字體規格：**

| 元素 | 桌機 | 行動 |
|------|------|------|
| 分數 | 32px Orbitron Bold | 22px |
| 關卡 | 24px Exo 2 | 18px |
| 生命圖示 | 24px（Ship SVG icon × N） | 18px |
| 道具計時器 | 20px | 16px |

### 5.5 暫停畫面（PAUSED）

- 遊戲畫面**模糊**（CSS `backdrop-filter: blur(8px)`）
- 中央卡片顯示暫停選單
- 選項：**繼續遊戲** / **重新開始** / **設定** / **返回主選單**
- 背景音樂繼續播放（僅 BGM 音量降低 50%）

### 5.6 結束畫面（GAME_OVER）

**顯示資訊：**
- GAME OVER（大字，動畫閃爍）
- 本局最終得分
- 關卡到達
- 摧毀小行星數量
- 遊玩時間
- 是否破榜 → 輸入名稱欄位（最多 8 字元）
- 按鈕：重新開始 / 查看排行榜 / 返回主選單

### 5.7 排行榜（HIGHSCORE）

- 本地 localStorage 儲存前 10 名
- 顯示：名次、名稱、分數、關卡、日期
- 清除紀錄按鈕（需二次確認）
- 當前本局分數高亮顯示

### 5.8 設定畫面（SETTINGS）

詳細內容見第 10 章。

---

## 6. 音效系統規格

### 6.1 架構設計

```
audioManager.js
  ├── bgmPlayer.js     使用 <audio> 標籤，HTMLAudioElement
  │     ├── 持有 3 個 BGM 實例
  │     ├── 淡入淡出切換（fadeOut + fadeIn，500ms）
  │     └── 跨畫面狀態：PLAYING / PAUSED / STOPPED
  │
  └── sfxPlayer.js     使用 Web Audio API（AudioContext）
        ├── 物件池管理 AudioBuffer
        ├── 支援同時多音播放（多個 AudioBufferSourceNode）
        └── 每種音效有最大同播數限制
```

### 6.2 完整音效清單（14 種）

| ID | 檔名 | 觸發時機 | 最大同播 |
|----|------|---------|---------|
| SFX_SHOOT | shoot.ogg | 玩家射擊 | 4 |
| SFX_SHOOT_RAPID | shoot_rapid.ogg | 快速射擊道具期間射擊 | 4 |
| SFX_ASTEROID_LG | asteroid_explode_large.ogg | 大型小行星被摧毀 | 3 |
| SFX_ASTEROID_MD | asteroid_explode_medium.ogg | 中型小行星被摧毀 | 4 |
| SFX_ASTEROID_SM | asteroid_explode_small.ogg | 小型小行星被摧毀 | 6 |
| SFX_SHIP_THRUST | ship_thrust.ogg | 推進鍵持續按下（循環） | 1 |
| SFX_SHIP_EXPLODE | ship_explode.ogg | 飛船被擊毀 | 1 |
| SFX_SHIP_RESPAWN | ship_respawn.ogg | 飛船重生 | 1 |
| SFX_LEVEL_UP | level_up.ogg | 過關進入下一關 | 1 |
| SFX_EXTRA_LIFE | extra_life.ogg | 達到加命分數 | 1 |
| SFX_POWERUP | powerup_collect.ogg | 撿取道具 | 2 |
| SFX_SHIELD_ON | shield_activate.ogg | 護盾啟動 | 1 |
| SFX_SHIELD_HIT | shield_hit.ogg | 護盾吸收碰撞 | 2 |
| SFX_WARP | warp.ogg | 使用超空間跳躍 | 1 |
| SFX_UI_CLICK | ui_click.ogg | 所有 UI 按鈕點擊 | 3 |

### 6.3 背景音樂（3 種）

| 狀態 | 檔名 | 說明 |
|------|------|------|
| 主選單 | menu_bgm.ogg | 輕鬆太空氛圍，循環播放 |
| 遊戲中 | game_bgm.ogg | 緊張節奏，循環播放 |
| 結束畫面 | gameover_bgm.ogg | 低沉旋律，播放一次後停止 |

### 6.4 BGM 跨畫面持續規則

```
主選單 → 開始遊戲   : 淡出 menu_bgm → 淡入 game_bgm
遊戲中 → 暫停       : game_bgm 降低音量至 30%（不停止）
暫停   → 繼續       : game_bgm 音量回升至 100%
遊戲中 → 遊戲結束   : 淡出 game_bgm → 淡入 gameover_bgm
任何畫面 → 設定     : 目前 BGM 繼續播放（不中斷）
任何畫面 → 說明     : 目前 BGM 繼續播放（不中斷）
```

### 6.5 音量控制

- **BGM 音量：** 0 ~ 100（滑桿控制），預設 60
- **SFX 音量：** 0 ~ 100（滑桿控制），預設 80
- **靜音快捷鍵：** `M` 鍵切換全部靜音
- **瀏覽器政策：** 首次需用戶互動後才能播放（第一次點擊按鈕時解鎖 AudioContext）

---

## 7. RWD 響應式設計規格

### 7.1 斷點系統

```css
/* mobile-controls.css 及 responsive.css 中定義 */

/* 手機直向（小） */
@media (max-width: 480px) { ... }

/* 手機橫向 / 平板直向 */
@media (max-width: 768px) { ... }

/* 平板橫向 / 小桌機 */
@media (max-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1025px) { ... }
```

### 7.2 Canvas 尺寸適應策略

```javascript
// renderer.js
function resizeCanvas() {
  const container = document.getElementById('game-container');
  const containerW = container.clientWidth;
  const containerH = container.clientHeight;

  // 保持 4:3 比例，最大化利用空間
  const targetRatio = 4 / 3;
  let canvasW, canvasH;

  if (containerW / containerH > targetRatio) {
    canvasH = containerH;
    canvasW = canvasH * targetRatio;
  } else {
    canvasW = containerW;
    canvasH = canvasW / targetRatio;
  }

  canvas.width = canvasW;
  canvas.height = canvasH;

  // 更新物理空間座標系
  GAME_WORLD.width = canvasW;
  GAME_WORLD.height = canvasH;
}

window.addEventListener('resize', debounce(resizeCanvas, 100));
```

### 7.3 各裝置版面差異

| 版面元素 | 手機（< 768px） | 桌機（≥ 1025px） |
|---------|-------------|--------------|
| 遊戲標題字體 | 48px | 72px |
| HUD 分數字體 | 20px | 32px |
| 按鈕字體 | 20px | 28px |
| Canvas 位置 | 螢幕上半（留底部給虛擬按鍵）| 置中，最大 1200×800 |
| 虛擬按鍵區 | 顯示，固定在視口底部 | 隱藏 |
| 暫停按鈕 | 右上角浮動圓形按鈕 | 顯示「ESC 暫停」提示 |

---

## 8. 行動裝置操控規格

### 8.1 設計原則：操控不遮擋遊戲畫面

行動裝置的虛擬按鍵區塊位於遊戲畫布**之外**（在 DOM 結構中分離），而非疊加在 Canvas 之上。

```
┌────────────────────────┐  ← 視口頂部
│ HUD (分數/生命/關卡)    │  高度：60px
├────────────────────────┤
│                        │
│    GAME CANVAS         │  flex-grow: 1
│    （不被任何按鍵遮蓋）  │  max-height: calc(100vh - 180px)
│                        │
├────────────────────────┤
│   虛擬操控區            │  高度：固定 120px（手機直向）
│                        │  高度：固定 100px（手機橫向）
└────────────────────────┘  ← 視口底部
```

### 8.2 虛擬按鍵佈局

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌────────┐  ┌────┐ │
│  │  ↺  │  │  ↑  │  │  ↻  │  │  FIRE  │  │ 🌀 │ │
│  │ 左旋│  │推進 │  │ 右旋│  │   射擊  │  │跳躍│ │
│  └─────┘  └─────┘  └─────┘  └────────┘  └────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 8.3 虛擬按鍵規格

| 按鍵 | 最小尺寸 | 對應行為 | 備註 |
|------|---------|---------|------|
| 左旋 | 60×60px | 飛船逆時針旋轉 | 長按持續旋轉 |
| 推進 | 60×60px | 向前加速 | 長按持續推進 + 噴射音效 |
| 右旋 | 60×60px | 飛船順時針旋轉 | 長按持續旋轉 |
| 射擊 | 80×60px | 發射子彈 | 長按持續射擊（受冷卻限制） |
| 超空間 | 60×60px | 隨機傳送 | 點擊觸發，有冷卻指示環 |
| 暫停（右上浮動） | 50×50px | 暫停遊戲 | 始終顯示在遊戲畫面 |

### 8.4 觸控實作細節

```javascript
// touchInput.js
// 使用 pointer events 統一處理觸控與滑鼠
button.addEventListener('pointerdown', (e) => {
  e.preventDefault(); // 防止觸發 click 延遲與文字選取
  inputState[action] = true;
  button.classList.add('active');
});

button.addEventListener('pointerup', (e) => {
  inputState[action] = false;
  button.classList.remove('active');
});

button.addEventListener('pointerleave', (e) => {
  inputState[action] = false;
  button.classList.remove('active');
});

// 手機橫向時按鍵縮小
const mq = window.matchMedia('(orientation: landscape) and (max-height: 500px)');
mq.addEventListener('change', adjustControlSize);
```

### 8.5 手機橫向模式

手機橫向時（landscape），遊戲畫布更寬但更矮：
- 虛擬按鍵縮小為 50×50px
- 分左右兩側配置（左：旋轉+推進；右：射擊+超空間）
- HUD 壓縮為單行小字

```
┌─────┬────────────────────────────┬─────┐
│ ↺ ↑ │                            │FIRE │
│ ↻   │     GAME CANVAS            │ 🌀  │
└─────┴────────────────────────────┴─────┘
```

---

## 9. 視覺設計規格

### 9.1 字體規則

- **顯示字體（Orbitron）：** 用於標題、Logo、分數、HUD 數字
- **正文字體（Exo 2）：** 用於按鈕文字、說明、設定選項
- **最小字體大小：** 任何位置均 ≥ 16px（`--font-size-xs`）
- **按鈕文字：** 桌機 ≥ 24px，行動裝置 ≥ 20px

### 9.2 五種色彩主題

主題透過 `data-theme="[name]"` 套用在 `<html>` 上，CSS 使用自訂屬性覆蓋。

---

#### 主題一：霓虹（Neon）— 預設

> 深黑背景 + 青藍霓虹，展現 CRT 螢幕風格

| 變數名 | 色值 | 用途 |
|--------|------|------|
| `--color-bg` | `#0a0a0f` | 遊戲背景 |
| `--color-primary` | `#00f5ff` | 主要文字、按鈕 |
| `--color-secondary` | `#7b2fff` | 次要強調 |
| `--color-accent` | `#ff00aa` | 分數、高亮 |
| `--color-ship` | `#00f5ff` | 飛船顏色 |
| `--color-asteroid` | `#8a8a9a` | 小行星 |
| `--color-bullet` | `#ffff00` | 子彈 |
| `--color-text` | `#e0e0ff` | 一般文字 |

#### 主題二：復古（Retro）

> 深棕背景 + 橘黃，還原 1979 年街機風格

| 變數名 | 色值 |
|--------|------|
| `--color-bg` | `#1a0f00` |
| `--color-primary` | `#ff8c00` |
| `--color-secondary` | `#ffcc00` |
| `--color-accent` | `#ff4400` |
| `--color-ship` | `#ffcc00` |
| `--color-asteroid` | `#a06020` |
| `--color-bullet` | `#ffffff` |
| `--color-text` | `#ffd090` |

#### 主題三：極光（Aurora）

> 暗藍黑背景 + 綠紫雙色光，極地極光氛圍

| 變數名 | 色值 |
|--------|------|
| `--color-bg` | `#010b14` |
| `--color-primary` | `#00ff88` |
| `--color-secondary` | `#aa00ff` |
| `--color-accent` | `#00ccff` |
| `--color-ship` | `#00ff88` |
| `--color-asteroid` | `#204030` |
| `--color-bullet` | `#aaffdd` |
| `--color-text` | `#b0ffcc` |

#### 主題四：緋紅（Crimson）

> 炭黑背景 + 深紅，危險戰鬥感

| 變數名 | 色值 |
|--------|------|
| `--color-bg` | `#0f0003` |
| `--color-primary` | `#ff2244` |
| `--color-secondary` | `#ff6600` |
| `--color-accent` | `#ffaa00` |
| `--color-ship` | `#ff4466` |
| `--color-asteroid` | `#5a1010` |
| `--color-bullet` | `#ffdd00` |
| `--color-text` | `#ffcccc` |

#### 主題五：冰川（Glacier）

> 深藍白，冷靜科技感

| 變數名 | 色值 |
|--------|------|
| `--color-bg` | `#020c18` |
| `--color-primary` | `#a0d8ef` |
| `--color-secondary` | `#4488cc` |
| `--color-accent` | `#ffffff` |
| `--color-ship` | `#e0f4ff` |
| `--color-asteroid` | `#1a3a55` |
| `--color-bullet` | `#80ffff` |
| `--color-text` | `#cceeFF` |

### 9.3 按鈕視覺規格

```css
/* buttons.css 核心規格 */
.btn {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);   /* 桌機 32px */
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: var(--space-md) var(--space-xl);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.btn:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 20px var(--color-primary),
              0 0 40px var(--color-primary);
}

.btn:active {
  transform: scale(0.96);
}

/* 行動裝置字體縮小 */
@media (max-width: 768px) {
  .btn {
    font-size: var(--font-size-md); /* 24px */
    padding: var(--space-sm) var(--space-lg);
  }
}
```

---

## 10. 設定系統規格

### 10.1 設定項目清單

#### 遊戲設定

| 設定項 | 控制項類型 | 選項 / 範圍 | 預設值 |
|--------|---------|-----------|-------|
| 難度 | 單選按鈕 | 簡單 / 標準 / 困難 / 瘋狂 | 標準 |
| 初始生命 | 步進器 | 2 ~ 5 | 3 |
| 顯示 FPS | 切換開關 | 開 / 關 | 關 |
| 顯示碰撞框 | 切換開關（除錯） | 開 / 關 | 關 |

#### 音效設定

| 設定項 | 控制項類型 | 範圍 | 預設值 |
|--------|---------|------|-------|
| BGM 音量 | 滑桿 | 0 ~ 100 | 60 |
| 音效音量 | 滑桿 | 0 ~ 100 | 80 |
| 靜音 | 切換開關 | 開 / 關 | 關 |

#### 視覺設定

| 設定項 | 控制項類型 | 選項 | 預設值 |
|--------|---------|------|-------|
| 色彩主題 | 圖示卡片選擇 | 霓虹 / 復古 / 極光 / 緋紅 / 冰川 | 霓虹 |
| 粒子效果 | 切換開關 | 開 / 關 | 開 |
| 星空視差 | 切換開關 | 開 / 關 | 開 |
| 螢幕震動 | 切換開關 | 開 / 關 | 開 |

#### 操控設定（行動裝置）

| 設定項 | 控制項類型 | 範圍 / 選項 | 預設值 |
|--------|---------|-----------|-------|
| 按鍵透明度 | 滑桿 | 20% ~ 100% | 70% |
| 按鍵尺寸 | 單選 | 小 / 中 / 大 | 中 |
| 震動回饋 | 切換開關 | 開 / 關 | 開 |

### 10.2 鍵盤快捷鍵

| 按鍵 | 功能 |
|------|------|
| ← / A | 飛船向左旋轉 |
| → / D | 飛船向右旋轉 |
| ↑ / W | 推進引擎 |
| Space | 射擊 |
| Shift / Z | 超空間跳躍 |
| ESC / P | 暫停 / 繼續 |
| M | 切換靜音 |
| Enter | 確認 / 開始 |

---

## 11. 儲存與進度系統

### 11.1 localStorage 結構

```javascript
// saveManager.js 管理的資料結構

// 鍵名：'asteroids_settings'
{
  "difficulty": "normal",
  "startLives": 3,
  "bgmVolume": 60,
  "sfxVolume": 80,
  "muted": false,
  "theme": "neon",
  "particles": true,
  "starfield": true,
  "screenShake": true,
  "showFps": false,
  "controlOpacity": 0.7,
  "controlSize": "medium",
  "vibration": true
}

// 鍵名：'asteroids_highscores'
[
  { "rank": 1, "name": "ACE", "score": 98500, "level": 12, "date": "2026-06-11" },
  { "rank": 2, "name": "ZAP", "score": 72000, "level": 9, "date": "2026-05-30" },
  // ...最多 10 筆
]

// 鍵名：'asteroids_save'（繼續遊戲用）
{
  "score": 45000,
  "level": 7,
  "lives": 2,
  "timestamp": 1749600000000,
  "asteroidCount": 5,
  "activePowerup": null
  // 注意：中途儲存不保留飛船精確位置，從關卡開頭重新開始
}
```

### 11.2 存檔觸發時機

- 每次**進入暫停**時自動存檔
- 遊戲結束時**清除存檔**（只保留排行榜）
- 玩家主動「返回主選單」時存檔

---

## 12. 效能規格

### 12.1 目標幀率

| 裝置等級 | 目標 FPS | 最低 FPS |
|---------|---------|---------|
| 現代桌機 | 60 FPS | 55 FPS |
| 高階手機 | 60 FPS | 50 FPS |
| 中階手機 | 60 FPS | 40 FPS |

### 12.2 效能優化措施

- **物件池（Object Pool）：** 子彈（上限 8 顆）、粒子（上限 200 個）不頻繁建立/刪除
- **Canvas 分層繪製：** 星空背景使用獨立的 `<canvas>` 以降低重繪成本
- **Delta Time 補償：** 遊戲邏輯使用 `delta` 計算，確保不同幀率下物理行為一致
- **debounce resize：** resize 事件用 100ms debounce 避免頻繁重算
- **音效預載：** 所有音效在遊戲啟動時預先載入至 AudioBuffer
- **離屏 Canvas：** 小行星形狀快取為 OffscreenCanvas，避免每幀重新計算多邊形

### 12.3 記憶體管理

- 離開遊戲畫面時清空 `entityManager`（子彈、粒子全部 release 回池）
- 暫停時停止 `requestAnimationFrame`
- 無 memory leak：所有事件監聽器在組件銷毀時移除

---

## 13. 模組說明索引

### 13.1 core/

| 模組 | 職責 |
|------|------|
| `main.js` | 頁面 DOMContentLoaded 後初始化所有模組，解鎖 AudioContext，設定首次存檔讀取 |
| `gameLoop.js` | `requestAnimationFrame` 主迴圈，計算 delta time，依序呼叫 update → render |
| `stateManager.js` | 有限狀態機，管理 MENU / PLAYING / PAUSED / GAME_OVER / SETTINGS 等狀態，發布 state:change 事件 |
| `eventBus.js` | 輕量 pub/sub，解耦模組間通訊（例：score:update, asteroid:destroyed, level:up）|

### 13.2 entities/

| 模組 | 職責 |
|------|------|
| `ship.js` | 飛船物件，持有位置/速度/旋轉/無敵計時/道具狀態，提供 update() / draw() / reset() |
| `asteroid.js` | 小行星物件，持有尺寸/頂點/速度，提供 split()（回傳 2 個子行星）|
| `bullet.js` | 子彈物件，持有方向/生命計時，從物件池取用 |
| `particle.js` | 粒子物件，持有顏色/速度/衰減率，用於爆炸特效 |
| `powerup.js` | 道具物件，持有類型/閃爍動畫，碰撞後觸發對應效果 |
| `entityManager.js` | 持有並管理所有活躍 entities，提供批次 update / draw / collision check |

### 13.3 systems/

| 模組 | 職責 |
|------|------|
| `physics.js` | 更新所有 entity 的位置（速度 × delta），處理邊界環繞 |
| `collision.js` | 圓形碰撞偵測，子彈 vs 小行星、飛船 vs 小行星、飛船 vs 道具 |
| `renderer.js` | Canvas 2D 繪圖，管理畫布尺寸，依序繪製各層 |
| `input.js` | 管理鍵盤 keydown/keyup，輸出 `inputState` 物件 |
| `touchInput.js` | 管理觸控按鈕 pointerdown/pointerup，輸出同一 `inputState` 物件 |
| `levelManager.js` | 追蹤關卡進度，清除所有行星後呼叫 nextLevel()，調整難度參數 |
| `scoreManager.js` | 計算分數、連擊倍率，觸發加命事件 |
| `starfield.js` | 視差星空，分 3 層速度，繪製在背景 Canvas |

### 13.4 audio/

| 模組 | 職責 |
|------|------|
| `audioManager.js` | 統一介面，接收遊戲事件後呼叫對應 sfxPlayer / bgmPlayer |
| `sfxPlayer.js` | Web Audio API，管理 AudioBuffer 池，支援多音同播 |
| `bgmPlayer.js` | HTMLAudioElement，淡入淡出切換，跨畫面持續播放邏輯 |

### 13.5 ui/

| 模組 | 職責 |
|------|------|
| `screenManager.js` | 管理畫面切換動畫（fade / slide），確保同時只有一個 screen active |
| `hud.js` | 監聽 score/lives/level/powerup 事件，即時更新 DOM |
| `mainMenu.js` | 主選單按鈕點擊處理，讀取存檔決定「繼續遊戲」是否可用 |
| `settingsUI.js` | 設定畫面所有控制項雙向綁定，即時套用主題/音量 |
| `pauseMenu.js` | 暫停選單互動，繼續/重啟/回主選單 |
| `gameOverScreen.js` | 結算畫面，輸入名稱，送出排行榜 |
| `highscoreUI.js` | 排行榜渲染，讀取 localStorage，高亮當前分數 |
| `mobileControls.js` | 行動按鍵顯示/隱藏判斷，連接 touchInput，套用透明度/尺寸設定 |

---

## 附錄 A：難度參數對照表

| 參數 | 簡單 | 標準 | 困難 | 瘋狂 |
|------|------|------|------|------|
| 初始小行星 | 3 | 4 | 5 | 6 |
| 小行星速度倍率 | 0.7× | 1.0× | 1.4× | 2.0× |
| UFO 出現頻率 | 45s | 30s | 20s | 12s |
| 道具掉落率 | 每 15 顆 | 每 20 顆 | 每 28 顆 | 每 40 顆 |
| 超空間自爆率 | 5% | 10% | 15% | 25% |

---

## 附錄 B：音效產生建議

由於所有音效需在本地提供（無需伺服器），建議使用以下**免費工具**產生或下載符合授權的音效：

| 工具 | 用途 |
|------|------|
| [jsfxr](https://sfxr.me/) | 在線產生 8-bit 風格音效（射擊、爆炸、道具），匯出 `.wav` 後轉 `.ogg` |
| [Freesound.org](https://freesound.org/) | Creative Commons 授權音效庫 |
| [ffmpeg](https://ffmpeg.org/) | 轉換音效格式（`ffmpeg -i input.wav output.ogg`） |
| [Audacity](https://www.audacityteam.org/) | 編輯與調整音效長度/音量 |

> 所有音效建議統一轉為 `.ogg` 格式（較小檔案、廣泛支援），備用 `.mp3` 供 Safari。

---

*規格書結束 — 版本 v1.0.0*
