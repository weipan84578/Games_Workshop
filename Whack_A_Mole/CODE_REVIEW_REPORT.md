# MOLE MAYHEM Code Review Report

產出日期：2026-05-19  
範圍：`Whack_A_Mole/index.html`、`css/`、`js/`  
目標：檢查程式耦合度、可維護性、前端弱點與潛在安全風險。

## 結論

目前拆分後的檔案結構比單檔版本清楚很多，但 JavaScript 的實際耦合度仍偏高。主要原因是 `js/game.js` 的 `Game` 類別同時負責畫面切換、DOM 操作、遊戲狀態、排程、分數、關卡結果、音效觸發與存檔更新。

安全面目前沒有後端、登入、敏感資料或外部輸入，因此整體風險屬於中低。但有幾個前端弱點需要注意：`innerHTML` 使用集中在 `Game` 類別、所有模組暴露在 `window.MoleMayhem`、未設 CSP、第三方 Google Fonts 載入、localStorage 資料沒有 schema 驗證。

## Findings

### Medium - `Game` 類別承擔過多職責，耦合度偏高

位置：

- `js/game.js:6`
- `js/game.js:38`
- `js/game.js:99`
- `js/game.js:119`
- `js/game.js:168`
- `js/game.js:201`
- `js/game.js:243`
- `js/game.js:426`
- `js/game.js:484`

`Game` 類別目前約 550 行，包含：

- event binding
- screen routing
- settings UI sync
- level select render
- grid build
- countdown
- spawn timer
- obstacle timer
- hit/miss logic
- scoring/combo/power-up
- result persistence
- HUD rendering
- toast/shake/vibration

這使得任何遊戲規則、UI 或存檔格式變更，都可能需要修改同一個大型類別。後續若加入更多關卡機制、不同 UI layout 或測試，修改風險會明顯升高。

建議：

- 拆出 `UIManager`：集中 `document.getElementById`、畫面切換、HUD/result render。
- 拆出 `GameState` 或 `SessionState`：集中分數、生命、combo、time、bossHp。
- 拆出 `SpawnSystem`：集中地鼠生成、障礙排程、逃脫 timer。
- 拆出 `ScoringSystem`：集中分數、combo、星等、命中率。
- `Game` 保留流程編排即可。

### Medium - 多處 `innerHTML` 形成未來 XSS 入口

位置：

- `js/game.js:122`
- `js/game.js:129`
- `js/game.js:172`
- `js/game.js:264`
- `js/game.js:431`
- `js/game.js:432`

目前 `innerHTML` 使用的資料多半來自內建設定，例如 `LEVELS`、`MOLES` 或固定 template，因此現階段不是立即可利用的漏洞。但若未來關卡資料改成外部 JSON、URL 參數、使用者自訂關卡或遠端設定，`level.name`、分數文字、道具內容就可能成為 XSS 注入點。

建議：

- 將 `renderLevelSelect()` 改成 `createElement` + `textContent`。
- 將 `spawnMole()` 的地鼠 DOM 改成 template function，避免拼 HTML 字串。
- `heart-row`、`power-row` 可用 DOM node 重建，或至少只允許固定白名單內容。
- 若未來加入外部資料，先做 schema 驗證與文字 escape。

### Medium - `showScreen(name)` 直接用 dataset 組 DOM id，缺少白名單檢查

位置：

- `js/game.js:43`
- `js/game.js:99`
- `js/game.js:103`

`showScreen()` 直接使用 `data-screen` 組成 `screen-${name}`，如果 DOM 被修改或未來引入外部內容，傳入不存在的 screen name 會導致 `document.getElementById(...).classList` 失敗。這比較偏可靠性問題，但也代表 routing 邏輯缺少邊界檢查。

建議：

```js
const SCREENS = new Set(["home", "select", "help", "settings", "game", "result", "gameover"]);
if (!SCREENS.has(name)) return;
```

並將 screen id 查找結果做 null guard。

### Medium - localStorage 讀取只做淺層 merge，資料結構異常時容易造成 runtime error

位置：

- `js/save-system.js:34`
- `js/save-system.js:38`
- `js/save-system.js:39`

`load()` 使用：

```js
return { ...this.defaultSave(), ...parsed };
```

這只會合併第一層。如果 localStorage 中的 `settings`、`progress` 或 `stats` 缺少子欄位，預設值不會補回。例如 `progress` 若被寫成 `{}`，後續 `this.save.data.progress.currentLevel`、`progress.levels[level.id]` 可能出錯。

