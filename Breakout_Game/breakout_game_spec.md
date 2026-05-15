# 🧱 BRICKSTORM — 打磚塊遊戲完整規格書

**版本：** v1.0.0  
**文件類型：** 前端遊戲開發規格書  
**目標平台：** 純前端（HTML5 + CSS3 + JavaScript），支援桌機與行動裝置  
**關卡數量：** 50 關  

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [視覺設計規範](#3-視覺設計規範)
4. [字體與排版規範](#4-字體與排版規範)
5. [畫面結構與流程](#5-畫面結構與流程)
6. [核心遊戲機制](#6-核心遊戲機制)
7. [道具系統](#7-道具系統)
8. [音樂與音效系統](#8-音樂與音效系統)
9. [關卡設計（1–50 關）](#9-關卡設計1–50-關)
10. [行動裝置支援規範](#10-行動裝置支援規範)
11. [分數與排行榜系統](#11-分數與排行榜系統)
12. [設定系統](#12-設定系統)
13. [存檔與進度系統](#13-存檔與進度系統)
14. [無障礙設計](#14-無障礙設計)
15. [效能規範](#15-效能規範)

---

## 1. 專案概覽

### 1.1 遊戲簡介

**BRICKSTORM** 是一款現代化的打磚塊（Breakout/Arkanoid 風格）遊戲，採用純前端技術製作，無需後端伺服器，可直接於瀏覽器中遊玩。遊戲共設計 **50 個獨特關卡**，每關均有特色磚塊佈局、主題音樂變化與特殊機制，確保遊戲體驗豐富多樣。

### 1.2 核心目標

| 目標 | 說明 |
|------|------|
| 跨裝置支援 | 桌機、平板、手機均可流暢遊玩 |
| 沉浸式音效 | 全程合成音樂與細緻音效，無需外部素材 |
| 高可玩性 | 50 關循序漸進，含多種機制組合 |
| 即開即玩 | 單一 HTML 檔案，零安裝，零依賴 |
| 大字型設計 | 主畫面與設定介面文字清晰易讀 |

### 1.3 技術限制

- **單一檔案**：所有程式碼（HTML / CSS / JS）打包在一個 `.html` 檔案中
- **零外部依賴**：不引用 CDN、不載入任何外部圖片或音訊檔
- **音訊合成**：所有音樂與音效使用 **Web Audio API** 即時合成
- **畫面渲染**：使用 **HTML5 Canvas** 進行遊戲繪製

---

## 2. 技術架構

### 2.1 檔案結構

```
breakout_game.html          ← 唯一輸出檔案
├── <style>                 ← 全部 CSS（含 UI、動畫、RWD）
└── <script>
    ├── AudioEngine         ← Web Audio API 音效引擎
    ├── MusicEngine         ← 合成音樂系統
    ├── GameState           ← 遊戲狀態機
    ├── Renderer            ← Canvas 繪製模組
    ├── PhysicsEngine       ← 碰撞與物理運算
    ├── InputHandler        ← 鍵盤 / 滑鼠 / 觸控輸入
    ├── LevelManager        ← 關卡資料與載入
    ├── PowerUpSystem       ← 道具管理
    ├── ScoreSystem         ← 分數與排行榜
    ├── SaveSystem          ← localStorage 存檔
    └── UIManager           ← 畫面切換與介面元件
```

### 2.2 遊戲迴圈架構

```
requestAnimationFrame Loop
    ↓
update(deltaTime)
    ├── InputHandler.update()
    ├── PhysicsEngine.update()
    │   ├── moveBall()
    │   ├── checkPaddleCollision()
    │   ├── checkBrickCollisions()
    │   ├── checkWallCollisions()
    │   └── checkPowerUpCollisions()
    ├── PowerUpSystem.update()
    ├── GameState.checkWinLose()
    └── MusicEngine.update()
    ↓
render(ctx)
    ├── drawBackground()
    ├── drawBricks()
    ├── drawPaddle()
    ├── drawBall()
    ├── drawPowerUps()
    ├── drawParticles()
    └── drawHUD()
```

### 2.3 畫布尺寸規格

| 裝置類型 | Canvas 寬度 | Canvas 高度 | 縮放方式 |
|----------|-------------|-------------|----------|
| 桌機（≥1024px） | 800px | 600px | 固定尺寸，置中 |
| 平板（768–1023px） | 100vw | 75vw | CSS transform scale |
| 手機直向（<768px） | 100vw | 133vw | CSS transform scale |
| 手機橫向（<768px） | 100vh×4/3 | 100vh | CSS transform scale |

---

## 3. 視覺設計規範

### 3.1 色彩系統

```css
:root {
  /* 主色調 — 深宇宙藍 */
  --color-bg-deep:       #0a0a1a;
  --color-bg-mid:        #0f0f2e;
  --color-bg-surface:    #1a1a3e;

  /* 主角色 */
  --color-primary:       #00f5ff;   /* 電光青 */
  --color-primary-glow:  #00f5ff88;

  /* 強調色 */
  --color-accent-1:      #ff006e;   /* 熱粉紅 */
  --color-accent-2:      #fb5607;   /* 橙火 */
  --color-accent-3:      #ffbe0b;   /* 金黃 */
  --color-accent-4:      #8338ec;   /* 電紫 */
  --color-accent-5:      #3a86ff;   /* 明藍 */

  /* 功能色 */
  --color-success:       #06ffa5;
  --color-warning:       #ffbe0b;
  --color-danger:        #ff006e;
  --color-info:          #00f5ff;

  /* 文字 */
  --color-text-primary:  #ffffff;
  --color-text-secondary:#a0a0c0;
  --color-text-muted:    #606080;

  /* 磚塊色彩 */
  --brick-red:     #ff2d55;
  --brick-orange:  #ff9500;
  --brick-yellow:  #ffcc00;
  --brick-green:   #34c759;
  --brick-teal:    #5ac8fa;
  --brick-blue:    #007aff;
  --brick-purple:  #af52de;
  --brick-pink:    #ff2d9c;
  --brick-silver:  #c7c7cc;
  --brick-gold:    #ffd60a;
}
```

### 3.2 背景視覺效果

```
背景層次（由後至前）：
Layer 0: 深黑漸層底色（--color-bg-deep）
Layer 1: 星點粒子（Canvas 繪製，緩慢移動）
Layer 2: 星雲光暈（徑向漸層，低透明度）
Layer 3: 掃描線效果（CSS 重複線性漸層，1px 間距，3% 透明度）
Layer 4: 遊戲內容（磚塊、球、擋板）
Layer 5: HUD 介面（分數、生命、關卡）
```

### 3.3 發光效果規範

```css
/* 球體發光 */
.ball-glow {
  filter: drop-shadow(0 0 6px var(--color-primary))
          drop-shadow(0 0 12px var(--color-primary))
          drop-shadow(0 0 24px var(--color-primary-glow));
}

/* 擋板發光 */
.paddle-glow {
  box-shadow: 0 0 8px var(--color-primary),
              0 0 16px var(--color-primary-glow),
              inset 0 0 8px rgba(0, 245, 255, 0.2);
}

/* 磚塊破碎粒子（Canvas） */
particle.color = brick.color;
particle.alpha = 0.0 → 1.0 → 0.0 (爆炸後 0.5 秒消散)
```

---

## 4. 字體與排版規範

### 4.1 字體選擇

> ⚠️ **重要**：所有字體均使用 Google Fonts CDN 載入（唯一允許的外部資源）。若無網路，退回系統字體。

```css
/* 主標題字體 — 科幻感 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* 內文與 UI 字體 — 清晰易讀 */
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&display=swap');

/* 數字顯示字體 — 比分、計時 */
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
```

### 4.2 字體尺寸規範（大尺寸優先）

| 用途 | 元素 | 桌機尺寸 | 手機尺寸 | 字重 |
|------|------|----------|----------|------|
| 遊戲主標題 | `h1.game-title` | **72px** | **42px** | 900 |
| 主選單項目 | `nav.menu-item` | **36px** | **28px** | 700 |
| 副標題 / 章節 | `h2` | **28px** | **22px** | 700 |
| 關卡名稱 | `.level-name` | **24px** | **20px** | 600 |
| 設定標籤 | `.setting-label` | **22px** | **18px** | 600 |
| 設定選項 | `.setting-option` | **20px** | **16px** | 400 |
| HUD 分數 | `.hud-score` | **28px** | **22px** | 700 |
| HUD 生命 | `.hud-lives` | **24px** | **20px** | 600 |
| 按鈕文字 | `button` | **20px** | **18px** | 700 |
| 說明文字 | `p.desc` | **16px** | **14px** | 400 |

### 4.3 主畫面排版示意

```
┌─────────────────────────────────┐
│                                 │
│   ██████  ██████ ██ ██████      │  ← 72px Orbitron 900
│   ██   ██ ██  ██ ██ ██  ██      │     電光青色，發光效果
│   ██████  ██████ ██ ██████      │
│   ██   ██ ██  ██ ██ ██  ██      │
│   ██████  ██  ██ ██ ██  ██      │
│                                 │
│   S T O R M                     │  ← 28px Exo2 300，字間距 1em
│                                 │
│  ┌──────────────────────────┐   │
│  │    ▶ 開始遊戲             │   │  ← 36px 按鈕
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │    📖 繼續遊戲             │   │  ← 36px 按鈕
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │    ⚙️ 設定                │   │  ← 36px 按鈕
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │    🏆 排行榜              │   │  ← 36px 按鈕
│  └──────────────────────────┘   │
│                                 │
│  「按下任意鍵開始」              │  ← 18px，閃爍動畫
└─────────────────────────────────┘
```

---

## 5. 畫面結構與流程

### 5.1 畫面狀態機

```
            ┌──────────┐
            │  LOADING  │  ← 顯示 Logo + 進度條（500ms）
            └─────┬─────┘
                  ↓
            ┌──────────┐
     ┌──────│   MENU   │──────┐
     │      └──────────┘      │
     │            │            │
     ↓            ↓            ↓
┌──────────┐ ┌──────────┐ ┌──────────┐
│ SETTINGS │ │  SELECT  │ │ LEADERBD │
│  設定     │ │ 關卡選擇  │ │ 排行榜   │
└──────────┘ └─────┬────┘ └──────────┘
                   ↓
            ┌──────────┐
            │ COUNTDOWN│  ← 3、2、1 倒數
            └─────┬─────┘
                  ↓
            ┌──────────┐
            │ PLAYING  │ ←──────────────┐
            └─────┬─────┘               │
                  ↓                     │
          ┌───────┴────────┐            │
          ↓                ↓            │
    ┌──────────┐    ┌──────────┐        │
    │LEVEL WIN │    │GAME OVER │        │
    └─────┬────┘    └─────┬────┘        │
          ↓               ↓             │
   下一關 / 選關        重試 / 選關      │
          └───────────────┴─────────────┘
```

### 5.2 各畫面規格

#### 5.2.1 載入畫面（LOADING）

```
- 背景：深色漸層 + 粒子效果
- 中央：遊戲 Logo（SVG，純 CSS 繪製）
- 底部：進度條（模擬載入動畫，0→100%，600ms）
- 文字：「INITIALIZING...」，14px，淡入淡出
- 音效：短促的電子啟動音（Web Audio API 合成）
```

#### 5.2.2 主選單（MENU）

```
- 背景：持續播放開場音樂
- 動態背景：球在背景中彈跳（無限循環，低透明度）
- Logo：帶有霓虹發光動畫
- 按鈕：懸停時發光 + 輕微縮放（transform: scale(1.05)）
- 版本號：右下角，12px，--color-text-muted
```

#### 5.2.3 設定畫面（SETTINGS）

各設定項目字體尺寸均以 **≥20px** 為基準：

| 設定項目 | 類型 | 預設值 |
|----------|------|--------|
| 音樂音量 | 滑桿（0–100） | 70 |
| 音效音量 | 滑桿（0–100） | 80 |
| 球速倍率 | 選項（慢 / 普通 / 快） | 普通 |
| 難度 | 選項（簡單 / 普通 / 困難） | 普通 |
| 粒子效果 | 開關 | 開 |
| 螢幕震動 | 開關 | 開 |
| 語言 | 選項（繁中 / 簡中 / EN） | 繁中 |
| 控制方式 | 選項（鍵盤 / 滑鼠 / 觸控） | 自動偵測 |

#### 5.2.4 關卡選擇（SELECT）

```
- 5×10 網格排列，顯示 50 個關卡格
- 每格顯示：關卡號碼（大字）+ 星等（0–3星）
- 鎖定狀態：半透明 + 鎖頭圖示
- 懸停 / 點擊：顯示關卡預覽縮圖 + 關卡名稱
- 滾動：行動裝置可上下滑動
```

#### 5.2.5 遊戲進行中（PLAYING）— HUD 設計

```
┌─────────────────────────────────────────┐
│ 🧱 LEVEL 1: DAWN      ❤️❤️❤️    SCORE  │  ← HUD 頂部
│ 「初始之晨」           3 LIVES   012340  │
└─────────────────────────────────────────┘
│                                         │
│           [遊戲畫布區域]                 │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

- HUD 高度：桌機 50px / 手機 44px
- 文字尺寸：桌機 22–28px / 手機 18–22px
- HUD 背景：半透明深色（rgba(0,0,0,0.6)），底部邊框發光線

---

## 6. 核心遊戲機制

### 6.1 遊戲元素規格

#### 6.1.1 擋板（Paddle）

| 屬性 | 規格 |
|------|------|
| 預設寬度 | 100px（桌機）/ 80px（手機） |
| 高度 | 14px（桌機）/ 12px（手機） |
| 移動速度 | 8px/frame（桌機）/ 觸控跟隨 |
| 顏色 | 電光青漸層，帶發光效果 |
| 形狀 | 圓角矩形（border-radius: 7px） |
| 底部距離 | 遊戲區底部 30px |
| 角落反彈 | 擊中擋板左/右1/4處，球角度偏轉增大 |

**反彈角度計算：**

```javascript
// 根據球擊中擋板的相對位置計算反彈角度
const relativePos = (ball.x - paddle.x) / paddle.width; // 0.0 ~ 1.0
const angle = (relativePos - 0.5) * 150; // -75° ~ +75°
const speed = Math.sqrt(ball.vx**2 + ball.vy**2);
ball.vx = speed * Math.sin(angle * Math.PI / 180);
ball.vy = -speed * Math.cos(angle * Math.PI / 180);
```

#### 6.1.2 球（Ball）

| 屬性 | 規格 |
|------|------|
| 預設半徑 | 8px（桌機）/ 7px（手機） |
| 初始速度 | 4px/frame（第1關）~ 7px/frame（第50關）|
| 最大速度 | 12px/frame |
| 速度增量 | 每擊中50顆磚塊，速度+0.3 |
| 顏色 | 白色核心 + 電光青發光光暈 |
| 拖尾效果 | 儲存最近8幀位置，逐幀淡化繪製 |

#### 6.1.3 磚塊（Brick）類型

| 類型 | 名稱 | 需幾擊 | 分數 | 特性 |
|------|------|--------|------|------|
| `NORMAL_1` | 普通磚 | 1 | 10 | 一擊即碎 |
| `NORMAL_2` | 硬磚 | 2 | 20 | 第一擊變暗，第二擊碎 |
| `NORMAL_3` | 重裝磚 | 3 | 40 | 三擊，每擊顯示裂縫 |
| `STONE` | 石磚 | 5 | 100 | 五擊，石紋材質 |
| `METAL` | 金屬磚 | 永久 | 0 | 不可摧毀，球反彈用 |
| `BOMB` | 爆炸磚 | 1 | 50 | 擊碎後爆炸，摧毀周圍8格 |
| `MULTI_BALL` | 多球磚 | 1 | 30 | 擊碎後分裂出2顆額外球 |
| `GHOST` | 幽靈磚 | 1 | 20 | 會在場上移動 |
| `LASER` | 雷射磚 | 1 | 25 | 擊碎後發射雷射向下 |
| `PORTAL` | 傳送磚 | 1 | 30 | 球穿越後從另一側出現 |
| `SHIELD` | 護盾磚 | 1 | 15 | 保護下方磚塊，需先打掉 |
| `POWER` | 道具磚 | 1 | 20 | 固定掉落道具 |
| `SCORE_2X` | 雙分磚 | 1 | 30 | 區域分數加倍 |
| `RAINBOW` | 彩虹磚 | 1 | 50 | 隨機效果（道具隨機） |

**磚塊尺寸：**

```
磚塊寬度 = (Canvas寬度 - 2×邊距 - (欄數-1)×間距) / 欄數
標準佈局：12欄，磚塊高度固定 22px（桌機）/ 18px（手機）
邊距：20px，磚塊間距：3px
```

#### 6.1.4 裂縫視覺效果

```javascript
// 磚塊裂縫繪製（根據剩餘血量）
function drawCracks(ctx, brick) {
  const crackPatterns = [
    [],  // 全血
    [[0.2,0.3,0.6,0.5], [0.5,0.2,0.7,0.8]],  // 1傷
    [[0.1,0.4,0.9,0.6], [0.3,0.1,0.5,0.9], [0.7,0.2,0.4,0.8]],  // 2傷
  ];
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 1.5;
  for (const [x1,y1,x2,y2] of crackPatterns[brick.maxHp - brick.hp]) {
    ctx.beginPath();
    ctx.moveTo(brick.x + x1*brick.w, brick.y + y1*brick.h);
    ctx.lineTo(brick.x + x2*brick.w, brick.y + y2*brick.h);
    ctx.stroke();
  }
}
```

### 6.2 碰撞系統

#### 6.2.1 球-磚塊碰撞（AABB）

```javascript
// 球與磚塊的AABB碰撞 + 角落修正
function checkBallBrickCollision(ball, brick) {
  const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
  const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  if (dx*dx + dy*dy <= ball.r*ball.r) {
    // 判斷從哪側碰撞，決定反彈方向
    const overlapX = (brick.w/2) - Math.abs(ball.x - (brick.x + brick.w/2));
    const overlapY = (brick.h/2) - Math.abs(ball.y - (brick.y + brick.h/2));
    if (overlapX < overlapY) ball.vx *= -1;
    else ball.vy *= -1;
    return true;
  }
  return false;
}
```

#### 6.2.2 連鎖碰撞處理

每幀內，若球速度過快（>8px/frame），採用「步進法」（Substep）：

```javascript
// 步進法：高速時拆分為多個子步驟
const substeps = Math.ceil(ballSpeed / 6);
const dt = 1 / substeps;
for (let i = 0; i < substeps; i++) {
  moveBall(dt);
  checkAllCollisions();
}
```

### 6.3 遊戲進行規則

| 規則 | 說明 |
|------|------|
| 生命 | 預設3條命，球落底扣1命 |
| 過關條件 | 消滅所有可摧毀磚塊（METAL 磚除外） |
| 失敗條件 | 生命歸零 |
| 暫停 | 按 ESC / P 或點擊暫停按鈕 |
| 球落底保護 | 第一關前3秒提供「底部護盾」輔助新手 |
| 連擊系統 | 球不落地持續擊磚，Combo 計數 +1，分數倍率增加 |

---

## 7. 道具系統

### 7.1 道具清單

| 代碼 | 圖示 | 名稱 | 效果 | 持續時間 |
|------|------|------|------|----------|
| `EXPAND` | ↔️ | 超寬擋板 | 擋板寬度×1.8 | 15秒 |
| `SHRINK` | ↕️ | 縮小擋板 | 擋板寬度×0.6 | 10秒 |
| `MULTI` | ×3 | 三球 | 分裂出2顆額外球 | 直到失球 |
| `SLOW` | 🐢 | 緩速 | 球速×0.7 | 8秒 |
| `FAST` | ⚡ | 加速 | 球速×1.4 | 6秒 |
| `LASER` | 🔫 | 雷射砲 | 擋板可發射雷射，按Space/點擊觸發 | 12秒 |
| `SHIELD` | 🛡️ | 底部護盾 | 底部出現一道護盾接住球 | 一次使用 |
| `BOMB` | 💣 | 炸彈 | 以擋板位置為中心，爆炸清除附近磚塊 | 立即 |
| `GHOST_BALL` | 👻 | 幽靈球 | 球可穿透磚塊（不反彈，一路貫穿） | 5秒 |
| `EXTRA_LIFE` | ❤️ | 加命 | 生命+1（上限5） | 立即 |
| `STICKY` | 🔒 | 黏板 | 球碰到擋板後黏住，按Space/點擊釋放 | 10秒 |
| `SCORE_2X` | ×2 | 雙倍分數 | 所有分數×2 | 10秒 |
| `MAGNET` | 🧲 | 磁鐵 | 道具自動向擋板移動 | 8秒 |
| `FIREBALL` | 🔥 | 火球 | 球可穿透並摧毀磚塊（需1擊的磚） | 6秒 |

### 7.2 道具掉落機制

```javascript
// 磚塊被摧毀時，按概率掉落道具
const DROP_RATE = {
  NORMAL:  0.12,  // 12% 概率
  SPECIAL: 0.05,  // 特殊磚塊額外 5%
  POWER:   1.00,  // 道具磚 100%
};

// 道具權重（正面道具概率更高）
const POWERUP_WEIGHTS = {
  EXPAND: 15, MULTI: 10, SLOW: 8, LASER: 8,
  SHIELD: 10, BOMB: 5, GHOST_BALL: 5, EXTRA_LIFE: 4,
  STICKY: 8, SCORE_2X: 10, MAGNET: 7, FIREBALL: 5,
  SHRINK: 3, FAST: 2,  // 負面道具低權重
};
```

### 7.3 道具視覺規格

```
道具膠囊：
- 尺寸：28px × 18px（桌機）/ 24px × 15px（手機）
- 形狀：圓角矩形（border-radius: 9px）
- 邊框：2px 發光邊框（顏色對應道具種類）
- 圖示：emoji 或簡單符號，居中顯示
- 下落速度：2.5px/frame
- 旋轉動畫：以 Y 軸翻轉（CSS transform rotateY，3D 翻牌效果）
- 閃爍：掉落時短暫閃爍提示玩家注意
```

---

## 8. 音樂與音效系統

### 8.1 Web Audio API 架構

```javascript
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();        // 總音量
    this.musicGain  = this.ctx.createGain();        // 音樂音量
    this.sfxGain    = this.ctx.createGain();        // 音效音量
    this.compressor = this.ctx.createDynamicsCompressor(); // 動態壓縮
    
    // 連接路由
    this.musicGain  → this.masterGain → this.compressor → ctx.destination
    this.sfxGain    → this.masterGain
  }
}
```

### 8.2 背景音樂系統（完整合成）

每個音樂主題均由以下模組合成：

```
音樂層次：
┌─────────────────────────────────────┐
│  Layer 1: BASS LINE（低音線）        │  ← OscillatorNode (sawtooth/square)
│  Layer 2: CHORD PAD（和弦墊音）      │  ← OscillatorNode × 3 (sine)
│  Layer 3: MELODY（主旋律）           │  ← OscillatorNode (square/triangle)
│  Layer 4: ARPEGGIO（琶音）           │  ← OscillatorNode × 2 (sine)
│  Layer 5: DRUMS（節拍）              │  ← BufferSourceNode（合成鼓聲）
│  Layer 6: AMBIENT（氛圍音）          │  ← OscillatorNode + filter（低通）
└─────────────────────────────────────┘
```

### 8.3 各關段音樂主題

| 關卡範圍 | 主題名稱 | 風格描述 | BPM | 調性 |
|----------|----------|----------|-----|------|
| 1–5 | DAWN（黎明） | 輕快電子，清新明亮 | 120 | C 大調 |
| 6–10 | NEON CITY（霓虹城） | 合成波（Synthwave）節奏感強 | 128 | A 小調 |
| 11–15 | DEEP SPACE（深空） | 環境電子，神秘空靈 | 95 | E 小調 |
| 16–20 | STORM（暴風） | 快節奏電子，張力十足 | 140 | D 小調 |
| 21–25 | CRYSTAL（水晶） | 輕柔 Chiptune，夢幻感 | 110 | G 大調 |
| 26–30 | VOID（虛空） | 暗黑電子，低頻轟炸 | 105 | B 小調 |
| 31–35 | PRISM（稜鏡） | 迷幻電子，和弦複雜 | 118 | F# 小調 |
| 36–40 | NOVA（新星） | 壯闊 Orchestral Synth | 132 | C 小調 |
| 41–45 | CORE（核心） | 工業電子，機械感 | 150 | G 小調 |
| 46–50 | INFINITY（無限） | 終極混合，最強張力 | 160 | A 小調 |

### 8.4 音樂合成代碼架構

```javascript
class MusicEngine {
  // ─── 合成鼓聲 ───────────────────────────────────
  synthesizeKick(time) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.4);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    osc.connect(gain) → masterGain;
    osc.start(time); osc.stop(time + 0.4);
  }

  synthesizeSnare(time) {
    // 白噪音 + 短衰減 模擬小鼓
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass'; filter.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    source.buffer = buffer;
    source.connect(filter) → gain → sfxGain;
    source.start(time);
  }

  synthesizeHiHat(time, open = false) {
    // 高頻白噪音，短促
    const duration = open ? 0.3 : 0.05;
    // ... 同 snare 但頻率更高
  }

  // ─── 音階定義 ──────────────────────────────────
  noteToFreq(note) {
    // note: 'C4', 'A#3', 'F#5' etc.
    const notes = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
    const octave = parseInt(note.slice(-1));
    const semitone = notes[note[0]] + (note[1]==='#' ? 1 : note[1]==='b' ? -1 : 0);
    return 440 * Math.pow(2, (semitone - 9 + (octave - 4) * 12) / 12);
  }

  // ─── 主旋律播放器 ──────────────────────────────
  playMelody(notes, durations, startTime, waveform = 'square') {
    notes.forEach((note, i) => {
      if (note === null) return; // 休止符
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveform;
      osc.frequency.value = this.noteToFreq(note);
      // Attack / Sustain / Release 包絡
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.setValueAtTime(0.3, startTime + durations[i] - 0.05);
      gain.gain.linearRampToValueAtTime(0, startTime + durations[i]);
      osc.connect(gain) → musicGain;
      osc.start(startTime); osc.stop(startTime + durations[i]);
      startTime += durations[i];
    });
  }
}
```

### 8.5 音效清單（SFX）

| 觸發事件 | 音效名稱 | 合成方式 | 時長 |
|----------|----------|----------|------|
| 球擊中擋板 | `sfx_paddle` | 正弦波，200Hz→400Hz，快攻快衰 | 80ms |
| 球擊中普通磚 | `sfx_brick_hit` | 方波，800Hz，衰減 | 50ms |
| 磚塊被摧毀 | `sfx_brick_destroy` | 鋸齒波 + 噪音，下滑音調 | 120ms |
| 道具掉落 | `sfx_powerup_drop` | 三角波，升調琶音（C4→G4） | 200ms |
| 獲得道具 | `sfx_powerup_get` | 正弦波和弦（C+E+G），明亮 | 300ms |
| 負面道具 | `sfx_powerup_bad` | 方波，下降短促音 | 200ms |
| 失球 | `sfx_ball_lost` | 低音下滑，噪音混合 | 600ms |
| 失去生命 | `sfx_life_lost` | 低沉爆音 + 靜音 | 800ms |
| 關卡完成 | `sfx_level_win` | 上升琶音五度和弦 | 1200ms |
| 遊戲結束 | `sfx_game_over` | 長音下滑，回聲效果 | 2000ms |
| 爆炸磚 | `sfx_explosion` | 低頻轟炸 + 白噪音 | 500ms |
| 多球分裂 | `sfx_multi_ball` | 高頻雙音，展開感 | 300ms |
| 雷射發射 | `sfx_laser` | 高頻正弦下滑 | 200ms |
| 連擊獎勵 | `sfx_combo` | 上升三聲短促音 | 400ms |
| 超級連擊（×10） | `sfx_mega_combo` | 和弦大爆發 | 600ms |
| 按鈕懸停 | `sfx_hover` | 極短高頻點擊 | 20ms |
| 按鈕點擊 | `sfx_click` | 短促方波點擊 | 30ms |
| 倒數計時 | `sfx_countdown` | 每秒一聲低→高，第0秒最高 | 100ms |
| 護盾啟動 | `sfx_shield` | 掃頻升音 | 400ms |
| 球穿越傳送門 | `sfx_portal` | 迷幻哇音（wah effect） | 300ms |
| 幽靈球啟動 | `sfx_ghost` | 空靈和弦（reverb 模擬） | 500ms |
| 排行榜上榜 | `sfx_highscore` | 五聲音階歡慶段落 | 1500ms |

### 8.6 音效合成範例

```javascript
// 球擊中擋板音效
function sfxPaddleHit() {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.linearRampToValueAtTime(400, now + 0.04);
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain); gain.connect(sfxGain);
  osc.start(now); osc.stop(now + 0.08);
}

// 關卡完成音效 — 上升琶音
function sfxLevelWin() {
  const notes = [261.6, 329.6, 392, 523.2]; // C4 E4 G4 C5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + i * 0.15;
    osc.frequency.value = freq;
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain); gain.connect(sfxGain);
    osc.start(t); osc.stop(t + 0.4);
  });
}
```

---

## 9. 關卡設計（1–50 關）

### 9.1 設計原則

- **難度曲線**：1–10 關入門，11–25 關進階，26–40 關挑戰，41–50 關精英
- **每關主題**：均有獨特名稱、磚塊圖案、主題音樂變化
- **特殊機制引入**：每5關引入一個新機制或新磚塊類型
- **視覺主題**：磚塊佈局形成可辨識的圖案（文字、圖形、符號）

### 9.2 關卡磚塊佈局格式說明

```
佈局網格：12列 × 8行（標準）或12列 × 10行（大型關卡）
符號說明：
  .  = 空格（無磚塊）
  1  = NORMAL_1（一般磚，不同字母代表不同顏色）
  2  = NORMAL_2（硬磚）
  3  = NORMAL_3（重裝磚）
  S  = STONE（石磚）
  M  = METAL（金屬磚，不可摧毀）
  B  = BOMB（爆炸磚）
  G  = GHOST（幽靈磚）
  L  = LASER（雷射磚）
  T  = PORTAL（傳送磚）
  P  = POWER（道具磚，固定道具）
  R  = RAINBOW（彩虹磚）
  X  = SCORE_2X（雙分磚）
```

### 9.3 全部 50 關詳細規格

---

#### 🌅 第 1 關：黎明之光（DAWN LIGHT）

**主題：** 輕鬆入門，認識基本玩法  
**音樂：** DAWN 主題（120 BPM，C大調，輕快）  
**特殊機制：** 底部護盾輔助（前30秒）  
**磚塊數：** 36  
**佈局：**（8行×12列）
```
. . . . . . . . . . . .
. R R R R R R R R R R .
. R R R R R R R R R R .
. 1 1 1 1 1 1 1 1 1 1 .
. 1 1 1 1 1 1 1 1 1 1 .
. . . . . . . . . . . .
. . . . . . . . . . . .
. . . . . . . . . . . .
```
**道具磚位置：** (1,5),(1,8)  **目標分數（3星）：** 1,200  

---

#### 🌈 第 2 關：彩虹橋（RAINBOW BRIDGE）

**主題：** 七彩磚塊橫跨畫面，如彩虹  
**音樂：** DAWN 主題  
**磚塊數：** 42  
**佈局：**（排列呈弧形彩虹，7色各一排，從紅到紫）  
**特殊效果：** 磚塊依顏色編排，破碎時發出對應色彩粒子  
**目標分數（3星）：** 1,800  

---

#### ⬜ 第 3 關：迷宮入口（MAZE GATE）

**主題：** 首次出現金屬磚作為牆壁  
**音樂：** DAWN 主題  
**特殊機制：** 引入 METAL 磚  
**磚塊數：** 44（含8個 METAL 磚）  
**佈局：**（金屬磚形成簡單迷宮通道）  
```
M M M M M M M M M M M M
M 1 1 1 . . . 1 1 1 1 M
M 1 . . . 1 . . . 1 1 M
M 1 . M M 1 M M . 1 1 M
M 1 . . . 1 . . . 1 1 M
M 1 1 1 . . . 1 1 1 1 M
M M M M M M M M M M M M
. . . . . . . . . . . .
```
**目標分數（3星）：** 2,000  

---

#### 💣 第 4 關：炸彈狂歡（BOOM PARTY）

**主題：** 首次大量出現爆炸磚  
**音樂：** DAWN 主題（節奏加快）  
**特殊機制：** 引入 BOMB 磚，學習連鎖爆炸  
**磚塊數：** 48  
**提示：** 策略性擊中爆炸磚可清除大片區域  
**目標分數（3星）：** 3,200  

---

#### ⭐ 第 5 關：五星陣（STAR ARRAY）

**主題：** 磚塊排列成五角星圖案  
**音樂：** DAWN 主題結尾（轉場段落）  
**特殊機制：** 關卡結束後解鎖第2段音樂主題  
**磚塊數：** 55  
**視覺設計：** 磚塊形成清晰的五角星形狀  
**目標分數（3星）：** 3,800  

---

#### 🌆 第 6 關：霓虹大道（NEON AVENUE）

**主題：** 進入城市主題，更快節奏  
**音樂：** NEON CITY 主題（128 BPM，合成波）  
**新增元素：** 球速微幅提升，首次出現 NORMAL_2（硬磚）  
**磚塊數：** 60  
**佈局：** 霓虹燈招牌感，斜角排列  
**目標分數（3星）：** 5,000  

---

#### 🏙️ 第 7 關：摩天之森（SKYSCRAPER）

**主題：** 高聳的磚塊柱群，模擬摩天大樓  
**音樂：** NEON CITY 主題  
**特殊設計：** 每欄磚塊密度不同，形成天際線剪影  
**磚塊數：** 65  
**目標分數（3星）：** 6,500  

---

#### 👻 第 8 關：幽靈街區（GHOST DISTRICT）

**主題：** 引入幽靈磚（會移動的磚塊）  
**音樂：** NEON CITY 主題（加入神秘音效層）  
**特殊機制：** GHOST 磚每1.5秒移動一格（水平往返）  
**磚塊數：** 55（含10個 GHOST 磚）  
**目標分數（3星）：** 7,000  

---

#### ⚡ 第 9 關：電網（ELECTRIC GRID）

**主題：** LASER 磚大量出現，雷射縱橫  
**音樂：** NEON CITY 主題  
**特殊機制：** LASER 磚被破壞後，向下射出一道雷射，碰到擋板扣生命  
**磚塊數：** 58（含14個 LASER 磚）  
**目標分數（3星）：** 8,000  

---

#### 🌀 第 10 關：傳送門矩陣（PORTAL MATRIX）

**主題：** 傳送磚配對，球入一門從另一門出  
**音樂：** NEON CITY 主題結尾（轉場）  
**特殊機制：** PORTAL 磚成對出現（A→B，C→D），球穿越後保持速度但方向改變  
**磚塊數：** 64（含8個 PORTAL 磚，4對）  
**目標分數（3星）：** 10,000  

---

#### 🌌 第 11 關：星際塵埃（STARDUST）

**主題：** 深空探索，孤獨感  
**音樂：** DEEP SPACE 主題（95 BPM，環境電子）  
**新增元素：** NORMAL_3（重裝磚，需3擊）首次大量出現  
**磚塊數：** 70  
**佈局：** 稀疏分散，如星空中的星座  
**目標分數（3星）：** 12,000  

---

#### 🔭 第 12 關：星座圖（CONSTELLATION）

**主題：** 磚塊排列成獵戶座星座圖案  
**音樂：** DEEP SPACE 主題  
**特殊效果：** 磚塊連線光效（破碎時點亮相連線段）  
**磚塊數：** 68  
**目標分數（3星）：** 13,500  

---

#### 🌑 第 13 關：黑洞引力（BLACK HOLE）

**主題：** 場中央有一個「重力區」影響球的軌跡  
**音樂：** DEEP SPACE 主題  
**特殊機制：** 場中央設有「黑洞」圓形區域，球進入後會被吸引偏轉  
```javascript
// 黑洞重力計算
const dx = blackHole.x - ball.x;
const dy = blackHole.y - ball.y;
const dist = Math.sqrt(dx*dx + dy*dy);
if (dist < 150) {
  const force = 0.1 * (150 - dist) / 150;
  ball.vx += dx/dist * force;
  ball.vy += dy/dist * force;
}
```
**目標分數（3星）：** 15,000  

---

#### 💎 第 14 關：水晶洞穴（CRYSTAL CAVE）

**主題：** 密集的高耐久磚塊  
**音樂：** DEEP SPACE 主題  
**特殊設計：** 大量 STONE 磚（5擊），每擊有晶體碎裂動畫  
**磚塊數：** 50（含20個 STONE 磚）  
**目標分數（3星）：** 20,000  

---

#### 🪐 第 15 關：土星環（SATURN RING）

**主題：** 磚塊排列成橢圓環形，致敬土星  
**音樂：** DEEP SPACE 主題結尾（轉場）  
**特殊設計：** 環形佈局，中央空曠，球在環內外反彈  
**磚塊數：** 72  
**目標分數（3星）：** 18,000  

---

#### ⛈️ 第 16 關：暴風前夕（STORM EVE）

**主題：** 節奏加快，壓力感增強  
**音樂：** STORM 主題（140 BPM，快節奏電子）  
**遊戲變化：** 球速再次提升 +15%  
**磚塊數：** 80  
**目標分數（3星）：** 22,000  

---

#### 🌪️ 第 17 關：龍捲狂潮（TORNADO）

**主題：** 磚塊緩慢旋轉（整體佈局旋轉動畫）  
**音樂：** STORM 主題  
**特殊機制：** 每10秒，整個磚塊群旋轉30度（圓形軌跡移動）  
**磚塊數：** 78  
**目標分數（3星）：** 25,000  

---

#### ⚡ 第 18 關：雷電交加（THUNDERSTRUCK）

**主題：** 大量 LASER 磚 + 快速球速組合  
**音樂：** STORM 主題（加入電子搖滾感）  
**特殊機制：** LASER 磚被打後射出更快、更粗的雷射  
**磚塊數：** 75（含22個 LASER 磚）  
**目標分數（3星）：** 28,000  

---

#### 💥 第 19 關：連鎖爆炸（CHAIN REACTION）

**主題：** 計算好角度，引發連鎖大爆炸  
**音樂：** STORM 主題  
**設計重點：** 大量爆炸磚緊密排列，適當觸發可清版  
**磚塊數：** 90（含35個 BOMB 磚）  
**目標分數（3星）：** 35,000  

---

#### 🌩️ 第 20 關：颱風眼（TYPHOON EYE）

**主題：** 外圍密集磚塊，中央空洞如颱風眼  
**音樂：** STORM 主題結尾（壯闊轉場）  
**特殊設計：** 外圈為金屬磚框 + 多層磚塊，必須先突破外圍  
**磚塊數：** 95  
**目標分數（3星）：** 40,000  

---

#### ✨ 第 21 關：水晶宮（CRYSTAL PALACE）

**主題：** 夢幻 Chiptune 風格，水晶宮殿  
**音樂：** CRYSTAL 主題（110 BPM，輕柔夢幻）  
**新效果：** 磚塊碎裂時散出星形粒子  
**磚塊數：** 85  
**目標分數（3星）：** 38,000  

---

#### 🦋 第 22 關：蝴蝶效應（BUTTERFLY）

**主題：** 磚塊排列成蝴蝶圖案  
**音樂：** CRYSTAL 主題  
**視覺亮點：** 蝴蝶翅膀對稱，兩翼磚塊顏色對應  
**磚塊數：** 88  
**目標分數（3星）：** 42,000  

---

#### 🌸 第 23 關：花瓣雨（PETAL RAIN）

**主題：** 磚塊緩緩向下漂移（不超過界線）  
**音樂：** CRYSTAL 主題  
**特殊機制：** 每15秒，最上方一排磚塊向下移動一格（最多移5格）  
**磚塊數：** 80  
**警示：** 若磚塊碰到底部，遊戲立即結束  
**目標分數（3星）：** 45,000  

---

#### 🎠 第 24 關：旋轉木馬（CAROUSEL）

**主題：** 磚塊以圓形路徑持續旋轉  
**音樂：** CRYSTAL 主題  
**特殊機制：** 磚塊群繞圓心持續旋轉，每關速度不同  
**磚塊數：** 72  
**目標分數（3星）：** 50,000  

---

#### 🔮 第 25 關：水晶核心（CRYSTAL CORE）

**主題：** 關卡中央有一顆「核心水晶」——超強石磚  
**音樂：** CRYSTAL 主題結尾（神聖感轉場）  
**特殊機制：** 中央10擊石磚（CRYSTAL CORE），摧毀後得雙倍分數並觸發全畫面光爆  
**磚塊數：** 90（含1個 CRYSTAL CORE）  
**目標分數（3星）：** 60,000  

---

#### 🕳️ 第 26 關：虛空之門（VOID GATE）

**主題：** 黑暗虛空，挑戰升級  
**音樂：** VOID 主題（105 BPM，暗黑電子）  
**新增：** 磚塊偶爾「消失再出現」（閃爍），挑戰玩家判斷  
**磚塊數：** 95  
**目標分數（3星）：** 55,000  

---

#### 🌑 第 27 關：暗黑物質（DARK MATTER）

**主題：** 大量不可見磚塊（透明，碰到才顯現）  
**音樂：** VOID 主題  
**特殊機制：** 30% 的磚塊為「暗磚塊」，alpha=0，球擊中後才顯示  
**磚塊數：** 90  
**目標分數（3星）：** 58,000  

---

#### 🔒 第 28 關：鎖鏈迷陣（CHAIN MAZE）

**主題：** 護盾磚保護下層重要磚塊  
**音樂：** VOID 主題  
**特殊機制：** SHIELD 磚保護下層磚塊，必須先破壞護盾才能攻擊被保護的磚  
**磚塊數：** 100（含20個 SHIELD 磚）  
**目標分數（3星）：** 65,000  

---

#### ∞ 第 29 關：無盡迴廊（ENDLESS HALL）

**主題：** 超長縱深，10行磚塊  
**音樂：** VOID 主題  
**設計：** 採用10行佈局（最高複雜度），磚塊從頂到中間密集排列  
**磚塊數：** 120  
**目標分數（3星）：** 75,000  

---

#### 💀 第 30 關：骷髏警告（SKULL WARNING）

**主題：** 磚塊排列成骷髏圖案，最惡毒關卡之一  
**音樂：** VOID 主題結尾（轉場，恐怖感）  
**特殊機制：** 骷髏眼睛為 BOMB 磚，擊中後摧毀大片磚塊但觸發雷射  
**磚塊數：** 105  
**目標分數（3星）：** 80,000  

---

#### 🌈 第 31 關：稜鏡分光（PRISM SPLIT）

**主題：** 稜鏡主題，複雜和弦音樂  
**音樂：** PRISM 主題（118 BPM，迷幻電子）  
**新元素：** RAINBOW 磚大量出現，效果隨機  
**磚塊數：** 100  
**目標分數（3星）：** 85,000  

---

#### 🪞 第 32 關：鏡像世界（MIRROR WORLD）

**主題：** 上下對稱佈局，球需雙向作戰  
**音樂：** PRISM 主題  
**特殊機制：** 頂部和底部均有磚塊，球在中間反彈  
**設計：** 頂部磚塊正常，底部磚塊從底部伸出（倒置）  
**磚塊數：** 110  
**目標分數（3星）：** 90,000  

---

#### 🎭 第 33 關：多重人格（MULTIPLE IDENTITY）

**主題：** 多種磚塊類型混雜，考驗策略  
**音樂：** PRISM 主題  
**特殊設計：** 同時使用幾乎所有磚塊類型，道具密集  
**磚塊數：** 108  
**目標分數（3星）：** 95,000  

---

#### 🎪 第 34 關：魔術師（MAGICIAN）

**主題：** 磚塊在破壞後「變形」成另一種磚塊  
**音樂：** PRISM 主題  
**特殊機制：** `NORMAL_1` 磚塊被打碎後，有 20% 機率重生為 `NORMAL_2`  
**磚塊數：** 95  
**目標分數（3星）：** 100,000  

---

#### 🔺 第 35 關：稜鏡頂點（PRISM APEX）

**主題：** 磚塊排列成三角形稜鏡圖案  
**音樂：** PRISM 主題結尾（宏大轉場）  
**特殊設計：** 三角形輪廓為金屬磚，內部密集普通磚，需從底部缺口切入  
**磚塊數：** 115  
**目標分數（3星）：** 110,000  

---

#### 🌟 第 36 關：超新星（SUPERNOVA）

**主題：** 最壯闊的音效主題登場  
**音樂：** NOVA 主題（132 BPM，管弦合成）  
**新效果：** 球軌跡留下星光拖尾，粒子效果升級  
**磚塊數：** 120  
**目標分數（3星）：** 120,000  

---

#### 🌌 第 37 關：星系碰撞（GALAXY CLASH）

**主題：** 兩組磚塊群從兩側向中間移動  
**音樂：** NOVA 主題  
**特殊機制：** 兩組磚塊群每20秒向中央移動一格，碰撞後停止  
**磚塊數：** 130  
**目標分數（3星）：** 130,000  

---

#### 🔆 第 38 關：白矮星（WHITE DWARF）

**主題：** 中央超強核心磚，周圍軌道磚  
**音樂：** NOVA 主題  
**特殊設計：** 中央15擊「白矮星」核心，外圍繞圈的普通磚不斷重生（每30秒補滿一圈）  
**磚塊數：** 98 + 重生機制  
**目標分數（3星）：** 145,000  

---

#### 💫 第 39 關：脈衝星（PULSAR）

**主題：** 磚塊規律地出現/消失（脈衝節律）  
**音樂：** NOVA 主題  
**特殊機制：** 磚塊以 2 秒周期閃爍，消失時球可穿越，顯現時球反彈  
**磚塊數：** 110  
**目標分數（3星）：** 155,000  

---

#### 🪐 第 40 關：行星際（INTERSTELLAR）

**主題：** 五個「星球」磚塊群，各自旋轉  
**音樂：** NOVA 主題結尾（最宏大段落）  
**特殊設計：** 5個獨立圓形磚塊群各自以不同速度旋轉  
**磚塊數：** 135  
**目標分數（3星）：** 170,000  

---

#### ⚙️ 第 41 關：鋼鐵廠（STEEL MILL）

**主題：** 工業電子主題，機械感  
**音樂：** CORE 主題（150 BPM，工業電子）  
**磚塊特性：** 幾乎全為高耐久磚，少量道具  
**磚塊數：** 110（60% 為 STONE 磚）  
**目標分數（3星）：** 180,000  

---

#### 🤖 第 42 關：機器人軍團（ROBOT ARMY）

**主題：** 磚塊排列成機器人形狀（像素藝術風格）  
**音樂：** CORE 主題  
**特殊設計：** 整面磚塊構成一個機器人像素圖，眼睛為BOMB磚，心臟為POWER磚  
**磚塊數：** 140  
**目標分數（3星）：** 200,000  

---

#### 🏭 第 43 關：核心爐（REACTOR CORE）

**主題：** 中央有持續旋轉的危險磚塊群  
**音樂：** CORE 主題  
**特殊機制：** 中央8個磚塊持續快速旋轉，球的反射角度計算更複雜  
**磚塊數：** 125  
**目標分數（3星）：** 220,000  

---

#### ⚗️ 第 44 關：試煉熔爐（TRIAL BY FIRE）

**主題：** 同時有多顆球（三球模式，不可道具改變）  
**音樂：** CORE 主題  
**特殊機制：** 關卡開始即持有三球道具，失一球不扣生命（直到最後一球落底才算失一命）  
**磚塊數：** 145  
**目標分數（3星）：** 250,000  

---

#### 🔩 第 45 關：末日機甲（DOOM MECH）

**主題：** 全場最高密度的磚塊，速度最快  
**音樂：** CORE 主題結尾（機械感極致）  
**磚塊數：** 160（最高密度）  
**球速：** 基礎速度+30%  
**目標分數（3星）：** 290,000  

---

#### ♾️ 第 46 關：無限迴響（INFINITE ECHO）

**主題：** 最終章開始，混合所有元素  
**音樂：** INFINITY 主題（160 BPM，終極混合）  
**特殊機制：** 每次失球，場上磚塊重新隨機重排（但總數不增加）  
**磚塊數：** 150  
**目標分數（3星）：** 320,000  

---

#### 🌀 第 47 關：時空扭曲（TIME WARP）

**主題：** 時間加速/減速效果輪替  
**音樂：** INFINITY 主題  
**特殊機制：** 每15秒，遊戲速度在 ×0.5 和 ×2 之間切換（共計 5 次循環），並播放時間扭曲音效  
**磚塊數：** 145  
**目標分數（3星）：** 350,000  

---

#### 🎲 第 48 關：混沌法則（CHAOS LAW）

**主題：** 所有隨機效果疊加  
**音樂：** INFINITY 主題  
**特殊機制：**  
  - 磚塊碎裂後隨機在另一位置重生（20%機率）  
  - 每30秒隨機切換球速  
  - 所有道具效果持續時間隨機（50%–150%）  
**磚塊數：** 155  
**目標分數（3星）：** 400,000  

---

#### 👑 第 49 關：王者試煉（KING'S TRIAL）

**主題：** 所有困難機制的大集合  
**音樂：** INFINITY 主題（高潮段落）  
**特殊設計：**  
  - 全場 STONE 磚（5擊）  
  - 幽靈磚在場中移動  
  - 護盾磚保護最難位置  
  - 磚塊向下漂移（每20秒）  
  - 無道具掉落  
**磚塊數：** 170  
**目標分數（3星）：** 500,000  

---

#### 🏆 第 50 關：無限風暴（INFINITE STORM）

**主題：** 終極決戰，所有元素最強組合  
**音樂：** INFINITY 主題（最終高潮，加入全部音樂主題混音）  
**特殊機制（全部同時啟動）：**  
  - 磚塊旋轉 + 下漂  
  - 重生機制（50%）  
  - 黑洞引力  
  - 時間扭曲（×0.7 / ×1.5 循環）  
  - 幽靈磚群移動  
  - 關底 BOSS 磚（100擊，被打後每25擊反擊一道雷射）  
**磚塊數：** 200（含BOSS磚）  
**目標分數（3星）：** 1,000,000  
**通關獎勵：** 解鎖「無盡模式」（Endless Mode），畫面特效爆發，播放完整勝利音樂  

---

## 10. 行動裝置支援規範

### 10.1 觸控操控設計

```javascript
// 觸控控制擋板——跟隨手指X位置
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // 防止頁面滾動
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
  // 擋板中心跟隨手指，不超出邊界
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, touchX - paddle.width/2));
}, { passive: false });

// 觸控開始 — 若球黏在擋板上，則釋放
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (gameState === 'READY') launchBall();
  if (paddle.hasSticky && ball.stuck) releaseBall();
  if (paddle.hasLaser) fireLaser();
}, { passive: false });
```

### 10.2 行動裝置 UI 調整

```css
/* 手機橫向：縮小 HUD 高度，最大化遊戲區 */
@media (max-width: 767px) and (orientation: landscape) {
  .hud { height: 36px; font-size: 16px; }
  .game-canvas { height: calc(100vh - 36px); }
}

