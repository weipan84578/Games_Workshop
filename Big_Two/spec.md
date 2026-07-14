# Web 版 Big Two（台灣大老二）產品與技術規格書

> 文件狀態：Implementation Ready  
> 規格版本：1.0.0  
> 目標平台：桌面與行動裝置現代瀏覽器  
> 執行形式：純前端、離線可用、直接開啟 `index.html`  
> 預設語言：繁體中文（`zh-Hant`）

---

## 1. 文件目的

本文件定義 Web 版《Big Two／台灣大老二》的產品行為、遊戲規則、資訊架構、視覺設計、RWD、AI、音訊、資料保存、無障礙、效能、安全性與測試標準。

實作者應可直接依本文件完成遊戲，不需要自行選擇核心規則或補充產品決策。若實作與本文件衝突，以本文件為準。

### 1.1 產品目標

- 提供一名真人玩家對戰三名 AI 的完整台灣大老二體驗。
- 不需安裝、建置或啟動伺服器；使用者直接點擊 `index.html` 即可遊玩。
- 在手機直向、手機橫向、平板與桌面瀏覽器上皆能順暢操作。
- 兼具擬真牌桌感與可愛、有趣、多彩的主題選擇。
- 所有必要程式、文字、圖示與音訊均可離線使用。
- 提供可直接點擊執行的瀏覽器單元測試頁。

### 1.2 本版範圍

包含：

- 單機玩家對三名 AI。
- 完整台灣常見大老二牌型與結算。
- 三種 AI 難度。
- 自動存檔與繼續遊戲。
- 繁體中文、英文、日文。
- 四套完整視覺主題。
- 多首鋼琴 BGM 與完整操作音效。
- 鍵盤、滑鼠、觸控操作。
- 離線瀏覽器測試工具。

不包含：

- 線上多人、帳號、雲端同步、排行榜伺服器。
- 下注、現金、虛擬貨幣或付費功能。
- PWA Service Worker、安裝式 App 或推播。
- 任何需要 npm、套件管理器、編譯器或後端的功能。

---

## 2. 技術與離線限制

### 2.1 強制執行條件

1. 遊戲必須能以 `file://` 直接開啟根目錄的 `index.html`。
2. 不得要求執行 `npm install`、`npm run build`、本機 server 或任何 CLI 指令。
3. 不得使用會因 `file://` CORS 限制而無法工作的 JavaScript ES modules、`fetch()` 載入本機 JSON、動態 import 或遠端 API。
4. 不得依賴 CDN、Google Fonts、遠端圖片、串流音樂或網路連線。
5. HTML 只負責畫面容器與依賴引入；樣式和邏輯必須依本文件分類。

### 2.2 JavaScript 載入策略

- 使用一般 `<script defer src="...">`，按依賴順序載入。
- 各檔案以 IIFE 包覆，公開內容掛在單一 `window.BigTwo` 命名空間。
- 不得在全域建立 `BigTwo` 以外的可寫入應用程式變數。
- 設定與語系檔使用 JavaScript 物件註冊，不使用執行期 `fetch()`。
- 規則與狀態函式應保持可單獨測試，不直接讀寫 DOM。

建議命名空間：

```text
window.BigTwo
├─ Config
├─ Utils
├─ I18n
├─ Storage
├─ Audio
├─ Rules
├─ AI
├─ Game
└─ UI
```

### 2.3 預定資料夾結構

```text
Big_Two/
├─ index.html
├─ spec.md
├─ css/
│  ├─ base/
│  │  ├─ reset.css
│  │  ├─ variables.css
│  │  ├─ typography.css
│  │  ├─ accessibility.css
│  │  └─ animations.css
│  ├─ components/
│  │  ├─ buttons.css
│  │  ├─ cards.css
│  │  ├─ controls.css
│  │  ├─ modal.css
│  │  ├─ slider.css
│  │  ├─ toast.css
│  │  └─ player-seat.css
│  ├─ screens/
│  │  ├─ home.css
│  │  ├─ game.css
│  │  ├─ help.css
│  │  ├─ settings.css
│  │  └─ results.css
│  ├─ themes/
│  │  ├─ realistic.css
│  │  ├─ midnight.css
│  │  ├─ sakura.css
│  │  └─ cute-party.css
│  └─ responsive/
│     ├─ desktop.css
│     ├─ tablet.css
│     ├─ mobile.css
│     └─ landscape.css
├─ js/
│  ├─ config/
│  │  ├─ constants.js
│  │  └─ themes.js
│  ├─ utils/
│  │  ├─ helpers.js
│  │  ├─ rng.js
│  │  └─ validation.js
│  ├─ i18n/
│  │  ├─ i18n.js
│  │  ├─ zh-Hant.js
│  │  ├─ en.js
│  │  └─ ja.js
│  ├─ storage/
│  │  ├─ storage.js
│  │  └─ save-schema.js
│  ├─ audio/
│  │  ├─ audio-manager.js
│  │  ├─ music-library.js
│  │  └─ sfx-library.js
│  ├─ core/
│  │  ├─ card.js
│  │  ├─ deck.js
│  │  ├─ hand-evaluator.js
│  │  ├─ hand-comparator.js
│  │  ├─ legal-moves.js
│  │  └─ scoring.js
│  ├─ ai/
│  │  ├─ ai-common.js
│  │  ├─ ai-easy.js
│  │  ├─ ai-normal.js
│  │  └─ ai-hard.js
│  ├─ game/
│  │  ├─ game-state.js
│  │  ├─ game-controller.js
│  │  ├─ turn-controller.js
│  │  └─ save-controller.js
│  ├─ ui/
│  │  ├─ router.js
│  │  ├─ card-renderer.js
│  │  ├─ table-renderer.js
│  │  ├─ animation-controller.js
│  │  ├─ dialog-controller.js
│  │  └─ toast-controller.js
│  ├─ screens/
│  │  ├─ home-screen.js
│  │  ├─ game-screen.js
│  │  ├─ help-screen.js
│  │  ├─ settings-screen.js
│  │  └─ results-screen.js
│  └─ app.js
├─ assets/
│  ├─ icons/
│  └─ decorations/
└─ tests/
   ├─ index.html
   ├─ css/test-runner.css
   ├─ framework/test-runner.js
   ├─ fixtures/
   └─ specs/
      ├─ deck.test.js
      ├─ rules.test.js
      ├─ comparator.test.js
      ├─ legal-moves.test.js
      ├─ scoring.test.js
      ├─ ai.test.js
      ├─ storage.test.js
      ├─ i18n.test.js
      └─ audio.test.js
```

