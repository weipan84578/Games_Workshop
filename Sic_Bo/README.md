# Sic Bo Static Web Game

> Pure static Sic Bo / Tai Sai browser game. Open `index.html` directly and play offline.

## Quick Navigation

| Language | Game Intro | Gameplay | Betting Odds | Program Intro | Program Classification |
|---|---:|---:|---:|---:|---:|
| 中文 | [介紹](#zh-intro) | [玩法](#zh-gameplay) | [賠率](#zh-odds) | [程式介紹](#zh-program) | [程式分類](#zh-structure) |
| English | [Intro](#en-intro) | [How to Play](#en-gameplay) | [Odds](#en-odds) | [Program Intro](#en-program) | [Program Map](#en-structure) |
| 日本語 | [紹介](#ja-intro) | [遊び方](#ja-gameplay) | [配当](#ja-odds) | [プログラム紹介](#ja-program) | [構成分類](#ja-structure) |

## Project Snapshot

| Item | Details |
|---|---|
| App type | Pure frontend static web game |
| Entry point | `index.html` |
| Build step | None |
| Runtime server | None |
| Network requirement | None for core gameplay |
| Data loading | Script-loaded JavaScript objects, no local `fetch()` |
| Supported languages | Traditional Chinese, English, Japanese |
| Save system | Browser LocalStorage key: `sicbo.save.v1` |
| Main technologies | HTML5, CSS3, vanilla JavaScript, Web Audio API, LocalStorage |

---

<a id="zh-intro"></a>

# 中文

## 遊戲介紹

**Sic Bo Static Web Game** 是一款可離線遊玩的骰寶網頁遊戲。玩家使用虛擬籌碼在下注區押注，系統擲出三顆六面骰後，依照骰寶規則計算輸贏與賠率。

| 特色 | 說明 |
|---|---|
| 🎲 骰寶規則 | 支援大小、單雙、總和、單骰、雙骰、豹子、組合等下注類型 |
| 💰 虛擬籌碼 | 初始餘額 10,000，籌碼面額包含 10 / 50 / 100 / 500 / 1000 |
| 🌐 三語介面 | 支援繁體中文、English、日本語，可即時切換 |
| 🎨 五種主題 | classic-red、emerald、royal-blue、midnight、sakura |
| 💾 自動存檔 | 每局結算後寫入 LocalStorage，可從主選單繼續遊戲 |
| 📱 RWD | 桌機、平板、手機皆可操作，手機下注區支援橫向滑動 |
| 🔊 音訊體驗 | 使用 Web Audio API 產生 BGM 與清脆互動音效 |
| ✨ 互動主畫面 | 主畫面 3D 骰子會慢速旋轉，點擊後以隨機 360 度以上的 3D 方向高速翻轉並鎖定到停下；背景有多個具正反面與厚度的半透明 3D 籌碼，以不規則方向慢慢旋轉 |

## 快速開始

| 步驟 | 操作 |
|---|---|
| 1 | 進入專案資料夾 |
| 2 | 直接雙擊 `index.html` |
| 3 | 在主畫面選擇「開始遊戲」或「繼續遊戲」 |
| 4 | 選籌碼、下注、確認下注、搖骰 |

不需要執行 `npm install`，也不需要啟動 server。此專案設計目標就是能在 `file://` 模式下直接運作。

<a id="zh-gameplay"></a>

## 詳細遊戲玩法

### 畫面流程

| 階段 | 玩家操作 | 系統行為 |
|---|---|---|
| 主選單 | 開始遊戲 / 繼續遊戲 / 說明 / 設定 | 初始化、讀取存檔或開啟彈窗 |
| 下注階段 | 選擇籌碼並點擊下注區 | 扣除下注金額並堆疊籌碼 |
| 調整下注 | 重複上局、取消最後一注、清除下注 | 即時更新餘額與下注總額 |
| 鎖定下注 | 按「確認下注」 | 下注區鎖定，進入可搖骰狀態 |
| 搖骰 | 按「搖骰」 | 播放骰盅/骰子動畫與音效 |
| 結算 | 查看結果 | 顯示骰子、總和、命中下注、派彩與結果彈窗 |
| 下一局 | 按下一局或回主選單 | 自動存檔並保留最近 10 局歷史 |

### 操作按鈕

| 按鈕 | 功能 |
|---|---|
| 開始遊戲 | 建立新局，餘額回到 10,000 |
| 繼續遊戲 | 讀取 `sicbo.save.v1` 的有效存檔 |
| 主畫面 3D 骰子 | 未點擊時慢慢旋轉；點擊後以隨機 360 度以上的 3D 方向高速翻轉，旋轉完全停止前不能再次點擊 |
| 重複上局 | 用上一局下注內容再次下注 |
| 取消最後一注 | 還原最近一次下注 |
| 清除下注 | 退回本局所有尚未鎖定的下注 |
| 確認下注 | 鎖定目前下注 |
| 搖骰 | 擲出三顆骰子並結算 |

### 設定功能

| 設定 | 說明 |
|---|---|
| 音樂音量 | 控制 BGM；主畫面與遊戲畫面使用同一音量值 |
| 音效音量 | 控制按鈕、籌碼、骰子、勝負提示音 |
| 語言 | 繁體中文 / English / 日本語 |
| 主題 | 五種色彩主題即時切換 |
| 震動回饋 | 行動裝置支援時啟用 `navigator.vibrate()` |
| 清除存檔 | 移除 LocalStorage 存檔 |

<a id="zh-odds"></a>

## 下注類型與賠率

> 賠率表示「淨利 : 本金」。中獎時會退還本金加上淨利。

| 類型 | 中獎條件 | 賠率 |
|---|---|---:|
| 大 Big | 總和 11-17，豹子不算 | 1:1 |
| 小 Small | 總和 4-10，豹子不算 | 1:1 |
| 單 Odd | 總和為奇數，豹子不算 | 1:1 |
| 雙 Even | 總和為偶數，豹子不算 | 1:1 |
| 指定總和 4 / 17 | 三骰總和精準命中 | 60:1 |
| 指定總和 5 / 16 | 三骰總和精準命中 | 30:1 |
| 指定總和 6 / 15 | 三骰總和精準命中 | 17:1 |
| 指定總和 7 / 14 | 三骰總和精準命中 | 12:1 |
| 指定總和 8 / 13 | 三骰總和精準命中 | 8:1 |
| 指定總和 9 / 10 / 11 / 12 | 三骰總和精準命中 | 6:1 |
| 單骰 Single | 指定點數出現 1 / 2 / 3 顆 | 1:1 / 2:1 / 3:1 |
| 指定雙骰 Specific Double | 指定點數至少出現 2 顆 | 10:1 |
| 任意豹子 Any Triple | 任意三顆同點 | 30:1 |
| 指定豹子 Specific Triple | 指定點數三顆同點 | 180:1 |
| 兩骰組合 Combination | 指定兩個不同點數都出現 | 6:1 |

### 重要規則

| 規則 | 說明 |
|---|---|
| 豹子通殺 | 任意三顆同點時，大、小、單、雙全部輸 |
| 單骰階梯賠付 | 指定點數出現幾顆，就用幾倍賠率 |
| 多區下注 | 同一局可以同時下注多個區域 |
| 餘額限制 | 餘額不足時不可下注 |

<a id="zh-program"></a>

## 程式介紹

本專案是純前端靜態架構。`index.html` 依序載入 CSS 與 JavaScript，每個 JS 檔將功能掛在 `window.SicBo` 命名空間下，不使用 ES Module，避免部分瀏覽器在直接開啟本地檔案時遇到 CORS 限制。

| 核心設計 | 實作方式 |
|---|---|
| 零建置 | 不使用打包器、不需 Node 套件 |
| 離線可玩 | 所有核心資料皆在 JS 檔內 |
| 模組化 | CSS 與 JS 依職責拆分資料夾 |
| 共享資料源 | 下注類型與賠率集中於 `js/core/bet-types-data.js` |
| 結算一致性 | UI 顯示與派彩計算讀同一份下注資料 |
| 存檔 | `js/storage/save-manager.js` 封裝 LocalStorage |
| 語系 | `js/i18n/lang-*.js` 字典與 `i18n-manager.js` 套用文字 |
| 音訊 | `audio-manager.js` 用 Web Audio API 產生 BGM/SFX |

### 程式啟動順序

| 順序 | 區塊 | 說明 |
|---:|---|---|
| 1 | `index.html` | 建立畫面節點、彈窗、下注區容器 |
| 2 | i18n scripts | 載入三語字典與語系管理器 |
| 3 | audio scripts | 建立 BGM/SFX 資料與音訊管理器 |
| 4 | core scripts | 載入下注資料、派彩、骰子、下注邏輯、遊戲引擎 |
| 5 | ui scripts | 建立動畫、賭桌渲染、彈窗、主選單控制器 |
| 6 | settings/storage | 套用主題、設定、LocalStorage |
| 7 | `main.js` | 在 `DOMContentLoaded` 後組裝所有模組 |

<a id="zh-structure"></a>

## 程式分類

### 檔案結構

```text
Sic_Bo/
├─ index.html
├─ SicBo_spec.md
├─ README.md
├─ css/
│  ├─ base/
│  ├─ layout/
│  ├─ components/
│  ├─ themes/
│  └─ responsive/
├─ js/
│  ├─ core/
│  ├─ ui/
│  ├─ audio/
│  ├─ i18n/
│  ├─ settings/
│  └─ storage/
├─ tasks/
└─ Temp/
```

### CSS 分類

| 分類 | 內容 |
|---|---|
| `css/base` | reset、CSS 變數、字體基礎規範 |
| `css/layout` | 主選單、遊戲版面、header/footer、modal |
| `css/components` | 按鈕、骰子、籌碼、下注桌、toast、switch/slider |
| `css/themes` | 五種主題配色 |
| `css/responsive` | mobile、tablet、desktop RWD 規則 |

### JavaScript 分類

| 分類 | 主要檔案 | 職責 |
|---|---|---|
| `js/core` | `game-engine.js`, `betting-logic.js`, `payout-calculator.js`, `dice-roller.js`, `bet-types-data.js` | 遊戲規則、下注、骰子、結算 |
| `js/ui` | `board-renderer.js`, `modal-controller.js`, `menu-controller.js`, `animation-controller.js` | 畫面渲染、彈窗、選單、動畫 |
| `js/audio` | `audio-manager.js`, `bgm-playlist.js`, `sfx-map.js` | BGM 與音效 |
| `js/i18n` | `i18n-manager.js`, `lang-*.js` | 三語翻譯與即時切換 |
| `js/settings` | `settings-manager.js`, `theme-manager.js` | 設定值與主題 |
| `js/storage` | `save-manager.js` | LocalStorage 存讀檔 |

### 開發檢查

| 檢查 | 指令或方式 |
|---|---|
| JS 語法 | `node --check js\core\game-engine.js`，或逐檔執行 `node --check` |
| 靜態限制 | 確認沒有 `fetch()` 與 `type="module"` |
| 手動測試 | 雙擊 `index.html`，跑一輪下注到結算 |
| RWD | 使用瀏覽器 DevTools 檢查桌機、平板、手機寬度 |
| 截圖證據 | `Temp/` 僅放圖片檔 |

---

<a id="en-intro"></a>

# English

## Game Introduction

**Sic Bo Static Web Game** is an offline-friendly browser implementation of Sic Bo / Tai Sai. The player places virtual chips on the betting table, three dice are rolled, and the game settles every bet according to Sic Bo rules.

| Feature | Description |
|---|---|
| 🎲 Sic Bo rules | Supports Big/Small, Odd/Even, totals, singles, doubles, triples, and combinations |
| 💰 Virtual chips | Starting balance is 10,000; chip values are 10 / 50 / 100 / 500 / 1000 |
| 🌐 Three languages | Traditional Chinese, English, Japanese |
| 🎨 Five themes | classic-red, emerald, royal-blue, midnight, sakura |
| 💾 Auto save | Saves after settlement and enables Continue Game |
| 📱 Responsive UI | Desktop, tablet, and mobile layouts |
| 🔊 Audio | Web Audio API generated BGM and sound effects |
| ✨ Interactive menu | The 3D menu die rotates slowly, then spins through random multi-turn 3D angles when clicked and locks until it stops; the background uses multiple semi-transparent 3D chips with front faces, back faces, and thickness, rotating slowly in irregular directions |

## Quick Start

| Step | Action |
|---|---|
| 1 | Open the project folder |
| 2 | Double-click `index.html` |
| 3 | Choose Start Game or Continue Game |
| 4 | Select a chip, place bets, confirm, and roll |

No `npm install`, build command, local server, or CDN is required.

<a id="en-gameplay"></a>

## Detailed Gameplay

### Game Flow

| Phase | Player Action | System Behavior |
|---|---|---|
| Main menu | Start, continue, help, or settings | Initializes a new game, loads a save, or opens a dialog |
| Betting | Select chips and click bet areas | Deducts stake and renders chip stacks |
| Bet editing | Repeat, undo, or clear bets | Updates balance and bet total immediately |
| Lock bets | Press Confirm Bet | Locks current bets |
| Roll | Press Roll | Plays dice animation and rolling sound |
| Settlement | Read the result | Shows dice, total, winning bets, payout, and result dialog |
| Next round | Continue or return to menu | Auto-saves and keeps recent history |

### Main Controls

| Control | Purpose |
|---|---|
| Start Game | Starts a new game with 10,000 balance |
| Continue Game | Loads the LocalStorage save at `sicbo.save.v1` |
| 3D menu die | Rotates slowly when idle; on click, it spins through random multi-turn 3D angles and cannot be clicked again until it stops |
| Repeat Bet | Replays the previous round's bet layout |
| Undo Bet | Reverts the latest bet action |
| Clear Bet | Refunds all unlocked bets in the current round |
| Confirm Bet | Locks the current bet set |
| Roll | Rolls three dice and settles the round |

### Settings

| Setting | Description |
|---|---|
| BGM volume | Controls background music; the menu and game screen use the same volume value |
| SFX volume | Controls button, chip, dice, win, and lose sounds |
| Language | Traditional Chinese / English / Japanese |
| Theme | Switches between five visual themes instantly |
| Vibration | Uses `navigator.vibrate()` when supported |
| Clear save | Removes the saved game from LocalStorage |

<a id="en-odds"></a>

## Betting Types and Odds

> Odds are shown as profit : stake. A winning bet returns the original stake plus profit.

| Bet Type | Winning Condition | Payout |
|---|---|---:|
| Big | Total 11-17, excluding triples | 1:1 |
| Small | Total 4-10, excluding triples | 1:1 |
| Odd | Odd total, excluding triples | 1:1 |
| Even | Even total, excluding triples | 1:1 |
| Total 4 / 17 | Exact three-dice total | 60:1 |
| Total 5 / 16 | Exact three-dice total | 30:1 |
| Total 6 / 15 | Exact three-dice total | 17:1 |
| Total 7 / 14 | Exact three-dice total | 12:1 |
| Total 8 / 13 | Exact three-dice total | 8:1 |
| Total 9 / 10 / 11 / 12 | Exact three-dice total | 6:1 |
| Single Number | Selected face appears 1 / 2 / 3 times | 1:1 / 2:1 / 3:1 |
| Specific Double | Selected face appears at least twice | 10:1 |
| Any Triple | Any three dice show the same face | 30:1 |
| Specific Triple | Selected face appears on all three dice | 180:1 |
| Combination | Two selected different faces both appear | 6:1 |

### Important Rules

| Rule | Description |
|---|---|
| Triple kills basic bets | Any triple makes Big, Small, Odd, and Even lose |
| Single number ladder | One, two, or three matches pay one, two, or three times |
| Multiple bet areas | The player can bet on multiple areas in one round |
| Balance limit | Bets are rejected when the balance is insufficient |

<a id="en-program"></a>

## Program Introduction

This project is intentionally implemented as a plain static frontend. `index.html` loads stylesheets and scripts in order. Every JavaScript file attaches its public API to the `window.SicBo` namespace instead of using ES modules, so the app remains reliable when opened through `file://`.

| Design Choice | Implementation |
|---|---|
| Zero build | No bundler, no framework, no package install |
| Offline data | Dictionaries and bet metadata are JavaScript objects |
| Modular code | CSS and JS are separated by responsibility |
| Shared bet source | `js/core/bet-types-data.js` drives board labels and payout logic |
| Consistent settlement | UI and settlement read from the same bet definitions |
| Save system | `js/storage/save-manager.js` wraps LocalStorage |
| i18n | `js/i18n/lang-*.js` plus `i18n-manager.js` |
| Audio | `audio-manager.js` generates BGM/SFX through Web Audio |

### Startup Order

| Order | Block | Purpose |
|---:|---|---|
| 1 | `index.html` | Defines screens, dialogs, buttons, and containers |
| 2 | i18n scripts | Loads dictionaries and translation manager |
| 3 | audio scripts | Loads BGM notes, SFX maps, and audio manager |
| 4 | core scripts | Loads bets, payout, dice, betting, and game engine |
| 5 | UI scripts | Loads renderer, modal, menu, and animation controllers |
| 6 | settings/storage | Applies theme, settings, and persistence |
| 7 | `main.js` | Wires everything on `DOMContentLoaded` |

<a id="en-structure"></a>

## Program Classification

### File Tree

```text
Sic_Bo/
├─ index.html
├─ SicBo_spec.md
├─ README.md
├─ css/
│  ├─ base/
│  ├─ layout/
│  ├─ components/
│  ├─ themes/
│  └─ responsive/
├─ js/
│  ├─ core/
│  ├─ ui/
│  ├─ audio/
│  ├─ i18n/
│  ├─ settings/
│  └─ storage/
├─ tasks/
└─ Temp/
```

### CSS Groups

| Group | Responsibility |
|---|---|
| `css/base` | Reset, tokens, typography |
| `css/layout` | Main menu, game screen, header/footer, dialogs |
| `css/components` | Buttons, dice, chips, betting table, toast, switches/sliders |
| `css/themes` | Five theme palettes |
| `css/responsive` | Mobile, tablet, and desktop breakpoints |

### JavaScript Groups

| Group | Key Files | Responsibility |
|---|---|---|
| `js/core` | `game-engine.js`, `betting-logic.js`, `payout-calculator.js`, `dice-roller.js`, `bet-types-data.js` | Rules, betting, dice, settlement |
| `js/ui` | `board-renderer.js`, `modal-controller.js`, `menu-controller.js`, `animation-controller.js` | Rendering, dialogs, menus, animation timing |
| `js/audio` | `audio-manager.js`, `bgm-playlist.js`, `sfx-map.js` | Background music and sound effects |
| `js/i18n` | `i18n-manager.js`, `lang-*.js` | Translation dictionaries and language switching |
| `js/settings` | `settings-manager.js`, `theme-manager.js` | User preferences and themes |
| `js/storage` | `save-manager.js` | LocalStorage persistence |

### Developer Checks

| Check | Method |
|---|---|
| JavaScript syntax | Run `node --check` on the JS files |
| Static constraint | Confirm there is no `fetch()` and no `type="module"` |
| Manual smoke test | Open `index.html` and play one full round |
| Responsive test | Check desktop, tablet, and mobile widths in DevTools |
| Screenshot evidence | Keep `Temp/` image-only |

---

<a id="ja-intro"></a>

# 日本語

## ゲーム紹介

**Sic Bo Static Web Game** は、オフラインで遊べる骰宝（シックボー / 大小）のブラウザゲームです。プレイヤーは仮想チップを賭け、三つの六面ダイスの出目によって勝敗と配当が決まります。

| 特徴 | 説明 |
|---|---|
| 🎲 骰宝ルール | 大小、奇偶、合計、単目、二目、ゾロ目、組み合わせに対応 |
| 💰 仮想チップ | 初期残高は 10,000、チップは 10 / 50 / 100 / 500 / 1000 |
| 🌐 三言語 | 繁体字中国語、英語、日本語 |
| 🎨 五つのテーマ | classic-red、emerald、royal-blue、midnight、sakura |
| 💾 自動保存 | 精算後に LocalStorage へ保存し、続きから遊べる |
| 📱 レスポンシブ | デスクトップ、タブレット、スマートフォンに対応 |
| 🔊 音声 | Web Audio API で BGM と効果音を生成 |
| ✨ インタラクティブメニュー | メイン画面の 3D ダイスはゆっくり回転し、クリックするとランダムな複数回転 3D 角度で高速回転して停止までロックされる。背景には表面・裏面・厚みを持つ半透明 3D チップが複数あり、不規則な方向へゆっくり回転する |

## クイックスタート

| 手順 | 操作 |
|---|---|
| 1 | プロジェクトフォルダを開く |
| 2 | `index.html` をダブルクリック |
| 3 | Start Game または Continue Game を選ぶ |
| 4 | チップを選び、賭けて、確定し、ダイスを振る |

`npm install`、ビルド、ローカルサーバー、CDN は不要です。

<a id="ja-gameplay"></a>

## 詳しい遊び方

### ゲームの流れ

| フェーズ | プレイヤー操作 | システム動作 |
|---|---|---|
| メインメニュー | 開始、続き、ヘルプ、設定 | 新規開始、保存読込、ダイアログ表示 |
| ベット | チップを選び、賭けエリアをクリック | 掛け金を差し引き、チップを表示 |
| ベット調整 | 前回繰り返し、取り消し、全消去 | 残高と合計ベットを更新 |
| ベット確定 | Confirm Bet を押す | 現在のベットをロック |
| ロール | Roll を押す | ダイスアニメーションと音を再生 |
| 精算 | 結果を確認 | 出目、合計、的中ベット、配当を表示 |
| 次ラウンド | 続行またはメニューへ戻る | 自動保存し、直近履歴を保持 |

### 主な操作

| 操作 | 目的 |
|---|---|
| Start Game | 残高 10,000 で新規ゲーム開始 |
| Continue Game | `sicbo.save.v1` の保存データを読み込む |
| 3D メニューダイス | 未クリック時はゆっくり回転し、クリック後はランダムな複数回転 3D 角度で高速回転する。停止するまで再クリック不可 |
| Repeat Bet | 前回ラウンドのベットを再利用 |
| Undo Bet | 直近のベット操作を取り消す |
| Clear Bet | 未確定ベットをすべて払い戻す |
| Confirm Bet | 現在のベットを確定 |
| Roll | 三つのダイスを振って精算 |

### 設定

| 設定 | 説明 |
|---|---|
| BGM 音量 | 背景音楽を調整。メニュー画面とゲーム画面で同じ音量値を使用 |
| 効果音音量 | ボタン、チップ、ダイス、勝敗音を調整 |
| 言語 | 繁体字中国語 / 英語 / 日本語 |
| テーマ | 五つの見た目テーマを即時切り替え |
| 振動 | 対応端末で `navigator.vibrate()` を利用 |
| 保存削除 | LocalStorage の保存データを削除 |

<a id="ja-odds"></a>

## ベット種類と配当

> 配当は「利益 : 掛け金」です。当たりの場合は掛け金と利益が戻ります。

| ベット種類 | 的中条件 | 配当 |
|---|---|---:|
| 大 Big | 合計 11-17、ゾロ目を除く | 1:1 |
| 小 Small | 合計 4-10、ゾロ目を除く | 1:1 |
| 奇 Odd | 合計が奇数、ゾロ目を除く | 1:1 |
| 偶 Even | 合計が偶数、ゾロ目を除く | 1:1 |
| 合計 4 / 17 | 三つのダイス合計が完全一致 | 60:1 |
| 合計 5 / 16 | 三つのダイス合計が完全一致 | 30:1 |
| 合計 6 / 15 | 三つのダイス合計が完全一致 | 17:1 |
| 合計 7 / 14 | 三つのダイス合計が完全一致 | 12:1 |
| 合計 8 / 13 | 三つのダイス合計が完全一致 | 8:1 |
| 合計 9 / 10 / 11 / 12 | 三つのダイス合計が完全一致 | 6:1 |
| 単目 Single | 指定目が 1 / 2 / 3 個出る | 1:1 / 2:1 / 3:1 |
| 指定ペア Specific Double | 指定目が 2 個以上出る | 10:1 |
| 任意ゾロ目 Any Triple | 任意の三つのダイスが同じ目 | 30:1 |
| 指定ゾロ目 Specific Triple | 指定目が三つすべてに出る | 180:1 |
| 組み合わせ Combination | 指定した二つの異なる目が両方出る | 6:1 |

### 重要ルール

| ルール | 説明 |
|---|---|
| ゾロ目時の基本ベット負け | 任意ゾロ目の場合、大・小・奇・偶はすべて負け |
| 単目の段階配当 | 一つ、二つ、三つの一致で 1 倍、2 倍、3 倍 |
| 複数エリアへのベット | 一つのラウンドで複数種類に賭けられる |
| 残高制限 | 残高不足のベットは拒否される |

<a id="ja-program"></a>

## プログラム紹介

このプロジェクトは、意図的にプレーンな静的フロントエンドとして実装されています。`index.html` が CSS と JavaScript を順番に読み込み、各 JavaScript ファイルは公開 API を `window.SicBo` 名前空間へ登録します。ES Module を使わないため、`file://` で直接開いても安定して動作します。

| 設計方針 | 実装 |
|---|---|
| ビルド不要 | バンドラ、フレームワーク、パッケージ導入なし |
| オフラインデータ | 辞書とベット情報は JavaScript オブジェクト |
| モジュール分割 | CSS と JS を責務別フォルダへ分類 |
| ベット情報の一元化 | `js/core/bet-types-data.js` が表示と配当計算の元データ |
| 精算の一貫性 | UI と計算ロジックが同じベット定義を参照 |
| 保存機能 | `js/storage/save-manager.js` が LocalStorage を管理 |
| 多言語 | `js/i18n/lang-*.js` と `i18n-manager.js` |
| 音声 | `audio-manager.js` が Web Audio API で BGM/SFX を生成 |

### 起動順序

| 順序 | ブロック | 目的 |
|---:|---|---|
| 1 | `index.html` | 画面、ダイアログ、ボタン、コンテナを定義 |
| 2 | i18n scripts | 辞書と翻訳マネージャを読み込む |
| 3 | audio scripts | BGM、SFX、音声マネージャを読み込む |
| 4 | core scripts | ベット、配当、ダイス、ゲームエンジンを読み込む |
| 5 | UI scripts | 描画、モーダル、メニュー、アニメーションを読み込む |
| 6 | settings/storage | テーマ、設定、保存機能を適用 |
| 7 | `main.js` | `DOMContentLoaded` 後に全体を接続 |

<a id="ja-structure"></a>

## 構成分類

### ファイル構成

```text
Sic_Bo/
├─ index.html
├─ SicBo_spec.md
├─ README.md
├─ css/
│  ├─ base/
│  ├─ layout/
│  ├─ components/
│  ├─ themes/
│  └─ responsive/
├─ js/
│  ├─ core/
│  ├─ ui/
│  ├─ audio/
│  ├─ i18n/
│  ├─ settings/
│  └─ storage/
├─ tasks/
└─ Temp/
```

### CSS 分類

| 分類 | 役割 |
|---|---|
| `css/base` | Reset、トークン、基本タイポグラフィ |
| `css/layout` | メインメニュー、ゲーム画面、ヘッダー/フッター、ダイアログ |
| `css/components` | ボタン、ダイス、チップ、ベットテーブル、toast、switch/slider |
| `css/themes` | 五つのテーマ配色 |
| `css/responsive` | mobile、tablet、desktop のレスポンシブ規則 |

### JavaScript 分類

| 分類 | 主なファイル | 役割 |
|---|---|---|
| `js/core` | `game-engine.js`, `betting-logic.js`, `payout-calculator.js`, `dice-roller.js`, `bet-types-data.js` | ルール、ベット、ダイス、精算 |
| `js/ui` | `board-renderer.js`, `modal-controller.js`, `menu-controller.js`, `animation-controller.js` | 描画、ダイアログ、メニュー、アニメーション |
| `js/audio` | `audio-manager.js`, `bgm-playlist.js`, `sfx-map.js` | BGM と効果音 |
| `js/i18n` | `i18n-manager.js`, `lang-*.js` | 翻訳辞書と言語切替 |
| `js/settings` | `settings-manager.js`, `theme-manager.js` | ユーザー設定とテーマ |
| `js/storage` | `save-manager.js` | LocalStorage 保存 |

### 開発時チェック

| チェック | 方法 |
|---|---|
| JavaScript 構文 | JS ファイルに対して `node --check` を実行 |
| 静的制約 | `fetch()` と `type="module"` がないことを確認 |
| 手動スモークテスト | `index.html` を開き、1 ラウンド最後まで遊ぶ |
| レスポンシブ確認 | DevTools でデスクトップ、タブレット、スマホ幅を確認 |
| スクリーンショット証跡 | `Temp/` は画像ファイルのみ保持 |
