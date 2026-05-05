# 中國象棋 — 純前端完整規格書

**版本**：v1.0  
**日期**：2026-05-05  
**模式**：單人 vs AI（演算法）  
**平台**：純前端（HTML5 / CSS3 / Vanilla JS），無後端依賴

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術架構](#2-技術架構)
3. [檔案結構](#3-檔案結構)
4. [畫面規格](#4-畫面規格)
5. [遊戲規則與棋子邏輯](#5-遊戲規則與棋子邏輯)
6. [AI 演算法規格](#6-ai-演算法規格)
7. [音樂與音效規格](#7-音樂與音效規格)
8. [設定系統](#8-設定系統)
9. [RWD 行動裝置規格](#9-rwd-行動裝置規格)
10. [資料結構與狀態管理](#10-資料結構與狀態管理)
11. [動畫與視覺效果](#11-動畫與視覺效果)
12. [無障礙設計](#12-無障礙設計)
13. [效能要求](#13-效能要求)
14. [開發里程碑](#14-開發里程碑)

---

## 1. 專案概覽

### 1.1 目標
打造一款可在所有主流瀏覽器及行動裝置上流暢運行的中國象棋單頁應用，玩家以紅方對戰 AI（黑方），搭配沉浸式音效與背景音樂，提供完整的傳統棋局體驗。

### 1.2 核心功能清單

| 功能 | 描述 |
|------|------|
| 遊戲對局 | 玩家（紅）vs AI（黑），遵循完整象棋規則 |
| AI 難度 | 簡單 / 普通 / 困難（三級可選） |
| 主畫面 | 大字體選單、精美背景 |
| 設定頁面 | 音樂音效開關、AI 難度、棋盤主題、語言 |
| 音樂系統 | 背景音樂循環播放 |
| 音效系統 | 落子、吃子、將軍、勝負音效 |
| 行動裝置 | 觸控支援、RWD 自適應棋盤 |
| 遊戲紀錄 | 步數顯示、悔棋功能（單步） |
| 計時器 | 每方局時顯示（可選） |

---

## 2. 技術架構

### 2.1 技術選型

```
語言：HTML5 + CSS3 + Vanilla JavaScript (ES6+)
無任何外部框架依賴（純前端，可直接開啟 index.html 執行）
音訊：Web Audio API + HTML5 Audio Element
儲存：localStorage（設定持久化）
字型：Google Fonts（Noto Serif TC — 支援繁體中文）
```

### 2.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

### 2.3 模組劃分

```
main.js          — 入口、畫面切換、事件總控
game.js          — 遊戲狀態、回合管理、勝負判斷
board.js         — 棋盤渲染、座標轉換、高亮顯示
pieces.js        — 棋子定義、移動規則驗證
ai.js            — AI 核心（Minimax + Alpha-Beta）
audio.js         — 音樂與音效管理
settings.js      — 設定讀寫、UI 控制
animation.js     — 動畫效果
```

---

## 3. 檔案結構

```
chinese-chess/
├── index.html
├── css/
│   ├── reset.css
│   ├── main.css          # 全域樣式、CSS 變數
│   ├── screens.css       # 各畫面樣式
│   ├── board.css         # 棋盤與棋子樣式
│   └── responsive.css    # RWD 斷點
├── js/
│   ├── main.js
│   ├── game.js
│   ├── board.js
│   ├── pieces.js
│   ├── ai.js
│   ├── audio.js
│   ├── settings.js
│   └── animation.js
├── assets/
│   ├── sounds/
│   │   ├── bgm_main.mp3       # 主畫面背景音樂
│   │   ├── bgm_game.mp3       # 對局背景音樂
│   │   ├── sfx_move.mp3       # 一般落子音
│   │   ├── sfx_capture.mp3    # 吃子音
│   │   ├── sfx_check.mp3      # 將軍提示音
│   │   ├── sfx_win.mp3        # 勝利音效
│   │   ├── sfx_lose.mp3       # 失敗音效
│   │   └── sfx_select.mp3     # 選子音效
│   ├── images/
│   │   ├── board_classic.svg  # 傳統棋盤
│   │   ├── board_dark.svg     # 暗色棋盤
│   │   └── bg_main.jpg        # 主畫面背景
│   └── fonts/                 # 備用離線字型
└── README.md
```

---

## 4. 畫面規格

### 4.1 畫面流程圖

```
[主畫面]
    │
    ├─→ [開始遊戲] → [難度選擇] → [對局畫面] → [勝負彈窗] → [主畫面]
    │
    ├─→ [設定]     → [設定畫面] → [主畫面]
    │
    └─→ [規則說明] → [規則畫面] → [主畫面]
```

---

### 4.2 主畫面（Main Screen）

#### 佈局
- 全螢幕背景圖（古典棋盤紋理或水墨風格）
- 半透明遮罩層，增加可讀性
- 垂直置中排列所有元素

#### 元素規格

| 元素 | 規格 |
|------|------|
| 遊戲標題「中國象棋」 | 字體：Noto Serif TC，字級 **56px**（桌機）/ **40px**（手機），字重 700，金色漸層 `#D4A017 → #FFD700` |
| 副標「單人 vs AI」 | 字級 **22px** / **18px**，淺金色 `#C8A96E`，letter-spacing 0.2em |
| 開始遊戲按鈕 | 寬 280px / 高 64px，字級 **24px**，紅色主題 `#C0392B`，hover 有光暈效果 |
| 設定按鈕 | 寬 280px / 高 64px，字級 **24px**，深棕邊框 |
| 規則說明按鈕 | 寬 280px / 高 64px，字級 **24px**，深棕邊框 |
| 版本號 | 右下角固定，字級 **14px**，半透明白色 |
| 音樂切換圖示 | 左下角，32px 圖示按鈕，點擊切換主畫面 BGM |

#### CSS 變數定義（主題）

```css
:root {
  /* 字體 */
  --font-primary: 'Noto Serif TC', serif;
  --font-size-title: clamp(36px, 8vw, 56px);
  --font-size-subtitle: clamp(16px, 3vw, 22px);
  --font-size-btn: clamp(18px, 3.5vw, 24px);
  --font-size-ui: clamp(14px, 2.5vw, 18px);
  --font-size-small: clamp(12px, 2vw, 14px);

  /* 顏色 */
  --color-gold-light: #FFD700;
  --color-gold-dark: #D4A017;
  --color-red-primary: #C0392B;
  --color-red-hover: #E74C3C;
  --color-board-bg: #DEB887;
  --color-board-line: #8B4513;
  --color-piece-red: #CC0000;
  --color-piece-black: #1A1A1A;
  --color-highlight: rgba(255, 215, 0, 0.5);
  --color-valid-move: rgba(0, 200, 100, 0.4);
  --color-last-move: rgba(100, 180, 255, 0.35);

  /* 間距 */
  --board-padding: clamp(12px, 3vw, 24px);
  --btn-gap: clamp(12px, 2.5vw, 20px);
}
```

---

### 4.3 難度選擇畫面（Difficulty Screen）

- 標題「選擇難度」，字級 **36px**
- 三個大型選項卡：

| 難度 | 說明文字 | 顏色標示 |
|------|----------|----------|
| 簡單 🟢 | 適合初學者，AI 搜尋深度 2 | 綠色邊框 |
| 普通 🟡 | 標準對局體驗，搜尋深度 4 | 黃色邊框 |
| 困難 🔴 | 挑戰強力 AI，搜尋深度 6 | 紅色邊框 |

- 每個選項卡大小：寬 **260px** / 高 **120px**（桌機），手機為橫向滿版
- 選項標題字級 **28px**，說明文字 **16px**
- 返回按鈕固定於左上角

---

### 4.4 對局畫面（Game Screen）

#### 整體佈局（桌機 — 橫向）

```
┌─────────────────────────────────────────────────┐
│  [黑方資訊列]  名稱 | 計時器 | 難度標示          │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│   棋盤區域       │   側邊欄                     │
│  （主要面積）    │   - 步數記錄列表              │
│                  │   - 悔棋按鈕                 │
│                  │   - 投降按鈕                 │
│                  │   - 設定圖示                 │
├──────────────────┴──────────────────────────────┤
│  [紅方資訊列]  玩家 | 計時器                    │
└─────────────────────────────────────────────────┘
```

#### 整體佈局（手機 — 直向）

```
┌───────────────────────┐
│  [黑方資訊列]          │
├───────────────────────┤
│                       │
│       棋盤區域         │
│    （正方形，滿版寬）  │
│                       │
├───────────────────────┤
│  [紅方資訊列]          │
├───────────────────────┤
│  [功能按鈕列]          │
│  悔棋 │ 投降 │ 設定   │
└───────────────────────┘
```

#### 棋盤規格

| 項目 | 規格 |
|------|------|
| 棋盤格線 | 9 列 × 10 行（90 個交叉點） |
| 棋盤底色 | 象牙黃 `#F5DEB3` 或深棕（暗色主題） |
| 格線顏色 | `#8B4513` |
| 棋盤邊框 | 雙線邊框，外框較粗（4px），內格線 1.5px |
| 楚河漢界 | 中央空白帶，繪有「楚河」「漢界」文字，字級 **18px** |
| 標記圓點 | 兵、炮初始位置之斜線標記（傳統符號） |

#### 棋子規格

| 項目 | 規格 |
|------|------|
| 棋子形狀 | 圓形，有立體陰影 |
| 棋子大小 | 自適應格子大小 × 0.88 |
| 紅方字色 | `#CC0000`，邊框 `#8B0000` |
| 黑方字色 | `#1A1A1A`，邊框 `#3D2B1F` |
| 棋子底色 | 淺木色漸層 `#F5E6C8 → #D4B896` |
| 字體 | Noto Serif TC，字重 700 |
| 字級 | 棋子直徑 × 0.5（自動縮放） |

#### 棋子漢字對照

| 棋子 | 紅方 | 黑方 |
|------|------|------|
| 將/帥 | 帥 | 將 |
| 士/仕 | 仕 | 士 |
| 相/象 | 相 | 象 |
| 車 | 車 | 車 |
| 馬 | 馬 | 馬 |
| 炮 | 炮 | 炮 |
| 兵/卒 | 兵 | 卒 |

#### 對局互動狀態

| 狀態 | 視覺效果 |
|------|----------|
| 選中棋子 | 金色光暈圈，輕微縮放放大 1.05× |
| 可移動格子 | 半透明綠色圓點 |
| 可吃子格子 | 半透明紅色環形標示於目標棋子 |
| 最後一步（起點/終點） | 淡藍色方形高亮背景 |
| 將軍提示 | 被將帥閃爍紅色警示（0.5s 間隔） |
| AI 思考中 | 棋盤半透明遮罩 + 旋轉加載圖示 + 「AI 思考中…」文字 |

#### 玩家資訊列規格

| 元素 | 規格 |
|------|------|
| 玩家名稱 | 字級 **22px**（桌機）/ **18px**（手機） |
| 計時器 | 字級 **28px**（桌機）/ **22px**（手機），等寬字型 |
| 輪到誰 | 當前回合方左側出現「▶」箭頭 + 背景高亮 |

#### 步數記錄列規格（側邊欄 / 手機底部展開）

- 每條記錄格式：`步數. 棋子 從位置 → 到位置`（例：`1. 炮 b3 → b8`）
- 字級 **16px**，可捲動，最多顯示 20 步（超過自動捲到最新）
- 紅方記錄字色 `#CC0000`，黑方記錄字色 `#333`

---

### 4.5 設定畫面（Settings Screen）

**所有設定項目字體大小最小 18px，選項標籤最小 20px**

| 設定項目 | 元件類型 | 選項 |
|----------|----------|------|
| 背景音樂 | Toggle 開關 | 開 / 關 |
| 音效 | Toggle 開關 | 開 / 關 |
| 音量 | 滑桿 (Slider) | 0–100% |
| AI 難度 | Radio 三選一 | 簡單 / 普通 / 困難 |
| 棋盤主題 | 縮圖選擇器 | 傳統 / 暗色 |
| 棋子風格 | 縮圖選擇器 | 傳統圓形 / 扁平 |
| 顯示計時器 | Toggle 開關 | 開 / 關 |
| 顯示合法步驟 | Toggle 開關 | 開 / 關（輔助初學者） |
| 重置設定 | 按鈕 | 恢復預設 |

Toggle 開關尺寸：寬 **60px** / 高 **32px**，字級 **20px**  
滑桿高度：**8px**，拖動把手 **28px**

---

### 4.6 勝負結果彈窗（Result Modal）

| 元素 | 規格 |
|------|------|
| 遮罩背景 | 半透明黑色 `rgba(0,0,0,0.7)` |
| 彈窗大小 | 380px × 300px（手機 90vw × auto） |
| 標題 | 「🎉 您獲勝了！」或「😞 AI 獲勝」，字級 **36px** |
| 副標 | 「共 XX 步，耗時 XX:XX」，字級 **20px** |
| 再玩一次按鈕 | 字級 **22px**，紅色主題 |
| 回主畫面按鈕 | 字級 **22px**，深棕邊框 |
| 進場動畫 | 從 scale(0.7) 至 scale(1)，時長 0.3s，easing: cubic-bezier(.34,1.56,.64,1) |

---

### 4.7 規則說明畫面（Rules Screen）

- 分頁式呈現（標籤：基本規則 / 棋子移動 / 特殊規則）
- 每段說明字級最小 **18px**
- 棋子移動示意圖以 SVG 繪製，每個棋子一張圖
- 返回按鈕固定頂部

---

## 5. 遊戲規則與棋子邏輯

### 5.1 棋盤座標系

```
  0 1 2 3 4 5 6 7 8   ← col（列，0–8）
0 . . . . . . . . .
1 . . . . . . . . .
2 . . . . . . . . .
3 . . . . . . . . .
4 ─ ─ 楚河漢界 ─ ─
5 . . . . . . . . .
6 . . . . . . . . .
7 . . . . . . . . .
8 . . . . . . . . .
9 . . . . . . . . .
↑ row（行，0–9）
```

黑方初始佔 row 0–4，紅方初始佔 row 5–9

### 5.2 各棋子初始位置

**黑方（row 0 起）**

| 棋子 | 座標 (row, col) |
|------|-----------------|
| 車 | (0,0), (0,8) |
| 馬 | (0,1), (0,7) |
| 象 | (0,2), (0,6) |
| 士 | (0,3), (0,5) |
| 將 | (0,4) |
| 炮 | (2,1), (2,7) |
| 卒 | (3,0),(3,2),(3,4),(3,6),(3,8) |

**紅方（row 9 起，對稱）**

| 棋子 | 座標 (row, col) |
|------|-----------------|
| 車 | (9,0), (9,8) |
| 馬 | (9,1), (9,7) |
| 相 | (9,2), (9,6) |
| 仕 | (9,3), (9,5) |
| 帥 | (9,4) |
| 炮 | (7,1), (7,7) |
| 兵 | (6,0),(6,2),(6,4),(6,6),(6,8) |

### 5.3 棋子移動規則

#### 車（Rook）
- 直線移動，橫或縱，距離不限
- 路徑中不可有任何棋子阻擋
- 可吃任意敵子（佔其位置）

#### 馬（Knight）
- 走「日」字形，先直一格再斜一格
- **蹩馬腿**：若直走方向緊鄰有棋子（任意方），則該方向不可走
- 共最多 8 個候選格，依阻擋情況排除

#### 炮（Cannon）
- 移動時：直線移動，路徑中不可有任何棋子
- 吃子時：直線方向，路徑中**恰好只有一個**棋子作為「炮架」，才能越過並吃掉更遠的敵子

#### 象/相（Bishop）
- 走「田」字形對角（每步斜走兩格）
- **塞象眼**：若「田」字正中間有棋子，則不可走該方向
- 不可過河（象不能越過楚河漢界）

#### 士/仕（Advisor）
- 斜走一格（對角線一步）
- 只能在**九宮格**（己方 3×3 宮殿）內移動
  - 紅方九宮：row 7–9，col 3–5
  - 黑方九宮：row 0–2，col 3–5

#### 將/帥（General）
- 每次移動一格，橫或縱
- 只能在**九宮格**內移動
- **將帥對臉（飛將）規則**：若兩帥之間同列且無任何棋子，此走法不合法（或移動後形成此狀況也不合法）

#### 兵/卒（Pawn）
- 未過河：只能向前一格
- 已過河：可向前或橫走一格，不可後退

### 5.4 勝負判斷

| 條件 | 結果 |
|------|------|
| 對方帥/將被將死（無合法走法脫離被將狀態） | 當前方勝 |
| 無法動彈（困斃，所有棋子無合法步） | 當前方負 |
| 玩家點擊「投降」 | AI 勝 |

### 5.5 合法性驗證流程

```
1. 取得所選棋子所有候選目標格
2. 對每個候選格模擬移動
3. 模擬後，驗證己方帥/將是否仍在被將狀態
4. 若移動後己方被將 → 該步不合法（過濾掉）
5. 將所有合法步回傳供顯示與選擇
```

---

## 6. AI 演算法規格

### 6.1 演算法選型：Minimax + Alpha-Beta Pruning

```
- 搜尋方式：深度優先，Alpha-Beta 剪枝
- 搜尋深度：簡單=2、普通=4、困難=6
- 走法排序：啟發式預排序，提高剪枝效率
- 計算時機：玩家落子後非同步執行（Web Worker 或 requestIdleCallback）
- 思考延遲：最短 500ms（讓動畫完成），最長 5000ms（逾時強制截斷）
```

### 6.2 評估函數（Evaluation Function）

**總分 = 材料分 + 位置分 + 機動分**

#### 材料分（Material Score）

| 棋子 | 基礎分值 |
|------|----------|
| 車 | 1000 |
| 馬 | 400 |
| 炮 | 450 |
| 相/象 | 200 |
| 士/仕 | 200 |
| 兵/卒（未過河） | 100 |
| 兵/卒（已過河） | 200 |
| 帥/將 | 100000 |

#### 位置分（Position Table）
- 每種棋子有預設 10×9 的位置加權表（Piece-Square Table）
- 車控制中路加分，馬站立好位加分，兵/卒過河加分
- 帥/將躲在九宮中央加分

#### 機動分（Mobility Score）
- 計算每個棋子的合法步數，加入評分（每步 +5 分）

#### 威脅分（Threat Bonus）
- 若下一步可吃對方高價值棋子，評分額外加成

### 6.3 AI 走法排序（Move Ordering）

優先順序如下，可加速 Alpha-Beta 剪枝：

1. 吃子走法（按被吃棋子價值排序，高→低）
2. 將軍走法
3. 過河兵走法
4. 其他一般走法

### 6.4 難度差異化設計

| 難度 | 深度 | 評估誤差 | 吃子優先 |
|------|------|----------|----------|
| 簡單 | 2 | ±150（隨機噪音） | 否 |
| 普通 | 4 | ±30 | 是 |
| 困難 | 6 | 無 | 是 |

簡單難度透過在評估分中加入隨機噪音模擬不完美 AI。

### 6.5 走法快取（Transposition Table）
- 使用 Zobrist Hashing 對棋盤狀態進行雜湊
- Map 快取最近 50,000 個已計算的局面評分
- 困難模式啟用，可大幅減少重複計算

---

## 7. 音樂與音效規格

### 7.1 背景音樂（BGM）

| 檔案 | 場景 | 長度 | 格式 | 說明 |
|------|------|------|------|------|
| bgm_main.mp3 | 主畫面 | 2–3 分鐘 | MP3 128kbps | 古典絲竹樂，輕柔悠揚，循環播放 |
| bgm_game.mp3 | 對局 | 3–5 分鐘 | MP3 128kbps | 節奏稍快，有緊迫感，循環播放 |

**實作細節**
- 兩段 BGM 使用 `<audio loop>` 元素播放
- 畫面切換時 BGM 淡出（0.5s）後淡入（0.5s）
- 遊戲結果確認後 BGM 停止
- 設定中可獨立控制音量（0–1.0）

### 7.2 音效（SFX）

| 檔案 | 觸發時機 | 時長 |
|------|----------|------|
| sfx_select.mp3 | 選中己方棋子 | ~0.1s |
| sfx_move.mp3 | 落子（一般移動） | ~0.2s |
| sfx_capture.mp3 | 吃子 | ~0.3s |
| sfx_check.mp3 | 將軍 | ~0.5s |
| sfx_win.mp3 | 玩家勝利 | ~2s |
| sfx_lose.mp3 | AI 勝利 | ~2s |

**實作方式**
```javascript
// 使用 Audio Pool（避免快速連點時音效截斷）
class AudioPool {
  constructor(src, poolSize = 4) {
    this.pool = Array.from({ length: poolSize }, () => {
      const a = new Audio(src);
      a.volume = settings.sfxVolume;
      return a;
    });
    this.index = 0;
  }
  play() {
    const audio = this.pool[this.index++ % this.pool.length];
    audio.currentTime = 0;
    audio.play().catch(() => {}); // 忽略 autoplay policy 錯誤
    return audio;
  }
}
```

### 7.3 自動播放政策處理
- 頁面載入後不自動播放音樂，等待使用者第一次互動（點擊任意按鈕）後啟動 BGM
- 顯示靜音圖示提示使用者音樂狀態

---

## 8. 設定系統

### 8.1 設定儲存格式（localStorage）

```javascript
const DEFAULT_SETTINGS = {
  bgmEnabled: true,
  sfxEnabled: true,
  bgmVolume: 0.6,      // 0.0 ~ 1.0
  sfxVolume: 0.8,
  aiDifficulty: 'normal', // 'easy' | 'normal' | 'hard'
  boardTheme: 'classic',  // 'classic' | 'dark'
  pieceStyle: 'traditional', // 'traditional' | 'flat'
  showTimer: true,
  showLegalMoves: true,
  language: 'zh-TW'
};

// 讀寫
function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('chess_settings') || '{}') };
}
function saveSettings(s) {
  localStorage.setItem('chess_settings', JSON.stringify(s));
}
```

---

## 9. RWD 行動裝置規格

### 9.1 斷點設計

| 名稱 | 寬度範圍 | 棋盤大小計算 |
|------|----------|-------------|
| 手機直向 | < 480px | `min(100vw - 16px, 100vh - 200px)` |
| 手機橫向 | 480–767px | `min(70vw, 100vh - 80px)` |
| 平板 | 768–1023px | `min(60vw, 80vh)` |
| 桌機 | ≥ 1024px | `min(55vh, 600px)` |

### 9.2 觸控優化

- 棋子最小觸控區域：44×44px（iOS HIG 建議）
- 使用 `touchstart` 代替 `mousedown`，`touchend` 代替 `mouseup`
- 滑動手勢不觸發棋子選取（超過 10px 位移視為捲頁）
- 防止頁面縮放（`user-scalable=no`）於遊戲畫面
- 棋子按下後 100ms 高亮（避免誤觸）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 9.3 手機版特殊佈局

- 步數記錄折疊為底部可展開面板（向上滑入）
- 功能按鈕固定於棋盤正下方，每個按鈕最小高度 **52px**
- 設定畫面使用全螢幕模態（bottom sheet 滑入動畫）
- 橫向模式自動偵測並提示旋轉（可忽略，佈局重排為左右）

### 9.4 iOS Safari 特殊處理

```css
/* 避免底部工具列遮擋 */
.game-screen {
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
}

/* 避免 iOS bounce scroll */
body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
```

---

## 10. 資料結構與狀態管理

### 10.1 棋盤狀態

```javascript
// 棋子物件
const PieceType = {
  GENERAL: 'general', ADVISOR: 'advisor', BISHOP: 'bishop',
  KNIGHT: 'knight', ROOK: 'rook', CANNON: 'cannon', PAWN: 'pawn'
};

// 每個棋子
class Piece {
  constructor(type, side, row, col) {
    this.type = type;     // PieceType
    this.side = side;     // 'red' | 'black'
    this.row = row;
    this.col = col;
    this.id = `${side}_${type}_${row}_${col}`; // 唯一識別碼
  }
}

// 棋盤狀態（10×9 二維陣列，null 表示空格）
// board[row][col] = Piece | null
class GameState {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(9).fill(null));
    this.currentTurn = 'red';     // 'red' | 'black'
    this.moveHistory = [];        // 走法紀錄
    this.capturedPieces = [];     // 已吃棋子
    this.isCheck = false;         // 是否被將
    this.status = 'playing';      // 'playing' | 'red_win' | 'black_win' | 'draw'
    this.moveCount = 0;
    this.timer = { red: 0, black: 0 };
  }
}

// 走法紀錄物件
class Move {
  constructor(piece, fromRow, fromCol, toRow, toCol, capturedPiece = null) {
    this.piece = piece;
    this.from = { row: fromRow, col: fromCol };
    this.to = { row: toRow, col: toCol };
    this.captured = capturedPiece;
    this.timestamp = Date.now();
  }
}
```

### 10.2 事件系統

```
GameEvents:
  - PIECE_SELECTED(piece, legalMoves)
  - PIECE_MOVED(move)
  - PIECE_CAPTURED(piece)
  - CHECK(side)
  - GAME_OVER(winner, reason)
  - AI_THINKING_START
  - AI_THINKING_END(move)
  - UNDO_MOVE(move)
```

---

## 11. 動畫與視覺效果

### 11.1 棋子移動動畫

```
- 起點棋子消失（opacity 1→0，scale 1→1.15，時長 80ms）
- 終點棋子出現（opacity 0→1，scale 1.15→1，時長 150ms）
- 或：使用絕對定位，棋子沿直線平滑飛行（translate，時長 220ms，ease-out）
```

### 11.2 吃子動畫

```
- 被吃棋子：搖晃（震盪 keyframes）→ 縮小消失（scale 1→0，時長 200ms）
- 音效同步播放
```

### 11.3 將軍提示動畫

```css
@keyframes check-flash {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 50, 50, 0); }
  50% { box-shadow: 0 0 0 12px rgba(220, 50, 50, 0.7); }
}
.piece.in-check {
  animation: check-flash 0.5s ease-in-out infinite;
}
```

### 11.4 主畫面進場動畫

```
- 標題：從上 translateY(-30px) → 0，opacity 0→1，delay 0s，時長 0.6s
- 副標：translateY(-20px) → 0，delay 0.15s
- 按鈕依序：translateY(20px) → 0，delay 0.1s 間隔（stagger）
```

### 11.5 頁面切換動畫

```
離場：opacity 1→0，translateX(0→-30px)，時長 0.25s
進場：opacity 0→1，translateX(30px→0)，時長 0.25s
```

---

## 12. 無障礙設計

| 項目 | 規格 |
|------|------|
| 顏色對比 | 所有文字對比比率 ≥ 4.5:1（WCAG AA） |
| 棋子辨識 | 紅黑方除顏色外，可開啟「符號模式」以形狀區分 |
| 字體大小 | 全域基礎字級 16px，UI 元素最小 18px，主標題 36px+ |
| 觸控目標 | 最小 44×44px |
| 螢幕閱讀器 | 重要動作有 aria-label，棋盤狀態有 aria-live region |

---

## 13. 效能要求

| 指標 | 目標值 |
|------|--------|
| 首次載入時間 | < 2 秒（4G 網路） |
| 棋盤渲染 FPS | 穩定 60 FPS |
| AI 回應時間（普通難度） | < 2 秒 |
| AI 回應時間（困難難度） | < 5 秒 |
| 總資源大小 | < 3 MB（含音效） |
| JavaScript 主執行緒佔用 | AI 計算使用 Web Worker，不阻塞 UI |

### 13.1 效能優化措施
- AI 使用 `Web Worker` 或 `setTimeout(fn, 0)` 非同步計算，不阻塞渲染
- 棋盤使用 `<canvas>` 繪製（效能優先方案）或 DOM 元素（維護性方案）
- 音效使用 `AudioPool` 預載，避免載入延遲
- 棋子 SVG 圖像可快取至 `<defs>` 重用

---

## 14. 開發里程碑

| 階段 | 工作項目 | 預估工時 |
|------|----------|----------|
| Phase 1 | 棋盤渲染、棋子顯示、座標系 | 8h |
| Phase 2 | 全棋子移動規則驗證 | 16h |
| Phase 3 | 遊戲回合、勝負判斷、UI 流程 | 8h |
| Phase 4 | AI 演算法（Minimax + Alpha-Beta） | 16h |
| Phase 5 | 音樂音效系統 | 4h |
| Phase 6 | 設定系統、localStorage | 4h |
| Phase 7 | RWD 行動裝置優化 | 8h |
| Phase 8 | 動畫與視覺打磨 | 8h |
| Phase 9 | 測試、bug 修正 | 8h |
| **合計** | | **~80h** |

---

## 附錄 A：棋盤 SVG 格線繪製邏輯

```javascript
function drawBoard(ctx, cellSize, padding) {
  // 繪製 9 條縱線（分楚河漢界斷開）
  for (let col = 0; col < 9; col++) {
    const x = padding + col * cellSize;
    // 黑方半（row 0–4）
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + 4 * cellSize);
    ctx.stroke();
    // 紅方半（row 5–9）
    ctx.beginPath();
    ctx.moveTo(x, padding + 5 * cellSize);
    ctx.lineTo(x, padding + 9 * cellSize);
    ctx.stroke();
    // 兩端邊線全段連通
    if (col === 0 || col === 8) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + 9 * cellSize);
      ctx.stroke();
    }
  }
  // 繪製 10 條橫線
  for (let row = 0; row < 10; row++) {
    const y = padding + row * cellSize;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + 8 * cellSize, y);
    ctx.stroke();
  }
  // 繪製九宮對角線
  drawPalaceDiagonals(ctx, cellSize, padding);
}
```

---

## 附錄 B：Zobrist Hashing 初始化

```javascript
// 初始化 Zobrist 表
const PIECES = 14;  // 7種棋子 × 2方
const ZOBRIST_TABLE = Array.from({ length: 10 }, () =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: PIECES }, () => Math.floor(Math.random() * 2**32))
  )
);
const ZOBRIST_TURN = Math.floor(Math.random() * 2**32);

function computeHash(board, currentTurn) {
  let hash = currentTurn === 'black' ? ZOBRIST_TURN : 0;
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c]) hash ^= ZOBRIST_TABLE[r][c][pieceIndex(board[r][c])];
  return hash;
}
```

---

*本規格書版本 v1.0，後續功能（聯機對戰、棋譜匯入匯出、ELO 系統）列為 v2.0 待定功能。*
