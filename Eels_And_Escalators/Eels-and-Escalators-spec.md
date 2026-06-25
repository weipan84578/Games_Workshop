# 🎲 鰻魚與電扶梯（Eels and Escalators）— 比奇堡桌遊 完整規格書

> 版本：v1.0.0  
> 主題：海綿寶寶 × 蛇與梯子惡搞桌遊  
> 目標平台：純前端靜態網頁（無需 build / server）

---

## 目錄

1. [專案總覽](#1-專案總覽)
2. [技術架構](#2-技術架構)
3. [資料夾結構](#3-資料夾結構)
4. [遊戲規則設計](#4-遊戲規則設計)
5. [AI 難度設計](#5-ai-難度設計)
6. [畫面設計總覽](#6-畫面設計總覽)
7. [主畫面（Home Screen）](#7-主畫面home-screen)
8. [遊戲畫面（Game Screen）](#8-遊戲畫面game-screen)
9. [說明頁面（Help Screen）](#9-說明頁面help-screen)
10. [設定頁面（Settings Screen）](#10-設定頁面settings-screen)
11. [多國語系（i18n）](#11-多國語系i18n)
12. [RWD 響應式設計](#12-rwd-響應式設計)
13. [音效與音樂系統](#13-音效與音樂系統)
14. [視覺風格系統](#14-視覺風格系統)
15. [動畫系統](#15-動畫系統)
16. [資料儲存設計](#16-資料儲存設計)
17. [效能與品質要求](#17-效能與品質要求)
18. [實作細節補充](#18-實作細節補充)

---

## 1. 專案總覽

### 1.1 產品定義

| 項目 | 說明 |
|------|------|
| 產品名稱 | 鰻魚與電扶梯（Eels and Escalators） |
| 副標題 | 比奇堡的桌遊傳說 |
| 類型 | 單人（玩家 vs AI）桌遊策略遊戲 |
| 主題 | 《海綿寶寶》宇宙風格 |
| 技術限制 | 純前端 HTML / CSS / JS，零依賴，零建置流程 |
| 進入方式 | 雙擊 `index.html` 即可開啟 |
| 支援語系 | 繁體中文、English、日本語 |
| 支援裝置 | 手機（iOS/Android）、平板、桌機瀏覽器 |

### 1.2 核心體驗目標

- **視覺**：猶如真實海底桌遊擺在眼前，擬真質感（紙板紋理、立體棋子、水泡動畫）
- **聲音**：輕快鋼琴 BGM + 高音清脆音效，充滿歡樂氣氛
- **操作**：一鍵擲骰，流暢動畫，直覺回饋
- **語言**：切換語系後全頁即時更新，無需重載

---

## 2. 技術架構

### 2.1 技術選型

```
語言：HTML5 / CSS3 / Vanilla JavaScript (ES6+)
字型：Google Fonts CDN（Nunito / Baloo 2 / Noto Sans JP / Fredoka One）
音效：Web Audio API（AudioContext）— 程式碼生成音效，無需外部音檔
BGM：Web Audio API 合成鋼琴音樂序列（無外部音檔）
儲存：localStorage（存檔 / 設定 / 語系）
圖形：純 CSS + SVG inline（棋盤、棋子、骰子動畫）
```

### 2.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

### 2.3 外部依賴清單

| 資源 | 用途 | 來源 |
|------|------|------|
| Google Fonts | Fredoka One（標題）、Nunito（內文）、Noto Sans JP（日文） | CDN |
| 無其他外部依賴 | — | — |

> ⚠️ 所有音效與 BGM 均由 Web Audio API 即時合成，不依賴任何音檔資源，確保純靜態部署。

---

## 3. 資料夾結構

```
eels-and-escalators/
│
├── index.html                  # 入口點，引入所有資源
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS 重置與基礎排版
│   │   ├── variables.css       # CSS 自訂屬性（色票、字體、間距、陰影）
│   │   └── typography.css      # 全域字體大小、字重、行距規則
│   │
│   ├── components/
│   │   ├── button.css          # 所有按鈕樣式（primary / secondary / icon）
│   │   ├── modal.css           # 彈出視窗（開場動畫、通知、確認框）
│   │   ├── dice.css            # 骰子 3D 動畫、面樣式
│   │   ├── board.css           # 棋盤 100 格樣式、鰻魚路徑、電扶梯路徑
│   │   ├── piece.css           # 棋子樣式（玩家 / AI）與移動動畫
│   │   ├── slider.css          # 音量調整滑桿
│   │   └── toggle.css          # 開關元件（語系 / 音效開關）
│   │
│   ├── screens/
│   │   ├── home.css            # 主畫面專屬樣式
│   │   ├── game.css            # 遊戲畫面專屬樣式
│   │   ├── help.css            # 說明頁面專屬樣式
│   │   └── settings.css        # 設定頁面專屬樣式
│   │
│   └── responsive/
│       ├── mobile.css          # 手機（≤ 480px）樣式覆寫
│       ├── tablet.css          # 平板（481px–1024px）樣式覆寫
│       └── desktop.css         # 桌機（≥ 1025px）樣式覆寫
│
├── js/
│   ├── core/
│   │   ├── game-engine.js      # 核心遊戲邏輯（移動、判勝、回合管理）
│   │   ├── board-data.js       # 棋盤資料（格子編號、鰻魚、電扶梯位置）
│   │   ├── dice.js             # 骰子擲出邏輯與動畫觸發
│   │   └── save-manager.js     # localStorage 存取封裝
│   │
│   ├── ai/
│   │   └── ai-engine.js        # AI 決策邏輯（簡單 / 普通 / 困難三種策略）
│   │
│   ├── audio/
│   │   ├── bgm-engine.js       # Web Audio API BGM 合成鋼琴序列
│   │   └── sfx-engine.js       # 音效合成（骰子、移動、勝利、失敗、電扶梯、鰻魚）
│   │
│   ├── i18n/
│   │   ├── i18n-manager.js     # 語系切換控制器
│   │   ├── zh-TW.js            # 繁體中文語系包
│   │   ├── en.js               # 英文語系包
│   │   └── ja.js               # 日文語系包
│   │
│   ├── ui/
│   │   ├── screen-manager.js   # 畫面切換（Home / Game / Help / Settings）
│   │   ├── board-renderer.js   # 棋盤 SVG 動態渲染
│   │   ├── piece-animator.js   # 棋子移動逐格動畫
│   │   ├── dice-animator.js    # 骰子翻滾 3D 動畫
│   │   ├── home-ui.js          # 主畫面 UI 控制
│   │   ├── game-ui.js          # 遊戲畫面 UI 控制（回合提示、分數、狀態列）
│   │   ├── help-ui.js          # 說明頁面渲染
│   │   └── settings-ui.js      # 設定頁面渲染與事件
│   │
│   └── main.js                 # 應用程式入口，初始化所有模組
│
└── assets/
    └── favicon.svg             # 網站圖示（SVG 格式，海綿寶寶泡泡主題）
```

---

## 4. 遊戲規則設計

### 4.1 棋盤配置

```
棋盤：10 × 10 共 100 格
起點：格 1（左下角）
終點：格 100（左上角，蛇形路徑）
走法：蛇形走法（奇數排由左至右，偶數排由右至左）
骰子：1 顆六面骰（點數 1–6）
玩家數：2（玩家 × 1，AI × 1）
```

### 4.2 鰻魚位置（共 6 條）

| 鰻魚編號 | 頭部（懲罰觸發格） | 尾部（傳送目的地） | 長度 |
|---------|------------------|--------------------|------|
| 🐍 E1 | 格 17 | 格 7 | 短 |
| 🐍 E2 | 格 54 | 格 34 | 中 |
| 🐍 E3 | 格 62 | 格 19 | 長 |
| 🐍 E4 | 格 64 | 格 60 | 短 |
| 🐍 E5 | 格 87 | 格 24 | 超長 |
| 🐍 E6 | 格 95 | 格 75 | 中 |

### 4.3 電扶梯位置（共 6 台）

| 電扶梯編號 | 入口（獎勵觸發格） | 出口（傳送目的地） | 升幅 |
|-----------|------------------|--------------------|------|
| 🔼 L1 | 格 4 | 格 14 | 小 |
| 🔼 L2 | 格 9 | 格 31 | 大 |
| 🔼 L3 | 格 20 | 格 38 | 中 |
| 🔼 L4 | 格 28 | 格 84 | 超大 |
| 🔼 L5 | 格 40 | 格 59 | 中 |
| 🔼 L6 | 格 51 | 格 67 | 小 |

### 4.4 回合流程

```
1. 判斷目前回合屬於玩家還是 AI
2. 若為玩家：顯示「擲骰子」按鈕，等待點擊
3. 擲骰動畫播放（0.8 秒翻滾效果）
4. 取得骰子點數（1–6）
5. 棋子逐格移動動畫（每格 120ms）
6. 判斷落點：
   a. 若為電扶梯入口 → 播放「電扶梯音效」→ 棋子滑上電扶梯動畫 → 傳送至出口
   b. 若為鰻魚頭部 → 播放「鰻魚音效」→ 棋子滑下鰻魚動畫 → 傳送至尾部
   c. 若為格 100 → 觸發勝利
   d. 其他 → 正常停留
7. 更新 UI 狀態（位置、回合數）
8. 切換回合（AI 回合自動延遲 1.2 秒後執行）
```

### 4.5 勝利條件

- 玩家或 AI 的棋子**精確落在格 100** 即獲勝
- 若骰子點數超過 100 所需步數，**不移動**（反彈規則）
- 例：目前在格 98，骰到 4 → 需要 2 步，多出 2 步 → 停在格 98

---

## 5. AI 難度設計

### 5.1 難度表

| 難度 | 骰子策略 | 特殊行為 | 延遲時間 |
|------|----------|----------|----------|
| 😊 簡單（Easy） | 完全隨機（Math.random） | 無 | 1.2–1.8 秒隨機 |
| 😐 普通（Normal） | 隨機 + 小幅加權 | 偶爾「記得」避開鰻魚 | 0.9–1.4 秒 |
| 😈 困難（Hard） | 加權隨機 + 回溯計算 | 盡可能選擇靠近電扶梯的骰值 | 0.6–1.0 秒 |

### 5.2 AI 行為詳細說明

#### 簡單（Easy）
```javascript
// 純隨機，偶爾故意走向鰻魚
function rollEasy() {
  return Math.floor(Math.random() * 6) + 1;
  // 20% 機率「錯誤判斷」移動方向
}
```

#### 普通（Normal）
```javascript
// 隨機骰子，但有 50% 機率避免明顯的鰻魚格
function rollNormal(currentPos) {
  const roll = Math.floor(Math.random() * 6) + 1;
  const landing = currentPos + roll;
  // 若落點為鰻魚頭且有替代骰值 → 50% 機率選替代值
}
```

#### 困難（Hard）
```javascript
// 嘗試所有 1–6 骰值，優先選最佳落點
function rollHard(currentPos) {
  const scores = [1,2,3,4,5,6].map(roll => {
    const landing = currentPos + roll;
    return {
      roll,
      score: calculateLandingScore(landing)
      // 電扶梯入口：+100 分
      // 鰻魚頭部：-80 分
      // 靠近電扶梯：+10 分
      // 其他：0 分
    };
  });
  // 選最高分的骰值（模擬「運氣好」但非作弊）
}
```

---

## 6. 畫面設計總覽

### 6.1 畫面列表

| 畫面 ID | 名稱 | 說明 |
|---------|------|------|
| `#screen-home` | 主畫面 | 遊戲標題 + 4 個主功能按鈕 |
| `#screen-game` | 遊戲畫面 | 棋盤 + 骰子 + 玩家資訊 |
| `#screen-help` | 說明頁面 | 規則圖示說明卡片 |
| `#screen-settings` | 設定頁面 | 音樂 / 音效 / 語系 / 顏色主題 |
| `#modal-victory` | 勝利彈窗 | 慶祝動畫 + 結果 |
| `#modal-defeat` | 失敗彈窗 | 安慰動畫 + 重來 |
| `#modal-confirm-exit` | 退出確認 | 詢問是否儲存並離開 |

### 6.2 畫面切換動畫

- 切換方式：CSS `transform: translateX()` 滑入滑出
- 持續時間：280ms
- 緩動函數：`cubic-bezier(0.4, 0, 0.2, 1)`（Material Design 標準曲線）

---

## 7. 主畫面（Home Screen）

### 7.1 視覺構成

```
┌─────────────────────────────────────┐
│  🌊 海底背景（氣泡動畫、珊瑚礁）       │
│                                     │
│   [LOGO: 鰻魚與電扶梯 標題 SVG]      │
│   [副標題：比奇堡的桌遊傳說]           │
│                                     │
│        🎮 [開始遊戲]                 │
│        ▶  [繼續遊戲]（灰色若無存檔）  │
│        ❓ [遊戲說明]                 │
│        ⚙️  [遊戲設定]                │
│                                     │
│  [語系切換：🇹🇼 中 / 🇺🇸 EN / 🇯🇵 日]  │
│  [版本號：v1.0.0]                   │
└─────────────────────────────────────┘
```

### 7.2 主畫面元素規格

#### 標題 Logo
- 字型：Fredoka One（顯示用）
- 「鰻魚與電扶梯」主標題：`font-size: clamp(2.2rem, 6vw, 4rem)` 
- 顏色：金色漸層（`#FFD700 → #FFA500`）帶黑色描邊（`text-shadow: 3px 3px 0 #1a1a1a`）
- 下方副標題：`font-size: clamp(1rem, 2.5vw, 1.5rem)`，珊瑚色（`#FF6B6B`）

#### 主選單按鈕規格

| 按鈕 | 圖示 | 顏色 | 快速鍵 |
|------|------|------|--------|
| 開始遊戲 | 🎮（SVG 骰子圖示） | 主色（海洋藍 `#00B4D8`） | Enter |
| 繼續遊戲 | ▶（SVG 播放鍵） | 綠色（`#52B788`） | C |
| 遊戲說明 | ❓（SVG 問號氣泡） | 黃色（`#FFB703`） | H |
| 遊戲設定 | ⚙️（SVG 齒輪） | 紫色（`#7B2D8B`） | S |

#### 按鈕共用樣式
```css
/* 共用按鈕規格 */
.btn-main {
  width: min(320px, 85vw);
  height: clamp(56px, 8vh, 72px);
  border-radius: 16px;
  font-family: 'Fredoka One', cursive;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  letter-spacing: 0.05em;
  border: 3px solid rgba(255,255,255,0.4);
  box-shadow: 0 6px 0 rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2);
  /* 3D 按鈕壓感效果 */
  transition: transform 80ms, box-shadow 80ms;
}
.btn-main:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0,0,0,0.3);
}
```

#### 背景動畫
- 海底漸層背景：`linear-gradient(180deg, #023E8A 0%, #0077B6 40%, #00B4D8 100%)`
- 浮動氣泡：20 個大小隨機（8px–32px）SVG 圓形，緩慢上浮（10s–25s 循環）
- 珊瑚礁裝飾：底部 SVG 插圖（珊瑚、海星、貝殼）
- 海草搖擺：底部兩側 CSS keyframe 動畫

---

## 8. 遊戲畫面（Game Screen）

### 8.1 桌機版佈局（≥ 1025px）

```
┌──────────────────────────────────────────────────────┐
│ [返回首頁 ←]    回合 #5         [⚙️ 設定]  [🔊 靜音]  │ ← 頂部狀態列（56px）
├───────────────────────────┬──────────────────────────┤
│                           │  👤 玩家                  │
│                           │  位置：格 28  🔼 電扶梯附近│
│     🎲 棋盤區域            │  ─────────────────────   │
│     （正方形，最大 600px） │  🤖 電腦（困難）           │
│                           │  位置：格 45              │
│                           │  ─────────────────────   │
│                           │  📊 回合紀錄              │
│                           │  回合 1：玩家骰到 4 → 格4  │
│                           │  回合 2：電腦骰到 6 → 格6  │
│                           │  ─────────────────────   │
│                           │  🎲 [擲 骰 子]  大按鈕    │
│                           │  （AI回合時顯示動畫圖示）  │
└───────────────────────────┴──────────────────────────┘
```

### 8.2 手機版佈局（≤ 480px）

```
┌────────────────────────┐
│ [←] 回合 #5  [🔊][⚙️]  │ ← 頂部狀態列（48px）
├────────────────────────┤
│  👤 格28  vs  🤖 格45  │ ← 玩家資訊列（36px）
├────────────────────────┤
│                        │
│     🎲 棋盤區域         │ ← 棋盤：充滿剩餘寬度
│    （正方形，100% 寬）   │   維持正方形比例
│                        │
├────────────────────────┤
│ [訊息列：玩家回合！]     │ ← 狀態訊息（44px）
├────────────────────────┤
│  🎲 [       擲骰子      ]│ ← 行動按鈕（64px 高）
└────────────────────────┘
```

> ⚠️ **重點**：行動裝置上擲骰子按鈕固定在底部，不疊在棋盤之上。棋盤佔用中間空間，底部有固定高度的操作區。

### 8.3 棋盤渲染規格

#### 棋盤繪製原則
- 棋盤以 SVG 動態生成（board-renderer.js）
- 100 格，蛇形排列，座標由 board-data.js 計算
- 每格大小：`boardSize / 10`（自適應）

#### 格子顏色交替（海洋風）
```
奇數格：珊瑚橘色（#FF9F7F）帶珊瑚礁紋理
偶數格：淺海藍（#90E0EF）帶波紋紋理
特殊格：
  - 格 1（起點）：金色 🌟
  - 格 100（終點）：彩虹漸層 🏁
  - 電扶梯入口格：亮黃色 ✨
  - 鰻魚頭部格：危險紅色 ⚠️
```

#### 電扶梯繪製
- 使用 SVG `<path>` 繪製電扶梯外框
- 顏色：銀色金屬漸層（`#C0C0C0 → #808080`）
- 帶閃亮反光效果（`<linearGradient>`）
- 兩側扶手以圓角矩形繪製

#### 鰻魚繪製
- 使用 SVG `<path>` 繪製彎曲的鰻魚身體（貝塞爾曲線）
- 顏色：紫色系漸層（`#7B2FBE → #3A0CA3`）帶鱗片紋路
- 頭部有眼睛、嘴巴細節
- 放電特效：沿身體路徑的黃色閃光動畫

#### 棋子設計

| 棋子 | 外觀 | 大小 |
|------|------|------|
| 玩家 | 海綿寶寶造型（黃色方形+眼睛，純 CSS/SVG） | 格子大小的 75% |
| AI | 章魚哥造型（紫色橢圓+觸手，純 CSS/SVG） | 格子大小的 75% |

棋子移動動畫：
```javascript
// 逐格跳躍
function animatePieceMove(piece, fromPos, toPos, onComplete) {
  const steps = Math.abs(toPos - fromPos);
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    movePieceToCell(piece, fromPos + currentStep);
    playSFX('step'); // 每格播放輕踏音效
    if (currentStep >= steps) {
      clearInterval(interval);
      onComplete();
    }
  }, 120); // 每格 120ms
}
```

### 8.4 骰子設計

- 以純 CSS 3D 製作六面骰子（`transform-style: preserve-3d`）
- 骰子面樣式：
  - 白色底 + 圓角（`border-radius: 12px`）
  - 點數：深藍色實心圓（`#003366`）
  - 3D 邊框：陰影模擬深度
- 擲骰動畫：`@keyframes roll`，隨機旋轉 X/Y/Z 軸，0.8s 後停在結果面

### 8.5 遊戲資訊面板規格

#### 玩家資訊卡

```
┌─────────────────────────┐
│  🎭 [棋子圖示]  玩家     │
│  📍 目前位置：格 45      │  ← font-size: 1.2rem
│  🎲 上一次：骰到 6       │
│  ✅ 上次：踩到電扶梯！   │
└─────────────────────────┘
```

- 卡片圓角：`12px`
- 背景：`rgba(255,255,255,0.15)` 毛玻璃效果
- 邊框：`2px solid rgba(255,255,255,0.3)`
- 當前回合玩家：卡片有發光邊框效果（`box-shadow: 0 0 15px currentColor`）

#### 回合紀錄列表
- 最多顯示最近 6 筆紀錄
- 每筆格式：`[回合N] [玩家/AI] 骰到 [N] → 格 [N] [特殊事件]`
- 新紀錄從頂部插入，舊的淡出消失

#### 擲骰子按鈕（玩家回合）
```css
.btn-roll {
  width: 100%;
  height: clamp(60px, 10vh, 80px);
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-family: 'Fredoka One';
  background: linear-gradient(135deg, #FFB703, #FB8500);
  border: 4px solid #FFD60A;
  border-radius: 20px;
  box-shadow: 0 8px 0 #7B4B00, 0 10px 30px rgba(255,183,3,0.5);
  /* 大型橘黃色骰子按鈕，搶眼且大 */
}
```

---

## 9. 說明頁面（Help Screen）

### 9.1 版面結構

```
┌────────────────────────────────────┐
│  [← 返回]    📖 遊戲說明            │
├────────────────────────────────────┤
│                                    │
│  ┌──────────┐  ┌──────────┐       │
│  │ 🎯 目標  │  │ 🎲 骰子  │       │ ← 卡片式說明，2欄（手機1欄）
│  │ 先到終點 │  │ 點1–6   │       │
│  │ 者獲勝！ │  │ 決定步數 │       │
│  └──────────┘  └──────────┘       │
│                                    │
│  ┌──────────┐  ┌──────────┐       │
│  │ ⚡ 電扶梯│  │ 🐍 鰻魚  │       │
│  │ 踩到往上 │  │ 踩到往下 │       │
│  │ 好運氣！ │  │ 倒退懲罰 │       │
│  └──────────┘  └──────────┘       │
│                                    │
│  ───── 🗺️ 棋盤示意圖 ─────        │
│  [小型棋盤圖，標示特殊格位置]       │
│                                    │
│  ───── 🤖 AI 難度說明 ─────       │
│  😊 簡單    完全隨機的電腦          │
│  😐 普通    會稍微動腦的電腦        │
│  😈 困難    精明狡猾的電腦          │
│                                    │
│  ───── 🔄 特殊規則 ─────          │
│  • 超過終點格 → 原地不動（反彈）    │
│  • 電扶梯優先於鰻魚（不會同格）     │
│                                    │
└────────────────────────────────────┘
```

### 9.2 說明卡片規格

每張說明卡片：
- 尺寸：`min(160px, 40vw)` 寬，高度自適應
- 大圖示：`font-size: 3rem`（使用 emoji 或 SVG）
- 標題：`font-size: 1.3rem`，粗體，顏色與圖示主色一致
- 內文：`font-size: 1.1rem`，行距 1.6
- 背景：對應主題色的淡色版
- 圓角：`16px`
- 陰影：`0 4px 12px rgba(0,0,0,0.15)`

---

## 10. 設定頁面（Settings Screen）

### 10.1 版面結構

```
┌────────────────────────────────────┐
│  [← 返回]    ⚙️ 遊戲設定            │
├────────────────────────────────────┤
│                                    │
│  🎵 音樂設定                        │
│  ┌──────────────────────────────┐  │
│  │ BGM 音量                      │  │
│  │ [━━━━━━━━●──] 75%            │  │
│  │                               │  │
│  │ 背景音樂  [ON ●────○ OFF]     │  │
│  └──────────────────────────────┘  │
│                                    │
│  🔊 音效設定                        │
│  ┌──────────────────────────────┐  │
│  │ 音效音量                      │  │
│  │ [━━━━━●───────] 50%          │  │
│  │                               │  │
│  │ 遊戲音效  [ON ●────○ OFF]     │  │
│  └──────────────────────────────┘  │
│                                    │
│  🌐 語系選擇                        │
│  ┌──────────────────────────────┐  │
│  │  [🇹🇼 繁體中文]  選中          │  │
│  │  [🇺🇸 English  ]              │  │
│  │  [🇯🇵 日本語   ]              │  │
│  └──────────────────────────────┘  │
│                                    │
│  🎨 顏色主題                        │
│  ┌──────────────────────────────┐  │
│  │  ● 海洋藍（預設）             │  │
│  │  ● 珊瑚橘                    │  │
│  │  ● 熱帶綠                    │  │
│  │  ● 深海紫                    │  │
│  │  ● 日落橘紅                  │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────────────────────────     │
│  [🔄 重置所有設定]  [🗑️ 清除存檔]  │
│                                    │
└────────────────────────────────────┘
```

### 10.2 設定元件規格

#### 滑桿（Volume Slider）
```css
.volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) var(--value), #ddd var(--value));
  outline: none;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
}
```

#### 開關（Toggle Switch）
```css
.toggle-switch {
  width: 64px;
  height: 32px;
  border-radius: 16px;
  /* ON 狀態：var(--color-primary) */
  /* OFF 狀態：#ccc */
  transition: background 0.25s;
}
.toggle-knob {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  transition: transform 0.25s;
}
```

#### 語系選擇器
- 三個大型按鈕（不是 radio input）
- 選中狀態：帶主色邊框 + 淡主色背景
- 未選中：灰色邊框 + 白色背景
- 點擊立即切換語系（無需確認）

#### 顏色主題圓點
- 直徑 `48px`
- 選中狀態：放大 1.2 倍 + 白色外框環
- 懸停：輕微放大 1.05 倍

### 10.3 顏色主題規格

| 主題名稱 | 主色 | 副色 | 背景 | 代碼 |
|---------|------|------|------|------|
| 海洋藍（預設） | `#00B4D8` | `#0077B6` | `#023E8A` | `ocean` |
| 珊瑚橘 | `#FF6B6B` | `#FF8E53` | `#B5153D` | `coral` |
| 熱帶綠 | `#52B788` | `#2D6A4F` | `#1B4332` | `tropical` |
| 深海紫 | `#7B2FBE` | `#5A189A` | `#240046` | `deep` |
| 日落橘紅 | `#FB8500` | `#FFB703` | `#7B1D1D` | `sunset` |

主題切換透過切換 `<html data-theme="ocean">` 屬性，CSS 變數自動套用。

---

## 11. 多國語系（i18n）

### 11.1 語系架構

```javascript
// js/i18n/zh-TW.js
const zhTW = {
  // 主畫面
  "home.title": "鰻魚與電扶梯",
  "home.subtitle": "比奇堡的桌遊傳說",
  "home.btn.start": "開始遊戲",
  "home.btn.continue": "繼續遊戲",
  "home.btn.help": "遊戲說明",
  "home.btn.settings": "遊戲設定",

  // 遊戲畫面
  "game.turn.player": "玩家回合",
  "game.turn.ai": "電腦回合",
  "game.btn.roll": "擲骰子！",
  "game.event.escalator": "⚡ 電扶梯！往上升到格 {target}！",
  "game.event.eel": "🐍 鰻魚！被拖回格 {target}！",
  "game.event.exact100": "🎯 精確到達 100 格！",
  "game.event.bounce": "🔄 超出 100 格，原地不動！",
  "game.round": "第 {n} 回合",

  // 難度
  "difficulty.easy": "簡單",
  "difficulty.normal": "普通",
  "difficulty.hard": "困難",

  // 說明頁面
  "help.title": "遊戲說明",
  "help.goal.title": "遊戲目標",
  "help.goal.desc": "先將棋子移動到第 100 格的玩家獲勝！",
  "help.dice.title": "骰子",
  "help.dice.desc": "擲出 1–6 點，決定前進步數",
  "help.escalator.title": "電扶梯",
  "help.escalator.desc": "踩到入口格，立即傳送到上方出口！",
  "help.eel.title": "鰻魚",
  "help.eel.desc": "踩到鰻魚頭，立即滑回到鰻魚尾！",

  // 設定頁面
  "settings.title": "遊戲設定",
  "settings.bgm": "背景音樂",
  "settings.sfx": "遊戲音效",
  "settings.volume.bgm": "BGM 音量",
  "settings.volume.sfx": "音效音量",
  "settings.language": "語系選擇",
  "settings.theme": "顏色主題",
  "settings.reset": "重置所有設定",
  "settings.clear_save": "清除存檔",

  // 勝敗彈窗
  "modal.victory.title": "🎉 恭喜獲勝！",
  "modal.victory.subtitle": "你比章魚哥更厲害！",
  "modal.victory.btn.again": "再玩一次",
  "modal.victory.btn.home": "回主畫面",
  "modal.defeat.title": "😢 這次輸了...",
  "modal.defeat.subtitle": "海綿寶寶下次加油！",
  "modal.defeat.btn.again": "再試一次",
  "modal.defeat.btn.home": "回主畫面",

  // 確認對話框
  "confirm.exit.title": "離開遊戲？",
  "confirm.exit.desc": "目前進度將自動儲存",
  "confirm.exit.yes": "儲存並離開",
  "confirm.exit.no": "繼續遊戲",

  // 主題名稱
  "theme.ocean": "海洋藍",
  "theme.coral": "珊瑚橘",
  "theme.tropical": "熱帶綠",
  "theme.deep": "深海紫",
  "theme.sunset": "日落橘紅",
};
```

```javascript
// js/i18n/en.js
const en = {
  "home.title": "Eels and Escalators",
  "home.subtitle": "Bikini Bottom's Legendary Board Game",
  "home.btn.start": "Start Game",
  "home.btn.continue": "Continue",
  "home.btn.help": "How to Play",
  "home.btn.settings": "Settings",
  // ... （完整英文版本）
};

// js/i18n/ja.js
const ja = {
  "home.title": "ウナギとエスカレーター",
  "home.subtitle": "ビキニボトムの伝説ボードゲーム",
  "home.btn.start": "ゲームスタート",
  "home.btn.continue": "続きから",
  "home.btn.help": "遊び方",
  "home.btn.settings": "設定",
  // ... （完整日文版本）
};
```

### 11.2 i18n 管理器

```javascript
// js/i18n/i18n-manager.js
class I18nManager {
  constructor() {
    this.currentLocale = localStorage.getItem('locale') || 'zh-TW';
    this.locales = { 'zh-TW': zhTW, 'en': en, 'ja': ja };
  }

  t(key, params = {}) {
    let str = this.locales[this.currentLocale][key] || key;
    // 支援 {target}、{n} 等模板替換
    return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
  }

  setLocale(locale) {
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
    this.applyToDOM();
  }

  applyToDOM() {
    // 掃描所有 [data-i18n] 屬性，自動更新文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    // 更新 lang 屬性（影響字型選擇）
    document.documentElement.lang = this.currentLocale;
  }
}
```

### 11.3 HTML 語系標記方式

```html
<!-- 使用 data-i18n 屬性，i18n-manager.js 自動更新 -->
<button class="btn-main" data-i18n="home.btn.start"></button>
<h2 class="screen-title" data-i18n="settings.title"></h2>

<!-- 動態插值：透過 JS 手動更新 -->
<p id="event-message"></p>
<!-- JS: document.getElementById('event-message').textContent = i18n.t('game.event.escalator', { target: 38 }); -->
```

---

## 12. RWD 響應式設計

### 12.1 斷點定義

```css
/* 定義於 css/base/variables.css */
:root {
  --bp-mobile: 480px;
  --bp-tablet: 1024px;
}

/* 手機 */
@media (max-width: 480px) { /* mobile.css */ }

/* 平板 */
@media (min-width: 481px) and (max-width: 1024px) { /* tablet.css */ }

/* 桌機 */
@media (min-width: 1025px) { /* desktop.css */ }
```

### 12.2 遊戲畫面 RWD 詳細規格

#### 棋盤尺寸計算

```javascript
// board-renderer.js
function getBoardSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw <= 480) {
    // 手機：寬度 - 2 * 16px padding，最大 vh - 200px（預留頂/底列）
    return Math.min(vw - 32, vh - 200);
  } else if (vw <= 1024) {
    // 平板：60% 寬度
    return Math.min(vw * 0.6, vh - 160);
  } else {
    // 桌機：固定區域的 60%，最大 600px
    return Math.min(600, vh - 160, vw * 0.55);
  }
}
```

#### 手機版固定底部操作區

```css
/* mobile.css */
@media (max-width: 480px) {
  .game-screen {
    display: grid;
    grid-template-rows: 48px 36px 1fr 44px 64px;
    /* 頂列 / 資訊列 / 棋盤 / 訊息列 / 操作按鈕 */
    height: 100dvh; /* dynamic viewport height */
    overflow: hidden;
  }

  .board-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* 棋盤在此區域內，不超出 */
  }

  .action-bar {
    position: static; /* 不用 fixed，使用 grid 定位 */
    padding: 8px 16px;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(8px);
  }
}
```

#### 防遮擋原則
- 手機版**絕對不使用 `position: fixed` 疊在棋盤上**
- 全部使用 CSS Grid `grid-template-rows` 切割固定高度區域
- 使用 `100dvh`（dynamic viewport height）避免手機網址列遮擋

### 12.3 字體大小 RWD

```css
/* variables.css */
:root {
  /* 使用 clamp 確保各裝置可讀 */
  --text-xs:  clamp(0.85rem, 2vw, 1rem);
  --text-sm:  clamp(1rem,   2.5vw, 1.1rem);
  --text-md:  clamp(1.1rem, 3vw,  1.3rem);
  --text-lg:  clamp(1.3rem, 3.5vw, 1.6rem);
  --text-xl:  clamp(1.6rem, 4vw,  2rem);
  --text-2xl: clamp(2rem,   5vw,  2.8rem);
  --text-3xl: clamp(2.5rem, 6vw,  4rem);
}

/* 最小字體設定（規格要求大字體） */
body {
  font-size: var(--text-md); /* 基底 ≥ 1.1rem */
}

/* 標題最小 1.3rem */
h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }

/* 按鈕最小 1.2rem */
button {
  font-size: var(--text-lg);
}
```

---

## 13. 音效與音樂系統

### 13.1 Web Audio API 架構

```javascript
// js/audio/sfx-engine.js
class SFXEngine {
  constructor() {
    this.ctx = null; // AudioContext（首次互動後初始化）
    this.gainNode = null;
    this.volume = 1.0;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = this.volume;
  }

  // 高音輕脆：骰子擲出音
  playDiceRoll() {
    // 合成白噪音 burst + 高頻衰減
    this._playNoise(0.05, 800, 2000);
  }

  // 棋子移動每步音
  playStep() {
    this._playTone(880, 0.06, 'sine'); // 高 A 音，短促
  }

  // 電扶梯啟動音
  playEscalator() {
    // 上升音階：C5→E5→G5
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.15, 'sine'), i * 100);
    });
  }

  // 鰻魚懲罰音
  playEel() {
    // 下降音階 + 電流聲
    [400, 350, 280, 220].forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.2, 'sawtooth'), i * 80);
    });
  }

  // 勝利音效
  playVictory() {
    // 快速上升音阶
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.3, 'sine'), i * 120);
    });
  }

  // 失敗音效
  playDefeat() {
    const notes = [440, 370, 311, 260];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.3, 'sine'), i * 150);
    });
  }

  _playTone(freq, duration, type = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  _playNoise(duration, minFreq, maxFreq) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    // 帶通濾波
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (minFreq + maxFreq) / 2;
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();
  }

  setVolume(v) {
    this.volume = v;
    if (this.gainNode) this.gainNode.gain.value = v;
  }
}
```

### 13.2 BGM 引擎

```javascript
// js/audio/bgm-engine.js
class BGMEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.volume = 1.0; // 預設音量
    this.sequence = []; // 鋼琴音符序列
    this.tempo = 120; // BPM
    this.baseVolume = 0.08; // 基礎音量（×5 後的調整值）
  }

  // BGM 音量為原本的 5 倍（規格第7點）
  // 透過 gainNode 的 gain.value × 5 實現
  // 基礎值設為 0.08，×5 = 0.4（避免失真）

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.baseVolume * 5 * this.volume;
    this.masterGain.connect(this.ctx.destination);
    this._buildSequence();
  }

  _buildSequence() {
    // 輕快鋼琴音樂序列（C大調）
    // 音符格式：[頻率Hz, 持續時間（拍）, 八度]
    this.sequence = [
      // 主旋律（右手）
      [523, 0.5], [659, 0.5], [784, 0.5], [880, 0.5],
      [988, 1.0], [784, 0.5], [659, 0.5],
      [523, 1.0], [440, 0.5], [523, 0.5],
      [659, 1.0], [523, 1.0],
      // 重複變奏...
    ];
  }

  play() {
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this._scheduleSequence();
  }

  stop() {
    this.isPlaying = false;
    // 淡出 0.5s
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) {
      this.masterGain.gain.value = this.baseVolume * 5 * v;
    }
  }

  _schedulePianoNote(freq, startTime, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    // 模擬鋼琴：快速 attack + 慢速 decay + sustain + release
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.type = 'triangle'; // 三角波近似鋼琴音色
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}
```

### 13.3 音效觸發清單

| 事件 | 音效方法 | 時機 |
|------|----------|------|
| 擲骰子按下 | `playDiceRoll()` | 骰子動畫開始 |
| 棋子每步移動 | `playStep()` | 每格移動時 |
| 踩到電扶梯 | `playEscalator()` | 棋子抵達電扶梯入口 |
| 踩到鰻魚 | `playEel()` | 棋子抵達鰻魚頭部 |
| 玩家勝利 | `playVictory()` | 勝利彈窗出現 |
| 玩家落敗 | `playDefeat()` | 失敗彈窗出現 |
| 按鈕點擊 | `playClick()` | 所有按鈕點擊 |
| 回合切換 | `playTurnChange()` | 玩家↔AI 回合切換 |

---

## 14. 視覺風格系統

### 14.1 CSS 自訂屬性（variables.css）

```css
:root {
  /* 主題色（會被主題覆寫） */
  --color-primary:       #00B4D8;
  --color-primary-dark:  #0077B6;
  --color-primary-light: #90E0EF;
  --color-accent:        #FFB703;
  --color-accent-dark:   #FB8500;
  --color-danger:        #FF4757;
  --color-success:       #2ED573;
  --color-bg-start:      #023E8A;
  --color-bg-end:        #0077B6;
  --color-text-primary:  #FFFFFF;
  --color-text-secondary: rgba(255,255,255,0.75);
  --color-surface:       rgba(255,255,255,0.12);
  --color-surface-hover: rgba(255,255,255,0.20);
  --color-border:        rgba(255,255,255,0.25);

  /* 字型 */
  --font-display: 'Fredoka One', 'Baloo 2', cursive;
  --font-body:    'Nunito', 'Noto Sans JP', sans-serif;

  /* 間距 */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* 圓角 */
  --radius-sm:  8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* 陰影 */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 20px currentColor;
}

/* 珊瑚橘主題 */
[data-theme="coral"] {
  --color-primary:      #FF6B6B;
  --color-primary-dark: #B5153D;
  --color-bg-start:     #7B0000;
  --color-bg-end:       #B5153D;
}
/* ... 其他主題 */
```

### 14.2 擬真效果清單

| 效果 | 實現方式 |
|------|----------|
| 紙板棋盤質感 | CSS `background-image: repeating-linear-gradient()` 細紋理 |
| 棋子立體感 | `box-shadow` 多層模擬光源 + `border` 邊緣高光 |
| 骰子 3D | `transform-style: preserve-3d` + 六面絕對定位 |
| 電扶梯金屬光澤 | SVG `<linearGradient>` 銀色漸層 |
| 鰻魚鱗片紋路 | SVG `<pattern>` 重複小菱形 |
| 水泡上浮 | `@keyframes` Y 軸偏移 + opacity 淡出 |
| 海草搖擺 | `@keyframes` rotateZ 左右搖擺 |
| 卡片毛玻璃 | `backdrop-filter: blur(8px)` + 半透明背景 |

---

## 15. 動畫系統

### 15.1 動畫清單

| 動畫名稱 | 觸發條件 | 時長 | 描述 |
|---------|---------|------|------|
| `screen-enter` | 畫面切換 | 280ms | 從右滑入 |
| `screen-exit` | 畫面切換 | 280ms | 向左滑出 |
| `dice-roll` | 擲骰子 | 800ms | 3D 骰子翻滾 |
| `piece-hop` | 棋子移動每步 | 120ms | 小跳躍（Y 軸上下） |
| `piece-escalate` | 電扶梯傳送 | 600ms | 沿電扶梯路徑滑動 |
| `piece-eel-slide` | 鰻魚傳送 | 800ms | 沿鰻魚身體下滑 |
| `celebrate` | 玩家勝利 | 2000ms | 彩色泡泡爆炸 |
| `modal-in` | 彈窗出現 | 300ms | 縮放淡入 |
| `modal-out` | 彈窗消失 | 200ms | 縮放淡出 |
| `btn-press` | 按鈕點擊 | 80ms | 下壓彈起 |
| `event-flash` | 特殊事件 | 500ms | 格子閃光 |

### 15.2 無障礙動畫

```css
/* 尊重系統減少動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 16. 資料儲存設計

### 16.1 localStorage 鍵值規格

```javascript
// js/core/save-manager.js
const SAVE_KEYS = {
  SETTINGS:    'eae_settings',    // 設定（音量、語系、主題）
  SAVE_GAME:   'eae_save',        // 遊戲進度
  STATISTICS:  'eae_stats',       // 統計（勝場/敗場）
};

// 設定結構
const defaultSettings = {
  locale:       'zh-TW',     // 語系
  theme:        'ocean',     // 顏色主題
  bgmEnabled:   true,        // BGM 開關
  sfxEnabled:   true,        // 音效開關
  bgmVolume:    0.75,        // BGM 音量 0–1
  sfxVolume:    0.80,        // 音效音量 0–1
};

// 遊戲存檔結構
const saveGame = {
  playerPos:    1,           // 玩家格位
  aiPos:        1,           // AI 格位
  currentTurn:  'player',   // 'player' | 'ai'
  round:        1,           // 回合數
  difficulty:   'normal',   // 'easy' | 'normal' | 'hard'
  log:          [],          // 最近 20 筆回合紀錄
  savedAt:      Date.now(),  // 儲存時間戳
};

// 統計結構
const statistics = {
  wins:         { easy: 0, normal: 0, hard: 0 },
  losses:       { easy: 0, normal: 0, hard: 0 },
  totalGames:   0,
  bestRound:    null,        // 最快獲勝的回合數
};
```

### 16.2 自動存檔規則

- 每次回合結束後自動存檔
- 玩家離開遊戲畫面時儲存
- 遊戲結束（勝/敗）後清除存檔
- 主畫面「繼續遊戲」按鈕：偵測 `eae_save` 是否存在

---

## 17. 效能與品質要求

### 17.1 目標效能

| 指標 | 目標值 |
|------|--------|
| 首次載入時間 | < 1.5s（無快取） |
| 動畫幀率 | 穩定 60fps |
| 總檔案大小 | < 200KB（全部資源） |
| 互動延遲 | < 50ms |

### 17.2 程式碼品質規範

- **JS 模組**：每個 `.js` 檔只輸出一個主要類別或物件
- **事件委派**：盡量使用事件委派減少監聽器數量
- **DOM 操作**：批次更新，避免強制重排（Layout Thrashing）
- **記憶體**：頁面切換時清理動畫 interval/timeout
- **錯誤處理**：AudioContext 初始化失敗時靜默降級（無音效仍可玩）

### 17.3 無障礙基本要求

- 所有互動元素有 `:focus-visible` 樣式
- 按鈕有明確的 `aria-label`（特別是圖示按鈕）
- 顏色對比度符合 WCAG AA（4.5:1 以上）
- 棋盤特殊格有文字說明（`aria-describedby`）

---

## 18. 實作細節補充

### 18.1 index.html 引入順序

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="ocean">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>鰻魚與電扶梯 | Eels and Escalators</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />

  <!-- CSS：base → components → screens → responsive -->
  <link rel="stylesheet" href="css/base/reset.css" />
  <link rel="stylesheet" href="css/base/variables.css" />
  <link rel="stylesheet" href="css/base/typography.css" />
  <link rel="stylesheet" href="css/components/button.css" />
  <link rel="stylesheet" href="css/components/modal.css" />
  <link rel="stylesheet" href="css/components/dice.css" />
  <link rel="stylesheet" href="css/components/board.css" />
  <link rel="stylesheet" href="css/components/piece.css" />
  <link rel="stylesheet" href="css/components/slider.css" />
  <link rel="stylesheet" href="css/components/toggle.css" />
  <link rel="stylesheet" href="css/screens/home.css" />
  <link rel="stylesheet" href="css/screens/game.css" />
  <link rel="stylesheet" href="css/screens/help.css" />
  <link rel="stylesheet" href="css/screens/settings.css" />
  <link rel="stylesheet" href="css/responsive/mobile.css" />
  <link rel="stylesheet" href="css/responsive/tablet.css" />
  <link rel="stylesheet" href="css/responsive/desktop.css" />
</head>
<body>
  <!-- 所有畫面 HTML 在此 -->
  <div id="app">
    <!-- #screen-home -->
    <!-- #screen-game -->
    <!-- #screen-help -->
    <!-- #screen-settings -->
    <!-- #modal-victory -->
    <!-- #modal-defeat -->
    <!-- #modal-confirm-exit -->
  </div>

  <!-- JS：語系 → 核心 → AI → 音效 → UI → main -->
  <script src="js/i18n/zh-TW.js"></script>
  <script src="js/i18n/en.js"></script>
  <script src="js/i18n/ja.js"></script>
  <script src="js/i18n/i18n-manager.js"></script>
  <script src="js/core/board-data.js"></script>
  <script src="js/core/dice.js"></script>
  <script src="js/core/game-engine.js"></script>
  <script src="js/core/save-manager.js"></script>
  <script src="js/ai/ai-engine.js"></script>
  <script src="js/audio/sfx-engine.js"></script>
  <script src="js/audio/bgm-engine.js"></script>
  <script src="js/ui/screen-manager.js"></script>
  <script src="js/ui/board-renderer.js"></script>
  <script src="js/ui/piece-animator.js"></script>
  <script src="js/ui/dice-animator.js"></script>
  <script src="js/ui/home-ui.js"></script>
  <script src="js/ui/game-ui.js"></script>
  <script src="js/ui/help-ui.js"></script>
  <script src="js/ui/settings-ui.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### 18.2 開始遊戲流程

```
1. 玩家點擊「開始遊戲」
2. 顯示難度選擇彈窗：[😊 簡單] [😐 普通] [😈 困難]
3. 玩家選擇難度 → 關閉彈窗
4. 初始化遊戲引擎（重置棋盤、位置、回合）
5. 切換到遊戲畫面（slide 動畫）
6. 播放 BGM
7. 顯示「玩家先手」提示 Toast（1.5s 後消失）
8. 顯示擲骰子按鈕，等待玩家操作
```

### 18.3 繼續遊戲流程

```
1. 主畫面偵測 localStorage 有存檔
2. 「繼續遊戲」按鈕亮起（否則灰色禁用）
3. 玩家點擊 → 讀取存檔資料
4. 切換到遊戲畫面
5. 恢復棋子位置、回合數、紀錄
6. 顯示「已恢復存檔」Toast
7. 根據 currentTurn 決定顯示擲骰子或等待
```

### 18.4 難度選擇彈窗規格

```
┌──────────────────────────────┐
│  🎮 選擇難度                  │
│                              │
│  ┌──────────────────────┐    │
│  │ 😊 簡單              │    │
│  │ 電腦隨機亂走，好欺負   │    │
│  └──────────────────────┘    │
│  ┌──────────────────────┐    │
│  │ 😐 普通（推薦）       │    │ ← 有「推薦」標籤
│  │ 電腦有點聰明，剛剛好   │    │
│  └──────────────────────┘    │
│  ┌──────────────────────┐    │
│  │ 😈 困難              │    │
│  │ 電腦超狡猾，你敢嗎？   │    │
│  └──────────────────────┘    │
│                              │
│         [取消]               │
└──────────────────────────────┘
```

---

## 附錄 A：開發優先順序建議

```
Phase 1（核心可玩）
  ✅ 資料夾結構 & index.html 骨架
  ✅ board-data.js（棋盤資料）
  ✅ game-engine.js（核心邏輯）
  ✅ board-renderer.js（棋盤 SVG）
  ✅ 基本 CSS（變數、版型）
  ✅ 主畫面、遊戲畫面

Phase 2（完整體驗）
  ✅ piece-animator.js（棋子動畫）
  ✅ dice-animator.js（骰子動畫）
  ✅ ai-engine.js（三難度 AI）
  ✅ 勝利/失敗彈窗
  ✅ RWD 手機版

Phase 3（豐富功能）
  ✅ 音效 & BGM（Web Audio API）
  ✅ 多國語系（i18n）
  ✅ 設定頁面（主題/音量）
  ✅ 說明頁面
  ✅ 存檔 & 繼續遊戲

Phase 4（細節打磨）
  ✅ 顏色主題切換
  ✅ 擬真視覺效果
  ✅ 無障礙支援
  ✅ 效能優化
```

---

*規格書版本 v1.0.0 — 2026/06/25*  
*覆蓋範圍：全端實作規格、視覺設計、音效系統、i18n、RWD、AI 設計、資料架構*
