# 🐒 MonkeyFortress TD — 純前端塔防遊戲完整規格書

**專案資料夾名稱：`monkey-fortress-td`**  
**版本：v1.0.0**  
**最後更新：2026-05-04**

---

## 目錄

1. [專案概述](#1-專案概述)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [畫面設計規格](#4-畫面設計規格)
5. [遊戲核心機制](#5-遊戲核心機制)
6. [塔（Tower）規格](#6-塔tower規格)
7. [敵人（Enemy）規格](#7-敵人enemy規格)
8. [波次系統（Wave System）](#8-波次系統wave-system)
9. [升級系統](#9-升級系統)
10. [音效與音樂規格](#10-音效與音樂規格)
11. [行動裝置 UX 規範](#11-行動裝置-ux-規範)
12. [資料結構定義](#12-資料結構定義)
13. [模組設計](#13-模組設計)
14. [存檔與設定](#14-存檔與設定)
15. [開發里程碑](#15-開發里程碑)

---

## 1. 專案概述

### 1.1 遊戲簡介

**MonkeyFortress TD** 是一款以猴子軍團阻擋氣球大軍為主題的純前端塔防遊戲，靈感來源於 Bloons Tower Defense 系列。玩家在地圖上放置各式猴子塔，藉由升級與策略搭配，阻止氣球通過終點。

### 1.2 核心目標

- 純前端實作，**零後端依賴**
- 支援**桌機與行動裝置**（觸控優先設計）
- **大字體 UI**，操作直覺清晰
- 內建**背景音樂與音效**（Web Audio API 合成）
- 無需安裝，**單一 HTML 檔案**可執行

### 1.3 技術限制聲明

| 項目 | 方案 |
|------|------|
| 音效 | Web Audio API 程式合成（無需外部檔案）|
| 背景音樂 | Web Audio API 生成循環旋律 |
| 存檔 | localStorage |
| 繪圖 | HTML5 Canvas 2D |
| 動畫 | requestAnimationFrame 遊戲迴圈 |

---

## 2. 技術架構

### 2.1 技術選型

```
語言：HTML5 + CSS3 + Vanilla JavaScript（ES2020+）
繪圖：Canvas 2D API
音效：Web Audio API
存檔：localStorage
字型：Google Fonts（Noto Sans TC）— 本地備援
```

### 2.2 效能目標

- 目標幀率：**60 FPS**（桌機）/ **30 FPS**（中低階手機）
- 同螢幕最多敵人數：**50 個**
- 最多塔數：**30 座**
- 初始載入時間：**< 3 秒**

### 2.3 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome | 88+ |
| Safari | 14+ |
| Firefox | 85+ |
| Edge | 88+ |

---

## 3. 資料夾結構

```
monkey-fortress-td/
├── index.html              # 主入口（單檔模式亦可合併至此）
├── css/
│   ├── main.css            # 全域樣式、CSS 變數
│   ├── ui.css              # HUD、選單、按鈕
│   └── responsive.css      # 行動裝置響應式
├── js/
│   ├── main.js             # 遊戲初始化、主迴圈
│   ├── game/
│   │   ├── GameState.js    # 遊戲狀態管理
│   │   ├── Map.js          # 地圖與路徑
│   │   ├── Tower.js        # 塔基底類別
│   │   ├── TowerTypes.js   # 各塔種類定義
│   │   ├── Enemy.js        # 敵人基底類別
│   │   ├── EnemyTypes.js   # 各敵人種類定義
│   │   ├── Projectile.js   # 子彈與特效
│   │   ├── WaveManager.js  # 波次管理
│   │   └── UpgradeSystem.js# 升級邏輯
│   ├── audio/
│   │   ├── AudioEngine.js  # Web Audio API 管理器
│   │   ├── SoundEffects.js # 音效合成定義
│   │   └── MusicEngine.js  # 背景音樂生成器
│   ├── ui/
│   │   ├── MainMenu.js     # 主選單
│   │   ├── HUD.js          # 遊戲中介面
│   │   ├── TowerPanel.js   # 塔選購面板
│   │   ├── UpgradePanel.js # 升級面板
│   │   └── SettingsPanel.js# 設定面板
│   └── utils/
│       ├── Storage.js      # localStorage 封裝
│       ├── EventBus.js     # 事件系統
│       └── MathUtils.js    # 數學工具函式
└── assets/
    └── maps/
        ├── map01.json
        └── map02.json
```

---

## 4. 畫面設計規格

### 4.1 CSS 變數（設計系統）

```css
:root {
  /* 字型 */
  --font-family: 'Noto Sans TC', 'Arial', sans-serif;
  --font-size-xs:   16px;
  --font-size-sm:   20px;
  --font-size-md:   24px;   /* 主要正文 */
  --font-size-lg:   30px;   /* 選單選項 */
  --font-size-xl:   38px;   /* 標題 */
  --font-size-xxl:  52px;   /* 主標題 */

  /* 顏色 */
  --color-primary:    #F5A623;  /* 金黃（主色）*/
  --color-secondary:  #4CAF50;  /* 草綠（確認）*/
  --color-danger:     #E53935;  /* 紅（敵人/危險）*/
  --color-bg-dark:    #1A1A2E;  /* 深藍（背景）*/
  --color-bg-panel:   #16213E;  /* 面板背景 */
  --color-text-main:  #EAEAEA;
  --color-text-sub:   #A0A0B0;
  --color-gold:       #FFD700;

  /* 間距 */
  --spacing-sm:  8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;

  /* 圓角 */
  --radius-sm:  8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  /* 按鈕最小觸控尺寸（行動裝置） */
  --touch-target: 56px;
}
```

### 4.2 主選單（Main Menu）

```
┌─────────────────────────────────────┐
│        🐒  MonkeyFortress TD        │  ← font-size-xxl, 金黃色
│                                     │
│         ┌───────────────────┐       │
│         │   🎮  開始遊戲    │       │  ← font-size-lg, 按鈕高度 64px
│         └───────────────────┘       │
│         ┌───────────────────┐       │
│         │   🗺️  選擇地圖   │       │
│         └───────────────────┘       │
│         ┌───────────────────┐       │
│         │   ⚙️  遊戲設定   │       │
│         └───────────────────┘       │
│         ┌───────────────────┐       │
│         │   🏆  排行榜      │       │
│         └───────────────────┘       │
│                                     │
│  版本 v1.0.0          © 2026        │  ← font-size-xs
└─────────────────────────────────────┘
```

**主選單規格：**
- 背景：深色漸層 + 浮動氣球動畫（CSS keyframes）
- 按鈕：寬度 80%（最大 360px）、高度 64px、圓角 16px
- 按鈕字體：`font-size-lg`（30px）
- 按鈕 hover：放大 1.05x + 金色邊框光暈
- 按鈕 active（觸控）：縮放 0.96x

### 4.3 地圖選擇畫面

```
┌─────────────────────────────────────┐
│  ← 返回    選擇地圖                 │
├─────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐        │
│  │  縮圖    │   │  縮圖    │        │
│  │ 叢林小徑 │   │ 沙漠蜿蜒 │        │
│  │ ⭐⭐⭐   │   │  🔒鎖定  │        │
│  └──────────┘   └──────────┘        │
└─────────────────────────────────────┘
```

### 4.4 遊戲主畫面（HUD）

```
┌──────────────────────────────────────────────────────┐
│ ❤️ 20   💰 150   🌊 波次 3/10   ⏱️  [▶▶] [⏸] [⚙️] │  ← HUD 頂部
├──────────────────────────────────────────────────────┤
│                                                      │
│                   CANVAS 遊戲區域                    │
│                                                      │
│                   路徑 / 地圖                         │
│                                                      │
├──────────────────────────────────────────────────────┤
│  塔選購區（水平捲動）                                 │
│  [🐒飛鏢$50] [💣炸彈$80] [❄️冰凍$70] [🔥火焰$100]  │  ← font-size-sm
│                      [▶ 發動波次]                    │
└──────────────────────────────────────────────────────┘
```

**HUD 規格：**
- 頂部欄高度：56px（行動裝置）/ 48px（桌機）
- HUD 字體：`font-size-md`（24px）
- 圖示大小：32px
- 底部塔選購列高度：100px，水平捲動
- 塔卡片：80×90px，字體 `font-size-xs`（16px）

### 4.5 塔選購面板（點擊塔後展開）

```
┌─────────────────────────────┐
│  🐒 飛鏢猴                  │
│  傷害: 1  射程: 3  速度: 1  │
│  費用: 💰 50                │
├─────────────────────────────┤
│  [  放置塔  ]               │
│  [  取消    ]               │
└─────────────────────────────┘
```

### 4.6 升級面板（點擊已放置的塔）

```
┌─────────────────────────────────┐
│  🐒 飛鏢猴  Lv.1               │
│  傷害: 1 → 2   射程: 3 → 4    │
│                                 │
│  路線 A: 雙重飛鏢  💰 100      │
│  ┣━━━ Lv1: 雙重射擊            │
│  ┗━━━ Lv2: 穿透飛鏢            │
│                                 │
│  路線 B: 快速射擊  💰 80       │
│  ┣━━━ Lv1: 射速 +50%           │
│  ┗━━━ Lv2: 超速射擊            │
│                                 │
│  [升級 A 💰100] [升級 B 💰80]  │
│  [  賣出 💰25  ]               │
└─────────────────────────────────┘
```

### 4.7 設定面板

```
┌─────────────────────────────────┐
│  ⚙️  遊戲設定                  │  ← font-size-xl
├─────────────────────────────────┤
│  🎵 背景音樂                    │
│  [━━━━●──────] 60%             │  ← 滑桿，font-size-md
│                                 │
│  🔊 音效音量                    │
│  [━━━━━━━━●──] 80%             │
│                                 │
│  🌐 語言                        │
│  ( ● 繁體中文 )  (   English  ) │
│                                 │
│  🎨 圖示大小                    │
│  ( 標準 )  ( ● 大 )  ( 超大 )  │
│                                 │
│  [  儲存設定  ]                 │
└─────────────────────────────────┘
```

### 4.8 波次結束 / 遊戲結束畫面

```
┌─────────────────────────────────┐
│         🏆  波次完成！          │
│                                 │
│   💰 獲得金幣  +25              │
│   ❤️  剩餘生命  18              │
│   ⭐ 效率評分  A                │
│                                 │
│   [  繼續  ]   [  設定  ]       │
└─────────────────────────────────┘
```

---

## 5. 遊戲核心機制

### 5.1 基本規則

- 玩家初始生命：**20**，金幣：**150**
- 氣球通過終點 → 扣除生命值（依氣球層數）
- 生命歸零 → 遊戲失敗
- 完成所有波次且生命 > 0 → 遊戲勝利
- 擊破敵人 → 獲得金幣

### 5.2 遊戲迴圈

```
requestAnimationFrame
  └─ update(deltaTime)
        ├─ 更新所有敵人位置
        ├─ 更新所有子彈位置
        ├─ 塔偵測射程內敵人
        ├─ 塔攻擊計時器
        ├─ 碰撞檢測（子彈 vs 敵人）
        ├─ 處理敵人死亡 / 通關
        ├─ 檢查波次完成
        └─ render()
              ├─ 清除 Canvas
              ├─ 繪製地圖
              ├─ 繪製塔
              ├─ 繪製敵人
              ├─ 繪製子彈 / 特效
              └─ 繪製 HUD
```

### 5.3 地圖路徑系統

- 路徑以**格子座標陣列**定義：`[{x, y}, {x, y}, ...]`
- 敵人沿路徑行走，以插值計算位置
- 格子大小：**64px**（桌機）/ **48px**（行動裝置）
- 可放塔區域：非路徑格子

### 5.4 塔的攻擊邏輯

```
1. 每幀掃描射程內所有敵人
2. 根據目標優先策略選擇目標：
   - 最前方（預設）
   - 最後方
   - 血量最高
   - 血量最低
3. 攻擊冷卻計時器歸零後發射
4. 生成 Projectile 物件，追蹤目標
```

### 5.5 金幣系統

| 事件 | 金幣變化 |
|------|---------|
| 擊破普通氣球 | +1 |
| 擊破強化氣球 | +2 |
| 擊破鋼鐵氣球 | +5 |
| 擊破 BOSS | +20 |
| 波次完成獎勵 | +25 |
| 賣出塔 | 建造費用 × 50% |

---

## 6. 塔（Tower）規格

### 6.1 塔的屬性

```javascript
{
  id: String,           // 唯一識別
  name: String,         // 顯示名稱
  cost: Number,         // 建造費用
  damage: Number,       // 基礎傷害
  range: Number,        // 射程（格子數）
  fireRate: Number,     // 每秒攻擊次數
  projectileSpeed: Number, // 子彈速度（px/s）
  targetType: String,   // 'normal' | 'frozen' | 'armored'
  upgradeTree: Object,  // 升級樹（見升級系統）
  color: String,        // Canvas 繪製顏色
  emoji: String         // UI 顯示圖示
}
```

### 6.2 塔的種類（6種）

#### 🐒 飛鏢猴（Dart Monkey）
```
費用：50     傷害：1     射程：3     射速：1.5/s
特色：基礎塔，全能型，性價比高
升級 A：雙重飛鏢 → 穿透飛鏢 → 無限穿透
升級 B：射速提升 → 超速射擊 → 三連射
```

#### 💣 炸彈猴（Bomb Monkey）
```
費用：80     傷害：4（範圍）射程：2.5   射速：0.8/s
特色：範圍攻擊，對群體有效
升級 A：爆炸半徑增大 → 熱核炸彈 → 超級核爆
升級 B：連鎖爆炸 → 燃燒殘留 → 火焰風暴
```

#### ❄️ 冰凍猴（Ice Monkey）
```
費用：70     傷害：0     射程：2     射速：冷卻 3s
特色：範圍冰凍敵人，無傷害但減速/定格
升級 A：冰凍時間延長 → 絕對零度 → 永凍
升級 B：冰凍範圍增大 → 碎冰傷害 → 冰暴
```

#### 🌿 藤蔓猴（Thorn Monkey）
```
費用：60     傷害：2     射程：3.5   射速：2/s
特色：攻擊速度快，適合長路徑
升級 A：荊棘連射 → 毒素塗層 → 持續中毒
升級 B：多重藤蔓 → 減速藤蔓 → 纏繞陷阱
```

#### 🔥 火砲猴（Cannon Monkey）
```
費用：100    傷害：8     射程：3     射速：0.5/s
特色：高傷害單體，可穿透護甲
升級 A：穿甲砲彈 → 超穿甲 → 終極穿甲
升級 B：燃燒砲彈 → 火焰噴射 → 熔岩砲
```

#### 🦅 鷹眼猴（Eagle Monkey）
```
費用：200    傷害：3     射程：全圖   射速：1/s
特色：無限射程，攻擊全圖任意目標
升級 A：精準狙擊（必暴擊）→ 連環狙擊 → 終結者
升級 B：毒素子彈 → 減速子彈 → 癱瘓射擊
```

---

## 7. 敵人（Enemy）規格

### 7.1 敵人屬性

```javascript
{
  id: String,
  name: String,
  hp: Number,           // 當前血量
  maxHp: Number,        // 最大血量
  speed: Number,        // 移動速度（格子/秒）
  reward: Number,       // 擊殺金幣
  lives: Number,        // 通過終點扣血量
  armor: Boolean,       // 是否有護甲（抵抗 50% 非穿甲傷害）
  frozen: Boolean,      // 是否被冰凍
  poisoned: Boolean,    // 是否中毒
  emoji: String
}
```

### 7.2 敵人種類（7種）

| 圖示 | 名稱 | HP | 速度 | 獎勵 | 扣血 | 特色 |
|------|------|----|------|------|------|------|
| 🔵 | 藍色氣球 | 1 | 1.0 | 1 | 1 | 最基本 |
| 🟢 | 綠色氣球 | 1 | 1.5 | 1 | 1 | 破後生成藍色 |
| 🟡 | 黃色氣球 | 1 | 2.5 | 2 | 1 | 速度快 |
| 🔴 | 紅色氣球 | 3 | 1.0 | 2 | 2 | 較耐打 |
| ⚫ | 黑色氣球 | 5 | 1.2 | 3 | 2 | 免疫爆炸傷害 |
| 🔩 | 鉛色氣球 | 10 | 0.8 | 5 | 3 | 護甲，免疫冰凍 |
| 🔴💀 | BOSS 氣球 | 50 | 0.6 | 20 | 5 | 各種抵抗，超高血量 |

### 7.3 狀態效果

- **冰凍**：移動速度 × 0（持續 2 秒）
- **緩速**：移動速度 × 0.5（持續 3 秒）
- **中毒**：每 0.5 秒扣 1 血（持續 4 秒）
- **燃燒**：每 0.5 秒扣 2 血（持續 3 秒）

---

## 8. 波次系統（Wave System）

### 8.1 波次結構

```javascript
Wave = {
  waveNumber: Number,
  enemies: [
    { type: 'blue', count: 10, interval: 0.8 },  // 每 0.8 秒生成一個
    { type: 'green', count: 5, interval: 1.2, delay: 8 }  // 延遲 8 秒後開始
  ],
  rewardBonus: 25   // 波次完成獎勵
}
```

### 8.2 預設波次設計（地圖一，共 10 波）

| 波次 | 敵人組合 | 難度 |
|------|---------|------|
| 1 | 藍色 ×10 | 教學 |
| 2 | 藍色 ×15 + 綠色 ×5 | 簡單 |
| 3 | 綠色 ×15 + 黃色 ×5 | 簡單 |
| 4 | 黃色 ×10 + 紅色 ×5 | 普通 |
| 5 | 混合波（藍/綠/黃/紅）| 普通 |
| 6 | 紅色 ×15 + 黑色 ×5 | 中等 |
| 7 | 黑色 ×10 + 鉛色 ×5 | 中等 |
| 8 | 鉛色 ×15 + 混合 ×10 | 困難 |
| 9 | 高密度混合波 | 困難 |
| 10 | BOSS + 護衛隊 | BOSS |

### 8.3 波次速度控制

- 玩家可手動觸發下一波（提前獎勵 +10 金幣）
- 2× 加速模式：敵人移動速度 × 2，塔攻擊速度 × 2

---

## 9. 升級系統

### 9.1 升級樹結構

每座塔有 **A 路線** 和 **B 路線**，各 3 級。  
同一座塔：A 路線最多升 3 級，B 路線最多升 3 級（可雙路線並進，但第 3 級互斥）。

```
路線 A: [A1] → [A2] → [A3*]
路線 B: [B1] → [B2] → [B3*]
* 第 3 級升完後，另一路線最多只能升到第 2 級
```

### 9.2 升級資料結構

```javascript
UpgradeTree = {
  pathA: [
    { level: 1, name: '雙重飛鏢', cost: 100, effect: { damage: +1 } },
    { level: 2, name: '穿透飛鏢', cost: 150, effect: { pierce: true } },
    { level: 3, name: '無限穿透', cost: 300, effect: { infinitePierce: true } }
  ],
  pathB: [
    { level: 1, name: '射速提升', cost: 80, effect: { fireRate: +0.5 } },
    { level: 2, name: '超速射擊', cost: 120, effect: { fireRate: +1.0 } },
    { level: 3, name: '三連射',   cost: 250, effect: { multishot: 3 } }
  ]
}
```

---

## 10. 音效與音樂規格

### 10.1 Web Audio API 引擎架構

```javascript
AudioEngine {
  context: AudioContext,
  masterGain: GainNode,      // 主音量
  musicGain: GainNode,       // 音樂音量
  sfxGain: GainNode,         // 音效音量
  
  playSound(id),             // 播放音效
  startMusic(),              // 開始背景音樂
  stopMusic(),               // 停止背景音樂
  setMusicVolume(0~1),
  setSFXVolume(0~1)
}
```

### 10.2 音效清單（程式合成）

| ID | 觸發時機 | 合成方式 |
|----|---------|---------|
| `dart_shoot` | 飛鏢猴射擊 | 短促白噪音 burst（50ms）|
| `bomb_explode` | 炸彈爆炸 | 低頻 sine 衰減 + 噪音（300ms）|
| `ice_freeze` | 冰凍效果 | 高頻 sweep 下降（200ms）|
| `balloon_pop` | 氣球爆破 | 短促 pop（square wave 80ms）|
| `balloon_pass` | 氣球通過終點 | 低沉失敗音（400ms）|
| `tower_place` | 放置塔 | 輕快確認音（150ms）|
| `upgrade` | 升級塔 | 上揚 arpeggio 音（300ms）|
| `wave_start` | 波次開始 | 鼓點 + 警示音（500ms）|
| `wave_complete` | 波次完成 | 短小勝利 jingle（800ms）|
| `game_over` | 遊戲失敗 | 低沉下行音（1200ms）|
| `game_win` | 遊戲勝利 | 上揚 fanfare（1500ms）|
| `button_click` | 按鈕點擊 | 輕微 tick（50ms）|
| `insufficient_gold` | 金幣不足 | 錯誤 buzz（200ms）|

### 10.3 背景音樂規格（MusicEngine）

使用 Web Audio API 生成**程序式背景音樂**，分為三個場景：

#### 主選單音樂
- 風格：輕鬆歡快
- BPM：120
- 和弦進行：C - Am - F - G（循環）
- 樂器：合成鋼琴 + 輕鼓

#### 遊戲中音樂
- 風格：緊張但不失趣味
- BPM：135
- 和弦進行：Cm - Ab - Eb - Bb（小調）
- 樂器：合成弦樂 + 節拍

#### 波次 BOSS 音樂（第 10 波自動切換）
- 風格：緊迫警戒
- BPM：160
- 和弦進行：Dm - Am - Bb - Gm
- 樂器：失真吉他音色 + 重鼓

### 10.4 音效合成範例程式碼

```javascript
// 氣球爆破音效
function playBalloonPop(audioCtx, gainNode) {
  const osc = audioCtx.createOscillator();
  const env = audioCtx.createGain();
  osc.connect(env);
  env.connect(gainNode);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.08);
  env.gain.setValueAtTime(0.5, audioCtx.currentTime);
  env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.08);
}
```

---

## 11. 行動裝置 UX 規範

### 11.1 觸控操作設計

| 操作 | 手勢 |
|------|------|
| 選擇塔 | 點擊底部塔卡片 |
| 放置塔 | 點擊地圖空格 |
| 取消放置 | 點擊路徑外空白處 / 返回 |
| 選取已放置塔 | 點擊塔圖示 |
| 升級 / 賣出 | 升級面板按鈕 |
| 發動波次 | 底部「發動波次」按鈕 |
| 加速 | HUD 頂部 2× 按鈕 |
| 暫停 | HUD 頂部⏸按鈕 |

### 11.2 觸控目標最小尺寸

- **所有可互動按鈕**：最小 **56×56px**
- **塔卡片**：最小 **80×90px**
- **HUD 按鈕**：最小 **48×48px**
- **地圖格子（放塔區）**：48px 以上

### 11.3 響應式佈局

```
桌機（> 768px）：
  Canvas 佔右側 70%，塔選購面板佔左側 30%（側邊欄）

平板（481–768px）：
  Canvas 全寬，底部展開塔選購列

手機（≤ 480px）：
  Canvas 縮放至螢幕寬度
  底部固定塔選購橫向捲動列
  HUD 字體放大 10%
```

### 11.4 行動裝置字體大小

```css
@media (max-width: 480px) {
  :root {
    --font-size-xs:  18px;  /* 從 16px 放大 */
    --font-size-sm:  22px;
    --font-size-md:  26px;
    --font-size-lg:  32px;
    --font-size-xl:  40px;
    --font-size-xxl: 48px;
  }
}
```

### 11.5 防誤觸機制

- 放置塔前需顯示**半透明預覽**，確認才放置
- 升級面板需**二次確認**（顯示費用後點擊確認）
- 賣出功能需**長按 0.8 秒**或**二次確認對話框**

---

## 12. 資料結構定義

### 12.1 GameState

```javascript
GameState = {
  // 基本狀態
  status: 'menu' | 'playing' | 'paused' | 'gameover' | 'win',
  lives: Number,
  gold: Number,
  score: Number,
  
  // 波次
  currentWave: Number,
  totalWaves: Number,
  waveInProgress: Boolean,
  
  // 地圖
  mapId: String,
  grid: Array2D,        // 每格狀態：'path' | 'empty' | 'tower'
  path: [{x, y}],       // 敵人路徑
  
  // 遊戲物件
  towers: Tower[],
  enemies: Enemy[],
  projectiles: Projectile[],
  
  // 設定
  speed: 1 | 2,
  
  // 統計
  totalKills: Number,
  totalGoldEarned: Number
}
```

### 12.2 StoredData（localStorage）

```javascript
SaveData = {
  version: '1.0.0',
  settings: {
    musicVolume: 0.6,
    sfxVolume: 0.8,
    language: 'zh-TW',
    iconSize: 'large'
  },
  progress: {
    unlockedMaps: ['map01'],
    highScores: { map01: 9850, map02: 0 },
    stars: { map01: 3, map02: 0 }
  }
}
```

---

## 13. 模組設計

### 13.1 模組職責

| 模組 | 職責 |
|------|------|
| `GameState.js` | 單一事實來源，所有狀態讀寫 |
| `Map.js` | 地圖載入、格子狀態、路徑計算 |
| `Tower.js` | 塔基底類別、攻擊邏輯、繪製 |
| `TowerTypes.js` | 各塔屬性、升級樹定義 |
| `Enemy.js` | 敵人基底類別、移動、狀態效果 |
| `EnemyTypes.js` | 各敵人屬性定義 |
| `Projectile.js` | 子彈追蹤、碰撞、視覺特效 |
| `WaveManager.js` | 波次排程、敵人生成計時器 |
| `UpgradeSystem.js` | 升級邏輯、費用計算、互斥檢查 |
| `AudioEngine.js` | Web Audio 初始化、音量控制 |
| `SoundEffects.js` | 各音效合成函式 |
| `MusicEngine.js` | 背景音樂生成、場景切換 |
| `HUD.js` | Canvas 外的 DOM 介面更新 |
| `Storage.js` | localStorage 讀寫封裝 |
| `EventBus.js` | 模組間事件通訊 |

### 13.2 事件清單（EventBus）

```
TOWER_PLACED        (tower)
TOWER_UPGRADED      (tower, path, level)
TOWER_SOLD          (tower)
ENEMY_SPAWNED       (enemy)
ENEMY_KILLED        (enemy)
ENEMY_PASSED        (enemy)
PROJECTILE_HIT      (projectile, enemy)
WAVE_STARTED        (waveNumber)
WAVE_COMPLETED      (waveNumber)
GOLD_CHANGED        (amount, total)
LIVES_CHANGED       (amount, total)
GAME_OVER           ()
GAME_WIN            ()
```

---

## 14. 存檔與設定

### 14.1 localStorage 鍵值

```
monkey-fortress-td:save     → 主存檔 JSON
monkey-fortress-td:settings → 設定 JSON
```

### 14.2 設定項目

| 項目 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| musicVolume | Number | 0.6 | 背景音樂音量 0~1 |
| sfxVolume | Number | 0.8 | 音效音量 0~1 |
| language | String | 'zh-TW' | 語言（zh-TW / en） |
| iconSize | String | 'large' | UI 圖示大小 |
| speed | Number | 1 | 預設速度倍率 |

---

## 15. 開發里程碑

### Phase 1 — 核心引擎（約 2 週）
- [ ] 遊戲主迴圈、Canvas 繪製
- [ ] 地圖系統與敵人路徑
- [ ] 基礎敵人移動
- [ ] 飛鏢猴放置與攻擊
- [ ] 金幣 / 生命 HUD

### Phase 2 — 完整遊戲機制（約 2 週）
- [ ] 全部 6 種塔
- [ ] 全部 7 種敵人
- [ ] 升級系統
- [ ] 10 波波次設計
- [ ] 遊戲勝負判定

### Phase 3 — 音效與 UI（約 1 週）
- [ ] Web Audio API 音效合成
- [ ] 背景音樂生成器
- [ ] 設定面板（音量滑桿）
- [ ] 主選單、地圖選擇、結算畫面

### Phase 4 — 行動裝置與優化（約 1 週）
- [ ] 響應式佈局
- [ ] 觸控操作優化
- [ ] 效能優化（物件池）
- [ ] localStorage 存檔
- [ ] 跨瀏覽器測試

---

## 附錄：Canvas 繪製約定

### 塔繪製

```javascript
// 所有塔在 Canvas 上以圓形 + emoji 繪製
ctx.beginPath();
ctx.arc(x, y, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
ctx.fillStyle = tower.color;
ctx.fill();
ctx.font = `${TILE_SIZE * 0.6}px serif`;
ctx.fillText(tower.emoji, x - 12, y + 10);
// 升級指示點
drawUpgradeDots(ctx, tower, x, y);
// 射程圈（選中時顯示）
if (tower.selected) drawRangeCircle(ctx, tower);
```

### 敵人繪製

```javascript
// 敵人以圓形 + 血條 + emoji 繪製
ctx.beginPath();
ctx.arc(x, y, ENEMY_RADIUS, 0, Math.PI * 2);
ctx.fillStyle = enemy.color;
ctx.fill();
// 血條
drawHealthBar(ctx, enemy, x, y);
// 狀態效果（冰凍/燃燒/中毒）
drawStatusEffect(ctx, enemy, x, y);
```

---

*規格書版本 v1.0.0 — MonkeyFortress TD*
