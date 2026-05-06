# 🐯 鬥獸棋 規格修訂補丁

> **基準版本**：v1.0（2026-05-06）  
> **補丁版本**：v1.1  
> **修訂日期**：2026-05-06  
> **修訂項目**：4 項

---

## 修訂摘要

| # | 修訂項目 | 影響章節 | 類型 |
|---|---------|---------|------|
| P1 | 行動裝置棋盤超出邊界修正 | §8、§11 | 🐛 修正 |
| P2 | 棋子識別度強化（貓 vs 狗） | §4、§8、§12 | ✨ 強化 |
| P3 | 設定畫面未儲存恢復機制 | §7、§13 | ✨ 新增 |
| P4 | 新增 4 張地圖（共 5 張隨機） | §3、§8、§12、§14 | ✨ 新增 |

---

## P1　行動裝置棋盤超出邊界修正

### 問題描述

原規格中棋盤使用 `--cell-size: clamp(40px, 11vw, 72px)` 計算格子大小，但未考慮以下情況：

- 7 欄棋盤 + 格子間距 + 左右 padding 的**總寬加總**在小螢幕上超過 `100vw`
- 狀態列、被吃子區、操作按鈕列等元素也佔用寬度，造成水平溢位
- 部分 Android 裝置瀏覽器有額外工具列高度，影響可視高度計算

### 修正規格

#### P1.1 棋盤容器安全寬度計算

棋盤的實際渲染寬度必須嚴格限制在「可用安全寬度」內：

```css
:root {
  /* 安全邊距（左右各保留 8px 以上） */
  --board-safe-padding: 8px;
  
  /* 棋盤可用最大寬度 */
  --board-max-width: calc(100vw - var(--board-safe-padding) * 2);
  
  /* 動態格子大小：依安全寬度自動計算
     公式：(可用寬度 - 格子間距總和) ÷ 欄數
     間距 = (7 - 1) × gap = 6 × 2px = 12px（取保守值） */
  --cell-size: min(
    calc((var(--board-max-width) - 12px) / 7),
    72px
  );
}
```

#### P1.2 棋盤包裝容器規格

```css
/* 棋盤最外層容器 */
.board-container {
  width: 100%;
  max-width: var(--board-max-width);
  margin: 0 auto;
  box-sizing: border-box;
  
  /* 禁止水平溢出 */
  overflow: hidden;
  
  /* 防止內容撐破容器 */
  contain: layout;
}

/* 棋盤 Grid 容器 */
.board-grid {
  display: grid;
  grid-template-columns: repeat(7, var(--cell-size));
  grid-template-rows: repeat(9, var(--cell-size));
  gap: var(--cell-gap);
  
  /* 寬度嚴格等於格子寬度總和，不允許拉伸 */
  width: calc(var(--cell-size) * 7 + var(--cell-gap) * 6);
  
  /* 水平置中 */
  margin: 0 auto;
  
  /* 超出時隱藏（保險措施） */
  overflow: hidden;
}

/* 格子間距也須隨格子縮小 */
:root {
  --cell-gap: max(1px, min(3px, calc(var(--cell-size) * 0.04)));
}
```

#### P1.3 分斷點安全值覆蓋

```css
/* === 超小螢幕（寬度 < 360px，如舊款 Android） === */
@media (max-width: 359px) {
  :root {
    --board-safe-padding: 4px;
    /* 強制以 360px 以下最小安全值計算 */
    --cell-size: calc((100vw - 8px - 12px) / 7);
  }
  
  /* 狀態列文字截斷而非撐寬 */
  .player-status {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* === 標準手機（360px - 480px） === */
@media (min-width: 360px) and (max-width: 480px) {
  :root {
    --board-safe-padding: 8px;
    --cell-size: min(calc((100vw - 16px - 12px) / 7), 52px);
  }
}

/* === 橫向模式（height < 500px） === */
@media (orientation: landscape) and (max-height: 500px) {
  :root {
    /* 橫向時以高度限制為主（棋盤有 9 行） */
    --cell-size: min(
      calc((100vw - 200px - 12px) / 7),   /* 扣除左右側欄 200px */
      calc((100vh - 80px - 16px) / 9)      /* 以高度為限 */
    );
    --board-safe-padding: 4px;
  }
}
```

#### P1.4 遊戲畫面垂直滾動保障

當裝置高度不足時（例如橫向模式），允許**垂直滾動**，確保所有元素可達：

```css
#screen-game {
  /* 垂直方向允許滾動 */
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 最小高度為內容高度 */
  min-height: 100dvh; /* dvh = Dynamic Viewport Height，排除瀏覽器工具列 */
  
  /* flex 佈局確保棋盤居中 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm) var(--board-safe-padding);
  box-sizing: border-box;
}
```

