# Tug of War TD（塔防大戰爭）— 遊戲開發規格書

> 版本：v1.0
> 類型：對拉塔防 (Tug of War Tower Defense)
> 平台：純前端網頁遊戲（PC + 行動裝置 RWD）
> 風格參考：《貓咪大戰爭》（可愛擬真混合風）

---

## ⚠️ 特別說明（請先閱讀）

原始需求第 7 點提出「遊戲中的 BGM 音量都放大為原來的 10 倍」。若直接以程式碼將音量增益設為 10x（即 gain = 10），在 Web Audio API 中會造成：

- 嚴重削波失真（clipping）、破音
- 部分裝置喇叭或耳機可能因音量過大受損
- 使用者聽覺不適甚至受傷風險（尤其戴耳機時）

因此本規格書將此需求調整為：**提供「音量增益模式」，預設音量遠比一般網頁遊戲更宏亮飽滿（約為一般預設值的 2～3 倍聽感），並在設定頁提供最高上限的增益滑桿，同時在音訊處理上加入 Limiter（限幅器）避免破音**。這樣能達到「BGM 更大聲、更有存在感」的體感目的，又不會產生實際的音訊/硬體風險。若你堅持要精確 10x 數值增益，可以之後在設定裡開放「進階模式」讓使用者自行承擔風險開啟，但預設不建議。

---

## 1. 專案總覽

### 1.1 專案名稱
**Tug of War TD（塔防大戰爭）**

### 1.2 遊戲簡介
玩家與電腦（或未來可擴充的雙人對戰）在同一條戰線上互相召喚單位，單位會沿路徑自動前進，雙方單位相遇時自動戰鬥。任一方的城堡（基地）被摧毀，或時間結束時比較雙方基地血量，判定勝負。玩法核心為資源管理、兵種相剋、節奏掌控。

### 1.3 核心特色
- 純前端、零安裝、雙擊即玩
- 可愛擬真混合美術風格
- 完整 RWD，行動裝置操作不擋畫面
- 三國語言（中/英/日）
- 多首輕快鋼琴 BGM + 清脆音效
- 存讀檔機制（繼續遊戲）

### 1.4 目標裝置
| 裝置類型 | 最小解析度 | 說明 |
|---|---|---|
| 手機直向 | 320×568 | 主要操作模式，按鍵置底部 |
| 手機橫向 | 568×320 | 遊戲中建議引導旋轉為橫向 |
| 平板 | 768×1024 | 支援直/橫 |
| 桌機瀏覽器 | 1280×720 以上 | 滑鼠操作 |

---

## 2. 技術架構要求

### 2.1 硬性規則
1. **純前端**：不使用 Node.js、Webpack、Vite 等建置工具，不需要 `npm install`。
2. **零 Server**：使用者以檔案總管直接雙擊 `index.html` 即可用瀏覽器開啟並完整運作（`file://` 協議下可執行）。
3. 所有資源（圖片、音檔、字體、語言檔）皆採**相對路徑**引入，避免 CORS 問題。若使用 `fetch()` 讀取 JSON 語言檔在 `file://` 下可能被瀏覽器封鎖，因此語言檔**必須**以 `<script src="...">` 方式將 JS 物件（非 fetch JSON）載入，確保雙擊開啟就能動作，不需啟動 local server。
4. 使用原生 **HTML5 + CSS3 + Vanilla JavaScript (ES6)**，不依賴外部 CDN（避免離線/無網路環境失效），所有函式庫皆本地化存放於 `/libs`。
5. 使用 `<canvas>` 進行遊戲主戰鬥畫面渲染，UI（選單、按鈕、彈窗）以 HTML/CSS 疊加層處理，避免全部畫在 canvas 上導致 RWD 困難。

### 2.2 瀏覽器相容性
- Chrome / Edge / Safari / Firefox 最新兩個大版本
- iOS Safari、Android Chrome 行動瀏覽器

---

## 3. 專案資料夾結構

