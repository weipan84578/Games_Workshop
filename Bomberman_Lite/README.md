# Bomberman Lite

Bomberman Lite is a zero-build browser game built with HTML5, CSS3, Canvas, Vanilla JavaScript, Web Audio API, and localStorage. Open `index.html` directly in a browser to play.

## Language

- [中文](#中文)
- [English](#english)
- [日本語](#日本語)

---

## 中文

### 中文快速目錄

- [遊戲方式](#中文-遊戲方式)
- [遊戲說明](#中文-遊戲說明)
- [程式邏輯](#中文-程式邏輯)
- [程式分類](#中文-程式分類)
- [啟動方式](#中文-啟動方式)

### 中文 遊戲方式

目標是在每一關中用炸彈消滅敵人，炸開軟牆尋找出口，進入出口後進到下一關。第 25 關是 Boss 關，擊倒 Boss 即可通關。

鍵盤操作：

| 動作 | 按鍵 |
| --- | --- |
| 移動 | 方向鍵 / WASD |
| 放置炸彈 | Space / Z |
| 暫停 | Esc / P，或遊戲畫面上方暫停按鈕 |

行動裝置操作：

| 動作 | 操作 |
| --- | --- |
| 移動 | 左側虛擬搖桿 |
| 放置炸彈 | 右側 `B` 按鈕 |
| 暫停 | 遊戲畫面上方暫停按鈕 |

目前為了測試，關卡選擇已開放第 1 到第 25 關全部可直接進入。

### 中文 遊戲說明

主要規則：

- 地圖大小為 15 x 13。
- 硬牆不可破壞。
- 軟牆可被炸彈炸開，可能露出道具或出口。
- 炸彈爆炸會向上下左右延伸。
- 炸彈會阻擋玩家與所有敵人，包括可穿牆敵人。
- 敵人全滅後會開啟出口。
- 第 25 關只要 Boss 被擊敗就會觸發勝利。

道具：

| 道具 | 效果 |
| --- | --- |
| 炸彈+1 | 最大同時炸彈數增加 |
| 火焰升級 | 爆炸範圍增加 |
| 加速靴 | 移動速度提升 |
| 護盾 | 抵擋一次傷害 |
| 時間+30 | 倒數時間增加 30 秒 |
| 穿牆炸彈 | 爆炸可穿透軟牆 |
| 加命 | 生命增加 |
| 遙控炸彈 | 可手動引爆炸彈 |

敵人：

| 敵人 | 行為 |
| --- | --- |
| Balloom | 隨機移動 |
| Oneal | 追蹤玩家 |
| Doll | 追蹤並避開危險 |
| Minvo | 更快且更積極追蹤 |
| Kondoria | 可穿牆，但不能穿過炸彈 |
| Ovape | 高速穿牆敵，但不能穿過炸彈 |
| Daemon | 第 25 關 Boss |

### 中文 程式邏輯

核心流程：

1. `index.html` 載入 CSS 與所有 JavaScript 檔案。
2. `Game.js` 在 `DOMContentLoaded` 後建立遊戲實例。
3. `StateManager.js` 控制主選單、遊戲畫面與結束畫面的切換。
4. `GameLoop.js` 使用 `requestAnimationFrame` 更新與繪製遊戲。
5. `LevelLoader.js` 讀取 25 關設定，`TileMap.js` 生成 15 x 13 地圖。
6. `Player.js` 根據 `InputManager.js` 的鍵盤或觸控輸入移動與放炸彈。
7. `Bomb.js` 倒數後呼叫 `Game.explodeBomb()` 產生 `Explosion.js`。
8. `Enemy.js` 與 `EnemyAI.js` 控制敵人移動、追蹤、避炸與穿牆行為。
9. `TileRenderer.js` 將地圖、玩家、敵人、炸彈、爆炸與道具畫到 Canvas。
10. `SaveManager.js` 用 localStorage 儲存進度、設定與最高紀錄。
11. `AudioEngine.js`、`SoundEffects.js`、`MusicPlayer.js` 使用 Web Audio API 合成音效與 BGM。

重要判定：

- `Game.canMoveRect()` 是移動碰撞入口。
- `Game.bombAt()` 判斷指定格是否有炸彈。
- `Game.explodeBomb()` 負責爆炸傳播、炸開軟牆、引爆連鎖炸彈。
- `Game.checkExplosionDamage()` 處理玩家與敵人的爆炸傷害。
- `Game.defeatEnemy()` 處理擊敗敵人與第 25 關 Boss 勝利條件。

### 中文 程式分類

| 路徑 | 用途 |
| --- | --- |
| [`index.html`](index.html) | 遊戲入口，載入 CSS 與 JS |
| [`css/base`](css/base) | Reset、變數、字體設定 |
| [`css/layout`](css/layout) | 基礎版面與響應式設定 |
| [`css/components`](css/components) | 按鈕、Modal、HUD、搖桿、通知 |
| [`css/screens`](css/screens) | 主選單、遊戲、設定、關卡、結束畫面 |
| [`css/themes`](css/themes) | 六套主題配色 |
| [`js/core`](js/core) | 遊戲主流程、狀態、事件、迴圈 |
| [`js/entities`](js/entities) | 玩家、敵人、炸彈、爆炸、道具 |
| [`js/map`](js/map) | 地圖生成、碰撞、渲染、關卡載入 |
| [`js/levels`](js/levels) | 第 1 到第 25 關資料 |
| [`js/input`](js/input) | 鍵盤與觸控輸入 |
| [`js/audio`](js/audio) | 音效、BGM、Web Audio 封裝 |
| [`js/ui`](js/ui) | 主選單、HUD、Modal、設定、關卡選擇、虛擬搖桿 |
| [`js/storage`](js/storage) | localStorage 存檔 |
| [`js/utils`](js/utils) | 常數、工具函式、動畫輔助 |
| [`bomberman-lite-spec.md`](bomberman-lite-spec.md) | 原始規格書 |

### 中文 啟動方式

直接用瀏覽器開啟：

```text
index.html
```

不需要 Node.js、npm、build step 或後端伺服器。

---

## English

### English Quick Links

- [How to Play](#english-how-to-play)
- [Game Guide](#english-game-guide)
- [Program Logic](#english-program-logic)
- [Code Structure](#english-code-structure)
- [Run](#english-run)

### English How to Play

Use bombs to defeat enemies, break soft blocks, reveal the exit, and clear each stage. Stage 25 is the Boss stage. Defeat the Boss to win the game.

Keyboard controls:

| Action | Key |
| --- | --- |
| Move | Arrow keys / WASD |
| Place bomb | Space / Z |
| Pause | Esc / P, or the top pause button |

Mobile controls:

| Action | Control |
| --- | --- |
| Move | Left virtual joystick |
| Place bomb | Right `B` button |
| Pause | Top pause button |

For testing, all stages from 1 to 25 are currently unlocked in level select.

### English Game Guide

Main rules:

- The map size is 15 x 13.
- Hard walls cannot be destroyed.
- Soft blocks can be destroyed by bombs and may reveal items or the exit.
- Bomb flames spread up, down, left, and right.
- Bombs block the player and every enemy, including phase-through-wall enemies.
- After all normal enemies are defeated, the exit opens.
- On stage 25, defeating the Boss triggers victory immediately.

Power-ups:

| Power-up | Effect |
| --- | --- |
| Bomb +1 | Increases max active bombs |
| Fire Up | Increases blast range |
| Speed Boots | Increases movement speed |
| Shield | Blocks one hit |
| Time +30 | Adds 30 seconds |
| Pierce Bomb | Explosion pierces soft blocks |
| Extra Life | Adds one life |
| Remote Bomb | Allows manual detonation |

Enemies:

| Enemy | Behavior |
| --- | --- |
| Balloom | Random movement |
| Oneal | Chases the player |
| Doll | Chases and avoids danger |
| Minvo | Faster and more aggressive |
| Kondoria | Can phase through walls, but cannot pass bombs |
| Ovape | Fast phasing enemy, but cannot pass bombs |
| Daemon | Stage 25 Boss |

### English Program Logic

Core flow:

1. `index.html` loads CSS and all JavaScript files.
2. `Game.js` creates the game instance after `DOMContentLoaded`.
3. `StateManager.js` switches between menu, game, and game-over screens.
4. `GameLoop.js` runs updates and rendering through `requestAnimationFrame`.
5. `LevelLoader.js` loads the 25 stage configs, and `TileMap.js` generates the 15 x 13 map.
6. `Player.js` moves and places bombs based on `InputManager.js` keyboard or touch state.
7. `Bomb.js` counts down and calls `Game.explodeBomb()` to create `Explosion.js`.
8. `Enemy.js` and `EnemyAI.js` control movement, chasing, bomb avoidance, and phasing behavior.
9. `TileRenderer.js` draws the map, player, enemies, bombs, explosions, and power-ups onto Canvas.
10. `SaveManager.js` persists progress, settings, and high scores with localStorage.
11. `AudioEngine.js`, `SoundEffects.js`, and `MusicPlayer.js` synthesize SFX and BGM with Web Audio API.

Important checks:

- `Game.canMoveRect()` is the central movement collision check.
- `Game.bombAt()` checks whether a tile contains a bomb.
- `Game.explodeBomb()` handles blast propagation, soft block destruction, and chain reactions.
- `Game.checkExplosionDamage()` applies explosion damage to the player and enemies.
- `Game.defeatEnemy()` handles enemy defeat and stage 25 Boss victory.

### English Code Structure

| Path | Purpose |
| --- | --- |
| [`index.html`](index.html) | Entry point that loads CSS and JS |
| [`css/base`](css/base) | Reset, variables, typography |
| [`css/layout`](css/layout) | Layout and responsive rules |
| [`css/components`](css/components) | Buttons, modal, HUD, joystick, notification |
| [`css/screens`](css/screens) | Menu, game, settings, level select, game over |
| [`css/themes`](css/themes) | Six color themes |
| [`js/core`](js/core) | Game flow, state, events, loop |
| [`js/entities`](js/entities) | Player, enemies, bombs, explosions, power-ups |
| [`js/map`](js/map) | Map generation, collision, rendering, level loading |
| [`js/levels`](js/levels) | Stage 1 to 25 data |
| [`js/input`](js/input) | Keyboard and touch input |
| [`js/audio`](js/audio) | SFX, BGM, Web Audio wrapper |
| [`js/ui`](js/ui) | Main menu, HUD, modal, settings, level select, virtual joystick |
| [`js/storage`](js/storage) | localStorage persistence |
| [`js/utils`](js/utils) | Constants, helpers, animation utilities |
| [`bomberman-lite-spec.md`](bomberman-lite-spec.md) | Original specification |

### English Run

Open this file directly in a browser:

```text
index.html
```

No Node.js, npm, build step, or backend server is required.

---

## 日本語

### 日本語クイックリンク

- [遊び方](#日本語-遊び方)
- [ゲーム説明](#日本語-ゲーム説明)
- [プログラムロジック](#日本語-プログラムロジック)
- [コード分類](#日本語-コード分類)
- [起動方法](#日本語-起動方法)

### 日本語 遊び方

爆弾で敵を倒し、壊せるブロックを破壊して出口を見つけ、出口に入ると次のステージへ進みます。ステージ 25 は Boss 戦です。Boss を倒すとクリアになります。

キーボード操作：

| 操作 | キー |
| --- | --- |
| 移動 | 矢印キー / WASD |
| 爆弾を置く | Space / Z |
| 一時停止 | Esc / P、または画面上部の一時停止ボタン |

モバイル操作：

| 操作 | 入力 |
| --- | --- |
| 移動 | 左側の仮想ジョイスティック |
| 爆弾を置く | 右側の `B` ボタン |
| 一時停止 | 画面上部の一時停止ボタン |

テスト用として、現在はステージ 1 から 25 まで全て選択可能です。

### 日本語 ゲーム説明

基本ルール：

- マップサイズは 15 x 13 です。
- 固い壁は破壊できません。
- 壊せるブロックは爆弾で破壊でき、アイテムや出口が出ることがあります。
- 爆風は上下左右に広がります。
- 爆弾はプレイヤーと全ての敵を通しません。壁抜け敵も爆弾は通過できません。
- 通常ステージでは敵を全滅させると出口が開きます。
- ステージ 25 では Boss を倒すと即座に勝利になります。

パワーアップ：

| アイテム | 効果 |
| --- | --- |
| 爆弾+1 | 同時に置ける爆弾数が増える |
| 火力アップ | 爆風範囲が広がる |
| スピードブーツ | 移動速度が上がる |
| シールド | ダメージを一度防ぐ |
| 時間+30 | 残り時間を 30 秒追加 |
| 貫通爆弾 | 爆風が壊せるブロックを貫通する |
| ライフ追加 | ライフが増える |
| リモコン爆弾 | 手動で爆弾を起爆できる |

敵：

| 敵 | 行動 |
| --- | --- |
| Balloom | ランダム移動 |
| Oneal | プレイヤーを追跡 |
| Doll | 追跡しながら危険を避ける |
| Minvo | 高速で積極的に追跡 |
| Kondoria | 壁抜け可能。ただし爆弾は通過不可 |
| Ovape | 高速の壁抜け敵。ただし爆弾は通過不可 |
| Daemon | ステージ 25 の Boss |

### 日本語 プログラムロジック

基本フロー：

1. `index.html` が CSS と全 JavaScript ファイルを読み込みます。
2. `Game.js` が `DOMContentLoaded` 後にゲームインスタンスを生成します。
3. `StateManager.js` がメニュー、ゲーム、ゲームオーバー画面を切り替えます。
4. `GameLoop.js` が `requestAnimationFrame` で更新と描画を実行します。
5. `LevelLoader.js` が 25 ステージの設定を読み込み、`TileMap.js` が 15 x 13 のマップを生成します。
6. `Player.js` は `InputManager.js` のキーボードまたはタッチ入力に基づいて移動と爆弾設置を行います。
7. `Bomb.js` はカウントダウン後に `Game.explodeBomb()` を呼び、`Explosion.js` を生成します。
8. `Enemy.js` と `EnemyAI.js` が敵の移動、追跡、爆弾回避、壁抜けを制御します。
9. `TileRenderer.js` がマップ、プレイヤー、敵、爆弾、爆風、アイテムを Canvas に描画します。
10. `SaveManager.js` が localStorage で進行状況、設定、最高記録を保存します。
11. `AudioEngine.js`、`SoundEffects.js`、`MusicPlayer.js` が Web Audio API で効果音と BGM を合成します。

重要な判定：

- `Game.canMoveRect()` は移動衝突判定の中心です。
- `Game.bombAt()` は指定タイルに爆弾があるか判定します。
- `Game.explodeBomb()` は爆風の伝播、ブロック破壊、連鎖爆発を処理します。
- `Game.checkExplosionDamage()` はプレイヤーと敵への爆風ダメージを処理します。
- `Game.defeatEnemy()` は敵撃破とステージ 25 の Boss 勝利条件を処理します。

### 日本語 コード分類

| パス | 役割 |
| --- | --- |
| [`index.html`](index.html) | CSS と JS を読み込む入口 |
| [`css/base`](css/base) | Reset、変数、文字設定 |
| [`css/layout`](css/layout) | レイアウトとレスポンシブ設定 |
| [`css/components`](css/components) | ボタン、Modal、HUD、ジョイスティック、通知 |
| [`css/screens`](css/screens) | メニュー、ゲーム、設定、ステージ選択、ゲームオーバー |
| [`css/themes`](css/themes) | 6 種類のカラーテーマ |
| [`js/core`](js/core) | ゲーム進行、状態、イベント、ループ |
| [`js/entities`](js/entities) | プレイヤー、敵、爆弾、爆風、アイテム |
| [`js/map`](js/map) | マップ生成、衝突、描画、ステージ読み込み |
| [`js/levels`](js/levels) | ステージ 1 から 25 のデータ |
| [`js/input`](js/input) | キーボードとタッチ入力 |
| [`js/audio`](js/audio) | 効果音、BGM、Web Audio ラッパー |
| [`js/ui`](js/ui) | メニュー、HUD、Modal、設定、ステージ選択、仮想ジョイスティック |
| [`js/storage`](js/storage) | localStorage 保存 |
| [`js/utils`](js/utils) | 定数、ヘルパー、アニメーション補助 |
| [`bomberman-lite-spec.md`](bomberman-lite-spec.md) | 元仕様書 |

### 日本語 起動方法

ブラウザで直接開きます：

```text
index.html
```

Node.js、npm、ビルド手順、バックエンドサーバーは不要です。