/* 手機直向：上下佈局，遊戲在上，控制在下 */
@media (max-width: 767px) and (orientation: portrait) {
  .hud { height: 44px; font-size: 18px; }
  .game-canvas { width: 100vw; height: 75vw; }
}

/* 觸控友好按鈕：最小點擊區域 44×44px */
button, .menu-item {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 20px;
  font-size: 18px; /* 手機上按鈕文字最小 18px */
}
```

### 10.3 行動裝置專屬 UI 元件

```
行動裝置新增元素：

1. 暫停按鈕（手機右上角）：
   - 尺寸：48×48px，半透明背景
   - 圖示：暫停符號 ⏸

2. 遊戲開始前提示：
   - 顯示：「觸碰畫面移動擋板」
   - 字體：20px，3秒後淡出

3. 道具圖示（手機底部欄）：
   - 顯示當前生效的道具圖示及剩餘時間
   - 圓形進度條倒計時

4. 虛擬按鈕（黏板/雷射）：
   - 當有黏板或雷射道具時，顯示「釋放」按鈕
   - 尺寸：80×44px，右下角
```

### 10.4 觸覺反饋（Haptic Feedback）

```javascript
// 支援振動API的裝置提供觸覺反饋
function hapticFeedback(pattern) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// 使用時機
hapticFeedback([10]);        // 球擊中擋板（10ms短振）
hapticFeedback([20, 10, 20]); // 磚塊爆炸（長-短-長）
hapticFeedback([50]);         // 失球（50ms強振）
hapticFeedback([200]);        // 遊戲結束（200ms長振）
```

### 10.5 螢幕方向鎖定建議

```javascript
// 建議橫向遊玩（行動裝置）
if (screen.orientation && screen.orientation.lock) {
  screen.orientation.lock('landscape').catch(() => {
    // 無法鎖定時，顯示「建議橫向遊玩」提示
    showOrientationHint();
  });
}
```

---

## 11. 分數與排行榜系統

### 11.1 分數計算公式

```javascript
// 基礎分數
const baseScore = brick.baseScore;