建議：

- 加入 `normalizeSaveData(parsed)`。
- 對 `settings`、`progress`、`progress.levels`、`stats` 分層 merge。
- 對數值欄位做型別與範圍檢查。

### Medium - 排程 timer 分散，部分短 timer 沒有集中註銷

位置：

- `js/game.js:196`
- `js/game.js:208`
- `js/game.js:222`
- `js/game.js:224`
- `js/game.js:231`
- `js/game.js:237`
- `js/game.js:278`
- `js/game.js:324`
- `js/game.js:367`
- `js/game.js:422`
- `js/game.js:423`
- `js/game.js:544`
- `js/audio-engine.js:82`

主要遊戲 timer 有 `timerId`、`spawnId`、`obstacleId`，但其他 `setTimeout` 是 fire-and-forget，例如：

- 額外生成地鼠 `setTimeout(() => this.spawnMole(), 130)`
- 障礙解除 timer
- DOM 移除 timer
- toast timer
- hit effect timer

其中多數影響較小，但在快速離開/重開關卡時，仍可能出現舊 session 的 callback 操作新畫面或已不存在 DOM 的情況。

建議：

- 增加 `TimerRegistry`，所有 timer 都用 `this.timers.setTimeout(...)` 建立。
- `stopGame()` 時統一清除。
- 非必要 callback 內加 `if (this.state !== "running") return;` 或 session id 檢查。

### Low - 全域命名空間可被任何同頁 script 修改

位置：

- `js/config.js:39`
- `js/save-system.js:57`
- `js/audio-engine.js:164`
- `js/game.js:549`
- `js/main.js:5`

目前所有模組透過 `window.MoleMayhem` 共享。這讓直接開 HTML 很方便，但任何同頁 script 都能覆寫：

- `MoleMayhem.LEVELS`
- `MoleMayhem.MOLES`
- `MoleMayhem.Game`
- `MoleMayhem.AudioEngine`

在純本機遊戲中影響有限；若未來放到網站、加入廣告、分析碼或外部插件，會提高供應鏈與全域污染風險。

建議：

- 若能接受本機 server，改用 ES modules。
- 或至少 `Object.freeze()` 固定 `LEVELS`、`MOLES`、`DIFFICULTY`。
- 將可變 state 與不可變 config 分開。

### Low - 未設定 Content Security Policy

位置：

- `index.html:8`
- `index.html:10`
- `index.html:181`
- `index.html:185`

目前沒有 CSP。靜態本機遊戲不是高風險，但如果發布到 Web，CSP 可以降低 XSS 成功後的影響範圍。

