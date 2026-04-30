# 🏃 無限跑酷（Endless Runner）純前端 Web 遊戲規格書

**文件版本：** v1.0.0
**建立日期：** 2026-04-30
**技術棧：** HTML5 / CSS3 / Vanilla JavaScript（無任何外部框架）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [畫面規格](#3-畫面規格)
4. [遊戲機制](#4-遊戲機制)
5. [角色與物件](#5-角色與物件)
6. [音效與音樂系統](#6-音效與音樂系統)
7. [視覺設計規範](#7-視覺設計規範)
8. [資料結構與狀態管理](#8-資料結構與狀態管理)
9. [檔案結構](#9-檔案結構)
10. [開發里程碑](#10-開發里程碑)

---

## 1. 專案概述

### 1.1 遊戲簡介

《無限跑酷》是一款以瀏覽器為執行環境的橫向卷軸無盡跑酷遊戲。玩家操控一名跑者，在無限生成的賽道上閃避障礙物、收集金幣，存活越久分數越高。

### 1.2 核心設計理念

- **一鍵上手**：單一按鍵（空白鍵 / 上方向鍵 / 點擊 / 觸碰）控制跳躍
- **漸進難度**：遊戲速度隨時間線性加快，障礙物密度提高
- **視覺層次豐富**：多層視差背景營造景深
- **即時回饋**：音效與畫面特效同步呼應玩家行動

### 1.3 目標平台

| 平台 | 解析度範圍 | 輸入方式 |
|------|-----------|---------|
| 桌面瀏覽器 | 1024px ~ 2560px | 鍵盤 / 滑鼠點擊 |
| 平板 | 768px ~ 1024px | 觸控 |
| 手機 | 375px ~ 767px | 觸控（橫向優先） |

### 1.4 瀏覽器相容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 2. 技術架構

### 2.1 核心模組

```
Game Engine
├── GameLoop          - requestAnimationFrame 主迴圈
├── InputManager      - 鍵盤 / 觸控 / 滑鼠事件統一管理
├── SceneManager      - 畫面（Scene）切換管理
├── Renderer          - Canvas 2D 渲染管線
├── PhysicsEngine     - 重力、碰撞偵測
├── EntityManager     - 角色、障礙物、金幣生命週期
├── ParticleSystem    - 粒子特效
├── AudioManager      - 音效與背景音樂（Web Audio API）
├── StorageManager    - localStorage 高分紀錄
└── UIManager         - HUD、主選單、暫停、結算 UI
```

### 2.2 渲染架構

採用 **Canvas 2D API** 分層渲染，由後至前：

| 圖層編號 | 名稱 | 內容 | 捲動速度倍率 |
|---------|------|------|------------|
| 0 | Sky Layer | 漸層天空背景 | 0.0（固定） |
| 1 | Far BG | 遠山 / 城市輪廓 | 0.1 |
| 2 | Mid BG | 中景建築 / 樹木 | 0.3 |
| 3 | Near BG | 近景植物、路燈 | 0.6 |
| 4 | Ground | 地板 Tile | 1.0 |
| 5 | Entity | 角色、障礙物、金幣 | 1.0 |
| 6 | Particle | 粒子特效 | 1.0 |
| 7 | UI | HUD 分數、生命 | 0.0（固定） |

### 2.3 遊戲迴圈

```javascript
// 偽代碼
function gameLoop(timestamp) {
    const delta = timestamp - lastTimestamp;  // 單位：ms
    lastTimestamp = timestamp;

    update(delta);   // 邏輯更新
    render();        // 畫面渲染

    requestAnimationFrame(gameLoop);
}
```

目標幀率：**60 FPS**（使用 delta time 確保不同幀率下行為一致）

### 2.4 碰撞偵測

採用 **AABB（軸對齊邊界框）** 碰撞，並加入 **縮減比例（Shrink Factor）** 避免像素級誤判：

```
玩家碰撞盒 = 角色繪製區域 × 0.75（寬）× 0.85（高）
```

---

## 3. 畫面規格

### 3.1 畫面列表

| 畫面 ID | 名稱 | 說明 |
|--------|------|------|
| `SCENE_MAIN` | 主畫面 | 遊戲標題、開始按鈕、設定入口 |
| `SCENE_GAME` | 遊戲中 | 主要遊戲畫面 + HUD |
| `SCENE_PAUSE` | 暫停 | 半透明遮罩 + 繼續/重玩/回主選單 |
| `SCENE_GAMEOVER` | 遊戲結束 | 分數結算、最高分、重玩 |
| `SCENE_SETTINGS` | 設定 | 音量調整、音效開關 |

---

### 3.2 主畫面（SCENE_MAIN）

#### 3.2.1 視覺佈局

```
┌─────────────────────────────────────────────┐
│   [視差動態背景 - 城市夜景]                     │
│                                             │
│          ██████████████████                │
│          █  ENDLESS RUN  █   ← 遊戲標題     │
│          ██████████████████                │
│                                             │
│              [▶ 開始遊戲]   ← 主按鈕          │
│              [⚙ 設  定]   ← 副按鈕          │
│                                             │
│   最高分：000000     ← 底部 HI-SCORE         │
│                                             │
│   [跑者角色待機動畫在背景中奔跑]               │
└─────────────────────────────────────────────┘
```

#### 3.2.2 元件規格

| 元件 | 位置 | 尺寸 | 樣式 |
|------|------|------|------|
| 遊戲標題 | 畫面 40% 高處，水平居中 | 字體 64px（桌面）/ 36px（手機） | 像素風格字體，橘色發光效果 |
| 開始按鈕 | 標題下方 80px | 240×56px | 橘色背景，懸停縮放 1.05 |
| 設定按鈕 | 開始按鈕下方 16px | 240×48px | 半透明深色 |
| 最高分 | 畫面底部 32px | 自動 | 白色文字，金色數字 |
| 版本號 | 右下角 | 12px | 半透明白色 |

#### 3.2.3 動態效果

- 背景雲朵以 **0.5x 速度** 水平捲動
- 角色在背景中持續 **跑步待機動畫**（不與玩家互動）
- 標題文字具 **呼吸燈（pulse）** 動畫效果
- 開始按鈕具 **垂直浮動（float）** 動畫

#### 3.2.4 進入動畫

1. 背景淡入（300ms）
2. 標題從上方滑入（500ms, ease-out）
3. 按鈕從下方淡入（400ms, delay 200ms）
4. 最高分從底部淡入（300ms, delay 400ms）

---

### 3.3 遊戲畫面（SCENE_GAME）

#### 3.3.1 HUD 佈局

```
┌─────────────────────────────────────────────┐
│ SCORE: 000000  [❤❤❤]  BEST: 000000   [⏸]  │  ← HUD 列
├─────────────────────────────────────────────┤
│                                             │
│   [視差動態背景]                              │
│                                             │
│   ●金幣         ▲障礙物                      │
│                                             │
│ [跑者]                                       │
│─────────────────────────────────────────────│  ← 地板線
└─────────────────────────────────────────────┘
```

#### 3.3.2 HUD 元件規格

| 元件 | 位置 | 說明 |
|------|------|------|
| 即時分數 | 左上角 16px | 每幀更新，字體加粗，白色 |
| 生命格 | 左上分數右側 | 心形圖示，紅色（有）/ 灰色（無） |
| 最高分 | 頂部居中 | 「BEST」標籤 + 金色數字 |
| 暫停按鈕 | 右上角 | 符號，點擊暫停 |
| 速度指示 | 右上角暫停鍵下方 | 「×1.5」倍速顯示（可選） |

#### 3.3.3 分數增加特效

得分時在 HUD 分數旁彈出浮動文字（例如「+10」）並向上淡出，持續 600ms。

---

### 3.4 暫停畫面（SCENE_PAUSE）

```
┌─────────────────────────────────────────────┐
│                                             │
│          ░░░░░░[遊戲畫面模糊快照]░░░░░░       │
│                                             │
│         ┌───────────────────┐              │
│         │    ⏸  已暫停       │              │
│         │                   │              │
│         │   [▶ 繼續遊戲]     │              │
│         │   [🔄 重新開始]    │              │
│         │   [🏠 主選單]      │              │
│         └───────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
```

- 背景套用 **CSS backdrop-filter: blur(8px)** + 深色半透明蒙版
- 模態框以 **縮放動畫（scale 0.8 → 1.0）** 展開，duration 250ms

---

### 3.5 遊戲結束畫面（SCENE_GAMEOVER）

```
┌─────────────────────────────────────────────┐
│                                             │
│            💀 GAME OVER                    │
│                                             │
│         ┌───────────────────┐              │
│         │  YOUR SCORE       │              │
│         │    012345         │  ← 數字滾動動畫 │
│         │                   │              │
│         │  BEST SCORE       │              │
│         │    098765  👑      │  ← 破紀錄閃爍 │
│         │                   │              │
│         │   [🔄 再玩一次]    │              │
│         │   [🏠 回主選單]    │              │
│         └───────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
```

- 分數以 **數字滾動動畫** 從 0 計數至最終分數（1200ms）
- 若破紀錄：顯示「🎉 NEW RECORD!」閃爍文字 + 彩帶粒子特效
- 「再玩一次」按鈕具 **橘色外框光暈** 強調

---

### 3.6 設定畫面（SCENE_SETTINGS）

```
┌─────────────────────────────────────────────┐
│                                             │
│         ⚙ 設定                              │
│                                             │
│   背景音樂  [════════●────] 70%  [🔇/🔊]   │
│                                             │
│   音  效    [═══════════●──] 90%  [🔇/🔊]  │
│                                             │
│   震動效果  [ ON / OFF ]   （手機裝置限定）    │
│                                             │
│   畫面品質  [ 高 / 中 / 低 ]                 │
│             （影響粒子特效數量）               │
│                                             │
│             [✓ 儲存並返回]                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4. 遊戲機制

### 4.1 基本操作

| 動作 | 輸入方式 |
|------|---------|
| 跳躍 | 空白鍵 / ↑ 方向鍵 / 點擊 / 觸碰畫面 |
| 二段跳 | 在空中再次輸入跳躍 |
| 暫停 | Esc / P 鍵 / 點擊暫停按鈕 |

### 4.2 物理參數

| 參數 | 初始值 | 說明 |
|------|-------|------|
| `gravity` | `0.6` px/frame² | 向下重力加速度 |
| `jumpForce` | `-15` px/frame | 跳躍初速度（負值 = 向上） |
| `doubleJumpForce` | `-12` px/frame | 二段跳初速度 |
| `maxFallSpeed` | `20` px/frame | 最大下落速度 |
| `initialSpeed` | `5` px/frame | 初始世界捲動速度 |
| `maxSpeed` | `20` px/frame | 最高世界捲動速度 |
| `speedIncrement` | `0.001` px/frame/frame | 每幀加速量 |

### 4.3 難度曲線

| 時間（秒） | 世界速度倍率 | 障礙物生成間距（px） | 事件 |
|-----------|------------|-------------------|------|
| 0 ~ 30 | 1.0× | 600 ~ 900 | 教學緩慢期 |
| 30 ~ 60 | 1.2× | 450 ~ 700 | 正常節奏 |
| 60 ~ 120 | 1.5× | 350 ~ 550 | 加速 |
| 120 ~ 180 | 1.8× | 280 ~ 450 | 高強度 |
| 180+ | 2.0×（上限） | 220 ~ 380 | 極限挑戰 |

### 4.4 分數系統

| 事件 | 分數 |
|------|------|
| 存活（每秒） | +10 |
| 收集金幣（一般） | +50 |
| 收集金幣（紅色稀有） | +200 |
| 成功越過障礙物 | +25 |
| 連續跳過 5 個障礙物（Combo） | 額外 +150 |

### 4.5 生命系統

- 初始生命：**3 顆**
- 碰撞障礙物扣 1 顆生命，觸發 **無敵時間 2 秒**（角色閃爍）
- 生命為 0 → 觸發遊戲結束
- **無額外獲得生命機制**（設計選擇，可在後續版本擴充）

### 4.6 道具系統（選配，v1.1）

| 道具 | 外觀 | 效果 | 持續時間 |
|------|------|------|---------|
| 磁鐵 | 藍色磁鐵圖示 | 自動吸引附近金幣 | 8 秒 |
| 無敵星 | 金色閃爍星星 | 免疫障礙物傷害 | 5 秒 |
| 2× 分數 | 紫色 ×2 徽章 | 分數加倍 | 10 秒 |

---

## 5. 角色與物件

### 5.1 主角（Player）

#### 5.1.1 動畫狀態機

```
[待機/跑步] ──跳躍──> [上升] ──到達頂點──> [下降] ──落地──> [跑步]
     │                   │
     │           [二段跳觸發]──> [二段跳上升]
     │
[碰撞障礙物]──> [受傷閃爍（2秒）]──> [跑步]
     │
[生命歸零]──> [死亡倒地]──> [GAME OVER]
```

#### 5.1.2 精靈動畫規格

| 狀態 | 影格數 | 播放速率（FPS） |
|------|-------|--------------|
| 跑步 | 8 | 12 |
| 跳躍（上升） | 4 | 10 |
| 跳躍（下降） | 4 | 10 |
| 受傷 | 2（交替閃爍） | 8 |
| 死亡 | 6 | 8（播放一次） |

#### 5.1.3 尺寸規格

- 繪製尺寸：64×64 px（桌面）/ 48×48 px（手機）
- 碰撞盒：48×54 px（桌面）/ 36×41 px（手機）
- 初始位置：畫面左側 1/5 處，地板以上

---

### 5.2 障礙物（Obstacles）

| 類型 ID | 名稱 | 外觀 | 尺寸 | 碰撞形狀 | 生成條件 |
|--------|------|------|------|---------|---------|
| `OBS_LOW` | 矮障礙 | 石頭 / 圓桶 | 48×40 | 矩形 | 全程 |
| `OBS_MID` | 中障礙 | 柵欄 / 箱子 | 48×72 | 矩形 | 30 秒後 |
| `OBS_HIGH` | 高障礙 | 長矛 / 高牆 | 48×96 | 矩形 | 60 秒後 |
| `OBS_FLY` | 飛行障礙 | 飛鳥 / 蝙蝠 | 64×32 | 矩形 | 60 秒後，高度隨機 |
| `OBS_COMBO` | 組合障礙 | 矮+飛組合 | 複合 | 多矩形 | 90 秒後 |

#### 5.2.1 生成演算法

```javascript
// 偽代碼：確保障礙物間距合理，避免無解情況
function spawnObstacle() {
    const minGap = MAX(minObstacleGap, playerJumpDistance * 1.2);
    const gap = randomBetween(minGap, maxObstacleGap);
    const type = weightedRandom(obstacleWeights[currentDifficulty]);
    spawnAt(lastObstacleX + gap, type);
}
```

---

### 5.3 金幣（Coins）

| 類型 | 顏色 | 分數 | 生成機率 |
|------|------|------|---------|
| 一般金幣 | 金黃 | +50 | 60% |
| 銀幣 | 銀色 | +30 | 25% |
| 紅色稀有幣 | 深紅 | +200 | 15% |

- 以 **弧形排列** 或 **直線串列** 方式生成，引導玩家跳躍路徑
- 收集動畫：金幣旋轉縮小消失（6 影格，100ms）
- 每枚金幣具有 **旋轉待機動畫**（360° 循環，8 影格）

---

### 5.4 地板（Ground）

- Tile 寬度：64px（無縫橫向銜接）
- 地板 Y 軸位置：畫面高度 × 0.75
- 地板上方可繪製草地紋理或石板紋理（主題可切換）

---

## 6. 音效與音樂系統

### 6.1 系統架構

採用 **Web Audio API**（`AudioContext`）實現完整音訊管線，支援音量控制、淡入淡出、音效池。

```
AudioContext
├── MusicGainNode       ← 控制音樂主音量
│   └── BGM Source（BufferSource / OscillatorChain）
├── SFXGainNode         ← 控制音效主音量
│   ├── SFX Pool [0..7] ← 最多同時播放 8 個音效
│   └── ...
└── MasterGainNode      ← 全局主音量
```

### 6.2 背景音樂（BGM）

#### 6.2.1 音樂列表

| 音樂 ID | 用途 | 風格 | 時長 | 迴圈 |
|--------|------|------|------|------|
| `bgm_menu` | 主畫面 | 輕快像素風電子音樂 | 60s | ✅ |
| `bgm_game` | 遊戲中 | 節奏感強烈、速度感 | 120s | ✅ |
| `bgm_game_fast` | 高速階段（120秒後） | BPM 加快版本 | 60s | ✅ |
| `bgm_gameover` | 遊戲結束 | 短促降調音效 | 3s | ❌ |

#### 6.2.2 音樂切換規則

```
主畫面開啟     → 播放 bgm_menu（淡入 500ms）
開始遊戲       → bgm_menu 淡出 300ms → bgm_game 淡入 500ms
遊戲達 120 秒  → bgm_game 淡出 500ms → bgm_game_fast 淡入 500ms
遊戲結束       → 當前 BGM 立即停止 → 播放 bgm_gameover
回主選單       → bgm_menu 淡入 500ms
```

#### 6.2.3 程式音樂備案（無音訊檔情況）

若無外部音訊檔案，使用 **Web Audio API Oscillator** 程式化生成 8-bit 像素風音樂：

```javascript
// 示例：簡易 BGM 音符序列
const melodyNotes = [
    { note: 'C4', duration: 0.25 },
    { note: 'E4', duration: 0.25 },
    { note: 'G4', duration: 0.25 },
    { note: 'C5', duration: 0.5 },
    // ...
];

function playNote(frequency, duration, startTime) {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';  // 8-bit 音色
    osc.frequency.value = frequency;
    osc.connect(musicGainNode);
    osc.start(startTime);
    osc.stop(startTime + duration);
}
```

---

### 6.3 音效（SFX）

#### 6.3.1 音效清單

| 音效 ID | 觸發時機 | 音色描述 | 時長 | 優先級 |
|--------|---------|---------|------|-------|
| `sfx_jump` | 玩家跳躍 | 輕快上升音 | 0.15s | 高 |
| `sfx_double_jump` | 玩家二段跳 | 較高音調跳躍音 | 0.15s | 高 |
| `sfx_land` | 玩家落地 | 短促碰撞聲 | 0.1s | 中 |
| `sfx_coin` | 收集金幣 | 清脆叮鈴聲 | 0.2s | 中 |
| `sfx_coin_rare` | 收集稀有金幣 | 較長獎勵音調 | 0.4s | 中 |
| `sfx_hit` | 碰撞障礙物 | 低沉衝擊音 | 0.3s | 高 |
| `sfx_die` | 死亡 | 降調失敗音效 | 0.8s | 最高 |
| `sfx_btn_click` | 點擊按鈕 | 輕微介面點擊音 | 0.08s | 低 |
| `sfx_countdown` | 遊戲開始倒數 | 3-2-1-Go！音效 | 0.2s | 高 |
| `sfx_combo` | 達成 Combo | 上揚連擊音效 | 0.3s | 中 |
| `sfx_new_record` | 破紀錄 | 勝利號角短音 | 1.0s | 最高 |
| `sfx_powerup` | 收集道具 | 閃爍增強音效 | 0.4s | 中 |
| `sfx_speed_up` | 速度提升 | 加速引擎聲 | 0.5s | 低 |

#### 6.3.2 程式化音效生成（Web Audio API 範例）

所有音效均可以 Web Audio API 即時合成，無需任何外部音訊資源：

```javascript
const AudioSynth = {

    // 跳躍音效：快速上升的正弦波
    jump(ctx, gainNode) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(gainNode);
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    },

    // 金幣音效：高頻清脆叮聲
    coin(ctx, gainNode) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(gainNode);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    },

    // 碰撞音效：低頻噪音衝擊
    hit(ctx, gainNode) {
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const source = ctx.createBufferSource();
        const biquad = ctx.createBiquadFilter();
        biquad.type = 'lowpass';
        biquad.frequency.value = 200;
        source.buffer = buffer;
        source.connect(biquad);
        biquad.connect(gainNode);
        source.start(ctx.currentTime);
    },

    // 死亡音效：下降音調
    die(ctx, gainNode) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(gainNode);
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
    }
};
```

#### 6.3.3 音效池（Sound Pool）

為避免快速觸發同一音效（如密集金幣收集）造成音訊堆疊失真，使用音效池機制：

```javascript
class SoundPool {
    constructor(ctx, synthFn, poolSize = 4) {
        this.pool = [];
        this.index = 0;
        // 預創建 poolSize 個可重用節點
    }

    play() {
        // 輪詢使用池中節點，若前一個仍在播放則覆蓋
        const slot = this.pool[this.index % this.pool.length];
        slot.stop();
        slot.play();
        this.index++;
    }
}
```

### 6.4 音量控制規格

| 控制項 | 預設值 | 範圍 | 儲存至 localStorage |
|-------|-------|------|-------------------|
| 主音量（Master） | 1.0 | 0.0 ~ 1.0 | `er_vol_master` |
| 音樂音量（BGM） | 0.7 | 0.0 ~ 1.0 | `er_vol_bgm` |
| 音效音量（SFX） | 0.9 | 0.0 ~ 1.0 | `er_vol_sfx` |

### 6.5 瀏覽器自動播放政策處理

現代瀏覽器禁止在使用者互動前播放音訊：

```javascript
// 在第一次使用者輸入事件（click/keydown/touchstart）時初始化 AudioContext
document.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        resumeAudio();
    }
}, { once: true });

// 處理 AudioContext 被 Suspend 的情況（頁面切換後返回）
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        audioCtx.suspend();
    } else {
        audioCtx.resume();
    }
});
```

---

## 7. 視覺設計規範

### 7.1 色彩系統

#### 主題色板（賽博朋克霓虹夜城）

| 用途 | 色值 | 說明 |
|------|------|------|
| 主色（橘） | `#FF6B35` | CTA 按鈕、分數、重點強調 |
| 輔色（青） | `#00D4FF` | 金幣、速度特效、連擊提示 |
| 深背景 | `#0A0A1A` | 天空背景底色 |
| 中景 | `#1A1A3E` | 遠景建築色 |
| 地板 | `#2D2D5A` | 地板基礎色 |
| 白文字 | `#F0F0FF` | 主要文字 |
| 金色 | `#FFD700` | 最高分、金幣、獎勵文字 |
| 危險紅 | `#FF3B3B` | 障礙物、扣血提示 |
| 成功綠 | `#44FF88` | 道具拾取、記錄突破 |