不得在 `Big_Two` 內建立任何 `README.md`。

---

## 3. 遊戲規則

### 3.1 基本配置

- 使用一副標準 52 張撲克牌，不使用鬼牌。
- 固定四名玩家：一名真人、三名 AI。
- 每名玩家發 13 張牌，沒有底牌或未發出的牌。
- 座位順序固定為真人 → AI 1 → AI 2 → AI 3 → 真人。
- 發牌後，持有梅花 3 的玩家取得第一局第一墩的先手。
- 後續新局仍由持有梅花 3 的玩家先手，不受上一局勝負影響。

### 3.2 點數與花色

點數由小至大：

```text
3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2
```

花色由小至大：

```text
梅花 ♣ < 方塊 ♦ < 紅心 ♥ < 黑桃 ♠
```

內部數值固定如下：

```text
rank: 3=0, 4=1, ... A=11, 2=12
suit: clubs=0, diamonds=1, hearts=2, spades=3
```

每張牌的唯一比較鍵為 `rank * 4 + suit`。

### 3.3 可出的牌型

| 張數 | 牌型 | 定義 | 同型比較 |
| --- | --- | --- | --- |
| 1 | 單張 | 任一張牌 | 先比點數，再比花色 |
| 2 | 對子 | 兩張相同點數 | 先比點數，再比對子中的最大花色 |
| 3 | 三條 | 三張相同點數 | 比三條點數 |
| 5 | 順子 | 五張連續點數，不要求同花 | 比順子順位，再比代表牌花色 |
| 5 | 同花 | 五張同花色、非順子 | 先比花色，再依最高至最低點數逐張比較 |
| 5 | 葫蘆 | 一組三條加一組對子 | 比三條點數 |
| 5 | 鐵支 | 四張相同點數加任一單張 | 比四張點數 |
| 5 | 同花順 | 同時為同花與順子 | 比順子順位，再比花色 |

五張牌型強度由小至大：

```text
順子 < 同花 < 葫蘆 < 鐵支 < 同花順
```

- 五張牌可以用較高類型壓過較低類型。
- 單張、對子與三條只能由相同張數、相同牌型且更大的牌壓過。
- 不支援用鐵支或同花順跨張數炸單張、對子或三條。
- 同一副牌中若比較鍵完全相同，視為相同牌，不可能形成合法的兩手牌比較。

### 3.4 順子規則

只允許下列 10 種點數集合，順位由高至低：

```text
1.  2-3-4-5-6
2.  A-2-3-4-5
3.  10-J-Q-K-A
4.  9-10-J-Q-K
5.  8-9-10-J-Q
6.  7-8-9-10-J
7.  6-7-8-9-10
8.  5-6-7-8-9
9.  4-5-6-7-8
10. 3-4-5-6-7
```

順子的代表牌與花色決勝規則：

- `2-3-4-5-6` 以其中的 2 為代表牌。
- `A-2-3-4-5` 以其中的 2 為代表牌，但整體順位固定低於 `2-3-4-5-6`。
- 其他順子以自然序列最高點數為代表牌。
- 順子順位相同時，比代表牌的花色。
- 不允許 `J-Q-K-A-2`、`Q-K-A-2-3`、`K-A-2-3-4` 等其他環狀順子。

### 3.5 首手與回合

- 一局第一手必須由持有梅花 3 的玩家打出。
- 第一手可為任何合法牌型，但所選牌組必須包含梅花 3。
- 出牌成功後，輪到下一座位。
- 玩家可以壓過桌面牌或選擇 PASS；若沒有合法牌，PASS 為唯一操作。
- 先手狀態不得 PASS。
- 從最後一次成功出牌開始，其他三家皆連續 PASS 後，該墩結束。
- 最後成功出牌者成為新墩先手，可出任意合法牌型。
- 曾 PASS 的玩家在其他玩家成功出牌後，輪次再次回到自己時仍可重新出牌；PASS 不會永久退出該墩。
- 出牌或 PASS 後不得復原，以避免存檔與 AI 行動產生分歧。

### 3.6 合法性與錯誤提示

以下情況不得改變遊戲狀態：

- 未選任何牌卻按下出牌。
- 選擇 4 張、超過 5 張或其他不支援張數。
- 所選牌不構成合法牌型。
- 牌型張數與桌面牌不同。
- 相同張數但無法壓過桌面牌。
- 第一手沒有包含梅花 3。
- 非目前玩家嘗試操作。
- 動畫或 AI 回合期間重複操作。

錯誤應以短促音效、按鈕或選牌區輕微震動，以及可翻譯的 toast 說明呈現。不得只以顏色表示錯誤。

### 3.7 局末與積分

任一玩家出完最後一張牌後立即結束該局，不再讓其餘玩家行動。

失敗玩家依剩牌數扣分：

| 剩牌數 | 每張倍率 | 扣分公式 |
| --- | ---: | ---: |
| 1–7 | 1 | 剩牌數 × 1 |
| 8–10 | 2 | 剩牌數 × 2 |
| 11–12 | 3 | 剩牌數 × 3 |
| 13 | 4 | 13 × 4 = 52 |

