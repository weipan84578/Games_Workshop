# 🎮 數獨遊戲 (Sudoku Game) — 前端規格書

> **版本**：v1.0.0  
> **最後更新**：2026-05-26  
> **技術棧**：純 HTML5 / CSS3 / Vanilla JavaScript（無需任何 build 工具或 server）

---

## 目錄

1. [專案概述](#1-專案概述)
2. [目錄結構](#2-目錄結構)
3. [頁面與功能規格](#3-頁面與功能規格)
4. [響應式設計（RWD）](#4-響應式設計rwd)
5. [視覺設計系統](#5-視覺設計系統)
6. [音樂與音效系統](#6-音樂與音效系統)
7. [數獨核心邏輯](#7-數獨核心邏輯)
8. [存檔與繼續遊戲](#8-存檔與繼續遊戲)
9. [設定系統](#9-設定系統)
10. [CSS 模組規劃](#10-css-模組規劃)
11. [JavaScript 模組規劃](#11-javascript-模組規劃)
12. [資料流與狀態管理](#12-資料流與狀態管理)
13. [效能與相容性](#13-效能與相容性)

---

## 1. 專案概述

### 1.1 目標

製作一款完全純前端的數獨遊戲，玩家只需雙擊 `index.html` 即可在瀏覽器中遊玩，無需任何安裝、編譯或伺服器環境。

### 1.2 核心特色

| 特色 | 說明 |
|------|------|
| 零依賴部署 | 直接開啟 `index.html`，所有資源皆為本地或 CDN 字型 |
| 多主題配色 | 提供 6 種以上視覺主題，可即時切換 |
| 豐富音效 | 背景音樂 + 互動音效，全面提升沉浸感 |
| RWD 完整支援 | 手機、平板、桌機皆可流暢遊玩 |
| 大字體無障礙 | 所有文字使用明確大字體，易於閱讀 |
| 遊戲存檔 | 利用 `localStorage` 支援「繼續遊戲」 |

---

## 2. 目錄結構

```
sudoku/
│
├── index.html                  # 主入口，引入所有 CSS & JS
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（主題色、字體、間距）
│   │   └── typography.css      # 全站字體大小與字型規則
│   │
│   ├── layout/
│   │   ├── grid.css            # 整體版面網格系統
│   │   └── responsive.css      # 斷點與 RWD 規則
│   │
│   ├── components/
│   │   ├── button.css          # 按鈕元件
│   │   ├── modal.css           # 彈窗／對話框元件
│   │   ├── board.css           # 數獨棋盤樣式
│   │   ├── numpad.css          # 數字選擇鍵盤
│   │   ├── timer.css           # 計時器元件
│   │   ├── navbar.css          # 頂部導覽列
│   │   └── toast.css           # 提示訊息（Toast）
│   │
│   ├── screens/
│   │   ├── home.css            # 主畫面（首頁）
│   │   ├── game.css            # 遊戲畫面
│   │   ├── instructions.css    # 說明畫面
│   │   └── settings.css        # 設定畫面
│   │
│   ├── themes/
│   │   ├── theme-classic.css   # 主題：經典白
│   │   ├── theme-dark.css      # 主題：暗夜黑
│   │   ├── theme-ocean.css     # 主題：海洋藍
│   │   ├── theme-forest.css    # 主題：森林綠
│   │   ├── theme-sakura.css    # 主題：櫻花粉
│   │   └── theme-galaxy.css    # 主題：星河紫
│   │
│   └── animations/
│       ├── transitions.css     # 畫面切換過場動畫
│       ├── effects.css         # 填數字、錯誤、完成等動畫
│       └── loading.css         # 載入動畫
│
├── js/
│   ├── core/
│   │   ├── sudoku-generator.js # 數獨題目生成演算法
│   │   ├── sudoku-solver.js    # 數獨求解器（驗證用）
│   │   └── sudoku-validator.js # 即時合法性驗證
│   │
│   ├── state/
│   │   ├── game-state.js       # 遊戲狀態（當前題目、答案、步驟）
│   │   ├── settings-state.js   # 設定狀態（主題、音量、難度等）
│   │   └── storage.js          # localStorage 讀寫封裝
│   │
│   ├── ui/
│   │   ├── board-renderer.js   # 棋盤 DOM 渲染
│   │   ├── numpad-renderer.js  # 數字鍵盤渲染
│   │   ├── screen-manager.js   # 畫面切換管理
│   │   ├── modal-manager.js    # 彈窗控制
│   │   ├── timer-ui.js         # 計時器 UI 更新
│   │   └── toast-manager.js    # Toast 提示訊息
│   │
│   ├── audio/
│   │   ├── audio-manager.js    # 音樂／音效統一管理器
│   │   ├── bgm-controller.js   # 背景音樂控制（循環、淡入淡出）
│   │   └── sfx-controller.js   # 音效控制（點擊、錯誤、完成等）
│   │
│   ├── input/
│   │   ├── keyboard-handler.js # 鍵盤輸入處理
│   │   ├── touch-handler.js    # 觸控手勢處理
│   │   └── mouse-handler.js    # 滑鼠點擊處理
│   │
│   └── main.js                 # 主進入點，初始化所有模組
│
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── bgm-home.mp3        # 主畫面背景音樂
│   │   │   ├── bgm-game-easy.mp3   # 遊戲（簡單）背景音樂
│   │   │   ├── bgm-game-medium.mp3 # 遊戲（中等）背景音樂
│   │   │   ├── bgm-game-hard.mp3   # 遊戲（困難）背景音樂
│   │   │   └── bgm-settings.mp3    # 設定畫面背景音樂
│   │   │
│   │   └── sfx/
│   │       ├── sfx-click.mp3       # 一般按鈕點擊
│   │       ├── sfx-select.mp3      # 選取格子
│   │       ├── sfx-input.mp3       # 填入數字
│   │       ├── sfx-erase.mp3       # 清除數字
│   │       ├── sfx-error.mp3       # 填入錯誤數字
│   │       ├── sfx-hint.mp3        # 使用提示
│   │       ├── sfx-complete-row.mp3    # 完成一行
│   │       ├── sfx-complete-col.mp3    # 完成一列
│   │       ├── sfx-complete-box.mp3    # 完成一個九宮格
│   │       ├── sfx-victory.mp3     # 完成整局
│   │       ├── sfx-game-over.mp3   # 錯誤次數用盡
│   │       ├── sfx-undo.mp3        # 復原操作
│   │       ├── sfx-screen-in.mp3   # 畫面進場
│   │       └── sfx-screen-out.mp3  # 畫面離場
│   │
│   ├── icons/
│   │   └── favicon.ico
│   │
│   └── fonts/
│       └── （可選）本地字型備援
│
└── README.md
```

---

## 3. 頁面與功能規格

### 3.1 畫面總覽

```
[主畫面 Home] ──→ [遊戲畫面 Game]
      │         ↗ （新遊戲 / 繼續遊戲）
      ├──→ [說明畫面 Instructions]
      └──→ [設定畫面 Settings]
```

所有畫面切換皆為單頁應用（SPA）方式，透過 `screen-manager.js` 控制 DOM 顯示／隱藏，**不重新載入頁面**，確保背景音樂可持續播放。

---

### 3.2 主畫面（Home Screen）

#### UI 元素

| 元素 | 說明 |
|------|------|
| 遊戲標題 Logo | 大型藝術字，含動態光影效果 |
| 開始遊戲按鈕 | 點擊後進入難度選擇彈窗 |
| 繼續遊戲按鈕 | 有存檔時啟用，直接載入上次進度；無存檔時呈灰色 disabled 狀態 |
| 說明按鈕 | 切換至說明畫面 |
| 設定按鈕 | 切換至設定畫面 |
| 版本資訊 | 右下角小字顯示版本號 |

#### 難度選擇彈窗

| 難度 | 挖空數 | 說明 |
|------|--------|------|
| 簡單（Easy） | 36 格 | 適合新手，提示數較多 |
| 中等（Medium） | 46 格 | 一般玩家 |
| 困難（Hard） | 52 格 | 考驗邏輯推理 |
| 專家（Expert） | 58 格 | 高難度挑戰 |

---

### 3.3 遊戲畫面（Game Screen）

#### 頂部工具列

| 元素 | 功能 |
|------|------|
| 返回按鈕 | 確認後返回主畫面（自動存檔） |
| 難度標籤 | 顯示當前難度 |
| 計時器 | MM:SS 格式，可在設定中關閉 |
| 錯誤計數 | 顯示 ❌ × N，最多 3 次（可在設定中調整） |

#### 數獨棋盤

- 9×9 方格，以粗線區分 3×3 九宮格
- 格子狀態視覺化：

| 狀態 | 視覺表現 |
|------|----------|
| 題目數字（固定） | 粗體深色字，不可編輯 |
| 玩家填入（正確） | 主題色字體 |
| 玩家填入（錯誤） | 紅色字體 + 抖動動畫 |
| 當前選中格 | 高亮背景色 |
| 同行/列/宮格 | 淡高亮背景 |
| 相同數字 | 次要高亮（方便尋找） |
| 提示格 | 特殊高亮 + 短暫閃爍動畫 |

#### 數字鍵盤（NumPad）

- 1～9 數字按鈕 + 清除（✕）按鈕
- 已在棋盤出現 9 次的數字自動變 disabled
- 備忘模式（Memo Mode）切換按鈕：開啟後填入小數字筆記

#### 操作按鈕列

| 按鈕 | 功能 |
|------|------|
| 復原（Undo） | 取消上一步操作（最多 50 步） |
| 提示（Hint） | 自動填入一格正確答案（每局限 3 次） |
| 清除（Erase） | 清除選中格的填入數字 |
| 備忘（Memo） | 切換備忘筆記模式 |
| 暫停（Pause） | 暫停計時並遮蓋棋盤 |

#### 完成畫面

- 動態慶祝動畫（彩紙紛飛效果）
- 顯示：完成時間、難度、錯誤次數、評分星級
- 按鈕：再來一局、返回主畫面、分享成績（複製文字）

---

### 3.4 說明畫面（Instructions Screen）

- 數獨規則介紹（配圖示）
- 操作按鈕說明
- 備忘功能說明
- 計分與評級說明
- 可捲動長頁，背景播放輕柔音樂

---

### 3.5 設定畫面（Settings Screen）

| 設定項目 | 類型 | 選項 |
|----------|------|------|
| 主題配色 | 圖示選擇器 | 6 種主題 |
| 背景音樂音量 | 滑桿 (0–100) | — |
| 音效音量 | 滑桿 (0–100) | — |
| 背景音樂開關 | 切換開關 | 開 / 關 |
| 音效開關 | 切換開關 | 開 / 關 |
| 錯誤限制次數 | 選擇器 | 3 / 5 / 無限 |
| 計時器顯示 | 切換開關 | 顯示 / 隱藏 |
| 自動高亮同數字 | 切換開關 | 開 / 關 |
| 填入時驗證錯誤 | 切換開關 | 開 / 關 |
| 語言 | 選擇器 | 繁體中文 / English |
| 重置所有設定 | 按鈕 | 確認後重置 |
| 清除存檔 | 按鈕 | 確認後清除 |

---

## 4. 響應式設計（RWD）

### 4.1 斷點定義

| 名稱 | 範圍 | 主要裝置 |
|------|------|----------|
| `xs` | < 480px | 小型手機 |
| `sm` | 480px – 767px | 一般手機 |
| `md` | 768px – 1023px | 平板 |
| `lg` | 1024px – 1279px | 桌機 |
| `xl` | ≥ 1280px | 大螢幕 |

### 4.2 棋盤尺寸自適應

```
棋盤寬度 = min(100vw - 32px, 100vh - 280px, 520px)
```

- 棋盤始終為正方形
- 格子字體大小隨棋盤縮放（使用 `clamp()` 實現）
- 手機版：數字鍵盤移至棋盤下方，固定於畫面底部

### 4.3 手機特殊處理

- 防止頁面縮放（`viewport meta: user-scalable=no`）
- 防止長按選取文字（`user-select: none`）
- 觸控目標最小尺寸：44×44px（符合 WCAG 標準）
- 支援橫向（Landscape）模式：棋盤與鍵盤左右並排
- 點擊格子時，系統鍵盤不彈出（純自製鍵盤）

---

## 5. 視覺設計系統

### 5.1 字體規範

```css
/* 主標題 */
font-size: clamp(2rem, 6vw, 4rem);
font-weight: 900;
letter-spacing: 0.05em;

/* 棋盤數字 */
font-size: clamp(1.2rem, 3.5vw, 2rem);
font-weight: 700;

/* 按鈕文字 */
font-size: clamp(1rem, 2.5vw, 1.25rem);
font-weight: 600;

/* 一般文字 */
font-size: clamp(0.95rem, 2vw, 1.1rem);
```

**字型選擇**：使用 Google Fonts，優先引入：
- 標題：`Orbitron`（科技感）或 `Fredoka One`（圓潤活潑）
- 棋盤數字：`JetBrains Mono`（等寬清晰）
- UI 文字：`Noto Sans TC`（繁體中文完整支援）

### 5.2 主題配色系統

所有主題透過 CSS Custom Properties 實現，掛載於 `:root` 上。

#### 主題：經典白（Classic）

```css
--color-bg: #f5f5f0;
--color-surface: #ffffff;
--color-board-line: #333333;
--color-number-given: #1a1a1a;
--color-number-input: #1565c0;
--color-number-error: #c62828;
--color-cell-selected: #bbdefb;
--color-cell-highlight: #e3f2fd;
--color-cell-same: #e8f5e9;
--color-primary: #1565c0;
--color-accent: #ff6f00;
```

#### 主題：暗夜黑（Dark）

```css
--color-bg: #121212;
--color-surface: #1e1e1e;
--color-board-line: #e0e0e0;
--color-number-given: #f0f0f0;
--color-number-input: #64b5f6;
--color-number-error: #ef5350;
--color-cell-selected: #1a237e;
--color-cell-highlight: #212121;
--color-primary: #64b5f6;
--color-accent: #ffa726;
```

#### 主題：海洋藍（Ocean）

```css
--color-bg: #e0f7fa;
--color-surface: #ffffff;
--color-number-input: #006064;
--color-cell-selected: #b2ebf2;
--color-primary: #00838f;
--color-accent: #ff7043;
```

#### 主題：森林綠（Forest）

```css
--color-bg: #f1f8e9;
--color-surface: #ffffff;
--color-number-input: #2e7d32;
--color-cell-selected: #dcedc8;
--color-primary: #388e3c;
--color-accent: #f57f17;
```

#### 主題：櫻花粉（Sakura）

```css
--color-bg: #fce4ec;
--color-surface: #fff9fb;
--color-number-input: #880e4f;
--color-cell-selected: #f8bbd9;
--color-primary: #c2185b;
--color-accent: #6a1b9a;
```

#### 主題：星河紫（Galaxy）

```css
--color-bg: #1a1035;
--color-surface: #2d1b69;
--color-number-given: #e1bee7;
--color-number-input: #ce93d8;
--color-number-error: #f48fb1;
--color-cell-selected: #4a148c;
--color-primary: #ab47bc;
--color-accent: #40c4ff;
```

---

## 6. 音樂與音效系統

### 6.1 設計原則

- **背景音樂（BGM）**：各畫面有專屬 BGM，使用 `<audio>` 標籤搭配 JS 控制，**切換畫面時若同一首 BGM 則持續播放不中斷**
- **音效（SFX）**：使用 `Web Audio API` 動態播放短音效，避免延遲
- **淡入淡出**：切換不同 BGM 時，舊音樂漸出（0.5s），新音樂漸入（0.5s）

### 6.2 BGM 清單

| 檔案名稱 | 適用畫面 | 風格 |
|----------|----------|------|
| `bgm-home.mp3` | 主畫面 | 輕鬆、期待感的電子音樂 |
| `bgm-game-easy.mp3` | 遊戲（簡單） | 輕快歡樂鋼琴曲 |
| `bgm-game-medium.mp3` | 遊戲（中等） | 穩定節奏的氛圍音樂 |
| `bgm-game-hard.mp3` | 遊戲（困難） | 緊張感、低頻電子風 |
| `bgm-settings.mp3` | 設定畫面 | 輕柔舒緩的環境音 |

> **實作說明**：音檔可使用 royalty-free 素材（如 OpenGameArt、Freesound）或透過 Web Audio API 生成程序化音樂作為備援。

### 6.3 SFX 清單

| 音效 | 觸發時機 |
|------|----------|
| `sfx-click` | 所有 UI 按鈕點擊 |
| `sfx-select` | 點擊棋盤格子 |
| `sfx-input` | 成功填入數字 |
| `sfx-erase` | 清除數字 |
| `sfx-error` | 填入錯誤數字 |
| `sfx-hint` | 使用提示功能 |
| `sfx-complete-row` | 完成一整行 |
| `sfx-complete-col` | 完成一整列 |
| `sfx-complete-box` | 完成一個九宮格 |
| `sfx-victory` | 完成整局（較長慶祝音效） |
| `sfx-game-over` | 錯誤次數耗盡 |
| `sfx-undo` | 執行復原 |
| `sfx-screen-in` | 畫面切入過場 |
| `sfx-screen-out` | 畫面切出過場 |

### 6.4 BGM 切換邏輯

```
畫面切換時：
  if (新 BGM === 當前 BGM) → 繼續播放（不中斷）
  else if (音樂已關閉) → 靜音（不播放）
  else:
    當前 BGM 音量淡出至 0（500ms）
    停止當前 BGM
    載入新 BGM
    新 BGM 音量從 0 淡入至設定音量（500ms）
    開始播放（loop = true）
```

---

## 7. 數獨核心邏輯

### 7.1 題目生成（`sudoku-generator.js`）

#### 演算法流程

```
1. 生成一個完整的合法數獨解答（使用回溯法 Backtracking）
2. 隨機打亂（shuffle）解答中的數字映射（確保多樣性）
3. 根據難度，隨機挖去對應數量的格子
4. 驗證挖去後的題目有唯一解（使用求解器驗證）
5. 若不唯一，回退並嘗試其他挖空位置
```

#### 時間複雜度控制

- 生成超時上限：3 秒
- 若超時，顯示 loading 動畫並重試

### 7.2 即時驗證（`sudoku-validator.js`）

- 每次填入數字後，檢查同行、同列、同九宮格是否有重複
- 檢查是否所有格子都已填入且正確 → 觸發勝利流程

### 7.3 計分系統

```
基礎分數 = 1000 - (完成時間秒數 / 難度係數 × 10)
錯誤扣分 = 錯誤次數 × 50
提示扣分 = 使用提示次數 × 100
最終分數 = max(基礎分數 - 錯誤扣分 - 提示扣分, 0)

難度係數：Easy=1, Medium=1.5, Hard=2, Expert=3
評級：★★★（≥800）/ ★★（≥500）/ ★（≥0）
```

---

## 8. 存檔與繼續遊戲

### 8.1 存檔時機

- 每次填入／刪除數字後自動存檔
- 返回主畫面時自動存檔
- 視窗關閉（`beforeunload`）時自動存檔

### 8.2 存檔格式（`localStorage` key: `sudoku_save`）

```json
{
  "version": "1.0.0",
  "savedAt": 1748304000000,
  "difficulty": "medium",
  "puzzle": [0, 5, 0, ...],
  "solution": [3, 5, 7, ...],
  "playerInput": [3, 0, 0, ...],
  "memoNotes": [[],[],[1,2],[],...],
  "elapsedSeconds": 312,
  "errorCount": 1,
  "hintCount": 0,
  "undoHistory": [...]
}
```

### 8.3 繼續遊戲按鈕狀態

- 有 `sudoku_save` → 按鈕啟用，顯示難度與進行時間
- 無存檔 → 按鈕 disabled，顯示「暫無進行中的遊戲」

---

## 9. 設定系統

### 9.1 設定存儲（`localStorage` key: `sudoku_settings`）

```json
{
  "theme": "classic",
  "bgmVolume": 70,
  "sfxVolume": 80,
  "bgmEnabled": true,
  "sfxEnabled": true,
  "errorLimit": 3,
  "showTimer": true,
  "autoHighlight": true,
  "validateOnInput": true,
  "language": "zh-TW"
}
```

### 9.2 設定即時生效

- 主題切換：即時更換 `:root` CSS 變數
- 音量調整：即時更新 `AudioContext` 增益節點
- 其他設定：下次操作立即生效

---

## 10. CSS 模組規劃

### 10.1 `index.html` 引入順序

```html
<!-- Base -->
<link rel="stylesheet" href="css/base/reset.css">
<link rel="stylesheet" href="css/base/variables.css">
<link rel="stylesheet" href="css/base/typography.css">

<!-- Layout -->
<link rel="stylesheet" href="css/layout/grid.css">
<link rel="stylesheet" href="css/layout/responsive.css">

<!-- Components -->
<link rel="stylesheet" href="css/components/button.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/board.css">
<link rel="stylesheet" href="css/components/numpad.css">
<link rel="stylesheet" href="css/components/timer.css">
<link rel="stylesheet" href="css/components/navbar.css">
<link rel="stylesheet" href="css/components/toast.css">

<!-- Screens -->
<link rel="stylesheet" href="css/screens/home.css">
<link rel="stylesheet" href="css/screens/game.css">
<link rel="stylesheet" href="css/screens/instructions.css">
<link rel="stylesheet" href="css/screens/settings.css">

<!-- Default Theme -->
<link rel="stylesheet" href="css/themes/theme-classic.css" id="theme-stylesheet">

<!-- Animations (最後載入，可覆蓋其他樣式) -->
<link rel="stylesheet" href="css/animations/transitions.css">
<link rel="stylesheet" href="css/animations/effects.css">
<link rel="stylesheet" href="css/animations/loading.css">
```

---

## 11. JavaScript 模組規劃

### 11.1 `index.html` 引入順序（`<body>` 底部）

```html
<!-- Core Logic（無 DOM 依賴，先載入） -->
<script src="js/core/sudoku-generator.js"></script>
<script src="js/core/sudoku-solver.js"></script>
<script src="js/core/sudoku-validator.js"></script>

<!-- State Management -->
<script src="js/state/storage.js"></script>
<script src="js/state/settings-state.js"></script>
<script src="js/state/game-state.js"></script>

<!-- Audio -->
<script src="js/audio/bgm-controller.js"></script>
<script src="js/audio/sfx-controller.js"></script>
<script src="js/audio/audio-manager.js"></script>

<!-- Input Handlers -->
<script src="js/input/keyboard-handler.js"></script>
<script src="js/input/touch-handler.js"></script>
<script src="js/input/mouse-handler.js"></script>

<!-- UI Renderers -->
<script src="js/ui/toast-manager.js"></script>
<script src="js/ui/modal-manager.js"></script>
<script src="js/ui/timer-ui.js"></script>
<script src="js/ui/board-renderer.js"></script>
<script src="js/ui/numpad-renderer.js"></script>
<script src="js/ui/screen-manager.js"></script>

<!-- Entry Point（最後載入） -->
<script src="js/main.js"></script>
```

### 11.2 模組間溝通方式

採用**自訂事件（Custom Events）** 進行解耦：

```javascript
// 發送事件
document.dispatchEvent(new CustomEvent('sudoku:cellSelected', {
  detail: { row: 2, col: 4 }
}));

// 監聽事件
document.addEventListener('sudoku:cellSelected', (e) => {
  const { row, col } = e.detail;
  // ...
});
```

#### 主要事件清單

| 事件名稱 | 觸發時機 | Payload |
|----------|----------|---------|
| `sudoku:gameStart` | 開始新遊戲 | `{ difficulty }` |
| `sudoku:gameLoad` | 載入存檔 | `{ saveData }` |
| `sudoku:cellSelected` | 選中格子 | `{ row, col }` |
| `sudoku:numberInput` | 填入數字 | `{ row, col, value, isError }` |
| `sudoku:cellErased` | 清除格子 | `{ row, col }` |
| `sudoku:hintUsed` | 使用提示 | `{ row, col, value }` |
| `sudoku:undoPerformed` | 執行復原 | `{ step }` |
| `sudoku:gameComplete` | 完成遊戲 | `{ time, errors, hints, score }` |
| `sudoku:gameOver` | 遊戲結束 | `{ reason }` |
| `sudoku:screenChange` | 畫面切換 | `{ from, to }` |
| `sudoku:settingsChange` | 設定變更 | `{ key, value }` |
| `sudoku:themeChange` | 主題切換 | `{ theme }` |

---

## 12. 資料流與狀態管理

```
使用者操作
    ↓
Input Handlers（keyboard / touch / mouse）
    ↓
Game State（更新狀態）
    ↓
Validator（驗證合法性）
    ↓
Custom Event（通知 UI 層）
    ↓
Board Renderer / Timer UI / Toast Manager
    ↓
Storage（自動存檔至 localStorage）
    ↓
Audio Manager（播放對應音效）
```

---

## 13. 效能與相容性

### 13.1 效能目標

| 指標 | 目標值 |
|------|--------|
| 首次載入時間 | < 2 秒（不含音訊預載） |
| 題目生成時間 | < 500ms |
| 格子點擊響應 | < 50ms |
| 動畫幀率 | 穩定 60fps |

### 13.2 瀏覽器相容性

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| iOS Safari | 13+ |
| Android Chrome | 80+ |

### 13.3 無障礙（Accessibility）

- 所有互動元素支援鍵盤操作（Tab 鍵導覽）
- 顏色對比度符合 WCAG AA 標準（≥ 4.5:1）
- 重要狀態變化附加 `aria-live` 通知
- 觸控目標最小 44×44px

### 13.4 SEO / Meta

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="description" content="純前端數獨遊戲，支援多種難度與主題配色">
<meta name="theme-color" content="#1565c0">
<title>數獨 Sudoku</title>
```

---

## 附錄 A：快速開發順序建議

```
Phase 1：骨架與核心邏輯
  ✓ 建立目錄結構與 index.html
  ✓ 實作數獨生成器與求解器
  ✓ 實作即時驗證

Phase 2：遊戲畫面 UI
  ✓ 棋盤渲染
  ✓ 數字鍵盤
  ✓ 點擊互動（選格、填數）
  ✓ 錯誤提示與勝利檢測

Phase 3：完整畫面
  ✓ 主畫面 + 難度選擇
  ✓ 設定畫面
  ✓ 說明畫面
  ✓ SPA 畫面切換

Phase 4：進階功能
  ✓ LocalStorage 存/讀檔
  ✓ 復原（Undo）功能
  ✓ 計時器
  ✓ 備忘筆記模式
  ✓ 計分與評級

Phase 5：視覺與音效
  ✓ 多主題配色系統
  ✓ 動畫與過場效果
  ✓ BGM 與 SFX 整合
  ✓ RWD 細節調整

Phase 6：測試與優化
  ✓ 跨瀏覽器測試
  ✓ 手機觸控測試
  ✓ 效能剖析
  ✓ Bug 修復
```

---

*文件結束 — 數獨遊戲規格書 v1.0.0*