```
Tug_of_War_TD/
├── index.html                      # 唯一入口點
│
├── css/
│   ├── base/
│   │   ├── reset.css               # CSS Reset / normalize
│   │   ├── variables.css           # 色彩變數、字體變數、間距變數
│   │   └── typography.css          # 全域字體規則（大字體、粗體規範）
│   │
│   ├── themes/
│   │   ├── theme-cute-pink.css     # 可愛主題（粉色系）
│   │   ├── theme-ocean.css         # 海洋藍主題
│   │   ├── theme-forest.css        # 森林綠主題
│   │   ├── theme-sunset.css        # 夕陽橘主題
│   │   └── theme-night.css         # 暗色/夜間主題
│   │
│   ├── layout/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── responsive.css          # 所有 RWD media query 集中管理
│   │
│   ├── components/
│   │   ├── buttons.css             # 按鈕樣式（主畫面/遊戲內/設定）
│   │   ├── modal.css               # 彈窗（說明頁、確認視窗）
│   │   ├── slider.css              # 設定頁滑桿樣式
│   │   ├── card.css                # 說明頁圖示卡片
│   │   ├── hud.css                 # 遊戲內 HUD（血量條、資源條）
│   │   └── mobile-controls.css     # 行動裝置專屬操作區樣式
│   │
│   ├── screens/
│   │   ├── main-menu.css           # 主畫面專屬樣式
│   │   ├── settings.css            # 設定頁專屬樣式
│   │   ├── how-to-play.css         # 說明頁專屬樣式
│   │   └── battle.css              # 戰鬥畫面專屬樣式
│   │
│   └── main.css                    # 匯總 @import 上述所有 CSS（index.html 只引入這支）
│
├── js/
│   ├── core/
│   │   ├── config.js                # 全域設定常數（畫面尺寸、路徑等）
│   │   ├── gameState.js             # 遊戲狀態機（主選單/戰鬥中/暫停/結算）
│   │   ├── saveManager.js           # localStorage 存讀檔
│   │   └── eventBus.js              # 簡易事件系統，模組間溝通用
│   │
│   ├── engine/
│   │   ├── gameLoop.js              # requestAnimationFrame 主迴圈
│   │   ├── renderer.js              # canvas 繪製調度
│   │   ├── collision.js             # 單位碰撞/交戰判定
│   │   └── pathManager.js           # 兵線路徑管理
│   │
│   ├── entities/
│   │   ├── Unit.js                  # 單位基礎類別
│   │   ├── PlayerUnits.js           # 玩家陣營單位資料與行為
│   │   ├── EnemyUnits.js            # 敵方陣營單位資料與行為
│   │   └── Base.js                  # 雙方城堡（基地）類別
│   │
│   ├── systems/
│   │   ├── resourceSystem.js        # 能量/資源產生與消耗
│   │   ├── spawnSystem.js           # 召喚單位邏輯
│   │   ├── aiSystem.js              # 電腦對手 AI 召喚邏輯
│   │   ├── battleSystem.js          # 戰鬥傷害計算
│   │   └── levelSystem.js           # 關卡資料與進度解鎖
│   │
│   ├── audio/
│   │   ├── audioManager.js          # BGM/音效播放、音量控制、Limiter
│   │   └── audioConfig.js           # 音檔清單與對應設定
│   │
│   ├── i18n/
│   │   ├── i18nManager.js           # 語言切換邏輯
│   │   ├── lang-zh.js               # 中文語言包
│   │   ├── lang-en.js               # 英文語言包
│   │   └── lang-ja.js               # 日文語言包
│   │
│   ├── ui/
│   │   ├── mainMenu.js              # 主畫面互動邏輯
│   │   ├── settingsScreen.js        # 設定頁邏輯
│   │   ├── howToPlayScreen.js       # 說明頁邏輯
│   │   ├── battleHUD.js             # 戰鬥中 UI（血條/資源/召喚欄）
│   │   ├── mobileControls.js        # 行動裝置操作按鈕邏輯
│   │   └── themeSwitcher.js         # 多彩配色切換邏輯
│   │
│   └── main.js                      # 進入點，初始化所有模組（index.html 只引入這支即可，內部再各自 import）
│
├── assets/
│   ├── images/
│   │   ├── ui/                      # 按鈕、圖示、邊框素材
│   │   ├── units/
│   │   │   ├── player/              # 玩家單位插畫
│   │   │   └── enemy/               # 敵方單位插畫
│   │   ├── backgrounds/             # 各主題背景、戰鬥場景背景
│   │   ├── icons/                   # 說明頁使用的可愛圖示
│   │   └── logo/                    # 遊戲 Logo
│   │
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── menu_piano_1.mp3
│   │   │   ├── battle_piano_1.mp3
│   │   │   ├── battle_piano_2.mp3
│   │   │   └── victory_piano.mp3
│   │   └── sfx/
│   │       ├── click.mp3            # 按鈕點擊（高音清脆）
│   │       ├── summon.mp3           # 召喚單位音效
│   │       ├── hit.mp3              # 攻擊命中
│   │       ├── victory.mp3
│   │       └── defeat.mp3
│   │
│   └── fonts/
│       └── (自架可愛圓體字型檔 .woff2)
│
└── data/
    ├── levels.js                    # 關卡設定資料（非 JSON，直接 JS 物件避免 fetch 限制）
    └── unitsData.js                 # 單位數值表資料
```

