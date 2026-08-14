# Castle Multiplier Defense — 遊戲開發規格書（spec.md）

> 文件版本：v1.0  
> 專案型態：純前端單機網頁遊戲  
> 執行方式：直接雙擊 `index.html` 即可遊玩，不需要 Build、不需要 Node.js、不需要任何 Server  
> 支援平台：桌面瀏覽器、平板、手機瀏覽器  
> 語系：繁體中文 / English / 日本語  
> 注意：本專案玩法可參考「城堡互射 + 倍率門」類型遊戲，但角色、美術、音效、名稱、關卡、UI 與素材需採原創設計，避免直接複製既有遊戲資產或商標。

---

# 1. 專案目標

製作一款節奏明快、視覺豐富、可愛但帶有擬真質感的「雙方城堡飛彈攻防」網頁遊戲。

玩家與敵方各自擁有一座城堡或防禦基地，雙方會持續或依回合發射飛彈。戰場中央配置會移動、旋轉、切換或排列的倍率門，例如：

- `x2`
- `x3`
- `x5`
- `x10`
- `x20`
- `x50`
- 特殊倍率門

飛彈通過倍率門後，會依倍率產生更多飛彈、提升傷害、改變飛彈數量或觸發特殊效果，形成大量投射物攻擊敵方城堡的爽快感。

本專案重點：

1. 無安裝、無 Build、無 Server。
2. RWD 完整支援手機、平板、桌面。
3. 主畫面簡潔，設定集中於設定頁。
4. UI 字體大、清楚、高對比。
5. 可切換多種配色與可愛風主題。
6. 音樂以輕快鋼琴為主。
7. 音效以高音、清脆、短促為主。
8. 遊戲動畫流暢，優先維持 60 FPS。
9. 多國語系完整支援。
10. 說明頁圖像化、清楚、詳細。
11. 所有 CSS、JavaScript、素材分類清楚。
12. 可中斷後繼續遊戲。
13. 不產生 `README.md`。
14. 美術以原創內容為原則。

---

# 2. 技術限制

## 2.1 必須使用

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas 2D API 為主要戰鬥畫面
- Web Audio API 或 HTMLAudioElement
- LocalStorage 作為設定與遊戲存檔
- requestAnimationFrame 作為遊戲主迴圈

不得使用需要編譯的框架。

---

## 2.2 禁止項目

不可要求：

- npm install
- npm run build
- npm run dev
- Vite
- Webpack
- Parcel
- React build
- Vue build
- Angular
- TypeScript 編譯
- Python HTTP Server
- PHP Server
- Node Server
- Docker

使用者必須能直接：

```text
雙擊 index.html
→ 瀏覽器開啟
→ 進入主畫面
→ 開始遊戲
```

---

# 3. 瀏覽器相容性

目標支援：

- Chrome 最新穩定版
- Edge 最新穩定版
- Firefox 最新穩定版
- Safari 最新穩定版
- iOS Safari
- Android Chrome

最低設計原則：

- 不依賴瀏覽器實驗性 API。
- 不依賴 ES Module 跨檔案載入，以避免 `file://` 情境下的瀏覽器 CORS 限制。
- JavaScript 以一般 `<script src="">` 引入。
- CSS 以 `<link rel="stylesheet">` 引入。
- JSON 語系資料不得透過 `fetch()` 讀取，避免 `file://` 被瀏覽器阻擋。

語系資料應改為 JavaScript 物件檔，例如：

```html
<script src="assets/js/i18n/zh-TW.js"></script>
<script src="assets/js/i18n/en-US.js"></script>
<script src="assets/js/i18n/ja-JP.js"></script>
```

---

# 4. 建議專案目錄

```text
project/
│
├─ index.html
│
├─ spec.md
│
├─ assets/
│  │
│  ├─ css/
│  │  ├─ base/
│  │  │  ├─ reset.css
│  │  │  ├─ variables.css
│  │  │  ├─ typography.css
│  │  │  └─ accessibility.css
│  │  │
│  │  ├─ layout/
│  │  │  ├─ app.css
│  │  │  ├─ responsive.css
│  │  │  └─ orientation.css
│  │  │
│  │  ├─ components/
│  │  │  ├─ buttons.css
│  │  │  ├─ modal.css
│  │  │  ├─ cards.css
│  │  │  ├─ sliders.css
│  │  │  ├─ tabs.css
│  │  │  └─ toast.css
│  │  │
│  │  ├─ screens/
│  │  │  ├─ menu.css
│  │  │  ├─ game.css
│  │  │  ├─ help.css
│  │  │  ├─ settings.css
│  │  │  ├─ pause.css
│  │  │  └─ result.css
│  │  │
│  │  └─ themes/
│  │     ├─ default.css
│  │     ├─ ocean.css
│  │     ├─ sunset.css
│  │     ├─ forest.css
│  │     ├─ night.css
│  │     └─ kawaii.css
│  │
│  ├─ js/
│  │  ├─ core/
│  │  │  ├─ app.js
│  │  │  ├─ game-loop.js
│  │  │  ├─ state.js
│  │  │  ├─ constants.js
│  │  │  └─ utils.js
│  │  │
│  │  ├─ game/
│  │  │  ├─ battle.js
│  │  │  ├─ castle.js
│  │  │  ├─ projectile.js
│  │  │  ├─ multiplier-gate.js
│  │  │  ├─ collision.js
│  │  │  ├─ enemy-ai.js
│  │  │  ├─ level.js
│  │  │  ├─ difficulty.js
│  │  │  ├─ particles.js
│  │  │  └─ camera.js
│  │  │
│  │  ├─ input/
│  │  │  ├─ keyboard.js
│  │  │  ├─ pointer.js
│  │  │  └─ touch.js
│  │  │
│  │  ├─ audio/
│  │  │  ├─ audio-manager.js
│  │  │  ├─ bgm.js
│  │  │  └─ sfx.js
│  │  │
│  │  ├─ ui/
│  │  │  ├─ screen-manager.js
│  │  │  ├─ hud.js
│  │  │  ├─ menu.js
│  │  │  ├─ settings.js
│  │  │  ├─ help.js
│  │  │  ├─ result.js
│  │  │  └─ toast.js
│  │  │
│  │  ├─ storage/
│  │  │  ├─ save-manager.js
│  │  │  └─ settings-storage.js
│  │  │
│  │  └─ i18n/
│  │     ├─ i18n.js
│  │     ├─ zh-TW.js
│  │     ├─ en-US.js
│  │     └─ ja-JP.js
│  │
│  ├─ audio/
│  │  ├─ bgm/
│  │  └─ sfx/
│  │
│  ├─ images/
│  │  ├─ backgrounds/
│  │  ├─ castles/
│  │  ├─ projectiles/
│  │  ├─ gates/
│  │  ├─ effects/
│  │  ├─ ui/
│  │  ├─ icons/
│  │  └─ kawaii/
│  │
│  └─ fonts/
│
└─ LICENSE.txt
```

