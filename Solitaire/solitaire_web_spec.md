# 🃏 WEB 版撲克牌接龍（Klondike Solitaire）完整規格書

**文件版本：** v1.0.0  
**撰寫日期：** 2026-04-28  
**文件狀態：** Draft  
**適用平台：** Web（桌面優先，支援行動裝置響應式）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [遊戲規則](#3-遊戲規則)
4. [畫面設計規格](#4-畫面設計規格)
   - 4.1 主畫面（Main Menu）
   - 4.2 遊戲畫面（Game Board）
   - 4.3 設定畫面（Settings）
   - 4.4 排行榜畫面（Leaderboard）
   - 4.5 暫停選單（Pause Menu）
   - 4.6 勝利畫面（Win Screen）
   - 4.7 失敗 / 提示畫面
5. [UI 元件規格](#5-ui-元件規格)
6. [遊戲邏輯規格](#6-遊戲邏輯規格)
7. [音效系統](#7-音效系統)
8. [動畫系統](#8-動畫系統)
9. [資料儲存](#9-資料儲存)
10. [鍵盤與無障礙](#10-鍵盤與無障礙)
11. [行動裝置支援](#11-行動裝置支援)
12. [效能要求](#12-效能要求)
13. [錯誤處理](#13-錯誤處理)
14. [版本規劃](#14-版本規劃)
15. [附錄：資料結構定義](#15-附錄資料結構定義)

---

## 1. 專案概覽

### 1.1 產品定義

WEB 版撲克牌接龍是一款以瀏覽器為平台、無需安裝的單人紙牌策略遊戲。採用經典 Klondike Solitaire 規則，提供流暢的拖曳互動、完整的音效回饋、計時計分系統，以及精緻的視覺主題。

### 1.2 目標使用者

| 族群 | 描述 |
|------|------|
| 休閒玩家 | 利用零碎時間享受益智遊戲，不需深度策略 |
| 懷舊玩家 | Windows 舊版接龍愛好者，追求熟悉感 |
| 競技玩家 | 追求最短時間、最高分紀錄的挑戰者 |
| 行動用戶 | 習慣以手機/平板觸控操作的使用者 |

### 1.3 核心功能一覽

- 完整 Klondike Solitaire 遊戲邏輯（Draw-1 / Draw-3 模式）
- 主畫面、遊戲畫面、設定、排行榜等多畫面系統
- 拖曳（Drag & Drop）與點擊（Click-to-move）雙操作模式
- 即時計時器與計分系統
- 音效（音樂背景 + 互動音效）與靜音切換
- 無限 Undo（悔棋）功能
- 自動完成（Auto-Complete）偵測
- 3 種視覺主題（Classic / Dark / Retro）
- 本地排行榜（LocalStorage）
- 響應式設計（RWD），支援桌機、平板、手機
- 鍵盤快捷鍵支援
- 儲存局面、繼續遊戲功能

---

## 2. 技術架構

### 2.1 技術選型

| 層面 | 技術 / 工具 |
|------|------------|
| 開發語言 | HTML5、CSS3、Vanilla JavaScript（ES2022+） |
| 模組系統 | ES Modules（`import/export`） |
| 渲染方式 | DOM + CSS Transform（不使用 Canvas） |
| 音效 | Web Audio API + Howler.js（音效管理） |
| 動畫 | CSS Transition / Animation + requestAnimationFrame |
| 儲存 | localStorage（遊戲狀態 + 設定 + 排行榜） |
| 構建工具 | Vite（可選，支援純靜態部署） |
| 樣式預處理 | CSS Custom Properties（CSS 變數，無需預處理器） |
| 測試框架 | Vitest（單元測試遊戲邏輯） |

### 2.2 目錄結構

```
solitaire/
├── index.html                  # 入口頁面
├── style/
│   ├── base.css                # 重置樣式、CSS 變數
│   ├── layout.css              # 全域版型
│   ├── components.css          # 元件樣式（按鈕、卡片等）
│   ├── screens/
│   │   ├── menu.css            # 主畫面
│   │   ├── game.css            # 遊戲畫面
│   │   ├── settings.css        # 設定畫面
│   │   └── leaderboard.css     # 排行榜
│   └── themes/
│       ├── classic.css         # 經典主題
│       ├── dark.css            # 深色主題
│       └── retro.css           # 復古主題
├── src/
│   ├── main.js                 # 應用程式入口
│   ├── router.js               # 畫面路由管理
│   ├── state/
│   │   ├── gameState.js        # 遊戲狀態管理（單一真相來源）
│   │   ├── settingsState.js    # 設定狀態
│   │   └── historyState.js     # Undo 歷史堆疊
│   ├── game/
│   │   ├── deck.js             # 牌組生成與洗牌
│   │   ├── rules.js            # 遊戲規則驗證
│   │   ├── scoring.js          # 計分邏輯
│   │   ├── autoComplete.js     # 自動完成偵測
│   │   └── solver.js           # 提示系統（合法移動偵測）
│   ├── ui/
│   │   ├── cardRenderer.js     # 卡牌渲染
│   │   ├── dragDrop.js         # 拖曳操作
│   │   ├── clickMove.js        # 點擊移動
│   │   ├── animations.js       # 動畫控制器
│   │   └── screenManager.js    # 畫面切換管理
│   ├── audio/
│   │   ├── audioManager.js     # 音效管理器
│   │   └── tracks.js           # 音效清單定義
│   └── storage/
│       ├── saveGame.js         # 遊戲儲存 / 讀取
│       └── leaderboard.js      # 排行榜 CRUD
├── assets/
│   ├── cards/
│   │   ├── classic/            # 經典牌面 SVG
│   │   ├── retro/              # 復古牌面 SVG
│   │   └── back/               # 牌背圖案 SVG
│   ├── sounds/
│   │   ├── bgm/                # 背景音樂（.mp3 + .ogg）
│   │   └── sfx/                # 音效（.mp3 + .ogg）
│   ├── icons/                  # UI 圖示（SVG）
│   └── fonts/                  # 字型檔案
└── tests/
    ├── rules.test.js
    ├── scoring.test.js
    └── deck.test.js
```

### 2.3 狀態管理架構

採用單一真相來源（Single Source of Truth）原則：

```
GameState（核心狀態）
├── deck[]              # 未翻牌的牌堆（Stock）
├── waste[]             # 廢牌堆（Waste）
├── foundations[4]      # 四個完成區（♠♥♦♣）
├── tableaus[7]         # 七列主牌區
├── score               # 目前分數
├── time                # 已用時間（秒）
├── moves               # 移牌次數
├── drawMode            # 1 或 3
└── isWon               # 是否已完成
```

---

## 3. 遊戲規則

### 3.1 牌組組成

- 標準 52 張牌（A、2–10、J、Q、K，♠♥♦♣ 各 13 張）
- 開局時洗牌並分配至七列（Tableau）
- 剩餘牌放入牌堆（Stock）

### 3.2 初始配置

| 列號（Tableau） | 牌數 | 翻面牌數 |
|----------------|------|---------|
| 第 1 列 | 1 張 | 1（最上層翻開） |
| 第 2 列 | 2 張 | 1 |
| 第 3 列 | 3 張 | 1 |
| 第 4 列 | 4 張 | 1 |
| 第 5 列 | 5 張 | 1 |
| 第 6 列 | 6 張 | 1 |
| 第 7 列 | 7 張 | 1 |

共發出 **28 張牌**，剩餘 24 張為牌堆（Stock）。

### 3.3 移牌規則

#### Tableau（主牌區）合法移動條件

- 目標牌必須比移動牌**大 1 點**（例：移動 Q 到 K）
- 目標牌與移動牌**顏色相反**（紅色 ↔ 黑色）
  - 紅色：♥ 紅心、♦ 方塊
  - 黑色：♠ 黑桃、♣ 梅花
- K 可移至**空列**
- 可一次移動整疊翻開的牌組（面朝上的連續合法序列）

#### Foundation（完成區）合法移動條件

- 每個完成區對應一種花色
- 必須從 A 開始，依序 A → 2 → 3 → ... → K
- 每次只能移動一張牌
- 完成區的牌可移回 Tableau（設定選項可開關）

#### Stock / Waste（牌堆 / 廢牌堆）規則

**Draw-1 模式：**
- 點擊 Stock 翻出 1 張至 Waste
- Stock 用盡後，點擊 Stock 將 Waste 全部翻回 Stock

**Draw-3 模式：**
- 點擊 Stock 翻出 3 張至 Waste（僅最上層可使用）
- Stock 用盡後可循環，每次循環扣分

### 3.4 勝利條件

四個完成區均完成（各 13 張，A → K），遊戲結束，觸發勝利動畫。

### 3.5 提示系統

玩家點擊「提示」按鈕，系統自動高亮一個**合法移動**：
- 優先順序：Foundation > Tableau（翻牌機會大的移動）> Stock
- 每次點擊提示扣 10 分

---

## 4. 畫面設計規格

### 4.1 主畫面（Main Menu）

#### 畫面結構

```
┌─────────────────────────────────────────────────────────┐
│                     [背景：動態紙牌飄落]                  │
│                                                          │
│              🃏  SOLITAIRE  🃏                           │
│                （遊戲標題）                               │
│                                                          │
│         ┌────────────────────────┐                       │
│         │      🎮  新遊戲        │   ← 主要按鈕           │
│         └────────────────────────┘                       │
│         ┌────────────────────────┐                       │
│         │      ▶  繼續遊戲       │   ← 有儲存才顯示       │
│         └────────────────────────┘                       │
│         ┌────────────────────────┐                       │
│         │      🏆  排行榜        │                        │
│         └────────────────────────┘                       │
│         ┌────────────────────────┐                       │
│         │      ⚙️  設定          │                        │
│         └────────────────────────┘                       │
│                                                          │
│         版本 v1.0.0   |   © 2026                         │
└─────────────────────────────────────────────────────────┘
```

#### 設計細節

| 項目 | 規格 |
|------|------|
| 背景 | 深綠色撲克桌布紋理（`#1a6b3c`），動態紙牌緩慢飄落（opacity 0.3） |
| 標題字型 | 大型 Serif 字體（如 Playfair Display），金色漸層，陰影效果 |
| 按鈕樣式 | 圓角矩形，綠色實底，hover 時亮色 + scale(1.03) |
| 動畫 | 標題入場動畫（由上滑入 + 淡入），按鈕依序延遲 staggered 顯示 |
| 背景音樂 | 自動播放輕柔爵士 BGM（可靜音） |

#### 互動行為

- 點擊「新遊戲」→ 跳出難度 / 抽牌模式選擇對話框
- 點擊「繼續遊戲」→ 直接載入上次儲存局面（無儲存時按鈕隱藏）
- 點擊「排行榜」→ 滑入排行榜畫面
- 點擊「設定」→ 滑入設定畫面

---

### 4.2 遊戲畫面（Game Board）

#### 畫面佈局（桌面 1280×800）

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡ 選單]    🃏 SOLITAIRE    [⏱ 00:00]  [★ 0分]  [↩ 悔棋] [💡 提示] │  ← 頂部工具列
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Stock]  [Waste]       [ ♠ ]  [ ♥ ]  [ ♦ ]  [ ♣ ]            │  ← 上排
│                                                                   │
│  [ T1 ]  [ T2 ]  [ T3 ]  [ T4 ]  [ T5 ]  [ T6 ]  [ T7 ]       │  ← 七列 Tableau
│  （牌列垂直堆疊）                                                 │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### 元素尺寸規格

| 元素 | 寬 × 高 | 說明 |
|------|---------|------|
| 卡牌（桌面） | 80 × 112 px | 標準比例 5:7 |
| 卡牌（手機） | 52 × 73 px | 縮小版 |
| 卡牌間距（Tableau 垂直疊） | 翻面 15px / 翻開 28px | 翻開牌數字可見 |
| Foundation 槽位 | 80 × 112 px | 顯示花色符號 |
| Stock 槽位 | 80 × 112 px | 顯示牌背或「↺」 |
| 工具列高度 | 56px | 固定頂部 |

#### 頂部工具列規格

| 元素 | 位置 | 功能 |
|------|------|------|
| 選單（≡） | 左側 | 開啟暫停選單 |
| 計時器 | 中央左 | 顯示 `mm:ss`，遊戲中計時 |
| 分數 | 中央右 | 即時顯示當前分數 |
| 悔棋（↩） | 右側 | 還原上一步，可無限 undo |
| 提示（💡） | 右側 | 高亮一個合法移動 |

---

### 4.3 設定畫面（Settings）

#### 設定項目清單

```
設定
├── 遊戲設定
│   ├── 抽牌模式          ● Draw-1  ○ Draw-3
│   ├── 允許無限循環       [✓ 開關]
│   └── 完成區可移回       [✓ 開關]
├── 外觀設定
│   ├── 主題              ● Classic  ○ Dark  ○ Retro
│   ├── 牌背圖案          [圖示選擇，4 種]
│   └── 桌布顏色          [色票選擇，6 種]
├── 音效設定
│   ├── 背景音樂          [滑桿 0–100%]
│   └── 音效效果          [滑桿 0–100%]
└── 其他
    ├── 動畫速度          ● 快  ○ 正常  ○ 慢
    ├── 顯示移牌次數       [✓ 開關]
    └── 自動移至完成區     [✓ 開關]
```

#### 設定畫面互動

- 設定即時生效（無需按儲存）
- 關閉設定畫面自動儲存至 localStorage
- 提供「恢復預設值」按鈕

---

### 4.4 排行榜畫面（Leaderboard）

#### 排行榜結構

```
🏆 排行榜

  篩選：[Draw-1 ▼]  |  排序：[分數 ▼]

  排名   名稱         分數    時間      日期
  ────────────────────────────────────────────
  🥇 1   玩家1       8,250   3:42    2026/04/20
  🥈 2   玩家2       7,100   4:15    2026/04/21
  🥉 3   玩家3       6,800   5:03    2026/04/22
  ...（最多 20 筆）

                    [清除紀錄]
```

#### 排行榜規格

- 本地儲存，最多保留 **Top 20** 紀錄
- 依分數降序排列
- 可篩選 Draw-1 / Draw-3 模式
- 可排序欄位：分數、時間、日期
- 遊戲勝利後自動跳出輸入名稱對話框，再存入排行榜

---

### 4.5 暫停選單（Pause Menu）

點擊選單圖示或按 `Esc` 觸發，以半透明遮罩覆蓋遊戲畫面：

```
┌──────────────────────┐
│       ⏸ 暫停         │
├──────────────────────┤
│   ▶  繼續遊戲        │
│   🔄  重新開始        │
│   💾  儲存遊戲        │
│   ⚙️  設定            │
│   🏠  回主畫面        │
└──────────────────────┘
```

- 暫停時計時器停止
- 點擊遮罩外部不關閉（避免誤操作）

---

### 4.6 勝利畫面（Win Screen）

#### 動畫流程

1. 所有牌自動「彈跳落下」至畫面底部（標誌性勝利動畫）
2. 彩色紙花（Confetti）從畫面頂部傾瀉
3. 勝利卡片從中央放大展開：

```
┌────────────────────────────────┐
│        🎉 恭喜完成！🎉          │
│                                │
│   最終分數：    8,250 分        │
│   完成時間：    3 分 42 秒      │
│   移牌次數：    87 次           │
│   星級評分：    ⭐⭐⭐⭐⭐       │
│                                │
│  [🏆 儲存紀錄]  [🔄 再玩一次]  │
└────────────────────────────────┘
```

#### 星級評分標準（Draw-1）

| 星級 | 條件 |
|------|------|
| ⭐⭐⭐⭐⭐ | 時間 < 3 分鐘 且分數 > 8000 |
| ⭐⭐⭐⭐ | 時間 < 5 分鐘 且分數 > 6000 |
| ⭐⭐⭐ | 時間 < 8 分鐘 |
| ⭐⭐ | 時間 < 15 分鐘 |
| ⭐ | 完成遊戲 |

---

### 4.7 提示 / 無解畫面

當偵測到無可用移動時，顯示通知：

```
┌──────────────────────────────┐
│  😔 似乎沒有可用的移動了...   │
│                              │
│  [↩ 悔棋]   [🔄 重新開始]   │
└──────────────────────────────┘
```

---

## 5. UI 元件規格

### 5.1 卡牌元件

#### 卡牌視覺樣式

```
┌──────────────┐
│ A♠           │  ← 左上角：點數 + 花色
│              │
│      ♠       │  ← 中央大花色符號
│              │
│           A♠ │  ← 右下角（旋轉 180°）
└──────────────┘
```

| 狀態 | 視覺效果 |
|------|---------|
| 正常 | 白底，圓角 6px，細邊框，陰影 |
| 翻面（Face Down） | 牌背圖案（藍色菱格 / 可更換） |
| 選中（Selected） | 藍色邊框高亮 + scale(1.02) |
| 可放置（Valid Drop Target） | 綠色邊框閃爍 |
| 拖曳中（Dragging） | opacity 0.85 + 陰影加強 + 跟隨滑鼠 |
| 提示高亮 | 黃色 glow 脈衝動畫 |

#### 花色顏色規則

| 花色 | 顏色 | HEX |
|------|------|-----|
| ♠ 黑桃 | 黑色 | `#1a1a1a` |
| ♣ 梅花 | 黑色 | `#1a1a1a` |
| ♥ 紅心 | 紅色 | `#d63031` |
| ♦ 方塊 | 紅色 | `#d63031` |

### 5.2 按鈕元件

| 類型 | 用途 | 樣式 |
|------|------|------|
| Primary | 新遊戲、確認 | 綠色實底、白字、圓角 8px |
| Secondary | 取消、返回 | 灰色外框、深色字 |
| Danger | 清除紀錄、重置 | 紅色實底、白字 |
| Icon | 工具列圖示按鈕 | 透明底、hover 深色背景 |

### 5.3 對話框（Modal）元件

- 半透明黑色遮罩（`rgba(0,0,0,0.6)`）
- 卡片式容器，最大寬 420px
- 入場動畫：scale(0.9) → scale(1) + fadeIn，150ms
- 點擊遮罩關閉（可設定是否允許）
- 支援鍵盤 `Esc` 關閉

### 5.4 Toast 通知

| 類型 | 顏色 | 顯示場景 |
|------|------|---------|
| Success | 綠色 | 儲存成功、紀錄更新 |
| Info | 藍色 | 悔棋操作、提示訊息 |
| Warning | 橘色 | 無可用移動、循環提醒 |
| Error | 紅色 | 非法操作（通常靜默） |

- 顯示於畫面右下角
- 自動 3 秒後消失
- 動畫：由右滑入 → 停留 → 由右滑出

---

## 6. 遊戲邏輯規格

### 6.1 計分系統

#### Draw-1 模式計分

| 動作 | 分數變化 |
|------|---------|
| Waste → Tableau | +5 分 |
| Waste → Foundation | +10 分 |
| Tableau → Foundation | +10 分 |
| Foundation → Tableau | -15 分 |
| 翻開 Tableau 牌 | +5 分 |
| 使用提示（每次） | -10 分 |
| 時間獎勵（勝利時） | +`max(0, (700,000 / 時間秒數))` |

#### Draw-3 模式計分

| 動作 | 分數變化 |
|------|---------|
| Waste → Tableau | +5 分 |
| Waste → Foundation | +10 分 |
| Tableau → Foundation | +10 分 |
| Foundation → Tableau | -15 分 |
| 每次循環 | -20 分 |
| 時間超過 30 秒後 | 每 10 秒 -2 分 |

- 分數最低為 0（不為負數）
- 分數即時顯示於工具列

### 6.2 洗牌算法

使用 **Fisher-Yates Shuffle**（現代版本）：

```javascript
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
```

### 6.3 Undo（悔棋）系統

- 採用**命令模式（Command Pattern）**
- 每次移動前將完整 GameState 快照（Deep Clone）推入歷史堆疊
- 點擊悔棋彈出堆疊並還原狀態
- 無限次 Undo，不限制步數
- 悔棋扣分：每次 -15 分（可在設定關閉扣分）
- 歷史堆疊最多保留 100 步（防止記憶體過度使用）

### 6.4 自動完成（Auto-Complete）

**觸發條件：** 所有牌均已翻開（Tableau 無翻面牌、Stock 為空）

**行為：**
1. 顯示「自動完成」按鈕
2. 玩家確認後，系統自動逐張將牌移至 Foundation
3. 每張移動間隔 150ms（有動畫）
4. 完成後觸發勝利畫面

### 6.5 合法移動偵測（提示系統）

提示優先順序演算法：

```
1. 檢查 Waste/Tableau 牌是否可移至 Foundation
2. 檢查 Tableau 牌是否可翻開（移動後露出翻面牌）
3. 檢查 Waste/Tableau 牌是否可移至其他 Tableau（增加翻牌機會）
4. 檢查是否可從 Stock 抽牌
5. 無可用移動 → 顯示無解提示
```

---

## 7. 音效系統

### 7.1 音效清單

#### 背景音樂（BGM）

| 檔案名稱 | 情境 | 風格 |
|---------|------|------|
| `bgm_menu.mp3` | 主畫面 | 輕柔爵士鋼琴 |
| `bgm_game_classic.mp3` | 遊戲中（Classic 主題） | 輕鬆背景音樂 |
| `bgm_game_retro.mp3` | 遊戲中（Retro 主題） | 8-bit / Chiptune |
| `bgm_win.mp3` | 勝利畫面 | 歡快慶祝 |

- 背景音樂循環播放（`loop: true`）
- 畫面切換時淡出舊 BGM（500ms）再淡入新 BGM
- 支援跨畫面音量調整

#### 互動音效（SFX）

| 事件 | 檔案 | 描述 |
|------|------|------|
| 抽牌（Stock 翻牌） | `sfx_draw.mp3` | 紙牌翻動聲 |
| 卡牌放置成功 | `sfx_place.mp3` | 輕微碰撞聲 |
| 卡牌放置失敗 | `sfx_error.mp3` | 輕微拒絕聲 |
| 移至 Foundation | `sfx_foundation.mp3` | 清脆成功音 |
| 翻開牌（Flip） | `sfx_flip.mp3` | 翻牌聲 |
| 悔棋 | `sfx_undo.mp3` | 倒轉音效 |
| 提示 | `sfx_hint.mp3` | 輕柔提示音 |
| 自動完成每張 | `sfx_auto.mp3` | 連續清脆音 |
| 勝利 | `sfx_win.mp3` | 勝利歡呼 |
| 點擊按鈕 | `sfx_click.mp3` | UI 點擊音 |
| 開啟對話框 | `sfx_modal_open.mp3` | 彈出音效 |

### 7.2 音效管理器 API

```javascript
AudioManager = {
  playSFX(name, volume = 1.0),      // 播放音效
  playBGM(name, fadeIn = 500),      // 播放背景音樂
  stopBGM(fadeOut = 500),           // 停止背景音樂
  setMasterVolume(v),               // 主音量 0–1
  setBGMVolume(v),                  // BGM 音量 0–1
  setSFXVolume(v),                  // SFX 音量 0–1
  mute(),                           // 靜音
  unmute(),                         // 取消靜音
  isMuted()                         // 回傳靜音狀態
}
```

### 7.3 格式支援

- 主要格式：`.mp3`（廣泛相容）
- 備用格式：`.ogg`（Firefox 最佳化）
- 使用 Howler.js 自動選擇最佳格式

---

## 8. 動畫系統

### 8.1 動畫清單

| 動畫名稱 | 觸發時機 | 時長 | 緩動函數 |
|---------|---------|------|---------|
| 發牌動畫 | 新遊戲開始 | 1.2s | `ease-out` |
| 卡牌移動 | 合法移動 | 180ms | `ease-in-out` |
| 卡牌翻面 | 翻開牌 | 300ms | `ease-in-out`（CSS 3D flip） |
| 無效放置彈回 | 非法拖曳 | 200ms | `spring` |
| 自動完成逐張 | Auto-Complete | 150ms/張 | `ease-out` |
| 勝利彈跳 | 遊戲勝利 | 按順序 | `cubic-bezier(0.36,0.07,0.19,0.97)` |
| Confetti | 勝利畫面 | 3s | 物理落體 |
| 提示脈衝 | 點擊提示 | 0.8s loop | `ease-in-out` |
| 畫面切換 | 換頁 | 300ms | `ease-in-out` |

### 8.2 卡牌翻面 3D 動畫

```css
.card-flip {
  transition: transform 0.3s ease-in-out;
  transform-style: preserve-3d;
}

.card-flip.flipping {
  animation: flipCard 0.3s ease-in-out;
}

@keyframes flipCard {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
}
```

- 翻面動畫 50% 時機換牌面圖片

### 8.3 勝利彈跳動畫

- 四個 Foundation 的牌依序「彈出」
- 每張牌帶有隨機水平偏移與旋轉
- 牌落到畫面底部後淡出

### 8.4 動畫速度設定

| 速度設定 | 乘數 |
|---------|------|
| 快 | ×0.5 |
| 正常 | ×1.0 |
| 慢 | ×2.0 |

所有動畫時長乘以對應乘數。

### 8.5 Reduced Motion 支援

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. 資料儲存

### 9.1 LocalStorage 鍵值結構

| 鍵值（Key） | 類型 | 描述 |
|-----------|------|------|
| `sol_settings` | JSON | 遊戲設定 |
| `sol_save_game` | JSON | 目前局面快照 |
| `sol_leaderboard_d1` | JSON Array | Draw-1 排行榜 |
| `sol_leaderboard_d3` | JSON Array | Draw-3 排行榜 |

### 9.2 儲存格式：遊戲設定

```json
{
  "drawMode": 1,
  "unlimitedDraw": true,
  "foundationMovable": true,
  "theme": "classic",
  "cardBack": "blue-diamond",
  "tableColor": "#1a6b3c",
  "bgmVolume": 0.7,
  "sfxVolume": 0.8,
  "animationSpeed": "normal",
  "showMoves": true,
  "autoFoundation": false
}
```

### 9.3 儲存格式：遊戲局面

```json
{
  "timestamp": 1714261200000,
  "drawMode": 1,
  "stock": ["AC", "2H", ...],
  "waste": ["KS"],
  "foundations": [["AH","2H"], [], [], []],
  "tableaus": [
    [{"id":"KD","faceUp":true}],
    [{"id":"5S","faceUp":false},{"id":"QH","faceUp":true}],
    ...
  ],
  "score": 150,
  "time": 145,
  "moves": 32
}
```

### 9.4 排行榜記錄格式

```json
[
  {
    "name": "玩家1",
    "score": 8250,
    "time": 222,
    "moves": 87,
    "date": "2026-04-20",
    "drawMode": 1
  }
]
```

---

## 10. 鍵盤與無障礙

### 10.1 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Space` | 從 Stock 抽牌 |
| `Ctrl+Z` | 悔棋（Undo） |
| `H` | 顯示提示 |
| `Esc` | 暫停 / 關閉對話框 |
| `N` | 新遊戲 |
| `M` | 切換靜音 |
| `Tab` | 在可操作元素間切換焦點 |
| `Enter / Space` | 確認選中元素 |

### 10.2 無障礙（Accessibility）規格

- 所有互動元素具備 `aria-label`
- 卡牌以語義化方式描述，例如：`aria-label="黑桃 A，面朝上"`
- 遊戲狀態變更透過 `aria-live` 區域播報
- 焦點管理：對話框開啟時 `focus` 移入，關閉時還原
- 色彩對比度符合 WCAG 2.1 AA 標準（`4.5:1`）
- 支援高對比模式（`prefers-contrast`）

---

## 11. 行動裝置支援

### 11.1 斷點設計

| 裝置 | 寬度範圍 | 卡牌尺寸 | 佈局 |
|------|---------|---------|------|
| 桌機 | ≥ 1024px | 80×112px | 完整 7 列橫排 |
| 平板（橫） | 768–1023px | 68×95px | 完整 7 列橫排 |
| 平板（直） | 600–767px | 60×84px | 7 列，間距縮小 |
| 手機 | < 600px | 52×73px | 7 列，最小化工具列 |

### 11.2 觸控操作

- 支援原生觸控事件（`touchstart`, `touchmove`, `touchend`）
- 長按 500ms 觸發拖曳模式
- 點擊兩下執行「自動移至最佳位置」
- 防止拖曳時頁面捲動（`preventDefault()`）
- 觸控目標最小 44×44px（符合 WCAG 觸控建議）

### 11.3 PWA 支援

```json
// manifest.json
{
  "name": "Solitaire",
  "short_name": "接龍",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a6b3c",
  "theme_color": "#1a6b3c",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- Service Worker 快取靜態資源（音效、圖片、JS、CSS）
- 支援離線遊戲
- 可加入主畫面（Add to Home Screen）

---

## 12. 效能要求

| 指標 | 目標值 |
|------|-------|
| 首次載入時間（FCP） | < 1.5 秒 |
| 首次可互動時間（TTI） | < 2.5 秒 |
| 遊戲操作回應時間 | < 16ms（60fps） |
| 記憶體使用上限 | < 100MB |
| 音效播放延遲 | < 50ms |

### 最佳化策略

- 卡牌 SVG 圖片預載入（`<link rel="preload">`）
- 音效使用 Web Audio API 預解碼（`decodeAudioData`）
- DOM 操作批次處理，避免 Layout Thrashing
- 使用 `will-change: transform` 加速拖曳動畫
- Undo 歷史堆疊使用結構共享（Structural Sharing）減少記憶體

---

## 13. 錯誤處理

### 13.1 常見錯誤情境

| 情境 | 處理方式 |
|------|---------|
| localStorage 不可用 | 停用儲存功能，提示用戶 |
| 音效載入失敗 | 靜默跳過，遊戲正常進行 |
| 遊戲存檔損毀 | 清除損壞存檔，顯示提示 |
| 非法遊戲狀態 | 顯示錯誤，提供重新開始 |
| 瀏覽器不支援 | 顯示相容性提示頁面 |

### 13.2 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|--------|---------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

---

## 14. 版本規劃

### v1.0（MVP）
- 完整遊戲邏輯（Draw-1）
- 主畫面、遊戲畫面、設定、排行榜
- 拖曳 + 點擊操作
- 基礎音效（SFX）
- 本地排行榜
- 響應式設計

### v1.1
- Draw-3 模式
- 第二、三視覺主題
- PWA 支援
- 完整鍵盤操作

### v1.2
- 背景音樂系統
- 勝利彈跳動畫精緻化
- 提示演算法優化

### v2.0（未來）
- 每日挑戰模式（固定種子牌局）
- 線上排行榜（後端 API）
- Spider Solitaire 模式
- FreeCell 模式
- 牌面自定義（上傳圖片）

---

## 15. 附錄：資料結構定義

### 牌的 ID 格式

```
格式：{點數}{花色}
點數：A, 2, 3, 4, 5, 6, 7, 8, 9, T(10), J, Q, K
花色：S(♠), H(♥), D(♦), C(♣)

範例：AS = 黑桃 A，KH = 紅心 K，TC = 梅花 10
```

### Card 物件

```typescript
interface Card {
  id: string;         // e.g. "AH"
  suit: 'S' | 'H' | 'D' | 'C';
  rank: number;       // 1(A)–13(K)
  color: 'red' | 'black';
  faceUp: boolean;
}
```

### Move 物件（用於 Undo 系統）

```typescript
interface Move {
  from: 'stock' | 'waste' | `tableau_${number}` | `foundation_${number}`;
  to: 'waste' | `tableau_${number}` | `foundation_${number}`;
  cards: Card[];
  scoreChange: number;
  timestamp: number;
}
```

### GameState 完整型別

```typescript
interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: [Card[], Card[], Card[], Card[]];
  tableaus: Card[][];
  score: number;
  time: number;
  moves: number;
  drawMode: 1 | 3;
  isWon: boolean;
  canAutoComplete: boolean;
}
```

---

*本規格書為 WEB 版撲克牌接龍完整開發規範，涵蓋功能、UI、邏輯、音效、動畫、儲存及效能各層面。如有變更請更新版本號並記錄修改摘要。*

---

**文件結束**
