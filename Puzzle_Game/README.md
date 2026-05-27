# Puzzle Challenge / パズルチャレンジ / 拼圖挑戰

A browser-based jigsaw puzzle game built with Vanilla HTML, CSS, and JavaScript.

Vanilla HTML/CSS/JavaScript で作られたブラウザ向けジグソーパズルゲームです。

使用 Vanilla HTML、CSS、JavaScript 製作的 Web 版拼圖遊戲。

---

## Quick Index / 目次 / 快速索引

- [English](#english)
- [日本語](#日本語)
- [中文](#中文)
- [Program Map / プログラム構成 / 程式結構](#program-map--プログラム構成--程式結構)

---

## English

### Overview

Puzzle Challenge lets you create a jigsaw puzzle from either the built-in demo artwork or your own local image. The game runs fully in the browser with no build step and no backend server requirement.

Key features:

- Custom image upload with center-square cropping.
- Six puzzle sizes: 3x3, 4x4, 5x5, 6x6, 8x8, and 10x10.
- Canvas-based drag and snap gameplay.
- Mouse, touch, and keyboard support.
- Procedural background music and sound effects through Web Audio API.
- Light and dark display modes.
- Six color themes.
- Session-based game resume.
- Direct `index.html` support through `js/app.bundle.js`.

### How To Run

Option 1: open directly:

```text
Double-click index.html
```

Option 2: run a local static server:

```powershell
node dev-server.mjs 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

### How To Play

1. Select **Start New Game**.
2. Choose an image:
   - Pick a local JPG, PNG, WebP, GIF, or BMP file.
   - Or use the built-in default artwork.
3. Choose a difficulty.
4. Drag puzzle pieces on the board.
5. Release a piece near its correct position to snap it into place.
6. Use **Hint** to highlight a correct target position.
7. Use **Shuffle** to rearrange unsolved pieces.
8. Finish all pieces to see the victory screen.

### Controls

| Action | Mouse / Touch | Keyboard |
|---|---|---|
| Move a piece | Drag a piece | - |
| Pause / resume | Pause button | Space |
| Return to menu | Menu button | Esc |
| Show hint | Hint button | - |
| Shuffle pieces | Shuffle button | - |

### Privacy: Your Image Is Not Saved

Uploaded images are processed only inside the current browser page.

The game does **not** save uploaded image data to:

- localStorage
- sessionStorage
- IndexedDB
- cookies
- any remote server

Only lightweight puzzle state can be stored in `sessionStorage`, such as:

- difficulty
- piece positions
- solved piece flags
- elapsed time
- image source type

If you upload a custom image and then close or reload the tab, the image itself is gone. This is intentional, so you can play safely with private images.

### Settings

Available settings:

- Background music volume.
- Sound effect volume.
- Light / dark display mode.
- Default difficulty.
- Color theme.

The settings screen also includes a sound test button.

---

## 日本語

### 概要

パズルチャレンジは、内蔵のデモ画像または自分のローカル画像からジグソーパズルを作成できるブラウザゲームです。ビルド手順やバックエンドサーバーは不要で、ブラウザだけで動作します。

主な機能:

- 画像アップロードと中央正方形トリミング。
- 3x3、4x4、5x5、6x6、8x8、10x10 の 6 段階の難易度。
- Canvas によるドラッグ＆スナップ操作。
- マウス、タッチ、キーボード対応。
- Web Audio API による生成音楽と効果音。
- ライトモード / ダークモード切り替え。
- 6 種類のカラーテーマ。
- セッション内のゲーム再開。
- `js/app.bundle.js` により `index.html` を直接開いても動作。

### 起動方法

方法 1: 直接開く:

```text
index.html をダブルクリック
```

方法 2: ローカル静的サーバーを使う:

```powershell
node dev-server.mjs 5173
```

その後、以下を開きます:

```text
http://127.0.0.1:5173/
```

### 遊び方

1. **新しいゲームを開始** を選択します。
2. 画像を選びます:
   - ローカルの JPG、PNG、WebP、GIF、BMP ファイルを選択。
   - または内蔵のデフォルト画像を使用。
3. 難易度を選択します。
4. パズルピースをドラッグします。
5. 正しい位置の近くで離すと、ピースが吸着します。
6. **ヒント** で正しい位置を一時的に表示できます。
7. **シャッフル** で未完成ピースを並べ替えられます。
8. すべてのピースを完成させるとクリア画面が表示されます。

### 操作

| 操作 | マウス / タッチ | キーボード |
|---|---|---|
| ピースを動かす | ピースをドラッグ | - |
| 一時停止 / 再開 | 一時停止ボタン | Space |
| メニューへ戻る | メニューボタン | Esc |
| ヒント表示 | ヒントボタン | - |
| シャッフル | シャッフルボタン | - |

### プライバシー: 画像は保存されません

アップロードされた画像は、現在開いているブラウザページ内だけで処理されます。

ゲームはアップロード画像のデータを以下に保存しません:

- localStorage
- sessionStorage
- IndexedDB
- cookies
- リモートサーバー

`sessionStorage` に保存される可能性があるのは、軽量なゲーム状態のみです:

- 難易度
- ピース位置
- 完成済みピースの状態
- 経過時間
- 画像ソース種別

カスタム画像をアップロードしたあと、タブを閉じたり再読み込みしたりすると、画像データは消えます。プライベートな画像でも安心して遊べるようにするための仕様です。

### 設定

設定できる項目:

- 背景音楽の音量。
- 効果音の音量。
- ライト / ダーク表示モード。
- デフォルト難易度。
- カラーテーマ。

設定画面には効果音テストボタンもあります。

---

## 中文

### 概述

拼圖挑戰是一款可在瀏覽器中遊玩的拼圖遊戲。你可以使用內建示範圖片，也可以上傳本機圖片來產生拼圖。專案使用 Vanilla HTML、CSS、JavaScript 製作，不需要建置流程，也不需要後端伺服器。

主要功能：

- 上傳圖片並自動置中裁切成正方形。
- 六種難度：3x3、4x4、5x5、6x6、8x8、10x10。
- 使用 Canvas 製作拖曳與吸附拼圖玩法。
- 支援滑鼠、觸控與鍵盤。
- 使用 Web Audio API 產生背景音樂與音效。
- 可切換明亮模式 / 黑暗模式。
- 六種色彩主題。
- 支援同一分頁工作階段內繼續遊戲。
- 透過 `js/app.bundle.js` 支援直接開啟 `index.html`。

### 執行方式

方式 1：直接開啟：

```text
雙擊 index.html
```

方式 2：使用本機靜態伺服器：

```powershell
node dev-server.mjs 5173
```

接著打開：

```text
http://127.0.0.1:5173/
```

### 玩法

1. 點選 **開始新遊戲**。
2. 選擇圖片：
   - 選擇本機 JPG、PNG、WebP、GIF、BMP 圖片。
   - 或使用內建預設圖片。
3. 選擇難度。
4. 拖曳拼圖碎片。
5. 將碎片放到正確位置附近時，會自動吸附。
6. 點選 **提示** 可短暫顯示其中一片的正確位置。
7. 點選 **打亂** 可重新排列尚未完成的碎片。
8. 完成全部碎片後進入完成畫面。

### 操作

| 動作 | 滑鼠 / 觸控 | 鍵盤 |
|---|---|---|
| 移動碎片 | 拖曳碎片 | - |
| 暫停 / 繼續 | 暫停按鈕 | Space |
| 返回主選單 | 主選單按鈕 | Esc |
| 顯示提示 | 提示按鈕 | - |
| 打亂碎片 | 打亂按鈕 | - |

### 隱私安心：不保存圖片

上傳的圖片只會在目前瀏覽器頁面中處理。

遊戲不會把上傳圖片資料保存到：

- localStorage
- sessionStorage
- IndexedDB
- cookies
- 任何遠端伺服器

`sessionStorage` 最多只會保存輕量的遊戲狀態，例如：

- 難度
- 碎片位置
- 碎片是否完成
- 已用時間
- 圖片來源類型

如果你上傳自訂圖片後關閉分頁或重新整理，圖片本身就會消失。這是刻意設計，讓你可以安心使用私人圖片遊玩。

### 設定

可調整項目：

- 背景音樂音量。
- 音效音量。
- 明亮 / 黑暗顯示模式。
- 預設難度。
- 色彩主題。

設定頁也提供音效測試按鈕。

---

## Program Map / プログラム構成 / 程式結構

### Entry Files / エントリー / 入口檔案

| Path | Role |
|---|---|
| `index.html` | Main HTML entry. Loads CSS and `js/app.bundle.js` for direct browser opening. |
| `dev-server.mjs` | Small Node.js static server for local testing. |
| `puzzle-game-spec.md` | Original implementation specification. |

### CSS

| Path | Role |
|---|---|
| `css/base/reset.css` | Browser reset and base element behavior. |
| `css/base/variables.css` | Shared CSS variables. |
| `css/base/typography.css` | Font and text styles. |
| `css/layout/app.css` | Global layout, surfaces, toolbars, toast area. |
| `css/layout/responsive.css` | Responsive breakpoints and reduced-motion support. |
| `css/screens/*.css` | Screen-specific styles for menu, game, settings, instructions, victory. |
| `css/components/*.css` | Reusable UI components such as buttons, modals, uploads, themes. |
| `css/themes/theme-*.css` | Six color themes. |
| `css/themes/appearance.css` | Light and dark display mode styling. |

### JavaScript Core

| Path | Role |
|---|---|
| `js/main.js` | Application bootstrap, routing, audio unlock, game lifecycle. |
| `js/app.bundle.js` | Generated browser bundle for direct `index.html` use. |
| `js/core/router.js` | Screen navigation. |
| `js/core/state.js` | Runtime application state. |
| `js/core/event-bus.js` | Lightweight event bus utility. |
| `js/utils/constants.js` | Difficulty, theme, image, and setting constants. |
| `js/utils/helpers.js` | DOM helpers, time formatting, canvas helpers. |
| `js/utils/storage.js` | Session-based puzzle progress save/load. |

### JavaScript Screens

| Path | Role |
|---|---|
| `js/screens/MainMenuScreen.js` | Main menu and new game setup modal. |
| `js/screens/GameScreen.js` | Canvas game screen, HUD, timer, pause, controls. |
| `js/screens/SettingsScreen.js` | Audio, display mode, difficulty, and theme settings. |
| `js/screens/InstructionsScreen.js` | How-to-play screen. |
| `js/screens/VictoryScreen.js` | Completion result screen. |

### JavaScript Game

| Path | Role |
|---|---|
| `js/game/PuzzleEngine.js` | Puzzle logic, rendering, shuffle, snapping, hint, victory detection. |
| `js/game/PuzzlePiece.js` | Individual puzzle piece model and drawing logic. |
| `js/game/DragController.js` | Pointer drag handling for mouse and touch. |
| `js/game/TouchController.js` | Touch-compatible controller wrapper. |
| `js/game/Timer.js` | Game timer. |
| `js/game/ScoreManager.js` | In-memory best time tracking for the current session. |

### JavaScript Image

| Path | Role |
|---|---|
| `js/image/ImageImporter.js` | File validation and image loading. |
| `js/image/ImageCropper.js` | Center-square crop to canvas. |
| `js/image/ImageSlicer.js` | Slices a source canvas into puzzle tiles. |

### JavaScript Audio

| Path | Role |
|---|---|
| `js/audio/AudioEngine.js` | Web Audio API context, gain nodes, tones, noise generation. |
| `js/audio/MusicPlayer.js` | Procedural background music patterns. |
| `js/audio/SoundEffects.js` | Click, snap, shuffle, hint, pause, victory, and error effects. |
| `js/audio/AudioSettings.js` | Applies volume settings to the audio engine. |

### JavaScript UI

| Path | Role |
|---|---|
| `js/ui/ThemeManager.js` | Applies color theme and light/dark mode classes. |
| `js/ui/Modal.js` | Reusable modal component. |
| `js/ui/Toast.js` | Temporary status/error messages. |
| `js/ui/Transitions.js` | Screen transition helper. |

### Assets

| Path | Role |
|---|---|
| `assets/icons/favicon.svg` | Browser favicon. |

---

## Notes For Developers / 開発メモ / 開發備註

- Edit source modules under `js/` first.
- Regenerate `js/app.bundle.js` after JavaScript source changes so direct `index.html` opening keeps working.
- The bundle is intentionally committed because the project is designed to run without a build step.
- Uploaded image binary data should remain memory-only.
- Do not add persistence for uploaded image data unless the privacy model is explicitly changed.