禁止建立：

```text
README.md
```

---

# 5. index.html 規格

`index.html` 只負責：

- HTML 基礎結構
- CSS 引入
- JavaScript 引入
- 畫面容器
- Canvas 容器
- Modal / Screen 容器

不可把大量 CSS 寫在 `<style>`。

不可把大量 JavaScript 寫在 `<script>`。

例如：

```html
<link rel="stylesheet" href="assets/css/base/reset.css">
<link rel="stylesheet" href="assets/css/base/variables.css">
<link rel="stylesheet" href="assets/css/layout/app.css">
<link rel="stylesheet" href="assets/css/layout/responsive.css">
<link rel="stylesheet" href="assets/css/components/buttons.css">
```

JavaScript 必須依依賴順序載入。

---

# 6. 畫面狀態

遊戲至少包含以下 Screen：

```text
BOOT
MAIN_MENU
GAME
PAUSE
HELP
SETTINGS
RESULT_WIN
RESULT_LOSE
```

畫面切換不能重新整理網頁。

統一使用 `ScreenManager` 控制。

---

# 7. 主畫面

主畫面必須維持簡潔。

只顯示：

- 遊戲 Logo
- 開始遊戲
- 繼續遊戲
- 說明
- 設定

不要直接在主畫面顯示：

- 音量 Slider
- 配色 Selector
- 語言 Selector
- 難度設定
- 畫質設定
- 操作設定

這些全部集中在設定頁。

---

# 8. 主畫面按鈕

按鈕：

## 開始遊戲

點擊：

```text
開始遊戲
→ 若有舊進度，可提示是否覆蓋
→ 建立新遊戲
→ Level 1
```

## 繼續遊戲

有有效存檔：

```text
Continue = Enabled
```

沒有有效存檔：

```text
Continue = Disabled
```

Disabled 狀態仍需清楚可辨識，不可以因低透明度導致文字看不清楚。

## 說明

進入完整教學頁。

## 設定

進入設定頁。

---

# 9. 核心遊戲畫面

建議基本結構：

```text
┌─────────────────────────┐
│     ENEMY HP / LEVEL    │
│                         │
│   Enemy Castle          │
│                         │
│     x5   x10   x3       │
│      倍率門區域           │
│                         │
│   Player Castle         │
│                         │
│ PLAYER HP / FIRE / SKILL│
└─────────────────────────┘
```

橫向裝置：

```text
Player Castle
     ↓
Projectile → Gate → Projectile Cluster → Enemy Castle
```

實際方向可依裝置最佳布局動態調整。

---

# 10. 核心玩法

## 10.1 勝利條件

敵方城堡 HP：

```text
HP <= 0
```

玩家勝利。

## 10.2 失敗條件

玩家城堡 HP：

```text
HP <= 0
```

玩家失敗。

---

# 11. 玩家射擊

玩家可以：

### 桌面

- 滑鼠瞄準
- 左鍵發射
- Space 發射
- A / D 或 ← / → 微調方向
- ESC 暫停

### 行動裝置

優先使用：

- 點擊戰場指定位置進行瞄準
- 拖曳控制角度
- 放開發射

可提供獨立「發射」按鈕。

---

# 12. 倍率門

倍率門是本作核心。

可能倍率：

```text
x2
x3
x4
x5
x10
x15
x20
x25
x50
```

不建議一開始就大量出現超高倍率。

倍率門具有：

- X
- Y
- Width
- Height
- Multiplier
- MovePattern
- Speed
- Active
- Duration
- Theme
- Effect

---

# 13. 倍率門行為

飛彈與倍率門碰撞時：

```text
newProjectileCount = originalProjectileCount × multiplier
```

但必須有「視覺數量」與「邏輯傷害數量」分離機制。

例如：

```text
邏輯飛彈 = 1000
實際 Render 飛彈 = 120
```

否則 `x50` 連鎖可能產生數千顆 Canvas Object，造成手機卡頓。

建議：

```text
MAX_RENDER_PROJECTILES_DESKTOP = 250
MAX_RENDER_PROJECTILES_MOBILE = 120
```

超過上限後採用：

- Cluster Projectile
- Damage Batch
- Visual Proxy
- Particle Representation

---

# 14. 倍率連鎖

飛彈可連續穿過多個倍率門。

例如：

```text
1
× 5
× 10
× 20
= 1000
```

為避免爆量：

傷害計算仍可採用真正倍率。

畫面渲染採代表性飛彈。

---

# 15. 特殊倍率門

後續關卡可以增加：

- `+5`
- `+10`
- `x2`
- `x5`
- `÷2`
- 冰凍門
- 火焰門
- 爆裂門
- 穿透門
- 反射門
- 幸運門

負面門必須使用非常明確的危險配色與圖示。

---