> **注意**：使用 `100dvh`（Dynamic Viewport Height）而非 `100vh`，可正確排除 iOS Safari 與 Chrome Android 的底部工具列高度，避免元素被遮擋。

#### P1.5 被吃子區自動換行

```css
/* 被吃子區：允許換行，不撐寬 */
.captured-pieces {
  display: flex;
  flex-wrap: wrap;       /* 換行而非水平溢出 */
  gap: 4px;
  max-width: 100%;
  overflow: hidden;
}

.captured-pieces .piece-mini {
  width: clamp(20px, 5vw, 28px);
  height: clamp(20px, 5vw, 28px);
  font-size: clamp(12px, 3vw, 16px);
  flex-shrink: 0;
}
```

#### P1.6 操作按鈕列寬度安全

```css
.action-bar {
  width: 100%;
  max-width: var(--board-max-width);
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0 var(--board-safe-padding);
  box-sizing: border-box;
}

.action-bar button {
  /* 允許按鈕在小螢幕上縮小文字 */
  font-size: clamp(13px, 3.5vw, var(--fs-btn));
  padding: var(--space-sm) clamp(8px, 3vw, var(--space-md));
  /* 防止按鈕被截斷 */
  white-space: nowrap;
  /* 彈性分配寬度 */
  flex: 1;
  max-width: 120px;
  min-width: 0;
}
```

#### P1.7 新增佈局安全性驗證邏輯（JavaScript）

```javascript
// 遊戲啟動時驗證棋盤不溢出，若仍溢出則強制壓縮
function ensureBoardFit() {
  const boardGrid = document.querySelector('.board-grid');
  const container = document.querySelector('.board-container');
  if (!boardGrid || !container) return;
  
  const containerWidth = container.getBoundingClientRect().width;
  const boardWidth = boardGrid.getBoundingClientRect().width;
  
  if (boardWidth > containerWidth) {
    const forcedCellSize = Math.floor((containerWidth - 12) / 7);
    document.documentElement.style.setProperty('--cell-size', `${forcedCellSize}px`);
    console.warn(`[BoardFit] 強制壓縮格子大小至 ${forcedCellSize}px`);
  }
}

// 每次進入遊戲畫面時呼叫
window.addEventListener('resize', ensureBoardFit);
document.addEventListener('DOMContentLoaded', ensureBoardFit);
```

---

## P2　棋子識別度強化（貓 vs 狗）

### 問題描述

原規格中貓（🐱）與狗（🐕）的 Emoji 在以下情況不易區分：

- 小螢幕（格子縮至 40px 以下時，Emoji 細節消失）
- 部分 Android 裝置的 Emoji 字型風格差異導致圖示相似
- 色覺障礙者難以靠顏色區分己方與敵方的同類棋子
- 中文模式下「貓」與「狗」字形相近

### 修正規格

#### P2.1 棋子視覺識別系統（全面強化）

每個棋子新增**三層識別標記**，確保在任何情況下均可辨認：

| 識別層 | 說明 | 備用條件 |
|--------|------|---------|
| 第一層：主圖示 | Emoji / 中文字 | 主要辨識 |
| 第二層：等級數字 | 右下角徽章 | 原有設計 |
| 第三層：形狀標記 | 棋子外框形狀 | 新增，主要解決貓狗混淆 |

#### P2.2 各棋子專屬形狀標記（Shape Badge）

每種棋子的**外框形狀**不同，即使 Emoji 看不清楚也能辨認：

| 棋子 | 等級 | 外框形狀 | 形狀 CSS 實作 |
|------|------|---------|--------------|
| 象 🐘 | 8 | 正八邊形 | `clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)` |
| 獅 🦁 | 7 | 六角星（尖角） | `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)` |
| 虎 🐯 | 6 | 菱形（45° 旋轉方形） | `clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)` |
| 豹 🐆 | 5 | 六邊形 | `clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)` |
| 狼 🐺 | 4 | 五邊形 | `clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)` |
| 狗 🐕 | 3 | **正方形（圓角 12%）** | `border-radius: 12%` |
| 貓 🐱 | 2 | **圓形** | `border-radius: 50%` |
| 鼠 🐭 | 1 | 三角形（向上） | `clip-path: polygon(50% 0%, 100% 100%, 0% 100%)` |

> **重點**：狗（方形）與貓（圓形）形狀對比最鮮明，一眼可辨。

#### P2.3 棋子 HTML 結構更新