// 連擊加成（Combo）
const comboMultiplier = 1 + Math.floor(combo / 5) * 0.5; // 每5連擊+0.5倍

// 道具加成
const powerupMultiplier = hasDoubleScore ? 2 : 1;

// 難度加成
const difficultyMultiplier = { EASY: 0.7, NORMAL: 1.0, HARD: 1.5 }[difficulty];

// 時間加成（快速通關有獎勵）
const timeBonus = Math.max(0, 1 + (timeLimit - elapsedTime) / timeLimit * 0.5);

// 最終分數
const finalScore = Math.round(baseScore * comboMultiplier * powerupMultiplier * difficultyMultiplier * timeBonus);
```

### 11.2 星等評定標準

每關有獨立的3星目標分數（已在關卡設計中標明）：

| 星等 | 條件 |
|------|------|
| ⭐ 1星 | 完成關卡（無論分數） |
| ⭐⭐ 2星 | 達到目標分數的60% |
| ⭐⭐⭐ 3星 | 達到目標分數（含時間加成） |

### 11.3 本地排行榜

```javascript
// 儲存結構（localStorage）
const leaderboard = {
  entries: [
    { name: "PLAYER", score: 1234567, level: 50, date: "2025-01-01", stars: 145 },
    // ...最多儲存 20 筆
  ]
};
```

排行榜畫面顯示：
- 前10名，每行顯示名次、名稱、分數、通關關數、星數、日期
- 字體尺寸：排名 **28px**，名稱 **22px**，分數 **24px**（等寬字體）

---

## 12. 設定系統

### 12.1 設定介面設計規範

```
設定畫面佈局（行動裝置優先）：