# 16. 城堡系統

城堡基本屬性：

```js
{
    hp,
    maxHp,
    defense,
    attack,
    fireRate,
    projectileSpeed,
    criticalRate
}
```

玩家城堡與敵人城堡必須使用不同輪廓。

不可只靠顏色辨認。

原因：

- 色弱使用者
- 行動裝置戶外使用
- 低亮度螢幕

---

# 17. 擬真與可愛風融合

畫面方向：

```text
70% 半擬真
30% 可愛
```

城堡：

- 磚牆紋理
- 石材細節
- 木質結構
- 金屬砲台
- 屋瓦
- 旗幟

環境：

- 草地
- 山景
- 河流
- 雲
- 日光
- 黃昏
- 夜景
- 小鳥
- 樹
- 花草

飛彈：

- 有拋物線
- 有拖尾
- 有火焰
- 有煙霧
- 有命中特效

可愛元素：

- 星星
- 愛心
- 小兔
- 小貓
- 小熊
- 糖果
- 彩虹
- 雲朵
- 花朵
- Q 版爆炸

禁止血腥效果。

---

# 18. 主題系統

至少提供：

1. Classic
2. Ocean
3. Sunset
4. Forest
5. Night
6. Kawaii

---

# 19. Kawaii 可愛主題

大量使用可愛圖示，但不能干擾操作。

例如：

- 按鈕角落小星星
- HP icon 使用愛心盾牌
- 音量 icon 使用可愛音符
- 飛彈可切換為星星炮彈
- 倍率門帶糖果邊框
- 勝利畫面有彩帶與小動物
- Loading 使用跳跳小兔
- Pause 使用睡覺小熊

注意：

可愛圖案不能遮擋：

- 飛彈
- 倍率門數值
- HP
- 瞄準線
- 操作按鍵

---

# 20. 配色

所有主題必須有高對比度。

原則：

- 重要文字背景對比至少接近 WCAG AA。
- 不可使用「亮黃字 + 白背景」。
- 不可使用「淺粉字 + 白背景」。
- 不可使用「深藍字 + 黑背景」。
- 倍率數字一定要有描邊或背景板。
- HUD 需加半透明底板。

倍率建議視覺：

```text
正倍率：亮色 + 發光
負效果：紅 / 紫 + 危險 icon
特殊：金色 + 星形
```

不能只靠顏色傳達效果。

---

# 21. 大字體規格

整站使用大字體。

桌面：

```text
Body            18px+
Menu Button     24px+
Heading         32px+
Game HUD        20px+
Multiplier      28px+
```

手機：

```text
Body            18px+
Menu Button     22px+
Heading         28px+
Game HUD        18px+
Multiplier      26px+
```

核心數字可使用：

```text
clamp(24px, 4vw, 52px)
```

---

# 22. 字型

建議：

中文：

```text
"PingFang TC",
"Noto Sans TC",
"Microsoft JhengHei",
sans-serif
```

英文：

```text
Arial,
Verdana,
sans-serif
```

日文：

```text
"Hiragino Kaku Gothic ProN",
"Yu Gothic",
sans-serif
```

若內建字型檔，必須可離線使用。

不要依賴 Google Fonts 網路載入。

---

# 23. RWD

核心 breakpoint：

```css
< 480px
480px - 767px
768px - 1023px
>= 1024px
>= 1440px
```

不可只依賴 breakpoint。

同時使用：

```css
clamp()
min()
max()
aspect-ratio
dvh
safe-area-inset-*
```

---

# 24. 行動裝置遊戲畫面

行動裝置最大原則：

> 操作 UI 不遮擋主要戰場。

禁止大型半透明搖桿直接蓋在遊戲中心。

建議採：

```text
┌──────────────────┐
│      GAME        │
│                  │
│      GAME        │
│                  │
├──────────────────┤
│ Controls Area    │
└──────────────────┘
```

控制區應位於遊戲畫面之外或 Safe HUD 區。

---

# 25. Safe Area

iPhone 等裝置需支援：

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

避免：

- Dynamic Island
- Home Indicator
- 瀏海

遮住按鍵。

---

# 26. 橫向 / 直向

兩者都必須可玩。

## 直向

玩家城堡：

```text
畫面底部
```

敵人：

```text
畫面頂部
```

倍率門：

```text
中央區域
```

## 橫向

玩家：

```text
左側
```

敵人：

```text
右側
```

倍率門：

```text
中央
```

若偵測到旋轉：

- 不重新開始遊戲。
- Canvas 自動 Resize。
- 保留飛彈狀態。
- 不清除 HP。
- 不重設關卡。

---

# 27. Canvas 尺寸

使用 CSS 尺寸與 Internal Resolution 分離。

例如：

```js
canvas.width = cssWidth * devicePixelRatio;
canvas.height = cssHeight * devicePixelRatio;
```

但 DPR 建議限制：

```text
MAX_DPR = 2
```

避免 3x / 4x 手機 GPU 負擔過高。

---

# 28. 遊戲攝影機

可加入：

- 輕微震動
- Impact Zoom
- Slow Motion
- 大倍率命中時短暫拉近

震動不得過強。

設定中必須可以關閉：

```text
Camera Shake
```

---

# 29. 遊戲動畫

動畫必須使用：

```js
requestAnimationFrame()
```

不要使用大量：

```js
setInterval(..., 16)
```

遊戲運算使用 delta time。

---

# 30. 目標 FPS

桌面：

```text
60 FPS
```

手機：

```text
55-60 FPS
```

最低接受：

```text
30 FPS
```

若效能不足：

自動降低：

- Particle 數
- Smoke 數
- Shadow
- Glow
- Projectile Render Count

不能降低：

- 真實傷害計算
- 操作回應
- HP 更新
- 倍率判定

---

# 31. Object Pool

以下物件必須使用 Object Pool：

- Projectile
- Explosion
- Smoke
- Spark
- Trail
- Damage Text

