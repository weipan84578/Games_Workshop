# Sudoku Web Game

## English

### Overview

This project is a standalone web-based Sudoku game built with Vanilla HTML, CSS, and JavaScript. It does not require a build step, framework, package manager, or backend server. Open `index.html` directly in a modern browser to play.

### Program Classification

| Area | Files / Folders | Responsibility |
| --- | --- | --- |
| Entry point | `index.html` | Defines the SPA screens, loads stylesheets, and loads JavaScript modules in dependency order. |
| Base styles | `css/base/` | Reset rules, design tokens, typography, and global CSS variables. |
| Layout styles | `css/layout/` | Responsive screen layout, grid sizing, and viewport behavior. |
| Component styles | `css/components/` | Buttons, modal, Sudoku board, number pad, timer, navigation, and toast messages. |
| Screen styles | `css/screens/` | Home, game, instructions, and settings screen styling. |
| Theme styles | `css/themes/` | Classic, dark, ocean, forest, sakura, and galaxy themes. |
| Animation styles | `css/animations/` | Screen transitions, cell feedback, and loading spinner effects. |
| Core logic | `js/core/` | Sudoku generation, solving, uniqueness checks, and validation helpers. |
| State management | `js/state/` | Game state, settings state, localStorage save/load, undo history, timer, and scoring. |
| UI rendering | `js/ui/` | Board rendering, number pad rendering, modal control, toast messages, timer display, and screen switching. |
| Input handling | `js/input/` | Keyboard, mouse, and touch input adapters. |
| Audio | `js/audio/` | Web Audio API based BGM and SFX controllers. |
| Documentation | `Sudoku_spec.md`, `README.md` | Original specification and project usage/rules documentation. |

### Game Rules

1. The game uses a standard 9x9 Sudoku board.
2. The board is divided into nine 3x3 boxes.
3. Fill every empty cell with a number from 1 to 9.
4. Each row must contain the numbers 1 to 9 without repetition.
5. Each column must contain the numbers 1 to 9 without repetition.
6. Each 3x3 box must contain the numbers 1 to 9 without repetition.
7. Given cells are fixed puzzle clues and cannot be changed.
8. Player-entered cells can be edited, erased, or restored through undo.
9. Each generated puzzle is checked to have a unique solution.
10. The puzzle is complete only when every cell matches the solution.

### Difficulty Levels

| Difficulty | Empty Cells | Description |
| --- | ---: | --- |
| Easy | 36 | More clues, suitable for quick play. |
| Medium | 46 | Balanced clue density and challenge. |
| Hard | 52 | Fewer clues and more deduction required. |
| Expert | 58 | Minimal clues and the highest challenge in this game. |

### Controls and Features

- Select a cell, then press an on-screen number button or keyboard key `1` to `9`.
- Press `0`, `Backspace`, or `Delete` to erase an editable selected cell.
- Arrow keys move the selected cell.
- `M` toggles memo mode.
- `H` uses a hint.
- `U` performs undo.
- `Esc` pauses the game.
- Memo mode stores candidate numbers inside a cell instead of committing an answer.
- Hints fill one incorrect or empty editable cell with the correct answer and count against the score.
- Undo restores recent player actions, including number input, memo changes, erase, and hint usage.
- The game can limit errors to 3 or 5 mistakes, or use no error limit.
- The timer can be shown or hidden from settings.
- The game is automatically saved to `localStorage` and can be continued from the home screen.
- Settings are saved to `localStorage` separately from game progress.

### Scoring

The game calculates a score after completion:

```text
base score = 1000
time penalty = floor(elapsed seconds / difficulty factor) * 10
error penalty = error count * 50
hint penalty = hint count * 100
final score = max(base score - penalties, 0)
```

Difficulty factors:

| Difficulty | Factor |
| --- | ---: |
| Easy | 1 |
| Medium | 1.5 |
| Hard | 2 |
| Expert | 3 |

Rank:

| Score | Rank |
| ---: | --- |
| 800 or higher | S |
| 500 to 799 | A |
| Below 500 | B |

### How to Run

Open `index.html` in a browser. No installation is required.

---

## 日本語

### 概要

このプロジェクトは、Vanilla HTML / CSS / JavaScript で作られたスタンドアロンの Web 数独ゲームです。ビルド、フレームワーク、パッケージマネージャー、バックエンドサーバーは不要です。ブラウザーで `index.html` を直接開くと遊べます。

### プログラム分類

