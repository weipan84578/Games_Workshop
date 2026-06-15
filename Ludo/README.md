# Ludo 飛行棋（Web 版）

純前端、零依賴、零建置的 Ludo 飛行棋。**雙擊 `index.html` 即可遊玩**(`file://` 直接開啟,無需 server / build)。玩家對戰 1～3 個 AI,支援三種難度。

依《Ludo_spec.md》規格實作。

## 特色

- **直接開檔**:所有 JS 以傳統 `<script src>` 載入,透過全域命名空間 `window.Ludo` 共享,不用 ES Module,避開 `file://` 的 CORS 限制。
- **單頁應用(SPA)**:所有畫面為同一頁的 `<section>`,以顯示/隱藏切換,頁面永不重載,**背景音樂跨畫面持續不中斷**。
- **RWD**:手機 / 平板 / 桌面三斷點;遊戲畫面採 Grid 三段式(HUD / 棋盤 / 控制列),棋盤動態計算尺寸保持正方,**控制列永不遮擋棋盤**。
- **大字體、多主題**:6 套主題配色(經典 / 海洋 / 夕陽 / 森林 / 夜間 / 高對比),流體字級、≥48px 可點區。
- **音訊**:17 種音效 + 2 首背景音樂,全部以 **Web Audio API 即時合成**,免外部音檔;首次互動才解鎖自動播放,切換 BGM 支援淡入淡出。
- **AI 三難度**:簡單(隨機)、普通(啟發式評分)、困難(威脅分析 + 機率權衡)。
- **存檔**:`localStorage` 自動存檔,支援「繼續遊戲」;已擲骰等待選棋、額外回合等穩定狀態會原樣恢復;設定獨立儲存。

## 如何遊玩

1. 雙擊 `index.html`(或拖入瀏覽器)。
2. 主選單 →「開始遊戲」→ 選擇對手數量、AI 難度、你的顏色 →「開始!」。
3. 點擊下方骰子擲骰(桌面可按 **空白鍵**),再點擊發光的棋子移動。
4. 擲到 **6** 可出棋與額外回合;停在對手棋子上可吃子;率先讓 4 顆棋子全部回到中央終點者獲勝。

## 規則重點

- 擲到 6 才能出棋;進入終點需精確點數;連三次 6 作廢。
- 起始格與星號格(★)為安全格,棋子不會被吃;兩顆以上同格形成堡壘,不可穿越或停留。
- 規則可於 `js/core/config.js` 的 `rules` 調整(精確進終點、連三 6、吃子獎勵、堡壘阻擋)。

## 專案結構

```
Ludo/
├── index.html              唯一入口(以 link/script 引入各分類檔)
├── css/   base/ themes/ layout/ components/ responsive/
├── js/    core/ engine/ ai/ audio/ ui/ input/ + main.js
├── tests/ 核心規則與回合恢復測試(開發用,無第三方依賴)
├── tools/ verify.js         語法檢查 + 測試入口
├── assets/ audio/ images/ fonts/   (音訊為合成,詳見 assets/README.txt)
└── README.md
```

載入順序(見 `index.html`):命名空間 → 設定 → 引擎 → AI → 音訊 → UI → 輸入 → 啟動。

## 技術

原生 HTML / CSS / JavaScript(ES5/ES6),CSS Grid + CSS 變數,HTML5 Audio(Web Audio 合成),`localStorage`。**無任何框架或 CDN**。

> `file://` 注意:`localStorage` 以「檔案來源」為範圍,搬移檔案路徑後可能讀不到舊存檔,屬正常現象。

## 開發驗證

遊戲執行不需要安裝套件。若本機有 Node.js,可執行:

```bash
npm run verify
```

此命令會對所有 JS 執行語法檢查,並跑核心規則與回合恢復測試。
