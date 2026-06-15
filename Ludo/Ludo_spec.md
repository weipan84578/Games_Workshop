# Ludo 飛行棋 — 詳細規格書

> 版本：v1.0
> 類型：純前端單頁網頁遊戲（Player vs AI）
> 適用平台：桌面瀏覽器、行動裝置瀏覽器

---

## 0. 重要技術前提（請務必先讀）

這份規格有兩個需求彼此牽動,直接決定整體架構,務必先理解：

### 0.1 「直接開檔」與「拆檔引入」如何共存

- 需求要求 **雙擊 `index.html` 即可遊玩,不需 build、不需啟動任何 server**(即 `file://` 協定執行)。
- 同時要求 **CSS / JavaScript 拆成多個資料夾,在 index 用引入方式載入**。
- **限制**：瀏覽器對 `file://` 下的 ES Module(`<script type="module">` + `import / export`)有 CORS 安全限制,直接開檔會**載入失敗**。
- **解法（本專案採用）**：
  - JavaScript 一律使用 **傳統 `<script src="...">`** 載入(非 module),檔案之間靠**單一全域命名空間物件 `window.Ludo`** 共享狀態與函式。
  - CSS 一律使用 **`<link rel="stylesheet" href="...">`** 載入。
  - 載入順序由 `index.html` 中 `<script>` 的排列順序決定(見 §4)。
- 結論：**多檔分類 + 直接開檔** 兩者皆可滿足,代價是不使用 `import` 語法,改用全域命名空間。

### 0.2 「切換畫面音樂持續播放」如何達成

- 若用多個 HTML 檔互相跳轉(`menu.html` → `game.html`),每次跳頁都會**重載整頁、音樂中斷**。
- **解法（本專案採用）**：整個遊戲是 **單頁應用(SPA)**,所有畫面都是同一個 `index.html` 內的 `<section>`,以「顯示 / 隱藏」切換,頁面永不重載。
- 背景音樂(BGM)由一個**全域常駐的音訊管理器**控制,切換畫面時不重新建立 audio 物件,因此音樂持續不斷。

---

## 1. 專案概述

| 項目 | 內容 |
|------|------|
| 遊戲名稱 | Ludo 飛行棋 |
| 遊戲模式 | 玩家 vs AI(可選 1～3 個 AI 對手) |
| AI 難度 | 簡單 / 普通 / 困難 |
| 技術型態 | 純前端、零依賴、零建置 |
| 執行方式 | 雙擊 `index.html` 直接開啟 |
| 設計重點 | RWD、大字體、多主題配色、豐富音效、行動端不擋畫面 |
| 存檔機制 | `localStorage`(支援「繼續遊戲」) |

### 1.1 核心玩法目標
玩家擲骰子,將自己的 4 顆棋子從基地(Yard)依順時針繞行棋盤一圈,進入自家終點通道,4 顆全部抵達中央終點即獲勝。途中可擊落踩到的對手棋子,將其送回基地。

---

## 2. 技術架構

| 面向 | 規格 |
|------|------|
| HTML | 單一 `index.html`,內含所有畫面(以 `<section>` 分區) |
| CSS | 原生 CSS + CSS 變數(自訂屬性),多 `<link>` 引入 |
| JS | 原生 ES5/ES6 語法 + 傳統 `<script src>` 載入,全域命名空間 `window.Ludo` |
| 模組共享 | 透過 `window.Ludo.*` 子物件(非 `import/export`) |
| 棋盤渲染 | CSS Grid + DOM 元素(或 `<canvas>`,擇一,建議 Grid 較易做 RWD 與點擊) |
| 音訊 | HTML5 `Audio` 物件 + 單例音訊管理器 |
| 資料持久化 | `localStorage` |
| 相依套件 | **無**(不使用 jQuery、React、Vue、任何框架或 CDN) |
| 字體 | 系統字體優先,可選擇放入本地 webfont 至 `assets/fonts/` |

### 2.1 瀏覽器相容性
- 支援近兩年內主流瀏覽器:Chrome、Edge、Firefox、Safari(含 iOS Safari、Android Chrome)。
- 需支援:CSS Grid、CSS 變數、`Audio` API、`localStorage`、`Pointer Events`(或 touch + mouse 雙軌)。