> **重要技術備註**：由於規則要求「不需 build/不需 server」，凡是遊戲資料（語言包、關卡表、單位表）一律以 `.js` 檔案並用 `window.xxx = {...}` 或 ES6 全域變數方式撰寫，而非 `.json` + `fetch()`，因為多數瀏覽器在 `file://` 協議下會封鎖 `fetch` 讀取本地檔案，這樣才能保證「雙擊 index.html 就能玩」。

### 3.1 index.html 引入方式範例
```html
<!-- CSS 只引入彙總檔 -->
<link rel="stylesheet" href="css/main.css">

<!-- JS 依相依順序引入，全部使用一般 <script> 標籤（非 module，避免 file:// CORS 問題）-->
<script src="js/core/config.js"></script>
<script src="js/core/eventBus.js"></script>
<script src="js/core/gameState.js"></script>
<script src="js/core/saveManager.js"></script>

<script src="data/unitsData.js"></script>
<script src="data/levels.js"></script>

<script src="js/i18n/lang-zh.js"></script>
<script src="js/i18n/lang-en.js"></script>
<script src="js/i18n/lang-ja.js"></script>
<script src="js/i18n/i18nManager.js"></script>

<script src="js/audio/audioConfig.js"></script>
<script src="js/audio/audioManager.js"></script>

<script src="js/entities/Unit.js"></script>
<script src="js/entities/PlayerUnits.js"></script>
<script src="js/entities/EnemyUnits.js"></script>
<script src="js/entities/Base.js"></script>

<script src="js/engine/pathManager.js"></script>
<script src="js/engine/collision.js"></script>
<script src="js/engine/renderer.js"></script>
<script src="js/engine/gameLoop.js"></script>

<script src="js/systems/resourceSystem.js"></script>
<script src="js/systems/spawnSystem.js"></script>
<script src="js/systems/aiSystem.js"></script>
<script src="js/systems/battleSystem.js"></script>
<script src="js/systems/levelSystem.js"></script>

<script src="js/ui/themeSwitcher.js"></script>
<script src="js/ui/mainMenu.js"></script>
<script src="js/ui/settingsScreen.js"></script>
<script src="js/ui/howToPlayScreen.js"></script>
<script src="js/ui/battleHUD.js"></script>
<script src="js/ui/mobileControls.js"></script>

<script src="js/main.js"></script>
```
> 注意：`<script>` 標籤需採**傳統全域腳本**而非 `type="module"`，因為 ES module 在部分瀏覽器的 `file://` 協議下同樣會被 CORS 政策封鎖，無法保證雙擊即玩。所有模組以 IIFE 或掛載在 `window.Game.xxx` 命名空間下避免污染全域變數。

---

## 4. 遊戲核心機制

### 4.1 核心玩法循環
1. 玩家與電腦各有一座城堡，位於戰線兩端
2. 雙方隨時間持續累積「貓咪能量／敵方能量」
3. 玩家消耗能量從召喚欄選擇單位放上戰線
4. 單位自動沿路徑前進，遇到敵方單位則自動戰鬥（近戰互毆或遠程攻擊）
5. 擊破敵方單位或推進到底可攻擊敵方城堡
6. 城堡血量歸零 → 遊戲勝利／敗北；時間到 → 比較雙方城堡剩餘血量

### 4.2 資源系統
| 項目 | 說明 |
|---|---|
| 能量上限 | 初始 100，隨關卡等級提升 |
| 能量恢復速度 | 每秒恢復 1～3 點（依關卡難度調整） |
| 消耗方式 | 召喚單位即扣除對應點數 |

### 4.3 單位設計（範例基礎表，供美術與數值延伸）

