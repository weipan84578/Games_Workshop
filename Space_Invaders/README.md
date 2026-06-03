# Space Invaders - Retro Arcade Web Game

🌎 **Language Selector / 語言選擇 / 言語選擇**
* [English / 英文](#english-us)
* [日本語 / 日文](#japanese-jp)
* [繁體中文 / 中文](#traditional-chinese-tw)

---

<a id="english-us"></a>
# English (US)

## 📌 Table of Contents
* [1. File Categories / Directory Structure](#en-categories)
* [2. Code Explanations / Architectures](#en-code)
* [3. Game Instructions / Manual](#en-game)

---

<a id="en-categories"></a>
### 1. File Categories / Directory Structure
This project is built using vanilla HTML5, CSS3, and JavaScript, designed to run 100% offline. Double-click `index.html` to play instantly.

```
Space_Invaders/
├── index.html                   # Sole HTML entry point and viewport manager
├── css/                         # Stylesheet configurations
│   ├── reset.css                # Standardizes browser spacing & margin resets
│   ├── variables.css            # Centralizes variables for 5 interchangeable themes
│   ├── base.css                 # Implements glowing CRT scans & flicker overlays
│   ├── layout.css               # Enforces a perfect 4:5 aspect ratio
│   ├── menu.css                 # Pulsing animations & button click classes
│   ├── screens.css              # Custom range sliders, select menus & scrolls
│   ├── hud.css                  # Wave stats, scores, and health icon layout
│   ├── controls.css             # Fluid flexbox touch controls for mobile screens
│   └── responsive.css           # Grid adjustments for phone portrait & landscape
│
└── js/                          # Logic scripts
    ├── config.js                # Core constants (speeds, points, difficulty)
    ├── main.js                  # App bootstrap, window listeners & gesture locks
    ├── audio/
    │   └── audioManager.js      # Dyn-synthesized 8-bit Web Audio API (no audio assets)
    ├── core/
    │   ├── game.js              # Primary physics updates and AABB collider resolver
    │   ├── gameLoop.js          # RAF ticker with capped delta time triggers
    │   └── stateManager.js      # Screen transitions & persistent audio selectors
    ├── entities/
    │   ├── player.js            # Cannon positioning, cooldowns & explosion lines
    │   ├── bullet.js            # Directional bullet speed vectoring
    │   ├── invader.js           # 8x8, 11x8, 12x8 pixel rendering grids for aliens
    │   ├── invaderFleet.js      # Invader grid marching, acceleration & shoot loops
    │   ├── barrier.js           # Destructible bunker pixel blocks
    │   └── ufo.js               # Flying red saucer & floating scores popped
    ├── ui/
    │   ├── hud.js               # Binds state updates to HUD DOM nodes
    │   ├── menu.js              # Hooks Menu/Pause/Game Over button listeners
    │   ├── settings.js          # Directs dropdowns/sliders to variables
    │   └── help.js              # Alternates help manual page tabs
    └── utils/
        ├── helpers.js           # Math helpers, bounds collision & random selectors
        ├── input.js             # Maps keys & touch controllers to actions
        └── storage.js           # Read/writes settings & progress saves to localStorage
```

---

<a id="en-code"></a>
### 2. Code Explanations / Architectures
* **Web Audio Synthesis (`audioManager.js`)**: We bypass slow `.mp3` loading by using native Web Audio API oscillators. Laser tones are generated via square/sawtooth sweeps, and explosions are modeled by white noise combined with lowpass filtering.
* **Bunker Pixel Damage Grid (`barrier.js`)**: Barriers are composed of 6x9 sub-blocks of size 8x8. Bullets chew through individual pixels on contact, carving realistic tunnels through shields.
* **Accelerating Marching Tick (`invaderFleet.js`)**: Fleet movement mirrors the original arcade game by executing discrete grid steps. The step rate ramps from `0.9` seconds down to `0.05` seconds as aliens are defeated.

---

<a id="en-game"></a>
### 3. Game Instructions / Manual
* **Controls**:
  - **Move Left**: `A` or `Left Arrow` (Desktop) / Left touchscreen button (Mobile)
  - **Move Right**: `D` or `Right Arrow` (Desktop) / Right touchscreen button (Mobile)
  - **Shoot**: `Space` (Desktop) / Red `FIRE` touchscreen button (Mobile)
  - **Pause**: `Esc` or `P` (Desktop) / `PAUSE` button (HUD)
* **Scoring Rules**:
  - Octopus (Top Row): **30 points**
  - Crab (Middle Rows): **20 points**
  - Squid (Bottom Rows): **10 points**
  - UFO (Flying Saucer): **50 to 300 points** (Random)
  - *Extra Life*: Earned every **10,000 points**.
* **Auto Save**: Game progress (level, score, lives, and layout) is cached automatically when you pause or clear a wave, and can be resumed from the main menu.

---

<hr/>

<a id="japanese-jp"></a>
# 日本語 (Japanese)

## 📌 目次
* [1. フォルダ構成 / プログラム分類](#jp-categories)
* [2. アーキテクチャ概要 / プログラム説明](#jp-code)
* [3. プレイマニュアル / ゲーム説明](#jp-game)

---

<a id="jp-categories"></a>
### 1. フォルダ構成 / プログラム分類
本プロジェクトは、HTML5、CSS3、およびバニラJavaScriptで実装された、サーバー不要のWebゲームです。`index.html`をダブルクリックするだけで即座にプレイ可能です。

```
Space_Invaders/
├── index.html                   # HTML エントリーポイント
├── css/                         # スタイルシート設定
│   ├── reset.css                # ブラウザの初期スタイルをリセット
│   ├── variables.css            # 5つのテーマカラーと共通のCSS変数を定義
│   ├── base.css                 # 画面のCRT走査線エフェクトとフリッカーアニメーション
│   ├── layout.css               # アスペクト比 4:5 制限によるスケーリング
│   ├── menu.css                 # メインメニューおよびボタンのホバー・クリック効果
│   ├── screens.css              # 設定画面スライダー、セレクトボックス、スクロールエリア
│   ├── hud.css                  # ウェーブ数、スコア、自機数表示
│   ├── controls.css             # 仮想コントローラーフレックスボックス
│   └── responsive.css           # モバイルの縦画面・横画面対応メディアクエリ
│
└── js/                          # 制御スクリプト
    ├── config.js                # ゲーム定数（移動速度、スコア、難易度設定など）
    ├── main.js                  # アプリ初期化、ジェスチャーロック解除、ブートストラッパー
    ├── audio/
    │   └── audioManager.js      # Web Audio API 8-bit シンセサイザー（外部音楽ファイル不要）
    ├── core/
    │   ├── game.js              # ゲームの物理シミュレーションと衝突判定の解決
    │   ├── gameLoop.js          # requestAnimationFrameによる描画更新処理
    │   └── stateManager.js      # 画面遷移およびBGMの自動切り替え制御
    ├── entities/
    │   ├── player.js            # 自機タンクの移動、クールダウン、被彈被撃被爆エフェクト
    │   ├── bullet.js            # 発射弾のベクトル移動制御
    │   ├── invader.js           # インベーダーの 8-bit ピクセル描画グリッド
    │   ├── invaderFleet.js      # インベーダー軍団の移動、速度上昇、射撃周期制御
    │   ├── barrier.js           # 防御碉堡（バンカー）のピクセルグリッド物理
    │   └── ufo.js               # UFOの飛来および撃破時スコアポップアップ
    ├── ui/
    │   ├── hud.js               # ゲーム状態をDOM HUDパーツに反映
    │   ├── menu.js              # スタートメニュー、一時停止、ゲームオーバーのバインド
    │   ├── settings.js          # 設定の適用・保存
    │   └── help.js              # 説明画面のタブ切り替えバインド
    └── utils/
        ├── helpers.js           # 衝突判定、乱数生成などのヘルパー関数
        ├── input.js             # キーボード入力と仮想ボタンの統合管理
        └── storage.js           # 設定や進行状況の localStorage 保存
```

---

<a id="jp-code"></a>
### 2. アーキテクチャ概要 / プログラム説明
* **8-bit 音声合成 (`audioManager.js`)**: 音声ファイルの読み込みエラーを防ぐため、Web Audio APIの発振器 (Oscillator) を用いてリアルタイムに波形を生成しています。レーザー音は周波数の下降スイープ、爆発音はホワイトノイズと低通フィルタの組み合わせで再現しています。
* **バンカーの破損物理 (`barrier.js`)**: 碉堡は 6x9 個の 8px 四方の小さなブロックで構成されています。弾が接触した箇所のブロックのみが消滅し、盾の内部に徐々に穴やトンネルが掘られていくような効果を再現しています。
* **加速度的歩進システム (`invaderFleet.js`)**: 原作アーケードの仕様を踏襲し、インベーダーの移動は一定時間ごとの「コマ送り（歩進）」で動きます。残り数が少なくなると、更新間隔が `0.9秒` から最短 `0.05秒` まで縮まり、緊張感ある超高速移動へとシフトします。

---

<a id="jp-game"></a>
### 3. プレイマニュアル / ゲーム説明
* **操作方法**:
  - **左へ移動**: キーボード `A` / `←` または 画面左側の矢印ボタン
  - **右へ移動**: キーボード `D` / `→` または 画面中央右寄りの矢印ボタン
  - **射撃**: キーボード `Space` または 画面右側の赤い `FIRE` ボタン
  - **一時停止**: キーボード `Esc` / `P` または 画面右上HUDの `PAUSE` ボタン
* **スコア配分**:
  - 最上段 (タコ): **30点**
  - 中段 (カニ): **20点**
  - 下段 (イカ): **10点**
  - UFO (飛来UFO): **50〜300点** (ランダム)
  - *エクストラライフ*: **10,000点** に到達するごとに自機が1機追加されます。
* **オートセーブ**: ゲームの一時停止時、またはステージクリア時に自動的に進捗状況が保存され、メインメニューから「再開」することができます。

---

<hr/>

<a id="traditional-chinese-tw"></a>
# 繁體中文 (Traditional Chinese)

## 📌 目錄
* [1. 專案結構 / 程式分類](#tw-categories)
* [2. 架構設計 / 程式說明](#tw-code)
* [3. 遊玩指南 / 遊戲說明](#tw-game)

---

<a id="tw-categories"></a>
### 1. 專案結構 / 程式分類
本專案為無伺服器相依的純前端網頁遊戲。雙擊 `index.html` 即可直接在瀏覽器中開啟遊玩。

```
Space_Invaders/
├── index.html                   # 唯一的 HTML 入口點與視口控制器
├── css/                         # 樣式表檔案
│   ├── reset.css                # 重置瀏覽器預設邊距與樣式
│   ├── variables.css            # 定義 5 種色彩主題與全局 CSS 變數
│   ├── base.css                 # 復古 CRT 螢幕掃描線、微光閃爍動畫效果
│   ├── layout.css               # 控制 4:5 縱橫比與畫布容器居中縮放
│   ├── menu.css                 # 主選單標題動畫與按鈕 hover/click 樣式
│   ├── screens.css              # 設定選單滑軌、下拉選單、內部捲軸
│   ├── hud.css                  # HUD 分數、波次、生命圖示佈局
│   ├── controls.css             # 行動裝置虛擬搖桿與按鈕樣式
│   └── responsive.css           # 適配手機直向與橫向的媒體查詢
│
└── js/                          # 遊戲邏輯腳本
    ├── config.js                # 全局常數定義（難度設定、速度、分數對照）
    ├── main.js                  # DOM 載入引導、音訊解鎖監聽與主程式啟動
    ├── audio/
    │   └── audioManager.js      # Web Audio API 8-bit 音效合成器（無外部音訊檔）
    ├── core/
    │   ├── game.js              # 主控制邏輯：碰撞偵測、波次升級與存檔控制
    │   ├── gameLoop.js          # requestAnimationFrame 循環與 Delta Time 鎖定
    │   └── stateManager.js      # 控制畫面選單切換及音樂流暢連播
    ├── entities/
    │   ├── player.js            # 控制玩家砲台、射擊冷卻與爆炸粒子線條
    │   ├── bullet.js            # 砲彈實體移動與越界回收
    │   ├── invader.js           # 侵略者章魚/螃蟹/水母形狀的像素點陣矩陣
    │   ├── invaderFleet.js      # 侵略者陣列步進、整體反彈下降與加速機制
    │   ├── barrier.js           # 可被雷射精準破壞損毀的防守碉堡（防禦工程）
    │   └── ufo.js               # 神秘加分紅色飛碟與分數彈出效果
    ├── ui/
    │   ├── hud.js               # 同步更新 HUD 區塊的數值與圖示
    │   ├── menu.js              # 綁定選單、暫停選單、結束畫面的點擊邏輯
    │   ├── settings.js          # 綁定音量選單與數值持久化
    │   └── help.js              # 綁定說明書分頁切換
    └── utils/
        ├── helpers.js           # 工具函式（AABB 碰撞判定、夾值、亂數選擇）
        ├── input.js             # 整合鍵盤與觸控事件
        └── storage.js           # localStorage 存檔與偏好讀寫
```

---

<a id="tw-code"></a>
### 2. 架構設計 / 程式說明
* **Web Audio 8-bit 合成器 (`audioManager.js`)**：本專案採用瀏覽器原生的 Web Audio API，不外連或下載任何外部音訊檔，完全透過程式碼即時合成波形音調。雷射聲以鋸齒波進行頻率掃描，爆炸聲則採用白噪音搭配低通濾波衰減，還原最純粹的 retro 卡帶音質。
* **碉堡破損物理 (`barrier.js`)**：四座碉堡由 6x9 個 8x8px 的微粒方塊構成。當子彈（不論敵我）與碉堡發生碰撞時，只會破壞單個微粒 block，這能讓子彈在碉堡中穿孔，甚至讓玩家利用「防空隧道」技巧躲在碉堡後面放冷槍。
* **外星人隊伍加速移動 (`invaderFleet.js`)**：遵循街機版經典行為，外星人隊伍並非平滑移動，而是分步「踏步移動」。隨剩餘外星人變少，移動更新週期將從最初的 `0.9秒` 加速收縮至最快 `0.05秒`，步伐節拍音響也會急劇加快，烘托刺激的結尾氣氛。

---

<a id="tw-game"></a>
### 3. 遊玩指南 / 遊戲說明
* **操作方式**：
  - **向左移動**：鍵盤 `A` / `←` 或 螢幕左下方 `←` 虛擬按鍵
  - **向右移動**：鍵盤 `D` / `→` 或 螢幕左下方 `→` 虛擬按鍵
  - **射擊**：鍵盤 `Space` 或 螢幕右下方紅色 `FIRE` 虛擬按鍵
  - **暫停/離開**：鍵盤 `Esc` / `P` 或 螢幕右上角 HUD 中 `PAUSE` 按鈕
* **得分規則**：
  - 頂層 (🐙 章魚)：**30 分**
  - 中層 (🦀 螃蟹)：**20 分**
  - 底層 (🦑 水母)：**10 分**
  - 神秘 UFO (🛸 紅色飛碟)：**50、100、150、300 分**（隨機出現）
  - *額外生命*：得分每累計增加 **10,000分**，總部即會增援一台全新戰車。
* **進度儲存**：每當關卡過關或玩家在遊戲中暫停時，系統會自動在本地緩存存檔。下次開啟遊戲時，可於主選單直接點選「繼續遊戲」無縫重返先前波次！