---

## 3. 專案資料夾結構

```
ludo/
├── index.html                  ← 唯一入口,內含所有 <section> 畫面
│
├── css/
│   ├── base/
│   │   ├── reset.css           ← 樣式重置
│   │   ├── variables.css       ← 全域 CSS 變數(間距、圓角、陰影、字級基準)
│   │   └── typography.css      ← 大字體規範(字級、字重、行高)
│   ├── themes/                 ← 多主題配色,每個主題一支檔
│   │   ├── classic.css         ← 經典(紅綠黃藍鮮明)
│   │   ├── ocean.css           ← 海洋(藍綠)
│   │   ├── sunset.css          ← 夕陽(橘粉)
│   │   ├── forest.css          ← 森林(綠棕)
│   │   ├── night.css           ← 夜間(深色高對比)
│   │   └── high-contrast.css   ← 無障礙高對比
│   ├── layout/
│   │   ├── app-shell.css       ← 整體版面骨架(Grid 三段式)
│   │   ├── menu.css            ← 主選單版面
│   │   ├── board.css           ← 棋盤版面
│   │   ├── hud.css             ← 抬頭資訊列(目前玩家、分數)
│   │   └── modal.css           ← 彈窗(說明、設定、結算)
│   ├── components/
│   │   ├── buttons.css         ← 按鈕元件(大尺寸、可點區 ≥48px)
│   │   ├── dice.css            ← 骰子元件
│   │   ├── tokens.css          ← 棋子元件
│   │   └── controls.css        ← 行動端控制列元件
│   └── responsive/
│       ├── mobile.css          ← 手機直式(主要斷點)
│       ├── tablet.css          ← 平板
│       └── desktop.css         ← 桌面
│
├── js/
│   ├── core/
│   │   ├── namespace.js        ← 建立 window.Ludo 與所有子命名空間(最先載入)
│   │   ├── config.js           ← 全域常數(棋盤格數、路徑表、音量預設)
│   │   ├── state.js            ← 遊戲狀態物件 + 狀態機
│   │   └── storage.js          ← localStorage 存讀檔
│   ├── engine/
│   │   ├── board.js            ← 棋盤模型、座標、路徑資料
│   │   ├── rules.js            ← 規則:可走步、吃子、安全格、進終點判定
│   │   ├── dice.js             ← 擲骰邏輯
│   │   ├── token.js            ← 棋子資料模型與移動
│   │   └── turn.js             ← 回合管理(輪流、擲6再擲、跳過)
│   ├── ai/
│   │   ├── ai-manager.js       ← AI 入口,依難度分派
│   │   ├── ai-easy.js          ← 簡單:隨機合法步
│   │   ├── ai-normal.js        ← 普通:啟發式評分
│   │   └── ai-hard.js          ← 困難:威脅分析 + 機率評估
│   ├── audio/
│   │   ├── sound-list.js       ← 所有音效/音樂的鍵值清單
│   │   └── audio-manager.js    ← 常駐單例:BGM、SFX、音量、靜音、跨畫面持續
│   ├── ui/
│   │   ├── screen-manager.js   ← 畫面切換(顯示/隱藏 section,不重載)
│   │   ├── menu.js             ← 主選單行為
│   │   ├── settings.js         ← 設定畫面
│   │   ├── instructions.js     ← 說明畫面
│   │   ├── render-board.js     ← 繪製棋盤格
│   │   ├── render-tokens.js    ← 繪製/更新棋子位置
│   │   ├── hud.js              ← 抬頭資訊更新
│   │   └── animations.js       ← 棋子移動動畫、骰子動畫
│   ├── input/
│   │   ├── pointer.js          ← 統一 click / touch 事件
│   │   └── mobile-controls.js  ← 行動端控制列邏輯
│   └── main.js                 ← 啟動程序,串接所有模組(最後載入)
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── menu-theme.mp3      ← 選單背景音樂
│   │   │   └── game-theme.mp3      ← 遊戲背景音樂
│   │   └── sfx/                    ← 至少 15+ 種音效(見 §11)
│   │       ├── dice-roll.mp3
│   │       ├── dice-land.mp3
│   │       ├── token-move.mp3
│   │       ├── token-hop.mp3
│   │       ├── capture.mp3
│   │       ├── token-home.mp3
│   │       ├── button-click.mp3
│   │       ├── button-hover.mp3
│   │       ├── screen-transition.mp3
│   │       ├── turn-start.mp3
│   │       ├── win-fanfare.mp3
│   │       ├── lose.mp3
│   │       ├── safe-cell.mp3
│   │       ├── illegal-move.mp3
│   │       ├── unlock-token.mp3
│   │       ├── six-bonus.mp3
│   │       └── select-token.mp3
│   ├── images/
│   │   ├── board/                 ← 棋盤背景、格子貼圖(可選)
│   │   ├── tokens/                ← 棋子圖示(可選,亦可純 CSS 繪製)
│   │   └── icons/                 ← 介面圖示(音量、設定齒輪等)
│   └── fonts/                     ← 本地大字體 webfont(可選)
│
└── README.md
```