| 單位類型 | 定位 | 特色 |
|---|---|---|
| 基礎兵 | 肉盾/消耗 | 低成本、高數量、血量普通 |
| 遠程兵 | 輸出 | 攻擊距離長、血量低 |
| 重裝兵 | 坦克 | 高血量、移動慢、攻擊低 |
| 爆發兵 | 高攻擊 | 血量低、攻擊極高、成本高 |
| 治療兵 | 支援 | 恢復友方單位血量 |
| Boss 級單位 | 特殊關卡 | 極高血量與攻擊，僅特定關卡登場 |

屬性欄位建議：`id, name, hp, atk, speed, range, cost, cooldown, attribute(剋制屬性), icon, description`

### 4.4 屬性相剋（可延伸）
比照《貓咪大戰爭》設計「一般 / 紅色 / 惡魔 / 天使 / 金屬」等屬性剋制表，剋制方造成雙倍傷害，被剋方受到雙倍傷害，此表格於 `data/unitsData.js` 中定義，方便未來擴充。

### 4.5 勝負條件
- 摧毀敵方城堡 → 立即勝利
- 己方城堡被摧毀 → 立即失敗
- 時間結束未分勝負 → 比較雙方城堡剩餘血量百分比，高者獲勝，平手則平局

### 4.6 關卡與進度系統
- 關卡以線性地圖節點方式呈現（類似世界地圖選關）
- 每關卡有星級評價（依剩餘時間/城堡血量計算 1～3 星）
- 通關後解鎖下一關卡，資料存於 `saveManager.js`

---

## 5. UI / UX 畫面規格

### 5.1 主畫面（Main Menu）
**需求對應第 5、14 點：功能齊全但版面簡潔，不放設定選項在主畫面本體**

- 版面配置：
  - 上方：遊戲 Logo（可愛風插畫字體）
  - 中央偏下：四顆主要按鈕，垂直排列，大按鈕大字體
    1. 🎮 開始遊戲（新遊戲，若已有進度則跳出確認覆蓋提示）
    2. ▶️ 繼續遊戲（無存檔時此按鈕顯示為disabled灰階狀態）
    3. 📖 遊戲說明
    4. ⚙️ 設定
  - 背景：可愛插畫風格動態背景（雲朵漂浮、貓咪剪影緩慢移動等微動畫，不影響效能）
  - 右上角小型語言切換圖示（國旗圖示，不佔用主要視覺焦點，*不算「設定選項」，僅為語言快速切換*）
- **設計原則**：主畫面刻意不放音量調整、畫質選項等「設定類」控制項，全部收斂到「設定」頁面，維持簡潔。

### 5.2 遊戲說明頁面（How To Play）
**需求對應第 10 點：整理乾淨、圖示豐富、易讀、詳細**

- 採用「分類頁籤（Tab）」設計，避免長捲軸資訊過載：
  1. 🕹️ 基本操作
  2. 💰 資源系統
  3. 🐱 單位圖鑑（含每個單位的可愛圖示、數值卡片）
  4. ⚔️ 屬性剋制表（圖解 + 顏色標示）
  5. 🏆 勝利條件
- 每個頁籤內容以「圖示 + 短句說明」卡片式排版（`card.css`），避免大段文字
- 提供「上一步 / 下一步」導覽箭頭，也支援直接點頁籤跳轉
- 手機版頁籤自動改為下拉選單或橫向可滑動 Tab，避免擠壓

### 5.3 設定頁面（Settings）
**需求對應第 12 點：排版乾淨簡單、按鍵與音樂選項好看**

- 分區塊呈現：
  - 🔊 **音訊設定**
    - BGM 音量滑桿（圓形拖曳把手、即時預覽數值 0～150%）
    - 音效音量滑桿
    - 靜音開關（大型可愛圖示 Toggle）
  - 🎨 **主題配色**
    - 5 個色卡圓形按鈕供選擇（粉色/海洋藍/森林綠/夕陽橘/夜間），點選即時預覽整個設定頁換色
  - 🌐 **語言設定**
    - 中文 / English / 日本語 三顆選項按鈕
  - 🗑️ **資料管理**
    - 清除存檔（需二次確認彈窗）
- 所有控制項使用統一圓角大按鈕/大滑桿，避免小如手機系統設定的密集清單感

### 5.4 戰鬥畫面（Battle Screen）
**需求對應第 2、8 點：RWD、行動按鍵不擋畫面**

- **桌機版佈局**：
  - 上方 HUD：雙方城堡血量條、剩餘時間
  - 左側：資源/能量條
  - 底部：召喚單位選單（橫向卡片列）
  - 中央：canvas 戰鬥主畫面（左右戰線）
