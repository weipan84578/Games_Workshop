# 快艇骰子 Yahtzee

純前端、零建置、可離線執行的 Web 版 Yahtzee。

## 執行方式

直接用瀏覽器開啟 `index.html` 即可遊玩，不需要 Node、build、server 或網路連線。

## 已實作

- 玩家 vs AI，含簡單、普通、困難三種策略
- 完整 13 格 Yahtzee 計分、上段 35 分獎勵、快艇額外 100 分獎勵
- localStorage 牌局存檔與設定保存
- 繁體中文、English、日本語即時切換
- 五套主題、字級切換、RWD 與行動底部操作列
- Web Audio 產生式 BGM/SFX，遊戲畫面套用 5x GainNode 增益

## 檔案結構

入口檔為 `index.html`，CSS 與 JS 依 `yahtzee-spec.md` 指定分類於 `css/`、`js/`、`assets/`。