> **分類原則**:CSS 依「基礎 / 主題 / 版面 / 元件 / 響應式」分層;JS 依「核心 / 引擎 / AI / 音訊 / UI / 輸入」分層。每個資料夾職責單一,方便維護與擴充。

---

## 4. index.html 載入規範

`index.html` 的 `<head>` 與 `<body>` 末端依固定順序引入檔案。**順序很重要**:命名空間 → 設定 → 引擎 → AI → 音訊 → UI → 輸入 → 啟動。

### 4.1 CSS 引入順序(於 `<head>`)
```html
<!-- 基礎 -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<!-- 主題(預設載入 classic,可由設定動態切換) -->
<link rel="stylesheet" href="css/themes/classic.css" id="theme-stylesheet">
<!-- 版面 -->
<link rel="stylesheet" href="css/layout/app-shell.css">
<link rel="stylesheet" href="css/layout/menu.css">
<link rel="stylesheet" href="css/layout/board.css">
<link rel="stylesheet" href="css/layout/hud.css">
<link rel="stylesheet" href="css/layout/modal.css">
<!-- 元件 -->
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/dice.css">
<link rel="stylesheet" href="css/components/tokens.css">
<link rel="stylesheet" href="css/components/controls.css">
<!-- 響應式(放最後,確保覆蓋) -->
<link rel="stylesheet" href="css/responsive/desktop.css">
<link rel="stylesheet" href="css/responsive/tablet.css">
<link rel="stylesheet" href="css/responsive/mobile.css">
```

### 4.2 JS 引入順序(於 `</body>` 之前)
```html
<!-- 核心(命名空間必須最先) -->
<script src="js/core/namespace.js"></script>
<script src="js/core/config.js"></script>
<script src="js/core/state.js"></script>
<script src="js/core/storage.js"></script>
<!-- 引擎 -->
<script src="js/engine/board.js"></script>
<script src="js/engine/rules.js"></script>
<script src="js/engine/dice.js"></script>
<script src="js/engine/token.js"></script>
<script src="js/engine/turn.js"></script>
<!-- AI -->
<script src="js/ai/ai-easy.js"></script>
<script src="js/ai/ai-normal.js"></script>
<script src="js/ai/ai-hard.js"></script>
<script src="js/ai/ai-manager.js"></script>
<!-- 音訊 -->
<script src="js/audio/sound-list.js"></script>
<script src="js/audio/audio-manager.js"></script>
<!-- UI -->
<script src="js/ui/screen-manager.js"></script>
<script src="js/ui/menu.js"></script>
<script src="js/ui/settings.js"></script>
<script src="js/ui/instructions.js"></script>
<script src="js/ui/render-board.js"></script>
<script src="js/ui/render-tokens.js"></script>
<script src="js/ui/hud.js"></script>
<script src="js/ui/animations.js"></script>
<!-- 輸入 -->
<script src="js/input/pointer.js"></script>
<script src="js/input/mobile-controls.js"></script>
<!-- 啟動(最後) -->
<script src="js/main.js"></script>
```

