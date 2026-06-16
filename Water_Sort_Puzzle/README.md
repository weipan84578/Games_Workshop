# Water Sort Puzzle

靜態 ES Module 版倒水排色遊戲，依 `water-sort-puzzle-spec.md` 的路由、模組、主題、存檔與核心規則實作。

## 執行

```powershell
python -m http.server 5500
```

打開 `http://localhost:5500/`。

由於專案使用 ES Module import，建議透過本機 HTTP server 開啟，而不是直接用 `file://`。