| 区分 | ファイル / フォルダー | 役割 |
| --- | --- | --- |
| エントリーポイント | `index.html` | SPA 画面を定義し、CSS と JavaScript を依存順に読み込みます。 |
| ベーススタイル | `css/base/` | リセット、デザイントークン、タイポグラフィ、共通 CSS 変数を管理します。 |
| レイアウト | `css/layout/` | レスポンシブ配置、グリッドサイズ、ビューポート対応を管理します。 |
| コンポーネント | `css/components/` | ボタン、モーダル、盤面、数字パッド、タイマー、ナビゲーション、トーストを管理します。 |
| 画面別スタイル | `css/screens/` | ホーム、ゲーム、説明、設定画面のスタイルを管理します。 |
| テーマ | `css/themes/` | クラシック、ダーク、オーシャン、フォレスト、サクラ、ギャラクシーのテーマを管理します。 |
| アニメーション | `css/animations/` | 画面遷移、セルのフィードバック、ローディング表示を管理します。 |
| コアロジック | `js/core/` | 数独の生成、解法、唯一解チェック、入力検証を担当します。 |
| 状態管理 | `js/state/` | ゲーム状態、設定、localStorage、Undo 履歴、タイマー、スコアを管理します。 |
| UI 描画 | `js/ui/` | 盤面、数字パッド、モーダル、トースト、タイマー、画面切り替えを描画・制御します。 |
| 入力処理 | `js/input/` | キーボード、マウス、タッチ入力を処理します。 |
| 音声 | `js/audio/` | Web Audio API による BGM と効果音を管理します。 |
| ドキュメント | `Sudoku_spec.md`, `README.md` | 元仕様と利用方法・ルールを記載します。 |

### ゲームルール

1. 標準的な 9x9 の数独盤面を使用します。
2. 盤面は 3x3 のブロック 9 個に分かれています。
3. 空いているセルに 1 から 9 の数字を入れます。
4. 各行には 1 から 9 が重複なく入る必要があります。
5. 各列には 1 から 9 が重複なく入る必要があります。
6. 各 3x3 ブロックには 1 から 9 が重複なく入る必要があります。
7. 最初から表示されている数字は固定ヒントで、変更できません。
8. プレイヤーが入力したセルは、編集、消去、Undo ができます。
9. 生成される問題は、唯一解を持つことを確認しています。
10. 全てのセルが正解と一致した時点でクリアです。

### 難易度

| 難易度 | 空白セル数 | 説明 |
| --- | ---: | --- |
| 簡単 | 36 | ヒントが多く、短時間で遊びやすい難易度です。 |
| 中級 | 46 | ヒント量と手応えのバランスが取れた難易度です。 |
| 難しい | 52 | ヒントが少なく、より多くの推理が必要です。 |
| エキスパート | 58 | 最も空白が多く、このゲームで最も難しい難易度です。 |

### 操作と機能

- セルを選択してから、画面上の数字ボタンまたはキーボードの `1` から `9` を押します。
- `0`、`Backspace`、`Delete` で編集可能な選択セルを消去します。
- 矢印キーで選択セルを移動します。
- `M` でメモモードを切り替えます。
- `H` でヒントを使います。
- `U` で Undo を実行します。
- `Esc` で一時停止します。
- メモモードでは、回答ではなく候補数字をセル内に記録します。
- ヒントは、未入力または間違っている編集可能セルを 1 つ正解で埋め、スコア減点対象になります。
- Undo は、数字入力、メモ変更、消去、ヒント使用などの直近操作を復元します。
- エラー上限は 3 回、5 回、または無制限から選べます。
- タイマーは設定で表示・非表示を切り替えられます。
- ゲーム進行は `localStorage` に自動保存され、ホーム画面から続きができます。
- 設定はゲーム進行とは別に `localStorage` に保存されます。

### スコア計算

クリア時に以下の式でスコアを計算します。

```text
基本点 = 1000
時間減点 = floor(経過秒数 / 難易度係数) * 10
ミス減点 = ミス回数 * 50
ヒント減点 = ヒント回数 * 100
最終スコア = max(基本点 - 各減点, 0)
```

難易度係数:

| 難易度 | 係数 |
| --- | ---: |
| 簡単 | 1 |
| 中級 | 1.5 |
| 難しい | 2 |
| エキスパート | 3 |

ランク:

| スコア | ランク |
| ---: | --- |
| 800 以上 | S |
| 500 から 799 | A |
| 500 未満 | B |

### 実行方法

ブラウザーで `index.html` を開くだけで実行できます。インストールは不要です。

---

## 繁體中文

### 概要

本專案是一款使用 Vanilla HTML / CSS / JavaScript 製作的單機 Web 版數獨遊戲。不需要建置流程、前端框架、套件管理器或後端伺服器。直接用瀏覽器開啟 `index.html` 即可遊玩。