避免戰鬥中頻繁：

```js
new Object()
```

以及大量 GC。

---

# 32. 敵方 AI

初期 AI：

- 固定時間射擊
- 基本預測倍率門
- 隨機誤差

中期：

- 預測門移動
- 避免負倍率
- 優先高倍率

後期：

- 計算最佳路徑
- 使用特殊技能
- 變化射擊節奏

AI 不能作弊。

AI 只能依玩家看得到的資訊判斷。

---

# 33. 難度

設定：

```text
Easy
Normal
Hard
```

Easy：

- 敵人 HP 低
- 敵人射速低
- 倍率門友善
- AI 誤差大

Normal：

標準。

Hard：

- 敵人更會預測
- 射擊速度提高
- 特殊門較多

禁止 Hard 單純把敵人 HP 拉到非常誇張。

---

# 34. 關卡

建議至少：

```text
20 關
```

初始 MVP 可先 10 關。

關卡包含：

- 地圖
- 城堡
- AI
- 天氣
- 倍率門配置
- 特殊門
- 敵人 HP
- 玩家 HP
- 音樂
- 背景

---

# 35. 關卡節奏

1-3：

教基本倍率。

4-6：

移動倍率門。

7-10：

多倍率連鎖。

11-15：

加入負面門。

16-20：

複合門與高階 AI。

---

# 36. 暫停

Pause：

- 繼續
- 重新開始
- 設定
- 返回主選單

開啟 Pause 時：

- Game Loop 邏輯暫停。
- BGM 降低音量。
- 音效停止觸發。

---

# 37. 繼續遊戲 / 存檔

LocalStorage：

```text
castleGame_save
castleGame_settings
```

Save 至少包含：

```js
{
    version,
    updatedAt,
    level,
    playerStats,
    unlockedThemes,
    unlockedLevels,
    difficulty
}
```

不建議儲存戰鬥中每一顆飛彈。

「繼續遊戲」至少恢復：

- 最近解鎖關卡
- 玩家升級
- 難度
- 主題
- 戰役進度

---

# 38. Auto Save

自動存檔時機：

- 完成關卡
- 離開關卡
- 解鎖內容
- 升級
- 修改重要進度

設定另存。

---

# 39. 設定頁

設定頁必須簡潔。

分區：

```text
音訊
畫面
操作
語言
主題
遊戲
```

可以使用 Tab 或 Accordion。

---

# 40. 音訊設定

顯示：

- Master Volume
- BGM Volume
- SFX Volume
- Mute
- BGM 曲目選擇
- 音效開關

Slider：

- 高度足夠
- Touch Target >= 44px
- 數字百分比顯示

例如：

```text
BGM
🔉 ━━━━━━━●━━ 80%
```

---

# 41. BGM

風格：

- 輕快鋼琴
- 乾淨
- 明亮
- 不急躁
- 可長時間循環
- 不搶音效

至少準備：

```text
Menu Piano
Battle Piano A
Battle Piano B
Battle Piano C
Victory Piano
Relax Piano
```

每首建議可循環。

---

# 42. BGM「10 倍」需求

需求指定：

> 遊戲中的 BGM 音量放大為原來的 10 倍。

實作規格：

```js
effectiveBgmGain = userBgmVolume * 10
```

但瀏覽器最終輸出必須經過 Gain Limit / Compressor / Limiter，避免：

- 爆音
- Clipping
- 耳機瞬間過大
- 音訊失真

邏輯上保留「10 倍增益」，最終輸出需安全限制於不失真的範圍。

建議：

```text
Source
→ GainNode (10x)
→ DynamicsCompressorNode
→ MasterGain
→ Destination
```

首次啟動預設：

```text
Master = 35%
BGM = 25%
SFX = 55%
```

不得在使用者第一次開啟遊戲時突然以極大音量播放。

---

# 43. Autoplay 限制

因瀏覽器規定：

音訊只能在使用者第一次互動後播放。

流程：

```text
開啟 index.html
→ 不自動播放
→ 玩家點擊開始 / 任意按鈕
→ 初始化 AudioContext
→ 播放 BGM
```

---

# 44. 音效

音效方向：

- 高音
- 清脆
- 短
- 有彈性
- 不刺耳

需要：

- UI Hover
- UI Click
- Fire
- Gate Enter
- Multiplier
- Critical
- Hit
- Explosion
- Shield
- Victory
- Defeat
- Unlock
- Coin / Reward

大倍率：

```text
x2 → Ding
x5 → Double Ding
x10 → Sparkle
x20+ → Chime + Layer
```

---

# 45. 音效限制

同時音效不得無限播放。

例如：

```text
MAX_SIMULTANEOUS_SFX = 16
```

同類型 hit：

使用：

- Rate Limit
- Audio Pool
- Random Pitch

避免 200 顆飛彈命中時播放 200 次爆炸聲。

---

# 46. 多語系

至少：

```text
zh-TW
en-US
ja-JP
```

所有 UI 文字必須透過 key。

禁止直接在功能 JS 裡：

```js
button.textContent = "開始遊戲";
```

必須：

```js
button.textContent = I18n.t("menu.start");
```

---

# 47. 語系資料

例如：

```js
window.I18N_ZH_TW = {
    "menu.start": "開始遊戲",
    "menu.continue": "繼續遊戲",
    "menu.help": "說明",
    "menu.settings": "設定"
};
```

English：

```text
Start Game
Continue
How to Play
Settings
```

Japanese：

```text
ゲーム開始
つづきから
遊び方
設定
```

---

# 48. 語言切換

切換後立即刷新 UI 文字。

不可強制重新整理頁面。

需要處理：

- Button
- HUD
- Modal
- Help
- Settings
- Result
- Toast

---

# 49. 說明頁

說明頁必須：

- 排版整潔
- 大量圖示
- 分區明確
- 文字不可密集成牆
- 每個規則有視覺 Example