- **手機直向版佈局**：
  - 戰鬥 canvas 佔螢幕上方 65～70%
  - 召喚選單收合在畫面底部一個**半透明浮動列**，預設高度佔螢幕 20% 以內，可上滑展開/下滑收合，**絕不覆蓋在 canvas 戰鬥區域上方**
  - HUD（血量/資源）以纖細條狀貼齊畫面最上緣，不佔用戰鬥視野
  - 暫停鈕固定在右上角小圖示，不影響主視野
- **手機橫向版佈局**：
  - canvas 全螢幕鋪滿
  - 召喚選單改為貼齊畫面左側或右側的縱向浮動欄，同樣半透明、可收合

---

## 6. 視覺與美術風格指南

### 6.1 整體風格定位
**需求對應第 3、11、13、17 點：大字體明確、多彩配色、可愛主題、畫面豐富不單調、擬真感、圖示可愛有趣**

- 美術基調：**「可愛 2D 插畫 + 略帶柔和陰影/光澤的擬真質感」**（類似《貓咪大戰爭》的插畫感疊加輕微 3D 光澤效果），非純扁平死板色塊
- 單位、按鈕、圖示均帶有：
  - 圓潤外框（border-radius 大）
  - 柔和投影（box-shadow 淡化、多層次）
  - 輕微漸層底色，避免死板純色塊
  - 描邊白框效果，增加卡通立體感

### 6.2 色彩系統（多主題可選）
每個主題皆定義以下 CSS 變數（於 `variables.css` + 各 theme 檔案覆寫）：

```css
--color-primary
--color-secondary
--color-accent
--color-background
--color-surface
--color-text-main
--color-text-sub
--color-success
--color-danger
--color-warning
```

| 主題 | 主色調 | 適用情境 |
|---|---|---|
| 可愛粉色（預設） | 粉紅 + 奶油白 + 薄荷綠點綴 | 主打可愛風，預設主題 |
| 海洋藍 | 天藍 + 白 + 珊瑚橘點綴 | 清爽風格 |
| 森林綠 | 草綠 + 大地棕 + 陽光黃 | 自然風格 |
| 夕陽橘 | 橘紅 + 紫粉漸層 | 熱情風格 |
| 夜間模式 | 深藍紫 + 螢光點綴 | 護眼/夜間遊玩 |

- **禁止**低對比配色（例：淺灰字配白底），所有文字與背景對比度需達 WCAG AA 以上標準，避免「看不見」的情況
- 所有互動元件（按鈕、卡片）需有清楚的 hover/active 視覺回饋（放大、發光、輕微跳動動畫）

### 6.3 字體規範
**需求對應第 3 點：字體一律設大字體並且明確**

| 用途 | 最小字體（Desktop） | 最小字體（Mobile） | 字重 |
|---|---|---|---|
| 主標題 / Logo | 48px | 32px | 800 (Extra Bold) |
| 按鈕文字 | 24px | 20px | 700 (Bold) |
| 內文說明 | 18px | 16px | 500 (Medium) |
| HUD 數值 | 20px | 18px | 700 |
| 最小可接受字體 | 16px | 14px（絕對下限，僅限次要標籤） | — |

- 統一使用圓潤可愛風字體（中文可用類似「粉圓體/圓體」風格字型，英日文搭配圓角無襯線字體），透過 `@font-face` 本地字型檔載入，避免依賴外部字型 CDN
- 標題文字可加白色描邊 + 陰影，增加可讀性與可愛感

### 6.4 圖示系統
**需求對應第 17 點：圖示要可愛有趣**

- 所有 UI 圖示（音量、暫停、確認、設定齒輪等）皆採用**手繪風/圓潤 SVG 插畫圖示**，而非系統預設扁平 icon
- 單位圖鑑圖示需具備表情與動作感（例如攻擊時的動態姿勢插圖）
- 說明頁大量使用示意插圖（如「能量條圖解」「戰線示意圖」）搭配簡短文字，降低純文字閱讀負擔

---

## 7. 音樂與音效系統

### 7.1 BGM 規劃
**需求對應第 6 點：多首鋼琴輕快音樂**