### 7.2 字型規範

| 層級 | 字型 | 大小（桌面/手機） | 用途 |
|------|------|----------------|------|
| 標題 | `'Press Start 2P'`（Google Fonts） | 48px / 28px | 遊戲標題 |
| 數字 | `'Orbitron'`（Google Fonts） | 32px / 20px | 分數、計時 |
| UI 文字 | `'Press Start 2P'` | 14px / 10px | 按鈕、標籤 |
| 說明文字 | `'Courier New'`（系統字） | 12px / 10px | 次要說明 |

### 7.3 粒子特效規格

| 特效名稱 | 觸發時機 | 粒子數量 | 顏色 | 持續時間 |
|--------|---------|---------|------|---------|
| 跑步塵埃 | 持續跑步 | 2 顆/幀 | 灰棕色 | 400ms |
| 跳躍塵埃 | 起跳瞬間 | 10 顆 | 白色 | 300ms |
| 落地衝擊 | 落地瞬間 | 15 顆 | 白色 + 灰色 | 500ms |
| 金幣收集 | 收集金幣 | 8 顆 | 金黃色 | 600ms |
| 受傷特效 | 碰撞障礙物 | 20 顆 | 紅色 | 800ms |
| 死亡爆炸 | 生命歸零 | 40 顆 | 多色 | 1200ms |
| 破紀錄彩帶 | 最高分突破 | 60 顆 | 彩虹多色 | 2000ms |
| 速度軌跡 | 高速階段 | 4 顆/幀 | 青色漸透明 | 200ms |

