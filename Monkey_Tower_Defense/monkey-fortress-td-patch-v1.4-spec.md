# 🔧 MonkeyFortress TD — 功能新增與修正規格書

**所屬專案：`monkey-fortress-td`**  
**版本：v1.4.0**  
**最後更新：2026-05-04**  
**性質：功能新增 + Bug 修正 + 數值調整**

---

## 目錄

1. [新功能：自動接續下一波](#1-新功能自動接續下一波)
2. [Bug 修正：升級面板金幣狀態同步](#2-bug-修正升級面板金幣狀態同步)
3. [數值調整：密技金幣量](#3-數值調整密技金幣量)
4. [本版本變更摘要](#4-本版本變更摘要)

---

## 1. 新功能：自動接續下一波

### 1.1 功能說明

新增「**自動接續下一波**」開關，讓玩家選擇是否在當前波次結束後**自動立即觸發下一波**，不需手動點擊「發動波次」按鈕，也不等待倒數計時。

開關狀態可在**遊戲進行中隨時切換**，對當局有效，不影響下一局的預設值。

### 1.2 開關位置：HUD 頂部

```
┌──────────────────────────────────────────────────────────────┐
│  ❤️ 20   💰 150   🌊 波次 3/20                               │
│  [1×][2×][3×][4×][5×]  [⏸]  [⚡ 自動：ON ]                 │
└──────────────────────────────────────────────────────────────┘
```

- 按鈕標示：`⚡ 自動：ON` / `⚡ 自動：OFF`
- 位置：速度按鈕群右側，暫停按鈕旁邊
- 尺寸：寬 110px（桌機）/ 96px（手機），高 40px
- 字體：`font-size-xs`（16px）

### 1.3 按鈕樣式規格

```css
.auto-wave-button {
  min-width:    96px;
  height:       40px;
  font-size:    var(--font-size-xs);    /* 16px */
  font-weight:  bold;
  border-radius: var(--radius-sm);      /* 8px */
  cursor:       pointer;
  transition:   all 0.2s ease;
  border:       1px solid rgba(255,255,255,0.2);
}

/* 開啟狀態：綠色強調 */
.auto-wave-button.enabled {
  background:   #2E7D32;
  color:        #FFFFFF;
  border-color: #4CAF50;
  box-shadow:   0 0 8px rgba(76,175,80,0.5);
}

/* 關閉狀態：灰暗 */
.auto-wave-button.disabled {
  background:   rgba(255,255,255,0.08);
  color:        var(--color-text-sub);
  border-color: rgba(255,255,255,0.15);
}

/* 懸停 */
.auto-wave-button:hover {
  filter: brightness(1.15);
}
```

### 1.4 功能邏輯

```javascript
class AutoWaveSystem {
  constructor() {
    this.enabled    = false;    // 預設關閉
    this.delayMs    = 500;      // 波次結束後延遲 500ms 才自動觸發（避免體感太突兀）
    this.pendingTimer = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    updateAutoWaveButtonUI(this.enabled);

    // 若切換為開啟時，剛好有待觸發的波次，立即排程
    if (this.enabled && GameState.waveState === 'waiting') {
      this.scheduleNext();
    }

    // 若切換為關閉時，取消已排程的自動觸發
    if (!this.enabled && this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }

  // 當一波所有敵人清除後呼叫
  onWaveCleared() {
    if (!this.enabled) return;
    if (GameState.isLastWave()) return;   // 最後一波結束不自動觸發（進結算）

    this.scheduleNext();
  }

  scheduleNext() {
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null;
      if (this.enabled && GameState.waveState === 'waiting') {
        WaveManager.startNextWave();
      }
    }, this.delayMs);
  }

  // 暫停時取消排程；恢復時若仍開啟則重新排程
  onGamePaused()  {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }

  onGameResumed() {
    if (this.enabled && GameState.waveState === 'waiting') {
      this.scheduleNext();
    }
  }
}

const autoWave = new AutoWaveSystem();
```

### 1.5 行為細節說明

| 情境 | 行為 |
|------|------|
| 開啟時，波次正在進行中 | 等待本波結束後，延遲 500ms 自動觸發下一波 |
| 開啟時，目前在等待倒數 | 立即取消剩餘倒數，延遲 500ms 觸發下一波 |
| 關閉時，下一波已在排程 | 取消排程，恢復正常等待倒數 |
| 最後一波（終局總攻）結束 | **不自動觸發**，直接進入結算畫面 |
| 遊戲暫停時 | 取消排程；恢復遊戲後若仍開啟則重新排程 |
| 地獄難度 | **可使用**（自動波次開關不受難度限制）|
| 密技模式 | **可使用** |

### 1.6 提前發動獎勵與自動接續的關係

自動接續觸發的下一波**視同手動提前發動**（若上一波結束時仍有倒數計時剩餘），照常給予 +10 金幣獎勵：

```javascript
function startNextWave(isAutoTriggered = false) {
  const timeRemaining = WaveManager.countdownRemaining;

  if (timeRemaining > 0) {
    // 還有倒數時間 → 給提前獎勵
    GameState.gold += 10;
    showEarlyBonus();
  }

  WaveManager.triggerNextWave();
}
```

### 1.7 設定持久化

自動接續的**開關狀態不儲存至 localStorage**，每局遊戲預設為「關閉」，由玩家在局中自行開啟。

```javascript
// 局初始化時重置
function initGameSession() {
  autoWave.enabled = false;
  updateAutoWaveButtonUI(false);
  // ... 其他初始化
}
```

### 1.8 玩法說明頁更新

在玩法說明的「波次系統」段落補充：

```
自動接續下一波：
  點擊 HUD 右上角的「⚡ 自動」按鈕可開啟/關閉。
  開啟後，每波清除完畢會自動觸發下一波（延遲 0.5 秒）。
  自動觸發同樣給予 +10 提前獎勵金幣（若倒數未結束）。
  最後一波結束後不會自動接續，直接進入結算。
```

---

## 2. Bug 修正：升級面板金幣狀態同步

### 2.1 問題描述

**Bug 復現步驟：**

1. 玩家點擊地圖上的一座塔，開啟升級面板
2. 此時金幣不足以升級（升級按鈕顯示為灰色/禁用）
3. 玩家**不關閉升級面板**，繼續遊戲
4. 場上敵人被消滅，金幣逐漸增加，超過升級費用
5. 升級按鈕**仍然顯示為灰色**，無法點擊
6. 玩家必須**關閉面板再重新點擊塔**，升級按鈕才恢復為可點擊

**根本原因：**

升級面板在**開啟的瞬間**計算一次金幣是否足夠，並設定按鈕的 disabled 狀態。此後金幣變動時，面板內部的按鈕狀態**沒有重新計算**，導致狀態過期（stale state）。

### 2.2 修正方案

升級面板訂閱 `GOLD_CHANGED` 事件，每次金幣變動時**重新計算並刷新所有升級按鈕的可點擊狀態**。

```javascript
class UpgradePanel {
  constructor() {
    this.currentTower = null;
    this.isOpen       = false;

    // 訂閱金幣變動事件
    EventBus.on('GOLD_CHANGED', () => {
      if (this.isOpen) this.refreshButtonStates();
    });
  }

  open(tower) {
    this.currentTower = tower;
    this.isOpen       = true;
    this.render();
    this.refreshButtonStates();   // 開啟時計算一次
  }

  close() {
    this.currentTower = null;
    this.isOpen       = false;
  }

  // 重新計算所有升級按鈕的啟用/禁用狀態
  refreshButtonStates() {
    if (!this.currentTower || !this.isOpen) return;

    const tower = this.currentTower;
    const gold  = GameState.gold;

    // A 路線各級按鈕
    ['A1', 'A2', 'A3'].forEach(level => {
      const btn  = document.getElementById(`upgrade-btn-${level}`);
      if (!btn) return;
      const cost = getUpgradeCost(tower, 'A', parseInt(level[1]));
      const canUpgrade = canUpgradePath(tower, 'A', parseInt(level[1]));

      setButtonState(btn, {
        disabled: !canUpgrade || gold < cost,
        reason:   !canUpgrade ? 'locked'
                : gold < cost ? 'insufficient'
                : 'available'
      });
    });

    // B 路線各級按鈕
    ['B1', 'B2', 'B3'].forEach(level => {
      const btn  = document.getElementById(`upgrade-btn-${level}`);
      if (!btn) return;
      const cost = getUpgradeCost(tower, 'B', parseInt(level[1]));
      const canUpgrade = canUpgradePath(tower, 'B', parseInt(level[1]));

      setButtonState(btn, {
        disabled: !canUpgrade || gold < cost,
        reason:   !canUpgrade ? 'locked'
                : gold < cost ? 'insufficient'
                : 'available'
      });
    });

    // 頂點技能按鈕
    const apexBtn = document.getElementById('upgrade-btn-apex');
    if (apexBtn) {
      const apexCost     = getApexCost(tower);
      const apexUnlocked = tower.upgrade.pathA === 3 && tower.upgrade.pathB === 3;
      const apexBought   = tower.upgrade.apexActivated;

      setButtonState(apexBtn, {
        disabled: !apexUnlocked || apexBought || gold < apexCost,
        reason:   !apexUnlocked ? 'locked'
                : apexBought    ? 'purchased'
                : gold < apexCost ? 'insufficient'
                : 'available'
      });
    }
  }
}

// 按鈕狀態設定輔助函式
function setButtonState(btn, { disabled, reason }) {
  btn.disabled = disabled;
  btn.dataset.reason = reason;

  // 視覺樣式依狀態切換
  btn.classList.remove('state-available', 'state-insufficient', 'state-locked', 'state-purchased');
  btn.classList.add(`state-${reason}`);
}
```

### 2.3 按鈕狀態視覺對照

| 狀態 | `data-reason` | 外觀 |
|------|-------------|------|
| 可升級 | `available` | 金色背景，白色文字，可點擊 |
| 金幣不足 | `insufficient` | 灰色背景，紅色費用文字，**不可點擊** |
| 尚未解鎖（需先升前一級）| `locked` | 深灰背景，鎖頭圖示，不可點擊 |
| 已購買（頂點技能）| `purchased` | 深綠背景，「✅ 已解鎖」文字，不可點擊 |

```css
.upgrade-button.state-available {
  background:  var(--color-primary);    /* 金黃 */
  color:       #000;
  cursor:      pointer;
  opacity:     1;
}

.upgrade-button.state-insufficient {
  background:  rgba(255,255,255,0.08);
  color:       var(--color-text-sub);
  cursor:      not-allowed;
  opacity:     0.7;
}

/* 費用文字特別標紅（金幣不足時）*/
.upgrade-button.state-insufficient .cost-label {
  color: #EF5350;
}

.upgrade-button.state-locked {
  background:  rgba(255,255,255,0.04);
  color:       rgba(255,255,255,0.3);
  cursor:      not-allowed;
  opacity:     0.5;
}

.upgrade-button.state-purchased {
  background:  #1B5E20;
  color:       #A5D6A7;
  cursor:      default;
  opacity:     1;
}
```

### 2.4 EventBus 事件確認

確保 `GOLD_CHANGED` 事件在所有金幣變動情境下皆被觸發：

```javascript
// 金幣變動的所有入口都必須通過此函式
function changeGold(amount) {
  const before = GameState.gold;
  GameState.gold = Math.max(0, GameState.gold + amount);
  const after = GameState.gold;

  if (before !== after) {
    EventBus.emit('GOLD_CHANGED', { before, after, delta: after - before });
  }
}

// 確認所有金幣來源皆呼叫 changeGold()：
//   ✅ 擊殺敵人獎勵
//   ✅ 波次完成獎勵
//   ✅ 提前發動獎勵
//   ✅ 賣出塔
//   ✅ 密技金幣
//   ✅ 史詩模式加成卡（金幣暴擊等）
```

### 2.5 迴歸測試情境

修正後需確認以下情境皆正常運作：

| 測試情境 | 預期結果 |
|---------|---------|
| 金幣不足時開啟升級面板 | 升級按鈕為灰色，不可點擊 |
| 面板開啟中，金幣增加至足夠 | 升級按鈕**自動**變為金色，可點擊，**不需重開面板** |
| 面板開啟中，金幣減少至不足 | 升級按鈕自動變回灰色 |
| 已升滿的路線 | 按鈕正確顯示「已完成」，不因金幣變動而改變 |
| 頂點技能未解鎖時 | 按鈕顯示鎖定，不因金幣增加而變為可點擊 |
| 頂點技能解鎖且金幣足夠 | 按鈕正確顯示可點擊 |
| 關閉面板後金幣變動 | 不觸發任何 UI 更新（面板已關閉）|
| 同時有多座升級面板 | **不允許**（設計上同時只有一個面板開啟）|

---

## 3. 數值調整：密技金幣量

### 3.1 調整內容

| 項目 | v1.2（舊）| v1.4（新）|
|------|---------|---------|
| 密技觸發金幣量 | +999 | **+9999** |
| 按鍵序列 | ← ← → → ← | ← ← → → ←（不變）|
| 觸發平台 | Web 版 | Web 版（不變）|
| 觸發限制 | 可無限次 | 可無限次（不變）|
| 分數影響 | 不計入排行榜 | 不計入排行榜（不變）|

### 3.2 通知 UI 更新

觸發通知文字同步調整：

```
┌─────────────────────────────────┐
│   🤑  密技啟動！                │
│   獲得 +9999 金幣！             │   ← 數字由 999 改為 9999
│   （本局分數不計入排行榜）      │
└─────────────────────────────────┘
```

### 3.3 程式碼更新

```javascript
function triggerMoneyCheat() {
  GameState.gold     += 9999;          // 999 → 9999
  GameState.cheatUsed = true;
  showCheatNotification(9999);         // 傳入正確金額
  playCheatSound();
}

function showCheatNotification(amount) {
  const el = document.getElementById('cheat-notification');
  el.querySelector('.cheat-amount').textContent = `+${amount.toLocaleString()} 金幣！`;
  // 其餘動畫邏輯不變
}
```

---

## 4. 本版本變更摘要

### 4.1 v1.4.0 完整異動清單

| 類型 | 項目 | 說明 |
|------|------|------|
| ✨ 新功能 | 自動接續下一波 | HUD 新增開關按鈕，開啟後波次結束自動觸發下一波（延遲 500ms），可隨時切換，預設關閉 |
| 🐛 Bug 修正 | 升級面板金幣狀態同步 | 面板開啟中金幣增加時，升級按鈕自動刷新可點擊狀態，不再需要重開面板 |
| 🔢 數值調整 | 密技金幣量 | 密技觸發金幣由 +999 提升至 **+9999** |

### 4.2 不受本版本影響的項目

- 所有塔的數值（維持 v1.3 設定）
- 所有氣球的數值（維持 v1.3 設定）
- 地圖設計（維持 v1.3 設定）
- 波次設計（維持 v1.3 設定）
- 難度與長度係數（維持 v1.3 設定）

---

*功能新增與修正規格書 v1.4.0 — MonkeyFortress TD*