### 4.3 命名空間規範(`namespace.js`)
```js
// 全域唯一命名空間,所有模組掛在底下,取代 import/export
window.Ludo = {
  config:  {},   // 常數設定
  state:   {},   // 遊戲狀態
  storage: {},   // 存讀檔
  engine:  { board:{}, rules:{}, dice:{}, token:{}, turn:{} },
  ai:      {},   // AI 分派
  audio:   {},   // 音訊管理器
  ui:      {},   // 介面模組
  input:   {}    // 輸入處理
};
```
> 各檔案以 `window.Ludo.engine.rules.canMove = function(){...}` 的形式擴充,彼此呼叫透過 `Ludo.engine.rules.canMove(...)`。

### 4.4 畫面區塊(`<body>` 內 section 結構)
```html
<body>
  <div id="app">
    <section id="screen-menu"          class="screen active"> ... </section>
    <section id="screen-mode-select"   class="screen"> ... </section>
    <section id="screen-game"          class="screen"> ... </section>
    <section id="screen-instructions"  class="screen"> ... </section>
    <section id="screen-settings"      class="screen"> ... </section>
    <div id="modal-layer"></div>  <!-- 結算彈窗、確認框 -->
  </div>
</body>
```
> 切換畫面 = 把目標 section 加上 `.active`、其餘移除。`#app` 永不重建,故 BGM 不中斷。

---

## 5. 響應式設計（RWD）

### 5.1 斷點
| 名稱 | 寬度範圍 | 主要佈局 |
|------|----------|----------|
| Mobile(直式) | ≤ 600px | 上下三段:HUD / 棋盤 / 控制列 |
| Tablet | 601–1024px | 棋盤置中放大,控制列可置於側邊或底部 |
| Desktop | ≥ 1025px | 棋盤置中,資訊與控制分列左右兩側 |

### 5.2 App Shell 版面（手機直式為主）
使用 CSS Grid 三段式,讓棋盤與控制列**互不重疊**：
```css
#screen-game {
  display: grid;
  grid-template-rows: auto 1fr auto;  /* HUD / 棋盤區 / 控制列 */
  height: 100dvh;                     /* 動態視窗高,避免手機網址列誤差 */
}
.board-area   { display: grid; place-items: center; min-height: 0; }
.control-dock { padding-bottom: env(safe-area-inset-bottom); } /* 避開瀏海/底部手勢條 */
```

### 5.3 棋盤自適應尺寸（關鍵）
棋盤永遠保持**正方形**,且尺寸取「可用寬度」與「可用高度」較小者,確保不溢出、不被控制列遮擋:
```css
.board {
  /* 在 board-area 內,寬高取較小邊,留邊距 */
  width:  min(92vw, calc(100dvh - 220px)); /* 220px 預留給 HUD + 控制列 */
  height: var(--board-size, 0);
  aspect-ratio: 1 / 1;
}
```
> 也可用 JS 於 `resize` 事件時計算 `board-area` 的實際可用區,動態設定棋盤邊長,更精準。

### 5.4 字級流體縮放
全站字級用 `clamp()` 隨螢幕縮放,但保有大字下限(見 §6.1)。

---

## 6. 視覺設計規範

### 6.1 字體規範（一律大字體、清晰）

| 用途 | 字級(clamp 流體) | 字重 | 備註 |
|------|------------------|------|------|
| 主標題(遊戲名) | `clamp(2rem, 7vw, 4rem)` | 800 | 選單大標 |
| 次標題 | `clamp(1.5rem, 5vw, 2.5rem)` | 700 | 區塊標題 |
| 按鈕文字 | `clamp(1.25rem, 4vw, 1.75rem)` | 700 | 大且粗 |
| 內文 / 說明 | `clamp(1.125rem, 3.5vw, 1.375rem)` | 500 | 說明頁、設定 |
| HUD 資訊 | `clamp(1rem, 3vw, 1.25rem)` | 600 | 玩家、分數 |
| 最小字級下限 | **不低於 16px** | — | 確保行動端清晰 |

字體家族建議(系統字優先,免下載):
```css
:root {
  --font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei",
                 "Heiti TC", system-ui, -apple-system, sans-serif;
  --line-height: 1.6;
}
```
> 字重粗、行高寬鬆、對比足夠,確保「明確一點」。可點元素(按鈕、棋子)最小可點區 **48×48px**。

### 6.2 多主題配色

每個主題以 **CSS 變數** 定義一組色票,切換主題 = 切換 `<html>` 上的 class 或替換 `#theme-stylesheet` 的 `href`。