內容：

1. 遊戲目標
2. 如何射擊
3. 倍率門
4. 特殊門
5. 城堡 HP
6. 技能
7. 操作
8. 手機操作
9. 暫停
10. 存檔
11. 勝敗條件
12. 效能提示
13. 音樂
14. 設定
15. 語言

---

# 50. 說明頁圖示

至少使用：

```text
🏰 城堡
🚀 飛彈
✨ 倍率
❤️ HP
🛡️ 防禦
🎯 瞄準
🎵 音樂
🔊 音效
🌈 主題
🌐 語言
📱 行動裝置
⌨️ 鍵盤
🖱️ 滑鼠
💾 存檔
⏸️ 暫停
```

正式美術完成後，可用自製 SVG / PNG 圖示替換 Emoji。

---

# 51. HUD

必須包含：

玩家：

- HP
- 城堡狀態
- 武器狀態
- 技能

敵人：

- HP
- Boss / Level

中央：

- Level
- Combo
- 特殊事件

右上或安全區：

- Pause

---

# 52. HUD 可讀性

所有 HUD：

```text
背景半透明深色
+
白色 / 高亮文字
+
陰影或描邊
```

不可直接把文字疊在天空或爆炸上。

---

# 53. 按鍵

所有按鍵：

- 最低 44x44 CSS px
- 圓角
- 明確 Hover
- Active
- Focus
- Disabled
- Touch feedback

桌面推薦高度：

```text
56px+
```

手機推薦：

```text
52px+
```

---

# 54. 行動控制區

建議控制區只放：

- Fire
- Skill
- Pause

瞄準主要透過：

- Drag
- Swipe

避免：

```text
左搖桿 + 右搖桿 + 5 個技能鍵
```

造成畫面擁擠。

---

# 55. 特效

可以使用：

- Spark
- Smoke
- Flash
- Glow
- Shockwave
- Confetti
- Screen Shake
- Damage Number
- Combo Text

大倍率時：

```text
x20!
MEGA SHOT!
```

文字彈出。

---

# 56. Particle 系統

品質設定：

```text
Low
Medium
High
Auto
```

Auto：

依 FPS 自動調整。

---

# 57. 畫質

設定：

- Auto
- Low
- Medium
- High

Low：

- 少量粒子
- 無 Blur
- 少量 Shadow
- 少量 Smoke

High：

- Dynamic Glow
- 更多 Particle
- Soft Shadow
- Trail
- Weather Effect

---

# 58. Accessibility

至少提供：

- 大字體
- Reduced Motion
- Camera Shake Toggle
- High Contrast
- Colorblind-friendly Markers
- 音樂獨立控制
- 音效獨立控制

---

# 59. 色弱設計

倍率門不能只靠顏色。

例如：

```text
x5
⬆
```

正面。

```text
÷2
⚠
```

負面。

特殊門：

```text
★
```

---

# 60. 動畫減量

若：

```js
window.matchMedia("(prefers-reduced-motion: reduce)")
```

啟用：

- 降低 Screen Shake
- 減少 UI 動畫
- 減少 Particle
- 禁用大幅 Zoom

---

# 61. Input Manager

所有輸入統一轉為 Action：

```text
AIM
FIRE
SKILL
PAUSE
CONFIRM
BACK
```

不要讓 Battle 直接判斷：

```text
event.key === ...
```

如此更方便跨平台。

---

# 62. 觸控

必須：

```css
touch-action: none;
```

只對遊戲控制區使用。

設定頁、說明頁仍需要正常 Scroll。

---

# 63. 防誤觸

手機：

- Pause 放 Safe Area。
- 重要離開按鍵需確認。
- Gameplay 中不可因 Swipe 觸發瀏覽器頁面水平捲動。

---

# 64. 遊戲資料

`constants.js` 放：

- FPS
- 最大 projectile
- damage
- HP
- difficulty modifier

`level.js` 放：

- 關卡資料

不要把魔法數字分散在各 JS。

---

# 65. App State

統一：

```js
window.GameState = {
    screen: "MAIN_MENU",
    locale: "zh-TW",
    theme: "default",
    settings: {},
    save: {},
    battle: {}
};
```

不要讓每個模組各自保留互相衝突的狀態。

---

# 66. LocalStorage 版本

Save：

```js
{
    version: 1
}
```

未來更新時可做 migration。

若存檔損毀：

- 不可讓遊戲白畫面。
- 顯示清楚提示。
- 可重置該份存檔。
- 設定盡量保留。

---

# 67. 錯誤處理

需監聽：

```js
window.onerror
window.onunhandledrejection
```

正式 UI 不顯示技術堆疊。

顯示：

```text
遊戲遇到了一點問題。
你可以返回主畫面重新開始。
```

Console 可以保留詳細錯誤。

---

# 68. Loading

由於純前端本地開啟，仍須有資源 Loading。

畫面：

```text
可愛小砲彈跳動
Loading...
```

但首次載入不能依賴網路。

---

# 69. 圖片

優先：

- SVG UI
- WebP Background
- PNG 透明效果

必須壓縮。

避免：

- 單張 10MB 背景
- 4K 圖片直接放手機
- 大量沒有必要的透明 PNG

---

# 70. 音樂檔案

建議：

```text
MP3
```

可搭配：

```text
OGG
```

但需確認 Safari 相容。

所有音訊必須可以離線播放。

---

# 71. 原創素材要求

不要直接：

- 擷取其他遊戲角色
- 複製其他遊戲城堡
- 擷取其他遊戲 UI
- 擷取其他遊戲音樂
- 使用未授權圖片
- 使用未授權 BGM

可參考玩法機制，但整體內容需重新設計。

---

# 72. UI 動畫

按鈕 Hover：

```text
scale 1.02
```

按下：

```text
scale 0.97
```

Modal：

- Fade
- Scale

