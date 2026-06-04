# 光槍特訓 / Light Gun Training / ライトガン特訓

> **Pure Frontend Shooting Game — HTML5 + CSS3 + Vanilla JavaScript**

---

## Language / 語言 / 言語

- [中文](#中文)
- [English](#english)
- [日本語](#日本語)

---

# 中文

## 遊戲介紹

靈感來自 90 年代經典街機光槍遊戲（Virtua Cop、Time Crisis），以**純前端技術**實作，無需後端或任何安裝。玩家透過點擊或觸控模擬射擊，在限制時間內擊倒敵人、保護人質、管理彈藥，完成各關卡挑戰。

### 快速啟動

直接雙擊 `index.html`，或在瀏覽器中開啟即可遊玩，無需 npm 或本機伺服器。

---

## 操作方式

| 平台 | 射擊 | 換彈 | 暫停 |
|------|------|------|------|
| 桌面 | 滑鼠左鍵 | 右鍵 / `R` 鍵 | `ESC` |
| 行動 | 單指點擊 | 雙指點擊 / 右下角換彈鈕 | 左上角暫停鈕 |

---

## 關卡一覽

| 關卡 | 場景 | 時限 | 擊殺目標 | 敵人種類 | 特殊機制 |
|------|------|------|---------|---------|---------|
| Stage 1 | 倉庫 | 90 秒 | 18 | 普通 | 教學關，提示明顯 |
| Stage 2 | 城市街道 | 80 秒 | 24 | 普通、快速 | 人質大量出現 |
| Stage 3 | 銀行大廳 | 70 秒 | 26 | 普通、盾牌 | 換彈時機更重要 |
| Stage 4 | 停車場（夜） | 70 秒 | 30 | 普通、快速、盾牌 | 夜間場景，可見度低 |
| Stage 5 | 頂樓 | 60 秒 | 16 + Boss | 普通、快速、遠距 | 最終 Boss 戰 |
| ENDLESS | 隨機場景 | 無限 | 無限 | 全種類 | 每 18 擊殺難度提升 |

---

## 敵人與人質

### 敵人類型

| 類型 | 生命值 | 分數 | 特性 |
|------|--------|------|------|
| 普通敵人 | 1 | +100 | 標準行為 |
| 快速敵人 | 1 | +130 | 停留時間僅 58%，快速閃現 |
| 盾牌敵人 | 2 | +180 | 需命中兩次 |
| 遠距敵人 | 1 | +180 | 體型小，難以命中 |
| Boss | 18 | +1000 | 多段生命，特殊攻擊模式 |

### 人質類型

| 類型 | 誤傷懲罰 |
|------|---------|
| 一般平民 | -500 分 + 連擊歸零 |
| 警察人質 | -500 分 + 連擊歸零 |
| VIP 人質 | -1000 分 + 18% 機率 -1 生命 |

> 誤傷人質同時清除當前連擊數。

---

## 計分系統

### 基礎分數

| 事件 | 分數 |
|------|------|
| 命中一般敵人 | +100 |
| 命中頭部（要害） | +300 |
| 擊殺 Boss | +1000 |
| 全關無傷通過 | +500 |
| 全關無誤傷人質 | +300 |
| 誤傷人質（一般） | -500 |
| 誤傷人質（VIP） | -1000 |
| 彈夾耗盡後仍射擊 | -50 |

### 連擊加成

| 連擊數 | 分數倍率 |
|--------|---------|
| 1 ～ 4 | × 1.0 |
| 5 ～ 9 | × 1.5 |
| 10 ～ 19 | × 2.0 |
| 20 以上 | × 3.0 |

> 超過 3 秒未命中或誤傷人質，連擊歸零。

---

## 彈藥與換彈

| 難度 | 彈夾容量 | 換彈時間 | 傷害倍率 |
|------|---------|---------|---------|
| 簡單 | 無限 | 1.0 秒 | × 0.75 |
| 普通 | 12 發 | 1.5 秒 | × 1.0 |
| 困難 | 8 發 | 2.0 秒 | × 1.25 |

- 子彈 ≤ 3 發時，彈藥框變紅並閃爍
- 彈夾耗盡時自動觸發換彈

---

## 主要功能

- 5 個劇情關卡 + 無盡模式
- 即時 HUD（生命、計時、彈藥、分數、連擊）
- Web Audio API 程序音效，無外部音檔依賴
- `localStorage` 本機排行榜（前 10 名）與設定保存
- 視覺特效：血花、彈孔、分數彈跳動畫（物件池優化）
- 完整響應式設計，支援手機橫向 / 直向遊玩

---

## 程式架構

### 檔案結構

```
Shooting_Game/
├── index.html               # 遊戲唯一入口
├── style/
│   ├── reset.css            # 基礎重置
│   ├── theme.css            # CSS 變數與全域樣式
│   ├── ui.css               # HUD、選單、按鈕
│   └── animations.css       # 特效動畫
├── js/
│   ├── main.js              # 初始化、導覽、設定綁定
│   ├── state.js             # 全域遊戲狀態
│   ├── screen.js            # 畫面切換控制
│   ├── game.js              # 核心遊戲迴圈與邏輯
│   ├── stage.js             # 關卡資料、敵人類型、難度設定
│   ├── enemy.js             # 敵人生成與渲染
│   ├── player.js            # 玩家輸入與彈藥管理
│   ├── score.js             # 計分與連擊邏輯
│   ├── audio.js             # 音訊控制（Howler.js 封裝）
│   ├── fx.js                # 視覺特效物件池
│   └── storage.js           # localStorage 存取
└── assets/
    ├── images/              # 場景與角色圖
    ├── audio/bgm/           # 背景音樂
    ├── audio/sfx/           # 音效
    └── fonts/               # 自訂字體
```

### JS 模組職責

| 檔案 | 職責 |
|------|------|
| `main.js` | 程式入口，初始化所有模組，綁定 UI 事件 |
| `state.js` | 單一資料來源，儲存執行期遊戲狀態 |
| `screen.js` | 管理畫面顯示 / 隱藏切換 |
| `game.js` | `requestAnimationFrame` 主迴圈，處理射擊、命中、結算 |
| `stage.js` | 靜態關卡資料、敵人類型、難度參數 |
| `enemy.js` | 敵人物件建立、DOM 渲染、Boss 血條 |
| `player.js` | 射擊消耗彈藥、換彈計時邏輯 |
| `score.js` | 計分、連擊加成、時間加分計算 |
| `audio.js` | 封裝 Howler.js，提供 `sfx()` / `playMusic()` 介面 |
| `fx.js` | 血花、彈孔、浮動分數的 DOM 物件池 |
| `storage.js` | 排行榜與設定的讀寫封裝 |

### 外部依賴

| 函式庫 | 版本 | 用途 |
|--------|------|------|
| Howler.js | 2.2.x | 音訊播放管理（CDN 或本機） |

> 除 Howler.js 外，本遊戲**零外部依賴**。

---

# English

## Overview

Inspired by classic 90s arcade light-gun games (Virtua Cop, Time Crisis), this is a **pure frontend** shooting game — no backend, no build tools. Click or tap to shoot enemies, protect hostages, and manage your ammo across 5 stages and an endless mode.

### Quick Start

Open `index.html` directly in any modern browser. No npm, no server required.

---

## Controls

| Platform | Shoot | Reload | Pause |
|----------|-------|--------|-------|
| Desktop | Left click | Right click / `R` key | `ESC` |
| Mobile | Single tap | Two-finger tap / Reload button (bottom-right) | Pause button (top-left) |

---

## Stages

| Stage | Scene | Time | Kill Quota | Enemy Types | Special |
|-------|-------|------|------------|-------------|---------|
| Stage 1 | Warehouse | 90 s | 18 | Normal | Tutorial — clear visual cues |
| Stage 2 | City Street | 80 s | 24 | Normal, Fast | Heavy hostage traffic |
| Stage 3 | Bank Lobby | 70 s | 26 | Normal, Shield | Reload timing critical |
| Stage 4 | Parking Lot (night) | 70 s | 30 | Normal, Fast, Shield | Dark scene, reduced visibility |
| Stage 5 | Rooftop | 60 s | 16 + Boss | Normal, Fast, Far | Final Boss fight |
| ENDLESS | Random | ∞ | ∞ | All types | Difficulty scales every 18 kills |

---

## Enemies & Hostages

### Enemy Types

| Type | HP | Score | Notes |
|------|----|-------|-------|
| Normal | 1 | +100 | Standard behavior |
| Fast | 1 | +130 | 58% shorter stay — blinks in and out |
| Shield | 2 | +180 | Requires 2 hits to eliminate |
| Far | 1 | +180 | Small hitbox, harder to hit |
| Boss | 18 | +1000 | Multi-stage, special attack patterns |

### Hostage Types

| Type | Penalty for Hitting |
|------|---------------------|
| Civilian | −500 pts + combo reset |
| Police | −500 pts + combo reset |
| VIP | −1000 pts + 18% chance −1 life |

> Hitting any hostage also resets your current combo.

---

## Scoring

### Base Scores

| Event | Points |
|-------|--------|
| Hit normal enemy | +100 |
| Headshot (top 34% of enemy) | +300 |
| Defeat Boss | +1,000 |
| Perfect clear (no damage taken) | +500 |
| No hostage hits (full stage) | +300 |
| Hit hostage (civilian / police) | −500 |
| Hit VIP hostage | −1,000 |
| Shoot with empty magazine | −50 |

### Combo Multipliers

| Combo Count | Score Multiplier |
|-------------|-----------------|
| 1 – 4 | × 1.0 |
| 5 – 9 | × 1.5 |
| 10 – 19 | × 2.0 |
| 20+ | × 3.0 |

> Combo resets if 3 seconds pass without a hit, or if a hostage is hit.

---

## Ammo & Reloading

| Difficulty | Magazine | Reload Time | Damage Scale |
|------------|----------|-------------|--------------|
| Easy | Unlimited | 1.0 s | × 0.75 |
| Normal | 12 rounds | 1.5 s | × 1.0 |
| Hard | 8 rounds | 2.0 s | × 1.25 |

- Ammo bar turns red and flashes when ≤ 3 rounds remain
- Auto-reload triggers when the magazine runs empty

---

## Features

- 5 story stages + endless mode
- Live HUD: lives, countdown timer, ammo bar, score, combo counter
- Procedural Web Audio — no external audio files required
- `localStorage` leaderboard (top 10) and settings persistence
- Visual FX: blood splatter, bullet holes, floating score pop-ups (object-pool optimized)
- Fully responsive — playable on mobile portrait and landscape

---

## Code Architecture

### File Structure

```
Shooting_Game/
├── index.html               # Single entry point
├── style/
│   ├── reset.css            # Base reset
│   ├── theme.css            # CSS variables and global styles
│   ├── ui.css               # HUD, menus, buttons
│   └── animations.css       # Effect animations
├── js/
│   ├── main.js              # Init, navigation, settings binding
│   ├── state.js             # Global game state (single source of truth)
│   ├── screen.js            # Screen show/hide switching
│   ├── game.js              # Core game loop and all gameplay logic
│   ├── stage.js             # Stage data, enemy types, difficulty config
│   ├── enemy.js             # Enemy creation and DOM rendering
│   ├── player.js            # Input handling and ammo management
│   ├── score.js             # Scoring, combo, and time bonus logic
│   ├── audio.js             # Howler.js wrapper — sfx() / playMusic()
│   ├── fx.js                # DOM object pool for visual effects
│   └── storage.js           # localStorage read/write helpers
└── assets/
    ├── images/              # Scene and character art
    ├── audio/bgm/           # Background music
    ├── audio/sfx/           # Sound effects
    └── fonts/               # Custom fonts
```

### Module Responsibilities

| File | Responsibility |
|------|----------------|
| `main.js` | Entry point — initializes modules, wires up UI events |
| `state.js` | Single source of runtime game state |
| `screen.js` | Controls which screen is visible |
| `game.js` | `requestAnimationFrame` loop — shooting, hit detection, result |
| `stage.js` | Static stage data, enemy types, difficulty parameters |
| `enemy.js` | Enemy object factory, DOM rendering, boss health bar |
| `player.js` | Shoot ammo consumption, reload timer |
| `score.js` | Score calculation, combo multipliers, time bonus |
| `audio.js` | Wraps Howler.js — exposes `sfx()` and `playMusic()` |
| `fx.js` | Object pool for blood, bullet holes, floating score labels |
| `storage.js` | Encapsulates leaderboard and settings localStorage I/O |

### External Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| Howler.js | 2.2.x | Audio playback management (CDN or local) |

> Aside from Howler.js, this game has **zero external dependencies**.

---

## Browser Support

| Browser | Min Version | Notes |
|---------|-------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 85+ | Full support |
| Edge | 90+ | Full support |
| Safari (iOS) | 14+ | Audio requires user interaction to start |
| Samsung Internet | 14+ | Primary mobile target |

---

# 日本語

## ゲーム紹介

90年代のクラシックアーケードライトガンゲーム（Virtua Cop、Time Crisisシリーズ）にインスパイアされた**純粋なフロントエンド**シューティングゲームです。バックエンドやビルドツールは不要。クリックまたはタップで敵を撃ち倒し、人質を守りながら弾薬を管理して各ステージをクリアしましょう。

### 起動方法

`index.html` をブラウザで直接開くだけでプレイできます。npm やローカルサーバーは不要です。

---

## 操作方法

| プラットフォーム | 射撃 | リロード | ポーズ |
|----------------|------|---------|-------|
| デスクトップ | 左クリック | 右クリック / `R` キー | `ESC` |
| モバイル | シングルタップ | 2本指タップ / 右下リロードボタン | 左上ポーズボタン |

---

## ステージ一覧

| ステージ | 場面 | 制限時間 | 撃破目標 | 敵の種類 | 特殊要素 |
|---------|------|---------|---------|---------|---------|
| Stage 1 | 倉庫 | 90 秒 | 18体 | ノーマル | チュートリアル、分かりやすい誘導 |
| Stage 2 | 市街地 | 80 秒 | 24体 | ノーマル・高速 | 人質が多数登場 |
| Stage 3 | 銀行ロビー | 70 秒 | 26体 | ノーマル・シールド | リロードタイミングが重要 |
| Stage 4 | 駐車場（夜） | 70 秒 | 30体 | ノーマル・高速・シールド | 暗い場面、視認性低下 |
| Stage 5 | 屋上 | 60 秒 | 16体 + Boss | ノーマル・高速・遠距離 | 最終ボス戦 |
| ENDLESS | ランダム | 無制限 | 無制限 | 全種類 | 18体撃破ごとに難易度上昇 |

---

## 敵と人質

### 敵の種類

| 種類 | HP | スコア | 特性 |
|------|----|--------|------|
| ノーマル | 1 | +100 | 標準行動 |
| 高速 | 1 | +130 | 滞在時間58%短縮、瞬間出現 |
| シールド | 2 | +180 | 2発命中で撃破 |
| 遠距離 | 1 | +180 | 小さいヒットボックス |
| ボス | 18 | +1000 | 多段階HP、特殊攻撃パターン |

### 人質の種類

| 種類 | 誤射ペナルティ |
|------|-------------|
| 一般市民 | −500点 + コンボリセット |
| 警察官 | −500点 + コンボリセット |
| VIP人質 | −1000点 + 18%の確率でライフ−1 |

> 人質への誤射は現在のコンボ数もリセットされます。

---

## スコアシステム

### 基本スコア

| イベント | 点数 |
|---------|------|
| 敵に命中 | +100 |
| ヘッドショット（上部34%以内） | +300 |
| ボス撃破 | +1,000 |
| ノーダメージクリア | +500 |
| 人質誤射なしクリア | +300 |
| 人質誤射（一般・警察） | −500 |
| VIP人質誤射 | −1,000 |
| 空撃ち（弾切れ後の射撃） | −50 |

### コンボ倍率

| コンボ数 | スコア倍率 |
|---------|----------|
| 1 ～ 4 | × 1.0 |
| 5 ～ 9 | × 1.5 |
| 10 ～ 19 | × 2.0 |
| 20以上 | × 3.0 |

> 3秒間命中なし、または人質誤射でコンボリセット。

---

## 弾薬とリロード

| 難易度 | マガジン容量 | リロード時間 | ダメージ倍率 |
|--------|------------|------------|------------|
| かんたん | 無制限 | 1.0 秒 | × 0.75 |
| ふつう | 12発 | 1.5 秒 | × 1.0 |
| むずかしい | 8発 | 2.0 秒 | × 1.25 |

- 残弾 3発以下で弾薬バーが赤く点滅
- 弾切れ時は自動でリロード開始

---

## 主な機能

- 5つのストーリーステージ + エンドレスモード
- リアルタイムHUD（ライフ、タイマー、弾薬、スコア、コンボ）
- Web Audio API によるプロシージャルSE（外部音声ファイル不要）
- `localStorage` によるランキング（上位10件）と設定の保存
- ビジュアルエフェクト：血しぶき・弾痕・スコアポップアップ（オブジェクトプール最適化）
- 完全レスポンシブ対応 — スマートフォン縦横両対応

---

## コードアーキテクチャ

### ファイル構成

```
Shooting_Game/
├── index.html               # 唯一のエントリポイント
├── style/
│   ├── reset.css            # ベースリセット
│   ├── theme.css            # CSS変数・グローバルスタイル
│   ├── ui.css               # HUD・メニュー・ボタン
│   └── animations.css       # エフェクトアニメーション
├── js/
│   ├── main.js              # 初期化・ナビゲーション・設定バインド
│   ├── state.js             # グローバルゲーム状態（単一ソース）
│   ├── screen.js            # 画面切り替え管理
│   ├── game.js              # ゲームメインループと全ゲームプレイロジック
│   ├── stage.js             # ステージデータ・敵タイプ・難易度設定
│   ├── enemy.js             # 敵オブジェクト生成・DOMレンダリング
│   ├── player.js            # 入力処理・弾薬管理
│   ├── score.js             # スコア計算・コンボ・タイムボーナス
│   ├── audio.js             # Howler.jsラッパー — sfx() / playMusic()
│   ├── fx.js                # ビジュアルエフェクト用DOMオブジェクトプール
│   └── storage.js           # localStorageの読み書きヘルパー
└── assets/
    ├── images/              # 背景・キャラクター画像
    ├── audio/bgm/           # BGM
    ├── audio/sfx/           # SE
    └── fonts/               # カスタムフォント
```

### モジュール責務一覧

| ファイル | 役割 |
|---------|------|
| `main.js` | エントリポイント — 各モジュール初期化・UIイベント配線 |
| `state.js` | ランタイム中のゲーム状態を一元管理 |
| `screen.js` | 表示する画面の切り替えを制御 |
| `game.js` | `requestAnimationFrame` メインループ — 射撃・ヒット判定・リザルト |
| `stage.js` | 静的ステージデータ・敵タイプ・難易度パラメータ |
| `enemy.js` | 敵オブジェクト生成、DOMレンダリング、ボス体力バー |
| `player.js` | 射撃での弾薬消費、リロードタイマー管理 |
| `score.js` | スコア計算、コンボ倍率、タイムボーナス算出 |
| `audio.js` | Howler.jsをラップ — `sfx()` / `playMusic()` インターフェース提供 |
| `fx.js` | 血しぶき・弾痕・スコアラベルのDOMオブジェクトプール |
| `storage.js` | ランキング・設定のlocalStorage入出力をカプセル化 |

### 外部依存ライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|----------|------|
| Howler.js | 2.2.x | 音声再生管理（CDNまたはローカル） |

> Howler.js以外の外部依存は**ゼロ**です。

---

## ブラウザ対応

| ブラウザ | 最低バージョン | 備考 |
|---------|-------------|------|
| Chrome | 90以上 | フル対応 |
| Firefox | 85以上 | フル対応 |
| Edge | 90以上 | フル対応 |
| Safari (iOS) | 14以上 | 音声はユーザー操作後に開始 |
| Samsung Internet | 14以上 | モバイル主要ターゲット |

---

*Spec: `shooting_game_spec.md` v1.0*
