# Space Invaders（太空侵略者）遊戲規格書

> 版本：v1.0
> 類型：純前端網頁遊戲（無需 build、無需 server）
> 目標平台：桌面瀏覽器 + 行動裝置瀏覽器

---

## 1. 專案概述

本專案為經典街機遊戲《Space Invaders（太空侵略者）》的網頁復刻版。玩家操控底部砲台，射擊由上方逐步逼近的外星侵略者陣列，並躲避其回擊。本規格書定義整體架構、檔案結構、畫面流程、響應式設計、視覺風格、音訊系統與遊戲玩法。

核心設計原則：

- **零依賴啟動**：直接以瀏覽器開啟 `index.html` 即可遊玩,不需安裝 Node、不需編譯、不需架設伺服器。
- **單頁多狀態**：整個遊戲是一個 HTML 頁面,透過 JavaScript 狀態機切換「主選單／遊戲中／暫停／設定／說明／結束」等畫面,而非真正的頁面跳轉。這也是讓背景音樂能跨畫面連續播放的關鍵。
- **模組化**：CSS 與 JavaScript 依職責分資料夾,`index.html` 只負責引入。

---

## 2. 需求對照表

| 編號 | 需求 | 對應章節 | 實作重點 |
|------|------|----------|----------|
| 1 | 純前端,點 index.html 即可玩 | §3, §4 | 全部使用原生 ES Module 或一般 `<script>` 引入;音訊／圖片用相對路徑;`fetch` 僅讀本地檔案 |
| 2 | RWD,行動裝置與網頁皆順暢 | §6 | 彈性畫布、虛擬觸控按鈕、媒體查詢、`viewport` 設定 |
| 3 | 字體大而明確,多種配色可選 | §7 | 大字級基準、像素風字體、可切換主題色 |
| 4 | CSS／JS 分類至資料夾,index 用引入方式 | §4 | css/ 與 js/ 子資料夾,index 僅 `<link>`／`<script>` |
| 5 | 主畫面含開始、繼續、說明、設定 | §5 | 狀態機 + 主選單四顆按鈕 |
| 6 | 豐富音樂音效,切換畫面音樂持續播放 | §8 | 單一 AudioManager 集中管理,跨狀態不重啟音軌 |

---

## 3. 技術架構

- **語言**：原生 HTML5 + CSS3 + JavaScript（ES2015+）
- **繪圖**：HTML5 `<canvas>` 2D Context 繪製遊戲畫面;選單／設定等 UI 用 DOM + CSS
- **模組系統**：建議使用原生 `<script type="module">` 的 ES Module。

  > ⚠️ 注意：部分瀏覽器在 `file://` 協定下會因 CORS 限制而無法載入 ES Module。為了確保「雙擊 index.html 即可開啟」這項需求,有兩種做法擇一:
  > - **方案 A（推薦,最穩）**：所有 JS 檔以一般 `<script src="...">` 依序引入,透過全域命名空間（如 `window.Game`）或 IIFE 模組模式串接,完全不依賴 `import/export`,在 `file://` 下 100% 可運作。
  > - **方案 B**：使用 ES Module（`import/export`),程式碼較乾淨,但需提醒使用者若遇到載入問題,可改用「以本機伺服器開啟」或改回方案 A。
  >
  > 本規格書的檔案結構同時適用兩種方案;預設採 **方案 A** 以滿足「無需 server」的硬需求。
- **狀態儲存**：`localStorage`（存放繼續遊戲的進度、設定偏好、最高分）
- **無外部 CDN／套件**：所有資源放在專案資料夾內,離線可玩。

---

## 4. 檔案結構