切頁：

- 150~300ms

不可過慢。

---

# 73. Game Feel

讓遊戲有爽感：

射擊：

- Recoil
- Spark
- Shot Sound

穿倍率門：

- Gate Flash
- Number Pop
- Chime
- Trail Increase

命中：

- Shockwave
- Castle Reaction
- Damage Number
- Particle

大倍率：

- Short Slow-mo
- Camera shake
- Extra piano/chime layer

---

# 74. 結果頁

Win：

- Victory 標題
- 星星
- 彩帶
- 關卡時間
- 最大倍率
- 總傷害
- 下一關
- 重玩
- 主選單

Lose：

- 可愛失敗畫面
- Retry
- 主選單
- 提示

失敗不能營造挫敗羞辱感。

---

# 75. 統計

每局可記錄：

```text
Shots Fired
Max Multiplier
Damage
Hit Rate
Time
Combo
```

---

# 76. 設定資料

建議：

```js
{
    locale: "zh-TW",
    theme: "default",

    masterVolume: 0.35,
    bgmVolume: 0.25,
    sfxVolume: 0.55,

    mute: false,
    bgmEnabled: true,
    sfxEnabled: true,

    graphicsQuality: "auto",
    reducedMotion: false,
    cameraShake: true,
    highContrast: false,

    difficulty: "normal"
}
```

---

# 77. 主題資料

使用：

```html
<body data-theme="kawaii">
```

CSS：

```css
[data-theme="kawaii"] {
    --color-primary: ...;
}
```

所有元件應使用 CSS Variables。

---

# 78. CSS Variables

至少：

```css
--color-bg
--color-panel
--color-text
--color-primary
--color-secondary
--color-accent
--color-danger
--color-success
--color-border
--shadow-soft
--radius-sm
--radius-md
--radius-lg
--font-size-body
--font-size-button
--font-size-title
```

禁止每個元件硬寫完全不同色票。

---

# 79. CSS 分類規則

`base/`

全域。

`layout/`

版面。

`components/`

共用元件。

`screens/`

特定畫面。

`themes/`

主題。

禁止建立：

```text
style1.css
style2.css
temp.css
final.css
final2.css
```

---

# 80. JavaScript 分類規則

`core/`

遊戲核心。

`game/`

戰鬥。

`audio/`

音訊。

`input/`

輸入。

`ui/`

UI。

`storage/`

存檔。

`i18n/`

語系。

禁止把所有功能都寫進：

```text
main.js
```

---

# 81. 全域變數

盡量只有少量：

```text
window.CastleGame
window.GameState
```

其他功能使用 namespace。

例如：

```js
window.CastleGame.Audio
window.CastleGame.UI
window.CastleGame.Battle
```

---

# 82. 資源預載

開戰前預載：

- 城堡
- 背景
- Projectile
- Gate
- 必需 SFX

BGM 可延遲。

---

# 83. 效能監測

Debug Mode 可以顯示：

```text
FPS
Projectile Count
Particle Count
Draw Calls
Delta Time
```

正式模式預設隱藏。

---

# 84. 遊戲迴圈

結構：

```js
function frame(time) {
    update(deltaTime);
    render();
    requestAnimationFrame(frame);
}
```

Physics 不可綁定 FPS。

---

# 85. 碰撞

倍率門：

- AABB
- Segment vs Rectangle

城堡：

- Bounding Box / Circle

大量 projectile：

不要對每顆飛彈與所有 object 做 O(n²)。

---

# 86. Damage Batch

大量飛彈命中時：

例如：

```text
1000 邏輯飛彈
```

可以一次計算總 Damage。

畫面只顯示：

```text
50~120 個代表 projectile
```

---

# 87. 手機記憶體

每個關卡結束：

清理：

- Projectile Pool
- Particle
- Audio Source
- Temporary Array
- Event Listener

避免長時間遊玩後愈來愈卡。

---

# 88. 視窗失焦

當：

```js
document.hidden === true
```

自動 Pause。

避免切去其他 App 後遊戲仍持續進行。

---

# 89. Page Lifecycle

`visibilitychange`：

- Pause Game
- 降低 Audio
- 暫停 Animation

回來後：

顯示 Pause Screen。

---

# 90. 操作回饋

所有輸入要在約：

```text
< 100ms
```

內看到視覺回應。

理想：

```text
< 50ms
```

---

# 91. 首頁簡潔度

首頁不可有：

- Slider
- Checkbox
- Dropdown
- Debug Data
- 大量說明
- 廣告
- 彈窗促銷

首頁視覺焦點：

```text
Logo
Start
Continue
Help
Settings
```

---

# 92. 設定 UI

使用：

```text
Settings

Audio
[ Music      ━━━●━━ ]
[ SFX        ━━━━━● ]
[ Master     ━━━●━━ ]

Display
[ Theme      Kawaii ▼ ]
[ Quality    Auto   ▼ ]

Language
[ 中文 | EN | 日本語 ]
```

每個 Section 有 icon。

---

# 93. 設定即時預覽

主題：

立即套用。

語言：

立即套用。

Volume：

即時 Preview。

SFX Slider：

使用者放開時播放一次短音效。

---

# 94. 設定重置

提供：

```text
Restore Defaults
```

必須二次確認。

只重置設定。

不能順便刪除遊戲進度。

---

# 95. 存檔重置

另外放：

```text
Reset Game Progress
```

需要更明確確認。

不能與 Settings Reset 混在一起。

---

# 96. 鍵盤 Focus

所有按鈕必須可用：

- Tab
- Enter
- Space

Focus Ring 不能關閉。

---

# 97. 無滑鼠操作

整個 Menu / Settings / Help 必須可只用鍵盤操作。

---

# 98. 行動裝置字體

不得因 RWD 把所有字縮到 12px。

行動版仍需大字。

---

# 99. 文字溢出

日文與英文較長。

Button：