---

## 8. 資料結構與狀態管理

### 8.1 全局遊戲狀態

```javascript
const GameState = {
    scene: 'MAIN',          // 當前畫面
    score: 0,               // 即時分數
    bestScore: 0,           // 最高分（從 localStorage 讀取）
    lives: 3,               // 剩餘生命
    speed: 5,               // 當前世界速度
    gameTime: 0,            // 遊戲時間（秒）
    isRunning: false,       // 遊戲是否進行中
    isPaused: false,        // 是否暫停
    comboCount: 0,          // 連擊計數
    doubleJumpUsed: false,  // 二段跳是否已使用
};
```

### 8.2 玩家物件

```javascript
const Player = {
    x: 200,             // 螢幕固定 X 位置
    y: 0,               // 當前 Y 位置（相對地板）
    vy: 0,              // 垂直速度
    width: 64,
    height: 64,
    state: 'run',       // run | jump | fall | hurt | dead
    isInvincible: false,
    invincibleTimer: 0,
    doubleJumpUsed: false,
    spriteFrame: 0,
    frameTimer: 0,
};
```

### 8.3 localStorage 資料結構

```javascript
// key: 'endless_runner_data'
{
    bestScore: 98765,
    settings: {
        volMaster: 1.0,
        volBGM: 0.7,
        volSFX: 0.9,
        quality: 'high',    // 'high' | 'medium' | 'low'
        vibration: true
    },
    totalPlayCount: 42,
    totalDistance: 123456
}
```

