# 🗺️ MonkeyFortress TD — 地圖擴充與全局重設計規格書

**所屬專案：`monkey-fortress-td`**  
**版本：v1.3.0**  
**最後更新：2026-05-04**  
**本文件涵蓋：Map 11–20（新增 10 張）+ 全 20 張難度重排 + 波次/終局規則更新**

---

## 目錄

1. [全局設計變更說明](#1-全局設計變更說明)
2. [全 20 張地圖難度總覽](#2-全-20-張地圖難度總覽)
3. [解鎖機制更新：全地圖預設開放](#3-解鎖機制更新全地圖預設開放)
4. [波次數量重設計](#4-波次數量重設計)
5. [終局總攻波規格](#5-終局總攻波規格)
6. [Map 11 — 毒沼廢都](#6-map-11--毒沼廢都-toxic-wasteland)
7. [Map 12 — 水晶洞窟](#7-map-12--水晶洞窟-crystal-cavern)
8. [Map 13 — 颱風眼](#8-map-13--颱風眼-typhoon-eye)
9. [Map 14 — 聖域迴廊](#9-map-14--聖域迴廊-sacred-corridor)
10. [Map 15 — 混沌裂縫](#10-map-15--混沌裂縫-chaos-rift)
11. [Map 16 — 深淵巢穴](#11-map-16--深淵巢穴-abyss-nest)
12. [Map 17 — 時間迷宮](#12-map-17--時間迷宮-temporal-maze)
13. [Map 18 — 鏡中世界](#13-map-18--鏡中世界-mirror-world)
14. [Map 19 — 末日熔爐](#14-map-19--末日熔爐-doomsday-forge)
15. [Map 20 — 創世終點](#15-map-20--創世終點-genesis-end)
16. [全 20 張地圖波次對照表](#16-全-20-張地圖波次對照表)
17. [選圖畫面更新規格（20 張版）](#17-選圖畫面更新規格20-張版)

---

## 1. 全局設計變更說明

### 1.1 本版本三大核心改動

| 改動 | 說明 |
|------|------|
| **全地圖開放** | 取消通關解鎖限制，所有 20 張地圖從一開始就可自由選擇 |
| **波次數量提升** | 最少從 20 波起跳，往後每張地圖遞增，最高達 55 波 |
| **終局總攻波** | 每關最後一波統一設計為「終局總攻」，敵人數量大幅提升並依難度縮放 |

### 1.2 全地圖開放設計理由

```
過去：通關 Map N 才能玩 Map N+1（線性解鎖）
現在：全部 20 張地圖預設開放，玩家自由選擇

理由：
  ① 降低遊戲門檻，讓玩家依個人喜好選擇喜歡的主題地圖
  ② 高手可直接挑戰後期高難度地圖
  ③ 新手可跳過難度較高的地圖，選擇喜歡的視覺主題
  ④ 增加重玩誘因，不同地圖有截然不同的策略體驗
```

### 1.3 首次遊玩推薦引導

雖然地圖全開，但在選圖頁面加入「**推薦起點**」標記：

```
建議新手從這裡開始：
  ★ 推薦  🌿 叢林小徑（Map 01）
  ★ 推薦  🏜️ 沙漠蜿蜒（Map 02）
```

地圖卡片左上角顯示「★ 推薦」徽章，其餘地圖正常顯示難度等級。

---

## 2. 全 20 張地圖難度總覽

### 2.1 難度重排原則

原有 10 張地圖的難度排序保持相對關係，新增 10 張插入其中，整體形成平滑的難度曲線：

```
難度曲線示意：
Map01 ──── Map04 ──── Map08 ──── Map12 ──── Map16 ──── Map20
  ⭐         ⭐⭐⭐      ⭐⭐⭐⭐     ⭐⭐⭐⭐⭐    ☠️☠️       ☠️☠️☠️
（新手入門） （普通）   （困難）   （地獄）  （極限）  （終極）
```

### 2.2 完整 20 張地圖難度一覽

| # | 地圖名稱 | 主題 | 難度等級 | 難度星數 | 波次（標準）| 核心機制 |
|---|---------|------|---------|---------|-----------|---------|
| 01 | 🌿 叢林小徑 | 叢林 | 入門 | ⭐ | 20 | 單條 S 型路徑 |
| 02 | 🏜️ 沙漠蜿蜒 | 沙漠 | 初級 | ⭐⭐ | 22 | 雙路分叉 + 沙塵暴 |
| 03 | ☘️ 草原奔流 | 草原 | 初級+ | ⭐⭐ | 24 | 多重彎道（新）|
| 04 | 🏔️ 雪山要塞 | 雪山 | 普通 | ⭐⭐⭐ | 25 | 螺旋迴繞 |
| 05 | 🌊 深海遺跡 | 深海 | 普通 | ⭐⭐⭐ | 26 | 雙端對沖 |
| 06 | 🌋 熔岩迷宮 | 火山 | 普通+ | ⭐⭐⭐ | 28 | 三路並進 + 熔岩上漲 |
| 07 | 🏛️ 古城迷陣 | 古城 | 困難 | ⭐⭐⭐⭐ | 30 | 十字棋盤交叉 |
| 08 | ☁️ 天空浮島 | 天空 | 困難 | ⭐⭐⭐⭐ | 30 | 四浮島跳躍 + 隱形 |
| 09 | ⚙️ 機械要塞 | 機械 | 困難+ | ⭐⭐⭐⭐ | 32 | 動態路徑切換 |
| 10 | 🍄 毒沼廢都 | 毒沼 | 困難+ | ⭐⭐⭐⭐ | 32 | 毒氣蔓延 + 侵蝕路徑（新）|
| 11 | 💎 水晶洞窟 | 水晶 | 艱難 | ⭐⭐⭐⭐⭐ | 34 | 折射反彈子彈（新）|
| 12 | 🌀 颱風眼 | 風暴 | 艱難 | ⭐⭐⭐⭐⭐ | 35 | 動態旋轉路徑（新）|
| 13 | 🏺 聖域迴廊 | 聖域 | 艱難+ | ⭐⭐⭐⭐⭐ | 36 | 聖光護盾氣球（新）|
| 14 | ☠️ 混沌裂縫 | 混沌 | 地獄 | ☠️ | 38 | 隨機路徑裂縫（新）|
| 15 | 🕳️ 深淵巢穴 | 深淵 | 地獄 | ☠️ | 40 | 無限生成巢穴（新）|
| 16 | ⏳ 時間迷宮 | 時空 | 地獄+ | ☠️☠️ | 42 | 時間逆流（新）|
| 17 | 🪞 鏡中世界 | 鏡像 | 極限 | ☠️☠️ | 45 | 全塔效果鏡像反轉（新）|
| 18 | 🌑 暗黑森林 | 暗黑 | 極限 | ☠️☠️ | 46 | 迷霧 + 暗影敵人 |
| 19 | 🔥 末日熔爐 | 末日 | 極限+ | ☠️☠️☠️ | 50 | 地圖燃燒 + 全敵人強化（新）|
| 20 | 🌌 創世終點 | 宇宙 | 終極 | ☠️☠️☠️ | 55 | 全機制集大成 + 三階段宇宙 BOSS |

### 2.3 難度等級定義（重新定義）

| 等級 | 標記 | 定位 | 敵人血量係數 | 初始資源 |
|------|------|------|------------|---------|
| 入門 | ⭐ | 新手教學 | × 0.8 | 最充裕 |
| 初級 | ⭐⭐ | 熟悉機制 | × 0.9 | 充裕 |
| 初級+ | ⭐⭐ | 過渡 | × 1.0 | 正常 |
| 普通 | ⭐⭐⭐ | 標準挑戰 | × 1.1 | 正常 |
| 普通+ | ⭐⭐⭐ | 過渡 | × 1.2 | 略緊 |
| 困難 | ⭐⭐⭐⭐ | 高手挑戰 | × 1.4 | 緊 |
| 困難+ | ⭐⭐⭐⭐ | 過渡 | × 1.5 | 很緊 |
| 艱難 | ⭐⭐⭐⭐⭐ | 極度挑戰 | × 1.7 | 非常緊 |
| 艱難+ | ⭐⭐⭐⭐⭐ | 過渡 | × 1.9 | 極緊 |
| 地獄 | ☠️ | 生存挑戰 | × 2.2 | 匱乏 |
| 地獄+ | ☠️ | 過渡 | × 2.5 | 非常匱乏 |
| 極限 | ☠️☠️ | 頂尖玩家 | × 3.0 | 極度匱乏 |
| 極限+ | ☠️☠️☠️ | 準終極 | × 3.5 | 幾乎沒有 |
| 終極 | ☠️☠️☠️ | 最終挑戰 | × 4.0 | 僅基礎 |

---

## 3. 解鎖機制更新：全地圖預設開放

### 3.1 新解鎖邏輯

```javascript
// v1.3 新規則：所有地圖預設開放，無需通關解鎖
const UNLOCK_CONDITIONS = {
  map01:  { type: 'default', unlocked: true },
  map02:  { type: 'default', unlocked: true },
  map03:  { type: 'default', unlocked: true },
  // ... 以此類推
  map20:  { type: 'default', unlocked: true }
};

function isMapUnlocked(mapId) {
  return true;   // 永遠回傳 true，所有地圖可選
}
```

### 3.2 地圖卡片狀態更新

移除「🔒 未解鎖」狀態，改為三種狀態：

| 狀態 | 顯示方式 |
|------|---------|
| 未遊玩 | 彩色縮圖 + 白框 + 「NEW」角標 |
| 已遊玩 | 彩色縮圖 + 顏色框 + 星星 |
| 選中 | 彩色縮圖 + 金色粗框 + 放大 |

### 3.3 首次推薦提示

玩家首次開啟選圖頁時，彈出引導提示：

```
┌──────────────────────────────────────────┐
│  🎮 歡迎來到 MonkeyFortress TD！         │
│                                          │
│  所有 20 張地圖現在都可以自由選擇！      │
│                                          │
│  如果是第一次玩，建議從這裡開始：        │
│  🌿 叢林小徑  ─  路徑簡單，節奏舒緩    │
│                                          │
│  想要挑戰嗎？直接選你喜歡的地圖就好！   │
│                                          │
│  [ 好的，出發！ ]                        │
└──────────────────────────────────────────┘
```

---

## 4. 波次數量重設計

### 4.1 波次遞增規則

```
Map 01：20 波（基準）
Map 02：22 波（+2）
Map 03：24 波（+2）
Map 04：25 波（+1）
Map 05：26 波（+1）
Map 06：28 波（+2）
Map 07：30 波（+2）
Map 08：30 波（持平）
Map 09：32 波（+2）
Map 10：32 波（持平）
Map 11：34 波（+2）
Map 12：35 波（+1）
Map 13：36 波（+1）
Map 14：38 波（+2）
Map 15：40 波（+2）
Map 16：42 波（+2）
Map 17：45 波（+3）
Map 18：46 波（+1）
Map 19：50 波（+4）
Map 20：55 波（+5，終極挑戰）
```

### 4.2 波次長度與難度模式換算

依「關卡長度」設定，標準波次數乘以對應係數：

| 長度模式 | 係數 | Map01 例 | Map20 例 |
|---------|------|---------|---------|
| ⚡ 速戰速決 | × 0.6 | 12 波 | 33 波 |
| ⚖️ 標準 | × 1.0 | 20 波 | 55 波 |
| 🏰 史詩長征 | × 1.8 | 36 波 | 99 波 |

> 史詩長征模式下 Map 20 最多可達 **99 波**，是全遊戲最長挑戰。

### 4.3 敵人密度遞增規則（波次內）

每張地圖各波次的敵人數量依下列公式動態生成：

```javascript
function calcEnemyCountForWave(waveIndex, totalWaves, mapDifficulty) {
  const progress     = waveIndex / totalWaves;          // 0.0 ~ 1.0
  const baseCount    = 8 + Math.floor(progress * 20);   // 8 → 28 線性遞增
  const diffBonus    = MAP_DIFFICULTY_BONUS[mapDifficulty]; // 地圖固有加成

  // 最後一波（終局總攻）單獨處理，此函式不適用
  if (waveIndex === totalWaves - 1) return 'FINAL_WAVE';

  return Math.ceil(baseCount * diffBonus);
}

const MAP_DIFFICULTY_BONUS = {
  'entry':    0.8,
  'beginner': 0.9,
  'normal':   1.0,
  'hard':     1.2,
  'expert':   1.5,
  'hell':     1.8,
  'extreme':  2.2,
  'ultimate': 2.8
};
```

---

## 5. 終局總攻波規格

### 5.1 設計理念

每關最後一波為「**終局總攻（Final Assault Wave）**」，特點如下：

- 敵人數量為該關普通波次平均的 **3 倍**
- 包含該關出現過的**所有敵人種類**
- 強制出現 1~3 個 BOSS（依地圖難度）
- 有專屬的視覺效果與音樂切換
- 敵人出現間隔縮短 40%（密集衝鋒感）

### 5.2 終局總攻規模公式

```javascript
function buildFinalAssaultWave(map, difficulty, length) {
  const D    = DIFFICULTY_MULTIPLIERS[difficulty];
  const base = map.avgEnemyCount;    // 該地圖普通波次平均敵人數

  return {
    isFinalWave:    true,
    enemyCount:     Math.ceil(base * 3.0 * D.enemyCountMulti),
    bossCount:      MAP_FINAL_BOSS_COUNT[map.id],
    spawnInterval:  map.baseSpawnInterval * 0.6,  // 縮短 40%
    enemyPool:      map.allEnemyTypes,   // 該地圖所有曾出現的敵人種類
    music:          'final_assault_theme',
    visualEffect:   'red_sky_overlay'    // 畫面紅色濾鏡
  };
}
```

### 5.3 各難度終局總攻規模係數

| 遊戲難度（選擇）| 終局敵人數量係數 | BOSS 增加 |
|---------------|--------------|---------|
| 🌱 簡單 | × 1.5 | 不額外增加 |
| ⚔️ 普通 | × 2.0 | +0（維持地圖預設）|
| 💀 困難 | × 2.8 | +1 BOSS |
| 👹 地獄 | × 4.0 | +2 BOSS + 護衛 |

### 5.4 各地圖終局總攻預設 BOSS 數

| Map | 終局 BOSS 數（普通難度）| BOSS 種類 |
|-----|---------------------|---------|
| 01–05 | 1 | 基礎 BOSS |
| 06–10 | 1 | 強化 BOSS |
| 11–15 | 2 | 強化 BOSS × 2 |
| 16–18 | 2 | 地獄 BOSS + 強化 BOSS |
| 19 | 3 | 地獄 BOSS × 2 + 超級 BOSS |
| 20 | 3（三階段）| 宇宙終焉（三階段）|

### 5.5 終局總攻視覺效果

```javascript
FinalAssaultVisual = {
  // 倒計時提示（進入最後一波前 10 秒）
  countdown: {
    text:     '⚠️  終局總攻即將開始！',
    duration: 10,
    animation: 'pulse_red',
    sound:    'final_warning_sound'
  },
  // 波次開始瞬間
  onset: {
    screenFlash:  'red',          // 畫面快速閃紅
    skyColor:     '#8B0000',      // 天空轉為暗紅
    bgMusicSwitch: 'final_assault_bgm',
    text:          '💀  終局總攻！',
    textDuration:  3
  },
  // 全程效果
  ongoing: {
    vignetteColor: 'rgba(180,0,0,0.15)',   // 畫面四角紅暈
    enemySpawnParticle: 'red_smoke'         // 敵人出現時帶紅煙特效
  }
}
```

### 5.6 終局總攻 HUD 顯示

```
┌──────────────────────────────────────────────────────┐
│  ❤️ 15   💰 340   ⚠️  終局總攻！  敵人剩餘：47 / 85 │
└──────────────────────────────────────────────────────┘
```

最後一波期間，波次顯示替換為「終局總攻」文字 + 剩餘敵人計數。

---

## 6. Map 11 — 毒沼廢都 (Toxic Wasteland)

### 6.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map10`（原序號調整）|
| 難度等級 | 困難+（⭐⭐⭐⭐）|
| 網格 | 20 × 15 |
| 路徑數 | 2（主路 + 隨時間侵蝕的輔路）|
| 初始金幣 | 115 |
| 初始生命 | 12 |
| 波次（標準）| 32 |
| 音樂主題 | `toxic_theme` |

### 6.2 地圖說明

工業廢棄都市，毒氣瀰漫的沼澤地帶。核心機制為**毒沼侵蝕**：地圖上有若干「毒沼格（P）」，每隔固定回合向外侵蝕相鄰的空地格，使可放塔區域越來越少。玩家需在侵蝕前搶佔關鍵位置。

### 6.3 路徑示意圖（20 × 15）

```
列\欄  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  0   .  .  .  .  .  .  P  P  .  .  .  .  P  P  .  .  .  .  .  .
  1   S1 >  >  >  v  .  P  P  .  .  .  .  P  P  .  .  .  .  .  .
  2   .  .  .  .  v  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
  3   .  .  P  P  v  .  .  .  .  .  .  .  .  .  P  P  .  .  .  .
  4   .  .  P  P  >  >  >  >  >  >  >  >  v  .  P  P  .  .  .  .
  5   .  .  .  .  .  .  .  .  .  .  .  .  v  .  .  .  .  .  .  .
  6   .  .  .  .  .  .  P  P  .  .  P  P  v  .  .  .  .  .  .  .
  7   S2 >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  E
  8   .  .  .  .  .  .  P  P  .  .  P  P  ^  .  .  .  .  .  .  .
  9   .  .  .  .  .  .  .  .  .  .  .  .  ^  .  .  .  .  .  .  .
 10   .  .  P  P  >  >  >  >  >  >  >  >  ^  .  P  P  .  .  .  .
 11   .  .  P  P  ^  .  .  .  .  .  .  .  .  .  P  P  .  .  .  .
 12   .  .  .  .  ^  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
 13   S3 >  >  >  ^  .  P  P  .  .  .  .  P  P  .  .  .  .  .  .
 14   .  .  .  .  .  .  P  P  .  .  .  .  P  P  .  .  .  .  .  .

（P = 毒沼格，初始存在；侵蝕後相鄰空地也變為 P 格）
```

### 6.4 毒沼侵蝕機制

```javascript
class ToxicSpreadSystem {
  constructor(grid) {
    this.grid          = grid;
    this.spreadInterval = 4;    // 每 4 波擴散一次
    this.spreadRadius   = 1;    // 每次向外 1 格
  }

  onWaveComplete(waveNumber) {
    if (waveNumber % this.spreadInterval === 0) {
      this.spread();
    }
  }

  spread() {
    const newPoison = [];
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === 'P') {
          // 四個相鄰格若為空地，變為毒沼
          [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dy]) => {
            const nx = x + dx, ny = y + dy;
            if (this.grid[ny]?.[nx]?.type === '.') {
              newPoison.push({ x: nx, y: ny });
            }
          });
        }
      });
    });
    newPoison.forEach(({ x, y }) => {
      // 若格上有塔，塔受到毒素傷害（攻速 -30%，持續直到毒沼消失）
      if (this.grid[y][x].tower) {
        this.grid[y][x].tower.applyToxic();
      }
      this.grid[y][x].type = 'P';
    });
    EventBus.emit('TOXIC_SPREAD', { newCells: newPoison });
  }
}
```

### 6.5 主題配色

```javascript
{
  bgColor:       '#1A2A0A',   // 暗毒綠
  pathColor:     '#3A4A2A',   // 廢棄路面
  emptyColor:    '#2A3A1A',   // 廢土地
  obstacleColor: '#4AFF4A',   // 毒沼螢光綠（P格）
  accentColor:   '#80FF00',
  uiTint:        '#558B2F'
}
```

---

## 7. Map 12 — 水晶洞窟 (Crystal Cavern)

### 7.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map11` |
| 難度等級 | 艱難（⭐⭐⭐⭐⭐）|
| 網格 | 20 × 16 |
| 路徑數 | 2 |
| 初始金幣 | 110 |
| 初始生命 | 10 |
| 波次（標準）| 34 |
| 音樂主題 | `crystal_theme` |

### 7.2 地圖說明

地下水晶洞窟，核心機制為**子彈折射**：地圖中散佈「水晶格（K）」，飛鏢系子彈（飛鏢猴、鈴鐺猴）碰到水晶格後會以入射角反射，有機會打到原本射不到的敵人，但也可能反射至空處浪費。爆炸類子彈不折射，直接引爆。

### 7.3 子彈折射邏輯

```javascript
function handleCrystalReflect(projectile, crystalCell) {
  if (!['dart', 'sonic'].includes(projectile.attackType)) return;

  // 計算反射方向（入射角 = 反射角）
  const reflectAngle = calcReflectAngle(
    projectile.direction,
    crystalCell.normal   // 水晶面法向量
  );

  projectile.direction  = reflectAngle;
  projectile.bounces    = (projectile.bounces || 0) + 1;
  projectile.damage    *= 0.8;   // 每次反射傷害 -20%

  // 最多反射 3 次
  if (projectile.bounces >= 3) {
    projectile.destroy();
  }
}
```

### 7.4 主題配色

```javascript
{
  bgColor:       '#0D0D2B',
  pathColor:     '#2A2A5A',
  emptyColor:    '#1A1A3A',
  obstacleColor: '#88EEFF',   // 水晶淺藍（K格），半透明發光
  accentColor:   '#00FFFF',
  uiTint:        '#1565C0'
}
```

---

## 8. Map 13 — 颱風眼 (Typhoon Eye)

### 8.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map12` |
| 難度等級 | 艱難（⭐⭐⭐⭐⭐）|
| 網格 | 22 × 18 |
| 路徑數 | 3（旋轉式）|
| 初始金幣 | 105 |
| 初始生命 | 10 |
| 波次（標準）| 35 |
| 音樂主題 | `storm_theme` |

### 8.2 地圖說明

颱風眼主題，地圖中央為「靜止眼」（可放塔的安全區），外圍路徑呈**順時針螺旋**，每 4 波整個路徑**旋轉 90 度**。路徑旋轉後，塔的位置不變，但塔的相對射程方向改變，原本守住的通道可能失去覆蓋。

### 8.3 路徑旋轉機制

```javascript
class RotatingPathSystem {
  constructor(paths) {
    this.paths          = paths;         // 原始路徑集合
    this.currentAngle   = 0;             // 目前旋轉角（0/90/180/270）
    this.rotateInterval = 4;
    this.center         = { x: 11, y: 9 };  // 旋轉中心（地圖中央）
  }

  onWaveComplete(waveNumber) {
    if (waveNumber % this.rotateInterval === 0) {
      this.rotate90();
    }
  }

  rotate90() {
    this.currentAngle = (this.currentAngle + 90) % 360;
    // 重新計算所有路徑 waypoint 座標
    this.paths.forEach(path => {
      path.waypoints = path.waypoints.map(wp =>
        rotatePoint(wp, this.center, 90)
      );
    });
    // 視覺動畫：路徑格緩慢旋轉（1.5s CSS 過渡）
    EventBus.emit('PATH_ROTATED', { angle: this.currentAngle });
  }
}
```

### 8.4 主題配色

```javascript
{
  bgColor:       '#0A1520',
  pathColor:     '#2A4060',
  emptyColor:    '#152030',
  obstacleColor: '#80D0FF',   // 風暴牆（邊緣格）
  accentColor:   '#00B0FF',
  uiTint:        '#0288D1'
}
```

---

## 9. Map 14 — 聖域迴廊 (Sacred Corridor)

### 9.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map13` |
| 難度等級 | 艱難+（⭐⭐⭐⭐⭐）|
| 網格 | 22 × 16 |
| 路徑數 | 4（聖光迴廊型）|
| 初始金幣 | 100 |
| 初始生命 | 10 |
| 波次（標準）| 36 |
| 音樂主題 | `sacred_theme` |

### 9.2 地圖說明

古老聖域，核心機制為**聖光護盾**：部分氣球在進入地圖後攜帶「聖光護盾」，護盾使敵人免疫所有傷害直到護盾破除。護盾必須由**特定塔**（鈴鐺猴音波、電擊猴電弧）先擊破，再由其他塔補刀。

聖光護盾氣球在護盾存在時外觀發出白金光暈，難以從外觀分辨種類，增加辨識難度。

### 9.3 聖光護盾機制

```javascript
class HolyShield {
  constructor(hp) {
    this.hp        = hp;          // 護盾血量（依氣球等級）
    this.active    = true;
    this.breakable = ['sonic', 'thunder'];   // 只有音波/電擊可破盾
  }

  takeDamage(amount, attackType) {
    if (!this.active) return;
    if (!this.breakable.includes(attackType)) return;  // 其他攻擊無效
    this.hp -= amount;
    if (this.hp <= 0) this.break();
  }

  break() {
    this.active = false;
    EventBus.emit('SHIELD_BROKEN');
    // 視覺：白金光暈消散特效（爆裂粒子）
    // 音效：清脆破盾音
  }
}

// 護盾存在時，所有非指定攻擊皆傳回 0 傷害
function applyDamageToEnemy(enemy, damage, attackType) {
  if (enemy.shield?.active) {
    enemy.shield.takeDamage(damage, attackType);
    return 0;   // 護盾擋掉，本體不受傷
  }
  return calcDamage({ damage, attackType }, enemy);
}
```

### 9.4 主題配色

```javascript
{
  bgColor:       '#1A1020',
  pathColor:     '#5A4A7A',
  emptyColor:    '#2A1A3A',
  obstacleColor: '#FFD700',   // 聖柱金（裝飾格）
  accentColor:   '#FFFFFF',
  uiTint:        '#7B1FA2'
}
```

---

## 10. Map 15 — 混沌裂縫 (Chaos Rift)

### 10.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map14` |
| 難度等級 | 地獄（☠️）|
| 網格 | 22 × 18 |
| 路徑數 | **每波隨機 2–5 條** |
| 初始金幣 | 130（補償隨機不確定性）|
| 初始生命 | 8 |
| 波次（標準）| 38 |
| 音樂主題 | `chaos_theme` |

### 10.2 地圖說明

混沌次元，核心機制為**隨機路徑**：每波開始前，地圖上的路徑**重新隨機生成**，確保每波路徑都不同，玩家永遠無法提前針對固定路線佈防。

隨機路徑在波次預覽時提前 5 秒顯示，讓玩家有短暫反應時間。

### 10.3 隨機路徑生成邏輯

```javascript
class ChaosPathGenerator {
  constructor(grid) {
    this.grid      = grid;
    this.entries   = [{ x:0,y:4 }, { x:0,y:9 }, { x:0,y:14 }];  // 左側固定入口
    this.exits     = [{ x:21,y:9 }];  // 右側固定出口（唯一）
    this.minLength = 15;
    this.maxLength = 35;
  }

  generateForWave(waveNumber) {
    // 固定 seed 確保每次遊玩同局同波次路徑一致（可重現）
    const seed  = waveNumber * 1337 + GameState.sessionSeed;
    const rng   = seededRandom(seed);
    const count = 2 + Math.floor(rng() * 4);    // 隨機 2–5 條路徑

    const paths = [];
    for (let i = 0; i < count; i++) {
      const entry = this.entries[i % this.entries.length];
      paths.push(this.generatePath(entry, this.exits[0], rng));
    }
    return paths;
  }

  generatePath(start, end, rng) {
    // A* 隨機化路徑（加入隨機偏移使路徑蜿蜒）
    return randomizedAStar(start, end, this.grid, rng);
  }
}
```

### 10.4 主題配色

```javascript
{
  bgColor:       '#0D0015',
  pathColor:     '#4A00AA',
  emptyColor:    '#1A0030',
  obstacleColor: '#FF00FF',   // 混沌裂縫（紫色閃爍）
  accentColor:   '#FF40FF',
  uiTint:        '#6A00AA'
}
```

---

## 11. Map 16 — 深淵巢穴 (Abyss Nest)

### 11.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map15` |
| 難度等級 | 地獄（☠️）|
| 網格 | 22 × 18 |
| 路徑數 | 3（固定）+ 無限巢穴生成 |
| 初始金幣 | 120 |
| 初始生命 | 8 |
| 波次（標準）| 40 |
| 音樂主題 | `abyss_theme` |

### 11.2 地圖說明

深淵巢穴，核心機制為**巢穴系統**：地圖上有 3 個「巢穴格（N）」，每個巢穴每 15 秒**自動生成一波小氣球**（不算入波次計數），類似持續騷擾。

玩家可以「封印」巢穴（需花費 80 金幣 + 一座塔永久駐守），封印後該巢穴停止生成，但佔用一個塔位。若不封印，巢穴越到後期生成的氣球越強。

### 11.3 巢穴機制

```javascript
class NestSystem {
  constructor(nests) {
    this.nests = nests.map(n => ({
      ...n,
      sealed:       false,
      timer:        0,
      spawnInterval: 15,
      level:        1      // 巢穴等級，每 10 波 +1，最高 5
    }));
  }

  update(dt, waveNumber) {
    this.nests.forEach(nest => {
      if (nest.sealed) return;
      nest.timer += dt;
      if (nest.timer >= nest.spawnInterval) {
        nest.timer = 0;
        this.spawnFromNest(nest, waveNumber);
      }
    });
  }

  spawnFromNest(nest, waveNumber) {
    const count = 3 + nest.level * 2;
    const type  = NEST_ENEMY_BY_LEVEL[nest.level];
    // 從巢穴格出現，走最近的主路徑
    spawnEnemies(count, type, nest.position);
  }

  sealNest(nestId, towerSlot) {
    const nest = this.nests.find(n => n.id === nestId);
    if (!nest || nest.sealed) return false;
    if (GameState.gold < 80) return false;
    GameState.gold -= 80;
    nest.sealed   = true;
    nest.guardian = towerSlot;   // 永久駐守的塔
    return true;
  }
}
```

### 11.4 主題配色

```javascript
{
  bgColor:       '#050505',
  pathColor:     '#1A0A0A',
  emptyColor:    '#0A0505',
  obstacleColor: '#8B0000',   // 巢穴深紅（N格）+ 脈動動畫
  accentColor:   '#FF3333',
  uiTint:        '#B71C1C'
}
```

---

## 12. Map 17 — 時間迷宮 (Temporal Maze)

### 12.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map16` |
| 難度等級 | 地獄+（☠️☠️）|
| 網格 | 24 × 18 |
| 路徑數 | 3 |
| 初始金幣 | 110 |
| 初始生命 | 8 |
| 波次（標準）| 42 |
| 音樂主題 | `temporal_theme` |

### 12.2 地圖說明

時間扭曲迷宮，核心機制為**時間逆流**：每隔 6 波，觸發一次「時間逆流」事件，場上所有氣球**瞬間倒退** 5 格（往入口方向移動），玩家多了一次補傷機會，但也意味著已快到終點的氣球獲得更多存活時間。

另有「時間加速帶格（TA）」，氣球經過時速度短暫 ×3，持續 2 秒。

### 12.3 時間逆流機制

```javascript
function triggerTimeReverse(enemies) {
  // 所有敵人沿路徑往回退 5 格距離
  enemies.forEach(enemy => {
    enemy.pathProgress = Math.max(0, enemy.pathProgress - 5);
    // 視覺：時間倒流粒子特效（藍紫色逆向粒子流）
    playTimeReverseEffect(enemy.x, enemy.y);
  });
  // 全畫面短暫藍色閃光（0.3s）
  screenFlash('#6600FF', 300);
  EventBus.emit('TIME_REVERSED');
}
```

### 12.4 主題配色

```javascript
{
  bgColor:       '#080820',
  pathColor:     '#202060',
  emptyColor:    '#101040',
  obstacleColor: '#8080FF',   // 時間加速帶（TA格）
  accentColor:   '#4444FF',
  uiTint:        '#1A237E'
}
```

---

## 13. Map 18 — 鏡中世界 (Mirror World)

### 13.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map17` |
| 難度等級 | 極限（☠️☠️）|
| 網格 | 24 × 20 |
| 路徑數 | 4 |
| 初始金幣 | 100 |
| 初始生命 | 6 |
| 波次（標準）| 45 |
| 音樂主題 | `mirror_theme` |

### 13.2 地圖說明

鏡中世界，核心機制為**塔效果反轉**：地圖左半部（x ≤ 11）為「鏡像區域」，在此放置的塔，其特定效果會被**反轉**：

| 原效果 | 鏡像區域內反轉效果 |
|--------|-----------------|
| 減速 | 加速（幫助敵人！）|
| 傷害 | 正常（不反轉）|
| 中毒 | 每秒回血（幫助敵人！）|
| 冰凍 | 無效 |
| 範圍攻擊 | 縮小為單體 |

玩家必須謹慎選擇在鏡像區域放什麼塔，避免反效果幫助敵人。

### 13.3 鏡像效果邏輯

```javascript
function applyTowerEffect(effect, targetEnemy, towerPosition) {
  const inMirrorZone = towerPosition.x <= 11;

  if (!inMirrorZone) {
    return applyNormalEffect(effect, targetEnemy);
  }

  // 鏡像區域：部分效果反轉
  switch (effect.type) {
    case 'slow':
      // 反轉為加速
      targetEnemy.speed *= (2 - effect.multiplier);
      break;
    case 'poison':
      // 反轉為回血
      targetEnemy.hp = Math.min(targetEnemy.maxHp,
        targetEnemy.hp + effect.dps);
      break;
    case 'freeze':
      // 無效
      break;
    case 'aoe':
      // 縮為單體
      applyNormalEffect({ ...effect, type: 'single' }, targetEnemy);
      break;
    default:
      applyNormalEffect(effect, targetEnemy);
  }
}
```

### 13.4 主題配色

```javascript
{
  bgColor:       '#101025',
  pathColor:     '#303060',
  emptyColor:    '#181840',
  mirrorZoneBg:  '#25254A',   // 鏡像區域略深（視覺區分）
  mirrorBorder:  '#8888FF',   // 鏡像分界線
  accentColor:   '#AAAAFF',
  uiTint:        '#3949AB'
}
```

---

## 14. Map 19 — 末日熔爐 (Doomsday Forge)

### 14.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map18` |
| 難度等級 | 極限+（☠️☠️☠️）|
| 網格 | 26 × 20 |
| 路徑數 | 5 |
| 初始金幣 | 95 |
| 初始生命 | 5 |
| 波次（標準）| 50 |
| 音樂主題 | `doomsday_theme` |

### 14.2 地圖說明

末日鋼鐵熔爐，核心機制為**地圖燃燒**：從第 10 波起，地圖開始以固定速度「燃燒」，空地格逐漸轉為熔岩格（無法放新塔）。每 3 波有一格空地轉為熔岩，且燃燒速度隨波次加快（後期每波有 2 格轉換）。

同時，所有敵人在本關獲得「末日強化」：血量 +50%、速度 +20%，且對爆炸傷害有 20% 抗性，迫使玩家多元化防線。

### 14.3 地圖燃燒機制

```javascript
class BurningMapSystem {
  constructor(grid) {
    this.grid       = grid;
    this.burnRate   = 1;          // 每觸發一次燃燒 1 格
    this.burnTimer  = 3;          // 初始每 3 波燃燒一次
    this.startWave  = 10;         // 第 10 波後才開始
  }

  onWaveComplete(waveNumber) {
    if (waveNumber < this.startWave) return;

    // 後期加快：25 波後每 2 波燃燒，40 波後每波燃燒 2 格
    if (waveNumber >= 40) { this.burnRate = 2; this.burnTimer = 1; }
    else if (waveNumber >= 25) { this.burnTimer = 2; }

    if ((waveNumber - this.startWave) % this.burnTimer === 0) {
      this.burnRandomCells(this.burnRate);
    }
  }

  burnRandomCells(count) {
    const candidates = this.grid
      .flat()
      .filter(c => c.type === '.' && !c.tower);

    for (let i = 0; i < count && candidates.length; i++) {
      const idx  = Math.floor(Math.random() * candidates.length);
      const cell = candidates.splice(idx, 1)[0];
      cell.type  = 'L';    // 變為熔岩格
      EventBus.emit('CELL_BURNED', { x: cell.x, y: cell.y });
    }
  }
}
```

### 14.4 主題配色

```javascript
{
  bgColor:       '#0A0500',
  pathColor:     '#3A2010',
  emptyColor:    '#201008',
  obstacleColor: '#FF4500',   // 熔岩格
  burnOverlay:   'rgba(255,80,0,0.25)',  // 全畫面燃燒暈染
  accentColor:   '#FF6600',
  uiTint:        '#BF360C'
}
```

---

## 15. Map 20 — 創世終點 (Genesis End)

### 15.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map19` |
| 難度等級 | 終極（☠️☠️☠️）|
| 網格 | 28 × 22 |
| 路徑數 | 7 |
| 初始金幣 | 200（補償性）|
| 初始生命 | 5 |
| 波次（標準）| 55 |
| 音樂主題 | `genesis_theme`（史詩終局原創配樂）|

### 15.2 地圖說明

宇宙創世終點，全遊戲最終關。集合所有 19 張地圖出現過的機制，並在此基礎上加入「**創世循環**」——每完成 10 波，全局重置一次強度（敵人血量 × 1.2、速度 × 1.1 永久累加），使後期壓力以指數級增長。

### 15.3 融合機制列表（全 20 個機制）

| 波段 | 啟動機制 | 來源地圖 |
|------|---------|---------|
| 1–5 | 雙路分叉 | Map 02 |
| 1–5 | 毒沼侵蝕 | Map 10 |
| 6–10 | 螺旋路徑 | Map 04 |
| 6–10 | 子彈折射水晶格 | Map 11 |
| 11–15 | 路徑旋轉 | Map 12 |
| 11–15 | 聖光護盾氣球 | Map 13 |
| 16–20 | 混沌隨機路徑 | Map 14 |
| 16–20 | 巢穴持續生成 | Map 15 |
| 21–25 | 時間逆流 | Map 16 |
| 21–25 | 鏡像區域反轉 | Map 17 |
| 26–30 | 迷霧視野 | Map 18 |
| 26–30 | 地圖燃燒 | Map 19 |
| 31–40 | 熔岩上漲 | Map 06 |
| 31–40 | 動態路徑切換 | Map 09 |
| 41–50 | 三路並進 | Map 06 |
| 41–50 | 電磁脈衝 | Map 09 |
| 51–54 | 全機制同時開啟 | — |
| 55 | 終局總攻 + 宇宙終焉 BOSS | Map 20 |

### 15.4 創世循環機制

```javascript
class GenesisLoop {
  constructor() {
    this.cycleCount = 0;
    this.hpBonus    = 1.0;
    this.speedBonus = 1.0;
  }

  onCycleComplete() {   // 每 10 波觸發
    this.cycleCount++;
    this.hpBonus    *= 1.2;
    this.speedBonus *= 1.1;

    showCycleNotification(this.cycleCount);
    // 通知：「⚠️ 創世第 N 循環：敵人強化！」
  }

  applyToEnemy(enemy) {
    enemy.hp    = Math.ceil(enemy.hp    * this.hpBonus);
    enemy.speed = enemy.speed * this.speedBonus;
    return enemy;
  }
}
```

### 15.5 主題配色

```javascript
{
  bgColor:       '#02020F',
  pathColor:     '#15153A',
  emptyColor:    '#080820',
  obstacleColor: '#6600CC',   // 黑洞格（BH）
  accentColor:   '#CC44FF',
  starParticles: true,
  cosmicNebula:  true,        // 星雲粒子背景
  uiTint:        '#4A148C'
}
```

---

## 16. 全 20 張地圖波次對照表

### 16.1 標準模式波次數

| Map | 地圖名稱 | 難度 | 標準波次 | 終局 BOSS 數 | 終局敵人倍率 |
|-----|---------|------|---------|------------|------------|
| 01 | 🌿 叢林小徑 | ⭐ | 20 | 1 | × 2.5 |
| 02 | 🏜️ 沙漠蜿蜒 | ⭐⭐ | 22 | 1 | × 2.8 |
| 03 | ☘️ 草原奔流 | ⭐⭐ | 24 | 1 | × 3.0 |
| 04 | 🏔️ 雪山要塞 | ⭐⭐⭐ | 25 | 1 | × 3.0 |
| 05 | 🌊 深海遺跡 | ⭐⭐⭐ | 26 | 1 | × 3.2 |
| 06 | 🌋 熔岩迷宮 | ⭐⭐⭐ | 28 | 1 | × 3.2 |
| 07 | 🏛️ 古城迷陣 | ⭐⭐⭐⭐ | 30 | 2 | × 3.5 |
| 08 | ☁️ 天空浮島 | ⭐⭐⭐⭐ | 30 | 2 | × 3.5 |
| 09 | ⚙️ 機械要塞 | ⭐⭐⭐⭐ | 32 | 2 | × 3.8 |
| 10 | 🍄 毒沼廢都 | ⭐⭐⭐⭐ | 32 | 2 | × 3.8 |
| 11 | 💎 水晶洞窟 | ⭐⭐⭐⭐⭐ | 34 | 2 | × 4.0 |
| 12 | 🌀 颱風眼 | ⭐⭐⭐⭐⭐ | 35 | 2 | × 4.0 |
| 13 | 🏺 聖域迴廊 | ⭐⭐⭐⭐⭐ | 36 | 2 | × 4.2 |
| 14 | ☠️ 混沌裂縫 | ☠️ | 38 | 2 | × 4.5 |
| 15 | 🕳️ 深淵巢穴 | ☠️ | 40 | 2 | × 4.5 |
| 16 | ⏳ 時間迷宮 | ☠️☠️ | 42 | 3 | × 5.0 |
| 17 | 🪞 鏡中世界 | ☠️☠️ | 45 | 3 | × 5.0 |
| 18 | 🌑 暗黑森林 | ☠️☠️ | 46 | 3 | × 5.2 |
| 19 | 🔥 末日熔爐 | ☠️☠️☠️ | 50 | 3 | × 5.5 |
| 20 | 🌌 創世終點 | ☠️☠️☠️ | 55 | 3（三階段）| × 6.0 |

### 16.2 各長度模式波次數換算

| Map | 速戰（×0.6）| 標準（×1.0）| 史詩（×1.8）|
|-----|-----------|-----------|-----------|
| 01 | 12 | 20 | 36 |
| 05 | 16 | 26 | 47 |
| 10 | 20 | 32 | 58 |
| 15 | 24 | 40 | 72 |
| 20 | 33 | 55 | 99 |

---

## 17. 選圖畫面更新規格（20 張版）

### 17.1 地圖網格佈局（4 × 5）

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 🌿 Map01 │ 🏜️Map02 │ ☘️ Map03 │ 🏔️Map04 │ 🌊 Map05 │
│  ⭐       │  ⭐⭐     │  ⭐⭐     │  ⭐⭐⭐   │  ⭐⭐⭐   │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ 🌋 Map06 │ 🏛️Map07 │ ☁️ Map08 │ ⚙️ Map09 │ 🍄 Map10 │
│  ⭐⭐⭐   │ ⭐⭐⭐⭐  │ ⭐⭐⭐⭐  │ ⭐⭐⭐⭐  │ ⭐⭐⭐⭐  │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ 💎 Map11 │ 🌀 Map12 │ 🏺 Map13 │ ☠️ Map14 │ 🕳️ Map15 │
│ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐│ ⭐⭐⭐⭐⭐│  ☠️      │  ☠️      │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ ⏳ Map16 │ 🪞 Map17 │ 🌑 Map18 │ 🔥 Map19 │ 🌌 Map20 │
│  ☠️☠️    │  ☠️☠️    │  ☠️☠️    │ ☠️☠️☠️  │ ☠️☠️☠️  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**卡片規格：**
- 桌機：4 列 × 5 欄，卡片 140 × 110px，gap 10px
- 平板：4 列 × 5 欄，卡片 120 × 96px，gap 8px
- 手機：2 欄捲動，卡片 160 × 120px，gap 8px

### 17.2 篩選功能（新增）

20 張地圖過多時，提供篩選列：

```
  🔍 篩選：[全部] [⭐~⭐⭐⭐ 輕鬆] [⭐⭐⭐⭐ 挑戰] [☠️~ 極限]
```

點擊篩選標籤，只顯示對應難度範圍的地圖。

### 17.3 進度指示更新

```
  通關進度   8 / 20 張   ████████░░░░░░░░░░░░░░░░  40%
  最高分地圖  🌋 熔岩迷宮  9,850 分
  最愛地圖   ⭐ 收藏 3 張（可點星號收藏常玩地圖）
```

### 17.4 隨機選圖按鈕

新增「🎲 隨機地圖」按鈕，隨機選取一張地圖（可設定難度範圍過濾）：

```javascript
function pickRandomMap(difficultyFilter) {
  const available = ALL_MAPS.filter(m =>
    difficultyFilter === 'all' ||
    m.difficultyGroup === difficultyFilter
  );
  return available[Math.floor(Math.random() * available.length)];
}
```

---

## 附錄 A：Map 03 草原奔流補充規格

### A.1 基本資訊

| 項目 | 值 |
|------|----|
| ID | `map03_new` |
| 難度等級 | 初級+（⭐⭐）|
| 網格 | 18 × 13 |
| 路徑數 | 1（多重大彎道）|
| 初始金幣 | 140 |
| 初始生命 | 18 |
| 波次（標準）| 24 |
| 音樂主題 | `prairie_theme` |

### A.2 地圖說明

廣闊草原，路徑以**多重大彎道**橫越地圖，轉折點多但單條路徑，適合作為 Map01 叢林小徑的進階版——路徑更長，提供更多攻擊機會，但放塔位也因路徑增多而減少。

### A.3 主題配色

```javascript
{
  bgColor:       '#2E5A1E',
  pathColor:     '#A0784A',
  emptyColor:    '#4A8A3A',
  obstacleColor: '#1A4A10',
  accentColor:   '#90EE90',
  uiTint:        '#33691E'
}
```

---

## 附錄 B：全版本變更摘要（v1.2 → v1.3）

### B.1 新增內容

| 項目 | 說明 |
|------|------|
| 新地圖 ×10 | Map 11–20，涵蓋毒沼、水晶、颱風、聖域、混沌、深淵、時間、鏡像、末日、創世等主題 |
| 新機制 ×8 | 毒沼侵蝕、子彈折射、路徑旋轉、聖光護盾、隨機路徑、巢穴生成、時間逆流、鏡像反轉、地圖燃燒、創世循環 |
| 草原奔流（Map03）| 補充第 3 張過渡地圖 |

### B.2 系統變更

| 項目 | 舊規則 | 新規則 |
|------|--------|--------|
| 地圖解鎖 | 通關後才能玩下一張 | **全部 20 張預設開放** |
| 最少波次 | 10 波（Map01）| **20 波**（Map01），最高 55 波（Map20）|
| 終局設計 | 無統一終局規格 | **終局總攻波**：敵人 × 3 倍 + 紅天效果 + 專屬音樂 |
| 選圖佈局 | 2 × 5（10 張）| **4 × 5（20 張）** + 難度篩選 + 隨機選圖 |

---

*地圖擴充與全局重設計規格書 v1.3.0 — MonkeyFortress TD*  
*Map 11–20 新增，累計地圖總數：20 張*
