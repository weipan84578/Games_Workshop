# Bubble Shooter（泡泡龍）遊戲規格書

> 版本：v1.0
> 文件類型：純前端網頁遊戲規格書
> 目標平台：桌面瀏覽器 + 行動裝置瀏覽器（RWD）

---

## 1. 專案概述

本專案為一款純前端的「泡泡龍（Bubble Shooter）」消除類遊戲。玩家從畫面底部發射彩色泡泡，當三顆以上同色泡泡相連即可消除；脫離頂端、失去連接的泡泡會整串掉落。遊戲以單頁應用（SPA）方式運作，所有畫面切換皆透過顯示／隱藏 DOM 區塊完成，不做真正的頁面跳轉，藉此確保背景音樂能在切換畫面時持續不中斷。

### 1.1 核心特色

- 純前端、零依賴、零建置流程，直接以瀏覽器開啟即可遊玩。
- 完整 RWD，桌面與手機（觸控）皆可順暢操作。
- 大字體、高辨識度 UI，並提供多組可切換的配色主題。
- CSS 與 JavaScript 依職責分類至各資料夾，`index.html` 以引入方式載入。
- 豐富的背景音樂與音效，並確保切換畫面時音樂持續播放。

---

## 2. 技術規格與關鍵決策

### 2.1 執行環境需求（需求 1）

| 項目 | 規格 |
| --- | --- |
| 啟動方式 | 直接以滑鼠雙擊 `index.html`，由瀏覽器以 `file://` 協定開啟 |
| 建置流程 | 無，不需 npm / webpack / vite 等任何 build 步驟 |
| 伺服器 | 無，不需啟動任何本機或遠端 server |
| 相依套件 | 無外部框架，純原生 HTML5 + CSS3 + Vanilla JavaScript（ES5/ES6 語法，但不使用 ES Module 機制，原因見 2.2） |
| 繪圖技術 | HTML5 `<canvas>` 2D Context 負責泡泡與遊戲場景渲染 |

### 2.2 模組化方案的關鍵決策（需求 1 與需求 4 的衝突解法）

> **重要技術約束**：ES6 的 `import / export` 模組在 `file://` 協定下，會被瀏覽器（尤其是 Chrome / Edge）的 CORS 政策封鎖，必須透過 HTTP server 才能載入。這與「直接點擊 index.html」需求直接衝突。

**採用方案**：使用傳統 `<script src="...">` 標籤「依序載入」，並搭配「全域單一命名空間」模式，達成模組化分檔但不需 server。

- 不使用 `type="module"`、`import`、`export`。
- 每支 JS 檔案將自身功能掛載到單一全域物件 `window.BubbleShooter`（簡稱 `BS`）底下的子命名空間，例如 `BS.Game`、`BS.Audio`、`BS.UI`。
- `index.html` 內的 `<script>` 載入順序必須依照相依關係由底層到上層排列（utils → core → game → audio → ui → main）。
- CSS 的 `<link rel="stylesheet">` 在 `file://` 下完全正常，可自由分檔引入。

此方案同時滿足「免 server 直接開啟」與「程式碼分類模組化」兩項需求。

### 2.3 資料持久化

| 用途 | 技術 | 說明 |
| --- | --- | --- |
| 繼續遊戲存檔 | `localStorage` | 儲存目前關卡盤面、分數、發射泡泡顏色佇列 |
| 使用者設定 | `localStorage` | 儲存音量、配色主題、音效開關等 |

> 註：`localStorage` 在 `file://` 協定下多數現代瀏覽器可正常運作，但各瀏覽器的 origin 隔離行為略有差異。實作時須對 `localStorage` 讀寫包覆 `try/catch`，並在不可用時優雅降級（記憶體暫存、停用「繼續遊戲」按鈕）。

---

## 3. 檔案與資料夾結構（需求 4）

