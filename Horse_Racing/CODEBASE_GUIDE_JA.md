# 賽馬王 Web ゲーム — コードベース詳細ガイド

## 1. ドキュメントの目的

このドキュメントは、`Horse_Racing` プロジェクトの実装内容を日本語で詳細に整理したものです。  
主な目的は以下の通りです。

- どのファイルが何を担当しているかをすぐ把握できるようにする
- HTML / CSS / JavaScript の責務分離を明確にする
- 画面遷移、ゲーム進行、賭け処理、レース計算、描画処理の流れを説明する
- 今後の保守、機能追加、デバッグをしやすくする

本プロジェクトはフレームワークを使わない純粋な HTML / CSS / JavaScript で構成されています。

---

## 2. 現在のディレクトリ構成

```text
Horse_Racing/
├─ horse_racing.html
├─ horse_racing_game_spec.md
├─ CODEBASE_GUIDE_JA.md
├─ css/
│  ├─ styles.css
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  └─ responsive.css
└─ js/
   ├─ app.js
   ├─ core/
   │  ├─ utils.js
   │  ├─ game-state.js
   │  └─ router.js
   ├─ data/
   │  └─ knowledge.js
   ├─ systems/
   │  ├─ uncertainty-system.js
   │  ├─ horse-engine.js
   │  ├─ betting-system.js
   │  ├─ audio-engine.js
   │  └─ race-simulator.js
   ├─ ui/
   │  ├─ renderer.js
   │  └─ ui.js
   └─ game/
      └─ game.js
```

---

## 3. アーキテクチャ全体像

本作は、以下のような責務分割で構成されています。

```text
HTML
 └─ 画面構造を保持

CSS
 ├─ 共通デザイン
 ├─ レイアウト
 ├─ UI コンポーネント
 └─ レスポンシブ調整

JavaScript
 ├─ core       : 汎用処理、状態、画面遷移
 ├─ data       : 静的データ
 ├─ systems    : ゲームシステムの計算
 ├─ ui         : DOM と Canvas の描画
 ├─ game       : ゲーム進行の統括
 └─ app.js     : 起動処理とイベント登録
```

ゲーム全体の基本フローは次の通りです。

```text
ホーム画面
  ↓
ベッティング画面
  ↓
レース開始
  ↓
レースシミュレーション
  ↓
結果画面
  ↓
次レース / ホームへ戻る
```

---

## 4. HTML の詳細

### 4.1 `horse_racing.html`

このファイルは、ゲーム全体の **DOM 構造** を担当します。  
現在は JavaScript や CSS を直接書き込まず、外部ファイルを読み込む構成です。

### 4.2 HTML 内の主要セクション

#### `#home`
- ホーム画面
- 表示内容:
  - ロゴ
  - タイトル
  - 所持チップ
  - 戦績
  - メニュー

#### `#guide`
- 遊び方説明画面
- `<details>` を使って説明を折りたたみ表示

#### `#knowledge`
- 競馬知識画面
- カテゴリフィルタとカード一覧を表示

#### `#settings`
- 設定画面
- BGM / 効果音 / スピード / 品質 / 初期チップ / 難易度の設定を持つ

#### `#betting`
- 馬選択と賭け画面
- レース条件、所持チップ、馬カード一覧、ベットスリップを表示

#### `#race`
- レース中画面
- Canvas 描画、距離進捗、順位、イベント速報を表示

#### `#result`
- 結果画面
- 着順、賭け結果、収支、豆知識を表示

### 4.3 HTML 側の読み込み順

JavaScript は依存関係を考慮して以下の順番で読み込みます。

```html
<script src="js/core/utils.js"></script>
<script src="js/core/game-state.js"></script>
<script src="js/core/router.js"></script>
<script src="js/data/knowledge.js"></script>
<script src="js/systems/uncertainty-system.js"></script>
<script src="js/systems/horse-engine.js"></script>
<script src="js/systems/betting-system.js"></script>
<script src="js/systems/audio-engine.js"></script>
<script src="js/systems/race-simulator.js"></script>
<script src="js/ui/renderer.js"></script>
<script src="js/ui/ui.js"></script>
<script src="js/game/game.js"></script>
<script src="js/app.js"></script>
```