不可固定寬度導致：

```text
Continue Game
```

被截斷。

使用：

- min-width
- padding
- flex
- word-wrap

---

# 100. 畫面層級

建議：

```text
Canvas:          z-index 1
HUD:             z-index 10
Controls:        z-index 20
Modal Overlay:   z-index 100
Toast:           z-index 200
```

---

# 101. 音樂切換

不同畫面：

Main：

```text
Menu Piano
```

Battle：

```text
Battle Piano
```

Result：

```text
Victory / Defeat
```

切換使用 Crossfade。

建議：

```text
500~1200ms
```

---

# 102. BGM 隨機

Battle 曲目不可每場都一樣。

可以：

```text
Shuffle
```

但避免連續播同一首。

---

# 103. 音訊 Loop

Loop 點需自然。

禁止有明顯：

```text
啪
```

或突然中斷。

---

# 104. 音效 Pitch

可以對大量重複音效：

```text
0.95x - 1.05x
```

微幅 Random Pitch。

增加自然度。

---

# 105. 擬真物理

Projectile：

- Gravity
- Velocity
- Arc
- Drag 可選

但遊戲性優先。

不需要做到完整真實彈道。

---

# 106. Aim Preview

玩家瞄準時：

顯示虛線拋物線。

但只顯示前段或估計軌跡。

可在 Hard 模式降低完整提示。

---

# 107. 倍率門提示

每個倍率門：

- 大數字
- icon
- 發光
- Border
- 清楚 hitbox

玩家不能因美術看不懂到底要射哪裡。

---

# 108. Combo

連續命中倍率門：

```text
Combo +1
```

高 Combo：

- 視覺加強
- 音效加強

不要讓 Combo 變成強制課金或阻礙主玩法的系統。

---

# 109. Skill

可加入 3 類技能：

- Slow Time
- Shield
- Split Shot

MVP 可以只實作 1 種。

技能按鍵在手機必須放控制安全區。

---

# 110. Weather

視覺：

- Clear
- Cloud
- Sunset
- Rain
- Snow
- Night

天氣預設不影響操作。

後期可加入：

- Wind

但需用 UI 明確表示。

---

# 111. 場景深度

至少三層：

```text
Background
Midground
Foreground
```

使用簡單 Parallax。

手機低畫質可關閉。

---

# 112. 暫停時設定

Pause → Settings：

修改後返回 Pause。

不能直接跳回主畫面。

---

# 113. 退出確認

戰鬥中：

```text
Return to Menu?
Current battle progress will be lost.
```

已完成進度仍保留。

---

# 114. 首次遊戲

第一次進入：

主畫面仍保持乾淨。

按「開始遊戲」後可啟動簡短互動教學。

不強制使用超長 Tutorial。

---

# 115. Tutorial

步驟：

1. 拖曳瞄準
2. 發射
3. 穿過 x2
4. 攻擊城堡
5. 解釋 HP
6. 完成

每步都可以 Skip。

---

# 116. Help 與 Tutorial 差異

Tutorial：

短、互動。

Help：

完整、可重複閱讀。

---

# 117. 玩家體驗

避免：

- 無法 Skip 動畫
- 連續彈 Modal
- 開局就播放超大聲
- 手機按鈕遮住倍率門
- 字太小
- 白字配亮背景
- 大量畫面閃爍
- 每次切頁 Loading
- 過度粒子造成卡頓

---

# 118. 可愛圖示規範

每個功能 Icon 需：

- 輪廓簡單
- 大尺寸可辨識
- 圓潤
- 可愛
- 不影響文字可讀性

例如：

Settings：

```text
⚙ + 小熊耳
```

Audio：

```text
🎵 + 星星
```

Language：

```text
🌐 + 小地球臉
```

---

# 119. Icon 備援

若圖片載入失敗：

仍顯示文字。

任何主要功能不得只靠圖片存在。

---

# 120. 無網路

完全斷網時：

遊戲仍必須可以：

- 開啟
- 開始遊戲
- 播放音效
- 切換主題
- 切換語言
- 存檔
- 繼續遊戲

---

# 121. 禁止外部依賴

正式版本不要依賴：

- CDN CSS
- CDN JS
- Google Fonts
- 外部 Audio URL
- 外部 Image URL
- 外部 API

所有素材本地化。

---

# 122. 安全

不需要：

- Account
- Login
- Cookie
- Tracking
- Analytics
- Upload

遊戲為純本機。

---

# 123. Debug Mode

可以透過：

```js
window.CastleGame.DEBUG = false;
```

切換。

正式預設：

```text
false
```

---

# 124. Debug 功能

開啟時：

- FPS
- Hitbox
- Projectile Count
- Force Win
- Force Lose
- Gate Generator
- Audio Test

正式 UI 不可顯示。

---

# 125. 開發順序

Phase 1：

- 專案結構
- index
- CSS
- Screen Manager
- Main Menu

Phase 2：

- Canvas
- Game Loop
- Castle
- Projectile
- Gate
- Collision

Phase 3：

- Enemy AI
- HP
- Win / Lose
- Level

Phase 4：

- RWD
- Touch
- Orientation

Phase 5：

- Audio
- Settings
- Theme

Phase 6：

- i18n
- Help
- Save

Phase 7：

- Particles
- Polish
- Performance

Phase 8：

- QA

---

# 126. MVP 驗收

MVP 必須做到：

- 直接雙擊 index.html 可玩。
- 首頁四個核心功能完整。
- 玩家可射擊。
- 敵人可射擊。
- 倍率門可作用。
- HP 可扣除。
- 有勝負。
- 有 3 種語言。
- 有至少 3 個主題。
- 有可愛主題。
- 有 BGM。
- 有 SFX。
- 可調整音量。
- 有存檔。
- 可繼續遊戲。
- 手機可玩。
- 手機操作 UI 不遮住核心戰場。
- 沒有 README.md。

