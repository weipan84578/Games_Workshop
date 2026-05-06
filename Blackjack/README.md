# Blackjack 21

純 HTML / CSS / JavaScript 的 Web 版 21 點遊戲，依 `blackjack_spec.md` 建立。

## 執行方式

直接用瀏覽器雙擊 `index.html` 即可遊玩。`index.html` 載入的是自包含的 `js/app.js`，不需要 Node 或本機伺服器。

若仍想用本機伺服器測試，也可使用內建的零依賴靜態伺服器：

```powershell
node server.mjs
```

然後開啟 `http://localhost:8080`。

## 功能

- 1 名玩家 vs 1 到 3 名 AI 玩家
- 下注、發牌、叫牌、停牌、Double、投降
- 莊家 17 點停牌，Ace 支援 1/11 彈性計算
- AI 難度：簡單、普通、困難
- 多副牌牌靴與 Hi-Lo running count
- Web Audio API 合成背景音樂與音效
- localStorage 儲存設定、最高分與排行榜
- RWD 手機版操作介面
