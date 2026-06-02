# 🎮 Typing Game — 打字練習遊戲 規格書

> **版本：** v1.0.0  
> **類型：** 純前端單頁應用（無需 Server、無需 Build）  
> **目標平台：** 桌面瀏覽器 ＋ 行動裝置（RWD）

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [目錄結構](#2-目錄結構)
3. [畫面與功能規格](#3-畫面與功能規格)
4. [視覺設計規格](#4-視覺設計規格)
5. [音樂與音效規格](#5-音樂與音效規格)
6. [RWD 響應式規格](#6-rwd-響應式規格)
7. [資料儲存規格](#7-資料儲存規格)
8. [遊戲機制規格](#8-遊戲機制規格)
9. [技術規範](#9-技術規範)
10. [開發里程碑](#10-開發里程碑)

---

## 1. 專案概覽

### 1.1 專案目的

製作一款可直接在瀏覽器開啟、無需任何建置步驟的打字練習遊戲。玩家透過練習打字提升速度與準確率，並可在不同主題配色、音效情境中享受遊戲樂趣。

### 1.2 核心原則

- **零建置啟動**：雙擊 `index.html` 即可遊玩，不依賴 Node.js、Webpack、任何本機 Server
- **純靜態資源**：所有 JS／CSS／音效／字型皆在本地，不需網路連線（字型可選用 CDN fallback）
- **漸進增強**：基本遊戲功能在舊版瀏覽器可運作；音效、動畫為增強層
- **行動裝置友善**：全程 RWD，行動裝置可用軟體鍵盤進行遊戲

### 1.3 技術堆疊

| 項目 | 技術 |
|------|------|
| 結構 | HTML5 |
| 樣式 | 原生 CSS3（CSS Variables、Flexbox、Grid） |
| 邏輯 | 原生 JavaScript ES6+（模組化 `<script type="module">`） |
| 音效 | Web Audio API + `<audio>` 元素 |
| 儲存 | `localStorage` |
| 字型 | Google Fonts CDN（Noto Sans TC、Orbitron）|

---

## 2. 目錄結構

```
typing-game/
│
├── index.html                  # 進入點，所有畫面皆在此渲染
│
├── assets/
│   ├── fonts/                  # 本地備用字型（.woff2）
│   │   ├── NotoSansTC-Bold.woff2
│   │   └── Orbitron-Bold.woff2
│   │
│   ├── audio/
│   │   ├── bgm/                # 背景音樂（循環播放）
│   │   │   ├── bgm_menu.mp3        # 主選單 BGM
│   │   │   ├── bgm_game_easy.mp3   # 遊戲中 BGM（簡單難度）
│   │   │   ├── bgm_game_normal.mp3 # 遊戲中 BGM（普通難度）
│   │   │   ├── bgm_game_hard.mp3   # 遊戲中 BGM（困難難度）
│   │   │   └── bgm_result.mp3      # 結算畫面 BGM
│   │   │
│   │   └── sfx/                # 音效（短促單次）
│   │       ├── sfx_key_correct.mp3     # 單鍵輸入正確
│   │       ├── sfx_key_wrong.mp3       # 單鍵輸入錯誤
│   │       ├── sfx_word_complete.mp3   # 單詞完成
│   │       ├── sfx_combo.mp3           # 連擊觸發
│   │       ├── sfx_combo_break.mp3     # 連擊中斷
│   │       ├── sfx_level_up.mp3        # 難度提升
│   │       ├── sfx_countdown.mp3       # 倒數滴答聲
│   │       ├── sfx_game_start.mp3      # 遊戲開始
│   │       ├── sfx_game_over.mp3       # 遊戲結束
│   │       ├── sfx_new_record.mp3      # 破紀錄
│   │       ├── sfx_btn_click.mp3       # 一般按鈕點擊
│   │       ├── sfx_btn_hover.mp3       # 按鈕 Hover
│   │       ├── sfx_screen_in.mp3       # 畫面切入
│   │       └── sfx_screen_out.mp3      # 畫面切出
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 全域變數（顏色、字型、間距、動畫時長）
│   │   └── typography.css      # 全域字型大小、行距規則
│   │
│   ├── layout/
│   │   ├── app.css             # 頂層 #app 容器排版
│   │   └── responsive.css      # 所有 @media 斷點規則（集中管理）
│   │
│   ├── components/
│   │   ├── button.css          # 按鈕元件樣式
│   │   ├── modal.css           # 彈窗元件樣式
│   │   ├── progress-bar.css    # 血條／時間條樣式
│   │   ├── scoreboard.css      # 分數板樣式
│   │   ├── keyboard.css        # 虛擬鍵盤視覺化樣式
│   │   └── toast.css           # 通知提示條樣式
│   │
│   ├── screens/
│   │   ├── screen-menu.css     # 主選單畫面
│   │   ├── screen-game.css     # 遊戲進行畫面
│   │   ├── screen-result.css   # 結算畫面
│   │   ├── screen-tutorial.css # 說明畫面
│   │   └── screen-settings.css # 設定畫面
│   │
│   └── themes/
│       ├── theme-default.css   # 預設主題（深夜藍）
│       ├── theme-neon.css      # 霓虹主題（螢光綠粉）
│       ├── theme-sakura.css    # 櫻花主題（粉紫白）
│       ├── theme-ocean.css     # 海洋主題（藍綠漸層）
│       ├── theme-sunset.css    # 夕陽主題（橘紅金）
│       └── theme-mono.css      # 極簡單色（黑白灰）
│
├── js/
│   ├── main.js                 # 進入點：初始化 App、載入模組
│   │
│   ├── core/
│   │   ├── App.js              # App 主控制器（畫面路由、生命週期）
│   │   ├── Router.js           # 簡易畫面切換路由器
│   │   ├── EventBus.js         # 全域事件匯流排（發布/訂閱）
│   │   └── StateManager.js     # 全域狀態管理（遊戲進度、設定）
│   │
│   ├── game/
│   │   ├── GameEngine.js       # 遊戲主迴圈、計時、難度控制
│   │   ├── WordGenerator.js    # 單詞產生器（多語言、難度分級）
│   │   ├── ScoreCalculator.js  # 分數、WPM、準確率計算
│   │   ├── ComboSystem.js      # 連擊系統
│   │   └── DifficultyManager.js# 動態難度調整
│   │
│   ├── screens/
│   │   ├── MenuScreen.js       # 主選單畫面邏輯
│   │   ├── GameScreen.js       # 遊戲畫面邏輯
│   │   ├── ResultScreen.js     # 結算畫面邏輯
│   │   ├── TutorialScreen.js   # 說明畫面邏輯
│   │   └── SettingsScreen.js   # 設定畫面邏輯
│   │
│   ├── audio/
│   │   ├── AudioManager.js     # 音效／BGM 統一管理器
│   │   ├── BGMPlayer.js        # 背景音樂播放控制（淡入淡出、切換）
│   │   └── SFXPool.js          # 音效物件池（避免延遲）
│   │
│   ├── ui/
│   │   ├── ThemeManager.js     # 主題切換管理
│   │   ├── AnimationManager.js # CSS 動畫觸發管理
│   │   ├── KeyboardVisualizer.js # 虛擬鍵盤視覺化
│   │   ├── ToastManager.js     # 通知提示管理
│   │   └── ModalManager.js     # 彈窗管理
│   │
│   ├── data/
│   │   ├── words-en.js         # 英文單詞庫（依難度分級）
│   │   ├── words-zh.js         # 中文詞語庫（依難度分級）
│   │   ├── words-num.js        # 數字練習庫
│   │   └── words-mixed.js      # 混合模式詞庫
│   │
│   └── utils/
│       ├── Storage.js          # localStorage 封裝工具
│       ├── Timer.js            # 高精度計時器封裝
│       ├── Formatter.js        # 時間、分數格式化工具
│       └── helpers.js          # 通用工具函式
│
└── data/
    └── leaderboard.json        # 預設排行榜示範資料（可被 localStorage 覆蓋）
```

---

## 3. 畫面與功能規格

### 3.1 主選單畫面（Menu Screen）

**路由 ID：** `#menu`

#### 視覺元素

| 元素 | 說明 |
|------|------|
| 遊戲 Logo | 大字體動態標題「TYPING MASTER」，帶打字機動畫效果 |
| 背景 | 主題色漸層背景，帶流動粒子或浮動字元特效 |
| 版本號 | 右下角顯示，小字 |
| BGM 圖示 | 右上角音樂開關按鈕 |

#### 主選單按鈕（垂直排列，大型卡片式）

```
┌─────────────────────────┐
│  ▶  開始遊戲            │  → 進入難度選擇 Modal
├─────────────────────────┤
│  ↩  繼續遊戲            │  → 讀取上次進度（若無則 disabled）
├─────────────────────────┤
│  ?  說明                │  → 進入說明畫面
├─────────────────────────┤
│  ⚙  設定               │  → 進入設定畫面
└─────────────────────────┘
```

#### 開始遊戲 → 難度選擇 Modal

點擊「開始遊戲」後彈出 Modal，包含：

- **語言選擇**：English / 中文 / 數字 / 混合
- **難度選擇**：
  - 🟢 **簡單（Easy）**：常用短字、慢速、長時限
  - 🟡 **普通（Normal）**：中等詞彙、標準速度
  - 🔴 **困難（Hard）**：生僻詞＋標點、短時限、快速
  - 💀 **地獄（Hell）**：隨機混語、超短時限、動態加速
- **遊戲時長**：60 秒 / 120 秒 / 無限制
- **確認開始** 按鈕

#### 繼續遊戲

- 從 `localStorage` 讀取 `savedGameState`
- 若有進度：顯示上次統計（WPM、正確率、剩餘時間），點擊繼續
- 若無進度：按鈕呈 `disabled` 狀態，並顯示提示文字

---

### 3.2 遊戲畫面（Game Screen）

**路由 ID：** `#game`

#### 版面配置（Desktop）

```
┌──────────────────────────────────────────────────┐
│  [難度標籤]    [時間條 ████████░░]    [分數: 0]  │  ← 頂部 HUD
│  [WPM: --]                         [準確率: --]  │
├──────────────────────────────────────────────────┤
│                                                  │
│          ┌──────────────────────┐                │
│          │  目標單詞顯示區       │  ← 大字體，高亮當前字元
│          │  T Y P I N G        │
│          └──────────────────────┘                │
│                                                  │
│          ┌──────────────────────┐                │
│          │  玩家輸入顯示區       │  ← 即時比對顯示
│          └──────────────────────┘                │
│                                                  │
│  [連擊數 x12 🔥]     [進度條 ████░░░░░]         │
│                                                  │
├──────────────────────────────────────────────────┤
│              虛擬鍵盤視覺化（可選）               │  ← 按下按鍵時高亮
└──────────────────────────────────────────────────┘
```

#### 遊戲元件規格

| 元件 | 規格 |
|------|------|
| **目標單詞區** | 字型 `Orbitron` 或 `Noto Sans TC`，最小 `2.5rem`，每個字元獨立 `<span>` 包裹 |
| **字元狀態色** | 未輸入：主題前景色 / 正確：綠色 / 錯誤：紅色底線 / 當前游標：主題強調色閃爍 |
| **輸入框** | 透明背景，僅顯示邊框，`font-size: 2rem` 以上，自動聚焦 |
| **時間條** | 滿版寬度，顏色隨剩餘時間從綠→黃→紅漸變，剩餘 10 秒開始閃爍 |
| **WPM 計數** | 每 1 秒更新一次，帶平滑數字滾動動畫 |
| **連擊計數** | 10 連擊起顯示，50、100 連擊有特效爆發動畫 |
| **虛擬鍵盤** | 設定中可關閉，按鍵按下時高亮持續 `100ms` |

#### 遊戲流程

```
開始倒數 (3, 2, 1, GO!) 
    → 顯示第一個目標單詞 
    → 玩家輸入 
    → 每字元比對（即時） 
    → 正確完成單詞 → 播放音效 → 加分 → 顯示下一個單詞
    → 輸入錯誤 → 紅色高亮 → 播放錯誤音效
    → 時間到 or 無限模式按 ESC 
    → 進入結算畫面
```

#### 暫停功能

- 按 `ESC` 或點擊暫停按鈕
- 畫面模糊＋顯示暫停 Modal
- 暫停 Modal 選項：繼續 / 重新開始 / 儲存並返回主選單

---

### 3.3 結算畫面（Result Screen）

**路由 ID：** `#result`

#### 顯示內容

| 項目 | 說明 |
|------|------|
| 最終 WPM | 超大字體，帶計數器動畫 |
| 準確率 | 圓形進度圖 |
| 正確字數 / 錯誤字數 | 條形比較圖 |
| 最高連擊 | 帶火焰圖示 |
| 總完成單詞數 | |
| 歷史最高比較 | 若破紀錄，顯示金色特效＋音效 |

#### 按鈕

- **再玩一次**：相同設定重新開始
- **更換設定**：返回難度選擇 Modal
- **返回主選單**
- **分享成績**（選用）：複製成績文字到剪貼簿

---

### 3.4 說明畫面（Tutorial Screen）

**路由 ID：** `#tutorial`

#### 分頁結構

```
[遊戲規則] [操作說明] [計分規則] [快捷鍵]
```

| 分頁 | 內容 |
|------|------|
| **遊戲規則** | 圖文說明遊戲目標、如何計算 WPM、準確率定義 |
| **操作說明** | 動態展示打字流程，用動畫示範字元對比 |
| **計分規則** | 說明基礎分、連擊加成、難度倍率、時間獎勵 |
| **快捷鍵** | 表格列出所有鍵盤快捷鍵 |

#### 快捷鍵表

| 按鍵 | 功能 |
|------|------|
| `ESC` | 暫停 / 返回 |
| `Tab` | 跳過當前單詞（扣分） |
| `F1` | 開啟說明 |
| `M` | 靜音切換 |
| `Ctrl + R` | 重新開始（遊戲中） |

---

### 3.5 設定畫面（Settings Screen）

**路由 ID：** `#settings`

#### 設定分類

**🎨 外觀設定**

| 設定項 | 類型 | 選項 |
|--------|------|------|
| 主題配色 | 卡片選擇器 | 深夜藍 / 霓虹 / 櫻花 / 海洋 / 夕陽 / 極簡 |
| 字型大小 | 滑桿 | Small（1.8rem）/ Medium（2.5rem）/ Large（3.2rem）|
| 動畫效果 | 開關 | 開 / 關（無障礙模式） |
| 虛擬鍵盤顯示 | 開關 | 開 / 關 |

**🔊 音效設定**

| 設定項 | 類型 | 說明 |
|--------|------|------|
| 主音量 | 滑桿 0–100 | 控制所有音量 |
| BGM 音量 | 滑桿 0–100 | 獨立控制背景音樂 |
| 音效音量 | 滑桿 0–100 | 獨立控制音效 |
| 音效組合 | 單選 | 標準 / 機械鍵盤 / 輕觸 / 8-bit |
| 切換畫面繼續播放 BGM | 開關 | 控制畫面切換時 BGM 是否延續 |

**🎮 遊戲設定**

| 設定項 | 類型 | 說明 |
|--------|------|------|
| 顯示即時 WPM | 開關 | 遊戲中顯示 WPM 計算 |
| 錯誤震動提示 | 開關 | 輸入錯誤時畫面輕微震動 |
| 連擊特效 | 開關 | 高連擊時的粒子特效 |
| 自動跳過錯誤 | 開關 | 開啟後允許帶錯誤繼續（不建議） |

**🗑️ 資料管理**

- 清除遊戲紀錄（帶確認 Modal）
- 清除所有設定（重置為預設值）
- 匯出成績為 JSON

---

## 4. 視覺設計規格

### 4.1 字型規範

```css
/* 主要字型堆疊 */
--font-display: 'Orbitron', 'Noto Sans TC', monospace;  /* 標題、分數 */
--font-game:    'Noto Sans TC', 'Courier New', monospace; /* 遊戲文字 */
--font-ui:      'Noto Sans TC', system-ui, sans-serif;    /* UI 元素 */
```

| 用途 | 最小字型大小 | 說明 |
|------|-------------|------|
| 遊戲目標單詞 | `2.5rem` (40px) | 行動裝置不得低於 `2rem` |
| 遊戲輸入文字 | `2rem` (32px) | |
| WPM / 分數顯示 | `3rem` (48px) | 帶 monospace 對齊 |
| 主選單按鈕 | `1.6rem` (26px) | |
| 標題 Logo | `4rem` (64px) | 行動裝置縮為 `2.5rem` |
| 說明文字 | `1.2rem` (19px) | 不得低於 `1rem` |
| 小標籤 | `1rem` (16px) | 最小極限，禁止更小 |

### 4.2 主題配色規格

每個主題定義以下 CSS 變數：

```css
:root {
  /* 背景層 */
  --color-bg-primary:    /* 主背景 */
  --color-bg-secondary:  /* 卡片背景 */
  --color-bg-tertiary:   /* 輸入框背景 */

  /* 文字層 */
  --color-text-primary:  /* 主要文字 */
  --color-text-secondary:/* 次要文字 */
  --color-text-muted:    /* 說明文字 */

  /* 強調色 */
  --color-accent:        /* 主強調色（按鈕、游標）*/
  --color-accent-hover:  /* Hover 狀態 */

  /* 遊戲狀態色 */
  --color-correct:       /* 輸入正確（綠）*/
  --color-wrong:         /* 輸入錯誤（紅）*/
  --color-pending:       /* 未輸入（半透明）*/
  --color-cursor:        /* 游標閃爍色 */

  /* 功能色 */
  --color-success:
  --color-warning:
  --color-danger:
  --color-info:
}
```

#### 六大主題色定義

| 主題 | `--color-bg-primary` | `--color-accent` | 氛圍 |
|------|---------------------|------------------|------|
| **深夜藍**（Default）| `#0d1117` | `#58a6ff` | 冷靜專注 |
| **霓虹**（Neon）| `#0a0014` | `#ff00ff` | 電馭賽博 |
| **櫻花**（Sakura）| `#fff0f5` | `#e91e8c` | 夢幻溫柔 |
| **海洋**（Ocean）| `#042a44` | `#00d4ff` | 深海清涼 |
| **夕陽**（Sunset）| `#1a0a00` | `#ff6b35` | 溫暖熱情 |
| **極簡**（Mono）| `#1a1a1a` | `#ffffff` | 簡潔純粹 |

### 4.3 動畫規格

```css
/* 動畫時長全域變數 */
--anim-fast:    150ms;   /* 按鈕 hover、按鍵高亮 */
--anim-normal:  300ms;   /* 畫面元件進出 */
--anim-slow:    600ms;   /* 畫面切換、Modal 開合 */
--anim-cursor:  800ms;   /* 游標閃爍週期 */
```

| 動畫 | 類型 | 時長 |
|------|------|------|
| 畫面切入 | Fade + Slide Up | 300ms |
| 畫面切出 | Fade + Slide Down | 200ms |
| 正確輸入字元 | 顏色變換 + scale(1.1) | 100ms |
| 錯誤輸入 | 水平 shake | 200ms |
| 連擊爆發 | 粒子噴散 + 文字縮放 | 500ms |
| 破紀錄 | 金色光效 + 全畫面閃光 | 1000ms |
| 按鈕 Hover | scale(1.03) + 發光陰影 | 150ms |

---

## 5. 音樂與音效規格

### 5.1 BGM 管理策略

`BGMPlayer.js` 負責統一控管背景音樂，核心邏輯如下：

```
畫面切換時：
  IF 設定「切換畫面繼續播放 BGM」= ON
    → 當前 BGM 持續播放，不中斷
    → 僅在進入「需要不同 BGM 的畫面」時才切換
  ELSE
    → 畫面切出時 BGM 淡出（300ms）
    → 畫面切入時新 BGM 淡入（500ms）
```

#### BGM 對應表

| 畫面 | BGM 檔案 | 是否循環 | 淡入時長 |
|------|---------|---------|---------|
| 主選單 | `bgm_menu.mp3` | ✅ | 1000ms |
| 遊戲（簡單） | `bgm_game_easy.mp3` | ✅ | 500ms |
| 遊戲（普通） | `bgm_game_normal.mp3` | ✅ | 500ms |
| 遊戲（困難） | `bgm_game_hard.mp3` | ✅ | 500ms |
| 遊戲（地獄） | `bgm_game_hard.mp3` | ✅ | 300ms（加速版） |
| 結算畫面 | `bgm_result.mp3` | ✅ | 800ms |
| 說明畫面 | 繼承主選單 BGM | — | — |
| 設定畫面 | 繼承主選單 BGM | — | — |

> **規則：** 說明畫面與設定畫面不切換 BGM，沿用進入前的背景音樂。

### 5.2 音效事件對應表

| 事件 | 音效檔 | 觸發條件 | 說明 |
|------|--------|---------|------|
| 按鍵正確 | `sfx_key_correct.mp3` | 每個正確字元 | 音調可依連擊數升高 |
| 按鍵錯誤 | `sfx_key_wrong.mp3` | 每個錯誤字元 | 音量略低，不過於刺耳 |
| 單詞完成 | `sfx_word_complete.mp3` | 完整輸入一個單詞 | 比按鍵音效更悅耳 |
| 連擊觸發 | `sfx_combo.mp3` | 達到 10、25、50、100 連擊 | 不同連擊數播放不同版本 |
| 連擊中斷 | `sfx_combo_break.mp3` | 連擊歸零時 | 短促低沉音效 |
| 難度提升 | `sfx_level_up.mp3` | 動態難度調升時 | 清脆上升音階 |
| 倒數計時 | `sfx_countdown.mp3` | 剩餘 5 秒起每秒播放 | 節拍式滴答聲 |
| 遊戲開始 | `sfx_game_start.mp3` | 倒數結束、遊戲啟動 | 充滿活力的開始音效 |
| 遊戲結束 | `sfx_game_over.mp3` | 時間歸零 | 結束收尾音效 |
| 破紀錄 | `sfx_new_record.mp3` | 超過歷史最高 WPM | 慶祝性音效 |
| 按鈕點擊 | `sfx_btn_click.mp3` | 所有可點擊按鈕 | 輕觸點擊聲 |
| 按鈕 Hover | `sfx_btn_hover.mp3` | 滑鼠滑過按鈕 | 極輕柔，音量 20% |
| 畫面切入 | `sfx_screen_in.mp3` | 畫面出現時 | Whoosh 式音效 |
| 畫面切出 | `sfx_screen_out.mp3` | 畫面消失時 | 反向 Whoosh |

### 5.3 SFX 物件池設計

為避免快速連續按鍵時音效延遲或截斷，使用音效物件池：

```javascript
// SFXPool.js 核心概念
class SFXPool {
  constructor(src, poolSize = 5) {
    this.pool = Array.from({ length: poolSize }, () => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      return audio;
    });
    this.index = 0;
  }

  play(volume = 1.0, pitchShift = 0) {
    const audio = this.pool[this.index % this.pool.length];
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {}); // 忽略 autoplay 限制錯誤
    this.index++;
  }
}
```

### 5.4 音效組合（Skin）

| Skin 名稱 | 風格 | 按鍵音特色 |
|-----------|------|----------|
| **標準** | 清爽電子聲 | 乾淨的 click/pop |
| **機械鍵盤** | 真實感 | 仿 Cherry MX 紅軸聲 |
| **輕觸** | 柔和 | 羽毛觸感，音量較低 |
| **8-bit** | 復古像素風 | Chiptune 風格按鍵音 |

---

## 6. RWD 響應式規格

### 6.1 斷點定義（集中於 `responsive.css`）

```css
/* 斷點定義 */
:root {
  --bp-sm:  480px;   /* 小型手機 */
  --bp-md:  768px;   /* 大型手機 / 平板直向 */
  --bp-lg:  1024px;  /* 平板橫向 / 小筆電 */
  --bp-xl:  1440px;  /* 桌面 */
}

@media (max-width: 480px)  { /* 小型手機模式 */ }
@media (max-width: 768px)  { /* 手機模式 */     }
@media (max-width: 1024px) { /* 平板模式 */     }
@media (min-width: 1440px) { /* 大螢幕模式 */   }
```

### 6.2 各裝置適配策略

| 功能 | 桌面 | 平板 | 手機 |
|------|------|------|------|
| 遊戲目標字型 | `2.5rem` | `2.2rem` | `1.8rem` |
| WPM 顯示字型 | `3rem` | `2.5rem` | `2rem` |
| 選單按鈕高度 | `72px` | `64px` | `56px` |
| 虛擬鍵盤 | 可選顯示 | 可選顯示 | **預設隱藏**（使用軟體鍵盤）|
| Modal 寬度 | `520px` max | `90vw` | `100vw`（底部滑出式）|
| 輸入框 | 中央定位 | 中央定位 | 固定在畫面底部 |

### 6.3 行動裝置特別處理

```javascript
// 行動裝置輸入框聚焦策略
// 防止輸入框自動滾動導致版面破版
inputField.addEventListener('focus', () => {
  document.body.style.overflow = 'hidden';
  // 確保遊戲區域在視窗頂部
  window.scrollTo(0, 0);
});

// 偵測軟體鍵盤彈出（調整遊戲區域高度）
window.visualViewport.addEventListener('resize', adjustForVirtualKeyboard);
```

- **輸入框**：行動裝置固定於畫面底部，讓單詞顯示區保持在鍵盤上方
- **觸控**：所有按鈕 min-height `44px`（符合 Apple HIG）
- **防止縮放**：`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`
- **安全區域**：支援 iPhone 劉海／動態島，使用 `env(safe-area-inset-*)` 補償

---

## 7. 資料儲存規格

### 7.1 localStorage 資料結構

```javascript
// 鍵名前綴：`typingGame_`

// 玩家設定
typingGame_settings: {
  theme: 'default',           // 主題名稱
  fontSize: 'medium',         // small | medium | large
  bgmVolume: 80,              // 0–100
  sfxVolume: 70,              // 0–100
  masterVolume: 100,          // 0–100
  sfxSkin: 'standard',        // standard | mechanical | soft | 8bit
  showVirtualKeyboard: true,
  persistBGM: true,           // 切換畫面 BGM 繼續
  showLiveWPM: true,
  enableShakeOnError: true,
  enableComboEffect: true,
  animation: true,
  language: 'en',             // en | zh | num | mixed
  difficulty: 'normal',       // easy | normal | hard | hell
  gameDuration: 60            // 60 | 120 | 0（無限）
}

// 遊戲進度（暫存，用於繼續遊戲）
typingGame_savedGame: {
  timeRemaining: 45,
  score: 1230,
  combo: 8,
  wordsCompleted: 12,
  errors: 3,
  settings: { /* 當局設定快照 */ }
}

// 歷史紀錄（保留最近 50 筆）
typingGame_history: [
  {
    date: '2024-01-15T10:30:00Z',
    wpm: 87,
    accuracy: 96.5,
    score: 8740,
    wordsCompleted: 52,
    maxCombo: 34,
    difficulty: 'normal',
    language: 'en',
    duration: 60
  }
  // ...
]

// 最高紀錄（依難度分別儲存）
typingGame_records: {
  easy:   { wpm: 0, accuracy: 0, score: 0, date: null },
  normal: { wpm: 0, accuracy: 0, score: 0, date: null },
  hard:   { wpm: 0, accuracy: 0, score: 0, date: null },
  hell:   { wpm: 0, accuracy: 0, score: 0, date: null }
}
```

---

## 8. 遊戲機制規格

### 8.1 WPM 計算

```
WPM（Words Per Minute）= (正確輸入的字元數 ÷ 5) ÷ 已流逝秒數 × 60

說明：
  - 業界標準以「5個字元 = 1個單詞」計算
  - 每1秒更新一次顯示值
  - 結算時使用最終累計值
```

### 8.2 準確率計算

```
準確率 = 正確字元數 ÷ (正確字元數 + 錯誤字元數) × 100%

說明：
  - 退格鍵不計入錯誤（允許修正）
  - 最終提交的字元才計入統計
```

### 8.3 計分公式

```
基礎分 = 正確字元數 × 10
連擊加成 = 基礎分 × (combo ÷ 100 + 1)  // 100連擊 = 2倍
難度倍率：
  Easy:   ×0.8
  Normal: ×1.0
  Hard:   ×1.5
  Hell:   ×2.5
時間獎勵 = 剩餘秒數 × 5（僅限有時限模式）

最終分數 = (基礎分 + 連擊加成) × 難度倍率 + 時間獎勵
```

### 8.4 連擊系統

| 連擊數 | 視覺效果 | 音效 |
|--------|---------|------|
| 10 | 連擊計數顯示，帶入場動畫 | sfx_combo（版本A）|
| 25 | 文字加大，顏色鮮豔化 | sfx_combo（版本B）|
| 50 | 🔥 圖示出現，震動特效 | sfx_combo（版本C）|
| 100 | 全畫面邊框電光特效 | sfx_combo（版本D）|
| 中斷 | 數字縮小消失 | sfx_combo_break |

### 8.5 動態難度（Hard / Hell 模式）

```
每完成 N 個單詞，詞彙池升級一個難度層：
  Layer 1：1–3 字母常用詞
  Layer 2：4–6 字母中頻詞
  Layer 3：7+ 字母、含標點
  Layer 4：混合語言、數字符號

Hell 模式額外機制：
  - 時間條減少速度隨進度加快
  - 每隔 20 秒隨機觸發「速度衝刺」（時間條急速減少 5 秒）
  - 超過 50 連擊後，詞語顯示時間限制（必須在 X 秒內開始輸入）
```

---

## 9. 技術規範

### 9.1 HTML 進入點結構

```html
<!DOCTYPE html>
<html lang="zh-TW" data-theme="default">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Typing Master — 打字練習遊戲</title>

  <!-- 字型 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Noto+Sans+TC:wght@400;700&display=swap" rel="stylesheet">

  <!-- CSS：依序載入，後者覆蓋前者 -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">
  <link rel="stylesheet" href="css/layout/app.css">
  <link rel="stylesheet" href="css/components/button.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/progress-bar.css">
  <link rel="stylesheet" href="css/components/scoreboard.css">
  <link rel="stylesheet" href="css/components/keyboard.css">
  <link rel="stylesheet" href="css/components/toast.css">
  <link rel="stylesheet" href="css/screens/screen-menu.css">
  <link rel="stylesheet" href="css/screens/screen-game.css">
  <link rel="stylesheet" href="css/screens/screen-result.css">
  <link rel="stylesheet" href="css/screens/screen-tutorial.css">
  <link rel="stylesheet" href="css/screens/screen-settings.css">
  <link rel="stylesheet" href="css/themes/theme-default.css">
  <link rel="stylesheet" href="css/layout/responsive.css">
  <!-- 其他主題（由 ThemeManager.js 動態切換） -->
</head>
<body>
  <div id="app">
    <!-- 所有畫面由 JS 動態渲染至此 -->
    <div id="screen-container"></div>

    <!-- 全域 UI 元件 -->
    <div id="toast-container" aria-live="polite"></div>
    <div id="modal-overlay"></div>
  </div>

  <!-- JS：使用 ES Module -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 9.2 JS 模組入口

```javascript
// js/main.js
import { App } from './core/App.js';
import { AudioManager } from './audio/AudioManager.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { StateManager } from './core/StateManager.js';

// 初始化應用
const state = new StateManager();
const audio = new AudioManager(state);
const theme = new ThemeManager(state);
const app = new App({ state, audio, theme });

app.init(); // 載入設定 → 套用主題 → 顯示主選單
```

### 9.3 瀏覽器相容性

| 瀏覽器 | 最低版本 | 備註 |
|--------|---------|------|
| Chrome / Edge | 90+ | 完整支援 |
| Firefox | 88+ | 完整支援 |
| Safari | 14+ | 需注意 Web Audio API 需使用者互動後啟動 |
| iOS Safari | 14.5+ | 軟體鍵盤適配需特別測試 |

> ⚠️ **Safari / iOS 限制**：Web Audio API 必須在使用者手勢（點擊）後才能啟動。確保音效系統在首次按鈕點擊後初始化，而非頁面載入時自動初始化。

### 9.4 效能指標目標

| 指標 | 目標 |
|------|------|
| 首次載入時間 | < 2 秒（含字型） |
| 按鍵輸入延遲 | < 16ms（1 幀） |
| 音效觸發延遲 | < 30ms |
| 畫面切換動畫 | 60fps |
| 記憶體使用 | < 50MB |

---

## 10. 開發里程碑

### Phase 1：骨架建立（預計 2–3 天）
- [ ] 建立目錄結構與所有空白檔案
- [ ] 實作 HTML 骨架與 CSS 基礎（變數、Reset、Typography）
- [ ] 實作 Router + App 主控制器
- [ ] 實作主選單畫面（靜態版）

### Phase 2：遊戲核心（預計 3–5 天）
- [ ] 實作 GameEngine（計時、輸入比對）
- [ ] 實作 WordGenerator（詞庫載入、難度分級）
- [ ] 實作 ScoreCalculator + ComboSystem
- [ ] 實作遊戲畫面（動態渲染）
- [ ] 實作結算畫面

### Phase 3：音效系統（預計 2–3 天）
- [ ] 製作／取得所有 BGM 與音效素材
- [ ] 實作 BGMPlayer（淡入淡出、切換邏輯）
- [ ] 實作 SFXPool（物件池）
- [ ] 整合所有音效事件綁定
- [ ] 實作音效組合（Skin）切換

### Phase 4：UI 完善（預計 2–3 天）
- [ ] 實作六大主題（CSS Variables 切換）
- [ ] 實作 ThemeManager
- [ ] 實作設定畫面（含所有設定項）
- [ ] 實作說明畫面
- [ ] 實作 ToastManager、ModalManager
- [ ] 實作虛擬鍵盤視覺化

### Phase 5：RWD 與優化（預計 2 天）
- [ ] 完成所有 @media 斷點
- [ ] 行動裝置輸入框適配
- [ ] iOS Safari 相容性修正
- [ ] 效能優化（動畫 60fps、音效延遲）
- [ ] LocalStorage 資料持久化完整測試

### Phase 6：測試與發布（預計 1–2 天）
- [ ] 跨裝置功能測試（iOS / Android / Desktop）
- [ ] 無障礙基礎檢查（contrast ratio、focus 可見性）
- [ ] 最終 bug fix
- [ ] README.md 撰寫

---

## 附錄：檔案引用對照

| 功能 | 相關檔案 |
|------|---------|
| 主題切換 | `css/themes/*.css` + `js/ui/ThemeManager.js` |
| 音樂管理 | `js/audio/BGMPlayer.js` + `assets/audio/bgm/` |
| 音效管理 | `js/audio/SFXPool.js` + `assets/audio/sfx/` |
| 遊戲邏輯 | `js/game/GameEngine.js` + `js/game/ScoreCalculator.js` |
| 詞庫 | `js/data/words-*.js` |
| 設定儲存 | `js/utils/Storage.js` + localStorage |
| RWD | `css/layout/responsive.css` |
| 畫面路由 | `js/core/Router.js` + `js/screens/*.js` |
