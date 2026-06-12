# Centipede(蜈蚣射擊)遊戲 — 詳細規格書

> 版本:v1.0
> 文件性質:前端純靜態網頁遊戲開發規格
> 適用對象:前端工程師、UI/UX 設計師、音效設計師、QA 測試人員

---

## 目錄

1. [專案概述](#1-專案概述)
2. [核心技術需求](#2-核心技術需求)
3. [專案資料夾結構](#3-專案資料夾結構)
4. [遊戲核心玩法規格](#4-遊戲核心玩法規格)
5. [畫面與場景流程](#5-畫面與場景流程)
6. [主畫面功能規格](#6-主畫面功能規格)
7. [UI / 字體 / 配色規格](#7-ui--字體--配色規格)
8. [RWD 響應式設計規格](#8-rwd-響應式設計規格)
9. [行動裝置操作規格](#9-行動裝置操作規格)
10. [音樂與音效系統規格](#10-音樂與音效系統規格)
11. [存檔與設定持久化](#11-存檔與設定持久化)
12. [效能與相容性需求](#12-效能與相容性需求)
13. [驗收標準清單](#13-驗收標準清單)

---

## 1. 專案概述

### 1.1 遊戲簡介

本專案為經典街機遊戲 **Centipede(蜈蚣)** 的網頁復刻版。玩家操控畫面下方的射手,在佈滿蘑菇的場地中射擊由上而下蜿蜒前進的蜈蚣。蜈蚣被擊中時會分裂成兩段並各自獨立行動,玩家需在蜈蚣抵達底部之前將其全數消滅。

### 1.2 設計目標

| 編號 | 目標 | 說明 |
|------|------|------|
| G1 | 零建置、零伺服器 | 雙擊 `index.html` 即可在瀏覽器直接遊玩 |
| G2 | 全裝置順暢 | 桌機、平板、手機皆可流暢操作(RWD) |
| G3 | 高可讀性 UI | 全站大字體、清晰明確的視覺層級 |
| G4 | 多彩主題 | 提供多組配色主題供玩家自由切換 |
| G5 | 模組化程式碼 | CSS / JS 依職責分資料夾,index 以引入方式組裝 |
| G6 | 豐富音訊體驗 | 10 種以上音效 + 多首背景音樂,跨畫面播放連續 |
| G7 | 不遮擋的行動操作 | 虛擬按鍵置於遊戲畫面之外,絕不覆蓋戰場 |

### 1.3 名詞定義

| 名詞 | 定義 |
|------|------|
| 射手(Shooter) | 玩家操控的角色,位於畫面下方區域 |
| 玩家活動區(Player Zone) | 畫面下方約 20% 高度,射手可自由移動的範圍 |
| 蜈蚣(Centipede) | 由 1 個頭節 + 多個身節組成的敵人鏈 |
| 蘑菇(Mushroom) | 場上的障礙物,可被子彈摧毀(需 4 發) |
| 跳蚤(Flea) | 垂直落下、沿途種蘑菇的敵人 |
| 蜘蛛(Spider) | 在玩家活動區之字形移動、會吃蘑菇的敵人 |
| 蠍子(Scorpion) | 水平橫越畫面、把蘑菇變成「毒蘑菇」的敵人 |
| 毒蘑菇(Poisoned Mushroom) | 蜈蚣碰到後會直線俯衝向底部的特殊蘑菇 |

---

## 2. 核心技術需求

### 2.1 技術限制(必須遵守)

1. **純前端**:僅使用 HTML5 + CSS3 + 原生 JavaScript(ES Modules 以 `<script type="module">` 或傳統 `<script src>` 依序引入皆可;若使用 ES Modules,須確認以 `file://` 協定開啟時瀏覽器的 CORS 限制 — **建議採用傳統 `<script>` 依序引入 + 全域命名空間 / IIFE 模式**,確保雙擊 `index.html` 在所有主流瀏覽器都能直接執行)。
2. **禁止**任何打包工具(Webpack / Vite / Rollup)、禁止 npm 依賴、禁止後端 API。
3. **禁止**外部 CDN 字體與函式庫(離線雙擊也要能玩);字體使用系統字體堆疊(system font stack)。
4. 遊戲繪製使用 `<canvas>` 2D Context;UI 選單使用 HTML/CSS 疊層(overlay)。
5. 音訊一律使用 **Web Audio API 程式合成音效**(oscillator / noise buffer),不依賴外部音檔,確保零資源檔也能發聲;背景音樂同樣以 Web Audio 排程音序器(sequencer)實作。
   - 理由:`file://` 開啟時載入外部 `.mp3` 仍可行,但程式合成可完全避免檔案遺失、授權與載入失敗問題。
   - 若團隊仍希望使用音檔,則改放 `assets/audio/`,並以 `<audio>` 元素 fallback,但合成方案為**預設首選**。

### 2.2 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome / Edge | 100+ |
| Firefox | 100+ |
| Safari(macOS / iOS) | 15+ |
| Android Chrome | 100+ |

---

## 3. 專案資料夾結構

> **需求第 4 點**:CSS、JavaScript 必須分類、分資料夾,`index.html` 僅以引入方式組裝。

```
centipede/
├── index.html                  # 唯一入口,雙擊即玩
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性(配色主題、字級、間距)
│   │   └── typography.css      # 全站字體、字級、行高規則
│   ├── layout/
│   │   ├── layout.css          # 整體版面骨架(遊戲區 / 控制區 / HUD)
│   │   └── responsive.css      # 所有 @media 斷點規則(RWD 集中管理)
│   ├── components/
│   │   ├── menu.css            # 主選單、按鈕樣式
│   │   ├── hud.css             # 遊戲中分數 / 生命 / 關卡顯示列
│   │   ├── modal.css           # 說明、設定、暫停彈窗
│   │   ├── controls.css        # 行動裝置虛擬按鍵(搖桿 + 射擊鍵)
│   │   └── settings.css        # 設定頁滑桿、開關、主題選擇器
│   └── themes/
│       ├── theme-neon.css      # 霓虹主題(預設)
│       ├── theme-retro.css     # 復古綠琥珀主題
│       ├── theme-ocean.css     # 海洋藍主題
│       ├── theme-sunset.css    # 夕陽暖色主題
│       └── theme-mono.css      # 高對比黑白主題(無障礙)
│
├── js/
│   ├── core/
│   │   ├── main.js             # 進入點:初始化、組裝所有模組
│   │   ├── gameLoop.js         # requestAnimationFrame 主迴圈、固定時間步長
│   │   ├── stateMachine.js     # 遊戲狀態機(選單/遊戲中/暫停/結束)
│   │   └── config.js           # 全域常數(格子大小、速度、分數表)
│   ├── entities/
│   │   ├── shooter.js          # 射手:移動、射擊、碰撞、死亡
│   │   ├── bullet.js           # 子彈:單發限制、飛行、命中
│   │   ├── centipede.js        # 蜈蚣:鏈式移動、分裂、頭節 AI
│   │   ├── mushroom.js         # 蘑菇:4 階段血量、毒化狀態
│   │   ├── spider.js           # 蜘蛛:之字移動、吃蘑菇、近距加分
│   │   ├── flea.js             # 跳蚤:垂直落下、播種蘑菇
│   │   └── scorpion.js         # 蠍子:橫向移動、毒化蘑菇
│   ├── systems/
│   │   ├── collision.js        # 格子制 + AABB 混合碰撞偵測
│   │   ├── spawner.js          # 敵人生成排程(依關卡與時間)
│   │   ├── score.js            # 計分、額外生命(每 12000 分 +1)
│   │   ├── level.js            # 關卡進程、難度曲線
│   │   └── particles.js        # 爆炸 / 命中粒子特效
│   ├── audio/
│   │   ├── audioEngine.js      # AudioContext 管理、解鎖(首次互動)
│   │   ├── sfx.js              # 全部音效定義(≥14 種,程式合成)
│   │   └── music.js            # 背景音樂音序器、跨場景續播邏輯
│   ├── input/
│   │   ├── keyboard.js         # 鍵盤(方向鍵 / WASD / 空白鍵)
│   │   ├── mouse.js            # 滑鼠移動 + 點擊射擊(桌機可選)
│   │   └── touch.js            # 觸控:虛擬搖桿 + 射擊鍵 + 多點觸控
│   ├── ui/
│   │   ├── menu.js             # 主選單邏輯(開始/繼續/說明/設定)
│   │   ├── hud.js              # HUD 更新(分數、生命、關卡)
│   │   ├── modal.js            # 彈窗開關共用邏輯
│   │   └── settings.js         # 設定讀寫、主題切換、音量控制
│   └── utils/
│       ├── storage.js          # localStorage 封裝(存檔、設定、最高分)
│        └── helpers.js          # 共用工具(clamp、random、格子轉換)
│
└── README.md                   # 開啟方式與操作說明
```

### 3.1 index.html 引入順序(傳統 script 模式)

```html
<!-- CSS:base → layout → components → themes -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">
<link rel="stylesheet" href="css/layout/layout.css">
<link rel="stylesheet" href="css/components/menu.css">
<link rel="stylesheet" href="css/components/hud.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/controls.css">
<link rel="stylesheet" href="css/components/settings.css">
<link rel="stylesheet" href="css/themes/theme-neon.css">
<link rel="stylesheet" href="css/themes/theme-retro.css">
<link rel="stylesheet" href="css/themes/theme-ocean.css">
<link rel="stylesheet" href="css/themes/theme-sunset.css">
<link rel="stylesheet" href="css/themes/theme-mono.css">
<link rel="stylesheet" href="css/layout/responsive.css"><!-- 最後載入,確保覆蓋 -->

<!-- JS:utils → config → systems → entities → audio → input → ui → core -->
<script src="js/utils/helpers.js"></script>
<script src="js/utils/storage.js"></script>
<script src="js/core/config.js"></script>
<script src="js/systems/collision.js"></script>
<script src="js/systems/score.js"></script>
<script src="js/systems/level.js"></script>
<script src="js/systems/particles.js"></script>
<script src="js/systems/spawner.js"></script>
<script src="js/entities/mushroom.js"></script>
<script src="js/entities/bullet.js"></script>
<script src="js/entities/shooter.js"></script>
<script src="js/entities/centipede.js"></script>
<script src="js/entities/spider.js"></script>
<script src="js/entities/flea.js"></script>
<script src="js/entities/scorpion.js"></script>
<script src="js/audio/audioEngine.js"></script>
<script src="js/audio/sfx.js"></script>
<script src="js/audio/music.js"></script>
<script src="js/input/keyboard.js"></script>
<script src="js/input/mouse.js"></script>
<script src="js/input/touch.js"></script>
<script src="js/ui/modal.js"></script>
<script src="js/ui/hud.js"></script>
<script src="js/ui/settings.js"></script>
<script src="js/ui/menu.js"></script>
<script src="js/core/stateMachine.js"></script>
<script src="js/core/gameLoop.js"></script>
<script src="js/core/main.js"></script>
```

> 規範:每個 JS 檔以 IIFE 包裹,僅將公開介面掛載到單一全域命名空間 `window.Game`(例:`Game.Audio`、`Game.Entities.Centipede`),避免全域污染。

---

## 4. 遊戲核心玩法規格

### 4.1 場地

- 場地為 **格子制(Grid)**,標準為 **30 欄 × 36 列**(可依畫面比例由 `config.js` 調整)。
- 下方 **6 列** 為玩家活動區,射手只能在此區內上下左右移動。
- 關卡開始時隨機散佈 **20~40 顆蘑菇**(不生成在玩家活動區最底 2 列)。

### 4.2 射手(玩家)

| 屬性 | 規格 |
|------|------|
| 移動 | 四方向自由移動,限制於玩家活動區 |
| 移動速度 | 8 格/秒(可於 config 調整) |
| 射擊 | 畫面上同時僅允許 **1 發子彈**;子彈命中或飛出畫面後才可再射 |
| 子彈速度 | 30 格/秒,垂直向上 |
| 初始生命 | 3 條;每 12,000 分獎勵 1 條(上限 6 條) |
| 死亡條件 | 接觸蜈蚣任意節、蜘蛛、跳蚤 |
| 死亡流程 | 爆炸動畫(0.8s)→ 場上毒蘑菇恢復、半毀蘑菇修復(各 +5 分)→ 蜈蚣重置從頂部進入 |

### 4.3 蜈蚣

| 屬性 | 規格 |
|------|------|
| 初始長度 | 第 1 關:1 頭 + 11 身節(共 12 節) |
| 移動規則 | 水平前進;碰到蘑菇、牆壁或抵達邊界時 → 下移一列並反向 |
| 速度 | 第 1 關 6 格/秒,每關 +0.5,上限 14 |
| 分裂 | 任一身節被擊中 → 該節變成蘑菇,後段的第一節升級為新「頭」 |
| 毒蘑菇反應 | 頭碰到毒蘑菇 → 立即直線俯衝至玩家活動區,抵達後恢復一般左右模式 |
| 抵達底部 | 進入玩家活動區後在區內來回;每隔數秒從側邊追加單節「援軍頭」直到玩家清場或死亡 |
| 計分 | 身節 10 分;頭節 100 分 |
| 過關條件 | 場上所有蜈蚣節全數消滅 |

### 4.4 其他敵人

| 敵人 | 出現時機 | 行為 | 計分 |
|------|----------|------|------|
| 蜘蛛 | 每關隨機,間隔 8~15 秒 | 玩家活動區之字形彈跳,接觸蘑菇即吃掉 | 依命中距離:近 900 / 中 600 / 遠 300 |
| 跳蚤 | 玩家活動區蘑菇少於 5 顆時 | 由頂端隨機欄垂直落下,沿途隨機種蘑菇;需 2 發擊殺,中 1 發加速 | 200 |
| 蠍子 | 第 2 關起,間隔 20~30 秒 | 任一列水平橫越,所經蘑菇變毒蘑菇 | 1000 |

### 4.5 蘑菇

- 血量 4;每中 1 發子彈外觀缺損一階,第 4 發摧毀(+1 分)。
- 毒蘑菇:外觀變色(依主題色),功能同上,但蜈蚣頭觸碰會觸發俯衝。

### 4.6 難度曲線

| 關卡 | 蜈蚣構成 | 速度 | 備註 |
|------|----------|------|------|
| 1 | 12 節 ×1 | 6 | 無蠍子 |
| 2 | 11 節 ×1 + 獨立頭 ×1 | 6.5 | 蠍子登場 |
| 3 | 10 節 ×1 + 獨立頭 ×2 | 7 | |
| n | (13−n) 節 + 獨立頭 ×(n−1) | 6+(n−1)×0.5 | n≥12 後固定 12 顆獨立頭、速度 14 |

---

## 5. 畫面與場景流程

### 5.1 狀態機

```
[BOOT 載入]
   ↓
[MENU 主選單] ──開始遊戲──→ [PLAYING 遊戲中] ──ESC/暫停鍵──→ [PAUSED 暫停]
   │   ↑                        │        ↑                      │
   │   │                        │        └──────繼續────────────┘
   │   └────返回主選單───────────┤
   │                            ↓
   ├──說明──→ [HELP 說明彈窗]   [GAMEOVER 結束畫面] ──再玩一次──→ PLAYING
   └──設定──→ [SETTINGS 設定彈窗]        └──回主選單──→ MENU
```

### 5.2 各狀態音樂對應(詳見第 10 章)

| 狀態 | 音樂 |
|------|------|
| MENU / HELP / SETTINGS | `menu_theme`(同一首,開彈窗**不中斷不重播**) |
| PLAYING | `battle_theme`(隨關卡升 Key / 加速) |
| PAUSED | `battle_theme` 降低音量至 30% 並低通濾波(不停止,恢復時無縫接回) |
| GAMEOVER | `gameover_jingle` 播一次 → 靜音待機 |

---

## 6. 主畫面功能規格

> **需求第 5 點**:主畫面四大功能。

### 6.1 版面

- 置中大標題「CENTIPEDE 蜈蚣射擊」,使用主題強調色 + 發光效果,標題下方顯示**歷史最高分**。
- 四顆垂直排列大按鈕(順序固定):

| 按鈕 | 行為 | 顯示條件 |
|------|------|----------|
| ▶ 開始遊戲 | 清除舊存檔 → 從第 1 關開始;若偵測到既有存檔,先彈出確認「將覆蓋目前進度,確定?」 | 永遠顯示 |
| ⏵ 繼續遊戲 | 讀取 localStorage 存檔(關卡、分數、生命、蘑菇佈局)接續遊玩 | 僅在存在有效存檔時顯示;無存檔時**隱藏或灰化**(灰化時點擊播放 `ui_error` 音效並提示「沒有可繼續的進度」) |
| ❓ 說明 | 開啟說明彈窗:操作方式(鍵盤/觸控分頁)、敵人圖鑑與分數表、規則摘要 | 永遠顯示 |
| ⚙ 設定 | 開啟設定彈窗(見 6.2) | 永遠顯示 |

- 按鈕最小尺寸:桌機 `280×64px`、行動 `min(80vw, 320px) × 56px`;觸控目標一律 ≥ 48×48px。
- 鍵盤可用 ↑↓ + Enter 操作選單;焦點按鈕需有明顯外框 + `ui_move` 音效。

### 6.2 設定彈窗內容

| 項目 | 控制元件 | 範圍 / 選項 | 即時生效 |
|------|----------|-------------|----------|
| 音樂音量 | 滑桿 | 0~100,預設 60 | ✔ |
| 音效音量 | 滑桿 | 0~100,預設 80(拖動時即時播 `shoot` 試聽) | ✔ |
| 配色主題 | 5 格色票選擇器 | 霓虹 / 復古 / 海洋 / 夕陽 / 高對比 | ✔(全站即時換色) |
| 字體大小 | 三段切換 | 標準 / 大 / 特大 | ✔ |
| 畫面震動 | 開關 | 開 / 關(命中與爆炸時的 screen shake) | ✔ |
| 觸控按鍵位置 | 二選一 | 左搖桿右射擊(預設)/ 右搖桿左射擊 | ✔ |
| 重置最高分 | 按鈕 | 需二次確認 | — |

所有設定即時寫入 localStorage,下次開啟自動套用。

---

## 7. UI / 字體 / 配色規格

> **需求第 3 點**:大字體、明確、多彩主題。

### 7.1 字體規格

- 字體堆疊:`"PingFang TC", "Microsoft JhengHei", "Noto Sans TC", system-ui, sans-serif`;數字與分數可用 `ui-monospace, "Courier New"` 增加街機感。
- 全站基準字級 **18px**(html root),行動裝置不低於 16px;所有字級以 CSS 變數 + `rem` 定義:

| 變數 | 標準 | 大 | 特大 | 用途 |
|------|------|----|------|------|
| `--fs-title` | 3.0rem | 3.6rem | 4.2rem | 主標題 |
| `--fs-menu` | 1.6rem | 1.9rem | 2.2rem | 選單按鈕 |
| `--fs-hud` | 1.4rem | 1.7rem | 2.0rem | 分數 / 生命 / 關卡 |
| `--fs-body` | 1.1rem | 1.3rem | 1.5rem | 說明內文 |
| `--fs-label` | 1.0rem | 1.2rem | 1.4rem | 設定標籤 |

- 按鈕與 HUD 文字一律 `font-weight: 700` 以上;標題使用 `letter-spacing: 0.08em` 提升辨識。
- 文字與背景對比度必須符合 **WCAG AA(≥ 4.5:1)**;高對比主題需達 AAA(≥ 7:1)。

### 7.2 配色主題

每個主題定義一組 CSS 變數(於 `variables.css` 宣告預設,`themes/*.css` 透過 `body[data-theme="..."]` 覆蓋):

```
--c-bg            背景
--c-surface       面板 / 彈窗底色
--c-primary       主要強調(標題、頭節)
--c-secondary     次要強調(身節)
--c-accent        高亮(子彈、得分跳字)
--c-mushroom      蘑菇
--c-poison        毒蘑菇
--c-text          主要文字
--c-text-dim      次要文字
--c-danger        警告 / 生命扣減
```

| 主題 | 風格 | 背景 | 主強調 | 範例氛圍 |
|------|------|------|--------|----------|
| 霓虹 Neon(預設) | 深底螢光 | `#0a0a14` | `#39ff14` | 經典街機霓虹綠紫 |
| 復古 Retro | 黑底琥珀 | `#101000` | `#ffb000` | CRT 琥珀單色情懷 |
| 海洋 Ocean | 深藍清爽 | `#06283d` | `#47b5ff` | 藍青色系 |
| 夕陽 Sunset | 暖色漸層 | `#2b1224` | `#ff7849` | 橘粉紫晚霞 |
| 高對比 Mono | 無障礙 | `#000000` | `#ffffff` | 純黑白,色弱友善 |

- 主題切換時所有 UI、Canvas 內遊戲物件顏色**同步更新**(Canvas 端讀取 `getComputedStyle` 取得目前變數值)。
- 切換含 200ms 過渡動畫(僅 UI;Canvas 立即切換)。

---

## 8. RWD 響應式設計規格

> **需求第 2 點**:行動裝置與網頁皆順暢。

### 8.1 斷點定義(集中於 `responsive.css`)

| 斷點 | 範圍 | 佈局 |
|------|------|------|
| 桌機 Desktop | ≥ 1024px | 遊戲畫布置中,左右留白顯示裝飾邊框;HUD 在畫布上方一列 |
| 平板 Tablet | 600 ~ 1023px | 畫布寬度 90vw;HUD 縮排但字級不縮小 |
| 手機直向 Mobile-P | < 600px(portrait) | 畫布滿寬;HUD 精簡為單列;**下方固定控制列**放虛擬按鍵 |
| 手機橫向 Mobile-L | < 1024px(landscape) | 畫布置中;虛擬按鍵分置**左右兩側留白區** |

### 8.2 畫布縮放策略

- Canvas 內部解析度固定為邏輯尺寸(如 `600 × 720`,維持 30×36 格),以 CSS 縮放至可用空間,維持 **5:6 長寬比**,`image-rendering` 視風格決定(像素風用 `pixelated`)。
- 使用 `ResizeObserver` + `visualViewport` 監聽尺寸變化(含手機轉向),即時重算畫布 CSS 尺寸與虛擬按鍵佈局。
- 支援高 DPI:實體像素 = 邏輯尺寸 × `devicePixelRatio`(上限 2,避免低階手機過載)。

### 8.3 行動版佈局原則(配合需求第 7 點)

```
┌─────────────────────┐      ┌───────┬─────────────┬───────┐
│  HUD(分數/命/關卡) │      │       │    HUD      │       │
├─────────────────────┤      │ 虛擬  ├─────────────┤  射擊 │
│                     │      │ 搖桿  │             │  鍵   │
│     遊戲畫布        │      │ 區    │  遊戲畫布   │  區   │
│   (滿寬、不被遮擋)│      │       │             │       │
├─────────────────────┤      └───────┴─────────────┴───────┘
│ [搖桿]      [射擊]  │            手機橫向
│   專屬控制列(獨立區塊)
└─────────────────────┘
      手機直向
```

- **控制列為獨立的 flex 區塊,絕不以 `position: absolute` 疊在畫布上**(詳見第 9 章)。
- 使用 `100dvh` 與 `env(safe-area-inset-*)` 處理瀏覽器網址列伸縮與 iPhone 瀏海/底部手勢區。
- 行動裝置上鎖定 `touch-action: none` 於遊戲區與控制區,防止捲動與雙擊縮放;`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`。

---

## 9. 行動裝置操作規格

> **需求第 7 點**:行動按鍵不可擋到遊戲畫面。

### 9.1 核心原則

1. **空間分離**:虛擬按鍵一律放置於畫布之外的專屬區域(直向=下方控制列,高度約 22vh;橫向=左右側欄,各約 18vw)。
2. 畫布尺寸計算公式:`可用高度 = 100dvh − HUD 高度 − 控制列高度 − safe-area`,確保畫布完整可見、零重疊。
3. 控制區背景使用 `--c-surface` 半實色(非透明覆蓋),視覺上即明確為「操作面板」而非遊戲場地。

### 9.2 虛擬搖桿

| 屬性 | 規格 |
|------|------|
| 型式 | 浮動式(floating)圓形搖桿:手指在搖桿區任意位置按下即生成原點 |
| 直徑 | 外圈 96~128px(依螢幕),內杆 48px |
| 輸出 | 8 方向 + 類比強度(強度 > 0.25 才觸發移動,避免誤觸) |
| 限制 | 搖桿活動範圍嚴格限制在控制區內,不外溢至畫布 |

### 9.3 射擊鍵

| 屬性 | 規格 |
|------|------|
| 尺寸 | 直徑 ≥ 72px |
| 行為 | 按住=連續射擊(仍受「單發在場」限制);按下時微縮放 + 觸覺回饋(`navigator.vibrate(10)`,支援才呼叫) |
| 位置 | 與搖桿對側;可在設定中左右互換 |

### 9.4 其他

- 多點觸控:搖桿與射擊鍵可同時操作(以 `touch.identifier` 分流)。
- 控制區另含小型「⏸ 暫停」鍵(置於控制列角落,44×44px 以上)。
- 桌機偵測(無 touch 事件 / `pointer: fine`)時完全隱藏虛擬按鍵,釋放空間給畫布。

---

## 10. 音樂與音效系統規格

> **需求第 6 點**:音樂音效多樣(≥10 種音效),並注意切換畫面時音樂持續播放。

### 10.1 音訊引擎(`audioEngine.js`)

- 單一 `AudioContext`,結構:

```
各音效節點 ──→ sfxGain ──┐
                          ├─→ masterGain ─→ destination
音樂音序器 ──→ musicGain ─┘(暫停時對 musicGain 加 lowpass)
```

- **自動播放政策處理**:`AudioContext` 在使用者第一次互動(任意點擊/觸碰/按鍵)時 `resume()`;主選單顯示「點擊任意處開啟音效 🔊」提示直到解鎖成功。
- 頁面切到背景(`visibilitychange`)時 `suspend()`,回前景 `resume()`。

### 10.2 音效清單(共 14 種,全部以 Web Audio 合成)

| # | ID | 觸發時機 | 合成概述 |
|---|----|----------|----------|
| 1 | `shoot` | 玩家射擊 | 短促方波下滑音(880→220Hz, 80ms) |
| 2 | `hit_segment` | 命中蜈蚣身節 | 噪音爆 + 短三角波(60ms) |
| 3 | `hit_head` | 命中蜈蚣頭節 | 雙音上揚琶音(較華麗,140ms) |
| 4 | `hit_mushroom` | 命中蘑菇(未毀) | 低沉短「咚」(sine 180Hz, 50ms) |
| 5 | `mushroom_destroy` | 蘑菇被摧毀 | 碎裂噪音衰減(120ms) |
| 6 | `spider_kill` | 擊殺蜘蛛 | 三連上行音 + 噪音尾 |
| 7 | `flea_kill` | 擊殺跳蚤 | 高頻啾聲下落(glissando) |
| 8 | `scorpion_kill` | 擊殺蠍子 | 金屬感 FM 鈴聲(200ms) |
| 9 | `player_death` | 玩家死亡 | 長下滑爆炸(白噪音+鋸齒波,800ms) |
| 10 | `extra_life` | 獲得額外生命 | 上行大調琶音(經典 1-up 風格) |
| 11 | `level_clear` | 過關 | 四音勝利短句 |
| 12 | `poison_dive` | 蜈蚣觸毒俯衝 | 急促警報雙音交替 |
| 13 | `ui_move` | 選單焦點移動 | 極短「嗶」(30ms) |
| 14 | `ui_confirm` | 按鈕確認 | 雙音上揚「叮咚」 |
| 15 | `ui_error` | 無效操作(如無存檔點繼續) | 低音「噗」(下行) |

> 同種音效高頻觸發時做**節流(同一 ID 最小間隔 30ms)**與輕微隨機 detune(±20 cents),避免機關槍式刺耳疊音。

### 10.3 背景音樂(音序器合成,3 首)

| ID | 場景 | 風格 | 規格 |
|----|------|------|------|
| `menu_theme` | 主選單 / 說明 / 設定 | 慵懶 chiptune 循環(~75 BPM, 8 小節 loop) | 方波主旋律 + 三角波貝斯 + 噪音 hi-hat |
| `battle_theme` | 遊戲中 | 緊湊 chiptune(~120 BPM 起) | 每過 3 關 BPM +6、整體升半 Key,營造張力 |
| `gameover_jingle` | 結束畫面 | 4 小節下行小調短句,播放一次 | 結束後保持靜音 |

### 10.4 跨畫面音樂續播規則(重點需求)

1. **同一邏輯場景內不重啟**:主選單 ↔ 說明 ↔ 設定之間切換時,`menu_theme` **持續播放、不中斷、不從頭**。實作:這些畫面皆為 overlay,音樂由狀態機判斷「場景群組」而非個別畫面;群組未變 → 不觸碰音序器。
2. **遊戲 ↔ 暫停**:`battle_theme` 不停止,僅 `musicGain` 以 300ms ramp 降至 30% 並套用 lowpass(800Hz);恢復時 300ms ramp 還原。**從暫停選「設定」調整音量時音樂同樣持續**,供玩家即時試聽。
3. **群組切換才換曲**:MENU 群 → PLAYING 時,`menu_theme` 800ms 淡出、`battle_theme` 淡入;反向亦同。禁止硬切爆音(所有切換必經 gain ramp)。
4. **過關不換曲**:`level_clear` 音效疊在 `battle_theme` 上播放,音樂不中斷,僅依規則升速/升 Key(於下一個 loop 邊界生效,避免突兀)。
5. 音樂開關 / 音量改變即時生效且寫入設定。

---

## 11. 存檔與設定持久化

使用 `localStorage`,key 前綴 `centipede.`:

| Key | 內容 | 寫入時機 |
|-----|------|----------|
| `centipede.save` | `{level, score, lives, mushrooms[], timestamp}` | 每次過關、暫停、玩家死亡(剩餘命>0)時自動存;Game Over 時清除 |
| `centipede.highscore` | 數字 | 分數超越時即寫 |
| `centipede.settings` | `{musicVol, sfxVol, theme, fontSize, shake, controlSide}` | 設定變更即寫 |

- 讀檔需做 schema 驗證,損毀則靜默重置並提示「存檔已重置」。
- `file://` 下 localStorage 在主流瀏覽器可用;若遭隱私模式封鎖,需 try/catch 降級為「本次工作階段記憶」,不可拋錯中斷遊戲。

---

## 12. 效能與相容性需求

| 項目 | 標準 |
|------|------|
| 影格率 | 桌機穩定 60 FPS;中階手機 ≥ 50 FPS |
| 遊戲邏輯 | 固定時間步長(fixed timestep 1/60s)+ 插值渲染,確保不同裝置速度一致 |
| 記憶體 | 物件池(子彈、粒子、音效節點)避免 GC 卡頓 |
| 載入 | 無外部資源,首屏 < 1 秒 |
| 觸控延遲 | 輸入到畫面反應 < 50ms |
| 例外處理 | 任何子系統(音訊、存檔)失敗都不可阻斷遊戲主流程 |

---

## 13. 驗收標準清單

### A. 啟動與架構
- [ ] 從檔案總管雙擊 `index.html`,於 Chrome / Firefox / Safari / Edge 皆可直接遊玩,Console 無 CORS 或 module 錯誤
- [ ] 專案完全無 `node_modules`、無 build 指令、無外部 CDN
- [ ] CSS / JS 依規格資料夾分類,`index.html` 僅含引入與最小骨架 HTML

### B. RWD 與行動操作
- [ ] 375px(iPhone SE)直向:畫布完整顯示,虛擬按鍵位於下方控制列,**與畫布零重疊**
- [ ] 手機橫向:按鍵分列畫布左右側欄,畫布不被遮擋
- [ ] 桌機:虛擬按鍵完全隱藏;視窗任意縮放畫布維持比例且不破版
- [ ] 旋轉裝置時佈局 1 秒內正確重排,遊戲不中斷
- [ ] 遊戲進行中頁面不可被捲動、不可雙擊縮放

### C. 字體與配色
- [ ] 全站基準字級 ≥ 18px,HUD 與按鈕文字粗體清晰
- [ ] 5 組配色主題皆可即時切換,UI 與 Canvas 同步換色
- [ ] 三段字體大小切換即時生效並持久保存
- [ ] 預設與高對比主題通過 WCAG AA / AAA 對比檢測

### D. 主畫面功能
- [ ] 開始 / 繼續 / 說明 / 設定四按鈕齊備且行為符合 6.1
- [ ] 無存檔時「繼續遊戲」灰化並有回饋;有存檔時可正確還原關卡、分數、生命與蘑菇佈局
- [ ] 選單支援鍵盤與觸控雙操作

### E. 音訊
- [ ] 實裝 ≥ 14 種音效 + 3 首背景音樂,全部離線可發聲
- [ ] 主選單 ↔ 說明 ↔ 設定切換時音樂連續不重播(實測切換 10 次無中斷)
- [ ] 暫停時音樂悶化降量、不停止;恢復後無縫接續
- [ ] 場景群組切換採淡入淡出,無爆音
- [ ] 首次互動前不噴 AudioContext 警告,互動後音訊正常解鎖

### F. 玩法
- [ ] 蜈蚣移動、分裂、毒蘑菇俯衝、底部援軍機制皆符合第 4 章
- [ ] 蜘蛛 / 跳蚤 / 蠍子行為與計分正確
- [ ] 單發子彈限制、額外生命、難度曲線符合規格
- [ ] 玩家死亡後蘑菇修復加分流程正確

---

*規格書結束 — 開發過程中任何與本文件衝突的實作決策,應回寫並更新此文件版本。*