主題清單(至少 6 套):

| 主題 | 風格 | 四方棋色基調 |
|------|------|-------------|
| classic | 經典鮮明 | 紅 / 綠 / 黃 / 藍 |
| ocean | 海洋冷色 | 深藍 / 青 / 天藍 / 藍綠 |
| sunset | 夕陽暖色 | 橘 / 桃紅 / 金黃 / 珊瑚 |
| forest | 森林自然 | 墨綠 / 草綠 / 土棕 / 橄欖 |
| night | 夜間深色高對比 | 霓虹紅 / 綠 / 黃 / 藍(深底) |
| high-contrast | 無障礙 | 純色 + 高對比邊框 |

主題變數結構(每支主題檔覆寫這些值):
```css
:root {
  --color-bg:        #faf3e0;
  --color-surface:   #ffffff;
  --color-text:      #1a1a1a;
  --color-primary:   #e63946;  /* 主互動色 */
  --color-accent:    #457b9d;

  --player-1: #e63946; /* 紅 */
  --player-2: #2a9d8f; /* 綠 */
  --player-3: #e9c46a; /* 黃 */
  --player-4: #277da1; /* 藍 */

  --cell-safe:  #ffd166; /* 安全格高亮 */
  --cell-track: #ffffff; /* 一般走道 */
}
```
> 切換主題後立即生效,且寫入 `localStorage` 記住選擇。

---

## 7. 主選單功能

主選單(`#screen-menu`)包含四個大按鈕:

| 按鈕 | 行為 |
|------|------|
| **開始遊戲** | 進入「模式選擇」畫面(選 AI 數量 + 難度),建立全新對局 |
| **繼續遊戲** | 讀取 `localStorage` 存檔,還原上次對局;**無存檔時此按鈕呈現停用(灰階)** |
| **說明** | 進入說明畫面,介紹規則、操作、圖示意義 |
| **設定** | 進入設定畫面(主題、音量、靜音、動畫速度、預設難度) |

附加:選單可顯示小型 logo/標題、版本號;按鈕需有 hover / press 視覺與音效。

### 7.1 模式選擇畫面（開始遊戲後）
- **對手數量**:1 個 AI(1v1)、2 個 AI、3 個 AI(四人局)。
- **AI 難度**:簡單 / 普通 / 困難(整局統一,或允許每位 AI 各自設定難度——預設統一)。
- **玩家顏色**:可讓玩家選擇自己代表的顏色。
- 「開始」後初始化棋盤、發棋至基地、決定先手。

---

## 8. 遊戲規則（Ludo 標準規則）

### 8.1 基本配置
- 4 種顏色,每色 4 顆棋子,共 16 顆。
- 棋盤含:四角 **基地(Yard)**、外圈 **52 格主走道**、每色專屬 **6 格終點通道(Home Column)**、中央 **終點(Home)**。
- 每色有一個固定的 **起始格(Start)** 與 **進通道口**。

### 8.2 出棋(放出基地)
- 棋子初始全在基地。
- **擲到 6** 才能放一顆棋子到自家起始格。
- 基地內沒有可出的棋子且場上也無可走棋子時,該回合跳過。

### 8.3 移動
- 棋子沿主走道 **順時針** 前進,步數等於骰子點數。
- 繞行一圈後,從自家通道口轉入 6 格終點通道,最終抵達中央終點。
- **進入終點需精確點數**(剛好停在終點;若點數超過則該步不可走,需改走他棋或跳過)。

### 8.4 擲 6 的額外規則
- 擲到 6 可**再擲一次**(額外回合)。
- 連續擲到三次 6,通常**第三次作廢並結束回合**(防止無限延長,可設定)。

### 8.5 吃子(Capture)
- 棋子停在 **有對手單一棋子** 的格上 → 該對手棋子被擊落,**送回其基地**。
- 被吃方需重新擲 6 才能再出棋。
- 吃子可獲得獎勵(可選:額外一次擲骰)。

### 8.6 安全格(Safe Cells)
- **安全格上的棋子不會被吃**。
- 安全格包含:四個 **起始格** + 棋盤上的 **星號格**(通常共 8 格)。
- 同色多顆棋子可疊在同格形成「堡壘」(可選規則:堡壘亦不可被吃/不可被穿越)。