```
bubble-shooter/
│
├── index.html                  # 唯一進入點，以 link / script 引入所有資源
│
├── css/
│   ├── base/
│   │   ├── reset.css           # 樣式重置（normalize）
│   │   ├── variables.css       # CSS 變數：間距、字級、預設主題色票
│   │   └── typography.css      # 全域字體與大字級設定（需求 3）
│   ├── layout/
│   │   ├── responsive.css      # RWD 斷點與版面（需求 2）
│   │   └── screens.css         # 各畫面（選單／遊戲／設定）容器版面
│   ├── components/
│   │   ├── buttons.css         # 按鈕樣式
│   │   ├── modal.css           # 彈窗（說明、暫停、結算）
│   │   ├── slider.css          # 音量滑桿等控制項
│   │   └── hud.css             # 遊戲內分數列、暫停鍵
│   ├── themes/
│   │   ├── theme-classic.css   # 經典主題
│   │   ├── theme-ocean.css     # 海洋主題
│   │   ├── theme-candy.css     # 糖果主題
│   │   ├── theme-neon.css      # 霓虹主題
│   │   └── theme-dark.css      # 暗黑主題
│   └── main.css                # 彙整入口（可選，或於 index 個別引入）
│
├── js/
│   ├── utils/
│   │   ├── namespace.js        # 建立 window.BubbleShooter (BS) 全域命名空間（須最先載入）
│   │   ├── helpers.js          # 通用工具：亂數、向量運算、夾值
│   │   └── storage.js          # localStorage 安全讀寫封裝
│   ├── core/
│   │   ├── config.js           # 遊戲常數設定（泡泡半徑、列數、顏色數）
│   │   ├── loop.js             # requestAnimationFrame 主迴圈
│   │   └── state.js            # 全域遊戲狀態機（MENU / PLAYING / PAUSED / OVER）
│   ├── game/
│   │   ├── bubble.js           # 單顆泡泡物件
│   │   ├── grid.js             # 六角蜂巢盤面、座標換算、相鄰判定
│   │   ├── shooter.js          # 發射器、瞄準、軌跡與牆面反彈
│   │   ├── collision.js        # 碰撞偵測與吸附定位
│   │   ├── match.js            # 同色相連搜尋、消除、懸空泡泡掉落判定
│   │   └── renderer.js         # canvas 繪製
│   ├── audio/
│   │   └── audioManager.js     # 音樂／音效管理器（單例，跨畫面持續播放）
│   ├── ui/
│   │   ├── screens.js          # 畫面切換控制（show/hide）
│   │   ├── menu.js             # 主選單按鈕事件
│   │   ├── settings.js         # 設定畫面邏輯（主題、音量）
│   │   ├── instructions.js     # 說明畫面邏輯
│   │   └── hud.js              # 遊戲內介面（分數、暫停）
│   └── main.js                 # 啟動點：初始化各模組、綁定事件（最後載入）
│
└── assets/
    ├── audio/
    │   ├── bgm/
    │   │   ├── menu.mp3         # 主選單背景音樂
    │   │   ├── game.mp3         # 遊戲中背景音樂
    │   │   └── victory.mp3      # 過關／結算音樂
    │   └── sfx/
    │       ├── shoot.mp3        # 發射音效
    │       ├── bounce.mp3       # 牆面反彈音效
    │       ├── attach.mp3       # 泡泡吸附音效
    │       ├── pop.mp3          # 消除音效
    │       ├── drop.mp3         # 懸空泡泡掉落音效
    │       ├── combo.mp3        # 連消（combo）音效
    │       ├── click.mp3        # 按鈕點擊音效
    │       ├── win.mp3          # 勝利音效
    │       └── lose.mp3         # 失敗音效
    └── images/
        └── (選用：泡泡貼圖、背景圖等，預設以 canvas 純色繪製)
```

### 3.1 index.html 引入順序（範例）

```html
<!-- CSS：順序為 base → layout → components → themes -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/responsive.css">
<link rel="stylesheet" href="css/layout/screens.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/slider.css">
<link rel="stylesheet" href="css/components/hud.css">
<link rel="stylesheet" href="css/themes/theme-classic.css">
<!-- 其餘主題透過 JS 動態切換 data-theme 屬性即可，不需全部 link -->

<!-- JS：嚴格依相依順序載入，不使用 type="module" -->
<script src="js/utils/namespace.js"></script>
<script src="js/utils/helpers.js"></script>
<script src="js/utils/storage.js"></script>
<script src="js/core/config.js"></script>
<script src="js/core/state.js"></script>
<script src="js/core/loop.js"></script>
<script src="js/game/bubble.js"></script>
<script src="js/game/grid.js"></script>
<script src="js/game/collision.js"></script>
<script src="js/game/match.js"></script>
<script src="js/game/shooter.js"></script>
<script src="js/game/renderer.js"></script>
<script src="js/audio/audioManager.js"></script>
<script src="js/ui/screens.js"></script>
<script src="js/ui/menu.js"></script>
<script src="js/ui/settings.js"></script>
<script src="js/ui/instructions.js"></script>
<script src="js/ui/hud.js"></script>
<script src="js/main.js"></script>
```