```html
<!-- 更新後的棋子結構 -->
<div class="piece piece--player piece--dog"
     data-type="dog"
     data-rank="3"
     role="button"
     aria-label="狗，等級3，玩家棋子，位於 F8">
  
  <!-- 形狀容器（決定棋子形狀） -->
  <div class="piece__shape">
    
    <!-- 主圖示 -->
    <span class="piece__icon" aria-hidden="true">🐕</span>
    
    <!-- 等級徽章 -->
    <span class="piece__rank" aria-hidden="true">3</span>
    
    <!-- 棋子名稱標籤（小螢幕下顯示） -->
    <span class="piece__label">狗</span>
    
  </div>
  
  <!-- 形狀提示圖標（懸停 tooltip） -->
  <span class="piece__tooltip">狗・等級3</span>
  
</div>
```

#### P2.4 棋子樣式規格更新

```css
/* 形狀容器 */
.piece__shape {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 形狀由各棋子類別的 clip-path 或 border-radius 決定 */
}

/* === 狗：正方形（圓角）=== */
.piece--dog .piece__shape {
  border-radius: 18%;          /* 圓角正方形 */
  outline: 3px solid rgba(255,255,255,0.5); /* 方形輪廓加強 */
}

/* === 貓：圓形 === */
.piece--cat .piece__shape {
  border-radius: 50%;          /* 完整圓形 */
  outline: 3px dashed rgba(255,255,255,0.5); /* 虛線輪廓區別於狗 */
}

/* === 其他棋子形狀 === */
.piece--elephant .piece__shape { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
.piece--lion     .piece__shape { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
.piece--tiger    .piece__shape { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.piece--leopard  .piece__shape { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
.piece--wolf     .piece__shape { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
.piece--rat      .piece__shape { clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }

/* === 棋子名稱標籤（格子夠大時顯示）=== */
.piece__label {
  display: none;  /* 預設隱藏 */
  font-size: 9px;
  color: rgba(255,255,255,0.85);
  font-weight: bold;
  line-height: 1;
  margin-top: 1px;
}

/* 格子夠大（>= 52px）時顯示名稱 */
@media (min-width: 400px) {
  .piece__label { display: block; }
}

/* === 懸停 Tooltip === */
.piece__tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
  padding: 3px 8px;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 100;
}

.piece:hover .piece__tooltip,
.piece:focus .piece__tooltip {
  opacity: 1;
}

/* 觸控裝置：點選後顯示 tooltip 0.8s */
.piece--tooltip-show .piece__tooltip {
  opacity: 1;
  animation: tooltipFade 0.8s ease forwards;
}

@keyframes tooltipFade {
  0%   { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
```

#### P2.5 棋子資訊面板（點選後顯示）

點選棋子時，在棋盤下方顯示**棋子說明卡片**：

```
┌────────────────────────────────┐
│  🐕  狗（Dog）                  │
│  等級：3    ◆◆◆○○○○○         │
│  能力：普通移動，無特殊技能     │
│  可吃：鼠（1）、貓（2）        │
│  剋制：狗（同等級互吃）        │
└────────────────────────────────┘
```

規格：
- 位置：棋盤正下方，操作按鈕列上方
- 高度：clamp(60px, 15vw, 80px)
- 字體大小：clamp(13px, 2.5vw, 16px)
- 動畫：從下方滑入，取消選取時滑出
- 觸控裝置必顯示此卡片；桌機可透過懸停 tooltip 代替

```javascript
// 點選棋子時更新資訊卡片
function updatePieceInfoCard(piece) {
  if (!piece) {
    infoCard.style.display = 'none';
    return;
  }
  
  const PIECE_INFO = {
    elephant: { name: '象', ability: '無特殊能力（不能吃鼠）', canEat: '除了鼠以外所有棋子' },
    lion:     { name: '獅', ability: '可跳越整條河流', canEat: '等級 1-6 棋子' },
    tiger:    { name: '虎', ability: '可跳越整條河流', canEat: '等級 1-5 棋子' },
    leopard:  { name: '豹', ability: '無特殊能力', canEat: '等級 1-4 棋子' },
    wolf:     { name: '狼', ability: '無特殊能力', canEat: '等級 1-3 棋子' },
    dog:      { name: '狗', ability: '無特殊能力', canEat: '等級 1-2 棋子（鼠、貓）' },
    cat:      { name: '貓', ability: '無特殊能力', canEat: '等級 1（鼠）' },
    rat:      { name: '鼠', ability: '可進入河流、可吃象', canEat: '鼠（同等）、象（等級8）' },
  };
  
  const info = PIECE_INFO[piece.type];
  infoCard.innerHTML = `
    <span class="info-icon">${piece.emoji}</span>
    <div class="info-text">
      <strong>${info.name}（等級 ${piece.rank}）</strong>
      <span>${info.ability}</span>
      <span>可吃：${info.canEat}</span>
    </div>
  `;
  infoCard.style.display = 'flex';
}
```