```
space-invaders/
├── index.html                  # 唯一進入點,只負責引入 CSS / JS / 宣告 DOM 容器
│
├── css/
│   ├── reset.css               # 瀏覽器預設樣式重置
│   ├── variables.css           # CSS 變數:配色主題、字級、間距(主題切換核心)
│   ├── base.css                # 全域字體、背景、通用文字樣式
│   ├── layout.css              # 整體版面、置中、畫布容器
│   ├── menu.css                # 主選單、按鈕樣式
│   ├── screens.css             # 說明、設定、暫停、結束等覆蓋層畫面
│   ├── hud.css                 # 遊戲中分數、生命、關卡顯示
│   ├── controls.css            # 行動裝置虛擬觸控按鈕
│   └── responsive.css          # 媒體查詢、橫直向適配
│
├── js/
│   ├── main.js                 # 啟動點:初始化、綁定事件、啟動狀態機
│   ├── config.js               # 全域常數:速度、分數、關卡參數、配色清單
│   │
│   ├── core/
│   │   ├── stateManager.js     # 畫面狀態機(menu/playing/paused/settings/help/gameover)
│   │   ├── gameLoop.js         # requestAnimationFrame 主迴圈、delta time
│   │   └── game.js             # 遊戲主控:整合實體、碰撞、關卡、分數
│   │
│   ├── entities/
│   │   ├── player.js           # 玩家砲台:移動、射擊、生命
│   │   ├── invader.js          # 單一侵略者
│   │   ├── invaderFleet.js     # 侵略者陣列:整體移動、下降、加速
│   │   ├── bullet.js           # 子彈(玩家與敵方共用,以方向區分)
│   │   ├── barrier.js          # 防護罩/掩體
│   │   └── ufo.js              # 上方隨機飛過的神秘飛碟(加分用)
│   │
│   ├── audio/
│   │   └── audioManager.js     # 集中管理所有 BGM 與音效(跨畫面連續播放核心)
│   │
│   ├── ui/
│   │   ├── menu.js             # 主選單互動
│   │   ├── settings.js         # 設定畫面:音量、主題、難度
│   │   ├── help.js             # 說明畫面
│   │   └── hud.js              # 分數、生命、關卡更新
│   │
│   └── utils/
│       ├── input.js            # 鍵盤 + 觸控輸入整合
│       ├── storage.js          # localStorage 讀寫封裝
│       └── helpers.js          # 碰撞偵測、亂數、夾值等工具函式
│
└── assets/
    ├── audio/
    │   ├── music/
    │   │   ├── menu-theme.mp3      # 主選單背景音樂
    │   │   ├── gameplay-theme.mp3  # 遊戲進行中背景音樂
    │   │   ├── boss-theme.mp3      # (選用)頭目/高關卡音樂
    │   │   └── gameover-theme.mp3  # 結束畫面音樂
    │   └── sfx/
    │       ├── shoot.mp3           # 玩家射擊
    │       ├── invader-move-1.mp3  # 侵略者移動節拍(四音循環)
    │       ├── invader-move-2.mp3
    │       ├── invader-move-3.mp3
    │       ├── invader-move-4.mp3
    │       ├── invader-killed.mp3  # 擊殺侵略者
    │       ├── player-explosion.mp3# 玩家被擊中
    │       ├── ufo-fly.mp3         # 飛碟飛過(循環)
    │       ├── ufo-killed.mp3      # 擊落飛碟
    │       ├── barrier-hit.mp3     # 掩體被打
    │       ├── ui-click.mp3        # 按鈕點擊
    │       ├── ui-hover.mp3        # 按鈕滑入
    │       ├── level-up.mp3        # 過關
    │       ├── extra-life.mp3      # 額外生命
    │       └── game-start.mp3      # 開始遊戲
    └── images/
        ├── favicon.png
        └── (可選)sprite 圖,若不用 canvas 純色繪製
```

`index.html` 範例引入順序（方案 A,一般 script）：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Space Invaders</title>

  <!-- CSS:依層級引入 -->
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/menu.css" />
  <link rel="stylesheet" href="css/screens.css" />
  <link rel="stylesheet" href="css/hud.css" />
  <link rel="stylesheet" href="css/controls.css" />
  <link rel="stylesheet" href="css/responsive.css" />
</head>
<body data-theme="classic-green">
  <div id="app"><!-- 選單、覆蓋層、canvas 容器皆在此 --></div>

  <!-- JS:工具與設定先載入,主控與啟動最後 -->
  <script src="js/config.js"></script>
  <script src="js/utils/helpers.js"></script>
  <script src="js/utils/storage.js"></script>
  <script src="js/utils/input.js"></script>
  <script src="js/audio/audioManager.js"></script>
  <script src="js/entities/bullet.js"></script>
  <script src="js/entities/player.js"></script>
  <script src="js/entities/invader.js"></script>
  <script src="js/entities/invaderFleet.js"></script>
  <script src="js/entities/barrier.js"></script>
  <script src="js/entities/ufo.js"></script>
  <script src="js/core/gameLoop.js"></script>
  <script src="js/core/game.js"></script>
  <script src="js/core/stateManager.js"></script>
  <script src="js/ui/hud.js"></script>
  <script src="js/ui/menu.js"></script>
  <script src="js/ui/settings.js"></script>
  <script src="js/ui/help.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

---

## 5. 畫面與狀態設計

整個遊戲由 `stateManager` 控制,所有畫面都是同一頁中的 DOM 覆蓋層或 canvas 內容,**不做頁面跳轉**（這是音樂能連續播放的前提）。

### 5.1 狀態一覽

