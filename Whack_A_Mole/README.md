# MOLE MAYHEM - Web 打地鼠

這是一款純前端 Web 版打地鼠遊戲，使用 HTML、CSS、Vanilla JavaScript 與 Web Audio API 製作。專案不需要建置流程，直接用瀏覽器開啟 `index.html` 即可遊玩。

## 專案結構

```text
Whack_A_Mole/
├── index.html
├── README.md
├── whack_a_mole_spec.md
├── css/
│   ├── styles.css
│   ├── base.css
│   ├── home.css
│   ├── screens.css
│   ├── game.css
│   ├── ui.css
│   ├── animations.css
│   └── responsive.css
└── js/
    ├── config.js
    ├── save-system.js
    ├── audio-engine.js
    ├── game.js
    └── main.js
```

## HTML

### `index.html`

遊戲的 DOM 結構入口，負責宣告所有畫面區塊與載入外部 CSS/JS。

主要區塊：

- `screen-home`：主畫面
- `screen-select`：關卡選擇
- `screen-help`：遊戲說明
- `screen-settings`：設定頁
- `screen-game`：遊戲畫面
- `screen-result`：過關結果
- `screen-gameover`：失敗畫面
- `overlay-countdown`：開局倒數
- `combo-banner`、`toast`：遊戲提示 UI

CSS 透過 `css/styles.css` 載入。JavaScript 依序載入：

1. `js/config.js`
2. `js/save-system.js`
3. `js/audio-engine.js`
4. `js/game.js`
5. `js/main.js`

## CSS

### `css/styles.css`

CSS 入口檔，只負責用 `@import` 匯入其他 CSS 模組。`index.html` 只需要引用這個檔案。

### `css/base.css`

全域基礎樣式：

- CSS 變數與色彩設定
- `box-sizing`
- `html` / `body`
- 全域 button、input、select 基本樣式
- `.app`、`.screen`、`.stack` 等基礎版面

### `css/home.css`

主畫面相關樣式：

- 遊戲標題與副標題
- 主畫面草地場景
- 主畫面 mascot 地鼠
- 主要選單按鈕排列

### `css/screens.css`

非遊戲中畫面樣式：

- 關卡選擇卡片
- 說明頁內容
- 畫面標題

### `css/game.css`

遊戲核心畫面樣式：

- HUD 分數、時間、combo、生命與道具
- 離開遊戲按鈕區
- 遊戲棋盤 grid
- 洞口、地鼠、護盾、命中特效、分數浮字
- combo banner

### `css/ui.css`

共用 UI 元件：

- overlay 與倒數畫面
- 結果統計卡片
- 設定頁 slider 與 segmented control
- toast 提示

### `css/animations.css`

所有 keyframes 動畫：

- 主畫面地鼠浮動
- 地鼠出現、離開、被打中
- 命中特效
- 分數浮字
- combo banner
- 畫面震動

### `css/responsive.css`

RWD 與行動裝置修正：

- 手機版畫面 padding
- 手機版 HUD 兩欄排列
- 手機版離開遊戲小按鈕
- 手機版棋盤寬度限制
- 4x5 小格地鼠尺寸修正
- 小螢幕字級與間距調整

## JavaScript

所有 JavaScript 使用 classic script 與 `window.MoleMayhem` 命名空間串接，不使用 ES Module。這樣可以保持直接開啟 `index.html` 的使用方式。

### `js/config.js`

集中管理遊戲設定資料：

- `SAVE_KEY`：localStorage key
- `DIFFICULTY`：簡單、普通、困難難度倍率
- `LEVELS`：10 個關卡設定
- `MOLES`：地鼠種類、分數、血量、出現時間、權重

輸出到：

- `MoleMayhem.SAVE_KEY`
- `MoleMayhem.DIFFICULTY`
- `MoleMayhem.LEVELS`
- `MoleMayhem.MOLES`

### `js/save-system.js`

負責 localStorage 存取。

主要類別：

- `SaveSystem`

主要功能：

- 建立預設存檔
- 讀取存檔
- 儲存進度、設定與統計
- 重置紀錄

### `js/audio-engine.js`

負責 Web Audio API 音樂與音效。

主要類別：

- `AudioEngine`

主要功能：

- 建立 AudioContext
- 管理 master/music/sfx gain
- 主畫面 BGM
- 關卡 BGM sequencer
- 命中、miss、危險地鼠、道具、BOSS、勝利音效

注意：瀏覽器通常要求使用者互動後才能播放音訊，因此主畫面 BGM 會在第一次點擊後啟動。

### `js/game.js`

遊戲主流程與互動邏輯。

主要類別：

- `Game`

主要功能：

- 畫面切換
- 關卡選擇
- 設定同步
- 建立棋盤
- 開局倒數
- 地鼠生成與消失
- 命中判定
- 分數、生命、combo、道具
- 障礙物
- BOSS HP 邏輯
- 過關、失敗與結果保存
- RWD 不相關的遊戲狀態管理

### `js/main.js`

啟動入口。

在 `DOMContentLoaded` 後建立：

```js
new MoleMayhem.Game()
```

## 執行方式

直接用瀏覽器開啟：

```text
index.html
```

此專案目前沒有 npm、打包器或本機伺服器需求。

## 修改建議

- 調整關卡：修改 `js/config.js` 的 `LEVELS`
- 調整地鼠數值：修改 `js/config.js` 的 `MOLES`
- 調整音效與 BGM：修改 `js/audio-engine.js`
- 調整遊戲流程：修改 `js/game.js`
- 調整手機版版面：修改 `css/responsive.css`
- 調整地鼠與棋盤外觀：修改 `css/game.css`

## 驗證方式

目前可用的基本檢查：

```bash
node -e "const fs=require('fs'); for (const f of ['js/config.js','js/save-system.js','js/audio-engine.js','js/game.js','js/main.js']) new Function(fs.readFileSync(f,'utf8')); console.log('JS syntax ok')"
```

也建議手動用桌機與手機寬度測試：

- 主畫面 BGM 是否只在主畫面播放
- 關卡選擇是否全部開放
- 遊戲中 HUD 是否不超出邊界
- 4x5 棋盤地鼠是否不超出洞口
- 離開遊戲按鈕是否能中止遊戲並回主畫面