#### P2.6 棋子識別度檢查清單

開發時需通過以下驗證：

- [ ] 在 40px 格子大小下，貓（圓）與狗（方）形狀明顯不同
- [ ] 設定為「中文模式」時，「貓」與「狗」文字清晰可讀
- [ ] Tooltip / 資訊卡片在觸控裝置上可正確觸發
- [ ] 所有棋子的 `aria-label` 包含完整名稱（不只有 Emoji）
- [ ] 色覺模擬（Deuteranopia）下，貓狗形狀仍可辨認

---

## P3　設定畫面未儲存恢復機制

### 問題描述

原規格描述設定「每次變更自動儲存」，但同時有「儲存按鈕」，行為語意衝突。正確行為應為：

- 進入設定畫面 → 載入當前設定（暫存副本）
- 修改設定 → 只更新 UI，**不寫入 localStorage**
- 點擊「儲存設定」→ 寫入 localStorage，確認生效
- 點擊「返回」或「取消」→ 恢復進入設定前的狀態，**丟棄所有變更**

### 修正規格

#### P3.1 設定狀態管理（覆蓋原 §7.2）

```javascript
class SettingsStore {
  constructor() {
    this._saved = null;    // 已儲存（localStorage）的設定
    this._draft = null;    // 草稿（設定畫面中的臨時變更）
    this._key = 'jungleChess_settings';
  }
  
  /** 讀取已儲存設定（或預設值） */
  load() {
    const raw = localStorage.getItem(this._key);
    this._saved = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    return { ...this._saved };
  }
  
  /** 進入設定畫面：建立草稿副本 */
  beginEdit() {
    this._draft = { ...this._saved };
    return { ...this._draft };
  }
  
  /** 在設定畫面中變更某項設定（只改草稿） */
  updateDraft(key, value) {
    if (this._draft === null) this.beginEdit();
    this._draft[key] = value;
    // 不寫入 localStorage！
  }
  
  /** 取得目前草稿（供 UI 顯示） */
  getDraft() {
    return this._draft ? { ...this._draft } : this.load();
  }
  
  /** 儲存：將草稿寫入 localStorage，更新已儲存狀態 */
  save() {
    if (this._draft === null) return false;
    this._saved = { ...this._draft };
    localStorage.setItem(this._key, JSON.stringify(this._saved));
    this._draft = null;
    return true;
  }
  
  /** 放棄變更：丟棄草稿，返回已儲存狀態 */
  discard() {
    this._draft = null;
    return { ...this._saved };
  }
  
  /** 重設為預設值（只改草稿，需再按儲存才生效） */
  resetToDefault() {
    this._draft = { ...DEFAULT_SETTINGS };
    return { ...this._draft };
  }
  
  /** 判斷草稿是否與已儲存設定相同（有無未儲存變更） */
  hasUnsavedChanges() {
    if (!this._draft) return false;
    return JSON.stringify(this._draft) !== JSON.stringify(this._saved);
  }
}
```

#### P3.2 設定畫面生命週期

```
[點擊「遊戲設定」]
       ↓
[settingsStore.beginEdit()]   ← 建立草稿副本
       ↓
[畫面顯示草稿值]
       ↓
    用戶操作
   ┌────────────────────────────────┐
   │ 變更任何設定 → updateDraft()   │
   │ 點「儲存設定」→ save() + 返回  │
   │ 點「重設預設」→ resetToDefault()（草稿，需再儲存）│
   │ 點「← 返回」→ 判斷 hasUnsavedChanges()           │
   └────────────────────────────────┘
```

#### P3.3 返回按鈕行為（有未儲存變更時）

```
若 hasUnsavedChanges() === true：

┌─────────────────────────────────┐
│  ⚠️  設定尚未儲存                │
│                                 │
│  您有未儲存的設定變更。          │
│  離開後變更將會遺失。            │
│                                 │
│  [💾 儲存並離開]  [🚪 直接離開] │
└─────────────────────────────────┘

行為：
- 「儲存並離開」→ save() → 返回上一畫面
- 「直接離開」   → discard() → 返回上一畫面（恢復舊設定）
- 點遮罩關閉    → 等同「直接離開」

若 hasUnsavedChanges() === false：
→ 直接返回，無需確認
```

#### P3.4 設定變更即時預覽（不影響儲存邏輯）

部分設定可在草稿狀態下**即時預覽**，但只是視覺效果，不算儲存：

