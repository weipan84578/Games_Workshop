# Water Sort Puzzle — 完整技術規格書

> 版本：1.0.0　｜　文件日期：2026-06-16　｜　語系：繁體中文

---

## 目錄

1. [專案總覽](#1-專案總覽)
2. [目錄結構](#2-目錄結構)
3. [技術架構](#3-技術架構)
4. [遊戲規則與核心邏輯](#4-遊戲規則與核心邏輯)
5. [難度設計](#5-難度設計)
6. [關卡設計](#6-關卡設計)
7. [畫面與路由設計](#7-畫面與路由設計)
8. [UI / UX 設計規範](#8-ui--ux-設計規範)
9. [RWD 響應式設計](#9-rwd-響應式設計)
10. [音樂與音效系統](#10-音樂與音效系統)
11. [存檔與設定系統](#11-存檔與設定系統)
12. [CSS 架構規範](#12-css-架構規範)
13. [JavaScript 模組規範](#13-javascript-模組規範)
14. [效能與相容性](#14-效能與相容性)
15. [驗收清單](#15-驗收清單)

---

## 1. 專案總覽

### 1.1 產品定義

Water Sort Puzzle（倒水排色）是一款益智遊戲：玩家操作裝有多色液體的試管，透過倒水使每根試管內只含單一顏色，即完成關卡。

### 1.2 核心目標

| 目標 | 說明 |
|------|------|
| 零依賴部署 | 直接開啟 `index.html` 即可遊玩，無需 build 或 server |
| 純前端實作 | 所有邏輯、存檔、音效均在瀏覽器端完成 |
| 全裝置相容 | 手機、平板、桌機均可順暢遊玩 |
| 豐富遊戲內容 | 三種難度、多元關卡、豐富音效 |

### 1.3 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 語言 | 原生 HTML5 / CSS3 / ES6+ | 零 build 步驟 |
| 模組系統 | ES Module (`type="module"`) | 原生支援、無 bundler |
| 音效 | Web Audio API + Howler.js (CDN) | 豐富音效控制，CDN 引入 |
| 存檔 | localStorage | 跨頁面持久化，無需後端 |
| 字型 | Google Fonts CDN | Nunito（主字型）+ Orbitron（分數） |

---

## 2. 目錄結構

```
water-sort-puzzle/
│
├── index.html                  # 入口，僅含 HTML 結構與 <script type="module">
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── bgm_menu.mp3        # 主選單背景音樂
│   │   │   ├── bgm_easy.mp3        # 簡單模式背景音樂
│   │   │   ├── bgm_normal.mp3      # 普通模式背景音樂
│   │   │   └── bgm_hard.mp3        # 困難模式背景音樂
│   │   └── sfx/
│   │       ├── sfx_pour_start.mp3  # 開始倒水
│   │       ├── sfx_pour_loop.mp3   # 倒水持續音
│   │       ├── sfx_pour_end.mp3    # 倒水結束
│   │       ├── sfx_select.mp3      # 選取試管
│   │       ├── sfx_deselect.mp3    # 取消選取
│   │       ├── sfx_invalid.mp3     # 無效操作（不能倒）
│   │       ├── sfx_complete_tube.mp3  # 單管完成（全部同色）
│   │       ├── sfx_level_clear.mp3    # 關卡通關
│   │       ├── sfx_level_fail.mp3     # 無解提示
│   │       ├── sfx_undo.mp3           # 悔棋
│   │       ├── sfx_hint.mp3           # 提示音
│   │       ├── sfx_btn_click.mp3      # 一般按鈕點擊
│   │       ├── sfx_btn_hover.mp3      # 按鈕 hover
│   │       ├── sfx_screen_in.mp3      # 畫面切入
│   │       ├── sfx_screen_out.mp3     # 畫面切出
│   │       └── sfx_confetti.mp3       # 慶祝撒花
│   └── fonts/                  # (選用) 本地字型備援
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（顏色、字型、間距）
│   │   └── typography.css      # 全域字型規則
│   ├── layout/
│   │   ├── app.css             # 最外層 #app 容器佈局
│   │   └── screen.css          # 各畫面共用佈局
│   ├── components/
│   │   ├── tube.css            # 試管元件樣式
│   │   ├── button.css          # 按鈕系統
│   │   ├── modal.css           # 彈出視窗
│   │   ├── hud.css             # 遊戲 HUD（步數、時間、關卡）
│   │   ├── settings-panel.css  # 設定面板
│   │   └── confetti.css        # 過關慶祝動畫
│   ├── screens/
│   │   ├── home.css            # 主選單畫面
│   │   ├── game.css            # 遊戲畫面
│   │   ├── instructions.css    # 說明畫面
│   │   └── level-select.css    # 關卡選擇畫面
│   ├── themes/
│   │   ├── theme-ocean.css     # 海洋配色主題
│   │   ├── theme-forest.css    # 森林配色主題
│   │   ├── theme-sunset.css    # 落日配色主題
│   │   └── theme-midnight.css  # 深夜配色主題
│   └── responsive/
│       ├── mobile.css          # ≤ 480px
│       ├── tablet.css          # 481px – 1024px
│       └── desktop.css         # ≥ 1025px
│
├── js/
│   ├── main.js                 # 應用程式入口，初始化 Router
│   ├── core/
│   │   ├── GameEngine.js       # 遊戲核心狀態機
│   │   ├── PourLogic.js        # 倒水合法性計算
│   │   ├── UndoStack.js        # 悔棋歷史堆疊
│   │   ├── WinChecker.js       # 勝利條件判斷
│   │   └── HintEngine.js       # 提示演算法（BFS）
│   ├── data/
│   │   ├── levels-easy.js      # 簡單關卡資料（30 關）
│   │   ├── levels-normal.js    # 普通關卡資料（40 關）
│   │   ├── levels-hard.js      # 困難關卡資料（50 關）
│   │   └── color-palettes.js   # 顏色代碼表
│   ├── screens/
│   │   ├── HomeScreen.js       # 主選單畫面控制器
│   │   ├── GameScreen.js       # 遊戲畫面控制器
│   │   ├── InstructionsScreen.js  # 說明畫面控制器
│   │   ├── LevelSelectScreen.js   # 關卡選擇畫面控制器
│   │   └── SettingsScreen.js      # 設定畫面控制器
│   ├── ui/
│   │   ├── TubeRenderer.js     # 試管 DOM 渲染
│   │   ├── AnimationManager.js # 倒水動畫控制
│   │   ├── ConfettiEffect.js   # 過關慶祝效果
│   │   ├── ModalManager.js     # 彈出視窗統一管理
│   │   └── ThemeManager.js     # 主題切換
│   ├── audio/
│   │   ├── AudioManager.js     # 音效統一入口（Howler 封裝）
│   │   ├── BGMController.js    # 背景音樂（跨畫面持續）
│   │   └── SFXController.js    # 音效播放
│   ├── storage/
│   │   ├── SaveManager.js      # localStorage 存讀取
│   │   └── SettingsManager.js  # 使用者設定讀寫
│   └── router/
│       └── Router.js           # 單頁畫面切換（hash-based）
│
└── README.md
```

---

## 3. 技術架構

### 3.1 入口 HTML 結構

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Water Sort Puzzle — 倒水排色</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">

  <!-- Howler.js (音效函式庫) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>

  <!-- CSS：base → layout → components → screens → themes → responsive -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">
  <link rel="stylesheet" href="css/layout/app.css">
  <link rel="stylesheet" href="css/layout/screen.css">
  <link rel="stylesheet" href="css/components/tube.css">
  <link rel="stylesheet" href="css/components/button.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/hud.css">
  <link rel="stylesheet" href="css/components/settings-panel.css">
  <link rel="stylesheet" href="css/components/confetti.css">
  <link rel="stylesheet" href="css/screens/home.css">
  <link rel="stylesheet" href="css/screens/game.css">
  <link rel="stylesheet" href="css/screens/instructions.css">
  <link rel="stylesheet" href="css/screens/level-select.css">
  <link rel="stylesheet" href="css/themes/theme-ocean.css">
  <link rel="stylesheet" href="css/themes/theme-forest.css">
  <link rel="stylesheet" href="css/themes/theme-sunset.css">
  <link rel="stylesheet" href="css/themes/theme-midnight.css">
  <link rel="stylesheet" href="css/responsive/mobile.css">
  <link rel="stylesheet" href="css/responsive/tablet.css">
  <link rel="stylesheet" href="css/responsive/desktop.css">
</head>
<body>
  <div id="app" data-theme="ocean">
    <!-- 所有畫面由 JS 動態注入 -->
  </div>

  <!-- JS 入口 -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 3.2 模組初始化流程

```
main.js
  ├── SettingsManager.load()        → 讀取使用者設定（主題、音量、語系）
  ├── AudioManager.init()           → 預載所有音效
  ├── BGMController.init()          → 準備 BGM
  ├── ThemeManager.apply()          → 套用主題
  └── Router.init()                 → 解析 hash，顯示對應畫面
        ├── #home   → HomeScreen
        ├── #game   → GameScreen
        ├── #instructions → InstructionsScreen
        └── #levels → LevelSelectScreen
```

### 3.3 畫面切換機制

使用 **hash-based routing**，透過 `window.location.hash` 控制。

```javascript
// Router.js 核心邏輯
window.addEventListener('hashchange', () => {
  SFXController.play('screen_in');
  renderScreen(location.hash);
});

function navigateTo(screen, params = {}) {
  SFXController.play('screen_out');
  // 延遲等音效播完
  setTimeout(() => {
    location.hash = screen;
    if (Object.keys(params).length) storeParams(params);
  }, 150);
}
```

**BGM 跨畫面持續**：BGMController 監聽路由事件，判斷是否需要切換 BGM 曲目，維持無縫播放。

---

## 4. 遊戲規則與核心邏輯

### 4.1 基本規則

1. 每根試管容量固定為 **4 格**（一個色塊佔 1 格）。
2. 倒水規則（PourLogic.js）：
   - 來源管最頂端顏色 **必須等於** 目標管最頂端顏色，**或** 目標管為空。
   - 目標管剩餘空間 **≥ 1 格** 才可倒入。
   - 倒水量 = min（來源管連續同色層數, 目標管剩餘空間）。
3. 勝利條件：所有試管均為空管或單一顏色完整填滿。
4. 每局預設提供 **2 根空管** 作為緩衝。
5. 無解偵測：使用 BFS 判斷是否仍有解；無解時提示玩家。

### 4.2 資料結構

```javascript
// 試管狀態（由下到上，index 0 為管底）
const tube = ['red', 'blue', 'red', null];
// null 代表空格

// 遊戲狀態
const gameState = {
  tubes: [[], [], []],          // 所有試管
  moves: 0,                     // 已走步數
  time: 0,                      // 秒數計時
  selectedTube: null,           // 目前選中的試管 index
  difficulty: 'normal',
  levelId: 1,
  hintsUsed: 0,
  undoCount: 0,
};
```

### 4.3 倒水核心演算法

```javascript
// PourLogic.js
export function canPour(tubes, fromIdx, toIdx) {
  const from = tubes[fromIdx];
  const to = tubes[toIdx];

  const fromTop = getTopColor(from);
  const toTop = getTopColor(to);
  const toSpace = getEmptyCount(to);

  if (!fromTop) return false;            // 來源為空
  if (toSpace === 0) return false;       // 目標已滿
  if (toTop !== null && toTop !== fromTop) return false; // 顏色不符
  if (isComplete(from)) return false;   // 來源已完成不需倒

  return true;
}

export function pour(tubes, fromIdx, toIdx) {
  // 計算可倒層數
  const fromTop = getTopColor(tubes[fromIdx]);
  const layers = countTopLayers(tubes[fromIdx], fromTop);
  const space = getEmptyCount(tubes[toIdx]);
  const amount = Math.min(layers, space);

  // 複製狀態（Immutable 更新，支援 Undo）
  const next = deepCopy(tubes);
  for (let i = 0; i < amount; i++) {
    const color = removeTop(next[fromIdx]);
    addTop(next[toIdx], color);
  }
  return next;
}
```

### 4.4 悔棋機制（UndoStack.js）

```javascript
class UndoStack {
  constructor(maxDepth = 30) {
    this.stack = [];
    this.maxDepth = maxDepth;
  }

  push(tubesSnapshot) {
    if (this.stack.length >= this.maxDepth) this.stack.shift();
    this.stack.push(deepCopy(tubesSnapshot));
  }

  pop() {
    return this.stack.pop() ?? null;
  }

  get canUndo() {
    return this.stack.length > 0;
  }
}
```

### 4.5 提示演算法（HintEngine.js）

使用 **BFS（廣度優先搜尋）** 找出最少步數的下一步：

- 狀態鍵值：`JSON.stringify(tubes)`
- 最大搜尋深度：**12 步**（超過視為複雜局面，提示優先合法步）
- 回傳：`{ from: number, to: number }` 或 `null`（無解）

---

## 5. 難度設計

### 5.1 難度參數表

| 參數 | 簡單（Easy） | 普通（Normal） | 困難（Hard） |
|------|:---:|:---:|:---:|
| 顏色種數 | 4 – 5 色 | 6 – 8 色 | 9 – 12 色 |
| 試管總數 | 色數 + 2 | 色數 + 2 | 色數 + 2 |
| 空管數 | 2 | 2 | 2 |
| 每管容量 | 4 | 4 | 4 |
| 提示次數 | 無限 | 5 次/關 | 2 次/關 |
| 悔棋次數 | 無限 | 無限 | 5 次/關 |
| 計時 | 不計時 | 計時（參考） | 計時（計入評分） |
| 過關星數評定 | 1 – 3 星（步數） | 1 – 3 星（步數+時間） | 1 – 3 星（步數+時間+悔棋） |
| 關卡數 | 30 關 | 40 關 | 50 關 |

### 5.2 星數評定標準

**簡單模式**（僅看步數）

| 星數 | 條件 |
|------|------|
| ★★★ | 步數 ≤ 最優解 × 1.3 |
| ★★☆ | 步數 ≤ 最優解 × 1.8 |
| ★☆☆ | 過關（任意步數） |

**困難模式**（步數 × 時間 × 悔棋）

| 星數 | 條件 |
|------|------|
| ★★★ | 步數 ≤ 最優 × 1.2 且 時間 ≤ 基準 × 1.3 且 悔棋 = 0 |
| ★★☆ | 步數 ≤ 最優 × 1.5 且 時間 ≤ 基準 × 2.0 |
| ★☆☆ | 過關 |

---

## 6. 關卡設計

### 6.1 關卡資料格式

```javascript
// levels-easy.js
export const LEVELS_EASY = [
  {
    id: 1,
    name: '暖身一下',
    colors: 4,
    optimalMoves: 7,
    timeBenchmark: 60,      // 秒，普通玩家預期時間
    tubes: [
      ['red', 'blue', 'red', 'blue'],
      ['blue', 'red', 'blue', 'red'],
      [],
      [],
    ],
  },
  // ...
];
```

### 6.2 關卡設計多樣性原則

每 10 關為一組，各組應包含以下類型：

| 類型 | 特徵 | 佔比 |
|------|------|------|
| 漸進型 | 從少量顏色逐步增加 | 20% |
| 瓶頸型 | 顏色幾乎全部阻塞，需要規劃拆解順序 | 20% |
| 空間型 | 空管數恰好剛好，稍有錯誤即卡死 | 20% |
| 連鎖型 | 必須先完成某幾管才能繼續 | 20% |
| 混合型 | 融合以上特徵 | 20% |

### 6.3 代表關卡範例（設計方向）

**簡單 Level 1**（暖身）：4 色，只需直覺操作  
**簡單 Level 15**（進階）：5 色，出現第一個瓶頸  
**普通 Level 1**：6 色，空間稍緊  
**普通 Level 20**：7 色，出現連鎖依賴  
**普通 Level 40**：8 色，整關高密度佈局  
**困難 Level 1**：9 色，大量試管，空間緊繃  
**困難 Level 25**：10 色，多層次連鎖  
**困難 Level 50**：12 色，終極挑戰，需完美規劃  

---

## 7. 畫面與路由設計

### 7.1 畫面清單

| 畫面 ID | Hash | 功能 |
|---------|------|------|
| HomeScreen | `#home` | 主選單 |
| LevelSelectScreen | `#levels?diff=easy` | 關卡選擇 |
| GameScreen | `#game?diff=easy&level=1` | 遊戲本體 |
| InstructionsScreen | `#instructions` | 遊戲說明 |
| SettingsScreen | `#settings` | 設定（音效、主題、語系） |

### 7.2 主選單（HomeScreen）

```
┌─────────────────────────────┐
│   🌊 Water Sort Puzzle      │  ← 大標題（Orbitron 字型，漸層色）
│     倒水排色                 │  ← 副標題（Nunito Bold）
│                             │
│   [ 🎮  開始遊戲 ]          │  ← 跳至難度選擇 → 關卡選擇
│   [ ▶️  繼續遊戲 ]          │  ← 讀取上次存檔（若無則灰色）
│   [ 📖  說明    ]           │
│   [ ⚙️  設定    ]           │
│                             │
│   背景：流動液體動畫         │
└─────────────────────────────┘
```

**繼續遊戲按鈕**：從 `SaveManager.getLastSave()` 讀取，顯示「普通 第 12 關」字樣；無存檔則顯示為半透明不可點擊。

### 7.3 難度選擇彈出視窗

點擊「開始遊戲」後顯示 Modal：

```
┌─────────────────┐
│  選擇難度        │
│                 │
│  [😊 簡單]      │
│  [😐 普通]      │
│  [😈 困難]      │
│                 │
│  [✕ 取消]       │
└─────────────────┘
```

### 7.4 遊戲畫面（GameScreen）

```
┌──────────────────────────────────────────┐
│  [←] 普通 · 第 12 關   步數: 8  ⏱ 1:23  │  ← HUD（固定頂部）
├──────────────────────────────────────────┤
│                                          │
│   🧪  🧪  🧪  🧪  🧪  🧪  🧪  🧪       │  ← 試管區（垂直填色）
│                                          │
├──────────────────────────────────────────┤
│  [↩ 悔棋]  [💡 提示]  [🔄 重玩]         │  ← 操作按鈕（固定底部）
└──────────────────────────────────────────┘
```

**行動裝置注意**：底部操作列使用 `position: fixed; bottom: env(safe-area-inset-bottom, 0)` 確保不遮擋試管。試管區加入 `padding-bottom: 80px` 預留空間。

### 7.5 過關彈出視窗

```
┌─────────────────────────┐
│  🎉 關卡完成！           │
│                         │
│  ★ ★ ★                 │  ← 星數動畫
│  步數：8 步              │
│  時間：1:23              │
│                         │
│  [下一關]  [重玩]        │
│  [選擇關卡]              │
└─────────────────────────┘
```

### 7.6 說明畫面（InstructionsScreen）

分頁式說明，包含：
1. 基本規則（圖示 + 文字）
2. 倒水示意動畫（CSS 動畫）
3. 操作說明（點擊選取 / 點擊目標）
4. 快捷鍵（桌機：鍵盤數字鍵選管）

### 7.7 設定畫面（SettingsScreen）

```
┌──────────────────────────┐
│  ⚙️  設定                │
│                          │
│  音樂音量  [====|===]    │
│  音效音量  [=======|=]   │
│  主題      [Ocean ▼]     │
│  震動回饋  [ON / OFF]    │
│  顯示計時  [ON / OFF]    │
│                          │
│  [← 返回]                │
└──────────────────────────┘
```

---

## 8. UI / UX 設計規範

### 8.1 色彩系統

**液體顏色（12 色）**

```css
--color-liq-red:    #FF4757;
--color-liq-orange: #FF6B35;
--color-liq-yellow: #FFC312;
--color-liq-lime:   #A3CB38;
--color-liq-green:  #009432;
--color-liq-cyan:   #12CBC4;
--color-liq-blue:   #0652DD;
--color-liq-purple: #9980FA;
--color-liq-pink:   #FDA7DF;
--color-liq-brown:  #9B59B6;
--color-liq-gray:   #7F8C8D;
--color-liq-navy:   #1B1464;
```

**主題：Ocean（預設）**

```css
[data-theme="ocean"] {
  --bg-primary:   #0A1628;
  --bg-secondary: #142849;
  --bg-card:      #1E3A5F;
  --accent:       #00B4D8;
  --accent-glow:  #0096C7;
  --text-primary: #E8F4F8;
  --text-muted:   #A8C8D8;
  --btn-primary:  #0077B6;
  --btn-hover:    #023E8A;
}
```

**主題：Forest**

```css
[data-theme="forest"] {
  --bg-primary:   #0D2818;
  --bg-secondary: #1A3A28;
  --bg-card:      #265038;
  --accent:       #52B788;
  --text-primary: #ECF8F0;
  --btn-primary:  #2D6A4F;
}
```

**主題：Sunset**

```css
[data-theme="sunset"] {
  --bg-primary:   #1A0A0A;
  --bg-secondary: #2D1515;
  --bg-card:      #3D2020;
  --accent:       #FF6B35;
  --text-primary: #FFF0E8;
  --btn-primary:  #C1440E;
}
```

**主題：Midnight**

```css
[data-theme="midnight"] {
  --bg-primary:   #050508;
  --bg-secondary: #0D0D1A;
  --bg-card:      #14142B;
  --accent:       #7B61FF;
  --text-primary: #E0E0FF;
  --btn-primary:  #4A3BCC;
}
```

### 8.2 字型規範

```css
:root {
  --font-display: 'Orbitron', sans-serif;   /* 標題、分數 */
  --font-body:    'Nunito', sans-serif;      /* 所有內文、按鈕 */

  /* 字型大小（大字體策略） */
  --text-xs:   14px;
  --text-sm:   16px;
  --text-md:   20px;
  --text-lg:   24px;
  --text-xl:   32px;
  --text-2xl:  42px;
  --text-3xl:  56px;
}
```

**所有 UI 文字最小 16px，遊戲 HUD 最小 20px，大標題最小 42px。**

### 8.3 試管元件設計

試管由 CSS 繪製（無圖片資源）：

```css
.tube {
  width: clamp(44px, 8vw, 64px);
  height: clamp(160px, 28vw, 240px);
  border: 3px solid rgba(255,255,255,0.25);
  border-radius: 0 0 50% 50% / 0 0 30px 30px;
  background: rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column-reverse;    /* 液體從底部填充 */
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tube.selected {
  transform: translateY(-12px);
  box-shadow: 0 0 20px var(--accent);
}

.tube-layer {
  width: 100%;
  flex-shrink: 0;
  height: 25%;                       /* 4 層各佔 25% */
  transition: background-color 0.3s ease;
}
```

**倒水動畫**：選中試管向上浮起，確認目標後播放「液體傾倒」CSS animation（從來源管頂端流向目標管）。

---

## 9. RWD 響應式設計

### 9.1 斷點策略

| 範圍 | 檔案 | 目標裝置 |
|------|------|----------|
| ≤ 480px | `mobile.css` | 手機直向 |
| 481px – 768px | `tablet.css` | 手機橫向 / 小平板 |
| 769px – 1024px | `tablet.css` | 平板 |
| ≥ 1025px | `desktop.css` | 桌機 |

### 9.2 試管排版邏輯

試管數量依難度為 6 – 14 根，使用 **CSS Grid + `auto-fit`** 自動換行：

```css
.tubes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(44px, 8vw, 64px), 1fr));
  gap: clamp(8px, 2vw, 16px);
  justify-content: center;
  align-items: flex-end;
  padding: 16px;
  /* 底部留給操作按鈕 */
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
}
```

**手機直向（≤ 480px）**：
- 試管寬度縮至 `44px`，高度縮至 `160px`
- 每排最多 5 根
- 超過 10 根試管時，分為上下兩排

### 9.3 底部操作列（行動裝置安全）

```css
/* hud.css */
.game-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(var(--bg-primary-rgb), 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  gap: 12px;
  justify-content: center;
  z-index: 100;
}

/* 防止按鈕遮擋遊戲區域 */
.tubes-area {
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
}
```

### 9.4 觸控互動優化

```css
/* 觸控目標最小 44×44px（iOS HIG 標準） */
.tube {
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;        /* 防止雙擊縮放 */
  -webkit-tap-highlight-color: transparent;
}

.btn {
  min-height: 48px;
  min-width: 80px;
}
```

```javascript
// GameScreen.js：同時支援 click 與 touch
tube.addEventListener('click', handleTubeClick);
// 防止 300ms 延遲
tube.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleTubeClick(e);
}, { passive: false });
```

---

## 10. 音樂與音效系統

### 10.1 音效清單（共 16 種）

| 識別碼 | 檔案 | 觸發時機 | 類型 |
|--------|------|----------|------|
| `bgm_menu` | bgm_menu.mp3 | 主選單 | BGM |
| `bgm_easy` | bgm_easy.mp3 | 簡單模式遊戲中 | BGM |
| `bgm_normal` | bgm_normal.mp3 | 普通模式遊戲中 | BGM |
| `bgm_hard` | bgm_hard.mp3 | 困難模式遊戲中 | BGM |
| `pour_start` | sfx_pour_start.mp3 | 液體開始流動 | SFX |
| `pour_loop` | sfx_pour_loop.mp3 | 倒水持續中（loop） | SFX |
| `pour_end` | sfx_pour_end.mp3 | 倒水完成 | SFX |
| `select` | sfx_select.mp3 | 選中試管 | SFX |
| `deselect` | sfx_deselect.mp3 | 取消選取 | SFX |
| `invalid` | sfx_invalid.mp3 | 嘗試無效操作 | SFX |
| `complete_tube` | sfx_complete_tube.mp3 | 單管完成同色 | SFX |
| `level_clear` | sfx_level_clear.mp3 | 過關 | SFX |
| `level_fail` | sfx_level_fail.mp3 | 偵測到無解 | SFX |
| `undo` | sfx_undo.mp3 | 悔棋 | SFX |
| `hint` | sfx_hint.mp3 | 使用提示 | SFX |
| `btn_click` | sfx_btn_click.mp3 | 所有按鈕點擊 | SFX |
| `btn_hover` | sfx_btn_hover.mp3 | 桌機 hover | SFX |
| `screen_in` | sfx_screen_in.mp3 | 畫面切入 | SFX |
| `screen_out` | sfx_screen_out.mp3 | 畫面切出 | SFX |
| `confetti` | sfx_confetti.mp3 | 過關撒花動畫 | SFX |

### 10.2 BGM 跨畫面持續播放

```javascript
// BGMController.js
const BGM_MAP = {
  '#home':         'bgm_menu',
  '#instructions': 'bgm_menu',
  '#settings':     'bgm_menu',
  '#levels':       'bgm_menu',
  '#game?diff=easy':   'bgm_easy',
  '#game?diff=normal': 'bgm_normal',
  '#game?diff=hard':   'bgm_hard',
};

class BGMController {
  #current = null;
  #howl = null;

  switchTo(trackId) {
    if (this.#current === trackId) return;  // 相同曲目不重新播放

    if (this.#howl) {
      this.#howl.fade(settings.bgmVolume, 0, 800);
      setTimeout(() => this.#howl.stop(), 800);
    }

    this.#current = trackId;
    this.#howl = new Howl({
      src: [`assets/audio/bgm/${trackId}.mp3`],
      loop: true,
      volume: 0,
      autoplay: true,
    });
    this.#howl.fade(0, settings.bgmVolume, 800);  // 淡入
  }
}
```

### 10.3 音效管理器

```javascript
// SFXController.js
class SFXController {
  #pool = {};

  preload(manifest) {
    for (const [id, path] of Object.entries(manifest)) {
      this.#pool[id] = new Howl({ src: [path], volume: settings.sfxVolume });
    }
  }

  play(id, opts = {}) {
    if (!settings.sfxEnabled) return;
    const howl = this.#pool[id];
    if (howl) howl.play();
  }

  stopLoop(id) {
    this.#pool[id]?.stop();
  }
}
```

### 10.4 首次互動解鎖

瀏覽器禁止自動播放，首次使用者互動後解鎖：

```javascript
document.addEventListener('click', () => {
  Howler.ctx?.resume();
  BGMController.switchTo('bgm_menu');
}, { once: true });
```

---

## 11. 存檔與設定系統

### 11.1 存檔資料結構（localStorage）

```javascript
// Key: 'wsp_save'
{
  version: '1.0.0',
  lastPlayed: {
    difficulty: 'normal',
    levelId: 12,
    tubes: [[...], ...],   // 當前局面快照
    moves: 8,
    time: 83,
  },
  progress: {
    easy:   { cleared: [1,2,3,...], stars: { 1: 3, 2: 2, ... } },
    normal: { cleared: [...], stars: {...} },
    hard:   { cleared: [...], stars: {...} },
  }
}

// Key: 'wsp_settings'
{
  bgmVolume: 0.7,
  sfxVolume: 0.9,
  bgmEnabled: true,
  sfxEnabled: true,
  theme: 'ocean',
  vibration: true,
  showTimer: true,
}
```

### 11.2 SaveManager API

```javascript
export const SaveManager = {
  save(gameState)   { /* 寫入 localStorage */ },
  load()            { /* 讀取並驗證版本 */ },
  getLastSave()     { /* 回傳 lastPlayed 或 null */ },
  clearSave()       { /* 清除存檔 */ },
  markLevelCleared(diff, levelId, stars) { /* 更新 progress */ },
};
```

---

## 12. CSS 架構規範

### 12.1 命名規則（BEM 簡化版）

```
.block {}
.block__element {}
.block--modifier {}
```

範例：
```css
.tube {}
.tube__layer {}
.tube--selected {}
.tube--complete {}
.tube--hint {}

.btn {}
.btn--primary {}
.btn--ghost {}
.btn--icon {}
```

### 12.2 CSS 自訂屬性分層

```css
/* variables.css */
:root {
  /* 動畫時長 */
  --duration-fast:   0.15s;
  --duration-normal: 0.3s;
  --duration-slow:   0.6s;

  /* 圓角 */
  --radius-sm:  8px;
  --radius-md:  16px;
  --radius-lg:  24px;
  --radius-xl:  32px;
  --radius-pill: 9999px;

  /* 陰影 */
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.3);
  --shadow-md:  0 4px 24px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 20px var(--accent);

  /* 間距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}
```

### 12.3 載入順序規則

1. `reset.css` — 清零預設樣式
2. `variables.css` — 定義所有 token
3. `typography.css` — 全域字型
4. `layout/*.css` — 容器佈局
5. `components/*.css` — 可重用元件
6. `screens/*.css` — 特定畫面樣式
7. `themes/*.css` — 主題覆蓋（最後載入確保優先度）
8. `responsive/*.css` — media query 覆蓋（絕對最後）

---

## 13. JavaScript 模組規範

### 13.1 模組職責劃分

| 目錄 | 職責 |
|------|------|
| `core/` | 純邏輯，不操作 DOM，可單獨測試 |
| `data/` | 靜態資料，關卡、顏色定義 |
| `screens/` | 各畫面的 init / destroy / render 週期 |
| `ui/` | DOM 操作、動畫，與 core 分離 |
| `audio/` | 所有聲音控制 |
| `storage/` | localStorage 讀寫 |
| `router/` | 單頁切換邏輯 |

### 13.2 Screen 生命週期介面

每個 Screen 模組需實作：

```javascript
export default {
  async init(params) { /* 讀取 params，建立 DOM，綁定事件 */ },
  destroy()          { /* 解綁事件，清理計時器 */ },
};
```

### 13.3 GameEngine 狀態流

```
IDLE → SELECTING → POURING → CHECKING → (WIN | CONTINUE)
                ↓
            (INVALID) → IDLE
```

```javascript
// GameEngine.js
export class GameEngine extends EventTarget {
  #state = 'IDLE';
  #gameState = {};
  #undoStack = new UndoStack();

  selectTube(idx)  { /* 第一次點擊：選管 */ }
  targetTube(idx)  { /* 第二次點擊：倒水或換選 */ }
  undo()           { /* 復原 */ }
  hint()           { /* 觸發提示 */ }
  restart()        { /* 重置關卡 */ }

  // 發射事件供 UI 層監聽
  // 'pour-start', 'pour-end', 'tube-complete',
  // 'win', 'invalid', 'undo-applied'
}
```

### 13.4 ES Module 入口

```javascript
// main.js
import { Router }         from './router/Router.js';
import { AudioManager }   from './audio/AudioManager.js';
import { SettingsManager }from './storage/SettingsManager.js';
import { ThemeManager }   from './ui/ThemeManager.js';

(async () => {
  const settings = SettingsManager.load();
  ThemeManager.apply(settings.theme);
  await AudioManager.preload();
  Router.init();
})();
```

---

## 14. 效能與相容性

### 14.1 效能目標

| 指標 | 目標 |
|------|------|
| 首次載入時間 | < 2 秒（不含音效預載） |
| 倒水動畫幀率 | 60 FPS（CSS transform/opacity only） |
| 觸控響應延遲 | < 100ms |
| localStorage 讀寫 | < 5ms |

### 14.2 動畫效能規則

- 所有動畫僅使用 `transform` 和 `opacity`（GPU 加速）
- 試管液體顏色切換用 `background-color` transition（非 animation）
- 過關慶祝 Confetti 使用 Canvas 或 CSS Custom Properties，不使用 JS 直接操作大量 DOM

### 14.3 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

**必要 polyfill**：`CSS.registerProperty`（Firefox < 128）

### 14.4 無障礙（Accessibility）

- 所有互動元素有 `aria-label`
- 鍵盤操作：`Tab` 切換試管，`Enter/Space` 選取/確認
- 試管選中狀態有 `aria-selected="true"`
- 尊重 `prefers-reduced-motion`：動畫替換為立即切換

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 15. 驗收清單

### 功能驗收

- [ ] 直接開啟 `index.html` 可正常遊玩，無需 server 或 build
- [ ] 主選單顯示：開始遊戲、繼續遊戲、說明、設定四個選項
- [ ] 繼續遊戲正確讀取上次存檔位置
- [ ] 三種難度關卡可正常切換，顏色數量符合規格
- [ ] 倒水邏輯正確（顏色匹配、容量限制）
- [ ] 悔棋功能可正確復原（最多 30 步）
- [ ] 提示功能顯示正確的可行步驟
- [ ] 過關後正確計算並顯示星數
- [ ] 所有關卡完成後可看到難度完成成就
- [ ] 設定中音量調整即時生效
- [ ] 主題切換即時套用（不需重新整理）
- [ ] 存檔在關閉瀏覽器後仍保存

### RWD 驗收

- [ ] 手機直向（375px）：試管完整顯示，無橫向捲軸
- [ ] 手機橫向（667px）：試管與按鈕不重疊
- [ ] 平板（768px）：佈局舒適，字型不過小
- [ ] 桌機（1440px）：試管有最大寬度限制，不過度拉伸
- [ ] 底部按鈕不遮擋試管（所有尺寸）
- [ ] iOS Safari 底部安全區域正確處理

### 音效驗收

- [ ] 16 種音效全部可正常播放
- [ ] BGM 在同模式畫面切換時不重新播放
- [ ] BGM 切換難度時淡出淡入
- [ ] 靜音設定全局生效
- [ ] 音量滑桿調整即時作用

### 視覺驗收

- [ ] 四種主題顏色明確區分
- [ ] 所有文字最小 16px，標題最小 32px
- [ ] 試管選中有明確視覺反饋（浮起 + glow）
- [ ] 過關有慶祝動畫（撒花 / 閃光）
- [ ] 動畫流暢不卡頓（60 FPS）

---

*規格書結束　— Water Sort Puzzle v1.0.0*