- 勝者獲得另外三人的扣分總和。
- 四人的單局分數總和必須為 0。
- 累積分數可以為負數，沒有淘汰或最低下限。
- 結果頁顯示名次、剩牌、單局增減、累積分數、玩家勝負及連勝變化。
- 選擇「再來一局」後重新洗牌與發牌，保留累積分數和設定。
- 選擇「返回主畫面」時保留已完成戰績，但不建立可繼續的已結束快照。

---

## 4. AI 規格

### 4.1 共通要求

- AI 只能根據公開資訊、自身手牌、已出牌紀錄與規則決策。
- AI 不得讀取真人或其他 AI 的手牌。
- AI 必須只回傳由 `getLegalMoves()` 產生的合法行動，或合法 PASS。
- AI 決策函式不得直接操作 DOM、播放音效或寫入儲存空間。
- 相同牌局、相同難度、相同 RNG 狀態必須得到可重現的結果。
- AI 思考在主流中階手機上應於 200 ms 內完成；畫面可額外等待 350–700 ms 模擬自然節奏。
- 等待動畫期間仍要保持畫面可重新繪製，但必須鎖定真人操作。

### 4.2 簡單 AI

- 從合法行動中以加權亂數選擇。
- 較常使用能壓過的最小牌，但允許偶爾拆對或出較大的牌。
- 先手時偏好單張或對子，不主動規劃長期牌組。
- 不計算對手可能剩牌或已出關鍵牌。

### 4.3 普通 AI

- 以最少破壞既有組合為主要評分。
- 先出低牌、保留 2、高對、鐵支與同花順作為後段控制牌。
- 對手剩 1–2 張時提高攔截權重。
- 比較出牌後剩餘手牌可拆成的最少手數。
- 在能讓牌權回到自己且代價合理時主動壓牌。

### 4.4 困難 AI

- 枚舉合法行動並對每個候選行動進行啟發式搜尋。
- 評估項至少包含：剩餘最少手數、孤張數、高牌控制力、牌型破壞成本、對手剩牌、已出牌記憶、取得下一墩先手的機率。
- 對即將出完牌的對手優先阻擋，必要時拆分高價組合。
- 可從公開出牌推估尚未出現的控制牌，但不得取得隱藏牌資訊。
- 多個候選分數相同時使用注入式 RNG 選擇，避免每局完全相同。
- 搜尋必須設節點或時間上限；超過上限時回退至普通 AI 評分，不可阻塞 UI。

---

## 5. 畫面與導覽

### 5.1 畫面清單

應用程式採單頁多畫面切換，不更換 HTML 文件：

```text
啟動
└─ 主畫面
   ├─ 開始遊戲 → 遊戲畫面 → 結果畫面 → 再來一局／主畫面
   ├─ 繼續遊戲 → 遊戲畫面
   ├─ 說明 → 說明畫面 → 主畫面
   └─ 設定 → 設定畫面 → 主畫面
```

- 畫面切換不得重新載入頁面。
- 瀏覽器返回鍵不列為必要導覽機制；所有次級畫面需有明確返回按鈕。
- 開啟對話框時，焦點限制於對話框內；關閉後回到觸發按鈕。

### 5.2 主畫面

主畫面必須保持簡潔，只能顯示：

- 遊戲名稱與簡短副標題。
- 「開始遊戲」。
- 「繼續遊戲」。
- 「說明」。
- 「設定」。
- 純裝飾性的主題圖案與版本文字。

主畫面不得直接放置音量、語言、主題、AI 難度、滑桿或其他設定元件。

「繼續遊戲」狀態：

- 存在有效且未結束的快照：可操作，顯示最近儲存時間與目前局數。
- 沒有快照：保持可見但停用，輔助文字說明尚無可繼續牌局。
- 快照損毀：清除損毀資料、停用按鈕，顯示一次非阻斷通知。

### 5.3 遊戲畫面

桌面版配置：

- 真人位於下方。
- AI 1 位於左側、AI 2 位於上方、AI 3 位於右側。
- 桌面中央顯示上一手牌、出牌者、牌型、目前墩狀態。
- 上方狀態列顯示局數、累積分數、目前難度、音訊快捷鍵與返回主畫面。
- 下方玩家區顯示 13 張內手牌、牌數、目前選牌摘要與操作列。

真人操作列固定包含：

- 出牌。
- PASS。
- 提示。
- 取消選牌。
- 排序方式切換：依點數／依花色。

操作規則：

- 點擊或觸控牌張切換選取；選中牌向上位移並有描邊、陰影和 `aria-pressed`。
- 再次點擊已選牌可取消。
- 「出牌」只在所選牌為合法行動時啟用。
- 「PASS」在先手時停用。
- 「提示」選取 AI 普通難度評分最高的合法最小成本行動；無合法牌時聚焦 PASS。
- 排序只改變視覺順序，不改變牌物件或 RNG 狀態。
- 返回主畫面前顯示確認對話框；確認後保留快照，取消則留在牌局。

### 5.4 結果畫面

- 顯示冠軍角色與勝負動畫。
- 顯示四名玩家的排名、剩牌數、單局分數和累積分數。
- 真人獲勝時播放勝利音效；其他玩家獲勝時播放柔和失敗音效。
- 提供「再來一局」與「返回主畫面」。
- 不顯示付費、分享、廣告或線上排行榜入口。

### 5.5 說明畫面

說明內容必須完整且易於掃讀，使用本機 SVG 圖示、牌張示例、步驟卡片和表格。至少包含：

1. 遊戲目標。
2. 牌點與花色順位。
3. 梅花 3 首出規則。
4. 單張、對子、三條示例。
5. 五種五張牌型及強弱順序。
6. 所有合法順子與特殊順位。
7. 出牌、選牌、PASS、提示、排序操作。
8. 新墩與三家 PASS 規則。
9. 單局計分表。
10. 三種 AI 難度差異。
11. 自動存檔與繼續遊戲。
12. 主題、語言、音樂與音效設定。
13. 鍵盤操作方式。