| 狀態 | 說明 | 主要顯示 |
|------|------|----------|
| `MENU` | 主選單 | 標題、四顆按鈕 |
| `PLAYING` | 遊戲進行 | Canvas 遊戲畫面 + HUD |
| `PAUSED` | 暫停 | 半透明覆蓋層 + 繼續/回主選單 |
| `SETTINGS` | 設定 | 音量、主題、難度 |
| `HELP` | 說明 | 操作與規則文字 |
| `GAMEOVER` | 結束 | 分數、最高分、重玩/回主選單 |

### 5.2 主選單（需求 5）

主選單需包含四個明確按鈕:

1. **開始遊戲（New Game）**
   - 清除既有進度,從第 1 關、滿生命開始。
   - 進入 `PLAYING`,播放 `game-start` 音效並切換至遊戲 BGM。

2. **繼續遊戲（Continue）**
   - 從 `localStorage` 讀取上次的關卡、分數、生命。
   - 若無存檔,此按鈕呈現「禁用／灰階」狀態並提示「無存檔」。
   - 進度於每次過關或暫停時自動寫入。

3. **說明（How to Play）**
   - 進入 `HELP`,顯示操作方式、敵人分數、得分規則。
   - 可由說明畫面返回主選單。

4. **設定（Settings）**
   - 進入 `SETTINGS`,詳見 §9。

### 5.3 狀態轉換圖

```
            ┌──────────────────────────────────────────┐
            ▼                                            │
[啟動] → MENU ──開始/繼續──▶ PLAYING ──Esc/暫停──▶ PAUSED ─┘
            │  │  │              │  ▲                  │
         說明│設定│              │  └──繼續────────────┘
            ▼  ▼                 ▼
          HELP SETTINGS       GAMEOVER ──重玩──▶ PLAYING
            │  │                 │
            └──┴──返回──▶ MENU ◀──回主選單────────┘
```

---

## 6. 響應式設計（RWD,需求 2）

### 6.1 畫布縮放策略

- Canvas 採固定的**邏輯解析度**(如 `800 × 1000`,以遊戲座標運算),再透過 CSS 等比縮放至容器,確保不同螢幕比例下遊戲邏輯一致。
- 容器使用 `max-width: 100vw; max-height: 100vh;`,並以 `aspect-ratio` 維持比例,避免變形。
- 監聽 `resize` 與 `orientationchange`,重新計算縮放係數。

### 6.2 輸入適配

| 裝置 | 操作方式 |
|------|----------|
| 桌面 | 鍵盤:`←`/`→` 或 `A`/`D` 移動;`Space` 射擊;`Esc`/`P` 暫停 |
| 行動裝置 | 螢幕底部虛擬按鈕:左移、右移、射擊;畫面右上角暫停鈕 |

- `js/utils/input.js` 將鍵盤與觸控事件統一抽象成 `actions { left, right, fire, pause }`,遊戲邏輯只讀這層,不關心來源。
- 觸控按鈕支援 `touchstart`/`touchend` 的「按住持續移動／連續射擊」。
- 虛擬控制鈕僅在觸控裝置（或小螢幕）顯示,桌面隱藏(`@media (hover: none)` 或寬度判斷)。

### 6.3 斷點建議

```css
/* responsive.css */
/* 手機直向 */
@media (max-width: 600px) { /* 放大觸控鈕、縮減邊距、字級微調 */ }
/* 平板 */
@media (min-width: 601px) and (max-width: 1024px) { /* 中型佈局 */ }
/* 桌面 */
@media (min-width: 1025px) { /* 隱藏觸控鈕,顯示鍵盤提示 */ }
/* 橫向(高度受限) */
@media (orientation: landscape) and (max-height: 500px) { /* 控制列改側邊 */ }
```

- 設定 `touch-action: none;` 於遊戲區域,避免行動裝置的捲動／縮放干擾操作。

---

## 7. 字體與配色（需求 3）

### 7.1 字體

- 採用清晰、辨識度高的像素／街機風字體(如 `Press Start 2P`、`VT323` 或系統等寬字),須以本地檔案或系統字體 fallback 避免外連。
- **大字級基準**:以 CSS 變數定義,行動裝置不縮太小。

```css
/* variables.css */
:root {
  --font-size-base: clamp(18px, 2.4vw, 24px);
  --font-size-lg:   clamp(24px, 4vw, 40px);
  --font-size-xl:   clamp(32px, 6vw, 64px);  /* 標題 */
  --font-family-game: "Press Start 2P", "VT323", monospace;
  --letter-spacing: 0.05em;
  --line-height: 1.6;
}
```