### 8.7 勝利條件
- **率先將自家 4 顆棋子全部送入中央終點者獲勝**。
- 四人局可繼續比第二、三名(可選),或一勝即結束。

### 8.8 規則可設定項(寫入 config.js)
| 規則 | 預設 | 可調 |
|------|------|------|
| 進終點需精確點數 | 是 | 是/否 |
| 連三 6 作廢 | 是 | 是/否 |
| 吃子獎勵額外擲骰 | 否 | 是/否 |
| 同色堡壘不可被穿越 | 否 | 是/否 |

---

## 9. AI 邏輯（三難度）

AI 由 `ai-manager.js` 依難度分派到對應檔。AI 行動前加入 **0.4～0.9 秒思考延遲**,讓節奏自然、可看清動畫。

### 9.1 簡單（ai-easy.js）
- 從**所有合法步中隨機**挑一個。
- 不主動吃子、不防守,可能錯過明顯機會。
- 行為近似新手,讓玩家容易獲勝。

### 9.2 普通（ai-normal.js）— 啟發式評分
為每個合法步計算分數,選最高分:
| 考量 | 加權傾向 |
|------|----------|
| 可吃掉對手 | 高度加分 |
| 擲到 6 時優先放出新棋 | 加分 |
| 推進最領先的棋子 | 加分 |
| 走入/停在安全格 | 加分 |
| 走到會立即被對手吃的格 | 減分 |
| 接近終點 | 加分 |
> 屬「貪婪式」,有基本攻防意識,但不做深層推算。

### 9.3 困難（ai-hard.js）— 威脅分析 + 機率
在普通的評分基礎上,加入:
- **威脅偵測**:評估自己棋子下回合被各對手吃掉的機率(依對手棋子與本棋距離 1～6 的命中可能),主動規避或撤離高危棋子。
- **進攻評估**:不只看立即吃子,也評估「移動後本回合再擲(吃子/6 獎勵)」的連動價值。
- **終局優先**:接近終點的棋子優先送回家,降低被翻盤風險。
- **機率權衡**:對「精確進終點」「解救基地棋」等需要特定點數的情況,以機率估算期望值再決策。
- (可選)**淺層前瞻**:對關鍵局面模擬對手一回合可能骰值的反應。
> 表現如熟練玩家,攻守兼備、少失誤。

---

## 10. 遊戲狀態管理

### 10.1 狀態物件（state.js)
```js
Ludo.state.game = {
  mode: "pvai",
  players: [
    { id:0, color:"red",   isHuman:true,  difficulty:null },
    { id:1, color:"green", isHuman:false, difficulty:"hard" }
    // ...
  ],
  tokens: [ /* 每顆:{ owner, index, area:"yard|track|homecol|home", pos } */ ],
  currentPlayer: 0,
  dice: { value:0, rolled:false, sixStreak:0 },
  phase: "ROLL",       // 見狀態機
  winner: null,
  settings: { theme:"classic", bgmVolume:0.6, sfxVolume:0.8, muted:false, animSpeed:1 }
};
```

### 10.2 遊戲流程狀態機（phase）
```
BOOT → MENU → MODE_SELECT → GAME_INIT
   ↓
[ TURN_START → ROLL → (擲骰動畫) → RESOLVE_MOVES ]
   ├─ 有合法步 → AWAIT_MOVE → MOVE_ANIMATE → CAPTURE_CHECK → WIN_CHECK
   │                                              ↓ 無人勝
   │                          擲6? → 回 ROLL(額外回合) : NEXT_PLAYER → TURN_START
   └─ 無合法步 → NEXT_PLAYER → TURN_START
WIN_CHECK 有勝者 → GAME_OVER(結算彈窗) → MENU
```

### 10.3 存讀檔（storage.js）— 支援「繼續遊戲」
- **存檔時機**:每回合結束自動序列化 `Ludo.state.game` 至 `localStorage`(key 例:`ludo_save`)。
- **繼續遊戲**:讀回存檔、重建棋盤與棋子位置、回到對應 phase。
- **設定獨立儲存**:主題/音量等存於另一 key(`ludo_settings`),即使無對局也保留。
- **無存檔處理**:主選單載入時檢查 `ludo_save`,不存在則停用「繼續遊戲」按鈕。
- **`file://` 注意**:`localStorage` 在本機開檔可正常運作,但以「檔案來源」為範圍;搬移檔案路徑可能讀不到舊存檔(屬正常現象,需告知使用者)。