`app.js` は最終的に初期化を行うため、必ず最後に読み込まれます。

---

## 5. CSS の詳細

### 5.1 `css/styles.css`

CSS の総合入口です。  
以下のファイルを `@import` で読み込みます。

```css
@import url("./base.css");
@import url("./layout.css");
@import url("./components.css");
@import url("./responsive.css");
```

### 5.2 `css/base.css`

役割:
- CSS カスタムプロパティ定義
- 全体背景
- フォント設定
- 基本的なリセット

代表的な定義:
- `--bg`
- `--panel`
- `--accent`
- `--danger`
- `--shadow`

### 5.3 `css/layout.css`

役割:
- 画面の大枠レイアウト
- grid / flex の分割
- 各領域の配置

対象:
- `.app`
- `.screen`
- `.stats-row`
- `.race-meta`
- `.horse-grid`
- `.result-grid`

### 5.4 `css/components.css`

役割:
- 見た目を持つ UI 部品
- ボタン
- カード
- タグ
- ベットスリップ
- プログレスバー
- トースト

対象:
- `.btn`
- `.card`
- `.horse-card`
- `.bet-slip`
- `.progress`
- `.toast`

### 5.5 `css/responsive.css`

役割:
- 画面幅に応じたレスポンシブ調整

現在の主な変更:
- 640px 以上で馬カードを 2 列
- モバイルでは:
  - 各 grid を 1 列へ
  - パディング縮小
  - ベットコントロールを縦積み

---

## 6. JavaScript 全体構成

## 6.1 `js/core`

### `utils.js`

汎用ユーティリティ集です。

主な関数:
- `money(n)`
  - 金額を `$ 10,000` 形式へ整形
- `clamp(v, min, max)`
  - 数値を範囲内に制限
- `rand(min, max)`
  - ランダム小数を返す
- `pick(arr)`
  - 配列からランダムに 1 件選択
- `shuffle(arr)`
  - 配列をシャッフル

### `game-state.js`

ゲーム全体の永続状態を担当します。

保存先:
- `localStorage`
- キー: `hrg_save`

保持する内容:
- チップ
- 戦績
- 設定
- レース履歴

主なメソッド:
- `defaults()`
- `load()`
- `save()`

### `router.js`

SPA 風の画面切り替えを担当します。

主な責務:
- 現在画面の管理
- 画面履歴の保持
- 各画面の `display` 切り替え
- 画面遷移時の描画更新
- 画面ごとの BGM 切り替え

主なメソッド:
- `go(id)`
- `back()`

---

## 6.2 `js/data`

### `knowledge.js`

競馬知識カードの静的データを格納します。

各要素は次の構造です。

```js
[カテゴリ, タイトル, 本文, ゲームへの影響]
```

利用箇所:
- 知識画面
- 結果画面の豆知識
- ランダム知識表示

---

## 6.3 `js/systems`

### `uncertainty-system.js`

不確定要素を担当します。

#### `weather()`
毎レースごとに天候を決定します。

候補:
- 晴天
- 多雲
- 小雨
- 大雨

天候によって:
- 馬場
- 速度補正
- 馬場状態
- スタミナ消耗倍率
が変化します。

#### `event(horse)`
レース中イベントを生成します。

候補:
- 失蹄
- 受阻
- 意外加速
- 換跑道
- 受嚇
- 第二風

安定性が高い馬ほど、負のイベントに巻き込まれにくくなります。

### `horse-engine.js`

馬生成と能力計算を担当します。

#### 主要データ
- 中国語名
- 英語名
- カラー

#### `generate()`
10 頭の馬を生成します。

生成される要素:
- 年齢
- 閘位
- 基礎能力
- 当日状態
- 騎手ランク
- 体重
- 戦法

また、極端に強い馬と弱い馬が 1 頭ずつ出るように調整されています。

#### `score(h, race)`
馬の総合スコアを算出します。

考慮対象:
- 速度
- スタミナ
- 爆発力
- 馬場適性
- 距離適性
- 調教状態
- 気分
- 騎手補正

### `betting-system.js`

賭け計算を担当します。

#### `calcOdds(h, horses, race)`
馬ごとのオッズを算出します。

考慮対象:
- 相対的な馬能力
- 馬場適性
- 閘位
- 天候