---

## 9. 檔案結構

```
endless-runner/
├── index.html              # 入口頁面
├── css/
│   └── style.css           # 全局樣式（UI 層）
├── js/
│   ├── main.js             # 初始化入口
│   ├── game.js             # 主遊戲迴圈
│   ├── renderer.js         # Canvas 渲染
│   ├── physics.js          # 物理引擎
│   ├── entities/
│   │   ├── player.js       # 玩家角色
│   │   ├── obstacle.js     # 障礙物
│   │   ├── coin.js         # 金幣
│   │   └── particle.js     # 粒子系統
│   ├── scenes/
│   │   ├── mainMenu.js     # 主選單邏輯
│   │   ├── gameScene.js    # 遊戲場景邏輯
│   │   ├── pauseScene.js   # 暫停邏輯
│   │   ├── gameOver.js     # 結算邏輯
│   │   └── settings.js     # 設定邏輯
│   ├── audio/
│   │   ├── audioManager.js # 音訊管理器
│   │   └── synth.js        # 程式化音效合成
│   ├── ui/
│   │   ├── hud.js          # HUD 繪製
│   │   └── ui.js           # UI 元件工具
│   └── utils/
│       ├── input.js        # 輸入管理
│       ├── storage.js      # localStorage 工具
│       └── math.js         # 數學工具函數
├── assets/
│   ├── sprites/            # 精靈圖（Sprite Sheet）
│   │   ├── player.png      # 64×64 × N 幀
│   │   ├── obstacles.png   # 障礙物圖集
│   │   └── coins.png       # 金幣圖集
│   ├── tiles/              # 地板、背景 Tile
│   │   ├── ground.png
│   │   ├── bg_far.png
│   │   └── bg_near.png
│   └── audio/              # 音訊檔（可選，有則載入）
│       ├── bgm_menu.mp3
│       ├── bgm_game.mp3
│       └── sfx_*.mp3
└── README.md
```