┌─────────────────────────────┐
│  ⚙️  設定                    │  ← 32px 標題
├─────────────────────────────┤
│                             │
│  🎵 音樂音量                │  ← 22px 標籤
│  [════════●────────] 70%   │  ← 滑桿，拖曳區域 44px高
│                             │
│  🔊 音效音量                │
│  [══════════════●──] 80%   │
│                             │
│  ⚡ 球速                    │
│  [ 慢 ] [ ● 普通 ] [ 快 ]  │  ← 三選一按鈕組
│                             │
│  🎯 難度                    │
│  [ 簡單 ] [ ● 普通 ] [ 困難 ] │
│                             │
│  ✨ 粒子效果   [ ● ON ]     │  ← 開關，ON/OFF
│                             │
│  📳 螢幕震動   [ ● ON ]     │
│                             │
│  🌏 語言                    │
│  [ ● 繁中 ] [ 簡中 ] [ EN ] │
│                             │
│  ┌──────────────────────┐   │
│  │    ← 返回主選單       │   │  ← 28px 按鈕
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### 12.2 即時設定預覽

- 調整音量滑桿時，立即播放「測試音效」（0.5秒）
- 切換粒子效果時，畫面立即出現示範粒子
- 切換語言後，所有介面文字即時更新（無需重啟）

