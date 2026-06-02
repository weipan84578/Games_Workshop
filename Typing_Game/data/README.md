# 字詞資料

字詞已拆成 4 個 JSON 檔案：

- `words-en.json`: 英文
- `words-zh.json`: 中文
- `words-num.json`: 數字
- `words-mixed.json`: 混合

每個檔案都是 JSON 陣列，直接加入字串即可：

```json
[
  "typing",
  "master",
  "new-word"
]
```

注意事項：

- JSON 不能寫註解。
- 每個字詞都要用雙引號。
- 最後一個項目後面不能加逗號。
- 遊戲會自動去除空字串與重複字詞。

如果是直接雙擊 `index.html` 遊玩，修改 JSON 後請在 `Typing_Game` 目錄執行：

```bash
node tools/build-classic-bundle.js
```

這會把最新 JSON 同步到 `js/app.classic.js`。
