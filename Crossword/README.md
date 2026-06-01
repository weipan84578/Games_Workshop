# Crossword

Pure front-end crossword game built with HTML5, CSS3, and Vanilla JavaScript. No build step, package manager, or server is required.

## Language

| Language | Link |
|---|---|
| 繁體中文 | [前往繁體中文說明](#zh-tw) |
| 日本語 | [日本語の説明へ](#ja) |
| English | [Go to English Guide](#en) |

---

<a id="zh-tw"></a>

## 繁體中文

### 專案概要

| 項目 | 說明 |
|---|---|
| 遊戲類型 | Web 版填字遊戲 |
| 技術 | HTML5 / CSS3 / Vanilla JavaScript |
| 啟動方式 | 直接開啟 `index.html` |
| 依賴 | 無 npm、無 build、無 server |
| 存檔 | 使用 `localStorage` 自動保存 |
| 音效與音樂 | Web Audio API 產生內建 BGM 與 SFX |
| 響應式 | 支援桌機、平板與行動裝置 |

### 快速開始

| 步驟 | 操作 |
|---|---|
| 1 | 在瀏覽器開啟 `index.html` |
| 2 | 點選「開始遊戲」 |
| 3 | 選擇簡單、中等或困難 |
| 4 | 點選格子或提示，開始輸入字母 |

> 瀏覽器通常會限制自動播放音訊，因此背景音樂會在第一次點擊畫面後啟動。

### 遊戲方式

| 目標 | 說明 |
|---|---|
| 填入答案 | 根據橫向與縱向提示，在白色格子中輸入英文字母 |
| 共用字母 | 橫向與縱向單字交會時，共用同一個字母 |
| 避開黑格 | 黑色格子不可輸入 |
| 完成謎題 | 所有可填格都填入正確字母後，進入完成畫面 |

### 操作方式

| 操作 | 行為 |
|---|---|
| 點選格子 | 選取目前格子 |
| 再次點選同一格 | 若該格同時屬於橫向與縱向單字，會切換方向 |
| 點選提示 | 跳到該題的可填格 |
| 字母鍵 | 輸入字母並移動到下一格 |
| Backspace | 清除目前格，或退回上一格 |
| Enter | 切換橫向 / 縱向 |
| 方向鍵 | 移動選取格 |
| Tab / Shift + Tab | 前往下一題 / 上一題 |
| 手機虛擬鍵盤 | 使用畫面底部按鍵輸入 |

### 功能說明

| 功能 | 說明 |
|---|---|
| 難度選擇 | 提供簡單、中等、困難三種題庫 |
| 提示 | 揭示目前單字中一個尚未正確填入的格子 |
| 驗證 | 檢查目前已填入的字母，並標示正確或錯誤 |
| 計時器 | 顯示本局已用時間，可在設定中關閉 |
| 自動存檔 | 輸入後會排程存檔，離開遊戲時會立即保存 |
| 繼續遊戲 | 主選單可載入上次未完成的進度 |
| 主題切換 | 支援六套配色主題 |
| 行動裝置優化 | 手機上會降低動畫、陰影、音效密度與存檔頻率 |

### 程式分類

| 路徑 | 類型 | 用途 |
|---|---|---|
| `index.html` | 入口 | 定義畫面容器並依序載入 CSS / JS |
| `assets/` | 靜態資源 | Logo、字型說明與未來可擴充的圖片/音訊資源 |
| `css/base/` | 基礎樣式 | Reset、全域變數、字體規則 |
| `css/themes/` | 主題 | 六套配色主題，透過 `data-theme` 切換 |
| `css/layout/` | 版面 | 填字格盤、遊戲主版面、RWD 斷點 |
| `css/components/` | 元件樣式 | 按鈕、彈窗、提示面板、鍵盤、通知、進度條 |
| `css/screens/` | 畫面樣式 | 主選單、遊戲、設定、說明、勝利畫面 |
| `js/utils/` | 工具 | DOM helper、存檔封裝、裝置偵測 |
| `js/core/` | 核心 | App 入口、全域狀態、事件匯流排 |
| `js/data/` | 資料 | 主題資料與各難度題庫 |
| `js/engine/` | 遊戲引擎 | 謎題解析、格盤渲染、答案驗證 |
| `js/ui/` | UI 元件 | 畫面切換、提示列表、虛擬鍵盤、計時器、彈窗、通知 |
| `js/audio/` | 音訊 | Web Audio BGM、SFX、BGM 切換控制 |
| `data/` | 備用資料 | 預留 JSON 題庫載入位置 |

### 主要程式檔案

| 檔案 | 職責 |
|---|---|
| `js/core/app.js` | 串接畫面、輸入、提示、驗證、存檔與勝利流程 |
| `js/core/state.js` | 保存目前遊戲狀態與設定 |
| `js/utils/storage.js` | 管理 `localStorage` 設定與遊戲存檔 |
| `js/engine/puzzle.js` | 將題庫資料轉成可操作的內部模型 |
| `js/engine/grid.js` | 渲染格盤並做局部 DOM 更新 |
| `js/engine/solver.js` | 驗證字母、單字與整題完成狀態 |
| `js/ui/cluePanel.js` | 產生橫向/縱向提示列表 |
| `js/ui/keyboard.js` | 產生行動裝置用虛擬鍵盤 |
| `js/audio/audioManager.js` | 使用 Web Audio API 產生 BGM 與 SFX |

### 資料流

| 階段 | 流程 |
|---|---|
| 題庫載入 | `js/data/puzzles/*.js` 定義題目 |
| 模型建立 | `PuzzleEngine.buildModel()` 建立格子、單字與提示關係 |
| 遊戲互動 | `app.js` 接收鍵盤、滑鼠與觸控輸入 |
| 畫面更新 | `GridRenderer.refresh()` 做局部更新 |
| 答案驗證 | `Solver` 檢查格子、單字與整題狀態 |
| 存檔 | `GameStorage.saveGame()` 排程寫入 `localStorage` |

### 開發與驗證

| 目的 | 指令 |
|---|---|
| 檢查 JS 語法 | `node --check js/core/app.js` |
| 檢查所有 JS | PowerShell: `Get-ChildItem -Recurse -Filter *.js \| ForEach-Object { node --check $_.FullName }` |
| 啟動遊戲 | 直接開啟 `index.html` |

---

<a id="ja"></a>

## 日本語

### プロジェクト概要

| 項目 | 内容 |
|---|---|
| ゲーム種別 | Web 版クロスワードゲーム |
| 技術 | HTML5 / CSS3 / Vanilla JavaScript |
| 起動方法 | `index.html` を直接開く |
| 依存関係 | npm、build、server は不要 |
| セーブ | `localStorage` に自動保存 |
| 音楽・効果音 | Web Audio API で内蔵 BGM / SFX を生成 |
| レスポンシブ | デスクトップ、タブレット、モバイル対応 |

### クイックスタート

| 手順 | 操作 |
|---|---|
| 1 | ブラウザで `index.html` を開く |
| 2 | 「開始遊戲」を選択 |
| 3 | 難易度を選択 |
| 4 | マスまたはヒントを選び、文字を入力 |

> ブラウザの自動再生制限により、BGM は最初のクリック後に再生されます。

### 遊び方

| 目的 | 説明 |
|---|---|
| 答えを入力 | 横方向・縦方向のヒントをもとに、白いマスへ英字を入力します |
| 文字の共有 | 横方向と縦方向が交差するマスは、同じ文字を共有します |
| 黒マス | 黒いマスには入力できません |
| クリア条件 | すべての入力可能マスに正しい文字を入れるとクリアです |

### 操作方法

| 操作 | 動作 |
|---|---|
| マスをクリック | 現在のマスを選択 |
| 同じマスを再クリック | 横方向 / 縦方向を切り替え |
| ヒントをクリック | その単語の入力位置へ移動 |
| 英字キー | 文字を入力して次のマスへ移動 |
| Backspace | 現在の文字を削除、または前のマスへ戻る |
| Enter | 横方向 / 縦方向を切り替え |
| 矢印キー | 選択マスを移動 |
| Tab / Shift + Tab | 次 / 前の単語へ移動 |
| 仮想キーボード | モバイル画面下部のキーで入力 |

### 機能

| 機能 | 内容 |
|---|---|
| 難易度選択 | Easy / Medium / Hard の 3 種類 |
| ヒント | 現在の単語から未完成の 1 マスを開示 |
| 検証 | 入力済み文字の正誤を表示 |
| タイマー | プレイ時間を表示。設定で非表示にできます |
| 自動セーブ | 入力後に保存を予約し、離脱時に即時保存 |
| 続きから再開 | メインメニューから未完了の進行状況を復元 |
| テーマ切替 | 6 種類のカラーテーマを提供 |
| モバイル最適化 | アニメーション、影、音効密度、保存頻度を抑制 |

### コード分類

| パス | 種別 | 役割 |
|---|---|---|
| `index.html` | エントリ | 画面コンテナと CSS / JS の読み込み順を定義 |
| `assets/` | 静的リソース | Logo、フォント説明、将来の画像/音声リソース |
| `css/base/` | 基礎 CSS | Reset、変数、タイポグラフィ |
| `css/themes/` | テーマ | `data-theme` で切り替える 6 種類の配色 |
| `css/layout/` | レイアウト | グリッド、ゲーム画面、RWD |
| `css/components/` | コンポーネント | ボタン、モーダル、ヒントパネル、キーボード、通知 |
| `css/screens/` | 画面別 CSS | メニュー、ゲーム、設定、説明、勝利画面 |
| `js/utils/` | ユーティリティ | DOM helper、保存処理、デバイス検出 |
| `js/core/` | コア | App 起動、状態管理、イベントバス |
| `js/data/` | データ | テーマ設定と難易度別パズル |
| `js/engine/` | ゲームエンジン | パズル解析、グリッド描画、解答検証 |
| `js/ui/` | UI | 画面切替、ヒント一覧、仮想キーボード、タイマー |
| `js/audio/` | 音声 | Web Audio BGM / SFX と BGM 切替 |
| `data/` | 予備データ | JSON パズル読み込み用の予約領域 |

### 主要ファイル

| ファイル | 役割 |
|---|---|
| `js/core/app.js` | 画面、入力、ヒント、検証、保存、勝利フローを統合 |
| `js/core/state.js` | 現在のゲーム状態と設定を保持 |
| `js/utils/storage.js` | `localStorage` の設定とセーブデータを管理 |
| `js/engine/puzzle.js` | パズルデータを内部モデルへ変換 |
| `js/engine/grid.js` | グリッド描画と部分 DOM 更新 |
| `js/engine/solver.js` | 文字、単語、全体クリアを検証 |
| `js/ui/cluePanel.js` | 横方向 / 縦方向のヒント一覧を生成 |
| `js/ui/keyboard.js` | モバイル向け仮想キーボードを生成 |
| `js/audio/audioManager.js` | Web Audio API による BGM / SFX 生成 |

### データフロー

| 段階 | 流れ |
|---|---|
| パズル読み込み | `js/data/puzzles/*.js` で問題を定義 |
| モデル作成 | `PuzzleEngine.buildModel()` でマス、単語、ヒント関係を構築 |
| 入力処理 | `app.js` がキーボード、マウス、タッチ入力を処理 |
| 画面更新 | `GridRenderer.refresh()` が必要な DOM だけ更新 |
| 検証 | `Solver` がマス、単語、全体状態を検証 |
| 保存 | `GameStorage.saveGame()` が `localStorage` 書き込みを予約 |

### 開発・検証

| 目的 | コマンド |
|---|---|
| JS 構文チェック | `node --check js/core/app.js` |
| 全 JS チェック | PowerShell: `Get-ChildItem -Recurse -Filter *.js \| ForEach-Object { node --check $_.FullName }` |
| ゲーム起動 | `index.html` を直接開く |

---

<a id="en"></a>

## English

### Project Overview

| Item | Description |
|---|---|
| Game type | Web crossword game |
| Stack | HTML5 / CSS3 / Vanilla JavaScript |
| Launch | Open `index.html` directly |
| Dependencies | No npm, no build step, no server |
| Save system | Auto-save with `localStorage` |
| Audio | Built-in BGM and SFX generated by Web Audio API |
| Responsive design | Desktop, tablet, and mobile support |

### Quick Start

| Step | Action |
|---|---|
| 1 | Open `index.html` in a browser |
| 2 | Select "Start Game" |
| 3 | Choose a difficulty |
| 4 | Select a cell or clue, then type letters |

> Due to browser autoplay restrictions, BGM starts after the first user interaction.

### How to Play

| Goal | Description |
|---|---|
| Fill answers | Use across and down clues to enter English letters into white cells |
| Shared letters | Intersections share the same letter between across and down answers |
| Black cells | Black cells are blocked and cannot be edited |
| Win condition | Fill every playable cell with the correct letter |

### Controls

| Control | Behavior |
|---|---|
| Click a cell | Select the current cell |
| Click the same cell again | Toggle across / down when both directions exist |
| Click a clue | Jump to that clue's word |
| Letter keys | Enter a letter and move forward |
| Backspace | Clear the current letter or move backward |
| Enter | Toggle across / down |
| Arrow keys | Move the selected cell |
| Tab / Shift + Tab | Move to next / previous clue |
| Virtual keyboard | Use the on-screen keyboard on mobile |

### Features

| Feature | Description |
|---|---|
| Difficulty selection | Easy, Medium, and Hard puzzles |
| Hint | Reveals one unresolved cell in the active word |
| Validate | Checks entered letters and marks correct / wrong cells |
| Timer | Shows elapsed time and can be disabled in settings |
| Auto-save | Schedules saves after input and flushes immediately when leaving |
| Continue game | Restores unfinished progress from the main menu |
| Themes | Six color themes |
| Mobile optimization | Reduces animation, shadows, sound density, and save frequency |

### Code Organization

| Path | Type | Purpose |
|---|---|---|
| `index.html` | Entry point | Defines screen containers and CSS / JS load order |
| `assets/` | Static assets | Logo, font notes, and future image/audio assets |
| `css/base/` | Base styles | Reset, variables, typography |
| `css/themes/` | Themes | Six color themes switched by `data-theme` |
| `css/layout/` | Layout | Crossword board, game layout, responsive rules |
| `css/components/` | Components | Buttons, modal, clue panel, keyboard, notifications, progress |
| `css/screens/` | Screen styles | Main menu, game, settings, instructions, victory screen |
| `js/utils/` | Utilities | DOM helpers, storage wrapper, device detection |
| `js/core/` | Core | App startup, global state, event bus |
| `js/data/` | Data | Theme metadata and puzzle sets |
| `js/engine/` | Game engine | Puzzle parsing, grid rendering, answer validation |
| `js/ui/` | UI modules | Screen manager, clue list, virtual keyboard, timer, modal, toast |
| `js/audio/` | Audio | Web Audio BGM / SFX and BGM routing |
| `data/` | Reserved data | Placeholder for JSON puzzle loading |

### Key Files

| File | Responsibility |
|---|---|
| `js/core/app.js` | Connects screens, input, hints, validation, save, and victory flow |
| `js/core/state.js` | Stores current game state and settings |
| `js/utils/storage.js` | Manages settings and save data in `localStorage` |
| `js/engine/puzzle.js` | Converts puzzle data into an internal model |
| `js/engine/grid.js` | Renders the board and performs partial DOM updates |
| `js/engine/solver.js` | Validates letters, words, and full puzzle completion |
| `js/ui/cluePanel.js` | Generates across / down clue panels |
| `js/ui/keyboard.js` | Generates the mobile virtual keyboard |
| `js/audio/audioManager.js` | Generates BGM and SFX with Web Audio API |

### Data Flow

| Stage | Flow |
|---|---|
| Puzzle loading | `js/data/puzzles/*.js` defines puzzle data |
| Model creation | `PuzzleEngine.buildModel()` builds cell, word, and clue relationships |
| Interaction | `app.js` handles keyboard, mouse, and touch input |
| Rendering | `GridRenderer.refresh()` updates only the required DOM nodes |
| Validation | `Solver` checks cell, word, and puzzle completion states |
| Saving | `GameStorage.saveGame()` schedules writes to `localStorage` |

### Development and Validation

| Purpose | Command |
|---|---|
| Check one JS file | `node --check js/core/app.js` |
| Check all JS files | PowerShell: `Get-ChildItem -Recurse -Filter *.js \| ForEach-Object { node --check $_.FullName }` |
| Run the game | Open `index.html` directly |