---

## 13. 存檔與進度系統

### 13.1 localStorage 儲存結構

```javascript
const saveData = {
  version: "1.0.0",
  
  // 進度
  progress: {
    unlockedLevels: 25,    // 已解鎖到第25關
    levelStars: [3,3,2,3,1,...], // 每關星數（50個值）
    totalStars: 125,
    highScore: 5678900,
  },
  
  // 設定
  settings: {
    musicVolume: 70,
    sfxVolume: 80,
    ballSpeed: 'NORMAL',
    difficulty: 'NORMAL',
    particles: true,
    screenShake: true,
    language: 'zh-TW',
    controlMode: 'AUTO',
  },
  
  // 排行榜
  leaderboard: [...],
  
  // 統計
  stats: {
    totalBricksDestroyed: 12500,
    totalPlayTime: 7200,   // 秒
    totalGamesPlayed: 45,
    maxCombo: 87,
    totalPowerupsCollected: 234,
  }
};
```

### 13.2 自動存檔

- 每關結束後自動儲存
- 設定更改後立即儲存
- 存檔時顯示短暫的「💾 已儲存」提示（底部，2秒淡出）

---

## 14. 無障礙設計

### 14.1 基本無障礙規範

| 規範 | 實作方式 |
|------|----------|
| 鍵盤操控 | 所有選單均可透過方向鍵 + Enter 操作 |
| 對比度 | 所有文字對比度達 WCAG AA 標準（4.5:1） |
| 字體縮放 | 支援瀏覽器字體縮放（不破版） |
| 暫停功能 | 任何時刻均可暫停 |
| 音效提示 | 重要事件均有獨特音效對應 |