建議發布時加入類似：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'none'; img-src 'self' data:;">
```

注意：目前 CSS 使用 Google Fonts，所以 CSP 需要允許 `fonts.googleapis.com` 與 `fonts.gstatic.com`。

### Low - 第三方 Google Fonts 載入會帶來隱私與可用性依賴

位置：

- `index.html:8`
- `index.html:9`
- `index.html:10`

遊戲會連到 Google Fonts。這會造成：

- 離線時字體不可用。
- 使用者連線會對第三方產生請求。
- 某些網路環境可能被阻擋，造成字體 fallback。

建議：

- 若遊戲目標是純離線可玩，改成本地字體或完全使用 system font。
- 若保留 Google Fonts，README 中註明首次載入需要網路。

### Low - localStorage 存檔可被玩家任意修改

位置：

- `js/save-system.js:36`
- `js/save-system.js:46`
- `index.html:70`

這不是傳統安全漏洞，因為沒有伺服器信任這些資料。但若未來加入排行榜、成就上傳或雲端同步，不能信任 localStorage 中的分數、星等與進度。

建議：

- 若有遠端排行榜，伺服器必須重新驗證分數或只把 localStorage 當作本機快取。
- 本機端仍應做數值範圍檢查，避免異常資料造成 UI 錯誤。

## 耦合度評估

### 整體評分

目前耦合度：中高

檔案層級看起來已分家，但邏輯層級仍偏集中：

| 模組 | 行數 | 主要問題 |
|---|---:|---|
| `js/game.js` | 約 550 | 承擔 UI、狀態、規則、timer、存檔流程 |
| `js/audio-engine.js` | 約 165 | 與 save settings 直接耦合，但範圍可接受 |
| `js/save-system.js` | 約 58 | 獨立度高，但缺 schema normalize |
| `js/config.js` | 約 40 | 單純設定，適合保留 |
| `js/main.js` | 約 6 | 啟動入口，良好 |

### 主要耦合點

1. `Game` 直接讀寫 DOM id

位置集中在：

- `js/game.js:53`
- `js/game.js:59`
- `js/game.js:103`
- `js/game.js:121`
- `js/game.js:169`
- `js/game.js:190`
- `js/game.js:426`
- `js/game.js:540`

這代表 HTML id 一改，遊戲邏輯就會壞。建議把 DOM selector 集中到 `UIManager`。

2. `Game` 直接控制 `AudioEngine` 與 `SaveSystem`

位置：

- `js/game.js:8`
- `js/game.js:9`
- `js/game.js:53`
- `js/game.js:60`
- `js/game.js:203`
- `js/game.js:205`
- `js/game.js:501`

目前是小專案可接受，但之後如果要測試遊戲邏輯，會很難不帶 DOM、AudioContext 與 localStorage。建議用 constructor injection：

```js
new Game({ saveSystem, audioEngine, uiManager })
```

3. 遊戲規則與 UI render 混在同一批方法

例子：

- `resolveHit()` 同時算分、改生命、播放音效、震動、顯示浮字、判斷 boss。
- `finishLevel()` 同時計算結果、寫存檔、更新 DOM、切畫面。
- `updateHud()` 每次重建生命與道具 HTML。

建議將純邏輯函式抽出，讓它們不依賴 DOM，會更容易測試。

## 弱點掃描摘要

檢查項目：

- `innerHTML`
- `localStorage`
- `JSON.parse`
- `setTimeout` / `setInterval`
- `window` global
- `document` direct DOM access
- `AudioContext`
- 外部資源
- `eval` / `Function`

結果：

| 類型 | 結果 |
|---|---|
| `eval` | 未發現 |
| `Function` | 遊戲程式未使用；僅本次檢查命令使用 |
| `innerHTML` | 發現 6 處，建議逐步移除 |
| `localStorage` | 發現，需 schema normalize |
| 全域 namespace | 使用 `window.MoleMayhem`，可接受但有全域污染風險 |
| 外部資源 | Google Fonts |
| CSP | 未設定 |
| Secret/API key | 未發現 |
| 後端/網路請求 | 未發現遊戲 API 請求 |
| 使用者敏感資料 | 未發現 |

## 優先改善建議

### P1

1. 將 `showScreen()` 加白名單與 null guard。
2. 將 `SaveSystem.load()` 改成深層 normalize。
3. 將 `renderLevelSelect()` 的 `innerHTML` 改為 DOM API。

### P2

1. 拆出 `UIManager`，集中 DOM 查找與 render。
2. 拆出 `TimerRegistry`，集中管理所有 timeout/interval。
3. 拆出 `ScoringSystem`，讓分數與星等計算可獨立測試。

### P3

1. 改用 ES modules 或 freeze `window.MoleMayhem` 的 config。
2. 加 CSP。
3. 評估 Google Fonts 是否要本地化。

## 建議的下一步重構切法

建議分 4 個小 PR 或 commit 做，不要一次大改：

1. 安全邊界修補

- screen 白名單
- save normalize
- `renderLevelSelect()` 移除 `innerHTML`

2. UIManager

- `showScreen`
- `syncSettingsUI`
- `renderLevelSelect`
- `buildGrid`
- `updateHud`
- `toast`

3. Game logic modules

- `ScoringSystem`
- `PowerUpSystem`
- `ResultManager`

4. Timer/session 管理

- `TimerRegistry`
- session id 統一檢查
- `stopGame()` 清除所有 pending callbacks

## 本次檢查命令

```bash
node -e "const fs=require('fs'); for (const f of ['js/config.js','js/save-system.js','js/audio-engine.js','js/game.js','js/main.js']) new Function(fs.readFileSync(f,'utf8')); console.log('syntax ok')"
```

```bash
rg -n "innerHTML|localStorage|addEventListener|setInterval|setTimeout|eval|Function|document\\.|window\\.|AudioContext|navigator|Math\\.random|dataset|style\\." index.html js css
```

## 最終判斷

目前程式可以繼續開發，但建議在新增大型功能前先降低 `Game` 的職責密度。安全面沒有立即高危漏洞，但 `innerHTML`、localStorage normalize、screen routing guard 這三項應優先處理，因為它們改動小、收益高，也能避免後續功能擴充時把風險放大。