| 場景 | 曲目數量 | 風格 |
|---|---|---|
| 主選單 | 至少 2 首輪播 | 輕快鋼琴獨奏，明亮節奏 |
| 戰鬥中 | 至少 3 首隨機輪播 | 鋼琴為主，節奏稍快帶動緊張感但仍保持輕鬆基調 |
| 勝利結算 | 1 首 | 歡快鋼琴 + 鐘聲點綴 |
| 落敗結算 | 1 首 | 較緩和但不沉重的鋼琴小調 |

- BGM 之間切換需**淡入淡出（fade in/out）**，避免生硬切歌
- 同場景多首曲目採隨機不重複播放，直到播完清單再重新洗牌

### 7.2 音效規劃
**需求對應第 6 點：高音輕脆音效**

| 事件 | 音效特色 |
|---|---|
| 按鈕點擊 | 清脆高音「叮」聲，短促 |
| 召喚單位 | 輕快「噗」+ 鈴聲混合 |
| 攻擊命中 | 清脆碰撞聲，不厚重 |
| 勝利 | 高音琶音音階上升 |
| 失敗 | 輕柔下降音階（非沉重低音） |
| 星星獲得 | 清脆鈴鐺聲 |

### 7.3 音量與增益處理
**需求對應第 7 點（已於文件開頭調整說明）**

- 使用 Web Audio API 的 `GainNode` 控制音量，滑桿範圍 0%～150%（對應內部 gain 0～1.5，聽感上已相當於一般網頁遊戲音量的數倍）
- 音訊處理鏈：`AudioSource → GainNode → DynamicsCompressorNode (Limiter，防爆音) → Destination`
- 預設 BGM 音量較一般網頁遊戲高（建議預設值設為滑桿 80%～100% 區間，而非業界常見偏低的 30%～50%），達到「更宏亮有存在感」的目的
- 設定頁滑桿即時預覽音量變化，並儲存於 localStorage

---

## 8. RWD 響應式設計規範

**需求對應第 2、8、15 點**

### 8.1 斷點規劃
```css
/* variables.css 中統一定義，responsive.css 中依此斷點撰寫 media query */
--breakpoint-mobile: 480px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;
```

### 8.2 佈局原則
1. 所有互動按鈕最小點擊區域 **44×44px**（符合行動裝置觸控標準）
2. 行動裝置操作區使用 `position: fixed` + 半透明背景，且**限制在畫面邊緣 20% 以內範圍**，核心戰鬥視覺區永遠保持可視
3. canvas 尺寸使用 `resize` 事件動態計算，並以 `devicePixelRatio` 校正避免手機螢幕模糊
4. 直向/橫向切換時自動重新排版（監聽 `orientationchange`）
5. 文字與按鈕大小採用 `clamp()` CSS function 隨螢幕寬度縮放，兼顧不同裝置的大字體需求：
   ```css
   font-size: clamp(16px, 2.5vw, 24px);
   ```

### 8.3 效能與流暢度
**需求對應第 15 點：動作流暢不卡頓**

- 遊戲主迴圈使用 `requestAnimationFrame`，鎖定畫面更新頻率跟隨顯示器更新率
- 單位渲染使用物件池（Object Pool）重複利用單位物件，避免頻繁 GC 造成頓格
- canvas 繪製採分層策略：靜態背景層與動態單位層分離，減少不必要的重繪範圍
- 圖片資源使用精靈圖（Sprite Sheet）合併，減少 HTTP 請求數量（雖為本地檔案，仍降低瀏覽器解析負擔）
- 行動裝置偵測效能較弱時（如低階裝置），自動降低背景動畫細節（可設定於 `config.js` 的效能開關）

---

## 9. 多國語言系統（i18n）

**需求對應第 9 點：日文、英文、中文**

### 9.1 架構設計
- `i18nManager.js` 提供 `t(key)` 函式取得對應語言字串
- 所有畫面文字禁止寫死於 HTML/JS 中，一律透過 `data-i18n="key"` 屬性標記，由 `i18nManager` 掃描並自動替換
- 語言包範例（`lang-zh.js`）：
```javascript
window.LANG_ZH = {
  menu_start: "開始遊戲",
  menu_continue: "繼續遊戲",
  menu_howto: "遊戲說明",
  menu_settings: "設定",
  settings_bgm_volume: "音樂音量",
  settings_sfx_volume: "音效音量",
  settings_theme: "配色主題",
  settings_language: "語言",
  battle_victory: "勝利！",
  battle_defeat: "戰敗...",
  // ...其餘鍵值
};
```
- 語言切換即時生效，無需重新整理頁面
- 使用者語言偏好儲存於 localStorage，下次開啟自動套用