- 每章使用明確標題和不同圖示。
- 長篇細節可用 `<details>` 收合，但核心規則預設展開。
- 圖示需有文字標籤；純裝飾圖示使用 `aria-hidden="true"`。

### 5.6 設定畫面

設定以簡潔卡片分組，不放入主畫面。包含：

| 分組 | 設定 | 選項／範圍 | 預設值 |
| --- | --- | --- | --- |
| 遊戲 | AI 難度 | 簡單、普通、困難 | 普通 |
| 顯示 | 主題 | 擬真綠桌、午夜霓虹、櫻花粉彩、可愛動物派對 | 擬真綠桌 |
| 顯示 | 語言 | 繁體中文、English、日本語 | 自動判斷 |
| 顯示 | 動畫 | 開／關 | 開 |
| 音訊 | BGM | 開／關 | 開 |
| 音訊 | BGM 音量 | 0–100，步進 5 | 40 |
| 音訊 | 音效 | 開／關 | 開 |
| 音訊 | 音效音量 | 0–100，步進 5 | 70 |
| 音訊 | BGM 曲目 | 自動輪播或指定 1–4 | 自動輪播 |
| 資料 | 重設戰績與存檔 | 二次確認 | 不適用 |

- 所有調整即時預覽並立即保存。
- 離開設定不需要額外「儲存」按鈕，但需顯示短暫的已儲存狀態。
- 重設資料必須使用確認對話框，明確列出會刪除牌局、分數和偏好。
- 滑桿需同時顯示數值，並可用鍵盤方向鍵調整。

---

## 6. 視覺設計與主題

### 6.1 共通原則

- 視覺應豐富、有趣，但控制元件與牌面永遠是最高資訊層級。
- 正文不得小於 18px；按鈕文字不得小於 20px；重要狀態不得小於 24px。
- 標題使用 `clamp()`，主標題約 36–64px。
- 使用系統字型堆疊，避免任何網路字型：

```css
font-family: "Noto Sans TC", "Noto Sans JP", "Microsoft JhengHei",
  "Yu Gothic", "Segoe UI", Arial, sans-serif;
```

- 所有正文和重要圖示須達 WCAG 2.1 AA 對比；一般文字至少 4.5:1，大字至少 3:1。
- 紅色與黑色牌面除了顏色也必須保留花色符號，避免只靠色彩辨識。
- 按鈕狀態需有正常、hover、active、focus-visible、disabled。

### 6.2 主題 token

所有主題應提供相同的 CSS custom properties：

```text
--color-bg
--color-surface
--color-table
--color-table-edge
--color-text
--color-text-muted
--color-primary
--color-primary-text
--color-secondary
--color-accent
--color-danger
--color-success
--color-focus
--card-front
--card-back
--shadow-soft
--shadow-strong
--texture-opacity
```

禁止元件使用未經 token 管理、可能造成某些主題看不見文字的硬編碼前景／背景組合。

### 6.3 四套完整主題

#### 擬真綠桌

- 深綠絨布桌面、深木桌框、暖色環境光、細緻陰影。
- 牌張使用象牙白紙面、微紋理、圓角與厚度陰影。
- AI 頭像採寫實感較低的友善角色插畫，維持遊戲親和力。

#### 午夜霓虹

- 深藍黑背景，青色、紫色、桃紅色點綴。
- 保留低亮度光暈，不得讓小字或牌面被光暈吞沒。
- 紅黑花色在深色背景仍使用淺色牌面呈現。

#### 櫻花粉彩

- 櫻花粉、天空藍、奶油白和柔紫色。
- 裝飾使用花瓣與柔和紙張質感。
- 粉色背景上的文字使用深酒紅或深藍，禁止低對比淡粉字。

#### 可愛動物派對

- 使用貓、兔、熊、小雞角色，以及星星、愛心、雲朵、糖果、彩帶與紙屑圖案。
- AI 座位各有不同動物角色和表情狀態。
- 牌背、按鈕、對話框與結果動畫均套用一致的圓潤可愛語彙。
- 大量裝飾只能放在空白區、桌框或背景；不得覆蓋牌、提示、文字或按鈕。
- 裝飾節點使用 `pointer-events: none` 並標記為純裝飾。

### 6.4 圖示

- 使用專案內本機 SVG 或 CSS 圖形，不使用 emoji 作為唯一功能圖示。
- 圖示風格為圓角、粗線條、可愛但清楚。
- 所有功能圖示需搭配可見文字；窄螢幕也不得只剩難以理解的圖示。
- SVG 不得內嵌外部字型或遠端資源。

---

## 7. RWD 與操作區安全

### 7.1 版面範圍

最低支援 CSS viewport 寬度為 320px，最高不設上限；內容最大寬度可限制在 1600px 並置中。

建議斷點：

| 類型 | 寬度 | 主要策略 |
| --- | --- | --- |
| 小型手機 | 320–479px | 精簡 AI 座位、手牌橫向展開、底部操作列 |
| 大型手機 | 480–767px | 增加牌面與中央出牌區空間 |
| 平板 | 768–1023px | 四座位完整呈現、操作區保持下方 |
| 桌面 | 1024px 以上 | 擬真桌面、完整座位與狀態列 |

實作不得只依賴裝置名稱；最終排版應由可用寬高和方向共同決定。

### 7.2 行動裝置配置

- 頁面主容器使用 `min-height: 100dvh`，並提供 `100vh` 回退。
- 所有邊緣內容納入 `env(safe-area-inset-*)`。
- 操作列可固定於底部，但遊戲桌必須保留：

```text
padding-bottom = 操作列實際高度 + safe-area-inset-bottom + 間距
```

- 不可讓操作列以 overlay 方式遮住玩家手牌、最後出牌或中央提示。
- 操作列高度改變時應以 CSS 版面流或 `ResizeObserver` 同步保留空間。
- 真人手牌區允許橫向捲動、扇形重疊或兩者混用；任何時候都必須能點到每一張牌。
- 手機直向時，左右 AI 改為上半部左右兩張精簡座位卡，上方 AI 居中；不在左右邊緣放垂直按鈕。
- 手機橫向時縮短狀態列與操作列高度，優先保留中央牌桌和玩家手牌。
- 不強制禁止縮放；使用者放大文字或頁面時仍應能完成遊戲。