| 設定項目 | 即時預覽 | 說明 |
|---------|---------|------|
| 音效音量 | ✅ 播放測試音效 | 方便調整 |
| BGM 音量 | ✅ 立即改變音樂音量 | 方便調整 |
| 棋子風格 | ✅ 設定畫面內棋子預覽區更新 | |
| BGM 主題 | ✅ 切換播放新主題 | 離開後若未儲存恢復原主題 |
| AI 難度 | ❌ 需儲存後遊戲生效 | |
| 輔助功能 | ❌ 需儲存後遊戲生效 | |

```javascript
// 即時預覽：只改 draft，不存檔，且部分效果即時反映
settingsUI.onVolumeChange = (key, val) => {
  settingsStore.updateDraft(key, val);
  
  // 即時預覽（音量類）
  if (key === 'sfxVolume') {
    audioManager.setSFXVolume(val / 100);
    audioManager.playSFX('click'); // 播放測試音
  }
  if (key === 'bgmVolume') {
    audioManager.setBGMVolume(val / 100);
  }
  if (key === 'bgmTheme') {
    audioManager.playBGM(val); // 切換試聽，未儲存則離開後恢復
  }
};

// 離開設定時，若未儲存，恢復音訊至已儲存值
function onSettingsExit(saved) {
  if (!saved) {
    const saved = settingsStore.discard();
    audioManager.setSFXVolume(saved.sfxVolume / 100);
    audioManager.setBGMVolume(saved.bgmVolume / 100);
    audioManager.playBGM(saved.bgmTheme);
  }
}
```

#### P3.5 設定畫面 UI 更新

**未儲存指示器**：當草稿與已儲存設定不同時，顯示提示：

```
┌────────────────────────────────────────┐
│  ← 返回   ⚙️ 遊戲設定   ● 有未儲存變更 │
└────────────────────────────────────────┘
```

```css
.settings-unsaved-indicator {
  display: none;
  font-size: 13px;
  color: #ffaa00;
  animation: blink 1.5s ease-in-out infinite;
}

.settings-unsaved-indicator.visible {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
```

---

## P4　新增 4 張地圖（共 5 張，開局隨機）

### 設計說明

地圖（主題皮膚）不改變鬥獸棋的**核心棋盤邏輯**（格子座標、地形位置、規則），只改變：

1. **視覺主題**：棋盤底色、格子紋理、整體配色
2. **地形視覺**：河流、陷阱、獸穴的視覺呈現方式
3. **背景場景**：遊戲畫面背景圖案
4. **BGM 預設**：每張地圖建議搭配的背景音樂主題

> 棋子形狀、等級規則、移動邏輯在所有地圖中完全一致。

### P4.1 五張地圖清單

#### 地圖 1：原始叢林（Classic Jungle）⭐ 原版

```
主題：熱帶雨林，翠綠自然
棋盤底色：深棕木紋（--color-board-light: #c8a96e）
河流：深藍色波紋動畫
陷阱：帶刺鐵絲圍欄視覺
獸穴：草木編織茅屋圖示
背景：叢林樹葉紋路，半透明覆蓋
BGM：叢林主題（jungle）
主色調：#1a2e1a（深綠）
```

#### 地圖 2：雪原凍土（Arctic Tundra）🧊

```
主題：極地雪原，冷峻清冽
棋盤底色：交替淺藍白與冰藍
  --board-light: #ddeeff
  --board-dark:  #aaccee
河流：半結冰效果（白色碎冰粒子動畫 + 淡藍底）
陷阱：冰刺陷阱（三角冰錐圖示）
獸穴：冰屋（Igloo）圖示
背景：漸層極光效果（CSS gradient，綠藍漸層）
BGM：古琴主題（guqin，較慢速）
主色調：#0a1e3a（深夜藍）
特殊效果：偶發雪花粒子飄落（Canvas，低頻率）
```

#### 地圖 3：沙漠遺跡（Desert Ruins）🏜️

```
主題：古老廢墟，黃沙漫漫
棋盤底色：沙黃與赭石交替
  --board-light: #e8c87a
  --board-dark:  #c8923a
河流：沙漠綠洲（綠色水源，與一般河流色不同）
  --board-river: #2a8a4a
陷阱：石板機關（凹陷石紋）
獸穴：金字塔門洞圖示
背景：沙丘輪廓剪影（SVG inline）
BGM：叢林主題（略帶沙鈴節奏，使用相同程式生成但加入沙鈴音色）
主色調：#3a2010（深棕）
特殊效果：偶發沙塵粒子（Canvas，由右向左）
```

