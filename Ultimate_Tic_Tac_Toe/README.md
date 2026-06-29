# Ultimate Tic-Tac-Toe

純前端 Ultimate Tic-Tac-Toe（終極井字棋）WEB 版遊戲，依 `ultimate-tictactoe-spec.md` 實作。

## 使用方式

直接用瀏覽器開啟 `index.html` 即可遊玩，不需要 npm、build tool、CDN 或本地伺服器。

## 已實作

- 3×3 大棋盤與 9 個 3×3 小棋盤
- 指定下一個小棋盤的 Ultimate Tic-Tac-Toe 規則
- 小棋盤勝負、大棋盤勝負與平局判定
- VS AI 模式：Easy、Normal、Hard
- Hard AI：Minimax + Alpha-Beta 剪枝與超時回退
- 主選單、遊戲畫面、結果畫面、設定、說明
- LocalStorage 設定與遊戲進度保存
- 悔棋、重新開始、繼續遊戲
- Web Audio API 產生 BGM 與音效
- 繁體中文、English、日本語即時切換
- 四種主題：Classic、Neon、Ocean、Sakura
- RWD 版面與基礎無障礙標籤

## 檔案結構

```text
index.html
css/
  base/
  layout/
  components/
  themes/
js/
  core/
  ai/
  ui/
  audio/
  i18n/
  storage/
assets/
  icons/
```

## 儲存資料

LocalStorage key：

- `utttt_settings`
- `utttt_save`
- `utttt_stats`