### 7.3 觸控與手勢

- 所有互動目標至少 48×48 CSS px，目標間距至少 8px。
- 不使用 hover 才能發現的必要功能。
- 不以滑動作為唯一操作；選牌一定可透過點擊完成。
- 手機應設定合理的 `touch-action`，避免點按按鈕時觸發頁面誤縮放或橫向拖曳。
- 不全域禁止瀏覽器縮放或使用 `user-scalable=no`。

### 7.4 不遮擋驗收

在 320×568、360×800、390×844、412×915、844×390、768×1024、1024×768、1440×900 下：

- 玩家手牌至少有一部分始終完整可見並可操作。
- 中央最後出牌不得被操作列遮住。
- 出牌與 PASS 按鈕始終可見。
- 對話框內容可捲動，確認與取消按鈕可到達。
- 瀏覽器 UI 高度改變或虛擬鍵盤關閉後，不留下永久錯位。

---

## 8. 動畫與回饋

- 發牌：牌由牌堆依序飛向四個座位，總長不超過 1.8 秒，可跳過。
- 選牌：使用 `transform: translateY()`，100–160 ms。
- 出牌：選中牌移至中央，180–280 ms。
- PASS：座位顯示短暫文字與淡出圖示，400–700 ms。
- 輪到玩家：座位外框、箭頭和文字共同提示，不只使用發光顏色。
- 新墩：中央舊牌淡出，先手座位突出，總長不超過 450 ms。
- 結果：勝利使用紙屑與角色動作，失敗保持輕鬆，不使用強烈閃爍。
- 動畫只優先修改 `transform` 和 `opacity`，避免頻繁 layout thrashing。
- 使用者關閉動畫或系統為 `prefers-reduced-motion: reduce` 時，所有必要狀態切換縮短至 0–80 ms，移除飛行、震動和紙屑。
- 遊戲狀態不得依賴 `animationend` 才能保持正確；動畫取消時仍須完成狀態轉換。

---

## 9. 多國語系

### 9.1 支援語系

| 語系 | 代碼 | 顯示名稱 |
| --- | --- | --- |
| 繁體中文 | `zh-Hant` | 繁體中文 |
| 英文 | `en` | English |
| 日文 | `ja` | 日本語 |

首次啟動規則：

1. 若已有保存語言，使用保存值。
2. `navigator.languages` 中以 `zh-TW`、`zh-HK`、`zh-Hant` 開頭者使用繁體中文。
3. 以 `ja` 開頭者使用日文。
4. 以 `en` 開頭者使用英文。
5. 其他情況使用繁體中文。

### 9.2 翻譯範圍

以下內容不得硬編碼於 UI 邏輯：

- 畫面標題、按鈕、設定標籤。
- 遊戲狀態、牌型名稱、錯誤訊息、toast。
- AI 名稱與難度說明。
- 結果與積分文字。
- 完整說明頁。
- ARIA label、螢幕閱讀器狀態、對話框文字。
- 日期與數值格式。

### 9.3 語系完整性

- 三個語系必須具有完全相同的 key 集合。
- 缺少 key 時先回退繁體中文，再回退 key 本身；不得造成 JavaScript 錯誤。
- 切換語言時立即更新目前畫面、`document.documentElement.lang`、頁面標題和 aria 文字，不需重新整理。
- 翻譯可比中文長 50%；按鈕不可因此截字或溢出。

---

## 10. 音訊

### 10.1 啟動與降級

- 使用單一 AudioContext，由 `AudioManager` 管理。
- 頁面載入時不得強制播放；第一次有效點擊或鍵盤操作後呼叫 `resume()`。
- 若瀏覽器拒絕或不支援 Web Audio API，遊戲仍可完整進行，音訊控制顯示不可用狀態。
- 分頁進入背景時暫停排程；回到前景時平滑恢復，不得重複疊加曲目。

### 10.2 BGM

- 至少提供四首不同、輕快、明亮的原創音符序列。
- 使用 Web Audio API oscillator、envelope、filter 與簡單殘響模擬鋼琴，不載入音訊檔。
- 每首約 45–90 秒可無縫循環，速度約 96–132 BPM。
- 自動模式每局或每次曲目結束後輪替，避免連續重複同一首。
- 曲目切換使用 400–1000 ms crossfade，禁止突波或爆音。

BGM 訊號鏈固定為：

```text
music source
→ music volume gain (0.0–1.0)
→ boost gain (固定 10.0)
→ dynamics compressor
→ safety limiter / master gain
→ destination
```

- 「放大 10 倍」定義為 `boostGain.gain.value = 10.0`。
- 壓縮器與安全 limiter 必須防止削波、突波與刺耳失真。
- 實際輸出峰值不得高於 0 dBFS；建議 master ceiling 約 -1 dB。
- 音量調整需使用短 ramp，避免 zipper noise。
- 設定顯示 0–100%，不將 10 倍內部增益暴露為 0–1000%。
- 首次啟用或大幅提高音量時顯示一次「請留意裝置音量」提示。

### 10.3 音效

音效以短、高音、輕脆、非刺耳為原則，至少包含：

| 事件 | 聲音方向 |
| --- | --- |
| 選牌 | 短促木片／水滴高音 |
| 取消選牌 | 較低且短的反向音 |
| 合法出牌 | 兩至三音上行清脆聲 |
| 非法操作 | 柔和短促雙音，不使用警報 |
| PASS | 輕盈滑音 |
| 輪到真人 | 明亮提示音 |
| 新墩 | 短和弦 |
| 勝利 | 明亮鋼琴琶音 |
| 失敗 | 柔和下降三音 |
| 按鈕 | 細小 click |