### 程式分類

| 分類 | 檔案 / 資料夾 | 職責 |
| --- | --- | --- |
| 入口檔 | `index.html` | 定義 SPA 畫面結構，並依相依順序載入 CSS 與 JavaScript。 |
| 基礎樣式 | `css/base/` | 管理 reset、設計變數、字體排版與全域 CSS 變數。 |
| 版面樣式 | `css/layout/` | 管理 RWD 版面、格線尺寸與 viewport 行為。 |
| 元件樣式 | `css/components/` | 管理按鈕、彈窗、數獨棋盤、數字鍵盤、計時器、導覽列與提示訊息。 |
| 畫面樣式 | `css/screens/` | 管理首頁、遊戲、玩法說明與設定畫面的樣式。 |
| 主題樣式 | `css/themes/` | 管理經典、深色、海洋、森林、櫻花、銀河六種主題。 |
| 動畫樣式 | `css/animations/` | 管理畫面轉場、格子回饋與載入動畫。 |
| 核心邏輯 | `js/core/` | 負責數獨產生、解題、唯一解檢查與輸入驗證。 |
| 狀態管理 | `js/state/` | 管理遊戲狀態、設定、localStorage 儲存、復原紀錄、計時與分數。 |
| UI 渲染 | `js/ui/` | 負責棋盤、數字鍵盤、彈窗、toast、計時器與畫面切換。 |
| 輸入處理 | `js/input/` | 處理鍵盤、滑鼠與觸控輸入。 |
| 音訊 | `js/audio/` | 使用 Web Audio API 管理背景音樂與操作音效。 |
| 文件 | `Sudoku_spec.md`, `README.md` | 保留原始規格與專案使用方式、規則說明。 |

### 遊戲規則

1. 遊戲使用標準 9x9 數獨棋盤。
2. 棋盤分為九個 3x3 宮格。
3. 玩家需要在所有空格中填入 1 到 9。
4. 每一列都必須包含 1 到 9，且不能重複。
5. 每一行都必須包含 1 到 9，且不能重複。
6. 每一個 3x3 宮格都必須包含 1 到 9，且不能重複。
7. 題目一開始給定的數字是固定提示，不能修改。
8. 玩家輸入的格子可以修改、清除，也可以透過復原還原。
9. 每一道產生的題目都會檢查為唯一解。
10. 所有格子都與答案一致時，遊戲完成。

### 難度

| 難度 | 空白格數 | 說明 |
| --- | ---: | --- |
| 簡單 | 36 | 提示較多，適合快速遊玩。 |
| 中等 | 46 | 題目線索與挑戰度較平衡。 |
| 困難 | 52 | 線索較少，需要更多推理。 |
| 專家 | 58 | 空白最多，是本遊戲最高難度。 |

### 操作與功能

- 點選格子後，可按畫面數字鍵或鍵盤 `1` 到 `9` 輸入答案。
- 按 `0`、`Backspace` 或 `Delete` 可清除目前選取的可編輯格子。
- 方向鍵可移動目前選取格。
- `M` 可切換筆記模式。
- `H` 可使用提示。
- `U` 可執行復原。
- `Esc` 可暫停遊戲。
- 筆記模式會把輸入數字記為候選數字，不會直接作為答案。
- 提示會把一個空白或錯誤的可編輯格填入正確答案，並列入分數扣分。
- 復原可還原近期操作，包含輸入、筆記、清除與提示。
- 錯誤上限可設定為 3 次、5 次或無限制。
- 計時器可在設定中切換顯示或隱藏。
- 遊戲進度會自動儲存到 `localStorage`，可從首頁繼續遊戲。
- 設定會獨立儲存到 `localStorage`，不會與遊戲進度混在一起。

### 分數計算

完成遊戲時會依下列公式計分：

```text
基礎分數 = 1000
時間扣分 = floor(經過秒數 / 難度係數) * 10
錯誤扣分 = 錯誤次數 * 50
提示扣分 = 提示次數 * 100
最終分數 = max(基礎分數 - 各項扣分, 0)
```

難度係數：

| 難度 | 係數 |
| --- | ---: |
| 簡單 | 1 |
| 中等 | 1.5 |
| 困難 | 2 |
| 專家 | 3 |

評級：

| 分數 | 評級 |
| ---: | --- |
| 800 以上 | S |
| 500 到 799 | A |
| 500 以下 | B |

### 執行方式

直接用瀏覽器開啟 `index.html` 即可執行，不需要安裝任何依賴。
