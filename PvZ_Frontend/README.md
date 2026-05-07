# Garden Defenders 前端說明

這是一個類 Plants vs. Zombies 的瀏覽器遊戲，使用 HTML、CSS 與 Vanilla JavaScript 製作，不需要建置流程。

## 執行方式

直接用瀏覽器開啟 `index.html` 即可遊玩。

## 目錄結構

```text
PvZ_Frontend/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ data.js
│  ├─ save-system.js
│  ├─ audio.js
│  ├─ state.js
│  ├─ ui.js
│  ├─ game-systems.js
│  └─ main.js
├─ PvZ_Frontend_Spec.md
└─ README.md
```

## 檔案職責

### `index.html`

只保留靜態 HTML 結構與外部檔案引用，包含：

- 主選單
- 植物選擇畫面
- 遊戲 HUD 與草坪容器
- 暫停、結算、設定、圖鑑等覆蓋視窗
- `css/styles.css` 與各個 `js/*.js` 的引用

### `css/styles.css`

集中管理所有樣式與 RWD：

- 主選單、植物選擇、HUD、棋盤、覆蓋視窗、圖鑑
- 植物、殭屍、投射物、陽光、防線車等視覺樣式
- CSS 動畫
- 手機直向、手機橫向與桌面版排版

### `js/data.js`

集中管理靜態資料與關卡產生：

- 全域常數，例如棋盤行列、最高關卡、最多可攜帶植物數
- `PlantDefs`：植物資料
- `ZombieDefs`：殭屍與敵人資料
- 50 關波次產生器
- 白天/夜晚關卡使用的資料基礎

### `js/save-system.js`

負責 `localStorage` 存檔：

- 預設存檔資料
- 讀取與寫入
- 高分紀錄
- 正式模式的關卡解鎖

注意：練習模式不會寫入高分，也不會解鎖正式進度。

### `js/audio.js`

負責 Web Audio API：

- 音訊節點初始化
- 主音量、音樂音量、音效音量
- 程式生成音效
- 主選單與戰鬥音樂

### `js/state.js`

負責共享狀態與通用工具：

- `State` 遊戲狀態
- DOM 快取參照
- 遊戲階段、目前關卡、波次、陽光、已選植物、場上物件
- 白天/夜晚判斷
- 關卡選擇上限
- Toast、震動、時間格式化等工具

### `js/ui.js`

負責 UI 建立與玩家互動：

- 建立棋盤格
- 植物選擇清單
- 已選植物欄位
- 圖鑑內容
- HUD 植物卡
- 自動陽光按鈕狀態
- 植物放置
- 鏟子移除植物
- 陽光收集
- 波次生成排程
- 建立殭屍與投射物

### `js/game-systems.js`

負責遊戲模擬與畫面渲染：

- 每幀更新流程
- 植物行為
- 殭屍行為
- 投射物碰撞
- 陽光生命週期與自動採集
- 防線車行為
- 勝利與失敗判定
- 植物、殭屍、投射物、陽光、防線車的 DOM 渲染

### `js/main.js`

負責啟動與事件綁定：

- `requestAnimationFrame` 主迴圈
- 主選單按鈕
- 練習模式入口
- 植物選擇頁關卡切換
- 鏟子與自動陽光按鈕
- 暫停、結算、設定視窗
- 初始化棋盤、植物選擇與第一次渲染

## JavaScript 載入順序

目前使用傳統瀏覽器 script，不是 ES module，因此載入順序很重要：

1. `js/data.js`
2. `js/save-system.js`
3. `js/audio.js`
4. `js/state.js`
5. `js/ui.js`
6. `js/game-systems.js`
7. `js/main.js`

除非之後改成 ES modules，否則不要任意調整這個順序。