- 同一音效在極短時間連續觸發時須限制併發，避免音量堆疊。
- BGM 和音效使用不同 gain，可分別靜音。

---

## 11. 資料模型與公開介面

以下為規格型別；實作可使用 JSDoc 表達，不需要 TypeScript 或編譯。

### 11.1 核心型別

```js
/** @typedef {'clubs'|'diamonds'|'hearts'|'spades'} Suit */
/** @typedef {'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A'|'2'} Rank */

/**
 * @typedef {Object} Card
 * @property {string} id       // 例如 "2-spades"，全牌組唯一
 * @property {Rank} rank
 * @property {Suit} suit
 */

/**
 * @typedef {'single'|'pair'|'triple'|'straight'|'flush'|'fullHouse'|'fourOfAKind'|'straightFlush'} HandType
 */

/**
 * @typedef {Object} HandEvaluation
 * @property {boolean} valid
 * @property {HandType|null} type
 * @property {number} cardCount
 * @property {number[]} tieBreakers
 * @property {string|null} reason
 */

/**
 * @typedef {Object} PlayerState
 * @property {string} id
 * @property {'human'|'ai'} kind
 * @property {number} seat
 * @property {Card[]} hand
 * @property {number} score
 * @property {boolean} passedLastAction
 */

/**
 * @typedef {Object} GameState
 * @property {1} schemaVersion
 * @property {'dealing'|'playing'|'resolving'|'finished'} phase
 * @property {PlayerState[]} players
 * @property {number} currentPlayerIndex
 * @property {string|null} trickLeaderId
 * @property {Card[]} lastPlayedCards
 * @property {HandEvaluation|null} lastHand
 * @property {string|null} lastPlayedBy
 * @property {number} consecutivePasses
 * @property {boolean} openingMoveRequired
 * @property {number} roundNumber
 * @property {string} rngState
 * @property {Array<Object>} actionHistory
 */
```

### 11.2 設定型別

```js
/**
 * @typedef {Object} Settings
 * @property {'easy'|'normal'|'hard'} difficulty
 * @property {'realistic'|'midnight'|'sakura'|'cuteParty'} theme
 * @property {'zh-Hant'|'en'|'ja'} locale
 * @property {boolean} animationsEnabled
 * @property {boolean} musicEnabled
 * @property {number} musicVolume // 0–100
 * @property {boolean} sfxEnabled
 * @property {number} sfxVolume   // 0–100
 * @property {'auto'|'track1'|'track2'|'track3'|'track4'} musicTrack
 */
```

### 11.3 必要純函式

```js
BigTwo.Rules.classifyHand(cards) -> HandEvaluation
BigTwo.Rules.compareHands(candidateCards, tableCards) -> -1 | 0 | 1
BigTwo.Rules.canBeat(candidateCards, tableCards) -> boolean
BigTwo.Rules.getLegalMoves(hand, tableCards, context) -> Card[][]
BigTwo.Rules.isOpeningMove(cards, context) -> boolean
BigTwo.Rules.scoreRound(players, winnerId) -> RoundResult
BigTwo.Game.createNewGame(options) -> GameState
BigTwo.Game.applyAction(state, action) -> GameState
BigTwo.AI.chooseAction(state, playerId, difficulty, rng) -> Action
```

要求：

- 輸入不得被原地修改。
- 相同輸入必須得到相同輸出，AI 函式除外但其隨機性只能來自傳入的 RNG。
- 非法輸入回傳明確結果或拋出已定義錯誤，不可產生半完成狀態。
- `applyAction()` 是遊戲狀態改變的唯一入口。

### 11.4 動作型別

```js
{ type: 'PLAY_CARDS', playerId, cardIds }
{ type: 'PASS', playerId }
{ type: 'START_NEXT_ROUND' }
```

UI 的選牌、排序、開關對話框不屬於遊戲動作，不寫入 action history。

---

## 12. 儲存與繼續遊戲

### 12.1 localStorage keys

```text
bigTwo.settings.v1
bigTwo.activeGame.v1
bigTwo.statistics.v1
bigTwo.audioNoticeSeen.v1
```

不得使用通用名稱如 `settings` 或 `gameState`，避免和同網域其他遊戲衝突。

### 12.2 SaveSnapshotV1

```js
/**
 * @typedef {Object} SaveSnapshotV1
 * @property {1} schemaVersion
 * @property {string} savedAt        // ISO 8601
 * @property {string} appVersion
 * @property {GameState} gameState
 * @property {string} checksum       // 非安全用途的完整性檢查
 */
```

### 12.3 保存時機

- 新局完成發牌後。
- 每次合法出牌或 PASS 完成後。
- AI 動作完成後。
- 返回主畫面前。
- 頁面進入 `visibilitychange: hidden` 時，若狀態穩定則再保存一次。

不得保存動畫中間狀態或只完成一半的狀態轉換。

### 12.4 載入與復原

載入時依序檢查：

1. JSON 可解析。
2. schemaVersion 受支援。
3. 必填欄位存在且型別正確。
4. 恰有四名玩家、52 張牌無重複且都存在於各手牌或已出牌紀錄。
5. currentPlayerIndex、牌數、最後牌型和 phase 合法。
6. checksum 相符。

任一檢查失敗：

- 不嘗試載入部分資料。
- 刪除 active game key。
- 保留可獨立解析的設定和統計。
- 主畫面顯示一次「存檔無法讀取，已安全清除」通知。

若瀏覽器停用 localStorage：

- 遊戲仍可進行。
- 「繼續遊戲」停用。
- 顯示不持續打擾的單次提示。
- 不得因 `SecurityError` 或 quota error 中斷遊戲。

### 12.5 統計

至少保存：

```text
gamesPlayed
gamesWon
gamesLost
currentWinStreak
bestWinStreak
totalScore
winsByDifficulty.easy
winsByDifficulty.normal
winsByDifficulty.hard
```

---

