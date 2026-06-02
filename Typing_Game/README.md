<div align="center">

# ⌨️ Typing Master

**A polished, zero-install typing game — just open `index.html` and play.**

---

### 🌐 Language / 言語 / 語言

[**English**](#english) · [**日本語**](#japanese) · [**繁體中文**](#chinese)

</div>

---

<a id="english"></a>

<div align="center">

## 🇬🇧 English

[Features](#-features) · [How to Play](#-how-to-play) · [Game Modes](#-game-modes) · [Scoring](#-scoring-system) · [Shortcuts](#-keyboard-shortcuts) · [Settings](#️-settings) · [File Structure](#-file-structure) · [Browser Support](#-browser-support)

[→ 日本語](#japanese) · [→ 繁體中文](#chinese)

</div>

---

### ✨ Features

| Category | Details |
|---|---|
| **Zero Setup** | Open `index.html` directly — no build tools, no server required |
| **6 Languages** | English · Chinese · Numeric · Mixed · Katakana · Hiragana |
| **4 Difficulties** | Easy · Normal · Hard · Hell |
| **3 Durations** | 60s · 120s · Infinite |
| **6 Themes** | Default · Neon · Sakura · Ocean · Sunset · Mono |
| **Audio** | Synthesized SFX via Web Audio API + optional BGM tracks |
| **Save System** | Auto-saves every 5 seconds; resume from where you left off |
| **Statistics** | WPM · Accuracy · Combo · Score · Per-difficulty records |
| **Responsive** | Full desktop & mobile support with adaptive layout |
| **Accessibility** | ARIA labels · keyboard navigation · animation toggle |

---

### 🎮 How to Play

1. **Open** `index.html` in any modern browser.
2. On the **Menu**, click **Start Game**.
3. Choose your **Language**, **Difficulty**, and **Duration** in the modal.
4. A **3–2–1–GO!** countdown begins.
5. **Type the displayed word** exactly as shown, then press **Space** or just keep typing.
6. Correct characters appear **green**; wrong characters appear **red**.
7. Build combos for bonus score multipliers.
8. When the timer ends (or you stop in Infinite mode), your results appear.

> **Tip:** Press **ESC** to pause at any time. Your progress auto-saves.

---

### 🗂 Game Modes

#### Language

| Mode | Description |
|---|---|
| **English** | Common English vocabulary (~100 words) |
| **Chinese** | Chinese characters and words |
| **Numeric** | Number string practice |
| **Mixed** | Combination of English and Chinese |
| **Katakana** | Japanese Katakana characters (ア行〜ン) |
| **Hiragana** | Japanese Hiragana characters (あ行〜ん) |

#### Difficulty

| Level | Score Multiplier | Special Rules |
|---|---|---|
| **Easy** | ×0.8 | Lowercase only, no time penalty on error |
| **Normal** | ×1.0 | Standard gameplay |
| **Hard** | ×1.5 | Uppercase / punctuation mixed in every 5–8 words |
| **Hell** | ×2.5 | Reversed words · uppercase · punctuation · **−2 sec on every error** |

#### Duration

| Mode | Time |
|---|---|
| **60 seconds** | Quick sprint |
| **120 seconds** | Standard session |
| **Infinite** | No timer; stop manually |

---

### 📊 Scoring System

#### Formula

```
Base Score      = correct_chars × 10
Combo Bonus     = base_score × (current_combo ÷ 100 + 1)
Difficulty Mult = ×0.8 / ×1.0 / ×1.5 / ×2.5
Time Bonus      = remaining_seconds × 5  (timed modes only)

Final Score = (Base + Combo Bonus) × Difficulty Mult + Time Bonus
```

#### WPM & Accuracy

| Metric | Formula |
|---|---|
| **WPM** | (correct_chars ÷ 5) ÷ elapsed_seconds × 60 |
| **Accuracy** | correct_chars ÷ (correct_chars + wrong_chars) × 100% |

#### Rank Thresholds

| Rank | WPM | Accuracy |
|---|---|---|
| **S** | ≥ 100 | ≥ 97% |
| **A** | ≥ 80 | ≥ 94% |
| **B** | ≥ 60 | ≥ 90% |
| **C** | ≥ 40 | ≥ 84% |
| **D** | < 40 | < 84% |

#### Combo Milestones

| Combo | Reward |
|---|---|
| 10 | Toast notification + sound |
| 25 | Enhanced text color |
| 50 | Screen shake effect |
| 100 | Electric border effect |

---

### ⌨️ Keyboard Shortcuts

| Key | Action | Context |
|---|---|---|
| `ESC` | Pause / Resume | During game |
| `Tab` | Focus input field | During game |
| `Backspace` | Delete last character | During game |
| `Ctrl + R` | Restart game | During game |
| `F1` | Open tutorial | Anywhere |
| `M` | Toggle mute | Anywhere (outside input) |
| `Enter` | Confirm modal | Modal open |

---

### ⚙️ Settings

Settings are divided into **4 tabs**:

| Tab | Options |
|---|---|
| **Visual** | Theme (6) · Font Size · Animations · Virtual Keyboard |
| **Audio** | Master / BGM / SFX volume · SFX Skin (standard / mechanical / soft / 8-bit) · Persist BGM |
| **Game** | Default language · Difficulty · Duration · Live WPM · Error shake · Combo effects |
| **Data** | Export JSON · Import JSON · Clear records · Full reset |

---

### 📁 File Structure

```
Typing_Game/
├── index.html                  # Entry point — open this to play
├── assets/
│   ├── audio/
│   │   ├── bgm/                # Background music tracks
│   │   └── sfx/                # (Optional) audio file fallbacks
│   └── fonts/                  # Local .woff2 font backups
├── css/
│   ├── base/                   # Reset · Variables · Typography
│   ├── components/             # Buttons · Modals · Keyboard · Toast
│   ├── layout/                 # App layout · Responsive breakpoints
│   ├── screens/                # Per-screen styles
│   └── themes/                 # 6 theme files (CSS variable overrides)
├── js/
│   ├── core/                   # App · Router · EventBus · StateManager
│   ├── game/                   # GameEngine · WordGenerator · ScoreCalculator · ComboSystem · DifficultyManager
│   ├── screens/                # MenuScreen · GameScreen · ResultScreen · SettingsScreen · TutorialScreen
│   ├── audio/                  # AudioManager · BGMPlayer · SFXPool
│   ├── ui/                     # ThemeManager · KeyboardVisualizer · ModalManager · ToastManager
│   ├── data/                   # WordRepository (load & cache word lists)
│   └── utils/                  # Storage · Formatter · Timer · helpers
├── data/
│   ├── words-en.json           # English word list
│   ├── words-zh.json           # Chinese word list
│   ├── words-num.json          # Numeric string list
│   └── words-mixed.json        # Mixed word list
└── tools/
    └── build-classic-bundle.js # Bundles JSON into app.classic.js
```

---

### 🌐 Browser Support

| Browser | Min Version | Notes |
|---|---|---|
| Chrome / Edge | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Requires first user interaction for Web Audio |
| iOS Safari | 14.5+ | Software keyboard handled automatically |

---

<a id="japanese"></a>

<div align="center">

## 🇯🇵 日本語

[機能](#-機能) · [遊び方](#-遊び方) · [ゲームモード](#-ゲームモード) · [スコア](#-スコアシステム) · [ショートカット](#️-キーボードショートカット) · [設定](#️-設定) · [ファイル構造](#-ファイル構造) · [対応ブラウザ](#-対応ブラウザ)

[→ English](#english) · [→ 繁體中文](#chinese)

</div>

---

### ✨ 機能

| カテゴリ | 詳細 |
|---|---|
| **セットアップ不要** | `index.html` を開くだけ — ビルドツール・サーバー不要 |
| **6言語対応** | 英語 · 中国語 · 数字 · ミックス · カタカナ · ひらがな |
| **4段階の難易度** | Easy · Normal · Hard · Hell |
| **3種類の制限時間** | 60秒 · 120秒 · 無制限 |
| **6テーマ** | Default · Neon · Sakura · Ocean · Sunset · Mono |
| **オーディオ** | Web Audio API によるリアルタイム音声合成 + BGM |
| **セーブ機能** | 5秒ごとに自動保存。中断した場面から再開可能 |
| **統計情報** | WPM · 正確率 · コンボ · スコア · 難易度別記録 |
| **レスポンシブ** | デスクトップ・モバイル両対応 |
| **アクセシビリティ** | ARIAラベル · キーボードナビゲーション · アニメーション切替 |

---

### 🎮 遊び方

1. `index.html` をモダンブラウザで開く。
2. メニュー画面で **「ゲーム開始」** をクリック。
3. モーダルで **言語・難易度・時間** を選択。
4. **3–2–1–GO!** のカウントダウン後、ゲーム開始。
5. 表示された単語を **正確にタイプ**。正しい文字は**緑**、誤りは**赤**で表示。
6. ミスなく打ち続けると **コンボボーナス** が加算。
7. 制限時間終了または停止後、リザルト画面が表示。

> **Tip:** `ESC` キーでいつでも一時停止できます。進行状況は自動保存されます。

---

### 🗂 ゲームモード

#### 言語

| モード | 説明 |
|---|---|
| **English** | 英単語約100語 |
| **中文** | 中国語の文字・単語 |
| **数字** | 数字列の練習 |
| **ミックス** | 英語と中国語の組み合わせ |
| **カタカナ** | 日本語カタカナ（ア行〜ン） |
| **ひらがな** | 日本語ひらがな（あ行〜ん） |

#### 難易度

| レベル | スコア倍率 | 特殊ルール |
|---|---|---|
| **Easy** | ×0.8 | 小文字のみ、ミスによる時間ペナルティなし |
| **Normal** | ×1.0 | 標準ゲームプレイ |
| **Hard** | ×1.5 | 5〜8単語ごとに大文字・記号が混入 |
| **Hell** | ×2.5 | 逆順・大文字・記号混在、**ミスごとに−2秒** |

#### 制限時間

| モード | 時間 |
|---|---|
| **60秒** | スプリント |
| **120秒** | 標準セッション |
| **無制限** | タイマーなし、手動で終了 |

---

### 📊 スコアシステム

#### 計算式

```
基本スコア     = 正解文字数 × 10
コンボボーナス  = 基本スコア × (現在コンボ ÷ 100 + 1)
難易度倍率     = ×0.8 / ×1.0 / ×1.5 / ×2.5
時間ボーナス   = 残り秒数 × 5（時間制モードのみ）

最終スコア = (基本 + コンボボーナス) × 難易度倍率 + 時間ボーナス
```

#### WPM・正確率

| 指標 | 計算式 |
|---|---|
| **WPM** | (正解文字数 ÷ 5) ÷ 経過秒数 × 60 |
| **正確率** | 正解文字数 ÷ (正解 + ミス) × 100% |

#### ランク基準

| ランク | WPM | 正確率 |
|---|---|---|
| **S** | ≥ 100 | ≥ 97% |
| **A** | ≥ 80 | ≥ 94% |
| **B** | ≥ 60 | ≥ 90% |
| **C** | ≥ 40 | ≥ 84% |
| **D** | < 40 | < 84% |

#### コンボマイルストーン

| コンボ数 | 演出 |
|---|---|
| 10 | トースト通知 + 効果音 |
| 25 | テキストカラー強調 |
| 50 | 画面シェイク |
| 100 | 電気ボーダーエフェクト |

---

### ⌨️ キーボードショートカット

| キー | 操作 | タイミング |
|---|---|---|
| `ESC` | 一時停止 / 再開 | ゲーム中 |
| `Tab` | 入力フィールドにフォーカス | ゲーム中 |
| `Backspace` | 最後の文字を削除 | ゲーム中 |
| `Ctrl + R` | ゲームをリスタート | ゲーム中 |
| `F1` | チュートリアルを開く | どこでも |
| `M` | ミュート切替 | どこでも（入力外） |
| `Enter` | モーダルを確定 | モーダル表示中 |

---

### ⚙️ 設定

設定は **4つのタブ** に分かれています：

| タブ | 設定項目 |
|---|---|
| **ビジュアル** | テーマ (6種) · フォントサイズ · アニメーション · 仮想キーボード |
| **オーディオ** | マスター / BGM / SFX 音量 · SFXスキン (standard / mechanical / soft / 8-bit) · BGM持続 |
| **ゲーム** | デフォルト言語 · 難易度 · 時間 · リアルタイムWPM · エラー振動 · コンボ演出 |
| **データ** | JSONエクスポート · JSONインポート · 記録クリア · 全リセット |

---

### 📁 ファイル構造

```
Typing_Game/
├── index.html                  # エントリポイント（これを開いてプレイ）
├── assets/
│   ├── audio/
│   │   ├── bgm/                # BGMトラック
│   │   └── sfx/                # 音声ファイル（任意）
│   └── fonts/                  # ローカルフォント (.woff2)
├── css/
│   ├── base/                   # リセット・変数・タイポグラフィ
│   ├── components/             # ボタン・モーダル・キーボード・トースト
│   ├── layout/                 # アプリレイアウト・レスポンシブ
│   ├── screens/                # 画面ごとのスタイル
│   └── themes/                 # 6テーマ（CSS変数オーバーライド）
├── js/
│   ├── core/                   # App · Router · EventBus · StateManager
│   ├── game/                   # GameEngine · WordGenerator · ScoreCalculator · ComboSystem · DifficultyManager
│   ├── screens/                # Menu · Game · Result · Settings · Tutorial 各画面
│   ├── audio/                  # AudioManager · BGMPlayer · SFXPool
│   ├── ui/                     # ThemeManager · KeyboardVisualizer · ModalManager · ToastManager
│   ├── data/                   # WordRepository（単語リストのロード・キャッシュ）
│   └── utils/                  # Storage · Formatter · Timer · helpers
├── data/
│   ├── words-en.json           # 英語単語リスト
│   ├── words-zh.json           # 中国語単語リスト
│   ├── words-num.json          # 数字リスト
│   └── words-mixed.json        # ミックスリスト
└── tools/
    └── build-classic-bundle.js # JSONをapp.classic.jsにバンドルするツール
```

---

### 🌐 対応ブラウザ

| ブラウザ | 最低バージョン | 備考 |
|---|---|---|
| Chrome / Edge | 90以上 | フル対応 |
| Firefox | 88以上 | フル対応 |
| Safari | 14以上 | 初回インタラクションでWeb Audio起動 |
| iOS Safari | 14.5以上 | ソフトキーボード自動対応 |

---

<a id="chinese"></a>

<div align="center">

## 🇹🇼 繁體中文

[功能特色](#-功能特色) · [遊玩方式](#-遊玩方式) · [遊戲模式](#-遊戲模式) · [計分系統](#-計分系統) · [快捷鍵](#️-快捷鍵) · [設定說明](#️-設定說明) · [檔案結構](#-檔案結構) · [瀏覽器支援](#-瀏覽器支援)

[→ English](#english) · [→ 日本語](#japanese)

</div>

---

### ✨ 功能特色

| 類別 | 說明 |
|---|---|
| **免安裝** | 直接開啟 `index.html` 即可遊玩，無需建置工具或伺服器 |
| **6 種語言** | 英文 · 中文 · 數字 · 混合 · 片假名 · 平假名 |
| **4 段難度** | Easy · Normal · Hard · Hell |
| **3 種時長** | 60 秒 · 120 秒 · 無限模式 |
| **6 種主題** | Default · Neon · Sakura · Ocean · Sunset · Mono |
| **音效系統** | Web Audio API 即時合成音效 + BGM 背景音樂 |
| **儲存系統** | 每 5 秒自動存檔，支援中斷後繼續遊玩 |
| **統計資料** | WPM · 正確率 · 連擊數 · 分數 · 各難度最高紀錄 |
| **響應式設計** | 桌機與手機全面支援 |
| **無障礙設計** | ARIA 標籤 · 鍵盤導覽 · 動畫開關 |

---

### 🎮 遊玩方式

1. 用瀏覽器開啟 `index.html`。
2. 在主選單點擊 **「開始遊戲」**。
3. 在彈窗中選擇 **語言、難度、時長**。
4. 倒數 **3–2–1–GO!** 後遊戲開始。
5. **逐字輸入**畫面顯示的單詞。正確的字顯示**綠色**，錯誤的字顯示**紅色**。
6. 連續答對可累積**連擊數**，獲得額外分數加成。
7. 計時結束或手動停止後，顯示結果畫面。

> **小技巧：** 按 `ESC` 可隨時暫停，進度會自動儲存。

---

### 🗂 遊戲模式

#### 語言模式

| 模式 | 說明 |
|---|---|
| **英文** | 約 100 個常見英文單字 |
| **中文** | 中文字詞練習 |
| **數字** | 數字字串輸入練習 |
| **混合** | 英文與中文混合 |
| **片假名** | 日文片假名輸入練習（ア行〜ン） |
| **平假名** | 日文平假名輸入練習（あ行〜ん） |

#### 難度等級

| 等級 | 分數倍率 | 特殊規則 |
|---|---|---|
| **Easy** | ×0.8 | 僅小寫字母，打錯不扣時間 |
| **Normal** | ×1.0 | 標準遊玩體驗 |
| **Hard** | ×1.5 | 每 5–8 個字混入大寫或標點符號 |
| **Hell** | ×2.5 | 單字反轉、大寫、標點混雜，**每次打錯扣 2 秒** |

#### 時長模式

| 模式 | 時間 |
|---|---|
| **60 秒** | 快速衝刺 |
| **120 秒** | 標準局 |
| **無限** | 無計時器，手動結束 |

---

### 📊 計分系統

#### 計算公式

```
基礎分數   = 正確字元數 × 10
連擊加成   = 基礎分數 × (當前連擊 ÷ 100 + 1)
難度倍率   = ×0.8 / ×1.0 / ×1.5 / ×2.5
時間加成   = 剩餘秒數 × 5（限時模式才計算）

最終分數 = (基礎 + 連擊加成) × 難度倍率 + 時間加成
```

#### WPM 與正確率

| 指標 | 計算方式 |
|---|---|
| **WPM** | (正確字元數 ÷ 5) ÷ 經過秒數 × 60 |
| **正確率** | 正確字元數 ÷ (正確 + 錯誤) × 100% |

#### 段位判定

| 段位 | WPM | 正確率 |
|---|---|---|
| **S** | ≥ 100 | ≥ 97% |
| **A** | ≥ 80 | ≥ 94% |
| **B** | ≥ 60 | ≥ 90% |
| **C** | ≥ 40 | ≥ 84% |
| **D** | < 40 | < 84% |

#### 連擊里程碑

| 連擊數 | 效果演出 |
|---|---|
| 10 | 浮動提示 + 音效 |
| 25 | 文字顏色強化 |
| 50 | 畫面震動特效 |
| 100 | 電光邊框特效 |

---

### ⌨️ 快捷鍵

| 按鍵 | 操作 | 觸發時機 |
|---|---|---|
| `ESC` | 暫停 / 繼續 | 遊戲中 |
| `Tab` | 聚焦輸入框 | 遊戲中 |
| `Backspace` | 刪除最後一個字元 | 遊戲中 |
| `Ctrl + R` | 重新開始遊戲 | 遊戲中 |
| `F1` | 開啟教學說明 | 任何畫面 |
| `M` | 切換靜音 | 任何畫面（非輸入框） |
| `Enter` | 確認彈窗操作 | 彈窗開啟時 |

---

### ⚙️ 設定說明

設定分為 **4 個分頁**：

| 分頁 | 設定項目 |
|---|---|
| **視覺** | 主題 (6 種) · 字體大小 · 動畫效果 · 虛擬鍵盤顯示 |
| **音效** | 主音量 / BGM / SFX 音量 · 音效皮膚 (standard / mechanical / soft / 8-bit) · BGM 持續播放 |
| **遊戲** | 預設語言 · 難度 · 時長 · 即時 WPM 顯示 · 打錯震動 · 連擊演出 |
| **資料** | 匯出 JSON · 匯入 JSON · 清除紀錄 · 完整重置 |

---

### 📁 檔案結構

```
Typing_Game/
├── index.html                  # 入口點，開啟此檔案即可遊玩
├── assets/
│   ├── audio/
│   │   ├── bgm/                # 背景音樂曲目
│   │   └── sfx/                # 音效檔案（選用）
│   └── fonts/                  # 本地字型備份 (.woff2)
├── css/
│   ├── base/                   # 重置樣式 · CSS 變數 · 字型設定
│   ├── components/             # 按鈕 · 彈窗 · 鍵盤 · Toast 提示
│   ├── layout/                 # 整體版型 · 響應式斷點
│   ├── screens/                # 各畫面專屬樣式
│   └── themes/                 # 6 種主題（CSS 變數覆蓋）
├── js/
│   ├── core/                   # App · Router · EventBus · StateManager
│   ├── game/                   # GameEngine · WordGenerator · ScoreCalculator · ComboSystem · DifficultyManager
│   ├── screens/                # Menu · Game · Result · Settings · Tutorial 各畫面模組
│   ├── audio/                  # AudioManager · BGMPlayer · SFXPool
│   ├── ui/                     # ThemeManager · KeyboardVisualizer · ModalManager · ToastManager
│   ├── data/                   # WordRepository（單字清單載入與快取）
│   └── utils/                  # Storage · Formatter · Timer · helpers
├── data/
│   ├── words-en.json           # 英文單字清單
│   ├── words-zh.json           # 中文單字清單
│   ├── words-num.json          # 數字字串清單
│   └── words-mixed.json        # 混合單字清單
└── tools/
    └── build-classic-bundle.js # 將 JSON 打包進 app.classic.js 的工具
```

---

### 🌐 瀏覽器支援

| 瀏覽器 | 最低版本 | 備註 |
|---|---|---|
| Chrome / Edge | 90+ | 完整支援 |
| Firefox | 88+ | 完整支援 |
| Safari | 14+ | 首次互動後啟用 Web Audio |
| iOS Safari | 14.5+ | 自動處理軟體鍵盤 |

---

<div align="center">

*Built with pure HTML · CSS · JavaScript — no frameworks, no dependencies.*

</div>