### 14.2 鍵盤操控對照表

| 按鍵 | 遊戲中動作 | 選單中動作 |
|------|------------|------------|
| `←` / `A` | 擋板左移 | 左移選項 |
| `→` / `D` | 擋板右移 | 右移選項 |
| `Space` | 發球 / 發射雷射 / 釋放黏板 | 確認 |
| `ESC` / `P` | 暫停 | 返回 |
| `Enter` | — | 確認 |
| `M` | 靜音/解除靜音 | — |
| `+` / `-` | 音量增減 | — |
| `F` | 全螢幕切換 | 全螢幕切換 |

---

## 15. 效能規範

### 15.1 效能目標

| 指標 | 目標值 |
|------|--------|
| 幀率 | 60 FPS（桌機），30 FPS（低端手機） |
| 載入時間 | 單檔 < 500ms |
| 記憶體使用 | < 100MB |
| Canvas 更新 | 每幀完整清除並重繪 |

### 15.2 最佳化策略

```javascript
// 1. 離屏 Canvas 預渲染靜態元素
const offscreenCanvas = new OffscreenCanvas(800, 600);
const offCtx = offscreenCanvas.getContext('2d');
// 預先繪製背景、星空到離屏 Canvas，每幀直接 blit

// 2. 粒子池（Object Pool），避免頻繁 GC
class ParticlePool {
  constructor(size = 500) {
    this.pool = Array.from({ length: size }, () => new Particle());
    this.active = [];
  }
  get() { return this.pool.pop() || new Particle(); }
  release(p) { p.reset(); this.pool.push(p); }
}

// 3. 磚塊碰撞空間分割（只檢測球周圍範圍的磚塊）
function getNearbyBricks(ball) {
  const col = Math.floor(ball.x / BRICK_CELL_W);
  const row = Math.floor(ball.y / BRICK_CELL_H);
  // 只檢測 ±2 格範圍
  return brickGrid.slice(row-2, row+3).flatMap(r => r.slice(col-2, col+3)).filter(Boolean);
}

// 4. requestAnimationFrame + deltaTime 補正
let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = Math.min((timestamp - lastTime) / 16.67, 3); // 最大3幀補正
  lastTime = timestamp;
  update(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}
```