## 13. 無障礙與鍵盤

- 使用語意化 `button`、`main`、`nav`、`section`、`dialog` 或等效 ARIA。
- 不以不可聚焦的 `div` 取代按鈕。
- 所有可操作元素提供清楚的 `:focus-visible`，焦點對比至少 3:1。
- 遊戲狀態提示使用節制的 `aria-live="polite"`；錯誤可使用 `assertive`，但不得連續轟炸。
- 牌張按鈕的 accessible name 應包含點數、花色與選取狀態。
- AI 手牌只讀出角色名與剩牌數，不逐張宣告牌背。
- 選中的多張牌需提供摘要，例如「已選 2 張：紅心 8、黑桃 8，牌型：對子」。
- 所有功能皆可使用鍵盤完成。

預設鍵盤操作：

| 按鍵 | 行為 |
| --- | --- |
| Tab / Shift+Tab | 在可操作元件間移動 |
| 左／右方向鍵 | 在玩家手牌間移動焦點 |
| Space / Enter | 選取或取消目前牌張、啟動按鈕 |
| P | PASS（可用時） |
| H | 提示 |
| Escape | 關閉目前對話框或取消全部選牌 |

- 快捷鍵在文字輸入、select 或 slider 聚焦時不得攔截。
- 不得出現每秒三次以上的閃爍內容。
- 200% 瀏覽器縮放下不得遺失功能或形成不可到達內容。

---

## 14. 效能、穩定性與安全

### 14.1 效能目標

在一般近五年中階手機上：

- 初次開啟到主畫面可操作：1.5 秒內，不含瀏覽器自身啟動時間。
- 真人點擊出牌到狀態更新：100 ms 內。
- 規則判定：一般個案 10 ms 內。
- 困難 AI：目標 200 ms 內，硬上限 500 ms 後回退。
- 動畫目標 60 FPS，常態不得低於 30 FPS。
- 不產生持續增加的 DOM 節點、timer、AudioNode 或 event listener。

### 14.2 穩定性

- 快速連點不得造成重複出牌或跨越玩家回合。
- 頁面失焦、恢復、旋轉裝置或調整尺寸不得改變遊戲邏輯。
- AudioContext 關閉或暫停不得影響遊戲狀態。
- 動畫被取消時必須回到最終視覺狀態。
- 所有 timeout 與 animation frame 在離開畫面或開始新局時清理。

### 14.3 安全與隱私

- 不收集、傳送或追蹤任何個人資料。
- 不使用第三方分析、cookie、指紋或廣告。
- 顯示文字使用 `textContent`；翻譯與存檔內容不得未經處理寫入 `innerHTML`。
- localStorage 僅保存本機遊戲資料，不視為可信輸入，載入時必須驗證。

### 14.4 支援瀏覽器

支援下列瀏覽器最近兩個主要版本：

- Chrome／Android Chrome。
- Edge。
- Firefox。
- Safari／iOS Safari。

若少數視覺 API 不支援，應優雅降級；核心規則、選牌、出牌、AI 和存檔不可依賴實驗性 API。

---

## 15. 單元測試與驗收

### 15.1 測試執行方式

- 提供 `tests/index.html`。
- 直接以 `file://` 點擊開啟即可執行全部測試。
- 不使用 Jest、Vitest、Mocha CDN、Node.js 或任何安裝步驟。
- 自製輕量測試框架至少支援：`describe`、`it`、`beforeEach`、同步與 Promise 測試、`assertEqual`、`assertDeepEqual`、`assertTrue`、`assertThrows`。
- 頁面顯示總數、通過、失敗、略過、總耗時、單一錯誤堆疊與重新執行按鈕。
- 一項測試失敗不得阻止其他測試繼續執行。

### 15.2 牌組與發牌測試

- 牌組恰有 52 張且 id 唯一。
- 13 個點數各 4 個花色。
- 相同 seed 洗牌順序相同，不同 seed 可產生不同順序。
- 四人各 13 張且沒有重複或遺漏。
- 持有梅花 3 者正確成為首位玩家。

### 15.3 牌型測試

- 每一種合法牌型至少有普通、最小、最大案例。
- 0、4、6 張以上與無效 2／3／5 張組合判定非法。
- 順子完整測試 10 個合法集合與所有不合法跨界集合。
- 同花順優先判為同花順而非同花或順子。
- 葫蘆與鐵支的主要比較點數正確。
- 輸入牌陣列順序不同不影響判定。
- 判定函式不修改輸入。

### 15.4 比牌與合法行動測試

- 單張和對子的點數、花色決勝正確。
- 三條只比較點數。
- 五張牌型可以跨類型壓牌且強度順序正確。
- 同花先比花色，再比較牌點序列。
- `23456 > A2345 > TJQKA > ... > 34567`。
- 順子代表牌花色可正確決勝。
- 不同張數不能互壓。
- 首手必須包含梅花 3。
- 先手不能 PASS。
- `getLegalMoves()` 不遺漏已知合法組合、不回傳重複牌組，也不回傳非法牌組。

### 15.5 回合與結算測試

- 成功出牌後正確輪到下一座位。
- 非法動作不改變 state 或 action history。
- 三次連續 PASS 後清空桌面限制並由最後出牌者先手。
- 中間有人成功出牌會把 consecutivePasses 歸零。
- 任一玩家手牌歸零立即結束。
- 1、7、8、10、11、12、13 張邊界分數正確。
- 勝者所得等於三名敗者扣分總和，總和為 0。

### 15.6 AI 測試

- 三種難度在各種桌面狀態只回傳合法行動。
- 沒有合法牌時回傳 PASS。
- 先手時不回傳 PASS。
- 相同 seed 和 state 可重現結果。
- AI 不修改傳入 state 或 hand。
- AI 不存取其他玩家手牌；測試使用隱藏牌代理物件偵測未授權讀取。
- 普通 AI 在基本案例優先保留強牌與完整牌型。
- 困難 AI 在對手剩一張時會於已定義案例選擇可攔截行動。
- 搜尋超時時可安全回退，不拋出未處理例外。