#### 地圖 4：熔岩火山（Volcanic Lava）🌋

```
主題：火山地獄，危機四伏
棋盤底色：深灰火山岩交替
  --board-light: #5a3a2a
  --board-dark:  #3a1a0a
河流：流動熔岩效果（橙紅漸層 + 流動動畫）
  --board-river: #ff4400（配合 CSS 動畫）
陷阱：裂縫噴火口（紅色裂縫圖示）
獸穴：熔岩石台圖示
背景：漸層暗紅煙霧，帶輕微閃爍
BGM：叢林主題（加入低頻打擊，節奏加快 BPM 100）
主色調：#1a0a00（近黑紅）
特殊效果：橘紅火花粒子（Canvas，由下向上）
```

#### 地圖 5：水墨古城（Ink Brush）🎋

```
主題：中國水墨，雅致典靜
棋盤底色：米白宣紙紋交替
  --board-light: #f5f0e0
  --board-dark:  #e0d8c0
河流：水墨暈染藍（深藍漸層，邊緣模糊效果）
  --board-river: #3a6a90
陷阱：水墨筆刷「×」標記
獸穴：印章紅底「穴」字樣
背景：淡墨竹葉、山水線稿（SVG）
BGM：古琴主題（guqin）
主色調：#1a1210（墨黑）
特殊效果：無粒子（保持簡潔），棋子移動有水墨擴散效果
棋子特殊：中文模式自動套用（設定中棋子風格強制切為中文字）
```

### P4.2 地圖資料結構

```typescript
interface MapTheme {
  id: string;           // 'classic' | 'arctic' | 'desert' | 'volcanic' | 'ink'
  name: string;         // 顯示名稱（多語系）
  icon: string;         // 地圖代表 Emoji
  description: string;  // 簡介文字
  
  // CSS 變數覆蓋（套用時注入至 document.documentElement）
  cssVars: Record<string, string>;
  
  // 地形圖示設定
  terrainIcons: {
    river: string;        // 河流格子內容（CSS class 或 emoji）
    trapPlayer: string;   // 玩家陷阱圖示
    trapAI: string;       // AI 陷阱圖示
    denPlayer: string;    // 玩家獸穴圖示
    denAI: string;        // AI 獸穴圖示
  };
  
  // 特殊效果設定
  particleEffect: 'none' | 'snow' | 'sand' | 'spark' | null;
  particleConfig?: {
    count: number;        // 粒子數量
    color: string;        // 粒子顏色
    speedX: number;       // 水平速度
    speedY: number;       // 垂直速度（負為向上）
    size: number;         // 粒子大小（px）
  };
  
  // BGM 設定
  defaultBGM: 'jungle' | 'guqin' | 'none';
  
  // 棋子風格覆蓋（null = 使用用戶設定）
  forcePieceStyle: 'emoji' | 'chinese' | null;
}
```

### P4.3 五張地圖完整定義