### 15.3 低效能模式（自動偵測）

```javascript
// 偵測到持續低於 30FPS，自動降低效果
let fpsHistory = [];
function autoQualityAdjust(fps) {
  fpsHistory.push(fps);
  if (fpsHistory.length > 60) fpsHistory.shift();
  const avgFps = fpsHistory.reduce((a,b) => a+b) / fpsHistory.length;
  if (avgFps < 30) {
    settings.particles = false;      // 關閉粒子
    settings.ballTrail = false;      // 關閉拖尾
    settings.backgroundStars = false; // 關閉背景星星
  }
}
```

---

## 附錄 A：磚塊顏色對照表

| 磚塊類型 | 主色 | 邊框色 | 發光色 |
|----------|------|--------|--------|
| NORMAL_1（紅） | `#ff2d55` | `#ff6b6b` | `#ff2d5544` |
| NORMAL_1（橘） | `#ff9500` | `#ffc947` | `#ff950044` |
| NORMAL_1（黃） | `#ffcc00` | `#ffe066` | `#ffcc0044` |
| NORMAL_1（綠） | `#34c759` | `#6dde8a` | `#34c75944` |
| NORMAL_1（藍） | `#007aff` | `#4da6ff` | `#007aff44` |
| NORMAL_1（紫） | `#af52de` | `#d08eff` | `#af52de44` |
| NORMAL_2 | 同上色但亮度-20% | 裂縫覆蓋 | 同上 |
| NORMAL_3 | 同上色但亮度-35% | 深裂縫 | 同上 |
| STONE | `#636366` | `#8e8e93` | `#63636644` |
| METAL | `#c7c7cc` | `#ffffff` | 無 |
| BOMB | `#ff3b30` | `#ff6961` | `#ff3b3066` |
| GHOST | `#e5e5ea` | `#aeaeb2` | `#e5e5ea88`（半透明）|
| LASER | `#00c7be` | `#5ac8fa` | `#00c7be66` |
| PORTAL | `#5e5ce6` | `#9b99f5` | `#5e5ce688` |
| POWER | `#ffd60a` | `#ffe066` | `#ffd60a88` |
| RAINBOW | 彩虹漸層動畫 | 白色旋轉 | 多色發光 |

