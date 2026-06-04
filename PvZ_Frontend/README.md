# Garden Defenders

> A lane-based browser tower-defense game inspired by classic plant-versus-zombie defense gameplay.  
> HTML5 + CSS3 + Vanilla JavaScript. No build step and no external packages are required.

## Language Index

| Language | Section |
|---|---|
| English | [English README](#english-readme) |
| 日本語 | [日本語 README](#日本語-readme) |
| 繁體中文 | [繁體中文 README](#繁體中文-readme) |

---

# English README

## Project Snapshot

| Item | Description |
|---|---|
| Game Title | Garden Defenders |
| Genre | Browser-based lane tower defense |
| Tech Stack | HTML5, CSS3, Vanilla JavaScript |
| Audio | Web Audio API generated music and sound effects |
| Save System | `localStorage` |
| Board Size | 5 rows x 9 columns |
| Level Count | 50 generated levels |
| Plant Cards | Up to 12 selected cards per battle |
| Data Scale | 32 plant definitions, 20 zombie definitions |
| Entry File | `index.html` |

## Game Introduction

Garden Defenders is a single-page browser game where players defend a 5-lane garden from incoming zombie waves. Players collect sun resources, choose plant cards, place plants on the lawn, and survive every wave in the selected level.

The game focuses on quick tactical decisions: building a stable economy, choosing the correct defensive layout, using burst-damage plants at the right time, and adapting to special zombie types as later levels become more complex.

## Quick Start

| Step | Action |
|---|---|
| 1 | Open this project folder. |
| 2 | Open `index.html` in a modern browser. |
| 3 | Choose `New Game`, `Continue`, or `Practice`. |
| 4 | Select plants and start the battle. |

No `npm install` is needed because the project is a static frontend game.

## Core Gameplay

| System | Details |
|---|---|
| Sun Economy | Sun falls naturally and can also be produced by specific plants. Sun is spent to place plants. |
| Plant Selection | Before each battle, choose up to 12 plants from the full plant list. |
| Grid Defense | Plants are placed on a 5x9 board. Zombies enter from the right and move left by lane. |
| Waves | Each level generates multiple waves, including large pressure waves. |
| Mowers | Each row has a one-time mower safety line. After it is used, that row becomes vulnerable. |
| Win Condition | Clear all waves and all remaining zombies. |
| Lose Condition | A zombie reaches the left side after the row mower has already been used. |
| Progression | Winning non-practice levels records score and unlocks the next level. |

## Main Features

| Feature | Description |
|---|---|
| 50-Level Campaign | Levels are generated from a scaling wave algorithm. Enemy pressure increases with level and wave count. |
| Practice Mode | Allows selecting any level without depending on unlocked campaign progress. |
| Day/Night Logic | Levels 35 and above use night mode, slower natural sun timing, and a different visual theme. |
| Plant Encyclopedia | Displays all plant cards, stats, cooldowns, costs, and behavior descriptions. |
| Zombie Encyclopedia | Displays zombie stats, armor, score value, movement speed, and special traits. |
| Auto Sun Toggle | Lets players switch automatic sun collection on or off during battle. |
| Settings | Master volume, music volume, SFX volume, and vibration settings are persisted. |
| Responsive Layout | CSS variables and media queries adjust the board, HUD, hand cards, dialogs, and encyclopedia for desktop and mobile. |

## Plant Role Categories

| Category | Examples of Behavior |
|---|---|
| Sun Producers | Generate sun at intervals and support the economy. |
| Shooters | Fire straight projectiles in their lane. |
| Multi-Shot Plants | Fire multiple shots or attack multiple rows. |
| Lobbers | Launch arcing projectiles with direct or splash damage. |
| Walls | Absorb damage and slow down zombie progress. |
| Bombs and Mines | Deal burst damage after placement or after arming. |
| Spike / Ground Damage | Damage grounded zombies in close range. |
| Control Plants | Slow, stun, burn, poison, knock back, or charm zombies. |
| Utility Plants | Heal allies, remove armor, chain lightning, or apply aura effects. |

## Zombie Role Categories

| Category | Examples of Behavior |
|---|---|
| Basic Zombies | Standard lane pressure with simple walking and biting behavior. |
| Armored Zombies | Carry armor that must be removed before HP is fully damaged. |
| Fast Zombies | Move faster and punish weak lanes. |
| Jumping Zombies | Can jump over non-tall plants once. |
| Summoner / Dancer Zombies | Spawn additional zombies around themselves. |
| Flying Zombies | Ignore some ground-based plant attacks. |
| Tunnel Zombies | Enter closer to the garden and shorten reaction time. |
| Ranged Zombies | Attack plants from a greater distance. |
| Support Zombies | Heal or buff nearby zombies. |
| Boss Zombie | High HP, armor, damage, and score value for late-game pressure. |

## Controls

| Action | Control |
|---|---|
| Select Plant Card | Click/tap a plant card in the HUD |
| Place Plant | Click/tap a valid grid cell |
| Collect Sun | Click/tap a sun orb, or enable auto collection |
| Remove Plant | Click/tap the shovel, then click/tap a planted cell |
| Pause / Resume | `Esc` or the pause button |
| Card Hotkeys | `1` to `0`, `-`, `=` map to plant card slots 1-12 |

## Program Classification

| File | Category | Main Responsibility |
|---|---|---|
| `index.html` | App Shell | Defines the game screens, dialogs, HUD, board containers, overlays, and script loading order. |
| `css/styles.css` | Presentation Layer | Handles layout, board sizing, responsive rules, colors, animations, entities, HUD, dialogs, and encyclopedia styling. |
| `js/data.js` | Static Data / Level Generation | Defines constants, plant data, zombie data, level generation, wave composition, and global level data. |
| `js/save-system.js` | Persistence | Loads and saves high scores, unlocked levels, settings, and save defaults through `localStorage`. |
| `js/audio.js` | Audio Layer | Uses the Web Audio API to synthesize menu music, battle music, and sound effects. |
| `js/state.js` | Runtime State / Shared Helpers | Stores the active game state, DOM references, level helpers, screen switching, toast messages, vibration, and time formatting. |
| `js/ui.js` | UI Construction / Battle Setup | Builds the board, plant selection UI, chosen slots, encyclopedia, hand cards, placement logic, reset logic, sun spawning, and wave spawning helpers. |
| `js/game-systems.js` | Game Simulation / Rendering | Updates plants, zombies, projectiles, suns, effects, mowers, win/lose checks, and renders active entities into the DOM. |
| `js/main.js` | Bootstrap / Input Binding | Binds all UI events, initializes the board and plant selection, starts music, handles pause/settings/menu flow, and runs the animation loop. |
| `PvZ_Frontend_Spec.md` | Design Spec | Contains the broader design notes, target systems, UI ideas, and implementation planning material. |

## Script Loading Order

| Order | Script | Why It Loads Here |
|---:|---|---|
| 1 | `js/data.js` | Constants and definitions must exist before other systems use them. |
| 2 | `js/save-system.js` | Save defaults and settings are needed by audio and state helpers. |
| 3 | `js/audio.js` | Audio engine reads saved settings and is used by UI/game events. |
| 4 | `js/state.js` | Creates global state and shared DOM/helper functions. |
| 5 | `js/ui.js` | Builds UI elements and provides placement/setup helpers. |
| 6 | `js/game-systems.js` | Provides update and render systems used by the main loop. |
| 7 | `js/main.js` | Wires everything together and starts `requestAnimationFrame`. |

## Runtime Flow

| Phase | What Happens |
|---|---|
| Boot | `main.js` binds UI events, builds the board, builds plant selection, renders the hand, and starts the animation loop. |
| Menu | Player chooses new game, continue, practice, encyclopedia, or settings. |
| Plant Select | Player selects a level and up to 12 plant cards. |
| Battle Start | `resetGame(level)` clears runtime entities and loads generated level wave data. |
| Update Loop | `update(dt)` advances sun, waves, plants, zombies, projectiles, effects, mowers, and end-state checks. |
| Render Loop | `render()` writes current plants, zombies, projectiles, suns, effects, and mowers into `entityLayer`. |
| Result | Win/loss overlay displays time, score, kills, and wave progress. Campaign wins update save data. |

## Runtime State Groups

| State Group | Fields / Purpose |
|---|---|
| Game Phase | `phase`, `paused`, `won`, `gameOver`, `practiceMode` |
| Level Progress | `level`, `wave`, `totalWaves`, `time`, `nextWaveAt`, `pendingSpawns` |
| Player Resources | `sun`, `score`, `kills`, `selectedPlants`, `cooldowns` |
| Active Entities | `plants`, `zombies`, `projectiles`, `effects`, `suns`, `mowers` |
| Interaction State | `handPlant`, `shovel`, `autoCollectSun` |
| Utility State | `nextId`, `lastNaturalSun`, `spawnedInWave` |

## Extension Guide

| Goal | Where to Edit |
|---|---|
| Add a plant | Add a definition in `PlantDefs`, then update behavior in `updatePlants()` or helper functions if the plant has a new `kind`. |
| Add a zombie | Add a definition in `ZombieDefs`, then update `updateZombies()` or `damageZombie()` if it needs a new special rule. |
| Adjust level difficulty | Modify `generateLevel(level)` in `js/data.js`. |
| Change visuals | Edit CSS variables, entity classes, animations, and responsive rules in `css/styles.css`. |
| Change save behavior | Update `SaveSystem.defaultSave()`, `load()`, `save()`, or `recordScore()`. |
| Add a new screen | Add markup in `index.html`, styles in `css/styles.css`, and event/state logic in `main.js` / `state.js`. |

---

# 日本語 README

## プロジェクト概要

| 項目 | 内容 |
|---|---|
| ゲーム名 | Garden Defenders |
| ジャンル | ブラウザ向けレーン型タワーディフェンス |
| 技術構成 | HTML5, CSS3, Vanilla JavaScript |
| 音声 | Web Audio API による音楽・効果音生成 |
| セーブ | `localStorage` |
| 盤面 | 5 行 x 9 列 |
| レベル数 | 自動生成される 50 レベル |
| 植物カード | 1 バトルにつき最大 12 種類を選択 |
| データ規模 | 植物 32 種、ゾンビ 20 種 |
| 起動ファイル | `index.html` |

## ゲーム紹介

Garden Defenders は、5 本のレーンを守るブラウザゲームです。プレイヤーは太陽リソースを集め、植物カードを選び、芝生のマスに植物を配置して、右側から迫ってくるゾンビの波をすべて防ぎます。

序盤は資源を安定させることが重要です。中盤以降は、壁役、範囲攻撃、状態異常、即時火力、特殊ゾンビへの対策を組み合わせる必要があります。

## クイックスタート

| 手順 | 操作 |
|---|---|
| 1 | このプロジェクトフォルダを開きます。 |
| 2 | `index.html` をブラウザで開きます。 |
| 3 | `New Game`、`Continue`、または `Practice` を選びます。 |
| 4 | 植物を選択してバトルを開始します。 |

このプロジェクトは静的フロントエンドなので、`npm install` は不要です。

## 基本ルール

| システム | 内容 |
|---|---|
| 太陽リソース | 自然落下する太陽や植物が生産する太陽を集め、植物配置に使います。 |
| 植物選択 | バトル前に、植物リストから最大 12 種類を選択します。 |
| グリッド防衛 | 5x9 の盤面に植物を置き、ゾンビは右から左へ進みます。 |
| ウェーブ | 各レベルは複数のウェーブを持ち、大量出現ウェーブも含みます。 |
| 芝刈り機 | 各レーンに一度だけ発動する安全装置があります。使用後のレーンは危険になります。 |
| 勝利条件 | 全ウェーブと残りのゾンビをすべて倒すこと。 |
| 敗北条件 | 芝刈り機使用後のレーンで、ゾンビが左端に到達すること。 |
| 進行 | 練習モード以外で勝利するとスコアが記録され、次のレベルが解放されます。 |

## 主な機能

| 機能 | 説明 |
|---|---|
| 50 レベル構成 | レベル生成アルゴリズムにより、敵の種類と圧力が段階的に増えます。 |
| 練習モード | 解放状況に関係なく、任意のレベルを選べます。 |
| 昼夜ロジック | レベル 35 以降は夜モードになり、自然太陽の間隔や背景が変わります。 |
| 植物図鑑 | 植物のコスト、HP、クールダウン、能力説明を確認できます。 |
| ゾンビ図鑑 | ゾンビの HP、装甲、速度、攻撃力、得点、特殊能力を確認できます。 |
| 自動太陽回収 | バトル中に太陽の自動回収を切り替えられます。 |
| 設定画面 | マスター音量、音楽、効果音、振動設定を保存できます。 |
| レスポンシブ UI | デスクトップとモバイルで盤面、HUD、カード、ダイアログ、図鑑が調整されます。 |

## 植物の役割分類

| 分類 | 代表的な挙動 |
|---|---|
| 太陽生産 | 一定間隔で太陽を生成し、経済を支えます。 |
| 射撃 | 同じレーンに直線弾を撃ちます。 |
| 複数射撃 | 複数弾、複数行、または連射で攻撃します。 |
| 投射 | 放物線型の弾や範囲ダメージで攻撃します。 |
| 壁役 | 高い HP でゾンビの進行を止めます。 |
| 爆弾・地雷 | 配置後または起動後に大ダメージを与えます。 |
| 地面ダメージ | 接近した地上ゾンビに継続的な近距離ダメージを与えます。 |
| 状態異常 | 鈍化、スタン、炎上、毒、ノックバック、魅了などを付与します。 |
| 補助 | 回復、装甲除去、連鎖攻撃、周囲への加速効果などを行います。 |

## ゾンビの役割分類

| 分類 | 代表的な挙動 |
|---|---|
| 通常型 | 基本的な歩行と噛みつきでレーンに圧力をかけます。 |
| 装甲型 | HP の前に装甲を削る必要があります。 |
| 高速型 | 防御が薄いレーンを素早く突破します。 |
| ジャンプ型 | 背の高くない植物を一度飛び越えます。 |
| 召喚型 | 周囲に追加ゾンビを出現させます。 |
| 飛行型 | 一部の地面攻撃を受けにくいタイプです。 |
| トンネル型 | 庭に近い位置から出現し、対応時間を短くします。 |
| 遠距離型 | 離れた位置から植物を攻撃します。 |
| 支援型 | 近くのゾンビを回復、または補助します。 |
| ボス型 | 高い HP、装甲、攻撃力を持つ終盤向けの強敵です。 |

## 操作方法

| 操作 | 入力 |
|---|---|
| 植物カード選択 | HUD の植物カードをクリック / タップ |
| 植物配置 | 有効なマスをクリック / タップ |
| 太陽回収 | 太陽をクリック / タップ、または自動回収を有効化 |
| 植物撤去 | シャベルを選び、配置済みマスをクリック / タップ |
| 一時停止 / 再開 | `Esc` または一時停止ボタン |
| カードショートカット | `1` から `0`、`-`、`=` がカード枠 1-12 に対応 |

## プログラム分類

| ファイル | 分類 | 主な役割 |
|---|---|---|
| `index.html` | アプリ外枠 | 画面、ダイアログ、HUD、盤面コンテナ、オーバーレイ、スクリプト読み込み順を定義します。 |
| `css/styles.css` | 表示レイヤー | レイアウト、盤面サイズ、レスポンシブ設定、色、アニメーション、エンティティ、HUD、図鑑の見た目を管理します。 |
| `js/data.js` | 静的データ / レベル生成 | 定数、植物データ、ゾンビデータ、レベル生成、ウェーブ構成を定義します。 |
| `js/save-system.js` | 永続化 | `localStorage` を使い、ハイスコア、解放レベル、設定、初期セーブ値を管理します。 |
| `js/audio.js` | 音声レイヤー | Web Audio API でメニュー音楽、バトル音楽、効果音を生成します。 |
| `js/state.js` | 実行時状態 / 共通ヘルパー | ゲーム状態、DOM 参照、レベル判定、画面切替、通知、振動、時間整形を管理します。 |
| `js/ui.js` | UI 構築 / バトル準備 | 盤面生成、植物選択、選択スロット、図鑑、手札、配置、リセット、太陽生成、ウェーブ生成補助を担当します。 |
| `js/game-systems.js` | シミュレーション / 描画 | 植物、ゾンビ、弾、太陽、エフェクト、芝刈り機、勝敗判定、DOM 描画を更新します。 |
| `js/main.js` | 起動 / 入力接続 | UI イベントを接続し、初期化、音楽開始、メニュー遷移、設定、一時停止、メインループを管理します。 |
| `PvZ_Frontend_Spec.md` | 設計資料 | ゲームシステム、UI、実装方針の設計メモです。 |

## スクリプト読み込み順

| 順番 | スクリプト | 理由 |
|---:|---|---|
| 1 | `js/data.js` | 定数と定義を先に読み込む必要があります。 |
| 2 | `js/save-system.js` | セーブ設定は音声や状態管理で使われます。 |
| 3 | `js/audio.js` | 保存済み音量設定を読み込み、イベントから呼ばれます。 |
| 4 | `js/state.js` | グローバル状態と共通関数を作成します。 |
| 5 | `js/ui.js` | UI と配置・準備系の処理を提供します。 |
| 6 | `js/game-systems.js` | 更新処理と描画処理を提供します。 |
| 7 | `js/main.js` | 全体を接続し、`requestAnimationFrame` を開始します。 |

## 実行時フロー

| フェーズ | 内容 |
|---|---|
| 起動 | イベント接続、盤面生成、植物選択生成、手札描画、アニメーションループ開始。 |
| メニュー | 新規開始、続き、練習、図鑑、設定を選択。 |
| 植物選択 | レベルと最大 12 種類の植物を選択。 |
| バトル開始 | `resetGame(level)` がエンティティを初期化し、レベルのウェーブデータを読み込みます。 |
| 更新ループ | `update(dt)` が太陽、ウェーブ、植物、ゾンビ、弾、エフェクト、芝刈り機、勝敗を進めます。 |
| 描画ループ | `render()` が現在のエンティティを `entityLayer` に反映します。 |
| 結果 | 勝敗、時間、スコア、撃破数、ウェーブ進行を表示し、勝利時はセーブを更新します。 |

## 状態管理グループ

| グループ | 目的 |
|---|---|
| ゲームフェーズ | `phase`, `paused`, `won`, `gameOver`, `practiceMode` |
| レベル進行 | `level`, `wave`, `totalWaves`, `time`, `nextWaveAt`, `pendingSpawns` |
| プレイヤー資源 | `sun`, `score`, `kills`, `selectedPlants`, `cooldowns` |
| アクティブ要素 | `plants`, `zombies`, `projectiles`, `effects`, `suns`, `mowers` |
| 操作状態 | `handPlant`, `shovel`, `autoCollectSun` |
| 補助状態 | `nextId`, `lastNaturalSun`, `spawnedInWave` |

## 拡張ガイド

| やりたいこと | 編集場所 |
|---|---|
| 植物を追加 | `PlantDefs` に追加し、新しい `kind` が必要なら `updatePlants()` などを更新します。 |
| ゾンビを追加 | `ZombieDefs` に追加し、特殊能力が必要なら `updateZombies()` や `damageZombie()` を更新します。 |
| 難易度を調整 | `js/data.js` の `generateLevel(level)` を変更します。 |
| 見た目を変更 | `css/styles.css` の CSS 変数、クラス、アニメーション、レスポンシブ設定を変更します。 |
| セーブ仕様を変更 | `SaveSystem.defaultSave()`, `load()`, `save()`, `recordScore()` を変更します。 |
| 画面を追加 | `index.html`、`css/styles.css`、`main.js`、`state.js` に画面と遷移を追加します。 |

---

# 繁體中文 README

## 專案概覽

| 項目 | 說明 |
|---|---|
| 遊戲名稱 | Garden Defenders |
| 類型 | 瀏覽器橫向路線塔防遊戲 |
| 技術 | HTML5, CSS3, Vanilla JavaScript |
| 音效 | 使用 Web Audio API 產生音樂與音效 |
| 存檔 | `localStorage` |
| 棋盤 | 5 行 x 9 列 |
| 關卡 | 50 個自動生成關卡 |
| 植物卡 | 每場最多選擇 12 種植物 |
| 資料規模 | 32 種植物、20 種殭屍 |
| 入口檔案 | `index.html` |

## 遊戲介紹

Garden Defenders 是一款純前端瀏覽器塔防遊戲。玩家需要在 5 條草坪路線上配置植物，蒐集太陽資源，抵擋從右側進攻的殭屍波次，並在每個關卡中撐過所有攻勢。

遊戲核心是「資源管理 + 卡組選擇 + 路線防守」。前期需要建立太陽經濟，中期開始要補足火力、牆體與範圍傷害，後期則需要針對裝甲、飛行、跳躍、遠程、治療與 Boss 型殭屍安排對策。

## 快速開始

| 步驟 | 操作 |
|---|---|
| 1 | 開啟本專案資料夾。 |
| 2 | 用瀏覽器開啟 `index.html`。 |
| 3 | 選擇 `New Game`、`Continue` 或 `Practice`。 |
| 4 | 選擇植物並開始戰鬥。 |

本專案是靜態前端遊戲，不需要安裝 npm 套件，也不需要編譯流程。

## 核心玩法

| 系統 | 說明 |
|---|---|
| 太陽經濟 | 太陽會自然掉落，也能由特定植物產生；放置植物需要消耗太陽。 |
| 植物選卡 | 開戰前可從完整植物清單中選擇最多 12 種植物。 |
| 棋盤防守 | 植物放置在 5x9 棋盤上，殭屍從右往左依路線推進。 |
| 波次進攻 | 每個關卡包含多個波次，並有高壓的大波次。 |
| 割草機 | 每一行有一次保命用割草機；用掉後該路線會變得危險。 |
| 勝利條件 | 清除所有波次與場上殭屍。 |
| 失敗條件 | 某行割草機已用掉後，殭屍抵達左側底線。 |
| 關卡進度 | 非練習模式勝利後會記錄分數並解鎖下一關。 |

## 主要功能

| 功能 | 說明 |
|---|---|
| 50 關戰役 | 使用 `generateLevel(level)` 依關卡自動生成波次，難度會逐步上升。 |
| 練習模式 | 可直接選擇任意關卡，不受解鎖進度限制。 |
| 日夜關卡 | 第 35 關後進入夜間邏輯，自然太陽間隔變長，視覺背景也會切換。 |
| 植物圖鑑 | 可查看植物成本、HP、冷卻、攻擊間隔與能力說明。 |
| 殭屍圖鑑 | 可查看殭屍 HP、裝甲、速度、傷害、分數與特殊特性。 |
| 自動收集太陽 | 戰鬥中可切換自動收集太陽。 |
| 設定系統 | 可保存主音量、音樂音量、音效音量與震動設定。 |
| 響應式介面 | 使用 CSS 變數與 media query，支援桌面、手機直向與手機橫向。 |

## 植物分類

| 分類 | 代表行為 |
|---|---|
| 太陽生產 | 定期產生太陽，支撐經濟。 |
| 射手 | 對同一行發射直線投射物。 |
| 多重射手 | 可連射、多發、或攻擊多行。 |
| 投擲型 | 使用拋射物造成直擊或範圍傷害。 |
| 牆體 | 用高 HP 阻擋殭屍推進。 |
| 炸彈 / 地雷 | 放置後或啟動後造成爆發傷害。 |
| 地面傷害 | 對靠近的地面殭屍造成近距離傷害。 |
| 控制型 | 提供緩速、暈眩、燃燒、中毒、擊退、魅惑等效果。 |
| 輔助型 | 治療友方、移除裝甲、連鎖攻擊或提供加速光環。 |

## 殭屍分類

| 分類 | 代表行為 |
|---|---|
| 基礎型 | 以標準速度前進並啃咬植物。 |
| 裝甲型 | 需要先削掉裝甲才會大量傷到本體 HP。 |
| 高速型 | 移動速度快，容易突破火力不足的路線。 |
| 跳躍型 | 可跳過非高牆植物一次。 |
| 召喚型 | 進場後可在周圍召喚額外殭屍。 |
| 飛行型 | 會避開部分地面型攻擊。 |
| 鑽地型 | 從更靠近庭院的位置出現，縮短反應時間。 |
| 遠程型 | 可在較遠距離攻擊植物。 |
| 支援型 | 治療或干擾周圍單位。 |
| Boss 型 | 擁有高 HP、裝甲、傷害與高分數，是後期壓力來源。 |

## 操作方式

| 動作 | 操作 |
|---|---|
| 選擇植物卡 | 點擊 / 觸控 HUD 上的植物卡 |
| 放置植物 | 點擊 / 觸控有效棋盤格 |
| 收集太陽 | 點擊 / 觸控太陽，或開啟自動收集 |
| 移除植物 | 點擊鏟子，再點擊已種植的格子 |
| 暫停 / 繼續 | `Esc` 或暫停按鈕 |
| 卡片快捷鍵 | `1` 到 `0`、`-`、`=` 對應第 1 到 12 張植物卡 |

## 程式分類詳細介紹

| 檔案 | 分類 | 主要職責 |
|---|---|---|
| `index.html` | 應用外殼 | 定義主選單、選卡畫面、戰鬥畫面、HUD、棋盤容器、暫停/結果/設定/圖鑑彈窗，以及 JS 載入順序。 |
| `css/styles.css` | 視覺與版面層 | 管理整體視覺、草坪棋盤、HUD、植物卡、殭屍/植物/子彈/太陽、動畫、RWD、夜間背景與彈窗樣式。 |
| `js/data.js` | 靜態資料與關卡生成 | 定義 `ROWS`、`COLS`、`MAX_LEVEL`、植物資料、殭屍資料、波次生成邏輯與 `Levels`。 |
| `js/save-system.js` | 存檔系統 | 透過 `localStorage` 讀寫高分、已解鎖關卡、音量/震動設定與預設存檔。 |
| `js/audio.js` | 音訊系統 | 使用 Web Audio API 建立音效、雜訊、選單音樂、戰鬥音樂與音量套用邏輯。 |
| `js/state.js` | 遊戲狀態與共用工具 | 保存 `State`、DOM 快捷存取、關卡輔助函式、畫面切換、提示訊息、震動與時間格式化。 |
| `js/ui.js` | UI 建立與戰鬥準備 | 建立棋盤、植物選擇、已選插槽、圖鑑、手牌、植物放置、重置戰鬥、太陽生成、波次生成與殭屍生成輔助。 |
| `js/game-systems.js` | 遊戲模擬與渲染 | 更新植物、殭屍、投射物、太陽、特效、割草機、勝敗判定，並把目前場上物件渲染到 DOM。 |
| `js/main.js` | 啟動與事件綁定 | 綁定按鈕、鍵盤、觸控事件，處理選單/設定/暫停/重開流程，初始化 UI，並啟動 `requestAnimationFrame` 主迴圈。 |
| `PvZ_Frontend_Spec.md` | 規格文件 | 保存遊戲系統、UI、功能與實作方向的設計筆記。 |

## JavaScript 載入順序

| 順序 | 檔案 | 原因 |
|---:|---|---|
| 1 | `js/data.js` | 先載入常數、植物、殭屍與關卡資料。 |
| 2 | `js/save-system.js` | 音量與進度資料需要先能讀取。 |
| 3 | `js/audio.js` | 音訊系統會讀取存檔設定，並被 UI 事件呼叫。 |
| 4 | `js/state.js` | 建立全域狀態與共用 DOM/helper 函式。 |
| 5 | `js/ui.js` | 建立 UI、選卡、放置、波次與戰鬥重置邏輯。 |
| 6 | `js/game-systems.js` | 提供 `update()` 與 `render()` 給主迴圈使用。 |
| 7 | `js/main.js` | 最後綁定事件、初始化畫面並啟動遊戲迴圈。 |

## 執行流程

| 階段 | 說明 |
|---|---|
| 啟動 | `main.js` 綁定事件，建立棋盤與選卡 UI，渲染手牌，啟動動畫迴圈。 |
| 主選單 | 玩家選擇新遊戲、繼續、練習、圖鑑或設定。 |
| 選卡 | 玩家選擇關卡與最多 12 種植物。 |
| 開戰 | `resetGame(level)` 清空戰鬥物件、初始化資源、讀取該關波次。 |
| 更新 | `update(dt)` 推進時間、太陽、波次、植物、殭屍、子彈、特效、割草機與勝敗。 |
| 渲染 | `render()` 將植物、殭屍、子彈、太陽、特效、割草機輸出到 `entityLayer`。 |
| 結果 | 顯示勝敗、時間、分數、擊殺數與波次；戰役勝利時更新存檔與解鎖。 |

## State 狀態分組

| 狀態群組 | 欄位 / 用途 |
|---|---|
| 遊戲階段 | `phase`, `paused`, `won`, `gameOver`, `practiceMode` |
| 關卡進度 | `level`, `wave`, `totalWaves`, `time`, `nextWaveAt`, `pendingSpawns` |
| 玩家資源 | `sun`, `score`, `kills`, `selectedPlants`, `cooldowns` |
| 場上物件 | `plants`, `zombies`, `projectiles`, `effects`, `suns`, `mowers` |
| 操作狀態 | `handPlant`, `shovel`, `autoCollectSun` |
| 輔助資料 | `nextId`, `lastNaturalSun`, `spawnedInWave` |

## 擴充方向

| 需求 | 建議修改位置 |
|---|---|
| 新增植物 | 在 `PlantDefs` 新增資料；若是新的 `kind`，再補 `updatePlants()` 或相關輔助函式。 |
| 新增殭屍 | 在 `ZombieDefs` 新增資料；若有特殊能力，再補 `updateZombies()` 或 `damageZombie()`。 |
| 調整難度 | 修改 `js/data.js` 的 `generateLevel(level)`。 |
| 調整畫面 | 修改 `css/styles.css` 的 CSS 變數、元件 class、動畫與 media query。 |
| 調整存檔 | 修改 `SaveSystem.defaultSave()`、`load()`、`save()` 或 `recordScore()`。 |
| 新增畫面 | 在 `index.html` 加 markup，於 `css/styles.css` 加樣式，並在 `main.js` / `state.js` 補事件與狀態切換。 |

## 專案結構

```text
PvZ_Frontend/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── save-system.js
│   ├── audio.js
│   ├── state.js
│   ├── ui.js
│   ├── game-systems.js
│   └── main.js
├── PvZ_Frontend_Spec.md
└── README.md
```