```javascript
const MAP_THEMES = [
  {
    id: 'classic',
    name: { 'zh-TW': '原始叢林', 'zh-CN': '原始丛林', 'en': 'Classic Jungle' },
    icon: '🌿',
    description: { 'zh-TW': '最經典的叢林戰場' },
    cssVars: {
      '--color-bg-primary':   '#1a2e1a',
      '--color-bg-secondary': '#2d4a2d',
      '--color-board-light':  '#c8a96e',
      '--color-board-dark':   '#a07840',
      '--color-board-river':  '#4a90d4',
      '--color-board-trap':   '#8b0000',
      '--color-board-den':    '#ffd700',
    },
    terrainIcons: { river:'🌊', trapPlayer:'⚠️', trapAI:'⚠️', denPlayer:'🏠', denAI:'🏠' },
    particleEffect: null,
    defaultBGM: 'jungle',
    forcePieceStyle: null,
  },
  {
    id: 'arctic',
    name: { 'zh-TW': '雪原凍土', 'zh-CN': '雪原冻土', 'en': 'Arctic Tundra' },
    icon: '🧊',
    description: { 'zh-TW': '極地冰原，踏雪尋敵' },
    cssVars: {
      '--color-bg-primary':   '#0a1e3a',
      '--color-bg-secondary': '#1a3a5a',
      '--color-board-light':  '#ddeeff',
      '--color-board-dark':   '#aaccee',
      '--color-board-river':  '#b0d8ff',
      '--color-board-trap':   '#003366',
      '--color-board-den':    '#e0f8ff',
    },
    terrainIcons: { river:'❄️', trapPlayer:'🔺', trapAI:'🔺', denPlayer:'🏔️', denAI:'🏔️' },
    particleEffect: 'snow',
    particleConfig: { count: 40, color: '#ffffff', speedX: -0.3, speedY: 0.8, size: 3 },
    defaultBGM: 'guqin',
    forcePieceStyle: null,
  },
  {
    id: 'desert',
    name: { 'zh-TW': '沙漠遺跡', 'zh-CN': '沙漠遗迹', 'en': 'Desert Ruins' },
    icon: '🏜️',
    description: { 'zh-TW': '古老廢墟中的獸族之戰' },
    cssVars: {
      '--color-bg-primary':   '#3a2010',
      '--color-bg-secondary': '#5a3818',
      '--color-board-light':  '#e8c87a',
      '--color-board-dark':   '#c8923a',
      '--color-board-river':  '#2a8a4a',
      '--color-board-trap':   '#6a3a00',
      '--color-board-den':    '#ffa500',
    },
    terrainIcons: { river:'💧', trapPlayer:'🪤', trapAI:'🪤', denPlayer:'🏛️', denAI:'🏛️' },
    particleEffect: 'sand',
    particleConfig: { count: 20, color: '#e8c87a', speedX: -1.2, speedY: 0.2, size: 2 },
    defaultBGM: 'jungle',
    forcePieceStyle: null,
  },
  {
    id: 'volcanic',
    name: { 'zh-TW': '熔岩火山', 'zh-CN': '熔岩火山', 'en': 'Volcanic Lava' },
    icon: '🌋',
    description: { 'zh-TW': '滾燙熔岩間的生死決鬥' },
    cssVars: {
      '--color-bg-primary':   '#1a0a00',
      '--color-bg-secondary': '#3a1a00',
      '--color-board-light':  '#5a3a2a',
      '--color-board-dark':   '#3a1a0a',
      '--color-board-river':  '#ff4400',
      '--color-board-trap':   '#aa0000',
      '--color-board-den':    '#ff8800',
    },
    terrainIcons: { river:'🔥', trapPlayer:'💥', trapAI:'💥', denPlayer:'⛰️', denAI:'⛰️' },
    particleEffect: 'spark',
    particleConfig: { count: 25, color: '#ff6600', speedX: 0.1, speedY: -1.5, size: 2 },
    defaultBGM: 'jungle',
    forcePieceStyle: null,
  },
  {
    id: 'ink',
    name: { 'zh-TW': '水墨古城', 'zh-CN': '水墨古城', 'en': 'Ink Brush' },
    icon: '🎋',
    description: { 'zh-TW': '雅致水墨間的千年棋局' },
    cssVars: {
      '--color-bg-primary':   '#1a1210',
      '--color-bg-secondary': '#2e2018',
      '--color-board-light':  '#f5f0e0',
      '--color-board-dark':   '#e0d8c0',
      '--color-board-river':  '#3a6a90',
      '--color-board-trap':   '#8a0000',
      '--color-board-den':    '#cc2200',
    },
    terrainIcons: { river:'〰️', trapPlayer:'✖️', trapAI:'✖️', denPlayer:'穴', denAI:'穴' },
    particleEffect: null,
    defaultBGM: 'guqin',
    forcePieceStyle: 'chinese',  // 水墨風強制使用中文棋子
  },
];
```

### P4.4 地圖隨機選取邏輯

```javascript
class MapManager {
  constructor() {
    this.currentMap = null;
    this.allMaps = MAP_THEMES;
  }
  
  /** 隨機選取一張地圖（五選一，均等機率） */
  selectRandom() {
    const idx = Math.floor(Math.random() * this.allMaps.length);
    return this.allMaps[idx];
  }
  
  /** 套用地圖主題至頁面 */
  applyTheme(mapTheme) {
    this.currentMap = mapTheme;
    
    // 1. 注入 CSS 變數
    const root = document.documentElement;
    Object.entries(mapTheme.cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    
    // 2. 套用地圖 class（供特殊 CSS 使用）
    document.body.className = `map--${mapTheme.id}`;
    
    // 3. 啟動粒子效果
    if (mapTheme.particleEffect) {
      particleSystem.start(mapTheme.particleEffect, mapTheme.particleConfig);
    } else {
      particleSystem.stop();
    }
    
    // 4. 切換 BGM（若用戶設定不為「無」）
    if (settings.bgmTheme !== 'none') {
      audioManager.playBGM(mapTheme.defaultBGM);
    }
    
    // 5. 若地圖強制指定棋子風格
    if (mapTheme.forcePieceStyle) {
      this._originalPieceStyle = settings.pieceStyle;
      applyPieceStyle(mapTheme.forcePieceStyle);
    }
    
    // 6. 更新地形圖示
    updateTerrainIcons(mapTheme.terrainIcons);
  }
  
  /** 遊戲結束後清除地圖覆蓋 */
  clearTheme() {
    const root = document.documentElement;
    // 清除所有地圖覆蓋的 CSS 變數
    MAP_THEMES[0].cssVars && Object.keys(MAP_THEMES[0].cssVars).forEach(key => {
      root.style.removeProperty(key);
    });
    // 恢復棋子風格
    if (this._originalPieceStyle) {
      applyPieceStyle(this._originalPieceStyle);
    }
    particleSystem.stop();
    document.body.className = '';
  }
}

// 開始遊戲時呼叫
function startGame() {
  const chosenMap = mapManager.selectRandom();
  mapManager.applyTheme(chosenMap);
  
  // 顯示地圖名稱 Toast（0.5s 後淡出）
  showMapNameToast(chosenMap);
  
  // 初始化棋盤...
  initBoard();
}
```