#### `settle(bets, horses)`
レース終了後の払い戻しを計算します。

現在実装済み:
- 獨贏
- 位置

内部的には:
- 連贏
- 三重彩
にも対応できる構造を持っています。

### `audio-engine.js`

Web Audio API による音声処理を担当します。

役割:
- AudioContext 初期化
- BGM チャンネル
- 効果音チャンネル
- 音量反映
- 画面ごとの BGM シーン切り替え

主な関数:
- `init()`
- `apply()`
- `tone()`
- `sfxPlay(id)`
- `scene(id)`

### `race-simulator.js`

レース計算の中核です。

#### `start()`
- レース開始
- `requestAnimationFrame` ループを起動

#### `loop(now)`
- 時間差分計算
- レース速度設定の適用
- `tick()` 実行
- 描画更新
- 全馬ゴール後に結果処理へ移行

#### `tick(dt)`
各馬について毎フレーム次を計算します。

- 現在位置
- 基礎速度
- 馬場適性
- 閘位補正
- エネルギー補正
- 戦法補正
- ラストスパート補正
- ランダムイベント補正
- 体力減少
- 順位更新

このファイルが、ゲームの「物理エンジン」に近い役割を持っています。

---

## 6.4 `js/ui`

### `renderer.js`

Canvas の描画を担当します。

主な処理:
- Canvas サイズ調整
- レーン描画
- ゴールライン描画
- 馬アイコン描画
- 馬名描画

現在は 10 頭対応で、画面サイズごとに Canvas 高さも変化します。

### `ui.js`

DOM 描画を担当します。

主な関数:
- `toast(msg)`
- `renderHome()`
- `renderKnowledge(filter)`
- `renderBetting()`
- `renderSlip()`
- `updateRace()`
- `event(text)`
- `result(settlement)`

DOM 生成ロジックはこのファイルへ集約されており、ゲームロジックと表示ロジックを分離しています。

---

## 6.5 `js/game`

### `game.js`

ゲーム進行全体のオーケストレーションを担当します。

主な役割:
- レース準備
- ベット追加
- ベット確定
- チップ差し引き
- レース終了後の統計更新
- 結果保存

主なメソッド:
- `prepareRace()`
- `addBet(horseId, type, amount)`
- `confirm()`
- `finishRace()`

---

## 6.6 `js/app.js`

アプリケーション起動時のイベント登録を担当します。

登録している主なイベント:
- 画面遷移ボタン
- 戻るボタン
- 知識カテゴリフィルタ
- ベット追加
- ベット削除
- ランダム知識
- サウンド切り替え
- 設定変更
- チップリセット
- 記録削除
- ページ非表示時の自動保存
- iOS 向け AudioContext 再開

`app.js` は **UI 操作と各モジュールをつなぐ入口** です。

---

## 7. データフロー

## 7.1 ホーム画面表示時

```text
GameState.load()
  ↓
UI.renderHome()
  ↓
所持チップ / 戦績表示
```

## 7.2 ベッティング開始時

```text
Router.go("betting")
  ↓
Game.prepareRace()
  ↓
UncertaintySystem.weather()
HorseEngine.generate()
BettingSystem.calcOdds()
  ↓
UI.renderBetting()
```

## 7.3 ベット確定時

```text
Game.confirm()
  ↓
チップ差し引き
GameState.save()
Router.go("race")
RaceSimulator.start()
```

## 7.4 レース中

```text
RaceSimulator.loop()
  ↓
RaceSimulator.tick()
  ↓
Renderer.draw()
  ↓
UI.updateRace()
```

## 7.5 レース終了時

```text
BettingSystem.settle()
  ↓
Game.finishRace()
  ↓
チップ更新
戦績更新
履歴更新
GameState.save()
  ↓
UI.result()
Router.go("result")
```

---

## 8. 状態管理

### 8.1 永続状態

`GameState.data`

内容:
- `chips`
- `stats`
- `settings`
- `raceHistory`

### 8.2 一時状態

`Game`

内容:
- `horses`
- `bets`
- `race`
- `stake`

### 8.3 各馬のリアルタイム状態

各馬は `live` オブジェクトを持ちます。

主な項目:
- `x`
- `speed`
- `energy`
- `rank`
- `events`
- `finished`
- `finishTime`

