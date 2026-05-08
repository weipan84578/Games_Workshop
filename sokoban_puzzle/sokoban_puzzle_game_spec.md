# 🎮 推箱子解謎遊戲 — 純前端完整規格書

> **專案代號**：BoxMaster  
> **版本**：v1.0.0  
> **最後更新**：2026-05-08  
> **技術棧**：純前端（HTML5 / CSS3 / JavaScript ES2022）  
> **裝置支援**：桌機、平板、手機（RWD + Touch）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [目錄結構](#3-目錄結構)
4. [畫面規格](#4-畫面規格)
5. [遊戲核心邏輯](#5-遊戲核心邏輯)
6. [關卡設計規格](#6-關卡設計規格)
7. [音樂與音效系統](#7-音樂與音效系統)
8. [UI 元件規格](#8-ui-元件規格)
9. [行動裝置支援](#9-行動裝置支援)
10. [資料儲存](#10-資料儲存)
11. [設定系統](#11-設定系統)
12. [擴充設計指引](#12-擴充設計指引)
13. [效能與相容性](#13-效能與相容性)
14. [附錄：60關完整列表](#14-附錄60關完整列表)

---

## 1. 專案概述

### 1.1 遊戲簡介

BoxMaster 是一款純前端推箱子解謎遊戲，靈感來自經典 Sokoban，加入現代視覺設計、沉浸式合成音樂與分難度關卡系統，讓玩家在桌機與手機上都能流暢遊玩。

### 1.2 核心目標

| 目標 | 說明 |
|------|------|
| 零依賴 | 不使用任何第三方框架或函式庫，僅原生 HTML/CSS/JS |
| 行動優先 | 觸控手勢、大字體、大按鈕，手機使用者體驗與桌機相同 |
| 沉浸音效 | 使用 Web Audio API 合成背景音樂與全套音效 |
| 易於擴充 | 難度資料夾分層設計，日後新增關卡只需添加資料即可 |
| 60 關內容 | 簡單 20 關 / 中等 20 關 / 困難 20 關 |

### 1.3 遊戲規則

1. 玩家控制角色，在格狀地圖上移動。
2. 推動箱子到對應的目標格（以 ★ 標示）。
3. 所有箱子都放到目標格即過關。
4. 箱子只能推、不能拉；箱子不可推入牆壁或另一個箱子。
5. 玩家可隨時按「復原（Undo）」回退一步，或「重置（Reset）」重玩此關。

---

## 2. 技術架構

### 2.1 檔案類型

```
純前端單頁應用（SPA）
├── 無伺服器需求
├── 可部署至 GitHub Pages / Vercel / 任何靜態主機
└── 離線可玩（可搭配 Service Worker 實現 PWA）
```

### 2.2 主要技術

| 技術 | 用途 |
|------|------|
| HTML5 Canvas | 遊戲地圖渲染 |
| CSS3 Custom Properties | 主題色系、字體大小 |
| JavaScript ES2022 | 遊戲邏輯、狀態管理 |
| Web Audio API | 合成音樂與音效（零資源檔案） |
| LocalStorage API | 進度、設定儲存 |
| Touch Events / Pointer Events | 行動裝置輸入 |
| CSS Grid + Flexbox | RWD 版面 |

### 2.3 模組切分

```
src/
├── core/
│   ├── GameEngine.js        # 主遊戲迴圈、狀態機
│   ├── LevelManager.js      # 關卡載入、難度切換
│   ├── MoveHistory.js       # 復原功能（Undo Stack）
│   └── SolverHint.js        # （選用）提示系統
├── audio/
│   ├── AudioEngine.js       # Web Audio API 封裝
│   ├── MusicSynth.js        # 背景音樂合成器
│   └── SoundFX.js           # 音效合成器
├── render/
│   ├── CanvasRenderer.js    # Canvas 地圖渲染
│   ├── TileTheme.js         # 視覺主題配置
│   └── Animator.js          # 動畫效果
├── ui/
│   ├── MainMenu.js          # 主選單
│   ├── LevelSelect.js       # 關卡選擇畫面
│   ├── HUD.js               # 遊戲中 HUD（步數、時間）
│   ├── PauseMenu.js         # 暫停選單
│   ├── WinScreen.js         # 過關畫面
│   └── SettingsPanel.js     # 設定面板
├── input/
│   ├── KeyboardInput.js     # 鍵盤輸入
│   ├── TouchInput.js        # 觸控手勢
│   └── SwipeDetector.js     # 滑動方向判斷
├── data/
│   ├── levels/
│   │   ├── easy/            # 簡單關卡 01~20（JSON）
│   │   ├── medium/          # 中等關卡 01~20（JSON）
│   │   └── hard/            # 困難關卡 01~20（JSON）
│   └── themes.json          # 主題設定
├── utils/
│   ├── Storage.js           # LocalStorage 封裝
│   ├── EventBus.js          # 事件匯流排
│   └── Utils.js             # 工具函數
├── index.html
├── style.css
└── main.js
```

---

## 3. 目錄結構

### 3.1 關卡資料格式（JSON）

每一關是一個獨立的 `.json` 檔，放在對應難度資料夾。

```json
{
  "id": "easy_01",
  "difficulty": "easy",
  "name": "初次見面",
  "index": 1,
  "width": 7,
  "height": 7,
  "par": 12,
  "grid": [
    "#######",
    "#     #",
    "#  $  #",
    "#  .  #",
    "#  @  #",
    "#     #",
    "#######"
  ],
  "hint": "先把箱子往上推一格即可。"
}
```

#### 地圖符號對照表

| 符號 | 意義 |
|------|------|
| `#` | 牆壁 |
| ` ` | 空地 |
| `@` | 玩家初始位置 |
| `$` | 箱子 |
| `.` | 目標格（空） |
| `*` | 箱子已在目標格 |
| `+` | 玩家站在目標格上 |

---

## 4. 畫面規格

### 4.1 畫面列表

```
主畫面（MainMenu）
  ├── 關卡選擇（LevelSelect）
  │     ├── 簡單（Easy 1~20）
  │     ├── 中等（Medium 1~20）
  │     └── 困難（Hard 1~20）
  ├── 遊戲畫面（GamePlay）
  │     ├── 遊戲中 HUD
  │     ├── 暫停選單（PauseMenu）
  │     └── 過關畫面（WinScreen）
  └── 設定（Settings）
```

---

### 4.2 主畫面（MainMenu）

#### 視覺設計

- **背景**：深夜城市像素風格，可見磚牆紋路（CSS box-shadow 模擬），頂部有星星動畫（JS Canvas）。
- **Logo**：「📦 BoxMaster」，字體大小 `clamp(40px, 8vw, 72px)`，加黃色發光陰影。
- **副標題**：「推動思維，解開謎題」，字體大小 `clamp(16px, 3vw, 24px)`。

#### 按鈕規格

| 按鈕文字 | 功能 | 字體大小 |
|----------|------|---------|
| 🎮 開始遊戲 | 進入關卡選擇 | `clamp(20px, 4vw, 32px)` |
| ⚙️ 設定 | 開啟設定面板 | `clamp(20px, 4vw, 32px)` |
| 🏆 成就 | 開啟成就列表 | `clamp(20px, 4vw, 32px)` |
| ℹ️ 說明 | 開啟操作說明 | `clamp(20px, 4vw, 32px)` |

> **所有主選單按鈕**：最小高度 `60px`，寬度 `min(300px, 80vw)`，圓角 `16px`，點擊有縮放 + 音效回饋。

---

### 4.3 關卡選擇畫面（LevelSelect）

#### 難度頁籤

- 三個頁籤：🟢 簡單 / 🟡 中等 / 🔴 困難
- 字體大小：`clamp(18px, 3.5vw, 28px)`
- 選中頁籤底部有滑動底線動畫

#### 關卡格子

- Grid 排列：桌機 `5 × 4`，平板 `4 × 5`，手機 `4 × 5`
- 每格大小：`min(80px, 18vw)`，圓角 `12px`
- 顯示資訊：關卡編號（字體 `clamp(16px, 3vw, 22px)`）、☆☆☆ 星星評分、鎖定圖示（未解鎖）
- 已完成：綠色邊框 + 星星填滿
- 未解鎖：灰色 + 🔒 圖示

#### 解鎖條件

- 簡單：全部預設解鎖
- 中等：完成簡單前 5 關後解鎖
- 困難：完成中等前 10 關後解鎖

---

### 4.4 遊戲畫面（GamePlay）

#### 版面結構

```
┌─────────────────────────────────────┐
│  ← 返回   關卡名稱    ⏱ 00:00      │  ← 頂部 HUD（高度 56px ~ 72px）
│           步數: 0     最佳: --      │
├─────────────────────────────────────┤
│                                     │
│           遊戲地圖（Canvas）         │  ← 自動填滿剩餘空間
│                                     │
├─────────────────────────────────────┤
│  ↩ 復原    🔄 重置    ⏸ 暫停  💡 提示│  ← 底部控制列（高度 64px ~ 80px）
└─────────────────────────────────────┘
```

#### HUD 字體規格

| 元素 | 字體大小 |
|------|---------|
| 關卡名稱 | `clamp(18px, 3.5vw, 26px)` |
| 步數 / 時間 | `clamp(16px, 3vw, 22px)` |
| 底部按鈕文字 | `clamp(14px, 2.8vw, 20px)` |

#### Canvas 渲染規格

- Canvas 尺寸：依地圖格數動態計算，格子大小 `cellSize = min(floor(availableWidth / mapWidth), floor(availableHeight / mapHeight), 72)`
- 最小格子：`40px`，最大格子：`80px`（桌機）
- 地圖置中顯示
- 支援 `devicePixelRatio` 高解析度渲染

#### Tile 視覺設計

| Tile | 顏色 / 外觀 |
|------|------------|
| 牆壁 | 深灰磚塊，帶高光與陰影（Canvas 手繪） |
| 空地 | 木紋淺褐色 |
| 玩家 | 藍色圓頭人，有行走動畫（4 幀） |
| 箱子 | 木質褐色方塊，有立體陰影 |
| 目標格 | 深色地板 + 黃色星形 |
| 箱子在目標 | 綠色方塊 + ✓ 符號，有脈衝光暈動畫 |

---

### 4.5 過關畫面（WinScreen）

- 背景：半透明黑幕 + 粒子煙火效果（Canvas）
- 標題：「🎉 過關！」，字體 `clamp(36px, 7vw, 64px)`
- 顯示：步數評分、時間、☆☆☆ 星星動態落下
- 按鈕：「下一關」「再玩一次」「選關」，字體 `clamp(18px, 3.5vw, 28px)`

---

### 4.6 設定畫面（Settings）

#### 設定項目與字體規格

> **所有設定項目標籤字體**：`clamp(18px, 3.5vw, 28px)`  
> **設定值/控制元件字體**：`clamp(16px, 3vw, 24px)`

| 設定項目 | 控制元件 | 預設值 |
|----------|---------|--------|
| 🔊 音樂音量 | 滑桿 0~100 | 70 |
| 🔉 音效音量 | 滑桿 0~100 | 80 |
| 🎵 背景音樂風格 | 下拉：放鬆 / 緊張 / 像素 | 放鬆 |
| 📏 格子大小 | 下拉：小 / 中 / 大 / 自動 | 自動 |
| 🌙 深色模式 | 開關 Toggle | 開 |
| 🌐 語言 | 下拉：繁中 / 簡中 / English | 繁中 |
| 📳 震動回饋 | 開關（手機限定） | 開 |
| ↩ 復原上限 | 數字輸入 10~999 | 99 |
| 📊 重置進度 | 按鈕（需確認） | — |

---

## 5. 遊戲核心邏輯

### 5.1 狀態機

```
IDLE → PLAYING → PAUSED → PLAYING
                         ↓
                      WIN → LEVEL_SELECT / NEXT_LEVEL
```

### 5.2 移動邏輯（偽碼）

```javascript
function tryMove(direction) {
  const nextPos = player.pos + direction;
  const nextCell = grid[nextPos];

  if (isWall(nextCell)) return false;  // 牆壁，禁止

  if (isBox(nextCell)) {
    const boxNext = nextPos + direction;
    if (isWall(boxNext) || isBox(boxNext)) return false;  // 箱子無法推
    moveBox(nextPos, boxNext);   // 推箱子
    playSound('push');
  }

  movePlayer(nextPos);
  recordHistory({ player: oldPos, boxes: oldBoxes });
  stepCount++;
  checkWin();
}
```

### 5.3 勝利判斷

```javascript
function checkWin() {
  const allBoxesOnTarget = boxes.every(box => targets.includes(box));
  if (allBoxesOnTarget) {
    triggerWin();
    playSound('win');
    stopMusic();
    playWinJingle();
  }
}
```

### 5.4 復原系統（Undo Stack）

- 每次有效移動將當前狀態 `{ playerPos, boxPositions, stepCount }` 壓入 stack
- 按「復原」時 pop 上一個狀態並還原
- Stack 上限由設定決定（預設 99）
- 復原不影響計時器

### 5.5 評分系統

| 星星數 | 條件 |
|--------|------|
| ⭐⭐⭐ | 步數 ≤ par |
| ⭐⭐ | 步數 ≤ par × 1.5 |
| ⭐ | 完成即給 |

---

## 6. 關卡設計規格

### 6.1 難度區分原則

| 難度 | 地圖大小 | 箱子數 | 最短解法步數 | 特徵 |
|------|---------|--------|------------|------|
| 🟢 簡單（Easy） | 5×5 ~ 8×8 | 1~3 個 | 5~20 步 | 直線推移，無複雜迂迴 |
| 🟡 中等（Medium） | 7×9 ~ 10×10 | 2~4 個 | 20~50 步 | 需思考順序，有迂迴路線 |
| 🔴 困難（Hard） | 9×10 ~ 12×12 | 3~6 個 | 50~120 步 | 需長遠規劃，易死局 |

### 6.2 關卡資料夾結構

```
data/levels/
├── easy/
│   ├── easy_01.json
│   ├── easy_02.json
│   ├── ...
│   └── easy_20.json
├── medium/
│   ├── medium_01.json
│   ├── ...
│   └── medium_20.json
└── hard/
    ├── hard_01.json
    ├── ...
    └── hard_20.json
```

> 🔑 **擴充原則**：新增難度只需在 `data/levels/` 建立新資料夾（如 `expert/`），並在 `LevelManager.js` 的 `DIFFICULTY_CONFIG` 中新增一條設定即可，無需修改遊戲邏輯。

### 6.3 難度設定物件（LevelManager.js）

```javascript
const DIFFICULTY_CONFIG = {
  easy: {
    label: '簡單',
    emoji: '🟢',
    color: '#4CAF50',
    count: 20,
    unlockRequirement: 0,  // 預設解鎖
    folder: 'easy'
  },
  medium: {
    label: '中等',
    emoji: '🟡',
    color: '#FF9800',
    count: 20,
    unlockRequirement: { difficulty: 'easy', minClear: 5 },
    folder: 'medium'
  },
  hard: {
    label: '困難',
    emoji: '🔴',
    color: '#F44336',
    count: 20,
    unlockRequirement: { difficulty: 'medium', minClear: 10 },
    folder: 'hard'
  }
  // 未來擴充：只需在此新增項目
};
```

---

## 7. 音樂與音效系統

### 7.1 設計理念

所有音訊均使用 **Web Audio API 即時合成**，不依賴任何外部音訊檔案，確保零資源下載、即時可用，且可動態調整。

### 7.2 背景音樂（MusicSynth.js）

#### 音樂風格列表

| 風格代號 | 名稱 | 情境 | BPM | 樂器組合 |
|----------|------|------|-----|---------|
| `RELAX` | 放鬆旋律 | 主選單、簡單關卡 | 75 | 正弦波鋼琴 + 輕柔 pad |
| `FOCUS` | 專注節奏 | 中等關卡 | 100 | 方波合成 + 低頻 bass |
| `TENSION` | 緊張氛圍 | 困難關卡 | 120 | 鋸齒波 + 滾奏打擊 |
| `PIXEL` | 像素遊戲 | 可選 | 130 | 8-bit 方波 + 三角波 |
| `WIN_JINGLE` | 過關音樂 | 過關畫面 | — | 五音符上行旋律 |
| `AMBIENT` | 環境音 | 選關畫面 | 60 | 低通濾波器 pad |

#### 音樂合成架構

```javascript
// 簡化範例：生成一個音符
class MusicSynth {
  constructor(audioCtx) {
    this.ctx = audioCtx;
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }

  playNote(freq, duration, type = 'sine', volume = 0.3) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playMelody(notes, style) { /* 依 BPM 排程所有音符 */ }
  loop() { /* 循環播放 */ }
  stop() { /* 淡出停止 */ }
}
```

#### 旋律資料格式

```javascript
// 放鬆旋律主題（C 大調五聲音階）
const RELAX_MELODY = [
  { freq: 261.6, dur: 0.5 },  // C4
  { freq: 293.7, dur: 0.5 },  // D4
  { freq: 329.6, dur: 1.0 },  // E4
  { freq: 392.0, dur: 0.5 },  // G4
  { freq: 440.0, dur: 1.0 },  // A4
  // ... 共 32 個音符構成一個循環
];
```

---

### 7.3 音效系統（SoundFX.js）

#### 全套音效列表

| 音效 ID | 觸發時機 | 合成方式 | 時長 |
|---------|---------|---------|------|
| `move` | 玩家移動（無推箱） | 短促白噪音 + 低通濾波 | 80ms |
| `push` | 推動箱子 | 較重的木質敲擊音（正弦波衰減） | 150ms |
| `place` | 箱子推入目標格 | 高音清脆鈴聲（正弦波 + 泛音） | 300ms |
| `win` | 所有箱子到位 | 上行五音符旋律 + 鼓聲 | 1200ms |
| `undo` | 復原一步 | 倒退嗶聲（下降音調） | 120ms |
| `reset` | 重置關卡 | 低沉爆炸聲（噪音 burst） | 200ms |
| `button` | 點擊任何按鈕 | 短高頻點擊聲 | 60ms |
| `lock` | 點擊鎖定關卡 | 金屬鎖鏈聲（多頻疊加） | 200ms |
| `unlock` | 解鎖新難度 | 上揚旋律 + 魔法音效 | 800ms |
| `wall` | 嘗試撞牆 | 低沉撞擊聲 + 輕微震動 | 100ms |
| `blocked` | 箱子無法推動 | 沉悶阻塞聲 | 120ms |
| `tick` | 計時器每分鐘提示 | 輕柔滴答聲 | 80ms |
| `star_earn` | 每顆星星出現 | 遞升的三個音 | 300ms |

#### 音效實作範例（push 音效）

```javascript
function playPushSound(ctx, masterGain, volume) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const distortion = ctx.createWaveShaper();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(distortion);
  distortion.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}
```

---

### 7.4 AudioEngine.js 主控器

```javascript
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.music = new MusicSynth(this.ctx, this.musicGain);
    this.sfx = new SoundFX(this.ctx, this.sfxGain);
  }

  setMusicVolume(v) { this.musicGain.gain.value = v / 100; }
  setSfxVolume(v)   { this.sfxGain.gain.value = v / 100; }
  resume()          { this.ctx.resume(); }  // 需用戶互動後呼叫
  playMusic(style)  { this.music.play(style); }
  stopMusic()       { this.music.stop(); }
  playSfx(id)       { this.sfx.play(id); }
}
```

> ⚠️ **瀏覽器政策**：AudioContext 需在使用者第一次互動後才能啟動。實作時，監聽首次 `click` / `touchstart` 事件後呼叫 `audioEngine.resume()`。

---

## 8. UI 元件規格

### 8.1 全域字體規範

```css
:root {
  /* 標題字體 */
  --font-display: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  /* 內文字體 */
  --font-body: 'Noto Sans TC', system-ui, sans-serif;

  /* 字體大小 Scale */
  --text-xs:   clamp(12px, 2.5vw, 14px);
  --text-sm:   clamp(14px, 3vw,   16px);
  --text-base: clamp(16px, 3.5vw, 20px);
  --text-lg:   clamp(18px, 4vw,   24px);
  --text-xl:   clamp(20px, 4.5vw, 28px);
  --text-2xl:  clamp(24px, 5vw,   36px);
  --text-3xl:  clamp(32px, 7vw,   52px);
  --text-hero: clamp(40px, 8vw,   72px);
}
```

### 8.2 色彩系統

```css
:root {
  /* 深色主題（預設） */
  --color-bg:        #1a1a2e;
  --color-surface:   #16213e;
  --color-panel:     #0f3460;
  --color-accent:    #e94560;
  --color-accent2:   #f5a623;
  --color-text:      #eaeaea;
  --color-text-muted:#9aa0b4;
  --color-success:   #4caf50;
  --color-warning:   #ff9800;
  --color-danger:    #f44336;

  /* 難度色 */
  --color-easy:   #4caf50;
  --color-medium: #ff9800;
  --color-hard:   #f44336;
}

[data-theme="light"] {
  --color-bg:      #f5f0e8;
  --color-surface: #fffbf2;
  --color-panel:   #e8dcc8;
  --color-text:    #2c2c2c;
  /* ... */
}
```

### 8.3 按鈕元件規格

```css
.btn {
  font-size: var(--text-xl);
  min-height: 60px;
  min-width: 160px;
  padding: 14px 28px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.btn:active {
  transform: scale(0.94);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* 行動裝置觸控目標最小尺寸 */
@media (pointer: coarse) {
  .btn { min-height: 72px; min-width: 180px; }
}
```

### 8.4 動畫規格

| 動畫 | 屬性 | 時長 | Easing |
|------|------|------|--------|
| 玩家移動 | Canvas 線性插值 | 120ms | linear |
| 箱子推移 | Canvas 線性插值 | 140ms | ease-out |
| 箱子到位光暈 | Canvas scale + opacity | 400ms | ease-out |
| 畫面轉場 | CSS opacity + translateY | 300ms | ease-in-out |
| 過關煙火 | Canvas 粒子系統 | 2000ms | — |
| 星星落下 | CSS keyframes | 600ms × 3 | bounce |
| 按鈕點擊 | CSS transform scale | 120ms | ease |

---

## 9. 行動裝置支援

### 9.1 RWD 斷點

```css
/* 手機（直向） */
@media (max-width: 480px) { ... }

/* 手機（橫向）/ 小平板 */
@media (min-width: 481px) and (max-width: 768px) { ... }

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1025px) { ... }
```

### 9.2 觸控手勢

#### 滑動控制（SwipeDetector.js）

```javascript
class SwipeDetector {
  constructor(element) {
    this.startX = 0;
    this.startY = 0;
    this.threshold = 30;   // px，最短有效滑動距離
    this.maxTime = 400;    // ms，最長有效滑動時間

    element.addEventListener('touchstart', this.onStart.bind(this));
    element.addEventListener('touchend', this.onEnd.bind(this));
  }

  onStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
  }

  onEnd(e) {
    const dx = e.changedTouches[0].clientX - this.startX;
    const dy = e.changedTouches[0].clientY - this.startY;
    const dt = Date.now() - this.startTime;

    if (dt > this.maxTime) return;
    if (Math.abs(dx) < this.threshold && Math.abs(dy) < this.threshold) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.emit(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      this.emit(dy > 0 ? 'DOWN' : 'UP');
    }
  }
}
```

#### 手機控制方案（並行支援）

| 控制方式 | 說明 |
|---------|------|
| 四方向滑動 | 主要控制方式（Canvas 區域） |
| 虛擬方向鍵 | 選用，手機橫向模式顯示 |
| 點擊格子 | 點擊目標格，自動尋路並移動 |

### 9.3 Viewport 設定

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
```

### 9.4 Safe Area（瀏海 / Home Bar）

```css
.hud-top    { padding-top: max(16px, env(safe-area-inset-top)); }
.hud-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
```

### 9.5 震動回饋（Haptic）

```javascript
function vibrate(pattern) {
  if ('vibrate' in navigator && settings.haptic) {
    navigator.vibrate(pattern);
  }
}
// 使用範例
vibrate(20);           // 短震：一般移動
vibrate([30, 10, 30]); // 雙震：推箱子
vibrate(100);          // 長震：箱子到位
vibrate([50,30,50,30,200]); // 過關震動模式
```

---

## 10. 資料儲存

### 10.1 LocalStorage 結構

```javascript
const STORAGE_KEYS = {
  SETTINGS:  'boxmaster_settings',
  PROGRESS:  'boxmaster_progress',
  RECORDS:   'boxmaster_records',
};
```

#### 進度資料結構

```json
{
  "easy": {
    "cleared": [1, 2, 3, 5],
    "stars": { "1": 3, "2": 2, "3": 3, "5": 1 }
  },
  "medium": {
    "cleared": [1],
    "stars": { "1": 2 }
  },
  "hard": {
    "cleared": [],
    "stars": {}
  }
}
```

#### 最佳記錄結構

```json
{
  "easy_01": { "bestSteps": 8, "bestTime": 42 },
  "easy_02": { "bestSteps": 15, "bestTime": 78 }
}
```

---

## 11. 設定系統

### 11.1 設定資料結構

```javascript
const DEFAULT_SETTINGS = {
  musicVolume:    70,
  sfxVolume:      80,
  musicStyle:     'RELAX',   // 'RELAX' | 'FOCUS' | 'TENSION' | 'PIXEL'
  cellSize:       'auto',    // 'auto' | 'small' | 'medium' | 'large'
  darkMode:       true,
  language:       'zh-TW',
  haptic:         true,
  undoLimit:      99,
  showTimer:      true,
  showStepCount:  true,
  animationSpeed: 'normal',  // 'slow' | 'normal' | 'fast' | 'instant'
};
```

### 11.2 設定變更即時生效

所有設定使用 **觀察者模式（EventBus）** 通知各模組：

```javascript
EventBus.emit('settings:changed', { key: 'musicVolume', value: 60 });
// AudioEngine 監聽並即時調整音量
```

---

## 12. 擴充設計指引

### 12.1 新增難度等級

1. 在 `data/levels/` 新增資料夾（如 `expert/`）
2. 放入 JSON 關卡檔（expert_01.json ~ expert_XX.json）
3. 在 `LevelManager.js` 的 `DIFFICULTY_CONFIG` 新增條目
4. 在 `style.css` 新增對應難度色彩變數

> 無需修改遊戲引擎或渲染器。

### 12.2 新增音樂風格

1. 在 `MusicSynth.js` 的 `STYLES` 物件新增樂句資料
2. 在設定畫面下拉選項新增條目

### 12.3 新增視覺主題

1. 在 `TileTheme.js` 新增主題物件（牆壁色、地板色、玩家色...）
2. 在設定畫面新增選項

### 12.4 國際化（i18n）

```javascript
// lang/zh-TW.js
const LANG = {
  'menu.start': '開始遊戲',
  'menu.settings': '設定',
  'game.steps': '步數',
  // ...
};
```

---

## 13. 效能與相容性

### 13.1 目標效能

| 指標 | 目標 |
|------|------|
| 首次載入 | < 500ms（單一 HTML 檔） |
| 動畫幀率 | 60fps（Canvas requestAnimationFrame） |
| 記憶體用量 | < 30MB |
| 頁面大小 | < 100KB（無外部資源） |

### 13.2 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome / Edge | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Samsung Internet | 13+ |

### 13.3 Canvas 最佳化

- 使用 `offscreenCanvas` 預渲染靜態 Tile（牆壁、地板）
- 僅在狀態改變時重繪，使用 dirty flag
- 動畫期間使用 `requestAnimationFrame` 插值

---

## 14. 附錄：60關完整列表

### 🟢 簡單關卡（Easy 1~20）

| # | 關卡名稱 | 地圖大小 | 箱子數 | 參考步數 |
|---|---------|---------|--------|---------|
| 1 | 初次見面 | 7×7 | 1 | 3 |
| 2 | 向右走 | 6×6 | 1 | 5 |
| 3 | 雙管齊下 | 7×7 | 2 | 8 |
| 4 | 轉個彎 | 7×8 | 1 | 7 |
| 5 | 小小迷宮 | 8×7 | 2 | 12 |
| 6 | 平行推進 | 8×8 | 2 | 10 |
| 7 | 繞道而行 | 8×7 | 1 | 9 |
| 8 | 三角難題 | 7×7 | 3 | 14 |
| 9 | 窄巷探索 | 5×9 | 2 | 11 |
| 10 | 正方形關 | 8×8 | 2 | 15 |
| 11 | 十字路口 | 9×7 | 2 | 13 |
| 12 | 順序問題 | 8×8 | 3 | 18 |
| 13 | 長廊推箱 | 5×10 | 2 | 12 |
| 14 | 四角星 | 8×8 | 2 | 16 |
| 15 | 先後有序 | 8×8 | 3 | 17 |
| 16 | 迴旋鏢 | 9×8 | 2 | 14 |
| 17 | 小房間 | 9×9 | 3 | 19 |
| 18 | 橋梁 | 9×8 | 3 | 18 |
| 19 | 中心點 | 9×9 | 2 | 16 |
| 20 | 簡單收尾 | 8×8 | 3 | 20 |

---

### 🟡 中等關卡（Medium 1~20）

| # | 關卡名稱 | 地圖大小 | 箱子數 | 參考步數 |
|---|---------|---------|--------|---------|
| 1 | 思考一下 | 9×9 | 3 | 22 |
| 2 | 迴廊 | 10×8 | 3 | 25 |
| 3 | 障礙賽 | 9×9 | 4 | 28 |
| 4 | 分組行動 | 10×9 | 3 | 30 |
| 5 | 雙重夾擊 | 10×9 | 4 | 32 |
| 6 | 迷路了嗎 | 10×10 | 3 | 27 |
| 7 | 先後順序 | 9×10 | 4 | 35 |
| 8 | 螺旋路線 | 10×10 | 3 | 33 |
| 9 | 對稱困局 | 10×9 | 4 | 38 |
| 10 | 中途休息 | 9×9 | 4 | 34 |
| 11 | 不歸路 | 10×10 | 4 | 40 |
| 12 | 回字型 | 10×10 | 3 | 36 |
| 13 | 交叉點 | 10×10 | 4 | 42 |
| 14 | 時機掌握 | 9×10 | 4 | 38 |
| 15 | 進退兩難 | 10×10 | 4 | 44 |
| 16 | 最後拼圖 | 10×10 | 4 | 45 |
| 17 | 折返跑 | 10×9 | 4 | 42 |
| 18 | 多重阻礙 | 10×10 | 5 | 48 |
| 19 | 關鍵一步 | 10×10 | 4 | 46 |
| 20 | 中等收尾 | 10×10 | 5 | 50 |

---

### 🔴 困難關卡（Hard 1~20）

| # | 關卡名稱 | 地圖大小 | 箱子數 | 參考步數 |
|---|---------|---------|--------|---------|
| 1 | 腦洞大開 | 11×10 | 4 | 55 |
| 2 | 迷宮深處 | 11×10 | 5 | 60 |
| 3 | 七彎八拐 | 12×10 | 5 | 65 |
| 4 | 次序大師 | 11×11 | 5 | 68 |
| 5 | 雙重地獄 | 12×11 | 5 | 72 |
| 6 | 極限距離 | 12×10 | 5 | 70 |
| 7 | 死局邊緣 | 11×11 | 6 | 78 |
| 8 | 精密計算 | 12×11 | 5 | 75 |
| 9 | 回頭是岸 | 12×11 | 6 | 80 |
| 10 | 深淵之謎 | 11×12 | 5 | 77 |
| 11 | 千迴百折 | 12×12 | 6 | 85 |
| 12 | 錯綜複雜 | 12×11 | 6 | 88 |
| 13 | 無路可退 | 12×12 | 6 | 90 |
| 14 | 巔峰挑戰 | 12×12 | 6 | 92 |
| 15 | 精華薈萃 | 12×12 | 6 | 95 |
| 16 | 極限推演 | 12×12 | 6 | 98 |
| 17 | 完美風暴 | 12×12 | 6 | 100 |
| 18 | 登頂前夕 | 12×12 | 6 | 108 |
| 19 | 最終難關 | 12×12 | 6 | 115 |
| 20 | 傳說終章 | 12×12 | 6 | 120 |

---

## 附錄 A：鍵盤快捷鍵

| 按鍵 | 功能 |
|------|------|
| `↑ ↓ ← →` 或 `W A S D` | 移動 |
| `Z` 或 `Ctrl+Z` | 復原（Undo） |
| `R` | 重置關卡 |
| `Esc` | 暫停 / 返回 |
| `H` | 提示 |
| `M` | 靜音切換 |
| `F` | 全螢幕切換 |

---

## 附錄 B：PWA 支援（選用）

```json
// manifest.json
{
  "name": "BoxMaster 推箱子",
  "short_name": "BoxMaster",
  "description": "沉浸式推箱子解謎遊戲",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "any",
  "theme_color": "#1a1a2e",
  "background_color": "#1a1a2e",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 附錄 C：開發里程碑建議

| 里程碑 | 功能範圍 | 建議工時 |
|--------|---------|---------|
| M1 | Canvas 渲染 + 鍵盤控制 + 簡單關卡 10 關 | 2 天 |
| M2 | 觸控手勢 + RWD 版面 + 完整 60 關資料 | 2 天 |
| M3 | Web Audio 音效 + 背景音樂 | 2 天 |
| M4 | HUD + 暫停 + 過關畫面 + 星星評分 | 1 天 |
| M5 | 設定面板 + LocalStorage 進度 | 1 天 |
| M6 | 動畫優化 + 效能調校 + PWA | 1 天 |
| **合計** | — | **約 9 個工作天** |

---

*© 2026 BoxMaster Project — 純前端推箱子解謎遊戲規格書 v1.0.0*