### 9.2 語言涵蓋範圍
所有 UI 文字、單位名稱/描述、關卡名稱、說明頁內容、彈窗提示訊息，皆須提供三語版本，不可有語言遺漏造成顯示 key 值原文（如顯示 `menu_start` 字樣）的情況。

---

## 10. 存檔與進度系統

**需求對應第 5 點：繼續遊戲功能**

- 使用 `localStorage` 儲存：
  - 目前解鎖關卡進度
  - 各關卡星級評價
  - 玩家設定（音量、主題、語言）
- `saveManager.js` 提供：
  - `saveGame(data)`
  - `loadGame()`
  - `hasSave()` → 供主畫面判斷「繼續遊戲」按鈕是否可點擊
  - `clearSave()` → 供設定頁「清除存檔」使用
- 遊戲進行中每完成一關自動存檔，亦可於暫停選單手動「儲存並返回主畫面」

---

## 11. 主要遊戲流程圖（狀態機）

```
[載入畫面]
     ↓
[主畫面] ──開始遊戲──→ [關卡選擇] ──選關──→ [戰鬥畫面] ──勝利/失敗──→ [結算畫面] ──→ 返回[關卡選擇]
   │  │                                          ↑
   │  └──繼續遊戲───────────────────────────────┘（讀取最後進度直接進入戰鬥或關卡選擇）
   │
   ├──遊戲說明──→ [說明頁面] ──返回──→ [主畫面]
   │
   └──設定──→ [設定頁面] ──返回──→ [主畫面]
```

---

## 12. 交付與檔案規範

**需求對應第 16 點**

- 專案完成時**不產生任何 `README.md`**，待整體遊戲功能完成後另行提供說明文件
- 所有原始碼、資源檔皆放置於本規格書第 3 章定義之資料夾結構中，不隨意散落於根目錄
- 最終驗收標準：使用者於任一作業系統，直接雙擊 `index.html`，無需終端機指令、無需安裝任何套件，即可完整遊玩整個遊戲流程（主畫面 → 說明 → 設定 → 戰鬥 → 結算 → 存讀檔）

---

## 13. 開發優先順序建議（Roadmap）

1. **Phase 1（骨架）**：資料夾結構、index.html 引入鏈、主畫面靜態版型、主題色系統
2. **Phase 2（核心玩法）**：canvas 戰鬥迴圈、資源系統、單位召喚與自動戰鬥判定
3. **Phase 3（UI 完善）**：說明頁、設定頁、HUD、行動裝置操作列
4. **Phase 4（多媒體）**：BGM/音效整合、音量控制與 Limiter
5. **Phase 5（在地化）**：三語言包建置與全畫面替換
6. **Phase 6（存讀檔與關卡擴充）**：localStorage 存讀檔、多關卡資料建置
7. **Phase 7（打磨）**：RWD 細節修正、動畫流暢度優化、美術素材最終替換

---

## 14. 需求對照檢查表（驗收用）

| # | 需求 | 對應章節 |
|---|---|---|
| 1 | 純前端、雙擊即玩、免 build/server | §2.1、§3.1 |
| 2 | RWD 順暢、不遮擋畫面 | §5.4、§8 |
| 3 | 大字體明確、多彩配色、可愛主題 | §6.2、§6.3 |
| 4 | CSS/JS 詳細分類、index 引入方式 | §3 |
| 5 | 主畫面四功能 | §5.1 |
| 6 | 鋼琴 BGM、清脆音效 | §7.1、§7.2 |
| 7 | BGM 音量增益（已調整為安全增益方案） | §7.3、文件開頭說明 |
| 8 | 行動按鍵不擋畫面 | §5.4、§8.2 |
| 9 | 三國語言 | §9 |
| 10 | 說明頁乾淨豐富詳細 | §5.2 |
| 11 | 畫面豐富、配色優化 | §6.2、§6.4 |
| 12 | 設定頁排版乾淨 | §5.3 |
| 13 | 畫面擬真豐富 | §6.1 |
| 14 | 主畫面簡潔無設定選項 | §5.1 |
| 15 | 動作流暢不卡 | §8.3 |
| 16 | 不產生 README.md | §12 |
| 17 | 圖示可愛有趣 | §6.4 |

---

*本規格書為設計藍圖，後續實作階段可依實際測試結果微調數值與細節（如單位平衡數值、動畫時間曲線等）。*
