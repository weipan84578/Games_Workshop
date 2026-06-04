# MonkeyFortress TD

Tower defense browser game built with HTML, CSS, and vanilla JavaScript.

| Language | Section |
| :-- | :-- |
| English | [Game Overview](#english) |
| 日本語 | [ゲーム紹介](#日本語) |
| 繁體中文 | [遊戲介紹](#繁體中文) |

---

## English

### Game Overview

MonkeyFortress TD is a lane-based tower defense game where players place monkey towers on a tile map, stop incoming enemy waves, earn gold, upgrade towers, and clear increasingly complex maps.

| Item | Description |
| :-- | :-- |
| Genre | Browser tower defense |
| Runtime | Static HTML page, no build step required |
| Core Loop | Choose a map, place towers, start waves, earn gold, upgrade or sell towers, survive all waves |
| Main View | Canvas-based battlefield with HUD, tower panel, upgrade panel, map selection, settings, and help modal |
| Progress | Saved in `localStorage` as settings, completed maps, high scores, and cheat-clear count |
| Version Text | `v1.4.0` in `index.html` |

### How To Play

| Action | How It Works |
| :-- | :-- |
| Start | Open `index.html` in a browser and press New Game |
| Select Map | Use the map menu to choose from 20 maps |
| Place Tower | Select a tower from the side panel, then click a valid tile on the canvas |
| Upgrade Tower | Click an existing tower and buy Path A, Path B, or Apex upgrades |
| Sell Tower | Select a tower and sell it for 50% of total spent gold |
| Start Wave | Press Start Wave, or enable Auto Wave for rapid wave chaining |
| Speed Control | Switch between `1x` and `5x` game speed from the HUD |
| Win / Lose | Win by clearing every wave; lose when lives reach zero |

### Main Features

| Feature | Details |
| :-- | :-- |
| 20 Maps | Difficulty scales from `map01` to `map20`, including multi-path and large final-stage layouts |
| 14 Tower Types | Direct damage, splash, freeze, poison, magnet, chain, curse, support, and long-range towers |
| 19 Enemy Types | Basic enemies plus armor, immunity, weakness, regeneration, split, explosion, and boss behaviors |
| Upgrade System | Path A improves damage, range, pierce, and stronger effects; Path B improves fire rate and multi-shot |
| Apex Upgrade | Unlocked when both Path A and Path B reach level 3; boosts damage, range, fire rate, effects, and pierce |
| Dynamic Waves | Waves are generated per map from base wave templates, difficulty multipliers, path routing, and final-boss scaling |
| Canvas Rendering | Map tiles, paths, towers, enemies, projectiles, particles, health bars, placement preview, and overlays are drawn on canvas |
| Audio | Web Audio API creates procedural music and sound effects |
| Persistence | `localStorage` keeps settings and progress between sessions |

### Map Summary

| ID | English Name | Theme | Difficulty | Size | Gold | Lives | Waves | Paths |
| :-- | :-- | :-- | --: | :-- | --: | --: | --: | --: |
| `map01` | Jungle Path | jungle | 1 | 16x12 | 150 | 20 | 20 | 1 |
| `map02` | Desert Serpent | desert | 2 | 18x13 | 130 | 18 | 22 | 2 |
| `map03` | Frozen Fortress | snow | 3 | 18x14 | 120 | 15 | 24 | 1 |
| `map04` | Lava Maze | lava | 4 | 20x14 | 110 | 12 | 25 | 3 |
| `map05` | Sky Islands | sky | 5 | 20x15 | 100 | 10 | 26 | 1 |
| `map06` | Sunken Ruins | ocean | 6 | 18x14 | 130 | 15 | 28 | 4 |
| `map07` | Ancient Labyrinth | ancient | 7 | 20x16 | 120 | 12 | 30 | 4 |
| `map08` | Mech Fortress | mech | 8 | 20x15 | 115 | 12 | 30 | 3 |
| `map09` | Dark Forest | dark | 9 | 22x16 | 110 | 10 | 32 | 3 |
| `map10` | Cosmic Finale | cosmic | 10 | 24x18 | 200 | 8 | 32 | 6 |
| `map11` | Toxic Wasteland | toxic | 11 | 20x15 | 115 | 12 | 32 | 3 |
| `map12` | Crystal Cavern | crystal | 12 | 20x16 | 110 | 10 | 34 | 2 |
| `map13` | Typhoon Eye | storm | 13 | 22x18 | 105 | 10 | 35 | 3 |
| `map14` | Sacred Corridor | sacred | 14 | 22x18 | 115 | 9 | 36 | 2 |
| `map15` | Chaos Rift | chaos | 15 | 22x18 | 130 | 8 | 38 | 3 |
| `map16` | Abyss Nest | abyss | 16 | 22x18 | 120 | 8 | 40 | 3 |
| `map17` | Temporal Maze | temporal | 17 | 24x18 | 110 | 8 | 42 | 3 |
| `map18` | Mirror World | mirror | 18 | 24x20 | 100 | 6 | 45 | 4 |
| `map19` | Doomsday Forge | doomsday | 19 | 26x20 | 95 | 5 | 50 | 5 |
| `map20` | Genesis End | genesis | 20 | 28x22 | 200 | 5 | 55 | 7 |

### Tower Summary

| Tower ID | Cost | Damage | Range | Fire Rate | Attack Type | Special Role |
| :-- | --: | --: | --: | --: | :-- | :-- |
| `dart` | 35 | 1 | 150 | 1.5 | dart | Basic projectile tower |
| `bomb` | 90 | 3 | 160 | 0.8 | explosion | Splash damage |
| `ice` | 70 | 0 | 128 | 0.55 | freeze | Area slow / freeze |
| `thorn` | 60 | 2 | 224 | 2.0 | poison | Long range poison |
| `wizard` | 100 | 8 | 192 | 0.5 | flame | High-damage splash |
| `eagle` | 200 | 3 | 260 | 1.0 | dart | Long-range projectile |
| `bell` | 80 | 2 | 224 | 2.5 | sonic | Sonic damage and short freeze |
| `magnet` | 110 | 0 | 160 | 0.7 | magnet | Magnetize and slow |
| `thunder` | 130 | 3 | 192 | 1.0 | thunder | Chain hits |
| `mushroom` | 90 | 1 | 192 | 2.0 | poison | Area poison |
| `mirror` | 150 | 2 | 256 | 0.8 | mirror | Long-range special shot |
| `vortex` | 160 | 2 | 224 | 1.5 | vortex | Area slow and control |
| `oracle` | 200 | 5 | 256 | 0.8 | oracle | Curse effect |
| `horn` | 180 | 0 | 320 | 0.35 | support | Buffs nearby towers |

### Enemy Summary

| Enemy ID | HP | Speed | Reward | Lives Damage | Traits |
| :-- | --: | --: | --: | --: | :-- |
| `red` | 1 | 64 | 1 | 1 | Basic |
| `blue` | 1 | 96 | 1 | 1 | Faster basic |
| `green` | 1 | 160 | 2 | 1 | Very fast |
| `yellow` | 3 | 64 | 2 | 2 | Higher health |
| `armor` | 5 | 77 | 3 | 2 | Armor |
| `lead` | 10 | 51 | 5 | 3 | Heavy armor |
| `boss` | 50 | 38 | 20 | 5 | Boss armor |
| `steel` | 8 | 58 | 4 | 2 | Armor, sonic weakness |
| `emp` | 6 | 77 | 4 | 2 | Thunder immunity, explosion weakness |
| `insulated` | 10 | 45 | 5 | 3 | Armor, thunder immunity, freeze weakness |
| `purified` | 5 | 83 | 3 | 1 | Poison immunity, freeze weakness |
| `gale` | 2 | 288 | 2 | 1 | Very fast, dart/vortex weakness |
| `tortoise` | 60 | 22 | 8 | 5 | Very high armor, poison/vortex weakness |
| `chrono` | 12 | 96 | 10 | 3 | Special behavior: `timeJump` |
| `regen` | 15 | 64 | 6 | 2 | Regenerates HP |
| `cursed` | 7 | 70 | 5 | 2 | Oracle weakness |
| `mirror` | 4 | 77 | 3 | 1 | Splits into smaller enemies |
| `suicide` | 3 | 115 | 1 | 0 | Explodes on death |
| `shadow` | 8 | 102 | 7 | 3 | Dart immunity, oracle weakness |

### Program Classification

| Area | File / Object | Responsibility |
| :-- | :-- | :-- |
| Entry HTML | `index.html` | Defines the menu screen, game screen, HUD, canvas, side panel, modal, and script/style loading |
| Styling | `css/main.css` | Responsive layout, HUD, buttons, tower cards, modal, map cards, tables in help modal, and mobile behavior |
| Game Constants | `js/main.js` top-level constants | Tile size, storage keys, blocked/path tile symbols, upgrade costs, and DOM element references |
| Tower Data | `towerTypes` | Defines tower cost, damage, range, fire rate, projectile behavior, attack type, and special effects |
| Enemy Data | `enemyTypes` | Defines enemy HP, speed, reward, lives damage, armor, immunities, weaknesses, and special behaviors |
| Base Waves | `waves` | Template waves used by dynamic wave generation |
| Map Data | `MAPS`, `EXPANSION_MAPS` | Embedded map definitions used by the running game |
| Map Assets | `assets/maps/map01.json` to `map20.json` | External map data mirrors or documents map definitions; current runtime uses embedded JS map data |
| State | `game`, `settings`, `progress` | Holds runtime game objects, user preferences, and persistent progress |
| Audio | `AudioEngine` | Creates procedural music and SFX through the Web Audio API |
| Wave System | `startWave`, `createMapWaves`, `updateSpawners`, `spawnEnemy` | Builds and runs enemy waves, assigns paths, and scales enemy counts |
| Enemy System | `updateEnemies`, `killEnemy`, `spawnSplitEnemies` | Moves enemies, applies poison/freeze/regen/split/explosion behavior, rewards kills, and handles life loss |
| Tower System | `placeTower`, `updateTowers`, `findTarget`, `fireTower` | Places towers, chooses targets, fires projectiles, and applies area/support attacks |
| Damage System | `applyDamage`, `calcDamage` | Resolves armor, immunities, weaknesses, magnetized bonus, curse bonus, and final damage |
| Upgrade System | `upgradeTower`, `activateApex`, `sellTower` | Handles Path A, Path B, Apex, tower spending, and sell value |
| Rendering | `render`, `drawMap`, `drawTowers`, `drawEnemies`, `drawProjectiles`, `drawParticles` | Draws the full canvas scene every animation frame |
| UI | `renderTowerList`, `updateSelection`, `openModal`, `openMapSelect`, `openDetailedHelp`, `openSettings` | Updates panels, modals, map selector, help pages, and settings |
| Input | Canvas pointer events, button handlers, `cheatDetector` | Handles tower placement, tower selection, speed buttons, pause, mute, map menu, and keyboard cheat sequence |
| Persistence | `loadSettings`, `saveSettings`, `loadProgress`, `saveProgress` | Reads and writes `localStorage` data |

### Runtime Flow

| Step | Function Group | Result |
| :-- | :-- | :-- |
| 1 | `resetGame` | Loads selected map, resets game state, resizes canvas |
| 2 | `prepareMap` | Expands waypoints into tile cells and pixel points |
| 3 | `createMapWaves` | Generates wave groups from map difficulty and path count |
| 4 | `startWave` | Creates spawners for the current wave |
| 5 | `loop` -> `update` | Updates spawners, enemies, towers, projectiles, particles, and wave completion |
| 6 | `loop` -> `render` | Redraws the map, units, effects, and overlays |
| 7 | `endGame` | Saves high score / completion when the game is won without cheats |

### Project Structure

| Path | Purpose |
| :-- | :-- |
| `index.html` | Main browser entry point |
| `css/main.css` | Full visual layout and responsive UI styling |
| `js/main.js` | Complete game logic, data, rendering, UI behavior, audio, and persistence |
| `assets/maps/` | Map JSON files for 20 stages |
| `Game_description.md` | Original game design description |
| `monkey-*-spec.md` | Version, map, balance, and patch design specs |

### Notes For Developers

| Topic | Note |
| :-- | :-- |
| Dependencies | No package manager or bundler is required |
| Browser APIs | Uses Canvas, Dialog, Web Audio, Pointer Events, `requestAnimationFrame`, `crypto.randomUUID`, and `localStorage` |
| Map Runtime | The current game reads maps from `js/main.js`, not by fetching `assets/maps/*.json` |
| Encoding | Some existing in-game Chinese strings appear corrupted in source files; README descriptions use clean multilingual text |
| Quick Test | Open `index.html`, start a game, place a tower, start a wave, change speed, open map/settings/help modals |

---

## 日本語

### ゲーム紹介

MonkeyFortress TD は、ブラウザで動くタワーディフェンスゲームです。プレイヤーはタイルマップ上にタワーを配置し、敵のウェーブを止め、ゴールドを獲得し、タワーを強化しながら高難度マップを攻略します。

| 項目 | 内容 |
| :-- | :-- |
| ジャンル | ブラウザ向けタワーディフェンス |
| 実行方式 | 静的 HTML。ビルド不要 |
| 基本ループ | マップ選択、タワー配置、ウェーブ開始、ゴールド獲得、強化または売却、全ウェーブ突破 |
| メイン画面 | Canvas 戦場、HUD、タワーパネル、強化パネル、マップ選択、設定、ヘルプモーダル |
| 進行保存 | `localStorage` に設定、クリア済みマップ、ハイスコア、チートクリア数を保存 |
| 表示バージョン | `index.html` に `v1.4.0` |

### 遊び方

| 操作 | 内容 |
| :-- | :-- |
| 開始 | ブラウザで `index.html` を開き、New Game を押す |
| マップ選択 | マップメニューから 20 種類のステージを選択 |
| タワー配置 | サイドパネルでタワーを選び、Canvas 上の配置可能タイルをクリック |
| タワー強化 | 配置済みタワーをクリックし、Path A、Path B、Apex を購入 |
| タワー売却 | 選択したタワーを総投資額の 50% で売却 |
| ウェーブ開始 | Start Wave を押す。Auto Wave を使うと自動で次のウェーブへ進む |
| 速度変更 | HUD から `1x` から `5x` まで変更 |
| 勝敗 | 全ウェーブ撃破で勝利。ライフが 0 になると敗北 |

### 主な特徴

| 機能 | 詳細 |
| :-- | :-- |
| 20 マップ | `map01` から `map20` まで難度が上昇。複数ルートや大型終盤マップを含む |
| 14 種タワー | 直接攻撃、範囲攻撃、凍結、毒、磁力、連鎖、呪い、支援、長射程など |
| 19 種敵 | 基本敵に加え、装甲、耐性、弱点、回復、分裂、自爆、ボス行動を持つ敵 |
| 強化システム | Path A は火力、射程、貫通、効果強化。Path B は攻撃速度とマルチショットを強化 |
| Apex 強化 | Path A と Path B が両方 Lv.3 になると解放。火力、射程、攻撃速度、効果、貫通を大幅強化 |
| 動的ウェーブ | 基本ウェーブ、難度倍率、ルート数、最終ボス補正から各マップ用ウェーブを生成 |
| Canvas 描画 | マップ、経路、タワー、敵、弾、パーティクル、HP バー、配置プレビュー、オーバーレイを描画 |
| 音声 | Web Audio API で BGM と効果音を生成 |
| 永続化 | `localStorage` に設定と進行状況を保存 |

### マップ一覧

| ID | 英語名 | テーマ | 難度 | サイズ | 初期 Gold | 初期 Life | Wave | ルート |
| :-- | :-- | :-- | --: | :-- | --: | --: | --: | --: |
| `map01` | Jungle Path | jungle | 1 | 16x12 | 150 | 20 | 20 | 1 |
| `map02` | Desert Serpent | desert | 2 | 18x13 | 130 | 18 | 22 | 2 |
| `map03` | Frozen Fortress | snow | 3 | 18x14 | 120 | 15 | 24 | 1 |
| `map04` | Lava Maze | lava | 4 | 20x14 | 110 | 12 | 25 | 3 |
| `map05` | Sky Islands | sky | 5 | 20x15 | 100 | 10 | 26 | 1 |
| `map06` | Sunken Ruins | ocean | 6 | 18x14 | 130 | 15 | 28 | 4 |
| `map07` | Ancient Labyrinth | ancient | 7 | 20x16 | 120 | 12 | 30 | 4 |
| `map08` | Mech Fortress | mech | 8 | 20x15 | 115 | 12 | 30 | 3 |
| `map09` | Dark Forest | dark | 9 | 22x16 | 110 | 10 | 32 | 3 |
| `map10` | Cosmic Finale | cosmic | 10 | 24x18 | 200 | 8 | 32 | 6 |
| `map11` | Toxic Wasteland | toxic | 11 | 20x15 | 115 | 12 | 32 | 3 |
| `map12` | Crystal Cavern | crystal | 12 | 20x16 | 110 | 10 | 34 | 2 |
| `map13` | Typhoon Eye | storm | 13 | 22x18 | 105 | 10 | 35 | 3 |
| `map14` | Sacred Corridor | sacred | 14 | 22x18 | 115 | 9 | 36 | 2 |
| `map15` | Chaos Rift | chaos | 15 | 22x18 | 130 | 8 | 38 | 3 |
| `map16` | Abyss Nest | abyss | 16 | 22x18 | 120 | 8 | 40 | 3 |
| `map17` | Temporal Maze | temporal | 17 | 24x18 | 110 | 8 | 42 | 3 |
| `map18` | Mirror World | mirror | 18 | 24x20 | 100 | 6 | 45 | 4 |
| `map19` | Doomsday Forge | doomsday | 19 | 26x20 | 95 | 5 | 50 | 5 |
| `map20` | Genesis End | genesis | 20 | 28x22 | 200 | 5 | 55 | 7 |

### タワー一覧

| タワー ID | Cost | Damage | Range | Fire Rate | 攻撃タイプ | 役割 |
| :-- | --: | --: | --: | --: | :-- | :-- |
| `dart` | 35 | 1 | 150 | 1.5 | dart | 基本弾タワー |
| `bomb` | 90 | 3 | 160 | 0.8 | explosion | 範囲爆発 |
| `ice` | 70 | 0 | 128 | 0.55 | freeze | 範囲スロー / 凍結 |
| `thorn` | 60 | 2 | 224 | 2.0 | poison | 長射程毒攻撃 |
| `wizard` | 100 | 8 | 192 | 0.5 | flame | 高火力範囲攻撃 |
| `eagle` | 200 | 3 | 260 | 1.0 | dart | 長射程弾攻撃 |
| `bell` | 80 | 2 | 224 | 2.5 | sonic | 音波攻撃と短時間凍結 |
| `magnet` | 110 | 0 | 160 | 0.7 | magnet | 磁力付与とスロー |
| `thunder` | 130 | 3 | 192 | 1.0 | thunder | 連鎖攻撃 |
| `mushroom` | 90 | 1 | 192 | 2.0 | poison | 範囲毒 |
| `mirror` | 150 | 2 | 256 | 0.8 | mirror | 長射程特殊弾 |
| `vortex` | 160 | 2 | 224 | 1.5 | vortex | 範囲制御とスロー |
| `oracle` | 200 | 5 | 256 | 0.8 | oracle | 呪い効果 |
| `horn` | 180 | 0 | 320 | 0.35 | support | 周囲タワーを強化 |

### 敵一覧

| 敵 ID | HP | Speed | Reward | Life Damage | 特性 |
| :-- | --: | --: | --: | --: | :-- |
| `red` | 1 | 64 | 1 | 1 | 基本敵 |
| `blue` | 1 | 96 | 1 | 1 | 高速基本敵 |
| `green` | 1 | 160 | 2 | 1 | 超高速 |
| `yellow` | 3 | 64 | 2 | 2 | 高耐久 |
| `armor` | 5 | 77 | 3 | 2 | 装甲 |
| `lead` | 10 | 51 | 5 | 3 | 重装甲 |
| `boss` | 50 | 38 | 20 | 5 | ボス装甲 |
| `steel` | 8 | 58 | 4 | 2 | 装甲、sonic 弱点 |
| `emp` | 6 | 77 | 4 | 2 | thunder 無効、explosion 弱点 |
| `insulated` | 10 | 45 | 5 | 3 | 装甲、thunder 無効、freeze 弱点 |
| `purified` | 5 | 83 | 3 | 1 | poison 無効、freeze 弱点 |
| `gale` | 2 | 288 | 2 | 1 | 超高速、dart/vortex 弱点 |
| `tortoise` | 60 | 22 | 8 | 5 | 高装甲、poison/vortex 弱点 |
| `chrono` | 12 | 96 | 10 | 3 | 特殊行動: `timeJump` |
| `regen` | 15 | 64 | 6 | 2 | HP 回復 |
| `cursed` | 7 | 70 | 5 | 2 | oracle 弱点 |
| `mirror` | 4 | 77 | 3 | 1 | 分裂 |
| `suicide` | 3 | 115 | 1 | 0 | 撃破時に爆発 |
| `shadow` | 8 | 102 | 7 | 3 | dart 無効、oracle 弱点 |

### プログラム分類

| 分類 | ファイル / オブジェクト | 役割 |
| :-- | :-- | :-- |
| HTML 入口 | `index.html` | メニュー、ゲーム画面、HUD、Canvas、サイドパネル、モーダル、CSS/JS 読み込み |
| スタイル | `css/main.css` | レスポンシブレイアウト、HUD、ボタン、タワーカード、モーダル、マップカード、モバイル対応 |
| ゲーム定数 | `js/main.js` 先頭定数 | タイルサイズ、保存キー、通行不可タイル、経路タイル、強化コスト、DOM 参照 |
| タワーデータ | `towerTypes` | コスト、火力、射程、攻撃速度、弾の挙動、攻撃タイプ、特殊効果 |
| 敵データ | `enemyTypes` | HP、速度、報酬、ライフダメージ、装甲、耐性、弱点、特殊行動 |
| 基本ウェーブ | `waves` | 動的ウェーブ生成の元になるテンプレート |
| マップデータ | `MAPS`, `EXPANSION_MAPS` | 実行時に使われる埋め込みマップ定義 |
| マップ素材 | `assets/maps/map01.json` から `map20.json` | マップ定義の外部データ。現行実行時は `js/main.js` 内の定義を使用 |
| 状態管理 | `game`, `settings`, `progress` | 実行中のゲーム状態、ユーザー設定、進行状況 |
| 音声 | `AudioEngine` | Web Audio API による BGM と効果音 |
| ウェーブ処理 | `startWave`, `createMapWaves`, `updateSpawners`, `spawnEnemy` | ウェーブ生成、敵出現、経路割り当て、難度スケール |
| 敵処理 | `updateEnemies`, `killEnemy`, `spawnSplitEnemies` | 移動、毒、凍結、回復、分裂、爆発、報酬、ライフ減少 |
| タワー処理 | `placeTower`, `updateTowers`, `findTarget`, `fireTower` | 配置、ターゲット選択、発射、範囲攻撃、支援効果 |
| ダメージ計算 | `applyDamage`, `calcDamage` | 装甲、耐性、弱点、磁力、呪い、最終ダメージを解決 |
| 強化処理 | `upgradeTower`, `activateApex`, `sellTower` | Path A、Path B、Apex、投資額、売却額 |
| 描画 | `render`, `drawMap`, `drawTowers`, `drawEnemies`, `drawProjectiles`, `drawParticles` | 毎フレームの Canvas 描画 |
| UI | `renderTowerList`, `updateSelection`, `openModal`, `openMapSelect`, `openDetailedHelp`, `openSettings` | パネル、モーダル、マップ選択、ヘルプ、設定 |
| 入力 | Canvas pointer events、ボタンイベント、`cheatDetector` | 配置、選択、速度変更、一時停止、ミュート、メニュー、キーボード入力 |
| 保存 | `loadSettings`, `saveSettings`, `loadProgress`, `saveProgress` | `localStorage` の読み書き |

### 実行フロー

| 手順 | 関数群 | 結果 |
| :-- | :-- | :-- |
| 1 | `resetGame` | 選択マップを読み込み、状態を初期化し、Canvas サイズを調整 |
| 2 | `prepareMap` | Waypoint をタイル座標とピクセル座標へ展開 |
| 3 | `createMapWaves` | 難度と経路数に応じてウェーブを生成 |
| 4 | `startWave` | 現在ウェーブの spawner を作成 |
| 5 | `loop` -> `update` | spawner、敵、タワー、弾、パーティクル、ウェーブ完了判定を更新 |
| 6 | `loop` -> `render` | マップ、ユニット、エフェクト、オーバーレイを再描画 |
| 7 | `endGame` | チート未使用時のみハイスコアとクリア状況を保存 |

### プロジェクト構成

| パス | 用途 |
| :-- | :-- |
| `index.html` | ブラウザ用メイン入口 |
| `css/main.css` | UI 全体とレスポンシブ表示 |
| `js/main.js` | ゲームロジック、データ、描画、UI、音声、保存処理 |
| `assets/maps/` | 20 ステージ分のマップ JSON |
| `Game_description.md` | 元のゲーム仕様説明 |
| `monkey-*-spec.md` | バージョン、マップ、バランス、パッチ仕様 |

### 開発メモ

| 項目 | 内容 |
| :-- | :-- |
| 依存関係 | パッケージマネージャーやバンドラーは不要 |
| 使用 API | Canvas、Dialog、Web Audio、Pointer Events、`requestAnimationFrame`、`crypto.randomUUID`、`localStorage` |
| マップ読み込み | 現在のゲームは `assets/maps/*.json` を fetch せず、`js/main.js` 内のマップ定義を使用 |
| 文字コード | 既存のゲーム内中国語文字列には文字化けが見られるため、この README では読みやすい多言語説明を新規作成 |
| 簡易確認 | `index.html` を開き、ゲーム開始、タワー配置、ウェーブ開始、速度変更、各モーダル表示を確認 |

---

## 繁體中文

### 遊戲介紹

MonkeyFortress TD 是一款以瀏覽器執行的塔防遊戲。玩家需要在格狀地圖上配置猴子防禦塔，阻擋一波波敵人，透過擊破敵人獲得金幣，再升級或調整塔的位置與配置，最終撐過整張地圖的所有波次。

| 項目 | 說明 |
| :-- | :-- |
| 遊戲類型 | 瀏覽器塔防遊戲 |
| 執行方式 | 靜態 HTML，無需建置流程 |
| 核心循環 | 選地圖、放塔、開波、賺金幣、升級或賣塔、撐過所有波次 |
| 主要畫面 | Canvas 戰場、HUD、塔列表、升級面板、地圖選單、設定與說明視窗 |
| 進度保存 | 使用 `localStorage` 保存設定、通關地圖、最高分與作弊通關次數 |
| 版本文字 | `index.html` 顯示 `v1.4.0` |

### 遊戲玩法

| 操作 | 說明 |
| :-- | :-- |
| 開始遊戲 | 用瀏覽器開啟 `index.html`，按下 New Game |
| 選擇地圖 | 從地圖選單選擇 20 張地圖之一 |
| 放置防禦塔 | 在側邊欄選擇塔，再點擊 Canvas 上可放置的格子 |
| 升級防禦塔 | 點擊已放置的塔，購買 Path A、Path B 或 Apex 升級 |
| 賣出防禦塔 | 選取塔後可用總投入金額的 50% 賣出 |
| 開始波次 | 按 Start Wave，或啟用 Auto Wave 自動接續下一波 |
| 遊戲速度 | HUD 可切換 `1x` 到 `5x` |
| 勝敗條件 | 清完全部波次勝利；生命值歸零失敗 |

### 主要特色

| 特色 | 詳細說明 |
| :-- | :-- |
| 20 張地圖 | 從 `map01` 到 `map20` 難度逐步提高，包含多路線、大尺寸與終盤高壓地圖 |
| 14 種防禦塔 | 涵蓋直線傷害、範圍爆炸、冰凍、毒、磁力、連鎖、詛咒、支援、長射程等定位 |
| 19 種敵人 | 包含基本敵、裝甲、免疫、弱點、回血、分裂、自爆與 Boss 行為 |
| 雙路線升級 | Path A 偏向傷害、射程、穿透與效果增強；Path B 偏向攻速與多重射擊 |
| Apex 強化 | Path A 與 Path B 都升到 Lv.3 後解鎖，大幅提高傷害、射程、攻速、特效與穿透 |
| 動態波次 | 依照基礎波次、地圖難度、多路徑與最後 Boss 補正產生不同地圖的波次 |
| Canvas 繪製 | 地圖、道路、塔、敵人、投射物、粒子、血條、放置預覽與狀態遮罩都由 Canvas 繪製 |
| 音效系統 | 使用 Web Audio API 產生背景音與音效 |
| 進度保存 | 設定與遊戲進度會保留在瀏覽器 `localStorage` |

### 地圖總覽

| ID | 英文名稱 | 主題 | 難度 | 尺寸 | 初始金幣 | 初始生命 | 波次 | 路徑 |
| :-- | :-- | :-- | --: | :-- | --: | --: | --: | --: |
| `map01` | Jungle Path | jungle | 1 | 16x12 | 150 | 20 | 20 | 1 |
| `map02` | Desert Serpent | desert | 2 | 18x13 | 130 | 18 | 22 | 2 |
| `map03` | Frozen Fortress | snow | 3 | 18x14 | 120 | 15 | 24 | 1 |
| `map04` | Lava Maze | lava | 4 | 20x14 | 110 | 12 | 25 | 3 |
| `map05` | Sky Islands | sky | 5 | 20x15 | 100 | 10 | 26 | 1 |
| `map06` | Sunken Ruins | ocean | 6 | 18x14 | 130 | 15 | 28 | 4 |
| `map07` | Ancient Labyrinth | ancient | 7 | 20x16 | 120 | 12 | 30 | 4 |
| `map08` | Mech Fortress | mech | 8 | 20x15 | 115 | 12 | 30 | 3 |
| `map09` | Dark Forest | dark | 9 | 22x16 | 110 | 10 | 32 | 3 |
| `map10` | Cosmic Finale | cosmic | 10 | 24x18 | 200 | 8 | 32 | 6 |
| `map11` | Toxic Wasteland | toxic | 11 | 20x15 | 115 | 12 | 32 | 3 |
| `map12` | Crystal Cavern | crystal | 12 | 20x16 | 110 | 10 | 34 | 2 |
| `map13` | Typhoon Eye | storm | 13 | 22x18 | 105 | 10 | 35 | 3 |
| `map14` | Sacred Corridor | sacred | 14 | 22x18 | 115 | 9 | 36 | 2 |
| `map15` | Chaos Rift | chaos | 15 | 22x18 | 130 | 8 | 38 | 3 |
| `map16` | Abyss Nest | abyss | 16 | 22x18 | 120 | 8 | 40 | 3 |
| `map17` | Temporal Maze | temporal | 17 | 24x18 | 110 | 8 | 42 | 3 |
| `map18` | Mirror World | mirror | 18 | 24x20 | 100 | 6 | 45 | 4 |
| `map19` | Doomsday Forge | doomsday | 19 | 26x20 | 95 | 5 | 50 | 5 |
| `map20` | Genesis End | genesis | 20 | 28x22 | 200 | 5 | 55 | 7 |

### 防禦塔總覽

| 塔 ID | 花費 | 傷害 | 射程 | 攻速 | 攻擊類型 | 定位 |
| :-- | --: | --: | --: | --: | :-- | :-- |
| `dart` | 35 | 1 | 150 | 1.5 | dart | 基礎投射物塔 |
| `bomb` | 90 | 3 | 160 | 0.8 | explosion | 範圍爆炸 |
| `ice` | 70 | 0 | 128 | 0.55 | freeze | 範圍緩速 / 冰凍 |
| `thorn` | 60 | 2 | 224 | 2.0 | poison | 長射程毒傷 |
| `wizard` | 100 | 8 | 192 | 0.5 | flame | 高傷害範圍攻擊 |
| `eagle` | 200 | 3 | 260 | 1.0 | dart | 長射程投射物 |
| `bell` | 80 | 2 | 224 | 2.5 | sonic | 音波傷害與短冰凍 |
| `magnet` | 110 | 0 | 160 | 0.7 | magnet | 磁化與緩速 |
| `thunder` | 130 | 3 | 192 | 1.0 | thunder | 連鎖打擊 |
| `mushroom` | 90 | 1 | 192 | 2.0 | poison | 範圍毒傷 |
| `mirror` | 150 | 2 | 256 | 0.8 | mirror | 長射程特殊攻擊 |
| `vortex` | 160 | 2 | 224 | 1.5 | vortex | 範圍控場與緩速 |
| `oracle` | 200 | 5 | 256 | 0.8 | oracle | 詛咒效果 |
| `horn` | 180 | 0 | 320 | 0.35 | support | 強化周圍防禦塔 |

### 敵人總覽

| 敵人 ID | HP | 速度 | 獎勵 | 生命傷害 | 特性 |
| :-- | --: | --: | --: | --: | :-- |
| `red` | 1 | 64 | 1 | 1 | 基本敵 |
| `blue` | 1 | 96 | 1 | 1 | 較快的基本敵 |
| `green` | 1 | 160 | 2 | 1 | 高速敵 |
| `yellow` | 3 | 64 | 2 | 2 | 較高生命 |
| `armor` | 5 | 77 | 3 | 2 | 裝甲 |
| `lead` | 10 | 51 | 5 | 3 | 重裝甲 |
| `boss` | 50 | 38 | 20 | 5 | Boss 裝甲 |
| `steel` | 8 | 58 | 4 | 2 | 裝甲、弱音波 |
| `emp` | 6 | 77 | 4 | 2 | 免疫雷電、弱爆炸 |
| `insulated` | 10 | 45 | 5 | 3 | 裝甲、免疫雷電、弱冰凍 |
| `purified` | 5 | 83 | 3 | 1 | 免疫毒、弱冰凍 |
| `gale` | 2 | 288 | 2 | 1 | 超高速、弱 dart/vortex |
| `tortoise` | 60 | 22 | 8 | 5 | 高裝甲、弱毒與 vortex |
| `chrono` | 12 | 96 | 10 | 3 | 特殊行為：`timeJump` |
| `regen` | 15 | 64 | 6 | 2 | 會回血 |
| `cursed` | 7 | 70 | 5 | 2 | 弱 oracle |
| `mirror` | 4 | 77 | 3 | 1 | 會分裂 |
| `suicide` | 3 | 115 | 1 | 0 | 死亡爆炸 |
| `shadow` | 8 | 102 | 7 | 3 | 免疫 dart、弱 oracle |

### 程式分類詳細介紹

| 分類 | 檔案 / 物件 | 職責 |
| :-- | :-- | :-- |
| HTML 入口 | `index.html` | 定義主選單、遊戲畫面、HUD、Canvas、側邊欄、Modal，以及載入 CSS/JS |
| 視覺樣式 | `css/main.css` | 負責響應式版面、HUD、按鈕、塔卡片、Modal、地圖卡片與手機版排版 |
| 遊戲常數 | `js/main.js` 頂層常數 | 定義格子大小、存檔 key、道路符號、阻擋符號、升級花費、DOM 參照 |
| 防禦塔資料 | `towerTypes` | 定義塔的花費、傷害、射程、攻速、投射物、攻擊類型與特殊效果 |
| 敵人資料 | `enemyTypes` | 定義 HP、速度、獎勵、扣血、裝甲、免疫、弱點與特殊行為 |
| 基礎波次 | `waves` | 動態產生每張地圖波次的基礎模板 |
| 地圖資料 | `MAPS`, `EXPANSION_MAPS` | 遊戲執行時實際使用的內嵌地圖定義 |
| 地圖素材 | `assets/maps/map01.json` 到 `map20.json` | 外部地圖資料，用於對照或文件化；目前遊戲執行時使用 `js/main.js` 內嵌地圖 |
| 狀態管理 | `game`, `settings`, `progress` | 保存當前遊戲狀態、玩家設定與通關紀錄 |
| 音效系統 | `AudioEngine` | 使用 Web Audio API 產生背景音樂與音效 |
| 波次系統 | `startWave`, `createMapWaves`, `updateSpawners`, `spawnEnemy` | 建立波次、安排出怪、指定路徑與依難度放大敵人數量 |
| 敵人系統 | `updateEnemies`, `killEnemy`, `spawnSplitEnemies` | 處理移動、毒、冰凍、回血、分裂、爆炸、擊殺獎勵與生命扣除 |
| 防禦塔系統 | `placeTower`, `updateTowers`, `findTarget`, `fireTower` | 處理放塔、尋找目標、發射投射物、範圍攻擊與支援效果 |
| 傷害系統 | `applyDamage`, `calcDamage` | 計算裝甲減傷、免疫、弱點倍率、磁化增傷、詛咒增傷與最終傷害 |
| 升級系統 | `upgradeTower`, `activateApex`, `sellTower` | 處理 Path A、Path B、Apex、投入金額與賣塔收益 |
| 繪製系統 | `render`, `drawMap`, `drawTowers`, `drawEnemies`, `drawProjectiles`, `drawParticles` | 每個動畫幀重繪地圖、角色、投射物、粒子與遮罩 |
| 介面系統 | `renderTowerList`, `updateSelection`, `openModal`, `openMapSelect`, `openDetailedHelp`, `openSettings` | 更新塔列表、選取面板、Modal、地圖選擇、詳細說明與設定 |
| 輸入控制 | Canvas pointer events、按鈕事件、`cheatDetector` | 處理放置、選取、速度、暫停、靜音、回首頁、鍵盤作弊序列 |
| 資料保存 | `loadSettings`, `saveSettings`, `loadProgress`, `saveProgress` | 讀寫瀏覽器 `localStorage` |

### 遊戲執行流程

| 步驟 | 函式群 | 結果 |
| :-- | :-- | :-- |
| 1 | `resetGame` | 載入選定地圖、重置狀態、調整 Canvas 尺寸 |
| 2 | `prepareMap` | 將 waypoint 展開成格子座標與像素座標 |
| 3 | `createMapWaves` | 依地圖難度與路徑數產生波次 |
| 4 | `startWave` | 建立目前波次的 spawner |
| 5 | `loop` -> `update` | 更新出怪、敵人、塔、投射物、粒子與通關判定 |
| 6 | `loop` -> `render` | 重繪地圖、單位、特效與狀態遮罩 |
| 7 | `endGame` | 未作弊通關時保存最高分與完成狀態 |

### 專案結構

| 路徑 | 用途 |
| :-- | :-- |
| `index.html` | 瀏覽器主要入口 |
| `css/main.css` | 整體 UI、版面與響應式樣式 |
| `js/main.js` | 遊戲邏輯、資料、繪圖、UI、音效與保存 |
| `assets/maps/` | 20 張地圖 JSON |
| `Game_description.md` | 原始遊戲說明 |
| `monkey-*-spec.md` | 版本、地圖、平衡與 patch 規格文件 |

### 開發備註

| 主題 | 說明 |
| :-- | :-- |
| 依賴 | 不需要 npm、打包器或後端服務 |
| 使用 API | Canvas、Dialog、Web Audio、Pointer Events、`requestAnimationFrame`、`crypto.randomUUID`、`localStorage` |
| 地圖來源 | 目前執行中的遊戲讀取 `js/main.js` 內的地圖定義，不會 fetch `assets/maps/*.json` |
| 文字編碼 | 現有遊戲內部分中文字串看起來已有亂碼，因此 README 以重新整理後的三語內容說明 |
| 快速測試 | 開啟 `index.html`，開始遊戲、放塔、開波、切換速度、開啟地圖/設定/說明視窗 |