---

## 11. 音訊系統

### 11.1 設計原則
- **單例常駐**:`audio-manager.js` 建立唯一音訊管理器,掛於 `Ludo.audio`,生命週期等同頁面,**切換畫面不重建**,故 BGM 連續不斷。
- **自動播放限制**:瀏覽器禁止頁面在「使用者互動前」自動播放聲音。因此 **第一個按鈕點擊(如「開始遊戲」或任一點擊)時才解鎖並啟動 BGM**。
- **音量與靜音**:BGM、SFX 各自獨立音量;提供總靜音;數值寫入設定存檔。
- **BGM 切換**:選單與遊戲可用不同 BGM,以**淡入淡出(crossfade)** 平順切換,而非硬切;若希望全程同一首,則切畫面時不更換音軌。

### 11.2 背景音樂(BGM)
| 鍵 | 檔案 | 使用畫面 | 循環 |
|----|------|----------|------|
| `bgm_menu` | `menu-theme.mp3` | 選單 / 說明 / 設定 | 是 |
| `bgm_game` | `game-theme.mp3` | 遊戲中 | 是 |

### 11.3 音效清單（17 種,遠超「10 幾種」需求）
| # | 鍵 | 觸發時機 |
|---|----|----------|
| 1 | `sfx_dice_roll` | 擲骰、骰子滾動中 |
| 2 | `sfx_dice_land` | 骰子停定顯示點數 |
| 3 | `sfx_token_move` | 棋子開始移動 |
| 4 | `sfx_token_hop` | 棋子逐格跳動(每格) |
| 5 | `sfx_capture` | 吃掉對手棋子 |
| 6 | `sfx_token_home` | 棋子抵達中央終點 |
| 7 | `sfx_button_click` | 點擊任何按鈕 |
| 8 | `sfx_button_hover` | 滑鼠懸停按鈕(桌面) |
| 9 | `sfx_screen_transition` | 切換畫面 |
| 10 | `sfx_turn_start` | 輪到玩家(提示「換你了」) |
| 11 | `sfx_win` | 獲勝慶祝 |
| 12 | `sfx_lose` | 落敗 |
| 13 | `sfx_safe_cell` | 停在安全格 |
| 14 | `sfx_illegal` | 嘗試無效操作 |
| 15 | `sfx_unlock_token` | 擲到 6、從基地放出棋子 |
| 16 | `sfx_six_bonus` | 擲到 6 獲得額外回合 |
| 17 | `sfx_select_token` | 選取一顆棋子 |

### 11.4 音訊管理器介面（API)
```js
Ludo.audio.init();                         // 預載音效、建立 BGM audio 物件
Ludo.audio.unlock();                       // 首次互動時解鎖自動播放
Ludo.audio.playBgm("bgm_game", {fade:600});// 切換並淡入背景音樂
Ludo.audio.stopBgm({fade:400});
Ludo.audio.playSfx("sfx_capture");         // 播放單次音效(可重疊)
Ludo.audio.setBgmVolume(0.6);
Ludo.audio.setSfxVolume(0.8);
Ludo.audio.setMuted(true);                 // 總靜音
```
> 多個短音效可能同時觸發,建議每個 SFX 採「複製 audio 節點播放」或小型音效池,避免互相打斷。

---

## 12. 操作與輸入（input/）

### 12.1 統一指標事件（pointer.js）
- 以 **Pointer Events** 或 mouse+touch 雙軌,統一處理棋子與按鈕的點擊,確保桌面與行動端一致。
- 棋子點擊區放大、可選棋子有高亮提示。
- 防止行動端「點擊延遲」與「雙觸」。

### 12.2 行動端控制列（mobile-controls.js + controls.css）— 不擋畫面
這是需求重點。設計如下:

