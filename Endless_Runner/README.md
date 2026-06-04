# ENDLESS RUN

> **English**: A cyberpunk endless runner built with HTML5 Canvas, Vanilla JavaScript, and procedural Web Audio.
>
> **日本語**: HTML5 Canvas、Vanilla JavaScript、Web Audio の自動生成サウンドで作られたサイバーパンク系エンドレスランナーです。
>
> **中文（繁體）**: 使用 HTML5 Canvas、原生 JavaScript 與 Web Audio 程式化音效製作的賽博龐克風格無盡跑酷遊戲。

---

## Contents / 目次 / 目錄

| Section | English | 日本語 | 中文 |
|---|---|---|---|
| [Game Overview](#game-overview) | Game concept and features | ゲーム内容と特徴 | 遊戲概念與特色 |
| [Quick Start](#quick-start) | How to run the game | 起動方法 | 如何啟動 |
| [Controls](#controls) | Keyboard, mouse, touch | キーボード、マウス、タッチ | 鍵盤、滑鼠、觸控 |
| [Gameplay Systems](#gameplay-systems) | Score, lives, difficulty | スコア、ライフ、難度 | 分數、生命、難度 |
| [Program Structure](#program-structure) | File and module responsibilities | ファイルとモジュールの役割 | 檔案與模組職責 |
| [Runtime Flow](#runtime-flow) | How the game loop works | ゲームループの流れ | 遊戲迴圈流程 |
| [Data Storage](#data-storage) | localStorage data | localStorage の内容 | localStorage 資料 |

---

## <a id="game-overview"></a>Game Overview / ゲーム概要 / 遊戲概覽

| Item | English | 日本語 | 中文 |
|---|---|---|---|
| Title | **ENDLESS RUN** | **ENDLESS RUN** | **ENDLESS RUN** |
| Genre | Cyberpunk endless runner | サイバーパンク系エンドレスランナー | 賽博龐克風格無盡跑酷 |
| Core goal | Survive as long as possible, avoid obstacles, collect coins, and beat the best score. | できるだけ長く生き残り、障害物を避け、コインを集め、ハイスコア更新を目指します。 | 盡可能撐得更久，避開障礙、收集金幣，刷新最高分。 |
| Visual style | Neon city, parallax skyline, glowing obstacles, particle effects. | ネオン都市、パララックス背景、発光する障害物、パーティクル演出。 | 霓虹城市、視差背景、發光障礙物與粒子特效。 |
| Tech stack | HTML5, CSS3, Vanilla JavaScript, Canvas 2D, Web Audio API. | HTML5、CSS3、Vanilla JavaScript、Canvas 2D、Web Audio API。 | HTML5、CSS3、原生 JavaScript、Canvas 2D、Web Audio API。 |
| Asset strategy | Most visuals and sounds are generated directly by code. | ほとんどのビジュアルとサウンドはコードで生成されます。 | 大多數畫面與聲音都由程式即時生成。 |

### Main Features / 主な特徴 / 主要特色

| Feature | English | 日本語 | 中文 |
|---|---|---|---|
| Double jump | The player can jump once from the ground and once again in mid-air. | 地上ジャンプ後、空中でもう一度ジャンプできます。 | 玩家可從地面跳一次，並在空中再跳一次。 |
| Progressive difficulty | Speed increases over time, and new obstacle types appear later. | 時間経過で速度が上がり、新しい障害物が登場します。 | 隨時間提升速度，後期會出現更多障礙種類。 |
| Combo scoring | Passing every 5 obstacles grants a bonus. | 障害物を 5 個通過するごとにボーナスが入ります。 | 每通過 5 個障礙物可獲得 Combo 加分。 |
| Procedural audio | BGM and SFX are synthesized with Web Audio. | BGM と効果音は Web Audio で合成されます。 | 背景音樂與音效由 Web Audio 合成。 |
| Responsive canvas | Uses a fixed 1280x720 logical resolution with DPI-aware scaling. | 1280x720 の論理解像度を使い、DPI に合わせて表示します。 | 使用固定 1280x720 邏輯解析度，並依螢幕 DPI 縮放。 |

---

## <a id="quick-start"></a>Quick Start / 起動方法 / 快速開始

| Step | English | 日本語 | 中文 |
|---|---|---|---|
| 1 | Open `index.html` in a modern browser. | モダンブラウザで `index.html` を開きます。 | 使用現代瀏覽器開啟 `index.html`。 |
| 2 | Click or tap **START** on the main menu. | メインメニューで **START** を押します。 | 在主選單點擊或觸碰 **START**。 |
| 3 | Jump, collect coins, avoid obstacles, and keep running. | ジャンプしてコインを集め、障害物を避けながら走り続けます。 | 跳躍、收集金幣、閃避障礙並持續奔跑。 |

| English | 日本語 | 中文 |
|---|---|---|
| Optional static server: | 任意の静的サーバー: | 可選的靜態伺服器： |

```bash
python -m http.server 8000
```

| English | 日本語 | 中文 |
|---|---|---|
| Then open: | その後、次を開きます: | 接著開啟： |

```text
http://localhost:8000
```

| English | 日本語 | 中文 |
|---|---|---|
| No package installation is required. | パッケージのインストールは不要です。 | 不需要安裝任何套件。 |

---

## <a id="controls"></a>Controls / 操作方法 / 操作方式

| Action | Keyboard | Mouse / Touch | English | 日本語 | 中文 |
|---|---|---|---|---|---|
| Jump | `Space`, `ArrowUp`, `W` | Click / tap canvas | Jump from the ground. | 地上からジャンプします。 | 從地面跳躍。 |
| Double jump | `Space`, `ArrowUp`, `W` while airborne | Click / tap again while airborne | Jump once more before landing. | 着地前にもう一度ジャンプします。 | 落地前可再跳一次。 |
| Pause | `Esc`, `P` | Pause button on the HUD | Pause the current run. | 現在のプレイを一時停止します。 | 暫停目前遊戲。 |
| Resume | `Esc`, `P` on pause scene | **RESUME** button | Continue from pause. | ポーズ画面から再開します。 | 從暫停畫面繼續。 |
| Menu navigation | - | Click / tap buttons | Use the menu buttons. | メニューボタンを使います。 | 使用選單按鈕操作。 |

---

## <a id="gameplay-systems"></a>Gameplay Systems / ゲームシステム / 遊戲系統

### Score / スコア / 分數

| Source | Value | English | 日本語 | 中文 |
|---|---:|---|---|---|
| Survival | `+10 / sec` | Score increases every second while alive. | 生存中は毎秒スコアが増えます。 | 存活期間每秒增加分數。 |
| Gold coin | `+50` | Standard high-value coin. | 標準的な高得点コイン。 | 標準高分金幣。 |
| Silver coin | `+30` | Lower-value coin. | 低めの得点コイン。 | 較低分銀幣。 |
| Rare coin | `+200` | Rare bonus coin. | レアなボーナスコイン。 | 稀有高額分數金幣。 |
| Passed obstacle | `+25` | Awarded after safely passing an obstacle. | 障害物を安全に通過すると加算されます。 | 安全通過障礙物後加分。 |
| Combo bonus | `+150` | Awarded every 5 passed obstacles. | 障害物を 5 個通過するごとに加算されます。 | 每通過 5 個障礙物額外加分。 |

### Lives / ライフ / 生命

| Rule | English | 日本語 | 中文 |
|---|---|---|---|
| Starting lives | Each run starts with 3 lives. | 各プレイは 3 ライフから始まります。 | 每次遊戲從 3 條生命開始。 |
| Hit behavior | A collision removes 1 life and grants 2 seconds of invincibility. | 衝突すると 1 ライフ減り、2 秒間無敵になります。 | 碰撞會扣 1 條生命，並獲得 2 秒無敵時間。 |
| Game over | When lives reach 0, the death animation plays and the game over scene appears. | ライフが 0 になると死亡演出後にゲームオーバー画面へ移ります。 | 生命歸零後播放死亡動畫並進入 Game Over。 |

### Difficulty / 難度 / 難度

| Time | Obstacle gap | English | 日本語 | 中文 |
|---:|---:|---|---|---|
| `0s - 30s` | `600 - 900px` | Early warm-up with low obstacles. | 序盤は低い障害物中心です。 | 初期暖身，以低障礙為主。 |
| `30s - 60s` | `450 - 700px` | Medium obstacles join the pool. | 中型の障害物が追加されます。 | 中型障礙加入生成池。 |
| `60s - 120s` | `350 - 550px` | High and flying obstacles appear. | 高い障害物と飛行障害物が登場します。 | 高障礙與飛行障礙出現。 |
| `120s - 180s` | `280 - 450px` | Faster pace and fast BGM. | テンポが上がり、高速 BGM に切り替わります。 | 節奏加快並切換高速 BGM。 |
| `180s+` | `220 - 380px` | Dense late-game challenge. | 終盤は障害物間隔がかなり狭くなります。 | 後期障礙間距更密集。 |

### Speed Presets / 速度プリセット / 速度預設

| Preset key | Initial speed | Max speed | Increment | English | 日本語 | 中文 |
|---|---:|---:|---:|---|---|---|
| `verySlow` | `2` | `10` | `0.0003` | Very slow practice pace. | とても遅い練習向け速度。 | 非常慢，適合練習。 |
| `slow` | `3` | `14` | `0.0006` | Slower than normal. | 通常より遅い速度。 | 比普通更慢。 |
| `normal` | `5` | `20` | `0.001` | Default game speed. | 標準のゲーム速度。 | 預設遊戲速度。 |
| `fast` | `8` | `26` | `0.0015` | Faster starting pace. | 開始時から速めです。 | 開局速度較快。 |
| `veryFast` | `13` | `32` | `0.002` | High-speed challenge. | 高速チャレンジ向けです。 | 高速挑戰模式。 |

### Entity Types / エンティティ種類 / 物件種類

| Type | Code | English | 日本語 | 中文 |
|---|---|---|---|---|
| Player | `ER.Player` | Runner with states: `run`, `jump`, `fall`, `hurt`, `dead`. | `run`、`jump`、`fall`、`hurt`、`dead` の状態を持つランナー。 | 玩家角色，包含 `run`、`jump`、`fall`、`hurt`、`dead` 狀態。 |
| Obstacle | `ER.ObstacleManager` | Spawns low, mid, high, flying, and combo obstacles. | 低、中、高、飛行、コンボ障害物を生成します。 | 生成低、中、高、飛行與組合障礙。 |
| Coin | `ER.CoinManager` | Spawns line or arc coin groups with weighted coin types. | ライン型またはアーチ型のコイングループを生成します。 | 產生直線或弧線金幣群，並依權重決定種類。 |
| Particle | `ER.Particles` | Reuses pooled particles for dust, hits, death, coins, speed trails, and new records. | オブジェクトプールで砂埃、衝突、死亡、コイン、高速残像、新記録演出を再利用します。 | 使用物件池重複利用粒子，處理塵土、碰撞、死亡、金幣、速度尾跡與新紀錄特效。 |

---

## <a id="program-structure"></a>Program Structure / プログラム構成 / 程式結構

### Architecture Layers / アーキテクチャ層 / 架構分層

| Layer | Files | English | 日本語 | 中文 |
|---|---|---|---|---|
| Entry | `index.html`, `js/main.js` | Loads scripts in dependency order and starts the game on `DOMContentLoaded`. | 依存順にスクリプトを読み込み、`DOMContentLoaded` でゲームを開始します。 | 依相依順序載入腳本，並於 `DOMContentLoaded` 啟動遊戲。 |
| Core loop | `js/game.js` | Owns global state, scene switching, and `requestAnimationFrame` loop. | グローバル状態、シーン切替、`requestAnimationFrame` ループを管理します。 | 管理全域狀態、場景切換與 `requestAnimationFrame` 遊戲迴圈。 |
| Rendering | `js/renderer.js`, `css/style.css` | Handles canvas sizing, DPI scaling, parallax background, and ground rendering. | Canvas サイズ、DPI スケール、パララックス背景、地面描画を担当します。 | 處理 Canvas 尺寸、DPI 縮放、視差背景與地面繪製。 |
| Gameplay | `js/scenes/gameScene.js`, `js/entities/*`, `js/physics.js` | Updates physics, spawning, collision, scoring, and death transitions. | 物理、生成、衝突、スコア、死亡遷移を更新します。 | 更新物理、生成、碰撞、計分與死亡轉場。 |
| UI / Scenes | `js/scenes/*`, `js/ui/*` | Draws menus, HUD, settings, pause, game over, buttons, sliders, and floating text. | メニュー、HUD、設定、ポーズ、ゲームオーバー、ボタン、スライダー、浮遊テキストを描画します。 | 繪製選單、HUD、設定、暫停、Game Over、按鈕、滑桿與浮動文字。 |
| Audio | `js/audio/*` | Synthesizes BGM and SFX with Web Audio and gain nodes. | Web Audio とゲインノードで BGM と効果音を合成します。 | 使用 Web Audio 與 Gain Node 合成 BGM 與音效。 |
| Utilities | `js/utils/*` | Provides input mapping, localStorage, random helpers, easing, and weighted choice. | 入力変換、localStorage、乱数、イージング、重み付き抽選を提供します。 | 提供輸入轉換、localStorage、亂數、 easing 與權重抽選。 |

### File Map / ファイル一覧 / 檔案分類

| Path | Category | English Responsibility | 日本語の役割 | 中文職責 |
|---|---|---|---|---|
| `index.html` | Entry | Defines the canvas, UI overlay, stylesheet, and script load order. | Canvas、UI オーバーレイ、CSS、スクリプト読込順を定義します。 | 定義 Canvas、UI Overlay、樣式表與腳本載入順序。 |
| `css/style.css` | Style | Fullscreen viewport layout, safe-area padding, fonts, touch behavior, and canvas display rules. | 全画面レイアウト、セーフエリア、フォント、タッチ挙動、Canvas 表示を設定します。 | 設定全螢幕版面、安全區域、字型、觸控行為與 Canvas 顯示規則。 |
| `js/main.js` | Entry | Starts `ER.Game` after the DOM is ready. | DOM 準備後に `ER.Game` を開始します。 | DOM 就緒後啟動 `ER.Game`。 |
| `js/game.js` | Core | Stores game state, initializes storage/audio/input/renderer, routes scenes, and runs the main loop. | ゲーム状態、初期化、シーン遷移、メインループを管理します。 | 保存遊戲狀態，初始化儲存、音效、輸入、渲染器，並管理場景與主迴圈。 |
| `js/renderer.js` | Rendering | Uses a 1280x720 logical canvas, handles resize, draws sky, city parallax layers, stars, and scrolling ground. | 1280x720 論理 Canvas、リサイズ、空、都市パララックス、星、スクロール地面を描画します。 | 使用 1280x720 邏輯 Canvas，處理縮放，繪製天空、城市視差層、星空與捲動地面。 |
| `js/physics.js` | Physics | Defines gravity, jump forces, speed presets, max fall speed, and AABB collision. | 重力、ジャンプ力、速度プリセット、最大落下速度、AABB 衝突判定を定義します。 | 定義重力、跳躍力、速度預設、最大落下速度與 AABB 碰撞判定。 |
| `js/utils/math.js` | Utility | Random ranges, integer random, linear interpolation, clamp, weighted random, and easing functions. | 乱数、整数乱数、線形補間、clamp、重み付き抽選、イージングを提供します。 | 提供隨機範圍、整數亂數、線性插值、clamp、權重抽選與 easing 函式。 |
| `js/utils/storage.js` | Utility | Reads and writes `endless_runner_data` in localStorage with default settings. | localStorage の `endless_runner_data` を既定値つきで読み書きします。 | 讀寫 localStorage 的 `endless_runner_data`，並補齊預設設定。 |
| `js/utils/input.js` | Utility | Maps keyboard, mouse, and touch input into logical canvas coordinates and one-frame action flags. | キーボード、マウス、タッチを論理座標と 1 フレーム入力フラグに変換します。 | 將鍵盤、滑鼠、觸控轉成邏輯座標與單幀操作旗標。 |
| `js/audio/synth.js` | Audio | Generates SFX and note-based BGM melodies with oscillators, gain envelopes, filters, and noise buffers. | オシレーター、ゲイン包絡、フィルター、ノイズバッファで効果音とメロディを生成します。 | 使用振盪器、音量包絡、濾波器與噪音緩衝生成音效與旋律。 |
| `js/audio/audioManager.js` | Audio | Creates `AudioContext`, master/music/SFX gain nodes, volume controls, BGM scheduling, resume/suspend behavior. | `AudioContext`、ゲインノード、音量、BGM スケジューリング、再開/停止を管理します。 | 建立 `AudioContext`、主音量/BGM/SFX Gain Node，管理音量、BGM 排程與暫停恢復。 |
| `js/entities/player.js` | Entity | Controls player physics, jump/double jump, hurt invincibility, death animation, hitbox, and procedural drawing. | プレイヤー物理、二段ジャンプ、被弾無敵、死亡演出、当たり判定、描画を担当します。 | 控制玩家物理、雙段跳、受傷無敵、死亡動畫、碰撞框與程式化繪圖。 |
| `js/entities/obstacle.js` | Entity | Defines obstacle types, object pooling, weighted spawning, gap scaling, collision, companion flying obstacle, and pass scoring. | 障害物種類、プール、重み付き生成、間隔調整、衝突、飛行相棒、通過スコアを管理します。 | 定義障礙種類、物件池、權重生成、間距縮放、碰撞、伴隨飛行障礙與通過計分。 |
| `js/entities/coin.js` | Entity | Defines coin values, weighted coin type selection, line/arc groups, obstacle-safe placement, collection, and collection animation. | コイン得点、重み付き種類選択、ライン/アーチ配置、障害物回避、取得処理、取得演出を管理します。 | 定義金幣分數、權重選擇、直線/弧線群組、避開障礙的放置、收集與收集動畫。 |
| `js/entities/particle.js` | Entity | Maintains a particle pool and emits quality-scaled effects for movement, collisions, coins, death, speed, and records. | パーティクルプールを持ち、移動、衝突、コイン、死亡、高速、新記録演出を品質別に生成します。 | 維護粒子物件池，依畫質產生移動、碰撞、金幣、死亡、高速與新紀錄特效。 |
| `js/ui/ui.js` | UI | Provides reusable buttons, modals, overlays, sliders, glowing text, and floating score text. | ボタン、モーダル、オーバーレイ、スライダー、発光テキスト、浮遊スコアを提供します。 | 提供可重用按鈕、彈窗、遮罩、滑桿、發光文字與浮動分數文字。 |
| `js/ui/hud.js` | UI | Draws score, best score, lives, speed multiplier, pause icon, and exposes pause hitbox. | スコア、ハイスコア、ライフ、速度倍率、ポーズ表示、ポーズ判定を描画します。 | 繪製分數、最高分、生命、速度倍率、暫停圖示，並提供暫停點擊區域。 |
| `js/scenes/mainMenu.js` | Scene | Draws the animated title screen, demo runner, start button, settings button, best score, and version text. | タイトル画面、デモランナー、開始、設定、ハイスコア、バージョン表示を描画します。 | 繪製動態主選單、展示跑者、開始/設定按鈕、最高分與版本文字。 |
| `js/scenes/gameScene.js` | Scene | Runs countdown, gameplay updates, speed scaling, scoring, BGM speed-up, collision checks, and death transition. | カウントダウン、ゲーム更新、速度上昇、スコア、BGM 切替、衝突判定、死亡遷移を実行します。 | 執行倒數、遊戲更新、速度提升、計分、BGM 加速切換、碰撞檢查與死亡轉場。 |
| `js/scenes/settings.js` | Scene | Lets players adjust BGM/SFX volume, quality, speed preset, and save settings. | BGM/SFX 音量、品質、速度プリセットを変更し保存できます。 | 讓玩家調整 BGM/SFX 音量、畫質、速度預設並保存設定。 |
| `js/scenes/pauseScene.js` | Scene | Shows pause modal and handles resume, restart, or return to menu. | ポーズ画面を表示し、再開、リスタート、メニュー復帰を処理します。 | 顯示暫停視窗，處理繼續、重新開始與返回主選單。 |
| `js/scenes/gameOver.js` | Scene | Displays final score roll-up, best score, new record effect, replay button, and menu button. | 最終スコアのカウント演出、ハイスコア、新記録演出、再プレイ、メニューを表示します。 | 顯示結算分數滾動、最高分、新紀錄特效、再玩一次與主選單按鈕。 |
| `endless_runner_spec.md` | Document | Original design/specification document for the game. | ゲームの元設計・仕様ドキュメントです。 | 遊戲原始設計與規格文件。 |
| `fix/*.png` | Reference | Screenshot references captured during fixes or visual checking. | 修正や表示確認時のスクリーンショット参照です。 | 修正或視覺確認時留下的截圖參考。 |

---

## <a id="runtime-flow"></a>Runtime Flow / 実行フロー / 執行流程

| Step | English | 日本語 | 中文 |
|---:|---|---|---|
| 1 | `index.html` loads utility, audio, physics, renderer, entity, UI, scene, and core scripts. | `index.html` がユーティリティ、音声、物理、描画、エンティティ、UI、シーン、コアを読み込みます。 | `index.html` 載入工具、音效、物理、渲染、物件、UI、場景與核心腳本。 |
| 2 | `js/main.js` calls `ER.Game.start()` after `DOMContentLoaded`. | `DOMContentLoaded` 後に `js/main.js` が `ER.Game.start()` を呼びます。 | `DOMContentLoaded` 後由 `js/main.js` 呼叫 `ER.Game.start()`。 |
| 3 | `ER.Game.start()` initializes storage, audio, renderer, input, resize handlers, and the main menu. | `ER.Game.start()` が保存、音声、描画、入力、リサイズ、メインメニューを初期化します。 | `ER.Game.start()` 初始化儲存、音效、渲染器、輸入、尺寸事件與主選單。 |
| 4 | The main loop runs with `requestAnimationFrame`. | メインループは `requestAnimationFrame` で実行されます。 | 主迴圈透過 `requestAnimationFrame` 執行。 |
| 5 | Every frame calls `ER.Input.update()`, then the active scene's `update(dt)` and `draw(ctx)`. | 毎フレーム `ER.Input.update()` 後、現在シーンの `update(dt)` と `draw(ctx)` を呼びます。 | 每幀先呼叫 `ER.Input.update()`，再執行當前場景的 `update(dt)` 與 `draw(ctx)`。 |
| 6 | Scene changes are handled by `ER.Game.gotoScene(name)`. | シーン変更は `ER.Game.gotoScene(name)` で処理されます。 | 場景切換由 `ER.Game.gotoScene(name)` 處理。 |

### Scene Map / シーン一覧 / 場景地圖

| Scene | File | English | 日本語 | 中文 |
|---|---|---|---|---|
| Main Menu | `mainMenu.js` | Start screen with best score and settings access. | ハイスコアと設定入口を持つ開始画面。 | 顯示最高分並可進入設定的開始畫面。 |
| Game | `gameScene.js` | Active runner gameplay. | 実際のランナーゲームプレイ。 | 實際跑酷遊戲進行場景。 |
| Settings | `settings.js` | Volume, quality, and speed settings. | 音量、品質、速度設定。 | 音量、畫質與速度設定。 |
| Pause | `pauseScene.js` | Resume, restart, or return to menu. | 再開、リスタート、メニュー復帰。 | 繼續、重新開始或回主選單。 |
| Game Over | `gameOver.js` | Final score, best score, new record feedback, replay. | 最終スコア、ハイスコア、新記録、再プレイ。 | 結算分數、最高分、新紀錄提示與重玩。 |

---

## <a id="data-storage"></a>Data Storage / データ保存 / 資料儲存

| English | 日本語 | 中文 |
|---|---|---|
| The game uses this localStorage key: | この localStorage キーを使用します: | 遊戲使用以下 localStorage key： |

```text
endless_runner_data
```

| Field | English | 日本語 | 中文 |
|---|---|---|---|
| `bestScore` | Highest saved score. | 保存された最高スコア。 | 儲存的最高分。 |
| `settings.volMaster` | Master volume. | マスター音量。 | 主音量。 |
| `settings.volBGM` | Background music volume. | BGM 音量。 | 背景音樂音量。 |
| `settings.volSFX` | Sound effect volume. | 効果音音量。 | 音效音量。 |
| `settings.quality` | Particle quality: `high`, `medium`, or `low`. | パーティクル品質: `high`、`medium`、`low`。 | 粒子品質：`high`、`medium`、`low`。 |
| `settings.speedPreset` | Selected speed preset. | 選択中の速度プリセット。 | 目前選擇的速度預設。 |
| `totalPlayCount` | Total completed runs saved by the game. | 保存された総プレイ回数。 | 遊戲保存的總遊玩次數。 |
| `totalDistance` | Reserved distance statistic field. | 距離統計用の予約フィールド。 | 預留的距離統計欄位。 |

| English | 日本語 | 中文 |
|---|---|---|
| Default data shape: | 既定のデータ形式: | 預設資料格式： |

```json
{
  "bestScore": 0,
  "settings": {
    "volMaster": 1.0,
    "volBGM": 0.7,
    "volSFX": 0.9,
    "quality": "high",
    "vibration": true,
    "speedPreset": "normal"
  },
  "totalPlayCount": 0,
  "totalDistance": 0
}
```

---

## Development Notes / 開発メモ / 開發備註

| Topic | English | 日本語 | 中文 |
|---|---|---|---|
| Dependencies | No build tool or package manager is required. | ビルドツールやパッケージマネージャは不要です。 | 不需要建置工具或套件管理器。 |
| Namespace | The project uses the global `window.ER` namespace. | グローバル名前空間 `window.ER` を使います。 | 專案使用全域命名空間 `window.ER`。 |
| Rendering | All main visuals are drawn procedurally on Canvas. | 主要なビジュアルは Canvas 上で手続き的に描画されます。 | 主要視覺都在 Canvas 上以程式繪製。 |
| Audio | Browser audio starts after the first user interaction. | ブラウザ音声は最初のユーザー操作後に開始されます。 | 瀏覽器音效會在第一次使用者互動後啟動。 |
| Performance | Obstacles, coins, and particles use reusable object pools. | 障害物、コイン、パーティクルは再利用プールを使います。 | 障礙物、金幣與粒子使用可重用物件池。 |
| Responsive behavior | Canvas display size follows the viewport while game logic stays at 1280x720. | 表示サイズはビューポートに追従し、ゲームロジックは 1280x720 のままです。 | Canvas 顯示大小會跟隨視窗，遊戲邏輯維持 1280x720。 |
