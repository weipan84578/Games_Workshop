# 🌻 植物保衛戰 — 純前端遊戲完整規格書

> **版本**：v1.0.0  
> **技術棧**：HTML5 + CSS3 + Vanilla JavaScript（零依賴、零後端）  
> **目標平台**：桌面瀏覽器 + 行動裝置（iOS Safari / Android Chrome）  
> **設計靈感**：Plants vs. Zombies（PopCap Games）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [畫面規格](#3-畫面規格)
4. [遊戲系統](#4-遊戲系統)
5. [植物系統](#5-植物系統)
6. [殭屍系統](#6-殭屍系統)
7. [音樂與音效系統](#7-音樂與音效系統)
8. [行動裝置適配](#8-行動裝置適配)
9. [UI 元件規格](#9-ui-元件規格)
10. [關卡設計](#10-關卡設計)
11. [資料結構定義](#11-資料結構定義)
12. [檔案結構](#12-檔案結構)
13. [效能規範](#13-效能規範)

---

## 1. 專案概述

### 1.1 遊戲名稱
**植物保衛戰**（Garden Defenders）

### 1.2 核心概念
玩家在一個 5 × 9 的草地格子棋盤上種植各式植物，抵擋從右側不斷湧入的殭屍大軍。當任一路的殭屍抵達左側邊界，玩家即告失敗；消滅所有殭屍並撐過倒數時間，即告勝利。

### 1.3 核心循環
```
收集陽光 → 種植植物 → 植物攻擊殭屍 → 殭屍死亡掉落金幣 → 再收集陽光
```

### 1.4 主要特色
- 🌞 **陽光收集**：自動掉落 + 點擊收集
- 🌻 **植物選擇**：10 種以上不同功能植物
- 🧟 **殭屍波次**：遞增難度波次設計
- 🎵 **合成音樂**：使用 Web Audio API 動態生成背景音樂與音效
- 📱 **行動優先**：觸控操作、大字體、大按鈕
- 💾 **本地存檔**：localStorage 儲存關卡進度與高分

---

## 2. 技術架構

### 2.1 單一 HTML 檔案原則
整個遊戲打包在 **一個 `index.html`** 中，包含：
- 內嵌 `<style>` CSS
- 內嵌 `<script>` JavaScript
- 所有圖形使用 **CSS + SVG** 繪製，無需外部圖片資源
- 音效使用 **Web Audio API**（AudioContext）動態合成

### 2.2 模組架構（邏輯分層）

```
index.html
├── AudioEngine        音訊引擎（Web Audio API）
│   ├── MusicEngine    背景音樂合成器
│   └── SFXEngine      音效合成器
├── GameState          全域遊戲狀態管理
├── Renderer           畫面渲染器（純 DOM + CSS）
├── InputHandler       輸入處理（滑鼠 + 觸控）
├── GridSystem         棋盤格系統
├── PlantManager       植物管理器
├── ZombieManager      殭屍管理器
├── ProjectileManager  子彈管理器
├── SunManager         陽光管理器
├── WaveManager        波次管理器
├── UIManager          介面管理器
└── SaveSystem         本地存檔系統
```

### 2.3 遊戲迴圈
```javascript
// 60 FPS 遊戲主迴圈
requestAnimationFrame(gameLoop);

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  update(deltaTime);   // 邏輯更新
  render();            // 畫面渲染
  requestAnimationFrame(gameLoop);
}
```

### 2.4 狀態機
```
BOOT → MAIN_MENU → PLANT_SELECT → PLAYING → PAUSED → WIN / LOSE → MAIN_MENU
```

---

## 3. 畫面規格

### 3.1 視窗與畫面尺寸

| 裝置類型 | 畫面寬度 | 字體基準 | 棋盤格尺寸 |
|--------|--------|--------|---------|
| 桌面（≥ 1024px） | 100vw | 20px | 80px × 80px |
| 平板（768–1023px） | 100vw | 18px | 64px × 64px |
| 手機（< 768px） | 100vw | 16px | 56px × 56px |
| 手機橫向 | 100vw | 14px | 48px × 48px |

> **注意**：棋盤使用 CSS Grid 配合 `vmin` 單位，自動縮放不失真。

### 3.2 主畫面（MAIN_MENU）

```
┌─────────────────────────────────────────┐
│                                         │
│         🌻 植物保衛戰 🌻               │  ← 標題，font-size: clamp(36px, 8vw, 72px)
│      Garden Defenders                   │  ← 副標題，font-size: clamp(16px, 3vw, 28px)
│                                         │
│    ┌─────────────────────────────┐      │
│    │         開始遊戲            │      │  ← 按鈕高度 min 64px
│    └─────────────────────────────┘      │
│                                         │
│    ┌─────────────────────────────┐      │
│    │         繼續遊戲            │      │  ← 按鈕高度 min 64px
│    └─────────────────────────────┘      │
│                                         │
│    ┌─────────────────────────────┐      │
│    │         排行榜              │      │
│    └─────────────────────────────┘      │
│                                         │
│    ┌─────────────────────────────┐      │
│    │      🔊 音效設定            │      │
│    └─────────────────────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

**主畫面視覺效果：**
- 背景：動態星光粒子系統（純 CSS animation）
- 標題字體：`"Comic Sans MS", "Chalkboard SE", cursive`（卡通感）
- 標題有上下浮動動畫（`keyframes float`）
- 殭屍剪影從右側緩速進場（CSS animation）
- 植物剪影在左側搖擺（CSS animation）

### 3.3 植物選擇畫面（PLANT_SELECT）

```
┌──────────────────────────────────────────────┐
│  選擇你的植物（最多選 6 種）        [開始！] │
│                                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│  │ 🌻 │ │ 豌 │ │ 冰 │ │ 爆 │ │ 向 │  ...    │
│  │陽光│ │豆炮│ │凍豌│ │炸菇│ │日葵│         │
│  │100 │ │100 │ │175 │ │150 │ │125 │         │
│  └────┘ └────┘ └────┘ └────┘ └────┘         │
│                                              │
│  已選：[🌻][豌][  ][  ][  ][  ]  (2/6)      │
└──────────────────────────────────────────────┘
```

### 3.4 遊戲主畫面（PLAYING）

```
┌─────────────────────────────────────────────────────────────┐
│ 陽光: ☀ 150   [🌻][豌][冰][爆][向]  倒計時: 2:45   ⏸ 暫停 │  ← 頂部 HUD，高度 72px
├──┬──┬──┬──┬──┬──┬──┬──┬──┬──────────────────────────────────┤
│🌾│  │  │  │  │  │  │  │  │                                  │  ← 路 1
├──┼──┼──┼──┼──┼──┼──┼──┼──┤                殭屍進場方向 →   │
│🌾│  │🌻│  │豌│  │  │  │  │  🧟 🧟                          │  ← 路 2
├──┼──┼──┼──┼──┼──┼──┼──┼──┤                                  │
│🌾│  │  │  │  │  │  │  │  │          🧟                     │  ← 路 3
├──┼──┼──┼──┼──┼──┼──┼──┼──┤                                  │
│🌾│  │  │豌│  │  │  │  │  │  🧟                              │  ← 路 4
├──┼──┼──┼──┼──┼──┼──┼──┼──┤                                  │
│🌾│  │  │  │  │  │  │  │  │                                  │  ← 路 5
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──────────────────────────────────┘
 ↑草皮區  ← 9 格寬棋盤（可種植）                右側無限延伸
```

### 3.5 HUD 規格

| 元素 | 說明 | 字體大小 | 最小觸控區域 |
|-----|-----|--------|-----------|
| 陽光數值 | 數字顯示 | `clamp(20px, 4vw, 28px)` | — |
| 植物卡片 | 選取用卡片 | — | 60px × 60px |
| 倒計時 | MM:SS 格式 | `clamp(18px, 3.5vw, 26px)` | — |
| 暫停按鈕 | 圖示按鈕 | — | 48px × 48px |
| 鏟子工具 | 移除植物用 | — | 48px × 48px |

---

## 4. 遊戲系統

### 4.1 棋盤格系統

- **格子數量**：5 列 × 9 行（共 45 格）
- **草皮路線標示**：每列交替深淺草皮色
- **狀態**：`EMPTY`、`OCCUPIED`、`BLOCKED`
- **點擊/觸控**：命中偵測使用 `getBoundingClientRect()`

### 4.2 陽光系統

**自動產生陽光：**
- 初始陽光：`150`
- 向日葵每 **24 秒** 產生一個陽光球（+25）
- 系統每 **10 秒** 隨機從天空掉落一個陽光球（+25）
- 消滅殭屍：普通殭屍 +25，精英殭屍 +50

**陽光球物件：**
```javascript
{
  id: uniqueId,
  x: randomX,         // 初始 X（格子列或隨機）
  y: -30,             // 從畫面頂部落下
  targetY: targetY,   // 目標 Y 座標
  value: 25,
  collected: false,
  lifetime: 10000,    // 未收集則消失（毫秒）
  animation: 'fall'   // 'fall' | 'fade'
}
```

**點擊/觸控收集陽光：**
- 陽光球 CSS：`cursor: pointer`，大小 `40px × 40px`（行動裝置 `52px × 52px`）
- 收集動畫：飛往 HUD 陽光數值位置，播放 `collect_sun` 音效

### 4.3 種植系統

**種植流程：**
1. 玩家點擊 HUD 植物卡片 → 卡片高亮，手持植物跟隨游標/手指
2. 點擊/觸控空格子 → 扣除陽光，種下植物，播放種植音效
3. 右鍵 / 長按空白區 → 取消選取
4. 鏟子模式：點擊已種植物 → 移除（退還 50% 陽光）

**冷卻時間（CD）：**
- 每種植物有獨立 CD 計時器
- CD 中卡片呈灰色遮罩 + 進度條倒數
- 種下植物後 CD 開始計算

### 4.4 碰撞偵測

使用 **格子座標** 碰撞，非像素碰撞：
- 子彈到達格子 X 時，檢查同列同格是否有殭屍
- 殭屍到達格子 X 時，檢查同列同格是否有植物
- 精確度：格子級別（每格 1 單位）

### 4.5 攻擊系統

```
植物攻擊頻率 → 生成子彈物件 → 子彈移動 → 命中判定 → 殭屍扣血 → 殭屍死亡
```

- 子彈速度：每秒移動 `3` 格（可依植物調整）
- 子彈遇到殭屍立即消失（爆炸型除外）
- 子彈飛出畫面右側自動銷毀

---

## 5. 植物系統

### 5.1 植物一覽表

| 編號 | 植物名稱 | 圖示 | 費用 | CD | 生命值 | 功能說明 |
|-----|--------|-----|-----|----|----|------|
| P01 | 向日葵 | 🌻 | 50 | 7s | 300 | 每 24 秒產生 25 陽光 |
| P02 | 豌豆射手 | 🟢 | 100 | 7.5s | 300 | 直線發射豌豆，傷害 20 |
| P03 | 冰凍豌豆 | 🔵 | 175 | 7.5s | 300 | 直線發射冰豌豆，傷害 20 + 減速 50% |
| P04 | 雙重豌豆 | 🟩 | 150 | 7.5s | 400 | 雙管齊發，傷害 20×2 |
| P05 | 核彈菇 | 🍄 | 175 | 35s | — | 爆炸消滅 3×3 範圍殭屍，自身消失 |
| P06 | 堅果牆 | 🟤 | 50 | 30s | 4000 | 不攻擊，僅作為肉盾 |
| P07 | 地刺 | 🌿 | 125 | 7.5s | 300 | 對踩過的殭屍造成 20 傷害 |
| P08 | 火焰豌豆 | 🔴 | 200 | 14.5s | 300 | 火焰豌豆，傷害 40，解除冰凍狀態 |
| P09 | 三線豌豆 | 🌀 | 325 | 7.5s | 400 | 同時攻擊上中下三列 |
| P10 | 磁力菇 | 🧲 | 100 | 15s | 300 | 吸走金屬殭屍裝備，降低其防禦 |

### 5.2 植物資料結構

```javascript
{
  id: 'P02',
  name: '豌豆射手',
  emoji: '🟢',
  cost: 100,
  cooldown: 7500,         // 毫秒
  hp: 300,
  currentHp: 300,
  attackInterval: 1500,   // 攻擊間隔（毫秒）
  attackDamage: 20,
  projectileType: 'pea',  // 子彈類型
  effect: null,           // 'slow' | 'freeze' | 'burn' | null
  col: 2,                 // 所在格子列（0-8）
  row: 1,                 // 所在格子行（0-4）
  lastAttackTime: 0,
  animState: 'idle'       // 'idle' | 'attack' | 'die'
}
```

### 5.3 植物 CSS 動畫規格

每種植物需實作以下動畫狀態（純 CSS keyframes）：

| 動畫名稱 | 說明 | 時長 |
|--------|-----|-----|
| `plant-idle` | 輕微搖擺（左右 ±3deg） | 2s infinite alternate |
| `plant-attack` | 攻擊時縮放回彈（scale 1 → 0.85 → 1.1 → 1） | 0.3s |
| `plant-hit` | 受擊變紅（filter: hue-rotate） | 0.15s |
| `plant-die` | 縮小消失（scale → 0 + opacity → 0） | 0.5s |
| `sunflower-produce` | 陽光球從花心飛出 | 0.8s |

---

## 6. 殭屍系統

### 6.1 殭屍一覽表

| 編號 | 殭屍名稱 | 圖示 | 生命值 | 速度（格/秒） | 傷害/秒 | 備註 |
|-----|--------|-----|------|------------|--------|-----|
| Z01 | 普通殭屍 | 🧟 | 200 | 0.35 | 100 | 基礎殭屍 |
| Z02 | 路錐殭屍 | 🧟‍♂️ | 560 | 0.35 | 100 | 頭戴路錐（280HP 護甲）|
| Z03 | 鐵桶殭屍 | 🪣 | 1100 | 0.35 | 100 | 頭戴鐵桶（900HP 護甲）|
| Z04 | 旗幟殭屍 | 🚩 | 200 | 0.35 | 100 | 出現代表大波次開始 |
| Z05 | 跳跳殭屍 | 🤸 | 300 | 0.5 | 100 | 跳過第一株植物 |
| Z06 | 橄欖球殭屍 | 🏈 | 1600 | 0.6 | 180 | 高HP高速，危險 |
| Z07 | 報紙殭屍 | 📰 | 200+200 | 0.35→0.7 | 100 | 報紙破後加速 |
| Z08 | 礦工殭屍 | ⛏️ | 400 | 0.35 | 150 | 從地下突現於格子中央 |

### 6.2 殭屍資料結構

```javascript
{
  id: uniqueId,
  type: 'Z01',
  hp: 200,
  maxHp: 200,
  armorHp: 0,           // 護甲 HP（路錐/鐵桶）
  maxArmorHp: 0,
  row: 2,               // 所在列（0-4）
  x: 9.0,               // X 座標（格子單位，9 = 最右側）
  speed: 0.35,          // 移動速度（格/秒）
  damage: 100,          // 對植物每秒傷害
  state: 'walk',        // 'walk' | 'eat' | 'die' | 'frozen'
  frozen: false,        // 是否冰凍（速度 ×0.5）
  burningTimer: 0,      // 燃燒計時（毫秒）
  targetPlant: null,    // 當前正在啃食的植物
  effects: []           // 狀態效果列表
}
```

### 6.3 殭屍動畫規格

| 動畫名稱 | 說明 | 時長 |
|--------|-----|-----|
| `zombie-walk` | 搖擺走路（左右輪替） | 0.8s steps(8) infinite |
| `zombie-eat` | 啃食動作（頭部上下） | 0.4s infinite |
| `zombie-hit` | 受擊（紅光閃爍）| 0.1s |
| `zombie-frozen` | 冰凍（藍色濾鏡 + 減速） | CSS filter |
| `zombie-die` | 死亡（倒下 + 消失）| 1s |
| `zombie-emerge` | 礦工從地面鑽出 | 0.6s |

### 6.4 HP 血條規格

每個殭屍頭頂顯示血條：
- 寬度：`40px`（行動裝置 `32px`）
- 高度：`6px`（行動裝置 `5px`）
- 護甲：灰色條
- 血量：紅色條（`width: (hp/maxHp) * 100%`）
- 低於 30% 時變橙色，10% 以下變黃色閃爍

---

## 7. 音樂與音效系統

> **核心原則**：所有音訊均透過 **Web Audio API（AudioContext）** 動態合成，無需任何外部音訊檔案。

### 7.1 Web Audio 引擎架構

```javascript
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();     // 主音量
    this.musicGain = this.ctx.createGain();      // 音樂音量
    this.sfxGain = this.ctx.createGain();        // 音效音量
    this.compressor = this.ctx.createDynamicsCompressor();

    // 連接訊號鏈
    this.musicGain.connect(this.compressor);
    this.sfxGain.connect(this.compressor);
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }
}
```

### 7.2 背景音樂設計（動態合成）

#### 🎵 主選單音樂（Menu Theme）
- **風格**：輕快、卡通感、8-bit 風格
- **合成方式**：方波（Square Wave）+ 三角波（Triangle Wave）
- **BPM**：120
- **和弦進行**：C → G → Am → F（循環）
- **旋律音階**：C 大調五聲音階

```javascript
// 旋律序列（音符 + 時長）
const menuMelody = [
  { note: 'C5', duration: 0.25 }, { note: 'E5', duration: 0.25 },
  { note: 'G5', duration: 0.25 }, { note: 'E5', duration: 0.25 },
  { note: 'A5', duration: 0.5  }, { note: 'G5', duration: 0.5  },
  { note: 'F5', duration: 0.25 }, { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 }, { note: 'C5', duration: 0.75 },
  // ... 共 32 小節循環
];
```

#### 🎵 遊戲中音樂（Battle Theme）
- **風格**：帶有緊張感的輕快旋律，節奏感強
- **BPM**：135
- **層次結構**：
  - **Layer 1 Bass**：鋸齒波（Sawtooth）低音走音
  - **Layer 2 Melody**：方波主旋律
  - **Layer 3 Counter**：三角波對位旋律
  - **Layer 4 Perc**：噪聲（White Noise）模擬打擊樂
- **動態調整**：殭屍越多 → 音樂節奏越快（BPM 動態拉升至 160）

```javascript
// 打擊樂節奏型（1 = 踢鼓, s = 小鼓, h = 腳踏鈸, _ = 休止）
const drumPattern = '1_h_s_h_1_h_s1h_';

// 低音線
const bassLine = [
  { note: 'C2', dur: 0.5 }, { note: 'C2', dur: 0.25 },
  { note: 'G2', dur: 0.25 }, { note: 'F2', dur: 0.5 },
  { note: 'Ab2', dur: 0.5 },
  // ...
];
```

#### 🎵 緊急警報音樂（Last Stand Theme）
- **觸發條件**：殭屍到達第 6 格（進入危險區）
- **風格**：音調上升、速度加快、加入不和諧音
- **效果**：`pitchShift: +3 semitones`，`BPM: 165`

#### 🎵 勝利音樂（Victory Fanfare）
- **時長**：8 秒
- **合成**：號角聲（鋸波 + 高通濾波）+ 歡呼粒子聲效

#### 🎵 失敗音樂（Game Over Theme）
- **時長**：5 秒
- **合成**：低沉下行音階（Descending scale）+ 混響效果（Convolution Reverb 模擬）

### 7.3 音效清單（SFX）

所有音效均動態合成，以下為合成參數規格：

| 音效 ID | 觸發事件 | 合成方式 | 頻率/參數 |
|--------|--------|--------|---------|
| `sfx_collect_sun` | 收集陽光 | 正弦波上行音階 | 440→880Hz, 0.2s |
| `sfx_plant_placed` | 種下植物 | 正弦波 + 快速衰減 | 600Hz, 0.15s |
| `sfx_pea_shoot` | 豌豆發射 | 短促噪音 + HPF | cutoff 1500Hz, 0.05s |
| `sfx_pea_hit` | 豌豆命中 | 噪音脈衝 | 0.08s |
| `sfx_ice_shoot` | 冰豌豆發射 | 正弦波 + 顫音 | 800Hz, vibrato 15Hz |
| `sfx_zombie_frozen` | 殭屍冰凍 | 下掃音 + 濾波 | 400→100Hz, 0.3s |
| `sfx_explosion` | 核彈菇爆炸 | 噪音 + LPF衰減 | 0.8s，大音量 |
| `sfx_zombie_bite` | 殭屍啃食植物 | 節律性點擊音 | 每 0.4s 一次 |
| `sfx_zombie_die` | 殭屍死亡 | 下行音階 + 混響 | 300→100Hz, 0.5s |
| `sfx_plant_die` | 植物被吃掉 | 短促下行音 | 0.3s |
| `sfx_wave_start` | 波次開始 | 號角聲 + 混響 | 440Hz 方波, 0.5s |
| `sfx_big_wave` | 大波次警告 | 低沉警報聲 | 80Hz + 220Hz 交替 |
| `sfx_lawnmower` | 草坪割草機啟動 | 引擎噪音模擬 | 噪音 + BPF 掃頻 |
| `sfx_button_click` | UI 按鈕點擊 | 短促正弦音 | 880Hz, 0.05s |
| `sfx_shovel` | 鏟除植物 | 鏟子聲模擬 | 噪音 + 快速衰減 |
| `sfx_sunflower_prod` | 向日葵產陽光 | 上升音符 | C4→E4→G4, 各 0.1s |
| `sfx_coin_drop` | 殭屍掉金幣 | 叮咚聲 | 正弦波 1200Hz, 0.2s |

### 7.4 音效合成程式碼模板

```javascript
// 正弦波音效（基礎模板）
function playSineBeep(freq, duration, volume = 0.5) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(sfxGain);

  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

// 噪音音效（爆炸/碰撞）
function playNoise(duration, cutoffFreq = 2000) {
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // White Noise
  }
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoffFreq, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + duration);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain);

  gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  source.start();
}
```

### 7.5 音量設定

```javascript
const AudioSettings = {
  masterVolume: 0.8,   // 0.0 ~ 1.0
  musicVolume: 0.5,    // 0.0 ~ 1.0
  sfxVolume: 0.8,      // 0.0 ~ 1.0
};
// 持久化至 localStorage
```

### 7.6 音訊初始化規則

> **重要**：瀏覽器政策要求 AudioContext 必須在使用者互動後才能啟動。

```javascript
// 主畫面「開始遊戲」按鈕點擊後初始化
document.getElementById('startBtn').addEventListener('click', () => {
  if (!audioEngine.initialized) {
    audioEngine.init();   // 建立 AudioContext
    audioEngine.initialized = true;
  }
  startGame();
});
```

---

## 8. 行動裝置適配

### 8.1 觸控操作流程

```
手指點擊 HUD 植物卡片
  → 振動回饋（navigator.vibrate(50)）
  → 植物預覽圖跟隨手指移動（touchmove 事件）
  → 手指放開在有效格子上 → 種下植物
  → 手指放開在無效區域 → 取消
```

### 8.2 觸控手勢支援

| 手勢 | 功能 |
|-----|-----|
| 單點 | 選取植物卡片 / 收集陽光 / 放置植物 |
| 長按（>500ms）| 進入鏟子模式（移除植物） |
| 雙指捏合 | 縮小棋盤視圖（輔助查看） |
| 雙指擴張 | 放大棋盤視圖 |
| 滑動（遊戲中） | 無效（避免誤觸滾動） |

```javascript
// 防止遊戲中誤觸滾動
gameCanvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
```

### 8.3 響應式字體規格

```css
/* 標題字體 */
.game-title {
  font-size: clamp(32px, 8vw, 72px);
  line-height: 1.2;
}

/* 選單按鈕文字 */
.menu-btn {
  font-size: clamp(20px, 4vw, 32px);
  min-height: 64px;
  padding: 12px 24px;
}

/* HUD 陽光數值 */
.sun-count {
  font-size: clamp(20px, 4vw, 28px);
  font-weight: bold;
}

/* 植物費用標示 */
.plant-cost {
  font-size: clamp(12px, 2.5vw, 16px);
}

/* 倒計時 */
.timer {
  font-size: clamp(18px, 3.5vw, 26px);
  font-variant-numeric: tabular-nums;
}

/* 殭屍 HP 數值（除錯模式） */
.zombie-hp-text {
  font-size: clamp(10px, 1.5vw, 12px);
}
```

### 8.4 行動裝置專用 UI 調整

```css
@media (max-width: 767px) {
  /* HUD 高度加大 */
  .hud { height: 80px; }

  /* 植物卡片加大觸控區域 */
  .plant-card {
    width: 60px;
    height: 70px;
    margin: 0 4px;
  }

  /* 按鈕更大 */
  .game-btn {
    min-width: 120px;
    min-height: 56px;
    border-radius: 12px;
  }

  /* 棋盤格加大 */
  .grid-cell {
    width: calc((100vw - 16px) / 9);
    height: calc((100vw - 16px) / 9);
  }

  /* 陽光球更大更容易點 */
  .sun-ball {
    width: 52px;
    height: 52px;
  }
}

/* 橫向模式優化 */
@media (max-width: 896px) and (orientation: landscape) {
  .hud { height: 56px; }
  .grid-cell {
    width: calc((100vw - 80px) / 9);
    height: calc((100vh - 56px) / 5);
  }
}
```

### 8.5 效能優化（行動裝置）

- 所有動畫使用 `transform` 和 `opacity`（觸發 GPU 合成層）
- 殭屍/子彈使用 `will-change: transform` 宣告
- 行動裝置降低粒子數量（陽光球掉落粒子數量 ×0.5）
- 偵測 `navigator.hardwareConcurrency < 4` 時自動降低畫面效果

---

## 9. UI 元件規格

### 9.1 按鈕元件

```css
.game-btn {
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: clamp(18px, 3.5vw, 26px);
  font-weight: bold;
  background: linear-gradient(180deg, #7EC850 0%, #5A9E30 100%);
  border: 3px solid #3A7E10;
  border-radius: 12px;
  box-shadow: 0 4px 0 #2A6000, inset 0 1px 0 rgba(255,255,255,0.3);
  color: #fff;
  text-shadow: 0 2px 0 rgba(0,0,0,0.4);
  min-height: 64px;
  padding: 12px 32px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.game-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #2A6000;
}
```

### 9.2 植物卡片元件

```css
.plant-card {
  width: 70px;
  height: 80px;
  background: linear-gradient(180deg, #2D5A1B 0%, #1A3A0A 100%);
  border: 2px solid #4A8A2B;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.plant-card:hover { transform: translateY(-4px); border-color: #FFD700; }
.plant-card.selected { border-color: #FFD700; box-shadow: 0 0 12px #FFD700; }
.plant-card.cooldown::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  border-radius: 6px;
  /* 從底部往上的冷卻遮罩 */
  clip-path: inset(calc((1 - var(--cd-progress)) * 100%) 0 0 0);
}
```

### 9.3 暫停選單

```
┌──────────────────────────────┐
│        ⏸ 遊戲暫停           │
│                              │
│    [▶ 繼續遊戲]              │
│    [🔁 重新開始]             │
│    [🔊 音效設定]             │
│    [🏠 回主選單]             │
└──────────────────────────────┘
```

### 9.4 波次提示

- 螢幕中央出現 `「第 X 波！」` 文字
- 從下往上飛出 + 淡出（CSS animation 1.5s）
- 旗幟殭屍出現時顯示 `「🚩 大波次！」`（紅色字體）

### 9.5 遊戲結束畫面

**勝利：**
```
┌──────────────────────────────────┐
│      🌟 你贏了！ 🌟             │  ← 文字縮放彈出動畫
│                                  │
│   完成時間：2:34                 │
│   存活植物：8 株                 │
│   擊殺殭屍：47 隻                │
│   總分：12450                    │
│                                  │
│   [➡ 下一關]   [🏠 主選單]      │
└──────────────────────────────────┘
```

**失敗：**
```
┌──────────────────────────────────┐
│       💀 遊戲結束 💀            │  ← 螢幕震動後淡入
│                                  │
│   你撐到了第 3 波               │
│   存活時間：1:22                 │
│                                  │
│   [🔁 再試一次]  [🏠 主選單]    │
└──────────────────────────────────┘
```

---

## 10. 關卡設計

### 10.1 波次系統

```javascript
const WaveConfig = {
  warningTime: 5000,       // 波次開始前警告（毫秒）
  betweenWaveTime: 10000,  // 波次間隔（毫秒）
  hugeWaveInterval: 5,     // 每 5 波觸發大波次
};
```

### 10.2 關卡 1 — 白天草地（Day 1）

| 波次 | 殭屍組合 | 總計 |
|-----|--------|-----|
| Wave 1 | 普通 ×2 | 2 |
| Wave 2 | 普通 ×3 | 3 |
| Wave 3 | 普通 ×2 + 路錐 ×1 | 3 |
| Wave 4 | 普通 ×3 + 路錐 ×1 | 4 |
| Wave 5 🚩 | 普通 ×4 + 路錐 ×2 + 旗幟 ×1 | 7 |

### 10.3 關卡 2 — 白天草地（Day 2）

| 波次 | 殭屍組合 | 總計 |
|-----|--------|-----|
| Wave 1 | 普通 ×2 + 路錐 ×1 | 3 |
| Wave 2 | 普通 ×2 + 路錐 ×2 | 4 |
| Wave 3 | 路錐 ×2 + 鐵桶 ×1 | 3 |
| Wave 4 | 普通 ×3 + 跳跳 ×2 | 5 |
| Wave 5 | 報紙 ×2 + 路錐 ×2 | 4 |
| Wave 6 | 跳跳 ×3 + 路錐 ×2 | 5 |
| Wave 7 | 鐵桶 ×2 + 普通 ×3 | 5 |
| Wave 8 | 橄欖球 ×1 + 路錐 ×3 | 4 |
| Wave 9 | 普通 ×3 + 報紙 ×3 | 6 |
| Wave 10 🚩 | 橄欖球 ×2 + 鐵桶 ×2 + 旗幟 ×1 + 普通 ×5 | 10 |

### 10.4 草坪割草機

- 每列最左側（格子 0 左方）放置 **1 台割草機**
- 當殭屍踏入最左列（格子 0）時，割草機自動啟動
- 割草機橫掃整列，消滅所有殭屍（一次性使用）
- 音效：引擎啟動聲 + 割草聲（噪音合成）

---

## 11. 資料結構定義

### 11.1 全域遊戲狀態

```javascript
const GameState = {
  phase: 'MAIN_MENU',       // 當前畫面
  level: 1,                 // 當前關卡
  wave: 0,                  // 當前波次
  totalWaves: 10,           // 關卡總波次
  sun: 150,                 // 陽光數量
  score: 0,                 // 當前分數
  time: 0,                  // 遊戲時間（毫秒）
  plants: [],               // 已種植植物列表
  zombies: [],              // 當前殭屍列表
  projectiles: [],          // 當前子彈列表
  suns: [],                 // 陽光球列表
  lawnmowers: [true, true, true, true, true], // 各列割草機狀態
  selectedPlants: [],       // 玩家選擇的植物組合（最多 6 種）
  handPlant: null,          // 手持中的植物（種植時）
  paused: false,
  gameOver: false,
  won: false,
};
```

### 11.2 子彈（Projectile）

```javascript
{
  id: uniqueId,
  type: 'pea',              // 'pea' | 'ice_pea' | 'fire_pea' | 'spike'
  row: 2,
  x: 3.5,                  // X 座標（格子單位）
  speed: 3.0,              // 格/秒
  damage: 20,
  effect: null,             // 'slow' | 'freeze' | 'burn' | null
  effectDuration: 3000,     // 狀態效果持續毫秒
}
```

### 11.3 存檔格式（localStorage）

```javascript
// key: 'pvz_save'
{
  version: '1.0.0',
  highScores: [
    { level: 1, score: 12450, date: '2025-01-01' },
    // ...最高 10 筆
  ],
  unlockedLevels: [1, 2],
  settings: {
    masterVolume: 0.8,
    musicVolume: 0.5,
    sfxVolume: 0.8,
    vibration: true,
  },
  lastPlay: {
    level: 1,
    wave: 3,
    // 中途存檔（僅記錄波次，不含植物狀態）
  }
}
```

---

## 12. 檔案結構

```
index.html              ← 全部程式碼在此（單一檔案）
├── <style>
│   ├── CSS Reset
│   ├── CSS Variables（主題色、字體大小）
│   ├── 主畫面樣式
│   ├── HUD 樣式
│   ├── 棋盤格樣式
│   ├── 植物樣式 × 10
│   ├── 殭屍樣式 × 8
│   ├── 子彈樣式 × 4
│   ├── 陽光球樣式
│   ├── 動畫 Keyframes × 20+
│   ├── 響應式媒體查詢
│   └── 手機橫向媒體查詢
└── <script>
    ├── AudioEngine（Web Audio API）
    │   ├── MusicEngine（背景音樂合成）
    │   └── SFXEngine（音效合成）
    ├── Constants（常數定義）
    ├── PlantDefs（植物定義表）
    ├── ZombieDefs（殭屍定義表）
    ├── LevelData（關卡波次資料）
    ├── GameState（全域狀態）
    ├── SaveSystem（localStorage 存讀）
    ├── InputHandler（滑鼠 + 觸控）
    ├── GridSystem（格子管理）
    ├── PlantManager（植物邏輯）
    ├── ZombieManager（殭屍邏輯）
    ├── ProjectileManager（子彈邏輯）
    ├── SunManager（陽光邏輯）
    ├── WaveManager（波次邏輯）
    ├── UIManager（介面渲染）
    ├── Renderer（主渲染器）
    └── main()（遊戲進入點）
```

---

## 13. 效能規範

### 13.1 目標幀率

| 裝置類型 | 目標 FPS |
|--------|---------|
| 桌面（高效能） | 60 FPS |
| 行動裝置（中等）| 60 FPS |
| 行動裝置（低效能）| 30 FPS（自動降級）|

### 13.2 DOM 元素上限

| 類型 | 最大數量 | 說明 |
|-----|--------|-----|
| 殭屍 DOM | 30 | 超過時合批 |
| 子彈 DOM | 50 | 飛出畫面立即移除 |
| 陽光球 DOM | 10 | 超過最舊的自動消失 |
| 粒子 DOM | 20 | 爆炸/死亡特效 |

### 13.3 效能檢測

```javascript
// 自動降級偵測
const isLowEnd = navigator.hardwareConcurrency <= 2
  || /Android [4-6]/.test(navigator.userAgent);

if (isLowEnd) {
  GameConfig.particleMultiplier = 0.3;
  GameConfig.animationComplexity = 'simple';
  GameConfig.musicLayers = 2;  // 降低音樂複雜度
}
```

### 13.4 記憶體管理

- 死亡的殭屍/子彈在動畫結束後立即從 DOM 移除
- 音效 OscillatorNode 在 `stop()` 後自動由 GC 回收
- 每隔 30 秒執行一次物件池清理

---

## 附錄：CSS 主題色變數

```css
:root {
  /* 主色 */
  --color-grass-light: #7BC143;
  --color-grass-dark: #6AAD37;
  --color-sky: #87CEEB;
  --color-sun: #FFD700;

  /* 植物色 */
  --color-plant-green: #4CAF50;
  --color-plant-dark: #2E7D32;
  --color-pea: #66BB6A;

  /* 殭屍色 */
  --color-zombie-skin: #B8C99A;
  --color-zombie-dark: #8A9E6A;
  --color-zombie-blood: #8B0000;

  /* UI 色 */
  --color-hud-bg: rgba(0, 0, 0, 0.75);
  --color-sun-bar: #228B22;
  --color-danger: #FF4444;
  --color-warning: #FF8C00;

  /* 字體 */
  --font-game: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive;
  --font-hud: 'Arial Black', 'Arial Bold', sans-serif;
}
```

---

*規格書版本：v1.0.0 | 最後更新：2026-05-07*  
*本規格書設計用於純前端單一 HTML 實作，所有資源均動態生成，無需伺服器或外部依賴。*