> **注意：** 所有圖形資源均可以 Canvas 程式繪製取代，音效均可以 Web Audio API 合成取代。專案可做到 **零外部資源依賴**，確保離線可用。

---

## 10. 開發里程碑

### Phase 1 – 核心玩法（1 週）

- [ ] 專案架構建立、Canvas 初始化
- [ ] 遊戲迴圈與 delta time 實作
- [ ] 玩家物理（跳躍、重力、落地）
- [ ] 障礙物生成與碰撞偵測
- [ ] 基本 HUD（分數顯示）

### Phase 2 – 內容完善（1 週）

- [ ] 視差多層背景
- [ ] 金幣系統
- [ ] 生命系統與受傷無敵時間
- [ ] 難度漸進曲線
- [ ] 粒子特效系統

### Phase 3 – 畫面與音訊（1 週）

- [ ] 主畫面設計與動畫
- [ ] 暫停、結算畫面
- [ ] 設定畫面（音量控制）
- [ ] Web Audio API 音效合成
- [ ] 程式化 BGM 實作

### Phase 4 – 完善與優化（3 天）

- [ ] 手機觸控支援、RWD 適配
- [ ] localStorage 高分紀錄
- [ ] 效能優化（Object Pooling、Canvas 優化）
- [ ] 瀏覽器相容測試
- [ ] 最終調整與 Bug 修復

---

## 附錄 A：效能優化指南

- **物件池（Object Pooling）**：障礙物、金幣、粒子不重複建立，回收再用
- **離屏 Canvas（Offscreen Canvas）**：靜態背景 Tile 預渲染至離屏 Canvas
- **視窗外剔除**：超出螢幕左側的物件立即回收
- **requestAnimationFrame 節流**：低效能裝置自動降至 30 FPS 模式
- **圖片壓縮**：精靈圖統一使用 PNG-8 或 WebP 格式

---

## 附錄 B：無障礙設計考量

- 所有按鈕支援鍵盤焦點（Tab 導航）
- 分數變化提供螢幕閱讀器友善的 ARIA Live Region
- 遊戲進行中若使用者按 Escape 自動暫停
- 顏色對比符合 WCAG AA 標準（主要文字）

---

*本規格書版本 v1.0.0，後續功能更新將遞增次版本號。*
