# 🎯 打地鼠進化版（Mole Mayhem） — 純前端完整規格書

> **版本**：v1.0  
> **適用裝置**：桌面、平板、手機（全響應式）  
> **技術棧**：純 HTML5 + CSS3 + Vanilla JavaScript（無外部框架）  
> **音樂／音效**：Web Audio API 合成（零外部音檔依賴）

---

## 目錄

1. [遊戲概述](#1-遊戲概述)
2. [技術架構](#2-技術架構)
3. [UI 設計規格](#3-ui-設計規格)
4. [音樂與音效系統](#4-音樂與音效系統)
5. [核心遊戲機制](#5-核心遊戲機制)
6. [特殊能力與道具系統](#6-特殊能力與道具系統)
7. [十關卡設計](#7-十關卡設計)
8. [地鼠種類與行為](#8-地鼠種類與行為)
9. [擋板與障礙物系統](#9-擋板與障礙物系統)
10. [分數與評分系統](#10-分數與評分系統)
11. [存檔與設定系統](#11-存檔與設定系統)
12. [行動裝置適配](#12-行動裝置適配)
13. [畫面流程圖](#13-畫面流程圖)
14. [完整 HTML 骨架與 CSS 變數](#14-完整-html-骨架與-css-變數)
15. [Web Audio API 實作範例](#15-web-audio-api-實作範例)

---

## 1. 遊戲概述

### 1.1 遊戲名稱

```
MOLE MAYHEM：地洞混亂
```

### 1.2 遊戲定位

一款以「打地鼠」為核心玩法的休閒街機遊戲，融入 **RPG 成長要素**、**策略性擋板機制**、**BOSS 關卡**，並全程由 Web Audio API 驅動的合成背景音樂與動態音效，讓玩家在手機或桌機上均能享受完整遊戲體驗。

### 1.3 核心遊戲迴圈

```
選關 → 倒數開始 → 打地鼠 → 使用特殊能力 / 應對擋板 → 關卡結算 → 解鎖下一關
```

### 1.4 目標族群

- 年齡：全年齡（主打 8–45 歲）
- 裝置：以手機為主，桌機為輔
- 情境：片段碎片化時間（通勤、排隊）

---

## 2. 技術架構

### 2.1 檔案結構

```
index.html          ← 唯一 HTML 檔案（All-in-One 方式）
  ├── <style>       ← 所有 CSS（含動畫、響應式）
  └── <script>      ← 所有 JS 模組（以 IIFE 或 ES Module 方式組織）
      ├── AudioEngine.js   （合成音樂引擎）
      ├── GameEngine.js    （核心遊戲邏輯）
      ├── LevelManager.js  （關卡資料與排程）
      ├── MoleFactory.js   （地鼠生成與動畫）
      ├── PowerUpSystem.js （道具與特殊能力）
      ├── ObstacleSystem.js（擋板與障礙物）
      ├── ScoreManager.js  （分數計算）
      ├── UIManager.js     （畫面管理與轉場）
      └── SaveSystem.js    （localStorage 存檔）
```

### 2.2 瀏覽器需求

| 功能 | 最低需求 |
|------|----------|
| Web Audio API | Chrome 66+, Firefox 76+, Safari 14+, Edge 79+ |
| CSS Grid / Flex | 所有現代瀏覽器 |
| CSS Custom Properties | 所有現代瀏覽器 |
| localStorage | 所有現代瀏覽器 |
| requestAnimationFrame | 所有現代瀏覽器 |
| Pointer Events | 所有現代瀏覽器（含觸控統一處理）|

### 2.3 效能目標

- 首次載入（含初始化）：< 1.5 秒
- 遊戲幀率目標：60 FPS
- 記憶體使用上限：< 50 MB
- 觸控響應延遲：< 100 ms

---

## 3. UI 設計規格

### 3.1 字型規格

> **原則**：所有可互動元素字體不得小於 18px；主要標題 ≥ 48px；行動裝置上數字字體 ≥ 28px。

| 元素 | 字體 | 大小（桌面） | 大小（手機） | 備註 |
|------|------|------------|------------|------|
| 遊戲大標題 | `'Fredoka One'`（Google Fonts） | 72px | 48px | 陰影效果 |
| 關卡名稱 | `'Fredoka One'` | 36px | 28px | 黃色粗體 |
| 分數顯示 | `'Orbitron'` | 40px | 32px | 數字等寬 |
| 計時器 | `'Orbitron'` | 36px | 28px | 紅色警示時閃爍 |
| 按鈕文字 | `'Fredoka One'` | 28px | 22px | 最小觸控面積 56px |
| 說明文字 | `'Nunito'` | 18px | 16px | - |
| 彈出提示 | `'Fredoka One'` | 24px | 20px | - |

### 3.2 配色系統（CSS 變數）

```css
:root {
  /* 主色 */
  --color-bg:          #1a0a2e;   /* 深紫夜空 */
  --color-surface:     #2d1b4e;   /* 卡片底色 */
  --color-primary:     #ff6b35;   /* 橙紅（打擊色） */
  --color-secondary:   #ffd23f;   /* 金黃（得分） */
  --color-accent:      #06d6a0;   /* 青綠（道具） */
  --color-danger:      #ef476f;   /* 警戒紅 */
  --color-mole-brown:  #8b5e3c;   /* 地鼠主色 */
  --color-grass:       #2d6a4f;   /* 草地 */
  --color-hole:        #1b0000;   /* 地洞 */
  --color-text:        #f8f9fa;   /* 主要文字 */
  --color-text-dim:    #adb5bd;   /* 次要文字 */

  /* 特殊關卡覆蓋（JS 動態注入） */
  --level-tint:        transparent;
}
```

### 3.3 主畫面（Home Screen）佈局

```
┌─────────────────────────────────────────┐
│  ✨ 星空粒子動畫背景（canvas）           │
│                                         │
│         🎯 MOLE MAYHEM                  │  ← 72px，閃光動畫
│          地  洞  混  亂                 │  ← 36px 副標
│                                         │
│    ┌─────────────────────────────┐      │
│    │  🎮  開 始 遊 戲            │      │  ← 主按鈕 (56px 高)
│    └─────────────────────────────┘      │
│    ┌─────────────────────────────┐      │
│    │  📋  選 擇 關 卡            │      │
│    └─────────────────────────────┘      │
│    ┌─────────────────────────────┐      │
│    │  🏆  排 行 榜               │      │
│    └─────────────────────────────┘      │
│    ┌─────────────────────────────┐      │
│    │  ⚙️   設 定                 │      │
│    └─────────────────────────────┘      │
│                                         │
│  🦔🦔🦔  地鼠走路動畫（底部）  🦔🦔🦔   │
└─────────────────────────────────────────┘
```

### 3.4 遊戲中 HUD

```
┌─────────────────────────────────────────┐
│  ❤️❤️❤️   STAGE 3      ⏱ 00:45        │  ← 上方狀態列
│  分數：012580        連擊：x5 🔥        │
├─────────────────────────────────────────┤
│                                         │
│  [洞] [洞] [洞]                         │
│  [洞] [洞] [洞]   ← 3×3 ~ 4×4 格     │
│  [洞] [洞] [洞]                         │
│                                         │
├─────────────────────────────────────────┤
│  🔨 技能1   💣 技能2   🧲 技能3        │  ← 技能列（大按鈕）
└─────────────────────────────────────────┘
```

### 3.5 過場動畫規格

| 過場類型 | 動畫 | 時長 |
|----------|------|------|
| 關卡開始 | 倒數 3→2→1→GO！縮放彈入 | 2.5s |
| 關卡完成 | 畫面金粒子爆炸 + 評星展開 | 2.0s |
| 關卡失敗 | 畫面震動 + 紅色閃爍 + 地鼠勝利舞 | 2.0s |
| BOSS 登場 | 地動效果 + 大地鼠從下方破洞而出 | 3.0s |
| 連擊達成 | 畫面邊框閃光 + 文字彈出 | 0.5s |

### 3.6 設定頁面

```
⚙️ 設定
────────────────────────────────
音樂音量    [━━━━━━●────]  70%     ← 滑桿，字體 22px
音效音量    [━━━━━━━━●──]  85%
畫面震動    [●ON ] / [ OFF]       ← 大型切換鈕 (56px 高)
粒子效果    [●ON ] / [ OFF]
語言        [繁中 ▾]              ← 下拉選單
難度預設    [普通 ▾]
────────────────────────────────
       [ 重置最高分 ]
       [ 清除存檔   ]
```

---

## 4. 音樂與音效系統

### 4.1 AudioEngine 架構

所有聲音使用 **Web Audio API** 即時合成，無需任何音檔下載。

```javascript
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.musicGain  = this.ctx.createGain();
    this.sfxGain    = this.ctx.createGain();
    // 混響器（Reverb）
    this.reverb     = this.createConvolver();
    // 壓縮器
    this.compressor = this.ctx.createDynamicsCompressor();
  }
}
```

### 4.2 背景音樂 BGM

每關有獨立 BGM，使用音序器（Sequencer）方式驅動，以 16 步驟 / 小節循環。

| 關卡 | 風格 | BPM | 使用合成器 | 和弦進行 |
|------|------|-----|-----------|----------|
| 1 | 輕快木琴 | 100 | Marimba Synth | C–Am–F–G |
| 2 | 爵士鋼琴 | 110 | FM Piano + 低音 | ii–V–I |
| 3 | 8-bit 電玩 | 120 | Square Wave Arp | Dorian 調式 |
| 4 | 叢林鼓聲 | 130 | 打擊合成 + Xylo | 五聲音階 |
| 5 | 鬼怪萬聖節 | 95 | 鋸齒波 + Tremolo | Phrygian |
| 6 | 忍者日本風 | 140 | 三味線模擬 + 打擊 | 日本音階 |
| 7 | 太空電子 | 150 | Pad + Arp | 全音音階 |
| 8 | 重金屬 | 160 | 失真吉他模擬 | Power Chord |
| 9 | 管弦史詩 | 125 | 弦樂 + 銅管模擬 | 大調進行 |
| 10 | BOSS 終極混合 | 170 | 以上全部混合 | 自由調性 |

#### 4.2.1 BGM 音序器實作重點

```javascript
// 每一個音符節點的描述
const TRACK_MARIMBA = [
  // [音高(Hz), 拍位(step 0–15), 時值(秒)]
  [523, 0, 0.2], [659, 2, 0.2], [784, 4, 0.2],
  [1046, 6, 0.4], [784, 8, 0.2], [659, 10, 0.2],
  // ...
];

function scheduleNote(freq, startTime, duration) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.8, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain).connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration);
}
```

#### 4.2.2 動態 BGM 調整

- 連擊 ≥ 5：加入打擊樂層（額外鼓聲 track）
- 時間剩 10 秒：BPM 加速 15%、音量提高 10%
- BOSS 階段：疊加 Pad 層、增加和弦張力

### 4.3 音效（SFX）清單

| 觸發事件 | 合成方式 | 頻率/說明 |
|----------|----------|----------|
| 打中普通地鼠 | 短促 Sine Burst + 噪音 | 440Hz → 220Hz 滑音 |
| 打中黃金鼠 | 金屬音 FM Bell | 高頻 880Hz |
| 打中炸彈鼠（壞） | 低頻爆炸 Noise | 20–80Hz 短爆 |
| 打中毒鼠（壞） | 不和諧雙音 | 200Hz + 211Hz 差音 |
| 連擊升級 | 上揚音階 Arp | C–E–G–C |
| 連擊斷掉 | 下滑失落音 | 400Hz→150Hz |
| 使用技能 | 充電收縮音 | Sawtooth 濾波掃頻 |
| 技能冷卻中 | 短促拒絕音 | 100Hz 雙音 |
| 關卡完成 | 勝利號角 | I–III–V–VIII |
| 關卡失敗 | 哀傷下行 | 小調 V→I |
| BOSS 攻擊 | 低頻震動 | 30Hz 子低頻 + Noise |
| 地鼠出現（特殊） | 小小升音 | 350Hz→500Hz |
| 擋板出現 | 金屬碰撞 | Clang 雜訊濾波 |
| 獲得道具 | 清脆鈴聲 | 三和音 Bell |
| 時間警告 | 心跳節奏 | 60bpm 低音脈衝 |
| BOSS 死亡 | 爆炸序列 | 多層 Noise Burst |

### 4.4 音效合成範例（打中地鼠）

```javascript
function playSfxHit() {
  const ctx = audioEngine.ctx;
  const now = ctx.currentTime;

  // 衝擊音
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
  gain.gain.setValueAtTime(1.0, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(audioEngine.sfxGain);
  osc.start(now); osc.stop(now + 0.15);

  // 噪音層（打擊質感）
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  const nGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  noise.buffer = buffer;
  nGain.gain.setValueAtTime(0.6, now);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  noise.connect(filter).connect(nGain).connect(audioEngine.sfxGain);
  noise.start(now);
}
```

---

## 5. 核心遊戲機制

### 5.1 格子系統

| 關卡範圍 | 格子數 | 說明 |
|----------|--------|------|
| 關卡 1–3  | 3×3 = 9 格 | 初階，間距寬 |
| 關卡 4–6  | 3×4 = 12 格 | 中階 |
| 關卡 7–8  | 4×4 = 16 格 | 高階 |
| 關卡 9–10 | 4×5 = 20 格 | 大師 |

### 5.2 地鼠行為參數

每隻地鼠有以下屬性：

```javascript
{
  id: String,           // 唯一 ID
  type: String,         // 種類（見第8節）
  holeIndex: Number,    // 所在地洞索引
  appearDuration: ms,   // 出現持續時間
  hitPoints: Number,    // 需打次數（1–3）
  reward: Number,       // 得分值
  penalty: Number,      // 誤打扣分值
  speed: 'slow'|'normal'|'fast'|'flash',
  hasShield: Boolean,   // 是否有擋板
  specialAbility: String// 特殊行為
}
```

### 5.3 點擊/觸控處理

```javascript
// 統一使用 Pointer Events 處理觸控與滑鼠
hole.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleHit(holeIndex, e);
});
```

- 同一地洞的重複快速點擊（< 150ms）視為一次
- 觸控區域比視覺地洞大 **20px padding**（提升手機命中率）
- 點擊動畫：地洞輕微縮放（scale 0.95）+ 漣漪效果

### 5.4 連擊系統（Combo）

| 連擊數 | 倍率 | 效果 |
|--------|------|------|
| 1–4 | ×1 | 無 |
| 5–9 | ×1.5 | 畫面邊框橘色閃光 |
| 10–19 | ×2 | BGM 加入打擊層 |
| 20–29 | ×3 | 畫面邊框持續發光 + 地鼠變大（更好打）|
| 30+ | ×5 | 全畫面震動 + 彩虹邊框 |

連擊中斷條件：
- 未打到地鼠自行縮回（**非炸彈鼠**）
- 打到不該打的地鼠類型（毒鼠、炸彈鼠）
- 誤點空洞（桌面模式）

### 5.5 生命值系統

- 初始生命：3 顆心
- 失去生命：誤打炸彈鼠、誤打毒鼠、BOSS 攻擊成功
- 恢復生命：關卡完成後若評星 ≥ 3 星，恢復 1 顆心
- 生命為 0：遊戲結束（Game Over）

---

## 6. 特殊能力與道具系統

### 6.1 玩家技能（每關開始前可選 2 個）

| 技能名稱 | 圖示 | 效果 | 冷卻 | 說明 |
|----------|------|------|------|------|
| ⚡ 閃電錘 | 🔨 | 全場所有地洞同時打擊一次 | 20s | 連擊不中斷 |
| 🧲 地鼠磁鐵 | 🧲 | 3 秒內所有地鼠不縮回 | 25s | 可慢慢打 |
| 💣 炸彈清場 | 💥 | 清除全場地鼠（含障礙物）| 30s | 不扣分不加分 |
| 🐢 時間減速 | ⏳ | 地鼠動作速度減半（5 秒）| 20s | 計時器不受影響 |
| 🔍 透視鏡 | 🔭 | 揭示偽裝地鼠真實身分（5 秒）| 15s | 識破偽裝鼠 |
| 💰 黃金時代 | ⭐ | 5 秒內所有分數 ×2 | 25s | 疊加連擊倍率 |
| 🛡️ 護盾 | 🛡️ | 下次誤打不扣血 | 45s | 一次性使用 |
| 🌪️ 旋風 | 🌪️ | 隨機打擊 5 個地鼠位置 | 18s | 不保證命中 |

### 6.2 道具（遊戲中隨機掉落）

道具以特殊地鼠形式出現（閃光效果），打中即獲得：

| 道具 | 出現機率 | 效果 | 持續 |
|------|----------|------|------|
| ⭐ 星星 | 15% | 得分 +200 | 即時 |
| ❤️ 愛心 | 8% | 恢復 1 生命 | 即時 |
| ⏱️ 時鐘 | 10% | 計時器 +5 秒 | 即時 |
| 💊 解毒劑 | 5% | 解除毒鼠中毒效果 | 即時 |
| 🎯 準心 | 7% | 下 10 次點擊必中 | 10 次 |
| 🔥 火焰 | 5% | 連擊不中斷（10 秒）| 10s |

---

## 7. 十關卡設計

### 關卡 1：田野新手村

| 項目 | 數值 |
|------|------|
| 格子 | 3×3 |
| 時間 | 60 秒 |
| 目標分數 | 500 |
| 地鼠種類 | 普通鼠 |
| 特殊機制 | 無 |
| BGM | 輕快木琴 |

**關卡描述**：陽光普照的草地，只有最基本的棕色地鼠出沒，出現速度慢、持續時間長，適合新玩家熟悉操作。

**地鼠排程（前 20 秒節錄）**：
```
t=2s:  洞[4] 普通鼠（2.5s 出現）
t=4s:  洞[0] 普通鼠（2.5s 出現）
t=5s:  洞[7] 普通鼠（2.5s 出現）
...
```

**通關條件**：達到目標分數 500 分  
**評星標準**：★ 500 / ★★ 800 / ★★★ 1200

---

### 關卡 2：爵士農場

| 項目 | 數值 |
|------|------|
| 格子 | 3×3 |
| 時間 | 60 秒 |
| 目標分數 | 800 |
| 地鼠種類 | 普通鼠、快速鼠 |
| 特殊機制 | 首次出現「雙連出」（同時 2 洞） |
| BGM | 爵士鋼琴 |

**新增機制說明**：快速鼠（橘色）出現 1.2 秒即縮回，得分 ×1.5，需反應更快。偶爾兩隻普通鼠同時出現，訓練分視注意力。

**評星標準**：★ 800 / ★★ 1200 / ★★★ 1800

---

### 關卡 3：8-bit 像素森林

| 項目 | 數值 |
|------|------|
| 格子 | 3×3 |
| 時間 | 55 秒 |
| 目標分數 | 1200 |
| 地鼠種類 | 普通鼠、快速鼠、毒鼠 |
| 特殊機制 | 首次出現「毒鼠」；打中扣 150 分 + 扣 1 血 |
| BGM | 8-bit 電玩 |

**場景特色**：像素化視覺效果（CSS pixelated rendering），地洞有像素邊框。毒鼠（紫色）混在普通鼠中，玩家需快速辨識。

**新玩家提示**：首次出現毒鼠時，顯示教學提示框（可關閉）。

**評星標準**：★ 1200 / ★★ 1800 / ★★★ 2600

---

### 關卡 4：叢林鼓聲

| 項目 | 數值 |
|------|------|
| 格子 | 3×4 = 12 格 |
| 時間 | 60 秒 |
| 目標分數 | 2000 |
| 地鼠種類 | 普通鼠、快速鼠、毒鼠、裝甲鼠 |
| 特殊機制 | **擋板登場**：木頭擋板隨機覆蓋 1–2 個洞 |
| BGM | 叢林鼓聲 |

**擋板機制**：木頭擋板每 12 秒出現一次，覆蓋隨機地洞 6 秒。被覆蓋的洞無法點擊，但地鼠仍會嘗試出現（可透過技能清除）。

**裝甲鼠**：需打 2 次才能消滅，第一次打掉頭盔（音效：金屬撞擊），第二次才得分。

**評星標準**：★ 2000 / ★★ 3000 / ★★★ 4500

---

### 關卡 5：鬼怪萬聖節

| 項目 | 數值 |
|------|------|
| 格子 | 3×4 = 12 格 |
| 時間 | 55 秒 |
| 目標分數 | 2800 |
| 地鼠種類 | 普通鼠、快速鼠、毒鼠、偽裝鼠、炸彈鼠 |
| 特殊機制 | **偽裝鼠**（裝成普通鼠，打中瞬間變毒鼠扣分）；**黑暗模式**（每 15 秒整體畫面變暗 3 秒）|
| BGM | 鬼怪萬聖節 |

**黑暗模式**：畫面亮度降至 20%，只剩地洞隱約發光。使用「透視鏡」技能可提早還原亮度。

**炸彈鼠**（深黑色，頭上有倒數）：若不在 3 秒內打中，爆炸傷及相鄰所有洞的地鼠（打掉所有相鄰正在出現的鼠，不得分），並扣 1 血。

**評星標準**：★ 2800 / ★★ 4200 / ★★★ 6000

---

### 關卡 6：忍者道場

| 項目 | 數值 |
|------|------|
| 格子 | 3×4 = 12 格 |
| 時間 | 50 秒 |
| 目標分數 | 4000 |
| 地鼠種類 | 普通鼠、快速鼠、忍者鼠、反擊鼠 |
| 特殊機制 | **移動擋板**（擋板會橫向滑動）；**反擊鼠** |
| BGM | 忍者日本風 |

**忍者鼠**：僅出現 0.8 秒，打中得分 ×3，極高難度。  
**反擊鼠**（紅眼）：打中後擋板立即出現 5 秒，封鎖 2 個洞。  
**移動擋板**：從格子左側緩緩移動到右側，覆蓋不同的洞，需預測位置。

**評星標準**：★ 4000 / ★★ 5800 / ★★★ 8000

---

### 關卡 7：太空殖民地

| 項目 | 數值 |
|------|------|
| 格子 | 4×4 = 16 格 |
| 時間 | 60 秒 |
| 目標分數 | 6000 |
| 地鼠種類 | 普通鼠、磁力鼠、分裂鼠、隱形鼠 |
| 特殊機制 | **重力翻轉**（每 20 秒格子上下顛倒 5 秒）；**能量擋板** |
| BGM | 太空電子 |

**磁力鼠**：打中後，將同一行的所有地鼠吸引出來（額外得分）。  
**分裂鼠**：打中後分裂成 2 隻普通鼠（移到左右相鄰洞）。  
**隱形鼠**：每 1 秒閃爍消失 0.3 秒，只能在出現瞬間點擊。  
**能量擋板**：透明藍色障礙，接觸地鼠會讓地鼠加速；無法用炸彈清除，需等待自然消失（8 秒）。

**評星標準**：★ 6000 / ★★ 8500 / ★★★ 12000

---

### 關卡 8：地獄金屬競技場

| 項目 | 數值 |
|------|------|
| 格子 | 4×4 = 16 格 |
| 時間 | 50 秒 |
| 目標分數 | 9000 |
| 地鼠種類 | 裝甲鼠（×2 HP）、爆炸鏈鼠、狂暴鼠 |
| 特殊機制 | **全場裝甲化**（所有鼠皆有護甲）；**鐵閘擋板**（一組 2×1 橫向鐵閘）；**火焰地板**（部分格子燙傷效果）|
| BGM | 重金屬 |

**爆炸鏈鼠**：打中後爆炸傷及左右相鄰鼠（若為普通鼠一起消滅加分；若為有害鼠則觸發懲罰）。  
**狂暴鼠**（紅色）：出現速度極快，得分高（×5），但打中後全場速度加快 5 秒。  
**鐵閘擋板**：完全不透明，無法被任何技能清除，只能等待（倒數 10 秒）。  
**火焰地板**：被標記的格子（3–4 個）中地鼠出現時會發出警示，1.5 秒後消失，此格的地鼠不得不打（打中不得分、不縮回）。

**評星標準**：★ 9000 / ★★ 13000 / ★★★ 18000

---

### 關卡 9：神殿時光迴廊

| 項目 | 數值 |
|------|------|
| 格子 | 4×5 = 20 格 |
| 時間 | 70 秒 |
| 目標分數 | 14000 |
| 地鼠種類 | 全種類 |
| 特殊機制 | **時間迴廊**（格子分為「過去區」和「未來區」，規則不同）；**古代石板擋板** |
| BGM | 管弦史詩 |

**時間迴廊機制**：
- **過去區**（左半 4×3）：普通規則，打中得分
- **未來區**（右半 4×2）：分數 ×2，但地鼠出現順序提前 1 秒預告（透明輪廓），需在倒計 1 秒內打中

**古代石板擋板**：外觀為石板，覆蓋 2×2 格。打中 3 次（石板碎裂動畫）才能移除，每次打擊石板不消耗連擊。

**評星標準**：★ 14000 / ★★ 20000 / ★★★ 28000

---

### 關卡 10：地底王者 BOSS 戰

| 項目 | 數值 |
|------|------|
| 格子 | 4×5 = 20 格 |
| 時間 | 90 秒（3 階段，各 30 秒） |
| 目標 | 擊敗 BOSS（生命值 100 點）|
| 地鼠種類 | 全種類 + BOSS 技 |
| 特殊機制 | **BOSS 三階段**；**全擋板輪番**；**合成音樂最終混合** |
| BGM | 終極混合 BOSS |

#### 第一階段（HP 100→66）：「喚地軍」
- BOSS 頭從下方中央大洞冒出，每次需打 5 下縮回
- 每打 1 下 BOSS，隨機召喚 1 隻小鼠（需清場才能繼續打 BOSS）
- 擋板：木頭擋板 ×2，隨機位置

#### 第二階段（HP 66→33）：「黑暗翻地」
- 地動效果（畫面抖動），格子隨機重新排列一次
- BOSS 多出「潛地技能」：隨機封鎖 4 個洞（黑色覆蓋），持續 8 秒
- 所有地鼠速度加快 20%
- 擋板：移動擋板 ×1 + 能量擋板 ×1

#### 第三階段（HP 33→0）：「末日狂怒」
- BOSS 攻擊頻率加倍
- 每 5 秒隨機一個格子爆炸（視覺效果），打亂地鼠出現計畫
- 每次打中 BOSS 需 8 下才縮回
- 擋板：全種類同時可能出現
- 打敗 BOSS：大型勝利動畫，所有地鼠歡呼跳舞，存檔通關

**通關獎勵**：解鎖「大師模式」（所有關卡難度提升，計時器縮短 20%）

---

## 8. 地鼠種類與行為

| 編號 | 名稱 | 顏色 | HP | 出現時長 | 分數 | 特殊行為 |
|------|------|------|----|---------|----- |----------|
| 01 | 普通鼠 | 棕色 | 1 | 2.5s | +100 | 無 |
| 02 | 快速鼠 | 橘色 | 1 | 1.2s | +150 | 出現時短暫閃光 |
| 03 | 毒鼠 | 紫色 | 1 | 2.0s | -150 & -1血 | 打中有毒霧效果 |
| 04 | 裝甲鼠 | 灰色（頭盔）| 2 | 3.0s | +200 | 第一擊掉頭盔 |
| 05 | 偽裝鼠 | 棕色（隱藏紫）| 1 | 2.2s | -200 | 打中才揭示真面目 |
| 06 | 炸彈鼠 | 黑色（計時）| 1 | 3.0s | -1血 / 爆炸 | 倒數爆炸傷鄰洞 |
| 07 | 忍者鼠 | 深藍 | 1 | 0.8s | +350 | 閃現出現 |
| 08 | 反擊鼠 | 紅眼 | 1 | 2.0s | +150 | 打中後觸發擋板 |
| 09 | 磁力鼠 | 藍色 | 1 | 2.5s | +250 + 連動分 | 打中拉出鄰洞地鼠 |
| 10 | 分裂鼠 | 雙色 | 1 | 2.0s | +80（打出的鼠 +100 各）| 分裂成 2 普通鼠 |
| 11 | 隱形鼠 | 透明閃爍 | 1 | 2.0s（閃爍）| +400 | 每秒消失 0.3s |
| 12 | 爆炸鏈鼠 | 深紅 | 1 | 2.0s | +200 + 連鎖 | 打中波及鄰鼠 |
| 13 | 狂暴鼠 | 紅色（眼冒火）| 1 | 0.6s | +500 | 打中全場加速 5s |
| 14 | 黃金鼠 | 金色閃光 | 1 | 1.5s | +600 | 隨機出現，極稀有 |
| 15 | BOSS 本體 | 超大棕色 | 100 | 永久 | - | 特殊攻擊技能 |

---

## 9. 擋板與障礙物系統

### 9.1 擋板種類總覽

| 擋板名稱 | 外觀 | 大小 | 持續時間 | 移除方式 | 首次出現 |
|----------|------|------|----------|----------|----------|
| 🪵 木頭擋板 | 棕木紋 | 1×1 | 6s | 技能炸彈 / 自動 | 關卡 4 |
| 🚪 鐵閘 | 深灰金屬 | 2×1 | 10s | 無法移除（等待）| 關卡 8 |
| 💙 能量擋板 | 半透明藍 | 1×1 | 8s | 等待自動 | 關卡 7 |
| 🪨 古代石板 | 灰褐石紋 | 2×2 | 直到打破 | 打擊 3 次 | 關卡 9 |
| ➡️ 移動擋板 | 木頭（移動）| 1×1 | 滑過全場 | 技能炸彈 | 關卡 6 |
| ⬛ BOSS 封鎖 | 純黑 | 1×1 ×4 | 8s | 無法移除 | 關卡 10 |
| 🔥 火焰地板 | 紅橘火紋 | 1×1 ×3 | 每 20s 觸發 | 等待 | 關卡 8 |

### 9.2 擋板行為規格

```javascript
class Obstacle {
  constructor({ type, cells, duration, removable, hitRequired }) {
    this.type        = type;
    this.cells       = cells;       // 覆蓋的格子 index 陣列
    this.duration    = duration;    // 毫秒
    this.removable   = removable;   // 可否用技能移除
    this.hitRequired = hitRequired; // 需打幾次（0 = 不可打）
    this.currentHits = 0;
    this.element     = null;        // DOM 節點
  }

  takeDamage() {
    if (!this.removable || this.hitRequired === 0) return;
    this.currentHits++;
    this.playHitEffect();
    if (this.currentHits >= this.hitRequired) this.remove();
  }
}
```

### 9.3 移動擋板路徑

```
格子序號（4×3 示例）：
[0][1][2][3]
[4][5][6][7]
[8][9][10][11]

移動路徑（水平掃描）：
0 → 1 → 2 → 3（top row, 4 秒掃過）
重複下一行...
```

---

## 10. 分數與評分系統

### 10.1 分數計算公式

```
最終分數 = 基礎分 × 連擊倍率 × 技能倍率 × 時間獎勵
時間獎勵 = 1 + (剩餘秒數 / 關卡總秒數) × 0.3
```

### 10.2 關卡結算評星

| 評分 | 條件 |
|------|------|
| ★☆☆ | 達到最低目標分數 |
| ★★☆ | 達到 ×1.5 目標分 |
| ★★★ | 達到 ×2.2 目標分 + 剩餘生命 ≥ 2 |

### 10.3 結算畫面元素

```
╔════════════════════════════════╗
║     🎉 關卡完成！              ║
║     STAGE 4 · 叢林鼓聲         ║
║                                ║
║     ★  ★  ★                   ║  ← 評星動畫（逐個亮起）
║                                ║
║  最終分數    12,580             ║  ← 滾動數字動畫
║  最高分      10,200  ← NEW！   ║
║  打中率       87%              ║
║  最高連擊     ×14              ║
║  剩餘時間獎勵 +1,240           ║
║  總計         13,820           ║
║                                ║
║  [再玩一次]    [下一關]         ║
╚════════════════════════════════╝
```

---

## 11. 存檔與設定系統

### 11.1 localStorage 資料結構

```javascript
const SAVE_DATA = {
  version: "1.0",
  settings: {
    musicVolume: 0.7,
    sfxVolume: 0.85,
    screenShake: true,
    particles: true,
    language: "zh-TW",
    difficulty: "normal"
  },
  progress: {
    currentLevel: 1,
    levels: {
      1: { stars: 3, highScore: 1580, unlocked: true },
      2: { stars: 2, highScore: 2100, unlocked: true },
      // ...
    },
    totalScore: 28450,
    masterMode: false
  },
  stats: {
    totalMolesHit: 342,
    totalMolesMissed: 58,
    highestCombo: 28,
    gamesPlayed: 15
  }
};
```

### 11.2 自動存檔時機

- 每個關卡結算後立即儲存
- 設定變更後立即儲存
- 首次開啟時讀取（若無則建立預設值）

---

## 12. 行動裝置適配

### 12.1 響應式斷點

```css
/* 手機直向（主要目標） */
@media (max-width: 480px) {
  .game-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .hud-score { font-size: 28px; }
  .btn-primary { font-size: 22px; min-height: 56px; }
}

/* 手機橫向 / 小平板 */
@media (min-width: 481px) and (max-width: 768px) {
  .game-grid { gap: 12px; }
  .hud-score { font-size: 32px; }
}

/* 桌面 */
@media (min-width: 769px) {
  .game-grid { max-width: 600px; margin: 0 auto; }
}
```

### 12.2 觸控最佳化

- 所有可點擊元素最小尺寸：**48×48 px**（Google Material 標準）
- 地洞觸控熱區：視覺範圍 + 外擴 12px（透過 `::after` 偽元素）
- 禁止雙擊縮放：`touch-action: manipulation`
- 防止橡皮筋效果：`overscroll-behavior: none`
- 防止文字選取：`user-select: none`

### 12.3 震動回饋（Vibration API）

```javascript
function vibrate(pattern) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
// 打中地鼠：vibrate(50)
// 連擊達成：vibrate([50, 30, 50])
// 關卡完成：vibrate([100, 50, 100, 50, 200])
// 失血：vibrate(300)
```

### 12.4 螢幕方向鎖定提示

若偵測到桌面版在橫向但格子 ≥ 4×5 時顯示溫馨提示，手機版不強制限制（已適配兩個方向）。

---

## 13. 畫面流程圖

```
[啟動 index.html]
       │
       ▼
[初始化 AudioEngine + 加載字型]
       │
       ▼
[讀取 localStorage 存檔]
       │
       ▼
┌──────────────────────────────────┐
│           主畫面                  │
│  開始遊戲 / 選關 / 排行榜 / 設定  │
└──────┬───────────────────────────┘
       │ 開始遊戲
       ▼
[技能選擇畫面（2 選自 8 技能）]
       │
       ▼
[關卡倒數 3→2→1→GO!]
       │
       ▼
┌──────────────────────────────────┐
│           遊戲進行中               │
│  地鼠出現 → 玩家點擊 → 判定       │
│  道具掉落 → 擋板出現 → 技能使用   │
└──────┬───────────────────────────┘
       │
   ┌───┴───┐
   │       │
時間到   生命=0
   │       │
   ▼       ▼
[達標?]  [Game Over 畫面]
  │
  ├─是→ [關卡結算 / 評星 / 儲存]
  │              │
  │        [解鎖下一關]
  │
  └─否→ [失敗畫面 / 再試一次]
```

---

## 14. 完整 HTML 骨架與 CSS 變數

### 14.1 HTML 結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>MOLE MAYHEM：地洞混亂</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Orbitron:wght@700&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
  <style>/* ... 所有 CSS ... */</style>
</head>
<body>

  <!-- 畫面層 -->
  <div id="screen-home"    class="screen active"> ... </div>
  <div id="screen-select"  class="screen">        ... </div>
  <div id="screen-skill"   class="screen">        ... </div>
  <div id="screen-game"    class="screen">        ... </div>
  <div id="screen-result"  class="screen">        ... </div>
  <div id="screen-settings"class="screen">        ... </div>
  <div id="screen-gameover"class="screen">        ... </div>

  <!-- 全域覆蓋層 -->
  <div id="overlay-countdown" class="overlay hidden"> ... </div>
  <div id="overlay-tutorial"  class="overlay hidden"> ... </div>
  <div id="overlay-boss-intro"class="overlay hidden"> ... </div>
  <div id="particles-container"></div>

  <script>/* ... 所有 JS ... */</script>
</body>
</html>
```

### 14.2 遊戲網格 DOM

```html
<div id="game-grid" class="game-grid grid-3x3">
  <!-- 動態生成 9–20 個地洞 -->
  <div class="hole" data-index="0">
    <div class="hole-inner">
      <div class="mole" data-type="normal">
        <div class="mole-face">
          <div class="mole-eyes"></div>
          <div class="mole-nose"></div>
        </div>
      </div>
    </div>
    <div class="hole-obstacle hidden"></div>
    <div class="hit-effect hidden"></div>
  </div>
  <!-- ...重複... -->
</div>
```

### 14.3 核心動畫 CSS

```css
/* 地鼠出現動畫 */
@keyframes mole-rise {
  0%   { transform: translateY(100%); }
  20%  { transform: translateY(-8%); }
  35%  { transform: translateY(4%); }
  50%  { transform: translateY(0%); }
  100% { transform: translateY(0%); }
}

/* 地鼠縮回動畫 */
@keyframes mole-drop {
  0%   { transform: translateY(0%); }
  100% { transform: translateY(110%); }
}

/* 打中效果 */
@keyframes hit-burst {
  0%   { transform: scale(0); opacity: 1; }
  80%  { transform: scale(2.5); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}

/* 連擊邊框發光 */
@keyframes combo-glow {
  0%, 100% { box-shadow: inset 0 0 0px transparent; }
  50%       { box-shadow: inset 0 0 40px var(--color-primary); }
}

/* 畫面震動 */
@keyframes screen-shake {
  0%, 100% { transform: translate(0); }
  10%       { transform: translate(-6px, -3px); }
  30%       { transform: translate(6px, 3px); }
  50%       { transform: translate(-4px, 2px); }
  70%       { transform: translate(4px, -2px); }
  90%       { transform: translate(-2px, 1px); }
}
```

---

## 15. Web Audio API 實作範例

### 15.1 BGM 音序器完整類別

```javascript
class BGMSequencer {
  constructor(audioEngine) {
    this.ae        = audioEngine;
    this.ctx       = audioEngine.ctx;
    this.bpm       = 120;
    this.beatLen   = 60 / this.bpm;
    this.stepLen   = this.beatLen / 4; // 16分音符
    this.steps     = 16;
    this.currentStep = 0;
    this.nextNoteTime = 0;
    this.tracks    = [];
    this.running   = false;
    this.scheduleAhead = 0.1; // 秒
    this.timerInterval = 25;  // ms
  }

  setBPM(bpm) {
    this.bpm = bpm;
    this.beatLen = 60 / bpm;
    this.stepLen = this.beatLen / 4;
  }

  addTrack(notes) { // notes: [{step, freq, type, dur, gain}]
    this.tracks.push(notes);
  }

  scheduleNote(freq, type, startTime, duration, gainVal) {
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainVal || 0.5, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain).connect(this.ae.musicGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAhead) {
      this.tracks.forEach(track => {
        track.forEach(note => {
          if (note.step === this.currentStep) {
            this.scheduleNote(note.freq, note.type,
              this.nextNoteTime, note.dur * this.stepLen, note.gain);
          }
        });
      });
      this.currentStep = (this.currentStep + 1) % this.steps;
      this.nextNoteTime += this.stepLen;
    }
  }

  start() {
    this.running = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.intervalId = setInterval(() => this.scheduler(), this.timerInterval);
  }

  stop() {
    this.running = false;
    clearInterval(this.intervalId);
  }
}
```

### 15.2 關卡 1 木琴 BGM 音符定義（節錄）

```javascript
const LEVEL1_TRACK = [
  // step, freq(Hz), type,      dur(拍), gain
  { step:  0, freq: 523.25, type: 'sine',   dur: 0.8, gain: 0.6 }, // C5
  { step:  2, freq: 659.25, type: 'sine',   dur: 0.8, gain: 0.6 }, // E5
  { step:  4, freq: 783.99, type: 'sine',   dur: 0.8, gain: 0.6 }, // G5
  { step:  6, freq: 1046.5, type: 'sine',   dur: 1.6, gain: 0.5 }, // C6
  { step:  8, freq: 783.99, type: 'sine',   dur: 0.8, gain: 0.6 }, // G5
  { step: 10, freq: 659.25, type: 'sine',   dur: 0.8, gain: 0.6 }, // E5
  { step: 12, freq: 523.25, type: 'sine',   dur: 0.8, gain: 0.6 }, // C5
  { step: 14, freq: 392.00, type: 'sine',   dur: 0.8, gain: 0.5 }, // G4
  // 低音伴奏
  { step:  0, freq: 130.81, type: 'triangle', dur: 1.6, gain: 0.4 }, // C3
  { step:  4, freq: 174.61, type: 'triangle', dur: 1.6, gain: 0.4 }, // F3
  { step:  8, freq: 196.00, type: 'triangle', dur: 1.6, gain: 0.4 }, // G3
  { step: 12, freq: 130.81, type: 'triangle', dur: 1.6, gain: 0.4 }, // C3
];
```

### 15.3 BOSS 戰爆炸 SFX

```javascript
function playSfxExplosion(intensity = 1.0) {
  const ctx = audioEngine.ctx;
  const now = ctx.currentTime;

  // 子低頻轟鳴
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(60 * intensity, now);
  sub.frequency.exponentialRampToValueAtTime(20, now + 0.5);
  subGain.gain.setValueAtTime(1.0, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  sub.connect(subGain).connect(audioEngine.sfxGain);
  sub.start(now); sub.stop(now + 0.6);

  // 白噪音爆炸層
  const bufLen = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const nGain = ctx.createGain();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);
  nGain.gain.setValueAtTime(0.8 * intensity, now);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.buffer = buffer;
  noise.connect(filter).connect(nGain).connect(audioEngine.sfxGain);
  noise.start(now);
}
```

---

## 附錄：開發優先順序

| 階段 | 工作項目 | 預估工時 |
|------|----------|----------|
| Phase 1 | HTML 骨架 + CSS 基礎 + 主畫面 | 4h |
| Phase 2 | 核心遊戲邏輯（3×3，普通鼠，計時，分數）| 6h |
| Phase 3 | Web Audio Engine + BGM + 基礎音效 | 8h |
| Phase 4 | 關卡 1–5 地鼠種類 + 擋板系統 | 8h |
| Phase 5 | 技能系統 + 道具系統 | 4h |
| Phase 6 | 關卡 6–9 + 特殊機制 | 8h |
| Phase 7 | BOSS 關卡 10 + 全場動畫 | 6h |
| Phase 8 | 行動裝置測試 + 效能最佳化 | 4h |
| Phase 9 | 存檔系統 + 設定頁面 + 排行榜 | 3h |
| Phase 10 | QA 全關卡通測 + 微調平衡 | 4h |
| **合計** | | **~55h** |

---

*規格書版本：v1.0 · 最後更新：2026-05-19*  
*技術：純 HTML5 / CSS3 / Vanilla JS / Web Audio API*  
*適用解析度：320px – 2560px（全響應式）*