> 建議所有主題色票改以 CSS 變數 + `data-theme` 屬性實作（見第 6 節），切換主題只需更動 `<html data-theme="ocean">`，不需重新載入樣式檔。

---

## 4. 畫面與功能規格

### 4.1 畫面清單

| 畫面 | 識別 ID | 說明 |
| --- | --- | --- |
| 主選單 | `#screen-menu` | 遊戲首頁，含四大功能按鈕 |
| 遊戲畫面 | `#screen-game` | canvas 遊戲區 + HUD |
| 說明 | `#screen-instructions` | 玩法說明（以彈窗或獨立畫面呈現） |
| 設定 | `#screen-settings` | 音量、主題、音效開關 |
| 暫停彈窗 | `#modal-pause` | 遊戲中暫停 |
| 結算彈窗 | `#modal-result` | 勝利／失敗結算 |

所有畫面以「同頁切換」方式運作：切換時僅變更 CSS 顯示狀態（`.is-active`），DOM 不重建，`<audio>` 元素恆存於 DOM，保證音樂連續性。

### 4.2 主選單功能（需求 5）

| 按鈕 | 行為 |
| --- | --- |
| **開始遊戲** | 清空既有存檔狀態，初始化新盤面，切換至遊戲畫面並開始 |
| **繼續遊戲** | 從 `localStorage` 讀取存檔還原盤面與分數；若無有效存檔則按鈕為停用（disabled）灰階狀態 |
| **說明** | 開啟說明畫面 / 彈窗，介紹操作方式與消除規則 |
| **設定** | 開啟設定畫面，調整音量、主題、音效開關 |

按鈕需求：

- 字級大、對比高、觸控目標 ≥ 48×48px（行動裝置可點擊性）。
- 滑鼠 hover、觸控 active 皆有視覺回饋。
- 點擊時播放 `click.mp3` 音效。

### 4.3 遊戲玩法規格

#### 4.3.1 盤面

- 採用六角蜂巢（hex）排列：奇數列與偶數列水平錯位半個泡泡。
- 預設顏色數量：5～6 色（可於 `config.js` 調整）。
- 初始填入頂端數列泡泡。

#### 4.3.2 發射機制

- 發射器固定於畫面底部中央。
- **桌面**：滑鼠移動決定瞄準角度，點擊（或空白鍵）發射。
- **行動裝置**：手指拖曳瞄準，放開發射；或點擊目標點發射。
- 顯示瞄準輔助線，並計算與兩側牆面的反彈軌跡。
- 角度限制：禁止過於水平或向下發射（限制在約 15°～165°）。
- 持有「目前泡泡」與「下一顆泡泡」預覽。

#### 4.3.3 碰撞與吸附

- 飛行泡泡碰到既有泡泡或頂端邊界時，吸附到最近的合法蜂巢格。
- 吸附後播放 `attach.mp3`。

#### 4.3.4 消除規則

- 吸附後，從該泡泡開始做同色 flood-fill 搜尋。
- 同色相連數量 ≥ 3 → 全部消除，播放 `pop.mp3`，依消除數量可加播 `combo.mp3`。
- 消除後檢查「懸空泡泡」：任何不再與頂端相連的泡泡整串掉落，播放 `drop.mp3`。
- 計分：基礎分 × 消除數量，連消（combo）有加成。

#### 4.3.5 勝負條件

- **勝利**：盤面所有泡泡清空 → 播放 `win.mp3`，顯示結算彈窗，背景轉為 `victory.mp3`。
- **失敗**：泡泡堆疊觸及底部死亡線 → 播放 `lose.mp3`，顯示結算彈窗。
- 結算彈窗提供「重新開始」與「回主選單」。

#### 4.3.6 遊戲內 HUD

- 目前分數（大字級顯示）。
- 暫停按鈕（開啟暫停彈窗，暫停主迴圈但不停 BGM，或依設定淡化音量）。
- 下一顆泡泡顏色預覽。

---

## 5. RWD 響應式設計（需求 2）

### 5.1 設計原則

- 採 Mobile First，先定義手機版面再以斷點放大。
- canvas 尺寸隨容器自適應：以 CSS 設定顯示尺寸，並依 `devicePixelRatio` 設定實際繪圖緩衝區，避免高解析螢幕模糊。
- 視窗 `resize` 與裝置旋轉時重新計算 canvas 尺寸與泡泡半徑（維持比例）。

### 5.2 建議斷點