### P4.5 地圖名稱入場提示（Toast）

開始遊戲時，顯示本局地圖名稱提示 2 秒：

```
┌──────────────────────┐
│  🧊  雪原凍土         │
│  本局地圖             │
└──────────────────────┘
（從上方滑入，2秒後淡出）
```

```css
.map-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-80px);
  background: rgba(0,0,0,0.75);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: var(--fs-body-lg);
  font-family: var(--font-title);
  backdrop-filter: blur(4px);
  z-index: 200;
  animation: mapToastAnim 2.5s ease forwards;
}

@keyframes mapToastAnim {
  0%   { transform: translateX(-50%) translateY(-80px); opacity: 0; }
  15%  { transform: translateX(-50%) translateY(0);     opacity: 1; }
  75%  { transform: translateX(-50%) translateY(0);     opacity: 1; }
  100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
}
```

### P4.6 設定畫面地圖預覽（新增）

在設定畫面新增「地圖預覽」區塊，讓用戶可以查看各地圖樣貌，並可設定**偏好地圖**或保持「隨機」：

```
┌──────────────────────────────────────┐
│  🗺️ 地圖設定                          │
│                                      │
│  出現方式：                           │
│  ● 每局隨機     ○ 固定地圖           │
│                                      │
│  地圖預覽（點擊可選為固定地圖）：      │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │ 🌿 │ │ 🧊 │ │ 🏜️ │              │
│  │叢林│ │凍土│ │沙漠│              │
│  └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐                     │
│  │ 🌋 │ │ 🎋 │                     │
│  │火山│ │水墨│                     │
│  └────┘ └────┘                     │
└──────────────────────────────────────┘
```

新增設定欄位：

```javascript
// DEFAULT_SETTINGS 新增
mapMode: 'random',    // 'random' | 'fixed'
fixedMapId: 'classic' // 固定地圖時使用
```

```javascript
// 選取地圖邏輯更新
function selectMap() {
  if (settings.mapMode === 'fixed') {
    return MAP_THEMES.find(m => m.id === settings.fixedMapId) || MAP_THEMES[0];
  }
  return mapManager.selectRandom();
}
```

### P4.7 熔岩河流特殊動畫

熔岩地圖的河流格需要不同於水波的動畫效果：

```css
/* 熔岩流動效果（只在 map--volcanic 下生效） */
.map--volcanic .cell--river {
  background: linear-gradient(135deg, #ff4400, #cc2200, #ff6600);
  background-size: 200% 200%;
  animation: lavaFlow 3s ease-in-out infinite;
}

@keyframes lavaFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 熔岩棋子邊框發光 */
.map--volcanic .piece {
  filter: drop-shadow(0 0 4px #ff4400);
}
```

### P4.8 地圖相關測試要點

- [ ] 五張地圖各自的 CSS 變數正確套用，不互相污染
- [ ] 隨機選取在長時間遊玩後分佈均勻（5 局內各圖應各出現）
- [ ] 水墨地圖強制中文棋子，結束後恢復用戶原設定
- [ ] 地圖粒子效果在低效能裝置（Android 舊機）不影響操作流暢度
- [ ] 地圖 Toast 不遮擋操作（2.5s 後消失）
- [ ] 設定中固定地圖功能，重新整理後維持選擇
- [ ] 所有地圖在行動裝置上對比度符合 WCAG AA 標準

---

## 版本歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0 | 2026-05-06 | 初始規格 |
| v1.1 | 2026-05-06 | P1 棋盤邊界修正；P2 棋子識別強化；P3 設定未儲存恢復；P4 新增 4 張地圖 |

---

*本補丁規格應與 v1.0 主規格書合併閱讀。實作時以本補丁內容覆蓋 v1.0 的對應章節。*
