# Space Invaders — Retro Arcade Web Game

> Classic arcade reimagined in pure HTML5 · Canvas · Vanilla JS — no install, no server, just open and play.

---

## Language / 言語 / 語言

| | |
|---|---|
| [English](#english) | Jump to English section |
| [日本語](#japanese) | 日本語セクションへ |
| [繁體中文](#traditional-chinese) | 跳至繁體中文區段 |

---

<a id="english"></a>
# English

### Quick Navigation
| Section | Description |
|---|---|
| [Quick Start](#en-quickstart) | How to launch the game |
| [File Structure](#en-structure) | Directory & file overview |
| [Code Architecture](#en-arch) | Module-by-module breakdown |
| [Game Manual](#en-manual) | Controls, scoring & mechanics |

---

<a id="en-quickstart"></a>
## Quick Start

> **Zero dependencies.** No Node.js, no build step, no server required.

1. Download or clone this repository.
2. Double-click `index.html`.
3. The game opens directly in your browser — click anywhere to unlock audio, then press **New Game**.

**Compatibility**: Any modern desktop or mobile browser (Chrome, Firefox, Edge, Safari).

---

<a id="en-structure"></a>
## File Structure

```
Space_Invaders/
├── index.html              # Sole entry point — loads all CSS & JS, declares DOM containers
│
├── css/
│   ├── reset.css           # Browser default style normalization
│   ├── variables.css       # CSS custom properties: 5 color themes, font scale, spacing
│   ├── base.css            # Global font, CRT scanline & flicker overlay effects
│   ├── layout.css          # Canvas container, 4:5 aspect-ratio centering & scaling
│   ├── menu.css            # Title pulse animation, retro button hover/active states
│   ├── screens.css         # Settings sliders, dropdowns, help scroll areas, overlays
│   ├── hud.css             # Score, hi-score, wave counter & life icon layout
│   ├── controls.css        # Mobile virtual D-pad & fire button (flexbox)
│   └── responsive.css      # Media queries for portrait, landscape & tablet breakpoints
│
└── js/
    ├── config.js           # Global constants: canvas size, difficulty params, entity specs
    ├── main.js             # Bootstrap: canvas setup, input init, state machine wiring,
    │                       #   audio unlock on first user gesture
    ├── core/
    │   ├── game.js         # Central controller: update loop, collision resolver, scoring,
    │   │                   #   wave progression, save/load, extra-life milestone
    │   ├── gameLoop.js     # requestAnimationFrame ticker with delta-time capping
    │   └── stateManager.js # 6-state FSM (MENU/PLAYING/PAUSED/SETTINGS/HELP/GAMEOVER),
    │                       #   screen visibility toggling, BGM routing
    ├── entities/
    │   ├── player.js       # Cannon movement, shoot cooldown, explosion animation
    │   ├── bullet.js       # Directional projectile with out-of-bounds recycling
    │   ├── invader.js      # Per-alien pixel-art rendering, points value, alive flag
    │   ├── invaderFleet.js # 5×11 grid march, wall-bounce descent, fire-rate scaling,
    │   │                   #   state save/load for Continue feature
    │   ├── barrier.js      # 6×9 destructible pixel block grid with bullet & overlap damage
    │   └── ufo.js          # Random-interval flying saucer, random score popup on kill
    ├── audio/
    │   └── audioManager.js # Web Audio API synthesizer (no external audio files),
    │                       #   cross-screen BGM continuity, crossfade, duck-on-pause
    ├── ui/
    │   ├── menu.js         # Main menu, pause overlay, game-over screen button bindings
    │   ├── settings.js     # Sliders/dropdowns → live apply + localStorage persist
    │   ├── help.js         # Basic/detailed help tab toggle
    │   └── hud.js          # Sync score, lives, wave values to HUD DOM nodes
    └── utils/
        ├── helpers.js      # AABB collision, clamp, random pick utilities
        ├── input.js        # Unified action map for keyboard + touch virtual buttons
        └── storage.js      # localStorage read/write for settings, save data, hi-score
```

---

<a id="en-arch"></a>
## Code Architecture

### Core Modules

| Module | Responsibility | Key Design Point |
|---|---|---|
| `config.js` | Single source of truth for all numeric constants | Edit here to tune gameplay without touching logic |
| `main.js` | App bootstrap and DI wiring | Audio context unlocked on first gesture (browser autoplay policy) |
| `core/game.js` | Physics update, AABB collision, scoring | Collision loops run per bullet each frame; extra life checked after every score add |
| `core/gameLoop.js` | RAF loop with delta-time cap | Delta capped at 100 ms to prevent spiral-of-death on tab blur |
| `core/stateManager.js` | 6-state FSM, screen visibility, audio routing | Single-page — no navigation; canvas/HUD hidden/shown via CSS class |

### Entity Modules

| Module | What it represents | Notable Mechanic |
|---|---|---|
| `entities/player.js` | Player cannon | 500 ms shoot cooldown; explosion freezes simulation until animation ends |
| `entities/bullet.js` | Laser projectile | `isPlayerOwned` flag distinguishes friendly vs. enemy bullets |
| `entities/invader.js` | Individual alien | Stores pixel-art grid (3 sprite variants by row) and points value |
| `entities/invaderFleet.js` | 5×11 alien army | Step interval shrinks from 0.9 s → 0.05 s as aliens are eliminated; entire state is serializable for save/load |
| `entities/barrier.js` | Destructible bunker | 6×9 boolean block grid; bullets destroy one block on contact; alien overlap crushes row |
| `entities/ufo.js` | Bonus flying saucer | Spawns every 15–30 s; awards 50/100/150/300 pts at random |

### Audio System

| Feature | Implementation |
|---|---|
| Sound source | Web Audio API oscillators — **no audio files needed** |
| BGM continuity | One `Audio` node per track; `playMusic()` skips restart if the same track is already playing |
| Screen transition | MENU / SETTINGS / HELP all share `menu-theme` (no restart on switch) |
| Pause behaviour | BGM volume ducked to 30 % — `currentTime` is never reset |
| Autoplay unlock | `audioManager.init()` called inside first `click`/`touchstart` listener |

### State Machine

```
[Load] ──► MENU ──────────────────────────────────────────►─┐
             │  │                                             │
          HELP  SETTINGS                                      │
             │  │                                             │
          (back to MENU)                                      │
             │                                                │
           (New / Continue)                                   │
             ▼                                                │
          PLAYING ──(Esc/P)──► PAUSED ──(Resume)──► PLAYING  │
             │                    │                           │
             │                (Save & Quit)                   │
             ▼                    ▼                           │
          GAMEOVER ◄──────────── MENU ◄──────────────────────┘
             │
          (Replay → PLAYING | Back → MENU)
```

### Color Themes

| Theme ID | Background | Foreground | Character |
|---|---|---|---|
| `classic-green` | `#000000` | `#00ff66` | Classic green phosphor |
| `amber` | `#1a0f00` | `#ffb000` | Vintage amber monitor |
| `neon-purple` | `#0d0221` | `#b388ff` | Neon-lit synthwave |
| `ocean-blue` | `#001018` | `#29b6f6` | Deep-sea blue |
| `high-contrast` | `#000000` | `#ffffff` | Accessibility mode |

---

<a id="en-manual"></a>
## Game Manual

### Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Move Left | `A` / `←` | Left `←` button |
| Move Right | `D` / `→` | Right `→` button |
| Shoot | `Space` | Red `FIRE` button |
| Pause / Resume | `Esc` / `P` | `PAUSE` in HUD |

### Scoring

| Target | Points |
|---|---|
| Top-row alien (Octopus) | 30 pts |
| Mid-row alien (Crab) | 20 pts |
| Bottom-row alien (Squid) | 10 pts |
| UFO (Mystery Saucer) | 50 / 100 / 150 / 300 pts (random) |
| Extra Life | Every **10,000 pts** |

### Difficulty

| Level | Lives | Alien Speed | Fire Rate |
|---|---|---|---|
| Easy | 4 | ×0.7 | Low |
| Normal | 3 | ×1.0 | Medium |
| Hard | 2 | ×1.4 | High |

### Game Mechanics

| Mechanic | Detail |
|---|---|
| Fleet acceleration | Step interval shortens as aliens are killed; last few aliens move at extreme speed |
| Wave progression | Each new wave adds ×1.1 speed; capped at ×2.5 |
| Barrier damage | Bullets carve individual pixel blocks; alien overlap crushes entire contact row |
| Auto-save | Progress saved on pause and wave clear; resume from main menu anytime |
| Win condition | Destroy all 55 aliens to advance to the next wave |
| Lose condition | Lives reach 0, or the alien fleet descends to the player's Y position |

### Settings Panel

| Setting | Options |
|---|---|
| BGM Volume | 0 – 100 slider |
| SFX Volume | 0 – 100 slider |
| Mute All | Toggle switch |
| Color Theme | 5 themes (live preview) |
| Difficulty | Easy / Normal / Hard |
| Reset Hi-Score | Clears localStorage record |

---

<a id="japanese"></a>
# 日本語

### 目次
| セクション | 内容 |
|---|---|
| [クイックスタート](#jp-quickstart) | 起動方法 |
| [ファイル構成](#jp-structure) | ディレクトリ・ファイル概要 |
| [アーキテクチャ解説](#jp-arch) | モジュール別詳細説明 |
| [プレイマニュアル](#jp-manual) | 操作・スコア・ゲーム仕様 |

---

<a id="jp-quickstart"></a>
## クイックスタート

> **インストール不要。** Node.js も ビルド も サーバー も 必要ありません。

1. リポジトリをダウンロード、またはクローンします。
2. `index.html` をダブルクリックします。
3. ブラウザでゲームが開きます。画面を一度クリックして音声をアンロックし、**開始遊戲（New Game）**を押してください。

**動作環境**: モダンなデスクトップ・モバイルブラウザ全般（Chrome / Firefox / Edge / Safari）。

---

<a id="jp-structure"></a>
## ファイル構成

```
Space_Invaders/
├── index.html              # 唯一の HTML エントリーポイント — CSS/JS 読み込み・DOM 宣言
│
├── css/
│   ├── reset.css           # ブラウザ初期スタイルの正規化
│   ├── variables.css       # CSS カスタムプロパティ：5 テーマ・フォントスケール・間隔
│   ├── base.css            # グローバルフォント・CRT 走査線・フリッカーオーバーレイ
│   ├── layout.css          # キャンバスコンテナ・4:5 アスペクト比センタリング
│   ├── menu.css            # タイトルパルスアニメ・レトロボタン hover/active
│   ├── screens.css         # 設定スライダー・ドロップダウン・ヘルプスクロール
│   ├── hud.css             # スコア・ハイスコア・ウェーブ・自機アイコン配置
│   ├── controls.css        # モバイル仮想 D-pad・FIRE ボタン（フレックスボックス）
│   └── responsive.css      # 縦向き・横向き・タブレット対応メディアクエリ
│
└── js/
    ├── config.js           # ゲーム全体の数値定数（速度・難易度・エンティティサイズ）
    ├── main.js             # 初期化・DI 結線・最初のジェスチャーによる音声アンロック
    ├── core/
    │   ├── game.js         # 物理更新・AABB 衝突解決・スコアリング・ウェーブ進行
    │   ├── gameLoop.js     # RAF ループ・デルタタイム上限（100 ms）
    │   └── stateManager.js # 6 状態 FSM・画面表示切替・BGM ルーティング
    ├── entities/
    │   ├── player.js       # 自機移動・射撃クールダウン・爆発アニメーション
    │   ├── bullet.js       # 方向付き弾体・画面外自動回収
    │   ├── invader.js      # ピクセルアート描画グリッド・得点値・生存フラグ
    │   ├── invaderFleet.js # 5×11 グリッド行進・壁バウンド下降・射撃周期制御・セーブ対応
    │   ├── barrier.js      # 6×9 破壊可能ピクセルブロックグリッド
    │   └── ufo.js          # ランダム間隔飛来 UFO・撃破時スコアポップアップ
    ├── audio/
    │   └── audioManager.js # Web Audio API シンセサイザー（外部音声ファイル不要）
    ├── ui/
    │   ├── menu.js         # メニュー・ポーズ・ゲームオーバー画面のバインド
    │   ├── settings.js     # スライダー/ドロップダウン → リアルタイム適用・localStorage 保存
    │   ├── help.js         # 基本/詳細ヘルプタブ切替
    │   └── hud.js          # スコア・自機数・ウェーブを HUD DOM に反映
    └── utils/
        ├── helpers.js      # AABB 衝突・クランプ・ランダム選択ユーティリティ
        ├── input.js        # キーボード + タッチ仮想ボタンの統合アクションマップ
        └── storage.js      # localStorage 読み書き（設定・セーブデータ・ハイスコア）
```

---

<a id="jp-arch"></a>
## アーキテクチャ解説

### コアモジュール

| モジュール | 担当 | 設計のポイント |
|---|---|---|
| `config.js` | 全数値定数の一元管理 | ここを変更するだけでゲームバランスを調整可能 |
| `main.js` | アプリ起動・DI 結線 | ブラウザ自動再生ポリシーに対応するため初回ジェスチャー後に音声初期化 |
| `core/game.js` | 物理更新・衝突・スコア | フレームごとに弾丸ループで AABB 判定；得点追加時に追加ライフをチェック |
| `core/gameLoop.js` | RAF ループ | デルタタイムを 100 ms で上限クランプしタブ非表示時の暴走を防止 |
| `core/stateManager.js` | 6 状態 FSM | ページ遷移なしの SPA；canvas/HUD は CSS クラスで表示/非表示を切替 |

### エンティティモジュール

| モジュール | 対象 | 注目仕様 |
|---|---|---|
| `entities/player.js` | 自機砲台 | 射撃クールダウン 500 ms；爆発アニメーション終了までシミュレーション停止 |
| `entities/bullet.js` | レーザー弾 | `isPlayerOwned` フラグで味方弾・敵弾を識別 |
| `entities/invader.js` | 個別エイリアン | 行ごとに異なる 3 種スプライト（8-bit ピクセルアート）と得点値を保持 |
| `entities/invaderFleet.js` | 5×11 エイリアン軍団 | 歩進間隔が 0.9 秒から最短 0.05 秒まで縮小；セーブ/ロード対応のシリアライズ機能付き |
| `entities/barrier.js` | 破壊可能バンカー | 6×9 ブール型ブロックグリッド；弾丸は 1 ブロック破壊，エイリアン接触で行ごと粉砕 |
| `entities/ufo.js` | ボーナス UFO | 15〜30 秒ランダムスポーン；撃破で 50/100/150/300 点をランダム付与 |

### 音声システム

| 機能 | 実装方法 |
|---|---|
| 音声ソース | Web Audio API オシレーター — **外部ファイル不要** |
| BGM 継続再生 | トラックごとに 1 つの Audio ノード；同一トラック再生中は再起動しない |
| 画面遷移時 | MENU / SETTINGS / HELP は `menu-theme` を共有（切替時に再生位置リセットなし） |
| ポーズ動作 | BGM ボリュームを 30 % にダック；`currentTime` はリセットしない |
| 自動再生アンロック | `audioManager.init()` を初回 `click`/`touchstart` リスナー内で呼び出し |

### 状態遷移図

```
[起動] ──► MENU ──────────────────────────────────────────►─┐
             │  │                                             │
           HELP  SETTINGS                                     │
             │  │                                             │
          （MENU へ戻る）                                      │
             │                                                │
         （New / Continue）                                   │
             ▼                                                │
          PLAYING ──(Esc/P)──► PAUSED ──(再開)──► PLAYING    │
             │                    │                           │
             │               (保存して終了)                    │
             ▼                    ▼                           │
          GAMEOVER ◄──────────── MENU ◄──────────────────────┘
             │
         （再挑戦 → PLAYING ｜ MENU へ戻る）
```

### カラーテーマ

| テーマ ID | 背景色 | 前景色 | イメージ |
|---|---|---|---|
| `classic-green` | `#000000` | `#00ff66` | クラシック緑リン光 |
| `amber` | `#1a0f00` | `#ffb000` | ヴィンテージ琥珀モニター |
| `neon-purple` | `#0d0221` | `#b388ff` | ネオンサイバーパンク |
| `ocean-blue` | `#001018` | `#29b6f6` | 深海ブルー |
| `high-contrast` | `#000000` | `#ffffff` | アクセシビリティモード |

---

<a id="jp-manual"></a>
## プレイマニュアル

### 操作方法

| 操作 | キーボード | モバイル |
|---|---|---|
| 左移動 | `A` / `←` | 左 `←` ボタン |
| 右移動 | `D` / `→` | 右 `→` ボタン |
| 射撃 | `Space` | 赤い `FIRE` ボタン |
| 一時停止 / 再開 | `Esc` / `P` | HUD 内 `PAUSE` ボタン |

### スコア配分

| 対象 | 得点 |
|---|---|
| 最上段エイリアン（タコ型） | 30 点 |
| 中段エイリアン（カニ型） | 20 点 |
| 下段エイリアン（イカ型） | 10 点 |
| UFO（ミステリーソーサー） | 50 / 100 / 150 / 300 点（ランダム） |
| エクストラライフ | **10,000 点** ごとに 1 機追加 |

### 難易度設定

| レベル | 自機数 | エイリアン速度 | 射撃頻度 |
|---|---|---|---|
| 簡単（Easy） | 4 機 | ×0.7 | 低 |
| 普通（Normal） | 3 機 | ×1.0 | 中 |
| 困難（Hard） | 2 機 | ×1.4 | 高 |

### ゲーム仕様

| 仕様 | 詳細 |
|---|---|
| 軍団加速 | エイリアン撃破ごとに歩進間隔が短縮；残り僅かになると超高速移動へ突入 |
| ウェーブ進行 | 次ウェーブごとに速度 ×1.1；上限 ×2.5 |
| バンカーダメージ | 弾丸でブロック単位破壊；エイリアン接触でその行が即消滅 |
| オートセーブ | ポーズ時・ウェーブクリア時に自動保存；メインメニューから「継続」で復帰 |
| クリア条件 | 全 55 体のエイリアンを撃破 → 次ウェーブへ |
| ゲームオーバー条件 | 自機ゼロ、またはエイリアン軍団が自機 Y 座標まで降下 |

### 設定パネル

| 設定項目 | オプション |
|---|---|
| BGM 音量 | 0〜100 スライダー |
| 効果音音量 | 0〜100 スライダー |
| 全消音 | トグルスイッチ |
| カラーテーマ | 5 種（即時プレビュー） |
| 難易度 | 簡単 / 普通 / 困難 |
| ハイスコアリセット | localStorage 記録を消去 |

---

<a id="traditional-chinese"></a>
# 繁體中文

### 快速導覽
| 區段 | 說明 |
|---|---|
| [快速開始](#tw-quickstart) | 如何啟動遊戲 |
| [檔案結構](#tw-structure) | 目錄與檔案總覽 |
| [架構解說](#tw-arch) | 各模組詳細說明 |
| [遊戲說明書](#tw-manual) | 操作、計分與機制 |

---

<a id="tw-quickstart"></a>
## 快速開始

> **零依賴。** 不需 Node.js、不需編譯、不需伺服器。

1. 下載或 clone 此 Repository。
2. 雙擊 `index.html`。
3. 遊戲直接在瀏覽器開啟 — 點擊畫面任意處解鎖音效，再按 **開始遊戲** 即可出發。

**相容性**：現代桌面與行動瀏覽器（Chrome / Firefox / Edge / Safari）皆支援。

---

<a id="tw-structure"></a>
## 檔案結構

```
Space_Invaders/
├── index.html              # 唯一 HTML 入口點 — 負責載入所有 CSS / JS，宣告 DOM 容器
│
├── css/
│   ├── reset.css           # 重置瀏覽器預設邊距與樣式
│   ├── variables.css       # CSS 自訂屬性：5 種配色主題、字級比例、間距基準
│   ├── base.css            # 全域字體、復古 CRT 掃描線與微光閃爍動畫效果
│   ├── layout.css          # Canvas 容器、4:5 縱橫比置中與等比縮放
│   ├── menu.css            # 標題脈動動畫、復古按鈕 hover / active 樣式
│   ├── screens.css         # 設定頁滑軌、下拉選單、說明頁捲軸、畫面覆蓋層
│   ├── hud.css             # 分數、最高分、波次計數器與生命圖示排版
│   ├── controls.css        # 行動裝置虛擬方向鍵與 FIRE 按鈕（Flexbox 佈局）
│   └── responsive.css      # 手機直向、橫向及平板的媒體查詢斷點
│
└── js/
    ├── config.js           # 全域常數：畫布尺寸、難度參數、實體規格
    ├── main.js             # 引導初始化：Canvas 設置、輸入初始化、狀態機接線、
    │                       #   首次使用者手勢觸發音訊解鎖
    ├── core/
    │   ├── game.js         # 核心控制器：物理更新、AABB 碰撞解析、計分、
    │   │                   #   波次推進、存檔/讀檔、額外生命里程碑
    │   ├── gameLoop.js     # RAF 主迴圈，Delta Time 上限 100 ms
    │   └── stateManager.js # 六狀態 FSM（MENU/PLAYING/PAUSED/SETTINGS/HELP/GAMEOVER）
    │                       #   畫面顯示切換、BGM 路由
    ├── entities/
    │   ├── player.js       # 砲台移動、射擊冷卻、爆炸動畫
    │   ├── bullet.js       # 方向性彈體，超出邊界自動回收
    │   ├── invader.js      # 像素藝術繪製網格、分數值、存活旗標
    │   ├── invaderFleet.js # 5×11 陣列行進、碰壁反彈下降、射速縮放、
    │   │                   #   狀態序列化供繼續遊戲功能使用
    │   ├── barrier.js      # 6×9 可破壞像素方塊網格，支援子彈與侵略者重疊傷害
    │   └── ufo.js          # 隨機間隔出現的飛碟，擊落時顯示隨機分數彈出效果
    ├── audio/
    │   └── audioManager.js # Web Audio API 合成器（無需外部音訊檔），
    │                       #   跨畫面 BGM 連播、淡入淡出、暫停壓音
    ├── ui/
    │   ├── menu.js         # 主選單、暫停覆蓋層、結束畫面的按鈕綁定
    │   ├── settings.js     # 滑軌/下拉選單 → 即時套用 + localStorage 持久化
    │   ├── help.js         # 基本/詳細說明分頁切換
    │   └── hud.js          # 將分數、生命、波次數值同步至 HUD DOM
    └── utils/
        ├── helpers.js      # AABB 碰撞、數值夾值、隨機選取等工具函式
        ├── input.js        # 鍵盤與觸控虛擬按鈕的統一動作映射
        └── storage.js      # localStorage 讀寫（設定、存檔資料、最高分）
```

---

<a id="tw-arch"></a>
## 架構解說

### 核心模組

| 模組 | 職責 | 關鍵設計點 |
|---|---|---|
| `config.js` | 所有數值常數的唯一來源 | 只需修改此處即可調整遊戲平衡，無需動邏輯層 |
| `main.js` | 應用程式引導與依賴注入接線 | 音訊 Context 在首次手勢事件後解鎖（符合瀏覽器自動播放政策） |
| `core/game.js` | 物理更新、AABB 碰撞、計分 | 每幀對每顆子彈執行碰撞迴圈；每次加分後即時檢查額外生命里程碑 |
| `core/gameLoop.js` | RAF 主迴圈 | Delta Time 上限 100 ms，防止分頁背景時的時間爆衝 |
| `core/stateManager.js` | 六狀態 FSM | 單頁應用，無頁面跳轉；Canvas / HUD 以 CSS class 控制顯隱 |

### 實體模組

| 模組 | 代表對象 | 特色機制 |
|---|---|---|
| `entities/player.js` | 玩家砲台 | 射擊冷卻 500 ms；爆炸動畫播完前整個物理模擬暫停 |
| `entities/bullet.js` | 雷射彈 | `isPlayerOwned` 旗標區分己方彈與敵方彈 |
| `entities/invader.js` | 個別外星人 | 每行對應三種 8-bit 像素藝術造型（章魚/螃蟹/水母），各有獨立分數值 |
| `entities/invaderFleet.js` | 5×11 外星陣列 | 步進間隔從 0.9 秒縮短至最快 0.05 秒；整個狀態可序列化供繼續遊戲使用 |
| `entities/barrier.js` | 可破壞碉堡 | 6×9 布林方塊網格；子彈破壞單塊，侵略者重疊則整行粉碎 |
| `entities/ufo.js` | 加分飛碟 | 每 15〜30 秒隨機出現；擊落可得 50/100/150/300 分（隨機） |

### 音訊系統

| 功能 | 實作方式 |
|---|---|
| 音源 | Web Audio API 振盪器 — **完全不需外部音訊檔** |
| BGM 連播 | 每首曲目一個 Audio 節點；`playMusic()` 判斷相同音軌則不重啟 |
| 畫面切換時 | MENU / SETTINGS / HELP 共用 `menu-theme`（切換不重置播放位置） |
| 暫停行為 | BGM 音量壓低至 30 %（ducking），`currentTime` 永不重置 |
| 自動播放解鎖 | `audioManager.init()` 在首次 `click`/`touchstart` 事件內呼叫 |

### 狀態機流程

```
[載入] ──► MENU ─────────────────────────────────────────►─┐
             │  │                                            │
           說明  設定                                         │
             │  │                                            │
          （返回主選單）                                       │
             │                                               │
         （開始/繼續）                                        │
             ▼                                               │
          PLAYING ──(Esc/P)──► PAUSED ──(恢復)──► PLAYING   │
             │                    │                          │
             │               (儲存並離開)                     │
             ▼                    ▼                          │
          GAMEOVER ◄──────────── MENU ◄─────────────────────┘
             │
         （再玩一次 → PLAYING ｜ 返回主選單 → MENU）
```

### 配色主題

| 主題 ID | 背景色 | 前景色 | 風格描述 |
|---|---|---|---|
| `classic-green` | `#000000` | `#00ff66` | 經典綠磷光螢幕 |
| `amber` | `#1a0f00` | `#ffb000` | 復古琥珀色顯示器 |
| `neon-purple` | `#0d0221` | `#b388ff` | 霓虹賽博龐克 |
| `ocean-blue` | `#001018` | `#29b6f6` | 深海藍 |
| `high-contrast` | `#000000` | `#ffffff` | 高對比無障礙模式 |

---

<a id="tw-manual"></a>
## 遊戲說明書

### 操作方式

| 動作 | 鍵盤 | 行動裝置 |
|---|---|---|
| 向左移動 | `A` / `←` | 左側 `←` 虛擬鍵 |
| 向右移動 | `D` / `→` | 右側 `→` 虛擬鍵 |
| 射擊 | `Space` | 右下紅色 `FIRE` 鍵 |
| 暫停 / 恢復 | `Esc` / `P` | HUD 右上角 `PAUSE` 鍵 |

### 得分規則

| 目標 | 分數 |
|---|---|
| 頂層外星人（🐙 章魚型） | 30 分 |
| 中層外星人（🦀 螃蟹型） | 20 分 |
| 底層外星人（🦑 水母型） | 10 分 |
| 神秘 UFO（🛸 紅色飛碟） | 50 / 100 / 150 / 300 分（隨機） |
| 額外生命 | 每累計 **10,000 分** 獲贈 1 台戰車 |

### 難度設定

| 等級 | 起始生命 | 侵略者速度 | 射擊頻率 |
|---|---|---|---|
| 簡單（Easy） | 4 台 | ×0.7 | 低 |
| 普通（Normal） | 3 台 | ×1.0 | 中 |
| 困難（Hard） | 2 台 | ×1.4 | 高 |

### 遊戲機制

| 機制 | 詳細說明 |
|---|---|
| 陣列加速 | 每擊殺一隻外星人，步進間隔縮短；剩餘少數時進入超高速移動 |
| 波次進化 | 每次過關速度 ×1.1 倍，上限 ×2.5 |
| 碉堡破損 | 子彈精準破壞單個方塊；侵略者直接接觸整行消滅 |
| 自動存檔 | 暫停或過關時自動存檔；主選單點「繼續遊戲」無縫回歸 |
| 過關條件 | 消滅全部 55 隻侵略者，進入下一波次 |
| 失敗條件 | 生命歸零，或侵略者陣列下降至玩家所在的 Y 座標 |

### 進階技巧

| 技巧 | 說明 |
|---|---|
| 邊緣優先 | 優先擊殺左右兩側外星人，縮短陣列寬度以減緩下降速度 |
| 防空隧道 | 在碉堡正上方打穿一條小縫，從掩體後方安全狙擊 |
| UFO 掌握 | UFO 在固定的 Y = 60 高度飛過，出現後立即垂直對準射擊可穩定命中 |

### 設定面板

| 設定項目 | 選項 |
|---|---|
| 背景音樂音量 | 0〜100 滑桿 |
| 音效音量 | 0〜100 滑桿 |
| 全靜音 | 切換開關 |
| 配色主題 | 5 種（即時預覽） |
| 遊戲難度 | 簡單 / 普通 / 困難 |
| 重置最高分 | 清除 localStorage 紀錄 |