| 斷點 | 寬度 | 版面策略 |
| --- | --- | --- |
| 手機直式 | < 600px | 單欄、按鈕全寬、canvas 佔滿寬度 |
| 平板 | 600px – 1024px | 加大邊距，canvas 維持比例置中 |
| 桌面 | > 1024px | 固定最大寬度容器置中，兩側留白 |

### 5.3 觸控與輸入

- 遊戲區須呼叫 `touchstart / touchmove / touchend`，並 `preventDefault` 避免頁面捲動與縮放。
- 在 `<head>` 設定：`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`。
- 同時支援滑鼠與觸控事件（pointer events 優先，退而求其次分別綁定）。

---

## 6. 字體與配色（需求 3）

### 6.1 字體規格

- 全域基準字級大、明確易讀，最小建議基準：桌面 `18px`、行動 `16px` 起跳，標題與按鈕更大。
- 字體家族建議：圓體 / 黑體類無襯線字體（系統字體堆疊，免外部載入以符合 `file://` 離線需求），例如：
  ```css
  font-family: "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", "Heiti TC", sans-serif;
  ```
- 標題字重粗（700+），按鈕文字加大加粗，確保辨識度。
- 字級以 CSS 變數集中管理於 `variables.css`，方便整體縮放。

建議字級階層（可於 `variables.css` 定義）：

```css
:root {
  --font-size-base: 18px;
  --font-size-button: 22px;
  --font-size-title: 40px;
  --font-size-hud: 28px;
}
```

### 6.2 多樣配色主題

- 至少提供 5 組主題：經典（classic）、海洋（ocean）、糖果（candy）、霓虹（neon）、暗黑（dark）。
- 以 CSS 變數 + `<html data-theme="...">` 切換，於設定畫面選擇，並寫入 `localStorage`。
- 每組主題定義：背景色、主色、次要色、文字色、按鈕色、泡泡色票（5～6 色）。

主題切換實作概念：

```css
:root[data-theme="ocean"] {
  --color-bg: #0b3d5c;
  --color-primary: #2bb3c0;
  --color-text: #f0fbff;
  /* 泡泡色票 */
  --bubble-1: #ff6b6b;
  --bubble-2: #4ecdc4;
  /* ... */
}
```

```js
// settings.js
document.documentElement.setAttribute("data-theme", themeName);
BS.Storage.set("theme", themeName);
```

> 泡泡顏色須與背景有足夠對比，且色彩之間彼此可辨（避免色盲不易區分的組合，建議搭配形狀或圖示輔助）。

---

## 7. 音樂與音效系統（需求 6）

### 7.1 設計目標

- 音樂與音效種類盡量豐富多樣。
- **核心要求**：切換畫面時背景音樂須持續播放、不中斷、不重頭。
- 音樂與音效音量可分別調整，並可整體靜音。

### 7.2 AudioManager（單例）

`audioManager.js` 實作單一全域音訊管理器 `BS.Audio`，由 `main.js` 在啟動時初始化一次，貫穿整個遊戲生命週期。因為遊戲是單頁、不重新載入，`<audio>` 物件持續存活，這是音樂跨畫面連續的基礎。

職責：

| 功能 | 說明 |
| --- | --- |
| BGM 播放 | 管理目前背景音樂，支援 `loop` 循環 |
| BGM 切換 | 切換曲目時以「淡出舊曲、淡入新曲」（cross-fade）平滑過渡；若目標曲目與當前相同則「不重啟、繼續播放」 |
| 音效播放 | 短音效以複製節點（clone）方式播放，允許重疊（例如連續發射） |
| 音量控制 | 分離 BGM 音量與 SFX 音量，支援整體靜音 |
| 解鎖播放 | 處理瀏覽器自動播放限制：首次使用者互動（點擊任意按鈕）後才正式啟動音訊 |

### 7.3 跨畫面音樂持續播放規則

| 切換情境 | 音樂行為 |
| --- | --- |
| 主選單 → 設定 / 說明 | **不更換音樂**，`menu.mp3` 持續播放（同一首，不重頭） |
| 主選單 → 開始 / 繼續遊戲 | 由 `menu.mp3` cross-fade 至 `game.mp3` |
| 遊戲 → 暫停彈窗 | 音樂持續播放（可選擇音量淡化至 50%） |
| 遊戲 → 結算（勝利） | cross-fade 至 `victory.mp3` |
| 結算 → 回主選單 | cross-fade 回 `menu.mp3` |