- **獨立控制區**:行動端的 **骰子按鈕、行動按鈕(投降/選單/音量)** 放在棋盤**下方的固定控制列(control dock)**,屬於 Grid 的第三段,**位於棋盤可視範圍之外**,棋盤永遠不被遮住(見 §5.2、§5.3 的 Grid 三段式 + 棋盤尺寸計算)。
- **避開系統區域**:控制列底部加 `env(safe-area-inset-bottom)`,避開 iPhone 底部手勢條與瀏海。
- **大可點區**:骰子與按鈕 ≥ 56px,適合拇指操作。
- **動態高亮**:輪到玩家時,骰子按鈕放大/發光提示。
- **(可選)收合浮鈕**:若空間極窄,可提供半透明、**可拖曳重新定位**的浮動骰子鈕,且預設貼邊不蓋棋盤;但**主要方案為底部固定控制列**,以確保絕不擋畫面。

### 12.3 桌面端
- 控制與資訊分列棋盤左右兩側,點擊棋子直接操作。
- 支援滑鼠懸停音效與游標變化。

---

## 13. UI 模組職責對照

| 模組 | 職責 |
|------|------|
| `screen-manager.js` | 顯示/隱藏 section、觸發切換音效、通知 audio-manager 換 BGM |
| `menu.js` | 主選單按鈕事件、檢查存檔啟用「繼續遊戲」 |
| `settings.js` | 主題切換、音量滑桿、靜音、動畫速度,即時生效並存檔 |
| `instructions.js` | 顯示規則說明(可分頁/手風琴),圖示說明 |
| `render-board.js` | 依棋盤模型繪製格子(Grid)、標示安全格與各色區 |
| `render-tokens.js` | 依 state 繪製/移動棋子 DOM,套用玩家顏色 |
| `hud.js` | 更新目前玩家、各色已到家數量、骰子點數顯示 |
| `animations.js` | 棋子逐格移動動畫、骰子翻滾動畫、吃子/勝利特效 |

---

## 14. 無障礙與體驗細節

- 對比度符合可讀標準(高對比主題可供色弱使用者)。
- 所有可互動元素可點區 ≥ 48px。
- 提供「動畫速度」設定(含關閉動畫),照顧暈動敏感者。
- 重要狀態同時以**文字 + 顏色 + 圖示**呈現(不單靠顏色辨識)。
- 鍵盤操作(可選):桌面端可用空白鍵擲骰、方向/數字鍵選棋。

---

## 15. 效能注意事項

- 棋子移動用 CSS `transform`(GPU 加速),避免逐格改 `top/left` 造成重排。
- 音效採音效池,避免每次 `new Audio()` 反覆配置。
- `resize` 事件節流(throttle/debounce)後再重算棋盤尺寸。
- 圖片資源壓縮;若用純 CSS 繪製棋子與棋盤可省去圖檔。

---

## 16. 驗收清單（對應原始需求）

| # | 需求 | 對應規格 | 驗收標準 |
|---|------|----------|----------|
| 1 | 純前端、雙擊 index.html 即玩 | §0.1、§2、§4 | `file://` 直接開啟可完整遊玩,無需 server/build |
| 2 | RWD 桌面與行動皆順暢 | §5、§12 | 三斷點下版面正常,操作流暢無溢出 |
| 3 | 大字體、明確、多配色 | §6 | 字級達標、對比清晰,可切換 6+ 主題 |
| 4 | CSS/JS 分類資料夾、index 引入 | §3、§4 | 目錄分層清楚,index 以 link/script 引入 |
| 5 | 主選單四功能 | §7 | 開始/繼續/說明/設定皆可用 |
| 6 | 豐富音效(10+)、切畫面音樂持續 | §11 | 17 種音效齊備,切畫面 BGM 不中斷 |
| 7 | 玩家 vs AI,三難度 | §8、§9 | 可選簡單/普通/困難,行為有明顯差異 |
| 8 | 行動按鍵不擋遊戲畫面 | §5.2、§5.3、§12.2 | 棋盤永不被控制列遮擋 |

---

## 17. 後續可擴充項（非本期範圍）

- 雙人對戰(本機 / 線上)。
- 對局回放與統計。
- 成就系統、棋子皮膚商店。
- 多語系(i18n)。
- PWA 化(離線安裝、加入主畫面)。

---

*文件結束。如需我接著依此規格產出可執行的程式碼骨架(可直接開檔的 index.html + 各分類檔),再告訴我即可。*
