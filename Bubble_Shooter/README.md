# Bubble Shooter

A standalone HTML5 Canvas bubble shooter game. Open `index.html` directly in a browser; no build step, package manager, or local server is required.

## Quick Links

| Language | Program Specs | Gameplay |
| --- | --- |
| English | [Program Specification](#en-spec) | [How to Play](#en-play) |
| 日本語 | [プログラム仕様](#ja-spec) | [遊び方](#ja-play) |
| 中文 | [程式規格](#zh-spec) | [遊戲方式](#zh-play) |

---

<a id="en"></a>
## English

<a id="en-spec"></a>
### Program Specification

| Category | Details |
| --- | --- |
| Entry | `index.html` |
| Runtime | Browser only; direct `file://` opening is supported |
| Stack | HTML5, CSS3, Vanilla JavaScript, Canvas 2D |
| JavaScript style | Global `window.BubbleShooter` namespace; no ES modules |
| Storage | `localStorage` for settings, save data, and high score |
| Audio | MP3 paths first; Web Audio fallback when files are missing |
| Languages | English, Japanese, Traditional Chinese |
| Themes | Classic, Ocean, Candy, Neon, Dark |
| Difficulty | Easy, Normal, Hard |

### Code Structure

| Path | Purpose |
| --- | --- |
| `css/` | Layout, components, responsive rules, and themes |
| `js/core/` | Game config, state, and animation loop |
| `js/game/` | Bubble grid, shooter, collision, matching, and rendering |
| `js/ui/` | Screens, menu, settings, HUD, instructions, and i18n |
| `js/audio/` | BGM/SFX manager and fallback sound generation |
| `assets/audio/` | Optional MP3 files for BGM and sound effects |

### How to Start

Open `index.html` in Chrome, Edge, or another modern browser.

### Features

| Feature | Description |
| --- | --- |
| Canvas gameplay | A full bubble shooter board rendered with Canvas 2D |
| Aim and shoot | Use pointer, touch, keyboard arrows, Space, or Enter |
| Matching | Connect 3 or more bubbles of the same color to pop them |
| Drop bonus | Unsupported bubbles fall and award extra points |
| Pressure rows | Rows move down over time and after repeated misses |
| Save/continue | A current game can be continued from the main menu |
| Settings | Theme, language, difficulty, BGM/SFX volume, and mute |

<a id="en-play"></a>
### How to Play

| Action | Mouse / Touch | Keyboard |
| --- | --- | --- |
| Aim | Move pointer or finger | Left / Right arrows |
| Shoot | Click or release touch | Space / Enter |
| Pause | Pause button | Esc |

### Rules

1. Aim the shooter and fire a bubble.
2. Bubbles bounce off the left and right walls.
3. A bubble attaches when it hits the ceiling or another bubble.
4. Match 3 or more bubbles of the same color to pop them.
5. Bubbles no longer connected to the ceiling will drop.
6. Clear all bubbles to win.
7. The game ends when bubbles reach the warning line.

### Difficulty

| Difficulty | Row Pressure |
| --- | --- |
| Easy | Slower pressure; more misses allowed |
| Normal | Standard pace |
| Hard | Faster pressure; fewer misses allowed |

---

<a id="ja"></a>
## 日本語

<a id="ja-spec"></a>
### プログラム仕様

| 分類 | 内容 |
| --- | --- |
| 入口 | `index.html` |
| 実行環境 | ブラウザーのみ。`file://` で直接起動できます |
| 技術 | HTML5、CSS3、Vanilla JavaScript、Canvas 2D |
| JavaScript構成 | `window.BubbleShooter` のグローバル名前空間。ES Modules は未使用 |
| 保存 | 設定、セーブデータ、ハイスコアを `localStorage` に保存 |
| 音声 | MP3 を優先し、ファイルがない場合は Web Audio で代替 |
| 言語 | 英語、日本語、繁體中文 |
| テーマ | Classic、Ocean、Candy、Neon、Dark |
| 難易度 | かんたん、ふつう、むずかしい |

### コード構成

| パス | 役割 |
| --- | --- |
| `css/` | レイアウト、コンポーネント、レスポンシブ、テーマ |
| `js/core/` | ゲーム設定、状態管理、アニメーションループ |
| `js/game/` | バブル配置、シューター、衝突、マッチ判定、描画 |
| `js/ui/` | 画面、メニュー、設定、HUD、説明、i18n |
| `js/audio/` | BGM/効果音管理と代替音生成 |
| `assets/audio/` | 任意の MP3 BGM/効果音ファイル |

### 起動方法

`index.html` を Chrome、Edge などのモダンブラウザーで開きます。

### 機能

| 機能 | 内容 |
| --- | --- |
| Canvasゲーム | Canvas 2D で描画するバブルシューター |
| 狙って撃つ | ポインター、タッチ、矢印キー、Space、Enter に対応 |
| マッチ | 同じ色のバブルを3個以上つなげると消えます |
| 落下ボーナス | 天井につながっていないバブルが落下し、追加点になります |
| 下がる列 | 時間経過やミスの連続で列が下がります |
| セーブ継続 | メインメニューから続きのゲームを再開できます |
| 設定 | テーマ、言語、難易度、BGM/効果音音量、ミュート |

<a id="ja-play"></a>
### 遊び方

| 操作 | マウス / タッチ | キーボード |
| --- | --- | --- |
| 狙う | ポインターまたは指を動かす | 左右矢印キー |
| 発射 | クリックまたは指を離す | Space / Enter |
| 一時停止 | 一時停止ボタン | Esc |

### ルール

1. シューターで狙いを定めてバブルを発射します。
2. バブルは左右の壁で跳ね返ります。
3. 天井または他のバブルに当たると吸着します。
4. 同じ色を3個以上つなげると消えます。
5. 天井につながっていないバブルは落下します。
6. すべてのバブルを消すとクリアです。
7. バブルが警戒ラインに届くとゲーム終了です。

### 難易度

| 難易度 | 列の下がり方 |
| --- | --- |
| かんたん | ゆっくり下がり、ミス許容回数が多い |
| ふつう | 標準ペース |
| むずかしい | 早く下がり、ミス許容回数が少ない |

---

<a id="zh"></a>
## 中文

<a id="zh-spec"></a>
### 程式規格

| 分類 | 內容 |
| --- | --- |
| 入口 | `index.html` |
| 執行環境 | 只需瀏覽器，可直接用 `file://` 開啟 |
| 技術 | HTML5、CSS3、Vanilla JavaScript、Canvas 2D |
| JavaScript 架構 | 使用 `window.BubbleShooter` 全域命名空間，不使用 ES Module |
| 儲存 | 設定、存檔、最高分皆使用 `localStorage` |
| 音訊 | 優先讀取 MP3，缺少檔案時使用 Web Audio 產生替代 BGM/音效 |
| 語言 | 英文、日文、繁體中文 |
| 主題 | Classic、Ocean、Candy、Neon、Dark |
| 難易度 | 簡單、普通、困難 |

### 程式結構

| 路徑 | 用途 |
| --- | --- |
| `css/` | 版面、元件、RWD、主題樣式 |
| `js/core/` | 遊戲設定、狀態、動畫迴圈 |
| `js/game/` | 泡泡格線、發射器、碰撞、配對、Canvas 繪製 |
| `js/ui/` | 畫面切換、選單、設定、HUD、玩法說明、多國語系 |
| `js/audio/` | BGM/音效管理與替代音訊生成 |
| `assets/audio/` | 可選的 MP3 背景音樂與音效檔 |

### 啟動方式

使用 Chrome、Edge 或其他現代瀏覽器直接開啟 `index.html`。

### 功能

| 功能 | 說明 |
| --- | --- |
| Canvas 遊戲 | 使用 Canvas 2D 繪製完整泡泡龍遊戲區 |
| 瞄準發射 | 支援滑鼠、觸控、方向鍵、Space、Enter |
| 同色消除 | 三顆以上同色泡泡相連即可消除 |
| 掉落加分 | 未連接到頂端的泡泡會掉落並加分 |
| 下推壓力 | 依時間與連續未消除次數推下泡泡列 |
| 存檔繼續 | 可從主選單繼續上次遊戲 |
| 設定 | 主題、語言、難易度、背景音量、音效音量、靜音 |

<a id="zh-play"></a>
### 遊戲方式

| 操作 | 滑鼠 / 觸控 | 鍵盤 |
| --- | --- | --- |
| 瞄準 | 移動游標或手指 | 左 / 右方向鍵 |
| 發射 | 點擊或放開觸控 | Space / Enter |
| 暫停 | 暫停按鈕 | Esc |

### 遊戲規則

1. 移動砲台方向並發射泡泡。
2. 泡泡會在左右牆反彈。
3. 泡泡碰到頂端或其他泡泡後會吸附到格線。
4. 同色泡泡連成三顆以上會消除。
5. 消除後沒有連接到頂端的泡泡會掉落。
6. 清空場上所有泡泡即可過關。
7. 泡泡碰到警戒線時遊戲結束。

### 難易度

| 難易度 | 下推節奏 |
| --- | --- |
| 簡單 | 下推較慢，容許較多次未消除 |
| 普通 | 標準節奏 |
| 困難 | 下推較快，容許未消除次數較少 |