> 實作重點：畫面切換邏輯（`screens.js`）只負責 DOM 顯示切換，**不可**重新建立或重設 `<audio>` 元素；是否更換 BGM 由 `BS.Audio.playBGM(track)` 自行判斷「目前是否已在播放該曲目」來決定要不要動作，避免每次切畫面就把音樂重頭播放。

### 7.4 音效清單

| 事件 | 音效檔 |
| --- | --- |
| 按鈕點擊 | `click.mp3` |
| 發射泡泡 | `shoot.mp3` |
| 牆面反彈 | `bounce.mp3` |
| 泡泡吸附 | `attach.mp3` |
| 消除泡泡 | `pop.mp3` |
| 連消加成 | `combo.mp3` |
| 懸空掉落 | `drop.mp3` |
| 勝利 | `win.mp3` |
| 失敗 | `lose.mp3` |

### 7.5 自動播放限制處理

多數瀏覽器禁止頁面載入即自動播放有聲音樂。對策：

- 進入頁面時 BGM 預載但不播放。
- 監聽第一次使用者互動（任一按鈕點擊），於該事件中呼叫 `play()` 啟動 BGM 並解鎖音訊。
- 在 `file://` 下音檔以 `<audio src>` 或 `new Audio(path)` 直接引用相對路徑即可，不需 fetch（避免 CORS）。

### 7.6 音檔格式建議

- 主要採用 `.mp3`（相容性最佳）。
- 音檔須使用自製或具明確可商用 / 開放授權的素材，避免使用受著作權保護的市售音樂。

---

## 8. 程式架構與命名空間範例

```js
// js/utils/namespace.js（最先載入）
window.BubbleShooter = window.BubbleShooter || {};
var BS = window.BubbleShooter;
BS.Utils = {};
BS.Core = {};
BS.Game = {};
BS.Audio = {};
BS.UI = {};
```

```js
// js/audio/audioManager.js
(function (BS) {
  var currentTrack = null;
  var bgmEl = null;

  BS.Audio.init = function () { /* 建立 audio 元素、預載 */ };

  BS.Audio.playBGM = function (track) {
    if (currentTrack === track) return;   // 同曲不重啟，達成跨畫面連續
    // cross-fade 舊曲 → 新曲
    currentTrack = track;
  };

  BS.Audio.playSFX = function (name) { /* clone 節點播放，可重疊 */ };
  BS.Audio.setBgmVolume = function (v) { /* ... */ };
  BS.Audio.setSfxVolume = function (v) { /* ... */ };
  BS.Audio.mute = function (flag) { /* ... */ };
})(window.BubbleShooter);
```

```js
// js/main.js（最後載入）
(function (BS) {
  document.addEventListener("DOMContentLoaded", function () {
    BS.Audio.init();
    BS.UI.Screens.init();
    BS.UI.Menu.init();
    BS.UI.Settings.init();
    // 套用儲存的設定
    var theme = BS.Storage.get("theme", "classic");
    document.documentElement.setAttribute("data-theme", theme);
    BS.UI.Screens.show("menu");
  });
})(window.BubbleShooter);
```

---

## 9. 驗收標準（Acceptance Criteria）

| 編號 | 需求對應 | 驗收條件 |
| --- | --- | --- |
| AC-1 | 需求 1 | 雙擊 `index.html` 即可遊玩，全程不需任何 server 或 build，無 CORS 錯誤 |
| AC-2 | 需求 2 | 於手機（直式）、平板、桌面三種尺寸下版面正常，觸控可順暢瞄準與發射，旋轉螢幕後 canvas 正確重繪 |
| AC-3 | 需求 3 | 全站字體大且清晰，按鈕觸控目標 ≥ 48px；可在設定中切換至少 5 種配色主題並即時生效 |
| AC-4 | 需求 4 | CSS、JS 各依職責分類於對應資料夾，`index.html` 以 link / script 引入，無單一巨型檔案 |
| AC-5 | 需求 5 | 主選單具備「開始遊戲、繼續遊戲、說明、設定」四功能；無存檔時「繼續遊戲」停用 |
| AC-6 | 需求 6 | 具備多首 BGM 與多種音效；從主選單進入設定／說明時音樂持續播放不中斷、不重頭；進入遊戲時平滑切換曲目 |

---

## 10. 後續可擴充項目（非本期必要）

- 關卡系統與難度曲線（每關增加列數 / 顏色數）。
- 特殊泡泡（炸彈、彩虹、雷射）。
- 最高分排行（本機 `localStorage`）。
- 角色 / 場景換膚。
- 國際化（i18n）多語系字串。