### 15.7 儲存測試

- 完整牌局序列化後可還原為等價狀態。
- 設定、統計與牌局使用不同 key。
- JSON 損毀、版本錯誤、重複牌、缺少玩家、錯誤 index 均被拒絕。
- storage 丟出 SecurityError 或 quota error 時遊戲不崩潰。
- 已結束牌局不會讓主畫面的「繼續遊戲」啟用。
- 每次合法動作完成後觸發一次穩定快照。

### 15.8 i18n 測試

- 三語系 key 集合完全一致。
- 缺漏 key 依規則回退。
- 切換語言同步更新 `lang` 與目前畫面。
- 插值會轉義不可信文字。
- 英文與日文長文字不造成關鍵按鈕無法操作。

### 15.9 音訊測試

以假的 AudioContext／AudioNode 測試：

- 沒有使用者互動前不啟動播放。
- BGM boost gain 固定為 10.0。
- boost 後連接 compressor 與安全 master 節點。
- 音量 0、40、100 的 gain 換算正確。
- 靜音不改寫使用者原音量值。
- 曲目自動輪替不連續重複。
- 快速音效有併發限制。
- AudioContext 失敗時安靜降級。

### 15.10 人工 UI 驗收

自動單元測試之外，發佈前必須逐項人工驗收：

- 直接雙擊 `index.html` 可進入遊戲，開發者工具沒有阻斷錯誤或必要網路請求。
- 四個主畫面按鈕功能正確，主畫面沒有設定控制項。
- 四套主題的所有文字、牌張、按鈕均清晰可見。
- 三種語言所有畫面均無截斷、漏翻或未替換 key。
- 320×568 至 1440×900 的指定尺寸均無操作列遮擋。
- iPhone／Android safe area 下按鈕不貼邊或落入系統手勢區。
- 鍵盤與螢幕閱讀器可完成一局。
- 200% 縮放與 reduced motion 可正常遊玩。
- 快速點擊、旋轉畫面、切換分頁及音訊被拒絕時不會卡局。
- 完成至少一局簡單、普通、困難 AI 對局。

---

## 16. 完成定義

只有同時符合以下條件才視為遊戲完成：

1. 直接點擊 `index.html` 可完整遊玩，不需 build 或 server。
2. 全部核心規則與本文一致。
3. 真人可對戰三名 AI，三種難度均可完成牌局。
4. 中斷牌局後可由主畫面完整繼續。
5. 四套主題、三種語言、四首 BGM 與必要音效均可使用。
6. 指定手機與桌面尺寸沒有操作區遮擋。
7. `tests/index.html` 可直接執行且全部單元測試通過。
8. 人工 UI、無障礙、效能與離線驗收全部通過。
9. 開發者工具無未處理例外、重複計時器或必要資源 404。
10. 專案內沒有新增任何 `README.md`。

---

## 17. 必要需求追蹤矩陣

| # | 原始必要需求 | 規格對應 | 主要驗收方式 |
| ---: | --- | --- | --- |
| 1 | 純前端，直接點擊 index.html | §2 | `file://` 人工啟動測試 |
| 2 | 完整 RWD，行動與網頁順暢且不遮擋 | §7 | 多尺寸與方向驗收 |
| 3 | 大字體、多樣配色、可愛風大量圖案 | §6 | 字級、四主題與對比驗收 |
| 4 | CSS、JavaScript 分類並由 index 引入 | §2.2–2.3 | 目錄與依賴檢查 |
| 5 | 開始、繼續、說明、設定 | §5.2 | 主畫面功能測試 |
| 6 | 多個輕快鋼琴 BGM、高音輕脆音效 | §10 | 音訊功能與人工聽測 |
| 7 | BGM 音量放大 10 倍 | §10.2 | fake AudioContext 驗證 gain=10 |
| 8 | RWD 行動按鍵不擋遊戲畫面 | §7.2–7.4 | 指定 viewport 驗收 |
| 9 | 日文、英文、中文 | §9 | 語系完整性測試 |
| 10 | 說明乾淨、圖示豐富且詳細 | §5.5 | 內容與易讀性驗收 |
| 11 | 畫面豐富有趣且配色清楚 | §6 | 主題與 WCAG 對比驗收 |
| 12 | 設定乾淨簡單，按鍵與音量選項美觀 | §5.6 | 設定畫面人工驗收 |
| 13 | 畫面擬真、豐富現實 | §6.3 擬真綠桌 | 主題視覺驗收 |
| 14 | 主畫面簡潔，不放設定選項 | §5.2 | 主畫面元素清單比對 |
| 15 | 動作流暢不卡頓 | §8、§14 | FPS、延遲與壓力驗收 |
| 16 | 不產生 README.md | §2.3、§16 | 檔案清單檢查 |
| 17 | 圖示可愛有趣 | §6.4 | 圖示風格與可辨識性驗收 |
| 18 | 單元測試每個環節 | §15 | `tests/index.html` 全部通過 |
| 19 | 以對決 AI 為主 | §4 | 三難度完整對局測試 |

---

## 18. 實作順序建議

1. 建立離線 HTML、CSS、JavaScript 目錄與測試框架。
2. 完成 Card、Deck、牌型判定、比牌、合法行動與計分，先讓規則測試全數通過。
3. 完成不可變 GameState、回合控制與自動存檔。
4. 完成簡單、普通、困難 AI 及可重現 RNG。
5. 完成主畫面、牌桌、結果、說明與設定畫面。
6. 完成 RWD、鍵盤、ARIA 和 reduced motion。
7. 完成四套主題、圖示與可愛裝飾。
8. 完成 Web Audio BGM、10 倍安全增益鏈與音效。
9. 完成三語系內容與完整性測試。
10. 執行全部自動測試、人工 viewport、瀏覽器、效能與離線驗收。