- 所有按鈕、選單文字、HUD 數字皆套用大字級,確保「字體大而明確」。

### 7.2 多種配色主題

以 `body[data-theme]` 屬性切換,主題色集中於 `variables.css`,設定畫面可即時切換並存入 `localStorage`。

```css
/* 經典綠（預設） */
[data-theme="classic-green"] {
  --bg: #000000;        --fg: #00ff66;
  --accent: #00ff66;    --enemy: #00ff66;
  --player: #ffffff;    --danger: #ff3333;
}
/* 復古琥珀 */
[data-theme="amber"] {
  --bg: #1a0f00;        --fg: #ffb000;
  --accent: #ffd166;    --enemy: #ff8800;
  --player: #fff4d6;    --danger: #ff4d4d;
}
/* 霓虹紫 */
[data-theme="neon-purple"] {
  --bg: #0d0221;        --fg: #b388ff;
  --accent: #ff2 a6d;   --enemy: #7c4dff;
  --player: #00e5ff;    --danger: #ff1744;
}
/* 海洋藍 */
[data-theme="ocean-blue"] {
  --bg: #001018;        --fg: #29b6f6;
  --accent: #00e5ff;    --enemy: #4fc3f7;
  --player: #e0f7fa;    --danger: #ff5252;
}
/* 高對比(無障礙) */
[data-theme="high-contrast"] {
  --bg: #000000;        --fg: #ffffff;
  --accent: #ffff00;    --enemy: #ffffff;
  --player: #00ffff;    --danger: #ff0000;
}
```

> Canvas 內的繪製顏色不能直接吃 CSS 變數,需在 JS 端讀取目前主題色(`getComputedStyle`)或維護一份對應的 JS 配色表,於主題切換時同步更新 canvas 繪製用色。

建議至少提供 **5 種主題**:經典綠、琥珀、霓虹紫、海洋藍、高對比。

---

## 8. 音樂與音效系統（需求 6,重點)

### 8.1 設計目標

- 音樂與音效種類豐富(背景音樂多軌、操作與戰鬥音效多樣)。
- **切換畫面時背景音樂持續播放、不中斷、不重頭播放**——這由「單一 AudioManager + 單頁狀態機」共同保證。

### 8.2 AudioManager 職責（`js/audio/audioManager.js`)

集中管理所有音訊,對外提供簡單介面,其他模組不直接 new `Audio()`。

核心方法:

```
audioManager.init()                         // 預載入所有音訊
audioManager.playMusic(trackName, opts)     // 播放/切換 BGM
audioManager.stopMusic()
audioManager.playSfx(sfxName)               // 播放音效(可重疊)
audioManager.setMusicVolume(0~1)
audioManager.setSfxVolume(0~1)
audioManager.muteAll(bool)
audioManager.crossfade(fromTrack, toTrack, ms)
```

### 8.3 音樂連續播放的關鍵規則

1. **同一個 Audio 物件不重複建立**:每首 BGM 對應一個常駐 `Audio` 實例,`loop = true`。
2. **切換畫面 ≠ 重啟音樂**:狀態切換時,`playMusic()` 須先判斷「目前正在播的音軌是否就是目標音軌」:
   - 若**相同**(例如選單 → 設定 → 說明,都共用選單音樂)→ **不做任何事**,讓它繼續播。
   - 若**不同**(例如選單 → 遊戲)→ 用 `crossfade` 淡出舊曲、淡入新曲,避免硬切。
3. **暫停遊戲時**:BGM 可選擇「降低音量(ducking)」而非停止,回到遊戲再升回原音量;`currentTime` 不重置。
4. **音軌與狀態對應**:

   | 狀態 | 背景音樂 |
   |------|----------|
   | MENU / SETTINGS / HELP | `menu-theme`(三畫面共用,故切換不重啟) |
   | PLAYING | `gameplay-theme`(高關卡可切 `boss-theme`) |
   | PAUSED | 沿用 `gameplay-theme`,僅降音量 |
   | GAMEOVER | `gameover-theme` |

5. **瀏覽器自動播放限制**:多數瀏覽器禁止頁面載入即自動播放有聲音樂。須在**使用者第一次互動**(點擊任意按鈕)後才呼叫 `audioManager.init()` / 開始播放;在此之前可顯示「點擊開始」遮罩。

### 8.4 音效清單

- **戰鬥**:玩家射擊、擊殺侵略者、玩家爆炸、掩體被擊中、飛碟飛過(循環)、擊落飛碟。
- **侵略者節拍**:四音循環(`invader-move-1~4`),隨陣列剩餘數量越少播放越快,重現經典緊張感。
- **系統／UI**:按鈕點擊、按鈕滑入、開始遊戲、過關、額外生命、遊戲結束。
- 音效以 `playSfx()` 觸發,可同時多個重疊(每次播放 clone 一份或使用音效池避免互相打斷)。

