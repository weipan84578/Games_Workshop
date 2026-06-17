# 🥚 Virtual Pet / 電子寵物養成遊戲 / バーチャルペット育成ゲーム

一款可直接用瀏覽器開啟的 Web 電子寵物養成遊戲。玩家先選擇一顆未知的蛋，透過照顧、孵化、成長、收集圖鑑，陪伴 50 種不同寵物走過完整生命週期。

A browser-ready virtual pet raising game. Choose an unknown egg, hatch it, care for it through life stages, and collect 50 possible pets in the encyclopedia.

ブラウザで直接開ける電子ペット育成ゲームです。未知のたまごを選び、孵化させ、成長を見守り、50種類のペットを図鑑に集めます。

---

## ⚡ Quick Navigation / 快速導覽 / クイックナビ

| Language | Game | Program | Files |
|---|---|---|---|
| 繁體中文 | [🎮 遊戲介紹](#-遊戲介紹中文) / [🕹️ 遊戲玩法](#️-遊戲玩法中文) | [🧩 程式介紹](#-程式介紹中文) | [📁 程式分類](#-程式分類中文) |
| English | [🎮 Game Overview](#-game-overview-english) / [🕹️ How To Play](#️-how-to-play-english) | [🧩 Program Overview](#-program-overview-english) | [📁 Code Organization](#-code-organization-english) |
| 日本語 | [🎮 ゲーム紹介](#-ゲーム紹介日本語) / [🕹️ 遊び方](#️-遊び方日本語) | [🧩 プログラム紹介](#-プログラム紹介日本語) | [📁 コード分類](#-コード分類日本語) |

## 🚀 Start / 啟動 / 起動

| Item | Description |
|---|---|
| Entry | `index.html` |
| Runtime | Browser only |
| Install | None |
| Build | None |
| Server | Not required |
| Module | No ES Module |
| Fetch | No `fetch()` |
| Save | `localStorage` |
| Audio | Web Audio API |

Open `index.html` directly in a browser. No `npm install`, no bundler, no local server, and no external CDN are required.

---

# 繁體中文

## 🎮 遊戲介紹（中文）

`Virtual Pet` 是一款純 Web 電子寵物養成遊戲。玩家從選蛋開始，不知道蛋裡會孵出什麼。孵化後，寵物會依照照顧方式與時間流逝逐步成長，最後進入老年期並自然結束生命。成功養到老年期的寵物會解鎖到圖鑑。

### 核心特色

| 圖示 | 系統 | 說明 |
|---|---|---|
| 🥚 | 選蛋 | 新遊戲先選 1 顆蛋，孵化前不知道結果 |
| 🎲 | 隨機孵化 | 依蛋的類型從候選池中隨機孵出寵物 |
| 🐉 | 50 種寵物 | 包含龍、魚、貓、狗、牛、鳥、兔、狐、龜、獨角獸 |
| 🌱 | 5 階段成長 | 蛋 → 幼年期 → 成熟期 → 壯年期 → 老年期 |
| ▦ | 圖鑑收集 | 成功養到老年期會解鎖圖鑑項目 |
| ⚙️ | 設定 | 語言、主題、音量、減少動畫、文字大小 |
| 💾 | 自動存檔 | 使用 `localStorage` 保存遊戲與圖鑑進度 |

## 🕹️ 遊戲玩法（中文）

### 基本流程

| 步驟 | 玩家行為 | 遊戲結果 |
|---|---|---|
| 1 | 點選「開始遊戲」 | 進入選蛋畫面 |
| 2 | 選擇蛋 | 建立新存檔，寵物種類先保持未知 |
| 3 | 蛋期照顧 | 只能「加熱」與「摸摸」 |
| 4 | 孵化 | 隨機決定寵物種類並顯示外觀 |
| 5 | 成長照顧 | 餵食、玩耍、清潔、睡覺，成熟期後可訓練 |
| 6 | 進入老年期 | 圖鑑記錄為成功養成 |
| 7 | 生命結束 | 健康歸零後死亡，需要重新開始新一輪 |

### 寵物狀態

| 狀態 | 代表意義 | 影響 |
|---|---|---|
| 🍙 飽足 | 是否吃飽 | 太低會影響健康 |
| 😊 心情 | 寵物開心程度 | 影響表情與照顧節奏 |
| ✨ 清潔 | 身體乾淨程度 | 太低會慢慢扣健康 |
| ⚡ 體力 | 活動能力 | 玩耍、訓練會消耗 |
| ❤ 健康 | 生命狀態 | 歸零後死亡 |

### 照顧動作

| 動作 | 可用階段 | 效果 | 代價 |
|---|---|---|---|
| 🔥 加熱 | 蛋 | 推進孵化、提升體力與健康 | 無 |
| 🤍 摸摸 | 全階段 | 提升心情與少量健康 | 無 |
| 🍙 餵食 | 幼年期以後 | 提升飽足 | 無 |
| 🎾 玩耍 | 幼年期以後 | 大幅提升心情 | 消耗體力、清潔、飽足 |
| 🫧 清潔 | 幼年期以後 | 大幅提升清潔 | 無 |
| 🌙 睡覺 | 幼年期以後 | 大幅恢復體力 | 短暫進入睡眠狀態 |
| ⭐ 訓練 | 成熟期以後 | 快速增加成長值 | 消耗較多體力與飽足 |

### 成長階段

| 階段 | 解鎖條件 | 特性 |
|---|---|---|
| 🥚 蛋 | 新遊戲開始 | 只能加熱與摸摸，孵化前未知 |
| 🌱 幼年期 | 從蛋孵化 | 體力消耗慢，可以多互動 |
| ⭐ 成熟期 | 持續照顧後 | 能力平均，解鎖訓練 |
| 🏅 壯年期 | 進一步成長 | 照顧節奏變重要 |
| 🍂 老年期 | 成功養成 | 開始自然扣健康，最後死亡 |

### 圖鑑規則

| 條件 | 結果 |
|---|---|
| 孵化成功 | 圖鑑會記錄曾看過該寵物 |
| 養到老年期 | 圖鑑正式解鎖該寵物 |
| 寵物死亡 | 會保留圖鑑紀錄 |
| 開新遊戲 | 圖鑑不會被清空 |

## 🧩 程式介紹（中文）

本專案是純前端靜態網頁遊戲，不依賴框架、模組系統或伺服器。所有畫面都在 `index.html` 中，CSS 和 JavaScript 以一般 `<link>` / `<script>` 載入，因此可用 `file://` 直接開啟。

### 技術摘要

| 類別 | 使用技術 | 說明 |
|---|---|---|
| HTML | HTML5 | 單頁式畫面結構 |
| CSS | CSS3 | Variables、Grid、Flexbox、Media Queries |
| JavaScript | Vanilla JS | 不使用 React/Vue、不使用 ES Module |
| 存檔 | `localStorage` | 保存遊戲、設定、圖鑑 |
| 音效 | Web Audio API | 合成 BGM 與 SFX，不依賴音訊檔 |
| 語系 | 自製 i18n | 繁中、英文、日文 |
| RWD | CSS Media Query | 手機、平板、桌機版面 |

### 重要資料流

| 流程 | 負責模組 |
|---|---|
| App 啟動 | `js/core/app.js` |
| 畫面切換 | `js/core/sceneManager.js` |
| 遊戲狀態 | `js/core/gameState.js` |
| 存檔讀寫 | `js/core/saveManager.js` |
| 寵物資料 | `js/pet/petCatalog.js` |
| 成長模型 | `js/pet/petModel.js` |
| 動作效果 | `js/pet/petActions.js` |
| 寵物動畫 | `js/pet/petAnimation.js` |
| UI 畫面 | `js/ui/*.js` |

## 📁 程式分類（中文）

| 路徑 | 分類 | 說明 |
|---|---|---|
| `index.html` | 入口 | 所有畫面 DOM 與 script/css 載入順序 |
| `css/base/` | 基礎樣式 | reset、變數、字體 |
| `css/themes/` | 主題 | Candy、Ocean、Forest、Night、Sunset |
| `css/layout/` | 畫面版面 | 主選單、遊戲、選蛋、圖鑑、說明、設定 |
| `css/components/` | 元件樣式 | 按鈕、狀態條、寵物舞台、彈窗、toast |
| `css/responsive/` | RWD | mobile、tablet、desktop 斷點 |
| `js/core/` | 核心控制 | App、狀態、存檔、畫面切換 |
| `js/pet/` | 寵物系統 | 50 種寵物資料、動作、階段、動畫 |
| `js/audio/` | 音訊 | BGM playlist、SFX library、AudioManager |
| `js/i18n/` | 語系 | 繁中、英文、日文與文字套用 |
| `js/ui/` | UI 控制 | 主選單、選蛋、遊戲、圖鑑、說明、設定 |
| `js/utils/` | 工具 | DOM helper、EventBus、時間格式 |
| `assets/` | 資產 | SVG 背景與 favicon |

### localStorage Keys

| Key | 用途 |
|---|---|
| `vp_save` | 目前寵物存檔 |
| `vp_settings` | 音量、輔助設定等 |
| `vp_lang` | 語言 |
| `vp_theme` | 主題 |
| `vp_collection` | 圖鑑收集狀態 |

---

# English

## 🎮 Game Overview (English)

`Virtual Pet` is a static browser game about raising an unknown creature from an egg. The pet is randomized when it hatches, grows through five life stages, and can be recorded in the encyclopedia after successful raising.

### Main Features

| Icon | Feature | Description |
|---|---|---|
| 🥚 | Egg Selection | Start by choosing one mystery egg |
| 🎲 | Random Hatch | The pet species is decided when the egg hatches |
| 🐉 | 50 Pets | Dragons, fish, cats, dogs, cows, birds, rabbits, foxes, turtles, unicorns |
| 🌱 | 5 Life Stages | Egg → Juvenile → Mature → Prime → Elder |
| ▦ | Encyclopedia | Pets unlock after being raised to elder age |
| ⚙️ | Settings | Language, theme, audio, reduced motion, text size |
| 💾 | Autosave | Saves progress with `localStorage` |

## 🕹️ How To Play (English)

### Game Loop

| Step | Action | Result |
|---|---|---|
| 1 | Click New Game | Go to egg selection |
| 2 | Choose an egg | Start a hidden pet run |
| 3 | Care for the egg | Only Warm and Pet are available |
| 4 | Hatch | The pet species is revealed |
| 5 | Raise the pet | Feed, play, clean, sleep, and later train |
| 6 | Reach elder age | Unlock the pet in the encyclopedia |
| 7 | Natural death | Health reaches zero, then start again |

### Stats

| Stat | Meaning | Effect |
|---|---|---|
| 🍙 Fullness | Hunger level | Low value hurts health |
| 😊 Mood | Happiness | Affects expression and rhythm |
| ✨ Clean | Hygiene | Low value hurts health |
| ⚡ Energy | Stamina | Spent by play and training |
| ❤ Health | Life condition | Zero means death |

### Actions

| Action | Available | Effect | Cost |
|---|---|---|---|
| 🔥 Warm | Egg | Moves hatching forward | None |
| 🤍 Pet | All stages | Raises mood and slight health | None |
| 🍙 Feed | After hatch | Raises fullness | None |
| 🎾 Play | After hatch | Raises mood | Energy, clean, fullness |
| 🫧 Clean | After hatch | Raises clean | None |
| 🌙 Sleep | After hatch | Restores energy | Temporary sleep |
| ⭐ Train | Mature and later | Faster growth | More energy and fullness |

### Life Stages

| Stage | Unlock | Trait |
|---|---|---|
| 🥚 Egg | New game | Hidden species, limited actions |
| 🌱 Juvenile | Hatch | Energy drains slowly |
| ⭐ Mature | Care progress | Balanced phase, training unlocks |
| 🏅 Prime | Further growth | Stable but care timing matters |
| 🍂 Elder | Successful raising | Health naturally starts falling |

## 🧩 Program Overview (English)

This project is a pure static frontend game. It does not use React, Vue, build tools, ES modules, `fetch()`, or an external server. Everything is loaded from `index.html` through ordinary CSS and JavaScript files.

### Technical Summary

| Area | Technology | Purpose |
|---|---|---|
| Markup | HTML5 | Single-page DOM structure |
| Style | CSS3 | Variables, Grid, Flexbox, responsive layout |
| Logic | Vanilla JavaScript | Game systems and UI control |
| Save | `localStorage` | Save, settings, encyclopedia |
| Audio | Web Audio API | Synthesized BGM and SFX |
| i18n | Custom dictionary | Traditional Chinese, English, Japanese |
| Responsive | Media queries | Mobile, tablet, desktop |

## 📁 Code Organization (English)

| Path | Category | Purpose |
|---|---|---|
| `index.html` | Entry | DOM and loading order |
| `css/base/` | Base | Reset, variables, typography |
| `css/themes/` | Theme | Five visual themes |
| `css/layout/` | Layout | Screen-level styles |
| `css/components/` | Components | Buttons, bars, pet stage, modal |
| `css/responsive/` | RWD | Breakpoint-specific rules |
| `js/core/` | Core | App, state, save, scene management |
| `js/pet/` | Pet | Catalog, actions, growth, animation |
| `js/audio/` | Audio | BGM, SFX, Web Audio manager |
| `js/i18n/` | Language | Dictionaries and text replacement |
| `js/ui/` | UI | Screen controllers |
| `js/utils/` | Utility | DOM, event bus, time helpers |
| `assets/` | Assets | SVG images and favicon |

---

# 日本語

## 🎮 ゲーム紹介（日本語）

`Virtual Pet` は、未知のたまごからペットを育てる静的 Web ゲームです。たまごの中身は孵化するまで分からず、孵化後はお世話をしながら5段階の成長を見守ります。老年期まで育てると図鑑に登録されます。

### 主な特徴

| アイコン | 機能 | 説明 |
|---|---|---|
| 🥚 | たまご選択 | 新しいゲームはたまご選択から始まります |
| 🎲 | ランダム孵化 | 孵化時にペット種が決まります |
| 🐉 | 50種類 | ドラゴン、魚、猫、犬、牛、鳥、うさぎ、狐、亀、ユニコーン |
| 🌱 | 5段階成長 | たまご → 幼年期 → 成熟期 → 壮年期 → 老年期 |
| ▦ | 図鑑 | 老年期まで育てたペットを解放 |
| ⚙️ | 設定 | 言語、テーマ、音量、動きを減らす、文字サイズ |
| 💾 | 自動保存 | `localStorage` に進行状況を保存 |

## 🕹️ 遊び方（日本語）

### 基本の流れ

| 手順 | 操作 | 結果 |
|---|---|---|
| 1 | 「はじめる」を押す | たまご選択へ進む |
| 2 | たまごを選ぶ | 正体不明のペット育成が始まる |
| 3 | たまご期のお世話 | あたためる、なでるのみ |
| 4 | 孵化 | ペットの種類が判明 |
| 5 | 育成 | ごはん、あそぶ、そうじ、ねむる、トレーニング |
| 6 | 老年期へ到達 | 図鑑に解放 |
| 7 | 一生を終える | 健康が0になり、新しい育成へ |

### 状態

| 状態 | 意味 | 影響 |
|---|---|---|
| 🍙 満腹 | おなかの状態 | 低いと健康に影響 |
| 😊 気分 | ペットの気持ち | 表情や育成リズムに影響 |
| ✨ 清潔 | きれいさ | 低いと健康が下がる |
| ⚡ 体力 | 活動できる力 | あそぶ、トレーニングで消費 |
| ❤ 健康 | 生命状態 | 0になると死亡 |

### お世話アクション

| アクション | 使用可能 | 効果 | コスト |
|---|---|---|---|
| 🔥 あたためる | たまご | 孵化を進める | なし |
| 🤍 なでる | 全段階 | 気分と少量の健康を上げる | なし |
| 🍙 ごはん | 孵化後 | 満腹を上げる | なし |
| 🎾 あそぶ | 孵化後 | 気分を大きく上げる | 体力、清潔、満腹 |
| 🫧 そうじ | 孵化後 | 清潔を上げる | なし |
| 🌙 ねむる | 孵化後 | 体力を回復 | 一時的に睡眠 |
| ⭐ トレーニング | 成熟期以降 | 成長を早める | 体力と満腹 |

### 成長段階

| 段階 | 条件 | 特徴 |
|---|---|---|
| 🥚 たまご | 新規ゲーム | 正体不明、行動制限あり |
| 🌱 幼年期 | 孵化後 | 体力が減りにくい |
| ⭐ 成熟期 | 育成進行 | バランスがよく、トレーニング解放 |
| 🏅 壮年期 | さらに成長 | 安定しているが、お世話のタイミングが重要 |
| 🍂 老年期 | 育成成功 | 健康が自然に下がり始める |

## 🧩 プログラム紹介（日本語）

このプロジェクトは純粋な静的フロントエンドです。React、Vue、ビルドツール、ES Module、`fetch()`、サーバーを使用せず、`index.html` から通常の CSS と JavaScript を読み込みます。

### 技術概要

| 分類 | 技術 | 役割 |
|---|---|---|
| HTML | HTML5 | 画面構造 |
| CSS | CSS3 | 変数、Grid、Flexbox、レスポンシブ |
| JS | Vanilla JavaScript | ゲームロジックと UI |
| 保存 | `localStorage` | セーブ、設定、図鑑 |
| 音 | Web Audio API | BGM / SFX 合成 |
| 言語 | 独自 i18n | 繁体中文、English、日本語 |
| RWD | Media Query | モバイル、タブレット、デスクトップ |

## 📁 コード分類（日本語）

| パス | 分類 | 内容 |
|---|---|---|
| `index.html` | 入口 | DOM と読み込み順 |
| `css/base/` | 基本 | reset、変数、文字 |
| `css/themes/` | テーマ | 5種類のテーマ |
| `css/layout/` | レイアウト | 各画面の配置 |
| `css/components/` | 部品 | ボタン、ステータス、ペット舞台など |
| `css/responsive/` | RWD | 画面幅ごとの調整 |
| `js/core/` | 中核 | App、状態、保存、画面切替 |
| `js/pet/` | ペット | 図鑑、行動、成長、アニメーション |
| `js/audio/` | 音 | BGM、SFX、AudioManager |
| `js/i18n/` | 言語 | 翻訳辞書 |
| `js/ui/` | UI | 各画面の操作 |
| `js/utils/` | 補助 | DOM、イベント、時間処理 |
| `assets/` | 素材 | SVG 背景と favicon |

---

## ✅ Verification / 驗證 / 検証

Useful checks during development:

```powershell
Get-ChildItem -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

```powershell
rg 'type="module"|fetch\(|https?://|import |export ' -n index.html js css README.md
```

The implementation is designed to keep the game playable from the local filesystem with no build step.