---

## 附錄 B：音符頻率對照表（供 Web Audio API 使用）

```javascript
const NOTE_FREQ = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61,
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  // 升號
  'C#3': 138.59, 'D#3': 155.56, 'F#3': 185.00, 'G#3': 207.65, 'A#3': 233.08,
  'C#4': 277.18, 'D#4': 311.13, 'F#4': 369.99, 'G#4': 415.30, 'A#4': 466.16,
  'C#5': 554.37, 'D#5': 622.25, 'F#5': 739.99, 'G#5': 830.61, 'A#5': 932.33,
};
```

---

## 附錄 C：開發建議時程

| 階段 | 內容 | 預估工時 |
|------|------|----------|
| P1 | 基礎架構、Canvas 渲染、物理引擎 | 16 小時 |
| P2 | 擋板/球/碰撞完整實作 | 12 小時 |
| P3 | 磚塊系統（所有類型）+ 道具系統 | 20 小時 |
| P4 | 音頻引擎（音效 + 音樂合成） | 20 小時 |
| P5 | UI 系統（選單、HUD、設定、排行榜） | 16 小時 |
| P6 | 50 關關卡內容設計與測試 | 24 小時 |
| P7 | 行動裝置適配、觸控優化 | 12 小時 |
| P8 | 效能優化、粒子系統、視覺潤色 | 16 小時 |
| P9 | 整合測試、Bug 修復、最終調整 | 12 小時 |
| **合計** | | **≈ 148 小時** |

---

*規格書版本：1.0.0 | 最後更新：2025年*  
*本規格書涵蓋 BRICKSTORM 打磚塊遊戲的完整前端開發規格，可直接作為開發參考文件使用。*