### 8.5 格式建議

- BGM:`.mp3` 或 `.ogg`(體積小、相容性佳),建議同時提供雙格式做 fallback。
- 短音效:`.mp3`/`.wav`;高頻音效建議用音效池(pool)避免延遲。

---

## 9. 設定功能（需求 5 + 3 + 6）

`SETTINGS` 畫面提供:

| 設定項 | 內容 | 儲存 |
|--------|------|------|
| 背景音樂音量 | 0–100 滑桿 | localStorage |
| 音效音量 | 0–100 滑桿 | localStorage |
| 靜音開關 | 一鍵全靜音 | localStorage |
| 配色主題 | 下拉/色塊選擇(§7.2 的 5 種) | localStorage |
| 難度 | 簡單／普通／困難(影響敵人速度、子彈頻率) | localStorage |
| 重置最高分 | 清除排行紀錄 | localStorage |

- 所有設定即時生效(改音量馬上聽到、改主題馬上變色)。
- 由 `js/utils/storage.js` 統一讀寫,App 啟動時套用上次偏好。

---

## 10. 遊戲玩法規格

### 10.1 基本規則

- 玩家砲台位於畫面底部,可左右移動與射擊。
- 上方為 5 列 × 11 欄的侵略者陣列,整體左右移動,碰到邊界後下降一格並反向、同時加速。
- 侵略者會週期性向下發射子彈;玩家有數座掩體可阻擋(會逐漸被打穿)。
- 上方偶爾出現飛碟(UFO),擊落得高分。

### 10.2 勝負條件

- **過關**:消滅該關所有侵略者 → 進入下一關(更快、更密)。
- **失敗(Game Over)**:玩家生命歸零,或侵略者陣列下降抵達玩家高度。

### 10.3 計分（顯示於說明畫面)

| 目標 | 分數 |
|------|------|
| 前排(底層)侵略者 | 10 |
| 中排侵略者 | 20 |
| 後排(頂層)侵略者 | 30 |
| 飛碟(UFO) | 50–300 隨機 |

- 每達特定分數給予額外生命(`extra-life` 音效)。
- 最高分存於 `localStorage`。

### 10.4 HUD

遊戲中固定顯示:目前分數、最高分、剩餘生命、目前關卡。字級套用大字基準(§7.1)。

---

## 11. 存檔與「繼續遊戲」

- `localStorage` 鍵值建議:

  ```
  si_save      → { level, score, lives, fleetState, timestamp }
  si_highscore → number
  si_settings  → { musicVol, sfxVol, muted, theme, difficulty }
  ```

- 寫入時機:每次過關、暫停、或離開遊戲畫面。
- 主選單「繼續遊戲」依 `si_save` 是否存在決定可用/禁用。
- 「開始遊戲」會覆蓋 `si_save`。

---

## 12. 開發與驗收清單

- [ ] 雙擊 `index.html` 可直接開啟並遊玩,無需任何指令或伺服器。
- [ ] CSS、JS 已依資料夾分類,`index.html` 僅以 `<link>`／`<script>` 引入。
- [ ] 桌面鍵盤與行動裝置觸控皆可順暢操作,畫面不變形。
- [ ] 字體大且清晰,至少 5 種主題可即時切換。
- [ ] 主選單具備「開始／繼續／說明／設定」四項功能,繼續遊戲能正確讀檔。
- [ ] BGM 多軌、音效多樣;選單 → 設定 → 說明切換時音樂連續不重啟;選單 → 遊戲為淡入淡出切換。
- [ ] 首次互動後才播放音訊,符合瀏覽器自動播放政策。
- [ ] 設定(音量、主題、難度)即時生效並持久化。
- [ ] 過關加速、Game Over 判定、計分與最高分正確。

---

## 附錄 A：建議開發順序

1. 建立檔案結構與 `index.html` 骨架,確認引入無誤。
2. 完成 `stateManager` 與主選單畫面切換(先不接遊戲)。
3. 接 `AudioManager`,先驗證「跨畫面音樂連續」這項最容易出錯的需求。
4. 實作 canvas 遊戲核心:玩家、子彈、侵略者陣列、碰撞。
5. 加掩體、UFO、關卡與計分。
6. 接 HUD、設定、存檔、繼續遊戲。
7. RWD 與觸控控制最後打磨,實機測試行動裝置。
8. 補齊音效種類與多主題,跑驗收清單。