---

## 9. 画面別の役割

### 9.1 ホーム
- プレイヤーの入口
- チップと戦績の要約を表示

### 9.2 ガイド
- ルール説明

### 9.3 知識
- 教育コンテンツの表示

### 9.4 設定
- 音、速度、品質、初期条件の変更

### 9.5 ベッティング
- レース条件確認
- 所持チップ確認
- 馬分析
- 賭け登録

### 9.6 レース
- ゲーム体験の中心
- シミュレーションの可視化

### 9.7 結果
- 成績確認
- 収支確認
- 次レースへの導線

---

## 10. レスポンシブ設計

現在のレスポンシブ方針:

- モバイル:
  - 1 カラム
  - ベット入力は縦並び
  - Canvas 高さ 280px
- タブレット:
  - Canvas 高さ 340px
- デスクトップ:
  - 2 カラム馬カード
  - Canvas 高さ 420px

10 頭レースに合わせて、レーン数に応じて馬アイコンと馬名サイズを動的に縮小します。

---

## 11. 現在の実装上の特徴

### 良い点
- フレームワーク不要
- 役割別にファイル分離済み
- DOM とロジックがある程度分離されている
- 画面追加や機能追加がしやすい
- LocalStorage による継続プレイ対応

### 今後さらに改善できる点
- HTML をテンプレート化する
- `const` グローバル依存を ES Modules に移行する
- 連贏 / 三重彩の UI を完成させる
- レースイベント履歴を複数行で見せる
- テストコードを追加する
- サウンド表現を豊かにする
- 履歴一覧画面を追加する

---

## 12. 主要モジュール依存関係

```text
app.js
 ├─ GameState
 ├─ AudioEngine
 ├─ Renderer
 ├─ UI
 ├─ Router
 └─ Game

Game
 ├─ UncertaintySystem
 ├─ HorseEngine
 ├─ BettingSystem
 ├─ UI
 ├─ AudioEngine
 ├─ Router
 └─ GameState

RaceSimulator
 ├─ Game
 ├─ Renderer
 ├─ UI
 ├─ AudioEngine
 └─ Utils

UI
 ├─ Game
 ├─ GameState
 ├─ Knowledge
 └─ Utils
```

---

## 13. 開発時の推奨作業順

### 表示変更だけを行う場合
1. `horse_racing.html`
2. `css/`
3. `js/ui/ui.js`

### ゲームロジック変更を行う場合
1. `js/game/game.js`
2. `js/systems/`
3. `js/ui/ui.js`

### レース挙動を変更する場合
1. `js/systems/race-simulator.js`
2. `js/systems/horse-engine.js`
3. `js/systems/uncertainty-system.js`
4. `js/ui/renderer.js`

### 設定値を増やす場合
1. `js/core/game-state.js`
2. `horse_racing.html`
3. `js/app.js`
4. 必要なら `js/systems/` 側で使用

---

## 14. 保守上の注意点

1. JavaScript は `<script>` の読み込み順に依存しています。  
   新しいファイルを追加するときは、依存関係を確認してください。

2. `GameState.data.settings` に新しい設定を足すときは、  
   `defaults()` と設定画面の両方を更新してください。

3. `HorseEngine.generate()` は 10 頭構成を前提にしています。  
   頭数を変更する場合、色配列、Canvas 表示、ゲームバランスも同時に確認してください。

4. `RaceSimulator.tick()` は複数の補正を乗算しているため、  
   1 か所の変更が全体バランスに大きく影響します。

5. HTML を完全に分割するには、  
   `fetch()` ベースのテンプレート読み込みやサーバー配信が必要になります。  
   現在の「静的 HTML を直接開く」運用とは相性を見て判断してください。

---

## 15. まとめ

このプロジェクトは現在、次のような性格を持つコードベースです。

- 小規模だが責務分離が明確
- 純フロントエンドながら、状態管理・シミュレーション・UI が整理されている
- 教育コンテンツとゲーム性を同居させた構成
- 将来的に機能拡張しやすい土台を持つ

今後は、  
「見た目を磨く」  
「ゲームロジックを深くする」  
「コードをさらにモジュール化する」  
のどの方向にも進みやすい状態です。
