# MOLE MAYHEM — 打地鼠大暴走

> A browser-based Whack-a-Mole game · ブラウザで遊ぶ本格モグラ叩き · 純前端瀏覽器打地鼠遊戲

**Tech Stack:** HTML5 · CSS3 · Vanilla JavaScript · Web Audio API · localStorage

---

## Language / 言語 / 語言

| | |
|---|---|
| [English](#english) | Jump to EN section |
| [日本語](#日本語) | 日本語セクションへ |
| [中文](#中文) | 跳至中文區塊 |

---

## English

### Game Overview

| Item | Detail |
|---|---|
| Title | MOLE MAYHEM |
| Genre | Whack-a-Mole / Action |
| Platform | Browser (no install, no build step) |
| Entry Point | Open `index.html` directly |
| Save System | `localStorage` (auto-save) |
| Audio | Web Audio API (procedurally generated) |
| Responsive | Desktop & Mobile |

### Features

| Feature | Description |
|---|---|
| 10 Levels | From beginner meadow to final BOSS battle |
| 8 Mole Types | Each with unique HP, score, and behavior |
| 3 Difficulties | Easy / Normal / Hard — affects spawn rate & penalty |
| COMBO System | Consecutive hits multiply score; misses reset the chain |
| Power-ups | Time extension, extra life, score multiplier (Frenzy) |
| Obstacles | Appear in select levels to block certain holes |
| BOSS Battle | Level 10 — defeat a 100-HP BOSS mole |
| Stars & High Score | Up to 3 stars per level, saved persistently |
| Procedural BGM | Each level has a unique BPM and musical scale |
| Screen Shake | Optional visual feedback on miss/penalty hits |

### Level Table

| Lv | Name | Grid | Time | Target | BPM | Special |
|---|---|---|---|---|---|---|
| 1 | Beginner Meadow | 3×3 | 60s | 500 | 100 | — |
| 2 | Speed Training | 3×3 | 60s | 800 | 110 | Fast moles |
| 3 | Pixel Frenzy | 3×3 | 55s | 1,200 | 120 | Bomb moles |
| 4 | Trap Garden | 3×4 | 60s | 2,000 | 130 | Obstacles, bonus moles |
| 5 | Toxic Swamp | 3×4 | 55s | 2,800 | 95 | Poison moles |
| 6 | Crystal Mine | 4×4 | 55s | 4,200 | 140 | Armored + Flash moles |
| 7 | Dark Labyrinth | 4×4 | 50s | 6,000 | 150 | Obstacles, all threat types |
| 8 | Lava Chaos | 4×4 | 50s | 9,000 | 160 | Full mole roster |
| 9 | Morph Zone | 4×5 | 70s | 14,000 | 125 | Obstacles, largest grid |
| 10 | BOSS: Mole Overlord | 4×5 | 90s | — | 170 | BOSS battle (100 HP) |

### Mole Types

| Icon | Type | HP | Score | Appear Time | Notes |
|---|---|---|---|---|---|
| 🟤 | Normal | 1 | +100 | 1,600ms | Standard mole |
| ⚡ | Fast | 1 | +150 | 950ms | Disappears quickly |
| 💣 | Bomb | 1 | −150 | 1,500ms | Penalty on hit, breaks COMBO |
| ☠️ | Poison | 1 | −200 | 1,550ms | Score penalty only |
| 🛡️ | Armored | 2 | +240 | 2,200ms | Requires 2 hits |
| 💎 | Gem | 1 | +500 | 1,150ms | 80% chance to drop a power-up |
| ⚡⚡ | Flash | 1 | +420 | 620ms | Extremely fast, high reward |
| 👹 | BOSS | 100 | +2,000 | 2,600ms | Level 10 only |

### Controls

| Action | Desktop | Mobile |
|---|---|---|
| Hit a mole | Click | Tap |
| Navigate menus | Click | Tap |
| Exit game mid-play | Click "Exit Game" button | Tap "Exit Game" button |

### File Structure

```
Whack_A_Mole/
├── index.html          ← App entry point (DOM + script loader)
├── css/
│   ├── styles.css      ← CSS barrel (imports all modules)
│   ├── base.css        ← CSS variables, reset, layout
│   ├── home.css        ← Home screen & main menu
│   ├── screens.css     ← Level select, help, settings screens
│   ├── game.css        ← Game grid, HUD, mole art, effects
│   ├── ui.css          ← Overlay, result cards, toast
│   ├── animations.css  ← All @keyframes
│   └── responsive.css  ← Mobile & small-screen adjustments
└── js/
    ├── config.js       ← Game data (levels, moles, difficulty)
    ├── save-system.js  ← localStorage read/write
    ├── audio-engine.js ← Web Audio API music & SFX
    ├── game.js         ← Game loop, logic, screen management
    └── main.js         ← Bootstrap (DOMContentLoaded entry)
```

### CSS Module Reference

| File | Responsibility |
|---|---|
| `styles.css` | Barrel file — only `@import` statements |
| `base.css` | CSS custom properties, global reset, `.screen`, `.stack`, `.app` |
| `home.css` | Title, mascot mole animation, menu button grid |
| `screens.css` | Level card grid, help articles, screen titles |
| `game.css` | HUD (score/time/combo/hearts), game grid, hole, mole, hit effects, floating score |
| `ui.css` | Countdown overlay, result stats, settings sliders, segmented controls, toast |
| `animations.css` | All `@keyframes`: mole pop, hit flash, combo banner, screen shake, floating score |
| `responsive.css` | Mobile padding, HUD 2-column layout, grid width cap, 4×5 mole size fixes |

### JavaScript Module Reference

| File | Class | Key Responsibilities |
|---|---|---|
| `config.js` | — | Exports `SAVE_KEY`, `DIFFICULTY`, `LEVELS[10]`, `MOLES[8]` to `window.MoleMayhem` |
| `save-system.js` | `SaveSystem` | Load/save/reset via `localStorage`; stores settings, progress, and stats |
| `audio-engine.js` | `AudioEngine` | `AudioContext` setup, gain routing, procedural BGM sequencer, SFX synthesis |
| `game.js` | `Game` | Screen routing, mole spawn/despawn, hit detection, COMBO, powers, BOSS, results |
| `main.js` | — | Single line: `new MoleMayhem.Game()` after `DOMContentLoaded` |

### Customization Guide

| Goal | File to Edit | Key Object / Function |
|---|---|---|
| Adjust level stats | `js/config.js` | `LEVELS` array |
| Change mole behavior | `js/config.js` | `MOLES` object |
| Modify difficulty | `js/config.js` | `DIFFICULTY` object |
| Change music style | `js/audio-engine.js` | `buildPattern()` |
| Adjust game logic | `js/game.js` | `Game` class |
| Change mobile layout | `css/responsive.css` | Media query blocks |
| Change mole appearance | `css/game.css` | `.mole-*` selectors |

### How to Run

No build step required. Open `index.html` in any modern browser.

```
# Option A — double-click the file
index.html

# Option B — local server (optional, avoids CORS edge cases)
npx serve .
```

### Syntax Check

```bash
node -e "
const fs = require('fs');
['js/config.js','js/save-system.js','js/audio-engine.js','js/game.js','js/main.js']
  .forEach(f => new Function(fs.readFileSync(f,'utf8')));
console.log('JS syntax OK');
"
```

---

## 日本語

### ゲーム概要

| 項目 | 詳細 |
|---|---|
| タイトル | MOLE MAYHEM（モール・メイヘム） |
| ジャンル | モグラ叩き / アクション |
| プラットフォーム | ブラウザ（インストール不要・ビルド不要） |
| 起動方法 | `index.html` をそのまま開くだけ |
| セーブ | `localStorage`（自動保存） |
| サウンド | Web Audio API（プロシージャル生成） |
| レスポンシブ | PC・スマートフォン対応 |

### 特徴一覧

| 機能 | 説明 |
|---|---|
| 10ステージ | 初心者向け草原から最終BOSS戦まで |
| 8種のモグラ | それぞれ固有のHP・スコア・行動を持つ |
| 難易度3段階 | かんたん／ふつう／むずかしい（出現速度とペナルティに影響） |
| COMBOシステム | 連続命中でスコア倍率アップ。ミスでリセット |
| パワーアップ | 時間延長・ライフ回復・スコア倍増（フレンジー） |
| 障害物 | 特定ステージで一部の穴をふさぐ |
| BOSS戦 | ステージ10：HP100のボスモグラを撃破せよ |
| 星評価 | ステージごとに最大3つ星・最高スコアを保存 |
| プロシージャルBGM | ステージ毎に異なるBPMと音階でBGMを生成 |
| 画面シェイク | ミス・ペナルティ時の視覚フィードバック（ON/OFF可） |

### ステージ一覧

| Lv | ステージ名 | グリッド | 時間 | 目標スコア | BPM | 特徴 |
|---|---|---|---|---|---|---|
| 1 | 新手草地（初心者草原） | 3×3 | 60秒 | 500 | 100 | — |
| 2 | 快手訓練（スピードトレーニング） | 3×3 | 60秒 | 800 | 110 | 快速モグラ登場 |
| 3 | 像素暴走（ピクセルフレンジー） | 3×3 | 55秒 | 1,200 | 120 | 爆弾モグラ登場 |
| 4 | 陷阱花園（トラップガーデン） | 3×4 | 60秒 | 2,000 | 130 | 障害物・ボーナスモグラ |
| 5 | 毒霧沼澤（毒霧の沼地） | 3×4 | 55秒 | 2,800 | 95 | 毒モグラ登場 |
| 6 | 冰晶礦坑（氷晶鉱山） | 4×4 | 55秒 | 4,200 | 140 | 装甲・閃光モグラ |
| 7 | 暗夜迷宮（暗夜の迷宮） | 4×4 | 50秒 | 6,000 | 150 | 障害物・全脅威タイプ |
| 8 | 熔岩亂流（溶岩の乱流） | 4×4 | 50秒 | 9,000 | 160 | 全モグラ出現 |
| 9 | 變形領域（変形領域） | 4×5 | 70秒 | 14,000 | 125 | 障害物・最大グリッド |
| 10 | 地鼠魔王（BOSS戦） | 4×5 | 90秒 | — | 170 | HP100のBOSS撃破 |

### モグラの種類

| アイコン | 種類 | HP | スコア | 出現時間 | 備考 |
|---|---|---|---|---|---|
| 🟤 | 普通（ノーマル） | 1 | +100 | 1,600ms | 標準モグラ |
| ⚡ | 快速（ファスト） | 1 | +150 | 950ms | すぐ引っ込む |
| 💣 | 爆弾（バッド） | 1 | −150 | 1,500ms | 叩くとペナルティ・COMBO切れ |
| ☠️ | 毒（ポイズン） | 1 | −200 | 1,550ms | スコアペナルティのみ |
| 🛡️ | 装甲（アーマード） | 2 | +240 | 2,200ms | 2回叩く必要あり |
| 💎 | 宝石（ボーナス） | 1 | +500 | 1,150ms | 80%でパワーアップをドロップ |
| ⚡⚡ | 閃光（フラッシュ） | 1 | +420 | 620ms | 超高速・高報酬 |
| 👹 | BOSS | 100 | +2,000 | 2,600ms | ステージ10のみ |

### ファイル構成

```
Whack_A_Mole/
├── index.html          ← アプリ入口（DOM構造・スクリプト読み込み）
├── css/
│   ├── styles.css      ← CSSバレルファイル（@importのみ）
│   ├── base.css        ← CSS変数・リセット・基本レイアウト
│   ├── home.css        ← ホーム画面・メインメニュー
│   ├── screens.css     ← ステージ選択・ヘルプ・設定画面
│   ├── game.css        ← グリッド・HUD・モグラ・ヒットエフェクト
│   ├── ui.css          ← オーバーレイ・リザルト・トースト
│   ├── animations.css  ← 全@keyframes定義
│   └── responsive.css  ← モバイル・小画面対応
└── js/
    ├── config.js       ← ゲームデータ（ステージ・モグラ・難易度）
    ├── save-system.js  ← localStorageの読み書き
    ├── audio-engine.js ← Web Audio API BGM・効果音
    ├── game.js         ← ゲームループ・ロジック・画面管理
    └── main.js         ← 起動エントリ（DOMContentLoaded）
```

### CSSモジュール詳細

| ファイル | 役割 |
|---|---|
| `styles.css` | バレル：`@import`のみ。`index.html`はこれだけ参照 |
| `base.css` | CSSカスタムプロパティ・グローバルリセット・`.screen` `.stack` `.app` |
| `home.css` | タイトル・マスコットモグラ・メニューボタングリッド |
| `screens.css` | ステージカード・ヘルプ記事・画面タイトル |
| `game.css` | HUD（スコア/時間/コンボ/ライフ）・ゲームグリッド・モグラ・エフェクト・浮き文字 |
| `ui.css` | カウントダウンオーバーレイ・リザルト統計・設定スライダー・トースト |
| `animations.css` | モグラポップ・ヒットフラッシュ・コンボバナー・画面シェイク・浮きスコア |
| `responsive.css` | モバイルパディング・HUD2列レイアウト・グリッド幅制限・4×5サイズ修正 |

### JavaScriptモジュール詳細

| ファイル | クラス | 主な責務 |
|---|---|---|
| `config.js` | — | `SAVE_KEY` `DIFFICULTY` `LEVELS[10]` `MOLES[8]` を `window.MoleMayhem` に公開 |
| `save-system.js` | `SaveSystem` | `localStorage`の読み込み・保存・リセット。設定・進行状況・統計を管理 |
| `audio-engine.js` | `AudioEngine` | `AudioContext`初期化・ゲイン管理・BGMシーケンサー・効果音合成 |
| `game.js` | `Game` | 画面遷移・モグラ生成/消去・ヒット判定・COMBO・パワーアップ・BOSS・リザルト保存 |
| `main.js` | — | `DOMContentLoaded`後に`new MoleMayhem.Game()`を1行実行 |

### カスタマイズ方法

| 目的 | 編集ファイル | 対象 |
|---|---|---|
| ステージ設定の変更 | `js/config.js` | `LEVELS` 配列 |
| モグラのパラメータ変更 | `js/config.js` | `MOLES` オブジェクト |
| 難易度倍率の変更 | `js/config.js` | `DIFFICULTY` オブジェクト |
| BGMの変更 | `js/audio-engine.js` | `buildPattern()` |
| ゲームロジックの変更 | `js/game.js` | `Game` クラス |
| モバイルレイアウト調整 | `css/responsive.css` | メディアクエリ |
| モグラの見た目変更 | `css/game.css` | `.mole-*` セレクタ |

### 起動方法

```
index.html をブラウザで直接開くだけ
（ビルドツール・npmは不要）
```

---

## 中文

### 遊戲概覽

| 項目 | 內容 |
|---|---|
| 遊戲名稱 | MOLE MAYHEM（打地鼠大暴走） |
| 類型 | 打地鼠 / 動作遊戲 |
| 平台 | 瀏覽器（免安裝、免建置） |
| 啟動方式 | 直接用瀏覽器開啟 `index.html` |
| 存檔系統 | `localStorage`（自動儲存） |
| 音效 | Web Audio API（程式生成音效） |
| 響應式設計 | 桌機與手機均支援 |

### 功能特色

| 功能 | 說明 |
|---|---|
| 10 個關卡 | 從新手草地到最終 BOSS 決戰 |
| 8 種地鼠 | 各有獨特的血量、分數與行為 |
| 3 種難度 | 簡單 / 普通 / 困難（影響生成速度與懲罰倍率） |
| COMBO 系統 | 連續命中累積倍率，失誤即中斷 |
| 道具系統 | 加時間、補血量、分數狂熱三種道具 |
| 障礙物 | 特定關卡的洞口會被障礙物封住 |
| BOSS 戰 | 第 10 關：擊敗 100 血量的地鼠魔王 |
| 星等與紀錄 | 每關最多 3 星，最高分永久保存 |
| 程式生成 BGM | 每關獨立 BPM 與音階，動態生成背景音樂 |
| 畫面震動 | 失誤與受罰時的視覺回饋（可開關） |

### 關卡一覽

| 關卡 | 名稱 | 棋盤 | 時間 | 目標分數 | BPM | 特色 |
|---|---|---|---|---|---|---|
| 1 | 新手草地 | 3×3 | 60秒 | 500 | 100 | — |
| 2 | 快手訓練 | 3×3 | 60秒 | 800 | 110 | 快速地鼠登場 |
| 3 | 像素暴走 | 3×3 | 55秒 | 1,200 | 120 | 炸彈鼠登場 |
| 4 | 陷阱花園 | 3×4 | 60秒 | 2,000 | 130 | 障礙物＋寶石鼠 |
| 5 | 毒霧沼澤 | 3×4 | 55秒 | 2,800 | 95 | 毒鼠登場 |
| 6 | 冰晶礦坑 | 4×4 | 55秒 | 4,200 | 140 | 裝甲鼠＋閃電鼠 |
| 7 | 暗夜迷宮 | 4×4 | 50秒 | 6,000 | 150 | 障礙物＋全威脅類型 |
| 8 | 熔岩亂流 | 4×4 | 50秒 | 9,000 | 160 | 全地鼠類型出現 |
| 9 | 變形領域 | 4×5 | 70秒 | 14,000 | 125 | 障礙物＋最大棋盤 |
| 10 | 地鼠魔王 | 4×5 | 90秒 | — | 170 | BOSS 戰（100 血量） |

### 地鼠種類

| 圖示 | 類型 | 血量 | 分數 | 出現時間 | 備注 |
|---|---|---|---|---|---|
| 🟤 | 普通地鼠 | 1 | +100 | 1,600ms | 標準型地鼠 |
| ⚡ | 快鼠 | 1 | +150 | 950ms | 出現時間短，要快打 |
| 💣 | 炸彈鼠 | 1 | −150 | 1,500ms | 打到扣分且中斷 COMBO |
| ☠️ | 毒鼠 | 1 | −200 | 1,550ms | 只扣分數 |
| 🛡️ | 裝甲鼠 | 2 | +240 | 2,200ms | 需敲兩下才能消滅 |
| 💎 | 寶石鼠 | 1 | +500 | 1,150ms | 80% 機率掉落道具 |
| ⚡⚡ | 閃電鼠 | 1 | +420 | 620ms | 超高速，高報酬 |
| 👹 | BOSS | 100 | +2,000 | 2,600ms | 僅第 10 關出現 |

### 操作方式

| 動作 | 桌機 | 手機 |
|---|---|---|
| 打地鼠 | 滑鼠點擊 | 手指觸碰 |
| 選單操作 | 點擊 | 點擊 |
| 遊戲途中離開 | 點擊「離開遊戲」 | 點擊「離開遊戲」 |

### 檔案結構

```
Whack_A_Mole/
├── index.html          ← 應用程式入口（DOM 結構 + JS 載入順序）
├── css/
│   ├── styles.css      ← CSS 入口（僅用 @import 引入各模組）
│   ├── base.css        ← CSS 變數、全域重置、基礎版面
│   ├── home.css        ← 主畫面與主選單
│   ├── screens.css     ← 關卡選擇、說明頁、設定頁
│   ├── game.css        ← 遊戲棋盤、HUD、地鼠造型、特效
│   ├── ui.css          ← 倒數 Overlay、結果卡片、Toast
│   ├── animations.css  ← 所有 @keyframes 定義
│   └── responsive.css  ← 手機版與小螢幕修正
└── js/
    ├── config.js       ← 遊戲資料（關卡、地鼠、難度設定）
    ├── save-system.js  ← localStorage 讀寫管理
    ├── audio-engine.js ← Web Audio API 音樂與音效
    ├── game.js         ← 遊戲主流程、邏輯、畫面管理
    └── main.js         ← 啟動入口（DOMContentLoaded）
```

### CSS 模組說明

| 檔案 | 職責 |
|---|---|
| `styles.css` | 入口桶（barrel）：只有 `@import`，`index.html` 僅需引用此檔 |
| `base.css` | CSS 自訂變數、全域重置、`.screen` `.stack` `.app` 基礎版面 |
| `home.css` | 遊戲標題、吉祥物地鼠動畫、主選單按鈕排列 |
| `screens.css` | 關卡選擇卡片、說明文章、畫面標題 |
| `game.css` | HUD（分數 / 時間 / COMBO / 生命）、棋盤格、洞口、地鼠、命中特效、浮字 |
| `ui.css` | 倒數 Overlay、結果統計卡片、設定 Slider 與分段控制器、Toast |
| `animations.css` | 地鼠彈出、命中閃爍、COMBO Banner、畫面震動、浮現分數 |
| `responsive.css` | 手機版 padding、HUD 兩欄、棋盤寬度上限、4×5 地鼠尺寸修正 |

### JavaScript 模組說明

| 檔案 | 類別 | 主要職責 |
|---|---|---|
| `config.js` | — | 將 `SAVE_KEY` `DIFFICULTY` `LEVELS[10]` `MOLES[8]` 掛載至 `window.MoleMayhem` |
| `save-system.js` | `SaveSystem` | 讀取 / 儲存 / 重置 `localStorage`；管理設定、進度與統計資料 |
| `audio-engine.js` | `AudioEngine` | 建立 `AudioContext`、管理 Gain 路由、程式生成 BGM 序列器、音效合成 |
| `game.js` | `Game` | 畫面切換、地鼠生成 / 消失、命中判定、COMBO、道具、BOSS、結果保存 |
| `main.js` | — | `DOMContentLoaded` 後執行 `new MoleMayhem.Game()` |

### 修改指南

| 目標 | 修改檔案 | 對應位置 |
|---|---|---|
| 調整關卡設定 | `js/config.js` | `LEVELS` 陣列 |
| 調整地鼠數值 | `js/config.js` | `MOLES` 物件 |
| 調整難度倍率 | `js/config.js` | `DIFFICULTY` 物件 |
| 更改音樂風格 | `js/audio-engine.js` | `buildPattern()` |
| 調整遊戲流程 | `js/game.js` | `Game` 類別 |
| 調整手機版排版 | `css/responsive.css` | Media query 區塊 |
| 調整地鼠外觀 | `css/game.css` | `.mole-*` 選擇器 |

### 執行方式

無需建置流程，直接用瀏覽器開啟即可：

```
# 方法 A — 直接雙擊
index.html

# 方法 B — 本機伺服器（可避免少數 CORS 問題）
npx serve .
```

### 語法檢查

```bash
node -e "
const fs = require('fs');
['js/config.js','js/save-system.js','js/audio-engine.js','js/game.js','js/main.js']
  .forEach(f => new Function(fs.readFileSync(f,'utf8')));
console.log('JS 語法正確');
"
```
