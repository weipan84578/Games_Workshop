# 🧩 拼圖遊戲 (Puzzle Game) — 規格書

> **版本**: v1.0.0  
> **類型**: 純前端單頁應用 (Vanilla HTML/CSS/JS)  
> **目標平台**: 桌面瀏覽器、行動裝置瀏覽器  
> **啟動方式**: 直接開啟 `index.html`，無需任何編譯或伺服器

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術限制與原則](#2-技術限制與原則)
3. [目錄結構](#3-目錄結構)
4. [畫面設計規格](#4-畫面設計規格)
5. [功能規格](#5-功能規格)
6. [音樂與音效系統](#6-音樂與音效系統)
7. [圖片匯入系統](#7-圖片匯入系統)
8. [難度系統](#8-難度系統)
9. [RWD 響應式規格](#9-rwd-響應式規格)
10. [UI 視覺規格](#10-ui-視覺規格)
11. [資料流程圖](#11-資料流程圖)
12. [模組職責表](#12-模組職責表)
13. [開發注意事項](#13-開發注意事項)

---

## 1. 專案概覽

### 1.1 遊戲描述

一款純前端拼圖遊戲，玩家可上傳自己的圖片，選擇難度後系統自動裁切為拼圖片段，玩家以拖曳或點擊的方式還原圖片。遊戲包含豐富的音效、背景音樂、主題配色切換，以及完整的遊戲進度記憶。

### 1.2 核心特色

| 特色 | 說明 |
|------|------|
| 零依賴啟動 | 只需點擊 `index.html` 即可遊玩 |
| 自訂圖片 | 玩家可匯入任意圖片，不儲存於瀏覽器 |
| 多難度 | 9 片 → 16 片 → 25 片 → 36 片 → 64 片 → 100 片 |
| 豐富音效 | 背景音樂 + 互動音效，畫面切換連貫 |
| 多主題配色 | 6 種視覺主題可即時切換 |
| RWD | 完整支援手機、平板、桌機 |

---

## 2. 技術限制與原則

### 2.1 硬性限制

- ✅ **純 Vanilla HTML + CSS + JavaScript**，禁止使用任何框架（React、Vue 等）
- ✅ 所有資源（音效、字體）使用 **Web Audio API 程式生成** 或 **CDN 引入**，不依賴本地音效檔案
- ✅ 字體透過 **Google Fonts CDN** 引入
- ✅ **不得使用 localStorage / IndexedDB / sessionStorage 儲存圖片資料**
- ✅ 圖片僅存在於 JavaScript 記憶體（`ArrayBuffer` / `ObjectURL`），頁面關閉即消失
- ✅ `index.html` 以 `<script src="">` 和 `<link rel="stylesheet">` 方式引入所有模組
- ✅ 可使用 ES Module（`type="module"`）語法組織 JS 模組

### 2.2 允許使用的外部資源（CDN）

```
Google Fonts CDN       — 字體
Howler.js (CDN)        — 音效管理（或使用原生 Web Audio API）
```

> **備註**：若選擇使用原生 Web Audio API 程式生成音效音調，則完全不依賴任何外部 CDN，離線也可使用。

---

## 3. 目錄結構

```
puzzle-game/
│
├── index.html                  # 主入口，僅負責引入資源與提供 DOM 骨架
│
├── css/
│   ├── base/
│   │   ├── reset.css           # CSS Reset / Normalize
│   │   ├── variables.css       # CSS 自訂屬性（主題色、字體大小、間距等）
│   │   └── typography.css      # 全域字體設定
│   │
│   ├── layout/
│   │   ├── app.css             # 最外層應用框架佈局
│   │   └── responsive.css      # RWD 媒體查詢（所有斷點集中於此）
│   │
│   ├── screens/
│   │   ├── main-menu.css       # 主畫面樣式
│   │   ├── game.css            # 遊戲畫面樣式（拼圖盤、計時器等）
│   │   ├── settings.css        # 設定畫面樣式
│   │   ├── instructions.css    # 說明畫面樣式
│   │   └── victory.css         # 勝利畫面樣式
│   │
│   ├── components/
│   │   ├── button.css          # 按鈕元件
│   │   ├── modal.css           # 強制回應視窗
│   │   ├── puzzle-piece.css    # 拼圖片段樣式
│   │   ├── difficulty-select.css # 難度選擇器
│   │   ├── image-upload.css    # 圖片上傳區
│   │   └── theme-picker.css    # 主題配色選擇器
│   │
│   └── themes/
│       ├── theme-ocean.css     # 海洋藍主題
│       ├── theme-forest.css    # 森林綠主題
│       ├── theme-sunset.css    # 夕陽橘主題
│       ├── theme-candy.css     # 糖果粉主題
│       ├── theme-midnight.css  # 午夜深色主題
│       └── theme-gold.css      # 黃金奢華主題
│
├── js/
│   ├── main.js                 # 應用程式入口，初始化並串接所有模組
│   │
│   ├── core/
│   │   ├── state.js            # 全域狀態管理（單一資料來源）
│   │   ├── router.js           # 畫面切換路由邏輯
│   │   └── event-bus.js        # 模組間事件通訊
│   │
│   ├── screens/
│   │   ├── MainMenuScreen.js   # 主畫面邏輯
│   │   ├── GameScreen.js       # 遊戲主畫面邏輯
│   │   ├── SettingsScreen.js   # 設定畫面邏輯
│   │   ├── InstructionsScreen.js # 說明畫面邏輯
│   │   └── VictoryScreen.js    # 勝利畫面邏輯
│   │
│   ├── game/
│   │   ├── PuzzleEngine.js     # 核心拼圖邏輯（切片、洗牌、驗證）
│   │   ├── PuzzlePiece.js      # 拼圖片段類別
│   │   ├── DragController.js   # 桌面拖曳控制
│   │   ├── TouchController.js  # 行動裝置觸控控制
│   │   ├── Timer.js            # 遊戲計時器
│   │   └── ScoreManager.js     # 分數與最佳記錄計算
│   │
│   ├── image/
│   │   ├── ImageImporter.js    # 圖片匯入、讀取、記憶體管理
│   │   ├── ImageCropper.js     # 圖片自動裁切為正方形
│   │   └── ImageSlicer.js      # 圖片切割為 N×N 拼圖片段
│   │
│   ├── audio/
│   │   ├── AudioEngine.js      # Web Audio API 核心引擎
│   │   ├── MusicPlayer.js      # 背景音樂播放、淡入淡出、持續播放控制
│   │   ├── SoundEffects.js     # 所有音效定義與觸發
│   │   └── AudioSettings.js    # 音量控制、靜音狀態
│   │
│   ├── ui/
│   │   ├── ThemeManager.js     # 主題切換邏輯
│   │   ├── Modal.js            # 強制回應視窗管理
│   │   ├── Toast.js            # 輕量提示訊息
│   │   └── Transitions.js      # 畫面切換動畫
│   │
│   └── utils/
│       ├── helpers.js          # 通用工具函式
│       ├── storage.js          # 非敏感遊戲進度儲存（僅存狀態不存圖片）
│       └── constants.js        # 全域常數定義
│
└── assets/
    └── icons/
        └── favicon.svg         # 網站圖示（SVG，程式生成）
```

---

## 4. 畫面設計規格

### 4.1 畫面清單

| 畫面 ID | 名稱 | 描述 |
|---------|------|------|
| `main-menu` | 主畫面 | 遊戲入口，含四個主要功能按鈕 |
| `game` | 遊戲畫面 | 拼圖進行畫面 |
| `instructions` | 說明畫面 | 遊戲操作說明 |
| `settings` | 設定畫面 | 音量、主題、難度等設定 |
| `victory` | 勝利畫面 | 完成拼圖後的結果頁面 |

### 4.2 主畫面（`main-menu`）

```
┌─────────────────────────────────┐
│                                 │
│      🧩  拼圖挑戰               │  ← 大標題（60px+）
│      PUZZLE CHALLENGE           │  ← 英文副標（24px）
│                                 │
│   ┌─────────────────────────┐   │
│   │     ▶  開始遊戲          │   │  ← 主要按鈕（最大）
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │     ↩  繼續遊戲          │   │  ← 有進度時亮起，否則灰色
│   └─────────────────────────┘   │
│                                 │
│   ┌──────────┐  ┌──────────┐   │
│   │  📖 說明  │  │  ⚙️ 設定  │  │  ← 次要按鈕（並排）
│   └──────────┘  └──────────┘   │
│                                 │
│   🎵 [音樂圖示]  [主題選擇]      │  ← 底部快捷列
└─────────────────────────────────┘
```

**按鈕行為**：
- **開始遊戲**：進入圖片匯入 + 難度選擇流程（Modal 方式呈現）
- **繼續遊戲**：載入上次未完成的遊戲進度（無進度則按鈕禁用 + 提示）
- **說明**：滑入說明畫面
- **設定**：滑入設定畫面

### 4.3 遊戲畫面（`game`）

```
┌─────────────────────────────────┐
│ ← 返回  🧩 拼圖挑戰  ⏱ 03:42   │  ← 頂部導覽列
│         [難度標示]  [進度 X/N]  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   [ 拼圖遊戲區域 Canvas ] │  │  ← 自適應大小
│  │                           │  │
│  │   拼圖片段散落其中         │  │
│  │   可拖曳/觸控移動          │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐   │
│  │  預覽圖  │  洗牌  │  提示 │   │  ← 工具列
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

**遊戲區域規格**：
- 使用 `<canvas>` 元素繪製拼圖
- 拼圖片段採用 `Canvas 2D API` 繪製，支援圓角與陰影
- 拼圖片段可自由拖曳到任意位置
- 吸附邏輯：片段拖放至正確位置附近（距離 < 吸附閾值）自動鎖定
- 已鎖定片段變更顏色邊框表示完成

### 4.4 設定畫面（`settings`）

```
設定項目：
├── 🎵 背景音樂音量     [滑桿 0-100]
├── 🔊 音效音量         [滑桿 0-100]  
├── 🎨 遊戲主題         [6 個色票按鈕]
├── 🧩 預設難度         [難度選擇器]
├── 🌐 語言             [中文 / English]
└── ℹ️  版本資訊
```

### 4.5 說明畫面（`instructions`）

```
說明內容：
1. 如何匯入圖片
2. 如何移動拼圖片段（滑鼠拖曳 / 手機觸控）
3. 吸附機制說明
4. 難度差異說明
5. 計時與評分說明
6. 快捷鍵列表（桌機版）
```

### 4.6 勝利畫面（`victory`）

```
┌─────────────────────────────────┐
│                                 │
│    🎉 恭喜完成！                 │
│                                 │
│    ┌─────────────────────────┐  │
│    │   [完成的拼圖縮圖]       │  │
│    └─────────────────────────┘  │
│                                 │
│    ⏱ 完成時間：03:42            │
│    ⭐ 評分：★★★★☆               │
│    🏆 最佳紀錄：03:21           │
│                                 │
│    [再玩一次]     [回主畫面]     │
└─────────────────────────────────┘
```

---

## 5. 功能規格

### 5.1 開始遊戲流程

```
點擊「開始遊戲」
    ↓
[Modal] 步驟 1：匯入圖片
    - 點擊上傳區 或 拖曳圖片
    - 支援格式：JPG / PNG / WEBP / GIF（取第一幀）
    - 即時預覽（不儲存，僅顯示）
    ↓
[Modal] 步驟 2：選擇難度
    - 見難度系統章節
    ↓
[Modal] 步驟 3：確認開始
    - 顯示圖片預覽 + 難度摘要
    - 點擊「開始！」進入遊戲畫面
```

### 5.2 繼續遊戲

- 進度儲存於 `sessionStorage`（**僅儲存片段位置與完成狀態，不儲存圖片像素資料**）
- 若進度存在且圖片資料仍在記憶體中 → 直接恢復
- 若進度存在但圖片已消失（例如重新整理）→ 提示玩家重新匯入同一張圖片後繼續
- 進度格式：

```json
{
  "version": "1.0",
  "difficulty": "4x4",
  "pieces": [
    { "id": 0, "x": 120, "y": 80, "solved": false },
    { "id": 1, "x": 200, "y": 150, "solved": true }
  ],
  "elapsedSeconds": 142,
  "timestamp": 1700000000000
}
```

### 5.3 拼圖操作

| 操作 | 桌機 | 行動裝置 |
|------|------|----------|
| 移動片段 | 滑鼠左鍵拖曳 | 單指觸控拖曳 |
| 查看預覽圖 | 按住 `Space` | 長按預覽按鈕 |
| 洗牌重排 | 點擊洗牌按鈕 | 點擊洗牌按鈕 |
| 提示（閃爍顯示一片） | 點擊提示按鈕 | 點擊提示按鈕 |
| 暫停/繼續 | `Esc` 或點擊暫停 | 點擊暫停按鈕 |
| 快速回主選單 | `Ctrl+M` | 返回按鈕 |

### 5.4 吸附邏輯

```
拼圖片段拖放時：
  if (距離正確位置 <= 吸附閾值) {
    自動鎖定至正確位置
    播放「卡入」音效
    更新完成計數
    if (全部完成) → 觸發勝利流程
  }
```

- 吸附閾值（桌機）：片段寬度的 `15%`
- 吸附閾值（行動裝置）：片段寬度的 `25%`（手指較不精準）

---

## 6. 音樂與音效系統

### 6.1 架構概述

```
AudioEngine.js          ← Web Audio API 核心（AudioContext、GainNode 管理）
    ├── MusicPlayer.js  ← 背景音樂（程式生成或 CDN 音樂）
    └── SoundEffects.js ← 所有音效（使用 Web Audio API 程式合成）
```

### 6.2 背景音樂清單

| 音樂 ID | 名稱 | 使用場景 | 持續播放規則 |
|---------|------|----------|--------------|
| `bgm_menu` | 輕鬆主選單音樂 | 主畫面、設定、說明 | ✅ 這三個畫面間切換不重新播放 |
| `bgm_game_easy` | 輕快益智音樂 | 簡單難度遊戲中 | ✅ 暫停後繼續不重播 |
| `bgm_game_hard` | 緊張挑戰音樂 | 困難難度遊戲中 | ✅ 同上 |
| `bgm_victory` | 勝利慶祝音樂 | 勝利畫面 | ❌ 每次進入必重播 |

**切換邏輯**：
```
當前音樂 Group A（選單類）→ 切換至 Group A → 不重新播放，繼續
當前音樂 Group A（選單類）→ 切換至 Group B（遊戲類）→ 淡出 A，淡入 B
當前音樂 Group B → 勝利 → 淡出 B，立即播放勝利音樂
```

淡入淡出時長：`800ms`

### 6.3 音效清單

| 音效 ID | 名稱 | 觸發時機 | 合成方式 |
|---------|------|----------|----------|
| `sfx_click` | 按鈕點擊 | 所有按鈕點擊 | 短促正弦波（80ms） |
| `sfx_piece_pickup` | 拿起拼圖 | 開始拖曳片段 | 輕柔撥弦聲（120ms） |
| `sfx_piece_drop` | 放下拼圖 | 放下片段（未吸附） | 低頻輕拍（100ms） |
| `sfx_piece_snap` | 拼圖卡入 | 片段成功吸附 | 清脆叮聲（200ms） |
| `sfx_combo` | 連續完成 | 連續吸附 3 片以上 | 上升音階和弦（400ms） |
| `sfx_shuffle` | 洗牌 | 點擊洗牌按鈕 | 快速打牌聲（300ms） |
| `sfx_hint` | 提示 | 點擊提示按鈕 | 柔和提示音（250ms） |
| `sfx_victory` | 勝利 | 最後一片卡入 | 勝利和弦 + 粒子聲（1500ms） |
| `sfx_timer_warning` | 計時警告 | 剩餘 30 秒 | 心跳聲（持續） |
| `sfx_screen_transition` | 畫面切換 | 所有畫面切換 | 柔和掃過聲（200ms） |
| `sfx_modal_open` | 視窗開啟 | Modal 出現 | 輕微彈出聲（150ms） |
| `sfx_modal_close` | 視窗關閉 | Modal 消失 | 輕微收回聲（150ms） |
| `sfx_error` | 錯誤提示 | 操作無效 | 低沉錯誤音（200ms） |

> **所有音效使用 Web Audio API 程式合成**，不依賴外部音效檔案，可完全離線運作。

### 6.4 音量控制規格

```
MasterGain
    ├── MusicGain (0.0 ~ 1.0，預設 0.5)
    └── SfxGain   (0.0 ~ 1.0，預設 0.8)
```

- 設定畫面提供兩個獨立滑桿
- 點擊頁面任意處自動解鎖 `AudioContext`（瀏覽器自動播放政策）
- 靜音按鈕可快速切換 MasterGain 0/1

---

## 7. 圖片匯入系統

### 7.1 隱私原則

> ⚠️ **嚴格規定**：任何圖片像素資料**絕對不得**存入 `localStorage`、`IndexedDB`、`sessionStorage`、Cookies 或任何持久化儲存機制。

### 7.2 圖片生命週期

```
玩家選擇圖片
    ↓
FileReader.readAsDataURL()
    ↓
存入 JS 記憶體變數（ImageImporter.currentImageData）
    ↓
ImageCropper.toCenterSquare() → 裁切為正方形
    ↓
ImageSlicer.slice(N) → 切割為 N×N 個 Canvas 片段
    ↓
遊戲中使用（Canvas 繪圖）
    ↓
頁面關閉 / 重新整理 → 資料自動消失
```

### 7.3 ImageCropper 規格

```javascript
/**
 * 將任意尺寸圖片裁切為置中正方形
 * @param {HTMLImageElement} img - 來源圖片
 * @param {number} outputSize - 輸出正方形邊長（像素）
 * @returns {HTMLCanvasElement} 裁切後的 Canvas
 */
function toCenterSquare(img, outputSize = 600)
```

- 取圖片較短邊為正方形邊長
- 從中心點裁切
- 縮放至 `outputSize × outputSize`

### 7.4 ImageSlicer 規格

```javascript
/**
 * 將 Canvas 圖片切割為 N×N 個片段
 * @param {HTMLCanvasElement} source - 來源 Canvas
 * @param {number} cols - 欄數（等於列數）
 * @returns {PuzzlePiece[]} 拼圖片段陣列（含位置、Canvas 資料）
 */
function slice(source, cols)
```

### 7.5 支援的圖片格式

| 格式 | 支援 | 備註 |
|------|------|------|
| JPEG (.jpg, .jpeg) | ✅ | |
| PNG (.png) | ✅ | 支援透明背景 |
| WebP (.webp) | ✅ | |
| GIF (.gif) | ✅ | 僅取第一幀 |
| BMP (.bmp) | ✅ | |
| SVG (.svg) | ❌ | 不支援，顯示錯誤提示 |

### 7.6 圖片大小限制

- 最大檔案大小：**10MB**
- 最小解析度：`100 × 100 px`
- 超出限制顯示 Toast 錯誤提示

---

## 8. 難度系統

### 8.1 難度等級

| 難度 | 名稱 | 片段數 | 格式 | 適合對象 |
|------|------|--------|------|----------|
| ☆ | 入門 | 9 片 | 3×3 | 兒童、初次體驗 |
| ★ | 簡單 | 16 片 | 4×4 | 休閒玩家 |
| ★★ | 普通 | 25 片 | 5×5 | 一般玩家 |
| ★★★ | 困難 | 36 片 | 6×6 | 進階玩家 |
| ★★★★ | 專家 | 64 片 | 8×8 | 骨灰玩家 |
| ★★★★★ | 瘋狂 | 100 片 | 10×10 | 挑戰極限 |

### 8.2 難度影響的參數

| 參數 | 入門(3×3) | 普通(5×5) | 瘋狂(10×10) |
|------|-----------|-----------|-------------|
| 拼圖片段數 | 9 | 25 | 100 |
| 吸附閾值（%） | 20% | 15% | 10% |
| 計時評分標準 | 寬鬆 | 一般 | 嚴格 |
| 背景音樂 | 輕鬆 | 普通 | 緊張 |

### 8.3 洗牌演算法

使用 **Fisher-Yates shuffle** 確保完全隨機：

```javascript
function shuffle(pieces) {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i].x, pieces[j].x] = [pieces[j].x, pieces[i].x];
    [pieces[i].y, pieces[j].y] = [pieces[j].y, pieces[i].y];
  }
}
```

---

## 9. RWD 響應式規格

### 9.1 斷點定義（定義於 `css/layout/responsive.css`）

```css
/* 手機直式 */
@media (max-width: 480px)   { ... }

/* 手機橫式 / 小平板 */
@media (min-width: 481px) and (max-width: 768px)  { ... }

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* 桌機 */
@media (min-width: 1025px) { ... }
```

### 9.2 各裝置遊戲區域大小

| 裝置 | 遊戲 Canvas 最大尺寸 |
|------|---------------------|
| 手機（直式） | `min(90vw, 90vh - 120px)` 正方形 |
| 手機（橫式） | `min(80vw, 80vh - 60px)` 正方形 |
| 平板 | `min(70vw, 70vh - 100px)` 正方形 |
| 桌機 | `min(65vw, 80vh - 100px)` 正方形 |

### 9.3 觸控優化

- 拼圖片段最小點擊區域：`44px × 44px`（Apple HIG 標準）
- 觸控拖曳使用 `touch-action: none` 防止頁面滾動干擾
- 支援 `pointer events`（統一滑鼠與觸控處理）

---

## 10. UI 視覺規格

### 10.1 字體規格

```css
/* 主標題 */
font-family: 'Nunito', sans-serif;
font-size: clamp(2rem, 6vw, 4rem);
font-weight: 900;

/* 次標題 / 按鈕文字 */
font-size: clamp(1.2rem, 3vw, 1.8rem);
font-weight: 700;

/* 說明文字 / 標籤 */
font-size: clamp(1rem, 2.5vw, 1.4rem);
font-weight: 600;

/* 最小字體下限：永不低於 16px */
```

> 使用 `clamp()` 確保字體在所有裝置上都足夠大且清晰。

### 10.2 六種主題配色

| 主題 | Class | 主色 | 強調色 | 背景色 |
|------|-------|------|--------|--------|
| 🌊 海洋藍 | `theme-ocean` | `#0077B6` | `#00B4D8` | `#CAF0F8` |
| 🌲 森林綠 | `theme-forest` | `#2D6A4F` | `#52B788` | `#D8F3DC` |
| 🌅 夕陽橘 | `theme-sunset` | `#E85D04` | `#F48C06` | `#FFF3E0` |
| 🍭 糖果粉 | `theme-candy` | `#D62B7A` | `#FF6FB2` | `#FDE8F4` |
| 🌃 午夜 | `theme-midnight` | `#7B2FBE` | `#E040FB` | `#12001F` |
| 🏆 黃金 | `theme-gold` | `#C9A227` | `#FFD700` | `#1A1200` |

主題 Class 套用於 `<body>` 元素，所有顏色透過 CSS 自訂屬性 `var(--color-primary)` 等方式使用。

### 10.3 按鈕規格

```css
/* 主要按鈕 */
.btn-primary {
  min-height: 60px;           /* 行動裝置友善 */
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 700;
  border-radius: 16px;
  padding: 16px 32px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}
```

---

## 11. 資料流程圖

### 11.1 開始遊戲流程

```
[玩家] → 點擊「開始遊戲」
    ↓
[MainMenuScreen] → 觸發 Modal 開啟事件
    ↓
[Modal] → 顯示圖片上傳畫面
    ↓
[玩家] → 選擇圖片檔案
    ↓
[ImageImporter] → FileReader 讀取 → DataURL 存入記憶體
    ↓
[ImageCropper] → 裁切為正方形 Canvas
    ↓
[Modal] → 切換至難度選擇畫面（顯示圖片預覽）
    ↓
[玩家] → 選擇難度
    ↓
[State] → 更新 difficulty, imageCanvas
    ↓
[Modal 確認] → 點擊「開始！」
    ↓
[Router] → 切換至 game 畫面（播放切換音效，淡出選單音樂，淡入遊戲音樂）
    ↓
[ImageSlicer] → 切割圖片為 N×N 片段
    ↓
[PuzzleEngine] → Fisher-Yates 洗牌，初始化片段位置
    ↓
[GameScreen] → 渲染 Canvas，啟動計時器
    ↓
[玩家] → 開始遊玩
```

### 11.2 畫面切換音樂邏輯

```
當前畫面: main-menu（播放 bgm_menu）
    ↓ 切換至 settings
    → 同屬「選單群組」→ 音樂繼續播放，不中斷

當前畫面: settings（播放 bgm_menu）
    ↓ 切換至 game
    → 不同群組 → bgm_menu 淡出 (800ms) → bgm_game 淡入 (800ms)

當前畫面: game（播放 bgm_game）
    ↓ 最後一片卡入
    → 觸發勝利 → bgm_game 淡出 → bgm_victory 立即播放
```

---

## 12. 模組職責表

| 模組 | 主要職責 | 依賴 |
|------|----------|------|
| `main.js` | 初始化應用、載入模組、啟動路由 | 所有模組 |
| `state.js` | 儲存全域狀態（難度、主題、音量、進度） | 無 |
| `router.js` | 管理畫面切換、觸發音樂切換 | `state.js`, `Transitions.js`, `MusicPlayer.js` |
| `event-bus.js` | 模組間解耦通訊 | 無 |
| `PuzzleEngine.js` | 拼圖核心邏輯：洗牌、位置計算、完成驗證 | `PuzzlePiece.js` |
| `DragController.js` | 滑鼠事件處理、拖曳邏輯 | `PuzzleEngine.js`, `SoundEffects.js` |
| `TouchController.js` | 觸控事件處理 | `PuzzleEngine.js`, `SoundEffects.js` |
| `ImageImporter.js` | 圖片讀取、格式驗證、大小限制 | 無 |
| `ImageCropper.js` | 裁切為正方形 | 無 |
| `ImageSlicer.js` | 切割為片段 Canvas | 無 |
| `AudioEngine.js` | AudioContext 管理、GainNode 樹 | 無 |
| `MusicPlayer.js` | 音樂播放、淡入淡出、群組判斷 | `AudioEngine.js` |
| `SoundEffects.js` | 音效合成與播放 | `AudioEngine.js` |
| `ThemeManager.js` | CSS Class 切換、儲存偏好 | `state.js` |
| `storage.js` | sessionStorage 操作（僅非圖片資料） | 無 |

---

## 13. 開發注意事項

### 13.1 瀏覽器相容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Web Audio API | ✅ 88+ | ✅ 76+ | ✅ 14+ | ✅ 88+ |
| Canvas 2D | ✅ | ✅ | ✅ | ✅ |
| Pointer Events | ✅ | ✅ | ✅ 13+ | ✅ |
| CSS clamp() | ✅ 79+ | ✅ 75+ | ✅ 13+ | ✅ 79+ |
| ES Modules | ✅ 61+ | ✅ 60+ | ✅ 10.1+ | ✅ 16+ |

> **iOS Safari 特別注意**：`AudioContext` 必須在使用者手勢（點擊）後才能建立，已在 `AudioEngine.js` 中處理。

### 13.2 效能考量

- Canvas 重繪使用 `requestAnimationFrame`，避免不必要的重繪
- 拖曳過程中使用 `will-change: transform` 提升合成層效能
- 圖片 Canvas 片段快取，避免重複切割
- `100 片` 難度下 Canvas 尺寸建議限制在 `800×800px` 以內

### 13.3 可及性（Accessibility）

- 所有按鈕有 `aria-label`
- 顏色對比度符合 WCAG 2.1 AA 標準
- 鍵盤可導覽主選單（`Tab` 鍵）
- 支援 `prefers-reduced-motion` 媒體查詢（關閉動畫效果）

### 13.4 `index.html` 引入範例

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🧩 拼圖挑戰</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;900&display=swap" rel="stylesheet">

  <!-- Base CSS -->
  <link rel="stylesheet" href="css/base/reset.css">
  <link rel="stylesheet" href="css/base/variables.css">
  <link rel="stylesheet" href="css/base/typography.css">

  <!-- Layout CSS -->
  <link rel="stylesheet" href="css/layout/app.css">
  <link rel="stylesheet" href="css/layout/responsive.css">

  <!-- Screen CSS -->
  <link rel="stylesheet" href="css/screens/main-menu.css">
  <link rel="stylesheet" href="css/screens/game.css">
  <link rel="stylesheet" href="css/screens/settings.css">
  <link rel="stylesheet" href="css/screens/instructions.css">
  <link rel="stylesheet" href="css/screens/victory.css">

  <!-- Component CSS -->
  <link rel="stylesheet" href="css/components/button.css">
  <link rel="stylesheet" href="css/components/modal.css">
  <link rel="stylesheet" href="css/components/puzzle-piece.css">
  <link rel="stylesheet" href="css/components/difficulty-select.css">
  <link rel="stylesheet" href="css/components/image-upload.css">
  <link rel="stylesheet" href="css/components/theme-picker.css">

  <!-- Themes CSS -->
  <link rel="stylesheet" href="css/themes/theme-ocean.css">
  <link rel="stylesheet" href="css/themes/theme-forest.css">
  <link rel="stylesheet" href="css/themes/theme-sunset.css">
  <link rel="stylesheet" href="css/themes/theme-candy.css">
  <link rel="stylesheet" href="css/themes/theme-midnight.css">
  <link rel="stylesheet" href="css/themes/theme-gold.css">
</head>
<body class="theme-ocean">

  <div id="app">
    <!-- 畫面由 JS 動態渲染注入此處 -->
  </div>

  <!-- JavaScript Modules -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

*規格書版本 v1.0.0 | 最後更新：2026*