---

# 127. 完整版驗收

## 功能

- [ ] 直接開啟 index.html
- [ ] 不需要 Server
- [ ] 不需要 Build
- [ ] Start 正常
- [ ] Continue 正常
- [ ] Help 正常
- [ ] Settings 正常
- [ ] Pause 正常
- [ ] Win 正常
- [ ] Lose 正常
- [ ] LocalStorage 正常

## RWD

- [ ] 360x640
- [ ] 375x667
- [ ] 390x844
- [ ] 412x915
- [ ] 768x1024
- [ ] 1024x768
- [ ] 1366x768
- [ ] 1920x1080

## 手機

- [ ] iPhone Safari 可操作
- [ ] Android Chrome 可操作
- [ ] 不遮擋
- [ ] Safe Area
- [ ] 旋轉不中斷

## 音訊

- [ ] 多首 BGM
- [ ] Piano 風格
- [ ] 清脆 SFX
- [ ] 10x BGM Gain 邏輯
- [ ] Limiter 防爆音
- [ ] Master/BGM/SFX 可分開調
- [ ] Mute 正常

## 語言

- [ ] 中文
- [ ] English
- [ ] 日本語
- [ ] 即時切換
- [ ] 無文字溢出

## UI

- [ ] 大字
- [ ] 清楚
- [ ] 高對比
- [ ] 多主題
- [ ] 可愛主題
- [ ] 圖示可愛
- [ ] Help 圖示豐富
- [ ] Settings 乾淨

## 效能

- [ ] Desktop 接近 60 FPS
- [ ] Mobile 接近 60 FPS
- [ ] 大倍率不爆量
- [ ] Particle 有上限
- [ ] Projectile 有 Pool
- [ ] VisibilityChange 自動 Pause
- [ ] 長時間遊玩不明顯惡化

---

# 128. 測試情境

## Case A

```text
Chrome
Windows
1920x1080
直接雙擊 index.html
```

應正常進入。

## Case B

```text
iPhone
390x844
Portrait
```

所有操作按鍵不遮擋中央倍率門。

## Case C

旋轉成 Landscape。

Battle 不重設。

## Case D

飛彈：

```text
x5 → x10 → x20
```

邏輯倍率：

```text
x1000
```

畫面不能因生成 1000+ DOM / Canvas Objects 而卡住。

## Case E

播放大量命中音效。

不可嚴重破音。

## Case F

LocalStorage 存檔後關閉。

重新雙擊 index.html。

Continue 應可用。

## Case G

切換：

```text
中文 → 日本語 → English
```

不能刷新頁面。

## Case H

切換 Kawaii Theme。

UI、倍率門、按鈕、圖示同步改變。

---

# 129. Definition of Done

專案可視為完成需同時滿足：

1. `index.html` 雙擊可執行。
2. 不需要任何 Server。
3. 不需要任何 Build。
4. 主玩法完整。
5. 倍率門運作正確。
6. 玩家與 AI 都可攻擊。
7. RWD 完整。
8. 手機操作不遮戰場。
9. 三國語言完整。
10. Help 完整。
11. Settings 完整。
12. 多配色主題。
13. Kawaii Theme 完整。
14. 多首鋼琴 BGM。
15. 清脆 SFX。
16. BGM 實作 10x 邏輯增益並有安全 limiter。
17. 存檔與 Continue 正常。
18. 遊戲保持流暢。
19. UI 文字大且清楚。
20. 不存在 `README.md`。
21. 美術與音訊素材為原創、自製或合法授權。
22. 無外部網路依賴。
23. Console 無持續性 Error。
24. 手機與桌面核心流程皆能完成至少一局。

---

# 130. 最終交付檔案

完成遊戲階段應至少包含：

```text
index.html
spec.md
assets/
```

其中：

```text
assets/css/
assets/js/
assets/audio/
assets/images/
```

必須分類完整。

本階段明確禁止產生：

```text
README.md
```

README 將在遊戲真正完成後另行製作。

---

# 131. 實作優先原則

若規格產生衝突，採以下優先級：

```text
1. 可以直接雙擊 index.html 運作
2. 遊戲正常可玩
3. 手機操作不遮擋畫面
4. 效能與穩定性
5. 文字清晰與 Accessibility
6. 核心玩法爽快
7. 視覺豐富
8. 特效數量
```

若高倍率視覺效果與效能衝突：

優先效能。

若可愛裝飾與可讀性衝突：

優先可讀性。

若擬真畫面與操作辨識衝突：

優先操作辨識。

---

# 132. AI / 開發者執行要求

任何接手實作本規格的開發者或 AI 必須遵守：

- 不擅自改成需要 Server 的架構。
- 不擅自新增 Build Step。
- 不擅自把全部 CSS 塞入單一檔案。
- 不擅自把全部 JS 塞入單一檔案。
- 不使用外部 CDN 作為必要依賴。
- 不省略 Mobile RWD。
- 不省略三語系。
- 不省略音量設定。
- 不讓觸控按鍵遮住戰場。
- 不建立 README.md。
- 不直接複製其他商業遊戲的素材。
- 不因高倍率而真正建立無限制 projectile object。
- 不以低對比配色犧牲可讀性。
- 不把設定項目放在主畫面。
- 不把字體縮小來處理 RWD。
- 不讓音訊 10 倍增益造成削波或危險的突然大音量。

---

# 133. 開發完成前最後檢查

執行：

```text
關閉所有 Local Server
關閉 IDE Preview
關閉 Node
```

然後：

```text
直接從檔案總管 / Finder 雙擊 index.html
```

完整測試：

```text
Main Menu
→ Settings
→ Language
→ Theme
→ Start
→ Fire
→ Multiplier
→ Pause
→ Resume
→ Win
→ Save
→ Main Menu
→ Continue
```

流程完全成功後，才視為符合本規格的「純前端直接開啟」要求。
